/**
 * CEA201 · Chương 11 trên web (bản 11e là Chapter 14) — Instruction Sets:
 * Addressing Modes and Formats, học theo từng slide (slide 1–34, trọn deck 'cea14').
 *
 * ⚠️ ĐÁNH SỐ: slide gốc ghi "Chapter 14" (Stallings 11th ed, Global Edition).
 * Syllabus của trường theo bản 9th ed gọi phần này là "Chapter 13: Addressing
 * Modes". Trên web môn này đánh là "Chương 11". Ba con số, cùng một nội dung.
 * Xem bảng quy đổi trong _slides.mjs.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH14-COA11e.pptx (/tmp/cea201-text/cea14.txt).
 * Slide chỉ có tiêu đề + hình/bảng (2, 3, 6, 8, 11, 15, 17, 19, 20, 22, 23, 24,
 * 26, 27, 28, 29, 30, 31, 33) đã ĐỌC THẲNG TỪ ẢNH render để lấy đúng từng nhãn.
 *
 * ⚠️ MỌI con số trong bài đã kiểm bằng python3 TRƯỚC khi viết.
 * Trạng thái máy giả định dùng chung cả bài (slide 4 dựng, các slide sau gọi lại):
 *   Bộ nhớ: 250→999 · 300→111 · 400→700 · 500→800 · 600→900 · 700→250 ·
 *           800→600 · 900→300 · 1000→640 · 1100→450 · 1500→777
 *   Thanh ghi: R1 = 600 · R2 = 200 · PC = 1000 · SP = 900
 *   Lệnh LOAD 500 (A = 500) chạy qua 11 chế độ, kết quả đã kiểm bằng máy:
 *     immediate 500 · direct 800 · indirect EA=800 val=600 · register 600 ·
 *     register indirect EA=600 val=900 · displacement EA=1100 val=450 ·
 *     relative EA=1500 val=777 · indexed EA=700 val=250 · stack EA=900 val=300 ·
 *     postindex EA=1000 val=640 · preindex EA=250 val=999
 *   Bài luyện: indirect 400 → EA=700, val=250 · indexed 300 → EA=500, val=800 ·
 *     relative PC=1000 offset=−300 → EA=700, val=250
 *   Phân bổ bit: 16 bit / 32 thao tác (5) / 2 toán hạng trong 8 thanh ghi (3+3)
 *     → độ dời 5 bit, tầm −16..+15 (có dấu) hoặc 0..31 (không dấu).
 *     32 bit / 128 thao tác (7) / 3 toán hạng trong 32 thanh ghi (15) → 10 bit,
 *     tầm −512..+511. PDP-8: 3+1+1+7 = 12 bit, 2^7 = 128 từ/trang, với được
 *     256 trong 4096 từ. ARM branch: 24 bit dịch trái 2 → 2^25 = 33 554 432 byte
 *     = ±32 MiB. 24 bit / 60 thao tác (6) / 16 thanh ghi chỉ số (4) → 14 bit
 *     địa chỉ, không gian 16 384 từ.
 *
 * Chỗ slide gốc CỤT/CẦN NÓI RÕ — nêu thẳng, không im lặng chép, không tự sửa slide:
 *   · slide 13: bản trích in "(R) (R) + 1" — mũi tên gán bị rụng khi trích chữ,
 *     nguyên văn là (R) ← (R) + 1.
 *   · slide 6, 8, 11: slide KHÔNG có khối thân chữ trong bản trích (toàn bộ nội
 *     dung nằm trong hình SmartArt) — đã đọc từ ảnh render.
 *   · slide 31 (Figure 14.12): trường opcode 4 bit của bản ARM in trên hình đọc
 *     ra 0010, trong khi 0100 mới là mã ADD của ARM. Bài này nêu rõ chỗ đáng nhớ
 *     là hằng 19 và thanh ghi r3, KHÔNG khẳng định bit opcode trên hình là đúng.
 *   · Toàn bộ BÀI TẬP tính EA và phân bổ bit KHÔNG có trên slide nào — slide chỉ
 *     cho công thức và khuôn dạng. Bài này nói rõ chỗ nào là slide, chỗ nào là
 *     bài luyện tự dựng.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea14';

export default {
  title: '11.0 — Slide by slide: Addressing modes and instruction formats (34 slides)|||11.0 — Slide bài giảng: Các chế độ địa chỉ & khuôn dạng lệnh (34 slide)',
  slug: 'cea201-11-0-slides-che-do-dia-chi-khuon-dang-lenh',
  type: 'DOCUMENT',
  description: 'Trọn deck Chapter 14 bản 11e của CEA201 (34 slide) — nửa sau của câu chuyện tập lệnh: sau khi Chương 10 hỏi "lệnh làm gì", chương này hỏi "lệnh tìm toán hạng ở đâu" và "xếp bit vào lệnh thế nào". Đi qua bảy chế độ địa chỉ cơ bản (tức thời, trực tiếp, gián tiếp, thanh ghi, gián tiếp qua thanh ghi, độ dời, ngăn xếp) với MỘT trạng thái máy giả định dùng chung cho cả bài — cùng lệnh LOAD 500 chạy qua 11 chế độ để thấy rõ EA và giá trị nạp khác nhau ra sao; rồi ba biến thể của độ dời (relative dùng PC, base-register, indexed) cùng hậu tăng/tiền giảm và pre/post-indexing; tiếp đến chế độ địa chỉ của x86 và ARM; và nửa sau là khuôn dạng lệnh: độ dài lệnh, phân bổ bit, lệnh độ dài thay đổi, PDP-8/PDP-10/PDP-11/VAX/x86/ARM/Thumb-2. Có bài phân bổ bit dạng đề thi giải từng bước, mọi con số đã kiểm bằng máy.',
  content: [
    walkHead(D, 1, 34),
    walk(D, [

      [1, 'Chapter 14 — Instruction Sets: Addressing Modes and Formats (title slide)',
        `<p class="y-chinh">🎯 The opening slide of the second half of the instruction-set story. Chapter 13 asked <strong>what an instruction does</strong> (opcode, operand types, data transfer, arithmetic, logical, transfer of control). This chapter asks the two questions left over: <strong>where does the operand live</strong> (addressing modes) and <strong>how are the bits of the instruction laid out</strong> (instruction formats).</p>
<ul>
<li><strong>Numbering warning, read this first.</strong> The slide says "Chapter 14" because the deck is the 11th Global Edition. Your syllabus follows the 9th edition and calls the same material "Chapter 13: Addressing Modes". On this site it is numbered <strong>Chapter 11</strong>. Three different numbers, one body of material — do not waste exam time worrying about it.</li>
<li><strong>The deck has exactly two halves.</strong> Slides 2–19 are <em>addressing modes</em>: seven basic modes, then how x86 and ARM actually implement them. Slides 20–33 are <em>instruction formats</em>: instruction length, allocation of bits, variable-length instructions, then six real machines as case studies. Slide 34 is the summary, and it is a perfect revision checklist.</li>
<li><strong>The one sentence the chapter rests on.</strong> An address field in an instruction is <em>short</em> and memory is <em>huge</em>. Every addressing mode in this chapter is a different trick for bridging that gap — and every trick trades memory references for address space, or flexibility for complexity.</li>
<li><strong>Where the exam marks are.</strong> Two kinds of question, both mechanical once you know the drill. (1) "Given this memory and these registers, what value does instruction X load in mode Y?" — that is the effective-address drill, worked in full on slide 4. (2) "An instruction is N bits, it needs K operations and R registers — how many bits are left for the address, and what range does that give?" — the bit-allocation drill, worked in full on slide 22.</li>
<li><strong>What it connects to.</strong> Chapter 3 gave you the instruction cycle, which contains an explicit <em>operand address calculation</em> step — this chapter is what happens inside that step. Chapter 10/13 gave you the operations. Chapter 17 (RISC) will argue that most of this chapter is a mistake and that a machine should have three modes and one fixed instruction length. PRF192 already made you use two of these modes without naming them: <code>a[i]</code> is indexed addressing, <code>*p</code> is register-indirect addressing.</li>
</ul>
<p class="meo">💡 Keep one sentence in your head for the whole chapter: <strong>"EA = the address the hardware finally sends to memory."</strong> Every mode is just a different formula for computing EA. Learn the seven formulas and you have learned the first half of the chapter.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu của NỬA SAU câu chuyện tập lệnh. Chương 13 (bản 11e) hỏi <strong>lệnh LÀM GÌ</strong> (mã thao tác, kiểu toán hạng, chuyển dữ liệu, số học, logic, rẽ nhánh). Chương này hỏi hai câu còn lại: <strong>toán hạng NẰM Ở ĐÂU</strong> (chế độ địa chỉ) và <strong>bit trong lệnh XẾP THẾ NÀO</strong> (khuôn dạng lệnh).</p>
<ul>
<li><strong>Cảnh báo đánh số, đọc trước đã.</strong> Slide ghi "Chapter 14" vì deck là bản 11th Global Edition. Syllabus của trường theo bản 9th ed nên gọi đúng phần này là "Chapter 13: Addressing Modes". Trên web này nó được đánh là <strong>Chương 11</strong>. Ba con số khác nhau, MỘT khối nội dung — đừng tốn thời gian thi để lo chuyện này.</li>
<li><strong>Deck có đúng HAI nửa.</strong> Slide 2–19 là <em>CHẾ ĐỘ ĐỊA CHỈ</em>: bảy chế độ cơ bản, rồi x86 và ARM thực sự cài đặt chúng ra sao. Slide 20–33 là <em>KHUÔN DẠNG LỆNH</em>: độ dài lệnh, phân bổ bit, lệnh độ dài thay đổi, rồi sáu máy thật làm ca nghiên cứu. Slide 34 là tổng kết, và nó là một bảng ôn thi hoàn hảo.</li>
<li><strong>Một câu mà cả chương đứng trên đó.</strong> Trường địa chỉ trong lệnh thì <em>NGẮN</em>, còn bộ nhớ thì <em>KHỔNG LỒ</em>. Mọi chế độ địa chỉ trong chương này đều là một mẹo khác nhau để bắc cầu qua khoảng cách đó — và mọi mẹo đều đánh đổi: thêm lần truy cập bộ nhớ để lấy không gian địa chỉ, hoặc thêm phức tạp để lấy mềm dẻo.</li>
<li><strong>Điểm thi nằm ở đâu.</strong> Hai dạng câu, cả hai đều máy móc một khi bạn thuộc quy trình. (1) "Cho bộ nhớ và thanh ghi như sau, lệnh X ở chế độ Y nạp ra giá trị nào?" — đó là bài tính địa chỉ hiệu dụng, giải trọn ở slide 4. (2) "Lệnh N bit, cần K thao tác và R thanh ghi — còn bao nhiêu bit cho địa chỉ, tầm với bao nhiêu?" — bài phân bổ bit, giải trọn ở slide 22.</li>
<li><strong>Nó nối vào đâu.</strong> Chương 3 cho bạn chu trình lệnh, trong đó có hẳn một bước <em>TÍNH ĐỊA CHỈ TOÁN HẠNG</em> — chương này chính là thứ xảy ra bên trong bước ấy. Chương 10/13 cho bạn các thao tác. Chương 17 (RISC) sẽ lập luận rằng phần lớn chương này là một sai lầm, và một cỗ máy chỉ nên có ba chế độ cùng một độ dài lệnh cố định. PRF192 đã bắt bạn dùng hai chế độ trong đây mà không gọi tên: <code>a[i]</code> chính là chế độ CHỈ SỐ (indexed), còn <code>*p</code> chính là GIÁN TIẾP QUA THANH GHI.</li>
</ul>
<p class="meo">💡 Giữ một câu trong đầu cho cả chương: <strong>"EA = địa chỉ mà phần cứng cuối cùng gửi ra bộ nhớ."</strong> Mọi chế độ chỉ là một công thức khác nhau để tính EA. Thuộc bảy công thức là xong nửa đầu chương.</p>`],

      [2, 'Addressing Modes — the seven basic modes',
        `<p class="y-chinh">🎯 The chapter's table of contents, drawn as a seven-step staircase. These are <strong>the seven names you must be able to recite</strong>, in this order: Immediate · Direct · Indirect · Register · Register indirect · Displacement · Stack.</p>
<ul>
<li><strong>The order is not alphabetical, it is pedagogical.</strong> Each mode fixes a weakness of the one before it. Immediate has no memory reference but a tiny operand → Direct gives a real address but a small address space → Indirect gives a huge address space but two memory references → Register kills the memory reference entirely but has almost no address space → Register indirect gets the big space back with one reference → Displacement combines direct and register indirect → Stack removes the address field altogether.</li>
<li><strong>Three of them touch no memory for the operand.</strong> Immediate (the operand is inside the instruction), Register (the operand is in the CPU), and Stack (the operand is implicitly at the top of stack, held in a register). Those three are the fast ones.</li>
<li><strong>Only one of them is a family, not a single mode.</strong> <em>Displacement</em> covers three named variants that the slides treat separately: relative (slide 11), base-register (slide 12) and indexing (slide 13). If an exam question says "displacement addressing", any of the three is fair game.</li>
<li><strong>Why any of this exists.</strong> A machine could have exactly one mode — direct — and still be Turing complete. It would also be unusable: no arrays without self-modifying code, no relocatable programs, no recursion, no pointers. Each mode on this list buys one of those.</li>
<li><strong>Different books, same seven.</strong> Some textbooks add "implied/implicit" as an eighth. Stallings folds implied addressing into <em>stack</em> addressing (slide 14 says stack "is a form of implied addressing"). Answer the seven that are on this slide.</li>
</ul>
<p class="meo">💡 Mnemonic in Vietnamese order of increasing indirection: <strong>"Tức — Trực — Gián — Ghi — Ghi-gián — Dời — Ngăn"</strong>. Say it five times and you will never lose a mark for forgetting one.</p>`,
        `<p class="y-chinh">🎯 Mục lục của chương, vẽ thành một cầu thang bảy bậc. Đây là <strong>bảy cái tên bạn phải đọc thuộc</strong>, theo đúng thứ tự này: Immediate (tức thời) · Direct (trực tiếp) · Indirect (gián tiếp) · Register (thanh ghi) · Register indirect (gián tiếp qua thanh ghi) · Displacement (độ dời) · Stack (ngăn xếp).</p>
<ul>
<li><strong>Thứ tự này KHÔNG phải theo bảng chữ cái, mà theo mạch dạy.</strong> Mỗi chế độ vá đúng điểm yếu của chế độ trước. Tức thời không đụng bộ nhớ nhưng toán hạng tí hon → Trực tiếp cho địa chỉ thật nhưng không gian địa chỉ nhỏ → Gián tiếp cho không gian khổng lồ nhưng tốn HAI lần truy cập → Thanh ghi giết sạch lần truy cập bộ nhớ nhưng gần như không có không gian địa chỉ → Gián tiếp qua thanh ghi lấy lại không gian lớn với MỘT lần truy cập → Độ dời ghép trực tiếp với gián-tiếp-qua-thanh-ghi → Ngăn xếp bỏ luôn trường địa chỉ.</li>
<li><strong>Ba trong bảy chế độ KHÔNG đụng bộ nhớ để lấy toán hạng.</strong> Tức thời (toán hạng nằm ngay trong lệnh), Thanh ghi (toán hạng nằm trong CPU) và Ngăn xếp (toán hạng ngầm ở đỉnh ngăn xếp, mà con trỏ đỉnh lại nằm trong một thanh ghi). Ba cái đó là ba cái NHANH.</li>
<li><strong>Chỉ một cái là cả một HỌ, không phải một chế độ đơn.</strong> <em>Độ dời (displacement)</em> bao trùm ba biến thể mà slide tách ra dạy riêng: relative (slide 11), base-register (slide 12) và indexing (slide 13). Đề thi nói "displacement addressing" thì cả ba đều có thể bị hỏi.</li>
<li><strong>Vì sao cần ngần ấy chế độ.</strong> Một cỗ máy chỉ có ĐÚNG MỘT chế độ — trực tiếp — vẫn đủ sức tính mọi thứ (Turing đầy đủ). Nó cũng sẽ không xài được: không có mảng nếu không tự sửa mã lệnh, không có chương trình di dời được, không có đệ quy, không có con trỏ. Mỗi chế độ trong danh sách này mua về một trong những thứ đó.</li>
<li><strong>Sách khác, vẫn bảy cái này.</strong> Vài giáo trình thêm "implied/implicit" thành cái thứ tám. Stallings gộp địa chỉ ngầm vào <em>NGĂN XẾP</em> (slide 14 ghi rõ ngăn xếp "là một dạng của địa chỉ ngầm"). Đi thi thì trả lời đúng bảy cái trên slide này.</li>
</ul>
<p class="meo">💡 Câu thần chú theo chiều gián tiếp tăng dần: <strong>"Tức — Trực — Gián — Ghi — Ghi-gián — Dời — Ngăn"</strong>. Đọc năm lần là không bao giờ mất điểm vì quên một cái.</p>`],

      [3, 'Figure 14.1 — Addressing Modes (seven diagrams, (a) through (g))',
        `<p class="y-chinh">🎯 The single most useful picture in the chapter: seven small boxes, each showing the same thing — an <strong>Instruction</strong> at the top, and arrows tracing where the hardware has to go to reach the <strong>Operand</strong>. <em>Count the arrows and you have counted the memory references.</em></p>
<table>
<tr><th>Panel</th><th>What the instruction field holds</th><th>Where the arrow ends</th><th>Memory refs for the operand</th></tr>
<tr><td>(a) Immediate</td><td>the <strong>Operand</strong> itself</td><td>nowhere — no arrow leaves the instruction</td><td><strong>0</strong></td></tr>
<tr><td>(b) Direct</td><td><strong>A</strong></td><td>one arrow straight into Memory, landing on Operand</td><td><strong>1</strong></td></tr>
<tr><td>(c) Indirect</td><td><strong>A</strong></td><td>arrow into Memory, that cell points again, second arrow lands on Operand</td><td><strong>2</strong></td></tr>
<tr><td>(d) Register</td><td><strong>R</strong></td><td>arrow into Registers, lands on Operand — Memory box is not even drawn</td><td><strong>0</strong></td></tr>
<tr><td>(e) Register indirect</td><td><strong>R</strong></td><td>arrow into Registers, that register points into Memory, lands on Operand</td><td><strong>1</strong></td></tr>
<tr><td>(f) Displacement</td><td><strong>R</strong> and <strong>A</strong> (two fields)</td><td>register content and A meet at a <strong>⊕ adder</strong>, the sum points into Memory</td><td><strong>1</strong></td></tr>
<tr><td>(g) Stack</td><td>nothing — the word <strong>Implicit</strong> is printed instead</td><td>arrow to the <strong>Top of Stack Register</strong></td><td><strong>0</strong></td></tr>
</table>
<ul>
<li><strong>Look at panel (f) carefully — it is the only one with an adder.</strong> That little ⊕ circle is the entire reason displacement addressing is described as "complex" in Table 14.1: the processor needs an extra adder in the address path, and one more pipeline stage's worth of delay before the address is ready.</li>
<li><strong>Panel (a) is the odd one out and the exam loves it.</strong> In every other panel the field is an <em>address</em>; in (a) it is the <em>value</em>. That is why Table 14.1 writes "Operand = A" for immediate and "EA = A" for direct — immediate addressing has no effective address at all.</li>
<li><strong>Panels (c) and (e) are the same idea at two scales.</strong> Both are "the thing I named contains an address, not a value." (c) names a memory cell, (e) names a register. That single difference costs (c) one extra memory reference — which at DRAM speed (Chapter 4) is ~100 ns versus ~0 ns.</li>
<li><strong>Panel (g) has no address field drawn at all.</strong> That is the whole point of stack addressing: the instruction is shorter because the operand location is implied. A one-byte <code>ADD</code> on a stack machine does what a three-address instruction needs six bytes to say.</li>
</ul>
<p class="meo">💡 Revision trick: cover the captions and try to name each panel from the arrows alone. If you can do that, you can answer any "which mode is this?" question, because exam diagrams are redrawings of exactly this figure.</p>`,
        `<p class="y-chinh">🎯 Bức hình hữu dụng nhất của cả chương: bảy ô nhỏ, mỗi ô vẽ cùng một thứ — một <strong>Instruction</strong> (lệnh) ở trên, và các mũi tên lần theo đường mà phần cứng phải đi để tới được <strong>Operand</strong> (toán hạng). <em>Đếm mũi tên là đếm được số lần truy cập bộ nhớ.</em></p>
<table>
<tr><th>Ô</th><th>Trường trong lệnh chứa gì</th><th>Mũi tên kết thúc ở đâu</th><th>Số lần truy cập bộ nhớ để lấy toán hạng</th></tr>
<tr><td>(a) Immediate</td><td>chính <strong>toán hạng</strong></td><td>không đi đâu — không có mũi tên nào rời khỏi lệnh</td><td><strong>0</strong></td></tr>
<tr><td>(b) Direct</td><td><strong>A</strong></td><td>một mũi tên thẳng vào Memory, rơi trúng Operand</td><td><strong>1</strong></td></tr>
<tr><td>(c) Indirect</td><td><strong>A</strong></td><td>mũi tên vào Memory, ô đó lại trỏ tiếp, mũi tên thứ hai mới rơi trúng Operand</td><td><strong>2</strong></td></tr>
<tr><td>(d) Register</td><td><strong>R</strong></td><td>mũi tên vào Registers, rơi trúng Operand — ô Memory thậm chí không được vẽ</td><td><strong>0</strong></td></tr>
<tr><td>(e) Register Indirect</td><td><strong>R</strong></td><td>mũi tên vào Registers, thanh ghi đó trỏ vào Memory, rơi trúng Operand</td><td><strong>1</strong></td></tr>
<tr><td>(f) Displacement</td><td><strong>R</strong> và <strong>A</strong> (HAI trường)</td><td>nội dung thanh ghi và A gặp nhau ở một <strong>bộ cộng ⊕</strong>, tổng mới trỏ vào Memory</td><td><strong>1</strong></td></tr>
<tr><td>(g) Stack</td><td>không gì cả — chỗ đó in chữ <strong>Implicit</strong> (ngầm)</td><td>mũi tên tới <strong>Top of Stack Register</strong></td><td><strong>0</strong></td></tr>
</table>
<ul>
<li><strong>Nhìn kỹ ô (f) — nó là ô DUY NHẤT có bộ cộng.</strong> Cái vòng tròn ⊕ bé tí đó chính là toàn bộ lý do Table 14.1 mô tả độ dời là "phức tạp": bộ xử lý cần thêm một bộ cộng trên đường tính địa chỉ, và thêm chừng một tầng ống lệnh độ trễ trước khi có địa chỉ.</li>
<li><strong>Ô (a) là ô lệch chuẩn, và đề thi rất thích nó.</strong> Ở mọi ô khác, trường đó là một <em>ĐỊA CHỈ</em>; ở (a) nó là một <em>GIÁ TRỊ</em>. Đó là lý do Table 14.1 viết "Operand = A" cho immediate mà viết "EA = A" cho direct — chế độ tức thời KHÔNG HỀ có địa chỉ hiệu dụng.</li>
<li><strong>Ô (c) và ô (e) là cùng một ý ở hai quy mô.</strong> Cả hai đều nói "cái tôi vừa nêu tên thì CHỨA MỘT ĐỊA CHỈ, không chứa giá trị". (c) nêu tên một ô nhớ, (e) nêu tên một thanh ghi. Đúng một khác biệt đó khiến (c) tốn thêm một lần đọc bộ nhớ — mà ở tốc độ DRAM (Chương 4) là ~100 ns so với ~0 ns.</li>
<li><strong>Ô (g) không vẽ trường địa chỉ nào cả.</strong> Đó chính là toàn bộ điểm của chế độ ngăn xếp: lệnh NGẮN HƠN vì vị trí toán hạng đã ngầm hiểu. Một lệnh <code>ADD</code> một byte trên máy ngăn xếp làm đúng việc mà lệnh ba địa chỉ phải tốn sáu byte mới nói xong.</li>
</ul>
<p class="meo">💡 Mẹo ôn: che hết chú thích rồi thử gọi tên từng ô CHỈ dựa vào mũi tên. Làm được là trả lời được mọi câu "đây là chế độ nào?", vì hình trong đề thi đều là bản vẽ lại của đúng figure này.</p>`],

      [4, 'Table 14.1 — Basic Addressing Modes (algorithm, advantage, disadvantage)',
        `<p class="y-chinh">🎯 <strong>The single most examinable slide in the chapter.</strong> Seven rows, four columns. Memorise the Algorithm column word for word — every effective-address question you will ever be asked is one line of this table applied to some numbers.</p>
<table>
<tr><th>Mode</th><th>Algorithm (slide's exact wording)</th><th>Memory refs for operand</th><th>Principal advantage</th><th>Principal disadvantage</th></tr>
<tr><td>Immediate</td><td><code>Operand = A</code></td><td>0</td><td>No memory reference</td><td>Limited operand magnitude</td></tr>
<tr><td>Direct</td><td><code>EA = A</code></td><td>1</td><td>Simple</td><td>Limited address space</td></tr>
<tr><td>Indirect</td><td><code>EA = (A)</code></td><td>2</td><td>Large address space</td><td>Multiple memory references</td></tr>
<tr><td>Register</td><td><code>EA = R</code></td><td>0</td><td>No memory reference</td><td>Limited address space</td></tr>
<tr><td>Register indirect</td><td><code>EA = (R)</code></td><td>1</td><td>Large address space</td><td>Extra memory reference</td></tr>
<tr><td>Displacement</td><td><code>EA = A + (R)</code></td><td>1</td><td>Flexibility</td><td>Complexity</td></tr>
<tr><td>Stack</td><td><code>EA = top of stack</code></td><td>0</td><td>No memory reference</td><td>Limited applicability</td></tr>
</table>
<p class="nhan">The notation is the whole trick: <strong>parentheses mean "contents of"</strong>. <code>A</code> is the number printed in the instruction; <code>(A)</code> is what is stored in memory at address A; <code>R</code> names a register; <code>(R)</code> is what is stored in that register.</p>
<p class="nhan"><strong>A shared machine state for the rest of this lesson.</strong> Every worked example below uses exactly this state, so you can compare modes side by side.</p>
<table>
<tr><th>Address</th><td>250</td><td>300</td><td>400</td><td>500</td><td>600</td><td>700</td><td>800</td><td>900</td><td>1000</td><td>1100</td><td>1500</td></tr>
<tr><th>Content</th><td>999</td><td>111</td><td>700</td><td><strong>800</strong></td><td>900</td><td>250</td><td>600</td><td>300</td><td>640</td><td>450</td><td>777</td></tr>
</table>
<p class="nhan">Registers: <strong>R1 = 600</strong> · <strong>R2 = 200</strong> · <strong>PC = 1000</strong> (address of the next instruction) · <strong>SP = 900</strong> (top of stack).</p>
<p class="nhan"><strong>Now run ONE instruction — <code>LOAD 500</code>, so A = 500 — through every mode.</strong> The opcode never changes; only the mode bits change. This is the drill.</p>
<table>
<tr><th>Mode</th><th>How EA is computed</th><th>EA</th><th>Value loaded into AC</th></tr>
<tr><td>Immediate</td><td>no EA at all; Operand = A</td><td>—</td><td><strong>500</strong></td></tr>
<tr><td>Direct</td><td>EA = A = 500</td><td>500</td><td>M[500] = <strong>800</strong></td></tr>
<tr><td>Indirect</td><td>EA = (A) = M[500] = 800</td><td>800</td><td>M[800] = <strong>600</strong></td></tr>
<tr><td>Register (written <code>LOAD R1</code>)</td><td>EA = R1, operand is the register itself</td><td>R1</td><td>(R1) = <strong>600</strong></td></tr>
<tr><td>Register indirect (<code>LOAD (R1)</code>)</td><td>EA = (R1) = 600</td><td>600</td><td>M[600] = <strong>900</strong></td></tr>
<tr><td>Displacement / base-register, R = R1</td><td>EA = A + (R1) = 500 + 600</td><td>1100</td><td>M[1100] = <strong>450</strong></td></tr>
<tr><td>Indexed, index register R2</td><td>EA = A + (R2) = 500 + 200</td><td>700</td><td>M[700] = <strong>250</strong></td></tr>
<tr><td>Relative (PC-relative)</td><td>EA = A + (PC) = 500 + 1000</td><td>1500</td><td>M[1500] = <strong>777</strong></td></tr>
<tr><td>Stack</td><td>EA = top of stack = SP</td><td>900</td><td>M[900] = <strong>300</strong></td></tr>
<tr><td>Postindexed indirect</td><td>EA = (A) + (R2) = 800 + 200</td><td>1000</td><td>M[1000] = <strong>640</strong></td></tr>
<tr><td>Preindexed indirect</td><td>EA = (A + (R2)) = M[700] = 250</td><td>250</td><td>M[250] = <strong>999</strong></td></tr>
</table>
<p class="dap-an">✅ One instruction, eleven different answers: <strong>500 · 800 · 600 · 600 · 900 · 450 · 250 · 777 · 300 · 640 · 999</strong>. The bits of the address field are identical in all eleven cases — only the <em>mode</em> bits differ. That is why an instruction format must encode the mode (slide 20) and why no exam question about addressing can be answered without first identifying the mode.</p>
<p class="pitfall">⚠️ The three mistakes that cost the most marks. <strong>(1)</strong> Answering with the EA when the question asked for the <em>value</em> — indirect mode here gives EA = 800 but value = 600. <strong>(2)</strong> Doing only one dereference in indirect mode. <strong>(3)</strong> Forgetting that in register mode the operand <em>is</em> the register contents, so there is no memory access at all.</p>
<p class="meo">💡 A rhythm that never fails: <em>"count the brackets"</em>. <code>EA = A</code> → zero brackets → one memory read. <code>EA = (A)</code> → one bracket → two reads. <code>EA = A + (R)</code> → the bracket is on a <em>register</em>, which is free → still one memory read.</p>`,
        `<p class="y-chinh">🎯 <strong>Slide dễ ra đề nhất của cả chương.</strong> Bảy dòng, bốn cột. Học thuộc cột Algorithm từng chữ — mọi câu hỏi về địa chỉ hiệu dụng mà bạn sẽ gặp đều chỉ là MỘT dòng của bảng này áp vào vài con số.</p>
<table>
<tr><th>Chế độ</th><th>Thuật toán (đúng chữ trên slide)</th><th>Số lần đọc bộ nhớ lấy toán hạng</th><th>Ưu điểm chính</th><th>Nhược điểm chính</th></tr>
<tr><td>Immediate — tức thời</td><td><code>Operand = A</code></td><td>0</td><td>Không phải đọc bộ nhớ</td><td>Độ lớn toán hạng bị giới hạn</td></tr>
<tr><td>Direct — trực tiếp</td><td><code>EA = A</code></td><td>1</td><td>Đơn giản</td><td>Không gian địa chỉ bị giới hạn</td></tr>
<tr><td>Indirect — gián tiếp</td><td><code>EA = (A)</code></td><td>2</td><td>Không gian địa chỉ lớn</td><td>Nhiều lần đọc bộ nhớ</td></tr>
<tr><td>Register — thanh ghi</td><td><code>EA = R</code></td><td>0</td><td>Không phải đọc bộ nhớ</td><td>Không gian địa chỉ bị giới hạn</td></tr>
<tr><td>Register indirect — gián tiếp qua thanh ghi</td><td><code>EA = (R)</code></td><td>1</td><td>Không gian địa chỉ lớn</td><td>Thêm một lần đọc bộ nhớ</td></tr>
<tr><td>Displacement — độ dời</td><td><code>EA = A + (R)</code></td><td>1</td><td>Mềm dẻo</td><td>Phức tạp</td></tr>
<tr><td>Stack — ngăn xếp</td><td><code>EA = đỉnh ngăn xếp</code></td><td>0</td><td>Không phải đọc bộ nhớ</td><td>Phạm vi áp dụng hẹp</td></tr>
</table>
<p class="nhan">Cả mẹo nằm ở ký hiệu: <strong>ngoặc đơn nghĩa là "nội dung của"</strong>. <code>A</code> là con số in trong lệnh; <code>(A)</code> là thứ nằm trong bộ nhớ tại địa chỉ A; <code>R</code> là tên một thanh ghi; <code>(R)</code> là thứ nằm trong thanh ghi đó.</p>
<p class="nhan"><strong>Một trạng thái máy DÙNG CHUNG cho cả bài học này.</strong> Mọi ví dụ phía sau đều dùng đúng trạng thái này, để bạn so các chế độ cạnh nhau.</p>
<table>
<tr><th>Địa chỉ</th><td>250</td><td>300</td><td>400</td><td>500</td><td>600</td><td>700</td><td>800</td><td>900</td><td>1000</td><td>1100</td><td>1500</td></tr>
<tr><th>Nội dung</th><td>999</td><td>111</td><td>700</td><td><strong>800</strong></td><td>900</td><td>250</td><td>600</td><td>300</td><td>640</td><td>450</td><td>777</td></tr>
</table>
<p class="nhan">Thanh ghi: <strong>R1 = 600</strong> · <strong>R2 = 200</strong> · <strong>PC = 1000</strong> (địa chỉ lệnh kế tiếp) · <strong>SP = 900</strong> (đỉnh ngăn xếp).</p>
<p class="nhan"><strong>Giờ cho MỘT lệnh — <code>LOAD 500</code>, tức A = 500 — chạy qua TẤT CẢ các chế độ.</strong> Mã thao tác không đổi; chỉ mấy bit chế độ đổi. Đây là bài tập cốt lõi.</p>
<table>
<tr><th>Chế độ</th><th>EA tính thế nào</th><th>EA</th><th>Giá trị nạp vào AC</th></tr>
<tr><td>Tức thời</td><td>không có EA; Operand = A</td><td>—</td><td><strong>500</strong></td></tr>
<tr><td>Trực tiếp</td><td>EA = A = 500</td><td>500</td><td>M[500] = <strong>800</strong></td></tr>
<tr><td>Gián tiếp</td><td>EA = (A) = M[500] = 800</td><td>800</td><td>M[800] = <strong>600</strong></td></tr>
<tr><td>Thanh ghi (viết <code>LOAD R1</code>)</td><td>EA = R1, toán hạng là chính thanh ghi</td><td>R1</td><td>(R1) = <strong>600</strong></td></tr>
<tr><td>Gián tiếp qua thanh ghi (<code>LOAD (R1)</code>)</td><td>EA = (R1) = 600</td><td>600</td><td>M[600] = <strong>900</strong></td></tr>
<tr><td>Độ dời / base-register, R = R1</td><td>EA = A + (R1) = 500 + 600</td><td>1100</td><td>M[1100] = <strong>450</strong></td></tr>
<tr><td>Chỉ số (indexed), thanh ghi chỉ số R2</td><td>EA = A + (R2) = 500 + 200</td><td>700</td><td>M[700] = <strong>250</strong></td></tr>
<tr><td>Tương đối (PC-relative)</td><td>EA = A + (PC) = 500 + 1000</td><td>1500</td><td>M[1500] = <strong>777</strong></td></tr>
<tr><td>Ngăn xếp</td><td>EA = đỉnh ngăn xếp = SP</td><td>900</td><td>M[900] = <strong>300</strong></td></tr>
<tr><td>Gián tiếp HẬU chỉ số (postindexed)</td><td>EA = (A) + (R2) = 800 + 200</td><td>1000</td><td>M[1000] = <strong>640</strong></td></tr>
<tr><td>Gián tiếp TIỀN chỉ số (preindexed)</td><td>EA = (A + (R2)) = M[700] = 250</td><td>250</td><td>M[250] = <strong>999</strong></td></tr>
</table>
<p class="dap-an">✅ Một lệnh, MƯỜI MỘT đáp án khác nhau: <strong>500 · 800 · 600 · 600 · 900 · 450 · 250 · 777 · 300 · 640 · 999</strong>. Các bit của trường địa chỉ GIỐNG HỆT nhau trong cả mười một ca — chỉ mấy bit <em>CHẾ ĐỘ</em> là khác. Đó là lý do khuôn dạng lệnh bắt buộc phải mã hoá được chế độ (slide 20), và là lý do không câu hỏi nào về địa chỉ trả lời được nếu chưa xác định chế độ.</p>
<p class="pitfall">⚠️ Ba lỗi mất điểm nhiều nhất. <strong>(1)</strong> Trả lời bằng EA trong khi đề hỏi <em>GIÁ TRỊ</em> — chế độ gián tiếp ở đây cho EA = 800 nhưng giá trị là 600. <strong>(2)</strong> Chỉ giải tham chiếu MỘT lần ở chế độ gián tiếp. <strong>(3)</strong> Quên rằng ở chế độ thanh ghi thì toán hạng CHÍNH LÀ nội dung thanh ghi, nên không có lần truy cập bộ nhớ nào cả.</p>
<p class="meo">💡 Một nhịp không bao giờ sai: <em>"đếm ngoặc"</em>. <code>EA = A</code> → không ngoặc → một lần đọc bộ nhớ. <code>EA = (A)</code> → một ngoặc → hai lần đọc. <code>EA = A + (R)</code> → ngoặc nằm trên một <em>THANH GHI</em>, mà thanh ghi thì miễn phí → vẫn chỉ một lần đọc bộ nhớ.</p>`],

      [5, 'Immediate Addressing — Operand = A',
        `<p class="y-chinh">🎯 The simplest form of addressing: the operand <strong>is</strong> the address field. Nothing is fetched, nothing is computed. The slide calls it "the simplest form of addressing" and it is the only mode with no effective address.</p>
<ul>
<li><strong>What the slide says it is for.</strong> "This mode can be used to <em>define and use constants</em> or <em>set initial values of variables</em>." In C terms: <code>int i = 0;</code>, <code>x = x + 1;</code>, <code>if (n == 10)</code> — every literal you type becomes an immediate operand.</li>
<li><strong>Typically the number will be stored in twos complement form.</strong> The slide says so explicitly, and adds that <strong>the leftmost bit of the operand field is used as a sign bit</strong>. So a k-bit immediate field holds values from −2<sup>k−1</sup> to +2<sup>k−1</sup>−1, not 0 to 2<sup>k</sup>−1. With an 8-bit field that is <strong>−128 … +127</strong>.</li>
<li><strong>Advantage, in the slide's own words.</strong> "No memory reference other than the instruction fetch is required to obtain the operand, thus <strong>saving one memory or cache cycle</strong> in the instruction cycle." Connect this to Chapter 4: a saved cache cycle is a few nanoseconds, a saved DRAM cycle is ~100 ns.</li>
<li><strong>Disadvantage, in the slide's own words.</strong> "The size of the number is restricted to the size of the address field, which, in most instruction sets, is <strong>small compared with the word length</strong>." A 32-bit machine with a 12-bit immediate field cannot write <code>MOV R0, #100000</code> in one instruction — it needs two, or a load from a constant pool.</li>
<li><strong>How real machines dodge the size limit.</strong> ARM does not store a plain 8-bit constant: it stores 8 bits plus a 4-bit rotation, so a small set of large constants becomes reachable — that is exactly Figure 14.11 on slide 30. x86 simply allows 1-, 2- or 4-byte immediates and makes the instruction longer (slide 28).</li>
</ul>
<p class="dap-an">✅ Worked check with our machine state: <code>LOAD #500</code> loads the number <strong>500</strong>. Memory location 500 holds 800, but immediate mode never looks there. Zero memory references for the operand.</p>
<p class="pitfall">⚠️ Classic trap: an exam gives you <code>ADD #5</code> and a memory table, and a value sits at address 5. If you answer with M[5] you have read the mode wrong. The <code>#</code> (or <code>=</code>, depending on the textbook) means "this is the value, not the address".</p>`,
        `<p class="y-chinh">🎯 Dạng địa chỉ đơn giản nhất: toán hạng <strong>CHÍNH LÀ</strong> trường địa chỉ. Không lấy gì, không tính gì. Slide gọi nó là "dạng địa chỉ đơn giản nhất", và nó là chế độ DUY NHẤT không có địa chỉ hiệu dụng.</p>
<ul>
<li><strong>Slide nói nó dùng để làm gì.</strong> "Chế độ này dùng để <em>định nghĩa và dùng HẰNG SỐ</em> hoặc <em>đặt GIÁ TRỊ BAN ĐẦU cho biến</em>." Dịch sang C: <code>int i = 0;</code>, <code>x = x + 1;</code>, <code>if (n == 10)</code> — mọi số bạn gõ thẳng đều trở thành toán hạng tức thời.</li>
<li><strong>Con số thường được lưu ở dạng BÙ HAI.</strong> Slide nói thẳng như vậy, và nói thêm rằng <strong>bit trái nhất của trường toán hạng dùng làm bit dấu</strong>. Nên một trường tức thời k bit chứa được từ −2<sup>k−1</sup> tới +2<sup>k−1</sup>−1, KHÔNG phải 0 tới 2<sup>k</sup>−1. Với trường 8 bit thì đó là <strong>−128 … +127</strong>.</li>
<li><strong>Ưu điểm, đúng chữ của slide.</strong> "Không cần lần đọc bộ nhớ nào ngoài chính lần nạp lệnh để lấy toán hạng, do đó <strong>tiết kiệm một chu kỳ bộ nhớ hoặc cache</strong> trong chu trình lệnh." Nối sang Chương 4: tiết kiệm một chu kỳ cache là vài nano giây, tiết kiệm một chu kỳ DRAM là ~100 ns.</li>
<li><strong>Nhược điểm, đúng chữ của slide.</strong> "Kích thước của con số bị giới hạn bởi kích thước trường địa chỉ, mà ở hầu hết tập lệnh thì trường này <strong>NHỎ so với độ dài từ</strong>." Máy 32 bit mà trường tức thời chỉ 12 bit thì không viết nổi <code>MOV R0, #100000</code> trong một lệnh — phải dùng hai lệnh, hoặc nạp từ một vùng hằng.</li>
<li><strong>Máy thật né giới hạn kích thước ra sao.</strong> ARM không lưu một hằng 8 bit trần: nó lưu 8 bit CỘNG một trường quay 4 bit, nhờ đó với tới được một tập nhỏ các hằng LỚN — đúng là Figure 14.11 ở slide 30. x86 thì đơn giản cho phép hằng tức thời 1, 2 hoặc 4 byte và chấp nhận lệnh dài ra (slide 28).</li>
</ul>
<p class="dap-an">✅ Kiểm bằng trạng thái máy dùng chung: <code>LOAD #500</code> nạp con số <strong>500</strong>. Ô nhớ 500 chứa 800, nhưng chế độ tức thời KHÔNG BAO GIỜ nhìn vào đó. Không lần đọc bộ nhớ nào cho toán hạng.</p>
<p class="pitfall">⚠️ Bẫy kinh điển: đề cho <code>ADD #5</code> kèm một bảng bộ nhớ, và ở địa chỉ 5 có sẵn một giá trị. Trả lời M[5] là đã đọc sai chế độ. Dấu <code>#</code> (hoặc <code>=</code>, tuỳ giáo trình) nghĩa là "đây là GIÁ TRỊ, không phải địa chỉ".</p>`],

      [6, 'Direct Addressing — EA = A',
        `<p class="y-chinh">🎯 The five cards on this slide say the whole mode: the <strong>address field contains the effective address of the operand</strong>, so <strong>EA = A</strong>. One memory reference, no calculation, nothing clever.</p>
<ul>
<li><strong>Card 1 and card 2 are the definition.</strong> "Address field contains the effective address of the operand" and "Effective address (EA) = address field (A)". Contrast with immediate: there the field was the <em>value</em>; here it is the <em>address of the value</em>.</li>
<li><strong>Card 3: "Was common in earlier generations of computers."</strong> Past tense, and the slide means it. Direct addressing was the workhorse of machines with 12- to 18-bit words (the PDP-8 on slide 23 is exactly that era). Modern ISAs barely use it, because of card 5.</li>
<li><strong>Card 4: "Requires only one memory reference and no special calculation."</strong> That is the advantage — it is the cheapest mode that can actually reach memory. No adder in the address path, so the address is ready the moment the instruction is decoded.</li>
<li><strong>Card 5: "Limitation is that it provides only a limited address space."</strong> This is the killer, and it is arithmetic. A k-bit address field reaches exactly 2<sup>k</sup> locations. 12 bits → 4096 words. 16 bits → 65 536. Meanwhile a modern program wants 2<sup>32</sup> or 2<sup>48</sup>. You cannot put a 48-bit address field in a 32-bit instruction, so direct addressing simply cannot reach modern memory.</li>
<li><strong>What replaced it.</strong> Everything after this slide. Indirect (slide 7) reaches far by storing the address in memory; register indirect (slide 9) by storing it in a register; displacement (slide 10) by adding a big register to a small field. Direct addressing survives today only for small, fixed things — I/O port numbers, absolute jumps in bootloaders.</li>
</ul>
<p class="dap-an">✅ Worked check: <code>LOAD 500</code> in direct mode → EA = 500 → value = M[500] = <strong>800</strong>. One memory read for the operand.</p>
<p class="pitfall">⚠️ Note that the extracted text of this slide is empty — every word above lives inside the SmartArt graphic, so the text export produces only the title. When revising from a text dump rather than the slides, this is exactly the kind of slide that silently disappears.</p>`,
        `<p class="y-chinh">🎯 Năm tấm thẻ trên slide này nói trọn cả chế độ: <strong>trường địa chỉ chứa CHÍNH địa chỉ hiệu dụng của toán hạng</strong>, nên <strong>EA = A</strong>. Một lần đọc bộ nhớ, không phải tính toán gì, không có mẹo nào.</p>
<ul>
<li><strong>Thẻ 1 và thẻ 2 là định nghĩa.</strong> "Address field contains the effective address of the operand" và "Effective address (EA) = address field (A)". So với tức thời: ở đó trường là <em>GIÁ TRỊ</em>; ở đây trường là <em>ĐỊA CHỈ CỦA giá trị</em>.</li>
<li><strong>Thẻ 3: "Was common in earlier generations of computers" — từng phổ biến ở các thế hệ máy TRƯỚC.</strong> Thì quá khứ, và slide cố ý dùng nó. Địa chỉ trực tiếp là ngựa thồ của những máy có từ 12–18 bit (PDP-8 ở slide 23 chính là thời ấy). Tập lệnh hiện đại gần như không dùng, vì thẻ 5.</li>
<li><strong>Thẻ 4: "Requires only one memory reference and no special calculation."</strong> Đó là ưu điểm — nó là chế độ RẺ NHẤT trong số các chế độ thật sự với tới bộ nhớ. Không có bộ cộng trên đường địa chỉ, nên địa chỉ sẵn sàng ngay khi lệnh vừa giải mã xong.</li>
<li><strong>Thẻ 5: "Limitation is that it provides only a limited address space."</strong> Đây là đòn chí mạng, và nó là số học thuần tuý. Trường địa chỉ k bit với tới đúng 2<sup>k</sup> ô. 12 bit → 4096 từ. 16 bit → 65 536. Trong khi chương trình hiện đại cần 2<sup>32</sup> hay 2<sup>48</sup>. Bạn không thể nhét một trường địa chỉ 48 bit vào một lệnh 32 bit, nên địa chỉ trực tiếp đơn giản là KHÔNG với tới nổi bộ nhớ ngày nay.</li>
<li><strong>Cái gì thay thế nó.</strong> Tất cả những gì đứng sau slide này. Gián tiếp (slide 7) với xa bằng cách cất địa chỉ trong bộ nhớ; gián tiếp qua thanh ghi (slide 9) bằng cách cất trong thanh ghi; độ dời (slide 10) bằng cách cộng một thanh ghi LỚN vào một trường NHỎ. Địa chỉ trực tiếp ngày nay chỉ còn sống ở những thứ nhỏ và cố định — số hiệu cổng I/O, lệnh nhảy tuyệt đối trong bootloader.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng trạng thái dùng chung: <code>LOAD 500</code> chế độ trực tiếp → EA = 500 → giá trị = M[500] = <strong>800</strong>. Một lần đọc bộ nhớ cho toán hạng.</p>
<p class="pitfall">⚠️ Lưu ý bản trích chữ của slide này TRỐNG — mọi chữ ở trên nằm bên trong hình SmartArt, nên bản xuất text chỉ ra được cái tiêu đề. Ôn bằng bản chép chữ thay vì bằng slide thì đây đúng là loại slide biến mất không kêu một tiếng.</p>`],

      [7, 'Indirect Addressing — EA = (A)',
        `<p class="y-chinh">🎯 The address field no longer names the operand; it names <strong>a word in memory which contains a full-length address of the operand</strong>. Written <code>EA = (A)</code>, and the slide reminds you that <strong>parentheses are to be interpreted as meaning "contents of"</strong>.</p>
<ul>
<li><strong>The advantage, stated as arithmetic on the slide.</strong> "For a word length of N an address space of 2<sup>N</sup> is now available." The point: the <em>instruction's</em> address field is small, but the <em>memory word</em> it points to is a full word wide. So the reachable space stops depending on the instruction format and starts depending on the word size. On a 32-bit machine that is 4 GiB instead of a few kilobytes.</li>
<li><strong>The disadvantage, also stated exactly.</strong> "Instruction execution requires <strong>two</strong> memory references to fetch the operand — one to get its address and a second to get its value." Price this with Chapter 4 numbers: if both miss the cache, one operand costs ~200 ns instead of ~100 ns. That is why RISC machines (Chapter 17) removed this mode entirely.</li>
<li><strong>Multilevel / cascaded indirection.</strong> The slide mentions "a rarely used variant": <code>EA = ( . . . (A) . . . )</code>, where you keep following pointers. "Disadvantage is that <strong>three or more</strong> memory references could be required." Hardware usually signals "follow again" with one bit in the pointer word — see the <strong>I</strong> (indirect) bit in the PDP-10 format on slide 24.</li>
<li><strong>Why any machine wanted this.</strong> It is how you get a <em>pointer variable</em> when your instruction format has no room for a pointer. Before general-purpose register files were cheap, indirect addressing through a memory cell was the only way to walk a data structure or implement a subroutine return.</li>
<li><strong>Connect to PRF192.</strong> Indirect addressing is <code>*p</code> where <code>p</code> is a <em>global variable in memory</em>. Register indirect (next slide but one) is <code>*p</code> where the compiler has kept <code>p</code> in a register. Same C source, one memory reference apart — and that is a large part of what an optimising compiler buys you.</li>
</ul>
<p class="dap-an">✅ Worked check: <code>LOAD 500</code> in indirect mode. Step 1: read the pointer, M[500] = 800, so EA = 800. Step 2: read the operand, M[800] = <strong>600</strong>. Two memory reads. Compare direct mode on the same instruction: 800. Different answer, same bits in the instruction.</p>
<p class="pitfall">⚠️ The most common wrong answer in the whole chapter is stopping after step 1 and writing 800. The exam asks for the <em>operand</em>, and 800 is the <em>address</em> of the operand. Write both lines out — "EA = …, value = …" — and you cannot make this mistake.</p>`,
        `<p class="y-chinh">🎯 Trường địa chỉ không còn nêu tên toán hạng nữa; nó nêu tên <strong>một từ trong bộ nhớ mà từ đó CHỨA địa chỉ đầy đủ của toán hạng</strong>. Viết là <code>EA = (A)</code>, và slide nhắc lại rằng <strong>dấu ngoặc phải hiểu là "nội dung của"</strong>.</p>
<ul>
<li><strong>Ưu điểm, slide phát biểu thành số học.</strong> "Với độ dài từ là N thì nay có được không gian địa chỉ 2<sup>N</sup>." Ý là: trường địa chỉ <em>TRONG LỆNH</em> thì nhỏ, nhưng <em>Ô NHỚ</em> mà nó trỏ tới thì rộng nguyên một từ. Nên không gian với tới được thôi phụ thuộc vào khuôn dạng lệnh, mà chuyển sang phụ thuộc vào ĐỘ DÀI TỪ. Máy 32 bit thì đó là 4 GiB thay vì vài kilobyte.</li>
<li><strong>Nhược điểm, cũng phát biểu chính xác.</strong> "Thực thi lệnh cần <strong>HAI</strong> lần đọc bộ nhớ để lấy toán hạng — một lần lấy địa chỉ của nó, lần thứ hai lấy giá trị." Định giá bằng số của Chương 4: nếu cả hai đều trượt cache thì một toán hạng tốn ~200 ns thay vì ~100 ns. Đó là lý do máy RISC (Chương 17) xoá hẳn chế độ này.</li>
<li><strong>Gián tiếp NHIỀU MỨC (cascaded).</strong> Slide nhắc tới "một biến thể hiếm dùng": <code>EA = ( . . . (A) . . . )</code>, cứ đi theo con trỏ mãi. "Nhược điểm là có thể cần <strong>BA hoặc NHIỀU HƠN</strong> lần đọc bộ nhớ." Phần cứng thường báo "đi tiếp" bằng MỘT bit trong chính từ con trỏ — xem bit <strong>I</strong> (indirect) trong khuôn dạng PDP-10 ở slide 24.</li>
<li><strong>Vì sao có máy cần thứ này.</strong> Đây là cách có được một <em>BIẾN CON TRỎ</em> khi khuôn dạng lệnh không còn chỗ chứa một con trỏ. Thời tệp thanh ghi đa dụng còn đắt, đi gián tiếp qua một ô nhớ là cách DUY NHẤT để duyệt một cấu trúc dữ liệu hay cài đặt lệnh quay về từ chương trình con.</li>
<li><strong>Nối sang PRF192.</strong> Gián tiếp chính là <code>*p</code> khi <code>p</code> là một <em>BIẾN TOÀN CỤC nằm trong bộ nhớ</em>. Gián tiếp qua thanh ghi (slide 9) là <code>*p</code> khi trình biên dịch đã giữ <code>p</code> trong một thanh ghi. Cùng một dòng C, cách nhau đúng MỘT lần đọc bộ nhớ — và đó là phần lớn giá trị mà một trình biên dịch tối ưu mang lại cho bạn.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng trạng thái dùng chung: <code>LOAD 500</code> chế độ gián tiếp. Bước 1: đọc con trỏ, M[500] = 800, vậy EA = 800. Bước 2: đọc toán hạng, M[800] = <strong>600</strong>. Hai lần đọc bộ nhớ. So với chế độ trực tiếp trên đúng lệnh đó: 800. Đáp án khác hẳn, mà bit trong lệnh y hệt nhau.</p>
<p class="pitfall">⚠️ Đáp án sai phổ biến nhất của cả chương là dừng sau bước 1 và ghi 800. Đề hỏi <em>TOÁN HẠNG</em>, còn 800 là <em>ĐỊA CHỈ</em> của toán hạng. Cứ viết đủ hai dòng — "EA = …, giá trị = …" — là không thể mắc lỗi này.</p>`],

      [8, 'Register Addressing — EA = R',
        `<p class="y-chinh">🎯 The same idea as direct addressing, but the field names a <strong>register instead of a main memory address</strong>. <code>EA = R</code>, and the operand is the contents of that register. The slide lays it out as a four-quadrant chart: definition · formula · advantages · disadvantage.</p>
<table>
<tr><th>Quadrant</th><th>What the slide says</th><th>Why it matters</th></tr>
<tr><td>Top left</td><td>"Address field refers to a <strong>register</strong> rather than a main memory address"</td><td>The whole mode in one line</td></tr>
<tr><td>Top right</td><td><code>EA = R</code></td><td>Note: no parentheses on R — the register itself <em>is</em> the operand location</td></tr>
<tr><td>Bottom left</td><td>Advantages: "Only a <strong>small address field</strong> is needed in the instruction" · "<strong>No time-consuming memory references</strong> are required"</td><td>These two are why every modern ISA is register-based</td></tr>
<tr><td>Bottom right</td><td>Disadvantage: "The address space is <strong>very limited</strong>"</td><td>8, 16 or 32 registers, and that is all you can name</td></tr>
</table>
<ul>
<li><strong>Do the arithmetic on "small address field".</strong> Naming one of 8 registers costs 3 bits; one of 16 costs 4; one of 32 costs 5. Naming one of 2<sup>32</sup> memory words costs 32 bits. That difference of ~27 bits per operand is what lets a RISC machine fit <em>three</em> operands into one 32-bit instruction (slide 22 works this out).</li>
<li><strong>"No time-consuming memory references" is the performance story of the last 40 years.</strong> A register read is essentially free (part of the decode stage); a cache hit is a few cycles; a DRAM read is hundreds. Chapter 17 (RISC) turns this observation into a design rule: <em>all</em> arithmetic operates on registers, and only <code>LOAD</code>/<code>STORE</code> touch memory.</li>
<li><strong>The disadvantage is a compiler problem, not a hardware problem.</strong> With 32 registers the compiler must decide which variables live in registers and which get spilled to memory — that is register allocation, and it is why the same C program can run twice as fast compiled with <code>-O2</code> as with <code>-O0</code>.</li>
<li><strong>Careful with the notation.</strong> <code>EA = R</code> means the operand is <em>in</em> R. <code>EA = (R)</code> — next slide — means R holds an <em>address</em>, and the operand is in memory. One pair of parentheses, one memory reference, completely different answer.</li>
</ul>
<p class="dap-an">✅ Worked check: <code>LOAD R1</code> in register mode. R1 = 600, so the value loaded is <strong>600</strong> — the number 600 itself, not M[600]. Zero memory references.</p>
<p class="pitfall">⚠️ Exam trap built on our own machine state: register mode on R1 gives <strong>600</strong>; register-<em>indirect</em> mode on the same R1 gives M[600] = <strong>900</strong>. Both questions look identical on paper. Read the parentheses.</p>`,
        `<p class="y-chinh">🎯 Cùng một ý với địa chỉ trực tiếp, nhưng trường này nêu tên một <strong>THANH GHI thay vì một địa chỉ bộ nhớ chính</strong>. <code>EA = R</code>, và toán hạng là nội dung của thanh ghi đó. Slide trình bày thành sơ đồ bốn góc phần tư: định nghĩa · công thức · ưu điểm · nhược điểm.</p>
<table>
<tr><th>Góc</th><th>Slide viết gì</th><th>Vì sao quan trọng</th></tr>
<tr><td>Trên trái</td><td>"Address field refers to a <strong>register</strong> rather than a main memory address"</td><td>Cả chế độ gói trong một dòng</td></tr>
<tr><td>Trên phải</td><td><code>EA = R</code></td><td>Chú ý: KHÔNG có ngoặc quanh R — chính thanh ghi đó <em>LÀ</em> nơi chứa toán hạng</td></tr>
<tr><td>Dưới trái</td><td>Ưu điểm: "Chỉ cần một <strong>trường địa chỉ NHỎ</strong> trong lệnh" · "<strong>Không tốn lần đọc bộ nhớ tốn thời gian</strong> nào"</td><td>Hai điều này là lý do mọi tập lệnh hiện đại đều lấy thanh ghi làm trung tâm</td></tr>
<tr><td>Dưới phải</td><td>Nhược điểm: "Không gian địa chỉ <strong>RẤT hẹp</strong>"</td><td>8, 16 hay 32 thanh ghi, và chỉ nêu tên được ngần ấy</td></tr>
</table>
<ul>
<li><strong>Làm phép tính cho câu "trường địa chỉ nhỏ".</strong> Nêu tên 1 trong 8 thanh ghi tốn 3 bit; 1 trong 16 tốn 4; 1 trong 32 tốn 5. Nêu tên 1 trong 2<sup>32</sup> ô nhớ tốn 32 bit. Chênh lệch ~27 bit cho MỖI toán hạng đó chính là thứ cho phép máy RISC nhét <em>BA</em> toán hạng vào một lệnh 32 bit (slide 22 tính rõ ra).</li>
<li><strong>"Không tốn lần đọc bộ nhớ" là câu chuyện hiệu năng của 40 năm qua.</strong> Đọc thanh ghi gần như miễn phí (nằm trong tầng giải mã); trúng cache tốn vài chu kỳ; đọc DRAM tốn hàng trăm. Chương 17 (RISC) biến nhận xét này thành một quy tắc thiết kế: <em>MỌI</em> phép tính chỉ làm trên thanh ghi, và chỉ <code>LOAD</code>/<code>STORE</code> mới đụng bộ nhớ.</li>
<li><strong>Nhược điểm là bài toán của TRÌNH BIÊN DỊCH, không phải của phần cứng.</strong> Có 32 thanh ghi thì trình biên dịch phải quyết biến nào sống trong thanh ghi, biến nào bị "đổ" ra bộ nhớ — đó là cấp phát thanh ghi (register allocation), và là lý do cùng một chương trình C biên dịch với <code>-O2</code> có thể chạy nhanh gấp đôi so với <code>-O0</code>.</li>
<li><strong>Cẩn thận với ký hiệu.</strong> <code>EA = R</code> nghĩa là toán hạng nằm <em>TRONG</em> R. <code>EA = (R)</code> — slide kế tiếp — nghĩa là R chứa một <em>ĐỊA CHỈ</em>, còn toán hạng nằm trong bộ nhớ. Một cặp ngoặc, một lần đọc bộ nhớ, đáp án khác hẳn.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng trạng thái dùng chung: <code>LOAD R1</code> chế độ thanh ghi. R1 = 600, nên giá trị nạp vào là <strong>600</strong> — chính con số 600, không phải M[600]. Không lần đọc bộ nhớ nào.</p>
<p class="pitfall">⚠️ Bẫy đề thi dựng ngay trên trạng thái máy của ta: chế độ thanh ghi với R1 cho <strong>600</strong>; chế độ gián tiếp-qua-thanh-ghi cũng với R1 đó cho M[600] = <strong>900</strong>. Hai câu hỏi nhìn trên giấy giống hệt nhau. Hãy đọc dấu ngoặc.</p>`],

      [9, 'Register Indirect Addressing — EA = (R)',
        `<p class="y-chinh">🎯 "Analogous to indirect addressing. <strong>The only difference is whether the address field refers to a memory location or a register.</strong>" <code>EA = (R)</code> — the register holds the address, memory holds the operand.</p>
<ul>
<li><strong>How it fixes the register-mode weakness, in the slide's words.</strong> "Address space limitation of the address field is overcome by having that field refer to a <strong>word-length location containing an address</strong>." A 5-bit field names a 32-bit register, and that register can hold any address in the machine. Five bits of instruction buy you the whole address space.</li>
<li><strong>How it beats plain indirect, also in the slide's words.</strong> "<strong>Uses one less memory reference than indirect addressing.</strong>" Indirect: read pointer from memory, then read operand = 2. Register indirect: pointer is already in the CPU, so just read the operand = 1.</li>
<li><strong>Put the three "pointer" modes side by side and the pattern is obvious.</strong> Direct: the address is in the <em>instruction</em> (small, 1 reference). Indirect: the address is in <em>memory</em> (large, 2 references). Register indirect: the address is in a <em>register</em> (large, 1 reference). Register indirect wins on both axes at once — which is why it is the pointer mechanism every modern machine actually ships.</li>
<li><strong>This is the mode that makes C possible.</strong> <code>*p</code>, <code>p-&gt;field</code>, <code>malloc</code>'d memory, linked lists, function pointers, the stack pointer, the frame pointer — all of them are register indirect addressing with a displacement of zero. Compile <code>int f(int *p){return *p;}</code> for ARM and you get literally <code>LDR r0, [r0]</code>, which is <code>EA = (r0)</code>.</li>
<li><strong>Where it becomes displacement.</strong> Add a constant to the register and you have the next slide. <code>p-&gt;field</code> is <code>EA = (R) + offset_of_field</code> — the compiler knows the offset at compile time, so it is a displacement, not an extra addition at run time.</li>
</ul>
<p class="dap-an">✅ Worked check: <code>LOAD (R1)</code>. R1 = 600 so EA = 600, and the value is M[600] = <strong>900</strong>. One memory read. Compare: register mode on R1 gave 600; indirect mode on address 500 gave 600 as well but by a completely different route (M[500]=800, M[800]=600) — good reminder that matching numbers do not mean matching reasoning.</p>
<p class="meo">💡 Remember the reference count as a little ladder: <strong>immediate 0 → register 0 → direct 1 → register indirect 1 → displacement 1 → indirect 2</strong>. Exam questions of the form "which mode needs the fewest/most memory accesses?" are answered straight off this ladder.</p>`,
        `<p class="y-chinh">🎯 "Tương tự địa chỉ gián tiếp. <strong>Khác biệt DUY NHẤT là trường địa chỉ trỏ tới một ô nhớ hay một thanh ghi.</strong>" <code>EA = (R)</code> — thanh ghi giữ địa chỉ, bộ nhớ giữ toán hạng.</p>
<ul>
<li><strong>Nó vá điểm yếu của chế độ thanh ghi ra sao, đúng chữ slide.</strong> "Giới hạn không gian địa chỉ của trường địa chỉ được khắc phục bằng cách cho trường đó trỏ tới một <strong>ô rộng nguyên một từ đang chứa một địa chỉ</strong>." Một trường 5 bit nêu tên một thanh ghi 32 bit, và thanh ghi ấy chứa được bất kỳ địa chỉ nào trong máy. Năm bit trong lệnh mua được cả không gian địa chỉ.</li>
<li><strong>Nó thắng gián tiếp thuần ra sao, cũng đúng chữ slide.</strong> "<strong>Dùng ÍT HƠN MỘT lần đọc bộ nhớ so với địa chỉ gián tiếp.</strong>" Gián tiếp: đọc con trỏ từ bộ nhớ, rồi đọc toán hạng = 2. Gián tiếp qua thanh ghi: con trỏ đã nằm sẵn trong CPU, nên chỉ cần đọc toán hạng = 1.</li>
<li><strong>Đặt ba chế độ "con trỏ" cạnh nhau là thấy ngay quy luật.</strong> Trực tiếp: địa chỉ nằm trong <em>LỆNH</em> (nhỏ, 1 lần). Gián tiếp: địa chỉ nằm trong <em>BỘ NHỚ</em> (lớn, 2 lần). Gián tiếp qua thanh ghi: địa chỉ nằm trong <em>THANH GHI</em> (lớn, 1 lần). Gián tiếp qua thanh ghi thắng trên cả hai trục cùng lúc — nên nó mới là cơ chế con trỏ mà mọi máy hiện đại thật sự xuất xưởng.</li>
<li><strong>Đây là chế độ khiến ngôn ngữ C tồn tại được.</strong> <code>*p</code>, <code>p-&gt;field</code>, vùng nhớ <code>malloc</code>, danh sách liên kết, con trỏ hàm, con trỏ ngăn xếp, con trỏ khung — tất cả đều là gián tiếp qua thanh ghi với độ dời bằng 0. Biên dịch <code>int f(int *p){return *p;}</code> cho ARM thì bạn nhận đúng <code>LDR r0, [r0]</code>, chính là <code>EA = (r0)</code>.</li>
<li><strong>Chỗ nó biến thành độ dời.</strong> Cộng thêm một hằng vào thanh ghi là ra slide kế tiếp. <code>p-&gt;field</code> chính là <code>EA = (R) + độ_dời_của_trường</code> — trình biên dịch biết độ dời ngay lúc dịch, nên đó là một độ dời chứ không phải một phép cộng thêm lúc chạy.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng trạng thái dùng chung: <code>LOAD (R1)</code>. R1 = 600 nên EA = 600, và giá trị là M[600] = <strong>900</strong>. Một lần đọc bộ nhớ. So sánh: chế độ thanh ghi với R1 cho 600; chế độ gián tiếp với địa chỉ 500 cũng cho 600 nhưng qua một đường hoàn toàn khác (M[500]=800, M[800]=600) — nhắc nhở tốt rằng số trùng nhau không có nghĩa là lập luận trùng nhau.</p>
<p class="meo">💡 Nhớ số lần truy cập như một cái thang nhỏ: <strong>tức thời 0 → thanh ghi 0 → trực tiếp 1 → gián tiếp qua thanh ghi 1 → độ dời 1 → gián tiếp 2</strong>. Câu hỏi dạng "chế độ nào cần ít/nhiều lần truy cập bộ nhớ nhất?" trả lời thẳng từ cái thang này.</p>`],

      [10, 'Displacement Addressing — EA = A + (R)',
        `<p class="y-chinh">🎯 The mode that "<strong>combines the capabilities of direct addressing and register indirect addressing</strong>". <code>EA = A + (R)</code>: take a number printed in the instruction, add the contents of a register, and use the sum as the address. It is the most used mode on every modern machine.</p>
<ul>
<li><strong>It requires two address fields.</strong> The slide is explicit: "Requires that the instruction have <strong>two address fields, at least one of which is explicit</strong>." One field holds the constant A and is used directly; the other names a register whose contents are added to A. "At least one of which is explicit" is the escape hatch — sometimes the register is <em>implicit</em>, i.e. always the same one, and then it needs no bits at all (PC-relative is exactly that case).</li>
<li><strong>Why the combination is more than the sum of its parts.</strong> Direct addressing gives you a fixed address but a tiny reach. Register indirect gives you full reach but no way to say "a bit further along". Displacement gives you full reach (from the register) <em>plus</em> a compile-time offset (from A) at a cost of one memory reference and one adder. That covers arrays, structs, stack frames and relocation in a single mechanism.</li>
<li><strong>The three named uses on the slide.</strong> "Most common uses: <strong>Relative addressing</strong> · <strong>Base-register addressing</strong> · <strong>Indexing</strong>." Slides 11, 12 and 13 take them one at a time. They use the <em>same formula</em> and differ only in <em>which part is big and which part is small</em>, and in who sets the register.</li>
</ul>
<table>
<tr><th>Variant</th><th>Register used</th><th>Who sets the register</th><th>Which part is big</th><th>Typical use</th></tr>
<tr><td>Relative</td><td><strong>PC</strong> (implicit)</td><td>the hardware, automatically</td><td>the register (PC)</td><td>branches, position-independent code</td></tr>
<tr><td>Base-register</td><td>a <strong>base register</strong></td><td>the OS / loader, once per segment</td><td>the register (segment base)</td><td>segmentation, relocation</td></tr>
<tr><td>Indexing</td><td>an <strong>index register</strong></td><td>the program, every loop iteration</td><td><em>A</em> (the array's base address)</td><td>arrays, iteration</td></tr>
</table>
<ul>
<li><strong>The disadvantage in Table 14.1 is one word: "Complexity".</strong> Concretely: an extra adder in the address path, extra bits in the instruction to name the register, and a mode field big enough to say which variant is meant. Slide 15 (the x86 diagram) shows how baroque this gets when a machine supports every variant at once.</li>
<li><strong>Connect to PRF192 in one line.</strong> <code>a[i]</code> is displacement addressing: A is the base address of <code>a</code>, (R) is <code>i</code> scaled by the element size. <code>s.field</code> is displacement addressing: (R) is the address of <code>s</code>, A is the fixed offset of <code>field</code>. Two of the most common things you write in C, both compiled to one instruction each thanks to this mode.</li>
</ul>
<p class="dap-an">✅ Worked check: <code>LOAD 500</code> with R = R1 (= 600) → EA = 500 + 600 = 1100 → value = M[1100] = <strong>450</strong>. With R = R2 (= 200) instead → EA = 500 + 200 = 700 → value = M[700] = <strong>250</strong>. Same instruction bits, different register, different answer — which is why the mode field must say <em>which</em> register.</p>
<p class="pitfall">⚠️ A is normally a <strong>signed twos-complement</strong> number, so displacement can go backwards. If an exam gives A = −300 and (PC) = 1000, the answer is EA = 700, not 1300. Check the sign bit before you add.</p>`,
        `<p class="y-chinh">🎯 Chế độ "<strong>ghép năng lực của địa chỉ TRỰC TIẾP với địa chỉ GIÁN TIẾP QUA THANH GHI</strong>". <code>EA = A + (R)</code>: lấy một con số in trong lệnh, cộng nội dung một thanh ghi, rồi dùng tổng làm địa chỉ. Đây là chế độ được dùng NHIỀU NHẤT trên mọi máy hiện đại.</p>
<ul>
<li><strong>Nó đòi HAI trường địa chỉ.</strong> Slide nói rõ: "Đòi hỏi lệnh phải có <strong>HAI trường địa chỉ, ít nhất một trong hai là tường minh</strong>." Một trường giữ hằng A và dùng trực tiếp; trường kia nêu tên một thanh ghi mà nội dung của nó được cộng vào A. Câu "ít nhất một tường minh" là cửa thoát — đôi khi thanh ghi là <em>NGẦM</em>, tức luôn là cùng một thanh ghi, và khi đó nó không tốn bit nào (PC-relative chính là ca đó).</li>
<li><strong>Vì sao phép ghép này LỚN HƠN tổng hai phần.</strong> Trực tiếp cho bạn một địa chỉ cố định nhưng tầm với tí hon. Gián tiếp qua thanh ghi cho tầm với đầy đủ nhưng không có cách nói "nhích thêm một chút". Độ dời cho tầm với đầy đủ (từ thanh ghi) <em>CỘNG</em> một độ lệch biết từ lúc dịch (từ A), giá phải trả là một lần đọc bộ nhớ và một bộ cộng. Chừng đó phủ được mảng, struct, khung ngăn xếp và di dời chương trình — trong MỘT cơ chế.</li>
<li><strong>Ba cách dùng được nêu tên trên slide.</strong> "Most common uses: <strong>Relative addressing</strong> · <strong>Base-register addressing</strong> · <strong>Indexing</strong>." Slide 11, 12 và 13 dạy từng cái một. Chúng dùng <em>CÙNG MỘT công thức</em> và chỉ khác nhau ở chỗ <em>phần nào LỚN, phần nào NHỎ</em>, và ai là người đặt giá trị cho thanh ghi.</li>
</ul>
<table>
<tr><th>Biến thể</th><th>Thanh ghi dùng</th><th>Ai đặt giá trị thanh ghi</th><th>Phần nào lớn</th><th>Dùng điển hình</th></tr>
<tr><td>Relative — tương đối</td><td><strong>PC</strong> (ngầm)</td><td>phần cứng, tự động</td><td>thanh ghi (PC)</td><td>lệnh nhảy, mã chạy được ở mọi vị trí</td></tr>
<tr><td>Base-register — thanh ghi nền</td><td>một <strong>thanh ghi nền</strong></td><td>HĐH / bộ nạp, mỗi phân đoạn đặt một lần</td><td>thanh ghi (nền của đoạn)</td><td>phân đoạn, di dời chương trình</td></tr>
<tr><td>Indexing — chỉ số</td><td>một <strong>thanh ghi chỉ số</strong></td><td>chương trình, mỗi vòng lặp đổi một lần</td><td><em>A</em> (địa chỉ nền của mảng)</td><td>mảng, lặp</td></tr>
</table>
<ul>
<li><strong>Nhược điểm trong Table 14.1 gói trong một chữ: "Complexity" (phức tạp).</strong> Cụ thể: thêm một bộ cộng trên đường địa chỉ, thêm bit trong lệnh để nêu tên thanh ghi, và một trường chế độ đủ rộng để nói đang dùng biến thể nào. Slide 15 (sơ đồ x86) cho thấy chuyện này rối tới mức nào khi một cỗ máy đỡ hết mọi biến thể cùng lúc.</li>
<li><strong>Nối sang PRF192 trong một dòng.</strong> <code>a[i]</code> là địa chỉ độ dời: A là địa chỉ nền của <code>a</code>, còn (R) là <code>i</code> đã nhân với kích thước phần tử. <code>s.field</code> cũng là địa chỉ độ dời: (R) là địa chỉ của <code>s</code>, A là độ lệch cố định của <code>field</code>. Hai thứ bạn viết thường xuyên nhất trong C, cả hai đều dịch ra ĐÚNG MỘT lệnh, nhờ chế độ này.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng trạng thái dùng chung: <code>LOAD 500</code> với R = R1 (= 600) → EA = 500 + 600 = 1100 → giá trị = M[1100] = <strong>450</strong>. Nếu thay bằng R = R2 (= 200) → EA = 500 + 200 = 700 → giá trị = M[700] = <strong>250</strong>. Cùng bit lệnh, khác thanh ghi, khác đáp án — nên trường chế độ bắt buộc phải nói rõ là thanh ghi NÀO.</p>
<p class="pitfall">⚠️ A thường là số <strong>BÙ HAI CÓ DẤU</strong>, nên độ dời đi lùi được. Đề cho A = −300 và (PC) = 1000 thì đáp án là EA = 700, không phải 1300. Kiểm bit dấu trước khi cộng.</p>`,
      ],

      [11, 'Relative Addressing — the implicitly referenced register is the PC',
        `<p class="y-chinh">🎯 The first named variant of displacement. <strong>The implicitly referenced register is the program counter (PC)</strong>, so <code>EA = A + (PC)</code> and the instruction spends <em>no bits at all</em> naming the register.</p>
<ul>
<li><strong>The three bullets under the headline, exactly as printed.</strong> "The <strong>next instruction address</strong> is added to the address field to produce the EA" · "Typically the address field is treated as a <strong>twos complement</strong> number for this operation" · "Thus the effective address is a <strong>displacement relative to the address of the instruction</strong>."</li>
<li><strong>Read "next instruction address" carefully — it is the exam's favourite off-by-one.</strong> By the time the address is computed, the PC has already been incremented during the fetch stage. So PC-relative is measured from the instruction <em>after</em> the branch, not from the branch itself. ARM makes it worse: on classic ARM the PC reads as the branch address + 8 because of the pipeline.</li>
<li><strong>Twos complement is what makes backward branches possible.</strong> Every loop in every program ends with a backward branch, so a displacement field that could only go forward would be useless. A k-bit signed field reaches from −2<sup>k−1</sup> to +2<sup>k−1</sup>−1 instructions away.</li>
<li><strong>"Exploits the concept of locality."</strong> The slide says this in its own box, and it is the link back to Chapter 4. Branch targets are almost always nearby — inside the same loop, the same function — which is exactly why a short displacement field is enough almost all of the time.</li>
<li><strong>"Saves address bits in the instruction if most memory references are relatively near to the instruction being executed."</strong> That is the payoff sentence. A 24-bit PC-relative field on ARM replaces a 32-bit absolute address <em>and</em> reaches ±32 MB (slide 18 computes it). Eight bits saved on the single most frequent class of instruction is a large win over a whole program.</li>
<li><strong>The second, quieter benefit: position independence.</strong> Code that only ever branches relative to the PC runs correctly no matter where it is loaded. That is what makes shared libraries, ASLR and relocatable object files work — and it is also why the loader does not have to patch every branch.</li>
</ul>
<p class="dap-an">✅ Worked check with our machine state, PC = 1000. Forward: <code>LOAD 500</code> PC-relative → EA = 500 + 1000 = 1500 → value M[1500] = <strong>777</strong>. Backward: displacement A = −300 → EA = 1000 − 300 = <strong>700</strong> → value M[700] = <strong>250</strong>. Both verified by machine.</p>
<p class="pitfall">⚠️ Two traps in one: (1) using the address of the <em>current</em> instruction instead of the next one, and (2) reading the displacement as unsigned. If a question gives you an 8-bit displacement of <code>0xF0</code>, that is <strong>−16</strong>, not +240.</p>`,
        `<p class="y-chinh">🎯 Biến thể có tên đầu tiên của độ dời. <strong>Thanh ghi được tham chiếu NGẦM chính là bộ đếm chương trình (PC)</strong>, nên <code>EA = A + (PC)</code> và lệnh KHÔNG tốn một bit nào để nêu tên thanh ghi.</p>
<ul>
<li><strong>Ba gạch đầu dòng dưới tiêu đề, đúng nguyên văn.</strong> "<strong>Địa chỉ của lệnh KẾ TIẾP</strong> được cộng vào trường địa chỉ để tạo ra EA" · "Trường địa chỉ thường được coi là số <strong>BÙ HAI</strong> cho phép toán này" · "Do đó địa chỉ hiệu dụng là một <strong>độ dời TƯƠNG ĐỐI so với địa chỉ của lệnh</strong>."</li>
<li><strong>Đọc kỹ chữ "địa chỉ lệnh KẾ TIẾP" — đây là lỗi lệch-một mà đề thi thích nhất.</strong> Tới lúc tính địa chỉ thì PC đã được tăng từ tầng nạp lệnh rồi. Nên PC-relative đo từ lệnh <em>SAU</em> lệnh nhảy, không phải từ chính lệnh nhảy. ARM còn tệ hơn: trên ARM cổ điển, PC đọc ra bằng địa chỉ lệnh nhảy + 8 vì đường ống.</li>
<li><strong>Bù hai là thứ khiến nhảy LÙI làm được.</strong> Mọi vòng lặp trong mọi chương trình đều kết thúc bằng một lần nhảy lùi, nên một trường độ dời chỉ đi tiến được sẽ vô dụng. Trường k bit có dấu với tới từ −2<sup>k−1</sup> tới +2<sup>k−1</sup>−1 lệnh.</li>
<li><strong>"Exploits the concept of locality" — khai thác chính khái niệm tính cục bộ.</strong> Slide ghi câu này thành một khối riêng, và đó là sợi dây nối ngược về Chương 4. Đích nhảy gần như luôn ở gần — trong cùng vòng lặp, cùng hàm — nên một trường độ dời NGẮN là đủ dùng gần như mọi lúc.</li>
<li><strong>"Tiết kiệm bit địa chỉ trong lệnh, nếu phần lớn tham chiếu bộ nhớ nằm tương đối gần lệnh đang thực thi."</strong> Đó là câu chốt lời. Một trường PC-relative 24 bit trên ARM thay được địa chỉ tuyệt đối 32 bit <em>ĐỒNG THỜI</em> với tới ±32 MB (slide 18 tính ra). Tiết kiệm tám bit trên đúng lớp lệnh xuất hiện nhiều nhất là một cái lời rất lớn tính trên cả chương trình.</li>
<li><strong>Lợi ích thứ hai, âm thầm hơn: tính ĐỘC LẬP VỊ TRÍ.</strong> Đoạn mã chỉ nhảy tương đối theo PC thì chạy đúng bất kể được nạp vào đâu. Đó là thứ khiến thư viện dùng chung, ASLR và tệp đối tượng di dời được hoạt động — và cũng là lý do bộ nạp không phải vá lại từng lệnh nhảy.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng trạng thái dùng chung, PC = 1000. Đi tới: <code>LOAD 500</code> PC-relative → EA = 500 + 1000 = 1500 → giá trị M[1500] = <strong>777</strong>. Đi lùi: độ dời A = −300 → EA = 1000 − 300 = <strong>700</strong> → giá trị M[700] = <strong>250</strong>. Cả hai đã kiểm bằng máy.</p>
<p class="pitfall">⚠️ Hai bẫy trong một: (1) lấy địa chỉ của lệnh <em>HIỆN TẠI</em> thay vì lệnh kế tiếp, và (2) đọc độ dời như số KHÔNG DẤU. Đề cho độ dời 8 bit là <code>0xF0</code> thì đó là <strong>−16</strong>, không phải +240.</p>`],

      [12, 'Base-Register Addressing — the register holds a base, the field holds a displacement',
        `<p class="y-chinh">🎯 The second variant. "<strong>The referenced register contains a main memory address and the address field contains a displacement from that address.</strong>" Same formula <code>EA = A + (R)</code>, but here the <em>register</em> is the big number and <em>A</em> is the small one.</p>
<ul>
<li><strong>The register reference may be explicit or implicit.</strong> The slide says both happen: "In some implementations a <strong>single segment base register</strong> is employed and is used <strong>implicitly</strong>. In others the programmer may choose a register to hold the base address of a segment and the instruction must reference it <strong>explicitly</strong>." x86 does the first with its segment registers (slide 15) and the second with its general base register B (Table 14.2, slide 16).</li>
<li><strong>"Exploits the locality of memory references."</strong> One base register points at a region — a segment, a data area, a stack frame — and every access inside that region needs only a short displacement. Because programs cluster their references (Chapter 4), one base covers a very large fraction of the accesses in a procedure.</li>
<li><strong>"Convenient means of implementing segmentation."</strong> This is the direct bridge to Chapter 9 (OS support). A program is written as if it started at address 0; the loader puts the real start address into the base register; every address the program computes comes out right. Relocation for free, with no rewriting of the code.</li>
<li><strong>The difference from indexing is about who moves.</strong> With base-register addressing the <em>register stays put</em> for a long time (one segment, one frame) and the displacement varies from instruction to instruction. With indexing (next slide) the <em>register changes constantly</em> (every loop iteration) and A stays put. Same adder, opposite dynamics.</li>
<li><strong>The everyday example you have already met.</strong> Every local variable in C is base-register addressing off the frame pointer: <code>EA = (FP) + offset</code>, where the offset was fixed at compile time and the frame pointer was set on entry to the function. Recursion works precisely because each call gets a different value in that one register.</li>
</ul>
<p class="dap-an">✅ Worked check: treat R1 = 600 as the segment base and A = 500 as the displacement → EA = 600 + 500 = 1100 → value M[1100] = <strong>450</strong>. Now imagine the OS relocates the segment so R1 = 200: the same instruction gives EA = 700 → M[700] = 250. The instruction did not change at all — that is relocation.</p>
<p class="meo">💡 Tell base from index by asking "which number is the address of something, and which is an offset?" Base register = <em>register</em> holds the address. Index = <em>A</em> holds the address (of the array) and the register holds the offset (the subscript).</p>`,
        `<p class="y-chinh">🎯 Biến thể thứ hai. "<strong>Thanh ghi được tham chiếu chứa một địa chỉ bộ nhớ chính, còn trường địa chỉ chứa một độ dời so với địa chỉ đó.</strong>" Vẫn công thức <code>EA = A + (R)</code>, nhưng ở đây <em>THANH GHI</em> mới là con số LỚN, còn <em>A</em> là con số nhỏ.</p>
<ul>
<li><strong>Tham chiếu thanh ghi có thể TƯỜNG MINH hoặc NGẦM.</strong> Slide nói cả hai đều có: "Ở một số cài đặt, người ta dùng <strong>MỘT thanh ghi nền đoạn duy nhất</strong> và dùng nó một cách <strong>NGẦM ĐỊNH</strong>. Ở cài đặt khác, lập trình viên có thể chọn một thanh ghi để giữ địa chỉ nền của đoạn, và lệnh phải tham chiếu nó <strong>TƯỜNG MINH</strong>." x86 làm cách thứ nhất với các thanh ghi đoạn (slide 15), và cách thứ hai với thanh ghi nền B tổng quát (Table 14.2, slide 16).</li>
<li><strong>"Exploits the locality of memory references" — khai thác tính cục bộ của tham chiếu.</strong> Một thanh ghi nền trỏ vào một vùng — một đoạn, một vùng dữ liệu, một khung ngăn xếp — và mọi truy cập trong vùng đó chỉ cần một độ dời NGẮN. Vì chương trình cụm các tham chiếu lại (Chương 4), một cái nền phủ được phần rất lớn số truy cập trong một hàm.</li>
<li><strong>"Convenient means of implementing segmentation" — cách tiện lợi để cài đặt phân đoạn.</strong> Đây là cây cầu trực tiếp sang Chương 9 (hỗ trợ của HĐH). Chương trình được viết như thể nó bắt đầu ở địa chỉ 0; bộ nạp đặt địa chỉ bắt đầu THẬT vào thanh ghi nền; mọi địa chỉ chương trình tính ra đều đúng. Di dời miễn phí, không phải sửa lại một dòng mã nào.</li>
<li><strong>Khác indexing ở chỗ AI là người di chuyển.</strong> Với base-register thì <em>THANH GHI ĐỨNG YÊN</em> rất lâu (một đoạn, một khung) còn độ dời đổi theo từng lệnh. Với indexing (slide sau) thì <em>THANH GHI ĐỔI LIÊN TỤC</em> (mỗi vòng lặp) còn A đứng yên. Cùng một bộ cộng, động lực ngược nhau.</li>
<li><strong>Ví dụ hằng ngày bạn đã gặp.</strong> Mọi biến cục bộ trong C đều là base-register addressing tính từ con trỏ khung: <code>EA = (FP) + độ_lệch</code>, trong đó độ lệch cố định từ lúc dịch còn con trỏ khung được đặt khi vào hàm. Đệ quy chạy được CHÍNH VÌ mỗi lần gọi lại đặt một giá trị khác vào đúng cái thanh ghi ấy.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng trạng thái dùng chung: coi R1 = 600 là nền đoạn và A = 500 là độ dời → EA = 600 + 500 = 1100 → giá trị M[1100] = <strong>450</strong>. Giờ giả sử HĐH di dời đoạn nên R1 = 200: đúng lệnh đó cho EA = 700 → M[700] = 250. Lệnh KHÔNG hề đổi một bit — đó chính là di dời.</p>
<p class="meo">💡 Phân biệt base với index bằng câu hỏi "số nào là ĐỊA CHỈ của cái gì đó, số nào là ĐỘ LỆCH?". Base register = <em>THANH GHI</em> giữ địa chỉ. Index = <em>A</em> giữ địa chỉ (của mảng) còn thanh ghi giữ độ lệch (chỉ số).</p>`],

      [13, 'Indexing — plus autoindexing, postindexing and preindexing',
        `<p class="y-chinh">🎯 The third variant, and the one with the most machinery. "<strong>The address field references a main memory address and the referenced register contains a positive displacement from that address.</strong>" The slide then adds three refinements that appear on exam papers constantly: autoindexing, postindexing and preindexing.</p>
<ul>
<li><strong>"The method of calculating the EA is the same as for base-register addressing."</strong> The slide says this outright — the hardware does not care. What differs is the <em>roles</em>: here A is the array's base address (big, fixed) and (R) is the subscript (small, changing).</li>
<li><strong>"An important use is to provide an efficient mechanism for performing iterative operations."</strong> That is the whole reason indexing exists. Walking an array of 1000 elements without indexing means either 1000 different instructions or self-modifying code. With indexing it is one instruction inside a loop plus one register increment.</li>
</ul>
<table>
<tr><th>Refinement</th><th>Formula on the slide</th><th>What happens</th></tr>
<tr><td><strong>Autoindexing</strong></td><td><code>EA = A + (R)</code>, then <code>(R) ← (R) + 1</code></td><td>"Automatically increment or decrement the index register <strong>after each reference to it</strong>" — the increment is free, done by the hardware</td></tr>
<tr><td><strong>Postindexing</strong></td><td><code>EA = (A) + (R)</code></td><td>"Indexing is performed <strong>after</strong> the indirection" — follow the pointer first, then add the index</td></tr>
<tr><td><strong>Preindexing</strong></td><td><code>EA = (A + (R))</code></td><td>"Indexing is performed <strong>before</strong> the indirection" — add the index first, then follow the pointer</td></tr>
</table>
<ul>
<li><strong>Autoindexing is the <code>i++</code> of hardware.</strong> Because incrementing the index is such a universal pattern, machines built it into the addressing mode so it costs no extra instruction and no extra cycle. ARM spells the two directions as pre-index-with-writeback and post-index (slide 17 draws all three cases).</li>
<li><strong>Post vs pre in one sentence each.</strong> Postindexing: <em>A points at a pointer; index into the thing it points at.</em> That is an array reached through a pointer variable — in C, <code>ptr[i]</code> where <code>ptr</code> is a global. Preindexing: <em>A is a table of pointers; index into the table, then follow the pointer you found.</em> That is a jump table or a vtable — in C, <code>table[i](args)</code>.</li>
<li><strong>Connect to PRF192 precisely.</strong> <code>a[i]</code> with <code>a</code> a real array is plain indexing: EA = &amp;a + i×sizeof. <code>p[i]</code> with <code>p</code> a pointer is postindexing: read p, then add i×sizeof. The C standard says <code>a[i]</code> and <code>*(a+i)</code> are identical, and this slide is why the hardware agrees.</li>
</ul>
<p class="dap-an">✅ All three worked on our shared state, A = 500, index register R2 = 200 — every line verified by machine. <strong>Plain indexing:</strong> EA = 500 + 200 = 700 → M[700] = <strong>250</strong>. <strong>Postindexing:</strong> EA = (A) + (R2) = M[500] + 200 = 800 + 200 = 1000 → M[1000] = <strong>640</strong>. <strong>Preindexing:</strong> EA = (A + (R2)) = M[500 + 200] = M[700] = 250 → so EA = 250 and the value is M[250] = <strong>999</strong>. Three modes, three completely different answers from identical instruction bits.</p>
<p class="dap-an">✅ Practice problem 1 (exam style). Same state. "Instruction <code>LOAD 300</code> executes in indexed mode with R2 = 200. Then autoindexing increments R2. What is loaded, and what is R2 afterwards?" Step 1: EA = 300 + 200 = 500. Step 2: value = M[500] = <strong>800</strong>. Step 3: autoindex → R2 becomes <strong>201</strong> (or 204 on a byte-addressed machine with 4-byte words — say which assumption you are using).</p>
<p class="pitfall">⚠️ The extracted text of this slide prints autoindexing as "<code>(R) (R) + 1</code>" — the assignment arrow was dropped by the text export. The original reads <code>(R) ← (R) + 1</code>. Also note the slide says the index register holds a <strong>positive</strong> displacement; many real machines (and most exam questions) allow negative index values too.</p>`,
        `<p class="y-chinh">🎯 Biến thể thứ ba, và là cái nhiều máy móc nhất. "<strong>Trường địa chỉ tham chiếu một địa chỉ bộ nhớ chính, còn thanh ghi được tham chiếu chứa một độ dời DƯƠNG so với địa chỉ đó.</strong>" Rồi slide thêm ba tinh chỉnh mà đề thi hỏi liên tục: autoindexing, postindexing và preindexing.</p>
<ul>
<li><strong>"Cách tính EA GIỐNG HỆT base-register addressing."</strong> Slide nói thẳng như vậy — phần cứng không phân biệt. Cái khác là <em>VAI TRÒ</em>: ở đây A là địa chỉ nền của mảng (lớn, cố định) còn (R) là chỉ số (nhỏ, thay đổi).</li>
<li><strong>"Một công dụng quan trọng là cung cấp cơ chế hiệu quả để thực hiện các thao tác LẶP."</strong> Đó là toàn bộ lý do indexing tồn tại. Duyệt một mảng 1000 phần tử mà không có indexing thì hoặc phải viết 1000 lệnh khác nhau, hoặc phải tự sửa mã lệnh lúc chạy. Có indexing thì chỉ còn một lệnh trong vòng lặp cộng một lần tăng thanh ghi.</li>
</ul>
<table>
<tr><th>Tinh chỉnh</th><th>Công thức trên slide</th><th>Chuyện gì xảy ra</th></tr>
<tr><td><strong>Autoindexing</strong> — tự tăng/giảm chỉ số</td><td><code>EA = A + (R)</code>, rồi <code>(R) ← (R) + 1</code></td><td>"Tự động tăng hoặc giảm thanh ghi chỉ số <strong>sau mỗi lần tham chiếu tới nó</strong>" — phép tăng là MIỄN PHÍ, phần cứng làm</td></tr>
<tr><td><strong>Postindexing</strong> — hậu chỉ số</td><td><code>EA = (A) + (R)</code></td><td>"Việc lập chỉ số làm <strong>SAU</strong> phép gián tiếp" — đi theo con trỏ trước, rồi mới cộng chỉ số</td></tr>
<tr><td><strong>Preindexing</strong> — tiền chỉ số</td><td><code>EA = (A + (R))</code></td><td>"Việc lập chỉ số làm <strong>TRƯỚC</strong> phép gián tiếp" — cộng chỉ số trước, rồi mới đi theo con trỏ</td></tr>
</table>
<ul>
<li><strong>Autoindexing chính là <code>i++</code> của phần cứng.</strong> Vì tăng chỉ số là khuôn mẫu phổ biến tới mức ấy, người ta xây luôn nó vào trong chế độ địa chỉ để nó không tốn thêm lệnh nào và không tốn thêm chu kỳ nào. ARM gọi hai chiều đó là pre-index-có-ghi-lại và post-index (slide 17 vẽ đủ cả ba ca).</li>
<li><strong>Hậu và tiền, mỗi cái một câu.</strong> Hậu chỉ số: <em>A trỏ tới một CON TRỎ; lập chỉ số vào cái mà con trỏ đó trỏ tới.</em> Đó là mảng với tới qua một biến con trỏ — trong C là <code>ptr[i]</code> với <code>ptr</code> là biến toàn cục. Tiền chỉ số: <em>A là một BẢNG CON TRỎ; lập chỉ số vào bảng, rồi đi theo con trỏ tìm được.</em> Đó là bảng nhảy hay bảng hàm ảo — trong C là <code>table[i](args)</code>.</li>
<li><strong>Nối sang PRF192 cho chính xác.</strong> <code>a[i]</code> với <code>a</code> là mảng thật thì đó là indexing thuần: EA = &amp;a + i×sizeof. <code>p[i]</code> với <code>p</code> là con trỏ thì đó là postindexing: đọc p trước, rồi cộng i×sizeof. Chuẩn C nói <code>a[i]</code> và <code>*(a+i)</code> là một; slide này là lý do phần cứng cũng đồng ý như thế.</li>
</ul>
<p class="dap-an">✅ Giải cả ba trên trạng thái dùng chung, A = 500, thanh ghi chỉ số R2 = 200 — mọi dòng đã kiểm bằng máy. <strong>Chỉ số thuần:</strong> EA = 500 + 200 = 700 → M[700] = <strong>250</strong>. <strong>Hậu chỉ số:</strong> EA = (A) + (R2) = M[500] + 200 = 800 + 200 = 1000 → M[1000] = <strong>640</strong>. <strong>Tiền chỉ số:</strong> EA = (A + (R2)) = M[500 + 200] = M[700] = 250 → vậy EA = 250 và giá trị là M[250] = <strong>999</strong>. Ba chế độ, ba đáp án khác hẳn nhau, từ đúng những bit lệnh giống hệt.</p>
<p class="dap-an">✅ Bài luyện 1 (dạng đề thi). Cùng trạng thái. "Lệnh <code>LOAD 300</code> chạy ở chế độ chỉ số với R2 = 200. Sau đó autoindexing tăng R2. Nạp được giá trị nào, và R2 bằng bao nhiêu sau lệnh?" Bước 1: EA = 300 + 200 = 500. Bước 2: giá trị = M[500] = <strong>800</strong>. Bước 3: tự tăng → R2 thành <strong>201</strong> (hoặc 204 nếu máy đánh địa chỉ theo byte và từ dài 4 byte — hãy nói rõ bạn đang dùng giả thiết nào).</p>
<p class="pitfall">⚠️ Bản trích chữ của slide in autoindexing thành "<code>(R) (R) + 1</code>" — mũi tên gán bị rụng khi xuất chữ. Nguyên văn là <code>(R) ← (R) + 1</code>. Cũng lưu ý slide nói thanh ghi chỉ số chứa độ dời <strong>DƯƠNG</strong>; nhiều máy thật (và phần lớn đề thi) cho phép cả giá trị chỉ số ÂM.</p>`],

      [14, 'Stack Addressing — EA = top of stack, a form of implied addressing',
        `<p class="y-chinh">🎯 The seventh and last basic mode. A stack is "<strong>a linear array of locations</strong>", "sometimes referred to as a <strong>pushdown list or last-in-first-out queue</strong>", and the instruction does not need an address field at all because the operand is implicitly at the top.</p>
<ul>
<li><strong>What a stack physically is, per the slide.</strong> "A reserved block of locations. Items are appended to the top of the stack so that the block is <strong>partially filled</strong>." It is not a special hardware structure — it is ordinary memory plus a discipline.</li>
<li><strong>The pointer is the key sentence.</strong> "Associated with the stack is a <strong>pointer whose value is the address of the top of the stack</strong>. <strong>The stack pointer is maintained in a register.</strong> Thus references to stack locations in memory are in fact <strong>register indirect addresses</strong>." Read that last clause twice: stack addressing is not a new mechanism, it is register-indirect addressing on one designated register.</li>
<li><strong>"Is a form of implied addressing."</strong> The slide closes with: "The machine instructions need not include a memory reference but <strong>implicitly operate on the top of the stack</strong>." That is why <code>ADD</code> on a stack machine takes zero operands — it pops two, adds, pushes one.</li>
<li><strong>Why this is worth a mode of its own.</strong> Instruction length. A three-address <code>ADD R1, R2, R3</code> needs opcode + three register fields; a stack <code>ADD</code> needs only the opcode. Whole ISAs were built on this: the Java Virtual Machine's bytecode and the WebAssembly stack machine are stack machines for exactly this density reason.</li>
<li><strong>Where you meet it every day.</strong> Every function call in C. The return address is pushed, parameters and locals live in the frame, and <code>SP</code>/<code>FP</code> are the registers this slide is talking about. Chapter 9 (OS support) and Chapter 16 (processor structure) both lean on this.</li>
</ul>
<p class="dap-an">✅ Worked check on our state, SP = 900. <code>POP</code> reads EA = top of stack = 900 → value M[900] = <strong>300</strong>, then SP moves.</p>
<p class="dap-an">✅ Practice problem 2 (exam style). "The stack grows downwards. SP = 900. Execute <code>PUSH 111</code> then <code>PUSH 222</code> then <code>ADD</code> (pops two, pushes the sum) then <code>POP</code>. What is popped and what is SP at the end?" Step by step, one word per slot: PUSH 111 → SP = 899, M[899] = 111. PUSH 222 → SP = 898, M[898] = 222. ADD → pops 222 and 111 (SP back to 900), pushes 333 → SP = 899, M[899] = 333. POP → returns <strong>333</strong>, SP returns to <strong>900</strong>. Notice that <code>ADD</code> carried no address field at all — that is implied addressing doing its job.</p>
<p class="pitfall">⚠️ Table 14.1 lists stack addressing's disadvantage as "<strong>limited applicability</strong>". It means: a stack gives you the top two items cheaply and everything else expensively. Random access to the fiftieth item from the top is not something a stack mode can express, which is why no machine uses it as its <em>only</em> mode.</p>`,
        `<p class="y-chinh">🎯 Chế độ cơ bản thứ bảy, cũng là cuối cùng. Ngăn xếp là "<strong>một mảng tuyến tính các ô nhớ</strong>", "đôi khi gọi là <strong>danh sách đẩy xuống hoặc hàng đợi vào-sau-ra-trước (LIFO)</strong>", và lệnh KHÔNG cần trường địa chỉ nào cả vì toán hạng ngầm hiểu nằm ở ĐỈNH.</p>
<ul>
<li><strong>Ngăn xếp thực chất là gì, theo slide.</strong> "Một khối ô nhớ được dành riêng. Các mục được nối thêm vào đỉnh ngăn xếp nên khối đó <strong>chỉ đầy một phần</strong>." Nó KHÔNG phải một cấu trúc phần cứng đặc biệt — nó là bộ nhớ thường cộng một kỷ luật sử dụng.</li>
<li><strong>Câu về con trỏ mới là câu then chốt.</strong> "Đi kèm ngăn xếp là một <strong>con trỏ mà giá trị của nó là địa chỉ của đỉnh ngăn xếp</strong>. <strong>Con trỏ ngăn xếp được giữ trong một THANH GHI.</strong> Do đó các tham chiếu tới ô ngăn xếp trong bộ nhớ thực chất là <strong>địa chỉ gián tiếp qua thanh ghi</strong>." Đọc vế cuối hai lần: chế độ ngăn xếp KHÔNG phải cơ chế mới, nó là gián-tiếp-qua-thanh-ghi trên một thanh ghi được chỉ định sẵn.</li>
<li><strong>"Là một dạng của địa chỉ NGẦM."</strong> Slide khép lại bằng: "Lệnh máy không cần chứa tham chiếu bộ nhớ mà <strong>thao tác ngầm định lên đỉnh ngăn xếp</strong>." Đó là lý do lệnh <code>ADD</code> trên máy ngăn xếp có KHÔNG toán hạng — nó lấy ra hai, cộng, đẩy vào một.</li>
<li><strong>Vì sao đáng có hẳn một chế độ riêng.</strong> Độ dài lệnh. Lệnh ba địa chỉ <code>ADD R1, R2, R3</code> cần mã thao tác cộng ba trường thanh ghi; lệnh <code>ADD</code> kiểu ngăn xếp chỉ cần mã thao tác. Cả những tập lệnh lớn được xây trên ý này: bytecode của máy ảo Java và máy ngăn xếp của WebAssembly đều là máy ngăn xếp, đúng vì lý do mật độ mã này.</li>
<li><strong>Chỗ bạn gặp nó hằng ngày.</strong> Mọi lời gọi hàm trong C. Địa chỉ quay về được đẩy vào, tham số và biến cục bộ sống trong khung, còn <code>SP</code>/<code>FP</code> chính là những thanh ghi mà slide này đang nói tới. Chương 9 (hỗ trợ HĐH) và Chương 16 (cấu trúc bộ xử lý) đều tựa vào đây.</li>
</ul>
<p class="dap-an">✅ Kiểm trên trạng thái dùng chung, SP = 900. <code>POP</code> đọc EA = đỉnh ngăn xếp = 900 → giá trị M[900] = <strong>300</strong>, rồi SP dịch.</p>
<p class="dap-an">✅ Bài luyện 2 (dạng đề thi). "Ngăn xếp mọc XUỐNG. SP = 900. Thực thi <code>PUSH 111</code> rồi <code>PUSH 222</code> rồi <code>ADD</code> (lấy ra hai, đẩy vào tổng) rồi <code>POP</code>. Lấy ra được gì và SP bằng bao nhiêu ở cuối?" Từng bước, mỗi ô một từ: PUSH 111 → SP = 899, M[899] = 111. PUSH 222 → SP = 898, M[898] = 222. ADD → lấy ra 222 và 111 (SP về 900), đẩy vào 333 → SP = 899, M[899] = 333. POP → trả về <strong>333</strong>, SP về <strong>900</strong>. Để ý lệnh <code>ADD</code> KHÔNG mang trường địa chỉ nào — đó là địa chỉ ngầm đang làm việc của nó.</p>
<p class="pitfall">⚠️ Table 14.1 ghi nhược điểm của chế độ ngăn xếp là "<strong>phạm vi áp dụng hẹp</strong>". Nghĩa là: ngăn xếp cho bạn hai mục trên cùng với giá rẻ, còn mọi thứ khác với giá đắt. Truy cập ngẫu nhiên mục thứ năm mươi tính từ đỉnh là điều chế độ ngăn xếp không diễn đạt nổi, nên không máy nào dùng nó làm chế độ <em>DUY NHẤT</em>.</p>`],

      [15, 'Figure 14.2 — x86 Addressing Mode Calculation',
        `<p class="y-chinh">🎯 The diagram that shows what "flexibility, at the cost of complexity" actually looks like in silicon. It traces how x86 turns the fields of one instruction into a <strong>linear address</strong>, through two additions and one multiplication.</p>
<p class="nhan">Read the picture as a pipeline of four stages, left to right:</p>
<table>
<tr><th>Stage</th><th>Boxes on the figure</th><th>What it contributes</th></tr>
<tr><td>1. Scale the index</td><td><strong>Index Register</strong> → <strong>×</strong> ← <strong>Scale 1, 2, 4, or 8</strong></td><td>The subscript multiplied by the element size — this is <code>a[i]</code> for 1-, 2-, 4- or 8-byte elements, done in hardware</td></tr>
<tr><td>2. Add base and displacement</td><td><strong>Base Register</strong> and <strong>Displacement (in instruction; 0, 8, or 32 bits)</strong> meet the scaled index at a <strong>+</strong></td><td>Produces the box labelled <strong>Effective Address</strong></td></tr>
<tr><td>3. Add the segment base</td><td>One of <strong>CS, DS, ES, FS, GS, SS</strong> selects a <strong>Descriptor Register</strong>, whose <strong>Base Address</strong> field feeds a second <strong>+</strong></td><td>Produces the <strong>Linear Address</strong></td></tr>
<tr><td>4. Bounds</td><td>The descriptor also carries <strong>Limit</strong> and <strong>Access Rights</strong>, drawn against the segment on the right</td><td>Protection — the hardware checks the address is inside the segment</td></tr>
</table>
<ul>
<li><strong>The general formula the picture encodes:</strong> <code>LA = (SR) + (B) + (I) × S + A</code>. Every row of Table 14.2 on the next slide is this formula with some terms set to zero.</li>
<li><strong>The Scale box is the star.</strong> "1, 2, 4, or 8" is not arbitrary — those are the sizes of <code>char</code>, <code>short</code>, <code>int</code>/<code>float</code> and <code>double</code>/pointer. Intel put a shifter in the address path specifically so that <code>a[i]</code> in C costs exactly one instruction regardless of element type.</li>
<li><strong>Displacement "0, 8, or 32 bits" is instruction-format news, not addressing news.</strong> It is the first hint of slide 28: x86 instructions are variable length precisely because fields like this one can be absent, short or long.</li>
<li><strong>Two additions means two levels of address.</strong> Effective address is <em>within a segment</em>; linear address is <em>within the whole address space</em>. Chapter 9 continues the story — the linear address then goes through paging to become a physical address.</li>
<li><strong>Compare with ARM (slide 17) to feel the philosophy gap.</strong> ARM's load/store addressing is base + offset with optional writeback, drawn in three small panels. x86 needs this whole diagram. Chapter 17 (RISC) is the argument that the extra generality was not worth it.</li>
</ul>
<p class="dap-an">✅ Worked check in x86 style. Take <code>MOV EAX, [EBX + ECX*4 + 500]</code> with EBX = 600 (base) and ECX = 50 (index), scale S = 4, displacement A = 500, and assume a flat model so the segment base is 0. EA = 600 + 50×4 + 500 = 600 + 200 + 500 = <strong>1300</strong>. Then LA = 0 + 1300 = <strong>1300</strong>. Change the scale to 8 and EA becomes 600 + 400 + 500 = 1500 — one field, a 200-byte difference.</p>
<p class="meo">💡 When an x86 addressing question looks frightening, write the formula <code>LA = (SR) + (B) + (I)×S + A</code> on your paper first, then fill in zeros for the parts the question does not mention. Every x86 mode is a special case of that one line.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ cho thấy "mềm dẻo, đổi bằng phức tạp" trông ra sao khi đã thành mạch điện. Nó lần theo cách x86 biến các trường của MỘT lệnh thành một <strong>địa chỉ tuyến tính</strong>, qua hai phép cộng và một phép nhân.</p>
<p class="nhan">Đọc bức hình như một dây chuyền bốn chặng, từ trái sang phải:</p>
<table>
<tr><th>Chặng</th><th>Các ô trên hình</th><th>Nó đóng góp gì</th></tr>
<tr><td>1. Nhân tỉ lệ chỉ số</td><td><strong>Index Register</strong> → <strong>×</strong> ← <strong>Scale 1, 2, 4, or 8</strong></td><td>Chỉ số nhân với kích thước phần tử — chính là <code>a[i]</code> cho phần tử 1, 2, 4 hay 8 byte, làm bằng phần cứng</td></tr>
<tr><td>2. Cộng nền và độ dời</td><td><strong>Base Register</strong> và <strong>Displacement (in instruction; 0, 8, or 32 bits)</strong> gặp chỉ số đã nhân ở một dấu <strong>+</strong></td><td>Sinh ra ô ghi <strong>Effective Address</strong></td></tr>
<tr><td>3. Cộng nền đoạn</td><td>Một trong <strong>CS, DS, ES, FS, GS, SS</strong> chọn ra một <strong>Descriptor Register</strong>, trường <strong>Base Address</strong> của nó đi vào dấu <strong>+</strong> thứ hai</td><td>Sinh ra <strong>Linear Address</strong></td></tr>
<tr><td>4. Kiểm biên</td><td>Bộ mô tả còn mang <strong>Limit</strong> và <strong>Access Rights</strong>, vẽ áp vào khối đoạn bên phải</td><td>Bảo vệ — phần cứng kiểm địa chỉ có nằm trong đoạn không</td></tr>
</table>
<ul>
<li><strong>Công thức tổng quát mà bức hình mã hoá:</strong> <code>LA = (SR) + (B) + (I) × S + A</code>. Mọi dòng của Table 14.2 ở slide sau đều là công thức này với vài số hạng bị đặt bằng 0.</li>
<li><strong>Ô Scale mới là ngôi sao.</strong> "1, 2, 4, or 8" không phải con số tuỳ tiện — đó đúng là kích thước của <code>char</code>, <code>short</code>, <code>int</code>/<code>float</code> và <code>double</code>/con trỏ. Intel đặt một bộ dịch bit vào đường tính địa chỉ CHÍNH VÌ muốn <code>a[i]</code> trong C chỉ tốn đúng một lệnh, bất kể kiểu phần tử.</li>
<li><strong>Chữ "Displacement 0, 8, or 32 bits" là tin về KHUÔN DẠNG, không phải về chế độ địa chỉ.</strong> Đó là gợi ý đầu tiên cho slide 28: lệnh x86 có độ dài thay đổi CHÍNH VÌ những trường như thế này có thể vắng mặt, ngắn, hoặc dài.</li>
<li><strong>Hai phép cộng nghĩa là HAI TẦNG địa chỉ.</strong> Địa chỉ hiệu dụng nằm <em>TRONG MỘT ĐOẠN</em>; địa chỉ tuyến tính nằm <em>TRONG CẢ KHÔNG GIAN ĐỊA CHỈ</em>. Chương 9 kể tiếp — địa chỉ tuyến tính sau đó đi qua phân trang để thành địa chỉ vật lý.</li>
<li><strong>So với ARM (slide 17) để cảm được khoảng cách triết lý.</strong> Địa chỉ load/store của ARM là nền + độ lệch, có thể ghi lại, vẽ gọn trong ba ô nhỏ. x86 cần nguyên cái sơ đồ này. Chương 17 (RISC) chính là lập luận rằng phần tổng quát dôi ra ấy không đáng giá.</li>
</ul>
<p class="dap-an">✅ Kiểm theo kiểu x86. Lấy <code>MOV EAX, [EBX + ECX*4 + 500]</code> với EBX = 600 (nền) và ECX = 50 (chỉ số), tỉ lệ S = 4, độ dời A = 500, giả sử mô hình phẳng nên nền đoạn bằng 0. EA = 600 + 50×4 + 500 = 600 + 200 + 500 = <strong>1300</strong>. Rồi LA = 0 + 1300 = <strong>1300</strong>. Đổi tỉ lệ thành 8 thì EA = 600 + 400 + 500 = 1500 — một trường đổi, lệch nhau 200 byte.</p>
<p class="meo">💡 Gặp câu hỏi địa chỉ x86 trông đáng sợ thì cứ viết công thức <code>LA = (SR) + (B) + (I)×S + A</code> ra giấy trước, rồi điền số 0 vào những phần đề không nhắc tới. Mọi chế độ của x86 đều là ca riêng của đúng một dòng đó.</p>`],

      [16, 'Table 14.2 — x86 Addressing Modes (eight rows, one formula)',
        `<p class="y-chinh">🎯 The eight x86 modes written as algorithms, using the notation the slide defines at the bottom: <strong>LA</strong> = linear address · <strong>(X)</strong> = contents of X · <strong>SR</strong> = segment register · <strong>PC</strong> = program counter · <strong>A</strong> = contents of an address field in the instruction · <strong>R</strong> = register · <strong>B</strong> = base register · <strong>I</strong> = index register · <strong>S</strong> = scaling factor.</p>
<table>
<tr><th>Mode</th><th>Algorithm</th><th>Which basic mode (Table 14.1) it is</th><th>Typical C construct</th></tr>
<tr><td>Immediate</td><td><code>Operand = A</code></td><td>Immediate</td><td><code>x = 5;</code></td></tr>
<tr><td>Register Operand</td><td><code>LA = R</code></td><td>Register</td><td>a variable held in a register</td></tr>
<tr><td>Displacement</td><td><code>LA = (SR) + A</code></td><td>Direct (inside a segment)</td><td>a global variable</td></tr>
<tr><td>Base</td><td><code>LA = (SR) + (B)</code></td><td>Register indirect</td><td><code>*p</code></td></tr>
<tr><td>Base with Displacement</td><td><code>LA = (SR) + (B) + A</code></td><td>Displacement</td><td><code>p-&gt;field</code>, a local variable</td></tr>
<tr><td>Scaled Index with Displacement</td><td><code>LA = (SR) + (I) × S + A</code></td><td>Indexing</td><td><code>a[i]</code> for a global array</td></tr>
<tr><td>Base with Index and Displacement</td><td><code>LA = (SR) + (B) + (I) + A</code></td><td>Indexing on a base</td><td><code>p-&gt;arr[i]</code> with byte elements</td></tr>
<tr><td>Base with Scaled Index and Displacement</td><td><code>LA = (SR) + (I) × S + (B) + A</code></td><td>The full general case</td><td><code>p-&gt;arr[i]</code> with 4-byte elements</td></tr>
<tr><td>Relative</td><td><code>LA = (PC) + A</code></td><td>Relative (PC) displacement</td><td><code>goto</code>, loops, calls</td></tr>
</table>
<ul>
<li><strong>Every row is the same formula with terms switched off.</strong> Start from <code>LA = (SR) + (B) + (I)×S + A</code> and delete: no B and no I gives "Displacement"; no I and no A gives "Base"; no B gives "Scaled Index with Displacement"; keep everything and you have the last row. That is the single most efficient way to memorise this table.</li>
<li><strong>Notice the segment register is in every memory mode.</strong> Except "Immediate" and "Register Operand", which never touch memory, <code>(SR)</code> appears everywhere. In modern 64-bit flat mode the segment base is zero for CS/DS/ES/SS, so it quietly disappears — but the hardware path is still there, and FS/GS still use it (that is where thread-local storage lives).</li>
<li><strong>"Relative" is listed separately even though it is a displacement.</strong> That is because the implicit register is the PC rather than a general register, exactly as slide 11 described. On x86 this is how <code>JMP</code>, <code>Jcc</code> and <code>CALL</code> encode near targets.</li>
<li><strong>Count the modes: nine rows for what Table 14.1 called seven basic modes.</strong> x86 has no separate "indirect" mode (memory-holds-the-pointer) at all — it was dropped after the 8086 era. If you need it you do it in two instructions: load the pointer into a register, then use Base mode.</li>
</ul>
<p class="dap-an">✅ Cross-check against slide 15's example. <code>MOV EAX, [EBX + ECX*4 + 500]</code> matches the row "Base with Scaled Index and Displacement": <code>LA = (SR) + (I)×S + (B) + A</code> = 0 + 50×4 + 600 + 500 = <strong>1300</strong>, the same number the figure gave. The table and the figure are two views of one adder tree.</p>
<p class="pitfall">⚠️ Do not confuse the <em>scale factor S</em> (1, 2, 4, 8 — a multiplier on the index) with the <em>displacement A</em> (an additive constant). An exam that gives S = 4 and A = 4 is testing exactly that: one multiplies, one adds.</p>`,
        `<p class="y-chinh">🎯 Tám chế độ của x86 viết thành thuật toán, dùng đúng ký hiệu slide định nghĩa ở cuối bảng: <strong>LA</strong> = địa chỉ tuyến tính · <strong>(X)</strong> = nội dung của X · <strong>SR</strong> = thanh ghi đoạn · <strong>PC</strong> = bộ đếm chương trình · <strong>A</strong> = nội dung một trường địa chỉ trong lệnh · <strong>R</strong> = thanh ghi · <strong>B</strong> = thanh ghi nền · <strong>I</strong> = thanh ghi chỉ số · <strong>S</strong> = hệ số tỉ lệ.</p>
<table>
<tr><th>Chế độ</th><th>Thuật toán</th><th>Ứng với chế độ cơ bản nào (Table 14.1)</th><th>Cấu trúc C điển hình</th></tr>
<tr><td>Immediate</td><td><code>Operand = A</code></td><td>Tức thời</td><td><code>x = 5;</code></td></tr>
<tr><td>Register Operand</td><td><code>LA = R</code></td><td>Thanh ghi</td><td>biến được giữ trong thanh ghi</td></tr>
<tr><td>Displacement</td><td><code>LA = (SR) + A</code></td><td>Trực tiếp (trong một đoạn)</td><td>biến toàn cục</td></tr>
<tr><td>Base</td><td><code>LA = (SR) + (B)</code></td><td>Gián tiếp qua thanh ghi</td><td><code>*p</code></td></tr>
<tr><td>Base with Displacement</td><td><code>LA = (SR) + (B) + A</code></td><td>Độ dời</td><td><code>p-&gt;field</code>, biến cục bộ</td></tr>
<tr><td>Scaled Index with Displacement</td><td><code>LA = (SR) + (I) × S + A</code></td><td>Chỉ số</td><td><code>a[i]</code> với mảng toàn cục</td></tr>
<tr><td>Base with Index and Displacement</td><td><code>LA = (SR) + (B) + (I) + A</code></td><td>Chỉ số trên một nền</td><td><code>p-&gt;arr[i]</code> phần tử 1 byte</td></tr>
<tr><td>Base with Scaled Index and Displacement</td><td><code>LA = (SR) + (I) × S + (B) + A</code></td><td>Ca tổng quát đầy đủ</td><td><code>p-&gt;arr[i]</code> phần tử 4 byte</td></tr>
<tr><td>Relative</td><td><code>LA = (PC) + A</code></td><td>Độ dời tương đối theo PC</td><td><code>goto</code>, vòng lặp, lời gọi hàm</td></tr>
</table>
<ul>
<li><strong>Mọi dòng đều là CÙNG một công thức với vài số hạng bị tắt.</strong> Bắt đầu từ <code>LA = (SR) + (B) + (I)×S + A</code> rồi xoá bớt: bỏ B và I ra "Displacement"; bỏ I và A ra "Base"; bỏ B ra "Scaled Index with Displacement"; giữ nguyên hết là dòng cuối. Đó là cách học thuộc bảng này hiệu quả nhất.</li>
<li><strong>Để ý thanh ghi đoạn có mặt trong MỌI chế độ chạm bộ nhớ.</strong> Trừ "Immediate" và "Register Operand" vốn không đụng bộ nhớ, <code>(SR)</code> xuất hiện khắp nơi. Ở chế độ phẳng 64 bit hiện đại thì nền đoạn bằng 0 với CS/DS/ES/SS nên nó lặng lẽ biến mất — nhưng đường mạch vẫn còn đó, và FS/GS vẫn dùng nó (đó là chỗ vùng nhớ riêng theo luồng nằm).</li>
<li><strong>"Relative" được liệt kê riêng dù nó cũng là một độ dời.</strong> Vì thanh ghi ngầm ở đây là PC chứ không phải một thanh ghi đa dụng, đúng như slide 11 đã mô tả. Trên x86, đây là cách <code>JMP</code>, <code>Jcc</code> và <code>CALL</code> mã hoá đích gần.</li>
<li><strong>Đếm số chế độ: chín dòng cho cái mà Table 14.1 gọi là bảy chế độ cơ bản.</strong> x86 KHÔNG có chế độ "gián tiếp" riêng (bộ nhớ giữ con trỏ) — nó bị bỏ sau thời 8086. Cần thì làm bằng hai lệnh: nạp con trỏ vào thanh ghi, rồi dùng chế độ Base.</li>
</ul>
<p class="dap-an">✅ Đối chiếu với ví dụ ở slide 15. <code>MOV EAX, [EBX + ECX*4 + 500]</code> khớp dòng "Base with Scaled Index and Displacement": <code>LA = (SR) + (I)×S + (B) + A</code> = 0 + 50×4 + 600 + 500 = <strong>1300</strong>, đúng con số bức hình đã cho. Bảng và hình là hai góc nhìn của cùng một cây cộng.</p>
<p class="pitfall">⚠️ Đừng lẫn <em>hệ số tỉ lệ S</em> (1, 2, 4, 8 — NHÂN vào chỉ số) với <em>độ dời A</em> (hằng số CỘNG thêm). Đề cho S = 4 và A = 4 là đang thử đúng chỗ đó: một cái nhân, một cái cộng.</p>`],

      [17, 'Figure 14.3 — ARM Indexing Methods (offset, preindex, postindex)',
        `<p class="y-chinh">🎯 Three small panels, one instruction, three different meanings — and the difference is <em>only</em> punctuation. The base register <strong>r1 = 0x200</strong>, the offset is <strong>0xC</strong> (12 decimal), and the source register <strong>r0 = 0x5</strong> in all three cases.</p>
<table>
<tr><th>Panel</th><th>Instruction as written on the slide</th><th>Where the byte is stored</th><th>What r1 is afterwards</th></tr>
<tr><td>(a) Offset</td><td><code>STRB r0, [r1, #12]</code></td><td>0x200 + 0xC = <strong>0x20C</strong></td><td>unchanged, still <strong>0x200</strong></td></tr>
<tr><td>(b) Preindex</td><td><code>STRB r0, [r1, #12]!</code></td><td>0x200 + 0xC = <strong>0x20C</strong></td><td>updated to <strong>0x20C</strong></td></tr>
<tr><td>(c) Postindex</td><td><code>STRB r0, [r1], #12</code></td><td><strong>0x200</strong> — the offset is NOT used for the access</td><td>updated to <strong>0x20C</strong></td></tr>
</table>
<ul>
<li><strong>Read the syntax as a rule you can apply anywhere.</strong> The exclamation mark <code>!</code> means <em>write the computed address back into the base register</em>. Brackets that <em>close before</em> the offset (<code>[r1], #12</code>) mean <em>use the old value, then update</em>. Brackets that <em>enclose</em> the offset (<code>[r1, #12]</code>) mean <em>use the sum</em>.</li>
<li><strong>Panel (a) is plain displacement addressing.</strong> <code>EA = A + (R)</code> from Table 14.1, no side effect. This is <code>p-&gt;field</code> or a local variable.</li>
<li><strong>Panels (b) and (c) are autoindexing from slide 13, made concrete.</strong> Both leave r1 pointing at 0x20C, so the next instruction in a loop needs no separate <code>ADD</code>. One instruction does the access and the pointer bump — this is why the C idiom <code>*p++ = x;</code> compiles to a single ARM instruction.</li>
<li><strong>The crucial difference between (b) and (c) is which address is used.</strong> Preindex stores at the <em>new</em> address; postindex stores at the <em>old</em> one. In our figure both end with r1 = 0x20C, but the byte 0x5 lands at 0x20C in (b) and at 0x200 in (c). An exam that asks "what is in memory afterwards" is testing exactly this.</li>
<li><strong>Map it to C so you never forget it.</strong> Preindex = <code>*(++p)</code>: advance, then use. Postindex = <code>*(p++)</code>: use, then advance. Offset = <code>*(p + 3)</code>: use the sum, leave p alone.</li>
</ul>
<p class="dap-an">✅ Arithmetic check: 0x200 = 512, 0xC = 12, 512 + 12 = 524 = 0x20C. ✓ The figure's numbers are consistent.</p>
<p class="meo">💡 Exam shortcut for any ARM addressing question: find the closing bracket. Everything <em>inside</em> the brackets is part of the address; everything <em>after</em> them is a post-update. The <code>!</code> is the only thing that turns an in-bracket offset into a writeback.</p>`,
        `<p class="y-chinh">🎯 Ba ô nhỏ, một lệnh, ba nghĩa khác nhau — và khác biệt CHỈ nằm ở dấu câu. Thanh ghi nền <strong>r1 = 0x200</strong>, độ lệch là <strong>0xC</strong> (12 thập phân), và thanh ghi nguồn <strong>r0 = 0x5</strong> ở cả ba ca.</p>
<table>
<tr><th>Ô</th><th>Lệnh viết trên slide</th><th>Byte được ghi vào đâu</th><th>r1 sau lệnh bằng bao nhiêu</th></tr>
<tr><td>(a) Offset — độ lệch</td><td><code>STRB r0, [r1, #12]</code></td><td>0x200 + 0xC = <strong>0x20C</strong></td><td>KHÔNG đổi, vẫn <strong>0x200</strong></td></tr>
<tr><td>(b) Preindex — tiền chỉ số</td><td><code>STRB r0, [r1, #12]!</code></td><td>0x200 + 0xC = <strong>0x20C</strong></td><td>cập nhật thành <strong>0x20C</strong></td></tr>
<tr><td>(c) Postindex — hậu chỉ số</td><td><code>STRB r0, [r1], #12</code></td><td><strong>0x200</strong> — độ lệch KHÔNG dùng cho lần truy cập này</td><td>cập nhật thành <strong>0x20C</strong></td></tr>
</table>
<ul>
<li><strong>Đọc cú pháp thành một quy tắc dùng được ở mọi nơi.</strong> Dấu chấm than <code>!</code> nghĩa là <em>GHI địa chỉ vừa tính NGƯỢC LẠI vào thanh ghi nền</em>. Ngoặc <em>ĐÓNG TRƯỚC</em> phần độ lệch (<code>[r1], #12</code>) nghĩa là <em>dùng giá trị CŨ, rồi mới cập nhật</em>. Ngoặc <em>BAO</em> phần độ lệch (<code>[r1, #12]</code>) nghĩa là <em>dùng TỔNG</em>.</li>
<li><strong>Ô (a) là địa chỉ độ dời thuần.</strong> <code>EA = A + (R)</code> của Table 14.1, không có tác dụng phụ. Đây chính là <code>p-&gt;field</code> hay một biến cục bộ.</li>
<li><strong>Ô (b) và (c) là autoindexing của slide 13, được cụ thể hoá.</strong> Cả hai đều để r1 trỏ vào 0x20C, nên lệnh kế tiếp trong vòng lặp KHÔNG cần một lệnh <code>ADD</code> riêng. Một lệnh làm cả việc truy cập lẫn việc nhích con trỏ — đó là lý do thành ngữ C <code>*p++ = x;</code> dịch ra ĐÚNG MỘT lệnh ARM.</li>
<li><strong>Khác biệt cốt tử giữa (b) và (c) là DÙNG ĐỊA CHỈ NÀO.</strong> Tiền chỉ số ghi vào địa chỉ <em>MỚI</em>; hậu chỉ số ghi vào địa chỉ <em>CŨ</em>. Trong hình này cả hai kết thúc với r1 = 0x20C, nhưng byte 0x5 rơi vào 0x20C ở (b) và vào 0x200 ở (c). Đề hỏi "sau đó trong bộ nhớ có gì" là đang thử đúng chỗ này.</li>
<li><strong>Ánh xạ sang C để không bao giờ quên.</strong> Tiền chỉ số = <code>*(++p)</code>: nhích trước, dùng sau. Hậu chỉ số = <code>*(p++)</code>: dùng trước, nhích sau. Offset = <code>*(p + 3)</code>: dùng tổng, để yên p.</li>
</ul>
<p class="dap-an">✅ Kiểm số học: 0x200 = 512, 0xC = 12, 512 + 12 = 524 = 0x20C. ✓ Các con số trên hình nhất quán.</p>
<p class="meo">💡 Mẹo thi cho mọi câu hỏi địa chỉ ARM: tìm dấu ngoặc ĐÓNG. Mọi thứ <em>BÊN TRONG</em> ngoặc là một phần của địa chỉ; mọi thứ <em>SAU</em> ngoặc là phần cập nhật hậu kỳ. Dấu <code>!</code> là thứ duy nhất biến một độ lệch trong ngoặc thành một lần ghi lại.</p>`],

      [18, 'ARM Data Processing Instruction Addressing and Branch Instructions',
        `<p class="y-chinh">🎯 Two short lists that show how few modes a RISC machine actually needs. Data processing instructions use <strong>register addressing, or a mixture of register and immediate</strong>. Branch instructions use <strong>immediate only</strong> — nothing else.</p>
<ul>
<li><strong>Data processing: "use either register addressing or a mixture of register and immediate addressing."</strong> That is it. No memory operand can appear in an <code>ADD</code>. This is the load/store architecture rule of Chapter 17, visible here as an addressing-mode restriction.</li>
<li><strong>The shifter is the extra.</strong> "For register addressing the value in one of the register operands may be <strong>scaled using one of the five shift operators</strong>." ARM puts a barrel shifter in the data path, so <code>ADD r0, r1, r2, LSL #3</code> computes r1 + (r2 × 8) in one instruction and one cycle. Look back at slide 29's format diagram: that is the "shift amount" and "shift" fields.</li>
<li><strong>Branches: "the only form of addressing for branch instructions is immediate."</strong> The instruction "contains a <strong>24 bit value</strong>", which is "<strong>shifted 2 bits left</strong> so that the address is on a <strong>word boundary</strong>", giving an "effective range <strong>± 32MB from the program counter</strong>".</li>
<li><strong>Why shift left by 2?</strong> Every ARM instruction is exactly 4 bytes and must be 4-byte aligned, so the bottom two bits of any instruction address are always 00. Storing them would waste two bits, so the hardware implies them. You get a 26-bit reach out of a 24-bit field — a factor of four for free.</li>
<li><strong>Note the vocabulary trap.</strong> The slide calls branch addressing "immediate", but the value is added to the PC — by Table 14.1's taxonomy that is <em>relative</em> (PC-displacement) addressing. The slide's wording means "the offset is an immediate constant in the instruction". Answer as the slide does if the question quotes it, but know the distinction.</li>
</ul>
<p class="dap-an">✅ Verify the ±32 MB claim, computed on a machine. A 24-bit signed field reaches ±2<sup>23</sup> = ±8 388 608 units. Each unit is a word = 4 bytes after the left shift, so the reach is ±8 388 608 × 4 = <strong>±33 554 432 bytes = ±32 MiB</strong>. ✓ Exactly what the slide says.</p>
<p class="pitfall">⚠️ On classic ARM the PC reads as the branch instruction's address <strong>+ 8</strong>, because of the three-stage pipeline (fetch/decode/execute). Assemblers hide this from you, but an exam question that gives you raw encodings will not. If a target seems 8 bytes off, this is why.</p>`,
        `<p class="y-chinh">🎯 Hai danh sách ngắn cho thấy một cỗ máy RISC thật ra cần ÍT chế độ tới mức nào. Lệnh xử lý dữ liệu dùng <strong>địa chỉ thanh ghi, hoặc pha trộn thanh ghi với tức thời</strong>. Lệnh rẽ nhánh dùng <strong>DUY NHẤT tức thời</strong> — không gì khác.</p>
<ul>
<li><strong>Xử lý dữ liệu: "dùng hoặc địa chỉ thanh ghi, hoặc pha trộn địa chỉ thanh ghi với tức thời."</strong> Hết. KHÔNG toán hạng bộ nhớ nào được xuất hiện trong một lệnh <code>ADD</code>. Đây chính là quy tắc kiến trúc load/store của Chương 17, hiện ra ở đây dưới dạng một hạn chế về chế độ địa chỉ.</li>
<li><strong>Bộ dịch bit là phần thêm.</strong> "Với địa chỉ thanh ghi, giá trị trong một trong các toán hạng thanh ghi có thể được <strong>nhân tỉ lệ bằng một trong NĂM toán tử dịch</strong>." ARM đặt một bộ dịch thùng ngay trên đường dữ liệu, nên <code>ADD r0, r1, r2, LSL #3</code> tính r1 + (r2 × 8) trong một lệnh và một chu kỳ. Ngó lại sơ đồ khuôn dạng ở slide 29: đó là hai trường "shift amount" và "shift".</li>
<li><strong>Rẽ nhánh: "dạng địa chỉ DUY NHẤT cho lệnh rẽ nhánh là tức thời."</strong> Lệnh "chứa một <strong>giá trị 24 bit</strong>", được "<strong>dịch trái 2 bit</strong> để địa chỉ nằm trên <strong>biên từ</strong>", cho "tầm với hiệu dụng <strong>± 32MB tính từ bộ đếm chương trình</strong>".</li>
<li><strong>Vì sao dịch trái 2 bit?</strong> Mọi lệnh ARM dài đúng 4 byte và phải thẳng hàng 4 byte, nên hai bit thấp nhất của mọi địa chỉ lệnh LUÔN là 00. Lưu chúng là phí hai bit, nên phần cứng hiểu ngầm. Bạn được tầm với 26 bit từ một trường 24 bit — nhân bốn, miễn phí.</li>
<li><strong>Chú ý bẫy thuật ngữ.</strong> Slide gọi địa chỉ rẽ nhánh là "immediate", nhưng giá trị đó được CỘNG VÀO PC — theo phân loại của Table 14.1 thì đó là địa chỉ <em>TƯƠNG ĐỐI</em> (độ dời theo PC). Chữ của slide có nghĩa là "độ lệch là một hằng tức thời nằm trong lệnh". Đề trích nguyên văn thì trả lời theo slide, nhưng phải biết sự phân biệt này.</li>
</ul>
<p class="dap-an">✅ Kiểm lại con số ±32 MB, tính bằng máy. Trường 24 bit có dấu với tới ±2<sup>23</sup> = ±8 388 608 đơn vị. Mỗi đơn vị là một TỪ = 4 byte sau khi dịch trái, nên tầm với là ±8 388 608 × 4 = <strong>±33 554 432 byte = ±32 MiB</strong>. ✓ Đúng như slide nói.</p>
<p class="pitfall">⚠️ Trên ARM cổ điển, PC đọc ra bằng địa chỉ của chính lệnh rẽ nhánh <strong>+ 8</strong>, do đường ống ba tầng (nạp/giải mã/thực thi). Trình hợp dịch giấu chuyện này đi, nhưng một đề thi cho bạn mã máy thô thì không. Thấy đích lệch đúng 8 byte thì đây là lý do.</p>`],

      [19, 'Figure 14.4 — ARM Load/Store Multiple Addressing (IA, IB, DA, DB)',
        `<p class="y-chinh">🎯 One base register, one list of registers, <strong>four</strong> different places the data can land. The figure uses <code>LDMxx r10, {r0, r1, r4}</code> / <code>STMxx r10, {r0, r1, r4}</code> with the base register <strong>r10 = 0x20C</strong>, and shows all four variants side by side.</p>
<table>
<tr><th>Variant</th><th>Meaning</th><th>Addresses used (r10 = 0x20C)</th><th>Which register goes where</th></tr>
<tr><td><strong>IA</strong> — Increment After</td><td>use the base, then step up</td><td>0x20C, 0x210, 0x214</td><td>r0 at 0x20C, r1 at 0x210, r4 at 0x214</td></tr>
<tr><td><strong>IB</strong> — Increment Before</td><td>step up, then use</td><td>0x210, 0x214, 0x218</td><td>r0 at 0x210, r1 at 0x214, r4 at 0x218</td></tr>
<tr><td><strong>DA</strong> — Decrement After</td><td>use the base, then step down</td><td>0x20C, 0x208, 0x204</td><td>r4 at 0x20C, r1 at 0x208, r0 at 0x204</td></tr>
<tr><td><strong>DB</strong> — Decrement Before</td><td>step down, then use</td><td>0x208, 0x204, 0x200</td><td>r4 at 0x208, r1 at 0x204, r0 at 0x200</td></tr>
</table>
<ul>
<li><strong>Read the invariant off the figure, it removes all the memorising.</strong> In every one of the four columns, the <strong>lowest-numbered register goes to the lowest address</strong>. r0 is always below r1, which is always below r4. The four variants only choose <em>where the block starts</em> and <em>which direction it grows</em>.</li>
<li><strong>Why four variants exist: stacks.</strong> A stack can grow up or down, and the pointer can point at the last item used or the next free slot. Two choices times two choices = four conventions, and ARM supports all four so any calling convention can be implemented with one instruction pair.</li>
<li><strong>What this buys.</strong> Saving eight registers on function entry is <em>one</em> <code>STM</code> instruction instead of eight <code>STR</code>s. That is a huge win on code density (fewer instruction bytes to fetch — link this back to Chapter 4's instruction cache) and on cycles, because the memory system sees one burst instead of eight separate requests.</li>
<li><strong>Addressing-mode classification.</strong> All four are <em>register indirect with autoindexing</em> — the base register supplies the address (register indirect, slide 9) and the hardware steps it (autoindexing, slide 13). The four names are just the four combinations of direction and before/after.</li>
<li><strong>The 0x4 step is not arbitrary.</strong> ARM registers are 32-bit, so each takes 4 bytes; that is why the addresses in the figure go 0x200, 0x204, 0x208, 0x20C, 0x210, 0x214, 0x218.</li>
</ul>
<p class="dap-an">✅ Worked check of the IB column. Base 0x20C = 524. Increment <em>before</em> the first access → 524 + 4 = 528 = 0x210 for r0; then 532 = 0x214 for r1; then 536 = 0x218 for r4. ✓ Matches the figure exactly.</p>
<p class="meo">💡 The four names decode themselves: the first letter is the <em>direction</em> (I = increment, D = decrement), the second is the <em>timing</em> (A = after, B = before). Exactly the same before/after distinction as preindex vs postindex on slide 17 — one idea, two places.</p>`,
        `<p class="y-chinh">🎯 Một thanh ghi nền, một danh sách thanh ghi, <strong>BỐN</strong> chỗ khác nhau mà dữ liệu có thể rơi vào. Hình dùng <code>LDMxx r10, {r0, r1, r4}</code> / <code>STMxx r10, {r0, r1, r4}</code> với thanh ghi nền <strong>r10 = 0x20C</strong>, và bày cả bốn biến thể cạnh nhau.</p>
<table>
<tr><th>Biến thể</th><th>Nghĩa</th><th>Các địa chỉ dùng tới (r10 = 0x20C)</th><th>Thanh ghi nào vào đâu</th></tr>
<tr><td><strong>IA</strong> — Increment After (tăng SAU)</td><td>dùng địa chỉ nền trước, rồi mới bước lên</td><td>0x20C, 0x210, 0x214</td><td>r0 ở 0x20C, r1 ở 0x210, r4 ở 0x214</td></tr>
<tr><td><strong>IB</strong> — Increment Before (tăng TRƯỚC)</td><td>bước lên trước, rồi mới dùng</td><td>0x210, 0x214, 0x218</td><td>r0 ở 0x210, r1 ở 0x214, r4 ở 0x218</td></tr>
<tr><td><strong>DA</strong> — Decrement After (giảm SAU)</td><td>dùng địa chỉ nền trước, rồi mới bước xuống</td><td>0x20C, 0x208, 0x204</td><td>r4 ở 0x20C, r1 ở 0x208, r0 ở 0x204</td></tr>
<tr><td><strong>DB</strong> — Decrement Before (giảm TRƯỚC)</td><td>bước xuống trước, rồi mới dùng</td><td>0x208, 0x204, 0x200</td><td>r4 ở 0x208, r1 ở 0x204, r0 ở 0x200</td></tr>
</table>
<ul>
<li><strong>Đọc ra cái BẤT BIẾN trên hình, nó xoá sạch việc phải học thuộc.</strong> Trong cả bốn cột, <strong>thanh ghi số NHỎ NHẤT luôn nằm ở địa chỉ THẤP NHẤT</strong>. r0 luôn dưới r1, r1 luôn dưới r4. Bốn biến thể chỉ chọn <em>khối bắt đầu ở đâu</em> và <em>mọc theo hướng nào</em>.</li>
<li><strong>Vì sao có tới bốn biến thể: vì NGĂN XẾP.</strong> Ngăn xếp có thể mọc lên hoặc mọc xuống, và con trỏ có thể trỏ vào mục cuối đã dùng hoặc vào ô trống kế tiếp. Hai lựa chọn nhân hai lựa chọn = bốn quy ước, và ARM đỡ cả bốn để mọi quy ước gọi hàm đều cài được bằng một cặp lệnh.</li>
<li><strong>Nó mua về cái gì.</strong> Cất tám thanh ghi khi vào hàm là <em>MỘT</em> lệnh <code>STM</code> thay vì tám lệnh <code>STR</code>. Đó là cái lời rất lớn về mật độ mã (ít byte lệnh phải nạp hơn — nối ngược về cache lệnh ở Chương 4) và về số chu kỳ, vì hệ thống nhớ chỉ thấy MỘT đợt truyền thay vì tám yêu cầu rời.</li>
<li><strong>Xếp loại theo chế độ địa chỉ.</strong> Cả bốn đều là <em>gián tiếp qua thanh ghi có tự-lập-chỉ-số</em> — thanh ghi nền cấp địa chỉ (gián tiếp qua thanh ghi, slide 9) và phần cứng bước nó đi (autoindexing, slide 13). Bốn cái tên chỉ là bốn tổ hợp của hướng và trước/sau.</li>
<li><strong>Bước nhảy 0x4 không tuỳ tiện.</strong> Thanh ghi ARM rộng 32 bit nên mỗi cái chiếm 4 byte; đó là lý do các địa chỉ trên hình đi 0x200, 0x204, 0x208, 0x20C, 0x210, 0x214, 0x218.</li>
</ul>
<p class="dap-an">✅ Kiểm cột IB. Nền 0x20C = 524. Tăng <em>TRƯỚC</em> lần truy cập đầu → 524 + 4 = 528 = 0x210 cho r0; rồi 532 = 0x214 cho r1; rồi 536 = 0x218 cho r4. ✓ Khớp chính xác với hình.</p>
<p class="meo">💡 Bốn cái tên tự giải mã: chữ đầu là <em>HƯỚNG</em> (I = tăng, D = giảm), chữ sau là <em>THỜI ĐIỂM</em> (A = sau, B = trước). Đúng cùng một phân biệt trước/sau như tiền-chỉ-số với hậu-chỉ-số ở slide 17 — một ý, hai chỗ.</p>`],

      [20, 'Instruction Formats — the second half of the chapter begins',
        `<p class="y-chinh">🎯 The divider slide that switches subject. Three arrow-shaped cards define what an instruction format is: it <strong>defines the layout of the bits of an instruction, in terms of its constituent fields</strong>; it <strong>must include an opcode and, implicitly or explicitly, indicate the addressing mode for each operand</strong>; and <strong>for most instruction sets, more than one instruction format is used</strong>.</p>
<ul>
<li><strong>Card 2 is the hinge between the two halves of the chapter.</strong> "Must include an opcode and, implicitly or explicitly, indicate the addressing mode for each operand." Everything you learned in slides 2–19 has to be <em>encoded</em>, and encoding costs bits. Seven modes need at least 3 bits per operand; that is 3 bits you cannot spend on an address.</li>
<li><strong>"Implicitly or explicitly" is doing real work in that sentence.</strong> Explicit = a mode field in the instruction (PDP-11 spends 3 bits per operand on it, slide 26). Implicit = the opcode itself implies the mode (a stack <code>ADD</code> needs no mode field; ARM's <code>B</code> is always PC-relative). Implicit encoding is free but needs more opcodes.</li>
<li><strong>Card 3 is why real machines are messy.</strong> "For most instruction sets, more than one instruction format is used." The PDP-11 has 13 (slide 26), the PDP-8 has 5 (slide 23). A machine that had exactly one format would waste bits on every short instruction; a machine with many formats needs a more complex decoder.</li>
<li><strong>What is actually being designed here.</strong> Four decisions, and they fight each other: <em>instruction length</em> (slide 21), <em>how to split those bits between opcode and operands</em> (slide 22), <em>whether all instructions are the same length</em> (slide 25), and <em>how many distinct formats</em> (this card).</li>
<li><strong>Why an exam cares.</strong> This half of the chapter produces the arithmetic questions — "how many bits for the address field", "what address range", "how many opcodes fit". Slide 22 is where that gets worked in full.</li>
</ul>
<p class="meo">💡 Picture an instruction as a fixed-width envelope. The opcode, the mode bits, the register numbers and the address all have to fit inside. Make one field bigger and another must shrink. The whole second half of this chapter is that one trade, examined from five angles.</p>`,
        `<p class="y-chinh">🎯 Slide chuyển đề tài. Ba tấm thẻ hình mũi tên định nghĩa khuôn dạng lệnh là gì: nó <strong>định nghĩa cách bố trí các bit của một lệnh, theo các trường cấu thành</strong>; nó <strong>bắt buộc phải chứa mã thao tác và, ngầm định hoặc tường minh, chỉ ra chế độ địa chỉ cho từng toán hạng</strong>; và <strong>với phần lớn tập lệnh, người ta dùng NHIỀU HƠN MỘT khuôn dạng</strong>.</p>
<ul>
<li><strong>Thẻ 2 là bản lề nối hai nửa của chương.</strong> "Phải chứa mã thao tác và, ngầm hoặc tường minh, chỉ ra chế độ địa chỉ cho từng toán hạng." Mọi thứ bạn học ở slide 2–19 đều phải được <em>MÃ HOÁ</em>, mà mã hoá thì tốn bit. Bảy chế độ cần ít nhất 3 bit cho mỗi toán hạng; đó là 3 bit bạn không còn để dành cho địa chỉ.</li>
<li><strong>Cụm "ngầm hoặc tường minh" làm việc thật trong câu đó.</strong> Tường minh = có hẳn một trường chế độ trong lệnh (PDP-11 tiêu 3 bit cho mỗi toán hạng vào việc đó, slide 26). Ngầm = chính mã thao tác đã hàm ý chế độ (lệnh <code>ADD</code> kiểu ngăn xếp không cần trường chế độ; lệnh <code>B</code> của ARM luôn là PC-relative). Mã hoá ngầm thì miễn phí nhưng tốn thêm mã thao tác.</li>
<li><strong>Thẻ 3 là lý do máy thật trông lộn xộn.</strong> "Với phần lớn tập lệnh, người ta dùng nhiều hơn một khuôn dạng." PDP-11 có 13 khuôn (slide 26), PDP-8 có 5 (slide 23). Máy chỉ có ĐÚNG MỘT khuôn sẽ phí bit ở mọi lệnh ngắn; máy có nhiều khuôn thì cần bộ giải mã phức tạp hơn.</li>
<li><strong>Thứ thật sự đang được thiết kế ở đây.</strong> Bốn quyết định, và chúng đánh nhau: <em>độ dài lệnh</em> (slide 21), <em>chia số bit đó cho mã thao tác và toán hạng ra sao</em> (slide 22), <em>mọi lệnh có cùng độ dài không</em> (slide 25), và <em>có bao nhiêu khuôn dạng khác nhau</em> (chính tấm thẻ này).</li>
<li><strong>Vì sao đề thi quan tâm.</strong> Nửa sau của chương sinh ra các câu hỏi số học — "còn bao nhiêu bit cho trường địa chỉ", "tầm với địa chỉ là bao nhiêu", "nhét được bao nhiêu mã thao tác". Slide 22 là chỗ giải trọn những bài đó.</li>
</ul>
<p class="meo">💡 Hình dung một lệnh như một cái phong bì có bề rộng cố định. Mã thao tác, mấy bit chế độ, số hiệu thanh ghi và địa chỉ đều phải nhét vừa vào trong. Nới rộng một trường thì trường khác phải co lại. Cả nửa sau chương này là đúng một cái đánh đổi ấy, soi từ năm góc.</p>`],

      [21, 'Instruction Length — the most basic design issue',
        `<p class="y-chinh">🎯 The slide calls instruction length "the <strong>most basic design issue</strong>" of an instruction set, then lists what it pulls on and is pulled by, and gives two hard rules of thumb.</p>
<p class="nhan">"Affects, and is affected by" — five items, and the two-way arrow matters:</p>
<table>
<tr><th>Factor</th><th>How it pushes instruction length</th></tr>
<tr><td><strong>Memory size</strong></td><td>More memory needs longer addresses, which need longer instructions</td></tr>
<tr><td><strong>Memory organization</strong></td><td>Byte-addressed vs word-addressed; how much fits in one transfer</td></tr>
<tr><td><strong>Bus structure</strong></td><td>A 64-bit bus fetches 64 bits whether you use them or not (Chapter 3)</td></tr>
<tr><td><strong>Processor complexity</strong></td><td>Richer instructions need more fields — and a bigger decoder</td></tr>
<tr><td><strong>Processor speed</strong></td><td>A fast CPU starves on a slow memory; shorter instructions feed it better</td></tr>
</table>
<p class="nhan">The two rules the slide states outright:</p>
<ul>
<li><strong>Rule 1: instruction length "should be equal to the memory-transfer length or one should be a multiple of the other."</strong> Otherwise an instruction straddles two transfers and the fetch costs twice as much. A 32-bit instruction on a 64-bit bus is fine (two per transfer); a 48-bit instruction on a 64-bit bus is a disaster (every other instruction is split).</li>
<li><strong>Rule 2: it "should be a multiple of the character length, which is usually 8 bits, and of the length of fixed-point numbers."</strong> So 8, 16, 24, 32, 64 — never 13 or 37. This is why every real ISA has instruction lengths that are whole numbers of bytes.</li>
</ul>
<ul>
<li><strong>The trade-off in one sentence.</strong> A <em>longer</em> instruction can express more — more opcodes, more operands, bigger addresses, more addressing modes — but it costs more memory to store and more bus bandwidth to fetch. A <em>shorter</em> instruction is cheap to fetch but expresses less, so you need more of them.</li>
<li><strong>Connect to Chapter 4 (memory hierarchy).</strong> Instructions are data too. Halving instruction length roughly doubles how much of your program fits in the instruction cache, which directly raises the hit ratio, which directly cuts average access time. Code density is a <em>performance</em> property, not just a storage one. That is exactly why ARM built Thumb (slides 31–33).</li>
<li><strong>Connect to Chapter 17 (RISC).</strong> RISC answers this slide with one decision: <strong>every instruction is exactly 4 bytes, always</strong>. That fixes rule 1 and rule 2 permanently, makes fetch trivially predictable, lets the decoder start on instruction n+1 before instruction n is understood, and is what makes deep pipelining practical. The price is paid on slide 25: you cannot have compact special cases.</li>
<li><strong>Connect to Chapter 3 (instruction cycle).</strong> A variable-length instruction means the processor does not know where the next one starts until it has decoded this one. That serialises fetch and decode — the exact dependency that slide 25 says "increases the complexity of the processor".</li>
</ul>
<p class="pitfall">⚠️ A common exam confusion: instruction length is not the same as word length, and neither is the same as address length. A machine can have 32-bit words, 16-bit instructions and 24-bit addresses all at once. Read which one the question is asking about before you compute anything.</p>`,
        `<p class="y-chinh">🎯 Slide gọi độ dài lệnh là "<strong>vấn đề thiết kế CƠ BẢN NHẤT</strong>" của một tập lệnh, rồi liệt kê nó kéo theo và bị kéo bởi những gì, kèm hai quy tắc cứng.</p>
<p class="nhan">"Ảnh hưởng tới, và bị ảnh hưởng bởi" — năm mục, và mũi tên HAI CHIỀU mới là điều đáng chú ý:</p>
<table>
<tr><th>Yếu tố</th><th>Nó đẩy độ dài lệnh ra sao</th></tr>
<tr><td><strong>Kích thước bộ nhớ</strong></td><td>Bộ nhớ lớn hơn cần địa chỉ dài hơn, mà địa chỉ dài hơn cần lệnh dài hơn</td></tr>
<tr><td><strong>Tổ chức bộ nhớ</strong></td><td>Đánh địa chỉ theo byte hay theo từ; một lần truyền chứa được bao nhiêu</td></tr>
<tr><td><strong>Cấu trúc bus</strong></td><td>Bus 64 bit lấy về 64 bit dù bạn có dùng hết hay không (Chương 3)</td></tr>
<tr><td><strong>Độ phức tạp bộ xử lý</strong></td><td>Lệnh phong phú hơn cần nhiều trường hơn — và bộ giải mã lớn hơn</td></tr>
<tr><td><strong>Tốc độ bộ xử lý</strong></td><td>CPU nhanh bị đói trên bộ nhớ chậm; lệnh ngắn hơn nuôi nó tốt hơn</td></tr>
</table>
<p class="nhan">Hai quy tắc slide nói thẳng:</p>
<ul>
<li><strong>Quy tắc 1: độ dài lệnh "nên bằng độ dài một lần truyền bộ nhớ, hoặc cái này phải là bội của cái kia."</strong> Không thì một lệnh nằm vắt qua hai lần truyền và việc nạp lệnh tốn gấp đôi. Lệnh 32 bit trên bus 64 bit thì ổn (mỗi lần truyền hai lệnh); lệnh 48 bit trên bus 64 bit là một thảm hoạ (cứ cách một lệnh lại bị cắt đôi).</li>
<li><strong>Quy tắc 2: nó "nên là bội của độ dài ký tự, thường là 8 bit, và của độ dài số dấu chấm tĩnh."</strong> Nên 8, 16, 24, 32, 64 — không bao giờ 13 hay 37. Đó là lý do mọi tập lệnh thật đều có độ dài lệnh là số nguyên byte.</li>
</ul>
<ul>
<li><strong>Đánh đổi gói trong một câu.</strong> Lệnh <em>DÀI HƠN</em> diễn đạt được nhiều hơn — nhiều mã thao tác hơn, nhiều toán hạng hơn, địa chỉ lớn hơn, nhiều chế độ địa chỉ hơn — nhưng tốn bộ nhớ để cất và tốn băng thông bus để nạp. Lệnh <em>NGẮN HƠN</em> nạp rẻ nhưng diễn đạt ít, nên phải dùng nhiều lệnh hơn.</li>
<li><strong>Nối sang Chương 4 (phân cấp bộ nhớ).</strong> Lệnh cũng là dữ liệu. Giảm nửa độ dài lệnh thì xấp xỉ gấp đôi phần chương trình nằm vừa trong cache lệnh, kéo tỉ lệ trúng lên, kéo thời gian truy cập trung bình xuống. Mật độ mã là một tính chất <em>HIỆU NĂNG</em>, không chỉ là chuyện cất trữ. Đó chính xác là lý do ARM làm ra Thumb (slide 31–33).</li>
<li><strong>Nối sang Chương 17 (RISC).</strong> RISC trả lời slide này bằng một quyết định: <strong>mọi lệnh dài đúng 4 byte, luôn luôn</strong>. Thế là quy tắc 1 và quy tắc 2 được thoả vĩnh viễn, việc nạp lệnh đoán trước được một cách tầm thường, bộ giải mã bắt đầu được với lệnh n+1 trước khi hiểu xong lệnh n, và đó là thứ khiến đường ống sâu trở nên khả thi. Cái giá trả ở slide 25: bạn không có được những ca đặc biệt gọn gàng.</li>
<li><strong>Nối sang Chương 3 (chu trình lệnh).</strong> Lệnh độ dài thay đổi nghĩa là bộ xử lý KHÔNG biết lệnh kế tiếp bắt đầu ở đâu cho tới khi giải mã xong lệnh này. Điều đó nối tiếp hoá nạp và giải mã — đúng cái phụ thuộc mà slide 25 gọi là "làm tăng độ phức tạp của bộ xử lý".</li>
</ul>
<p class="pitfall">⚠️ Một nhầm lẫn hay gặp khi thi: độ dài LỆNH không phải độ dài TỪ, và cả hai đều không phải độ dài ĐỊA CHỈ. Một cỗ máy có thể cùng lúc có từ 32 bit, lệnh 16 bit và địa chỉ 24 bit. Đọc kỹ đề hỏi cái nào trước khi tính bất cứ thứ gì.</p>`],

      [22, 'Allocation of Bits — six factors, and the arithmetic behind them',
        `<p class="y-chinh">🎯 Once you have fixed the instruction length, you have a fixed budget of bits to divide up. This slide lists the <strong>six factors</strong> that decide how: <strong>Number of addressing modes</strong> · <strong>Number of operands</strong> · <strong>Register versus memory</strong> · <strong>Number of register sets</strong> · <strong>Address range</strong> · <strong>Address granularity</strong>.</p>
<table>
<tr><th>Factor</th><th>What it costs in bits</th><th>The trade it forces</th></tr>
<tr><td>Number of addressing modes</td><td>ceil(log<sub>2</sub> modes) per operand, unless the opcode implies the mode</td><td>7 modes = 3 bits per operand; those bits come out of the address field</td></tr>
<tr><td>Number of operands</td><td>one full operand field each</td><td>3-address is expressive but fat; 0-address (stack) is tiny but needs more instructions</td></tr>
<tr><td>Register versus memory</td><td>registers ~3–5 bits, memory addresses 16–64 bits</td><td>More registers = shorter instructions but harder compiler</td></tr>
<tr><td>Number of register sets</td><td>separate sets (data/address, integer/FP) shrink each field</td><td>Two sets of 8 need 3 bits each instead of one set of 16 needing 4</td></tr>
<tr><td>Address range</td><td>k bits reach 2<sup>k</sup> locations</td><td>This is the field that always loses; displacement modes exist to rescue it</td></tr>
<tr><td>Address granularity</td><td>byte address vs word address</td><td>Word addressing on 32-bit words saves 2 bits of every address</td></tr>
</table>
<p class="nhan"><strong>Worked problem 1 — the classic exam question.</strong> "An instruction is <strong>16 bits</strong> long. The machine needs <strong>32 operations</strong>, and each instruction has <strong>2 register operands chosen from 8 registers</strong>. The remaining bits are a displacement. How many bits does the displacement get, and what is its range?"</p>
<ul>
<li>Opcode: 32 operations need ceil(log<sub>2</sub> 32) = <strong>5 bits</strong> (2<sup>5</sup> = 32 exactly).</li>
<li>Registers: 8 registers need log<sub>2</sub> 8 = <strong>3 bits</strong> each, two of them = <strong>6 bits</strong>.</li>
<li>Displacement: 16 − 5 − 6 = <strong>5 bits</strong>.</li>
</ul>
<p class="dap-an">✅ Answer: <strong>5 bits of displacement</strong>. Range as a twos-complement signed value: <strong>−16 to +15</strong>. If the question says the displacement is unsigned: <strong>0 to 31</strong>. Always state which you assumed — both answers are correct for their own assumption, and the marker wants to see the assumption named. (Verified by machine: 16−5−6 = 5; −2<sup>4</sup> = −16, 2<sup>4</sup>−1 = 15, 2<sup>5</sup>−1 = 31.)</p>
<p class="nhan"><strong>Worked problem 2 — the RISC-shaped version.</strong> "A 32-bit instruction, 128 operations, 3 register operands out of 32 registers. How many bits are left, and what does that buy?"</p>
<ul>
<li>Opcode: ceil(log<sub>2</sub> 128) = <strong>7 bits</strong>.</li>
<li>Registers: log<sub>2</sub> 32 = <strong>5 bits</strong> each, three of them = <strong>15 bits</strong>.</li>
<li>Remaining: 32 − 7 − 15 = <strong>10 bits</strong>.</li>
</ul>
<p class="dap-an">✅ Answer: <strong>10 bits</strong>, giving a signed immediate/displacement range of <strong>−512 to +511</strong>. Notice what just happened: three operands, a rich opcode <em>and</em> a usable displacement all fit in 32 bits — but only because the operands are <em>registers</em>. Try the same instruction with even one 32-bit memory address and it does not fit at all. That single calculation is the entire argument of Chapter 17.</p>
<p class="nhan"><strong>Worked problem 3 — the PDP-8, a real machine (see slide 23).</strong> "A 12-bit instruction has a 3-bit opcode, a 1-bit direct/indirect flag, a 1-bit page flag, and the rest is a displacement. How much memory can one instruction reach directly, out of a 4096-word memory?"</p>
<ul>
<li>Displacement: 12 − 3 − 1 − 1 = <strong>7 bits</strong> → 2<sup>7</sup> = <strong>128 words per page</strong>.</li>
<li>The page bit chooses page 0 or the current page, so a single instruction can name <strong>2 × 128 = 256 words</strong>.</li>
<li>Total memory: 2<sup>12</sup> = <strong>4096 words</strong>.</li>
</ul>
<p class="dap-an">✅ Answer: one instruction reaches <strong>256 of 4096 words = 6.25%</strong> directly. Everything else needs the indirect bit, i.e. a second memory reference. That is Table 14.1's "limited address space" of direct addressing, measured on a real machine. (Verified: 2<sup>7</sup> = 128, 2 × 128 = 256, 2<sup>12</sup> = 4096.)</p>
<p class="meo">💡 The drill is always the same four lines: (1) opcode bits = ceil(log<sub>2</sub> number of operations); (2) register bits = log<sub>2</sub> number of registers, times the number of register operands; (3) what is left is the address/displacement; (4) range = 2<sup>k</sup> unsigned, or −2<sup>k−1</sup> … 2<sup>k−1</sup>−1 signed. Write those four lines before you do any arithmetic and you will not lose marks.</p>
<p class="pitfall">⚠️ Two traps. <strong>Use ceil, not round</strong>: 60 operations need 6 bits (2<sup>5</sup> = 32 is not enough, 2<sup>6</sup> = 64 is), and the 4 unused codes are simply wasted. And <strong>count the mode bits</strong>: if the question says "supports 8 addressing modes", that is another 3 bits per operand, and many students forget to subtract them.</p>`,
        `<p class="y-chinh">🎯 Chốt xong độ dài lệnh là bạn có một NGÂN SÁCH bit cố định để chia. Slide này liệt kê <strong>SÁU yếu tố</strong> quyết định cách chia: <strong>Số chế độ địa chỉ</strong> · <strong>Số toán hạng</strong> · <strong>Thanh ghi hay bộ nhớ</strong> · <strong>Số tập thanh ghi</strong> · <strong>Tầm địa chỉ</strong> · <strong>Độ mịn địa chỉ</strong>.</p>
<table>
<tr><th>Yếu tố</th><th>Nó tốn bao nhiêu bit</th><th>Đánh đổi nó ép ra</th></tr>
<tr><td>Số chế độ địa chỉ</td><td>trần(log<sub>2</sub> số chế độ) cho MỖI toán hạng, trừ khi mã thao tác đã hàm ý chế độ</td><td>7 chế độ = 3 bit mỗi toán hạng; số bit đó cắt ra từ trường địa chỉ</td></tr>
<tr><td>Số toán hạng</td><td>mỗi toán hạng một trường đầy đủ</td><td>Ba địa chỉ thì diễn đạt mạnh nhưng béo; không địa chỉ (ngăn xếp) thì tí hon nhưng cần nhiều lệnh hơn</td></tr>
<tr><td>Thanh ghi hay bộ nhớ</td><td>thanh ghi ~3–5 bit, địa chỉ bộ nhớ 16–64 bit</td><td>Nhiều thanh ghi = lệnh ngắn hơn nhưng trình biên dịch khó hơn</td></tr>
<tr><td>Số tập thanh ghi</td><td>tách tập riêng (dữ liệu/địa chỉ, nguyên/dấu chấm động) làm mỗi trường co lại</td><td>Hai tập 8 cái cần 3 bit mỗi tập, thay vì một tập 16 cái cần 4 bit</td></tr>
<tr><td>Tầm địa chỉ</td><td>k bit với tới 2<sup>k</sup> ô</td><td>Đây là trường LUÔN thua; các chế độ độ dời sinh ra để cứu nó</td></tr>
<tr><td>Độ mịn địa chỉ</td><td>đánh theo byte hay theo từ</td><td>Đánh theo từ trên từ 32 bit tiết kiệm được 2 bit ở MỌI địa chỉ</td></tr>
</table>
<p class="nhan"><strong>Bài giải 1 — câu hỏi thi kinh điển.</strong> "Một lệnh dài <strong>16 bit</strong>. Máy cần <strong>32 thao tác</strong>, và mỗi lệnh có <strong>2 toán hạng thanh ghi chọn trong 8 thanh ghi</strong>. Số bit còn lại là độ dời. Độ dời được bao nhiêu bit, và tầm với là bao nhiêu?"</p>
<ul>
<li>Mã thao tác: 32 thao tác cần trần(log<sub>2</sub> 32) = <strong>5 bit</strong> (2<sup>5</sup> = 32 vừa khít).</li>
<li>Thanh ghi: 8 thanh ghi cần log<sub>2</sub> 8 = <strong>3 bit</strong> mỗi cái, hai cái = <strong>6 bit</strong>.</li>
<li>Độ dời: 16 − 5 − 6 = <strong>5 bit</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án: <strong>độ dời 5 bit</strong>. Tầm với nếu là số bù hai CÓ DẤU: <strong>−16 tới +15</strong>. Nếu đề nói độ dời KHÔNG DẤU: <strong>0 tới 31</strong>. Luôn ghi rõ bạn giả thiết cái nào — cả hai đáp án đều đúng với giả thiết của nó, và người chấm muốn thấy bạn nêu giả thiết ra. (Đã kiểm bằng máy: 16−5−6 = 5; −2<sup>4</sup> = −16, 2<sup>4</sup>−1 = 15, 2<sup>5</sup>−1 = 31.)</p>
<p class="nhan"><strong>Bài giải 2 — bản dáng RISC.</strong> "Lệnh 32 bit, 128 thao tác, 3 toán hạng thanh ghi trong 32 thanh ghi. Còn lại bao nhiêu bit, và ngần ấy mua được gì?"</p>
<ul>
<li>Mã thao tác: trần(log<sub>2</sub> 128) = <strong>7 bit</strong>.</li>
<li>Thanh ghi: log<sub>2</sub> 32 = <strong>5 bit</strong> mỗi cái, ba cái = <strong>15 bit</strong>.</li>
<li>Còn lại: 32 − 7 − 15 = <strong>10 bit</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án: <strong>10 bit</strong>, cho tầm hằng tức thời/độ dời có dấu là <strong>−512 tới +511</strong>. Để ý chuyện vừa xảy ra: BA toán hạng, một mã thao tác phong phú <em>VÀ</em> một độ dời dùng được, tất cả nhét vừa 32 bit — nhưng chỉ vì các toán hạng là <em>THANH GHI</em>. Thử đúng lệnh đó với chỉ MỘT địa chỉ bộ nhớ 32 bit thôi là không nhét vừa nữa. Đúng một phép tính đó là toàn bộ lập luận của Chương 17.</p>
<p class="nhan"><strong>Bài giải 3 — PDP-8, một cỗ máy THẬT (xem slide 23).</strong> "Lệnh 12 bit có mã thao tác 3 bit, một cờ trực tiếp/gián tiếp 1 bit, một cờ trang 1 bit, phần còn lại là độ dời. Một lệnh với tới TRỰC TIẾP được bao nhiêu bộ nhớ, trong tổng số 4096 từ?"</p>
<ul>
<li>Độ dời: 12 − 3 − 1 − 1 = <strong>7 bit</strong> → 2<sup>7</sup> = <strong>128 từ mỗi trang</strong>.</li>
<li>Bit trang chọn trang 0 hoặc trang hiện tại, nên MỘT lệnh nêu tên được <strong>2 × 128 = 256 từ</strong>.</li>
<li>Tổng bộ nhớ: 2<sup>12</sup> = <strong>4096 từ</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án: một lệnh với tới trực tiếp <strong>256 trong 4096 từ = 6,25%</strong>. Tất cả phần còn lại phải dùng bit gián tiếp, tức thêm một lần đọc bộ nhớ. Đó chính là câu "không gian địa chỉ bị giới hạn" của địa chỉ trực tiếp trong Table 14.1, đo trên một cỗ máy thật. (Đã kiểm: 2<sup>7</sup> = 128, 2 × 128 = 256, 2<sup>12</sup> = 4096.)</p>
<p class="meo">💡 Quy trình luôn là bốn dòng: (1) số bit mã thao tác = trần(log<sub>2</sub> số thao tác); (2) số bit thanh ghi = log<sub>2</sub> số thanh ghi, nhân với số toán hạng thanh ghi; (3) phần còn lại là địa chỉ/độ dời; (4) tầm = 2<sup>k</sup> nếu không dấu, hoặc −2<sup>k−1</sup> … 2<sup>k−1</sup>−1 nếu có dấu. Viết bốn dòng đó ra TRƯỚC khi tính là không mất điểm.</p>
<p class="pitfall">⚠️ Hai bẫy. <strong>Dùng hàm TRẦN, đừng làm tròn</strong>: 60 thao tác cần 6 bit (2<sup>5</sup> = 32 không đủ, 2<sup>6</sup> = 64 mới đủ), và 4 mã thừa đơn giản là bỏ phí. Và <strong>nhớ đếm cả bit CHẾ ĐỘ</strong>: đề nói "hỗ trợ 8 chế độ địa chỉ" là thêm 3 bit cho MỖI toán hạng, và rất nhiều bạn quên trừ chúng đi.</p>`],

      [23, 'Figure 14.5 — PDP-8 Instruction Formats (five formats in 12 bits)',
        `<p class="y-chinh">🎯 A real machine with a <strong>12-bit instruction and 12-bit word</strong>, and five different formats squeezed into it. This figure is the best possible illustration of slide 22, because the budget is so tight that every bit is visibly fought over.</p>
<table>
<tr><th>Format</th><th>Fields (bit positions from the figure)</th></tr>
<tr><td><strong>Memory Reference</strong></td><td><code>Opcode</code> bits 0–2 · <code>D/I</code> bit 3 · <code>Z/C</code> bit 4 · <code>Displacement</code> bits 5–11</td></tr>
<tr><td><strong>Input/Output</strong></td><td><code>1 1 0</code> bits 0–2 · <code>Device</code> bits 3–8 · <code>Opcode</code> bits 9–11</td></tr>
<tr><td><strong>Register Reference, Group 1</strong></td><td><code>1 1 1 0</code> bits 0–3, then eight <em>one-bit</em> microinstruction flags: CLA · CLL · CMA · CML · RAR · RAL · BSW · IAC</td></tr>
<tr><td><strong>Register Reference, Group 2</strong></td><td><code>1 1 1 1</code> bits 0–3, then CLA · SMA · SZA · SNL · RSS · OSR · HLT · 0</td></tr>
<tr><td><strong>Register Reference, Group 3</strong></td><td><code>1 1 1 1</code> bits 0–3, then CLA · MQA · 0 · MQL · 0 · 0 · 0 · 1</td></tr>
</table>
<ul>
<li><strong>Look at the memory-reference format: it is slide 22's worked problem 3, drawn.</strong> 3 bits of opcode (8 operations), D/I = "Direct/Indirect address", Z/C = "Page 0 or Current page", and 7 bits of displacement = 128 words. One instruction can name 256 of the machine's 4096 words.</li>
<li><strong>The register-reference groups are a completely different philosophy.</strong> Instead of an opcode field naming <em>one</em> operation, each bit <em>is</em> an operation: set the CLA bit and the accumulator is cleared, set CMA and it is complemented, set both and both happen in one instruction. Eight independent flags = 256 possible combinations from 8 bits, versus 8 operations if it had been a 3-bit opcode field.</li>
<li><strong>Read the legend, it is the exam's vocabulary.</strong> CLA = Clear Accumulator · CLL = Clear Link · CMA = Complement Accumulator · CML = Complement Link · RAR/RAL = Rotate Accumulator Right/Left · BSW = Byte Swap · IAC = Increment Accumulator · SMA = Skip on Minus Accumulator · SZA = Skip on Zero Accumulator · SNL = Skip on Nonzero Link · RSS = Reverse Skip Sense · OSR = Or with Switch Register · HLT = Halt · MQA = Multiplier Quotient into Accumulator · MQL = Multiplier Quotient Load.</li>
<li><strong>How the decoder tells the formats apart: an expanding opcode.</strong> If bits 0–2 are not 110 or 111, it is a memory reference. If they are 110, it is I/O. If they are 111, bit 3 chooses between Group 1 (0) and Groups 2/3 (1). Short opcodes for common instructions, longer opcodes for rare ones — that is the general technique, and slide 26 (PDP-11) shows it done at a much larger scale.</li>
<li><strong>Why this machine mattered.</strong> The PDP-8 was cheap enough to put a computer in an ordinary lab, and it was cheap partly <em>because</em> 12 bits meant less memory and a narrower bus. This figure is what that economy looks like from the inside.</li>
</ul>
<p class="dap-an">✅ Cross-check the bit positions: memory-reference is 3 + 1 + 1 + 7 = <strong>12</strong> ✓; I/O is 3 + 6 + 3 = <strong>12</strong> ✓; each register-reference group is 4 + 8 = <strong>12</strong> ✓. All three formats fill exactly one word, which is rule 1 of slide 21 obeyed.</p>
<p class="meo">💡 If an exam asks "why does the PDP-8 need an indirect bit at all?", the answer is one line of arithmetic: 7 displacement bits reach 128 words, the machine has 4096. Without indirection, 93.75% of memory would be unreachable by a single instruction.</p>`,
        `<p class="y-chinh">🎯 Một cỗ máy thật với <strong>lệnh 12 bit và từ 12 bit</strong>, và NĂM khuôn dạng khác nhau nhồi vào đó. Bức hình này là minh hoạ tốt nhất có thể cho slide 22, vì ngân sách chật tới mức mọi bit đều thấy rõ là đang bị tranh giành.</p>
<table>
<tr><th>Khuôn dạng</th><th>Các trường (vị trí bit lấy từ hình)</th></tr>
<tr><td><strong>Memory Reference</strong> — tham chiếu bộ nhớ</td><td><code>Opcode</code> bit 0–2 · <code>D/I</code> bit 3 · <code>Z/C</code> bit 4 · <code>Displacement</code> bit 5–11</td></tr>
<tr><td><strong>Input/Output</strong> — vào/ra</td><td><code>1 1 0</code> bit 0–2 · <code>Device</code> bit 3–8 · <code>Opcode</code> bit 9–11</td></tr>
<tr><td><strong>Register Reference, Group 1</strong></td><td><code>1 1 1 0</code> bit 0–3, rồi TÁM cờ vi lệnh mỗi cờ MỘT BIT: CLA · CLL · CMA · CML · RAR · RAL · BSW · IAC</td></tr>
<tr><td><strong>Register Reference, Group 2</strong></td><td><code>1 1 1 1</code> bit 0–3, rồi CLA · SMA · SZA · SNL · RSS · OSR · HLT · 0</td></tr>
<tr><td><strong>Register Reference, Group 3</strong></td><td><code>1 1 1 1</code> bit 0–3, rồi CLA · MQA · 0 · MQL · 0 · 0 · 0 · 1</td></tr>
</table>
<ul>
<li><strong>Nhìn khuôn tham chiếu bộ nhớ: đó chính là bài giải 3 của slide 22, vẽ ra.</strong> 3 bit mã thao tác (8 thao tác), D/I = "Direct/Indirect address" (địa chỉ trực tiếp/gián tiếp), Z/C = "Page 0 or Current page" (trang 0 hay trang hiện tại), và 7 bit độ dời = 128 từ. Một lệnh nêu tên được 256 trong 4096 từ của máy.</li>
<li><strong>Nhóm tham chiếu thanh ghi là một triết lý HOÀN TOÀN khác.</strong> Thay vì một trường mã thao tác nêu tên <em>MỘT</em> thao tác, ở đây mỗi BIT <em>LÀ</em> một thao tác: bật bit CLA thì thanh tích luỹ bị xoá, bật CMA thì nó bị lấy bù, bật cả hai thì cả hai xảy ra trong MỘT lệnh. Tám cờ độc lập = 256 tổ hợp có thể từ 8 bit, so với 8 thao tác nếu đó là một trường mã thao tác 3 bit.</li>
<li><strong>Đọc phần chú giải, đó là từ vựng đề thi dùng.</strong> CLA = Xoá thanh tích luỹ · CLL = Xoá Link · CMA = Lấy bù thanh tích luỹ · CML = Lấy bù Link · RAR/RAL = Quay thanh tích luỹ phải/trái · BSW = Hoán vị byte · IAC = Tăng thanh tích luỹ · SMA = Bỏ qua nếu thanh tích luỹ ÂM · SZA = Bỏ qua nếu thanh tích luỹ bằng 0 · SNL = Bỏ qua nếu Link khác 0 · RSS = Đảo chiều điều kiện bỏ qua · OSR = OR với thanh ghi công tắc · HLT = Dừng · MQA = Đưa MQ vào thanh tích luỹ · MQL = Nạp MQ.</li>
<li><strong>Bộ giải mã phân biệt các khuôn ra sao: MÃ THAO TÁC MỞ RỘNG.</strong> Nếu bit 0–2 không phải 110 cũng không phải 111 thì đó là tham chiếu bộ nhớ. Nếu là 110 thì là vào/ra. Nếu là 111 thì bit 3 chọn giữa Group 1 (0) và Group 2/3 (1). Mã ngắn cho lệnh phổ biến, mã dài cho lệnh hiếm — đó là kỹ thuật tổng quát, và slide 26 (PDP-11) cho thấy nó làm ở quy mô lớn hơn nhiều.</li>
<li><strong>Vì sao cỗ máy này quan trọng.</strong> PDP-8 rẻ đủ để đặt một chiếc máy tính vào một phòng thí nghiệm bình thường, và nó rẻ một phần CHÍNH VÌ 12 bit nghĩa là ít bộ nhớ hơn và bus hẹp hơn. Bức hình này là cái nền kinh tế đó nhìn từ bên trong.</li>
</ul>
<p class="dap-an">✅ Đối chiếu vị trí bit: tham chiếu bộ nhớ là 3 + 1 + 1 + 7 = <strong>12</strong> ✓; vào/ra là 3 + 6 + 3 = <strong>12</strong> ✓; mỗi nhóm tham chiếu thanh ghi là 4 + 8 = <strong>12</strong> ✓. Cả ba khuôn đều lấp vừa ĐÚNG một từ, tức quy tắc 1 của slide 21 được tuân thủ.</p>
<p class="meo">💡 Đề hỏi "vì sao PDP-8 lại cần bit gián tiếp?" thì đáp án chỉ là một dòng số học: 7 bit độ dời với tới 128 từ, mà máy có 4096. Không có gián tiếp thì 93,75% bộ nhớ không lệnh đơn nào chạm tới được.</p>`],

      [24, 'Figure 14.6 — PDP-10 Instruction Format (one format, 36 bits)',
        `<p class="y-chinh">🎯 The exact opposite design philosophy to the PDP-8: a <strong>36-bit instruction</strong> with <strong>one single format</strong> for every instruction in the machine. Fields read from the figure: <code>Opcode</code> bits 0–8 · <code>Register</code> bits 9–12 · <code>I</code> bit 13 · <code>Index Register</code> bits 14–17 · <code>Memory Address</code> bits 18–35. The legend says <strong>I = indirect bit</strong>.</p>
<table>
<tr><th>Field</th><th>Bits</th><th>Width</th><th>What it buys</th></tr>
<tr><td>Opcode</td><td>0–8</td><td>9</td><td>2<sup>9</sup> = 512 possible operations</td></tr>
<tr><td>Register</td><td>9–12</td><td>4</td><td>one of 16 general registers</td></tr>
<tr><td>I (indirect)</td><td>13</td><td>1</td><td>turns the whole address calculation into indirect addressing, and can cascade</td></tr>
<tr><td>Index Register</td><td>14–17</td><td>4</td><td>one of 16 index registers; 0 means "no indexing"</td></tr>
<tr><td>Memory Address</td><td>18–35</td><td>18</td><td>2<sup>18</sup> = 262 144 words addressed directly</td></tr>
</table>
<ul>
<li><strong>The design goal is regularity, and you can see it.</strong> Every instruction has the same shape, so the decoder is trivial and every instruction takes the same time to fetch. This is the same argument RISC would make twenty years later (Chapter 17) — but done with a very wide instruction rather than a lean one.</li>
<li><strong>One instruction supports four addressing modes at once.</strong> Plain direct (I = 0, index = 0), indexed (index ≠ 0), indirect (I = 1), and indexed-indirect (both). Nothing has to be encoded as a separate opcode — which is exactly why the opcode field can be spent on 512 <em>operations</em> instead.</li>
<li><strong>The <code>I</code> bit is cascaded indirection from slide 7, in hardware.</strong> Follow the pointer, and if the word you land on also has its I bit set, follow again. The slide 7 warning — "three or more memory references could be required" — is not hypothetical on this machine; a badly built chain could loop forever.</li>
<li><strong>Compare the budgets and the philosophy jumps out.</strong> PDP-8: 12 bits, 3-bit opcode, 7-bit displacement, five formats, indirect bit mandatory to reach memory. PDP-10: 36 bits, 9-bit opcode, 18-bit address, one format, indirect bit optional. Three times the instruction length buys you simplicity <em>and</em> reach — at three times the memory cost for every program.</li>
<li><strong>Verify the field widths add up.</strong> 9 + 4 + 1 + 4 + 18 = <strong>36</strong> ✓ exactly one word. Again slide 21's rule 1.</li>
</ul>
<p class="dap-an">✅ Worked problem 4 (exam style, built on this format). "How many words can a PDP-10 instruction address without using the indirect bit, and what fraction of a 2<sup>18</sup>-word memory is that?" The address field is 18 bits → 2<sup>18</sup> = <strong>262 144 words</strong>, which is <strong>100%</strong> of that memory. Compare the PDP-8's 6.25%. That single contrast is what "allocation of bits" (slide 22) means in practice: a wider instruction removes the need for tricks.</p>
<p class="meo">💡 Remember the two machines as a pair: <strong>PDP-8 = many formats, tiny instruction, tricks everywhere</strong>; <strong>PDP-10 = one format, wide instruction, no tricks needed</strong>. Any exam question about the cost of instruction length can be answered by contrasting these two.</p>`,
        `<p class="y-chinh">🎯 Triết lý thiết kế NGƯỢC HẲN với PDP-8: <strong>lệnh 36 bit</strong> với <strong>DUY NHẤT MỘT khuôn dạng</strong> cho mọi lệnh trong máy. Các trường đọc từ hình: <code>Opcode</code> bit 0–8 · <code>Register</code> bit 9–12 · <code>I</code> bit 13 · <code>Index Register</code> bit 14–17 · <code>Memory Address</code> bit 18–35. Chú giải ghi <strong>I = bit gián tiếp</strong>.</p>
<table>
<tr><th>Trường</th><th>Bit</th><th>Độ rộng</th><th>Nó mua được gì</th></tr>
<tr><td>Opcode</td><td>0–8</td><td>9</td><td>2<sup>9</sup> = 512 thao tác khả dĩ</td></tr>
<tr><td>Register</td><td>9–12</td><td>4</td><td>một trong 16 thanh ghi đa dụng</td></tr>
<tr><td>I (gián tiếp)</td><td>13</td><td>1</td><td>biến cả phép tính địa chỉ thành địa chỉ gián tiếp, và có thể nối tầng</td></tr>
<tr><td>Index Register</td><td>14–17</td><td>4</td><td>một trong 16 thanh ghi chỉ số; giá trị 0 nghĩa là "không lập chỉ số"</td></tr>
<tr><td>Memory Address</td><td>18–35</td><td>18</td><td>2<sup>18</sup> = 262 144 từ, đánh địa chỉ TRỰC TIẾP</td></tr>
</table>
<ul>
<li><strong>Mục tiêu thiết kế là tính ĐỀU ĐẶN, và bạn nhìn thấy nó.</strong> Mọi lệnh cùng một hình dạng, nên bộ giải mã tầm thường và mọi lệnh tốn cùng thời gian nạp. Đây đúng là lập luận mà RISC sẽ đưa ra hai mươi năm sau (Chương 17) — nhưng làm bằng một lệnh RẤT RỘNG thay vì một lệnh gọn.</li>
<li><strong>MỘT lệnh đỡ được BỐN chế độ địa chỉ cùng lúc.</strong> Trực tiếp thuần (I = 0, chỉ số = 0), chỉ số (chỉ số ≠ 0), gián tiếp (I = 1), và chỉ-số-gián-tiếp (cả hai). Không thứ nào phải mã hoá thành một mã thao tác riêng — đó chính xác là lý do trường mã thao tác được tiêu vào 512 <em>THAO TÁC</em> thay vì vào các chế độ.</li>
<li><strong>Bit <code>I</code> chính là gián tiếp NỐI TẦNG ở slide 7, làm bằng phần cứng.</strong> Đi theo con trỏ, và nếu từ mà bạn rơi vào cũng bật bit I của nó thì đi tiếp. Lời cảnh báo ở slide 7 — "có thể cần ba hoặc nhiều hơn lần đọc bộ nhớ" — trên cỗ máy này không phải giả thuyết; một chuỗi dựng ẩu có thể lặp vô tận.</li>
<li><strong>So hai ngân sách là thấy bật ra triết lý.</strong> PDP-8: 12 bit, mã thao tác 3 bit, độ dời 7 bit, năm khuôn dạng, bit gián tiếp là BẮT BUỘC mới với tới bộ nhớ. PDP-10: 36 bit, mã thao tác 9 bit, địa chỉ 18 bit, một khuôn dạng, bit gián tiếp là TUỲ CHỌN. Lệnh dài gấp ba mua về cả sự đơn giản <em>LẪN</em> tầm với — đổi lại mọi chương trình tốn gấp ba bộ nhớ.</li>
<li><strong>Kiểm tổng độ rộng các trường.</strong> 9 + 4 + 1 + 4 + 18 = <strong>36</strong> ✓ đúng một từ. Lại là quy tắc 1 của slide 21.</li>
</ul>
<p class="dap-an">✅ Bài luyện 4 (dạng đề thi, dựng trên khuôn dạng này). "Một lệnh PDP-10 đánh địa chỉ được bao nhiêu từ mà KHÔNG cần bit gián tiếp, và đó là bao nhiêu phần của bộ nhớ 2<sup>18</sup> từ?" Trường địa chỉ 18 bit → 2<sup>18</sup> = <strong>262 144 từ</strong>, tức <strong>100%</strong> bộ nhớ ấy. So với 6,25% của PDP-8. Đúng một phép đối chiếu đó là ý nghĩa thực tế của "phân bổ bit" (slide 22): lệnh rộng hơn thì xoá sạch nhu cầu dùng mẹo.</p>
<p class="meo">💡 Nhớ hai cỗ máy này thành một cặp: <strong>PDP-8 = nhiều khuôn dạng, lệnh tí hon, mẹo khắp nơi</strong>; <strong>PDP-10 = một khuôn dạng, lệnh rộng, không cần mẹo nào</strong>. Mọi câu hỏi thi về cái giá của độ dài lệnh đều trả lời được bằng cách đối chiếu hai máy này.</p>`],

      [25, 'Variable-Length Instructions — the third way, and what it costs',
        `<p class="y-chinh">🎯 Instead of picking one instruction length, let each instruction be as long as it needs to be. The slide gives the benefit in one line and then spends the rest of the slide on the bill.</p>
<ul>
<li><strong>The benefit: "Variations can be provided efficiently and compactly."</strong> A <code>RETURN</code> needs no operands and can be one byte; a <code>MOV</code> with two memory addresses and a 32-bit immediate needs a dozen. With variable length, each pays only for what it uses. Slide 27 (VAX) shows exactly this: instructions from 1 byte to many.</li>
<li><strong>Cost 1: "Increases the complexity of the processor."</strong> The decoder must work out the length of an instruction from its own leading bytes before it can even find the next one. On a superscalar machine trying to decode four instructions per cycle (Chapter 18), that serial dependency is brutal — modern x86 chips spend real silicon and power on length-decoding logic alone.</li>
<li><strong>Cost 2: "Does not remove the desirability of making all of the instruction lengths integrally related to word length."</strong> In other words slide 21's rules still apply. Variable length means 1, 2, 4, 8 bytes — not arbitrary bit counts.</li>
<li><strong>Cost 3, the interesting one: you must over-fetch.</strong> "Because the processor <strong>does not know the length of the next instruction to be fetched</strong>, a typical strategy is to <strong>fetch a number of bytes or words equal to at least the longest possible instruction</strong>." And: "<strong>Sometimes multiple instructions are fetched.</strong>"</li>
<li><strong>Read that third cost as an engineering consequence.</strong> Fetching "at least the longest possible instruction" means the CPU regularly pulls in bytes it will not use, or it pulls in several instructions at once and must sort them out. That is why every variable-length machine has a prefetch buffer / instruction queue — and why a taken branch throws that buffer away. Chapter 16 (processor structure) picks this up under pipelining.</li>
<li><strong>The three-way comparison to carry into the exam.</strong> <em>Fixed short</em> (PDP-8, 12 bits): simple, fast fetch, cramped. <em>Fixed long</em> (PDP-10, 36 bits): simple, roomy, wasteful. <em>Variable</em> (VAX, x86): compact and expressive, but a complex decoder and unpredictable fetch. RISC (Chapter 17) deliberately chose fixed 32-bit and accepted lower code density — then ARM partly took it back with Thumb (slides 31–33), which is the best evidence that neither side wins outright.</li>
</ul>
<p class="meo">💡 One image for the whole slide: variable-length instructions are like a paragraph with no spaces — you can read it, but only by working left to right one word at a time. Fixed-length instructions are ruled columns: you can jump straight to word 17.</p>
<p class="pitfall">⚠️ Do not confuse "variable-length instructions" with "multiple instruction formats". The PDP-8 has five formats but all are exactly 12 bits — fixed length. The VAX has variable length. A machine can have either, both, or neither.</p>`,
        `<p class="y-chinh">🎯 Thay vì chọn một độ dài lệnh, hãy để mỗi lệnh dài đúng bằng mức nó cần. Slide nêu cái lợi trong một dòng rồi dành toàn bộ phần còn lại cho hoá đơn phải trả.</p>
<ul>
<li><strong>Cái lợi: "Các biến thể được cung cấp một cách hiệu quả và gọn gàng."</strong> Lệnh <code>RETURN</code> không cần toán hạng nào nên một byte là đủ; lệnh <code>MOV</code> với hai địa chỉ bộ nhớ và một hằng 32 bit thì cần cả chục byte. Với độ dài thay đổi, mỗi lệnh chỉ trả cho phần nó dùng. Slide 27 (VAX) cho thấy đúng điều này: lệnh từ 1 byte tới rất nhiều byte.</li>
<li><strong>Giá 1: "Làm tăng độ phức tạp của bộ xử lý."</strong> Bộ giải mã phải tự suy ra độ dài của một lệnh từ chính mấy byte đầu của nó thì mới tìm được lệnh kế tiếp. Trên máy superscalar cố giải mã bốn lệnh mỗi chu kỳ (Chương 18), cái phụ thuộc tuần tự đó là tàn nhẫn — chip x86 hiện đại tốn silicon và điện năng thật chỉ cho riêng phần mạch xác định độ dài lệnh.</li>
<li><strong>Giá 2: "Không xoá bỏ việc nên làm cho mọi độ dài lệnh có quan hệ nguyên với độ dài từ."</strong> Nói cách khác, các quy tắc ở slide 21 VẪN áp dụng. Độ dài thay đổi nghĩa là 1, 2, 4, 8 byte — không phải số bit tuỳ tiện.</li>
<li><strong>Giá 3, cái thú vị nhất: phải NẠP DƯ.</strong> "Vì bộ xử lý <strong>KHÔNG biết độ dài của lệnh kế tiếp sắp nạp</strong>, chiến lược điển hình là <strong>nạp một số byte hoặc từ ít nhất bằng lệnh DÀI NHẤT có thể có</strong>." Và: "<strong>Đôi khi nhiều lệnh được nạp cùng lúc.</strong>"</li>
<li><strong>Đọc giá thứ ba như một hệ quả kỹ thuật.</strong> Nạp "ít nhất bằng lệnh dài nhất có thể" nghĩa là CPU thường xuyên kéo về những byte nó sẽ không dùng, hoặc kéo về vài lệnh cùng lúc rồi phải tự tách ra. Đó là lý do mọi máy lệnh-độ-dài-thay-đổi đều có bộ đệm nạp trước / hàng đợi lệnh — và là lý do một lệnh nhảy được thực hiện sẽ VỨT sạch bộ đệm ấy. Chương 16 (cấu trúc bộ xử lý) kể tiếp chuyện này ở phần đường ống.</li>
<li><strong>Bộ ba so sánh nên mang vào phòng thi.</strong> <em>Cố định NGẮN</em> (PDP-8, 12 bit): đơn giản, nạp nhanh, chật chội. <em>Cố định DÀI</em> (PDP-10, 36 bit): đơn giản, rộng rãi, lãng phí. <em>Thay đổi</em> (VAX, x86): gọn và diễn đạt mạnh, nhưng bộ giải mã phức tạp và việc nạp lệnh không đoán trước được. RISC (Chương 17) cố ý chọn cố định 32 bit và chấp nhận mật độ mã thấp hơn — rồi ARM lấy lại một phần bằng Thumb (slide 31–33), bằng chứng rõ nhất rằng không bên nào thắng dứt điểm.</li>
</ul>
<p class="meo">💡 Một hình ảnh cho cả slide: lệnh độ dài thay đổi giống một đoạn văn không có dấu cách — đọc được, nhưng chỉ bằng cách đi từ trái sang phải từng từ một. Lệnh độ dài cố định là một bảng kẻ ô: bạn nhảy thẳng tới từ thứ 17 được.</p>
<p class="pitfall">⚠️ Đừng lẫn "lệnh độ dài thay đổi" với "nhiều khuôn dạng lệnh". PDP-8 có NĂM khuôn dạng nhưng tất cả đều đúng 12 bit — độ dài CỐ ĐỊNH. VAX mới là độ dài thay đổi. Một cỗ máy có thể có cái này, cái kia, cả hai, hoặc không cái nào.</p>`],

      [26, 'Figure 14.7 — Instruction Formats for the PDP-11 (thirteen formats)',
        `<p class="y-chinh">🎯 Thirteen formats on one slide, and the numbers underneath each field are bit widths. This is what "more than one instruction format is used" (slide 20) looks like when a designer really means it. The notes at the bottom are the key: <strong>Source and Destination each contain a 3-bit addressing mode field and a 3-bit register number</strong> · <strong>FP indicates one of four floating-point registers</strong> · <strong>R indicates one of the general-purpose registers</strong> · <strong>CC is the condition code field</strong>.</p>
<table>
<tr><th>#</th><th>Fields and widths</th><th>Total</th></tr>
<tr><td>1</td><td>Opcode 4 · Source 6 · Destination 6</td><td>16 bits</td></tr>
<tr><td>2</td><td>Opcode 7 · R 3 · Source 6</td><td>16</td></tr>
<tr><td>3</td><td>Opcode 8 · Offset 8</td><td>16</td></tr>
<tr><td>4</td><td>Opcode 8 · FP 2 · Destination 6</td><td>16</td></tr>
<tr><td>5</td><td>Opcode 10 · Destination 6</td><td>16</td></tr>
<tr><td>6</td><td>Opcode 12 · CC 4</td><td>16</td></tr>
<tr><td>7</td><td>Opcode 13 · R 3</td><td>16</td></tr>
<tr><td>8</td><td>Opcode 16</td><td>16</td></tr>
<tr><td>9</td><td>Opcode 4 · Source 6 · Destination 6 · Memory Address 16</td><td>32</td></tr>
<tr><td>10</td><td>Opcode 7 · R 3 · Source 6 · Memory Address 16</td><td>32</td></tr>
<tr><td>11</td><td>Opcode 8 · FP 2 · Source 6 · Memory Address 16</td><td>32</td></tr>
<tr><td>12</td><td>Opcode 10 · Destination 6 · Memory Address 16</td><td>32</td></tr>
<tr><td>13</td><td>Opcode 4 · Source 6 · Destination 6 · Memory Address 1 (16) · Memory Address 2 (16)</td><td>48</td></tr>
</table>
<ul>
<li><strong>The 6-bit operand field is the design's centrepiece.</strong> 3 bits of addressing mode + 3 bits of register number. Eight modes and eight registers, in six bits, for <em>each</em> operand. That is slide 22's "number of addressing modes" factor paid for explicitly — and it is why the PDP-11 was famous for being orthogonal: any mode works with any register and any operation.</li>
<li><strong>Watch the opcode field grow as the operands shrink: 4, 7, 8, 10, 12, 13, 16.</strong> That is an <strong>expanding opcode</strong>. Format 1 has two full operands and can afford only 16 opcodes; format 8 has no operands at all and can afford 65 536. Bits not spent on operands go back into the opcode — the budget is conserved, exactly as slide 22 says.</li>
<li><strong>Formats 1–8 are 16 bits; 9–12 are 32; 13 is 48.</strong> That is variable-length instructions (slide 25) in a real machine: 2, 4 or 6 bytes, always a whole number of 16-bit words, obeying slide 21's rule 1.</li>
<li><strong>Format 13 is the one to remember for exam discussion.</strong> Two full 16-bit memory addresses in one instruction — a true memory-to-memory two-address instruction. It costs 48 bits, i.e. three memory fetches just to read the instruction, before any operand is touched. RISC's objection to formats like this is Chapter 17 in one picture.</li>
<li><strong>Verify a row so the method is yours.</strong> Format 10: 7 + 3 + 6 + 16 = <strong>32</strong> ✓. Format 13: 4 + 6 + 6 + 16 + 16 = <strong>48</strong> ✓. Every row sums to a multiple of 16.</li>
</ul>
<p class="dap-an">✅ Worked problem 5 (exam style). "In PDP-11 format 1, how many distinct operations can the opcode name, and how many distinct source-operand specifications are possible?" Opcode 4 bits → 2<sup>4</sup> = <strong>16 operations</strong>. Source 6 bits = 3 mode + 3 register → 2<sup>3</sup> × 2<sup>3</sup> = <strong>64 combinations</strong> (8 modes × 8 registers). Multiply out the whole instruction: 2<sup>16</sup> = 65 536 distinct 16-bit encodings in this format alone.</p>
<p class="meo">💡 When you see a diagram of many formats, do not try to memorise them. Just check three things: (a) do the widths sum to a whole number of words, (b) does the opcode get bigger as operands get fewer (expanding opcode), (c) how many bits go to addressing modes. Those three answers cover almost every exam question about a format diagram.</p>`,
        `<p class="y-chinh">🎯 Mười ba khuôn dạng trên một slide, và các con số dưới mỗi trường là ĐỘ RỘNG BIT. Đây là cảnh "người ta dùng nhiều hơn một khuôn dạng" (slide 20) khi người thiết kế thật sự nghiêm túc. Mấy dòng ghi chú ở cuối mới là chìa khoá: <strong>Source và Destination mỗi cái gồm một trường chế độ địa chỉ 3 bit và một số hiệu thanh ghi 3 bit</strong> · <strong>FP chỉ một trong bốn thanh ghi dấu chấm động</strong> · <strong>R chỉ một trong các thanh ghi đa dụng</strong> · <strong>CC là trường mã điều kiện</strong>.</p>
<table>
<tr><th>#</th><th>Các trường và độ rộng</th><th>Tổng</th></tr>
<tr><td>1</td><td>Opcode 4 · Source 6 · Destination 6</td><td>16 bit</td></tr>
<tr><td>2</td><td>Opcode 7 · R 3 · Source 6</td><td>16</td></tr>
<tr><td>3</td><td>Opcode 8 · Offset 8</td><td>16</td></tr>
<tr><td>4</td><td>Opcode 8 · FP 2 · Destination 6</td><td>16</td></tr>
<tr><td>5</td><td>Opcode 10 · Destination 6</td><td>16</td></tr>
<tr><td>6</td><td>Opcode 12 · CC 4</td><td>16</td></tr>
<tr><td>7</td><td>Opcode 13 · R 3</td><td>16</td></tr>
<tr><td>8</td><td>Opcode 16</td><td>16</td></tr>
<tr><td>9</td><td>Opcode 4 · Source 6 · Destination 6 · Memory Address 16</td><td>32</td></tr>
<tr><td>10</td><td>Opcode 7 · R 3 · Source 6 · Memory Address 16</td><td>32</td></tr>
<tr><td>11</td><td>Opcode 8 · FP 2 · Source 6 · Memory Address 16</td><td>32</td></tr>
<tr><td>12</td><td>Opcode 10 · Destination 6 · Memory Address 16</td><td>32</td></tr>
<tr><td>13</td><td>Opcode 4 · Source 6 · Destination 6 · Memory Address 1 (16) · Memory Address 2 (16)</td><td>48</td></tr>
</table>
<ul>
<li><strong>Trường toán hạng 6 bit là trung tâm của cả thiết kế.</strong> 3 bit chế độ địa chỉ + 3 bit số hiệu thanh ghi. Tám chế độ và tám thanh ghi, gói trong sáu bit, cho <em>MỖI</em> toán hạng. Đó chính là yếu tố "số chế độ địa chỉ" của slide 22 được trả bằng bit một cách tường minh — và là lý do PDP-11 nổi tiếng TRỰC GIAO: chế độ nào cũng dùng được với thanh ghi nào và thao tác nào.</li>
<li><strong>Nhìn trường mã thao tác PHÌNH ra khi toán hạng CO lại: 4, 7, 8, 10, 12, 13, 16.</strong> Đó là <strong>MÃ THAO TÁC MỞ RỘNG</strong>. Khuôn 1 có hai toán hạng đầy đủ nên chỉ nuôi nổi 16 mã thao tác; khuôn 8 không có toán hạng nào nên nuôi được 65 536. Bit không tiêu vào toán hạng thì quay về mã thao tác — ngân sách được bảo toàn, đúng như slide 22 nói.</li>
<li><strong>Khuôn 1–8 là 16 bit; 9–12 là 32; 13 là 48.</strong> Đó là lệnh độ dài thay đổi (slide 25) trên một cỗ máy thật: 2, 4 hoặc 6 byte, luôn là số nguyên lần từ 16 bit, tuân thủ quy tắc 1 của slide 21.</li>
<li><strong>Khuôn 13 là cái đáng nhớ để bàn trong bài thi.</strong> HAI địa chỉ bộ nhớ 16 bit đầy đủ trong MỘT lệnh — một lệnh hai địa chỉ bộ-nhớ-tới-bộ-nhớ thực thụ. Nó tốn 48 bit, tức ba lần nạp bộ nhớ chỉ để ĐỌC CÁI LỆNH, trước khi chạm vào bất kỳ toán hạng nào. Lời phản đối của RISC với những khuôn như thế này chính là Chương 17 gói trong một bức hình.</li>
<li><strong>Tự kiểm một dòng để phương pháp thành của bạn.</strong> Khuôn 10: 7 + 3 + 6 + 16 = <strong>32</strong> ✓. Khuôn 13: 4 + 6 + 6 + 16 + 16 = <strong>48</strong> ✓. Mọi dòng đều cộng ra bội của 16.</li>
</ul>
<p class="dap-an">✅ Bài luyện 5 (dạng đề thi). "Ở khuôn dạng 1 của PDP-11, mã thao tác nêu tên được bao nhiêu thao tác khác nhau, và có bao nhiêu cách đặc tả toán hạng nguồn?" Mã thao tác 4 bit → 2<sup>4</sup> = <strong>16 thao tác</strong>. Source 6 bit = 3 chế độ + 3 thanh ghi → 2<sup>3</sup> × 2<sup>3</sup> = <strong>64 tổ hợp</strong> (8 chế độ × 8 thanh ghi). Nhân ra cả lệnh: 2<sup>16</sup> = 65 536 cách mã hoá 16 bit khác nhau, chỉ riêng trong khuôn dạng này.</p>
<p class="meo">💡 Thấy một sơ đồ nhiều khuôn dạng thì ĐỪNG cố học thuộc. Chỉ cần kiểm ba điều: (a) tổng độ rộng có ra số nguyên lần một từ không, (b) mã thao tác có phình ra khi toán hạng ít đi không (mã thao tác mở rộng), (c) bao nhiêu bit dành cho chế độ địa chỉ. Ba câu trả lời đó phủ gần hết mọi câu hỏi thi về một sơ đồ khuôn dạng.</p>`],

      [27, 'Figure 14.8 — Example of VAX Instructions (variable length made concrete)',
        `<p class="y-chinh">🎯 Four real VAX instructions printed in hexadecimal, from <strong>one byte</strong> to <strong>six-plus bytes</strong>, each with its decoding spelled out. This is slide 25's "variations can be provided efficiently and compactly" turned into actual bytes on a page.</p>
<table>
<tr><th>Hex</th><th>Assembler</th><th>Length</th><th>How it decodes (from the figure)</th></tr>
<tr><td><code>05</code></td><td><code>RSB</code> — Return from subroutine</td><td>1 byte</td><td>Opcode only. No operand at all — implied addressing</td></tr>
<tr><td><code>D4 59</code></td><td><code>CLRL R9</code> — Clear register R9</td><td>2 bytes</td><td>Opcode for CLRL, then one operand specifier naming Register R9</td></tr>
<tr><td><code>B0 C4 64 01 AB 19</code></td><td><code>MOVW 356(R4), 25(R11)</code></td><td>6 bytes</td><td>Opcode for MOVW · <em>word displacement mode, Register R4</em> · 356 in hexadecimal · <em>byte displacement mode, Register R11</em> · 25 in hexadecimal</td></tr>
<tr><td><code>C1 05 50 42 DF …</code></td><td><code>ADDL3 #5, R0, @A[R2]</code></td><td>more</td><td>Opcode for ADDL3 · <em>short literal 5</em> · <em>Register mode R0</em> · <em>Index prefix R2</em> · <em>Indirect word relative (displacement from PC)</em> · then the amount of displacement from PC relative to location A</td></tr>
</table>
<ul>
<li><strong>Every addressing mode in this chapter appears in these four lines.</strong> Implied (RSB), register (CLRL R9), displacement (356(R4) and 25(R11)), immediate (short literal 5), indexing (index prefix R2) and PC-relative indirect (@A). One figure, the whole first half of the chapter.</li>
<li><strong>The third instruction is the clearest picture of displacement addressing you will get.</strong> <code>MOVW 356(R4), 25(R11)</code> means exactly "move a word from the address that is <strong>356 plus the contents of R4</strong> to the address that is <strong>25 plus the contents of R11</strong>" — two independent <code>EA = A + (R)</code> calculations in one instruction. Note that the two displacements even use <em>different widths</em>: 356 needs a word displacement, 25 fits in a byte, and the VAX encodes each at its own size.</li>
<li><strong>Length is decided operand by operand, not instruction by instruction.</strong> That is the essence of the VAX design: each operand carries its own "specifier" byte saying which mode it uses and therefore how many more bytes follow. Flexible, compact — and the reason the decoder must work strictly left to right, which is cost 1 on slide 25.</li>
<li><strong>The last instruction shows a three-address operation.</strong> <code>ADDL3 #5, R0, @A[R2]</code> = "Add 5 to the 32-bit integer in R0 and store the result in the location whose address is the sum of A and 4 times the contents of R2." Immediate, register and a fully indexed indirect destination, all in one instruction. Compare with ARM slide 29: seven fixed 32-bit formats, none of which can do this.</li>
<li><strong>Why this matters historically.</strong> The VAX was the high-water mark of CISC — the belief that the ISA should be as expressive as a high-level language. Chapter 17 opens with the measurements that undermined it: the fancy instructions were rarely generated by compilers, and their existence slowed down the common ones.</li>
</ul>
<p class="dap-an">✅ Sanity check on the numbers in the figure: 356 decimal = 0x164, and the figure shows the bytes <code>64 01</code> — little-endian, so the low byte 0x64 comes first, giving 0x0164 = <strong>356</strong> ✓. And 25 decimal = 0x19, shown as <code>19</code> ✓.</p>
<p class="meo">💡 If an exam asks "give an advantage and a disadvantage of variable-length instructions", answer with this figure: advantage = <code>RSB</code> costs one byte instead of six; disadvantage = you cannot know where the next instruction starts until you have decoded this one.</p>`,
        `<p class="y-chinh">🎯 Bốn lệnh VAX thật in dưới dạng thập lục phân, từ <strong>một byte</strong> tới <strong>sáu byte trở lên</strong>, mỗi lệnh kèm cách giải mã viết rõ. Đây là câu "các biến thể được cung cấp hiệu quả và gọn gàng" của slide 25, biến thành byte thật trên giấy.</p>
<table>
<tr><th>Mã hex</th><th>Hợp ngữ</th><th>Độ dài</th><th>Giải mã ra sao (theo hình)</th></tr>
<tr><td><code>05</code></td><td><code>RSB</code> — quay về từ chương trình con</td><td>1 byte</td><td>Chỉ có mã thao tác. KHÔNG toán hạng nào — địa chỉ ngầm</td></tr>
<tr><td><code>D4 59</code></td><td><code>CLRL R9</code> — xoá thanh ghi R9</td><td>2 byte</td><td>Mã thao tác của CLRL, rồi một đặc tả toán hạng nêu tên thanh ghi R9</td></tr>
<tr><td><code>B0 C4 64 01 AB 19</code></td><td><code>MOVW 356(R4), 25(R11)</code></td><td>6 byte</td><td>Mã thao tác MOVW · <em>chế độ độ dời cỡ TỪ, thanh ghi R4</em> · 356 dạng hex · <em>chế độ độ dời cỡ BYTE, thanh ghi R11</em> · 25 dạng hex</td></tr>
<tr><td><code>C1 05 50 42 DF …</code></td><td><code>ADDL3 #5, R0, @A[R2]</code></td><td>dài hơn nữa</td><td>Mã thao tác ADDL3 · <em>hằng ngắn 5</em> · <em>chế độ thanh ghi R0</em> · <em>tiền tố chỉ số R2</em> · <em>gián tiếp cỡ từ, tương đối (độ dời tính từ PC)</em> · rồi mới tới lượng độ dời từ PC tới vị trí A</td></tr>
</table>
<ul>
<li><strong>MỌI chế độ địa chỉ của chương này đều xuất hiện trong bốn dòng đó.</strong> Ngầm (RSB), thanh ghi (CLRL R9), độ dời (356(R4) và 25(R11)), tức thời (hằng ngắn 5), chỉ số (tiền tố chỉ số R2) và gián tiếp tương đối theo PC (@A). Một bức hình, trọn nửa đầu chương.</li>
<li><strong>Lệnh thứ ba là bức tranh rõ nhất về địa chỉ độ dời mà bạn sẽ được xem.</strong> <code>MOVW 356(R4), 25(R11)</code> nghĩa chính xác là "chuyển một từ từ địa chỉ bằng <strong>356 cộng nội dung R4</strong> tới địa chỉ bằng <strong>25 cộng nội dung R11</strong>" — HAI phép <code>EA = A + (R)</code> độc lập trong MỘT lệnh. Để ý hai độ dời còn dùng <em>ĐỘ RỘNG KHÁC NHAU</em>: 356 cần độ dời cỡ từ, 25 nhét vừa một byte, và VAX mã hoá mỗi cái ở đúng cỡ của nó.</li>
<li><strong>Độ dài được quyết theo TỪNG TOÁN HẠNG, không phải theo từng lệnh.</strong> Đó là tinh thần của thiết kế VAX: mỗi toán hạng mang theo một byte "đặc tả" nói nó dùng chế độ nào, và do đó còn bao nhiêu byte đi sau. Mềm dẻo, gọn — và là lý do bộ giải mã BẮT BUỘC phải đi nghiêm ngặt từ trái sang phải, tức cái giá 1 ở slide 25.</li>
<li><strong>Lệnh cuối cho thấy một thao tác BA địa chỉ.</strong> <code>ADDL3 #5, R0, @A[R2]</code> = "Cộng 5 vào số nguyên 32 bit trong R0 và cất kết quả vào ô có địa chỉ bằng tổng của A với 4 lần nội dung R2." Tức thời, thanh ghi, và một đích gián tiếp có lập chỉ số đầy đủ, tất cả trong một lệnh. So với ARM ở slide 29: bảy khuôn dạng 32 bit cố định, không khuôn nào làm được chuyện này.</li>
<li><strong>Vì sao chuyện này quan trọng về mặt lịch sử.</strong> VAX là đỉnh triều của CISC — niềm tin rằng tập lệnh nên diễn đạt mạnh ngang một ngôn ngữ bậc cao. Chương 17 mở đầu bằng chính những phép đo đã lật đổ niềm tin ấy: mấy lệnh cầu kỳ hiếm khi được trình biên dịch sinh ra, và chỉ riêng sự tồn tại của chúng đã làm chậm những lệnh phổ thông.</li>
</ul>
<p class="dap-an">✅ Kiểm lại các con số trên hình: 356 thập phân = 0x164, và hình in ra hai byte <code>64 01</code> — kiểu little-endian nên byte thấp 0x64 đi trước, ghép lại thành 0x0164 = <strong>356</strong> ✓. Còn 25 thập phân = 0x19, in là <code>19</code> ✓.</p>
<p class="meo">💡 Đề hỏi "nêu một ưu và một nhược điểm của lệnh độ dài thay đổi" thì trả lời bằng đúng bức hình này: ưu = <code>RSB</code> tốn một byte thay vì sáu; nhược = bạn không thể biết lệnh kế tiếp bắt đầu ở đâu cho tới khi giải mã xong lệnh này.</p>`],

      [28, 'Figure 14.9 — x86 Instruction Format (the most complex format in the course)',
        `<p class="y-chinh">🎯 The x86 instruction, field by field, with every width given as a <em>range</em>. Nothing in this picture has a fixed size except the opcode's minimum — which is exactly why an x86 instruction can be 1 byte or 15.</p>
<table>
<tr><th>Field</th><th>Size (from the figure)</th><th>What it does</th></tr>
<tr><td><strong>Instruction prefixes</strong></td><td>0, 1, 2, 3, or 4 bytes</td><td>Repeat prefixes, lock, and the four one-byte prefixes shown expanded above: <em>Instruction prefix</em> · <em>Segment override</em> · <em>Operand size override</em> · <em>Address size override</em>, each 0 or 1 byte</td></tr>
<tr><td><strong>Opcode</strong></td><td>1, 2, or 3 bytes</td><td>The operation. Multi-byte opcodes are the expanding-opcode trick of slide 26 at byte granularity</td></tr>
<tr><td><strong>ModR/m</strong></td><td>0 or 1 byte</td><td>Split into <em>Mod</em> (bits 7–6) · <em>Reg/Opcode</em> (5–3) · <em>R/M</em> (2–0) — this is the addressing-mode field</td></tr>
<tr><td><strong>SIB</strong></td><td>0 or 1 byte</td><td>Split into <em>Scale</em> (7–6) · <em>Index</em> (5–3) · <em>Base</em> (2–0) — this is the (I)×S + (B) part of slide 15's formula</td></tr>
<tr><td><strong>Displacement</strong></td><td>0, 1, 2, or 4 bytes</td><td>The A term of <code>LA = (SR) + (B) + (I)×S + A</code></td></tr>
<tr><td><strong>Immediate</strong></td><td>0, 1, 2, or 4 bytes</td><td>An immediate operand, when the instruction has one</td></tr>
</table>
<ul>
<li><strong>ModR/m and SIB are literally slide 15's diagram, encoded.</strong> SIB stands for Scale-Index-Base, and its three subfields are the three inputs to the multiply-and-add tree in Figure 14.2. Once you see that, the x86 addressing-mode table (slide 16) stops being a list to memorise and becomes a description of two bytes.</li>
<li><strong>Count the possible lengths.</strong> Minimum: 0 prefixes + 1 opcode + nothing else = <strong>1 byte</strong>. Maximum with the fields shown: 4 + 3 + 1 + 1 + 4 + 4 = <strong>17 bytes</strong> in principle, though the architecture caps a legal instruction at 15 bytes. Compare ARM: always exactly 4. That one contrast is the CISC/RISC divide, measured.</li>
<li><strong>The override prefixes are backward compatibility made visible.</strong> "Operand size override" and "Address size override" exist because the same opcode has to mean 16-bit operations on an 8086 and 32-bit operations on a 386. Rather than renumber every opcode, Intel added a byte that flips the interpretation. Forty years of compatibility, one prefix byte at a time.</li>
<li><strong>Why the decoder is the hard part.</strong> To find where instruction n+1 starts, the processor must read the prefixes, then the opcode, then ModR/m to learn whether SIB exists, then SIB to learn the displacement size, then the displacement, then the immediate. Six dependent steps — exactly slide 25's "increases the complexity of the processor". Modern x86 chips have dedicated length-decode hardware and a micro-op cache largely to avoid paying this repeatedly.</li>
<li><strong>Connect back to Chapter 4.</strong> This complexity buys code density, and code density is cache density. An x86 program is typically smaller than the same ARM program, so more of it fits in the L1 instruction cache. Neither design wins outright — that is the honest answer to any "CISC or RISC, which is better" question.</li>
</ul>
<p class="dap-an">✅ Worked decode, using slide 15's example. <code>MOV EAX, [EBX + ECX*4 + 500]</code> needs: no prefix (0) + opcode <code>8B</code> (1) + ModR/m saying "there is a SIB and a 32-bit displacement" (1) + SIB encoding scale 4, index ECX, base EBX (1) + displacement 500 as 4 bytes (4) = <strong>7 bytes</strong>. The same operation on ARM would need several instructions but each exactly 4 bytes.</p>
<p class="pitfall">⚠️ Do not read the "0 or 1 bytes" fields as optional decoration. Whether ModR/m and SIB are present is decided by earlier bytes, not by a fixed rule — that dependency is the whole reason x86 length decoding is hard, and it is the point the exam wants you to make.</p>`,
        `<p class="y-chinh">🎯 Lệnh x86, trường theo trường, với mọi độ rộng cho dưới dạng một <em>KHOẢNG</em>. Không thứ gì trong bức hình này có kích thước cố định, trừ mức tối thiểu của mã thao tác — và đó chính xác là lý do một lệnh x86 có thể dài 1 byte hoặc 15 byte.</p>
<table>
<tr><th>Trường</th><th>Kích thước (theo hình)</th><th>Nó làm gì</th></tr>
<tr><td><strong>Instruction prefixes</strong> — tiền tố lệnh</td><td>0, 1, 2, 3 hoặc 4 byte</td><td>Tiền tố lặp, khoá, và bốn tiền tố một byte vẽ mở rộng ở trên: <em>Instruction prefix</em> · <em>Segment override</em> · <em>Operand size override</em> · <em>Address size override</em>, mỗi cái 0 hoặc 1 byte</td></tr>
<tr><td><strong>Opcode</strong></td><td>1, 2 hoặc 3 byte</td><td>Thao tác. Mã thao tác nhiều byte chính là mẹo mã-thao-tác-mở-rộng của slide 26, ở mức độ mịn theo byte</td></tr>
<tr><td><strong>ModR/m</strong></td><td>0 hoặc 1 byte</td><td>Chia thành <em>Mod</em> (bit 7–6) · <em>Reg/Opcode</em> (5–3) · <em>R/M</em> (2–0) — đây là trường CHẾ ĐỘ ĐỊA CHỈ</td></tr>
<tr><td><strong>SIB</strong></td><td>0 hoặc 1 byte</td><td>Chia thành <em>Scale</em> (7–6) · <em>Index</em> (5–3) · <em>Base</em> (2–0) — đây là phần (I)×S + (B) của công thức ở slide 15</td></tr>
<tr><td><strong>Displacement</strong></td><td>0, 1, 2 hoặc 4 byte</td><td>Số hạng A trong <code>LA = (SR) + (B) + (I)×S + A</code></td></tr>
<tr><td><strong>Immediate</strong></td><td>0, 1, 2 hoặc 4 byte</td><td>Một toán hạng tức thời, khi lệnh có dùng tới</td></tr>
</table>
<ul>
<li><strong>ModR/m và SIB chính là sơ đồ slide 15, đã mã hoá.</strong> SIB là viết tắt của Scale-Index-Base, và ba trường con của nó là ba đầu vào của cây nhân-rồi-cộng trong Figure 14.2. Thấy được điều đó rồi thì bảng chế độ địa chỉ x86 (slide 16) thôi là một danh sách phải học thuộc, mà trở thành phần mô tả của HAI BYTE.</li>
<li><strong>Đếm các độ dài khả dĩ.</strong> Nhỏ nhất: 0 tiền tố + 1 mã thao tác + không gì nữa = <strong>1 byte</strong>. Lớn nhất theo các trường vẽ trên hình: 4 + 3 + 1 + 1 + 4 + 4 = <strong>17 byte</strong> trên nguyên tắc, dù kiến trúc chốt một lệnh hợp lệ tối đa 15 byte. So với ARM: LUÔN đúng 4. Đúng một phép đối chiếu đó là ranh giới CISC/RISC, đo được bằng số.</li>
<li><strong>Mấy tiền tố "override" là tính tương thích ngược hiện hình.</strong> "Operand size override" và "Address size override" tồn tại vì cùng một mã thao tác phải có nghĩa là phép 16 bit trên 8086 và phép 32 bit trên 386. Thay vì đánh số lại toàn bộ mã thao tác, Intel thêm một byte để lật cách diễn giải. Bốn mươi năm tương thích, mỗi lần một byte tiền tố.</li>
<li><strong>Vì sao bộ giải mã mới là phần khó.</strong> Để tìm ra lệnh n+1 bắt đầu ở đâu, bộ xử lý phải đọc tiền tố, rồi mã thao tác, rồi ModR/m mới biết có SIB hay không, rồi SIB mới biết độ dời dài bao nhiêu, rồi độ dời, rồi hằng tức thời. SÁU bước phụ thuộc nhau — đúng câu "làm tăng độ phức tạp của bộ xử lý" ở slide 25. Chip x86 hiện đại có hẳn phần cứng riêng để giải mã độ dài, và một cache vi-thao-tác, phần lớn là để khỏi phải trả cái giá đó lặp đi lặp lại.</li>
<li><strong>Nối ngược về Chương 4.</strong> Sự phức tạp này mua về mật độ mã, mà mật độ mã chính là mật độ cache. Một chương trình x86 thường NHỎ HƠN cùng chương trình đó biên dịch cho ARM, nên phần nằm vừa trong cache lệnh L1 nhiều hơn. Không thiết kế nào thắng dứt điểm — đó là câu trả lời trung thực cho mọi câu hỏi "CISC hay RISC tốt hơn".</li>
</ul>
<p class="dap-an">✅ Giải mã thử, dùng ví dụ của slide 15. <code>MOV EAX, [EBX + ECX*4 + 500]</code> cần: không tiền tố (0) + mã thao tác <code>8B</code> (1) + ModR/m báo "có SIB và có độ dời 32 bit" (1) + SIB mã hoá tỉ lệ 4, chỉ số ECX, nền EBX (1) + độ dời 500 dạng 4 byte (4) = <strong>7 byte</strong>. Cũng thao tác đó trên ARM cần vài lệnh, nhưng mỗi lệnh đúng 4 byte.</p>
<p class="pitfall">⚠️ Đừng đọc mấy trường "0 hoặc 1 byte" như đồ trang trí tuỳ chọn. Việc ModR/m và SIB có mặt hay không được quyết bởi những BYTE ĐỨNG TRƯỚC, chứ không theo một quy tắc cố định — chính cái phụ thuộc đó là toàn bộ lý do giải mã độ dài x86 khó, và đó là ý mà đề thi muốn bạn nêu ra.</p>`],

      [29, 'Figure 14.10 — ARM Instruction Formats (seven formats, all exactly 32 bits)',
        `<p class="y-chinh">🎯 Seven formats, and every single one is exactly <strong>32 bits</strong> wide — bits 31 down to 0, drawn on the same ruler. Put this slide next to slide 28 and the RISC philosophy needs no further explanation.</p>
<table>
<tr><th>Format</th><th>Structure (bits 31 → 0)</th></tr>
<tr><td>Data processing, immediate shift</td><td><code>cond</code> · <code>000</code> · <code>opcode</code> · <code>S</code> · <code>Rn</code> · <code>Rd</code> · <code>shift amount</code> · <code>shift</code> · <code>0</code> · <code>Rm</code></td></tr>
<tr><td>Data processing, register shift</td><td><code>cond</code> · <code>000</code> · <code>opcode</code> · <code>S</code> · <code>Rn</code> · <code>Rd</code> · <code>Rs</code> · <code>0</code> · <code>shift</code> · <code>1</code> · <code>Rm</code></td></tr>
<tr><td>Data processing, immediate</td><td><code>cond</code> · <code>001</code> · <code>opcode</code> · <code>S</code> · <code>Rn</code> · <code>Rd</code> · <code>rotate</code> · <code>immediate</code></td></tr>
<tr><td>Load/store, immediate offset</td><td><code>cond</code> · <code>010</code> · <code>P U B W L</code> · <code>Rn</code> · <code>Rd</code> · <code>immediate</code></td></tr>
<tr><td>Load/store, register offset</td><td><code>cond</code> · <code>011</code> · <code>P U B W L</code> · <code>Rn</code> · <code>Rd</code> · <code>shift amount</code> · <code>shift</code> · <code>0</code> · <code>Rm</code></td></tr>
<tr><td>Load/store multiple</td><td><code>cond</code> · <code>100</code> · <code>P U S W L</code> · <code>Rn</code> · <code>register list</code></td></tr>
<tr><td>Branch / branch with link</td><td><code>cond</code> · <code>101</code> · <code>L</code> · <code>24-bit offset</code></td></tr>
</table>
<p class="nhan">The legend on the slide defines the single-letter flags: <strong>S</strong> = for data processing, the instruction updates the condition codes; for load/store multiple, whether execution is restricted to supervisor mode. <strong>P, U, W</strong> = bits that distinguish among different types of addressing_mode. <strong>B</strong> = unsigned byte (B==1) versus word (B==0) access. <strong>L</strong> = for load/store, Load (L==1) versus Store (L==0); for branches, whether a return address is stored in the link register.</p>
<ul>
<li><strong>The <code>cond</code> field on <em>every</em> format is ARM's signature.</strong> Four bits at the top of every instruction mean almost any ARM instruction can be made conditional — not just branches. <code>ADDEQ r0, r1, r2</code> adds only if the Z flag is set. That removes short branches, which matters enormously for a pipeline (Chapter 16). Slide 32 tells you Thumb-2 gives most of this up and replaces it with an <code>IT</code> instruction.</li>
<li><strong>P, U, W are slide 17 encoded.</strong> They are the three bits that choose between offset, preindex and postindex, and which direction the offset goes. When slide 17 showed you <code>[r1, #12]</code> versus <code>[r1, #12]!</code> versus <code>[r1], #12</code>, these are the bits that differ.</li>
<li><strong>The 3-bit field right after <code>cond</code> is the format selector.</strong> 000/001 = data processing, 010/011 = load/store single, 100 = load/store multiple, 101 = branch. Three bits, seven formats, no ambiguity — the decoder knows the format after reading 7 bits and always knows the next instruction is 4 bytes later.</li>
<li><strong>Look at the branch format and do the arithmetic from slide 18.</strong> 4 (cond) + 3 (101) + 1 (L) + 24 (offset) = <strong>32</strong> ✓, and the 24-bit offset shifted left 2 gives ±32 MiB, exactly as computed on slide 18.</li>
<li><strong>The "rotate + immediate" format is slide 30's subject.</strong> An 8-bit immediate plus a 4-bit rotate — ARM's answer to "how do I fit a useful constant in a fixed 32-bit instruction". That is the price of fixed length, and the next slide shows how cleverly it was paid.</li>
</ul>
<p class="dap-an">✅ Verify the first format sums to 32: cond 4 + 000 (3) + opcode 4 + S 1 + Rn 4 + Rd 4 + shift amount 5 + shift 2 + 0 (1) + Rm 4 = <strong>32</strong> ✓. Note Rn, Rd and Rm are 4 bits each = 16 registers, exactly as slide 22's "register versus memory" factor predicts.</p>
<p class="meo">💡 The exam comparison to have ready: <strong>x86 = 1 to 15 bytes, dozens of formats, complex decoder, dense code. ARM = always 4 bytes, 7 formats, trivial decoder, larger code.</strong> Then add the punchline: ARM invented Thumb to win back the density, which is slides 31–33.</p>`,
        `<p class="y-chinh">🎯 Bảy khuôn dạng, và từng cái một đều rộng ĐÚNG <strong>32 bit</strong> — bit 31 xuống tới 0, vẽ trên cùng một cái thước. Đặt slide này cạnh slide 28 là triết lý RISC không cần giải thích thêm câu nào.</p>
<table>
<tr><th>Khuôn dạng</th><th>Cấu trúc (bit 31 → 0)</th></tr>
<tr><td>Xử lý dữ liệu, dịch bằng hằng</td><td><code>cond</code> · <code>000</code> · <code>opcode</code> · <code>S</code> · <code>Rn</code> · <code>Rd</code> · <code>shift amount</code> · <code>shift</code> · <code>0</code> · <code>Rm</code></td></tr>
<tr><td>Xử lý dữ liệu, dịch bằng thanh ghi</td><td><code>cond</code> · <code>000</code> · <code>opcode</code> · <code>S</code> · <code>Rn</code> · <code>Rd</code> · <code>Rs</code> · <code>0</code> · <code>shift</code> · <code>1</code> · <code>Rm</code></td></tr>
<tr><td>Xử lý dữ liệu, tức thời</td><td><code>cond</code> · <code>001</code> · <code>opcode</code> · <code>S</code> · <code>Rn</code> · <code>Rd</code> · <code>rotate</code> · <code>immediate</code></td></tr>
<tr><td>Load/store, độ lệch tức thời</td><td><code>cond</code> · <code>010</code> · <code>P U B W L</code> · <code>Rn</code> · <code>Rd</code> · <code>immediate</code></td></tr>
<tr><td>Load/store, độ lệch bằng thanh ghi</td><td><code>cond</code> · <code>011</code> · <code>P U B W L</code> · <code>Rn</code> · <code>Rd</code> · <code>shift amount</code> · <code>shift</code> · <code>0</code> · <code>Rm</code></td></tr>
<tr><td>Load/store nhiều thanh ghi</td><td><code>cond</code> · <code>100</code> · <code>P U S W L</code> · <code>Rn</code> · <code>register list</code></td></tr>
<tr><td>Rẽ nhánh / rẽ nhánh có lưu địa chỉ về</td><td><code>cond</code> · <code>101</code> · <code>L</code> · <code>độ lệch 24 bit</code></td></tr>
</table>
<p class="nhan">Chú giải trên slide định nghĩa các cờ một chữ cái: <strong>S</strong> = với lệnh xử lý dữ liệu, báo lệnh có CẬP NHẬT mã điều kiện; với load/store multiple, báo việc thực thi có bị giới hạn ở chế độ giám sát không. <strong>P, U, W</strong> = các bit phân biệt các kiểu addressing_mode khác nhau. <strong>B</strong> = truy cập byte không dấu (B==1) hay từ (B==0). <strong>L</strong> = với load/store, phân biệt Load (L==1) với Store (L==0); với lệnh rẽ nhánh, quyết định có lưu địa chỉ quay về vào thanh ghi liên kết không.</p>
<ul>
<li><strong>Trường <code>cond</code> có mặt trên <em>MỌI</em> khuôn dạng là chữ ký của ARM.</strong> Bốn bit ở đầu mọi lệnh nghĩa là gần như lệnh ARM nào cũng có thể trở thành CÓ ĐIỀU KIỆN — không riêng lệnh nhảy. <code>ADDEQ r0, r1, r2</code> chỉ cộng nếu cờ Z được bật. Điều đó xoá bỏ các lệnh nhảy ngắn, chuyện cực kỳ quan trọng với một đường ống (Chương 16). Slide 32 sẽ nói Thumb-2 từ bỏ phần lớn cơ chế này và thay bằng một lệnh <code>IT</code>.</li>
<li><strong>P, U, W chính là slide 17 đã mã hoá.</strong> Đó là ba bit chọn giữa offset, tiền chỉ số và hậu chỉ số, và chọn hướng của độ lệch. Lúc slide 17 cho bạn xem <code>[r1, #12]</code> so với <code>[r1, #12]!</code> so với <code>[r1], #12</code>, đây chính là mấy bit khác nhau giữa chúng.</li>
<li><strong>Trường 3 bit ngay sau <code>cond</code> là bộ chọn khuôn dạng.</strong> 000/001 = xử lý dữ liệu, 010/011 = load/store đơn, 100 = load/store nhiều, 101 = rẽ nhánh. Ba bit, bảy khuôn dạng, không nhập nhằng — bộ giải mã biết khuôn dạng sau khi đọc 7 bit, và LUÔN biết lệnh kế tiếp nằm cách đúng 4 byte.</li>
<li><strong>Nhìn khuôn rẽ nhánh và làm lại phép tính của slide 18.</strong> 4 (cond) + 3 (101) + 1 (L) + 24 (độ lệch) = <strong>32</strong> ✓, và độ lệch 24 bit dịch trái 2 cho ±32 MiB, đúng như đã tính ở slide 18.</li>
<li><strong>Khuôn "rotate + immediate" là chủ đề của slide 30.</strong> Một hằng 8 bit cộng một trường quay 4 bit — câu trả lời của ARM cho "làm sao nhét một hằng dùng được vào một lệnh 32 bit CỐ ĐỊNH". Đó là cái giá của độ dài cố định, và slide sau cho thấy nó được trả một cách khéo tới mức nào.</li>
</ul>
<p class="dap-an">✅ Kiểm khuôn thứ nhất có cộng ra 32 không: cond 4 + 000 (3) + opcode 4 + S 1 + Rn 4 + Rd 4 + shift amount 5 + shift 2 + 0 (1) + Rm 4 = <strong>32</strong> ✓. Để ý Rn, Rd và Rm mỗi cái 4 bit = 16 thanh ghi, đúng như yếu tố "thanh ghi hay bộ nhớ" của slide 22 dự đoán.</p>
<p class="meo">💡 Phép so sánh nên thủ sẵn cho phòng thi: <strong>x86 = 1 tới 15 byte, hàng chục khuôn dạng, bộ giải mã phức tạp, mã dày đặc. ARM = luôn 4 byte, 7 khuôn dạng, bộ giải mã tầm thường, mã lớn hơn.</strong> Rồi thêm câu chốt: ARM đã nghĩ ra Thumb để giành lại mật độ, đó là slide 31–33.</p>`],

      [30, 'Figure 14.11 — Examples of Use of ARM Immediate Constants',
        `<p class="y-chinh">🎯 How ARM squeezes a useful set of 32-bit constants out of only 12 bits. The format field from slide 29 is <code>rotate</code> (4 bits) + <code>immediate</code> (8 bits); the 8-bit value is <strong>rotated right by twice the rotate field</strong>, and the figure shows three examples of where the eight live bits land in a 32-bit word.</p>
<table>
<tr><th>Rotate</th><th>Where the 8 bits sit</th><th>Range printed on the figure</th><th>Step</th></tr>
<tr><td><code>ror #0</code></td><td>bits 7–0 (the bottom byte)</td><td>0 through <strong>0x000000FF</strong></td><td><strong>0x00000001</strong></td></tr>
<tr><td><code>ror #8</code></td><td>bits 31–24 (the top byte)</td><td>0 through <strong>0xFF000000</strong></td><td><strong>0x01000000</strong></td></tr>
<tr><td><code>ror #30</code></td><td>bits 9–2 (shifted up by two)</td><td>0 through <strong>0x000003FC</strong></td><td><strong>0x00000004</strong></td></tr>
</table>
<ul>
<li><strong>Read the third row carefully, it is the one that explains the scheme.</strong> With <code>ror #30</code> the eight bits sit two positions up, so every representable value is a multiple of 4 and the largest is 0xFF × 4 = 0x3FC = 1020. That is exactly "range 0 through 0x000003FC, step 0x00000004" as printed.</li>
<li><strong>What you gain and what you lose.</strong> Gain: constants such as 0xFF000000 (a byte mask at the top of a word) cost <em>zero</em> extra instructions and zero extra bytes. Lose: a constant like 0x12345678 has more than 8 significant bits and simply cannot be encoded — the assembler must build it in two or more instructions, or load it from memory.</li>
<li><strong>Why the rotate is doubled.</strong> The field is 4 bits, so it can express 0–15; doubling gives even rotations 0, 2, 4, …, 30 — sixteen positions covering the whole 32-bit word. Using odd rotations too would need a 5-bit field, and ARM decided the extra bit was worth more elsewhere.</li>
<li><strong>This is the cost of fixed-length instructions, made visible.</strong> x86 (slide 28) just appends a 4-byte immediate field and lets the instruction grow. ARM cannot grow, so it must be clever. Neither is wrong — it is slide 21's trade-off showing up in a concrete design decision.</li>
<li><strong>What it means when you write C.</strong> <code>x &amp; 0xFF</code>, <code>x | 0xFF000000</code>, <code>x + 1020</code> all compile to one ARM instruction. <code>x + 1021</code> does not (1021 is not a multiple of 4 and needs more than 8 bits). Small details of a constant can change the instruction count — this is the kind of thing that makes reading compiler output instructive.</li>
</ul>
<p class="dap-an">✅ Arithmetic check on all three rows. Row 1: 0xFF = <strong>255</strong>, step 1 → 256 values, 0…255. Row 2: 0xFF000000 = 255 × 2<sup>24</sup> = <strong>4 278 190 080</strong>, step 0x01000000 = 2<sup>24</sup> = 16 777 216 ✓ (255 × 16 777 216 = 4 278 190 080). Row 3: 0x3FC = <strong>1020</strong> = 255 × 4, step 4 ✓. All three ranges are exactly "255 × step", which is the signature of an 8-bit value shifted into place.</p>
<p class="meo">💡 One sentence to remember the mechanism: <strong>ARM immediates are "any 8-bit value, placed at any even bit position"</strong>. If a constant cannot be written that way, it needs more than one instruction.</p>`,
        `<p class="y-chinh">🎯 ARM vắt ra một tập hằng 32 bit dùng được từ vỏn vẹn 12 bit bằng cách nào. Trường trong khuôn dạng ở slide 29 là <code>rotate</code> (4 bit) + <code>immediate</code> (8 bit); giá trị 8 bit được <strong>quay phải đi GẤP ĐÔI trường rotate</strong>, và hình cho ba ví dụ về chỗ tám bit sống rơi vào trong một từ 32 bit.</p>
<table>
<tr><th>Rotate</th><th>Tám bit nằm ở đâu</th><th>Tầm in trên hình</th><th>Bước nhảy</th></tr>
<tr><td><code>ror #0</code></td><td>bit 7–0 (byte thấp nhất)</td><td>0 tới <strong>0x000000FF</strong></td><td><strong>0x00000001</strong></td></tr>
<tr><td><code>ror #8</code></td><td>bit 31–24 (byte cao nhất)</td><td>0 tới <strong>0xFF000000</strong></td><td><strong>0x01000000</strong></td></tr>
<tr><td><code>ror #30</code></td><td>bit 9–2 (bị đẩy lên hai vị trí)</td><td>0 tới <strong>0x000003FC</strong></td><td><strong>0x00000004</strong></td></tr>
</table>
<ul>
<li><strong>Đọc kỹ dòng thứ ba, đó là dòng giải thích cả cơ chế.</strong> Với <code>ror #30</code> thì tám bit nằm cao hơn hai vị trí, nên mọi giá trị biểu diễn được đều là bội của 4 và lớn nhất là 0xFF × 4 = 0x3FC = 1020. Đúng y câu "range 0 through 0x000003FC, step 0x00000004" in trên hình.</li>
<li><strong>Được gì và mất gì.</strong> Được: những hằng như 0xFF000000 (mặt nạ một byte ở đầu từ) tốn <em>KHÔNG</em> lệnh thêm nào và không byte thêm nào. Mất: một hằng như 0x12345678 có nhiều hơn 8 bit có nghĩa nên đơn giản là KHÔNG mã hoá được — trình hợp dịch phải dựng nó bằng hai lệnh trở lên, hoặc nạp nó từ bộ nhớ.</li>
<li><strong>Vì sao phải nhân đôi giá trị quay.</strong> Trường chỉ có 4 bit nên diễn đạt được 0–15; nhân đôi ra các mức quay CHẴN 0, 2, 4, …, 30 — mười sáu vị trí phủ hết một từ 32 bit. Muốn có cả mức quay lẻ thì cần trường 5 bit, và ARM quyết rằng cái bit dôi ra đó đáng giá hơn nếu tiêu vào chỗ khác.</li>
<li><strong>Đây là cái giá của lệnh độ dài cố định, hiện hình.</strong> x86 (slide 28) chỉ việc nối thêm một trường tức thời 4 byte và cho lệnh dài ra. ARM không dài ra được nên buộc phải khôn. Không bên nào sai cả — đây là cái đánh đổi của slide 21 xuất hiện thành một quyết định thiết kế cụ thể.</li>
<li><strong>Nó có nghĩa gì khi bạn viết C.</strong> <code>x &amp; 0xFF</code>, <code>x | 0xFF000000</code>, <code>x + 1020</code> đều dịch ra MỘT lệnh ARM. <code>x + 1021</code> thì không (1021 không phải bội của 4 và cần hơn 8 bit). Chi tiết nhỏ của một hằng có thể làm đổi số lệnh — đúng loại chuyện khiến việc đọc mã do trình biên dịch sinh ra trở nên bổ ích.</li>
</ul>
<p class="dap-an">✅ Kiểm số học cả ba dòng. Dòng 1: 0xFF = <strong>255</strong>, bước 1 → 256 giá trị, 0…255. Dòng 2: 0xFF000000 = 255 × 2<sup>24</sup> = <strong>4 278 190 080</strong>, bước 0x01000000 = 2<sup>24</sup> = 16 777 216 ✓ (255 × 16 777 216 = 4 278 190 080). Dòng 3: 0x3FC = <strong>1020</strong> = 255 × 4, bước 4 ✓. Cả ba tầm đều đúng bằng "255 × bước nhảy", đó là chữ ký của một giá trị 8 bit được đẩy vào vị trí.</p>
<p class="meo">💡 Một câu để nhớ cơ chế: <strong>hằng tức thời của ARM là "một giá trị 8 bit bất kỳ, đặt ở một vị trí bit CHẴN bất kỳ"</strong>. Hằng nào không viết được theo kiểu đó thì cần nhiều hơn một lệnh.</p>`],

      [31, 'Figure 14.12 — Expanding a Thumb ADD Instruction into its ARM Equivalent',
        `<p class="y-chinh">🎯 One instruction shown twice: as a <strong>16-bit Thumb</strong> encoding and as the <strong>32-bit ARM</strong> instruction the processor expands it into. This figure is the entire Thumb idea in one picture — half the bits, same work.</p>
<table>
<tr><th></th><th>Thumb (16 bits)</th><th>ARM (32 bits)</th></tr>
<tr><td>Written as</td><td><code>ADD r3, #19</code></td><td><code>ADDS r3, r3, #19</code></td></tr>
<tr><td>Format</td><td>add/subtract/compare/move immediate format</td><td>data processing immediate format</td></tr>
<tr><td>Fields</td><td><code>001</code> · <code>op code</code> · <code>Rd/Rn</code> · <code>immediate</code></td><td><code>cond</code> · <code>001</code> · <code>opcode</code> · <code>S</code> · <code>Rn</code> · <code>Rd</code> · <code>rotate</code> · <code>immediate</code></td></tr>
<tr><td>Bits for the constant</td><td>8 (bits 7–0), value <code>00010011</code></td><td>8 immediate + 4 rotate (rotate = 0000)</td></tr>
</table>
<p class="nhan">The arrows on the figure label each piece of the expansion: <em>major opcode denoting format 3 move/compare/add/sub with immediate value</em> · <em>minor opcode denoting ADD instruction</em> · <em>destination and source register</em> · <em>immediate value</em>, and on the ARM side <em>always condition code</em> · <em>update condition flags</em> · <em>zero rotation</em>.</p>
<ul>
<li><strong>Where the 16 extra bits come from — read the three labels.</strong> "Always condition code" supplies <code>cond</code> = 1110: Thumb has no condition field, so every expansion uses "always". "Update condition flags" supplies <code>S</code> = 1: Thumb instructions always set the flags, so the ARM equivalent is <code>ADDS</code>, not <code>ADD</code>. "Zero rotation" supplies <code>rotate</code> = 0000: the constant is used as-is.</li>
<li><strong>The single source register becomes two.</strong> Thumb's <code>Rd/Rn</code> field names one register used as both source and destination — that is why it says <code>ADD r3, #19</code> — while ARM has separate <code>Rn</code> and <code>Rd</code> fields, so the expansion fills both with r3. Two-operand form expanding into three-operand form: that is where a lot of the 16 bits go.</li>
<li><strong>Check the constant.</strong> The Thumb immediate field holds <code>00010011</code> in binary = 16 + 2 + 1 = <strong>19</strong> decimal ✓, matching <code>#19</code> in both assembler lines. This is the one number in the figure worth verifying, and it checks out.</li>
<li><strong>What Thumb gives up to fit in 16 bits.</strong> Per-instruction conditional execution (there is no <code>cond</code> field), free choice of whether to set flags, three independent registers, and access to all 16 registers (Thumb's 3-bit register fields reach only r0–r7). Every one of those restrictions is a bit that had to be cut.</li>
<li><strong>Why any of this exists: code density is performance.</strong> Halving instruction size roughly doubles how much code fits in an instruction cache and halves instruction-fetch bandwidth (Chapter 4). On an embedded device with a narrow bus and small memory, that can be worth more than the lost flexibility. Slide 32 explains how Thumb-2 got both.</li>
</ul>
<p class="pitfall">⚠️ Honest note about this figure: the ARM-side opcode field printed on the slide reads <code>0010</code>, whereas <code>0100</code> is the ARM data-processing encoding for ADD. Do not try to memorise opcode bit patterns off this diagram. What the figure reliably teaches is the <em>structure</em> of the expansion — cond, S, two register fields, zero rotate — and the constant 19 in register r3, not the exact opcode bits.</p>`,
        `<p class="y-chinh">🎯 Một lệnh in hai lần: dưới dạng mã hoá <strong>Thumb 16 bit</strong> và dưới dạng lệnh <strong>ARM 32 bit</strong> mà bộ xử lý bung nó ra. Bức hình này là toàn bộ ý tưởng Thumb gói trong một hình — nửa số bit, cùng công việc.</p>
<table>
<tr><th></th><th>Thumb (16 bit)</th><th>ARM (32 bit)</th></tr>
<tr><td>Viết là</td><td><code>ADD r3, #19</code></td><td><code>ADDS r3, r3, #19</code></td></tr>
<tr><td>Khuôn dạng</td><td>add/subtract/compare/move immediate format</td><td>data processing immediate format</td></tr>
<tr><td>Các trường</td><td><code>001</code> · <code>op code</code> · <code>Rd/Rn</code> · <code>immediate</code></td><td><code>cond</code> · <code>001</code> · <code>opcode</code> · <code>S</code> · <code>Rn</code> · <code>Rd</code> · <code>rotate</code> · <code>immediate</code></td></tr>
<tr><td>Số bit dành cho hằng</td><td>8 (bit 7–0), giá trị <code>00010011</code></td><td>8 bit immediate + 4 bit rotate (rotate = 0000)</td></tr>
</table>
<p class="nhan">Các mũi tên trên hình gán nhãn cho từng mảnh của phép bung: <em>major opcode denoting format 3 move/compare/add/sub with immediate value</em> (mã thao tác chính báo khuôn dạng 3) · <em>minor opcode denoting ADD instruction</em> (mã thao tác phụ báo đây là ADD) · <em>destination and source register</em> · <em>immediate value</em>, và bên phía ARM là <em>always condition code</em> · <em>update condition flags</em> · <em>zero rotation</em>.</p>
<ul>
<li><strong>16 bit dôi ra từ đâu — đọc ba cái nhãn ấy.</strong> "Always condition code" cấp <code>cond</code> = 1110: Thumb KHÔNG có trường điều kiện, nên mọi phép bung đều dùng "luôn luôn". "Update condition flags" cấp <code>S</code> = 1: lệnh Thumb LUÔN đặt cờ, nên bản ARM tương đương là <code>ADDS</code> chứ không phải <code>ADD</code>. "Zero rotation" cấp <code>rotate</code> = 0000: hằng được dùng nguyên trạng.</li>
<li><strong>Một thanh ghi nguồn trở thành hai.</strong> Trường <code>Rd/Rn</code> của Thumb nêu tên MỘT thanh ghi vừa làm nguồn vừa làm đích — đó là lý do nó viết <code>ADD r3, #19</code> — trong khi ARM có hai trường <code>Rn</code> và <code>Rd</code> tách biệt, nên phép bung điền r3 vào cả hai. Dạng hai toán hạng bung thành dạng ba toán hạng: rất nhiều trong số 16 bit dôi ra đi vào chỗ này.</li>
<li><strong>Kiểm con số hằng.</strong> Trường immediate của Thumb chứa <code>00010011</code> nhị phân = 16 + 2 + 1 = <strong>19</strong> thập phân ✓, khớp với <code>#19</code> trên cả hai dòng hợp ngữ. Đây là con số duy nhất trên hình đáng kiểm lại, và nó khớp.</li>
<li><strong>Thumb từ bỏ những gì để nhét vừa 16 bit.</strong> Thực thi có điều kiện theo từng lệnh (không có trường <code>cond</code>), quyền tự chọn có đặt cờ hay không, ba thanh ghi độc lập, và quyền dùng cả 16 thanh ghi (trường thanh ghi 3 bit của Thumb chỉ với tới r0–r7). Mỗi hạn chế đó là một chỗ đã phải cắt bit.</li>
<li><strong>Vì sao có chuyện này: mật độ mã CHÍNH LÀ hiệu năng.</strong> Giảm nửa kích thước lệnh thì xấp xỉ gấp đôi lượng mã nằm vừa trong cache lệnh và giảm nửa băng thông nạp lệnh (Chương 4). Trên một thiết bị nhúng với bus hẹp và bộ nhớ nhỏ, chừng đó có thể đáng giá hơn phần mềm dẻo bị mất. Slide 32 kể cách Thumb-2 lấy được cả hai.</li>
</ul>
<p class="pitfall">⚠️ Ghi chú trung thực về bức hình này: trường opcode phía ARM in trên slide đọc ra là <code>0010</code>, trong khi <code>0100</code> mới là mã hoá ADD của nhóm xử lý dữ liệu ARM. ĐỪNG cố học thuộc các mẫu bit opcode từ sơ đồ này. Thứ bức hình dạy đáng tin là <em>CẤU TRÚC</em> của phép bung — cond, S, hai trường thanh ghi, rotate bằng 0 — và hằng 19 trong thanh ghi r3, chứ không phải các bit opcode cụ thể.</p>`],

      [32, 'Thumb-2 Instruction Set — 16-bit and 32-bit instructions mixed freely',
        `<p class="y-chinh">🎯 The resolution of the whole density-versus-performance argument. Thumb-2 "introduces <strong>32-bit instructions that can be intermixed freely with the older 16-bit Thumb instructions</strong>", so a program uses short encodings where they suffice and long ones where they do not.</p>
<ul>
<li><strong>Where it runs.</strong> "The <strong>only</strong> instruction set available on the Cortex-M microcontroller products." Every ARM microcontroller you are likely to meet — in a washing machine, a drone, an Arduino-class board — executes Thumb-2 and nothing else.</li>
<li><strong>What it is.</strong> "A <strong>major enhancement</strong> to the Thumb instruction set architecture (ISA)." Not a replacement: old 16-bit Thumb encodings still work, and the new 32-bit ones are added alongside.</li>
<li><strong>The conditional-execution trade, stated on the slide.</strong> "<strong>Most 32-bit Thumb instructions are unconditional</strong>, whereas almost all ARM instructions can be conditional." That 4-bit <code>cond</code> field on every ARM format (slide 29) was expensive; Thumb-2 spends those bits elsewhere.</li>
<li><strong>And how it buys the conditionality back.</strong> "Introduces a new <strong>If-Then (IT)</strong> instruction that delivers much of the functionality of the condition field in ARM instructions." One <code>IT</code> instruction makes up to four following instructions conditional. You pay 16 bits once instead of 4 bits on every single instruction — a much better deal whenever conditional blocks are longer than one instruction.</li>
<li><strong>The result, in the slide's own words.</strong> "Delivers overall <strong>code density comparable with Thumb</strong>, together with the <strong>performance levels associated with the ARM ISA</strong>." And the sentence that frames the whole thing: "<strong>Before Thumb-2 developers had to choose between Thumb for size and ARM for performance.</strong>"</li>
<li><strong>Read this slide as the answer to slide 21.</strong> Slide 21 said instruction length is the most basic design issue and forces a trade. Thumb-2's answer is: do not choose a single length — choose per instruction, but keep the set small (two lengths) and the boundary cheap to detect (slide 33 shows how). That is a genuinely different answer from both fixed-length RISC and free-form CISC.</li>
</ul>
<p class="dap-an">✅ Put the three ARM encodings side by side. <strong>ARM:</strong> always 4 bytes, conditional per instruction, 16 registers, best performance, worst density. <strong>Thumb:</strong> always 2 bytes, no conditions, mostly 8 registers, best density, restricted. <strong>Thumb-2:</strong> 2 <em>or</em> 4 bytes freely mixed, conditions via <code>IT</code>, full register access — density of Thumb with performance of ARM. That progression is a complete exam answer on its own.</p>
<p class="meo">💡 One sentence: <strong>Thumb-2 = variable-length instructions (slide 25) with only two possible lengths.</strong> That keeps almost all of the compactness while avoiding almost all of x86's decoding pain — which is exactly what slide 33 demonstrates.</p>`,
        `<p class="y-chinh">🎯 Lời giải cho toàn bộ cuộc tranh luận mật-độ-hay-hiệu-năng. Thumb-2 "đưa vào <strong>các lệnh 32 bit có thể TRỘN TỰ DO với các lệnh Thumb 16 bit cũ</strong>", nên chương trình dùng mã ngắn ở chỗ đủ dùng và mã dài ở chỗ không đủ.</p>
<ul>
<li><strong>Nó chạy ở đâu.</strong> "Tập lệnh <strong>DUY NHẤT</strong> có trên dòng vi điều khiển Cortex-M." Mọi vi điều khiển ARM bạn có khả năng gặp — trong máy giặt, trong drone, trên một bo mạch cỡ Arduino — đều thực thi Thumb-2 và không gì khác.</li>
<li><strong>Nó là cái gì.</strong> "Một <strong>NÂNG CẤP LỚN</strong> cho kiến trúc tập lệnh Thumb (ISA)." Không phải bản thay thế: các mã hoá Thumb 16 bit cũ vẫn chạy được, và các mã 32 bit mới được thêm vào bên cạnh.</li>
<li><strong>Đánh đổi về thực thi có điều kiện, slide nói thẳng.</strong> "<strong>Phần lớn lệnh Thumb 32 bit là KHÔNG điều kiện</strong>, trong khi gần như mọi lệnh ARM đều có thể có điều kiện." Cái trường <code>cond</code> 4 bit trên mọi khuôn dạng ARM (slide 29) là đắt đỏ; Thumb-2 tiêu mấy bit ấy vào chỗ khác.</li>
<li><strong>Và nó mua lại tính có-điều-kiện ra sao.</strong> "Đưa vào một lệnh <strong>If-Then (IT)</strong> mới, cung cấp phần lớn chức năng của trường điều kiện trong lệnh ARM." Một lệnh <code>IT</code> làm cho tới BỐN lệnh đứng sau trở thành có điều kiện. Bạn trả 16 bit MỘT LẦN thay vì trả 4 bit trên TỪNG lệnh — một món hời hơn hẳn mỗi khi khối điều kiện dài hơn một lệnh.</li>
<li><strong>Kết quả, đúng chữ của slide.</strong> "Mang lại <strong>mật độ mã tổng thể ngang với Thumb</strong>, cùng với <strong>mức hiệu năng gắn với tập lệnh ARM</strong>." Và câu đóng khung cả chuyện: "<strong>Trước Thumb-2, lập trình viên buộc phải CHỌN giữa Thumb cho kích thước và ARM cho hiệu năng.</strong>"</li>
<li><strong>Đọc slide này như câu trả lời cho slide 21.</strong> Slide 21 nói độ dài lệnh là vấn đề thiết kế cơ bản nhất và nó ép ra một đánh đổi. Câu trả lời của Thumb-2 là: đừng chọn MỘT độ dài — chọn theo từng lệnh, nhưng giữ tập lựa chọn nhỏ (hai độ dài) và giữ cho ranh giới RẺ để nhận ra (slide 33 chỉ cách). Đó là một câu trả lời thật sự khác cả RISC độ dài cố định lẫn CISC tự do.</li>
</ul>
<p class="dap-an">✅ Đặt ba cách mã hoá của ARM cạnh nhau. <strong>ARM:</strong> luôn 4 byte, có điều kiện theo từng lệnh, 16 thanh ghi, hiệu năng tốt nhất, mật độ tệ nhất. <strong>Thumb:</strong> luôn 2 byte, không điều kiện, phần lớn chỉ 8 thanh ghi, mật độ tốt nhất, bị hạn chế. <strong>Thumb-2:</strong> 2 <em>hoặc</em> 4 byte trộn tự do, điều kiện qua <code>IT</code>, dùng đủ thanh ghi — mật độ của Thumb với hiệu năng của ARM. Riêng mạch tiến hoá đó đã là một câu trả lời thi hoàn chỉnh.</p>
<p class="meo">💡 Một câu: <strong>Thumb-2 = lệnh độ dài thay đổi (slide 25) nhưng CHỈ có hai độ dài khả dĩ.</strong> Thế là giữ được gần hết sự gọn gàng mà né được gần hết nỗi đau giải mã của x86 — đúng điều slide 33 chứng minh.</p>`],

      [33, 'Figure 14.13 — Thumb-2 Encoding (how the decoder tells 16 from 32 bits)',
        `<p class="y-chinh">🎯 The mechanism that makes slide 32 practical. The top of the figure shows an instruction stream at addresses <em>i</em>, <em>i</em>+2, <em>i</em>+4, <em>i</em>+6, <em>i</em>+8, <em>i</em>+10 with boxes labelled <code>thm</code> (a 16-bit Thumb instruction) and <code>hw1</code>/<code>hw2</code> (the two halfwords of a 32-bit Thumb-2 instruction), all flowing left to right. The table below gives the rule.</p>
<table>
<tr><th>Halfword 1 [15:13]</th><th>Halfword 1 [12:11]</th><th>Length</th><th>Functionality</th></tr>
<tr><td><strong>Not 111</strong></td><td>xx</td><td>16 bits (1 halfword)</td><td>16-bit Thumb instruction</td></tr>
<tr><td><strong>111</strong></td><td><strong>00</strong></td><td>16 bits (1 halfword)</td><td>16-bit Thumb unconditional branch instruction</td></tr>
<tr><td><strong>111</strong></td><td><strong>Not 00</strong></td><td>32 bits (2 halfwords)</td><td>32-bit Thumb-2 instruction</td></tr>
</table>
<ul>
<li><strong>The whole decision needs only five bits — [15:13] and [12:11] of the FIRST halfword.</strong> Read three bits; if they are not 111 you already know the instruction is 16 bits. If they are 111, read two more. That is the entire length-decoding problem, solved in one table lookup on bits you have already fetched.</li>
<li><strong>Contrast this with x86 (slide 28) and the design point lands.</strong> x86 needs prefixes → opcode → ModR/m → SIB → displacement → immediate, six dependent steps, before it knows where the next instruction begins. Thumb-2 needs five bits of the first halfword. Both are variable length; only one of them is cheap to decode.</li>
<li><strong>Why 111 was chosen as the escape.</strong> It is an <em>expanding opcode</em> again (slides 23 and 26): most 3-bit combinations mean "short instruction, decode normally", and one reserved combination means "keep reading". Cheap in bits, cheap in logic.</li>
<li><strong>Read the picture across the top as the payoff.</strong> A real Thumb-2 program is a mixture: <code>thm</code> · <code>hw1 hw2</code> · <code>thm</code> · <code>hw1 hw2</code> · <code>thm</code> — short instructions where two operands and eight registers suffice, long ones where they do not. That mixture is where "code density of Thumb with performance of ARM" actually comes from.</li>
<li><strong>Note the alignment guarantee.</strong> Every instruction starts on a halfword (2-byte) boundary, and a 32-bit instruction is just two consecutive halfwords. That keeps slide 21's rule ("instruction length integrally related to word length") satisfied and means the fetch unit never has to handle a misaligned instruction.</li>
</ul>
<p class="dap-an">✅ Worked decode. Suppose the halfword at address <em>i</em> begins with bits <code>110…</code>: [15:13] = 110, which is "Not 111" → <strong>16-bit Thumb</strong>, so the next instruction is at <em>i</em>+2. Now suppose it begins <code>11101…</code>: [15:13] = 111 and [12:11] = 01, which is "Not 00" → <strong>32-bit Thumb-2</strong>, so this instruction occupies <em>i</em> and <em>i</em>+2, and the next one starts at <em>i</em>+4. Five bits, decision made.</p>
<p class="meo">💡 The exam-ready summary of slides 31–33: <strong>Thumb halves the size by removing options; Thumb-2 restores the options by allowing two lengths; and the length is decided by five bits so the decoder stays simple.</strong> That is the honest middle ground between ARM slide 29 and x86 slide 28.</p>`,
        `<p class="y-chinh">🎯 Cơ chế khiến slide 32 khả thi. Phần trên của hình vẽ một dòng lệnh ở các địa chỉ <em>i</em>, <em>i</em>+2, <em>i</em>+4, <em>i</em>+6, <em>i</em>+8, <em>i</em>+10 với các ô ghi <code>thm</code> (một lệnh Thumb 16 bit) và <code>hw1</code>/<code>hw2</code> (hai nửa-từ của một lệnh Thumb-2 32 bit), tất cả chảy từ trái sang phải. Bảng ở dưới cho quy tắc.</p>
<table>
<tr><th>Nửa-từ 1, bit [15:13]</th><th>Nửa-từ 1, bit [12:11]</th><th>Độ dài</th><th>Là lệnh gì</th></tr>
<tr><td><strong>Không phải 111</strong></td><td>xx</td><td>16 bit (1 nửa-từ)</td><td>Lệnh Thumb 16 bit</td></tr>
<tr><td><strong>111</strong></td><td><strong>00</strong></td><td>16 bit (1 nửa-từ)</td><td>Lệnh nhảy KHÔNG điều kiện Thumb 16 bit</td></tr>
<tr><td><strong>111</strong></td><td><strong>Khác 00</strong></td><td>32 bit (2 nửa-từ)</td><td>Lệnh Thumb-2 32 bit</td></tr>
</table>
<ul>
<li><strong>Cả quyết định chỉ cần NĂM bit — [15:13] và [12:11] của nửa-từ ĐẦU TIÊN.</strong> Đọc ba bit; nếu không phải 111 là bạn đã biết lệnh này dài 16 bit. Nếu là 111 thì đọc thêm hai bit nữa. Đó là toàn bộ bài toán giải mã độ dài, giải xong bằng một lần tra bảng trên những bit mà bạn vốn đã nạp về rồi.</li>
<li><strong>Đối chiếu với x86 (slide 28) là điểm thiết kế hiện ra rõ.</strong> x86 cần tiền tố → mã thao tác → ModR/m → SIB → độ dời → hằng tức thời, SÁU bước phụ thuộc nhau, mới biết lệnh kế tiếp bắt đầu ở đâu. Thumb-2 cần năm bit của nửa-từ đầu. Cả hai đều là độ dài thay đổi; chỉ một trong hai là RẺ để giải mã.</li>
<li><strong>Vì sao chọn 111 làm lối thoát.</strong> Lại là <em>MÃ THAO TÁC MỞ RỘNG</em> (slide 23 và 26): phần lớn tổ hợp 3 bit nghĩa là "lệnh ngắn, giải mã bình thường", và một tổ hợp được giữ lại nghĩa là "đọc tiếp đi". Rẻ về bit, rẻ về mạch logic.</li>
<li><strong>Đọc bức tranh phía trên như phần thu hoạch.</strong> Một chương trình Thumb-2 thật là một hỗn hợp: <code>thm</code> · <code>hw1 hw2</code> · <code>thm</code> · <code>hw1 hw2</code> · <code>thm</code> — lệnh ngắn ở chỗ hai toán hạng và tám thanh ghi là đủ, lệnh dài ở chỗ không đủ. Chính cái hỗn hợp đó là nơi "mật độ của Thumb với hiệu năng của ARM" thật sự sinh ra.</li>
<li><strong>Chú ý bảo đảm về căn chỉnh.</strong> Mọi lệnh đều bắt đầu trên biên nửa-từ (2 byte), và một lệnh 32 bit chỉ là hai nửa-từ liền nhau. Điều đó giữ cho quy tắc của slide 21 ("độ dài lệnh có quan hệ nguyên với độ dài từ") được thoả, và nghĩa là khối nạp lệnh KHÔNG BAO GIỜ phải xử lý một lệnh lệch biên.</li>
</ul>
<p class="dap-an">✅ Giải mã thử. Giả sử nửa-từ ở địa chỉ <em>i</em> bắt đầu bằng bit <code>110…</code>: [15:13] = 110, thuộc ca "Không phải 111" → <strong>Thumb 16 bit</strong>, nên lệnh kế tiếp nằm ở <em>i</em>+2. Giờ giả sử nó bắt đầu bằng <code>11101…</code>: [15:13] = 111 và [12:11] = 01, thuộc ca "Khác 00" → <strong>Thumb-2 32 bit</strong>, nên lệnh này chiếm <em>i</em> và <em>i</em>+2, còn lệnh kế tiếp bắt đầu ở <em>i</em>+4. Năm bit, xong quyết định.</p>
<p class="meo">💡 Tóm tắt sẵn cho phòng thi của slide 31–33: <strong>Thumb giảm nửa kích thước bằng cách bỏ bớt lựa chọn; Thumb-2 trả lại lựa chọn bằng cách cho phép HAI độ dài; và độ dài được quyết bởi năm bit nên bộ giải mã vẫn đơn giản.</strong> Đó là khoảng giữa trung thực nằm giữa ARM slide 29 và x86 slide 28.</p>`],

      [34, 'Summary — Chapter 14: Instruction Sets: Addressing Modes and Formats',
        `<p class="y-chinh">🎯 The chapter's own revision checklist. If you can say two solid sentences about every bullet here, you are ready for the exam. The slide groups them into two blocks, matching the two halves of the deck.</p>
<table>
<tr><th>Block 1 — Addressing modes</th><th>Block 2 — Instruction formats</th></tr>
<tr><td>Immediate addressing · Direct addressing · Indirect addressing · Register addressing · Register indirect addressing · Displacement addressing · Stack addressing · x86 addressing modes · ARM addressing modes</td><td>Instruction length · Allocation of bits · Variable-length instructions · x86 instruction formats · ARM instruction formats</td></tr>
</table>
<p class="nhan"><strong>The seven algorithms, one last time — this is the highest-value thing on the page.</strong> <code>Operand = A</code> (immediate) · <code>EA = A</code> (direct) · <code>EA = (A)</code> (indirect) · <code>EA = R</code> (register) · <code>EA = (R)</code> (register indirect) · <code>EA = A + (R)</code> (displacement) · <code>EA = top of stack</code> (stack).</p>
<p class="nhan"><strong>Practice problem 6 — a full exam question combining both halves.</strong> "A machine has 24-bit instructions, needs <strong>60 operations</strong>, has <strong>16 index registers</strong>, and uses the remaining bits as a memory address field. (a) How many bits for each field? (b) How much memory can be addressed directly? (c) If the machine has 1 MiB of memory, what mode must it use to reach it all?"</p>
<ul>
<li>(a) Opcode: 60 operations need ceil(log<sub>2</sub> 60) = <strong>6 bits</strong> (2<sup>5</sup> = 32 is too few, 2<sup>6</sup> = 64 is enough, 4 codes wasted). Index register: log<sub>2</sub> 16 = <strong>4 bits</strong>. Address: 24 − 6 − 4 = <strong>14 bits</strong>.</li>
<li>(b) 2<sup>14</sup> = <strong>16 384 words</strong> directly addressable.</li>
<li>(c) 1 MiB is 1 048 576 bytes; a 14-bit field reaches 16 384 — about 1.6% of it. To reach the rest the machine must use <strong>indirect</strong> (a memory word holds a full address) or, better, <strong>displacement/base-register</strong> addressing so a wide register supplies the high bits.</li>
</ul>
<p class="dap-an">✅ Verified by machine: ceil(log<sub>2</sub> 60) = 6, log<sub>2</sub> 16 = 4, 24 − 6 − 4 = 14, 2<sup>14</sup> = 16 384. Part (c) is the chapter's whole argument in miniature: <em>short address fields are why every mode after "direct" exists.</em></p>
<ul>
<li><strong>Revision route through the deck.</strong> Table 14.1 (slide 4) is the spine — learn it and the rest hangs off it. Figure 14.1 (slide 3) is the picture version of the same table. Slide 22 is the bit-allocation drill. Slides 15–19 and 28–33 are the two case-study machines, x86 and ARM, one for each half.</li>
<li><strong>The two exam drills, side by side.</strong> <em>Effective address</em>: identify the mode, write "EA = …", then "value = …", and never confuse the two. <em>Bit allocation</em>: opcode bits = ceil(log<sub>2</sub> operations), register bits = log<sub>2</sub> registers per operand, remainder = address, range = 2<sup>k</sup> or ±2<sup>k−1</sup>.</li>
<li><strong>Where this chapter goes next.</strong> Chapter 16 (processor structure) executes these instructions and pipelines them. Chapter 17 (RISC) argues that fixed 4-byte instructions and three addressing modes beat everything in this chapter, and gives the measurements. Chapter 18 (superscalar) shows why variable-length decoding becomes the bottleneck when you try to issue four instructions per cycle.</li>
<li><strong>What to carry into PRF192 and any C you write.</strong> <code>a[i]</code> is indexed addressing, <code>*p</code> is register indirect, <code>p-&gt;field</code> is displacement, a local variable is base-register off the frame pointer, and a function call is stack addressing. The five things you use most in C are five of the seven modes on this slide.</li>
</ul>
<p class="meo">💡 If you have thirty minutes to revise the whole chapter: memorise Table 14.1 (slide 4), redo the LOAD 500 table from the shared machine state until you can produce all eleven answers from memory, then do the three bit-allocation problems on slide 22. That covers the overwhelming majority of what gets asked.</p>`,
        `<p class="y-chinh">🎯 Bảng ôn tập do chính chương này đưa ra. Nói được hai câu chắc chắn về mỗi gạch đầu dòng ở đây là bạn sẵn sàng đi thi. Slide gom chúng thành hai khối, khớp với hai nửa của deck.</p>
<table>
<tr><th>Khối 1 — Chế độ địa chỉ</th><th>Khối 2 — Khuôn dạng lệnh</th></tr>
<tr><td>Địa chỉ tức thời · trực tiếp · gián tiếp · thanh ghi · gián tiếp qua thanh ghi · độ dời · ngăn xếp · chế độ địa chỉ của x86 · chế độ địa chỉ của ARM</td><td>Độ dài lệnh · Phân bổ bit · Lệnh độ dài thay đổi · Khuôn dạng lệnh x86 · Khuôn dạng lệnh ARM</td></tr>
</table>
<p class="nhan"><strong>Bảy thuật toán, lần cuối — đây là thứ đáng giá nhất trên cả trang.</strong> <code>Operand = A</code> (tức thời) · <code>EA = A</code> (trực tiếp) · <code>EA = (A)</code> (gián tiếp) · <code>EA = R</code> (thanh ghi) · <code>EA = (R)</code> (gián tiếp qua thanh ghi) · <code>EA = A + (R)</code> (độ dời) · <code>EA = đỉnh ngăn xếp</code> (ngăn xếp).</p>
<p class="nhan"><strong>Bài luyện 6 — một câu thi đầy đủ gộp cả hai nửa chương.</strong> "Một cỗ máy có lệnh 24 bit, cần <strong>60 thao tác</strong>, có <strong>16 thanh ghi chỉ số</strong>, và dùng số bit còn lại làm trường địa chỉ bộ nhớ. (a) Mỗi trường được bao nhiêu bit? (b) Đánh địa chỉ TRỰC TIẾP được bao nhiêu bộ nhớ? (c) Nếu máy có 1 MiB bộ nhớ thì phải dùng chế độ nào để với tới hết?"</p>
<ul>
<li>(a) Mã thao tác: 60 thao tác cần trần(log<sub>2</sub> 60) = <strong>6 bit</strong> (2<sup>5</sup> = 32 là thiếu, 2<sup>6</sup> = 64 mới đủ, phí 4 mã). Thanh ghi chỉ số: log<sub>2</sub> 16 = <strong>4 bit</strong>. Địa chỉ: 24 − 6 − 4 = <strong>14 bit</strong>.</li>
<li>(b) 2<sup>14</sup> = <strong>16 384 từ</strong> đánh địa chỉ trực tiếp được.</li>
<li>(c) 1 MiB là 1 048 576 byte; trường 14 bit với tới 16 384 — khoảng 1,6% chỗ đó. Muốn với tới phần còn lại thì máy phải dùng <strong>GIÁN TIẾP</strong> (một từ nhớ giữ địa chỉ đầy đủ) hoặc, tốt hơn, <strong>ĐỘ DỜI / THANH GHI NỀN</strong> để một thanh ghi rộng cấp phần bit cao.</li>
</ul>
<p class="dap-an">✅ Đã kiểm bằng máy: trần(log<sub>2</sub> 60) = 6, log<sub>2</sub> 16 = 4, 24 − 6 − 4 = 14, 2<sup>14</sup> = 16 384. Câu (c) là toàn bộ lập luận của chương thu nhỏ: <em>trường địa chỉ NGẮN chính là lý do mọi chế độ đứng sau "trực tiếp" tồn tại.</em></p>
<ul>
<li><strong>Lộ trình ôn xuyên deck.</strong> Table 14.1 (slide 4) là XƯƠNG SỐNG — thuộc nó rồi thì mọi thứ khác móc vào đó. Figure 14.1 (slide 3) là bản hình của đúng cái bảng ấy. Slide 22 là bài luyện phân bổ bit. Slide 15–19 và 28–33 là hai cỗ máy làm ca nghiên cứu, x86 và ARM, mỗi nửa chương một máy.</li>
<li><strong>Hai quy trình thi, đặt cạnh nhau.</strong> <em>Địa chỉ hiệu dụng</em>: xác định chế độ, viết "EA = …", rồi "giá trị = …", và không bao giờ lẫn hai dòng đó. <em>Phân bổ bit</em>: số bit mã thao tác = trần(log<sub>2</sub> số thao tác), số bit thanh ghi = log<sub>2</sub> số thanh ghi cho mỗi toán hạng, phần dư là địa chỉ, tầm = 2<sup>k</sup> hoặc ±2<sup>k−1</sup>.</li>
<li><strong>Chương này đi tiếp về đâu.</strong> Chương 16 (cấu trúc bộ xử lý) THỰC THI những lệnh này và cho chúng vào đường ống. Chương 17 (RISC) lập luận rằng lệnh 4 byte cố định cùng ba chế độ địa chỉ thắng mọi thứ trong chương này, và đưa ra số liệu đo. Chương 18 (superscalar) cho thấy vì sao việc giải mã lệnh độ dài thay đổi trở thành nút thắt khi bạn cố phát bốn lệnh mỗi chu kỳ.</li>
<li><strong>Mang gì sang PRF192 và mọi dòng C bạn viết.</strong> <code>a[i]</code> là địa chỉ CHỈ SỐ, <code>*p</code> là GIÁN TIẾP QUA THANH GHI, <code>p-&gt;field</code> là ĐỘ DỜI, một biến cục bộ là THANH GHI NỀN tính từ con trỏ khung, và một lời gọi hàm là NGĂN XẾP. Năm thứ bạn dùng nhiều nhất trong C chính là năm trong bảy chế độ trên slide này.</li>
</ul>
<p class="meo">💡 Có ba mươi phút để ôn cả chương thì: học thuộc Table 14.1 (slide 4), làm lại bảng LOAD 500 trên trạng thái máy dùng chung cho tới khi tự nhớ ra được cả mười một đáp án, rồi làm ba bài phân bổ bit ở slide 22. Chừng đó phủ áp đảo phần hay bị hỏi.</p>`],

    ]),
  ].join('\n'),
};
