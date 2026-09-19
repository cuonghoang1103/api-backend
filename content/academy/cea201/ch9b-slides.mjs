/**
 * CEA201 · Chương 9 theo web (= Chapter 12 bản 11e) — Digital Logic,
 * học theo từng slide, PHẦN B: slide 29–56 của deck 'cea12' (deck có 56 slide).
 *
 * ⚠️ ĐÁNH SỐ: syllabus của trường theo bản 9th ed gọi khối này là "Chapter 11 —
 * Digital Logic"; trên web môn này đánh là "Chương 9"; bộ slide là bản 11th ed
 * nên in "Chapter 12". Cùng một nội dung, ba con số. Xem bảng quy đổi trong
 * _slides.mjs. Phần A (slide 1–28: đại số Boole, cổng, mạch tổ hợp, bìa
 * Karnaugh, Quine–McCluskey, multiplexer) sẽ nằm ở ch9a-slides.mjs.
 *
 * ⚠️⚠️ TÊN BÀI KHÁC VỚI YÊU CẦU BAN ĐẦU — vì chữ thật của slide khác mô tả.
 * Khoảng 29–56 KHÔNG phải toàn mạch tuần tự: slide 29–38 vẫn là MẠCH TỔ HỢP
 * (bộ giải mã, giải mã địa chỉ, demultiplexer, ROM, bộ cộng). Mạch tuần tự chỉ
 * bắt đầu từ slide 39 ("Sequential Circuit") và chạy tới 51; 52–55 là logic
 * khả trình (PLA/FPGA); 56 là tổng kết chương. Tiêu đề dưới đây đã sửa cho khớp
 * chữ thật của slide.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH12-COA11e.pptx (/tmp/cea201-text/cea12.txt).
 * Những slide chỉ có tiêu đề + hình/bảng (29, 30, 31, 33, 34, 36, 37, 38, 39,
 * 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 56) đã được ĐỌC THẲNG
 * TỪ ẢNH render (/tmp/cea201-slides/cea12/NNN.webp) để lấy đúng từng nhãn trên
 * sơ đồ, từng ô trên bảng, từng vạch trên giản đồ thời gian.
 *
 * ⚠️ MỌI bảng và MỌI con số trong bài đã kiểm bằng python3 TRƯỚC khi viết:
 *   · Table 12.9 (ROM 16×4): dựng lại đúng 16 hàng từ ảnh rồi rút ra quan hệ
 *     Z1 = X1, Z2 = X2, Z3 = X2 ⊕ X3, Z4 = X3 ⊕ X4 — khớp CẢ 16 hàng. Tức
 *     Z2Z3Z4 chính là mã Gray của X2X3X4, còn X1 đi thẳng. (Kiểm riêng: đúng.)
 *     16 từ × 4 bit = 64 bit ⇒ khớp nhan đề "A 64-Bit ROM" của Figure 12.20.
 *   · Table 12.10(b) full adder: 8 hàng sinh bằng S = A⊕B⊕Cin,
 *     Cout = AB + ACin + BCin — khớp từng hàng chữ trích của slide 35.
 *     Dạng SOP vẽ trên Figure 12.22 (slide 37) cũng đã kiểm tương đương.
 *   · Table 12.12(c) SR latch: mô phỏng 10 nhịp với S/R của slide →
 *     Q = 1,1,1,0,0,0,0,0,1,1 — khớp đúng hàng Qn+1 trên slide 43.
 *   · Bảng đặc tính VÀ bảng kích thích của SR · JK · D · T: sinh bằng máy từ
 *     định nghĩa từng loại (liệt kê mọi tổ hợp, gom nghiệm) — không chép tay.
 *   · Chạy tay 2 giản đồ thời gian: JK 8 nhịp (J/K cho sẵn → Q = 1,1,1,0,0,0,1,0)
 *     và D 8 nhịp (Q đúng bằng D trễ một nhịp). Cả hai mô phỏng bằng python3.
 *   · Thanh ghi dịch 4 bit, 6 nhịp, chuỗi vào 1,0,1,1,0,0 → nội dung từng nhịp
 *     1000 · 0100 · 1010 · 1101 · 0110 · 0011; Serial Out = 0,0,0,1,0,1.
 *   · Bộ đếm đồng bộ 3 bit (Figure 12.33): bảng trạng thái hiện tại → kế tiếp →
 *     giá trị J/K cần có, sinh bằng máy từ bảng kích thích JK. So sánh với bảng
 *     IN TRÊN SLIDE: khớp CẢ 8 hàng, không lệch ô nào. Rồi kiểm ngược các biểu
 *     thức rút gọn Jc = Kc = BA, Jb = Kb = A, Ja = Ka = 1 (tương thích với mọi
 *     hàng kể cả ô "d"), rồi mô phỏng 10 nhịp: 001→010→…→111→000→001→010.
 *   · Trễ tích luỹ ripple (td = 10 ns/tầng): 3 bit 30 ns (33,3 MHz) · 4 bit
 *     40 ns (25 MHz) · 8 bit 80 ns (12,5 MHz) · 16 bit 160 ns (6,25 MHz) ·
 *     32 bit 320 ns (3,12 MHz); đồng bộ giữ nguyên 10 ns (100 MHz).
 *   · Ripple-carry adder (2 mức cổng/tầng, 1 ns/cổng): 4 bit 8 ns (125 MHz) ·
 *     8 bit 16 ns · 32 bit 64 ns (15,6 MHz).
 *   · Giải mã địa chỉ (Figure 12.18): 4 chip × 256 × 8 bit = 1024 byte, cần 10
 *     đường địa chỉ A0–A9; dải của từng chip 0x000–0x0FF · 0x100–0x1FF ·
 *     0x200–0x2FF · 0x300–0x3FF.
 *   · LUT 4 đầu vào = SRAM 16×1 = 16 bit, và 2^16 = 65 536 = ĐÚNG số hàm Boole
 *     4 biến ⇒ một LUT 16×1 làm được MỌI hàm 4 biến.
 *
 * Chỗ slide gốc SAI/THIẾU — nêu rõ trong bài, không im lặng chép, không tự sửa:
 *   · slide 43, bảng (b) "Simplified Characteristic Table": hai cột đầu ghi
 *     "A" và "B" trong khi lẽ ra phải là "S" và "R" (bảng (a) ngay bên cạnh
 *     dùng đúng "SR"). Lỗi nhãn của chính file gốc — đã kiểm lại bằng ảnh.
 *   · Deck NHẢY Figure 12.32 (bộ đếm ripple/không đồng bộ): slide 51 đi thẳng
 *     từ Figure 12.31 sang Figure 12.33. Slide 50 CÓ nói về "Asynchronous" bằng
 *     chữ nhưng KHÔNG có hình. Bài này bù bằng bảng + phép tính trễ tích luỹ,
 *     và nói rõ đó là phần lấy từ sách chứ không phải từ slide.
 *   · Không slide nào trong deck vẽ flip-flop T, cũng không có bảng kích thích
 *     (excitation table) của bất kỳ loại nào. Cả hai thứ đó ra thi nặng (CLO6)
 *     nên bài này bổ sung, và ghi rõ chỗ nào là slide, chỗ nào là bổ sung.
 *   · slide 39 và 50 dùng bố cục "vòng tròn/hộp", chữ trích ra bị lặp tiêu đề
 *     ("Sequential / Circuit" tách dòng) — không phải hai mục khác nhau.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea12';

export default {
  title: '9.0b — Slide by slide: Decoders, ROM and adders, then sequential circuits — flip-flops, registers, counters and programmable logic (slides 29–56)|||9.0b — Slide bài giảng: Bộ giải mã, ROM, bộ cộng, rồi mạch tuần tự — flip-flop, thanh ghi, bộ đếm & logic khả trình (slide 29–56)',
  slug: 'cea201-9-0b-slides-giai-ma-rom-cong-mach-tuan-tu',
  type: 'DOCUMENT',
  description: 'Nửa sau Chương 9 (= Chapter 12 bản 11e) của CEA201, 28 slide. Mười slide đầu đóng nốt phần MẠCH TỔ HỢP: bộ giải mã 3→8 và ứng dụng chọn chip nhớ, demultiplexer, ROM nhìn như một mạch tổ hợp khổng lồ, bộ cộng đầy đủ và bộ cộng ripple-carry 4/32 bit. Mười tám slide còn lại là phần ra thi nặng nhất của chương: MẠCH TUẦN TỰ — chốt SR bằng cổng NOR, phân biệt chốt (theo mức) với flip-flop (theo sườn xung), bảng đặc tính và bảng kích thích đủ bốn loại SR · JK · D · T, thanh ghi song song và thanh ghi dịch, bộ đếm ripple so với bộ đếm đồng bộ (có tính trễ tích luỹ ra con số), một bài thiết kế bộ đếm đồng bộ 3 bit làm trọn từng bước, rồi khép lại bằng PLA và FPGA. Mọi bảng trạng thái, mọi giản đồ thời gian đều đã chạy bằng python3 và đối chiếu với chính bảng in trên slide.',
  content: [
    walkHead(D, 29, 56),
    walk(D, [

      [29, 'Figure 12.17 — Decoder with 3 Inputs and 2³ = 8 Outputs',
        `<p class="y-chinh">🎯 A <strong>decoder</strong> is a combinational circuit with n inputs and 2<sup>n</sup> outputs, and it obeys one rule: for every input combination, <strong>exactly one output is 1 and all the others are 0</strong>. The figure draws it for n = 3: inputs A, B, C on the left, three inverters, eight 3-input AND gates, outputs D<sub>0</sub>…D<sub>7</sub> labelled with the input pattern that fires them (000, 001, 010, … 111).</p>
<ul>
<li><strong>Each AND gate is one minterm.</strong> Look at the labels the slide prints next to each gate — <code>000</code>, <code>001</code>, … They are not decoration: gate D<sub>0</sub> receives A', B', C' and therefore fires only for ABC = 000; gate D<sub>5</sub> receives A, B', C and fires only for 101. A decoder is literally "all 2<sup>n</sup> minterms of n variables, generated at once".</li>
<li><strong>Why the three inverters exist.</strong> Each AND gate needs some inputs true and some complemented. Rather than one inverter per gate, the circuit generates A', B', C' once and runs six vertical rails (A, A', B, B', C, C') across the whole array — the same trick the PLA of slide 53 uses.</li>
<li><strong>Cost grows as 2<sup>n</sup>.</strong> 3 inputs → 8 AND gates. 4 inputs → 16 (that is exactly the "4-input 16-output decoder" inside the ROM of slide 34). 10 inputs → 1024 gates. This is why big memories decode the address in two stages (row and column) instead of one giant decoder.</li>
<li><strong>Complete truth table — machine-generated, all eight rows:</strong></li>
</ul>
<table>
<tr><th>A</th><th>B</th><th>C</th><th>Output driven to 1</th><th>Minterm feeding it</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>D<sub>0</sub></td><td>A'B'C'</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>D<sub>1</sub></td><td>A'B'C</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>D<sub>2</sub></td><td>A'BC'</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>D<sub>3</sub></td><td>A'BC</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>D<sub>4</sub></td><td>AB'C'</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>D<sub>5</sub></td><td>AB'C</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>D<sub>6</sub></td><td>ABC'</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>D<sub>7</sub></td><td>ABC</td></tr>
</table>
<p class="dap-an">✅ In every row, exactly one of the eight outputs is 1 — that is the defining property. Sum of all outputs = 1 at all times, which is why a decoder is sometimes called a "one-hot generator".</p>
<p class="meo">💡 Decoder = the <em>opposite</em> of an encoder and the <em>mirror</em> of a multiplexer. Multiplexer (slide 25): many data in, select picks one, <strong>one</strong> out. Decoder: only a select, and it lights up <strong>one of many</strong> outputs. MUX narrows, decoder fans out.</p>
<p class="pitfall">⚠️ Trap: "a 3-to-8 decoder has 3 inputs and 8 outputs" — but a real chip often also has an <em>enable</em> pin, and with enable = 0 <strong>no</strong> output is 1. The pure figure here has no enable, so the "exactly one" rule holds unconditionally. Read the question carefully.</p>`,
        `<p class="y-chinh">🎯 <strong>Bộ giải mã (decoder)</strong> là mạch tổ hợp có n đầu vào và 2<sup>n</sup> đầu ra, tuân đúng một luật: với mỗi tổ hợp đầu vào thì <strong>ĐÚNG MỘT đầu ra bằng 1, tất cả còn lại bằng 0</strong>. Hình vẽ cho n = 3: đầu vào A, B, C bên trái, ba cổng NOT, tám cổng AND 3 đầu vào, đầu ra D<sub>0</sub>…D<sub>7</sub> có ghi kèm mẫu bit kích hoạt nó (000, 001, 010, … 111).</p>
<ul>
<li><strong>Mỗi cổng AND là MỘT minterm.</strong> Nhìn nhãn slide in cạnh từng cổng — <code>000</code>, <code>001</code>, … Đó không phải trang trí: cổng D<sub>0</sub> nhận A', B', C' nên chỉ bật khi ABC = 000; cổng D<sub>5</sub> nhận A, B', C nên chỉ bật khi 101. Bộ giải mã đúng nghĩa đen là "sinh cùng lúc toàn bộ 2<sup>n</sup> minterm của n biến".</li>
<li><strong>Vì sao có ba cổng NOT.</strong> Mỗi cổng AND cần vài đầu vào thẳng, vài đầu vào đảo. Thay vì mỗi cổng một bộ đảo, mạch sinh A', B', C' MỘT LẦN rồi kéo sáu đường dọc (A, A', B, B', C, C') xuyên cả mảng — đúng mẹo mà PLA ở slide 53 dùng.</li>
<li><strong>Chi phí tăng theo 2<sup>n</sup>.</strong> 3 đầu vào → 8 cổng AND. 4 đầu vào → 16 (chính là "4-input 16-output decoder" nằm trong ROM ở slide 34). 10 đầu vào → 1024 cổng. Đó là lý do bộ nhớ lớn giải mã địa chỉ làm HAI chặng (hàng rồi cột) chứ không dùng một bộ giải mã khổng lồ.</li>
<li><strong>Bảng chân trị đầy đủ — sinh bằng máy, đủ tám hàng:</strong></li>
</ul>
<table>
<tr><th>A</th><th>B</th><th>C</th><th>Đầu ra bị đẩy lên 1</th><th>Minterm nuôi nó</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>D<sub>0</sub></td><td>A'B'C'</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>D<sub>1</sub></td><td>A'B'C</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>D<sub>2</sub></td><td>A'BC'</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>D<sub>3</sub></td><td>A'BC</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>D<sub>4</sub></td><td>AB'C'</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>D<sub>5</sub></td><td>AB'C</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>D<sub>6</sub></td><td>ABC'</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>D<sub>7</sub></td><td>ABC</td></tr>
</table>
<p class="dap-an">✅ Ở MỌI hàng, đúng một trong tám đầu ra bằng 1 — đó là tính chất định nghĩa. Tổng mọi đầu ra luôn bằng 1, nên bộ giải mã còn được gọi là "bộ sinh one-hot".</p>
<p class="meo">💡 Decoder = <em>NGƯỢC</em> với encoder và <em>ĐỐI XỨNG GƯƠNG</em> với multiplexer. Multiplexer (slide 25): nhiều dữ liệu vào, chân chọn lấy một, ra <strong>MỘT</strong> đường. Decoder: chỉ có chân chọn, và nó thắp sáng <strong>MỘT trong nhiều</strong> đầu ra. MUX thu hẹp, decoder toè ra.</p>
<p class="pitfall">⚠️ Bẫy: "bộ giải mã 3→8 có 3 vào 8 ra" — nhưng chip thật thường còn chân <em>enable</em>, và khi enable = 0 thì KHÔNG đầu ra nào bằng 1. Hình thuần ở đây không có enable nên luật "đúng một" đúng vô điều kiện. Đọc kỹ đề.</p>`],

      [30, 'Figure 12.18 — Address Decoding',
        `<p class="y-chinh">🎯 The first real use of a decoder in a computer: <strong>building a big memory out of small chips</strong>. Four <code>256 × 8 RAM</code> chips share the low address lines A0–A7; the high lines A8 and A9 go into a <strong>2-to-4 decoder</strong> whose four outputs drive the four <strong>Enable</strong> pins. Exactly one chip is ever enabled, so the four chips behave as one continuous 1 kB memory.</p>
<ul>
<li><strong>Split the address bus in two.</strong> The low bits select a location <em>inside</em> a chip; the high bits select <em>which</em> chip. Here 256 = 2<sup>8</sup> locations need A0–A7 (8 lines), and 4 chips need 2 more lines (A8, A9). Total 10 lines, and 2<sup>10</sup> = 1024 — checked by machine.</li>
<li><strong>The enable pin is what makes it work.</strong> All four chips see the same A0–A7 and the same data bus. Without enable they would all drive the bus at once and fight. The decoder guarantees "exactly one is 1", which is exactly "exactly one chip talks".</li>
<li><strong>Address map, computed:</strong></li>
</ul>
<table>
<tr><th>A9</th><th>A8</th><th>Decoder output</th><th>Chip enabled</th><th>Address range</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>chip 0</td><td>0x000 – 0x0FF (0 – 255)</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>chip 1</td><td>0x100 – 0x1FF (256 – 511)</td></tr>
<tr><td>1</td><td>0</td><td>2</td><td>chip 2</td><td>0x200 – 0x2FF (512 – 767)</td></tr>
<tr><td>1</td><td>1</td><td>3</td><td>chip 3</td><td>0x300 – 0x3FF (768 – 1023)</td></tr>
</table>
<p class="dap-an">✅ 4 chips × 256 words × 8 bits = <strong>1024 bytes = 8192 bits</strong>. Worked example: address 0x2A7 = 10 1010 0111 → A9A8 = 10 → <strong>chip 2</strong>, and A7…A0 = 1010 0111 = 0xA7 = offset 167 inside it.</p>
<ul>
<li><strong>This is Chapter 6 arriving early.</strong> Internal Memory (Ch.6 of the 11e deck) builds DRAM modules exactly this way — this figure is the wiring diagram behind every "how many chips do I need for X bytes?" exam question.</li>
<li><strong>Generalise it.</strong> To build 2<sup>m+k</sup> words from 2<sup>k</sup>-word chips you need 2<sup>m</sup> chips, an m-to-2<sup>m</sup> decoder, k shared address lines and m decoder lines. Every such question is this one figure with different numbers.</li>
</ul>
<p class="meo">💡 Mnemonic: <strong>low bits go INSIDE, high bits choose WHICH</strong>. If you can say which half of the address bus does what, you can answer the whole family of memory-expansion questions.</p>
<p class="pitfall">⚠️ Common mistake: counting the decoder's address lines twice. A8 and A9 are <em>not</em> also wired to the chips — look at the figure, only A0–A7 reach the RAM boxes. Total address width is 8 + 2 = 10, not 8 + 4 or 10 + 2.</p>`,
        `<p class="y-chinh">🎯 Ứng dụng thật đầu tiên của bộ giải mã trong máy tính: <strong>ghép nhiều chip nhỏ thành một bộ nhớ lớn</strong>. Bốn chip <code>256 × 8 RAM</code> dùng chung các đường địa chỉ thấp A0–A7; hai đường cao A8 và A9 đi vào một <strong>bộ giải mã 2→4</strong> mà bốn đầu ra của nó nối vào bốn chân <strong>Enable</strong>. Bất cứ lúc nào cũng chỉ đúng một chip được bật, nên bốn chip hành xử như MỘT bộ nhớ 1 kB liền mạch.</p>
<ul>
<li><strong>Cắt đôi bus địa chỉ.</strong> Bit thấp chọn ô <em>BÊN TRONG</em> chip; bit cao chọn <em>CHIP NÀO</em>. Ở đây 256 = 2<sup>8</sup> ô cần A0–A7 (8 đường), và 4 chip cần thêm 2 đường (A8, A9). Tổng 10 đường, và 2<sup>10</sup> = 1024 — đã kiểm bằng máy.</li>
<li><strong>Chân enable mới là thứ làm nó chạy được.</strong> Cả bốn chip thấy cùng A0–A7 và cùng bus dữ liệu. Không có enable thì cả bốn cùng đẩy dữ liệu lên bus và đánh nhau. Bộ giải mã bảo đảm "đúng một đầu ra bằng 1", tức "đúng một chip được nói".</li>
<li><strong>Bản đồ địa chỉ, tính ra:</strong></li>
</ul>
<table>
<tr><th>A9</th><th>A8</th><th>Đầu ra decoder</th><th>Chip được bật</th><th>Dải địa chỉ</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>chip 0</td><td>0x000 – 0x0FF (0 – 255)</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>chip 1</td><td>0x100 – 0x1FF (256 – 511)</td></tr>
<tr><td>1</td><td>0</td><td>2</td><td>chip 2</td><td>0x200 – 0x2FF (512 – 767)</td></tr>
<tr><td>1</td><td>1</td><td>3</td><td>chip 3</td><td>0x300 – 0x3FF (768 – 1023)</td></tr>
</table>
<p class="dap-an">✅ 4 chip × 256 từ × 8 bit = <strong>1024 byte = 8192 bit</strong>. Ví dụ giải mẫu: địa chỉ 0x2A7 = 10 1010 0111 → A9A8 = 10 → <strong>chip 2</strong>, còn A7…A0 = 1010 0111 = 0xA7 = ô thứ 167 bên trong chip đó.</p>
<ul>
<li><strong>Đây là Chương 6 đến sớm.</strong> Bộ nhớ trong (Ch.6 của bộ slide 11e) ghép module DRAM đúng theo kiểu này — hình này là sơ đồ nối dây nằm sau mọi câu hỏi thi dạng "cần bao nhiêu chip để có X byte?".</li>
<li><strong>Tổng quát hoá.</strong> Muốn dựng 2<sup>m+k</sup> từ bằng các chip 2<sup>k</sup> từ thì cần 2<sup>m</sup> chip, một bộ giải mã m→2<sup>m</sup>, k đường địa chỉ dùng chung và m đường vào decoder. Mọi câu hỏi loại này đều là chính hình này với con số khác.</li>
</ul>
<p class="meo">💡 Mẹo nhớ: <strong>bit THẤP đi VÀO TRONG, bit CAO chọn CHIP NÀO</strong>. Nói được nửa nào của bus địa chỉ làm việc gì là trả lời được cả họ câu hỏi mở rộng bộ nhớ.</p>
<p class="pitfall">⚠️ Lỗi hay gặp: đếm hai lần các đường vào decoder. A8 và A9 KHÔNG đồng thời nối vào chip — nhìn hình đi, chỉ A0–A7 chạm tới các hộp RAM. Độ rộng địa chỉ là 8 + 2 = 10, không phải 8 + 4 hay 10 + 2.</p>`],

      [31, 'Figure 12.19 — Implementation of a Demultiplexer Using a Decoder',
        `<p class="y-chinh">🎯 One box, two names. A <strong>demultiplexer</strong> routes a single <em>Data input</em> to one of 2<sup>n</sup> output lines, chosen by an <em>n-bit destination address</em>. The figure's point is that you do not need a new circuit: an <code>n-to-2<sup>n</sup> decoder</code> already does it — feed the data line in as the enable, and the decoder's "exactly one output is 1" becomes "the data appears on exactly one output".</p>
<ul>
<li><strong>How the trick works, gate by gate.</strong> In the decoder each output is AND(minterm of address). Add the data line as one more input to every AND gate: output<sub>i</sub> = minterm<sub>i</sub> · Data. Now the selected line carries <em>Data</em> (1 or 0) and all the others are forced to 0. A decoder with an enable pin <strong>is</strong> a demultiplexer; the enable pin <strong>is</strong> the data input.</li>
<li><strong>The exact inverse of the multiplexer on slide 25.</strong> MUX: 2<sup>n</sup> data lines + n select → 1 output. DEMUX: 1 data line + n select → 2<sup>n</sup> outputs. Put them back to back and you have a switched point-to-point link: one wire carries many logical channels, and the select lines say which channel each moment belongs to.</li>
</ul>
<table>
<tr><th>Circuit</th><th>Data lines</th><th>Select/address lines</th><th>Outputs</th><th>Slide</th></tr>
<tr><td>Multiplexer (4-to-1)</td><td>4 (D<sub>0</sub>–D<sub>3</sub>)</td><td>2 (S<sub>1</sub>, S<sub>2</sub>)</td><td>1 (F)</td><td>25–28</td></tr>
<tr><td>Decoder (3-to-8)</td><td>—</td><td>3 (A, B, C)</td><td>8 (D<sub>0</sub>–D<sub>7</sub>)</td><td>29</td></tr>
<tr><td>Demultiplexer (1-to-2<sup>n</sup>)</td><td>1</td><td>n</td><td>2<sup>n</sup></td><td>31</td></tr>
</table>
<ul>
<li><strong>Where a CPU uses it.</strong> Writing a result back to one of 32 registers is a demultiplex: one data bus, a 5-bit register number, 32 possible destinations. The "write enable" line of each register file entry is a decoder output. Ch.16 (Processor Structure) draws that path in full.</li>
<li><strong>Why the figure is deliberately abstract.</strong> No gates, just a labelled box with "n-bit destination address", "Data input", "2<sup>n</sup> outputs". The message is architectural, not electrical: <em>a routing function is a decoding function</em>.</li>
</ul>
<p class="dap-an">✅ Worked check with n = 2, address = 10, Data = 1 → outputs (O<sub>0</sub>, O<sub>1</sub>, O<sub>2</sub>, O<sub>3</sub>) = (0, 0, <strong>1</strong>, 0). Same address with Data = 0 → (0, 0, <strong>0</strong>, 0): the selected line now carries a 0, and nothing else changed. That second case is what distinguishes a demux from a plain decoder.</p>
<p class="meo">💡 Remember it as <strong>"a demux is a decoder whose enable pin has a job"</strong>. If an exam asks you to build a 1-to-8 demultiplexer and you only have a 3-to-8 decoder with enable, the answer is: wire the data to enable, done, no extra gates.</p>
<p class="pitfall">⚠️ Trap: a demultiplexer does <em>not</em> "copy" the data to all outputs and then mask them. Unselected outputs are hard 0 regardless of the data. If a question says "the unselected lines follow the input", that is wrong.</p>`,
        `<p class="y-chinh">🎯 Một cái hộp, hai cái tên. <strong>Demultiplexer</strong> dẫn MỘT đường <em>Data input</em> tới một trong 2<sup>n</sup> đường ra, do <em>địa chỉ đích n bit</em> chọn. Ý của hình là bạn KHÔNG cần mạch mới: một <code>bộ giải mã n→2<sup>n</sup></code> đã làm được — đưa đường dữ liệu vào làm chân enable, thế là "đúng một đầu ra bằng 1" của decoder biến thành "dữ liệu hiện ra ở đúng một đầu ra".</p>
<ul>
<li><strong>Mẹo đó chạy thế nào, xét từng cổng.</strong> Trong decoder, mỗi đầu ra là AND(minterm của địa chỉ). Thêm đường dữ liệu làm một đầu vào nữa cho MỌI cổng AND: đầu ra<sub>i</sub> = minterm<sub>i</sub> · Data. Bây giờ đường được chọn mang <em>Data</em> (1 hay 0), còn tất cả đường khác bị ép về 0. Bộ giải mã có chân enable <strong>CHÍNH LÀ</strong> demultiplexer; chân enable <strong>CHÍNH LÀ</strong> đầu vào dữ liệu.</li>
<li><strong>Đúng nghịch đảo của multiplexer ở slide 25.</strong> MUX: 2<sup>n</sup> đường dữ liệu + n chân chọn → 1 đầu ra. DEMUX: 1 đường dữ liệu + n chân chọn → 2<sup>n</sup> đầu ra. Đấu lưng vào nhau là có một đường truyền điểm-điểm có chuyển mạch: một sợi dây mang nhiều kênh logic, và chân chọn nói khoảnh khắc này thuộc kênh nào.</li>
</ul>
<table>
<tr><th>Mạch</th><th>Đường dữ liệu</th><th>Đường chọn/địa chỉ</th><th>Đầu ra</th><th>Slide</th></tr>
<tr><td>Multiplexer (4→1)</td><td>4 (D<sub>0</sub>–D<sub>3</sub>)</td><td>2 (S<sub>1</sub>, S<sub>2</sub>)</td><td>1 (F)</td><td>25–28</td></tr>
<tr><td>Decoder (3→8)</td><td>—</td><td>3 (A, B, C)</td><td>8 (D<sub>0</sub>–D<sub>7</sub>)</td><td>29</td></tr>
<tr><td>Demultiplexer (1→2<sup>n</sup>)</td><td>1</td><td>n</td><td>2<sup>n</sup></td><td>31</td></tr>
</table>
<ul>
<li><strong>CPU dùng nó ở đâu.</strong> Ghi kết quả trở lại một trong 32 thanh ghi chính là một phép demultiplex: một bus dữ liệu, một số hiệu thanh ghi 5 bit, 32 đích có thể. Đường "write enable" của từng ô trong tệp thanh ghi chính là một đầu ra decoder. Ch.16 (Cấu trúc bộ xử lý) vẽ trọn đường đi đó.</li>
<li><strong>Vì sao hình cố tình trừu tượng.</strong> Không vẽ cổng nào, chỉ một cái hộp có nhãn "n-bit destination address", "Data input", "2<sup>n</sup> outputs". Thông điệp là KIẾN TRÚC chứ không phải mạch điện: <em>chức năng ĐỊNH TUYẾN chính là chức năng GIẢI MÃ</em>.</li>
</ul>
<p class="dap-an">✅ Kiểm mẫu với n = 2, địa chỉ = 10, Data = 1 → các đầu ra (O<sub>0</sub>, O<sub>1</sub>, O<sub>2</sub>, O<sub>3</sub>) = (0, 0, <strong>1</strong>, 0). Cùng địa chỉ đó nhưng Data = 0 → (0, 0, <strong>0</strong>, 0): đường được chọn giờ mang số 0, mọi thứ khác không đổi. Chính trường hợp thứ hai này phân biệt demux với decoder trần.</p>
<p class="meo">💡 Nhớ kiểu này: <strong>"demux là decoder mà chân enable được giao việc"</strong>. Đề bảo dựng demultiplexer 1→8 mà trong tay chỉ có decoder 3→8 có enable thì đáp án là: nối dữ liệu vào enable, xong, không cần thêm cổng nào.</p>
<p class="pitfall">⚠️ Bẫy: demultiplexer KHÔNG "chép" dữ liệu ra mọi đầu ra rồi che bớt. Các đầu ra không được chọn là 0 cứng, bất kể dữ liệu là gì. Câu nào bảo "các đường không được chọn bám theo đầu vào" là SAI.</p>`],

      [32, 'Read-Only Memory (ROM)',
        `<p class="y-chinh">🎯 The slide makes a claim that sounds odd the first time: <strong>a ROM is a combinational circuit</strong>. Memory that is implemented with combinational circuits, that performs only the read operation, whose contents are permanent and created during fabrication — and therefore "a given input to the ROM (address lines) always produces the same output (data lines)".</p>
<ul>
<li><strong>The key word the slide defines: "memoryless".</strong> It says combinational circuits are often called memoryless "because their output depends only on their current input and no history of prior inputs is retained". A ROM's output depends only on the address currently presented. No history. Therefore: combinational. The word "memory" in ROM refers to what it <em>stores for you</em>, not to internal state.</li>
<li><strong>Read this as the hinge of the chapter.</strong> Everything before slide 39 is memoryless; everything after has state. ROM is the last and most convincing combinational device precisely because it looks like it should be sequential and is not.</li>
<li><strong>A ROM is a truth table you can buy.</strong> Any Boolean function of n variables with m outputs can be built as a 2<sup>n</sup> × m ROM: put the address lines as inputs, burn the truth table into the array. No minimisation, no Karnaugh map, no Quine–McCluskey — you trade gates for storage. Slides 33 and 34 show exactly that.</li>
<li><strong>Where it sits among memory types.</strong> ROM is <em>non-volatile</em> (survives power off) and <em>read-only</em>. The family continues with PROM, EPROM, EEPROM and flash in Ch.6; the variable part is only <em>how</em> and <em>how often</em> you can write it, never the read path.</li>
<li><strong>Classic uses.</strong> Microprogram control store (Ch.19 makes a whole control unit out of ROM), boot firmware/BIOS, character generators, lookup tables for maths functions.</li>
</ul>
<table>
<tr><th></th><th>Combinational (ROM, decoder, adder)</th><th>Sequential (latch, flip-flop, register)</th></tr>
<tr><td>Output depends on</td><td>Current inputs only</td><td>Current inputs <strong>and</strong> past history</td></tr>
<tr><td>Internal state</td><td>None ("memoryless")</td><td>Yes — that is the point</td></tr>
<tr><td>Same input twice</td><td>Always same output</td><td>May give different outputs</td></tr>
<tr><td>Needs a clock</td><td>No</td><td>Usually yes (slide 44 onward)</td></tr>
</table>
<p class="meo">💡 Memory hook: <strong>a ROM remembers for YOU, it does not remember for ITSELF</strong>. Its content was fixed at the factory and never changes while the circuit runs, so from the circuit's point of view it is pure wiring.</p>
<p class="pitfall">⚠️ Exam trap, and it is a favourite: "ROM is a sequential circuit because it stores data." <strong>False.</strong> Storing a fixed table is not having state. RAM, by contrast, <em>can</em> change during operation and is built from sequential elements.</p>`,
        `<p class="y-chinh">🎯 Slide đưa ra một khẳng định nghe lạ tai lần đầu: <strong>ROM là một mạch TỔ HỢP</strong>. Bộ nhớ được hiện thực bằng mạch tổ hợp, chỉ thực hiện thao tác đọc, nội dung là vĩnh viễn và được tạo ra trong quá trình chế tạo — do đó "một đầu vào cho trước của ROM (các đường địa chỉ) luôn sinh ra cùng một đầu ra (các đường dữ liệu)".</p>
<ul>
<li><strong>Chữ then chốt mà slide định nghĩa: "memoryless" (không nhớ).</strong> Slide nói mạch tổ hợp thường được gọi là mạch không nhớ "vì đầu ra chỉ phụ thuộc đầu vào HIỆN TẠI và không giữ lại lịch sử đầu vào trước đó". Đầu ra của ROM chỉ phụ thuộc địa chỉ đang đặt vào. Không lịch sử. Vậy nên: tổ hợp. Chữ "memory" trong ROM nói về thứ nó <em>GIỮ HỘ BẠN</em>, không phải trạng thái bên trong nó.</li>
<li><strong>Đọc câu này như BẢN LỀ của cả chương.</strong> Mọi thứ trước slide 39 là không nhớ; mọi thứ sau đó có trạng thái. ROM là thiết bị tổ hợp cuối cùng và thuyết phục nhất, chính vì nó TRÔNG như phải là tuần tự mà lại không phải.</li>
<li><strong>ROM là một bảng chân trị mua sẵn.</strong> Bất kỳ hàm Boole nào của n biến với m đầu ra đều dựng được thành ROM 2<sup>n</sup> × m: lấy đường địa chỉ làm đầu vào, nung bảng chân trị vào mảng. Không rút gọn, không bìa Karnaugh, không Quine–McCluskey — bạn đổi CỔNG lấy Ô NHỚ. Slide 33 và 34 trưng đúng chuyện đó.</li>
<li><strong>Nó nằm đâu trong họ bộ nhớ.</strong> ROM là <em>bất biến khi mất điện</em> và <em>chỉ đọc</em>. Họ này còn PROM, EPROM, EEPROM và flash ở Ch.6; phần thay đổi chỉ là <em>ghi BẰNG CÁCH NÀO</em> và <em>ghi được BAO NHIÊU LẦN</em>, đường ĐỌC thì không đổi.</li>
<li><strong>Dùng ở đâu.</strong> Kho vi chương trình điều khiển (Ch.19 dựng nguyên một khối điều khiển bằng ROM), firmware khởi động/BIOS, bộ sinh ký tự, bảng tra cho hàm toán.</li>
</ul>
<table>
<tr><th></th><th>Tổ hợp (ROM, decoder, bộ cộng)</th><th>Tuần tự (chốt, flip-flop, thanh ghi)</th></tr>
<tr><td>Đầu ra phụ thuộc</td><td>Chỉ đầu vào hiện tại</td><td>Đầu vào hiện tại <strong>VÀ</strong> lịch sử quá khứ</td></tr>
<tr><td>Trạng thái bên trong</td><td>Không ("memoryless")</td><td>Có — đó mới là mục đích</td></tr>
<tr><td>Cùng đầu vào hai lần</td><td>Luôn cùng đầu ra</td><td>Có thể ra khác nhau</td></tr>
<tr><td>Cần xung nhịp</td><td>Không</td><td>Thường là có (từ slide 44 trở đi)</td></tr>
</table>
<p class="meo">💡 Mẹo nhớ: <strong>ROM nhớ HỘ BẠN, chứ nó không nhớ CHO CHÍNH NÓ</strong>. Nội dung của nó được chốt ở nhà máy và không đổi trong lúc mạch chạy, nên đứng từ phía mạch mà nhìn thì nó chỉ là dây nối.</p>
<p class="pitfall">⚠️ Bẫy đề thi, và là bẫy được ưa chuộng: "ROM là mạch tuần tự vì nó lưu dữ liệu." <strong>SAI.</strong> Lưu một bảng cố định không phải là có trạng thái. Ngược lại RAM <em>CÓ THỂ</em> đổi trong lúc chạy và được dựng từ phần tử tuần tự.</p>`],

      [33, 'Table 12.9 — Truth Table for a ROM',
        `<p class="y-chinh">🎯 A concrete ROM: 4 input lines X<sub>1</sub>X<sub>2</sub>X<sub>3</sub>X<sub>4</sub> (the address), 4 output lines Z<sub>1</sub>Z<sub>2</sub>Z<sub>3</sub>Z<sub>4</sub> (the data), 2<sup>4</sup> = 16 rows. That is <strong>16 words × 4 bits = 64 bits</strong>, which is why the next slide is titled "A 64-Bit ROM".</p>
<table>
<tr><th>X<sub>1</sub></th><th>X<sub>2</sub></th><th>X<sub>3</sub></th><th>X<sub>4</sub></th><th>Z<sub>1</sub></th><th>Z<sub>2</sub></th><th>Z<sub>3</sub></th><th>Z<sub>4</sub></th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td></tr>
</table>
<ul>
<li><strong>The slide never says what function this is — so work it out.</strong> Column by column: Z<sub>1</sub> equals X<sub>1</sub> in all 16 rows. Z<sub>2</sub> equals X<sub>2</sub> in all 16 rows. Z<sub>3</sub> is 1 exactly when X<sub>2</sub> and X<sub>3</sub> differ. Z<sub>4</sub> is 1 exactly when X<sub>3</sub> and X<sub>4</sub> differ.</li>
<li><strong>The four equations:</strong> <code>Z1 = X1</code>, <code>Z2 = X2</code>, <code>Z3 = X2 ⊕ X3</code>, <code>Z4 = X3 ⊕ X4</code> — where ⊕ is XOR.</li>
<li><strong>Which means:</strong> Z<sub>2</sub>Z<sub>3</sub>Z<sub>4</sub> is the <strong>Gray code</strong> of X<sub>2</sub>X<sub>3</sub>X<sub>4</sub> (g<sub>1</sub> = b<sub>1</sub>, g<sub>i</sub> = b<sub>i−1</sub> ⊕ b<sub>i</sub>), while X<sub>1</sub> passes straight through untouched.</li>
<li><strong>Why it matters that a ROM can do this with zero gates.</strong> Implemented as logic you would need three XOR gates. Implemented as ROM you need 64 storage cells and a decoder — more silicon here, but the ROM approach works for <em>any</em> table, including one with no pattern at all.</li>
</ul>
<p class="dap-an">✅ Verified by machine over all 16 rows: the equations above reproduce the table exactly (0 mismatches), and Z<sub>2</sub>Z<sub>3</sub>Z<sub>4</sub> = Gray(X<sub>2</sub>X<sub>3</sub>X<sub>4</sub>) also checks out on all 16. Spot check by hand: X = 1100 → Z<sub>1</sub> = 1, Z<sub>2</sub> = 1, Z<sub>3</sub> = 1 ⊕ 0 = 1, Z<sub>4</sub> = 0 ⊕ 0 = 0 → <strong>Z = 1110</strong>, which is the row printed on the slide.</p>
<p class="meo">💡 Sizing rule to memorise: a ROM with n address lines and m data lines stores <strong>2<sup>n</sup> × m bits</strong>. Here 2<sup>4</sup> × 4 = 64. Exam questions love "how many bits in a 1024 × 8 ROM?" → 8192 bits = 1 kB, and it needs 10 address lines.</p>
<p class="pitfall">⚠️ Do not assume a ROM table has a nice formula. This one happens to; most do not, and that is exactly the point of using a ROM. If a question asks you to "simplify" a ROM's contents, the honest answer may be "it cannot be simplified — that is why it is a ROM".</p>`,
        `<p class="y-chinh">🎯 Một ROM cụ thể: 4 đường vào X<sub>1</sub>X<sub>2</sub>X<sub>3</sub>X<sub>4</sub> (địa chỉ), 4 đường ra Z<sub>1</sub>Z<sub>2</sub>Z<sub>3</sub>Z<sub>4</sub> (dữ liệu), 2<sup>4</sup> = 16 hàng. Tức <strong>16 từ × 4 bit = 64 bit</strong>, và đó là lý do slide kế tiếp có tên "A 64-Bit ROM".</p>
<table>
<tr><th>X<sub>1</sub></th><th>X<sub>2</sub></th><th>X<sub>3</sub></th><th>X<sub>4</sub></th><th>Z<sub>1</sub></th><th>Z<sub>2</sub></th><th>Z<sub>3</sub></th><th>Z<sub>4</sub></th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td></tr>
</table>
<ul>
<li><strong>Slide KHÔNG nói đây là hàm gì — vậy thì tự tìm ra.</strong> Soi từng cột: Z<sub>1</sub> bằng X<sub>1</sub> ở cả 16 hàng. Z<sub>2</sub> bằng X<sub>2</sub> ở cả 16 hàng. Z<sub>3</sub> bằng 1 đúng khi X<sub>2</sub> và X<sub>3</sub> KHÁC nhau. Z<sub>4</sub> bằng 1 đúng khi X<sub>3</sub> và X<sub>4</sub> KHÁC nhau.</li>
<li><strong>Bốn phương trình:</strong> <code>Z1 = X1</code>, <code>Z2 = X2</code>, <code>Z3 = X2 ⊕ X3</code>, <code>Z4 = X3 ⊕ X4</code> — với ⊕ là phép XOR.</li>
<li><strong>Nghĩa là:</strong> Z<sub>2</sub>Z<sub>3</sub>Z<sub>4</sub> chính là <strong>mã Gray</strong> của X<sub>2</sub>X<sub>3</sub>X<sub>4</sub> (g<sub>1</sub> = b<sub>1</sub>, g<sub>i</sub> = b<sub>i−1</sub> ⊕ b<sub>i</sub>), còn X<sub>1</sub> đi thẳng qua không đổi.</li>
<li><strong>Vì sao đáng chú ý là ROM làm được chuyện này với 0 cổng logic.</strong> Làm bằng cổng thì cần ba cổng XOR. Làm bằng ROM thì cần 64 ô nhớ và một decoder — ở đây tốn silicon hơn, nhưng cách ROM chạy được với <em>BẤT KỲ</em> bảng nào, kể cả bảng chẳng có quy luật gì.</li>
</ul>
<p class="dap-an">✅ Đã kiểm bằng máy trên cả 16 hàng: bộ phương trình trên tái tạo bảng CHÍNH XÁC (0 chỗ lệch), và Z<sub>2</sub>Z<sub>3</sub>Z<sub>4</sub> = Gray(X<sub>2</sub>X<sub>3</sub>X<sub>4</sub>) cũng đúng cả 16. Kiểm tay một điểm: X = 1100 → Z<sub>1</sub> = 1, Z<sub>2</sub> = 1, Z<sub>3</sub> = 1 ⊕ 0 = 1, Z<sub>4</sub> = 0 ⊕ 0 = 0 → <strong>Z = 1110</strong>, đúng hàng in trên slide.</p>
<p class="meo">💡 Công thức tính dung lượng phải thuộc: ROM có n đường địa chỉ và m đường dữ liệu thì lưu <strong>2<sup>n</sup> × m bit</strong>. Ở đây 2<sup>4</sup> × 4 = 64. Đề thi rất thích hỏi "ROM 1024 × 8 chứa bao nhiêu bit?" → 8192 bit = 1 kB, và cần 10 đường địa chỉ.</p>
<p class="pitfall">⚠️ Đừng mặc định bảng của ROM luôn có công thức đẹp. Bảng này tình cờ có; phần lớn thì không, và đó ĐÚNG là lý do người ta dùng ROM. Đề bảo "rút gọn" nội dung một ROM thì câu trả lời thành thật có thể là "không rút gọn được — chính vì thế nó mới là ROM".</p>`],

      [34, 'Figure 12.20 — A 64-Bit ROM',
        `<p class="y-chinh">🎯 Table 12.9 turned into silicon. On the left a <strong>4-input 16-output decoder</strong> fed by X<sub>1</sub>…X<sub>4</sub>; its sixteen output lines are labelled 0000 … 1111 and run horizontally across the page. Four big <strong>OR gates</strong> at the bottom produce Z<sub>1</sub>…Z<sub>4</sub>. A dot at a crossing = a connection.</p>
<ul>
<li><strong>Read the architecture in one sentence.</strong> <em>The decoder selects one row; the dots on that row say which output bits are 1.</em> That is all a ROM is. Every ROM, PROM, EPROM and mask ROM you will ever meet has this shape.</li>
<li><strong>Where the "64 bits" live.</strong> 16 word lines × 4 bit lines = 64 crossings. Each crossing is one stored bit: dot = 1, no dot = 0. Count the dots on the slide and you are reading the ROM's contents directly off the picture.</li>
<li><strong>The dots are the program.</strong> "Binary information stored in a ROM is permanent and is created during the fabrication process" (slide 32) means: the mask that decides which crossings get a connection <em>is</em> the data. Changing the data means a new mask, i.e. a new chip.</li>
<li><strong>Trace one word by hand.</strong> Put X = 0100 on the address. The decoder drives line <code>0100</code> high and all fifteen others low. From Table 12.9 the stored word is Z = 0110, so on that row there is <em>no</em> dot under Z<sub>1</sub>, a dot under Z<sub>2</sub>, a dot under Z<sub>3</sub> and none under Z<sub>4</sub>. The OR gates for Z<sub>2</sub> and Z<sub>3</sub> see a 1; the other two see all-zero inputs.</li>
<li><strong>Why OR gates and not AND.</strong> Only one word line is ever high, so each output is "OR of the selected connections" — the OR collapses to whichever single row is active. This is the same two-level AND-then-OR structure as sum-of-products, and it is literally the ancestor of the PLA on slide 53.</li>
</ul>
<table>
<tr><th>ROM part</th><th>What it does</th><th>Cost</th></tr>
<tr><td>4-to-16 decoder</td><td>Turns the 4-bit address into one-hot word lines</td><td>16 AND gates of 4 inputs + 4 inverters</td></tr>
<tr><td>16 × 4 crossing array</td><td>Stores the data — dot = 1</td><td>64 bit cells</td></tr>
<tr><td>4 OR gates</td><td>Collects each bit column into an output</td><td>4 OR gates of 16 inputs</td></tr>
</table>
<p class="dap-an">✅ Capacity check: 2<sup>4</sup> words × 4 bits = <strong>64 bits</strong> — the figure's title is arithmetic, not branding. Scale it up: a 1 K × 8 ROM would be a 10-to-1024 decoder plus 8192 crossings plus 8 OR gates of 1024 inputs, which is why real chips split the array into a row decoder and a column multiplexer instead.</p>
<p class="meo">💡 Picture it as a <strong>grid of light switches</strong>: the decoder lights up exactly one horizontal wire, and whichever vertical wires are soldered to it come on. Reading a ROM is asking "which verticals are soldered to row k?".</p>
<p class="pitfall">⚠️ Trap: the OR gates have 16 inputs, one per word line — students often draw 4. And note the decoder here has no enable, so <em>some</em> word is always selected; a ROM with no chip-select is always outputting something.</p>`,
        `<p class="y-chinh">🎯 Table 12.9 biến thành silicon. Bên trái là <strong>bộ giải mã 4 vào 16 ra</strong> nhận X<sub>1</sub>…X<sub>4</sub>; mười sáu đường ra của nó có nhãn 0000 … 1111 và chạy ngang qua trang. Bốn <strong>cổng OR</strong> lớn ở dưới cho ra Z<sub>1</sub>…Z<sub>4</sub>. Một dấu chấm ở chỗ giao nhau = một mối nối.</p>
<ul>
<li><strong>Đọc kiến trúc trong một câu.</strong> <em>Bộ giải mã chọn một HÀNG; các dấu chấm trên hàng đó nói bit ra nào bằng 1.</em> ROM chỉ có thế. Mọi ROM, PROM, EPROM, mask ROM bạn từng gặp đều mang hình dạng này.</li>
<li><strong>"64 bit" nằm ở đâu.</strong> 16 đường từ × 4 đường bit = 64 chỗ giao. Mỗi chỗ giao là một bit được lưu: có chấm = 1, không chấm = 0. Đếm số chấm trên slide là bạn đang đọc thẳng nội dung ROM từ bức tranh.</li>
<li><strong>Các dấu chấm CHÍNH LÀ chương trình.</strong> Câu "nội dung nhị phân trong ROM là vĩnh viễn và được tạo trong quá trình chế tạo" (slide 32) nghĩa là: cái mặt nạ quyết định chỗ giao nào được nối <em>CHÍNH LÀ</em> dữ liệu. Đổi dữ liệu nghĩa là mặt nạ mới, tức con chip mới.</li>
<li><strong>Dò tay một từ.</strong> Đặt X = 0100 lên địa chỉ. Bộ giải mã kéo đường <code>0100</code> lên cao và mười lăm đường kia xuống thấp. Theo Table 12.9 từ lưu ở đó là Z = 0110, nên trên hàng ấy KHÔNG có chấm dưới Z<sub>1</sub>, có chấm dưới Z<sub>2</sub>, có chấm dưới Z<sub>3</sub> và không có chấm dưới Z<sub>4</sub>. Cổng OR của Z<sub>2</sub> và Z<sub>3</sub> thấy số 1; hai cổng còn lại chỉ thấy toàn 0.</li>
<li><strong>Vì sao dùng OR chứ không phải AND.</strong> Chỉ đúng một đường từ lên cao tại mỗi thời điểm, nên mỗi đầu ra là "OR của các mối nối đang được chọn" — phép OR co lại thành đúng cái hàng đang tích cực. Đây đúng là cấu trúc hai tầng AND-rồi-OR của tổng-các-tích, và nó là tổ tiên trực tiếp của PLA ở slide 53.</li>
</ul>
<table>
<tr><th>Bộ phận của ROM</th><th>Làm gì</th><th>Chi phí</th></tr>
<tr><td>Bộ giải mã 4→16</td><td>Biến địa chỉ 4 bit thành đường từ one-hot</td><td>16 cổng AND 4 đầu vào + 4 cổng NOT</td></tr>
<tr><td>Mảng giao 16 × 4</td><td>Lưu dữ liệu — có chấm = 1</td><td>64 ô bit</td></tr>
<tr><td>4 cổng OR</td><td>Gom từng cột bit thành một đầu ra</td><td>4 cổng OR 16 đầu vào</td></tr>
</table>
<p class="dap-an">✅ Kiểm dung lượng: 2<sup>4</sup> từ × 4 bit = <strong>64 bit</strong> — tên hình là PHÉP TÍNH chứ không phải nhãn quảng cáo. Phóng to lên: ROM 1 K × 8 sẽ là bộ giải mã 10→1024 cộng 8192 chỗ giao cộng 8 cổng OR 1024 đầu vào — và đó là lý do chip thật chia mảng thành bộ giải mã HÀNG cộng multiplexer CỘT thay vì làm thế.</p>
<p class="meo">💡 Hình dung như một <strong>lưới công tắc đèn</strong>: bộ giải mã thắp đúng một sợi dây NGANG, và những sợi DỌC nào có hàn vào nó thì sáng. Đọc ROM là hỏi "những sợi dọc nào được hàn vào hàng k?".</p>
<p class="pitfall">⚠️ Bẫy: các cổng OR ở đây có 16 đầu vào, mỗi đường từ một cái — sinh viên hay vẽ thành 4. Và để ý bộ giải mã này không có enable, nên LUÔN có một từ được chọn; ROM không có chân chọn chip thì lúc nào cũng đang xuất ra cái gì đó.</p>`],

      [35, 'Table 12.10 — Binary Addition Truth Tables ((a) single-bit addition, (b) addition with carry input)',
        `<p class="y-chinh">🎯 Two tables side by side, and the difference between them is the whole idea of a full adder. <strong>(a)</strong> adds two bits and produces SUM and CARRY — a <em>half adder</em>. <strong>(b)</strong> adds two bits <em>plus a carry coming in from the bit to the right</em> and produces SUM and C<sub>out</sub> — a <em>full adder</em>. Only (b) can be chained.</p>
<p class="nhan">📐 (a) Single-bit addition — the half adder, 4 rows:</p>
<table>
<tr><th>A</th><th>B</th><th>SUM</th><th>CARRY</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td></tr>
</table>
<p class="nhan">📐 (b) Addition with carry input — the full adder, 8 rows (exactly as printed on the slide):</p>
<table>
<tr><th>C<sub>in</sub></th><th>A</th><th>B</th><th>SUM</th><th>C<sub>out</sub></th><th>Decimal check</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0+0+0 = 0 → 00</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0+0+1 = 1 → 01</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0+1+0 = 1 → 01</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0+1+1 = 2 → 10</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1+0+0 = 1 → 01</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1+0+1 = 2 → 10</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1+1+0 = 2 → 10</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1+1+1 = 3 → 11</td></tr>
</table>
<ul>
<li><strong>Read the two output columns as one 2-bit number.</strong> C<sub>out</sub>SUM is simply the binary value of C<sub>in</sub> + A + B. That is the whole specification — the last column above is the proof, row by row.</li>
<li><strong>The two equations you must know:</strong> <code>SUM = A ⊕ B ⊕ C<sub>in</sub></code> (SUM is 1 when an <em>odd</em> number of inputs is 1) and <code>C<sub>out</sub> = AB + AC<sub>in</sub> + BC<sub>in</sub></code> (carry out is 1 when <em>at least two</em> inputs are 1 — a majority function).</li>
<li><strong>Why the half adder is not enough.</strong> It has no place to receive the carry from the previous column, so you cannot build a 4-bit adder out of four half adders. Slide 36 chains four <em>full</em> adders; the rightmost one gets C<sub>in</sub> = 0, which is the only place a half adder would do.</li>
<li><strong>Link back to Ch.10/Ch.11.</strong> This is the gate-level truth behind two's-complement arithmetic: the same circuit does subtraction if you feed B' and set C<sub>in</sub> = 1, because A − B = A + B' + 1.</li>
</ul>
<p class="dap-an">✅ Machine check: generating all eight rows from SUM = A ⊕ B ⊕ C<sub>in</sub> and C<sub>out</sub> = AB + AC<sub>in</sub> + BC<sub>in</sub> reproduces the slide's table <strong>exactly, all 8 rows</strong>. Notice also that SUM is 1 in rows with an odd count of ones (1, 1, 1, 3 ones) — that is the XOR/parity pattern of Table 12.1's XOR row.</p>
<p class="meo">💡 Two one-line mnemonics: <strong>SUM = parity (odd number of 1s)</strong>, <strong>CARRY = majority (two or more 1s)</strong>. Every full-adder question collapses to those two sentences.</p>
<p class="pitfall">⚠️ Trap: writing C<sub>out</sub> = AB only. That is the <em>half</em> adder's carry. With a carry in, A = 1, B = 0, C<sub>in</sub> = 1 also produces a carry — AB = 0 there, so the AB-only answer is wrong in 2 of the 8 rows.</p>`,
        `<p class="y-chinh">🎯 Hai bảng đặt cạnh nhau, và chỗ khác nhau giữa chúng chính là toàn bộ ý tưởng của bộ cộng đầy đủ. <strong>(a)</strong> cộng hai bit, cho ra SUM và CARRY — đó là <em>bộ cộng bán phần (half adder)</em>. <strong>(b)</strong> cộng hai bit <em>CỘNG THÊM số nhớ từ cột bên phải mang sang</em>, cho ra SUM và C<sub>out</sub> — <em>bộ cộng đầy đủ (full adder)</em>. Chỉ (b) mới nối chuỗi được.</p>
<p class="nhan">📐 (a) Cộng một bit — half adder, 4 hàng:</p>
<table>
<tr><th>A</th><th>B</th><th>SUM</th><th>CARRY</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td></tr>
</table>
<p class="nhan">📐 (b) Cộng có số nhớ vào — full adder, 8 hàng (đúng như in trên slide):</p>
<table>
<tr><th>C<sub>in</sub></th><th>A</th><th>B</th><th>SUM</th><th>C<sub>out</sub></th><th>Kiểm bằng thập phân</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0+0+0 = 0 → 00</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0+0+1 = 1 → 01</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0+1+0 = 1 → 01</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0+1+1 = 2 → 10</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1+0+0 = 1 → 01</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1+0+1 = 2 → 10</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1+1+0 = 2 → 10</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1+1+1 = 3 → 11</td></tr>
</table>
<ul>
<li><strong>Đọc hai cột đầu ra như MỘT số 2 bit.</strong> C<sub>out</sub>SUM chính là giá trị nhị phân của C<sub>in</sub> + A + B. Đó là toàn bộ đặc tả — cột cuối bảng trên là bằng chứng, từng hàng một.</li>
<li><strong>Hai công thức phải thuộc:</strong> <code>SUM = A ⊕ B ⊕ C<sub>in</sub></code> (SUM bằng 1 khi số đầu vào bằng 1 là số LẺ) và <code>C<sub>out</sub> = AB + AC<sub>in</sub> + BC<sub>in</sub></code> (nhớ ra bằng 1 khi có TỪ HAI đầu vào trở lên bằng 1 — hàm đa số).</li>
<li><strong>Vì sao half adder không đủ.</strong> Nó không có chỗ nhận số nhớ từ cột trước, nên không thể dựng bộ cộng 4 bit từ bốn half adder. Slide 36 nối chuỗi bốn bộ cộng ĐẦY ĐỦ; cái ngoài cùng bên phải nhận C<sub>in</sub> = 0 — đó là chỗ DUY NHẤT mà half adder dùng được.</li>
<li><strong>Nối ngược về Ch.10/Ch.11.</strong> Đây là sự thật ở mức cổng nằm dưới số học bù hai: cùng mạch này làm phép TRỪ nếu bạn đưa B' vào và đặt C<sub>in</sub> = 1, vì A − B = A + B' + 1.</li>
</ul>
<p class="dap-an">✅ Kiểm bằng máy: sinh cả tám hàng từ SUM = A ⊕ B ⊕ C<sub>in</sub> và C<sub>out</sub> = AB + AC<sub>in</sub> + BC<sub>in</sub> tái tạo bảng của slide <strong>CHÍNH XÁC, đủ 8 hàng</strong>. Cũng để ý SUM bằng 1 ở những hàng có số bit 1 là số lẻ (1, 1, 1, 3 số một) — đúng mẫu XOR/chẵn lẻ của hàng XOR trong Table 12.1.</p>
<p class="meo">💡 Hai câu thần chú: <strong>SUM = chẵn lẻ (số bit 1 là LẺ)</strong>, <strong>CARRY = đa số (từ hai bit 1 trở lên)</strong>. Mọi câu hỏi về full adder đều thu về hai câu đó.</p>
<p class="pitfall">⚠️ Bẫy: viết C<sub>out</sub> = AB thôi. Đó là nhớ của half adder. Khi có nhớ vào, A = 1, B = 0, C<sub>in</sub> = 1 cũng sinh nhớ — mà AB = 0 ở đó, nên đáp án chỉ-AB sai ở 2 trong 8 hàng.</p>`],

      [36, 'Figure 12.21 — 4-Bit Adder',
        `<p class="y-chinh">🎯 Four full adders in a row, wired carry-to-carry. Inputs A<sub>3</sub>B<sub>3</sub>, A<sub>2</sub>B<sub>2</sub>, A<sub>1</sub>B<sub>1</sub>, A<sub>0</sub>B<sub>0</sub> on top; outputs S<sub>3</sub>…S<sub>0</sub> below; the rightmost box gets <strong>C<sub>in</sub> = 0</strong> and each box passes its carry <em>leftwards</em> to the next. The leftmost carry C<sub>3</sub> leaves the array as the <strong>Overflow signal</strong>. This is a <em>ripple-carry adder</em>.</p>
<ul>
<li><strong>Read the carry direction carefully.</strong> The arrows on the slide point right-to-left because bit 0 is the least significant — the carry travels from the units column to the higher columns, exactly like adding on paper.</li>
<li><strong>The hard-wired 0 on the far right.</strong> Bit 0 has nothing to its right, so its C<sub>in</sub> is tied to 0. (If you tied it to 1 instead, the adder would compute A + B + 1 — which is precisely how subtraction is built.)</li>
<li><strong>Worked example, 1011 + 0110 (11 + 6 = 17):</strong></li>
</ul>
<table>
<tr><th>Stage</th><th>A<sub>i</sub></th><th>B<sub>i</sub></th><th>C<sub>in</sub></th><th>S<sub>i</sub></th><th>C<sub>out</sub></th></tr>
<tr><td>bit 0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>bit 1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>bit 2</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>bit 3</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
</table>
<p class="dap-an">✅ Result S<sub>3</sub>S<sub>2</sub>S<sub>1</sub>S<sub>0</sub> = <strong>0001</strong> with C<sub>3</sub> = <strong>1</strong> → the true answer is 1 0001 = 17. With only 4 sum lines the 17 does not fit, and the carry-out is the alarm. That is why the slide labels C<sub>3</sub> "Overflow signal".</p>
<ul>
<li><strong>The cost of rippling.</strong> Bit 3 cannot settle until bit 2's carry is valid, which waits on bit 1, which waits on bit 0. Delay is <strong>proportional to the number of bits</strong>. Taking a full adder as 2 gate levels and 1 ns per gate: 4 bits → 8 ns (max 125 MHz), 8 bits → 16 ns, 32 bits → 64 ns (max 15,6 MHz). All computed, not guessed.</li>
<li><strong>What real CPUs do instead.</strong> Carry-lookahead: compute every carry directly from A and B with extra logic, so delay grows like log n instead of n. Ch.11 (Computer Arithmetic) works it out; this figure is the slow baseline it is measured against.</li>
</ul>
<p class="meo">💡 Remember the shape: <strong>n full adders in a chain = n-bit adder; the only special wire is the 0 at the right end and the overflow at the left end.</strong></p>
<p class="pitfall">⚠️ Careful with the word "overflow". For <em>unsigned</em> numbers, carry-out = overflow, as here. For <em>two's-complement signed</em> numbers, overflow is C<sub>3</sub> ⊕ C<sub>2</sub> — carry-out alone is <strong>not</strong> the right test. The slide's label is correct only in the unsigned reading.</p>`,
        `<p class="y-chinh">🎯 Bốn bộ cộng đầy đủ xếp hàng, nối nhớ-sang-nhớ. Đầu vào A<sub>3</sub>B<sub>3</sub>, A<sub>2</sub>B<sub>2</sub>, A<sub>1</sub>B<sub>1</sub>, A<sub>0</sub>B<sub>0</sub> ở trên; đầu ra S<sub>3</sub>…S<sub>0</sub> ở dưới; hộp ngoài cùng bên phải nhận <strong>C<sub>in</sub> = 0</strong> và mỗi hộp chuyền số nhớ <em>SANG TRÁI</em> cho hộp kế. Số nhớ ngoài cùng trái C<sub>3</sub> rời khỏi mảng với nhãn <strong>Overflow signal</strong>. Đây là <em>bộ cộng ripple-carry</em>.</p>
<ul>
<li><strong>Đọc kỹ chiều của số nhớ.</strong> Mũi tên trên slide chỉ từ phải sang trái vì bit 0 là bit thấp nhất — số nhớ đi từ cột đơn vị lên các cột cao hơn, y hệt cộng tay trên giấy.</li>
<li><strong>Số 0 nối cứng ở đầu phải.</strong> Bit 0 không có gì bên phải nó nên C<sub>in</sub> của nó bị buộc về 0. (Nếu buộc vào 1 thì mạch tính A + B + 1 — và đó chính xác là cách dựng phép trừ.)</li>
<li><strong>Ví dụ giải mẫu, 1011 + 0110 (11 + 6 = 17):</strong></li>
</ul>
<table>
<tr><th>Tầng</th><th>A<sub>i</sub></th><th>B<sub>i</sub></th><th>C<sub>in</sub></th><th>S<sub>i</sub></th><th>C<sub>out</sub></th></tr>
<tr><td>bit 0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>bit 1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>bit 2</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>bit 3</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
</table>
<p class="dap-an">✅ Kết quả S<sub>3</sub>S<sub>2</sub>S<sub>1</sub>S<sub>0</sub> = <strong>0001</strong> kèm C<sub>3</sub> = <strong>1</strong> → đáp số thật là 1 0001 = 17. Với chỉ 4 đường tổng thì 17 không nhét vừa, và số nhớ ra là cái chuông báo động. Vì thế slide ghi C<sub>3</sub> là "Overflow signal".</p>
<ul>
<li><strong>Cái giá của việc gợn sóng.</strong> Bit 3 không thể ổn định trước khi số nhớ của bit 2 có giá trị đúng, mà cái đó chờ bit 1, mà bit 1 chờ bit 0. Độ trễ <strong>TỈ LỆ THUẬN với số bit</strong>. Lấy một full adder là 2 mức cổng và 1 ns mỗi cổng: 4 bit → 8 ns (tối đa 125 MHz), 8 bit → 16 ns, 32 bit → 64 ns (tối đa 15,6 MHz). Đều tính bằng máy, không phỏng đoán.</li>
<li><strong>CPU thật làm gì thay thế.</strong> Carry-lookahead: tính thẳng mọi số nhớ từ A và B bằng logic phụ, nên độ trễ tăng theo log n thay vì n. Ch.11 (Số học máy tính) giải chi tiết; hình này là cái mốc CHẬM để đem ra so.</li>
</ul>
<p class="meo">💡 Nhớ hình dạng: <strong>n bộ cộng đầy đủ nối chuỗi = bộ cộng n bit; dây đặc biệt duy nhất là số 0 ở đầu phải và overflow ở đầu trái.</strong></p>
<p class="pitfall">⚠️ Cẩn thận với chữ "overflow". Với số KHÔNG DẤU thì nhớ-ra = tràn, đúng như ở đây. Với số CÓ DẤU bù hai thì tràn là C<sub>3</sub> ⊕ C<sub>2</sub> — chỉ nhìn nhớ-ra là <strong>KHÔNG</strong> đúng phép thử. Nhãn của slide chỉ đúng theo nghĩa không dấu.</p>`],

      [37, 'Figure 12.22 — Implementation of an Adder',
        `<p class="y-chinh">🎯 One full adder, drawn as gates. The top half makes <strong>Sum</strong> from four 3-input AND gates feeding one OR gate; the bottom half makes <strong>Carry</strong> from three 2-input AND gates feeding one OR gate. It is Table 12.10(b) turned into sum-of-products, exactly the method of slides 13–16.</p>
<p class="nhan">📐 The four AND gates of the Sum half, read off the figure (C here is C<sub>in</sub>):</p>
<table>
<tr><th>AND gate inputs</th><th>Product term</th><th>Which row of Table 12.10(b) it covers</th></tr>
<tr><td>A', B', C</td><td>A'B'C</td><td>C<sub>in</sub>=1, A=0, B=0 → SUM = 1</td></tr>
<tr><td>A', B, C'</td><td>A'BC'</td><td>C<sub>in</sub>=0, A=0, B=1 → SUM = 1</td></tr>
<tr><td>A, B, C</td><td>ABC</td><td>C<sub>in</sub>=1, A=1, B=1 → SUM = 1</td></tr>
<tr><td>A, B', C'</td><td>AB'C'</td><td>C<sub>in</sub>=0, A=1, B=0 → SUM = 1</td></tr>
</table>
<p class="nhan">📐 The three AND gates of the Carry half: <code>AB</code>, <code>AC</code>, <code>BC</code> → OR'd together.</p>
<ul>
<li><strong>Four product terms, four 1-rows.</strong> SUM is 1 in exactly four of the eight rows, and the circuit has exactly four AND gates — one per 1-row. That is canonical sum-of-products with no simplification at all.</li>
<li><strong>Why SUM is not simplified.</strong> An XOR-style function has <em>no</em> adjacent 1-cells on a Karnaugh map (every 1 is isolated diagonally), so K-map minimisation buys nothing. This is the standard counter-example to "always minimise": here the SOP form <em>is</em> minimal. Drawing it as two XOR gates is smaller only because XOR is treated as a primitive.</li>
<li><strong>Why Carry <em>is</em> simplified.</strong> The 1-rows for carry are ABC', AB'C, A'BC, ABC — four minterms — but they pair up into three 2-cell groups AB, AC, BC. Four terms became three, and each term dropped from 3 literals to 2. That is a K-map win you can see.</li>
<li><strong>Gate count and depth.</strong> Sum: 4 AND + 1 OR (plus inverters) = 2 gate levels. Carry: 3 AND + 1 OR = 2 gate levels. This "2 levels per stage" is the number used in the ripple-delay arithmetic on slides 36 and 38.</li>
</ul>
<p class="dap-an">✅ Machine-verified equivalence over all 8 input combinations: <code>A'B'C + A'BC' + ABC + AB'C'</code> equals <code>A ⊕ B ⊕ C</code> in every row, and <code>AB + AC + BC</code> equals the majority function in every row. The figure is correct SOP, not an approximation.</p>
<p class="meo">💡 Sanity rule for drawing any SOP circuit: <strong>number of AND gates = number of 1s in the output column</strong> (before minimisation). Sum has four 1s → four AND gates. If your drawing has a different count, you mis-read the truth table.</p>
<p class="pitfall">⚠️ Note the bars on the figure: A, B, C appear both plain and complemented. Students copying the diagram often lose a bar and end up with two identical AND gates. Check each gate against the row it is supposed to cover before trusting it.</p>`,
        `<p class="y-chinh">🎯 Một bộ cộng đầy đủ, vẽ bằng cổng. Nửa trên tạo <strong>Sum</strong> từ bốn cổng AND 3 đầu vào đổ vào một cổng OR; nửa dưới tạo <strong>Carry</strong> từ ba cổng AND 2 đầu vào đổ vào một cổng OR. Đó là Table 12.10(b) biến thành tổng-các-tích, đúng phương pháp của slide 13–16.</p>
<p class="nhan">📐 Bốn cổng AND ở nửa Sum, đọc thẳng từ hình (C ở đây là C<sub>in</sub>):</p>
<table>
<tr><th>Đầu vào cổng AND</th><th>Số hạng tích</th><th>Phủ hàng nào của Table 12.10(b)</th></tr>
<tr><td>A', B', C</td><td>A'B'C</td><td>C<sub>in</sub>=1, A=0, B=0 → SUM = 1</td></tr>
<tr><td>A', B, C'</td><td>A'BC'</td><td>C<sub>in</sub>=0, A=0, B=1 → SUM = 1</td></tr>
<tr><td>A, B, C</td><td>ABC</td><td>C<sub>in</sub>=1, A=1, B=1 → SUM = 1</td></tr>
<tr><td>A, B', C'</td><td>AB'C'</td><td>C<sub>in</sub>=0, A=1, B=0 → SUM = 1</td></tr>
</table>
<p class="nhan">📐 Ba cổng AND ở nửa Carry: <code>AB</code>, <code>AC</code>, <code>BC</code> → OR lại với nhau.</p>
<ul>
<li><strong>Bốn số hạng tích, bốn hàng có giá trị 1.</strong> SUM bằng 1 ở đúng bốn trong tám hàng, và mạch có đúng bốn cổng AND — mỗi hàng-1 một cổng. Đó là tổng-các-tích chính tắc, không rút gọn tí nào.</li>
<li><strong>Vì sao SUM không rút gọn được.</strong> Hàm kiểu XOR KHÔNG có ô 1 nào kề nhau trên bìa Karnaugh (mọi số 1 đều đứng lẻ theo đường chéo), nên rút gọn bằng K-map chẳng được gì. Đây là phản ví dụ chuẩn cho câu "lúc nào cũng phải rút gọn": ở đây dạng SOP ĐÃ LÀ tối giản. Vẽ bằng hai cổng XOR thì nhỏ hơn chỉ vì XOR được coi là cổng nguyên thuỷ.</li>
<li><strong>Vì sao Carry thì rút gọn ĐƯỢC.</strong> Các hàng-1 của carry là ABC', AB'C, A'BC, ABC — bốn minterm — nhưng chúng ghép thành ba nhóm 2 ô là AB, AC, BC. Bốn số hạng còn ba, và mỗi số hạng từ 3 biến rụng còn 2. Đó là một cái lợi thấy được của K-map.</li>
<li><strong>Số cổng và độ sâu.</strong> Sum: 4 AND + 1 OR (cộng các cổng NOT) = 2 mức cổng. Carry: 3 AND + 1 OR = 2 mức cổng. Con số "2 mức mỗi tầng" này chính là con số dùng trong phép tính trễ ripple ở slide 36 và 38.</li>
</ul>
<p class="dap-an">✅ Đã kiểm tương đương bằng máy trên cả 8 tổ hợp đầu vào: <code>A'B'C + A'BC' + ABC + AB'C'</code> bằng <code>A ⊕ B ⊕ C</code> ở mọi hàng, và <code>AB + AC + BC</code> bằng hàm đa số ở mọi hàng. Hình vẽ là SOP ĐÚNG, không phải bản gần đúng.</p>
<p class="meo">💡 Luật kiểm nhanh khi vẽ bất kỳ mạch SOP nào: <strong>số cổng AND = số bit 1 trong cột đầu ra</strong> (trước khi rút gọn). Sum có bốn số 1 → bốn cổng AND. Bản vẽ của bạn ra số khác nghĩa là bạn đọc sai bảng chân trị.</p>
<p class="pitfall">⚠️ Để ý các gạch đảo trên hình: A, B, C xuất hiện cả dạng thẳng lẫn dạng đảo. Sinh viên chép lại sơ đồ hay rơi mất một gạch và kết cục có hai cổng AND giống hệt nhau. Đối chiếu từng cổng với hàng mà nó phải phủ trước khi tin nó.</p>`],

      [38, 'Figure 12.23 — Construction of a 32-Bit Adder Using 8-Bit Adders',
        `<p class="y-chinh">🎯 The same chaining trick, one level up the hierarchy. Four <strong>8-bit adder</strong> blocks in a row: the rightmost takes A<sub>7</sub>…A<sub>0</sub>, B<sub>7</sub>…B<sub>0</sub> and C<sub>in</sub>, and passes C<sub>7</sub> to the next block, which passes C<sub>15</sub>, then C<sub>23</sub>, and the leftmost produces C<sub>out</sub>. Outputs S<sub>31</sub>…S<sub>0</sub>.</p>
<ul>
<li><strong>The recursion is the lesson.</strong> Slide 36 chained 1-bit adders into a 4-bit adder; this slide chains 8-bit adders into a 32-bit adder. Same rule at every scale: <em>whatever the block size, the carry-out of one block is the carry-in of the next</em>. Design a good 8-bit block once and you can build any width.</li>
<li><strong>Why blocks of 8 and not 32 individual full adders.</strong> Inside each 8-bit block the designer is free to use fast carry-lookahead logic; between blocks the carry still ripples. You get 4 ripple steps instead of 32 — a hybrid that is the standard industrial compromise.</li>
<li><strong>Delay, with numbers:</strong></li>
</ul>
<table>
<tr><th>Design of a 32-bit adder</th><th>Carry path length</th><th>Delay @ 2 gate levels, 1 ns/gate</th><th>Max clock</th></tr>
<tr><td>32 full adders, pure ripple</td><td>32 stages</td><td>64 ns</td><td>15,6 MHz</td></tr>
<tr><td>4 × 8-bit blocks, ripple between blocks</td><td>4 block hops</td><td>depends on the block, but only 4 hops</td><td>far higher</td></tr>
<tr><td>Full 32-bit carry-lookahead</td><td>~log n levels</td><td>smallest</td><td>highest, most gates</td></tr>
</table>
<p class="dap-an">✅ Machine-computed ripple figures for reference: 4-bit 8 ns (125 MHz), 8-bit 16 ns (62,5 MHz), 32-bit 64 ns (15,6 MHz), 64-bit 128 ns (7,8 MHz). A pure 64-bit ripple adder alone would cap a CPU below 8 MHz — which is the entire reason carry-lookahead exists.</p>
<ul>
<li><strong>Subtle labelling wrinkle on the slide.</strong> The leftmost block's inputs are printed <code>A31 B31 … A31 B31</code>, i.e. the same pair twice, where the pattern of the other blocks (<code>A23 B23 … A16 B16</code>) says it should read A<sub>31</sub>B<sub>31</sub> … A<sub>24</sub>B<sub>24</sub>. Treat it as a typo in the original figure; the sum outputs below it (<code>S31 … S24</code>) confirm the block really covers bits 24–31.</li>
<li><strong>Where you meet this in the CPU.</strong> The ALU of Ch.11 and Ch.16 is built exactly like this; the "word size" of a machine (32-bit, 64-bit) is literally how many of these stages are chained.</li>
</ul>
<p class="meo">💡 One sentence to carry away: <strong>adders compose by carry</strong>. Any adder, any width, made of any smaller adders — the only wire between two blocks is the carry.</p>
<p class="pitfall">⚠️ Trap: thinking four 8-bit adders work "in parallel". They do not. Block 2 cannot finish until block 1's carry arrives. The blocks are physically side by side but logically sequential — that is precisely what "ripple" means.</p>`,
        `<p class="y-chinh">🎯 Vẫn mẹo nối chuỗi ấy, nhưng lên một tầng cao hơn. Bốn khối <strong>bộ cộng 8 bit</strong> xếp hàng: khối ngoài cùng phải nhận A<sub>7</sub>…A<sub>0</sub>, B<sub>7</sub>…B<sub>0</sub> và C<sub>in</sub>, rồi chuyền C<sub>7</sub> cho khối kế, khối đó chuyền C<sub>15</sub>, rồi C<sub>23</sub>, và khối ngoài cùng trái cho ra C<sub>out</sub>. Đầu ra S<sub>31</sub>…S<sub>0</sub>.</p>
<ul>
<li><strong>Tính ĐỆ QUY mới là bài học.</strong> Slide 36 nối chuỗi bộ cộng 1 bit thành bộ cộng 4 bit; slide này nối chuỗi bộ cộng 8 bit thành bộ cộng 32 bit. Cùng một luật ở mọi quy mô: <em>khối to nhỏ thế nào cũng vậy, nhớ-ra của khối này là nhớ-vào của khối kế</em>. Thiết kế tốt một khối 8 bit là dựng được mọi độ rộng.</li>
<li><strong>Vì sao dùng khối 8 chứ không phải 32 bộ cộng đầy đủ rời.</strong> Bên trong mỗi khối 8 bit, người thiết kế tự do dùng logic nhìn-trước-số-nhớ (carry-lookahead) chạy nhanh; giữa các khối thì số nhớ vẫn gợn sóng. Bạn được 4 bước gợn thay vì 32 — một cách lai, và là thoả hiệp chuẩn trong công nghiệp.</li>
<li><strong>Độ trễ, kèm con số:</strong></li>
</ul>
<table>
<tr><th>Cách dựng bộ cộng 32 bit</th><th>Chiều dài đường nhớ</th><th>Trễ @ 2 mức cổng, 1 ns/cổng</th><th>Xung nhịp tối đa</th></tr>
<tr><td>32 bộ cộng đầy đủ, ripple thuần</td><td>32 tầng</td><td>64 ns</td><td>15,6 MHz</td></tr>
<tr><td>4 khối × 8 bit, ripple giữa các khối</td><td>4 chặng khối</td><td>tuỳ khối, nhưng chỉ 4 chặng</td><td>cao hơn hẳn</td></tr>
<tr><td>Carry-lookahead trọn 32 bit</td><td>~log n mức</td><td>nhỏ nhất</td><td>cao nhất, tốn cổng nhất</td></tr>
</table>
<p class="dap-an">✅ Số liệu ripple tính bằng máy để tham chiếu: 4 bit 8 ns (125 MHz), 8 bit 16 ns (62,5 MHz), 32 bit 64 ns (15,6 MHz), 64 bit 128 ns (7,8 MHz). Riêng một bộ cộng ripple 64 bit thuần đã chặn CPU xuống dưới 8 MHz — đó là toàn bộ lý do carry-lookahead ra đời.</p>
<ul>
<li><strong>Một chỗ ghi nhãn hơi lạ trên slide.</strong> Đầu vào của khối ngoài cùng trái in là <code>A31 B31 … A31 B31</code>, tức cùng một cặp hai lần, trong khi mẫu của các khối khác (<code>A23 B23 … A16 B16</code>) nói lẽ ra phải đọc là A<sub>31</sub>B<sub>31</sub> … A<sub>24</sub>B<sub>24</sub>. Coi đó là lỗi đánh máy của chính hình gốc; các đầu ra tổng ngay dưới nó (<code>S31 … S24</code>) xác nhận khối đó thật sự phụ trách bit 24–31.</li>
<li><strong>Gặp lại nó ở đâu trong CPU.</strong> Khối ALU của Ch.11 và Ch.16 được dựng đúng kiểu này; "độ rộng từ" của một máy (32 bit, 64 bit) đúng nghĩa đen là số tầng được nối chuỗi.</li>
</ul>
<p class="meo">💡 Một câu mang về: <strong>bộ cộng ghép với nhau BẰNG SỐ NHỚ</strong>. Bộ cộng nào, rộng bao nhiêu, làm từ bộ cộng nhỏ nào cũng được — sợi dây duy nhất giữa hai khối là số nhớ.</p>
<p class="pitfall">⚠️ Bẫy: tưởng bốn bộ cộng 8 bit chạy "song song". KHÔNG. Khối 2 không thể xong trước khi nhớ của khối 1 tới nơi. Các khối nằm cạnh nhau về mặt vật lý nhưng TUẦN TỰ về mặt logic — đó đúng là nghĩa của chữ "ripple".</p>`],

      [39, 'Sequential Circuit — the definition slide',
        `<p class="y-chinh">🎯 The hinge of the chapter, drawn as three circles. Centre: <strong>Sequential Circuit</strong>. Branch 1: "Current output depends <strong>not only on the current input, but also on the past history of inputs</strong>". Branch 2: "<strong>Makes use of combinational circuits</strong>". Everything from here to slide 51 lives on those two sentences.</p>
<ul>
<li><strong>Compare with the slide-32 definition of "memoryless".</strong> There, combinational circuits "retain no history of prior inputs". Here, sequential circuits do exactly that. The two slides are a matched pair, and an exam question about the difference is asking you to quote them.</li>
<li><strong>"Past history" is stored as STATE.</strong> A circuit cannot literally keep a log of every input it ever saw. It keeps a small summary — a few bits — and that summary is the <em>state</em>. A 1-bit state is a flip-flop (slide 40); n flip-flops give 2<sup>n</sup> states.</li>
<li><strong>Branch 2 is easy to skip over and it matters.</strong> A sequential circuit is <em>not</em> a new kind of device: it is combinational logic plus a feedback loop plus storage. The SR latch on slide 41 is literally two NOR gates with their outputs fed back to each other's inputs. <strong>Feedback is what turns combinational into sequential.</strong></li>
<li><strong>The general shape to carry in your head:</strong></li>
</ul>
<table>
<tr><th>Block</th><th>What it holds / does</th><th>Example in this deck</th></tr>
<tr><td>Combinational "next-state logic"</td><td>Computes the next state from (inputs, current state)</td><td>The AND gate feeding Jc/Kc on slide 51</td></tr>
<tr><td>State elements</td><td>Hold the current state until the next clock edge</td><td>The three J-K flip-flops on slide 51</td></tr>
<tr><td>Feedback path</td><td>Carries the current state back into the logic</td><td>The wires from A, B back to the AND gate</td></tr>
<tr><td>Clock</td><td>Says <em>when</em> the state may change</td><td>The Clock line on slides 44–49, 51</td></tr>
</table>
<p class="dap-an">✅ Same-input-different-output test, the practical way to tell the families apart: give an adder 0011 + 0001 twice and it answers 0100 twice. Give a counter a clock pulse twice and it answers 001 then 010. Same stimulus, different answer → there is state → sequential.</p>
<p class="meo">💡 One-line test: <strong>if the circuit needs to know "what happened before", it is sequential.</strong> Anything with a clock input, a feedback wire or the letter Q on it is sequential.</p>
<p class="pitfall">⚠️ The extracted text of this slide repeats the words "Sequential / Circuit" on separate lines — that is the big centre circle's label wrapped by the layout, not a second topic. Also note: the slide says sequential circuits <em>use</em> combinational circuits, which means every rule you learned for gates still applies; nothing is thrown away.</p>`,
        `<p class="y-chinh">🎯 Bản lề của cả chương, vẽ thành ba vòng tròn. Ở giữa: <strong>Sequential Circuit</strong> (mạch tuần tự). Nhánh 1: "Đầu ra hiện tại phụ thuộc <strong>không chỉ vào đầu vào hiện tại, mà còn vào LỊCH SỬ các đầu vào trước đó</strong>". Nhánh 2: "<strong>Có dùng tới mạch tổ hợp</strong>". Mọi thứ từ đây tới slide 51 đều đứng trên hai câu đó.</p>
<ul>
<li><strong>So với định nghĩa "memoryless" ở slide 32.</strong> Ở đó, mạch tổ hợp "không giữ lại lịch sử đầu vào trước đó". Ở đây, mạch tuần tự làm đúng chuyện ấy. Hai slide là một cặp song sinh, và câu hỏi thi về khác biệt giữa chúng chính là yêu cầu bạn đọc thuộc hai câu này.</li>
<li><strong>"Lịch sử quá khứ" được lưu dưới dạng TRẠNG THÁI.</strong> Mạch không thể ghi nhật ký mọi đầu vào nó từng thấy. Nó giữ một bản tóm tắt nhỏ — vài bit — và bản tóm tắt đó là <em>TRẠNG THÁI</em>. Trạng thái 1 bit là một flip-flop (slide 40); n flip-flop cho 2<sup>n</sup> trạng thái.</li>
<li><strong>Nhánh 2 dễ bị đọc lướt, mà nó quan trọng.</strong> Mạch tuần tự KHÔNG phải một loại linh kiện mới: nó là logic tổ hợp cộng một vòng phản hồi cộng phần tử lưu. Chốt SR ở slide 41 đúng nghĩa đen là hai cổng NOR có đầu ra vòng ngược về đầu vào của nhau. <strong>PHẢN HỒI mới là thứ biến tổ hợp thành tuần tự.</strong></li>
<li><strong>Hình dạng tổng quát cần thuộc lòng:</strong></li>
</ul>
<table>
<tr><th>Khối</th><th>Giữ gì / làm gì</th><th>Ví dụ trong chính deck này</th></tr>
<tr><td>Logic tổ hợp "sinh trạng thái kế"</td><td>Tính trạng thái kế từ (đầu vào, trạng thái hiện tại)</td><td>Cổng AND nuôi Jc/Kc ở slide 51</td></tr>
<tr><td>Phần tử trạng thái</td><td>Giữ trạng thái hiện tại tới sườn xung kế</td><td>Ba flip-flop J-K ở slide 51</td></tr>
<tr><td>Đường phản hồi</td><td>Mang trạng thái hiện tại quay lại logic</td><td>Các dây từ A, B về cổng AND</td></tr>
<tr><td>Xung nhịp</td><td>Nói KHI NÀO trạng thái được phép đổi</td><td>Đường Clock ở slide 44–49, 51</td></tr>
</table>
<p class="dap-an">✅ Phép thử "cùng đầu vào khác đầu ra", cách thực dụng để phân biệt hai họ: đưa cho bộ cộng phép 0011 + 0001 hai lần thì nó trả 0100 cả hai lần. Đưa cho bộ đếm một xung nhịp hai lần thì nó trả 001 rồi 010. Cùng kích thích, khác đáp số → có trạng thái → tuần tự.</p>
<p class="meo">💡 Phép thử một dòng: <strong>mạch cần biết "trước đó đã xảy ra gì" thì nó là tuần tự.</strong> Cái gì có chân xung nhịp, có dây phản hồi, hoặc có chữ Q trên đó thì là tuần tự.</p>
<p class="pitfall">⚠️ Bản trích chữ của slide này lặp hai chữ "Sequential / Circuit" trên hai dòng — đó là nhãn của vòng tròn lớn ở giữa bị bố cục ngắt dòng, không phải chủ đề thứ hai. Và để ý: slide nói mạch tuần tự <em>CÓ DÙNG</em> mạch tổ hợp, nghĩa là mọi luật bạn đã học về cổng vẫn còn nguyên giá trị; không thứ gì bị vứt đi.</p>`],

      [40, 'Flip-Flops — the two properties every flip-flop shares',
        `<p class="y-chinh">🎯 The slide's own words: the flip-flop is the <strong>simplest form of sequential circuit</strong>, and every variety shares exactly two properties. <strong>(1)</strong> "The flip-flop is a bistable device. It exists in one of two states and, in the absence of input, remains in that state. Thus, the flip-flop can function as a <strong>1-bit memory</strong>." <strong>(2)</strong> "The flip-flop has two outputs, which are always the <strong>complements</strong> of each other."</p>
<ul>
<li><strong>Unpack "bistable".</strong> Two stable states, and no third. Left alone, it stays put — that is memory. It does not decay like a capacitor and does not need refreshing; it holds as long as power is applied. This is exactly what makes SRAM (Ch.6) static and DRAM dynamic.</li>
<li><strong>"In the absence of input" is the memory clause.</strong> Remove the stimulus and the output does <em>not</em> go back to 0 — unlike every combinational circuit in this chapter. That one sentence is the border between slide 38 and slide 41.</li>
<li><strong>Property 2, Q and Q', is not decoration.</strong> The complement output comes free from the cross-coupled structure (slide 41), and it is genuinely useful: you often need both a signal and its inverse, and taking Q' from the flip-flop saves an inverter and, more importantly, saves the <em>delay</em> of an inverter — the two arrive at the same time.</li>
<li><strong>Property 2 is also a diagnostic.</strong> If a real circuit ever shows Q = Q' = 0 or Q = Q' = 1, something is wrong — and slide 43 shows exactly when that happens for an SR latch (the forbidden S = R = 1 input).</li>
<li><strong>Scale it up.</strong> 1 flip-flop = 1 bit. 8 in parallel = a byte register (slide 48). 5 in a chain = a shift register (slide 49). 3 with feedback = a counter (slide 51). Every storage element in a CPU is a pile of these.</li>
</ul>
<table>
<tr><th>Property</th><th>Slide's wording</th><th>Consequence you will be tested on</th></tr>
<tr><td>1. Bistable</td><td>Two states; with no input, stays there</td><td>It is a 1-bit memory; n flip-flops = 2<sup>n</sup> states</td></tr>
<tr><td>2. Complementary outputs</td><td>Q and Q' are always opposite</td><td>Q = Q' is an illegal/undefined condition, not a state</td></tr>
</table>
<p class="meo">💡 Picture a light switch, not a doorbell. A doorbell is combinational — press it and it rings, let go and it stops. A light switch is a flip-flop — flick it and it <em>stays</em> flicked.</p>
<p class="pitfall">⚠️ Terminology trap you will meet on slide 44: in strict usage a <em>latch</em> is level-triggered and a <em>flip-flop</em> is edge-triggered. This slide, and the book's figures, use "flip-flop" a little loosely for both. Read the figure caption, not just the word.</p>`,
        `<p class="y-chinh">🎯 Nguyên văn của slide: flip-flop là <strong>dạng ĐƠN GIẢN NHẤT của mạch tuần tự</strong>, và mọi biến thể đều chia sẻ đúng hai tính chất. <strong>(1)</strong> "Flip-flop là linh kiện HAI TRẠNG THÁI BỀN. Nó tồn tại ở một trong hai trạng thái và, KHI KHÔNG CÓ ĐẦU VÀO, nó nằm nguyên ở trạng thái đó. Vì vậy flip-flop có thể hoạt động như <strong>bộ nhớ 1 BIT</strong>." <strong>(2)</strong> "Flip-flop có hai đầu ra, và chúng LUÔN là <strong>phần bù</strong> của nhau."</p>
<ul>
<li><strong>Mổ chữ "bistable".</strong> Hai trạng thái bền, không có trạng thái thứ ba. Để yên thì nó nằm yên — đó là nhớ. Nó không rò như tụ điện và không cần làm tươi; nó giữ chừng nào còn điện. Đây đúng là thứ làm SRAM (Ch.6) là "tĩnh" còn DRAM là "động".</li>
<li><strong>Cụm "khi không có đầu vào" mới là mệnh đề NHỚ.</strong> Bỏ kích thích đi thì đầu ra KHÔNG quay về 0 — khác mọi mạch tổ hợp trong chương này. Đúng một câu đó là biên giới giữa slide 38 và slide 41.</li>
<li><strong>Tính chất 2, Q và Q', không phải trang trí.</strong> Đầu ra bù có sẵn miễn phí nhờ cấu trúc chéo (slide 41), và nó thật sự hữu ích: bạn thường cần cả một tín hiệu lẫn tín hiệu đảo của nó, lấy Q' thẳng từ flip-flop thì tiết kiệm một cổng NOT và — quan trọng hơn — tiết kiệm ĐỘ TRỄ của cổng đó: hai tín hiệu tới cùng lúc.</li>
<li><strong>Tính chất 2 còn là công cụ CHẨN ĐOÁN.</strong> Mạch thật mà lòi ra Q = Q' = 0 hay Q = Q' = 1 là có chuyện — và slide 43 chỉ đúng lúc nào chuyện đó xảy ra với chốt SR (đầu vào cấm S = R = 1).</li>
<li><strong>Nhân nó lên.</strong> 1 flip-flop = 1 bit. 8 cái song song = thanh ghi một byte (slide 48). 5 cái nối chuỗi = thanh ghi dịch (slide 49). 3 cái có phản hồi = bộ đếm (slide 51). Mọi phần tử lưu trữ trong CPU đều là một đống những cái này.</li>
</ul>
<table>
<tr><th>Tính chất</th><th>Cách slide diễn đạt</th><th>Hệ quả sẽ bị hỏi thi</th></tr>
<tr><td>1. Hai trạng thái bền</td><td>Hai trạng thái; không có đầu vào thì nằm yên</td><td>Nó là bộ nhớ 1 bit; n flip-flop = 2<sup>n</sup> trạng thái</td></tr>
<tr><td>2. Hai đầu ra bù nhau</td><td>Q và Q' luôn ngược nhau</td><td>Q = Q' là điều kiện CẤM/không xác định, không phải một trạng thái</td></tr>
</table>
<p class="meo">💡 Hình dung công tắc đèn, đừng hình dung chuông cửa. Chuông cửa là tổ hợp — bấm thì kêu, buông thì tắt. Công tắc đèn là flip-flop — gạt một cái là nó <em>NẰM YÊN</em> ở đó.</p>
<p class="pitfall">⚠️ Bẫy thuật ngữ sẽ gặp ở slide 44: nói cho chặt thì <em>chốt (latch)</em> kích theo MỨC còn <em>flip-flop</em> kích theo SƯỜN XUNG. Slide này, và các hình trong sách, dùng chữ "flip-flop" hơi lỏng cho cả hai. Đọc chú thích hình, đừng chỉ đọc mỗi cái từ.</p>`],

      [41, 'Figure 12.24 — The S–R Latch Implemented with NOR Gates',
        `<p class="y-chinh">🎯 The whole of sequential logic in two gates. Two NOR gates, <strong>cross-coupled</strong>: R enters the top gate whose output is <strong>Q</strong>; S enters the bottom gate whose output is <strong>Q'</strong>; and each output is wired back as the second input of the <em>other</em> gate. That single feedback loop is what creates memory out of memoryless parts.</p>
<ul>
<li><strong>Recall the NOR rule:</strong> output is 1 only when <em>both</em> inputs are 0; any 1 on an input forces the output to 0. Everything below follows mechanically from that.</li>
<li><strong>Case S = 1, R = 0 (SET).</strong> The bottom NOR sees S = 1 → Q' = 0. The top NOR now sees R = 0 and Q' = 0 → Q = 1. <strong>Q is set to 1.</strong></li>
<li><strong>Case S = 0, R = 1 (RESET).</strong> The top NOR sees R = 1 → Q = 0. The bottom NOR sees S = 0 and Q = 0 → Q' = 1. <strong>Q is cleared to 0.</strong></li>
<li><strong>Case S = 0, R = 0 (HOLD).</strong> Suppose Q = 1, Q' = 0. Top NOR: inputs 0 and 0 → Q stays 1. Bottom NOR: inputs 0 and 1 → Q' stays 0. The loop reinforces itself. Now suppose Q = 0, Q' = 1: by the same argument it also holds. <strong>Two stable solutions with the same inputs</strong> — that is the word "bistable", made concrete.</li>
<li><strong>Case S = 1, R = 1 (FORBIDDEN).</strong> Both gates see a 1 → both outputs go to 0 → <strong>Q = Q' = 0</strong>, which violates property 2 of slide 40. Worse is what happens next: drop both inputs to 0 at the same instant and which state the latch lands in depends on which gate is a nanosecond faster. The outcome is genuinely unpredictable — a <em>race condition</em>. That is why the row is marked "–" on Table 12.12.</li>
</ul>
<table>
<tr><th>S</th><th>R</th><th>Name</th><th>Q<sub>n+1</sub></th><th>Why</th></tr>
<tr><td>0</td><td>0</td><td>Hold</td><td>Q<sub>n</sub></td><td>Neither gate is forced; the loop keeps whatever it had</td></tr>
<tr><td>0</td><td>1</td><td>Reset</td><td>0</td><td>R = 1 forces the top NOR output to 0</td></tr>
<tr><td>1</td><td>0</td><td>Set</td><td>1</td><td>S = 1 forces Q' to 0, which releases the top NOR to 1</td></tr>
<tr><td>1</td><td>1</td><td>Forbidden</td><td>–</td><td>Q = Q' = 0 now, unpredictable state afterwards</td></tr>
</table>
<p class="dap-an">✅ Note the asymmetry the figure quietly encodes: <strong>R is on the gate that produces Q, S is on the gate that produces Q'</strong>. Follow the wires on the slide, not your memory of another textbook — several books draw it the other way round and then S appears on top. The behaviour is the same; the picture is mirrored.</p>
<p class="meo">💡 Mnemonic for the NOR latch: <strong>a 1 on an input KILLS the output of its own gate</strong>. S kills Q', and killing Q' lets Q live. R kills Q directly. Both at once kills both — hence "forbidden".</p>
<p class="pitfall">⚠️ This is a <strong>latch</strong>, not a flip-flop: there is no clock, so it reacts the instant an input changes. Do not call it "asynchronous" as a criticism — being asynchronous is its whole nature. Slide 44 adds the clock.</p>`,
        `<p class="y-chinh">🎯 Toàn bộ logic tuần tự gói trong hai cổng. Hai cổng NOR nối <strong>CHÉO NHAU</strong>: R vào cổng trên mà đầu ra của nó là <strong>Q</strong>; S vào cổng dưới mà đầu ra của nó là <strong>Q'</strong>; và mỗi đầu ra được nối ngược lại làm đầu vào thứ hai của cổng KIA. Đúng cái vòng phản hồi ấy tạo ra TRÍ NHỚ từ những linh kiện không nhớ.</p>
<ul>
<li><strong>Nhắc lại luật NOR:</strong> đầu ra bằng 1 chỉ khi CẢ HAI đầu vào bằng 0; chỉ cần một đầu vào bằng 1 là đầu ra bị ép về 0. Mọi thứ dưới đây suy ra máy móc từ đó.</li>
<li><strong>Ca S = 1, R = 0 (SET — đặt).</strong> Cổng NOR dưới thấy S = 1 → Q' = 0. Cổng NOR trên giờ thấy R = 0 và Q' = 0 → Q = 1. <strong>Q được đặt lên 1.</strong></li>
<li><strong>Ca S = 0, R = 1 (RESET — xoá).</strong> Cổng NOR trên thấy R = 1 → Q = 0. Cổng NOR dưới thấy S = 0 và Q = 0 → Q' = 1. <strong>Q bị xoá về 0.</strong></li>
<li><strong>Ca S = 0, R = 0 (HOLD — giữ).</strong> Giả sử Q = 1, Q' = 0. NOR trên: hai đầu vào 0 và 0 → Q giữ nguyên 1. NOR dưới: hai đầu vào 0 và 1 → Q' giữ nguyên 0. Vòng lặp tự củng cố chính nó. Giờ giả sử Q = 0, Q' = 1: lập luận y hệt, nó cũng giữ. <strong>HAI nghiệm bền với cùng một bộ đầu vào</strong> — đó là chữ "bistable", cụ thể hoá ra.</li>
<li><strong>Ca S = 1, R = 1 (CẤM).</strong> Cả hai cổng đều thấy một số 1 → cả hai đầu ra về 0 → <strong>Q = Q' = 0</strong>, vi phạm tính chất 2 của slide 40. Tệ hơn là chuyện xảy ra ngay sau đó: hạ cả hai đầu vào về 0 cùng một khoảnh khắc thì chốt rơi vào trạng thái nào phụ thuộc cổng nào nhanh hơn vài nano giây. Kết quả thật sự không đoán được — một <em>điều kiện chạy đua (race condition)</em>. Vì thế hàng đó ghi "–" trong Table 12.12.</li>
</ul>
<table>
<tr><th>S</th><th>R</th><th>Tên</th><th>Q<sub>n+1</sub></th><th>Vì sao</th></tr>
<tr><td>0</td><td>0</td><td>Giữ</td><td>Q<sub>n</sub></td><td>Không cổng nào bị ép; vòng lặp giữ nguyên cái đang có</td></tr>
<tr><td>0</td><td>1</td><td>Xoá</td><td>0</td><td>R = 1 ép đầu ra cổng NOR trên về 0</td></tr>
<tr><td>1</td><td>0</td><td>Đặt</td><td>1</td><td>S = 1 ép Q' về 0, nhờ đó cổng NOR trên được thả lên 1</td></tr>
<tr><td>1</td><td>1</td><td>Cấm</td><td>–</td><td>Bây giờ Q = Q' = 0, sau đó trạng thái không đoán được</td></tr>
</table>
<p class="dap-an">✅ Để ý cái bất đối xứng mà hình lặng lẽ mã hoá: <strong>R nằm ở cổng sinh ra Q, S nằm ở cổng sinh ra Q'</strong>. Hãy dò theo dây trên slide, đừng dò theo trí nhớ về một cuốn sách khác — vài cuốn vẽ ngược lại và khi đó S nằm ở trên. Hành vi thì y hệt; chỉ bức tranh bị lật gương.</p>
<p class="meo">💡 Mẹo nhớ cho chốt NOR: <strong>một số 1 ở đầu vào GIẾT đầu ra của chính cổng đó</strong>. S giết Q', và giết Q' thì Q được sống. R giết Q trực tiếp. Cả hai cùng lúc thì giết cả hai — nên mới gọi là "cấm".</p>
<p class="pitfall">⚠️ Đây là <strong>CHỐT (latch)</strong>, không phải flip-flop: không có xung nhịp, nên nó phản ứng NGAY khoảnh khắc đầu vào đổi. Đừng chê nó "không đồng bộ" như một khuyết điểm — không đồng bộ là bản chất của nó. Slide 44 mới thêm xung nhịp vào.</p>`],

      [42, 'Figure 12.25 — NOR S–R Latch Timing Diagram',
        `<p class="y-chinh">🎯 The same latch, but drawn against <em>time</em>. Four waveforms stacked: S, R, Q and Q'. Two dashed vertical lines mark the moments an input changes, and the figure labels the response delays: Q' answers after <strong>Δt</strong> (one gate delay) while Q answers after <strong>2Δt</strong> (two gate delays) — and on the second event the roles swap.</p>
<ul>
<li><strong>Why the delays differ, and why that is the most instructive part of the figure.</strong> When S rises, the <em>bottom</em> gate acts first: Q' falls after one gate delay Δt. Only then does the top gate see the new Q' and raise Q — one more Δt, so 2Δt total. The signal has to travel <em>around</em> the loop. When R rises it is the mirror image: Q falls after Δt, Q' rises after 2Δt. The figure marks exactly this on the slide.</li>
<li><strong>Read it as an event table.</strong> Timing diagrams are easier to grade and easier to remember as rows and columns:</li>
</ul>
<table>
<tr><th>Moment</th><th>S</th><th>R</th><th>What happens first (after Δt)</th><th>What happens second (after 2Δt)</th><th>Settled Q, Q'</th></tr>
<tr><td>before t<sub>1</sub></td><td>0</td><td>0</td><td>nothing — hold</td><td>nothing</td><td>Q = 0, Q' = 1</td></tr>
<tr><td>t<sub>1</sub>: S goes 0→1</td><td>1</td><td>0</td><td>Q' falls to 0</td><td>Q rises to 1</td><td>Q = 1, Q' = 0</td></tr>
<tr><td>S returns 1→0</td><td>0</td><td>0</td><td>nothing — hold</td><td>nothing</td><td>Q = 1, Q' = 0 (remembered!)</td></tr>
<tr><td>t<sub>2</sub>: R goes 0→1</td><td>0</td><td>1</td><td>Q falls to 0</td><td>Q' rises to 1</td><td>Q = 0, Q' = 1</td></tr>
<tr><td>R returns 1→0</td><td>0</td><td>0</td><td>nothing — hold</td><td>nothing</td><td>Q = 0, Q' = 1</td></tr>
</table>
<p class="dap-an">✅ The row that proves the latch is a memory is the third one: <strong>S has gone back to 0 and yet Q stays 1</strong>. The pulse is gone; its effect is not. Compare with an AND gate, whose output collapses the moment the input leaves. This single row is the difference between Chapter 12's first half and its second half.</p>
<ul>
<li><strong>Δt is a real, measurable quantity.</strong> It is the propagation delay of one NOR gate — a fraction of a nanosecond in modern CMOS. It sets the maximum rate at which the latch can be flipped, and multiplied across a chain of stages it becomes the ripple delay of slides 36, 38 and 50.</li>
<li><strong>The narrow-pulse hazard.</strong> If an input pulse is shorter than 2Δt, the loop may not have time to latch and the output can end up in an ill-defined intermediate level. That is the physical reason flip-flops specify a <em>minimum pulse width</em>, and the reason slide 44 introduces a clock to make all changes happen at controlled instants.</li>
<li><strong>What the diagram does not show.</strong> S = R = 1 is never applied here — deliberately. Drawing the forbidden case would require guessing which gate wins the race, and the figure refuses to guess.</li>
</ul>
<p class="meo">💡 To read any latch timing diagram fast: <strong>find the edges of S and R first, then ask "which output is on the gate that the input touches directly?" — that one moves after Δt, the other after 2Δt.</strong></p>
<p class="pitfall">⚠️ Trap: reading Q as "following S". It does not. Q rises when S rises, but it does <em>not</em> fall when S falls — only R can bring it down. Half the mistakes on latch timing questions come from treating S like a data input; the data input only appears with the D flip-flop on slide 45.</p>`,
        `<p class="y-chinh">🎯 Vẫn cái chốt đó, nhưng vẽ theo trục <em>THỜI GIAN</em>. Bốn dạng sóng xếp chồng: S, R, Q và Q'. Hai đường đứt nét dọc đánh dấu khoảnh khắc đầu vào đổi, và hình ghi rõ độ trễ đáp ứng: Q' trả lời sau <strong>Δt</strong> (một trễ cổng) còn Q trả lời sau <strong>2Δt</strong> (hai trễ cổng) — rồi ở sự kiện thứ hai thì hai vai đổi chỗ.</p>
<ul>
<li><strong>Vì sao độ trễ khác nhau, và vì sao đó là phần dạy nhiều nhất của hình.</strong> Khi S lên, cổng <em>DƯỚI</em> hành động trước: Q' rơi xuống sau một trễ cổng Δt. Mãi sau đó cổng trên mới thấy Q' mới và kéo Q lên — thêm một Δt nữa, tổng 2Δt. Tín hiệu phải chạy VÒNG QUANH vòng lặp. Khi R lên thì đối xứng gương: Q rơi sau Δt, Q' lên sau 2Δt. Hình ghi đúng chuyện đó trên slide.</li>
<li><strong>Đọc nó như một bảng sự kiện.</strong> Giản đồ thời gian dễ chấm và dễ nhớ hơn nhiều khi lập thành hàng và cột:</li>
</ul>
<table>
<tr><th>Khoảnh khắc</th><th>S</th><th>R</th><th>Việc xảy ra TRƯỚC (sau Δt)</th><th>Việc xảy ra SAU (sau 2Δt)</th><th>Q, Q' đã ổn định</th></tr>
<tr><td>trước t<sub>1</sub></td><td>0</td><td>0</td><td>không gì — giữ</td><td>không gì</td><td>Q = 0, Q' = 1</td></tr>
<tr><td>t<sub>1</sub>: S đi 0→1</td><td>1</td><td>0</td><td>Q' rơi về 0</td><td>Q lên 1</td><td>Q = 1, Q' = 0</td></tr>
<tr><td>S quay về 1→0</td><td>0</td><td>0</td><td>không gì — giữ</td><td>không gì</td><td>Q = 1, Q' = 0 (NHỚ!)</td></tr>
<tr><td>t<sub>2</sub>: R đi 0→1</td><td>0</td><td>1</td><td>Q rơi về 0</td><td>Q' lên 1</td><td>Q = 0, Q' = 1</td></tr>
<tr><td>R quay về 1→0</td><td>0</td><td>0</td><td>không gì — giữ</td><td>không gì</td><td>Q = 0, Q' = 1</td></tr>
</table>
<p class="dap-an">✅ Hàng chứng minh chốt là một BỘ NHỚ chính là hàng thứ ba: <strong>S đã về 0 rồi mà Q vẫn ở 1</strong>. Cái xung đã đi mất; hậu quả của nó thì không. So với cổng AND, đầu ra sụp ngay khoảnh khắc đầu vào rút đi. Đúng một hàng này là chỗ khác nhau giữa nửa đầu và nửa sau của Chương 12.</p>
<ul>
<li><strong>Δt là đại lượng THẬT, đo được.</strong> Nó là độ trễ lan truyền của một cổng NOR — vài phần mười nano giây trong CMOS hiện đại. Nó đặt ra tốc độ lật tối đa của chốt, và nhân lên qua một chuỗi tầng thì nó thành độ trễ ripple của slide 36, 38 và 50.</li>
<li><strong>Nguy cơ xung quá hẹp.</strong> Nếu xung đầu vào ngắn hơn 2Δt thì vòng lặp có thể chưa kịp chốt lại và đầu ra rơi vào mức trung gian không xác định. Đó là lý do vật lý khiến flip-flop phải quy định <em>ĐỘ RỘNG XUNG TỐI THIỂU</em>, và là lý do slide 44 đưa xung nhịp vào để mọi thay đổi xảy ra tại những khoảnh khắc có kiểm soát.</li>
<li><strong>Điều hình KHÔNG vẽ.</strong> S = R = 1 không hề được áp vào đây — một cách cố ý. Vẽ ca cấm thì phải đoán cổng nào thắng cuộc đua, và hình từ chối đoán.</li>
</ul>
<p class="meo">💡 Để đọc nhanh mọi giản đồ thời gian của chốt: <strong>tìm các sườn của S và R trước, rồi hỏi "đầu ra nào nằm trên cái cổng mà đầu vào chạm thẳng vào?" — cái đó động sau Δt, cái kia sau 2Δt.</strong></p>
<p class="pitfall">⚠️ Bẫy: đọc Q như thể nó "bám theo S". Không hề. Q lên khi S lên, nhưng nó KHÔNG rơi khi S rơi — chỉ R mới hạ được nó. Một nửa số lỗi trong câu hỏi giản đồ thời gian đến từ việc coi S như đầu vào dữ liệu; đầu vào dữ liệu chỉ xuất hiện cùng flip-flop D ở slide 45.</p>`],

      [43, 'Table 12.12 — The S–R Latch ((a) characteristic table, (b) simplified characteristic table, (c) response to a series of inputs)',
        `<p class="y-chinh">🎯 The latch of slide 41, written down three ways. <strong>(a)</strong> the full characteristic table — all four input pairs × both current states = 8 rows. <strong>(b)</strong> the same thing compressed to 4 rows by writing "Q<sub>n</sub>" instead of listing both states. <strong>(c)</strong> a worked 10-step trace of a real input sequence.</p>
<p class="nhan">📐 (a) Characteristic table — current inputs SR, current state Q<sub>n</sub>, next state Q<sub>n+1</sub>:</p>
<table>
<tr><th>SR</th><th>Q<sub>n</sub></th><th>Q<sub>n+1</sub></th><th>Name</th></tr>
<tr><td>00</td><td>0</td><td>0</td><td>hold</td></tr>
<tr><td>00</td><td>1</td><td>1</td><td>hold</td></tr>
<tr><td>01</td><td>0</td><td>0</td><td>reset</td></tr>
<tr><td>01</td><td>1</td><td>0</td><td>reset</td></tr>
<tr><td>10</td><td>0</td><td>1</td><td>set</td></tr>
<tr><td>10</td><td>1</td><td>1</td><td>set</td></tr>
<tr><td>11</td><td>0</td><td>–</td><td>forbidden</td></tr>
<tr><td>11</td><td>1</td><td>–</td><td>forbidden</td></tr>
</table>
<p class="nhan">📐 (b) Simplified characteristic table — 8 rows collapse to 4:</p>
<table>
<tr><th>S</th><th>R</th><th>Q<sub>n+1</sub></th></tr>
<tr><td>0</td><td>0</td><td>Q<sub>n</sub></td></tr>
<tr><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>–</td></tr>
</table>
<p class="nhan">📐 <strong>The S–R excitation table</strong> (not on any slide of this deck — added because it is examined). Read it backwards: you know the transition you <em>want</em>, it tells you the inputs you must apply. Generated by machine from the characteristic table:</p>
<table>
<tr><th>Q<sub>n</sub> → Q<sub>n+1</sub></th><th>S</th><th>R</th><th>Reasoning</th></tr>
<tr><td>0 → 0</td><td>0</td><td>d</td><td>hold (00) or reset (01) both work → R is don't-care</td></tr>
<tr><td>0 → 1</td><td>1</td><td>0</td><td>only set works</td></tr>
<tr><td>1 → 0</td><td>0</td><td>1</td><td>only reset works</td></tr>
<tr><td>1 → 1</td><td>d</td><td>0</td><td>hold (00) or set (10) both work → S is don't-care</td></tr>
</table>
<p class="nhan">📐 (c) Response to a series of inputs — the slide's own 10-step sequence, re-run by machine:</p>
<table>
<tr><th>t</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr>
<tr><td>S</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>R</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>Q<sub>n+1</sub></td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td></tr>
</table>
<p class="dap-an">✅ Simulated with a 4-line model of the latch (hold / set / reset / forbidden) for all 10 steps: the result is 1,1,1,0,0,0,0,0,1,1 — <strong>identical to the row printed on the slide</strong>. Walk it yourself: t = 0 sets Q to 1; t = 1 and 2 are 00 so Q holds at 1; t = 3 resets to 0; t = 4 and 5 hold at 0; t = 6 resets again (no change, it was already 0); t = 7 holds; t = 8 sets to 1; t = 9 holds at 1.</p>
<p class="pitfall">⚠️ <strong>Error in the original slide.</strong> Table (b) labels its first two columns "<strong>A</strong>" and "<strong>B</strong>" where they must be "<strong>S</strong>" and "<strong>R</strong>" — table (a) right beside it uses SR correctly, and the entries (00 → Q<sub>n</sub>, 01 → 0, 10 → 1, 11 → –) are exactly the S–R behaviour. This was checked against the rendered slide image, so it is a real labelling slip in the Pearson deck, not an extraction artefact. Answer exam questions using S and R.</p>
<p class="meo">💡 Learn the two directions by their job: the <strong>characteristic table answers "given the inputs, what happens?"</strong> (analysis), the <strong>excitation table answers "I want this transition, what inputs?"</strong> (design). Every counter-design problem, including slide 51, is an excitation-table problem.</p>`,
        `<p class="y-chinh">🎯 Cái chốt của slide 41, viết ra theo ba cách. <strong>(a)</strong> bảng đặc tính đầy đủ — cả bốn cặp đầu vào × cả hai trạng thái hiện tại = 8 hàng. <strong>(b)</strong> vẫn thứ đó nhưng nén còn 4 hàng nhờ viết "Q<sub>n</sub>" thay vì liệt kê cả hai trạng thái. <strong>(c)</strong> một bài chạy tay 10 bước với chuỗi đầu vào thật.</p>
<p class="nhan">📐 (a) Bảng đặc tính — đầu vào hiện tại SR, trạng thái hiện tại Q<sub>n</sub>, trạng thái kế Q<sub>n+1</sub>:</p>
<table>
<tr><th>SR</th><th>Q<sub>n</sub></th><th>Q<sub>n+1</sub></th><th>Tên gọi</th></tr>
<tr><td>00</td><td>0</td><td>0</td><td>giữ</td></tr>
<tr><td>00</td><td>1</td><td>1</td><td>giữ</td></tr>
<tr><td>01</td><td>0</td><td>0</td><td>xoá</td></tr>
<tr><td>01</td><td>1</td><td>0</td><td>xoá</td></tr>
<tr><td>10</td><td>0</td><td>1</td><td>đặt</td></tr>
<tr><td>10</td><td>1</td><td>1</td><td>đặt</td></tr>
<tr><td>11</td><td>0</td><td>–</td><td>CẤM</td></tr>
<tr><td>11</td><td>1</td><td>–</td><td>CẤM</td></tr>
</table>
<p class="nhan">📐 (b) Bảng đặc tính rút gọn — 8 hàng co lại còn 4:</p>
<table>
<tr><th>S</th><th>R</th><th>Q<sub>n+1</sub></th></tr>
<tr><td>0</td><td>0</td><td>Q<sub>n</sub></td></tr>
<tr><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>–</td></tr>
</table>
<p class="nhan">📐 <strong>Bảng KÍCH THÍCH (excitation table) của S–R</strong> — không có trên slide nào của deck này, bổ sung vì nó RA THI. Đọc ngược lại: bạn biết bước chuyển mình <em>MUỐN</em>, bảng cho biết phải đặt đầu vào nào. Sinh bằng máy từ bảng đặc tính:</p>
<table>
<tr><th>Q<sub>n</sub> → Q<sub>n+1</sub></th><th>S</th><th>R</th><th>Lập luận</th></tr>
<tr><td>0 → 0</td><td>0</td><td>d</td><td>giữ (00) hay xoá (01) đều được → R tuỳ ý</td></tr>
<tr><td>0 → 1</td><td>1</td><td>0</td><td>chỉ có đặt mới được</td></tr>
<tr><td>1 → 0</td><td>0</td><td>1</td><td>chỉ có xoá mới được</td></tr>
<tr><td>1 → 1</td><td>d</td><td>0</td><td>giữ (00) hay đặt (10) đều được → S tuỳ ý</td></tr>
</table>
<p class="nhan">📐 (c) Đáp ứng với một chuỗi đầu vào — đúng chuỗi 10 bước của slide, chạy lại bằng máy:</p>
<table>
<tr><th>t</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr>
<tr><td>S</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>R</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>Q<sub>n+1</sub></td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td></tr>
</table>
<p class="dap-an">✅ Mô phỏng bằng mô hình 4 dòng của chốt (giữ / đặt / xoá / cấm) cho cả 10 bước: kết quả 1,1,1,0,0,0,0,0,1,1 — <strong>TRÙNG KHÍT hàng in trên slide</strong>. Tự dò lại: t = 0 đặt Q lên 1; t = 1 và 2 là 00 nên Q giữ ở 1; t = 3 xoá về 0; t = 4 và 5 giữ ở 0; t = 6 xoá lần nữa (không đổi gì, nó đã là 0); t = 7 giữ; t = 8 đặt lên 1; t = 9 giữ ở 1.</p>
<p class="pitfall">⚠️ <strong>SLIDE GỐC GHI SAI.</strong> Bảng (b) ghi hai cột đầu là "<strong>A</strong>" và "<strong>B</strong>" trong khi lẽ ra phải là "<strong>S</strong>" và "<strong>R</strong>" — bảng (a) ngay bên cạnh dùng đúng SR, và các ô bên trong (00 → Q<sub>n</sub>, 01 → 0, 10 → 1, 11 → –) đúng là hành vi S–R. Chuyện này đã đối chiếu với ảnh slide đã render, nên đó là lỗi nhãn thật trong bộ slide của Pearson, không phải lỗi trích chữ. Đi thi thì trả lời bằng S và R.</p>
<p class="meo">💡 Nhớ hai chiều bằng công việc của chúng: <strong>bảng ĐẶC TÍNH trả lời "cho đầu vào rồi, chuyện gì xảy ra?"</strong> (phân tích), <strong>bảng KÍCH THÍCH trả lời "tôi muốn bước chuyển này, phải đặt đầu vào nào?"</strong> (thiết kế). Mọi bài thiết kế bộ đếm, kể cả slide 51, đều là bài dùng bảng kích thích.</p>`],

      [44, 'Figure 12.26 — Clocked S–R Flip-Flop',
        `<p class="y-chinh">🎯 Take the NOR latch of slide 41 and put a gate in front of each input: R AND Clock into the top, S AND Clock into the bottom. Now the latch only <em>sees</em> S and R while the clock is asserted. This is the birth of <strong>synchronous</strong> logic, and the point where "latch" and "flip-flop" start to mean different things.</p>
<ul>
<li><strong>What the AND gates do.</strong> With Clock = 0, both AND outputs are 0, so the latch sees S = R = 00 = hold, no matter how wildly S and R are changing outside. With Clock = 1, the AND gates pass S and R straight through and the latch behaves exactly as on slide 41.</li>
<li><strong>Why anyone would want that.</strong> In a real machine, dozens of signals arrive at slightly different times because of different path delays. If every latch reacted immediately, a circuit would depend on wire lengths. The clock creates <strong>agreed instants</strong> at which all storage updates, and the combinational logic gets the rest of the cycle to settle. Chapter 16's whole instruction cycle rests on this.</li>
<li><strong>Latch versus flip-flop — the distinction students lose marks on:</strong></li>
</ul>
<table>
<tr><th></th><th>Latch (level-triggered)</th><th>Flip-flop (edge-triggered)</th></tr>
<tr><td>When it listens</td><td>The whole time the enable/clock is 1</td><td>Only at the instant of the clock <em>edge</em> (rising or falling)</td></tr>
<tr><td>Input changes mid-window</td><td>Pass straight through to Q — "transparent"</td><td>Ignored; only the value at the edge matters</td></tr>
<tr><td>Symbol</td><td>No triangle on the clock pin</td><td>Small <strong>triangle</strong> on the clock pin (see slides 47–49, 51)</td></tr>
<tr><td>Example here</td><td>Figure 12.24 (no clock at all), Figure 12.26 while Clock = 1</td><td>What the D and J-K symbols on Figure 12.29 denote</td></tr>
<tr><td>Safe in a feedback loop?</td><td>No — output can race back round within the same window</td><td>Yes — the new state cannot affect this edge</td></tr>
</table>
<p class="dap-an">✅ Concrete difference. Suppose S pulses 0→1→0 <em>twice</em> while Clock is 1. A <em>level-triggered</em> clocked latch acts on both pulses (though here both just set Q to 1, so you cannot see it). Put J = K = 1 on a level-triggered J-K instead and the output would oscillate for as long as the clock is high — the classic <em>race-around</em> problem. An <em>edge-triggered</em> flip-flop samples once per edge and toggles exactly once. That is why real J-K flip-flops are edge-triggered or master–slave.</p>
<ul>
<li><strong>What this figure does NOT fix.</strong> Adding a clock does not remove the forbidden S = R = 1 combination — it only decides <em>when</em> it is applied. The fix for that comes on slide 46 with the J-K.</li>
<li><strong>Cost: 2 extra AND gates per flip-flop.</strong> Multiply by the thousands of flip-flops in a CPU and you get one of the reasons the clock network is among the biggest power consumers on a chip.</li>
</ul>
<p class="meo">💡 Mnemonic: <strong>a latch is a door held open; a flip-flop is a camera shutter.</strong> While the door is open anything can walk through; the shutter captures one instant and nothing else.</p>
<p class="pitfall">⚠️ Exam trap #1: calling Figure 12.26 "edge-triggered". As drawn it is <em>level</em>-triggered — it is transparent for the whole time Clock = 1. Exam trap #2: assuming "clocked" and "edge-triggered" are synonyms. They are not; clocked only means "gated by a clock".</p>`,
        `<p class="y-chinh">🎯 Lấy chốt NOR của slide 41 rồi đặt thêm một cổng trước mỗi đầu vào: R AND Clock vào cổng trên, S AND Clock vào cổng dưới. Bây giờ cái chốt chỉ <em>NHÌN THẤY</em> S và R trong lúc xung nhịp đang tích cực. Đây là thời điểm ra đời của logic <strong>ĐỒNG BỘ</strong>, và là chỗ mà "chốt" và "flip-flop" bắt đầu mang nghĩa khác nhau.</p>
<ul>
<li><strong>Hai cổng AND làm gì.</strong> Khi Clock = 0, cả hai đầu ra AND đều bằng 0, nên chốt thấy S = R = 00 = GIỮ, bất kể bên ngoài S và R có nhảy loạn thế nào. Khi Clock = 1, hai cổng AND cho S và R đi thẳng qua và chốt hành xử y như slide 41.</li>
<li><strong>Vì sao người ta lại muốn thế.</strong> Trong máy thật, hàng chục tín hiệu tới nơi lệch nhau chút ít vì đường dây dài ngắn khác nhau. Nếu mọi chốt phản ứng tức thời thì mạch sẽ phụ thuộc vào... độ dài dây. Xung nhịp tạo ra những <strong>khoảnh khắc ĐÃ THOẢ THUẬN</strong> để mọi phần tử lưu cùng cập nhật, và logic tổ hợp được cả phần còn lại của chu kỳ để ổn định. Cả chu trình lệnh của Chương 16 đứng trên chuyện này.</li>
<li><strong>Chốt so với flip-flop — chỗ sinh viên mất điểm nhiều nhất:</strong></li>
</ul>
<table>
<tr><th></th><th>Chốt (latch) — kích theo MỨC</th><th>Flip-flop — kích theo SƯỜN</th></tr>
<tr><td>Nó nghe khi nào</td><td>SUỐT thời gian enable/clock bằng 1</td><td>Chỉ đúng khoảnh khắc có <em>SƯỜN</em> xung (lên hoặc xuống)</td></tr>
<tr><td>Đầu vào đổi giữa cửa sổ</td><td>Đi thẳng ra Q — "trong suốt"</td><td>Bị bỏ qua; chỉ giá trị TẠI SƯỜN mới tính</td></tr>
<tr><td>Ký hiệu</td><td>Chân xung nhịp KHÔNG có tam giác</td><td>Có <strong>TAM GIÁC</strong> nhỏ ở chân xung nhịp (xem slide 47–49, 51)</td></tr>
<tr><td>Ví dụ ở đây</td><td>Figure 12.24 (không có xung nhịp), Figure 12.26 trong lúc Clock = 1</td><td>Đúng thứ mà ký hiệu D và J-K ở Figure 12.29 biểu thị</td></tr>
<tr><td>An toàn trong vòng phản hồi?</td><td>KHÔNG — đầu ra có thể chạy vòng lại ngay trong cùng cửa sổ</td><td>CÓ — trạng thái mới không ảnh hưởng được sườn này</td></tr>
</table>
<p class="dap-an">✅ Khác biệt cụ thể. Giả sử S nảy 0→1→0 <em>HAI LẦN</em> trong lúc Clock = 1. Chốt có xung nhịp kiểu <em>theo mức</em> sẽ phản ứng với cả hai lần nảy (ở đây cả hai đều chỉ đặt Q = 1 nên không thấy được). Nhưng thử đặt J = K = 1 lên một J-K kiểu theo mức thì đầu ra sẽ DAO ĐỘNG suốt thời gian xung còn cao — đó là lỗi kinh điển <em>race-around</em>. Flip-flop <em>theo SƯỜN</em> lấy mẫu đúng một lần mỗi sườn và lật đúng một lần. Vì thế flip-flop J-K thật đều là loại theo sườn hoặc master–slave.</p>
<ul>
<li><strong>Điều hình này KHÔNG sửa được.</strong> Thêm xung nhịp không loại bỏ tổ hợp cấm S = R = 1 — nó chỉ quyết định <em>KHI NÀO</em> tổ hợp đó được áp vào. Cách chữa nằm ở slide 46 với J-K.</li>
<li><strong>Cái giá: thêm 2 cổng AND mỗi flip-flop.</strong> Nhân với hàng nghìn flip-flop trong một CPU thì đó là một trong những lý do mạng phân phối xung nhịp nằm trong nhóm ngốn điện nhất của con chip.</li>
</ul>
<p class="meo">💡 Mẹo nhớ: <strong>chốt là CÁNH CỬA đang mở; flip-flop là MÀN TRẬP máy ảnh.</strong> Cửa còn mở thì ai cũng đi qua được; màn trập chỉ chộp đúng một khoảnh khắc, ngoài ra không gì lọt.</p>
<p class="pitfall">⚠️ Bẫy thi #1: gọi Figure 12.26 là "kích theo sườn". Vẽ như thế thì nó kích theo <em>MỨC</em> — nó trong suốt suốt thời gian Clock = 1. Bẫy thi #2: tưởng "có xung nhịp" và "kích theo sườn" là đồng nghĩa. Không hề; "có xung nhịp" chỉ nghĩa là "bị xung nhịp kiểm soát".</p>`],

      [45, 'Figure 12.27 — D Flip-Flop',
        `<p class="y-chinh">🎯 The cheapest possible fix for the forbidden state: <strong>make it impossible to ask for it</strong>. Take the clocked S–R of slide 44, delete one input, and drive S from D and R from D' through a single inverter. Now S and R are always opposite, so SR = 11 can never occur — and neither can SR = 00, which means D always writes.</p>
<ul>
<li><strong>Trace the figure.</strong> D goes to the lower AND gate directly and through the inverter to the upper AND gate. Clock gates both. So with Clock = 1: D = 1 → (S, R) = (1, 0) → set → Q = 1; D = 0 → (S, R) = (0, 1) → reset → Q = 0. <strong>Q simply becomes D.</strong></li>
<li><strong>Characteristic table — two rows, and that is the whole device:</strong></li>
</ul>
<table>
<tr><th>D</th><th>Q<sub>n</sub></th><th>Q<sub>n+1</sub></th></tr>
<tr><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>1</td></tr>
</table>
<p class="nhan">📐 Characteristic equation: <code>Q<sub>n+1</sub> = D</code>. The current state does not appear at all — the D flip-flop has no memory <em>of its own inputs</em>, only of the last value clocked in. That is why the "D" is read both as <strong>Data</strong> and as <strong>Delay</strong>.</p>
<p class="nhan">📐 <strong>D excitation table</strong> (added — not on the slide). It is the simplest of the four, which is exactly why modern design uses D flip-flops almost exclusively:</p>
<table>
<tr><th>Q<sub>n</sub> → Q<sub>n+1</sub></th><th>D</th></tr>
<tr><td>0 → 0</td><td>0</td></tr>
<tr><td>0 → 1</td><td>1</td></tr>
<tr><td>1 → 0</td><td>0</td></tr>
<tr><td>1 → 1</td><td>1</td></tr>
</table>
<p class="nhan">📐 <strong>Timing run, 8 clocks, Q starts at 0</strong> — simulated, not guessed. Each column is one clock edge; Q is the value <em>after</em> that edge:</p>
<table>
<tr><th>Clock edge</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
<tr><td>D</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>Q after edge</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
</table>
<p class="dap-an">✅ Machine-verified: the Q row is <strong>identical to the D row, shifted one clock later</strong>. That is the entire behaviour of a D flip-flop, and it is why a chain of them (slide 49) shifts data along one position per clock.</p>
<ul>
<li><strong>Why it dominates real design.</strong> One data input, no illegal combination, no don't-cares in its excitation table, and it maps directly onto "this wire's value at the clock edge becomes the new state". Every register in a modern CPU — PC, IR, MAR, MBR, the register file — is built from D flip-flops.</li>
<li><strong>Setup and hold.</strong> D must be stable for a short window <em>before</em> the edge (setup time) and <em>after</em> it (hold time). Violate it and you get metastability — the output hovering between 0 and 1. This is the practical successor to the 2Δt discussion on slide 42.</li>
</ul>
<p class="meo">💡 Remember it as <strong>"Q catches D at the edge and keeps it until the next edge"</strong>. If you can say that sentence, you can fill in any D timing diagram in an exam in under a minute.</p>
<p class="pitfall">⚠️ Trap: writing Q<sub>n+1</sub> = D <em>for all time</em>. It is only true at the clock edge. Between edges D can wobble as much as it likes and Q does not care — that is the entire reason the clock exists.</p>`,
        `<p class="y-chinh">🎯 Cách chữa rẻ nhất cho trạng thái cấm: <strong>làm cho không thể YÊU CẦU nó được nữa</strong>. Lấy S–R có xung nhịp của slide 44, xoá bớt một đầu vào, rồi lái S từ D và lái R từ D' qua một cổng NOT duy nhất. Bây giờ S và R luôn ngược nhau nên SR = 11 không bao giờ xảy ra — và SR = 00 cũng không, nghĩa là D luôn được ghi.</p>
<ul>
<li><strong>Dò theo hình.</strong> D đi thẳng vào cổng AND dưới và đi qua cổng NOT vào cổng AND trên. Clock khống chế cả hai. Vậy khi Clock = 1: D = 1 → (S, R) = (1, 0) → đặt → Q = 1; D = 0 → (S, R) = (0, 1) → xoá → Q = 0. <strong>Q đơn giản là trở thành D.</strong></li>
<li><strong>Bảng đặc tính — hai hàng, và linh kiện chỉ có thế:</strong></li>
</ul>
<table>
<tr><th>D</th><th>Q<sub>n</sub></th><th>Q<sub>n+1</sub></th></tr>
<tr><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>1</td></tr>
</table>
<p class="nhan">📐 Phương trình đặc tính: <code>Q<sub>n+1</sub> = D</code>. Trạng thái hiện tại KHÔNG xuất hiện chút nào — flip-flop D không nhớ <em>các đầu vào của chính nó</em>, nó chỉ nhớ giá trị vừa được chốt vào lần cuối. Vì thế chữ "D" được đọc vừa là <strong>Data (dữ liệu)</strong> vừa là <strong>Delay (trễ)</strong>.</p>
<p class="nhan">📐 <strong>Bảng kích thích của D</strong> (bổ sung — không có trên slide). Nó đơn giản nhất trong bốn loại, và đó chính là lý do thiết kế hiện đại gần như chỉ dùng flip-flop D:</p>
<table>
<tr><th>Q<sub>n</sub> → Q<sub>n+1</sub></th><th>D</th></tr>
<tr><td>0 → 0</td><td>0</td></tr>
<tr><td>0 → 1</td><td>1</td></tr>
<tr><td>1 → 0</td><td>0</td></tr>
<tr><td>1 → 1</td><td>1</td></tr>
</table>
<p class="nhan">📐 <strong>Chạy tay giản đồ thời gian, 8 nhịp, Q khởi đầu bằng 0</strong> — mô phỏng bằng máy, không phỏng đoán. Mỗi cột là một sườn xung; Q là giá trị <em>SAU</em> sườn đó:</p>
<table>
<tr><th>Sườn xung</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
<tr><td>D</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>Q sau sườn</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
</table>
<p class="dap-an">✅ Kiểm bằng máy: hàng Q <strong>y hệt hàng D, dịch chậm đúng một nhịp</strong>. Đó là toàn bộ hành vi của flip-flop D, và là lý do một chuỗi chúng nối tiếp (slide 49) đẩy dữ liệu đi một vị trí mỗi nhịp.</p>
<ul>
<li><strong>Vì sao nó thống trị thiết kế thật.</strong> Một đầu vào dữ liệu, không có tổ hợp cấm, bảng kích thích không có ô tuỳ ý nào, và nó ánh xạ thẳng vào câu "giá trị của sợi dây này tại sườn xung trở thành trạng thái mới". Mọi thanh ghi trong CPU hiện đại — PC, IR, MAR, MBR, tệp thanh ghi — đều dựng từ flip-flop D.</li>
<li><strong>Thời gian setup và hold.</strong> D phải đứng yên một khoảng ngắn <em>TRƯỚC</em> sườn (setup time) và <em>SAU</em> sườn (hold time). Vi phạm thì gặp trạng thái siêu bền (metastability) — đầu ra lơ lửng giữa 0 và 1. Đây là hậu duệ thực dụng của phần bàn về 2Δt ở slide 42.</li>
</ul>
<p class="meo">💡 Nhớ kiểu này: <strong>"Q CHỘP lấy D tại sườn xung rồi GIỮ tới sườn kế"</strong>. Nói được câu đó là điền được mọi giản đồ thời gian D trong đề thi dưới một phút.</p>
<p class="pitfall">⚠️ Bẫy: viết Q<sub>n+1</sub> = D <em>mọi lúc</em>. Nó chỉ đúng TẠI SƯỜN XUNG. Giữa hai sườn thì D có nhảy nhót thế nào Q cũng mặc kệ — đó đúng là lý do xung nhịp tồn tại.</p>`],

      [46, 'Figure 12.28 — J–K Flip-Flop',
        `<p class="y-chinh">🎯 The other way to kill the forbidden state: <strong>give it a useful meaning instead of banning it</strong>. The figure is the clocked S–R with two extra feedback wires — Q' is fed back into the J AND gate and Q into the K AND gate. The result: J = K = 1 no longer breaks the latch, it <strong>toggles</strong> it.</p>
<ul>
<li><strong>Follow the feedback and the mystery disappears.</strong> The top AND gate gets (K, Clock, Q); the bottom gets (J, Clock, Q'). So the latch's effective R is K·Q and its effective S is J·Q'. If Q = 1, then Q' = 0, so S is forced to 0 and only K can act. If Q = 0, only J can act. <strong>The forbidden SR = 11 can never reach the latch</strong> because the feedback disables whichever input would be redundant.</li>
<li><strong>Now J = K = 1 does something useful.</strong> With Q = 0: S = J·Q' = 1, R = K·Q = 0 → set → Q becomes 1. With Q = 1: S = 0, R = 1 → reset → Q becomes 0. Either way the state <strong>inverts</strong>. This one behaviour is what makes counters possible (slide 51).</li>
<li><strong>Characteristic table (matching Figure 12.29 on slide 47):</strong></li>
</ul>
<table>
<tr><th>J</th><th>K</th><th>Q<sub>n+1</sub></th><th>Name</th><th>Corresponds to S–R</th></tr>
<tr><td>0</td><td>0</td><td>Q<sub>n</sub></td><td>hold</td><td>SR = 00</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>reset</td><td>SR = 01</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>set</td><td>SR = 10</td></tr>
<tr><td>1</td><td>1</td><td>Q<sub>n</sub>'</td><td><strong>toggle</strong></td><td>SR = 11 was FORBIDDEN — this is the whole improvement</td></tr>
</table>
<p class="nhan">📐 Characteristic equation: <code>Q<sub>n+1</sub> = J·Q<sub>n</sub>' + K'·Q<sub>n</sub></code>. Verify it on the four rows: J=K=0 → Q<sub>n</sub>; J=0,K=1 → 0; J=1,K=0 → Q<sub>n</sub>' + Q<sub>n</sub> = 1; J=K=1 → Q<sub>n</sub>'.</p>
<p class="nhan">📐 <strong>J–K excitation table</strong> (added — not on the slide, and it is the single most exam-relevant table in the chapter). Each transition has <em>two</em> ways to achieve it, which is where all the "d" entries on slide 51 come from:</p>
<table>
<tr><th>Q<sub>n</sub> → Q<sub>n+1</sub></th><th>J</th><th>K</th><th>Which input pairs work</th></tr>
<tr><td>0 → 0</td><td>0</td><td>d</td><td>hold (00) or reset (01)</td></tr>
<tr><td>0 → 1</td><td>1</td><td>d</td><td>set (10) or toggle (11)</td></tr>
<tr><td>1 → 0</td><td>d</td><td>1</td><td>reset (01) or toggle (11)</td></tr>
<tr><td>1 → 1</td><td>d</td><td>0</td><td>hold (00) or set (10)</td></tr>
</table>
<p class="nhan">📐 <strong>Timing run, 8 clocks, Q starts at 0</strong> — simulated with a J-K model, every step checked:</p>
<table>
<tr><th>Clock edge</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
<tr><td>J</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>K</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>Action</td><td>set</td><td>hold</td><td>set</td><td>toggle</td><td>reset</td><td>hold</td><td>toggle</td><td>reset</td></tr>
<tr><td>Q after edge</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
</table>
<p class="dap-an">✅ Answer: <strong>Q = 1, 1, 1, 0, 0, 0, 1, 0</strong>. Read the interesting edges: at edge 3 the flip-flop is already 1 and "set" leaves it there; at edge 4 J = K = 1 <em>toggles</em> 1 → 0; at edge 7 J = K = 1 toggles 0 → 1. Notice edges 4 and 7 have identical inputs and produce <em>opposite</em> outputs — the clearest possible demonstration that this is a sequential circuit.</p>
<p class="meo">💡 Four-word memory hook for J-K: <strong>00 hold, 01 reset, 10 set, 11 toggle</strong>. And the reason it beats S-R in one sentence: <em>the forbidden row became the most useful row.</em></p>
<p class="pitfall">⚠️ Trap: a purely level-triggered J-K with J = K = 1 will oscillate for as long as the clock is high (the <em>race-around</em> problem), because the toggled output feeds straight back and toggles again. Real J-K flip-flops must be edge-triggered or master–slave. The figure shows the principle, not a safe implementation.</p>`,
        `<p class="y-chinh">🎯 Cách thứ hai để diệt trạng thái cấm: <strong>gán cho nó một ý nghĩa CÓ ÍCH thay vì cấm đoán</strong>. Hình vẽ chính là S–R có xung nhịp cộng thêm hai dây phản hồi — Q' vòng về cổng AND của J, và Q vòng về cổng AND của K. Kết quả: J = K = 1 không còn làm hỏng chốt nữa, nó <strong>LẬT</strong> chốt.</p>
<ul>
<li><strong>Dò theo đường phản hồi là hết bí ẩn.</strong> Cổng AND trên nhận (K, Clock, Q); cổng dưới nhận (J, Clock, Q'). Vậy R hiệu dụng của chốt là K·Q, còn S hiệu dụng là J·Q'. Nếu Q = 1 thì Q' = 0, nên S bị ép về 0 và chỉ K mới tác động được. Nếu Q = 0 thì chỉ J mới tác động được. <strong>Tổ hợp cấm SR = 11 KHÔNG BAO GIỜ tới được cái chốt</strong> vì phản hồi đã vô hiệu hoá đúng cái đầu vào thừa.</li>
<li><strong>Giờ J = K = 1 làm một việc có ích.</strong> Với Q = 0: S = J·Q' = 1, R = K·Q = 0 → đặt → Q thành 1. Với Q = 1: S = 0, R = 1 → xoá → Q thành 0. Kiểu nào thì trạng thái cũng bị <strong>ĐẢO</strong>. Đúng một hành vi này làm cho bộ đếm trở nên khả thi (slide 51).</li>
<li><strong>Bảng đặc tính (khớp Figure 12.29 ở slide 47):</strong></li>
</ul>
<table>
<tr><th>J</th><th>K</th><th>Q<sub>n+1</sub></th><th>Tên gọi</th><th>Tương ứng S–R</th></tr>
<tr><td>0</td><td>0</td><td>Q<sub>n</sub></td><td>giữ</td><td>SR = 00</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>xoá</td><td>SR = 01</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>đặt</td><td>SR = 10</td></tr>
<tr><td>1</td><td>1</td><td>Q<sub>n</sub>'</td><td><strong>LẬT (toggle)</strong></td><td>SR = 11 vốn là CẤM — đây là toàn bộ cải tiến</td></tr>
</table>
<p class="nhan">📐 Phương trình đặc tính: <code>Q<sub>n+1</sub> = J·Q<sub>n</sub>' + K'·Q<sub>n</sub></code>. Kiểm trên bốn hàng: J=K=0 → Q<sub>n</sub>; J=0,K=1 → 0; J=1,K=0 → Q<sub>n</sub>' + Q<sub>n</sub> = 1; J=K=1 → Q<sub>n</sub>'.</p>
<p class="nhan">📐 <strong>Bảng kích thích của J–K</strong> (bổ sung — không có trên slide, và là bảng ra thi nhiều nhất cả chương). Mỗi bước chuyển có <em>HAI</em> cách đạt được, và đó chính là nguồn gốc của mọi ô "d" ở slide 51:</p>
<table>
<tr><th>Q<sub>n</sub> → Q<sub>n+1</sub></th><th>J</th><th>K</th><th>Cặp đầu vào nào dùng được</th></tr>
<tr><td>0 → 0</td><td>0</td><td>d</td><td>giữ (00) hoặc xoá (01)</td></tr>
<tr><td>0 → 1</td><td>1</td><td>d</td><td>đặt (10) hoặc lật (11)</td></tr>
<tr><td>1 → 0</td><td>d</td><td>1</td><td>xoá (01) hoặc lật (11)</td></tr>
<tr><td>1 → 1</td><td>d</td><td>0</td><td>giữ (00) hoặc đặt (10)</td></tr>
</table>
<p class="nhan">📐 <strong>Chạy tay giản đồ thời gian, 8 nhịp, Q khởi đầu bằng 0</strong> — mô phỏng bằng mô hình J-K, kiểm từng bước:</p>
<table>
<tr><th>Sườn xung</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
<tr><td>J</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>K</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>Việc làm</td><td>đặt</td><td>giữ</td><td>đặt</td><td>lật</td><td>xoá</td><td>giữ</td><td>lật</td><td>xoá</td></tr>
<tr><td>Q sau sườn</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>Q = 1, 1, 1, 0, 0, 0, 1, 0</strong>. Đọc mấy sườn đáng chú ý: sườn 3 thì flip-flop vốn đã bằng 1 và lệnh "đặt" để yên nó ở đó; sườn 4 có J = K = 1 nên <em>LẬT</em> 1 → 0; sườn 7 có J = K = 1 nên lật 0 → 1. Để ý sườn 4 và sườn 7 có đầu vào GIỐNG HỆT nhau mà cho đầu ra NGƯỢC nhau — đó là minh hoạ rõ ràng nhất có thể cho việc đây là mạch tuần tự.</p>
<p class="meo">💡 Câu thần chú bốn ý cho J-K: <strong>00 giữ, 01 xoá, 10 đặt, 11 LẬT</strong>. Và lý do nó hơn S-R gói trong một câu: <em>cái hàng bị cấm đã trở thành cái hàng hữu dụng nhất.</em></p>
<p class="pitfall">⚠️ Bẫy: một J-K thuần theo MỨC với J = K = 1 sẽ dao động suốt thời gian xung còn cao (lỗi <em>race-around</em>), vì đầu ra vừa lật lại vòng thẳng về và lật tiếp. Flip-flop J-K thật bắt buộc phải theo sườn hoặc master–slave. Hình vẽ trình bày NGUYÊN LÝ, không phải một bản hiện thực an toàn.</p>`],

      [47, 'Figure 12.29 — Basic Flip-Flops (symbols and truth tables for S-R, J-K and D)',
        `<p class="y-chinh">🎯 The reference card of the chapter: three rows — <strong>S-R</strong>, <strong>J-K</strong>, <strong>D</strong> — each with its graphical symbol and its truth table. Note the symbols: every clock pin is drawn with a small <strong>triangle</strong> (marked <code>Ck</code>), the standard notation for <em>edge-triggered</em>. Every box has Q on top and Q' at the bottom.</p>
<p class="nhan">📐 The three tables exactly as printed on the slide:</p>
<table>
<tr><th colspan="3">S-R</th><th colspan="3">J-K</th><th colspan="2">D</th></tr>
<tr><th>S</th><th>R</th><th>Q<sub>n+1</sub></th><th>J</th><th>K</th><th>Q<sub>n+1</sub></th><th>D</th><th>Q<sub>n+1</sub></th></tr>
<tr><td>0</td><td>0</td><td>Q<sub>n</sub></td><td>0</td><td>0</td><td>Q<sub>n</sub></td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>—</td><td>—</td></tr>
<tr><td>1</td><td>1</td><td><strong>–</strong></td><td>1</td><td>1</td><td><strong>Q<sub>n</sub>'</strong></td><td>—</td><td>—</td></tr>
</table>
<ul>
<li><strong>Read the three tables as one evolution.</strong> S-R and J-K are identical in their first three rows; they differ <em>only</em> in the last row — "–" versus "Q<sub>n</sub>'". D is the odd one out: it has no hold row at all, because with a single input there is no way to say "do nothing".</li>
<li><strong>Which to pick, in one line each.</strong> <strong>D</strong> when you want to <em>store a value</em> (registers, pipelines). <strong>J-K</strong> when you want to <em>toggle or hold conditionally</em> (counters — see slide 51). <strong>S-R</strong> is mostly historical and appears inside the other two.</li>
<li><strong>The T flip-flop, which this deck never draws.</strong> Tie J and K together and call the common input T. Then T = 0 means hold and T = 1 means toggle. It is the natural counter element and appears in most exam papers, so it is included below.</li>
</ul>
<p class="nhan">📐 <strong>All four characteristic tables in one place</strong> (SR, JK, D from the slide; T added) — every row machine-generated from the device definitions:</p>
<table>
<tr><th>Type</th><th>Inputs</th><th>Q<sub>n+1</sub> = ?</th><th>Characteristic equation</th><th>Illegal input</th></tr>
<tr><td>S-R</td><td>00 / 01 / 10 / 11</td><td>Q<sub>n</sub> / 0 / 1 / –</td><td>Q<sub>n+1</sub> = S + R'Q<sub>n</sub> (with S·R = 0)</td><td><strong>S = R = 1</strong></td></tr>
<tr><td>J-K</td><td>00 / 01 / 10 / 11</td><td>Q<sub>n</sub> / 0 / 1 / Q<sub>n</sub>'</td><td>Q<sub>n+1</sub> = JQ<sub>n</sub>' + K'Q<sub>n</sub></td><td>none</td></tr>
<tr><td>D</td><td>0 / 1</td><td>0 / 1</td><td>Q<sub>n+1</sub> = D</td><td>none</td></tr>
<tr><td>T</td><td>0 / 1</td><td>Q<sub>n</sub> / Q<sub>n</sub>'</td><td>Q<sub>n+1</sub> = T ⊕ Q<sub>n</sub></td><td>none</td></tr>
</table>
<p class="nhan">📐 <strong>All four excitation tables in one place</strong> — the design direction. Memorise this block and half the exam is done:</p>
<table>
<tr><th>Q<sub>n</sub> → Q<sub>n+1</sub></th><th>S</th><th>R</th><th>J</th><th>K</th><th>D</th><th>T</th></tr>
<tr><td>0 → 0</td><td>0</td><td>d</td><td>0</td><td>d</td><td>0</td><td>0</td></tr>
<tr><td>0 → 1</td><td>1</td><td>0</td><td>1</td><td>d</td><td>1</td><td>1</td></tr>
<tr><td>1 → 0</td><td>0</td><td>1</td><td>d</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1 → 1</td><td>d</td><td>0</td><td>d</td><td>0</td><td>1</td><td>0</td></tr>
</table>
<p class="dap-an">✅ Every cell above was produced by enumerating all input combinations for each device and collecting those that give the wanted transition — 0 hand-copied entries. Count the don't-cares: J-K has <strong>four</strong>, S-R has <strong>two</strong>, D and T have <strong>none</strong>. More don't-cares means more freedom on the Karnaugh map, which means smaller next-state logic — and that is exactly why the counter on slide 51 is designed with J-K flip-flops.</p>
<p class="meo">💡 Learn the J-K excitation row pattern as a shape: <strong>the J column reads 0, 1, d, d and the K column reads d, d, 1, 0.</strong> Symmetric, and only four symbols to remember.</p>
<p class="pitfall">⚠️ The classic mix-up: using the <em>characteristic</em> table when the question asks you to <em>design</em>. If the question gives you a state sequence (a counter, a sequence detector), you need the <em>excitation</em> table. If it gives you the inputs and asks what happens, you need the characteristic table. Reading the question wrongly costs the whole answer, not a mark.</p>`,
        `<p class="y-chinh">🎯 Tấm thẻ tra cứu của cả chương: ba hàng — <strong>S-R</strong>, <strong>J-K</strong>, <strong>D</strong> — mỗi hàng có ký hiệu vẽ và bảng chân trị của nó. Để ý ký hiệu: mọi chân xung nhịp đều được vẽ kèm một <strong>TAM GIÁC</strong> nhỏ (ghi <code>Ck</code>), đó là ký pháp chuẩn cho loại <em>kích theo SƯỜN</em>. Mọi hộp đều có Q ở trên và Q' ở dưới.</p>
<p class="nhan">📐 Ba bảng đúng như in trên slide:</p>
<table>
<tr><th colspan="3">S-R</th><th colspan="3">J-K</th><th colspan="2">D</th></tr>
<tr><th>S</th><th>R</th><th>Q<sub>n+1</sub></th><th>J</th><th>K</th><th>Q<sub>n+1</sub></th><th>D</th><th>Q<sub>n+1</sub></th></tr>
<tr><td>0</td><td>0</td><td>Q<sub>n</sub></td><td>0</td><td>0</td><td>Q<sub>n</sub></td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>—</td><td>—</td></tr>
<tr><td>1</td><td>1</td><td><strong>–</strong></td><td>1</td><td>1</td><td><strong>Q<sub>n</sub>'</strong></td><td>—</td><td>—</td></tr>
</table>
<ul>
<li><strong>Đọc ba bảng như MỘT quá trình tiến hoá.</strong> S-R và J-K giống hệt nhau ở ba hàng đầu; chúng chỉ khác <em>ĐÚNG HÀNG CUỐI</em> — "–" so với "Q<sub>n</sub>'". D là đứa lạc loài: nó không có hàng "giữ" nào cả, vì với một đầu vào duy nhất thì không có cách nào nói "đừng làm gì".</li>
<li><strong>Chọn loại nào, mỗi loại một dòng.</strong> <strong>D</strong> khi bạn muốn <em>LƯU một giá trị</em> (thanh ghi, đường ống). <strong>J-K</strong> khi bạn muốn <em>LẬT hoặc GIỮ có điều kiện</em> (bộ đếm — xem slide 51). <strong>S-R</strong> chủ yếu mang tính lịch sử và nằm bên trong hai loại kia.</li>
<li><strong>Flip-flop T, thứ mà deck này không hề vẽ.</strong> Nối chung J với K rồi gọi đầu vào chung đó là T. Khi ấy T = 0 nghĩa là giữ, T = 1 nghĩa là lật. Nó là phần tử đếm tự nhiên nhất và xuất hiện trong hầu hết đề thi, nên được bổ sung ở dưới.</li>
</ul>
<p class="nhan">📐 <strong>Cả bốn bảng ĐẶC TÍNH gom một chỗ</strong> (SR, JK, D lấy từ slide; T là bổ sung) — mọi hàng đều sinh bằng máy từ định nghĩa của từng loại:</p>
<table>
<tr><th>Loại</th><th>Đầu vào</th><th>Q<sub>n+1</sub> = ?</th><th>Phương trình đặc tính</th><th>Đầu vào cấm</th></tr>
<tr><td>S-R</td><td>00 / 01 / 10 / 11</td><td>Q<sub>n</sub> / 0 / 1 / –</td><td>Q<sub>n+1</sub> = S + R'Q<sub>n</sub> (với ràng buộc S·R = 0)</td><td><strong>S = R = 1</strong></td></tr>
<tr><td>J-K</td><td>00 / 01 / 10 / 11</td><td>Q<sub>n</sub> / 0 / 1 / Q<sub>n</sub>'</td><td>Q<sub>n+1</sub> = JQ<sub>n</sub>' + K'Q<sub>n</sub></td><td>không có</td></tr>
<tr><td>D</td><td>0 / 1</td><td>0 / 1</td><td>Q<sub>n+1</sub> = D</td><td>không có</td></tr>
<tr><td>T</td><td>0 / 1</td><td>Q<sub>n</sub> / Q<sub>n</sub>'</td><td>Q<sub>n+1</sub> = T ⊕ Q<sub>n</sub></td><td>không có</td></tr>
</table>
<p class="nhan">📐 <strong>Cả bốn bảng KÍCH THÍCH gom một chỗ</strong> — chiều THIẾT KẾ. Thuộc khối này là xong nửa bài thi:</p>
<table>
<tr><th>Q<sub>n</sub> → Q<sub>n+1</sub></th><th>S</th><th>R</th><th>J</th><th>K</th><th>D</th><th>T</th></tr>
<tr><td>0 → 0</td><td>0</td><td>d</td><td>0</td><td>d</td><td>0</td><td>0</td></tr>
<tr><td>0 → 1</td><td>1</td><td>0</td><td>1</td><td>d</td><td>1</td><td>1</td></tr>
<tr><td>1 → 0</td><td>0</td><td>1</td><td>d</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1 → 1</td><td>d</td><td>0</td><td>d</td><td>0</td><td>1</td><td>0</td></tr>
</table>
<p class="dap-an">✅ Mọi ô ở trên đều được sinh ra bằng cách liệt kê hết tổ hợp đầu vào của từng loại rồi gom những tổ hợp cho ra bước chuyển mong muốn — 0 ô chép tay. Đếm số ô tuỳ ý: J-K có <strong>BỐN</strong>, S-R có <strong>HAI</strong>, D và T <strong>không có ô nào</strong>. Càng nhiều ô tuỳ ý thì càng tự do trên bìa Karnaugh, tức logic sinh trạng thái kế càng nhỏ — và đó đúng là lý do bộ đếm ở slide 51 được thiết kế bằng flip-flop J-K.</p>
<p class="meo">💡 Học mẫu hàng kích thích của J-K như một HÌNH DẠNG: <strong>cột J đọc là 0, 1, d, d còn cột K đọc là d, d, 1, 0.</strong> Đối xứng, và chỉ có bốn ký hiệu phải nhớ.</p>
<p class="pitfall">⚠️ Nhầm lẫn kinh điển: dùng bảng <em>ĐẶC TÍNH</em> khi đề yêu cầu <em>THIẾT KẾ</em>. Đề cho một dãy trạng thái (bộ đếm, bộ nhận dạng dãy) thì bạn cần bảng <em>KÍCH THÍCH</em>. Đề cho đầu vào rồi hỏi chuyện gì xảy ra thì bạn cần bảng ĐẶC TÍNH. Đọc nhầm đề thì mất cả bài chứ không phải mất một ý.</p>`],

      [48, 'Figure 12.30 — 8-Bit Parallel Register',
        `<p class="y-chinh">🎯 Eight D flip-flops side by side, all sharing one clock. The eight <strong>Data lines</strong> on top are D1<sub>8</sub>…D1<sub>1</sub> (data <em>in</em>); the eight <strong>Output lines</strong> below are D0<sub>8</sub>…D0<sub>1</sub> (data <em>out</em>). At the left, <strong>Clock</strong> and <strong>Load</strong> go into an AND gate whose output is the common clock rail. That is a complete 8-bit register.</p>
<ul>
<li><strong>"Parallel" means all 8 bits move at once.</strong> One clock edge with Load = 1 and the whole byte is captured simultaneously. Compare with slide 49, where bits arrive one per clock.</li>
<li><strong>The Load line is the entire control logic.</strong> Clock AND Load: when Load = 0 no edge reaches the flip-flops and the register <em>holds</em> its value however many clocks go by; when Load = 1 the next edge overwrites it. "Hold or load" is the only decision a register makes, and it costs exactly one AND gate.</li>
<li><strong>These are the registers of Chapter 3.</strong> Every CPU register you have met is this figure at a different width:</li>
</ul>
<table>
<tr><th>CPU register (Ch.3)</th><th>What it holds</th><th>Who sets Load = 1</th></tr>
<tr><td><strong>PC</strong> — program counter</td><td>Address of the next instruction</td><td>Control unit, every fetch (and on a branch)</td></tr>
<tr><td><strong>IR</strong> — instruction register</td><td>The instruction just fetched</td><td>Control unit at the end of the fetch cycle</td></tr>
<tr><td><strong>MAR</strong> — memory address register</td><td>Address being put on the address bus</td><td>Control unit before any memory access</td></tr>
<tr><td><strong>MBR</strong> — memory buffer register</td><td>Word read from / to be written to memory</td><td>Control unit, or the memory on a read completion</td></tr>
<tr><td>General-purpose registers</td><td>Operands and results</td><td>The decoded destination field of the instruction</td></tr>
</table>
<p class="dap-an">✅ Worked trace. Register currently holds 0000 0000. Put 1011 0110 on the data lines. With <strong>Load = 0</strong>, ten clock edges go by and the output stays 0000 0000. Set <strong>Load = 1</strong> for one edge → the output becomes <strong>1011 0110</strong>. Drop Load back to 0, change the data lines to anything you like → the output stays 1011 0110. That last sentence is the definition of a register.</p>
<ul>
<li><strong>Why D and not J-K.</strong> Storing a value is exactly what D does with one input and no decoding. Using J-K here would need two control wires per bit and an inverter — 24 wires instead of 8 for no benefit.</li>
<li><strong>Cost, and why it matters for Ch.4/Ch.5.</strong> Roughly 5–6 gates per flip-flop × 8 = tens of gates for one byte. A 32 kB L1 cache would be millions of gates if built this way — which is why caches use dense 6-transistor SRAM cells instead of flip-flops. Registers are the fastest and by far the most expensive level of the memory hierarchy, and this figure is why.</li>
</ul>
<p class="meo">💡 Read the labels carefully: <strong>D1 = data <em>in</em>, D0 = data <em>out</em></strong>, with the subscript being the bit number. It is not "D eighteen"; it is "D-one, bit eight".</p>
<p class="pitfall">⚠️ Trap: gating the clock with Load, as this figure does, is called <em>clock gating</em> and is fine in a textbook but risky in real silicon — a glitch on Load becomes a spurious clock edge. Modern designs keep the clock free-running and put the Load multiplexer in front of D instead. Know the textbook answer, but know why it is not what a synthesis tool would produce.</p>`,
        `<p class="y-chinh">🎯 Tám flip-flop D đặt cạnh nhau, dùng chung một xung nhịp. Tám <strong>Data lines</strong> phía trên là D1<sub>8</sub>…D1<sub>1</sub> (dữ liệu <em>VÀO</em>); tám <strong>Output lines</strong> phía dưới là D0<sub>8</sub>…D0<sub>1</sub> (dữ liệu <em>RA</em>). Bên trái, <strong>Clock</strong> và <strong>Load</strong> đi vào một cổng AND mà đầu ra của nó là đường xung nhịp dùng chung. Thế là xong một thanh ghi 8 bit hoàn chỉnh.</p>
<ul>
<li><strong>"Song song" nghĩa là cả 8 bit đi cùng lúc.</strong> Một sườn xung với Load = 1 là cả byte được chộp đồng thời. So với slide 49, nơi từng bit về một nhịp một cái.</li>
<li><strong>Đường Load CHÍNH LÀ toàn bộ phần logic điều khiển.</strong> Clock AND Load: khi Load = 0 thì không sườn nào tới được flip-flop và thanh ghi <em>GIỮ</em> giá trị dù bao nhiêu nhịp trôi qua; khi Load = 1 thì sườn kế ghi đè lên. "Giữ hay nạp" là quyết định duy nhất một thanh ghi phải làm, và nó tốn đúng một cổng AND.</li>
<li><strong>Đây chính là các thanh ghi của Chương 3.</strong> Mọi thanh ghi CPU bạn từng gặp đều là hình này ở một độ rộng khác:</li>
</ul>
<table>
<tr><th>Thanh ghi CPU (Ch.3)</th><th>Giữ gì</th><th>Ai đặt Load = 1</th></tr>
<tr><td><strong>PC</strong> — bộ đếm chương trình</td><td>Địa chỉ lệnh kế tiếp</td><td>Khối điều khiển, mỗi lần nạp lệnh (và khi rẽ nhánh)</td></tr>
<tr><td><strong>IR</strong> — thanh ghi lệnh</td><td>Lệnh vừa nạp về</td><td>Khối điều khiển, cuối chu kỳ nạp lệnh</td></tr>
<tr><td><strong>MAR</strong> — thanh ghi địa chỉ bộ nhớ</td><td>Địa chỉ đang đặt lên bus địa chỉ</td><td>Khối điều khiển, trước mọi lần truy cập bộ nhớ</td></tr>
<tr><td><strong>MBR</strong> — thanh ghi đệm bộ nhớ</td><td>Từ vừa đọc về / sắp ghi xuống bộ nhớ</td><td>Khối điều khiển, hoặc bộ nhớ khi đọc xong</td></tr>
<tr><td>Thanh ghi đa dụng</td><td>Toán hạng và kết quả</td><td>Trường đích đã giải mã của lệnh</td></tr>
</table>
<p class="dap-an">✅ Dò mẫu. Thanh ghi hiện giữ 0000 0000. Đặt 1011 0110 lên các đường dữ liệu. Với <strong>Load = 0</strong>, mười sườn xung trôi qua và đầu ra vẫn 0000 0000. Đặt <strong>Load = 1</strong> cho đúng một sườn → đầu ra thành <strong>1011 0110</strong>. Hạ Load về 0, đổi các đường dữ liệu thành gì tuỳ thích → đầu ra vẫn nằm im 1011 0110. Câu cuối đó chính là ĐỊNH NGHĨA của thanh ghi.</p>
<ul>
<li><strong>Vì sao dùng D chứ không dùng J-K.</strong> Lưu một giá trị đúng là việc D làm được với một đầu vào và không cần giải mã gì. Dùng J-K ở đây thì mỗi bit cần hai dây điều khiển cộng một cổng NOT — 24 dây thay vì 8 mà chẳng lợi gì.</li>
<li><strong>Chi phí, và vì sao nó liên quan Ch.4/Ch.5.</strong> Cỡ 5–6 cổng mỗi flip-flop × 8 = vài chục cổng cho MỘT byte. Cache L1 32 kB dựng kiểu này sẽ tốn hàng triệu cổng — vì thế cache dùng ô SRAM 6 transistor đặc hơn nhiều chứ không dùng flip-flop. Thanh ghi là mức NHANH NHẤT và ĐẮT NHẤT của phân cấp bộ nhớ, và hình này giải thích tại sao.</li>
</ul>
<p class="meo">💡 Đọc kỹ nhãn: <strong>D1 = dữ liệu <em>VÀO</em>, D0 = dữ liệu <em>RA</em></strong>, còn chỉ số dưới là số thứ tự bit. Nó không phải "D mười tám"; nó là "D-một, bit tám".</p>
<p class="pitfall">⚠️ Bẫy: chặn xung nhịp bằng Load như hình này gọi là <em>clock gating</em>, viết trong sách giáo khoa thì ổn nhưng trên silicon thật thì rủi ro — một nhiễu gai trên Load biến thành một sườn xung giả. Thiết kế hiện đại để xung nhịp chạy tự do và đặt multiplexer chọn Load ở TRƯỚC chân D. Biết đáp án sách giáo khoa, nhưng cũng biết vì sao công cụ tổng hợp không sinh ra như thế.</p>`],

      [49, 'Figure 12.31 — 5-Bit Shift Register',
        `<p class="y-chinh">🎯 The same D flip-flops, rewired: instead of eight of them looking at eight separate data lines, five of them are connected <strong>in a chain</strong> — Q of stage k drives D of stage k+1. One <strong>Serial In</strong> on the left, one <strong>Serial Out</strong> on the right, one shared Clock. Every clock edge, the whole content moves one place to the right.</p>
<ul>
<li><strong>Why it works at all — and why it needs edge triggering.</strong> On the edge, every stage simultaneously captures whatever its neighbour held <em>before</em> the edge. If these were transparent latches, a bit would race through several stages in one clock pulse and the register would be useless. This is the most practical demonstration of the latch-versus-flip-flop distinction on slide 44.</li>
<li><strong>Hand-run of a 4-bit shift register over 6 clocks</strong> (Q<sub>1</sub> is the stage nearest Serial In). Serial input sequence: 1, 0, 1, 1, 0, 0. Every row simulated:</li>
</ul>
<table>
<tr><th>Clock</th><th>Serial In</th><th>Q<sub>1</sub></th><th>Q<sub>2</sub></th><th>Q<sub>3</sub></th><th>Q<sub>4</sub></th><th>Serial Out</th></tr>
<tr><td>0 (start)</td><td>—</td><td>0</td><td>0</td><td>0</td><td>0</td><td>—</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>2</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>3</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>4</td><td>1</td><td>1</td><td>1</td><td>0</td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
<tr><td>5</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>6</td><td>0</td><td>0</td><td>0</td><td>1</td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
</table>
<p class="dap-an">✅ Read the two facts this table proves. <strong>(1) Latency:</strong> the first bit entered at clock 1 appears at Serial Out at clock 4 — an n-bit shift register delays serial data by exactly <strong>n clocks</strong>. <strong>(2) Serial-to-parallel conversion:</strong> after 4 clocks the register holds 1101 on Q<sub>1</sub>…Q<sub>4</sub>, which is the first four input bits (1, 0, 1, 1) re-ordered by position — read them out in parallel and you have converted a bit stream into a word. Output sequence at Serial Out over the six clocks: <strong>0, 0, 0, 1, 0, 1</strong>.</p>
<ul>
<li><strong>Four modes of a register, and this figure gives two of them.</strong> Serial-in/serial-out (a delay line), serial-in/parallel-out (a UART receiver, deserialiser), parallel-in/serial-out (a transmitter), parallel-in/parallel-out (slide 48's register). The same flip-flops, different wiring.</li>
<li><strong>Shifting is arithmetic.</strong> Shift left by 1 = multiply by 2; shift right by 1 = divide by 2 (for unsigned). This is exactly how Chapter 11 implements multiplication with shift-and-add, and it is why every instruction set has SHL/SHR instructions.</li>
<li><strong>Where a CPU uses it.</strong> The barrel shifter in the ALU, serial links (USB, SATA, Ethernet all serialise), and every JTAG/scan test chain on a real chip.</li>
</ul>
<p class="meo">💡 Picture a <strong>bucket brigade</strong>: on each clock every person hands their bucket to the next and takes one from behind. Nobody keeps a bucket; the line just advances one step.</p>
<p class="pitfall">⚠️ Trap: forgetting that <em>all</em> stages move on the same edge. Students often "walk" the bit through several stages in one clock. One clock = one position, always. And watch the direction — this figure shifts from Serial In towards Serial Out (left to right as drawn); a "shift right" in an arithmetic question may mean the opposite direction on the page.</p>`,
        `<p class="y-chinh">🎯 Vẫn những flip-flop D đó, đấu lại dây: thay vì tám cái nhìn vào tám đường dữ liệu riêng, năm cái được nối <strong>THÀNH CHUỖI</strong> — Q của tầng k lái D của tầng k+1. Một <strong>Serial In</strong> bên trái, một <strong>Serial Out</strong> bên phải, một Clock dùng chung. Mỗi sườn xung, toàn bộ nội dung dịch sang phải một vị trí.</p>
<ul>
<li><strong>Vì sao nó chạy được — và vì sao nó BẮT BUỘC phải kích theo sườn.</strong> Tại sườn xung, mọi tầng ĐỒNG THỜI chộp lấy giá trị mà hàng xóm đang giữ <em>TRƯỚC</em> sườn. Nếu đây là chốt trong suốt thì một bit sẽ phóng thẳng qua vài tầng trong một xung và thanh ghi trở nên vô dụng. Đây là minh hoạ thực dụng nhất cho khác biệt chốt-với-flip-flop ở slide 44.</li>
<li><strong>Chạy tay một thanh ghi dịch 4 bit qua 6 nhịp</strong> (Q<sub>1</sub> là tầng gần Serial In nhất). Chuỗi vào nối tiếp: 1, 0, 1, 1, 0, 0. Mọi hàng đều mô phỏng bằng máy:</li>
</ul>
<table>
<tr><th>Nhịp</th><th>Serial In</th><th>Q<sub>1</sub></th><th>Q<sub>2</sub></th><th>Q<sub>3</sub></th><th>Q<sub>4</sub></th><th>Serial Out</th></tr>
<tr><td>0 (đầu)</td><td>—</td><td>0</td><td>0</td><td>0</td><td>0</td><td>—</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>2</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>3</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>4</td><td>1</td><td>1</td><td>1</td><td>0</td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
<tr><td>5</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>6</td><td>0</td><td>0</td><td>0</td><td>1</td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
</table>
<p class="dap-an">✅ Đọc hai sự thật mà bảng này chứng minh. <strong>(1) Độ trễ:</strong> bit đầu tiên vào ở nhịp 1 hiện ra ở Serial Out tại nhịp 4 — thanh ghi dịch n bit làm trễ dữ liệu nối tiếp đúng <strong>n nhịp</strong>. <strong>(2) Chuyển nối tiếp sang song song:</strong> sau 4 nhịp thanh ghi giữ 1101 trên Q<sub>1</sub>…Q<sub>4</sub>, chính là bốn bit vào đầu tiên (1, 0, 1, 1) sắp lại theo vị trí — đọc chúng ra song song là bạn đã biến một dòng bit thành một từ. Chuỗi ra ở Serial Out qua sáu nhịp: <strong>0, 0, 0, 1, 0, 1</strong>.</p>
<ul>
<li><strong>Thanh ghi có bốn kiểu, và hình này cho hai kiểu.</strong> Nối tiếp-vào/nối tiếp-ra (đường trễ), nối tiếp-vào/song song-ra (bộ thu UART, bộ giải tuần tự), song song-vào/nối tiếp-ra (bộ phát), song song-vào/song song-ra (thanh ghi của slide 48). Cùng những flip-flop ấy, khác cách đấu dây.</li>
<li><strong>Dịch chính là SỐ HỌC.</strong> Dịch trái 1 = nhân 2; dịch phải 1 = chia 2 (với số không dấu). Đây đúng là cách Chương 11 hiện thực phép nhân bằng dịch-và-cộng, và là lý do mọi tập lệnh đều có lệnh SHL/SHR.</li>
<li><strong>CPU dùng nó ở đâu.</strong> Bộ dịch thùng (barrel shifter) trong ALU, các đường truyền nối tiếp (USB, SATA, Ethernet đều tuần tự hoá), và mọi chuỗi kiểm thử JTAG/scan trên chip thật.</li>
</ul>
<p class="meo">💡 Hình dung một <strong>dây chuyền chuyền xô nước</strong>: mỗi nhịp, ai cũng đưa xô của mình cho người kế và nhận một xô từ người phía sau. Không ai giữ xô lại; cả hàng chỉ nhích đúng một bước.</p>
<p class="pitfall">⚠️ Bẫy: quên rằng TẤT CẢ các tầng cùng động trên một sườn. Sinh viên hay "dắt" một bit đi qua vài tầng trong một nhịp. Một nhịp = một vị trí, luôn luôn. Và để ý chiều — hình này dịch từ Serial In sang Serial Out (trái sang phải theo cách vẽ); chữ "dịch phải" trong một câu hỏi số học có thể lại là chiều ngược trên giấy.</p>`],

      [50, 'Counter — asynchronous (ripple) versus synchronous',
        `<p class="y-chinh">🎯 The slide's definition: a counter is "<strong>a register whose value is easily incremented by 1 modulo the capacity of the register</strong>" — and "after the maximum value is achieved the next increment sets the counter value to 0". Its CPU example is given explicitly: <strong>the program counter</strong>. Then it splits counters into two families and says outright which one CPUs use.</p>
<ul>
<li><strong>"Modulo the capacity" is the wrap-around clause.</strong> A 3-bit counter runs 000 → 001 → … → 111 → 000. There is no overflow error, no exception — it simply wraps. That is why the counter on slide 51 returns to 000 after 111, and why an 8-bit PC would jump back to address 0 after 255.</li>
<li><strong>Asynchronous (ripple), in the slide's words:</strong> "relatively slow because <strong>the output of one flip-flop triggers a change in the status of the next flip-flop</strong>". Each stage's clock comes from the previous stage's output, so the change ripples along the chain.</li>
<li><strong>Synchronous, in the slide's words:</strong> "<strong>all of the flip-flops change state at the same time</strong>… because it is faster it is the kind used in CPUs". One clock rail reaches every flip-flop; combinational logic decides which ones should toggle.</li>
<li><strong>Put numbers on "relatively slow".</strong> Take t<sub>d</sub> = 10 ns per flip-flop. All values computed, not estimated:</li>
</ul>
<table>
<tr><th>Counter width n</th><th>Ripple worst-case delay = n × t<sub>d</sub></th><th>Max clock frequency</th><th>Synchronous delay</th><th>Synchronous max clock</th></tr>
<tr><td>3 bits</td><td>30 ns</td><td>33,3 MHz</td><td>10 ns</td><td>100 MHz</td></tr>
<tr><td>4 bits</td><td>40 ns</td><td>25 MHz</td><td>10 ns</td><td>100 MHz</td></tr>
<tr><td>8 bits</td><td>80 ns</td><td>12,5 MHz</td><td>10 ns</td><td>100 MHz</td></tr>
<tr><td>16 bits</td><td>160 ns</td><td>6,25 MHz</td><td>10 ns</td><td>100 MHz</td></tr>
<tr><td>32 bits</td><td>320 ns</td><td>3,12 MHz</td><td>10 ns</td><td>100 MHz</td></tr>
</table>
<p class="dap-an">✅ The ripple counter's maximum frequency is <strong>inversely proportional to its width</strong>: a 32-bit ripple program counter would cap the CPU at about <strong>3 MHz</strong>, while the synchronous version stays at 100 MHz regardless of width — <strong>32× faster</strong> at 32 bits. That single ratio is the whole reason the slide says synchronous "is the kind used in CPUs".</p>
<ul>
<li><strong>The hidden second cost of ripple: transient wrong values.</strong> Going 0111 → 1000, the stages settle one after another, so for a few nanoseconds the output passes through 0110, 0100, 0000 before reaching 1000. Anything that samples the counter during that window reads garbage. A synchronous counter never shows an intermediate value.</li>
<li><strong>What ripple is still good for.</strong> It needs almost no logic — just n flip-flops with T = 1 — so it is the cheapest possible frequency divider. Each stage halves the frequency; stage k outputs f/2<sup>k</sup>.</li>
<li><strong>Connect to Chapter 3.</strong> The PC is incremented once per instruction fetch. If incrementing it took 320 ns, that would be the machine's floor speed. Chapter 16 also uses counters for pipeline stage control, and Chapter 19 for the microprogram address.</li>
</ul>
<p class="pitfall">⚠️ <strong>Gap in this deck, flagged honestly.</strong> Figure 12.32 in the textbook is the <em>ripple counter</em> diagram — and it is <strong>missing from these slides</strong>: slide 49 (Figure 12.31) jumps straight to slide 51 (Figure 12.33). The asynchronous case exists here only as the words above. The table and reasoning in this lesson come from the book, not from a slide, and they are marked as such.</p>
<p class="meo">💡 One sentence: <strong>ripple = dominoes (each knocks the next over); synchronous = a marching band (everyone steps on the same beat).</strong></p>`,
        `<p class="y-chinh">🎯 Định nghĩa của slide: bộ đếm là "<strong>một thanh ghi mà giá trị của nó dễ dàng được tăng thêm 1 theo modulo sức chứa của thanh ghi</strong>" — và "sau khi đạt giá trị lớn nhất thì lần tăng kế tiếp đưa bộ đếm về 0". Ví dụ trong CPU được nêu thẳng: <strong>bộ đếm chương trình (program counter)</strong>. Rồi slide chia bộ đếm thành hai họ và nói thẳng CPU dùng họ nào.</p>
<ul>
<li><strong>"Theo modulo sức chứa" là mệnh đề QUAY VÒNG.</strong> Bộ đếm 3 bit chạy 000 → 001 → … → 111 → 000. Không có lỗi tràn, không có ngoại lệ — nó chỉ đơn giản quay vòng. Đó là lý do bộ đếm ở slide 51 quay về 000 sau 111, và lý do một PC 8 bit sẽ nhảy về địa chỉ 0 sau 255.</li>
<li><strong>Không đồng bộ (ripple), nguyên văn slide:</strong> "tương đối CHẬM vì <strong>đầu ra của flip-flop này kích cho flip-flop kế đổi trạng thái</strong>". Xung nhịp của mỗi tầng lấy từ đầu ra của tầng trước, nên sự thay đổi gợn dần dọc chuỗi.</li>
<li><strong>Đồng bộ, nguyên văn slide:</strong> "<strong>TẤT CẢ flip-flop đổi trạng thái cùng một lúc</strong>… vì nhanh hơn nên đây là loại được dùng trong CPU". Một đường xung nhịp tới mọi flip-flop; logic tổ hợp quyết định cái nào phải lật.</li>
<li><strong>Gắn con số vào chữ "tương đối chậm".</strong> Lấy t<sub>d</sub> = 10 ns mỗi flip-flop. Mọi giá trị đều TÍNH, không ước lượng:</li>
</ul>
<table>
<tr><th>Độ rộng n</th><th>Trễ xấu nhất của ripple = n × t<sub>d</sub></th><th>Tần số tối đa</th><th>Trễ của đồng bộ</th><th>Tần số tối đa đồng bộ</th></tr>
<tr><td>3 bit</td><td>30 ns</td><td>33,3 MHz</td><td>10 ns</td><td>100 MHz</td></tr>
<tr><td>4 bit</td><td>40 ns</td><td>25 MHz</td><td>10 ns</td><td>100 MHz</td></tr>
<tr><td>8 bit</td><td>80 ns</td><td>12,5 MHz</td><td>10 ns</td><td>100 MHz</td></tr>
<tr><td>16 bit</td><td>160 ns</td><td>6,25 MHz</td><td>10 ns</td><td>100 MHz</td></tr>
<tr><td>32 bit</td><td>320 ns</td><td>3,12 MHz</td><td>10 ns</td><td>100 MHz</td></tr>
</table>
<p class="dap-an">✅ Tần số tối đa của bộ đếm ripple <strong>TỈ LỆ NGHỊCH với độ rộng của nó</strong>: một bộ đếm chương trình ripple 32 bit sẽ chặn CPU ở khoảng <strong>3 MHz</strong>, trong khi bản đồng bộ vẫn giữ 100 MHz bất kể rộng bao nhiêu — <strong>nhanh gấp 32 lần</strong> ở mức 32 bit. Đúng một tỉ số đó là toàn bộ lý do slide nói loại đồng bộ "là loại được dùng trong CPU".</p>
<ul>
<li><strong>Cái giá thứ hai bị giấu của ripple: giá trị SAI thoáng qua.</strong> Đi từ 0111 → 1000, các tầng ổn định lần lượt, nên trong vài nano giây đầu ra đi ngang qua 0110, 0100, 0000 trước khi tới 1000. Thứ gì lấy mẫu bộ đếm trong cửa sổ ấy sẽ đọc phải rác. Bộ đếm đồng bộ KHÔNG BAO GIỜ lòi ra giá trị trung gian.</li>
<li><strong>Ripple vẫn tốt ở chỗ nào.</strong> Nó gần như không cần logic gì — chỉ n flip-flop với T = 1 — nên là bộ chia tần rẻ nhất có thể. Mỗi tầng chia đôi tần số; tầng k cho ra f/2<sup>k</sup>.</li>
<li><strong>Nối về Chương 3.</strong> PC được tăng một lần mỗi lần nạp lệnh. Nếu việc tăng đó tốn 320 ns thì đó chính là tốc độ SÀN của cả máy. Chương 16 cũng dùng bộ đếm để điều khiển tầng đường ống, còn Chương 19 dùng cho địa chỉ vi chương trình.</li>
</ul>
<p class="pitfall">⚠️ <strong>CHỖ THIẾU CỦA DECK NÀY, nói thẳng.</strong> Figure 12.32 trong sách là sơ đồ <em>bộ đếm ripple</em> — và nó <strong>KHÔNG CÓ trong bộ slide</strong>: slide 49 (Figure 12.31) nhảy thẳng sang slide 51 (Figure 12.33). Trường hợp không đồng bộ ở đây chỉ tồn tại dưới dạng mấy dòng chữ trên. Bảng và lập luận trong bài này lấy từ SÁCH chứ không từ slide, và đã ghi rõ như vậy.</p>
<p class="meo">💡 Một câu: <strong>ripple = quân cờ domino (cái này đổ mới đẩy cái kia); đồng bộ = đội duyệt binh (tất cả bước cùng một nhịp trống).</strong></p>`],

      [51, 'Figure 12.33 — Design of a Synchronous Counter ((a) truth table, (b) Karnaugh maps, (c) logic diagram)',
        `<p class="y-chinh">🎯 The full design procedure for a <strong>3-bit synchronous binary up-counter</strong>, on one slide, in three parts: (a) the truth table giving the J and K inputs each flip-flop needs, (b) six Karnaugh maps minimising them, (c) the finished circuit with three J-K flip-flops and one AND gate. This is the single most exam-heavy figure in the chapter — so here is every step, done from scratch and checked against the slide.</p>
<p class="nhan">📐 <strong>Step 1 — state table.</strong> The counter holds C B A (C is the most significant). It counts 000, 001, 010, … 111, then wraps to 000.</p>
<p class="nhan">📐 <strong>Step 2 — for each bit, read off the transition Q<sub>n</sub> → Q<sub>n+1</sub>, then look it up in the J-K excitation table from slide 47</strong> (0→0 gives J=0,K=d · 0→1 gives J=1,K=d · 1→0 gives J=d,K=1 · 1→1 gives J=d,K=0). The result — <strong>identical, cell for cell, to the table printed on the slide</strong>:</p>
<table>
<tr><th>C</th><th>B</th><th>A</th><th>C<sup>+</sup></th><th>B<sup>+</sup></th><th>A<sup>+</sup></th><th>Jc</th><th>Kc</th><th>Jb</th><th>Kb</th><th>Ja</th><th>Ka</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>d</td><td>0</td><td>d</td><td>1</td><td>d</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>d</td><td>1</td><td>d</td><td>d</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>d</td><td>d</td><td>0</td><td>1</td><td>d</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>d</td><td>d</td><td>1</td><td>d</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>d</td><td>0</td><td>0</td><td>d</td><td>1</td><td>d</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>d</td><td>0</td><td>1</td><td>d</td><td>d</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>d</td><td>0</td><td>d</td><td>0</td><td>1</td><td>d</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>d</td><td>1</td><td>d</td><td>1</td><td>d</td><td>1</td></tr>
</table>
<p class="nhan">📐 <strong>Step 3 — minimise each of the six columns on a Karnaugh map over (C, B, A).</strong> The don't-cares are what make the answer so small. The slide's six maps give:</p>
<table>
<tr><th>Input</th><th>Minimised expression</th><th>Plain-language reading</th></tr>
<tr><td>Ja</td><td><strong>1</strong></td><td>Bit A toggles on <em>every</em> clock</td></tr>
<tr><td>Ka</td><td><strong>1</strong></td><td>same — J = K = 1 means permanent toggle</td></tr>
<tr><td>Jb</td><td><strong>A</strong></td><td>Bit B toggles when A is 1 (i.e. when A is about to carry)</td></tr>
<tr><td>Kb</td><td><strong>A</strong></td><td>same</td></tr>
<tr><td>Jc</td><td><strong>BA</strong></td><td>Bit C toggles when both B and A are 1</td></tr>
<tr><td>Kc</td><td><strong>BA</strong></td><td>same</td></tr>
</table>
<p class="nhan">📐 <strong>Step 4 — the circuit (part c of the figure).</strong> Ja and Ka are tied to <code>High</code> (logic 1). Jb and Kb are wired straight to <code>A</code>. Jc and Kc come from one <strong>AND gate</strong> fed by A and B. All three flip-flops share the Clock line. Outputs C, B, A are the binary count.</p>
<p class="dap-an">✅ <strong>Three independent machine checks.</strong> (1) The eight rows of J/K values derived from scratch match the slide's table <strong>exactly — no cell differs</strong>. (2) The minimised equations Jc = Kc = BA, Jb = Kb = A, Ja = Ka = 1 are consistent with all eight rows including every don't-care. (3) Simulating the circuit for 10 clocks from state 000 gives <strong>001 → 010 → 011 → 100 → 101 → 110 → 111 → 000 → 001 → 010</strong> — it counts, and it wraps.</p>
<ul>
<li><strong>The pattern generalises, and this is the takeaway.</strong> In a binary up-counter, <strong>bit k toggles exactly when all lower bits are 1</strong>. So J<sub>k</sub> = K<sub>k</sub> = Q<sub>0</sub>·Q<sub>1</sub>·…·Q<sub>k−1</sub>. For a 4-bit counter add a fourth flip-flop with Jd = Kd = CBA. You never have to redo the Karnaugh maps.</li>
<li><strong>Why synchronous is fast here, concretely.</strong> The clock reaches all three flip-flops at once; the only extra delay is the one AND gate computing BA, and it had a whole clock period to settle. No rippling — compare the 3-bit numbers on slide 50: 30 ns ripple versus 10 ns synchronous.</li>
<li><strong>Design procedure in five lines</strong>, reusable for any counter or state machine: <em>(1)</em> write the state sequence, <em>(2)</em> tabulate present → next state, <em>(3)</em> use the excitation table of your chosen flip-flop to get the required inputs, <em>(4)</em> minimise each input column on a K-map, <em>(5)</em> draw it. Slide 51 is steps 2–5 for one specific sequence.</li>
<li><strong>Where you meet it.</strong> This is the program counter's increment mechanism (Ch.3), the cycle counter of the control unit (Ch.19), and the basis of any state machine in Ch.16.</li>
</ul>
<p class="meo">💡 Sanity check that takes five seconds: in <em>any</em> binary up-counter the least significant bit must toggle every clock, so its J and K are always 1. If your answer says otherwise, you made a sign error somewhere in the excitation table.</p>
<p class="pitfall">⚠️ Two traps. <strong>(1)</strong> Treating "d" as 0. A don't-care may be taken as 0 <em>or</em> 1, whichever makes the grouping bigger — that is the only reason Ja collapses to the constant 1 instead of some three-variable mess. <strong>(2)</strong> Confusing this with a ripple counter: here the AND gate feeds the J/K <em>data</em> inputs, it does <strong>not</strong> feed anyone's clock. In a ripple counter the previous stage drives the next stage's <em>clock</em>. Look at where the wire lands.</p>`,
        `<p class="y-chinh">🎯 Trọn quy trình thiết kế một <strong>bộ đếm nhị phân đồng bộ 3 bit đếm lên</strong>, gói trên một slide, gồm ba phần: (a) bảng chân trị cho biết mỗi flip-flop cần đầu vào J, K nào, (b) sáu bìa Karnaugh rút gọn chúng, (c) mạch hoàn chỉnh với ba flip-flop J-K và một cổng AND. Đây là hình RA THI NẶNG NHẤT của cả chương — nên dưới đây là từng bước một, làm lại từ đầu và đối chiếu với slide.</p>
<p class="nhan">📐 <strong>Bước 1 — bảng trạng thái.</strong> Bộ đếm giữ C B A (C là bit cao nhất). Nó đếm 000, 001, 010, … 111, rồi quay về 000.</p>
<p class="nhan">📐 <strong>Bước 2 — với từng bit, đọc bước chuyển Q<sub>n</sub> → Q<sub>n+1</sub>, rồi tra bảng kích thích J-K ở slide 47</strong> (0→0 cho J=0,K=d · 0→1 cho J=1,K=d · 1→0 cho J=d,K=1 · 1→1 cho J=d,K=0). Kết quả — <strong>TRÙNG KHÍT từng ô với bảng in trên slide</strong>:</p>
<table>
<tr><th>C</th><th>B</th><th>A</th><th>C<sup>+</sup></th><th>B<sup>+</sup></th><th>A<sup>+</sup></th><th>Jc</th><th>Kc</th><th>Jb</th><th>Kb</th><th>Ja</th><th>Ka</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>d</td><td>0</td><td>d</td><td>1</td><td>d</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>d</td><td>1</td><td>d</td><td>d</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>d</td><td>d</td><td>0</td><td>1</td><td>d</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>d</td><td>d</td><td>1</td><td>d</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>d</td><td>0</td><td>0</td><td>d</td><td>1</td><td>d</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>d</td><td>0</td><td>1</td><td>d</td><td>d</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>d</td><td>0</td><td>d</td><td>0</td><td>1</td><td>d</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>d</td><td>1</td><td>d</td><td>1</td><td>d</td><td>1</td></tr>
</table>
<p class="nhan">📐 <strong>Bước 3 — rút gọn từng cột trong sáu cột bằng bìa Karnaugh theo (C, B, A).</strong> Chính các ô "tuỳ ý" làm cho đáp án nhỏ đến thế. Sáu bìa của slide cho ra:</p>
<table>
<tr><th>Đầu vào</th><th>Biểu thức rút gọn</th><th>Đọc bằng lời</th></tr>
<tr><td>Ja</td><td><strong>1</strong></td><td>Bit A lật ở <em>MỌI</em> nhịp</td></tr>
<tr><td>Ka</td><td><strong>1</strong></td><td>như trên — J = K = 1 nghĩa là lật vĩnh viễn</td></tr>
<tr><td>Jb</td><td><strong>A</strong></td><td>Bit B lật khi A bằng 1 (tức khi A sắp sinh nhớ)</td></tr>
<tr><td>Kb</td><td><strong>A</strong></td><td>như trên</td></tr>
<tr><td>Jc</td><td><strong>BA</strong></td><td>Bit C lật khi cả B và A đều bằng 1</td></tr>
<tr><td>Kc</td><td><strong>BA</strong></td><td>như trên</td></tr>
</table>
<p class="nhan">📐 <strong>Bước 4 — mạch (phần c của hình).</strong> Ja và Ka nối vào <code>High</code> (mức logic 1). Jb và Kb nối thẳng vào <code>A</code>. Jc và Kc lấy từ một <strong>cổng AND</strong> nhận A và B. Cả ba flip-flop dùng chung đường Clock. Đầu ra C, B, A chính là giá trị đếm nhị phân.</p>
<p class="dap-an">✅ <strong>Ba phép kiểm độc lập bằng máy.</strong> (1) Tám hàng giá trị J/K suy ra từ đầu khớp bảng của slide <strong>CHÍNH XÁC — không ô nào lệch</strong>. (2) Bộ biểu thức rút gọn Jc = Kc = BA, Jb = Kb = A, Ja = Ka = 1 tương thích với cả tám hàng, kể cả mọi ô tuỳ ý. (3) Mô phỏng mạch 10 nhịp từ trạng thái 000 cho ra <strong>001 → 010 → 011 → 100 → 101 → 110 → 111 → 000 → 001 → 010</strong> — nó đếm, và nó quay vòng.</p>
<ul>
<li><strong>Quy luật tổng quát hoá được, và đây là thứ đáng mang về.</strong> Trong bộ đếm nhị phân đếm lên, <strong>bit thứ k lật đúng khi TẤT CẢ các bit thấp hơn đều bằng 1</strong>. Tức J<sub>k</sub> = K<sub>k</sub> = Q<sub>0</sub>·Q<sub>1</sub>·…·Q<sub>k−1</sub>. Muốn bộ đếm 4 bit thì thêm flip-flop thứ tư với Jd = Kd = CBA. Không cần vẽ lại bìa Karnaugh lần nào.</li>
<li><strong>Vì sao đồng bộ nhanh, nói cụ thể.</strong> Xung nhịp tới cả ba flip-flop cùng lúc; độ trễ phụ duy nhất là một cổng AND tính BA, mà nó có trọn một chu kỳ để ổn định. Không gợn sóng — so con số 3 bit ở slide 50: 30 ns cho ripple so với 10 ns cho đồng bộ.</li>
<li><strong>Quy trình thiết kế gói trong năm dòng</strong>, dùng lại được cho mọi bộ đếm hay máy trạng thái: <em>(1)</em> viết dãy trạng thái, <em>(2)</em> lập bảng hiện tại → kế tiếp, <em>(3)</em> dùng bảng kích thích của loại flip-flop đã chọn để lấy đầu vào cần có, <em>(4)</em> rút gọn từng cột đầu vào bằng K-map, <em>(5)</em> vẽ mạch. Slide 51 chính là bước 2–5 cho một dãy cụ thể.</li>
<li><strong>Gặp nó ở đâu.</strong> Đây là cơ chế tăng của bộ đếm chương trình (Ch.3), bộ đếm chu kỳ của khối điều khiển (Ch.19), và nền của mọi máy trạng thái trong Ch.16.</li>
</ul>
<p class="meo">💡 Phép kiểm nhanh tốn năm giây: trong <em>BẤT KỲ</em> bộ đếm nhị phân đếm lên nào, bit thấp nhất bắt buộc phải lật mỗi nhịp, nên J và K của nó luôn bằng 1. Đáp án của bạn nói khác nghĩa là bạn nhầm dấu đâu đó trong bảng kích thích.</p>
<p class="pitfall">⚠️ Hai bẫy. <strong>(1)</strong> Coi "d" là 0. Ô tuỳ ý được phép lấy là 0 <em>HOẶC</em> 1, cái nào làm nhóm to hơn thì lấy — đó là lý do DUY NHẤT khiến Ja co lại thành hằng số 1 chứ không thành một mớ ba biến. <strong>(2)</strong> Nhầm nó với bộ đếm ripple: ở đây cổng AND nuôi các chân <em>DỮ LIỆU</em> J/K, nó <strong>KHÔNG</strong> nuôi xung nhịp của ai cả. Trong bộ đếm ripple thì tầng trước lái <em>XUNG NHỊP</em> của tầng sau. Nhìn xem sợi dây đáp xuống đâu.</p>`],

      [52, 'Table 12.13 — PLD Terminology (PLD, PLA, PAL, SPLD, CPLD, FPGA, logic block)',
        `<p class="y-chinh">🎯 A glossary slide, and it is worth reading as a family tree rather than a list. The common idea: instead of fabricating a custom chip, buy a chip full of uncommitted logic and <strong>configure it yourself</strong>. The seven terms differ only in how much logic, and which parts are programmable.</p>
<table>
<tr><th>Term</th><th>The slide's definition, condensed</th><th>What is programmable</th></tr>
<tr><td><strong>PLD</strong> — Programmable Logic Device</td><td>"any type of integrated circuit used for implementing digital hardware, where the chip can be configured by the end user to realize different designs"; also called a <strong>field-programmable device (FPD)</strong></td><td>the umbrella term</td></tr>
<tr><td><strong>PLA</strong> — Programmable Logic Array</td><td>"a relatively small PLD that contains two levels of logic, an <strong>AND-plane</strong> and an <strong>OR-plane</strong>, where <strong>both</strong> levels are programmable"</td><td>AND plane <em>and</em> OR plane</td></tr>
<tr><td><strong>PAL</strong> — Programmable Array Logic</td><td>"a relatively small PLD that has a <strong>programmable AND-plane followed by a fixed OR-plane</strong>"</td><td>AND plane only</td></tr>
<tr><td><strong>SPLD</strong> — Simple PLD</td><td>"a PLA or PAL"</td><td>—</td></tr>
<tr><td><strong>CPLD</strong> — Complex PLD</td><td>"consists of an arrangement of <strong>multiple SPLD-like blocks</strong> on a single chip"</td><td>many SPLD blocks + their interconnect</td></tr>
<tr><td><strong>FPGA</strong> — Field-Programmable Gate Array</td><td>"a PLD featuring a general structure that allows <strong>very high logic capacity</strong>. Whereas CPLDs feature logic resources with a wide number of inputs (AND planes), FPGAs offer <strong>more narrow</strong> logic resources. FPGAs also offer a <strong>higher ratio of flip-flops to logic resources</strong> than do CPLDs"</td><td>thousands of small logic blocks + a rich interconnect</td></tr>
<tr><td><strong>Logic block</strong></td><td>"a relatively small circuit block that is <strong>replicated in an array</strong> in an FPD. When a circuit is implemented in an FPD, it is first <strong>decomposed into smaller subcircuits</strong> that can each be mapped into a logic block"</td><td>the unit of replication — drawn on slide 55</td></tr>
</table>
<ul>
<li><strong>The one sentence that separates PLA from PAL.</strong> Both planes programmable = PLA; only the AND plane programmable = PAL. PAL is cheaper and faster (a fixed OR plane is smaller), PLA is more flexible. This is the most commonly examined line in the table.</li>
<li><strong>Read the FPGA definition as a trade-off, not a superlative.</strong> "Narrow logic resources" means each block takes few inputs — so a wide AND term must be spread across several blocks and routed, which costs delay. In exchange you get enormous capacity and far more flip-flops. CPLD = few big blocks, predictable timing. FPGA = many small blocks, huge capacity, timing depends on routing.</li>
<li><strong>The phrase "higher ratio of flip-flops" is a sequential-circuit statement.</strong> It says FPGAs are built for <em>registered</em> designs — pipelines and state machines, i.e. everything from slide 39 onward — not just for combinational glue logic. Slide 55 shows a logic block with a D flip-flop in it, which is that sentence drawn.</li>
<li><strong>Where these sit between software and silicon.</strong> Full custom ASIC: fastest, cheapest per unit at volume, months to make, cannot be changed. FPGA: configured in seconds, changeable, slower and costlier per unit. Software on a CPU: infinitely flexible, slowest. PLDs occupy the useful middle, which is why prototypes, network gear and accelerators use them.</li>
</ul>
<p class="dap-an">✅ Ordering by capacity, straight from the slide's own wording: <strong>PAL/PLA (SPLD) &lt; CPLD &lt; FPGA</strong>. And by "how much of the chip is programmable": PAL (AND only) &lt; PLA (AND + OR) &lt; CPLD (blocks + interconnect) &lt; FPGA (blocks + rich interconnect + I/O blocks).</p>
<p class="meo">💡 Mnemonic for the two confusable acronyms: <strong>P<em>L</em>A has the <em>L</em> for "Lots programmable" (both planes); P<em>A</em>L has the <em>A</em> for "<em>A</em>ND only".</strong></p>
<p class="pitfall">⚠️ Trap: "FPGA" and "field-programmable device (FPD)" are not synonyms. The slide defines FPD as another name for <em>PLD</em> — the umbrella — while FPGA is one specific member of the family. Writing "every FPD is an FPGA" reverses the containment.</p>`,
        `<p class="y-chinh">🎯 Một slide thuật ngữ, và đáng đọc như một CÂY PHẢ HỆ chứ không phải một danh sách. Ý tưởng chung: thay vì chế tạo một con chip riêng, hãy mua một con chip đầy logic chưa cam kết rồi <strong>tự cấu hình lấy</strong>. Bảy thuật ngữ chỉ khác nhau ở chỗ có bao nhiêu logic, và phần nào lập trình được.</p>
<table>
<tr><th>Thuật ngữ</th><th>Định nghĩa của slide, rút gọn</th><th>Cái gì lập trình được</th></tr>
<tr><td><strong>PLD</strong> — Programmable Logic Device</td><td>"bất kỳ loại mạch tích hợp nào dùng để hiện thực phần cứng số, mà chip có thể được NGƯỜI DÙNG CUỐI cấu hình để tạo ra các thiết kế khác nhau"; còn gọi là <strong>field-programmable device (FPD)</strong></td><td>thuật ngữ bao trùm</td></tr>
<tr><td><strong>PLA</strong> — Programmable Logic Array</td><td>"một PLD tương đối nhỏ, chứa HAI TẦNG logic là <strong>mặt phẳng AND</strong> và <strong>mặt phẳng OR</strong>, và <strong>CẢ HAI</strong> tầng đều lập trình được"</td><td>mặt phẳng AND <em>VÀ</em> mặt phẳng OR</td></tr>
<tr><td><strong>PAL</strong> — Programmable Array Logic</td><td>"một PLD tương đối nhỏ có <strong>mặt phẳng AND lập trình được, theo sau là mặt phẳng OR CỐ ĐỊNH</strong>"</td><td>chỉ mặt phẳng AND</td></tr>
<tr><td><strong>SPLD</strong> — Simple PLD</td><td>"là một PLA hoặc một PAL"</td><td>—</td></tr>
<tr><td><strong>CPLD</strong> — Complex PLD</td><td>"gồm một sự sắp xếp của <strong>NHIỀU khối giống SPLD</strong> trên cùng một chip"</td><td>nhiều khối SPLD + mạng nối giữa chúng</td></tr>
<tr><td><strong>FPGA</strong> — Field-Programmable Gate Array</td><td>"một PLD có cấu trúc tổng quát cho phép <strong>dung lượng logic RẤT LỚN</strong>. Trong khi CPLD có tài nguyên logic với SỐ ĐẦU VÀO RỘNG (các mặt phẳng AND) thì FPGA cung cấp tài nguyên logic <strong>HẸP HƠN</strong>. FPGA cũng cho <strong>TỈ LỆ flip-flop trên tài nguyên logic CAO HƠN</strong> so với CPLD"</td><td>hàng nghìn khối logic nhỏ + mạng nối phong phú</td></tr>
<tr><td><strong>Logic block</strong> — khối logic</td><td>"một khối mạch tương đối nhỏ được <strong>NHÂN BẢN thành mảng</strong> trong một FPD. Khi hiện thực một mạch trong FPD, trước hết nó được <strong>PHÂN RÃ thành các mạch con nhỏ hơn</strong>, mỗi mạch con ánh xạ được vào một khối logic"</td><td>đơn vị nhân bản — vẽ ở slide 55</td></tr>
</table>
<ul>
<li><strong>Một câu tách PLA khỏi PAL.</strong> Cả hai mặt phẳng lập trình được = PLA; chỉ mặt phẳng AND lập trình được = PAL. PAL rẻ và nhanh hơn (mặt phẳng OR cố định thì nhỏ hơn), PLA linh hoạt hơn. Đây là dòng bị hỏi thi nhiều nhất trong bảng.</li>
<li><strong>Đọc định nghĩa FPGA như một ĐÁNH ĐỔI, đừng đọc như lời khen.</strong> "Tài nguyên logic hẹp" nghĩa là mỗi khối nhận ít đầu vào — nên một số hạng AND rộng phải trải ra nhiều khối rồi đi dây nối, và điều đó tốn độ trễ. Đổi lại bạn được dung lượng khổng lồ và nhiều flip-flop hơn hẳn. CPLD = ít khối to, thời gian dự đoán được. FPGA = nhiều khối nhỏ, dung lượng lớn, thời gian phụ thuộc cách đi dây.</li>
<li><strong>Cụm "tỉ lệ flip-flop cao hơn" là một phát biểu về MẠCH TUẦN TỰ.</strong> Nó nói FPGA được làm ra cho các thiết kế <em>CÓ THANH GHI</em> — đường ống và máy trạng thái, tức mọi thứ từ slide 39 trở đi — chứ không chỉ cho logic keo tổ hợp. Slide 55 vẽ một khối logic có flip-flop D bên trong, đó chính là câu này được vẽ ra.</li>
<li><strong>Chúng đứng ở đâu giữa phần mềm và silicon.</strong> ASIC chế riêng hoàn toàn: nhanh nhất, rẻ nhất trên mỗi đơn vị khi sản lượng lớn, mất hàng tháng để làm, không đổi được. FPGA: cấu hình trong vài giây, đổi được, chậm hơn và đắt hơn trên mỗi đơn vị. Phần mềm chạy trên CPU: linh hoạt vô hạn, chậm nhất. PLD chiếm khoảng giữa hữu dụng, nên bản mẫu, thiết bị mạng và bộ tăng tốc đều dùng chúng.</li>
</ul>
<p class="dap-an">✅ Xếp theo dung lượng, lấy thẳng từ chữ của slide: <strong>PAL/PLA (SPLD) &lt; CPLD &lt; FPGA</strong>. Còn xếp theo "bao nhiêu phần của chip lập trình được": PAL (chỉ AND) &lt; PLA (AND + OR) &lt; CPLD (khối + mạng nối) &lt; FPGA (khối + mạng nối phong phú + khối vào/ra).</p>
<p class="meo">💡 Mẹo nhớ hai từ viết tắt hay lẫn: <strong>P<em>L</em>A có chữ <em>L</em> = "Lắm thứ lập trình được" (cả hai mặt phẳng); P<em>A</em>L có chữ <em>A</em> = "chỉ <em>A</em>ND thôi".</strong></p>
<p class="pitfall">⚠️ Bẫy: "FPGA" và "field-programmable device (FPD)" KHÔNG đồng nghĩa. Slide định nghĩa FPD là tên gọi khác của <em>PLD</em> — cái ô bao trùm — còn FPGA là một thành viên cụ thể trong họ. Viết "mọi FPD đều là FPGA" là lộn ngược quan hệ bao hàm.</p>`],

      [53, 'Figure 12.34 — An Example of a Programmable Logic Array (PLA)',
        `<p class="y-chinh">🎯 The PLA drawn twice: <strong>(a)</strong> the blank layout of a 3-input, 2-output PLA — inputs I<sub>1</sub>, I<sub>2</sub>, I<sub>3</sub>, six vertical rails (each input and its complement), three horizontal AND rows, then two OR columns producing O<sub>1</sub>, O<sub>2</sub>. <strong>(b)</strong> the same array <em>programmed</em>, with inputs renamed A, B, C and dots marking the chosen connections.</p>
<ul>
<li><strong>The AND plane makes product terms.</strong> Each of the three horizontal rows is one AND gate; a dot where it crosses a vertical rail means that literal joins the product. In part (b) the three rows produce <code>ABC'</code>, <code>A'B</code> and <code>AC'</code> — the slide prints these labels on the right of each row.</li>
<li><strong>The OR plane sums them.</strong> Each of the two vertical OR columns collects whichever product rows are dotted. The figure's outputs are labelled <strong><code>O<sub>1</sub> = ABC' + A'B</code></strong> and <strong><code>O<sub>2</sub> = A'B + AC'</code></strong>.</li>
<li><strong>Look at what makes it a PLA and not a PAL.</strong> The term <code>A'B</code> feeds <em>both</em> outputs — a dot in column 1 and a dot in column 2 on the same row. That sharing is only possible because the <strong>OR plane is programmable too</strong>. A PAL, with a fixed OR plane, would have to generate A'B twice.</li>
<li><strong>It is sum-of-products in hardware.</strong> Slides 13–16 taught you to express any Boolean function as a sum of products; a PLA is a chip whose entire job is to realise such an expression. Two-level AND-then-OR, exactly like Figure 12.6 — except the wiring is decided after manufacture.</li>
</ul>
<p class="nhan">📐 Truth table for the programmed PLA of part (b), all eight input combinations, worked out from O<sub>1</sub> = ABC' + A'B and O<sub>2</sub> = A'B + AC':</p>
<table>
<tr><th>A</th><th>B</th><th>C</th><th>ABC'</th><th>A'B</th><th>AC'</th><th>O<sub>1</sub></th><th>O<sub>2</sub></th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
</table>
<p class="dap-an">✅ Reading the table: O<sub>1</sub> = B·C' + A'B, i.e. it is 1 whenever B = 1 and not (A = 1 and C = 1); O<sub>2</sub> is 1 for A'B or AC'. Note row <code>ABC = 110</code>, where <em>both</em> product terms ABC' and AC' fire — a PLA allows overlapping terms, it does not require a partition.</p>
<ul>
<li><strong>PLA versus ROM, the design decision.</strong> A ROM (slide 34) stores <em>all</em> 2<sup>n</sup> minterms, one word line each — total 2<sup>n</sup> rows regardless of how simple the function is. A PLA stores only the product terms you actually need — here 3 rows instead of 8. For sparse functions the PLA is far smaller; for dense arbitrary tables the ROM wins.</li>
<li><strong>Same shape, three devices.</strong> Decoder (slide 29) = fixed AND plane, no OR plane. ROM (slide 34) = fixed AND plane (the decoder) + programmable OR plane (the dots). PLA = <em>both</em> planes programmable. Seeing that progression is the point of putting these figures in one chapter.</li>
</ul>
<p class="meo">💡 Read any PLA diagram in two passes: <strong>first the rows (what product does each AND make?), then the columns (which products does each OR collect?)</strong>. Never try to read it as a single mesh.</p>
<p class="pitfall">⚠️ Trap: counting six vertical rails as six inputs. There are <strong>three inputs</strong> (A, B, C); each gets two rails, one for the plain literal and one for the complement produced by the small inverters at the top. An n-input PLA always has 2n rails.</p>`,
        `<p class="y-chinh">🎯 PLA được vẽ hai lần: <strong>(a)</strong> bố cục TRẮNG của một PLA 3 vào 2 ra — đầu vào I<sub>1</sub>, I<sub>2</sub>, I<sub>3</sub>, sáu đường dọc (mỗi đầu vào và phần bù của nó), ba hàng AND nằm ngang, rồi hai cột OR cho ra O<sub>1</sub>, O<sub>2</sub>. <strong>(b)</strong> vẫn mảng đó nhưng <em>ĐÃ LẬP TRÌNH</em>, đầu vào đổi tên thành A, B, C và các dấu chấm đánh dấu những mối nối đã chọn.</p>
<ul>
<li><strong>Mặt phẳng AND sinh ra các số hạng TÍCH.</strong> Mỗi hàng ngang trong ba hàng là một cổng AND; một dấu chấm ở chỗ nó cắt một đường dọc nghĩa là biến đó tham gia vào tích. Ở phần (b), ba hàng sinh ra <code>ABC'</code>, <code>A'B</code> và <code>AC'</code> — slide in đúng các nhãn này bên phải từng hàng.</li>
<li><strong>Mặt phẳng OR cộng chúng lại.</strong> Mỗi cột OR dọc trong hai cột gom những hàng tích nào có chấm. Đầu ra trên hình có nhãn <strong><code>O<sub>1</sub> = ABC' + A'B</code></strong> và <strong><code>O<sub>2</sub> = A'B + AC'</code></strong>.</li>
<li><strong>Nhìn xem cái gì làm nó là PLA chứ không phải PAL.</strong> Số hạng <code>A'B</code> nuôi <em>CẢ HAI</em> đầu ra — một chấm ở cột 1 và một chấm ở cột 2 trên cùng một hàng. Việc DÙNG CHUNG đó chỉ làm được vì <strong>mặt phẳng OR cũng lập trình được</strong>. Một con PAL với mặt phẳng OR cố định sẽ phải sinh A'B hai lần.</li>
<li><strong>Đây là tổng-các-tích bằng phần cứng.</strong> Slide 13–16 dạy bạn viết mọi hàm Boole thành tổng các tích; PLA là con chip mà toàn bộ nhiệm vụ của nó là hiện thực một biểu thức như vậy. Hai tầng AND-rồi-OR, y hệt Figure 12.6 — chỉ khác là cách nối dây được quyết định SAU khi chế tạo.</li>
</ul>
<p class="nhan">📐 Bảng chân trị của PLA đã lập trình ở phần (b), đủ tám tổ hợp đầu vào, tính từ O<sub>1</sub> = ABC' + A'B và O<sub>2</sub> = A'B + AC':</p>
<table>
<tr><th>A</th><th>B</th><th>C</th><th>ABC'</th><th>A'B</th><th>AC'</th><th>O<sub>1</sub></th><th>O<sub>2</sub></th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
</table>
<p class="dap-an">✅ Đọc bảng: O<sub>1</sub> = B·C' + A'B, tức nó bằng 1 khi B = 1 và KHÔNG phải trường hợp (A = 1 và C = 1); O<sub>2</sub> bằng 1 với A'B hoặc AC'. Chú ý hàng <code>ABC = 110</code>, nơi <em>CẢ HAI</em> số hạng tích ABC' và AC' cùng bật — PLA cho phép các số hạng CHỒNG LẤN, nó không đòi hỏi một phép phân hoạch.</p>
<ul>
<li><strong>PLA so với ROM, quyết định thiết kế.</strong> ROM (slide 34) lưu <em>TOÀN BỘ</em> 2<sup>n</sup> minterm, mỗi cái một đường từ — tổng 2<sup>n</sup> hàng bất kể hàm đơn giản đến đâu. PLA chỉ lưu những số hạng tích bạn THẬT SỰ cần — ở đây 3 hàng thay vì 8. Với hàm thưa thì PLA nhỏ hơn hẳn; với bảng dày và tuỳ tiện thì ROM thắng.</li>
<li><strong>Cùng một hình dạng, ba linh kiện.</strong> Decoder (slide 29) = mặt phẳng AND cố định, không có mặt phẳng OR. ROM (slide 34) = mặt phẳng AND cố định (chính là decoder) + mặt phẳng OR lập trình được (các dấu chấm). PLA = <em>CẢ HAI</em> mặt phẳng lập trình được. Nhìn ra chuỗi tiến hoá đó chính là mục đích của việc xếp ba hình này vào cùng một chương.</li>
</ul>
<p class="meo">💡 Đọc mọi sơ đồ PLA theo hai lượt: <strong>lượt một đọc các HÀNG (mỗi cổng AND sinh ra tích nào?), lượt hai đọc các CỘT (mỗi cổng OR gom những tích nào?)</strong>. Đừng bao giờ cố đọc nó như một tấm lưới liền.</p>
<p class="pitfall">⚠️ Bẫy: đếm sáu đường dọc thành sáu đầu vào. Chỉ có <strong>BA đầu vào</strong> (A, B, C); mỗi cái được hai đường, một cho biến thẳng và một cho phần bù do mấy cổng NOT nhỏ ở trên đỉnh sinh ra. PLA n đầu vào luôn có 2n đường dọc.</p>`],

      [54, 'Figure 12.35 — Structure of an FPGA',
        `<p class="y-chinh">🎯 The floor plan of an FPGA, and it is deliberately simple: a <strong>4 × 4 grid of green logic blocks</strong>, a mesh of horizontal and vertical <strong>routing channels</strong> running between them, and a ring of grey <strong>I/O blocks</strong> around the edge. Two labels only: "Logic block" pointing at a green square, "I/O block" pointing at a grey one.</p>
<ul>
<li><strong>Three resources, and all three are programmable.</strong> The <em>logic blocks</em> (what each one computes), the <em>interconnect</em> (which block's output reaches which block's input), and the <em>I/O blocks</em> (which pins are inputs, outputs, or bidirectional, and at what voltage standard). Configure all three and you have described a circuit.</li>
<li><strong>The wires matter as much as the logic — the part beginners miss.</strong> Look at how much of the picture is routing channels rather than logic. In a real FPGA the interconnect takes <em>most</em> of the silicon area and <em>most</em> of the delay. This is what slide 52 meant by FPGAs having "narrow logic resources": small blocks, so designs get spread out, so signals spend their time travelling.</li>
<li><strong>How a design gets onto this array</strong> — the toolchain, in the order it runs:</li>
</ul>
<table>
<tr><th>Step</th><th>What happens</th><th>Slide 52's wording</th></tr>
<tr><td>1. Synthesis</td><td>HDL (Verilog/VHDL) → a netlist of gates and flip-flops</td><td>—</td></tr>
<tr><td>2. Technology mapping</td><td>The netlist is "decomposed into smaller subcircuits" that each fit one logic block</td><td>exactly the "logic block" definition</td></tr>
<tr><td>3. Placement</td><td>Each subcircuit is assigned to a specific green square</td><td>—</td></tr>
<tr><td>4. Routing</td><td>The channels are configured to connect the placed blocks</td><td>—</td></tr>
<tr><td>5. Bitstream + load</td><td>All the configuration bits are written into the chip — seconds, not months</td><td>"configured by the end user"</td></tr>
</table>
<p class="dap-an">✅ Capacity arithmetic for this toy figure: 4 × 4 = <strong>16 logic blocks</strong>. If each holds a 4-input lookup table (slide 55), the array realises 16 arbitrary 4-variable functions plus 16 flip-flops. A real device has tens of thousands to millions of such blocks — the same picture, scaled by five or six orders of magnitude.</p>
<ul>
<li><strong>Why timing is harder on an FPGA than on a CPLD.</strong> A CPLD's few big blocks give nearly fixed, predictable delays. Here the delay between two blocks depends on how far apart the placer put them and which channels the router picked — so the same design, recompiled, can have different timing. That is the price of the capacity.</li>
<li><strong>What this makes possible in this course.</strong> Everything in Chapter 12 — gates, adders, decoders, flip-flops, registers, counters — can be built on one of these chips in an afternoon and probed with a logic analyser. An FPGA is the lab bench for the whole chapter.</li>
</ul>
<p class="meo">💡 Picture a <strong>city block grid</strong>: the green squares are buildings that do the work, the channels are the streets, the grey blocks around the edge are the airports. Designing for an FPGA is mostly a traffic problem.</p>
<p class="pitfall">⚠️ Trap: "FPGA" contains the words "gate array", so students expect a sea of individual AND/OR gates. It is not. The programmable unit is a <em>logic block</em> containing a lookup table and a flip-flop (slide 55) — the gates are simulated by table lookup, not physically wired.</p>`,
        `<p class="y-chinh">🎯 Mặt bằng của một FPGA, và nó cố tình đơn giản: một <strong>lưới 4 × 4 các khối logic màu xanh</strong>, một mạng lưới <strong>kênh đi dây</strong> ngang và dọc chạy giữa chúng, và một vành <strong>khối vào/ra</strong> màu xám bao quanh mép. Chỉ có hai nhãn: "Logic block" chỉ vào một ô xanh, "I/O block" chỉ vào một ô xám.</p>
<ul>
<li><strong>Ba loại tài nguyên, và cả ba đều lập trình được.</strong> Các <em>khối logic</em> (mỗi khối tính gì), <em>mạng nối</em> (đầu ra của khối nào tới được đầu vào của khối nào), và các <em>khối vào/ra</em> (chân nào là vào, ra, hay hai chiều, và theo chuẩn điện áp nào). Cấu hình cả ba là bạn đã mô tả xong một mạch.</li>
<li><strong>Dây quan trọng ngang với logic — chỗ người mới hay bỏ qua.</strong> Nhìn xem bao nhiêu phần bức tranh là kênh đi dây chứ không phải logic. Trong FPGA thật, mạng nối chiếm <em>PHẦN LỚN</em> diện tích silicon và <em>PHẦN LỚN</em> độ trễ. Đây chính là điều slide 52 muốn nói khi bảo FPGA có "tài nguyên logic hẹp": khối nhỏ, nên thiết kế bị trải rộng ra, nên tín hiệu dành thời gian để... đi đường.</li>
<li><strong>Một thiết kế lên được cái mảng này bằng cách nào</strong> — chuỗi công cụ, theo đúng thứ tự chạy:</li>
</ul>
<table>
<tr><th>Bước</th><th>Chuyện gì xảy ra</th><th>Cách slide 52 diễn đạt</th></tr>
<tr><td>1. Tổng hợp (synthesis)</td><td>HDL (Verilog/VHDL) → một netlist gồm cổng và flip-flop</td><td>—</td></tr>
<tr><td>2. Ánh xạ công nghệ</td><td>Netlist được "phân rã thành các mạch con nhỏ hơn", mỗi cái vừa một khối logic</td><td>đúng định nghĩa "logic block"</td></tr>
<tr><td>3. Đặt chỗ (placement)</td><td>Mỗi mạch con được gán vào một ô xanh cụ thể</td><td>—</td></tr>
<tr><td>4. Đi dây (routing)</td><td>Các kênh được cấu hình để nối những khối đã đặt</td><td>—</td></tr>
<tr><td>5. Sinh bitstream + nạp</td><td>Toàn bộ bit cấu hình được ghi vào chip — mất vài giây, không phải vài tháng</td><td>"được người dùng cuối cấu hình"</td></tr>
</table>
<p class="dap-an">✅ Phép tính dung lượng cho hình đồ chơi này: 4 × 4 = <strong>16 khối logic</strong>. Nếu mỗi khối chứa một bảng tra 4 đầu vào (slide 55) thì mảng này hiện thực được 16 hàm 4 biến tuỳ ý cộng 16 flip-flop. Thiết bị thật có từ hàng chục nghìn tới hàng triệu khối như vậy — vẫn bức tranh ấy, phóng lên năm sáu bậc độ lớn.</p>
<ul>
<li><strong>Vì sao căn thời gian trên FPGA khó hơn trên CPLD.</strong> Vài khối to của CPLD cho độ trễ gần như cố định và đoán được. Ở đây, độ trễ giữa hai khối phụ thuộc bộ đặt chỗ đã xếp chúng cách nhau bao xa và bộ đi dây đã chọn kênh nào — nên cùng một thiết kế, biên dịch lại, có thể ra thời gian khác. Đó là cái giá của dung lượng.</li>
<li><strong>Nó mở ra điều gì cho môn này.</strong> Mọi thứ trong Chương 12 — cổng, bộ cộng, bộ giải mã, flip-flop, thanh ghi, bộ đếm — đều có thể dựng trên một con chip loại này trong một buổi chiều rồi soi bằng máy phân tích logic. FPGA là cái bàn thí nghiệm của cả chương.</li>
</ul>
<p class="meo">💡 Hình dung một <strong>lưới ô phố</strong>: ô xanh là các toà nhà làm việc, kênh đi dây là đường phố, khối xám quanh mép là sân bay. Thiết kế cho FPGA phần lớn là một bài toán GIAO THÔNG.</p>
<p class="pitfall">⚠️ Bẫy: chữ "FPGA" có cụm "gate array" nên sinh viên tưởng bên trong là một biển cổng AND/OR riêng lẻ. KHÔNG phải. Đơn vị lập trình được là một <em>khối logic</em> chứa một bảng tra và một flip-flop (slide 55) — các cổng được MÔ PHỎNG bằng tra bảng, chứ không nối dây vật lý.</p>`],

      [55, 'Figure 12.36 — A Simple FPGA Logic Block',
        `<p class="y-chinh">🎯 Zoom into one green square from slide 54. Inside: a <strong>16 × 1 lookup table</strong> addressed by A0, A1, A2, A3; its single output goes two ways — straight to a <strong>2-to-1 MUX</strong>, and also into the <strong>D input of a flip-flop</strong> clocked by <code>Clock</code>, whose Q also reaches the MUX. A small configuration box selects which of the two the MUX passes out. That is the whole block.</p>
<ul>
<li><strong>The lookup table <em>is</em> the logic.</strong> A 16 × 1 memory addressed by 4 bits stores one output bit per input combination — it is a tiny ROM (slide 34) whose contents are set at configuration time. There are 2<sup>16</sup> = <strong>65 536</strong> possible contents, and exactly 65 536 Boolean functions of 4 variables — so a 4-input LUT implements <strong>every</strong> 4-variable function, with no exception and no minimisation needed.</li>
<li><strong>The flip-flop is why slide 52 said "higher ratio of flip-flops".</strong> Every block can register its own output. Sequential designs — pipelines, counters, state machines, everything from slide 39 onward — map naturally onto the array without wasting separate resources.</li>
<li><strong>The MUX is the mode switch.</strong> Its select comes from a configuration bit, not from the running circuit:</li>
</ul>
<table>
<tr><th>Config bit</th><th>MUX passes</th><th>Block behaves as</th><th>Typical use</th></tr>
<tr><td>0</td><td>LUT output directly</td><td>pure <strong>combinational</strong> logic</td><td>An adder stage, a decoder, address compare</td></tr>
<tr><td>1</td><td>Flip-flop output Q</td><td><strong>registered</strong> logic</td><td>A pipeline stage, a counter bit, a state bit</td></tr>
</table>
<p class="dap-an">✅ Two computed facts worth remembering. <strong>(1)</strong> One 4-input LUT = 16 configuration bits and covers all 65 536 functions of 4 variables. <strong>(2)</strong> The 16 blocks of the array on slide 54 therefore need 16 × 16 = <strong>256 bits</strong> for the LUTs alone, plus one bit per MUX, plus everything the interconnect needs — and the interconnect configuration is usually far larger than the logic configuration. That ratio is why bitstreams for real FPGAs are megabytes.</p>
<ul>
<li><strong>Build Figure 12.22's full adder in these blocks, as an exercise.</strong> Sum = A ⊕ B ⊕ C<sub>in</sub> is a 3-variable function → fits in one LUT with an input to spare. Carry = AB + AC<sub>in</sub> + BC<sub>in</sub> is another 3-variable function → a second LUT. So one full adder = <strong>2 logic blocks</strong>, both with their MUX set to 0 (combinational). A 4-bit ripple adder = 8 blocks, which is half of the toy array on slide 54.</li>
<li><strong>Build the counter of slide 51 instead.</strong> Three state bits = three flip-flops = three blocks with MUX set to 1, and the LUT of each block computes that bit's next value. The AND gate producing BA does not need a block of its own — it is absorbed into the LUT that feeds bit C. <strong>LUTs make small gates free.</strong></li>
<li><strong>Why a LUT and not real gates.</strong> A fixed table is the same size and the same delay for <em>any</em> function of its inputs — XOR costs no more than AND. That uniformity is what lets the tools place and route mechanically.</li>
</ul>
<p class="meo">💡 Remember the block as three things in a row: <strong>LUT (compute) → flip-flop (remember) → MUX (choose which one you want)</strong>. Almost every FPGA in existence is a variation on that trio.</p>
<p class="pitfall">⚠️ Trap: thinking the MUX select is a runtime signal. It is a <em>configuration</em> bit — it is fixed when the bitstream loads and does not change while the design runs. The little box under the MUX in the figure is a configuration cell, not an input pin.</p>`,
        `<p class="y-chinh">🎯 Phóng to một ô xanh của slide 54. Bên trong: một <strong>bảng tra 16 × 1</strong> được A0, A1, A2, A3 địa chỉ hoá; đầu ra duy nhất của nó đi hai ngả — thẳng tới một <strong>MUX 2→1</strong>, và đồng thời vào <strong>chân D của một flip-flop</strong> được <code>Clock</code> nhịp, mà Q của flip-flop cũng chạy tới MUX. Một ô cấu hình nhỏ chọn xem MUX cho cái nào đi ra. Cả khối chỉ có thế.</p>
<ul>
<li><strong>Bảng tra CHÍNH LÀ phần logic.</strong> Một bộ nhớ 16 × 1 được 4 bit địa chỉ hoá thì lưu một bit ra cho mỗi tổ hợp đầu vào — nó là một con ROM tí hon (slide 34) mà nội dung được đặt lúc cấu hình. Có 2<sup>16</sup> = <strong>65 536</strong> nội dung khả dĩ, và có đúng 65 536 hàm Boole của 4 biến — nên một LUT 4 đầu vào hiện thực được <strong>MỌI</strong> hàm 4 biến, không trừ hàm nào và không cần rút gọn gì.</li>
<li><strong>Cái flip-flop là lý do slide 52 nói "tỉ lệ flip-flop cao hơn".</strong> Mọi khối đều có thể chốt lại đầu ra của chính mình. Các thiết kế tuần tự — đường ống, bộ đếm, máy trạng thái, mọi thứ từ slide 39 trở đi — ánh xạ tự nhiên lên mảng mà không phải tiêu tốn tài nguyên riêng.</li>
<li><strong>Cái MUX là công tắc chọn CHẾ ĐỘ.</strong> Chân chọn của nó đến từ một bit cấu hình, không phải từ mạch đang chạy:</li>
</ul>
<table>
<tr><th>Bit cấu hình</th><th>MUX cho đi qua</th><th>Khối hành xử như</th><th>Dùng điển hình</th></tr>
<tr><td>0</td><td>đầu ra LUT trực tiếp</td><td>logic <strong>TỔ HỢP</strong> thuần</td><td>Một tầng bộ cộng, một bộ giải mã, so sánh địa chỉ</td></tr>
<tr><td>1</td><td>đầu ra Q của flip-flop</td><td>logic <strong>CÓ THANH GHI</strong></td><td>Một tầng đường ống, một bit bộ đếm, một bit trạng thái</td></tr>
</table>
<p class="dap-an">✅ Hai con số đáng nhớ, đã tính. <strong>(1)</strong> Một LUT 4 đầu vào = 16 bit cấu hình và phủ hết 65 536 hàm của 4 biến. <strong>(2)</strong> Vậy 16 khối của mảng ở slide 54 cần 16 × 16 = <strong>256 bit</strong> chỉ riêng cho các LUT, cộng một bit mỗi MUX, cộng tất cả những gì mạng nối cần — mà cấu hình mạng nối thường LỚN HƠN NHIỀU cấu hình logic. Tỉ lệ đó là lý do bitstream của FPGA thật nặng hàng megabyte.</p>
<ul>
<li><strong>Bài tập: dựng bộ cộng đầy đủ của Figure 12.22 bằng những khối này.</strong> Sum = A ⊕ B ⊕ C<sub>in</sub> là hàm 3 biến → vừa một LUT, còn thừa một đầu vào. Carry = AB + AC<sub>in</sub> + BC<sub>in</sub> là hàm 3 biến nữa → một LUT thứ hai. Vậy một bộ cộng đầy đủ = <strong>2 khối logic</strong>, cả hai đặt MUX về 0 (tổ hợp). Một bộ cộng ripple 4 bit = 8 khối, tức một nửa cái mảng đồ chơi ở slide 54.</li>
<li><strong>Hoặc dựng bộ đếm của slide 51.</strong> Ba bit trạng thái = ba flip-flop = ba khối với MUX đặt về 1, và LUT của mỗi khối tính giá trị kế tiếp của bit đó. Cổng AND sinh ra BA KHÔNG cần một khối riêng — nó bị nuốt vào chính cái LUT nuôi bit C. <strong>LUT làm cho các cổng nhỏ trở nên MIỄN PHÍ.</strong></li>
<li><strong>Vì sao dùng LUT mà không dùng cổng thật.</strong> Một bảng cố định có cùng kích thước và cùng độ trễ cho <em>MỌI</em> hàm của các đầu vào của nó — XOR không đắt hơn AND chút nào. Chính sự đồng đều đó cho phép công cụ đặt chỗ và đi dây một cách máy móc.</li>
</ul>
<p class="meo">💡 Nhớ cái khối như ba thứ xếp hàng: <strong>LUT (tính) → flip-flop (nhớ) → MUX (chọn lấy cái nào)</strong>. Gần như mọi FPGA đang tồn tại đều là một biến thể của bộ ba đó.</p>
<p class="pitfall">⚠️ Bẫy: tưởng chân chọn của MUX là một tín hiệu chạy lúc thực thi. Nó là một bit <em>CẤU HÌNH</em> — được chốt khi nạp bitstream và không đổi trong suốt lúc thiết kế chạy. Cái ô nhỏ dưới MUX trên hình là một ô cấu hình, không phải chân đầu vào.</p>`],

      [56, 'Summary — Chapter 12: Digital Logic',
        `<p class="y-chinh">🎯 The closing map of the chapter, in two columns. Left: <strong>Boolean Algebra · Gates · Combinational Circuits</strong> (implementation of Boolean functions, multiplexers, decoders, read-only memory, adders). Right: <strong>Sequential Circuits</strong> (flip-flops, registers, counters) and <strong>Programmable Logic Devices</strong> (programmable logic array, field-programmable gate array).</p>
<ul>
<li><strong>The left/right split is the memoryless/stateful split.</strong> Slide 32 defined combinational as "memoryless"; slide 39 defined sequential as depending on "the past history of inputs". Everything on this summary sits on one side or the other of that single line, and an exam question that asks you to classify a circuit is asking exactly this.</li>
<li><strong>What each item of the right-hand column was, in one line each.</strong> <em>Flip-flops</em>: 1-bit memory, four types (S-R, J-K, D, and T from the book), distinguished by their characteristic and excitation tables. <em>Registers</em>: flip-flops in parallel (store a word) or in a chain (shift a word). <em>Counters</em>: registers that increment modulo their capacity, asynchronous (slow, ripples) or synchronous (fast, used in CPUs). <em>PLDs</em>: buy the logic uncommitted and configure it — PLA (both planes programmable) up to FPGA (LUT + flip-flop blocks in a routed array).</li>
<li><strong>How this chapter feeds the rest of the course:</strong></li>
</ul>
<table>
<tr><th>Built here</th><th>Becomes this later</th><th>Where</th></tr>
<tr><td>Adder (slides 35–38)</td><td>The ALU</td><td>Ch.11 Computer Arithmetic, Ch.16 Processor Structure</td></tr>
<tr><td>Decoder (slides 29–30)</td><td>Address decoding, instruction decoding</td><td>Ch.6 Internal Memory, Ch.19 Control Unit</td></tr>
<tr><td>ROM (slides 32–34)</td><td>Microprogram control store, firmware</td><td>Ch.6, Ch.19</td></tr>
<tr><td>Register (slide 48)</td><td><strong>PC, IR, MAR, MBR</strong>, the register file</td><td>Ch.3 Top-Level View, Ch.16</td></tr>
<tr><td>Shift register (slide 49)</td><td>Barrel shifter, serial links, multiply by shift-and-add</td><td>Ch.11, Ch.8 I/O</td></tr>
<tr><td>Counter (slides 50–51)</td><td><strong>The program counter's increment</strong>, cycle counters</td><td>Ch.3, Ch.19</td></tr>
<tr><td>Flip-flop (slides 40–47)</td><td>Pipeline registers, status flags, SRAM cells</td><td>Ch.5 Cache, Ch.16, Ch.18 Superscalar</td></tr>
</table>
<p class="dap-an">✅ Self-test before you close the chapter — if you can answer these six without notes, you are ready. <strong>(1)</strong> Why is a ROM combinational but a register sequential? <strong>(2)</strong> What does S = R = 1 do to an S-R latch, and how does J-K fix it? <strong>(3)</strong> State the difference between a latch and a flip-flop in one sentence. <strong>(4)</strong> Write the J-K excitation table from memory (four rows). <strong>(5)</strong> A 3-bit synchronous up-counter: what are Ja, Ka, Jb, Kb, Jc, Kc? <strong>(6)</strong> Why is a ripple counter's maximum frequency inversely proportional to its width?</p>
<ul>
<li><strong>Where the marks concentrate.</strong> The tables. Characteristic tables to analyse, excitation tables to design, and the counter design procedure of slide 51 — those three account for most of the CLO6 weight, and all three are written out in full in this lesson.</li>
<li><strong>One idea the whole chapter rests on.</strong> A computer is built entirely from two things: <em>gates that compute</em> and <em>loops that remember</em>. Chapter 12 shows that the second is just the first with a wire fed back. Nothing more exotic than that is needed to build a CPU.</li>
</ul>
<p class="meo">💡 Revision order that works: <strong>truth table → equation → circuit → timing</strong>. Whenever you are lost on a digital logic question, go back to the truth table; every other representation in this chapter is derived from it.</p>
<p class="pitfall">⚠️ Note the numbering one last time: this deck says "Chapter 12" (11th edition), the course website says "Chương 9", and the 9th-edition syllabus says "Chapter 11". Same content, three labels. On an exam paper, go by the topic names on this summary slide, not the chapter number.</p>`,
        `<p class="y-chinh">🎯 Tấm bản đồ khép lại chương, chia hai cột. Trái: <strong>Đại số Boole · Cổng logic · Mạch tổ hợp</strong> (hiện thực hàm Boole, multiplexer, bộ giải mã, bộ nhớ chỉ đọc, bộ cộng). Phải: <strong>Mạch tuần tự</strong> (flip-flop, thanh ghi, bộ đếm) và <strong>Thiết bị logic khả trình</strong> (mảng logic khả trình, mảng cổng khả trình tại chỗ).</p>
<ul>
<li><strong>Vạch chia trái/phải chính là vạch chia KHÔNG NHỚ / CÓ TRẠNG THÁI.</strong> Slide 32 định nghĩa mạch tổ hợp là "memoryless"; slide 39 định nghĩa mạch tuần tự là phụ thuộc "lịch sử các đầu vào trước đó". Mọi mục trên trang tổng kết này nằm ở một phía của đúng cái vạch đó, và câu hỏi thi bảo bạn phân loại một mạch chính là hỏi đúng chuyện này.</li>
<li><strong>Từng mục cột phải là gì, mỗi mục một dòng.</strong> <em>Flip-flop</em>: bộ nhớ 1 bit, bốn loại (S-R, J-K, D, và T lấy từ sách), phân biệt bằng bảng đặc tính và bảng kích thích. <em>Thanh ghi</em>: flip-flop mắc song song (lưu một từ) hoặc mắc chuỗi (dịch một từ). <em>Bộ đếm</em>: thanh ghi tăng theo modulo sức chứa, loại không đồng bộ (chậm, gợn sóng) hoặc đồng bộ (nhanh, dùng trong CPU). <em>PLD</em>: mua logic chưa cam kết rồi tự cấu hình — từ PLA (cả hai mặt phẳng lập trình được) lên tới FPGA (các khối LUT + flip-flop trong một mảng có đi dây).</li>
<li><strong>Chương này nuôi phần còn lại của môn học thế nào:</strong></li>
</ul>
<table>
<tr><th>Dựng ở đây</th><th>Về sau trở thành</th><th>Ở đâu</th></tr>
<tr><td>Bộ cộng (slide 35–38)</td><td>Khối ALU</td><td>Ch.11 Số học máy tính, Ch.16 Cấu trúc bộ xử lý</td></tr>
<tr><td>Bộ giải mã (slide 29–30)</td><td>Giải mã địa chỉ, giải mã lệnh</td><td>Ch.6 Bộ nhớ trong, Ch.19 Khối điều khiển</td></tr>
<tr><td>ROM (slide 32–34)</td><td>Kho vi chương trình điều khiển, firmware</td><td>Ch.6, Ch.19</td></tr>
<tr><td>Thanh ghi (slide 48)</td><td><strong>PC, IR, MAR, MBR</strong>, tệp thanh ghi</td><td>Ch.3 Nhìn tổng thể, Ch.16</td></tr>
<tr><td>Thanh ghi dịch (slide 49)</td><td>Bộ dịch thùng, đường truyền nối tiếp, nhân bằng dịch-và-cộng</td><td>Ch.11, Ch.8 Vào/ra</td></tr>
<tr><td>Bộ đếm (slide 50–51)</td><td><strong>Cơ chế tăng của bộ đếm chương trình</strong>, bộ đếm chu kỳ</td><td>Ch.3, Ch.19</td></tr>
<tr><td>Flip-flop (slide 40–47)</td><td>Thanh ghi đường ống, cờ trạng thái, ô SRAM</td><td>Ch.5 Cache, Ch.16, Ch.18 Superscalar</td></tr>
</table>
<p class="dap-an">✅ Tự kiểm trước khi gấp chương lại — trả lời được sáu câu này mà không mở vở là bạn đã sẵn sàng. <strong>(1)</strong> Vì sao ROM là mạch tổ hợp còn thanh ghi là mạch tuần tự? <strong>(2)</strong> S = R = 1 làm gì với chốt S-R, và J-K chữa nó bằng cách nào? <strong>(3)</strong> Nói khác biệt giữa chốt và flip-flop trong một câu. <strong>(4)</strong> Viết bảng kích thích J-K từ trí nhớ (bốn hàng). <strong>(5)</strong> Bộ đếm đồng bộ 3 bit đếm lên: Ja, Ka, Jb, Kb, Jc, Kc bằng gì? <strong>(6)</strong> Vì sao tần số tối đa của bộ đếm ripple tỉ lệ nghịch với độ rộng của nó?</p>
<ul>
<li><strong>Điểm thi dồn vào đâu.</strong> Vào CÁC BẢNG. Bảng đặc tính để phân tích, bảng kích thích để thiết kế, và quy trình thiết kế bộ đếm của slide 51 — ba thứ đó chiếm phần lớn trọng số CLO6, và cả ba đều được viết ra đầy đủ trong bài này.</li>
<li><strong>Một ý tưởng mà cả chương đứng trên đó.</strong> Máy tính được dựng trọn vẹn từ hai thứ: <em>những cổng biết TÍNH</em> và <em>những vòng biết NHỚ</em>. Chương 12 cho thấy thứ thứ hai chẳng qua là thứ thứ nhất cộng một sợi dây vòng ngược lại. Không cần gì kỳ bí hơn thế để dựng nên một CPU.</li>
</ul>
<p class="meo">💡 Thứ tự ôn tập chạy được: <strong>bảng chân trị → phương trình → mạch → giản đồ thời gian</strong>. Bí ở câu hỏi logic số nào thì quay về bảng chân trị; mọi cách biểu diễn khác trong chương này đều suy ra từ nó.</p>
<p class="pitfall">⚠️ Nhắc lại chuyện đánh số lần cuối: deck này ghi "Chapter 12" (bản 11th ed), web của môn ghi "Chương 9", còn syllabus theo bản 9th ed ghi "Chapter 11". Cùng nội dung, ba cái nhãn. Vào phòng thi thì bám theo TÊN CHỦ ĐỀ trên slide tổng kết này, đừng bám số chương.</p>`],

    ]),
  ].join('\n'),
};
