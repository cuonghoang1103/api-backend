/**
 * CEA201 · "Chương 13 — RISC" trên web (deck 'cea17' = Ch.17 bản 11e,
 * Reduced Instruction Set Computers), học theo từng slide — PHẦN B: slide 22–42.
 *
 * ⚠️ ĐÁNH SỐ: syllabus của trường theo bản 9th ed gọi khối này là "Chapter 15 —
 * RISC" (xem bảng quy đổi trong _slides.mjs), còn web của người dùng đánh là
 * "Chương 13 — RISC". Slide là bản 11th ed Global Edition, Chapter 17.
 * Vì thế: tệp tên ch13b, tiêu đề mở đầu "13.0b", nhưng MỌI số hiệu hình/bảng
 * trong bài đều giữ nguyên của slide (Figure 17.6, Table 17.8…).
 *
 * Nội dung bám ĐÚNG chữ trích từ CH17-COA11e.pptx (/tmp/cea201-text/cea17.txt).
 * Các slide chỉ có tiêu đề + hình (22, 25, 26, 28, 30, 32, 35, 36, 38, 39, 41)
 * đã được ĐỌC THẲNG TỪ ẢNH render ở /tmp/cea201-slides/cea17/NNN.webp, có cắt
 * và phóng to từng bảng pipeline để đọc đúng từng ô.
 *
 * ⚠️ BẢN TRÍCH CHỮ BỎ SÓT SmartArt: slide 27 ("MIPS R4000") trong .txt chỉ có
 * đúng dòng tiêu đề, nhưng ảnh cho thấy slide có BẢY hộp nội dung. Đã lấy từ
 * ảnh. Bài học chung: .txt là nguồn sự thật cho chữ CHẠY DÒNG, ảnh là nguồn sự
 * thật cho SmartArt và bảng.
 *
 * ⚠️ MỌI giản đồ pipeline trong bài đã KIỂM BẰNG MÁY trước khi viết —
 * mô phỏng python3 (scratchpad/pipe.py), luật: I của lệnh k rơi đúng chu kỳ E
 * của lệnh k−1; E của k = I+1, đẩy lùi nếu toán hạng chưa sẵn sàng; LOAD/STORE
 * có thêm tầng D ngay sau E; LOAD ghi xong thanh ghi ở cuối D, lệnh ALU ở cuối E.
 * Luật đó TÁI TẠO ĐÚNG cả ba khung của Figure 17.7:
 *   (a) Traditional Pipeline            → 8 chu kỳ
 *   (b) RISC Pipeline with Inserted NOOP → 8 chu kỳ
 *   (c) Reversed Instructions            → 6 chu kỳ
 * và bài delayed-load tự soạn: 9 chu kỳ → 7 chu kỳ sau khi đổi thứ tự.
 * Figure 17.6 đếm thẳng trên ảnh đã phóng to: (a) 13 · (b) 10 · (c) 8 · (d) 11.
 *
 * ⚠️ PHÉP ĐO THẬT (Apple M1 Max, Apple clang, cc -O1, otool -tv):
 *   hàm C 4 dòng → 13 lệnh arm64, khoảng cách địa chỉ giữa các lệnh liên tiếp
 *   là [4,4,4,4,4,4,4,4,4,4,4,4] byte — KHÔNG có ngoại lệ, tổng 52 byte; và
 *   ĐÚNG MỘT lệnh chạm bộ nhớ (ldr) trên 13 lệnh. Kiến trúc load/store + khuôn
 *   dạng cố định hiện ra thành số, không phải lời khẳng định.
 *
 * Chỗ slide gốc GHI SAI / LẠ — nêu rõ trong bài, không im lặng chép lại, cũng
 * không tự sửa slide:
 *   · slide 25, Figure 17.7(a): lệnh 103 (nằm SAU lệnh JUMP 105) vẫn được vẽ có
 *     ô E — tức hình vẽ nó ĐƯỢC THỰC THI. Trên máy thật lệnh đó bị XẢ (flush).
 *     Tổng 8 chu kỳ không đổi, nhưng phải nói thẳng điểm này.
 *   · slide 25, Figure 17.7(c): hàng đầu ghi "100 LOAD X, Ar" — lỗi gõ của
 *     slide, đúng phải là "rA" (hai khung kia đều ghi rA).
 *   · slide 26, Figure 17.8: mã Fortran in "a[i+l]" (chữ L thường) thay vì
 *     "a[i+1]", vòng đã bung in "a[i+i]" thay vì "a[i+1]", và điều kiện đuôi
 *     "if (mod(n-2,2) = i)" đúng phải là "= 1". Ba lỗi gõ trong cùng một hình.
 *   · slide 3 (ngoài phạm vi bài này) bỏ trống ô "Number of instructions" của
 *     UltraSPARC và MIPS R10000 — nhắc lại ở slide 42 khi tổng kết bảng 17.1.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea17';

export default {
  title: '13.0b — Slide by slide: RISC characteristics, the RISC pipeline and the RISC vs CISC debate (slides 22–42)|||13.0b — Slide bài giảng: Đặc trưng RISC, pipeline RISC & cuộc tranh luận RISC với CISC (slide 22–42)',
  slug: 'cea201-13-0b-slides-dac-trung-risc-pipeline-tranh-luan',
  type: 'DOCUMENT',
  description: 'Nửa sau chương RISC của CEA201 (slide 22–42 của deck Ch.17 bản 11e) — phần có nhiều điểm thi nhất cả chương. Đi từ bốn khung Figure 17.6 cho thấy pipeline hoá đổi 13 chu kỳ thành 8, qua hai kỹ thuật tủ của đề thi là delayed branch (Table 17.8 + Figure 17.7: ba bảng pipeline, 8 · 8 · 6 chu kỳ) và delayed load (9 → 7 chu kỳ), rồi loop unrolling, hai ví dụ kiến trúc thật MIPS R4000 (siêu pipeline 8 tầng) và SPARC (cửa sổ thanh ghi, chồng vòng), tổ chức bộ xử lý cho pipeline (trạm giữ chỗ, forwarding, reorder buffer), và kết bằng cuộc tranh luận RISC với CISC cùng kết cục thật của nó ngày nay. Mọi giản đồ pipeline đã mô phỏng bằng python3 và mọi con số về độ dài lệnh đã đo bằng otool trên máy thật.',
  content: [
    walkHead(D, 22, 42),
    walk(D, [

      [22, 'Figure 17.6 — The Effects of Pipelining',
        `<p class="y-chinh">🎯 Four timing diagrams of <strong>the same five-instruction program</strong>, run on four increasingly pipelined machines. This one figure is the reason the whole RISC idea exists: reduce the instruction set so that instructions become uniform, and a pipeline can then swallow one of them per cycle.</p>
<p class="nhan">📐 The notation, used in every diagram of this chapter: <strong>I</strong> = instruction fetch · <strong>E</strong> = execute (ALU or address calculation) · <strong>D</strong> = memory access for a load or store. In panel (d) the execute stage is split into <strong>E<sub>1</sub></strong> and <strong>E<sub>2</sub></strong>.</p>
<table>
<tr><th>Panel</th><th>Machine</th><th>Instructions drawn</th><th>Cycles</th></tr>
<tr><td>(a)</td><td>Sequential execution (no pipeline)</td><td>5 (Load, Load, Add, Store, Branch)</td><td><strong>13</strong></td></tr>
<tr><td>(b)</td><td>Two-stage pipelined timing</td><td>6 (one NOOP added)</td><td><strong>10</strong></td></tr>
<tr><td>(c)</td><td>Three-stage pipelined timing</td><td>7 (two NOOPs)</td><td><strong>8</strong></td></tr>
<tr><td>(d)</td><td>Four-stage pipelined timing</td><td>9 (four NOOPs)</td><td><strong>11</strong></td></tr>
</table>
<ul>
<li><strong>Panel (a), cycle by cycle.</strong> Load rA: I(1) E(2) D(3). Load rB: I(4) E(5) D(6). Add: I(7) E(8). Store: I(9) E(10) D(11). Branch: I(12) E(13). Nothing overlaps — 13 cycles for 5 instructions, about 2,6 cycles each.</li>
<li><strong>Panel (c) is the target.</strong> Seven instructions finish in eight cycles. That is the famous RISC goal quoted on slide 29: <em>one instruction per machine cycle</em>. Getting there took a reduced instruction set — you cannot pipeline cleanly when instructions differ wildly in length and work.</li>
<li><strong>Panel (d) is the honest twist most students miss.</strong> Deeper is <em>not</em> automatically fewer cycles: (d) takes <strong>11</strong> cycles, more than (c)'s 8. The reason is on the left edge — a deeper pipeline needs <strong>more NOOPs</strong> after each branch (two instead of one), because the branch outcome is known later. Deeper pipelines win on clock <em>rate</em> (each cycle is shorter), not on cycle count.</li>
<li><strong>Where the NOOPs come from.</strong> Every one of them is a <em>delay slot</em> — the topic of the next four slides. Panel (b) has one, (c) has two, (d) has four. The slides then show how to fill those slots with useful work instead of wasting them.</li>
</ul>
<p class="nhan">📐 The six characteristics of a reduced instruction set (slides 18–19), and — the thread of this whole chapter — <strong>what each one does for the pipeline above</strong>:</p>
<table>
<tr><th>Characteristic (slide 18)</th><th>What the slide says</th><th>What it buys the pipeline</th></tr>
<tr><td><strong>One machine instruction per machine cycle</strong></td><td>Machine cycle = the time to fetch two operands from registers, perform an ALU operation, and store the result in a register</td><td>Every row of the diagram is the same width ⇒ stages never have to wait for a slow neighbour</td></tr>
<tr><td><strong>Register-to-register operations</strong></td><td>Only simple LOAD and STORE access memory; this simplifies the instruction set and therefore the control unit</td><td>Only two instruction types need the <strong>D</strong> stage, so memory conflicts are rare and predictable</td></tr>
<tr><td><strong>Simple addressing modes</strong></td><td>Simplifies the instruction set and the control unit</td><td>Address calculation fits in one E stage — no chained memory reads inside one instruction</td></tr>
<tr><td><strong>Simple instruction formats</strong></td><td>One or a few formats; length fixed and aligned on word boundaries; opcode decoding and register operand access can occur <em>simultaneously</em></td><td>The I stage is a fixed-size fetch and decode overlaps register read ⇒ no variable-length decode bubble</td></tr>
<tr><td><strong>A large number of registers</strong> (slides 9–15)</td><td>Compiler keeps operands in registers; register windows on SPARC</td><td>Fewer LOADs and STOREs ⇒ fewer D stages ⇒ fewer stalls</td></tr>
<tr><td><strong>Hardwired rather than microprogrammed control</strong> (slide 19)</td><td>"A control unit built specifically for those instructions and using little or no microcode could execute them faster than a comparable CISC"</td><td>One instruction is not a little program any more, so an interrupt can be taken between instructions and the pipeline needs no restart machinery</td></tr>
</table>
<p class="meo">💡 Remember the chain in one line: <strong>uniform instructions → a pipeline that never stalls → one instruction per cycle</strong>. Every RISC characteristic is a link in that chain; if an exam asks "why does RISC use fixed-length instructions", the answer is always a sentence about the pipeline, never about elegance.</p>
<p class="pitfall">⚠️ Trap: "pipelining makes each instruction faster". It does not. Look at panel (a) versus (c) for a <em>single</em> Load — it still takes I, E, D. Pipelining raises <strong>throughput</strong> (instructions finished per unit time), not latency of one instruction. Ch.12 (Processor Structure and Function) makes the same point with the laundry analogy.</p>`,
        `<p class="y-chinh">🎯 Bốn giản đồ thời gian của <strong>CÙNG MỘT chương trình năm lệnh</strong>, chạy trên bốn cỗ máy pipeline hoá ngày một sâu. Chỉ một hình này thôi đã là lý do cả tư tưởng RISC ra đời: rút gọn tập lệnh cho lệnh trở nên ĐỀU NHAU, rồi pipeline mới nuốt được mỗi chu kỳ một lệnh.</p>
<p class="nhan">📐 Ký hiệu dùng xuyên suốt mọi giản đồ của chương: <strong>I</strong> = nạp lệnh (instruction fetch) · <strong>E</strong> = thực thi (ALU hoặc tính địa chỉ) · <strong>D</strong> = truy cập bộ nhớ của lệnh load/store. Ở khung (d) tầng E bị chẻ đôi thành <strong>E<sub>1</sub></strong> và <strong>E<sub>2</sub></strong>.</p>
<table>
<tr><th>Khung</th><th>Cỗ máy</th><th>Số lệnh được vẽ</th><th>Chu kỳ</th></tr>
<tr><td>(a)</td><td>Thực thi tuần tự (không pipeline)</td><td>5 (Load, Load, Add, Store, Branch)</td><td><strong>13</strong></td></tr>
<tr><td>(b)</td><td>Pipeline hai tầng</td><td>6 (thêm một NOOP)</td><td><strong>10</strong></td></tr>
<tr><td>(c)</td><td>Pipeline ba tầng</td><td>7 (hai NOOP)</td><td><strong>8</strong></td></tr>
<tr><td>(d)</td><td>Pipeline bốn tầng</td><td>9 (bốn NOOP)</td><td><strong>11</strong></td></tr>
</table>
<ul>
<li><strong>Khung (a), đếm từng chu kỳ.</strong> Load rA: I(1) E(2) D(3). Load rB: I(4) E(5) D(6). Add: I(7) E(8). Store: I(9) E(10) D(11). Branch: I(12) E(13). Không có gì chồng lên nhau — 13 chu kỳ cho 5 lệnh, khoảng 2,6 chu kỳ mỗi lệnh.</li>
<li><strong>Khung (c) mới là cái đích.</strong> Bảy lệnh xong trong tám chu kỳ. Đó chính là mục tiêu RISC lừng danh mà slide 29 nhắc lại: <em>một lệnh mỗi chu kỳ máy</em>. Muốn tới đó thì phải RÚT GỌN tập lệnh — không thể pipeline sạch sẽ khi các lệnh dài ngắn và nặng nhẹ khác nhau một trời một vực.</li>
<li><strong>Khung (d) là cú lật thành thật mà đa số sinh viên bỏ qua.</strong> Sâu hơn <em>KHÔNG</em> tự động ít chu kỳ hơn: (d) mất <strong>11</strong> chu kỳ, NHIỀU hơn 8 của (c). Lý do nằm ở lề trái — pipeline sâu hơn cần <strong>NHIỀU NOOP hơn</strong> sau mỗi lệnh rẽ nhánh (hai thay vì một), vì kết quả rẽ nhánh biết được muộn hơn. Pipeline sâu thắng ở <em>TẦN SỐ XUNG NHỊP</em> (mỗi chu kỳ ngắn hơn), không thắng ở số chu kỳ.</li>
<li><strong>Đám NOOP kia từ đâu ra.</strong> Mỗi cái là một <em>KHE TRÌ HOÃN</em> (delay slot) — đúng chủ đề của bốn slide kế tiếp. Khung (b) có một, (c) có hai, (d) có bốn. Rồi slide sau chỉ cách LẤP những khe đó bằng việc có ích thay vì để phí.</li>
</ul>
<p class="nhan">📐 Sáu đặc trưng của kiến trúc tập lệnh rút gọn (slide 18–19), và — sợi chỉ xuyên suốt cả chương — <strong>mỗi đặc trưng phục vụ cái pipeline ở trên ra sao</strong>:</p>
<table>
<tr><th>Đặc trưng (slide 18)</th><th>Slide nói gì</th><th>Nó mua được gì cho pipeline</th></tr>
<tr><td><strong>Một lệnh máy mỗi chu kỳ máy</strong></td><td>Chu kỳ máy = thời gian lấy hai toán hạng từ thanh ghi, làm một phép ALU, và cất kết quả vào thanh ghi</td><td>Mọi hàng trong giản đồ rộng bằng nhau ⇒ tầng này không bao giờ phải chờ tầng kia chậm</td></tr>
<tr><td><strong>Phép toán thanh ghi–thanh ghi</strong></td><td>Chỉ LOAD và STORE đơn giản mới chạm bộ nhớ; điều này làm đơn giản tập lệnh và do đó đơn giản khối điều khiển</td><td>Chỉ hai loại lệnh cần tầng <strong>D</strong>, nên xung đột bộ nhớ vừa hiếm vừa ĐOÁN ĐƯỢC</td></tr>
<tr><td><strong>Ít chế độ địa chỉ, đơn giản</strong></td><td>Làm đơn giản tập lệnh và khối điều khiển</td><td>Tính địa chỉ lọt gọn trong MỘT tầng E — không có chuyện đọc bộ nhớ dây chuyền bên trong một lệnh</td></tr>
<tr><td><strong>Khuôn dạng lệnh đơn giản</strong></td><td>Chỉ một hoặc vài khuôn dạng; độ dài CỐ ĐỊNH và canh theo biên từ; giải mã mã lệnh và đọc toán hạng thanh ghi có thể xảy ra <em>ĐỒNG THỜI</em></td><td>Tầng I là một lần nạp cỡ cố định, và giải mã chồng lên đọc thanh ghi ⇒ không có bọt vì giải mã độ dài thay đổi</td></tr>
<tr><td><strong>Rất nhiều thanh ghi</strong> (slide 9–15)</td><td>Trình biên dịch giữ toán hạng trong thanh ghi; SPARC dùng cửa sổ thanh ghi</td><td>Ít LOAD và STORE hơn ⇒ ít tầng D hơn ⇒ ít lần khựng hơn</td></tr>
<tr><td><strong>Điều khiển bằng MẠCH CỨNG thay vì vi chương trình</strong> (slide 19)</td><td>"Một khối điều khiển dựng riêng cho đúng những lệnh đó, dùng rất ít hoặc không dùng vi mã, có thể chạy chúng nhanh hơn một CISC tương đương"</td><td>Một lệnh không còn là một chương trình con nữa, nên ngắt có thể nhận GIỮA các lệnh và pipeline không cần bộ máy khởi động lại lệnh</td></tr>
</table>
<p class="meo">💡 Nhớ chuỗi nhân quả trong một dòng: <strong>lệnh đều nhau → pipeline không khựng → một lệnh mỗi chu kỳ</strong>. Mọi đặc trưng RISC đều là một mắt xích của chuỗi đó; đề hỏi "vì sao RISC dùng lệnh độ dài cố định" thì câu trả lời LUÔN là một câu về pipeline, không bao giờ là về sự thanh lịch.</p>
<p class="pitfall">⚠️ Bẫy: "pipeline làm mỗi lệnh nhanh hơn". KHÔNG. Nhìn khung (a) so với (c) cho MỘT lệnh Load — nó vẫn tốn đủ I, E, D. Pipeline nâng <strong>THÔNG LƯỢNG</strong> (số lệnh hoàn tất trên một đơn vị thời gian), không rút ngắn độ trễ của một lệnh. Chương 12 (Cấu trúc & hoạt động bộ xử lý) nói đúng điều này bằng ví dụ giặt là.</p>`],

      [23, 'Optimization of Pipelining — delayed branch, delayed load, loop unrolling',
        `<p class="y-chinh">🎯 The slide lists the <strong>three software techniques</strong> that turn the wasted NOOP slots of Figure 17.6 into useful work. All three are done by the <em>compiler</em>, not the hardware — which is the deepest idea in the whole chapter.</p>
<table>
<tr><th>Technique</th><th>The slide's own words</th></tr>
<tr><td><strong>Delayed branch</strong></td><td>Does not take effect until after execution of following instruction · This following instruction is the <em>delay slot</em></td></tr>
<tr><td><strong>Delayed load</strong></td><td>Register to be target is <em>locked</em> by processor · Continue execution of instruction stream until register required · Idle until load is complete · <strong>Re-arranging instructions can allow useful work while loading</strong></td></tr>
<tr><td><strong>Loop unrolling</strong></td><td>Replicate body of loop a number of times · Iterate loop fewer times · Reduces loop overhead · Increases instruction parallelism · Improved register, data cache, or TLB locality</td></tr>
</table>
<ul>
<li><strong>Delayed branch, in one sentence.</strong> The machine <em>promises</em> to execute the instruction sitting right after a branch, whichever way the branch goes. That sounds insane until you realise the pipeline has already fetched it — so the architecture stops pretending otherwise and lets the compiler put something useful there. Slides 24 and 25 work this out in full.</li>
<li><strong>Delayed load, in one sentence.</strong> A LOAD's value is not in the register on the very next cycle (look at Figure 17.6: the D stage finishes one cycle after E). So the processor <em>locks</em> the destination register and lets the following instructions run until one of them actually reads it. Re-ordering removes the stall entirely.</li>
<li><strong>Loop unrolling is the odd one out — and the most useful in real life.</strong> It does not fight a pipeline hazard; it removes <em>loop overhead</em> (the counter increment and the branch) and gives the scheduler more independent instructions to interleave. Figure 17.8 on slide 26 shows the code transformation.</li>
<li><strong>Why all three belong to the compiler.</strong> A CISC hides its pipeline behind complex instructions; a RISC exposes it and expects the compiler to schedule around it. Slide 19's "circumstantial evidence" says exactly this: with more primitive instructions there are "more opportunities for moving functions out of loops, reorganizing code for efficiency and maximizing register utilization".</li>
</ul>
<p class="nhan">📐 <strong>Worked delayed-load exercise, simulated rather than hand-counted.</strong> Take four instructions where each ADD reads the register the LOAD just before it wrote:</p>
<pre>200  LOAD  X, rA
201  ADD   1, rA        (reads rA — the LOAD has not finished)
202  LOAD  Y, rB
203  ADD   1, rB        (reads rB — same problem)
204  STORE rA, Z</pre>
<table>
<tr><th>Instruction</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr>
<tr><td>200 LOAD X, rA</td><td>I</td><td>E</td><td>D</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>201 ADD 1, rA</td><td></td><td>I</td><td><em>bubble</em></td><td>E</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>202 LOAD Y, rB</td><td></td><td></td><td></td><td>I</td><td>E</td><td>D</td><td></td><td></td><td></td></tr>
<tr><td>203 ADD 1, rB</td><td></td><td></td><td></td><td></td><td>I</td><td><em>bubble</em></td><td>E</td><td></td><td></td></tr>
<tr><td>204 STORE rA, Z</td><td></td><td></td><td></td><td></td><td></td><td></td><td>I</td><td>E</td><td>D</td></tr>
</table>
<p class="nhan">📐 Now re-arrange so that each LOAD has an unrelated instruction after it — nothing is added or removed, only the order changes:</p>
<pre>200  LOAD  X, rA
201  LOAD  Y, rB        (independent — fills rA's load delay slot)
202  ADD   1, rA        (rA is ready now)
203  ADD   1, rB
204  STORE rA, Z</pre>
<table>
<tr><th>Instruction</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr>
<tr><td>200 LOAD X, rA</td><td>I</td><td>E</td><td>D</td><td></td><td></td><td></td><td></td></tr>
<tr><td>201 LOAD Y, rB</td><td></td><td>I</td><td>E</td><td>D</td><td></td><td></td><td></td></tr>
<tr><td>202 ADD 1, rA</td><td></td><td></td><td>I</td><td>E</td><td></td><td></td><td></td></tr>
<tr><td>203 ADD 1, rB</td><td></td><td></td><td></td><td>I</td><td>E</td><td></td><td></td></tr>
<tr><td>204 STORE rA, Z</td><td></td><td></td><td></td><td></td><td>I</td><td>E</td><td>D</td></tr>
</table>
<p class="dap-an">✅ Answer: <strong>9 cycles → 7 cycles, a saving of 2</strong>, verified by a python3 pipeline simulator rather than counted by eye. Both bubbles disappear, no instruction was added or deleted, and the program computes exactly the same thing. This is the entire content of "re-arranging instructions can allow useful work while loading".</p>
<p class="pitfall">⚠️ Exam trap: a delayed <em>load</em> slot and a delayed <em>branch</em> slot are different animals. The branch slot instruction <strong>always executes</strong> (that is the architectural promise); the load slot is just a cycle in which the processor happens to be free. Mixing the two up is the single most common mistake on this chapter.</p>`,
        `<p class="y-chinh">🎯 Slide liệt kê <strong>BA kỹ thuật phần mềm</strong> biến những khe NOOP phí phạm của Figure 17.6 thành việc có ích. Cả ba do <em>TRÌNH BIÊN DỊCH</em> làm, không phải phần cứng — và đó là ý sâu nhất của cả chương.</p>
<table>
<tr><th>Kỹ thuật</th><th>Nguyên văn của slide</th></tr>
<tr><td><strong>Delayed branch</strong> (rẽ nhánh trì hoãn)</td><td>Chưa có hiệu lực cho tới sau khi lệnh KẾ TIẾP đã chạy xong · Lệnh kế tiếp đó gọi là <em>khe trì hoãn</em> (delay slot)</td></tr>
<tr><td><strong>Delayed load</strong> (nạp trì hoãn)</td><td>Thanh ghi đích bị bộ xử lý <em>KHOÁ</em> · Tiếp tục chạy dòng lệnh cho tới khi cần đến thanh ghi đó · Nằm không cho tới khi nạp xong · <strong>Sắp xếp lại lệnh có thể cho làm việc có ích trong lúc đang nạp</strong></td></tr>
<tr><td><strong>Loop unrolling</strong> (bung vòng lặp)</td><td>Nhân bản thân vòng lặp lên vài lần · Lặp ít vòng hơn · Giảm chi phí vòng lặp · Tăng song song mức lệnh · Cải thiện tính cục bộ của thanh ghi, cache dữ liệu hoặc TLB</td></tr>
</table>
<ul>
<li><strong>Delayed branch, một câu.</strong> Máy <em>CAM KẾT</em> sẽ chạy lệnh nằm ngay sau lệnh rẽ nhánh, bất kể rẽ hay không rẽ. Nghe điên rồ cho tới khi bạn nhận ra pipeline ĐÃ nạp nó rồi — nên kiến trúc thôi giả vờ, và để trình biên dịch nhét vào đó thứ gì có ích. Slide 24 và 25 giải trọn chuyện này.</li>
<li><strong>Delayed load, một câu.</strong> Giá trị của một lệnh LOAD chưa nằm trong thanh ghi ở chu kỳ ngay sau (nhìn Figure 17.6: tầng D kết thúc muộn hơn E một chu kỳ). Nên bộ xử lý <em>KHOÁ</em> thanh ghi đích và cho các lệnh sau chạy tiếp cho tới khi có lệnh thật sự ĐỌC nó. Đổi thứ tự thì xoá sạch chỗ khựng.</li>
<li><strong>Loop unrolling là cái khác loại — và hữu ích nhất ngoài đời.</strong> Nó không chống một hiểm hoạ pipeline nào cả; nó CẮT <em>chi phí vòng lặp</em> (tăng biến đếm và lệnh rẽ nhánh) và cho bộ lập lịch nhiều lệnh độc lập hơn để đan xen. Figure 17.8 ở slide 26 trưng ra phép biến đổi mã.</li>
<li><strong>Vì sao cả ba đều thuộc về trình biên dịch.</strong> CISC GIẤU pipeline sau những lệnh phức tạp; RISC PHƠI nó ra và trông cậy trình biên dịch lập lịch né tránh. "Bằng chứng gián tiếp" của slide 19 nói đúng điều đó: với lệnh nguyên sơ hơn thì có "nhiều cơ hội hơn để đưa hàm ra khỏi vòng lặp, tổ chức lại mã cho hiệu quả và tận dụng tối đa thanh ghi".</li>
</ul>
<p class="nhan">📐 <strong>Bài delayed-load giải mẫu, MÔ PHỎNG BẰNG MÁY chứ không đếm tay.</strong> Lấy bốn lệnh mà mỗi ADD đọc đúng thanh ghi mà lệnh LOAD ngay trước vừa ghi:</p>
<pre>200  LOAD  X, rA
201  ADD   1, rA        (đọc rA — lệnh LOAD chưa xong)
202  LOAD  Y, rB
203  ADD   1, rB        (đọc rB — y hệt vấn đề trên)
204  STORE rA, Z</pre>
<table>
<tr><th>Lệnh</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr>
<tr><td>200 LOAD X, rA</td><td>I</td><td>E</td><td>D</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>201 ADD 1, rA</td><td></td><td>I</td><td><em>bọt</em></td><td>E</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>202 LOAD Y, rB</td><td></td><td></td><td></td><td>I</td><td>E</td><td>D</td><td></td><td></td><td></td></tr>
<tr><td>203 ADD 1, rB</td><td></td><td></td><td></td><td></td><td>I</td><td><em>bọt</em></td><td>E</td><td></td><td></td></tr>
<tr><td>204 STORE rA, Z</td><td></td><td></td><td></td><td></td><td></td><td></td><td>I</td><td>E</td><td>D</td></tr>
</table>
<p class="nhan">📐 Giờ sắp xếp lại sao cho sau mỗi LOAD là một lệnh KHÔNG liên quan — không thêm không bớt lệnh nào, chỉ đổi THỨ TỰ:</p>
<pre>200  LOAD  X, rA
201  LOAD  Y, rB        (độc lập — lấp đúng khe trì hoãn của rA)
202  ADD   1, rA        (rA đã sẵn sàng)
203  ADD   1, rB
204  STORE rA, Z</pre>
<table>
<tr><th>Lệnh</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr>
<tr><td>200 LOAD X, rA</td><td>I</td><td>E</td><td>D</td><td></td><td></td><td></td><td></td></tr>
<tr><td>201 LOAD Y, rB</td><td></td><td>I</td><td>E</td><td>D</td><td></td><td></td><td></td></tr>
<tr><td>202 ADD 1, rA</td><td></td><td></td><td>I</td><td>E</td><td></td><td></td><td></td></tr>
<tr><td>203 ADD 1, rB</td><td></td><td></td><td></td><td>I</td><td>E</td><td></td><td></td></tr>
<tr><td>204 STORE rA, Z</td><td></td><td></td><td></td><td></td><td>I</td><td>E</td><td>D</td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>9 chu kỳ → 7 chu kỳ, tiết kiệm 2</strong>, đã kiểm bằng chương trình mô phỏng pipeline viết bằng python3 chứ không đếm bằng mắt. Cả hai bọt biến mất, không thêm không bớt lệnh nào, và chương trình tính ra y hệt kết quả cũ. Toàn bộ nội dung của câu "sắp xếp lại lệnh có thể cho làm việc có ích trong lúc đang nạp" nằm gọn ở đây.</p>
<p class="pitfall">⚠️ Bẫy đề thi: khe trì hoãn của <em>LOAD</em> và khe trì hoãn của <em>BRANCH</em> là hai con vật khác nhau. Lệnh trong khe của branch <strong>LUÔN LUÔN chạy</strong> (đó là cam kết của kiến trúc); còn khe của load chỉ là một chu kỳ mà tình cờ bộ xử lý đang rỗi. Lẫn lộn hai thứ này là lỗi phổ biến số một của chương.</p>`],

      [24, 'Table 17.8 — Normal And Delayed Branch',
        `<p class="y-chinh">🎯 The same six-instruction program written three ways. Read the three columns side by side and the entire delayed-branch idea falls out of the addresses alone — notice that the JUMP target changes from <strong>105</strong> to <strong>106</strong> and back to <strong>105</strong>.</p>
<table>
<tr><th>Address</th><th>Normal Branch</th><th>Delayed Branch</th><th>Optimized Delayed Branch</th></tr>
<tr><td>100</td><td>LOAD X, rA</td><td>LOAD X, rA</td><td>LOAD X, rA</td></tr>
<tr><td>101</td><td>ADD 1, rA</td><td>ADD 1, rA</td><td><strong>JUMP 105</strong></td></tr>
<tr><td>102</td><td>JUMP 105</td><td><strong>JUMP 106</strong></td><td>ADD 1, rA</td></tr>
<tr><td>103</td><td>ADD rA, rB</td><td><strong>NOOP</strong></td><td>ADD rA, rB</td></tr>
<tr><td>104</td><td>SUB rC, rB</td><td>ADD rA, rB</td><td>SUB rC, rB</td></tr>
<tr><td>105</td><td>STORE rA, Z</td><td>SUB rC, rB</td><td>STORE rA, Z</td></tr>
<tr><td>106</td><td>—</td><td>STORE rA, Z</td><td>—</td></tr>
</table>
<ul>
<li><strong>Column 1 — Normal Branch.</strong> Ordinary semantics: after JUMP 105 executes, control goes straight to 105. Everything between 103 and 104 is skipped. This is what you expect from PRF192 and from every high-level language.</li>
<li><strong>Column 2 — Delayed Branch.</strong> The machine now <em>always</em> executes the instruction one address after the branch. To keep the program meaning identical, the compiler must (i) insert a <strong>NOOP</strong> at 103 to fill that guaranteed slot, and (ii) shift everything below down one address — which is why STORE moved from 105 to 106, and why the JUMP target had to be rewritten as <strong>106</strong>. Correct, but one cycle is still wasted on nothing.</li>
<li><strong>Column 3 — Optimized Delayed Branch.</strong> The trick: move the JUMP <em>up</em> one slot, to 101, and let the <strong>ADD 1, rA</strong> fall into the delay slot at 102. The ADD has to run anyway and does not affect the branch decision, so putting it in the slot is free. Addresses go back to normal (STORE at 105, target 105) and nothing is wasted.</li>
<li><strong>Why the ADD is a legal choice, and what would not be.</strong> The slot instruction must be one that (i) executes on <em>both</em> paths of the branch, and (ii) does not produce a value the branch condition needs. <code>ADD 1, rA</code> passes both tests. An instruction that computed the branch condition, or one that only belongs on the taken path, would not.</li>
<li><strong>Who does this?</strong> The <em>compiler's</em> instruction scheduler, not the programmer and not the hardware. On a real SPARC or MIPS, a delay slot the compiler cannot fill is filled with a NOP — which is column 2 as a fallback.</li>
</ul>
<p class="dap-an">✅ What to take to the exam from this table: <strong>the delayed branch is not faster by itself.</strong> Column 2 costs exactly what column 1 costs. The gain comes only when the compiler manages to fill the slot — column 3. Slide 25 puts real cycle counts on all three: <strong>8, 8 and 6</strong>.</p>
<p class="meo">💡 Reading trick for this table: track the <strong>JUMP target number</strong>. 105 → 106 → 105. Whenever the target changes, you are looking at the NOOP version; when it changes back, the slot has been filled with real work.</p>
<p class="pitfall">⚠️ Trap: students often "fix" column 2 by deleting the NOOP. You cannot — the delay slot is architectural, so the instruction at 103 <em>will</em> be executed whether you like it or not. Deleting the NOOP would make <code>ADD rA, rB</code> run twice.</p>`,
        `<p class="y-chinh">🎯 Cùng một chương trình sáu lệnh, viết theo ba kiểu. Đọc ba cột cạnh nhau là toàn bộ ý tưởng rẽ nhánh trì hoãn tự rơi ra từ chính các ĐỊA CHỈ — để ý đích của JUMP đổi từ <strong>105</strong> sang <strong>106</strong> rồi quay về <strong>105</strong>.</p>
<table>
<tr><th>Địa chỉ</th><th>Normal Branch (thường)</th><th>Delayed Branch (trì hoãn)</th><th>Optimized Delayed Branch (trì hoãn đã tối ưu)</th></tr>
<tr><td>100</td><td>LOAD X, rA</td><td>LOAD X, rA</td><td>LOAD X, rA</td></tr>
<tr><td>101</td><td>ADD 1, rA</td><td>ADD 1, rA</td><td><strong>JUMP 105</strong></td></tr>
<tr><td>102</td><td>JUMP 105</td><td><strong>JUMP 106</strong></td><td>ADD 1, rA</td></tr>
<tr><td>103</td><td>ADD rA, rB</td><td><strong>NOOP</strong></td><td>ADD rA, rB</td></tr>
<tr><td>104</td><td>SUB rC, rB</td><td>ADD rA, rB</td><td>SUB rC, rB</td></tr>
<tr><td>105</td><td>STORE rA, Z</td><td>SUB rC, rB</td><td>STORE rA, Z</td></tr>
<tr><td>106</td><td>—</td><td>STORE rA, Z</td><td>—</td></tr>
</table>
<ul>
<li><strong>Cột 1 — Normal Branch.</strong> Ngữ nghĩa thông thường: JUMP 105 chạy xong thì điều khiển nhảy thẳng tới 105. Mọi thứ ở 103 và 104 bị bỏ qua. Đây đúng là thứ bạn quen từ PRF192 và từ mọi ngôn ngữ bậc cao.</li>
<li><strong>Cột 2 — Delayed Branch.</strong> Giờ máy <em>LUÔN</em> chạy lệnh nằm ở địa chỉ kế sau lệnh rẽ nhánh. Muốn giữ nguyên ý nghĩa chương trình thì trình biên dịch phải (i) nhét một <strong>NOOP</strong> vào 103 để lấp cái khe bắt buộc đó, và (ii) đẩy mọi thứ bên dưới xuống một địa chỉ — vì thế STORE dời từ 105 xuống 106, và vì thế đích của JUMP phải viết lại thành <strong>106</strong>. Đúng, nhưng vẫn phí đứt một chu kỳ cho hư không.</li>
<li><strong>Cột 3 — Optimized Delayed Branch.</strong> Mẹo: đẩy lệnh JUMP <em>LÊN</em> một ô, về 101, và để <strong>ADD 1, rA</strong> rơi xuống khe trì hoãn ở 102. Lệnh ADD dù sao cũng phải chạy và nó không ảnh hưởng tới quyết định rẽ nhánh, nên nhét vào khe là MIỄN PHÍ. Địa chỉ trở lại bình thường (STORE ở 105, đích 105) và không phí gì cả.</li>
<li><strong>Vì sao ADD là lựa chọn HỢP LỆ, còn cái gì thì không.</strong> Lệnh đặt vào khe phải là lệnh (i) chạy trên <em>CẢ HAI</em> nhánh của rẽ nhánh, và (ii) không sinh ra giá trị mà điều kiện rẽ nhánh cần. <code>ADD 1, rA</code> qua cả hai phép thử. Một lệnh tính điều kiện rẽ nhánh, hoặc một lệnh chỉ thuộc về nhánh được chọn, thì KHÔNG.</li>
<li><strong>Ai làm việc này?</strong> Bộ <em>LẬP LỊCH LỆNH của trình biên dịch</em>, không phải lập trình viên và cũng không phải phần cứng. Trên SPARC hay MIPS thật, khe nào trình biên dịch không lấp nổi thì nó điền NOP — tức là cột 2, dùng làm phương án lùi.</li>
</ul>
<p class="dap-an">✅ Thứ cần mang vào phòng thi từ bảng này: <strong>bản thân rẽ nhánh trì hoãn KHÔNG nhanh hơn.</strong> Cột 2 tốn đúng bằng cột 1. Cái lời chỉ đến khi trình biên dịch LẤP được cái khe — tức cột 3. Slide 25 gắn số chu kỳ thật cho cả ba: <strong>8, 8 và 6</strong>.</p>
<p class="meo">💡 Mẹo đọc bảng này: bám theo <strong>con số đích của JUMP</strong>. 105 → 106 → 105. Đích đổi số là bạn đang nhìn bản có NOOP; đích đổi về là cái khe đã được lấp bằng việc thật.</p>
<p class="pitfall">⚠️ Bẫy: sinh viên hay "sửa" cột 2 bằng cách XOÁ cái NOOP. Không được — khe trì hoãn là thuộc tính KIẾN TRÚC, nên lệnh ở 103 <em>SẼ</em> chạy dù bạn có thích hay không. Xoá NOOP đi thì <code>ADD rA, rB</code> sẽ chạy HAI lần.</p>`],

      [25, 'Figure 17.7 — Use of the Delayed Branch',
        `<p class="y-chinh">🎯 The three columns of Table 17.8, now as <strong>three pipeline timing diagrams</strong> with the cycles actually counted. This is the single most examinable figure in the chapter: draw it, count it, compare it.</p>
<p class="nhan">📐 <strong>(a) Traditional Pipeline — 8 cycles</strong></p>
<table>
<tr><th>Instruction</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
<tr><td>100 LOAD X, rA</td><td>I</td><td>E</td><td>D</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>101 ADD 1, rA</td><td></td><td>I</td><td></td><td>E</td><td></td><td></td><td></td><td></td></tr>
<tr><td>102 JUMP 105</td><td></td><td></td><td></td><td>I</td><td>E</td><td></td><td></td><td></td></tr>
<tr><td>103 ADD rA, rB</td><td></td><td></td><td></td><td></td><td>I</td><td>E</td><td></td><td></td></tr>
<tr><td>105 STORE rA, Z</td><td></td><td></td><td></td><td></td><td></td><td>I</td><td>E</td><td>D</td></tr>
</table>
<p class="nhan">📐 <strong>(b) RISC Pipeline with Inserted NOOP — 8 cycles</strong></p>
<table>
<tr><th>Instruction</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
<tr><td>100 LOAD X, rA</td><td>I</td><td>E</td><td>D</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>101 ADD 1, rA</td><td></td><td>I</td><td></td><td>E</td><td></td><td></td><td></td><td></td></tr>
<tr><td>102 JUMP 106</td><td></td><td></td><td></td><td>I</td><td>E</td><td></td><td></td><td></td></tr>
<tr><td>103 NOOP</td><td></td><td></td><td></td><td></td><td>I</td><td>E</td><td></td><td></td></tr>
<tr><td>106 STORE rA, Z</td><td></td><td></td><td></td><td></td><td></td><td>I</td><td>E</td><td>D</td></tr>
</table>
<p class="nhan">📐 <strong>(c) Reversed Instructions — 6 cycles</strong></p>
<table>
<tr><th>Instruction</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
<tr><td>100 LOAD X, rA</td><td>I</td><td>E</td><td>D</td><td></td><td></td><td></td></tr>
<tr><td>101 JUMP 105</td><td></td><td>I</td><td>E</td><td></td><td></td><td></td></tr>
<tr><td>102 ADD 1, rA</td><td></td><td></td><td>I</td><td>E</td><td></td><td></td></tr>
<tr><td>105 STORE rA, Z</td><td></td><td></td><td></td><td>I</td><td>E</td><td>D</td></tr>
</table>
<p class="dap-an">✅ Answer, machine-checked: <strong>(a) 8 cycles · (b) 8 cycles · (c) 6 cycles.</strong> The NOOP version buys nothing (8 = 8); the re-ordered version saves <strong>2 of 8 cycles, i.e. 25%</strong>, on a five-instruction fragment. Verified with a python3 pipeline simulator whose rules are: the I of instruction k lands in the same cycle as the E of instruction k−1; E happens one cycle after I unless an operand is still in flight; LOAD/STORE add a D stage; a LOAD's value is available only after its D. Those rules reproduce all three panels of the slide cell for cell.</p>
<ul>
<li><strong>Where the bubble in (a) and (b) comes from.</strong> Look at row 101: I in cycle 2, then a gap, then E in cycle 4. <code>ADD 1, rA</code> reads rA, which <code>LOAD X, rA</code> only finishes writing at the end of its D stage in cycle 3. That is the <em>delayed load</em> hazard of slide 23, appearing inside the delayed-branch figure.</li>
<li><strong>Why (c) escapes it.</strong> In the reordered code the instruction right after the LOAD is <code>JUMP 105</code>, which does not touch rA at all — so its E runs in cycle 3 with no wait. By the time <code>ADD 1, rA</code> executes in cycle 4, rA has been ready since the end of cycle 3. <strong>One reordering fixed both the branch slot and the load slot at once.</strong></li>
<li><strong>Counting rule for the exam.</strong> Total cycles = (cycle in which the last instruction finishes). Do not count I/E/D boxes — count columns. And remember that (a) and (b) both end at column 8, which is the whole point.</li>
<li><strong>Scaling up.</strong> Two cycles out of eight looks small. Put that fragment inside a loop that runs a million times and you have saved a quarter of the loop's execution time — for free, at compile time, with no extra hardware. This is why RISC designers were willing to expose something as ugly as a delay slot.</li>
</ul>
<p class="pitfall">⚠️ <strong>The slide itself is drawing something questionable, and you should know it.</strong> In panel (a) the row <code>103 ADD rA, rB</code> is given an <strong>E</strong> box in cycle 6 — the figure shows it being <em>executed</em>, even though <code>JUMP 105</code> at address 102 transfers control to 105 and 103 should never run. On a real traditional pipeline that instruction is fetched and then <strong>discarded (flushed)</strong>; it does not execute. The total of 8 cycles is unaffected either way, and the comparison with (b) and (c) still holds — but do not quote panel (a) as evidence that a traditional machine executes past a taken branch.</p>
<p class="pitfall">⚠️ Second slide defect, minor: the first row of panel (c) is labelled <code>100 LOAD X, Ar</code>. That is a typo for <code>rA</code> — panels (a) and (b) both write rA, and the rest of (c) depends on rA.</p>
<p class="meo">💡 Memory hook: <strong>NOOP = honest but useless; reorder = free speed.</strong> If an exam gives you a fragment and says "use the delayed branch", they nearly always want column 3 / panel (c) — move the branch up, let a safe instruction fall into the slot, and show the shorter table.</p>`,
        `<p class="y-chinh">🎯 Ba cột của Table 17.8, giờ thành <strong>BA giản đồ pipeline</strong> có đếm chu kỳ thật. Đây là hình dễ ra đề nhất cả chương: vẽ được, đếm được, so được.</p>
<p class="nhan">📐 <strong>(a) Traditional Pipeline — 8 chu kỳ</strong></p>
<table>
<tr><th>Lệnh</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
<tr><td>100 LOAD X, rA</td><td>I</td><td>E</td><td>D</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>101 ADD 1, rA</td><td></td><td>I</td><td></td><td>E</td><td></td><td></td><td></td><td></td></tr>
<tr><td>102 JUMP 105</td><td></td><td></td><td></td><td>I</td><td>E</td><td></td><td></td><td></td></tr>
<tr><td>103 ADD rA, rB</td><td></td><td></td><td></td><td></td><td>I</td><td>E</td><td></td><td></td></tr>
<tr><td>105 STORE rA, Z</td><td></td><td></td><td></td><td></td><td></td><td>I</td><td>E</td><td>D</td></tr>
</table>
<p class="nhan">📐 <strong>(b) RISC Pipeline with Inserted NOOP — 8 chu kỳ</strong></p>
<table>
<tr><th>Lệnh</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
<tr><td>100 LOAD X, rA</td><td>I</td><td>E</td><td>D</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>101 ADD 1, rA</td><td></td><td>I</td><td></td><td>E</td><td></td><td></td><td></td><td></td></tr>
<tr><td>102 JUMP 106</td><td></td><td></td><td></td><td>I</td><td>E</td><td></td><td></td><td></td></tr>
<tr><td>103 NOOP</td><td></td><td></td><td></td><td></td><td>I</td><td>E</td><td></td><td></td></tr>
<tr><td>106 STORE rA, Z</td><td></td><td></td><td></td><td></td><td></td><td>I</td><td>E</td><td>D</td></tr>
</table>
<p class="nhan">📐 <strong>(c) Reversed Instructions (đã đổi thứ tự) — 6 chu kỳ</strong></p>
<table>
<tr><th>Lệnh</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
<tr><td>100 LOAD X, rA</td><td>I</td><td>E</td><td>D</td><td></td><td></td><td></td></tr>
<tr><td>101 JUMP 105</td><td></td><td>I</td><td>E</td><td></td><td></td><td></td></tr>
<tr><td>102 ADD 1, rA</td><td></td><td></td><td>I</td><td>E</td><td></td><td></td></tr>
<tr><td>105 STORE rA, Z</td><td></td><td></td><td></td><td>I</td><td>E</td><td>D</td></tr>
</table>
<p class="dap-an">✅ Đáp án, đã kiểm bằng máy: <strong>(a) 8 chu kỳ · (b) 8 chu kỳ · (c) 6 chu kỳ.</strong> Bản chèn NOOP không mua được gì (8 = 8); bản đổi thứ tự tiết kiệm <strong>2 trên 8 chu kỳ, tức 25%</strong>, chỉ trên một đoạn năm lệnh. Kiểm bằng chương trình mô phỏng pipeline viết bằng python3, luật: I của lệnh k rơi đúng chu kỳ E của lệnh k−1; E cách I một chu kỳ trừ khi toán hạng còn đang bay; LOAD/STORE có thêm tầng D; giá trị của LOAD chỉ dùng được SAU tầng D của nó. Bộ luật đó tái tạo đúng từng ô của cả ba khung trên slide.</p>
<ul>
<li><strong>Cái bọt ở (a) và (b) từ đâu ra.</strong> Nhìn hàng 101: I ở chu kỳ 2, rồi một khoảng trống, rồi E ở chu kỳ 4. <code>ADD 1, rA</code> ĐỌC rA, mà <code>LOAD X, rA</code> mãi tới cuối tầng D ở chu kỳ 3 mới ghi xong. Đó chính là hiểm hoạ <em>delayed load</em> của slide 23, hiện ra ngay bên trong hình về delayed branch.</li>
<li><strong>Vì sao (c) thoát được.</strong> Trong mã đã đổi thứ tự, lệnh ngay sau LOAD là <code>JUMP 105</code>, nó KHÔNG đụng tới rA chút nào — nên E của nó chạy ở chu kỳ 3, khỏi chờ. Tới lúc <code>ADD 1, rA</code> thực thi ở chu kỳ 4 thì rA đã sẵn sàng từ cuối chu kỳ 3. <strong>Một lần đổi thứ tự chữa CẢ khe rẽ nhánh LẪN khe nạp.</strong></li>
<li><strong>Quy tắc đếm để đi thi.</strong> Tổng chu kỳ = chu kỳ mà lệnh cuối cùng KẾT THÚC. Đừng đếm số ô I/E/D — đếm số CỘT. Và nhớ rằng (a) và (b) đều dừng ở cột 8, đó mới là điểm mấu chốt.</li>
<li><strong>Nhân lên quy mô thật.</strong> Hai chu kỳ trên tám nghe có vẻ bé. Nhét đoạn đó vào một vòng lặp chạy một triệu lần thì bạn vừa cắt một phần tư thời gian chạy của vòng lặp — miễn phí, làm lúc biên dịch, không cần thêm một transistor nào. Đó là lý do người thiết kế RISC chịu phơi ra một thứ xấu xí như khe trì hoãn.</li>
</ul>
<p class="pitfall">⚠️ <strong>Chính slide đang vẽ một chỗ đáng ngờ, và bạn nên biết.</strong> Ở khung (a), hàng <code>103 ADD rA, rB</code> được vẽ có ô <strong>E</strong> tại chu kỳ 6 — tức hình cho thấy nó ĐƯỢC THỰC THI, dù <code>JUMP 105</code> ở địa chỉ 102 đã chuyển điều khiển sang 105 và lệnh 103 lẽ ra không bao giờ chạy. Trên một pipeline truyền thống thật, lệnh đó bị nạp rồi <strong>XẢ ĐI (flush)</strong>; nó không thực thi. Tổng 8 chu kỳ không đổi theo cách nào đi nữa, và phép so với (b), (c) vẫn đứng vững — nhưng ĐỪNG trích khung (a) làm bằng chứng rằng máy truyền thống chạy tiếp qua một lệnh rẽ nhánh đã được lấy.</p>
<p class="pitfall">⚠️ Lỗi thứ hai của slide, nhỏ: hàng đầu khung (c) ghi <code>100 LOAD X, Ar</code>. Đó là lỗi gõ của <code>rA</code> — khung (a) và (b) đều ghi rA, và phần còn lại của (c) phụ thuộc vào rA.</p>
<p class="meo">💡 Mẹo nhớ: <strong>NOOP = thật thà nhưng vô dụng; đổi thứ tự = tốc độ miễn phí.</strong> Đề cho một đoạn mã và bảo "dùng rẽ nhánh trì hoãn" thì gần như luôn là muốn cột 3 / khung (c) — kéo lệnh rẽ nhánh lên, thả một lệnh an toàn xuống khe, rồi vẽ bảng ngắn hơn.</p>`],

      [26, 'Figure 17.8 — Loop Unrolling',
        `<p class="y-chinh">🎯 The third optimization of slide 23, shown as a source-code transformation in Fortran-like pseudocode: <strong>(a) the original loop</strong> and <strong>(b) the loop unrolled twice</strong>. The body is duplicated, the loop runs half as many times, and a small tail fixes up the odd leftover iteration.</p>
<pre>(a) original loop
do i = 2, n-1
    a[i] = a[i] + a[i-1] * a[i+1]
end do

(b) loop unrolled twice
do i = 2, n-2, 2
    a[i]   = a[i]   + a[i-1] * a[i+1]
    a[i+1] = a[i+1] + a[i]   * a[i+2]
end do

if (mod(n-2, 2) = 1) then
    a[n-1] = a[n-1] + a[n-2] * a[n]
end if</pre>
<ul>
<li><strong>What changed in the loop header.</strong> <code>do i = 2, n-1</code> became <code>do i = 2, n-2, 2</code> — the step is now <strong>2</strong>, so the loop executes half as many iterations. Each iteration does the work of two.</li>
<li><strong>Why the tail <code>if</code> exists.</strong> If the number of iterations is odd, the unrolled loop finishes one short. The <code>mod</code> test detects that case and runs the final iteration on its own. Forgetting this tail is the classic bug when a student unrolls a loop by hand.</li>
<li><strong>The four benefits slide 23 listed, mapped onto this code.</strong> <em>Reduces loop overhead</em> — one counter increment and one branch now serve two bodies instead of one. <em>Increases instruction parallelism</em> — the scheduler sees twice as many instructions at once and can interleave them into empty pipeline slots. <em>Improved register locality</em> — <code>a[i+1]</code> is computed in line 1 and reused in line 2, so it can stay in a register. <em>Improved data cache / TLB locality</em> — the two lines touch adjacent elements that share a cache line (Ch.4 spatial locality, straight back).</li>
<li><strong>The connection to delay slots.</strong> Unrolling and delayed branches feed each other: unrolling removes branches (fewer delay slots to fill) <em>and</em> supplies a bigger pool of independent instructions to fill the slots that remain. That is why the slide groups all three under "Optimization of Pipelining".</li>
<li><strong>The cost.</strong> Code size grows. Unroll by 4 or 8 and the loop body may no longer fit in the L1 instruction cache — at which point you have traded a pipeline stall for a cache miss, which is a far worse trade (Ch.5). Real compilers unroll by 2 or 4 and stop.</li>
</ul>
<p class="pitfall">⚠️ <strong>This slide has three typographical errors in its code — do not copy them into your answer.</strong> (1) In (a) the last term is printed <code>a[i+l]</code> with a lowercase letter L; it must be <code>a[i+1]</code>. (2) In (b) the first line prints <code>a[i+i]</code>; it must be <code>a[i+1]</code>. (3) The tail test prints <code>if (mod(n-2,2) = i)</code>; it must be <code>= 1</code>. All three are the slide's own errors (the same glyph confusions 1/l/i), not a change of meaning. The version typed above is the corrected one.</p>
<p class="meo">💡 Sanity check you can run on any unrolling question: <strong>count the iterations both ways.</strong> Original with n = 10: i = 2…9, that is 8 iterations. Unrolled: i = 2, 4, 6, 8 with step 2 — that is 4 iterations doing 2 bodies each = 8 bodies, and mod(8, 2) = 0 so the tail does not run. Same 8. If your counts differ, your unrolling is wrong.</p>`,
        `<p class="y-chinh">🎯 Kỹ thuật thứ ba của slide 23, trình bày thành một phép biến đổi MÃ NGUỒN bằng giả mã kiểu Fortran: <strong>(a) vòng lặp gốc</strong> và <strong>(b) vòng lặp đã bung hai lần</strong>. Thân vòng được nhân đôi, vòng chạy nửa số lần, và một cái đuôi nhỏ xử lý nốt vòng lẻ còn sót.</p>
<pre>(a) vòng lặp gốc
do i = 2, n-1
    a[i] = a[i] + a[i-1] * a[i+1]
end do

(b) vòng lặp bung hai lần
do i = 2, n-2, 2
    a[i]   = a[i]   + a[i-1] * a[i+1]
    a[i+1] = a[i+1] + a[i]   * a[i+2]
end do

if (mod(n-2, 2) = 1) then
    a[n-1] = a[n-1] + a[n-2] * a[n]
end if</pre>
<ul>
<li><strong>Cái gì đổi ở đầu vòng lặp.</strong> <code>do i = 2, n-1</code> thành <code>do i = 2, n-2, 2</code> — BƯỚC nhảy giờ là <strong>2</strong>, nên vòng chạy nửa số lần. Mỗi lần lặp làm việc của hai lần.</li>
<li><strong>Vì sao phải có cái <code>if</code> đuôi.</strong> Nếu số vòng lặp là LẺ thì vòng đã bung sẽ thiếu đúng một vòng. Phép <code>mod</code> bắt đúng ca đó và chạy nốt vòng cuối một mình. Quên cái đuôi này là lỗi kinh điển khi sinh viên bung vòng bằng tay.</li>
<li><strong>Bốn cái lợi slide 23 liệt kê, ánh xạ vào đúng đoạn mã này.</strong> <em>Giảm chi phí vòng lặp</em> — một lần tăng biến đếm và một lệnh rẽ nhánh giờ phục vụ HAI thân thay vì một. <em>Tăng song song mức lệnh</em> — bộ lập lịch nhìn thấy gấp đôi số lệnh cùng lúc và đan chúng vào các khe pipeline đang trống. <em>Cải thiện cục bộ thanh ghi</em> — <code>a[i+1]</code> tính ở dòng 1 rồi dùng lại ở dòng 2, nên nó ở lì trong thanh ghi được. <em>Cải thiện cục bộ cache dữ liệu / TLB</em> — hai dòng đụng vào các phần tử kề nhau, chung một dòng cache (đúng cục bộ KHÔNG GIAN của Ch.4).</li>
<li><strong>Nối với khe trì hoãn.</strong> Bung vòng và rẽ nhánh trì hoãn nuôi nhau: bung vòng XOÁ bớt lệnh rẽ nhánh (ít khe phải lấp hơn) <em>VÀ</em> cung cấp một kho lệnh độc lập lớn hơn để lấp những khe còn lại. Vì thế slide xếp cả ba vào chung mục "Optimization of Pipelining".</li>
<li><strong>Cái giá.</strong> Kích thước mã phình ra. Bung 4 hay 8 lần thì thân vòng có thể không còn lọt vào cache lệnh L1 — lúc đó bạn vừa đổi một lần khựng pipeline lấy một lần trượt cache, một cuộc đổi chác tệ hơn nhiều (Ch.5). Trình biên dịch thật bung 2 hoặc 4 rồi dừng.</li>
</ul>
<p class="pitfall">⚠️ <strong>Slide này có BA lỗi gõ trong đoạn mã — đừng chép nguyên vào bài làm.</strong> (1) Ở (a) số hạng cuối in là <code>a[i+l]</code> với chữ L thường; phải là <code>a[i+1]</code>. (2) Ở (b) dòng đầu in <code>a[i+i]</code>; phải là <code>a[i+1]</code>. (3) Điều kiện đuôi in <code>if (mod(n-2,2) = i)</code>; phải là <code>= 1</code>. Cả ba là lỗi của chính slide (đều là lẫn glyph 1 / l / i), không phải đổi ý nghĩa. Bản gõ ở trên là bản ĐÃ SỬA.</p>
<p class="meo">💡 Phép thử tỉnh táo dùng được cho mọi câu hỏi về bung vòng: <strong>ĐẾM SỐ VÒNG theo cả hai cách.</strong> Bản gốc với n = 10: i = 2…9, tức 8 vòng. Bản bung: i = 2, 4, 6, 8 bước 2 — 4 vòng, mỗi vòng 2 thân = 8 thân, và mod(8, 2) = 0 nên cái đuôi không chạy. Vẫn 8. Hai số lệch nhau là bạn bung sai.</p>`],

      [27, 'MIPS R4000 — the first commercial RISC family',
        `<p class="y-chinh">🎯 The chapter now stops arguing and shows a real machine. Seven boxes of facts about the <strong>MIPS R4000</strong>, the processor whose pipeline the next five slides dissect.</p>
<table>
<tr><th>What the slide says</th><th>Why it matters for this chapter</th></tr>
<tr><td>One of the first commercially available RISC chip sets was developed by <strong>MIPS Technology Inc.</strong></td><td>RISC left the university lab; MIPS and SPARC are the two commercial proofs the chapter uses</td></tr>
<tr><td>Inspired by an experimental system developed at <strong>Stanford</strong></td><td>MIPS = Stanford (Hennessy); the Berkeley line (Patterson) produced RISC I / II and then SPARC — two separate family trees</td></tr>
<tr><td>Has substantially the same architecture and instruction set as the earlier MIPS designs (<strong>R2000 and R3000</strong>)</td><td>This is why slides 30–32 can compare "R3000 pipeline" with "R4000 pipeline" directly — same ISA, deeper implementation</td></tr>
<tr><td>Uses <strong>64 bits</strong> for all internal and external data paths and for addresses, registers, and the ALU</td><td>A 64-bit machine in 1991; the fixed 32-bit <em>instruction</em> length (Figure 17.9) is independent of the 64-bit data path</td></tr>
<tr><td>Is partitioned into two sections, one containing the <strong>CPU</strong> and the other a <strong>coprocessor for memory management</strong></td><td>The MMU/TLB is a coprocessor — which is why TLB stages (ITLB, DTLB) appear as named boxes in Figure 17.10</td></tr>
<tr><td>Supports <strong>thirty-two 64-bit registers</strong></td><td>The RISC "large register file" characteristic — and notice MIPS chose 32 flat registers, <em>not</em> SPARC's register windows. Two valid answers to the same problem</td></tr>
<tr><td>Provides for up to <strong>128 Kbytes of high-speed cache, half each for instructions and data</strong></td><td>A split I-cache/D-cache — exactly the two-hump spatial locality argument of Ch.4, and it is what lets the I and D pipeline stages run in the same cycle without fighting</td></tr>
</table>
<ul>
<li><strong>Read the register count against Table 17.1 (slide 2).</strong> MIPS R4000 has 32 general-purpose registers; the Intel 80486 in the same table has 8. That factor of four is not decoration — it is the mechanism by which RISC keeps operands out of memory, which is what keeps the D stage free, which is what keeps the pipeline full.</li>
<li><strong>32 registers is a format decision, not just a hardware one.</strong> 32 registers needs exactly 5 bits to name one (2<sup>5</sup> = 32). Look ahead to Figure 17.9: every register field is 5 bits wide, and three of them plus a 6-bit opcode and a 6-bit function code make exactly 6+5+5+5+5+6 = <strong>32 bits</strong>. The register count and the instruction length were designed together.</li>
<li><strong>Connect to Ch.9 (OS support).</strong> "A coprocessor for memory management" means the TLB is on-chip and visible in the pipeline timing. Every address in Figure 17.10 is a <em>virtual</em> address that must be translated before the cache can answer.</li>
</ul>
<p class="pitfall">⚠️ Note on the source: the text extracted from the .pptx for this slide contains <em>only</em> the title "MIPS R4000" — all seven boxes are SmartArt, which the extractor drops. The content above was read directly from the rendered slide image. If you are revising from a text dump of these slides, you will silently lose this whole slide.</p>
<p class="meo">💡 Keep two names straight for the rest of the chapter: <strong>MIPS = Stanford, 32 flat registers, deep pipeline (slides 28–33). SPARC = Berkeley, register windows, circular stack (slides 34–38).</strong> Exam questions love to swap them.</p>`,
        `<p class="y-chinh">🎯 Tới đây chương thôi tranh luận và trưng ra một cỗ máy THẬT. Bảy hộp dữ kiện về <strong>MIPS R4000</strong>, con chip mà năm slide kế tiếp sẽ mổ xẻ pipeline của nó.</p>
<table>
<tr><th>Slide nói gì</th><th>Vì sao nó quan trọng với chương này</th></tr>
<tr><td>Một trong những bộ chip RISC thương mại đầu tiên do <strong>MIPS Technology Inc.</strong> phát triển</td><td>RISC đã rời phòng thí nghiệm đại học; MIPS và SPARC là hai bằng chứng thương mại mà chương dùng</td></tr>
<tr><td>Lấy cảm hứng từ một hệ thử nghiệm ở <strong>Stanford</strong></td><td>MIPS = Stanford (Hennessy); dòng Berkeley (Patterson) đẻ ra RISC I / II rồi SPARC — hai cây phả hệ riêng</td></tr>
<tr><td>Về cơ bản cùng kiến trúc và tập lệnh với các thiết kế MIPS trước đó (<strong>R2000 và R3000</strong>)</td><td>Chính vì thế slide 30–32 mới so thẳng "pipeline R3000" với "pipeline R4000" được — cùng ISA, chỉ khác độ sâu cài đặt</td></tr>
<tr><td>Dùng <strong>64 bit</strong> cho mọi đường dữ liệu trong và ngoài, cho địa chỉ, thanh ghi và ALU</td><td>Máy 64 bit từ 1991; độ dài <em>LỆNH</em> cố định 32 bit (Figure 17.9) là chuyện ĐỘC LẬP với đường dữ liệu 64 bit</td></tr>
<tr><td>Chia làm hai phần, một chứa <strong>CPU</strong>, một chứa <strong>đồng xử lý quản lý bộ nhớ</strong></td><td>MMU/TLB là một đồng xử lý — vì thế các tầng TLB (ITLB, DTLB) mới hiện thành hộp có tên trong Figure 17.10</td></tr>
<tr><td>Hỗ trợ <strong>32 thanh ghi 64 bit</strong></td><td>Đúng đặc trưng "tệp thanh ghi lớn" của RISC — và để ý MIPS chọn 32 thanh ghi PHẲNG, <em>KHÔNG</em> dùng cửa sổ thanh ghi như SPARC. Hai lời giải hợp lệ cho cùng một bài toán</td></tr>
<tr><td>Cung cấp tới <strong>128 KB cache tốc độ cao, chia đôi cho lệnh và dữ liệu</strong></td><td>Cache lệnh/dữ liệu TÁCH ĐÔI — đúng lập luận hai bướu về cục bộ không gian của Ch.4, và chính nó cho phép tầng I và tầng D chạy trong cùng một chu kỳ mà không giẫm nhau</td></tr>
</table>
<ul>
<li><strong>Đọc số thanh ghi đối chiếu Table 17.1 (slide 2).</strong> MIPS R4000 có 32 thanh ghi đa dụng; Intel 80486 trong cùng bảng có 8. Hệ số bốn đó không phải trang trí — đó là cơ chế để RISC giữ toán hạng NGOÀI bộ nhớ, tức giữ tầng D rảnh, tức giữ pipeline đầy.</li>
<li><strong>32 thanh ghi là một quyết định về KHUÔN DẠNG, không chỉ về phần cứng.</strong> 32 thanh ghi cần đúng 5 bit để gọi tên (2<sup>5</sup> = 32). Nhìn trước Figure 17.9: mọi trường thanh ghi đều rộng 5 bit, và ba trường đó cộng mã lệnh 6 bit cộng mã hàm 6 bit ra đúng 6+5+5+5+5+6 = <strong>32 bit</strong>. Số thanh ghi và độ dài lệnh được thiết kế CÙNG NHAU.</li>
<li><strong>Nối sang Ch.9 (hỗ trợ của hệ điều hành).</strong> "Đồng xử lý quản lý bộ nhớ" nghĩa là TLB nằm ngay trên chip và hiện ra trong giản đồ thời gian. Mọi địa chỉ trong Figure 17.10 đều là địa chỉ ẢO, phải dịch xong cache mới trả lời được.</li>
</ul>
<p class="pitfall">⚠️ Ghi chú về nguồn: bản trích chữ từ .pptx cho slide này CHỈ có đúng dòng tiêu đề "MIPS R4000" — cả bảy hộp là SmartArt, bộ trích bỏ qua. Nội dung ở trên đọc thẳng từ ẢNH slide đã render. Nếu bạn ôn bằng một bản đổ chữ của bộ slide này thì bạn đã âm thầm mất trắng cả slide này.</p>
<p class="meo">💡 Giữ hai cái tên cho khỏi lẫn tới hết chương: <strong>MIPS = Stanford, 32 thanh ghi phẳng, pipeline sâu (slide 28–33). SPARC = Berkeley, cửa sổ thanh ghi, chồng vòng tròn (slide 34–38).</strong> Đề thi rất thích tráo hai cái này.</p>`],

      [28, 'Figure 17.9 — MIPS Instruction Formats',
        `<p class="y-chinh">🎯 Three instruction formats, <strong>all exactly 32 bits wide</strong>. This single picture is the "simple instruction formats" characteristic of slide 18 made concrete — and it is what makes the I stage of the pipeline a fixed-cost operation.</p>
<table>
<tr><th>Format</th><th>Field layout (bits)</th><th>Total</th></tr>
<tr><td><strong>I-type</strong> (immediate)</td><td>Operation 6 · rs 5 · rt 5 · Immediate 16</td><td>6+5+5+16 = <strong>32</strong></td></tr>
<tr><td><strong>J-type</strong> (jump)</td><td>Operation 6 · Target 26</td><td>6+26 = <strong>32</strong></td></tr>
<tr><td><strong>R-type</strong> (register)</td><td>Operation 6 · rs 5 · rt 5 · rd 5 · Shift 5 · Function 6</td><td>6+5+5+5+5+6 = <strong>32</strong></td></tr>
</table>
<p class="nhan">📐 The slide's own legend: <strong>Operation</strong> = operation code · <strong>rs</strong> = source register specifier · <strong>rt</strong> = source/destination register specifier · <strong>Immediate</strong> = immediate, branch, or address displacement · <strong>Target</strong> = jump target address · <strong>rd</strong> = destination register specifier · <strong>Shift</strong> = shift amount · <strong>Function</strong> = ALU/shift function specifier.</p>
<ul>
<li><strong>Every register field is 5 bits, because there are 32 registers.</strong> 2<sup>5</sup> = 32. R-type names three registers (rs, rt, rd) — a true three-address instruction, which is what lets <code>ADD rd, rs, rt</code> be one register-to-register operation with no memory traffic.</li>
<li><strong>The opcode is always in the same place.</strong> Bits 31–26 are <em>always</em> the operation code, in all three formats. That means the decoder can start work on cycle one without first discovering how long the instruction is — the point slide 18 makes as "opcode decoding and register operand access can occur simultaneously".</li>
<li><strong>Why there are exactly three.</strong> One for arithmetic between registers (R), one for anything needing a constant or an offset (I: immediates, loads/stores, conditional branches), one for a long jump (J). That is the whole instruction set's shape. Compare Ch.14 (addressing modes and formats), where a CISC needs a dozen formats to say the same things.</li>
<li><strong>The 16-bit Immediate field does triple duty.</strong> In <code>ADDI</code> it is a constant; in <code>LW rt, offset(rs)</code> it is a displacement (the <em>only</em> addressing mode a load/store machine needs); in <code>BEQ</code> it is a branch displacement. One field, three uses — fewer formats, simpler decode.</li>
</ul>
<p class="nhan">📐 <strong>Measured, not asserted.</strong> MIPS is a museum piece, but the same rule is in the machine this lesson was written on (Apple M1 Max, arm64 — a modern RISC). Compiling a four-line C function with <code>cc -O1 -c</code> and disassembling with <code>otool -tv</code>:</p>
<pre>int tong(int *a, int n) {
    int s = 0;
    for (int i = 0; i &lt; n; i++) s += a[i];
    return s;
}

0000000000000000   cmp   w1, #0x1
0000000000000004   b.lt  0x28
0000000000000008   mov   w8, #0x0
000000000000000c   mov   w9, w1
0000000000000010   ldr   w10, [x0], #0x4
0000000000000014   add   w8, w10, w8
0000000000000018   subs  x9, x9, #0x1
000000000000001c   b.ne  0x10
0000000000000020   mov   x0, x8
0000000000000024   ret
0000000000000028   mov   w8, #0x0
000000000000002c   mov   x0, x8
0000000000000030   ret</pre>
<p class="dap-an">✅ Answer: <strong>13 instructions, and the gap between every pair of consecutive addresses is 4 bytes — [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], no exceptions, 52 bytes total.</strong> A fixed-length instruction set is not a historical claim about 1991; it is measurable on your own laptop today. Contrast with x86-64, where an instruction is <strong>1 to 15 bytes</strong> and the decoder cannot know where instruction 2 starts until it has decoded instruction 1 — the reason x86 front-ends are famously complicated.</p>
<p class="dap-an">✅ Second measurement from the same listing: <strong>exactly one of the 13 instructions touches memory</strong> (<code>ldr w10, [x0], #0x4</code>). The other twelve are register-to-register. That is the <em>load/store architecture</em> characteristic, counted rather than asserted: 1 memory instruction out of 13, i.e. only 1 in 13 instructions needs the pipeline's D stage.</p>
<p class="meo">💡 Mnemonic for the three formats: <strong>R = three Registers, I = an Immediate, J = a long Jump.</strong> The first letter is the answer.</p>`,
        `<p class="y-chinh">🎯 Ba khuôn dạng lệnh, <strong>cả ba đều rộng đúng 32 bit</strong>. Một bức hình này là đặc trưng "khuôn dạng lệnh đơn giản" của slide 18 hiện thành hình hài — và chính nó biến tầng I của pipeline thành một thao tác có chi phí CỐ ĐỊNH.</p>
<table>
<tr><th>Khuôn dạng</th><th>Bố trí trường (bit)</th><th>Tổng</th></tr>
<tr><td><strong>I-type</strong> (tức thời)</td><td>Operation 6 · rs 5 · rt 5 · Immediate 16</td><td>6+5+5+16 = <strong>32</strong></td></tr>
<tr><td><strong>J-type</strong> (nhảy)</td><td>Operation 6 · Target 26</td><td>6+26 = <strong>32</strong></td></tr>
<tr><td><strong>R-type</strong> (thanh ghi)</td><td>Operation 6 · rs 5 · rt 5 · rd 5 · Shift 5 · Function 6</td><td>6+5+5+5+5+6 = <strong>32</strong></td></tr>
</table>
<p class="nhan">📐 Chú giải của chính slide: <strong>Operation</strong> = mã phép toán · <strong>rs</strong> = chỉ định thanh ghi nguồn · <strong>rt</strong> = chỉ định thanh ghi nguồn/đích · <strong>Immediate</strong> = hằng tức thời, rẽ nhánh, hoặc độ dời địa chỉ · <strong>Target</strong> = địa chỉ đích của lệnh nhảy · <strong>rd</strong> = chỉ định thanh ghi đích · <strong>Shift</strong> = số bit dịch · <strong>Function</strong> = chỉ định hàm ALU/dịch.</p>
<ul>
<li><strong>Mọi trường thanh ghi đều 5 bit, vì có 32 thanh ghi.</strong> 2<sup>5</sup> = 32. R-type gọi tên BA thanh ghi (rs, rt, rd) — một lệnh ba địa chỉ thật sự, nhờ đó <code>ADD rd, rs, rt</code> mới là một phép thanh ghi–thanh ghi không đụng bộ nhớ.</li>
<li><strong>Mã lệnh LUÔN nằm cùng một chỗ.</strong> Bit 31–26 <em>LUÔN</em> là mã phép toán, ở cả ba khuôn dạng. Nghĩa là bộ giải mã bắt tay vào việc ngay từ chu kỳ một mà không phải tìm xem lệnh dài bao nhiêu đã — đúng ý slide 18 nói "giải mã mã lệnh và đọc toán hạng thanh ghi có thể xảy ra đồng thời".</li>
<li><strong>Vì sao đúng BA khuôn dạng.</strong> Một cho phép toán giữa các thanh ghi (R), một cho mọi thứ cần hằng số hoặc độ dời (I: tức thời, load/store, rẽ nhánh có điều kiện), một cho lệnh nhảy xa (J). Hình hài cả tập lệnh chỉ có thế. So với Ch.14 (chế độ địa chỉ & khuôn dạng), nơi một CISC cần cả chục khuôn dạng để nói cùng chừng ấy chuyện.</li>
<li><strong>Trường Immediate 16 bit làm ba việc.</strong> Trong <code>ADDI</code> nó là hằng số; trong <code>LW rt, offset(rs)</code> nó là độ dời (chế độ địa chỉ <em>DUY NHẤT</em> mà một máy load/store cần); trong <code>BEQ</code> nó là độ dời rẽ nhánh. Một trường, ba công dụng — ít khuôn dạng hơn, giải mã đơn giản hơn.</li>
</ul>
<p class="nhan">📐 <strong>ĐO THẬT, không phán bừa.</strong> MIPS là đồ bảo tàng, nhưng đúng luật đó nằm trong chính cái máy viết bài này (Apple M1 Max, arm64 — một RISC hiện đại). Biên dịch một hàm C bốn dòng bằng <code>cc -O1 -c</code> rồi dịch ngược bằng <code>otool -tv</code>:</p>
<pre>int tong(int *a, int n) {
    int s = 0;
    for (int i = 0; i &lt; n; i++) s += a[i];
    return s;
}

0000000000000000   cmp   w1, #0x1
0000000000000004   b.lt  0x28
0000000000000008   mov   w8, #0x0
000000000000000c   mov   w9, w1
0000000000000010   ldr   w10, [x0], #0x4
0000000000000014   add   w8, w10, w8
0000000000000018   subs  x9, x9, #0x1
000000000000001c   b.ne  0x10
0000000000000020   mov   x0, x8
0000000000000024   ret
0000000000000028   mov   w8, #0x0
000000000000002c   mov   x0, x8
0000000000000030   ret</pre>
<p class="dap-an">✅ Đáp án: <strong>13 lệnh, và khoảng cách giữa mọi cặp địa chỉ liên tiếp đều là 4 byte — [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], không một ngoại lệ, tổng 52 byte.</strong> Tập lệnh độ dài cố định không phải một lời khẳng định lịch sử về năm 1991; nó ĐO ĐƯỢC trên chính laptop của bạn hôm nay. Đối chiếu với x86-64, nơi một lệnh dài <strong>từ 1 tới 15 byte</strong> và bộ giải mã không thể biết lệnh thứ 2 bắt đầu ở đâu trước khi giải mã xong lệnh thứ 1 — lý do khiến phần đầu vào (front-end) của x86 nổi tiếng là phức tạp.</p>
<p class="dap-an">✅ Phép đo thứ hai từ chính bản dịch ngược đó: <strong>đúng MỘT trong 13 lệnh chạm bộ nhớ</strong> (<code>ldr w10, [x0], #0x4</code>). Mười hai lệnh còn lại là thanh ghi–thanh ghi. Đó là đặc trưng <em>kiến trúc load/store</em>, ĐẾM ĐƯỢC chứ không phải nói suông: 1 lệnh bộ nhớ trên 13, tức chỉ 1 trong 13 lệnh cần tới tầng D của pipeline.</p>
<p class="meo">💡 Mẹo nhớ ba khuôn dạng: <strong>R = ba Register, I = một Immediate, J = một Jump xa.</strong> Chữ cái đầu chính là câu trả lời.</p>`],

      [29, 'Instruction Pipeline — superscalar versus superpipelined',
        `<p class="y-chinh">🎯 The bridge slide. RISC reached <strong>one instruction per clock cycle</strong>; to go beyond that, two different architectural ideas appeared — <strong>superscalar</strong> (make the pipeline wider) and <strong>superpipelined</strong> (make it deeper). The R4000 is the second kind.</p>
<ul>
<li><strong>The starting point, in the slide's words.</strong> "With its simplified instruction architecture, the MIPS can achieve very efficient pipelining." And: "the initial experimental RISC systems and the first generation of commercial RISC processors achieve execution speeds that approach <strong>one instruction per system clock cycle</strong>." That is the goal Figure 17.6(c) drew.</li>
<li><strong>Superscalar — replicate the stages.</strong> The slide: "Replicates each of the pipeline stages so that two or more instructions at the same stage of the pipeline can be processed simultaneously." Two fetch units, two ALUs, two write-back ports. The limitations it names: "dependencies between instructions in different pipelines can slow down the system, and overhead logic is required to coordinate these dependencies."</li>
<li><strong>Superpipelined — subdivide the stages.</strong> The slide: "Makes use of more, and more fine-grained, pipeline stages. With more stages, more instructions can be in the pipeline at the same time, increasing parallelism." The limitation: "there is overhead associated with transferring instructions from one stage to the next."</li>
</ul>
<table>
<tr><th></th><th>Superscalar</th><th>Superpipelined</th></tr>
<tr><td><strong>What it changes</strong></td><td>WIDTH — several instructions per stage</td><td>DEPTH — each stage split into smaller ones</td></tr>
<tr><td><strong>Instructions in flight</strong></td><td>More, side by side</td><td>More, one behind the other</td></tr>
<tr><td><strong>Clock rate</strong></td><td>Unchanged</td><td>Higher — a shorter stage can be clocked faster</td></tr>
<tr><td><strong>Cost paid</strong></td><td>Duplicated hardware + dependency-checking logic</td><td>Latch overhead between stages + a longer branch penalty</td></tr>
<tr><td><strong>Example in this deck</strong></td><td>Table 17.1 slide 3 (PowerPC, UltraSPARC, R10000); full treatment in Ch.18</td><td>MIPS R4000, Figure 17.11 on slide 32</td></tr>
</table>
<ul>
<li><strong>Why the two limitations are really the same limitation.</strong> Both widen the window of instructions that are simultaneously incomplete, and both therefore pay more when something goes wrong. Superscalar pays in dependency logic; superpipelined pays in branch penalty — remember Figure 17.6(d), where the four-stage pipeline needed <em>four</em> NOOPs instead of two.</li>
<li><strong>Modern processors do both at once.</strong> An Apple M-series or a modern x86 core is roughly 8-wide (superscalar) and 15–20 stages deep (superpipelined). The two ideas the slide presents as alternatives turned out to be complementary. Ch.18 (Instruction-Level Parallelism and Superscalar Processors) is the direct sequel to this slide.</li>
<li><strong>Connect back to Ch.12.</strong> Everything here rests on the basic pipeline of Ch.12; RISC's contribution was making the instruction set regular enough that going wider or deeper actually pays off. Try to superpipeline a VAX instruction that can reference six memory operands (Table 17.7, slide 21) and you will see why.</li>
</ul>
<p class="meo">💡 One-word memory hook: <strong>superscalar = WIDER, superpipelined = DEEPER.</strong> If the question mentions duplicated ALUs or issuing two instructions per cycle → superscalar. If it mentions half-cycle stages, more stages, or a higher clock → superpipelined.</p>
<p class="pitfall">⚠️ Trap: "superpipelining gets more than one instruction per cycle". Strictly, a superpipelined machine still completes one instruction per <em>internal</em> stage-clock; it just runs that clock faster than the old cycle. Only a superscalar machine completes more than one instruction per clock in the ordinary sense. Exam wording plays on this.</p>`,
        `<p class="y-chinh">🎯 Slide bản lề. RISC đã chạm tới <strong>một lệnh mỗi chu kỳ xung nhịp</strong>; muốn vượt qua mốc đó thì có hai ý tưởng kiến trúc khác nhau — <strong>superscalar</strong> (làm pipeline RỘNG ra) và <strong>superpipelined</strong> (làm nó SÂU xuống). R4000 thuộc loại thứ hai.</p>
<ul>
<li><strong>Điểm xuất phát, nguyên văn slide.</strong> "Với kiến trúc tập lệnh đã đơn giản hoá, MIPS đạt được pipeline rất hiệu quả." Và: "các hệ RISC thử nghiệm ban đầu cùng thế hệ vi xử lý RISC thương mại đầu tiên đạt tốc độ thực thi tiệm cận <strong>một lệnh mỗi chu kỳ xung nhịp hệ thống</strong>." Đó đúng là cái đích Figure 17.6(c) đã vẽ.</li>
<li><strong>Superscalar — NHÂN BẢN các tầng.</strong> Slide ghi: "Nhân bản mỗi tầng của pipeline sao cho hai hay nhiều lệnh ở cùng một tầng có thể được xử lý đồng thời." Hai khối nạp lệnh, hai ALU, hai cổng ghi trả. Hạn chế slide nêu: "phụ thuộc giữa các lệnh ở những pipeline khác nhau có thể làm chậm hệ thống, và cần thêm logic điều phối để xử lý những phụ thuộc đó."</li>
<li><strong>Superpipelined — CHẺ NHỎ các tầng.</strong> Slide ghi: "Dùng nhiều tầng hơn và tầng mịn hơn. Nhiều tầng hơn thì nhiều lệnh cùng nằm trong pipeline hơn, tăng tính song song." Hạn chế: "có chi phí đi kèm khi chuyển lệnh từ tầng này sang tầng kế tiếp."</li>
</ul>
<table>
<tr><th></th><th>Superscalar</th><th>Superpipelined</th></tr>
<tr><td><strong>Nó đổi cái gì</strong></td><td>CHIỀU RỘNG — nhiều lệnh trong một tầng</td><td>CHIỀU SÂU — mỗi tầng chẻ thành tầng nhỏ hơn</td></tr>
<tr><td><strong>Số lệnh đang bay</strong></td><td>Nhiều hơn, nằm CẠNH nhau</td><td>Nhiều hơn, nằm NỐI ĐUÔI nhau</td></tr>
<tr><td><strong>Tần số xung nhịp</strong></td><td>Không đổi</td><td>Cao hơn — tầng ngắn hơn thì đập nhịp nhanh hơn được</td></tr>
<tr><td><strong>Cái giá phải trả</strong></td><td>Phần cứng nhân đôi + logic kiểm tra phụ thuộc</td><td>Chi phí chốt giữa các tầng + hình phạt rẽ nhánh dài hơn</td></tr>
<tr><td><strong>Ví dụ trong chính deck này</strong></td><td>Table 17.1 slide 3 (PowerPC, UltraSPARC, R10000); học đầy đủ ở Ch.18</td><td>MIPS R4000, Figure 17.11 ở slide 32</td></tr>
</table>
<ul>
<li><strong>Vì sao hai hạn chế kia thực ra là MỘT.</strong> Cả hai đều mở rộng cửa sổ những lệnh đang dở dang cùng lúc, nên cả hai đều trả giá đắt hơn khi có sự cố. Superscalar trả bằng logic phụ thuộc; superpipelined trả bằng hình phạt rẽ nhánh — nhớ lại Figure 17.6(d), nơi pipeline bốn tầng cần tới <em>BỐN</em> NOOP thay vì hai.</li>
<li><strong>Vi xử lý hiện đại làm CẢ HAI cùng lúc.</strong> Một lõi Apple M-series hay một lõi x86 đời mới rộng cỡ 8 lệnh (superscalar) và sâu 15–20 tầng (superpipelined). Hai ý tưởng mà slide trình bày như hai lựa chọn hoá ra BỔ SUNG cho nhau. Ch.18 (Song song mức lệnh & bộ xử lý superscalar) là phần tiếp nối trực tiếp của slide này.</li>
<li><strong>Nối ngược về Ch.12.</strong> Mọi thứ ở đây đứng trên cái pipeline cơ bản của Ch.12; đóng góp của RISC là làm tập lệnh ĐỀU tới mức việc rộng ra hay sâu xuống mới thật sự có lời. Thử superpipeline một lệnh VAX có thể tham chiếu sáu toán hạng bộ nhớ (Table 17.7, slide 21) là bạn hiểu ngay vì sao.</li>
</ul>
<p class="meo">💡 Mẹo nhớ một chữ: <strong>superscalar = RỘNG, superpipelined = SÂU.</strong> Đề nhắc tới nhân đôi ALU hay phát hai lệnh mỗi chu kỳ → superscalar. Đề nhắc tới tầng nửa chu kỳ, thêm tầng, hay xung nhịp cao hơn → superpipelined.</p>
<p class="pitfall">⚠️ Bẫy: "superpipelining cho hơn một lệnh mỗi chu kỳ". Nói cho chặt thì máy superpipelined vẫn hoàn tất một lệnh mỗi nhịp tầng <em>BÊN TRONG</em>; nó chỉ chạy cái nhịp đó nhanh hơn chu kỳ cũ. Chỉ máy superscalar mới hoàn tất hơn một lệnh mỗi nhịp theo nghĩa thông thường. Đề thi hay chơi chữ ngay chỗ này.</p>`],

      [30, 'Figure 17.10 — Enhancing the R3000 Pipeline',
        `<p class="y-chinh">🎯 Three pictures of the <em>same</em> five-stage R3000 pipeline being squeezed: (a) the detailed stages, (b) the same work with reduced latencies, (c) the optimized version with <strong>TLB and cache accessed in parallel</strong>. This is the step that makes the R4000's superpipeline possible.</p>
<p class="nhan">📐 The abbreviations, from the slide's own legend: <strong>IF</strong> instruction fetch · <strong>RD</strong> read · <strong>MEM</strong> memory access · <strong>WB</strong> write back to register file · <strong>I-Cache</strong> instruction cache access · <strong>RF</strong> fetch operand from register · <strong>D-Cache</strong> data cache access · <strong>ITLB</strong> instruction address translation · <strong>IDEC</strong> instruction decode · <strong>IA</strong> compute instruction address · <strong>DA</strong> calculate data virtual address · <strong>DTLB</strong> data address translation · <strong>TC</strong> data cache tag check.</p>
<table>
<tr><th>Panel</th><th>What it shows</th><th>Stages / cycles</th></tr>
<tr><td>(a) Detailed R3000 pipeline</td><td>Five named stages IF · RD · ALU · MEM · WB, each split into two clock phases (φ<sub>1</sub>, φ<sub>2</sub>); underneath, the real micro-operations: ITLB, I-Cache, IDEC, IA, RF, ALU OP, DA, DTLB, D-Cache, WB</td><td>5 stages, 10 phases</td></tr>
<tr><td>(b) Modified R3000 pipeline with reduced latencies</td><td>The micro-operations laid out one per cycle: ITLB · I-Cache · RF · ALU · DTLB · D-Cache · WB</td><td><strong>7 cycles</strong></td></tr>
<tr><td>(c) Optimized R3000 pipeline with parallel TLB and cache accesses</td><td>ITLB · RF · ALU · D-Cache · TC · WB — the data TLB translation now happens <em>at the same time</em> as the cache access, and only the tag check (TC) is left behind it</td><td><strong>6 cycles</strong></td></tr>
</table>
<ul>
<li><strong>The key trick in panel (c): do the translation and the lookup at once.</strong> Normally you must translate a virtual address (DTLB) before you can look in the cache (D-Cache) — a strict sequence. But if the cache is indexed by the bits of the address that the translation <em>does not change</em> (the page offset), the lookup can start immediately, and the physical tag only has to be compared afterwards. That comparison is the new <strong>TC</strong> stage.</li>
<li><strong>That is the virtually-indexed, physically-tagged cache of Ch.5/Ch.9.</strong> The constraint is that the index bits must fit inside the page offset, which caps the size of a directly-indexed L1 cache — this is exactly why real L1 caches are stubbornly 32–128 kB while L2 is megabytes. A design decision from three chapters ago shows up here as one fewer pipeline stage.</li>
<li><strong>Why shortening stages matters more than it looks.</strong> Going from 7 cycles to 6 does not speed up one instruction much. What it does is shorten the <em>distance</em> between issue and result, which shrinks every hazard penalty: fewer load-delay slots to fill, a shorter branch penalty, less forwarding logic. The whole chapter's arithmetic gets cheaper.</li>
<li><strong>Read panel (a) as the honest engineering.</strong> Five clean boxes on top, a messy row of ten real operations below. RISC did not make the hardware simple — it made the <em>instruction set</em> simple so that the hardware could be arranged into stages of equal length. Those are different claims.</li>
</ul>
<p class="meo">💡 Follow one letter through the three panels: <strong>DTLB</strong>. In (a) it is a sub-box inside the ALU stage; in (b) it is a whole cycle of its own; in (c) it has vanished into the cache access and left only TC. The compression of that one operation is the entire figure.</p>
<p class="pitfall">⚠️ Do not read the three panels as three different processors. They are three <em>drawings of the same R3000</em>, progressively idealized, to explain where the R4000's eight half-stages (slide 32) came from.</p>`,
        `<p class="y-chinh">🎯 Ba bức tranh của <em>CÙNG MỘT</em> pipeline năm tầng của R3000 đang bị nén lại: (a) các tầng chi tiết, (b) cũng chừng ấy việc nhưng độ trễ đã rút, (c) bản tối ưu với <strong>TLB và cache truy cập SONG SONG</strong>. Đây chính là bước làm nên siêu pipeline của R4000.</p>
<p class="nhan">📐 Các chữ viết tắt, lấy từ chú giải của chính slide: <strong>IF</strong> nạp lệnh · <strong>RD</strong> đọc · <strong>MEM</strong> truy cập bộ nhớ · <strong>WB</strong> ghi trả về tệp thanh ghi · <strong>I-Cache</strong> truy cập cache lệnh · <strong>RF</strong> lấy toán hạng từ thanh ghi · <strong>D-Cache</strong> truy cập cache dữ liệu · <strong>ITLB</strong> dịch địa chỉ lệnh · <strong>IDEC</strong> giải mã lệnh · <strong>IA</strong> tính địa chỉ lệnh · <strong>DA</strong> tính địa chỉ ảo của dữ liệu · <strong>DTLB</strong> dịch địa chỉ dữ liệu · <strong>TC</strong> kiểm thẻ cache dữ liệu.</p>
<table>
<tr><th>Khung</th><th>Nó cho thấy gì</th><th>Tầng / chu kỳ</th></tr>
<tr><td>(a) Pipeline R3000 chi tiết</td><td>Năm tầng có tên IF · RD · ALU · MEM · WB, mỗi tầng chẻ làm hai pha xung nhịp (φ<sub>1</sub>, φ<sub>2</sub>); bên dưới là các vi thao tác THẬT: ITLB, I-Cache, IDEC, IA, RF, ALU OP, DA, DTLB, D-Cache, WB</td><td>5 tầng, 10 pha</td></tr>
<tr><td>(b) Pipeline R3000 sửa lại, độ trễ đã rút</td><td>Các vi thao tác bày ra mỗi cái một chu kỳ: ITLB · I-Cache · RF · ALU · DTLB · D-Cache · WB</td><td><strong>7 chu kỳ</strong></td></tr>
<tr><td>(c) Pipeline R3000 tối ưu, TLB và cache truy cập song song</td><td>ITLB · RF · ALU · D-Cache · TC · WB — việc dịch địa chỉ dữ liệu giờ chạy <em>CÙNG LÚC</em> với truy cập cache, chỉ còn phép kiểm thẻ (TC) nằm lại phía sau</td><td><strong>6 chu kỳ</strong></td></tr>
</table>
<ul>
<li><strong>Mẹo cốt tử ở khung (c): dịch địa chỉ và tra cache CÙNG LÚC.</strong> Bình thường phải dịch địa chỉ ảo (DTLB) xong mới tra được cache (D-Cache) — một chuỗi chặt cứng. Nhưng nếu cache được đánh chỉ số bằng đúng những bit mà phép dịch <em>KHÔNG</em> đụng tới (phần offset trong trang) thì việc tra có thể bắt đầu ngay, và thẻ vật lý chỉ cần đem so SAU đó. Phép so ấy chính là tầng <strong>TC</strong> mới.</li>
<li><strong>Đó là cache đánh chỉ số ảo, gắn thẻ vật lý của Ch.5/Ch.9.</strong> Ràng buộc là các bit chỉ số phải lọt trong offset của trang, điều này CHẶN TRẦN kích thước cache L1 đánh chỉ số trực tiếp — chính xác là lý do cache L1 thật cứ lì ở 32–128 kB trong khi L2 tính bằng megabyte. Một quyết định thiết kế từ ba chương trước hiện ra ở đây thành một tầng pipeline bớt đi.</li>
<li><strong>Vì sao rút ngắn tầng quan trọng hơn vẻ ngoài của nó.</strong> Từ 7 chu kỳ xuống 6 không làm một lệnh nhanh lên bao nhiêu. Cái nó làm là rút ngắn <em>KHOẢNG CÁCH</em> giữa lúc phát lệnh và lúc có kết quả, nhờ đó mọi hình phạt hiểm hoạ đều teo lại: ít khe trì hoãn nạp phải lấp hơn, hình phạt rẽ nhánh ngắn hơn, ít logic forwarding hơn. Toàn bộ phép tính của cả chương rẻ đi.</li>
<li><strong>Hãy đọc khung (a) như một lời thú nhận kỹ thuật thành thật.</strong> Năm cái hộp sạch sẽ ở trên, một hàng mười thao tác thật lộn xộn ở dưới. RISC KHÔNG làm phần cứng đơn giản — nó làm <em>TẬP LỆNH</em> đơn giản để phần cứng sắp được thành những tầng dài bằng nhau. Đó là hai khẳng định khác nhau.</li>
</ul>
<p class="meo">💡 Bám theo đúng một chữ qua ba khung: <strong>DTLB</strong>. Ở (a) nó là một hộp con nằm trong tầng ALU; ở (b) nó chiếm trọn một chu kỳ riêng; ở (c) nó BIẾN MẤT vào trong lần truy cập cache, chỉ để lại TC. Sự nén của riêng một thao tác đó là toàn bộ nội dung bức hình.</p>
<p class="pitfall">⚠️ Đừng đọc ba khung như ba bộ xử lý khác nhau. Chúng là ba <em>BẢN VẼ CỦA CÙNG MỘT R3000</em>, lý tưởng hoá dần, để giải thích tám nửa-tầng của R4000 (slide 32) từ đâu ra.</p>`],

      [31, 'Table 17.9 — R3000 Pipeline Stages',
        `<p class="y-chinh">🎯 The five R3000 stages written out phase by phase — <strong>eleven rows</strong>, because each stage has a φ<sub>1</sub> and a φ<sub>2</sub> half. Read it as the answer to "what exactly happens inside one of those boxes in Figure 17.10".</p>
<table>
<tr><th>Stage</th><th>Phase</th><th>Function (the slide's words)</th></tr>
<tr><td>IF</td><td>1</td><td>Using the TLB, translate an instruction virtual address to a physical address (after a branching decision)</td></tr>
<tr><td>IF</td><td>2</td><td>Send the physical address to the instruction address</td></tr>
<tr><td>RD</td><td>1</td><td>Return instruction from instruction cache. Compare tags and validity of fetched instruction</td></tr>
<tr><td>RD</td><td>2</td><td>Decode instruction. Read register file. If branch, calculate branch target address</td></tr>
<tr><td>ALU</td><td>1 + 2</td><td>If register-to-register operation, the arithmetic or logical operation is performed</td></tr>
<tr><td>ALU</td><td>1</td><td>If a branch, decide whether the branch is to be taken or not. If a memory reference (load or store), calculate data virtual address</td></tr>
<tr><td>ALU</td><td>2</td><td>If a memory reference, translate data virtual address to physical using TLB</td></tr>
<tr><td>MEM</td><td>1</td><td>If a memory reference, send physical address to data cache</td></tr>
<tr><td>MEM</td><td>2</td><td>If a memory reference, return data from data cache, and check tags</td></tr>
<tr><td>WB</td><td>1</td><td>Write to register file</td></tr>
</table>
<ul>
<li><strong>Notice how many rows begin with "If".</strong> Six of the ten. A RISC stage is not "do this operation" but "do whichever of these three mutually exclusive things this instruction needs" — register op, branch resolution, or address calculation. They are mutually exclusive precisely <em>because</em> the instruction set is reduced; that is how one ALU stage serves every instruction type without ever needing two.</li>
<li><strong>The ALU stage has three rows, and that is the interesting part.</strong> A register-to-register operation uses <strong>both phases</strong> (1 + 2) for the arithmetic. A memory reference uses phase 1 for the address calculation and phase 2 for the TLB translation. A branch uses phase 1 to decide taken/not-taken. Same hardware window, three different uses — the essence of a uniform pipeline.</li>
<li><strong>Where the branch penalty lives.</strong> The target address is computed in <strong>RD phase 2</strong>, but whether to take the branch is decided in <strong>ALU phase 1</strong> — one stage later. Between those two moments the pipeline has already fetched the next instruction. That gap is precisely the <em>delay slot</em> of slides 23–25. You can point at it in this table.</li>
<li><strong>Why WB has only one phase.</strong> Writing a register takes half a cycle, so the R3000 writes in φ<sub>1</sub> and the next instruction can read the same register in φ<sub>2</sub> of the same cycle. That half-cycle trick is a cheap form of forwarding, and it is why the table stops at ten rows instead of eleven.</li>
<li><strong>Connect to Ch.9 and Ch.5.</strong> IF-1 and ALU-2 are both TLB lookups (instruction side and data side); RD-1 and MEM-2 are both cache tag comparisons. Two chapters of memory-system theory appear here as four table rows.</li>
</ul>
<p class="meo">💡 Learn the five stage names as a sentence: <strong>"Fetch it, Read it, Compute it, Memory it, Write it back"</strong> — IF, RD, ALU, MEM, WB. Every RISC pipeline in every textbook is a renaming of these five.</p>
<p class="pitfall">⚠️ Trap: the slide's ALU rows are listed as "1 + 2", then "1", then "2" — students sometimes read this as three <em>consecutive</em> ALU stages. It is one stage described three times, once per instruction category. The table is a menu, not a sequence.</p>`,
        `<p class="y-chinh">🎯 Năm tầng của R3000 viết ra theo từng PHA — <strong>mười một dòng</strong>, vì mỗi tầng có nửa φ<sub>1</sub> và nửa φ<sub>2</sub>. Hãy đọc nó như câu trả lời cho "bên trong một cái hộp ở Figure 17.10 thì chính xác xảy ra chuyện gì".</p>
<table>
<tr><th>Tầng</th><th>Pha</th><th>Chức năng (nguyên văn slide)</th></tr>
<tr><td>IF</td><td>1</td><td>Dùng TLB dịch địa chỉ ảo của lệnh thành địa chỉ vật lý (sau khi đã có quyết định rẽ nhánh)</td></tr>
<tr><td>IF</td><td>2</td><td>Gửi địa chỉ vật lý tới địa chỉ lệnh</td></tr>
<tr><td>RD</td><td>1</td><td>Trả lệnh từ cache lệnh. So thẻ và kiểm tính hợp lệ của lệnh vừa nạp</td></tr>
<tr><td>RD</td><td>2</td><td>Giải mã lệnh. Đọc tệp thanh ghi. Nếu là rẽ nhánh, tính địa chỉ đích rẽ nhánh</td></tr>
<tr><td>ALU</td><td>1 + 2</td><td>Nếu là phép thanh ghi–thanh ghi, thực hiện phép số học hoặc logic</td></tr>
<tr><td>ALU</td><td>1</td><td>Nếu là rẽ nhánh, quyết định có rẽ hay không. Nếu là tham chiếu bộ nhớ (load hoặc store), tính địa chỉ ảo của dữ liệu</td></tr>
<tr><td>ALU</td><td>2</td><td>Nếu là tham chiếu bộ nhớ, dùng TLB dịch địa chỉ ảo dữ liệu sang vật lý</td></tr>
<tr><td>MEM</td><td>1</td><td>Nếu là tham chiếu bộ nhớ, gửi địa chỉ vật lý tới cache dữ liệu</td></tr>
<tr><td>MEM</td><td>2</td><td>Nếu là tham chiếu bộ nhớ, trả dữ liệu từ cache dữ liệu, và kiểm thẻ</td></tr>
<tr><td>WB</td><td>1</td><td>Ghi vào tệp thanh ghi</td></tr>
</table>
<ul>
<li><strong>Để ý bao nhiêu dòng bắt đầu bằng chữ "Nếu".</strong> Sáu trên mười. Một tầng RISC không phải là "làm phép này" mà là "làm một trong ba việc LOẠI TRỪ NHAU mà lệnh này cần" — phép thanh ghi, giải quyết rẽ nhánh, hoặc tính địa chỉ. Chúng loại trừ nhau chính <em>VÌ</em> tập lệnh đã rút gọn; nhờ đó một tầng ALU phục vụ được mọi loại lệnh mà không bao giờ cần tới hai.</li>
<li><strong>Tầng ALU có tới ba dòng, và đó mới là chỗ thú vị.</strong> Phép thanh ghi–thanh ghi dùng <strong>cả hai pha</strong> (1 + 2) cho phần số học. Tham chiếu bộ nhớ dùng pha 1 để tính địa chỉ và pha 2 để dịch TLB. Rẽ nhánh dùng pha 1 để quyết định rẽ hay không. Cùng một khung phần cứng, ba công dụng khác nhau — đó là cốt lõi của một pipeline ĐỀU.</li>
<li><strong>Hình phạt rẽ nhánh nằm ở đâu.</strong> Địa chỉ đích được tính ở <strong>RD pha 2</strong>, nhưng quyết định CÓ rẽ hay không lại ở <strong>ALU pha 1</strong> — muộn hơn một tầng. Giữa hai thời điểm đó pipeline đã nạp xong lệnh kế tiếp rồi. Cái khoảng hở ấy chính xác là <em>KHE TRÌ HOÃN</em> của slide 23–25. Bạn có thể chỉ tay vào nó ngay trong bảng này.</li>
<li><strong>Vì sao WB chỉ có một pha.</strong> Ghi một thanh ghi tốn nửa chu kỳ, nên R3000 ghi ở φ<sub>1</sub> và lệnh kế tiếp đọc lại đúng thanh ghi đó ở φ<sub>2</sub> của cùng chu kỳ. Mẹo nửa chu kỳ ấy là một dạng forwarding rẻ tiền, và đó là lý do bảng dừng ở mười dòng thay vì mười một.</li>
<li><strong>Nối sang Ch.9 và Ch.5.</strong> IF-1 và ALU-2 đều là tra TLB (phía lệnh và phía dữ liệu); RD-1 và MEM-2 đều là so thẻ cache. Hai chương lý thuyết hệ thống nhớ hiện ra ở đây thành bốn dòng bảng.</li>
</ul>
<p class="meo">💡 Học năm tên tầng thành một câu: <strong>"Nạp nó, Đọc nó, Tính nó, Nhớ nó, Ghi trả nó"</strong> — IF, RD, ALU, MEM, WB. Mọi pipeline RISC trong mọi giáo trình đều là bản đổi tên của năm cái này.</p>
<p class="pitfall">⚠️ Bẫy: ba dòng ALU của slide ghi là "1 + 2", rồi "1", rồi "2" — sinh viên đôi khi đọc thành BA tầng ALU LIÊN TIẾP. Không, đó là MỘT tầng được mô tả ba lần, mỗi lần cho một loại lệnh. Bảng này là một THỰC ĐƠN, không phải một trình tự.</p>`],

      [32, 'Figure 17.11 — Theoretical R3000 and Actual R4000 Superpipelines',
        `<p class="y-chinh">🎯 The payoff of slides 30–31: two timing diagrams showing <strong>eight half-length stages</strong> instead of five full-length ones, with two instructions drawn one half-cycle apart. This is what "superpipelined" looks like on paper.</p>
<p class="nhan">📐 Panel (a) — a superpipelined implementation of the <em>optimized R3000</em> pipeline, ten stages per instruction: <strong>IC1 · IC2 · RF · ALU · ALU · DC1 · DC2 · TC1 · TC2 · WB</strong>. Panel (b) — the <em>actual R4000</em> pipeline, eight stages: <strong>IF · IS · RF · EX · DF · DS · TC · WB</strong>. In both, the second instruction starts one stage after the first, so two instructions are in flight per clock cycle.</p>
<table>
<tr><th>R4000 stage</th><th>Name</th><th>What happens (slide 33)</th></tr>
<tr><td><strong>IF</strong></td><td>Instruction fetch first half</td><td>Virtual address is presented to the instruction cache and the TLB</td></tr>
<tr><td><strong>IS</strong></td><td>Instruction fetch second half</td><td>Instruction cache outputs the instruction and the TLB generates the physical address</td></tr>
<tr><td><strong>RF</strong></td><td>Register file</td><td>Decode + interlock check, or I-cache tag check, or fetch operands from the register file</td></tr>
<tr><td><strong>EX</strong></td><td>Instruction execute</td><td>ALU operation, or data virtual address calculation, or branch target calculation</td></tr>
<tr><td><strong>DF</strong></td><td>Data cache first half</td><td>Virtual address is presented to the data cache and TLB</td></tr>
<tr><td><strong>DS</strong></td><td>Data cache second half</td><td>TLB generates the physical address and the data cache outputs the data</td></tr>
<tr><td><strong>TC</strong></td><td>Tag check</td><td>Cache tag checks are performed for loads and stores</td></tr>
<tr><td><strong>WB</strong></td><td>Write back</td><td>Instruction result is written back to the register file</td></tr>
</table>
<ul>
<li><strong>The naming tells you the whole design.</strong> IF/IS is one fetch split in two; DF/DS is one data-cache access split in two. The R4000 did not invent new work — it <em>halved</em> existing work so each half could be clocked twice as fast. That is the definition of superpipelining from slide 29.</li>
<li><strong>Why (a) is "theoretical" and (b) is "actual".</strong> Panel (a) splits everything mechanically and lands on ten stages; the shipped R4000 merged a few and landed on eight. Engineering rounds off theory — worth remembering when an exam asks why a real processor does not match the clean model.</li>
<li><strong>The price, and it is the same price as always.</strong> With eight stages instead of five, the branch decision is known even later, so the R4000 has a longer branch penalty and needs more delay-slot filling. This is Figure 17.6(d) again: deeper pipelines need more NOOPs. Superpipelining buys clock rate and pays in hazard penalties.</li>
<li><strong>TC is now a whole stage of its own.</strong> Compare Figure 17.10(c), where TC first appeared as the leftover of the parallel TLB/cache trick. Here it is a full pipeline stage, which means a load's data is <em>usable</em> before its tag check has finished — the processor speculates that the cache hit is valid and undoes the instruction if it was not.</li>
</ul>
<p class="meo">💡 Count the letters to identify the machine: <strong>five stages (IF RD ALU MEM WB) = R3000; eight stages (IF IS RF EX DF DS TC WB) = R4000.</strong> Any question naming IS, DF or DS is about the R4000.</p>
<p class="pitfall">⚠️ Trap: reading panel (b) as "the R4000 executes two instructions at once". It does not — it is not superscalar. The two rows are the <em>same single pipeline</em> drawn at two different moments, one stage apart. Only one instruction enters per stage-clock.</p>`,
        `<p class="y-chinh">🎯 Phần thưởng của slide 30–31: hai giản đồ thời gian cho thấy <strong>TÁM tầng nửa độ dài</strong> thay vì năm tầng nguyên, với hai lệnh vẽ cách nhau nửa chu kỳ. Đây chính là dáng vẻ của "superpipelined" trên giấy.</p>
<p class="nhan">📐 Khung (a) — bản cài đặt superpipeline của pipeline <em>R3000 đã tối ưu</em>, mười tầng mỗi lệnh: <strong>IC1 · IC2 · RF · ALU · ALU · DC1 · DC2 · TC1 · TC2 · WB</strong>. Khung (b) — pipeline <em>R4000 THẬT</em>, tám tầng: <strong>IF · IS · RF · EX · DF · DS · TC · WB</strong>. Ở cả hai, lệnh thứ hai bắt đầu sau lệnh thứ nhất đúng một tầng, nên mỗi chu kỳ xung nhịp có hai lệnh đang bay.</p>
<table>
<tr><th>Tầng R4000</th><th>Tên</th><th>Chuyện gì xảy ra (slide 33)</th></tr>
<tr><td><strong>IF</strong></td><td>Nạp lệnh nửa đầu</td><td>Đưa địa chỉ ảo tới cache lệnh và TLB</td></tr>
<tr><td><strong>IS</strong></td><td>Nạp lệnh nửa sau</td><td>Cache lệnh xuất ra lệnh và TLB sinh địa chỉ vật lý</td></tr>
<tr><td><strong>RF</strong></td><td>Tệp thanh ghi</td><td>Giải mã + kiểm điều kiện khoá liên động, hoặc kiểm thẻ cache lệnh, hoặc lấy toán hạng từ tệp thanh ghi</td></tr>
<tr><td><strong>EX</strong></td><td>Thực thi lệnh</td><td>Phép ALU, hoặc tính địa chỉ ảo của dữ liệu, hoặc tính địa chỉ đích rẽ nhánh</td></tr>
<tr><td><strong>DF</strong></td><td>Cache dữ liệu nửa đầu</td><td>Đưa địa chỉ ảo tới cache dữ liệu và TLB</td></tr>
<tr><td><strong>DS</strong></td><td>Cache dữ liệu nửa sau</td><td>TLB sinh địa chỉ vật lý và cache dữ liệu xuất ra dữ liệu</td></tr>
<tr><td><strong>TC</strong></td><td>Kiểm thẻ</td><td>Thực hiện kiểm thẻ cache cho các lệnh load và store</td></tr>
<tr><td><strong>WB</strong></td><td>Ghi trả</td><td>Kết quả của lệnh được ghi trả về tệp thanh ghi</td></tr>
</table>
<ul>
<li><strong>Chính cách đặt tên đã kể hết thiết kế.</strong> IF/IS là MỘT lần nạp chẻ đôi; DF/DS là MỘT lần truy cập cache dữ liệu chẻ đôi. R4000 không phát minh việc mới — nó <em>CHẺ ĐÔI</em> việc cũ để mỗi nửa đập nhịp nhanh gấp đôi. Đó đúng là định nghĩa superpipeline của slide 29.</li>
<li><strong>Vì sao (a) là "lý thuyết" còn (b) là "thật".</strong> Khung (a) chẻ mọi thứ một cách máy móc và ra mười tầng; con R4000 xuất xưởng gộp lại vài chỗ và dừng ở tám. Kỹ thuật bo tròn lý thuyết — đáng nhớ khi đề hỏi vì sao vi xử lý thật không khớp mô hình sạch đẹp.</li>
<li><strong>Cái giá, và vẫn là cái giá muôn thuở.</strong> Tám tầng thay vì năm thì quyết định rẽ nhánh biết được còn muộn hơn nữa, nên R4000 có hình phạt rẽ nhánh dài hơn và cần lấp nhiều khe trì hoãn hơn. Đây lại là Figure 17.6(d): pipeline sâu hơn cần nhiều NOOP hơn. Superpipeline mua tần số xung nhịp và trả bằng hình phạt hiểm hoạ.</li>
<li><strong>TC giờ là một tầng riêng hẳn hoi.</strong> So với Figure 17.10(c), nơi TC lần đầu xuất hiện như phần thừa của mẹo chạy song song TLB/cache. Ở đây nó là một tầng pipeline đầy đủ, nghĩa là dữ liệu của lệnh load <em>DÙNG ĐƯỢC</em> trước khi phép kiểm thẻ của nó xong — bộ xử lý ĐOÁN rằng cú trúng cache là hợp lệ, và huỷ lệnh nếu hoá ra không phải.</li>
</ul>
<p class="meo">💡 Đếm số chữ để nhận diện cỗ máy: <strong>năm tầng (IF RD ALU MEM WB) = R3000; tám tầng (IF IS RF EX DF DS TC WB) = R4000.</strong> Câu hỏi nào nhắc tới IS, DF hay DS là đang nói về R4000.</p>
<p class="pitfall">⚠️ Bẫy: đọc khung (b) thành "R4000 chạy hai lệnh cùng lúc". KHÔNG — nó không phải superscalar. Hai hàng đó là <em>CÙNG MỘT pipeline duy nhất</em> vẽ ở hai thời điểm khác nhau, lệch nhau một tầng. Mỗi nhịp tầng chỉ có đúng một lệnh đi vào.</p>`],
      [33, 'R4000 Pipeline Stages — all eight, spelled out',
        `<p class="y-chinh">🎯 The text version of Figure 17.11(b): each of the eight R4000 stages named and described. Three of the eight ("Register file", "Instruction execute", and the fetch pair) can do <strong>one of several alternatives</strong>, which is where all the flexibility of a uniform pipeline hides.</p>
<table>
<tr><th>Stage</th><th>The slide's description</th><th>Read it as</th></tr>
<tr><td><strong>Instruction fetch first half</strong></td><td>Virtual address is presented to the instruction cache and the translation lookaside buffer</td><td>Start the cache lookup and the address translation <em>at the same time</em> — the parallel trick of Figure 17.10(c)</td></tr>
<tr><td><strong>Instruction fetch second half</strong></td><td>Instruction cache outputs the instruction and the TLB generates the physical address</td><td>Both halves finish together; the tag comparison is deferred</td></tr>
<tr><td><strong>Register file</strong></td><td>One of three activities: instruction is decoded and check made for <em>interlock conditions</em>; instruction cache tag check is made; operands are fetched from the register file</td><td>Decode, verify the fetch was valid, and read operands — all in one stage because the format is fixed (slide 28)</td></tr>
<tr><td><strong>Tag check</strong></td><td>Cache tag checks are performed for loads and stores</td><td>The deferred verification finally lands, several stages after the data was already used</td></tr>
<tr><td><strong>Instruction execute</strong></td><td>One of three: ALU performs a register-to-register operation; a load/store's data virtual address is calculated; a branch's target virtual address is calculated and branch operations checked</td><td>The single ALU stage of Table 17.9, unchanged — RISC's uniformity paying off</td></tr>
<tr><td><strong>Data cache first</strong></td><td>Virtual address is presented to the data cache and TLB</td><td>Same parallel trick as IF, now on the data side</td></tr>
<tr><td><strong>Data cache second</strong></td><td>The TLB generates the physical address and the data cache outputs the data</td><td>Data is available here — note it arrives <em>before</em> the tag check confirms it</td></tr>
<tr><td><strong>Write back</strong></td><td>Instruction result is written back to register file</td><td>The only stage that changes architectural state</td></tr>
</table>
<ul>
<li><strong>"Check made for interlock conditions" is the delayed load of slide 23, in hardware.</strong> An interlock is the mechanism that <em>locks</em> the destination register of a load and stalls any instruction that reads it too early. The slide on optimization said "register to be target is locked by processor" — this is the stage where that lock is tested.</li>
<li><strong>Notice that the data arrives one stage before it is validated.</strong> "Data cache second" outputs the data; "Tag check" confirms the line was really the right one. The processor proceeds on the assumption of a hit and rolls back on a miss. That is speculation, and it is the seed of everything in Ch.18.</li>
<li><strong>Only one stage writes architectural state.</strong> Write back is the last stage, and until an instruction reaches it nothing it did is permanent. This is what makes precise interrupts possible, which is the point slide 19 made: "RISC processors are more responsive to interrupts because interrupts are checked between rather elementary operations."</li>
<li><strong>Count the memory-system stages: five of eight.</strong> IF, IS, DF, DS, TC all exist because memory is slow and virtual. Only RF, EX and WB are "computing". A modern processor is mostly a machine for moving data, and this list is the proof — Ch.4 and Ch.5 were not a detour.</li>
</ul>
<p class="meo">💡 Learn the eight as four pairs: <strong>fetch (IF, IS) · decode-and-execute (RF, EX) · data (DF, DS) · finish (TC, WB)</strong>. Two stages for each of the four things a processor does.</p>
<p class="pitfall">⚠️ Trap: the slide lists "Tag check" in the middle of its bullet list (right after "Register file"), which makes it look like the fourth stage. In the actual pipeline order of Figure 17.11(b) it is the <strong>seventh</strong>: IF, IS, RF, EX, DF, DS, <em>TC</em>, WB. Follow the figure, not the reading order of the bullets.</p>`,
        `<p class="y-chinh">🎯 Bản chữ của Figure 17.11(b): gọi tên và mô tả từng tầng trong tám tầng của R4000. Ba trong tám tầng ("Register file", "Instruction execute", và cặp nạp lệnh) có thể làm <strong>MỘT TRONG NHIỀU khả năng</strong>, và đó là chỗ giấu toàn bộ sự linh hoạt của một pipeline đều đặn.</p>
<table>
<tr><th>Tầng</th><th>Mô tả của slide</th><th>Hiểu là</th></tr>
<tr><td><strong>Nạp lệnh nửa đầu</strong></td><td>Đưa địa chỉ ảo tới cache lệnh và bộ đệm dịch địa chỉ (TLB)</td><td>Khởi động tra cache và dịch địa chỉ <em>CÙNG LÚC</em> — đúng mẹo song song của Figure 17.10(c)</td></tr>
<tr><td><strong>Nạp lệnh nửa sau</strong></td><td>Cache lệnh xuất ra lệnh và TLB sinh địa chỉ vật lý</td><td>Hai nửa xong cùng lúc; phép so thẻ bị HOÃN lại</td></tr>
<tr><td><strong>Tệp thanh ghi</strong></td><td>Một trong ba việc: giải mã lệnh và kiểm <em>điều kiện khoá liên động</em> (interlock); kiểm thẻ cache lệnh; lấy toán hạng từ tệp thanh ghi</td><td>Giải mã, xác nhận lần nạp là hợp lệ, và đọc toán hạng — gói trong một tầng ĐƯỢC vì khuôn dạng cố định (slide 28)</td></tr>
<tr><td><strong>Kiểm thẻ</strong></td><td>Thực hiện kiểm thẻ cache cho các lệnh load và store</td><td>Phép xác nhận bị hoãn giờ mới tới, vài tầng SAU khi dữ liệu đã được dùng</td></tr>
<tr><td><strong>Thực thi lệnh</strong></td><td>Một trong ba: ALU làm phép thanh ghi–thanh ghi; tính địa chỉ ảo dữ liệu của lệnh load/store; tính địa chỉ ảo đích của lệnh rẽ nhánh và kiểm các thao tác rẽ nhánh</td><td>Đúng tầng ALU duy nhất của Table 17.9, không đổi — tính ĐỀU của RISC sinh lời</td></tr>
<tr><td><strong>Cache dữ liệu nửa đầu</strong></td><td>Đưa địa chỉ ảo tới cache dữ liệu và TLB</td><td>Cùng mẹo song song như IF, giờ ở phía dữ liệu</td></tr>
<tr><td><strong>Cache dữ liệu nửa sau</strong></td><td>TLB sinh địa chỉ vật lý và cache dữ liệu xuất ra dữ liệu</td><td>Dữ liệu có ở đây — để ý nó tới <em>TRƯỚC</em> khi phép kiểm thẻ xác nhận</td></tr>
<tr><td><strong>Ghi trả</strong></td><td>Kết quả của lệnh được ghi trả về tệp thanh ghi</td><td>Tầng DUY NHẤT làm thay đổi trạng thái kiến trúc</td></tr>
</table>
<ul>
<li><strong>"Kiểm điều kiện khoá liên động" chính là delayed load của slide 23, phiên bản phần cứng.</strong> Interlock là cơ chế <em>KHOÁ</em> thanh ghi đích của một lệnh load và bắt khựng bất kỳ lệnh nào đọc nó quá sớm. Slide về tối ưu hoá đã viết "thanh ghi đích bị bộ xử lý khoá" — đây là tầng nơi cái khoá đó được kiểm.</li>
<li><strong>Để ý dữ liệu tới TRƯỚC khi nó được kiểm chứng.</strong> "Cache dữ liệu nửa sau" xuất ra dữ liệu; "Kiểm thẻ" mới xác nhận dòng cache đó có đúng là dòng cần hay không. Bộ xử lý cứ đi tiếp với giả định TRÚNG cache và quay lui nếu trượt. Đó là ĐOÁN TRƯỚC (speculation), và là hạt mầm của mọi thứ trong Ch.18.</li>
<li><strong>Chỉ MỘT tầng ghi trạng thái kiến trúc.</strong> Ghi trả là tầng cuối, và chừng nào một lệnh chưa tới đó thì mọi việc nó làm đều chưa vĩnh viễn. Chính điều này làm cho NGẮT CHÍNH XÁC khả thi, đúng ý slide 19: "vi xử lý RISC đáp ứng ngắt tốt hơn vì ngắt được kiểm giữa những thao tác khá sơ cấp".</li>
<li><strong>Đếm số tầng thuộc hệ thống nhớ: NĂM trên tám.</strong> IF, IS, DF, DS, TC tồn tại chỉ vì bộ nhớ vừa chậm vừa ảo. Chỉ RF, EX và WB là "tính toán". Vi xử lý hiện đại phần lớn là một cỗ máy CHUYỂN DỮ LIỆU, và danh sách này là bằng chứng — Ch.4 và Ch.5 không phải đường vòng.</li>
</ul>
<p class="meo">💡 Học tám tầng thành bốn cặp: <strong>nạp (IF, IS) · giải mã-thực thi (RF, EX) · dữ liệu (DF, DS) · kết thúc (TC, WB)</strong>. Mỗi việc trong bốn việc của bộ xử lý được hai tầng.</p>
<p class="pitfall">⚠️ Bẫy: slide liệt kê "Tag check" ở giữa danh sách gạch đầu dòng (ngay sau "Register file"), khiến nó trông như tầng thứ tư. Trong thứ tự pipeline THẬT của Figure 17.11(b) nó là tầng thứ <strong>BẢY</strong>: IF, IS, RF, EX, DF, DS, <em>TC</em>, WB. Theo HÌNH, đừng theo thứ tự đọc của các gạch đầu dòng.</p>`],

      [34, 'SPARC — Scalable Processor Architecture',
        `<p class="y-chinh">🎯 The second commercial RISC example, and a deliberately different one. Where MIPS chose 32 flat registers, <strong>SPARC</strong> chose <em>register windows</em> — the Berkeley answer to the same problem.</p>
<table>
<tr><th>The slide's bullet</th><th>What it means for the exam</th></tr>
<tr><td><strong>SPARC = Scalable Processor Architecture</strong></td><td>"Scalable" = the number of register windows is an implementation choice, not fixed by the architecture — see slide 36, where a particular chip has eight</td></tr>
<tr><td>Architecture defined by <strong>Sun Microsystems</strong></td><td>SPARC was a specification, not a chip — the same relationship ARM has with its licensees today</td></tr>
<tr><td>Sun <strong>licenses</strong> the architecture to other vendors to produce SPARC-compatible machines</td><td>An open-licensing business model in 1987; this is the direct ancestor of how ARM and RISC-V are sold now</td></tr>
<tr><td>Inspired by the <strong>Berkeley RISC 1</strong> machine, and its instruction set and register organization is based closely on the Berkeley RISC model</td><td>Berkeley (Patterson) → RISC I/II → SPARC. The rival line is Stanford (Hennessy) → MIPS. Two universities, two families</td></tr>
</table>
<ul>
<li><strong>Why "scalable" is a real technical word here.</strong> The SPARC <em>architecture</em> says there are register windows and how they overlap; it does not say how many there are. A cheap chip can implement 4, a big one 32. Software written for one runs on the other because the window count is read from a register, not hard-coded. Compare MIPS, where 32 registers is baked into the 5-bit fields of Figure 17.9.</li>
<li><strong>The licensing model is the most durable part.</strong> Sun designed the architecture and sold the right to build it. Every ARM chip in every phone today works the same way, and RISC-V takes it further by making the specification free. The business shape of the RISC industry was set here.</li>
<li><strong>Connect to slides 9–15 of the first half.</strong> The whole argument for a large register file — procedure calls are frequent (Table 17.2: CALL is 31–33% of weighted machine instructions), and most procedures have few arguments and few local scalars (Table 17.4: over 98% have fewer than 6 arguments) — is what register windows exploit. SPARC is that argument turned into silicon.</li>
<li><strong>The trade-off SPARC accepted.</strong> Register windows make procedure call and return nearly free, but they make <em>context switching</em> expensive (the OS must save a whole window set) and they complicate the compiler's view of the register file. MIPS accepted the opposite trade. Neither is wrong; ARM and RISC-V later chose the MIPS style, which tells you which trade-off aged better.</li>
</ul>
<p class="meo">💡 One sentence to separate the two families: <strong>MIPS makes the compiler allocate 32 registers; SPARC makes the hardware hand each procedure its own set.</strong> Slides 35 and 36 draw the second idea twice, from two angles.</p>
<p class="pitfall">⚠️ Trap: SPARC is a RISC, but the register window count is <em>not</em> one of the six RISC characteristics of slide 18. "A large number of registers" is; "register windows" is one particular way to get them. MIPS satisfies the characteristic with no windows at all.</p>`,
        `<p class="y-chinh">🎯 Ví dụ RISC thương mại thứ hai, và cố ý chọn một ví dụ KHÁC HẲN. Chỗ MIPS chọn 32 thanh ghi phẳng thì <strong>SPARC</strong> chọn <em>CỬA SỔ THANH GHI</em> — câu trả lời của phái Berkeley cho cùng bài toán.</p>
<table>
<tr><th>Gạch đầu dòng của slide</th><th>Nó nghĩa gì với bài thi</th></tr>
<tr><td><strong>SPARC = Scalable Processor Architecture</strong></td><td>"Scalable" = số cửa sổ thanh ghi là lựa chọn của bản CÀI ĐẶT, kiến trúc không chốt cứng — xem slide 36, nơi một con chip cụ thể có tám cửa sổ</td></tr>
<tr><td>Kiến trúc do <strong>Sun Microsystems</strong> định nghĩa</td><td>SPARC là một ĐẶC TẢ, không phải một con chip — đúng quan hệ mà ARM có với các hãng mua giấy phép ngày nay</td></tr>
<tr><td>Sun <strong>CẤP PHÉP</strong> kiến trúc cho hãng khác để sản xuất máy tương thích SPARC</td><td>Mô hình kinh doanh cấp phép mở từ năm 1987; đây là tổ tiên trực tiếp của cách ARM và RISC-V được bán bây giờ</td></tr>
<tr><td>Lấy cảm hứng từ máy <strong>Berkeley RISC 1</strong>, tập lệnh và tổ chức thanh ghi bám sát mô hình Berkeley RISC</td><td>Berkeley (Patterson) → RISC I/II → SPARC. Dòng đối thủ là Stanford (Hennessy) → MIPS. Hai trường đại học, hai dòng họ</td></tr>
</table>
<ul>
<li><strong>Vì sao "scalable" ở đây là một từ kỹ thuật thật.</strong> <em>KIẾN TRÚC</em> SPARC nói rằng có cửa sổ thanh ghi và chúng chồng lên nhau ra sao; nó KHÔNG nói có bao nhiêu cái. Chip rẻ cài 4, chip lớn cài 32. Phần mềm viết cho cái này chạy trên cái kia vì số cửa sổ được ĐỌC từ một thanh ghi chứ không viết cứng trong mã. So với MIPS, nơi con số 32 thanh ghi được nướng chặt vào các trường 5 bit của Figure 17.9.</li>
<li><strong>Mô hình cấp phép mới là phần bền nhất.</strong> Sun thiết kế kiến trúc và bán quyền chế tạo. Mọi con chip ARM trong mọi chiếc điện thoại hôm nay đều vận hành y hệt, và RISC-V đẩy xa thêm một bước bằng cách cho không đặc tả. Hình hài kinh doanh của cả ngành RISC được định ở đây.</li>
<li><strong>Nối về slide 9–15 của nửa đầu.</strong> Toàn bộ lập luận cho tệp thanh ghi lớn — lời gọi hàm rất nhiều (Table 17.2: CALL chiếm 31–33% số lệnh máy có trọng số), và đa số hàm có ít tham số, ít biến cục bộ vô hướng (Table 17.4: hơn 98% có dưới 6 tham số) — chính là thứ cửa sổ thanh ghi khai thác. SPARC là lập luận đó hoá thành silic.</li>
<li><strong>Cái đánh đổi SPARC chấp nhận.</strong> Cửa sổ thanh ghi làm cho gọi hàm và trả về gần như miễn phí, nhưng làm <em>CHUYỂN NGỮ CẢNH</em> đắt đỏ (hệ điều hành phải cất cả một bộ cửa sổ) và làm rối cái nhìn của trình biên dịch về tệp thanh ghi. MIPS chấp nhận đánh đổi ngược lại. Không bên nào sai; nhưng ARM và RISC-V về sau đều chọn kiểu MIPS, điều đó cho bạn biết đánh đổi nào già đi đẹp hơn.</li>
</ul>
<p class="meo">💡 Một câu để tách hai dòng họ: <strong>MIPS bắt trình biên dịch cấp phát 32 thanh ghi; SPARC bắt phần cứng phát cho mỗi hàm một bộ riêng.</strong> Slide 35 và 36 vẽ ý thứ hai hai lần, từ hai góc.</p>
<p class="pitfall">⚠️ Bẫy: SPARC là RISC, nhưng số cửa sổ thanh ghi <em>KHÔNG</em> nằm trong sáu đặc trưng RISC của slide 18. "Nhiều thanh ghi" thì có; "cửa sổ thanh ghi" chỉ là MỘT cách cụ thể để có nhiều thanh ghi. MIPS thoả đặc trưng đó mà chẳng có cửa sổ nào.</p>`],

      [35, 'Figure 17.12 — SPARC Register Window Layout with Three Procedures',
        `<p class="y-chinh">🎯 The mechanism, drawn twice in one picture: on the left a column of <strong>physical registers</strong> numbered 0–135, on the right the <strong>logical registers</strong> R0–R31 as seen by three procedures A, B and C. The trick is that the three logical views <em>overlap</em> on the same physical registers.</p>
<p class="nhan">📐 What every procedure sees — 32 logical registers in four groups of eight: <strong>R0–R7 Globals</strong> (shared by everyone) · <strong>R8–R15 Outs</strong> (arguments I pass out) · <strong>R16–R23 Locals</strong> (my own variables) · <strong>R24–R31 Ins</strong> (arguments passed in to me).</p>
<table>
<tr><th>Procedure</th><th>Ins (R24–R31)</th><th>Locals (R16–R23)</th><th>Outs (R8–R15)</th></tr>
<tr><td><strong>A</strong></td><td>physical 128–135</td><td>physical 120–127</td><td>physical 112–119</td></tr>
<tr><td><strong>B</strong></td><td>physical 112–119 <em>(= A's Outs)</em></td><td>physical 104–111</td><td>physical 96–103</td></tr>
<tr><td><strong>C</strong></td><td>physical 96–103 <em>(= B's Outs)</em></td><td>physical 88–95</td><td>physical 80–87</td></tr>
</table>
<ul>
<li><strong>The overlap is the whole idea.</strong> Look at physical registers 112–119: the slide labels that block <strong>"Outs/Ins"</strong>. They are procedure A's <em>Outs</em> and, at the same time, procedure B's <em>Ins</em>. A writes its arguments into R8–R15; B reads them out of R24–R31; no data moved, no memory was touched. Parameter passing became a renaming.</li>
<li><strong>Do the arithmetic and the saving is obvious.</strong> A call with six arguments on a conventional machine costs six stores by the caller plus six loads by the callee — twelve memory operations, each one a D stage in the pipeline. On SPARC it costs <strong>zero</strong>. Table 17.2 said CALL/RETURN accounts for 31–33% of weighted machine instructions; this is where that cost went.</li>
<li><strong>Each window is 24 registers, not 32.</strong> Eight Ins + eight Locals + eight Outs = 24, and the eight Globals sit outside the window (the slide draws them as a separate box at the bottom, labelled R0–R7 / physical 0–7, shared by A, B and C alike). Three procedures therefore need 24 + 8 + 8 = fewer physicals than 3 × 32 — the overlap is what pays.</li>
<li><strong>Globals are the escape hatch from slide 12.</strong> That slide argued that global variables cannot live in a window (every procedure would see a different one) and so need "a set of global registers fixed in number and available to all procedures". R0–R7 is exactly that set, and it is why the picture has a detached box at the bottom.</li>
<li><strong>Read the physical numbers downward.</strong> 135 at the top down to 80 at the bottom for these three procedures: each new call moves the window <em>down</em> by 16 physical registers (8 Locals + 8 Outs), not by 24 — because 8 of the 24 are inherited from the caller. That 16 is the step size of slide 36's circular stack.</li>
</ul>
<p class="meo">💡 Remember the four groups with a mail metaphor: <strong>Globals = the public noticeboard · Ins = my inbox · Locals = my desk · Outs = my outbox.</strong> And the key fact in one line: <strong>my outbox is literally the same drawer as my callee's inbox.</strong></p>
<p class="pitfall">⚠️ Exam trap: "SPARC has 32 registers". A SPARC <em>procedure</em> sees 32 logical registers; the chip has far more physical ones (the slide's column runs past 135). Confusing the logical view with the physical file is the standard mistake, and it makes the overlap impossible to explain.</p>`,
        `<p class="y-chinh">🎯 Cơ chế, vẽ hai lần trong cùng một bức tranh: bên trái là cột <strong>thanh ghi VẬT LÝ</strong> đánh số 0–135, bên phải là <strong>thanh ghi LOGIC</strong> R0–R31 theo cách ba hàm A, B và C nhìn thấy. Mẹo nằm ở chỗ ba cái nhìn logic ấy <em>CHỒNG LÊN NHAU</em> trên cùng những thanh ghi vật lý.</p>
<p class="nhan">📐 Mỗi hàm nhìn thấy gì — 32 thanh ghi logic chia bốn nhóm tám cái: <strong>R0–R7 Globals</strong> (dùng chung cho tất cả) · <strong>R8–R15 Outs</strong> (tham số tôi truyền RA) · <strong>R16–R23 Locals</strong> (biến của riêng tôi) · <strong>R24–R31 Ins</strong> (tham số truyền VÀO cho tôi).</p>
<table>
<tr><th>Hàm</th><th>Ins (R24–R31)</th><th>Locals (R16–R23)</th><th>Outs (R8–R15)</th></tr>
<tr><td><strong>A</strong></td><td>vật lý 128–135</td><td>vật lý 120–127</td><td>vật lý 112–119</td></tr>
<tr><td><strong>B</strong></td><td>vật lý 112–119 <em>(= Outs của A)</em></td><td>vật lý 104–111</td><td>vật lý 96–103</td></tr>
<tr><td><strong>C</strong></td><td>vật lý 96–103 <em>(= Outs của B)</em></td><td>vật lý 88–95</td><td>vật lý 80–87</td></tr>
</table>
<ul>
<li><strong>Sự CHỒNG LẤN chính là toàn bộ ý tưởng.</strong> Nhìn các thanh ghi vật lý 112–119: slide dán nhãn khối đó là <strong>"Outs/Ins"</strong>. Chúng vừa là <em>Outs</em> của hàm A vừa là <em>Ins</em> của hàm B, cùng một lúc. A ghi tham số vào R8–R15; B đọc chúng ra ở R24–R31; không dữ liệu nào bị chuyển, không lần nào chạm bộ nhớ. Truyền tham số biến thành một phép ĐỔI TÊN.</li>
<li><strong>Làm phép tính là thấy ngay cái lời.</strong> Một lời gọi sáu tham số trên máy thông thường tốn sáu lệnh store của bên gọi cộng sáu lệnh load của bên bị gọi — mười hai thao tác bộ nhớ, mỗi cái là một tầng D trong pipeline. Trên SPARC nó tốn <strong>KHÔNG</strong>. Table 17.2 nói CALL/RETURN chiếm 31–33% số lệnh máy có trọng số; đây là chỗ khoản chi phí đó biến mất.</li>
<li><strong>Mỗi cửa sổ là 24 thanh ghi, không phải 32.</strong> Tám Ins + tám Locals + tám Outs = 24, còn tám Globals nằm NGOÀI cửa sổ (slide vẽ chúng thành một hộp riêng ở dưới cùng, nhãn R0–R7 / vật lý 0–7, dùng chung cho cả A, B lẫn C). Vì thế ba hàm cần ÍT thanh ghi vật lý hơn 3 × 32 rất nhiều — chồng lấn là chỗ sinh lời.</li>
<li><strong>Globals là cửa thoát hiểm của slide 12.</strong> Slide đó lập luận rằng biến toàn cục không thể sống trong cửa sổ (mỗi hàm sẽ thấy một bản khác nhau) nên cần "một bộ thanh ghi toàn cục, số lượng cố định, mọi hàm đều dùng được". R0–R7 đúng là bộ đó, và vì thế bức tranh mới có một cái hộp rời ở dưới cùng.</li>
<li><strong>Đọc dãy số vật lý theo chiều đi XUỐNG.</strong> Từ 135 trên cùng xuống 80 dưới cùng cho ba hàm này: mỗi lời gọi mới dịch cửa sổ <em>XUỐNG</em> 16 thanh ghi vật lý (8 Locals + 8 Outs), không phải 24 — vì 8 trong 24 cái được THỪA KẾ từ hàm gọi. Con số 16 đó là bước nhảy của chồng vòng tròn ở slide 36.</li>
</ul>
<p class="meo">💡 Nhớ bốn nhóm bằng phép ví bưu điện: <strong>Globals = bảng tin công cộng · Ins = hộp thư đến của tôi · Locals = mặt bàn của tôi · Outs = hộp thư đi của tôi.</strong> Và sự thật cốt tử trong một dòng: <strong>hộp thư ĐI của tôi đúng là cùng một ngăn kéo với hộp thư ĐẾN của hàm tôi gọi.</strong></p>
<p class="pitfall">⚠️ Bẫy đề thi: "SPARC có 32 thanh ghi". Một <em>HÀM</em> trên SPARC nhìn thấy 32 thanh ghi LOGIC; con chip có nhiều thanh ghi VẬT LÝ hơn hẳn (cột trong slide chạy vượt quá 135). Lẫn cái nhìn logic với tệp vật lý là lỗi tiêu chuẩn, và nó làm cho sự chồng lấn thành không thể giải thích nổi.</p>`],

      [36, 'Figure 17.13 — Eight Register Windows Forming a Circular Stack in SPARC',
        `<p class="y-chinh">🎯 The same windows of slide 35, now bent into a <strong>ring</strong>. Eight windows w0…w7, each drawn as three arcs (ins, locals, outs), with two pointers: <strong>CWP</strong> (current window pointer) marking which window the running procedure owns, and <strong>WIM</strong> (window invalid mask) marking the one window that must not be entered.</p>
<ul>
<li><strong>Why a ring and not a stack.</strong> The register file is finite — eight windows here. Procedure nesting is not. So the windows wrap: after w7 comes w0 again. The ring is the honest picture of a fixed resource serving an unbounded demand, exactly like the circular buffer of Figure 17.2 back on slide 11.</li>
<li><strong>What CWP does.</strong> On a procedure <em>call</em>, hardware decrements CWP and the new procedure instantly owns the next window; on <em>return</em>, CWP increments back. That is the entire cost of a call in the common case: <strong>one pointer update</strong>. No saving, no restoring, no memory traffic.</li>
<li><strong>What WIM is for, and it is the real exam question.</strong> With eight windows you can nest eight calls. The ninth would wrap around and overwrite w0, which still belongs to a live procedure. WIM marks that boundary window as invalid; trying to enter it raises a <strong>window overflow trap</strong>, and the operating system's trap handler spills the oldest window to the memory stack and frees it. On the way back, an underflow trap reloads it.</li>
<li><strong>So register windows do not abolish saving to memory — they postpone it.</strong> Shallow call chains (the overwhelming majority, per the measurements on slides 5–7) never touch memory at all. Deep recursion pays the traps. That is a bet on program behaviour, and it is the same bet the whole memory hierarchy makes in Ch.4.</li>
<li><strong>Look at the overlap again on the ring.</strong> Each window's "outs" arc is drawn touching the next window's "ins" arc — the 112–119 sharing of slide 35, now visible eight times around the circle. Only "locals" belongs to exactly one window.</li>
</ul>
<p class="dap-an">✅ Worked question of the kind that appears on exams: <em>a SPARC implementation has 8 windows; a program calls 10 levels deep and then returns. How many window overflow traps?</em> Windows available for nesting are 8 minus the one reserved by WIM = <strong>7</strong> usable levels before a trap. Calls 1–7 are free; call 8 triggers the first overflow trap; calls 9 and 10 trigger two more — <strong>3 overflow traps on the way down, and 3 underflow traps on the way back</strong>. Note the exam trap inside the exam trap: it is <em>N−1</em> usable windows, not N, because WIM must always keep one marked invalid to detect the wrap.</p>
<p class="meo">💡 Two pointers, two jobs: <strong>CWP = "where am I", WIM = "where I must not go".</strong> If a question mentions a trap, it is about WIM; if it mentions a call or return, it is about CWP.</p>
<p class="pitfall">⚠️ Trap: "eight windows means eight procedures can run at once". No — one procedure runs at a time. Eight windows means up to seven nested calls can be <em>outstanding</em> without spilling to memory.</p>`,
        `<p class="y-chinh">🎯 Vẫn những cửa sổ của slide 35, giờ uốn thành một <strong>VÒNG TRÒN</strong>. Tám cửa sổ w0…w7, mỗi cái vẽ thành ba cung (ins, locals, outs), với hai con trỏ: <strong>CWP</strong> (con trỏ cửa sổ hiện hành) chỉ cửa sổ mà hàm đang chạy sở hữu, và <strong>WIM</strong> (mặt nạ cửa sổ không hợp lệ) đánh dấu đúng một cửa sổ KHÔNG được bước vào.</p>
<ul>
<li><strong>Vì sao là VÒNG chứ không phải chồng thẳng.</strong> Tệp thanh ghi là HỮU HẠN — ở đây tám cửa sổ. Còn độ lồng nhau của lời gọi hàm thì không. Nên cửa sổ phải quấn vòng: sau w7 lại tới w0. Vòng tròn là bức tranh thành thật của một tài nguyên cố định phục vụ một nhu cầu vô hạn, y hệt bộ đệm vòng của Figure 17.2 ở slide 11.</li>
<li><strong>CWP làm gì.</strong> Khi <em>GỌI</em> hàm, phần cứng giảm CWP và hàm mới lập tức sở hữu cửa sổ kế tiếp; khi <em>TRẢ VỀ</em>, CWP tăng ngược lại. Đó là toàn bộ chi phí của một lời gọi trong trường hợp thông thường: <strong>MỘT lần cập nhật con trỏ</strong>. Không cất, không nạp lại, không đụng bộ nhớ.</li>
<li><strong>WIM để làm gì, và đây mới là câu hỏi thi thật.</strong> Tám cửa sổ thì lồng được tám lời gọi. Lời gọi thứ chín sẽ quấn vòng và ghi đè lên w0, mà w0 vẫn thuộc về một hàm còn sống. WIM đánh dấu cửa sổ biên đó là KHÔNG HỢP LỆ; cố bước vào nó sẽ sinh <strong>bẫy tràn cửa sổ</strong> (window overflow trap), và bộ xử lý bẫy của hệ điều hành đổ cửa sổ cũ nhất xuống ngăn xếp bộ nhớ rồi giải phóng nó. Lúc quay về, một bẫy cạn (underflow) nạp nó trở lại.</li>
<li><strong>Vậy cửa sổ thanh ghi KHÔNG xoá bỏ việc cất xuống bộ nhớ — nó HOÃN việc đó lại.</strong> Chuỗi gọi nông (tuyệt đại đa số, theo đúng số đo ở slide 5–7) thì không bao giờ chạm bộ nhớ. Đệ quy sâu thì trả bằng bẫy. Đó là một canh bạc đặt vào HÀNH VI CHƯƠNG TRÌNH, đúng canh bạc mà cả phân cấp bộ nhớ của Ch.4 đặt cược.</li>
<li><strong>Nhìn lại sự chồng lấn trên vòng tròn.</strong> Cung "outs" của mỗi cửa sổ được vẽ CHẠM vào cung "ins" của cửa sổ kế — chính là chuyện dùng chung 112–119 của slide 35, giờ hiện ra tám lần quanh vòng. Chỉ "locals" là thuộc về đúng một cửa sổ.</li>
</ul>
<p class="dap-an">✅ Câu hỏi giải mẫu đúng kiểu hay ra đề: <em>một bản cài SPARC có 8 cửa sổ; chương trình gọi lồng sâu 10 mức rồi trả về. Có bao nhiêu bẫy tràn cửa sổ?</em> Số cửa sổ dùng được để lồng là 8 trừ đi cái mà WIM giữ chỗ = <strong>7</strong> mức trước khi sinh bẫy. Lời gọi 1–7 miễn phí; lời gọi thứ 8 kích bẫy tràn đầu tiên; lời gọi 9 và 10 kích thêm hai cái nữa — <strong>3 bẫy tràn lúc đi xuống, và 3 bẫy cạn lúc quay về</strong>. Để ý cái bẫy nằm TRONG câu bẫy: dùng được <em>N−1</em> cửa sổ chứ không phải N, vì WIM luôn phải giữ một cái đánh dấu không hợp lệ để phát hiện lúc quấn vòng.</p>
<p class="meo">💡 Hai con trỏ, hai nhiệm vụ: <strong>CWP = "tôi đang ở đâu", WIM = "chỗ tôi không được tới".</strong> Câu hỏi nhắc tới bẫy là hỏi về WIM; nhắc tới gọi hàm hay trả về là hỏi về CWP.</p>
<p class="pitfall">⚠️ Bẫy: "tám cửa sổ nghĩa là tám hàm chạy cùng lúc". KHÔNG — mỗi lúc chỉ một hàm chạy. Tám cửa sổ nghĩa là tối đa bảy lời gọi lồng nhau còn <em>ĐANG DỞ</em> mà chưa phải đổ xuống bộ nhớ.</p>`],

      [37, 'Table 17.10 — Synthesizing Other Addressing Modes with SPARC Addressing Modes',
        `<p class="y-chinh">🎯 The "simple addressing modes" characteristic, proved. SPARC offers essentially <strong>one</strong> addressing form — a register plus S2, where S2 is either a register or a 13-bit immediate — and this table shows how five classic addressing modes are <em>synthesized</em> out of it.</p>
<table>
<tr><th>Instruction type</th><th>Addressing mode</th><th>Algorithm</th><th>SPARC equivalent</th></tr>
<tr><td>Register-to-register</td><td>Immediate</td><td>operand = A</td><td>S2</td></tr>
<tr><td>Load, store</td><td>Direct</td><td>EA = A</td><td>R0 + S2</td></tr>
<tr><td>Register-to-register</td><td>Register</td><td>EA = R</td><td>RS1, SS2</td></tr>
<tr><td>Load, store</td><td>Register Indirect</td><td>EA = (R)</td><td>RS1 + 0</td></tr>
<tr><td>Load, store</td><td>Displacement</td><td>EA = (R) + A</td><td>RS1 + S2</td></tr>
</table>
<p class="nhan">📐 The slide's own note: <strong>S2 = either a register operand or a 13-bit immediate operand.</strong> EA means effective address, the same notation as Ch.14.</p>
<ul>
<li><strong>The two rows that carry the whole argument are "Direct" and "Register Indirect".</strong> Direct addressing (EA = A, a plain absolute address) is synthesized as <strong>R0 + S2</strong> — because SPARC hardwires R0 to the constant <strong>zero</strong>, adding it changes nothing, and the immediate becomes the address. Register indirect (EA = (R)) is <strong>RS1 + 0</strong> — the same trick in the other direction, adding a zero immediate. Two "modes" that cost no hardware at all.</li>
<li><strong>The hardwired zero register is the cheapest design trick in computer architecture.</strong> It turns one addressing mode into three, turns <code>MOV rA, rB</code> into <code>ADD rA, rB, R0</code>, and turns "compare with zero" into an ordinary subtract. MIPS does the same thing with its R0, and RISC-V kept it. One register sacrificed, a whole column of the instruction set saved.</li>
<li><strong>Read this against Table 17.1 on slide 2.</strong> VAX-11/780: <strong>22</strong> addressing modes. Intel 80486: <strong>11</strong>. SPARC: <strong>1</strong>. MIPS R4000: <strong>1</strong>. The table you are reading now explains how a machine with one mode still compiles the same C programs — the modes were never removed, they were moved into the compiler.</li>
<li><strong>Why this matters for the pipeline, which is the chapter's thread.</strong> Every addressing mode a CISC supports is a different amount of work in the address-calculation stage, and the worst one sets the stage length for all instructions. With one mode, the EX stage of slide 33 does exactly one addition, every time. That is what makes stages equal-length, which is what makes pipelining pay.</li>
<li><strong>Connect to Ch.14 and to PRF192.</strong> Ch.14 catalogued immediate, direct, indirect, register, register-indirect, displacement, stack. This table says a RISC keeps the last one and rebuilds the rest. And the reason that is acceptable is that <em>the compiler</em>, not the programmer, chooses addressing modes — a human writing <code>a[i]</code> in C never sees which mode was used.</li>
</ul>
<p class="meo">💡 Remember the single rule: <strong>SPARC's only addressing mode is "register + S2", and R0 is always zero.</strong> Put a zero on either side of the plus sign and you get direct or register-indirect for free. Every row of this table is that one sentence.</p>
<p class="pitfall">⚠️ Trap: the third row's SPARC equivalent is written "RS1, SS2" and its algorithm "EA = R" — for a register-to-register operation there is no effective <em>address</em> at all; the operands are simply the two register fields. Do not try to compute an address for that row.</p>`,
        `<p class="y-chinh">🎯 Đặc trưng "ít chế độ địa chỉ, đơn giản", đem ra chứng minh. SPARC về cơ bản chỉ có <strong>MỘT</strong> dạng địa chỉ — một thanh ghi cộng S2, trong đó S2 hoặc là một thanh ghi hoặc là hằng tức thời 13 bit — và bảng này cho thấy năm chế độ địa chỉ kinh điển được <em>TỔNG HỢP</em> ra từ đó thế nào.</p>
<table>
<tr><th>Loại lệnh</th><th>Chế độ địa chỉ</th><th>Thuật toán</th><th>Tương đương trên SPARC</th></tr>
<tr><td>Thanh ghi–thanh ghi</td><td>Tức thời (Immediate)</td><td>toán hạng = A</td><td>S2</td></tr>
<tr><td>Load, store</td><td>Trực tiếp (Direct)</td><td>EA = A</td><td>R0 + S2</td></tr>
<tr><td>Thanh ghi–thanh ghi</td><td>Thanh ghi (Register)</td><td>EA = R</td><td>RS1, SS2</td></tr>
<tr><td>Load, store</td><td>Gián tiếp qua thanh ghi</td><td>EA = (R)</td><td>RS1 + 0</td></tr>
<tr><td>Load, store</td><td>Độ dời (Displacement)</td><td>EA = (R) + A</td><td>RS1 + S2</td></tr>
</table>
<p class="nhan">📐 Ghi chú của chính slide: <strong>S2 = hoặc một toán hạng thanh ghi, hoặc một toán hạng tức thời 13 bit.</strong> EA nghĩa là địa chỉ hiệu dụng, đúng ký hiệu của Ch.14.</p>
<ul>
<li><strong>Hai dòng gánh cả lập luận là "Trực tiếp" và "Gián tiếp qua thanh ghi".</strong> Địa chỉ trực tiếp (EA = A, một địa chỉ tuyệt đối trần) được tổng hợp thành <strong>R0 + S2</strong> — vì SPARC nối cứng R0 bằng hằng số <strong>KHÔNG</strong>, cộng nó vào chẳng đổi gì, và cái hằng tức thời trở thành địa chỉ. Gián tiếp qua thanh ghi (EA = (R)) là <strong>RS1 + 0</strong> — vẫn mẹo đó theo chiều ngược lại, cộng thêm hằng 0. Hai "chế độ" mà tốn ĐÚNG KHÔNG transistor nào.</li>
<li><strong>Thanh ghi zero nối cứng là mẹo thiết kế rẻ nhất trong kiến trúc máy tính.</strong> Nó biến một chế độ địa chỉ thành ba, biến <code>MOV rA, rB</code> thành <code>ADD rA, rB, R0</code>, và biến "so sánh với không" thành một phép trừ thông thường. MIPS làm y hệt với R0 của nó, và RISC-V giữ nguyên. Hy sinh một thanh ghi, tiết kiệm được cả một cột của tập lệnh.</li>
<li><strong>Đọc bảng này đối chiếu Table 17.1 ở slide 2.</strong> VAX-11/780: <strong>22</strong> chế độ địa chỉ. Intel 80486: <strong>11</strong>. SPARC: <strong>1</strong>. MIPS R4000: <strong>1</strong>. Chính cái bảng bạn đang đọc giải thích vì sao một cỗ máy chỉ có một chế độ vẫn biên dịch được đúng những chương trình C ấy — các chế độ chưa bao giờ bị XOÁ, chúng chỉ bị DỜI vào trình biên dịch.</li>
<li><strong>Vì sao điều này quan trọng với pipeline — sợi chỉ của cả chương.</strong> Mỗi chế độ địa chỉ mà một CISC hỗ trợ là một khối lượng công việc khác nhau ở tầng tính địa chỉ, và cái nặng nhất quyết định độ dài tầng cho MỌI lệnh. Với một chế độ duy nhất, tầng EX của slide 33 làm đúng một phép cộng, lần nào cũng vậy. Đó chính là thứ làm cho các tầng dài bằng nhau, tức thứ làm cho pipeline sinh lời.</li>
<li><strong>Nối sang Ch.14 và PRF192.</strong> Ch.14 liệt kê tức thời, trực tiếp, gián tiếp, thanh ghi, gián tiếp qua thanh ghi, độ dời, ngăn xếp. Bảng này nói rằng RISC giữ lại CÁI CUỐI và dựng lại phần còn lại. Và lý do chuyện đó chấp nhận được là vì <em>TRÌNH BIÊN DỊCH</em> mới là bên chọn chế độ địa chỉ, không phải lập trình viên — một người viết <code>a[i]</code> trong C chẳng bao giờ thấy chế độ nào đã được dùng.</li>
</ul>
<p class="meo">💡 Nhớ đúng một quy tắc: <strong>chế độ địa chỉ duy nhất của SPARC là "thanh ghi + S2", và R0 luôn bằng 0.</strong> Đặt số 0 vào một trong hai vế của dấu cộng là bạn có trực tiếp hoặc gián tiếp qua thanh ghi, miễn phí. Mọi dòng của bảng này đều là một câu đó.</p>
<p class="pitfall">⚠️ Bẫy: dòng thứ ba ghi tương đương SPARC là "RS1, SS2" và thuật toán là "EA = R" — với phép thanh ghi–thanh ghi thì làm gì có ĐỊA CHỈ hiệu dụng nào; toán hạng đơn giản là hai trường thanh ghi. Đừng cố tính địa chỉ cho dòng đó.</p>`],

      [38, 'Figure 17.14 — SPARC Instruction Formats',
        `<p class="y-chinh">🎯 SPARC's formats, and the point of the picture is the leftmost column: <strong>every format starts with a 2-bit Op field and every format is exactly 32 bits long</strong>. Compare with Figure 17.9 (MIPS) and you see two different designers reaching the same conclusion.</p>
<table>
<tr><th>Format</th><th>Fields (bits)</th><th>Total</th></tr>
<tr><td><strong>Call</strong></td><td>Op 2 · PC-relative displacement 30</td><td>32</td></tr>
<tr><td><strong>Branch</strong></td><td>Op 2 · a 1 · Cond 4 · Op2 3 · PC-relative displacement 22</td><td>32</td></tr>
<tr><td><strong>SETHI</strong></td><td>Op 2 · Dest 5 · Op2 3 · Immediate constant 22</td><td>32</td></tr>
<tr><td><strong>Floating-Point</strong></td><td>Op 2 · Dest 5 · Op3 6 · Src-1 5 · FP-op 9 · Src-2 5</td><td>32</td></tr>
<tr><td><strong>General (register form)</strong></td><td>Op 2 · Dest 5 · Op3 6 · Src-1 5 · <strong>0</strong> 1 · ignored 8 · Src-2 5</td><td>32</td></tr>
<tr><td><strong>General (immediate form)</strong></td><td>Op 2 · Dest 5 · Op3 6 · Src-1 5 · <strong>1</strong> 1 · Immediate constant 13</td><td>32</td></tr>
</table>
<ul>
<li><strong>The single most important bit on this slide is the one marked 0/1 in the General format.</strong> It selects whether Src-2 is a register (the bit is 0, and the next 8 bits are simply <em>ignored</em>) or a 13-bit immediate (the bit is 1). That one bit <em>is</em> the "S2 = either a register operand or a 13-bit immediate operand" of Table 17.10. Two rows of the addressing-mode table, one bit of hardware.</li>
<li><strong>Register fields are 5 bits here too.</strong> Dest, Src-1, Src-2 — each 5 bits, because a SPARC procedure sees 32 logical registers (slide 35). MIPS reached the same number independently. Five bits per register operand is close to a law of RISC design.</li>
<li><strong>SETHI exists because 32 bits cannot hold a 32-bit constant plus an opcode.</strong> SETHI ("set high") loads a 22-bit immediate into the top of a register; a following instruction ORs in the low 10 bits. Loading a full 32-bit constant therefore takes <strong>two</strong> instructions. That is the price of fixed-length encoding, and it is honest to state it: RISC code is larger, exactly as Table 17.6 (slide 17) measured.</li>
<li><strong>The "a" bit in the Branch format is the delay slot, in the encoding.</strong> It is the <em>annul</em> bit: it tells the hardware whether to cancel the delay-slot instruction when the branch is not taken. Slides 23–25 described delayed branches as a software convention; here it is a bit in the instruction word. When the compiler cannot find a safe instruction for both paths, it uses annulling instead of a NOP.</li>
<li><strong>Two Op bits, not six.</strong> SPARC spends only 2 bits on the primary opcode and pushes the real work into Op2 (3 bits) and Op3 (6 bits) depending on the format. MIPS spends 6 up front. Both give the decoder a fixed place to look on cycle one — which is the requirement; the exact split is taste.</li>
</ul>
<p class="meo">💡 Compare the two RISC format pictures in one line: <strong>MIPS has 3 formats and a 6-bit opcode; SPARC has 5 formats and a 2-bit opcode; both are 32 bits and both put register fields at 5 bits.</strong> The agreement is the lesson, not the differences.</p>
<p class="pitfall">⚠️ Trap: counting the General format's "ignored" 8 bits as wasted. They are wasted — and deliberately so. A fixed-length format guarantees that a field is always in the same place, which is worth far more to the decoder than the eight bits are worth to the code density. This is the fixed-length trade-off in its purest form.</p>`,
        `<p class="y-chinh">🎯 Các khuôn dạng của SPARC, và điểm mấu chốt của bức hình nằm ở cột ngoài cùng bên trái: <strong>mọi khuôn dạng đều mở đầu bằng trường Op 2 bit và mọi khuôn dạng đều dài đúng 32 bit</strong>. So với Figure 17.9 (MIPS) là thấy hai nhóm thiết kế khác nhau đi tới cùng một kết luận.</p>
<table>
<tr><th>Khuôn dạng</th><th>Các trường (bit)</th><th>Tổng</th></tr>
<tr><td><strong>Call</strong></td><td>Op 2 · độ dời tương đối PC 30</td><td>32</td></tr>
<tr><td><strong>Branch</strong></td><td>Op 2 · a 1 · Cond 4 · Op2 3 · độ dời tương đối PC 22</td><td>32</td></tr>
<tr><td><strong>SETHI</strong></td><td>Op 2 · Dest 5 · Op2 3 · hằng tức thời 22</td><td>32</td></tr>
<tr><td><strong>Floating-Point</strong></td><td>Op 2 · Dest 5 · Op3 6 · Src-1 5 · FP-op 9 · Src-2 5</td><td>32</td></tr>
<tr><td><strong>General (dạng thanh ghi)</strong></td><td>Op 2 · Dest 5 · Op3 6 · Src-1 5 · <strong>0</strong> 1 · bỏ qua 8 · Src-2 5</td><td>32</td></tr>
<tr><td><strong>General (dạng tức thời)</strong></td><td>Op 2 · Dest 5 · Op3 6 · Src-1 5 · <strong>1</strong> 1 · hằng tức thời 13</td><td>32</td></tr>
</table>
<ul>
<li><strong>Cái bit quan trọng nhất trên slide này là bit đánh dấu 0/1 trong khuôn dạng General.</strong> Nó chọn xem Src-2 là một thanh ghi (bit bằng 0, và 8 bit kế tiếp đơn giản bị <em>BỎ QUA</em>) hay một hằng tức thời 13 bit (bit bằng 1). Đúng một bit đó <em>CHÍNH LÀ</em> câu "S2 = hoặc một toán hạng thanh ghi, hoặc một toán hạng tức thời 13 bit" của Table 17.10. Hai dòng của bảng chế độ địa chỉ, một bit phần cứng.</li>
<li><strong>Trường thanh ghi ở đây cũng 5 bit.</strong> Dest, Src-1, Src-2 — mỗi cái 5 bit, vì một hàm trên SPARC nhìn thấy 32 thanh ghi logic (slide 35). MIPS đi tới cùng con số đó một cách độc lập. Năm bit cho mỗi toán hạng thanh ghi gần như là một định luật của thiết kế RISC.</li>
<li><strong>SETHI tồn tại vì 32 bit không thể chứa nổi một hằng 32 bit cộng thêm mã lệnh.</strong> SETHI ("set high") nạp một hằng 22 bit vào phần cao của thanh ghi; một lệnh tiếp theo OR nốt 10 bit thấp. Vậy nạp một hằng 32 bit đầy đủ tốn <strong>HAI</strong> lệnh. Đó là cái giá của mã hoá độ dài cố định, và nói thẳng ra mới là thành thật: mã RISC LỚN hơn, đúng như Table 17.6 (slide 17) đã đo.</li>
<li><strong>Bit "a" trong khuôn dạng Branch chính là khe trì hoãn, ở dạng mã hoá.</strong> Nó là bit <em>ANNUL</em> (huỷ bỏ): nó bảo phần cứng có huỷ lệnh trong khe trì hoãn hay không khi rẽ nhánh KHÔNG được lấy. Slide 23–25 mô tả rẽ nhánh trì hoãn như một quy ước phần mềm; ở đây nó là một BIT trong từ lệnh. Khi trình biên dịch không tìm ra lệnh nào an toàn cho cả hai nhánh, nó dùng annul thay cho NOP.</li>
<li><strong>Hai bit Op, không phải sáu.</strong> SPARC chỉ tiêu 2 bit cho mã lệnh chính rồi đẩy việc thật sang Op2 (3 bit) và Op3 (6 bit) tuỳ khuôn dạng. MIPS tiêu 6 bit ngay từ đầu. Cả hai đều cho bộ giải mã một chỗ CỐ ĐỊNH để nhìn ngay từ chu kỳ một — đó mới là yêu cầu; cách chia cụ thể chỉ là gu.</li>
</ul>
<p class="meo">💡 So hai bức hình khuôn dạng RISC trong một dòng: <strong>MIPS có 3 khuôn dạng và mã lệnh 6 bit; SPARC có 5 khuôn dạng và mã lệnh 2 bit; cả hai đều 32 bit và cả hai đều để trường thanh ghi 5 bit.</strong> Chỗ GIỐNG NHAU mới là bài học, không phải chỗ khác nhau.</p>
<p class="pitfall">⚠️ Bẫy: coi 8 bit "bỏ qua" của khuôn dạng General là lãng phí. Đúng là lãng phí — và CỐ Ý. Khuôn dạng độ dài cố định bảo đảm một trường luôn nằm đúng một chỗ, và điều đó đáng giá với bộ giải mã hơn nhiều so với giá trị của tám bit kia đối với mật độ mã. Đây là sự đánh đổi của độ dài cố định ở dạng thuần khiết nhất.</p>`],

      [39, 'Figure 17.15 — Pipeline Organization with Buffers and Pre-Decoding',
        `<p class="y-chinh">🎯 The chapter's last movement: what a <em>real</em> RISC processor organisation looks like once you add the buffers that keep the pipeline fed. This is the "before" picture; slide 41 is the "after".</p>
<p class="nhan">📐 The data path drawn on the slide, bottom-left to top-right: <strong>L2 Cache → Pre-Dec → I-cache → IF → I-buffer → ID → Reservation station</strong>, then out to four functional units — <strong>MUL</strong> (a three-box multiply pipeline), <strong>ALU</strong>, <strong>CTU</strong>, <strong>LSU</strong> — and on to <strong>WB → Register File</strong>. On the memory side, <strong>LSU ↔ Store buffer ↔ D-cache ↔ L2 Cache</strong>. The four green labels mark the four moments of an instruction's life: <strong>Issue</strong> (ID → reservation station), <strong>Dispatch</strong> (reservation station → functional unit), <strong>Finish</strong> (functional unit → WB), <strong>Complete</strong> (WB → register file, and store buffer → D-cache).</p>
<table>
<tr><th>Abbreviation</th><th>Meaning (slide's legend)</th></tr>
<tr><td>ALU</td><td>arithmetic/logic unit</td></tr>
<tr><td>CTU</td><td>control/transfer unit</td></tr>
<tr><td>LSU</td><td>load/store unit</td></tr>
<tr><td>MUL</td><td>multiply unit</td></tr>
<tr><td>ID / IF</td><td>instruction decode / instruction fetch</td></tr>
<tr><td>OF / WB</td><td>operand fetch / write back</td></tr>
</table>
<ul>
<li><strong>Three buffers, three different stalls avoided.</strong> The <strong>I-buffer</strong> holds fetched instructions so the front end can keep fetching while the back end is busy. The <strong>reservation station</strong> holds decoded instructions waiting for an operand or a unit. The <strong>store buffer</strong> holds writes so a STORE does not have to wait for the cache. Each buffer decouples two stages that would otherwise have to move in lockstep.</li>
<li><strong>Pre-decoding happens on the way into the cache, not out of it.</strong> Notice <strong>Pre-Dec</strong> sits between L2 and the I-cache: instructions are partly decoded <em>once</em> as they are filled into the instruction cache, and the extra bits are stored with them. Every subsequent fetch of that line then skips work. This is a cache-fill-time cost paid to make a hot loop cheaper — pure Ch.4 locality thinking applied to decoding.</li>
<li><strong>Four functional units means the machine is already superscalar.</strong> ALU, CTU, LSU and MUL can be busy at once, so more than one instruction is executing per cycle. Note MUL is drawn as three boxes — a multiply is itself pipelined because it takes several cycles. This is the topic of Ch.18, previewed.</li>
<li><strong>Dedicating a unit to control transfers (CTU) is a RISC move.</strong> Branches get their own hardware so resolving them does not compete with arithmetic for the ALU — which shortens the branch penalty that slides 23–25 spent so much effort filling with delay slots.</li>
<li><strong>What is missing here, and slide 41 adds.</strong> There is exactly <em>one</em> reservation station shared by all four units, no forwarding path, and no reorder buffer. Each of those three absences is a stall waiting to happen, and slide 40 names all three.</li>
</ul>
<p class="meo">💡 Learn the four green words in order — <strong>Issue → Dispatch → Finish → Complete</strong> — because exam questions about out-of-order execution turn entirely on the difference between <em>finish</em> (the result exists) and <em>complete</em> (the result is allowed to become official).</p>
<p class="pitfall">⚠️ Trap: reading "Reservation station" as a queue that preserves order. It is not a queue — it is a pool. An instruction leaves it as soon as its operands and its unit are ready, which may be out of program order. That is exactly why slide 40 needs a reorder buffer to put things back in order at the end.</p>`,
        `<p class="y-chinh">🎯 Đoạn cuối của chương: một tổ chức bộ xử lý RISC <em>THẬT</em> trông ra sao khi đã gắn thêm các bộ đệm giữ cho pipeline luôn có ăn. Đây là bức "TRƯỚC"; slide 41 là bức "SAU".</p>
<p class="nhan">📐 Đường dữ liệu vẽ trên slide, từ dưới-trái lên trên-phải: <strong>L2 Cache → Pre-Dec → I-cache → IF → I-buffer → ID → Trạm giữ chỗ (reservation station)</strong>, rồi toả ra bốn khối chức năng — <strong>MUL</strong> (một pipeline nhân ba hộp), <strong>ALU</strong>, <strong>CTU</strong>, <strong>LSU</strong> — và đi tiếp tới <strong>WB → Tệp thanh ghi</strong>. Phía bộ nhớ: <strong>LSU ↔ Bộ đệm ghi (store buffer) ↔ D-cache ↔ L2 Cache</strong>. Bốn nhãn màu xanh đánh dấu bốn thời khắc trong đời một lệnh: <strong>Issue</strong> (phát: ID → trạm giữ chỗ), <strong>Dispatch</strong> (điều phối: trạm giữ chỗ → khối chức năng), <strong>Finish</strong> (xong việc: khối chức năng → WB), <strong>Complete</strong> (hoàn tất: WB → tệp thanh ghi, và store buffer → D-cache).</p>
<table>
<tr><th>Viết tắt</th><th>Nghĩa (chú giải của slide)</th></tr>
<tr><td>ALU</td><td>khối số học/logic</td></tr>
<tr><td>CTU</td><td>khối điều khiển/chuyển điều khiển</td></tr>
<tr><td>LSU</td><td>khối load/store</td></tr>
<tr><td>MUL</td><td>khối nhân</td></tr>
<tr><td>ID / IF</td><td>giải mã lệnh / nạp lệnh</td></tr>
<tr><td>OF / WB</td><td>lấy toán hạng / ghi trả</td></tr>
</table>
<ul>
<li><strong>Ba bộ đệm, ba kiểu khựng được né.</strong> <strong>I-buffer</strong> giữ các lệnh đã nạp để phần đầu vào cứ nạp tiếp trong lúc phần sau đang bận. <strong>Trạm giữ chỗ</strong> giữ các lệnh đã giải mã đang chờ toán hạng hoặc chờ khối chức năng. <strong>Store buffer</strong> giữ các lần ghi để một lệnh STORE khỏi phải chờ cache. Mỗi bộ đệm TÁCH RỜI hai tầng mà nếu không thì phải bước đều cùng nhịp với nhau.</li>
<li><strong>Tiền giải mã xảy ra trên đường ĐI VÀO cache, không phải đi ra.</strong> Để ý <strong>Pre-Dec</strong> nằm giữa L2 và I-cache: lệnh được giải mã một phần <em>MỘT LẦN</em> lúc được nạp vào cache lệnh, và các bit phụ được cất kèm. Mọi lần nạp sau đó của dòng cache ấy đều bỏ qua phần việc này. Đây là chi phí trả lúc nạp cache để làm một vòng lặp nóng rẻ đi — đúng tư duy cục bộ của Ch.4 áp dụng vào việc giải mã.</li>
<li><strong>Bốn khối chức năng nghĩa là cỗ máy này ĐÃ là superscalar.</strong> ALU, CTU, LSU và MUL bận cùng lúc được, nên mỗi chu kỳ có hơn một lệnh đang thực thi. Chú ý MUL vẽ thành ba hộp — bản thân phép nhân cũng được pipeline hoá vì nó tốn vài chu kỳ. Đây là chủ đề của Ch.18, xem trước.</li>
<li><strong>Dành hẳn một khối cho chuyển điều khiển (CTU) là một nước đi RISC.</strong> Lệnh rẽ nhánh có phần cứng riêng nên việc giải quyết chúng không tranh ALU với phép số học — điều đó rút ngắn đúng cái hình phạt rẽ nhánh mà slide 23–25 đã tốn bao công lấp bằng khe trì hoãn.</li>
<li><strong>Cái gì còn THIẾU ở đây, và slide 41 sẽ thêm vào.</strong> Chỉ có ĐÚNG MỘT trạm giữ chỗ dùng chung cho cả bốn khối, không có đường forwarding, và không có reorder buffer. Mỗi thiếu sót trong ba cái đó là một lần khựng đang chờ xảy ra, và slide 40 gọi tên cả ba.</li>
</ul>
<p class="meo">💡 Học bốn chữ xanh theo đúng thứ tự — <strong>Issue → Dispatch → Finish → Complete</strong> — vì mọi câu hỏi thi về thực thi không theo thứ tự đều xoay quanh khác biệt giữa <em>finish</em> (kết quả đã tồn tại) và <em>complete</em> (kết quả được phép trở thành chính thức).</p>
<p class="pitfall">⚠️ Bẫy: đọc "Reservation station" thành một HÀNG ĐỢI giữ đúng thứ tự. Không — nó là một CÁI BỂ. Một lệnh rời khỏi đó ngay khi toán hạng và khối chức năng của nó sẵn sàng, mà điều đó có thể xảy ra KHÔNG theo thứ tự chương trình. Chính vì thế slide 40 mới cần một reorder buffer để xếp lại thứ tự ở cuối.</p>`],

      [40, 'Processor Organization for Pipelining — reservation stations, forwarding, reorder buffer',
        `<p class="y-chinh">🎯 The three features that turn the organisation of slide 39 into the one on slide 41. The slide names them straight away: <strong>multiple reservation stations · forwarding · reorder buffer</strong>. Each one attacks a different way the pipeline loses cycles.</p>
<ul>
<li><strong>Issue versus dispatch — the slide insists on the distinction.</strong> "The process of dispatching an instruction to a functional unit proceeds in two parts: <strong>issue</strong> from ID to reservation station, and <strong>dispatch</strong> from reservation station to FU." Issue is in program order; dispatch is whenever the operands arrive. Splitting one action into two is what buys the flexibility.</li>
<li><strong>The reservation station is "also referred to as an <em>instruction window</em>".</strong> Worth memorising, because the second name is the one used in Ch.18 and in every article about modern CPUs. A bigger window = more instructions the processor can look across to find something independent to run.</li>
<li><strong>Forwarding, in the slide's words.</strong> "Data forwarding addresses the problem of <strong>read-after-write (RAW)</strong> delays due to WB delays. As with the store buffer, data forwarding makes data available <em>as soon as it is created</em>. The forwarded data becomes input to the reservation stations, going to an operand field."</li>
<li><strong>Forwarding is the hardware answer to the very problem slide 25 solved in software.</strong> Remember row 101 of Figure 17.7(a): <code>ADD 1, rA</code> had to wait because rA was still in flight. Forwarding routes the value straight from where it is produced into the waiting instruction's operand field, without going through the register file first. The bubble disappears with no reordering at all. Two chapters of the same story: <em>the compiler schedules around the hazard; the hardware removes it.</em></li>
<li><strong>The reorder buffer, and why it exists.</strong> "The reorder buffer supports <strong>out-of-order execution (OoOE)</strong>… an approach that allows instructions to begin execution as soon as their operands are ready. The goal of OoO processing is to allow the processor to avoid a class of stalls that occur when the data needed to perform an operation are unavailable."</li>
<li><strong>Out of order execution, in order completion.</strong> Instructions may <em>finish</em> in any order, but the reorder buffer holds their results and lets them <em>complete</em> — become architecturally visible — strictly in program order. That is what preserves precise interrupts and correct debugging, and it is the reason the Finish/Complete distinction of slide 39 matters.</li>
</ul>
<table>
<tr><th>Feature</th><th>Problem it removes</th><th>Cost</th></tr>
<tr><td>Multiple reservation stations</td><td>One busy functional unit blocking every other instruction</td><td>More buffers and more dispatch logic per unit</td></tr>
<tr><td>Forwarding</td><td>RAW stalls — waiting for a value to pass through write-back</td><td>A network of bypass paths; every extra path is wiring and delay</td></tr>
<tr><td>Reorder buffer</td><td>A single stalled instruction blocking all the ready ones behind it</td><td>Results must be held and retired in order; big area, big complexity</td></tr>
</table>
<p class="meo">💡 One mnemonic for the three: <strong>reservation stations = "wait somewhere useful", forwarding = "don't wait at all", reorder buffer = "go ahead, I'll fix the order later".</strong></p>
<p class="pitfall">⚠️ Exam trap: out-of-order execution does <em>not</em> mean out-of-order results. Programs must behave exactly as if executed in order — that is the entire purpose of the reorder buffer. Any answer saying "OoOE lets instructions complete in any order" is wrong; they <em>finish</em> in any order and <em>complete</em> in program order.</p>
<p class="pitfall">⚠️ Second trap, a conceptual one worth noticing: these three features are pure <em>hardware complexity</em> — the very thing early RISC set out to avoid. A modern "RISC" processor has a far more complex control unit than the CISCs of 1980. What survived from RISC is the <strong>instruction set</strong>, not the simplicity of the implementation.</p>`,
        `<p class="y-chinh">🎯 Ba tính năng biến tổ chức của slide 39 thành tổ chức của slide 41. Slide gọi tên thẳng: <strong>nhiều trạm giữ chỗ · forwarding (chuyển tiếp dữ liệu) · reorder buffer (bộ đệm sắp lại thứ tự)</strong>. Mỗi cái đánh vào một kiểu mất chu kỳ khác nhau của pipeline.</p>
<ul>
<li><strong>Issue so với dispatch — slide nhấn mạnh sự phân biệt này.</strong> "Quá trình điều phối một lệnh tới khối chức năng gồm hai phần: <strong>issue</strong> (phát) từ ID vào trạm giữ chỗ, và <strong>dispatch</strong> (điều phối) từ trạm giữ chỗ tới khối chức năng." Phát thì theo đúng thứ tự chương trình; điều phối thì tuỳ lúc toán hạng tới. Chẻ một hành động thành hai chính là thứ mua được sự linh hoạt.</li>
<li><strong>Trạm giữ chỗ "còn được gọi là <em>cửa sổ lệnh</em> (instruction window)".</strong> Đáng thuộc lòng, vì cái tên thứ hai mới là tên dùng trong Ch.18 và trong mọi bài báo về CPU hiện đại. Cửa sổ lớn hơn = bộ xử lý ngó qua được nhiều lệnh hơn để tìm ra thứ độc lập mà chạy.</li>
<li><strong>Forwarding, nguyên văn slide.</strong> "Chuyển tiếp dữ liệu xử lý vấn đề trễ <strong>đọc-sau-ghi (RAW)</strong> do độ trễ của tầng WB. Cũng như store buffer, chuyển tiếp dữ liệu làm cho dữ liệu dùng được <em>NGAY KHI NÓ VỪA ĐƯỢC TẠO RA</em>. Dữ liệu đã chuyển tiếp trở thành đầu vào của các trạm giữ chỗ, đi thẳng vào một trường toán hạng."</li>
<li><strong>Forwarding chính là lời giải PHẦN CỨNG cho đúng bài toán mà slide 25 giải bằng PHẦN MỀM.</strong> Nhớ hàng 101 của Figure 17.7(a): <code>ADD 1, rA</code> phải chờ vì rA còn đang bay. Forwarding dẫn giá trị đi thẳng từ nơi nó được sinh ra vào trường toán hạng của lệnh đang chờ, không qua tệp thanh ghi trước. Cái bọt biến mất mà chẳng phải đổi thứ tự gì cả. Hai chương cùng một câu chuyện: <em>trình biên dịch lập lịch để NÉ hiểm hoạ; phần cứng thì XOÁ nó.</em></li>
<li><strong>Reorder buffer, và vì sao nó tồn tại.</strong> "Reorder buffer hỗ trợ <strong>thực thi không theo thứ tự (OoOE)</strong>… một cách xử lý cho phép lệnh bắt đầu thực thi ngay khi toán hạng của nó sẵn sàng. Mục tiêu của xử lý OoO là cho bộ xử lý né được một lớp các lần khựng xảy ra khi dữ liệu cần cho một phép toán chưa có."</li>
<li><strong>Thực thi KHÔNG theo thứ tự, hoàn tất THEO thứ tự.</strong> Các lệnh có thể <em>XONG VIỆC</em> theo thứ tự bất kỳ, nhưng reorder buffer giữ kết quả của chúng lại và chỉ cho chúng <em>HOÀN TẤT</em> — trở nên hiện hữu về mặt kiến trúc — đúng theo thứ tự chương trình. Đó là thứ bảo toàn ngắt chính xác và việc gỡ lỗi đúng đắn, và là lý do phân biệt Finish/Complete ở slide 39 mới quan trọng.</li>
</ul>
<table>
<tr><th>Tính năng</th><th>Nó xoá bỏ vấn đề gì</th><th>Cái giá</th></tr>
<tr><td>Nhiều trạm giữ chỗ</td><td>Một khối chức năng đang bận chặn đứng mọi lệnh khác</td><td>Thêm bộ đệm và thêm logic điều phối cho mỗi khối</td></tr>
<tr><td>Forwarding</td><td>Khựng vì RAW — chờ một giá trị đi qua tầng ghi trả</td><td>Cả một mạng đường vòng; mỗi đường thêm là thêm dây và thêm trễ</td></tr>
<tr><td>Reorder buffer</td><td>Một lệnh bị kẹt chặn đứng mọi lệnh đã sẵn sàng đứng sau nó</td><td>Kết quả phải được giữ lại và rút lui theo thứ tự; tốn diện tích, tốn độ phức tạp</td></tr>
</table>
<p class="meo">💡 Một câu thần chú cho cả ba: <strong>trạm giữ chỗ = "chờ ở chỗ nào có ích", forwarding = "khỏi chờ luôn", reorder buffer = "cứ đi đi, thứ tự để tôi sửa sau".</strong></p>
<p class="pitfall">⚠️ Bẫy đề thi: thực thi không theo thứ tự <em>KHÔNG</em> có nghĩa là kết quả không theo thứ tự. Chương trình phải hành xử ĐÚNG y như thể đã chạy tuần tự — đó là toàn bộ mục đích của reorder buffer. Câu trả lời nào nói "OoOE cho phép lệnh hoàn tất theo thứ tự bất kỳ" là SAI; chúng <em>xong việc</em> theo thứ tự bất kỳ và <em>hoàn tất</em> theo thứ tự chương trình.</p>
<p class="pitfall">⚠️ Bẫy thứ hai, mang tính khái niệm và đáng để ý: ba tính năng này là ĐỘ PHỨC TẠP PHẦN CỨNG thuần tuý — đúng thứ mà RISC thời đầu đặt mục tiêu tránh. Một vi xử lý "RISC" hiện đại có khối điều khiển phức tạp hơn hẳn các CISC của năm 1980. Cái sống sót từ RISC là <strong>TẬP LỆNH</strong>, không phải sự đơn giản của bản cài đặt.</p>`],

      [41, 'Figure 17.16 — Pipeline Organization with Forwarding, Reorder Buffer, and Multiple Reservation Stations',
        `<p class="y-chinh">🎯 The same processor as slide 39 with the three additions of slide 40 wired in. Put the two pictures side by side and three things have changed — that is the whole exercise.</p>
<table>
<tr><th>Slide 39 (Figure 17.15)</th><th>Slide 41 (Figure 17.16)</th><th>Which slide-40 feature</th></tr>
<tr><td><strong>One</strong> reservation station feeding all four units</td><td><strong>Four</strong> reservation stations, one in front of each of MUL, ALU, CTU, LSU</td><td>Multiple reservation stations</td></tr>
<tr><td>No bypass path; a result reaches the next instruction only via the register file</td><td>A <strong>FWD</strong> box feeding results back into every reservation station</td><td>Forwarding</td></tr>
<tr><td>Results go Finish → WB → Register File</td><td>Results go Finish → <strong>Reorder buffer</strong> → WB → Register File</td><td>Reorder buffer</td></tr>
<tr><td>Pre-Dec</td><td><strong>PD</strong> (same pre-decode block, abbreviated)</td><td>unchanged</td></tr>
</table>
<ul>
<li><strong>Why one reservation station per unit and not one big shared pool.</strong> With a single pool, an instruction that cannot dispatch (its multiply unit is busy) sits at the head and blocks instructions behind it that could have gone to the ALU. Splitting the pool means each unit's queue stalls independently. This is exactly the "head-of-line blocking" problem, and the fix is the same one used in network switches.</li>
<li><strong>Follow the FWD arrow carefully, it is the important wire.</strong> It leaves the <em>Finish</em> point — the moment a functional unit produces a result — and goes back into the operand fields of all four reservation stations. So a waiting instruction gets its operand the cycle the value exists, rather than two or three stages later when write-back is done. That collapses the RAW penalty to zero in the common case.</li>
<li><strong>The reorder buffer sits between Finish and WB, and that position is the whole design.</strong> Everything before it is out-of-order and speculative; everything after it is in-order and permanent. Draw a vertical line through the reorder buffer and you have divided the processor into "what it guessed" and "what it committed to".</li>
<li><strong>Notice what did <em>not</em> change: the front end.</strong> L2 → PD → I-cache → IF → I-buffer → ID is identical in both figures. All the sophistication is in the middle and the back. That is because the front end's job — fetch a fixed-length instruction and decode it in one go — was already made trivial by the RISC instruction set. The chapter's thread holds right to the last figure.</li>
<li><strong>This is the bridge to Ch.18.</strong> Reservation stations, forwarding networks, reorder buffers and out-of-order issue are the content of "Instruction-Level Parallelism and Superscalar Processors". Chapter 17 ends by drawing the machine that Chapter 18 explains.</li>
</ul>
<p class="meo">💡 Study tip: do not memorise this diagram. Memorise the <strong>three differences</strong> from Figure 17.15 — four stations instead of one, an FWD path, a reorder buffer — and you can redraw it from the earlier figure.</p>
<p class="pitfall">⚠️ Trap: thinking the reorder buffer <em>reorders</em> instructions. It does not reorder anything; it holds results and releases them in the order the instructions were issued. The reordering was done earlier, by the reservation stations dispatching whatever was ready.</p>`,
        `<p class="y-chinh">🎯 Vẫn bộ xử lý của slide 39, nay đã đấu nối thêm ba thứ của slide 40. Đặt hai bức hình cạnh nhau thì có BA chỗ đổi — và đó là toàn bộ bài tập.</p>
<table>
<tr><th>Slide 39 (Figure 17.15)</th><th>Slide 41 (Figure 17.16)</th><th>Là tính năng nào của slide 40</th></tr>
<tr><td><strong>MỘT</strong> trạm giữ chỗ nuôi cả bốn khối</td><td><strong>BỐN</strong> trạm giữ chỗ, mỗi cái đứng trước một trong MUL, ALU, CTU, LSU</td><td>Nhiều trạm giữ chỗ</td></tr>
<tr><td>Không có đường vòng; kết quả tới được lệnh sau chỉ qua ngả tệp thanh ghi</td><td>Một hộp <strong>FWD</strong> bơm kết quả ngược về MỌI trạm giữ chỗ</td><td>Forwarding</td></tr>
<tr><td>Kết quả đi Finish → WB → Tệp thanh ghi</td><td>Kết quả đi Finish → <strong>Reorder buffer</strong> → WB → Tệp thanh ghi</td><td>Reorder buffer</td></tr>
<tr><td>Pre-Dec</td><td><strong>PD</strong> (vẫn khối tiền giải mã đó, viết tắt)</td><td>không đổi</td></tr>
</table>
<ul>
<li><strong>Vì sao mỗi khối một trạm giữ chỗ chứ không phải một bể chung to.</strong> Với một bể duy nhất, một lệnh không điều phối được (khối nhân của nó đang bận) sẽ nằm chình ình ở đầu và CHẶN những lệnh phía sau vốn có thể đi tới ALU. Chẻ cái bể ra nghĩa là hàng đợi của mỗi khối kẹt độc lập với nhau. Đây đúng là bài toán "chặn đầu hàng" (head-of-line blocking), và cách chữa cũng chính là cách dùng trong bộ chuyển mạch mạng.</li>
<li><strong>Bám kỹ mũi tên FWD, đó là sợi dây quan trọng.</strong> Nó rời khỏi điểm <em>Finish</em> — thời khắc một khối chức năng sinh ra kết quả — và chạy ngược về các trường toán hạng của cả bốn trạm giữ chỗ. Nhờ đó một lệnh đang chờ nhận được toán hạng ngay chu kỳ mà giá trị vừa tồn tại, thay vì hai ba tầng sau khi tầng ghi trả xong. Điều đó nén hình phạt RAW về không trong trường hợp thông thường.</li>
<li><strong>Reorder buffer nằm GIỮA Finish và WB, và chính vị trí đó là cả thiết kế.</strong> Mọi thứ TRƯỚC nó là không theo thứ tự và mang tính đoán trước; mọi thứ SAU nó là theo thứ tự và vĩnh viễn. Kẻ một đường thẳng đứng xuyên qua reorder buffer là bạn đã chia bộ xử lý thành "những gì nó ĐOÁN" và "những gì nó ĐÃ CAM KẾT".</li>
<li><strong>Để ý cái KHÔNG đổi: phần đầu vào.</strong> L2 → PD → I-cache → IF → I-buffer → ID giống hệt nhau ở cả hai hình. Toàn bộ sự tinh vi nằm ở khúc giữa và khúc cuối. Lý do là công việc của phần đầu vào — nạp một lệnh độ dài cố định và giải mã nó trong một nhát — đã được chính TẬP LỆNH RISC làm cho tầm thường từ trước. Sợi chỉ của cả chương giữ nguyên tới bức hình cuối cùng.</li>
<li><strong>Đây là cây cầu sang Ch.18.</strong> Trạm giữ chỗ, mạng forwarding, reorder buffer và phát lệnh không theo thứ tự chính là nội dung của "Song song mức lệnh & bộ xử lý superscalar". Chương 17 kết thúc bằng cách VẼ RA cỗ máy mà Chương 18 sẽ GIẢI THÍCH.</li>
</ul>
<p class="meo">💡 Mẹo ôn: đừng học thuộc sơ đồ này. Hãy thuộc <strong>BA điểm khác</strong> so với Figure 17.15 — bốn trạm thay vì một, một đường FWD, một reorder buffer — là bạn vẽ lại được nó từ hình trước.</p>
<p class="pitfall">⚠️ Bẫy: tưởng reorder buffer đi <em>SẮP XẾP LẠI</em> các lệnh. Nó không sắp xếp lại gì cả; nó GIỮ các kết quả và nhả chúng ra theo đúng thứ tự mà các lệnh đã được phát. Việc đảo thứ tự đã xảy ra từ trước, do các trạm giữ chỗ điều phối bất cứ thứ gì đã sẵn sàng.</p>`],

      [42, 'Summary — Chapter 17, Reduced Instruction Set Computers (RISC)',
        `<p class="y-chinh">🎯 The chapter's own table of contents, in two columns. Use it as a revision checklist: if you cannot say two sentences about each bullet, that is the bullet to go back to.</p>
<table>
<tr><th>Left column</th><th>Right column</th></tr>
<tr><td><strong>Instruction execution characteristics</strong> — Operations · Operands · Procedure calls · Implications</td><td><strong>RISC pipelining</strong> — Pipelining with regular instructions · Optimization of pipelining</td></tr>
<tr><td><strong>The use of a large register file</strong> — Register windows · Global variables · Large register file versus cache</td><td><strong>MIPS R4000</strong> — Instruction set · Instruction pipeline</td></tr>
<tr><td><strong>Reduced instruction set architecture</strong> — Characteristics of RISC · CISC versus RISC characteristics</td><td><strong>SPARC</strong> — SPARC register set · Instruction set · Instruction format</td></tr>
<tr><td></td><td><strong>Processor Organization for Pipelining</strong> · <strong>CISC, RISC, and contemporary systems</strong></td></tr>
</table>
<p class="nhan">📐 <strong>The RISC versus CISC debate — both sides fairly, as the chapter presents them.</strong></p>
<table>
<tr><th>The case for CISC (slide 16)</th><th>The case for RISC (slides 18–19)</th></tr>
<tr><td>A desire to <strong>simplify compilers</strong> — a complex instruction can match a high-level-language statement directly</td><td>Compilers mostly generate <em>simple</em> instructions anyway; the complex ones sit unused</td></tr>
<tr><td>A desire to <strong>improve performance</strong> via smaller programs: fewer instruction bytes to fetch, fewer page faults, more instructions fit in cache</td><td>Table 17.6 (slide 17) measured it: RISC I code is only <strong>1,0 vs 0,8–1,2</strong> relative size — the CISC advantage is far smaller than claimed</td></tr>
<tr><td>Microcode lets one instruction do a lot of work</td><td>A hardwired control unit for simple instructions can run them faster, and interrupts can be taken between elementary operations</td></tr>
<tr><td>Fewer instructions per program</td><td>More effective optimizing compilers; pipelining applies "much more effectively with a reduced instruction set"</td></tr>
</table>
<p class="nhan">📐 <strong>How it actually ended — this part is beyond the slides, marked as such.</strong> The slide's last bullet, "CISC, RISC, and contemporary systems", is only a title; here is what it refers to:</p>
<ul>
<li><strong>Nobody won; the ideas merged.</strong> Every x86 processor since the Pentium Pro (1995) is <strong>CISC on the outside, RISC on the inside</strong>: the front end decodes variable-length x86 instructions into fixed-size internal <em>micro-operations</em>, and everything behind that decoder is the machine of Figure 17.16 — reservation stations, forwarding, a reorder buffer. The RISC pipeline won; the x86 instruction set survived for compatibility.</li>
<li><strong>Meanwhile the pure RISC lines took the volume.</strong> ARM dominates phones and tablets, RISC-V is the open-specification successor to the SPARC licensing model of slide 34, and both have moved into servers. <strong>Apple Silicon (M1, 2020, and the M-series since) is the concrete example</strong>: a general-purpose desktop and laptop line, running an arm64 fixed-length 4-byte instruction set — the very thing measured on slide 28 — that replaced x86 in its own product range on performance and efficiency, not on price.</li>
<li><strong>What the debate settled into, in one sentence.</strong> The instruction set matters much less than it seemed in 1985, because the decoder can translate anything into a uniform internal form; but a <em>uniform</em> instruction set makes that decoder cheap, and cheap decoding is worth real power and area. That is why new architectures are all RISC-like and old ones survive by translation.</li>
<li><strong>The one claim from the 1980s that did not survive.</strong> "RISC means a simple processor." Figure 17.16 already refutes it, and a modern ARM core has a control unit far more complicated than a VAX ever did. Simplicity moved from the <em>chip</em> to the <em>instruction set</em>, and stayed there.</li>
</ul>
<p class="dap-an">✅ Self-check before the exam — if you can do these six, this half of the chapter is done. (1) Draw the three pipeline tables of Figure 17.7 and give their cycle counts (<strong>8, 8, 6</strong>). (2) Rewrite a code fragment for a delayed branch, both with a NOOP and optimized. (3) Show a delayed-load stall and remove it by reordering (<strong>9 → 7</strong> in this lesson's example). (4) List the six RISC characteristics and say what each does for the pipeline. (5) Explain SPARC register windows including CWP and WIM, and count overflow traps. (6) State both sides of the RISC/CISC argument and what modern processors actually do.</p>
<p class="pitfall">⚠️ Note on Table 17.1 (slides 2–3), since the summary sends you back to it: the superscalar half of that table leaves "Number of instructions" <strong>blank</strong> for UltraSPARC and MIPS R10000 (only PowerPC's 225 is given). That is a gap in the original slide, not a value of zero — do not quote a number for those two.</p>
<p class="meo">💡 If you remember one sentence from the whole chapter, make it this: <strong>RISC is not about having fewer instructions — it is about having instructions regular enough that a pipeline never has to stop.</strong> Every table, every figure and every measurement in these 42 slides is evidence for that one claim.</p>`,
        `<p class="y-chinh">🎯 Mục lục của chính chương, chia hai cột. Dùng nó làm bảng kiểm ôn tập: chỗ nào bạn không nói nổi hai câu về một gạch đầu dòng thì đó là chỗ phải quay lại.</p>
<table>
<tr><th>Cột trái</th><th>Cột phải</th></tr>
<tr><td><strong>Đặc điểm thực thi lệnh</strong> — Phép toán · Toán hạng · Lời gọi hàm · Hệ quả</td><td><strong>Pipeline RISC</strong> — Pipeline với lệnh đều đặn · Tối ưu hoá pipeline</td></tr>
<tr><td><strong>Dùng tệp thanh ghi lớn</strong> — Cửa sổ thanh ghi · Biến toàn cục · Tệp thanh ghi lớn so với cache</td><td><strong>MIPS R4000</strong> — Tập lệnh · Pipeline lệnh</td></tr>
<tr><td><strong>Kiến trúc tập lệnh rút gọn</strong> — Đặc trưng của RISC · Đặc trưng CISC so với RISC</td><td><strong>SPARC</strong> — Bộ thanh ghi SPARC · Tập lệnh · Khuôn dạng lệnh</td></tr>
<tr><td></td><td><strong>Tổ chức bộ xử lý cho pipeline</strong> · <strong>CISC, RISC và hệ thống đương đại</strong></td></tr>
</table>
<p class="nhan">📐 <strong>Cuộc tranh luận RISC với CISC — trình bày công bằng cả hai phía, đúng như chương đưa ra.</strong></p>
<table>
<tr><th>Lý lẽ bên CISC (slide 16)</th><th>Lý lẽ bên RISC (slide 18–19)</th></tr>
<tr><td>Mong muốn <strong>làm trình biên dịch đơn giản đi</strong> — một lệnh phức tạp có thể khớp thẳng với một câu lệnh của ngôn ngữ bậc cao</td><td>Trình biên dịch dù sao cũng chủ yếu sinh ra lệnh <em>ĐƠN GIẢN</em>; đám lệnh phức tạp nằm không</td></tr>
<tr><td>Mong muốn <strong>cải thiện hiệu năng</strong> nhờ chương trình nhỏ hơn: ít byte lệnh phải nạp hơn, ít lỗi trang hơn, nhiều lệnh lọt vào cache hơn</td><td>Table 17.6 (slide 17) đã ĐO: kích thước mã RISC I là <strong>1,0 so với 0,8–1,2</strong> — lợi thế của CISC nhỏ hơn nhiều so với lời tuyên bố</td></tr>
<tr><td>Vi mã cho phép một lệnh làm được rất nhiều việc</td><td>Khối điều khiển mạch cứng dành cho lệnh đơn giản chạy chúng nhanh hơn, và ngắt có thể nhận GIỮA các thao tác sơ cấp</td></tr>
<tr><td>Ít lệnh hơn cho mỗi chương trình</td><td>Trình biên dịch tối ưu hiệu quả hơn; pipeline áp dụng "hiệu quả hơn nhiều với một tập lệnh rút gọn"</td></tr>
</table>
<p class="nhan">📐 <strong>Thực tế nó kết thúc ra sao — phần này NGOÀI slide, ghi rõ như vậy.</strong> Gạch đầu dòng cuối của slide, "CISC, RISC và hệ thống đương đại", chỉ là một cái tiêu đề; đây là thứ nó ám chỉ:</p>
<ul>
<li><strong>Không ai thắng; hai ý tưởng HOÀ VÀO NHAU.</strong> Mọi vi xử lý x86 từ Pentium Pro (1995) tới nay đều <strong>CISC ở BÊN NGOÀI, RISC ở BÊN TRONG</strong>: phần đầu vào giải mã các lệnh x86 độ dài thay đổi thành những <em>VI THAO TÁC</em> (micro-operation) cỡ cố định, và mọi thứ phía sau bộ giải mã đó chính là cỗ máy của Figure 17.16 — trạm giữ chỗ, forwarding, reorder buffer. Pipeline RISC đã THẮNG; tập lệnh x86 sống sót vì lý do tương thích.</li>
<li><strong>Trong khi đó các dòng RISC thuần chiếm lấy sản lượng.</strong> ARM thống trị điện thoại và máy tính bảng, RISC-V là kẻ kế tục đặc tả mở của chính mô hình cấp phép SPARC ở slide 34, và cả hai đều đã tiến vào máy chủ. <strong>Apple Silicon (M1, 2020, và dòng M từ đó) là ví dụ cụ thể</strong>: một dòng máy để bàn và laptop đa dụng, chạy tập lệnh arm64 độ dài cố định 4 byte — đúng thứ đã ĐO ở slide 28 — và đã thay thế x86 ngay trong dòng sản phẩm của chính hãng, thắng bằng hiệu năng và hiệu suất điện chứ không phải bằng giá.</li>
<li><strong>Cuộc tranh luận lắng lại thành một câu.</strong> Tập lệnh quan trọng ÍT hơn nhiều so với cảm giác hồi 1985, vì bộ giải mã có thể dịch bất cứ thứ gì sang một dạng nội bộ đồng đều; NHƯNG một tập lệnh <em>ĐỒNG ĐỀU</em> làm cho bộ giải mã đó rẻ đi, và giải mã rẻ đáng giá bằng điện năng và diện tích chip thật. Vì thế mọi kiến trúc mới đều mang dáng RISC, còn kiến trúc cũ sống sót nhờ phiên dịch.</li>
<li><strong>Lời tuyên bố duy nhất của thập niên 1980 KHÔNG sống sót.</strong> "RISC nghĩa là bộ xử lý đơn giản." Figure 17.16 đã bác bỏ điều đó ngay trong chương, và một lõi ARM hiện đại có khối điều khiển phức tạp hơn hẳn VAX ngày xưa. Sự đơn giản đã DI CƯ từ <em>CON CHIP</em> sang <em>TẬP LỆNH</em>, và ở lại đó.</li>
</ul>
<p class="dap-an">✅ Tự kiểm trước khi thi — làm được sáu việc này là xong nửa chương. (1) Vẽ ba bảng pipeline của Figure 17.7 và nêu số chu kỳ (<strong>8, 8, 6</strong>). (2) Viết lại một đoạn mã cho rẽ nhánh trì hoãn, cả bản chèn NOOP lẫn bản tối ưu. (3) Chỉ ra một lần khựng vì delayed load rồi xoá nó bằng cách đổi thứ tự (<strong>9 → 7</strong> trong ví dụ của bài này). (4) Liệt kê sáu đặc trưng RISC và nói mỗi cái làm gì cho pipeline. (5) Giải thích cửa sổ thanh ghi SPARC kể cả CWP và WIM, và đếm số bẫy tràn. (6) Nêu cả hai phía của cuộc tranh luận RISC/CISC và thực tế vi xử lý hiện đại làm gì.</p>
<p class="pitfall">⚠️ Ghi chú về Table 17.1 (slide 2–3), vì phần tổng kết đẩy bạn quay lại đó: nửa superscalar của bảng ấy BỎ TRỐNG ô "Number of instructions" cho UltraSPARC và MIPS R10000 (chỉ có PowerPC ghi 225). Đó là một chỗ THIẾU của slide gốc, không phải giá trị bằng không — đừng trích một con số nào cho hai máy đó.</p>
<p class="meo">💡 Nếu chỉ nhớ được một câu từ cả chương thì hãy nhớ câu này: <strong>RISC không phải là chuyện có ÍT lệnh hơn — nó là chuyện có những lệnh ĐỀU tới mức pipeline không bao giờ phải dừng.</strong> Mọi cái bảng, mọi bức hình và mọi phép đo trong 42 slide này đều là bằng chứng cho đúng một khẳng định đó.</p>`],
    ]),
  ].join('\n'),
};
