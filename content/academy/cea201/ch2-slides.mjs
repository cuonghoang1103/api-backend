/**
 * CEA201 · Chương 2 — Performance Concepts, học theo từng slide (slide 1–33, trọn deck).
 * Deck 'cea2' (CEA2), 33 slide, ảnh đã render lên CDN images/academy/CEA201/v1/cea2/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH02-COA11e.pptx của trường (/tmp/cea201-text/cea2.txt).
 * Bộ slide CHÍNH HÃNG đi kèm Stallings, "Computer Organization and Architecture:
 * Designing for Performance", 11th Edition Global Edition (Pearson, 2022), tỉ lệ 4:3.
 * Các slide chỉ có tiêu đề + hình/bảng (3, 4, 5, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 31)
 * đã được đọc thẳng từ ảnh render để lấy đúng từng nhãn trong sơ đồ.
 *
 * ⚠️ MỌI con số trong bài đã được kiểm lại bằng python3 trước khi viết:
 *   · Table 2.2 (slide 20): 6 tốc độ MFLOPS, 3 tổng, 3 AM thời gian, 3 nghịch đảo,
 *     3 AM tốc độ, 3 HM tốc độ — khớp 100% với slide.
 *   · Table 2.3 (slide 21) và Table 2.4 (slide 22): toàn bộ giá trị chuẩn hoá, AM và GM
 *     ở cả hai mốc A và B — khớp 100%.
 *   · Table 2.6(b) (slide 29): mọi Ratio = (giây ở Table 2.7 slide 32) ÷ (giây ở slide 29).
 *     Kiểm 10/10 dòng, sai số ≤ 0,02 do làm tròn. Đây là phép đối chiếu CHÉO giữa hai slide.
 *   · Table 2.6(a) (slide 28): Rate = (thời gian máy tham chiếu ÷ thời gian đo) × 768 bản sao.
 *   · Table 2.7 (slide 32): Energy ≈ Seconds × Average Power, kiểm 10/10 dòng.
 *   · Figure 2.6 (slide 18): tính lại MD/AM/GM/HM cho cả 7 tập dữ liệu (a)–(g).
 *   · Định luật Amdahl: mọi ca f/k trong bài; Figure 2.4 (tiệm cận 2 / 4 / 10 / 20) khớp hình.
 *   · Ví dụ CPI = 2,24 · T = 11,2 ms · MIPS = 178,57 (ví dụ 2.2 của sách) kiểm hai đường.
 *
 * Những chỗ SLIDE GỐC SAI hoặc dễ gây hiểu nhầm — đã nêu rõ trong bài, KHÔNG im lặng chép lại
 * và KHÔNG tự ý sửa slide:
 *   · slide 20 (Table 2.2): dòng thứ hai của bảng ghi "Program 1" LẦN THỨ HAI — phải là
 *     "Program 2". Toàn bộ số liệu chỉ có nghĩa khi đọc dòng đó là Program 2.
 *   · slide 21 và slide 22: hai nhãn bảng con đều ghi "(a)" — "(a) Results normalized to
 *     Computer A" rồi lại "(a) Results normalized to Computer B". Cái sau phải là "(b)".
 *   · slide 20 và 21, 22: giá trị chuẩn hoá được làm tròn 2 chữ số (0,38 thay cho 0,375;
 *     2,67 thay cho 2,6667), nên nếu tự tính lại sẽ lệch ở chữ số thứ ba. Không phải sai.
 *   · slide 11 và 14 KHÔNG có công thức nào — công thức Amdahl và Little nằm trong SÁCH,
 *     không nằm trên slide. Bài này nêu rõ chỗ nào là slide, chỗ nào là sách.
 *   · slide 16 (Table 2.1) chỉ có bảng đánh dấu X, KHÔNG có công thức T = Ic × [p + (m × k)] × τ
 *     mà bảng đang nói về. Công thức lấy từ sách, mục 2.6.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea2';

export default {
  title: '2.0 — Slide by slide: Measuring performance, CPI, benchmarks and Amdahl’s law (33 slides)|||2.0 — Slide bài giảng: Đo hiệu năng, CPI, benchmark & định luật Amdahl (33 slide)',
  slug: 'cea201-2-0-slides-hieu-nang-amdahl',
  type: 'DOCUMENT',
  description: 'Trọn Chương 2 của CEA201 (33 slide) theo đúng bộ slide chính hãng Stallings 11th Edition — chương TÍNH TOÁN nặng nhất cả môn. Đi từ sức ép hiệu năng và mất cân bằng giữa CPU với bộ nhớ/I-O, qua năm kỹ thuật tăng tốc trong vi xử lý hiện đại, tới bộ công cụ đo thật sự: xung nhịp và chu kỳ, công thức thời gian CPU = Ic × CPI × τ, CPI trung bình theo tỉ lệ lệnh, MIPS/MFLOPS và vì sao MIPS là thước đo tồi khi so hai kiến trúc khác nhau, ba phép trung bình (số học/hình học/điều hoà) với bảng số chứng minh trung bình số học đổi thứ hạng khi đổi máy làm mốc, bộ benchmark SPEC CPU2017 đọc từng cột, rồi hai định luật đóng khung mọi thiết kế: Amdahl (trần tăng tốc) và Little (L = λ × W). Mọi công thức đều có bài giải từng bước, và có thêm 8 bài luyện dạng đề thi ở cuối. Mọi con số đã được kiểm lại bằng máy, kể cả ba chỗ bảng gốc ghi nhãn sai.',
  content: [
    walkHead(D, 1, 33),
    walk(D, [

      [1, 'Computer Organization and Architecture — Designing for Performance, 11th Edition, Chapter 2: Performance Concepts',
        `<p class="y-chinh">🎯 The title slide of the chapter that turns the book's subtitle into arithmetic. Chapter 1 asked <em>what</em> a computer is; Chapter 2 asks <strong>how fast is it, and how would you prove it</strong> — with formulas you will be asked to apply in the exam.</p>
<ul>
<li><strong>This is the calculation chapter.</strong> Most of CEA201 is definitions and diagrams. Chapter 2 is the one that hands you equations: execution time, CPI, MIPS, MFLOPS, three kinds of mean, Amdahl's law and Little's law. More exam marks per slide live here than anywhere else in the course.</li>
<li><strong>The chapter has three movements.</strong> Slides 2–10: <em>why</em> performance is hard (speed, balance, power, the move to multicore). Slides 11–15: the two <em>laws</em> (Amdahl, Little) plus the clock. Slides 16–32: <em>measurement</em> — the performance equation, the three means, and the SPEC benchmark suites.</li>
<li><strong>"Performance" in this book always means one thing first:</strong> the <strong>time</strong> a program takes. Every other number (MIPS, MFLOPS, a SPEC ratio) is derived from time, and when a derived number disagrees with time, time wins. Keep that sentence; it settles half the trick questions.</li>
<li><strong>What it connects to.</strong> The reason pipelining (Ch.16) and superscalar (Ch.18) exist is to cut CPI; the reason cache (Ch.4–5) exists is to cut the memory term inside CPI; the reason multicore (Ch.21) disappoints is Amdahl's law, defined right here on slide 11.</li>
<li><strong>What you must bring.</strong> Nothing beyond arithmetic and one idea from maths: the <em>n</em>-th root. If you can compute √(a×b) you can compute a geometric mean of two numbers, and that is the hardest operation in the whole chapter.</li>
</ul>
<p class="meo">💡 Start a formula sheet on slide 1, not slide 16. By the end of this walkthrough it should have exactly eight lines: cycle time, CPU time, average CPI, MIPS, MFLOPS, arithmetic/geometric/harmonic mean, Amdahl, Little. Eight lines answer every numeric question this chapter can ask.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề của chương biến phụ đề cuốn sách thành phép tính. Chương 1 hỏi máy tính <em>là gì</em>; Chương 2 hỏi <strong>nó nhanh bao nhiêu, và bạn chứng minh bằng cách nào</strong> — bằng những công thức mà đề thi sẽ bắt bạn áp dụng.</p>
<ul>
<li><strong>Đây là chương TÍNH TOÁN.</strong> Phần lớn CEA201 là định nghĩa và sơ đồ. Chương 2 là chương đưa cho bạn phương trình: thời gian thi hành, CPI, MIPS, MFLOPS, ba loại trung bình, định luật Amdahl và định luật Little. Số điểm thi trên mỗi slide ở đây cao nhất cả môn.</li>
<li><strong>Chương có ba đoạn.</strong> Slide 2–10: <em>VÌ SAO</em> hiệu năng khó (tốc độ, mất cân bằng, điện năng, bước ngoặt sang đa lõi). Slide 11–15: hai <em>ĐỊNH LUẬT</em> (Amdahl, Little) cộng với xung nhịp. Slide 16–32: <em>ĐO ĐẠC</em> — phương trình hiệu năng, ba phép trung bình, và bộ benchmark SPEC.</li>
<li><strong>"Hiệu năng" trong sách này luôn có nghĩa gốc là một thứ:</strong> <strong>THỜI GIAN</strong> chương trình chạy xong. Mọi con số khác (MIPS, MFLOPS, tỉ số SPEC) đều là dẫn xuất của thời gian, và khi một số dẫn xuất mâu thuẫn với thời gian thì THỜI GIAN THẮNG. Nhớ câu đó; nó giải quyết một nửa số câu hỏi bẫy.</li>
<li><strong>Nó nối vào đâu.</strong> Lý do pipeline (Ch.16) và superscalar (Ch.18) tồn tại là để hạ CPI; lý do cache (Ch.4–5) tồn tại là để hạ phần bộ nhớ nằm trong CPI; lý do đa lõi (Ch.21) gây thất vọng chính là định luật Amdahl, được định nghĩa ngay ở slide 11.</li>
<li><strong>Bạn cần mang theo gì.</strong> Không gì ngoài số học và một ý từ toán: CĂN BẬC <em>n</em>. Tính được √(a×b) là tính được trung bình hình học của hai số, và đó là phép khó nhất của cả chương.</li>
</ul>
<p class="meo">💡 Hãy mở tờ công thức ngay từ slide 1, đừng đợi tới slide 16. Hết bài này nó phải có đúng tám dòng: chu kỳ xung nhịp, thời gian CPU, CPI trung bình, MIPS, MFLOPS, ba phép trung bình, Amdahl, Little. Tám dòng đó trả lời được mọi câu hỏi tính toán của chương này.</p>`],

      [2, 'Designing for Performance',
        `<p class="y-chinh">🎯 The motivation slide: cost falls dramatically while performance and capacity rise equally dramatically — and every drop in price immediately gets eaten by an application that did not exist before.</p>
<ul>
<li><strong>The slide's own comparison</strong> — "today's laptops have the computing power of an IBM mainframe from 10 or 15 years ago", and "processors are so inexpensive that we now have microprocessors we throw away". Both sentences describe the same economics: silicon has become the cheap part of a computer.</li>
<li><strong>The desktop workloads the slide lists</strong> — image processing · three-dimensional rendering · speech recognition · videoconferencing · multimedia authoring · voice and video annotation of files · simulation modeling. Notice what they have in common: all seven are <em>streams of data</em> that must be processed at a fixed real-time rate. A spreadsheet can be slow and nobody dies; a video call cannot.</li>
<li><strong>Servers and cloud</strong> — businesses rely on increasingly powerful servers for transaction and database processing and for massive client/server networks that replaced the mainframe centres of yesteryear; cloud providers use massive high-performance banks of servers for high-volume, high-transaction-rate applications.</li>
<li><strong>Why this matters for the formulas ahead.</strong> On a desktop the quantity that matters is <em>latency</em> — how long one task takes. On a server it is <em>throughput</em> — how many tasks per second. Those are different numbers and the chapter will measure them differently (slide 30: SPEC's <em>speed</em> metric versus <em>rate</em> metric).</li>
<li><strong>The hidden warning.</strong> "Cost drops, performance rises" was true because clock rates rose. Slide 7 will show that this stopped around 2004, which is why slide 9 introduces multicore. Chapter 2 is, in effect, the story of one free lunch ending.</li>
</ul>
<p class="meo">💡 Exam-ready one-liner: <strong>hardware gets cheaper, so software gets hungrier</strong>. The list of seven desktop applications is a favourite "name three" question — remember three that are obviously data streams (image processing, 3D rendering, speech recognition) and you cannot miss.</p>`,
        `<p class="y-chinh">🎯 Slide động cơ: giá giảm dữ dội trong khi hiệu năng và dung lượng tăng cũng dữ dội không kém — và mỗi lần giá giảm là lập tức bị một ứng dụng trước đó chưa từng có ăn hết phần dư.</p>
<ul>
<li><strong>Phép so sánh của chính slide</strong> — "laptop hôm nay có sức tính của một máy lớn IBM cách đây 10–15 năm", và "vi xử lý rẻ tới mức bây giờ ta có những con dùng xong vứt đi". Hai câu đó tả cùng một nền kinh tế: silicon đã trở thành phần RẺ của một cỗ máy tính.</li>
<li><strong>Bảy tải công việc để bàn mà slide liệt kê</strong> — xử lý ảnh · dựng hình ba chiều · nhận dạng tiếng nói · hội nghị truyền hình · biên tập đa phương tiện · chú thích file bằng giọng nói và video · mô phỏng. Để ý điểm chung: cả bảy đều là <em>dòng dữ liệu</em> phải xử lý đúng một nhịp thời gian thực. Bảng tính chạy chậm thì không ai chết; cuộc gọi video thì không được phép.</li>
<li><strong>Máy chủ và điện toán đám mây</strong> — doanh nghiệp dựa vào máy chủ ngày càng mạnh để xử lý giao dịch, cơ sở dữ liệu và những mạng client/server khổng lồ đã thay cho các trung tâm máy lớn ngày xưa; nhà cung cấp đám mây dùng những dàn máy chủ hiệu năng cao để phục vụ ứng dụng khối lượng lớn, tần suất giao dịch cao.</li>
<li><strong>Vì sao điều này quan trọng cho các công thức phía sau.</strong> Trên máy để bàn, đại lượng đáng quan tâm là <em>độ trễ</em> — một việc mất bao lâu. Trên máy chủ là <em>thông lượng</em> — bao nhiêu việc mỗi giây. Đó là hai con số khác nhau và chương này đo chúng bằng hai cách khác nhau (slide 30: chỉ số <em>speed</em> so với chỉ số <em>rate</em> của SPEC).</li>
<li><strong>Lời cảnh báo ẩn.</strong> "Giá giảm, hiệu năng tăng" đúng được là nhờ xung nhịp tăng. Slide 7 sẽ cho thấy chuyện đó DỪNG lại quanh năm 2004, và đó là lý do slide 9 giới thiệu đa lõi. Chương 2 thực chất là câu chuyện về một bữa trưa miễn phí đã hết.</li>
</ul>
<p class="meo">💡 Một câu gọn để đi thi: <strong>phần cứng càng rẻ thì phần mềm càng đói</strong>. Danh sách bảy ứng dụng để bàn là chỗ hay bị hỏi "kể ba cái" — nhớ ba cái rõ ràng là dòng dữ liệu (xử lý ảnh, dựng hình 3D, nhận dạng tiếng nói) là chắc điểm.</p>`],

      [3, 'Microprocessor Speed — techniques built into contemporary processors',
        `<p class="y-chinh">🎯 Five techniques, and every one of them is a whole later chapter. They all attack the same target: <strong>do not let the processor wait</strong>. In the vocabulary of slide 16, all five exist to reduce <code>p</code>, the cycles per instruction.</p>
<table>
<tr><th>Technique</th><th>The slide's own words</th><th>Where it is taught in full</th></tr>
<tr><td><strong>Pipelining</strong></td><td>Processor moves data or instructions into a conceptual pipe with all stages of the pipe processing simultaneously</td><td>Ch.16 (processor structure)</td></tr>
<tr><td><strong>Branch prediction</strong></td><td>Processor looks ahead in the instruction code fetched from memory and predicts which branches, or groups of instructions, are likely to be processed next</td><td>Ch.16, Ch.18</td></tr>
<tr><td><strong>Superscalar execution</strong></td><td>The ability to issue more than one instruction in every processor clock cycle; in effect, multiple parallel pipelines are used</td><td>Ch.18</td></tr>
<tr><td><strong>Data flow analysis</strong></td><td>Processor analyzes which instructions are dependent on each other's results, or data, to create an optimized schedule of instructions</td><td>Ch.18 (out-of-order execution)</td></tr>
<tr><td><strong>Speculative execution</strong></td><td>Using branch prediction and data flow analysis, some processors speculatively execute instructions ahead of their actual appearance in the program execution, holding the results in temporary locations, keeping execution engines as busy as possible</td><td>Ch.18</td></tr>
</table>
<ul>
<li><strong>Read the list as a dependency chain, not five separate tricks.</strong> Pipelining creates the problem (a branch is not resolved until several stages later), branch prediction papers over it, superscalar widens the pipe, data flow analysis decides what may legally be reordered, and speculative execution cashes in on all four. Remove any one and the ones after it lose most of their value.</li>
<li><strong>Every item is organization, not architecture</strong> (Ch.1, slide 2). None of them adds an instruction or changes a result. They only change <em>how long</em>, which is exactly the definition of "transparent to the programmer".</li>
<li><strong>Speculation costs work, not correctness.</strong> When the prediction is wrong the temporary results are thrown away. The processor did useless work and burned power for nothing — a point that comes back on slide 7, where power becomes the limiting factor.</li>
<li><strong>What these five cannot fix.</strong> They speed up instruction handling inside the chip. They do nothing about a slow disk or a slow DRAM — that is slide 4's "performance balance" problem, and cache's job.</li>
</ul>
<p class="pitfall">⚠️ Classic mix-up in exams: <em>superscalar</em> versus <em>pipelining</em>. Pipelining = one instruction at a time <strong>enters</strong> the pipe, several are in flight at different stages. Superscalar = <strong>more than one instruction issued per clock cycle</strong>, i.e. several parallel pipes. A deeply pipelined machine is not automatically superscalar.</p>`,
        `<p class="y-chinh">🎯 Năm kỹ thuật, và mỗi cái là trọn một chương phía sau. Cả năm nhắm cùng một đích: <strong>đừng để bộ xử lý phải chờ</strong>. Theo từ vựng của slide 16, cả năm tồn tại để hạ <code>p</code>, số chu kỳ trên mỗi lệnh.</p>
<table>
<tr><th>Kỹ thuật</th><th>Nguyên văn của slide</th><th>Dạy đầy đủ ở đâu</th></tr>
<tr><td><strong>Pipelining</strong> (ống lệnh)</td><td>Bộ xử lý đưa dữ liệu hoặc lệnh vào một cái "ống" khái niệm, mọi tầng của ống cùng xử lý một lúc</td><td>Ch.16 (cấu trúc bộ xử lý)</td></tr>
<tr><td><strong>Branch prediction</strong> (dự đoán rẽ nhánh)</td><td>Bộ xử lý nhìn trước vào mã lệnh vừa nạp từ bộ nhớ và đoán nhánh nào, hay nhóm lệnh nào, có khả năng được xử lý kế tiếp</td><td>Ch.16, Ch.18</td></tr>
<tr><td><strong>Superscalar execution</strong></td><td>Khả năng phát nhiều hơn một lệnh trong MỖI chu kỳ xung nhịp; thực chất là dùng nhiều ống lệnh song song</td><td>Ch.18</td></tr>
<tr><td><strong>Data flow analysis</strong> (phân tích luồng dữ liệu)</td><td>Bộ xử lý phân tích lệnh nào phụ thuộc kết quả hay dữ liệu của lệnh nào, để lập một lịch thi hành tối ưu</td><td>Ch.18 (thi hành không theo thứ tự)</td></tr>
<tr><td><strong>Speculative execution</strong> (thi hành tiên đoán)</td><td>Dựa vào dự đoán rẽ nhánh và phân tích luồng dữ liệu, một số bộ xử lý thi hành TRƯỚC những lệnh chưa tới lượt, giữ kết quả ở chỗ tạm, cốt để các khối thi hành luôn bận</td><td>Ch.18</td></tr>
</table>
<ul>
<li><strong>Đọc danh sách này như một CHUỖI PHỤ THUỘC, không phải năm mẹo rời.</strong> Pipeline tạo ra vấn đề (rẽ nhánh mãi mấy tầng sau mới biết đúng sai), dự đoán rẽ nhánh vá vấn đề đó, superscalar nới ống rộng ra, phân tích luồng dữ liệu quyết định cái gì được phép đảo thứ tự, và thi hành tiên đoán thu lời từ cả bốn. Bỏ một cái là những cái sau mất gần hết giá trị.</li>
<li><strong>Cả năm đều là TỔ CHỨC, không phải KIẾN TRÚC</strong> (Ch.1, slide 2). Không cái nào thêm một lệnh hay đổi một kết quả. Chúng chỉ đổi <em>mất bao lâu</em> — đúng định nghĩa "trong suốt với lập trình viên".</li>
<li><strong>Tiên đoán trả giá bằng CÔNG, không phải bằng tính đúng.</strong> Đoán sai thì kết quả tạm bị vứt. Bộ xử lý đã làm việc vô ích và đốt điện vô ích — ý này quay lại ở slide 7, nơi điện năng trở thành yếu tố chặn.</li>
<li><strong>Năm thứ này KHÔNG chữa được gì.</strong> Chúng tăng tốc việc xử lý lệnh bên trong chip. Chúng không làm gì được với một cái đĩa chậm hay một thanh DRAM chậm — đó là bài toán "cân bằng hiệu năng" của slide 4, và là việc của cache.</li>
</ul>
<p class="pitfall">⚠️ Chỗ hay lẫn trong đề: <em>superscalar</em> với <em>pipelining</em>. Pipeline = mỗi lúc MỘT lệnh <strong>đi vào</strong> ống, nhiều lệnh cùng nằm trong ống ở các tầng khác nhau. Superscalar = <strong>phát nhiều hơn một lệnh mỗi chu kỳ</strong>, tức nhiều ống song song. Một máy có ống rất sâu KHÔNG tự động là superscalar.</p>`],

      [4, 'Performance Balance',
        `<p class="y-chinh">🎯 The processor got fast; memory, buses and I/O did not. <strong>Performance balance</strong> is the craft of adjusting the organization and architecture to compensate for the mismatch among the capabilities of the various components.</p>
<table>
<tr><th>Architectural example on the slide</th><th>Which mismatch it attacks</th></tr>
<tr><td>Increase the number of bits retrieved at one time by making DRAMs <strong>"wider" rather than "deeper"</strong> and by using wide bus data paths</td><td>Bandwidth between DRAM and processor</td></tr>
<tr><td>Change the <strong>DRAM interface</strong> to make it more efficient by including a cache or other buffering scheme on the DRAM chip</td><td>DRAM latency / interface efficiency</td></tr>
<tr><td>Reduce the frequency of memory access by incorporating increasingly complex and efficient <strong>cache structures between the processor and main memory</strong></td><td>Number of trips to main memory</td></tr>
<tr><td>Increase the <strong>interconnect bandwidth</strong> between processors and memory by using higher-speed buses and a hierarchy of buses to buffer and structure data flow</td><td>The shared road itself</td></tr>
</table>
<ul>
<li><strong>"Wider rather than deeper" in one sentence.</strong> Deeper = more rows, so more capacity per chip but the same number of bits handed over per access. Wider = more bits handed over per access. When the processor is starved, the useful knob is bits-per-access, not total capacity.</li>
<li><strong>Balance is a systems idea, not a component idea.</strong> Making the fastest possible CPU and bolting it to an ordinary memory produces a machine that is idle most of the time. The designer's job is to make the components' capabilities <em>match</em>, which sometimes means deliberately not buying the fastest part.</li>
<li><strong>Two of the four items are cache.</strong> Cache between processor and memory (item 3) and cache on the DRAM chip itself (item 2). That is how central cache is to this course — Chapters 4 and 5 are both about it.</li>
<li><strong>Balance changes as technology moves.</strong> The book's own example of the moving bottleneck: as processors got faster the bottleneck moved from the processor to memory, then to the interconnect, then to power (slide 7). Every fix relocates the problem rather than removing it.</li>
<li><strong>Connect this to Amdahl (slide 11).</strong> Balancing is Amdahl's law applied to a whole system: speeding up a part that occupies 5% of the time can buy you at most 5% back, no matter how much faster you make it. That is why designers chase the biggest time-share first.</li>
</ul>
<p class="meo">💡 Remember the shape of the slide — a triangle with three corners — as "widen it, buffer it, shorten it": widen the DRAM path, buffer at the DRAM and in caches, shorten the number of trips. Three verbs cover all four bullets.</p>`,
        `<p class="y-chinh">🎯 Bộ xử lý thì nhanh lên; bộ nhớ, bus và I/O thì không. <strong>Cân bằng hiệu năng</strong> là nghề chỉnh tổ chức và kiến trúc để bù cho sự lệch pha giữa năng lực của các thành phần.</p>
<table>
<tr><th>Ví dụ kiến trúc trên slide</th><th>Nó đánh vào lệch pha nào</th></tr>
<tr><td>Tăng số bit lấy về trong một lần bằng cách làm DRAM <strong>"rộng hơn" thay vì "sâu hơn"</strong> và dùng đường dữ liệu bus rộng</td><td>Băng thông giữa DRAM và bộ xử lý</td></tr>
<tr><td>Đổi <strong>giao diện DRAM</strong> cho hiệu quả hơn bằng cách gắn thêm cache hoặc cơ chế đệm ngay trên chip DRAM</td><td>Độ trễ DRAM / hiệu suất giao diện</td></tr>
<tr><td>Giảm SỐ LẦN truy cập bộ nhớ bằng các <strong>cấu trúc cache ngày càng phức tạp và hiệu quả giữa bộ xử lý và bộ nhớ chính</strong></td><td>Số chuyến đi xuống bộ nhớ chính</td></tr>
<tr><td>Tăng <strong>băng thông liên kết</strong> giữa bộ xử lý và bộ nhớ bằng bus tốc độ cao hơn và một PHÂN CẤP bus để đệm và định hình dòng dữ liệu</td><td>Chính con đường dùng chung</td></tr>
</table>
<ul>
<li><strong>"Rộng hơn thay vì sâu hơn" nói gọn một câu.</strong> Sâu hơn = nhiều hàng hơn, tức nhiều dung lượng hơn trên một chip nhưng mỗi lần vẫn trao đi bấy nhiêu bit. Rộng hơn = mỗi lần trao đi NHIỀU BIT HƠN. Khi bộ xử lý đang đói, cái núm hữu ích là số-bit-mỗi-lần, không phải tổng dung lượng.</li>
<li><strong>Cân bằng là ý niệm HỆ THỐNG, không phải ý niệm linh kiện.</strong> Làm ra CPU nhanh nhất có thể rồi cắm vào bộ nhớ tầm thường thì được một cỗ máy rảnh rỗi phần lớn thời gian. Việc của người thiết kế là làm cho năng lực các thành phần <em>khớp nhau</em>, đôi khi nghĩa là cố ý không mua linh kiện nhanh nhất.</li>
<li><strong>Hai trong bốn mục là CACHE.</strong> Cache giữa bộ xử lý và bộ nhớ (mục 3) và cache ngay trên chip DRAM (mục 2). Đủ thấy cache trung tâm cỡ nào trong môn này — Chương 4 và Chương 5 đều nói về nó.</li>
<li><strong>Điểm cân bằng DI CHUYỂN theo công nghệ.</strong> Chính sách nêu ví dụ về chỗ nghẽn biết đi: bộ xử lý nhanh lên thì nghẽn dời từ bộ xử lý sang bộ nhớ, rồi sang liên kết, rồi sang điện năng (slide 7). Mỗi lần vá là dời chỗ nghẽn chứ không xoá được nó.</li>
<li><strong>Nối ý này với Amdahl (slide 11).</strong> Cân bằng chính là định luật Amdahl áp cho cả hệ thống: tăng tốc một phần chỉ chiếm 5% thời gian thì cùng lắm lấy lại được 5%, dù bạn làm nó nhanh gấp bao nhiêu. Nên người thiết kế luôn săn phần chiếm nhiều thời gian nhất trước.</li>
</ul>
<p class="meo">💡 Nhớ hình dáng slide — một tam giác ba góc — bằng ba động từ "NỚI, ĐỆM, RÚT": nới rộng đường DRAM, đệm ở DRAM và ở cache, rút bớt số chuyến đi. Ba động từ phủ hết bốn gạch đầu dòng.</p>`],

      [5, 'Figure 2.1 — Typical I/O Device Data Rates',
        `<p class="y-chinh">🎯 One bar chart, one shock: the devices attached to a computer differ in speed by <strong>nine orders of magnitude</strong>. A keyboard and an Ethernet modem are not "both peripherals" in any useful sense — they are a billion times apart.</p>
<table>
<tr><th>Device (top to bottom on the slide)</th><th>Approximate data rate (bps, log scale)</th></tr>
<tr><td>Ethernet modem (max speed)</td><td>≈ 10<sup>11</sup> (100 Gbps)</td></tr>
<tr><td>Graphics display</td><td>≈ 10<sup>10</sup></td></tr>
<tr><td>Wi-Fi modem (max speed)</td><td>≈ 10<sup>10</sup></td></tr>
<tr><td>Hard disk</td><td>≈ 10<sup>9</sup></td></tr>
<tr><td>Optical disc</td><td>a few × 10<sup>8</sup></td></tr>
<tr><td>Laser printer</td><td>≈ 10<sup>7</sup></td></tr>
<tr><td>Scanner</td><td>≈ 10<sup>7</sup></td></tr>
<tr><td>Mouse</td><td>a few × 10<sup>2</sup></td></tr>
<tr><td>Keyboard</td><td>≈ 10<sup>2</sup></td></tr>
</table>
<ul>
<li><strong>Read the axis before the bars.</strong> The x-axis runs 10<sup>1</sup> to 10<sup>11</sup> — it is <strong>logarithmic</strong>. A bar twice as long is not twice as fast; it is a hundred times faster or more. Every "compare the bars" question is really a question about whether you noticed the exponents.</li>
<li><strong>Why the figure sits in a performance chapter.</strong> It is the evidence for slide 4. No single I/O strategy can serve a 100-byte-per-second keyboard and a 100-gigabit-per-second network link. This is why Chapter 8 will give you three different I/O techniques (programmed, interrupt-driven, DMA) rather than one.</li>
<li><strong>The rule the spread implies.</strong> Slow devices should interrupt the processor, not be polled by it; fast devices should bypass the processor entirely (DMA) and talk straight to memory. The choice is driven by exactly the gap this figure draws.</li>
<li><strong>Note what the chart does not say.</strong> It shows <em>throughput</em> only. A hard disk has huge throughput and terrible <em>latency</em> (milliseconds of seek); a keyboard has negligible throughput and excellent latency. Two different numbers, and Chapter 4 will insist you keep them apart.</li>
<li><strong>A modern caveat worth knowing.</strong> These are 2022 figures and the top of the chart keeps moving; an NVMe SSD today sits near the hard-disk-to-graphics band, not with optical discs. The <em>spread</em> is the lesson, not the individual bar heights.</li>
</ul>
<p class="pitfall">⚠️ Trap: reading a log-scale chart as if it were linear. If a question says "roughly how many times faster is the hard disk than the scanner?", you must subtract exponents — about 10<sup>9</sup> ÷ 10<sup>7</sup> = <strong>100 times</strong>, not "about twice as long a bar".</p>`,
        `<p class="y-chinh">🎯 Một biểu đồ cột, một cú sốc: các thiết bị gắn vào máy tính chênh nhau tốc độ tới <strong>chín bậc mười</strong>. Bàn phím và modem Ethernet không "cùng là ngoại vi" theo bất cứ nghĩa hữu dụng nào — chúng cách nhau cả tỉ lần.</p>
<table>
<tr><th>Thiết bị (từ trên xuống trên slide)</th><th>Tốc độ dữ liệu xấp xỉ (bps, thang log)</th></tr>
<tr><td>Modem Ethernet (tốc độ tối đa)</td><td>≈ 10<sup>11</sup> (100 Gbps)</td></tr>
<tr><td>Màn hình đồ hoạ</td><td>≈ 10<sup>10</sup></td></tr>
<tr><td>Modem Wi-Fi (tốc độ tối đa)</td><td>≈ 10<sup>10</sup></td></tr>
<tr><td>Ổ đĩa cứng</td><td>≈ 10<sup>9</sup></td></tr>
<tr><td>Đĩa quang</td><td>vài × 10<sup>8</sup></td></tr>
<tr><td>Máy in laser</td><td>≈ 10<sup>7</sup></td></tr>
<tr><td>Máy quét (scanner)</td><td>≈ 10<sup>7</sup></td></tr>
<tr><td>Chuột</td><td>vài × 10<sup>2</sup></td></tr>
<tr><td>Bàn phím</td><td>≈ 10<sup>2</sup></td></tr>
</table>
<ul>
<li><strong>Đọc TRỤC trước khi đọc CỘT.</strong> Trục hoành chạy từ 10<sup>1</sup> tới 10<sup>11</sup> — nó là thang <strong>logarit</strong>. Cột dài gấp đôi KHÔNG phải nhanh gấp đôi; nó nhanh gấp trăm lần trở lên. Mọi câu hỏi "so sánh các cột" thực ra là hỏi bạn có để ý số mũ hay không.</li>
<li><strong>Vì sao hình này nằm trong chương hiệu năng.</strong> Nó là bằng chứng cho slide 4. Không một chiến lược I/O đơn lẻ nào phục vụ nổi cả bàn phím 100 byte/giây lẫn đường mạng 100 gigabit/giây. Đó là lý do Chương 8 sẽ đưa cho bạn BA kỹ thuật I/O khác nhau (lập trình sẵn, ngắt, DMA) chứ không phải một.</li>
<li><strong>Quy tắc mà khoảng chênh này ngụ ý.</strong> Thiết bị chậm thì nên NGẮT bộ xử lý chứ đừng bắt nó hỏi vòng; thiết bị nhanh thì nên đi vòng qua bộ xử lý hẳn (DMA) và nói thẳng với bộ nhớ. Lựa chọn ấy do đúng khoảng cách mà hình này vẽ ra quyết định.</li>
<li><strong>Để ý điều hình này KHÔNG nói.</strong> Nó chỉ vẽ <em>thông lượng</em>. Ổ cứng có thông lượng lớn nhưng <em>độ trễ</em> tệ (hàng mili giây tìm kiếm); bàn phím thông lượng không đáng kể nhưng độ trễ rất tốt. Hai con số khác nhau, và Chương 4 sẽ bắt bạn tách bạch chúng.</li>
<li><strong>Một lưu ý thời sự đáng biết.</strong> Đây là số liệu 2022 và đỉnh biểu đồ vẫn đang chạy; một ổ SSD NVMe hôm nay nằm ở dải giữa ổ cứng và màn hình đồ hoạ, chứ không nằm chung với đĩa quang. Bài học là KHOẢNG CHÊNH, không phải chiều cao từng cột.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: đọc biểu đồ thang log như thể nó là thang tuyến tính. Nếu đề hỏi "ổ cứng nhanh hơn máy quét khoảng bao nhiêu lần?", phải TRỪ SỐ MŨ — khoảng 10<sup>9</sup> ÷ 10<sup>7</sup> = <strong>100 lần</strong>, chứ không phải "cột dài hơn chừng gấp đôi".</p>`],

      [6, 'Improvements in Chip Organization and Architecture',
        `<p class="y-chinh">🎯 Three ways to make a processor faster, listed in the order the industry actually tried them: <strong>(1) raise the hardware speed, (2) enlarge and speed up the caches, (3) change the organization and architecture</strong>. Slide 7 will explain why the first one ran out.</p>
<table>
<tr><th>Approach</th><th>How it works, per the slide</th><th>Fate</th></tr>
<tr><td><strong>1. Increase hardware speed of the processor</strong></td><td>Fundamentally due to shrinking logic gate size — more gates, packed more tightly, increasing clock rate; propagation time for signals reduced</td><td>Hit the power wall ≈ 2004 (slide 8)</td></tr>
<tr><td><strong>2. Increase size and speed of caches</strong></td><td>Dedicating part of the processor chip to cache, so cache access times drop significantly</td><td>Still working; now 3 levels (slide 9)</td></tr>
<tr><td><strong>3. Change processor organization and architecture</strong></td><td>Increase effective speed of instruction execution — parallelism</td><td>The current answer: multicore, MIC, GPU</td></tr>
</table>
<ul>
<li><strong>Why shrinking gates raises the clock.</strong> Two effects at once: smaller gates switch faster, and the wire between two gates is shorter, so the signal arrives sooner. Both shorten the longest path through the logic, and the clock period must be at least as long as that path — so a shorter path permits a higher clock rate.</li>
<li><strong>"Dedicating part of the processor chip" is the key phrase for item 2.</strong> Cache is fast not because the memory cells are magic but because they are <em>on the same die</em>: no chip-crossing, no bus arbitration, no DRAM refresh. Chapter 4 will quantify this as the memory hierarchy.</li>
<li><strong>Item 3 is where the chapter is going.</strong> "Parallelism" here covers both the on-chip kind from slide 3 (pipelining, superscalar) and the multi-processor kind from slides 9–10. Both increase the <em>effective</em> execution rate without touching the clock.</li>
<li><strong>Note the phrase "effective speed".</strong> Executing two instructions per cycle at 3 GHz gives the same effective rate as one per cycle at 6 GHz — and costs far less power. That trade is the entire reason the industry turned to parallelism.</li>
<li><strong>Three approaches, three later chapters.</strong> Item 1 → Chapter 3 and the physics in Chapter 12; item 2 → Chapters 4 and 5; item 3 → Chapters 16, 18, 20, 21.</li>
</ul>
<p class="meo">💡 Compress it to three words in order: <strong>FASTER · CLOSER · WIDER</strong>. Faster gates, closer memory, wider execution. Every performance idea in this book is one of the three.</p>`,
        `<p class="y-chinh">🎯 Ba cách làm bộ xử lý nhanh hơn, xếp đúng thứ tự mà ngành công nghiệp đã thử: <strong>(1) tăng tốc độ phần cứng, (2) tăng kích thước và tốc độ cache, (3) đổi tổ chức và kiến trúc</strong>. Slide 7 sẽ giải thích vì sao cách thứ nhất hết đường.</p>
<table>
<tr><th>Hướng</th><th>Slide nói nó hoạt động thế nào</th><th>Số phận</th></tr>
<tr><td><strong>1. Tăng tốc độ phần cứng của bộ xử lý</strong></td><td>Về căn bản là nhờ thu nhỏ cổng logic — nhiều cổng hơn, xếp sít hơn, xung nhịp tăng; thời gian lan truyền tín hiệu giảm</td><td>Đụng bức tường điện năng ≈ 2004 (slide 8)</td></tr>
<tr><td><strong>2. Tăng kích thước và tốc độ cache</strong></td><td>Dành hẳn một phần chip bộ xử lý cho cache, nhờ đó thời gian truy cập cache giảm mạnh</td><td>Vẫn hiệu quả; nay đã 3 cấp (slide 9)</td></tr>
<tr><td><strong>3. Đổi tổ chức và kiến trúc bộ xử lý</strong></td><td>Tăng tốc độ thi hành lệnh HIỆU DỤNG — song song hoá</td><td>Câu trả lời hiện hành: đa lõi, MIC, GPU</td></tr>
</table>
<ul>
<li><strong>Vì sao thu nhỏ cổng lại nâng được xung nhịp.</strong> Hai hiệu ứng cùng lúc: cổng nhỏ hơn thì chuyển trạng thái nhanh hơn, và dây nối giữa hai cổng ngắn hơn nên tín hiệu tới sớm hơn. Cả hai đều rút ngắn ĐƯỜNG DÀI NHẤT xuyên qua khối logic, mà chu kỳ xung nhịp bắt buộc phải dài ít nhất bằng đường đó — nên đường ngắn lại thì được phép tăng xung nhịp.</li>
<li><strong>"Dành hẳn một phần chip" là cụm từ chìa khoá của mục 2.</strong> Cache nhanh không phải vì ô nhớ của nó có phép màu, mà vì nó nằm <em>trên cùng một miếng silicon</em>: không phải vượt chip, không phải tranh bus, không phải làm tươi DRAM. Chương 4 sẽ định lượng chuyện này thành phân cấp bộ nhớ.</li>
<li><strong>Mục 3 là nơi cả chương đang đi tới.</strong> Chữ "song song" ở đây bao gồm cả kiểu trong-chip của slide 3 (pipeline, superscalar) lẫn kiểu nhiều-bộ-xử-lý của slide 9–10. Cả hai đều nâng tốc độ thi hành <em>hiệu dụng</em> mà không đụng tới xung nhịp.</li>
<li><strong>Để ý cụm "tốc độ hiệu dụng".</strong> Thi hành hai lệnh mỗi chu kỳ ở 3 GHz cho cùng tốc độ hiệu dụng như một lệnh mỗi chu kỳ ở 6 GHz — mà tốn ít điện hơn rất nhiều. Chính phép đánh đổi đó là toàn bộ lý do ngành quay sang song song.</li>
<li><strong>Ba hướng, ba chương phía sau.</strong> Mục 1 → Chương 3 và phần vật lý ở Chương 12; mục 2 → Chương 4 và 5; mục 3 → Chương 16, 18, 20, 21.</li>
</ul>
<p class="meo">💡 Nén thành ba chữ đúng thứ tự: <strong>NHANH · GẦN · RỘNG</strong>. Cổng nhanh hơn, bộ nhớ gần hơn, khối thi hành rộng hơn. Mọi ý tưởng hiệu năng trong cuốn sách này đều là một trong ba.</p>`],

      [7, 'Problems with Clock Speed and Logic Density',
        `<p class="y-chinh">🎯 The three walls that ended the clock-rate race: <strong>power · RC delay · memory latency and throughput</strong>. This is the single most important "why" slide in the chapter — it explains why every laptop you own has 8 slow-ish cores instead of one 20 GHz core.</p>
<table>
<tr><th>Wall</th><th>The slide's explanation</th><th>Consequence</th></tr>
<tr><td><strong>Power</strong></td><td>Power density increases with density of logic and clock speed; dissipating the heat becomes the problem</td><td>Clock rate frozen ≈ 3–4 GHz (slide 8)</td></tr>
<tr><td><strong>RC delay</strong></td><td>The speed at which electrons flow is limited by the resistance and capacitance of the metal wires connecting them; delay increases as the RC product increases. As components shrink, wire interconnects become <strong>thinner → resistance up</strong>, and the wires sit <strong>closer together → capacitance up</strong></td><td>Shrinking no longer automatically speeds things up</td></tr>
<tr><td><strong>Memory latency and throughput</strong></td><td>Memory access speed (latency) and transfer speed (throughput) lag processor speeds</td><td>Cache and the whole memory hierarchy (Ch.4–5)</td></tr>
</table>
<ul>
<li><strong>Why RC delay is the cruel one.</strong> Every other consequence of shrinking is good: more gates, shorter distances, faster switching. But the same shrink makes each wire thinner (higher R) and packs wires closer (higher C), and delay grows with R×C. So the transistors keep getting faster while the wires between them get relatively slower. Below a certain size the wires, not the gates, set the clock.</li>
<li><strong>Power in one sentence you can defend.</strong> Dynamic power rises roughly with the clock frequency and with the square of the supply voltage, and pushing the clock higher generally needs a higher voltage — so the power cost of extra clock grows faster than the performance you buy. A chip that cannot shed its heat throttles itself, and then the nominal clock rate is a lie.</li>
<li><strong>Memory is the wall that never fell.</strong> The processor–memory gap has widened for decades; this is the phenomenon sometimes called the "memory wall". Chapter 4's entire memory hierarchy is built around it, and it is why the term <code>m × k</code> appears in the performance equation on slide 16.</li>
<li><strong>The three walls have one shared answer: parallelism.</strong> If you cannot make one core faster, use more cores at a modest clock. That is slide 9, and it is why slide 11 (Amdahl) immediately follows — because the answer has a mathematical limit.</li>
<li><strong>Exam framing.</strong> "Give three reasons why processor clock speed stopped increasing" is a standard question. Power, RC delay, memory latency — in that order, with one sentence each, is a full-mark answer.</li>
</ul>
<p class="pitfall">⚠️ Do not write "the transistors got too small to go faster". The slide says the opposite: gates keep getting faster; it is the <strong>wires</strong> (RC), the <strong>heat</strong> and the <strong>memory</strong> that stop you. Blaming the transistor itself loses the mark.</p>`,
        `<p class="y-chinh">🎯 Ba bức tường đã kết thúc cuộc đua xung nhịp: <strong>điện năng · trễ RC · độ trễ và thông lượng bộ nhớ</strong>. Đây là slide "VÌ SAO" quan trọng nhất cả chương — nó giải thích vì sao cái laptop của bạn có 8 lõi hơi chậm thay vì một lõi 20 GHz.</p>
<table>
<tr><th>Bức tường</th><th>Slide giải thích</th><th>Hệ quả</th></tr>
<tr><td><strong>Điện năng (Power)</strong></td><td>Mật độ công suất tăng theo mật độ logic và theo xung nhịp; TẢN NHIỆT trở thành vấn đề</td><td>Xung nhịp đóng băng ở ≈ 3–4 GHz (slide 8)</td></tr>
<tr><td><strong>Trễ RC</strong></td><td>Tốc độ dòng electron bị giới hạn bởi điện trở và điện dung của dây kim loại nối chúng; độ trễ tăng khi tích RC tăng. Linh kiện nhỏ đi thì dây nối <strong>mảnh hơn → điện trở tăng</strong>, và các dây <strong>nằm sát nhau hơn → điện dung tăng</strong></td><td>Thu nhỏ không còn tự động nhanh lên</td></tr>
<tr><td><strong>Độ trễ &amp; thông lượng bộ nhớ</strong></td><td>Tốc độ truy cập bộ nhớ (độ trễ) và tốc độ truyền (thông lượng) tụt lại sau tốc độ bộ xử lý</td><td>Cache và cả phân cấp bộ nhớ (Ch.4–5)</td></tr>
</table>
<ul>
<li><strong>Vì sao trễ RC là thứ tàn nhẫn.</strong> Mọi hệ quả khác của việc thu nhỏ đều tốt: nhiều cổng hơn, quãng đường ngắn hơn, chuyển trạng thái nhanh hơn. Nhưng chính cái thu nhỏ đó làm mỗi sợi dây MẢNH hơn (R tăng) và các dây SÁT nhau hơn (C tăng), mà độ trễ tăng theo R×C. Vậy là transistor cứ nhanh lên trong khi dây nối giữa chúng chậm đi một cách tương đối. Dưới một kích thước nào đó thì DÂY, chứ không phải cổng, mới là thứ định đoạt xung nhịp.</li>
<li><strong>Điện năng, nói một câu bảo vệ được.</strong> Công suất động tăng xấp xỉ tuyến tính theo tần số và theo BÌNH PHƯƠNG điện áp nguồn, mà muốn đẩy xung nhịp cao hơn thì thường phải nâng điện áp — nên cái giá điện của phần xung nhịp thêm tăng nhanh hơn phần hiệu năng mua được. Con chip không thải nổi nhiệt sẽ tự bóp tốc độ, và lúc đó xung nhịp ghi trên nhãn chỉ là lời nói dối.</li>
<li><strong>Bộ nhớ là bức tường không bao giờ đổ.</strong> Khoảng cách bộ xử lý – bộ nhớ đã nới rộng suốt nhiều thập niên; hiện tượng này đôi khi gọi là "bức tường bộ nhớ". Cả phân cấp bộ nhớ của Chương 4 dựng lên quanh nó, và đó là lý do số hạng <code>m × k</code> xuất hiện trong phương trình hiệu năng ở slide 16.</li>
<li><strong>Ba bức tường có chung MỘT câu trả lời: song song hoá.</strong> Không làm một lõi nhanh hơn được thì dùng nhiều lõi ở xung nhịp vừa phải. Đó là slide 9, và đó là lý do slide 11 (Amdahl) tới ngay sau — vì câu trả lời ấy có một giới hạn toán học.</li>
<li><strong>Cách đề hay hỏi.</strong> "Nêu ba lý do vì sao xung nhịp bộ xử lý ngừng tăng" là câu chuẩn. Điện năng, trễ RC, độ trễ bộ nhớ — đúng thứ tự ấy, mỗi cái một câu, là bài trọn điểm.</li>
</ul>
<p class="pitfall">⚠️ Đừng viết "transistor nhỏ quá nên không nhanh hơn được nữa". Slide nói NGƯỢC LẠI: cổng vẫn cứ nhanh lên; thứ chặn bạn là <strong>DÂY</strong> (RC), là <strong>NHIỆT</strong>, và là <strong>BỘ NHỚ</strong>. Đổ lỗi cho chính con transistor là mất điểm.</p>`],

      [8, 'Figure 2.2 — Processor Trends',
        `<p class="y-chinh">🎯 Four curves on one log chart, 1970 to 2010, and the whole argument of the chapter is in where they <strong>bend</strong>: transistors keep climbing, but frequency and power flatten around <strong>2004</strong> — and exactly there the core count leaves 1.</p>
<table>
<tr><th>Curve</th><th>1970s</th><th>≈ 2004</th><th>2010</th><th>Reading</th></tr>
<tr><td><strong>Transistors (thousands)</strong></td><td>a few ×10<sup>0</sup></td><td>≈ 10<sup>5</sup></td><td>≈ 10<sup>6</sup> (i.e. ~10<sup>9</sup> transistors)</td><td>Straight line on a log axis = <strong>exponential growth</strong>, never bends (Moore's law)</td></tr>
<tr><td><strong>Frequency (MHz)</strong></td><td>≈ 1</td><td>≈ 3×10<sup>3</sup> (3 GHz)</td><td>still ≈ 3×10<sup>3</sup></td><td><strong>Flat after 2004</strong> — the power wall</td></tr>
<tr><td><strong>Power (W)</strong></td><td>&lt; 1</td><td>≈ 100</td><td>≈ 100</td><td>Also flat: that is the <em>cause</em>, not a coincidence</td></tr>
<tr><td><strong>Cores</strong></td><td>1</td><td>1, then leaves 1</td><td>2–8</td><td>Rises exactly where frequency stops</td></tr>
</table>
<ul>
<li><strong>Read the axis first, again.</strong> The y-axis is logarithmic from 0.1 to 10<sup>7</sup>. On such an axis a <em>straight line</em> means exponential growth and a <em>flat line</em> means "stopped growing" — not "small".</li>
<li><strong>The two flats are the same event.</strong> Power flattens because designers refused to go past roughly 100 W per chip (you cannot cool more in a consumer box); frequency flattens because more frequency means more power. Cause and effect, drawn as two lines lying down together.</li>
<li><strong>Transistors did not stop.</strong> This is the crucial asymmetry: Moore's law kept delivering transistors that designers could no longer turn into clock speed. Having transistors you cannot clock faster is precisely the situation that makes <strong>multicore</strong> the only sensible thing to build with them — slide 9.</li>
<li><strong>What this costs the programmer.</strong> Before 2004 a single-threaded program got faster every year for free. After 2004 it does not; extra performance is only available to programs that use several cores, and slide 11 says how much of that is realistically available.</li>
<li><strong>Two caveats about the figure.</strong> It stops at 2010, and the flats have stayed flat since — modern desktops sit at 4–5 GHz, not 30. And "Transistors (Thousands)" means the plotted 10<sup>6</sup> is one <em>billion</em> transistors; read the unit in the legend, not the tick.</li>
</ul>
<p class="meo">💡 Learn this figure as one sentence: <strong>"after 2004, transistors kept doubling but the clock did not, so the extra transistors became extra cores."</strong> That sentence links slides 6, 7, 8, 9 and 11 together.</p>`,
        `<p class="y-chinh">🎯 Bốn đường cong trên một biểu đồ log, từ 1970 tới 2010, và toàn bộ lập luận của chương nằm ở chỗ chúng <strong>GÃY</strong>: transistor cứ leo, nhưng tần số và điện năng nằm ngang quanh <strong>2004</strong> — và đúng chỗ đó, số lõi rời khỏi mức 1.</p>
<table>
<tr><th>Đường</th><th>Thập niên 1970</th><th>≈ 2004</th><th>2010</th><th>Đọc thế nào</th></tr>
<tr><td><strong>Transistor (nghìn)</strong></td><td>vài ×10<sup>0</sup></td><td>≈ 10<sup>5</sup></td><td>≈ 10<sup>6</sup> (tức ~10<sup>9</sup> transistor)</td><td>Đường THẲNG trên trục log = <strong>tăng theo hàm mũ</strong>, không hề gãy (định luật Moore)</td></tr>
<tr><td><strong>Tần số (MHz)</strong></td><td>≈ 1</td><td>≈ 3×10<sup>3</sup> (3 GHz)</td><td>vẫn ≈ 3×10<sup>3</sup></td><td><strong>NẰM NGANG sau 2004</strong> — bức tường điện năng</td></tr>
<tr><td><strong>Điện năng (W)</strong></td><td>&lt; 1</td><td>≈ 100</td><td>≈ 100</td><td>Cũng nằm ngang: đó là NGUYÊN NHÂN, không phải trùng hợp</td></tr>
<tr><td><strong>Số lõi</strong></td><td>1</td><td>1, rồi rời khỏi 1</td><td>2–8</td><td>Đi lên đúng chỗ tần số dừng lại</td></tr>
</table>
<ul>
<li><strong>Lại đọc TRỤC trước.</strong> Trục tung là logarit, từ 0,1 tới 10<sup>7</sup>. Trên trục như thế, đường <em>thẳng</em> nghĩa là tăng theo hàm mũ, còn đường <em>nằm ngang</em> nghĩa là "đã ngừng tăng" — chứ không phải "nhỏ".</li>
<li><strong>Hai đoạn nằm ngang là CÙNG MỘT sự kiện.</strong> Điện năng nằm ngang vì người thiết kế không chịu vượt quá cỡ 100 W mỗi chip (máy dân dụng không tản nổi nhiều hơn); tần số nằm ngang vì tần số cao hơn nghĩa là điện năng cao hơn. Nhân và quả, vẽ thành hai đường cùng nằm xuống.</li>
<li><strong>Transistor thì KHÔNG dừng.</strong> Đây là chỗ bất đối xứng then chốt: định luật Moore vẫn giao transistor, còn người thiết kế thì không biến chúng thành xung nhịp được nữa. Có transistor mà không tăng nhịp được chính là tình huống khiến <strong>ĐA LÕI</strong> trở thành thứ duy nhất hợp lý để làm với chúng — slide 9.</li>
<li><strong>Chuyện này bắt lập trình viên trả giá gì.</strong> Trước 2004, một chương trình đơn luồng cứ mỗi năm lại nhanh lên miễn phí. Sau 2004 thì không; hiệu năng thêm chỉ dành cho chương trình biết dùng nhiều lõi, và slide 11 sẽ nói phần "thêm" ấy thực tế lấy được bao nhiêu.</li>
<li><strong>Hai lưu ý về hình.</strong> Nó dừng ở 2010, và từ đó tới nay hai đoạn ngang vẫn ngang — máy để bàn hiện đại nằm ở 4–5 GHz, không phải 30. Và "Transistors (Thousands)" nghĩa là mức 10<sup>6</sup> trên hình là MỘT TỈ transistor; hãy đọc đơn vị trong chú giải, đừng đọc con số ở vạch trục.</li>
</ul>
<p class="meo">💡 Học hình này thành một câu: <strong>"sau 2004, transistor vẫn nhân đôi nhưng xung nhịp thì không, nên transistor dư biến thành lõi dư."</strong> Câu đó nối slide 6, 7, 8, 9 và 11 lại với nhau.</p>`],

      [9, 'Multicore',
        `<p class="y-chinh">🎯 Four concentric rings, one argument: put <strong>multiple processors on the same chip</strong> and you gain performance <em>without</em> raising the clock rate — which slide 7 just told you is impossible anyway.</p>
<table>
<tr><th>Ring (outer → inner)</th><th>The slide's own words</th></tr>
<tr><td>1</td><td>The use of multiple processors on the same chip provides the potential to increase performance <strong>without increasing the clock rate</strong></td></tr>
<tr><td>2</td><td>Strategy is to use <strong>two simpler processors</strong> on the chip rather than one more complex processor</td></tr>
<tr><td>3</td><td>With two processors, <strong>larger caches are justified</strong></td></tr>
<tr><td>4</td><td>As caches became larger it made performance sense to create <strong>two and then three levels of cache</strong> on a chip</td></tr>
</table>
<ul>
<li><strong>Why "two simpler" beats "one more complex".</strong> A single core gets steadily worse value from extra transistors: deeper pipelines, wider issue and more speculation all buy diminishing returns while burning power (slide 3's techniques all have this shape). Two modest cores use the same transistor budget with better performance per watt — <em>if</em> the software can keep both busy, which is the whole caveat of slide 11.</li>
<li><strong>The cache argument, carefully.</strong> Once logic is no longer the best use of silicon, cache becomes the best use — cache is dense, low-power per bit, and directly attacks the memory wall of slide 7. That is why the ring order is cores → bigger cache → more cache levels: each step follows from the previous.</li>
<li><strong>Three levels, concretely.</strong> Typically L1 is private to each core and tiny (tens of KB), L2 is private or shared by a pair and larger, L3 is shared by all cores and large. Ch.4 and Ch.5 examine this hierarchy properly; here you only need the reason it exists.</li>
<li><strong>The honest limitation.</strong> Adding a core adds <em>potential</em>, not performance. A single-threaded program runs at exactly the same speed on 1 core and on 64. Slide 11's Amdahl's law is the exact statement of how little you get when only part of a program is parallel.</li>
<li><strong>Vocabulary that shows up in questions.</strong> "Core" = a complete processor (control unit + ALU + registers + L1) on a shared die; "multicore" = several of them on one chip; "chip multiprocessor" = the same thing under its formal name. Chapter 21 is entirely about them.</li>
</ul>
<p class="pitfall">⚠️ The favourite exam trap: "a 4-core CPU is 4× faster than a 1-core CPU". False by Amdahl's law and false in practice. Correct statement: it offers up to 4× <em>throughput on parallel work</em>, and exactly 1× on a purely sequential program.</p>`,
        `<p class="y-chinh">🎯 Bốn vòng tròn đồng tâm, một lập luận: đặt <strong>nhiều bộ xử lý trên cùng một chip</strong> thì được thêm hiệu năng mà <em>không</em> phải nâng xung nhịp — thứ mà slide 7 vừa nói là đằng nào cũng không nâng được nữa.</p>
<table>
<tr><th>Vòng (ngoài → trong)</th><th>Nguyên văn của slide</th></tr>
<tr><td>1</td><td>Dùng nhiều bộ xử lý trên cùng một chip mở ra khả năng tăng hiệu năng <strong>mà không tăng xung nhịp</strong></td></tr>
<tr><td>2</td><td>Chiến lược là dùng <strong>hai bộ xử lý ĐƠN GIẢN HƠN</strong> trên chip thay vì một bộ xử lý phức tạp hơn</td></tr>
<tr><td>3</td><td>Có hai bộ xử lý thì <strong>cache lớn hơn trở nên đáng giá</strong></td></tr>
<tr><td>4</td><td>Cache càng lớn thì càng hợp lý khi tạo ra <strong>hai rồi ba CẤP cache</strong> trên một chip</td></tr>
</table>
<ul>
<li><strong>Vì sao "hai cái đơn giản" thắng "một cái phức tạp".</strong> Một lõi đơn ngày càng dùng transistor thêm kém hiệu quả: ống sâu hơn, phát lệnh rộng hơn, tiên đoán nhiều hơn — tất cả đều lợi giảm dần trong khi đốt điện tăng (năm kỹ thuật ở slide 3 đều có hình dáng đó). Hai lõi vừa phải dùng đúng ngần ấy transistor mà cho hiệu năng trên mỗi watt tốt hơn — <em>NẾU</em> phần mềm giữ được cả hai cùng bận, và đó chính là lời cảnh báo của slide 11.</li>
<li><strong>Lập luận về cache, nói cho kỹ.</strong> Khi logic không còn là cách dùng silicon tốt nhất thì cache trở thành cách tốt nhất — cache dày đặc, tốn ít điện trên mỗi bit, và đánh thẳng vào bức tường bộ nhớ ở slide 7. Vì thế thứ tự các vòng là lõi → cache lớn hơn → nhiều cấp cache: mỗi bước suy ra từ bước trước.</li>
<li><strong>Ba cấp, nói cụ thể.</strong> Thường L1 riêng cho từng lõi và rất nhỏ (vài chục KB), L2 riêng hoặc dùng chung cho một cặp và lớn hơn, L3 dùng chung cho mọi lõi và rất lớn. Ch.4 và Ch.5 mổ xẻ phân cấp này tử tế; ở đây bạn chỉ cần lý do nó tồn tại.</li>
<li><strong>Giới hạn phải nói thật.</strong> Thêm một lõi là thêm TIỀM NĂNG, không phải thêm hiệu năng. Một chương trình đơn luồng chạy đúng bằng nhau trên 1 lõi và trên 64 lõi. Định luật Amdahl ở slide 11 chính là phát biểu chính xác rằng khi chỉ một phần chương trình song song được thì bạn lấy về ít đến mức nào.</li>
<li><strong>Từ vựng hay ra đề.</strong> "Lõi (core)" = một bộ xử lý hoàn chỉnh (khối điều khiển + ALU + thanh ghi + L1) trên một miếng silicon dùng chung; "đa lõi (multicore)" = nhiều lõi trên một chip; "chip multiprocessor" = cũng chính nó, gọi bằng tên chính thức. Chương 21 dành trọn cho chúng.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi quen thuộc nhất: "CPU 4 lõi nhanh gấp 4 lần CPU 1 lõi". SAI theo định luật Amdahl và sai cả trong thực tế. Phát biểu đúng: nó cho TỐI ĐA gấp 4 <em>thông lượng trên phần việc song song</em>, và đúng gấp 1 trên một chương trình thuần tuần tự.</p>`],

      [10, 'Many Integrated Core (MIC) and Graphics Processing Unit (GPU)',
        `<p class="y-chinh">🎯 Two ways to go past "a few cores". <strong>MIC</strong> scales the same general-purpose core to very many; <strong>GPU</strong> uses a completely different, graphics-derived core. Both buy throughput, and both hand the difficulty to the software.</p>
<table>
<tr><th></th><th>MIC (Many Integrated Core)</th><th>GPU (Graphics Processing Unit)</th></tr>
<tr><td>What the slide says</td><td>A <strong>leap in performance</strong> as well as <strong>the challenges in developing software</strong> to exploit such a large number of cores. The multicore and MIC strategy involves a <strong>homogeneous collection of general purpose processors</strong> on a single chip</td><td>Core <strong>designed to perform parallel operations on graphics data</strong>. Traditionally found on a plug-in graphics card, used to encode and render 2D and 3D graphics as well as process video. Used as <strong>vector processors</strong> for a variety of applications that require repetitive computations</td></tr>
<tr><td>Core type</td><td>General purpose, all identical (homogeneous)</td><td>Specialised, many very simple lanes</td></tr>
<tr><td>Best at</td><td>Many independent general tasks</td><td>The same operation applied to a huge array of data</td></tr>
<tr><td>Cost of using it</td><td>You must find many parallel tasks</td><td>You must reshape the problem as vectors</td></tr>
</table>
<ul>
<li><strong>The word doing the work in the MIC definition is "homogeneous".</strong> Every core is the same general-purpose core, so ordinary code can run on any of them; the difficulty is purely "find enough parallel work". A GPU is the opposite: the cores are not general-purpose, so the code itself must be rewritten.</li>
<li><strong>"Vector processor" is the phrase to remember for GPUs.</strong> A vector operation applies one instruction to many data elements at once. Graphics needs exactly that (do the same lighting maths to a million pixels), and so do scientific simulation, video encoding and — the reason GPUs are now everywhere — neural networks. The slide's phrase "applications that require repetitive computations" is the general form.</li>
<li><strong>GPGPU is the idea hiding in that sentence.</strong> General-Purpose computing on GPUs: using a graphics chip for non-graphics maths. The slide mentions it obliquely with "used as vector processors for a variety of applications".</li>
<li><strong>Note the honesty of the MIC bullet.</strong> It names the challenge in the same breath as the leap: the hardware is easy to build, the software is not. That is the exact same warning as Amdahl's law on the next slide, stated in engineering language rather than mathematics.</li>
<li><strong>Where this goes.</strong> Chapter 20 (parallel processing) and Chapter 21 (multicore) develop the taxonomy — SISD, SIMD, MIMD. In that vocabulary a GPU is essentially <strong>SIMD</strong>, while multicore and MIC are <strong>MIMD</strong>. Worth writing on your formula sheet now.</li>
</ul>
<p class="meo">💡 One-line contrast to memorise: <strong>MIC = many of the SAME general core (homogeneous, MIMD); GPU = many SIMPLE specialised lanes doing the SAME operation on different data (vector, SIMD).</strong></p>`,
        `<p class="y-chinh">🎯 Hai cách vượt qua mức "vài lõi". <strong>MIC</strong> nhân đúng cái lõi đa dụng ấy lên rất nhiều; <strong>GPU</strong> dùng một loại lõi khác hẳn, gốc từ đồ hoạ. Cả hai đều mua thông lượng, và cả hai đều đẩy phần khó sang cho phần mềm.</p>
<table>
<tr><th></th><th>MIC (Many Integrated Core)</th><th>GPU (bộ xử lý đồ hoạ)</th></tr>
<tr><td>Slide nói gì</td><td>Một <strong>bước nhảy hiệu năng</strong>, đồng thời là <strong>thách thức khi viết phần mềm</strong> để khai thác được ngần ấy lõi. Chiến lược multicore và MIC là <strong>một tập bộ xử lý ĐA DỤNG ĐỒNG NHẤT</strong> trên một chip</td><td>Lõi được <strong>thiết kế để làm các phép song song trên dữ liệu đồ hoạ</strong>. Theo truyền thống nằm trên card đồ hoạ cắm thêm, dùng để mã hoá và dựng hình 2D, 3D cũng như xử lý video. Được dùng như <strong>bộ xử lý VECTOR</strong> cho nhiều ứng dụng đòi hỏi tính toán lặp đi lặp lại</td></tr>
<tr><td>Kiểu lõi</td><td>Đa dụng, mọi lõi giống hệt nhau (đồng nhất)</td><td>Chuyên biệt, rất nhiều làn rất đơn giản</td></tr>
<tr><td>Giỏi nhất ở</td><td>Nhiều tác vụ đa dụng độc lập nhau</td><td>Cùng MỘT phép áp lên một mảng dữ liệu khổng lồ</td></tr>
<tr><td>Cái giá phải trả</td><td>Phải tìm cho ra thật nhiều việc song song</td><td>Phải nắn lại bài toán thành dạng vector</td></tr>
</table>
<ul>
<li><strong>Chữ gánh ý trong định nghĩa MIC là "ĐỒNG NHẤT".</strong> Mọi lõi đều là cùng một lõi đa dụng, nên mã thường chạy được trên lõi nào cũng được; cái khó thuần tuý là "tìm đủ việc song song". GPU thì ngược lại: lõi không đa dụng, nên chính đoạn mã phải viết lại.</li>
<li><strong>"Bộ xử lý vector" là cụm phải nhớ cho GPU.</strong> Phép vector áp một lệnh lên rất nhiều phần tử dữ liệu cùng lúc. Đồ hoạ cần đúng điều đó (làm cùng phép chiếu sáng cho một triệu điểm ảnh), và mô phỏng khoa học, mã hoá video, cùng — lý do GPU nay có mặt khắp nơi — mạng nơ-ron cũng vậy. Cụm "ứng dụng đòi hỏi tính toán lặp đi lặp lại" trên slide chính là dạng tổng quát.</li>
<li><strong>GPGPU là ý ẩn trong câu đó.</strong> General-Purpose computing on GPUs: dùng chip đồ hoạ để tính những thứ không phải đồ hoạ. Slide nhắc gián tiếp qua câu "được dùng như bộ xử lý vector cho nhiều ứng dụng".</li>
<li><strong>Để ý sự thành thật của gạch đầu dòng MIC.</strong> Nó nêu THÁCH THỨC ngay trong cùng một hơi với BƯỚC NHẢY: phần cứng dễ dựng, phần mềm thì không. Đó đúng là lời cảnh báo của định luật Amdahl ở slide sau, chỉ nói bằng ngôn ngữ kỹ thuật thay vì ngôn ngữ toán.</li>
<li><strong>Nó đi tới đâu.</strong> Chương 20 (xử lý song song) và Chương 21 (đa lõi) phát triển hệ phân loại — SISD, SIMD, MIMD. Theo từ vựng đó thì GPU về căn bản là <strong>SIMD</strong>, còn đa lõi và MIC là <strong>MIMD</strong>. Nên ghi vào tờ công thức ngay bây giờ.</li>
</ul>
<p class="meo">💡 Một dòng đối chiếu để thuộc: <strong>MIC = rất nhiều lõi đa dụng GIỐNG NHAU (đồng nhất, MIMD); GPU = rất nhiều làn ĐƠN GIẢN chuyên biệt làm CÙNG MỘT phép trên dữ liệu khác nhau (vector, SIMD).</strong></p>`],

      [11, 'Amdahl’s Law',
        `<p class="y-chinh">🎯 Gene Amdahl's 1967 argument, and the most quoted inequality in computer architecture: <strong>the part of a program you cannot speed up sets a hard ceiling on the whole program</strong>, no matter how much hardware you buy.</p>
<ul>
<li><strong>What the slide states</strong> — Gene Amdahl; it deals with the <em>potential speedup of a program using multiple processors compared to a single processor</em>; it illustrates the problems facing industry in the development of multi-core machines; software must be adapted to a highly parallel execution environment to exploit the power of parallel processing; and it can be <em>generalized</em> to evaluate and design technical improvement in a computer system.</li>
<li><strong>⚠️ The formula is NOT on this slide.</strong> The slide is prose only; the equation lives in the book (section 2.3) and is drawn on slide 12. Learn it here anyway, because every exam question uses it:</li>
</ul>
<pre>Speedup = (time on 1 processor) / (time on k processors)
        =            1
          -------------------------
            (1 − f)   +   f / k

f = fraction of the ORIGINAL execution time that is parallelizable (0 ≤ f ≤ 1)
k = number of processors (or the speedup factor applied to that fraction)</pre>
<ul>
<li><strong>Read the denominator as two pieces of a bill.</strong> <code>(1 − f)</code> is the serial part — you still pay it in full, forever. <code>f / k</code> is the parallel part after being divided among k workers. You can shrink the second term towards zero; you can never touch the first.</li>
<li><strong>Worked example 1 — the ceiling.</strong> Suppose <strong>f = 0,95</strong> (95% of the time is parallelizable) and k → ∞. Then f/k → 0, so Speedup → 1 / (1 − 0,95) = 1 / 0,05 = <strong>20</strong>. Even with infinitely many processors a program that is 95% parallel can never run more than 20 times faster.</li>
</ul>
<p class="dap-an">✅ Answer 1: with f = 0,95 the ceiling is <strong>exactly 20×</strong> — and the general rule is <code>ceiling = 1 / (1 − f)</code>.</p>
<ul>
<li><strong>Worked example 2 — a realistic k.</strong> f = 0,5 and k = 8. Denominator = (1 − 0,5) + 0,5/8 = 0,5 + 0,0625 = 0,5625. Speedup = 1 / 0,5625 = 1,7778.</li>
</ul>
<p class="dap-an">✅ Answer 2: <strong>≈ 1,78×</strong>. Eight processors, and you got less than double. The ceiling here is 1/(1 − 0,5) = 2, so you are already at 89% of everything eight processors could ever give you; the remaining 7 processors would buy you at most a further 12%.</p>
<ul>
<li><strong>Worked example 3 — the reverse question.</strong> "I want a 10× speedup. What must f be?" With k → ∞: 10 = 1/(1 − f) ⟹ 1 − f = 0,1 ⟹ <strong>f = 0,90</strong>. With a finite k = 16: 10 = 1/((1 − f) + f/16) ⟹ (1 − f) + f/16 = 0,1 ⟹ 1 − f(1 − 1/16) = 0,1 ⟹ f = 0,9 ÷ (15/16) = <strong>0,96</strong>.</li>
</ul>
<p class="dap-an">✅ Answer 3: <strong>f = 0,90 with unlimited processors; f = 0,96 with 16 processors.</strong> Check: 1/((1−0,96)+0,96/16) = 1/(0,04+0,06) = 1/0,1 = 10,0 ✓. Note how brutal the reverse form is — to get 10× on 16 cores you must parallelize 96% of the work, not 90%.</p>
<ul>
<li><strong>"Can be generalized" is the sentence that makes this a design law, not a multiprocessor law.</strong> Replace "k processors" with "this component is now k times faster" and f with "the fraction of time spent in that component", and you have the rule that governs every optimisation decision: cache, faster disk, a better algorithm, a GPU.</li>
</ul>
<p class="pitfall">⚠️ Two errors cost most of the marks on this topic. (1) <strong>f is a fraction of TIME, not of code.</strong> A loop that is 3 lines out of 300 can easily be 99% of the time. (2) <strong>f is measured on the ORIGINAL (1-processor) run</strong>, not on the improved one. Measuring f after the speedup gives a different, wrong number.</p>`,
        `<p class="y-chinh">🎯 Lập luận năm 1967 của Gene Amdahl, và là bất đẳng thức được trích nhiều nhất trong kiến trúc máy tính: <strong>phần chương trình bạn KHÔNG tăng tốc được sẽ đặt một cái trần cứng lên cả chương trình</strong>, mua bao nhiêu phần cứng cũng vậy.</p>
<ul>
<li><strong>Slide nói gì</strong> — Gene Amdahl; định luật bàn về <em>mức tăng tốc TIỀM NĂNG của một chương trình khi dùng nhiều bộ xử lý so với một bộ xử lý</em>; nó minh hoạ đúng vấn đề mà ngành công nghiệp đang gặp khi phát triển máy đa lõi; phần mềm phải được sửa cho hợp với môi trường thi hành song song cao độ thì mới khai thác được sức mạnh xử lý song song; và nó có thể <em>tổng quát hoá</em> để đánh giá và thiết kế mọi cải tiến kỹ thuật trong một hệ máy tính.</li>
<li><strong>⚠️ CÔNG THỨC KHÔNG NẰM TRÊN SLIDE NÀY.</strong> Slide chỉ có chữ; phương trình nằm trong SÁCH (mục 2.3) và được vẽ ở slide 12. Dù sao cũng học ngay ở đây, vì mọi câu hỏi thi đều dùng nó:</li>
</ul>
<pre>Tăng tốc = (thời gian trên 1 bộ xử lý) / (thời gian trên k bộ xử lý)
         =              1
           ---------------------------
              (1 − f)    +    f / k

f = TỈ LỆ THỜI GIAN của lần chạy GỐC mà song song hoá được (0 ≤ f ≤ 1)
k = số bộ xử lý (hoặc hệ số tăng tốc áp cho phần đó)</pre>
<ul>
<li><strong>Đọc mẫu số như hai khoản của một hoá đơn.</strong> <code>(1 − f)</code> là phần TUẦN TỰ — bạn vẫn trả đủ, mãi mãi. <code>f / k</code> là phần song song sau khi chia cho k người làm. Số hạng thứ hai có thể ép về gần 0; số hạng thứ nhất thì không đụng được.</li>
<li><strong>Bài giải 1 — cái trần.</strong> Giả sử <strong>f = 0,95</strong> (95% thời gian song song hoá được) và k → ∞. Khi đó f/k → 0, nên Tăng tốc → 1 / (1 − 0,95) = 1 / 0,05 = <strong>20</strong>. Dù có vô hạn bộ xử lý, một chương trình song song 95% cũng không bao giờ chạy nhanh hơn 20 lần.</li>
</ul>
<p class="dap-an">✅ Đáp án 1: với f = 0,95 thì trần là <strong>đúng 20 lần</strong> — và quy tắc tổng quát là <code>trần = 1 / (1 − f)</code>.</p>
<ul>
<li><strong>Bài giải 2 — một k thực tế.</strong> f = 0,5 và k = 8. Mẫu số = (1 − 0,5) + 0,5/8 = 0,5 + 0,0625 = 0,5625. Tăng tốc = 1 / 0,5625 = 1,7778.</li>
</ul>
<p class="dap-an">✅ Đáp án 2: <strong>≈ 1,78 lần</strong>. Tám bộ xử lý, mà chưa được gấp đôi. Trần ở đây là 1/(1 − 0,5) = 2, tức bạn đã đạt 89% tất cả những gì tám bộ xử lý có thể cho; bảy bộ xử lý còn lại nhiều nhất chỉ mua thêm được 12%.</p>
<ul>
<li><strong>Bài giải 3 — câu hỏi NGƯỢC.</strong> "Tôi muốn tăng tốc 10 lần. f phải bằng bao nhiêu?" Với k → ∞: 10 = 1/(1 − f) ⟹ 1 − f = 0,1 ⟹ <strong>f = 0,90</strong>. Với k hữu hạn = 16: 10 = 1/((1 − f) + f/16) ⟹ (1 − f) + f/16 = 0,1 ⟹ 1 − f(1 − 1/16) = 0,1 ⟹ f = 0,9 ÷ (15/16) = <strong>0,96</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án 3: <strong>f = 0,90 nếu có vô hạn bộ xử lý; f = 0,96 nếu chỉ có 16.</strong> Thử lại: 1/((1−0,96)+0,96/16) = 1/(0,04+0,06) = 1/0,1 = 10,0 ✓. Để ý dạng ngược tàn nhẫn cỡ nào — muốn gấp 10 trên 16 lõi thì phải song song hoá 96% công việc, chứ không phải 90%.</p>
<ul>
<li><strong>"Có thể tổng quát hoá" là câu biến đây thành ĐỊNH LUẬT THIẾT KẾ, không chỉ là định luật đa xử lý.</strong> Thay "k bộ xử lý" bằng "thành phần này nay nhanh gấp k lần" và f bằng "tỉ lệ thời gian nằm trong thành phần đó", bạn có quy tắc chi phối mọi quyết định tối ưu: cache, ổ đĩa nhanh hơn, thuật toán tốt hơn, một cái GPU.</li>
</ul>
<p class="pitfall">⚠️ Hai lỗi lấy mất phần lớn điểm của chủ đề này. (1) <strong>f là tỉ lệ THỜI GIAN, không phải tỉ lệ DÒNG MÃ.</strong> Một vòng lặp 3 dòng trên 300 dòng hoàn toàn có thể chiếm 99% thời gian. (2) <strong>f đo trên lần chạy GỐC (1 bộ xử lý)</strong>, không phải trên lần chạy đã cải tiến. Đo f sau khi tăng tốc sẽ ra một con số khác và sai.</p>`],

      [12, 'Figure 2.3 — Illustration of Amdahl’s Law',
        `<p class="y-chinh">🎯 The formula, derived from a picture instead of algebra. Two horizontal bars: the top one is the original run, the bottom one is the parallel run, and the labels on them <em>are</em> the derivation.</p>
<table>
<tr><th>Label on the figure</th><th>Meaning</th></tr>
<tr><td><code>T</code></td><td>Total execution time on one processor</td></tr>
<tr><td><code>(1 − f)T</code></td><td>The <strong>serial</strong> portion — left segment of both bars, identical in the two bars</td></tr>
<tr><td><code>fT</code></td><td>The <strong>parallelizable</strong> portion — the long right segment of the TOP bar</td></tr>
<tr><td><code>fT / N</code></td><td>The same work after being spread over N processors — the short right segment of the BOTTOM bar</td></tr>
<tr><td><code>[1 − f(1 − 1/N)] T</code></td><td>Total time of the bottom bar, i.e. the new execution time</td></tr>
</table>
<ul>
<li><strong>Follow the dashed diagonal.</strong> It connects the end of <code>fT</code> on the top bar to the end of <code>fT/N</code> on the bottom bar. That single line <em>is</em> the speedup: it shows the parallel portion being compressed while the serial portion stays exactly where it was.</li>
<li><strong>The algebra the picture hides, in three lines.</strong> New time = (1 − f)T + fT/N = T[(1 − f) + f/N] = T[1 − f + f/N] = T[1 − f(1 − 1/N)]. That last form is the label under the bottom bar — so the figure and the formula are literally the same statement.</li>
<li><strong>Speedup falls straight out of it.</strong> Speedup = T ÷ (new time) = 1 / [(1 − f) + f/N], exactly the formula on slide 11. The book writes N here for the processor count where slide 11's wording says "multiple processors"; N and k are the same thing, so do not be thrown by the letter.</li>
<li><strong>Worked reading of the figure.</strong> Take f = 0,8 and N = 5. Bottom bar = (1 − 0,8)T + 0,8T/5 = 0,2T + 0,16T = 0,36T. Speedup = T / 0,36T = 2,7778.</li>
</ul>
<p class="dap-an">✅ Answer: <strong>≈ 2,78×</strong> from 5 processors — and notice the serial 0,2T now dominates: it is 0,2/0,36 = <strong>56% of the new runtime</strong> although it was only 20% of the old one. Speeding up the parallel part makes the serial part <em>relatively</em> bigger, every single time. That is the visual lesson of the figure.</p>
<ul>
<li><strong>Two assumptions the picture quietly makes.</strong> (1) The parallel portion divides <em>perfectly</em> among N processors — no communication, no synchronisation, no load imbalance. (2) The serial portion is unchanged. Both are optimistic, so a real speedup is always <em>below</em> the Amdahl number. Amdahl gives you an <strong>upper bound</strong>, not a prediction.</li>
</ul>
<p class="meo">💡 Draw the two bars from memory: one long bar split (1−f)T | fT, and underneath the same left piece plus a shrunken right piece fT/N. If you can draw that, you can re-derive the formula in the exam even if you forget it.</p>`,
        `<p class="y-chinh">🎯 Công thức, được suy ra từ MỘT BỨC HÌNH thay vì từ đại số. Hai thanh ngang: thanh trên là lần chạy gốc, thanh dưới là lần chạy song song, và các nhãn trên chúng CHÍNH LÀ phép suy diễn.</p>
<table>
<tr><th>Nhãn trên hình</th><th>Nghĩa</th></tr>
<tr><td><code>T</code></td><td>Tổng thời gian thi hành trên một bộ xử lý</td></tr>
<tr><td><code>(1 − f)T</code></td><td>Phần <strong>TUẦN TỰ</strong> — đoạn trái của CẢ HAI thanh, hai thanh giống hệt nhau ở đoạn này</td></tr>
<tr><td><code>fT</code></td><td>Phần <strong>SONG SONG HOÁ ĐƯỢC</strong> — đoạn phải rất dài của thanh TRÊN</td></tr>
<tr><td><code>fT / N</code></td><td>Cũng khối lượng đó sau khi chia cho N bộ xử lý — đoạn phải ngắn ngủn của thanh DƯỚI</td></tr>
<tr><td><code>[1 − f(1 − 1/N)] T</code></td><td>Tổng thời gian của thanh dưới, tức thời gian thi hành MỚI</td></tr>
</table>
<ul>
<li><strong>Bám theo đường chéo đứt nét.</strong> Nó nối điểm cuối của <code>fT</code> trên thanh trên tới điểm cuối của <code>fT/N</code> trên thanh dưới. Chính một đường đó LÀ mức tăng tốc: nó cho thấy phần song song bị nén lại còn phần tuần tự thì đứng nguyên chỗ cũ.</li>
<li><strong>Phần đại số mà bức hình giấu đi, gồm ba dòng.</strong> Thời gian mới = (1 − f)T + fT/N = T[(1 − f) + f/N] = T[1 − f + f/N] = T[1 − f(1 − 1/N)]. Dạng cuối chính là cái nhãn dưới thanh dưới — nên hình và công thức đúng nghĩa đen là CÙNG MỘT phát biểu.</li>
<li><strong>Mức tăng tốc rơi thẳng ra từ đó.</strong> Tăng tốc = T ÷ (thời gian mới) = 1 / [(1 − f) + f/N], đúng công thức ở slide 11. Sách viết N cho số bộ xử lý ở chỗ slide 11 nói "nhiều bộ xử lý"; N và k là một thứ, đừng để chữ cái làm rối.</li>
<li><strong>Đọc hình bằng một bài giải.</strong> Lấy f = 0,8 và N = 5. Thanh dưới = (1 − 0,8)T + 0,8T/5 = 0,2T + 0,16T = 0,36T. Tăng tốc = T / 0,36T = 2,7778.</li>
</ul>
<p class="dap-an">✅ Đáp án: <strong>≈ 2,78 lần</strong> nhờ 5 bộ xử lý — và để ý phần tuần tự 0,2T nay ÁP ĐẢO: nó chiếm 0,2/0,36 = <strong>56% thời gian chạy mới</strong> dù chỉ chiếm 20% thời gian cũ. Tăng tốc phần song song luôn làm phần tuần tự phình to lên một cách TƯƠNG ĐỐI, không trừ lần nào. Đó là bài học thị giác của bức hình này.</p>
<ul>
<li><strong>Hai giả thiết mà bức hình lặng lẽ đặt ra.</strong> (1) Phần song song chia <em>hoàn hảo</em> cho N bộ xử lý — không truyền thông, không đồng bộ, không lệch tải. (2) Phần tuần tự không đổi. Cả hai đều lạc quan, nên mức tăng tốc THẬT luôn <em>thấp hơn</em> con số Amdahl. Amdahl cho bạn một <strong>CẬN TRÊN</strong>, không phải một dự báo.</li>
</ul>
<p class="meo">💡 Hãy vẽ lại hai thanh từ trí nhớ: một thanh dài chia (1−f)T | fT, và bên dưới là đúng đoạn trái ấy cộng một đoạn phải co lại còn fT/N. Vẽ được là bạn tự suy lại công thức ngay trong phòng thi, dù có quên.</p>`],

      [13, 'Figure 2.4 — Amdahl’s Law for Multiprocessors',
        `<p class="y-chinh">🎯 Four curves of speedup against number of processors (1 to 1000, log axis), one for each value of <strong>f = 0,5 · 0,75 · 0,90 · 0,95</strong>. Every curve flattens, and the height at which it flattens is <code>1/(1 − f)</code>. This single picture is the argument against "just add cores".</p>
<table>
<tr><th>f</th><th>Ceiling 1/(1−f)</th><th>k = 2</th><th>k = 4</th><th>k = 8</th><th>k = 16</th><th>k = 1000</th></tr>
<tr><td>0,50</td><td><strong>2</strong></td><td>1,33</td><td>1,60</td><td>1,78</td><td>1,88</td><td>2,00</td></tr>
<tr><td>0,75</td><td><strong>4</strong></td><td>1,60</td><td>2,29</td><td>2,91</td><td>3,37</td><td>3,99</td></tr>
<tr><td>0,90</td><td><strong>10</strong></td><td>1,82</td><td>3,08</td><td>4,71</td><td>6,40</td><td>9,91</td></tr>
<tr><td>0,95</td><td><strong>20</strong></td><td>1,90</td><td>3,48</td><td>5,93</td><td>9,14</td><td>19,63</td></tr>
</table>
<ul>
<li><strong>Every number above was computed from <code>1/((1−f)+f/k)</code> and matches the drawn curves.</strong> Read the right edge of the chart: the f = 0,95 curve tops out just under 20, f = 0,90 just under 10, f = 0,75 just under 4, f = 0,5 just under 2. The asymptotes are exactly the ceilings.</li>
<li><strong>The scandal of the table is the k = 1000 column.</strong> At f = 0,90, a thousand processors deliver 9,91× — that is <strong>0,99% efficiency</strong>: 99% of the hardware produces nothing. The chart is drawn on a log x-axis precisely so you can see how much hardware is being wasted at the flat part.</li>
<li><strong>Diminishing returns, quantified.</strong> For f = 0,95: going 1 → 2 processors buys +0,90; 8 → 16 buys +3,21; 16 → 1000 buys +10,49 for 984 extra processors. The first doubling is always the best deal you will ever get.</li>
<li><strong>Worked exam problem (the standard form).</strong> "A program spends 30% of its time in code that cannot be parallelized. What is the speedup on 4 processors, and what is the maximum possible speedup?" Here f = 1 − 0,30 = 0,70. Speedup(4) = 1/((1−0,7) + 0,7/4) = 1/(0,3 + 0,175) = 1/0,475 = 2,1053. Maximum = 1/(1 − 0,7) = 3,3333.</li>
</ul>
<p class="dap-an">✅ Answer: <strong>≈ 2,11× on 4 processors; ceiling ≈ 3,33×.</strong> Note the question gave you the SERIAL fraction (30%) — you must convert it to f = 0,70 before substituting. Half the lost marks on this topic come from putting 0,30 into the formula.</p>
<ul>
<li><strong>Second worked problem — measured speedup, find f.</strong> "On 8 processors a program runs 3,2× faster. What fraction is parallel?" Rearrange: S = 1/((1−f)+f/k) ⟹ 1/S = 1 − f(1 − 1/k) ⟹ f = (1 − 1/S) / (1 − 1/k) = (1 − 1/3,2) / (1 − 1/8) = 0,6875 / 0,875 = 0,7857.</li>
</ul>
<p class="dap-an">✅ Answer: <strong>f ≈ 0,786, i.e. about 79% of the runtime is parallel.</strong> Check: 1/((1−0,7857)+0,7857/8) = 1/(0,2143+0,0982) = 1/0,3125 = 3,20 ✓. This rearranged form <code>f = (1 − 1/S)/(1 − 1/k)</code> is worth memorising — it is the only Amdahl variant that needs real algebra under exam pressure.</p>
<p class="pitfall">⚠️ Do not read a point off the curve and call it exact — the chart is log-scaled and drawn, not tabulated. If a question gives f and k, <strong>compute</strong>; the figure is for the shape of the argument, not for extracting values.</p>`,
        `<p class="y-chinh">🎯 Bốn đường cong tăng tốc theo số bộ xử lý (1 tới 1000, trục log), mỗi đường ứng một giá trị <strong>f = 0,5 · 0,75 · 0,90 · 0,95</strong>. Đường nào cũng nằm ngang lại, và độ cao chỗ nằm ngang chính là <code>1/(1 − f)</code>. Chỉ một bức hình này là đủ bác bỏ câu "cứ thêm lõi vào".</p>
<table>
<tr><th>f</th><th>Trần 1/(1−f)</th><th>k = 2</th><th>k = 4</th><th>k = 8</th><th>k = 16</th><th>k = 1000</th></tr>
<tr><td>0,50</td><td><strong>2</strong></td><td>1,33</td><td>1,60</td><td>1,78</td><td>1,88</td><td>2,00</td></tr>
<tr><td>0,75</td><td><strong>4</strong></td><td>1,60</td><td>2,29</td><td>2,91</td><td>3,37</td><td>3,99</td></tr>
<tr><td>0,90</td><td><strong>10</strong></td><td>1,82</td><td>3,08</td><td>4,71</td><td>6,40</td><td>9,91</td></tr>
<tr><td>0,95</td><td><strong>20</strong></td><td>1,90</td><td>3,48</td><td>5,93</td><td>9,14</td><td>19,63</td></tr>
</table>
<ul>
<li><strong>Mọi con số trên đây đều tính từ <code>1/((1−f)+f/k)</code> và khớp với các đường vẽ.</strong> Nhìn mép phải biểu đồ: đường f = 0,95 chạm trần ngay dưới 20, f = 0,90 ngay dưới 10, f = 0,75 ngay dưới 4, f = 0,5 ngay dưới 2. Các tiệm cận đúng bằng các trần.</li>
<li><strong>Chỗ giật mình của bảng là cột k = 1000.</strong> Với f = 0,90, một nghìn bộ xử lý cho được 9,91 lần — tức <strong>hiệu suất 0,99%</strong>: 99% phần cứng không sinh ra gì. Biểu đồ vẽ trục hoành theo log chính là để bạn nhìn thấy lượng phần cứng bị phí ở đoạn nằm ngang.</li>
<li><strong>Lợi giảm dần, nói bằng số.</strong> Với f = 0,95: đi từ 1 → 2 bộ xử lý mua được +0,90; 8 → 16 mua được +3,21; 16 → 1000 mua được +10,49 bằng 984 bộ xử lý thêm. Lần nhân đôi ĐẦU TIÊN luôn là món hời nhất bạn từng có.</li>
<li><strong>Bài thi mẫu (dạng chuẩn).</strong> "Một chương trình dành 30% thời gian cho đoạn mã không song song hoá được. Tăng tốc trên 4 bộ xử lý là bao nhiêu, và tăng tốc tối đa là bao nhiêu?" Ở đây f = 1 − 0,30 = 0,70. Tăng tốc(4) = 1/((1−0,7) + 0,7/4) = 1/(0,3 + 0,175) = 1/0,475 = 2,1053. Tối đa = 1/(1 − 0,7) = 3,3333.</li>
</ul>
<p class="dap-an">✅ Đáp án: <strong>≈ 2,11 lần trên 4 bộ xử lý; trần ≈ 3,33 lần.</strong> Chú ý đề cho bạn tỉ lệ TUẦN TỰ (30%) — phải đổi thành f = 0,70 rồi mới thay vào. Một nửa số điểm mất ở chủ đề này là do nhét thẳng 0,30 vào công thức.</p>
<ul>
<li><strong>Bài mẫu thứ hai — biết mức tăng tốc đo được, tìm f.</strong> "Trên 8 bộ xử lý, chương trình chạy nhanh gấp 3,2 lần. Bao nhiêu phần trăm là song song?" Biến đổi: S = 1/((1−f)+f/k) ⟹ 1/S = 1 − f(1 − 1/k) ⟹ f = (1 − 1/S) / (1 − 1/k) = (1 − 1/3,2) / (1 − 1/8) = 0,6875 / 0,875 = 0,7857.</li>
</ul>
<p class="dap-an">✅ Đáp án: <strong>f ≈ 0,786, tức khoảng 79% thời gian chạy là song song.</strong> Thử lại: 1/((1−0,7857)+0,7857/8) = 1/(0,2143+0,0982) = 1/0,3125 = 3,20 ✓. Dạng biến đổi <code>f = (1 − 1/S)/(1 − 1/k)</code> rất đáng thuộc — đó là biến thể Amdahl duy nhất đòi bạn làm đại số thật dưới áp lực phòng thi.</p>
<p class="pitfall">⚠️ Đừng dóng một điểm trên đường cong rồi coi là số chính xác — biểu đồ vẽ theo thang log, là hình vẽ chứ không phải bảng số. Đề cho f và k thì phải <strong>TÍNH</strong>; bức hình chỉ để thấy HÌNH DÁNG của lập luận, không phải để rút số ra.</p>`],

      [14, 'Little’s Law',
        `<p class="y-chinh">🎯 The second law of the chapter, and the simplest true statement in queueing theory: <strong>L = λ × W</strong> — the average number of items in a system equals the average arrival rate times the average time each item spends inside.</p>
<ul>
<li><strong>What the slide states</strong> — a fundamental and simple relation with broad applications; it applies to almost any system that is <em>statistically in steady state</em> and in which <em>there is no leakage</em>; a queuing system serves an item immediately if the server is idle, otherwise the arriving item joins a queue; there can be a single queue for a single server or for multiple servers, or multiple queues one per server; the average number of items in a queuing system equals the average rate at which items arrive multiplied by the time an item spends in the system; the relationship requires very few assumptions; and because of its simplicity and generality it is extremely useful.</li>
<li><strong>⚠️ Like slide 11, the formula symbols are NOT on the slide.</strong> The slide gives the sentence; the book gives the letters. Write them down:</li>
</ul>
<pre>L = λ × W

L = average number of items in the system (queue + in service)
λ = average arrival rate (items per unit time)
W = average time an item spends in the system</pre>
<ul>
<li><strong>The two conditions are the whole fine print.</strong> <em>Steady state</em> = the average arrival rate equals the average departure rate, so the queue is neither growing nor draining over the long run. <em>No leakage</em> = every item that enters eventually leaves; nothing is dropped, lost or abandoned. Given those two, the law holds <strong>regardless of the arrival distribution, the service distribution or the queue discipline</strong> — which is exactly why it is so useful.</li>
<li><strong>Worked example 1 — a disk queue.</strong> A disk controller receives on average <strong>λ = 250 requests per second</strong>, and measurement shows each request spends on average <strong>W = 14 ms</strong> in the controller (waiting plus being served). How many requests are inside the controller on average? L = λ × W = 250 × 0,014 s = 3,5.</li>
</ul>
<p class="dap-an">✅ Answer 1: <strong>L = 3,5 requests</strong> on average — a non-integer average is normal and correct; it does not mean half a request exists, it means that over time the count averages 3,5. Units are the trap: λ was per second, so W had to be converted from 14 ms to 0,014 s.</p>
<ul>
<li><strong>Worked example 2 — solving for the unknown you actually want.</strong> A web service holds on average <strong>L = 15</strong> requests in flight and each request takes <strong>W = 50 ms</strong> end to end. What throughput is it sustaining? λ = L / W = 15 / 0,05 = 300 requests per second. And if you want to serve 500 requests/s at the same 15-deep concurrency, you need W = L/λ = 15/500 = 0,03 s = <strong>30 ms</strong> per request.</li>
</ul>
<p class="dap-an">✅ Answer 2: <strong>λ = 300 req/s; to reach 500 req/s at the same concurrency the latency must fall to 30 ms.</strong> This is the everyday engineering use of Little's law: it converts between the three numbers a service is described by — concurrency, throughput and latency — so knowing any two gives you the third for free.</p>
<ul>
<li><strong>Where it lives inside a computer.</strong> L = λW describes an instruction pipeline (items = instructions in flight), a memory controller's request queue, a network interface's buffer, an I/O device queue (Ch.8) and a process ready queue (Ch.9). Same three letters everywhere.</li>
<li><strong>Why the book pairs it with Amdahl.</strong> Amdahl bounds what <em>parallelism</em> can buy; Little bounds what <em>buffering</em> can buy. Neither is about a specific machine; both are arithmetic that no amount of engineering can escape.</li>
</ul>
<p class="pitfall">⚠️ Two traps. (1) <strong>Mixed units</strong> — λ in requests per second with W in milliseconds gives an answer 1000× too big; convert first, always. (2) <strong>W is time in the SYSTEM</strong> (waiting + service), not service time alone. If a question gives "service time" and "waiting time" separately, add them before multiplying.</p>`,
        `<p class="y-chinh">🎯 Định luật thứ hai của chương, và là phát biểu đúng đơn giản nhất trong lý thuyết hàng đợi: <strong>L = λ × W</strong> — số phần tử trung bình trong hệ bằng tốc độ tới trung bình nhân với thời gian trung bình mỗi phần tử ở trong hệ.</p>
<ul>
<li><strong>Slide nói gì</strong> — một quan hệ nền tảng và đơn giản, ứng dụng rất rộng; áp được cho gần như mọi hệ ở <em>trạng thái dừng theo nghĩa thống kê</em> và <em>không rò rỉ</em>; trong hệ hàng đợi, nếu máy phục vụ đang rảnh thì phần tử được phục vụ ngay, không thì nó xếp vào hàng; có thể có một hàng cho một máy phục vụ, một hàng cho nhiều máy, hoặc nhiều hàng mỗi hàng một máy; số phần tử trung bình trong hệ hàng đợi bằng tốc độ tới trung bình nhân thời gian phần tử ở trong hệ; quan hệ này đòi hỏi rất ít giả thiết; và vì đơn giản lại tổng quát nên nó cực kỳ hữu dụng.</li>
<li><strong>⚠️ Giống slide 11, KÝ HIỆU CÔNG THỨC KHÔNG NẰM TRÊN SLIDE.</strong> Slide cho câu chữ; sách cho chữ cái. Hãy chép lại:</li>
</ul>
<pre>L = λ × W

L = số phần tử trung bình trong hệ (đang đợi + đang được phục vụ)
λ = tốc độ tới trung bình (số phần tử trên một đơn vị thời gian)
W = thời gian trung bình một phần tử ở trong hệ</pre>
<ul>
<li><strong>Hai điều kiện chính là toàn bộ phần chữ nhỏ.</strong> <em>Trạng thái dừng</em> = tốc độ tới trung bình bằng tốc độ đi trung bình, nên về lâu dài hàng đợi không phình ra cũng không cạn đi. <em>Không rò rỉ</em> = phần tử nào vào rồi cũng ra; không cái nào bị rớt, mất hay bỏ cuộc. Có hai điều đó thì định luật đúng <strong>bất kể phân bố thời điểm tới, phân bố thời gian phục vụ hay kỷ luật xếp hàng</strong> — và đó chính là lý do nó hữu dụng đến thế.</li>
<li><strong>Bài giải 1 — hàng đợi ổ đĩa.</strong> Một bộ điều khiển đĩa nhận trung bình <strong>λ = 250 yêu cầu mỗi giây</strong>, và đo được mỗi yêu cầu ở trong bộ điều khiển trung bình <strong>W = 14 ms</strong> (đợi cộng được phục vụ). Trung bình có bao nhiêu yêu cầu đang nằm trong đó? L = λ × W = 250 × 0,014 s = 3,5.</li>
</ul>
<p class="dap-an">✅ Đáp án 1: <strong>L = 3,5 yêu cầu</strong> trung bình — số trung bình không nguyên là bình thường và đúng; nó không có nghĩa tồn tại nửa cái yêu cầu, mà nghĩa là theo thời gian số đếm trung bình bằng 3,5. Bẫy nằm ở ĐƠN VỊ: λ tính theo giây nên W phải đổi từ 14 ms sang 0,014 s.</p>
<ul>
<li><strong>Bài giải 2 — giải ra cái bạn thật sự muốn biết.</strong> Một dịch vụ web trung bình có <strong>L = 15</strong> yêu cầu đang xử lý dở, mỗi yêu cầu mất <strong>W = 50 ms</strong> từ đầu tới cuối. Nó đang gánh thông lượng bao nhiêu? λ = L / W = 15 / 0,05 = 300 yêu cầu mỗi giây. Và nếu muốn phục vụ 500 yêu cầu/giây với cùng mức 15 việc song song, cần W = L/λ = 15/500 = 0,03 s = <strong>30 ms</strong> mỗi yêu cầu.</li>
</ul>
<p class="dap-an">✅ Đáp án 2: <strong>λ = 300 yêu cầu/giây; muốn lên 500 yêu cầu/giây với cùng mức song song thì độ trễ phải hạ xuống 30 ms.</strong> Đây là cách dùng định luật Little hằng ngày trong kỹ thuật: nó đổi qua lại giữa ba con số mô tả một dịch vụ — mức song song, thông lượng và độ trễ — nên biết hai cái là có cái thứ ba miễn phí.</p>
<ul>
<li><strong>Nó nằm ở đâu bên trong máy tính.</strong> L = λW mô tả một ống lệnh (phần tử = lệnh đang trong ống), hàng yêu cầu của bộ điều khiển bộ nhớ, bộ đệm của card mạng, hàng đợi thiết bị I/O (Ch.8) và hàng sẵn sàng của tiến trình (Ch.9). Chỗ nào cũng đúng ba chữ cái ấy.</li>
<li><strong>Vì sao sách ghép nó với Amdahl.</strong> Amdahl chặn trên cái mà <em>song song hoá</em> mua được; Little chặn cái mà <em>bộ đệm</em> mua được. Không định luật nào nói về một cỗ máy cụ thể; cả hai đều là số học mà không lượng kỹ thuật nào thoát khỏi.</li>
</ul>
<p class="pitfall">⚠️ Hai bẫy. (1) <strong>LẪN ĐƠN VỊ</strong> — λ theo giây mà W theo mili giây thì đáp số lớn gấp 1000 lần; luôn đổi đơn vị trước. (2) <strong>W là thời gian Ở TRONG HỆ</strong> (đợi + phục vụ), không phải riêng thời gian phục vụ. Đề cho riêng "thời gian phục vụ" và "thời gian đợi" thì phải CỘNG lại rồi mới nhân.</p>`],

      [15, 'Figure 2.5 — System Clock',
        `<p class="y-chinh">🎯 Where the numbers begin. A <strong>quartz crystal</strong> produces a steady sine wave; an <strong>A-to-D converter</strong> squares it into the digital pulse train that paces every operation in the machine. Everything measured in this chapter is counted in those pulses.</p>
<table>
<tr><th>Quantity</th><th>Symbol</th><th>Relation</th><th>Example</th></tr>
<tr><td>Clock rate / clock frequency</td><td><code>f</code></td><td>pulses per second, in Hz</td><td>2,5 GHz = 2,5 × 10<sup>9</sup> Hz</td></tr>
<tr><td>Clock cycle time / clock period</td><td><code>τ</code> (tau)</td><td><code>τ = 1 / f</code></td><td>1 / (2,5 × 10<sup>9</sup>) = 0,4 ns = 400 ps</td></tr>
</table>
<ul>
<li><strong>Why a crystal and not an oscillator circuit.</strong> A quartz crystal vibrates at an extremely stable frequency determined by its physical cut, and stability is what matters: every register transfer in the machine is timed off these edges, so drift would corrupt the whole machine, not merely slow it.</li>
<li><strong>Why the wave must be squared.</strong> Digital logic reacts to <em>edges</em> — a sharp transition from low to high. A sine wave has no sharp edge; it passes slowly through the middle voltages where a gate's output is undefined. The A-to-D converter turns the smooth wave into a square wave with fast, unambiguous edges.</li>
<li><strong>Worked conversions you must be able to do in both directions.</strong> (a) A processor has a cycle time of 0,4 ns — what is its clock rate? f = 1/0,4 ns = 1/(0,4 × 10<sup>−9</sup>) = 2,5 × 10<sup>9</sup> Hz = <strong>2,5 GHz</strong>. (b) A processor runs at 3,2 GHz — what is its cycle time? τ = 1/(3,2 × 10<sup>9</sup>) = 3,125 × 10<sup>−10</sup> s = <strong>312,5 ps = 0,3125 ns</strong>.</li>
</ul>
<p class="dap-an">✅ Answers: <strong>(a) 2,5 GHz · (b) 312,5 ps.</strong> Keep the ladder in your head: 1 s → ms (10<sup>−3</sup>) → µs (10<sup>−6</sup>) → ns (10<sup>−9</sup>) → ps (10<sup>−12</sup>), and Hz → kHz → MHz → GHz the other way. Almost every arithmetic slip in this chapter is a factor of 1000.</p>
<ul>
<li><strong>The clock is the unit of account for the whole chapter.</strong> Slide 16 will write CPU time as <code>Ic × CPI × τ</code>. Two of those three terms are pure counting (instructions, cycles per instruction); only τ carries seconds — and it comes from right here.</li>
<li><strong>What the clock does NOT tell you.</strong> A higher clock rate does not mean a faster machine, because a different processor may need more cycles for the same work. Comparing two chips by GHz alone is the same mistake as comparing them by MIPS (slide 16). Clock rate is one of three factors, never the answer by itself.</li>
</ul>
<p class="pitfall">⚠️ Notation trap: the book uses <strong>τ for cycle TIME</strong> and <strong>f for FREQUENCY</strong>, but slide 11's Amdahl's law also uses <strong>f for the parallel FRACTION</strong>. Two different f's in one chapter. Read the context, and in your own answers write "clock rate" and "parallel fraction" in words when there is any risk of confusion.</p>`,
        `<p class="y-chinh">🎯 Chỗ mọi con số bắt đầu. Một <strong>tinh thể thạch anh</strong> tạo ra sóng sin rất ổn định; một <strong>bộ chuyển A-to-D</strong> vuông hoá nó thành chuỗi xung số làm nhịp cho mọi thao tác trong máy. Mọi thứ đo đạc trong chương này đều được đếm bằng những xung đó.</p>
<table>
<tr><th>Đại lượng</th><th>Ký hiệu</th><th>Quan hệ</th><th>Ví dụ</th></tr>
<tr><td>Tốc độ xung nhịp / tần số xung nhịp</td><td><code>f</code></td><td>số xung mỗi giây, đơn vị Hz</td><td>2,5 GHz = 2,5 × 10<sup>9</sup> Hz</td></tr>
<tr><td>Chu kỳ xung nhịp</td><td><code>τ</code> (tau)</td><td><code>τ = 1 / f</code></td><td>1 / (2,5 × 10<sup>9</sup>) = 0,4 ns = 400 ps</td></tr>
</table>
<ul>
<li><strong>Vì sao dùng tinh thể chứ không phải một mạch dao động.</strong> Tinh thể thạch anh rung ở một tần số cực kỳ ỔN ĐỊNH, do chính cách cắt vật lý quyết định, và ổn định mới là điều quan trọng: mọi phép chuyển thanh ghi trong máy đều lấy nhịp theo các cạnh xung này, nên trôi tần số sẽ làm HỎNG cả cỗ máy chứ không chỉ làm nó chậm.</li>
<li><strong>Vì sao phải vuông hoá sóng.</strong> Logic số phản ứng với <em>CẠNH</em> — một bước nhảy dứt khoát từ thấp lên cao. Sóng sin không có cạnh dứt khoát; nó đi chậm qua vùng điện áp giữa, nơi đầu ra của cổng không xác định. Bộ chuyển A-to-D biến sóng mượt thành sóng vuông có cạnh nhanh, rõ ràng.</li>
<li><strong>Hai phép đổi bạn phải làm được theo cả hai chiều.</strong> (a) Bộ xử lý có chu kỳ 0,4 ns — xung nhịp bao nhiêu? f = 1/0,4 ns = 1/(0,4 × 10<sup>−9</sup>) = 2,5 × 10<sup>9</sup> Hz = <strong>2,5 GHz</strong>. (b) Bộ xử lý chạy 3,2 GHz — chu kỳ bao nhiêu? τ = 1/(3,2 × 10<sup>9</sup>) = 3,125 × 10<sup>−10</sup> s = <strong>312,5 ps = 0,3125 ns</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án: <strong>(a) 2,5 GHz · (b) 312,5 ps.</strong> Giữ sẵn cái thang trong đầu: 1 s → ms (10<sup>−3</sup>) → µs (10<sup>−6</sup>) → ns (10<sup>−9</sup>) → ps (10<sup>−12</sup>), và Hz → kHz → MHz → GHz theo chiều ngược. Gần như mọi lỗi số học của chương này là sai một hệ số 1000.</p>
<ul>
<li><strong>Xung nhịp là ĐƠN VỊ KẾ TOÁN của cả chương.</strong> Slide 16 sẽ viết thời gian CPU là <code>Ic × CPI × τ</code>. Hai trong ba số hạng đó thuần tuý là phép đếm (số lệnh, số chu kỳ mỗi lệnh); chỉ có τ mang đơn vị giây — và nó tới từ đúng chỗ này.</li>
<li><strong>Điều xung nhịp KHÔNG nói cho bạn.</strong> Xung nhịp cao hơn không có nghĩa máy nhanh hơn, vì một bộ xử lý khác có thể cần nhiều chu kỳ hơn cho cùng khối lượng việc. So hai con chip chỉ bằng GHz là đúng cái sai lầm khi so chúng bằng MIPS (slide 16). Xung nhịp là MỘT trong ba yếu tố, tự nó không bao giờ là câu trả lời.</li>
</ul>
<p class="pitfall">⚠️ Bẫy ký hiệu: sách dùng <strong>τ cho CHU KỲ</strong> và <strong>f cho TẦN SỐ</strong>, nhưng định luật Amdahl ở slide 11 lại dùng <strong>f cho TỈ LỆ SONG SONG</strong>. Hai chữ f khác nhau trong cùng một chương. Hãy đọc theo ngữ cảnh, và trong bài làm của mình cứ viết hẳn chữ "xung nhịp" và "tỉ lệ song song" khi có nguy cơ nhầm.</p>`],

      [16, 'Table 2.1 — Performance Factors and System Attributes',
        `<p class="y-chinh">🎯 The performance equation of the whole course, and a table saying <strong>which design decision can move which term</strong>. Five symbols: <code>Ic · p · m · k · τ</code>. Learn them and the rest of the chapter is arithmetic.</p>
<pre>T = Ic × [ p + (m × k) ] × τ          (the book's detailed form)
T = Ic × CPI × τ                      (the form you will use in exams)

Ic  = instruction count — how many instructions the program executes
p   = processor cycles needed to decode and execute ONE instruction
m   = number of memory references needed per instruction
k   = ratio of memory cycle time to processor cycle time
τ   = processor cycle time  ( τ = 1 / clock rate )
CPI = average cycles per instruction = p + (m × k)</pre>
<table>
<tr><th>System attribute</th><th>Ic</th><th>p</th><th>m</th><th>k</th><th>τ</th></tr>
<tr><td>Instruction set architecture</td><td>X</td><td>X</td><td></td><td></td><td></td></tr>
<tr><td>Compiler technology</td><td>X</td><td>X</td><td>X</td><td></td><td></td></tr>
<tr><td>Processor implementation</td><td></td><td>X</td><td></td><td></td><td>X</td></tr>
<tr><td>Cache and memory hierarchy</td><td></td><td></td><td></td><td>X</td><td>X</td></tr>
</table>
<ul>
<li><strong>Read the table as "who can help me".</strong> Want fewer instructions? Only the ISA and the compiler can do that. Want a shorter cycle? Only the processor implementation and the memory hierarchy. <strong>Nothing in the table touches all five</strong> — that is the point, and it is why performance work is always a negotiation between layers.</li>
<li><strong>Average CPI when instruction types differ</strong> — the formula that carries most of the exam marks:</li>
</ul>
<pre>CPI = Σ ( CPIi × fraction of instructions of type i )</pre>
<ul>
<li><strong>Full worked example (the book's own, Example 2.2).</strong> A processor runs a program of <strong>Ic = 2 million instructions</strong> at a clock rate of <strong>400 MHz</strong>, with this mix:</li>
</ul>
<table>
<tr><th>Instruction type</th><th>Fraction</th><th>CPI</th><th>Contribution</th></tr>
<tr><td>Arithmetic and logic</td><td>0,60</td><td>1</td><td>0,60 × 1 = 0,60</td></tr>
<tr><td>Load/store with cache hit</td><td>0,18</td><td>2</td><td>0,18 × 2 = 0,36</td></tr>
<tr><td>Branch</td><td>0,12</td><td>4</td><td>0,12 × 4 = 0,48</td></tr>
<tr><td>Memory reference with cache miss</td><td>0,10</td><td>8</td><td>0,10 × 8 = 0,80</td></tr>
<tr><td colspan="3"><strong>Average CPI</strong></td><td><strong>2,24</strong></td></tr>
</table>
<pre>Step 1  CPI  = 0,60 + 0,36 + 0,48 + 0,80 = 2,24
Step 2  τ    = 1 / 400 MHz = 1 / (400 × 10⁶) = 2,5 ns
Step 3  T    = Ic × CPI × τ = 2 × 10⁶ × 2,24 × 2,5 × 10⁻⁹ s = 0,0112 s
Step 4  MIPS = Ic / (T × 10⁶) = 2 × 10⁶ / (0,0112 × 10⁶) = 178,57
        cross-check: MIPS = clock rate / (CPI × 10⁶) = 400 × 10⁶ / (2,24 × 10⁶) = 178,57 ✓</pre>
<p class="dap-an">✅ Answer: <strong>CPI = 2,24 · T = 11,2 ms · MIPS ≈ 178,6.</strong> Both routes to MIPS agree, which is the check you should always run. Notice the cache-miss row: 10% of the instructions produce 0,80 of the 2,24 — <strong>36% of all cycles</strong>. That one row is the entire justification for Chapters 4 and 5.</p>
<ul>
<li><strong>The other two rate measures.</strong> <code>MIPS = Ic / (T × 10⁶) = f / (CPI × 10⁶)</code> counts instructions; <code>MFLOPS = (number of executed floating-point operations) / (T × 10⁶)</code> counts floating-point results. MFLOPS is the honest one for numerical work because a floating-point add is the same amount of <em>useful work</em> on any machine.</li>
<li><strong>⚠️ Why MIPS is a bad measure across different architectures — the reason in one sentence:</strong> MIPS counts <em>instructions</em>, but instructions from different instruction sets do different amounts of work, so a machine can win on MIPS and still lose on time. Concretely: machine X executes 5 × 10<sup>9</sup> instructions in 2,5 s → MIPS = 5 × 10<sup>9</sup>/(2,5 × 10<sup>6</sup>) = <strong>2000</strong>. Machine Y runs the same program with a richer instruction set in 2 × 10<sup>9</sup> instructions and 2,0 s → MIPS = <strong>1000</strong>.</li>
</ul>
<p class="dap-an">✅ Answer: <strong>Y has HALF the MIPS of X and yet finishes the job faster (2,0 s against 2,5 s).</strong> MIPS ranked them backwards. The rule: MIPS is meaningful only when comparing two machines of the <em>same</em> instruction set running the <em>same</em> binary; across architectures, or across compilers, only <strong>execution time</strong> (or a benchmark ratio built from it) is valid. This is why SPEC reports time ratios, never MIPS.</p>
<p class="pitfall">⚠️ Table 2.1 is a favourite short-answer question: "which system attributes affect the instruction count?" — answer <strong>instruction set architecture and compiler technology only</strong>. And note the trap in the last row: cache affects <code>k</code> and <code>τ</code> but <strong>not</strong> <code>m</code>; the compiler decides how many memory references a program makes, the cache only decides how expensive each one is.</p>`,
        `<p class="y-chinh">🎯 Phương trình hiệu năng của cả môn, cộng một bảng nói rõ <strong>quyết định thiết kế nào lay chuyển được số hạng nào</strong>. Năm ký hiệu: <code>Ic · p · m · k · τ</code>. Thuộc chúng thì phần còn lại của chương chỉ là số học.</p>
<pre>T = Ic × [ p + (m × k) ] × τ          (dạng chi tiết của sách)
T = Ic × CPI × τ                      (dạng bạn sẽ dùng khi thi)

Ic  = số lệnh chương trình thi hành
p   = số chu kỳ cần để giải mã và thi hành MỘT lệnh
m   = số lần tham chiếu bộ nhớ cần cho mỗi lệnh
k   = tỉ số giữa chu kỳ bộ nhớ và chu kỳ bộ xử lý
τ   = chu kỳ xung nhịp bộ xử lý  ( τ = 1 / tốc độ xung nhịp )
CPI = số chu kỳ trung bình mỗi lệnh = p + (m × k)</pre>
<table>
<tr><th>Thuộc tính hệ thống</th><th>Ic</th><th>p</th><th>m</th><th>k</th><th>τ</th></tr>
<tr><td>Kiến trúc tập lệnh</td><td>X</td><td>X</td><td></td><td></td><td></td></tr>
<tr><td>Công nghệ trình biên dịch</td><td>X</td><td>X</td><td>X</td><td></td><td></td></tr>
<tr><td>Hiện thực bộ xử lý</td><td></td><td>X</td><td></td><td></td><td>X</td></tr>
<tr><td>Cache và phân cấp bộ nhớ</td><td></td><td></td><td></td><td>X</td><td>X</td></tr>
</table>
<ul>
<li><strong>Đọc bảng như câu hỏi "ai giúp được tôi".</strong> Muốn ít lệnh hơn? Chỉ kiến trúc tập lệnh và trình biên dịch làm được. Muốn chu kỳ ngắn hơn? Chỉ hiện thực bộ xử lý và phân cấp bộ nhớ. <strong>Không dòng nào chạm được cả năm cột</strong> — đó mới là ý chính, và là lý do việc tối ưu hiệu năng luôn là một cuộc thương lượng giữa các tầng.</li>
<li><strong>CPI trung bình khi các loại lệnh khác nhau</strong> — công thức gánh phần lớn số điểm thi:</li>
</ul>
<pre>CPI = Σ ( CPIᵢ × tỉ lệ lệnh loại i )</pre>
<ul>
<li><strong>Bài giải trọn vẹn (chính ví dụ 2.2 của sách).</strong> Một bộ xử lý chạy chương trình <strong>Ic = 2 triệu lệnh</strong> ở xung nhịp <strong>400 MHz</strong>, với tỉ lệ lệnh như sau:</li>
</ul>
<table>
<tr><th>Loại lệnh</th><th>Tỉ lệ</th><th>CPI</th><th>Đóng góp</th></tr>
<tr><td>Số học và logic</td><td>0,60</td><td>1</td><td>0,60 × 1 = 0,60</td></tr>
<tr><td>Load/store TRÚNG cache</td><td>0,18</td><td>2</td><td>0,18 × 2 = 0,36</td></tr>
<tr><td>Rẽ nhánh</td><td>0,12</td><td>4</td><td>0,12 × 4 = 0,48</td></tr>
<tr><td>Tham chiếu bộ nhớ TRƯỢT cache</td><td>0,10</td><td>8</td><td>0,10 × 8 = 0,80</td></tr>
<tr><td colspan="3"><strong>CPI trung bình</strong></td><td><strong>2,24</strong></td></tr>
</table>
<pre>Bước 1  CPI  = 0,60 + 0,36 + 0,48 + 0,80 = 2,24
Bước 2  τ    = 1 / 400 MHz = 1 / (400 × 10⁶) = 2,5 ns
Bước 3  T    = Ic × CPI × τ = 2 × 10⁶ × 2,24 × 2,5 × 10⁻⁹ s = 0,0112 s
Bước 4  MIPS = Ic / (T × 10⁶) = 2 × 10⁶ / (0,0112 × 10⁶) = 178,57
        đối chiếu: MIPS = xung nhịp / (CPI × 10⁶) = 400 × 10⁶ / (2,24 × 10⁶) = 178,57 ✓</pre>
<p class="dap-an">✅ Đáp án: <strong>CPI = 2,24 · T = 11,2 ms · MIPS ≈ 178,6.</strong> Hai đường tính MIPS cho cùng kết quả — đó là phép kiểm bạn nên chạy mọi lần. Để ý dòng trượt cache: 10% số lệnh sinh ra 0,80 trong tổng 2,24 — tức <strong>36% toàn bộ chu kỳ</strong>. Một dòng đó là toàn bộ lý do tồn tại của Chương 4 và Chương 5.</p>
<ul>
<li><strong>Hai thước đo tốc độ còn lại.</strong> <code>MIPS = Ic / (T × 10⁶) = f / (CPI × 10⁶)</code> đếm SỐ LỆNH; <code>MFLOPS = (số phép dấu phẩy động đã thi hành) / (T × 10⁶)</code> đếm SỐ PHÉP TOÁN THỰC. MFLOPS là thước trung thực hơn cho tính toán số, vì một phép cộng dấu phẩy động là cùng một lượng <em>việc có ích</em> trên mọi máy.</li>
<li><strong>⚠️ VÌ SAO MIPS LÀ THƯỚC ĐO TỒI khi so hai kiến trúc khác nhau — lý do trong một câu:</strong> MIPS đếm <em>LỆNH</em>, mà lệnh của hai tập lệnh khác nhau làm lượng việc khác nhau, nên một cỗ máy có thể thắng về MIPS mà vẫn thua về thời gian. Cụ thể: máy X thi hành 5 × 10<sup>9</sup> lệnh trong 2,5 s → MIPS = 5 × 10<sup>9</sup>/(2,5 × 10<sup>6</sup>) = <strong>2000</strong>. Máy Y chạy đúng chương trình ấy với tập lệnh giàu hơn, chỉ cần 2 × 10<sup>9</sup> lệnh và 2,0 s → MIPS = <strong>1000</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án: <strong>Y có MIPS bằng MỘT NỬA X mà lại xong việc NHANH HƠN (2,0 s so với 2,5 s).</strong> MIPS đã xếp hạng ngược. Quy tắc: MIPS chỉ có nghĩa khi so hai máy CÙNG tập lệnh chạy CÙNG một file nhị phân; so qua kiến trúc khác nhau, hay qua trình biên dịch khác nhau, thì chỉ <strong>THỜI GIAN THI HÀNH</strong> (hoặc tỉ số benchmark dựng từ nó) mới hợp lệ. Đó chính là lý do SPEC công bố tỉ số thời gian chứ không bao giờ công bố MIPS.</p>
<p class="pitfall">⚠️ Table 2.1 là câu hỏi ngắn ưa thích: "thuộc tính hệ thống nào ảnh hưởng tới số lệnh?" — đáp án <strong>CHỈ có kiến trúc tập lệnh và công nghệ trình biên dịch</strong>. Và để ý bẫy ở dòng cuối: cache ảnh hưởng <code>k</code> và <code>τ</code> nhưng <strong>KHÔNG</strong> ảnh hưởng <code>m</code>; trình biên dịch mới quyết định chương trình tham chiếu bộ nhớ bao nhiêu lần, cache chỉ quyết định mỗi lần ấy ĐẮT bao nhiêu.</p>`],

      [17, 'Calculating the Mean',
        `<p class="y-chinh">🎯 A benchmark suite gives you many numbers and a reviewer wants one. The slide states the problem — "the use of benchmarks to compare systems involves calculating the mean value of a set of data points related to execution time" — and names the only three candidates: <strong>Arithmetic · Geometric · Harmonic</strong>.</p>
<table>
<tr><th>Mean</th><th>Formula for n values x<sub>1</sub>…x<sub>n</sub></th><th>Use it when the data are…</th></tr>
<tr><td><strong>Arithmetic (AM)</strong></td><td>(x<sub>1</sub> + x<sub>2</sub> + … + x<sub>n</sub>) / n</td><td><strong>Times</strong>, where the SUM is meaningful</td></tr>
<tr><td><strong>Geometric (GM)</strong></td><td><sup>n</sup>√(x<sub>1</sub> × x<sub>2</sub> × … × x<sub>n</sub>)</td><td><strong>Normalized ratios</strong> (speedups, SPEC ratios)</td></tr>
<tr><td><strong>Harmonic (HM)</strong></td><td>n / (1/x<sub>1</sub> + 1/x<sub>2</sub> + … + 1/x<sub>n</sub>)</td><td><strong>Rates</strong> (MFLOPS, MIPS, requests/s)</td></tr>
</table>
<ul>
<li><strong>The ordering is a theorem, not a coincidence: HM ≤ GM ≤ AM</strong> for any set of positive numbers, with equality only when every value is identical. Slide 18 is a picture of exactly this inequality on seven different data sets.</li>
<li><strong>The one rule that decides which to use.</strong> Ask: <em>what quantity is meaningful when added up?</em> If adding the numbers gives something real (total seconds), use AM. If the numbers are rates and it is the <em>total work over total time</em> that is real, use HM. If the numbers are dimensionless ratios against a reference, use GM.</li>
<li><strong>Why HM is the right mean for rates, in one line of algebra.</strong> Two programs of equal size, run at rates r<sub>1</sub> and r<sub>2</sub>. Time = W/r<sub>1</sub> + W/r<sub>2</sub>; total work = 2W; so the true overall rate = 2W / (W/r<sub>1</sub> + W/r<sub>2</sub>) = 2 / (1/r<sub>1</sub> + 1/r<sub>2</sub>) — which <em>is</em> the harmonic mean. Averaging rates arithmetically simply computes a number that no run ever achieved.</li>
<li><strong>Numeric proof of that claim.</strong> A program of 10<sup>9</sup> FP operations runs half its operations at 100 MFLOPS and half at 400 MFLOPS. Times: 5 × 10<sup>8</sup>/10<sup>8</sup> = 5,0 s and 5 × 10<sup>8</sup>/(4 × 10<sup>8</sup>) = 1,25 s, total 6,25 s. True overall rate = 10<sup>9</sup>/6,25/10<sup>6</sup> = 160 MFLOPS. AM would have said (100+400)/2 = 250 MFLOPS. HM says 2/(1/100 + 1/400) = 2/0,0125 = 160.</li>
</ul>
<p class="dap-an">✅ Answer: <strong>the true rate is 160 MFLOPS — the harmonic mean, exactly. The arithmetic mean's 250 MFLOPS is 56% too high and corresponds to no real execution.</strong> This is the cleanest demonstration in the chapter that the choice of mean is not a matter of taste.</p>
<p class="meo">💡 Three-word memory hook: <strong>times → add (AM) · rates → invert (HM) · ratios → multiply (GM)</strong>. The verb tells you the formula: AM sums, HM sums the reciprocals, GM multiplies and takes the root.</p>`,
        `<p class="y-chinh">🎯 Một bộ benchmark cho bạn rất nhiều con số, mà người đọc chỉ muốn MỘT. Slide nêu đúng bài toán — "dùng benchmark để so sánh hệ thống thì phải tính giá trị trung bình của một tập điểm dữ liệu liên quan tới thời gian thi hành" — và gọi tên ba ứng viên duy nhất: <strong>số học · hình học · điều hoà</strong>.</p>
<table>
<tr><th>Trung bình</th><th>Công thức cho n giá trị x<sub>1</sub>…x<sub>n</sub></th><th>Dùng khi dữ liệu là…</th></tr>
<tr><td><strong>Số học (AM)</strong></td><td>(x<sub>1</sub> + x<sub>2</sub> + … + x<sub>n</sub>) / n</td><td><strong>THỜI GIAN</strong>, khi phép CỘNG có nghĩa</td></tr>
<tr><td><strong>Hình học (GM)</strong></td><td><sup>n</sup>√(x<sub>1</sub> × x<sub>2</sub> × … × x<sub>n</sub>)</td><td><strong>TỈ SỐ CHUẨN HOÁ</strong> (mức tăng tốc, tỉ số SPEC)</td></tr>
<tr><td><strong>Điều hoà (HM)</strong></td><td>n / (1/x<sub>1</sub> + 1/x<sub>2</sub> + … + 1/x<sub>n</sub>)</td><td><strong>TỐC ĐỘ</strong> (MFLOPS, MIPS, yêu cầu/giây)</td></tr>
</table>
<ul>
<li><strong>Thứ tự HM ≤ GM ≤ AM là một ĐỊNH LÝ, không phải trùng hợp</strong> — đúng với mọi tập số dương, và chỉ bằng nhau khi mọi giá trị y hệt nhau. Slide 18 chính là bức tranh của bất đẳng thức này trên bảy tập dữ liệu khác nhau.</li>
<li><strong>Một quy tắc quyết định dùng cái nào.</strong> Tự hỏi: <em>đại lượng nào có nghĩa khi CỘNG lại?</em> Cộng các số mà ra một thứ có thật (tổng số giây) thì dùng AM. Các số là tốc độ, mà thứ có thật là <em>tổng công việc trên tổng thời gian</em>, thì dùng HM. Các số là tỉ số không thứ nguyên so với một mốc thì dùng GM.</li>
<li><strong>Vì sao HM mới đúng cho tốc độ, gói trong một dòng đại số.</strong> Hai chương trình khối lượng bằng nhau, chạy ở tốc độ r<sub>1</sub> và r<sub>2</sub>. Thời gian = W/r<sub>1</sub> + W/r<sub>2</sub>; tổng công việc = 2W; nên tốc độ THẬT toàn cục = 2W / (W/r<sub>1</sub> + W/r<sub>2</sub>) = 2 / (1/r<sub>1</sub> + 1/r<sub>2</sub>) — chính LÀ trung bình điều hoà. Lấy trung bình số học của tốc độ chỉ cho ra một con số mà không lần chạy nào từng đạt tới.</li>
<li><strong>Chứng minh bằng số cho khẳng định đó.</strong> Một chương trình 10<sup>9</sup> phép dấu phẩy động chạy nửa số phép ở 100 MFLOPS và nửa kia ở 400 MFLOPS. Thời gian: 5 × 10<sup>8</sup>/10<sup>8</sup> = 5,0 s và 5 × 10<sup>8</sup>/(4 × 10<sup>8</sup>) = 1,25 s, tổng 6,25 s. Tốc độ thật = 10<sup>9</sup>/6,25/10<sup>6</sup> = 160 MFLOPS. AM sẽ nói (100+400)/2 = 250 MFLOPS. HM nói 2/(1/100 + 1/400) = 2/0,0125 = 160.</li>
</ul>
<p class="dap-an">✅ Đáp án: <strong>tốc độ thật là 160 MFLOPS — đúng bằng trung bình ĐIỀU HOÀ. Con số 250 MFLOPS của trung bình số học cao hơn 56% và không ứng với lần chạy có thật nào.</strong> Đây là minh chứng gọn nhất cả chương rằng chọn phép trung bình KHÔNG phải chuyện sở thích.</p>
<p class="meo">💡 Móc nhớ ba chữ: <strong>thời gian → CỘNG (AM) · tốc độ → NGHỊCH ĐẢO (HM) · tỉ số → NHÂN (GM)</strong>. Động từ nói luôn công thức: AM cộng, HM cộng các nghịch đảo, GM nhân rồi khai căn.</p>`],

      [18, 'Figure 2.6 — Comparison of Means on Various Data Sets',
        `<p class="y-chinh">🎯 Seven data sets, each with a maximum value of 11, and for each one the four bars <strong>MD (median) · AM · GM · HM</strong>. Every group shows the same ordering, and the size of the gap tells you how skewed the data are.</p>
<table>
<tr><th>Data set on the slide</th><th>MD</th><th>AM</th><th>GM</th><th>HM</th></tr>
<tr><td><strong>(a)</strong> Constant (11, 11, …, 11)</td><td>11,00</td><td>11,00</td><td>11,00</td><td>11,00</td></tr>
<tr><td><strong>(b)</strong> Clustered around a central value (3, 5, 6, 6, 7, 7, 7, 8, 8, 9, 11)</td><td>7,00</td><td>7,00</td><td>6,68</td><td>6,30</td></tr>
<tr><td><strong>(c)</strong> Uniform distribution (1 … 11)</td><td>6,00</td><td>6,00</td><td>4,91</td><td>3,64</td></tr>
<tr><td><strong>(d)</strong> Large-number bias (1, 4, 4, 7, 7, 9, 9, 10, 10, 11, 11)</td><td>9,00</td><td>7,55</td><td>6,42</td><td>4,60</td></tr>
<tr><td><strong>(e)</strong> Small-number bias (1, 1, 2, 2, 3, 3, 5, 5, 8, 8, 11)</td><td>3,00</td><td>4,45</td><td>3,37</td><td>2,50</td></tr>
<tr><td><strong>(f)</strong> Upper outlier (11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)</td><td>1,00</td><td>1,91</td><td>1,24</td><td>1,09</td></tr>
<tr><td><strong>(g)</strong> Lower outlier (1, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11)</td><td>11,00</td><td>10,09</td><td>8,85</td><td>5,76</td></tr>
</table>
<ul>
<li><strong>Every number in that table was recomputed from the data sets printed on the slide and matches the drawn bars.</strong> Use it as a worked example rather than squinting at bar lengths.</li>
<li><strong>Row (a) proves the equality case.</strong> When all values are identical, MD = AM = GM = HM. Any spread at all breaks the tie, and it breaks it in a fixed direction: <strong>HM ≤ GM ≤ AM</strong>, in every one of the seven rows. Check (c): 3,64 ≤ 4,91 ≤ 6,00 ✓.</li>
<li><strong>Rows (f) and (g) are the important pair.</strong> Look at (g): one single low value (a 1 among ten 11s) drags HM down from 11 to <strong>5,76</strong> — it halves. The same shape in (f): one high value lifts AM from 1 to 1,91 — it nearly doubles. So <strong>the harmonic mean is dominated by the smallest values and the arithmetic mean by the largest</strong>. GM sits between and is moved least in both directions.</li>
<li><strong>Why that matters for benchmarking.</strong> If a machine is catastrophically bad at one benchmark out of twenty, the harmonic mean will report a catastrophic machine and the arithmetic mean will barely notice. Neither is lying; they are answering different questions. GM's relative insensitivity to a single outlier is one reason SPEC chose it (slide 31).</li>
<li><strong>The median is on the chart for contrast, not for use.</strong> MD ignores magnitudes entirely — see (f), where MD = 1 even though one run was 11× worse. It is robust, but it throws away exactly the information a performance summary needs.</li>
</ul>
<p class="pitfall">⚠️ Do not conclude "GM is always the best mean". The correct conclusion is the one from slide 17: the mean must match the <strong>kind of quantity</strong>. GM is right for <em>normalized ratios</em> (slide 21–22), HM is right for <em>rates</em> (slide 20), AM is right for <em>times</em> (slide 19). Figure 2.6 only shows how they behave, not which is appropriate.</p>`,
        `<p class="y-chinh">🎯 Bảy tập dữ liệu, tập nào giá trị lớn nhất cũng là 11, và với mỗi tập là bốn cột <strong>MD (trung vị) · AM · GM · HM</strong>. Nhóm nào cũng cho cùng một thứ tự, và độ rộng khoảng cách cho biết dữ liệu lệch tới đâu.</p>
<table>
<tr><th>Tập dữ liệu trên slide</th><th>MD</th><th>AM</th><th>GM</th><th>HM</th></tr>
<tr><td><strong>(a)</strong> Hằng số (11, 11, …, 11)</td><td>11,00</td><td>11,00</td><td>11,00</td><td>11,00</td></tr>
<tr><td><strong>(b)</strong> Tụm quanh một giá trị giữa (3, 5, 6, 6, 7, 7, 7, 8, 8, 9, 11)</td><td>7,00</td><td>7,00</td><td>6,68</td><td>6,30</td></tr>
<tr><td><strong>(c)</strong> Phân bố đều (1 … 11)</td><td>6,00</td><td>6,00</td><td>4,91</td><td>3,64</td></tr>
<tr><td><strong>(d)</strong> Lệch về số LỚN (1, 4, 4, 7, 7, 9, 9, 10, 10, 11, 11)</td><td>9,00</td><td>7,55</td><td>6,42</td><td>4,60</td></tr>
<tr><td><strong>(e)</strong> Lệch về số NHỎ (1, 1, 2, 2, 3, 3, 5, 5, 8, 8, 11)</td><td>3,00</td><td>4,45</td><td>3,37</td><td>2,50</td></tr>
<tr><td><strong>(f)</strong> Một điểm vọt LÊN (11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)</td><td>1,00</td><td>1,91</td><td>1,24</td><td>1,09</td></tr>
<tr><td><strong>(g)</strong> Một điểm tụt XUỐNG (1, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11)</td><td>11,00</td><td>10,09</td><td>8,85</td><td>5,76</td></tr>
</table>
<ul>
<li><strong>Mọi con số trong bảng trên đều được TÍNH LẠI từ các tập dữ liệu in trên slide và khớp với các cột đã vẽ.</strong> Hãy dùng bảng như một bài giải mẫu, thay vì nheo mắt đo chiều dài cột.</li>
<li><strong>Dòng (a) chứng minh trường hợp bằng nhau.</strong> Khi mọi giá trị y hệt nhau thì MD = AM = GM = HM. Chỉ cần có độ tản là thế hoà bị phá, và phá theo một chiều cố định: <strong>HM ≤ GM ≤ AM</strong>, đúng ở cả bảy dòng. Kiểm dòng (c): 3,64 ≤ 4,91 ≤ 6,00 ✓.</li>
<li><strong>Dòng (f) và (g) là cặp quan trọng.</strong> Nhìn (g): chỉ MỘT giá trị thấp (một số 1 giữa mười số 11) kéo HM từ 11 tụt xuống <strong>5,76</strong> — mất một nửa. Cùng hình dáng ở (f): một giá trị cao nâng AM từ 1 lên 1,91 — gần gấp đôi. Vậy <strong>trung bình điều hoà bị các giá trị NHỎ NHẤT chi phối, còn trung bình số học bị các giá trị LỚN NHẤT chi phối</strong>. GM nằm giữa và bị lay ít nhất ở cả hai chiều.</li>
<li><strong>Vì sao điều đó quan trọng khi làm benchmark.</strong> Nếu một cỗ máy tệ thảm hại ở đúng một benchmark trong hai mươi, trung bình điều hoà sẽ báo một cỗ máy thảm hại còn trung bình số học thì gần như không thấy gì. Không cái nào nói dối; chúng trả lời hai câu hỏi khác nhau. Việc GM ít nhạy với một điểm dị thường là một trong các lý do SPEC chọn nó (slide 31).</li>
<li><strong>Trung vị nằm trên biểu đồ để ĐỐI CHIẾU, không phải để dùng.</strong> MD bỏ qua hoàn toàn độ lớn — xem (f), MD = 1 dù có một lần chạy tệ gấp 11 lần. Nó bền vững thật, nhưng nó vứt đi đúng cái thông tin mà một bản tóm tắt hiệu năng cần.</li>
</ul>
<p class="pitfall">⚠️ Đừng kết luận "GM luôn là phép trung bình tốt nhất". Kết luận đúng là kết luận của slide 17: phép trung bình phải khớp với <strong>LOẠI ĐẠI LƯỢNG</strong>. GM đúng cho <em>tỉ số chuẩn hoá</em> (slide 21–22), HM đúng cho <em>tốc độ</em> (slide 20), AM đúng cho <em>thời gian</em> (slide 19). Figure 2.6 chỉ cho thấy chúng CƯ XỬ ra sao, không nói cái nào thích hợp.</p>`],

      [19, 'Arithmetic Mean',
        `<p class="y-chinh">🎯 The rule for AM, in the slide's own wording: it is appropriate <strong>if the sum of all the measurements is a meaningful and interesting value</strong>. For execution times it is; for rates and ratios it is not — which is what slides 20 to 22 will prove.</p>
<ul>
<li><strong>What the slide claims</strong> — an AM is an appropriate measure if the sum of all the measurements is meaningful and interesting; the AM is a good candidate for comparing the <em>execution time</em> performance of several systems; and the AM used for a time-based variable such as program execution time has the important property that it is <strong>directly proportional to the total time</strong> — if the total time doubles, the mean value doubles.</li>
<li><strong>"Directly proportional to the total time" is the whole justification.</strong> AM = total ÷ n, and n is fixed across the systems you are comparing, so ranking systems by AM of times gives exactly the same ranking as ranking them by total time. The mean adds no information — it just rescales — and that is precisely why it is safe.</li>
<li><strong>The slide's own scenario, restated.</strong> You want a machine for large-scale simulation. On each candidate you run the simulation many times with different inputs and average the execution times. Using multiple runs with different inputs ensures the result is not heavily biased by some unusual feature of one input set, and the AM of all runs is a good measure of the system's performance on simulations and a good number for system comparison.</li>
<li><strong>Worked example.</strong> Three benchmarks take 2,0 s, 0,75 s and 4,0 s on a machine. AM = (2,0 + 0,75 + 4,0)/3 = 6,75/3 = 2,25 s. Total = 6,75 s.</li>
</ul>
<p class="dap-an">✅ Answer: <strong>AM = 2,25 s, total = 6,75 s.</strong> Ranking any set of machines by the first number and by the second gives the same order every time — that is the property the slide calls "directly proportional".</p>
<ul>
<li><strong>The hidden weighting nobody mentions.</strong> AM of times weights each benchmark by how long it happens to take. A 4-second benchmark dominates a 0,75-second one by more than 5 to 1. If the suite is meant to represent a workload where all programs are equally important, an unweighted AM of raw times quietly disagrees with you. SPEC dodges this by normalizing first (slide 21) and then using GM.</li>
<li><strong>Where AM is flatly wrong.</strong> Two places, both coming up next: on <strong>rates</strong> (slide 20 — use HM) and on <strong>normalized ratios</strong> (slides 21–22 — use GM). In both cases the sum of the measurements is not a meaningful quantity, which is exactly the condition the slide set at the top.</li>
</ul>
<p class="meo">💡 Turn the slide's rule into a one-question test you can apply in the exam: <em>"If I add these numbers up, do I get something real?"</em> Seconds + seconds = total seconds → real → AM is fine. MFLOPS + MFLOPS = nothing → not real → AM is wrong.</p>`,
        `<p class="y-chinh">🎯 Quy tắc dùng AM, đúng theo lời slide: nó thích hợp <strong>nếu TỔNG của tất cả các phép đo là một giá trị có ý nghĩa và đáng quan tâm</strong>. Với thời gian thi hành thì đúng; với tốc độ và tỉ số thì sai — và slide 20 tới 22 sẽ chứng minh điều đó.</p>
<ul>
<li><strong>Slide khẳng định gì</strong> — AM là thước đo thích hợp nếu tổng mọi phép đo có ý nghĩa và đáng quan tâm; AM là ứng viên tốt để so sánh hiệu năng <em>THỜI GIAN THI HÀNH</em> của nhiều hệ; và AM dùng cho biến theo thời gian như thời gian chạy chương trình có một tính chất quan trọng: nó <strong>TỈ LỆ THUẬN với tổng thời gian</strong> — tổng thời gian tăng gấp đôi thì giá trị trung bình cũng gấp đôi.</li>
<li><strong>"Tỉ lệ thuận với tổng thời gian" là toàn bộ lý lẽ biện hộ.</strong> AM = tổng ÷ n, mà n cố định trên mọi hệ bạn đang so, nên xếp hạng theo AM của thời gian cho ra ĐÚNG thứ hạng như xếp theo tổng thời gian. Phép trung bình không thêm thông tin nào — nó chỉ đổi thang — và chính vì thế nó an toàn.</li>
<li><strong>Tình huống của chính slide, kể lại.</strong> Bạn cần một cỗ máy để chạy mô phỏng quy mô lớn. Trên mỗi ứng viên bạn chạy mô phỏng nhiều lần với các đầu vào khác nhau rồi lấy trung bình thời gian. Việc chạy nhiều lần với đầu vào khác nhau bảo đảm kết quả không bị lệch nặng vì một đặc điểm bất thường của một bộ đầu vào nào đó, và AM của mọi lần chạy là thước đo tốt cho hiệu năng mô phỏng của hệ, cũng là con số tốt để so sánh hệ thống.</li>
<li><strong>Bài giải mẫu.</strong> Ba benchmark chạy hết 2,0 s, 0,75 s và 4,0 s trên một máy. AM = (2,0 + 0,75 + 4,0)/3 = 6,75/3 = 2,25 s. Tổng = 6,75 s.</li>
</ul>
<p class="dap-an">✅ Đáp án: <strong>AM = 2,25 s, tổng = 6,75 s.</strong> Xếp hạng một tập máy bất kỳ theo con số thứ nhất hay theo con số thứ hai đều cho cùng thứ tự, lần nào cũng vậy — đó chính là tính chất mà slide gọi là "tỉ lệ thuận".</p>
<ul>
<li><strong>Trọng số ẩn mà không ai nhắc.</strong> AM của thời gian gán cho mỗi benchmark một trọng số bằng chính thời gian nó tình cờ tốn. Một benchmark 4 giây lấn át một benchmark 0,75 giây với tỉ lệ hơn 5 ăn 1. Nếu bộ benchmark đáng lẽ đại diện cho một tải công việc mà mọi chương trình quan trọng ngang nhau, thì AM không trọng số của thời gian thô đang lặng lẽ phản đối bạn. SPEC né chuyện này bằng cách CHUẨN HOÁ trước (slide 21) rồi mới dùng GM.</li>
<li><strong>Chỗ AM sai thẳng thừng.</strong> Hai chỗ, đều tới ngay sau đây: trên <strong>TỐC ĐỘ</strong> (slide 20 — dùng HM) và trên <strong>TỈ SỐ CHUẨN HOÁ</strong> (slide 21–22 — dùng GM). Cả hai trường hợp, tổng các phép đo đều không phải một đại lượng có nghĩa, đúng vào điều kiện mà slide đã đặt ra ngay đầu.</li>
</ul>
<p class="meo">💡 Biến quy tắc của slide thành một câu hỏi kiểm tra dùng được ngay trong phòng thi: <em>"Cộng mấy số này lại, tôi có được thứ gì có thật không?"</em> Giây + giây = tổng số giây → có thật → AM dùng được. MFLOPS + MFLOPS = chẳng là gì → không có thật → AM sai.</p>`],

      [20, 'Table 2.2 — A Comparison of Arithmetic and Harmonic Means for Rates',
        `<p class="y-chinh">🎯 The proof that you must not average rates arithmetically. Two programs of <strong>10<sup>8</sup> floating-point operations</strong> each, three computers, and the arithmetic mean of MFLOPS rates ranks the machines <em>differently</em> from total execution time.</p>
<table>
<tr><th></th><th>A time (s)</th><th>B time (s)</th><th>C time (s)</th><th>A rate (MFLOPS)</th><th>B rate (MFLOPS)</th><th>C rate (MFLOPS)</th></tr>
<tr><td>Program 1 (10<sup>8</sup> FP ops)</td><td>2,0</td><td>1,0</td><td>0,75</td><td>50</td><td>100</td><td>133,33</td></tr>
<tr><td>Program 2 (10<sup>8</sup> FP ops)</td><td>0,75</td><td>2,0</td><td>4,0</td><td>133,33</td><td>50</td><td>25</td></tr>
<tr><td><strong>Total execution time</strong></td><td><strong>2,75</strong></td><td><strong>3,0</strong></td><td><strong>4,75</strong></td><td>–</td><td>–</td><td>–</td></tr>
<tr><td>Arithmetic mean of times</td><td>1,38</td><td>1,5</td><td>2,38</td><td>–</td><td>–</td><td>–</td></tr>
<tr><td>Inverse of total execution time (1/s)</td><td>0,36</td><td>0,33</td><td>0,21</td><td>–</td><td>–</td><td>–</td></tr>
<tr><td><strong>Arithmetic mean of rates</strong></td><td>–</td><td>–</td><td>–</td><td><strong>91,67</strong></td><td><strong>75,00</strong></td><td><strong>79,17</strong></td></tr>
<tr><td><strong>Harmonic mean of rates</strong></td><td>–</td><td>–</td><td>–</td><td><strong>72,72</strong></td><td><strong>66,67</strong></td><td><strong>42,11</strong></td></tr>
</table>
<ul>
<li><strong>How every cell was produced — verify it yourself.</strong> Rate = 10<sup>8</sup> ops ÷ time ÷ 10<sup>6</sup>. A/Program 1: 10<sup>8</sup>/2,0 = 5 × 10<sup>7</sup> = <strong>50 MFLOPS</strong>. A/Program 2: 10<sup>8</sup>/0,75 = 1,3333 × 10<sup>8</sup> = <strong>133,33 MFLOPS</strong>. AM of A's rates = (50 + 133,33)/2 = 91,67. HM of A's rates = 2/(1/50 + 1/133,33) = 2/0,0275 = <strong>72,73</strong> (the slide prints 72,72; a rounding difference in the last digit, not an error of method).</li>
<li><strong>The contradiction, stated plainly.</strong> By <strong>total time</strong> the ranking is A (2,75 s) &lt; B (3,0 s) &lt; C (4,75 s) — A is fastest, C is slowest. By <strong>arithmetic mean of rates</strong> the ranking is A (91,67) &gt; C (79,17) &gt; B (75,00) — which puts <strong>C ahead of B</strong>, although C takes 58% more time than B. The arithmetic mean of rates is simply wrong.</li>
<li><strong>Why HM is right, checked against the table.</strong> Look at the "inverse of total execution time" row: A 0,36, B 0,33, C 0,21. Now look at the HM row: 72,72, 66,67, 42,11. Divide the HM values by 200 and you get 0,3636, 0,3333, 0,2105 — the same numbers, and the same ranking. <strong>The harmonic mean of rates is proportional to the inverse of total time</strong>, which is exactly the property AM has for times (slide 19). That is the structural reason HM is the correct mean for rates.</li>
<li><strong>Look at C to see the mechanism.</strong> C has the best single rate in the table (133,33 on Program 1) and the worst (25 on Program 2). AM lets the good number lift the average; HM lets the bad number sink it — and the bad number is the one that dominates the running time, because the slow program is where the seconds go.</li>
</ul>
<p class="dap-an">✅ Conclusion to write in an exam: <strong>the arithmetic mean of rates ranked C above B while C is demonstrably slower; the harmonic mean ranked the three machines exactly as total execution time does (A &gt; B &gt; C). For rate-based measures such as MFLOPS or MIPS, use the harmonic mean.</strong></p>
<p class="pitfall">⚠️ <strong>The slide has a labelling error:</strong> both data rows are printed as "Program 1". The second row must be read as <strong>Program 2</strong> — every number in the table only makes sense that way (a machine cannot take both 2,0 s and 0,75 s on the same program). Do not copy the label; copy the numbers.</p>`,
        `<p class="y-chinh">🎯 Bằng chứng rằng KHÔNG được lấy trung bình số học của tốc độ. Hai chương trình, mỗi chương trình <strong>10<sup>8</sup> phép dấu phẩy động</strong>, ba máy tính, và trung bình số học của tốc độ MFLOPS xếp hạng các máy <em>KHÁC</em> với tổng thời gian thi hành.</p>
<table>
<tr><th></th><th>A thời gian (s)</th><th>B thời gian (s)</th><th>C thời gian (s)</th><th>A tốc độ (MFLOPS)</th><th>B tốc độ (MFLOPS)</th><th>C tốc độ (MFLOPS)</th></tr>
<tr><td>Chương trình 1 (10<sup>8</sup> phép FP)</td><td>2,0</td><td>1,0</td><td>0,75</td><td>50</td><td>100</td><td>133,33</td></tr>
<tr><td>Chương trình 2 (10<sup>8</sup> phép FP)</td><td>0,75</td><td>2,0</td><td>4,0</td><td>133,33</td><td>50</td><td>25</td></tr>
<tr><td><strong>Tổng thời gian thi hành</strong></td><td><strong>2,75</strong></td><td><strong>3,0</strong></td><td><strong>4,75</strong></td><td>–</td><td>–</td><td>–</td></tr>
<tr><td>Trung bình số học của thời gian</td><td>1,38</td><td>1,5</td><td>2,38</td><td>–</td><td>–</td><td>–</td></tr>
<tr><td>Nghịch đảo tổng thời gian (1/s)</td><td>0,36</td><td>0,33</td><td>0,21</td><td>–</td><td>–</td><td>–</td></tr>
<tr><td><strong>Trung bình SỐ HỌC của tốc độ</strong></td><td>–</td><td>–</td><td>–</td><td><strong>91,67</strong></td><td><strong>75,00</strong></td><td><strong>79,17</strong></td></tr>
<tr><td><strong>Trung bình ĐIỀU HOÀ của tốc độ</strong></td><td>–</td><td>–</td><td>–</td><td><strong>72,72</strong></td><td><strong>66,67</strong></td><td><strong>42,11</strong></td></tr>
</table>
<ul>
<li><strong>Từng ô được tạo ra thế nào — tự kiểm lại đi.</strong> Tốc độ = 10<sup>8</sup> phép ÷ thời gian ÷ 10<sup>6</sup>. A/Chương trình 1: 10<sup>8</sup>/2,0 = 5 × 10<sup>7</sup> = <strong>50 MFLOPS</strong>. A/Chương trình 2: 10<sup>8</sup>/0,75 = 1,3333 × 10<sup>8</sup> = <strong>133,33 MFLOPS</strong>. AM tốc độ của A = (50 + 133,33)/2 = 91,67. HM tốc độ của A = 2/(1/50 + 1/133,33) = 2/0,0275 = <strong>72,73</strong> (slide in 72,72; chênh do làm tròn ở chữ số cuối, không phải sai phương pháp).</li>
<li><strong>Mâu thuẫn, nói thẳng.</strong> Theo <strong>TỔNG THỜI GIAN</strong>, thứ hạng là A (2,75 s) &lt; B (3,0 s) &lt; C (4,75 s) — A nhanh nhất, C chậm nhất. Theo <strong>TRUNG BÌNH SỐ HỌC CỦA TỐC ĐỘ</strong>, thứ hạng là A (91,67) &gt; C (79,17) &gt; B (75,00) — tức đặt <strong>C TRÊN B</strong>, dù C tốn nhiều hơn B tới 58% thời gian. Trung bình số học của tốc độ đơn giản là SAI.</li>
<li><strong>Vì sao HM đúng, kiểm ngay trên bảng.</strong> Nhìn dòng "nghịch đảo tổng thời gian": A 0,36, B 0,33, C 0,21. Giờ nhìn dòng HM: 72,72, 66,67, 42,11. Chia các giá trị HM cho 200 sẽ được 0,3636, 0,3333, 0,2105 — đúng bộ số đó, đúng thứ hạng đó. <strong>Trung bình điều hoà của tốc độ TỈ LỆ THUẬN với nghịch đảo tổng thời gian</strong>, đúng cái tính chất mà AM có với thời gian (slide 19). Đó là lý do CẤU TRÚC khiến HM là phép trung bình đúng cho tốc độ.</li>
<li><strong>Nhìn máy C để thấy cơ chế.</strong> C có tốc độ đơn lẻ TỐT NHẤT bảng (133,33 ở Chương trình 1) và cũng TỆ NHẤT (25 ở Chương trình 2). AM để con số tốt nâng trung bình lên; HM để con số tệ dìm trung bình xuống — mà con số tệ mới là con số chi phối thời gian chạy, vì số giây nằm ở chỗ chương trình chạy chậm.</li>
</ul>
<p class="dap-an">✅ Kết luận nên viết vào bài thi: <strong>trung bình số học của tốc độ đã xếp C trên B trong khi C chứng minh được là chậm hơn; trung bình điều hoà xếp ba máy đúng y như tổng thời gian thi hành (A &gt; B &gt; C). Với các thước đo dạng TỐC ĐỘ như MFLOPS hay MIPS, phải dùng trung bình ĐIỀU HOÀ.</strong></p>
<p class="pitfall">⚠️ <strong>SLIDE GỐC GHI SAI NHÃN:</strong> cả hai dòng dữ liệu đều in là "Program 1". Dòng thứ hai phải đọc là <strong>Program 2</strong> — mọi con số trong bảng chỉ có nghĩa khi hiểu như vậy (một máy không thể vừa tốn 2,0 s vừa tốn 0,75 s cho cùng một chương trình). Đừng chép cái nhãn; hãy chép các con số.</p>`],

      [21, 'Table 2.3 — A Comparison of Arithmetic and Geometric Means for Normalized Results',
        `<p class="y-chinh">🎯 The classic trap of the chapter. The <em>same three machines</em>, the <em>same times</em>, normalized twice — once against A, once against B — and the <strong>arithmetic mean changes its mind about which machine is best</strong>, while the geometric mean does not.</p>
<table>
<tr><th>(a) Normalized to Computer A</th><th>A</th><th>B</th><th>C</th></tr>
<tr><td>Program 1</td><td>2,0 (1,0)</td><td>1,0 (0,5)</td><td>0,75 (0,38)</td></tr>
<tr><td>Program 2</td><td>0,75 (1,0)</td><td>2,0 (2,67)</td><td>4,0 (5,33)</td></tr>
<tr><td>Total execution time</td><td>2,75</td><td>3,0</td><td>4,75</td></tr>
<tr><td><strong>AM of normalized times</strong></td><td><strong>1,00</strong></td><td><strong>1,58</strong></td><td><strong>2,85</strong></td></tr>
<tr><td><strong>GM of normalized times</strong></td><td><strong>1,00</strong></td><td><strong>1,15</strong></td><td><strong>1,41</strong></td></tr>
</table>
<table>
<tr><th>(b) Normalized to Computer B</th><th>A</th><th>B</th><th>C</th></tr>
<tr><td>Program 1</td><td>2,0 (2,0)</td><td>1,0 (1,0)</td><td>0,75 (0,75)</td></tr>
<tr><td>Program 2</td><td>0,75 (0,38)</td><td>2,0 (1,0)</td><td>4,0 (2,0)</td></tr>
<tr><td>Total execution time</td><td>2,75</td><td>3,0</td><td>4,75</td></tr>
<tr><td><strong>AM of normalized times</strong></td><td><strong>1,19</strong></td><td><strong>1,00</strong></td><td><strong>1,38</strong></td></tr>
<tr><td><strong>GM of normalized times</strong></td><td><strong>0,87</strong></td><td><strong>1,00</strong></td><td><strong>1,22</strong></td></tr>
</table>
<ul>
<li><strong>Every value recomputed and confirmed.</strong> Normalizing to A: B's Program 2 = 2,0/0,75 = 2,6667 → 2,67; C's = 4,0/0,75 = 5,3333 → 5,33. AM for C = (0,375 + 5,3333)/2 = 2,854 → <strong>2,85</strong>. GM for C = √(0,375 × 5,3333) = √2,0 = 1,4142 → <strong>1,41</strong>. Normalizing to B: A's Program 2 = 0,75/2,0 = 0,375 → 0,38; AM for A = (2,0 + 0,375)/2 = 1,1875 → <strong>1,19</strong>; GM for A = √(2,0 × 0,375) = √0,75 = 0,8660 → <strong>0,87</strong>.</li>
<li><strong>Here is the scandal.</strong> In table (a), AM says A is the best (1,00) and B is 1,58× worse. In table (b), AM says A is 1,19 and B is 1,00 — <strong>A is now worse than B</strong>. Nothing about the machines changed; only the arbitrary choice of reference machine changed. <strong>An AM of normalized times depends on which machine you happened to pick as the baseline, so it cannot be a property of the machines.</strong></li>
<li><strong>Now check the GM.</strong> Table (a): A 1,00, B 1,15, C 1,41 — order A, B, C. Table (b): A 0,87, B 1,00, C 1,22 — order A, B, C. Identical ranking, and more than that: the <em>ratios</em> survive too. 1,15/1,00 = 1,15 and 1,00/0,87 = 1,15. The geometric mean is <strong>consistent under change of reference</strong>, which is a mathematical property of products, not a coincidence of these numbers.</li>
<li><strong>Why GM has that property, in one line.</strong> GM(x<sub>i</sub>/r<sub>i</sub>) = GM(x<sub>i</sub>) / GM(r<sub>i</sub>). Changing the reference machine divides every machine's GM by the same constant, so all ratios between machines are untouched. No such identity exists for the arithmetic mean of quotients — which is exactly why it wobbles.</li>
</ul>
<p class="dap-an">✅ The exam answer: <strong>use the geometric mean for normalized performance ratios.</strong> The arithmetic mean of normalized values gives a result that depends on the machine chosen as reference, so two honest people using the same data and different baselines can reach opposite conclusions. Table 2.3 is the demonstration, table 2.4 makes it worse.</p>
<p class="pitfall">⚠️ <strong>Labelling error on the slide:</strong> both sub-tables are captioned <strong>"(a)"</strong> — "(a) Results normalized to Computer A" and then "(a) Results normalized to Computer B". The second is <strong>(b)</strong>. Also note the printed normalized values are rounded to 2 decimals (0,38 for 0,375; 2,67 for 2,6667), so recomputing gives tiny differences in the third digit; that is rounding, not error.</p>`,
        `<p class="y-chinh">🎯 Cái bẫy kinh điển của cả chương. <em>Vẫn ba máy đó</em>, <em>vẫn những thời gian đó</em>, chuẩn hoá hai lần — một lần theo A, một lần theo B — và <strong>trung bình SỐ HỌC đổi ý về việc máy nào tốt nhất</strong>, còn trung bình hình học thì không.</p>
<table>
<tr><th>(a) Chuẩn hoá theo máy A</th><th>A</th><th>B</th><th>C</th></tr>
<tr><td>Chương trình 1</td><td>2,0 (1,0)</td><td>1,0 (0,5)</td><td>0,75 (0,38)</td></tr>
<tr><td>Chương trình 2</td><td>0,75 (1,0)</td><td>2,0 (2,67)</td><td>4,0 (5,33)</td></tr>
<tr><td>Tổng thời gian thi hành</td><td>2,75</td><td>3,0</td><td>4,75</td></tr>
<tr><td><strong>AM của thời gian chuẩn hoá</strong></td><td><strong>1,00</strong></td><td><strong>1,58</strong></td><td><strong>2,85</strong></td></tr>
<tr><td><strong>GM của thời gian chuẩn hoá</strong></td><td><strong>1,00</strong></td><td><strong>1,15</strong></td><td><strong>1,41</strong></td></tr>
</table>
<table>
<tr><th>(b) Chuẩn hoá theo máy B</th><th>A</th><th>B</th><th>C</th></tr>
<tr><td>Chương trình 1</td><td>2,0 (2,0)</td><td>1,0 (1,0)</td><td>0,75 (0,75)</td></tr>
<tr><td>Chương trình 2</td><td>0,75 (0,38)</td><td>2,0 (1,0)</td><td>4,0 (2,0)</td></tr>
<tr><td>Tổng thời gian thi hành</td><td>2,75</td><td>3,0</td><td>4,75</td></tr>
<tr><td><strong>AM của thời gian chuẩn hoá</strong></td><td><strong>1,19</strong></td><td><strong>1,00</strong></td><td><strong>1,38</strong></td></tr>
<tr><td><strong>GM của thời gian chuẩn hoá</strong></td><td><strong>0,87</strong></td><td><strong>1,00</strong></td><td><strong>1,22</strong></td></tr>
</table>
<ul>
<li><strong>Mọi giá trị đã tính lại và xác nhận.</strong> Chuẩn hoá theo A: Chương trình 2 của B = 2,0/0,75 = 2,6667 → 2,67; của C = 4,0/0,75 = 5,3333 → 5,33. AM của C = (0,375 + 5,3333)/2 = 2,854 → <strong>2,85</strong>. GM của C = √(0,375 × 5,3333) = √2,0 = 1,4142 → <strong>1,41</strong>. Chuẩn hoá theo B: Chương trình 2 của A = 0,75/2,0 = 0,375 → 0,38; AM của A = (2,0 + 0,375)/2 = 1,1875 → <strong>1,19</strong>; GM của A = √(2,0 × 0,375) = √0,75 = 0,8660 → <strong>0,87</strong>.</li>
<li><strong>Đây mới là chỗ giật mình.</strong> Ở bảng (a), AM nói A tốt nhất (1,00) còn B tệ hơn 1,58 lần. Ở bảng (b), AM nói A là 1,19 còn B là 1,00 — <strong>giờ A lại TỆ HƠN B</strong>. Không có gì ở các máy thay đổi cả; chỉ có lựa chọn TUỲ TIỆN về máy làm mốc là thay đổi. <strong>AM của thời gian chuẩn hoá phụ thuộc vào việc bạn tình cờ chọn máy nào làm mốc, nên nó KHÔNG THỂ là một tính chất của các máy.</strong></li>
<li><strong>Giờ kiểm GM.</strong> Bảng (a): A 1,00, B 1,15, C 1,41 — thứ tự A, B, C. Bảng (b): A 0,87, B 1,00, C 1,22 — thứ tự A, B, C. Thứ hạng y hệt, và hơn thế: các <em>TỈ SỐ</em> cũng sống sót. 1,15/1,00 = 1,15 và 1,00/0,87 = 1,15. Trung bình hình học <strong>BẤT BIẾN khi đổi mốc</strong>, đó là tính chất toán học của phép nhân, không phải trùng hợp của mấy con số này.</li>
<li><strong>Vì sao GM có tính chất đó, một dòng.</strong> GM(x<sub>i</sub>/r<sub>i</sub>) = GM(x<sub>i</sub>) / GM(r<sub>i</sub>). Đổi máy mốc chỉ là chia GM của MỌI máy cho cùng một hằng số, nên mọi tỉ số giữa các máy không hề suy suyển. Không có đẳng thức tương tự cho trung bình SỐ HỌC của thương — và đó đúng là lý do nó chao đảo.</li>
</ul>
<p class="dap-an">✅ Câu trả lời để đi thi: <strong>dùng trung bình HÌNH HỌC cho các tỉ số hiệu năng chuẩn hoá.</strong> Trung bình số học của giá trị chuẩn hoá cho ra kết quả PHỤ THUỘC vào máy được chọn làm mốc, nên hai người trung thực dùng cùng dữ liệu mà chọn mốc khác nhau sẽ ra hai kết luận trái ngược. Table 2.3 là màn chứng minh, và Table 2.4 còn làm nó tệ hơn.</p>
<p class="pitfall">⚠️ <strong>SLIDE GHI SAI NHÃN:</strong> cả hai bảng con đều đánh <strong>"(a)"</strong> — "(a) Results normalized to Computer A" rồi lại "(a) Results normalized to Computer B". Cái sau phải là <strong>(b)</strong>. Cũng lưu ý các giá trị chuẩn hoá in trên slide đã làm tròn 2 chữ số (0,38 thay cho 0,375; 2,67 thay cho 2,6667), nên tính lại sẽ lệch chút ở chữ số thứ ba; đó là làm tròn, không phải sai.</p>`],

      [22, 'Table 2.4 — Another Comparison of Arithmetic and Geometric Means for Normalized Results',
        `<p class="y-chinh">🎯 The same experiment with one number changed (C's Program 1 is now 0,20 s), and this time the result is worse than "AM is inconsistent": <strong>the geometric mean declares a tie between a machine that takes 2,4 s and one that takes 4,2 s.</strong> Both means fail here, and you must be able to say why.</p>
<table>
<tr><th>(a) Normalized to Computer A</th><th>A</th><th>B</th><th>C</th></tr>
<tr><td>Program 1</td><td>2,0 (1,0)</td><td>1,0 (0,5)</td><td>0,20 (0,1)</td></tr>
<tr><td>Program 2</td><td>0,4 (1,0)</td><td>2,0 (5,0)</td><td>4,0 (10,0)</td></tr>
<tr><td><strong>Total execution time</strong></td><td><strong>2,4</strong></td><td><strong>3,00</strong></td><td><strong>4,2</strong></td></tr>
<tr><td>AM of normalized times</td><td>1,00</td><td>2,75</td><td>5,05</td></tr>
<tr><td><strong>GM of normalized times</strong></td><td><strong>1,00</strong></td><td>1,58</td><td><strong>1,00</strong></td></tr>
</table>
<table>
<tr><th>(b) Normalized to Computer B</th><th>A</th><th>B</th><th>C</th></tr>
<tr><td>Program 1</td><td>2,0 (2,0)</td><td>1,0 (1,0)</td><td>0,20 (0,2)</td></tr>
<tr><td>Program 2</td><td>0,4 (0,2)</td><td>2,0 (1,0)</td><td>4,0 (2,0)</td></tr>
<tr><td><strong>Total execution time</strong></td><td><strong>2,4</strong></td><td><strong>3,0</strong></td><td><strong>4,2</strong></td></tr>
<tr><td>AM of normalized times</td><td>1,10</td><td>1,00</td><td>1,10</td></tr>
<tr><td><strong>GM of normalized times</strong></td><td><strong>0,63</strong></td><td>1,00</td><td><strong>0,63</strong></td></tr>
</table>
<ul>
<li><strong>Verify the two headline cells.</strong> In (a), GM for C = √(0,1 × 10,0) = √1,0 = <strong>1,00</strong>, identical to A's 1,00. In (b), GM for A = √(2,0 × 0,2) = √0,4 = 0,6325 → <strong>0,63</strong> and GM for C = √(0,2 × 2,0) = √0,4 = <strong>0,63</strong> — identical again. The GM calls A and C equal in both tables.</li>
<li><strong>But they are not equal.</strong> A finishes both programs in <strong>2,4 s</strong>; C needs <strong>4,2 s</strong> — 75% longer. If you have to run both programs, A is decisively the better machine and the geometric mean has said nothing of the kind.</li>
<li><strong>The AM's new failure is different and still fatal.</strong> In (a) it ranks A (1,00) &lt; B (2,75) &lt; C (5,05); in (b) it ranks B (1,00) &lt; A (1,10) = C (1,10). So in (b) the AM declares <strong>A and C equal</strong> and puts B ahead of both, while total time says A (2,4) &lt; B (3,0) &lt; C (4,2). Wrong in a third distinct way.</li>
<li><strong>The honest summary of slides 20–22.</strong> Three claims, all defensible: (1) AM of <em>times</em> is always safe, because it is proportional to total time. (2) AM of <em>normalized values</em> is unusable, because the answer depends on the reference machine. (3) GM of normalized values is <em>consistent</em> — it gives the same ranking whatever the reference — but consistency is not correctness: it can rank two machines equal when their total times differ by 75%.</li>
<li><strong>Why GM is still what SPEC uses.</strong> Because for a benchmark suite there is no "total time" that means anything: the suite is a sample of workloads, not a job you run. What you want is a summary that does not change when the committee changes reference machines, and among the three means only GM has that property. Slide 31's flowchart ends in "compute geometric mean of all ratios" for exactly this reason.</li>
</ul>
<p class="dap-an">✅ Model exam answer: <strong>the geometric mean is the correct mean for normalized performance ratios because it is independent of the reference machine, and the arithmetic mean is not — Table 2.3 shows the arithmetic mean reversing the ranking of A and B when the baseline changes from A to B. However, Table 2.4 shows that the geometric mean's consistency does not imply it tracks execution time: it scores A and C as equal (1,00 and 1,00) although A finishes in 2,4 s and C in 4,2 s. If total execution time on a known workload is what matters, compare total times directly.</strong></p>
<p class="pitfall">⚠️ Same labelling error as slide 21 — both sub-tables are captioned "(a)". And do not memorise "GM is always correct": the whole point of Table 2.4 is that the book itself provides the counter-example, on the very next slide after the one that praises GM.</p>`,
        `<p class="y-chinh">🎯 Vẫn thí nghiệm ấy nhưng đổi một con số (Chương trình 1 của máy C nay còn 0,20 s), và lần này kết quả còn tệ hơn chuyện "AM không nhất quán": <strong>trung bình HÌNH HỌC tuyên bố HOÀ giữa một máy tốn 2,4 s và một máy tốn 4,2 s.</strong> Ở đây CẢ HAI phép trung bình đều hỏng, và bạn phải nói được vì sao.</p>
<table>
<tr><th>(a) Chuẩn hoá theo máy A</th><th>A</th><th>B</th><th>C</th></tr>
<tr><td>Chương trình 1</td><td>2,0 (1,0)</td><td>1,0 (0,5)</td><td>0,20 (0,1)</td></tr>
<tr><td>Chương trình 2</td><td>0,4 (1,0)</td><td>2,0 (5,0)</td><td>4,0 (10,0)</td></tr>
<tr><td><strong>Tổng thời gian thi hành</strong></td><td><strong>2,4</strong></td><td><strong>3,00</strong></td><td><strong>4,2</strong></td></tr>
<tr><td>AM của thời gian chuẩn hoá</td><td>1,00</td><td>2,75</td><td>5,05</td></tr>
<tr><td><strong>GM của thời gian chuẩn hoá</strong></td><td><strong>1,00</strong></td><td>1,58</td><td><strong>1,00</strong></td></tr>
</table>
<table>
<tr><th>(b) Chuẩn hoá theo máy B</th><th>A</th><th>B</th><th>C</th></tr>
<tr><td>Chương trình 1</td><td>2,0 (2,0)</td><td>1,0 (1,0)</td><td>0,20 (0,2)</td></tr>
<tr><td>Chương trình 2</td><td>0,4 (0,2)</td><td>2,0 (1,0)</td><td>4,0 (2,0)</td></tr>
<tr><td><strong>Tổng thời gian thi hành</strong></td><td><strong>2,4</strong></td><td><strong>3,0</strong></td><td><strong>4,2</strong></td></tr>
<tr><td>AM của thời gian chuẩn hoá</td><td>1,10</td><td>1,00</td><td>1,10</td></tr>
<tr><td><strong>GM của thời gian chuẩn hoá</strong></td><td><strong>0,63</strong></td><td>1,00</td><td><strong>0,63</strong></td></tr>
</table>
<ul>
<li><strong>Kiểm hai ô gây sốc.</strong> Ở (a), GM của C = √(0,1 × 10,0) = √1,0 = <strong>1,00</strong>, y hệt 1,00 của A. Ở (b), GM của A = √(2,0 × 0,2) = √0,4 = 0,6325 → <strong>0,63</strong> và GM của C = √(0,2 × 2,0) = √0,4 = <strong>0,63</strong> — lại y hệt. GM gọi A và C BẰNG NHAU ở cả hai bảng.</li>
<li><strong>Nhưng chúng KHÔNG bằng nhau.</strong> A chạy xong cả hai chương trình trong <strong>2,4 s</strong>; C cần <strong>4,2 s</strong> — lâu hơn 75%. Nếu bạn buộc phải chạy cả hai chương trình thì A rõ ràng là máy tốt hơn, còn trung bình hình học chẳng nói gì kiểu đó.</li>
<li><strong>Kiểu hỏng mới của AM thì khác, và vẫn chí mạng.</strong> Ở (a) nó xếp A (1,00) &lt; B (2,75) &lt; C (5,05); ở (b) nó xếp B (1,00) &lt; A (1,10) = C (1,10). Vậy ở (b), AM tuyên bố <strong>A và C bằng nhau</strong> và đặt B trên cả hai, trong khi tổng thời gian nói A (2,4) &lt; B (3,0) &lt; C (4,2). Sai theo một kiểu thứ ba.</li>
<li><strong>Bản tổng kết trung thực của slide 20–22.</strong> Ba khẳng định, đều bảo vệ được: (1) AM của <em>THỜI GIAN</em> luôn an toàn, vì nó tỉ lệ thuận với tổng thời gian. (2) AM của <em>GIÁ TRỊ CHUẨN HOÁ</em> là không dùng được, vì đáp số phụ thuộc máy mốc. (3) GM của giá trị chuẩn hoá thì <em>NHẤT QUÁN</em> — cho cùng thứ hạng bất kể mốc nào — nhưng nhất quán KHÔNG phải là đúng: nó có thể xếp hai máy bằng nhau trong khi tổng thời gian của chúng chênh nhau 75%.</li>
<li><strong>Vậy vì sao SPEC vẫn dùng GM.</strong> Vì với một BỘ benchmark thì không có "tổng thời gian" nào có nghĩa cả: bộ đó là một MẪU các tải công việc, không phải một công việc bạn thật sự chạy. Thứ bạn cần là một con số tóm tắt KHÔNG đổi khi hội đồng đổi máy tham chiếu, và trong ba phép trung bình chỉ GM có tính chất đó. Lưu đồ ở slide 31 kết thúc bằng "tính trung bình hình học của mọi tỉ số" chính vì lý do này.</li>
</ul>
<p class="dap-an">✅ Bài mẫu cho phòng thi: <strong>trung bình hình học là phép trung bình đúng cho tỉ số hiệu năng chuẩn hoá, vì nó độc lập với máy tham chiếu, còn trung bình số học thì không — Table 2.3 cho thấy trung bình số học ĐẢO thứ hạng của A và B khi đổi mốc từ A sang B. Tuy nhiên Table 2.4 cho thấy tính nhất quán của trung bình hình học KHÔNG kéo theo việc nó bám sát thời gian thi hành: nó chấm A và C bằng nhau (1,00 và 1,00) trong khi A xong trong 2,4 s còn C mất 4,2 s. Nếu điều bạn quan tâm là tổng thời gian trên một tải công việc đã biết, hãy so thẳng tổng thời gian.</strong></p>
<p class="pitfall">⚠️ Cùng lỗi nhãn như slide 21 — cả hai bảng con đều đề "(a)". Và đừng học thuộc câu "GM luôn đúng": toàn bộ ý nghĩa của Table 2.4 là chính cuốn sách đưa ra phản ví dụ, ngay slide kế sau slide vừa ca ngợi GM.</p>`],

      [23, 'Benchmark Principles',
        `<p class="y-chinh">🎯 If MIPS lies (slide 16) and a single program proves nothing, what is left? <strong>Run a set of real programs and report the times.</strong> This slide lists the four properties a program must have to earn a place in such a set.</p>
<table>
<tr><th>Desirable characteristic</th><th>Why it is required</th></tr>
<tr><td>It is written in a <strong>high-level language</strong>, making it <strong>portable</strong> across different machines</td><td>Without portability you cannot compare two architectures at all — the benchmark must compile and run on both</td></tr>
<tr><td>It is <strong>representative</strong> of a particular kind of programming domain or paradigm — systems programming, numerical programming, commercial programming</td><td>A benchmark measures <em>a</em> workload, never "performance" in the abstract; it must resemble the work you actually do</td></tr>
<tr><td>It can be <strong>measured easily</strong></td><td>If the measurement is fiddly, results are not reproducible and cannot be compared across labs</td></tr>
<tr><td>It has <strong>wide distribution</strong></td><td>Numbers are only comparable if everyone runs the same thing; a benchmark nobody else runs produces numbers nobody can check</td></tr>
</table>
<ul>
<li><strong>Read "high-level language" as a defence against cheating, not just convenience.</strong> A hand-written assembly kernel measures the programmer, not the machine. Requiring a portable high-level source means the same source is compiled by each vendor's compiler — which is honest, and also why the compiler is part of what gets measured (slide 30's base/peak metrics).</li>
<li><strong>"Representative" is the criterion that kills synthetic benchmarks.</strong> Historic synthetic programs such as Whetstone and Dhrystone were short artificial loops; compiler writers optimised specifically for them until the scores became meaningless. Real applications are much harder to special-case, which is why SPEC CPU2017 is built from real programs — a Perl interpreter, GCC, a chess engine, a weather model (slides 26–27).</li>
<li><strong>"Wide distribution" is why an industry consortium exists.</strong> It is not enough for a benchmark to be good; everyone must agree to use it and to publish results under the same rules. That is exactly what SPEC is, and slide 24 defines it.</li>
<li><strong>The property the list does not demand — and should.</strong> Nothing here says a benchmark must be <em>hard to game</em>. Vendors have repeatedly tuned compilers to recognise specific benchmarks. SPEC's response is procedural: strict rules for the <em>base</em> metric and full disclosure of the flags used for <em>peak</em> (slide 30).</li>
<li><strong>The bridge to the next slides.</strong> One benchmark is not enough either, because it can favour one machine by accident. So you use a <em>suite</em> — several programs — and then you are immediately back at the question of slides 17–22: how do you summarise several numbers into one?</li>
</ul>
<p class="meo">💡 Four words for the four properties: <strong>PORTABLE · REPRESENTATIVE · MEASURABLE · WIDESPREAD</strong>. If a question asks "list the desirable characteristics of a benchmark program", those four with one sentence each is a full answer.</p>`,
        `<p class="y-chinh">🎯 Nếu MIPS nói dối (slide 16) mà một chương trình đơn lẻ thì chẳng chứng minh được gì, còn lại cách nào? <strong>Chạy một BỘ chương trình THẬT và công bố thời gian.</strong> Slide này liệt kê bốn tính chất mà một chương trình phải có để được vào bộ đó.</p>
<table>
<tr><th>Tính chất mong muốn</th><th>Vì sao bắt buộc</th></tr>
<tr><td>Được viết bằng <strong>ngôn ngữ bậc cao</strong>, nhờ đó <strong>khả chuyển</strong> giữa các máy khác nhau</td><td>Không khả chuyển thì không so được hai kiến trúc — benchmark phải biên dịch và chạy được trên cả hai</td></tr>
<tr><td><strong>Đại diện</strong> cho một loại lĩnh vực hay hệ hình lập trình cụ thể — lập trình hệ thống, lập trình số, lập trình thương mại</td><td>Benchmark đo <em>MỘT</em> tải công việc, không bao giờ đo "hiệu năng" chung chung; nó phải giống công việc bạn thật sự làm</td></tr>
<tr><td><strong>Đo được dễ dàng</strong></td><td>Phép đo rườm rà thì kết quả không lặp lại được và không so được giữa các phòng thí nghiệm</td></tr>
<tr><td><strong>Phân phối rộng rãi</strong></td><td>Các con số chỉ so được khi mọi người chạy cùng một thứ; một benchmark không ai khác chạy sẽ sinh ra số không ai kiểm được</td></tr>
</table>
<ul>
<li><strong>Đọc "ngôn ngữ bậc cao" như một hàng rào CHỐNG GIAN LẬN, không chỉ là tiện lợi.</strong> Một đoạn hợp ngữ viết tay đo trình độ người lập trình chứ không đo cỗ máy. Đòi mã nguồn bậc cao khả chuyển nghĩa là cùng một mã nguồn được biên dịch bằng trình biên dịch của từng hãng — vừa trung thực, vừa là lý do trình biên dịch cũng nằm trong thứ được đo (chỉ số base/peak ở slide 30).</li>
<li><strong>"Đại diện" là tiêu chí giết chết benchmark tổng hợp.</strong> Những chương trình tổng hợp lịch sử như Whetstone và Dhrystone chỉ là vài vòng lặp nhân tạo ngắn; người viết trình biên dịch tối ưu riêng cho chúng tới mức điểm số mất hết ý nghĩa. Ứng dụng thật khó "đánh riêng" hơn nhiều, nên SPEC CPU2017 được dựng từ chương trình thật — một trình thông dịch Perl, GCC, một máy chơi cờ, một mô hình thời tiết (slide 26–27).</li>
<li><strong>"Phân phối rộng rãi" là lý do phải có một hiệp hội công nghiệp.</strong> Benchmark tốt thôi chưa đủ; mọi người phải đồng ý dùng nó và công bố kết quả theo cùng một bộ luật. SPEC chính là thứ đó, và slide 24 định nghĩa nó.</li>
<li><strong>Tính chất mà danh sách này KHÔNG đòi — mà lẽ ra nên đòi.</strong> Không chỗ nào nói benchmark phải <em>khó gian lận</em>. Các hãng đã nhiều lần chỉnh trình biên dịch để nhận diện đúng benchmark. Câu trả lời của SPEC nằm ở thủ tục: luật nghiêm ngặt cho chỉ số <em>base</em> và công khai đầy đủ mọi cờ biên dịch dùng cho <em>peak</em> (slide 30).</li>
<li><strong>Cầu nối sang các slide sau.</strong> Một benchmark cũng chưa đủ, vì nó có thể tình cờ thiên vị một máy. Thế nên phải dùng một <em>BỘ</em> — nhiều chương trình — và lập tức bạn quay lại câu hỏi của slide 17–22: tóm mấy con số ấy thành MỘT bằng cách nào?</li>
</ul>
<p class="meo">💡 Bốn chữ cho bốn tính chất: <strong>KHẢ CHUYỂN · ĐẠI DIỆN · ĐO ĐƯỢC · PHỔ BIẾN</strong>. Đề hỏi "kể các tính chất mong muốn của một chương trình benchmark" thì bốn chữ đó kèm mỗi chữ một câu là bài trọn điểm.</p>`],

      [24, 'System Performance Evaluation Corporation (SPEC)',
        `<p class="y-chinh">🎯 Two definitions on one slide: what a <strong>benchmark suite</strong> is, and what <strong>SPEC</strong> is. The first is a technical object; the second is the institution that makes benchmark numbers trustworthy.</p>
<table>
<tr><th></th><th>The slide's own words</th></tr>
<tr><td><strong>Benchmark suite</strong></td><td>A <strong>collection of programs</strong>, defined in a high-level language, that <strong>together</strong> attempt to provide a representative test of a computer in a particular application or system programming area</td></tr>
<tr><td><strong>SPEC</strong></td><td>An <strong>industry consortium</strong>. It defines and maintains the best known collection of benchmark suites aimed at evaluating computer systems. Its performance measurements are widely used for comparison and research purposes</td></tr>
</table>
<ul>
<li><strong>The load-bearing word in the first definition is "together".</strong> No single program in a suite is meant to be representative; the <em>set</em> is. That is why a SPEC result is always a summary over many programs (slide 31), and why the choice of summary — geometric mean — matters as much as the programs themselves.</li>
<li><strong>"Industry consortium" means competitors agreeing on the rules.</strong> Intel, AMD, IBM, HPE, Oracle and others jointly define what counts as a valid run. A vendor cannot invent its own measurement and call it SPEC. This is the institutional answer to "wide distribution" from slide 23.</li>
<li><strong>Why an agreed benchmark is worth more than a better benchmark.</strong> A metric everyone publishes lets you compare a 2017 machine with a 2024 machine, or an ARM server with an x86 server, using numbers produced under identical rules and openly disclosed. A technically superior metric that only one lab uses gives you nothing to compare against.</li>
<li><strong>SPEC is more than CPU.</strong> The slide says "collection of benchmark suites" — plural. SPEC publishes suites for CPU, for power and energy (slide 32 uses one), for Java, for file servers, for virtualisation and more. Chapter 2 only opens the CPU one, which is the flagship.</li>
<li><strong>What SPEC does not solve.</strong> It measures the machine <em>plus its compiler</em>, on <em>these particular programs</em>. If your workload is unlike the suite, a high SPEC score is weak evidence. Benchmarks answer "how does this machine do on this suite", never "how will my program run".</li>
</ul>
<p class="pitfall">⚠️ Common confusion: SPEC is not a program and not a number — it is the <strong>organisation</strong> that defines suites and the rules for reporting them. "The SPEC benchmark" is sloppy; say "the SPEC CPU2017 suite" or "the SPECspeed 2017_int_base result".</p>`,
        `<p class="y-chinh">🎯 Hai định nghĩa trên một slide: <strong>bộ benchmark</strong> là gì, và <strong>SPEC</strong> là gì. Cái đầu là một đối tượng kỹ thuật; cái sau là định chế làm cho các con số benchmark đáng tin.</p>
<table>
<tr><th></th><th>Nguyên văn của slide</th></tr>
<tr><td><strong>Bộ benchmark</strong></td><td>Một <strong>tập chương trình</strong>, viết bằng ngôn ngữ bậc cao, mà <strong>CÙNG NHAU</strong> cố gắng tạo ra một phép thử đại diện cho một máy tính trong một lĩnh vực ứng dụng hay lập trình hệ thống cụ thể</td></tr>
<tr><td><strong>SPEC</strong></td><td>Một <strong>hiệp hội công nghiệp</strong>. Nó định nghĩa và duy trì tập bộ benchmark nổi tiếng nhất dùng để đánh giá hệ máy tính. Các phép đo hiệu năng của nó được dùng rộng rãi để so sánh và nghiên cứu</td></tr>
</table>
<ul>
<li><strong>Chữ gánh ý trong định nghĩa đầu là "CÙNG NHAU".</strong> Không chương trình đơn lẻ nào trong bộ được coi là đại diện; cả <em>TẬP</em> mới đại diện. Vì thế một kết quả SPEC luôn là một con số tóm tắt trên nhiều chương trình (slide 31), và vì thế lựa chọn cách tóm tắt — trung bình hình học — quan trọng ngang chính các chương trình.</li>
<li><strong>"Hiệp hội công nghiệp" nghĩa là các đối thủ ngồi lại thống nhất luật chơi.</strong> Intel, AMD, IBM, HPE, Oracle và những hãng khác cùng định nghĩa thế nào là một lần chạy hợp lệ. Một hãng không thể tự bịa ra phép đo của mình rồi gọi đó là SPEC. Đây là câu trả lời mang tính định chế cho tiêu chí "phân phối rộng rãi" ở slide 23.</li>
<li><strong>Vì sao một benchmark ĐƯỢC ĐỒNG THUẬN đáng giá hơn một benchmark TỐT HƠN.</strong> Một thước đo mà ai cũng công bố cho phép bạn so máy năm 2017 với máy năm 2024, hay so máy chủ ARM với máy chủ x86, bằng những con số sinh ra dưới cùng bộ luật và công khai đầy đủ. Một thước đo tốt hơn về kỹ thuật nhưng chỉ một phòng thí nghiệm dùng thì chẳng có gì để so.</li>
<li><strong>SPEC không chỉ có CPU.</strong> Slide viết "tập các BỘ benchmark" — số nhiều. SPEC công bố bộ cho CPU, cho điện năng và năng lượng (slide 32 dùng một bộ như vậy), cho Java, cho máy chủ file, cho ảo hoá và nhiều nữa. Chương 2 chỉ mở bộ CPU, bộ chủ lực.</li>
<li><strong>Thứ SPEC KHÔNG giải quyết được.</strong> Nó đo cỗ máy <em>CỘNG trình biên dịch của nó</em>, trên <em>đúng những chương trình này</em>. Nếu tải công việc của bạn khác bộ benchmark thì điểm SPEC cao là bằng chứng yếu. Benchmark trả lời "máy này làm bộ này ra sao", chứ không bao giờ trả lời "chương trình CỦA TÔI sẽ chạy thế nào".</li>
</ul>
<p class="pitfall">⚠️ Chỗ hay nhầm: SPEC không phải một chương trình, cũng không phải một con số — nó là <strong>TỔ CHỨC</strong> định nghĩa các bộ benchmark và luật công bố chúng. Nói "benchmark SPEC" là cẩu thả; hãy nói "bộ SPEC CPU2017" hoặc "kết quả SPECspeed 2017_int_base".</p>`],

      [25, 'SPEC CPU2017',
        `<p class="y-chinh">🎯 The flagship suite, described by numbers: <strong>20 integer + 23 floating-point benchmarks · C, C++ and Fortran · over 11 million lines of code · both rate and speed variants</strong> for almost every program.</p>
<table>
<tr><th>Fact on the slide</th><th>What it implies</th></tr>
<tr><td>Best known SPEC benchmark suite; industry standard suite for <strong>processor-intensive applications</strong></td><td>It is the default reference when people say "how fast is this CPU"</td></tr>
<tr><td>Appropriate for applications that spend most of their time <strong>doing computation rather than I/O</strong></td><td>It deliberately does NOT measure disk or network; a database server's real bottleneck is invisible to it</td></tr>
<tr><td><strong>20 integer</strong> and <strong>23 floating-point</strong> benchmarks in <strong>C, C++ and Fortran</strong></td><td>Two separate scores, because integer and FP workloads stress different hardware (branch prediction and cache versus FP units and memory bandwidth)</td></tr>
<tr><td>For all integer benchmarks and most FP ones there are both <strong>rate</strong> and <strong>speed</strong> programs</td><td>Two questions, two metrics — throughput versus latency (defined on slide 30)</td></tr>
<tr><td>Over <strong>11 million lines of code</strong></td><td>Too big to special-case; this is the size that makes gaming the benchmark hard</td></tr>
</table>
<ul>
<li><strong>Why Fortran is still there in 2017.</strong> Not nostalgia: the numerical codes that dominate scientific computing (weather, fluid dynamics, electromagnetics — see slide 27) are written in Fortran and have been maintained for decades. A benchmark suite must reflect the code that actually runs, not the code people wish ran.</li>
<li><strong>The integer/FP split is a hardware statement.</strong> Integer benchmarks hammer branch prediction, the instruction cache and pointer chasing; floating-point benchmarks hammer the FP pipelines and memory bandwidth. A chip can be excellent at one and mediocre at the other, so one combined number would hide exactly what a buyer needs to know.</li>
<li><strong>"Rate" and "speed" are not two units for one thing.</strong> Speed = how fast can the machine run <em>one</em> copy (latency, single-task). Rate = how many copies can it run <em>at once</em> (throughput, uses all cores). Slide 28 shows a rate result with 768 copies and slide 29 a speed result with 384 threads, on the same machine — and the two answers look nothing alike.</li>
<li><strong>The naming convention pays off later.</strong> Rate programs are numbered 5xx and end in <code>_r</code>; speed programs are 6xx and end in <code>_s</code>, with the same name in between. So 502.gcc_r and 602.gcc_s are the same GCC workload measured two ways. Once you see that, slides 26 to 29 read themselves.</li>
<li><strong>The honest limitation, restated.</strong> "Compute rather than I/O" means a high SPEC CPU score tells you nothing about a web server, a file server or a database — which is why SPEC publishes other suites entirely for those.</li>
</ul>
<p class="meo">💡 Numbers to remember for a short-answer question: <strong>SPEC CPU2017 = 20 int + 23 FP, in C/C++/Fortran, over 11 million lines, with rate (_r, 5xx) and speed (_s, 6xx) variants.</strong></p>`,
        `<p class="y-chinh">🎯 Bộ chủ lực, được mô tả bằng con số: <strong>20 benchmark số nguyên + 23 benchmark dấu phẩy động · viết bằng C, C++ và Fortran · hơn 11 triệu dòng mã · có cả biến thể rate lẫn speed</strong> cho gần như mọi chương trình.</p>
<table>
<tr><th>Dữ kiện trên slide</th><th>Nó hàm ý gì</th></tr>
<tr><td>Bộ SPEC nổi tiếng nhất; bộ chuẩn công nghiệp cho <strong>ứng dụng nặng về bộ xử lý</strong></td><td>Nó là mốc mặc định khi người ta hỏi "con CPU này nhanh cỡ nào"</td></tr>
<tr><td>Thích hợp cho ứng dụng dành phần lớn thời gian <strong>TÍNH TOÁN chứ không phải VÀO/RA</strong></td><td>Nó CỐ Ý không đo đĩa hay mạng; chỗ nghẽn thật của một máy chủ cơ sở dữ liệu là vô hình với nó</td></tr>
<tr><td><strong>20 số nguyên</strong> và <strong>23 dấu phẩy động</strong>, viết bằng <strong>C, C++ và Fortran</strong></td><td>Hai điểm số riêng, vì tải số nguyên và tải dấu phẩy động ép những phần cứng khác nhau (dự đoán rẽ nhánh và cache so với khối FP và băng thông bộ nhớ)</td></tr>
<tr><td>Mọi benchmark số nguyên và phần lớn benchmark FP đều có cả chương trình <strong>rate</strong> lẫn <strong>speed</strong></td><td>Hai câu hỏi, hai thước đo — thông lượng so với độ trễ (định nghĩa ở slide 30)</td></tr>
<tr><td>Hơn <strong>11 triệu dòng mã</strong></td><td>Quá lớn để đánh riêng từng ca; chính kích thước này làm việc gian lận benchmark trở nên khó</td></tr>
</table>
<ul>
<li><strong>Vì sao năm 2017 vẫn còn Fortran.</strong> Không phải hoài cổ: những đoạn mã số học thống trị tính toán khoa học (thời tiết, động lực học chất lưu, điện từ — xem slide 27) được viết bằng Fortran và được bảo trì suốt hàng chục năm. Một bộ benchmark phải phản ánh đoạn mã THẬT SỰ đang chạy, không phải đoạn mã người ta ao ước.</li>
<li><strong>Việc tách số nguyên / dấu phẩy động là một phát biểu về PHẦN CỨNG.</strong> Benchmark số nguyên quần cho dự đoán rẽ nhánh, cache lệnh và việc đuổi theo con trỏ; benchmark dấu phẩy động quần cho ống FP và băng thông bộ nhớ. Một con chip có thể xuất sắc ở mặt này và tầm thường ở mặt kia, nên một con số gộp chung sẽ che đi đúng thứ người mua cần biết.</li>
<li><strong>"Rate" và "speed" không phải hai đơn vị cho một thứ.</strong> Speed = máy chạy xong <em>MỘT</em> bản nhanh cỡ nào (độ trễ, một việc). Rate = máy chạy được <em>ĐỒNG THỜI</em> bao nhiêu bản (thông lượng, dùng hết mọi lõi). Slide 28 cho kết quả rate với 768 bản sao và slide 29 cho kết quả speed với 384 luồng, trên cùng một cỗ máy — và hai đáp số trông chẳng giống nhau chút nào.</li>
<li><strong>Quy ước đặt tên trả công về sau.</strong> Chương trình rate đánh số 5xx và kết thúc bằng <code>_r</code>; chương trình speed đánh số 6xx và kết thúc bằng <code>_s</code>, còn tên ở giữa thì giống nhau. Nên 502.gcc_r và 602.gcc_s là cùng một tải GCC đo theo hai cách. Nhận ra điều đó rồi thì slide 26 tới 29 tự đọc lấy.</li>
<li><strong>Giới hạn phải nói thật, nhắc lại.</strong> "Tính toán chứ không phải vào/ra" nghĩa là điểm SPEC CPU cao chẳng nói gì về một máy chủ web, máy chủ file hay cơ sở dữ liệu — và đó là lý do SPEC có hẳn những bộ khác cho chúng.</li>
</ul>
<p class="meo">💡 Bộ số cần thuộc cho câu hỏi ngắn: <strong>SPEC CPU2017 = 20 số nguyên + 23 FP, viết bằng C/C++/Fortran, hơn 11 triệu dòng, có biến thể rate (_r, 5xx) và speed (_s, 6xx).</strong></p>`],

      [26, 'Table 2.5(A) — SPEC CPU2017 Benchmarks (integer)',
        `<p class="y-chinh">🎯 The ten integer benchmarks, each a <strong>real application</strong>. Read the "Application Area" column and you are reading a description of what integer code actually does in the world: interpret, compile, search, compress, plan routes.</p>
<table>
<tr><th>Rate</th><th>Speed</th><th>Language</th><th>Kloc</th><th>Application Area</th></tr>
<tr><td>500.perlbench_r</td><td>600.perlbench_s</td><td>C</td><td>363</td><td>Perl interpreter</td></tr>
<tr><td>502.gcc_r</td><td>602.gcc_s</td><td>C</td><td>1304</td><td>GNU C compiler</td></tr>
<tr><td>505.mcf_r</td><td>605.mcf_s</td><td>C</td><td>3</td><td>Route planning</td></tr>
<tr><td>520.omnetpp_r</td><td>620.omnetpp_s</td><td>C++</td><td>134</td><td>Discrete event simulation — computer network</td></tr>
<tr><td>523.xalancbmk_r</td><td>623.xalancbmk_s</td><td>C++</td><td>520</td><td>XML to HTML conversion via XSLT</td></tr>
<tr><td>525.x264_r</td><td>625.x264_s</td><td>C</td><td>96</td><td>Video compression</td></tr>
<tr><td>531.deepsjeng_r</td><td>631.deepsjeng_s</td><td>C++</td><td>10</td><td>AI: alpha-beta tree search (chess)</td></tr>
<tr><td>541.leela_r</td><td>641.leela_s</td><td>C++</td><td>21</td><td>AI: Monte Carlo tree search (Go)</td></tr>
<tr><td>548.exchange2_r</td><td>648.exchange2_s</td><td>Fortran</td><td>1</td><td>AI: recursive solution generator (Sudoku)</td></tr>
<tr><td>557.xz_r</td><td>657.xz_s</td><td>C</td><td>33</td><td>General data compression</td></tr>
</table>
<ul>
<li><strong>The footnote defines the unit:</strong> "Kloc = line count (including comments/whitespace) for source files used in a build ÷ 1000". So 1304 Kloc for GCC means about 1,3 million lines — and 1 Kloc for exchange2 means roughly a thousand.</li>
<li><strong>The size spread is the first thing to notice.</strong> From <strong>3 Kloc (mcf)</strong> to <strong>1304 Kloc (gcc)</strong> — a factor of 435. A tiny program with a huge working set (mcf does route planning over large graphs) stresses <em>memory</em>; a huge program like gcc stresses the <em>instruction</em> cache and branch prediction. Code size and memory behaviour are independent, and the suite deliberately samples both.</li>
<li><strong>Three of the ten are AI search.</strong> deepsjeng (alpha-beta, chess), leela (Monte Carlo tree search, Go), exchange2 (recursive Sudoku solving). All three are branch-heavy, pointer-heavy, deeply recursive code with almost no arithmetic regularity — precisely the workload that defeats prefetching and rewards good branch prediction (slide 3).</li>
<li><strong>Why these programs and not others.</strong> Each one satisfies slide 23's four criteria: portable high-level source, representative of a real domain, easy to time, and widely distributed (every one of these is a well-known open-source program).</li>
<li><strong>Note that exchange2 is Fortran even in the integer suite.</strong> A useful reminder that "Fortran" does not mean "floating-point"; the language is chosen by the application's history, not by its data type.</li>
</ul>
<p class="meo">💡 You will not be asked to memorise the table. What is examinable is the <em>pattern</em>: the integer suite is made of interpreters, compilers, compression, simulation and AI search — irregular, branch-heavy, pointer-chasing code. Say that and you have the point.</p>`,
        `<p class="y-chinh">🎯 Mười benchmark số nguyên, mỗi cái là một <strong>ứng dụng THẬT</strong>. Đọc cột "Lĩnh vực ứng dụng" là bạn đang đọc bản mô tả xem mã số nguyên thực sự làm gì ngoài đời: thông dịch, biên dịch, tìm kiếm, nén, vạch đường.</p>
<table>
<tr><th>Rate</th><th>Speed</th><th>Ngôn ngữ</th><th>Kloc</th><th>Lĩnh vực ứng dụng</th></tr>
<tr><td>500.perlbench_r</td><td>600.perlbench_s</td><td>C</td><td>363</td><td>Trình thông dịch Perl</td></tr>
<tr><td>502.gcc_r</td><td>602.gcc_s</td><td>C</td><td>1304</td><td>Trình biên dịch GNU C</td></tr>
<tr><td>505.mcf_r</td><td>605.mcf_s</td><td>C</td><td>3</td><td>Vạch tuyến đường</td></tr>
<tr><td>520.omnetpp_r</td><td>620.omnetpp_s</td><td>C++</td><td>134</td><td>Mô phỏng sự kiện rời rạc — mạng máy tính</td></tr>
<tr><td>523.xalancbmk_r</td><td>623.xalancbmk_s</td><td>C++</td><td>520</td><td>Chuyển XML sang HTML bằng XSLT</td></tr>
<tr><td>525.x264_r</td><td>625.x264_s</td><td>C</td><td>96</td><td>Nén video</td></tr>
<tr><td>531.deepsjeng_r</td><td>631.deepsjeng_s</td><td>C++</td><td>10</td><td>AI: tìm kiếm cây alpha-beta (cờ vua)</td></tr>
<tr><td>541.leela_r</td><td>641.leela_s</td><td>C++</td><td>21</td><td>AI: tìm kiếm cây Monte Carlo (cờ vây)</td></tr>
<tr><td>548.exchange2_r</td><td>648.exchange2_s</td><td>Fortran</td><td>1</td><td>AI: sinh lời giải đệ quy (Sudoku)</td></tr>
<tr><td>557.xz_r</td><td>657.xz_s</td><td>C</td><td>33</td><td>Nén dữ liệu tổng quát</td></tr>
</table>
<ul>
<li><strong>Chú thích dưới bảng định nghĩa đơn vị:</strong> "Kloc = số dòng (kể cả chú thích và dòng trắng) của các file nguồn dùng khi build ÷ 1000". Vậy 1304 Kloc của GCC nghĩa là khoảng 1,3 triệu dòng — còn 1 Kloc của exchange2 nghĩa là cỡ một nghìn dòng.</li>
<li><strong>Thứ đầu tiên đáng để ý là khoảng chênh KÍCH THƯỚC.</strong> Từ <strong>3 Kloc (mcf)</strong> tới <strong>1304 Kloc (gcc)</strong> — chênh 435 lần. Một chương trình tí hon nhưng tập dữ liệu làm việc khổng lồ (mcf vạch tuyến trên đồ thị lớn) ép <em>BỘ NHỚ</em>; một chương trình đồ sộ như gcc ép <em>CACHE LỆNH</em> và dự đoán rẽ nhánh. Kích thước mã và hành vi bộ nhớ là hai thứ độc lập, và bộ benchmark cố ý lấy mẫu cả hai.</li>
<li><strong>Ba trong mười là tìm kiếm AI.</strong> deepsjeng (alpha-beta, cờ vua), leela (tìm kiếm cây Monte Carlo, cờ vây), exchange2 (giải Sudoku đệ quy). Cả ba đều nặng rẽ nhánh, nặng con trỏ, đệ quy sâu và gần như không có quy luật số học nào — đúng loại tải đánh bại mọi cơ chế nạp trước và tưởng thưởng cho dự đoán rẽ nhánh tốt (slide 3).</li>
<li><strong>Vì sao chọn những chương trình này chứ không phải cái khác.</strong> Mỗi cái đều thoả bốn tiêu chí của slide 23: mã nguồn bậc cao khả chuyển, đại diện cho một lĩnh vực thật, dễ bấm giờ, và phân phối rộng rãi (cái nào cũng là phần mềm nguồn mở nổi tiếng).</li>
<li><strong>Để ý exchange2 là Fortran dù nằm trong bộ SỐ NGUYÊN.</strong> Một lời nhắc hữu ích rằng "Fortran" không có nghĩa là "dấu phẩy động"; ngôn ngữ do lịch sử của ứng dụng chọn, không do kiểu dữ liệu chọn.</li>
</ul>
<p class="meo">💡 Bạn sẽ không bị bắt học thuộc bảng này. Thứ ra thi là cái <em>KHUÔN MẪU</em>: bộ số nguyên gồm trình thông dịch, trình biên dịch, nén, mô phỏng và tìm kiếm AI — mã bất quy tắc, nặng rẽ nhánh, đuổi theo con trỏ. Nói được câu đó là được điểm.</p>`],

      [27, 'Table 2.5(B) — SPEC CPU2017 Benchmarks (floating point)',
        `<p class="y-chinh">🎯 The floating-point half, and the "Application Area" column now reads like a list of science departments: weather, relativity, molecular dynamics, ocean modelling, electromagnetics. This is what FP hardware is actually for.</p>
<table>
<tr><th>Rate</th><th>Speed</th><th>Language</th><th>Kloc</th><th>Application Area</th></tr>
<tr><td>503.bwaves_r</td><td>603.bwaves_s</td><td>Fortran</td><td>1</td><td>Explosion modeling</td></tr>
<tr><td>507.cactuBSSN_r</td><td>607.cactuBSSN_s</td><td>C++, C, Fortran</td><td>257</td><td>Physics; relativity</td></tr>
<tr><td>508.namd_r</td><td>—</td><td>C++, C</td><td>8</td><td>Molecular dynamics</td></tr>
<tr><td>510.parest_r</td><td>—</td><td>C++</td><td>427</td><td>Biomedical imaging; optical tomography with finite elements</td></tr>
<tr><td>511.povray_r</td><td>—</td><td>C++</td><td>170</td><td>Ray tracing</td></tr>
<tr><td>519.lbm_r</td><td>619.lbm_s</td><td>C</td><td>1</td><td>Fluid dynamics</td></tr>
<tr><td>521.wrf_r</td><td>621.wrf_s</td><td>Fortran, C</td><td>991</td><td>Weather forecasting</td></tr>
<tr><td>526.blender_r</td><td>—</td><td>C++</td><td>1577</td><td>3D rendering and animation</td></tr>
<tr><td>527.cam4_r</td><td>627.cam4_s</td><td>Fortran, C</td><td>407</td><td>Atmosphere modeling</td></tr>
<tr><td>—</td><td>628.pop2_s</td><td>Fortran, C</td><td>338</td><td>Wide-scale ocean modeling (climate level)</td></tr>
<tr><td>538.imagick_r</td><td>638.imagick_s</td><td>C</td><td>259</td><td>Image manipulation</td></tr>
<tr><td>544.nab_r</td><td>644.nab_s</td><td>C</td><td>24</td><td>Molecular dynamics</td></tr>
<tr><td>549.fotonik3d_r</td><td>649.fotonik3d_s</td><td>Fortran</td><td>14</td><td>Computational electromagnetics</td></tr>
<tr><td>554.roms_r</td><td>654.roms_s</td><td>Fortran</td><td>210</td><td>Regional ocean modeling</td></tr>
</table>
<ul>
<li><strong>The gaps in the table are information, not typos.</strong> namd, parest, povray and blender have <strong>only a rate version</strong>; pop2 has <strong>only a speed version</strong>. That is why slide 25 said "for all of the integer benchmarks and <em>most</em> of the floating-point benchmarks there are both". A program that does not parallelise well within one run cannot produce a meaningful speed (multi-threaded) result.</li>
<li><strong>Fortran dominates here.</strong> Eight of the fourteen rows involve Fortran, against exactly one row in the integer table. Scientific numerical code is the one domain where Fortran is still the working language, and this table is the evidence.</li>
<li><strong>Two rows with 1 Kloc are the interesting ones.</strong> bwaves (explosion modelling) and lbm (fluid dynamics) are about a thousand lines each — tiny programs that run for a very long time over enormous arrays. They measure <strong>memory bandwidth</strong> almost purely: the instruction cache is irrelevant, the data stream is everything. Compare with blender at 1577 Kloc, which is a whole application.</li>
<li><strong>Why FP workloads behave differently from integer ones.</strong> These programs march through large regular arrays, so prefetching works, branches are predictable, and the limit is how fast data can be delivered from memory — exactly the "performance balance" problem of slide 4. Integer workloads (slide 26) are the opposite: irregular access, unpredictable branches.</li>
<li><strong>Two molecular dynamics entries (namd and nab), two ocean models (roms and pop2).</strong> Not redundancy: different codes with different data structures stress different parts of the machine even within the same scientific field.</li>
</ul>
<p class="pitfall">⚠️ The slide's text renders one benchmark as "519.ibm_r / 619.ibm_s". The real SPEC name is <strong>519.lbm_r / 619.lbm_s</strong> — LBM for <em>Lattice Boltzmann Method</em>, the fluid-dynamics algorithm, not IBM the company. A lowercase "l" read as an uppercase "I" in the slide font. The application area column ("Fluid dynamics") is what tells you which reading is right.</p>`,
        `<p class="y-chinh">🎯 Nửa dấu phẩy động, và cột "Lĩnh vực ứng dụng" giờ đọc lên như danh sách các khoa khoa học: thời tiết, thuyết tương đối, động lực học phân tử, mô hình đại dương, điện từ tính toán. Đây mới là thứ phần cứng FP thật sự sinh ra để làm.</p>
<table>
<tr><th>Rate</th><th>Speed</th><th>Ngôn ngữ</th><th>Kloc</th><th>Lĩnh vực ứng dụng</th></tr>
<tr><td>503.bwaves_r</td><td>603.bwaves_s</td><td>Fortran</td><td>1</td><td>Mô hình hoá vụ nổ</td></tr>
<tr><td>507.cactuBSSN_r</td><td>607.cactuBSSN_s</td><td>C++, C, Fortran</td><td>257</td><td>Vật lý; thuyết tương đối</td></tr>
<tr><td>508.namd_r</td><td>—</td><td>C++, C</td><td>8</td><td>Động lực học phân tử</td></tr>
<tr><td>510.parest_r</td><td>—</td><td>C++</td><td>427</td><td>Chẩn đoán hình ảnh y sinh; chụp cắt lớp quang học bằng phần tử hữu hạn</td></tr>
<tr><td>511.povray_r</td><td>—</td><td>C++</td><td>170</td><td>Dò tia (ray tracing)</td></tr>
<tr><td>519.lbm_r</td><td>619.lbm_s</td><td>C</td><td>1</td><td>Động lực học chất lưu</td></tr>
<tr><td>521.wrf_r</td><td>621.wrf_s</td><td>Fortran, C</td><td>991</td><td>Dự báo thời tiết</td></tr>
<tr><td>526.blender_r</td><td>—</td><td>C++</td><td>1577</td><td>Dựng hình và hoạt hình 3D</td></tr>
<tr><td>527.cam4_r</td><td>627.cam4_s</td><td>Fortran, C</td><td>407</td><td>Mô hình hoá khí quyển</td></tr>
<tr><td>—</td><td>628.pop2_s</td><td>Fortran, C</td><td>338</td><td>Mô hình đại dương quy mô lớn (cấp khí hậu)</td></tr>
<tr><td>538.imagick_r</td><td>638.imagick_s</td><td>C</td><td>259</td><td>Xử lý ảnh</td></tr>
<tr><td>544.nab_r</td><td>644.nab_s</td><td>C</td><td>24</td><td>Động lực học phân tử</td></tr>
<tr><td>549.fotonik3d_r</td><td>649.fotonik3d_s</td><td>Fortran</td><td>14</td><td>Điện từ tính toán</td></tr>
<tr><td>554.roms_r</td><td>654.roms_s</td><td>Fortran</td><td>210</td><td>Mô hình đại dương khu vực</td></tr>
</table>
<ul>
<li><strong>Những ô TRỐNG trong bảng là thông tin, không phải lỗi đánh máy.</strong> namd, parest, povray và blender <strong>chỉ có bản rate</strong>; pop2 <strong>chỉ có bản speed</strong>. Đó là lý do slide 25 viết "mọi benchmark số nguyên và <em>PHẦN LỚN</em> benchmark dấu phẩy động đều có cả hai". Một chương trình không song song hoá tốt được trong một lần chạy thì không thể cho ra kết quả speed (đa luồng) có nghĩa.</li>
<li><strong>Fortran áp đảo ở đây.</strong> Tám trong mười bốn dòng có dính Fortran, so với đúng một dòng ở bảng số nguyên. Mã số học khoa học là lĩnh vực duy nhất Fortran còn là ngôn ngữ làm việc, và bảng này là bằng chứng.</li>
<li><strong>Hai dòng 1 Kloc mới là chỗ thú vị.</strong> bwaves (mô hình vụ nổ) và lbm (động lực học chất lưu) mỗi cái chỉ khoảng một nghìn dòng — chương trình tí hon nhưng chạy rất lâu trên những mảng khổng lồ. Chúng đo <strong>BĂNG THÔNG BỘ NHỚ</strong> gần như thuần khiết: cache lệnh vô nghĩa, dòng dữ liệu là tất cả. So với blender 1577 Kloc, vốn là cả một ứng dụng hoàn chỉnh.</li>
<li><strong>Vì sao tải FP cư xử khác tải số nguyên.</strong> Những chương trình này duyệt qua các mảng lớn rất đều đặn, nên nạp trước hiệu quả, rẽ nhánh dễ đoán, và giới hạn nằm ở tốc độ đưa dữ liệu từ bộ nhớ về — đúng bài toán "cân bằng hiệu năng" của slide 4. Tải số nguyên (slide 26) thì ngược lại: truy cập bất quy tắc, rẽ nhánh khó đoán.</li>
<li><strong>Hai mục động lực học phân tử (namd và nab), hai mô hình đại dương (roms và pop2).</strong> Không phải thừa: hai đoạn mã khác nhau với cấu trúc dữ liệu khác nhau vẫn ép những phần khác nhau của cỗ máy, dù cùng một ngành khoa học.</li>
</ul>
<p class="pitfall">⚠️ Phần chữ của slide hiện một benchmark thành "519.ibm_r / 619.ibm_s". Tên SPEC thật là <strong>519.lbm_r / 619.lbm_s</strong> — LBM là <em>Lattice Boltzmann Method</em>, thuật toán động lực học chất lưu, chứ không phải hãng IBM. Chữ "l" thường bị đọc thành chữ "I" hoa trong phông chữ của slide. Chính cột lĩnh vực ứng dụng ("động lực học chất lưu") mới cho biết cách đọc nào đúng.</p>`],

      [28, 'Table 2.6(a) — SPEC CPU2017 Integer Benchmarks for HP Integrity Superdome X, Rate Result (768 copies)',
        `<p class="y-chinh">🎯 A real published result, and the header tells you almost everything: <strong>rate</strong> means throughput, and <strong>768 copies</strong> of each benchmark were run simultaneously. The "Rate" column is not a time — it is a score, and you should know how it is built.</p>
<pre>Rate score = ( reference machine time / measured run time ) × number of copies</pre>
<table>
<tr><th>Benchmark</th><th>Base seconds</th><th>Base rate</th><th>Peak seconds</th><th>Peak rate</th></tr>
<tr><td>500.perlbench_r</td><td>1141</td><td>1070</td><td>933</td><td>1310</td></tr>
<tr><td>502.gcc_r</td><td>1303</td><td>835</td><td>1276</td><td>852</td></tr>
<tr><td>505.mcf_r</td><td>1433</td><td>866</td><td>1378</td><td>901</td></tr>
<tr><td>520.omnetpp_r</td><td>1664</td><td>606</td><td>1634</td><td>617</td></tr>
<tr><td>523.xalancbmk_r</td><td>722</td><td>1120</td><td>713</td><td>1140</td></tr>
<tr><td>525.x264_r</td><td>655</td><td>2053</td><td>661</td><td>2030</td></tr>
<tr><td>531.deepsjeng_r</td><td>604</td><td>1460</td><td>597</td><td>1470</td></tr>
<tr><td>541.leela_r</td><td>892</td><td>1410</td><td>896</td><td>1420</td></tr>
<tr><td>548.exchange2_r</td><td>833</td><td>2420</td><td>770</td><td>2610</td></tr>
<tr><td>557.xz_r</td><td>870</td><td>953</td><td>863</td><td>961</td></tr>
</table>
<ul>
<li><strong>Worked check of one row.</strong> The SPEC reference time for 500.perlbench_r is 1592 s. Base rate = (1592 ÷ 1141) × 768 = 1,3953 × 768 = 1071,6.</li>
</ul>
<p class="dap-an">✅ Answer: <strong>≈ 1072, and the table prints 1070</strong> — agreement to three significant figures, the difference being SPEC's rounding of published rate scores. That is how you can verify any row for yourself if you know the reference time.</p>
<ul>
<li><strong>Seconds and rate move in opposite directions — always check this first.</strong> More seconds means a worse score. omnetpp is the slowest here (1664 s) and has the lowest rate (606); x264 and exchange2 are among the fastest and score above 2000. If a "rate" ever rose with time you would be reading the table wrong.</li>
<li><strong>Base versus peak, seen in the numbers.</strong> Peak is the same work compiled with aggressive, per-benchmark optimisation. perlbench gains the most (1141 → 933 s, a 22% improvement, 1070 → 1310) and x264 actually gets <em>slightly worse</em> (655 → 661 s, 2053 → 2030). Aggressive optimisation is not guaranteed to help — another reason SPEC requires the conservative <strong>base</strong> result to be reported always (slide 30).</li>
<li><strong>The overall score is a geometric mean, not a sum.</strong> Taking the GM of the ten base rates gives <strong>≈ 1177</strong>, and of the ten peak rates <strong>≈ 1224</strong>. Slide 31's flowchart is exactly this procedure. Note you must <em>not</em> use the arithmetic mean here — these are normalized ratios, which is the lesson of slides 21 and 22.</li>
<li><strong>Why 768 copies.</strong> The machine under test is a large multiprocessor server; the rate metric exists to let it use every core. The copy count is chosen by the tester and must be disclosed, which is why it appears in the table caption — a rate score without its copy count is meaningless.</li>
</ul>
<p class="pitfall">⚠️ Never compare a rate score with a speed score. Slide 29 reports the same machine with speed ratios between 2,86 and 8,93, while this table shows rates in the hundreds and thousands. They are different metrics on different scales answering different questions; putting them in one sentence is a guaranteed lost mark.</p>`,
        `<p class="y-chinh">🎯 Một kết quả công bố THẬT, và phần đầu bảng nói gần như tất cả: <strong>rate</strong> nghĩa là thông lượng, và <strong>768 bản sao</strong> của mỗi benchmark được chạy đồng thời. Cột "Rate" không phải thời gian — nó là ĐIỂM, và bạn nên biết điểm ấy dựng ra sao.</p>
<pre>Điểm rate = ( thời gian máy tham chiếu / thời gian chạy đo được ) × số bản sao</pre>
<table>
<tr><th>Benchmark</th><th>Base giây</th><th>Base rate</th><th>Peak giây</th><th>Peak rate</th></tr>
<tr><td>500.perlbench_r</td><td>1141</td><td>1070</td><td>933</td><td>1310</td></tr>
<tr><td>502.gcc_r</td><td>1303</td><td>835</td><td>1276</td><td>852</td></tr>
<tr><td>505.mcf_r</td><td>1433</td><td>866</td><td>1378</td><td>901</td></tr>
<tr><td>520.omnetpp_r</td><td>1664</td><td>606</td><td>1634</td><td>617</td></tr>
<tr><td>523.xalancbmk_r</td><td>722</td><td>1120</td><td>713</td><td>1140</td></tr>
<tr><td>525.x264_r</td><td>655</td><td>2053</td><td>661</td><td>2030</td></tr>
<tr><td>531.deepsjeng_r</td><td>604</td><td>1460</td><td>597</td><td>1470</td></tr>
<tr><td>541.leela_r</td><td>892</td><td>1410</td><td>896</td><td>1420</td></tr>
<tr><td>548.exchange2_r</td><td>833</td><td>2420</td><td>770</td><td>2610</td></tr>
<tr><td>557.xz_r</td><td>870</td><td>953</td><td>863</td><td>961</td></tr>
</table>
<ul>
<li><strong>Kiểm một dòng bằng bài giải.</strong> Thời gian tham chiếu của SPEC cho 500.perlbench_r là 1592 s. Base rate = (1592 ÷ 1141) × 768 = 1,3953 × 768 = 1071,6.</li>
</ul>
<p class="dap-an">✅ Đáp án: <strong>≈ 1072, còn bảng in 1070</strong> — khớp tới ba chữ số có nghĩa, chênh lệch là do SPEC làm tròn điểm rate khi công bố. Đó là cách bạn tự kiểm được bất kỳ dòng nào, miễn là biết thời gian tham chiếu.</p>
<ul>
<li><strong>Giây và rate đi NGƯỢC chiều nhau — luôn kiểm điều này trước.</strong> Nhiều giây hơn nghĩa là điểm tệ hơn. omnetpp chậm nhất bảng (1664 s) và có rate thấp nhất (606); x264 và exchange2 thuộc nhóm nhanh nhất và đạt trên 2000 điểm. Nếu thấy "rate" tăng theo thời gian thì chắc chắn bạn đang đọc sai bảng.</li>
<li><strong>Base so với peak, nhìn bằng con số.</strong> Peak là cùng khối lượng việc nhưng biên dịch với tối ưu mạnh tay, chỉnh riêng cho từng benchmark. perlbench lời nhiều nhất (1141 → 933 s, cải thiện 22%, 1070 → 1310) còn x264 thì <em>TỆ ĐI một chút</em> (655 → 661 s, 2053 → 2030). Tối ưu mạnh tay KHÔNG bảo đảm có lợi — thêm một lý do vì sao SPEC luôn bắt buộc phải công bố kết quả <strong>base</strong> thận trọng (slide 30).</li>
<li><strong>Điểm tổng là TRUNG BÌNH HÌNH HỌC, không phải tổng.</strong> Lấy GM của mười điểm base được <strong>≈ 1177</strong>, của mười điểm peak được <strong>≈ 1224</strong>. Lưu đồ ở slide 31 chính là thủ tục đó. Lưu ý ở đây <em>KHÔNG</em> được dùng trung bình số học — đây là các tỉ số chuẩn hoá, đúng bài học của slide 21 và 22.</li>
<li><strong>Vì sao lại 768 bản sao.</strong> Máy đem đo là một máy chủ đa xử lý cỡ lớn; chỉ số rate sinh ra để nó dùng được hết mọi lõi. Số bản sao do người đo chọn và bắt buộc phải công khai, nên nó xuất hiện ngay ở tiêu đề bảng — một điểm rate mà không kèm số bản sao thì vô nghĩa.</li>
</ul>
<p class="pitfall">⚠️ Đừng bao giờ so điểm rate với điểm speed. Slide 29 báo cáo cùng cỗ máy ấy với tỉ số speed từ 2,86 tới 8,93, còn bảng này cho rate hàng trăm hàng nghìn. Đó là hai thước đo khác nhau, thang khác nhau, trả lời hai câu hỏi khác nhau; nhét chung vào một câu là chắc chắn mất điểm.</p>`],

      [29, 'Table 2.6(b) — SPEC CPU2017 Integer Benchmarks for HP Integrity Superdome X, Speed Result (384 threads)',
        `<p class="y-chinh">🎯 The same machine, the <strong>speed</strong> metric, 384 threads on ONE copy of each program. Here the score is a plain <strong>ratio</strong> against the reference machine — and this table can be cross-checked against slide 32, which gives those reference times.</p>
<pre>Speed ratio = reference machine time / measured time</pre>
<table>
<tr><th>Benchmark</th><th>Base seconds</th><th>Base ratio</th><th>Peak seconds</th><th>Peak ratio</th><th>Reference time (slide 32)</th><th>Check: ref ÷ base sec</th></tr>
<tr><td>600.perlbench_s</td><td>358</td><td>4,96</td><td>295</td><td>6,01</td><td>1774</td><td>4,96 ✓</td></tr>
<tr><td>602.gcc_s</td><td>546</td><td>7,29</td><td>535</td><td>7,45</td><td>3981</td><td>7,29 ✓</td></tr>
<tr><td>605.mcf_s</td><td>866</td><td>5,45</td><td>700</td><td>6,75</td><td>4721</td><td>5,45 ✓</td></tr>
<tr><td>620.omnetpp_s</td><td>276</td><td>5,90</td><td>247</td><td>6,61</td><td>1630</td><td>5,91 ✓</td></tr>
<tr><td>623.xalancbmk_s</td><td>188</td><td>7,52</td><td>179</td><td>7,91</td><td>1417</td><td>7,54 ✓</td></tr>
<tr><td>625.x264_s</td><td>283</td><td>6,23</td><td>271</td><td>6,51</td><td>1764</td><td>6,23 ✓</td></tr>
<tr><td>631.deepsjeng_s</td><td>407</td><td>3,52</td><td>343</td><td>4,18</td><td>1432</td><td>3,52 ✓</td></tr>
<tr><td>641.leela_s</td><td>469</td><td>3,63</td><td>439</td><td>3,88</td><td>1706</td><td>3,64 ✓</td></tr>
<tr><td>648.exchange2_s</td><td>329</td><td>8,93</td><td>299</td><td>9,82</td><td>2939</td><td>8,93 ✓</td></tr>
<tr><td>657.xz_s</td><td>2164</td><td>2,86</td><td>2119</td><td>2,92</td><td>6182</td><td>2,86 ✓</td></tr>
</table>
<ul>
<li><strong>The last two columns are a genuine cross-check, not decoration.</strong> Table 2.7 on slide 32 lists the <em>reference machine</em> times for exactly these ten benchmarks. Dividing each by the base seconds here reproduces all ten published ratios, with the largest disagreement being 7,54 against 7,52 — pure rounding. Two slides, drawn from two different tables in the book, agree numerically. That is what a verified reading looks like.</li>
<li><strong>Worked example.</strong> 605.mcf_s: reference 4721 s, measured 866 s. Ratio = 4721 ÷ 866 = 5,4515.</li>
</ul>
<p class="dap-an">✅ Answer: <strong>5,45 — exactly the published figure.</strong> Peak: 4721 ÷ 700 = 6,744 → 6,75 ✓ as printed. Two rows verified by hand; the other eight were checked the same way.</p>
<ul>
<li><strong>Now compare the two metrics on the same machine.</strong> Rate scores (slide 28) run 606 to 2420; speed ratios here run 2,86 to 8,93. The machine that looks enormously powerful on throughput is <strong>under 9× the reference machine</strong> on single-task latency — because a speed run cannot use 768 independent copies to fill 384 threads; it has to find parallelism <em>inside one program</em>, which Amdahl's law (slide 11) limits severely. Slides 28 and 29 are Amdahl's law measured on a real server.</li>
<li><strong>The overall score, computed.</strong> GM of the ten base ratios = <strong>≈ 5,31</strong>; GM of the ten peak ratios = <strong>≈ 5,86</strong>. These are the SPECspeed 2017_int_base and _peak figures for this machine. Note the arithmetic mean of the base ratios would be 5,63 — higher, and not the number SPEC reports.</li>
<li><strong>657.xz_s is the outlier worth discussing.</strong> 2164 s and a ratio of only 2,86 — it is far the slowest and scales worst. Its low ratio drags the geometric mean down noticeably, which is exactly the outlier sensitivity shown in Figure 2.6 row (g). Publishing per-benchmark numbers alongside the summary lets a reader see this; publishing only the summary would hide it.</li>
</ul>
<p class="pitfall">⚠️ Read the direction of the ratio correctly: it is <strong>reference ÷ measured</strong>, so a <em>bigger</em> ratio means <em>faster</em>. It is the mirror image of the seconds column. Getting this backwards inverts every conclusion you draw from the table.</p>`,
        `<p class="y-chinh">🎯 Vẫn cỗ máy đó, nhưng là thước đo <strong>speed</strong>, 384 luồng chạy MỘT bản mỗi chương trình. Ở đây điểm số là một <strong>TỈ SỐ</strong> thuần tuý so với máy tham chiếu — và bảng này ĐỐI CHIẾU CHÉO được với slide 32, nơi cho biết chính những thời gian tham chiếu ấy.</p>
<pre>Tỉ số speed = thời gian máy tham chiếu / thời gian đo được</pre>
<table>
<tr><th>Benchmark</th><th>Base giây</th><th>Base ratio</th><th>Peak giây</th><th>Peak ratio</th><th>Thời gian tham chiếu (slide 32)</th><th>Kiểm: tham chiếu ÷ base giây</th></tr>
<tr><td>600.perlbench_s</td><td>358</td><td>4,96</td><td>295</td><td>6,01</td><td>1774</td><td>4,96 ✓</td></tr>
<tr><td>602.gcc_s</td><td>546</td><td>7,29</td><td>535</td><td>7,45</td><td>3981</td><td>7,29 ✓</td></tr>
<tr><td>605.mcf_s</td><td>866</td><td>5,45</td><td>700</td><td>6,75</td><td>4721</td><td>5,45 ✓</td></tr>
<tr><td>620.omnetpp_s</td><td>276</td><td>5,90</td><td>247</td><td>6,61</td><td>1630</td><td>5,91 ✓</td></tr>
<tr><td>623.xalancbmk_s</td><td>188</td><td>7,52</td><td>179</td><td>7,91</td><td>1417</td><td>7,54 ✓</td></tr>
<tr><td>625.x264_s</td><td>283</td><td>6,23</td><td>271</td><td>6,51</td><td>1764</td><td>6,23 ✓</td></tr>
<tr><td>631.deepsjeng_s</td><td>407</td><td>3,52</td><td>343</td><td>4,18</td><td>1432</td><td>3,52 ✓</td></tr>
<tr><td>641.leela_s</td><td>469</td><td>3,63</td><td>439</td><td>3,88</td><td>1706</td><td>3,64 ✓</td></tr>
<tr><td>648.exchange2_s</td><td>329</td><td>8,93</td><td>299</td><td>9,82</td><td>2939</td><td>8,93 ✓</td></tr>
<tr><td>657.xz_s</td><td>2164</td><td>2,86</td><td>2119</td><td>2,92</td><td>6182</td><td>2,86 ✓</td></tr>
</table>
<ul>
<li><strong>Hai cột cuối là một PHÉP ĐỐI CHIẾU THẬT, không phải trang trí.</strong> Table 2.7 ở slide 32 liệt kê thời gian của <em>MÁY THAM CHIẾU</em> cho đúng mười benchmark này. Lấy từng số chia cho số giây base ở đây thì tái tạo được cả mười tỉ số đã công bố, chỗ lệch nhiều nhất là 7,54 so với 7,52 — thuần tuý làm tròn. Hai slide, lấy từ hai bảng khác nhau trong sách, khớp nhau về số. Một phép đọc có kiểm chứng trông như vậy đấy.</li>
<li><strong>Bài giải mẫu.</strong> 605.mcf_s: tham chiếu 4721 s, đo được 866 s. Tỉ số = 4721 ÷ 866 = 5,4515.</li>
</ul>
<p class="dap-an">✅ Đáp án: <strong>5,45 — đúng con số đã công bố.</strong> Peak: 4721 ÷ 700 = 6,744 → 6,75 ✓ đúng như in. Hai dòng đã kiểm tay; tám dòng còn lại kiểm theo đúng cách đó.</p>
<ul>
<li><strong>Giờ so hai thước đo TRÊN CÙNG MỘT CỖ MÁY.</strong> Điểm rate (slide 28) chạy từ 606 tới 2420; tỉ số speed ở đây chạy từ 2,86 tới 8,93. Cỗ máy trông cực kỳ mạnh mẽ về thông lượng lại <strong>chưa tới 9 lần máy tham chiếu</strong> về độ trễ một tác vụ — vì lần chạy speed không thể dùng 768 bản sao độc lập để lấp 384 luồng; nó phải tìm sự song song <em>BÊN TRONG MỘT chương trình</em>, thứ mà định luật Amdahl (slide 11) chặn rất gắt. Slide 28 và 29 chính là định luật Amdahl được ĐO trên một máy chủ thật.</li>
<li><strong>Điểm tổng, đã tính.</strong> GM của mười tỉ số base = <strong>≈ 5,31</strong>; GM của mười tỉ số peak = <strong>≈ 5,86</strong>. Đó là con số SPECspeed 2017_int_base và _peak của cỗ máy này. Để ý trung bình SỐ HỌC của các tỉ số base sẽ là 5,63 — cao hơn, và KHÔNG phải con số SPEC công bố.</li>
<li><strong>657.xz_s là điểm dị thường đáng bàn.</strong> 2164 s và tỉ số chỉ 2,86 — chậm nhất xa và mở rộng kém nhất. Tỉ số thấp của nó kéo trung bình hình học xuống thấy rõ, đúng độ nhạy với điểm dị thường đã thấy ở dòng (g) của Figure 2.6. Công bố số của từng benchmark bên cạnh con số tóm tắt là để người đọc thấy được điều này; chỉ công bố con số tóm tắt là che nó đi.</li>
</ul>
<p class="pitfall">⚠️ Đọc cho đúng CHIỀU của tỉ số: nó là <strong>tham chiếu ÷ đo được</strong>, nên tỉ số <em>LỚN HƠN</em> nghĩa là <em>NHANH HƠN</em>. Nó là ảnh gương của cột số giây. Đọc ngược chiều này là đảo lộn mọi kết luận rút ra từ bảng.</p>`],

      [30, 'Terms Used in SPEC Documentation',
        `<p class="y-chinh">🎯 The glossary that makes slides 28 and 29 readable. Seven terms — and the last two, <strong>speed</strong> and <strong>rate</strong>, are the pair that most often appears in exam questions.</p>
<table>
<tr><th>Term</th><th>The slide's own definition</th></tr>
<tr><td><strong>Benchmark</strong></td><td>A program written in a high-level language that can be compiled and executed on any computer that implements the compiler</td></tr>
<tr><td><strong>System under test</strong></td><td>This is the system to be evaluated</td></tr>
<tr><td><strong>Reference machine</strong></td><td>A system used by SPEC to establish a <strong>baseline performance for all benchmarks</strong>; each benchmark is run and measured on this machine to establish a <strong>reference time</strong> for that benchmark</td></tr>
<tr><td><strong>Base metric</strong></td><td><strong>Required</strong> for all reported results and has <strong>strict guidelines for compilation</strong></td></tr>
<tr><td><strong>Peak metric</strong></td><td>Enables users to attempt to <strong>optimize system performance by optimizing the compiler output</strong></td></tr>
<tr><td><strong>Speed metric</strong></td><td>Simply a measurement of the <strong>time</strong> it takes to execute a compiled benchmark; used for comparing the ability of a computer to <strong>complete single tasks</strong></td></tr>
<tr><td><strong>Rate metric</strong></td><td>A measurement of <strong>how many tasks a computer can accomplish in a certain amount of time</strong> — a throughput, capacity, or rate measure; allows the system under test to execute <strong>simultaneous tasks</strong> to take advantage of multiple processors</td></tr>
</table>
<ul>
<li><strong>The reference machine is what turns seconds into a comparable number.</strong> Every published ratio on slides 28 and 29 is measured against it, which is why it must be fixed and public for the lifetime of the suite. Change the reference machine and every score changes — but, by the geometric-mean property of slide 21, every score changes by the <em>same factor</em>, so the rankings survive. That is not luck; it is why GM was chosen.</li>
<li><strong>Base is mandatory, peak is optional — and that asymmetry is a policy decision.</strong> Base has strict, uniform compilation rules, so base results are comparable across vendors. Peak lets each vendor tune per benchmark, so peak shows what the machine <em>can</em> do with expert effort but is much easier to game. Requiring base means nobody can report only their best-tuned number.</li>
<li><strong>Speed and rate answer two genuinely different questions.</strong> Speed: "how long until <em>my</em> job finishes?" — the desktop question of slide 2. Rate: "how many jobs per hour can this server retire?" — the server and cloud question of the same slide. A machine can be excellent at one and unremarkable at the other, and slides 28–29 show exactly such a machine.</li>
<li><strong>The definition of "benchmark" here repeats slide 23's first criterion</strong> — written in a high-level language, compilable and executable on any machine with a compiler. Portability is not a convenience; it is part of the definition.</li>
<li><strong>What "system under test" quietly includes.</strong> Not just the CPU: the memory, the compiler, the compiler flags, the operating system and its settings. A SPEC result is a measurement of a whole configuration, which is why full disclosure of the configuration accompanies every published score.</li>
</ul>
<p class="meo">💡 The two pairs to keep straight: <strong>base (strict rules, required) vs peak (tuned, optional)</strong>, and <strong>speed (one task, latency) vs rate (many tasks at once, throughput)</strong>. Almost every SPEC question in an exam is one of these two distinctions in disguise.</p>`,
        `<p class="y-chinh">🎯 Bảng thuật ngữ làm cho slide 28 và 29 đọc được. Bảy thuật ngữ — và hai cái cuối, <strong>speed</strong> và <strong>rate</strong>, là cặp hay ra đề nhất.</p>
<table>
<tr><th>Thuật ngữ</th><th>Định nghĩa nguyên văn của slide</th></tr>
<tr><td><strong>Benchmark</strong></td><td>Một chương trình viết bằng ngôn ngữ bậc cao, biên dịch và thi hành được trên bất kỳ máy tính nào có trình biên dịch tương ứng</td></tr>
<tr><td><strong>System under test</strong> (hệ đem đo)</td><td>Chính là hệ thống cần đánh giá</td></tr>
<tr><td><strong>Reference machine</strong> (máy tham chiếu)</td><td>Một hệ thống mà SPEC dùng để thiết lập <strong>mốc hiệu năng nền cho mọi benchmark</strong>; mỗi benchmark được chạy và đo trên máy này để lập ra <strong>thời gian tham chiếu</strong> cho benchmark đó</td></tr>
<tr><td><strong>Base metric</strong></td><td><strong>BẮT BUỘC</strong> với mọi kết quả công bố, và có <strong>luật biên dịch NGHIÊM NGẶT</strong></td></tr>
<tr><td><strong>Peak metric</strong></td><td>Cho phép người dùng <strong>tối ưu hiệu năng hệ thống bằng cách tối ưu đầu ra của trình biên dịch</strong></td></tr>
<tr><td><strong>Speed metric</strong></td><td>Đơn giản là phép đo <strong>THỜI GIAN</strong> thi hành một benchmark đã biên dịch; dùng để so khả năng <strong>hoàn thành MỘT tác vụ</strong> của các máy</td></tr>
<tr><td><strong>Rate metric</strong></td><td>Phép đo <strong>máy làm được BAO NHIÊU tác vụ trong một khoảng thời gian</strong> — tức thước đo thông lượng, sức chứa, hay tốc độ; cho phép hệ đem đo thi hành <strong>nhiều tác vụ ĐỒNG THỜI</strong> để tận dụng nhiều bộ xử lý</td></tr>
</table>
<ul>
<li><strong>Máy tham chiếu là thứ biến số giây thành con số SO SÁNH ĐƯỢC.</strong> Mọi tỉ số công bố ở slide 28 và 29 đều đo so với nó, nên nó phải cố định và công khai suốt vòng đời của bộ benchmark. Đổi máy tham chiếu là mọi điểm số đổi theo — nhưng nhờ tính chất của trung bình hình học ở slide 21, mọi điểm số đổi theo <em>CÙNG MỘT HỆ SỐ</em>, nên thứ hạng sống sót. Đó không phải may mắn; đó chính là lý do GM được chọn.</li>
<li><strong>Base bắt buộc, peak tuỳ chọn — và sự bất đối xứng đó là một quyết định CHÍNH SÁCH.</strong> Base có luật biên dịch nghiêm ngặt và thống nhất, nên kết quả base so được giữa các hãng. Peak cho mỗi hãng chỉnh riêng từng benchmark, nên peak cho thấy cỗ máy <em>CÓ THỂ</em> làm được gì khi có chuyên gia dày công, nhưng cũng dễ gian lận hơn nhiều. Bắt buộc có base nghĩa là không ai được phép chỉ công bố con số đã chỉnh đẹp nhất của mình.</li>
<li><strong>Speed và rate trả lời hai câu hỏi thật sự khác nhau.</strong> Speed: "bao giờ thì công việc CỦA TÔI xong?" — câu hỏi máy để bàn ở slide 2. Rate: "máy chủ này giải quyết được bao nhiêu việc mỗi giờ?" — câu hỏi máy chủ và đám mây ở cùng slide đó. Một cỗ máy có thể xuất sắc ở mặt này và tầm thường ở mặt kia, và slide 28–29 cho thấy đúng một cỗ máy như thế.</li>
<li><strong>Định nghĩa "benchmark" ở đây lặp lại tiêu chí đầu tiên của slide 23</strong> — viết bằng ngôn ngữ bậc cao, biên dịch và chạy được trên bất kỳ máy nào có trình biên dịch. Tính khả chuyển không phải chuyện tiện lợi; nó nằm trong ĐỊNH NGHĨA.</li>
<li><strong>"Hệ đem đo" lặng lẽ bao gồm những gì.</strong> Không chỉ CPU: cả bộ nhớ, trình biên dịch, các cờ biên dịch, hệ điều hành và cấu hình của nó. Một kết quả SPEC là phép đo của CẢ MỘT CẤU HÌNH, và đó là lý do mỗi điểm số công bố đều đi kèm bản khai đầy đủ cấu hình.</li>
</ul>
<p class="meo">💡 Hai cặp cần phân biệt rành mạch: <strong>base (luật nghiêm, bắt buộc) ↔ peak (chỉnh tay, tuỳ chọn)</strong>, và <strong>speed (một tác vụ, độ trễ) ↔ rate (nhiều tác vụ cùng lúc, thông lượng)</strong>. Gần như mọi câu hỏi về SPEC trong đề thi đều là một trong hai phép phân biệt này, đội lốt đi thôi.</p>`],

      [31, 'Figure 2.7 — SPEC Evaluation Flowchart',
        `<p class="y-chinh">🎯 The whole SPEC procedure as six boxes. Note what it does and does not do: it runs each program <strong>three times and keeps the median</strong>, converts each result to a <strong>ratio against the reference machine</strong>, and finishes with a <strong>geometric mean</strong> — never an arithmetic one.</p>
<table>
<tr><th>Step</th><th>Box on the flowchart</th><th>Why it is there</th></tr>
<tr><td>1</td><td>Start → <strong>Get next program</strong></td><td>The suite is a loop over programs, not a single measurement</td></tr>
<tr><td>2</td><td><strong>Run program three times</strong></td><td>Run-to-run variation is real (caches, OS scheduling, thermal state)</td></tr>
<tr><td>3</td><td><strong>Select median value</strong></td><td>The median of three discards a single freak run, high or low, without averaging it in</td></tr>
<tr><td>4</td><td><strong>Ratio(prog) = T<sub>ref</sub>(prog) / T<sub>SUT</sub>(prog)</strong></td><td>Normalizes seconds into a dimensionless, comparable ratio</td></tr>
<tr><td>5</td><td><strong>More programs?</strong> → Yes, loop back</td><td>Repeat for every benchmark in the suite</td></tr>
<tr><td>6</td><td>No → <strong>Compute geometric mean of all ratios</strong> → End</td><td>One score for the suite, independent of the reference machine</td></tr>
</table>
<ul>
<li><strong>Step 3 is a deliberate choice of median over mean.</strong> With only three runs, one anomalous run would move an average noticeably; the median of three is simply the middle value, so a single outlier has no effect at all. Figure 2.6 row (f) showed exactly how much damage one outlier does to a mean.</li>
<li><strong>Step 4 is the direction to memorise:</strong> <code>T<sub>ref</sub> ÷ T<sub>SUT</sub></code>. Reference on top. So a fast system under test gives a small T<sub>SUT</sub> and therefore a <em>large</em> ratio. This is the same convention as slide 29's ratio column, and checking the direction takes two seconds and saves whole questions.</li>
<li><strong>Step 6 is where slides 17–22 pay off.</strong> The last box says "geometric mean", and you now know exactly why: the values being averaged are <strong>normalized ratios</strong>, and only the GM gives a summary whose ranking does not depend on which machine SPEC chose as the reference (slide 21). The arithmetic mean would make SPEC's answer an artefact of its own baseline.</li>
<li><strong>What the flowchart omits.</strong> It does not show compilation — yet base versus peak (slide 30) is decided there, before the first box. It also does not show the <em>rate</em> variant, where step 2 runs many copies simultaneously and step 4 multiplies by the copy count (slide 28).</li>
<li><strong>Worked micro-example of the whole flow.</strong> A suite of three benchmarks. Reference times 100, 200, 400 s; the system under test takes 50, 50, 200 s. Ratios: 100/50 = 2, 200/50 = 4, 400/200 = 2. Geometric mean = cube root of (2 × 4 × 2) = cube root of 16 = 2,52.</li>
</ul>
<p class="dap-an">✅ Answer: <strong>the suite score is 2,52</strong> — the machine is about 2,5× the reference. The arithmetic mean of the same ratios would be (2 + 4 + 2)/3 = 2,67, a different and reference-dependent number; SPEC reports 2,52.</p>
<p class="pitfall">⚠️ Do not write the ratio upside down. <code>T<sub>SUT</sub>/T<sub>ref</sub></code> would make a <em>lower</em> number mean a faster machine, which is the opposite of every published SPEC score. The flowchart puts T<sub>ref</sub> in the numerator — copy it exactly.</p>`,
        `<p class="y-chinh">🎯 Toàn bộ quy trình SPEC gói trong sáu ô. Để ý nó làm gì và KHÔNG làm gì: chạy mỗi chương trình <strong>ba lần và lấy TRUNG VỊ</strong>, đổi mỗi kết quả thành <strong>TỈ SỐ so với máy tham chiếu</strong>, rồi kết thúc bằng <strong>TRUNG BÌNH HÌNH HỌC</strong> — không bao giờ dùng trung bình số học.</p>
<table>
<tr><th>Bước</th><th>Ô trên lưu đồ</th><th>Vì sao có nó</th></tr>
<tr><td>1</td><td>Start → <strong>Get next program</strong></td><td>Bộ benchmark là một VÒNG LẶP qua các chương trình, không phải một phép đo đơn</td></tr>
<tr><td>2</td><td><strong>Run program three times</strong></td><td>Sai khác giữa các lần chạy là có thật (cache, lập lịch của hệ điều hành, trạng thái nhiệt)</td></tr>
<tr><td>3</td><td><strong>Select median value</strong></td><td>Trung vị của ba lần loại bỏ một lần chạy bất thường, dù cao hay thấp, mà không "hoà" nó vào</td></tr>
<tr><td>4</td><td><strong>Ratio(prog) = T<sub>ref</sub>(prog) / T<sub>SUT</sub>(prog)</strong></td><td>Chuẩn hoá số giây thành tỉ số không thứ nguyên, so sánh được</td></tr>
<tr><td>5</td><td><strong>More programs?</strong> → Yes, quay lại</td><td>Lặp cho mọi benchmark trong bộ</td></tr>
<tr><td>6</td><td>No → <strong>Compute geometric mean of all ratios</strong> → End</td><td>Một điểm số cho cả bộ, độc lập với máy tham chiếu</td></tr>
</table>
<ul>
<li><strong>Bước 3 là một lựa chọn CÓ CHỦ ĐÍCH: trung vị thay vì trung bình.</strong> Chỉ có ba lần chạy, một lần bất thường sẽ kéo con số trung bình thấy rõ; trung vị của ba đơn giản là giá trị ở giữa, nên một điểm dị thường không ảnh hưởng gì hết. Dòng (f) của Figure 2.6 đã cho thấy chính xác một điểm dị thường phá hoại một con số trung bình đến mức nào.</li>
<li><strong>Bước 4 là chiều cần thuộc:</strong> <code>T<sub>ref</sub> ÷ T<sub>SUT</sub></code>. THAM CHIẾU ở TRÊN. Nên một hệ đem đo nhanh sẽ cho T<sub>SUT</sub> nhỏ và do đó tỉ số <em>LỚN</em>. Đây đúng là quy ước ở cột ratio của slide 29, và kiểm chiều mất hai giây mà cứu được cả câu hỏi.</li>
<li><strong>Bước 6 là chỗ slide 17–22 trả công.</strong> Ô cuối ghi "trung bình hình học", và giờ bạn biết chính xác vì sao: những giá trị đem lấy trung bình là <strong>TỈ SỐ CHUẨN HOÁ</strong>, mà chỉ GM mới cho một con số tóm tắt có thứ hạng không phụ thuộc vào việc SPEC chọn máy nào làm tham chiếu (slide 21). Trung bình số học sẽ biến câu trả lời của SPEC thành sản phẩm phụ của chính cái mốc họ chọn.</li>
<li><strong>Lưu đồ BỎ QUA điều gì.</strong> Nó không vẽ khâu BIÊN DỊCH — mà base hay peak (slide 30) được quyết định ngay ở đó, trước ô đầu tiên. Nó cũng không vẽ biến thể <em>rate</em>, trong đó bước 2 chạy nhiều bản sao đồng thời và bước 4 nhân thêm số bản sao (slide 28).</li>
<li><strong>Bài giải nhỏ cho trọn quy trình.</strong> Một bộ ba benchmark. Thời gian tham chiếu 100, 200, 400 s; hệ đem đo mất 50, 50, 200 s. Tỉ số: 100/50 = 2, 200/50 = 4, 400/200 = 2. Trung bình hình học = căn bậc ba của (2 × 4 × 2) = căn bậc ba của 16 = 2,52.</li>
</ul>
<p class="dap-an">✅ Đáp án: <strong>điểm của bộ là 2,52</strong> — cỗ máy nhanh khoảng 2,5 lần máy tham chiếu. Trung bình SỐ HỌC của đúng ba tỉ số ấy sẽ là (2 + 4 + 2)/3 = 2,67, một con số khác và phụ thuộc mốc; SPEC công bố 2,52.</p>
<p class="pitfall">⚠️ Đừng viết ngược tỉ số. <code>T<sub>SUT</sub>/T<sub>ref</sub></code> sẽ khiến số NHỎ HƠN nghĩa là máy nhanh hơn, ngược hoàn toàn với mọi điểm SPEC đã công bố. Lưu đồ đặt T<sub>ref</sub> ở TỬ SỐ — chép đúng như thế.</p>`],

      [32, 'Table 2.7 — SPECspeed 2017_int_base Benchmark Results for Reference Machine (1 thread)',
        `<p class="y-chinh">🎯 The reference machine itself, measured — and measured for <strong>energy</strong>, not just time. These ten numbers in the Seconds column are exactly the <code>T<sub>ref</sub></code> values used to produce every ratio on slide 29.</p>
<table>
<tr><th>Benchmark</th><th>Seconds</th><th>Energy (kJ)</th><th>Average Power (W)</th><th>Maximum Power (W)</th><th>Check: s × W ÷ 1000</th></tr>
<tr><td>600.perlbench_s</td><td>1774</td><td>1920</td><td>1080</td><td>1090</td><td>1916 ✓</td></tr>
<tr><td>602.gcc_s</td><td>3981</td><td>4330</td><td>1090</td><td>1110</td><td>4339 ✓</td></tr>
<tr><td>605.mcf_s</td><td>4721</td><td>5150</td><td>1090</td><td>1120</td><td>5146 ✓</td></tr>
<tr><td>620.omnetpp_s</td><td>1630</td><td>1770</td><td>1090</td><td>1090</td><td>1777 ✓</td></tr>
<tr><td>623.xalancbmk_s</td><td>1417</td><td>1540</td><td>1090</td><td>1090</td><td>1545 ✓</td></tr>
<tr><td>625.x264_s</td><td>1764</td><td>1920</td><td>1090</td><td>1100</td><td>1923 ✓</td></tr>
<tr><td>631.deepsjeng_s</td><td>1432</td><td>1560</td><td>1090</td><td>1130</td><td>1561 ✓</td></tr>
<tr><td>641.leela_s</td><td>1706</td><td>1850</td><td>1090</td><td>1090</td><td>1860 ✓</td></tr>
<tr><td>648.exchange2_s</td><td>2939</td><td>3200</td><td>1080</td><td>1090</td><td>3174 ✓</td></tr>
<tr><td>657.xz_s</td><td>6182</td><td>6730</td><td>1090</td><td>1140</td><td>6738 ✓</td></tr>
</table>
<ul>
<li><strong>The last column is a verification, done by hand.</strong> Energy = power × time, so kJ should equal seconds × average watts ÷ 1000. Every row agrees to within 1% (the largest gap is exchange2: computed 3174 against a published 3200, 0,8%), which is what rounding of both the power and the energy figures produces. The table is internally consistent.</li>
<li><strong>Worked example.</strong> 657.xz_s: 6182 s at 1090 W. Energy = 6182 × 1090 = 6 738 380 J = 6738 kJ.</li>
</ul>
<p class="dap-an">✅ Answer: <strong>≈ 6738 kJ, and the table prints 6730 kJ</strong> — agreement to three significant figures. Note the size of the number: 6,7 megajoules is about 1,9 kWh for one benchmark run.</p>
<ul>
<li><strong>The most informative column is Average Power, because it barely moves.</strong> Every benchmark draws 1080–1090 W on average, with maxima of 1090–1140 W. On this machine the workload hardly changes the power draw at all — the static power of a large server (memory, interconnect, fans, idle cores) dominates the dynamic power of whatever the CPU is computing. That is why <em>finishing sooner</em>, not <em>drawing less</em>, is the practical route to saving energy: "race to idle".</li>
<li><strong>Which is why energy tracks time so closely.</strong> Because power is nearly constant, the energy column is essentially the seconds column times a constant. xz_s takes 3,5× longer than xalancbmk_s and uses 4,4× the energy; the ordering is identical.</li>
<li><strong>Why SPEC measures energy at all.</strong> Slide 7 made power the wall that ended the clock race; for data centres electricity is a dominant running cost, and cooling is a design constraint. Performance per watt is now as quoted a figure as performance. SPEC therefore publishes an energy metric alongside the speed metric.</li>
<li><strong>The cross-slide payoff.</strong> This table's Seconds column is the reference time in <code>Ratio = T<sub>ref</sub> / T<sub>SUT</sub></code>, so slide 29's 600.perlbench_s ratio of 4,96 is precisely 1774 ÷ 358. Two tables, one arithmetic relation — and checking it is how you know you have understood both slides rather than merely read them.</li>
</ul>
<p class="pitfall">⚠️ Note the caption: this is the <strong>reference machine, 1 thread</strong>. Do not compare these seconds with slide 29's seconds as if they were rival machines — slide 29 <em>is</em> the comparison, expressed as ratios. And do not confuse average with maximum power: energy is computed from the <strong>average</strong>.</p>`,
        `<p class="y-chinh">🎯 Chính MÁY THAM CHIẾU, được đem đo — và đo cả <strong>NĂNG LƯỢNG</strong>, không chỉ thời gian. Mười con số ở cột Seconds đây đúng là các giá trị <code>T<sub>ref</sub></code> dùng để tạo ra mọi tỉ số ở slide 29.</p>
<table>
<tr><th>Benchmark</th><th>Giây</th><th>Năng lượng (kJ)</th><th>Công suất TB (W)</th><th>Công suất cực đại (W)</th><th>Kiểm: giây × W ÷ 1000</th></tr>
<tr><td>600.perlbench_s</td><td>1774</td><td>1920</td><td>1080</td><td>1090</td><td>1916 ✓</td></tr>
<tr><td>602.gcc_s</td><td>3981</td><td>4330</td><td>1090</td><td>1110</td><td>4339 ✓</td></tr>
<tr><td>605.mcf_s</td><td>4721</td><td>5150</td><td>1090</td><td>1120</td><td>5146 ✓</td></tr>
<tr><td>620.omnetpp_s</td><td>1630</td><td>1770</td><td>1090</td><td>1090</td><td>1777 ✓</td></tr>
<tr><td>623.xalancbmk_s</td><td>1417</td><td>1540</td><td>1090</td><td>1090</td><td>1545 ✓</td></tr>
<tr><td>625.x264_s</td><td>1764</td><td>1920</td><td>1090</td><td>1100</td><td>1923 ✓</td></tr>
<tr><td>631.deepsjeng_s</td><td>1432</td><td>1560</td><td>1090</td><td>1130</td><td>1561 ✓</td></tr>
<tr><td>641.leela_s</td><td>1706</td><td>1850</td><td>1090</td><td>1090</td><td>1860 ✓</td></tr>
<tr><td>648.exchange2_s</td><td>2939</td><td>3200</td><td>1080</td><td>1090</td><td>3174 ✓</td></tr>
<tr><td>657.xz_s</td><td>6182</td><td>6730</td><td>1090</td><td>1140</td><td>6738 ✓</td></tr>
</table>
<ul>
<li><strong>Cột cuối là một PHÉP KIỂM, làm bằng tay.</strong> Năng lượng = công suất × thời gian, nên số kJ phải bằng số giây nhân công suất trung bình chia 1000. Mọi dòng đều khớp trong vòng 1% (chênh nhiều nhất là exchange2: tính ra 3174 so với 3200 đã công bố, tức 0,8%), đúng mức sai lệch do làm tròn cả cột công suất lẫn cột năng lượng. Bảng nhất quán nội tại.</li>
<li><strong>Bài giải mẫu.</strong> 657.xz_s: 6182 s ở 1090 W. Năng lượng = 6182 × 1090 = 6 738 380 J = 6738 kJ.</li>
</ul>
<p class="dap-an">✅ Đáp án: <strong>≈ 6738 kJ, còn bảng in 6730 kJ</strong> — khớp tới ba chữ số có nghĩa. Để ý ĐỘ LỚN của con số: 6,7 megajoule là khoảng 1,9 kWh cho MỘT lần chạy benchmark.</p>
<ul>
<li><strong>Cột nhiều thông tin nhất là Công suất trung bình, vì nó gần như KHÔNG nhúc nhích.</strong> Benchmark nào cũng rút 1080–1090 W trung bình, cực đại 1090–1140 W. Trên cỗ máy này, tải công việc gần như không đổi được mức tiêu thụ điện — công suất TĨNH của một máy chủ lớn (bộ nhớ, liên kết, quạt, lõi rảnh) áp đảo công suất ĐỘNG của việc CPU đang tính. Đó là lý do <em>XONG SỚM HƠN</em>, chứ không phải <em>RÚT ÍT ĐIỆN HƠN</em>, mới là con đường thực tế để tiết kiệm năng lượng: "chạy đua về trạng thái rảnh".</li>
<li><strong>Và vì thế năng lượng bám sát thời gian.</strong> Vì công suất gần như hằng số, cột năng lượng về căn bản là cột số giây nhân một hằng số. xz_s lâu gấp 3,5 lần xalancbmk_s và tốn gấp 4,4 lần năng lượng; thứ tự y hệt nhau.</li>
<li><strong>Vì sao SPEC lại đo năng lượng.</strong> Slide 7 đã đặt điện năng làm bức tường kết thúc cuộc đua xung nhịp; với trung tâm dữ liệu, tiền điện là khoản chi vận hành áp đảo, còn làm mát là một ràng buộc thiết kế. Hiệu năng trên mỗi watt nay được trích dẫn ngang với hiệu năng. Nên SPEC công bố một chỉ số năng lượng bên cạnh chỉ số speed.</li>
<li><strong>Phần thưởng khi đối chiếu chéo hai slide.</strong> Cột Seconds của bảng này chính là thời gian tham chiếu trong <code>Tỉ số = T<sub>ref</sub> / T<sub>SUT</sub></code>, nên tỉ số 4,96 của 600.perlbench_s ở slide 29 chính xác là 1774 ÷ 358. Hai bảng, một quan hệ số học — và việc kiểm nó là cách bạn biết mình đã HIỂU cả hai slide chứ không chỉ ĐỌC qua.</li>
</ul>
<p class="pitfall">⚠️ Để ý tiêu đề bảng: đây là <strong>MÁY THAM CHIẾU, 1 luồng</strong>. Đừng đem số giây ở đây so với số giây ở slide 29 như thể chúng là hai cỗ máy đối thủ — slide 29 CHÍNH LÀ phép so sánh đó, biểu diễn dưới dạng tỉ số. Và đừng lẫn công suất trung bình với cực đại: năng lượng tính từ giá trị <strong>TRUNG BÌNH</strong>.</p>`],

      [33, 'Summary — Chapter 2: Performance Concepts',
        `<p class="y-chinh">🎯 The chapter's own contents list, and then the eight formulas plus eight exam-style problems that turn it into marks. Everything below has been recomputed and checked.</p>
<table>
<tr><th>Section of the summary slide</th><th>Slides</th><th>The one thing to remember</th></tr>
<tr><td>Designing for performance</td><td>2</td><td>Cheaper hardware is always eaten by hungrier software</td></tr>
<tr><td>Microprocessor speed</td><td>3</td><td>Pipelining · branch prediction · superscalar · data flow analysis · speculative execution</td></tr>
<tr><td>Performance balance</td><td>4–5</td><td>Compensate for the mismatch between components; I/O rates span 10<sup>9</sup></td></tr>
<tr><td>Improvements in chip organization and architecture</td><td>6–8</td><td>Faster gates · bigger caches · parallelism — and the power/RC/memory walls</td></tr>
<tr><td>Multicore · MICs · GPGPUs</td><td>9–10</td><td>MIC = many identical general cores; GPU = vector (SIMD) lanes</td></tr>
<tr><td><strong>Amdahl's Law</strong></td><td>11–13</td><td>Speedup = 1 / ((1 − f) + f/k); ceiling = 1/(1 − f)</td></tr>
<tr><td><strong>Little's Law</strong></td><td>14</td><td>L = λ × W, in steady state with no leakage</td></tr>
<tr><td>Basic measures: clock speed, instruction execution rate</td><td>15–16</td><td>T = Ic × CPI × τ; MIPS = f/(CPI × 10<sup>6</sup>)</td></tr>
<tr><td>Calculating the mean: arithmetic, harmonic, geometric</td><td>17–22</td><td>Times → AM · rates → HM · normalized ratios → GM</td></tr>
<tr><td>Benchmark principles · SPEC benchmarks</td><td>23–32</td><td>Portable, representative, measurable, widespread; SPEC ends in a geometric mean</td></tr>
</table>
<pre>THE EIGHT FORMULAS
1  τ = 1 / f                                    clock cycle time
2  T = Ic × CPI × τ = Ic × [p + (m × k)] × τ    CPU execution time
3  CPI = Σ (CPIi × fraction of type i)          average cycles per instruction
4  MIPS = Ic / (T × 10⁶) = f / (CPI × 10⁶)
5  MFLOPS = (FP operations executed) / (T × 10⁶)
6  AM = Σxi / n   ·   GM = ⁿ√(Πxi)   ·   HM = n / Σ(1/xi)
7  Speedup = 1 / ((1 − f) + f/k)                Amdahl;  ceiling = 1/(1 − f)
8  L = λ × W                                    Little</pre>
<p class="nhan">📝 EIGHT PRACTICE PROBLEMS — worked solutions follow each one.</p>
<ul>
<li><strong>Problem 1 (CPI and execution time).</strong> A 2,0 GHz processor runs a program of 1,5 × 10<sup>9</sup> instructions with the mix: 45% at CPI 1, 25% at CPI 2, 20% at CPI 3, 10% at CPI 10. Find CPI, execution time and MIPS.<br>
<em>Solution.</em> CPI = 0,45×1 + 0,25×2 + 0,20×3 + 0,10×10 = 0,45 + 0,50 + 0,60 + 1,00 = <strong>2,55</strong>. τ = 1/(2,0 × 10<sup>9</sup>) = 0,5 ns. T = 1,5 × 10<sup>9</sup> × 2,55 × 0,5 × 10<sup>−9</sup> = <strong>1,9125 s</strong>. MIPS = f/(CPI × 10<sup>6</sup>) = 2,0 × 10<sup>9</sup>/(2,55 × 10<sup>6</sup>) = <strong>784,3</strong>.</li>
</ul>
<p class="dap-an">✅ CPI = 2,55 · T ≈ 1,91 s · MIPS ≈ 784. Notice the 10% of instructions at CPI 10 contribute 1,00 of 2,55 — 39% of all cycles.</p>
<ul>
<li><strong>Problem 2 (why MIPS misleads).</strong> Machine X executes a program in 5 × 10<sup>9</sup> instructions and 2,5 s. Machine Y, a different architecture, executes the same program in 2 × 10<sup>9</sup> instructions and 2,0 s. Which has the higher MIPS, and which is the better machine?<br>
<em>Solution.</em> MIPS(X) = 5 × 10<sup>9</sup>/(2,5 × 10<sup>6</sup>) = 2000. MIPS(Y) = 2 × 10<sup>9</sup>/(2,0 × 10<sup>6</sup>) = 1000.</li>
</ul>
<p class="dap-an">✅ X has twice the MIPS, Y is the better machine (2,0 s against 2,5 s). MIPS counts instructions, not work; across different instruction sets only execution time is valid.</p>
<ul>
<li><strong>Problem 3 (Amdahl, forward).</strong> 40% of a program's runtime is strictly sequential. What is the speedup on 4 processors, and what is the maximum possible speedup?<br>
<em>Solution.</em> f = 1 − 0,40 = 0,60. Speedup(4) = 1/((1 − 0,6) + 0,6/4) = 1/(0,4 + 0,15) = 1/0,55 = 1,8182. Ceiling = 1/(1 − 0,6) = 2,5.</li>
</ul>
<p class="dap-an">✅ ≈ 1,82× on four processors; ceiling 2,5×. Even infinite hardware cannot reach 2,5, and four processors already deliver 73% of that.</p>
<ul>
<li><strong>Problem 4 (Amdahl, reverse).</strong> You have 32 processors and need an 8× speedup. What fraction of the program must be parallelized?<br>
<em>Solution.</em> f = (1 − 1/S)/(1 − 1/k) = (1 − 1/8)/(1 − 1/32) = 0,875/0,96875 = 0,9032. Check: 1/((1 − 0,9032) + 0,9032/32) = 1/(0,0968 + 0,0282) = 1/0,1250 = 8,00 ✓</li>
</ul>
<p class="dap-an">✅ f ≈ 0,903 — just over 90% of the runtime must be parallel to get 8× out of 32 processors.</p>
<ul>
<li><strong>Problem 5 (generalized Amdahl on a component).</strong> A program spends 40% of its time waiting for main memory. A new cache makes memory access 4× faster. What is the overall speedup?<br>
<em>Solution.</em> Treat f = 0,40 as the improved fraction and k = 4 as its speedup. Speedup = 1/((1 − 0,4) + 0,4/4) = 1/(0,6 + 0,1) = 1/0,7 = 1,4286.</li>
</ul>
<p class="dap-an">✅ ≈ 1,43×, i.e. a 30% cut in runtime. A 4× faster memory bought only 1,43× overall — the generalized form of Amdahl's law, and the reason performance work always starts with a profile.</p>
<ul>
<li><strong>Problem 6 (harmonic mean of rates).</strong> A program runs three equal-sized phases at 30, 60 and 120 MFLOPS. What is the overall rate? What would the arithmetic mean have claimed?<br>
<em>Solution.</em> HM = 3/(1/30 + 1/60 + 1/120) = 3/(0,03333 + 0,01667 + 0,00833) = 3/0,058333 = 51,4286. AM = (30 + 60 + 120)/3 = 70.</li>
</ul>
<p class="dap-an">✅ The true rate is 51,43 MFLOPS (harmonic mean). The arithmetic mean's 70 MFLOPS is 36% too high — the slow phase dominates the running time, and only HM accounts for that.</p>
<ul>
<li><strong>Problem 7 (the AM-of-ratios trap).</strong> Two machines run two benchmarks. P takes 100 s and 10 s; Q takes 50 s and 40 s. Normalize to P, then to Q, and compute the AM and GM of the normalized times each way. Which machine is better?<br>
<em>Solution.</em> Normalized to P: P = (1,0 · 1,0) → AM 1,00, GM 1,00; Q = (50/100 · 40/10) = (0,5 · 4,0) → AM (0,5+4,0)/2 = 2,25, GM √2,0 = 1,414. Normalized to Q: P = (100/50 · 10/40) = (2,0 · 0,25) → AM 1,125, GM √0,5 = 0,707; Q → AM 1,00, GM 1,00.</li>
</ul>
<p class="dap-an">✅ The AM says <strong>P is better when normalized to P (1,00 vs 2,25) but Q is better when normalized to Q (1,00 vs 1,125)</strong> — the ranking flips with the baseline, exactly as in Table 2.3. The GM ranks P better both times (1,00 &lt; 1,414 and 0,707 &lt; 1,00) — consistent. But total time says Q (90 s) beats P (110 s). Complete answer: <strong>the AM of normalized values is unusable because it depends on the baseline; the GM is consistent but does not track total time; if you will actually run both benchmarks, compare total times and choose Q.</strong></p>
<ul>
<li><strong>Problem 8 (Little's law).</strong> A storage server sustains 250 I/O operations per second and each operation spends an average of 12 ms in the server. How many operations are in the server on average? If the concurrency limit is 8 operations, what is the maximum throughput at that same 12 ms latency?<br>
<em>Solution.</em> L = λW = 250 × 0,012 = 3,0. With L capped at 8: λ = L/W = 8/0,012 = 666,67 per second.</li>
</ul>
<p class="dap-an">✅ L = 3,0 operations on average; the 8-deep limit allows up to ≈ 667 operations per second at 12 ms. Always convert milliseconds to seconds before multiplying — that single step is where most marks are lost.</p>
<p class="meo">💡 Final revision plan: write the eight formulas from memory, then redo problems 3, 4, 6 and 7 without looking. Those four cover Amdahl forward, Amdahl reverse, the wrong-mean trap for rates, and the baseline trap for ratios — the four places this chapter is actually examined.</p>`,
        `<p class="y-chinh">🎯 Mục lục của chính chương, rồi tám công thức cộng tám bài luyện dạng đề thi biến nó thành điểm số. Mọi thứ bên dưới đều đã được tính lại và kiểm chứng.</p>
<table>
<tr><th>Mục trên slide tổng kết</th><th>Slide</th><th>Điều duy nhất phải nhớ</th></tr>
<tr><td>Thiết kế vì hiệu năng</td><td>2</td><td>Phần cứng rẻ đi luôn bị phần mềm đói hơn ăn hết</td></tr>
<tr><td>Tốc độ vi xử lý</td><td>3</td><td>Pipeline · dự đoán rẽ nhánh · superscalar · phân tích luồng dữ liệu · thi hành tiên đoán</td></tr>
<tr><td>Cân bằng hiệu năng</td><td>4–5</td><td>Bù cho lệch pha giữa các thành phần; tốc độ I/O trải rộng 10<sup>9</sup></td></tr>
<tr><td>Cải tiến tổ chức và kiến trúc chip</td><td>6–8</td><td>Cổng nhanh hơn · cache lớn hơn · song song hoá — và ba bức tường điện năng/RC/bộ nhớ</td></tr>
<tr><td>Đa lõi · MIC · GPGPU</td><td>9–10</td><td>MIC = nhiều lõi đa dụng giống nhau; GPU = các làn vector (SIMD)</td></tr>
<tr><td><strong>Định luật Amdahl</strong></td><td>11–13</td><td>Tăng tốc = 1 / ((1 − f) + f/k); trần = 1/(1 − f)</td></tr>
<tr><td><strong>Định luật Little</strong></td><td>14</td><td>L = λ × W, ở trạng thái dừng và không rò rỉ</td></tr>
<tr><td>Thước đo cơ bản: xung nhịp, tốc độ thi hành lệnh</td><td>15–16</td><td>T = Ic × CPI × τ; MIPS = f/(CPI × 10<sup>6</sup>)</td></tr>
<tr><td>Tính trung bình: số học, điều hoà, hình học</td><td>17–22</td><td>Thời gian → AM · tốc độ → HM · tỉ số chuẩn hoá → GM</td></tr>
<tr><td>Nguyên tắc benchmark · benchmark SPEC</td><td>23–32</td><td>Khả chuyển, đại diện, đo được, phổ biến; SPEC kết bằng trung bình hình học</td></tr>
</table>
<pre>TÁM CÔNG THỨC
1  τ = 1 / f                                    chu kỳ xung nhịp
2  T = Ic × CPI × τ = Ic × [p + (m × k)] × τ    thời gian thi hành CPU
3  CPI = Σ (CPIᵢ × tỉ lệ lệnh loại i)           số chu kỳ trung bình mỗi lệnh
4  MIPS = Ic / (T × 10⁶) = f / (CPI × 10⁶)
5  MFLOPS = (số phép FP đã thi hành) / (T × 10⁶)
6  AM = Σxᵢ / n   ·   GM = ⁿ√(Πxᵢ)   ·   HM = n / Σ(1/xᵢ)
7  Tăng tốc = 1 / ((1 − f) + f/k)               Amdahl;  trần = 1/(1 − f)
8  L = λ × W                                    Little</pre>
<p class="nhan">📝 TÁM BÀI LUYỆN — mỗi bài có lời giải từng bước ngay sau đề.</p>
<ul>
<li><strong>Bài 1 (CPI và thời gian thi hành).</strong> Một bộ xử lý 2,0 GHz chạy chương trình 1,5 × 10<sup>9</sup> lệnh với tỉ lệ: 45% CPI 1, 25% CPI 2, 20% CPI 3, 10% CPI 10. Tìm CPI, thời gian thi hành và MIPS.<br>
<em>Lời giải.</em> CPI = 0,45×1 + 0,25×2 + 0,20×3 + 0,10×10 = 0,45 + 0,50 + 0,60 + 1,00 = <strong>2,55</strong>. τ = 1/(2,0 × 10<sup>9</sup>) = 0,5 ns. T = 1,5 × 10<sup>9</sup> × 2,55 × 0,5 × 10<sup>−9</sup> = <strong>1,9125 s</strong>. MIPS = f/(CPI × 10<sup>6</sup>) = 2,0 × 10<sup>9</sup>/(2,55 × 10<sup>6</sup>) = <strong>784,3</strong>.</li>
</ul>
<p class="dap-an">✅ CPI = 2,55 · T ≈ 1,91 s · MIPS ≈ 784. Để ý 10% số lệnh có CPI 10 đóng góp 1,00 trong tổng 2,55 — tức 39% toàn bộ chu kỳ.</p>
<ul>
<li><strong>Bài 2 (vì sao MIPS đánh lừa).</strong> Máy X chạy một chương trình hết 5 × 10<sup>9</sup> lệnh và 2,5 s. Máy Y, kiến trúc khác, chạy đúng chương trình đó hết 2 × 10<sup>9</sup> lệnh và 2,0 s. Máy nào MIPS cao hơn, và máy nào TỐT HƠN?<br>
<em>Lời giải.</em> MIPS(X) = 5 × 10<sup>9</sup>/(2,5 × 10<sup>6</sup>) = 2000. MIPS(Y) = 2 × 10<sup>9</sup>/(2,0 × 10<sup>6</sup>) = 1000.</li>
</ul>
<p class="dap-an">✅ X có MIPS gấp đôi, nhưng Y mới là máy tốt hơn (2,0 s so với 2,5 s). MIPS đếm LỆNH chứ không đếm CÔNG VIỆC; so qua hai tập lệnh khác nhau thì chỉ thời gian thi hành mới hợp lệ.</p>
<ul>
<li><strong>Bài 3 (Amdahl, chiều thuận).</strong> 40% thời gian chạy của một chương trình là thuần tuần tự. Tăng tốc trên 4 bộ xử lý là bao nhiêu, và tăng tốc tối đa là bao nhiêu?<br>
<em>Lời giải.</em> f = 1 − 0,40 = 0,60. Tăng tốc(4) = 1/((1 − 0,6) + 0,6/4) = 1/(0,4 + 0,15) = 1/0,55 = 1,8182. Trần = 1/(1 − 0,6) = 2,5.</li>
</ul>
<p class="dap-an">✅ ≈ 1,82 lần trên bốn bộ xử lý; trần 2,5 lần. Phần cứng vô hạn cũng không chạm tới 2,5, mà bốn bộ xử lý đã lấy được 73% của cái trần đó rồi.</p>
<ul>
<li><strong>Bài 4 (Amdahl, chiều ngược).</strong> Bạn có 32 bộ xử lý và cần tăng tốc 8 lần. Phải song song hoá bao nhiêu phần trăm chương trình?<br>
<em>Lời giải.</em> f = (1 − 1/S)/(1 − 1/k) = (1 − 1/8)/(1 − 1/32) = 0,875/0,96875 = 0,9032. Thử lại: 1/((1 − 0,9032) + 0,9032/32) = 1/(0,0968 + 0,0282) = 1/0,1250 = 8,00 ✓</li>
</ul>
<p class="dap-an">✅ f ≈ 0,903 — phải song song hoá hơn 90% thời gian chạy mới lấy được 8 lần từ 32 bộ xử lý.</p>
<ul>
<li><strong>Bài 5 (Amdahl tổng quát áp cho một thành phần).</strong> Một chương trình dành 40% thời gian chờ bộ nhớ chính. Một cache mới làm truy cập bộ nhớ nhanh gấp 4 lần. Tăng tốc toàn cục là bao nhiêu?<br>
<em>Lời giải.</em> Coi f = 0,40 là phần được cải tiến và k = 4 là mức tăng tốc của nó. Tăng tốc = 1/((1 − 0,4) + 0,4/4) = 1/(0,6 + 0,1) = 1/0,7 = 1,4286.</li>
</ul>
<p class="dap-an">✅ ≈ 1,43 lần, tức rút được 30% thời gian chạy. Bộ nhớ nhanh gấp 4 chỉ mua được 1,43 lần toàn cục — đúng dạng tổng quát của định luật Amdahl, và là lý do mọi việc tối ưu hiệu năng đều bắt đầu bằng một bản đo phân bố thời gian.</p>
<ul>
<li><strong>Bài 6 (trung bình điều hoà của tốc độ).</strong> Một chương trình chạy ba giai đoạn khối lượng bằng nhau ở 30, 60 và 120 MFLOPS. Tốc độ toàn cục là bao nhiêu? Trung bình số học sẽ khai bao nhiêu?<br>
<em>Lời giải.</em> HM = 3/(1/30 + 1/60 + 1/120) = 3/(0,03333 + 0,01667 + 0,00833) = 3/0,058333 = 51,4286. AM = (30 + 60 + 120)/3 = 70.</li>
</ul>
<p class="dap-an">✅ Tốc độ thật là 51,43 MFLOPS (trung bình điều hoà). Con số 70 MFLOPS của trung bình số học cao hơn 36% — giai đoạn CHẬM mới chi phối thời gian chạy, và chỉ HM mới tính tới điều đó.</p>
<ul>
<li><strong>Bài 7 (bẫy lấy trung bình số học của tỉ số).</strong> Hai máy chạy hai benchmark. P mất 100 s và 10 s; Q mất 50 s và 40 s. Chuẩn hoá theo P, rồi theo Q, và tính AM cùng GM của thời gian chuẩn hoá theo cả hai cách. Máy nào tốt hơn?<br>
<em>Lời giải.</em> Chuẩn hoá theo P: P = (1,0 · 1,0) → AM 1,00, GM 1,00; Q = (50/100 · 40/10) = (0,5 · 4,0) → AM (0,5+4,0)/2 = 2,25, GM √2,0 = 1,414. Chuẩn hoá theo Q: P = (100/50 · 10/40) = (2,0 · 0,25) → AM 1,125, GM √0,5 = 0,707; Q → AM 1,00, GM 1,00.</li>
</ul>
<p class="dap-an">✅ AM nói <strong>P tốt hơn khi chuẩn hoá theo P (1,00 so với 2,25) nhưng Q tốt hơn khi chuẩn hoá theo Q (1,00 so với 1,125)</strong> — thứ hạng LẬT theo mốc, đúng như Table 2.3. GM xếp P tốt hơn ở cả hai lần (1,00 &lt; 1,414 và 0,707 &lt; 1,00) — nhất quán. Nhưng TỔNG THỜI GIAN nói Q (90 s) thắng P (110 s). Câu trả lời đầy đủ: <strong>AM của giá trị chuẩn hoá không dùng được vì nó phụ thuộc mốc; GM nhất quán nhưng không bám tổng thời gian; nếu bạn thật sự sẽ chạy cả hai benchmark thì hãy so tổng thời gian và chọn Q.</strong></p>
<ul>
<li><strong>Bài 8 (định luật Little).</strong> Một máy chủ lưu trữ gánh 250 thao tác I/O mỗi giây, mỗi thao tác ở trong máy chủ trung bình 12 ms. Trung bình có bao nhiêu thao tác đang nằm trong máy chủ? Nếu giới hạn song song là 8 thao tác thì thông lượng tối đa ở cùng độ trễ 12 ms là bao nhiêu?<br>
<em>Lời giải.</em> L = λW = 250 × 0,012 = 3,0. Với L bị chặn ở 8: λ = L/W = 8/0,012 = 666,67 mỗi giây.</li>
</ul>
<p class="dap-an">✅ L = 3,0 thao tác trung bình; giới hạn 8 cho phép tới ≈ 667 thao tác mỗi giây ở mức 12 ms. Luôn đổi mili giây sang giây TRƯỚC khi nhân — đúng một bước đó là nơi mất điểm nhiều nhất.</p>
<p class="meo">💡 Kế hoạch ôn cuối: viết tám công thức từ trí nhớ, rồi làm lại bài 3, 4, 6 và 7 mà không nhìn. Bốn bài đó phủ Amdahl chiều thuận, Amdahl chiều ngược, bẫy chọn sai phép trung bình cho tốc độ, và bẫy đổi mốc cho tỉ số — đúng bốn chỗ mà chương này thật sự bị đem ra thi.</p>`],
    ]),
  ].join('\n'),
};
