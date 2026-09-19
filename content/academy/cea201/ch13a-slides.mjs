/**
 * CEA201 · Chương 13 trên web (deck 'cea17' = Ch.17 bản 11e) — Reduced
 * Instruction Set Computers, học theo từng slide, phần slide 1–21/42.
 *
 * ⚠️ ĐÁNH SỐ: syllabus của trường theo bản 9th ed và gọi phần này là
 * "Chapter 15: Reduced Instruction Set Computers". Bản 11th ed đánh là
 * Chapter 17. Trên web môn này đánh là "Chương 13 — RISC", nên file tên ch13a.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH17-COA11e.pptx (/tmp/cea201-text/cea17.txt).
 * Slide chỉ có tiêu đề + hình/SmartArt (4, 10, 11, 14, 15, 18) đã được ĐỌC
 * THẲNG TỪ ẢNH render để lấy đúng từng nhãn — riêng slide 4 bản trích chữ CHỈ
 * lấy được tiêu đề, toàn bộ 5 khối SmartArt (HLLs · Semantic gap · Operations
 * performed · Operands used · Execution sequencing) chỉ thấy được trên ảnh.
 *
 * ⚠️ MỌI con số trong bài đã kiểm bằng python3 TRƯỚC khi viết:
 *   · Table 17.2: cả SÁU cột đều cộng đúng 100%. Hệ số khuếch đại
 *     (mem-ref ÷ dynamic): ASSIGN 0,311 (Pascal) / 0,395 (C); CALL 2,933 /
 *     3,75 ⇒ CALL đắt hơn ASSIGN 9,43× (Pascal) và 9,50× (C) tính trên mỗi
 *     lần xuất hiện.
 *   · Table 17.3: cả ba cột cộng 100%. Cột "Average" LÀM TRÒN: (16+23)/2 =
 *     19,5 → 20 và (58+53)/2 = 55,5 → 55 (làm tròn XUỐNG, trái quy tắc thường)
 *     để tổng vẫn đúng 100. Đã nêu thẳng trong bài, không im lặng chép.
 *   · Table 17.4 → 93–100% lời gọi có ≤ 3 tham số; 97–100% có ≤ 5 tham số.
 *   · Figure 17.4 (tô màu đồ thị): đọc vòng đời từ ảnh panel (a) →
 *     A[0,3] B[1,16] C[1,5] D[4,9] E[6,11] F[7,16]; sinh ra ĐÚNG 10 cạnh
 *     AB AC BC BD BE CD DE DF EF BF — khớp từng nét trên panel (b), kể cả
 *     đường CONG dưới E (là D–F, KHÔNG phải C–F: C[1,5] và F[7,16] không
 *     giao nhau). Duyệt vét cạn: {B,D,E,F} là một K4 ⇒ sắc số = 4. Với 3
 *     thanh ghi R1/R2/R3 thì F đụng D (ở R1), B (ở R2), E (ở R3) ⇒ F BẮT BUỘC
 *     bị tràn ra bộ nhớ. Đây chính là điều panel (a) vẽ: cột F không có nhãn
 *     thanh ghi thật nào.
 *   · Figure 17.5: mem-to-mem 8+16+16+16 = 56 bit ⇒ I=56, D=96, M=152 ✓;
 *     reg-to-mem 28+28+20+28 = 104 ⇒ M=200 ✓; (b) 3×56=168, D=3×96=288,
 *     M=456 ✓; reg-to-reg 3×20=60, D=0, M=60 ✓. Tỉ số 456/60 = 7,6×.
 *   · Cửa sổ thanh ghi Berkeley RISC I: 10 global + 8 cửa sổ × (10 local +
 *     6 temp) = 138 thanh ghi, đúng con số lịch sử; mỗi thủ tục THẤY
 *     6+10+6+10 = 32.
 *   · Chi phí gọi thủ tục kiểu ngăn xếp: 3 tham số ghi + 3 đọc + 5 thanh ghi
 *     cất + 5 khôi phục = 16 lần chạm bộ nhớ. Nối Ch.4: H=0,95 ⇒ T=6 ns ⇒
 *     96 ns/lời gọi; H=0,99 ⇒ T=2 ns ⇒ 32 ns/lời gọi. Cửa sổ thanh ghi = 0.
 *   · Table 17.6: 1/0,8 = 1,25 · 1/0,9 = 1,111 · 1/1,2 = 0,833 · 1/0,67 =
 *     1,493 · 1/0,71 = 1,408 · 1/1,12 = 0,893.
 *   · Table 17.1: 3 CISC trung bình 248,7 lệnh so với 2 RISC trung bình 81,5
 *     ⇒ 3,05×. VAX 2–57 byte so với 4 byte cố định ⇒ khoảng rộng 14,25×.
 *   · Table 17.7: trong 10 máy nhóm RISC, KHÔNG máy nào có địa chỉ gián tiếp,
 *     KHÔNG máy nào gộp load/store với số học, TẤT CẢ đều tối đa 1 toán hạng
 *     bộ nhớ. 5 máy CISC: tất cả đều gộp load/store với số học, tất cả đều
 *     ≥ 2 toán hạng bộ nhớ, tất cả đều ≥ 4 lượt dùng MMU.
 *
 * Chỗ slide gốc SAI/THIẾU — nêu rõ, không im lặng chép, không tự sửa slide:
 *   · slide 3 (Table 17.1, 2 of 2): ô "Number of instructions" của UltraSPARC
 *     và MIPS R10000 BỎ TRỐNG trên slide gốc.
 *   · slide 15 (Figure 17.4b): slide chỉ dùng BA kiểu tô ({A,D} xám đặc ·
 *     {B,C,E} gạch chéo · {F} trắng) cho một đồ thị cần BỐN màu, mà B–C và
 *     B–E lại là cạnh ⇒ đọc theo kiểu tô thì KHÔNG phải một phép tô hợp lệ.
 *     Cách đọc đúng nằm ở panel (a): R1 = {A, D}, R2 = {B}, R3 = {C, E},
 *     F không có thanh ghi ⇒ tràn ra bộ nhớ.
 *   · slide 20 (Figure 17.5a): dòng thứ hai in "Load RC, B" — phải là
 *     "Load RC, C" thì phép tính A ← B + C mới đúng. Các con số I/D/M trên
 *     slide vẫn đúng.
 *   · slide 21 (Table 17.7): chú thích chân bảng in "a  RISC hat does not
 *     conform…" — lỗi gõ của "RISC that".
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea17';

export default {
  title: '13.0a — Slide by slide: Why RISC — program statistics, the large register file, and the CISC counter-argument (slides 1–21)|||13.0a — Slide bài giảng: Vì sao có RISC — thống kê chương trình, tệp thanh ghi lớn & lập luận ngược của CISC (slide 1–21)',
  slug: 'cea201-13-0a-slides-risc-thong-ke-thanh-ghi',
  type: 'DOCUMENT',
  description: 'Nửa đầu chương RISC của CEA201 (slide 1–21/42) — chương LẬP LUẬN BẰNG SỐ LIỆU của cả môn. Đi từ bảng so sánh CISC/RISC (Table 17.1), qua ba bảng đo hành vi chương trình thật (tần suất câu lệnh 17.2, loại toán hạng 17.3, số tham số thủ tục 17.4) để rút ra ba kết luận thiết kế, rồi tới tệp thanh ghi lớn: cửa sổ thanh ghi chồng lấn (Fig 17.1), tổ chức đệm vòng có chạy tay chuỗi gọi lồng và ca TRÀN CỬA SỔ (Fig 17.2), biến toàn cục, so tệp thanh ghi với cache (Table 17.5, Fig 17.3), và cấp phát thanh ghi bằng TÔ MÀU ĐỒ THỊ có giải trọn ví dụ 6 biến của Fig 17.4 kèm phép tràn thanh ghi. Khép lại bằng lập luận ngược của phe CISC (Table 17.6 kích thước mã), bộ đặc điểm kiến trúc RISC, phép so lưu lượng bộ nhớ thanh-ghi-với-thanh-ghi (Fig 17.5, 7,6×) và bảng đối chiếu 15 bộ xử lý (Table 17.7). Mọi con số đã kiểm bằng python3.',
  content: [
    walkHead(D, 1, 21),
    walk(D, [

      [1, 'Chapter 17 — Reduced Instruction Set Computers (title slide)',
        `<p class="y-chinh">🎯 The opening slide of the one chapter in this course that is an <strong>argument from measurement</strong>, not from principle. Every design decision in RISC — fewer instructions, one size, one addressing mode, a huge register file — is justified by a table of numbers measured on real programs. Slides 1–21 are that argument.</p>
<ul>
<li><strong>Numbering warning, read this first.</strong> Your syllabus follows the 9th edition and calls this "Chapter 15: Reduced Instruction Set Computers". The 11th edition slide deck in front of you says <strong>Chapter 17</strong>. On this site the lesson is filed as <strong>Chương 13</strong>. Three numbers, one chapter — do not waste exam time worrying about it.</li>
<li><strong>What "reduced" actually means.</strong> Not "fewer features". It means: an instruction set deliberately cut back so that <em>every instruction costs the same and finishes in one machine cycle</em>. Predictability is the product; the small instruction count is only the means.</li>
<li><strong>The chapter has two halves, and this walkthrough covers the first.</strong> Slides 1–21: <em>why</em> RISC — the statistics of real programs (Tables 17.2–17.4), the large register file and register windows (Figures 17.1–17.4), then the CISC counter-argument and the RISC characteristic list. Slides 22–42: <em>how</em> — RISC pipelining, delayed branch, loop unrolling, MIPS R4000, SPARC.</li>
<li><strong>The shape of the whole argument, in one line.</strong> Measure what HLL programs really do → discover that <em>procedure calls and simple scalar variables dominate</em> → conclude that the machine should spend its transistors on <em>registers and a clean pipeline</em>, not on exotic instructions. Everything on slides 2–21 is one of those three steps.</li>
<li><strong>What it connects to.</strong> Ch.13 (instruction sets) and Ch.14 (addressing modes) built the vocabulary RISC then cuts down on purpose. Ch.12 (pipelining, in the 11e numbering Ch.16 processor structure) explains why uniform instructions matter. Ch.4/Ch.5 (memory hierarchy, cache) supply the cost of every memory touch this chapter tries to avoid. PRF192 is where you wrote the local variables that Figure 17.4 allocates.</li>
</ul>
<p class="meo">💡 Carry one sentence through the whole chapter: <strong>"RISC trades instruction count for instruction predictability."</strong> Whenever a slide states a RISC feature, ask "how does this make the cost of an instruction easier to predict?" — the answer is always there.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu của chương DUY NHẤT trong môn này lập luận <strong>BẰNG SỐ ĐO</strong> chứ không bằng nguyên lý. Mọi quyết định thiết kế của RISC — ít lệnh hơn, một kích thước lệnh, một chế độ địa chỉ, một tệp thanh ghi khổng lồ — đều được biện minh bằng một bảng số đo trên chương trình thật. Slide 1–21 chính là cái lập luận đó.</p>
<ul>
<li><strong>Cảnh báo đánh số, đọc trước đã.</strong> Syllabus của trường theo bản 9th ed nên gọi phần này là "Chapter 15: Reduced Instruction Set Computers". Bộ slide 11th ed trước mặt bạn ghi <strong>Chapter 17</strong>. Trên web này bài được xếp là <strong>Chương 13</strong>. Ba con số, một chương — đừng mất thời gian thi vì chuyện đó.</li>
<li><strong>"Rút gọn" thật ra nghĩa là gì.</strong> KHÔNG phải "ít tính năng". Nó nghĩa là: một tập lệnh bị cắt bớt CÓ CHỦ Ý sao cho <em>mọi lệnh đều tốn như nhau và xong trong MỘT chu kỳ máy</em>. Sản phẩm thật sự là TÍNH DỰ ĐOÁN ĐƯỢC; số lệnh ít chỉ là phương tiện.</li>
<li><strong>Chương có hai nửa, bài này đi nửa đầu.</strong> Slide 1–21: <em>VÌ SAO</em> có RISC — thống kê chương trình thật (Table 17.2–17.4), tệp thanh ghi lớn và cửa sổ thanh ghi (Figure 17.1–17.4), rồi lập luận ngược của phe CISC và danh sách đặc điểm RISC. Slide 22–42: <em>LÀM THẾ NÀO</em> — pipeline RISC, rẽ nhánh trễ, bung vòng lặp, MIPS R4000, SPARC.</li>
<li><strong>Hình dạng của cả lập luận, trong một dòng.</strong> Đo xem chương trình bậc cao THẬT SỰ làm gì → phát hiện <em>lời gọi thủ tục và biến vô hướng đơn giản chiếm phần lớn</em> → kết luận máy nên đổ transistor vào <em>thanh ghi và một pipeline sạch</em>, chứ không vào các lệnh dị. Mọi thứ ở slide 2–21 là một trong ba bước đó.</li>
<li><strong>Nó nối vào đâu.</strong> Ch.13 (tập lệnh) và Ch.14 (chế độ địa chỉ) dựng nên đúng cái vốn từ mà RISC sau đó cắt bớt có chủ đích. Ch.12 (pipeline; trong cách đánh 11e là Ch.16 cấu trúc bộ xử lý) giải thích vì sao lệnh đều nhau lại quan trọng. Ch.4/Ch.5 (phân cấp bộ nhớ, cache) cung cấp cái GIÁ của mỗi lần chạm bộ nhớ mà chương này cố tránh. PRF192 là nơi bạn viết ra đúng những biến cục bộ mà Figure 17.4 đem đi cấp phát.</li>
</ul>
<p class="meo">💡 Mang theo một câu suốt cả chương: <strong>"RISC đánh đổi SỐ LƯỢNG lệnh lấy TÍNH DỰ ĐOÁN ĐƯỢC của lệnh."</strong> Slide nào nêu một đặc điểm RISC thì hãy tự hỏi "cái này làm cho giá của một lệnh dễ đoán hơn ở chỗ nào?" — câu trả lời luôn có sẵn ở đó.</p>`],

      [2, 'Table 17.1 — Characteristics of Some CISCs, RISCs, and Superscalar Processors (1 of 2)',
        `<p class="y-chinh">🎯 Five machines, seven rows, and the entire CISC-versus-RISC divide visible as numbers. Read the table <strong>column by column</strong>, not row by row: the three left columns are CISC, the two right ones are RISC, and the gap between them is not subtle.</p>
<table>
<tr><th>Characteristic</th><th>IBM 370/168</th><th>VAX 11/780</th><th>Intel 80486</th><th>SPARC</th><th>MIPS R4000</th></tr>
<tr><td>Year developed</td><td>1973</td><td>1978</td><td>1989</td><td>1987</td><td>1991</td></tr>
<tr><td>Number of instructions</td><td>208</td><td>303</td><td>235</td><td><strong>69</strong></td><td><strong>94</strong></td></tr>
<tr><td>Instruction size (bytes)</td><td>2–6</td><td>2–57</td><td>1–11</td><td><strong>4</strong></td><td><strong>4</strong></td></tr>
<tr><td>Addressing modes</td><td>4</td><td>22</td><td>11</td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
<tr><td>Number of general-purpose registers</td><td>16</td><td>16</td><td>8</td><td><strong>40–520</strong></td><td><strong>32</strong></td></tr>
<tr><td>Control memory size (kbits)</td><td>420</td><td>480</td><td>246</td><td><strong>–</strong></td><td><strong>–</strong></td></tr>
<tr><td>Cache size (kB)</td><td>64</td><td>64</td><td>8</td><td>32</td><td>128</td></tr>
</table>
<ul>
<li><strong>Instruction count: 3× apart.</strong> The three CISCs average 248,7 instructions; the two RISCs average 81,5. Ratio <strong>3,05×</strong>. But this is the <em>least</em> important row — vendors count instructions differently, and a machine is not RISC because it has few instructions.</li>
<li><strong>Instruction size is the row that matters most.</strong> VAX instructions run <strong>2 to 57 bytes</strong> — a 14,25× spread. You cannot know where instruction <em>n+1</em> begins until you have decoded instruction <em>n</em>, which makes deep pipelining nearly impossible. Both RISCs say <strong>4, full stop</strong>: the fetch unit can pull instruction <em>n+1</em>, <em>n+2</em>, <em>n+3</em> before decoding anything.</li>
<li><strong>Addressing modes: 22 versus 1.</strong> Each mode is another way for the effective address to be computed, so another variable-latency path through the machine. One mode (register + displacement) makes address computation a single fixed-cost step. Look back at Ch.14 — every mode you learned there is a cost RISC declines to pay.</li>
<li><strong>The dash in "Control memory size" is the punchline.</strong> CISCs need 246–480 kbits of microcode ROM to interpret their own instruction sets; both RISCs need <em>none</em> — their control units are hardwired. That silicon goes into registers instead, which is why the register row jumps from 8–16 to 32–520.</li>
<li><strong>"40–520" is not a typo.</strong> SPARC's register count is a range because it uses <strong>register windows</strong>: an implementation may build anywhere from 40 to 520 physical registers, of which each procedure sees only 32. That is the entire subject of slides 10–11.</li>
<li><strong>Read the years, they defeat the usual story.</strong> The 80486 (1989) is <em>newer</em> than SPARC (1987) and still CISC. RISC did not replace CISC on a timeline; the two coexisted, and x86 survived by becoming a CISC shell around a RISC-like core (Ch.18).</li>
</ul>
<p class="pitfall">⚠️ Exam trap: the cache row does <strong>not</strong> separate CISC from RISC (64, 64, 8 versus 32, 128 — no pattern). Any question claiming "RISC machines have bigger caches" is reading this table wrong. The separating rows are <em>instruction size</em>, <em>addressing modes</em>, <em>control memory</em>, and <em>register count</em>.</p>`,
        `<p class="y-chinh">🎯 Năm cỗ máy, bảy dòng, và trọn vẹn ranh giới CISC–RISC hiện ra thành số. Đọc bảng <strong>theo CỘT</strong>, đừng đọc theo dòng: ba cột trái là CISC, hai cột phải là RISC, và khoảng cách giữa chúng không hề tinh tế.</p>
<table>
<tr><th>Đặc tính</th><th>IBM 370/168</th><th>VAX 11/780</th><th>Intel 80486</th><th>SPARC</th><th>MIPS R4000</th></tr>
<tr><td>Năm ra đời</td><td>1973</td><td>1978</td><td>1989</td><td>1987</td><td>1991</td></tr>
<tr><td>Số lệnh</td><td>208</td><td>303</td><td>235</td><td><strong>69</strong></td><td><strong>94</strong></td></tr>
<tr><td>Kích thước lệnh (byte)</td><td>2–6</td><td>2–57</td><td>1–11</td><td><strong>4</strong></td><td><strong>4</strong></td></tr>
<tr><td>Số chế độ địa chỉ</td><td>4</td><td>22</td><td>11</td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
<tr><td>Số thanh ghi đa dụng</td><td>16</td><td>16</td><td>8</td><td><strong>40–520</strong></td><td><strong>32</strong></td></tr>
<tr><td>Dung lượng bộ nhớ điều khiển (kbit)</td><td>420</td><td>480</td><td>246</td><td><strong>–</strong></td><td><strong>–</strong></td></tr>
<tr><td>Dung lượng cache (kB)</td><td>64</td><td>64</td><td>8</td><td>32</td><td>128</td></tr>
</table>
<ul>
<li><strong>Số lệnh: cách nhau 3 lần.</strong> Ba máy CISC trung bình 248,7 lệnh; hai máy RISC trung bình 81,5. Tỉ số <strong>3,05×</strong>. Nhưng đây lại là dòng <em>ÍT quan trọng nhất</em> — mỗi hãng đếm lệnh một kiểu, và một cỗ máy không phải là RISC chỉ vì nó ít lệnh.</li>
<li><strong>Kích thước lệnh mới là dòng quan trọng nhất.</strong> Lệnh của VAX chạy từ <strong>2 tới 57 byte</strong> — khoảng rộng 14,25 lần. Bạn KHÔNG thể biết lệnh thứ <em>n+1</em> bắt đầu ở đâu cho tới khi giải mã xong lệnh thứ <em>n</em>, khiến việc dựng pipeline sâu gần như bất khả. Cả hai máy RISC ghi <strong>4, hết</strong>: khối nạp lệnh có thể kéo về lệnh <em>n+1</em>, <em>n+2</em>, <em>n+3</em> trước khi giải mã bất cứ thứ gì.</li>
<li><strong>Chế độ địa chỉ: 22 so với 1.</strong> Mỗi chế độ là một cách khác để tính địa chỉ hiệu dụng, tức thêm một đường đi có độ trễ khác nhau xuyên qua máy. Một chế độ duy nhất (thanh ghi + độ dời) biến việc tính địa chỉ thành một bước giá cố định. Ngoái lại Ch.14 — mọi chế độ bạn học ở đó đều là một cái giá mà RISC từ chối trả.</li>
<li><strong>Dấu gạch ở dòng "bộ nhớ điều khiển" mới là cú chốt.</strong> Máy CISC cần 246–480 kbit ROM vi chương trình để tự thông dịch chính tập lệnh của mình; cả hai máy RISC cần <em>KHÔNG</em> — khối điều khiển của chúng đi dây cứng. Chỗ silicon đó chuyển sang làm thanh ghi, nên dòng thanh ghi mới nhảy từ 8–16 lên 32–520.</li>
<li><strong>"40–520" KHÔNG phải lỗi gõ.</strong> Số thanh ghi của SPARC là một KHOẢNG vì nó dùng <strong>cửa sổ thanh ghi</strong>: một bản cài đặt có thể dựng từ 40 tới 520 thanh ghi vật lý, mà mỗi thủ tục chỉ nhìn thấy 32 cái. Đó là toàn bộ nội dung slide 10–11.</li>
<li><strong>Đọc dòng năm ra đời, nó đánh bại câu chuyện quen thuộc.</strong> 80486 (1989) <em>MỚI HƠN</em> SPARC (1987) mà vẫn là CISC. RISC không hề thay thế CISC theo trục thời gian; hai bên sống song song, và x86 sống sót bằng cách biến thành một cái vỏ CISC bọc quanh một lõi kiểu RISC (Ch.18).</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: dòng cache <strong>KHÔNG</strong> phân biệt được CISC với RISC (64, 64, 8 so với 32, 128 — chẳng theo quy luật nào). Câu nào bảo "máy RISC có cache lớn hơn" là đọc sai bảng này. Bốn dòng thật sự phân tách là <em>kích thước lệnh</em>, <em>chế độ địa chỉ</em>, <em>bộ nhớ điều khiển</em>, và <em>số thanh ghi</em>.</p>`],

      [3, 'Table 17.1 — Characteristics of Some CISCs, RISCs, and Superscalar Processors (2 of 2)',
        `<p class="y-chinh">🎯 The same seven rows for three <strong>superscalar</strong> machines of 1993–1996. The point of this half is that superscalar processors did not go back to CISC — they kept every RISC trait and added parallel issue on top.</p>
<table>
<tr><th>Characteristic</th><th>PowerPC (1993)</th><th>UltraSPARC (1996)</th><th>MIPS R10000 (1996)</th></tr>
<tr><td>Number of instructions</td><td>225</td><td><em>(blank on the slide)</em></td><td><em>(blank on the slide)</em></td></tr>
<tr><td>Instruction size (bytes)</td><td>4</td><td>4</td><td>4</td></tr>
<tr><td>Addressing modes</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>Number of general-purpose registers</td><td>32</td><td>40–520</td><td>32</td></tr>
<tr><td>Control memory size (kbits)</td><td>–</td><td>–</td><td>–</td></tr>
<tr><td>Cache size (kB)</td><td>16–32</td><td>32</td><td>64</td></tr>
</table>
<ul>
<li><strong>Read the row "Instruction size": 4, 4, 4.</strong> Fixed-length instructions survived into the superscalar era untouched. That is not a coincidence — a superscalar fetch unit must locate <em>several</em> instruction boundaries per cycle, which variable-length encoding makes impossible.</li>
<li><strong>Control memory: three dashes.</strong> Microcode is simply gone. Hardwired control is now the norm, which is the practical death of the vi chương trình approach you meet in Ch.19.</li>
<li><strong>PowerPC has 225 instructions — more than the 80486's 235? Almost.</strong> This is the cleanest proof that <em>instruction count alone does not define RISC</em>. PowerPC is a RISC machine with a big instruction set; what makes it RISC is fixed size, 2 addressing modes, 32 registers, no microcode.</li>
<li><strong>Honest note about the blanks.</strong> The "Number of instructions" cells for UltraSPARC and MIPS R10000 are <strong>empty on the original slide</strong> — not zero, not unknown-to-you, simply not filled in by the textbook. Do not invent a value if an exam asks.</li>
<li><strong>UltraSPARC repeats "40–520".</strong> Register windows were not a 1987 experiment that was abandoned; SPARC carried them all the way into the superscalar generation, and they are still in SPARC today.</li>
<li><strong>Cache is the only row that grows.</strong> 8 kB on the 80486 (1989) → 64–128 kB by 1996. As processors got faster, the memory gap of Ch.4 widened, so the cache had to absorb more. That trend continues past this table.</li>
</ul>
<p class="meo">💡 Remember the three tables as one sentence each: <strong>17.1 = who is RISC</strong>, <strong>17.2–17.4 = why RISC</strong>, <strong>17.7 = how strictly each machine obeys the RISC rules</strong>. If you can say what each table <em>proves</em>, you have the chapter.</p>`,
        `<p class="y-chinh">🎯 Vẫn bảy dòng đó nhưng cho ba cỗ máy <strong>SUPERSCALAR</strong> đời 1993–1996. Ý của nửa bảng này: bộ xử lý superscalar KHÔNG quay về CISC — chúng giữ nguyên mọi nét RISC rồi chồng thêm khả năng phát lệnh song song lên trên.</p>
<table>
<tr><th>Đặc tính</th><th>PowerPC (1993)</th><th>UltraSPARC (1996)</th><th>MIPS R10000 (1996)</th></tr>
<tr><td>Số lệnh</td><td>225</td><td><em>(slide BỎ TRỐNG)</em></td><td><em>(slide BỎ TRỐNG)</em></td></tr>
<tr><td>Kích thước lệnh (byte)</td><td>4</td><td>4</td><td>4</td></tr>
<tr><td>Số chế độ địa chỉ</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>Số thanh ghi đa dụng</td><td>32</td><td>40–520</td><td>32</td></tr>
<tr><td>Bộ nhớ điều khiển (kbit)</td><td>–</td><td>–</td><td>–</td></tr>
<tr><td>Cache (kB)</td><td>16–32</td><td>32</td><td>64</td></tr>
</table>
<ul>
<li><strong>Đọc dòng "kích thước lệnh": 4, 4, 4.</strong> Lệnh dài cố định sống sót nguyên vẹn sang kỷ nguyên superscalar. Đó không phải trùng hợp — khối nạp lệnh superscalar phải xác định <em>NHIỀU</em> biên lệnh trong một chu kỳ, mà mã hoá độ dài thay đổi làm điều đó bất khả thi.</li>
<li><strong>Bộ nhớ điều khiển: ba dấu gạch.</strong> Vi chương trình biến mất hẳn. Điều khiển đi dây cứng thành chuẩn mực, tức là cái chết thực tế của lối vi chương trình mà bạn gặp ở Ch.19.</li>
<li><strong>PowerPC có 225 lệnh — nhiều gần bằng 235 lệnh của 80486?</strong> Đây là bằng chứng sạch nhất rằng <em>chỉ mỗi SỐ LỆNH không định nghĩa được RISC</em>. PowerPC là máy RISC với tập lệnh lớn; cái làm nó RISC là kích thước cố định, 2 chế độ địa chỉ, 32 thanh ghi, không vi chương trình.</li>
<li><strong>Ghi chú thành thật về các ô trống.</strong> Ô "Số lệnh" của UltraSPARC và MIPS R10000 <strong>BỎ TRỐNG trên chính slide gốc</strong> — không phải bằng 0, không phải "bạn chưa biết", chỉ đơn giản là sách không điền. Đi thi gặp câu hỏi thì đừng bịa giá trị.</li>
<li><strong>UltraSPARC lặp lại "40–520".</strong> Cửa sổ thanh ghi không phải một thí nghiệm năm 1987 rồi bị bỏ; SPARC mang nó đi thẳng vào thế hệ superscalar, và tới nay SPARC vẫn còn nó.</li>
<li><strong>Cache là dòng DUY NHẤT lớn lên.</strong> 8 kB trên 80486 (1989) → 64–128 kB vào 1996. Bộ xử lý càng nhanh thì khoảng cách bộ nhớ ở Ch.4 càng doãng, nên cache phải hút thêm. Xu hướng đó còn kéo dài quá bảng này.</li>
</ul>
<p class="meo">💡 Nhớ ba bảng bằng mỗi bảng một câu: <strong>17.1 = AI là RISC</strong>, <strong>17.2–17.4 = VÌ SAO có RISC</strong>, <strong>17.7 = từng máy tuân thủ luật RISC CHẶT tới đâu</strong>. Nói được mỗi bảng <em>CHỨNG MINH</em> điều gì là bạn nắm được chương.</p>`],

      [4, 'Instruction Execution Characteristics — HLLs, semantic gap, operations, operands, execution sequencing',
        `<p class="y-chinh">🎯 The section opener, and the only slide that explains <em>what</em> is about to be measured and <em>why</em>. Five labelled blocks around three overlapping circles. ⚠️ The text extracted from the .pptx gives only the title — every word below comes from reading the rendered image.</p>
<table>
<tr><th>Block on the slide</th><th>What it says</th></tr>
<tr><td><strong>High-level languages (HLLs)</strong></td><td>Allow the programmer to express algorithms more concisely · allow the compiler to take care of details that are not important in the programmer's expression of algorithms · often support naturally the use of structured programming and/or object-oriented design</td></tr>
<tr><td><strong>Semantic gap</strong></td><td>The difference between the operations provided in HLLs and those provided in computer architecture</td></tr>
<tr><td><strong>Operations performed</strong></td><td>Determine the functions to be performed by the processor and its interaction with memory</td></tr>
<tr><td><strong>Operands used</strong></td><td>The types of operands and the frequency of their use determine the memory organization for storing them and the addressing modes for accessing them</td></tr>
<tr><td><strong>Execution sequencing</strong></td><td>Determines the control and pipeline organization</td></tr>
</table>
<ul>
<li><strong>The semantic gap is the villain of the chapter — and both sides claim to fix it.</strong> CISC's answer: <em>close the gap from below</em> by adding machine instructions that look like HLL statements (a CASE instruction, a loop instruction, a string-compare instruction). RISC's answer: <em>do not close it at all</em> — let the compiler bridge it, and give the compiler a fast, regular machine to aim at.</li>
<li><strong>The three blocks at the bottom are literally the plan for slides 5, 6, 7.</strong> Operations performed → Table 17.2. Operands used → Table 17.3. Execution sequencing (procedure calls) → Table 17.4. The slide is telling you the experiment before running it.</li>
<li><strong>Notice how each block names its own design consequence.</strong> Operands "determine the memory organization and the addressing modes"; execution sequencing "determines the control and pipeline organization". This is the method of the entire chapter: <em>measure a behaviour, then let that measurement pick a hardware structure</em>.</li>
<li><strong>Why HLLs are the starting point at all.</strong> By the late 1970s almost no production software was written in assembly. So the machine's real customer is no longer a human programmer — it is a <em>compiler</em>. A feature no compiler can generate is dead silicon, and slide 19 will say exactly that.</li>
</ul>
<p class="pitfall">⚠️ Common confusion: "semantic gap" is not a defect to be eliminated. It is a <em>distance</em>, and both CISC and RISC are legitimate strategies for dealing with it. An exam answer saying "RISC closes the semantic gap" is backwards — RISC <em>widens</em> the gap deliberately and hands the job to the compiler.</p>`,
        `<p class="y-chinh">🎯 Slide mở màn phần đo đạc, và là slide DUY NHẤT giải thích sắp <em>ĐO CÁI GÌ</em> và <em>ĐỂ LÀM GÌ</em>. Năm khối chữ vây quanh ba vòng tròn chồng nhau. ⚠️ Bản trích chữ từ .pptx chỉ lấy được TIÊU ĐỀ — mọi chữ dưới đây đọc thẳng từ ảnh render.</p>
<table>
<tr><th>Khối trên slide</th><th>Nó nói gì</th></tr>
<tr><td><strong>Ngôn ngữ bậc cao (HLLs)</strong></td><td>Cho lập trình viên diễn đạt thuật toán súc tích hơn · để trình biên dịch lo những chi tiết không quan trọng trong cách diễn đạt thuật toán · thường hỗ trợ tự nhiên lập trình có cấu trúc và/hoặc thiết kế hướng đối tượng</td></tr>
<tr><td><strong>Khoảng cách ngữ nghĩa (semantic gap)</strong></td><td>Chênh lệch giữa các phép toán mà HLL cung cấp và các phép toán mà KIẾN TRÚC MÁY TÍNH cung cấp</td></tr>
<tr><td><strong>Phép toán được thực hiện</strong></td><td>Quyết định những chức năng mà bộ xử lý phải làm và cách nó tương tác với bộ nhớ</td></tr>
<tr><td><strong>Toán hạng được dùng</strong></td><td>Kiểu toán hạng và tần suất dùng chúng quyết định tổ chức bộ nhớ để lưu chúng và các chế độ địa chỉ để truy cập chúng</td></tr>
<tr><td><strong>Trình tự thực thi</strong></td><td>Quyết định tổ chức khối điều khiển và pipeline</td></tr>
</table>
<ul>
<li><strong>Khoảng cách ngữ nghĩa là "nhân vật phản diện" của chương — và CẢ HAI phe đều tự nhận mình chữa được nó.</strong> Cách của CISC: <em>lấp khoảng cách từ dưới lên</em> bằng cách thêm lệnh máy trông giống câu lệnh HLL (lệnh CASE, lệnh vòng lặp, lệnh so sánh chuỗi). Cách của RISC: <em>KHÔNG lấp gì cả</em> — để trình biên dịch bắc cầu, và trao cho trình biên dịch một cỗ máy nhanh, đều đặn để nhắm vào.</li>
<li><strong>Ba khối phía dưới chính là kế hoạch của slide 5, 6, 7.</strong> Phép toán thực hiện → Table 17.2. Toán hạng dùng → Table 17.3. Trình tự thực thi (lời gọi thủ tục) → Table 17.4. Slide đang nói cho bạn nghe thí nghiệm TRƯỚC khi chạy nó.</li>
<li><strong>Để ý mỗi khối tự nêu luôn hệ quả thiết kế của nó.</strong> Toán hạng "quyết định tổ chức bộ nhớ và chế độ địa chỉ"; trình tự thực thi "quyết định tổ chức khối điều khiển và pipeline". Đây là PHƯƠNG PHÁP của cả chương: <em>đo một hành vi, rồi để phép đo đó chọn ra một cấu trúc phần cứng</em>.</li>
<li><strong>Vì sao lại xuất phát từ HLL.</strong> Tới cuối thập niên 1970 gần như không còn phần mềm sản xuất nào viết bằng hợp ngữ. Nên KHÁCH HÀNG thật sự của cỗ máy không còn là con người lập trình — mà là một <em>TRÌNH BIÊN DỊCH</em>. Tính năng nào không trình biên dịch nào sinh ra được thì là silicon chết, và slide 19 sẽ nói đúng điều đó.</li>
</ul>
<p class="pitfall">⚠️ Nhầm lẫn thường gặp: "khoảng cách ngữ nghĩa" KHÔNG phải một khuyết tật cần xoá bỏ. Nó là một KHOẢNG CÁCH, và cả CISC lẫn RISC đều là chiến lược chính đáng để đối phó với nó. Câu trả lời thi viết "RISC thu hẹp khoảng cách ngữ nghĩa" là NGƯỢC — RISC <em>NỚI RỘNG</em> khoảng cách đó một cách có chủ ý rồi giao việc cho trình biên dịch.</p>`],

      [5, 'Table 17.2 — Weighted Relative Dynamic Frequency of HLL Operations [PATT82a]',
        `<p class="y-chinh">🎯 The single most important table in the chapter. Six columns of measured percentages, and the whole RISC register file is justified by <strong>one row of it</strong>. The trick is that the same operations are counted three different ways, and the three counts disagree violently.</p>
<table>
<tr><th rowspan="2">Operation</th><th colspan="2">Dynamic Occurrence</th><th colspan="2">Machine-Instruction Weighted</th><th colspan="2">Memory-Reference Weighted</th></tr>
<tr><th>Pascal</th><th>C</th><th>Pascal</th><th>C</th><th>Pascal</th><th>C</th></tr>
<tr><td>ASSIGN</td><td><strong>45%</strong></td><td><strong>38%</strong></td><td>13%</td><td>13%</td><td>14%</td><td>15%</td></tr>
<tr><td>LOOP</td><td>5%</td><td>3%</td><td><strong>42%</strong></td><td><strong>32%</strong></td><td>33%</td><td>26%</td></tr>
<tr><td>CALL</td><td>15%</td><td>12%</td><td>31%</td><td>33%</td><td><strong>44%</strong></td><td><strong>45%</strong></td></tr>
<tr><td>IF</td><td>29%</td><td>43%</td><td>11%</td><td>21%</td><td>7%</td><td>13%</td></tr>
<tr><td>GOTO</td><td>–</td><td>3%</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
<tr><td>OTHER</td><td>6%</td><td>1%</td><td>3%</td><td>1%</td><td>2%</td><td>1%</td></tr>
</table>
<p class="nhan">📐 What each weighting means. <strong>Dynamic occurrence</strong> = of all HLL statements <em>executed</em>, what share was of this kind. <strong>Machine-instruction weighted</strong> = of all machine instructions executed, what share came from this kind of statement. <strong>Memory-reference weighted</strong> = of all memory references made, what share came from this kind of statement. All six columns were checked by machine and each sums to exactly <strong>100%</strong>.</p>
<ul>
<li><strong>Row ASSIGN — the most common, the cheapest.</strong> 45% / 38% of statements executed, but only 13% / 13% of machine instructions and 14% / 15% of memory references. An assignment is one or two instructions; it is frequent but tiny. Design conclusion: <em>make the simple data-movement path fast and make it the default</em> — this is why RISC keeps LOAD/STORE and register-to-register MOVE and little else.</li>
<li><strong>Row CALL — the rarest of the big three, the most expensive by far.</strong> 15% / 12% of statements, yet <strong>44% / 45% of all memory references</strong>. Procedure calls generate nearly half the memory traffic of a program while being one statement in seven.</li>
<li><strong>Row LOOP — the instruction hog.</strong> Only 5% / 3% of statements but 42% / 32% of machine instructions: a loop statement is executed once in the source and many times in the machine. Design conclusion: <em>optimise the loop</em> — which is exactly what delayed branch and loop unrolling do on slides 23–26.</li>
<li><strong>Row IF — expensive to think about, cheap to run.</strong> 29% / 43% of statements but only 7% / 13% of memory references. C programmers write far more conditionals than Pascal programmers (43% vs 29%), yet it barely moves the memory cost.</li>
</ul>
<p class="dap-an">✅ Worked number — the amplification factor, computed with python3. Divide the memory-reference weight by the dynamic occurrence to get "memory cost per occurrence": <strong>ASSIGN = 14/45 = 0,311</strong> (Pascal) and <strong>15/38 = 0,395</strong> (C); <strong>CALL = 44/15 = 2,933</strong> (Pascal) and <strong>45/12 = 3,750</strong> (C). Ratio CALL ÷ ASSIGN = <strong>9,43×</strong> in Pascal and <strong>9,50×</strong> in C. <em>One procedure call costs roughly nine and a half assignments in memory traffic.</em> That number, and nothing else, is why the next eight slides are about registers.</p>
<p class="meo">💡 One-line summary to memorise: <strong>"ASSIGN is the most frequent, CALL is the most expensive, LOOP eats the most instructions."</strong> Then the three RISC answers fall out: registers for CALL, a clean pipeline for LOOP, load/store simplicity for ASSIGN.</p>
<p class="pitfall">⚠️ Exam trap: candidates read only the first two columns and answer "ASSIGN is the most important operation to optimise". The table is printed with three weightings precisely so you will not do that. Always ask which <em>weighting</em> the question means.</p>`,
        `<p class="y-chinh">🎯 Bảng QUAN TRỌNG NHẤT của chương. Sáu cột phần trăm đo thật, và cả cái tệp thanh ghi của RISC được biện minh bằng <strong>ĐÚNG MỘT DÒNG</strong> trong đó. Mẹo nằm ở chỗ: cùng những phép toán ấy được đếm theo BA cách khác nhau, và ba cách đếm mâu thuẫn nhau dữ dội.</p>
<table>
<tr><th rowspan="2">Phép toán</th><th colspan="2">Tần suất động (Dynamic)</th><th colspan="2">Trọng số theo LỆNH MÁY</th><th colspan="2">Trọng số theo THAM CHIẾU BỘ NHỚ</th></tr>
<tr><th>Pascal</th><th>C</th><th>Pascal</th><th>C</th><th>Pascal</th><th>C</th></tr>
<tr><td>ASSIGN (gán)</td><td><strong>45%</strong></td><td><strong>38%</strong></td><td>13%</td><td>13%</td><td>14%</td><td>15%</td></tr>
<tr><td>LOOP (vòng lặp)</td><td>5%</td><td>3%</td><td><strong>42%</strong></td><td><strong>32%</strong></td><td>33%</td><td>26%</td></tr>
<tr><td>CALL (gọi thủ tục)</td><td>15%</td><td>12%</td><td>31%</td><td>33%</td><td><strong>44%</strong></td><td><strong>45%</strong></td></tr>
<tr><td>IF (rẽ nhánh)</td><td>29%</td><td>43%</td><td>11%</td><td>21%</td><td>7%</td><td>13%</td></tr>
<tr><td>GOTO</td><td>–</td><td>3%</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
<tr><td>OTHER (khác)</td><td>6%</td><td>1%</td><td>3%</td><td>1%</td><td>2%</td><td>1%</td></tr>
</table>
<p class="nhan">📐 Mỗi cách cân nghĩa là gì. <strong>Tần suất động</strong> = trong tất cả câu lệnh HLL được <em>THỰC THI</em>, loại này chiếm bao nhiêu. <strong>Trọng số theo lệnh máy</strong> = trong tất cả LỆNH MÁY được thực thi, bao nhiêu phần sinh ra từ loại câu lệnh này. <strong>Trọng số theo tham chiếu bộ nhớ</strong> = trong tất cả lần CHẠM BỘ NHỚ, bao nhiêu phần sinh ra từ loại câu lệnh này. Cả sáu cột đã kiểm bằng máy, mỗi cột cộng đúng <strong>100%</strong>.</p>
<ul>
<li><strong>Dòng ASSIGN — phổ biến nhất, rẻ nhất.</strong> 45% / 38% số câu lệnh chạy, nhưng chỉ 13% / 13% số lệnh máy và 14% / 15% số lần chạm bộ nhớ. Một phép gán là một hai lệnh; nó nhiều mà bé. Kết luận thiết kế: <em>làm cho đường CHUYỂN DỮ LIỆU đơn giản thật nhanh và lấy nó làm mặc định</em> — chính vì thế RISC giữ LOAD/STORE với MOVE thanh-ghi-sang-thanh-ghi và gần như không thêm gì.</li>
<li><strong>Dòng CALL — hiếm nhất trong ba ông lớn, ĐẮT NHẤT một trời một vực.</strong> 15% / 12% số câu lệnh, mà chiếm tới <strong>44% / 45% TOÀN BỘ tham chiếu bộ nhớ</strong>. Lời gọi thủ tục sinh ra gần một nửa lưu lượng bộ nhớ của chương trình trong khi chỉ là một trong bảy câu lệnh.</li>
<li><strong>Dòng LOOP — kẻ ngốn lệnh.</strong> Chỉ 5% / 3% số câu lệnh mà chiếm 42% / 32% số lệnh máy: một câu lệnh vòng lặp viết một lần trong mã nguồn nhưng chạy rất nhiều lần trong máy. Kết luận thiết kế: <em>tối ưu vòng lặp</em> — đúng là việc mà rẽ nhánh trễ và bung vòng lặp làm ở slide 23–26.</li>
<li><strong>Dòng IF — nghĩ thì mệt, chạy thì rẻ.</strong> 29% / 43% số câu lệnh mà chỉ 7% / 13% số lần chạm bộ nhớ. Người viết C đặt điều kiện nhiều hơn hẳn người viết Pascal (43% so với 29%), vậy mà gần như không nhích được chi phí bộ nhớ.</li>
</ul>
<p class="dap-an">✅ Con số giải tay — HỆ SỐ KHUẾCH ĐẠI, tính bằng python3. Lấy trọng số tham chiếu bộ nhớ chia cho tần suất động sẽ ra "chi phí bộ nhớ trên mỗi lần xuất hiện": <strong>ASSIGN = 14/45 = 0,311</strong> (Pascal) và <strong>15/38 = 0,395</strong> (C); <strong>CALL = 44/15 = 2,933</strong> (Pascal) và <strong>45/12 = 3,750</strong> (C). Tỉ số CALL ÷ ASSIGN = <strong>9,43×</strong> ở Pascal và <strong>9,50×</strong> ở C. <em>MỘT lời gọi thủ tục tốn lưu lượng bộ nhớ bằng khoảng CHÍN PHẨY NĂM phép gán.</em> Chính con số đó, và không gì khác, là lý do tám slide tiếp theo nói về thanh ghi.</p>
<p class="meo">💡 Câu tóm một dòng để thuộc: <strong>"ASSIGN nhiều nhất, CALL đắt nhất, LOOP ngốn lệnh nhất."</strong> Rồi ba câu trả lời của RISC tự rơi ra: thanh ghi cho CALL, pipeline sạch cho LOOP, sự đơn giản load/store cho ASSIGN.</p>
<p class="pitfall">⚠️ Bẫy đề thi: thí sinh chỉ đọc hai cột đầu rồi trả lời "ASSIGN là phép toán quan trọng nhất cần tối ưu". Bảng in ra BA cách cân chính là để bạn đừng làm vậy. Luôn hỏi đề đang nói tới cách CÂN nào.</p>`],

      [6, 'Table 17.3 — Dynamic Percentage of Operands',
        `<p class="y-chinh">🎯 Having counted <em>operations</em>, the chapter now counts <strong>operands</strong>: of every operand actually referenced while a program runs, what kind was it? Three kinds, three numbers, one conclusion.</p>
<table>
<tr><th>Operand kind</th><th>Pascal</th><th>C</th><th>Average</th></tr>
<tr><td>Integer constant</td><td>16%</td><td>23%</td><td>20%</td></tr>
<tr><td><strong>Scalar variable</strong></td><td><strong>58%</strong></td><td><strong>53%</strong></td><td><strong>55%</strong></td></tr>
<tr><td>Array/Structure</td><td>26%</td><td>24%</td><td>25%</td></tr>
</table>
<ul>
<li><strong>The headline: more than half of all operand references are simple scalars.</strong> Not arrays, not structures, not fields of objects — plain single-valued local variables like <code>i</code>, <code>sum</code>, <code>n</code>, <code>temp</code>. And a scalar is exactly the kind of thing that <em>fits in a register</em>.</li>
<li><strong>Design conclusion, stated plainly.</strong> If 55% of operand traffic is scalars, and scalars can live in registers, then a machine with enough registers can serve the majority of operand references <em>without touching memory at all</em>. That is the hardware solution of slide 9.</li>
<li><strong>Integer constants (20%) are nearly free too.</strong> A constant can be embedded in the instruction itself as an immediate operand (Ch.14, immediate addressing). So 20% + 55% = <strong>75% of operand references need no data memory access</strong> in principle. Only the remaining 25% — arrays and structures — genuinely require a computed memory address.</li>
<li><strong>The 25% array/structure slice is why LOAD and STORE survive.</strong> RISC does not abolish memory access; it <em>isolates</em> it into two instructions so the other 75% of work never pays for it. Compare Ch.14: displacement addressing (base register + offset) is exactly the mode you need to walk an array, and it is the one mode RISC keeps.</li>
<li><strong>Connect to PRF192.</strong> When you declare <code>int i, sum;</code> inside a function, whether those live in registers or on the stack is a decision the <em>compiler</em> makes — slide 15 shows how. When you declare <code>int a[1000];</code>, no compiler can put that in registers; it must be memory. This table is the statistical shadow of that distinction.</li>
</ul>
<p class="dap-an">✅ Checked by machine, and one honest wrinkle. All three columns sum to exactly 100% (16+58+26, 23+53+24, 20+55+25). But the "Average" column is <strong>not a plain average</strong>: (16+23)/2 = <strong>19,5</strong> shown as 20, and (58+53)/2 = <strong>55,5</strong> shown as <strong>55</strong> — rounded <em>down</em>, against the usual rule. The textbook rounded in whichever direction kept the column at 100%. Nothing is wrong with the data; just do not reconstruct 55 from 58 and 53 in an exam and conclude you made an arithmetic error.</p>
<p class="meo">💡 Remember the pair of tables as a sentence: <strong>"Calls dominate the memory traffic (17.2); scalars dominate the operands (17.3)."</strong> Put the two together and you get register windows — a place to keep a procedure's scalars across a call.</p>`,
        `<p class="y-chinh">🎯 Đếm xong <em>PHÉP TOÁN</em>, chương chuyển sang đếm <strong>TOÁN HẠNG</strong>: trong mọi toán hạng thật sự được tham chiếu lúc chương trình chạy, chúng thuộc loại nào? Ba loại, ba con số, một kết luận.</p>
<table>
<tr><th>Loại toán hạng</th><th>Pascal</th><th>C</th><th>Trung bình</th></tr>
<tr><td>Hằng số nguyên</td><td>16%</td><td>23%</td><td>20%</td></tr>
<tr><td><strong>Biến vô hướng (scalar)</strong></td><td><strong>58%</strong></td><td><strong>53%</strong></td><td><strong>55%</strong></td></tr>
<tr><td>Mảng / cấu trúc</td><td>26%</td><td>24%</td><td>25%</td></tr>
</table>
<ul>
<li><strong>Tiêu đề lớn: hơn MỘT NỬA số lần tham chiếu toán hạng là biến vô hướng đơn giản.</strong> Không phải mảng, không phải struct, không phải trường của đối tượng — mà là những biến cục bộ một giá trị kiểu <code>i</code>, <code>sum</code>, <code>n</code>, <code>temp</code>. Mà biến vô hướng đúng là thứ <em>VỪA ĐÚNG MỘT THANH GHI</em>.</li>
<li><strong>Kết luận thiết kế, nói thẳng.</strong> Nếu 55% lưu lượng toán hạng là biến vô hướng, mà biến vô hướng có thể sống trong thanh ghi, thì một cỗ máy có ĐỦ thanh ghi sẽ phục vụ được phần lớn các tham chiếu toán hạng <em>mà KHÔNG chạm vào bộ nhớ lần nào</em>. Đó chính là "giải pháp phần cứng" của slide 9.</li>
<li><strong>Hằng số nguyên (20%) cũng gần như miễn phí.</strong> Một hằng số có thể nhúng thẳng vào lệnh dưới dạng toán hạng tức thời (Ch.14, chế độ immediate). Vậy 20% + 55% = <strong>75% số tham chiếu toán hạng về nguyên tắc KHÔNG cần truy cập bộ nhớ dữ liệu</strong>. Chỉ 25% còn lại — mảng và cấu trúc — mới thật sự cần một địa chỉ bộ nhớ được tính ra.</li>
<li><strong>Mẩu 25% mảng/cấu trúc chính là lý do LOAD và STORE còn sống.</strong> RISC không xoá bỏ truy cập bộ nhớ; nó <em>CÔ LẬP</em> truy cập đó vào hai lệnh để 75% công việc còn lại không bao giờ phải trả giá. Đối chiếu Ch.14: chế độ độ dời (thanh ghi nền + offset) đúng là chế độ bạn cần để duyệt mảng, và đó là chế độ DUY NHẤT mà RISC giữ lại.</li>
<li><strong>Nối sang PRF192.</strong> Khi bạn khai <code>int i, sum;</code> trong một hàm, việc chúng nằm ở thanh ghi hay trên ngăn xếp là quyết định của <em>TRÌNH BIÊN DỊCH</em> — slide 15 chỉ ra cách nó quyết. Khi bạn khai <code>int a[1000];</code> thì không trình biên dịch nào nhét được vào thanh ghi; nó buộc phải ở bộ nhớ. Bảng này là cái bóng thống kê của đúng sự phân biệt ấy.</li>
</ul>
<p class="dap-an">✅ Đã kiểm bằng máy, và có một nếp gấp cần nói thật. Cả ba cột cộng đúng 100% (16+58+26, 23+53+24, 20+55+25). Nhưng cột "Trung bình" <strong>KHÔNG phải trung bình cộng thuần</strong>: (16+23)/2 = <strong>19,5</strong> ghi thành 20, và (58+53)/2 = <strong>55,5</strong> ghi thành <strong>55</strong> — làm tròn <em>XUỐNG</em>, trái quy tắc thường gặp. Sách làm tròn theo hướng nào giữ được tổng 100% thì làm. Dữ liệu không sai; chỉ là đi thi đừng dựng lại 55 từ 58 và 53 rồi tưởng mình tính nhầm.</p>
<p class="meo">💡 Nhớ cặp bảng bằng một câu: <strong>"Lời gọi thống trị lưu lượng bộ nhớ (17.2); biến vô hướng thống trị toán hạng (17.3)."</strong> Ghép hai câu đó lại là ra cửa sổ thanh ghi — một chỗ để giữ các biến vô hướng của thủ tục XUYÊN QUA một lời gọi.</p>`],

      [7, 'Table 17.4 — Procedure Arguments and Local Scalar Variables',
        `<p class="y-chinh">🎯 The third and last measurement, and the one that actually <strong>sizes the hardware</strong>. If procedure calls are where the memory traffic goes, the next question is: how big does a procedure's private workspace need to be? The answer is: <em>surprisingly small</em>.</p>
<table>
<tr><th>Percentage of Executed Procedure Calls With</th><th>Compiler, Interpreter, and Typesetter</th><th>Small Nonnumeric Programs</th></tr>
<tr><td>&gt; 3 arguments</td><td>0–7%</td><td>0–5%</td></tr>
<tr><td>&gt; 5 arguments</td><td>0–3%</td><td>0%</td></tr>
<tr><td>&gt; 8 words of arguments and local scalars</td><td>1–20%</td><td>0–6%</td></tr>
<tr><td>&gt; 12 words of arguments and local scalars</td><td>1–6%</td><td>0–3%</td></tr>
</table>
<p class="nhan">📐 Read the ranges correctly. Each cell is a <strong>range across the several programs measured</strong>, not a single figure and not a confidence interval. "0–7%" means: in the best program measured, no call had more than 3 arguments; in the worst, 7% of calls did.</p>
<ul>
<li><strong>Flip the numbers around — that is where the design lives.</strong> If at most 7% of calls have more than 3 arguments, then <strong>93–100% of all executed calls pass 3 arguments or fewer</strong>. At most 3% have more than 5, so <strong>97–100% pass 5 or fewer</strong>. (Both figures computed by machine.)</li>
<li><strong>Design conclusion #1 — the parameter region.</strong> A register window whose parameter area holds about <strong>6 registers</strong> covers essentially every call that ever executes. You do not need a general mechanism for 20 arguments; you need a fast mechanism for 3, plus a slow fallback for the rare rest. This is why Figure 17.1's window is small.</li>
<li><strong>Design conclusion #2 — the whole window.</strong> Rows three and four count <em>arguments plus local scalars together</em>: 80–99% of calls need 8 words or fewer, and 94–99% need 12 or fewer. So a window of roughly <strong>16–32 registers</strong> holds a typical procedure's entire private state. Compare Table 17.1: SPARC shows every procedure exactly 32 registers. The number came from this table.</li>
<li><strong>Design conclusion #3 — the one this chapter is really about.</strong> Because a procedure's workspace is small and bounded, you can afford to give <em>several</em> procedures a workspace each, simultaneously, in hardware. That is the leap from "more registers" to "register windows".</li>
<li><strong>Note the two program classes and why both are shown.</strong> Compilers/interpreters/typesetters are large, deeply recursive, argument-heavy programs — the hard case. Small nonnumeric programs are the easy case (0% ever exceed 5 arguments). RISC is being sized for the <em>hard</em> column, and even there the numbers are tiny.</li>
</ul>
<p class="pitfall">⚠️ Trap: "words", not "variables". Row three says <em>8 words of arguments and local scalars</em> — a <code>double</code> or a 64-bit value occupies two words on a 32-bit machine. Do not read "8 words" as "8 variables" when a question gives you types.</p>
<p class="meo">💡 The three tables in one chain: <strong>17.2 says calls are expensive → 17.3 says what they move is scalars → 17.4 says how many scalars (few).</strong> Few, small, expensive to move ⇒ build a large register file and never move them. That is the entire derivation of slides 9–11.</p>`,
        `<p class="y-chinh">🎯 Phép đo thứ ba và cuối cùng, và là phép đo thật sự <strong>ĐỊNH CỠ PHẦN CỨNG</strong>. Nếu lời gọi thủ tục là nơi lưu lượng bộ nhớ đổ về, thì câu hỏi kế tiếp là: vùng làm việc riêng của một thủ tục cần TO tới đâu? Câu trả lời: <em>nhỏ đến bất ngờ</em>.</p>
<table>
<tr><th>Phần trăm lời gọi thủ tục đã thực thi mà có</th><th>Trình biên dịch, trình thông dịch, trình sắp chữ</th><th>Chương trình nhỏ, phi số học</th></tr>
<tr><td>&gt; 3 tham số</td><td>0–7%</td><td>0–5%</td></tr>
<tr><td>&gt; 5 tham số</td><td>0–3%</td><td>0%</td></tr>
<tr><td>&gt; 8 từ (word) tham số + biến vô hướng cục bộ</td><td>1–20%</td><td>0–6%</td></tr>
<tr><td>&gt; 12 từ tham số + biến vô hướng cục bộ</td><td>1–6%</td><td>0–3%</td></tr>
</table>
<p class="nhan">📐 Đọc KHOẢNG cho đúng. Mỗi ô là một <strong>KHOẢNG trải trên vài chương trình được đo</strong>, không phải một con số duy nhất và cũng không phải khoảng tin cậy. "0–7%" nghĩa là: ở chương trình tốt nhất, không lời gọi nào quá 3 tham số; ở chương trình tệ nhất, 7% lời gọi vượt.</p>
<ul>
<li><strong>Lật ngược con số lại — thiết kế nằm ở đó.</strong> Nếu nhiều nhất 7% lời gọi có hơn 3 tham số thì <strong>93–100% mọi lời gọi được thực thi truyền TỪ 3 THAM SỐ TRỞ XUỐNG</strong>. Nhiều nhất 3% có hơn 5, nên <strong>97–100% truyền từ 5 trở xuống</strong>. (Cả hai con số tính bằng máy.)</li>
<li><strong>Kết luận thiết kế #1 — vùng tham số.</strong> Một cửa sổ thanh ghi có vùng tham số chứa khoảng <strong>6 thanh ghi</strong> là phủ được gần như MỌI lời gọi từng chạy. Bạn không cần một cơ chế tổng quát cho 20 tham số; bạn cần một cơ chế NHANH cho 3, cộng một đường lùi CHẬM cho phần hiếm còn lại. Đó là lý do cửa sổ ở Figure 17.1 nhỏ như vậy.</li>
<li><strong>Kết luận thiết kế #2 — cả cửa sổ.</strong> Dòng ba và bốn đếm <em>tham số CỘNG biến vô hướng cục bộ</em>: 80–99% lời gọi cần 8 từ trở xuống, và 94–99% cần 12 trở xuống. Vậy một cửa sổ cỡ <strong>16–32 thanh ghi</strong> giữ trọn trạng thái riêng của một thủ tục điển hình. Đối chiếu Table 17.1: SPARC cho mỗi thủ tục nhìn thấy đúng 32 thanh ghi. Con số đó đến từ chính bảng này.</li>
<li><strong>Kết luận thiết kế #3 — cái mà chương này thật sự nhắm tới.</strong> Vì vùng làm việc của một thủ tục vừa nhỏ vừa có chặn trên, bạn ĐỦ SỨC cấp cho <em>NHIỀU</em> thủ tục mỗi thủ tục một vùng làm việc, cùng lúc, bằng phần cứng. Đó là bước nhảy từ "nhiều thanh ghi hơn" sang "CỬA SỔ thanh ghi".</li>
<li><strong>Để ý hai lớp chương trình và vì sao trưng cả hai.</strong> Trình biên dịch / thông dịch / sắp chữ là loại lớn, đệ quy sâu, nhiều tham số — ca KHÓ. Chương trình nhỏ phi số học là ca DỄ (0% từng vượt 5 tham số). RISC đang được định cỡ theo cột <em>KHÓ</em>, mà ngay ở đó con số vẫn bé tí.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: là "TỪ" (word), không phải "biến". Dòng ba nói <em>8 TỪ tham số và biến vô hướng cục bộ</em> — một <code>double</code> hay một giá trị 64 bit chiếm HAI từ trên máy 32 bit. Đừng đọc "8 từ" thành "8 biến" khi đề cho kiểu dữ liệu.</p>
<p class="meo">💡 Ba bảng thành một chuỗi: <strong>17.2 nói lời gọi ĐẮT → 17.3 nói thứ nó chuyển là biến vô hướng → 17.4 nói bao nhiêu biến vô hướng (ÍT).</strong> Ít, nhỏ, mà đắt khi phải chuyển ⇒ dựng một tệp thanh ghi lớn rồi đừng chuyển chúng nữa. Đó là toàn bộ suy diễn của slide 9–11.</p>`],

      [8, 'Implications — the three elements that characterize RISC architectures',
        `<p class="y-chinh">🎯 The slide that turns three tables of statistics into three engineering commitments. Read it as the <strong>conclusion of the measurement section</strong> — everything before was evidence, everything after is construction.</p>
<p class="nhan">📐 What the slide says, word for word: <em>"HLLs can best be supported by optimizing performance of the most time-consuming features of typical HLL programs."</em> Then: <em>"Three elements characterize RISC architectures"</em> — (1) use a large number of registers or use a compiler to optimize register usage; (2) careful attention needs to be paid to the design of instruction pipelines; (3) instructions should have predictable costs and be consistent with a high-performance implementation.</p>
<table>
<tr><th>Element</th><th>Which measurement demanded it</th><th>Where the chapter builds it</th></tr>
<tr><td>Large register file <em>or</em> compiler register optimisation</td><td>Table 17.2 (calls = 44–45% of memory refs) + Table 17.3 (55% scalars) + Table 17.4 (few, small)</td><td>Slides 9–15</td></tr>
<tr><td>Careful instruction pipeline design</td><td>Table 17.2 (loops = 32–42% of machine instructions)</td><td>Slides 22–26 (second half of the deck)</td></tr>
<tr><td>Predictable instruction costs</td><td>Table 17.1 (instruction sizes 2–57 bytes; 22 addressing modes)</td><td>Slides 18–21</td></tr>
</table>
<ul>
<li><strong>The word "or" in element 1 is the fork of the whole chapter.</strong> "Use a large number of registers <em>or</em> use a compiler to optimize register usage" — hardware path or software path. Slide 9 names them explicitly; slides 10–11 build the hardware one (register windows, Berkeley/SPARC), slide 15 builds the software one (graph colouring, IBM 801/MIPS). Both are RISC. Both ship in real machines.</li>
<li><strong>Element 3 is the definition most people get wrong.</strong> "Predictable costs" — not "few instructions", not "simple instructions". A CISC string-move instruction whose duration depends on the string length is unpredictable, and unpredictability is what breaks a pipeline. Everything on slide 18 ("one machine instruction per machine cycle", "fixed length aligned on word boundaries") is a way of buying predictability.</li>
<li><strong>"…and be consistent with a high-performance implementation."</strong> The quiet half of element 3: do not put an instruction in the architecture that your best implementation cannot execute quickly. VAX's POLY (evaluate a polynomial) instruction is the classic counter-example — architecturally elegant, practically slower than the equivalent loop.</li>
<li><strong>Note what is NOT in the list.</strong> There is no element saying "fewer instructions". The word "reduced" in RISC is a historical label, not a design rule; the three real rules are registers, pipelines, predictability.</li>
</ul>
<p class="meo">💡 Three words to carry into the exam: <strong>REGISTERS · PIPELINE · PREDICTABILITY</strong>. Any question asking "what characterizes RISC?" is answered by those three plus one sentence each on why.</p>`,
        `<p class="y-chinh">🎯 Slide biến ba bảng thống kê thành ba cam kết kỹ thuật. Hãy đọc nó như <strong>KẾT LUẬN của phần đo đạc</strong> — mọi thứ trước đó là bằng chứng, mọi thứ sau đó là xây dựng.</p>
<p class="nhan">📐 Slide nói nguyên văn: <em>"HLL được hỗ trợ tốt nhất bằng cách tối ưu hiệu năng của những đặc trưng TỐN THỜI GIAN NHẤT trong các chương trình HLL điển hình."</em> Rồi: <em>"Ba yếu tố đặc trưng cho kiến trúc RISC"</em> — (1) dùng MỘT SỐ LƯỢNG LỚN thanh ghi, HOẶC dùng trình biên dịch để tối ưu việc dùng thanh ghi; (2) phải chú ý kỹ tới thiết kế các pipeline lệnh; (3) lệnh phải có CHI PHÍ DỰ ĐOÁN ĐƯỢC và phải nhất quán với một bản cài đặt hiệu năng cao.</p>
<table>
<tr><th>Yếu tố</th><th>Phép đo nào đòi hỏi nó</th><th>Chương xây nó ở đâu</th></tr>
<tr><td>Tệp thanh ghi lớn <em>HOẶC</em> trình biên dịch tối ưu thanh ghi</td><td>Table 17.2 (lời gọi = 44–45% tham chiếu bộ nhớ) + Table 17.3 (55% biến vô hướng) + Table 17.4 (ít và nhỏ)</td><td>Slide 9–15</td></tr>
<tr><td>Thiết kế pipeline lệnh cẩn thận</td><td>Table 17.2 (vòng lặp = 32–42% số lệnh máy)</td><td>Slide 22–26 (nửa sau của deck)</td></tr>
<tr><td>Chi phí lệnh dự đoán được</td><td>Table 17.1 (kích thước lệnh 2–57 byte; 22 chế độ địa chỉ)</td><td>Slide 18–21</td></tr>
</table>
<ul>
<li><strong>Chữ "HOẶC" trong yếu tố 1 là NGÃ RẼ của cả chương.</strong> "Dùng nhiều thanh ghi <em>HOẶC</em> dùng trình biên dịch để tối ưu việc dùng thanh ghi" — đường phần cứng hay đường phần mềm. Slide 9 gọi tên cả hai; slide 10–11 xây đường phần cứng (cửa sổ thanh ghi, Berkeley/SPARC), slide 15 xây đường phần mềm (tô màu đồ thị, IBM 801/MIPS). CẢ HAI đều là RISC. Cả hai đều ra máy thật.</li>
<li><strong>Yếu tố 3 là định nghĩa mà đa số người hiểu sai.</strong> "Chi phí dự đoán được" — KHÔNG phải "ít lệnh", cũng không phải "lệnh đơn giản". Một lệnh chép chuỗi của CISC mà thời gian chạy phụ thuộc độ dài chuỗi là KHÔNG dự đoán được, và chính sự không dự đoán được mới làm vỡ pipeline. Mọi thứ trên slide 18 ("một lệnh máy mỗi chu kỳ máy", "độ dài cố định, canh theo biên từ") đều là cách mua lấy tính dự đoán được.</li>
<li><strong>"…và phải nhất quán với một bản cài đặt hiệu năng cao."</strong> Nửa lặng lẽ của yếu tố 3: đừng đưa vào kiến trúc một lệnh mà bản cài đặt tốt nhất của bạn không chạy nhanh được. Lệnh POLY (tính giá trị đa thức) của VAX là phản ví dụ kinh điển — đẹp về mặt kiến trúc, thực tế lại CHẬM hơn vòng lặp tương đương.</li>
<li><strong>Để ý cái KHÔNG có trong danh sách.</strong> Không có yếu tố nào nói "ít lệnh hơn". Chữ "reduced" trong RISC là một cái nhãn lịch sử, không phải một luật thiết kế; ba luật thật sự là thanh ghi, pipeline, tính dự đoán được.</li>
</ul>
<p class="meo">💡 Ba chữ mang vào phòng thi: <strong>THANH GHI · PIPELINE · DỰ ĐOÁN ĐƯỢC</strong>. Câu nào hỏi "cái gì đặc trưng cho RISC?" thì trả lời bằng ba chữ đó cộng mỗi chữ một câu giải thích tại sao.</p>`],

      [9, 'The Use of a Large Register File — software solution versus hardware solution',
        `<p class="y-chinh">🎯 The fork in the road, laid out in two columns. Both columns aim at the same target — <strong>keep the operands of Table 17.3 in registers instead of memory</strong> — but they get there by opposite means, and the rest of this walkthrough follows both branches.</p>
<table>
<tr><th>Software Solution</th><th>Hardware Solution</th></tr>
<tr><td>Requires compiler to allocate registers</td><td>More registers</td></tr>
<tr><td>Allocates based on most used variables in a given time</td><td>Thus more variables will be in registers</td></tr>
<tr><td>Requires sophisticated program analysis</td><td>&nbsp;</td></tr>
</table>
<ul>
<li><strong>The hardware argument is brutally simple — that is its strength.</strong> Build more registers; more variables fit; fewer memory references. No compiler cleverness required, so it works even with a mediocre compiler. The cost: registers are expensive silicon, and a bigger register file needs more bits in every instruction to name a register (Table 17.7's last two columns count exactly those bits).</li>
<li><strong>The software argument is cleverer and cheaper — that is its strength.</strong> Keep the register count modest (32), but have the compiler work out <em>which</em> variables deserve them at each point in the program. "Allocates based on most used variables in a given time" is a compressed statement of liveness analysis: a register is not owned by a variable for the whole program, only for the interval where that variable is live. Slide 15 draws that interval.</li>
<li><strong>"Requires sophisticated program analysis" is the honest cost line.</strong> The software route pushes the difficulty into the compiler, where it stays forever — every new compiler for that machine must reimplement it. The hardware route pushes it into the chip once. This is the same trade-off you meet everywhere in this course: <em>do it once in silicon, or every time in software</em>.</li>
<li><strong>Which one won? Both.</strong> Berkeley RISC / SPARC took the hardware road (register windows, 40–520 registers in Table 17.1). IBM 801 and MIPS took the software road (32 registers, a very good compiler — note MIPS R4000 shows exactly 32 in Table 17.1). Table 17.5 and Figure 17.3 later compare the hardware road against the alternative of simply having a bigger <em>cache</em>.</li>
<li><strong>Connect to Ch.4/Ch.5.</strong> Notice that a third option exists and the chapter deliberately keeps it in view: instead of registers, spend the silicon on cache. Slide 13 (Table 17.5) is the head-to-head, and slide 14 (Figure 17.3) shows why a register still beats a cache hit.</li>
</ul>
<p class="pitfall">⚠️ Trap: these are <strong>not</strong> "the RISC way" versus "the CISC way". Both columns are RISC. The distinction inside this slide is <em>hardware-managed</em> versus <em>compiler-managed</em> register allocation — a question a CISC machine with 8 registers never even gets to ask.</p>`,
        `<p class="y-chinh">🎯 Ngã ba đường, bày ra thành hai cột. Cả hai cột nhắm cùng một đích — <strong>giữ các toán hạng của Table 17.3 trong THANH GHI thay vì bộ nhớ</strong> — nhưng đi tới đó bằng hai cách trái ngược, và phần còn lại của bài này bám theo cả hai nhánh.</p>
<table>
<tr><th>Giải pháp PHẦN MỀM</th><th>Giải pháp PHẦN CỨNG</th></tr>
<tr><td>Cần trình biên dịch cấp phát thanh ghi</td><td>Nhiều thanh ghi hơn</td></tr>
<tr><td>Cấp phát dựa trên những biến được dùng nhiều nhất trong một khoảng thời gian cho trước</td><td>Nhờ vậy nhiều biến sẽ nằm trong thanh ghi hơn</td></tr>
<tr><td>Cần phân tích chương trình tinh vi</td><td>&nbsp;</td></tr>
</table>
<ul>
<li><strong>Lập luận phần cứng đơn giản đến thô bạo — và đó là điểm mạnh của nó.</strong> Dựng thêm thanh ghi; nhiều biến vừa vào hơn; ít tham chiếu bộ nhớ hơn. Không cần trình biên dịch khôn, nên nó chạy được cả với trình biên dịch tầm thường. Cái giá: thanh ghi là silicon đắt, và tệp thanh ghi lớn hơn thì mỗi lệnh phải tốn thêm BIT để gọi tên thanh ghi (hai cột cuối của Table 17.7 đếm đúng những bit đó).</li>
<li><strong>Lập luận phần mềm khôn hơn và rẻ hơn — và đó là điểm mạnh của nó.</strong> Giữ số thanh ghi vừa phải (32), nhưng bắt trình biên dịch tính ra <em>BIẾN NÀO</em> xứng đáng được thanh ghi tại từng điểm trong chương trình. "Cấp phát dựa trên biến dùng nhiều nhất trong một khoảng thời gian" là cách nói gọn của phân tích VÒNG ĐỜI (liveness): một thanh ghi không thuộc về một biến suốt cả chương trình, mà chỉ trong khoảng biến đó còn SỐNG. Slide 15 vẽ đúng cái khoảng đó.</li>
<li><strong>"Cần phân tích chương trình tinh vi" là dòng nói thật về cái giá.</strong> Đường phần mềm đẩy cái khó vào trình biên dịch, và nó nằm đó mãi mãi — mọi trình biên dịch mới cho cỗ máy đó đều phải cài lại. Đường phần cứng đẩy cái khó vào chip MỘT LẦN. Đây đúng là sự đánh đổi bạn gặp khắp nơi trong môn này: <em>làm một lần trong silicon, hay làm mỗi lần trong phần mềm</em>.</li>
<li><strong>Bên nào thắng? CẢ HAI.</strong> Berkeley RISC / SPARC đi đường phần cứng (cửa sổ thanh ghi, 40–520 thanh ghi ở Table 17.1). IBM 801 và MIPS đi đường phần mềm (32 thanh ghi, một trình biên dịch rất tốt — để ý MIPS R4000 ghi đúng 32 trong Table 17.1). Table 17.5 và Figure 17.3 sau đó đem đường phần cứng so với lựa chọn thứ ba: cứ làm cái <em>CACHE</em> to hơn.</li>
<li><strong>Nối sang Ch.4/Ch.5.</strong> Để ý rằng có một lựa chọn thứ ba và chương cố ý giữ nó trong tầm mắt: thay vì thanh ghi thì đổ silicon vào cache. Slide 13 (Table 17.5) là trận đối đầu trực diện, còn slide 14 (Figure 17.3) chỉ ra vì sao một thanh ghi vẫn thắng một lần TRÚNG cache.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: đây <strong>KHÔNG</strong> phải "cách của RISC" so với "cách của CISC". Cả hai cột đều là RISC. Phân biệt trong slide này là cấp phát thanh ghi do <em>PHẦN CỨNG quản</em> so với do <em>TRÌNH BIÊN DỊCH quản</em> — một câu hỏi mà cỗ máy CISC có 8 thanh ghi thậm chí chưa bao giờ được quyền đặt ra.</p>`],

      [10, 'Figure 17.1 — Overlapping Register Windows',
        `<p class="y-chinh">🎯 The central mechanism of the whole chapter, drawn in six boxes. Each procedure gets a <strong>window</strong> of registers split into three regions, and consecutive windows <strong>deliberately overlap</strong> so that parameters are passed with <em>zero</em> register moves and <em>zero</em> memory accesses.</p>
<table>
<tr><th>Level</th><th colspan="3">Window contents (left to right, as drawn)</th></tr>
<tr><td><strong>Level J</strong></td><td>Parameter Registers</td><td>Local Registers</td><td>Temporary Registers</td></tr>
<tr><td><strong>Level J + 1</strong></td><td colspan="1">&nbsp;</td><td colspan="1">&nbsp;</td><td>Parameter Registers</td></tr>
</table>
<p class="nhan">📐 The slide draws level J+1 <em>shifted right</em> so that its leftmost box sits directly under level J's rightmost box, with a brace labelled <strong>Call/Return</strong> joining them. That shared box is one set of physical registers with two names: <strong>J's Temporary Registers ARE J+1's Parameter Registers.</strong></p>
<table>
<tr><th>Region</th><th>Who writes it</th><th>Who reads it</th><th>What it holds</th></tr>
<tr><td>Parameter</td><td>the <em>caller</em>, as its own Temporary region</td><td>this procedure</td><td>incoming arguments (and the return address)</td></tr>
<tr><td>Local</td><td>this procedure</td><td>this procedure only</td><td>local scalar variables — private, invisible to everyone else</td></tr>
<tr><td>Temporary</td><td>this procedure</td><td>the <em>callee</em>, as its Parameter region</td><td>outgoing arguments for the next call</td></tr>
</table>
<ul>
<li><strong>The overlap is the whole idea, so say it precisely.</strong> Procedure J wants to call procedure J+1 with three arguments. It writes them into its own <em>Temporary</em> registers — which are physically the same registers that J+1 will read as its <em>Parameter</em> registers. Then the call simply advances the window pointer. <strong>No copy. No push. No memory access.</strong></li>
<li><strong>Why three regions and not two.</strong> The Local region is what makes the scheme safe: J's locals are in registers that J+1 cannot name at all, so a callee physically <em>cannot</em> clobber its caller's variables. On a conventional machine that safety costs you a save/restore of every register you intend to use.</li>
<li><strong>Return works by running the same picture backwards.</strong> On return, the window pointer moves back to J; J+1's Parameter registers become J's Temporary registers again, which is exactly where a return value can be left. The brace on the slide is labelled "Call/Return" — one mechanism, both directions.</li>
<li><strong>Sizing it from Table 17.4.</strong> Parameter region ≈ 6 registers covers 97–100% of calls. Local region large enough for a handful of scalars. Temporary = the next call's parameters, so also ≈ 6. That is a window of roughly 16–22 registers, which is how SPARC ends up showing every procedure 32 (24 window + 8 global).</li>
<li><strong>The cost in physical registers, computed.</strong> With regions of 6 / 10 / 6 and <em>N</em> windows arranged in a circle, each extra window adds only <em>local + temporary</em> = 16 new registers, because the parameter region is shared with the previous window. For the historical Berkeley RISC I: 10 global + 8 × (10 + 6) = <strong>138 physical registers</strong>, of which each procedure sees 6 + 10 + 6 + 10 global = <strong>32</strong>. Both figures verified by machine, and 138 is exactly RISC I's published register count.</li>
</ul>
<p class="meo">💡 Picture it as a row of overlapping index cards on a desk, each card sharing its right edge with the next card's left edge. Passing an argument = writing on the shared edge. Nobody hands anything to anybody.</p>
<p class="pitfall">⚠️ Trap: the window is <strong>not</strong> a copy of a stack frame into registers. Nothing is copied at all — the two procedures simply <em>name the same physical registers differently</em>. If your answer contains the words "copies the parameters into", it is describing the conventional stack machine, not this.</p>`,
        `<p class="y-chinh">🎯 Cơ chế TRUNG TÂM của cả chương, vẽ bằng sáu cái hộp. Mỗi thủ tục được cấp một <strong>CỬA SỔ</strong> thanh ghi chia làm ba vùng, và các cửa sổ liên tiếp <strong>CỐ Ý CHỒNG LÊN NHAU</strong> để tham số được truyền mà KHÔNG phải chuyển thanh ghi lần nào và KHÔNG chạm bộ nhớ lần nào.</p>
<table>
<tr><th>Mức</th><th colspan="3">Nội dung cửa sổ (trái sang phải, đúng như hình vẽ)</th></tr>
<tr><td><strong>Mức J</strong></td><td>Parameter Registers (thanh ghi tham số)</td><td>Local Registers (thanh ghi cục bộ)</td><td>Temporary Registers (thanh ghi tạm)</td></tr>
<tr><td><strong>Mức J + 1</strong></td><td>&nbsp;</td><td>&nbsp;</td><td>Parameter Registers</td></tr>
</table>
<p class="nhan">📐 Slide vẽ mức J+1 <em>DỊCH SANG PHẢI</em> sao cho hộp trái cùng của nó nằm ngay dưới hộp phải cùng của mức J, và một dấu ngoặc nhọn ghi <strong>Call/Return</strong> nối hai cái lại. Cái hộp dùng chung đó là MỘT bộ thanh ghi vật lý mang HAI cái tên: <strong>vùng Temporary của J CHÍNH LÀ vùng Parameter của J+1.</strong></p>
<table>
<tr><th>Vùng</th><th>Ai GHI vào</th><th>Ai ĐỌC</th><th>Chứa gì</th></tr>
<tr><td>Parameter (tham số)</td><td><em>thủ tục GỌI</em>, dưới tên vùng Temporary của nó</td><td>thủ tục này</td><td>tham số vào (và địa chỉ trở về)</td></tr>
<tr><td>Local (cục bộ)</td><td>thủ tục này</td><td>CHỈ thủ tục này</td><td>biến vô hướng cục bộ — riêng tư, không ai khác thấy</td></tr>
<tr><td>Temporary (tạm)</td><td>thủ tục này</td><td><em>thủ tục ĐƯỢC GỌI</em>, dưới tên vùng Parameter của nó</td><td>tham số ra cho lời gọi kế tiếp</td></tr>
</table>
<ul>
<li><strong>Chỗ CHỒNG LẤN mới là toàn bộ ý tưởng, nên phải nói cho chính xác.</strong> Thủ tục J muốn gọi thủ tục J+1 với ba tham số. Nó ghi ba tham số vào vùng <em>Temporary</em> của chính nó — mà đó vật lý CHÍNH LÀ những thanh ghi mà J+1 sẽ đọc dưới tên vùng <em>Parameter</em>. Rồi lời gọi chỉ việc DỜI con trỏ cửa sổ. <strong>Không chép. Không push. Không chạm bộ nhớ.</strong></li>
<li><strong>Vì sao BA vùng chứ không phải hai.</strong> Vùng Local mới là thứ làm cho cơ chế AN TOÀN: biến cục bộ của J nằm trong những thanh ghi mà J+1 thậm chí không GỌI TÊN ĐƯỢC, nên thủ tục được gọi vật lý <em>KHÔNG THỂ</em> đạp lên biến của thủ tục gọi. Trên máy thường, sự an toàn đó phải trả bằng việc cất/khôi phục mọi thanh ghi bạn định dùng.</li>
<li><strong>Trở về là chạy ngược đúng bức tranh đó.</strong> Khi return, con trỏ cửa sổ lùi về J; vùng Parameter của J+1 lại thành vùng Temporary của J, mà đó đúng là chỗ có thể đặt GIÁ TRỊ TRẢ VỀ. Dấu ngoặc trên slide ghi "Call/Return" — MỘT cơ chế, hai chiều.</li>
<li><strong>Định cỡ nó từ Table 17.4.</strong> Vùng Parameter ≈ 6 thanh ghi là phủ 97–100% lời gọi. Vùng Local đủ cho một nhúm biến vô hướng. Vùng Temporary = tham số của lời gọi kế tiếp nên cũng ≈ 6. Vậy một cửa sổ cỡ 16–22 thanh ghi, và đó là cách SPARC đi tới chỗ cho mỗi thủ tục nhìn thấy 32 (24 của cửa sổ + 8 toàn cục).</li>
<li><strong>Cái giá tính bằng thanh ghi VẬT LÝ, đã tính ra số.</strong> Với ba vùng cỡ 6 / 10 / 6 và <em>N</em> cửa sổ xếp thành vòng, mỗi cửa sổ THÊM chỉ tốn <em>local + temporary</em> = 16 thanh ghi mới, vì vùng parameter đã dùng chung với cửa sổ trước. Với Berkeley RISC I lịch sử: 10 toàn cục + 8 × (10 + 6) = <strong>138 thanh ghi vật lý</strong>, mà mỗi thủ tục chỉ thấy 6 + 10 + 6 + 10 toàn cục = <strong>32</strong>. Cả hai con số đã kiểm bằng máy, và 138 đúng bằng số thanh ghi mà RISC I công bố.</li>
</ul>
<p class="meo">💡 Hình dung như một dãy phiếu giấy xếp chồng mép trên bàn, mỗi phiếu dùng chung MÉP PHẢI của nó với mép trái của phiếu kế. Truyền tham số = viết lên cái mép dùng chung. Chẳng ai trao cái gì cho ai cả.</p>
<p class="pitfall">⚠️ Bẫy: cửa sổ <strong>KHÔNG</strong> phải là bản chép khung ngăn xếp vào thanh ghi. Không có gì bị CHÉP hết — hai thủ tục chỉ đơn giản <em>GỌI TÊN CÙNG những thanh ghi vật lý đó theo hai cách khác nhau</em>. Câu trả lời nào có chữ "chép tham số vào" là đang mô tả máy ngăn xếp thông thường, không phải cái này.</p>`],

      [11, 'Figure 17.2 — Circular-Buffer Organization of Overlapped Windows',
        `<p class="y-chinh">🎯 The same windows again, but now bent into a <strong>ring</strong>. This is the slide that answers the obvious objection to Figure 17.1: a program can nest calls arbitrarily deep, but hardware has a finite number of windows. The ring plus two pointers is the answer, and <strong>window overflow</strong> is what happens when the ring runs out.</p>
<p class="nhan">📐 What is actually drawn: an outer ring cut into segments labelled <strong>A.param · A.loc · A.temp = B.param · B.loc · B.temp = C.param · C.loc · C.temp = D.param · D.loc</strong>, then a hatched segment, then two empty segments marked <strong>(E)</strong> and <strong>(F)</strong>. Inside the ring, six windows are named <strong>w0 … w5</strong>. Two arrows point in: <strong>Saved window pointer</strong> (at A.param) and <strong>Current window pointer</strong> (at the hatched segment, D's window). Outside, curved arrows show <strong>Call</strong> advancing one way and <strong>Return</strong> the other, with <strong>Save</strong> and <strong>Restore</strong> arrows at the saved-window pointer.</p>
<ul>
<li><strong>Read the "=" signs on the ring, they are the overlap of Figure 17.1.</strong> "A.temp = B.param" is one segment carrying two names. Bending the strip of Figure 17.1 into a circle changes nothing about the mechanism; it only makes the last window's temporary region touch the first window's parameter region, which is precisely what creates the overflow condition.</li>
<li><strong>Two pointers, two jobs.</strong> <strong>CWP (current window pointer)</strong> says which window the running procedure owns; a CALL advances it, a RETURN moves it back. <strong>SWP (saved window pointer)</strong> says which is the oldest window still held in registers — everything older has already been written out to memory. Overflow is defined by these two colliding.</li>
</ul>
<p class="nhan">📐 Hand-run of a 4-deep nested call on this exact 6-window ring. Start with the main procedure A in w0, both pointers at A.</p>
<table>
<tr><th>Step</th><th>Action</th><th>CWP after</th><th>Windows in use</th><th>Free</th><th>Memory accesses</th></tr>
<tr><td>0</td><td>A running</td><td>w0</td><td>A</td><td>5</td><td>—</td></tr>
<tr><td>1</td><td>A calls B (args written into A.temp = B.param)</td><td>w1</td><td>A, B</td><td>4</td><td><strong>0</strong></td></tr>
<tr><td>2</td><td>B calls C</td><td>w2</td><td>A, B, C</td><td>3</td><td><strong>0</strong></td></tr>
<tr><td>3</td><td>C calls D</td><td>w3</td><td>A, B, C, D</td><td>2</td><td><strong>0</strong></td></tr>
<tr><td>4</td><td>D calls E</td><td>w4</td><td>A, B, C, D, E</td><td>1</td><td><strong>0</strong></td></tr>
<tr><td>5</td><td>E calls F → <strong>WINDOW OVERFLOW</strong></td><td>would be w5</td><td>—</td><td>0</td><td>1 window saved</td></tr>
</table>
<p class="dap-an">✅ Result of the hand-run. Four levels of nesting (A→B→C→D) cost <strong>exactly zero memory accesses</strong>. So does the fifth (E). The sixth call fails: F's window would be w5, whose temporary region <em>is</em> w0's parameter region — F would overwrite A. The hardware raises an interrupt, writes the oldest window (A) out to memory, advances SWP, and only then lets the call proceed. So with <em>N</em> windows you get <strong>N − 1 = 5</strong> simultaneous activations for free; the overflow cost is paid once, not per call, and a matching <em>underflow</em> restores A when the returns unwind that far.</p>
<p class="dap-an">✅ Now price the alternative. A conventional stack machine passing 3 arguments and preserving 5 registers per call does: 3 writes (caller pushes args) + 3 reads (callee loads them) + 5 writes (save registers) + 5 reads (restore) = <strong>16 memory accesses per call/return pair</strong>. Using the Ch.4 two-level model T = T<sub>1</sub> + (1 − H) × T<sub>2</sub> with T<sub>1</sub> = 1 ns and T<sub>2</sub> = 100 ns: at H = 0,95 → T = 6 ns → <strong>96 ns burned per call</strong>; at H = 0,99 → T = 2 ns → <strong>32 ns per call</strong>. The register-window machine spends <strong>0 ns</strong>, because it makes no accesses to burn. All arithmetic checked with python3.</p>
<ul>
<li><strong>Why those 16 accesses matter so much.</strong> Table 17.2 said calls generate 44–45% of all memory references. This slide is where that number is attacked directly — and Ch.4 says every one of those 16 touches is a chance to miss the cache and pay the full 100 ns.</li>
<li><strong>Table 17.4 sizes the ring, not just the window.</strong> Nesting depth in real programs rarely goes deep for long: procedures call and return, so the ring behaves like a small cache of the <em>most recent</em> activation records. An 8-window file (SPARC, slide 36) covers almost all program behaviour; deep recursion is the case that overflows, and it degrades gracefully to memory rather than failing.</li>
<li><strong>Save and Restore are one window each, not the whole file.</strong> The arrows on the left of the slide point at the saved-window pointer only. That is the key efficiency: overflow does not flush all six windows, it spills exactly one, so the cost is amortised across a long run of calls.</li>
</ul>
<p class="pitfall">⚠️ Trap that catches almost everyone: this figure has <strong>6 windows (w0–w5)</strong>, not 8. The famous "8 register windows" belongs to SPARC, Figure 17.13 on slide 36 — a different figure, later in the deck. If a question quotes Figure 17.2, answer with N = 6 and depth N − 1 = 5.</p>
<p class="meo">💡 Memory hook: the window file is a <strong>hardware cache of stack frames</strong>. CWP is the stack pointer; overflow is a cache miss; the "memory" it spills to is the real stack. Everything you know about Ch.4 transfers straight across.</p>`,
        `<p class="y-chinh">🎯 Vẫn những cửa sổ đó, nhưng giờ uốn thành một <strong>VÒNG</strong>. Đây là slide trả lời phản bác hiển nhiên dành cho Figure 17.1: chương trình có thể gọi lồng sâu tuỳ ý, mà phần cứng thì chỉ có hữu hạn cửa sổ. Cái vòng cộng hai con trỏ là câu trả lời, và <strong>TRÀN CỬA SỔ</strong> là chuyện xảy ra khi vòng hết chỗ.</p>
<p class="nhan">📐 Hình thật sự vẽ gì: một vòng ngoài cắt thành các cung ghi <strong>A.param · A.loc · A.temp = B.param · B.loc · B.temp = C.param · C.loc · C.temp = D.param · D.loc</strong>, rồi một cung GẠCH CHÉO, rồi hai cung trống ghi <strong>(E)</strong> và <strong>(F)</strong>. Bên trong vòng, sáu cửa sổ tên <strong>w0 … w5</strong>. Hai mũi tên chỉ vào: <strong>Saved window pointer</strong> (ở A.param) và <strong>Current window pointer</strong> (ở cung gạch chéo, cửa sổ của D). Bên ngoài, mũi tên cong chỉ <strong>Call</strong> đi một chiều và <strong>Return</strong> chiều ngược lại, cùng hai mũi tên <strong>Save</strong> / <strong>Restore</strong> ở chỗ con trỏ cửa sổ đã cất.</p>
<ul>
<li><strong>Đọc kỹ các dấu "=" trên vòng, đó chính là chỗ chồng lấn của Figure 17.1.</strong> "A.temp = B.param" là MỘT cung mang HAI tên. Uốn dải băng của Figure 17.1 thành vòng tròn không thay đổi gì về cơ chế; nó chỉ khiến vùng temporary của cửa sổ CUỐI chạm vào vùng parameter của cửa sổ ĐẦU — mà đó đúng là thứ sinh ra điều kiện tràn.</li>
<li><strong>Hai con trỏ, hai nhiệm vụ.</strong> <strong>CWP (con trỏ cửa sổ hiện tại)</strong> cho biết thủ tục đang chạy sở hữu cửa sổ nào; CALL đẩy nó tiến, RETURN kéo nó lùi. <strong>SWP (con trỏ cửa sổ đã cất)</strong> cho biết cửa sổ CŨ NHẤT còn nằm trong thanh ghi — mọi thứ cũ hơn đã bị ghi ra bộ nhớ rồi. TRÀN được định nghĩa bằng việc hai con trỏ này đâm vào nhau.</li>
</ul>
<p class="nhan">📐 CHẠY TAY một chuỗi gọi lồng 4 mức trên đúng cái vòng 6 cửa sổ này. Khởi đầu: thủ tục chính A ở w0, cả hai con trỏ đều ở A.</p>
<table>
<tr><th>Bước</th><th>Hành động</th><th>CWP sau đó</th><th>Cửa sổ đang dùng</th><th>Còn trống</th><th>Số lần chạm bộ nhớ</th></tr>
<tr><td>0</td><td>A đang chạy</td><td>w0</td><td>A</td><td>5</td><td>—</td></tr>
<tr><td>1</td><td>A gọi B (tham số ghi vào A.temp = B.param)</td><td>w1</td><td>A, B</td><td>4</td><td><strong>0</strong></td></tr>
<tr><td>2</td><td>B gọi C</td><td>w2</td><td>A, B, C</td><td>3</td><td><strong>0</strong></td></tr>
<tr><td>3</td><td>C gọi D</td><td>w3</td><td>A, B, C, D</td><td>2</td><td><strong>0</strong></td></tr>
<tr><td>4</td><td>D gọi E</td><td>w4</td><td>A, B, C, D, E</td><td>1</td><td><strong>0</strong></td></tr>
<tr><td>5</td><td>E gọi F → <strong>TRÀN CỬA SỔ</strong></td><td>lẽ ra là w5</td><td>—</td><td>0</td><td>cất 1 cửa sổ</td></tr>
</table>
<p class="dap-an">✅ Kết quả chạy tay. Bốn mức gọi lồng (A→B→C→D) tốn <strong>ĐÚNG KHÔNG lần chạm bộ nhớ</strong>. Mức thứ năm (E) cũng vậy. Lời gọi thứ SÁU thì hỏng: cửa sổ của F sẽ là w5, mà vùng temporary của w5 <em>CHÍNH LÀ</em> vùng parameter của w0 — F sẽ ghi đè lên A. Phần cứng sinh một ngắt, ghi cửa sổ cũ nhất (A) ra bộ nhớ, đẩy SWP tiến, rồi mới cho lời gọi đi tiếp. Vậy với <em>N</em> cửa sổ bạn được <strong>N − 1 = 5</strong> mức hoạt động cùng lúc MIỄN PHÍ; chi phí tràn trả MỘT LẦN chứ không phải mỗi lời gọi, và một phép <em>TRÀN NGƯỢC (underflow)</em> tương ứng sẽ nạp A trở lại khi các return lùi tới đó.</p>
<p class="dap-an">✅ Giờ định giá phương án thay thế. Một máy ngăn xếp thông thường, truyền 3 tham số và bảo toàn 5 thanh ghi mỗi lời gọi, phải làm: 3 lần GHI (bên gọi push tham số) + 3 lần ĐỌC (bên được gọi nạp chúng) + 5 lần GHI (cất thanh ghi) + 5 lần ĐỌC (khôi phục) = <strong>16 lần chạm bộ nhớ cho mỗi cặp gọi/trở về</strong>. Dùng mô hình hai mức của Ch.4 T = T<sub>1</sub> + (1 − H) × T<sub>2</sub> với T<sub>1</sub> = 1 ns và T<sub>2</sub> = 100 ns: tại H = 0,95 → T = 6 ns → <strong>ĐỐT 96 ns mỗi lời gọi</strong>; tại H = 0,99 → T = 2 ns → <strong>32 ns mỗi lời gọi</strong>. Máy dùng cửa sổ thanh ghi tiêu <strong>0 ns</strong>, vì nó chẳng có lần truy cập nào để mà đốt. Mọi phép tính đã kiểm bằng python3.</p>
<ul>
<li><strong>Vì sao 16 lần chạm ấy lại nặng đến thế.</strong> Table 17.2 đã nói lời gọi sinh ra 44–45% toàn bộ tham chiếu bộ nhớ. Slide này chính là chỗ con số đó bị đánh trực diện — và Ch.4 nhắc rằng mỗi lần trong 16 lần chạm ấy là một cơ hội TRƯỢT cache và phải trả trọn 100 ns.</li>
<li><strong>Table 17.4 định cỡ cả cái VÒNG chứ không chỉ cửa sổ.</strong> Độ sâu lồng trong chương trình thật hiếm khi ở sâu lâu: thủ tục gọi rồi trở về, nên cái vòng hành xử như một cache nhỏ chứa các bản ghi hoạt động <em>GẦN ĐÂY NHẤT</em>. Một tệp 8 cửa sổ (SPARC, slide 36) phủ gần hết hành vi chương trình; đệ quy sâu là ca gây tràn, và nó suy giảm êm ái xuống bộ nhớ chứ không gãy.</li>
<li><strong>Save và Restore mỗi lần MỘT cửa sổ, không phải cả tệp.</strong> Hai mũi tên bên trái slide chỉ vào riêng con trỏ cửa sổ đã cất. Đó là điểm hiệu quả cốt lõi: tràn KHÔNG xả cả sáu cửa sổ, nó chỉ đổ đúng MỘT, nên chi phí được dàn mỏng trên một chuỗi dài lời gọi.</li>
</ul>
<p class="pitfall">⚠️ Bẫy bắt trượt gần như tất cả mọi người: hình này có <strong>6 cửa sổ (w0–w5)</strong>, KHÔNG phải 8. Con số "8 cửa sổ thanh ghi" nổi tiếng là của SPARC, Figure 17.13 ở slide 36 — một hình khác, nằm sau trong deck. Đề trích Figure 17.2 thì trả lời N = 6 và độ sâu N − 1 = 5.</p>
<p class="meo">💡 Mẹo nhớ: tệp cửa sổ là một <strong>CACHE PHẦN CỨNG CHỨA CÁC KHUNG NGĂN XẾP</strong>. CWP là con trỏ ngăn xếp; tràn là một lần trượt cache; cái "bộ nhớ" mà nó đổ ra chính là ngăn xếp thật. Mọi thứ bạn biết ở Ch.4 chuyển sang đây nguyên xi.</p>`],

      [12, 'Global Variables — why windows are not enough',
        `<p class="y-chinh">🎯 The honest limitation of the whole window scheme. Register windows hold a procedure's <em>local</em> scalars beautifully. They do nothing at all for variables that every procedure must see — and this slide works through the fix.</p>
<table>
<tr><th>The slide's line</th><th>What it means in practice</th></tr>
<tr><td>Variables declared global in an HLL can be assigned memory locations by the compiler, and all machine instructions that reference them will use memory reference operands</td><td>The default answer: globals live in memory, every access is a LOAD or STORE</td></tr>
<tr><td>However, for frequently accessed global variables this scheme is inefficient</td><td>A global read a million times pays a memory reference a million times</td></tr>
<tr><td>Alternative is to incorporate a set of <strong>global registers</strong> in the processor</td><td>A block of registers outside the window ring, permanently visible</td></tr>
<tr><td>These registers would be fixed in number and available to all procedures</td><td>They do not move when CWP moves — that is the whole point</td></tr>
<tr><td>A unified numbering scheme can be used to simplify the instruction format</td><td>e.g. register numbers 0–7 mean globals, 8–31 mean the current window</td></tr>
<tr><td>There is an increased hardware burden to accommodate the split in register addressing</td><td>The decoder must now route some register numbers past the window logic</td></tr>
<tr><td>In addition, the linker must decide which global variables should be assigned to registers</td><td>A new, program-wide job — and it lands on the <em>linker</em>, not the compiler</td></tr>
</table>
<ul>
<li><strong>Why the window mechanism structurally cannot handle globals.</strong> A window is defined by the current window pointer; its registers are re-named on every call and return. A global must keep the same identity across every call and return in the program. Those two requirements are incompatible, so globals need registers that live <em>outside</em> the ring entirely.</li>
<li><strong>The unified numbering scheme is the neat part.</strong> With 8 global registers and a 24-register window, an instruction's 5-bit register field addresses 32 things: R0–R7 are always the globals, R8–R31 are the current window. The instruction format does not change at all; only the decoder learns a threshold. Look at Figure 17.3(a) on slide 14 — the "W#" input to the decoder is exactly this mechanism.</li>
<li><strong>Why the LINKER and not the compiler.</strong> A compiler sees one source file. A global variable's total usage across the whole program is only known once every module is combined — which is the linker's job. This is the single most easily-missed sentence on the slide, and it is a favourite exam detail.</li>
<li><strong>The hardware burden is real and measurable.</strong> The register decode path now has two cases (global versus windowed) and both must complete in the same cycle, because RISC's promise is one instruction per cycle. That is the "increased hardware burden" — not extra transistors so much as extra <em>critical path</em>.</li>
<li><strong>Connect to PRF192 and to Ch.9.</strong> In C, a variable declared outside any function is global; one declared <code>static</code> inside a function is also outside every stack frame. Neither can be given a window register. If you have ever wondered why compilers optimise locals far more aggressively than globals, this slide is the architectural reason.</li>
</ul>
<p class="meo">💡 Two-box picture: <strong>a fixed block of global registers, plus a rotating ring of windows.</strong> Globals do not rotate; windows do. Every question about register windows can be answered by asking "does this variable rotate with the call, or not?"</p>
<p class="pitfall">⚠️ Trap: "global registers" are <em>not</em> a third region of the window. Figure 17.1 shows three regions — parameter, local, temporary — and globals are none of them. On SPARC the split is 8 global + 24 window = the 32 registers a procedure sees.</p>`,
        `<p class="y-chinh">🎯 Giới hạn được nói thật của toàn bộ cơ chế cửa sổ. Cửa sổ thanh ghi giữ biến vô hướng <em>CỤC BỘ</em> của thủ tục rất đẹp. Nó chẳng làm được gì cho những biến mà MỌI thủ tục đều phải thấy — và slide này đi trọn cách chữa.</p>
<table>
<tr><th>Dòng trên slide</th><th>Nghĩa thực tế</th></tr>
<tr><td>Biến khai báo toàn cục trong HLL có thể được trình biên dịch gán một ô nhớ, và mọi lệnh máy tham chiếu chúng sẽ dùng toán hạng kiểu tham chiếu bộ nhớ</td><td>Câu trả lời mặc định: biến toàn cục nằm ở BỘ NHỚ, mỗi lần truy cập là một LOAD hoặc STORE</td></tr>
<tr><td>Tuy nhiên, với biến toàn cục được truy cập THƯỜNG XUYÊN thì cách này KHÔNG hiệu quả</td><td>Một biến toàn cục đọc một triệu lần thì trả một triệu lần tham chiếu bộ nhớ</td></tr>
<tr><td>Phương án thay thế: đưa vào bộ xử lý một tập <strong>THANH GHI TOÀN CỤC</strong></td><td>Một khối thanh ghi NẰM NGOÀI vòng cửa sổ, luôn luôn nhìn thấy được</td></tr>
<tr><td>Các thanh ghi này có SỐ LƯỢNG CỐ ĐỊNH và mọi thủ tục đều dùng được</td><td>Chúng KHÔNG dịch khi CWP dịch — đó chính là toàn bộ ý nghĩa</td></tr>
<tr><td>Có thể dùng một cách ĐÁNH SỐ THỐNG NHẤT để đơn giản hoá khuôn dạng lệnh</td><td>ví dụ số hiệu 0–7 nghĩa là toàn cục, 8–31 nghĩa là cửa sổ hiện tại</td></tr>
<tr><td>Có thêm GÁNH NẶNG PHẦN CỨNG để lo việc chẻ đôi cách đánh địa chỉ thanh ghi</td><td>Bộ giải mã giờ phải lái một số hiệu thanh ghi đi vòng qua logic cửa sổ</td></tr>
<tr><td>Ngoài ra, TRÌNH LIÊN KẾT (linker) phải quyết biến toàn cục nào được cấp thanh ghi</td><td>Một việc MỚI, ở tầm toàn chương trình — và nó rơi vào <em>LINKER</em>, không phải trình biên dịch</td></tr>
</table>
<ul>
<li><strong>Vì sao cơ chế cửa sổ về mặt CẤU TRÚC không lo nổi biến toàn cục.</strong> Một cửa sổ được định nghĩa bởi con trỏ cửa sổ hiện tại; thanh ghi của nó bị đổi tên sau MỖI lời gọi và mỗi lần trở về. Còn biến toàn cục thì phải giữ NGUYÊN danh tính xuyên qua mọi lời gọi và mọi lần trở về trong chương trình. Hai yêu cầu đó xung khắc, nên biến toàn cục cần những thanh ghi sống <em>HẲN BÊN NGOÀI</em> cái vòng.</li>
<li><strong>Cách đánh số thống nhất mới là chỗ gọn ghẽ.</strong> Với 8 thanh ghi toàn cục và cửa sổ 24 thanh ghi, trường thanh ghi 5 bit của lệnh đánh địa chỉ được 32 thứ: R0–R7 luôn là toàn cục, R8–R31 là cửa sổ hiện tại. Khuôn dạng lệnh KHÔNG đổi chút nào; chỉ có bộ giải mã học thêm một ngưỡng. Nhìn Figure 17.3(a) ở slide 14 — đầu vào "W#" của bộ giải mã chính là cơ chế này.</li>
<li><strong>Vì sao là LINKER chứ không phải trình biên dịch.</strong> Trình biên dịch chỉ thấy MỘT file nguồn. Tổng mức sử dụng một biến toàn cục trên toàn chương trình chỉ biết được sau khi ghép hết các module — mà đó là việc của linker. Đây là câu dễ bỏ sót nhất trên slide, và là chi tiết đề thi rất thích.</li>
<li><strong>Gánh nặng phần cứng là có thật và đo được.</strong> Đường giải mã thanh ghi giờ có HAI ca (toàn cục hay theo cửa sổ) và cả hai phải xong trong CÙNG một chu kỳ, vì lời hứa của RISC là một lệnh mỗi chu kỳ. Đó là "gánh nặng phần cứng tăng thêm" — không hẳn là thêm transistor cho bằng thêm <em>ĐƯỜNG TỚI HẠN</em>.</li>
<li><strong>Nối sang PRF192 và Ch.9.</strong> Trong C, biến khai ngoài mọi hàm là toàn cục; biến khai <code>static</code> bên trong hàm cũng nằm ngoài mọi khung ngăn xếp. Cả hai đều không được cấp một thanh ghi cửa sổ. Nếu bạn từng thắc mắc vì sao trình biên dịch tối ưu biến cục bộ hung hãn hơn hẳn biến toàn cục thì slide này là lý do KIẾN TRÚC.</li>
</ul>
<p class="meo">💡 Bức tranh hai hộp: <strong>một khối thanh ghi toàn cục CỐ ĐỊNH, cộng một VÒNG cửa sổ xoay.</strong> Toàn cục không xoay; cửa sổ thì xoay. Mọi câu hỏi về cửa sổ thanh ghi đều trả lời được bằng cách hỏi "biến này có XOAY theo lời gọi hay không?"</p>
<p class="pitfall">⚠️ Bẫy: "thanh ghi toàn cục" <em>KHÔNG</em> phải là vùng thứ tư của cửa sổ. Figure 17.1 vẽ ba vùng — parameter, local, temporary — và toàn cục không phải vùng nào trong đó. Trên SPARC phép chẻ là 8 toàn cục + 24 cửa sổ = đúng 32 thanh ghi mà một thủ tục nhìn thấy.</p>`],

      [13, 'Table 17.5 — Characteristics of Large-Register-File and Cache Organizations',
        `<p class="y-chinh">🎯 The head-to-head. Both a large register file and a cache are "small fast storage holding what the program is using right now" — so why build one rather than the other? Six rows of differences, and every row favours the register file for <em>this particular job</em>.</p>
<table>
<tr><th>#</th><th>Large Register File</th><th>Cache</th><th>Why the difference matters</th></tr>
<tr><td>1</td><td>All local scalars</td><td>Recently-used local scalars</td><td>The window holds <em>every</em> local of the active procedures, guaranteed — no misses within the window</td></tr>
<tr><td>2</td><td>Individual variables</td><td>Blocks of memory</td><td>A cache drags in a whole 32-byte line to give you one 4-byte scalar; the register file wastes nothing</td></tr>
<tr><td>3</td><td>Compiler-assigned global variables</td><td>Recently-used global variables</td><td>Slide 12's global registers — decided once, statically, not re-learned at run time</td></tr>
<tr><td>4</td><td>Save/Restore based on procedure nesting depth</td><td>Save/Restore based on cache replacement algorithm</td><td>The window file spills by a rule that <em>matches the program's real structure</em>; a cache guesses with LRU</td></tr>
<tr><td>5</td><td>Register addressing</td><td>Memory addressing</td><td>A 5-bit register number versus a 32-bit address that must be tag-compared — see Figure 17.3</td></tr>
<tr><td>6</td><td><strong>Multiple operands addressed and accessed in one cycle</strong></td><td>One operand addressed and accessed per cycle</td><td>The decisive row: a register file has several read ports, a cache has one access path</td></tr>
</table>
<ul>
<li><strong>Row 6 is the one that settles the argument.</strong> A three-operand RISC instruction like <code>ADD rA, rB, rC</code> needs two source values <em>in the same cycle</em>. A register file simply has two read ports. A single-ported cache would need two cycles — which destroys the "one instruction per machine cycle" promise of slide 18. No amount of cache capacity fixes this; it is a structural limit.</li>
<li><strong>Row 4 is the subtlest and the most interesting.</strong> The register file's spill rule is <em>procedure nesting depth</em> — which is not a heuristic at all, it is the program's actual control structure. A cache's LRU is a guess about the future based on the past. When the guess and the structure agree, they perform alike; the window file simply never has to guess.</li>
<li><strong>Row 2 exposes the hidden waste in caching scalars.</strong> Ch.5 taught that a cache transfers whole lines to exploit spatial locality. But a procedure's local scalars are scattered across a stack frame and across frames — bringing a 32-byte line to serve one 4-byte <code>int</code> can be 87,5% wasted traffic. Registers have no line, so no waste.</li>
<li><strong>Where the cache wins, honestly.</strong> Rows 1 and 3 say "recently-used", which is a <em>dynamic</em> property — a cache adapts to whatever the program does, including array and structure access (the 25% of Table 17.3 that registers cannot hold). That is why real machines have both, and why this table is a comparison and not a verdict.</li>
<li><strong>The real design decision this table encodes.</strong> Given a fixed transistor budget, spend it on registers for the 75% of operand references that are scalars and constants, and on cache for the 25% that are arrays and structures — plus all of the instruction stream. The two are complementary, not competing.</li>
</ul>
<p class="meo">💡 Compress the table to one line: <strong>the register file is a cache that never misses, never guesses, never wastes a line — but can only hold scalars, and only the ones the compiler names.</strong></p>
<p class="pitfall">⚠️ Trap: "Save/Restore based on procedure nesting depth" does not mean the file is saved on <em>every</em> call. Slide 11 proved it: a save happens only on overflow, once every N − 1 nesting levels.</p>`,
        `<p class="y-chinh">🎯 Trận đối đầu trực diện. Cả tệp thanh ghi lớn lẫn cache đều là "kho nhỏ, nhanh, giữ thứ chương trình đang dùng ngay lúc này" — vậy vì sao lại dựng cái này chứ không dựng cái kia? Sáu dòng khác biệt, và mọi dòng đều nghiêng về tệp thanh ghi CHO ĐÚNG CÔNG VIỆC NÀY.</p>
<table>
<tr><th>#</th><th>Tệp thanh ghi lớn</th><th>Cache</th><th>Vì sao khác biệt đó quan trọng</th></tr>
<tr><td>1</td><td>TẤT CẢ biến vô hướng cục bộ</td><td>Biến vô hướng cục bộ VỪA DÙNG GẦN ĐÂY</td><td>Cửa sổ giữ <em>MỌI</em> biến cục bộ của các thủ tục đang hoạt động, được BẢO ĐẢM — trong cửa sổ thì không có chuyện trượt</td></tr>
<tr><td>2</td><td>Từng biến riêng lẻ</td><td>Từng KHỐI bộ nhớ</td><td>Cache lôi nguyên một dòng 32 byte về chỉ để đưa bạn một biến 4 byte; tệp thanh ghi không phí gì</td></tr>
<tr><td>3</td><td>Biến toàn cục do TRÌNH BIÊN DỊCH gán</td><td>Biến toàn cục VỪA DÙNG GẦN ĐÂY</td><td>Thanh ghi toàn cục của slide 12 — quyết một lần, TĨNH, không phải học lại lúc chạy</td></tr>
<tr><td>4</td><td>Cất/khôi phục theo ĐỘ SÂU LỒNG THỦ TỤC</td><td>Cất/khôi phục theo THUẬT TOÁN THAY THẾ của cache</td><td>Tệp cửa sổ đổ ra theo một luật <em>KHỚP VỚI CẤU TRÚC THẬT của chương trình</em>; cache thì ĐOÁN bằng LRU</td></tr>
<tr><td>5</td><td>Đánh địa chỉ kiểu THANH GHI</td><td>Đánh địa chỉ kiểu BỘ NHỚ</td><td>Một số hiệu 5 bit so với một địa chỉ 32 bit phải đem so tag — xem Figure 17.3</td></tr>
<tr><td>6</td><td><strong>NHIỀU toán hạng được đánh địa chỉ và truy cập trong MỘT chu kỳ</strong></td><td>MỘT toán hạng mỗi chu kỳ</td><td>Dòng quyết định: tệp thanh ghi có nhiều cổng đọc, cache chỉ có một đường truy cập</td></tr>
</table>
<ul>
<li><strong>Dòng 6 mới là dòng khép lại cuộc tranh luận.</strong> Một lệnh RISC ba toán hạng như <code>ADD rA, rB, rC</code> cần HAI giá trị nguồn <em>trong CÙNG một chu kỳ</em>. Tệp thanh ghi thì đơn giản là có hai cổng đọc. Cache một cổng sẽ cần HAI chu kỳ — phá vỡ lời hứa "một lệnh mỗi chu kỳ máy" của slide 18. Tăng dung lượng cache bao nhiêu cũng không chữa được; đây là giới hạn CẤU TRÚC.</li>
<li><strong>Dòng 4 tinh tế nhất và thú vị nhất.</strong> Luật đổ ra của tệp thanh ghi là <em>ĐỘ SÂU LỒNG THỦ TỤC</em> — mà đó không phải một phỏng đoán gì cả, đó là CẤU TRÚC ĐIỀU KHIỂN THẬT của chương trình. LRU của cache là một phỏng đoán về tương lai dựa vào quá khứ. Khi phỏng đoán trùng với cấu trúc thì hai bên chạy ngang nhau; có điều tệp cửa sổ thì chẳng bao giờ phải đoán.</li>
<li><strong>Dòng 2 phơi ra chỗ lãng phí ngầm khi đem cache đi đệm biến vô hướng.</strong> Ch.5 dạy rằng cache truyền nguyên DÒNG để khai thác cục bộ không gian. Nhưng biến vô hướng cục bộ của một thủ tục nằm rải rác trong khung ngăn xếp và rải qua nhiều khung — kéo về một dòng 32 byte để phục vụ một <code>int</code> 4 byte có thể là 87,5% lưu lượng bỏ đi. Thanh ghi không có "dòng" nên không có phần bỏ đi.</li>
<li><strong>Chỗ cache thắng, nói cho công bằng.</strong> Dòng 1 và 3 ghi "vừa dùng gần đây", tức một tính chất <em>ĐỘNG</em> — cache thích nghi với bất cứ thứ gì chương trình làm, kể cả truy cập mảng và cấu trúc (đúng 25% của Table 17.3 mà thanh ghi không giữ được). Đó là lý do máy thật có CẢ HAI, và là lý do bảng này là một phép SO SÁNH chứ không phải một bản án.</li>
<li><strong>Quyết định thiết kế thật mà bảng này mã hoá.</strong> Với một ngân sách transistor cố định: đổ vào THANH GHI cho 75% tham chiếu toán hạng là biến vô hướng và hằng số, đổ vào CACHE cho 25% là mảng và cấu trúc — cộng toàn bộ dòng lệnh. Hai thứ BỔ SUNG cho nhau chứ không cạnh tranh nhau.</li>
</ul>
<p class="meo">💡 Nén cả bảng thành một dòng: <strong>tệp thanh ghi là một cái cache không bao giờ trượt, không bao giờ đoán, không bao giờ phí một dòng nào — đổi lại nó chỉ giữ được biến vô hướng, và chỉ những cái trình biên dịch gọi tên.</strong></p>
<p class="pitfall">⚠️ Bẫy: "cất/khôi phục theo độ sâu lồng thủ tục" KHÔNG có nghĩa là cứ MỖI lời gọi lại cất tệp. Slide 11 đã chứng minh: chỉ cất khi TRÀN, tức một lần trên mỗi N − 1 mức lồng.</p>`],

      [14, 'Figure 17.3 — Referencing a Scalar',
        `<p class="y-chinh">🎯 Row 5 of Table 17.5, drawn as two datapaths side by side. Same goal — fetch one scalar — but the two pictures have visibly different amounts of hardware between the instruction and the data, and that difference <em>is</em> the speed difference.</p>
<table>
<tr><th></th><th>(a) Windows-based register file</th><th>(b) Cache</th></tr>
<tr><td>What the instruction carries</td><td>a small field <strong>R</strong> (a register number)</td><td>a large field <strong>A</strong> (a memory address)</td></tr>
<tr><td>Extra input</td><td><strong>W#</strong> — the current window number</td><td>none</td></tr>
<tr><td>Hardware in the path</td><td>a <strong>Decoder</strong> → the register array</td><td><strong>Tags</strong> array + <strong>Data</strong> array → <strong>Compare</strong> → <strong>Select</strong></td></tr>
<tr><td>Output</td><td>Data</td><td>Data</td></tr>
</table>
<ul>
<li><strong>Count the steps and you have the answer.</strong> Path (a): decode a small number, index an array, read. Path (b): index the tag array <em>and</em> the data array, compare the tag against the address, then use the comparison to select among the candidate lines, then read. Roughly two extra serial stages, one of which is a full-width comparator.</li>
<li><strong>The W# input is slide 12's mechanism made visible.</strong> The instruction only names a register <em>within the window</em>; the current window pointer supplies the rest of the physical address. The instruction stays short (5 bits) while the physical register file stays large (138 on RISC I). This is how you get 500 registers without 9-bit register fields.</li>
<li><strong>Look at the width of the two instruction fields on the slide.</strong> In (a) the field <strong>R</strong> is a small box at the end of the instruction; in (b) the field <strong>A</strong> is a wide box. That is not decoration — it is the instruction-size argument of Table 17.1. Register operands let you keep instructions at a fixed 4 bytes; memory addresses do not.</li>
<li><strong>Why the Compare stage cannot be removed.</strong> A cache is an <em>associative</em> structure: several memory addresses map to the same cache slot, so the hardware must verify that the line present is the line wanted. A register file has no such ambiguity — register 7 is register 7, always. Determinism is the thing being bought here, and it is the same theme as "predictable instruction costs" on slide 8.</li>
<li><strong>What this does NOT say.</strong> It does not say cache is slow — a cache hit is still far faster than DRAM (Ch.4: roughly 6 ns versus 129 ns on a real machine). It says a <em>register</em> is faster than a cache hit, and that for the 55% of operand references that are scalars, that gap is worth building hardware for.</li>
</ul>
<p class="meo">💡 Remember the two pictures as verbs: <strong>a register access DECODES; a cache access COMPARES.</strong> Decoding is a fixed, short, guaranteed step. Comparing is a check that can fail — and a failed check is a cache miss.</p>
<p class="pitfall">⚠️ Trap: figure (b) is a diagram of a cache <em>hit</em>. The miss path — going to main memory — is not even drawn, because on a miss the comparison against the register file is no longer close: it is 6 ns versus 129 ns, not 1 ns versus 6 ns.</p>`,
        `<p class="y-chinh">🎯 Dòng 5 của Table 17.5, vẽ thành hai đường dữ liệu đặt cạnh nhau. Cùng một mục tiêu — lấy MỘT biến vô hướng — nhưng hai bức tranh có lượng phần cứng nằm giữa lệnh và dữ liệu khác nhau rõ rệt, và chênh lệch đó CHÍNH LÀ chênh lệch tốc độ.</p>
<table>
<tr><th></th><th>(a) Tệp thanh ghi theo cửa sổ</th><th>(b) Cache</th></tr>
<tr><td>Lệnh mang theo gì</td><td>một trường NHỎ <strong>R</strong> (số hiệu thanh ghi)</td><td>một trường LỚN <strong>A</strong> (địa chỉ bộ nhớ)</td></tr>
<tr><td>Đầu vào phụ</td><td><strong>W#</strong> — số hiệu cửa sổ hiện tại</td><td>không có</td></tr>
<tr><td>Phần cứng trên đường đi</td><td>một <strong>Decoder</strong> → mảng thanh ghi</td><td>mảng <strong>Tags</strong> + mảng <strong>Data</strong> → <strong>Compare</strong> → <strong>Select</strong></td></tr>
<tr><td>Đầu ra</td><td>Data</td><td>Data</td></tr>
</table>
<ul>
<li><strong>Đếm số bước là ra câu trả lời.</strong> Đường (a): giải mã một số nhỏ, tra mảng, đọc. Đường (b): tra mảng tag <em>VÀ</em> mảng dữ liệu, so tag với địa chỉ, rồi dùng kết quả so sánh để CHỌN trong các dòng ứng viên, rồi mới đọc. Nhiều hơn khoảng hai tầng nối tiếp, trong đó có một bộ so sánh nguyên độ rộng.</li>
<li><strong>Đầu vào W# là cơ chế của slide 12 hiện hình.</strong> Lệnh chỉ gọi tên một thanh ghi <em>TRONG cửa sổ</em>; con trỏ cửa sổ hiện tại cung cấp phần còn lại của địa chỉ vật lý. Lệnh vẫn NGẮN (5 bit) trong khi tệp thanh ghi vật lý vẫn LỚN (138 trên RISC I). Đó là cách có được 500 thanh ghi mà không cần trường thanh ghi 9 bit.</li>
<li><strong>Nhìn ĐỘ RỘNG của hai trường lệnh trên slide.</strong> Ở (a) trường <strong>R</strong> là một ô nhỏ ở cuối lệnh; ở (b) trường <strong>A</strong> là một ô RỘNG. Đó không phải trang trí — đó là lập luận về kích thước lệnh của Table 17.1. Toán hạng kiểu thanh ghi cho phép giữ lệnh cố định 4 byte; địa chỉ bộ nhớ thì không.</li>
<li><strong>Vì sao tầng Compare KHÔNG bỏ được.</strong> Cache là một cấu trúc <em>LIÊN KẾT</em>: nhiều địa chỉ bộ nhớ ánh xạ vào cùng một ô cache, nên phần cứng buộc phải KIỂM rằng dòng đang có đúng là dòng đang cần. Tệp thanh ghi không có sự mơ hồ đó — thanh ghi 7 là thanh ghi 7, luôn luôn. Thứ được mua ở đây là TÍNH TẤT ĐỊNH, cùng chủ đề với "chi phí lệnh dự đoán được" ở slide 8.</li>
<li><strong>Điều slide này KHÔNG nói.</strong> Nó không nói cache chậm — một lần TRÚNG cache vẫn nhanh hơn DRAM rất xa (Ch.4: khoảng 6 ns so với 129 ns trên máy thật). Nó nói một THANH GHI nhanh hơn một lần trúng cache, và rằng với 55% tham chiếu toán hạng là biến vô hướng thì khoảng chênh đó đáng để dựng hẳn phần cứng.</li>
</ul>
<p class="meo">💡 Nhớ hai bức tranh bằng hai ĐỘNG TỪ: <strong>truy cập thanh ghi thì GIẢI MÃ; truy cập cache thì SO SÁNH.</strong> Giải mã là một bước cố định, ngắn, được bảo đảm. So sánh là một phép kiểm CÓ THỂ TRƯỢT — và kiểm trượt chính là một lần trượt cache.</p>
<p class="pitfall">⚠️ Bẫy: hình (b) là sơ đồ một lần TRÚNG cache. Đường TRƯỢT — đi xuống bộ nhớ chính — thậm chí không được vẽ, vì khi trượt thì cuộc so sánh với tệp thanh ghi không còn sát sao nữa: nó là 6 ns so với 129 ns, chứ không phải 1 ns so với 6 ns.</p>`],

      [15, 'Figure 17.4 — Graph Coloring Approach',
        `<p class="y-chinh">🎯 The <strong>software</strong> branch of slide 9, worked out completely. Six symbolic registers, three real ones, and a classical graph problem in between. This is the single most exam-worthy figure in the first half of the chapter, so we will solve it end to end.</p>
<p class="nhan">📐 The translation: <strong>variable = vertex</strong>; <strong>lifetimes overlap = edge</strong> (two variables that are live at the same moment cannot share a register); <strong>register = colour</strong>. Colouring the graph with <em>k</em> colours = allocating the variables to <em>k</em> registers. The minimum number of colours needed is the graph's <em>chromatic number</em>.</p>
<p class="nhan">📐 Panel (a) "Time sequence of active use of registers" — six vertical arrows, read off the rendered slide and expressed as intervals on the time grid (time runs downward):</p>
<table>
<tr><th>Symbolic register</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th></tr>
<tr><td>Live from</td><td>0</td><td>1</td><td>1</td><td>4</td><td>6</td><td>7</td></tr>
<tr><td>Live to</td><td>3</td><td>16</td><td>5</td><td>9</td><td>11</td><td>16</td></tr>
</table>
<p class="nhan">📐 Two intervals overlap ⇔ their vertices are joined. Computing every pair by machine gives exactly <strong>10 edges</strong>, and they match every line drawn in panel (b) — including the <em>curved</em> line that sweeps underneath E:</p>
<table>
<tr><th>Vertex</th><th>Interferes with</th><th>Degree</th></tr>
<tr><td>A</td><td>B, C</td><td>2</td></tr>
<tr><td>B</td><td>A, C, D, E, F</td><td>5</td></tr>
<tr><td>C</td><td>A, B, D</td><td>3</td></tr>
<tr><td>D</td><td>B, C, E, F</td><td>4</td></tr>
<tr><td>E</td><td>B, D, F</td><td>3</td></tr>
<tr><td>F</td><td>B, D, E</td><td>3</td></tr>
</table>
<p class="dap-an">✅ Solving it. The curved line is <strong>D–F</strong>, not C–F: C is live over [1,5] and F over [7,16], so C and F never coexist and cannot be joined, while D [4,9] and F [7,16] overlap over [7,9] and must be. Exhaustive search by python3 then gives the <strong>chromatic number = 4</strong>, because {B, D, E, F} is a complete graph K<sub>4</sub> — all six of BD, BE, BF, DE, DF, EF are edges, so those four variables need four different registers. But panel (a) offers only <strong>three</strong> actual registers, R1, R2, R3. The assignment the figure draws is: <strong>R1 = {A, D}</strong> (A dies at 3, D is born at 4 — no overlap), <strong>R2 = {B}</strong> (B is live almost throughout, it monopolises a register), <strong>R3 = {C, E}</strong> (C dies at 5, E is born at 6). Now try to place F: F clashes with D in R1, with B in R2, with E in R3. <strong>F has nowhere to go, so F must be spilled to memory</strong> — which is exactly why panel (a) puts register labels under only the first three columns and leaves column F unlabelled.</p>
<ul>
<li><strong>Register spilling, defined.</strong> When the interference graph needs more colours than the machine has registers, the compiler picks a variable, keeps it in <em>memory</em> instead, and emits a LOAD before each use and a STORE after each definition. That is a "spill". The cost is real memory traffic — the very thing this whole chapter exists to avoid — which is why the compiler spills the variable with the fewest accesses, or the longest lifetime, not just any one.</li>
<li><strong>How the compiler chooses what to spill, in practice.</strong> B has degree 5 and the longest lifetime, so spilling B would free the most colours at once; but B is also live across everything and probably used constantly, so spilling it would be expensive. F has degree 3 and is used less. The heuristic balances <em>degree</em> (how much conflict it removes) against <em>use count</em> (how much traffic it creates).</li>
<li><strong>Why this is the software solution to slide 9's fork.</strong> No register windows, no extra hardware, 32 registers is plenty — but "requires sophisticated program analysis", exactly as slide 9 warned. Liveness analysis plus graph colouring is nontrivial, and it must be redone by every compiler for the machine. MIPS and IBM 801 took this road.</li>
<li><strong>Why register allocation is NP-complete, in one sentence.</strong> Graph colouring is NP-complete, and this reduction goes both ways, so no compiler solves it exactly — they all use heuristics (the classic one being Chaitin's: repeatedly remove a vertex of degree &lt; k, colour the rest, then put it back).</li>
<li><strong>Connect to PRF192.</strong> "Why did my program get slower when I added one more local variable?" — this figure is the answer. You pushed the interference graph past <em>k</em> colours and the compiler started spilling. It is also why <code>register int i;</code> was once a keyword in C: a hint to this algorithm, now obsolete because compilers are better at it than humans.</li>
</ul>
<p class="pitfall">⚠️ Honest note about the slide itself. Panel (b) uses only <strong>three</strong> fill patterns for a graph that needs four colours — {A, D} solid grey, {B, C, E} hatched, {F} white — and B–C and B–E <em>are</em> edges, so read as a colouring the shading is not a valid one. The reliable reading is panel (a): R1 = {A, D}, R2 = {B}, R3 = {C, E}, and F spilled. Do not reproduce the shading in an exam answer; reproduce the column assignment.</p>
<p class="meo">💡 Three words to remember the whole figure: <strong>variable → vertex, overlap → edge, register → colour.</strong> Then "not enough colours" translates immediately into "spill to memory".</p>`,
        `<p class="y-chinh">🎯 Nhánh <strong>PHẦN MỀM</strong> của slide 9, giải trọn vẹn. Sáu thanh ghi ký hiệu, ba thanh ghi thật, và ở giữa là một bài toán đồ thị kinh điển. Đây là hình đáng đi thi nhất trong nửa đầu chương, nên ta sẽ giải từ đầu tới cuối.</p>
<p class="nhan">📐 Phép phiên dịch: <strong>biến = ĐỈNH</strong>; <strong>vòng đời GIAO NHAU = CẠNH</strong> (hai biến cùng SỐNG tại một thời điểm thì không dùng chung một thanh ghi được); <strong>thanh ghi = MÀU</strong>. Tô đồ thị bằng <em>k</em> màu = cấp phát các biến vào <em>k</em> thanh ghi. Số màu TỐI THIỂU cần dùng là <em>SẮC SỐ</em> của đồ thị.</p>
<p class="nhan">📐 Panel (a) "Trình tự thời gian sử dụng thanh ghi" — sáu mũi tên dọc, đọc từ ảnh render và quy thành các khoảng trên lưới thời gian (thời gian chạy từ trên xuống):</p>
<table>
<tr><th>Thanh ghi ký hiệu</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th></tr>
<tr><td>Sống từ</td><td>0</td><td>1</td><td>1</td><td>4</td><td>6</td><td>7</td></tr>
<tr><td>Sống tới</td><td>3</td><td>16</td><td>5</td><td>9</td><td>11</td><td>16</td></tr>
</table>
<p class="nhan">📐 Hai khoảng giao nhau ⇔ hai đỉnh được nối. Cho máy duyệt mọi cặp thì ra đúng <strong>10 cạnh</strong>, và chúng khớp từng nét vẽ trên panel (b) — kể cả đường <em>CONG</em> lượn bên dưới E:</p>
<table>
<tr><th>Đỉnh</th><th>Xung đột với</th><th>Bậc</th></tr>
<tr><td>A</td><td>B, C</td><td>2</td></tr>
<tr><td>B</td><td>A, C, D, E, F</td><td>5</td></tr>
<tr><td>C</td><td>A, B, D</td><td>3</td></tr>
<tr><td>D</td><td>B, C, E, F</td><td>4</td></tr>
<tr><td>E</td><td>B, D, F</td><td>3</td></tr>
<tr><td>F</td><td>B, D, E</td><td>3</td></tr>
</table>
<p class="dap-an">✅ Giải nó. Đường cong là <strong>D–F</strong>, KHÔNG phải C–F: C sống trên [1,5] còn F trên [7,16] nên C và F không bao giờ cùng tồn tại và không thể nối, trong khi D [4,9] và F [7,16] giao nhau trên [7,9] nên bắt buộc phải nối. Duyệt vét cạn bằng python3 cho <strong>SẮC SỐ = 4</strong>, vì {B, D, E, F} là một đồ thị đầy đủ K<sub>4</sub> — cả sáu cạnh BD, BE, BF, DE, DF, EF đều có, nên bốn biến đó cần bốn thanh ghi khác nhau. Nhưng panel (a) chỉ cấp <strong>BA</strong> thanh ghi thật: R1, R2, R3. Cách gán mà hình vẽ ra là: <strong>R1 = {A, D}</strong> (A chết ở 3, D sinh ở 4 — không giao), <strong>R2 = {B}</strong> (B sống gần như suốt, nó độc chiếm một thanh ghi), <strong>R3 = {C, E}</strong> (C chết ở 5, E sinh ở 6). Giờ thử xếp F: F đụng D ở R1, đụng B ở R2, đụng E ở R3. <strong>F không còn chỗ nào, nên F BẮT BUỘC bị TRÀN ra bộ nhớ</strong> — đúng là lý do panel (a) chỉ đặt nhãn thanh ghi dưới ba cột đầu và để cột F trống trơn.</p>
<ul>
<li><strong>TRÀN THANH GHI (register spilling), định nghĩa.</strong> Khi đồ thị xung đột cần nhiều màu hơn số thanh ghi máy có, trình biên dịch chọn ra một biến, để nó ở <em>BỘ NHỚ</em>, rồi phát một lệnh LOAD trước mỗi lần dùng và một STORE sau mỗi lần gán. Đó là "spill". Cái giá là lưu lượng bộ nhớ THẬT — đúng cái thứ mà cả chương này sinh ra để tránh — nên trình biên dịch chọn đổ biến ít được truy cập nhất, hoặc có vòng đời dài nhất, chứ không phải bừa một biến nào.</li>
<li><strong>Trình biên dịch chọn đổ cái gì, trong thực tế.</strong> B có bậc 5 và vòng đời dài nhất, nên đổ B sẽ giải phóng nhiều màu nhất một lúc; nhưng B cũng sống xuyên qua mọi thứ và hẳn là bị dùng liên tục, nên đổ nó rất đắt. F bậc 3 và ít được dùng hơn. Phép chọn cân giữa <em>BẬC</em> (xoá được bao nhiêu xung đột) với <em>SỐ LẦN DÙNG</em> (sinh ra bao nhiêu lưu lượng).</li>
<li><strong>Vì sao đây là giải pháp phần mềm cho ngã rẽ ở slide 9.</strong> Không cửa sổ thanh ghi, không thêm phần cứng, 32 thanh ghi là thừa đủ — nhưng "cần phân tích chương trình tinh vi", đúng như slide 9 đã cảnh báo. Phân tích vòng đời cộng tô màu đồ thị không hề đơn giản, và mọi trình biên dịch cho cỗ máy đó đều phải làm lại. MIPS và IBM 801 đi đường này.</li>
<li><strong>Vì sao cấp phát thanh ghi là bài toán NP-đầy đủ, trong một câu.</strong> Tô màu đồ thị là NP-đầy đủ, và phép quy dẫn này đi được cả hai chiều, nên KHÔNG trình biên dịch nào giải chính xác — tất cả đều dùng phép chọn gần đúng (kinh điển là của Chaitin: cứ gỡ dần một đỉnh bậc &lt; k, tô phần còn lại, rồi ghép nó trở lại).</li>
<li><strong>Nối sang PRF192.</strong> "Vì sao thêm đúng một biến cục bộ mà chương trình chậm hẳn đi?" — hình này là câu trả lời. Bạn đã đẩy đồ thị xung đột vượt quá <em>k</em> màu và trình biên dịch bắt đầu đổ biến ra bộ nhớ. Đó cũng là lý do <code>register int i;</code> từng là một từ khoá trong C: một lời mách nước cho đúng thuật toán này, nay đã lỗi thời vì trình biên dịch làm giỏi hơn con người.</li>
</ul>
<p class="pitfall">⚠️ Ghi chú thành thật về CHÍNH SLIDE. Panel (b) chỉ dùng <strong>BA</strong> kiểu tô cho một đồ thị cần BỐN màu — {A, D} xám đặc, {B, C, E} gạch chéo, {F} trắng — mà B–C và B–E <em>LÀ</em> cạnh, nên nếu đọc kiểu tô như một phép tô màu thì nó KHÔNG hợp lệ. Cách đọc đáng tin là panel (a): R1 = {A, D}, R2 = {B}, R3 = {C, E}, và F bị tràn. Đi thi đừng chép lại kiểu tô; hãy chép lại cách gán theo CỘT.</p>
<p class="meo">💡 Ba chữ để nhớ trọn cái hình: <strong>biến → đỉnh, giao nhau → cạnh, thanh ghi → màu.</strong> Rồi "không đủ màu" dịch ngay thành "đổ ra bộ nhớ".</p>`],

      [16, 'Why CISC? (Complex Instruction Set Computer)',
        `<p class="y-chinh">🎯 The chapter now stops and argues <strong>against itself</strong>. This slide states the CISC case as its proponents stated it — and it is a genuinely good case, which is why it took a decade of measurements to answer.</p>
<p class="nhan">📐 The slide's structure: <em>"There is a trend to richer instruction sets which include a larger and more complex number of instructions."</em> Two principal reasons for the trend — <strong>a desire to simplify compilers</strong> and <strong>a desire to improve performance</strong>. Then two advantages of smaller programs — <strong>the program takes up less memory</strong>, and <strong>it should improve performance</strong>, for three stated sub-reasons: fewer instruction bytes to be fetched · in a paging environment smaller programs occupy fewer pages, reducing page faults · more instructions fit in cache(s).</p>
<table>
<tr><th>CISC claim</th><th>The reasoning behind it</th><th>Where slides 17–21 answer it</th></tr>
<tr><td>Richer instruction sets simplify compilers</td><td>If a machine instruction exists that matches an HLL statement, code generation is a lookup instead of a synthesis</td><td>Slide 19: compilers <em>do not use</em> the complex instructions; simpler primitives give more optimisation opportunities</td></tr>
<tr><td>Richer instruction sets improve performance</td><td>One complex instruction replaces several simple ones, so the program is shorter</td><td>Slide 17 (Table 17.6): RISC programs are only slightly bigger, not several times bigger</td></tr>
<tr><td>Smaller programs use less memory</td><td>Memory was genuinely scarce and expensive when this argument was formed</td><td>Table 17.6 again: a 10–25% difference, on machines whose memory grew 1000×</td></tr>
<tr><td>Smaller programs are faster: fewer bytes fetched</td><td>Instruction fetch is memory traffic (Ch.3, Ch.4)</td><td>Slide 20 (Figure 17.5): fewer instruction bytes, but far <em>more</em> data bytes — total traffic goes up</td></tr>
<tr><td>Smaller programs are faster: fewer page faults, better cache fit</td><td>Ch.9 (OS support) and Ch.5 (cache) both reward a small working set</td><td>Largely conceded — but the effect is small next to the data-traffic effect</td></tr>
</table>
<ul>
<li><strong>The "simplify compilers" claim is the one that aged worst.</strong> It assumes the compiler wants a machine instruction that matches the source statement. In practice a compiler generating a CASE instruction must first prove the source CASE has exactly the shape the hardware expects — often harder than just emitting a compare-and-branch sequence. The complex instruction ends up unused.</li>
<li><strong>The "smaller programs" claim rests on an unstated assumption.</strong> It assumes <em>program size is proportional to execution time</em>. Slide 20 destroys that: what costs time is total memory traffic (instructions <em>plus</em> data), and CISC's memory-to-memory style moves far more data.</li>
<li><strong>Read the historical context fairly.</strong> When the VAX was designed, core memory cost dollars per kilobyte, compilers were weak, and microcode was the cheap way to add features. Every CISC argument on this slide was <em>correct for 1975</em>. What changed was not the logic but the prices: memory got cheap, compilers got good, and pipelining raised the value of regularity.</li>
<li><strong>Why the chapter bothers to make the enemy's case at all.</strong> Because an exam question that asks "give two arguments for CISC" is asking for exactly this slide — and because a design argument you cannot state fairly is one you do not really understand.</li>
</ul>
<p class="meo">💡 Compress the slide to a slogan and its rebuttal: <strong>CISC says "fewer, richer instructions"; the chapter answers "fewer instructions is not fewer bytes moved".</strong> Slide 20 is where that answer becomes arithmetic.</p>
<p class="pitfall">⚠️ Trap: this slide is <em>not</em> a list of CISC disadvantages. Every bullet on it is a claimed <strong>advantage</strong>. Questions sometimes quote a line from here and ask "is this a RISC or CISC argument?" — everything on slide 16 is CISC.</p>`,
        `<p class="y-chinh">🎯 Tới đây chương DỪNG LẠI và tranh luận <strong>NGƯỢC LẠI CHÍNH MÌNH</strong>. Slide này trình bày lập luận của phe CISC đúng như những người ủng hộ nó trình bày — và đó là một lập luận thật sự tốt, nên mới phải mất cả thập kỷ đo đạc để trả lời.</p>
<p class="nhan">📐 Bố cục slide: <em>"Có một xu hướng tiến tới tập lệnh PHONG PHÚ HƠN, gồm nhiều lệnh hơn và phức tạp hơn."</em> Hai lý do chính của xu hướng — <strong>mong muốn LÀM ĐƠN GIẢN TRÌNH BIÊN DỊCH</strong> và <strong>mong muốn CẢI THIỆN HIỆU NĂNG</strong>. Rồi hai lợi thế của chương trình nhỏ — <strong>chương trình chiếm ít bộ nhớ hơn</strong>, và <strong>lẽ ra phải chạy nhanh hơn</strong>, với ba lý do phụ được nêu: ít byte lệnh phải nạp về hơn · trong môi trường phân trang, chương trình nhỏ chiếm ít trang hơn nên giảm lỗi trang · nhiều lệnh vừa vào cache hơn.</p>
<table>
<tr><th>Khẳng định của CISC</th><th>Lý lẽ đằng sau nó</th><th>Slide 17–21 trả lời ở đâu</th></tr>
<tr><td>Tập lệnh phong phú làm trình biên dịch đơn giản hơn</td><td>Nếu có sẵn một lệnh máy khớp với câu lệnh HLL thì sinh mã chỉ là TRA BẢNG chứ không phải TỔNG HỢP</td><td>Slide 19: trình biên dịch <em>KHÔNG DÙNG</em> các lệnh phức tạp; lệnh nguyên thuỷ hơn cho nhiều cơ hội tối ưu hơn</td></tr>
<tr><td>Tập lệnh phong phú cải thiện hiệu năng</td><td>Một lệnh phức thay được vài lệnh đơn, nên chương trình NGẮN hơn</td><td>Slide 17 (Table 17.6): chương trình RISC chỉ LỚN HƠN CHÚT ÍT, không hề gấp mấy lần</td></tr>
<tr><td>Chương trình nhỏ tốn ít bộ nhớ hơn</td><td>Bộ nhớ thời lập luận này ra đời thật sự hiếm và đắt</td><td>Vẫn Table 17.6: chênh 10–25%, trên những cỗ máy mà bộ nhớ đã tăng 1000 lần</td></tr>
<tr><td>Chương trình nhỏ chạy nhanh hơn: nạp ít byte hơn</td><td>Nạp lệnh cũng là lưu lượng bộ nhớ (Ch.3, Ch.4)</td><td>Slide 20 (Figure 17.5): ít byte LỆNH thật, nhưng NHIỀU byte DỮ LIỆU hơn hẳn — tổng lưu lượng TĂNG</td></tr>
<tr><td>Chương trình nhỏ chạy nhanh hơn: ít lỗi trang, vừa cache hơn</td><td>Ch.9 (hỗ trợ HĐH) và Ch.5 (cache) đều thưởng cho vùng làm việc nhỏ</td><td>Phần lớn được CÔNG NHẬN — nhưng hiệu ứng đó bé so với hiệu ứng lưu lượng DỮ LIỆU</td></tr>
</table>
<ul>
<li><strong>Khẳng định "làm đơn giản trình biên dịch" là cái già cỗi nhanh nhất.</strong> Nó giả định trình biên dịch MUỐN có một lệnh máy khớp với câu lệnh nguồn. Thực tế, trình biên dịch muốn sinh ra lệnh CASE thì trước hết phải CHỨNG MINH câu CASE trong nguồn có đúng hình dạng mà phần cứng trông đợi — thường còn khó hơn là cứ phát ra một chuỗi so-sánh-rồi-rẽ-nhánh. Cuối cùng lệnh phức nằm không.</li>
<li><strong>Khẳng định "chương trình nhỏ hơn" dựa trên một giả định KHÔNG NÓI RA.</strong> Nó giả định <em>kích thước chương trình tỉ lệ với thời gian chạy</em>. Slide 20 đập nát điều đó: thứ tốn thời gian là TỔNG lưu lượng bộ nhớ (lệnh <em>CỘNG</em> dữ liệu), mà lối bộ-nhớ-tới-bộ-nhớ của CISC chuyển dữ liệu nhiều hơn rất nhiều.</li>
<li><strong>Đọc bối cảnh lịch sử cho công bằng.</strong> Thời VAX được thiết kế, bộ nhớ lõi từ có giá vài đô mỗi kilobyte, trình biên dịch yếu, và vi chương trình là cách RẺ để thêm tính năng. Mọi lập luận CISC trên slide này đều <em>ĐÚNG với năm 1975</em>. Thứ thay đổi không phải logic mà là GIÁ CẢ: bộ nhớ rẻ đi, trình biên dịch giỏi lên, và pipeline làm cho sự đều đặn trở nên có giá.</li>
<li><strong>Vì sao chương lại chịu khó trình bày lập luận của "phe địch".</strong> Vì câu hỏi thi "nêu hai lập luận ủng hộ CISC" hỏi đúng cái slide này — và vì một lập luận thiết kế mà bạn không trình bày lại được một cách công bằng thì bạn chưa thật sự hiểu nó.</li>
</ul>
<p class="meo">💡 Nén slide thành một khẩu hiệu cộng câu phản bác: <strong>CISC nói "ít lệnh hơn, giàu hơn"; chương trả lời "ít LỆNH không có nghĩa là ít BYTE ĐƯỢC CHUYỂN".</strong> Slide 20 là nơi câu trả lời đó thành phép tính.</p>
<p class="pitfall">⚠️ Bẫy: slide này <em>KHÔNG</em> phải danh sách NHƯỢC ĐIỂM của CISC. Mọi gạch đầu dòng trên đó đều là một <strong>ƯU ĐIỂM</strong> được tuyên bố. Đề đôi khi trích một dòng ở đây rồi hỏi "đây là lập luận của RISC hay CISC?" — mọi thứ trên slide 16 đều là CISC.</p>`],

      [17, 'Table 17.6 — Code Size Relative to RISC I',
        `<p class="y-chinh">🎯 The experiment that kills the CISC argument. If complex instructions really made programs much smaller, the numbers here would be 0,3 or 0,4. They are not. They hover around <strong>0,7 to 1,2</strong> — and one CISC machine is actually <em>bigger</em> than RISC I.</p>
<table>
<tr><th>Machine</th><th>[PATT82a] 11 C programs</th><th>[KATE83] 12 C programs</th><th>[HEAT84] 5 C programs</th></tr>
<tr><td><strong>RISC I</strong></td><td>1.0</td><td>1.0</td><td>1.0</td></tr>
<tr><td>VAX-11/780</td><td>0.8</td><td>0.67</td><td><em>(blank)</em></td></tr>
<tr><td>M68000</td><td>0.9</td><td><em>(blank)</em></td><td>0.9</td></tr>
<tr><td>Z8002</td><td><strong>1.2</strong></td><td><em>(blank)</em></td><td><strong>1.12</strong></td></tr>
<tr><td>PDP-11/70</td><td>0.9</td><td>0.71</td><td><em>(blank)</em></td></tr>
</table>
<p class="nhan">📐 How to read the numbers. RISC I is the baseline 1.0 in all three studies. A value below 1.0 means <em>that machine's code is smaller than RISC I's</em>. So 0.8 for the VAX means the VAX version was 80% the size — i.e. RISC I was 1/0,8 = <strong>1,25× bigger</strong>. All conversions below were computed with python3.</p>
<table>
<tr><th>Machine</th><th>Study</th><th>Its size vs RISC I</th><th>RISC I's penalty</th></tr>
<tr><td>VAX-11/780</td><td>PATT82a</td><td>0,80</td><td>+25,0%</td></tr>
<tr><td>VAX-11/780</td><td>KATE83</td><td>0,67</td><td>+49,3%</td></tr>
<tr><td>M68000</td><td>PATT82a / HEAT84</td><td>0,90 / 0,90</td><td>+11,1%</td></tr>
<tr><td>PDP-11/70</td><td>PATT82a</td><td>0,90</td><td>+11,1%</td></tr>
<tr><td>PDP-11/70</td><td>KATE83</td><td>0,71</td><td>+40,8%</td></tr>
<tr><td>Z8002</td><td>PATT82a / HEAT84</td><td>1,20 / 1,12</td><td><strong>−16,7% / −10,7% (RISC I is SMALLER)</strong></td></tr>
</table>
<p class="dap-an">✅ The conclusion, stated as the chapter states it. CISC code is typically <strong>10–33% smaller</strong> than RISC code (worst case, the VAX under KATE83, about a third smaller). It is <em>not</em> two or three times smaller, which is what the "one complex instruction replaces several simple ones" story would predict. And against the Z8002, RISC I code is <em>smaller</em>. So the central CISC promise — dramatically denser code — is simply not delivered, while every cost of getting it (variable-length instructions, 22 addressing modes, 480 kbits of microcode) is paid in full.</p>
<ul>
<li><strong>Why CISC density is so much worse than advertised.</strong> Complex instructions need long operand specifiers: a VAX instruction that names three memory operands must carry three full addresses. RISC's instructions are simple, but they name registers in 5 bits. Simplicity buys back most of what complexity spends.</li>
<li><strong>Note the three separate studies, and that they disagree.</strong> The VAX comes out at 0,8 in one and 0,67 in another. Different program sets, different compilers, different years. The chapter shows all three <em>precisely so that you do not treat any single figure as exact</em> — the honest claim is "roughly comparable", and that is enough to defeat the CISC argument.</li>
<li><strong>The blanks are missing measurements, not zeros.</strong> KATE83 did not measure the M68000 or Z8002; HEAT84 did not measure the VAX or PDP-11/70. Do not average across a row as if the blanks were data.</li>
<li><strong>Connect it back to slide 16's three sub-reasons.</strong> "Fewer instruction bytes to be fetched" — true but by only 10–33%. "Fewer page faults" and "more fits in cache" — real, but proportional to that same small difference. Meanwhile slide 20 shows the data traffic moving in the opposite direction by a factor of 7,6.</li>
<li><strong>The historical footnote worth knowing.</strong> RISC I was a university project built by graduate students with a compiler far less mature than DEC's. That it came within 25% of the VAX on code size, while being simpler and faster, is the reason the industry took the idea seriously.</li>
</ul>
<p class="meo">💡 The number to memorise: <strong>CISC code is around 10–33% smaller, not several times smaller.</strong> Any exam answer claiming "RISC programs are much larger" is contradicted by this very table.</p>
<p class="pitfall">⚠️ Direction trap. The table is "code size <em>relative to</em> RISC I", so <strong>smaller number = smaller code = better density for that machine</strong>. Students routinely invert it and conclude the VAX had the bigger programs. Read the title, then read 0.8 as "80% of RISC I".</p>`,
        `<p class="y-chinh">🎯 Thí nghiệm giết chết lập luận của CISC. Nếu lệnh phức thật sự làm chương trình nhỏ hơn hẳn thì các con số ở đây phải là 0,3 hay 0,4. Không hề. Chúng quanh quẩn <strong>0,7 tới 1,2</strong> — và có một cỗ máy CISC thậm chí còn <em>TO HƠN</em> RISC I.</p>
<table>
<tr><th>Máy</th><th>[PATT82a] 11 chương trình C</th><th>[KATE83] 12 chương trình C</th><th>[HEAT84] 5 chương trình C</th></tr>
<tr><td><strong>RISC I</strong></td><td>1.0</td><td>1.0</td><td>1.0</td></tr>
<tr><td>VAX-11/780</td><td>0.8</td><td>0.67</td><td><em>(trống)</em></td></tr>
<tr><td>M68000</td><td>0.9</td><td><em>(trống)</em></td><td>0.9</td></tr>
<tr><td>Z8002</td><td><strong>1.2</strong></td><td><em>(trống)</em></td><td><strong>1.12</strong></td></tr>
<tr><td>PDP-11/70</td><td>0.9</td><td>0.71</td><td><em>(trống)</em></td></tr>
</table>
<p class="nhan">📐 Cách đọc con số. RISC I là mốc 1.0 ở cả ba nghiên cứu. Giá trị NHỎ hơn 1.0 nghĩa là <em>mã của máy đó NHỎ hơn mã của RISC I</em>. Vậy 0,8 cho VAX nghĩa là bản VAX chỉ bằng 80% kích thước — tức RISC I lớn hơn 1/0,8 = <strong>1,25 lần</strong>. Mọi phép quy đổi dưới đây tính bằng python3.</p>
<table>
<tr><th>Máy</th><th>Nghiên cứu</th><th>Kích thước so với RISC I</th><th>Phần RISC I phải chịu thêm</th></tr>
<tr><td>VAX-11/780</td><td>PATT82a</td><td>0,80</td><td>+25,0%</td></tr>
<tr><td>VAX-11/780</td><td>KATE83</td><td>0,67</td><td>+49,3%</td></tr>
<tr><td>M68000</td><td>PATT82a / HEAT84</td><td>0,90 / 0,90</td><td>+11,1%</td></tr>
<tr><td>PDP-11/70</td><td>PATT82a</td><td>0,90</td><td>+11,1%</td></tr>
<tr><td>PDP-11/70</td><td>KATE83</td><td>0,71</td><td>+40,8%</td></tr>
<tr><td>Z8002</td><td>PATT82a / HEAT84</td><td>1,20 / 1,12</td><td><strong>−16,7% / −10,7% (RISC I NHỎ HƠN)</strong></td></tr>
</table>
<p class="dap-an">✅ Kết luận, phát biểu đúng như chương phát biểu. Mã CISC thường <strong>nhỏ hơn 10–33%</strong> so với mã RISC (trường hợp tệ nhất là VAX theo KATE83, nhỏ hơn khoảng một phần ba). Nó <em>KHÔNG</em> nhỏ hơn hai ba lần, mà đó mới là điều mà câu chuyện "một lệnh phức thay được mấy lệnh đơn" dự đoán. Còn so với Z8002 thì mã RISC I lại <em>NHỎ HƠN</em>. Vậy lời hứa trung tâm của CISC — mã đặc hơn hẳn — đơn giản là KHÔNG được thực hiện, trong khi mọi cái giá để đổi lấy nó (lệnh độ dài thay đổi, 22 chế độ địa chỉ, 480 kbit vi chương trình) thì vẫn trả đủ.</p>
<ul>
<li><strong>Vì sao mật độ mã của CISC tệ hơn quảng cáo nhiều đến thế.</strong> Lệnh phức cần phần chỉ định toán hạng DÀI: một lệnh VAX gọi tên ba toán hạng bộ nhớ phải mang theo ba địa chỉ đầy đủ. Lệnh của RISC thì đơn giản, nhưng nó gọi tên thanh ghi chỉ bằng 5 bit. Sự đơn giản lấy lại được phần lớn những gì sự phức tạp tiêu đi.</li>
<li><strong>Để ý BA nghiên cứu riêng biệt, và chúng KHÔNG khớp nhau.</strong> VAX ra 0,8 ở nghiên cứu này và 0,67 ở nghiên cứu kia. Khác bộ chương trình, khác trình biên dịch, khác năm. Chương trưng cả ba <em>chính là để bạn đừng coi con số lẻ nào là chính xác</em> — khẳng định trung thực là "xấp xỉ ngang nhau", và chừng đó đã đủ đánh bại lập luận CISC.</li>
<li><strong>Ô trống là PHÉP ĐO KHÔNG CÓ, không phải số 0.</strong> KATE83 không đo M68000 hay Z8002; HEAT84 không đo VAX hay PDP-11/70. Đừng lấy trung bình cả hàng như thể ô trống là dữ liệu.</li>
<li><strong>Nối ngược về ba lý do phụ của slide 16.</strong> "Ít byte lệnh phải nạp" — đúng, nhưng chỉ 10–33%. "Ít lỗi trang" và "vừa cache hơn" — có thật, nhưng tỉ lệ với đúng cái chênh lệch bé đó. Trong khi đó slide 20 cho thấy lưu lượng DỮ LIỆU chạy theo chiều NGƯỢC LẠI với hệ số 7,6.</li>
<li><strong>Ghi chú lịch sử đáng biết.</strong> RISC I là một dự án đại học do nghiên cứu sinh dựng, với trình biên dịch non hơn của DEC rất nhiều. Việc nó tiến tới trong vòng 25% so với VAX về kích thước mã, trong khi đơn giản hơn và nhanh hơn, chính là lý do ngành công nghiệp bắt đầu xem ý tưởng này là nghiêm túc.</li>
</ul>
<p class="meo">💡 Con số cần thuộc: <strong>mã CISC nhỏ hơn khoảng 10–33%, chứ không phải nhỏ hơn mấy lần.</strong> Câu trả lời thi nào bảo "chương trình RISC lớn hơn rất nhiều" thì bị chính cái bảng này bác bỏ.</p>
<p class="pitfall">⚠️ Bẫy CHIỀU. Bảng là "kích thước mã <em>SO VỚI</em> RISC I", nên <strong>số càng NHỎ = mã càng NHỎ = mật độ càng TỐT cho máy đó</strong>. Sinh viên hay lộn ngược rồi kết luận VAX có chương trình lớn hơn. Đọc tiêu đề trước, rồi đọc 0.8 thành "bằng 80% của RISC I".</p>`],

      [18, 'Characteristics of Reduced Instruction Set Architectures (1 of 2) — the four rules',
        `<p class="y-chinh">🎯 The definition of RISC, finally stated as a list. Four boxes, each with its own justification printed beside it. ⚠️ The .pptx text extraction returned only the title for this slide — everything below was read from the rendered image.</p>
<table>
<tr><th>Characteristic</th><th>The slide's justification, verbatim</th></tr>
<tr><td><strong>One machine instruction per machine cycle</strong></td><td><em>Machine cycle</em> — the time it takes to fetch two operands from registers, perform an ALU operation, and store the result in a register</td></tr>
<tr><td><strong>Register-to-register operations</strong></td><td>Only simple LOAD and STORE operations accessing memory · this simplifies the instruction set and therefore the control unit</td></tr>
<tr><td><strong>Simple addressing modes</strong></td><td>Simplifies the instruction set and the control unit</td></tr>
<tr><td><strong>Simple instruction formats</strong></td><td>Generally only one or a few formats are used · instruction length is fixed and aligned on word boundaries · opcode decoding and register operand accessing can occur simultaneously</td></tr>
</table>
<ul>
<li><strong>Read the definition of "machine cycle" carefully — it is doing a lot of work.</strong> A machine cycle is <em>register read → ALU → register write</em>. Notice what is absent: no memory access. That single definition forces everything else on the slide: if an instruction may not take longer than that, it may not touch memory, so memory access must be isolated into LOAD/STORE.</li>
<li><strong>"Register-to-register operations" is the load/store architecture, and it is the heart of RISC.</strong> Combine it with Table 17.3 (75% of operand references are scalars and constants) and Table 17.5 (multiple register operands per cycle) and it stops looking like a restriction and starts looking like a match to what programs actually do.</li>
<li><strong>The last bullet of the fourth box is the best single line on the slide.</strong> "Opcode decoding and register operand accessing can occur <em>simultaneously</em>" — because the register field is always in the same bit positions, the hardware can start reading registers <em>before</em> it knows what the instruction is. On a variable-format machine you must decode first, then find the operands: two serial steps instead of one parallel one. That is worth an entire pipeline stage.</li>
<li><strong>"Aligned on word boundaries" is not a detail either.</strong> If every instruction starts at a multiple of 4, the address of instruction <em>n+1</em> is just PC + 4 — computable before instruction <em>n</em> is even decoded. Combine with the fixed length and the fetch unit can run far ahead of execution, which is the prerequisite for the pipelining of slides 22–26.</li>
<li><strong>Notice the repeated phrase "simplifies … the control unit".</strong> It appears in two of the four boxes. That is the dash in Table 17.1's control-memory row: no microcode, hardwired control, silicon freed for registers. The four characteristics are not independent — they all converge on the same simplification.</li>
</ul>
<p class="meo">💡 Four rules, four words: <strong>ONE cycle · REGISTERS only · ONE addressing mode · ONE format.</strong> Every RISC feature you will meet in the rest of the deck is a consequence of one of these four.</p>
<p class="pitfall">⚠️ Trap: "one machine instruction per machine cycle" does <strong>not</strong> mean an instruction finishes in one cycle. In a pipeline an instruction takes several cycles from start to finish; what the rule promises is a <em>throughput</em> of one per cycle. Slide 22 (Figure 17.6) draws exactly that distinction.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa của RISC, cuối cùng cũng được phát biểu thành danh sách. Bốn khối, mỗi khối kèm lý lẽ riêng in ngay bên cạnh. ⚠️ Bản trích chữ từ .pptx chỉ trả về TIÊU ĐỀ cho slide này — mọi thứ dưới đây đọc từ ảnh render.</p>
<table>
<tr><th>Đặc điểm</th><th>Lý lẽ trên slide, nguyên văn</th></tr>
<tr><td><strong>Một lệnh máy mỗi CHU KỲ MÁY</strong></td><td><em>Chu kỳ máy</em> — khoảng thời gian cần để LẤY HAI TOÁN HẠNG TỪ THANH GHI, thực hiện một phép ALU, và CẤT KẾT QUẢ VÀO MỘT THANH GHI</td></tr>
<tr><td><strong>Phép toán thanh-ghi-tới-thanh-ghi</strong></td><td>Chỉ có LOAD và STORE đơn giản là truy cập bộ nhớ · điều này làm đơn giản tập lệnh, và do đó đơn giản cả khối điều khiển</td></tr>
<tr><td><strong>Chế độ địa chỉ đơn giản</strong></td><td>Làm đơn giản tập lệnh và khối điều khiển</td></tr>
<tr><td><strong>Khuôn dạng lệnh đơn giản</strong></td><td>Thường chỉ dùng một hoặc vài khuôn dạng · độ dài lệnh CỐ ĐỊNH và canh theo biên TỪ (word) · việc giải mã mã lệnh và việc truy cập toán hạng thanh ghi có thể diễn ra ĐỒNG THỜI</td></tr>
</table>
<ul>
<li><strong>Đọc kỹ định nghĩa "chu kỳ máy" — nó gánh rất nhiều việc.</strong> Một chu kỳ máy là <em>đọc thanh ghi → ALU → ghi thanh ghi</em>. Để ý thứ VẮNG MẶT: không có truy cập bộ nhớ. Chỉ riêng định nghĩa đó ép ra mọi thứ còn lại trên slide: nếu một lệnh không được phép lâu hơn chừng ấy thì nó không được chạm bộ nhớ, nên truy cập bộ nhớ buộc phải bị cô lập vào LOAD/STORE.</li>
<li><strong>"Phép toán thanh-ghi-tới-thanh-ghi" chính là kiến trúc load/store, và là TRÁI TIM của RISC.</strong> Ghép nó với Table 17.3 (75% tham chiếu toán hạng là biến vô hướng và hằng số) cùng Table 17.5 (nhiều toán hạng thanh ghi mỗi chu kỳ) thì nó thôi trông giống một sự HẠN CHẾ mà bắt đầu trông giống một sự KHỚP với thứ chương trình thật sự làm.</li>
<li><strong>Gạch đầu dòng cuối của khối thứ tư là câu hay nhất trên slide.</strong> "Giải mã mã lệnh và truy cập toán hạng thanh ghi có thể diễn ra <em>ĐỒNG THỜI</em>" — vì trường thanh ghi luôn nằm ở CÙNG những vị trí bit, phần cứng có thể bắt đầu đọc thanh ghi <em>TRƯỚC KHI</em> nó biết đây là lệnh gì. Trên máy khuôn dạng thay đổi thì bạn phải giải mã trước rồi mới tìm được toán hạng: hai bước NỐI TIẾP thay vì một bước SONG SONG. Cái đó đáng giá nguyên một tầng pipeline.</li>
<li><strong>"Canh theo biên từ" cũng không phải chi tiết vặt.</strong> Nếu mọi lệnh bắt đầu ở bội số của 4 thì địa chỉ lệnh <em>n+1</em> chỉ là PC + 4 — tính được trước khi lệnh <em>n</em> kịp giải mã. Ghép với độ dài cố định thì khối nạp lệnh chạy trước khối thực thi rất xa, và đó là điều kiện tiên quyết cho phần pipeline của slide 22–26.</li>
<li><strong>Để ý cụm lặp lại "làm đơn giản … khối điều khiển".</strong> Nó xuất hiện ở hai trong bốn khối. Đó chính là DẤU GẠCH ở dòng bộ nhớ điều khiển của Table 17.1: không vi chương trình, điều khiển đi dây cứng, silicon giải phóng ra làm thanh ghi. Bốn đặc điểm KHÔNG độc lập với nhau — cả bốn đều hội tụ về cùng một sự đơn giản hoá.</li>
</ul>
<p class="meo">💡 Bốn luật, bốn chữ: <strong>MỘT chu kỳ · chỉ THANH GHI · MỘT chế độ địa chỉ · MỘT khuôn dạng.</strong> Mọi đặc tính RISC bạn gặp ở phần còn lại của deck đều là hệ quả của một trong bốn cái này.</p>
<p class="pitfall">⚠️ Bẫy: "một lệnh máy mỗi chu kỳ máy" <strong>KHÔNG</strong> có nghĩa là một lệnh XONG trong một chu kỳ. Trong pipeline, một lệnh đi từ đầu tới cuối mất vài chu kỳ; thứ mà luật này hứa là <em>THÔNG LƯỢNG</em> một lệnh mỗi chu kỳ. Slide 22 (Figure 17.6) vẽ đúng sự phân biệt đó.</p>`],

      [19, 'Characteristics of Reduced Instruction Set Architectures (2 of 2) — "Circumstantial Evidence"',
        `<p class="y-chinh">🎯 The word in quotation marks is doing the work: <strong>"Circumstantial Evidence"</strong>. The slide is openly admitting that these four arguments are <em>plausible reasoning, not measurement</em> — unlike Tables 17.2–17.4 and 17.6, which were experiments. Honest framing, and worth copying in your own technical writing.</p>
<table>
<tr><th>Argument</th><th>The slide's supporting line</th></tr>
<tr><td>More effective optimizing compilers can be developed</td><td>With more primitive instructions there are more opportunities for moving functions out of loops, reorganizing code for efficiency and maximizing register utilization · it is even possible to compute parts of complex instructions at compile time</td></tr>
<tr><td>Most instructions generated by a compiler are relatively simple anyway</td><td>It would seem reasonable that a control unit built specifically for those instructions and using little or no microcode could execute them faster than a comparable CISC</td></tr>
<tr><td>Instruction pipelining can be applied much more effectively with a reduced instruction set</td><td>(stated as the RISC researchers' position)</td></tr>
<tr><td>RISC processors are more responsive to interrupts</td><td>Interrupts are checked between rather elementary operations · architectures with complex instructions either restrict interrupts to instruction boundaries or must refine specific interruptible points and implement mechanisms for restarting an instruction</td></tr>
</table>
<ul>
<li><strong>Argument 1 is the direct answer to slide 16's "simplify compilers".</strong> CISC said a rich instruction set helps the compiler. This says the opposite and explains why: an optimiser works by <em>rearranging</em> code, and you can only rearrange pieces you can take apart. A single complex instruction is an atom the optimiser cannot move half of out of a loop.</li>
<li><strong>"Compute parts of complex instructions at compile time" is the sharpest version of that point.</strong> If a complex instruction internally computes an address, a bound check and an increment, the compiler may already know two of the three at compile time — but it cannot tell the hardware to skip them. With primitives it simply does not emit them.</li>
<li><strong>Argument 2 is a measurement dressed as reasoning.</strong> "Most instructions generated by a compiler are relatively simple anyway" was observed, not assumed — compilers generate loads, stores, adds and branches, and leave the exotic instructions unused. If 90% of the silicon serves 10% of the instructions, remove it and make the 90% faster.</li>
<li><strong>Argument 4 is the one students forget, and it is the most concrete.</strong> Interrupt latency: a CISC instruction that moves a 64 kB string cannot simply be abandoned mid-way, so the machine must either make interrupts wait for it (bad latency) or build a mechanism to <em>restart a partially executed instruction</em> (complex hardware, and a documented source of bugs). RISC instructions are short, so the machine is never far from a safe stopping point.</li>
<li><strong>Connect argument 3 forward.</strong> "Pipelining can be applied much more effectively" is asserted here and <em>proved</em> on slides 22–26 with Figure 17.6 and Table 17.8. That is the structure of the deck: state it as circumstantial evidence, then demonstrate it.</li>
<li><strong>Connect argument 4 back to Ch.3 and Ch.16.</strong> The interrupt cycle you learned in Ch.3 assumes the processor checks for interrupts at the end of each instruction. The shorter and more uniform the instruction, the tighter that check — which is a real-time systems argument, not just a performance one.</li>
</ul>
<p class="meo">💡 Four arguments, four keywords: <strong>COMPILER · SIMPLICITY · PIPELINE · INTERRUPTS.</strong> Combine with slide 18's four rules and you have everything an exam can ask about "characteristics of RISC".</p>
<p class="pitfall">⚠️ Trap: do not present these as proven facts. The slide itself calls them circumstantial. The <em>measured</em> claims of this chapter are Tables 17.2, 17.3, 17.4, 17.6 and Figure 17.5 — know which is which, because a good question will ask you to distinguish evidence from argument.</p>`,
        `<p class="y-chinh">🎯 Cụm chữ trong ngoặc kép mới là thứ gánh việc: <strong>"Circumstantial Evidence" — bằng chứng GIÁN TIẾP</strong>. Slide đang công khai thừa nhận rằng bốn lập luận này là <em>suy luận hợp lý, KHÔNG phải phép đo</em> — khác với Table 17.2–17.4 và 17.6 vốn là thí nghiệm. Cách trình bày trung thực, đáng học theo khi bạn viết kỹ thuật.</p>
<table>
<tr><th>Lập luận</th><th>Dòng chống đỡ trên slide</th></tr>
<tr><td>Có thể phát triển trình biên dịch tối ưu HIỆU QUẢ HƠN</td><td>Với lệnh nguyên thuỷ hơn thì có NHIỀU CƠ HỘI HƠN để đưa phần việc RA KHỎI vòng lặp, sắp xếp lại mã cho hiệu quả và tối đa hoá việc dùng thanh ghi · thậm chí có thể TÍNH TRƯỚC LÚC BIÊN DỊCH một phần của các lệnh phức</td></tr>
<tr><td>Dù sao thì phần lớn lệnh do trình biên dịch sinh ra cũng KHÁ ĐƠN GIẢN</td><td>Có vẻ hợp lý rằng một khối điều khiển dựng RIÊNG cho những lệnh đó, dùng ít hoặc không dùng vi chương trình, sẽ chạy chúng NHANH HƠN một máy CISC tương đương</td></tr>
<tr><td>Kỹ thuật pipeline lệnh áp dụng HIỆU QUẢ HƠN NHIỀU với tập lệnh rút gọn</td><td>(nêu như quan điểm của giới nghiên cứu RISC)</td></tr>
<tr><td>Bộ xử lý RISC ĐÁP ỨNG NGẮT nhanh nhạy hơn</td><td>Ngắt được kiểm tra GIỮA các thao tác khá sơ cấp · kiến trúc có lệnh phức thì hoặc phải hạn chế ngắt ở biên lệnh, hoặc phải xác định tỉ mỉ các điểm ngắt được và cài cơ chế KHỞI ĐỘNG LẠI một lệnh</td></tr>
</table>
<ul>
<li><strong>Lập luận 1 là câu trả lời trực diện cho "làm đơn giản trình biên dịch" của slide 16.</strong> CISC bảo tập lệnh phong phú giúp trình biên dịch. Câu này nói ngược lại và giải thích vì sao: bộ tối ưu làm việc bằng cách <em>SẮP XẾP LẠI</em> mã, mà bạn chỉ sắp xếp lại được những mảnh bạn TÁCH RỜI ĐƯỢC. Một lệnh phức duy nhất là một NGUYÊN TỬ mà bộ tối ưu không thể đưa một nửa của nó ra khỏi vòng lặp.</li>
<li><strong>"Tính trước lúc biên dịch một phần của lệnh phức" là phiên bản sắc nhất của ý đó.</strong> Nếu một lệnh phức bên trong nó tính địa chỉ, kiểm tra biên và tăng chỉ số, thì trình biên dịch có thể đã BIẾT hai trong ba việc ngay lúc biên dịch — mà nó không có cách nào bảo phần cứng BỎ QUA chúng. Với lệnh nguyên thuỷ thì nó đơn giản là KHÔNG phát ra những lệnh đó.</li>
<li><strong>Lập luận 2 thật ra là một phép ĐO khoác áo suy luận.</strong> "Dù sao phần lớn lệnh trình biên dịch sinh ra cũng khá đơn giản" là điều được QUAN SÁT chứ không phải giả định — trình biên dịch sinh ra load, store, add và rẽ nhánh, còn bỏ không các lệnh dị. Nếu 90% silicon phục vụ 10% số lệnh thì hãy gỡ nó đi và làm cho 90% kia chạy nhanh hơn.</li>
<li><strong>Lập luận 4 là cái sinh viên hay quên, mà lại cụ thể nhất.</strong> ĐỘ TRỄ NGẮT: một lệnh CISC chép chuỗi 64 kB thì không thể bỏ dở giữa chừng, nên máy hoặc phải bắt NGẮT ĐỢI nó (trễ tệ), hoặc phải dựng cơ chế <em>KHỞI ĐỘNG LẠI một lệnh đã chạy dở</em> (phần cứng phức tạp, và là một nguồn lỗi có ghi nhận). Lệnh RISC thì ngắn, nên máy không bao giờ ở xa một điểm dừng an toàn.</li>
<li><strong>Nối lập luận 3 về phía trước.</strong> "Pipeline áp dụng hiệu quả hơn nhiều" được KHẲNG ĐỊNH ở đây và được <em>CHỨNG MINH</em> ở slide 22–26 bằng Figure 17.6 và Table 17.8. Đó là cấu trúc của cả deck: nêu ra như bằng chứng gián tiếp, rồi chứng minh.</li>
<li><strong>Nối lập luận 4 về Ch.3 và Ch.16.</strong> Chu trình ngắt bạn học ở Ch.3 giả định bộ xử lý kiểm tra ngắt ở CUỐI mỗi lệnh. Lệnh càng ngắn và càng đều thì phép kiểm đó càng sít sao — đây là lập luận cho hệ THỜI GIAN THỰC, không chỉ cho hiệu năng.</li>
</ul>
<p class="meo">💡 Bốn lập luận, bốn từ khoá: <strong>TRÌNH BIÊN DỊCH · ĐƠN GIẢN · PIPELINE · NGẮT.</strong> Ghép với bốn luật của slide 18 là bạn có đủ mọi thứ đề thi hỏi được về "đặc điểm của RISC".</p>
<p class="pitfall">⚠️ Bẫy: đừng trình bày những điều này như SỰ THẬT ĐÃ CHỨNG MINH. Chính slide gọi chúng là bằng chứng gián tiếp. Những khẳng định ĐO ĐƯỢC của chương là Table 17.2, 17.3, 17.4, 17.6 và Figure 17.5 — phải phân biệt được cái nào là cái nào, vì một câu hỏi hay sẽ bắt bạn tách bằng chứng khỏi lập luận.</p>`],

      [20, 'Figure 17.5 — Two Comparisons of Register-to-Register and Memory-to-Memory Approaches',
        `<p class="y-chinh">🎯 The arithmetic that finishes the CISC argument. The figure encodes the <em>same computation</em> two ways and counts bytes, using three quantities defined at the bottom of the slide: <strong>I</strong> = number of bytes occupied by executed instructions, <strong>D</strong> = number of bytes occupied by data, <strong>M</strong> = total memory traffic = I + D.</p>
<p class="nhan">📐 Part (a), the single statement <strong>A ← B + C</strong>. Memory-to-memory: one instruction, fields of 8 · 16 · 16 · 16 bits = 56 bits. Register-to-memory: four instructions — <code>Load RB, B</code> / <code>Load RC, B</code> / <code>Add RA, RB, RC</code> / <code>Store RA, A</code> with fields 8 · 4 · 16 = 28 bits for the loads and store and 8 · 4 · 4 · 4 = 20 bits for the add.</p>
<table>
<tr><th>Approach</th><th>I</th><th>D</th><th>M = I + D</th></tr>
<tr><td>Memory to memory</td><td>56</td><td>96</td><td><strong>152</strong></td></tr>
<tr><td>Register to memory</td><td>104</td><td>96</td><td><strong>200</strong></td></tr>
</table>
<p class="nhan">📐 Part (b), three statements: <strong>A ← B + C; B ← A + C; D ← D − B</strong>. Memory-to-memory needs three 56-bit instructions. Register-to-register needs three 20-bit instructions — <code>Add RA, RB, RC</code> / <code>Add RB, RA, RC</code> / <code>Sub RD, RD, RB</code> — with every operand already in a register.</p>
<table>
<tr><th>Approach</th><th>I</th><th>D</th><th>M = I + D</th></tr>
<tr><td>Memory to memory</td><td>168</td><td>288</td><td><strong>456</strong></td></tr>
<tr><td>Register to register</td><td>60</td><td><strong>0</strong></td><td><strong>60</strong></td></tr>
</table>
<p class="dap-an">✅ Every number verified with python3. Part (a): 8+16+16+16 = 56 ✓, and 3 operands × 32 bits = 96 ✓, so M = 152 ✓; the register-to-memory version is 28+28+20+28 = 104 ✓, M = 200 ✓. Part (b): 3 × 56 = 168 ✓, 3 × 96 = 288 ✓, M = 456 ✓; register-to-register is 3 × 20 = 60 ✓ with D = 0 ✓. <strong>The decisive ratio is 456 ÷ 60 = 7,6×</strong> — the memory-to-memory version moves seven and a half times as many bits for identical work. Note also that in part (a) the CISC form actually <em>wins</em> (152 versus 200): with a single isolated statement there is nothing in a register to reuse.</p>
<ul>
<li><strong>Part (a) versus part (b) is the whole lesson, and the chapter shows both on purpose.</strong> One statement in isolation favours memory-to-memory. Three statements <em>that share operands</em> favour registers overwhelmingly, because A, B, C and D stay in registers across the statements and never touch memory again. Real programs are part (b), not part (a).</li>
<li><strong>Where the 7,6× comes from — read the D column.</strong> I only falls from 168 to 60 (2,8×), but D collapses from 288 to <strong>zero</strong>. The saving is not in fetching fewer instructions; it is in <em>not moving the data at all</em>. That is the direct refutation of slide 16's "fewer instruction bytes to be fetched" argument, which counted only I.</li>
<li><strong>Connect to Ch.4 and make it a time.</strong> 456 bits versus 60 bits is 57 bytes versus 7,5 bytes of traffic. Every one of those memory accesses is a chance to miss the cache — at 100 ns per miss, the difference is not academic. This is also why Table 17.5's row 6 (multiple operands per cycle) matters: the register version needs two operands at once, and only a register file can supply them.</li>
<li><strong>Look at the field widths and you see Table 17.1 again.</strong> A memory operand costs 16 bits in the instruction; a register operand costs 4. That is why the register-to-register instruction is 20 bits while the memory-to-memory one is 56 — and why RISC can hold instructions to a fixed 4 bytes while the VAX cannot.</li>
<li><strong>Honest note about the slide.</strong> The second line of part (a) is printed <code>Load RC, B</code> — it must be <code>Load RC, C</code> for the computation A ← B + C to be correct. It is a typo in the figure; the I, D and M totals on the slide are unaffected and correct. Do not copy the typo, and do not "fix" the arithmetic to match it.</li>
</ul>
<p class="meo">💡 One number to carry out of this slide: <strong>7,6×</strong>. And one sentence to go with it: "the saving is in D, not in I." That is the whole register-to-register argument.</p>
<p class="pitfall">⚠️ Trap: quoting part (a) alone as proof that RISC is worse (200 &gt; 152). It <em>is</em> worse for one isolated statement — the chapter prints that honestly. The claim being made is about sequences of statements that share operands, which is what compilers actually emit.</p>`,
        `<p class="y-chinh">🎯 Phép tính khép lại cuộc tranh luận với CISC. Hình mã hoá <em>CÙNG MỘT phép tính</em> theo hai cách rồi đếm byte, dùng ba đại lượng định nghĩa ở chân slide: <strong>I</strong> = số byte do các lệnh đã thực thi chiếm, <strong>D</strong> = số byte do dữ liệu chiếm, <strong>M</strong> = tổng lưu lượng bộ nhớ = I + D.</p>
<p class="nhan">📐 Phần (a), một câu lệnh duy nhất <strong>A ← B + C</strong>. Bộ-nhớ-tới-bộ-nhớ: một lệnh, các trường 8 · 16 · 16 · 16 bit = 56 bit. Thanh-ghi-tới-bộ-nhớ: bốn lệnh — <code>Load RB, B</code> / <code>Load RC, B</code> / <code>Add RA, RB, RC</code> / <code>Store RA, A</code> với các trường 8 · 4 · 16 = 28 bit cho load và store, và 8 · 4 · 4 · 4 = 20 bit cho lệnh add.</p>
<table>
<tr><th>Cách làm</th><th>I</th><th>D</th><th>M = I + D</th></tr>
<tr><td>Bộ nhớ tới bộ nhớ</td><td>56</td><td>96</td><td><strong>152</strong></td></tr>
<tr><td>Thanh ghi tới bộ nhớ</td><td>104</td><td>96</td><td><strong>200</strong></td></tr>
</table>
<p class="nhan">📐 Phần (b), ba câu lệnh: <strong>A ← B + C; B ← A + C; D ← D − B</strong>. Bộ-nhớ-tới-bộ-nhớ cần ba lệnh 56 bit. Thanh-ghi-tới-thanh-ghi cần ba lệnh 20 bit — <code>Add RA, RB, RC</code> / <code>Add RB, RA, RC</code> / <code>Sub RD, RD, RB</code> — với mọi toán hạng đã sẵn trong thanh ghi.</p>
<table>
<tr><th>Cách làm</th><th>I</th><th>D</th><th>M = I + D</th></tr>
<tr><td>Bộ nhớ tới bộ nhớ</td><td>168</td><td>288</td><td><strong>456</strong></td></tr>
<tr><td>Thanh ghi tới thanh ghi</td><td>60</td><td><strong>0</strong></td><td><strong>60</strong></td></tr>
</table>
<p class="dap-an">✅ Mọi con số đã kiểm bằng python3. Phần (a): 8+16+16+16 = 56 ✓, và 3 toán hạng × 32 bit = 96 ✓, nên M = 152 ✓; bản thanh-ghi-tới-bộ-nhớ là 28+28+20+28 = 104 ✓, M = 200 ✓. Phần (b): 3 × 56 = 168 ✓, 3 × 96 = 288 ✓, M = 456 ✓; thanh-ghi-tới-thanh-ghi là 3 × 20 = 60 ✓ với D = 0 ✓. <strong>Tỉ số quyết định là 456 ÷ 60 = 7,6 lần</strong> — bản bộ-nhớ-tới-bộ-nhớ chuyển gấp bảy rưỡi số bit cho CÙNG một công việc. Cũng để ý: ở phần (a) bản CISC lại <em>THẮNG</em> (152 so với 200): với một câu lệnh đơn độc thì chẳng có gì nằm sẵn trong thanh ghi để tái sử dụng.</p>
<ul>
<li><strong>Phần (a) so với phần (b) mới là toàn bộ bài học, và chương cố ý trưng cả hai.</strong> Một câu lệnh ĐƠN ĐỘC thì bộ-nhớ-tới-bộ-nhớ có lợi. Ba câu lệnh <em>DÙNG CHUNG TOÁN HẠNG</em> thì thanh ghi thắng áp đảo, vì A, B, C, D nằm lại trong thanh ghi xuyên qua các câu lệnh và không chạm bộ nhớ lần nào nữa. Chương trình thật là phần (b), không phải phần (a).</li>
<li><strong>Con số 7,6× đến từ đâu — hãy đọc cột D.</strong> I chỉ giảm từ 168 xuống 60 (2,8 lần), nhưng D sụp từ 288 xuống <strong>KHÔNG</strong>. Khoản tiết kiệm không nằm ở việc nạp ít lệnh hơn; nó nằm ở việc <em>KHÔNG CHUYỂN DỮ LIỆU CHÚT NÀO</em>. Đó là lời bác bỏ trực tiếp lập luận "ít byte lệnh phải nạp hơn" của slide 16, vốn chỉ đếm mỗi I.</li>
<li><strong>Nối sang Ch.4 và đổi nó thành THỜI GIAN.</strong> 456 bit so với 60 bit là 57 byte so với 7,5 byte lưu lượng. Mỗi lần truy cập bộ nhớ trong đó là một cơ hội trượt cache — với 100 ns mỗi lần trượt thì chênh lệch này không hề hàn lâm. Đây cũng là lý do dòng 6 của Table 17.5 (nhiều toán hạng mỗi chu kỳ) quan trọng: bản dùng thanh ghi cần HAI toán hạng cùng lúc, mà chỉ tệp thanh ghi cấp nổi.</li>
<li><strong>Nhìn ĐỘ RỘNG các trường là thấy lại Table 17.1.</strong> Một toán hạng BỘ NHỚ tốn 16 bit trong lệnh; một toán hạng THANH GHI tốn 4 bit. Đó là lý do lệnh thanh-ghi-tới-thanh-ghi chỉ 20 bit trong khi lệnh bộ-nhớ-tới-bộ-nhớ tới 56 — và là lý do RISC giữ được lệnh cố định 4 byte còn VAX thì không.</li>
<li><strong>Ghi chú thành thật về slide.</strong> Dòng thứ hai của phần (a) in là <code>Load RC, B</code> — phải là <code>Load RC, C</code> thì phép tính A ← B + C mới đúng. Đó là LỖI GÕ trong hình; các tổng I, D, M trên slide không bị ảnh hưởng và vẫn đúng. Đừng chép lại lỗi gõ, cũng đừng "sửa" phép tính cho khớp với nó.</li>
</ul>
<p class="meo">💡 Một con số mang ra khỏi slide này: <strong>7,6 lần</strong>. Và một câu đi kèm: "khoản tiết kiệm nằm ở D, không phải ở I." Đó là trọn vẹn lập luận thanh-ghi-tới-thanh-ghi.</p>
<p class="pitfall">⚠️ Bẫy: trích riêng phần (a) để chứng minh RISC tệ hơn (200 &gt; 152). Nó <em>ĐÚNG LÀ</em> tệ hơn cho một câu lệnh đơn độc — chương in ra điều đó một cách trung thực. Khẳng định đang được nêu là về CHUỖI câu lệnh dùng chung toán hạng, mà đó mới là thứ trình biên dịch thật sự phát ra.</p>`],

      [21, 'Table 17.7 — Characteristics of Some Processors',
        `<p class="y-chinh">🎯 The scorecard. Fifteen real processors scored on nine RISC criteria, so you can see <em>how strictly</em> each machine obeys the rules of slide 18 — and discover that the RISC/CISC boundary is a spectrum, not a wall.</p>
<table>
<tr><th>Processor</th><th>Instr. sizes</th><th>Max size (bytes)</th><th>Addr. modes</th><th>Indirect</th><th>Load/store combined with arithmetic</th><th>Max memory operands</th><th>Unaligned allowed</th><th>Max MMU uses</th><th>Int reg bits</th><th>FP reg bits</th></tr>
<tr><td>AMD29000</td><td>1</td><td>4</td><td>1</td><td>no</td><td>no</td><td>1</td><td>no</td><td>1</td><td>8</td><td>3<sup>a</sup></td></tr>
<tr><td>MIPS R2000</td><td>1</td><td>4</td><td>1</td><td>no</td><td>no</td><td>1</td><td>no</td><td>1</td><td>5</td><td>4</td></tr>
<tr><td>SPARC</td><td>1</td><td>4</td><td>2</td><td>no</td><td>no</td><td>1</td><td>no</td><td>1</td><td>5</td><td>4</td></tr>
<tr><td>MC88000</td><td>1</td><td>4</td><td>3</td><td>no</td><td>no</td><td>1</td><td>no</td><td>1</td><td>5</td><td>4</td></tr>
<tr><td>HP PA</td><td>1</td><td>4</td><td>10<sup>a</sup></td><td>no</td><td>no</td><td>1</td><td>no</td><td>1</td><td>5</td><td>4</td></tr>
<tr><td>IBM RT/PC</td><td>2<sup>a</sup></td><td>4</td><td>1</td><td>no</td><td>no</td><td>1</td><td>no</td><td>1</td><td>4<sup>a</sup></td><td>3<sup>a</sup></td></tr>
<tr><td>IBM RS/6000</td><td>1</td><td>4</td><td>4</td><td>no</td><td>no</td><td>1</td><td>yes</td><td>1</td><td>5</td><td>5</td></tr>
<tr><td>Intel i860</td><td>1</td><td>4</td><td>4</td><td>no</td><td>no</td><td>1</td><td>no</td><td>1</td><td>5</td><td>4</td></tr>
<tr><td>IBM 3090</td><td>4</td><td>8</td><td>2<sup>b</sup></td><td>no<sup>b</sup></td><td>yes</td><td>2</td><td>yes</td><td>4</td><td>4</td><td>2</td></tr>
<tr><td>Intel 80486</td><td>12</td><td>12</td><td>15</td><td>no<sup>b</sup></td><td>yes</td><td>2</td><td>yes</td><td>4</td><td>3</td><td>3</td></tr>
<tr><td>NSC 32016</td><td>21</td><td>21</td><td>23</td><td>yes</td><td>yes</td><td>2</td><td>yes</td><td>4</td><td>3</td><td>3</td></tr>
<tr><td>MC68040</td><td>11</td><td>22</td><td>44</td><td>yes</td><td>yes</td><td>2</td><td>yes</td><td>8</td><td>4</td><td>3</td></tr>
<tr><td><strong>VAX</strong></td><td><strong>56</strong></td><td><strong>56</strong></td><td><strong>22</strong></td><td>yes</td><td>yes</td><td><strong>6</strong></td><td>yes</td><td><strong>24</strong></td><td>4</td><td>0</td></tr>
<tr><td>Clipper</td><td>4<sup>a</sup></td><td>8<sup>a</sup></td><td>9<sup>a</sup></td><td>no</td><td>no</td><td>1</td><td>no</td><td>2</td><td>4<sup>a</sup></td><td>3<sup>a</sup></td></tr>
<tr><td>Intel 80960</td><td>2<sup>a</sup></td><td>8<sup>a</sup></td><td>9<sup>a</sup></td><td>no</td><td>no</td><td>1</td><td>yes<sup>a</sup></td><td>–</td><td>5</td><td>3<sup>a</sup></td></tr>
</table>
<p class="nhan">📐 The footnotes are the point of the table: <strong>a = a RISC that does <em>not</em> conform to this characteristic</strong>; <strong>b = a CISC that <em>does</em> conform</strong>. (The slide prints "RISC hat does not conform" — a typo for "RISC that".) Reading the superscripts tells you where the boundary is fuzzy.</p>
<p class="dap-an">✅ Tallied with python3 over the 10 RISC rows and the 5 CISC rows (IBM 3090, 80486, NSC 32016, MC68040, VAX). Among the RISC machines: <strong>zero</strong> support indirect addressing, <strong>zero</strong> combine load/store with arithmetic, and <strong>all ten</strong> allow at most 1 memory operand — those three rules are obeyed without exception. The deviations are all elsewhere: IBM RT/PC, Clipper and Intel 80960 have more than one instruction size; HP PA (10), Clipper (9) and 80960 (9) have many addressing modes; RS/6000 and 80960 allow unaligned access. Among the CISC machines: <strong>all five</strong> combine load/store with arithmetic, <strong>all five</strong> allow ≥ 2 memory operands, and <strong>all five</strong> need ≥ 4 MMU uses per instruction.</p>
<ul>
<li><strong>The three inviolable rules, read straight off the tally.</strong> No indirect addressing, no memory operands inside arithmetic, at most one memory operand. Those are the <em>load/store architecture</em> of slide 18, and not one of the ten RISC machines breaks them. Everything else — instruction sizes, mode counts, alignment — turns out to be negotiable.</li>
<li><strong>The "Max number of MMU uses" column is the one nobody reads, and it is the most brutal.</strong> Every RISC machine: 1. The VAX: <strong>24</strong>. That means a single VAX instruction can trigger twenty-four address translations, each of which can page-fault — so the machine must be able to suspend and restart an instruction in the middle. That is precisely the interrupt-latency problem of slide 19, quantified.</li>
<li><strong>Look at the VAX row as a whole.</strong> 56 instruction sizes, 56 bytes maximum, 22 addressing modes, 6 memory operands, 24 MMU uses. It is not a bad machine — it is a machine optimised for a different cost model (scarce memory, human assembly programmers, no pipeline). Every number in that row is a deliberate choice that pipelining later made expensive.</li>
<li><strong>The last two columns show the price of a big register file.</strong> "Number of bits for integer register specifier": 5 bits means 32 registers, and AMD29000 needs <strong>8 bits</strong> — 256 registers. Every extra bit is a bit taken out of a 32-bit instruction, which is why the register count cannot simply be raised forever, and why SPARC uses windows (5 bits naming 32 <em>visible</em> registers out of hundreds physical) instead of wider fields.</li>
<li><strong>Clipper and Intel 80960 are the interesting middle.</strong> Both carry several "a" footnotes — they are marketed as RISC but break several rules. The table exists to show that "RISC" was becoming a label rather than a definition, which is why slide 18's four characteristics matter more than any vendor's claim.</li>
</ul>
<p class="meo">💡 If you remember one column from this table, remember <strong>"Max number of memory operands"</strong>: 1 for every RISC, 2–6 for every CISC. It is the load/store architecture expressed as a single integer.</p>
<p class="pitfall">⚠️ Trap: the footnote letters are easy to misread. <strong>"a" marks a RISC machine BREAKING a RISC rule; "b" marks a CISC machine OBEYING one.</strong> They flag exceptions, not categories — an "a" does not mean "this row is CISC".</p>`,
        `<p class="y-chinh">🎯 Bảng ĐIỂM. Mười lăm bộ xử lý thật, chấm theo chín tiêu chí RISC, để bạn thấy từng cỗ máy tuân thủ các luật của slide 18 <em>CHẶT tới đâu</em> — và phát hiện ra ranh giới RISC/CISC là một DẢI LIÊN TỤC chứ không phải một bức tường.</p>
<table>
<tr><th>Bộ xử lý</th><th>Số kích thước lệnh</th><th>Kích thước lệnh tối đa (byte)</th><th>Số chế độ địa chỉ</th><th>Địa chỉ gián tiếp</th><th>Gộp load/store với số học</th><th>Số toán hạng bộ nhớ tối đa</th><th>Cho phép không canh biên</th><th>Số lượt dùng MMU tối đa</th><th>Số bit chỉ thanh ghi nguyên</th><th>Số bit chỉ thanh ghi dấu phẩy động</th></tr>
<tr><td>AMD29000</td><td>1</td><td>4</td><td>1</td><td>không</td><td>không</td><td>1</td><td>không</td><td>1</td><td>8</td><td>3<sup>a</sup></td></tr>
<tr><td>MIPS R2000</td><td>1</td><td>4</td><td>1</td><td>không</td><td>không</td><td>1</td><td>không</td><td>1</td><td>5</td><td>4</td></tr>
<tr><td>SPARC</td><td>1</td><td>4</td><td>2</td><td>không</td><td>không</td><td>1</td><td>không</td><td>1</td><td>5</td><td>4</td></tr>
<tr><td>MC88000</td><td>1</td><td>4</td><td>3</td><td>không</td><td>không</td><td>1</td><td>không</td><td>1</td><td>5</td><td>4</td></tr>
<tr><td>HP PA</td><td>1</td><td>4</td><td>10<sup>a</sup></td><td>không</td><td>không</td><td>1</td><td>không</td><td>1</td><td>5</td><td>4</td></tr>
<tr><td>IBM RT/PC</td><td>2<sup>a</sup></td><td>4</td><td>1</td><td>không</td><td>không</td><td>1</td><td>không</td><td>1</td><td>4<sup>a</sup></td><td>3<sup>a</sup></td></tr>
<tr><td>IBM RS/6000</td><td>1</td><td>4</td><td>4</td><td>không</td><td>không</td><td>1</td><td>CÓ</td><td>1</td><td>5</td><td>5</td></tr>
<tr><td>Intel i860</td><td>1</td><td>4</td><td>4</td><td>không</td><td>không</td><td>1</td><td>không</td><td>1</td><td>5</td><td>4</td></tr>
<tr><td>IBM 3090</td><td>4</td><td>8</td><td>2<sup>b</sup></td><td>không<sup>b</sup></td><td>có</td><td>2</td><td>có</td><td>4</td><td>4</td><td>2</td></tr>
<tr><td>Intel 80486</td><td>12</td><td>12</td><td>15</td><td>không<sup>b</sup></td><td>có</td><td>2</td><td>có</td><td>4</td><td>3</td><td>3</td></tr>
<tr><td>NSC 32016</td><td>21</td><td>21</td><td>23</td><td>có</td><td>có</td><td>2</td><td>có</td><td>4</td><td>3</td><td>3</td></tr>
<tr><td>MC68040</td><td>11</td><td>22</td><td>44</td><td>có</td><td>có</td><td>2</td><td>có</td><td>8</td><td>4</td><td>3</td></tr>
<tr><td><strong>VAX</strong></td><td><strong>56</strong></td><td><strong>56</strong></td><td><strong>22</strong></td><td>có</td><td>có</td><td><strong>6</strong></td><td>có</td><td><strong>24</strong></td><td>4</td><td>0</td></tr>
<tr><td>Clipper</td><td>4<sup>a</sup></td><td>8<sup>a</sup></td><td>9<sup>a</sup></td><td>không</td><td>không</td><td>1</td><td>không</td><td>2</td><td>4<sup>a</sup></td><td>3<sup>a</sup></td></tr>
<tr><td>Intel 80960</td><td>2<sup>a</sup></td><td>8<sup>a</sup></td><td>9<sup>a</sup></td><td>không</td><td>không</td><td>1</td><td>có<sup>a</sup></td><td>–</td><td>5</td><td>3<sup>a</sup></td></tr>
</table>
<p class="nhan">📐 Hai CHÚ THÍCH CHÂN BẢNG mới là ý chính: <strong>a = một máy RISC KHÔNG tuân thủ đặc điểm này</strong>; <strong>b = một máy CISC LẠI TUÂN THỦ nó</strong>. (Slide in "RISC hat does not conform" — lỗi gõ của "RISC that".) Đọc các chỉ số trên cho bạn biết ranh giới NHOÈ ở chỗ nào.</p>
<p class="dap-an">✅ Đếm bằng python3 trên 10 dòng RISC và 5 dòng CISC (IBM 3090, 80486, NSC 32016, MC68040, VAX). Trong nhóm RISC: <strong>KHÔNG máy nào</strong> hỗ trợ địa chỉ gián tiếp, <strong>KHÔNG máy nào</strong> gộp load/store với số học, và <strong>CẢ MƯỜI</strong> đều tối đa 1 toán hạng bộ nhớ — ba luật đó được tuân thủ không ngoại lệ. Mọi sai lệch đều nằm ở chỗ khác: IBM RT/PC, Clipper và Intel 80960 có hơn một kích thước lệnh; HP PA (10), Clipper (9) và 80960 (9) có nhiều chế độ địa chỉ; RS/6000 và 80960 cho phép truy cập không canh biên. Trong nhóm CISC: <strong>CẢ NĂM</strong> đều gộp load/store với số học, <strong>CẢ NĂM</strong> đều cho ≥ 2 toán hạng bộ nhớ, và <strong>CẢ NĂM</strong> đều cần ≥ 4 lượt dùng MMU mỗi lệnh.</p>
<ul>
<li><strong>Ba luật BẤT KHẢ XÂM PHẠM, đọc thẳng từ bảng đếm.</strong> Không địa chỉ gián tiếp, không toán hạng bộ nhớ bên trong phép số học, tối đa một toán hạng bộ nhớ. Đó chính là <em>KIẾN TRÚC LOAD/STORE</em> của slide 18, và không một máy nào trong mười máy RISC phá chúng. Mọi thứ còn lại — số kích thước lệnh, số chế độ, canh biên — hoá ra đều có thể thương lượng.</li>
<li><strong>Cột "số lượt dùng MMU tối đa" là cột không ai đọc, mà lại tàn nhẫn nhất.</strong> Mọi máy RISC: 1. VAX: <strong>24</strong>. Nghĩa là MỘT lệnh VAX có thể kích hoạt hai mươi bốn lần dịch địa chỉ, mà mỗi lần đều có thể gây LỖI TRANG — nên máy buộc phải có khả năng tạm dừng rồi khởi động lại một lệnh ở GIỮA CHỪNG. Đó đúng là bài toán độ trễ ngắt của slide 19, được lượng hoá thành số.</li>
<li><strong>Nhìn cả DÒNG VAX một lượt.</strong> 56 kích thước lệnh, tối đa 56 byte, 22 chế độ địa chỉ, 6 toán hạng bộ nhớ, 24 lượt MMU. Nó không phải một cỗ máy tồi — nó là cỗ máy tối ưu cho một MÔ HÌNH CHI PHÍ KHÁC (bộ nhớ hiếm, người viết hợp ngữ, chưa có pipeline). Mọi con số trong dòng đó là một lựa chọn có chủ ý mà pipeline sau này mới làm cho đắt đỏ.</li>
<li><strong>Hai cột cuối cho thấy CÁI GIÁ của tệp thanh ghi lớn.</strong> "Số bit chỉ thanh ghi nguyên": 5 bit nghĩa là 32 thanh ghi, còn AMD29000 cần tới <strong>8 bit</strong> — 256 thanh ghi. Mỗi bit thêm là một bit lấy ra khỏi cái lệnh 32 bit, nên không thể cứ tăng số thanh ghi mãi được, và đó là lý do SPARC dùng CỬA SỔ (5 bit gọi tên 32 thanh ghi <em>NHÌN THẤY ĐƯỢC</em> trong hàng trăm thanh ghi vật lý) thay vì nới rộng trường.</li>
<li><strong>Clipper và Intel 80960 là khoảng giữa thú vị.</strong> Cả hai mang nhiều chú thích "a" — được tiếp thị là RISC mà phá khá nhiều luật. Bảng này tồn tại để cho thấy "RISC" đang biến thành một cái NHÃN chứ không còn là một ĐỊNH NGHĨA, và đó là lý do bốn đặc điểm ở slide 18 đáng tin hơn mọi tuyên bố của hãng.</li>
</ul>
<p class="meo">💡 Nếu chỉ nhớ được MỘT cột của bảng này thì hãy nhớ <strong>"số toán hạng bộ nhớ tối đa"</strong>: bằng 1 với mọi máy RISC, bằng 2–6 với mọi máy CISC. Đó là kiến trúc load/store diễn đạt bằng đúng một số nguyên.</p>
<p class="pitfall">⚠️ Bẫy: hai chữ chú thích rất dễ đọc nhầm. <strong>"a" đánh dấu một máy RISC ĐANG PHÁ một luật RISC; "b" đánh dấu một máy CISC lại ĐANG TUÂN THỦ một luật.</strong> Chúng ghi chú NGOẠI LỆ chứ không phải PHÂN LOẠI — thấy "a" không có nghĩa là "dòng này là CISC".</p>`],

    ]),
  ].join('\n'),
};
