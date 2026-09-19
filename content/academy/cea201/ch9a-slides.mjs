/**
 * CEA201 · "Chương 9 — Digital Logic" trên web (deck 'cea12' = Ch.12 bản 11e),
 * học theo từng slide, PHẦN A: slide 1–28 / 56.
 *
 * ⚠️ ĐÁNH SỐ BA ĐƯỜNG — nhớ kỹ kẻo tìm nhầm chương:
 *   · Syllabus của trường (soạn theo bản 9th ed) gọi phần này là
 *     "Chapter 11: Digital Logic".
 *   · Bộ slide chính hãng 11th ed Global Edition đánh là "Chapter 12".
 *   · Trên web môn này xếp là "Chương 9", nên file tên ch9a / ch9b.
 *   Cả ba cùng trỏ vào MỘT nội dung. Xem bảng quy đổi trong _slides.mjs.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH12-COA11e.pptx (/tmp/cea201-text/cea12.txt).
 * Slide chỉ có tiêu đề + hình (6, 7, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 21,
 * 22, 23, 24, 25, 27, 28) đã được ĐỌC THẲNG TỪ ẢNH render để lấy đúng từng nhãn
 * trên sơ đồ và từng ô được khoanh trên bìa Karnaugh.
 *
 * ⚠️ PHẠM VI THẬT của slide 1–28 (KHÁC mô tả sơ bộ của đề bài):
 *   CÓ  — đại số Boole, bảng tương ứng với tập hợp, các định luật, cổng logic,
 *         NAND/NOR đầy đủ, mạch tổ hợp, bảng chân trị → SOP → POS → rút gọn,
 *         bìa Karnaugh (2/3/4 biến + don't care), Quine–McCluskey, hiện thực
 *         bằng NAND, bộ dồn kênh (multiplexer) 4-to-1 và ứng dụng vào PC.
 *   KHÔNG — bộ GIẢI MÃ (decoder) nằm ở slide 29–31, ROM ở 32–34, BỘ CỘNG ở
 *         35–38, mạch tuần tự/flip-flop 39–51, PLD/FPGA 52–55. Tất cả thuộc
 *         phần B (slide 29–56). Bộ cộng vẫn được giảng TRỌN ở đây (slide 13 và
 *         slide 24) vì đề thi CLO6 hỏi nặng và nó là bài tập 3-biến tự nhiên
 *         nhất — nhưng bài ghi RÕ đó là kiến thức của slide 35–38, không phải
 *         của slide đang xem.
 *
 * ⚠️ MỌI biểu thức trong bài đã kiểm bằng python3 TRƯỚC khi viết, bằng cách
 * sinh trọn 2^n tổ hợp rồi so bảng chân trị hai vế:
 *   · 7 cổng AND/OR/NOT/NAND/NOR/XOR/XNOR — dựng bảng trực tiếp.
 *   · 14 định luật Boole (giao hoán, kết hợp, phân phối cả hai chiều, đồng
 *     nhất, bù, luỹ đẳng, hấp thụ, A+A'B=A+B, De Morgan cả hai vế, XOR=AB'+A'B).
 *   · Table 12.4: bảng chân trị == SOP == POS (5 tổng) == B(A'+C') == A'B+BC'
 *     == dạng NAND hai tầng. Cả 5 dạng khớp nhau trên đủ 8 tổ hợp.
 *   · NAND là cổng đầy đủ: NOT, AND, OR, NOR, XOR dựng chỉ bằng NAND — kiểm
 *     đúng. NOR đầy đủ: NOT, OR, AND — kiểm đúng.
 *   · Figure 12.9 (a)(b)(c), Figure 12.10 (a)…(i), Figure 12.11 (a)(b): với mỗi
 *     hình, tập ô ĐƯỢC KHOANH trên ảnh được nhập vào máy rồi so với biểu thức
 *     in dưới hình — 14/14 khớp.
 *   · Bộ tăng BCD (Table 12.5 + Figure 12.12): W = AD' + A'BCD · X = BD' + BC'
 *     + B'CD · Y = A'C'D + A'CD' · Z = D'. Kiểm trên 10 tổ hợp CÓ NGHĨA (0–9),
 *     bỏ qua 6 tổ hợp don't care — cả 4 đều đúng.
 *     ⚠️ Chữ trích từ .pptx đọc ra "BCD" ở số hạng thứ ba của X (mất dấu gạch
 *     trên). Máy bác bỏ: BD' + BC' + BCD SAI tại ABCD = 0011 và 0111. Dạng
 *     đúng là B'CD (B có gạch trên). Đã sửa theo máy, và nói rõ trong bài.
 *   · Quine–McCluskey (Table 12.6/12.7), minterm {1,5,6,7,11,12,13,15}: máy
 *     liệt kê ĐỦ 5 prime implicant — BD · A'BC · A'C'D · ABC' · ACD — rồi vét
 *     cạn mọi tổ hợp phủ. Kết quả: 4 số hạng A'C'D + A'BC + ABC' + ACD là
 *     phủ TỐI THIỂU, và **BD là dư** (cả 4 minterm 5·7·13·15 của nó đều bị 4
 *     số hạng kia phủ). Cả bản 4 số hạng lẫn bản 5 số hạng đều đúng hàm.
 *   · Bộ cộng: SUM = A XOR B XOR Cin · Cout = AB + ACin + BCin. Ghép 4 tầng
 *     ripple-carry rồi chạy ĐỦ 16×16×2 = 512 phép cộng, so với x+y+cin — khớp
 *     100%. Độ trễ 2n mức cổng (4 bit → 8; 32 bit → 64).
 *   · MUX 4-to-1: F = D0·S2'S1' + D1·S2'S1 + D2·S2S1' + D3·S2S1 kiểm trên đủ
 *     64 tổ hợp (2 chọn + 4 dữ liệu) — khớp.
 *
 * Chỗ slide gốc SAI / HỎNG — nêu rõ, không im lặng chép, không tự sửa slide:
 *   · slide 3 (Table 12.2): ô Function của DÒNG THỨ BA ghi "A OR B", nhưng mô
 *     tả là "1 if and only if A is 0" và cột Sets là Ā (complement). Đúng phải
 *     là "NOT A". Đây là LỖI IN trên chính slide gốc.
 *   · slide 8 (Table 12.3) và slide 22, 23 (Table 12.6/12.7): bản dựng bị CHỒNG
 *     HÌNH — một bảng lớn nằm đè lên nhiều bản thu nhỏ không đọc nổi của chính
 *     nó. Nội dung đúng đã lấy từ phần đọc được + sách, và bài ghi lại đầy đủ.
 *   · slide 5 (Table 12.1): bảng chỉ có 6 cột hàm (NOT, AND, OR, NAND, NOR,
 *     XOR) — KHÔNG có XNOR. Bài bổ sung XNOR và nói rõ đó là phần thêm.
 *   · slide 22/23: dòng "(for F = ABCD + AB C̄…" bị CẮT CỤT ngay trên slide.
 *     Hàm đầy đủ dựng lại từ 8 minterm đọc được trong chính bảng.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea12';

export default {
  title: '9.0a — Slide by slide: Boolean algebra, logic gates and combinational circuits (slides 1–28)|||9.0a — Slide bài giảng: Đại số Boole, cổng logic & mạch tổ hợp (slide 1–28)',
  slug: 'cea201-9-0a-slides-dai-so-boole-mach-to-hop',
  type: 'DOCUMENT',
  description: 'Nửa đầu chương Digital Logic của CEA201 (slide 1–28) — chương làm bài tay nặng nhất của môn và là trụ của CLO6. Đi trọn một vòng: đại số Boole và các định luật (có chứng minh bằng bảng chân trị), bảy cổng logic với bảng chân trị đầy đủ, chứng minh NAND/NOR là cổng đầy đủ, rồi quy trình thiết kế mạch tổ hợp bảng chân trị → SOP → POS → rút gọn → sơ đồ, làm trọn ba bài từ đầu đến cuối. Phần bìa Karnaugh giải bốn bài (2, 3, 4 biến và một bài có don\'t care), giải thích vì sao trục phải là mã Gray, kèm Quine–McCluskey và bộ dồn kênh 4-to-1. Mọi biểu thức rút gọn đã được kiểm bằng máy trên toàn bộ 2^n tổ hợp — trong đó máy bắt được một chỗ chữ trích từ slide bị mất dấu gạch trên.',
  content: [
    walkHead(D, 1, 28),
    walk(D, [

      [1, 'Chapter 12 — Digital Logic (title slide)',
        `<p class="y-chinh">🎯 The opening slide of the one chapter in this course where you <strong>build the machine instead of describing it</strong>. Everything before was "what a computer does"; from here it is "out of what, exactly" — and the answer is a two-valued algebra invented in 1854 wired into silicon.</p>
<ul>
<li><strong>Three numbering systems, one chapter — read this before you go hunting.</strong> Your syllabus follows the 9th edition and calls this <em>"Chapter 11: Digital Logic"</em>. The official 11th-edition slide deck you are looking at says <em>"Chapter 12"</em>. The course site files it as <em>"Chương 9"</em>. All three are the same material. If an exam paper says "Chapter 11", it means this.</li>
<li><strong>What is actually in slides 1–28 (this lesson).</strong> Boolean algebra and its identities · the seven logic gates · NAND and NOR as building blocks · combinational circuits · truth table to SOP to POS to simplified form · Karnaugh maps including don't-care conditions · the Quine–McCluskey method · the multiplexer.</li>
<li><strong>What is NOT here yet.</strong> Decoders (slides 29–31), ROM (32–34), <em>adders</em> (35–38), sequential circuits and flip-flops (39–51), registers, counters, PLA and FPGA (52–55). Part B of this walkthrough covers them. This lesson still teaches the adder in full at slides 13 and 24, because it is the most natural three-variable design exercise there is — but it always says so.</li>
<li><strong>This is the CLO6 chapter, and it is done by hand.</strong> Every other chapter you can pass by understanding. This one you pass by <em>drawing</em>: filling truth tables, folding Karnaugh maps, counting gates. Budget pencil time, not reading time.</li>
<li><strong>Where it plugs in.</strong> CSI106 chapter 3 already made you compute AND, OR and XOR on bit patterns — that was the <em>operation</em>; this chapter is the <em>hardware</em> that performs it. Chapter 11 (Computer Arithmetic) runs on the adder built here. The ALU inside the processor of Chapter 16 is nothing but a large pile of exactly these circuits with a multiplexer picking which answer leaves the box.</li>
</ul>
<p class="meo">💡 One sentence to carry through all 28 slides: <strong>a truth table is the specification, a Boolean expression is the design, a gate diagram is the product.</strong> Every exercise in this chapter is a move between those three forms.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu của chương DUY NHẤT trong môn mà bạn <strong>DỰNG ra cái máy chứ không mô tả nó</strong>. Mọi chương trước là "máy tính làm gì"; từ đây là "làm BẰNG CÁI GÌ" — và câu trả lời là một thứ đại số hai giá trị nghĩ ra năm 1854, đem đi khắc vào silicon.</p>
<ul>
<li><strong>Ba hệ đánh số, một chương — đọc trước kẻo đi tìm nhầm chỗ.</strong> Syllabus của trường theo bản 9th ed và gọi đây là <em>"Chapter 11: Digital Logic"</em>. Bộ slide chính hãng 11th ed bạn đang xem ghi <em>"Chapter 12"</em>. Web môn học xếp là <em>"Chương 9"</em>. Cả ba là CÙNG một nội dung. Đề thi ghi "Chapter 11" tức là cái này.</li>
<li><strong>Slide 1–28 (bài này) thật sự có gì.</strong> Đại số Boole và các định luật · bảy cổng logic · NAND và NOR làm viên gạch · mạch tổ hợp · bảng chân trị → SOP → POS → rút gọn · bìa Karnaugh kể cả điều kiện don't care · phương pháp Quine–McCluskey · bộ dồn kênh (multiplexer).</li>
<li><strong>Chưa có gì ở đây.</strong> Bộ giải mã (slide 29–31), ROM (32–34), <em>BỘ CỘNG</em> (35–38), mạch tuần tự và flip-flop (39–51), thanh ghi, bộ đếm, PLA và FPGA (52–55). Phần B của loạt bài này lo nốt. Bài này vẫn giảng TRỌN bộ cộng ở slide 13 và 24, vì nó là bài thiết kế 3 biến tự nhiên nhất đời — nhưng luôn nói rõ nó thuộc slide nào.</li>
<li><strong>Đây là chương của CLO6, và nó làm bằng TAY.</strong> Mọi chương khác bạn qua được bằng cách hiểu. Chương này bạn qua được bằng cách <em>VẼ</em>: điền bảng chân trị, gấp bìa Karnaugh, đếm cổng. Hãy dành thời gian cầm bút, đừng dành thời gian đọc.</li>
<li><strong>Nó cắm vào đâu.</strong> CSI106 chương 3 đã bắt bạn tính AND, OR, XOR trên dãy bit — đó là <em>PHÉP TOÁN</em>; chương này là <em>PHẦN CỨNG</em> thực hiện nó. Chương 11 (Computer Arithmetic) chạy trên chính bộ cộng dựng ở đây. Khối ALU trong bộ xử lý của Chương 16 chẳng qua là một đống lớn đúng những mạch này, cộng một bộ dồn kênh chọn xem kết quả nào được ra khỏi hộp.</li>
</ul>
<p class="meo">💡 Một câu mang theo suốt 28 slide: <strong>bảng chân trị là BẢN ĐẶC TẢ, biểu thức Boole là BẢN THIẾT KẾ, sơ đồ cổng là SẢN PHẨM.</strong> Mọi bài tập của chương này chỉ là đi từ dạng này sang dạng kia trong ba dạng đó.</p>`],

      [2, 'Boolean Algebra — what it is and why a computer engineer needs it',
        `<p class="y-chinh">🎯 The slide's own definition: a <strong>mathematical discipline used to design and analyze the behavior of the digital circuitry</strong> in digital computers and other digital systems. Two words matter — <em>design</em> and <em>analyze</em> — and the slide lists them separately on purpose.</p>
<ul>
<li><strong>Named after George Boole</strong>, English mathematician, who proposed the basic principles of the algebra in <strong>1854</strong>. He was doing logic, not electronics; transistors were 93 years away.</li>
<li><strong>Claude Shannon is the reason it ended up in your laptop.</strong> The slide credits him with suggesting that Boolean algebra could be used to solve problems in <em>relay-switching circuit design</em> — his 1937 master's thesis. That single observation is the bridge: a relay is open or closed, a Boolean variable is 0 or 1, therefore a pile of relays <em>is</em> a Boolean expression.</li>
<li><strong>Use 1 — Analysis.</strong> "It is an economical way of describing the function of digital circuitry." A circuit with 30 gates and 200 wires becomes one line of algebra. You can then <em>compare</em> two circuits by comparing two expressions, which is far cheaper than comparing two drawings.</li>
<li><strong>Use 2 — Design.</strong> "Given a desired function, Boolean algebra can be applied to develop a simplified implementation of that function." This is the money sentence of the chapter: <em>simplified</em> means fewer gates, which means less silicon, less power and less delay. Slides 14 and 16 will price the difference for you in gates.</li>
<li><strong>Why a two-valued algebra is not a limitation.</strong> A wire either carries a voltage above the threshold or below it. There is no third state to model, so a two-valued algebra is not an approximation of the hardware — it is an exact description of it. That exactness is why circuits can be <em>proved</em> correct, and why the machine checks in this lesson are possible at all.</li>
</ul>
<p class="meo">💡 Remember the pair of names by their jobs: <strong>Boole gave the algebra (1854), Shannon gave the wiring diagram (1937)</strong>. Exams like asking which one did which.</p>
<p class="pitfall">⚠️ Do not confuse Boolean algebra with ordinary algebra. Here <code>A + A = A</code> and <code>1 + 1 = 1</code>. The <code>+</code> sign means OR, not addition. Students lose marks every year by "simplifying" <code>A + A</code> to <code>2A</code>.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa của chính slide: một <strong>ngành toán dùng để THIẾT KẾ và PHÂN TÍCH hành vi của mạch số</strong> trong máy tính và các hệ thống số khác. Hai chữ đáng giá — <em>thiết kế</em> và <em>phân tích</em> — và slide tách riêng chúng là có chủ ý.</p>
<ul>
<li><strong>Đặt tên theo George Boole</strong>, nhà toán học người Anh, người nêu các nguyên lý cơ bản của thứ đại số này năm <strong>1854</strong>. Ông làm LOGIC chứ không làm điện tử; transistor còn cách đó 93 năm.</li>
<li><strong>Claude Shannon mới là lý do nó nằm trong cái laptop của bạn.</strong> Slide ghi công ông đã đề xuất rằng đại số Boole giải được bài toán <em>thiết kế mạch chuyển mạch rơ-le</em> — luận văn thạc sĩ năm 1937. Đúng một nhận xét đó là cây cầu: rơ-le chỉ đóng hoặc mở, biến Boole chỉ 0 hoặc 1, vậy một đống rơ-le CHÍNH LÀ một biểu thức Boole.</li>
<li><strong>Công dụng 1 — PHÂN TÍCH.</strong> "Là cách kinh tế để mô tả chức năng của mạch số." Một mạch 30 cổng, 200 dây trở thành một dòng đại số. Và khi đó bạn <em>SO SÁNH</em> hai mạch bằng cách so hai biểu thức — rẻ hơn nhiều so với so hai bản vẽ.</li>
<li><strong>Công dụng 2 — THIẾT KẾ.</strong> "Cho trước một hàm mong muốn, đại số Boole giúp dựng ra một hiện thực ĐÃ RÚT GỌN của hàm đó." Đây là câu đáng tiền nhất chương: <em>rút gọn</em> nghĩa là ít cổng hơn, tức ít silicon hơn, ít điện hơn, ít trễ hơn. Slide 14 và 16 sẽ báo giá chênh lệch đó cho bạn bằng số cổng.</li>
<li><strong>Vì sao đại số hai giá trị KHÔNG phải là hạn chế.</strong> Một sợi dây hoặc mang điện áp trên ngưỡng, hoặc dưới ngưỡng. Không có trạng thái thứ ba nào để mô hình hoá, nên đại số hai giá trị không phải là XẤP XỈ của phần cứng — nó là mô tả CHÍNH XÁC. Chính sự chính xác đó cho phép CHỨNG MINH mạch đúng, và cũng là lý do những phép kiểm bằng máy trong bài này làm được.</li>
</ul>
<p class="meo">💡 Nhớ cặp tên theo việc họ làm: <strong>Boole cho cái đại số (1854), Shannon cho cái sơ đồ dây (1937)</strong>. Đề thi rất thích hỏi ai làm cái nào.</p>
<p class="pitfall">⚠️ Đừng lẫn đại số Boole với đại số thường. Ở đây <code>A + A = A</code> và <code>1 + 1 = 1</code>. Dấu <code>+</code> nghĩa là OR, không phải phép cộng. Năm nào cũng có sinh viên mất điểm vì "rút gọn" <code>A + A</code> thành <code>2A</code>.</p>`],

      [3, 'Table 12.2 — Correspondence Between Boolean Algebra and Operations on Sets',
        `<p class="y-chinh">🎯 The slide puts Boolean operations and set operations side by side, because they are <strong>the same structure wearing two costumes</strong>. If you already understand union and intersection from discrete maths, you already understand OR and AND.</p>
<table>
<tr><th>Boolean function</th><th>Boolean description (slide)</th><th>Set function</th><th>Set description (slide)</th></tr>
<tr><td>A AND B</td><td>1 if and only if A and B are 1</td><td>A ∩ B</td><td>Set of elements that belong to both A and B (intersection)</td></tr>
<tr><td>A OR B</td><td>1 if A or B or both are 1; 0 if both A and B are 0</td><td>A ∪ B</td><td>Set of elements that belong to A or B or both (union)</td></tr>
<tr><td><strong>NOT A</strong> (slide misprints this as "A OR B")</td><td>1 if and only if A is 0</td><td>A'</td><td>Set of elements not in A (complement of A)</td></tr>
</table>
<ul>
<li><strong>Read the third row carefully — the slide has a typo.</strong> Its Function cell says "A OR B", but the description says "1 if and only if A is 0" and the Sets column shows the complement. The row is <strong>NOT A</strong>. This is a misprint in the official deck, not a subtlety you are missing. Report it as an error if an exam quotes it.</li>
<li><strong>"1 if and only if" is doing real work in row 1.</strong> AND is 1 in exactly one of four cases. That is what makes an AND gate a <em>detector</em> of one specific input pattern — and that is precisely how the SOP method on slide 14 works: one AND gate per row of the truth table that outputs 1.</li>
<li><strong>Row 2 spells out the inclusive OR.</strong> "A or B <em>or both</em>". Everyday Vietnamese and English "or" is often exclusive ("tea or coffee"); Boolean OR is not. The exclusive one has its own gate — XOR, slide 5.</li>
<li><strong>Why the analogy is worth keeping.</strong> Set identities you already know transfer straight across: De Morgan's law for sets, (A ∪ B)' = A' ∩ B', becomes (A + B)' = A'·B'. Slide 8 lists it in Boolean form; you can sanity-check it by drawing two circles.</li>
<li><strong>And it is why the next two slides are Venn diagrams.</strong> Figure 12.1 and 12.2 shade regions instead of filling truth tables. Same information, different eye.</li>
</ul>
<p class="pitfall">⚠️ The correspondence is with <strong>sets over a universe</strong>, not with arithmetic. The complement A' only makes sense relative to the box drawn around the circles — which is exactly the universal set, i.e. the value 1.</p>`,
        `<p class="y-chinh">🎯 Slide đặt phép toán Boole cạnh phép toán tập hợp, vì chúng là <strong>CÙNG một cấu trúc khoác hai bộ đồ</strong>. Nếu bạn đã hiểu hợp và giao từ toán rời rạc thì bạn đã hiểu OR và AND rồi.</p>
<table>
<tr><th>Hàm Boole</th><th>Mô tả Boole (theo slide)</th><th>Hàm tập hợp</th><th>Mô tả tập hợp (theo slide)</th></tr>
<tr><td>A AND B</td><td>Bằng 1 khi và chỉ khi A và B đều bằng 1</td><td>A ∩ B</td><td>Tập các phần tử thuộc CẢ A lẫn B (giao)</td></tr>
<tr><td>A OR B</td><td>Bằng 1 nếu A hoặc B hoặc cả hai bằng 1; bằng 0 nếu cả hai đều 0</td><td>A ∪ B</td><td>Tập các phần tử thuộc A hoặc B hoặc cả hai (hợp)</td></tr>
<tr><td><strong>NOT A</strong> (slide in NHẦM thành "A OR B")</td><td>Bằng 1 khi và chỉ khi A bằng 0</td><td>A'</td><td>Tập các phần tử KHÔNG thuộc A (phần bù của A)</td></tr>
</table>
<ul>
<li><strong>Đọc kỹ dòng thứ ba — slide có lỗi in.</strong> Ô Function của nó ghi "A OR B", nhưng phần mô tả lại là "1 khi và chỉ khi A bằng 0" và cột Sets vẽ phần bù. Dòng đó là <strong>NOT A</strong>. Đây là LỖI IN trong bộ slide chính hãng, không phải một tinh tế nào bạn chưa thấy. Nếu đề thi trích đúng ô này thì cứ nêu ra là sai.</li>
<li><strong>Chữ "khi và chỉ khi" ở dòng 1 không phải để làm cảnh.</strong> AND bằng 1 ở ĐÚNG một trong bốn trường hợp. Chính điều đó biến cổng AND thành một cái <em>MÁY DÒ</em> một mẫu đầu vào cụ thể — và đó chính xác là cách phương pháp SOP ở slide 14 hoạt động: mỗi dòng bảng chân trị cho ra 1 thì cắm một cổng AND.</li>
<li><strong>Dòng 2 nói rõ OR là "hoặc" BAO HÀM.</strong> "A hoặc B <em>hoặc cả hai</em>". Chữ "hoặc" trong tiếng Việt đời thường thường mang nghĩa loại trừ ("trà hay cà phê"); OR của Boole thì không. Loại loại trừ có cổng riêng — XOR, slide 5.</li>
<li><strong>Vì sao nên giữ phép tương ứng này.</strong> Mọi đẳng thức tập hợp bạn đã biết chuyển thẳng sang: luật De Morgan cho tập hợp, (A ∪ B)' = A' ∩ B', trở thành (A + B)' = A'·B'. Slide 8 liệt kê nó ở dạng Boole; bạn kiểm lại bằng cách vẽ hai vòng tròn là xong.</li>
<li><strong>Và đó là lý do hai slide sau là sơ đồ Venn.</strong> Figure 12.1 và 12.2 TÔ MÀU vùng thay vì điền bảng chân trị. Cùng một lượng thông tin, khác con mắt nhìn.</li>
</ul>
<p class="pitfall">⚠️ Phép tương ứng là với <strong>TẬP HỢP TRÊN MỘT KHÔNG GIAN NỀN</strong>, không phải với số học. Phần bù A' chỉ có nghĩa khi có cái khung chữ nhật vẽ quanh mấy vòng tròn — đó chính là tập vũ trụ, tức là giá trị 1.</p>`],

      [4, 'Boolean Variables and Operations — the three primitives and their precedence',
        `<p class="y-chinh">🎯 The slide fixes the vocabulary: Boolean algebra <strong>makes use of variables and operations, and both are logical</strong>. A variable takes the value <strong>1 (TRUE)</strong> or <strong>0 (FALSE)</strong> — nothing else — and the basic operations are <strong>AND, OR and NOT</strong>.</p>
<ul>
<li><strong>Exactly three operations are "basic".</strong> Everything else in the chapter — NAND, NOR, XOR, XNOR, adders, multiplexers — is built from these three. Slide 10 goes one better and builds all three from NAND alone.</li>
<li><strong>AND</strong> — "yields true (binary value 1) if and only if both of its operands are true". Written <code>A · B</code>.</li>
<li><strong>Precedence rule, and it is examinable.</strong> "In the absence of parentheses the AND operation <strong>takes precedence over</strong> the OR operation." So <code>A + B · C</code> means <code>A + (B · C)</code>, never <code>(A + B) · C</code>. This is the same habit as arithmetic, where × binds tighter than +, which is why AND is drawn as a product and OR as a sum.</li>
<li><strong>Notation shortcut.</strong> "When no ambiguity will occur the AND operation is represented by <em>simple concatenation</em> instead of the dot operator" — so <code>AB</code> is <code>A · B</code>. Every expression later in this chapter uses that shorthand.</li>
<li><strong>OR</strong> — "yields true if either or both of its operands are true". Written <code>A + B</code>. <strong>NOT</strong> — "inverts the value of its operand". Written <code>A'</code> here (a prime), or with an overbar on the printed slides. Since this page has no LaTeX, <strong>every complement in this lesson is written with a prime: A' reads "NOT A"</strong>.</li>
<li><strong>Why the product/sum names stick.</strong> A term like <code>A'BC</code> is called a <em>product term</em> and <code>A + B + C</code> a <em>sum term</em>; slides 14 and 15 are literally titled "sum of products" and "product of sums". If you keep thinking "AND = multiply, OR = add" the titles decode themselves.</li>
</ul>
<table>
<tr><th>Expression</th><th>Read as</th><th>Value when A=1, B=0, C=1</th></tr>
<tr><td><code>A + BC</code></td><td>A OR (B AND C)</td><td>1 + (0·1) = 1 + 0 = <strong>1</strong></td></tr>
<tr><td><code>(A + B)C</code></td><td>(A OR B) AND C</td><td>(1+0)·1 = 1·1 = <strong>1</strong></td></tr>
<tr><td><code>A'B + AB'</code></td><td>(NOT A AND B) OR (A AND NOT B)</td><td>(0·0) + (1·1) = <strong>1</strong> — this is XOR</td></tr>
</table>
<p class="pitfall">⚠️ <code>A' + B'</code> and <code>(A + B)'</code> are <strong>different functions</strong>. Try A=1, B=0: the first is 0 + 1 = 1, the second is (1)' = 0. Mixing them up is the single most common Boolean mistake; De Morgan on slide 8 is the rule that keeps you honest.</p>`,
        `<p class="y-chinh">🎯 Slide chốt từ vựng: đại số Boole <strong>dùng BIẾN và PHÉP TOÁN, và cả hai đều mang tính LOGIC</strong>. Một biến nhận giá trị <strong>1 (TRUE)</strong> hoặc <strong>0 (FALSE)</strong> — không còn gì khác — và các phép toán cơ bản là <strong>AND, OR và NOT</strong>.</p>
<ul>
<li><strong>Đúng BA phép được gọi là "cơ bản".</strong> Mọi thứ còn lại của chương — NAND, NOR, XOR, XNOR, bộ cộng, bộ dồn kênh — đều dựng từ ba phép này. Slide 10 còn chơi lớn hơn: dựng cả ba CHỈ từ NAND.</li>
<li><strong>AND</strong> — "cho TRUE (giá trị nhị phân 1) KHI VÀ CHỈ KHI cả hai toán hạng đều true". Viết <code>A · B</code>.</li>
<li><strong>Luật độ ưu tiên, và nó có trong đề.</strong> "Khi không có dấu ngoặc thì phép AND <strong>ƯU TIÊN HƠN</strong> phép OR." Vậy <code>A + B · C</code> nghĩa là <code>A + (B · C)</code>, KHÔNG BAO GIỜ là <code>(A + B) · C</code>. Đây đúng thói quen của số học, nơi × chặt hơn +, và cũng là lý do người ta vẽ AND như phép nhân, OR như phép cộng.</li>
<li><strong>Lối viết tắt.</strong> "Khi không gây nhập nhằng, phép AND được biểu diễn bằng cách <em>VIẾT LIỀN</em> thay cho dấu chấm" — nên <code>AB</code> chính là <code>A · B</code>. Mọi biểu thức về sau trong chương đều dùng lối tắt này.</li>
<li><strong>OR</strong> — "cho true nếu một trong hai hoặc cả hai toán hạng là true". Viết <code>A + B</code>. <strong>NOT</strong> — "đảo giá trị của toán hạng". Ở đây viết <code>A'</code> (dấu phẩy trên), còn trên slide in thì là gạch trên. Vì trang này không có LaTeX, <strong>mọi dấu phủ định trong bài viết bằng dấu phẩy trên: A' đọc là "NOT A"</strong>.</li>
<li><strong>Vì sao cái tên "tích"/"tổng" dính chặt.</strong> Một hạng như <code>A'BC</code> gọi là <em>SỐ HẠNG TÍCH</em> (product term), còn <code>A + B + C</code> là <em>SỐ HẠNG TỔNG</em> (sum term); slide 14 và 15 có tiêu đề đúng chữ "tổng các tích" và "tích các tổng". Cứ nghĩ "AND = nhân, OR = cộng" thì mấy cái tiêu đề tự giải mã.</li>
</ul>
<table>
<tr><th>Biểu thức</th><th>Đọc là</th><th>Giá trị khi A=1, B=0, C=1</th></tr>
<tr><td><code>A + BC</code></td><td>A OR (B AND C)</td><td>1 + (0·1) = 1 + 0 = <strong>1</strong></td></tr>
<tr><td><code>(A + B)C</code></td><td>(A OR B) AND C</td><td>(1+0)·1 = 1·1 = <strong>1</strong></td></tr>
<tr><td><code>A'B + AB'</code></td><td>(NOT A AND B) OR (A AND NOT B)</td><td>(0·0) + (1·1) = <strong>1</strong> — đây chính là XOR</td></tr>
</table>
<p class="pitfall">⚠️ <code>A' + B'</code> và <code>(A + B)'</code> là <strong>HAI HÀM KHÁC NHAU</strong>. Thử A=1, B=0: cái đầu là 0 + 1 = 1, cái sau là (1)' = 0. Nhầm hai cái này là lỗi Boole phổ biến số một; luật De Morgan ở slide 8 chính là cái giữ cho bạn khỏi sai.</p>`],

      [5, 'Table 12.1 — Boolean Operators (two-input truth table + extension to many inputs)',
        `<p class="y-chinh">🎯 <strong>The single most important table of the chapter.</strong> Part (a) gives every two-input operator on all four input combinations; part (b) says what each operator means when you widen it past two inputs. Learn (a) by heart — everything else can be rebuilt from it.</p>
<table>
<tr><th>A</th><th>B</th><th>NOT A (A')</th><th>A AND B (A·B)</th><th>A OR B (A+B)</th><th>A NAND B ((A·B)')</th><th>A NOR B ((A+B)')</th><th>A XOR B (A ⊕ B)</th><th>A XNOR B ((A ⊕ B)')</th></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
</table>
<ul>
<li><strong>The XNOR column is NOT on the slide.</strong> Table 12.1(a) prints six functions only: NOT, AND, OR, NAND, NOR, XOR. XNOR is added here because exams ask for it and because it is the equality detector: XNOR = 1 exactly when A and B are the same. Know that it is extra.</li>
<li><strong>NAND and NOR are the inverted columns.</strong> NAND is AND flipped bit for bit; NOR is OR flipped. That is the whole definition — and it is why their symbols on slide 9 are the AND/OR symbols with a small circle (the "bubble") on the output.</li>
<li><strong>Part (b), the many-input rules, in the slide's own words.</strong> <code>A·B·…</code> outputs 1 if <em>all</em> of the set {A, B, …} are 1. <code>A+B+…</code> outputs 1 if <em>any</em> are 1. <code>(A·B·…)'</code> — NAND — outputs 1 if <em>any</em> of the set are <strong>0</strong>. <code>(A+B+…)'</code> — NOR — outputs 1 if <em>all</em> are <strong>0</strong>. And <code>A ⊕ B ⊕ …</code> — XOR — outputs 1 if the set contains an <strong>odd number of ones</strong>.</li>
<li><strong>That XOR rule is the one people get wrong.</strong> Three-input XOR is <em>not</em> "exactly one input is 1"; it is "an odd number of inputs is 1", so 1⊕1⊕1 = 1. This is exactly why XOR is the parity function, and why the sum bit of a full adder (slide 13) is a three-input XOR.</li>
<li><strong>Two-input shortcuts worth memorising.</strong> XOR = "are they different?" · XNOR = "are they the same?" · NAND = "is at least one of them 0?" · NOR = "are both 0?". Phrased as questions, they stop being symbols and start being sensors.</li>
</ul>
<p class="dap-an">✅ Machine check: all seven columns above were regenerated in Python from the definitions (<code>a&amp;b</code>, <code>a|b</code>, <code>1-(a&amp;b)</code>, <code>1-(a|b)</code>, <code>a^b</code>, <code>1-(a^b)</code>) and match the slide's six columns row for row.</p>
<p class="meo">💡 Fast way to reproduce the table under exam pressure: write A and B as 0011 / 0101 down the columns (that is just counting 0,1,2,3 in binary). Then AND = 0001, OR = 0111, XOR = 0110 — and NAND/NOR/XNOR are those three with every bit flipped.</p>`,
        `<p class="y-chinh">🎯 <strong>Bảng quan trọng nhất của cả chương.</strong> Phần (a) cho mọi phép hai đầu vào trên cả bốn tổ hợp; phần (b) nói mỗi phép mang nghĩa gì khi nới ra quá hai đầu vào. Học thuộc (a) — mọi thứ khác dựng lại được từ nó.</p>
<table>
<tr><th>A</th><th>B</th><th>NOT A (A')</th><th>A AND B (A·B)</th><th>A OR B (A+B)</th><th>A NAND B ((A·B)')</th><th>A NOR B ((A+B)')</th><th>A XOR B (A ⊕ B)</th><th>A XNOR B ((A ⊕ B)')</th></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
</table>
<ul>
<li><strong>Cột XNOR KHÔNG có trên slide.</strong> Table 12.1(a) chỉ in SÁU hàm: NOT, AND, OR, NAND, NOR, XOR. XNOR được thêm ở đây vì đề thi có hỏi, và vì nó là máy dò BẰNG NHAU: XNOR = 1 đúng khi A và B giống nhau. Nhớ rằng đó là phần bổ sung.</li>
<li><strong>NAND và NOR là hai cột bị ĐẢO.</strong> NAND là AND lật từng bit; NOR là OR lật từng bit. Định nghĩa chỉ có thế — và đó là lý do ký hiệu của chúng ở slide 9 chính là ký hiệu AND/OR gắn thêm một vòng tròn nhỏ (cái "bong bóng") ở đầu ra.</li>
<li><strong>Phần (b), luật nhiều đầu vào, theo đúng chữ slide.</strong> <code>A·B·…</code> ra 1 nếu <em>TẤT CẢ</em> phần tử của {A, B, …} bằng 1. <code>A+B+…</code> ra 1 nếu <em>BẤT KỲ</em> phần tử nào bằng 1. <code>(A·B·…)'</code> — NAND — ra 1 nếu <em>BẤT KỲ</em> phần tử nào bằng <strong>0</strong>. <code>(A+B+…)'</code> — NOR — ra 1 nếu <em>TẤT CẢ</em> đều bằng <strong>0</strong>. Và <code>A ⊕ B ⊕ …</code> — XOR — ra 1 nếu tập chứa <strong>SỐ LẺ các số 1</strong>.</li>
<li><strong>Đúng cái luật XOR đó là chỗ người ta hay sai.</strong> XOR ba đầu vào KHÔNG phải "đúng một đầu vào bằng 1"; nó là "số đầu vào bằng 1 là số LẺ", nên 1⊕1⊕1 = 1. Chính vì vậy XOR là hàm kiểm chẵn lẻ (parity), và cũng vì vậy bit tổng của bộ cộng đầy đủ (slide 13) là một XOR ba đầu vào.</li>
<li><strong>Bốn câu tắt đáng thuộc.</strong> XOR = "hai cái có KHÁC nhau không?" · XNOR = "hai cái có GIỐNG nhau không?" · NAND = "có ít nhất một cái bằng 0 không?" · NOR = "cả hai đều bằng 0 chứ?". Đặt thành câu hỏi thì chúng thôi là ký hiệu, thành cái cảm biến.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng máy: cả bảy cột trên được sinh lại trong Python từ định nghĩa (<code>a&amp;b</code>, <code>a|b</code>, <code>1-(a&amp;b)</code>, <code>1-(a|b)</code>, <code>a^b</code>, <code>1-(a^b)</code>) và khớp từng dòng với sáu cột của slide.</p>
<p class="meo">💡 Cách dựng lại bảng thật nhanh lúc thi: viết A và B thành cột 0011 / 0101 (đó chỉ là đếm 0,1,2,3 ở hệ nhị phân). Rồi AND = 0001, OR = 0111, XOR = 0110 — còn NAND/NOR/XNOR là đúng ba cái đó lật ngược từng bit.</p>`],

      [6, 'Figure 12.1 — Basic Boolean Functions of Two Variables (Venn diagrams)',
        `<p class="y-chinh">🎯 The same six functions as Table 12.1, drawn instead of tabulated: two overlapping circles A and B inside a box, with the shaded region showing where the function is <strong>1</strong>. Six panels — NOT A, A AND B, A OR B, A XOR B, A NAND B, A NOR B.</p>
<table>
<tr><th>Panel</th><th>What is shaded green</th><th>Reads as</th></tr>
<tr><td><strong>NOT A</strong></td><td>Everything in the box <em>except</em> circle A (so B's crescent is shaded, the overlap is not)</td><td>A' — complement relative to the whole universe</td></tr>
<tr><td><strong>A AND B</strong></td><td>Only the lens where the two circles overlap</td><td>A·B</td></tr>
<tr><td><strong>A OR B</strong></td><td>Both circles entirely, overlap included</td><td>A+B</td></tr>
<tr><td><strong>A XOR B</strong></td><td>Both circles <em>minus</em> the overlap (two crescents)</td><td>AB' + A'B</td></tr>
<tr><td><strong>A NAND B</strong></td><td>Everything except the overlap — the box <em>and</em> the crescents, with the lens left white</td><td>(A·B)'</td></tr>
<tr><td><strong>A NOR B</strong></td><td>Only the corner region outside both circles</td><td>(A+B)'</td></tr>
</table>
<ul>
<li><strong>The box is not decoration — it is the value 1.</strong> Complement means "the rest of the box", so every shading question is answered by asking "what is left over?". That single habit makes De Morgan visually obvious: shade (A+B) then invert the picture, and what you get is exactly the intersection of the two <em>outsides</em>, i.e. A'B'.</li>
<li><strong>Compare AND with NAND, and OR with NOR, as photographic negatives.</strong> Put the two panels side by side and every green pixel becomes white. That is the whole content of the bubble on the gate symbol.</li>
<li><strong>XOR is the picture that explains its name.</strong> "Exclusive" OR excludes the overlap — the region where <em>both</em> are true. Everyday "or" in the sense of "one or the other but not both" is drawn right there.</li>
<li><strong>Why this figure earns a slide at all.</strong> Truth tables scale badly for human eyes, and this picture is the direct ancestor of the Karnaugh map on slide 17: a K-map is a Venn diagram redrawn on a grid so that adjacent regions differ in exactly one variable. Getting comfortable with shaded regions now pays off there.</li>
<li><strong>Link back to slide 3.</strong> These are the set operations of Table 12.2 with the sets drawn. Intersection = AND, union = OR, complement = NOT. Nothing new — a second view of the same object.</li>
</ul>
<p class="meo">💡 To check any Boolean identity in seconds without algebra: shade the left side, shade the right side, compare pictures. It works for every 2-variable and most 3-variable identities, and it is much faster than an 8-row table.</p>`,
        `<p class="y-chinh">🎯 Vẫn sáu hàm của Table 12.1, nhưng VẼ ra thay vì lập bảng: hai vòng tròn A và B chồng nhau trong một khung, vùng tô màu là chỗ hàm bằng <strong>1</strong>. Sáu ô — NOT A, A AND B, A OR B, A XOR B, A NAND B, A NOR B.</p>
<table>
<tr><th>Ô</th><th>Vùng được tô xanh</th><th>Đọc là</th></tr>
<tr><td><strong>NOT A</strong></td><td>Toàn bộ khung <em>TRỪ</em> vòng A (nên phần lưỡi liềm của B được tô, phần giao thì không)</td><td>A' — phần bù so với cả không gian nền</td></tr>
<tr><td><strong>A AND B</strong></td><td>Chỉ phần thấu kính nơi hai vòng chồng lên nhau</td><td>A·B</td></tr>
<tr><td><strong>A OR B</strong></td><td>Cả hai vòng, kể cả phần giao</td><td>A+B</td></tr>
<tr><td><strong>A XOR B</strong></td><td>Cả hai vòng <em>TRỪ</em> phần giao (hai lưỡi liềm)</td><td>AB' + A'B</td></tr>
<tr><td><strong>A NAND B</strong></td><td>Mọi thứ trừ phần giao — cả khung <em>lẫn</em> hai lưỡi liềm, chừa trắng đúng cái thấu kính</td><td>(A·B)'</td></tr>
<tr><td><strong>A NOR B</strong></td><td>Chỉ vùng bốn góc, nằm ngoài cả hai vòng</td><td>(A+B)'</td></tr>
</table>
<ul>
<li><strong>Cái khung KHÔNG phải để trang trí — nó là giá trị 1.</strong> Phần bù nghĩa là "phần còn lại của khung", nên mọi câu hỏi tô màu đều trả lời được bằng câu "còn thừa cái gì?". Chỉ một thói quen đó làm De Morgan hiện ra bằng mắt: tô (A+B) rồi lật ảnh, cái bạn nhận được đúng là phần giao của hai cái BÊN NGOÀI, tức A'B'.</li>
<li><strong>So AND với NAND, OR với NOR, như hai tấm phim âm bản.</strong> Đặt hai ô cạnh nhau thì mọi điểm xanh thành trắng. Đó là toàn bộ ý nghĩa của cái bong bóng trên ký hiệu cổng.</li>
<li><strong>XOR là bức tranh giải thích chính cái tên của nó.</strong> "Exclusive" OR LOẠI TRỪ phần giao — vùng mà <em>CẢ HAI</em> cùng đúng. Chữ "hoặc" đời thường theo nghĩa "cái này hoặc cái kia nhưng không cả hai" được vẽ ngay ở đó.</li>
<li><strong>Vì sao hình này đáng cả một slide.</strong> Bảng chân trị nở ra rất nhanh so với mắt người, còn bức tranh này là tổ tiên trực tiếp của bìa Karnaugh ở slide 17: bìa K chính là sơ đồ Venn vẽ lại trên lưới sao cho hai vùng KỀ NHAU khác nhau đúng một biến. Quen với vùng tô màu từ bây giờ thì tới đó đỡ nhiều.</li>
<li><strong>Nối ngược về slide 3.</strong> Đây là các phép tập hợp của Table 12.2 nhưng đã vẽ tập ra. Giao = AND, hợp = OR, bù = NOT. Không có gì mới — chỉ là cách nhìn thứ hai vào cùng một vật.</li>
</ul>
<p class="meo">💡 Muốn kiểm một đẳng thức Boole trong vài giây mà không cần đại số: tô vế trái, tô vế phải, so hai bức tranh. Cách này chạy cho mọi đẳng thức 2 biến và phần lớn đẳng thức 3 biến, nhanh hơn hẳn bảng 8 dòng.</p>`],

      [7, 'Figure 12.2 — Venn Diagram for Three Boolean Variables',
        `<p class="y-chinh">🎯 Three overlapping circles A, B and C inside a box, and the slide labels <strong>all eight regions with their three-bit codes</strong>: 000 in the corner outside every circle, then 100, 010, 001, 110, 101, 011, and 111 in the very centre. Eight regions for three variables — no coincidence.</p>
<table>
<tr><th>Label on the figure</th><th>Region</th><th>Product term (minterm)</th></tr>
<tr><td>000</td><td>Outside all three circles</td><td>A'B'C'</td></tr>
<tr><td>100</td><td>A only</td><td>AB'C'</td></tr>
<tr><td>010</td><td>B only</td><td>A'BC'</td></tr>
<tr><td>001</td><td>C only</td><td>A'B'C</td></tr>
<tr><td>110</td><td>A ∩ B, not C</td><td>ABC'</td></tr>
<tr><td>101</td><td>A ∩ C, not B</td><td>AB'C</td></tr>
<tr><td>011</td><td>B ∩ C, not A</td><td>A'BC</td></tr>
<tr><td>111</td><td>Centre — all three</td><td>ABC</td></tr>
</table>
<ul>
<li><strong>Count the regions: 2<sup>3</sup> = 8.</strong> n variables cut the plane into 2<sup>n</sup> regions, which is exactly the number of rows in an n-variable truth table. The picture and the table hold the same eight facts.</li>
<li><strong>Each region is one minterm, and minterms are the atoms of the chapter.</strong> A <em>minterm</em> is a product containing every variable exactly once, either plain or complemented. There are 2<sup>n</sup> of them, they are mutually exclusive (no two regions overlap), and together they fill the box.</li>
<li><strong>That is the entire theory behind sum-of-products.</strong> Any Boolean function whatsoever = a <em>set of regions</em> = the OR of the minterms of those regions. Slide 14 draws exactly that: one AND gate per shaded region, one OR gate to collect them.</li>
<li><strong>Why three variables is where Venn diagrams stop being useful.</strong> Four circles cannot be drawn so that all 16 regions appear. That failure is precisely why Karnaugh maps exist — a K-map keeps the "adjacent regions differ by one variable" property up to 4, 5 or 6 variables where circles cannot.</li>
<li><strong>Read the labels as binary counting.</strong> 000, 001, 010, 011, 100, 101, 110, 111 is just 0 through 7 — the row numbers of a three-variable truth table, and the <em>index</em> column you will meet again in Quine–McCluskey on slide 22.</li>
</ul>
<p class="meo">💡 Translating a label into a product term: a <strong>1</strong> means the plain variable, a <strong>0</strong> means the complemented one. So 101 → A · B' · C. Practise both directions — exams ask for them in either.</p>
<p class="pitfall">⚠️ Do not confuse a <em>minterm</em> (product, one per row that outputs 1, used in SOP) with a <em>maxterm</em> (sum, one per row that outputs 0, used in POS, slide 15). They use opposite conventions for which bit gets the prime — see slide 15 for the reversal.</p>`,
        `<p class="y-chinh">🎯 Ba vòng tròn A, B, C chồng nhau trong một khung, và slide dán nhãn <strong>cả TÁM vùng bằng mã ba bit</strong>: 000 ở góc ngoài mọi vòng, rồi 100, 010, 001, 110, 101, 011, và 111 ngay chính giữa. Tám vùng cho ba biến — không phải ngẫu nhiên.</p>
<table>
<tr><th>Nhãn trên hình</th><th>Vùng</th><th>Số hạng tích (minterm)</th></tr>
<tr><td>000</td><td>Ngoài cả ba vòng</td><td>A'B'C'</td></tr>
<tr><td>100</td><td>Chỉ thuộc A</td><td>AB'C'</td></tr>
<tr><td>010</td><td>Chỉ thuộc B</td><td>A'BC'</td></tr>
<tr><td>001</td><td>Chỉ thuộc C</td><td>A'B'C</td></tr>
<tr><td>110</td><td>A ∩ B, không thuộc C</td><td>ABC'</td></tr>
<tr><td>101</td><td>A ∩ C, không thuộc B</td><td>AB'C</td></tr>
<tr><td>011</td><td>B ∩ C, không thuộc A</td><td>A'BC</td></tr>
<tr><td>111</td><td>Tâm — thuộc cả ba</td><td>ABC</td></tr>
</table>
<ul>
<li><strong>Đếm số vùng: 2<sup>3</sup> = 8.</strong> n biến cắt mặt phẳng thành 2<sup>n</sup> vùng, đúng bằng số dòng của bảng chân trị n biến. Bức tranh và cái bảng giữ cùng tám sự kiện.</li>
<li><strong>Mỗi vùng là MỘT minterm, và minterm là nguyên tử của cả chương.</strong> <em>Minterm</em> là một tích chứa MỌI biến đúng một lần, ở dạng thường hoặc dạng bù. Có 2<sup>n</sup> cái, chúng loại trừ lẫn nhau (không vùng nào chồng vùng nào), và gộp lại thì lấp kín cái khung.</li>
<li><strong>Đó là toàn bộ lý thuyết đằng sau "tổng các tích".</strong> Bất kỳ hàm Boole nào = một <em>TẬP CÁC VÙNG</em> = phép OR các minterm của những vùng đó. Slide 14 vẽ đúng như vậy: mỗi vùng tô màu một cổng AND, một cổng OR gom lại.</li>
<li><strong>Vì sao đến ba biến là sơ đồ Venn hết dùng được.</strong> Không vẽ nổi bốn vòng tròn sao cho đủ 16 vùng hiện ra. Chính chỗ bí đó là lý do bìa Karnaugh ra đời — bìa K giữ được tính chất "hai vùng kề nhau khác đúng một biến" tới 4, 5, 6 biến, chỗ mà vòng tròn chịu thua.</li>
<li><strong>Đọc mấy cái nhãn như đang đếm nhị phân.</strong> 000, 001, 010, 011, 100, 101, 110, 111 chỉ là 0 đến 7 — số thứ tự dòng của bảng chân trị ba biến, và cũng là cột <em>Index</em> mà bạn sẽ gặp lại ở Quine–McCluskey, slide 22.</li>
</ul>
<p class="meo">💡 Đổi một nhãn thành số hạng tích: bit <strong>1</strong> nghĩa là biến ở dạng thường, bit <strong>0</strong> nghĩa là biến ở dạng bù. Vậy 101 → A · B' · C. Luyện cả hai chiều — đề thi hỏi theo chiều nào cũng có.</p>
<p class="pitfall">⚠️ Đừng lẫn <em>minterm</em> (tích, mỗi dòng cho ra 1 một cái, dùng cho SOP) với <em>maxterm</em> (tổng, mỗi dòng cho ra 0 một cái, dùng cho POS, slide 15). Hai loại dùng quy ước NGƯỢC NHAU về việc bit nào được gắn dấu phẩy — xem slide 15.</p>`],

      [8, 'Table 12.3 — Basic Identities of Boolean Algebra',
        `<p class="y-chinh">🎯 The <strong>rulebook</strong>. Every simplification in the rest of the chapter is one of these lines applied in one direction. The slide groups them as Basic Postulates (commutative, distributive, identity, inverse) and Other Identities (including associative laws and De Morgan's theorem).</p>
<table>
<tr><th>Law</th><th>AND form (product)</th><th>OR form (sum)</th></tr>
<tr><td><strong>Commutative</strong></td><td>A · B = B · A</td><td>A + B = B + A</td></tr>
<tr><td><strong>Distributive</strong></td><td>A · (B + C) = (A·B) + (A·C)</td><td>A + (B · C) = (A+B) · (A+C)</td></tr>
<tr><td><strong>Identity element</strong></td><td>1 · A = A</td><td>0 + A = A</td></tr>
<tr><td><strong>Inverse element</strong></td><td>A · A' = 0</td><td>A + A' = 1</td></tr>
<tr><td><strong>Null / dominance</strong></td><td>0 · A = 0</td><td>1 + A = 1</td></tr>
<tr><td><strong>Idempotent</strong></td><td>A · A = A</td><td>A + A = A</td></tr>
<tr><td><strong>Associative</strong></td><td>A · (B · C) = (A·B) · C</td><td>A + (B + C) = (A+B) + C</td></tr>
<tr><td><strong>De Morgan</strong></td><td>(A · B)' = A' + B'</td><td>(A + B)' = A' · B'</td></tr>
<tr><td><strong>Absorption</strong> (not on the slide, but standard and examinable)</td><td>A · (A + B) = A</td><td>A + (A · B) = A</td></tr>
</table>
<p class="nhan">Proof of De Morgan by truth table — both forms at once:</p>
<table>
<tr><th>A</th><th>B</th><th>A·B</th><th>(A·B)'</th><th>A'+B'</th><th>A+B</th><th>(A+B)'</th><th>A'·B'</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td><strong>1</strong></td><td><strong>1</strong></td><td>0</td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
<tr><td>0</td><td>1</td><td>0</td><td><strong>1</strong></td><td><strong>1</strong></td><td>1</td><td><strong>0</strong></td><td><strong>0</strong></td></tr>
<tr><td>1</td><td>0</td><td>0</td><td><strong>1</strong></td><td><strong>1</strong></td><td>1</td><td><strong>0</strong></td><td><strong>0</strong></td></tr>
<tr><td>1</td><td>1</td><td>1</td><td><strong>0</strong></td><td><strong>0</strong></td><td>1</td><td><strong>0</strong></td><td><strong>0</strong></td></tr>
</table>
<p class="nhan">Proof of the OR-form distributive law A + BC = (A+B)(A+C) — the one that has no arithmetic analogue and so must be proved:</p>
<table>
<tr><th>A</th><th>B</th><th>C</th><th>BC</th><th>A + BC</th><th>A+B</th><th>A+C</th><th>(A+B)(A+C)</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td><strong>0</strong></td><td>0</td><td>0</td><td><strong>0</strong></td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><td><strong>0</strong></td><td>0</td><td>1</td><td><strong>0</strong></td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>0</td><td><strong>0</strong></td><td>1</td><td>0</td><td><strong>0</strong></td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>1</td><td><strong>1</strong></td><td>1</td><td>1</td><td><strong>1</strong></td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td><td><strong>1</strong></td><td>1</td><td>1</td><td><strong>1</strong></td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td><td><strong>1</strong></td><td>1</td><td>1</td><td><strong>1</strong></td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>0</td><td><strong>1</strong></td><td>1</td><td>1</td><td><strong>1</strong></td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td><td><strong>1</strong></td><td>1</td><td>1</td><td><strong>1</strong></td></tr>
</table>
<ul>
<li><strong>Duality is the trick that halves your memorisation.</strong> Swap every AND with OR and every 0 with 1, and a true identity stays true. That is why the table has two columns: the right column is the <em>dual</em> of the left, always.</li>
<li><strong>The distributive law in its OR form is the genuinely surprising one.</strong> In ordinary arithmetic 2 + (3×4) is not (2+3)×(2+4). In Boolean algebra it holds — the eight-row table above is the proof, and it is a favourite exam item precisely because intuition from arithmetic gets it wrong.</li>
<li><strong>De Morgan is the workhorse.</strong> It is how you push a complement <em>inward</em> through an expression, and it is the whole reason a NAND-only circuit (slide 24) can implement an AND-OR circuit. Say it as a sentence: "break the bar, change the sign".</li>
<li><strong>The identity you will actually use most is not on the slide:</strong> <code>A + A'B = A + B</code>. Machine-verified here. Proof: A + A'B = (A+A')(A+B) = 1·(A+B) = A+B, using the OR-form distributive law you just proved.</li>
<li><strong>Warning about this slide's rendering.</strong> In the converted deck, Table 12.3 appears as a large box with several illegible shrunken copies of itself overlaid. That is a layout fault in the original .pptx conversion, not missing content — the full, correct table is reproduced above.</li>
</ul>
<p class="dap-an">✅ Machine check: all fourteen identities above (both De Morgan forms, both distributive forms, both absorption forms, commutative, associative, identity, inverse, null, idempotent, plus A + A'B = A + B and XOR = AB' + A'B) were verified in Python by enumerating all 2<sup>n</sup> combinations and comparing the two sides row by row. 14/14 hold with no exceptions.</p>
<p class="pitfall">⚠️ There is no "subtraction" and no "division" in Boolean algebra. From <code>A + B = A + C</code> you may <strong>not</strong> conclude B = C (take A = 1). Cancelling terms is the fastest way to a wrong answer in this chapter.</p>`,
        `<p class="y-chinh">🎯 <strong>Cuốn luật</strong>. Mọi phép rút gọn trong phần còn lại của chương đều là MỘT dòng trong bảng này, áp theo một chiều nào đó. Slide xếp chúng thành Basic Postulates (giao hoán, phân phối, phần tử đơn vị, phần tử nghịch đảo) và Other Identities (gồm kết hợp và định lý De Morgan).</p>
<table>
<tr><th>Định luật</th><th>Dạng AND (tích)</th><th>Dạng OR (tổng)</th></tr>
<tr><td><strong>Giao hoán</strong></td><td>A · B = B · A</td><td>A + B = B + A</td></tr>
<tr><td><strong>Phân phối</strong></td><td>A · (B + C) = (A·B) + (A·C)</td><td>A + (B · C) = (A+B) · (A+C)</td></tr>
<tr><td><strong>Phần tử đơn vị</strong></td><td>1 · A = A</td><td>0 + A = A</td></tr>
<tr><td><strong>Phần tử bù</strong></td><td>A · A' = 0</td><td>A + A' = 1</td></tr>
<tr><td><strong>Phần tử nuốt</strong></td><td>0 · A = 0</td><td>1 + A = 1</td></tr>
<tr><td><strong>Luỹ đẳng</strong></td><td>A · A = A</td><td>A + A = A</td></tr>
<tr><td><strong>Kết hợp</strong></td><td>A · (B · C) = (A·B) · C</td><td>A + (B + C) = (A+B) + C</td></tr>
<tr><td><strong>De Morgan</strong></td><td>(A · B)' = A' + B'</td><td>(A + B)' = A' · B'</td></tr>
<tr><td><strong>Hấp thụ</strong> (không in trên slide, nhưng chuẩn và có trong đề)</td><td>A · (A + B) = A</td><td>A + (A · B) = A</td></tr>
</table>
<p class="nhan">Chứng minh De Morgan bằng bảng chân trị — cả hai dạng cùng lúc:</p>
<table>
<tr><th>A</th><th>B</th><th>A·B</th><th>(A·B)'</th><th>A'+B'</th><th>A+B</th><th>(A+B)'</th><th>A'·B'</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td><strong>1</strong></td><td><strong>1</strong></td><td>0</td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
<tr><td>0</td><td>1</td><td>0</td><td><strong>1</strong></td><td><strong>1</strong></td><td>1</td><td><strong>0</strong></td><td><strong>0</strong></td></tr>
<tr><td>1</td><td>0</td><td>0</td><td><strong>1</strong></td><td><strong>1</strong></td><td>1</td><td><strong>0</strong></td><td><strong>0</strong></td></tr>
<tr><td>1</td><td>1</td><td>1</td><td><strong>0</strong></td><td><strong>0</strong></td><td>1</td><td><strong>0</strong></td><td><strong>0</strong></td></tr>
</table>
<p class="nhan">Chứng minh luật phân phối dạng OR: A + BC = (A+B)(A+C) — cái KHÔNG có bản tương ứng trong số học nên bắt buộc phải chứng minh:</p>
<table>
<tr><th>A</th><th>B</th><th>C</th><th>BC</th><th>A + BC</th><th>A+B</th><th>A+C</th><th>(A+B)(A+C)</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td><strong>0</strong></td><td>0</td><td>0</td><td><strong>0</strong></td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><td><strong>0</strong></td><td>0</td><td>1</td><td><strong>0</strong></td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>0</td><td><strong>0</strong></td><td>1</td><td>0</td><td><strong>0</strong></td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>1</td><td><strong>1</strong></td><td>1</td><td>1</td><td><strong>1</strong></td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td><td><strong>1</strong></td><td>1</td><td>1</td><td><strong>1</strong></td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td><td><strong>1</strong></td><td>1</td><td>1</td><td><strong>1</strong></td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>0</td><td><strong>1</strong></td><td>1</td><td>1</td><td><strong>1</strong></td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td><td><strong>1</strong></td><td>1</td><td>1</td><td><strong>1</strong></td></tr>
</table>
<ul>
<li><strong>Tính đối ngẫu là mẹo cắt đôi lượng phải nhớ.</strong> Đổi mọi AND thành OR và mọi 0 thành 1 thì một đẳng thức đúng vẫn đúng. Đó là lý do bảng có hai cột: cột phải LUÔN là <em>đối ngẫu</em> của cột trái.</li>
<li><strong>Luật phân phối dạng OR mới là cái thật sự bất ngờ.</strong> Trong số học thường, 2 + (3×4) KHÔNG bằng (2+3)×(2+4). Trong đại số Boole thì đúng — bảng tám dòng ở trên là chứng minh, và đây là món khoái khẩu của đề thi, chính vì trực giác từ số học dẫn người ta đi sai.</li>
<li><strong>De Morgan là con ngựa kéo cày.</strong> Nó là cách đẩy dấu phủ định <em>VÀO TRONG</em> biểu thức, và là toàn bộ lý do một mạch chỉ toàn NAND (slide 24) làm được việc của mạch AND-OR. Đọc thành câu: "phá gạch trên thì đổi dấu phép".</li>
<li><strong>Đẳng thức bạn dùng nhiều nhất lại KHÔNG có trên slide:</strong> <code>A + A'B = A + B</code>. Đã kiểm bằng máy ở đây. Chứng minh: A + A'B = (A+A')(A+B) = 1·(A+B) = A+B, dùng đúng luật phân phối dạng OR vừa chứng minh xong.</li>
<li><strong>Cảnh báo về cách hiển thị của slide này.</strong> Trong bản chuyển đổi, Table 12.3 hiện ra thành một khung lớn có vài bản thu nhỏ không đọc nổi của CHÍNH NÓ nằm đè lên. Đó là lỗi bố cục của khâu chuyển .pptx, không phải thiếu nội dung — bảng đầy đủ và đúng đã chép lại ở trên.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng máy: cả mười bốn đẳng thức ở trên (hai dạng De Morgan, hai dạng phân phối, hai dạng hấp thụ, giao hoán, kết hợp, đơn vị, bù, nuốt, luỹ đẳng, cộng thêm A + A'B = A + B và XOR = AB' + A'B) đã được kiểm trong Python bằng cách duyệt đủ 2<sup>n</sup> tổ hợp rồi so hai vế từng dòng. 14/14 đúng, không ngoại lệ nào.</p>
<p class="pitfall">⚠️ Đại số Boole KHÔNG có phép trừ và KHÔNG có phép chia. Từ <code>A + B = A + C</code> bạn <strong>KHÔNG</strong> được suy ra B = C (thử A = 1). Rút gọn kiểu "giản ước hai vế" là con đường nhanh nhất tới đáp án sai trong chương này.</p>`],

      [9, 'Figure 12.3 — Basic Logic Gates (symbol, algebraic function, truth table)',
        `<p class="y-chinh">🎯 The figure is a four-column catalogue — <strong>Name · Graphical Symbol · Algebraic Function · Truth Table</strong> — for the six gates you will draw for the rest of your degree: AND, OR, NOT, NAND, NOR, XOR.</p>
<table>
<tr><th>Gate</th><th>Shape of the symbol (described in words)</th><th>Algebraic function on the slide</th><th>Output is 1 when…</th></tr>
<tr><td><strong>AND</strong></td><td>Flat back, half-round nose (like a capital D)</td><td>F = A · B, or F = AB</td><td>both inputs are 1</td></tr>
<tr><td><strong>OR</strong></td><td>Curved back, pointed nose (a shield)</td><td>F = A + B</td><td>at least one input is 1</td></tr>
<tr><td><strong>NOT</strong></td><td>Triangle with a small circle on the tip</td><td>F = A' (drawn with an overbar on the slide)</td><td>the input is 0</td></tr>
<tr><td><strong>NAND</strong></td><td>AND shape + bubble on the output</td><td>F = (AB)'</td><td>at least one input is 0</td></tr>
<tr><td><strong>NOR</strong></td><td>OR shape + bubble on the output</td><td>F = (A+B)'</td><td>both inputs are 0</td></tr>
<tr><td><strong>XOR</strong></td><td>OR shape with a second curved line across the back</td><td>F = A ⊕ B</td><td>the inputs differ</td></tr>
</table>
<p class="nhan">The truth tables exactly as the figure prints them:</p>
<table>
<tr><th>A</th><th>B</th><th>AND</th><th>OR</th><th>NAND</th><th>NOR</th><th>XOR</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
</table>
<p class="nhan">NOT has a one-input table of its own: A = 0 → F = 1, A = 1 → F = 0.</p>
<ul>
<li><strong>The bubble is the whole notation.</strong> A small circle anywhere on a gate symbol means "invert this signal here". Put it on the output of AND and you have NAND; on the tip of a triangle and you have NOT. Once you read bubbles as complements, unfamiliar symbols decode themselves.</li>
<li><strong>Gates are not restricted to two inputs.</strong> The slide draws two, but a real AND gate may have three, four or eight; the rule from Table 12.1(b) applies — the output is 1 only if <em>all</em> inputs are 1. A 3-input AND appears on slide 14.</li>
<li><strong>Typical implementation cost, for context.</strong> In CMOS a NAND or NOR gate takes 4 transistors, while AND = NAND + inverter = 6. That is the physical reason the chapter keeps converting AND-OR designs into NAND-only designs: the "inverting" gates are the cheap and fast ones, and the polite-looking AND/OR gates are built out of them anyway.</li>
<li><strong>Every gate here is memoryless.</strong> Output depends only on the inputs present <em>right now</em>. That is the defining property of the combinational circuits on slide 12, and it is exactly what stops being true on slide 39 when flip-flops arrive.</li>
<li><strong>Connect to CSI106.</strong> When you wrote a bitmask expression like <code>x &amp; 0xF0</code> or <code>x ^ y</code> in a programming course, the processor executed it in a row of these gates — one gate per bit position, all 32 or 64 of them firing in parallel. That is why a bitwise AND on a 64-bit register costs the same as on a 1-bit value.</li>
</ul>
<p class="meo">💡 Drawing tip that saves marks: <strong>AND has a flat-ish D shape, OR has a pointed nose.</strong> Examiners accept a rough drawing but not an ambiguous one — make the nose clearly pointed or clearly round, and never forget the bubble on NAND/NOR.</p>`,
        `<p class="y-chinh">🎯 Hình này là một cuốn danh mục bốn cột — <strong>Tên · Ký hiệu · Hàm đại số · Bảng chân trị</strong> — cho sáu cổng mà bạn sẽ còn vẽ suốt cả khoá học: AND, OR, NOT, NAND, NOR, XOR.</p>
<table>
<tr><th>Cổng</th><th>Hình dáng ký hiệu (tả bằng chữ)</th><th>Hàm đại số trên slide</th><th>Đầu ra bằng 1 khi…</th></tr>
<tr><td><strong>AND</strong></td><td>Lưng phẳng, mũi tròn nửa vòng (giống chữ D in hoa)</td><td>F = A · B, hoặc F = AB</td><td>cả hai đầu vào đều bằng 1</td></tr>
<tr><td><strong>OR</strong></td><td>Lưng cong, mũi nhọn (như cái khiên)</td><td>F = A + B</td><td>có ít nhất một đầu vào bằng 1</td></tr>
<tr><td><strong>NOT</strong></td><td>Tam giác có vòng tròn nhỏ ở đỉnh</td><td>F = A' (trên slide vẽ bằng gạch trên)</td><td>đầu vào bằng 0</td></tr>
<tr><td><strong>NAND</strong></td><td>Hình AND + bong bóng ở đầu ra</td><td>F = (AB)'</td><td>có ít nhất một đầu vào bằng 0</td></tr>
<tr><td><strong>NOR</strong></td><td>Hình OR + bong bóng ở đầu ra</td><td>F = (A+B)'</td><td>cả hai đầu vào đều bằng 0</td></tr>
<tr><td><strong>XOR</strong></td><td>Hình OR có thêm một nét cong thứ hai ở lưng</td><td>F = A ⊕ B</td><td>hai đầu vào KHÁC nhau</td></tr>
</table>
<p class="nhan">Bảng chân trị đúng như hình in ra:</p>
<table>
<tr><th>A</th><th>B</th><th>AND</th><th>OR</th><th>NAND</th><th>NOR</th><th>XOR</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
</table>
<p class="nhan">NOT có bảng một đầu vào riêng: A = 0 → F = 1, A = 1 → F = 0.</p>
<ul>
<li><strong>Cái bong bóng chính là toàn bộ quy ước ký hiệu.</strong> Một vòng tròn nhỏ ở bất kỳ đâu trên ký hiệu cổng nghĩa là "đảo tín hiệu tại đây". Đặt nó ở đầu ra của AND thì thành NAND; đặt ở đỉnh tam giác thì thành NOT. Một khi đọc bong bóng là phép bù, mọi ký hiệu lạ tự giải mã.</li>
<li><strong>Cổng KHÔNG bị giới hạn hai đầu vào.</strong> Slide vẽ hai, nhưng cổng AND thật có thể ba, bốn, tám đầu vào; luật ở Table 12.1(b) vẫn áp — đầu ra bằng 1 chỉ khi <em>TẤT CẢ</em> đầu vào bằng 1. Cổng AND ba đầu vào xuất hiện ngay ở slide 14.</li>
<li><strong>Giá hiện thực điển hình, để có bối cảnh.</strong> Trong CMOS, một cổng NAND hay NOR tốn 4 transistor, còn AND = NAND + bộ đảo = 6. Đó là lý do VẬT LÝ khiến chương này cứ chuyển thiết kế AND-OR thành thiết kế toàn NAND: mấy cổng "đảo" mới là loại rẻ và nhanh, còn AND/OR trông lịch sự thì đằng nào cũng dựng từ chúng.</li>
<li><strong>Mọi cổng ở đây đều KHÔNG CÓ NHỚ.</strong> Đầu ra chỉ phụ thuộc đầu vào có mặt <em>NGAY LÚC NÀY</em>. Đó là tính chất định nghĩa của mạch tổ hợp ở slide 12, và cũng đúng là thứ hết đúng từ slide 39 khi flip-flop xuất hiện.</li>
<li><strong>Nối sang CSI106.</strong> Khi bạn viết biểu thức mặt nạ bit như <code>x &amp; 0xF0</code> hay <code>x ^ y</code> ở môn lập trình, bộ xử lý thực hiện nó bằng một HÀNG những cổng này — mỗi vị trí bit một cổng, cả 32 hay 64 cái nổ cùng lúc. Đó là lý do phép AND bit trên thanh ghi 64 bit tốn đúng bằng trên một giá trị 1 bit.</li>
</ul>
<p class="meo">💡 Mẹo vẽ cứu điểm: <strong>AND có dáng chữ D lưng phẳng, OR có mũi NHỌN.</strong> Giám khảo chấp nhận hình vẽ tay xấu nhưng không chấp nhận hình nhập nhằng — hãy vẽ mũi nhọn hẳn hoặc tròn hẳn, và đừng bao giờ quên bong bóng của NAND/NOR.</p>`],

      [10, 'Figure 12.4 — Some Uses of NAND Gates (NAND is a universal gate)',
        `<p class="y-chinh">🎯 Three small diagrams that together prove the single most quotable fact of the chapter: <strong>NAND alone can build every Boolean function.</strong> The figure shows NOT, AND and OR each made out of nothing but NAND gates.</p>
<table>
<tr><th>Panel</th><th>Wiring shown on the slide</th><th>Algebra</th><th>Why it works</th></tr>
<tr><td><strong>NOT</strong></td><td>A single NAND with both inputs tied to A</td><td>(A·A)' = A'</td><td>Idempotent law: A·A = A, so the NAND reduces to a plain complement</td></tr>
<tr><td><strong>AND</strong></td><td>NAND(A,B) feeding a second NAND used as an inverter</td><td>((A·B)')' = A·B</td><td>Double complement cancels — the slide even labels the middle wire (A·B)'</td></tr>
<tr><td><strong>OR</strong></td><td>A through a NAND-inverter to give A', B through another to give B', both into a third NAND</td><td>(A' · B')' = A + B</td><td>De Morgan, read right to left</td></tr>
</table>
<p class="nhan">Bonus that exams love — XOR from exactly four NAND gates. Let <code>N = (A·B)'</code>. Then <code>A ⊕ B = ((A·N)' · (B·N)')'</code>.</p>
<ul>
<li><strong>"Universal" has a precise meaning.</strong> A gate is universal if {that gate} alone suffices to realise NOT, AND and OR — because those three suffice for everything (slide 4). NAND passes the test, and the third panel of this figure <em>is</em> the proof of the hardest of the three.</li>
<li><strong>The OR panel is pure De Morgan.</strong> (A+B) = (A+B)'' = (A'·B')'. Read the diagram against that line and every wire has a name: the two inverters produce A' and B', and the final NAND supplies the outer complement.</li>
<li><strong>Why manufacturers care.</strong> A chip built from one repeated cell is cheaper to design, verify and fabricate than one with six different cells. Whole logic families were sold as "quad 2-input NAND" packages for exactly this reason, and modern standard-cell libraries still weight NAND/NOR as the cheapest gates.</li>
<li><strong>The cost you pay is depth, not impossibility.</strong> An AND that was one gate becomes two; an OR becomes three. Since delay is counted in <em>levels of gates</em>, a NAND-only design can be slower unless you convert smartly — which is exactly what slide 24 does, converting a two-level AND-OR circuit into a two-level NAND circuit with no added depth at all.</li>
<li><strong>Exam phrasing to expect.</strong> "Show that NAND is a functionally complete set" or "implement F = AB + C using NAND gates only". The answer is always the same recipe: express F in sum-of-products, then replace every AND and the final OR with NANDs (slide 24 shows why that substitution is free).</li>
</ul>
<p class="dap-an">✅ Machine check: <code>NOT A = NAND(A,A)</code> · <code>A·B = NAND(NAND(A,B), NAND(A,B))</code> · <code>A+B = NAND(NAND(A,A), NAND(B,B))</code> · <code>(A+B)' = NAND</code> of that last result with itself · <code>A ⊕ B</code> from the four-NAND network above — all five verified in Python over every input combination. 5/5 exact.</p>
<p class="pitfall">⚠️ Tying both inputs of a NAND together gives NOT. Tying them together on an <em>AND</em> gate gives you A back, which is useless. The trick only works because NAND is the inverting one.</p>`,
        `<p class="y-chinh">🎯 Ba sơ đồ nhỏ, gộp lại là chứng minh cho sự thật đáng trích dẫn nhất chương: <strong>chỉ riêng NAND đã dựng được mọi hàm Boole.</strong> Hình vẽ NOT, AND và OR, mỗi cái làm hoàn toàn bằng cổng NAND.</p>
<table>
<tr><th>Sơ đồ</th><th>Cách nối trên slide</th><th>Đại số</th><th>Vì sao chạy</th></tr>
<tr><td><strong>NOT</strong></td><td>Một cổng NAND, hai đầu vào cùng nối vào A</td><td>(A·A)' = A'</td><td>Luật luỹ đẳng: A·A = A, nên NAND thu về đúng phép bù</td></tr>
<tr><td><strong>AND</strong></td><td>NAND(A,B) đưa vào một NAND thứ hai dùng làm bộ đảo</td><td>((A·B)')' = A·B</td><td>Hai lần bù triệt tiêu nhau — slide còn ghi nhãn dây giữa là (A·B)'</td></tr>
<tr><td><strong>OR</strong></td><td>A qua một NAND-đảo cho A', B qua cái khác cho B', cả hai vào NAND thứ ba</td><td>(A' · B')' = A + B</td><td>De Morgan, đọc từ phải sang trái</td></tr>
</table>
<p class="nhan">Phần thưởng mà đề thi rất ưa — XOR từ ĐÚNG bốn cổng NAND. Đặt <code>N = (A·B)'</code>. Khi đó <code>A ⊕ B = ((A·N)' · (B·N)')'</code>.</p>
<ul>
<li><strong>Chữ "đầy đủ" (universal) có nghĩa chính xác.</strong> Một cổng là đầy đủ nếu CHỈ riêng nó đủ để dựng NOT, AND và OR — vì ba cái đó đủ cho mọi thứ (slide 4). NAND qua bài kiểm, và ô thứ ba của hình này CHÍNH LÀ chứng minh cho cái khó nhất trong ba.</li>
<li><strong>Ô OR thuần tuý là De Morgan.</strong> (A+B) = (A+B)'' = (A'·B')'. Đọc sơ đồ theo đúng dòng đó thì mọi sợi dây đều có tên: hai bộ đảo cho ra A' và B', cổng NAND cuối cung cấp dấu bù bên ngoài.</li>
<li><strong>Vì sao nhà sản xuất quan tâm.</strong> Một con chip dựng từ MỘT loại ô lặp lại thì rẻ hơn hẳn — rẻ khi thiết kế, khi kiểm chứng, khi chế tạo — so với con chip có sáu loại ô khác nhau. Cả những họ logic từng được bán dưới dạng gói "quad 2-input NAND" đúng vì lý do này, và thư viện standard-cell hiện đại vẫn tính NAND/NOR là cổng rẻ nhất.</li>
<li><strong>Cái giá phải trả là ĐỘ SÂU, không phải sự bất khả.</strong> Một cổng AND thành hai; một OR thành ba. Vì độ trễ đếm theo <em>SỐ TẦNG CỔNG</em>, thiết kế toàn NAND có thể chậm hơn NẾU chuyển đổi ngây thơ — và đúng chỗ đó slide 24 giải quyết: nó chuyển mạch AND-OR hai tầng thành mạch NAND hai tầng mà KHÔNG thêm một tầng nào.</li>
<li><strong>Câu hỏi thi hay gặp.</strong> "Chứng minh NAND là tập hàm đầy đủ" hoặc "hiện thực F = AB + C chỉ bằng cổng NAND". Đáp án luôn cùng một công thức nấu: viết F ở dạng tổng các tích, rồi thay mọi cổng AND và cổng OR cuối bằng NAND (slide 24 cho thấy vì sao phép thay đó MIỄN PHÍ).</li>
</ul>
<p class="dap-an">✅ Kiểm bằng máy: <code>NOT A = NAND(A,A)</code> · <code>A·B = NAND(NAND(A,B), NAND(A,B))</code> · <code>A+B = NAND(NAND(A,A), NAND(B,B))</code> · <code>(A+B)' = NAND</code> của kết quả trên với chính nó · <code>A ⊕ B</code> từ mạng bốn NAND ở trên — cả năm đều kiểm đúng trong Python trên mọi tổ hợp đầu vào. 5/5 chính xác.</p>
<p class="pitfall">⚠️ Nối chập hai đầu vào của NAND thì được NOT. Nối chập hai đầu vào của cổng <em>AND</em> thì chỉ được lại chính A, vô dụng. Mẹo này chạy được CHỈ VÌ NAND là cổng có đảo.</p>`],

      [11, 'Figure 12.5 — Some Uses of NOR Gates (NOR is universal too)',
        `<p class="y-chinh">🎯 The mirror image of slide 10: three diagrams showing <strong>NOT, OR and AND all built from NOR gates alone</strong>. NOR is the second universal gate — and the pairing is not a coincidence, it is duality (slide 8) made physical.</p>
<table>
<tr><th>Panel</th><th>Wiring shown on the slide</th><th>Algebra</th><th>Law used</th></tr>
<tr><td><strong>NOT</strong></td><td>One NOR with both inputs tied to A</td><td>(A + A)' = A'</td><td>Idempotent: A + A = A</td></tr>
<tr><td><strong>OR</strong></td><td>NOR(A,B) into a second NOR used as an inverter; the slide labels the middle wire (A+B)'</td><td>((A+B)')' = A + B</td><td>Double complement</td></tr>
<tr><td><strong>AND</strong></td><td>A through a NOR-inverter to give A', B likewise to give B', both into a third NOR</td><td>(A' + B')' = A · B</td><td>De Morgan</td></tr>
</table>
<ul>
<li><strong>Compare the two slides side by side and you have learned duality.</strong> Figure 12.4 makes AND cheaply and OR expensively; Figure 12.5 does exactly the reverse. Swap every AND with OR in one figure and you get the other. That is the duality principle from Table 12.3 showing up as two different chip families.</li>
<li><strong>NAND and NOR are the <em>only</em> two universal single gates among the standard set.</strong> AND alone cannot do it (no way to produce a 0→1 inversion), nor can OR, nor XOR. Being able to say <em>why</em> — because none of them can invert — is worth a mark.</li>
<li><strong>Which one does industry pick?</strong> In CMOS, NAND is usually preferred: its series transistors are the fast n-type ones, while NOR puts slow p-type transistors in series. So NAND-based libraries dominate even though NOR is equally universal in theory. Theory says "either"; physics says "NAND".</li>
<li><strong>Where NOR shows up anyway.</strong> Slide 41 builds the S–R latch — the first memory element in the whole course — out of two cross-coupled <strong>NOR</strong> gates. So this slide is not an academic curiosity; it is the gate you meet again when the chapter turns to sequential circuits.</li>
<li><strong>Same cost pattern as NAND.</strong> OR costs two NORs, AND costs three. A product-of-sums design (slide 15) converts to NOR-only with no extra depth, exactly as SOP converts to NAND-only. Pick the gate that matches the form you already have.</li>
</ul>
<p class="dap-an">✅ Machine check: <code>NOT A = NOR(A,A)</code> · <code>A+B = NOR(NOR(A,B), NOR(A,B))</code> · <code>A·B = NOR(NOR(A,A), NOR(B,B))</code> — all three verified in Python over every input combination. 3/3 exact.</p>
<p class="meo">💡 Memory hook: <strong>"NAND likes products, NOR likes sums."</strong> If your expression is already SOP, convert it to NAND; if it is already POS, convert it to NOR. Doing it the other way round costs you extra inverters for nothing.</p>`,
        `<p class="y-chinh">🎯 Ảnh soi gương của slide 10: ba sơ đồ cho thấy <strong>NOT, OR và AND đều dựng được chỉ bằng cổng NOR</strong>. NOR là cổng đầy đủ thứ hai — và việc chúng đi thành cặp không phải ngẫu nhiên, đó là tính ĐỐI NGẪU (slide 8) hiện thành phần cứng.</p>
<table>
<tr><th>Sơ đồ</th><th>Cách nối trên slide</th><th>Đại số</th><th>Luật đã dùng</th></tr>
<tr><td><strong>NOT</strong></td><td>Một NOR, hai đầu vào cùng nối vào A</td><td>(A + A)' = A'</td><td>Luỹ đẳng: A + A = A</td></tr>
<tr><td><strong>OR</strong></td><td>NOR(A,B) đưa vào NOR thứ hai làm bộ đảo; slide ghi nhãn dây giữa là (A+B)'</td><td>((A+B)')' = A + B</td><td>Hai lần bù</td></tr>
<tr><td><strong>AND</strong></td><td>A qua NOR-đảo cho A', B tương tự cho B', cả hai vào NOR thứ ba</td><td>(A' + B')' = A · B</td><td>De Morgan</td></tr>
</table>
<ul>
<li><strong>Đặt hai slide cạnh nhau là bạn đã học xong tính đối ngẫu.</strong> Figure 12.4 làm AND rẻ và OR đắt; Figure 12.5 làm ngược lại y hệt. Đổi mọi AND thành OR trong một hình thì ra hình kia. Đó là nguyên lý đối ngẫu của Table 12.3 hiện ra thành hai họ chip khác nhau.</li>
<li><strong>NAND và NOR là HAI cổng đơn đầy đủ DUY NHẤT trong bộ chuẩn.</strong> Riêng AND thì không làm được (không có cách nào tạo ra phép đảo 0→1), OR cũng không, XOR cũng không. Nói được <em>VÌ SAO</em> — vì không cổng nào trong số đó đảo được — là ăn điểm.</li>
<li><strong>Công nghiệp chọn cái nào?</strong> Trong CMOS người ta thường chuộng NAND: chuỗi transistor mắc nối tiếp của nó là loại n nhanh, còn NOR lại mắc nối tiếp loại p chậm. Nên thư viện dựa trên NAND chiếm ưu thế dù về lý thuyết NOR đầy đủ ngang bằng. Lý thuyết nói "cái nào cũng được"; vật lý nói "NAND".</li>
<li><strong>Nhưng NOR vẫn có chỗ của nó.</strong> Slide 41 dựng chốt S–R — phần tử NHỚ đầu tiên của cả môn — bằng hai cổng <strong>NOR</strong> nối chéo nhau. Vậy slide này không phải chuyện lý thuyết suông; nó là cái cổng bạn gặp lại khi chương chuyển sang mạch tuần tự.</li>
<li><strong>Cùng một kiểu chi phí như NAND.</strong> OR tốn hai NOR, AND tốn ba. Một thiết kế tích các tổng (slide 15) chuyển sang toàn NOR mà không thêm tầng nào, y hệt cách SOP chuyển sang toàn NAND. Hãy chọn cổng khớp với DẠNG mà bạn đang có sẵn.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng máy: <code>NOT A = NOR(A,A)</code> · <code>A+B = NOR(NOR(A,B), NOR(A,B))</code> · <code>A·B = NOR(NOR(A,A), NOR(B,B))</code> — cả ba kiểm đúng trong Python trên mọi tổ hợp đầu vào. 3/3 chính xác.</p>
<p class="meo">💡 Câu nhớ: <strong>"NAND hợp với TÍCH, NOR hợp với TỔNG."</strong> Biểu thức đang ở dạng SOP thì chuyển sang NAND; đang ở dạng POS thì chuyển sang NOR. Làm ngược lại chỉ tốn thêm bộ đảo mà chẳng được gì.</p>`],

      [12, 'Combinational Circuit — the definition that governs slides 12 to 38',
        `<p class="y-chinh">🎯 The slide's definition, word for word: <strong>an interconnected set of gates whose output at any time is a function only of the input at that time</strong>. Four bullets fill that out — and one word inside it, "only", is what separates this half of the chapter from the flip-flop half.</p>
<table>
<tr><th>The slide says</th><th>What it commits you to</th></tr>
<tr><td>Output at any time is a function <strong>only</strong> of the input at that time</td><td>No memory. Same inputs → same outputs, every time, forever. No history is retained.</td></tr>
<tr><td>The appearance of the input is followed <strong>almost immediately</strong> by the appearance of the output, <strong>with only gate delays</strong></td><td>Speed is bounded by how many gates a signal must pass through — the "levels" count that slide 14 and slide 24 keep tallying</td></tr>
<tr><td>Consists of <strong>n binary inputs and m binary outputs</strong></td><td>It is a function from {0,1}<sup>n</sup> to {0,1}<sup>m</sup>. Nothing more exotic.</td></tr>
<tr><td>Can be defined in <strong>three ways</strong>: truth table · graphical symbols · Boolean equations</td><td>The three-way equivalence this whole chapter drills you on</td></tr>
</table>
<ul>
<li><strong>The three definitions in the slide's own words.</strong> <em>Truth table</em>: "for each of the 2<sup>n</sup> possible combinations of input signals, the binary value of each of the m output signals is listed". <em>Graphical symbols</em>: "the interconnected layout of gates is depicted". <em>Boolean equations</em>: "each output signal is expressed as a Boolean function of its input signals".</li>
<li><strong>Note the asymmetry in cost between the three.</strong> The truth table is the easiest to write from a specification and the most expensive to build (2<sup>n</sup> rows — a 16-input circuit would need 65 536 of them). The equation is compact but not unique. The diagram is what you actually fabricate. The chapter is one long argument about how to get from the first to the third cheaply.</li>
<li><strong>2<sup>n</sup> rows, and m independent columns.</strong> A circuit with several outputs is just several one-output circuits sharing inputs — that is exactly what slide 20's incrementer is, four functions W, X, Y, Z over the same four inputs, each minimised separately on its own Karnaugh map.</li>
<li><strong>"Only gate delays" is the performance model of the whole chapter.</strong> There is no clock here; the circuit settles as fast as electrons allow. Delay = (number of gate levels) × (delay per gate). That formula is what makes the two-level SOP form so attractive and what makes ripple-carry addition (slide 24) so slow.</li>
<li><strong>What is excluded, and why it matters.</strong> No feedback loops. The moment you wire an output back to an input, the circuit can remember, and it stops being combinational — that is slide 39 onward. Slide 32 makes the same point from the other side by calling combinational circuits "memoryless" and using that to argue ROM is one.</li>
</ul>
<p class="meo">💡 One-line test for an exam: <strong>if you can build a truth table for it, it is combinational.</strong> If the answer to "what does it output for input 0101?" is "it depends on what came before", it is sequential.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa của slide, đúng từng chữ: <strong>một tập các cổng nối với nhau mà đầu ra tại bất kỳ thời điểm nào CHỈ là hàm của đầu vào tại chính thời điểm đó</strong>. Bốn gạch đầu dòng nói rõ thêm — và một chữ nằm trong đó, chữ "CHỈ", là thứ tách nửa này của chương khỏi nửa flip-flop.</p>
<table>
<tr><th>Slide nói</th><th>Điều đó ràng buộc bạn vào cái gì</th></tr>
<tr><td>Đầu ra tại mọi thời điểm là hàm <strong>CHỈ CỦA</strong> đầu vào tại thời điểm đó</td><td>KHÔNG có nhớ. Cùng đầu vào → cùng đầu ra, mọi lần, mãi mãi. Không lưu lại lịch sử nào.</td></tr>
<tr><td>Đầu vào xuất hiện thì đầu ra xuất hiện <strong>gần như tức thì</strong>, <strong>chỉ chậm bằng độ trễ cổng</strong></td><td>Tốc độ bị chặn bởi số cổng mà tín hiệu phải đi qua — chính con số "số tầng" mà slide 14 và slide 24 cứ đếm đi đếm lại</td></tr>
<tr><td>Gồm <strong>n đầu vào nhị phân và m đầu ra nhị phân</strong></td><td>Nó là một hàm từ {0,1}<sup>n</sup> sang {0,1}<sup>m</sup>. Không có gì kỳ bí hơn.</td></tr>
<tr><td>Có thể định nghĩa theo <strong>BA CÁCH</strong>: bảng chân trị · ký hiệu hình vẽ · phương trình Boole</td><td>Đúng thế tương đương ba chiều mà cả chương này bắt bạn luyện</td></tr>
</table>
<ul>
<li><strong>Ba cách định nghĩa, theo đúng chữ slide.</strong> <em>Bảng chân trị</em>: "với mỗi trong 2<sup>n</sup> tổ hợp tín hiệu vào có thể có, liệt kê giá trị nhị phân của từng tín hiệu ra trong m tín hiệu". <em>Ký hiệu hình vẽ</em>: "vẽ ra cách bố trí và nối các cổng". <em>Phương trình Boole</em>: "mỗi tín hiệu ra được biểu diễn thành hàm Boole của các tín hiệu vào".</li>
<li><strong>Để ý ba cách đó LỆCH NHAU về chi phí.</strong> Bảng chân trị dễ viết nhất từ bản đặc tả và đắt nhất khi dựng (2<sup>n</sup> dòng — mạch 16 đầu vào cần 65 536 dòng). Phương trình gọn nhưng không duy nhất. Sơ đồ mới là thứ đem đi chế tạo. Cả chương này là một lập luận dài về cách đi từ cái thứ nhất tới cái thứ ba cho RẺ.</li>
<li><strong>2<sup>n</sup> dòng, và m cột ĐỘC LẬP.</strong> Mạch nhiều đầu ra chỉ là nhiều mạch một đầu ra dùng chung đầu vào — đúng là bộ tăng ở slide 20: bốn hàm W, X, Y, Z trên cùng bốn đầu vào, mỗi hàm rút gọn RIÊNG trên bìa Karnaugh của nó.</li>
<li><strong>"Chỉ chậm bằng độ trễ cổng" là mô hình hiệu năng của cả chương.</strong> Ở đây không có đồng hồ; mạch ổn định nhanh nhất theo mức điện tử cho phép. Độ trễ = (số TẦNG cổng) × (độ trễ mỗi cổng). Chính công thức đó làm dạng SOP hai tầng hấp dẫn đến thế, và cũng làm phép cộng ripple-carry (slide 24) chậm đến thế.</li>
<li><strong>Cái bị loại trừ, và vì sao nó quan trọng.</strong> Không có vòng hồi tiếp. Ngay khi bạn nối một đầu ra ngược về đầu vào, mạch có khả năng NHỚ, và nó thôi là mạch tổ hợp — đó là từ slide 39 trở đi. Slide 32 nói lại đúng ý này từ phía kia, khi gọi mạch tổ hợp là mạch "không nhớ" rồi lấy đó lập luận rằng ROM là một mạch tổ hợp.</li>
</ul>
<p class="meo">💡 Phép thử một dòng cho phòng thi: <strong>lập được bảng chân trị cho nó thì nó là mạch tổ hợp.</strong> Nếu câu trả lời cho "đầu vào 0101 thì ra gì?" là "còn tuỳ trước đó là gì" thì đó là mạch tuần tự.</p>`],

      [13, 'Table 12.4 — A Boolean Function of Three Variables (the running design example)',
        `<p class="y-chinh">🎯 One small truth table that the next four slides all refer back to. Three inputs A, B, C; one output D. This is <strong>design problem #1</strong>, and we will carry it from table to SOP to POS to a minimised two-gate circuit.</p>
<table>
<tr><th>Row</th><th>A</th><th>B</th><th>C</th><th>D (output)</th><th>Minterm if D = 1</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>—</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>—</td></tr>
<tr><td>2</td><td>0</td><td>1</td><td>0</td><td><strong>1</strong></td><td>A'BC'</td></tr>
<tr><td>3</td><td>0</td><td>1</td><td>1</td><td><strong>1</strong></td><td>A'BC</td></tr>
<tr><td>4</td><td>1</td><td>0</td><td>0</td><td>0</td><td>—</td></tr>
<tr><td>5</td><td>1</td><td>0</td><td>1</td><td>0</td><td>—</td></tr>
<tr><td>6</td><td>1</td><td>1</td><td>0</td><td><strong>1</strong></td><td>ABC'</td></tr>
<tr><td>7</td><td>1</td><td>1</td><td>1</td><td>0</td><td>—</td></tr>
</table>
<p class="nhan">Step 1 of the design procedure — read off the sum of products. One product term per row with output 1, then OR them:</p>
<p><code>D = A'BC' + A'BC + ABC'</code></p>
<ul>
<li><strong>The rule for writing a minterm.</strong> For a row, write each variable plain if its value is 1 and complemented if its value is 0. Row 2 is A=0, B=1, C=0 → A'BC'. It is worth saying out loud <em>why</em> this works: that product equals 1 for exactly that row and 0 everywhere else, so OR-ing the chosen rows reproduces the column exactly.</li>
<li><strong>Every Boolean function can be written this way.</strong> That is the guarantee behind the whole method: there is always a solution, it is mechanical, and it never requires cleverness. The only question left is whether it is <em>small</em> — which is the rest of the chapter.</li>
<li><strong>The four-step design procedure this table starts.</strong> (1) truth table from the specification → (2) SOP expression → (3) simplify (algebra, Karnaugh map or Quine–McCluskey) → (4) draw the gate diagram. Slides 14, 15, 16, 17 and 24 are steps 2, 2', 3 and 4 for this very table.</li>
</ul>
<p class="nhan">Design problem #3 — <strong>the adder</strong>, worked in full here because it is the classic three-variable exercise. (Fair warning: the adder's own slides are 35–38, in part B. This is the book's Table 12.10, not Table 12.4.)</p>
<p class="nhan">Half adder — two inputs, no carry in:</p>
<table>
<tr><th>A</th><th>B</th><th>SUM</th><th>CARRY</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td></tr>
</table>
<p>SOP: <code>SUM = A'B + AB' = A ⊕ B</code> and <code>CARRY = A·B</code>. Two gates. Done.</p>
<p class="nhan">Full adder — three inputs, because a real column of an addition receives a carry from the column to its right:</p>
<table>
<tr><th>Cin</th><th>A</th><th>B</th><th>SUM</th><th>Cout</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
</table>
<p>SOP straight from the table: <code>SUM = Cin'A'B + Cin'AB' + CinA'B' + CinAB</code> — four product terms, which simplifies to <code>SUM = A ⊕ B ⊕ Cin</code> (SUM = 1 when an odd number of inputs is 1 — the parity rule from slide 5). And <code>Cout = AB + ACin + BCin</code>, the "at least two of the three" majority function.</p>
<p class="dap-an">✅ Machine check: D's SOP equals the Table 12.4 column on all 8 rows. SUM's four-term SOP equals A ⊕ B ⊕ Cin on all 8 rows, and Cout = AB + ACin + BCin equals the table on all 8 rows. Verified in Python.</p>
<p class="pitfall">⚠️ The row order in a truth table is a convention (A is the most significant bit, counting 000 up to 111), but the <em>function</em> is not. If an exam gives the rows shuffled, sort them first — Karnaugh maps assume the standard order and will give nonsense otherwise.</p>`,
        `<p class="y-chinh">🎯 Một bảng chân trị nhỏ mà bốn slide sau đều quay về tham chiếu. Ba đầu vào A, B, C; một đầu ra D. Đây là <strong>bài thiết kế số 1</strong>, và ta sẽ dẫn nó đi trọn từ bảng → SOP → POS → mạch hai cổng đã rút gọn.</p>
<table>
<tr><th>Dòng</th><th>A</th><th>B</th><th>C</th><th>D (đầu ra)</th><th>Minterm nếu D = 1</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>—</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>—</td></tr>
<tr><td>2</td><td>0</td><td>1</td><td>0</td><td><strong>1</strong></td><td>A'BC'</td></tr>
<tr><td>3</td><td>0</td><td>1</td><td>1</td><td><strong>1</strong></td><td>A'BC</td></tr>
<tr><td>4</td><td>1</td><td>0</td><td>0</td><td>0</td><td>—</td></tr>
<tr><td>5</td><td>1</td><td>0</td><td>1</td><td>0</td><td>—</td></tr>
<tr><td>6</td><td>1</td><td>1</td><td>0</td><td><strong>1</strong></td><td>ABC'</td></tr>
<tr><td>7</td><td>1</td><td>1</td><td>1</td><td>0</td><td>—</td></tr>
</table>
<p class="nhan">Bước 1 của quy trình thiết kế — đọc ra tổng các tích. Mỗi dòng có đầu ra 1 cho một số hạng tích, rồi OR chúng lại:</p>
<p><code>D = A'BC' + A'BC + ABC'</code></p>
<ul>
<li><strong>Luật viết một minterm.</strong> Với một dòng, viết biến ở dạng THƯỜNG nếu giá trị của nó là 1, dạng BÙ nếu giá trị là 0. Dòng 2 là A=0, B=1, C=0 → A'BC'. Đáng nói to lên <em>VÌ SAO</em> nó chạy: tích đó bằng 1 tại ĐÚNG dòng ấy và bằng 0 ở mọi dòng khác, nên OR các dòng đã chọn thì dựng lại đúng cái cột.</li>
<li><strong>MỌI hàm Boole đều viết được theo cách này.</strong> Đó là bảo đảm đứng sau cả phương pháp: luôn luôn có lời giải, nó máy móc, và không bao giờ đòi hỏi sự thông minh. Câu hỏi còn lại chỉ là nó có <em>NHỎ</em> không — mà đó là phần còn lại của chương.</li>
<li><strong>Quy trình thiết kế bốn bước mà bảng này mở màn.</strong> (1) bảng chân trị từ bản đặc tả → (2) biểu thức SOP → (3) rút gọn (đại số, bìa Karnaugh, hoặc Quine–McCluskey) → (4) vẽ sơ đồ cổng. Slide 14, 15, 16, 17 và 24 chính là bước 2, 2', 3 và 4 cho đúng cái bảng này.</li>
</ul>
<p class="nhan">Bài thiết kế số 3 — <strong>BỘ CỘNG</strong>, làm trọn ở đây vì nó là bài tập ba biến kinh điển. (Nói rõ: slide riêng của bộ cộng là 35–38, thuộc phần B. Đây là Table 12.10 của sách, không phải Table 12.4.)</p>
<p class="nhan">Bộ cộng bán phần (half adder) — hai đầu vào, không có nhớ vào:</p>
<table>
<tr><th>A</th><th>B</th><th>SUM (tổng)</th><th>CARRY (nhớ ra)</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td></tr>
</table>
<p>SOP: <code>SUM = A'B + AB' = A ⊕ B</code> và <code>CARRY = A·B</code>. Hai cổng. Xong.</p>
<p class="nhan">Bộ cộng đầy đủ (full adder) — ba đầu vào, vì một cột thật của phép cộng còn nhận nhớ từ cột bên phải:</p>
<table>
<tr><th>Cin</th><th>A</th><th>B</th><th>SUM</th><th>Cout</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
</table>
<p>SOP đọc thẳng từ bảng: <code>SUM = Cin'A'B + Cin'AB' + CinA'B' + CinAB</code> — bốn số hạng tích, rút gọn thành <code>SUM = A ⊕ B ⊕ Cin</code> (SUM = 1 khi số đầu vào bằng 1 là số LẺ — đúng luật chẵn lẻ ở slide 5). Và <code>Cout = AB + ACin + BCin</code>, tức hàm ĐA SỐ "ít nhất hai trong ba".</p>
<p class="dap-an">✅ Kiểm bằng máy: SOP của D khớp cột Table 12.4 trên cả 8 dòng. SOP bốn số hạng của SUM khớp A ⊕ B ⊕ Cin trên cả 8 dòng, và Cout = AB + ACin + BCin khớp bảng trên cả 8 dòng. Kiểm trong Python.</p>
<p class="pitfall">⚠️ Thứ tự dòng trong bảng chân trị là QUY ƯỚC (A là bit trọng số cao nhất, đếm từ 000 lên 111), nhưng <em>HÀM</em> thì không. Nếu đề cho các dòng bị xáo, hãy sắp lại trước — bìa Karnaugh giả định thứ tự chuẩn, không sắp lại thì ra kết quả vô nghĩa.</p>`],

      [14, 'Figure 12.6 — Sum-of-Products Implementation of Table 12.4',
        `<p class="y-chinh">🎯 The SOP expression from slide 13 turned into an actual drawing: <strong>three inverters, three 3-input AND gates, one 3-input OR gate</strong>. This is what "one product term per AND gate, one OR gate to collect them" looks like on paper.</p>
<table>
<tr><th>Element in the figure</th><th>Count</th><th>What it computes</th></tr>
<tr><td>Vertical input rails A, B, C with a NOT triangle on each</td><td>3 inverters</td><td>A', B', C' made available alongside A, B, C</td></tr>
<tr><td>Top AND gate</td><td>1</td><td>A'BC' — the "not A, yes B, not C" detector (row 2)</td></tr>
<tr><td>Middle AND gate</td><td>1</td><td>A'BC (row 3)</td></tr>
<tr><td>Bottom AND gate</td><td>1</td><td>ABC' (row 6)</td></tr>
<tr><td>OR gate on the right, output F</td><td>1</td><td>F = A'BC' + A'BC + ABC'</td></tr>
</table>
<ul>
<li><strong>Total: 7 gates (3 NOT + 3 AND + 1 OR), and exactly 2 levels of gates between an input and the output</strong> if you do not count the inverters, 3 if you do. That "2 levels" is the selling point of SOP: it is the fastest possible general form.</li>
<li><strong>Why the layout looks like a grid.</strong> Six vertical rails carry A, A', B, B', C, C' past every AND gate, and each AND simply taps the three rails it needs. This is not just a drawing convention — it is literally how a PLA is built (slide 53), and it is why any SOP function of n variables fits the same rectangular array.</li>
<li><strong>The general recipe, stated once.</strong> For any truth table: one AND gate per row whose output is 1, each AND fed by the plain or complemented form of every input according to that row, then one OR gate over all of them. No thinking required. That is a feature — it means a machine can do it, and machines do.</li>
<li><strong>The cost is proportional to the number of 1s in the output column.</strong> A function that is 1 on 40 of 64 rows needs 40 AND gates of 6 inputs each in raw SOP form. That is the pressure that makes slides 16–23 (simplification) worth the effort — and it is also why, for such a function, you would minimise the <em>complement</em> instead and invert at the end.</li>
<li><strong>Where you meet this shape again.</strong> The multiplexer on slide 27 is exactly this structure with the AND gates fed by select lines, and the ROM on slide 34 is this structure with the AND plane fixed and the OR plane programmed. SOP is not one technique among many; it is the shape of combinational hardware.</li>
</ul>
<p class="dap-an">✅ Machine check: the circuit above, evaluated gate by gate in Python over all 8 input combinations, reproduces column D of Table 12.4 exactly.</p>
<p class="pitfall">⚠️ Count the <em>levels</em>, not the gates, when a question asks about speed. Seven gates arranged in two levels are faster than three gates arranged in three levels. Gate count is area and power; level count is delay.</p>`,
        `<p class="y-chinh">🎯 Biểu thức SOP ở slide 13 biến thành một bản vẽ thật: <strong>ba bộ đảo, ba cổng AND 3 đầu vào, một cổng OR 3 đầu vào</strong>. Đây là hình hài trên giấy của câu "mỗi số hạng tích một cổng AND, một cổng OR gom lại".</p>
<table>
<tr><th>Thành phần trên hình</th><th>Số lượng</th><th>Nó tính cái gì</th></tr>
<tr><td>Ba đường ray đứng A, B, C, mỗi đường gắn một tam giác NOT</td><td>3 bộ đảo</td><td>Tạo sẵn A', B', C' bên cạnh A, B, C</td></tr>
<tr><td>Cổng AND trên cùng</td><td>1</td><td>A'BC' — máy dò "không A, có B, không C" (dòng 2)</td></tr>
<tr><td>Cổng AND giữa</td><td>1</td><td>A'BC (dòng 3)</td></tr>
<tr><td>Cổng AND dưới</td><td>1</td><td>ABC' (dòng 6)</td></tr>
<tr><td>Cổng OR bên phải, đầu ra F</td><td>1</td><td>F = A'BC' + A'BC + ABC'</td></tr>
</table>
<ul>
<li><strong>Tổng cộng: 7 cổng (3 NOT + 3 AND + 1 OR), và đúng 2 TẦNG cổng giữa một đầu vào và đầu ra</strong> nếu không tính bộ đảo, 3 tầng nếu tính. Con số "2 tầng" đó chính là điểm bán hàng của SOP: đây là dạng tổng quát NHANH NHẤT có thể.</li>
<li><strong>Vì sao bố cục trông như một cái lưới.</strong> Sáu đường ray đứng mang A, A', B, B', C, C' chạy ngang qua mọi cổng AND, và mỗi AND chỉ việc "móc" vào ba đường ray nó cần. Đây không chỉ là quy ước vẽ — nó đúng là cách người ta dựng một PLA (slide 53), và là lý do mọi hàm SOP n biến đều vừa vào cùng một mảng chữ nhật như vậy.</li>
<li><strong>Công thức nấu tổng quát, nói một lần.</strong> Với bảng chân trị bất kỳ: mỗi dòng có đầu ra 1 thì một cổng AND, cổng AND đó nhận dạng thường hoặc dạng bù của MỌI đầu vào theo đúng dòng ấy, rồi một cổng OR trùm lên tất cả. Không cần nghĩ. Đó là ƯU ĐIỂM — nghĩa là máy làm được, và máy đang làm thật.</li>
<li><strong>Chi phí tỉ lệ với SỐ SỐ 1 trong cột đầu ra.</strong> Một hàm bằng 1 ở 40 trong 64 dòng cần 40 cổng AND 6 đầu vào ở dạng SOP thô. Chính áp lực đó khiến slide 16–23 (rút gọn) đáng công — và cũng là lý do với một hàm như thế thì bạn nên rút gọn phần <em>BÙ</em> rồi đảo ở cuối.</li>
<li><strong>Bạn gặp lại hình hài này ở đâu.</strong> Bộ dồn kênh ở slide 27 đúng là cấu trúc này với các cổng AND được nuôi bằng đường chọn, còn ROM ở slide 34 là cấu trúc này với mặt phẳng AND cố định và mặt phẳng OR lập trình được. SOP không phải một kỹ thuật trong nhiều kỹ thuật; nó là HÌNH HÀI của phần cứng tổ hợp.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng máy: mạch trên, tính từng cổng một trong Python trên cả 8 tổ hợp đầu vào, dựng lại đúng y cột D của Table 12.4.</p>
<p class="pitfall">⚠️ Khi câu hỏi hỏi về TỐC ĐỘ thì hãy đếm <em>TẦNG</em>, đừng đếm cổng. Bảy cổng xếp thành hai tầng nhanh hơn ba cổng xếp thành ba tầng. Số cổng là diện tích và điện năng; số tầng mới là độ trễ.</p>`],

      [15, 'Figure 12.7 — Product-of-Sums Implementation of Table 12.4',
        `<p class="y-chinh">🎯 The same function built the opposite way round: <strong>five OR gates feeding one AND gate</strong>. Instead of listing where the function is 1, POS lists where it is 0 — and there are five such rows in Table 12.4.</p>
<p class="nhan">How to get there in three moves. (1) Write the SOP of the <em>complement</em>: the rows where D = 0 are 0, 1, 4, 5 and 7, so</p>
<p><code>D' = A'B'C' + A'B'C + AB'C' + AB'C + ABC</code></p>
<p class="nhan">(2) Complement both sides. (3) Apply De Morgan twice — once to break the big bar over the sum, once over each product:</p>
<p><code>D = (A+B+C)(A+B+C')(A'+B+C)(A'+B+C')(A'+B'+C')</code></p>
<table>
<tr><th>OR gate in the figure (top to bottom)</th><th>Sum term</th><th>Comes from row</th><th>That row's A B C</th></tr>
<tr><td>1st</td><td>A + B + C</td><td>0</td><td>0 0 0</td></tr>
<tr><td>2nd</td><td>A + B + C'</td><td>1</td><td>0 0 1</td></tr>
<tr><td>3rd</td><td>A' + B + C</td><td>4</td><td>1 0 0</td></tr>
<tr><td>4th</td><td>A' + B + C'</td><td>5</td><td>1 0 1</td></tr>
<tr><td>5th</td><td>A' + B' + C'</td><td>7</td><td>1 1 1</td></tr>
</table>
<ul>
<li><strong>The convention flips, and this is the number-one source of lost marks.</strong> In a <em>minterm</em> (SOP) a 0 in the row means a complemented variable. In a <em>maxterm</em> (POS) a <strong>1</strong> in the row means the complemented variable. Row 4 is A=1, B=0, C=0 and gives the sum term A' + B + C. Say it as: "the maxterm is the term that is 0 on exactly that row".</li>
<li><strong>Why it works at all.</strong> Each sum term outputs 0 for exactly one input combination and 1 for the other seven. AND-ing them together therefore gives 0 on exactly the chosen rows — the mirror image of the SOP argument on slide 13.</li>
<li><strong>Cost comparison for this function.</strong> SOP needed 3 AND + 1 OR = 4 gates (plus inverters); POS needs 5 OR + 1 AND = 6 gates. Here SOP wins, because the function has three 1s and five 0s. <strong>Rule of thumb: count the output column — take SOP if 1s are fewer, POS if 0s are fewer.</strong></li>
<li><strong>Both forms are two-level.</strong> POS is not slower, just differently shaped. And by the duality of slides 10 and 11, POS converts to a NOR-only circuit exactly as cleanly as SOP converts to NAND-only.</li>
<li><strong>Where POS is the natural language.</strong> Safety and enable logic: "the motor runs unless (door open) or (emergency pressed) or (overheat)". That sentence is already a product of sums; forcing it into SOP would be work for nothing.</li>
</ul>
<p class="dap-an">✅ Machine check: the five-term POS above was evaluated in Python on all 8 rows and matches column D of Table 12.4 exactly — and therefore matches the SOP of slide 13 as well. Two different circuits, one function.</p>
<p class="pitfall">⚠️ Do not "simplify" <code>(A+B+C)(A+B+C')</code> by cancelling C and C'. The correct step uses the OR-form distributive law: (A+B+C)(A+B+C') = (A+B) + (C·C') = (A+B) + 0 = A+B. Same answer, but only the second route is defensible in an exam.</p>`,
        `<p class="y-chinh">🎯 Vẫn hàm đó nhưng dựng theo chiều ngược lại: <strong>năm cổng OR đổ vào một cổng AND</strong>. Thay vì liệt kê chỗ hàm bằng 1, POS liệt kê chỗ hàm bằng 0 — và Table 12.4 có năm dòng như vậy.</p>
<p class="nhan">Ba nước đi để tới đó. (1) Viết SOP của phần <em>BÙ</em>: các dòng có D = 0 là 0, 1, 4, 5 và 7, nên</p>
<p><code>D' = A'B'C' + A'B'C + AB'C' + AB'C + ABC</code></p>
<p class="nhan">(2) Lấy bù hai vế. (3) Áp De Morgan hai lần — một lần phá gạch lớn trùm cả tổng, một lần cho từng tích:</p>
<p><code>D = (A+B+C)(A+B+C')(A'+B+C)(A'+B+C')(A'+B'+C')</code></p>
<table>
<tr><th>Cổng OR trên hình (từ trên xuống)</th><th>Số hạng tổng</th><th>Lấy từ dòng</th><th>A B C của dòng đó</th></tr>
<tr><td>Thứ 1</td><td>A + B + C</td><td>0</td><td>0 0 0</td></tr>
<tr><td>Thứ 2</td><td>A + B + C'</td><td>1</td><td>0 0 1</td></tr>
<tr><td>Thứ 3</td><td>A' + B + C</td><td>4</td><td>1 0 0</td></tr>
<tr><td>Thứ 4</td><td>A' + B + C'</td><td>5</td><td>1 0 1</td></tr>
<tr><td>Thứ 5</td><td>A' + B' + C'</td><td>7</td><td>1 1 1</td></tr>
</table>
<ul>
<li><strong>Quy ước LẬT NGƯỢC, và đây là nguồn mất điểm số một.</strong> Trong <em>minterm</em> (SOP), bit 0 của dòng nghĩa là biến ở dạng BÙ. Trong <em>maxterm</em> (POS), bit <strong>1</strong> của dòng mới nghĩa là biến ở dạng bù. Dòng 4 là A=1, B=0, C=0 và cho số hạng tổng A' + B + C. Đọc thành câu: "maxterm là số hạng bằng 0 tại ĐÚNG dòng đó".</li>
<li><strong>Vì sao nó chạy.</strong> Mỗi số hạng tổng cho ra 0 ở đúng MỘT tổ hợp đầu vào và cho 1 ở bảy tổ hợp còn lại. AND chúng lại với nhau thì được 0 ở đúng những dòng đã chọn — ảnh soi gương của lập luận SOP ở slide 13.</li>
<li><strong>So chi phí cho hàm này.</strong> SOP cần 3 AND + 1 OR = 4 cổng (chưa kể bộ đảo); POS cần 5 OR + 1 AND = 6 cổng. Ở đây SOP thắng, vì hàm có ba số 1 và năm số 0. <strong>Luật ngón tay cái: đếm cột đầu ra — ít số 1 thì chọn SOP, ít số 0 thì chọn POS.</strong></li>
<li><strong>Cả hai dạng đều HAI TẦNG.</strong> POS không chậm hơn, chỉ khác hình. Và theo tính đối ngẫu ở slide 10 và 11, POS chuyển sang mạch toàn NOR gọn đúng như SOP chuyển sang mạch toàn NAND.</li>
<li><strong>Chỗ POS là ngôn ngữ tự nhiên.</strong> Logic an toàn và cho phép: "động cơ chạy TRỪ KHI (cửa mở) hoặc (nút khẩn cấp) hoặc (quá nhiệt)". Câu đó vốn đã là một tích các tổng; ép nó về SOP là làm việc thừa.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng máy: POS năm số hạng ở trên được tính trong Python trên cả 8 dòng và khớp đúng cột D của Table 12.4 — và do đó cũng khớp với SOP ở slide 13. Hai mạch khác nhau, một hàm.</p>
<p class="pitfall">⚠️ Đừng "rút gọn" <code>(A+B+C)(A+B+C')</code> bằng cách triệt tiêu C với C'. Bước đúng dùng luật phân phối dạng OR: (A+B+C)(A+B+C') = (A+B) + (C·C') = (A+B) + 0 = A+B. Cùng đáp án, nhưng chỉ đường thứ hai là bảo vệ được trong phòng thi.</p>`],

      [16, 'Figure 12.8 — Simplified Implementation of Table 12.4',
        `<p class="y-chinh">🎯 The payoff slide. The same function as slides 14 and 15, now drawn with <strong>one OR gate and one AND gate — two gates total</strong>: an OR combining A' and C', feeding an AND with B.</p>
<p><code>F = B · (A' + C')</code></p>
<p class="nhan">The algebra that gets you there from the SOP of slide 13, one step at a time:</p>
<table>
<tr><th>Step</th><th>Expression</th><th>Law used</th></tr>
<tr><td>0</td><td>A'BC' + A'BC + ABC'</td><td>starting SOP (slide 13)</td></tr>
<tr><td>1</td><td>A'B(C' + C) + ABC'</td><td>distributive, factoring A'B out of the first two terms</td></tr>
<tr><td>2</td><td>A'B·1 + ABC' = A'B + ABC'</td><td>inverse element C + C' = 1, then identity</td></tr>
<tr><td>3</td><td>B(A' + AC')</td><td>distributive, factoring B</td></tr>
<tr><td>4</td><td>B(A' + C')</td><td>the identity A' + AC' = A' + C' (same shape as A + A'B = A + B)</td></tr>
</table>
<p class="nhan">The equivalent SOP form — the one a Karnaugh map produces on slide 17 — is <code>F = A'B + BC'</code>. Multiply out B(A'+C') and you get it back.</p>
<table>
<tr><th>Version</th><th>Gates (excl. inverters)</th><th>Gate inputs total</th><th>Levels</th></tr>
<tr><td>SOP, Figure 12.6</td><td>3 AND + 1 OR = 4</td><td>3×3 + 3 = 12</td><td>2</td></tr>
<tr><td>POS, Figure 12.7</td><td>5 OR + 1 AND = 6</td><td>5×3 + 5 = 20</td><td>2</td></tr>
<tr><td><strong>Simplified, Figure 12.8</strong></td><td><strong>1 OR + 1 AND = 2</strong></td><td><strong>2 + 2 = 4</strong></td><td>2</td></tr>
</table>
<ul>
<li><strong>Two gates instead of six, and not one bit of behaviour changed.</strong> That is the entire economic case for Boolean simplification, and on a chip with a billion gates the same ratio is the difference between a product and a failure.</li>
<li><strong>Notice the inverter count drops too.</strong> Figure 12.6 needs A', B', C'; Figure 12.8 needs only A' and C'. Every variable you eliminate from an expression removes wiring, not just gates.</li>
<li><strong>The delay did not improve — and that is the honest lesson.</strong> All three versions are two levels deep. Simplification buys you <em>area and power</em>, not latency, as long as you stay in two-level form. To buy latency you have to change the algorithm, which is exactly what carry-lookahead does to the adder (slide 24).</li>
<li><strong>Two equally correct answers exist here:</strong> <code>B(A' + C')</code> (a POS-ish factored form, 2 gates) and <code>A'B + BC'</code> (SOP, 3 gates). A Karnaugh map always hands you the SOP one. Both are "minimal" under different cost measures — say which measure you are using and you cannot be marked wrong.</li>
<li><strong>Doing this by algebra does not scale.</strong> Factoring worked here because the function is tiny. With four variables and a dozen minterms, spotting which terms to pair is guesswork — which is the entire reason slides 17–23 introduce a <em>systematic</em> method.</li>
</ul>
<p class="dap-an">✅ Machine check: <code>B(A'+C')</code> and <code>A'B + BC'</code> were each evaluated in Python over all 8 rows and both equal column D of Table 12.4 — identical to the SOP of slide 13 and the POS of slide 15. Four expressions, one truth table, zero discrepancies.</p>
<p class="meo">💡 The reflex worth building: after <em>every</em> simplification, re-evaluate two or three rows of the original truth table against your new expression. It costs fifteen seconds and catches the sign error that would otherwise cost the whole question.</p>`,
        `<p class="y-chinh">🎯 Slide ăn quả. Vẫn hàm của slide 14 và 15, nay vẽ bằng <strong>một cổng OR và một cổng AND — tổng cộng HAI cổng</strong>: một OR gộp A' với C', đổ vào một AND cùng với B.</p>
<p><code>F = B · (A' + C')</code></p>
<p class="nhan">Đại số dẫn tới đó từ SOP ở slide 13, từng bước một:</p>
<table>
<tr><th>Bước</th><th>Biểu thức</th><th>Luật đã dùng</th></tr>
<tr><td>0</td><td>A'BC' + A'BC + ABC'</td><td>SOP xuất phát (slide 13)</td></tr>
<tr><td>1</td><td>A'B(C' + C) + ABC'</td><td>phân phối, đặt A'B ra ngoài hai số hạng đầu</td></tr>
<tr><td>2</td><td>A'B·1 + ABC' = A'B + ABC'</td><td>phần tử bù C + C' = 1, rồi phần tử đơn vị</td></tr>
<tr><td>3</td><td>B(A' + AC')</td><td>phân phối, đặt B ra ngoài</td></tr>
<tr><td>4</td><td>B(A' + C')</td><td>đẳng thức A' + AC' = A' + C' (cùng dạng với A + A'B = A + B)</td></tr>
</table>
<p class="nhan">Dạng SOP tương đương — dạng mà bìa Karnaugh sẽ cho ra ở slide 17 — là <code>F = A'B + BC'</code>. Nhân bung B(A'+C') ra thì được lại đúng nó.</p>
<table>
<tr><th>Phiên bản</th><th>Số cổng (không kể bộ đảo)</th><th>Tổng số đầu vào cổng</th><th>Số tầng</th></tr>
<tr><td>SOP, Figure 12.6</td><td>3 AND + 1 OR = 4</td><td>3×3 + 3 = 12</td><td>2</td></tr>
<tr><td>POS, Figure 12.7</td><td>5 OR + 1 AND = 6</td><td>5×3 + 5 = 20</td><td>2</td></tr>
<tr><td><strong>Rút gọn, Figure 12.8</strong></td><td><strong>1 OR + 1 AND = 2</strong></td><td><strong>2 + 2 = 4</strong></td><td>2</td></tr>
</table>
<ul>
<li><strong>Hai cổng thay vì sáu, mà hành vi không đổi một bit nào.</strong> Đó là toàn bộ lý lẽ kinh tế của việc rút gọn Boole, và trên một con chip có một tỉ cổng thì đúng tỉ lệ đó là khác biệt giữa một sản phẩm và một thất bại.</li>
<li><strong>Để ý số bộ ĐẢO cũng giảm.</strong> Figure 12.6 cần A', B', C'; Figure 12.8 chỉ cần A' và C'. Mỗi biến bạn loại khỏi biểu thức là bớt cả dây nối, không chỉ bớt cổng.</li>
<li><strong>Độ trễ KHÔNG cải thiện — và đó là bài học trung thực.</strong> Cả ba phiên bản đều sâu hai tầng. Rút gọn mua cho bạn <em>DIỆN TÍCH và ĐIỆN NĂNG</em>, không mua độ trễ, chừng nào bạn còn ở dạng hai tầng. Muốn mua độ trễ thì phải đổi THUẬT TOÁN, đúng thứ mà carry-lookahead làm với bộ cộng (slide 24).</li>
<li><strong>Ở đây có HAI đáp án đều đúng:</strong> <code>B(A' + C')</code> (dạng đã đặt thừa số, 2 cổng) và <code>A'B + BC'</code> (SOP, 3 cổng). Bìa Karnaugh luôn trao cho bạn dạng SOP. Cả hai đều "tối thiểu" theo hai thước đo chi phí khác nhau — nói rõ bạn đang dùng thước nào thì không ai chấm sai được.</li>
<li><strong>Làm bằng đại số thì KHÔNG nở ra được.</strong> Đặt thừa số chạy tốt ở đây vì hàm bé tí. Với bốn biến và chục minterm, việc nhìn ra nên ghép số hạng nào là đoán mò — và đó chính là toàn bộ lý do slide 17–23 đưa vào một phương pháp CÓ HỆ THỐNG.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng máy: <code>B(A'+C')</code> và <code>A'B + BC'</code> mỗi cái được tính trong Python trên cả 8 dòng và đều bằng cột D của Table 12.4 — trùng khớp với SOP ở slide 13 và POS ở slide 15. Bốn biểu thức, một bảng chân trị, không một chỗ lệch.</p>
<p class="meo">💡 Phản xạ đáng luyện: SAU MỖI lần rút gọn, tính lại hai ba dòng của bảng chân trị gốc bằng biểu thức mới. Tốn mười lăm giây và bắt được cái lỗi dấu mà nếu không thì mất trọn cả câu.</p>`],

      [17, 'Figure 12.9 — The Use of Karnaugh Maps to Represent Boolean Functions',
        `<p class="y-chinh">🎯 The Karnaugh map: a truth table folded into a <strong>grid whose axes are labelled in Gray code — 00, 01, 11, 10</strong> — so that any two neighbouring squares differ in exactly one variable. That single property is what turns "spot the factorisation" into "look for rectangles".</p>
<p class="nhan">(a) Two variables — F = AB' + A'B. Each column is one combination of AB:</p>
<table>
<tr><th>AB →</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td>F</td><td></td><td><strong>1</strong></td><td></td><td><strong>1</strong></td></tr>
</table>
<p class="nhan">(b) Three variables — A down the side, BC across. This is exactly Table 12.4:</p>
<table>
<tr><th>A \\ BC</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td><strong>0</strong></td><td></td><td></td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
<tr><td><strong>1</strong></td><td></td><td></td><td></td><td><strong>1</strong></td></tr>
</table>
<p>The slide labels it F = A'BC' + A'BC + ABC' — three 1s, in cells (A=0, BC=11), (A=0, BC=10) and (A=1, BC=10).</p>
<p class="nhan">(c) Four variables — AB down the side, CD across. F = A'B'CD + AB'C'D + ABC'D':</p>
<table>
<tr><th>AB \\ CD</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td><strong>00</strong></td><td></td><td></td><td><strong>1</strong></td><td></td></tr>
<tr><td><strong>01</strong></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>11</strong></td><td><strong>1</strong></td><td></td><td></td><td></td></tr>
<tr><td><strong>10</strong></td><td></td><td><strong>1</strong></td><td></td><td></td></tr>
</table>
<p class="nhan">(d) Simplified labelling — the same 4-variable map with braces down the sides marking which half is A, which is B, which is C, which is D, instead of writing the four codes.</p>
<ul>
<li><strong>Why the order must be 00, 01, 11, 10 and never 00, 01, 10, 11.</strong> Gray code changes <strong>one bit at a time</strong>. In Gray order, columns 01 and 11 differ only in the first bit, so two adjacent 1s can be merged by the law X + X' = 1. In binary order, columns 01 and 10 differ in <em>both</em> bits, and merging them would be plain wrong. Get the axis order wrong and every answer after it is wrong.</li>
<li><strong>The map is a truth table, re-seated.</strong> Nothing is added or removed; the 8 (or 16) cells are the 8 (or 16) rows. What changes is that rows which are algebraically combinable are now physically next to each other, where your eye can find them.</li>
<li><strong>Worked exercise 1 — two variables (map a).</strong> Ones at AB = 01 and AB = 10. They are <em>not</em> adjacent in Gray order (01 and 10 differ in both bits), so no grouping is possible. Answer: <strong>F = A'B + AB'</strong>, which is XOR — famously the function a K-map cannot shrink.</li>
<li><strong>Worked exercise 2 — three variables (map b).</strong> Ones at (0,11), (0,10), (1,10). Pair the two in row A=0: they share A=0 and B=1, C changes → <strong>A'B</strong>. Pair the two in column BC=10: they share B=1 and C=0, A changes → <strong>BC'</strong>. Answer: <strong>F = A'B + BC'</strong>, exactly the simplified form of slide 16, reached in ten seconds instead of five algebra steps.</li>
<li><strong>The map is a torus, not a sheet of paper.</strong> Column 00 and column 10 are neighbours (they differ only in C), and so are the top and bottom rows. Slide 18 uses that wrap-around in four of its nine panels.</li>
</ul>
<p class="dap-an">✅ Machine check: for each of maps (a), (b) and (c) the set of shaded cells was entered into Python from the slide image and compared against the expression printed beneath it over all 2<sup>n</sup> combinations. 3/3 match. Map (b) also matches Table 12.4 row for row, and <code>A'B + BC'</code> matches it too.</p>
<p class="pitfall">⚠️ A K-map is only practical up to 4 variables (5 and 6 with stacked maps, painfully). Beyond that, the eye fails and you need Quine–McCluskey (slide 22), which is the same idea made mechanical so a computer can run it.</p>`,
        `<p class="y-chinh">🎯 Bìa Karnaugh: một bảng chân trị GẤP LẠI thành <strong>lưới có trục ghi bằng MÃ GRAY — 00, 01, 11, 10</strong> — để hai ô kề nhau bất kỳ khác nhau đúng MỘT biến. Riêng tính chất đó biến việc "nhìn ra cách đặt thừa số" thành việc "tìm hình chữ nhật".</p>
<p class="nhan">(a) Hai biến — F = AB' + A'B. Mỗi cột là một tổ hợp của AB:</p>
<table>
<tr><th>AB →</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td>F</td><td></td><td><strong>1</strong></td><td></td><td><strong>1</strong></td></tr>
</table>
<p class="nhan">(b) Ba biến — A theo cạnh dọc, BC theo cạnh ngang. Đây đúng là Table 12.4:</p>
<table>
<tr><th>A \\ BC</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td><strong>0</strong></td><td></td><td></td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
<tr><td><strong>1</strong></td><td></td><td></td><td></td><td><strong>1</strong></td></tr>
</table>
<p>Slide ghi nhãn F = A'BC' + A'BC + ABC' — ba số 1, ở các ô (A=0, BC=11), (A=0, BC=10) và (A=1, BC=10).</p>
<p class="nhan">(c) Bốn biến — AB theo cạnh dọc, CD theo cạnh ngang. F = A'B'CD + AB'C'D + ABC'D':</p>
<table>
<tr><th>AB \\ CD</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td><strong>00</strong></td><td></td><td></td><td><strong>1</strong></td><td></td></tr>
<tr><td><strong>01</strong></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>11</strong></td><td><strong>1</strong></td><td></td><td></td><td></td></tr>
<tr><td><strong>10</strong></td><td></td><td><strong>1</strong></td><td></td><td></td></tr>
</table>
<p class="nhan">(d) Cách ghi nhãn rút gọn — vẫn bìa 4 biến đó nhưng dùng dấu ngoặc nhọn ở cạnh để đánh dấu nửa nào là A, nửa nào là B, C, D, thay vì viết bốn mã ra.</p>
<ul>
<li><strong>Vì sao thứ tự BẮT BUỘC là 00, 01, 11, 10 chứ không phải 00, 01, 10, 11.</strong> Mã Gray đổi <strong>MỖI LẦN MỘT BIT</strong>. Theo thứ tự Gray, cột 01 và 11 chỉ khác nhau ở bit đầu, nên hai số 1 kề nhau gộp được nhờ luật X + X' = 1. Theo thứ tự nhị phân, cột 01 và 10 khác nhau ở CẢ HAI bit, gộp chúng là sai trắng trợn. Ghi sai thứ tự trục thì mọi thứ sau đó sai theo.</li>
<li><strong>Bìa K là bảng chân trị đã xếp lại chỗ ngồi.</strong> Không thêm không bớt gì; 8 (hoặc 16) ô chính là 8 (hoặc 16) dòng. Cái thay đổi là những dòng GỘP ĐƯỢC về mặt đại số nay nằm CẠNH NHAU về mặt vật lý, chỗ mắt bạn tìm ra được.</li>
<li><strong>Bài giải 1 — hai biến (bìa a).</strong> Số 1 ở AB = 01 và AB = 10. Chúng KHÔNG kề nhau theo thứ tự Gray (01 và 10 khác cả hai bit), nên không gộp được. Đáp số: <strong>F = A'B + AB'</strong>, tức XOR — hàm nổi tiếng là bìa K không rút gọn nổi.</li>
<li><strong>Bài giải 2 — ba biến (bìa b).</strong> Số 1 ở (0,11), (0,10), (1,10). Ghép hai ô ở hàng A=0: chung A=0 và B=1, chỉ C đổi → <strong>A'B</strong>. Ghép hai ô ở cột BC=10: chung B=1 và C=0, chỉ A đổi → <strong>BC'</strong>. Đáp số: <strong>F = A'B + BC'</strong>, đúng dạng rút gọn ở slide 16, tới nơi trong mười giây thay vì năm bước đại số.</li>
<li><strong>Bìa là một cái săm xe, không phải tờ giấy.</strong> Cột 00 và cột 10 là hàng xóm (chúng chỉ khác nhau ở C), hàng trên cùng và hàng dưới cùng cũng vậy. Slide 18 dùng đúng kiểu cuộn mép đó ở bốn trong chín ô của nó.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng máy: với từng bìa (a), (b), (c), tập ô được tô đã được nhập vào Python từ ảnh slide rồi so với biểu thức in bên dưới trên toàn bộ 2<sup>n</sup> tổ hợp. 3/3 khớp. Bìa (b) còn khớp Table 12.4 từng dòng, và <code>A'B + BC'</code> cũng khớp.</p>
<p class="pitfall">⚠️ Bìa K chỉ dùng được thoải mái tới 4 biến (5 và 6 biến thì phải xếp chồng bìa, rất cực). Quá đó mắt người thua, và bạn cần Quine–McCluskey (slide 22) — cùng một ý tưởng nhưng làm cho máy móc để máy tính chạy được.</p>`],

      [18, 'Figure 12.10 — The Use of Karnaugh Maps (the nine grouping patterns)',
        `<p class="y-chinh">🎯 Nine four-variable maps in a 3×3 arrangement, each with one group circled and its product term written underneath. Read together they are <strong>the complete grammar of grouping</strong>: which shapes are legal, and what each shape costs in literals.</p>
<table>
<tr><th>Panel</th><th>Cells circled (row AB, column CD)</th><th>Size</th><th>Term</th><th>Rule it demonstrates</th></tr>
<tr><td>(a)</td><td>(01,01) + (01,11)</td><td>2</td><td>A'BD</td><td>Plain horizontal pair — one variable drops out</td></tr>
<tr><td>(b)</td><td>(00,01) + (10,01)</td><td>2</td><td>B'C'D</td><td><strong>Top-bottom wrap</strong> — rows 00 and 10 are adjacent</td></tr>
<tr><td>(c)</td><td>(01,00) + (01,10)</td><td>2</td><td>A'BD'</td><td><strong>Left-right wrap</strong> — columns 00 and 10 are adjacent</td></tr>
<tr><td>(d)</td><td>whole row AB = 00</td><td>4</td><td>A'B'</td><td>A row of four — two variables drop out</td></tr>
<tr><td>(e)</td><td>(01,00)(01,01)(11,00)(11,01)</td><td>4</td><td>BC'</td><td>A 2×2 square in the middle</td></tr>
<tr><td>(f)</td><td>(01,00)(01,10)(11,00)(11,10)</td><td>4</td><td>BD'</td><td>2×2 square <em>split by the left-right wrap</em></td></tr>
<tr><td>(g)</td><td>rows AB = 00 and 01, all columns</td><td>8</td><td>A'</td><td>Half the map — three variables drop out</td></tr>
<tr><td>(h)</td><td>columns CD = 00 and 10, all rows</td><td>8</td><td>D'</td><td>Half the map, using the wrap</td></tr>
<tr><td>(i)</td><td>columns CD = 11 and 10, all rows</td><td>8</td><td>C</td><td>Half the map, no wrap needed</td></tr>
</table>
<ul>
<li><strong>The three rules of grouping, and they are absolute.</strong> (1) A group must contain <strong>2<sup>k</sup></strong> cells — 1, 2, 4, 8, 16 — never 3, 5 or 6. (2) A group must be a <strong>rectangle</strong> (allowing wrap-around off any edge). (3) Groups may <strong>overlap</strong>, and every 1 must be inside at least one group.</li>
<li><strong>Bigger group = fewer literals, and the arithmetic is exact.</strong> On a 4-variable map: a group of 1 keeps 4 literals, 2 keeps 3, 4 keeps 2, 8 keeps 1, 16 keeps none (the function is constant 1). Doubling the group always removes exactly one variable — the one that changes inside it.</li>
<li><strong>Which variable drops out? The one that is not constant across the group.</strong> In panel (e) the four cells have B=1 in all of them and C=0 in all of them, while A and D each take both values → the term is BC'. Reading a group is always the same two questions: which variables stay constant, and at what value.</li>
<li><strong>The wrap panels (b), (c), (f), (h) are the ones students miss.</strong> Cells at opposite edges are neighbours because their Gray codes differ in one bit. Practical habit: mentally roll the map into a cylinder both ways before you commit to your groups.</li>
<li><strong>Worked exercise 3 — a full four-variable minimisation.</strong> Take F with 1s at cells (00,00), (00,01), (01,00), (01,01), (11,00), (11,01), (10,00), (10,01) — that is columns CD = 00 and 01 in every row. Two variables are constant across all eight cells: C = 0 in both columns, D changes, A and B change. Answer: one group of 8 → <strong>F = C'</strong>. Same reasoning as panel (i) mirrored.</li>
</ul>
<p class="dap-an">✅ Machine check: for all nine panels, the circled cell set read off the slide image was compared in Python against the printed term over all 16 input combinations. <strong>9/9 match</strong>, including the four wrap-around cases.</p>
<p class="meo">💡 Working order that avoids mistakes: find the <strong>largest</strong> legal groups first, then check whether any group is entirely covered by others — if so, delete it. Slide 23 shows the same idea formalised as "essential prime implicants".</p>`,
        `<p class="y-chinh">🎯 Chín bìa bốn biến xếp thành 3×3, mỗi bìa khoanh MỘT nhóm và ghi số hạng tích của nó bên dưới. Đọc gộp lại thì đó là <strong>trọn bộ ngữ pháp của việc gom nhóm</strong>: hình nào hợp lệ, và mỗi hình tiết kiệm được bao nhiêu chữ.</p>
<table>
<tr><th>Ô</th><th>Các ô được khoanh (hàng AB, cột CD)</th><th>Cỡ</th><th>Số hạng</th><th>Luật nó minh hoạ</th></tr>
<tr><td>(a)</td><td>(01,01) + (01,11)</td><td>2</td><td>A'BD</td><td>Cặp ngang bình thường — rụng một biến</td></tr>
<tr><td>(b)</td><td>(00,01) + (10,01)</td><td>2</td><td>B'C'D</td><td><strong>CUỘN trên–dưới</strong> — hàng 00 và 10 kề nhau</td></tr>
<tr><td>(c)</td><td>(01,00) + (01,10)</td><td>2</td><td>A'BD'</td><td><strong>CUỘN trái–phải</strong> — cột 00 và 10 kề nhau</td></tr>
<tr><td>(d)</td><td>trọn hàng AB = 00</td><td>4</td><td>A'B'</td><td>Một hàng bốn ô — rụng hai biến</td></tr>
<tr><td>(e)</td><td>(01,00)(01,01)(11,00)(11,01)</td><td>4</td><td>BC'</td><td>Ô vuông 2×2 ở giữa</td></tr>
<tr><td>(f)</td><td>(01,00)(01,10)(11,00)(11,10)</td><td>4</td><td>BD'</td><td>Ô vuông 2×2 <em>bị tách bởi cuộn trái–phải</em></td></tr>
<tr><td>(g)</td><td>hàng AB = 00 và 01, mọi cột</td><td>8</td><td>A'</td><td>Nửa bìa — rụng ba biến</td></tr>
<tr><td>(h)</td><td>cột CD = 00 và 10, mọi hàng</td><td>8</td><td>D'</td><td>Nửa bìa, dùng cuộn mép</td></tr>
<tr><td>(i)</td><td>cột CD = 11 và 10, mọi hàng</td><td>8</td><td>C</td><td>Nửa bìa, không cần cuộn</td></tr>
</table>
<ul>
<li><strong>Ba luật gom nhóm, và chúng tuyệt đối.</strong> (1) Một nhóm phải chứa <strong>2<sup>k</sup></strong> ô — 1, 2, 4, 8, 16 — không bao giờ 3, 5 hay 6. (2) Nhóm phải là <strong>HÌNH CHỮ NHẬT</strong> (được phép cuộn qua mọi mép). (3) Các nhóm được phép <strong>CHỒNG LẤN</strong>, và mọi số 1 phải nằm trong ít nhất một nhóm.</li>
<li><strong>Nhóm to hơn = ít chữ hơn, và phép tính là chính xác.</strong> Trên bìa 4 biến: nhóm 1 ô giữ 4 chữ, 2 ô giữ 3, 4 ô giữ 2, 8 ô giữ 1, 16 ô không giữ chữ nào (hàm hằng 1). Cứ gấp đôi nhóm là bỏ đi đúng một biến — cái biến ĐỔI GIÁ TRỊ bên trong nhóm.</li>
<li><strong>Biến nào rụng? Biến KHÔNG giữ nguyên giá trị trong cả nhóm.</strong> Ở ô (e), bốn ô đều có B=1 và đều có C=0, trong khi A và D mỗi cái nhận cả hai giá trị → số hạng là BC'. Đọc một nhóm luôn là hai câu hỏi: biến nào giữ nguyên, và giữ ở giá trị nào.</li>
<li><strong>Bốn ô cuộn mép (b), (c), (f), (h) là chỗ sinh viên hay bỏ sót.</strong> Hai ô ở hai mép đối diện là hàng xóm vì mã Gray của chúng khác nhau một bit. Thói quen thực dụng: cuộn bìa thành hình trụ trong đầu theo cả hai chiều TRƯỚC khi chốt nhóm.</li>
<li><strong>Bài giải 3 — một bài rút gọn bốn biến trọn vẹn.</strong> Lấy F có số 1 tại (00,00), (00,01), (01,00), (01,01), (11,00), (11,01), (10,00), (10,01) — tức hai cột CD = 00 và 01 ở MỌI hàng. Hai biến giữ nguyên trong cả tám ô: C = 0 ở cả hai cột, D thì đổi, A và B đều đổi. Đáp số: một nhóm 8 ô → <strong>F = C'</strong>. Cùng lý lẽ với ô (i) nhưng soi gương.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng máy: với cả chín ô, tập ô được khoanh đọc từ ảnh slide đã được so trong Python với số hạng in kèm, trên đủ 16 tổ hợp đầu vào. <strong>9/9 khớp</strong>, kể cả bốn trường hợp cuộn mép.</p>
<p class="meo">💡 Trình tự làm bài tránh sai: tìm nhóm <strong>TO NHẤT</strong> hợp lệ trước, rồi kiểm xem có nhóm nào đã bị các nhóm khác phủ kín chưa — nếu có thì xoá nó đi. Slide 23 chính là ý đó được hình thức hoá thành "prime implicant thiết yếu".</p>`],

      [19, 'Figure 12.11 — Overlapping Groups',
        `<p class="y-chinh">🎯 Two maps that make one point the previous slide only hinted at: <strong>a cell may belong to more than one group</strong>, and using it twice is not cheating — it is often what makes both groups as large as they can be.</p>
<p class="nhan">(a) Three variables, A down the side, BC across — the same function as Table 12.4 again:</p>
<table>
<tr><th>A \\ BC</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td><strong>0</strong></td><td></td><td></td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
<tr><td><strong>1</strong></td><td></td><td></td><td></td><td><strong>1</strong></td></tr>
</table>
<p>The slide circles two pairs: the horizontal pair in row A=0 (cells BC=11 and BC=10) giving <strong>A'B</strong>, and the vertical pair in column BC=10 (rows A=0 and A=1) giving <strong>BC'</strong>. The cell (A=0, BC=10) sits inside <em>both</em> circles. Result: <strong>F = A'B + BC'</strong>.</p>
<p class="nhan">(b) Four variables, AB down, CD across:</p>
<table>
<tr><th>AB \\ CD</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td><strong>00</strong></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>01</strong></td><td></td><td><strong>1</strong></td><td></td><td></td></tr>
<tr><td><strong>11</strong></td><td></td><td><strong>1</strong></td><td><strong>1</strong></td><td></td></tr>
<tr><td><strong>10</strong></td><td></td><td></td><td><strong>1</strong></td><td></td></tr>
</table>
<p>The slide circles the vertical pair in column CD=01 across rows 01 and 11 → <strong>BC'D</strong>, and the vertical pair in column CD=11 across rows 11 and 10 → <strong>ACD</strong>. Result: <strong>F = BC'D + ACD</strong>.</p>
<ul>
<li><strong>Why overlapping is legal.</strong> Boolean OR is idempotent: X + X = X. Covering the same minterm from two groups adds it to the sum twice, and adding it twice is the same as adding it once. There is no double-counting penalty in this algebra — unlike, say, counting set elements.</li>
<li><strong>And why it is often necessary.</strong> In map (a), if you refused to reuse cell (0,10) you would be forced into three single-cell groups — the original unsimplified SOP with three 4-literal terms. Reuse is what lets both pairs reach size 2.</li>
<li><strong>Map (b) shows the opposite lesson, and it is worth being precise.</strong> There the two circled groups do <em>not</em> share a cell; they simply sit next to each other in the same rows. Cells (11,01) and (11,11) are adjacent, but pairing <em>them</em> would leave (01,01) and (10,11) stranded as single cells. The chosen pairing is the one that covers everything with two 3-literal terms instead of one 3-literal plus two 4-literal terms.</li>
<li><strong>Verify by counting literals, not by feeling.</strong> Map (b) solution: 3 + 3 = 6 literals. The tempting alternative (pair the middle two, then two singletons): 3 + 4 + 4 = 11 literals. Numbers settle the argument; intuition does not.</li>
<li><strong>The rule this leads to.</strong> Cover every 1 at least once, with the fewest and largest groups you can, and delete any group whose cells are all covered by others. That last clause is exactly what slide 23's prime implicant chart automates.</li>
</ul>
<p class="dap-an">✅ Machine check: map (a)'s cells against <code>A'B + BC'</code> — match on all 8 rows, and identical to Table 12.4. Map (b)'s four cells against <code>BC'D + ACD</code> — match on all 16 rows. 2/2 verified in Python.</p>
<p class="pitfall">⚠️ Overlap is allowed; <strong>leaving a 1 uncovered is not</strong>, and <strong>covering a 0 is not</strong>. Those two are hard errors that change the function. Overlap merely costs nothing.</p>`,
        `<p class="y-chinh">🎯 Hai bìa nói rõ một điều slide trước mới chỉ gợi ý: <strong>một ô được phép thuộc NHIỀU nhóm</strong>, và dùng nó hai lần không phải gian lận — đó thường chính là thứ giúp cả hai nhóm đạt kích thước lớn nhất có thể.</p>
<p class="nhan">(a) Ba biến, A theo cạnh dọc, BC theo cạnh ngang — vẫn là hàm của Table 12.4:</p>
<table>
<tr><th>A \\ BC</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td><strong>0</strong></td><td></td><td></td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
<tr><td><strong>1</strong></td><td></td><td></td><td></td><td><strong>1</strong></td></tr>
</table>
<p>Slide khoanh hai cặp: cặp NGANG ở hàng A=0 (ô BC=11 và BC=10) cho <strong>A'B</strong>, và cặp DỌC ở cột BC=10 (hàng A=0 và A=1) cho <strong>BC'</strong>. Ô (A=0, BC=10) nằm trong <em>CẢ HAI</em> vòng khoanh. Kết quả: <strong>F = A'B + BC'</strong>.</p>
<p class="nhan">(b) Bốn biến, AB theo cạnh dọc, CD theo cạnh ngang:</p>
<table>
<tr><th>AB \\ CD</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td><strong>00</strong></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>01</strong></td><td></td><td><strong>1</strong></td><td></td><td></td></tr>
<tr><td><strong>11</strong></td><td></td><td><strong>1</strong></td><td><strong>1</strong></td><td></td></tr>
<tr><td><strong>10</strong></td><td></td><td></td><td><strong>1</strong></td><td></td></tr>
</table>
<p>Slide khoanh cặp dọc ở cột CD=01 qua hàng 01 và 11 → <strong>BC'D</strong>, và cặp dọc ở cột CD=11 qua hàng 11 và 10 → <strong>ACD</strong>. Kết quả: <strong>F = BC'D + ACD</strong>.</p>
<ul>
<li><strong>Vì sao chồng lấn là hợp lệ.</strong> Phép OR của Boole có tính luỹ đẳng: X + X = X. Phủ cùng một minterm từ hai nhóm là cộng nó vào tổng hai lần, mà cộng hai lần thì bằng cộng một lần. Trong thứ đại số này không có hình phạt "đếm trùng" — khác hẳn việc đếm phần tử của tập hợp.</li>
<li><strong>Và vì sao nó thường là BẮT BUỘC.</strong> Ở bìa (a), nếu bạn từ chối dùng lại ô (0,10) thì bạn bị ép vào ba nhóm một-ô — tức đúng cái SOP chưa rút gọn với ba số hạng 4 chữ. Dùng lại chính là thứ cho phép cả hai cặp đạt cỡ 2.</li>
<li><strong>Bìa (b) lại dạy điều ngược lại, và cần nói cho chính xác.</strong> Ở đó hai nhóm được khoanh KHÔNG chung ô nào; chúng chỉ nằm cạnh nhau ở cùng những hàng. Ô (11,01) và (11,11) kề nhau thật, nhưng ghép <em>chúng</em> lại thì (01,01) và (10,11) bị bỏ rơi thành hai ô lẻ. Cách ghép đã chọn là cách phủ hết mọi thứ bằng hai số hạng 3 chữ, thay vì một số hạng 3 chữ cộng hai số hạng 4 chữ.</li>
<li><strong>Kiểm bằng cách ĐẾM CHỮ, đừng kiểm bằng cảm giác.</strong> Lời giải bìa (b): 3 + 3 = 6 chữ. Phương án hấp dẫn kia (ghép hai ô giữa rồi để hai ô lẻ): 3 + 4 + 4 = 11 chữ. Con số phân xử, trực giác thì không.</li>
<li><strong>Luật rút ra từ đây.</strong> Phủ mọi số 1 ít nhất một lần, bằng những nhóm ÍT NHẤT và TO NHẤT có thể, rồi xoá mọi nhóm mà mọi ô của nó đã được nhóm khác phủ. Đúng cái mệnh đề cuối đó là thứ mà bảng prime implicant ở slide 23 làm tự động.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng máy: tập ô của bìa (a) so với <code>A'B + BC'</code> — khớp trên cả 8 dòng, và trùng đúng Table 12.4. Bốn ô của bìa (b) so với <code>BC'D + ACD</code> — khớp trên cả 16 dòng. 2/2 đã kiểm trong Python.</p>
<p class="pitfall">⚠️ Chồng lấn thì được phép; <strong>bỏ sót một số 1 thì KHÔNG</strong>, và <strong>phủ trúng một số 0 thì KHÔNG</strong>. Hai lỗi đó là lỗi nặng vì chúng làm đổi hàm. Còn chồng lấn thì chẳng mất gì cả.</p>`],

      [20, 'Table 12.5 — Truth Table for the One-Digit Packed Decimal Incrementer',
        `<p class="y-chinh">🎯 Design problem #2, and the reason don't-care conditions exist. The circuit takes a <strong>BCD digit (0–9) in four bits ABCD and outputs that digit plus one, modulo 10</strong>, in four bits WXYZ. Six of the sixteen possible inputs — 1010 through 1111 — <strong>never occur</strong>, and the table marks their outputs <code>d</code>.</p>
<table>
<tr><th>Number in</th><th>A</th><th>B</th><th>C</th><th>D</th><th>Number out</th><th>W</th><th>X</th><th>Y</th><th>Z</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>2</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>2</td><td>0</td><td>0</td><td>1</td><td>0</td><td>3</td><td>0</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>3</td><td>0</td><td>0</td><td>1</td><td>1</td><td>4</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>4</td><td>0</td><td>1</td><td>0</td><td>0</td><td>5</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>5</td><td>0</td><td>1</td><td>0</td><td>1</td><td>6</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>6</td><td>0</td><td>1</td><td>1</td><td>0</td><td>7</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>7</td><td>0</td><td>1</td><td>1</td><td>1</td><td>8</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>8</td><td>1</td><td>0</td><td>0</td><td>0</td><td>9</td><td>1</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>9</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>—</td><td>1</td><td>0</td><td>1</td><td>0</td><td>don't care</td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td>—</td><td>1</td><td>0</td><td>1</td><td>1</td><td>don't care</td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td>—</td><td>1</td><td>1</td><td>0</td><td>0</td><td>don't care</td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td>—</td><td>1</td><td>1</td><td>0</td><td>1</td><td>don't care</td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td>—</td><td>1</td><td>1</td><td>1</td><td>0</td><td>don't care</td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td>—</td><td>1</td><td>1</td><td>1</td><td>1</td><td>don't care</td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
</table>
<ul>
<li><strong>"Packed decimal" is why this circuit exists.</strong> Each decimal digit is stored in its own 4-bit nibble, two digits to a byte — a format used in financial and mainframe arithmetic precisely to avoid binary/decimal rounding surprises. Incrementing such a digit is a real operation, not a textbook invention.</li>
<li><strong>Read the wrap at row 9.</strong> 9 + 1 = 0, not 10 — the carry out of the digit is another circuit's problem. That single row is what forces W (the top output bit) to fall back to 0 and makes the function non-obvious.</li>
<li><strong>A don't care is a free choice, and free choices are worth money.</strong> The six impossible inputs mean six cells on each Karnaugh map that you may fill with 1 <em>or</em> 0 — whichever makes your groups bigger. Slide 21 cashes that in on all four maps.</li>
<li><strong>Four outputs means four separate minimisations.</strong> W, X, Y and Z each get their own K-map over the same four inputs. They may share gates in the final circuit, but the minimisation is done one output at a time.</li>
<li><strong>Where the don't cares come from in general.</strong> Input codes the surrounding system can never produce (here, BCD values above 9); outputs that are never sampled; states that are physically impossible. If you cannot argue that the case truly never happens, it is <em>not</em> a don't care — and guessing wrong here is a design bug, not a rounding error.</li>
</ul>
<p class="dap-an">✅ Machine check: the table above was regenerated in Python as out = (in + 1) mod 10 for in = 0…9 and matches the slide row for row, including the wrap at 9 → 0.</p>
<p class="pitfall">⚠️ Don't care does not mean "the output will be d". The hardware will produce some definite 0 or 1 for input 1011 — you simply declared in advance that you do not care which. If a stray input of 1011 ever reaches the circuit, it will output <em>something</em>, and you have no right to complain about it.</p>`,
        `<p class="y-chinh">🎯 Bài thiết kế số 2, và cũng là lý do tồn tại của điều kiện "không quan tâm". Mạch nhận <strong>một chữ số BCD (0–9) trên bốn bit ABCD rồi xuất ra chính chữ số đó cộng một, lấy dư 10</strong>, trên bốn bit WXYZ. Sáu trong mười sáu đầu vào có thể có — 1010 tới 1111 — <strong>KHÔNG BAO GIỜ xảy ra</strong>, và bảng đánh dấu đầu ra của chúng bằng <code>d</code>.</p>
<table>
<tr><th>Số vào</th><th>A</th><th>B</th><th>C</th><th>D</th><th>Số ra</th><th>W</th><th>X</th><th>Y</th><th>Z</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>2</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>2</td><td>0</td><td>0</td><td>1</td><td>0</td><td>3</td><td>0</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>3</td><td>0</td><td>0</td><td>1</td><td>1</td><td>4</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>4</td><td>0</td><td>1</td><td>0</td><td>0</td><td>5</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>5</td><td>0</td><td>1</td><td>0</td><td>1</td><td>6</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>6</td><td>0</td><td>1</td><td>1</td><td>0</td><td>7</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>7</td><td>0</td><td>1</td><td>1</td><td>1</td><td>8</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>8</td><td>1</td><td>0</td><td>0</td><td>0</td><td>9</td><td>1</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>9</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>—</td><td>1</td><td>0</td><td>1</td><td>0</td><td>không quan tâm</td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td>—</td><td>1</td><td>0</td><td>1</td><td>1</td><td>không quan tâm</td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td>—</td><td>1</td><td>1</td><td>0</td><td>0</td><td>không quan tâm</td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td>—</td><td>1</td><td>1</td><td>0</td><td>1</td><td>không quan tâm</td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td>—</td><td>1</td><td>1</td><td>1</td><td>0</td><td>không quan tâm</td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td>—</td><td>1</td><td>1</td><td>1</td><td>1</td><td>không quan tâm</td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
</table>
<ul>
<li><strong>"Packed decimal" là lý do mạch này tồn tại.</strong> Mỗi chữ số thập phân lưu trong một nibble 4 bit riêng, hai chữ số một byte — định dạng được dùng trong tính toán tài chính và trên máy lớn, chính là để tránh mấy bất ngờ làm tròn giữa nhị phân và thập phân. Tăng một chữ số như vậy là thao tác THẬT, không phải bịa cho sách giáo khoa.</li>
<li><strong>Đọc kỹ chỗ CUỘN ở dòng 9.</strong> 9 + 1 = 0, không phải 10 — cái nhớ ra khỏi chữ số là việc của mạch khác. Đúng một dòng đó ép W (bit ra cao nhất) tụt về 0 và làm cho hàm không còn hiển nhiên.</li>
<li><strong>Một ô "không quan tâm" là một QUYỀN CHỌN MIỄN PHÍ, và quyền chọn miễn phí thì đáng tiền.</strong> Sáu đầu vào bất khả nghĩa là sáu ô trên MỖI bìa Karnaugh mà bạn được điền 1 <em>hoặc</em> 0 — tuỳ cái nào làm nhóm của bạn TO hơn. Slide 21 quy đổi quyền đó ra tiền trên cả bốn bìa.</li>
<li><strong>Bốn đầu ra nghĩa là bốn lần rút gọn riêng.</strong> W, X, Y và Z mỗi cái một bìa K trên cùng bốn đầu vào. Chúng có thể dùng chung cổng trong mạch cuối, nhưng việc rút gọn làm từng đầu ra một.</li>
<li><strong>Nói chung thì don't care ở đâu ra.</strong> Mã đầu vào mà hệ thống xung quanh không bao giờ tạo ra được (ở đây là giá trị BCD lớn hơn 9); đầu ra không bao giờ bị lấy mẫu; trạng thái bất khả về mặt vật lý. Nếu bạn không lập luận được rằng trường hợp đó THẬT SỰ không bao giờ xảy ra thì nó KHÔNG phải don't care — và đoán sai ở đây là một lỗi thiết kế, không phải sai số làm tròn.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng máy: bảng trên được sinh lại trong Python theo công thức ra = (vào + 1) mod 10 với vào = 0…9 và khớp từng dòng với slide, kể cả chỗ cuộn 9 → 0.</p>
<p class="pitfall">⚠️ "Không quan tâm" KHÔNG có nghĩa là "đầu ra sẽ là d". Phần cứng sẽ cho ra một giá trị 0 hoặc 1 rất xác định khi đầu vào là 1011 — bạn chỉ tuyên bố trước rằng mình không quan tâm nó là gì. Nếu một đầu vào lạc 1011 thật sự tới được mạch, nó sẽ xuất ra một cái gì đó, và bạn không có quyền kêu ca.</p>`],

      [21, 'Figure 12.12 — Karnaugh Maps for the Incrementer (don\'t cares in action)',
        `<p class="y-chinh">🎯 Four Karnaugh maps, one per output bit, with the six impossible input codes marked <strong>d</strong> — and the circled groups deliberately swallowing some of those d cells to grow larger. This is <strong>worked exercise 4: a four-variable minimisation with don't cares</strong>.</p>
<p class="nhan">(a) Output W, the most significant bit. W = 1 only for inputs 7 (0111) and 8 (1000):</p>
<table>
<tr><th>AB \\ CD</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td><strong>00</strong></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>01</strong></td><td></td><td></td><td><strong>1</strong></td><td></td></tr>
<tr><td><strong>11</strong></td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td><strong>10</strong></td><td><strong>1</strong></td><td></td><td>d</td><td>d</td></tr>
</table>
<p>The lone 1 at (01,11) has no useful neighbour → <strong>A'BCD</strong>. The 1 at (10,00) groups with the d cells at (11,00) and, wrapping, with (11,10) and (10,10) → the whole square where A=1 and D=0 → <strong>AD'</strong>. Answer: <strong>W = AD' + A'BCD</strong>.</p>
<p class="nhan">(b) Output X. X = 1 for inputs 3, 4, 5, 6:</p>
<table>
<tr><th>AB \\ CD</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td><strong>00</strong></td><td></td><td></td><td><strong>1</strong></td><td></td></tr>
<tr><td><strong>01</strong></td><td><strong>1</strong></td><td><strong>1</strong></td><td></td><td><strong>1</strong></td></tr>
<tr><td><strong>11</strong></td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td><strong>10</strong></td><td></td><td></td><td>d</td><td>d</td></tr>
</table>
<p>Groups: rows 01+11 in columns 00,01 → <strong>BC'</strong> · rows 01+11 in column 10 → <strong>BD'</strong> · the 1 at (00,11) with the d at (10,11) via the top-bottom wrap → <strong>B'CD</strong>. Answer: <strong>X = BD' + BC' + B'CD</strong>.</p>
<p class="nhan">(c) Output Y. Y = 1 for inputs 1, 2, 5, 6:</p>
<table>
<tr><th>AB \\ CD</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td><strong>00</strong></td><td></td><td><strong>1</strong></td><td></td><td><strong>1</strong></td></tr>
<tr><td><strong>01</strong></td><td></td><td><strong>1</strong></td><td></td><td><strong>1</strong></td></tr>
<tr><td><strong>11</strong></td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td><strong>10</strong></td><td></td><td></td><td>d</td><td>d</td></tr>
</table>
<p>Column 01 in rows 00+01 → A' with C=0, D=1 → <strong>A'C'D</strong>. Column 10 in rows 00+01 → A' with C=1, D=0 → <strong>A'CD'</strong>. Answer: <strong>Y = A'C'D + A'CD'</strong>, which is simply <code>A'·(C ⊕ D)</code>.</p>
<p class="nhan">(d) Output Z, the least significant bit. Z = 1 exactly when D = 0:</p>
<table>
<tr><th>AB \\ CD</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td><strong>00</strong></td><td><strong>1</strong></td><td></td><td></td><td><strong>1</strong></td></tr>
<tr><td><strong>01</strong></td><td><strong>1</strong></td><td></td><td></td><td><strong>1</strong></td></tr>
<tr><td><strong>11</strong></td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td><strong>10</strong></td><td><strong>1</strong></td><td></td><td>d</td><td>d</td></tr>
</table>
<p>Columns 00 and 10 (the left-right wrap), all four rows, absorbing two d cells → <strong>Z = D'</strong>. One inverter for the whole output bit.</p>
<ul>
<li><strong>Z is the clearest demonstration of what don't cares buy you.</strong> Without the two d cells in column 10 the group would break and you would need two terms instead of one. The answer Z = D' also makes arithmetic sense: adding 1 always flips the last bit, and 9+1=0 keeps that true.</li>
<li><strong>Treat each d independently, and per map.</strong> A cell may be taken as 1 on map (a) and as 0 on map (b). There is no obligation to be consistent between outputs — each output is its own circuit.</li>
<li><strong>Never build a group out of d cells alone.</strong> A group of four d cells and no real 1 adds a gate that does nothing except turn impossible inputs into 1s. Every group must contain at least one genuine 1.</li>
<li><strong>The three-term result for X is worth staring at.</strong> Three terms for four minterms is not obviously "minimal", and it is a good illustration that don't cares make the search space bigger, not smaller — you gain freedom and therefore more choices to check.</li>
<li><strong>Connection forward.</strong> Four separate minimised functions over shared inputs is exactly the shape of a ROM (slide 33) or a PLA (slide 53): one input decoder, several output columns. Build the same thing with a memory instead of gates and you have a lookup table.</li>
</ul>
<p class="dap-an">✅ Machine check, and it caught a real error. All four expressions were tested in Python against the <strong>ten meaningful rows only</strong> (0–9), skipping the six don't cares. W = AD' + A'BCD ✓ · X = BD' + BC' + B'CD ✓ · Y = A'C'D + A'CD' ✓ (and Y = A'(C ⊕ D) ✓) · Z = D' ✓. <strong>The text extracted from the .pptx reads the third term of X as "BCD", losing the overbar.</strong> The machine rejected that: <code>BD' + BC' + BCD</code> is wrong for inputs 0011 and 0111. The correct term is <strong>B'CD</strong>. Reported here rather than copied silently.</p>
<p class="pitfall">⚠️ When you verify a design with don't cares, only check the rows that can actually occur. Testing all 16 rows will report "failures" on the six impossible ones — and those failures mean nothing at all.</p>`,
        `<p class="y-chinh">🎯 Bốn bìa Karnaugh, mỗi bit đầu ra một bìa, sáu mã đầu vào bất khả được đánh dấu <strong>d</strong> — và các nhóm khoanh CỐ Ý nuốt luôn một số ô d để phình to ra. Đây là <strong>bài giải số 4: rút gọn bốn biến CÓ điều kiện không quan tâm</strong>.</p>
<p class="nhan">(a) Đầu ra W, bit trọng số cao nhất. W = 1 chỉ ở đầu vào 7 (0111) và 8 (1000):</p>
<table>
<tr><th>AB \\ CD</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td><strong>00</strong></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>01</strong></td><td></td><td></td><td><strong>1</strong></td><td></td></tr>
<tr><td><strong>11</strong></td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td><strong>10</strong></td><td><strong>1</strong></td><td></td><td>d</td><td>d</td></tr>
</table>
<p>Số 1 lẻ loi ở (01,11) không có hàng xóm nào dùng được → <strong>A'BCD</strong>. Số 1 ở (10,00) gom được với ô d ở (11,00) và, nhờ cuộn mép, với (11,10) và (10,10) → cả ô vuông có A=1 và D=0 → <strong>AD'</strong>. Đáp số: <strong>W = AD' + A'BCD</strong>.</p>
<p class="nhan">(b) Đầu ra X. X = 1 ở đầu vào 3, 4, 5, 6:</p>
<table>
<tr><th>AB \\ CD</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td><strong>00</strong></td><td></td><td></td><td><strong>1</strong></td><td></td></tr>
<tr><td><strong>01</strong></td><td><strong>1</strong></td><td><strong>1</strong></td><td></td><td><strong>1</strong></td></tr>
<tr><td><strong>11</strong></td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td><strong>10</strong></td><td></td><td></td><td>d</td><td>d</td></tr>
</table>
<p>Các nhóm: hàng 01+11 ở cột 00,01 → <strong>BC'</strong> · hàng 01+11 ở cột 10 → <strong>BD'</strong> · số 1 ở (00,11) ghép với ô d ở (10,11) qua cuộn trên–dưới → <strong>B'CD</strong>. Đáp số: <strong>X = BD' + BC' + B'CD</strong>.</p>
<p class="nhan">(c) Đầu ra Y. Y = 1 ở đầu vào 1, 2, 5, 6:</p>
<table>
<tr><th>AB \\ CD</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td><strong>00</strong></td><td></td><td><strong>1</strong></td><td></td><td><strong>1</strong></td></tr>
<tr><td><strong>01</strong></td><td></td><td><strong>1</strong></td><td></td><td><strong>1</strong></td></tr>
<tr><td><strong>11</strong></td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td><strong>10</strong></td><td></td><td></td><td>d</td><td>d</td></tr>
</table>
<p>Cột 01 ở hàng 00+01 → A' với C=0, D=1 → <strong>A'C'D</strong>. Cột 10 ở hàng 00+01 → A' với C=1, D=0 → <strong>A'CD'</strong>. Đáp số: <strong>Y = A'C'D + A'CD'</strong>, mà viết gọn chính là <code>A'·(C ⊕ D)</code>.</p>
<p class="nhan">(d) Đầu ra Z, bit thấp nhất. Z = 1 đúng khi D = 0:</p>
<table>
<tr><th>AB \\ CD</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><td><strong>00</strong></td><td><strong>1</strong></td><td></td><td></td><td><strong>1</strong></td></tr>
<tr><td><strong>01</strong></td><td><strong>1</strong></td><td></td><td></td><td><strong>1</strong></td></tr>
<tr><td><strong>11</strong></td><td>d</td><td>d</td><td>d</td><td>d</td></tr>
<tr><td><strong>10</strong></td><td><strong>1</strong></td><td></td><td>d</td><td>d</td></tr>
</table>
<p>Cột 00 và cột 10 (cuộn trái–phải), cả bốn hàng, nuốt luôn hai ô d → <strong>Z = D'</strong>. Đúng MỘT bộ đảo cho cả một bit đầu ra.</p>
<ul>
<li><strong>Z là minh hoạ rõ nhất về cái mà don't care mua cho bạn.</strong> Không có hai ô d ở cột 10 thì nhóm bị đứt và bạn cần hai số hạng thay vì một. Đáp số Z = D' cũng hợp lý về SỐ HỌC: cộng 1 luôn lật bit cuối, và 9+1=0 vẫn giữ đúng điều đó.</li>
<li><strong>Xử lý mỗi ô d ĐỘC LẬP, và độc lập theo từng bìa.</strong> Một ô có thể được coi là 1 trên bìa (a) và là 0 trên bìa (b). Không có nghĩa vụ nhất quán giữa các đầu ra — mỗi đầu ra là một mạch riêng.</li>
<li><strong>Không bao giờ dựng một nhóm CHỈ toàn ô d.</strong> Một nhóm bốn ô d mà không có số 1 thật nào thì chỉ thêm một cổng chẳng làm gì ngoài việc biến những đầu vào bất khả thành số 1. Mọi nhóm phải chứa ít nhất một số 1 THẬT.</li>
<li><strong>Kết quả ba số hạng cho X đáng nhìn kỹ.</strong> Ba số hạng cho bốn minterm không hiển nhiên là "tối thiểu", và nó minh hoạ tốt rằng don't care làm KHÔNG GIAN TÌM KIẾM RỘNG RA chứ không hẹp lại — bạn có thêm tự do nên có thêm phương án phải kiểm.</li>
<li><strong>Nối về phía trước.</strong> Bốn hàm rút gọn riêng trên cùng bộ đầu vào chính là hình hài của một ROM (slide 33) hoặc một PLA (slide 53): một bộ giải mã đầu vào, vài cột đầu ra. Dựng đúng thứ đó bằng bộ nhớ thay vì bằng cổng thì bạn có một bảng tra.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng máy, và nó bắt được một lỗi thật. Cả bốn biểu thức được thử trong Python với <strong>CHỈ mười dòng có nghĩa</strong> (0–9), bỏ qua sáu ô không quan tâm. W = AD' + A'BCD ✓ · X = BD' + BC' + B'CD ✓ · Y = A'C'D + A'CD' ✓ (và Y = A'(C ⊕ D) ✓) · Z = D' ✓. <strong>Chữ trích từ .pptx đọc số hạng thứ ba của X thành "BCD", làm mất dấu gạch trên.</strong> Máy bác bỏ ngay: <code>BD' + BC' + BCD</code> SAI ở đầu vào 0011 và 0111. Số hạng đúng là <strong>B'CD</strong>. Nêu ra ở đây thay vì chép im lặng.</p>
<p class="pitfall">⚠️ Khi nghiệm thu một thiết kế có don't care, chỉ kiểm những dòng THẬT SỰ xảy ra được. Thử cả 16 dòng thì sẽ báo "sai" ở sáu dòng bất khả — và những cái "sai" đó chẳng có nghĩa gì hết.</p>`],

      [22, 'Table 12.6 — First Stage of the Quine–McCluskey Method',
        `<p class="y-chinh">🎯 Karnaugh maps run out of road at four or five variables. Quine–McCluskey is <strong>the same merging idea turned into a table-driven procedure a computer can execute</strong> — and this slide is stage one: list every minterm, sorted by how many 1s it contains, then merge neighbours.</p>
<p class="nhan">The legible table on the slide, exactly as printed — eight minterms of a four-variable function:</p>
<table>
<tr><th>Product term</th><th>Index</th><th>A</th><th>B</th><th>C</th><th>D</th><th>merged?</th></tr>
<tr><td>A'B'C'D</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>✓</td></tr>
<tr><td>A'BC'D</td><td>5</td><td>0</td><td>1</td><td>0</td><td>1</td><td>✓</td></tr>
<tr><td>A'BCD'</td><td>6</td><td>0</td><td>1</td><td>1</td><td>0</td><td>✓</td></tr>
<tr><td>ABC'D'</td><td>12</td><td>1</td><td>1</td><td>0</td><td>0</td><td>✓</td></tr>
<tr><td>A'BCD</td><td>7</td><td>0</td><td>1</td><td>1</td><td>1</td><td>✓</td></tr>
<tr><td>AB'CD</td><td>11</td><td>1</td><td>0</td><td>1</td><td>1</td><td>✓</td></tr>
<tr><td>ABC'D</td><td>13</td><td>1</td><td>1</td><td>0</td><td>1</td><td>✓</td></tr>
<tr><td>ABCD</td><td>15</td><td>1</td><td>1</td><td>1</td><td>1</td><td>✓</td></tr>
</table>
<p>So the function being minimised is <code>F = A'B'C'D + A'BC'D + A'BCD' + ABC'D' + A'BCD + AB'CD + ABC'D + ABCD</code> — minterms {1, 5, 6, 7, 11, 12, 13, 15}.</p>
<ul>
<li><strong>Why the rows are sorted by index.</strong> The list is grouped by the <em>number of 1 bits</em> (1 and 12 have… in fact the slide's order groups indices 1, 5, 6, 12 then 7, 11, 13, 15 — two 1-bits and then three 1-bits and up). Two minterms can only merge if they differ in exactly one bit, which means their 1-counts differ by exactly one. Sorting this way means you only ever compare adjacent groups, which is what makes the method fast enough for a computer.</li>
<li><strong>The merging rule is one line of Boolean algebra.</strong> <code>XY + XY' = X</code>. Two terms identical except in one position collapse, and that position is written as a dash. Minterms 5 (0101) and 7 (0111) differ only in C → they merge to 01–1, i.e. <strong>A'BD</strong>.</li>
<li><strong>Repeat until nothing merges.</strong> Stage two merges pairs into quads, stage three quads into octets. Any term never ticked off at any stage is a <strong>prime implicant</strong> — a group that cannot be made larger. Those are the candidates that go into the chart on slide 23.</li>
<li><strong>It is exactly a Karnaugh map without the picture.</strong> A pair that merges here is two adjacent cells there; a quad here is a 2×2 block there. The advantage is that nothing depends on your eye, so it works at 10 or 20 variables where no drawing could.</li>
<li><strong>Warning about this slide's rendering.</strong> As with slide 8, the converted deck lays several illegible shrunken copies of the table underneath the readable one, and the caption line <em>"(for F = ABCD + ABC'…"</em> is <strong>cut off</strong> mid-expression. The full function above was reconstructed from the eight index rows that <em>are</em> legible, and the reconstruction was checked by machine.</li>
</ul>
<p class="dap-an">✅ Machine check: Python was given the minterm set {1, 5, 6, 7, 11, 12, 13, 15} and asked to enumerate every prime implicant by brute force over all 16 cells. It found exactly five: <strong>BD · A'BC · A'C'D · ABC' · ACD</strong>. That is the complete candidate list for slide 23, computed independently of the slide.</p>
<p class="meo">💡 Converting a merged row to a term: a 0 means the complemented variable, a 1 the plain one, and a dash means the variable is gone. 1–01 over ABCD reads A · C' · D.</p>`,
        `<p class="y-chinh">🎯 Bìa Karnaugh hết đường ở bốn năm biến. Quine–McCluskey là <strong>vẫn ý tưởng gộp đó nhưng biến thành một thủ tục chạy bằng bảng mà máy tính thực hiện được</strong> — và slide này là giai đoạn một: liệt kê mọi minterm, sắp theo số bit 1 mà nó chứa, rồi gộp các cái kề nhau.</p>
<p class="nhan">Bảng đọc được trên slide, đúng như in — tám minterm của một hàm bốn biến:</p>
<table>
<tr><th>Số hạng tích</th><th>Index</th><th>A</th><th>B</th><th>C</th><th>D</th><th>đã gộp?</th></tr>
<tr><td>A'B'C'D</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>✓</td></tr>
<tr><td>A'BC'D</td><td>5</td><td>0</td><td>1</td><td>0</td><td>1</td><td>✓</td></tr>
<tr><td>A'BCD'</td><td>6</td><td>0</td><td>1</td><td>1</td><td>0</td><td>✓</td></tr>
<tr><td>ABC'D'</td><td>12</td><td>1</td><td>1</td><td>0</td><td>0</td><td>✓</td></tr>
<tr><td>A'BCD</td><td>7</td><td>0</td><td>1</td><td>1</td><td>1</td><td>✓</td></tr>
<tr><td>AB'CD</td><td>11</td><td>1</td><td>0</td><td>1</td><td>1</td><td>✓</td></tr>
<tr><td>ABC'D</td><td>13</td><td>1</td><td>1</td><td>0</td><td>1</td><td>✓</td></tr>
<tr><td>ABCD</td><td>15</td><td>1</td><td>1</td><td>1</td><td>1</td><td>✓</td></tr>
</table>
<p>Vậy hàm đang được rút gọn là <code>F = A'B'C'D + A'BC'D + A'BCD' + ABC'D' + A'BCD + AB'CD + ABC'D + ABCD</code> — tập minterm {1, 5, 6, 7, 11, 12, 13, 15}.</p>
<ul>
<li><strong>Vì sao các dòng được sắp theo index.</strong> Danh sách được nhóm theo <em>SỐ BIT 1</em> (slide xếp index 1, 5, 6, 12 rồi tới 7, 11, 13, 15 — nhóm ít bit 1 trước, nhiều bit 1 sau). Hai minterm chỉ gộp được nếu chúng khác nhau ĐÚNG một bit, mà điều đó kéo theo số bit 1 của chúng lệch nhau đúng một. Sắp như vậy nghĩa là bạn chỉ phải so hai nhóm kề nhau — chính điều đó làm phương pháp đủ nhanh cho máy tính.</li>
<li><strong>Luật gộp chỉ là một dòng đại số Boole.</strong> <code>XY + XY' = X</code>. Hai số hạng giống hệt nhau trừ một vị trí thì thu về một, và vị trí đó viết thành dấu gạch. Minterm 5 (0101) và 7 (0111) chỉ khác ở C → gộp thành 01–1, tức <strong>A'BD</strong>.</li>
<li><strong>Lặp cho tới khi không gộp được nữa.</strong> Giai đoạn hai gộp cặp thành bộ bốn, giai đoạn ba gộp bộ bốn thành bộ tám. Số hạng nào KHÔNG bị đánh dấu ở bất kỳ giai đoạn nào là một <strong>prime implicant</strong> — một nhóm không thể phình to hơn. Đó là danh sách ứng viên đi vào bảng ở slide 23.</li>
<li><strong>Nó ĐÚNG là bìa Karnaugh bỏ phần hình vẽ.</strong> Một cặp gộp được ở đây là hai ô kề nhau ở kia; một bộ bốn ở đây là khối 2×2 ở kia. Ưu thế là không có gì phụ thuộc vào mắt bạn, nên nó chạy được ở 10 hay 20 biến, chỗ không bản vẽ nào theo nổi.</li>
<li><strong>Cảnh báo về cách hiển thị slide này.</strong> Giống slide 8, bản chuyển đổi đặt vài bản thu nhỏ không đọc nổi của chính cái bảng nằm dưới bảng đọc được, và dòng chú <em>"(for F = ABCD + ABC'…"</em> bị <strong>CẮT CỤT</strong> giữa biểu thức. Hàm đầy đủ ở trên được dựng lại từ tám dòng index <em>đọc được</em>, và bản dựng lại đó đã được kiểm bằng máy.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng máy: Python được đưa tập minterm {1, 5, 6, 7, 11, 12, 13, 15} rồi bảo vét cạn mọi prime implicant trên cả 16 ô. Nó tìm ra đúng năm cái: <strong>BD · A'BC · A'C'D · ABC' · ACD</strong>. Đó là danh sách ứng viên đầy đủ cho slide 23, tính ra ĐỘC LẬP với slide.</p>
<p class="meo">💡 Đổi một dòng đã gộp thành số hạng: bit 0 nghĩa là biến dạng bù, bit 1 là dạng thường, còn dấu gạch nghĩa là biến đó đã biến mất. Dòng 1–01 trên ABCD đọc là A · C' · D.</p>`],

      [23, 'Table 12.7 — Last Stage of the Quine–McCluskey Method (the prime implicant chart)',
        `<p class="y-chinh">🎯 The final stage: a grid with <strong>prime implicants down the side and the original minterms across the top</strong>, an X wherever an implicant covers a minterm. Then you pick the smallest set of rows that puts at least one X in every column. That is the minimum-cost cover.</p>
<p class="nhan">The chart for F, minterms {1, 5, 6, 7, 11, 12, 13, 15}:</p>
<table>
<tr><th>Prime implicant</th><th>1</th><th>5</th><th>6</th><th>7</th><th>11</th><th>12</th><th>13</th><th>15</th></tr>
<tr><td><strong>BD</strong></td><td></td><td>X</td><td></td><td>X</td><td></td><td></td><td>X</td><td>X</td></tr>
<tr><td><strong>A'C'D</strong></td><td>X</td><td>X</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>A'BC</strong></td><td></td><td></td><td>X</td><td>X</td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>ABC'</strong></td><td></td><td></td><td></td><td></td><td></td><td>X</td><td>X</td><td></td></tr>
<tr><td><strong>ACD</strong></td><td></td><td></td><td></td><td></td><td>X</td><td></td><td></td><td>X</td></tr>
</table>
<p class="nhan">Now read the columns that contain exactly one X — those force a choice:</p>
<table>
<tr><th>Column</th><th>Covered only by</th><th>Conclusion</th></tr>
<tr><td>1</td><td>A'C'D</td><td>A'C'D is <strong>essential</strong></td></tr>
<tr><td>6</td><td>A'BC</td><td>A'BC is <strong>essential</strong></td></tr>
<tr><td>11</td><td>ACD</td><td>ACD is <strong>essential</strong></td></tr>
<tr><td>12</td><td>ABC'</td><td>ABC' is <strong>essential</strong></td></tr>
</table>
<p class="dap-an">✅ Those four essential prime implicants already cover columns 1, 5, 6, 7, 11, 12, 13 and 15 — <em>everything</em>. So <strong>F = A'C'D + A'BC + ABC' + ACD</strong>, four terms, sixteen literals. And <strong>BD is redundant</strong>: each of its four minterms (5, 7, 13, 15) is already covered by one of the essential terms. Both the four-term answer and the five-term answer including BD compute the correct function, but the four-term one is the minimum. Verified in Python by brute-force search over every subset of the five prime implicants.</p>
<ul>
<li><strong>The essential-prime-implicant rule, stated once.</strong> If a minterm is covered by exactly one prime implicant, that implicant <em>must</em> be in the answer — there is no alternative. Take all essentials first, cross off everything they cover, and only then worry about what is left. Here nothing was left.</li>
<li><strong>The last step is a set-cover problem, and set cover is NP-hard.</strong> For small charts you can eyeball it; in general, minimisation tools use heuristics. That is genuinely why real synthesis tools (Espresso and its descendants) do not promise the absolute minimum — they promise a very good answer quickly.</li>
<li><strong>Don't cares fit here too.</strong> A don't-care minterm is used when <em>generating</em> prime implicants (it may enlarge a group) but gets <strong>no column</strong> in the chart — because you are under no obligation to cover it. That asymmetry is the whole trick, and it is worth one sentence in an exam answer.</li>
<li><strong>Why the method beats a K-map on reliability, not just on size.</strong> A K-map answer depends on which rectangles you happened to notice. This chart is exhaustive: every prime implicant is listed, every minterm is a column, and nothing can be overlooked. The cost is tedium.</li>
<li><strong>Warning about this slide's rendering.</strong> Table 12.7 is affected by the same overlay fault as slides 8 and 22 — a readable grid with unreadable shrunken copies beneath it, and the same truncated caption. The chart above was rebuilt from the machine-computed prime implicants and the minterm list of slide 22, and it agrees with every label that <em>is</em> legible on the slide (BD and ACD appear as row labels there).</li>
</ul>
<p class="pitfall">⚠️ "Prime implicant" and "essential prime implicant" are different things, and exam questions ask for them separately. Prime = cannot be enlarged (there are five here). Essential = it is the only cover of some minterm (there are four here). Every essential is prime; not every prime is essential — BD is the counterexample sitting right in this chart.</p>`,
        `<p class="y-chinh">🎯 Giai đoạn cuối: một lưới có <strong>prime implicant ở cạnh dọc và các minterm gốc ở cạnh ngang</strong>, đánh dấu X ở mọi chỗ một implicant phủ một minterm. Rồi bạn chọn TẬP HÀNG NHỎ NHẤT sao cho mọi cột đều có ít nhất một dấu X. Đó là phủ có chi phí tối thiểu.</p>
<p class="nhan">Bảng cho F, minterm {1, 5, 6, 7, 11, 12, 13, 15}:</p>
<table>
<tr><th>Prime implicant</th><th>1</th><th>5</th><th>6</th><th>7</th><th>11</th><th>12</th><th>13</th><th>15</th></tr>
<tr><td><strong>BD</strong></td><td></td><td>X</td><td></td><td>X</td><td></td><td></td><td>X</td><td>X</td></tr>
<tr><td><strong>A'C'D</strong></td><td>X</td><td>X</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>A'BC</strong></td><td></td><td></td><td>X</td><td>X</td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>ABC'</strong></td><td></td><td></td><td></td><td></td><td></td><td>X</td><td>X</td><td></td></tr>
<tr><td><strong>ACD</strong></td><td></td><td></td><td></td><td></td><td>X</td><td></td><td></td><td>X</td></tr>
</table>
<p class="nhan">Bây giờ đọc những cột chỉ có ĐÚNG MỘT dấu X — chúng ép ra lựa chọn:</p>
<table>
<tr><th>Cột</th><th>Chỉ được phủ bởi</th><th>Kết luận</th></tr>
<tr><td>1</td><td>A'C'D</td><td>A'C'D là <strong>THIẾT YẾU</strong></td></tr>
<tr><td>6</td><td>A'BC</td><td>A'BC là <strong>THIẾT YẾU</strong></td></tr>
<tr><td>11</td><td>ACD</td><td>ACD là <strong>THIẾT YẾU</strong></td></tr>
<tr><td>12</td><td>ABC'</td><td>ABC' là <strong>THIẾT YẾU</strong></td></tr>
</table>
<p class="dap-an">✅ Bốn prime implicant thiết yếu đó đã phủ các cột 1, 5, 6, 7, 11, 12, 13 và 15 — <em>TẤT CẢ</em>. Vậy <strong>F = A'C'D + A'BC + ABC' + ACD</strong>, bốn số hạng, mười sáu chữ. Và <strong>BD là DƯ</strong>: cả bốn minterm của nó (5, 7, 13, 15) đều đã được một số hạng thiết yếu phủ. Cả đáp án bốn số hạng lẫn đáp án năm số hạng có BD đều tính ĐÚNG hàm, nhưng bản bốn số hạng mới là tối thiểu. Đã kiểm trong Python bằng cách vét cạn mọi tập con của năm prime implicant.</p>
<ul>
<li><strong>Luật prime implicant thiết yếu, nói một lần.</strong> Nếu một minterm chỉ được ĐÚNG MỘT prime implicant phủ thì implicant đó <em>BẮT BUỘC</em> có mặt trong đáp án — không có phương án nào khác. Lấy hết các cái thiết yếu trước, gạch bỏ mọi thứ chúng phủ, rồi mới lo phần còn lại. Ở đây thì chẳng còn lại gì.</li>
<li><strong>Bước cuối là bài toán PHỦ TẬP, mà phủ tập là NP-khó.</strong> Bảng nhỏ thì nhìn mắt được; nói chung thì công cụ rút gọn phải dùng heuristic. Đó thật sự là lý do các công cụ tổng hợp mạch thật (Espresso và hậu duệ) KHÔNG hứa hẹn cực tiểu tuyệt đối — chúng hứa một đáp án rất tốt, thật nhanh.</li>
<li><strong>Don't care cũng khớp vào đây.</strong> Một minterm don't care được dùng khi <em>SINH</em> prime implicant (nó có thể làm nhóm to ra) nhưng KHÔNG có <strong>cột</strong> nào trong bảng — vì bạn không có nghĩa vụ phủ nó. Sự bất đối xứng đó chính là toàn bộ mẹo, và đáng viết một câu trong bài thi.</li>
<li><strong>Vì sao phương pháp này hơn bìa K ở ĐỘ TIN CẬY, không chỉ ở kích thước.</strong> Đáp án bìa K phụ thuộc vào việc bạn TÌNH CỜ nhìn ra hình chữ nhật nào. Cái bảng này thì vét cạn: mọi prime implicant đều có mặt, mọi minterm đều là một cột, không gì lọt được. Cái giá phải trả là sự nhàm chán.</li>
<li><strong>Cảnh báo về cách hiển thị slide này.</strong> Table 12.7 dính đúng lỗi chồng hình như slide 8 và 22 — một lưới đọc được cùng những bản thu nhỏ không đọc nổi nằm dưới, và cùng cái chú thích bị cắt cụt. Bảng ở trên được dựng lại từ danh sách prime implicant do máy tính ra cộng danh sách minterm của slide 22, và nó khớp với mọi nhãn <em>đọc được</em> trên slide (BD và ACD hiện ra làm nhãn hàng ở đó).</li>
</ul>
<p class="pitfall">⚠️ "Prime implicant" và "prime implicant THIẾT YẾU" là hai thứ khác nhau, và đề thi hỏi riêng từng thứ. Prime = không phình to hơn được (ở đây có NĂM). Thiết yếu = nó là cái DUY NHẤT phủ một minterm nào đó (ở đây có BỐN). Mọi cái thiết yếu đều là prime; không phải cái prime nào cũng thiết yếu — BD là phản ví dụ nằm ngay trong bảng này.</p>`],

      [24, 'Figure 12.13 — NAND Implementation of Table 12.4 (and the cost of gate levels)',
        `<p class="y-chinh">🎯 The simplified function <code>F = A'B + BC'</code> built from <strong>three NAND gates only</strong>: NAND(A', B) and NAND(B, C') feeding a third NAND whose output is F. Two levels — exactly as many as the AND-OR version of slide 16.</p>
<p class="nhan">Why the substitution is free, in three lines of algebra:</p>
<table>
<tr><th>Step</th><th>Expression</th><th>Reason</th></tr>
<tr><td>1</td><td>F = A'B + BC'</td><td>the minimised SOP</td></tr>
<tr><td>2</td><td>F = ((A'B) + (BC'))''</td><td>double complement — changes nothing</td></tr>
<tr><td>3</td><td>F = ((A'B)' · (BC')')'</td><td>De Morgan on the inner bar</td></tr>
</table>
<p>Line 3 <em>is</em> the diagram: <code>(A'B)'</code> is the first NAND, <code>(BC')'</code> the second, and the outer complement of their product is the third NAND.</p>
<ul>
<li><strong>The universal recipe.</strong> Any two-level AND-OR circuit becomes a two-level NAND-NAND circuit by replacing every gate, one for one, with a NAND. No extra levels, no extra delay, no re-derivation. Every AND-OR-Invert library in the world rests on this.</li>
<li><strong>The dual recipe.</strong> Any two-level OR-AND (product of sums, slide 15) circuit becomes a two-level NOR-NOR circuit the same way. Slide 11 is the gate-level half of that statement.</li>
<li><strong>Counting levels is the performance model of combinational logic.</strong> Total delay = (levels) × (delay per gate). This circuit: 2 levels, plus 1 for the inverters producing A' and C'. If one gate takes 10 ps, F settles about 30 ps after the inputs change.</li>
</ul>
<p class="nhan">Where levels really hurt — <strong>the 4-bit ripple-carry adder</strong> (the chapter's Figure 12.21, slide 36, brought forward because this is the slide about gate depth):</p>
<table>
<tr><th>Stage</th><th>Inputs</th><th>Carry out of the stage</th><th>Gate levels from A/B arriving to that carry being valid</th></tr>
<tr><td>bit 0</td><td>A0, B0, Cin</td><td>C1 = A0B0 + A0Cin + B0Cin</td><td>2 (AND level, OR level)</td></tr>
<tr><td>bit 1</td><td>A1, B1, C1</td><td>C2</td><td>4</td></tr>
<tr><td>bit 2</td><td>A2, B2, C2</td><td>C3</td><td>6</td></tr>
<tr><td>bit 3</td><td>A3, B3, C3</td><td>C4 (the overflow carry)</td><td><strong>8</strong></td></tr>
</table>
<ul>
<li><strong>The formula: 2n gate levels for an n-bit ripple-carry adder.</strong> 4 bits → 8 levels; 32 bits → 64 levels; 64 bits → 128 levels. At 10 ps per gate, a 64-bit ripple adder takes about 1.3 ns — which at 3 GHz is four clock cycles just to add two integers.</li>
<li><strong>That is why carry-lookahead exists.</strong> Instead of waiting for each carry to ripple, you compute <em>generate</em> (G<sub>i</sub> = A<sub>i</sub>B<sub>i</sub>: this bit makes a carry regardless) and <em>propagate</em> (P<sub>i</sub> = A<sub>i</sub> ⊕ B<sub>i</sub>: this bit passes a carry along), then express every carry directly in terms of the inputs: C1 = G0 + P0·Cin, C2 = G1 + P1G0 + P1P0Cin, and so on. Each of those is two levels deep <em>no matter which bit it is</em>, so the whole adder becomes a fixed small depth at the price of many more gates.</li>
<li><strong>The trade is the one this whole chapter keeps making.</strong> Ripple carry: few gates, delay grows linearly with width. Lookahead: many gates, delay roughly constant. Chapter 11 (Computer Arithmetic) and the ALU of Chapter 16 both buy the second one, because the adder sits on the processor's critical path.</li>
<li><strong>Why this belongs on a NAND slide.</strong> Everything above is measured in <em>levels of gates</em>, and the point of Figure 12.13 is that the AND-OR-to-NAND conversion adds none. Optimisations that change the level count are worth chasing; optimisations that only change the gate count are worth much less on a critical path.</li>
</ul>
<p class="dap-an">✅ Machine check: the three-NAND network above matches Table 12.4 on all 8 rows. Separately, a 4-bit ripple-carry adder built from <code>SUM = A ⊕ B ⊕ Cin</code> and <code>Cout = AB + ACin + BCin</code> was simulated in Python for <strong>all 16 × 16 × 2 = 512 combinations</strong> of x, y and carry-in, and the 5-bit result equalled x + y + cin every single time.</p>
<p class="pitfall">⚠️ You cannot convert a <em>three-level</em> AND-OR-AND circuit to NAND by blind substitution. The one-for-one rule works because inverted-output gates alternate correctly in a strictly two-level AND-OR network. For deeper circuits you must push the complements through with De Morgan explicitly, level by level.</p>`,
        `<p class="y-chinh">🎯 Hàm đã rút gọn <code>F = A'B + BC'</code> dựng bằng <strong>đúng ba cổng NAND</strong>: NAND(A', B) và NAND(B, C') đổ vào một NAND thứ ba, đầu ra là F. Hai tầng — đúng bằng số tầng của bản AND-OR ở slide 16.</p>
<p class="nhan">Vì sao phép thay đó MIỄN PHÍ, trong ba dòng đại số:</p>
<table>
<tr><th>Bước</th><th>Biểu thức</th><th>Lý do</th></tr>
<tr><td>1</td><td>F = A'B + BC'</td><td>SOP đã rút gọn</td></tr>
<tr><td>2</td><td>F = ((A'B) + (BC'))''</td><td>hai lần bù — không đổi gì</td></tr>
<tr><td>3</td><td>F = ((A'B)' · (BC')')'</td><td>De Morgan cho gạch bên trong</td></tr>
</table>
<p>Dòng 3 CHÍNH LÀ cái sơ đồ: <code>(A'B)'</code> là NAND thứ nhất, <code>(BC')'</code> là NAND thứ hai, và dấu bù ngoài của tích hai cái đó là NAND thứ ba.</p>
<ul>
<li><strong>Công thức nấu tổng quát.</strong> Mọi mạch AND-OR hai tầng đều thành mạch NAND-NAND hai tầng bằng cách thay từng cổng một-đổi-một thành NAND. Không thêm tầng, không thêm trễ, không phải suy lại. Mọi thư viện AND-OR-Invert trên đời đều đứng trên điều này.</li>
<li><strong>Công thức đối ngẫu.</strong> Mọi mạch OR-AND hai tầng (tích các tổng, slide 15) thành mạch NOR-NOR hai tầng theo đúng cách đó. Slide 11 là nửa "mức cổng" của phát biểu này.</li>
<li><strong>Đếm TẦNG là mô hình hiệu năng của logic tổ hợp.</strong> Tổng độ trễ = (số tầng) × (độ trễ mỗi cổng). Mạch này: 2 tầng, cộng 1 tầng cho hai bộ đảo tạo A' và C'. Nếu một cổng mất 10 ps thì F ổn định khoảng 30 ps sau khi đầu vào thay đổi.</li>
</ul>
<p class="nhan">Chỗ số tầng THẬT SỰ đau — <strong>bộ cộng nối tiếp (ripple-carry) 4 bit</strong> (Figure 12.21 của chương, slide 36, kéo về đây vì đây là slide nói về độ sâu cổng):</p>
<table>
<tr><th>Tầng</th><th>Đầu vào</th><th>Nhớ ra của tầng</th><th>Số tầng cổng từ lúc A/B tới cho tới khi nhớ đó có giá trị đúng</th></tr>
<tr><td>bit 0</td><td>A0, B0, Cin</td><td>C1 = A0B0 + A0Cin + B0Cin</td><td>2 (tầng AND, tầng OR)</td></tr>
<tr><td>bit 1</td><td>A1, B1, C1</td><td>C2</td><td>4</td></tr>
<tr><td>bit 2</td><td>A2, B2, C2</td><td>C3</td><td>6</td></tr>
<tr><td>bit 3</td><td>A3, B3, C3</td><td>C4 (nhớ tràn)</td><td><strong>8</strong></td></tr>
</table>
<ul>
<li><strong>Công thức: 2n tầng cổng cho bộ cộng ripple-carry n bit.</strong> 4 bit → 8 tầng; 32 bit → 64 tầng; 64 bit → 128 tầng. Với 10 ps mỗi cổng, bộ cộng ripple 64 bit mất khoảng 1,3 ns — ở 3 GHz thì đó là BỐN chu kỳ đồng hồ chỉ để cộng hai số nguyên.</li>
<li><strong>Đó là lý do carry-lookahead ra đời.</strong> Thay vì chờ từng cái nhớ lan đi, ta tính <em>SINH NHỚ</em> (G<sub>i</sub> = A<sub>i</sub>B<sub>i</sub>: bit này tự tạo ra nhớ bất kể cái gì) và <em>LAN NHỚ</em> (P<sub>i</sub> = A<sub>i</sub> ⊕ B<sub>i</sub>: bit này chuyển tiếp cái nhớ đi qua), rồi viết MỌI cái nhớ trực tiếp theo đầu vào: C1 = G0 + P0·Cin, C2 = G1 + P1G0 + P1P0Cin, v.v. Mỗi biểu thức đó sâu hai tầng <em>bất kể nó là bit thứ mấy</em>, nên cả bộ cộng còn một độ sâu nhỏ cố định, đổi lại là rất nhiều cổng hơn.</li>
<li><strong>Cuộc đánh đổi này đúng là thứ cả chương cứ lặp đi lặp lại.</strong> Ripple carry: ít cổng, độ trễ tăng TUYẾN TÍNH theo độ rộng. Lookahead: nhiều cổng, độ trễ gần như hằng số. Chương 11 (Computer Arithmetic) và khối ALU của Chương 16 đều chọn mua cái thứ hai, vì bộ cộng nằm trên đường găng của bộ xử lý.</li>
<li><strong>Vì sao chuyện này thuộc về một slide NAND.</strong> Mọi thứ ở trên đo bằng <em>SỐ TẦNG CỔNG</em>, và điểm mấu chốt của Figure 12.13 là phép đổi AND-OR sang NAND KHÔNG thêm tầng nào. Tối ưu nào làm đổi số tầng thì đáng đuổi theo; tối ưu chỉ làm đổi số cổng thì đáng ít hơn nhiều khi nằm trên đường găng.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng máy: mạng ba NAND ở trên khớp Table 12.4 trên cả 8 dòng. Riêng phần bộ cộng, một bộ cộng ripple-carry 4 bit dựng từ <code>SUM = A ⊕ B ⊕ Cin</code> và <code>Cout = AB + ACin + BCin</code> đã được mô phỏng trong Python trên <strong>đủ 16 × 16 × 2 = 512 tổ hợp</strong> của x, y và nhớ vào, và kết quả 5 bit bằng x + y + cin trong từng lượt một.</p>
<p class="pitfall">⚠️ Bạn KHÔNG chuyển được mạch AND-OR-AND <em>ba tầng</em> sang NAND bằng cách thay mù quáng. Luật một-đổi-một chạy được vì các cổng có đầu ra đảo xen kẽ đúng nhịp trong một mạng AND-OR đúng hai tầng. Mạch sâu hơn thì phải đẩy dấu bù đi bằng De Morgan một cách tường minh, từng tầng một.</p>`],

      [25, 'Figure 12.14 — 4-to-1 Multiplexer Representation',
        `<p class="y-chinh">🎯 A black box with <strong>four data inputs D0, D1, D2, D3 on the left, two select inputs S2 and S1 underneath, and one output F on the right</strong>. The multiplexer is a controlled switch: the two select bits name which of the four data lines is copied to the output.</p>
<table>
<tr><th>Signal group</th><th>Count</th><th>Role</th></tr>
<tr><td>Data inputs D0…D3</td><td>2<sup>n</sup> = 4</td><td>The candidates. One of them will appear at F; the other three are ignored.</td></tr>
<tr><td>Select inputs S2, S1</td><td>n = 2</td><td>The address of the chosen input, read as a 2-bit binary number</td></tr>
<tr><td>Output F</td><td>1</td><td>A copy of the selected data input</td></tr>
</table>
<ul>
<li><strong>The sizing rule: 2<sup>n</sup> data inputs need n select lines.</strong> 4-to-1 → 2 selects. 8-to-1 → 3. 16-to-1 → 4. It is the same arithmetic as addressing memory, and for the same reason: choosing one of N things costs log<sub>2</sub>N bits.</li>
<li><strong>Read the name of the select pins carefully.</strong> Stallings writes <strong>S2 and S1</strong>, not S1 and S0. S2 is the more significant bit. Many other textbooks number from 0. If an exam mixes conventions, the truth table on slide 26 is the authority, not the pin name.</li>
<li><strong>What this box <em>is</em>, conceptually.</strong> It is a hardware <code>switch</code> statement, or a hardware array index: <code>F = D[S]</code>. Every time software writes <code>result = options[i]</code>, some multiplexer somewhere did the physical work.</li>
<li><strong>A multiplexer is combinational.</strong> No memory, no clock. Change the selects and the output changes after a couple of gate delays. That is why it belongs in this half of the chapter and not with the registers on slide 48.</li>
<li><strong>The reverse device is the demultiplexer</strong> — one input steered to one of 2<sup>n</sup> outputs. Slide 31 builds one from a decoder. Mux = many to one; demux = one to many. Together they are how a bus shares one set of wires among many senders and receivers, which is the Chapter 3 bus story told at gate level.</li>
</ul>
<p class="meo">💡 The word decodes itself: <em>multi-plex</em> = many channels folded into one. In networking the same word means the same thing over time (time-division multiplexing); here it means the same thing over wires.</p>`,
        `<p class="y-chinh">🎯 Một hộp đen với <strong>bốn đầu vào dữ liệu D0, D1, D2, D3 ở bên trái, hai đầu vào chọn S2 và S1 ở phía dưới, và một đầu ra F ở bên phải</strong>. Bộ dồn kênh là một cái công tắc có điều khiển: hai bit chọn gọi tên đường dữ liệu nào trong bốn đường sẽ được chép ra đầu ra.</p>
<table>
<tr><th>Nhóm tín hiệu</th><th>Số lượng</th><th>Vai trò</th></tr>
<tr><td>Đầu vào dữ liệu D0…D3</td><td>2<sup>n</sup> = 4</td><td>Các ứng viên. Đúng một cái sẽ hiện ở F; ba cái kia bị bỏ qua.</td></tr>
<tr><td>Đầu vào chọn S2, S1</td><td>n = 2</td><td>Địa chỉ của đầu vào được chọn, đọc như một số nhị phân 2 bit</td></tr>
<tr><td>Đầu ra F</td><td>1</td><td>Bản sao của đầu vào dữ liệu đã chọn</td></tr>
</table>
<ul>
<li><strong>Luật cỡ: 2<sup>n</sup> đầu vào dữ liệu cần n đường chọn.</strong> 4-to-1 → 2 đường chọn. 8-to-1 → 3. 16-to-1 → 4. Vẫn là phép tính của việc đánh địa chỉ bộ nhớ, và vì cùng một lý do: chọn một trong N thứ tốn log<sub>2</sub>N bit.</li>
<li><strong>Đọc kỹ TÊN chân chọn.</strong> Stallings viết <strong>S2 và S1</strong>, không phải S1 và S0. S2 là bit trọng số cao hơn. Nhiều sách khác đánh số từ 0. Nếu đề thi trộn quy ước thì bảng chân trị ở slide 26 mới là căn cứ, không phải tên chân.</li>
<li><strong>Về mặt khái niệm, cái hộp này LÀ gì.</strong> Nó là một câu lệnh <code>switch</code> bằng phần cứng, hay một phép lấy chỉ số mảng bằng phần cứng: <code>F = D[S]</code>. Mỗi lần phần mềm viết <code>result = options[i]</code> thì ở đâu đó có một bộ dồn kênh làm phần việc vật lý.</li>
<li><strong>Bộ dồn kênh là mạch TỔ HỢP.</strong> Không nhớ, không đồng hồ. Đổi đường chọn thì đầu ra đổi sau vài độ trễ cổng. Chính vì thế nó thuộc nửa này của chương chứ không nằm cùng thanh ghi ở slide 48.</li>
<li><strong>Thiết bị ngược lại là bộ PHÂN KÊNH (demultiplexer)</strong> — một đầu vào lái tới một trong 2<sup>n</sup> đầu ra. Slide 31 dựng nó từ một bộ giải mã. Mux = nhiều về một; demux = một ra nhiều. Gộp lại, đó là cách một bus chia sẻ một bộ dây cho nhiều bên gửi và bên nhận — chính câu chuyện bus của Chương 3 kể lại ở mức cổng.</li>
</ul>
<p class="meo">💡 Cái tên tự giải mã: <em>multi-plex</em> = nhiều kênh gấp lại thành một. Trong mạng máy tính cùng chữ đó mang cùng nghĩa nhưng theo THỜI GIAN (ghép kênh phân chia thời gian); ở đây nó mang nghĩa đó theo SỢI DÂY.</p>`],

      [26, 'Table 12.8 — 4-to-1 Multiplexer Truth Table',
        `<p class="y-chinh">🎯 Four rows — and notice what makes this truth table unusual: <strong>the output column contains signal names, not 0 and 1</strong>. That is the compact way of writing a table that would otherwise need 2<sup>6</sup> = 64 rows.</p>
<table>
<tr><th>S2</th><th>S1</th><th>F</th><th>Read as</th></tr>
<tr><td>0</td><td>0</td><td>D0</td><td>selects input number 0</td></tr>
<tr><td>0</td><td>1</td><td>D1</td><td>selects input number 1</td></tr>
<tr><td>1</td><td>0</td><td>D2</td><td>selects input number 2</td></tr>
<tr><td>1</td><td>1</td><td>D3</td><td>selects input number 3</td></tr>
</table>
<ul>
<li><strong>S2 S1 read as a binary number gives the index.</strong> 00 → 0, 01 → 1, 10 → 2, 11 → 3. That is the whole specification; there is nothing else to remember about a multiplexer.</li>
<li><strong>Why the compressed form is not cheating.</strong> The device has six inputs (S2, S1, D0…D3), so the full table really does have 64 rows — but 48 of those rows differ only in data lines that are being ignored. Writing D0 in the output column says "whatever that line happens to be", which is precisely correct and forty times shorter.</li>
<li><strong>Expanding one row to check.</strong> Take S2=0, S1=1, D0=0, D1=1, D2=0, D3=0. The table says F = D1 = 1. Now take the same selects with D1=0 and everything else 1: F = 0. The three ignored lines changed value and F did not move — that is the behaviour "F = D1" is asserting.</li>
<li><strong>The Boolean expression this table becomes</strong> is on slide 27: <code>F = D0·S2'S1' + D1·S2'S1 + D2·S2S1' + D3·S2S1</code>. Each product is "this data line AND the select pattern that names it". It is ordinary sum-of-products; the only new idea is that the AND gates take a data input as well as select inputs.</li>
<li><strong>A second use that exams love.</strong> A 2<sup>n</sup>-to-1 multiplexer can implement <em>any</em> n-variable Boolean function: wire the function's variables to the select lines and hard-wire each data input to the 0 or 1 that the truth table demands for that row. A 4-to-1 mux with D0=0, D1=1, D2=1, D3=0 wired in is an XOR gate.</li>
</ul>
<p class="dap-an">✅ Machine check: the expression <code>F = D0·S2'S1' + D1·S2'S1 + D2·S2S1' + D3·S2S1</code> was evaluated in Python over all <strong>64</strong> combinations of the six inputs and matched <code>[D0,D1,D2,D3][2·S2 + S1]</code> every time. The four-row table and the six-input table describe the same device.</p>
<p class="pitfall">⚠️ Do not read the ignored data inputs as "don't care" in the Karnaugh-map sense. They are genuinely present and genuinely have values; the circuit simply does not let them through. A don't care is about inputs that <em>cannot occur</em> — a very different claim.</p>`,
        `<p class="y-chinh">🎯 Bốn dòng — và hãy để ý điều làm bảng chân trị này khác thường: <strong>cột đầu ra chứa TÊN TÍN HIỆU, không phải 0 và 1</strong>. Đó là cách viết gọn một cái bảng mà nếu viết đủ thì cần 2<sup>6</sup> = 64 dòng.</p>
<table>
<tr><th>S2</th><th>S1</th><th>F</th><th>Đọc là</th></tr>
<tr><td>0</td><td>0</td><td>D0</td><td>chọn đầu vào số 0</td></tr>
<tr><td>0</td><td>1</td><td>D1</td><td>chọn đầu vào số 1</td></tr>
<tr><td>1</td><td>0</td><td>D2</td><td>chọn đầu vào số 2</td></tr>
<tr><td>1</td><td>1</td><td>D3</td><td>chọn đầu vào số 3</td></tr>
</table>
<ul>
<li><strong>Đọc S2 S1 như một số nhị phân thì ra chỉ số.</strong> 00 → 0, 01 → 1, 10 → 2, 11 → 3. Đó là toàn bộ bản đặc tả; không còn gì khác phải nhớ về bộ dồn kênh.</li>
<li><strong>Vì sao viết gọn KHÔNG phải là gian lận.</strong> Thiết bị có sáu đầu vào (S2, S1, D0…D3), nên bảng đầy đủ đúng là có 64 dòng — nhưng 48 dòng trong đó chỉ khác nhau ở những đường dữ liệu ĐANG BỊ BỎ QUA. Viết D0 ở cột đầu ra nghĩa là "đường ấy đang là gì thì ra cái đó", vừa chính xác vừa ngắn hơn bốn chục lần.</li>
<li><strong>Bung một dòng ra để kiểm.</strong> Lấy S2=0, S1=1, D0=0, D1=1, D2=0, D3=0. Bảng nói F = D1 = 1. Giờ vẫn đường chọn đó nhưng D1=0 còn mọi thứ khác bằng 1: F = 0. Ba đường bị bỏ qua đã đổi giá trị mà F không nhúc nhích — đó đúng là hành vi mà chữ "F = D1" đang khẳng định.</li>
<li><strong>Biểu thức Boole mà bảng này biến thành</strong> nằm ở slide 27: <code>F = D0·S2'S1' + D1·S2'S1 + D2·S2S1' + D3·S2S1</code>. Mỗi tích là "đường dữ liệu này AND cái mẫu chọn gọi tên nó". Vẫn là tổng các tích thông thường; ý mới duy nhất là cổng AND nhận thêm một đầu vào DỮ LIỆU bên cạnh các đầu vào chọn.</li>
<li><strong>Công dụng thứ hai mà đề thi rất thích.</strong> Một bộ dồn kênh 2<sup>n</sup>-to-1 hiện thực được <em>BẤT KỲ</em> hàm Boole n biến: nối các biến của hàm vào đường chọn, rồi nối cứng mỗi đầu vào dữ liệu vào giá trị 0 hay 1 mà bảng chân trị đòi ở dòng đó. Một mux 4-to-1 nối sẵn D0=0, D1=1, D2=1, D3=0 chính là một cổng XOR.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng máy: biểu thức <code>F = D0·S2'S1' + D1·S2'S1 + D2·S2S1' + D3·S2S1</code> được tính trong Python trên đủ <strong>64</strong> tổ hợp của sáu đầu vào và lần nào cũng khớp <code>[D0,D1,D2,D3][2·S2 + S1]</code>. Bảng bốn dòng và bảng sáu đầu vào mô tả cùng một thiết bị.</p>
<p class="pitfall">⚠️ Đừng đọc mấy đầu vào dữ liệu bị bỏ qua thành "don't care" theo nghĩa của bìa Karnaugh. Chúng có mặt thật và có giá trị thật; mạch chỉ không cho chúng đi qua thôi. Don't care là nói về những đầu vào <em>KHÔNG THỂ XẢY RA</em> — một khẳng định rất khác.</p>`],

      [27, 'Figure 12.15 — Multiplexer Implementation',
        `<p class="y-chinh">🎯 The black box of slide 25 opened up: <strong>two inverters on S2 and S1, four 3-input AND gates, one 4-input OR gate</strong>. Each AND gate is guarded by a different combination of the select lines, so exactly one AND can be open at any moment.</p>
<p><code>F = D0·S2'·S1' + D1·S2'·S1 + D2·S2·S1' + D3·S2·S1</code></p>
<table>
<tr><th>AND gate (top to bottom)</th><th>Its three inputs</th><th>Open when</th><th>Output</th></tr>
<tr><td>1st</td><td>D0, S2', S1'</td><td>S2 S1 = 00</td><td>D0, else 0</td></tr>
<tr><td>2nd</td><td>D1, S2', S1</td><td>S2 S1 = 01</td><td>D1, else 0</td></tr>
<tr><td>3rd</td><td>D2, S2, S1'</td><td>S2 S1 = 10</td><td>D2, else 0</td></tr>
<tr><td>4th</td><td>D3, S2, S1</td><td>S2 S1 = 11</td><td>D3, else 0</td></tr>
</table>
<ul>
<li><strong>Why OR-ing four lines does not corrupt the answer.</strong> The four select patterns are mutually exclusive — exactly one holds at a time — so three of the four AND gates output 0, and <code>0 + 0 + 0 + X = X</code>. The OR gate is not "mixing"; it is collecting from a set where all but one contributor is silent.</li>
<li><strong>This is the same SOP shape as Figure 12.6, with one change.</strong> There, each AND detected a pattern of the <em>inputs</em>. Here each AND detects a pattern of the <em>select</em> lines and then passes a data bit through. That extra data input is the only structural difference between "computing a function" and "choosing a value".</li>
<li><strong>Count the cost.</strong> 2 inverters + 4 AND (3 inputs each) + 1 OR (4 inputs) = 7 gates, 2 levels deep after the inverters. An 8-to-1 mux needs 3 inverters, 8 four-input ANDs and one 8-input OR — still two levels. Multiplexers stay fast as they grow wide, which is why they are everywhere in a datapath.</li>
<li><strong>The select-pattern column is a decoder in disguise.</strong> The four AND gates on S2', S2, S1', S1 produce exactly the four signals a 2-to-4 decoder produces. Slide 29 draws that decoder on its own; a multiplexer is a decoder plus a row of data ANDs plus an OR.</li>
<li><strong>What the processor does with it.</strong> Every place in a CPU where "one of several values must be chosen" is a multiplexer: which register feeds the ALU, which ALU result is written back, whether the next PC is sequential or a branch target. Slide 28 shows exactly that last case.</li>
</ul>
<p class="dap-an">✅ Machine check: the circuit above was evaluated gate by gate in Python across all 64 combinations of S2, S1, D0, D1, D2, D3 and always equalled the selected data input. It also confirms the mutual-exclusion claim: for every select pattern, exactly one AND gate had a non-zero output.</p>
<p class="meo">💡 Sanity check you can do in your head: set all four data inputs to 1. F must be 1 for every select pattern. Set them all to 0 — F must be 0 everywhere. If a drawing of yours fails either test, an AND gate is wired to the wrong select polarity.</p>`,
        `<p class="y-chinh">🎯 Cái hộp đen của slide 25 được mở ra: <strong>hai bộ đảo trên S2 và S1, bốn cổng AND 3 đầu vào, một cổng OR 4 đầu vào</strong>. Mỗi cổng AND bị canh bởi một tổ hợp đường chọn khác nhau, nên tại mọi thời điểm đúng MỘT cổng AND mở được.</p>
<p><code>F = D0·S2'·S1' + D1·S2'·S1 + D2·S2·S1' + D3·S2·S1</code></p>
<table>
<tr><th>Cổng AND (từ trên xuống)</th><th>Ba đầu vào của nó</th><th>Mở khi</th><th>Đầu ra</th></tr>
<tr><td>Thứ 1</td><td>D0, S2', S1'</td><td>S2 S1 = 00</td><td>D0, còn lại là 0</td></tr>
<tr><td>Thứ 2</td><td>D1, S2', S1</td><td>S2 S1 = 01</td><td>D1, còn lại là 0</td></tr>
<tr><td>Thứ 3</td><td>D2, S2, S1'</td><td>S2 S1 = 10</td><td>D2, còn lại là 0</td></tr>
<tr><td>Thứ 4</td><td>D3, S2, S1</td><td>S2 S1 = 11</td><td>D3, còn lại là 0</td></tr>
</table>
<ul>
<li><strong>Vì sao OR bốn đường lại không làm hỏng đáp án.</strong> Bốn mẫu chọn LOẠI TRỪ LẪN NHAU — tại một lúc đúng một mẫu đúng — nên ba trong bốn cổng AND cho ra 0, và <code>0 + 0 + 0 + X = X</code>. Cổng OR không "trộn" gì cả; nó GOM từ một tập mà mọi bên góp đều im lặng trừ một bên.</li>
<li><strong>Đây vẫn là hình hài SOP của Figure 12.6, chỉ khác một chỗ.</strong> Ở kia, mỗi cổng AND dò một mẫu của các <em>ĐẦU VÀO</em>. Ở đây mỗi cổng AND dò một mẫu của các đường <em>CHỌN</em> rồi cho một bit dữ liệu đi qua. Cái đầu vào dữ liệu thêm vào đó là khác biệt cấu trúc DUY NHẤT giữa "tính một hàm" và "chọn một giá trị".</li>
<li><strong>Đếm chi phí.</strong> 2 bộ đảo + 4 AND (mỗi cái 3 đầu vào) + 1 OR (4 đầu vào) = 7 cổng, sâu 2 tầng sau bộ đảo. Mux 8-to-1 cần 3 bộ đảo, 8 cổng AND bốn đầu vào và một OR tám đầu vào — vẫn hai tầng. Bộ dồn kênh giữ được tốc độ khi nở rộng ra, và đó là lý do chúng có mặt khắp nơi trong đường dữ liệu.</li>
<li><strong>Cột "mẫu chọn" chính là một bộ GIẢI MÃ trá hình.</strong> Bốn cổng AND trên S2', S2, S1', S1 tạo ra đúng bốn tín hiệu mà một bộ giải mã 2-to-4 tạo ra. Slide 29 vẽ riêng bộ giải mã đó; một bộ dồn kênh chính là bộ giải mã cộng một hàng cổng AND dữ liệu cộng một cổng OR.</li>
<li><strong>Bộ xử lý dùng nó làm gì.</strong> Mọi chỗ trong CPU mà "phải chọn một trong nhiều giá trị" đều là một bộ dồn kênh: thanh ghi nào nuôi ALU, kết quả ALU nào được ghi ngược, PC tiếp theo là tuần tự hay là đích của lệnh rẽ nhánh. Slide 28 trưng ra đúng trường hợp cuối.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng máy: mạch trên được tính từng cổng một trong Python trên đủ 64 tổ hợp của S2, S1, D0, D1, D2, D3 và luôn bằng đầu vào dữ liệu được chọn. Nó cũng xác nhận khẳng định loại trừ lẫn nhau: với mọi mẫu chọn, đúng MỘT cổng AND có đầu ra khác 0.</p>
<p class="meo">💡 Phép thử tỉnh táo làm nhẩm được: đặt cả bốn đầu vào dữ liệu bằng 1. F phải bằng 1 với mọi mẫu chọn. Đặt cả bốn bằng 0 — F phải bằng 0 ở mọi nơi. Bản vẽ của bạn trượt một trong hai phép thử đó thì có một cổng AND đang nối nhầm cực tính của đường chọn.</p>`],

      [28, 'Figure 12.16 — Multiplexer Input to a Program Counter (and what comes next)',
        `<p class="y-chinh">🎯 The application that makes the whole chapter land: <strong>sixteen 4-to-1 multiplexers side by side, one per bit of a 16-bit program counter</strong>. Each one takes C<sub>i</sub>, IR<sub>i</sub> and ALU<sub>i</sub> as data inputs and drives PC<sub>i</sub>. All sixteen share the same two select lines, S2 and S1.</p>
<table>
<tr><th>Data input</th><th>Where it comes from</th><th>What selecting it means</th></tr>
<tr><td><strong>C</strong> (C<sub>0</sub>…C<sub>15</sub>)</td><td>A counter / incrementer</td><td>Ordinary sequential execution — the next instruction</td></tr>
<tr><td><strong>IR</strong> (IR<sub>0</sub>…IR<sub>15</sub>)</td><td>The address field of the instruction register</td><td>A direct jump to an address written in the instruction</td></tr>
<tr><td><strong>ALU</strong> (ALU<sub>0</sub>…ALU<sub>15</sub>)</td><td>The output of the arithmetic-logic unit</td><td>A computed address — a branch, an indexed jump, a return</td></tr>
<tr><td>the fourth input</td><td>unused in this figure</td><td>Three sources are wired; a 4-to-1 mux gives one spare</td></tr>
</table>
<ul>
<li><strong>This is where "control" becomes two wires.</strong> The entire question "what does the processor do next?" reduces to the value of S2 and S1. The control unit of Chapter 19 exists to drive select lines exactly like these; the instruction cycle of Chapter 3 is what decides their value.</li>
<li><strong>Notice how a 1-bit device becomes a 16-bit device: by replication.</strong> Sixteen identical multiplexers, one per bit, all sharing the selects. The same trick builds a 16-bit adder from 16 full adders and a 16-bit register from 16 flip-flops (slide 48). Width is repetition; it is depth that costs cleverness.</li>
<li><strong>Cost in gates, so you feel the scale.</strong> One 4-to-1 mux is 7 gates (slide 27); sixteen of them is 112 gates for one multiplexer stage of one register. A processor has dozens of such stages. That is the number that makes minimisation worth caring about.</li>
<li><strong>End of part A — what you should be able to do now.</strong> Turn a specification into a truth table. Turn a truth table into SOP and POS. Minimise with a Karnaugh map, including don't cares, and with Quine–McCluskey when the map is too big. Convert any two-level design into NAND-only or NOR-only. Read and draw a multiplexer. That is the whole CLO6 toolkit for combinational logic.</li>
<li><strong>What part B (slides 29–56) adds.</strong> Decoders and address decoding (29–31), the demultiplexer (31), ROM as a combinational circuit (32–34), <strong>adders</strong> in the book's own treatment (35–38), then the break into <em>sequential</em> logic: flip-flops (39–47), registers (48–49), counters (50–51), and finally programmable devices PLA/CPLD/FPGA (52–55).</li>
</ul>
<p class="meo">💡 Keep this picture in mind for Chapter 16. When you meet the processor's datapath diagram with its trapezoids scattered around, every trapezoid is one of these, and the tangle of control signals is just a lot of S2/S1 pairs.</p>
<p class="pitfall">⚠️ A multiplexer <em>selects</em>, it does not <em>store</em>. The PC in this figure keeps its value because the PC itself is a register (slide 48) with flip-flops; the mux only decides what value is offered to it. Confusing "choosing a value" with "remembering a value" is the boundary error this chapter's second half is designed to fix.</p>`,
        `<p class="y-chinh">🎯 Ứng dụng làm cả chương hạ cánh: <strong>mười sáu bộ dồn kênh 4-to-1 xếp cạnh nhau, mỗi bit của thanh đếm chương trình 16 bit một cái</strong>. Mỗi bộ nhận C<sub>i</sub>, IR<sub>i</sub> và ALU<sub>i</sub> làm đầu vào dữ liệu rồi lái PC<sub>i</sub>. Cả mười sáu cùng dùng chung hai đường chọn S2 và S1.</p>
<table>
<tr><th>Đầu vào dữ liệu</th><th>Nó từ đâu tới</th><th>Chọn nó nghĩa là gì</th></tr>
<tr><td><strong>C</strong> (C<sub>0</sub>…C<sub>15</sub>)</td><td>Một bộ đếm / bộ tăng</td><td>Thực thi tuần tự bình thường — lệnh kế tiếp</td></tr>
<tr><td><strong>IR</strong> (IR<sub>0</sub>…IR<sub>15</sub>)</td><td>Trường địa chỉ của thanh ghi lệnh</td><td>Nhảy trực tiếp tới một địa chỉ ghi ngay trong lệnh</td></tr>
<tr><td><strong>ALU</strong> (ALU<sub>0</sub>…ALU<sub>15</sub>)</td><td>Đầu ra của khối số học–logic</td><td>Địa chỉ TÍNH RA — rẽ nhánh, nhảy có chỉ số, quay về</td></tr>
<tr><td>đầu vào thứ tư</td><td>không dùng trong hình này</td><td>Ba nguồn được nối; mux 4-to-1 để dư ra một chỗ</td></tr>
</table>
<ul>
<li><strong>Đây là chỗ chữ "điều khiển" co lại thành HAI SỢI DÂY.</strong> Cả câu hỏi "bộ xử lý làm gì tiếp theo?" rút về giá trị của S2 và S1. Khối điều khiển của Chương 19 tồn tại để lái đúng những đường chọn như thế này; chu kỳ lệnh của Chương 3 là thứ quyết định giá trị của chúng.</li>
<li><strong>Để ý cách một thiết bị 1 bit thành thiết bị 16 bit: bằng cách NHÂN BẢN.</strong> Mười sáu bộ dồn kênh giống hệt nhau, mỗi bit một cái, dùng chung đường chọn. Đúng mẹo đó dựng bộ cộng 16 bit từ 16 bộ cộng đầy đủ, và thanh ghi 16 bit từ 16 flip-flop (slide 48). ĐỘ RỘNG là chuyện lặp lại; chỉ có ĐỘ SÂU mới đòi sự thông minh.</li>
<li><strong>Giá bằng cổng, để bạn cảm được quy mô.</strong> Một mux 4-to-1 là 7 cổng (slide 27); mười sáu cái là 112 cổng cho MỘT tầng dồn kênh của MỘT thanh ghi. Một bộ xử lý có hàng chục tầng như vậy. Đó chính là con số làm cho việc rút gọn đáng để quan tâm.</li>
<li><strong>Hết phần A — giờ bạn phải làm được gì.</strong> Biến một bản đặc tả thành bảng chân trị. Biến bảng chân trị thành SOP và POS. Rút gọn bằng bìa Karnaugh, kể cả có don't care, và bằng Quine–McCluskey khi bìa quá to. Chuyển mọi thiết kế hai tầng sang toàn NAND hoặc toàn NOR. Đọc và vẽ được bộ dồn kênh. Đó là trọn bộ đồ nghề CLO6 cho phần logic tổ hợp.</li>
<li><strong>Phần B (slide 29–56) thêm gì.</strong> Bộ giải mã và giải mã địa chỉ (29–31), bộ phân kênh (31), ROM như một mạch tổ hợp (32–34), <strong>BỘ CỘNG</strong> theo cách trình bày của chính sách (35–38), rồi bước sang logic <em>TUẦN TỰ</em>: flip-flop (39–47), thanh ghi (48–49), bộ đếm (50–51), và cuối cùng là các thiết bị lập trình được PLA/CPLD/FPGA (52–55).</li>
</ul>
<p class="meo">💡 Giữ bức hình này trong đầu cho Chương 16. Khi bạn gặp sơ đồ đường dữ liệu của bộ xử lý với mấy cái hình thang rải rác khắp nơi, mỗi hình thang là một trong những cái này, còn mớ bòng bong tín hiệu điều khiển chẳng qua là rất nhiều cặp S2/S1.</p>
<p class="pitfall">⚠️ Bộ dồn kênh <em>CHỌN</em>, nó không <em>LƯU</em>. Cái PC trong hình giữ được giá trị vì bản thân PC là một THANH GHI (slide 48) làm bằng flip-flop; bộ dồn kênh chỉ quyết định giá trị nào được đưa tới nó. Nhầm "chọn một giá trị" với "nhớ một giá trị" chính là lỗi ranh giới mà nửa sau của chương sinh ra để sửa.</p>`],

    ]),
  ].join('\n'),
};
