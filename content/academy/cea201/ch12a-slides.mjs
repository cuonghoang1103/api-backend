/**
 * CEA201 · Chương 12 trên web (deck 'cea16' = Ch.16 bản 11e) — Processor
 * Structure and Function, học theo từng slide, PHẦN A: slide 1–28.
 *
 * ⚠️ BA CÁCH ĐÁNH SỐ CHO CÙNG MỘT CHƯƠNG — nhớ kỹ kẻo tìm nhầm tài liệu:
 *   · Bộ slide gốc (Stallings 11th ed Global Edition): **Chapter 16**.
 *   · Syllabus của trường (soạn theo bản 9th ed): **Chapter 14**.
 *   · Trên web Academy này: **Chương 12 — Processor Structure & Function**.
 * Vì thế file tên ch12a nhưng ảnh slide nằm ở deck cea16.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH16-COA11e.pptx (/tmp/cea201-text/cea16.txt).
 * Những slide bản trích chỉ trả về TIÊU ĐỀ (vì thân slide là SmartArt hoặc
 * hình vẽ) đã được ĐỌC THẲNG TỪ ẢNH render để lấy đúng từng nhãn:
 *   3, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25,
 *   26, 27 — tức 21/28 slide của phần này.
 *
 * ⚠️ MỌI con số pipeline trong bài đã KIỂM BẰNG python3 TRƯỚC khi viết
 * (script mô phỏng đường ống, không phải thay số vào công thức):
 *   · Mô phỏng k tầng × n lệnh rồi ĐẾM chu kỳ, đối chiếu với (k + n − 1):
 *     khớp với MỌI n ≤ 39 và k ≤ 24.
 *   · S = nk/(k+n−1): (n=9,k=6)→3,857 · (n=30,k=6)→5,143 · (n=100,k=6)→5,714 ·
 *     (n=20,k=9)→6,429 · (n=128,k=12)→11,050 · (n=1000,k=6)→5,970.
 *   · Bài ngược S = 0,9k ⇒ n = 9(k−1): k=6→45, k=9→72, k=12→99, k=20→171.
 *     Kiểm lại: S(45,6) = 5,4 = 0,9×6 đúng.
 *   · ĐỐI CHIẾU CHÉO với chính đồ thị Figure 16.14 (slide 24):
 *     (a) tại n=128 → k=6:5,77 · k=9:8,47 · k=12:11,05 — khớp ba đường trên hình.
 *     (b) tại k=20 → n=10:6,90 · n=20:10,26 · n=30:12,24 — khớp ba đường.
 *   · Mô phỏng lại Figure 16.11 (I3 rẽ nhánh tới I15): máy in ra ĐÚNG bức hình
 *     — I4..I7 cụt ở chu kỳ 7, I15 FI ở 8, I16 WO ở 14, 5 lệnh xong thay vì 9,
 *     mất 4 khe. Phạt rẽ nhánh = k − 2 với quy ước "EI là tầng k−1" của hình:
 *     k=6→4 chu kỳ, k=12→10, k=20→18.
 *   · Mô phỏng lại Figure 16.15(b) (bọt 1 chu kỳ) và Figure 16.16 (bọt 2 chu
 *     kỳ) — in ra khớp từng ô với ảnh slide.
 *
 * Chỗ slide gốc LẶP/LỆCH/SAI CHÍNH TẢ — nêu rõ, không im lặng chép, không tự sửa:
 *   · slide 4: bản trích .pptx trả các dòng SAI THỨ TỰ (câu "Enable the
 *     machine…" và "Used by the control unit…" nhảy lên trước hai cái nhãn cột).
 *     Ảnh render cho thấy bố cục thật là 2 gạch đầu dòng rồi 2 cột.
 *   · slide 8: slide liệt kê BẢY trường PSW (Sign, Zero, Carry, Equal,
 *     Overflow, Interrupt Enable/Disable, Supervisor) — KHÔNG phải bộ bốn cờ
 *     N/Z/C/V mà nhiều đề thi quen dùng. Bài này nêu cả hai cách gọi.
 *   · slide 9: Figure 16.2(a) ghi "A7´" (dấu phẩy trên = thanh ghi SP thứ hai
 *     cho chế độ supervisor); Figure 16.2(b) ghi "Extrat" — LỖI CHÍNH TẢ của
 *     slide, đúng phải là "Extra" (thanh ghi đoạn ES).
 *   · slide 26: ảnh slide ghi nhãn trục "Instrutcion" (hai lần) — lỗi chính tả
 *     của chính Figure 16.15, không phải lỗi render.
 *   · MÂU THUẪN GIỮA CÁC HÌNH: Figure 16.10 / 16.11 / 16.12 / 16.13 dùng
 *     SÁU tầng (FI DI CO FO EI WO), còn Figure 16.15 / 16.16 dùng NĂM tầng
 *     (FI DI FO EI WO — bỏ CO). Cùng một chương, hai bộ tầng. Đã nói thẳng ở
 *     slide 26 thay vì để người học tự vấp.
 *   · Công thức tăng tốc S = nk/(k+n−1) KHÔNG in trên slide nào — slide 24 chỉ
 *     vẽ ĐỒ THỊ của nó (Figure 16.14). Công thức lấy từ sách, mục 16.4.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea16';

export default {
  title: '12.0a — Slide by slide: Processor organisation, registers and the instruction pipeline (slides 1–28)|||12.0a — Slide bài giảng: Tổ chức bộ xử lý, thanh ghi & pipeline lệnh (slide 1–28)',
  slug: 'cea201-12-0a-slides-to-chuc-cpu-thanh-ghi-pipeline',
  type: 'DOCUMENT',
  description: 'Nửa đầu chương "Cấu trúc & hoạt động của bộ xử lý" (28/56 slide) — chương mở nắp CPU ra xem bên trong. Đi từ năm việc bộ xử lý phải làm và sơ đồ khối bên trong CPU, qua TỔ CHỨC THANH GHI (thanh ghi người dùng thấy được so với thanh ghi điều khiển/trạng thái, PC · IR · MAR · MBR, từ trạng thái chương trình PSW và các cờ), tới CHU TRÌNH LỆNH ở mức chi tiết (thêm vòng gián tiếp, sơ đồ trạng thái 10 nút, ba sơ đồ luồng dữ liệu nạp/gián tiếp/ngắt), rồi kết bằng phần nặng điểm nhất: PIPELINE LỆNH sáu tầng FI-DI-CO-FO-EI-WO, giản đồ thời gian, phạt rẽ nhánh, công thức tăng tốc S = nk/(k+n−1) và ba loại xung đột. Mọi giản đồ và mọi con số tăng tốc trong bài đều được mô phỏng lại bằng python3 rồi đối chiếu với chính hình vẽ của sách.',
  content: [
    walkHead(D, 1, 28),
    walk(D, [

      [1, 'Chapter 16 — Processor Structure and Function (title slide)',
        `<p class="y-chinh">🎯 The opening slide of the chapter that finally <strong>opens the CPU box</strong>. Chapters 3 and 10–11 treated the processor as a thing that "executes instructions"; from here on you see what is inside it — the registers, the internal bus, the data paths, and the assembly line that lets it work on six instructions at once.</p>
<ul>
<li><strong>Three numbers for one chapter — do not get lost.</strong> The Pearson deck calls it <strong>Chapter 16</strong>. Your school syllabus, written against the 9th edition, calls it <strong>Chapter 14</strong>. This website calls it <strong>Chương 12</strong>. Same content, three labels. When you search the textbook PDF, search for the figure number (Figure 16.10) — figure numbers are unambiguous.</li>
<li><strong>What this half (slides 1–28) covers.</strong> Processor organisation (slides 2–3) → register organisation (4–9) → the instruction cycle in detail (10–15) → instruction pipelining (16–24) → pipeline hazards (25–28). The second half (slides 29–56) covers dealing with branches, the Intel 80486 pipeline, x86 registers and interrupts, and the ARM processor.</li>
<li><strong>This chapter is the zoomed-in version of Chapter 3.</strong> Chapter 3 gave you "fetch, then execute, then check for interrupts" as three boxes. Here the same loop grows an <em>indirect cycle</em>, a ten-state diagram, and three separate data-flow drawings showing which register feeds which bus in each cycle.</li>
<li><strong>Where the exam marks are, honestly.</strong> Roughly: 20% on naming registers (PC / IR / MAR / MBR and what each holds), 20% on the instruction cycle and data flow, and <strong>60% on pipelining</strong> — timing diagrams, branch penalty, and the speedup formula. If your study time is short, spend it on slides 19–28.</li>
<li><strong>One warning before you start.</strong> The speedup formula that every exam asks for is <em>not printed on any slide in this deck</em>. Slide 24 only shows its graph. This walkthrough writes the formula out, works five problems with it, and cross-checks the answers against the points on that graph.</li>
</ul>
<p class="meo">💡 Hold one picture for the whole chapter: <strong>a car factory assembly line</strong>. The first half of the chapter builds one workstation very carefully (registers, data paths, one instruction at a time). The second half puts six workstations in a row and asks what happens when one worker has to wait for another. Every hazard, every stall, every branch flush is a factory-floor problem.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu của chương cuối cùng cũng <strong>MỞ NẮP CPU RA</strong>. Chương 3 và Chương 10–11 coi bộ xử lý như một cái hộp "thực thi lệnh"; từ đây bạn nhìn thấy bên trong nó — các thanh ghi, bus nội bộ, các đường dữ liệu, và cái dây chuyền lắp ráp cho phép nó làm việc trên SÁU lệnh cùng lúc.</p>
<ul>
<li><strong>Một chương, BA cách đánh số — đừng lạc.</strong> Bộ slide Pearson gọi là <strong>Chapter 16</strong>. Syllabus của trường, viết theo bản 9th ed, gọi là <strong>Chapter 14</strong>. Web này gọi là <strong>Chương 12</strong>. Cùng một nội dung, ba cái nhãn. Khi tra file PDF giáo trình, hãy tìm theo SỐ HÌNH (Figure 16.10) — số hình thì không nhập nhằng.</li>
<li><strong>Nửa này (slide 1–28) gồm gì.</strong> Tổ chức bộ xử lý (slide 2–3) → tổ chức thanh ghi (4–9) → chu trình lệnh ở mức chi tiết (10–15) → pipeline lệnh (16–24) → xung đột pipeline (25–28). Nửa sau (slide 29–56) nói về cách đối phó rẽ nhánh, pipeline của Intel 80486, thanh ghi x86, xử lý ngắt, và bộ xử lý ARM.</li>
<li><strong>Chương này là bản PHÓNG TO của Chương 3.</strong> Chương 3 cho bạn "nạp, rồi thực thi, rồi kiểm tra ngắt" dưới dạng ba cái hộp. Ở đây chính vòng lặp đó mọc thêm một <em>vòng gián tiếp</em>, một sơ đồ trạng thái mười nút, và ba bức vẽ luồng dữ liệu riêng cho thấy thanh ghi nào đẩy ra bus nào trong từng vòng.</li>
<li><strong>Điểm thi nằm ở đâu, nói thật.</strong> Đại khái: 20% ở việc gọi tên thanh ghi (PC / IR / MAR / MBR và mỗi cái chứa gì), 20% ở chu trình lệnh và luồng dữ liệu, và <strong>60% ở PIPELINE</strong> — giản đồ thời gian, phạt rẽ nhánh, công thức tăng tốc. Nếu quỹ thời gian ôn ngắn, hãy dồn vào slide 19–28.</li>
<li><strong>Một cảnh báo trước khi bắt đầu.</strong> Cái công thức tăng tốc mà đề thi nào cũng hỏi <em>KHÔNG được in trên bất kỳ slide nào của deck này</em>. Slide 24 chỉ vẽ ĐỒ THỊ của nó. Bài này viết đủ công thức, giải năm bài bằng nó, và đối chiếu đáp án ngược lại với chính các điểm trên đồ thị đó.</li>
</ul>
<p class="meo">💡 Giữ một hình ảnh cho cả chương: <strong>dây chuyền lắp ráp ô tô</strong>. Nửa đầu chương dựng thật kỹ MỘT trạm làm việc (thanh ghi, đường dữ liệu, mỗi lần một lệnh). Nửa sau đặt sáu trạm nối đuôi nhau rồi hỏi: chuyện gì xảy ra khi một thợ phải chờ thợ khác? Mọi xung đột, mọi lần khựng, mọi lần xả đường ống đều là bài toán của sàn nhà máy.</p>`],

      [2, 'Processor Organization — the five things a processor must do',
        `<p class="y-chinh">🎯 The chapter starts from requirements, not from circuits. A processor must do exactly <strong>five</strong> things, and the fifth line of the slide draws the consequence: to do them it "needs to store some data temporarily and therefore needs a <strong>small internal memory</strong>" — that internal memory is the register file, which is what slides 4–9 are about.</p>
<table>
<tr><th>Requirement (the slide's words)</th><th>What actually happens</th><th>Which register does it</th></tr>
<tr><td><strong>Fetch instruction</strong> — the processor reads an instruction from memory (register, cache, main memory)</td><td>An address goes out, a word comes back</td><td>PC → MAR, then MBR → IR</td></tr>
<tr><td><strong>Interpret instruction</strong> — the instruction is decoded to determine what action is required</td><td>Opcode and operand fields are split apart</td><td>IR, read by the control unit</td></tr>
<tr><td><strong>Fetch data</strong> — execution may require reading data from memory or an I/O module</td><td>An operand address goes out, a datum comes back</td><td>MAR → MBR</td></tr>
<tr><td><strong>Process data</strong> — execution may require performing some arithmetic or logical operation on data</td><td>The ALU computes, and sets the status flags</td><td>General registers + condition codes</td></tr>
<tr><td><strong>Write data</strong> — results may require writing to memory or an I/O module</td><td>An address and a datum go out together</td><td>MAR + MBR</td></tr>
</table>
<ul>
<li><strong>Notice that three of the five are memory traffic.</strong> Fetch instruction, fetch data, write data — the processor spends most of its life moving words in and out. That is exactly why Chapter 4/5 (cache) exists, and why the pipeline in the second half of this chapter has <em>three separate memory-touching stages</em> (FI, FO, WO) out of six.</li>
<li><strong>"Register, cache, main memory" in the first bullet is not padding.</strong> The slide is reminding you that "memory" here means the whole hierarchy of Chapter 4 — the processor asks for an address and does not care which level answers. The cache is transparent to the instruction set.</li>
<li><strong>Why a small internal memory is unavoidable.</strong> Between reading an operand and using it, the value has to live somewhere. It cannot live in main memory (too slow, and you would need another memory access to find it). So the processor keeps a handful of very fast storage cells on the same die — registers. Their smallness is the price of their speed.</li>
<li><strong>Connect back to Chương 10 (instruction sets).</strong> Those five requirements are what an instruction <em>means</em>. An instruction like <code>ADD R1, [2000]</code> triggers requirement 1 (fetch it), 2 (decode it), 3 (fetch the word at 2000), 4 (add) — and a store instruction adds requirement 5.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: "Fetch data" and "Fetch instruction" are <em>two different requirements</em> even though both are memory reads. The processor knows which is which — that is why real machines can have a split instruction cache and data cache (Chương 4). A question that merges them into "memory access" is missing the point of the six-stage pipeline.</p>`,
        `<p class="y-chinh">🎯 Chương mở đầu bằng YÊU CẦU, chứ không bằng mạch điện. Bộ xử lý phải làm đúng <strong>NĂM</strong> việc, và dòng cuối của slide rút ra hệ quả: để làm được, nó "cần lưu tạm một ít dữ liệu và do đó cần một <strong>bộ nhớ trong nhỏ</strong>" — bộ nhớ trong đó chính là tệp thanh ghi, tức nội dung của slide 4–9.</p>
<table>
<tr><th>Yêu cầu (nguyên văn slide)</th><th>Thực tế xảy ra gì</th><th>Thanh ghi nào làm</th></tr>
<tr><td><strong>Nạp lệnh</strong> — bộ xử lý đọc một lệnh từ bộ nhớ (thanh ghi, cache, bộ nhớ chính)</td><td>Một địa chỉ đi ra, một từ đi về</td><td>PC → MAR, rồi MBR → IR</td></tr>
<tr><td><strong>Diễn giải lệnh</strong> — lệnh được giải mã để xác định cần làm hành động gì</td><td>Tách mã thao tác và các trường toán hạng</td><td>IR, do khối điều khiển đọc</td></tr>
<tr><td><strong>Nạp dữ liệu</strong> — việc thực thi có thể cần đọc dữ liệu từ bộ nhớ hoặc mô-đun vào/ra</td><td>Một địa chỉ toán hạng đi ra, một dữ liệu đi về</td><td>MAR → MBR</td></tr>
<tr><td><strong>Xử lý dữ liệu</strong> — việc thực thi có thể cần thực hiện phép số học hoặc logic trên dữ liệu</td><td>ALU tính, và ĐẶT các cờ trạng thái</td><td>Thanh ghi đa dụng + mã điều kiện</td></tr>
<tr><td><strong>Ghi dữ liệu</strong> — kết quả có thể cần ghi ra bộ nhớ hoặc mô-đun vào/ra</td><td>Một địa chỉ và một dữ liệu cùng đi ra</td><td>MAR + MBR</td></tr>
</table>
<ul>
<li><strong>Để ý BA trong NĂM việc là giao dịch với bộ nhớ.</strong> Nạp lệnh, nạp dữ liệu, ghi dữ liệu — bộ xử lý dành phần lớn đời nó để chuyển các từ ra vào. Đó chính xác là lý do Chương 4/5 (cache) tồn tại, và lý do cái pipeline ở nửa sau chương này có <em>BA tầng đụng bộ nhớ</em> (FI, FO, WO) trên tổng số sáu.</li>
<li><strong>Cụm "thanh ghi, cache, bộ nhớ chính" ở gạch đầu dòng đầu KHÔNG phải chữ thừa.</strong> Slide nhắc bạn rằng "bộ nhớ" ở đây nghĩa là cả cái phân cấp của Chương 4 — bộ xử lý hỏi một địa chỉ và KHÔNG quan tâm mức nào trả lời. Cache trong suốt với tập lệnh.</li>
<li><strong>Vì sao bắt buộc phải có bộ nhớ trong nhỏ.</strong> Giữa lúc đọc được toán hạng và lúc dùng nó, giá trị phải nằm ở đâu đó. Nó không thể nằm trong bộ nhớ chính (quá chậm, mà lại phải thêm một lần truy cập nữa để tìm lại). Nên bộ xử lý giữ vài ô nhớ cực nhanh ngay trên cùng miếng silicon — các thanh ghi. Sự NHỎ BÉ của chúng là cái giá của tốc độ.</li>
<li><strong>Nối ngược về Chương 10 (tập lệnh).</strong> Năm yêu cầu đó chính là Ý NGHĨA của một lệnh. Một lệnh như <code>ADD R1, [2000]</code> kích hoạt yêu cầu 1 (nạp nó), 2 (giải mã), 3 (nạp từ ở ô 2000), 4 (cộng) — và một lệnh ghi thì thêm yêu cầu 5.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: "Nạp dữ liệu" và "Nạp lệnh" là <em>HAI yêu cầu khác nhau</em> dù cả hai đều là đọc bộ nhớ. Bộ xử lý biết cái nào là cái nào — đó là lý do máy thật có thể tách cache lệnh và cache dữ liệu (Chương 4). Câu nào gộp chúng thành "truy cập bộ nhớ" là đã bỏ mất cái tinh thần của pipeline sáu tầng.</p>`],

      [3, 'Figure 16.1 — Internal Structure of the CPU',
        `<p class="y-chinh">🎯 The block diagram of everything inside the processor. Four blocks and one wire: the <strong>ALU</strong> (containing Status Flags, Shifter, Complementer, and Arithmetic and Boolean Logic), the <strong>Registers</strong>, the <strong>Control Unit</strong>, and the <strong>Internal CPU Bus</strong> that connects all three. The thick grey arrows labelled <strong>Control Paths</strong> are not data — they are the control unit's commands.</p>
<table>
<tr><th>Block on the figure</th><th>What it does</th><th>Where you met it</th></tr>
<tr><td><strong>Arithmetic and Boolean Logic</strong></td><td>Adds, subtracts, ANDs, ORs — the actual computation</td><td>Chương 9 (adder circuits), Chương 11 (arithmetic)</td></tr>
<tr><td><strong>Shifter</strong></td><td>Shifts/rotates bits left or right — needed for multiply, divide, field extraction</td><td>Chương 10 (shift instructions)</td></tr>
<tr><td><strong>Complementer</strong></td><td>Produces the one's complement, so subtraction can reuse the adder</td><td>Chương 11 (two's complement)</td></tr>
<tr><td><strong>Status Flags</strong></td><td>Bits set as a side effect of every ALU operation — Z, N, C, V</td><td>Slide 8 (PSW), Chương 10 (conditional branch)</td></tr>
<tr><td><strong>Registers</strong></td><td>The small internal memory of slide 2</td><td>Slides 4–9</td></tr>
<tr><td><strong>Control Unit</strong></td><td>Reads the opcode and drives every gate at the right moment</td><td>Ch.19 of the book (not in this course)</td></tr>
<tr><td><strong>Internal CPU Bus</strong></td><td>The single shared road between ALU, registers and control unit</td><td>Chương 3 (external bus — same idea, inside)</td></tr>
</table>
<ul>
<li><strong>Read the arrow directions carefully — that is the whole exam question.</strong> Between the ALU parts and the internal bus, arrows are <em>double-headed</em> (data flows both ways). Between the control unit and everything else, the grey arrows are <em>control</em>. The control unit never touches data; it only says "now".</li>
<li><strong>Status Flags sit INSIDE the ALU box.</strong> This is the detail students miss. The flags are not a separate register that software writes — they are produced by the ALU as an unavoidable side effect of the computation. Slide 8 then groups them into the PSW, and Chương 10's <code>JZ</code> / <code>JNC</code> instructions read them.</li>
<li><strong>Why the internal bus is drawn as one tall bar.</strong> It is a <em>shared</em> path: only one transfer at a time. That single-owner property is the hardware root of the <strong>resource hazard</strong> of slide 26 — two pipeline stages both wanting the bus in the same cycle, and one must wait.</li>
<li><strong>The Complementer is there for a beautiful reason.</strong> You do not build a subtractor. You complement the second operand, add 1 via the carry-in, and reuse the adder. One block of hardware, two instructions. Chương 11 proves why two's complement makes this work.</li>
</ul>
<p class="meo">💡 Remembering the figure: <strong>ALU on the left, registers on the right, control unit bottom-right, bus down the middle.</strong> Data goes left-right along the bus; control comes up from the bottom. If you can redraw those four boxes and label the bus, you have the marks.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ khối của mọi thứ bên trong bộ xử lý. Bốn khối và một sợi dây: <strong>ALU</strong> (chứa Status Flags, Shifter, Complementer, và Arithmetic and Boolean Logic), các <strong>Registers</strong>, <strong>Control Unit</strong>, và <strong>Internal CPU Bus</strong> nối cả ba. Những mũi tên xám dày ghi <strong>Control Paths</strong> KHÔNG phải dữ liệu — chúng là lệnh điều khiển của khối điều khiển.</p>
<table>
<tr><th>Khối trên hình</th><th>Nó làm gì</th><th>Bạn gặp nó ở đâu</th></tr>
<tr><td><strong>Arithmetic and Boolean Logic</strong></td><td>Cộng, trừ, AND, OR — phần tính toán thật sự</td><td>Chương 9 (mạch cộng), Chương 11 (số học)</td></tr>
<tr><td><strong>Shifter</strong> (bộ dịch)</td><td>Dịch/quay bit trái phải — cần cho nhân, chia, tách trường</td><td>Chương 10 (lệnh dịch bit)</td></tr>
<tr><td><strong>Complementer</strong> (bộ lấy bù)</td><td>Tạo bù một, để phép TRỪ dùng lại được bộ cộng</td><td>Chương 11 (bù hai)</td></tr>
<tr><td><strong>Status Flags</strong> (cờ trạng thái)</td><td>Các bit được đặt như TÁC DỤNG PHỤ của mọi phép ALU — Z, N, C, V</td><td>Slide 8 (PSW), Chương 10 (rẽ nhánh có điều kiện)</td></tr>
<tr><td><strong>Registers</strong></td><td>Cái bộ nhớ trong nhỏ mà slide 2 nói tới</td><td>Slide 4–9</td></tr>
<tr><td><strong>Control Unit</strong></td><td>Đọc mã thao tác và điều khiển từng cổng vào đúng khoảnh khắc</td><td>Ch.19 của sách (không có trong môn này)</td></tr>
<tr><td><strong>Internal CPU Bus</strong></td><td>Con đường CHUNG duy nhất giữa ALU, thanh ghi và khối điều khiển</td><td>Chương 3 (bus ngoài — cùng ý tưởng, đặt bên trong)</td></tr>
</table>
<ul>
<li><strong>Đọc kỹ CHIỀU mũi tên — đó mới là câu hỏi thi.</strong> Giữa các bộ phận ALU và bus nội bộ, mũi tên <em>HAI ĐẦU</em> (dữ liệu chảy hai chiều). Giữa khối điều khiển và mọi thứ khác, mũi tên xám là <em>ĐIỀU KHIỂN</em>. Khối điều khiển không bao giờ chạm vào dữ liệu; nó chỉ nói "bây giờ".</li>
<li><strong>Status Flags nằm BÊN TRONG cái hộp ALU.</strong> Đây là chi tiết sinh viên hay bỏ sót. Cờ không phải một thanh ghi riêng mà phần mềm ghi vào — chúng do ALU sinh ra như một tác dụng phụ KHÔNG TRÁNH ĐƯỢC của phép tính. Slide 8 gom chúng lại thành PSW, rồi các lệnh <code>JZ</code> / <code>JNC</code> của Chương 10 đọc chúng.</li>
<li><strong>Vì sao bus nội bộ được vẽ thành MỘT thanh dọc.</strong> Nó là đường DÙNG CHUNG: mỗi lúc chỉ một phép chuyển. Tính "một chủ một lúc" ấy chính là gốc rễ phần cứng của <strong>xung đột tài nguyên</strong> ở slide 26 — hai tầng pipeline cùng muốn cái bus trong cùng một chu kỳ, và một đứa phải chờ.</li>
<li><strong>Bộ lấy bù nằm đó vì một lý do rất đẹp.</strong> Người ta KHÔNG chế tạo bộ trừ. Người ta lấy bù toán hạng thứ hai, cộng thêm 1 qua đường nhớ vào, rồi dùng lại chính bộ cộng. Một khối phần cứng, hai lệnh. Chương 11 chứng minh vì sao bù hai làm được điều đó.</li>
</ul>
<p class="meo">💡 Cách nhớ hình: <strong>ALU bên trái, thanh ghi bên phải, khối điều khiển góc dưới phải, bus chạy dọc ở giữa.</strong> Dữ liệu đi trái-phải dọc theo bus; điều khiển đi từ dưới lên. Vẽ lại được bốn cái hộp đó và ghi đúng tên cái bus là bạn có điểm.</p>`],

      [4, 'Register Organization — the two roles registers play',
        `<p class="y-chinh">🎯 The organising idea of slides 4–9: registers "function as a <strong>level of memory above main memory and cache in the hierarchy</strong>", and they "perform <strong>two roles</strong>". Everything else in this section is a subdivision of those two roles.</p>
<table>
<tr><th></th><th>User-Visible Registers</th><th>Control and Status Registers</th></tr>
<tr><td><strong>The slide's definition</strong></td><td>Enable the machine or assembly language programmer to <em>minimize main memory references</em> by optimizing use of registers</td><td>Used by the <em>control unit</em> to control the operation of the processor, and by <em>privileged operating system programs</em> to control the execution of programs</td></tr>
<tr><td><strong>Who can name it in an instruction</strong></td><td>Any programmer — <code>MOV EAX, 5</code></td><td>Nobody in user mode; some in kernel mode</td></tr>
<tr><td><strong>Examples</strong></td><td>General purpose, data, address, condition codes (slide 5)</td><td>PC, IR, MAR, MBR, PSW (slides 7–8)</td></tr>
<tr><td><strong>Saved on a context switch?</strong></td><td>Yes — all of them</td><td>PC and PSW yes; MAR/MBR no (transient)</td></tr>
<tr><td><strong>Where it appears in the pipeline</strong></td><td>Read in FO, written in WO</td><td>PC updated every FI; IR written every FI</td></tr>
</table>
<ul>
<li><strong>"A level of memory above main memory and cache" is the sentence to memorise.</strong> It places registers at the very top of the Chương 4 pyramid: fastest, smallest, most expensive per bit. There are typically 8–32 of them, versus billions of bytes of DRAM.</li>
<li><strong>The real design question the slide implies.</strong> How many registers should a machine have? Too few and the compiler keeps spilling values to memory (slow). Too many and every instruction needs more bits to name one, and a context switch costs more to save. The book's answer: <strong>8 to 32 is the sweet spot</strong>; RISC machines (Chương 13 of your syllabus) push higher.</li>
<li><strong>Why "user-visible" is a better word than "general purpose".</strong> Visible means <em>the instruction set can name it</em>. That is an architecture property, not an implementation one: two chips can implement the same visible registers with wildly different hardware (register renaming, Ch.18).</li>
<li><strong>The privileged half matters for Chương 8 (OS support).</strong> Only kernel-mode code may touch control registers. That single rule is what stops a user program from disabling interrupts or rewriting the page table — the whole protection model rests on the visible/control split drawn here.</li>
</ul>
<p class="pitfall">⚠️ Note on the source: the raw text extracted from the .pptx returns this slide's lines <em>out of order</em> — "Enable the machine…" and "Used by the control unit…" appear <em>before</em> the two column headings they belong under. The rendered slide shows the real layout: two bullets on top, then two labelled columns. Always trust the picture over a text dump when the two disagree.</p>`,
        `<p class="y-chinh">🎯 Ý tưởng tổ chức của slide 4–9: thanh ghi "đóng vai trò như một <strong>MỨC BỘ NHỚ nằm TRÊN bộ nhớ chính và cache trong phân cấp</strong>", và chúng "đảm nhận <strong>HAI VAI TRÒ</strong>". Mọi thứ còn lại của phần này chỉ là chia nhỏ hai vai trò ấy ra.</p>
<table>
<tr><th></th><th>Thanh ghi NGƯỜI DÙNG THẤY ĐƯỢC</th><th>Thanh ghi ĐIỀU KHIỂN &amp; TRẠNG THÁI</th></tr>
<tr><td><strong>Định nghĩa của slide</strong></td><td>Cho phép người lập trình máy/hợp ngữ <em>GIẢM SỐ LẦN tham chiếu bộ nhớ chính</em> bằng cách tối ưu việc dùng thanh ghi</td><td>Được <em>KHỐI ĐIỀU KHIỂN</em> dùng để điều khiển hoạt động của bộ xử lý, và được <em>chương trình hệ điều hành có đặc quyền</em> dùng để điều khiển việc thực thi chương trình</td></tr>
<tr><td><strong>Ai gọi tên được trong lệnh</strong></td><td>Mọi lập trình viên — <code>MOV EAX, 5</code></td><td>Không ai ở chế độ người dùng; một số ở chế độ nhân</td></tr>
<tr><td><strong>Ví dụ</strong></td><td>Đa dụng, dữ liệu, địa chỉ, mã điều kiện (slide 5)</td><td>PC, IR, MAR, MBR, PSW (slide 7–8)</td></tr>
<tr><td><strong>Có lưu khi chuyển ngữ cảnh?</strong></td><td>CÓ — tất cả</td><td>PC và PSW có; MAR/MBR không (chỉ là tạm)</td></tr>
<tr><td><strong>Xuất hiện ở đâu trong pipeline</strong></td><td>Đọc ở tầng FO, ghi ở tầng WO</td><td>PC cập nhật mỗi FI; IR ghi mỗi FI</td></tr>
</table>
<ul>
<li><strong>Câu "một mức bộ nhớ nằm trên bộ nhớ chính và cache" là câu phải thuộc.</strong> Nó đặt thanh ghi lên ĐỈNH cái kim tự tháp của Chương 4: nhanh nhất, nhỏ nhất, đắt nhất trên mỗi bit. Thường có 8–32 cái, so với hàng tỉ byte DRAM.</li>
<li><strong>Câu hỏi thiết kế thật mà slide ám chỉ.</strong> Một máy nên có bao nhiêu thanh ghi? Ít quá thì trình biên dịch cứ phải đổ giá trị ra bộ nhớ (chậm). Nhiều quá thì mỗi lệnh cần thêm bit để gọi tên một cái, và mỗi lần chuyển ngữ cảnh lại tốn hơn để lưu. Đáp án của sách: <strong>8 đến 32 là khoảng ngọt</strong>; máy RISC (Chương 13 trong syllabus) đẩy lên cao hơn.</li>
<li><strong>Vì sao "người dùng thấy được" là chữ chuẩn hơn "đa dụng".</strong> THẤY ĐƯỢC nghĩa là <em>tập lệnh gọi tên được nó</em>. Đó là tính chất KIẾN TRÚC, không phải tính chất hiện thực: hai con chip có thể hiện thực cùng bộ thanh ghi thấy được bằng phần cứng khác hẳn nhau (đổi tên thanh ghi, Ch.18).</li>
<li><strong>Nửa có đặc quyền mới là chỗ quan trọng cho Chương 8 (hỗ trợ của HĐH).</strong> Chỉ mã chạy ở chế độ nhân mới được đụng thanh ghi điều khiển. Đúng một luật đó chặn chương trình người dùng tắt ngắt hay viết lại bảng trang — cả mô hình bảo vệ đứng trên cái ranh giới thấy-được / điều-khiển vẽ ở đây.</li>
</ul>
<p class="pitfall">⚠️ Ghi chú về nguồn: bản trích chữ thô từ .pptx trả về các dòng của slide này <em>SAI THỨ TỰ</em> — câu "Enable the machine…" và "Used by the control unit…" hiện ra TRƯỚC hai cái nhãn cột mà chúng thuộc về. Ảnh render cho thấy bố cục thật: hai gạch đầu dòng ở trên, rồi hai cột có nhãn. Khi chữ và hình mâu thuẫn, luôn tin HÌNH.</p>`],

      [5, 'User-Visible Registers — the four categories',
        `<p class="y-chinh">🎯 A user-visible register is one "<strong>referenced by means of the machine language that the processor executes</strong>" — if you can write its name in an instruction, it is user-visible. The slide then splits them into <strong>four categories</strong>.</p>
<table>
<tr><th>Category</th><th>The slide's words</th><th>Concrete example</th></tr>
<tr><td><strong>General purpose</strong></td><td>Can be assigned to a variety of functions by the programmer</td><td>x86 <code>EAX</code>, <code>EBX</code>; ARM <code>R0</code>–<code>R12</code></td></tr>
<tr><td><strong>Data</strong></td><td>May be used <em>only</em> to hold data and cannot be employed in the calculation of an operand address</td><td>MC68000 <code>D0</code>–<code>D7</code> (see slide 9)</td></tr>
<tr><td><strong>Address</strong></td><td>May be somewhat general purpose or may be devoted to a particular addressing mode. Examples: <em>segment pointers, index registers, stack pointer</em></td><td>MC68000 <code>A0</code>–<code>A7</code>; x86 <code>CS</code>/<code>DS</code>, <code>SI</code>/<code>DI</code>, <code>SP</code></td></tr>
<tr><td><strong>Condition codes</strong></td><td>Also referred to as <em>flags</em>. Bits set by the processor hardware as the result of operations</td><td>x86 <code>ZF</code>, <code>SF</code>, <code>CF</code>, <code>OF</code></td></tr>
</table>
<ul>
<li><strong>Read "general purpose" against "data/address" as a design choice, not a list.</strong> A machine either has one undifferentiated bank (fully general, orthogonal, simpler compiler) or splits them by role (fewer bits to name one, so shorter instructions, but constant spilling when you run out of the right kind). The MC68000 on slide 9 chose the split; modern RISC chose general.</li>
<li><strong>Condition codes are only <em>partly</em> user-visible — and that is the exam nuance.</strong> A program can <strong>read</strong> them (that is what <code>JZ</code> does) but generally <strong>cannot write</strong> them directly; the hardware sets them. They are in this list because instructions reference them, not because you assign to them.</li>
<li><strong>The stack pointer is the most important address register.</strong> Every <code>CALL</code> pushes a return address, every <code>RET</code> pops one — see Chương 10. If SP is a dedicated register, <code>CALL</code> does not have to spend instruction bits naming it, which is why it is almost always dedicated.</li>
<li><strong>Design question the slide implicitly asks: how LONG should a register be?</strong> Address registers must hold the largest address the machine supports; data registers must hold the widest datum. That is exactly why moving from 32-bit to 64-bit x86 widened the registers (slide 43's Table 16.2 in the second half of the deck).</li>
</ul>
<p class="meo">💡 Four categories, four questions: <em>can it hold anything?</em> (general) · <em>only values?</em> (data) · <em>only pointers?</em> (address) · <em>only one bit of news?</em> (condition code). If you can answer those four for a register, you have classified it.</p>`,
        `<p class="y-chinh">🎯 Thanh ghi người dùng thấy được là thanh ghi "<strong>được tham chiếu bằng chính ngôn ngữ máy mà bộ xử lý thực thi</strong>" — viết được tên nó vào trong một lệnh thì nó thấy được. Rồi slide chia chúng thành <strong>BỐN nhóm</strong>.</p>
<table>
<tr><th>Nhóm</th><th>Nguyên văn slide</th><th>Ví dụ cụ thể</th></tr>
<tr><td><strong>Đa dụng (general purpose)</strong></td><td>Người lập trình gán cho nhiều chức năng khác nhau được</td><td>x86 <code>EAX</code>, <code>EBX</code>; ARM <code>R0</code>–<code>R12</code></td></tr>
<tr><td><strong>Dữ liệu (data)</strong></td><td><em>CHỈ</em> được dùng để chứa dữ liệu, KHÔNG dùng được trong việc tính địa chỉ toán hạng</td><td>MC68000 <code>D0</code>–<code>D7</code> (xem slide 9)</td></tr>
<tr><td><strong>Địa chỉ (address)</strong></td><td>Có thể hơi đa dụng, cũng có thể dành riêng cho một chế độ địa chỉ. Ví dụ: <em>con trỏ đoạn, thanh ghi chỉ số, con trỏ ngăn xếp</em></td><td>MC68000 <code>A0</code>–<code>A7</code>; x86 <code>CS</code>/<code>DS</code>, <code>SI</code>/<code>DI</code>, <code>SP</code></td></tr>
<tr><td><strong>Mã điều kiện (condition codes)</strong></td><td>Còn gọi là <em>CỜ</em>. Các bit do PHẦN CỨNG bộ xử lý đặt, như kết quả của các phép toán</td><td>x86 <code>ZF</code>, <code>SF</code>, <code>CF</code>, <code>OF</code></td></tr>
</table>
<ul>
<li><strong>Đọc "đa dụng" đối chiếu với "dữ liệu/địa chỉ" như một LỰA CHỌN THIẾT KẾ, đừng đọc như một danh sách.</strong> Một cỗ máy hoặc có một dãy không phân biệt (hoàn toàn đa dụng, trực giao, trình biên dịch dễ hơn) hoặc chia theo vai trò (cần ít bit hơn để gọi tên, nên lệnh ngắn hơn, nhưng cứ hết đúng loại cần là phải đổ ra bộ nhớ). MC68000 ở slide 9 chọn kiểu CHIA; RISC hiện đại chọn kiểu ĐA DỤNG.</li>
<li><strong>Mã điều kiện chỉ thấy được MỘT PHẦN — đây mới là chỗ tinh tế của đề thi.</strong> Chương trình <strong>ĐỌC</strong> được chúng (đó là việc <code>JZ</code> làm) nhưng nói chung <strong>KHÔNG GHI</strong> thẳng vào được; phần cứng đặt chúng. Chúng có mặt trong danh sách này vì LỆNH THAM CHIẾU tới chúng, không phải vì bạn gán được cho chúng.</li>
<li><strong>Con trỏ ngăn xếp là thanh ghi địa chỉ quan trọng nhất.</strong> Mỗi <code>CALL</code> đẩy một địa chỉ trở về, mỗi <code>RET</code> lấy ra một cái — xem Chương 10. Nếu SP là thanh ghi DÀNH RIÊNG thì <code>CALL</code> không phải tốn bit lệnh để gọi tên nó, nên nó gần như luôn được dành riêng.</li>
<li><strong>Câu hỏi thiết kế slide ngầm đặt ra: thanh ghi nên DÀI bao nhiêu?</strong> Thanh ghi địa chỉ phải chứa nổi địa chỉ lớn nhất máy hỗ trợ; thanh ghi dữ liệu phải chứa nổi dữ liệu rộng nhất. Đó chính xác là lý do chuyển từ x86 32 bit sang 64 bit thì thanh ghi nở ra (Table 16.2 ở slide 43, nửa sau của deck).</li>
</ul>
<p class="meo">💡 Bốn nhóm, bốn câu hỏi: <em>chứa được mọi thứ không?</em> (đa dụng) · <em>chỉ chứa giá trị?</em> (dữ liệu) · <em>chỉ chứa con trỏ?</em> (địa chỉ) · <em>chỉ chứa một bit tin?</em> (mã điều kiện). Trả lời được bốn câu đó cho một thanh ghi là bạn đã phân loại xong nó.</p>`],

      [6, 'Table 16.1 — Condition Codes: four advantages, four disadvantages',
        `<p class="y-chinh">🎯 A balance sheet, and the only slide in the first half of the chapter that argues a design trade-off in prose. Condition codes look free — the ALU sets them anyway — but the right column shows the bill, and its <strong>fourth item is this chapter's own second half</strong>.</p>
<table>
<tr><th>Advantages (the slide)</th><th>Disadvantages (the slide)</th></tr>
<tr><td>1. Because condition codes are set by normal arithmetic and data movement instructions, they should <strong>reduce the number of COMPARE and TEST instructions</strong> needed</td><td>1. Condition codes <strong>add complexity</strong>, both to hardware and software. Bits are often modified in different ways by different instructions, making life harder for the microprogrammer and compiler writer</td></tr>
<tr><td>2. Conditional instructions such as BRANCH are <strong>simplified</strong> relative to composite instructions such as TEST and BRANCH</td><td>2. Condition codes are <strong>irregular</strong>; they are typically not part of the main data path, so they require <strong>extra hardware connections</strong></td></tr>
<tr><td>3. Condition codes <strong>facilitate multiway branches</strong>: a TEST can be followed by two branches, one on ≤ 0 and one on &gt; 0</td><td>3. Condition code machines must often add <strong>special non-condition-code instructions</strong> anyway — bit checking, loop control, atomic semaphore operations</td></tr>
<tr><td>4. Condition codes <strong>can be saved on the stack</strong> during subroutine calls along with other register information</td><td>4. In a <strong>pipelined implementation</strong>, condition codes require <strong>special synchronization to avoid conflicts</strong></td></tr>
</table>
<ul>
<li><strong>Advantage 1 in one line of code.</strong> Without condition codes: <code>CMP R1, 0</code> then <code>BRANCH_IF_ZERO</code> — two instructions. With them: <code>SUB R1, R1, R2</code> already set Z as a side effect, so you branch straight away — one instruction saved in every loop body. Over a million iterations that is a million instructions.</li>
<li><strong>Disadvantage 4 is the one to circle for this chapter.</strong> "Special synchronization to avoid conflicts" is precisely the <strong>data hazard</strong> of slides 27–28, in its nastiest form: the flag is a <em>hidden</em> operand. Instruction n writes Z without mentioning it; instruction n+1 reads Z without mentioning it. The dependency is invisible in the instruction text, so the pipeline logic has to track it specially.</li>
<li><strong>Disadvantage 2 explains a picture you already saw.</strong> On Figure 16.1 (slide 3), Status Flags is drawn as its own little box wired separately — "not part of the main data path", exactly as the table says. That extra wiring is silicon you pay for.</li>
<li><strong>This is why RISC machines often drop or restrict them.</strong> ARM (slide 49 of the deck) makes flag-setting <em>optional per instruction</em> (the <code>S</code> suffix: <code>ADDS</code> sets flags, <code>ADD</code> does not), which lets the compiler tell the hardware exactly where the dependency is. MIPS goes further and has almost no flags at all.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: "condition codes make branches faster" is only half true. They make the <em>instruction count</em> smaller (advantage 1) but they make the <em>pipeline</em> harder (disadvantage 4). A good answer names both sides — that is what a table of advantages <em>and</em> disadvantages is asking you to do.</p>`,
        `<p class="y-chinh">🎯 Một bảng cân đối, và là slide DUY NHẤT của nửa đầu chương lập luận một đánh đổi thiết kế bằng văn xuôi. Mã điều kiện trông như đồ miễn phí — ALU đằng nào cũng đặt chúng — nhưng cột phải trưng ra cái hoá đơn, và <strong>mục thứ tư của nó chính là nửa sau của chương này</strong>.</p>
<table>
<tr><th>Ưu điểm (theo slide)</th><th>Nhược điểm (theo slide)</th></tr>
<tr><td>1. Vì mã điều kiện được đặt bởi các lệnh số học và di chuyển dữ liệu thông thường, chúng <strong>GIẢM SỐ LỆNH COMPARE và TEST</strong> cần dùng</td><td>1. Mã điều kiện <strong>LÀM TĂNG ĐỘ PHỨC TẠP</strong>, cả phần cứng lẫn phần mềm. Các bit cờ thường bị các lệnh khác nhau sửa theo những cách khác nhau, làm khó cả người viết vi chương trình lẫn người viết trình biên dịch</td></tr>
<tr><td>2. Các lệnh có điều kiện như BRANCH được <strong>ĐƠN GIẢN HOÁ</strong> so với lệnh ghép kiểu TEST-và-BRANCH</td><td>2. Mã điều kiện <strong>KHÔNG ĐỀU ĐẶN</strong>; chúng thường không nằm trong đường dữ liệu chính, nên đòi <strong>thêm dây nối phần cứng</strong></td></tr>
<tr><td>3. Mã điều kiện <strong>giúp rẽ nhiều nhánh</strong>: sau một lệnh TEST có thể đặt hai lệnh rẽ, một cái cho ≤ 0 và một cái cho &gt; 0</td><td>3. Máy dùng mã điều kiện rốt cuộc vẫn phải <strong>thêm các lệnh KHÔNG dùng mã điều kiện</strong> cho tình huống đặc biệt — kiểm tra bit, điều khiển vòng lặp, thao tác semaphore nguyên tử</td></tr>
<tr><td>4. Mã điều kiện <strong>lưu được lên ngăn xếp</strong> khi gọi chương trình con, cùng với các thông tin thanh ghi khác</td><td>4. Trong một hiện thực <strong>CÓ PIPELINE</strong>, mã điều kiện đòi <strong>đồng bộ đặc biệt để tránh xung đột</strong></td></tr>
</table>
<ul>
<li><strong>Ưu điểm 1 gói trong một dòng mã.</strong> Không có mã điều kiện: <code>CMP R1, 0</code> rồi <code>BRANCH_IF_ZERO</code> — hai lệnh. Có mã điều kiện: <code>SUB R1, R1, R2</code> đã đặt cờ Z như tác dụng phụ rồi, nên rẽ được ngay — tiết kiệm một lệnh trong MỖI thân vòng lặp. Qua một triệu vòng là một triệu lệnh.</li>
<li><strong>Nhược điểm 4 mới là cái phải khoanh tròn cho chương này.</strong> "Đồng bộ đặc biệt để tránh xung đột" chính xác là <strong>XUNG ĐỘT DỮ LIỆU</strong> ở slide 27–28, dưới dạng khó chịu nhất: cờ là một toán hạng <em>ẨN</em>. Lệnh n ghi Z mà không nhắc tới nó; lệnh n+1 đọc Z mà cũng không nhắc tới nó. Sự phụ thuộc VÔ HÌNH trong chữ của lệnh, nên mạch pipeline phải theo dõi nó bằng cơ chế riêng.</li>
<li><strong>Nhược điểm 2 giải thích một bức hình bạn vừa xem.</strong> Trên Figure 16.1 (slide 3), Status Flags được vẽ thành một cái hộp nhỏ riêng, nối dây riêng — "không nằm trong đường dữ liệu chính", đúng như bảng nói. Đám dây phụ đó là silicon bạn phải trả tiền.</li>
<li><strong>Đó là lý do máy RISC hay bỏ bớt hoặc hạn chế chúng.</strong> ARM (slide 49 của deck) cho phép <em>bật/tắt việc đặt cờ theo TỪNG LỆNH</em> (hậu tố <code>S</code>: <code>ADDS</code> đặt cờ, <code>ADD</code> thì không), nhờ đó trình biên dịch nói thẳng cho phần cứng biết sự phụ thuộc nằm ở đâu. MIPS đi xa hơn, gần như không có cờ nào.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: "mã điều kiện làm rẽ nhánh nhanh hơn" chỉ đúng một nửa. Chúng làm <em>SỐ LỆNH</em> ít đi (ưu điểm 1) nhưng làm <em>PIPELINE</em> khó hơn (nhược điểm 4). Đáp án tốt nêu cả hai phía — đó chính là điều mà một cái bảng có CẢ ưu VÀ nhược đang yêu cầu bạn làm.</p>`],

      [7, 'Control and Status Registers — the four essential ones',
        `<p class="y-chinh">🎯 The slide names <strong>four registers essential to instruction execution</strong> — PC, IR, MAR, MBR. Learn these four cold: every data-flow figure on slides 13–15, and every pipeline stage on slide 19, is written in terms of them.</p>
<table>
<tr><th>Register</th><th>The slide's definition</th><th>Holds an ADDRESS or a VALUE?</th><th>Written when</th></tr>
<tr><td><strong>PC</strong> — Program counter</td><td>Contains the <em>address of an instruction to be fetched</em></td><td>Address</td><td>Every fetch (incremented), and on every branch/interrupt</td></tr>
<tr><td><strong>IR</strong> — Instruction register</td><td>Contains the <em>instruction most recently fetched</em></td><td>Value (an instruction word)</td><td>End of every fetch cycle</td></tr>
<tr><td><strong>MAR</strong> — Memory address register</td><td>Contains the <em>address of a location in memory</em></td><td>Address</td><td>Before every memory read or write</td></tr>
<tr><td><strong>MBR</strong> — Memory buffer register</td><td>Contains a <em>word of data to be written to memory</em>, or the <em>word most recently read</em></td><td>Value</td><td>After every read; before every write</td></tr>
</table>
<ul>
<li><strong>The clean way to keep them apart: two pairs.</strong> <code>PC</code>/<code>IR</code> are the <em>instruction</em> pair — where the next instruction is, and what the current one is. <code>MAR</code>/<code>MBR</code> are the <em>bus</em> pair — the address going out and the data coming back. MAR is always wired to the address bus, MBR always to the data bus (see Figure 16.5, slide 13).</li>
<li><strong>Trace a fetch by hand, with numbers.</strong> Say PC = 300 and memory[300] = <code>ADD R1,R2</code>. Step 1: PC → MAR, so MAR = 300. Step 2: MAR drives the address bus; the control unit asserts READ. Step 3: memory puts the word on the data bus; MBR = <code>ADD R1,R2</code>. Step 4: MBR → IR. Step 5: PC ← PC + 1 = 301. <strong>Five micro-steps for one fetch</strong>, and the control unit sequences all five.</li>
<li><strong>Why MAR and MBR are the width of the buses, not the word.</strong> MAR must be as wide as an address (say 32 bits for 4 GB); MBR as wide as the data bus (say 64 bits). They are the CPU's docking ports onto Chương 3's bus, so their widths are fixed by the bus, not by the programmer.</li>
<li><strong>Why these four are NOT user-visible.</strong> Nothing in the instruction set names MAR or MBR — they change several times inside a single instruction and would be meaningless to a programmer. PC is a borderline case: you cannot <code>MOV</code> it, but <code>JMP</code> writes it and <code>CALL</code> reads it. That is the difference between naming a register and having an instruction whose <em>effect</em> is to change it.</li>
</ul>
<p class="meo">💡 Mnemonic in Vietnamese order: <strong>PC hỏi "ĐI ĐÂU", IR trả lời "LÀM GÌ", MAR nói "Ở ĐÂU", MBR mang "CÁI GÌ"</strong>. Four registers, four questions, in the order the hardware asks them.</p>`,
        `<p class="y-chinh">🎯 Slide nêu tên <strong>BỐN thanh ghi thiết yếu cho việc thực thi lệnh</strong> — PC, IR, MAR, MBR. Học thuộc lòng bốn cái này: mọi sơ đồ luồng dữ liệu ở slide 13–15, và mọi tầng pipeline ở slide 19, đều được viết bằng chúng.</p>
<table>
<tr><th>Thanh ghi</th><th>Định nghĩa của slide</th><th>Chứa ĐỊA CHỈ hay GIÁ TRỊ?</th><th>Được ghi khi nào</th></tr>
<tr><td><strong>PC</strong> — Program counter (bộ đếm chương trình)</td><td>Chứa <em>ĐỊA CHỈ của lệnh SẮP được nạp</em></td><td>Địa chỉ</td><td>Mỗi lần nạp (tăng lên), và mỗi lần rẽ nhánh/ngắt</td></tr>
<tr><td><strong>IR</strong> — Instruction register (thanh ghi lệnh)</td><td>Chứa <em>LỆNH VỪA ĐƯỢC NẠP gần nhất</em></td><td>Giá trị (một từ lệnh)</td><td>Cuối mỗi vòng nạp</td></tr>
<tr><td><strong>MAR</strong> — Memory address register</td><td>Chứa <em>ĐỊA CHỈ của một ô trong bộ nhớ</em></td><td>Địa chỉ</td><td>Trước mỗi lần đọc/ghi bộ nhớ</td></tr>
<tr><td><strong>MBR</strong> — Memory buffer register</td><td>Chứa <em>một TỪ DỮ LIỆU sắp ghi ra bộ nhớ</em>, hoặc <em>từ vừa đọc về gần nhất</em></td><td>Giá trị</td><td>Sau mỗi lần đọc; trước mỗi lần ghi</td></tr>
</table>
<ul>
<li><strong>Cách sạch nhất để khỏi lẫn: HAI CẶP.</strong> <code>PC</code>/<code>IR</code> là cặp <em>LỆNH</em> — lệnh tới nằm ở đâu, và lệnh hiện tại là gì. <code>MAR</code>/<code>MBR</code> là cặp <em>BUS</em> — địa chỉ đi ra và dữ liệu đi về. MAR luôn nối vào bus địa chỉ, MBR luôn nối vào bus dữ liệu (xem Figure 16.5, slide 13).</li>
<li><strong>Chạy tay một lần nạp lệnh, có số hẳn hoi.</strong> Giả sử PC = 300 và bộ nhớ[300] = <code>ADD R1,R2</code>. Bước 1: PC → MAR, vậy MAR = 300. Bước 2: MAR đẩy ra bus địa chỉ; khối điều khiển phát tín hiệu READ. Bước 3: bộ nhớ đặt từ lên bus dữ liệu; MBR = <code>ADD R1,R2</code>. Bước 4: MBR → IR. Bước 5: PC ← PC + 1 = 301. <strong>NĂM vi bước cho MỘT lần nạp</strong>, và khối điều khiển xếp thứ tự cả năm.</li>
<li><strong>Vì sao MAR và MBR rộng bằng BUS chứ không bằng TỪ.</strong> MAR phải rộng bằng một địa chỉ (ví dụ 32 bit cho 4 GB); MBR rộng bằng bus dữ liệu (ví dụ 64 bit). Chúng là hai cái cổng cập của CPU vào bus của Chương 3, nên độ rộng do BUS quyết định, không do người lập trình.</li>
<li><strong>Vì sao bốn cái này KHÔNG phải thanh ghi người dùng thấy được.</strong> Không lệnh nào trong tập lệnh gọi tên MAR hay MBR — chúng đổi giá trị vài lần TRONG MỘT lệnh và vô nghĩa với lập trình viên. PC là ca ranh giới: bạn không <code>MOV</code> vào nó được, nhưng <code>JMP</code> thì ghi nó và <code>CALL</code> thì đọc nó. Đó chính là khác biệt giữa GỌI TÊN một thanh ghi và có một lệnh mà <em>HỆ QUẢ</em> là thay đổi nó.</li>
</ul>
<p class="meo">💡 Mẹo nhớ theo trật tự tiếng Việt: <strong>PC hỏi "ĐI ĐÂU", IR trả lời "LÀM GÌ", MAR nói "Ở ĐÂU", MBR mang "CÁI GÌ"</strong>. Bốn thanh ghi, bốn câu hỏi, theo đúng thứ tự phần cứng hỏi chúng.</p>`],

      [8, 'Program Status Word (PSW)',
        `<p class="y-chinh">🎯 The PSW is a "<strong>register or set of registers that contain status information</strong>". It is where the condition codes of slide 5 actually live, plus a few control bits that decide what the processor is allowed to do. The slide lists <strong>seven</strong> common fields.</p>
<table>
<tr><th>Field on the slide</th><th>Usual letter</th><th>Set when…</th><th>Read by</th></tr>
<tr><td><strong>Sign</strong></td><td>S or N</td><td>The most significant bit of the result is 1 (result negative in two's complement)</td><td><code>JS</code> / <code>BMI</code></td></tr>
<tr><td><strong>Zero</strong></td><td>Z</td><td>All bits of the result are 0</td><td><code>JZ</code> / <code>BEQ</code></td></tr>
<tr><td><strong>Carry</strong></td><td>C</td><td>A carry out of the most significant bit (UNSIGNED overflow / borrow)</td><td><code>JC</code> / <code>BCS</code></td></tr>
<tr><td><strong>Equal</strong></td><td>—</td><td>Two values compared equal (on many machines this is just Z after a subtract)</td><td>Compare-and-branch</td></tr>
<tr><td><strong>Overflow</strong></td><td>V or O</td><td>The result is out of range for a SIGNED number</td><td><code>JO</code> / <code>BVS</code></td></tr>
<tr><td><strong>Interrupt Enable/Disable</strong></td><td>I</td><td>Written by privileged code, not by the ALU</td><td>The interrupt check step of the cycle</td></tr>
<tr><td><strong>Supervisor</strong></td><td>S-mode</td><td>Written by the hardware on a trap, cleared on return</td><td>Every privileged instruction check</td></tr>
</table>
<ul>
<li><strong>Work one example by hand, 8-bit, two's complement: <code>ADD 0x7F, 0x01</code>.</strong> 127 + 1 = 128, which does not fit in a signed byte. Result bits = <code>1000 0000</code>. So <strong>Z = 0</strong> (not zero), <strong>S = 1</strong> (top bit is 1 → reads as −128), <strong>C = 0</strong> (no carry out of bit 7), <strong>V = 1</strong> (two positives gave a negative → signed overflow).</li>
<li class="nhan"><strong>Second example, <code>ADD 0xFF, 0x01</code>:</strong> 255 + 1 = 256. Result bits = <code>0000 0000</code>. So <strong>Z = 1</strong>, <strong>S = 0</strong>, <strong>C = 1</strong> (carry out of bit 7 → unsigned overflow), <strong>V = 0</strong> (as signed numbers, −1 + 1 = 0, perfectly correct).</li>
<li><strong>The C-versus-V distinction is the single most examined flag question.</strong> <strong>C is for unsigned, V is for signed.</strong> The exact same adder produces both; which one matters depends entirely on how the <em>programmer</em> chose to interpret the bits. The hardware has no idea and sets both, every time.</li>
<li><strong>The last two fields are control bits, not status bits.</strong> Interrupt Enable and Supervisor are not results of an ALU operation — they are switches that the operating system flips (Chương 8). They sit in the PSW because they must be saved and restored together with the flags on every context switch.</li>
<li><strong>Why the PSW must be saved on an interrupt.</strong> If an interrupt arrives between <code>CMP</code> and <code>JZ</code>, and the handler runs any arithmetic, Z gets overwritten and your branch goes the wrong way. Saving PSW alongside PC (slide 15's interrupt data flow) is what makes interrupts invisible to the interrupted program.</li>
</ul>
<p class="pitfall">⚠️ <strong>The slide does not say "N, Z, C, V".</strong> It says Sign, Zero, Carry, Equal, Overflow, Interrupt Enable/Disable, Supervisor — <strong>seven</strong> fields, including two that are not condition codes at all. Many exam papers use the four-letter N/Z/C/V set (which is ARM's naming). Both are right; quote whichever your question uses, and know that "Sign" = "Negative".</p>`,
        `<p class="y-chinh">🎯 PSW là "<strong>một thanh ghi hoặc một bộ thanh ghi chứa thông tin trạng thái</strong>". Đây là nơi các mã điều kiện của slide 5 thật sự sinh sống, cộng thêm vài bit điều khiển quyết định bộ xử lý được phép làm gì. Slide liệt kê <strong>BẢY</strong> trường thường gặp.</p>
<table>
<tr><th>Trường trên slide</th><th>Ký hiệu quen</th><th>Được đặt khi…</th><th>Ai đọc</th></tr>
<tr><td><strong>Sign</strong> (dấu)</td><td>S hoặc N</td><td>Bit cao nhất của kết quả bằng 1 (kết quả âm theo bù hai)</td><td><code>JS</code> / <code>BMI</code></td></tr>
<tr><td><strong>Zero</strong> (không)</td><td>Z</td><td>Mọi bit của kết quả đều bằng 0</td><td><code>JZ</code> / <code>BEQ</code></td></tr>
<tr><td><strong>Carry</strong> (nhớ)</td><td>C</td><td>Có nhớ ra khỏi bit cao nhất (TRÀN KHÔNG DẤU / mượn)</td><td><code>JC</code> / <code>BCS</code></td></tr>
<tr><td><strong>Equal</strong> (bằng)</td><td>—</td><td>Hai giá trị so sánh bằng nhau (trên nhiều máy đây chỉ là Z sau phép trừ)</td><td>Lệnh so-sánh-rồi-rẽ</td></tr>
<tr><td><strong>Overflow</strong> (tràn)</td><td>V hoặc O</td><td>Kết quả vượt khỏi tầm của số CÓ DẤU</td><td><code>JO</code> / <code>BVS</code></td></tr>
<tr><td><strong>Interrupt Enable/Disable</strong></td><td>I</td><td>Do mã có đặc quyền ghi, KHÔNG phải do ALU</td><td>Bước kiểm tra ngắt của chu trình</td></tr>
<tr><td><strong>Supervisor</strong> (chế độ giám sát)</td><td>—</td><td>Do phần cứng đặt khi có bẫy, xoá khi trở về</td><td>Mọi lần kiểm tra lệnh đặc quyền</td></tr>
</table>
<ul>
<li><strong>Chạy tay một ví dụ, 8 bit, bù hai: <code>ADD 0x7F, 0x01</code>.</strong> 127 + 1 = 128, không lọt vào một byte có dấu. Các bit kết quả = <code>1000 0000</code>. Vậy <strong>Z = 0</strong> (khác không), <strong>S = 1</strong> (bit cao là 1 → đọc ra −128), <strong>C = 0</strong> (không có nhớ ra khỏi bit 7), <strong>V = 1</strong> (hai số dương cộng ra số âm → tràn có dấu).</li>
<li class="nhan"><strong>Ví dụ thứ hai, <code>ADD 0xFF, 0x01</code>:</strong> 255 + 1 = 256. Các bit kết quả = <code>0000 0000</code>. Vậy <strong>Z = 1</strong>, <strong>S = 0</strong>, <strong>C = 1</strong> (có nhớ ra khỏi bit 7 → tràn không dấu), <strong>V = 0</strong> (đọc như số có dấu thì −1 + 1 = 0, hoàn toàn đúng).</li>
<li><strong>Phân biệt C với V là câu hỏi về cờ bị hỏi nhiều nhất.</strong> <strong>C dành cho KHÔNG DẤU, V dành cho CÓ DẤU.</strong> Đúng cùng một bộ cộng sinh ra cả hai; cái nào có ý nghĩa hoàn toàn phụ thuộc vào việc <em>NGƯỜI LẬP TRÌNH</em> chọn diễn giải đám bit ấy ra sao. Phần cứng không biết gì cả và cứ đặt cả hai, mọi lần.</li>
<li><strong>Hai trường cuối là bit ĐIỀU KHIỂN, không phải bit trạng thái.</strong> Interrupt Enable và Supervisor không phải kết quả của phép ALU nào — chúng là những cái công tắc mà hệ điều hành gạt (Chương 8). Chúng nằm trong PSW vì phải được lưu và khôi phục CÙNG với các cờ ở mỗi lần chuyển ngữ cảnh.</li>
<li><strong>Vì sao PSW phải được lưu khi có ngắt.</strong> Nếu một ngắt ập tới giữa <code>CMP</code> và <code>JZ</code>, mà trình phục vụ có chạy bất kỳ phép số học nào, thì Z bị ghi đè và lệnh rẽ của bạn đi sai đường. Lưu PSW cùng với PC (luồng dữ liệu ngắt ở slide 15) chính là thứ làm cho ngắt trở nên VÔ HÌNH với chương trình bị ngắt.</li>
</ul>
<p class="pitfall">⚠️ <strong>Slide KHÔNG viết "N, Z, C, V".</strong> Nó viết Sign, Zero, Carry, Equal, Overflow, Interrupt Enable/Disable, Supervisor — <strong>BẢY</strong> trường, trong đó hai cái hoàn toàn không phải mã điều kiện. Nhiều đề thi lại dùng bộ bốn chữ N/Z/C/V (đó là cách gọi của ARM). Cả hai đều đúng; đề dùng cách nào thì trả lời theo cách đó, và nhớ rằng "Sign" = "Negative".</p>`],

      [9, 'Figure 16.2 — Example Microprocessor Register Organizations',
        `<p class="y-chinh">🎯 Three real machines side by side, so you can see that "register organisation" is a <em>choice</em>, not a law. (a) <strong>MC68000</strong>, (b) <strong>8086</strong>, (c) <strong>80386 – Pentium 4</strong>. Read them left to right as a history of the trade-off between "many uniform registers" and "few specialised ones".</p>
<table>
<tr><th></th><th>(a) MC68000</th><th>(b) 8086</th><th>(c) 80386 – Pentium 4</th></tr>
<tr><td><strong>Data</strong></td><td>D0–D7 (8 data registers)</td><td>AX Accumulator, BX Base, CX Count, DX Data</td><td>EAX, EBX, ECX, EDX (32-bit, with AX/BX/CX/DX as their low halves)</td></tr>
<tr><td><strong>Address / pointers</strong></td><td>A0–A7 (8 address registers; A7´ marked with a prime)</td><td>SP Stack ptr, BP Base ptr, SI Source index, DI Dest index</td><td>ESP, EBP, ESI, EDI</td></tr>
<tr><td><strong>Segments</strong></td><td>none</td><td>CS Code, DS Data, SS Stack, ES Extra</td><td>(inherited, not drawn on this panel)</td></tr>
<tr><td><strong>Program status</strong></td><td>Program counter + Status register</td><td>Flags + Instr ptr</td><td>FLAGS Register + Instruction Pointer</td></tr>
<tr><td><strong>Design philosophy</strong></td><td>Split but uniform: data vs address, 8 of each</td><td>Highly specialised: every register has a job in its name</td><td>Same names, widened to 32 bits — backward compatibility wins</td></tr>
</table>
<ul>
<li><strong>The MC68000 is the "data vs address" split of slide 5, drawn.</strong> D0–D7 can hold values but cannot compute an address; A0–A7 do addressing. The benefit: an instruction needs only 3 bits to name one of 8, and the opcode already implies which bank. The cost: if you need nine values, you spill even though eight address registers sit idle.</li>
<li><strong>The 8086 is the opposite extreme, and its register names are job descriptions.</strong> AX is the <em>Accumulator</em> (some instructions only work on AX), CX is the <em>Count</em> (the <code>LOOP</code> instruction decrements CX and nothing else), SI/DI are the string source/destination. Short instructions, but the compiler has to play Tetris.</li>
<li><strong>Panel (c) shows why x86 never got clean.</strong> EAX is drawn as a wide box whose <em>right half is labelled AX</em> — the 16-bit register still lives inside the 32-bit one, because 8086 binaries had to keep running. Backward compatibility is a design constraint as real as transistor count. The 64-bit extension repeated the trick (RAX contains EAX contains AX).</li>
<li><strong>What is missing from all three panels is as informative as what is there.</strong> No panel shows MAR or MBR — because they are not user-visible (slide 4). Figure 16.2 draws the <em>programmer's</em> view; Figure 16.1 drew the <em>hardware's</em> view. Same chip, two different maps.</li>
</ul>
<p class="pitfall">⚠️ Two details on the slide worth naming out loud instead of copying blindly: panel (a) writes <strong>"A7´"</strong> with a prime — that is the MC68000's <em>second</em> stack pointer, the supervisor-mode one, which quietly replaces A7 when the CPU is in supervisor state. And panel (b) writes <strong>"Extrat"</strong> for the ES segment register — a typo on the original Pearson slide; the correct word is <em>Extra</em>.</p>`,
        `<p class="y-chinh">🎯 Ba cỗ máy thật đặt cạnh nhau, để bạn thấy "tổ chức thanh ghi" là một <em>LỰA CHỌN</em>, không phải một định luật. (a) <strong>MC68000</strong>, (b) <strong>8086</strong>, (c) <strong>80386 – Pentium 4</strong>. Đọc từ trái sang phải như một lịch sử của cái đánh đổi giữa "nhiều thanh ghi đồng dạng" và "ít thanh ghi chuyên biệt".</p>
<table>
<tr><th></th><th>(a) MC68000</th><th>(b) 8086</th><th>(c) 80386 – Pentium 4</th></tr>
<tr><td><strong>Dữ liệu</strong></td><td>D0–D7 (8 thanh ghi dữ liệu)</td><td>AX Accumulator, BX Base, CX Count, DX Data</td><td>EAX, EBX, ECX, EDX (32 bit, AX/BX/CX/DX là nửa thấp của chúng)</td></tr>
<tr><td><strong>Địa chỉ / con trỏ</strong></td><td>A0–A7 (8 thanh ghi địa chỉ; A7´ có dấu phẩy trên)</td><td>SP Stack ptr, BP Base ptr, SI Source index, DI Dest index</td><td>ESP, EBP, ESI, EDI</td></tr>
<tr><td><strong>Đoạn (segment)</strong></td><td>không có</td><td>CS Code, DS Data, SS Stack, ES Extra</td><td>(kế thừa, không vẽ ở panel này)</td></tr>
<tr><td><strong>Trạng thái chương trình</strong></td><td>Program counter + Status register</td><td>Flags + Instr ptr</td><td>FLAGS Register + Instruction Pointer</td></tr>
<tr><td><strong>Triết lý thiết kế</strong></td><td>Chia nhưng đồng dạng: dữ liệu với địa chỉ, mỗi loại 8 cái</td><td>Chuyên biệt cao độ: mỗi thanh ghi mang nghề trong chính cái tên</td><td>Vẫn tên cũ, nới rộng lên 32 bit — tương thích ngược thắng</td></tr>
</table>
<ul>
<li><strong>MC68000 chính là cái chia "dữ liệu với địa chỉ" của slide 5, vẽ ra.</strong> D0–D7 chứa được giá trị nhưng không tính địa chỉ được; A0–A7 lo việc định địa chỉ. Cái lợi: một lệnh chỉ cần 3 bit để gọi tên 1 trong 8, mà mã thao tác đã ngầm cho biết là dãy nào. Cái giá: cần chín giá trị là phải đổ ra bộ nhớ, dù tám thanh ghi địa chỉ đang nằm chơi.</li>
<li><strong>8086 là thái cực ngược lại, và tên thanh ghi của nó là bản mô tả công việc.</strong> AX là <em>Accumulator</em> (có lệnh chỉ làm việc được với AX), CX là <em>Count</em> (lệnh <code>LOOP</code> giảm CX chứ không giảm cái nào khác), SI/DI là nguồn/đích của lệnh chuỗi. Lệnh ngắn, nhưng trình biên dịch phải chơi Tetris.</li>
<li><strong>Panel (c) cho thấy vì sao x86 không bao giờ sạch sẽ được.</strong> EAX được vẽ thành một cái hộp rộng mà <em>NỬA PHẢI ghi là AX</em> — thanh ghi 16 bit vẫn sống bên trong cái 32 bit, bởi các nhị phân 8086 vẫn phải chạy được. Tương thích ngược là một ràng buộc thiết kế thật như số transistor. Bản mở rộng 64 bit lặp lại đúng mẹo đó (RAX chứa EAX chứa AX).</li>
<li><strong>Thứ THIẾU ở cả ba panel cũng nói nhiều như thứ có mặt.</strong> Không panel nào vẽ MAR hay MBR — vì chúng không phải thanh ghi người dùng thấy được (slide 4). Figure 16.2 vẽ góc nhìn của <em>NGƯỜI LẬP TRÌNH</em>; Figure 16.1 vẽ góc nhìn của <em>PHẦN CỨNG</em>. Cùng một con chip, hai tấm bản đồ khác nhau.</li>
</ul>
<p class="pitfall">⚠️ Hai chi tiết trên slide đáng nói thẳng ra thay vì chép mù: panel (a) ghi <strong>"A7´"</strong> có dấu phẩy trên — đó là con trỏ ngăn xếp <em>THỨ HAI</em> của MC68000, cái dành cho chế độ supervisor, nó lặng lẽ thay chỗ A7 khi CPU ở trạng thái supervisor. Còn panel (b) ghi <strong>"Extrat"</strong> cho thanh ghi đoạn ES — đây là LỖI CHÍNH TẢ trên chính slide gốc của Pearson; chữ đúng là <em>Extra</em>.</p>`],

      [10, 'Instruction Cycle — fetch, execute, interrupt',
        `<p class="y-chinh">🎯 The instruction cycle "<strong>includes the following stages</strong>", and the slide draws exactly three boxes with a one-sentence job description under each. This is the same three-box loop you met in Chương 3 — the next five slides are all about refining it.</p>
<table>
<tr><th>Stage</th><th>The slide's description</th><th>How long it takes</th></tr>
<tr><td><strong>Fetch</strong></td><td>Read the next instruction from memory into the processor</td><td>One memory read — the slow part</td></tr>
<tr><td><strong>Execute</strong></td><td>Interpret the opcode and perform the indicated operation</td><td>Anything from one ALU pass to several memory accesses</td></tr>
<tr><td><strong>Interrupt</strong></td><td>If interrupts are enabled <em>and</em> an interrupt has occurred, save the current process state and service the interrupt</td><td>Zero, almost always — it is only a check</td></tr>
</table>
<ul>
<li><strong>Read the "if" in the Interrupt box very carefully — it is two conditions, not one.</strong> Interrupts must be <em>enabled</em> (the I bit of the PSW, slide 8) <strong>and</strong> one must have <em>occurred</em>. Fail either test and the processor goes straight back to Fetch. That is why the interrupt stage costs nothing in the normal case: usually it is a single wire being sampled.</li>
<li><strong>"Save the current process state" is doing a lot of work in that sentence.</strong> Minimum: PC and PSW. In practice the handler also saves whatever user-visible registers it intends to clobber. That is why interrupt latency is a real number a designer has to care about, and why ARM gives FIQ its own private register bank (slide 55 of the deck) specifically to skip the saving.</li>
<li><strong>The cycle is a LOOP, and that is the whole point of a stored-program computer.</strong> Nothing external drives the processor forward; it fetches, executes, checks, and starts again, forever. Switch it on and it runs until you stop it. Chương 3 called this the von Neumann cycle.</li>
<li><strong>Where this connects forward.</strong> Slide 11 adds a fourth box (Indirect). Slide 12 explodes all of them into ten states. Slides 13–15 show the register-level data flow for three of the boxes. And slide 19 takes the Fetch and Execute boxes and cuts them into the <em>six pipeline stages</em> — the whole second half of the chapter is "what if these boxes ran in parallel for different instructions?"</li>
</ul>
<p class="meo">💡 Three words in order: <strong>LẤY · LÀM · HỎI</strong> (fetch · execute · ask "was there an interrupt?"). The third one is a question, not a task — which is why it is almost free.</p>`,
        `<p class="y-chinh">🎯 Chu trình lệnh "<strong>gồm các giai đoạn sau</strong>", và slide vẽ đúng ba cái hộp, mỗi hộp kèm một câu mô tả công việc. Đây vẫn là cái vòng ba hộp bạn đã gặp ở Chương 3 — năm slide tiếp theo chỉ làm mỗi việc là mài giũa nó cho tinh.</p>
<table>
<tr><th>Giai đoạn</th><th>Mô tả của slide</th><th>Tốn bao lâu</th></tr>
<tr><td><strong>Fetch</strong> (nạp)</td><td>Đọc lệnh kế tiếp từ bộ nhớ vào bộ xử lý</td><td>Một lần đọc bộ nhớ — phần chậm</td></tr>
<tr><td><strong>Execute</strong> (thực thi)</td><td>Diễn giải mã thao tác và thực hiện thao tác được chỉ định</td><td>Từ một lượt qua ALU tới vài lần truy cập bộ nhớ</td></tr>
<tr><td><strong>Interrupt</strong> (ngắt)</td><td>NẾU ngắt đang được cho phép <em>VÀ</em> có ngắt xảy ra, thì lưu trạng thái tiến trình hiện tại và phục vụ ngắt</td><td>Bằng không, gần như luôn luôn — nó chỉ là một phép KIỂM</td></tr>
</table>
<ul>
<li><strong>Đọc thật kỹ chữ "NẾU" trong hộp Interrupt — đó là HAI điều kiện, không phải một.</strong> Ngắt phải đang được <em>CHO PHÉP</em> (bit I của PSW, slide 8) <strong>VÀ</strong> phải có một cái <em>XẢY RA</em>. Trượt một trong hai là bộ xử lý quay thẳng về Fetch. Đó là lý do giai đoạn ngắt tốn số 0 trong trường hợp bình thường: thường nó chỉ là lấy mẫu một sợi dây.</li>
<li><strong>Cụm "lưu trạng thái tiến trình hiện tại" gánh rất nhiều việc trong câu đó.</strong> Tối thiểu: PC và PSW. Thực tế trình phục vụ còn lưu thêm mọi thanh ghi người dùng thấy được mà nó định giẫm lên. Đó là lý do độ trễ ngắt là một con số thật mà người thiết kế phải quan tâm, và là lý do ARM cho FIQ hẳn một dãy thanh ghi riêng (slide 55 của deck) chỉ để KHỎI PHẢI lưu.</li>
<li><strong>Chu trình là một VÒNG LẶP, và đó chính là tinh thần của máy tính chương trình lưu trữ.</strong> Không có thứ gì bên ngoài đẩy bộ xử lý đi tới; nó nạp, thực thi, kiểm tra, rồi bắt đầu lại, mãi mãi. Bật lên là nó chạy cho tới khi bạn tắt. Chương 3 gọi đây là chu trình von Neumann.</li>
<li><strong>Chỗ này nối tới đâu.</strong> Slide 11 thêm cái hộp thứ tư (Indirect). Slide 12 nổ tung tất cả ra thành mười trạng thái. Slide 13–15 vẽ luồng dữ liệu ở mức thanh ghi cho ba trong số các hộp. Còn slide 19 lấy hộp Fetch và hộp Execute rồi cắt chúng thành <em>SÁU TẦNG PIPELINE</em> — cả nửa sau của chương chỉ là câu hỏi "sẽ ra sao nếu các hộp này chạy SONG SONG cho những lệnh khác nhau?"</li>
</ul>
<p class="meo">💡 Ba chữ theo thứ tự: <strong>LẤY · LÀM · HỎI</strong> (nạp · thực thi · hỏi "có ngắt không?"). Cái thứ ba là một CÂU HỎI chứ không phải một việc — nên nó gần như miễn phí.</p>`],

      [11, 'Figure 16.3 — The Instruction Cycle (with the indirect cycle)',
        `<p class="y-chinh">🎯 The same cycle as slide 10, but now with a <strong>fourth box: Indirect</strong>, and the arrows matter enormously. Fetch → Indirect → Execute → Interrupt → Fetch, <em>plus</em> a direct two-way link between Fetch and Execute that lets the Indirect box be skipped entirely.</p>
<ul>
<li><strong>Why an extra cycle exists at all — this is Chương 11 (addressing modes) coming back.</strong> An instruction like <code>ADD R1, (2000)</code> in <em>indirect</em> addressing mode does not contain the operand's address; it contains the address <em>of</em> the address. So after fetching the instruction you need one more memory read <em>before</em> you can execute. That extra read is the indirect cycle.</li>
<li><strong>Read the four arrows on the figure as a decision, not a fixed route.</strong> Fetch → Indirect happens <em>only</em> when the decoded instruction uses indirect addressing. Otherwise Fetch → Execute directly (the vertical arrow down the middle). Same for the return: Indirect → Execute. So the picture shows a cycle with an <em>optional detour</em>.</li>
<li><strong>Cost it out.</strong> Direct addressing: 1 memory access for the instruction + 1 for the operand = 2. Indirect addressing: 1 + 1 + 1 = <strong>3 memory accesses</strong>, i.e. 50% more traffic for a single instruction. That is what you pay for the flexibility of a pointer, and Chương 11 listed exactly that as indirect addressing's disadvantage.</li>
<li><strong>Interrupt comes AFTER execute, never in the middle.</strong> Follow the arrows: Execute → Interrupt → Fetch. The processor finishes the current instruction before servicing anything. This is what makes an instruction the <em>atomic unit</em> of a program, and it is why "atomic" instructions like test-and-set are possible at all (Chương 8, mutual exclusion).</li>
<li><strong>Connect to PRF192.</strong> Dereferencing a pointer, <code>*p</code>, is literally the indirect cycle. <code>int x = *p;</code> costs one memory read to get <code>p</code>'s value and a second to get what it points at. A chain <code>**pp</code> costs three. That is why chasing a linked list is so much slower than walking an array — Chương 4 measured it.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: students draw Fetch → Indirect → Execute as a fixed three-step chain. It is <strong>conditional</strong>. On a machine executing register-to-register arithmetic, the Indirect box is never entered at all — and its cost is zero, not "a bit".</p>`,
        `<p class="y-chinh">🎯 Vẫn là cái chu trình của slide 10, nhưng giờ có thêm <strong>hộp thứ tư: Indirect</strong> (vòng gián tiếp), và các mũi tên cực kỳ quan trọng. Fetch → Indirect → Execute → Interrupt → Fetch, <em>CỘNG</em> một đường nối hai chiều thẳng giữa Fetch và Execute cho phép bỏ qua hẳn hộp Indirect.</p>
<ul>
<li><strong>Vì sao lại có thêm một vòng — đây là Chương 11 (chế độ địa chỉ) quay trở lại.</strong> Một lệnh như <code>ADD R1, (2000)</code> ở chế độ <em>GIÁN TIẾP</em> không chứa địa chỉ của toán hạng; nó chứa địa chỉ <em>CỦA</em> cái địa chỉ. Nên sau khi nạp lệnh xong bạn cần thêm MỘT lần đọc bộ nhớ nữa TRƯỚC khi thực thi được. Lần đọc thêm đó chính là vòng gián tiếp.</li>
<li><strong>Đọc bốn mũi tên trên hình như một QUYẾT ĐỊNH, đừng đọc như một lộ trình cố định.</strong> Fetch → Indirect chỉ xảy ra KHI lệnh vừa giải mã có dùng địa chỉ gián tiếp. Còn không thì Fetch → Execute thẳng (mũi tên dọc ở giữa). Chiều về cũng vậy: Indirect → Execute. Vậy bức hình mô tả một chu trình có <em>đường vòng TUỲ CHỌN</em>.</li>
<li><strong>Tính ra tiền.</strong> Địa chỉ trực tiếp: 1 lần truy cập bộ nhớ cho lệnh + 1 cho toán hạng = 2. Địa chỉ gián tiếp: 1 + 1 + 1 = <strong>3 lần truy cập bộ nhớ</strong>, tức nhiều hơn 50% lưu lượng cho đúng một lệnh. Đó là cái giá bạn trả cho sự linh hoạt của con trỏ, và Chương 11 đã liệt kê đúng điều đó vào phần nhược điểm của địa chỉ gián tiếp.</li>
<li><strong>Interrupt nằm SAU execute, không bao giờ nằm giữa chừng.</strong> Đi theo mũi tên: Execute → Interrupt → Fetch. Bộ xử lý hoàn thành lệnh hiện tại rồi mới phục vụ bất cứ thứ gì. Chính điều này biến MỘT LỆNH thành <em>ĐƠN VỊ NGUYÊN TỬ</em> của chương trình, và là lý do những lệnh "nguyên tử" kiểu test-and-set tồn tại được (Chương 8, loại trừ tương hỗ).</li>
<li><strong>Nối sang PRF192.</strong> Việc giải tham chiếu con trỏ, <code>*p</code>, ĐÚNG NGHĨA ĐEN là vòng gián tiếp. <code>int x = *p;</code> tốn một lần đọc bộ nhớ để lấy giá trị của <code>p</code> và lần thứ hai để lấy thứ nó trỏ tới. Chuỗi <code>**pp</code> tốn ba. Đó là lý do đuổi theo một danh sách liên kết chậm hơn hẳn duyệt một mảng — Chương 4 đã đo con số ấy.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: sinh viên hay vẽ Fetch → Indirect → Execute thành một chuỗi ba bước CỐ ĐỊNH. Nó là <strong>CÓ ĐIỀU KIỆN</strong>. Trên một máy đang chạy phép số học thanh-ghi-với-thanh-ghi, hộp Indirect không bao giờ được bước vào — và chi phí của nó bằng KHÔNG, không phải "một chút".</p>`],

      [12, 'Figure 16.4 — Instruction Cycle State Diagram',
        `<p class="y-chinh">🎯 The fully exploded cycle: <strong>ten states</strong> instead of four boxes. This is the single most complete picture of "what a processor does" in the whole course. Read it as two rows — the top row is the states that touch memory, the bottom row the states that compute.</p>
<table>
<tr><th>State on the diagram</th><th>What happens</th><th>Loops back to itself?</th></tr>
<tr><td><strong>Instruction address calculation</strong></td><td>Work out where the next instruction is (usually PC + length)</td><td>no</td></tr>
<tr><td><strong>Instruction fetch</strong></td><td>Read that instruction from memory into IR</td><td>no</td></tr>
<tr><td><strong>Instruction operation decoding</strong></td><td>Analyse the opcode: what operation, which operands</td><td>no</td></tr>
<tr><td><strong>Operand address calculation</strong></td><td>Work out where a source operand is</td><td>no</td></tr>
<tr><td><strong>Operand fetch</strong></td><td>Read the operand from memory or I/O</td><td><strong>yes — "Indirection"</strong>, and also "Multiple operands"</td></tr>
<tr><td><strong>Data Operation</strong></td><td>Perform the actual arithmetic/logic</td><td>no</td></tr>
<tr><td><strong>Operand address calculation</strong> (again, on the right)</td><td>Work out where the result goes</td><td>no</td></tr>
<tr><td><strong>Operand store</strong></td><td>Write the result to memory or I/O</td><td><strong>yes — "Indirection"</strong>, and also "Multiple results"</td></tr>
<tr><td><strong>Interrupt check</strong></td><td>Sample the interrupt line; "No interrupt" goes back to the start</td><td>no</td></tr>
<tr><td><strong>Interrupt</strong></td><td>Save state and jump to the handler</td><td>no</td></tr>
</table>
<ul>
<li><strong>The three self-loops are the whole reason this diagram exists.</strong> "Indirection" on Operand fetch = the indirect cycle of slide 11, and it can loop <em>more than once</em> (double indirection). "Multiple operands" = an instruction like <code>ADD A, B, C</code> needs two source fetches. "Multiple results" = an instruction that writes two places. Each self-loop is a variable number of extra memory accesses, which is precisely why <strong>different instructions take different amounts of time</strong>.</li>
<li><strong>Notice "Operand address calculation" appears TWICE.</strong> Once before the fetch (where is the input?) and once before the store (where does the output go?). This is not a drawing mistake; source and destination addressing are computed separately, and an instruction can use different addressing modes for each.</li>
<li><strong>The arrow labelled "Instruction complete, fetch next instruction"</strong> runs from Interrupt check all the way back to Instruction address calculation. That long arrow is the loop of slide 10. The other long arrow, "Return for string or vector data", goes back to <em>Operand address calculation</em> — a string instruction repeats the whole operand phase per element without re-fetching the instruction.</li>
<li><strong>This diagram is the map for the pipeline.</strong> Compare it with slide 19's six stages: FI = Instruction fetch, DI = operation decoding, CO = operand address <em>calculation</em>, FO = operand <em>fetch</em>, EI = Data Operation, WO = Operand store. The pipeline is literally this state diagram with one instruction sitting in each state at the same time.</li>
</ul>
<p class="meo">💡 To reproduce it from memory: write the six pipeline stage names in a row, then add <em>address calculation</em> before the fetch, and hang the <em>interrupt check</em> off the end. That is nine of the ten states; the tenth is Interrupt itself.</p>`,
        `<p class="y-chinh">🎯 Chu trình nổ tung hoàn toàn: <strong>MƯỜI trạng thái</strong> thay vì bốn cái hộp. Đây là bức hình đầy đủ nhất về "bộ xử lý làm gì" trong cả môn. Đọc nó theo hai hàng — hàng trên là các trạng thái đụng vào bộ nhớ, hàng dưới là các trạng thái tính toán.</p>
<table>
<tr><th>Trạng thái trên sơ đồ</th><th>Xảy ra chuyện gì</th><th>Có tự lặp không?</th></tr>
<tr><td><strong>Instruction address calculation</strong> — tính địa chỉ lệnh</td><td>Tính xem lệnh kế tiếp nằm ở đâu (thường là PC + độ dài)</td><td>không</td></tr>
<tr><td><strong>Instruction fetch</strong> — nạp lệnh</td><td>Đọc lệnh đó từ bộ nhớ vào IR</td><td>không</td></tr>
<tr><td><strong>Instruction operation decoding</strong> — giải mã</td><td>Phân tích mã thao tác: thao tác gì, toán hạng nào</td><td>không</td></tr>
<tr><td><strong>Operand address calculation</strong> — tính địa chỉ toán hạng</td><td>Tính xem toán hạng NGUỒN nằm ở đâu</td><td>không</td></tr>
<tr><td><strong>Operand fetch</strong> — nạp toán hạng</td><td>Đọc toán hạng từ bộ nhớ hoặc vào/ra</td><td><strong>CÓ — "Indirection"</strong>, và cả "Multiple operands"</td></tr>
<tr><td><strong>Data Operation</strong> — thao tác dữ liệu</td><td>Thực hiện phép số học/logic thật sự</td><td>không</td></tr>
<tr><td><strong>Operand address calculation</strong> (lần nữa, bên phải)</td><td>Tính xem kết quả đi về đâu</td><td>không</td></tr>
<tr><td><strong>Operand store</strong> — cất toán hạng</td><td>Ghi kết quả ra bộ nhớ hoặc vào/ra</td><td><strong>CÓ — "Indirection"</strong>, và cả "Multiple results"</td></tr>
<tr><td><strong>Interrupt check</strong> — kiểm tra ngắt</td><td>Lấy mẫu đường ngắt; "No interrupt" thì quay về đầu</td><td>không</td></tr>
<tr><td><strong>Interrupt</strong> — ngắt</td><td>Lưu trạng thái và nhảy tới trình phục vụ</td><td>không</td></tr>
</table>
<ul>
<li><strong>Ba vòng tự lặp mới là lý do tồn tại của cả sơ đồ này.</strong> "Indirection" ở Operand fetch = vòng gián tiếp của slide 11, và nó lặp được <em>NHIỀU HƠN MỘT LẦN</em> (gián tiếp hai tầng). "Multiple operands" = lệnh kiểu <code>ADD A, B, C</code> cần nạp hai toán hạng nguồn. "Multiple results" = lệnh ghi ra hai chỗ. Mỗi vòng tự lặp là một số lần truy cập bộ nhớ THÊM không cố định, và đó chính xác là lý do <strong>các lệnh khác nhau tốn thời gian khác nhau</strong>.</li>
<li><strong>Để ý "Operand address calculation" xuất hiện HAI LẦN.</strong> Một lần trước khi nạp (đầu vào ở đâu?) và một lần trước khi cất (đầu ra đi đâu?). Đây không phải lỗi vẽ; địa chỉ nguồn và địa chỉ đích được tính RIÊNG, và một lệnh có thể dùng hai chế độ địa chỉ khác nhau cho hai việc đó.</li>
<li><strong>Mũi tên ghi "Instruction complete, fetch next instruction"</strong> chạy từ Interrupt check ngược hẳn về Instruction address calculation. Mũi tên dài đó chính là cái vòng lặp của slide 10. Còn mũi tên dài kia, "Return for string or vector data", quay về <em>Operand address calculation</em> — lệnh xử lý chuỗi lặp lại cả pha toán hạng cho từng phần tử mà KHÔNG nạp lại lệnh.</li>
<li><strong>Sơ đồ này là tấm bản đồ cho pipeline.</strong> So nó với sáu tầng của slide 19: FI = Instruction fetch, DI = operation decoding, CO = operand address <em>calculation</em>, FO = operand <em>fetch</em>, EI = Data Operation, WO = Operand store. Pipeline đúng nghĩa đen là cái sơ đồ trạng thái này với MỖI trạng thái có một lệnh ngồi trong đó CÙNG LÚC.</li>
</ul>
<p class="meo">💡 Cách vẽ lại từ trí nhớ: viết sáu tên tầng pipeline thành một hàng, thêm <em>tính địa chỉ lệnh</em> ở phía trước lần nạp, rồi móc <em>kiểm tra ngắt</em> vào đuôi. Vậy là chín trên mười trạng thái; cái thứ mười là chính Interrupt.</p>`],

      [13, 'Figure 16.5 — Data Flow, Fetch Cycle',
        `<p class="y-chinh">🎯 The fetch cycle drawn at <strong>register-and-wire level</strong>. Inside the CPU box: PC, MAR, IR, MBR and the Control Unit. Outside: the Address Bus, Data Bus and Control Bus of Chương 3, and Memory. Follow the arrows and you have the fetch, exactly.</p>
<table>
<tr><th>Step</th><th>Transfer on the figure</th><th>Which bus is busy</th></tr>
<tr><td>1</td><td><strong>PC → MAR</strong> (arrow inside the CPU)</td><td>internal only</td></tr>
<tr><td>2</td><td><strong>MAR → Address Bus</strong>, and Control Unit → Control Bus (READ)</td><td>address + control</td></tr>
<tr><td>3</td><td>Memory answers: <strong>Data Bus → MBR</strong></td><td>data</td></tr>
<tr><td>4</td><td><strong>MBR → IR</strong> (arrow inside the CPU)</td><td>internal only</td></tr>
<tr><td>5</td><td><strong>Control Unit → PC</strong> (the arrow that increments it)</td><td>internal only</td></tr>
</table>
<ul>
<li><strong>Every single arrow on this figure is one of those five steps.</strong> Nothing is decorative. If you can list the five and say which arrow each one is, you can answer any "trace the fetch cycle" question, which is a guaranteed exam item.</li>
<li><strong>The arrow from the Control Unit back into PC is the easy one to miss.</strong> PC does not increment itself — the control unit drives it, and it does so <em>during</em> the fetch, not after. That overlap is free parallelism: incrementing PC uses the internal adder while the memory is still answering.</li>
<li><strong>Note that MAR touches ONLY the address bus and MBR touches ONLY the data bus.</strong> That is a hard wiring fact, not a convention — it is why MAR's width is the address-bus width and MBR's is the data-bus width (slide 7). The control bus is driven by the control unit alone.</li>
<li><strong>Why three buses and not one.</strong> Chương 3 answered this: address, data and control travel simultaneously, so separating them means one memory operation per bus cycle instead of three. Here you can see the payoff — steps 2 and 3 use different buses and can overlap in a real machine.</li>
<li><strong>The whole figure is the FI stage of the pipeline.</strong> When slide 19 says "FI — read the next expected instruction into a buffer", these five steps are what it means. And when slide 26 says a resource hazard happens because two stages both want memory, this figure shows you which wires they are fighting over.</li>
</ul>
<p class="meo">💡 Say it as a sentence: "<strong>PC gives MAR the address, MAR shouts it down the address bus, memory answers on the data bus into MBR, MBR hands it to IR, and meanwhile the control unit bumps PC.</strong>" Five clauses, five arrows.</p>`,
        `<p class="y-chinh">🎯 Vòng nạp lệnh vẽ ở <strong>mức THANH GHI và DÂY NỐI</strong>. Trong hộp CPU: PC, MAR, IR, MBR và Control Unit. Bên ngoài: Address Bus, Data Bus, Control Bus của Chương 3, và Memory. Đi theo mũi tên là bạn có trọn vẹn vòng nạp.</p>
<table>
<tr><th>Bước</th><th>Phép chuyển trên hình</th><th>Bus nào đang bận</th></tr>
<tr><td>1</td><td><strong>PC → MAR</strong> (mũi tên bên trong CPU)</td><td>chỉ nội bộ</td></tr>
<tr><td>2</td><td><strong>MAR → Bus địa chỉ</strong>, và Control Unit → Bus điều khiển (READ)</td><td>địa chỉ + điều khiển</td></tr>
<tr><td>3</td><td>Bộ nhớ trả lời: <strong>Bus dữ liệu → MBR</strong></td><td>dữ liệu</td></tr>
<tr><td>4</td><td><strong>MBR → IR</strong> (mũi tên bên trong CPU)</td><td>chỉ nội bộ</td></tr>
<tr><td>5</td><td><strong>Control Unit → PC</strong> (mũi tên làm PC tăng lên)</td><td>chỉ nội bộ</td></tr>
</table>
<ul>
<li><strong>MỌI mũi tên trên hình này đều là một trong năm bước đó.</strong> Không có gì là trang trí. Kể đủ năm bước và chỉ được mũi tên nào ứng với bước nào là bạn trả lời được mọi câu "hãy mô tả vòng nạp lệnh" — một câu gần như chắc chắn có trong đề.</li>
<li><strong>Mũi tên từ Control Unit quay ngược vào PC là cái dễ bỏ sót nhất.</strong> PC không tự tăng — khối điều khiển thúc nó, và thúc <em>NGAY TRONG LÚC</em> nạp chứ không phải sau khi nạp xong. Sự chồng lấn đó là song song miễn phí: việc tăng PC dùng bộ cộng nội bộ trong khi bộ nhớ vẫn đang trả lời.</li>
<li><strong>Để ý MAR CHỈ chạm bus địa chỉ và MBR CHỈ chạm bus dữ liệu.</strong> Đó là sự thật về dây nối, không phải quy ước — nên độ rộng MAR bằng độ rộng bus địa chỉ và MBR bằng bus dữ liệu (slide 7). Bus điều khiển thì chỉ một mình khối điều khiển lái.</li>
<li><strong>Vì sao ba bus mà không phải một.</strong> Chương 3 đã trả lời: địa chỉ, dữ liệu và điều khiển đi ĐỒNG THỜI, nên tách riêng ra nghĩa là mỗi chu kỳ bus làm được một thao tác bộ nhớ thay vì ba. Ở đây bạn thấy phần thưởng — bước 2 và bước 3 dùng bus khác nhau nên chồng lấn được trên máy thật.</li>
<li><strong>Cả bức hình này chính là tầng FI của pipeline.</strong> Khi slide 19 viết "FI — đọc lệnh dự kiến kế tiếp vào một bộ đệm", nó có nghĩa là đúng năm bước này. Và khi slide 26 nói xung đột tài nguyên xảy ra vì hai tầng cùng muốn bộ nhớ, hình này cho bạn thấy chúng đang giành nhau đúng những sợi dây nào.</li>
</ul>
<p class="meo">💡 Đọc thành một câu: "<strong>PC đưa địa chỉ cho MAR, MAR hô nó ra bus địa chỉ, bộ nhớ trả lời trên bus dữ liệu vào MBR, MBR trao cho IR, và trong lúc đó khối điều khiển đẩy PC lên.</strong>" Năm vế, năm mũi tên.</p>`],

      [14, 'Figure 16.6 — Data Flow, Indirect Cycle',
        `<p class="y-chinh">🎯 The same drawing as slide 13 with two things <strong>deliberately removed</strong>: PC and IR are gone. Only <strong>MAR, MBR and the Control Unit</strong> remain. That absence is the lesson — the indirect cycle is pure address chasing, and it does not touch the program counter or the instruction register at all.</p>
<table>
<tr><th>Step</th><th>Transfer</th><th>Why</th></tr>
<tr><td>1</td><td><strong>MBR (address field) → MAR</strong></td><td>The word just fetched is not the operand; it holds the operand's address</td></tr>
<tr><td>2</td><td><strong>MAR → Address Bus</strong>, control unit asserts READ</td><td>Go and get what that address points at</td></tr>
<tr><td>3</td><td><strong>Data Bus → MBR</strong></td><td>Now MBR really does hold the operand</td></tr>
</table>
<ul>
<li><strong>The loop in the figure — MBR back round to MAR — is the visual signature of indirection.</strong> The thing you just read becomes the address you read next. Run the loop twice and you have double indirection, which is the self-loop labelled "Indirection" on Figure 16.4 (slide 12).</li>
<li><strong>Three steps, and only one of them is a memory access — but it is the expensive one.</strong> Every level of indirection adds a full memory round trip. On the machine measured in Chương 4, that is ~1,3 ns if it hits L1 and ~129 ns if it misses to DRAM. One extra pointer hop can cost 100× more than the arithmetic it feeds.</li>
<li><strong>Why PC is absent, stated plainly.</strong> PC tracks <em>instructions</em>. The indirect cycle is about <em>data</em>. Nothing here changes which instruction comes next, so nothing here may touch PC. If an exam answer shows PC being updated during the indirect cycle, it is wrong.</li>
<li><strong>Why IR is absent, which is subtler.</strong> The address field came out of the instruction, so you might expect IR → MAR. But by this point the address field has already been copied into MBR (or into a dedicated field), and the figure shows the transfer from where the value actually sits. The instruction itself is not re-read.</li>
<li><strong>Connect to Chương 11 one more time.</strong> This figure is the hardware cost of the addressing modes table you memorised. Immediate: 0 extra accesses. Direct: 1. Indirect: 2. Register indirect: 1 (the pointer is already in a register, so no memory read to fetch the address). Now you can see <em>why</em> register indirect is the mode RISC machines prefer.</li>
</ul>
<p class="pitfall">⚠️ Trap: "the indirect cycle reads the instruction again". It does <strong>not</strong>. It reads <em>data</em> — a word whose contents happen to be an address. The instruction was fetched once, in the fetch cycle, and stays in IR untouched.</p>`,
        `<p class="y-chinh">🎯 Vẫn bức vẽ của slide 13 nhưng hai thứ bị <strong>CỐ TÌNH BỎ ĐI</strong>: PC và IR biến mất. Chỉ còn <strong>MAR, MBR và Control Unit</strong>. Sự VẮNG MẶT đó chính là bài học — vòng gián tiếp thuần tuý là đuổi theo địa chỉ, và nó hoàn toàn không đụng tới bộ đếm chương trình hay thanh ghi lệnh.</p>
<table>
<tr><th>Bước</th><th>Phép chuyển</th><th>Vì sao</th></tr>
<tr><td>1</td><td><strong>MBR (trường địa chỉ) → MAR</strong></td><td>Từ vừa nạp về KHÔNG phải toán hạng; nó chứa ĐỊA CHỈ của toán hạng</td></tr>
<tr><td>2</td><td><strong>MAR → Bus địa chỉ</strong>, khối điều khiển phát READ</td><td>Đi lấy cái mà địa chỉ đó trỏ tới</td></tr>
<tr><td>3</td><td><strong>Bus dữ liệu → MBR</strong></td><td>Bây giờ MBR mới thật sự chứa toán hạng</td></tr>
</table>
<ul>
<li><strong>Cái vòng trên hình — MBR chạy vòng lại về MAR — là CHỮ KÝ THỊ GIÁC của sự gián tiếp.</strong> Thứ bạn vừa đọc trở thành địa chỉ bạn đọc tiếp. Chạy vòng đó hai lần là gián tiếp hai tầng, đúng cái vòng tự lặp ghi "Indirection" trên Figure 16.4 (slide 12).</li>
<li><strong>Ba bước, mà chỉ một bước là truy cập bộ nhớ — nhưng đó là bước đắt.</strong> Mỗi tầng gián tiếp thêm một vòng đi-về bộ nhớ trọn vẹn. Trên cỗ máy đã đo ở Chương 4, con số đó là ~1,3 ns nếu trúng L1 và ~129 ns nếu trượt xuống DRAM. Một cú nhảy con trỏ thêm có thể đắt gấp 100 lần phép tính mà nó phục vụ.</li>
<li><strong>Vì sao PC vắng mặt, nói toạc ra.</strong> PC theo dõi <em>LỆNH</em>. Vòng gián tiếp nói về <em>DỮ LIỆU</em>. Ở đây không có gì thay đổi việc lệnh nào tới tiếp theo, nên ở đây không có gì được phép đụng PC. Bài thi nào vẽ PC bị cập nhật trong vòng gián tiếp là SAI.</li>
<li><strong>Vì sao IR vắng mặt, chỗ này tinh tế hơn.</strong> Trường địa chỉ vốn ra từ lệnh, nên bạn có thể tưởng phải là IR → MAR. Nhưng tới thời điểm này, trường địa chỉ đã được chép vào MBR (hoặc vào một trường riêng) rồi, và hình vẽ phép chuyển từ NƠI GIÁ TRỊ THẬT SỰ ĐANG NẰM. Bản thân lệnh không bị đọc lại.</li>
<li><strong>Nối sang Chương 11 thêm một lần nữa.</strong> Bức hình này là GIÁ PHẦN CỨNG của cái bảng chế độ địa chỉ mà bạn đã học thuộc. Tức thời: 0 lần truy cập thêm. Trực tiếp: 1. Gián tiếp: 2. Gián tiếp qua thanh ghi: 1 (con trỏ đã nằm sẵn trong thanh ghi, nên không phải đọc bộ nhớ để lấy địa chỉ). Giờ bạn thấy được <em>VÌ SAO</em> gián tiếp qua thanh ghi là chế độ mà máy RISC ưa dùng.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: "vòng gián tiếp đọc lại cái lệnh". KHÔNG hề. Nó đọc <em>DỮ LIỆU</em> — một từ mà nội dung tình cờ là một địa chỉ. Lệnh đã được nạp một lần duy nhất, ở vòng nạp, và nằm yên trong IR.</p>`],

      [15, 'Figure 16.7 — Data Flow, Interrupt Cycle',
        `<p class="y-chinh">🎯 The third data-flow drawing, and the one with an unusual direction: this time <strong>MBR feeds the data bus</strong> — the CPU is <em>writing</em>, not reading. Look at the arrow from MBR out to the Data Bus. The processor is saving the return address so it can come back.</p>
<table>
<tr><th>Step</th><th>Transfer</th><th>Purpose</th></tr>
<tr><td>1</td><td><strong>PC → MBR</strong></td><td>The address of the next instruction is the return address — capture it before it is overwritten</td></tr>
<tr><td>2</td><td><strong>Control Unit → MAR</strong></td><td>The control unit supplies the address to save at (usually a stack location)</td></tr>
<tr><td>3</td><td><strong>MAR → Address Bus</strong>, <strong>MBR → Data Bus</strong>, control bus asserts WRITE</td><td>Store the return address in memory</td></tr>
<tr><td>4</td><td><strong>Control Unit → PC</strong></td><td>Load PC with the address of the interrupt handler's first instruction</td></tr>
</table>
<ul>
<li><strong>Two arrows come OUT of the Control Unit here, into MAR and into PC.</strong> On the fetch figure, the control unit fed only PC. That difference is the whole story: during an interrupt the control unit supplies <em>both</em> the address to save to and the address to jump to, because neither is in the program.</li>
<li><strong>Where do those two addresses come from?</strong> The save address comes from the stack pointer. The handler address comes from the <em>interrupt vector table</em> — every interrupt type has a number, and that number indexes a table of handler addresses (slides 47–48 of this deck, and Chương 7 on I/O).</li>
<li><strong>The figure shows PC saved; in a real machine PSW is saved too.</strong> Slide 8 explained why: if the handler runs any arithmetic, the flags are destroyed. The book's simplified figure shows the essential transfer; the real sequence pushes PC and PSW together.</li>
<li><strong>Compare all three data-flow figures in one breath.</strong> Fetch: memory → CPU, PC involved. Indirect: memory → CPU, PC <em>not</em> involved. Interrupt: CPU → memory, PC involved <em>twice</em> (saved, then overwritten). If you can say which direction the data bus arrow points on each figure, you understand all three.</li>
<li><strong>Connect to Chương 8 (OS support).</strong> This figure is the first half of a context switch. The OS's scheduler is entered exactly this way — a timer interrupt fires, this data flow saves the old PC, and the handler is the scheduler. Everything you know about processes rests on this one drawing.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: the interrupt cycle does <strong>not</strong> execute the handler. It only <em>saves state and repoints PC</em>. The handler then runs as ordinary instructions through ordinary fetch–execute cycles. Confusing "taking an interrupt" with "running the handler" loses marks on almost every paper that asks about it.</p>`,
        `<p class="y-chinh">🎯 Bức vẽ luồng dữ liệu thứ ba, và là bức có chiều khác thường: lần này <strong>MBR ĐẨY RA bus dữ liệu</strong> — CPU đang <em>GHI</em>, không phải đọc. Hãy nhìn mũi tên từ MBR đi ra Data Bus. Bộ xử lý đang cất địa chỉ trở về để còn quay lại được.</p>
<table>
<tr><th>Bước</th><th>Phép chuyển</th><th>Mục đích</th></tr>
<tr><td>1</td><td><strong>PC → MBR</strong></td><td>Địa chỉ lệnh kế tiếp chính là ĐỊA CHỈ TRỞ VỀ — chộp lấy nó trước khi bị ghi đè</td></tr>
<tr><td>2</td><td><strong>Control Unit → MAR</strong></td><td>Khối điều khiển cung cấp địa chỉ nơi cần cất (thường là một ô trên ngăn xếp)</td></tr>
<tr><td>3</td><td><strong>MAR → Bus địa chỉ</strong>, <strong>MBR → Bus dữ liệu</strong>, bus điều khiển phát WRITE</td><td>Cất địa chỉ trở về vào bộ nhớ</td></tr>
<tr><td>4</td><td><strong>Control Unit → PC</strong></td><td>Nạp vào PC địa chỉ lệnh đầu tiên của trình phục vụ ngắt</td></tr>
</table>
<ul>
<li><strong>Ở đây có HAI mũi tên đi RA từ Control Unit, vào MAR và vào PC.</strong> Trên hình vòng nạp, khối điều khiển chỉ nuôi mỗi PC. Khác biệt ấy là toàn bộ câu chuyện: trong lúc ngắt, khối điều khiển cấp <em>CẢ HAI</em> địa chỉ — chỗ để cất và chỗ để nhảy tới — bởi không cái nào có trong chương trình.</li>
<li><strong>Hai địa chỉ đó lấy ở đâu ra?</strong> Địa chỉ cất lấy từ con trỏ ngăn xếp. Địa chỉ trình phục vụ lấy từ <em>BẢNG VECTƠ NGẮT</em> — mỗi loại ngắt có một con số, và con số đó dùng làm chỉ số tra vào một bảng chứa địa chỉ các trình phục vụ (slide 47–48 của deck này, và Chương 7 về vào/ra).</li>
<li><strong>Hình vẽ PC được cất; trên máy thật thì PSW cũng được cất.</strong> Slide 8 đã giải thích vì sao: nếu trình phục vụ chạy bất kỳ phép số học nào thì các cờ tan tành. Hình đơn giản hoá của sách chỉ vẽ phép chuyển cốt lõi; trình tự thật đẩy PC và PSW cùng nhau.</li>
<li><strong>So cả ba hình luồng dữ liệu trong một hơi.</strong> Nạp: bộ nhớ → CPU, có PC tham gia. Gián tiếp: bộ nhớ → CPU, <em>KHÔNG</em> có PC. Ngắt: CPU → bộ nhớ, PC tham gia <em>HAI LẦN</em> (bị cất, rồi bị ghi đè). Nói được mũi tên bus dữ liệu của từng hình chỉ về phía nào là bạn hiểu cả ba.</li>
<li><strong>Nối sang Chương 8 (hỗ trợ của HĐH).</strong> Bức hình này là nửa đầu của một lần chuyển ngữ cảnh. Bộ lập lịch của hệ điều hành được bước vào ĐÚNG theo con đường này — một ngắt đồng hồ nổ, luồng dữ liệu này cất PC cũ đi, và trình phục vụ chính là bộ lập lịch. Mọi thứ bạn biết về tiến trình đều đứng trên đúng bức vẽ này.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: vòng ngắt <strong>KHÔNG</strong> thực thi trình phục vụ. Nó chỉ <em>cất trạng thái và trỏ lại PC</em>. Sau đó trình phục vụ chạy như những lệnh bình thường, qua những vòng nạp–thực thi bình thường. Lẫn lộn "nhận một ngắt" với "chạy trình phục vụ" là mất điểm ở gần như mọi đề có hỏi phần này.</p>`],

      [16, 'Pipelining Strategy',
        `<p class="y-chinh">🎯 The pivot of the whole chapter, in three sentences on one big arrow. Pipelining is "<strong>similar to the use of an assembly line in a manufacturing plant</strong>"; "<strong>new inputs are accepted at one end before previously accepted inputs appear as outputs at the other end</strong>"; and to apply it to instruction execution "<strong>we must recognize that an instruction has a number of stages</strong>".</p>
<ul>
<li><strong>The middle sentence is the definition — learn it word for word.</strong> Everything else about pipelining follows from "accept new input before the old output emerges". It is not about making one instruction faster; the instruction still takes just as long. It is about never letting a piece of hardware sit idle.</li>
<li><strong>The assembly line analogy, made precise.</strong> A car takes 8 hours to build whether or not you use a line. But with 8 one-hour stations, a finished car rolls out <em>every hour</em> instead of every 8 hours. <strong>Latency unchanged, throughput up 8×.</strong> That distinction — latency versus throughput — is the single most useful idea in this half of the chapter.</li>
<li><strong>The third sentence quietly sets up the next eight slides.</strong> "An instruction has a number of stages": how many, and which? Slide 17 says two (fetch, execute). Slide 19 says six (FI, DI, CO, FO, EI, WO). The slides are literally walking you from the crudest split to the textbook one.</li>
<li><strong>Why this is not free.</strong> An assembly line only works if every station takes the <em>same</em> time — the line runs at the speed of its slowest station, and the faster stations idle. Instruction stages are not naturally equal (a memory fetch is far slower than a decode), so real designs split and merge stages to balance them. Slide 18 shows the latches that make the split possible, and their cost.</li>
<li><strong>Preview of the two things that break it.</strong> An assembly line breaks if (a) two stations need the same tool at the same moment — the <em>resource hazard</em> of slide 26, or (b) someone shouts "wrong model, scrap everything on the line" — the <em>branch flush</em> of slide 21. Both are coming.</li>
</ul>
<p class="meo">💡 Keep the two words separate in your head for the rest of the course: <strong>latency = how long ONE thing takes</strong>; <strong>throughput = how many finish per unit time</strong>. Pipelining improves the second and never the first. Almost every wrong answer about pipelines confuses the two.</p>`,
        `<p class="y-chinh">🎯 Bản lề của cả chương, gói trong ba câu trên một mũi tên lớn. Pipeline "<strong>tương tự việc dùng dây chuyền lắp ráp trong nhà máy</strong>"; "<strong>đầu vào MỚI được nhận ở một đầu TRƯỚC KHI những đầu vào nhận trước đó hiện ra thành đầu ra ở đầu kia</strong>"; và để áp dụng vào việc thực thi lệnh "<strong>ta phải nhận ra rằng một lệnh gồm một SỐ GIAI ĐOẠN</strong>".</p>
<ul>
<li><strong>Câu giữa chính là ĐỊNH NGHĨA — học thuộc từng chữ.</strong> Mọi thứ khác về pipeline đều suy ra từ "nhận đầu vào mới trước khi đầu ra cũ hiện ra". Nó KHÔNG làm một lệnh nhanh hơn; lệnh vẫn tốn đúng bấy nhiêu thời gian. Nó làm cho không mẩu phần cứng nào phải ngồi chơi.</li>
<li><strong>Phép ví dây chuyền, nói cho chính xác.</strong> Một chiếc ô tô mất 8 giờ để dựng, có dây chuyền hay không cũng vậy. Nhưng với 8 trạm mỗi trạm một giờ, một chiếc xe hoàn thiện lăn ra <em>MỖI GIỜ</em> thay vì mỗi 8 giờ. <strong>Độ trễ không đổi, thông lượng tăng 8 lần.</strong> Phân biệt đó — độ trễ với thông lượng — là ý tưởng hữu ích nhất của nửa chương này.</li>
<li><strong>Câu thứ ba lặng lẽ dựng sẵn tám slide tiếp theo.</strong> "Một lệnh gồm một số giai đoạn": bao nhiêu, và là những giai đoạn nào? Slide 17 nói HAI (nạp, thực thi). Slide 19 nói SÁU (FI, DI, CO, FO, EI, WO). Các slide đúng nghĩa đen dẫn bạn đi từ cách chia thô nhất tới cách chia chuẩn của giáo trình.</li>
<li><strong>Vì sao nó không miễn phí.</strong> Dây chuyền chỉ chạy được nếu mọi trạm tốn thời gian NHƯ NHAU — cả dây chuyền chạy theo nhịp của trạm CHẬM NHẤT, còn trạm nhanh thì ngồi chơi. Các giai đoạn của lệnh vốn không bằng nhau (một lần nạp bộ nhớ chậm hơn hẳn một lần giải mã), nên thiết kế thật phải cắt ra ghép vào để cân bằng chúng. Slide 18 cho thấy những cái chốt (latch) làm cho việc cắt ấy khả thi, và cái giá của chúng.</li>
<li><strong>Xem trước hai thứ phá nó.</strong> Dây chuyền vỡ nếu (a) hai trạm cùng cần một món dụng cụ vào cùng một khoảnh khắc — <em>xung đột tài nguyên</em> ở slide 26, hoặc (b) có người hô "sai mẫu rồi, vứt hết những gì đang trên chuyền" — <em>xả pipeline vì rẽ nhánh</em> ở slide 21. Cả hai đang tới.</li>
</ul>
<p class="meo">💡 Giữ hai chữ này tách bạch trong đầu suốt phần còn lại của môn: <strong>độ trễ = MỘT việc tốn bao lâu</strong>; <strong>thông lượng = mỗi đơn vị thời gian xong được bao nhiêu việc</strong>. Pipeline cải thiện cái thứ hai và không bao giờ cải thiện cái thứ nhất. Gần như mọi đáp án sai về pipeline đều do lẫn hai thứ này.</p>`],

      [17, 'Figure 16.8 — Two-Stage Instruction Pipeline',
        `<p class="y-chinh">🎯 The crudest possible pipeline — <strong>two stages, Fetch and Execute</strong> — drawn twice. Panel (a) is the "Simplified view": instruction in → Fetch → instruction → Execute → result. Panel (b) is the honest view, and it adds three labels that panel (a) hides: <strong>Wait</strong> (on both stages), <strong>New address</strong> (an arrow from Execute back to Fetch), and <strong>Discard</strong> (an arrow dropping out of Fetch).</p>
<ul>
<li><strong>The idea in one line.</strong> While the execute stage is busy with instruction <em>i</em>, the fetch stage prefetches instruction <em>i+1</em> into a buffer. Two things happen at once, so in the ideal case you finish twice as many instructions per unit time.</li>
<li class="nhan"><strong>The ideal speedup, computed.</strong> With k = 2 stages and n instructions: unpipelined = n × 2 × τ, pipelined = (2 + n − 1) × τ = (n + 1) × τ. For n = 100: 200τ versus 101τ, so <strong>S = 1,98</strong> — just under the ceiling of 2. Verified with the simulator; the same formula is worked in full on slide 24.</li>
<li><strong>Why panel (b) says "Wait" on BOTH boxes.</strong> The two stages are not equal in duration, and the slower one sets the pace. If execute is longer than fetch, the fetch stage finishes early and waits. If an instruction needs a memory operand, execute takes longer still. <strong>The doubling is an upper bound you never quite reach.</strong></li>
<li><strong>"New address" and "Discard" together are the branch problem, in its simplest form.</strong> Execute discovers the instruction was a taken branch, so it sends a New address back to Fetch — and the instruction Fetch had already prefetched is wrong, so it is Discarded. Slide 21 draws the same event on a six-stage pipeline, where the damage is four times worse.</li>
<li><strong>Which real machines used exactly two stages.</strong> Simple 8-bit microcontrollers and the original ARM1 were close to this. It is the pipeline you get almost for free: one instruction buffer and a little control logic. Everything beyond it costs latches (slide 18).</li>
</ul>
<p class="dap-an">✅ Worked answer — "a 2-stage pipeline doubles performance, true or false?" <strong>False, and say why with numbers.</strong> The ceiling is 2 only as n → ∞ and only if the two stages are perfectly balanced and no branch ever occurs. Realistically: unequal stages cost you (the Wait arrows), and every taken branch throws away one prefetched instruction (the Discard arrow). Measured speedups for 2-stage designs land nearer 1,5–1,8.</p>`,
        `<p class="y-chinh">🎯 Cái pipeline thô sơ nhất có thể — <strong>HAI tầng, Fetch và Execute</strong> — vẽ hai lần. Panel (a) là "Simplified view": lệnh vào → Fetch → lệnh → Execute → kết quả. Panel (b) là bản thành thật, và nó thêm ba cái nhãn mà panel (a) giấu đi: <strong>Wait</strong> (trên cả hai tầng), <strong>New address</strong> (mũi tên từ Execute quay về Fetch), và <strong>Discard</strong> (mũi tên rơi ra khỏi Fetch).</p>
<ul>
<li><strong>Ý tưởng gói trong một dòng.</strong> Trong lúc tầng thực thi đang bận với lệnh <em>i</em>, tầng nạp nạp trước lệnh <em>i+1</em> vào một bộ đệm. Hai việc xảy ra cùng lúc, nên trong trường hợp lý tưởng bạn hoàn thành gấp đôi số lệnh trên mỗi đơn vị thời gian.</li>
<li class="nhan"><strong>Tăng tốc lý tưởng, tính ra số.</strong> Với k = 2 tầng và n lệnh: không pipeline = n × 2 × τ, có pipeline = (2 + n − 1) × τ = (n + 1) × τ. Với n = 100: 200τ so với 101τ, tức <strong>S = 1,98</strong> — chỉ vừa dưới cái trần 2. Đã kiểm bằng chương trình mô phỏng; chính công thức này được giải trọn ở slide 24.</li>
<li><strong>Vì sao panel (b) ghi "Wait" trên CẢ HAI hộp.</strong> Hai tầng không dài bằng nhau, và tầng chậm hơn quyết định nhịp. Nếu execute dài hơn fetch thì tầng nạp xong sớm và ngồi chờ. Nếu lệnh cần một toán hạng trong bộ nhớ thì execute còn dài hơn nữa. <strong>Con số gấp đôi là cái trần bạn không bao giờ chạm tới.</strong></li>
<li><strong>"New address" và "Discard" cùng nhau chính là bài toán rẽ nhánh, ở dạng đơn giản nhất.</strong> Execute phát hiện lệnh vừa rồi là một lệnh rẽ có thực hiện, nên nó gửi một New address ngược về Fetch — và cái lệnh mà Fetch đã nạp trước là SAI, nên bị Discard. Slide 21 vẽ đúng sự kiện đó trên pipeline sáu tầng, nơi thiệt hại nặng gấp bốn lần.</li>
<li><strong>Máy thật nào dùng đúng hai tầng.</strong> Các vi điều khiển 8 bit đơn giản và bản ARM1 đầu tiên gần với kiểu này. Đây là cái pipeline gần như cho không: một bộ đệm lệnh và một ít mạch điều khiển. Mọi thứ vượt quá nó đều tốn thêm CHỐT (slide 18).</li>
</ul>
<p class="dap-an">✅ Đáp án mẫu — "pipeline 2 tầng làm hiệu năng tăng gấp đôi, đúng hay sai?" <strong>SAI, và phải nói vì sao bằng số.</strong> Trần bằng 2 chỉ khi n → ∞ và chỉ khi hai tầng cân bằng hoàn hảo và không bao giờ có rẽ nhánh. Thực tế: tầng lệch nhau làm bạn mất phần (những mũi tên Wait), và mỗi lần rẽ nhánh có thực hiện lại vứt đi một lệnh đã nạp trước (mũi tên Discard). Tăng tốc đo được của các thiết kế 2 tầng nằm quanh 1,5–1,8.</p>`],

      [18, 'Figure 16.9 — Simplified Pipeline Architecture',
        `<p class="y-chinh">🎯 The hardware that <em>makes</em> a pipeline: a <strong>Clock</strong> line running along the top, and alternating <strong>Latch – Logic for Stage 1 – Latch – Logic for Stage 2 – Latch – Logic for Stage 3</strong>. The dashed arrows into the latches are labelled <strong>Intermediate results</strong>. This slide answers the question "why can't I just split the pipeline into 100 tiny stages?"</p>
<ul>
<li><strong>What a latch actually does.</strong> At each clock tick, every latch captures whatever its stage has just produced and holds it steady for the next stage to consume. Without latches, stage 2 would see stage 1's output changing mid-computation and compute garbage. <strong>Latches are the walls between workstations.</strong></li>
<li><strong>Every stage boundary costs one set of latches, and that is real money.</strong> A 32-bit-wide data path needs 32 flip-flops per boundary, plus clock distribution to all of them. Doubling the number of stages doubles this overhead — in silicon area <em>and</em> in power, because every flip-flop switches on every clock edge.</li>
<li class="nhan"><strong>Reason 1 that deeper is not always better — latch delay. Do the arithmetic.</strong> Suppose one instruction takes 12 ns of pure logic, and each latch adds 0,2 ns of setup+propagation delay. With k stages, the clock period is 12/k + 0,2 ns. At k = 6: 2,0 + 0,2 = <strong>2,2 ns</strong>. At k = 12: 1,0 + 0,2 = <strong>1,2 ns</strong>. At k = 60: 0,2 + 0,2 = <strong>0,4 ns</strong>. Throughput improves 6→12 (1,83× faster clock, not 2×) but 12→60 gives only 3× for a 5× increase in stages — <strong>the latch overhead eats the gain</strong>, and it can never be driven below 0,2 ns no matter how many stages you add.</li>
<li><strong>Reason 2 is worse, and it is the branch flush — quantified on slide 21.</strong> A deep pipeline holds more in-flight instructions, so a mispredicted branch throws away more of them. With the six-stage layout of Figure 16.11 the penalty is <strong>4 cycles</strong>; with a 20-stage pipeline built the same way it is <strong>18 cycles</strong>. That is why the Pentium 4's very deep pipeline lost to shorter designs on branchy code, and why modern chips settled around 14–20 stages instead of chasing 40.</li>
<li><strong>Reason 3, rarely stated: stages cannot be split arbitrarily.</strong> You cannot cut a memory access in half. The natural granularity of the work sets a floor on stage duration regardless of how many latches you are willing to pay for.</li>
</ul>
<p class="dap-an">✅ Summary answer to "why not 100 stages?" — three reasons, in order of importance: (1) <strong>branch/flush penalty grows linearly with depth</strong> (4 cycles at k=6 → 18 at k=20, computed on slide 21); (2) <strong>latch overhead per stage does not shrink</strong>, so the clock-period gain saturates (the 0,2 ns floor above); (3) <strong>some operations are indivisible</strong>. Reason (1) dominates on real code, because real code branches roughly every 5–7 instructions.</p>`,
        `<p class="y-chinh">🎯 Phần cứng <em>LÀM NÊN</em> một pipeline: một đường <strong>Clock</strong> chạy dọc phía trên, và xen kẽ <strong>Latch – Logic for Stage 1 – Latch – Logic for Stage 2 – Latch – Logic for Stage 3</strong>. Những mũi tên nét đứt chỉ vào các chốt ghi <strong>Intermediate results</strong> (kết quả trung gian). Slide này trả lời câu hỏi "sao không cắt quách pipeline thành 100 tầng tí hon?"</p>
<ul>
<li><strong>Cái chốt (latch) thật ra làm gì.</strong> Ở mỗi nhịp đồng hồ, mỗi chốt CHỘP lấy thứ mà tầng của nó vừa sản xuất ra và GIỮ YÊN cho tầng sau tiêu thụ. Không có chốt thì tầng 2 sẽ nhìn thấy đầu ra của tầng 1 đang biến thiên giữa chừng và tính ra rác. <strong>Chốt chính là những bức tường giữa các trạm làm việc.</strong></li>
<li><strong>Mỗi ranh giới tầng tốn một bộ chốt, và đó là tiền thật.</strong> Đường dữ liệu rộng 32 bit cần 32 flip-flop cho mỗi ranh giới, cộng thêm mạng phân phối xung nhịp tới tất cả chúng. Gấp đôi số tầng là gấp đôi chi phí đó — cả về diện tích silicon <em>lẫn</em> điện năng, vì mỗi flip-flop đều chuyển trạng thái ở mỗi sườn xung.</li>
<li class="nhan"><strong>Lý do 1 khiến sâu hơn không phải lúc nào cũng tốt hơn — ĐỘ TRỄ CHỐT. Làm phép tính đi.</strong> Giả sử một lệnh tốn 12 ns logic thuần, và mỗi chốt thêm 0,2 ns trễ thiết lập + lan truyền. Với k tầng, chu kỳ đồng hồ là 12/k + 0,2 ns. Tại k = 6: 2,0 + 0,2 = <strong>2,2 ns</strong>. Tại k = 12: 1,0 + 0,2 = <strong>1,2 ns</strong>. Tại k = 60: 0,2 + 0,2 = <strong>0,4 ns</strong>. Từ 6 lên 12 thông lượng khá lên (đồng hồ nhanh hơn 1,83 lần, không phải 2 lần) nhưng từ 12 lên 60 chỉ được 3 lần trong khi số tầng tăng 5 lần — <strong>chi phí chốt nuốt mất phần lợi</strong>, và nó không bao giờ tụt xuống dưới 0,2 ns dù bạn thêm bao nhiêu tầng.</li>
<li><strong>Lý do 2 còn tệ hơn, và đó là XẢ PIPELINE VÌ RẼ NHÁNH — tính ra số ở slide 21.</strong> Pipeline càng sâu thì càng giữ nhiều lệnh đang bay, nên một lần đoán sai rẽ nhánh vứt đi càng nhiều. Với bố cục sáu tầng của Figure 16.11, phạt là <strong>4 chu kỳ</strong>; với pipeline 20 tầng dựng cùng kiểu, phạt là <strong>18 chu kỳ</strong>. Đó là lý do cái pipeline rất sâu của Pentium 4 thua các thiết kế ngắn hơn trên mã nhiều rẽ nhánh, và là lý do chip hiện đại dừng lại quanh 14–20 tầng thay vì đuổi theo con số 40.</li>
<li><strong>Lý do 3, ít ai nói: tầng không cắt tuỳ tiện được.</strong> Bạn không cắt đôi một lần truy cập bộ nhớ được. Độ hạt tự nhiên của công việc đặt ra một cái sàn cho thời lượng mỗi tầng, bất kể bạn sẵn lòng trả tiền cho bao nhiêu cái chốt.</li>
</ul>
<p class="dap-an">✅ Đáp án tóm cho "sao không làm 100 tầng?" — ba lý do, theo thứ tự quan trọng: (1) <strong>phạt rẽ nhánh/xả tăng TUYẾN TÍNH theo độ sâu</strong> (4 chu kỳ ở k=6 → 18 ở k=20, tính ở slide 21); (2) <strong>chi phí chốt mỗi tầng KHÔNG co lại</strong>, nên phần lợi về chu kỳ đồng hồ bão hoà (cái sàn 0,2 ns ở trên); (3) <strong>có những thao tác không chia nhỏ được</strong>. Lý do (1) mới là cái chi phối trên mã thật, vì mã thật rẽ nhánh khoảng mỗi 5–7 lệnh một lần.</p>`],

      [19, 'Additional Stages — the six stages FI · DI · CO · FO · EI · WO',
        `<p class="y-chinh">🎯 The six-stage decomposition that every timing diagram in the rest of this chapter is written in. Memorise the six abbreviations and what each does — this is guaranteed exam material.</p>
<table>
<tr><th>#</th><th>Stage</th><th>The slide's description</th><th>Touches memory?</th></tr>
<tr><td>1</td><td><strong>FI</strong> — Fetch instruction</td><td>Read the next <em>expected</em> instruction into a buffer</td><td><strong>Yes</strong> (instruction memory)</td></tr>
<tr><td>2</td><td><strong>DI</strong> — Decode instruction</td><td>Determine the opcode and the operand specifiers</td><td>No</td></tr>
<tr><td>3</td><td><strong>CO</strong> — Calculate operands</td><td>Calculate the effective address of each source operand. This may involve displacement, register indirect, indirect, or other forms of address calculation</td><td>No</td></tr>
<tr><td>4</td><td><strong>FO</strong> — Fetch operands</td><td>Fetch each operand from memory. <em>Operands in registers need not be fetched</em></td><td><strong>Yes</strong> (data memory)</td></tr>
<tr><td>5</td><td><strong>EI</strong> — Execute instruction</td><td>Perform the indicated operation and store the result, if any, in the specified destination operand location</td><td>No</td></tr>
<tr><td>6</td><td><strong>WO</strong> — Write operand</td><td>Store the result in memory</td><td><strong>Yes</strong> (data memory)</td></tr>
</table>
<ul>
<li><strong>The word "expected" in FI is deliberate and it is the branch problem in advance.</strong> The fetch stage does not <em>know</em> what comes next; it assumes the next sequential address. When that assumption is wrong — a taken branch — everything fetched on the assumption is worthless. Slide 21 costs it out.</li>
<li><strong>"Operands in registers need not be fetched" (FO) is the RISC argument in one clause.</strong> If your instruction set forbids memory operands in arithmetic (load/store architecture), FO becomes trivially short for most instructions, the stages balance better, and the pipeline runs smoother. That is Chương 13's entire motivation.</li>
<li><strong>Three stages touch memory: FI, FO, WO.</strong> Count them and you have predicted slide 26 exactly: with a single memory port, FI of one instruction collides with FO or WO of another <em>in the same cycle</em>. The fix is a <strong>split instruction/data cache</strong> — Chương 4's separate L1-I and L1-D — which lets an instruction fetch and a data read happen simultaneously because they go to different caches.</li>
<li><strong>Map these six onto Figure 16.4's ten states (slide 12).</strong> FI = Instruction fetch. DI = Instruction operation decoding. CO = Operand address calculation. FO = Operand fetch. EI = Data operation. WO = Operand store. The pipeline is not a new model of the processor — it is the old state diagram with six instructions resident at once.</li>
<li><strong>Why exactly six, and not five or seven.</strong> Six is what you get when you split the work at every point where the resource changes (memory / decoder / address adder / memory / ALU / memory). It is the textbook's balanced choice, not a law. Figures 16.15 and 16.16 in this same chapter use <strong>five</strong> stages, dropping CO — see the warning on slide 26.</li>
</ul>
<p class="meo">💡 Mnemonic that survives exam pressure: <strong>"Find It, Decode It, Compute Offset, Fetch Operand, Execute It, Write Out."</strong> Six verbs in order, matching F-D-C-F-E-W.</p>`,
        `<p class="y-chinh">🎯 Cách phân rã sáu tầng mà mọi giản đồ thời gian còn lại của chương này đều viết bằng nó. Thuộc lòng sáu ký hiệu và việc của từng cái — đây là phần chắc chắn có trong đề.</p>
<table>
<tr><th>#</th><th>Tầng</th><th>Mô tả của slide</th><th>Có đụng bộ nhớ?</th></tr>
<tr><td>1</td><td><strong>FI</strong> — Fetch instruction (nạp lệnh)</td><td>Đọc lệnh <em>DỰ KIẾN</em> kế tiếp vào một bộ đệm</td><td><strong>CÓ</strong> (bộ nhớ lệnh)</td></tr>
<tr><td>2</td><td><strong>DI</strong> — Decode instruction (giải mã lệnh)</td><td>Xác định mã thao tác và các trường chỉ định toán hạng</td><td>Không</td></tr>
<tr><td>3</td><td><strong>CO</strong> — Calculate operands (tính toán hạng)</td><td>Tính địa chỉ hiệu dụng của từng toán hạng nguồn. Việc này có thể dùng độ dời, gián tiếp qua thanh ghi, gián tiếp, hoặc các dạng tính địa chỉ khác</td><td>Không</td></tr>
<tr><td>4</td><td><strong>FO</strong> — Fetch operands (nạp toán hạng)</td><td>Nạp từng toán hạng từ bộ nhớ. <em>Toán hạng đã nằm trong thanh ghi thì KHÔNG cần nạp</em></td><td><strong>CÓ</strong> (bộ nhớ dữ liệu)</td></tr>
<tr><td>5</td><td><strong>EI</strong> — Execute instruction (thực thi)</td><td>Thực hiện thao tác được chỉ định và cất kết quả, nếu có, vào vị trí toán hạng đích được chỉ định</td><td>Không</td></tr>
<tr><td>6</td><td><strong>WO</strong> — Write operand (ghi toán hạng)</td><td>Cất kết quả ra bộ nhớ</td><td><strong>CÓ</strong> (bộ nhớ dữ liệu)</td></tr>
</table>
<ul>
<li><strong>Chữ "DỰ KIẾN" trong FI là cố ý, và nó là bài toán rẽ nhánh báo trước.</strong> Tầng nạp KHÔNG BIẾT cái gì tới tiếp theo; nó GIẢ ĐỊNH là địa chỉ tuần tự kế tiếp. Khi giả định ấy sai — một lệnh rẽ có thực hiện — thì mọi thứ đã nạp theo giả định đó thành vô giá trị. Slide 21 tính ra số tiền phải trả.</li>
<li><strong>Câu "toán hạng đã nằm trong thanh ghi thì không cần nạp" (FO) là lập luận RISC gói trong một mệnh đề.</strong> Nếu tập lệnh của bạn CẤM toán hạng bộ nhớ trong phép số học (kiến trúc load/store) thì FO trở nên ngắn tủn với hầu hết lệnh, các tầng cân bằng hơn, và pipeline chạy mượt hơn. Đó là toàn bộ động cơ của Chương 13.</li>
<li><strong>BA tầng đụng bộ nhớ: FI, FO, WO.</strong> Đếm chúng ra là bạn đã đoán trúng slide 26: với một cổng bộ nhớ duy nhất, FI của lệnh này đụng FO hoặc WO của lệnh khác <em>TRONG CÙNG MỘT CHU KỲ</em>. Cách chữa là <strong>TÁCH cache lệnh và cache dữ liệu</strong> — L1-I và L1-D riêng của Chương 4 — nhờ đó một lần nạp lệnh và một lần đọc dữ liệu xảy ra đồng thời được vì chúng đi tới hai cache khác nhau.</li>
<li><strong>Ánh xạ sáu tầng này lên mười trạng thái của Figure 16.4 (slide 12).</strong> FI = Instruction fetch. DI = Instruction operation decoding. CO = Operand address calculation. FO = Operand fetch. EI = Data operation. WO = Operand store. Pipeline KHÔNG phải một mô hình mới của bộ xử lý — nó là cái sơ đồ trạng thái cũ với sáu lệnh cùng cư trú một lúc.</li>
<li><strong>Vì sao đúng SÁU, không phải năm hay bảy.</strong> Sáu là con số bạn có được khi cắt công việc ở mọi điểm mà TÀI NGUYÊN thay đổi (bộ nhớ / bộ giải mã / bộ cộng địa chỉ / bộ nhớ / ALU / bộ nhớ). Đó là lựa chọn cân bằng của giáo trình, không phải định luật. Chính Figure 16.15 và 16.16 trong cùng chương này lại dùng <strong>NĂM</strong> tầng, bỏ CO — xem cảnh báo ở slide 26.</li>
</ul>
<p class="meo">💡 Mẹo nhớ chịu được áp lực phòng thi: <strong>"Tìm nó, Giải mã nó, Cộng địa chỉ, Nạp toán hạng, Chạy nó, Ghi ra."</strong> Sáu động từ theo thứ tự, khớp F-D-C-F-E-W.</p>`],

      [20, 'Figure 16.10 — Timing Diagram for Instruction Pipeline Operation',
        `<p class="y-chinh">🎯 <strong>The single most important picture in the chapter.</strong> Nine instructions, six stages, fourteen clock cycles, drawn as a staircase. Columns are time (1…14), rows are instructions, and each filled cell says which stage that instruction is in during that cycle. Learn to draw this from a blank page.</p>
<table>
<tr><th>Instr</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th></tr>
<tr><td><strong>I1</strong></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I2</strong></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I3</strong></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I4</strong></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I5</strong></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I6</strong></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td></tr>
<tr><td><strong>I7</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td></tr>
<tr><td><strong>I8</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td></tr>
<tr><td><strong>I9</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td></tr>
</table>
<ul>
<li><strong>Read it three ways, and you will never be caught out.</strong> <em>Along a row</em> = the life of one instruction, six cycles from birth to death. <em>Down a column</em> = a snapshot of the machine at one instant — cycle 6 has six instructions in flight, one in every stage. <em>Along the diagonal</em> = the steady rhythm of one instruction entering and one leaving per cycle.</li>
<li class="nhan"><strong>Cycle 6 is where the pipeline becomes "full".</strong> Before it, some stages are idle (the triangle of blanks at the top left, called the <em>fill</em>). After cycle 9 the stages start emptying again (the <em>drain</em>, bottom right). Only cycles 6–9 have all six stages working. That fill-and-drain overhead is exactly the "−1" in the formula below.</li>
<li class="nhan"><strong>Count the cycles, do not assume them.</strong> Without pipelining, 9 instructions × 6 stages = <strong>54 cycles</strong>. With this pipeline: <strong>14 cycles</strong>, which is k + n − 1 = 6 + 9 − 1. Speedup = 54 ÷ 14 = <strong>3,857</strong>. Verified by a simulator that builds the grid cell by cycle and counts the last non-empty cycle — it reproduces 14, and agrees with (k + n − 1) for every n ≤ 39 and k ≤ 24 tested.</li>
<li class="dap-an">✅ <strong>Answer to the classic follow-up: "why isn't the speedup 6?"</strong> Because of the fill and drain. Only 4 of the 14 cycles have all six stages busy. As n grows, the fixed 5-cycle overhead matters less: n = 30 → S = 5,14; n = 100 → S = 5,71; n = 1000 → S = 5,97. The ceiling 6 is approached but never reached.</li>
<li><strong>What the figure quietly assumes — and it assumes a lot.</strong> Every stage takes exactly one cycle; no two stages ever want the same resource; no instruction depends on a previous result; no branch is taken. Slides 21 and 25–28 remove those assumptions one at a time, and every one of them puts holes in this beautiful staircase.</li>
</ul>
<p class="meo">💡 Drawing it under exam pressure: write the six stage names in the first row starting at column 1, then <strong>shift right by one for each new row</strong>. That is the whole figure. If the question says k stages and n instructions, the last cell is at column k + n − 1.</p>`,
        `<p class="y-chinh">🎯 <strong>Bức hình quan trọng nhất của cả chương.</strong> Chín lệnh, sáu tầng, mười bốn chu kỳ, vẽ thành một cầu thang. Cột là thời gian (1…14), hàng là lệnh, mỗi ô có chữ cho biết lệnh đó đang ở tầng nào trong chu kỳ đó. Hãy tập vẽ lại nó từ tờ giấy trắng.</p>
<table>
<tr><th>Lệnh</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th></tr>
<tr><td><strong>I1</strong></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I2</strong></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I3</strong></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I4</strong></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I5</strong></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I6</strong></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td></tr>
<tr><td><strong>I7</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td></tr>
<tr><td><strong>I8</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td></tr>
<tr><td><strong>I9</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td></tr>
</table>
<ul>
<li><strong>Đọc nó theo BA chiều là bạn không bao giờ bị hỏi bất ngờ.</strong> <em>Theo HÀNG</em> = cuộc đời một lệnh, sáu chu kỳ từ lúc sinh tới lúc xong. <em>Theo CỘT</em> = ảnh chụp cỗ máy tại một khoảnh khắc — chu kỳ 6 có sáu lệnh đang bay, mỗi tầng một lệnh. <em>Theo ĐƯỜNG CHÉO</em> = nhịp đều đặn: mỗi chu kỳ một lệnh vào, một lệnh ra.</li>
<li class="nhan"><strong>Chu kỳ 6 là lúc pipeline "ĐẦY".</strong> Trước đó vài tầng còn rỗi (cái tam giác trống ở góc trên trái, gọi là pha <em>ĐỔ ĐẦY</em>). Sau chu kỳ 9 các tầng bắt đầu rỗng dần (pha <em>XẢ CẠN</em>, góc dưới phải). Chỉ các chu kỳ 6–9 mới có đủ sáu tầng cùng làm việc. Chính cái phí đổ-đầy-và-xả-cạn ấy là con số "−1" trong công thức dưới đây.</li>
<li class="nhan"><strong>ĐẾM chu kỳ, đừng đoán.</strong> Không pipeline: 9 lệnh × 6 tầng = <strong>54 chu kỳ</strong>. Có pipeline này: <strong>14 chu kỳ</strong>, tức k + n − 1 = 6 + 9 − 1. Tăng tốc = 54 ÷ 14 = <strong>3,857</strong>. Đã kiểm bằng chương trình mô phỏng dựng lưới từng ô theo từng chu kỳ rồi đếm chu kỳ cuối còn ô — nó ra đúng 14, và khớp với (k + n − 1) với mọi n ≤ 39 và k ≤ 24 đã thử.</li>
<li class="dap-an">✅ <strong>Đáp án cho câu hỏi đuổi theo kinh điển: "sao tăng tốc không phải là 6?"</strong> Vì pha đổ đầy và xả cạn. Chỉ 4 trong 14 chu kỳ có đủ sáu tầng bận. Khi n lớn lên, cái phí cố định 5 chu kỳ đó bớt nặng: n = 30 → S = 5,14; n = 100 → S = 5,71; n = 1000 → S = 5,97. Trần 6 được tiến tới nhưng không bao giờ chạm.</li>
<li><strong>Bức hình lặng lẽ GIẢ ĐỊNH điều gì — và nó giả định rất nhiều.</strong> Mỗi tầng tốn đúng một chu kỳ; không bao giờ có hai tầng cùng muốn một tài nguyên; không lệnh nào phụ thuộc vào kết quả của lệnh trước; không lệnh rẽ nhánh nào được thực hiện. Slide 21 và 25–28 gỡ bỏ những giả định ấy từng cái một, và cái nào cũng chọc thủng cái cầu thang xinh đẹp này.</li>
</ul>
<p class="meo">💡 Cách vẽ lại trong phòng thi: viết sáu tên tầng vào hàng đầu bắt đầu từ cột 1, rồi <strong>DỊCH SANG PHẢI MỘT CỘT cho mỗi hàng mới</strong>. Cả bức hình chỉ có thế. Đề cho k tầng và n lệnh thì ô cuối cùng nằm ở cột k + n − 1.</p>`],

      [21, 'Figure 16.11 — The Effect of a Conditional Branch on Instruction Pipeline Operation',
        `<p class="y-chinh">🎯 The same staircase as slide 20, <strong>broken</strong>. Instruction 3 is a conditional branch to instruction 15. The figure adds a label the previous one did not have: <strong>Branch Penalty</strong>. Everything fetched on the wrong assumption — I4, I5, I6, I7 — dies at cycle 7.</p>
<table>
<tr><th>Instr</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th></tr>
<tr><td><strong>I1</strong></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I2</strong></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I3</strong> (branch)</td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I4</strong> ✗</td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I5</strong> ✗</td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I6</strong> ✗</td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I7</strong> ✗</td><td></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I15</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td></tr>
<tr><td><strong>I16</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td></tr>
</table>
<ul>
<li><strong>Read the staircase of destruction: 4 cells, then 3, then 2, then 1.</strong> I4 got four stages done, I5 three, I6 two, I7 one — ten cycles of work, thrown away. The branch outcome is only known at the <strong>end of EI</strong>, which for I3 is cycle 7, and I15 cannot start fetching until cycle 8.</li>
<li class="nhan"><strong>Compute the penalty exactly.</strong> Without the branch, I4 would have entered FI at cycle 4. With it, the correct successor I15 enters FI at cycle 8. <strong>8 − 4 = 4 cycles lost.</strong> General rule for this figure's layout: the branch resolves at stage k − 1, so <strong>penalty = k − 2</strong>.</li>
<li class="dap-an">✅ <strong>Scaling the penalty with pipeline depth</strong> — this is the number that kills deep pipelines:
<table>
<tr><th>Pipeline depth k</th><th>Branch penalty (cycles)</th><th>Effective CPI if 10% of instructions are mispredicted branches</th><th>Effective CPI at 20%</th></tr>
<tr><td>6 (this figure)</td><td><strong>4</strong></td><td>1 + 0,10×4 = <strong>1,40</strong> (40% slower)</td><td>1 + 0,20×4 = <strong>1,80</strong> (80% slower)</td></tr>
<tr><td>12</td><td><strong>10</strong></td><td>1 + 0,10×10 = <strong>2,00</strong></td><td><strong>3,00</strong></td></tr>
<tr><td>20</td><td><strong>18</strong></td><td>1 + 0,10×18 = <strong>2,80</strong> (180% slower)</td><td>1 + 0,20×18 = <strong>4,60</strong> (360% slower)</td></tr>
</table>
All computed and checked; a simulator reproduced this figure cell for cell — after 14 cycles only <strong>5</strong> instructions have completed (I1, I2, I3, I15, I16) instead of the 9 of slide 20.</li>
<li><strong>Why a 20-stage machine is not 3× better than a 6-stage one.</strong> It has a ~3× faster clock but pays 18 cycles per mispredicted branch instead of 4. Unless branch prediction is extremely accurate, the deeper machine loses. This is the real-world explanation of the Pentium 4 story, and it is why slides 29–37 of this deck are entirely about <em>dealing with branches</em>.</li>
<li><strong>Connect to PRF192 — why an <code>if</code> inside a hot loop is expensive.</strong> <code>for (i=0;i&lt;n;i++) if (a[i] &gt; 128) sum += a[i];</code> On random data the branch is unpredictable, so roughly half the iterations pay the flush. <strong>Sorting the array first can make the identical loop several times faster</strong>, because the branch then becomes highly predictable. Nothing about the arithmetic changed — only the pipeline's ability to guess.</li>
</ul>
<p class="pitfall">⚠️ Trap: the penalty is <strong>not</strong> "k cycles" and <strong>not</strong> "the number of instructions discarded". Here 4 instructions were discarded and the penalty is 4 cycles only by coincidence of this layout. The penalty is always <em>(the cycle the correct successor starts) − (the cycle it would have started)</em>. Compute it from the diagram, do not memorise a number.</p>`,
        `<p class="y-chinh">🎯 Vẫn cái cầu thang của slide 20, nhưng <strong>GÃY</strong>. Lệnh 3 là một lệnh rẽ nhánh có điều kiện tới lệnh 15. Hình thêm một cái nhãn mà hình trước không có: <strong>Branch Penalty</strong> (phạt rẽ nhánh). Mọi thứ đã nạp theo giả định sai — I4, I5, I6, I7 — chết ở chu kỳ 7.</p>
<table>
<tr><th>Lệnh</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th></tr>
<tr><td><strong>I1</strong></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I2</strong></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I3</strong> (rẽ nhánh)</td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I4</strong> ✗ bỏ</td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I5</strong> ✗ bỏ</td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I6</strong> ✗ bỏ</td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I7</strong> ✗ bỏ</td><td></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I15</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td></tr>
<tr><td><strong>I16</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td></tr>
</table>
<ul>
<li><strong>Đọc cái cầu thang đổ vỡ: 4 ô, rồi 3, rồi 2, rồi 1.</strong> I4 làm xong bốn tầng, I5 ba tầng, I6 hai, I7 một — mười chu kỳ công sức, vứt đi. Kết quả rẽ nhánh chỉ được biết ở <strong>CUỐI tầng EI</strong>, mà với I3 đó là chu kỳ 7, nên I15 không thể bắt đầu nạp trước chu kỳ 8.</li>
<li class="nhan"><strong>Tính phạt cho chính xác.</strong> Nếu không rẽ nhánh, I4 lẽ ra đã vào FI ở chu kỳ 4. Có rẽ nhánh, lệnh kế đúng là I15 vào FI ở chu kỳ 8. <strong>8 − 4 = 4 chu kỳ bị mất.</strong> Quy tắc tổng quát cho bố cục của hình này: rẽ nhánh được giải ở tầng k − 1, nên <strong>phạt = k − 2</strong>.</li>
<li class="dap-an">✅ <strong>Nhân phạt lên theo độ sâu pipeline</strong> — đây là con số giết chết những pipeline sâu:
<table>
<tr><th>Độ sâu k</th><th>Phạt rẽ nhánh (chu kỳ)</th><th>CPI hiệu dụng nếu 10% lệnh là rẽ nhánh đoán SAI</th><th>CPI hiệu dụng ở mức 20%</th></tr>
<tr><td>6 (hình này)</td><td><strong>4</strong></td><td>1 + 0,10×4 = <strong>1,40</strong> (chậm hơn 40%)</td><td>1 + 0,20×4 = <strong>1,80</strong> (chậm hơn 80%)</td></tr>
<tr><td>12</td><td><strong>10</strong></td><td>1 + 0,10×10 = <strong>2,00</strong></td><td><strong>3,00</strong></td></tr>
<tr><td>20</td><td><strong>18</strong></td><td>1 + 0,10×18 = <strong>2,80</strong> (chậm hơn 180%)</td><td>1 + 0,20×18 = <strong>4,60</strong> (chậm hơn 360%)</td></tr>
</table>
Tất cả đã tính và kiểm; một chương trình mô phỏng dựng lại hình này ĐÚNG TỪNG Ô — sau 14 chu kỳ chỉ có <strong>5</strong> lệnh hoàn thành (I1, I2, I3, I15, I16) thay vì 9 lệnh của slide 20.</li>
<li><strong>Vì sao máy 20 tầng không giỏi hơn máy 6 tầng gấp 3 lần.</strong> Nó có đồng hồ nhanh hơn ~3 lần nhưng trả 18 chu kỳ cho mỗi lần đoán sai rẽ nhánh thay vì 4. Trừ phi bộ đoán rẽ nhánh cực kỳ chính xác, máy sâu hơn sẽ THUA. Đây là lời giải thích đời thực cho câu chuyện Pentium 4, và là lý do slide 29–37 của deck này dành trọn cho việc <em>đối phó với rẽ nhánh</em>.</li>
<li><strong>Nối sang PRF192 — vì sao một câu <code>if</code> trong vòng lặp nóng lại đắt.</strong> <code>for (i=0;i&lt;n;i++) if (a[i] &gt; 128) sum += a[i];</code> Trên dữ liệu ngẫu nhiên, lệnh rẽ này không đoán được, nên khoảng một nửa số vòng phải trả phí xả pipeline. <strong>Sắp xếp mảng TRƯỚC có thể làm đúng cái vòng lặp đó nhanh lên vài lần</strong>, vì khi ấy lệnh rẽ trở nên rất dễ đoán. Không có gì về phép tính thay đổi cả — chỉ có khả năng ĐOÁN của pipeline thay đổi.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: phạt <strong>KHÔNG</strong> phải "k chu kỳ" và <strong>KHÔNG</strong> phải "số lệnh bị vứt đi". Ở đây 4 lệnh bị vứt và phạt cũng là 4 chu kỳ chỉ do TRÙNG HỢP của bố cục này. Phạt luôn bằng <em>(chu kỳ mà lệnh kế đúng bắt đầu) − (chu kỳ mà nó lẽ ra đã bắt đầu)</em>. Hãy TÍNH từ giản đồ, đừng học thuộc một con số.</p>`],

      [22, 'Figure 16.12 — Six-Stage CPU Instruction Pipeline',
        `<p class="y-chinh">🎯 The same six stages as slide 19, but drawn as a <strong>flowchart with two decision diamonds</strong> instead of a straight line. The two diamonds are "<strong>Unconditional Branch?</strong>" (after CO) and "<strong>Branch or Interrupt?</strong>" (after WO), and two extra boxes appear: <strong>Update PC</strong> and <strong>Empty Pipe</strong>.</p>
<table>
<tr><th>Element</th><th>Where it sits</th><th>What it means</th></tr>
<tr><td><strong>FI → DI → CO</strong></td><td>Top of the chart</td><td>The three stages that happen before anything can be known about branching</td></tr>
<tr><td><strong>Unconditional Branch?</strong></td><td>Diamond after CO</td><td>Yes → skip FO/EI/WO entirely, go to Update PC. No → carry on to FO</td></tr>
<tr><td><strong>FO → EI → WO</strong></td><td>Middle-bottom</td><td>The operand and execution stages</td></tr>
<tr><td><strong>Branch or Interrupt?</strong></td><td>Diamond after WO</td><td>Yes → Update PC. No → straight back up to FI</td></tr>
<tr><td><strong>Update PC</strong></td><td>Left column</td><td>Write the new target address into the program counter</td></tr>
<tr><td><strong>Empty Pipe</strong></td><td>Left column, below Update PC</td><td><strong>Throw away everything currently in flight</strong> — this is the flush of slide 21</td></tr>
</table>
<ul>
<li><strong>The first diamond is an optimisation you should notice.</strong> An <em>unconditional</em> branch (<code>JMP</code>) is known as soon as it is decoded and its address computed — at CO, stage 3. There is nothing to fetch, nothing to execute. So the pipeline redirects three stages earlier than for a conditional branch, and the penalty is correspondingly smaller. <strong>Unconditional branches are cheap; conditional ones are expensive.</strong></li>
<li class="nhan"><strong>Quantify the difference using this chart's own structure.</strong> Unconditional branch resolves at end of CO (stage 3), so the correct successor starts at cycle (branch FI) + 3, versus + 1 normally → <strong>penalty 2 cycles</strong>. Conditional branch resolves at EI (stage 5) → <strong>penalty 4 cycles</strong>, the figure of slide 21. Twice the cost, for the same branching distance.</li>
<li><strong>"Empty Pipe" is the most honest two words in the whole chapter.</strong> There is no clever recovery. Everything after the branch is simply discarded — the arrow from Empty Pipe goes all the way back up to FI, and the machine restarts from cold. That is why slides 29–37 spend eight slides trying to <em>avoid</em> ever reaching this box.</li>
<li><strong>Why "Branch or Interrupt?" are lumped into one diamond.</strong> From the pipeline's point of view they are the same event: control is going somewhere unexpected, so flush and refill. An interrupt is a branch the program did not ask for. That is also why a machine with a deep pipeline has <em>worse interrupt latency</em>, not just worse branch performance.</li>
<li><strong>Contrast this figure with Figure 16.10.</strong> Figure 16.10 shows <em>what happens over time to many instructions</em>. Figure 16.12 shows <em>the logic applied to one instruction</em>. Exams sometimes ask for "the pipeline diagram" without saying which — read the question for the words "timing" (→ the staircase table) or "flowchart/stages" (→ this one).</li>
</ul>
<p class="meo">💡 Remember the shape: <strong>a vertical spine of six boxes, two diamonds hanging off it, and a left-hand return lane containing Update PC and Empty Pipe.</strong> The left lane is the "something went wrong" path; the spine is the happy path.</p>`,
        `<p class="y-chinh">🎯 Vẫn sáu tầng của slide 19, nhưng vẽ thành một <strong>LƯU ĐỒ có HAI hình thoi quyết định</strong> thay vì một đường thẳng. Hai hình thoi là "<strong>Unconditional Branch?</strong>" (sau CO) và "<strong>Branch or Interrupt?</strong>" (sau WO), và xuất hiện thêm hai cái hộp: <strong>Update PC</strong> và <strong>Empty Pipe</strong>.</p>
<table>
<tr><th>Thành phần</th><th>Nằm ở đâu</th><th>Nghĩa là gì</th></tr>
<tr><td><strong>FI → DI → CO</strong></td><td>Đỉnh lưu đồ</td><td>Ba tầng xảy ra TRƯỚC khi có thể biết bất cứ điều gì về rẽ nhánh</td></tr>
<tr><td><strong>Unconditional Branch?</strong></td><td>Hình thoi sau CO</td><td>Yes → bỏ hẳn FO/EI/WO, sang Update PC. No → đi tiếp tới FO</td></tr>
<tr><td><strong>FO → EI → WO</strong></td><td>Giữa-dưới</td><td>Các tầng toán hạng và thực thi</td></tr>
<tr><td><strong>Branch or Interrupt?</strong></td><td>Hình thoi sau WO</td><td>Yes → Update PC. No → chạy thẳng lên lại FI</td></tr>
<tr><td><strong>Update PC</strong></td><td>Cột trái</td><td>Ghi địa chỉ đích mới vào bộ đếm chương trình</td></tr>
<tr><td><strong>Empty Pipe</strong></td><td>Cột trái, dưới Update PC</td><td><strong>VỨT HẾT mọi thứ đang bay trong ống</strong> — đây chính là pha xả của slide 21</td></tr>
</table>
<ul>
<li><strong>Hình thoi thứ nhất là một tối ưu bạn nên để ý.</strong> Một lệnh rẽ <em>KHÔNG ĐIỀU KIỆN</em> (<code>JMP</code>) được biết ngay khi giải mã xong và tính xong địa chỉ — tức ở CO, tầng 3. Chẳng có gì để nạp, chẳng có gì để thực thi. Nên pipeline đổi hướng SỚM HƠN BA TẦNG so với rẽ nhánh có điều kiện, và phạt nhỏ hơn tương ứng. <strong>Rẽ nhánh không điều kiện thì rẻ; có điều kiện thì đắt.</strong></li>
<li class="nhan"><strong>Tính ra số chênh lệch, dùng đúng cấu trúc của lưu đồ này.</strong> Rẽ không điều kiện giải ở cuối CO (tầng 3), nên lệnh kế đúng bắt đầu ở chu kỳ (FI của lệnh rẽ) + 3, so với + 1 bình thường → <strong>phạt 2 chu kỳ</strong>. Rẽ có điều kiện giải ở EI (tầng 5) → <strong>phạt 4 chu kỳ</strong>, đúng con số của slide 21. Gấp đôi chi phí, cho cùng một quãng nhảy.</li>
<li><strong>"Empty Pipe" là hai chữ thành thật nhất trong cả chương.</strong> Không có cách cứu vãn khéo léo nào cả. Mọi thứ sau lệnh rẽ bị VỨT ĐI, đơn giản vậy — mũi tên từ Empty Pipe chạy ngược lên tận FI, và cỗ máy khởi động lại từ nguội. Đó là lý do slide 29–37 tiêu tám slide chỉ để <em>TRÁNH</em> bao giờ phải chạm vào cái hộp này.</li>
<li><strong>Vì sao "Branch or Interrupt?" bị gộp vào một hình thoi.</strong> Dưới góc nhìn của pipeline, chúng là CÙNG MỘT sự kiện: dòng điều khiển đang đi tới một chỗ bất ngờ, nên xả và nạp lại. Một cái ngắt là một lệnh rẽ mà chương trình không yêu cầu. Đó cũng là lý do máy có pipeline sâu thì <em>ĐỘ TRỄ NGẮT cũng tệ hơn</em>, chứ không chỉ hiệu năng rẽ nhánh tệ hơn.</li>
<li><strong>Đối chiếu hình này với Figure 16.10.</strong> Figure 16.10 cho thấy <em>chuyện gì xảy ra theo thời gian cho NHIỀU lệnh</em>. Figure 16.12 cho thấy <em>logic áp lên MỘT lệnh</em>. Đề thi đôi khi hỏi "vẽ sơ đồ pipeline" mà không nói rõ cái nào — hãy đọc trong đề chữ "timing/thời gian" (→ bảng cầu thang) hay "lưu đồ/các tầng" (→ hình này).</li>
</ul>
<p class="meo">💡 Nhớ lấy HÌNH DÁNG: <strong>một xương sống dọc gồm sáu hộp, hai hình thoi treo bên cạnh, và một làn quay về bên trái chứa Update PC với Empty Pipe.</strong> Làn trái là đường "có chuyện rồi"; xương sống là đường thuận lợi.</p>`],

      [23, 'Figure 16.13 — An Alternative Pipeline Depiction',
        `<p class="y-chinh">🎯 The <strong>same two situations as slides 20 and 21, transposed</strong>. Here the <em>columns are the six stages</em> and the <em>rows are time</em>, running downwards 1…14. Each cell names which instruction is sitting in that stage at that moment. Left panel: no branch. Right panel: the same branch as Figure 16.11.</p>
<table>
<tr><th>Time</th><th>FI</th><th>DI</th><th>CO</th><th>FO</th><th>EI</th><th>WO</th><th>&nbsp;</th><th>FI</th><th>DI</th><th>CO</th><th>FO</th><th>EI</th><th>WO</th></tr>
<tr><td>1</td><td>I1</td><td></td><td></td><td></td><td></td><td></td><td>&nbsp;</td><td>I1</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>2</td><td>I2</td><td>I1</td><td></td><td></td><td></td><td></td><td>&nbsp;</td><td>I2</td><td>I1</td><td></td><td></td><td></td><td></td></tr>
<tr><td>3</td><td>I3</td><td>I2</td><td>I1</td><td></td><td></td><td></td><td>&nbsp;</td><td>I3</td><td>I2</td><td>I1</td><td></td><td></td><td></td></tr>
<tr><td>4</td><td>I4</td><td>I3</td><td>I2</td><td>I1</td><td></td><td></td><td>&nbsp;</td><td>I4</td><td>I3</td><td>I2</td><td>I1</td><td></td><td></td></tr>
<tr><td>5</td><td>I5</td><td>I4</td><td>I3</td><td>I2</td><td>I1</td><td></td><td>&nbsp;</td><td>I5</td><td>I4</td><td>I3</td><td>I2</td><td>I1</td><td></td></tr>
<tr><td>6</td><td>I6</td><td>I5</td><td>I4</td><td>I3</td><td>I2</td><td>I1</td><td>&nbsp;</td><td>I6</td><td>I5</td><td>I4</td><td>I3</td><td>I2</td><td>I1</td></tr>
<tr><td>7</td><td>I7</td><td>I6</td><td>I5</td><td>I4</td><td>I3</td><td>I2</td><td>&nbsp;</td><td>I7</td><td>I6</td><td>I5</td><td>I4</td><td>I3</td><td>I2</td></tr>
<tr><td>8</td><td>I8</td><td>I7</td><td>I6</td><td>I5</td><td>I4</td><td>I3</td><td>&nbsp;</td><td><strong>I15</strong></td><td></td><td></td><td></td><td></td><td>I3</td></tr>
<tr><td>9</td><td>I9</td><td>I8</td><td>I7</td><td>I6</td><td>I5</td><td>I4</td><td>&nbsp;</td><td>I16</td><td>I15</td><td></td><td></td><td></td><td></td></tr>
<tr><td>10</td><td></td><td>I9</td><td>I8</td><td>I7</td><td>I6</td><td>I5</td><td>&nbsp;</td><td></td><td>I16</td><td>I15</td><td></td><td></td><td></td></tr>
<tr><td>11</td><td></td><td></td><td>I9</td><td>I8</td><td>I7</td><td>I6</td><td>&nbsp;</td><td></td><td></td><td>I16</td><td>I15</td><td></td><td></td></tr>
<tr><td>12</td><td></td><td></td><td></td><td>I9</td><td>I8</td><td>I7</td><td>&nbsp;</td><td></td><td></td><td></td><td>I16</td><td>I15</td><td></td></tr>
<tr><td>13</td><td></td><td></td><td></td><td></td><td>I9</td><td>I8</td><td>&nbsp;</td><td></td><td></td><td></td><td></td><td>I16</td><td>I15</td></tr>
<tr><td>14</td><td></td><td></td><td></td><td></td><td></td><td>I9</td><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td>I16</td></tr>
</table>
<ul>
<li><strong>Same data, different axis — and the difference is genuinely useful.</strong> Figure 16.10's layout answers "what is <em>this instruction</em> doing?" This layout answers "what is <em>this stage</em> doing?" A hardware designer cares about the second: it tells you directly whether a unit is busy or idle at every moment.</li>
<li><strong>The right panel makes the damage brutally obvious.</strong> Look at row 8: five of the six stages are <strong>empty</strong>. Only WO is doing anything (finishing I3, the branch itself). Then row 9 has two. The pipeline has to refill from scratch — a triangle of emptiness that costs exactly the 4 cycles computed on slide 21.</li>
<li class="nhan"><strong>Count the empty cells and you have the penalty, another way.</strong> Left panel, rows 8–14: 6+6+5+4+3+2+1 = 27 filled cells. Right panel, same rows: 1+2+2+2+2+2+1 = 12 filled cells. <strong>15 stage-cycles of work lost</strong>, which at six stages per instruction is exactly the 2,5 instructions' worth you would expect from a 4-cycle bubble in a machine issuing 1 instruction/cycle in that window.</li>
<li><strong>Why both figures exist in the textbook.</strong> Because exams ask both ways. If the question gives you a column headed "FI DI CO FO EI WO" and rows numbered downward, it wants <em>this</em> layout. If it gives you a row of clock cycles, it wants Figure 16.10's. <strong>The content is identical; only the transpose differs.</strong> Practise converting one to the other — it takes 30 seconds and guarantees you cannot be wrong-footed.</li>
<li><strong>Notice what the right panel does NOT show.</strong> It does not show I4–I7 at all — they have already been erased from history. Figure 16.11 (slide 21) <em>does</em> show them, half-completed. The two figures describe the same event from two moral positions: one shows the wasted work, the other shows the empty machine.</li>
</ul>
<p class="meo">💡 Converting between the two layouts: in Figure 16.10 the instruction is fixed along a row and the stage name moves; in Figure 16.13 the stage is fixed along a column and the instruction name moves. <strong>Whatever is in the header stays still; whatever is in the cells is what moves.</strong></p>`,
        `<p class="y-chinh">🎯 <strong>Vẫn hai tình huống của slide 20 và 21, nhưng CHUYỂN VỊ</strong>. Ở đây <em>CỘT là sáu tầng</em> và <em>HÀNG là thời gian</em>, chạy xuống 1…14. Mỗi ô ghi lệnh nào đang ngồi trong tầng đó ở khoảnh khắc đó. Panel trái: không rẽ nhánh. Panel phải: đúng cái rẽ nhánh của Figure 16.11.</p>
<table>
<tr><th>Thời gian</th><th>FI</th><th>DI</th><th>CO</th><th>FO</th><th>EI</th><th>WO</th><th>&nbsp;</th><th>FI</th><th>DI</th><th>CO</th><th>FO</th><th>EI</th><th>WO</th></tr>
<tr><td>1</td><td>I1</td><td></td><td></td><td></td><td></td><td></td><td>&nbsp;</td><td>I1</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>2</td><td>I2</td><td>I1</td><td></td><td></td><td></td><td></td><td>&nbsp;</td><td>I2</td><td>I1</td><td></td><td></td><td></td><td></td></tr>
<tr><td>3</td><td>I3</td><td>I2</td><td>I1</td><td></td><td></td><td></td><td>&nbsp;</td><td>I3</td><td>I2</td><td>I1</td><td></td><td></td><td></td></tr>
<tr><td>4</td><td>I4</td><td>I3</td><td>I2</td><td>I1</td><td></td><td></td><td>&nbsp;</td><td>I4</td><td>I3</td><td>I2</td><td>I1</td><td></td><td></td></tr>
<tr><td>5</td><td>I5</td><td>I4</td><td>I3</td><td>I2</td><td>I1</td><td></td><td>&nbsp;</td><td>I5</td><td>I4</td><td>I3</td><td>I2</td><td>I1</td><td></td></tr>
<tr><td>6</td><td>I6</td><td>I5</td><td>I4</td><td>I3</td><td>I2</td><td>I1</td><td>&nbsp;</td><td>I6</td><td>I5</td><td>I4</td><td>I3</td><td>I2</td><td>I1</td></tr>
<tr><td>7</td><td>I7</td><td>I6</td><td>I5</td><td>I4</td><td>I3</td><td>I2</td><td>&nbsp;</td><td>I7</td><td>I6</td><td>I5</td><td>I4</td><td>I3</td><td>I2</td></tr>
<tr><td>8</td><td>I8</td><td>I7</td><td>I6</td><td>I5</td><td>I4</td><td>I3</td><td>&nbsp;</td><td><strong>I15</strong></td><td></td><td></td><td></td><td></td><td>I3</td></tr>
<tr><td>9</td><td>I9</td><td>I8</td><td>I7</td><td>I6</td><td>I5</td><td>I4</td><td>&nbsp;</td><td>I16</td><td>I15</td><td></td><td></td><td></td><td></td></tr>
<tr><td>10</td><td></td><td>I9</td><td>I8</td><td>I7</td><td>I6</td><td>I5</td><td>&nbsp;</td><td></td><td>I16</td><td>I15</td><td></td><td></td><td></td></tr>
<tr><td>11</td><td></td><td></td><td>I9</td><td>I8</td><td>I7</td><td>I6</td><td>&nbsp;</td><td></td><td></td><td>I16</td><td>I15</td><td></td><td></td></tr>
<tr><td>12</td><td></td><td></td><td></td><td>I9</td><td>I8</td><td>I7</td><td>&nbsp;</td><td></td><td></td><td></td><td>I16</td><td>I15</td><td></td></tr>
<tr><td>13</td><td></td><td></td><td></td><td></td><td>I9</td><td>I8</td><td>&nbsp;</td><td></td><td></td><td></td><td></td><td>I16</td><td>I15</td></tr>
<tr><td>14</td><td></td><td></td><td></td><td></td><td></td><td>I9</td><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td>I16</td></tr>
</table>
<ul>
<li><strong>Cùng dữ liệu, khác trục — và sự khác biệt ấy thật sự hữu ích.</strong> Bố cục của Figure 16.10 trả lời "<em>lệnh này</em> đang làm gì?" Bố cục này trả lời "<em>tầng này</em> đang làm gì?" Người thiết kế phần cứng quan tâm cái thứ hai: nó nói thẳng cho bạn biết một khối đang bận hay đang rỗi ở từng khoảnh khắc.</li>
<li><strong>Panel phải phơi bày thiệt hại một cách tàn nhẫn.</strong> Nhìn hàng 8: NĂM trong sáu tầng <strong>TRỐNG RỖNG</strong>. Chỉ mỗi WO đang làm gì đó (kết thúc I3, chính lệnh rẽ). Rồi hàng 9 có hai. Pipeline phải nạp lại từ đầu — một tam giác trống hoác tốn đúng 4 chu kỳ đã tính ở slide 21.</li>
<li class="nhan"><strong>Đếm ô trống là bạn có phạt, theo một cách khác.</strong> Panel trái, hàng 8–14: 6+6+5+4+3+2+1 = 27 ô có chữ. Panel phải, cùng các hàng: 1+2+2+2+2+2+1 = 12 ô. <strong>Mất 15 "tầng-chu-kỳ" công việc</strong>, mà chia cho sáu tầng mỗi lệnh thì đúng bằng khoảng 2,5 lệnh — đúng như kỳ vọng từ một cái bọt 4 chu kỳ trên cỗ máy phát 1 lệnh/chu kỳ trong cửa sổ đó.</li>
<li><strong>Vì sao giáo trình để cả hai hình.</strong> Vì đề thi hỏi cả hai kiểu. Đề cho một hàng tiêu đề "FI DI CO FO EI WO" và các hàng đánh số xuống dưới thì nó muốn bố cục <em>NÀY</em>. Đề cho một hàng chu kỳ đồng hồ thì nó muốn bố cục của Figure 16.10. <strong>Nội dung y hệt; chỉ khác phép chuyển vị.</strong> Hãy luyện chuyển qua chuyển lại — mất 30 giây và bảo đảm bạn không bị hớ.</li>
<li><strong>Để ý thứ mà panel phải KHÔNG vẽ.</strong> Nó hoàn toàn không vẽ I4–I7 — chúng đã bị xoá khỏi lịch sử. Còn Figure 16.11 (slide 21) thì <em>CÓ</em> vẽ chúng, dở dang giữa chừng. Hai bức hình mô tả cùng một sự kiện từ hai lập trường: một bức cho thấy CÔNG SỨC BỊ PHÍ, bức kia cho thấy CỖ MÁY BỊ RỖNG.</li>
</ul>
<p class="meo">💡 Cách chuyển giữa hai bố cục: ở Figure 16.10 thì LỆNH đứng yên theo hàng còn tên TẦNG di chuyển; ở Figure 16.13 thì TẦNG đứng yên theo cột còn tên LỆNH di chuyển. <strong>Cái gì nằm ở tiêu đề thì đứng yên; cái gì nằm trong ô thì chạy.</strong></p>`],

      [24, 'Figure 16.14 — Speedup Factors with Instruction Pipelining',
        `<p class="y-chinh">🎯 Two graphs, and between them they contain the <strong>entire quantitative content of this chapter</strong>. (a) speedup against <em>number of instructions n</em>, one curve each for k = 6, 9 and 12 stages. (b) speedup against <em>number of stages k</em>, one curve each for n = 10, 20 and 30 instructions. The formula behind both is not printed anywhere on the slide — here it is.</p>
<table>
<tr><th>Quantity</th><th>Formula</th><th>Meaning of each symbol</th></tr>
<tr><td>Time WITHOUT pipelining</td><td><strong>T<sub>1</sub> = n × k × τ</strong></td><td>Each of the n instructions serially occupies all k stages</td></tr>
<tr><td>Time WITH pipelining</td><td><strong>T<sub>k</sub> = (k + n − 1) × τ</strong></td><td>k cycles to fill the pipe, then one instruction finishes per cycle</td></tr>
<tr><td>Speedup</td><td><strong>S = T<sub>1</sub>/T<sub>k</sub> = nk / (k + n − 1)</strong></td><td>τ cancels — the answer never depends on the cycle time</td></tr>
<tr><td>Ceiling</td><td><strong>lim<sub>n→∞</sub> S = k</strong></td><td>With infinitely many instructions the fill cost vanishes and you gain exactly k</td></tr>
</table>
<p class="nhan">📐 <strong>Five worked problems. Every number below was computed and checked by machine, and the last block cross-checks them against the curves on this very slide.</strong></p>
<table>
<tr><th>#</th><th>Problem</th><th>Without pipeline</th><th>With pipeline</th><th>Speedup</th></tr>
<tr><td>1</td><td>n = 9 instructions, k = 6 stages (this is Figure 16.10)</td><td>9×6 = 54 τ</td><td>6+9−1 = 14 τ</td><td>54/14 = <strong>3,857</strong></td></tr>
<tr><td>2</td><td>n = 30, k = 6</td><td>180 τ</td><td>35 τ</td><td>180/35 = <strong>5,143</strong></td></tr>
<tr><td>3</td><td>n = 20, k = 9</td><td>180 τ</td><td>28 τ</td><td>180/28 = <strong>6,429</strong></td></tr>
<tr><td>4</td><td>n = 128, k = 12</td><td>1536 τ</td><td>139 τ</td><td>1536/139 = <strong>11,050</strong></td></tr>
<tr><td>5</td><td>n = 1000, k = 6 (long program)</td><td>6000 τ</td><td>1005 τ</td><td>6000/1005 = <strong>5,970</strong> — essentially the ceiling 6</td></tr>
</table>
<p class="dap-an">✅ <strong>The REVERSE problem — "how many instructions do you need to reach 90% of the speedup ceiling?"</strong> Set S = 0,9k and solve: nk/(k+n−1) = 0,9k ⇒ n = 0,9(k + n − 1) ⇒ 0,1n = 0,9(k−1) ⇒ <strong>n = 9(k − 1)</strong>. So: <strong>k = 6 → n = 45</strong> (check: 270/50 = 5,4 = 0,9×6 ✓) · <strong>k = 9 → n = 72</strong> · <strong>k = 12 → n = 99</strong> · <strong>k = 20 → n = 171</strong>. Generalising to any fraction f: <strong>n = f(k−1)/(1−f)</strong> — for 99% of the ceiling with k = 20 you need <strong>1881</strong> instructions without a single branch. Real code branches every 5–7 instructions, which is why the ceiling is a fiction and slides 25–37 matter more than this graph.</p>
<ul>
<li class="nhan"><strong>Cross-check against the picture, which is the whole point of a graph.</strong> Panel (a) at n = 128: the formula gives k=6 → 5,77, k=9 → 8,47, k=12 → 11,05. Read those three curve endpoints off the slide: they sit just under 6, just under 8,5, and just over 11. <strong>Exact match.</strong> Panel (b) at k = 20: formula gives n=10 → 6,90, n=20 → 10,26, n=30 → 12,24; the slide's three curves end at roughly 6,9, 10,3 and 12,2. <strong>Exact match again.</strong> The formula and the figure are the same object.</li>
<li><strong>Read the SHAPE of panel (a) and you have the exam answer for free.</strong> Every curve rises steeply then flattens. The flattening is the ceiling k. The message: <em>a deep pipeline is only worth it if you have a long uninterrupted run of instructions to feed it.</em></li>
<li><strong>Read the SHAPE of panel (b) and you have the "why not 100 stages" answer.</strong> For a fixed n, adding stages gives less and less. At n = 10, going from k = 10 to k = 20 improves speedup from 5,26 to only 6,90 — you doubled the hardware for 31% more performance. And this graph does not even include the branch penalty of slide 21, which would bend those curves back <em>downwards</em>.</li>
<li><strong>What the model assumes, said out loud.</strong> All stages equal duration; no hazards; no branches; no latch overhead. Slide 18 added latch cost, slide 21 added branch cost. This graph is the optimistic bound, not a prediction.</li>
</ul>
<p class="pitfall">⚠️ The most common exam error: writing T<sub>k</sub> = (k + n) τ instead of (k + n − 1) τ. Sanity-check with n = 1: one instruction through k stages must take exactly <strong>k</strong> cycles, and k + 1 − 1 = k ✓, whereas k + 1 ✗. Always test your formula at n = 1 before using it.</p>`,
        `<p class="y-chinh">🎯 Hai đồ thị, và chúng chứa <strong>TOÀN BỘ phần định lượng của chương này</strong>. (a) tăng tốc theo <em>số lệnh n</em>, mỗi đường một giá trị k = 6, 9, 12 tầng. (b) tăng tốc theo <em>số tầng k</em>, mỗi đường một giá trị n = 10, 20, 30 lệnh. Công thức đằng sau cả hai KHÔNG được in ở đâu trên slide — nó đây.</p>
<table>
<tr><th>Đại lượng</th><th>Công thức</th><th>Ý nghĩa từng ký hiệu</th></tr>
<tr><td>Thời gian KHÔNG pipeline</td><td><strong>T<sub>1</sub> = n × k × τ</strong></td><td>Mỗi lệnh trong n lệnh lần lượt chiếm cả k tầng</td></tr>
<tr><td>Thời gian CÓ pipeline</td><td><strong>T<sub>k</sub> = (k + n − 1) × τ</strong></td><td>k chu kỳ để đổ đầy ống, sau đó mỗi chu kỳ xong một lệnh</td></tr>
<tr><td>Tăng tốc</td><td><strong>S = T<sub>1</sub>/T<sub>k</sub> = nk / (k + n − 1)</strong></td><td>τ TRIỆT TIÊU — đáp án không bao giờ phụ thuộc vào chu kỳ đồng hồ</td></tr>
<tr><td>Trần</td><td><strong>lim<sub>n→∞</sub> S = k</strong></td><td>Với vô hạn lệnh thì phí đổ đầy tan biến và bạn lời đúng k lần</td></tr>
</table>
<p class="nhan">📐 <strong>Năm bài giải mẫu. Mọi con số dưới đây đều đã được máy tính và kiểm, và khối cuối đối chiếu chúng ngược lại với chính các đường cong trên slide này.</strong></p>
<table>
<tr><th>#</th><th>Đề</th><th>Không pipeline</th><th>Có pipeline</th><th>Tăng tốc</th></tr>
<tr><td>1</td><td>n = 9 lệnh, k = 6 tầng (chính là Figure 16.10)</td><td>9×6 = 54 τ</td><td>6+9−1 = 14 τ</td><td>54/14 = <strong>3,857</strong></td></tr>
<tr><td>2</td><td>n = 30, k = 6</td><td>180 τ</td><td>35 τ</td><td>180/35 = <strong>5,143</strong></td></tr>
<tr><td>3</td><td>n = 20, k = 9</td><td>180 τ</td><td>28 τ</td><td>180/28 = <strong>6,429</strong></td></tr>
<tr><td>4</td><td>n = 128, k = 12</td><td>1536 τ</td><td>139 τ</td><td>1536/139 = <strong>11,050</strong></td></tr>
<tr><td>5</td><td>n = 1000, k = 6 (chương trình dài)</td><td>6000 τ</td><td>1005 τ</td><td>6000/1005 = <strong>5,970</strong> — coi như chạm trần 6</td></tr>
</table>
<p class="dap-an">✅ <strong>BÀI NGƯỢC — "cần bao nhiêu lệnh để đạt 90% trần tăng tốc?"</strong> Đặt S = 0,9k rồi giải: nk/(k+n−1) = 0,9k ⇒ n = 0,9(k + n − 1) ⇒ 0,1n = 0,9(k−1) ⇒ <strong>n = 9(k − 1)</strong>. Vậy: <strong>k = 6 → n = 45</strong> (kiểm lại: 270/50 = 5,4 = 0,9×6 ✓) · <strong>k = 9 → n = 72</strong> · <strong>k = 12 → n = 99</strong> · <strong>k = 20 → n = 171</strong>. Tổng quát cho tỉ lệ f bất kỳ: <strong>n = f(k−1)/(1−f)</strong> — muốn đạt 99% trần với k = 20 thì cần <strong>1881</strong> lệnh mà không một lệnh rẽ nhánh nào. Mã thật rẽ nhánh mỗi 5–7 lệnh, nên cái trần chỉ là chuyện viễn tưởng và slide 25–37 còn quan trọng hơn cái đồ thị này.</p>
<ul>
<li class="nhan"><strong>ĐỐI CHIẾU với chính bức hình — đó mới là công dụng của một đồ thị.</strong> Panel (a) tại n = 128: công thức cho k=6 → 5,77, k=9 → 8,47, k=12 → 11,05. Đọc ba điểm cuối đường cong trên slide: chúng nằm ngay dưới 6, ngay dưới 8,5, và nhỉnh trên 11. <strong>KHỚP CHÍNH XÁC.</strong> Panel (b) tại k = 20: công thức cho n=10 → 6,90, n=20 → 10,26, n=30 → 12,24; ba đường trên slide kết thúc quanh 6,9, 10,3 và 12,2. <strong>KHỚP CHÍNH XÁC lần nữa.</strong> Công thức và hình vẽ là cùng một vật.</li>
<li><strong>Đọc HÌNH DÁNG của panel (a) là bạn có đáp án thi miễn phí.</strong> Mọi đường cong đều dốc lên rồi phẳng ra. Chỗ phẳng chính là cái trần k. Thông điệp: <em>pipeline sâu chỉ đáng đồng tiền nếu bạn có một mạch lệnh dài không đứt đoạn để nuôi nó.</em></li>
<li><strong>Đọc HÌNH DÁNG của panel (b) là bạn có đáp án cho câu "sao không làm 100 tầng".</strong> Với n cố định, thêm tầng cho lợi ích ngày càng ít. Tại n = 10, đi từ k = 10 lên k = 20 chỉ nâng tăng tốc từ 5,26 lên 6,90 — bạn gấp đôi phần cứng để được thêm 31% hiệu năng. Mà đồ thị này còn CHƯA tính phạt rẽ nhánh của slide 21, thứ sẽ bẻ những đường cong đó QUẶP XUỐNG.</li>
<li><strong>Mô hình giả định gì, nói thẳng ra.</strong> Mọi tầng dài bằng nhau; không xung đột; không rẽ nhánh; không phí chốt. Slide 18 đã thêm phí chốt, slide 21 đã thêm phí rẽ nhánh. Đồ thị này là CẬN TRÊN lạc quan, không phải một dự báo.</li>
</ul>
<p class="pitfall">⚠️ Lỗi thi thường gặp nhất: viết T<sub>k</sub> = (k + n) τ thay vì (k + n − 1) τ. Kiểm tỉnh táo bằng n = 1: một lệnh đi qua k tầng phải tốn đúng <strong>k</strong> chu kỳ, mà k + 1 − 1 = k ✓, còn k + 1 thì ✗. Luôn thử công thức tại n = 1 trước khi dùng nó.</p>`],

      [25, 'Pipeline Hazards — the three types and the bubble',
        `<p class="y-chinh">🎯 The definition, straight off the slide: a hazard occurs "when the pipeline, or some portion of the pipeline, <strong>must stall because conditions do not permit continued execution</strong>". A stall is "also referred to as a <strong>pipeline bubble</strong>". And there are exactly <strong>three types: Resource, Data, Control</strong>.</p>
<table>
<tr><th>Type</th><th>Cause in one line</th><th>Example pair of instructions</th><th>Cost</th><th>Cure</th></tr>
<tr><td><strong>Resource</strong> (structural)</td><td>Two stages want the <em>same piece of hardware</em> in the same cycle</td><td><code>LOAD R1,[2000]</code> then any instruction whose FI collides with its FO</td><td>1 cycle per collision (slide 26)</td><td>Duplicate the resource: <strong>split I-cache / D-cache</strong>, second memory port, second ALU</td></tr>
<tr><td><strong>Data</strong></td><td>An instruction needs a <em>value</em> a previous instruction has not written yet</td><td><code>ADD EAX, EBX</code> then <code>SUB ECX, EAX</code></td><td>2 cycles in Figure 16.16 (slide 27)</td><td><strong>Forwarding</strong> (bypass), <strong>instruction reordering</strong> by the compiler, interlock hardware</td></tr>
<tr><td><strong>Control</strong> (branch)</td><td>The pipeline fetched down the <em>wrong path</em> after a branch</td><td><code>CMP EAX,0</code> / <code>JZ label</code> then whatever follows</td><td>4 cycles at k = 6, 18 at k = 20 (slide 21)</td><td><strong>Branch prediction</strong>, prefetch branch target, loop buffer, delayed branch (slides 29–37)</td></tr>
</table>
<p class="nhan">📐 <strong>Control hazard drawn as a bubble table</strong> — the branch is resolved at EI, so cycles 8–11 contain nothing but refill. Compare the "wasted" rows with the clean staircase of slide 20:</p>
<table>
<tr><th>Instr</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th></tr>
<tr><td><code>CMP EAX,0</code></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><code>JZ label</code> (branch)</td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td><strong>EI</strong></td><td>WO</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>wrong-path instr ✗</td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td><strong>bọt</strong></td><td><strong>bọt</strong></td><td><strong>bọt</strong></td><td></td><td></td><td></td></tr>
<tr><td>wrong-path instr ✗</td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td><strong>bọt</strong></td><td><strong>bọt</strong></td><td><strong>bọt</strong></td><td></td><td></td><td></td></tr>
<tr><td><code>label:</code> first instr</td><td></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td></tr>
</table>
<ul>
<li><strong>"Bubble" is a precise word, not a metaphor for "slow".</strong> A bubble is an empty slot that travels through the pipeline exactly like an instruction, occupying a stage each cycle and producing nothing. Insert one bubble and every later instruction is delayed by one cycle — the delay does not heal.</li>
<li><strong>The three types map cleanly onto three different scarce things.</strong> Resource hazard = scarcity of <em>hardware</em>. Data hazard = scarcity of <em>time</em> (the value isn't ready). Control hazard = scarcity of <em>knowledge</em> (we don't know where we're going). Classify any exam scenario by asking which of those three is missing.</li>
<li><strong>Which is worst in practice? Control, by a wide margin.</strong> Resource hazards are designed away once (split caches, more ports). Data hazards are mostly removed by forwarding. But control hazards depend on <em>data the machine has not computed yet</em>, so the only defence is guessing — which is why the textbook spends five techniques and eight slides on it (slides 29–37).</li>
<li><strong>The three cures, in order of cheapness.</strong> (1) <em>Compiler</em>: reorder instructions so the dependent one is further away — free, no hardware. (2) <em>Forwarding</em>: wire the ALU output back to the ALU input — a few wires, removes most data hazards entirely. (3) <em>Prediction</em>: a table of past branch outcomes — expensive, but the only option for control hazards.</li>
</ul>
<p class="meo">💡 Three words to hold the taxonomy: <strong>Resource = "cùng đồ nghề", Data = "chưa có kết quả", Control = "không biết đi đâu"</strong>. Every hazard question in every exam is one of those three sentences in disguise.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa, nguyên văn trên slide: xung đột xảy ra "khi đường ống, hoặc một phần của đường ống, <strong>PHẢI KHỰNG LẠI vì điều kiện không cho phép tiếp tục thực thi</strong>". Một lần khựng "còn được gọi là <strong>BỌT pipeline</strong> (pipeline bubble)". Và có đúng <strong>BA loại: Resource, Data, Control</strong>.</p>
<table>
<tr><th>Loại</th><th>Nguyên nhân gói trong một dòng</th><th>Cặp lệnh ví dụ</th><th>Chi phí</th><th>Cách chữa</th></tr>
<tr><td><strong>Tài nguyên (cấu trúc)</strong></td><td>Hai tầng cùng muốn <em>MỘT mẩu phần cứng</em> trong cùng một chu kỳ</td><td><code>LOAD R1,[2000]</code> rồi một lệnh có FI đụng vào FO của nó</td><td>1 chu kỳ mỗi lần đụng (slide 26)</td><td>Nhân đôi tài nguyên: <strong>tách I-cache / D-cache</strong>, thêm cổng bộ nhớ, thêm ALU</td></tr>
<tr><td><strong>Dữ liệu</strong></td><td>Một lệnh cần một <em>GIÁ TRỊ</em> mà lệnh trước chưa ghi xong</td><td><code>ADD EAX, EBX</code> rồi <code>SUB ECX, EAX</code></td><td>2 chu kỳ trong Figure 16.16 (slide 27)</td><td><strong>Forwarding</strong> (chuyển tiếp/bắc cầu), <strong>đổi thứ tự lệnh</strong> bằng trình biên dịch, mạch khoá liên động</td></tr>
<tr><td><strong>Điều khiển (rẽ nhánh)</strong></td><td>Đường ống đã nạp theo <em>ĐƯỜNG SAI</em> sau một lệnh rẽ</td><td><code>CMP EAX,0</code> / <code>JZ label</code> rồi thứ đi sau đó</td><td>4 chu kỳ ở k = 6, 18 ở k = 20 (slide 21)</td><td><strong>Dự đoán rẽ nhánh</strong>, nạp trước đích rẽ, bộ đệm vòng lặp, rẽ nhánh trì hoãn (slide 29–37)</td></tr>
</table>
<p class="nhan">📐 <strong>Xung đột điều khiển vẽ thành bảng bọt</strong> — lệnh rẽ được giải ở EI, nên chu kỳ 8–11 chẳng chứa gì ngoài việc nạp lại. So các hàng "phí công" với cái cầu thang sạch sẽ của slide 20:</p>
<table>
<tr><th>Lệnh</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th></tr>
<tr><td><code>CMP EAX,0</code></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><code>JZ label</code> (lệnh rẽ)</td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td><strong>EI</strong></td><td>WO</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>lệnh đường sai ✗</td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td><strong>bọt</strong></td><td><strong>bọt</strong></td><td><strong>bọt</strong></td><td></td><td></td><td></td></tr>
<tr><td>lệnh đường sai ✗</td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td><strong>bọt</strong></td><td><strong>bọt</strong></td><td><strong>bọt</strong></td><td></td><td></td><td></td></tr>
<tr><td><code>label:</code> lệnh đầu</td><td></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>CO</td><td>FO</td><td>EI</td><td>WO</td></tr>
</table>
<ul>
<li><strong>"Bọt" là một từ CHÍNH XÁC, không phải phép ẩn dụ cho "chậm".</strong> Một cái bọt là một KHE TRỐNG di chuyển qua đường ống ĐÚNG NHƯ một lệnh, mỗi chu kỳ chiếm một tầng và không sản xuất ra gì. Chèn một bọt vào là mọi lệnh phía sau trễ một chu kỳ — độ trễ đó KHÔNG tự lành lại.</li>
<li><strong>Ba loại ánh xạ rất gọn lên ba thứ khan hiếm khác nhau.</strong> Xung đột tài nguyên = khan hiếm <em>PHẦN CỨNG</em>. Xung đột dữ liệu = khan hiếm <em>THỜI GIAN</em> (giá trị chưa kịp có). Xung đột điều khiển = khan hiếm <em>TRI THỨC</em> (chưa biết sẽ đi đâu). Gặp tình huống nào trong đề, cứ hỏi ba thứ đó cái nào đang thiếu.</li>
<li><strong>Cái nào tệ nhất trong thực tế? ĐIỀU KHIỂN, tệ hơn hẳn phần còn lại.</strong> Xung đột tài nguyên thiết kế một lần là hết (tách cache, thêm cổng). Xung đột dữ liệu phần lớn bị forwarding xoá sạch. Nhưng xung đột điều khiển phụ thuộc vào <em>dữ liệu mà cỗ máy CHƯA tính ra</em>, nên phòng thủ duy nhất là ĐOÁN — đó là lý do giáo trình dành năm kỹ thuật và tám slide cho nó (slide 29–37).</li>
<li><strong>Ba cách chữa, xếp theo độ rẻ.</strong> (1) <em>Trình biên dịch</em>: đổi thứ tự lệnh cho lệnh phụ thuộc nằm xa ra — miễn phí, không tốn phần cứng. (2) <em>Forwarding</em>: nối thẳng đầu ra ALU trở lại đầu vào ALU — vài sợi dây, xoá gần hết xung đột dữ liệu. (3) <em>Dự đoán</em>: một bảng lịch sử kết quả rẽ nhánh — đắt, nhưng là lựa chọn DUY NHẤT cho xung đột điều khiển.</li>
</ul>
<p class="meo">💡 Ba câu để giữ cả bảng phân loại: <strong>Tài nguyên = "cùng đồ nghề", Dữ liệu = "chưa có kết quả", Điều khiển = "không biết đi đâu"</strong>. Mọi câu hỏi về xung đột trong mọi đề thi đều là một trong ba câu đó, nguỵ trang lại.</p>`],

      [26, 'Figure 16.15 — Example of Resource Hazard',
        `<p class="y-chinh">🎯 A resource hazard shown by putting two diagrams side by side: <strong>(a) Five-stage pipeline, ideal case</strong> and <strong>(b) I1 source operand in memory</strong>. The only difference is one word — <code>Idle</code> — in I3's row at cycle 3, and it delays everything after it.</p>
<p class="nhan">📐 <strong>(a) ideal — 4 instructions, 5 stages, finishes at cycle 8:</strong></p>
<table>
<tr><th>Instr</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr>
<tr><td><strong>I1</strong></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I2</strong></td><td></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td></tr>
<tr><td><strong>I3</strong></td><td></td><td></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td></tr>
<tr><td><strong>I4</strong></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td><td></td></tr>
</table>
<p class="nhan">📐 <strong>(b) I1's source operand is in memory — so I1's FO (cycle 3) and I3's FI (cycle 3) both want memory. I3 goes Idle and finishes at cycle 9:</strong></p>
<table>
<tr><th>Instr</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr>
<tr><td><strong>I1</strong></td><td>FI</td><td>DI</td><td><strong>FO</strong></td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I2</strong></td><td></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td></tr>
<tr><td><strong>I3</strong></td><td></td><td></td><td><strong>Idle</strong></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td><td></td></tr>
<tr><td><strong>I4</strong></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td></tr>
</table>
<ul>
<li class="dap-an">✅ <strong>Answer: exactly 1 cycle is lost, and it does not heal.</strong> In (a), I4 finishes at cycle 8; in (b) it finishes at cycle 9. The bubble inserted into I3 propagates to I4 and to every instruction after it. Verified by simulation, and it reproduces the slide cell for cell.</li>
<li><strong>Why the collision happens at all.</strong> Both FI (fetch instruction) and FO (fetch operand) are memory reads. With a <em>single</em> memory port, only one can go per cycle. The instruction that loses is the younger one (I3), because the older one is further down the pipe and stalling it would be worse.</li>
<li><strong>The cure names a piece of Chương 4 directly.</strong> Give the processor a <strong>split L1: an instruction cache and a data cache</strong>. Then FI goes to the I-cache and FO goes to the D-cache, and they proceed simultaneously — the hazard disappears. This is exactly why Figure 4.3 in Chương 4 drew <em>two humps</em> (instruction addresses and data addresses) and why every real CPU has L1-I and L1-D as separate boxes.</li>
<li><strong>Other resource hazards you should be able to name.</strong> Two instructions both needing the ALU (fix: a second ALU, or a separate address adder). Two instructions both writing the register file in the same cycle (fix: a second write port). The pattern is always the same: <em>duplicate the contended unit, or accept the bubble</em>.</li>
<li><strong>Read the title's small print: "I1 source operand in memory".</strong> The hazard is caused by the <em>addressing mode</em> of I1, not by anything about I3. Change I1 to use a register operand and the hazard vanishes. This is another argument for load/store architectures (Chương 13): if only <code>LOAD</code> and <code>STORE</code> touch memory, the designer knows exactly which instructions can cause this.</li>
</ul>
<p class="pitfall">⚠️ <strong>Two warnings about this slide specifically.</strong> First: Figure 16.15 uses a <strong>FIVE-stage</strong> pipeline — FI, DI, FO, EI, WO — with <strong>CO dropped</strong>, while Figures 16.10–16.13 used six. The textbook switches stage counts mid-chapter without saying so. Count the columns in the question before you answer. Second: the slide's own axis label reads "<strong>Instrutcion</strong>" — a typo on the original Pearson figure, printed twice.</p>`,
        `<p class="y-chinh">🎯 Xung đột tài nguyên được trình bày bằng cách đặt hai giản đồ cạnh nhau: <strong>(a) Five-stage pipeline, ideal case</strong> (pipeline năm tầng, ca lý tưởng) và <strong>(b) I1 source operand in memory</strong> (toán hạng nguồn của I1 nằm trong bộ nhớ). Khác biệt duy nhất là một chữ — <code>Idle</code> — ở hàng I3 tại chu kỳ 3, và nó làm trễ mọi thứ phía sau.</p>
<p class="nhan">📐 <strong>(a) lý tưởng — 4 lệnh, 5 tầng, xong ở chu kỳ 8:</strong></p>
<table>
<tr><th>Lệnh</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr>
<tr><td><strong>I1</strong></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I2</strong></td><td></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td></tr>
<tr><td><strong>I3</strong></td><td></td><td></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td></tr>
<tr><td><strong>I4</strong></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td><td></td></tr>
</table>
<p class="nhan">📐 <strong>(b) toán hạng nguồn của I1 nằm trong bộ nhớ — nên FO của I1 (chu kỳ 3) và FI của I3 (chu kỳ 3) cùng muốn bộ nhớ. I3 phải Idle và xong ở chu kỳ 9:</strong></p>
<table>
<tr><th>Lệnh</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr>
<tr><td><strong>I1</strong></td><td>FI</td><td>DI</td><td><strong>FO</strong></td><td>EI</td><td>WO</td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>I2</strong></td><td></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td><td></td></tr>
<tr><td><strong>I3</strong></td><td></td><td></td><td><strong>Idle</strong></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td><td></td></tr>
<tr><td><strong>I4</strong></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td></tr>
</table>
<ul>
<li class="dap-an">✅ <strong>Đáp án: mất đúng 1 chu kỳ, và nó KHÔNG tự lành.</strong> Ở (a), I4 xong ở chu kỳ 8; ở (b) nó xong ở chu kỳ 9. Cái bọt chèn vào I3 lan sang I4 và sang mọi lệnh phía sau. Đã kiểm bằng mô phỏng, và nó dựng lại slide ĐÚNG TỪNG Ô.</li>
<li><strong>Vì sao có va chạm.</strong> Cả FI (nạp lệnh) lẫn FO (nạp toán hạng) đều là đọc bộ nhớ. Với <em>MỘT</em> cổng bộ nhớ, mỗi chu kỳ chỉ một cái đi được. Đứa thua là đứa TRẺ hơn (I3), vì đứa già hơn đã đi sâu vào ống rồi, chặn nó lại còn tệ hơn.</li>
<li><strong>Cách chữa gọi thẳng tên một mẩu của Chương 4.</strong> Cho bộ xử lý một <strong>L1 TÁCH ĐÔI: cache lệnh riêng và cache dữ liệu riêng</strong>. Khi đó FI đi vào I-cache còn FO đi vào D-cache, và chúng chạy ĐỒNG THỜI — xung đột biến mất. Đây chính xác là lý do Figure 4.3 của Chương 4 vẽ <em>HAI CÁI BƯỚU</em> (địa chỉ lệnh và địa chỉ dữ liệu) và là lý do mọi CPU thật đều có L1-I và L1-D thành hai ô riêng.</li>
<li><strong>Vài xung đột tài nguyên khác bạn nên gọi tên được.</strong> Hai lệnh cùng cần ALU (chữa: thêm một ALU nữa, hoặc một bộ cộng địa chỉ riêng). Hai lệnh cùng ghi vào tệp thanh ghi trong cùng một chu kỳ (chữa: thêm một cổng ghi). Khuôn mẫu luôn giống nhau: <em>nhân đôi cái khối bị giành, hoặc chấp nhận cái bọt</em>.</li>
<li><strong>Đọc dòng chữ nhỏ trong tiêu đề: "I1 source operand in memory".</strong> Xung đột do <em>CHẾ ĐỘ ĐỊA CHỈ của I1</em> gây ra, chứ không phải do điều gì ở I3. Đổi I1 sang dùng toán hạng thanh ghi là xung đột biến mất. Đây lại thêm một lập luận cho kiến trúc load/store (Chương 13): nếu chỉ <code>LOAD</code> và <code>STORE</code> đụng bộ nhớ thì người thiết kế biết chính xác lệnh nào có thể gây ra chuyện này.</li>
</ul>
<p class="pitfall">⚠️ <strong>Hai cảnh báo riêng về slide này.</strong> Thứ nhất: Figure 16.15 dùng pipeline <strong>NĂM TẦNG</strong> — FI, DI, FO, EI, WO — <strong>BỎ CO</strong>, trong khi Figure 16.10–16.13 dùng sáu. Giáo trình đổi số tầng giữa chừng mà không nói. Hãy ĐẾM CỘT trong đề trước khi trả lời. Thứ hai: nhãn trục của chính slide ghi "<strong>Instrutcion</strong>" — lỗi chính tả trên hình gốc của Pearson, in tới hai lần.</p>`],

      [27, 'Figure 16.16 — Example of Data Hazard',
        `<p class="y-chinh">🎯 A data hazard with real instructions on the row labels — <code>ADD EAX, EBX</code> followed by <code>SUB ECX, EAX</code>. SUB needs EAX, but ADD has not written it yet. The figure inserts <strong>Idle across cycles 4 and 5</strong> and everything after is pushed back two cycles.</p>
<table>
<tr><th>Instruction</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th></tr>
<tr><td><code>ADD EAX, EBX</code></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td><strong>WO</strong></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><code>SUB ECX, EAX</code></td><td></td><td>FI</td><td>DI</td><td><strong>Idle</strong></td><td><strong>Idle</strong></td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td></tr>
<tr><td><strong>I3</strong></td><td></td><td></td><td>FI</td><td></td><td></td><td>DI</td><td>FO</td><td>EI</td><td>WO</td><td></td></tr>
<tr><td><strong>I4</strong></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td></tr>
</table>
<ul>
<li class="dap-an">✅ <strong>Trace it and the 2-cycle answer falls out.</strong> ADD writes EAX in its <strong>WO</strong> stage = cycle 5. SUB reads EAX in its <strong>FO</strong> stage, which without the hazard would have been cycle 4 — <em>one cycle too early</em>. The earliest legal FO for SUB is cycle 6 (after the write lands). So SUB stalls in cycles 4 and 5: <strong>2 cycles lost</strong>. SUB finishes at cycle 8 instead of 6; I4 finishes at cycle 10 instead of 8. Reproduced cell for cell by simulation.</li>
<li><strong>The dependency is invisible unless you read the operands.</strong> <code>ADD EAX, EBX</code> means EAX ← EAX + EBX; <code>SUB ECX, EAX</code> means ECX ← ECX − EAX. The shared name <strong>EAX</strong> is the whole problem. Change the second instruction to <code>SUB ECX, EDX</code> and there is no hazard at all — same pipeline, same cycles, zero stalls.</li>
<li class="nhan"><strong>Cure 1 — FORWARDING (bypassing), and it removes the stall completely.</strong> The ADD's result exists at the <em>output of the ALU</em> at the end of EI (cycle 4). It only reaches EAX at WO (cycle 5), but the pipeline can wire that ALU output straight back to the ALU input for the next instruction. With forwarding the table becomes the clean staircase again:
<table>
<tr><th>Instruction</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
<tr><td><code>ADD EAX, EBX</code></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td><td></td></tr>
<tr><td><code>SUB ECX, EAX</code></td><td></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td></tr>
</table>
<strong>0 cycles lost.</strong> Note: forwarding is <em>not on this slide</em> — the textbook covers it in the superscalar chapter — but every real pipeline has it, and exam questions increasingly ask for it.</li>
<li><strong>Cure 2 — instruction reordering by the compiler.</strong> If some independent instruction I<sub>x</sub> exists that does not use EAX, the compiler can move it between ADD and SUB. The bubble is then filled with useful work instead of nothing. This costs no hardware at all and is why compilers are said to "schedule" instructions.</li>
<li><strong>Connect to PRF192 and to why <code>-O2</code> matters.</strong> When you write <code>a = b + c; d = a * 2;</code> you have created a RAW dependency in source code. An optimising compiler will interleave it with independent work; an unoptimised build will not, and the pipeline stalls. That is a large part of where the speed difference between <code>-O0</code> and <code>-O2</code> comes from.</li>
</ul>
<p class="pitfall">⚠️ Trap: "the stall is because SUB needs the ALU and ADD is using it". <strong>No</strong> — that would be a <em>resource</em> hazard. Here the ALU is free; what is missing is the <em>value</em>. Naming the wrong hazard type loses the mark even when the number of cycles is right.</p>`,
        `<p class="y-chinh">🎯 Một xung đột dữ liệu với LỆNH THẬT làm nhãn hàng — <code>ADD EAX, EBX</code> rồi tới <code>SUB ECX, EAX</code>. SUB cần EAX, nhưng ADD chưa ghi nó xong. Hình chèn <strong>Idle vào chu kỳ 4 và 5</strong> và mọi thứ phía sau bị đẩy lùi hai chu kỳ.</p>
<table>
<tr><th>Lệnh</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th></tr>
<tr><td><code>ADD EAX, EBX</code></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td><strong>WO</strong></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><code>SUB ECX, EAX</code></td><td></td><td>FI</td><td>DI</td><td><strong>Idle</strong></td><td><strong>Idle</strong></td><td>FO</td><td>EI</td><td>WO</td><td></td><td></td></tr>
<tr><td><strong>I3</strong></td><td></td><td></td><td>FI</td><td></td><td></td><td>DI</td><td>FO</td><td>EI</td><td>WO</td><td></td></tr>
<tr><td><strong>I4</strong></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td></tr>
</table>
<ul>
<li class="dap-an">✅ <strong>Lần theo từng bước là con số 2 chu kỳ tự rơi ra.</strong> ADD ghi EAX ở tầng <strong>WO</strong> = chu kỳ 5. SUB đọc EAX ở tầng <strong>FO</strong>, mà nếu không có xung đột thì đó là chu kỳ 4 — <em>SỚM HƠN MỘT CHU KỲ so với lúc giá trị có</em>. FO hợp lệ sớm nhất của SUB là chu kỳ 6 (sau khi phép ghi hạ cánh). Vậy SUB khựng ở chu kỳ 4 và 5: <strong>mất 2 chu kỳ</strong>. SUB xong ở chu kỳ 8 thay vì 6; I4 xong ở chu kỳ 10 thay vì 8. Mô phỏng dựng lại ĐÚNG TỪNG Ô.</li>
<li><strong>Sự phụ thuộc VÔ HÌNH trừ phi bạn đọc toán hạng.</strong> <code>ADD EAX, EBX</code> nghĩa là EAX ← EAX + EBX; <code>SUB ECX, EAX</code> nghĩa là ECX ← ECX − EAX. Cái tên dùng chung <strong>EAX</strong> mới là toàn bộ vấn đề. Đổi lệnh thứ hai thành <code>SUB ECX, EDX</code> là hết xung đột — cùng pipeline, cùng số chu kỳ, không khựng một nhịp nào.</li>
<li class="nhan"><strong>Cách chữa 1 — FORWARDING (bắc cầu/chuyển tiếp), và nó xoá sạch cái khựng.</strong> Kết quả của ADD đã TỒN TẠI ở <em>đầu ra của ALU</em> vào cuối tầng EI (chu kỳ 4). Nó chỉ tới được EAX ở WO (chu kỳ 5), nhưng pipeline có thể nối thẳng đầu ra ALU đó trở lại đầu vào ALU cho lệnh kế tiếp. Có forwarding thì bảng trở lại thành cái cầu thang sạch sẽ:
<table>
<tr><th>Lệnh</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
<tr><td><code>ADD EAX, EBX</code></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td><td></td></tr>
<tr><td><code>SUB ECX, EAX</code></td><td></td><td>FI</td><td>DI</td><td>FO</td><td>EI</td><td>WO</td></tr>
</table>
<strong>Mất 0 chu kỳ.</strong> Lưu ý: forwarding <em>KHÔNG có trên slide này</em> — giáo trình nói về nó ở chương superscalar — nhưng mọi pipeline thật đều có, và đề thi ngày càng hay hỏi.</li>
<li><strong>Cách chữa 2 — trình biên dịch ĐỔI THỨ TỰ lệnh.</strong> Nếu tồn tại một lệnh độc lập I<sub>x</sub> nào đó không dùng EAX, trình biên dịch có thể chuyển nó vào giữa ADD và SUB. Cái bọt khi ấy được lấp bằng CÔNG VIỆC CÓ ÍCH thay vì bằng không khí. Cách này không tốn một chút phần cứng nào, và là lý do người ta nói trình biên dịch "lập lịch" cho lệnh.</li>
<li><strong>Nối sang PRF192 và lý do <code>-O2</code> có ý nghĩa.</strong> Khi bạn viết <code>a = b + c; d = a * 2;</code> là bạn đã tạo ra một phụ thuộc RAW ngay trong mã nguồn. Trình biên dịch có tối ưu sẽ đan xen nó với việc độc lập khác; bản dựng không tối ưu thì không, và pipeline khựng. Đó là phần lớn chỗ mà chênh lệch tốc độ giữa <code>-O0</code> và <code>-O2</code> sinh ra.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: "khựng là vì SUB cần ALU mà ADD đang dùng ALU". <strong>SAI</strong> — như vậy sẽ là xung đột <em>TÀI NGUYÊN</em>. Ở đây ALU đang rảnh; thứ còn thiếu là <em>GIÁ TRỊ</em>. Gọi sai tên loại xung đột là mất điểm ngay cả khi số chu kỳ bạn tính đúng.</p>`],

      [28, 'Types of Data Hazard — RAW, WAR, WAW',
        `<p class="y-chinh">🎯 The taxonomy that closes this half of the chapter. There are exactly <strong>three</strong> data hazards, and the slide names each one twice — by the access order (RAW/WAR/WAW) and by the dependency type (true / anti / output).</p>
<table>
<tr><th>Hazard</th><th>Other name</th><th>The slide's wording</th><th>Example</th><th>Real dependency?</th></tr>
<tr><td><strong>RAW</strong> — Read After Write</td><td><em>True dependency</em></td><td>An instruction modifies a register or memory location; the succeeding instruction reads that location. The hazard occurs if the <strong>read takes place before the write operation is complete</strong></td><td><code>ADD EAX, EBX</code> · <code>SUB ECX, EAX</code></td><td><strong>YES</strong> — the value genuinely has to flow</td></tr>
<tr><td><strong>WAR</strong> — Write After Read</td><td><em>Antidependency</em></td><td>An instruction reads a register or memory location; the succeeding instruction writes to that location. The hazard occurs if the <strong>write completes before the read takes place</strong></td><td><code>SUB ECX, EAX</code> · <code>ADD EAX, EDX</code></td><td>NO — it is a <em>name</em> collision only</td></tr>
<tr><td><strong>WAW</strong> — Write After Write</td><td><em>Output dependency</em></td><td>Two instructions both write to the same location. The hazard occurs if the <strong>write operations take place in the reverse order of the intended sequence</strong></td><td><code>MOV EAX, 1</code> · <code>MOV EAX, 2</code></td><td>NO — a <em>name</em> collision only</td></tr>
</table>
<ul>
<li><strong>The crucial distinction the slide makes with one word: "TRUE".</strong> RAW is called a <em>true</em> dependency because the second instruction genuinely needs the first one's result — no amount of cleverness removes it, you can only shorten the wait (forwarding). WAR and WAW are <em>false</em> dependencies: nothing flows between the instructions, they just happen to use the same register <em>name</em>.</li>
<li><strong>And the consequence of that distinction is enormous.</strong> A false dependency can be eliminated entirely by <strong>register renaming</strong> — give the second instruction a different physical register, and the conflict disappears. That is precisely what out-of-order superscalar processors do (the next chapter of the book). <strong>RAW is physics; WAR and WAW are bookkeeping.</strong></li>
<li class="dap-an">✅ <strong>Worked classification, the standard exam format.</strong> Given the sequence <code>I1: ADD R3, R1, R2</code> · <code>I2: SUB R5, R3, R4</code> · <code>I3: MUL R3, R6, R7</code> — identify every hazard. <strong>I1→I2 on R3: RAW</strong> (I1 writes R3, I2 reads it — a true dependency, cannot be removed). <strong>I2→I3 on R3: WAR</strong> (I2 reads R3, I3 writes it — antidependency, removable by renaming). <strong>I1→I3 on R3: WAW</strong> (both write R3 — output dependency, removable by renaming). One register, all three hazard types, in three instructions.</li>
<li><strong>Why WAR and WAW cannot happen in a simple in-order pipeline.</strong> In Figure 16.10's pipeline every instruction writes in WO, and WO happens in program order, so writes can never overtake reads or other writes. WAR and WAW only bite once a machine issues or completes instructions <em>out of order</em>. If an exam question asks "which hazards can occur in a simple 6-stage in-order pipeline?", the answer is <strong>RAW only</strong>.</li>
<li><strong>Memory counts too, not just registers.</strong> Read the slide's wording carefully: "a register <em>or memory location</em>". <code>STORE [1000], R1</code> followed by <code>LOAD R2, [1000]</code> is a RAW hazard through memory — and it is harder to detect, because the addresses may only be known at run time. This is why memory disambiguation is one of the hardest parts of a modern CPU.</li>
</ul>
<p class="meo">💡 The names decode themselves if you read them as "<strong>[second operation] after [first operation]</strong>". RAW = the <em>read</em> comes after the <em>write</em> in the program, so the danger is the read happening too early. WAR = the <em>write</em> comes after the <em>read</em>, so the danger is the write happening too early. Always name the hazard from the program order, then ask what could go wrong with the timing.</p>`,
        `<p class="y-chinh">🎯 Bảng phân loại khép lại nửa chương này. Có đúng <strong>BA</strong> loại xung đột dữ liệu, và slide gọi tên mỗi loại hai lần — theo thứ tự truy cập (RAW/WAR/WAW) và theo kiểu phụ thuộc (thật / phản / đầu ra).</p>
<table>
<tr><th>Xung đột</th><th>Tên khác</th><th>Nguyên văn slide</th><th>Ví dụ</th><th>Phụ thuộc THẬT?</th></tr>
<tr><td><strong>RAW</strong> — Read After Write (đọc sau ghi)</td><td><em>True dependency</em> — phụ thuộc THẬT</td><td>Một lệnh sửa một thanh ghi hoặc một ô nhớ; lệnh kế tiếp ĐỌC ô đó. Xung đột xảy ra nếu <strong>phép đọc diễn ra TRƯỚC KHI phép ghi hoàn tất</strong></td><td><code>ADD EAX, EBX</code> · <code>SUB ECX, EAX</code></td><td><strong>CÓ</strong> — giá trị thật sự phải chảy qua</td></tr>
<tr><td><strong>WAR</strong> — Write After Read (ghi sau đọc)</td><td><em>Antidependency</em> — phản phụ thuộc</td><td>Một lệnh ĐỌC một thanh ghi hoặc ô nhớ; lệnh kế tiếp GHI vào ô đó. Xung đột xảy ra nếu <strong>phép ghi hoàn tất TRƯỚC KHI phép đọc diễn ra</strong></td><td><code>SUB ECX, EAX</code> · <code>ADD EAX, EDX</code></td><td>KHÔNG — chỉ là va chạm <em>TÊN GỌI</em></td></tr>
<tr><td><strong>WAW</strong> — Write After Write (ghi sau ghi)</td><td><em>Output dependency</em> — phụ thuộc đầu ra</td><td>Hai lệnh cùng GHI vào một ô. Xung đột xảy ra nếu <strong>các phép ghi diễn ra theo thứ tự NGƯỢC với trình tự dự định</strong></td><td><code>MOV EAX, 1</code> · <code>MOV EAX, 2</code></td><td>KHÔNG — chỉ là va chạm <em>TÊN GỌI</em></td></tr>
</table>
<ul>
<li><strong>Phân biệt cốt tử mà slide đưa ra chỉ bằng một chữ: "TRUE" (THẬT).</strong> RAW được gọi là phụ thuộc <em>THẬT</em> vì lệnh thứ hai THỰC SỰ cần kết quả của lệnh thứ nhất — không mẹo mực nào xoá được nó, bạn chỉ rút ngắn được thời gian chờ (forwarding). Còn WAR và WAW là phụ thuộc <em>GIẢ</em>: chẳng có gì chảy giữa hai lệnh, chúng chỉ tình cờ dùng chung một <em>CÁI TÊN</em> thanh ghi.</li>
<li><strong>Và hệ quả của sự phân biệt đó thì cực lớn.</strong> Một phụ thuộc GIẢ có thể bị xoá SẠCH bằng <strong>ĐỔI TÊN THANH GHI (register renaming)</strong> — cấp cho lệnh thứ hai một thanh ghi vật lý khác là mâu thuẫn biến mất. Đó chính xác là việc mà bộ xử lý superscalar thực thi ngoài thứ tự làm (chương kế tiếp của sách). <strong>RAW là vật lý; WAR và WAW là sổ sách.</strong></li>
<li class="dap-an">✅ <strong>Bài phân loại mẫu, đúng dạng đề thi chuẩn.</strong> Cho dãy lệnh <code>I1: ADD R3, R1, R2</code> · <code>I2: SUB R5, R3, R4</code> · <code>I3: MUL R3, R6, R7</code> — hãy chỉ ra mọi xung đột. <strong>I1→I2 trên R3: RAW</strong> (I1 ghi R3, I2 đọc nó — phụ thuộc thật, không xoá được). <strong>I2→I3 trên R3: WAR</strong> (I2 đọc R3, I3 ghi nó — phản phụ thuộc, xoá được bằng đổi tên). <strong>I1→I3 trên R3: WAW</strong> (cả hai cùng ghi R3 — phụ thuộc đầu ra, xoá được bằng đổi tên). Một thanh ghi, đủ cả ba loại, trong ba lệnh.</li>
<li><strong>Vì sao WAR và WAW KHÔNG xảy ra được trên một pipeline đơn giản đúng thứ tự.</strong> Trong pipeline của Figure 16.10, mọi lệnh đều ghi ở tầng WO, mà WO diễn ra theo đúng thứ tự chương trình, nên phép ghi không bao giờ vượt lên trước phép đọc hay phép ghi khác. WAR và WAW chỉ cắn khi cỗ máy phát hành hoặc hoàn thành lệnh <em>NGOÀI THỨ TỰ</em>. Đề nào hỏi "pipeline 6 tầng đúng thứ tự đơn giản có thể gặp những xung đột nào?" thì đáp án là <strong>CHỈ RAW</strong>.</li>
<li><strong>Bộ nhớ cũng tính, không chỉ thanh ghi.</strong> Đọc kỹ chữ trên slide: "một thanh ghi <em>HOẶC MỘT Ô NHỚ</em>". <code>STORE [1000], R1</code> rồi <code>LOAD R2, [1000]</code> là một xung đột RAW qua bộ nhớ — và nó KHÓ phát hiện hơn, vì địa chỉ có thể chỉ biết được lúc chạy. Đó là lý do việc phân định địa chỉ bộ nhớ là một trong những phần khó nhất của CPU hiện đại.</li>
</ul>
<p class="meo">💡 Mấy cái tên tự giải mã nếu bạn đọc chúng theo kiểu "<strong>[thao tác sau] sau [thao tác trước]</strong>". RAW = trong chương trình phép <em>đọc</em> đứng sau phép <em>ghi</em>, nên nguy cơ là đọc XẢY RA QUÁ SỚM. WAR = phép <em>ghi</em> đứng sau phép <em>đọc</em>, nên nguy cơ là ghi XẢY RA QUÁ SỚM. Luôn gọi tên xung đột theo THỨ TỰ CHƯƠNG TRÌNH trước, rồi mới hỏi thời điểm có thể sai chỗ nào.</p>`],

    ]),
  ].join('\n'),
};
