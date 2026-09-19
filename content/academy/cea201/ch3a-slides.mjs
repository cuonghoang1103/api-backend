/**
 * CEA201 · Chương 3 — A Top-Level View of Computer Function and Interconnection,
 * học theo từng slide: PHẦN A (slide 1–23) — chu trình lệnh & cơ chế ngắt.
 * Deck 'cea3' (CEA3), 46 slide, ảnh đã render lên CDN images/academy/CEA201/v1/cea3/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH03-COA11e.pptx của trường (/tmp/cea201-text/cea3.txt, slide 1→23).
 * Bộ slide CHÍNH HÃNG đi kèm Stallings, "Computer Organization and Architecture:
 * Designing for Performance", 11th Edition Global Edition (Pearson, 2022), tỉ lệ 4:3.
 * Các slide chỉ có "Figure 3.x" (3, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 23)
 * đã được đọc THẲNG TỪ ẢNH đã render để lấy đúng từng nhãn trong sơ đồ.
 *
 * Mọi con số trong bài đã kiểm bằng python3:
 *   · nhịp CPU 3 GHz = 0,3333 ns; đĩa 10 ms ⇒ tỉ lệ 3,0 × 10^7 = 30 triệu lần.
 *   · Figure 3.10 (chờ I/O ngắn), ví dụ tự dựng: không ngắt 420, có ngắt 320 ⇒ tiết kiệm 23,8 %.
 *   · Figure 3.11 (chờ I/O dài), cùng ví dụ: không ngắt 1320, có ngắt 1120 ⇒ tiết kiệm 15,2 %.
 *   · Figure 3.5: 0003h + 0002h = 0005h.
 *   · Figure 3.14: khối lượng ISR suy từ chính hình (máy in 10, truyền thông 10, đĩa 10 = 30 đơn vị),
 *     nên bảng "tuần tự" dựng lại được và cả hai cách đều kết thúc ở t = 40 — khác nhau ở ĐỘ TRỄ.
 *
 * Chỗ SLIDE/HÌNH GỐC dễ gây hiểu nhầm — đã nêu rõ trong bài, KHÔNG im lặng chép lại:
 *   · slide 11 (Figure 3.5) vẽ PC = 300 ở Step 1 rồi mới thành 301 ở Step 2. Thực tế PC được
 *     tăng NGAY TRONG chu kỳ nạp; hình chụp trạng thái ở hai thời điểm khác nhau của cùng một bước.
 *   · slide 21 (Figure 3.14) KHÔNG ghi nhãn t = 20 (lúc ngắt đĩa tới) — con số đó nằm trong phần
 *     chữ của sách, hình chỉ ghi t = 25 là lúc CPU chuyển sang phục vụ đĩa. Không phải hình sai,
 *     nhưng đọc hình mà không đọc sách thì mất mất một dữ kiện.
 *   · slide 12 (Figure 3.6) vẽ HAI vòng tròn cùng tên "Operand address calculation" — một cho toán
 *     hạng vào, một cho kết quả ra. Không phải lỗi in, mà là cùng một VIỆC làm ở hai chỗ.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea3';

export default {
  title: '3.0a — Slide by slide: The instruction cycle and interrupts (slides 1–23)|||3.0a — Slide bài giảng: Chu trình lệnh & cơ chế ngắt (slide 1–23)',
  slug: 'cea201-3-0a-slides-chu-trinh-lenh-ngat',
  type: 'DOCUMENT',
  description: 'Nửa đầu Chương 3 của CEA201 (slide 1–23) theo đúng bộ slide chính hãng Stallings 11th Edition: ba ý cốt lõi của kiến trúc von Neumann và bước nhảy từ "đi dây lại" sang "nạp chương trình"; bốn thanh ghi MAR · MBR · PC · IR làm việc ở vi bước nào; chu trình lệnh nạp–thi hành với bảng vết ĐẦY ĐỦ sáu bước của ví dụ kinh điển nạp 940 — cộng 941 — ghi 941 (Figure 3.5); sơ đồ trạng thái chu trình lệnh; rồi toàn bộ cơ chế NGẮT — vì sao cần (đĩa chậm hơn một nhịp CPU 30 triệu lần, đo thật), bốn lớp ngắt, trình tự lưu PC và PSW, sơ đồ thời gian chờ I/O ngắn và dài kèm phần trăm tiết kiệm tính tay, và hai bảng thời gian đối chiếu ngắt TUẦN TỰ với ngắt LỒNG NHAU trên đúng ví dụ ba ngắt của Figure 3.14. Kết phần ở chức năng I/O, DMA và ba mô-đun của Figure 3.15.',
  content: [
    walkHead(D, 1, 23),
    walk(D, [

      [1, 'Computer Organization and Architecture — 11th Edition, Chapter 3: A Top-Level View of Computer Function and Interconnection',
        `<p class="y-chinh">🎯 The title slide of the chapter that finally makes the machine <em>move</em>. Chapters 1–2 described what a computer is made of and how fast it runs; Chapter 3 answers the question those chapters left open: <strong>what does the machine actually do, step by step, from the moment power is on?</strong></p>
<ul>
<li><strong>Read the title as two promises</strong> — "Computer <strong>Function</strong>" is the first half (slides 2–23): the instruction cycle, and interrupts. "<strong>Interconnection</strong>" is the second half (slides 24–46): buses, QPI, PCI Express. This walkthrough covers the first half only.</li>
<li><strong>"Top-Level View" means one level of the hierarchy</strong> — Chapter 1 taught you that a computer is a hierarchy and that you describe one level at a time. This chapter stays at the level of <em>CPU · memory · I/O module · the interconnection between them</em>. It does not open the CPU (that is Chapter 16) and does not open memory (Chapters 4–6).</li>
<li><strong>Why this is the single most examined chapter of CEA201</strong> — the instruction cycle and interrupt handling are procedures, and procedures can be asked as "trace this", "draw this", "order these steps". Slides 10–11 alone generate a whole family of exam questions.</li>
<li><strong>Where you have met this before</strong> — CSI106 chapter 5 told you an operating system uses interrupts and schedules processes. It did not tell you what an interrupt <em>is</em> in hardware. This chapter does, and it does it with timing diagrams you can compute.</li>
<li><strong>Where it is going</strong> — every mechanism here is deepened later: Chapter 7 (I/O) turns "interrupt-driven I/O" and DMA into full techniques; Chapter 16 turns the instruction cycle into a pipeline; Chapter 9 shows how the OS builds process switching on top of the interrupt.</li>
</ul>
<p class="meo">💡 Keep a blank page beside you for this chapter and draw three things on it as you go: the fetch–execute loop (slide 7), the same loop with an interrupt cycle bolted on (slide 16), and the state diagram (slide 19). Those three drawings <em>are</em> the chapter.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề của chương làm cho cỗ máy bắt đầu <em>chuyển động</em>. Chương 1–2 tả máy tính gồm những gì và chạy nhanh chừng nào; Chương 3 trả lời câu hỏi hai chương ấy còn bỏ ngỏ: <strong>máy THỰC SỰ làm gì, từng bước một, kể từ lúc bật điện?</strong></p>
<ul>
<li><strong>Đọc tên chương như hai lời hứa</strong> — "Computer <strong>Function</strong>" (chức năng) là nửa đầu (slide 2–23): chu trình lệnh và cơ chế ngắt. "<strong>Interconnection</strong>" (liên kết) là nửa sau (slide 24–46): bus, QPI, PCI Express. Bài này chỉ đi hết nửa đầu.</li>
<li><strong>"Top-Level View" nghĩa là ĐÚNG MỘT tầng của phân cấp</strong> — Chương 1 đã dạy máy tính là một hệ phân cấp và mỗi lúc chỉ tả một tầng. Chương này đứng yên ở tầng <em>CPU · bộ nhớ · mô-đun I/O · đường nối giữa chúng</em>. Nó KHÔNG mở CPU ra (việc đó của Chương 16) và KHÔNG mở bộ nhớ ra (Chương 4–6).</li>
<li><strong>Vì sao đây là chương bị hỏi nhiều nhất CEA201</strong> — chu trình lệnh và xử lý ngắt là những QUY TRÌNH, mà quy trình thì ra đề được dưới dạng "chạy tay đi", "vẽ lại đi", "sắp thứ tự các bước". Riêng slide 10–11 đẻ ra cả một họ câu hỏi thi.</li>
<li><strong>Chỗ bạn đã gặp trước đây</strong> — CSI106 chương 5 nói hệ điều hành dùng ngắt và lập lịch tiến trình, nhưng không nói ngắt LÀ CÁI GÌ ở tầng phần cứng. Chương này nói, và nói bằng những sơ đồ thời gian bạn tính tay được.</li>
<li><strong>Chỗ nó đi tới</strong> — mọi cơ chế ở đây đều được đào sâu về sau: Chương 7 (I/O) biến "I/O điều khiển bằng ngắt" và DMA thành kỹ thuật đầy đủ; Chương 16 biến chu trình lệnh thành ống lệnh (pipeline); Chương 9 cho thấy hệ điều hành dựng việc chuyển tiến trình ngay trên lưng cái ngắt.</li>
</ul>
<p class="meo">💡 Để sẵn một tờ giấy trắng cạnh bên khi học chương này và vừa học vừa vẽ ba thứ: vòng lặp nạp–thi hành (slide 7), cũng vòng lặp đó gắn thêm chu kỳ ngắt (slide 16), và sơ đồ trạng thái (slide 19). Ba hình vẽ ấy CHÍNH LÀ cả chương.</p>`],

      [2, 'Computer Components — the von Neumann architecture',
        `<p class="y-chinh">🎯 The foundation slide: contemporary computer designs are based on concepts developed by <strong>John von Neumann</strong> at the Institute for Advanced Studies, Princeton, and that <em>von Neumann architecture</em> rests on exactly <strong>three key concepts</strong>.</p>
<table>
<tr><th>#</th><th>The slide's own words</th><th>What it rules out</th></tr>
<tr><td>1</td><td><strong>Data and instructions are stored in a single read–write memory</strong></td><td>Rules out separate program memory; the program is data, so a program can be loaded, replaced, even generated by another program</td></tr>
<tr><td>2</td><td><strong>The contents of this memory are addressable by location, without regard to the type of data contained there</strong></td><td>Rules out the memory "knowing" what a word means; address 940 is just a number, its meaning comes from which instruction reads it</td></tr>
<tr><td>3</td><td><strong>Execution occurs in a sequential fashion (unless explicitly modified) from one instruction to the next</strong></td><td>Rules out "run everything at once"; the default is one after another, and a branch is an explicit exception</td></tr>
</table>
<ul>
<li><strong>The other half of the slide is the alternative being rejected</strong> — a <strong>hardwired program</strong> is defined as "the result of the process of connecting the various components in the desired configuration". Programming the ENIAC meant physically rewiring it: days of work with plugs and switches for one problem.</li>
<li><strong>Why concept 1 is the revolutionary one.</strong> If instructions live in the same read–write memory as data, changing the program is just <em>writing numbers into memory</em> — a few microseconds instead of a few days. Every compiler, every OS loader, every time you double-click an icon, depends on that one idea.</li>
<li><strong>Concept 2 is the reason the program counter works at all.</strong> Because memory is addressed by location and not by type, "the next instruction" is simply "the word at the next address" — so a single counting register (the PC, slide 8) is enough to drive the whole machine.</li>
<li><strong>Concept 3 is the assumption the rest of the book keeps attacking.</strong> Sequential execution is the <em>model</em>; pipelines (Ch.16), superscalar (Ch.18) and multicore (Ch.21) all break it in hardware while pretending, to the programmer, that it still holds. Knowing the promise is what lets you appreciate the cheating.</li>
<li><strong>The price of concept 1, worth naming now</strong> — one memory for both instructions and data means one road to it, so the processor cannot fetch an instruction and a datum in the same instant. That congestion has a name, the <em>von Neumann bottleneck</em>, and it is the reason caches exist.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: "von Neumann architecture" is not the same as "there are four components". The three key concepts are the answer to "state the von Neumann concepts", and the examiner is counting: single read–write memory for BOTH · addressable by location regardless of type · sequential execution unless explicitly modified. Missing "unless explicitly modified" loses the mark, because without branches nothing could ever loop.</p>`,
        `<p class="y-chinh">🎯 Slide nền móng: mọi thiết kế máy tính đương đại đều dựa trên các khái niệm do <strong>John von Neumann</strong> phát triển tại Institute for Advanced Studies, Princeton, và cái <em>kiến trúc von Neumann</em> ấy đứng trên đúng <strong>ba ý cốt lõi</strong>.</p>
<table>
<tr><th>#</th><th>Nguyên văn của slide</th><th>Nó LOẠI BỎ điều gì</th></tr>
<tr><td>1</td><td><strong>Dữ liệu và lệnh cùng được lưu trong MỘT bộ nhớ đọc–ghi duy nhất</strong></td><td>Loại bỏ chuyện có một bộ nhớ chương trình riêng; chương trình cũng là dữ liệu, nên nạp được, thay được, thậm chí do một chương trình khác sinh ra</td></tr>
<tr><td>2</td><td><strong>Nội dung bộ nhớ được đánh địa chỉ theo VỊ TRÍ, bất kể loại dữ liệu chứa trong đó</strong></td><td>Loại bỏ chuyện bộ nhớ "biết" một từ nhớ nghĩa là gì; địa chỉ 940 chỉ là một con số, ý nghĩa do LỆNH NÀO đọc nó quyết định</td></tr>
<tr><td>3</td><td><strong>Việc thi hành diễn ra TUẦN TỰ (trừ khi bị đổi tường minh) từ lệnh này sang lệnh kế</strong></td><td>Loại bỏ chuyện "chạy hết cùng lúc"; mặc định là lần lượt, còn lệnh rẽ nhánh là một ngoại lệ được khai báo rõ</td></tr>
</table>
<ul>
<li><strong>Nửa còn lại của slide chính là cái bị bác bỏ</strong> — <strong>hardwired program</strong> (chương trình đi dây cứng) được định nghĩa là "kết quả của quá trình nối các thành phần lại theo đúng cấu hình mong muốn". Lập trình cho ENIAC nghĩa là đi dây lại thật sự: mấy ngày trời cắm phích và gạt công tắc cho MỘT bài toán.</li>
<li><strong>Vì sao ý thứ 1 mới là cuộc cách mạng.</strong> Nếu lệnh nằm cùng một bộ nhớ đọc–ghi với dữ liệu, thì đổi chương trình chỉ còn là <em>ghi mấy con số vào bộ nhớ</em> — vài micro giây thay vì vài ngày. Mọi trình biên dịch, mọi bộ nạp của hệ điều hành, mọi lần bạn bấm đúp một biểu tượng, đều sống nhờ đúng ý đó.</li>
<li><strong>Ý thứ 2 là lý do bộ đếm chương trình chạy được.</strong> Vì bộ nhớ đánh địa chỉ theo vị trí chứ không theo kiểu, "lệnh kế tiếp" chỉ đơn giản là "từ nhớ ở địa chỉ kế tiếp" — nên một thanh ghi biết đếm (PC, slide 8) là đủ để kéo cả cỗ máy đi.</li>
<li><strong>Ý thứ 3 là giả định mà cả cuốn sách còn lại liên tục tấn công.</strong> Thi hành tuần tự là cái <em>mô hình</em>; ống lệnh (Ch.16), superscalar (Ch.18) và đa lõi (Ch.21) đều phá nó ở phần cứng trong khi vẫn giả vờ với lập trình viên rằng nó còn nguyên. Biết lời hứa là gì thì mới thấy được chỗ máy "ăn gian".</li>
<li><strong>Cái giá của ý thứ 1, nên gọi tên ngay</strong> — một bộ nhớ chung cho cả lệnh lẫn dữ liệu nghĩa là một con đường duy nhất tới nó, nên bộ xử lý không thể vừa nạp lệnh vừa nạp số liệu trong cùng một khoảnh khắc. Chỗ tắc đường ấy có tên riêng: <em>nút cổ chai von Neumann</em>, và nó chính là lý do cache ra đời.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề: "kiến trúc von Neumann" KHÔNG đồng nghĩa với "máy tính có bốn thành phần". Ba ý cốt lõi mới là đáp án cho câu "nêu các khái niệm von Neumann", và người chấm đếm đủ ba: một bộ nhớ đọc–ghi chung cho CẢ HAI · đánh địa chỉ theo vị trí bất kể kiểu · thi hành tuần tự trừ khi bị đổi tường minh. Thiếu vế "trừ khi bị đổi tường minh" là mất điểm, vì không có rẽ nhánh thì không gì lặp được.</p>`],

      [3, 'Figure 3.1 — Hardware and Software Approaches',
        `<p class="y-chinh">🎯 Two boxes, and the whole reason computers are general-purpose machines. <strong>(a) Programming in hardware:</strong> Data → a box labelled "Sequence of arithmetic and logic functions" → Results. <strong>(b) Programming in software:</strong> Instruction codes → "Instruction interpreter" → <em>Control signals</em> → "General-purpose arithmetic and logic functions", which also takes Data and produces Results.</p>
<table>
<tr><th></th><th>(a) Programming in hardware</th><th>(b) Programming in software</th></tr>
<tr><td>What is fixed</td><td>The <strong>sequence</strong> of operations — it is built into the wiring</td><td>The <strong>set</strong> of possible operations — the ALU can do all of them</td></tr>
<tr><td>What changes per problem</td><td>The wiring itself</td><td>Only the <strong>instruction codes</strong> fed in from memory</td></tr>
<tr><td>Cost of a new program</td><td>Rewire: hours or days</td><td>Write new codes: microseconds</td></tr>
<tr><td>Inputs to the figure</td><td>Data only</td><td><strong>Instruction codes AND Data</strong> — two separate arrows</td></tr>
</table>
<ul>
<li><strong>Read the thick arrow, it is the point of the figure.</strong> The heavy vertical arrow from the interpreter to the ALU is labelled <em>Control signals</em>. That is the whole trick: instruction codes are not fed to the arithmetic hardware, they are fed to an <strong>interpreter</strong> which turns them into control signals that <em>configure</em> general-purpose hardware, moment by moment. Software becomes, literally, a rapid sequence of temporary rewirings.</li>
<li><strong>The box in (a) is not stupid, it is fast.</strong> Hardwiring is still how GPUs, video codecs and crypto accelerators work — fixed function, enormous throughput. The figure is not saying (b) beats (a); it is saying (b) buys <em>generality</em>, and generality is what turned a calculator into a computer.</li>
<li><strong>The two boxes of (b) are the two boxes of the CPU you already know</strong> — "Instruction interpreter" is the <strong>control unit</strong>, "general-purpose arithmetic and logic functions" is the <strong>ALU</strong>. Chapter 1 slide 8 listed them; this figure explains why there must be exactly these two and not one.</li>
<li><strong>This is the Chapter 1 multiply example, drawn.</strong> Whether MUL is a dedicated circuit (approach a) or a microprogram driving a general ALU (approach b) is invisible to the program — organization, not architecture.</li>
</ul>
<p class="meo">💡 One sentence for the exam: <strong>hardware programming fixes the sequence and varies the wiring; software programming fixes the wiring and varies the sequence.</strong></p>`,
        `<p class="y-chinh">🎯 Hai cái hộp, và trọn vẹn lý do máy tính là cỗ máy VẠN NĂNG. <strong>(a) Lập trình bằng phần cứng:</strong> Data → hộp "Sequence of arithmetic and logic functions" (một dãy phép số học và logic đã định sẵn) → Results. <strong>(b) Lập trình bằng phần mềm:</strong> Instruction codes → "Instruction interpreter" (bộ thông dịch lệnh) → <em>Control signals</em> → "General-purpose arithmetic and logic functions", hộp này nhận thêm Data và cho ra Results.</p>
<table>
<tr><th></th><th>(a) Lập trình bằng phần cứng</th><th>(b) Lập trình bằng phần mềm</th></tr>
<tr><td>Cái gì bị ĐÓNG CỨNG</td><td><strong>Trình tự</strong> các phép — nó nằm trong cách đi dây</td><td><strong>Tập</strong> các phép làm được — ALU làm được hết</td></tr>
<tr><td>Cái gì đổi theo từng bài toán</td><td>Chính cách đi dây</td><td>Chỉ có <strong>mã lệnh</strong> đưa vào từ bộ nhớ</td></tr>
<tr><td>Giá của một chương trình mới</td><td>Đi dây lại: hàng giờ hoặc hàng ngày</td><td>Viết mã mới: vài micro giây</td></tr>
<tr><td>Đầu vào trong hình</td><td>Chỉ có Data</td><td><strong>Instruction codes VÀ Data</strong> — hai mũi tên tách nhau</td></tr>
</table>
<ul>
<li><strong>Hãy đọc kỹ mũi tên ĐẬM, đó mới là ý của hình.</strong> Mũi tên dọc to đùng từ bộ thông dịch xuống ALU mang nhãn <em>Control signals</em>. Toàn bộ mẹo nằm ở đó: mã lệnh KHÔNG được đưa thẳng vào phần cứng tính toán, nó được đưa vào một <strong>bộ thông dịch</strong>, và bộ này biến nó thành tín hiệu điều khiển để <em>cấu hình</em> phần cứng vạn năng, từng khoảnh khắc một. Phần mềm, theo nghĩa đen, chính là một chuỗi "đi dây lại tạm thời" cực nhanh.</li>
<li><strong>Cái hộp ở (a) không ngu, nó NHANH.</strong> Đi dây cứng tới nay vẫn là cách GPU, bộ giải mã video và chip mã hoá làm việc — chức năng cố định, thông lượng khổng lồ. Hình không nói (b) thắng (a); hình nói (b) mua được <em>tính vạn năng</em>, và chính tính vạn năng biến một cái máy tính bỏ túi thành một cái máy tính.</li>
<li><strong>Hai hộp ở (b) đúng là hai hộp trong CPU bạn đã biết</strong> — "Instruction interpreter" chính là <strong>khối điều khiển</strong>, "general-purpose arithmetic and logic functions" chính là <strong>ALU</strong>. Chương 1 slide 8 đã liệt kê hai cái đó; hình này giải thích vì sao BẮT BUỘC phải có đúng hai chứ không phải một.</li>
<li><strong>Đây chính là ví dụ lệnh nhân của Chương 1, được vẽ ra.</strong> MUL là một mạch nhân riêng (cách a) hay một vi chương trình điều khiển ALU chung (cách b) thì chương trình không nhìn thấy — đó là tổ chức, không phải kiến trúc.</li>
</ul>
<p class="meo">💡 Một câu để mang vào phòng thi: <strong>lập trình phần cứng thì cố định trình tự và đổi cách đi dây; lập trình phần mềm thì cố định cách đi dây và đổi trình tự.</strong></p>`],

      [4, 'Software and I/O Components',
        `<p class="y-chinh">🎯 The slide turns Figure 3.1(b) into a definition and a parts list. <strong>Software = a sequence of codes or instructions</strong>; part of the hardware interprets each instruction and generates control signals; and the payoff is that you <em>provide a new sequence of codes for each new program instead of rewiring the hardware</em>.</p>
<table>
<tr><th>Major component</th><th>Sub-parts named on the slide</th><th>Job</th></tr>
<tr><td rowspan="2"><strong>CPU</strong></td><td>Instruction interpreter</td><td>Decode each code, emit control signals</td></tr>
<tr><td>Module of general-purpose arithmetic and logic functions</td><td>Actually compute</td></tr>
<tr><td rowspan="2"><strong>I/O Components</strong></td><td><strong>Input module</strong></td><td>Contains basic components for <em>accepting data and instructions</em> and converting them into an internal form of signals usable by the system</td></tr>
<tr><td><strong>Output module</strong></td><td>Means of reporting results</td></tr>
</table>
<ul>
<li><strong>Do not skim the words "and instructions" in the input module.</strong> The input module accepts <em>data AND instructions</em> — that is von Neumann concept 1 showing up as a hardware requirement. If the machine could only input data, you could never load a program; the program would have to be wired in, and we are back to Figure 3.1(a).</li>
<li><strong>"Converting them into an internal form of signals usable by the system" is the honest job description of every device driver's hardware half.</strong> A key press is a mechanical contact; the keyboard controller converts it into a scan code, a pattern of bits on a bus. Nothing inside the machine has ever seen a key.</li>
<li><strong>Software is defined by what it is made of, not by what it does.</strong> "A sequence of codes or instructions" — no mention of purpose, language or file format. That definition is deliberately mechanical, because at this level of the hierarchy a word of memory is a word of memory.</li>
<li><strong>Connect to PRF192.</strong> Your C source is not software by this definition — it is text. It becomes software when the compiler turns it into a sequence of codes that this particular instruction interpreter understands. Compile the same source for ARM and x86 and you get two different sequences of codes for one program.</li>
<li><strong>Input + output are counted as ONE component of the machine</strong> ("I/O"), as in Chapter 1, but they are split into two <em>modules</em> here. Keep the two levels straight: one component, two modules.</li>
</ul>
<p class="pitfall">⚠️ A frequent wrong answer: "the input module converts data into a form the user can understand". Backwards. Input converts the <strong>external</strong> form into the <strong>internal</strong> form; the output module does the reverse. The slide's own phrase is "internal form of signals usable by the system".</p>`,
        `<p class="y-chinh">🎯 Slide biến Figure 3.1(b) thành một định nghĩa và một bảng kê linh kiện. <strong>Phần mềm = một dãy mã hay lệnh</strong>; một phần của phần cứng thông dịch từng lệnh và sinh ra tín hiệu điều khiển; và phần thưởng là bạn <em>cấp một dãy mã mới cho mỗi chương trình mới thay vì đi dây lại phần cứng</em>.</p>
<table>
<tr><th>Thành phần chính</th><th>Bộ phận con slide nêu tên</th><th>Việc</th></tr>
<tr><td rowspan="2"><strong>CPU</strong></td><td>Bộ thông dịch lệnh (instruction interpreter)</td><td>Giải mã từng mã lệnh, phát tín hiệu điều khiển</td></tr>
<tr><td>Khối các phép số học và logic vạn năng</td><td>Tính thật</td></tr>
<tr><td rowspan="2"><strong>Thành phần I/O</strong></td><td><strong>Mô-đun vào (Input module)</strong></td><td>Chứa các bộ phận cơ bản để <em>nhận dữ liệu VÀ LỆNH</em> rồi chuyển chúng thành dạng tín hiệu bên trong mà hệ thống dùng được</td></tr>
<tr><td><strong>Mô-đun ra (Output module)</strong></td><td>Phương tiện để báo kết quả ra ngoài</td></tr>
</table>
<ul>
<li><strong>Đừng lướt qua hai chữ "và lệnh" trong mô-đun vào.</strong> Mô-đun vào nhận <em>dữ liệu VÀ LỆNH</em> — đó chính là ý von Neumann số 1 hiện ra dưới dạng một đòi hỏi phần cứng. Nếu máy chỉ nhận được dữ liệu thì bạn không bao giờ nạp được chương trình; chương trình sẽ phải đi dây vào, và ta quay về Figure 3.1(a).</li>
<li><strong>"Chuyển thành dạng tín hiệu bên trong mà hệ thống dùng được" là mô tả trung thực cho nửa phần cứng của mọi trình điều khiển thiết bị.</strong> Một cú gõ phím là một tiếp điểm cơ khí; bộ điều khiển bàn phím biến nó thành một mã quét, tức một mẫu bit trên bus. Bên trong máy chưa từng có gì nhìn thấy một cái phím.</li>
<li><strong>Phần mềm được định nghĩa bằng CHẤT LIỆU của nó, không bằng việc nó làm.</strong> "Một dãy mã hay lệnh" — không nhắc mục đích, không nhắc ngôn ngữ, không nhắc định dạng tệp. Định nghĩa ấy cố ý máy móc, vì ở tầng này của phân cấp thì một từ nhớ chỉ là một từ nhớ.</li>
<li><strong>Nối sang PRF192.</strong> Mã nguồn C của bạn, theo định nghĩa này, CHƯA phải phần mềm — nó là văn bản. Nó thành phần mềm khi trình biên dịch biến nó thành một dãy mã mà đúng bộ thông dịch lệnh này hiểu được. Biên dịch cùng một mã nguồn cho ARM và cho x86 thì được hai dãy mã khác nhau cho cùng một chương trình.</li>
<li><strong>Vào và ra được đếm là MỘT thành phần của máy</strong> ("I/O"), y như Chương 1, nhưng ở đây chúng được tách thành hai <em>mô-đun</em>. Giữ cho rành hai tầng: một thành phần, hai mô-đun.</li>
</ul>
<p class="pitfall">⚠️ Một câu trả lời sai rất hay gặp: "mô-đun vào chuyển dữ liệu thành dạng người dùng hiểu được". Ngược rồi. Mô-đun vào chuyển dạng <strong>bên ngoài</strong> thành dạng <strong>bên trong</strong>; mô-đun ra mới làm chiều ngược lại. Nguyên văn của slide là "internal form of signals usable by the system".</p>`],

      [5, 'Memory, MAR, and MBR — the four interface registers',
        `<p class="y-chinh">🎯 Four boxes in a cross, and they are the <strong>gateway registers</strong>: two for talking to memory, two for talking to I/O. Nothing leaves or enters the CPU without passing through one of them.</p>
<table>
<tr><th>Register</th><th>Full name</th><th>The slide's own words</th><th>Carries</th></tr>
<tr><td><strong>MAR</strong></td><td>Memory address register</td><td>Specifies the <strong>address in memory</strong> for the next read or write</td><td>An address → out to the address bus</td></tr>
<tr><td><strong>MBR</strong></td><td>Memory buffer register</td><td>Contains the data to be <strong>written into</strong> memory, or receives the data <strong>read from</strong> memory</td><td>A word of data → both directions on the data bus</td></tr>
<tr><td><strong>I/OAR</strong></td><td>I/O address register</td><td>Specifies a <strong>particular I/O device</strong></td><td>A device/port number</td></tr>
<tr><td><strong>I/OBR</strong></td><td>I/O buffer register</td><td>Used for the <strong>exchange of data</strong> between an I/O module and the CPU</td><td>A word of data → both directions</td></tr>
</table>
<ul>
<li><strong>The cross layout encodes the pattern: ADDRESS on the left, DATA on the right; MEMORY on top, I/O on the bottom.</strong> Once you see that, you never have to memorise four things — you memorise two questions ("which side of the machine?" and "where or what?") and reconstruct the names.</li>
<li><strong>Why an address register must exist separately from a data register.</strong> The bus does two different jobs at the same instant: it must say <em>where</em> and carry <em>what</em>. Two jobs, two registers, and in Chapter 3's second half, two physically separate groups of bus lines (address bus and data bus, slides 26–27).</li>
<li><strong>MAR is write-only from memory's point of view, MBR is bidirectional.</strong> An address always travels CPU → memory. Data travels both ways, which is why MBR is called a <em>buffer</em>: it is the loading dock where a word waits, in either direction.</li>
<li><strong>Their widths are two different architectural facts.</strong> MAR width sets how much memory can be addressed (n bits → 2<sup>n</sup> locations); MBR width sets how much moves per access. A 32-bit MAR reaches 2<sup>32</sup> = about 4,29 × 10<sup>9</sup> addressable units — the origin of the famous 4 GB limit of 32-bit machines. Slides 26–27 return to exactly this.</li>
<li><strong>Note what is NOT here: PC and IR.</strong> MAR/MBR/I-OAR/I-OBR face <em>outward</em>, to memory and devices. PC and IR (slide 10) face <em>inward</em> — they hold where we are in the program and what we are doing. Four outward, two inward: that pairing is the cleanest way to hold all six in your head.</li>
</ul>
<p class="pitfall">⚠️ Classic exam confusion: MAR versus PC. Both hold addresses, and in the fetch step they briefly hold the <em>same</em> address — but PC holds the address of the next instruction <em>over the whole program</em>, while MAR holds whatever address is needed for the <em>very next memory access</em>, instruction or operand alike. Copy PC into MAR, never the other way round.</p>`,
        `<p class="y-chinh">🎯 Bốn cái hộp xếp thành chữ thập, và chúng là <strong>các thanh ghi CỬA NGÕ</strong>: hai cái để nói chuyện với bộ nhớ, hai cái để nói chuyện với I/O. Không thứ gì ra vào CPU mà không đi qua một trong bốn cái đó.</p>
<table>
<tr><th>Thanh ghi</th><th>Tên đầy đủ</th><th>Nguyên văn của slide</th><th>Mang cái gì</th></tr>
<tr><td><strong>MAR</strong></td><td>Memory address register</td><td>Chỉ ra <strong>địa chỉ trong bộ nhớ</strong> cho lần đọc/ghi kế tiếp</td><td>Một địa chỉ → đi ra bus địa chỉ</td></tr>
<tr><td><strong>MBR</strong></td><td>Memory buffer register</td><td>Chứa dữ liệu sắp <strong>ghi vào</strong> bộ nhớ, hoặc nhận dữ liệu vừa <strong>đọc ra</strong> từ bộ nhớ</td><td>Một từ dữ liệu → cả hai chiều trên bus dữ liệu</td></tr>
<tr><td><strong>I/OAR</strong></td><td>I/O address register</td><td>Chỉ ra <strong>một thiết bị I/O cụ thể</strong></td><td>Số hiệu thiết bị / cổng</td></tr>
<tr><td><strong>I/OBR</strong></td><td>I/O buffer register</td><td>Dùng để <strong>trao đổi dữ liệu</strong> giữa một mô-đun I/O và CPU</td><td>Một từ dữ liệu → cả hai chiều</td></tr>
</table>
<ul>
<li><strong>Cách xếp chữ thập đã mã hoá sẵn quy luật: ĐỊA CHỈ bên trái, DỮ LIỆU bên phải; BỘ NHỚ ở trên, I/O ở dưới.</strong> Thấy được điều đó rồi thì không phải học thuộc bốn thứ nữa — chỉ cần nhớ hai câu hỏi ("phía nào của máy?" và "ở đâu hay cái gì?") là dựng lại được cả bốn cái tên.</li>
<li><strong>Vì sao phải có thanh ghi địa chỉ TÁCH RỜI thanh ghi dữ liệu.</strong> Bus làm hai việc khác nhau trong cùng một khoảnh khắc: nó phải nói <em>ở đâu</em> và phải chở <em>cái gì</em>. Hai việc, hai thanh ghi, và ở nửa sau Chương 3 là hai nhóm đường dây tách biệt về mặt vật lý (bus địa chỉ và bus dữ liệu, slide 26–27).</li>
<li><strong>MAR chỉ đi một chiều, MBR đi hai chiều.</strong> Địa chỉ luôn chạy CPU → bộ nhớ. Dữ liệu chạy cả hai chiều, và đó là lý do MBR được gọi là <em>buffer</em> (bộ đệm): nó là cái bến bốc dỡ nơi một từ nhớ đứng chờ, theo chiều nào cũng vậy.</li>
<li><strong>Độ rộng của hai cái là hai sự kiện kiến trúc khác nhau.</strong> Độ rộng MAR quyết định đánh địa chỉ được bao nhiêu bộ nhớ (n bit → 2<sup>n</sup> ô); độ rộng MBR quyết định mỗi lần truy nhập chuyển được bao nhiêu. MAR 32 bit với tới 2<sup>32</sup> ≈ 4,29 × 10<sup>9</sup> đơn vị địa chỉ — chính là gốc của cái giới hạn 4 GB khét tiếng của máy 32 bit. Slide 26–27 sẽ quay lại đúng chỗ này.</li>
<li><strong>Để ý thứ KHÔNG có ở đây: PC và IR.</strong> MAR/MBR/I-OAR/I-OBR quay mặt <em>ra ngoài</em>, về phía bộ nhớ và thiết bị. Còn PC và IR (slide 10) quay mặt <em>vào trong</em> — chúng giữ "ta đang ở đâu trong chương trình" và "ta đang làm gì". Bốn hướng ngoại, hai hướng nội: cặp đôi ấy là cách gọn nhất để giữ cả sáu cái trong đầu.</li>
</ul>
<p class="pitfall">⚠️ Nhầm lẫn kinh điển trong đề: MAR với PC. Cả hai đều chứa địa chỉ, và ở bước nạp lệnh chúng có lúc chứa <em>cùng một</em> địa chỉ — nhưng PC giữ địa chỉ lệnh kế tiếp <em>xuyên suốt cả chương trình</em>, còn MAR giữ bất cứ địa chỉ nào cần cho <em>lần truy nhập bộ nhớ ngay sau đây</em>, dù là lệnh hay toán hạng. Chép PC sang MAR, không bao giờ ngược lại.</p>`],

      [6, 'Figure 3.2 — Computer Components: Top-Level View',
        `<p class="y-chinh">🎯 The picture of the whole machine at the level this chapter works at: a <strong>CPU</strong> box holding PC, IR, MAR, MBR, I/O AR, I/O BR and an <em>Execution unit</em>; a <strong>Main Memory</strong> column addressed 0, 1, 2, … n−2, n−1 whose cells are marked <em>Instruction</em> near the top and <em>Data</em> further down; an <strong>I/O Module</strong> holding <em>Buffers</em>; and one thick <strong>System Bus</strong> joining all three.</p>
<table>
<tr><th>Register</th><th>Legend on the figure</th><th>Used in which micro-step of one instruction</th></tr>
<tr><td><strong>PC</strong></td><td>Program counter</td><td>Start of FETCH: its value is copied to MAR, then PC is incremented</td></tr>
<tr><td><strong>MAR</strong></td><td>Memory address register</td><td>Every memory access — first for the instruction address, later for the operand address</td></tr>
<tr><td><strong>MBR</strong></td><td>Memory buffer register</td><td>End of FETCH (word arrives) and during EXECUTE (operand in, result out)</td></tr>
<tr><td><strong>IR</strong></td><td>Instruction register</td><td>End of FETCH: the fetched word is moved MBR → IR and stays there for the whole execute cycle</td></tr>
<tr><td><strong>I/O AR / I/O BR</strong></td><td>I-O address / buffer register</td><td>Only when the instruction is an I/O instruction</td></tr>
</table>
<p class="dap-an">✅ One instruction, walked through the figure, micro-step by micro-step:<br>
<strong>1.</strong> MAR ← PC — the CPU announces which word it wants.<br>
<strong>2.</strong> address travels out on the System Bus; memory reads that cell.<br>
<strong>3.</strong> MBR ← M(MAR) — the word comes back over the bus into the buffer.<br>
<strong>4.</strong> IR ← MBR, and PC ← PC + 1 — the instruction is parked where the decoder can see it, and the counter already points at the next one.<br>
<strong>5.</strong> The execution unit decodes IR; if the instruction needs an operand, MAR ← address field of IR, and steps 2–3 repeat — this time the word that arrives in MBR is <em>data</em>, not an instruction.<br>
<strong>6.</strong> The execution unit computes; if the result must be stored, MBR ← result, MAR ← destination address, and the bus carries a write.</p>
<ul>
<li><strong>Look at the memory column: "Instruction" cells and "Data" cells are drawn in the same column, with the same address scale.</strong> That is von Neumann concept 1 and 2 drawn as a picture: the same memory, addressed the same way, and only the CPU's intention decides which is which.</li>
<li><strong>Everything crosses the one thick bus.</strong> CPU↔memory and CPU↔I/O share it. That single road is the von Neumann bottleneck made visible, and it is why the second half of this chapter (slides 24–46) is entirely about how to build, widen or replace it.</li>
<li><strong>The I/O module has "Buffers" for the same reason MBR exists</strong> — devices run at their own pace, so data must wait somewhere. Chapter 7 makes these buffers the centre of the story.</li>
<li><strong>Compare with Figure 1.1 of Chapter 1.</strong> Same four components, but Figure 1.1 showed <em>structure</em> (what is inside what) while Figure 3.2 shows <em>function</em> (which register holds what, in flight). Two pictures of one machine, answering the two questions Chapter 1 promised.</li>
</ul>
<p class="meo">💡 Learn the fetch as four register moves, in this order: <strong>MAR ← PC · MBR ← M(MAR) · IR ← MBR · PC ← PC + 1</strong>. Every exam version of "describe the fetch cycle" is that line, with words around it.</p>`,
        `<p class="y-chinh">🎯 Bức ảnh của cả cỗ máy ở đúng tầng mà chương này làm việc: một hộp <strong>CPU</strong> chứa PC, IR, MAR, MBR, I/O AR, I/O BR và một <em>Execution unit</em> (khối thi hành); một cột <strong>Main Memory</strong> đánh địa chỉ 0, 1, 2, … n−2, n−1 với các ô ghi <em>Instruction</em> ở phía trên và <em>Data</em> ở phía dưới; một <strong>I/O Module</strong> chứa <em>Buffers</em>; và một <strong>System Bus</strong> to đậm nối cả ba.</p>
<table>
<tr><th>Thanh ghi</th><th>Chú giải trên hình</th><th>Dùng ở VI BƯỚC nào của một lệnh</th></tr>
<tr><td><strong>PC</strong></td><td>Program counter — bộ đếm chương trình</td><td>Mở đầu NẠP: giá trị của nó được chép sang MAR, rồi PC tăng lên</td></tr>
<tr><td><strong>MAR</strong></td><td>Memory address register</td><td>Mọi lần truy nhập bộ nhớ — đầu tiên là địa chỉ lệnh, sau đó là địa chỉ toán hạng</td></tr>
<tr><td><strong>MBR</strong></td><td>Memory buffer register</td><td>Cuối bước NẠP (từ nhớ về tới) và trong bước THI HÀNH (toán hạng vào, kết quả ra)</td></tr>
<tr><td><strong>IR</strong></td><td>Instruction register</td><td>Cuối bước NẠP: từ vừa nạp chuyển MBR → IR và nằm đó suốt cả chu kỳ thi hành</td></tr>
<tr><td><strong>I/O AR / I/O BR</strong></td><td>Thanh ghi địa chỉ / đệm I-O</td><td>Chỉ khi lệnh là lệnh vào/ra</td></tr>
</table>
<p class="dap-an">✅ Một lệnh, đi bộ qua hình, từng vi bước:<br>
<strong>1.</strong> MAR ← PC — CPU tuyên bố nó muốn từ nhớ nào.<br>
<strong>2.</strong> địa chỉ đi ra System Bus; bộ nhớ đọc ô đó.<br>
<strong>3.</strong> MBR ← M(MAR) — từ nhớ theo bus về nằm trong bộ đệm.<br>
<strong>4.</strong> IR ← MBR, và PC ← PC + 1 — lệnh được đỗ vào chỗ mà bộ giải mã nhìn thấy, còn bộ đếm thì đã trỏ sang lệnh kế.<br>
<strong>5.</strong> Khối thi hành giải mã IR; nếu lệnh cần toán hạng thì MAR ← trường địa chỉ của IR, và bước 2–3 lặp lại — lần này thứ về tới MBR là <em>dữ liệu</em>, không phải lệnh.<br>
<strong>6.</strong> Khối thi hành tính; nếu phải ghi kết quả thì MBR ← kết quả, MAR ← địa chỉ đích, và bus chở một lượt ghi.</p>
<ul>
<li><strong>Nhìn cột bộ nhớ: ô "Instruction" và ô "Data" được vẽ CHUNG một cột, chung một thang địa chỉ.</strong> Đó là ý von Neumann số 1 và số 2 được vẽ thành tranh: cùng một bộ nhớ, đánh địa chỉ y như nhau, và chỉ có Ý ĐỊNH của CPU mới quyết định cái nào là cái nào.</li>
<li><strong>Mọi thứ đều phải băng qua đúng một cái bus đậm ấy.</strong> CPU↔bộ nhớ và CPU↔I/O dùng chung nó. Con đường độc đạo đó chính là nút cổ chai von Neumann hiện hình, và đó là lý do nửa sau chương này (slide 24–46) dành trọn để bàn cách dựng, nới rộng hay thay thế nó.</li>
<li><strong>Mô-đun I/O có "Buffers" vì đúng cái lý do MBR tồn tại</strong> — thiết bị chạy theo nhịp riêng của nó, nên dữ liệu phải có chỗ chờ. Chương 7 sẽ đặt mấy cái đệm này vào giữa câu chuyện.</li>
<li><strong>So với Figure 1.1 của Chương 1.</strong> Vẫn bốn thành phần ấy, nhưng Figure 1.1 vẽ <em>cấu trúc</em> (cái gì nằm trong cái gì) còn Figure 3.2 vẽ <em>chức năng</em> (thanh ghi nào đang giữ cái gì, lúc đang chạy). Hai bức hình của một cỗ máy, trả lời đúng hai câu hỏi Chương 1 đã hứa.</li>
</ul>
<p class="meo">💡 Học bước nạp lệnh thành bốn phép chuyển thanh ghi, đúng thứ tự này: <strong>MAR ← PC · MBR ← M(MAR) · IR ← MBR · PC ← PC + 1</strong>. Mọi biến thể đề thi của câu "mô tả chu kỳ nạp lệnh" đều là dòng đó, có thêm chữ bọc quanh.</p>`],

      [7, 'Figure 3.3 — Basic Instruction Cycle',
        `<p class="y-chinh">🎯 The simplest true picture of what a computer does: <strong>START → Fetch Next Instruction → Execute Instruction → (loop back) … → HALT</strong>. Two boxes and one arrow going backwards. That backwards arrow is the entire reason a machine can run a program of a million instructions using hardware that only understands one at a time.</p>
<table>
<tr><th>Part of the figure</th><th>Label</th><th>What happens</th></tr>
<tr><td>Left rounded box</td><td><strong>START</strong></td><td>Power-on / reset puts a known address in PC</td></tr>
<tr><td>First rectangle</td><td><strong>Fetch Next Instruction</strong> — the <em>Fetch Cycle</em></td><td>MAR ← PC · MBR ← M(MAR) · IR ← MBR · PC ← PC + 1</td></tr>
<tr><td>Second rectangle</td><td><strong>Execute Instruction</strong> — the <em>Execute Cycle</em></td><td>Decode IR and carry out whatever it says (slide 9 lists the four categories)</td></tr>
<tr><td>The return line on top</td><td><em>(unlabelled)</em></td><td>Go straight back to fetch — the <strong>default</strong> path, taken after almost every instruction</td></tr>
<tr><td>Right rounded box</td><td><strong>HALT</strong></td><td>Reached only by a HALT instruction or an unrecoverable error</td></tr>
</table>
<ul>
<li><strong>The two labels above the boxes name the two halves of an instruction cycle.</strong> <em>Instruction cycle</em> = fetch cycle + execute cycle. That equation is worth writing down verbatim; the exam asks for it in exactly those words.</li>
<li><strong>Notice how the machine never decides "am I done?" in the normal path.</strong> The loop is unconditional; the only exit is an instruction that says stop. A computer left alone does not idle politely — it keeps fetching whatever bytes lie ahead, which is precisely why a runaway pointer in C can make the processor "execute" your data.</li>
<li><strong>Where the branch instructions live.</strong> A jump does not add a box to this figure; it simply writes a new value into PC during the <em>execute</em> cycle. The loop then fetches from somewhere else. All of control flow — <code>if</code>, <code>while</code>, function calls — is that one trick.</li>
<li><strong>This figure is deliberately incomplete, and the chapter says so twice.</strong> Slide 12 expands the two boxes into seven states; slide 16 adds a third box, the <em>interrupt cycle</em>. Read Figure 3.3 as the skeleton that the next twenty slides put flesh on.</li>
<li><strong>Connect to PRF192.</strong> Your <code>main()</code> is, at this level, a starting value for PC. Everything your program does is this loop running a few billion times.</li>
</ul>
<p class="pitfall">⚠️ Do not say "the instruction cycle consists of fetch and decode". Decode is not a separate box here — it is the opening act of the <em>execute</em> cycle (and gets its own state only in Figure 3.6, slide 12). The two-part answer expected at this slide is <strong>fetch + execute</strong>.</p>`,
        `<p class="y-chinh">🎯 Bức ảnh đơn giản nhất mà vẫn đúng về việc máy tính làm: <strong>START → Fetch Next Instruction (nạp lệnh kế) → Execute Instruction (thi hành lệnh) → (quay vòng lại) … → HALT</strong>. Hai cái hộp và một mũi tên đi ngược. Chính mũi tên đi ngược ấy là toàn bộ lý do một cỗ máy chạy được chương trình một triệu lệnh bằng thứ phần cứng mỗi lúc chỉ hiểu được một lệnh.</p>
<table>
<tr><th>Bộ phận trên hình</th><th>Nhãn</th><th>Chuyện gì xảy ra</th></tr>
<tr><td>Hộp bo tròn bên trái</td><td><strong>START</strong></td><td>Bật điện / reset nạp một địa chỉ đã biết trước vào PC</td></tr>
<tr><td>Hộp chữ nhật thứ nhất</td><td><strong>Fetch Next Instruction</strong> — <em>chu kỳ nạp</em></td><td>MAR ← PC · MBR ← M(MAR) · IR ← MBR · PC ← PC + 1</td></tr>
<tr><td>Hộp chữ nhật thứ hai</td><td><strong>Execute Instruction</strong> — <em>chu kỳ thi hành</em></td><td>Giải mã IR và làm đúng điều nó bảo (slide 9 liệt kê bốn loại việc)</td></tr>
<tr><td>Đường quay về phía trên</td><td><em>(không có nhãn)</em></td><td>Về thẳng bước nạp — đây là đường <strong>MẶC ĐỊNH</strong>, đi sau gần như mọi lệnh</td></tr>
<tr><td>Hộp bo tròn bên phải</td><td><strong>HALT</strong></td><td>Chỉ tới được bằng lệnh HALT hoặc một lỗi không cứu được</td></tr>
</table>
<ul>
<li><strong>Hai cái nhãn phía trên hai hộp đặt tên cho hai nửa của một chu trình lệnh.</strong> <em>Chu trình lệnh</em> = chu kỳ nạp + chu kỳ thi hành. Đẳng thức đó nên chép nguyên văn; đề thi hỏi đúng bằng mấy chữ ấy.</li>
<li><strong>Để ý là ở đường đi bình thường, máy KHÔNG BAO GIỜ tự hỏi "xong chưa?".</strong> Vòng lặp là vô điều kiện; lối ra duy nhất là một lệnh bảo nó dừng. Một cái máy bị bỏ mặc không "nghỉ ngơi lịch sự" — nó cứ nạp tiếp bất cứ byte nào nằm phía trước, và đó chính xác là lý do một con trỏ chạy loạn trong C có thể khiến bộ xử lý "thi hành" dữ liệu của bạn.</li>
<li><strong>Lệnh rẽ nhánh nằm ở đâu.</strong> Một lệnh nhảy KHÔNG thêm hộp nào vào hình này; nó chỉ ghi một giá trị mới vào PC trong chu kỳ <em>thi hành</em>. Rồi vòng lặp sẽ nạp từ chỗ khác. Toàn bộ dòng điều khiển — <code>if</code>, <code>while</code>, lời gọi hàm — chỉ là đúng mẹo đó.</li>
<li><strong>Hình này CỐ Ý còn thiếu, và chương sẽ nói ra điều đó hai lần.</strong> Slide 12 nở hai cái hộp thành bảy trạng thái; slide 16 thêm hộp thứ ba, <em>chu kỳ ngắt</em>. Hãy đọc Figure 3.3 như bộ xương mà hai mươi slide sau sẽ đắp thịt lên.</li>
<li><strong>Nối sang PRF192.</strong> Cái <code>main()</code> của bạn, ở tầng này, chỉ là một giá trị khởi đầu cho PC. Mọi thứ chương trình bạn làm chính là vòng lặp này chạy vài tỉ lần.</li>
</ul>
<p class="pitfall">⚠️ Đừng nói "chu trình lệnh gồm nạp và giải mã". Giải mã KHÔNG phải một hộp riêng ở đây — nó là màn mở đầu của chu kỳ <em>thi hành</em> (và chỉ được cấp một trạng thái riêng ở Figure 3.6, slide 12). Đáp án hai phần mà slide này chờ đợi là <strong>nạp (fetch) + thi hành (execute)</strong>.</p>`],

      [8, 'Fetch Cycle',
        `<p class="y-chinh">🎯 The text version of the first box of Figure 3.3, and the slide is unusually precise about the order of events — that ordering is what most exam questions test.</p>
<table>
<tr><th>The slide's sentence</th><th>What it means in register transfers</th></tr>
<tr><td>At the beginning of each instruction cycle the processor <strong>fetches an instruction from memory</strong></td><td>A memory read happens <em>before</em> anything else in every cycle</td></tr>
<tr><td>The <strong>program counter (PC)</strong> holds the address of the instruction <strong>to be fetched next</strong></td><td>MAR ← PC</td></tr>
<tr><td>The processor <strong>increments the PC after each instruction fetch</strong> so that it will fetch the next instruction in sequence</td><td>PC ← PC + 1 — and note <em>after the fetch, not after the execute</em></td></tr>
<tr><td>The fetched instruction is <strong>loaded into the instruction register (IR)</strong></td><td>IR ← MBR</td></tr>
<tr><td>The processor <strong>interprets the instruction and performs the required action</strong></td><td>The execute cycle begins</td></tr>
</table>
<ul>
<li><strong>"Increments the PC after each instruction fetch" is the sentence to underline.</strong> PC is bumped during the fetch, long before the instruction has finished executing. That is not an implementation detail — it is what makes a jump instruction work: the jump writes over a PC that <em>already</em> points at the following instruction, so "no jump" costs nothing at all.</li>
<li><strong>"Increments" hides a unit.</strong> On the hypothetical machine of slide 10 one instruction occupies one word, so PC ← PC + 1. On a real byte-addressed machine PC advances by the instruction's length in bytes — 4 on a fixed-length RISC, anything from 1 to 15 on x86. The concept is "advance past this instruction", not literally "add one".</li>
<li><strong>Why the instruction must be copied out of MBR into IR.</strong> MBR is the single doorway to memory and will be needed again the moment this instruction wants an operand. If the instruction stayed in MBR it would be overwritten by its own operand. IR is the parking space that keeps the instruction readable for the whole execute cycle.</li>
<li><strong>Interpretation is the control unit's job</strong> — Figure 3.1(b) already showed it as the "instruction interpreter" turning codes into control signals. Slide 8 is the same box described in time rather than in space.</li>
<li><strong>Fetch is identical for every instruction; execute is different for every instruction.</strong> That asymmetry is the seed of pipelining in Chapter 16: a fixed-cost stage that can be overlapped with the variable-cost one.</li>
</ul>
<p class="dap-an">✅ Order the four micro-operations of the fetch cycle (a very common exam item): <strong>(1) MAR ← PC · (2) MBR ← M(MAR) and PC ← PC + 1 · (3) IR ← MBR</strong>. Steps (2)'s two halves can happen together because the increment uses the adder while the bus is busy — but (1) must precede (2), and (3) must follow (2). Any answer with IR ← MBR before MBR ← M(MAR) is reading a register that has not been filled yet.</p>`,
        `<p class="y-chinh">🎯 Bản viết bằng chữ của cái hộp thứ nhất trong Figure 3.3, và slide này chính xác một cách khác thường về THỨ TỰ các sự kiện — mà thứ tự ấy chính là thứ đề thi hay hỏi nhất.</p>
<table>
<tr><th>Câu của slide</th><th>Dịch ra phép chuyển thanh ghi</th></tr>
<tr><td>Ở đầu mỗi chu trình lệnh, bộ xử lý <strong>nạp một lệnh từ bộ nhớ</strong></td><td>Một lượt đọc bộ nhớ xảy ra <em>trước</em> mọi thứ khác, trong mọi chu trình</td></tr>
<tr><td><strong>Bộ đếm chương trình (PC)</strong> giữ địa chỉ của lệnh <strong>sắp được nạp kế tiếp</strong></td><td>MAR ← PC</td></tr>
<tr><td>Bộ xử lý <strong>tăng PC SAU MỖI LẦN NẠP LỆNH</strong> để lần sau nạp đúng lệnh kế tiếp trong dãy</td><td>PC ← PC + 1 — và chú ý: <em>sau khi NẠP, không phải sau khi THI HÀNH</em></td></tr>
<tr><td>Lệnh vừa nạp được <strong>đưa vào thanh ghi lệnh (IR)</strong></td><td>IR ← MBR</td></tr>
<tr><td>Bộ xử lý <strong>thông dịch lệnh và thực hiện hành động được yêu cầu</strong></td><td>Chu kỳ thi hành bắt đầu</td></tr>
</table>
<ul>
<li><strong>Câu "tăng PC sau mỗi lần NẠP lệnh" là câu phải gạch chân.</strong> PC được cộng lên ngay trong bước nạp, rất lâu trước khi lệnh chạy xong. Đó không phải chi tiết cài đặt vụn vặt — nó chính là thứ làm cho lệnh nhảy hoạt động được: lệnh nhảy ghi đè lên một PC vốn <em>đã</em> trỏ sang lệnh liền sau, nên trường hợp "không nhảy" không tốn thêm một tí công nào.</li>
<li><strong>Chữ "tăng" giấu mất một đơn vị.</strong> Trên cỗ máy giả định ở slide 10, một lệnh chiếm đúng một từ nhớ nên PC ← PC + 1. Trên máy thật đánh địa chỉ theo byte, PC tiến lên đúng bằng ĐỘ DÀI của lệnh tính theo byte — 4 với RISC lệnh dài cố định, từ 1 tới 15 với x86. Khái niệm là "tiến qua khỏi lệnh này", không phải "cộng một" theo nghĩa đen.</li>
<li><strong>Vì sao lệnh BẮT BUỘC phải được chép ra khỏi MBR vào IR.</strong> MBR là cánh cửa duy nhất ra bộ nhớ, và nó sẽ bị cần lại ngay khoảnh khắc lệnh này muốn lấy toán hạng. Nếu lệnh cứ nằm lì trong MBR thì nó sẽ bị chính toán hạng của nó ghi đè. IR là chỗ đỗ giữ cho lệnh còn đọc được suốt cả chu kỳ thi hành.</li>
<li><strong>Việc thông dịch là việc của khối điều khiển</strong> — Figure 3.1(b) đã vẽ nó thành cái hộp "instruction interpreter" biến mã lệnh thành tín hiệu điều khiển. Slide 8 là đúng cái hộp đó, tả theo THỜI GIAN thay vì theo KHÔNG GIAN.</li>
<li><strong>Bước nạp thì giống hệt nhau với mọi lệnh; bước thi hành thì mỗi lệnh một khác.</strong> Chính sự bất đối xứng đó là hạt giống của kỹ thuật ống lệnh ở Chương 16: một chặng chi phí cố định có thể gối lên chặng chi phí thay đổi.</li>
</ul>
<p class="dap-an">✅ Sắp thứ tự bốn vi thao tác của chu kỳ nạp (một dạng đề rất hay ra): <strong>(1) MAR ← PC · (2) MBR ← M(MAR) và PC ← PC + 1 · (3) IR ← MBR</strong>. Hai nửa của bước (2) làm cùng lúc được, vì phép cộng dùng mạch cộng trong khi bus đang bận — nhưng (1) BẮT BUỘC đi trước (2), và (3) BẮT BUỘC đi sau (2). Bài nào để IR ← MBR trước MBR ← M(MAR) là đang đọc một thanh ghi chưa ai đổ gì vào.</p>`],

      [9, 'Action Categories',
        `<p class="y-chinh">🎯 A four-quadrant circle answering "what can the <em>execute</em> cycle possibly do?" The answer is short and complete: <strong>Processor–memory · Processor–I/O · Data processing · Control</strong> — and an instruction may combine several of them.</p>
<table>
<tr><th>Category</th><th>The slide's own words</th><th>Example on the machine of slide 10</th></tr>
<tr><td><strong>Processor–memory</strong></td><td>Data transferred <strong>from processor to memory</strong> or <strong>from memory to processor</strong></td><td>0001 (Load AC from memory) · 0010 (Store AC to memory)</td></tr>
<tr><td><strong>Processor–I/O</strong></td><td>Data transferred <strong>to or from a peripheral device</strong> by transferring between the processor and an I/O module</td><td>An IN/OUT instruction using I/OAR and I/OBR</td></tr>
<tr><td><strong>Data processing</strong></td><td>The processor may perform some <strong>arithmetic or logic operation</strong> on data</td><td>0101 (Add to AC from memory)</td></tr>
<tr><td><strong>Control</strong></td><td>An instruction may specify that the <strong>sequence of execution be altered</strong></td><td>A jump / branch writing a new value into PC</td></tr>
</table>
<ul>
<li><strong>Compare with the four FUNCTIONS of Chapter 1 and you will see they are not the same list.</strong> Chapter 1 said data processing · data storage · data movement · control. Here "storage" has split into two <em>directions of movement</em> (to memory, to I/O) because at instruction level a machine never just "stores" — it always moves something somewhere.</li>
<li><strong>"An instruction may combine categories" is the sentence that saves you on a classification question.</strong> <code>ADD AC, M(941)</code> is both processor–memory (the operand must be fetched) and data processing (the addition). The categories describe <em>actions</em>, not instructions.</li>
<li><strong>The control category is the only one that changes PC.</strong> The other three leave the sequential flow untouched; control instructions are the explicit exception that von Neumann concept 3 allowed for. Everything <code>if</code>, <code>for</code> and <code>return</code> compile into lives in this quadrant.</li>
<li><strong>Why processor–I/O is drawn as a separate quadrant and not folded into processor–memory.</strong> Because on this machine they use different registers (I/OAR, I/OBR) and different instructions — the slide 22 phrase is "I/O instructions rather than memory referencing instructions". A machine that instead maps devices into the address space (memory-mapped I/O, Chapter 7) collapses these two quadrants into one; that is an architectural choice, and it is examinable.</li>
<li><strong>The two curved arrows in the middle of the circle mean "and round again".</strong> The categories are not a pipeline or an order — they are a menu, and the instruction cycle returns to fetch after any of them.</li>
</ul>
<p class="meo">💡 Four quadrants, two questions: <em>does it move data?</em> (if yes: to memory or to a device?) and <em>does it change what happens next?</em> (if yes: control; if it only computes: data processing).</p>`,
        `<p class="y-chinh">🎯 Một vòng tròn chia bốn phần, trả lời câu hỏi "chu kỳ <em>thi hành</em> có thể làm những gì?". Đáp án ngắn và đầy đủ: <strong>Bộ xử lý–bộ nhớ · Bộ xử lý–I/O · Xử lý dữ liệu · Điều khiển</strong> — và một lệnh có thể kiêm mấy loại cùng lúc.</p>
<table>
<tr><th>Loại việc</th><th>Nguyên văn của slide</th><th>Ví dụ trên cỗ máy ở slide 10</th></tr>
<tr><td><strong>Bộ xử lý–bộ nhớ</strong></td><td>Dữ liệu được chuyển <strong>từ bộ xử lý vào bộ nhớ</strong> hoặc <strong>từ bộ nhớ vào bộ xử lý</strong></td><td>0001 (nạp AC từ bộ nhớ) · 0010 (ghi AC ra bộ nhớ)</td></tr>
<tr><td><strong>Bộ xử lý–I/O</strong></td><td>Dữ liệu được chuyển <strong>tới hoặc từ một thiết bị ngoại vi</strong> thông qua việc chuyển giữa bộ xử lý và một mô-đun I/O</td><td>Một lệnh IN/OUT dùng I/OAR và I/OBR</td></tr>
<tr><td><strong>Xử lý dữ liệu</strong></td><td>Bộ xử lý có thể thực hiện một <strong>phép số học hoặc logic</strong> trên dữ liệu</td><td>0101 (cộng vào AC từ bộ nhớ)</td></tr>
<tr><td><strong>Điều khiển</strong></td><td>Một lệnh có thể chỉ định rằng <strong>trình tự thi hành bị thay đổi</strong></td><td>Lệnh nhảy / rẽ nhánh ghi một giá trị mới vào PC</td></tr>
</table>
<ul>
<li><strong>Đem so với bốn CHỨC NĂNG ở Chương 1, bạn sẽ thấy đây KHÔNG phải cùng một danh sách.</strong> Chương 1 nói: xử lý dữ liệu · lưu trữ dữ liệu · di chuyển dữ liệu · điều khiển. Ở đây "lưu trữ" đã tách thành hai <em>hướng di chuyển</em> (về bộ nhớ, về I/O), vì ở tầng lệnh thì máy không bao giờ chỉ "lưu" — nó luôn luôn CHUYỂN cái gì đó đi đâu đó.</li>
<li><strong>Câu "một lệnh có thể kiêm nhiều loại" là câu cứu bạn ở dạng đề phân loại.</strong> <code>ADD AC, M(941)</code> vừa là bộ xử lý–bộ nhớ (phải nạp toán hạng về) vừa là xử lý dữ liệu (phép cộng). Bốn loại này mô tả <em>HÀNH ĐỘNG</em>, không mô tả LỆNH.</li>
<li><strong>Loại "điều khiển" là loại DUY NHẤT đụng vào PC.</strong> Ba loại kia để nguyên dòng chảy tuần tự; lệnh điều khiển chính là cái ngoại lệ tường minh mà ý von Neumann số 3 đã chừa chỗ. Mọi thứ mà <code>if</code>, <code>for</code> và <code>return</code> biên dịch ra đều sống trong góc phần tư này.</li>
<li><strong>Vì sao bộ xử lý–I/O được vẽ thành một góc riêng chứ không gộp vào bộ xử lý–bộ nhớ.</strong> Vì trên cỗ máy này chúng dùng thanh ghi khác (I/OAR, I/OBR) và lệnh khác — nguyên văn slide 22 là "lệnh I/O chứ không phải lệnh tham chiếu bộ nhớ". Một cỗ máy chọn cách ánh xạ thiết bị vào chính không gian địa chỉ (I/O ánh xạ bộ nhớ, Chương 7) thì gộp hai góc này thành một; đó là một lựa chọn KIẾN TRÚC, và nó có ra đề.</li>
<li><strong>Hai mũi tên cong ở giữa vòng tròn nghĩa là "rồi lại quay vòng".</strong> Bốn loại này không phải một dây chuyền cũng không phải một thứ tự — chúng là một thực đơn, và chu trình lệnh quay về bước nạp sau bất kỳ loại nào.</li>
</ul>
<p class="meo">💡 Bốn góc, hai câu hỏi: <em>nó có chuyển dữ liệu không?</em> (có thì: chuyển về bộ nhớ hay về thiết bị?) và <em>nó có đổi chuyện xảy ra kế tiếp không?</em> (có thì là điều khiển; nếu chỉ tính toán thì là xử lý dữ liệu).</p>`],

      [10, 'Figure 3.4 — Characteristics of a Hypothetical Machine',
        `<p class="y-chinh">🎯 The spec sheet of the tiny machine used for the worked example on the next slide. Four panels: <strong>(a) instruction format</strong> — 16 bits, opcode in bits 0–3 and address in bits 4–15; <strong>(b) integer format</strong> — 16 bits, sign S in bit 0 and magnitude in bits 1–15; <strong>(c) internal CPU registers</strong> — PC, IR, AC; <strong>(d) a partial list of opcodes</strong> — three of them.</p>
<table>
<tr><th>Panel</th><th>Content</th><th>Consequence you must be able to compute</th></tr>
<tr><td>(a) Instruction format</td><td>bits <strong>0–3 = Opcode</strong> (4 bits) · bits <strong>4–15 = Address</strong> (12 bits)</td><td>At most 2<sup>4</sup> = <strong>16 different opcodes</strong>; addresses reach 2<sup>12</sup> = <strong>4096 words</strong> (0…4095)</td></tr>
<tr><td>(b) Integer format</td><td>bit <strong>0 = S</strong> (sign) · bits <strong>1–15 = Magnitude</strong></td><td>Sign–magnitude, 15 magnitude bits ⇒ −32767 … +32767, with two encodings of zero</td></tr>
<tr><td>(c) Registers</td><td><strong>PC</strong> = address of instruction · <strong>IR</strong> = instruction being executed · <strong>AC</strong> = temporary storage (the accumulator)</td><td>One accumulator only, so every arithmetic instruction has AC as an implied operand</td></tr>
<tr><td>(d) Opcodes</td><td><strong>0001</strong> = Load AC from Memory · <strong>0010</strong> = Store AC to Memory · <strong>0101</strong> = Add to AC from Memory</td><td>In hex these are the leading digits <strong>1</strong>, <strong>2</strong> and <strong>5</strong> of slide 11's instruction words</td></tr>
</table>
<p class="dap-an">✅ Decode the three instruction words of the next slide before you get there. <strong>1940</strong>h: opcode 1 = Load AC, address 940 ⇒ "AC ← M(940)". <strong>5941</strong>h: opcode 5 = Add to AC, address 941 ⇒ "AC ← AC + M(941)". <strong>2941</strong>h: opcode 2 = Store AC, address 941 ⇒ "M(941) ← AC". Three instructions, one program: <em>load a number, add another to it, write the sum back</em>. Note how the hexadecimal digits line up with the bit fields: 4 opcode bits are exactly one hex digit, 12 address bits are exactly three hex digits — which is why the book chose hex, and why the address fits "940" so tidily.</p>
<ul>
<li><strong>The 4/12 split is a design trade-off, drawn to scale.</strong> Sixteen bits must be divided between "how many things can I ask for" and "how far can I reach". Give the opcode one more bit and you get 32 instructions but only 2048 addressable words. Chapter 13–14 turns this single trade-off into a whole subject.</li>
<li><strong>"Accumulator" is a register type, not a name.</strong> AC is an <em>implied</em> operand: the Add instruction has only one address field, so the other operand and the destination must both be AC. Machines like this are called accumulator machines; x86 still carries the fossil in the name of the EAX register.</li>
<li><strong>Sign–magnitude, panel (b), is the format Chapter 11 will show to be awkward.</strong> Addition must inspect the signs before it can act, and zero has two representations (+0 and −0). Real machines use two's complement instead. The figure uses sign–magnitude only because it is easy to read on a slide.</li>
<li><strong>Only three opcodes are listed — "partial list" is literal.</strong> Do not answer an exam question by claiming the machine has exactly three instructions; the figure says the list is partial, and a machine with no branch instruction could not loop at all.</li>
</ul>
<p class="pitfall">⚠️ Bits are numbered from the LEFT in this book: bit 0 is the most significant bit. That is the opposite of the convention you may have met in C bit-manipulation, where bit 0 is the least significant. On Stallings diagrams always read the numbers printed above the box, never assume.</p>`,
        `<p class="y-chinh">🎯 Bảng thông số của cỗ máy tí hon dùng cho ví dụ chạy tay ở slide kế. Bốn khung: <strong>(a) khuôn dạng lệnh</strong> — 16 bit, opcode ở bit 0–3 và địa chỉ ở bit 4–15; <strong>(b) khuôn dạng số nguyên</strong> — 16 bit, dấu S ở bit 0 và độ lớn ở bit 1–15; <strong>(c) các thanh ghi trong CPU</strong> — PC, IR, AC; <strong>(d) danh sách MỘT PHẦN các mã lệnh</strong> — đúng ba cái.</p>
<table>
<tr><th>Khung</th><th>Nội dung</th><th>Hệ quả bạn phải tính được</th></tr>
<tr><td>(a) Khuôn dạng lệnh</td><td>bit <strong>0–3 = Opcode</strong> (4 bit) · bit <strong>4–15 = Address</strong> (12 bit)</td><td>Nhiều nhất 2<sup>4</sup> = <strong>16 mã lệnh khác nhau</strong>; địa chỉ với tới 2<sup>12</sup> = <strong>4096 từ nhớ</strong> (0…4095)</td></tr>
<tr><td>(b) Khuôn dạng số nguyên</td><td>bit <strong>0 = S</strong> (dấu) · bit <strong>1–15 = Magnitude</strong> (độ lớn)</td><td>Dấu–độ lớn, 15 bit độ lớn ⇒ −32767 … +32767, và số 0 có HAI cách biểu diễn</td></tr>
<tr><td>(c) Thanh ghi</td><td><strong>PC</strong> = địa chỉ của lệnh · <strong>IR</strong> = lệnh đang được thi hành · <strong>AC</strong> = chỗ chứa tạm (thanh ghi tích luỹ)</td><td>Chỉ có MỘT thanh tích luỹ, nên mọi lệnh số học đều lấy AC làm toán hạng ngầm định</td></tr>
<tr><td>(d) Mã lệnh</td><td><strong>0001</strong> = nạp AC từ bộ nhớ · <strong>0010</strong> = ghi AC ra bộ nhớ · <strong>0101</strong> = cộng vào AC từ bộ nhớ</td><td>Viết hệ 16 thì đó chính là chữ số đầu <strong>1</strong>, <strong>2</strong> và <strong>5</strong> của các từ lệnh ở slide 11</td></tr>
</table>
<p class="dap-an">✅ Giải mã sẵn ba từ lệnh của slide kế, trước khi tới đó. <strong>1940</strong>h: opcode 1 = nạp AC, địa chỉ 940 ⇒ "AC ← M(940)". <strong>5941</strong>h: opcode 5 = cộng vào AC, địa chỉ 941 ⇒ "AC ← AC + M(941)". <strong>2941</strong>h: opcode 2 = ghi AC, địa chỉ 941 ⇒ "M(941) ← AC". Ba lệnh, một chương trình: <em>nạp một số, cộng thêm một số nữa, ghi tổng trở lại</em>. Để ý các chữ số hệ 16 khớp khít với các trường bit: 4 bit opcode đúng bằng MỘT chữ số hex, 12 bit địa chỉ đúng bằng BA chữ số hex — đó là lý do sách chọn hệ 16, và cũng là lý do địa chỉ "940" nằm gọn ghẽ đến thế.</p>
<ul>
<li><strong>Phép chia 4/12 là một cuộc đánh đổi thiết kế, được vẽ đúng tỉ lệ.</strong> Mười sáu bit phải chia giữa "tôi ra lệnh được bao nhiêu thứ" và "tôi với được xa tới đâu". Cho opcode thêm một bit thì được 32 lệnh nhưng chỉ còn 2048 từ nhớ đánh địa chỉ được. Chương 13–14 sẽ biến đúng cuộc đánh đổi này thành cả một chủ đề.</li>
<li><strong>"Accumulator" là một KIỂU thanh ghi, không phải một cái tên riêng.</strong> AC là toán hạng <em>ngầm định</em>: lệnh Add chỉ có một trường địa chỉ, nên toán hạng còn lại và cả nơi chứa kết quả đều buộc phải là AC. Loại máy như thế gọi là máy tích luỹ; x86 tới nay vẫn mang hoá thạch ấy trong cái tên thanh ghi EAX.</li>
<li><strong>Dạng dấu–độ lớn ở khung (b) chính là dạng mà Chương 11 sẽ chứng minh là bất tiện.</strong> Phép cộng phải xem dấu trước rồi mới làm được, và số 0 có hai cách viết (+0 và −0). Máy thật dùng bù hai thay thế. Hình này dùng dấu–độ lớn chỉ vì nó dễ đọc trên slide.</li>
<li><strong>Chỉ ba mã lệnh được liệt kê — chữ "partial list" là nghĩa đen.</strong> Đừng trả lời bài thi rằng cỗ máy này có đúng ba lệnh; hình đã nói danh sách là một phần, mà một cỗ máy không có lệnh rẽ nhánh thì không lặp nổi một vòng nào.</li>
</ul>
<p class="pitfall">⚠️ Trong sách này, bit được đánh số từ BÊN TRÁI: bit 0 là bit có trọng số lớn nhất. Ngược hẳn với quy ước bạn có thể đã gặp khi thao tác bit trong C, nơi bit 0 là bit thấp nhất. Với sơ đồ của Stallings, luôn đọc dãy số in phía trên cái hộp, đừng bao giờ đoán.</p>`],

      [11, 'Figure 3.5 — Example of Program Execution (contents of memory and registers in hexadecimal)',
        `<p class="y-chinh">🎯 The most examined figure in Chapter 3: <strong>six steps, three instructions, one addition</strong>. Memory starts as 300 = 1940, 301 = 5941, 302 = 2941, 940 = 0003, 941 = 0002; the program adds the contents of 940 to the contents of 941 and stores the result back in 941. Everything is hexadecimal.</p>
<table>
<tr><th>Step</th><th>Cycle</th><th>PC</th><th>IR</th><th>AC</th><th>Memory operation</th><th>What is really happening</th></tr>
<tr><td><strong>1</strong></td><td>Fetch</td><td>300 → 301</td><td>1940</td><td>—</td><td><strong>read</strong> M(300) = 1940</td><td>MAR ← PC(300) · MBR ← 1940 · IR ← 1940 · PC ← 301</td></tr>
<tr><td><strong>2</strong></td><td>Execute</td><td>301</td><td>1940</td><td><strong>0003</strong></td><td><strong>read</strong> M(940) = 0003</td><td>Opcode 1 = Load AC. MAR ← 940 · MBR ← 0003 · AC ← 0003</td></tr>
<tr><td><strong>3</strong></td><td>Fetch</td><td>301 → 302</td><td><strong>5941</strong></td><td>0003</td><td><strong>read</strong> M(301) = 5941</td><td>MAR ← PC(301) · IR ← 5941 · PC ← 302</td></tr>
<tr><td><strong>4</strong></td><td>Execute</td><td>302</td><td>5941</td><td><strong>0005</strong></td><td><strong>read</strong> M(941) = 0002</td><td>Opcode 5 = Add to AC. MBR ← 0002 · AC ← 0003 + 0002 = <strong>0005</strong> (the figure writes "3 + 2 = 5")</td></tr>
<tr><td><strong>5</strong></td><td>Fetch</td><td>302 → 303</td><td><strong>2941</strong></td><td>0005</td><td><strong>read</strong> M(302) = 2941</td><td>MAR ← PC(302) · IR ← 2941 · PC ← 303</td></tr>
<tr><td><strong>6</strong></td><td>Execute</td><td>303</td><td>2941</td><td>0005</td><td><strong>write</strong> M(941) ← 0005</td><td>Opcode 2 = Store AC. MAR ← 941 · MBR ← 0005 · memory cell 941 changes from 0002 to <strong>0005</strong></td></tr>
</table>
<p class="dap-an">✅ Result and cost, both of which get asked. The program is <code>M(941) = M(940) + M(941)</code>, i.e. 3 + 2 = 5, so afterwards <strong>M(940) = 0003 (unchanged), M(941) = 0005, AC = 0005, PC = 303, IR = 2941</strong>. Cost: <strong>3 instructions · 6 cycles (3 fetch + 3 execute) · 6 memory accesses</strong> — 3 instruction reads, 2 operand reads, 1 operand write. Note that every one of the three instructions needed a memory access during execute as well as during fetch, which is why this machine spends twice as many bus trips as it has instructions; that ratio is the whole motivation for registers and cache.</p>
<ul>
<li><strong>Read the odd steps as fetch and the even steps as execute.</strong> That alternation is Figure 3.3 running. If an exam gives you a partial trace and asks "what is step 7?", the answer starts with "a fetch, of M(303)".</li>
<li><strong>Watch AC in the left column of step 1: it is empty.</strong> The accumulator holds nothing defined until the Load in step 2. A trace that shows a value in AC before any Load has invented data.</li>
<li><strong>Step 4 is the only step where arithmetic happens</strong> — one addition out of six steps. Five sixths of the work is moving numbers around. This is not a flaw in the example; it is what real programs look like at this level, and it is the reason Chapter 4 opens by saying the memory system, not the ALU, decides performance.</li>
<li><strong>M(940) is never modified.</strong> Loading from an address reads it; only opcode 2 writes. A very common trace error is to "use up" the operand.</li>
<li><strong>Connect to PRF192.</strong> The C statement <code>b = a + b;</code> with <code>a</code> at 940 and <code>b</code> at 941 compiles to exactly these three instructions. When you write one line of C you are ordering six machine cycles.</li>
</ul>
<p class="pitfall">⚠️ Read the PC column of the picture carefully: <strong>Step 1 shows PC = 300 while Step 2 shows PC = 301</strong>. It is tempting to conclude that PC is incremented during the <em>execute</em> cycle — it is not. Slide 8 states plainly that the processor increments PC <em>after each instruction fetch</em>. The figure simply snapshots step 1 at the instant the address is being used and step 2 after the increment has already happened. State it the slide-8 way in an exam answer.</p>`,
        `<p class="y-chinh">🎯 Hình bị ra đề nhiều nhất Chương 3: <strong>sáu bước, ba lệnh, một phép cộng</strong>. Bộ nhớ ban đầu: 300 = 1940, 301 = 5941, 302 = 2941, 940 = 0003, 941 = 0002; chương trình cộng nội dung ô 940 vào nội dung ô 941 rồi ghi kết quả trở lại ô 941. Mọi con số đều ở hệ 16.</p>
<table>
<tr><th>Bước</th><th>Chu kỳ</th><th>PC</th><th>IR</th><th>AC</th><th>Thao tác bộ nhớ</th><th>Thực chất đang xảy ra gì</th></tr>
<tr><td><strong>1</strong></td><td>Nạp</td><td>300 → 301</td><td>1940</td><td>—</td><td><strong>đọc</strong> M(300) = 1940</td><td>MAR ← PC(300) · MBR ← 1940 · IR ← 1940 · PC ← 301</td></tr>
<tr><td><strong>2</strong></td><td>Thi hành</td><td>301</td><td>1940</td><td><strong>0003</strong></td><td><strong>đọc</strong> M(940) = 0003</td><td>Opcode 1 = nạp AC. MAR ← 940 · MBR ← 0003 · AC ← 0003</td></tr>
<tr><td><strong>3</strong></td><td>Nạp</td><td>301 → 302</td><td><strong>5941</strong></td><td>0003</td><td><strong>đọc</strong> M(301) = 5941</td><td>MAR ← PC(301) · IR ← 5941 · PC ← 302</td></tr>
<tr><td><strong>4</strong></td><td>Thi hành</td><td>302</td><td>5941</td><td><strong>0005</strong></td><td><strong>đọc</strong> M(941) = 0002</td><td>Opcode 5 = cộng vào AC. MBR ← 0002 · AC ← 0003 + 0002 = <strong>0005</strong> (hình ghi luôn "3 + 2 = 5")</td></tr>
<tr><td><strong>5</strong></td><td>Nạp</td><td>302 → 303</td><td><strong>2941</strong></td><td>0005</td><td><strong>đọc</strong> M(302) = 2941</td><td>MAR ← PC(302) · IR ← 2941 · PC ← 303</td></tr>
<tr><td><strong>6</strong></td><td>Thi hành</td><td>303</td><td>2941</td><td>0005</td><td><strong>ghi</strong> M(941) ← 0005</td><td>Opcode 2 = ghi AC. MAR ← 941 · MBR ← 0005 · ô nhớ 941 đổi từ 0002 thành <strong>0005</strong></td></tr>
</table>
<p class="dap-an">✅ Kết quả và chi phí, đề hỏi cả hai. Chương trình chính là <code>M(941) = M(940) + M(941)</code>, tức 3 + 2 = 5, nên sau khi chạy xong: <strong>M(940) = 0003 (không đổi), M(941) = 0005, AC = 0005, PC = 303, IR = 2941</strong>. Chi phí: <strong>3 lệnh · 6 chu kỳ (3 nạp + 3 thi hành) · 6 lượt truy nhập bộ nhớ</strong> — 3 lượt đọc lệnh, 2 lượt đọc toán hạng, 1 lượt ghi toán hạng. Để ý là cả ba lệnh đều cần một lượt truy nhập bộ nhớ ở bước thi hành, ngoài lượt ở bước nạp; vì vậy cỗ máy này tiêu số lượt đi bus GẤP ĐÔI số lệnh, và chính tỉ lệ ấy là toàn bộ động cơ sinh ra thanh ghi và cache.</p>
<ul>
<li><strong>Đọc các bước LẺ là nạp, các bước CHẴN là thi hành.</strong> Nhịp xen kẽ ấy chính là Figure 3.3 đang chạy. Nếu đề cho một bảng vết dở dang rồi hỏi "bước 7 là gì?", câu trả lời mở đầu bằng "một lượt nạp, đọc M(303)".</li>
<li><strong>Nhìn ô AC ở bước 1: nó TRỐNG.</strong> Thanh tích luỹ chưa chứa gì có nghĩa cho tới khi lệnh Load ở bước 2 chạy xong. Bảng vết nào cho AC có giá trị trước lệnh Load đầu tiên là bảng vết bịa dữ liệu.</li>
<li><strong>Bước 4 là bước DUY NHẤT có phép tính</strong> — một phép cộng trên tổng sáu bước. Năm phần sáu công việc chỉ là bê số đi lòng vòng. Đó không phải khuyết điểm của ví dụ; chương trình thật ở tầng này trông đúng như vậy, và đó là lý do Chương 4 mở đầu bằng câu: hệ thống bộ nhớ, chứ không phải ALU, mới quyết định hiệu năng.</li>
<li><strong>Ô M(940) không hề bị sửa.</strong> Nạp từ một địa chỉ là ĐỌC nó; chỉ opcode 2 mới ghi. Một lỗi chạy tay rất hay gặp là coi như toán hạng bị "tiêu dùng mất".</li>
<li><strong>Nối sang PRF192.</strong> Câu lệnh C <code>b = a + b;</code> với <code>a</code> ở ô 940 và <code>b</code> ở ô 941 biên dịch ra đúng ba lệnh này. Bạn viết một dòng C là bạn đặt hàng sáu chu kỳ máy.</li>
</ul>
<p class="pitfall">⚠️ Đọc kỹ cột PC trên hình: <strong>Step 1 vẽ PC = 300 còn Step 2 mới vẽ PC = 301</strong>. Rất dễ vội kết luận rằng PC được tăng trong chu kỳ <em>thi hành</em> — KHÔNG PHẢI. Slide 8 nói thẳng: bộ xử lý tăng PC <em>sau mỗi lần nạp lệnh</em>. Hình chỉ đơn giản chụp bước 1 vào đúng khoảnh khắc địa chỉ đang được dùng, và chụp bước 2 sau khi phép tăng đã xong. Khi làm bài, hãy phát biểu theo cách của slide 8.</p>`],

      [12, 'Figure 3.6 — Instruction Cycle State Diagram',
        `<p class="y-chinh">🎯 Figure 3.3's two boxes, blown up into <strong>seven states</strong>. Same loop, far more honest about how much work "execute" hides: <em>Instruction address calculation → Instruction fetch → Instruction operation decoding → Operand address calculation → Operand fetch → Data operation → Operand address calculation → Operand store</em>, then back to the beginning.</p>
<table>
<tr><th>State</th><th>Abbrev.</th><th>What it does</th><th>Which half of Figure 3.3</th></tr>
<tr><td>Instruction address calculation</td><td>iac</td><td>Work out where the next instruction is (usually PC + length)</td><td rowspan="2">Fetch cycle</td></tr>
<tr><td>Instruction fetch</td><td>if</td><td>Read that word from memory into IR</td></tr>
<tr><td>Instruction operation decoding</td><td>iod</td><td>Analyse the instruction: what operation, which operands</td><td rowspan="6">Execute cycle</td></tr>
<tr><td>Operand address calculation</td><td>oac</td><td>Work out where the input operand is</td></tr>
<tr><td>Operand fetch</td><td>of</td><td>Read the operand from memory or a device</td></tr>
<tr><td>Data operation</td><td>do</td><td>Actually perform the arithmetic or logic</td></tr>
<tr><td>Operand address calculation</td><td>oac</td><td>Work out where the <em>result</em> goes</td></tr>
<tr><td>Operand store</td><td>os</td><td>Write the result back</td></tr>
</table>
<ul>
<li><strong>The two loops in the middle are the reason this diagram exists.</strong> "<em>Multiple operands</em>" loops of ↔ oac, and "<em>Multiple results</em>" loops os ↔ oac. An instruction can need several inputs and produce several outputs, so a straight line would be a lie. A long arrow at the bottom is labelled "<em>Return for string or vector data</em>" — the same instruction repeating on a whole block of data.</li>
<li><strong>Not every state runs for every instruction.</strong> On the machine of slide 10, "Load AC" uses iac·if·iod·oac·of and then stops — it has no result to store beyond a register. "Store AC" skips the operand fetch. Only an instruction like memory-to-memory add would walk the whole diagram.</li>
<li><strong>Address calculation appears twice under the same name, and that is deliberate.</strong> One instance computes where to read the input from, the other where to write the output to. It is the same <em>activity</em> done at two points, not a printing mistake.</li>
<li><strong>This is where addressing modes will plug in.</strong> "Operand address calculation" sounds trivial now because slide 10's machine has one mode: the address field <em>is</em> the address. Chapter 14 fills this state with indirect, indexed, base-relative and displacement modes, and this diagram is the hole they drop into.</li>
<li><strong>Trace the example of slide 11 onto this diagram.</strong> Instruction 5941 (Add) walks iac → if → iod → oac(941) → of(0002) → do(3+2) and then leaves the result in AC, so no operand store. Three of the seven states are skipped. Being able to say <em>which</em> states an instruction visits is a standard exam task.</li>
</ul>
<p class="meo">💡 Remember the diagram as a sandwich: <strong>two states to get the instruction · one to understand it · two to get the data · one to compute · two to put the answer away.</strong> 2–1–2–1–2, seven names, one loop.</p>`,
        `<p class="y-chinh">🎯 Hai cái hộp của Figure 3.3, phóng to thành <strong>bảy trạng thái</strong>. Vẫn vòng lặp ấy, nhưng trung thực hơn hẳn về khối lượng công việc mà chữ "thi hành" đang giấu: <em>Tính địa chỉ lệnh → Nạp lệnh → Giải mã phép toán của lệnh → Tính địa chỉ toán hạng → Nạp toán hạng → Thao tác dữ liệu → Tính địa chỉ toán hạng → Ghi toán hạng</em>, rồi quay lại từ đầu.</p>
<table>
<tr><th>Trạng thái</th><th>Viết tắt</th><th>Làm gì</th><th>Thuộc nửa nào của Figure 3.3</th></tr>
<tr><td>Instruction address calculation</td><td>iac</td><td>Tính xem lệnh kế nằm ở đâu (thường là PC + độ dài)</td><td rowspan="2">Chu kỳ nạp</td></tr>
<tr><td>Instruction fetch</td><td>if</td><td>Đọc từ nhớ đó về IR</td></tr>
<tr><td>Instruction operation decoding</td><td>iod</td><td>Phân tích lệnh: phép gì, toán hạng nào</td><td rowspan="6">Chu kỳ thi hành</td></tr>
<tr><td>Operand address calculation</td><td>oac</td><td>Tính xem toán hạng ĐẦU VÀO nằm ở đâu</td></tr>
<tr><td>Operand fetch</td><td>of</td><td>Đọc toán hạng từ bộ nhớ hoặc từ thiết bị</td></tr>
<tr><td>Data operation</td><td>do</td><td>Thật sự làm phép số học hoặc logic</td></tr>
<tr><td>Operand address calculation</td><td>oac</td><td>Tính xem <em>kết quả</em> phải đi đâu</td></tr>
<tr><td>Operand store</td><td>os</td><td>Ghi kết quả trở lại</td></tr>
</table>
<ul>
<li><strong>Hai cái vòng ở giữa mới là lý do sơ đồ này tồn tại.</strong> "<em>Multiple operands</em>" (nhiều toán hạng) lặp giữa of ↔ oac, còn "<em>Multiple results</em>" (nhiều kết quả) lặp giữa os ↔ oac. Một lệnh có thể cần nhiều đầu vào và đẻ ra nhiều đầu ra, nên vẽ một đường thẳng là nói dối. Mũi tên dài phía dưới mang nhãn "<em>Return for string or vector data</em>" — cùng một lệnh lặp lại trên cả một khối dữ liệu.</li>
<li><strong>Không phải lệnh nào cũng đi qua đủ bảy trạng thái.</strong> Trên cỗ máy ở slide 10, lệnh "nạp AC" đi iac·if·iod·oac·of rồi dừng — nó không có kết quả nào phải ghi ra ngoài thanh ghi. Lệnh "ghi AC" thì bỏ qua bước nạp toán hạng. Chỉ một lệnh kiểu cộng bộ-nhớ-sang-bộ-nhớ mới đi trọn sơ đồ.</li>
<li><strong>Trạng thái tính địa chỉ xuất hiện HAI LẦN cùng một tên, và đó là cố ý.</strong> Một lần tính xem đọc đầu vào ở đâu, lần kia tính xem ghi đầu ra vào đâu. Đó là cùng một <em>việc</em> làm ở hai chỗ, không phải lỗi in.</li>
<li><strong>Đây chính là chỗ các chế độ địa chỉ sẽ cắm vào.</strong> "Tính địa chỉ toán hạng" bây giờ nghe tầm thường vì cỗ máy slide 10 chỉ có một chế độ: trường địa chỉ <em>chính là</em> địa chỉ. Chương 14 sẽ nhồi vào trạng thái này các chế độ gián tiếp, chỉ số, tương đối theo cơ sở, độ dời — và sơ đồ này là cái lỗ chúng rơi vào.</li>
<li><strong>Thử soi ví dụ slide 11 lên sơ đồ này.</strong> Lệnh 5941 (Add) đi iac → if → iod → oac(941) → of(0002) → do(3+2) rồi để kết quả nằm trong AC, nên KHÔNG có bước ghi toán hạng. Ba trong bảy trạng thái bị bỏ qua. Nói được một lệnh ĐI QUA những trạng thái nào là một dạng bài thi chuẩn.</li>
</ul>
<p class="meo">💡 Nhớ sơ đồ như một cái bánh kẹp: <strong>hai trạng thái để lấy lệnh về · một để hiểu nó · hai để lấy dữ liệu về · một để tính · hai để cất kết quả đi.</strong> 2–1–2–1–2, bảy cái tên, một vòng lặp.</p>`],

      [13, 'Table 3.1 — Classes of Interrupts',
        `<p class="y-chinh">🎯 The definition of the chapter's second big idea, given as a table of <strong>four classes</strong> of interrupt. An interrupt is a mechanism by which <em>other modules may interrupt the normal sequencing of the processor</em> — and the table says who is allowed to do the interrupting.</p>
<table>
<tr><th>Class</th><th>The table's own wording</th><th>Typical example</th><th>Synchronous with the program?</th></tr>
<tr><td><strong>Program</strong></td><td>Generated by some condition that occurs as a <strong>result of an instruction execution</strong>, such as arithmetic overflow, division by zero, attempt to execute an illegal machine instruction, or reference outside a user's allowed memory space</td><td><code>x / 0</code> · a bad pointer dereference</td><td><strong>Yes</strong> — caused by the instruction itself, reproducible</td></tr>
<tr><td><strong>Timer</strong></td><td>Generated by a <strong>timer within the processor</strong>. This allows the operating system to perform certain functions on a regular basis</td><td>The scheduler tick that preempts a running process</td><td>No — arrives on its own clock</td></tr>
<tr><td><strong>I/O</strong></td><td>Generated by an <strong>I/O controller</strong>, to signal normal completion of an operation, request service from the processor, or signal a variety of error conditions</td><td>"Disk read finished" · "key pressed"</td><td>No — depends on the device and on the physical world</td></tr>
<tr><td><strong>Hardware failure</strong></td><td>Generated by a failure such as <strong>power failure or memory parity error</strong></td><td>Power about to drop · ECC error in RAM</td><td>No — and usually the most urgent of all</td></tr>
</table>
<ul>
<li><strong>The first class is the odd one out, and the exam knows it.</strong> A <em>program</em> interrupt is caused by the instruction currently executing; the other three arrive from outside the instruction stream. Many textbooks call the first kind a <em>trap</em> or <em>exception</em> and reserve "interrupt" for the rest. Stallings puts them all under one heading because the hardware mechanism is identical — save state, jump to a handler, return.</li>
<li><strong>The timer class is what makes multitasking possible.</strong> Without a timer interrupt a process that never calls the OS could hold the processor forever; the OS would have no way to get control back. Every preemptive scheduler you met in CSI106 chapter 5 rests on this one row of the table.</li>
<li><strong>The I/O class is the one motivating slides 14–18.</strong> "Signal normal completion of an operation" is exactly how a program is freed from waiting for a slow device — the whole argument of the next five slides.</li>
<li><strong>Hardware failure interrupts buy you milliseconds, and milliseconds are enough.</strong> A power-failure interrupt fires while the capacitors still hold charge, giving the machine time to flush buffers and shut down cleanly. Knowing that an interrupt can be a last message rather than a request explains why this class usually holds the highest priority.</li>
<li><strong>Connect to PRF192.</strong> Dividing by zero in your C program does not "crash by magic": it raises a program interrupt, the OS handler decides you cannot continue, and it terminates the process. The message on your terminal is the last step of an interrupt.</li>
</ul>
<p class="pitfall">⚠️ Do not confuse an interrupt with a subroutine call, even though both jump away and come back. A <code>call</code> is written in the program, happens at a predictable place, and is part of the program's own logic. An interrupt (except the Program class) is <strong>not in the program at all</strong> — it can strike between any two instructions, which is exactly why hardware, not the programmer, must save the state.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa của ý lớn thứ hai trong chương, cho dưới dạng một bảng <strong>bốn lớp</strong> ngắt. Ngắt là cơ chế cho phép <em>các mô-đun khác cắt ngang trình tự bình thường của bộ xử lý</em> — và bảng này nói ai được phép cắt ngang.</p>
<table>
<tr><th>Lớp ngắt</th><th>Nguyên văn của bảng</th><th>Ví dụ điển hình</th><th>Đồng bộ với chương trình?</th></tr>
<tr><td><strong>Program</strong> (chương trình)</td><td>Sinh ra bởi một điều kiện xảy ra <strong>như KẾT QUẢ của việc thi hành một lệnh</strong>, ví dụ tràn số học, chia cho 0, cố thi hành một lệnh máy không hợp lệ, hoặc tham chiếu ra ngoài vùng nhớ mà người dùng được phép</td><td><code>x / 0</code> · giải tham chiếu con trỏ hỏng</td><td><strong>CÓ</strong> — do chính lệnh ấy gây ra, tái hiện được</td></tr>
<tr><td><strong>Timer</strong> (bộ định thời)</td><td>Sinh ra bởi một <strong>bộ định thời nằm trong bộ xử lý</strong>. Nhờ nó hệ điều hành làm được một số việc theo định kỳ</td><td>Nhịp tick của bộ lập lịch, cướp quyền tiến trình đang chạy</td><td>Không — tới theo nhịp đồng hồ riêng của nó</td></tr>
<tr><td><strong>I/O</strong> (vào/ra)</td><td>Sinh ra bởi một <strong>bộ điều khiển I/O</strong>, để báo một thao tác đã hoàn tất bình thường, để xin bộ xử lý phục vụ, hoặc để báo đủ loại điều kiện lỗi</td><td>"Đọc đĩa xong rồi" · "có người bấm phím"</td><td>Không — phụ thuộc thiết bị và thế giới vật lý</td></tr>
<tr><td><strong>Hardware failure</strong> (hỏng phần cứng)</td><td>Sinh ra bởi một sự cố như <strong>mất điện hoặc lỗi chẵn lẻ bộ nhớ</strong></td><td>Điện sắp tụt · lỗi ECC trong RAM</td><td>Không — và thường là khẩn cấp nhất trong cả bốn</td></tr>
</table>
<ul>
<li><strong>Lớp thứ nhất là lớp khác hẳn ba lớp kia, và đề thi biết điều đó.</strong> Ngắt <em>program</em> do chính lệnh đang chạy gây ra; ba lớp còn lại tới từ bên ngoài dòng lệnh. Nhiều giáo trình gọi loại thứ nhất là <em>trap</em> hoặc <em>exception</em> và chỉ dành chữ "interrupt" cho phần còn lại. Stallings gộp cả bốn dưới một tiêu đề vì cơ chế phần cứng giống hệt nhau — lưu trạng thái, nhảy sang trình phục vụ, quay về.</li>
<li><strong>Lớp timer chính là thứ làm cho đa nhiệm khả thi.</strong> Không có ngắt định thời thì một tiến trình không bao giờ gọi hệ điều hành có thể giữ bộ xử lý mãi mãi; hệ điều hành không còn cách nào giành lại quyền. Mọi bộ lập lịch có cướp quyền mà bạn gặp ở CSI106 chương 5 đều đứng trên đúng một dòng này của bảng.</li>
<li><strong>Lớp I/O là lớp làm động cơ cho slide 14–18.</strong> "Báo một thao tác đã hoàn tất bình thường" chính xác là cách một chương trình được giải thoát khỏi việc ngồi chờ một thiết bị chậm — toàn bộ lập luận của năm slide kế tiếp.</li>
<li><strong>Ngắt hỏng phần cứng mua cho bạn vài mili giây, và vài mili giây là đủ.</strong> Ngắt mất điện nổ ra khi các tụ còn giữ điện, cho máy đủ thời gian xả bộ đệm và tắt sạch sẽ. Hiểu rằng một cái ngắt có thể là LỜI TRĂNG TRỐI chứ không phải một lời yêu cầu thì sẽ hiểu vì sao lớp này thường giữ mức ưu tiên cao nhất.</li>
<li><strong>Nối sang PRF192.</strong> Chia cho 0 trong chương trình C của bạn không "sập một cách thần bí": nó dựng lên một ngắt lớp program, trình phục vụ của hệ điều hành xét thấy không chạy tiếp được, và nó kết liễu tiến trình. Dòng chữ hiện trên terminal là BƯỚC CUỐI của một cái ngắt.</li>
</ul>
<p class="pitfall">⚠️ Đừng lẫn ngắt với lời gọi chương trình con, dù cả hai đều nhảy đi rồi quay về. Lệnh <code>call</code> được VIẾT trong chương trình, xảy ra ở chỗ đoán trước được, và là một phần logic của chính chương trình. Còn ngắt (trừ lớp Program) <strong>không hề nằm trong chương trình</strong> — nó có thể giáng xuống giữa bất kỳ hai lệnh nào, và đó chính xác là lý do PHẦN CỨNG, chứ không phải lập trình viên, phải lo lưu trạng thái.</p>`],

      [14, 'Figure 3.7 — Program Flow of Control Without and With Interrupts',
        `<p class="y-chinh">🎯 Three timelines stacked, all running the same user program that does three WRITE operations. <strong>(a) No interrupts · (b) Interrupts, short I/O wait · (c) Interrupts, long I/O wait.</strong> The user program is cut into segments 1, 2, 3; the I/O program into 4 (I/O Command), 5 (END) and, in (b) and (c), an <em>Interrupt Handler</em>. A ✖ marks "interrupt occurs during course of execution of user program".</p>
<table>
<tr><th>Case</th><th>What the arrows show</th><th>Who waits</th></tr>
<tr><td><strong>(a) No interrupts</strong></td><td>1 → 4 → <em>wait</em> → 5 → 2 → 4 → <em>wait</em> → 5 → 3. User segments stay whole (1, 2, 3)</td><td><strong>The processor waits</strong> inside segment 5 until the device is done — that is the whole cost</td></tr>
<tr><td><strong>(b) Interrupts, short I/O wait</strong></td><td>User segment 2 is split into <strong>2a</strong> and <strong>2b</strong> by a ✖; segment 3 into <strong>3a</strong> and <strong>3b</strong>. Control goes 1 → 4 → back to 2a → ✖ → handler → 5 → 2b …</td><td><strong>Nobody waits.</strong> The device finishes while the user program is still running 2a</td></tr>
<tr><td><strong>(c) Interrupts, long I/O wait</strong></td><td>User segments stay whole (1, 2, 3) again, but the I/O program still has an Interrupt Handler</td><td><strong>The processor still waits</strong> a while — the device is slower than the work available to fill the gap</td></tr>
</table>
<ul>
<li><strong>Look at the numbering and you have read the figure.</strong> In (a) and (c) the user segments are 1, 2, 3; in (b) they are 1, 2a, 2b, 3a, 3b. Segments split <em>only</em> where an interrupt actually struck. Splitting is evidence that useful work was being done at the moment the device finished.</li>
<li><strong>The important difference between (b) and (c) is not the mechanism but the ratio.</strong> Both use interrupts. In (b) the I/O wait is shorter than the user work available, so the wait disappears entirely. In (c) the wait is longer, so some idling remains — interrupts reduced it, they did not abolish it. Slides 17 and 18 put numbers on exactly these two cases.</li>
<li><strong>Segment 5 (END) is the tail of the I/O routine, and it moves.</strong> Without interrupts it runs right after the wait. With interrupts it runs inside the handler, whenever the device signals. Same code, different moment — that relocation in time is what an interrupt <em>is</em>.</li>
<li><strong>The ✖ can land anywhere.</strong> It is drawn in the middle of a user segment on purpose: the device has no idea what the program is doing. That is why the hardware must save enough state to resume at an arbitrary instruction boundary (slide 15).</li>
<li><strong>Compare with polling, which this figure does not draw.</strong> The alternative to (b) is a loop that asks the device "are you done yet?" thousands of times. It burns the processor exactly as case (a) does, but with instructions instead of an idle wait. Interrupts replace asking with being told.</li>
</ul>
<p class="meo">💡 Three timelines, one sentence each: <strong>(a) the processor waits · (b) the processor never waits · (c) the processor waits less.</strong> If you can say which of the three a given scenario matches, you can answer anything asked about this figure.</p>`,
        `<p class="y-chinh">🎯 Ba dải thời gian xếp chồng, cùng chạy một chương trình người dùng có ba thao tác WRITE. <strong>(a) Không ngắt · (b) Có ngắt, chờ I/O NGẮN · (c) Có ngắt, chờ I/O DÀI.</strong> Chương trình người dùng bị cắt thành các đoạn 1, 2, 3; chương trình I/O gồm đoạn 4 (I/O Command), đoạn 5 (END) và, ở (b) và (c), một <em>Interrupt Handler</em> (trình phục vụ ngắt). Dấu ✖ nghĩa là "ngắt xảy ra trong lúc chương trình người dùng đang chạy".</p>
<table>
<tr><th>Trường hợp</th><th>Các mũi tên cho thấy gì</th><th>Ai phải chờ</th></tr>
<tr><td><strong>(a) Không ngắt</strong></td><td>1 → 4 → <em>chờ</em> → 5 → 2 → 4 → <em>chờ</em> → 5 → 3. Các đoạn người dùng còn nguyên vẹn (1, 2, 3)</td><td><strong>Bộ xử lý ngồi chờ</strong> bên trong đoạn 5 cho tới khi thiết bị xong — đó chính là cái giá phải trả</td></tr>
<tr><td><strong>(b) Có ngắt, chờ NGẮN</strong></td><td>Đoạn 2 bị dấu ✖ xẻ thành <strong>2a</strong> và <strong>2b</strong>; đoạn 3 xẻ thành <strong>3a</strong> và <strong>3b</strong>. Quyền điều khiển đi 1 → 4 → về 2a → ✖ → trình phục vụ → 5 → 2b …</td><td><strong>Không ai phải chờ.</strong> Thiết bị làm xong trong lúc chương trình người dùng vẫn đang chạy đoạn 2a</td></tr>
<tr><td><strong>(c) Có ngắt, chờ DÀI</strong></td><td>Các đoạn người dùng lại còn nguyên (1, 2, 3), nhưng chương trình I/O vẫn có trình phục vụ ngắt</td><td><strong>Bộ xử lý VẪN phải chờ</strong> một quãng — thiết bị chậm hơn lượng công việc có sẵn để lấp chỗ trống</td></tr>
</table>
<ul>
<li><strong>Nhìn cách đánh số là đọc xong cả hình.</strong> Ở (a) và (c), các đoạn người dùng là 1, 2, 3; ở (b) chúng là 1, 2a, 2b, 3a, 3b. Đoạn bị xẻ ĐÚNG ở chỗ có ngắt giáng xuống. Việc bị xẻ chính là BẰNG CHỨNG rằng lúc thiết bị làm xong thì máy đang làm việc có ích.</li>
<li><strong>Khác biệt then chốt giữa (b) và (c) không nằm ở cơ chế mà nằm ở TỈ LỆ.</strong> Cả hai đều dùng ngắt. Ở (b), thời gian chờ I/O ngắn hơn lượng việc người dùng còn sẵn, nên thời gian chờ biến mất hoàn toàn. Ở (c), thời gian chờ dài hơn, nên vẫn còn một khoảng ngồi không — ngắt đã giảm nó, chứ không xoá được nó. Slide 17 và 18 sẽ gắn con số cụ thể vào đúng hai trường hợp này.</li>
<li><strong>Đoạn 5 (END) là cái đuôi của thủ tục I/O, và nó DI CHUYỂN.</strong> Không có ngắt thì nó chạy ngay sau quãng chờ. Có ngắt thì nó chạy bên trong trình phục vụ, vào bất cứ lúc nào thiết bị báo hiệu. Cùng một đoạn mã, khác khoảnh khắc — chính sự dời chỗ trong thời gian ấy LÀ cái ngắt.</li>
<li><strong>Dấu ✖ có thể rơi vào bất cứ đâu.</strong> Nó được vẽ nằm GIỮA một đoạn người dùng là có chủ ý: thiết bị hoàn toàn không biết chương trình đang làm gì. Đó là lý do phần cứng phải lưu đủ trạng thái để chạy tiếp từ một ranh giới lệnh bất kỳ (slide 15).</li>
<li><strong>So với kỹ thuật hỏi vòng (polling) mà hình này không vẽ.</strong> Phương án thay cho (b) là một vòng lặp hỏi thiết bị "xong chưa?" hàng nghìn lần. Nó đốt bộ xử lý đúng như trường hợp (a), chỉ khác là đốt bằng lệnh thay vì bằng ngồi không. Ngắt thay việc ĐI HỎI bằng việc ĐƯỢC BÁO.</li>
</ul>
<p class="meo">💡 Ba dải thời gian, mỗi dải một câu: <strong>(a) bộ xử lý ngồi chờ · (b) bộ xử lý không chờ tí nào · (c) bộ xử lý chờ ít đi.</strong> Nói được một tình huống cho trước khớp với dải nào trong ba dải là trả lời được mọi câu hỏi về hình này.</p>`],

      [15, 'Figure 3.8 — Transfer of Control via Interrupts',
        `<p class="y-chinh">🎯 The mechanism, stripped to two columns. The <strong>User Program</strong> is drawn as instructions 1, 2, …, i, i+1, …, M; an arrow marked "<em>Interrupt occurs here</em>" points between <strong>i</strong> and <strong>i+1</strong>; control jumps to the <strong>Interrupt Handler</strong>, runs it, and a second arrow brings control back to instruction <strong>i+1</strong>.</p>
<table>
<tr><th>Step</th><th>Who does it</th><th>What happens</th><th>What breaks if it is skipped</th></tr>
<tr><td>1</td><td>Device</td><td>Raises the interrupt request line</td><td>—</td></tr>
<tr><td>2</td><td>Processor</td><td><strong>Finishes the current instruction</strong> (i) — interrupts are taken between instructions, never inside one</td><td>Half-completed instruction: registers and memory left inconsistent</td></tr>
<tr><td>3</td><td>Processor (hardware)</td><td><strong>Saves the PC</strong> (the address i+1) and the processor status word / condition codes, normally onto a <strong>stack</strong></td><td>No way home — the handler would return to nowhere, and any flags it clobbers would corrupt the user program's next branch</td></tr>
<tr><td>4</td><td>Processor (hardware)</td><td><strong>Loads PC with the address of the interrupt handler</strong>, taken from a fixed location or a vector table</td><td>Nothing would run</td></tr>
<tr><td>5</td><td>Handler (software)</td><td>Saves any <strong>other registers</strong> it will use, services the device, restores them</td><td>The user program resumes with its variables silently changed</td></tr>
<tr><td>6</td><td>Return-from-interrupt instruction</td><td><strong>Restores PSW and PC</strong> from the stack</td><td>—</td></tr>
<tr><td>7</td><td>Processor</td><td>Resumes the user program at instruction <strong>i+1</strong>, which cannot tell anything happened</td><td>—</td></tr>
</table>
<p class="dap-an">✅ Why the saved value is i+1 and not i. PC was incremented during the <em>fetch</em> of instruction i (slide 8), so by the time instruction i finishes, PC already holds i+1. The hardware therefore just saves PC as it stands. Two consequences worth stating in an exam: the interrupted instruction is <strong>completed, not abandoned</strong>, and the resume point is the <strong>next</strong> instruction — which is exactly why the interrupted program is unable to detect the interruption at all.</p>
<ul>
<li><strong>The reason PSW must be saved alongside PC.</strong> The processor status word carries the condition codes (zero, carry, sign, overflow). Suppose instruction i was a compare and instruction i+1 a conditional branch: if the handler runs an addition in between, it overwrites those flags, and i+1 branches on the handler's arithmetic instead of the user's. The program would take a wrong branch with no error and no crash — the worst kind of bug. Saving PSW is not bookkeeping, it is correctness.</li>
<li><strong>Why a stack and not a fixed save area.</strong> A stack makes nesting free: a second interrupt during the handler simply pushes another frame. With a single save location the second interrupt would overwrite the first return address and the user program would never resume. Slide 20 depends entirely on this choice.</li>
<li><strong>The split between hardware and software is examinable.</strong> Hardware saves the minimum needed to return (PC, PSW); the handler's own code saves whatever else it touches. Neither half is enough alone.</li>
<li><strong>Connect to CSI106 chapter 5 and to PRF192.</strong> A process switch is this figure plus one twist: the handler returns to a <em>different</em> program's saved state. And every <code>scanf</code> you ever wrote ends with the CPU doing exactly this dance when the keyboard controller finally raises its line.</li>
<li><strong>Note what the figure deliberately omits</strong> — how the processor knows <em>which</em> handler to run. That is the interrupt vector, and Chapter 7 covers it. Here, "the handler" is a single box.</li>
</ul>
<p class="pitfall">⚠️ A very common wrong answer: "the interrupt causes the current instruction to be aborted". It does not. The processor completes instruction i and only then takes the interrupt, because that is the only way to leave the machine in a state that can be described by a single address. Aborting mid-instruction is what a <em>fault</em> does, and restarting from one is a much harder problem (Chapter 9).</p>`,
        `<p class="y-chinh">🎯 Cơ chế, lột trần thành hai cột. <strong>Chương trình người dùng</strong> vẽ thành các lệnh 1, 2, …, i, i+1, …, M; một mũi tên ghi "<em>Interrupt occurs here</em>" chỉ vào khe giữa lệnh <strong>i</strong> và <strong>i+1</strong>; quyền điều khiển nhảy sang <strong>Interrupt Handler</strong>, chạy hết trình đó, rồi một mũi tên thứ hai đưa quyền về đúng lệnh <strong>i+1</strong>.</p>
<table>
<tr><th>Bước</th><th>Ai làm</th><th>Làm gì</th><th>Bỏ bước này thì hỏng gì</th></tr>
<tr><td>1</td><td>Thiết bị</td><td>Kéo đường tín hiệu yêu cầu ngắt lên</td><td>—</td></tr>
<tr><td>2</td><td>Bộ xử lý</td><td><strong>Chạy nốt lệnh hiện hành</strong> (lệnh i) — ngắt luôn được nhận GIỮA hai lệnh, không bao giờ giữa chừng một lệnh</td><td>Lệnh dở dang: thanh ghi và bộ nhớ ở trạng thái mâu thuẫn</td></tr>
<tr><td>3</td><td>Bộ xử lý (phần cứng)</td><td><strong>LƯU PC</strong> (địa chỉ i+1) và từ trạng thái bộ xử lý / các cờ điều kiện, thường là đẩy vào <strong>NGĂN XẾP</strong></td><td>Không còn đường về — trình phục vụ sẽ quay lại hư không, và mọi cờ nó làm hỏng sẽ phá lệnh rẽ nhánh kế tiếp của chương trình người dùng</td></tr>
<tr><td>4</td><td>Bộ xử lý (phần cứng)</td><td><strong>Nạp vào PC địa chỉ của trình phục vụ ngắt</strong>, lấy từ một ô cố định hoặc từ bảng vector</td><td>Không có gì chạy cả</td></tr>
<tr><td>5</td><td>Trình phục vụ (phần mềm)</td><td>Tự lưu các <strong>thanh ghi khác</strong> mà nó sắp dùng, phục vụ thiết bị, rồi khôi phục lại</td><td>Chương trình người dùng chạy tiếp với các biến bị đổi âm thầm</td></tr>
<tr><td>6</td><td>Lệnh trở về từ ngắt</td><td><strong>Khôi phục PSW và PC</strong> từ ngăn xếp</td><td>—</td></tr>
<tr><td>7</td><td>Bộ xử lý</td><td>Chạy tiếp chương trình người dùng từ lệnh <strong>i+1</strong>, và chương trình ấy không tài nào biết vừa có chuyện gì xảy ra</td><td>—</td></tr>
</table>
<p class="dap-an">✅ Vì sao giá trị được lưu là i+1 chứ không phải i. PC đã được tăng ngay trong bước <em>nạp</em> lệnh i (slide 8), nên tới lúc lệnh i chạy xong thì PC vốn đã chứa i+1. Vậy phần cứng chỉ việc lưu PC nguyên như nó đang có. Hai hệ quả nên viết ra khi làm bài: lệnh bị ngắt được <strong>CHẠY XONG, không bị bỏ dở</strong>, và điểm quay về là lệnh <strong>KẾ TIẾP</strong> — đó chính xác là lý do chương trình bị ngắt hoàn toàn không phát hiện nổi là mình đã bị ngắt.</p>
<ul>
<li><strong>Vì sao PSW phải được lưu cùng với PC.</strong> Từ trạng thái bộ xử lý mang theo các cờ điều kiện (zero, carry, sign, overflow). Giả sử lệnh i là một lệnh so sánh và lệnh i+1 là một lệnh rẽ nhánh có điều kiện: nếu trình phục vụ xen vào giữa và làm một phép cộng, nó ghi đè mấy cái cờ đó, và lệnh i+1 sẽ rẽ nhánh theo phép tính CỦA TRÌNH PHỤC VỤ chứ không theo phép so sánh của người dùng. Chương trình sẽ đi nhầm nhánh mà không báo lỗi, không sập — loại lỗi tệ nhất. Lưu PSW không phải việc sổ sách, nó là tính ĐÚNG ĐẮN.</li>
<li><strong>Vì sao dùng ngăn xếp chứ không phải một ô lưu cố định.</strong> Ngăn xếp làm cho việc lồng nhau trở nên miễn phí: một ngắt thứ hai tới giữa trình phục vụ thì chỉ việc đẩy thêm một khung. Với một ô lưu duy nhất, ngắt thứ hai sẽ ghi đè địa chỉ trở về của ngắt thứ nhất và chương trình người dùng vĩnh viễn không quay lại được. Slide 20 sống hoàn toàn nhờ lựa chọn này.</li>
<li><strong>Ranh giới giữa phần cứng và phần mềm có ra đề.</strong> Phần cứng lưu cái TỐI THIỂU để quay về được (PC, PSW); mã của chính trình phục vụ lưu mọi thứ khác mà nó đụng tới. Thiếu nửa nào cũng không đủ.</li>
<li><strong>Nối sang CSI106 chương 5 và sang PRF192.</strong> Chuyển tiến trình chính là hình này cộng thêm một vặn xoắn: trình phục vụ quay về trạng thái đã lưu của một chương trình KHÁC. Và mọi lệnh <code>scanf</code> bạn từng viết đều kết thúc bằng đúng điệu nhảy này, vào lúc bộ điều khiển bàn phím rốt cuộc cũng kéo đường tín hiệu của nó lên.</li>
<li><strong>Để ý thứ hình CỐ Ý bỏ qua</strong> — làm sao bộ xử lý biết phải chạy trình phục vụ NÀO. Đó là vector ngắt, và Chương 7 mới nói tới. Ở đây, "trình phục vụ" chỉ là một cái hộp.</li>
</ul>
<p class="pitfall">⚠️ Câu trả lời sai rất hay gặp: "ngắt làm lệnh đang chạy bị huỷ bỏ". KHÔNG. Bộ xử lý chạy nốt lệnh i rồi mới nhận ngắt, vì đó là cách duy nhất để cỗ máy nằm ở một trạng thái mô tả được bằng đúng MỘT địa chỉ. Huỷ giữa chừng một lệnh là việc của <em>fault</em>, và khởi động lại từ đó là một bài toán khó hơn nhiều (Chương 9).</p>`],

      [16, 'Figure 3.9 — Instruction Cycle with Interrupts',
        `<p class="y-chinh">🎯 Figure 3.3 with a <strong>third box bolted on</strong>. Now the loop reads START → <em>Fetch Cycle</em> (Fetch Next Instruction) → <em>Execute Cycle</em> (Execute Instruction) → <em>Interrupt Cycle</em> (Check for Interrupt; Process Interrupt) → back to fetch. Two arrows leave the execute box: one labelled <strong>Interrupts Disabled</strong> going straight back to fetch, one labelled <strong>Interrupts Enabled</strong> going on to the interrupt cycle. HALT hangs below the execute box.</p>
<table>
<tr><th>Path</th><th>Condition</th><th>What the processor does</th></tr>
<tr><td>Execute → Fetch (top return line)</td><td><strong>Interrupts disabled</strong></td><td>Ignore any pending request entirely; go fetch the next instruction</td></tr>
<tr><td>Execute → Interrupt cycle</td><td><strong>Interrupts enabled</strong></td><td>Check whether any interrupt is pending</td></tr>
<tr><td>Interrupt cycle → Fetch, no interrupt pending</td><td>—</td><td>Nothing to do; continue normally. Cost: essentially one test</td></tr>
<tr><td>Interrupt cycle → Fetch, interrupt pending</td><td>—</td><td>Save PC and PSW, load handler address into PC — so the <em>next</em> fetch pulls the handler's first instruction</td></tr>
<tr><td>Execute → HALT</td><td>HALT instruction</td><td>Stop</td></tr>
</table>
<ul>
<li><strong>The crucial design decision is WHERE the check sits: after execute, never during it.</strong> That single placement is what guarantees slide 15's rule that instructions are never left half-done. The instruction cycle is the atom of interruptibility.</li>
<li><strong>The check happens every single cycle, and it is nearly free.</strong> The processor does not "look for" interrupts by executing instructions; it samples a hardware line. That is the deep difference from polling: polling costs instructions proportional to how often you ask, an interrupt check costs one signal test per cycle regardless.</li>
<li><strong>"Interrupts Disabled" is a real, needed state, not an oddity.</strong> While a handler is manipulating a half-updated data structure, or while the machine is booting and no handler addresses exist yet, taking an interrupt would be fatal. Disabling is the hardware's mutual exclusion. Slide 20's "sequential interrupt processing" is exactly this path taken for the whole duration of a handler.</li>
<li><strong>Processing an interrupt does not run the handler inside this box.</strong> Look carefully: the interrupt cycle only <em>saves state and changes PC</em>. The handler itself then runs as ordinary instructions through the ordinary fetch–execute loop. That is elegant and worth saying in an exam: <strong>a handler is not special code, it is just code the PC was pointed at.</strong></li>
<li><strong>Cost accounting.</strong> Instruction cycle = fetch + execute + (interrupt check). The added time on the common path is one test; the added time on the rare path is a state save. Interrupts are cheap precisely because the common case is "nothing pending".</li>
</ul>
<p class="meo">💡 Three boxes, three verbs: <strong>fetch · execute · check.</strong> Draw them left to right with one return line on top and you have reproduced Figure 3.9 — the single most likely figure to be asked for by name.</p>`,
        `<p class="y-chinh">🎯 Figure 3.3 được <strong>bắt vít thêm cái hộp thứ ba</strong>. Vòng lặp giờ đọc là START → <em>Fetch Cycle</em> (nạp lệnh kế) → <em>Execute Cycle</em> (thi hành lệnh) → <em>Interrupt Cycle</em> (Check for Interrupt; Process Interrupt — kiểm tra ngắt, xử lý ngắt) → quay lại bước nạp. Từ hộp thi hành có HAI mũi tên đi ra: một cái ghi <strong>Interrupts Disabled</strong> (ngắt bị cấm) về thẳng bước nạp, một cái ghi <strong>Interrupts Enabled</strong> (ngắt được phép) đi tiếp sang chu kỳ ngắt. HALT treo phía dưới hộp thi hành.</p>
<table>
<tr><th>Đường đi</th><th>Điều kiện</th><th>Bộ xử lý làm gì</th></tr>
<tr><td>Thi hành → Nạp (đường về phía trên)</td><td><strong>Ngắt bị cấm</strong></td><td>Bỏ qua hoàn toàn mọi yêu cầu đang treo; đi nạp lệnh kế</td></tr>
<tr><td>Thi hành → Chu kỳ ngắt</td><td><strong>Ngắt được phép</strong></td><td>Kiểm tra xem có ngắt nào đang treo không</td></tr>
<tr><td>Chu kỳ ngắt → Nạp, KHÔNG có ngắt treo</td><td>—</td><td>Chẳng có gì để làm; chạy tiếp bình thường. Chi phí: về cơ bản là một phép thử</td></tr>
<tr><td>Chu kỳ ngắt → Nạp, CÓ ngắt treo</td><td>—</td><td>Lưu PC và PSW, nạp địa chỉ trình phục vụ vào PC — nên lượt nạp <em>kế tiếp</em> sẽ kéo về lệnh đầu tiên của trình phục vụ</td></tr>
<tr><td>Thi hành → HALT</td><td>Gặp lệnh HALT</td><td>Dừng</td></tr>
</table>
<ul>
<li><strong>Quyết định thiết kế then chốt nằm ở CHỖ ĐẶT phép kiểm tra: sau bước thi hành, không bao giờ trong lúc thi hành.</strong> Đúng một vị trí ấy bảo đảm được quy tắc ở slide 15: lệnh không bao giờ bị bỏ dở. Chu trình lệnh chính là NGUYÊN TỬ của khả năng bị ngắt.</li>
<li><strong>Phép kiểm tra chạy ở MỌI chu trình, và gần như miễn phí.</strong> Bộ xử lý không "đi tìm" ngắt bằng cách thi hành lệnh; nó lấy mẫu một đường tín hiệu phần cứng. Đó là khác biệt sâu xa so với hỏi vòng: hỏi vòng tốn số lệnh tỉ lệ với tần suất bạn hỏi, còn kiểm tra ngắt tốn đúng một phép thử tín hiệu mỗi chu trình, bất kể gì.</li>
<li><strong>"Ngắt bị cấm" là một trạng thái THẬT và CẦN, không phải chuyện lạ.</strong> Trong lúc một trình phục vụ đang sửa dở một cấu trúc dữ liệu, hoặc trong lúc máy đang khởi động mà chưa có địa chỉ trình phục vụ nào tồn tại, nhận một cái ngắt là chết. Cấm ngắt chính là cách phần cứng làm loại trừ tương hỗ. Cái gọi là "xử lý ngắt tuần tự" ở slide 20 chính xác là đi đường này suốt cả thời gian chạy trình phục vụ.</li>
<li><strong>Việc "xử lý ngắt" KHÔNG chạy trình phục vụ bên trong cái hộp này.</strong> Nhìn kỹ: chu kỳ ngắt chỉ <em>lưu trạng thái và đổi PC</em>. Bản thân trình phục vụ sau đó chạy như những lệnh bình thường, qua đúng vòng nạp–thi hành bình thường. Điều đó vừa thanh nhã vừa đáng viết vào bài thi: <strong>trình phục vụ ngắt không phải loại mã đặc biệt, nó chỉ là đoạn mã mà PC được chĩa vào.</strong></li>
<li><strong>Tính sổ chi phí.</strong> Chu trình lệnh = nạp + thi hành + (kiểm tra ngắt). Thời gian thêm ở đường phổ biến là một phép thử; thời gian thêm ở đường hiếm là một lượt lưu trạng thái. Ngắt rẻ chính vì trường hợp phổ biến là "chẳng có gì treo cả".</li>
</ul>
<p class="meo">💡 Ba hộp, ba động từ: <strong>nạp · thi hành · kiểm tra.</strong> Vẽ chúng từ trái sang phải với một đường quay về phía trên là bạn đã dựng lại Figure 3.9 — cái hình dễ bị gọi đích danh trong đề nhất.</p>`],

      [17, 'Figure 3.10 — Program Timing: Short I/O Wait',
        `<p class="y-chinh">🎯 The first of the two figures that turn "interrupts are better" into something you can measure. Two vertical time columns: <strong>(a) Without interrupts</strong> — 1, 4, <em>black block</em> ("I/O operation; processor waits"), 5, 2, 4, <em>black block</em>, 5, 3 — and <strong>(b) With interrupts</strong> — 1, 4, 2a, 5, 2b, 4, 3a, 5, 3b, with the note "I/O operation concurrent with processor executing" and <strong>no black blocks at all</strong>.</p>
<table>
<tr><th>Element of the figure</th><th>Meaning</th></tr>
<tr><td>Green blocks 1, 2, 2a, 2b, 3, 3a, 3b</td><td>User program code running</td></tr>
<tr><td>Grey blocks 4 and 5</td><td>I/O routine: <strong>4</strong> issues the I/O command, <strong>5</strong> is the END/completion code</td></tr>
<tr><td><strong>Black blocks</strong> (only in column a)</td><td>"I/O operation; <strong>processor waits</strong>" — wasted time, the thing the whole chapter is trying to delete</td></tr>
<tr><td>Bracket in column b</td><td>"I/O operation <strong>concurrent with</strong> processor executing" — the device and the CPU work at the same time</td></tr>
</table>
<p class="dap-an">✅ Put numbers on it (a worked example, arithmetic verified). Say each user segment 1, 2, 3 takes <strong>100</strong> time units, each I/O routine segment 4 and 5 takes <strong>5</strong>, and the device needs <strong>50</strong> units per operation — a <em>short</em> wait, because 50 &lt; 100.<br>
<strong>(a) Without interrupts:</strong> 100 + 5 + 50 + 5 + 100 + 5 + 50 + 5 + 100 = <strong>420</strong> units, of which <strong>100</strong> are the two black blocks.<br>
<strong>(b) With interrupts:</strong> the processor runs segment 2a while the device works, so nothing is wasted: 100 + 5 + 5 + 100 + 5 + 5 + 100 = <strong>320</strong> units.<br>
<strong>Saving = 420 − 320 = 100 units = 100/420 = 23,8 % of the total run time</strong>, and the processor's idle time drops from 100 units to <strong>zero</strong>. That last sentence is the definition of "short I/O wait": the device is slower than the CPU but not slower than the work left to do.</p>
<ul>
<li><strong>Why the segments split into 2a/2b in column (b) but not in column (a).</strong> The split marks where the completion interrupt struck. In (a) there is no interrupt, so segment 2 runs uninterrupted <em>after</em> the wait; in (b) segment 2 was already running when the device finished, so it gets cut in two around the handler.</li>
<li><strong>Note that the total amount of work is identical in both columns.</strong> Segments 1–5 add up to the same sum. Interrupts do not make any code faster; they <strong>remove idleness</strong>. Say that precisely in an exam: interrupts improve <em>processor utilisation</em>, not instruction speed.</li>
<li><strong>Where the real numbers come from.</strong> A processor at 3 GHz has a cycle of 0,333 ns. A hard disk operation of 10 ms is therefore 10 ms ÷ 0,333 ns = <strong>3,0 × 10<sup>7</sup></strong> — the device is about <strong>30 million times slower</strong> than one CPU cycle, so 30 million cycles' worth of work could be done while waiting. Nothing else in computer architecture has a ratio that large, and that is why interrupts exist at all.</li>
<li><strong>The 5-unit blocks matter too.</strong> Segments 4 and 5 are the I/O routine's own cost — issuing the command and handling completion. Interrupts do not remove that cost; a handler is real work. If the device were extremely fast, the handler overhead could exceed the saving, which is exactly when polling wins. Chapter 7 makes that trade explicit.</li>
</ul>
<p class="pitfall">⚠️ Do not read column (b) as "the program finishes in the same wall-clock time by luck". It finishes sooner because the black blocks are gone. If an exam asks "how much time is saved", the answer is the <strong>total duration of the black blocks that could be filled with user work</strong> — never more than that.</p>`,
        `<p class="y-chinh">🎯 Hình đầu tiên trong hai hình biến câu "có ngắt thì tốt hơn" thành thứ ĐO ĐƯỢC. Hai cột thời gian dọc: <strong>(a) Không có ngắt</strong> — 1, 4, <em>khối đen</em> ("I/O operation; processor waits" — thiết bị làm việc, bộ xử lý ngồi chờ), 5, 2, 4, <em>khối đen</em>, 5, 3 — và <strong>(b) Có ngắt</strong> — 1, 4, 2a, 5, 2b, 4, 3a, 5, 3b, kèm chú thích "I/O operation concurrent with processor executing" và <strong>KHÔNG có khối đen nào</strong>.</p>
<table>
<tr><th>Thành phần trên hình</th><th>Nghĩa</th></tr>
<tr><td>Khối xanh 1, 2, 2a, 2b, 3, 3a, 3b</td><td>Mã chương trình người dùng đang chạy</td></tr>
<tr><td>Khối xám 4 và 5</td><td>Thủ tục I/O: <strong>4</strong> phát lệnh I/O, <strong>5</strong> là đoạn END / xử lý hoàn tất</td></tr>
<tr><td><strong>Khối ĐEN</strong> (chỉ có ở cột a)</td><td>"Thiết bị làm việc; <strong>bộ xử lý ngồi chờ</strong>" — thời gian lãng phí, đúng thứ mà cả chương đang tìm cách xoá</td></tr>
<tr><td>Dấu ngoặc ở cột b</td><td>"Thao tác I/O <strong>chạy ĐỒNG THỜI</strong> với bộ xử lý đang thi hành" — thiết bị và CPU làm việc cùng lúc</td></tr>
</table>
<p class="dap-an">✅ Gắn con số vào (ví dụ tự dựng, phép tính đã kiểm lại). Giả sử mỗi đoạn người dùng 1, 2, 3 tốn <strong>100</strong> đơn vị thời gian, mỗi đoạn thủ tục I/O 4 và 5 tốn <strong>5</strong>, còn thiết bị cần <strong>50</strong> đơn vị cho một thao tác — đây là quãng chờ <em>NGẮN</em>, vì 50 &lt; 100.<br>
<strong>(a) Không ngắt:</strong> 100 + 5 + 50 + 5 + 100 + 5 + 50 + 5 + 100 = <strong>420</strong> đơn vị, trong đó <strong>100</strong> đơn vị là hai khối đen.<br>
<strong>(b) Có ngắt:</strong> bộ xử lý chạy đoạn 2a trong lúc thiết bị làm việc, nên không phí gì cả: 100 + 5 + 5 + 100 + 5 + 5 + 100 = <strong>320</strong> đơn vị.<br>
<strong>Tiết kiệm = 420 − 320 = 100 đơn vị = 100/420 = 23,8 % tổng thời gian chạy</strong>, và thời gian ngồi không của bộ xử lý tụt từ 100 đơn vị xuống <strong>0</strong>. Chính câu cuối ấy là định nghĩa của "chờ I/O ngắn": thiết bị chậm hơn CPU, nhưng không chậm hơn lượng việc còn lại để làm.</p>
<ul>
<li><strong>Vì sao ở cột (b) các đoạn bị xẻ thành 2a/2b mà cột (a) thì không.</strong> Chỗ xẻ đánh dấu nơi cái ngắt báo hoàn tất giáng xuống. Ở (a) không có ngắt, nên đoạn 2 chạy liền mạch <em>sau</em> quãng chờ; ở (b) đoạn 2 vốn đang chạy lúc thiết bị làm xong, nên nó bị cắt đôi quanh trình phục vụ.</li>
<li><strong>Chú ý là TỔNG khối lượng công việc ở hai cột giống hệt nhau.</strong> Các đoạn 1–5 cộng lại bằng nhau. Ngắt KHÔNG làm đoạn mã nào chạy nhanh hơn; nó <strong>xoá đi thời gian ngồi không</strong>. Hãy nói cho chuẩn khi làm bài: ngắt cải thiện <em>hiệu suất sử dụng bộ xử lý</em>, không cải thiện tốc độ thi hành lệnh.</li>
<li><strong>Con số thật lấy ở đâu ra.</strong> Bộ xử lý 3 GHz có chu kỳ 0,333 ns. Một thao tác đĩa cứng 10 ms vậy bằng 10 ms ÷ 0,333 ns = <strong>3,0 × 10<sup>7</sup></strong> — thiết bị chậm hơn một nhịp CPU khoảng <strong>30 TRIỆU lần</strong>, nghĩa là trong lúc chờ có thể làm xong khối lượng việc của 30 triệu nhịp. Không có tỉ số nào khác trong kiến trúc máy tính lớn đến thế, và đó là toàn bộ lý do ngắt tồn tại.</li>
<li><strong>Hai khối 5 đơn vị cũng quan trọng.</strong> Đoạn 4 và 5 là chi phí của chính thủ tục I/O — phát lệnh và xử lý hoàn tất. Ngắt không xoá được chi phí đó; một trình phục vụ là việc làm thật. Nếu thiết bị cực nhanh, chi phí trình phục vụ có thể vượt phần tiết kiệm được, và đó chính là lúc hỏi vòng thắng. Chương 7 sẽ đặt cuộc đánh đổi này ra rõ ràng.</li>
</ul>
<p class="pitfall">⚠️ Đừng đọc cột (b) thành "chương trình tình cờ vẫn xong trong đúng bấy nhiêu thời gian đồng hồ". Nó xong SỚM HƠN vì các khối đen đã biến mất. Nếu đề hỏi "tiết kiệm được bao nhiêu thời gian", đáp án là <strong>tổng độ dài các khối đen có thể lấp bằng công việc người dùng</strong> — không bao giờ nhiều hơn thế.</p>`],

      [18, 'Figure 3.11 — Program Timing: Long I/O Wait',
        `<p class="y-chinh">🎯 The honest companion to slide 17. Same two columns, but now the device is slower than the available work, so <strong>black blocks survive even in the "with interrupts" column</strong>. Column (b) reads 1, 4, 2, <em>black</em>, 5, 4, 3, <em>black</em>, 5, and the bracket says "I/O operation concurrent with processor executing; <strong>then processor waits</strong>".</p>
<table>
<tr><th></th><th>(a) Without interrupts</th><th>(b) With interrupts</th></tr>
<tr><td>Order of blocks</td><td>1, 4, <em>black</em>, 5, 2, 4, <em>black</em>, 5, 3</td><td>1, 4, 2, <em>black</em>, 5, 4, 3, <em>black</em>, 5</td></tr>
<tr><td>User segments</td><td>Whole: 1, 2, 3</td><td>Whole again: 1, 2, 3 — <strong>no 2a/2b split</strong>, because the program ran out of work before the device finished</td></tr>
<tr><td>Idle time</td><td>Two full device operations</td><td>Two device operations <strong>minus</strong> the user work that fitted inside them</td></tr>
</table>
<p class="dap-an">✅ Same units as slide 17 (segments 100, I/O routine 5, but now the device takes <strong>500</strong> — a <em>long</em> wait, 500 &gt; 100).<br>
<strong>(a) Without interrupts:</strong> 100 + 5 + 500 + 5 + 100 + 5 + 500 + 5 + 100 = <strong>1320</strong> units, idle = 1000.<br>
<strong>(b) With interrupts:</strong> segment 1 (0→100), command 4 (100→105), the device runs 105→605 while segment 2 runs 105→205; the processor is then idle 205→605 (400 units), END 5 (605→610), command 4 (610→615), device runs 615→1115 while segment 3 runs 615→715, idle 715→1115 (400), END 5 (1115→1120). Total = <strong>1120</strong> units, idle = 800.<br>
<strong>Saving = 1320 − 1120 = 200 units = 15,2 %</strong> — noticeably less than the 23,8 % of slide 17, and the processor is still idle 800 units out of 1120. <em>Interrupts converted every unit of available user work into overlap, and that is the most they can ever do.</em></p>
<ul>
<li><strong>The exam-critical comparison.</strong> Short wait (slide 17): idle time falls to zero, saving 23,8 %. Long wait (slide 18): idle time falls but does not vanish, saving 15,2 %. Same mechanism, different payoff — and the payoff is capped by <strong>how much independent work the program has</strong>, never by the cleverness of the interrupt system.</li>
<li><strong>The user segments are NOT split in column (b), and that is the visual tell.</strong> No 2a/2b means no interrupt arrived mid-segment: the program had already stopped and was waiting when the device signalled. Whenever you see whole segments plus a black block in an "interrupts" column, you are looking at a long I/O wait.</li>
<li><strong>What you would do in real life to fill those 400 idle units.</strong> Run a <em>different</em> program. That is multiprogramming, and it is why Chapter 9 (OS support) exists: one program cannot always keep the processor busy, but several usually can. Slide 18 is the argument for multitasking, drawn before the word is introduced.</li>
<li><strong>Keep the two figures' names straight.</strong> Figure 3.10 = short I/O wait, Figure 3.11 = long I/O wait. Both appeared already as rows (b) and (c) of Figure 3.7 on slide 14; these two slides are the same story told with a time axis instead of control-flow arrows.</li>
<li><strong>A note on the model's honesty.</strong> The sums above assume the device work can start the instant the command is issued and that the handler cost is included in segment 5. Real systems add bus contention and cache effects. The figure is a model for reasoning, not a benchmark — but the direction of every conclusion it supports is correct.</li>
</ul>
<p class="meo">💡 One rule covers both slides: <strong>time saved = min(device wait, user work still available)</strong>, per operation. Short wait ⇒ the minimum is the wait ⇒ idleness vanishes. Long wait ⇒ the minimum is the work ⇒ idleness shrinks by exactly that much.</p>`,
        `<p class="y-chinh">🎯 Người bạn đồng hành trung thực của slide 17. Vẫn hai cột ấy, nhưng lần này thiết bị chậm hơn lượng việc có sẵn, nên <strong>khối đen còn sống sót NGAY CẢ ở cột "có ngắt"</strong>. Cột (b) đọc là 1, 4, 2, <em>đen</em>, 5, 4, 3, <em>đen</em>, 5, và dấu ngoặc ghi "thao tác I/O chạy đồng thời với bộ xử lý; <strong>rồi bộ xử lý ngồi chờ</strong>".</p>
<table>
<tr><th></th><th>(a) Không có ngắt</th><th>(b) Có ngắt</th></tr>
<tr><td>Thứ tự các khối</td><td>1, 4, <em>đen</em>, 5, 2, 4, <em>đen</em>, 5, 3</td><td>1, 4, 2, <em>đen</em>, 5, 4, 3, <em>đen</em>, 5</td></tr>
<tr><td>Đoạn người dùng</td><td>Nguyên vẹn: 1, 2, 3</td><td>Vẫn nguyên vẹn: 1, 2, 3 — <strong>KHÔNG có 2a/2b</strong>, vì chương trình hết việc trước khi thiết bị làm xong</td></tr>
<tr><td>Thời gian ngồi không</td><td>Trọn hai lượt thiết bị làm việc</td><td>Hai lượt thiết bị làm việc <strong>trừ đi</strong> phần việc người dùng nhét lọt vào trong đó</td></tr>
</table>
<p class="dap-an">✅ Vẫn đơn vị như slide 17 (đoạn người dùng 100, thủ tục I/O 5, nhưng thiết bị giờ tốn <strong>500</strong> — quãng chờ <em>DÀI</em>, vì 500 &gt; 100).<br>
<strong>(a) Không ngắt:</strong> 100 + 5 + 500 + 5 + 100 + 5 + 500 + 5 + 100 = <strong>1320</strong> đơn vị, ngồi không = 1000.<br>
<strong>(b) Có ngắt:</strong> đoạn 1 (0→100), lệnh 4 (100→105), thiết bị chạy 105→605 trong khi đoạn 2 chạy 105→205; bộ xử lý ngồi không 205→605 (400 đơn vị), END 5 (605→610), lệnh 4 (610→615), thiết bị chạy 615→1115 trong khi đoạn 3 chạy 615→715, ngồi không 715→1115 (400), END 5 (1115→1120). Tổng = <strong>1120</strong> đơn vị, ngồi không = 800.<br>
<strong>Tiết kiệm = 1320 − 1120 = 200 đơn vị = 15,2 %</strong> — ít hơn hẳn con số 23,8 % của slide 17, và bộ xử lý vẫn ngồi không 800 trên tổng 1120. <em>Ngắt đã biến MỌI đơn vị công việc người dùng còn sẵn thành phần gối đầu, và đó là hết mức nó làm được.</em></p>
<ul>
<li><strong>Phép so sánh quyết định trong đề thi.</strong> Chờ ngắn (slide 17): thời gian ngồi không tụt về 0, tiết kiệm 23,8 %. Chờ dài (slide 18): ngồi không giảm nhưng không biến mất, tiết kiệm 15,2 %. Cùng một cơ chế, khác nhau ở phần thưởng — và phần thưởng bị chặn trên bởi <strong>lượng việc ĐỘC LẬP mà chương trình còn có</strong>, chứ không bởi độ tinh vi của hệ thống ngắt.</li>
<li><strong>Các đoạn người dùng ở cột (b) KHÔNG bị xẻ, và đó là dấu hiệu nhìn thấy được.</strong> Không có 2a/2b nghĩa là không có ngắt nào tới giữa đoạn: chương trình đã dừng và đang chờ sẵn lúc thiết bị báo hiệu. Hễ thấy đoạn nguyên vẹn CỘNG khối đen trong một cột "có ngắt", đó là quãng chờ I/O dài.</li>
<li><strong>Ngoài đời người ta lấp 400 đơn vị ngồi không kia bằng gì.</strong> Bằng cách chạy một chương trình KHÁC. Đó là đa chương trình, và đó là lý do Chương 9 (hỗ trợ của hệ điều hành) tồn tại: một chương trình không phải lúc nào cũng nuôi nổi bộ xử lý, nhưng nhiều chương trình thì thường là được. Slide 18 chính là lập luận cho đa nhiệm, được vẽ ra trước khi cái từ ấy được giới thiệu.</li>
<li><strong>Nhớ cho đúng tên hai hình.</strong> Figure 3.10 = chờ I/O ngắn, Figure 3.11 = chờ I/O dài. Cả hai đã xuất hiện dưới dạng dòng (b) và (c) của Figure 3.7 ở slide 14; hai slide này kể lại đúng câu chuyện ấy bằng TRỤC THỜI GIAN thay vì bằng mũi tên dòng điều khiển.</li>
<li><strong>Một lời về mức trung thực của mô hình.</strong> Các phép cộng ở trên giả định thiết bị bắt đầu làm ngay khoảnh khắc lệnh được phát, và chi phí trình phục vụ đã nằm trong đoạn 5. Hệ thống thật còn thêm tranh chấp bus và ảnh hưởng của cache. Hình là một mô hình để SUY LUẬN, không phải một phép đo chuẩn — nhưng mọi kết luận mà nó chống đỡ đều đúng về chiều hướng.</li>
</ul>
<p class="meo">💡 Một quy tắc phủ cả hai slide: <strong>thời gian tiết kiệm = min(thời gian chờ thiết bị, lượng việc người dùng còn sẵn)</strong>, tính cho mỗi thao tác. Chờ ngắn ⇒ giá trị nhỏ nhất là quãng chờ ⇒ ngồi không biến mất. Chờ dài ⇒ giá trị nhỏ nhất là lượng việc ⇒ ngồi không giảm đúng bằng chừng ấy.</p>`],

      [19, 'Figure 3.12 — Instruction Cycle State Diagram, With Interrupts',
        `<p class="y-chinh">🎯 Figure 3.6 with <strong>two states added at the end</strong>: after <em>Operand store</em> comes <strong>Interrupt check</strong>, and from it two exits — "<em>No interrupt</em>" goes back to <em>Instruction address calculation</em>, "<em>Interrupt</em>" goes to a state called <strong>Interrupt</strong>, which then also rejoins the top of the loop.</p>
<table>
<tr><th>State</th><th>New in this figure?</th><th>What happens</th></tr>
<tr><td>iac · if · iod · oac · of · do · oac · os</td><td>No — all from Figure 3.6</td><td>The ordinary instruction cycle</td></tr>
<tr><td><strong>Interrupt check</strong></td><td><strong>Yes</strong></td><td>Test the interrupt line. Cost: essentially nothing when nothing is pending</td></tr>
<tr><td><strong>Interrupt</strong></td><td><strong>Yes</strong></td><td>Save PC and PSW, load the handler's address into PC — the state machine then returns to instruction address calculation and the <em>handler</em> is what gets fetched</td></tr>
</table>
<ul>
<li><strong>The whole figure is the state-machine form of Figure 3.9, and the mapping is one to one.</strong> Fetch cycle = iac + if; execute cycle = iod through os; interrupt cycle = interrupt check + interrupt. If an exam gives you one figure and asks for the other, this correspondence is the answer.</li>
<li><strong>The "Interrupt" state contains no handler code.</strong> Exactly as on slide 16: it only saves state and redirects PC. The handler is then fetched and executed by the same loop as any other program, which is why the diagram has no separate branch for it.</li>
<li><strong>Look where the check sits: after operand store, i.e. after the instruction is completely finished.</strong> The diagram encodes slide 15's guarantee visually — there is no arrow from the middle of the cycle to the Interrupt state, so an instruction can never be abandoned half-way.</li>
<li><strong>The loops from Figure 3.6 all survive.</strong> "Multiple operands", "multiple results" and "return for string or vector data" are still drawn. Add interrupts to a long string instruction and you get a real design question: must a string copy of a million bytes run to completion before an interrupt can be taken? Real machines make such instructions <em>interruptible and restartable</em> — a question this diagram raises and Chapter 16 answers.</li>
<li><strong>Everything you need for this half of the chapter is now on one page.</strong> Nine states. Being able to draw it, name each state, and say which of them a given instruction visits is the highest-value single thing you can take from Chapter 3's first half.</li>
</ul>
<p class="pitfall">⚠️ Do not put the Interrupt check <em>before</em> the fetch when you redraw this. It goes at the <strong>end</strong> of the cycle, after the instruction completes. Drawing it at the start is the single most common error, and it quietly contradicts the rule that an interrupt is taken between instructions after the current one has finished.</p>`,
        `<p class="y-chinh">🎯 Figure 3.6 được <strong>thêm hai trạng thái ở cuối</strong>: sau <em>Operand store</em> là <strong>Interrupt check</strong>, và từ đó có hai lối ra — "<em>No interrupt</em>" quay về <em>Instruction address calculation</em>, còn "<em>Interrupt</em>" đi sang một trạng thái tên là <strong>Interrupt</strong>, rồi trạng thái này cũng nhập lại đầu vòng lặp.</p>
<table>
<tr><th>Trạng thái</th><th>Mới ở hình này?</th><th>Chuyện gì xảy ra</th></tr>
<tr><td>iac · if · iod · oac · of · do · oac · os</td><td>Không — đều từ Figure 3.6</td><td>Chu trình lệnh bình thường</td></tr>
<tr><td><strong>Interrupt check</strong></td><td><strong>CÓ</strong></td><td>Thử đường tín hiệu ngắt. Chi phí: gần như bằng không khi chẳng có gì treo</td></tr>
<tr><td><strong>Interrupt</strong></td><td><strong>CÓ</strong></td><td>Lưu PC và PSW, nạp địa chỉ trình phục vụ vào PC — máy trạng thái sau đó quay về bước tính địa chỉ lệnh, và thứ được nạp về chính là <em>trình phục vụ</em></td></tr>
</table>
<ul>
<li><strong>Cả hình này là dạng MÁY TRẠNG THÁI của Figure 3.9, và ánh xạ là một–một.</strong> Chu kỳ nạp = iac + if; chu kỳ thi hành = từ iod tới os; chu kỳ ngắt = interrupt check + interrupt. Nếu đề cho một hình rồi bắt vẽ hình kia, chính sự tương ứng này là đáp án.</li>
<li><strong>Trạng thái "Interrupt" KHÔNG chứa mã của trình phục vụ.</strong> Y hệt slide 16: nó chỉ lưu trạng thái và bẻ hướng PC. Trình phục vụ sau đó được nạp và thi hành bằng đúng vòng lặp như mọi chương trình khác, và đó là lý do sơ đồ không có nhánh riêng nào cho nó.</li>
<li><strong>Nhìn kỹ chỗ đặt phép kiểm tra: sau bước ghi toán hạng, tức là sau khi lệnh đã xong hoàn toàn.</strong> Sơ đồ mã hoá lời bảo đảm ở slide 15 thành hình ảnh — không hề có mũi tên nào từ GIỮA chu trình sang trạng thái Interrupt, nên một lệnh không bao giờ bị bỏ dở giữa đường.</li>
<li><strong>Mọi vòng lặp từ Figure 3.6 vẫn còn nguyên.</strong> "Multiple operands", "multiple results" và "return for string or vector data" vẫn được vẽ. Thêm ngắt vào một lệnh xâu dài thì nảy ra một câu hỏi thiết kế thật: một lệnh chép xâu một triệu byte có buộc phải chạy xong mới cho nhận ngắt không? Máy thật làm cho những lệnh như vậy <em>ngắt được và chạy lại tiếp được</em> — một câu hỏi sơ đồ này đặt ra và Chương 16 trả lời.</li>
<li><strong>Mọi thứ bạn cần cho nửa chương này giờ nằm gọn trên một trang.</strong> Chín trạng thái. Vẽ được nó, gọi tên được từng trạng thái, và nói được một lệnh cho trước đi qua những trạng thái nào — đó là thứ đáng giá nhất bạn mang ra khỏi nửa đầu Chương 3.</li>
</ul>
<p class="pitfall">⚠️ Khi vẽ lại, đừng đặt Interrupt check <em>trước</em> bước nạp. Nó nằm ở <strong>CUỐI</strong> chu trình, sau khi lệnh chạy xong. Vẽ nó ở đầu là lỗi phổ biến nhất, và nó lặng lẽ mâu thuẫn với quy tắc "ngắt được nhận giữa hai lệnh, sau khi lệnh hiện hành đã hoàn tất".</p>`],

      [20, 'Figure 3.13 — Transfer of Control with Multiple Interrupts',
        `<p class="y-chinh">🎯 What happens when a <strong>second</strong> interrupt arrives while the first is still being handled. Two panels, two policies: <strong>(a) Sequential interrupt processing</strong> — every arrow returns to the user program before the next handler starts; <strong>(b) Nested interrupt processing</strong> — handler Y is entered <em>from inside</em> handler X, and control unwinds X → user program afterwards.</p>
<table>
<tr><th></th><th>(a) Sequential (disable)</th><th>(b) Nested (priority)</th></tr>
<tr><td>What the processor does on entering a handler</td><td><strong>Disables interrupts</strong> for the whole handler</td><td>Leaves <em>higher-priority</em> interrupts <strong>enabled</strong></td></tr>
<tr><td>A second interrupt while handling the first</td><td><strong>Held pending</strong>; taken only after the first handler returns</td><td><strong>Taken immediately</strong> if its priority is higher; held if lower or equal</td></tr>
<tr><td>Shape of the arrows in the figure</td><td>User → X → user → Y → user (a fan from one point of the user program)</td><td>User → X → Y → X → user (Y nests inside X)</td></tr>
<tr><td>Saved states in flight</td><td>Always one</td><td>Several — the stack grows one frame per nesting level</td></tr>
<tr><td>Strength</td><td>Simple; no re-entrancy problems; no stack depth surprises</td><td>An urgent device is served fast, regardless of what is running</td></tr>
<tr><td>Weakness</td><td><strong>Ignores relative urgency</strong> — a critical device waits behind a trivial one</td><td>More complex; handlers must be written to be interrupted safely; deep nesting costs stack</td></tr>
</table>
<ul>
<li><strong>The figure's geometry tells you which panel you are in.</strong> In (a) every arrow touches the <em>user program</em> column between handlers; in (b) an arrow goes handler-to-handler without returning. Look for the return-to-user, not for the labels.</li>
<li><strong>Nesting is only possible because state is saved on a STACK (slide 15).</strong> Each nesting level pushes its own PC and PSW; unwinding pops them in reverse order. With a single fixed save area, panel (b) would destroy the return address of handler X. This is the payoff of a design decision made five slides earlier.</li>
<li><strong>Sequential is not the "wrong" answer.</strong> It is the right answer whenever all devices are equally urgent, and it is what a handler does <em>internally</em> even in a nested system — during the few instructions where it manipulates shared state, it disables interrupts. Real systems use both: nested by policy, sequential in short critical sections.</li>
<li><strong>The cost of sequential in one sentence.</strong> Consider a communications line that must be emptied before the next character arrives, and a printer handler that takes a long time. Under sequential processing the communications data is lost — not delayed, <em>lost</em>. That is why priority exists, and slide 21 is the worked example.</li>
<li><strong>Connect to CSI106.</strong> Interrupt priority is the hardware ancestor of process priority in the OS scheduler. Same idea at two levels of the hierarchy: when two things want the processor, something must rank them.</li>
</ul>
<p class="meo">💡 Two words to keep them apart: <strong>sequential = "disable"</strong>, <strong>nested = "priority"</strong>. Any question about multiple interrupts is asking which of those two policies is in force.</p>`,
        `<p class="y-chinh">🎯 Chuyện gì xảy ra khi một cái ngắt <strong>thứ hai</strong> tới trong lúc cái thứ nhất còn đang được phục vụ. Hai khung, hai chính sách: <strong>(a) Xử lý ngắt TUẦN TỰ</strong> — mọi mũi tên đều quay về chương trình người dùng trước khi trình phục vụ kế tiếp bắt đầu; <strong>(b) Xử lý ngắt LỒNG NHAU</strong> — trình phục vụ Y được vào <em>từ bên trong</em> trình phục vụ X, và sau đó quyền điều khiển tháo ngược X → chương trình người dùng.</p>
<table>
<tr><th></th><th>(a) Tuần tự (cấm ngắt)</th><th>(b) Lồng nhau (ưu tiên)</th></tr>
<tr><td>Bộ xử lý làm gì khi vào một trình phục vụ</td><td><strong>CẤM ngắt</strong> suốt cả trình phục vụ</td><td>Vẫn để ngắt <em>ưu tiên CAO HƠN</em> được <strong>phép</strong></td></tr>
<tr><td>Ngắt thứ hai tới giữa lúc đang phục vụ ngắt thứ nhất</td><td><strong>Bị giữ lại chờ</strong>; chỉ được nhận sau khi trình phục vụ thứ nhất trở về</td><td><strong>Được nhận NGAY</strong> nếu ưu tiên cao hơn; bị giữ lại nếu thấp hơn hoặc bằng</td></tr>
<tr><td>Hình dạng các mũi tên trên hình</td><td>Người dùng → X → người dùng → Y → người dùng (một chùm toả ra từ MỘT điểm của chương trình người dùng)</td><td>Người dùng → X → Y → X → người dùng (Y lồng bên trong X)</td></tr>
<tr><td>Số trạng thái đang được giữ</td><td>Luôn luôn một</td><td>Nhiều — ngăn xếp mọc thêm một khung cho mỗi tầng lồng</td></tr>
<tr><td>Điểm mạnh</td><td>Đơn giản; không có bài toán tái nhập; không bất ngờ về độ sâu ngăn xếp</td><td>Thiết bị khẩn cấp được phục vụ nhanh, bất kể đang chạy cái gì</td></tr>
<tr><td>Điểm yếu</td><td><strong>Bỏ qua mức khẩn cấp tương đối</strong> — một thiết bị sống còn phải xếp hàng sau một thiết bị vặt</td><td>Phức tạp hơn; trình phục vụ phải được viết sao cho bị ngắt vẫn an toàn; lồng sâu thì tốn ngăn xếp</td></tr>
</table>
<ul>
<li><strong>Hình học của hình cho biết bạn đang ở khung nào.</strong> Ở (a), mọi mũi tên đều chạm vào cột <em>chương trình người dùng</em> giữa hai trình phục vụ; ở (b), có một mũi tên đi thẳng từ trình phục vụ này sang trình phục vụ kia mà không quay về. Hãy tìm cái "quay về người dùng", đừng tìm cái nhãn.</li>
<li><strong>Lồng nhau chỉ khả thi VÌ trạng thái được lưu trên NGĂN XẾP (slide 15).</strong> Mỗi tầng lồng đẩy PC và PSW của riêng nó vào; lúc tháo ra thì lấy ngược lại theo thứ tự ngược. Với một ô lưu cố định duy nhất, khung (b) sẽ phá mất địa chỉ trở về của trình phục vụ X. Đây là phần thưởng của một quyết định thiết kế đưa ra từ năm slide trước.</li>
<li><strong>Tuần tự KHÔNG phải câu trả lời "sai".</strong> Nó là câu trả lời đúng mỗi khi mọi thiết bị đều khẩn cấp ngang nhau, và nó cũng chính là thứ mà một trình phục vụ tự làm <em>bên trong</em> ngay cả trong hệ thống lồng nhau — ở vài lệnh nó đụng vào trạng thái dùng chung, nó cấm ngắt. Hệ thống thật dùng cả hai: lồng nhau ở mức chính sách, tuần tự trong các đoạn tới hạn ngắn.</li>
<li><strong>Cái giá của kiểu tuần tự, gói trong một câu.</strong> Hãy hình dung một đường truyền thông phải được dọn sạch trước khi ký tự kế tiếp tới, và một trình phục vụ máy in chạy rất lâu. Với xử lý tuần tự, dữ liệu truyền thông bị MẤT — không phải bị chậm, mà <em>mất</em>. Đó là lý do cơ chế ưu tiên ra đời, và slide 21 là ví dụ chạy tay.</li>
<li><strong>Nối sang CSI106.</strong> Ưu tiên ngắt chính là tổ tiên phần cứng của ưu tiên tiến trình trong bộ lập lịch hệ điều hành. Cùng một ý ở hai tầng của phân cấp: khi hai thứ cùng muốn bộ xử lý, phải có ai đó xếp hạng chúng.</li>
</ul>
<p class="meo">💡 Hai chữ để khỏi lẫn: <strong>tuần tự = "CẤM"</strong>, <strong>lồng nhau = "ƯU TIÊN"</strong>. Mọi câu hỏi về nhiều ngắt đều đang hỏi chính sách nào trong hai cái đó đang có hiệu lực.</p>`],

      [21, 'Figure 3.14 — Example Time Sequence of Multiple Interrupts',
        `<p class="y-chinh">🎯 The worked example, and the one exam question you should be able to reproduce from memory. A user program starts at <strong>t = 0</strong>; a <strong>printer</strong> interrupt arrives at <strong>t = 10</strong>; a <strong>communication</strong> interrupt at <strong>t = 15</strong>; a <strong>disk</strong> interrupt at t = 20 (named in the book's text; the figure labels the transfer at t = 25). Priorities: communication &gt; disk &gt; printer.</p>
<table>
<tr><th colspan="4">NESTED processing — exactly what Figure 3.14 draws</th></tr>
<tr><th>Time</th><th>Who is running</th><th>Why</th><th>Arrow on the figure</th></tr>
<tr><td>0 – 10</td><td>User program</td><td>Nothing pending</td><td>starts at t = 0</td></tr>
<tr><td>10 – 15</td><td><strong>Printer ISR</strong></td><td>Printer interrupt taken</td><td>t = 10</td></tr>
<tr><td>15 – 25</td><td><strong>Communication ISR</strong></td><td>Higher priority → preempts the printer ISR</td><td>t = 15</td></tr>
<tr><td>25 – 35</td><td><strong>Disk ISR</strong></td><td>Disk arrived at t = 20 but had to wait for the higher-priority communication ISR to finish</td><td>t = 25 (two arrows leave here)</td></tr>
<tr><td>35 – 40</td><td><strong>Printer ISR</strong> (resumed)</td><td>Lowest priority, so it finishes last</td><td>t = 35</td></tr>
<tr><td>40 – …</td><td>User program (resumed)</td><td>Stack fully unwound</td><td>t = 40</td></tr>
</table>
<table>
<tr><th colspan="4">SEQUENTIAL processing — the same three interrupts, the same amount of handler work</th></tr>
<tr><th>Time</th><th>Who is running</th><th>Why</th><th></th></tr>
<tr><td>0 – 10</td><td>User program</td><td>Nothing pending</td><td></td></tr>
<tr><td>10 – 20</td><td><strong>Printer ISR</strong>, uninterrupted</td><td>Interrupts disabled for the whole handler; communication (t = 15) and disk (t = 20) are held pending</td><td></td></tr>
<tr><td>20 – 30</td><td><strong>Communication ISR</strong></td><td>Highest priority among the two pending</td><td></td></tr>
<tr><td>30 – 40</td><td><strong>Disk ISR</strong></td><td>Last pending request</td><td></td></tr>
<tr><td>40 – …</td><td>User program (resumed)</td><td>—</td><td></td></tr>
</table>
<p class="dap-an">✅ Read the two tables side by side and the real difference appears — it is <strong>not</strong> the finishing time. Handler work is 10 units each (printer 10→15 plus 35→40 = 10; communication 10; disk 10; total 30), so <em>both policies return to the user program at t = 40</em>. What changes is the <strong>response latency</strong> of each device:</p>
<table>
<tr><th>Device</th><th>Arrives</th><th>Nested: served → finished</th><th>Nested latency</th><th>Sequential: served → finished</th><th>Sequential latency</th></tr>
<tr><td>Printer (lowest priority)</td><td>t = 10</td><td>10 → 40 (in two pieces)</td><td><strong>30</strong></td><td>10 → 20</td><td><strong>10</strong></td></tr>
<tr><td>Communication (highest)</td><td>t = 15</td><td>15 → 25</td><td><strong>10</strong></td><td>20 → 30</td><td><strong>15</strong></td></tr>
<tr><td>Disk (middle)</td><td>t = 20</td><td>25 → 35</td><td><strong>15</strong></td><td>30 → 40</td><td><strong>20</strong></td></tr>
</table>
<p class="dap-an">✅ So nesting <strong>buys latency for the urgent device and charges it to the patient one</strong>: communication drops from 15 to 10, disk from 20 to 15, printer rises from 10 to 30. Since a printer can wait 30 units without anyone noticing and a communications line cannot wait 15 without losing a character, this is a good trade. State it that way in an exam: nesting does not make the machine faster, it <strong>redistributes waiting according to priority</strong>.</p>
<ul>
<li><strong>Read the figure's arrows carefully: two of them leave the communication column at t = 25.</strong> One returns to the printer ISR, one goes on to the disk ISR. Only the second one is taken first — the disk request was pending, so control drops into the disk handler rather than back to the printer.</li>
<li><strong>The t = 20 disk arrival is NOT labelled on the slide.</strong> The figure marks t = 25, the moment the disk handler is entered. The arrival time comes from the book's prose. If you reason only from the picture you will get the disk latency wrong, so write t = 20 on your own copy.</li>
<li><strong>The priority ordering is the premise, not a conclusion.</strong> Communication outranks disk which outranks printer because losing a character on a line is unrecoverable, a disk transfer can be retried, and a printer never minds. Changing the ranking changes the whole trace, and an exam may hand you a different ranking on purpose.</li>
<li><strong>Nothing in this example is idle.</strong> From t = 0 to t = 40 the processor is always running <em>something</em>. Compare with slides 17–18: interrupts turn waiting into scheduling, and scheduling is a question of order, not of speed.</li>
</ul>
<p class="pitfall">⚠️ The trap in this figure is assuming the disk handler runs as soon as the disk interrupt arrives at t = 20. It does not — communication is still running and has higher priority, so the disk waits until t = 25. "Nested" does not mean "everything interrupts everything"; it means <strong>higher priority interrupts lower priority, and never the other way round</strong>.</p>`,
        `<p class="y-chinh">🎯 Ví dụ chạy tay, và là câu hỏi thi mà bạn nên dựng lại được từ trí nhớ. Chương trình người dùng bắt đầu ở <strong>t = 0</strong>; ngắt <strong>máy in</strong> tới ở <strong>t = 10</strong>; ngắt <strong>truyền thông</strong> ở <strong>t = 15</strong>; ngắt <strong>đĩa</strong> ở t = 20 (con số này nằm trong phần chữ của sách; hình chỉ ghi nhãn t = 25 là lúc chuyển quyền). Thứ tự ưu tiên: truyền thông &gt; đĩa &gt; máy in.</p>
<table>
<tr><th colspan="4">Xử lý LỒNG NHAU — đúng những gì Figure 3.14 vẽ</th></tr>
<tr><th>Thời điểm</th><th>Ai đang chạy</th><th>Vì sao</th><th>Mũi tên trên hình</th></tr>
<tr><td>0 – 10</td><td>Chương trình người dùng</td><td>Chưa có gì treo</td><td>bắt đầu ở t = 0</td></tr>
<tr><td>10 – 15</td><td><strong>Trình phục vụ MÁY IN</strong></td><td>Ngắt máy in được nhận</td><td>t = 10</td></tr>
<tr><td>15 – 25</td><td><strong>Trình phục vụ TRUYỀN THÔNG</strong></td><td>Ưu tiên cao hơn → cướp quyền của trình phục vụ máy in</td><td>t = 15</td></tr>
<tr><td>25 – 35</td><td><strong>Trình phục vụ ĐĨA</strong></td><td>Ngắt đĩa tới từ t = 20 nhưng phải chờ trình phục vụ truyền thông (ưu tiên cao hơn) chạy xong</td><td>t = 25 (có HAI mũi tên rời khỏi đây)</td></tr>
<tr><td>35 – 40</td><td><strong>Trình phục vụ MÁY IN</strong> (chạy tiếp)</td><td>Ưu tiên thấp nhất nên xong sau cùng</td><td>t = 35</td></tr>
<tr><td>40 – …</td><td>Chương trình người dùng (chạy tiếp)</td><td>Ngăn xếp đã tháo hết</td><td>t = 40</td></tr>
</table>
<table>
<tr><th colspan="4">Xử lý TUẦN TỰ — cũng ba ngắt ấy, cũng chừng ấy khối lượng công việc phục vụ</th></tr>
<tr><th>Thời điểm</th><th>Ai đang chạy</th><th>Vì sao</th><th></th></tr>
<tr><td>0 – 10</td><td>Chương trình người dùng</td><td>Chưa có gì treo</td><td></td></tr>
<tr><td>10 – 20</td><td><strong>Trình phục vụ MÁY IN</strong>, chạy liền mạch</td><td>Ngắt bị cấm suốt trình phục vụ; truyền thông (t = 15) và đĩa (t = 20) đều bị giữ lại chờ</td><td></td></tr>
<tr><td>20 – 30</td><td><strong>Trình phục vụ TRUYỀN THÔNG</strong></td><td>Ưu tiên cao nhất trong hai cái đang treo</td><td></td></tr>
<tr><td>30 – 40</td><td><strong>Trình phục vụ ĐĨA</strong></td><td>Yêu cầu treo còn lại cuối cùng</td><td></td></tr>
<tr><td>40 – …</td><td>Chương trình người dùng (chạy tiếp)</td><td>—</td><td></td></tr>
</table>
<p class="dap-an">✅ Đặt hai bảng cạnh nhau thì khác biệt THẬT hiện ra — và nó <strong>KHÔNG</strong> nằm ở thời điểm kết thúc. Mỗi trình phục vụ tốn 10 đơn vị (máy in: 10→15 cộng 35→40 = 10; truyền thông 10; đĩa 10; tổng 30), nên <em>cả hai chính sách đều trả quyền về chương trình người dùng ở t = 40</em>. Thứ thay đổi là <strong>ĐỘ TRỄ ĐÁP ỨNG</strong> của từng thiết bị:</p>
<table>
<tr><th>Thiết bị</th><th>Tới lúc</th><th>Lồng: được phục vụ → xong</th><th>Trễ (lồng)</th><th>Tuần tự: được phục vụ → xong</th><th>Trễ (tuần tự)</th></tr>
<tr><td>Máy in (ưu tiên thấp nhất)</td><td>t = 10</td><td>10 → 40 (làm hai khúc)</td><td><strong>30</strong></td><td>10 → 20</td><td><strong>10</strong></td></tr>
<tr><td>Truyền thông (cao nhất)</td><td>t = 15</td><td>15 → 25</td><td><strong>10</strong></td><td>20 → 30</td><td><strong>15</strong></td></tr>
<tr><td>Đĩa (ở giữa)</td><td>t = 20</td><td>25 → 35</td><td><strong>15</strong></td><td>30 → 40</td><td><strong>20</strong></td></tr>
</table>
<p class="dap-an">✅ Vậy lồng nhau <strong>mua độ trễ cho thiết bị khẩn cấp và bắt thiết bị kiên nhẫn trả tiền</strong>: truyền thông tụt từ 15 xuống 10, đĩa từ 20 xuống 15, còn máy in vọt từ 10 lên 30. Vì máy in chờ 30 đơn vị chẳng ai thấy phiền, còn một đường truyền thông chờ 15 là đã mất một ký tự, đây là một cuộc đổi chác có lời. Hãy viết đúng như vậy khi làm bài: lồng ngắt KHÔNG làm máy nhanh hơn, nó <strong>PHÂN PHỐI LẠI thời gian chờ theo mức ưu tiên</strong>.</p>
<ul>
<li><strong>Đọc kỹ các mũi tên: có HAI cái rời khỏi cột truyền thông ở t = 25.</strong> Một cái quay về trình phục vụ máy in, một cái đi tiếp sang trình phục vụ đĩa. Chỉ cái thứ hai được đi trước — yêu cầu của đĩa đang treo, nên quyền điều khiển rơi vào trình phục vụ đĩa chứ không quay về máy in.</li>
<li><strong>Thời điểm ngắt đĩa tới, t = 20, KHÔNG được ghi nhãn trên slide.</strong> Hình chỉ đánh dấu t = 25, tức lúc bước vào trình phục vụ đĩa. Thời điểm TỚI nằm trong phần chữ của sách. Chỉ nhìn hình mà suy thì sẽ tính sai độ trễ của đĩa, nên hãy tự viết thêm t = 20 vào bản vẽ của mình.</li>
<li><strong>Thứ tự ưu tiên là GIẢ THIẾT, không phải kết luận.</strong> Truyền thông trên đĩa, đĩa trên máy in, vì mất một ký tự trên đường truyền là không cứu được, một lượt truyền đĩa thì thử lại được, còn máy in thì chẳng bao giờ phàn nàn. Đổi thứ tự ưu tiên là đổi cả bảng vết, và đề thi có thể cố tình đưa bạn một thứ tự khác.</li>
<li><strong>Trong ví dụ này không có một giây nào ngồi không.</strong> Từ t = 0 tới t = 40, bộ xử lý luôn chạy một <em>cái gì đó</em>. So với slide 17–18: ngắt biến việc CHỜ thành việc XẾP LỊCH, mà xếp lịch là câu chuyện về THỨ TỰ, không phải về tốc độ.</li>
</ul>
<p class="pitfall">⚠️ Bẫy của hình này là tưởng trình phục vụ đĩa chạy ngay khi ngắt đĩa tới ở t = 20. KHÔNG — truyền thông vẫn đang chạy và có ưu tiên cao hơn, nên đĩa phải chờ tới t = 25. "Lồng nhau" không có nghĩa là "cái gì cũng ngắt được cái gì"; nó nghĩa là <strong>ưu tiên CAO ngắt được ưu tiên THẤP, và không bao giờ ngược lại</strong>.</p>`],

      [22, 'I/O Function',
        `<p class="y-chinh">🎯 The third actor of the chapter gets its own slide. An I/O module can exchange data <strong>directly with the processor</strong> — or, in the arrangement the second half of the slide introduces, <strong>directly with memory</strong>, which is called <strong>direct memory access (DMA)</strong>.</p>
<table>
<tr><th></th><th>Programmed I/O (through the processor)</th><th>Direct memory access (DMA)</th></tr>
<tr><td>Slide's wording</td><td>"Processor can <strong>read data from or write data to</strong> an I/O module"; "processor <strong>identifies a specific device</strong> that is controlled by a particular I/O module"</td><td>"The processor <strong>grants to an I/O module the authority</strong> to read from or write to memory so that the I/O memory transfer can occur <strong>without tying up the processor</strong>"</td></tr>
<tr><td>Who issues the memory commands</td><td>The processor, one word at a time</td><td>"The I/O module issues read or write commands to memory, <strong>relieving the processor of responsibility for the exchange</strong>"</td></tr>
<tr><td>Instructions used</td><td>"<strong>I/O instructions rather than memory referencing instructions</strong>"</td><td>The processor sets up the transfer, then gets out of the way</td></tr>
<tr><td>Registers involved</td><td>I/OAR and I/OBR (slide 5)</td><td>The DMA controller drives the address and data buses itself</td></tr>
<tr><td>Processor cost per word</td><td>One or more instructions</td><td>Effectively zero — one interrupt at the end of the whole block</td></tr>
</table>
<ul>
<li><strong>Read "without tying up the processor" as the punch line of the whole chapter so far.</strong> Interrupts freed the processor from <em>waiting</em>; DMA frees it from <em>carrying</em>. Even with interrupts, a 4 KB disk block moved through I/OBR costs thousands of instructions. With DMA it costs a setup and one interrupt.</li>
<li><strong>Three techniques, in the order they solve each other's problems.</strong> (1) <em>Programmed I/O</em>: the processor polls and copies — simple, wastes everything. (2) <em>Interrupt-driven I/O</em>: no more polling, but the processor still copies every word. (3) <em>DMA</em>: neither polling nor copying. Chapter 7 makes these three the spine of its whole chapter; naming them in order is a standard exam answer.</li>
<li><strong>"I/O instructions rather than memory referencing instructions" is an architectural statement.</strong> It means devices live in a <em>separate</em> address space, reached by special instructions (isolated I/O). The alternative, memory-mapped I/O, gives devices ordinary memory addresses so ordinary load/store instructions reach them — fewer instructions in the ISA, but part of the address space is consumed. Both designs are in use; the slide describes the first.</li>
<li><strong>DMA is not free, it is relocated.</strong> The DMA controller competes with the processor for the bus, so the processor may stall for a cycle when both want it — <em>cycle stealing</em>. The cost moved from instructions to bus contention, which is a far better place for it to live.</li>
<li><strong>Connect to Figure 3.2 (slide 6).</strong> The picture already showed both paths: an arrow from the CPU to the I/O module, and the I/O module sitting on the same system bus as memory. DMA simply uses the second half of that drawing without the CPU in the middle.</li>
</ul>
<p class="pitfall">⚠️ Do not say "DMA means the device interrupts less often". It means the device <strong>does not go through the processor at all</strong> for the data itself. The interrupt count drops as a consequence (one per block instead of one per word), but the mechanism is bus mastery, not interrupt batching.</p>`,
        `<p class="y-chinh">🎯 Nhân vật thứ ba của chương được cấp một slide riêng. Một mô-đun I/O có thể trao đổi dữ liệu <strong>trực tiếp với bộ xử lý</strong> — hoặc, theo cách bố trí mà nửa sau slide giới thiệu, <strong>trực tiếp với BỘ NHỚ</strong>, và cách đó gọi là <strong>truy nhập bộ nhớ trực tiếp (DMA)</strong>.</p>
<table>
<tr><th></th><th>I/O theo chương trình (đi qua bộ xử lý)</th><th>Truy nhập bộ nhớ trực tiếp (DMA)</th></tr>
<tr><td>Nguyên văn slide</td><td>"Bộ xử lý có thể <strong>đọc dữ liệu từ hoặc ghi dữ liệu vào</strong> một mô-đun I/O"; "bộ xử lý <strong>chỉ đích danh một thiết bị</strong> do một mô-đun I/O cụ thể điều khiển"</td><td>"Bộ xử lý <strong>trao cho mô-đun I/O quyền</strong> đọc từ hoặc ghi vào bộ nhớ, để lượt truyền I/O–bộ nhớ diễn ra <strong>mà không trói chân bộ xử lý</strong>"</td></tr>
<tr><td>Ai phát lệnh cho bộ nhớ</td><td>Bộ xử lý, mỗi lần một từ nhớ</td><td>"Mô-đun I/O tự phát lệnh đọc/ghi tới bộ nhớ, <strong>giải phóng bộ xử lý khỏi trách nhiệm về cuộc trao đổi</strong>"</td></tr>
<tr><td>Dùng lệnh gì</td><td>"<strong>Lệnh I/O chứ không phải lệnh tham chiếu bộ nhớ</strong>"</td><td>Bộ xử lý dựng sẵn cuộc truyền rồi tránh ra</td></tr>
<tr><td>Thanh ghi liên quan</td><td>I/OAR và I/OBR (slide 5)</td><td>Bộ điều khiển DMA tự lái bus địa chỉ và bus dữ liệu</td></tr>
<tr><td>Chi phí cho bộ xử lý, tính trên mỗi từ</td><td>Một hoặc vài lệnh</td><td>Coi như bằng không — một cái ngắt ở cuối cả khối</td></tr>
</table>
<ul>
<li><strong>Hãy đọc cụm "mà không trói chân bộ xử lý" như câu chốt của cả chương tới đây.</strong> Ngắt giải phóng bộ xử lý khỏi việc <em>CHỜ</em>; DMA giải phóng nó khỏi việc <em>BÊ VÁC</em>. Ngay cả khi đã có ngắt, một khối đĩa 4 KB đi qua I/OBR vẫn tốn hàng nghìn lệnh. Với DMA thì chỉ tốn một lượt dựng sẵn và một cái ngắt.</li>
<li><strong>Ba kỹ thuật, xếp theo đúng thứ tự chúng giải quyết bài toán của nhau.</strong> (1) <em>I/O theo chương trình</em>: bộ xử lý hỏi vòng rồi tự chép — đơn giản, phí tất cả. (2) <em>I/O điều khiển bằng ngắt</em>: hết hỏi vòng, nhưng bộ xử lý vẫn phải chép từng từ. (3) <em>DMA</em>: không hỏi vòng, cũng không chép. Chương 7 lấy ba cái đó làm xương sống cho cả chương; kể được tên chúng theo đúng thứ tự là một đáp án thi chuẩn.</li>
<li><strong>"Lệnh I/O chứ không phải lệnh tham chiếu bộ nhớ" là một phát biểu KIẾN TRÚC.</strong> Nó nghĩa là thiết bị sống trong một không gian địa chỉ <em>RIÊNG</em>, với tới bằng lệnh chuyên dụng (I/O cách ly). Phương án kia, I/O ánh xạ bộ nhớ, cấp cho thiết bị những địa chỉ nhớ bình thường để lệnh load/store bình thường với tới — tập lệnh gọn hơn, nhưng mất một phần không gian địa chỉ. Cả hai thiết kế đều đang được dùng; slide mô tả cái thứ nhất.</li>
<li><strong>DMA không miễn phí, nó chỉ DỜI CHỖ chi phí.</strong> Bộ điều khiển DMA cạnh tranh bus với bộ xử lý, nên bộ xử lý có thể khựng lại một nhịp khi cả hai cùng muốn — gọi là <em>ăn trộm chu kỳ</em> (cycle stealing). Chi phí dời từ "số lệnh" sang "tranh chấp bus", và đó là một chỗ ở tốt hơn nhiều.</li>
<li><strong>Nối về Figure 3.2 (slide 6).</strong> Bức hình ấy đã vẽ sẵn cả hai đường: một mũi tên từ CPU tới mô-đun I/O, và mô-đun I/O ngồi trên cùng một bus hệ thống với bộ nhớ. DMA đơn giản là dùng nửa sau của bức vẽ đó mà không có CPU đứng giữa.</li>
</ul>
<p class="pitfall">⚠️ Đừng nói "DMA nghĩa là thiết bị ngắt ít lần hơn". Nó nghĩa là thiết bị <strong>hoàn toàn không đi qua bộ xử lý</strong> để chở dữ liệu. Số lần ngắt giảm chỉ là HỆ QUẢ (một lần mỗi khối thay vì một lần mỗi từ), còn cơ chế là quyền làm chủ bus, không phải gom ngắt lại.</p>`],

      [23, 'Figure 3.15 — Computer Modules',
        `<p class="y-chinh">🎯 The closing figure of the "function" half and the opening argument of the "interconnection" half: each of the three modules drawn as a <strong>black box with its signal lines labelled</strong>. Whatever bus you design next must carry exactly these arrows and nothing more.</p>
<table>
<tr><th>Module</th><th>Inputs (arrows in)</th><th>Outputs (arrows out)</th><th>Note on the drawing</th></tr>
<tr><td><strong>Memory</strong></td><td>Read · Write · Address · Data</td><td>Data</td><td>Contains <em>N Words</em>, addressed 0 … N−1</td></tr>
<tr><td><strong>I/O Module</strong></td><td>Read · Write · Address · Internal Data · External Data</td><td>Internal Data · External Data · <strong>Interrupt Signals</strong></td><td>Contains <em>M Ports</em></td></tr>
<tr><td><strong>CPU</strong></td><td>Instructions · Data · <strong>Interrupt Signals</strong></td><td>Address · <strong>Control Signals</strong> · Data</td><td>—</td></tr>
</table>
<ul>
<li><strong>Compare the memory box with the I/O box and you can see why I/O is the harder problem.</strong> Memory has four lines in, one out. The I/O module has the same four <em>plus</em> a second data path (External Data, to the device) <em>plus</em> an output nobody else has: Interrupt Signals. Memory never asks for attention; devices do.</li>
<li><strong>Interrupt Signals appear exactly twice, and they match up.</strong> Out of the I/O module, into the CPU. That one pairing is the entire interrupt mechanism of slides 13–21 reduced to a wire. Everything else in those nine slides is what the two ends do about that wire.</li>
<li><strong>Only the CPU emits Control Signals.</strong> Memory and I/O modules receive Read/Write; they never command. That asymmetry is why bus arbitration becomes an issue the moment DMA lets an I/O module drive the bus too — the second half of the chapter spends several slides on exactly that conflict.</li>
<li><strong>The CPU box lists Instructions and Data as separate inputs.</strong> Physically they arrive on the same lines from the same memory; the figure separates them by <em>role</em>, not by wire. This is von Neumann concept 1 and 2 again: same memory, same bus, different meaning.</li>
<li><strong>This figure is the specification for slides 24–46.</strong> Slide 24 will list the types of transfer an interconnection structure must support, and slides 25–28 build the bus that carries them: data lines, address lines, control lines — precisely the three kinds of arrow in this picture. Read Figure 3.15 as a requirements document, and the rest of Chapter 3 as the design that satisfies it.</li>
</ul>
<p class="meo">💡 Three arrow types, three buses. <strong>Address arrows → address bus · Data arrows → data bus · Read/Write/Control/Interrupt arrows → control bus.</strong> If you can classify each of this figure's labels into one of the three, you have already learned the first half of the chapter's second act.</p>`,
        `<p class="y-chinh">🎯 Hình khép lại nửa "chức năng" và mở ra lập luận cho nửa "liên kết": mỗi mô-đun trong ba mô-đun được vẽ thành một <strong>hộp đen có ghi nhãn từng đường tín hiệu</strong>. Cái bus mà bạn sắp thiết kế phải chở đúng những mũi tên này, không hơn.</p>
<table>
<tr><th>Mô-đun</th><th>Đầu vào (mũi tên đi vào)</th><th>Đầu ra (mũi tên đi ra)</th><th>Ghi chú trên hình</th></tr>
<tr><td><strong>Memory</strong> (bộ nhớ)</td><td>Read · Write · Address · Data</td><td>Data</td><td>Chứa <em>N Words</em>, đánh địa chỉ 0 … N−1</td></tr>
<tr><td><strong>I/O Module</strong></td><td>Read · Write · Address · Internal Data · External Data</td><td>Internal Data · External Data · <strong>Interrupt Signals</strong></td><td>Chứa <em>M Ports</em> (M cổng)</td></tr>
<tr><td><strong>CPU</strong></td><td>Instructions · Data · <strong>Interrupt Signals</strong></td><td>Address · <strong>Control Signals</strong> · Data</td><td>—</td></tr>
</table>
<ul>
<li><strong>Đem hộp bộ nhớ so với hộp I/O là thấy ngay vì sao I/O mới là bài toán khó.</strong> Bộ nhớ có bốn đường vào, một đường ra. Mô-đun I/O có đúng bốn đường ấy <em>CỘNG</em> một đường dữ liệu thứ hai (External Data, đi ra thiết bị) <em>CỘNG</em> một đầu ra mà không ai khác có: Interrupt Signals. Bộ nhớ không bao giờ đòi được chú ý; thiết bị thì có.</li>
<li><strong>Interrupt Signals xuất hiện đúng hai lần, và hai lần ấy khớp vào nhau.</strong> Đi ra từ mô-đun I/O, đi vào CPU. Đúng một cặp ghép đó chính là toàn bộ cơ chế ngắt của slide 13–21, rút gọn thành một sợi dây. Mọi thứ còn lại trong chín slide kia chỉ là chuyện hai đầu dây ấy ứng xử thế nào.</li>
<li><strong>Chỉ CPU phát Control Signals.</strong> Bộ nhớ và mô-đun I/O NHẬN tín hiệu Read/Write; chúng không bao giờ ra lệnh. Sự bất đối xứng đó là lý do bài toán phân xử bus (arbitration) nảy sinh ngay khoảnh khắc DMA cho phép một mô-đun I/O cũng lái bus — nửa sau của chương dành mấy slide cho đúng cuộc xung đột này.</li>
<li><strong>Hộp CPU liệt kê Instructions và Data thành hai đầu vào riêng.</strong> Về mặt vật lý chúng tới trên cùng những sợi dây, từ cùng một bộ nhớ; hình tách chúng theo <em>VAI TRÒ</em>, không theo dây. Lại chính là ý von Neumann số 1 và số 2: cùng bộ nhớ, cùng bus, khác ý nghĩa.</li>
<li><strong>Hình này là bản ĐẶC TẢ cho slide 24–46.</strong> Slide 24 sẽ liệt kê các kiểu truyền mà một cấu trúc liên kết phải hỗ trợ, và slide 25–28 dựng cái bus chở chúng: đường dữ liệu, đường địa chỉ, đường điều khiển — đúng ba loại mũi tên trong bức hình này. Hãy đọc Figure 3.15 như một bản yêu cầu, và phần còn lại của Chương 3 như bản thiết kế đáp ứng yêu cầu đó.</li>
</ul>
<p class="meo">💡 Ba loại mũi tên, ba cái bus. <strong>Mũi tên Address → bus địa chỉ · mũi tên Data → bus dữ liệu · mũi tên Read/Write/Control/Interrupt → bus điều khiển.</strong> Phân loại được mọi cái nhãn trong hình này vào một trong ba nhóm là bạn đã học trước được nửa đầu của màn hai trong chương.</p>`],
    ]),
  ].join('\n'),
};
