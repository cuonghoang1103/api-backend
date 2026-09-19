/**
 * CEA201 · "Chương 10 — Instruction Sets: Characteristics" trên web (deck 'cea13'
 * = Chapter 13 của Stallings 11th ed Global Edition), học theo từng slide,
 * PHẦN B: slide 25–48.
 *
 * ⚠️ ĐÁNH SỐ: syllabus trường theo bản 9th ed; web đánh khối này là Chương 10.
 * Deck gốc là CH13-COA11e.pptx. Trong bài, "Chương n" luôn là SỐ TRÊN WEB
 * (Ch.6 bộ nhớ ngoài · Ch.7 I/O · Ch.8 hỗ trợ HĐH · Ch.9 logic số ·
 * Ch.10 tập lệnh · Ch.11 chế độ địa chỉ · Ch.12 cấu trúc bộ xử lý · Ch.13 RISC),
 * còn "Figure 13.x / Table 13.x" là số IN TRÊN SLIDE của sách 11e.
 *
 * Nội dung bám ĐÚNG chữ trích từ /tmp/cea201-text/cea13.txt. Các slide chỉ có
 * tiêu đề (28, 30, 32, 34, 35, 37, 38, 39, 45, 46) đã ĐỌC THẲNG TỪ ẢNH render
 * /tmp/cea201-slides/cea13/NNN.webp để lấy đúng từng nhãn trên sơ đồ.
 *
 * ⚠️ MỌI con số, mọi bố trí byte, mọi kết quả dịch bit trong bài đều ĐÃ CHẠY
 * THẬT trên máy viết bài (Apple M1 Max, arm64, Apple clang 17.0.0, cc -Wall):
 *   · Thứ tự byte: int 0x12345678 in qua unsigned char* → 78 56 34 12 ⇒ máy này
 *     LITTLE-ENDIAN. uint16 0xABCD → CD AB. uint64 0x0123456789ABCDEF →
 *     EF CD AB 89 67 45 23 01. fwrite ra tệp rồi xxd → "7856 3412".
 *     Đọc 4 byte big-endian 12 34 56 78 vào int trên máy này → 0x78563412
 *     (2.018.915.346 thay vì 305.419.896) — hỏng dữ liệu, đúng như bài nói.
 *   · Table 13.7 (dịch/quay): chạy lại cả 6 dòng với 10100110 → khớp TUYỆT ĐỐI
 *     cả 6 kết quả của slide. Kèm hai bẫy: (−90) >> 3 = −12 nhưng −90 / 8 = −11;
 *     dịch trái số học 3 bit cho 10110000 = −80 trong khi −90 × 8 = −720 (tràn).
 *   · Table 13.6 (bảng chân trị): sinh lại bằng chương trình → khớp 4 dòng.
 *   · Cờ trạng thái: mô phỏng CMP cho 5 cặp, trong đó INT_MIN so với 1 cho
 *     S=0 nhưng O=1 ⇒ JL vẫn nhảy — bằng chứng vì sao "nhỏ hơn có dấu" là S≠O.
 *   · Ngăn xếp: main → P1 → P2 → P3 in __builtin_frame_address / return address
 *     → khung tụt 0x30 byte mỗi mức (ngăn xếp mọc XUỐNG); đệ quy giai_thua(5)
 *     cho 5 khung riêng cách nhau 0x50 byte.
 *   · Độ dài lệnh ĐO THẬT bằng otool -tv trên cùng một hàm C: arm64 = {4} byte
 *     cho cả 12 lệnh; x86_64 = {1, 2, 3} byte trong hàm đó, và một
 *     movabsq $0x1122334455667788 dài 10 byte.
 *   · CALL/RET: x86 callq tại 0x3e ⇒ địa chỉ trở về 0x43 (lệnh kế tiếp);
 *     arm64 hàm KHÔNG gọi ai (lá) không lưu x30, hàm có gọi thì
 *     "stp x29, x30, [sp, #0x10]" — đúng hai ô "Old Frame Pointer" +
 *     "Return Point" của Figure 13.10.
 *   · MMX: bảng cộng bão hoà vs cộng vòng cho 8 cặp byte, chạy thật.
 *
 * ⚠️ LỖI THẬT TRÊN SLIDE GỐC (đã đối chiếu ảnh, KHÔNG im lặng chép, KHÔNG tự sửa):
 *   · slide 42 (Table 13.9), dòng "L, NGE": slide in
 *     "(S = 1 AND O = 0) OR (S = 0 AND O = 0)". Vế sau PHẢI là (S = 0 AND O = 1);
 *     in như slide thì L và GE cùng đúng tại (S=0, O=0) — mâu thuẫn.
 *   · slide 47 (Table 13.11), bốn dòng MI/PL/VS/VC: slide in mã 5 bit
 *     00100/00101/00110/00111. Mã điều kiện ARM chỉ có 4 bit → phải là
 *     0100/0101/0110/0111.
 *   · slide 44 (Table 13.10): "PNDN" là lỗi gõ của "PANDN".
 *   · slide 22 (ngoài phạm vi bài này) khai "XOR Dest, Source" trong nhóm
 *     Input/Output — đó là OUTS; nhắc lại ở slide 31 vì có liên quan.
 *
 * ⚠️ KHÁC MÔ TẢ ĐẶT HÀNG: phần ENDIANNESS của chương KHÔNG nằm trong slide
 * 25–48 — nó ở slide 18–19 (ARM Data Types + Figure 13.5 ARM Endian Support),
 * tức thuộc phần A. Bài này vẫn dạy trọn endianness (bảng bố trí byte + chương
 * trình C chạy thật) tại slide 25, chỗ nói về LOAD/STORE, và nhắc lại ở slide 46.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea13';

export default {
  title: '10.0b — Slide by slide: Operation types, transfer of control, the stack, x86 and ARM (slides 25–48)|||10.0b — Slide bài giảng: Các loại phép toán, chuyển điều khiển, ngăn xếp, x86 & ARM (slide 25–48)',
  slug: 'cea201-10-0b-slides-phep-toan-chuyen-dieu-khien-x86-arm',
  type: 'DOCUMENT',
  description: 'Nửa sau Chương 10 (deck Chapter 13 bản 11e) của CEA201 — slide 25 đến 48. Đi hết SÁU loại phép toán của một tập lệnh (chuyển dữ liệu, số học, logic, dịch/quay, chuyển đổi, vào-ra, điều khiển hệ thống), rồi vào phần nặng điểm nhất: LỆNH CHUYỂN ĐIỀU KHIỂN — rẽ nhánh đọc cờ trạng thái, lệnh bỏ qua, gọi thủ tục lồng nhau và cơ chế NGĂN XẾP (Figure 13.8/13.9/13.10, có bảng chạy tay từng bước và khung ngăn xếp), khép lại bằng tập lệnh thật: x86 (CISC, cờ EFLAGS, điều kiện nhảy, MMX/SIMD) và ARM (RISC, lệnh nào cũng có điều kiện). Mọi bảng dịch bit, mọi bố trí byte (endianness), mọi con số độ dài lệnh và mọi khung ngăn xếp trong bài đều đã chạy thật bằng C và otool trên máy trước khi viết — kể cả hai chỗ SLIDE GỐC IN SAI, được nêu thẳng.',
  content: [
    walkHead(D, 25, 48),
    walk(D, [

      [25, 'Table 13.5 — Examples of IBM EAS/390 Data Transfer Operations',
        `<p class="y-chinh">🎯 The most fundamental instruction type, shown in a real instruction set. A data transfer instruction must specify three things: <strong>where the source is, where the destination is, and how much data moves</strong> — and the EAS/390 designers chose to bake all three into the <em>opcode</em> rather than into operand fields.</p>
<table>
<tr><th>Mnemonic</th><th>Name</th><th>Bits</th><th>Description on the slide</th></tr>
<tr><td>L</td><td>Load</td><td>32</td><td>Transfer from memory to register</td></tr>
<tr><td>LH</td><td>Load Halfword</td><td>16</td><td>Transfer from memory to register</td></tr>
<tr><td>LR</td><td>Load</td><td>32</td><td>Transfer from register to register</td></tr>
<tr><td>LER</td><td>Load (short)</td><td>32</td><td>Floating-point register to floating-point register</td></tr>
<tr><td>LE</td><td>Load (short)</td><td>32</td><td>Memory to floating-point register</td></tr>
<tr><td>LDR</td><td>Load (long)</td><td>64</td><td>Floating-point register to floating-point register</td></tr>
<tr><td>LD</td><td>Load (long)</td><td>64</td><td>Memory to floating-point register</td></tr>
<tr><td>ST</td><td>Store</td><td>32</td><td>Register to memory</td></tr>
<tr><td>STH</td><td>Store Halfword</td><td>16</td><td>Register to memory</td></tr>
<tr><td>STC</td><td>Store Character</td><td>8</td><td>Register to memory</td></tr>
<tr><td>STE</td><td>Store (short)</td><td>32</td><td>Floating-point register to memory</td></tr>
<tr><td>STD</td><td>Store (long)</td><td>64</td><td>Floating-point register to memory</td></tr>
</table>
<ul>
<li><strong>The mnemonics are a grammar, not twelve random names.</strong> <code>L</code> = load (memory → register), <code>ST</code> = store (register → memory); suffix <code>R</code> = the source is a <em>register</em>, <code>H</code> = halfword (16), <code>C</code> = character (8), <code>E</code> = short float (32), <code>D</code> = long float (64). Decode any row from those five rules.</li>
<li><strong>Twelve opcodes instead of one MOV — and that is the design point.</strong> Putting "how big" and "from where" into the opcode makes each instruction <em>short</em> (no size field, no type field to decode). The cost is an opcode table that explodes. Chapter 11 (addressing modes and formats) is precisely about this trade: information in the opcode versus information in the operand fields.</li>
<li><strong>Note that x86 went the other way.</strong> Table 13.3(a) on slide 20 lists one <code>MOV Dest, Source</code> plus <code>XCHG</code>, <code>PUSH</code>, <code>POP</code> — the size comes from the <em>register named</em> (AL / AX / EAX / RAX). Neither approach is wrong; they are two points on the same curve.</li>
<li><strong>What the processor actually does</strong> (Table 13.4, slide 23): if memory is involved it must determine the memory address, perform the virtual-to-real translation, check the cache, and only then initiate the read/write. A "simple" LOAD drags in Chapters 4–5 (cache) and Chapter 8 (OS support, paging).</li>
</ul>
<p class="nhan">📐 <strong>Byte order (endianness) — the thing every LOAD/STORE silently decides.</strong> A 32-bit store has to put four bytes into four consecutive addresses. Which byte goes first? This deck answers it at slide 18–19 (ARM Data Types and <em>Figure 13.5 ARM Endian Support — Word Load/Store with E-Bit</em>), i.e. in the first half of the chapter; it is placed here because this is the slide where words actually move.</p>
<table>
<tr><th>Address</th><th>Big-endian</th><th>Little-endian</th></tr>
<tr><td>100</td><td>12</td><td>78</td></tr>
<tr><td>101</td><td>34</td><td>56</td></tr>
<tr><td>102</td><td>56</td><td>34</td></tr>
<tr><td>103</td><td>78</td><td>12</td></tr>
</table>
<pre>#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
int main(void) {
    uint32_t x = 0x12345678u;
    unsigned char *p = (unsigned char *)&amp;x;   /* nhìn một int như 4 byte thô */
    for (int i = 0; i &lt; 4; i++)
        printf("  &amp;x + %d  -&gt;  0x%02X\\n", i, p[i]);
    return 0;
}</pre>
<p class="dap-an">✅ Real run (<code>cc -Wall</code>, Apple M1 Max, arm64): <code>&amp;x+0 → 0x78</code>, <code>&amp;x+1 → 0x56</code>, <code>&amp;x+2 → 0x34</code>, <code>&amp;x+3 → 0x12</code>. The <em>least significant</em> byte sits at the <em>lowest</em> address ⇒ <strong>this machine is little-endian</strong>. Same program: <code>uint16 0xABCD → CD AB</code>, <code>uint64 0x0123456789ABCDEF → EF CD AB 89 67 45 23 01</code>.</p>
<p class="pitfall">⚠️ Why it corrupts files. Writing that int with <code>fwrite</code> and dumping the file gives <code>7856 3412</code> on disk. Read those same four bytes back on a big-endian machine and you get <strong>0x78563412 = 2 018 915 346</strong> instead of <strong>0x12345678 = 305 419 896</strong> — measured, not guessed. Connects to PRF192 Chapter 10 (<code>fwrite</code> on binary files) and to Chapter 6 (external memory): a binary file is only portable if the byte order is fixed by agreement, which is exactly why network protocols mandate big-endian ("network byte order").</p>`,
        `<p class="y-chinh">🎯 Loại lệnh cơ bản nhất, trình bày trên một tập lệnh THẬT. Một lệnh chuyển dữ liệu phải chỉ rõ ba thứ: <strong>nguồn ở đâu, đích ở đâu, và chuyển bao nhiêu dữ liệu</strong> — và người thiết kế EAS/390 chọn nhét cả ba vào <em>MÃ LỆNH</em> thay vì vào các trường toán hạng.</p>
<table>
<tr><th>Ký hiệu</th><th>Tên</th><th>Số bit</th><th>Mô tả trên slide</th></tr>
<tr><td>L</td><td>Load</td><td>32</td><td>Chuyển từ bộ nhớ vào thanh ghi</td></tr>
<tr><td>LH</td><td>Load Halfword</td><td>16</td><td>Chuyển từ bộ nhớ vào thanh ghi</td></tr>
<tr><td>LR</td><td>Load</td><td>32</td><td>Chuyển từ thanh ghi sang thanh ghi</td></tr>
<tr><td>LER</td><td>Load (short)</td><td>32</td><td>Thanh ghi dấu chấm động → thanh ghi dấu chấm động</td></tr>
<tr><td>LE</td><td>Load (short)</td><td>32</td><td>Bộ nhớ → thanh ghi dấu chấm động</td></tr>
<tr><td>LDR</td><td>Load (long)</td><td>64</td><td>Thanh ghi dấu chấm động → thanh ghi dấu chấm động</td></tr>
<tr><td>LD</td><td>Load (long)</td><td>64</td><td>Bộ nhớ → thanh ghi dấu chấm động</td></tr>
<tr><td>ST</td><td>Store</td><td>32</td><td>Thanh ghi → bộ nhớ</td></tr>
<tr><td>STH</td><td>Store Halfword</td><td>16</td><td>Thanh ghi → bộ nhớ</td></tr>
<tr><td>STC</td><td>Store Character</td><td>8</td><td>Thanh ghi → bộ nhớ</td></tr>
<tr><td>STE</td><td>Store (short)</td><td>32</td><td>Thanh ghi dấu chấm động → bộ nhớ</td></tr>
<tr><td>STD</td><td>Store (long)</td><td>64</td><td>Thanh ghi dấu chấm động → bộ nhớ</td></tr>
</table>
<ul>
<li><strong>Bộ ký hiệu là một NGỮ PHÁP, không phải mười hai cái tên ngẫu nhiên.</strong> <code>L</code> = nạp (bộ nhớ → thanh ghi), <code>ST</code> = lưu (thanh ghi → bộ nhớ); hậu tố <code>R</code> = nguồn là <em>thanh ghi</em>, <code>H</code> = nửa từ (16 bit), <code>C</code> = ký tự (8 bit), <code>E</code> = số thực ngắn (32 bit), <code>D</code> = số thực dài (64 bit). Có năm luật đó là giải mã được mọi dòng.</li>
<li><strong>Mười hai mã lệnh thay vì một MOV — và đó chính là điểm thiết kế.</strong> Nhét "bao nhiêu bit" và "từ đâu" vào MÃ LỆNH khiến mỗi lệnh <em>NGẮN</em> (không có trường kích thước, không có trường kiểu để giải mã). Cái giá là bảng mã lệnh phình ra. Chương 11 (chế độ địa chỉ & khuôn dạng lệnh) chính là bàn về cuộc đánh đổi này: thông tin đặt trong mã lệnh hay đặt trong trường toán hạng.</li>
<li><strong>Để ý x86 đi hướng NGƯỢC LẠI.</strong> Table 13.3(a) ở slide 20 chỉ có một <code>MOV Dest, Source</code> cùng <code>XCHG</code>, <code>PUSH</code>, <code>POP</code> — kích thước suy ra từ <em>TÊN THANH GHI</em> được nêu (AL / AX / EAX / RAX). Không cách nào sai cả; đó là hai điểm trên cùng một đường cong đánh đổi.</li>
<li><strong>Bộ xử lý thật sự làm gì</strong> (Table 13.4, slide 23): nếu có dính bộ nhớ thì nó phải xác định địa chỉ, chuyển địa chỉ ảo sang địa chỉ thật, tra cache, rồi mới khởi động đọc/ghi. Một lệnh LOAD "đơn giản" kéo theo cả Chương 4–5 (cache) lẫn Chương 8 (hỗ trợ hệ điều hành, phân trang).</li>
</ul>
<p class="nhan">📐 <strong>THỨ TỰ BYTE (endianness) — thứ mà mọi lệnh LOAD/STORE âm thầm quyết định.</strong> Một lệnh lưu 32 bit phải đặt bốn byte vào bốn địa chỉ liên tiếp. Byte nào đi trước? Deck này trả lời ở slide 18–19 (ARM Data Types và <em>Figure 13.5 ARM Endian Support — Word Load/Store with E-Bit</em>), tức thuộc NỬA ĐẦU chương; đặt ở đây vì đây là slide mà các từ thật sự di chuyển.</p>
<table>
<tr><th>Địa chỉ</th><th>Big-endian (đầu to)</th><th>Little-endian (đầu nhỏ)</th></tr>
<tr><td>100</td><td>12</td><td>78</td></tr>
<tr><td>101</td><td>34</td><td>56</td></tr>
<tr><td>102</td><td>56</td><td>34</td></tr>
<tr><td>103</td><td>78</td><td>12</td></tr>
</table>
<pre>#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
int main(void) {
    uint32_t x = 0x12345678u;
    unsigned char *p = (unsigned char *)&amp;x;   /* nhìn một int như 4 byte thô */
    for (int i = 0; i &lt; 4; i++)
        printf("  &amp;x + %d  -&gt;  0x%02X\\n", i, p[i]);
    return 0;
}</pre>
<p class="dap-an">✅ Chạy thật (<code>cc -Wall</code>, Apple M1 Max, arm64): <code>&amp;x+0 → 0x78</code>, <code>&amp;x+1 → 0x56</code>, <code>&amp;x+2 → 0x34</code>, <code>&amp;x+3 → 0x12</code>. Byte có trọng số <em>THẤP NHẤT</em> nằm ở địa chỉ <em>THẤP NHẤT</em> ⇒ <strong>máy này LITTLE-ENDIAN</strong>. Cùng chương trình: <code>uint16 0xABCD → CD AB</code>, <code>uint64 0x0123456789ABCDEF → EF CD AB 89 67 45 23 01</code>.</p>
<p class="pitfall">⚠️ Vì sao nó làm HỎNG TỆP. Ghi đúng cái int đó bằng <code>fwrite</code> rồi dump tệp ra thì trên đĩa là <code>7856 3412</code>. Đọc đúng bốn byte ấy trên một máy big-endian sẽ ra <strong>0x78563412 = 2.018.915.346</strong> thay vì <strong>0x12345678 = 305.419.896</strong> — đo thật, không đoán. Nối sang PRF192 Chương 10 (<code>fwrite</code> tệp nhị phân) và Chương 6 (bộ nhớ ngoài): một tệp nhị phân chỉ di chuyển được giữa hai máy nếu thứ tự byte được QUY ƯỚC CỐ ĐỊNH — đó đúng là lý do các giao thức mạng bắt buộc big-endian ("network byte order").</p>`],

      [26, 'Arithmetic',
        `<p class="y-chinh">🎯 Every machine provides <strong>add, subtract, multiply, divide</strong>, at minimum for signed integer (fixed-point) numbers, and usually for floating-point and packed decimal as well. The slide then adds a second, quieter family: <strong>single-operand</strong> arithmetic.</p>
<ul>
<li><strong>The four single-operand instructions on the slide.</strong> <em>Absolute</em> — take the absolute value of the operand. <em>Negate</em> — negate the operand. <em>Increment</em> — add 1 to the operand. <em>Decrement</em> — subtract 1 from the operand. Each of these could be written with a two-operand instruction plus a constant, so why dedicate opcodes to them? Because they are the most frequent operations in compiled code (loop counters, sign handling), and a one-operand instruction is shorter and faster.</li>
<li><strong>Why "signed integer (fixed-point)" is the baseline and the rest is optional.</strong> Integer add/sub is a handful of gates (Chapter 9, the ripple-carry and carry-lookahead adders). Floating point needs exponent alignment, normalisation and rounding; packed decimal needs BCD correction. Cheap machines give you the first and emulate the rest in software.</li>
<li><strong>What the processor does</strong> (Table 13.4, slide 23, row "Arithmetic"): it <em>may</em> involve data transfer before and/or after, it performs the function in the <strong>ALU</strong>, and then — the part students forget — it <strong>sets condition codes and flags</strong>. That last step is the bridge to the whole transfer-of-control half of this chapter: arithmetic is what <em>produces</em> the flags that conditional branches <em>read</em>.</li>
<li><strong>Read Table 13.3(b) on slide 20 next to this.</strong> x86 has <code>ADD</code>, <code>SUB</code>, <code>MUL</code>/<code>IMUL</code> (unsigned/signed), <code>DIV</code>/<code>IDIV</code>, <code>INC</code>, <code>DEC</code>, <code>NEG</code>, <code>CMP</code>. Two details are exam-grade: signed and unsigned multiply/divide are <em>different opcodes</em> (because twos-complement addition is sign-agnostic but multiplication is not), and <code>INC</code>/<code>DEC</code> deliberately <strong>preserve the CF flag</strong> while <code>ADD</code>/<code>SUB</code> set it — that is what lets you increment a loop counter in the middle of a multi-word addition without destroying the carry chain.</li>
<li><strong><code>CMP</code> is arithmetic that throws its answer away.</strong> The slide-20 description says it plainly: "Compares the two operands by subtracting the second from the first and sets the status flags according to the results." The difference is never stored. <code>CMP</code> exists only to manufacture flags for the next conditional jump.</li>
</ul>
<p class="pitfall">⚠️ Exam trap on <em>Negate</em>. In n-bit twos complement the range is asymmetric: for 8 bits it is −128…+127. <code>NEG(−128)</code> would have to be +128, which does not exist, so the result is −128 again and the overflow flag is set. Same for <em>Absolute</em>. A question asking "is <code>abs(x)</code> always non-negative in hardware?" has the answer <strong>no</strong>, for exactly one input.</p>
<p class="meo">💡 Remember the row from Table 13.4 as a four-beat rhythm for <em>every</em> arithmetic instruction: <strong>fetch operands → ALU → write result → set flags</strong>. Three quarters of the exam questions in this chapter are about the fourth beat.</p>`,
        `<p class="y-chinh">🎯 Máy nào cũng cung cấp <strong>cộng, trừ, nhân, chia</strong>, tối thiểu cho số nguyên có dấu (dấu chấm tĩnh), và thường có cả cho dấu chấm động lẫn thập phân nén. Rồi slide thêm một họ thứ hai, lặng lẽ hơn: phép toán <strong>MỘT TOÁN HẠNG</strong>.</p>
<ul>
<li><strong>Bốn lệnh một toán hạng slide nêu.</strong> <em>Absolute</em> — lấy trị tuyệt đối của toán hạng. <em>Negate</em> — đổi dấu toán hạng. <em>Increment</em> — cộng 1 vào toán hạng. <em>Decrement</em> — trừ 1 khỏi toán hạng. Cái nào cũng có thể viết bằng một lệnh hai toán hạng cộng một hằng số, vậy sao còn dành hẳn mã lệnh riêng? Vì đó là những phép xuất hiện DÀY ĐẶC nhất trong mã do trình biên dịch sinh (biến đếm vòng lặp, xử lý dấu), mà lệnh một toán hạng thì NGẮN hơn và NHANH hơn.</li>
<li><strong>Vì sao "số nguyên có dấu" là mức nền còn phần còn lại là tuỳ chọn.</strong> Cộng/trừ số nguyên chỉ là một nhúm cổng logic (Chương 9, bộ cộng nối tiếp và bộ cộng nhìn trước số nhớ). Dấu chấm động cần căn phần mũ, chuẩn hoá, làm tròn; thập phân nén cần hiệu chỉnh BCD. Máy rẻ cho bạn cái đầu tiên và mô phỏng phần còn lại bằng phần mềm.</li>
<li><strong>Bộ xử lý làm gì</strong> (Table 13.4, slide 23, dòng "Arithmetic"): nó <em>CÓ THỂ</em> phải chuyển dữ liệu trước và/hoặc sau, nó thực hiện phép toán trong <strong>ALU</strong>, rồi — phần sinh viên hay quên — nó <strong>ĐẶT MÃ ĐIỀU KIỆN VÀ CÁC CỜ</strong>. Bước cuối đó chính là cây cầu sang toàn bộ nửa "chuyển điều khiển" của chương: phép số học là thứ <em>SINH RA</em> cờ mà lệnh rẽ nhánh có điều kiện <em>ĐỌC</em>.</li>
<li><strong>Đọc Table 13.3(b) ở slide 20 kèm slide này.</strong> x86 có <code>ADD</code>, <code>SUB</code>, <code>MUL</code>/<code>IMUL</code> (không dấu/có dấu), <code>DIV</code>/<code>IDIV</code>, <code>INC</code>, <code>DEC</code>, <code>NEG</code>, <code>CMP</code>. Hai chi tiết đáng điểm: nhân/chia có dấu và không dấu là <em>HAI MÃ LỆNH KHÁC NHAU</em> (vì cộng bù hai không phân biệt dấu, nhưng nhân thì có), và <code>INC</code>/<code>DEC</code> CỐ Ý <strong>GIỮ NGUYÊN cờ CF</strong> trong khi <code>ADD</code>/<code>SUB</code> thì đặt lại — chính điều đó cho phép tăng biến đếm vòng lặp giữa một phép cộng nhiều từ mà không phá mất chuỗi số nhớ.</li>
<li><strong><code>CMP</code> là phép số học VỨT BỎ kết quả.</strong> Mô tả ở slide 20 nói thẳng: "So sánh hai toán hạng bằng cách lấy toán hạng thứ nhất TRỪ toán hạng thứ hai rồi đặt các cờ trạng thái theo kết quả." Hiệu số không bao giờ được ghi đi đâu cả. <code>CMP</code> tồn tại chỉ để CHẾ RA CỜ cho lệnh nhảy có điều kiện ngay sau nó.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi ở <em>Negate</em>. Trong bù hai n bit, dải giá trị KHÔNG đối xứng: 8 bit là −128…+127. <code>NEG(−128)</code> lẽ ra phải là +128, mà +128 không tồn tại, nên kết quả lại là −128 và cờ tràn được bật. <em>Absolute</em> cũng vậy. Câu hỏi "trong phần cứng, <code>abs(x)</code> có luôn không âm không?" có đáp án là <strong>KHÔNG</strong>, đúng tại một giá trị đầu vào.</p>
<p class="meo">💡 Nhớ dòng của Table 13.4 thành một nhịp bốn phách cho <em>MỌI</em> lệnh số học: <strong>lấy toán hạng → ALU → ghi kết quả → đặt cờ</strong>. Ba phần tư câu hỏi thi của chương này rơi vào phách thứ tư.</p>`],

      [27, 'Table 13.6 — Basic Logical Operations',
        `<p class="y-chinh">🎯 The truth table for the five bitwise operations every instruction set provides. This is Chapter 9 (digital logic) reappearing as <em>instructions</em>: the same gates, now with opcodes.</p>
<table>
<tr><th>P</th><th>Q</th><th>NOT P</th><th>P AND Q</th><th>P OR Q</th><th>P XOR Q</th><th>P = Q</th></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
</table>
<p class="dap-an">✅ Regenerated by a C program on the machine this lesson was written on (<code>cc -Wall</code>, printing <code>!p</code>, <code>p&amp;&amp;q</code>, <code>p||q</code>, <code>p^q</code>, <code>p==q</code> for all four input pairs): output matches the slide row for row. The slide table is correct.</p>
<ul>
<li><strong>The last column is XNOR, and the slide calls it "P = Q".</strong> That naming is deliberate: equality <em>is</em> the complement of XOR. It is why a comparator circuit is a row of XNOR gates feeding an AND — and why <code>a ^ b == 0</code> is a valid "are these equal" test.</li>
<li><strong>These are BITWISE, applied to all n bits in parallel.</strong> Slide 14 defined logical data as "an n-bit unit consisting of n 1-bit items". A 32-bit AND is 32 independent AND gates working simultaneously — which is also the cheapest form of parallelism in the whole machine, and the seed of the SIMD idea on slides 43–45.</li>
<li><strong>The three classic uses, all exam favourites.</strong> <em>AND = mask off</em> (clear the bits where the mask is 0). <em>OR = set</em> (force bits to 1 where the mask is 1). <em>XOR = toggle</em> (flip bits where the mask is 1, leave the rest). Memorise that triple; nearly every bit-manipulation question is one of the three.</li>
<li><strong>x86 adds a sixth: <code>TEST</code>.</strong> Slide 21, Table 13.3(d): "Performs a bitwise AND on the two operands and sets the S, Z and P status flags. <em>The operands are unchanged.</em>" <code>TEST</code> is to <code>AND</code> exactly what <code>CMP</code> is to <code>SUB</code> — do the work, keep only the flags. This is how a program asks "is bit 5 set?" without destroying the value.</li>
</ul>
<p class="nhan">📐 Worked example — the exact task slide 14 gave as motivation: <em>extract the rightmost 4 bits of each byte</em> (converting IRA/ASCII digits to packed decimal). Take the ASCII character <code>'7'</code> = 0x37 = <code>00110111</code>.</p>
<table>
<tr><th>Step</th><th>Operation</th><th>Binary</th><th>Hex</th></tr>
<tr><td>1</td><td>Input: ASCII <code>'7'</code></td><td>0011 0111</td><td>0x37</td></tr>
<tr><td>2</td><td>Mask</td><td>0000 1111</td><td>0x0F</td></tr>
<tr><td>3</td><td>AND</td><td>0000 0111</td><td>0x07</td></tr>
</table>
<p class="dap-an">✅ Answer: <code>'7' AND 0x0F = 7</code>, the numeric value. The same mask works for every ASCII digit because 0x30–0x39 all share the high nibble 0011. That one AND is the whole "character to number" conversion in hardware.</p>
<p class="pitfall">⚠️ Do not mix up <strong>bitwise</strong> and <strong>logical</strong> operators. In C, <code>5 &amp; 2</code> is <code>0000 0101 AND 0000 0010 = 0</code>, but <code>5 &amp;&amp; 2</code> is <code>true &amp;&amp; true = 1</code>. The machine instruction on this slide is the <em>bitwise</em> one; the <code>&amp;&amp;</code> version does not exist as a single instruction at all — the compiler builds it from a comparison plus a conditional branch.</p>`,
        `<p class="y-chinh">🎯 Bảng chân trị cho năm phép logic theo bit mà tập lệnh nào cũng có. Đây là Chương 9 (logic số) quay lại dưới dạng <em>LỆNH</em>: vẫn những cổng ấy, giờ có mã lệnh.</p>
<table>
<tr><th>P</th><th>Q</th><th>NOT P</th><th>P AND Q</th><th>P OR Q</th><th>P XOR Q</th><th>P = Q</th></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
</table>
<p class="dap-an">✅ Đã SINH LẠI bằng một chương trình C trên chính máy viết bài (<code>cc -Wall</code>, in <code>!p</code>, <code>p&amp;&amp;q</code>, <code>p||q</code>, <code>p^q</code>, <code>p==q</code> cho cả bốn cặp đầu vào): kết quả khớp slide từng dòng một. Bảng trên slide ĐÚNG.</p>
<ul>
<li><strong>Cột cuối chính là XNOR, và slide gọi nó là "P = Q".</strong> Cách đặt tên đó có chủ ý: phép BẰNG NHAU <em>CHÍNH LÀ</em> phủ định của XOR. Đó là lý do mạch so sánh là một hàng cổng XNOR đổ vào một cổng AND — và là lý do <code>a ^ b == 0</code> là phép kiểm "hai cái này có bằng nhau không" hợp lệ.</li>
<li><strong>Đây là phép THEO BIT, áp lên cả n bit CÙNG LÚC.</strong> Slide 14 định nghĩa dữ liệu logic là "một đơn vị n bit gồm n mục dữ liệu 1 bit". Một phép AND 32 bit là 32 cổng AND độc lập chạy đồng thời — cũng là hình thức song song RẺ NHẤT trong cả cái máy, và là mầm mống của ý tưởng SIMD ở slide 43–45.</li>
<li><strong>Ba công dụng kinh điển, đề thi rất chuộng.</strong> <em>AND = CHE ĐI</em> (xoá những bit mà mặt nạ bằng 0). <em>OR = BẬT LÊN</em> (ép bit thành 1 ở chỗ mặt nạ bằng 1). <em>XOR = ĐẢO</em> (lật những bit mà mặt nạ bằng 1, phần còn lại giữ nguyên). Thuộc bộ ba đó đi; gần như mọi câu hỏi thao tác bit đều là một trong ba.</li>
<li><strong>x86 thêm cái thứ sáu: <code>TEST</code>.</strong> Slide 21, Table 13.3(d): "Thực hiện AND theo bit trên hai toán hạng và đặt các cờ S, Z, P. <em>Hai toán hạng KHÔNG đổi.</em>" <code>TEST</code> đối với <code>AND</code> đúng như <code>CMP</code> đối với <code>SUB</code> — làm phép tính, chỉ giữ lại cờ. Đây là cách chương trình hỏi "bit số 5 có đang bật không?" mà không phá mất giá trị.</li>
</ul>
<p class="nhan">📐 Ví dụ giải trọn — đúng việc mà slide 14 nêu làm động cơ: <em>rút 4 bit phải cùng của mỗi byte</em> (đổi chữ số IRA/ASCII sang thập phân nén). Lấy ký tự ASCII <code>'7'</code> = 0x37 = <code>00110111</code>.</p>
<table>
<tr><th>Bước</th><th>Phép toán</th><th>Nhị phân</th><th>Thập lục</th></tr>
<tr><td>1</td><td>Đầu vào: ASCII <code>'7'</code></td><td>0011 0111</td><td>0x37</td></tr>
<tr><td>2</td><td>Mặt nạ</td><td>0000 1111</td><td>0x0F</td></tr>
<tr><td>3</td><td>AND</td><td>0000 0111</td><td>0x07</td></tr>
</table>
<p class="dap-an">✅ Đáp án: <code>'7' AND 0x0F = 7</code>, đúng giá trị số. Cùng mặt nạ đó dùng được cho MỌI chữ số ASCII vì 0x30–0x39 đều chung nửa byte cao 0011. Một phép AND đó chính là toàn bộ việc "đổi ký tự sang số" ở mức phần cứng.</p>
<p class="pitfall">⚠️ Đừng lẫn phép <strong>THEO BIT</strong> với phép <strong>LOGIC</strong>. Trong C, <code>5 &amp; 2</code> là <code>0000 0101 AND 0000 0010 = 0</code>, còn <code>5 &amp;&amp; 2</code> là <code>đúng &amp;&amp; đúng = 1</code>. Lệnh máy trên slide này là loại <em>THEO BIT</em>; bản <code>&amp;&amp;</code> hoàn toàn KHÔNG tồn tại như một lệnh đơn — trình biên dịch dựng nó từ một phép so sánh cộng một lệnh rẽ nhánh có điều kiện.</p>`],

      [28, 'Figure 13.6 — Shift and Rotate Operations',
        `<p class="y-chinh">🎯 Six little diagrams, and every one of them is a different answer to the same question: <strong>when bits move sideways, what comes in at the empty end, and what happens to the bit that falls out?</strong></p>
<table>
<tr><th>Diagram</th><th>Operation</th><th>What enters</th><th>What leaves</th></tr>
<tr><td>(a)</td><td>Logical right shift</td><td>A <strong>0</strong> is fed into the leftmost (most significant) bit</td><td>The rightmost bit falls out (to the carry flag)</td></tr>
<tr><td>(b)</td><td>Logical left shift</td><td>A <strong>0</strong> is fed into the rightmost bit</td><td>The leftmost bit falls out</td></tr>
<tr><td>(c)</td><td>Arithmetic right shift</td><td>The <strong>sign bit S is copied</strong> into itself and shifted right — the sign is preserved</td><td>The rightmost bit falls out</td></tr>
<tr><td>(d)</td><td>Arithmetic left shift</td><td>A <strong>0</strong> enters at the right; <strong>S stays put</strong> and only the magnitude bits shift</td><td>The bit next to S falls out</td></tr>
<tr><td>(e)</td><td>Right rotate</td><td>The bit that falls off the right <strong>wraps around</strong> into the left</td><td>Nothing is lost</td></tr>
<tr><td>(f)</td><td>Left rotate</td><td>The bit that falls off the left <strong>wraps around</strong> into the right</td><td>Nothing is lost</td></tr>
</table>
<ul>
<li><strong>The whole figure reduces to two questions.</strong> (1) Is the vacated position filled with a 0, with the sign, or with the bit that fell off the other end? That distinguishes logical / arithmetic / rotate. (2) Is the sign bit part of the shift or excluded from it? That distinguishes logical from arithmetic.</li>
<li><strong>Why arithmetic shifts exist at all.</strong> A right shift by k divides by 2<sup>k</sup>; a left shift by k multiplies by 2<sup>k</sup>. For an <em>unsigned</em> value the logical shift already does this. For a <em>signed</em> twos-complement value, a logical right shift would drag a 0 into the sign position and turn a negative number positive — so the arithmetic version copies the sign instead. That is the entire reason there are two right shifts.</li>
<li><strong>Rotate loses nothing, and that is its job.</strong> Rotation is a permutation of the bits, so it is reversible: rotate left 3 then rotate right 3 and you are back where you started. Shifting is <em>not</em> reversible — the bits that fall off are gone. This is why cryptographic and hashing routines are built from rotates, not shifts.</li>
<li><strong>The carry flag is the seventh member of the family.</strong> Table 13.3(c) on slide 21 says for every one of <code>SAL</code>, <code>SAR</code>, <code>SHR</code>, <code>ROL</code>, <code>ROR</code>: "the CF flag is loaded with the last bit shifted out". And x86 adds <code>RCL</code>/<code>RCR</code>, which rotate <em>through</em> CF — treating the carry flag as a one-bit extension of the register. That is how you shift a 64-bit value on a 32-bit machine: shift the low half, then rotate the high half through the carry.</li>
</ul>
<p class="meo">💡 Three-word mnemonic for the three families: <strong>logical = zero in</strong>, <strong>arithmetic = sign in</strong>, <strong>rotate = itself in</strong>. Say it when a shift question appears and you will never pick the wrong fill bit.</p>
<p class="pitfall">⚠️ The arithmetic <em>left</em> shift (d) is the odd one out and is heavily tested. Notice on the figure that <strong>S does not move</strong>: the sign bit is held fixed while everything to its right marches left. So the result keeps the original sign <em>even when the value has overflowed</em>. Slide 29 gives the concrete case; make sure you can explain why the answer looks wrong arithmetically but is right by the rule.</p>`,
        `<p class="y-chinh">🎯 Sáu sơ đồ nhỏ, và mỗi cái là một câu trả lời khác nhau cho cùng một câu hỏi: <strong>khi các bit chạy ngang, cái gì chui vào ở đầu bị trống, và bit rơi ra khỏi đầu kia đi đâu?</strong></p>
<table>
<tr><th>Sơ đồ</th><th>Phép toán</th><th>Cái gì CHUI VÀO</th><th>Cái gì RA ĐI</th></tr>
<tr><td>(a)</td><td>Dịch phải logic</td><td>Một số <strong>0</strong> được nạp vào bit trái cùng (trọng số cao nhất)</td><td>Bit phải cùng rơi ra (vào cờ nhớ)</td></tr>
<tr><td>(b)</td><td>Dịch trái logic</td><td>Một số <strong>0</strong> được nạp vào bit phải cùng</td><td>Bit trái cùng rơi ra</td></tr>
<tr><td>(c)</td><td>Dịch phải số học</td><td><strong>Bit dấu S được CHÉP LẠI</strong> vào chính nó rồi dịch sang phải — dấu được giữ</td><td>Bit phải cùng rơi ra</td></tr>
<tr><td>(d)</td><td>Dịch trái số học</td><td>Một số <strong>0</strong> vào từ bên phải; <strong>S ĐỨNG YÊN</strong>, chỉ các bit độ lớn dịch đi</td><td>Bit nằm sát S rơi ra</td></tr>
<tr><td>(e)</td><td>Quay phải</td><td>Bit rơi khỏi đầu phải <strong>VÒNG TRỞ LẠI</strong> vào đầu trái</td><td>Không mất gì cả</td></tr>
<tr><td>(f)</td><td>Quay trái</td><td>Bit rơi khỏi đầu trái <strong>VÒNG TRỞ LẠI</strong> vào đầu phải</td><td>Không mất gì cả</td></tr>
</table>
<ul>
<li><strong>Cả hình rút về hai câu hỏi.</strong> (1) Chỗ trống được lấp bằng số 0, bằng bit dấu, hay bằng chính bit vừa rơi ra ở đầu kia? Đó là chỗ phân biệt logic / số học / quay. (2) Bit dấu có tham gia vào phép dịch hay bị loại ra? Đó là chỗ phân biệt logic với số học.</li>
<li><strong>Vì sao phải có dịch SỐ HỌC.</strong> Dịch phải k bit là chia cho 2<sup>k</sup>; dịch trái k bit là nhân với 2<sup>k</sup>. Với số <em>KHÔNG DẤU</em>, dịch logic đã làm đúng việc đó. Với số <em>CÓ DẤU</em> bù hai, dịch phải logic sẽ lôi một số 0 vào vị trí bit dấu và biến số âm thành số dương — nên bản số học chép bit dấu vào thay thế. Đó là toàn bộ lý do tồn tại HAI phép dịch phải.</li>
<li><strong>Quay không mất gì, và đó chính là việc của nó.</strong> Quay là một phép hoán vị các bit nên nó ĐẢO NGƯỢC ĐƯỢC: quay trái 3 rồi quay phải 3 là về đúng chỗ cũ. Dịch thì <em>KHÔNG</em> đảo ngược được — các bit rơi ra là mất luôn. Đó là lý do các thủ tục mã hoá và băm được dựng từ phép QUAY chứ không phải phép DỊCH.</li>
<li><strong>Cờ nhớ là thành viên thứ bảy của gia đình này.</strong> Table 13.3(c) ở slide 21 ghi cho từng lệnh <code>SAL</code>, <code>SAR</code>, <code>SHR</code>, <code>ROL</code>, <code>ROR</code>: "cờ CF được nạp bằng bit cuối cùng bị dịch ra khỏi toán hạng". Và x86 thêm <code>RCL</code>/<code>RCR</code> quay <em>XUYÊN QUA</em> CF — coi cờ nhớ như một bit nối dài của thanh ghi. Đó là cách bạn dịch một giá trị 64 bit trên máy 32 bit: dịch nửa thấp, rồi quay nửa cao xuyên qua cờ nhớ.</li>
</ul>
<p class="meo">💡 Mẹo ba chữ cho ba họ: <strong>logic = vào số 0</strong>, <strong>số học = vào bit dấu</strong>, <strong>quay = vào chính nó</strong>. Đọc câu đó mỗi khi gặp bài dịch bit thì không bao giờ chọn nhầm bit lấp chỗ trống.</p>
<p class="pitfall">⚠️ Dịch <em>TRÁI</em> số học (d) là đứa lạc loài và bị hỏi rất nhiều. Nhìn kỹ trên hình: <strong>S KHÔNG DI CHUYỂN</strong> — bit dấu bị giữ chặt trong khi mọi thứ bên phải nó tiến sang trái. Vì vậy kết quả GIỮ NGUYÊN dấu ban đầu <em>kể cả khi giá trị đã tràn</em>. Slide 29 cho ca cụ thể; hãy chắc là bạn giải thích được vì sao đáp án trông sai về mặt số học mà vẫn đúng theo quy tắc.</p>`],

      [29, 'Table 13.7 — Examples of Shift and Rotate Operations',
        `<p class="y-chinh">🎯 One 8-bit input, <strong>10100110</strong>, put through all six operations of Figure 13.6 with a shift count of 3. This is the single most likely calculation to appear on your exam, so it is worked here bit by bit — and then <em>verified by running it</em>.</p>
<table>
<tr><th>Input</th><th>Operation</th><th>Result (slide)</th><th>How the bits move</th></tr>
<tr><td>10100110</td><td>Logical right shift (3 bits)</td><td>00010100</td><td>Drop the low 3 bits (110), push in three 0s at the left: <strong>000</strong>+10100</td></tr>
<tr><td>10100110</td><td>Logical left shift (3 bits)</td><td>00110000</td><td>Drop the high 3 bits (101), push in three 0s at the right: 00110+<strong>000</strong></td></tr>
<tr><td>10100110</td><td>Arithmetic right shift (3 bits)</td><td>11110100</td><td>Same as (a) but the fill is the sign bit 1: <strong>111</strong>+10100</td></tr>
<tr><td>10100110</td><td>Arithmetic left shift (3 bits)</td><td>10110000</td><td>Sign bit 1 held fixed; the 7 magnitude bits 0100110 shift left 3 → 0110000; result = <strong>1</strong>+0110000</td></tr>
<tr><td>10100110</td><td>Right rotate (3 bits)</td><td>11010100</td><td>The 3 bits that fall off the right (110) wrap to the front: <strong>110</strong>+10100</td></tr>
<tr><td>10100110</td><td>Left rotate (3 bits)</td><td>00110101</td><td>The 3 bits that fall off the left (101) wrap to the back: 00110+<strong>101</strong></td></tr>
</table>
<pre>uint8_t x = 0xA6;                                  /* 10100110 */
x &gt;&gt; 3                                             /* dich phai logic   */
(uint8_t)(x &lt;&lt; 3)                                  /* dich trai logic   */
(uint8_t)(((int8_t)x) &gt;&gt; 3)                        /* dich phai so hoc  */
(uint8_t)((x &amp; 0x80) | ((x &lt;&lt; 3) &amp; 0x7F))          /* dich trai so hoc  */
(uint8_t)((x &gt;&gt; 3) | (x &lt;&lt; 5))                     /* quay phai 3       */
(uint8_t)((x &lt;&lt; 3) | (x &gt;&gt; 5))                     /* quay trai 3       */</pre>
<p class="dap-an">✅ Real run (<code>cc -Wall</code>, Apple M1 Max): <code>00010100</code> · <code>00110000</code> · <code>11110100</code> · <code>10110000</code> · <code>11010100</code> · <code>00110101</code>. <strong>All six match Table 13.7 exactly.</strong> The slide is correct.</p>
<ul>
<li><strong>Read the input as a signed number and the arithmetic rows come alive.</strong> <code>10100110</code> as unsigned is 166; as 8-bit twos complement it is <strong>−90</strong>. Arithmetic right shift 3 gives <code>11110100</code> = <strong>−12</strong>, and −90 ÷ 8 = −11,25. So the shift performed division <em>rounding towards minus infinity</em>.</li>
<li><strong>Measured pitfall you can be caught on.</strong> The same program prints <code>(−90) &gt;&gt; 3 = −12</code> but <code>−90 / 8 = −11</code>. C integer division truncates <em>towards zero</em>; the arithmetic shift floors <em>towards −∞</em>. They disagree for every negative number that is not an exact multiple. "Shift right instead of dividing" is a valid optimisation for unsigned values only.</li>
<li><strong>The arithmetic left shift is the trap row.</strong> <code>10110000</code> as signed is <strong>−80</strong>, but −90 × 8 = −720, which does not fit in 8 bits at all. The instruction kept the sign (per rule (d) of Figure 13.6) and produced a number that is arithmetically meaningless. A real processor signals this by setting the <strong>overflow flag</strong> — see Table 13.8 on slide 41. The result is not "wrong"; the rule was applied faithfully and the flag is what tells you not to trust it.</li>
<li><strong>Rotates are pure re-arrangement, and you can see it.</strong> Count the 1s: the input <code>10100110</code> has four. Both rotate results (<code>11010100</code>, <code>00110101</code>) also have four. Every shift result has fewer or differently placed ones. That popcount check is a 3-second way to catch a rotate you did wrong.</li>
</ul>
<p class="meo">💡 Exam technique for any rotate: <strong>cut, do not compute</strong>. Left rotate by k = cut the leftmost k bits off and glue them onto the right end. Right rotate by k = cut the rightmost k bits and glue them onto the left. For <code>10100110</code> rotate left 3: cut <code>101</code> | <code>00110</code> → <code>00110</code>+<code>101</code> = <code>00110101</code>. Done in one move, no arithmetic.</p>`,
        `<p class="y-chinh">🎯 Một đầu vào 8 bit, <strong>10100110</strong>, cho chạy qua cả sáu phép của Figure 13.6 với số bit dịch bằng 3. Đây là phép tính CÓ XÁC SUẤT RA ĐỀ CAO NHẤT của chương, nên ở đây giải từng bit một — rồi <em>chạy thật để kiểm</em>.</p>
<table>
<tr><th>Đầu vào</th><th>Phép toán</th><th>Kết quả (slide)</th><th>Các bit di chuyển thế nào</th></tr>
<tr><td>10100110</td><td>Dịch phải logic (3 bit)</td><td>00010100</td><td>Bỏ 3 bit thấp (110), đẩy ba số 0 vào bên trái: <strong>000</strong>+10100</td></tr>
<tr><td>10100110</td><td>Dịch trái logic (3 bit)</td><td>00110000</td><td>Bỏ 3 bit cao (101), đẩy ba số 0 vào bên phải: 00110+<strong>000</strong></td></tr>
<tr><td>10100110</td><td>Dịch phải số học (3 bit)</td><td>11110100</td><td>Như (a) nhưng chỗ lấp là bit dấu 1: <strong>111</strong>+10100</td></tr>
<tr><td>10100110</td><td>Dịch trái số học (3 bit)</td><td>10110000</td><td>Bit dấu 1 giữ chặt; 7 bit độ lớn 0100110 dịch trái 3 → 0110000; kết quả = <strong>1</strong>+0110000</td></tr>
<tr><td>10100110</td><td>Quay phải (3 bit)</td><td>11010100</td><td>Ba bit rơi khỏi đầu phải (110) vòng lên đầu: <strong>110</strong>+10100</td></tr>
<tr><td>10100110</td><td>Quay trái (3 bit)</td><td>00110101</td><td>Ba bit rơi khỏi đầu trái (101) vòng xuống cuối: 00110+<strong>101</strong></td></tr>
</table>
<pre>uint8_t x = 0xA6;                                  /* 10100110 */
x &gt;&gt; 3                                             /* dich phai logic   */
(uint8_t)(x &lt;&lt; 3)                                  /* dich trai logic   */
(uint8_t)(((int8_t)x) &gt;&gt; 3)                        /* dich phai so hoc  */
(uint8_t)((x &amp; 0x80) | ((x &lt;&lt; 3) &amp; 0x7F))          /* dich trai so hoc  */
(uint8_t)((x &gt;&gt; 3) | (x &lt;&lt; 5))                     /* quay phai 3       */
(uint8_t)((x &lt;&lt; 3) | (x &gt;&gt; 5))                     /* quay trai 3       */</pre>
<p class="dap-an">✅ Chạy thật (<code>cc -Wall</code>, Apple M1 Max): <code>00010100</code> · <code>00110000</code> · <code>11110100</code> · <code>10110000</code> · <code>11010100</code> · <code>00110101</code>. <strong>Cả sáu khớp TUYỆT ĐỐI với Table 13.7.</strong> Slide đúng.</p>
<ul>
<li><strong>Đọc đầu vào như số CÓ DẤU thì hai dòng số học mới sống dậy.</strong> <code>10100110</code> không dấu là 166; bù hai 8 bit là <strong>−90</strong>. Dịch phải số học 3 bit cho <code>11110100</code> = <strong>−12</strong>, mà −90 ÷ 8 = −11,25. Vậy phép dịch đã chia và <em>LÀM TRÒN XUỐNG phía âm vô cùng</em>.</li>
<li><strong>Bẫy ĐO ĐƯỢC mà bạn có thể bị bắt.</strong> Cùng chương trình in ra <code>(−90) &gt;&gt; 3 = −12</code> nhưng <code>−90 / 8 = −11</code>. Phép chia nguyên trong C cắt <em>VỀ PHÍA 0</em>; dịch phải số học làm tròn <em>XUỐNG −∞</em>. Hai cái lệch nhau ở MỌI số âm không chia hết. "Dịch phải thay cho chia" chỉ là tối ưu hợp lệ với số KHÔNG DẤU.</li>
<li><strong>Dòng dịch trái số học mới là cái bẫy.</strong> <code>10110000</code> đọc có dấu là <strong>−80</strong>, nhưng −90 × 8 = −720, con số này không lọt vào 8 bit. Lệnh đã giữ bit dấu (theo quy tắc (d) của Figure 13.6) và sinh ra một số vô nghĩa về mặt số học. Bộ xử lý thật báo chuyện này bằng cách bật <strong>CỜ TRÀN</strong> — xem Table 13.8 ở slide 41. Kết quả không "sai"; quy tắc đã được áp dụng trung thực, và cái CỜ mới là thứ bảo bạn đừng tin nó.</li>
<li><strong>Quay là sắp xếp lại thuần tuý, và bạn NHÌN THẤY được điều đó.</strong> Đếm số bit 1: đầu vào <code>10100110</code> có bốn. Cả hai kết quả quay (<code>11010100</code>, <code>00110101</code>) cũng có bốn. Mọi kết quả DỊCH thì số bit 1 ít đi hoặc đứng chỗ khác. Phép đếm bit 1 đó là cách 3 giây để bắt một bài quay làm sai.</li>
</ul>
<p class="meo">💡 Kỹ thuật thi cho mọi bài quay: <strong>CẮT, đừng TÍNH</strong>. Quay trái k = cắt k bit trái cùng rồi dán vào đuôi bên phải. Quay phải k = cắt k bit phải cùng rồi dán lên đầu bên trái. Với <code>10100110</code> quay trái 3: cắt <code>101</code> | <code>00110</code> → <code>00110</code>+<code>101</code> = <code>00110101</code>. Xong trong một nước, không cần phép tính nào.</p>`],

      [30, 'Conversion',
        `<p class="y-chinh">🎯 The fourth family of operations, and the shortest slide in the chapter: <strong>instructions that change the format of data, or operate on the format of data</strong>. Three bubbles, and the middle one is the key example: converting from decimal to binary.</p>
<ul>
<li><strong>What the slide says, in full.</strong> (1) Conversion instructions are those that "change the format or operate on the format of data". (2) "An example is converting from decimal to binary." (3) "An example of a more complex editing instruction is the EAS/390 Translate (TR) instruction."</li>
<li><strong>Why format conversion needs its own instruction type.</strong> Slides 12–14 listed three data formats the machine must live with at the same time: binary integers, packed decimal, and IRA/ASCII characters. Data arrives as characters (from a keyboard or a file), must be computed on as binary, and must leave as characters again. Without conversion instructions every such move is a software loop; with them it is one instruction.</li>
<li><strong>What TRANSLATE actually does — table-driven byte substitution.</strong> <code>TR</code> takes a source string and a 256-byte table, and replaces each byte <em>b</em> of the string by <code>table[b]</code>. One instruction can therefore uppercase a whole string, convert EBCDIC to ASCII, or strip invalid characters — because all three are just different 256-byte tables. This is the "complex editing instruction" the slide means, and it is a textbook CISC feature: enormous work per instruction.</li>
<li><strong>Connect to the logical operations of slide 27.</strong> The AND-with-0x0F trick converted one ASCII digit to a number. <code>TR</code> generalises it: instead of an algebraic rule, you supply a lookup table, so <em>any</em> mapping becomes possible, not just the ones a mask can express.</li>
<li><strong>Table 13.4 (slide 23) describes the processor action as</strong> "similar to arithmetic and logical; may involve <em>special logic</em> to perform conversion" — that special logic is why packed-decimal machines carry a decimal adjust unit next to the binary ALU.</li>
</ul>
<p class="nhan">📐 Worked example — the decimal-to-binary the slide names, done by hand on the string <code>"3","5","7"</code> in IRA/ASCII (0x33 0x35 0x37):</p>
<table>
<tr><th>Step</th><th>Action</th><th>Value</th></tr>
<tr><td>1</td><td>Start</td><td>n = 0</td></tr>
<tr><td>2</td><td>n = n×10 + (0x33 AND 0x0F) = 0×10 + 3</td><td>3</td></tr>
<tr><td>3</td><td>n = n×10 + (0x35 AND 0x0F) = 3×10 + 5</td><td>35</td></tr>
<tr><td>4</td><td>n = n×10 + (0x37 AND 0x0F) = 35×10 + 7</td><td>357</td></tr>
</table>
<p class="dap-an">✅ Answer: the three characters become the single binary value <strong>357 = 0000 0001 0110 0101</strong>. Notice it took a mask (logical), a multiply and an add (arithmetic) per digit — three instruction families cooperating. A machine with a dedicated convert instruction does the whole loop in one opcode, which is the entire argument for having the family on this slide.</p>
<p class="pitfall">⚠️ Do not confuse <em>conversion</em> with <em>data transfer</em>. <code>LH</code> on slide 25 moves 16 bits and changes nothing about them. A conversion instruction changes the <strong>representation</strong> while preserving the <strong>value</strong> — decimal 357 and binary 0b101100101 are the same number written two ways. If the value changes, it was arithmetic, not conversion.</p>`,
        `<p class="y-chinh">🎯 Họ phép toán thứ tư, và là slide ngắn nhất chương: <strong>những lệnh làm thay đổi ĐỊNH DẠNG dữ liệu, hoặc thao tác trên định dạng dữ liệu</strong>. Ba bong bóng, và cái ở giữa là ví dụ then chốt: đổi từ thập phân sang nhị phân.</p>
<ul>
<li><strong>Slide nói gì, đầy đủ.</strong> (1) Lệnh chuyển đổi là những lệnh "thay đổi định dạng hoặc thao tác trên định dạng của dữ liệu". (2) "Một ví dụ là đổi từ thập phân sang nhị phân." (3) "Một ví dụ về lệnh biên tập phức tạp hơn là lệnh Translate (TR) của EAS/390."</li>
<li><strong>Vì sao chuyển định dạng phải có riêng một loại lệnh.</strong> Slide 12–14 đã kể ba định dạng dữ liệu mà máy phải sống chung cùng lúc: số nguyên nhị phân, thập phân nén, và ký tự IRA/ASCII. Dữ liệu ĐẾN dưới dạng ký tự (từ bàn phím hay tệp), phải TÍNH TOÁN dưới dạng nhị phân, rồi lại phải ĐI RA dưới dạng ký tự. Không có lệnh chuyển đổi thì mỗi lần như vậy là một vòng lặp phần mềm; có nó thì chỉ một lệnh.</li>
<li><strong>TRANSLATE thật ra làm gì — thay byte theo BẢNG TRA.</strong> <code>TR</code> nhận một chuỗi nguồn và một bảng 256 byte, rồi thay mỗi byte <em>b</em> của chuỗi bằng <code>bảng[b]</code>. Nhờ vậy MỘT lệnh có thể viết hoa cả chuỗi, đổi EBCDIC sang ASCII, hoặc lọc bỏ ký tự không hợp lệ — vì cả ba chỉ là ba cái bảng 256 byte khác nhau. Đây chính là "lệnh biên tập phức tạp" mà slide nhắc, và là đặc trưng CISC kinh điển: một lệnh gánh cực nhiều việc.</li>
<li><strong>Nối với phép logic ở slide 27.</strong> Mẹo AND với 0x0F đổi được MỘT chữ số ASCII sang số. <code>TR</code> tổng quát hoá nó: thay vì một quy tắc đại số, bạn đưa vào một bảng tra, nên <em>MỌI</em> phép ánh xạ đều làm được chứ không chỉ những phép mà một mặt nạ diễn tả nổi.</li>
<li><strong>Table 13.4 (slide 23) mô tả thao tác của bộ xử lý là</strong> "tương tự số học và logic; có thể cần <em>MẠCH LOGIC ĐẶC BIỆT</em> để thực hiện chuyển đổi" — chính cái mạch đặc biệt đó là lý do máy làm thập phân nén phải mang thêm một khối hiệu chỉnh thập phân bên cạnh ALU nhị phân.</li>
</ul>
<p class="nhan">📐 Ví dụ giải trọn — đúng phép thập phân sang nhị phân slide nêu tên, làm tay trên chuỗi <code>"3","5","7"</code> dạng IRA/ASCII (0x33 0x35 0x37):</p>
<table>
<tr><th>Bước</th><th>Thao tác</th><th>Giá trị</th></tr>
<tr><td>1</td><td>Bắt đầu</td><td>n = 0</td></tr>
<tr><td>2</td><td>n = n×10 + (0x33 AND 0x0F) = 0×10 + 3</td><td>3</td></tr>
<tr><td>3</td><td>n = n×10 + (0x35 AND 0x0F) = 3×10 + 5</td><td>35</td></tr>
<tr><td>4</td><td>n = n×10 + (0x37 AND 0x0F) = 35×10 + 7</td><td>357</td></tr>
</table>
<p class="dap-an">✅ Đáp án: ba ký tự trở thành một giá trị nhị phân duy nhất <strong>357 = 0000 0001 0110 0101</strong>. Để ý rằng mỗi chữ số tốn một mặt nạ (logic), một phép nhân và một phép cộng (số học) — ba họ lệnh phối hợp. Máy nào có lệnh chuyển đổi chuyên dụng thì làm trọn vòng lặp trong một mã lệnh, và đó là toàn bộ lý lẽ cho việc có họ lệnh này trên slide.</p>
<p class="pitfall">⚠️ Đừng lẫn <em>CHUYỂN ĐỔI</em> với <em>CHUYỂN DỮ LIỆU</em>. <code>LH</code> ở slide 25 dời 16 bit đi và không đổi gì về chúng cả. Lệnh chuyển đổi thay đổi <strong>CÁCH BIỂU DIỄN</strong> mà giữ nguyên <strong>GIÁ TRỊ</strong> — thập phân 357 và nhị phân 0b101100101 là cùng một con số viết hai kiểu. Nếu GIÁ TRỊ đổi thì đó là phép số học, không phải chuyển đổi.</p>`],

      [31, 'Input/Output',
        `<p class="y-chinh">🎯 The fifth family. The slide makes one structural point — there are <strong>four approaches</strong> to I/O — and one practical point: most machines provide <strong>only a few I/O instructions</strong>, with the specific action selected by parameters, codes or command words.</p>
<table>
<tr><th>Approach on the slide</th><th>How the instruction reaches the device</th><th>Who moves the bytes</th></tr>
<tr><td>Isolated programmed I/O</td><td>Dedicated <code>IN</code>/<code>OUT</code> opcodes and a <em>separate</em> I/O address space (ports)</td><td>The processor, one word at a time</td></tr>
<tr><td>Memory-mapped programmed I/O</td><td>Ordinary <code>LOAD</code>/<code>STORE</code>; device registers live at normal memory addresses</td><td>The processor, one word at a time</td></tr>
<tr><td>DMA</td><td>The processor programs a DMA controller, then goes away</td><td>The DMA controller, a whole block</td></tr>
<tr><td>Use of an I/O processor</td><td>The processor hands over a <em>command word</em> / channel program</td><td>A dedicated I/O processor running its own program</td></tr>
</table>
<ul>
<li><strong>The list is a ladder of decreasing processor involvement.</strong> Row 1 and 2: the CPU personally carries every byte. Row 3: the CPU says "move 4 kB from disk to address X" and is interrupted only at the end. Row 4: the CPU delegates an entire program. This is precisely the progression Chapter 7 (Input/Output) develops in full — here you only need to recognise the four names and their order.</li>
<li><strong>Memory-mapped I/O costs nothing in the instruction set.</strong> If a device register is just a memory address, then <code>LOAD</code> and <code>STORE</code> are already your I/O instructions — no new opcodes at all. Slide 4 already told you this: "If memory-mapped I/O is used, this is just another main or virtual memory address." The price is that a chunk of the address space is spent on devices instead of RAM.</li>
<li><strong>Isolated I/O buys a separate address space at the cost of opcodes.</strong> x86 keeps this: Table 13.3(f) on slide 22 lists <code>IN</code>, <code>INS</code>, <code>OUT</code> — and the 16-bit port space they use is completely separate from memory. Note also the description "<code>IN Dest, Source</code> copies data from the I/O port specified by the source to a <em>register</em>", while "<code>INS</code> copies to a <em>memory location</em>" — same direction, different destination type.</li>
<li><strong>"Only a few instructions, actions specified by codes" is the real-world pattern.</strong> A disk controller supports seek, read, write, format, recalibrate and dozens of status queries. None of these are opcodes. They are <em>command words</em> written to a control register by an ordinary <code>OUT</code> or <code>STORE</code>. The instruction set stays small; the device's command set grows without touching the CPU.</li>
<li><strong>Why I/O instructions are usually privileged.</strong> Letting a user program talk to the disk controller directly would let it read any file on the machine. So these instructions are restricted — which is exactly the subject of the next slide.</li>
</ul>
<p class="pitfall">⚠️ Slide 22, Table 13.3(f), lists "<code>XOR Dest, Source</code> — copies byte, word or doubleword from the source operand to the I/O port specified with the destination operand" inside the Input/Output block. That is <strong>not</strong> the logical XOR; it is a printing error for <code>OUTS</code> (output string), the memory-source counterpart of <code>OUT</code>. The real <code>XOR</code> is in block (d) Logical on slide 21. Flag it if a question quotes that row at you.</p>`,
        `<p class="y-chinh">🎯 Họ thứ năm. Slide nêu một ý về cấu trúc — có <strong>BỐN cách tiếp cận</strong> vào/ra — và một ý thực dụng: phần lớn máy chỉ có <strong>VÀI lệnh I/O</strong>, còn hành động cụ thể thì chọn bằng tham số, mã, hoặc từ lệnh (command word).</p>
<table>
<tr><th>Cách tiếp cận trên slide</th><th>Lệnh đến được thiết bị bằng đường nào</th><th>Ai khuân byte</th></tr>
<tr><td>Isolated programmed I/O (I/O tách biệt)</td><td>Mã lệnh <code>IN</code>/<code>OUT</code> riêng và một không gian địa chỉ I/O <em>TÁCH RỜI</em> (cổng)</td><td>Bộ xử lý, mỗi lần một từ</td></tr>
<tr><td>Memory-mapped programmed I/O (ánh xạ bộ nhớ)</td><td><code>LOAD</code>/<code>STORE</code> thường; thanh ghi thiết bị nằm ở địa chỉ bộ nhớ bình thường</td><td>Bộ xử lý, mỗi lần một từ</td></tr>
<tr><td>DMA</td><td>Bộ xử lý lập trình cho bộ điều khiển DMA rồi đi làm việc khác</td><td>Bộ điều khiển DMA, nguyên một khối</td></tr>
<tr><td>Dùng bộ xử lý I/O</td><td>Bộ xử lý trao hẳn một <em>từ lệnh</em> / chương trình kênh</td><td>Một bộ xử lý I/O chuyên dụng chạy chương trình của chính nó</td></tr>
</table>
<ul>
<li><strong>Danh sách này là một cái thang GIẢM DẦN mức can dự của bộ xử lý.</strong> Dòng 1 và 2: CPU đích thân khuân từng byte. Dòng 3: CPU nói "chuyển 4 kB từ đĩa vào địa chỉ X" rồi chỉ bị ngắt khi xong. Dòng 4: CPU giao hẳn một chương trình. Đây đúng là mạch phát triển mà Chương 7 (Vào/ra) trình bày đầy đủ — ở đây bạn chỉ cần nhận ra bốn cái tên và thứ tự của chúng.</li>
<li><strong>I/O ánh xạ bộ nhớ KHÔNG tốn gì trong tập lệnh.</strong> Nếu thanh ghi thiết bị chỉ là một địa chỉ bộ nhớ thì <code>LOAD</code> và <code>STORE</code> đã sẵn là lệnh I/O của bạn — không cần thêm mã lệnh nào. Slide 4 đã nói trước điều này: "Nếu dùng I/O ánh xạ bộ nhớ thì đây chỉ là một địa chỉ bộ nhớ chính hoặc bộ nhớ ảo nữa mà thôi." Cái giá là một mảng không gian địa chỉ bị dành cho thiết bị thay vì cho RAM.</li>
<li><strong>I/O tách biệt mua được không gian địa chỉ riêng bằng cách trả giá bằng mã lệnh.</strong> x86 vẫn giữ lối này: Table 13.3(f) ở slide 22 liệt kê <code>IN</code>, <code>INS</code>, <code>OUT</code> — và không gian cổng 16 bit chúng dùng hoàn toàn tách khỏi bộ nhớ. Để ý luôn mô tả "<code>IN Dest, Source</code> chép dữ liệu từ cổng I/O nêu ở toán hạng nguồn vào một <em>THANH GHI</em>", còn "<code>INS</code> chép vào một <em>Ô NHỚ</em>" — cùng chiều, khác loại đích.</li>
<li><strong>"Chỉ vài lệnh, hành động chọn bằng mã" là khuôn mẫu ngoài đời thật.</strong> Một bộ điều khiển đĩa hỗ trợ tìm rãnh, đọc, ghi, định dạng, hiệu chỉnh lại đầu từ và hàng chục truy vấn trạng thái. Không cái nào là mã lệnh cả. Chúng là <em>TỪ LỆNH</em> được ghi vào thanh ghi điều khiển bằng một lệnh <code>OUT</code> hoặc <code>STORE</code> bình thường. Tập lệnh giữ nguyên độ nhỏ; tập lệnh của thiết bị thì phình ra mà không đụng tới CPU.</li>
<li><strong>Vì sao lệnh I/O thường là lệnh đặc quyền.</strong> Cho một chương trình người dùng nói chuyện thẳng với bộ điều khiển đĩa nghĩa là cho nó đọc mọi tệp trên máy. Nên những lệnh này bị hạn chế — và đó đúng là chủ đề của slide ngay sau.</li>
</ul>
<p class="pitfall">⚠️ Slide 22, Table 13.3(f), liệt kê "<code>XOR Dest, Source</code> — chép byte, từ hoặc từ kép từ toán hạng nguồn ra cổng I/O nêu ở toán hạng đích" NẰM TRONG khối Input/Output. Đó <strong>KHÔNG</strong> phải phép XOR logic; đó là lỗi in của <code>OUTS</code> (output string), bản "nguồn là bộ nhớ" của <code>OUT</code>. <code>XOR</code> thật nằm ở khối (d) Logical trên slide 21. Nếu đề trích đúng dòng đó thì phải nói ra.</p>`],

      [32, 'System Control',
        `<p class="y-chinh">🎯 The sixth family, and the one defined by <em>permission</em> rather than by what it computes: <strong>instructions that can be executed only while the processor is in a certain privileged state, or is executing a program in a special privileged area of memory</strong>. Typically these are reserved for the use of the operating system.</p>
<ul>
<li><strong>The three examples printed on the slide.</strong> (1) A system control instruction may <strong>read or alter a control register</strong>. (2) An instruction to <strong>read or modify a storage protection key</strong>. (3) <strong>Access to process control blocks</strong> in a multiprogramming system.</li>
<li><strong>Why a whole instruction class needs a permission bit.</strong> Every one of those three examples, if available to any program, hands that program the keys to the machine: control registers configure paging and interrupts, the protection key decides who may touch which memory, and the process control block holds every other process's saved state. The hardware therefore refuses to execute them unless a mode bit says the caller is the OS.</li>
<li><strong>How a user program gets the work done anyway — the system call.</strong> It executes an <em>unprivileged</em> trap instruction (x86: <code>INT Nr</code>, on slide 22 — "Interrupts current program, runs specified interrupt program"). That switches the processor into the privileged state <em>and</em> jumps to an address the OS chose. The user can ask for the operation; it can never choose the code that performs it. That single asymmetry is the foundation of operating-system security.</li>
<li><strong>Connect to Chapter 8 (OS support).</strong> Kernel mode versus user mode, memory protection and the process control block are that chapter's core material; this slide is where they first appear as <em>instructions</em>. Connect also to Chapter 5/6: the storage protection key is enforced by hardware on every memory access, not checked by software.</li>
<li><strong>Two more x86 entries belong to this family</strong> even though slide 22 files them under transfer of control: <code>HLT</code> ("stops instruction execution and places the processor in a HALT state", resumed only by an enabled interrupt, a debug exception, BINIT#, INIT# or RESET#) and <code>WAIT</code>. A user program that could execute <code>HLT</code> would freeze the machine for everybody.</li>
</ul>
<p class="meo">💡 Quick test for "is this instruction privileged?": ask <em>"could a malicious user program use it to affect a different program?"</em> If yes, it is privileged. <code>ADD</code> — no. <code>LOAD</code> — no, the protection hardware already bounds it. <code>OUT</code> to a disk port — yes. Change the page table base register — emphatically yes.</p>
<p class="pitfall">⚠️ Common confusion: privileged is <strong>not</strong> the same as "kernel only in software". The check is done by the <em>hardware</em>, on every single instruction fetch, and the penalty for failing it is an exception — not a compiler error, not a linker error. You cannot bypass it by writing assembly, which is precisely the point.</p>`,
        `<p class="y-chinh">🎯 Họ thứ sáu, và là họ được định nghĩa bằng <em>QUYỀN</em> chứ không bằng việc nó tính cái gì: <strong>những lệnh chỉ chạy được khi bộ xử lý đang ở một trạng thái đặc quyền nhất định, hoặc đang chạy chương trình trong một vùng nhớ đặc quyền đặc biệt</strong>. Thường thì chúng được DÀNH RIÊNG cho hệ điều hành dùng.</p>
<ul>
<li><strong>Ba ví dụ in trên slide.</strong> (1) Một lệnh điều khiển hệ thống có thể <strong>đọc hoặc sửa một thanh ghi điều khiển</strong>. (2) Một lệnh để <strong>đọc hoặc sửa khoá bảo vệ vùng nhớ</strong>. (3) <strong>Truy cập các khối điều khiển tiến trình</strong> trong hệ đa chương.</li>
<li><strong>Vì sao cả một lớp lệnh cần tới một bit quyền.</strong> Cả ba ví dụ trên, nếu chương trình nào cũng dùng được, là trao chìa khoá cả cái máy cho chương trình đó: thanh ghi điều khiển cấu hình phân trang và ngắt, khoá bảo vệ quyết định ai được đụng vùng nhớ nào, còn khối điều khiển tiến trình giữ trạng thái đã lưu của MỌI tiến trình khác. Vì thế phần cứng từ chối thực hiện chúng trừ khi một bit chế độ nói rằng người gọi là hệ điều hành.</li>
<li><strong>Chương trình người dùng vẫn nhờ làm được việc đó — bằng LỜI GỌI HỆ THỐNG.</strong> Nó chạy một lệnh bẫy <em>KHÔNG đặc quyền</em> (x86: <code>INT Nr</code>, ở slide 22 — "ngắt chương trình hiện tại, chạy chương trình ngắt được chỉ định"). Lệnh đó chuyển bộ xử lý sang trạng thái đặc quyền <em>VÀ</em> nhảy tới một địa chỉ do HỆ ĐIỀU HÀNH chọn. Người dùng được phép YÊU CẦU thao tác; nó không bao giờ được chọn đoạn mã thực hiện thao tác ấy. Đúng một sự bất đối xứng đó là nền móng của an toàn hệ điều hành.</li>
<li><strong>Nối sang Chương 8 (hỗ trợ của hệ điều hành).</strong> Chế độ nhân với chế độ người dùng, bảo vệ bộ nhớ và khối điều khiển tiến trình là phần lõi của chương đó; slide này là chỗ chúng lần đầu xuất hiện dưới dạng <em>LỆNH</em>. Nối luôn sang Chương 5/6: khoá bảo vệ vùng nhớ được phần cứng ép buộc ở MỌI lần truy cập, chứ không phải phần mềm kiểm tra.</li>
<li><strong>Hai mục x86 nữa thuộc họ này</strong> dù slide 22 xếp chúng vào nhóm chuyển điều khiển: <code>HLT</code> ("dừng thực hiện lệnh và đưa bộ xử lý vào trạng thái HALT", chỉ có ngắt được bật, ngoại lệ gỡ lỗi, tín hiệu BINIT#, INIT# hoặc RESET# mới đánh thức) và <code>WAIT</code>. Một chương trình người dùng mà chạy được <code>HLT</code> thì đóng băng cả máy, cho tất cả mọi người.</li>
</ul>
<p class="meo">💡 Phép thử nhanh "lệnh này có đặc quyền không?": hỏi <em>"một chương trình người dùng độc hại có thể dùng nó để tác động sang chương trình KHÁC không?"</em> Có thì nó đặc quyền. <code>ADD</code> — không. <code>LOAD</code> — không, phần cứng bảo vệ đã chặn giới hạn. <code>OUT</code> ra cổng đĩa — có. Đổi thanh ghi gốc bảng trang — chắc chắn có.</p>
<p class="pitfall">⚠️ Nhầm lẫn hay gặp: "đặc quyền" <strong>KHÔNG</strong> đồng nghĩa với "chỉ nhân hệ điều hành gọi được, ở mức phần mềm". Phép kiểm do <em>PHẦN CỨNG</em> làm, ở từng lần nạp lệnh một, và hình phạt khi trượt là một NGOẠI LỆ — không phải lỗi biên dịch, không phải lỗi liên kết. Bạn không lách được bằng cách viết hợp ngữ, và đó chính là điểm mấu chốt.</p>`],

      [33, 'Transfer of Control',
        `<p class="y-chinh">🎯 The heart of the second half of the chapter. Up to now every instruction has simply been followed by the next one in memory. Transfer-of-control instructions are the ones that <strong>change the program counter to something other than "the next address"</strong>, and the slide starts by justifying why a machine needs them at all.</p>
<ul>
<li><strong>Reason 1 — "It is essential to be able to execute each instruction more than once."</strong> A program of n instructions that each ran once would do n operations; useless. Loops let a 20-instruction program perform a million operations. Without a backward branch, program size and work done would be the same number.</li>
<li><strong>Reason 2 — "Virtually all programs involve some decision making."</strong> A machine that can only run straight through cannot react to its data. Conditional transfer of control is what turns a calculator into a computer.</li>
<li><strong>Reason 3 — "It helps if there are mechanisms for breaking the task up into smaller pieces that can be worked on one at a time."</strong> That is the argument for procedures, developed on slides 36–40.</li>
<li><strong>The three most common operations, exactly as listed.</strong> <em>Branch</em> (slide 34), <em>Skip</em> (slide 35), <em>Procedure call</em> (slides 36–40). Note the ordering: branch is the general mechanism, skip is a compressed special case of it, and procedure call is branch plus a way back.</li>
<li><strong>What the processor does</strong> (Table 13.4, slide 23): "Update program counter. For subroutine call/return, manage parameter passing and linkage." Two verbs, and the second one is the whole difficulty — a branch just writes the PC, a call must also <em>remember where it came from</em>.</li>
<li><strong>The performance cost you will meet in Chapter 12.</strong> A pipelined processor fetches the next instructions before the current one finishes. A taken branch invalidates all of them — the pipeline must be flushed and refilled. That is why Chapter 12 spends whole sections on branch prediction, and why this innocuous slide is the origin of one of the largest performance problems in computer architecture.</li>
</ul>
<p class="meo">💡 Keep a single mental distinction for the rest of the chapter: a <strong>branch is one-way</strong> (the PC changes and nothing is remembered), a <strong>call is a round trip</strong> (the PC changes <em>and</em> the return address is saved). Every question in this half of the chapter is testing which of the two the situation needs.</p>
<p class="pitfall">⚠️ Do not say "transfer of control means jumping backwards". Figure 13.7 on the next slide shows both directions: <code>BR 202</code> jumps <em>backwards</em> to make a loop, while <code>BRZ 211</code> and <code>BRE R1,R2,235</code> jump <em>forwards</em> to skip a block — which is how <code>if</code> statements are compiled.</p>`,
        `<p class="y-chinh">🎯 Trái tim của nửa sau chương. Tới giờ, sau mỗi lệnh luôn là lệnh nằm kế tiếp trong bộ nhớ. Lệnh chuyển điều khiển là những lệnh <strong>ĐỔI bộ đếm chương trình sang một chỗ KHÁC "địa chỉ kế tiếp"</strong>, và slide mở đầu bằng việc biện minh vì sao máy phải có chúng.</p>
<ul>
<li><strong>Lý do 1 — "Phải có khả năng thực hiện mỗi lệnh NHIỀU HƠN MỘT LẦN."</strong> Một chương trình n lệnh mà mỗi lệnh chạy đúng một lần thì làm được n phép; vô dụng. Vòng lặp cho phép một chương trình 20 lệnh thực hiện một triệu phép. Không có lệnh rẽ nhánh lùi thì KÍCH THƯỚC chương trình và LƯỢNG VIỆC làm được là cùng một con số.</li>
<li><strong>Lý do 2 — "Hầu như mọi chương trình đều có việc RA QUYẾT ĐỊNH."</strong> Cái máy chỉ chạy thẳng một mạch thì không phản ứng được với dữ liệu của chính nó. Chuyển điều khiển CÓ ĐIỀU KIỆN mới là thứ biến một cái máy tính bỏ túi thành một máy tính.</li>
<li><strong>Lý do 3 — "Sẽ dễ hơn nếu có cơ chế CHIA NHỎ công việc thành từng mảnh làm được lần lượt."</strong> Đó là lý lẽ cho thủ tục, khai triển ở slide 36–40.</li>
<li><strong>Ba phép hay gặp nhất, đúng như slide liệt kê.</strong> <em>Branch</em> — rẽ nhánh (slide 34), <em>Skip</em> — bỏ qua (slide 35), <em>Procedure call</em> — gọi thủ tục (slide 36–40). Để ý thứ tự: rẽ nhánh là cơ chế tổng quát, bỏ qua là ca đặc biệt nén lại của nó, còn gọi thủ tục là rẽ nhánh CỘNG một đường về.</li>
<li><strong>Bộ xử lý làm gì</strong> (Table 13.4, slide 23): "Cập nhật bộ đếm chương trình. Với lời gọi/trả về chương trình con, quản lý việc truyền tham số và liên kết." Hai động từ, và động từ thứ hai mới là chỗ khó — rẽ nhánh chỉ ghi vào PC, còn lời gọi còn phải <em>NHỚ NÓ ĐẾN TỪ ĐÂU</em>.</li>
<li><strong>Cái giá hiệu năng mà bạn sẽ gặp ở Chương 12.</strong> Bộ xử lý có đường ống nạp sẵn các lệnh kế tiếp trước khi lệnh hiện tại xong. Một lệnh rẽ nhánh ĐƯỢC LẤY sẽ làm toàn bộ số đó vô giá trị — phải xả sạch đường ống rồi nạp lại. Đó là lý do Chương 12 dành hẳn nhiều mục cho dự đoán rẽ nhánh, và là lý do cái slide trông vô hại này lại là nguồn gốc của một trong những vấn đề hiệu năng lớn nhất ngành kiến trúc máy tính.</li>
</ul>
<p class="meo">💡 Giữ đúng MỘT phân biệt trong đầu cho tới hết chương: <strong>rẽ nhánh là đi MỘT CHIỀU</strong> (PC đổi và không nhớ gì cả), <strong>gọi là đi KHỨ HỒI</strong> (PC đổi <em>VÀ</em> địa chỉ trở về được lưu). Mọi câu hỏi ở nửa sau chương này đều đang kiểm tra xem tình huống cần cái nào trong hai.</p>
<p class="pitfall">⚠️ Đừng nói "chuyển điều khiển nghĩa là nhảy lùi". Figure 13.7 ở slide ngay sau vẽ CẢ HAI chiều: <code>BR 202</code> nhảy <em>LÙI</em> để tạo vòng lặp, còn <code>BRZ 211</code> và <code>BRE R1,R2,235</code> nhảy <em>TỚI</em> để bỏ qua một khối — đó chính là cách câu lệnh <code>if</code> được biên dịch.</p>`],

      [34, 'Figure 13.7 — Branch Instructions',
        `<p class="y-chinh">🎯 One column of memory addresses, one column of instructions, and three arrows. Read from the figure: address <strong>202</strong> holds <code>SUB X, Y</code>; <strong>203</strong> holds <code>BRZ 211</code>; <strong>210</strong> holds <code>BR 202</code>; <strong>225</strong> holds <code>BRE R1, R2, 235</code>. Two arrows are labelled <em>Conditional branch</em>, one is labelled <em>Unconditional branch</em>.</p>
<table>
<tr><th>Address</th><th>Instruction</th><th>Kind</th><th>Direction</th><th>What it means</th></tr>
<tr><td>202</td><td><code>SUB X, Y</code></td><td>Arithmetic</td><td>—</td><td>Computes X − Y <strong>and sets the condition flags</strong> — this is what feeds the next instruction</td></tr>
<tr><td>203</td><td><code>BRZ 211</code></td><td>Conditional</td><td>Forward (203 → 211)</td><td>BRanch if Zero: if the Z flag is set, jump to 211; otherwise fall through to 204</td></tr>
<tr><td>210</td><td><code>BR 202</code></td><td>Unconditional</td><td>Backward (210 → 202)</td><td>Always jump to 202 — this closes the loop 202…210</td></tr>
<tr><td>225</td><td><code>BRE R1, R2, 235</code></td><td>Conditional</td><td>Forward (225 → 235)</td><td>BRanch if Equal: compare R1 with R2 <em>inside the instruction</em>, jump to 235 if equal</td></tr>
</table>
<ul>
<li><strong>The figure quietly shows the two ways a conditional branch can get its condition, and this is the exam point.</strong> <code>BRZ 211</code> tests a <strong>flag left behind by a previous instruction</strong> (the <code>SUB</code> at 202). <code>BRE R1, R2, 235</code> carries <strong>its own two operands</strong> and does the comparison itself. The first style is x86 and EAS/390; the second is MIPS. The first needs fewer bits per branch but creates a hidden dependency on whatever ran before.</li>
<li><strong>The flags a branch reads are produced by the ALU — this is Chapter 9 made visible.</strong> The four classic condition bits: <strong>Z</strong> (result was zero), <strong>N</strong> or <strong>S</strong> (result was negative, i.e. the sign bit), <strong>C</strong> (a carry or borrow out of the most significant bit), <strong>V</strong> or <strong>O</strong> (signed twos-complement overflow). Z is one big NOR gate over all result bits; N is simply a wire from the top bit; C comes out of the adder's last stage; V is the XOR of the last two carries. Nothing in a conditional branch is mysterious — it is combinational logic feeding a multiplexer on the PC.</li>
<li><strong>Why <code>SUB</code> sits immediately above <code>BRZ</code>.</strong> "X − Y is zero" means "X equals Y". Subtract-then-branch-on-zero <em>is</em> the machine's way of writing <code>if (x == y)</code>. When the difference itself is not wanted, the machine uses <code>CMP</code> instead (slide 20) — same subtraction, result discarded, flags kept.</li>
<li><strong>Backward branch = loop, forward branch = <code>if</code>.</strong> <code>BR 202</code> sends control back to 202, so instructions 202–210 repeat: that is a <code>while</code>. <code>BRZ 211</code> and <code>BRE …235</code> jump over a block of code: that is the <code>if</code>/<code>else</code> skeleton. Recognising the direction tells you which high-level construct the assembly came from.</li>
</ul>
<p class="nhan">📐 Flags computed for real. A small C program simulated <code>CMP a, b</code> (subtract, keep only flags) on five operand pairs, deriving Z, S, C and O exactly as the hardware does:</p>
<table>
<tr><th>CMP a, b</th><th>Z</th><th>S (=N)</th><th>C</th><th>O (=V)</th><th>JE (Z=1)</th><th>JL (S≠O)</th><th>JB (C=1)</th></tr>
<tr><td>5, 5</td><td>1</td><td>0</td><td>0</td><td>0</td><td>jump</td><td>no</td><td>no</td></tr>
<tr><td>3, 7</td><td>0</td><td>1</td><td>1</td><td>0</td><td>no</td><td>jump</td><td>jump</td></tr>
<tr><td>7, 3</td><td>0</td><td>0</td><td>0</td><td>0</td><td>no</td><td>no</td><td>no</td></tr>
<tr><td>−2147483648, 1</td><td>0</td><td><strong>0</strong></td><td>0</td><td><strong>1</strong></td><td>no</td><td><strong>jump</strong></td><td>no</td></tr>
<tr><td>0, 0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>jump</td><td>no</td><td>no</td></tr>
</table>
<p class="dap-an">✅ Look at row 4. −2 147 483 648 <em>is</em> less than 1, and JL correctly jumps — but the sign flag is <strong>0</strong>, not 1, because the subtraction overflowed. That measured row is the entire reason the x86 condition for "signed less than" is <strong>S ≠ O</strong> and not simply "S = 1". Any exam answer that says "jump if negative" for a signed comparison is wrong on exactly this input.</p>
<p class="pitfall">⚠️ The flags are <strong>global, invisible state</strong> shared by every instruction. Insert one innocent <code>ADD</code> between the <code>SUB</code> at 202 and the <code>BRZ</code> at 203 and the branch now tests the <code>ADD</code>'s result. This is the single most common assembly bug, and it is why RISC designs such as ARM make flag-setting <em>optional</em> per instruction (<code>ADD</code> versus <code>ADDS</code>).</p>`,
        `<p class="y-chinh">🎯 Một cột địa chỉ bộ nhớ, một cột lệnh, và ba mũi tên. Đọc từ hình: địa chỉ <strong>202</strong> chứa <code>SUB X, Y</code>; <strong>203</strong> chứa <code>BRZ 211</code>; <strong>210</strong> chứa <code>BR 202</code>; <strong>225</strong> chứa <code>BRE R1, R2, 235</code>. Hai mũi tên ghi <em>Conditional branch</em>, một mũi tên ghi <em>Unconditional branch</em>.</p>
<table>
<tr><th>Địa chỉ</th><th>Lệnh</th><th>Loại</th><th>Chiều</th><th>Nghĩa là gì</th></tr>
<tr><td>202</td><td><code>SUB X, Y</code></td><td>Số học</td><td>—</td><td>Tính X − Y <strong>và ĐẶT các cờ điều kiện</strong> — đây chính là thứ nuôi lệnh ngay sau</td></tr>
<tr><td>203</td><td><code>BRZ 211</code></td><td>Có điều kiện</td><td>Tới (203 → 211)</td><td>BRanch if Zero: nếu cờ Z bật thì nhảy tới 211; không thì chạy tiếp xuống 204</td></tr>
<tr><td>210</td><td><code>BR 202</code></td><td>Không điều kiện</td><td>Lùi (210 → 202)</td><td>Luôn nhảy về 202 — khép lại vòng lặp 202…210</td></tr>
<tr><td>225</td><td><code>BRE R1, R2, 235</code></td><td>Có điều kiện</td><td>Tới (225 → 235)</td><td>BRanch if Equal: so R1 với R2 <em>NGAY TRONG LỆNH</em>, bằng nhau thì nhảy tới 235</td></tr>
</table>
<ul>
<li><strong>Hình này lặng lẽ cho thấy HAI cách một lệnh rẽ nhánh có điều kiện lấy được điều kiện, và đây là điểm thi.</strong> <code>BRZ 211</code> kiểm một <strong>CỜ do lệnh TRƯỚC để lại</strong> (lệnh <code>SUB</code> ở 202). <code>BRE R1, R2, 235</code> thì mang theo <strong>HAI TOÁN HẠNG của chính nó</strong> và tự so sánh lấy. Kiểu thứ nhất là x86 và EAS/390; kiểu thứ hai là MIPS. Kiểu thứ nhất tốn ít bit hơn cho mỗi lệnh rẽ nhánh nhưng tạo ra một phụ thuộc NGẦM vào bất cứ lệnh nào vừa chạy trước đó.</li>
<li><strong>Các cờ mà lệnh rẽ nhánh đọc là do ALU sinh ra — đây là Chương 9 hiện hình.</strong> Bốn bit điều kiện kinh điển: <strong>Z</strong> (kết quả bằng 0), <strong>N</strong> hoặc <strong>S</strong> (kết quả âm, tức bit dấu), <strong>C</strong> (có nhớ hoặc có mượn ra khỏi bit cao nhất), <strong>V</strong> hoặc <strong>O</strong> (tràn số bù hai có dấu). Z là một cổng NOR to trùm lên mọi bit kết quả; N chỉ là một sợi dây nối từ bit trên cùng; C ra từ tầng cuối của bộ cộng; V là XOR của hai số nhớ cuối. Chẳng có gì huyền bí trong một lệnh rẽ nhánh cả — đó là mạch tổ hợp nuôi một bộ chọn kênh đặt trên PC.</li>
<li><strong>Vì sao <code>SUB</code> lại nằm ngay trên <code>BRZ</code>.</strong> "X − Y bằng 0" nghĩa là "X bằng Y". Trừ-rồi-rẽ-nhánh-khi-bằng-0 <em>CHÍNH LÀ</em> cách máy viết câu <code>if (x == y)</code>. Khi không cần tới hiệu số, máy dùng <code>CMP</code> thay thế (slide 20) — vẫn phép trừ ấy, vứt kết quả, giữ cờ.</li>
<li><strong>Nhảy LÙI = vòng lặp, nhảy TỚI = <code>if</code>.</strong> <code>BR 202</code> đưa điều khiển về 202 nên các lệnh 202–210 lặp lại: đó là <code>while</code>. <code>BRZ 211</code> và <code>BRE …235</code> nhảy VƯỢT QUA một khối mã: đó là bộ xương của <code>if</code>/<code>else</code>. Nhận ra CHIỀU nhảy là biết đoạn hợp ngữ đó đến từ cấu trúc bậc cao nào.</li>
</ul>
<p class="nhan">📐 Cờ tính THẬT. Một chương trình C nhỏ mô phỏng <code>CMP a, b</code> (trừ đi, chỉ giữ cờ) trên năm cặp toán hạng, suy ra Z, S, C, O đúng như phần cứng làm:</p>
<table>
<tr><th>CMP a, b</th><th>Z</th><th>S (=N)</th><th>C</th><th>O (=V)</th><th>JE (Z=1)</th><th>JL (S≠O)</th><th>JB (C=1)</th></tr>
<tr><td>5, 5</td><td>1</td><td>0</td><td>0</td><td>0</td><td>nhảy</td><td>không</td><td>không</td></tr>
<tr><td>3, 7</td><td>0</td><td>1</td><td>1</td><td>0</td><td>không</td><td>nhảy</td><td>nhảy</td></tr>
<tr><td>7, 3</td><td>0</td><td>0</td><td>0</td><td>0</td><td>không</td><td>không</td><td>không</td></tr>
<tr><td>−2147483648, 1</td><td>0</td><td><strong>0</strong></td><td>0</td><td><strong>1</strong></td><td>không</td><td><strong>nhảy</strong></td><td>không</td></tr>
<tr><td>0, 0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>nhảy</td><td>không</td><td>không</td></tr>
</table>
<p class="dap-an">✅ Nhìn dòng 4. −2.147.483.648 <em>ĐÚNG LÀ</em> nhỏ hơn 1, và JL nhảy đúng — nhưng cờ dấu lại bằng <strong>0</strong> chứ không phải 1, vì phép trừ đã TRÀN. Dòng đo được đó là toàn bộ lý do điều kiện "nhỏ hơn có dấu" của x86 là <strong>S ≠ O</strong> chứ không đơn giản là "S = 1". Bài thi nào trả lời "nhảy khi kết quả âm" cho phép so sánh có dấu là SAI, sai đúng tại đầu vào này.</p>
<p class="pitfall">⚠️ Các cờ là <strong>TRẠNG THÁI TOÀN CỤC, VÔ HÌNH</strong> dùng chung cho mọi lệnh. Chèn một lệnh <code>ADD</code> vô hại giữa <code>SUB</code> ở 202 và <code>BRZ</code> ở 203 là lệnh rẽ nhánh lập tức kiểm kết quả của <code>ADD</code>. Đây là lỗi hợp ngữ phổ biến nhất, và là lý do các thiết kế RISC như ARM để việc đặt cờ thành TUỲ CHỌN cho từng lệnh (<code>ADD</code> so với <code>ADDS</code>).</p>`],

      [35, 'Skip Instructions',
        `<p class="y-chinh">🎯 A branch with <strong>no address field at all</strong>. The slide states it in four boxes: a skip instruction <em>includes an implied address</em>; it <em>typically implies that one instruction be skipped, thus the implied address equals the address of the next instruction plus one instruction length</em>; <em>because the skip instruction does not require a destination address field it is free to do other things</em>; and the example given is the <strong>increment-and-skip-if-zero (ISZ)</strong> instruction.</p>
<ul>
<li><strong>"Implied address" is the whole idea.</strong> A normal branch must spend bits naming its target. A skip always goes to the same place — two instructions ahead — so those bits can be left out of the instruction format entirely. Chapter 11 will call this <em>implied addressing</em> and put it at the top of its list of addressing modes.</li>
<li><strong>Do the arithmetic the slide implies.</strong> If the skip instruction is at address A and instructions are L bytes long, the next instruction is at A + L and the skip target is <strong>A + 2L</strong>. On a machine where L = 1 word, a skip at 110 lands at 112 and instruction 111 is never executed.</li>
<li><strong>"Free to do other things" is the clever part.</strong> The bits saved by not naming a target are reused to name an <em>operand</em>. That is how <code>ISZ X</code> manages to be a single instruction that does three jobs: increment the contents of X, test whether the result is zero, and conditionally skip. Three operations, one opcode, one address field.</li>
<li><strong>The canonical loop it produces.</strong> Put a negative count in X, then at the bottom of the loop write <code>ISZ X</code> followed by <code>BR top</code>. Each pass increments X; while X is still negative the <code>ISZ</code> does not skip, so the <code>BR</code> executes and the loop repeats. When X finally reaches zero, <code>ISZ</code> skips the <code>BR</code> and the loop exits. Two instructions for an entire counted loop.</li>
</ul>
<p class="nhan">📐 Worked trace. Memory: 100–108 is the loop body, <strong>109</strong> is <code>ISZ X</code>, <strong>110</strong> is <code>BR 100</code>, <strong>111</strong> is the first instruction after the loop. X starts at −3.</p>
<table>
<tr><th>Pass</th><th>At 109: <code>ISZ X</code></th><th>New X</th><th>Zero?</th><th>Skip?</th><th>Next PC</th><th>Effect</th></tr>
<tr><td>1</td><td>increment −3</td><td>−2</td><td>no</td><td>no</td><td>110</td><td><code>BR 100</code> runs → loop again</td></tr>
<tr><td>2</td><td>increment −2</td><td>−1</td><td>no</td><td>no</td><td>110</td><td><code>BR 100</code> runs → loop again</td></tr>
<tr><td>3</td><td>increment −1</td><td>0</td><td><strong>yes</strong></td><td><strong>yes</strong></td><td><strong>111</strong></td><td><code>BR 100</code> is skipped → loop exits</td></tr>
</table>
<p class="dap-an">✅ Answer: the loop body runs exactly <strong>3</strong> times, and the loop control cost exactly <strong>two instructions</strong> (<code>ISZ</code> + <code>BR</code>) with no comparison instruction and no branch target for the <code>ISZ</code>. Start value −n gives n passes — that is the rule to remember.</p>
<p class="meo">💡 Why count <em>up to zero</em> from a negative number instead of down to zero from n? Because "is it zero" is free — it is the Z flag, one NOR gate — whereas "is it equal to n" would need a comparison against a stored constant. Counting towards zero is a hardware-friendliness trick you will see again in compiled loops.</p>
<p class="pitfall">⚠️ A skip is <strong>not</strong> a branch with a short offset. It has <em>no</em> offset field — the distance is fixed by the architecture. Consequently a skip can never jump backwards and can never make a loop by itself; it always needs a real branch next to it, as in the trace above.</p>`,
        `<p class="y-chinh">🎯 Một lệnh rẽ nhánh <strong>KHÔNG có trường địa chỉ nào cả</strong>. Slide nói bằng bốn ô: lệnh skip <em>mang một địa chỉ NGẦM ĐỊNH</em>; nó <em>thường ngụ ý bỏ qua MỘT lệnh, do đó địa chỉ ngầm định bằng địa chỉ của lệnh kế tiếp CỘNG một độ dài lệnh</em>; <em>vì lệnh skip không cần trường địa chỉ đích nên nó RẢNH để làm việc khác</em>; và ví dụ được nêu là lệnh <strong>tăng-và-bỏ-qua-nếu-bằng-không (ISZ)</strong>.</p>
<ul>
<li><strong>"Địa chỉ ngầm định" chính là toàn bộ ý tưởng.</strong> Một lệnh rẽ nhánh bình thường phải tiêu bit để nêu tên đích. Lệnh skip thì luôn đi tới cùng một chỗ — cách đó hai lệnh — nên những bit ấy có thể BỎ HẲN khỏi khuôn dạng lệnh. Chương 11 sẽ gọi đây là <em>chế độ địa chỉ ngầm định</em> và xếp nó lên đầu danh sách các chế độ địa chỉ.</li>
<li><strong>Làm phép tính mà slide ngụ ý.</strong> Nếu lệnh skip ở địa chỉ A và mỗi lệnh dài L byte thì lệnh kế tiếp ở A + L còn đích của skip là <strong>A + 2L</strong>. Trên máy mà L = 1 từ, lệnh skip ở 110 sẽ đáp xuống 112 và lệnh 111 không bao giờ được thực hiện.</li>
<li><strong>"Rảnh để làm việc khác" mới là chỗ khôn.</strong> Số bit tiết kiệm được nhờ không phải nêu đích được dùng lại để nêu một <em>TOÁN HẠNG</em>. Đó là cách <code>ISZ X</code> gói được ba việc vào một lệnh: tăng nội dung của X, kiểm xem kết quả có bằng 0 không, và bỏ qua có điều kiện. Ba thao tác, một mã lệnh, một trường địa chỉ.</li>
<li><strong>Vòng lặp kinh điển nó tạo ra.</strong> Đặt một số ÂM vào X, rồi ở cuối vòng lặp viết <code>ISZ X</code> theo sau là <code>BR đầu_vòng</code>. Mỗi lượt tăng X lên một; chừng nào X còn âm thì <code>ISZ</code> không bỏ qua, nên <code>BR</code> chạy và vòng lặp lặp lại. Khi X chạm 0, <code>ISZ</code> bỏ qua chính lệnh <code>BR</code> và vòng lặp thoát. Hai lệnh cho trọn một vòng lặp đếm.</li>
</ul>
<p class="nhan">📐 Bảng chạy tay. Bộ nhớ: 100–108 là thân vòng lặp, <strong>109</strong> là <code>ISZ X</code>, <strong>110</strong> là <code>BR 100</code>, <strong>111</strong> là lệnh đầu tiên sau vòng lặp. X khởi đầu bằng −3.</p>
<table>
<tr><th>Lượt</th><th>Tại 109: <code>ISZ X</code></th><th>X mới</th><th>Bằng 0?</th><th>Bỏ qua?</th><th>PC kế tiếp</th><th>Hệ quả</th></tr>
<tr><td>1</td><td>tăng −3</td><td>−2</td><td>không</td><td>không</td><td>110</td><td><code>BR 100</code> chạy → lặp tiếp</td></tr>
<tr><td>2</td><td>tăng −2</td><td>−1</td><td>không</td><td>không</td><td>110</td><td><code>BR 100</code> chạy → lặp tiếp</td></tr>
<tr><td>3</td><td>tăng −1</td><td>0</td><td><strong>có</strong></td><td><strong>có</strong></td><td><strong>111</strong></td><td><code>BR 100</code> bị bỏ qua → vòng lặp thoát</td></tr>
</table>
<p class="dap-an">✅ Đáp án: thân vòng lặp chạy đúng <strong>3</strong> lượt, và việc điều khiển vòng lặp tốn đúng <strong>hai lệnh</strong> (<code>ISZ</code> + <code>BR</code>), không cần lệnh so sánh nào và <code>ISZ</code> cũng không cần địa chỉ đích nào. Giá trị khởi đầu −n cho n lượt — đó là quy tắc cần nhớ.</p>
<p class="meo">💡 Vì sao lại đếm <em>LÊN tới 0</em> từ một số âm thay vì đếm <em>XUỐNG tới 0</em> từ n? Vì câu hỏi "có bằng 0 không" là MIỄN PHÍ — nó chính là cờ Z, một cổng NOR — trong khi "có bằng n không" sẽ cần một phép so sánh với một hằng số đã lưu. Đếm về 0 là mẹo chiều lòng phần cứng mà bạn sẽ còn gặp lại trong vòng lặp do trình biên dịch sinh ra.</p>
<p class="pitfall">⚠️ Skip <strong>KHÔNG</strong> phải là lệnh rẽ nhánh có độ dời ngắn. Nó <em>KHÔNG CÓ</em> trường độ dời nào — khoảng cách do kiến trúc ấn định cứng. Hệ quả: skip không bao giờ nhảy lùi được và tự nó không tạo nổi vòng lặp; nó luôn cần một lệnh rẽ nhánh thật đứng cạnh, như trong bảng trên.</p>`],

      [36, 'Procedure Call Instructions',
        `<p class="y-chinh">🎯 A procedure is a <strong>self-contained computer program that is incorporated into a larger program</strong>. At any point the procedure may be <em>invoked</em>, or <em>called</em>; the processor is instructed to go and execute the entire procedure and then <strong>return to the point from which the call took place</strong>. That last clause is the hard part, and the next four slides are about it.</p>
<ul>
<li><strong>The two reasons the slide gives.</strong> <em>Economy</em> — "a procedure allows the same piece of code to be used many times", so a routine used in 40 places is stored once instead of 40 times. <em>Modularity</em> — the program can be built and reasoned about one piece at a time, which is reason 3 of slide 33 made concrete.</li>
<li><strong>The two instructions it involves, exactly as listed.</strong> "A <em>call</em> instruction that branches from the present location to the procedure" and a "<em>return</em> instruction that returns from the procedure to the place from which it was called." Note the asymmetry: the CALL names an address, the RETURN names nothing. RETURN must <em>discover</em> where to go.</li>
<li><strong>Why RETURN is the whole difficulty.</strong> A procedure called from 40 different places must return to 40 different addresses. The target of the RETURN is therefore not a property of the procedure — it is a property of <em>this particular call</em>. So the call must leave behind a <strong>return address</strong>, and the machinery for storing it is what Figures 13.8–13.10 are about.</li>
<li><strong>Three places the return address can be kept</strong> (the textbook's list, and the slides that follow show why only the third survives): in a <em>register</em>, at the <em>start of the called procedure</em>, or on a <em>stack</em>. The register is fast but is overwritten by the next call. Storing it at the start of the procedure works until the procedure calls itself. Only a stack handles both nesting and recursion.</li>
<li><strong>x86 gives it four instructions, not two.</strong> Slide 40 lists <code>CALL</code>, <code>ENTER</code>, <code>LEAVE</code>, <code>RETURN</code>. <code>CALL</code>/<code>RETURN</code> handle control; <code>ENTER</code>/<code>LEAVE</code> handle the <em>local variables</em> the procedure needs — the stack frame of Figure 13.10.</li>
</ul>
<p class="nhan">📐 Connect to PRF192 Chapter 5. Everything on this slide is what <code>int f(int x) { ... return y; }</code> compiles into. The function name becomes the CALL target; <code>return</code> becomes the RETURN instruction; the local variables become the stack frame; the parameters are passed in registers or on the stack. The "stack trace table" you drew by hand in PRF192 for nested function calls is <em>literally the contents of the hardware stack</em> shown on the next three slides — the same table, one level down.</p>
<p class="meo">💡 One sentence that keeps calls and branches apart forever: <strong>a branch says "go there"; a call says "go there, and here is the way back".</strong> Everything difficult about procedures comes from the second half of that sentence.</p>
<p class="pitfall">⚠️ "Self-contained" on this slide is about <em>code</em>, not about <em>data</em>. The procedure's instructions are one block, but its local variables are created fresh on every call and destroyed on return. Confusing those two is the root of the classic C bug of returning a pointer to a local variable — the address is valid, the storage is not.</p>`,
        `<p class="y-chinh">🎯 Thủ tục là một <strong>chương trình hoàn chỉnh, khép kín, được nhúng vào một chương trình lớn hơn</strong>. Ở bất kỳ điểm nào, thủ tục có thể được <em>gọi</em>; bộ xử lý được lệnh đi thực hiện TRỌN thủ tục rồi <strong>TRỞ VỀ đúng điểm đã phát ra lời gọi</strong>. Vế cuối đó mới là phần khó, và bốn slide tiếp theo là về nó.</p>
<ul>
<li><strong>Hai lý do slide nêu.</strong> <em>Tiết kiệm (Economy)</em> — "thủ tục cho phép DÙNG LẠI cùng một đoạn mã nhiều lần", nên một thủ tục dùng ở 40 chỗ chỉ lưu MỘT lần thay vì 40 lần. <em>Tính mô-đun (Modularity)</em> — chương trình có thể dựng và suy luận từng mảnh một, chính là lý do 3 của slide 33 nói cụ thể ra.</li>
<li><strong>Hai lệnh liên quan, đúng như slide liệt kê.</strong> "Một lệnh <em>call</em> rẽ nhánh từ vị trí hiện tại sang thủ tục" và "một lệnh <em>return</em> trả về từ thủ tục tới nơi đã gọi nó." Để ý chỗ BẤT ĐỐI XỨNG: CALL có nêu địa chỉ, RETURN không nêu gì cả. RETURN buộc phải <em>TỰ TÌM RA</em> nơi cần đi.</li>
<li><strong>Vì sao RETURN mới là toàn bộ cái khó.</strong> Một thủ tục bị gọi từ 40 chỗ khác nhau phải trả về 40 địa chỉ khác nhau. Do đó đích của RETURN KHÔNG phải là thuộc tính của thủ tục — nó là thuộc tính của <em>LỜI GỌI CỤ THỂ LẦN NÀY</em>. Vậy nên lời gọi phải để lại một <strong>ĐỊA CHỈ TRỞ VỀ</strong>, và bộ máy lưu địa chỉ đó chính là nội dung của Figure 13.8–13.10.</li>
<li><strong>Ba chỗ có thể cất địa chỉ trở về</strong> (danh sách của sách, và các slide sau cho thấy vì sao chỉ cái thứ ba sống sót): trong một <em>THANH GHI</em>, tại <em>ĐẦU THỦ TỤC ĐƯỢC GỌI</em>, hoặc trên một <em>NGĂN XẾP</em>. Thanh ghi thì nhanh nhưng bị lời gọi kế tiếp ghi đè. Cất ở đầu thủ tục thì chạy được cho tới khi thủ tục gọi lại chính nó. Chỉ ngăn xếp mới chịu được cả lồng nhau lẫn đệ quy.</li>
<li><strong>x86 cho nó BỐN lệnh chứ không phải hai.</strong> Slide 40 liệt kê <code>CALL</code>, <code>ENTER</code>, <code>LEAVE</code>, <code>RETURN</code>. <code>CALL</code>/<code>RETURN</code> lo phần điều khiển; <code>ENTER</code>/<code>LEAVE</code> lo phần <em>BIẾN CỤC BỘ</em> mà thủ tục cần — chính là khung ngăn xếp của Figure 13.10.</li>
</ul>
<p class="nhan">📐 Nối sang PRF192 Chương 5. Mọi thứ trên slide này là thứ mà <code>int f(int x) { ... return y; }</code> được dịch thành. Tên hàm trở thành đích của CALL; câu <code>return</code> trở thành lệnh RETURN; các biến cục bộ trở thành khung ngăn xếp; tham số được truyền qua thanh ghi hoặc qua ngăn xếp. Cái "bảng vết ngăn xếp lời gọi hàm" mà bạn vẽ tay ở PRF192 <em>CHÍNH LÀ nội dung của ngăn xếp phần cứng</em> vẽ ở ba slide sau — vẫn bảng ấy, chỉ là nhìn sâu xuống một tầng.</p>
<p class="meo">💡 Một câu giữ cho lời gọi và rẽ nhánh không bao giờ lẫn nhau: <strong>rẽ nhánh nói "đi tới đó"; lời gọi nói "đi tới đó, và đây là đường về".</strong> Mọi cái khó của thủ tục đều đến từ nửa sau của câu ấy.</p>
<p class="pitfall">⚠️ Chữ "khép kín" trên slide này nói về <em>MÃ LỆNH</em>, không nói về <em>DỮ LIỆU</em>. Các lệnh của thủ tục là một khối duy nhất, nhưng biến cục bộ của nó được tạo mới ở MỖI lời gọi và bị huỷ khi trả về. Lẫn hai thứ đó là gốc rễ của lỗi C kinh điển: trả về con trỏ tới một biến cục bộ — địa chỉ thì hợp lệ, còn vùng nhớ thì không còn.</p>`],

      [37, 'Figure 13.8 — Nested Procedures',
        `<p class="y-chinh">🎯 The concrete example the next two figures are built on. Read the addresses off the picture: the <strong>Main Program</strong> starts at 4000 and has <code>CALL Proc1</code> at <strong>4100</strong> (so the next instruction is <strong>4101</strong>); <strong>Proc1</strong> starts at 4500 and contains <code>CALL Proc2</code> at <strong>4600</strong> (next: <strong>4601</strong>), a second <code>CALL Proc2</code> at <strong>4650</strong> (next: <strong>4651</strong>), and a <code>RETURN</code>; <strong>Proc2</strong> starts at 4800 and ends with <code>RETURN</code>. Part (b) of the figure draws the same thing as an <em>execution sequence</em> of arrows.</p>
<table>
<tr><th>Address</th><th>Belongs to</th><th>Instruction</th><th>Return address it would create</th></tr>
<tr><td>4000…</td><td>Main Program</td><td>(ordinary instructions)</td><td>—</td></tr>
<tr><td>4100</td><td>Main Program</td><td><code>CALL Proc1</code></td><td><strong>4101</strong></td></tr>
<tr><td>4500…</td><td>Proc1</td><td>(ordinary instructions)</td><td>—</td></tr>
<tr><td>4600</td><td>Proc1</td><td><code>CALL Proc2</code></td><td><strong>4601</strong></td></tr>
<tr><td>4650</td><td>Proc1</td><td><code>CALL Proc2</code> (again)</td><td><strong>4651</strong></td></tr>
<tr><td>(end of Proc1)</td><td>Proc1</td><td><code>RETURN</code></td><td>— pops 4101</td></tr>
<tr><td>4800…</td><td>Proc2</td><td>(ordinary instructions)</td><td>—</td></tr>
<tr><td>(end of Proc2)</td><td>Proc2</td><td><code>RETURN</code></td><td>— pops 4601, then later 4651</td></tr>
</table>
<ul>
<li><strong>The figure is designed to break the two naive solutions, and you should be able to say how.</strong> <em>Keep the return address in a register:</em> the <code>CALL Proc1</code> puts 4101 in the register; then <code>CALL Proc2</code> overwrites it with 4601. Proc2 returns to 4601 correctly, but 4101 is gone forever and Main can never be reached again. <em>Keep it at the start of the called procedure:</em> that fails the moment a procedure calls itself, because the second call overwrites the first call's saved address — recursion becomes impossible.</li>
<li><strong>Why Proc2 is called twice from different places.</strong> This is the detail that makes the figure worth studying: the <em>same</em> procedure must return to <strong>4601</strong> the first time and to <strong>4651</strong> the second time. The return address genuinely cannot live inside Proc2. It must belong to the call, not to the callee.</li>
<li><strong>"Nested" means the lifetimes are strictly contained.</strong> Proc2's activity starts after Proc1's has started and finishes before Proc1's finishes. There is no legal way for them to overlap partially. That containment is exactly the property a <strong>stack</strong> models — and it is why the next slide can use one.</li>
<li><strong>Read part (b) as time flowing downward.</strong> The arrows leave the Main block, enter Proc1, leave Proc1 into Proc2, come back into Proc1, go down into Proc2 a second time, come back into Proc1 again, and finally return to Main. Count them: 3 calls, 3 returns, perfectly matched. An unmatched count is a crashed program.</li>
</ul>
<p class="meo">💡 The "+1" in 4100 → 4101 is the whole trick of the return address: the saved value is the address of the instruction <strong>after</strong> the CALL, not the CALL itself. Save the CALL's own address and you get an infinite loop — the procedure would be called again the instant it returns.</p>
<p class="pitfall">⚠️ Do not read 4101, 4601, 4651 as "the next line". They are the next <em>address</em>, and in this figure instructions happen to be one address apart. On x86 a <code>CALL</code> is 5 bytes, so a <code>CALL</code> at 4100 has its return address at 4105. Measured on the machine this lesson was written on: a <code>callq</code> at offset <code>0x3e</code> has return address <code>0x43</code> — five bytes further on, exactly as expected.</p>`,
        `<p class="y-chinh">🎯 Ví dụ cụ thể mà hai hình sau xây dựng trên đó. Đọc các địa chỉ trên hình: <strong>Main Program</strong> bắt đầu ở 4000 và có <code>CALL Proc1</code> tại <strong>4100</strong> (nên lệnh kế tiếp là <strong>4101</strong>); <strong>Proc1</strong> bắt đầu ở 4500, chứa <code>CALL Proc2</code> tại <strong>4600</strong> (kế tiếp: <strong>4601</strong>), một <code>CALL Proc2</code> thứ hai tại <strong>4650</strong> (kế tiếp: <strong>4651</strong>), và một lệnh <code>RETURN</code>; <strong>Proc2</strong> bắt đầu ở 4800 và kết thúc bằng <code>RETURN</code>. Phần (b) của hình vẽ đúng chuyện đó dưới dạng <em>trình tự thực hiện</em> bằng mũi tên.</p>
<table>
<tr><th>Địa chỉ</th><th>Thuộc về</th><th>Lệnh</th><th>Địa chỉ trở về nó sinh ra</th></tr>
<tr><td>4000…</td><td>Main Program</td><td>(các lệnh thường)</td><td>—</td></tr>
<tr><td>4100</td><td>Main Program</td><td><code>CALL Proc1</code></td><td><strong>4101</strong></td></tr>
<tr><td>4500…</td><td>Proc1</td><td>(các lệnh thường)</td><td>—</td></tr>
<tr><td>4600</td><td>Proc1</td><td><code>CALL Proc2</code></td><td><strong>4601</strong></td></tr>
<tr><td>4650</td><td>Proc1</td><td><code>CALL Proc2</code> (lần nữa)</td><td><strong>4651</strong></td></tr>
<tr><td>(cuối Proc1)</td><td>Proc1</td><td><code>RETURN</code></td><td>— lấy ra 4101</td></tr>
<tr><td>4800…</td><td>Proc2</td><td>(các lệnh thường)</td><td>—</td></tr>
<tr><td>(cuối Proc2)</td><td>Proc2</td><td><code>RETURN</code></td><td>— lấy ra 4601, rồi sau đó là 4651</td></tr>
</table>
<ul>
<li><strong>Hình này được dựng ra để ĐÁNH GÃY hai giải pháp ngây thơ, và bạn phải nói được nó gãy ở đâu.</strong> <em>Giữ địa chỉ trở về trong một thanh ghi:</em> <code>CALL Proc1</code> đặt 4101 vào thanh ghi; rồi <code>CALL Proc2</code> ghi đè lên đó bằng 4601. Proc2 trả về 4601 đúng, nhưng 4101 thì MẤT VĨNH VIỄN và Main không bao giờ về được nữa. <em>Giữ ở đầu thủ tục được gọi:</em> cách này gãy ngay khi một thủ tục gọi lại chính nó, vì lời gọi thứ hai ghi đè lên địa chỉ lời gọi thứ nhất đã lưu — đệ quy trở thành bất khả.</li>
<li><strong>Vì sao Proc2 bị gọi HAI LẦN từ hai chỗ khác nhau.</strong> Đây là chi tiết khiến cái hình đáng học: <em>CÙNG MỘT</em> thủ tục phải trả về <strong>4601</strong> ở lần thứ nhất và về <strong>4651</strong> ở lần thứ hai. Địa chỉ trở về thật sự KHÔNG THỂ sống bên trong Proc2. Nó phải thuộc về LỜI GỌI, chứ không thuộc về THỦ TỤC ĐƯỢC GỌI.</li>
<li><strong>"Lồng nhau" nghĩa là các khoảng sống LỒNG CHẶT vào nhau.</strong> Hoạt động của Proc2 bắt đầu sau khi Proc1 đã bắt đầu và kết thúc trước khi Proc1 kết thúc. Không có cách hợp lệ nào để chúng chồng lấn một phần. Tính chất lồng chặt ấy chính là thứ mà một <strong>NGĂN XẾP</strong> mô hình hoá — và là lý do slide ngay sau dùng được ngăn xếp.</li>
<li><strong>Đọc phần (b) theo chiều thời gian chảy XUỐNG.</strong> Các mũi tên rời khối Main, vào Proc1, rời Proc1 sang Proc2, quay lại Proc1, lại đi xuống Proc2 lần hai, lại quay về Proc1, và cuối cùng trả về Main. Đếm đi: 3 lời gọi, 3 lần trả về, khớp chằn chặn. Đếm mà không khớp thì đó là một chương trình đã sập.</li>
</ul>
<p class="meo">💡 Cái "+1" trong 4100 → 4101 chính là toàn bộ mẹo của địa chỉ trở về: giá trị được lưu là địa chỉ của lệnh <strong>SAU</strong> lệnh CALL, chứ không phải địa chỉ của chính lệnh CALL. Lưu địa chỉ của chính CALL thì được một vòng lặp vô tận — thủ tục sẽ bị gọi lại ngay khoảnh khắc nó trả về.</p>
<p class="pitfall">⚠️ Đừng đọc 4101, 4601, 4651 là "dòng kế tiếp". Đó là ĐỊA CHỈ kế tiếp, và trong hình này các lệnh tình cờ cách nhau đúng một địa chỉ. Trên x86 một lệnh <code>CALL</code> dài 5 byte, nên <code>CALL</code> ở 4100 có địa chỉ trở về là 4105. Đo thật trên máy viết bài này: một lệnh <code>callq</code> ở độ dời <code>0x3e</code> có địa chỉ trở về <code>0x43</code> — xa hơn đúng năm byte, đúng như dự đoán.</p>`],

      [38, 'Figure 13.9 — Use of Stack to Implement Nested Subroutines of Figure 13.8',
        `<p class="y-chinh">🎯 The answer slide. Seven little stack pictures, (a) to (g), one for each moment in the run of Figure 13.8. A <strong>stack</strong> is a LIFO store with two operations — <em>push</em> (put on top) and <em>pop</em> (take off the top) — and it is the only structure that gets nested calls right.</p>
<table>
<tr><th>Panel</th><th>Moment</th><th>Operation</th><th>Stack after (top listed first)</th><th>PC goes to</th></tr>
<tr><td>(a)</td><td>Initial stack contents</td><td>—</td><td>(empty)</td><td>—</td></tr>
<tr><td>(b)</td><td>After <code>CALL Proc1</code></td><td>push 4101</td><td><strong>4101</strong></td><td>4500</td></tr>
<tr><td>(c)</td><td>Initial <code>CALL Proc2</code></td><td>push 4601</td><td><strong>4601</strong>, 4101</td><td>4800</td></tr>
<tr><td>(d)</td><td>After <code>RETURN</code></td><td>pop → 4601</td><td><strong>4101</strong></td><td>4601</td></tr>
<tr><td>(e)</td><td>After second <code>CALL Proc2</code></td><td>push 4651</td><td><strong>4651</strong>, 4101</td><td>4800</td></tr>
<tr><td>(f)</td><td>After <code>RETURN</code></td><td>pop → 4651</td><td><strong>4101</strong></td><td>4651</td></tr>
<tr><td>(g)</td><td>After <code>RETURN</code></td><td>pop → 4101</td><td>(empty)</td><td>4101 — back in Main</td></tr>
</table>
<ul>
<li><strong>Look at (c) and (e) side by side — that is the whole point of the figure.</strong> The same instruction <code>RETURN</code> inside Proc2 sends control to 4601 in panel (d) and to 4651 in panel (f). Nothing inside Proc2 changed. The difference came entirely from what the caller had pushed.</li>
<li><strong>4101 sits at the bottom the whole time and is never disturbed.</strong> That is the register solution's failure, repaired: the deeper call pushes <em>on top of</em> the outer call's saved address instead of over it.</li>
<li><strong>LIFO exactly matches nesting.</strong> The most recently started procedure is always the first to finish, so the most recently pushed address is always the first one needed. The order a stack gives you is not a coincidence — it is the same order the calls have.</li>
</ul>
<p class="nhan">📐 <strong>Your turn — a three-deep hand trace</strong>, the shape most likely to be asked. Program: <code>main</code> has <code>CALL P1</code> at 1020; <code>P1</code> starts at 2000 and has <code>CALL P2</code> at 2040; <code>P2</code> starts at 3000 and has <code>CALL P3</code> at 3060; <code>P3</code> starts at 4000 and its <code>RETURN</code> is at 4030. Each instruction occupies one address.</p>
<table>
<tr><th>Step</th><th>Instruction executing</th><th>Stack operation</th><th>Stack afterwards (top → bottom)</th><th>PC after the step</th></tr>
<tr><td>1</td><td>1020 <code>CALL P1</code></td><td>push 1021</td><td>1021</td><td>2000</td></tr>
<tr><td>2</td><td>2040 <code>CALL P2</code></td><td>push 2041</td><td>2041 · 1021</td><td>3000</td></tr>
<tr><td>3</td><td>3060 <code>CALL P3</code></td><td>push 3061</td><td>3061 · 2041 · 1021</td><td>4000</td></tr>
<tr><td>4</td><td>4030 <code>RETURN</code> (in P3)</td><td>pop → 3061</td><td>2041 · 1021</td><td><strong>3061</strong></td></tr>
<tr><td>5</td><td><code>RETURN</code> (in P2)</td><td>pop → 2041</td><td>1021</td><td><strong>2041</strong></td></tr>
<tr><td>6</td><td><code>RETURN</code> (in P1)</td><td>pop → 1021</td><td>(empty)</td><td><strong>1021</strong> — back in main</td></tr>
</table>
<p class="dap-an">✅ Answer: the stack reaches a maximum depth of <strong>3</strong>, the return addresses come back in the order <strong>3061 → 2041 → 1021</strong> — exactly the reverse of the order they were pushed — and the program resumes at 1021, the instruction after the original <code>CALL P1</code>. Depth of the stack = current nesting depth; that equality is worth memorising.</p>
<p class="nhan">📐 <strong>Measured on the real machine.</strong> A C program with exactly this shape (<code>main → P1 → P2 → P3</code>) printed <code>__builtin_frame_address(0)</code> and <code>__builtin_return_address(0)</code> at each level (<code>cc -Wall -O0</code>, Apple M1 Max):</p>
<table>
<tr><th>Function</th><th>Frame address</th><th>Return address</th><th>Where that return address points</th></tr>
<tr><td>main</td><td>0x16d1a23b0</td><td>0x18ee044e4</td><td>into the C runtime that called main</td></tr>
<tr><td>P1</td><td>0x16d1a2380</td><td>0x102c5c694</td><td>inside main</td></tr>
<tr><td>P2</td><td>0x16d1a2350</td><td>0x102c5c5a4</td><td>inside P1</td></tr>
<tr><td>P3</td><td>0x16d1a2320</td><td>0x102c5c54c</td><td>inside P2</td></tr>
</table>
<p class="dap-an">✅ Each nested call moved the frame down by exactly <strong>0x30 = 48 bytes</strong>, and each return address points back into its own caller — the six-row table above, in real hexadecimal. Note the direction: addresses <em>decrease</em> as the stack grows, which is why textbook stack diagrams are drawn growing upward while real addresses count downward. Both are correct; only the drawing convention differs.</p>
<p class="pitfall">⚠️ Two failure modes live in this table. Push without a matching pop and the stack grows without limit — <strong>stack overflow</strong> (the classic symptom of runaway recursion). Pop more than you pushed, or overwrite a saved return address with a too-long local array, and <code>RETURN</code> jumps to garbage — the <strong>buffer-overflow attack</strong>, which is nothing more than writing a chosen value into the slot this figure calls "4101".</p>`,
        `<p class="y-chinh">🎯 Slide ĐÁP ÁN. Bảy hình ngăn xếp nhỏ, (a) tới (g), mỗi hình là một khoảnh khắc trong lượt chạy của Figure 13.8. <strong>Ngăn xếp</strong> là kho LIFO (vào sau ra trước) với hai thao tác — <em>push</em> (đặt lên đỉnh) và <em>pop</em> (nhấc khỏi đỉnh) — và nó là cấu trúc DUY NHẤT làm đúng được chuyện gọi lồng nhau.</p>
<table>
<tr><th>Ô</th><th>Khoảnh khắc</th><th>Thao tác</th><th>Ngăn xếp SAU ĐÓ (đỉnh ghi trước)</th><th>PC nhảy tới</th></tr>
<tr><td>(a)</td><td>Nội dung ngăn xếp ban đầu</td><td>—</td><td>(rỗng)</td><td>—</td></tr>
<tr><td>(b)</td><td>Sau <code>CALL Proc1</code></td><td>push 4101</td><td><strong>4101</strong></td><td>4500</td></tr>
<tr><td>(c)</td><td><code>CALL Proc2</code> lần đầu</td><td>push 4601</td><td><strong>4601</strong>, 4101</td><td>4800</td></tr>
<tr><td>(d)</td><td>Sau <code>RETURN</code></td><td>pop → 4601</td><td><strong>4101</strong></td><td>4601</td></tr>
<tr><td>(e)</td><td>Sau <code>CALL Proc2</code> lần hai</td><td>push 4651</td><td><strong>4651</strong>, 4101</td><td>4800</td></tr>
<tr><td>(f)</td><td>Sau <code>RETURN</code></td><td>pop → 4651</td><td><strong>4101</strong></td><td>4651</td></tr>
<tr><td>(g)</td><td>Sau <code>RETURN</code></td><td>pop → 4101</td><td>(rỗng)</td><td>4101 — về lại Main</td></tr>
</table>
<ul>
<li><strong>Đặt (c) và (e) cạnh nhau — đó là toàn bộ điểm của cái hình.</strong> Cùng MỘT lệnh <code>RETURN</code> bên trong Proc2 đưa điều khiển về 4601 ở ô (d) và về 4651 ở ô (f). Bên trong Proc2 không có gì thay đổi cả. Khác biệt hoàn toàn đến từ thứ mà NGƯỜI GỌI đã đẩy vào.</li>
<li><strong>4101 nằm ở đáy suốt cả quá trình và không hề bị động tới.</strong> Đó chính là chỗ gãy của giải pháp thanh ghi, nay đã được vá: lời gọi sâu hơn đẩy <em>LÊN TRÊN</em> địa chỉ đã lưu của lời gọi ngoài chứ không đè lên nó.</li>
<li><strong>LIFO khớp CHÍNH XÁC với tính lồng nhau.</strong> Thủ tục khởi động gần đây nhất luôn là thủ tục kết thúc sớm nhất, nên địa chỉ được đẩy vào gần đây nhất luôn là địa chỉ cần dùng đầu tiên. Thứ tự mà ngăn xếp trao cho bạn không phải là trùng hợp — nó ĐÚNG BẰNG thứ tự của các lời gọi.</li>
</ul>
<p class="nhan">📐 <strong>Đến lượt bạn — bảng chạy tay BA TẦNG</strong>, dạng hay được ra đề nhất. Chương trình: <code>main</code> có <code>CALL P1</code> ở 1020; <code>P1</code> bắt đầu ở 2000, có <code>CALL P2</code> ở 2040; <code>P2</code> bắt đầu ở 3000, có <code>CALL P3</code> ở 3060; <code>P3</code> bắt đầu ở 4000 và lệnh <code>RETURN</code> của nó ở 4030. Mỗi lệnh chiếm một địa chỉ.</p>
<table>
<tr><th>Bước</th><th>Lệnh đang chạy</th><th>Thao tác ngăn xếp</th><th>Ngăn xếp sau đó (đỉnh → đáy)</th><th>PC sau bước này</th></tr>
<tr><td>1</td><td>1020 <code>CALL P1</code></td><td>push 1021</td><td>1021</td><td>2000</td></tr>
<tr><td>2</td><td>2040 <code>CALL P2</code></td><td>push 2041</td><td>2041 · 1021</td><td>3000</td></tr>
<tr><td>3</td><td>3060 <code>CALL P3</code></td><td>push 3061</td><td>3061 · 2041 · 1021</td><td>4000</td></tr>
<tr><td>4</td><td>4030 <code>RETURN</code> (trong P3)</td><td>pop → 3061</td><td>2041 · 1021</td><td><strong>3061</strong></td></tr>
<tr><td>5</td><td><code>RETURN</code> (trong P2)</td><td>pop → 2041</td><td>1021</td><td><strong>2041</strong></td></tr>
<tr><td>6</td><td><code>RETURN</code> (trong P1)</td><td>pop → 1021</td><td>(rỗng)</td><td><strong>1021</strong> — về lại main</td></tr>
</table>
<p class="dap-an">✅ Đáp án: ngăn xếp đạt độ sâu tối đa <strong>3</strong>, các địa chỉ trở về quay ra theo thứ tự <strong>3061 → 2041 → 1021</strong> — đúng ngược lại thứ tự đã đẩy vào — và chương trình chạy tiếp ở 1021, tức lệnh ngay sau <code>CALL P1</code> ban đầu. Độ sâu ngăn xếp = độ sâu lồng nhau hiện tại; đẳng thức đó đáng thuộc lòng.</p>
<p class="nhan">📐 <strong>ĐO THẬT trên máy.</strong> Một chương trình C đúng hình dạng này (<code>main → P1 → P2 → P3</code>) in ra <code>__builtin_frame_address(0)</code> và <code>__builtin_return_address(0)</code> ở từng tầng (<code>cc -Wall -O0</code>, Apple M1 Max):</p>
<table>
<tr><th>Hàm</th><th>Địa chỉ khung</th><th>Địa chỉ trở về</th><th>Địa chỉ trở về đó trỏ vào đâu</th></tr>
<tr><td>main</td><td>0x16d1a23b0</td><td>0x18ee044e4</td><td>vào thư viện chạy C đã gọi main</td></tr>
<tr><td>P1</td><td>0x16d1a2380</td><td>0x102c5c694</td><td>bên trong main</td></tr>
<tr><td>P2</td><td>0x16d1a2350</td><td>0x102c5c5a4</td><td>bên trong P1</td></tr>
<tr><td>P3</td><td>0x16d1a2320</td><td>0x102c5c54c</td><td>bên trong P2</td></tr>
</table>
<p class="dap-an">✅ Mỗi lời gọi lồng thêm làm khung tụt xuống đúng <strong>0x30 = 48 byte</strong>, và mỗi địa chỉ trở về đều trỏ ngược vào chính người gọi nó — đúng bảng sáu dòng ở trên, bằng số thập lục thật. Để ý CHIỀU: địa chỉ <em>GIẢM</em> khi ngăn xếp lớn lên, nên sơ đồ ngăn xếp trong sách vẽ mọc LÊN trong khi địa chỉ thật đếm XUỐNG. Cả hai đều đúng; chỉ khác quy ước vẽ.</p>
<p class="pitfall">⚠️ Hai kiểu hỏng nằm ngay trong bảng này. Push mà không có pop tương ứng thì ngăn xếp lớn mãi không thôi — <strong>tràn ngăn xếp</strong> (triệu chứng kinh điển của đệ quy không có điểm dừng). Pop nhiều hơn số đã push, hoặc ghi đè lên một địa chỉ trở về đã lưu bằng một mảng cục bộ quá dài, thì <code>RETURN</code> nhảy vào rác — <strong>tấn công tràn bộ đệm</strong>, mà thực chất chỉ là ghi một giá trị do kẻ tấn công chọn vào đúng cái ô mà hình này gọi là "4101".</p>`],

      [39, 'Figure 13.10 — Stack Frame Growth Using Sample Procedures P and Q',
        `<p class="y-chinh">🎯 The stack does not hold only return addresses. This figure shows what a real call actually pushes: a <strong>stack frame</strong> (also called an activation record) per active procedure. Panel (a) is "P is active"; panel (b) is "P has called Q".</p>
<table>
<tr><th>Panel (a) — P is active</th><th>Panel (b) — P has called Q</th></tr>
<tr><td>x2 ← Stack Pointer</td><td>y2 ← Stack Pointer</td></tr>
<tr><td>x1</td><td>y1</td></tr>
<tr><td>Old Frame Pointer ← Frame Pointer</td><td>Old Frame Pointer ← Frame Pointer</td></tr>
<tr><td>Return Point (labelled P:)</td><td>Return Point (labelled Q:)</td></tr>
<tr><td></td><td>x2</td></tr>
<tr><td></td><td>x1</td></tr>
<tr><td></td><td>Old Frame Pointer</td></tr>
<tr><td></td><td>Return Point (labelled P:)</td></tr>
</table>
<ul>
<li><strong>Four things in every frame, read straight off the figure.</strong> The <em>Return Point</em> (where to go when this procedure finishes), the <em>Old Frame Pointer</em> (where the caller's frame was), and the procedure's <em>local variables</em> — x1 and x2 for P, y1 and y2 for Q. Parameters live here too, just below or above depending on the calling convention.</li>
<li><strong>Two pointers, two jobs.</strong> The <strong>Stack Pointer (SP)</strong> marks the top — it moves on every push and pop. The <strong>Frame Pointer (FP)</strong> marks a fixed anchor inside the <em>current</em> frame, so local variables can be addressed as "FP minus 4", "FP minus 8" and so on even while SP keeps moving. Without FP, every local-variable address would have to be recomputed each time the stack shifted.</li>
<li><strong>The "Old Frame Pointer" field is a linked list through the stack.</strong> Each frame stores the address of the previous frame, so from the current FP you can walk back through every active call. That chain is exactly what a debugger prints when it shows you a stack trace, and what a crash report calls the "backtrace".</li>
<li><strong>This is why recursion works, in one sentence.</strong> Each call creates a <em>new</em> frame with its <em>own</em> copy of the locals, so <code>f</code> calling <code>f</code> does not disturb the outer <code>f</code>'s variables; the frames are stacked, and returns unwind them in exact reverse order. A language without a stack (early FORTRAN, which allocated locals statically) literally could not support recursion.</li>
<li><strong>Frames are created and destroyed, not reused.</strong> Panel (b) shows Q's frame stacked above P's. When Q returns, SP moves back down and Q's frame simply ceases to exist — the bytes are still there but belong to nobody. This is the hardware reality behind "do not return a pointer to a local variable" in PRF192.</li>
</ul>
<p class="nhan">📐 <strong>Measured, from real compiled code</strong> (<code>cc -O0 -c</code> then <code>otool -tv</code>, arm64). A leaf procedure and a non-leaf procedure compile differently, and the difference is exactly this figure:</p>
<pre>_P3:                                  ; la — KHONG goi ai
        sub     sp, sp, #0x10         ; chi cap cho bien cuc bo
        ...
        ret
_P2:                                  ; co goi P3
        sub     sp, sp, #0x20
        stp     x29, x30, [sp, #0x10] ; LUU "Old Frame Pointer" (x29) + "Return Point" (x30)
        add     x29, sp, #0x10        ; dat Frame Pointer moi
        ...
        bl      _P3
        ...
        ldp     x29, x30, [sp, #0x10] ; khoi phuc ca hai
        add     sp, sp, #0x20
        ret</pre>
<p class="dap-an">✅ The single instruction <code>stp x29, x30, [sp, #0x10]</code> pushes <strong>both</strong> boxes the figure names — <em>Old Frame Pointer</em> (x29) and <em>Return Point</em> (x30, the link register) — and <code>add x29, sp, #0x10</code> is the figure's Frame Pointer arrow being drawn. The leaf procedure <code>P3</code> omits both because it never calls anything, so nothing can overwrite its return address. Figure 13.10 is not a teaching abstraction; it is the literal shape of the code your compiler emits.</p>
<p class="nhan">📐 And the recursion claim, measured: <code>factorial(5)</code> instrumented to print its own frame address produced <strong>five distinct frames</strong> — 0x16d1a2380, 0x16d1a2330, 0x16d1a22e0, 0x16d1a2290, 0x16d1a2240 — spaced exactly 0x50 = 80 bytes apart, and returned 120.</p>
<p class="pitfall">⚠️ Exam trap: the stack holds <em>activations</em>, not <em>procedures</em>. Two frames for P can be on the stack at once (that is recursion) and a procedure that has been called a thousand times has zero frames if it has returned each time. "How many frames are on the stack?" always means "how many calls are currently unfinished?"</p>`,
        `<p class="y-chinh">🎯 Ngăn xếp không chỉ chứa địa chỉ trở về. Hình này cho thấy một lời gọi thật sự đẩy vào những gì: một <strong>KHUNG NGĂN XẾP</strong> (stack frame, còn gọi là bản ghi kích hoạt) cho mỗi thủ tục đang hoạt động. Ô (a) là "P đang hoạt động"; ô (b) là "P đã gọi Q".</p>
<table>
<tr><th>Ô (a) — P đang hoạt động</th><th>Ô (b) — P đã gọi Q</th></tr>
<tr><td>x2 ← Stack Pointer (con trỏ đỉnh)</td><td>y2 ← Stack Pointer</td></tr>
<tr><td>x1</td><td>y1</td></tr>
<tr><td>Old Frame Pointer ← Frame Pointer</td><td>Old Frame Pointer ← Frame Pointer</td></tr>
<tr><td>Return Point (nhãn P:)</td><td>Return Point (nhãn Q:)</td></tr>
<tr><td></td><td>x2</td></tr>
<tr><td></td><td>x1</td></tr>
<tr><td></td><td>Old Frame Pointer</td></tr>
<tr><td></td><td>Return Point (nhãn P:)</td></tr>
</table>
<ul>
<li><strong>Bốn thứ trong mỗi khung, đọc thẳng từ hình.</strong> <em>Return Point</em> (đi đâu khi thủ tục này xong), <em>Old Frame Pointer</em> (khung của người gọi nằm ở đâu), và các <em>BIẾN CỤC BỘ</em> của thủ tục — x1, x2 cho P và y1, y2 cho Q. Tham số cũng sống ở đây, nằm ngay dưới hoặc ngay trên tuỳ quy ước gọi.</li>
<li><strong>Hai con trỏ, hai nhiệm vụ.</strong> <strong>Stack Pointer (SP)</strong> đánh dấu ĐỈNH — nó dịch ở mỗi lần push và pop. <strong>Frame Pointer (FP)</strong> đánh dấu một cái neo CỐ ĐỊNH bên trong khung <em>HIỆN TẠI</em>, nhờ đó biến cục bộ được định địa chỉ kiểu "FP trừ 4", "FP trừ 8"… ngay cả khi SP vẫn đang chạy tới chạy lui. Không có FP thì mỗi lần ngăn xếp xê dịch là phải tính lại địa chỉ của mọi biến cục bộ.</li>
<li><strong>Ô "Old Frame Pointer" là một DANH SÁCH LIÊN KẾT xuyên qua ngăn xếp.</strong> Mỗi khung lưu địa chỉ của khung trước nó, nên từ FP hiện tại là đi ngược lại được qua toàn bộ các lời gọi đang hoạt động. Chuỗi liên kết đó chính là thứ trình gỡ lỗi in ra khi nó cho bạn xem "stack trace", và là thứ mà báo cáo sự cố gọi là "backtrace".</li>
<li><strong>Đây là lý do ĐỆ QUY chạy được, gói trong một câu.</strong> Mỗi lời gọi tạo một khung MỚI với bản sao RIÊNG của các biến cục bộ, nên <code>f</code> gọi <code>f</code> không hề đụng tới biến của <code>f</code> ở tầng ngoài; các khung chồng lên nhau, và các lần trả về tháo chúng ra theo đúng thứ tự ngược. Một ngôn ngữ không có ngăn xếp (FORTRAN thời đầu, cấp phát biến cục bộ TĨNH) theo đúng nghĩa đen là KHÔNG hỗ trợ nổi đệ quy.</li>
<li><strong>Khung được TẠO RA rồi HUỶ ĐI, không phải dùng lại.</strong> Ô (b) cho thấy khung của Q chồng lên khung của P. Khi Q trả về, SP lùi xuống và khung của Q đơn giản là NGỪNG TỒN TẠI — các byte vẫn còn đó nhưng không thuộc về ai. Đây chính là hiện thực phần cứng đằng sau lời dặn "đừng trả về con trỏ tới biến cục bộ" ở PRF192.</li>
</ul>
<p class="nhan">📐 <strong>ĐO THẬT, từ mã đã biên dịch</strong> (<code>cc -O0 -c</code> rồi <code>otool -tv</code>, arm64). Một thủ tục LÁ và một thủ tục KHÔNG LÁ được dịch khác nhau, và khác biệt đó đúng bằng cái hình này:</p>
<pre>_P3:                                  ; la — KHONG goi ai
        sub     sp, sp, #0x10         ; chi cap cho bien cuc bo
        ...
        ret
_P2:                                  ; co goi P3
        sub     sp, sp, #0x20
        stp     x29, x30, [sp, #0x10] ; LUU "Old Frame Pointer" (x29) + "Return Point" (x30)
        add     x29, sp, #0x10        ; dat Frame Pointer moi
        ...
        bl      _P3
        ...
        ldp     x29, x30, [sp, #0x10] ; khoi phuc ca hai
        add     sp, sp, #0x20
        ret</pre>
<p class="dap-an">✅ Đúng một lệnh <code>stp x29, x30, [sp, #0x10]</code> đẩy vào <strong>CẢ HAI</strong> ô mà hình gọi tên — <em>Old Frame Pointer</em> (x29) và <em>Return Point</em> (x30, thanh ghi liên kết) — còn <code>add x29, sp, #0x10</code> chính là mũi tên Frame Pointer trên hình đang được vẽ ra. Thủ tục lá <code>P3</code> bỏ cả hai vì nó không gọi ai cả, nên không có gì ghi đè lên địa chỉ trở về của nó được. Figure 13.10 không phải là mô hình để dạy học; nó là hình dạng ĐÚNG NGHĨA ĐEN của mã mà trình biên dịch của bạn sinh ra.</p>
<p class="nhan">📐 Và khẳng định về đệ quy, cũng đo thật: <code>giai_thua(5)</code> được cài thêm lệnh in địa chỉ khung của chính nó đã cho ra <strong>NĂM khung riêng biệt</strong> — 0x16d1a2380, 0x16d1a2330, 0x16d1a22e0, 0x16d1a2290, 0x16d1a2240 — cách nhau đúng 0x50 = 80 byte, và trả về 120.</p>
<p class="pitfall">⚠️ Bẫy đề thi: ngăn xếp chứa các <em>LẦN KÍCH HOẠT</em>, không chứa các <em>THỦ TỤC</em>. Hai khung của cùng P có thể cùng nằm trên ngăn xếp (đó là đệ quy), còn một thủ tục đã bị gọi một nghìn lần thì có KHÔNG khung nào nếu lần nào nó cũng đã trả về. Câu hỏi "trên ngăn xếp có mấy khung?" luôn có nghĩa là "hiện có mấy lời gọi CHƯA kết thúc?"</p>`],

      [40, 'x86 Operation Types',
        `<p class="y-chinh">🎯 The chapter turns to a real instruction set. The x86 provides a <strong>complex array of operation types including a number of specialized instructions</strong>; the stated intent was "to provide tools for the compiler writer to produce optimized machine language translation of high-level language programs". That sentence is the CISC philosophy in one line.</p>
<ul>
<li><strong>Four instructions support procedure call and return:</strong> <code>CALL</code>, <code>ENTER</code>, <code>LEAVE</code>, <code>RETURN</code>. Two for control flow, two for the stack frame — precisely the two halves of Figure 13.10.</li>
<li><strong>The four steps the slide says must happen on entry to a new procedure</strong> — memorise these in order, they are frequently asked. (1) <strong>Push the return point on the stack</strong>. (2) <strong>Push the current frame pointer on the stack</strong>. (3) <strong>Copy the stack pointer as the new value of the frame pointer</strong>. (4) <strong>Adjust the stack pointer to allocate a frame</strong>.</li>
<li><strong>Map those four steps onto Figure 13.10 and they stop being a list.</strong> Step 1 writes the box labelled "Return Point". Step 2 writes the box labelled "Old Frame Pointer". Step 3 draws the "Frame Pointer" arrow at the new frame. Step 4 moves the "Stack Pointer" arrow up far enough to make room for x1 and x2. Four steps, four features of the picture.</li>
<li><strong><code>ENTER</code> is one instruction that performs steps 2, 3 and 4.</strong> That is the CISC bargain made concrete: a single opcode replaces three. <code>LEAVE</code> undoes it. Chapter 13 (RISC) will argue the opposite case — that these compound instructions are rarely used exactly as designed, and that three simple instructions the compiler can schedule beat one complicated one.</li>
</ul>
<p class="nhan">📐 <strong>Verified by disassembling real compiled code</strong> (<code>cc -O0 -c -arch x86_64</code>, then <code>otool -tv</code>). Here is a non-leaf procedure's prologue on x86-64, next to the slide's four steps:</p>
<table>
<tr><th>Slide step</th><th>Instruction emitted</th><th>What it does</th></tr>
<tr><td>(1) push the return point</td><td><code>callq</code> in the <em>caller</em></td><td>done implicitly by CALL — it pushes the address of the next instruction</td></tr>
<tr><td>(2) push the current frame pointer</td><td><code>pushq %rbp</code></td><td>saves the caller's frame pointer</td></tr>
<tr><td>(3) copy SP into FP</td><td><code>movq %rsp, %rbp</code></td><td>the new frame pointer</td></tr>
<tr><td>(4) adjust SP to allocate a frame</td><td><code>subq $0x10, %rsp</code></td><td>16 bytes of locals</td></tr>
<tr><td>on exit</td><td><code>addq $0x10, %rsp</code> · <code>popq %rbp</code> · <code>retq</code></td><td>undoes 4, then 3+2, then 1</td></tr>
</table>
<p class="dap-an">✅ The four steps appear in the compiled output <strong>in exactly the slide's order</strong>, and the exit sequence undoes them in exactly reverse order. Also measured: the <code>callq</code> at offset 0x3e is followed by an instruction at 0x43, so the pushed return address is <strong>0x43</strong> — five bytes on, because a near <code>CALL</code> with a 32-bit displacement is 5 bytes long. That is the "+1" of Figure 13.8 with real instruction lengths.</p>
<p class="nhan">📐 <strong>CISC versus RISC, measured on the same source.</strong> The same C function compiled for both targets, instruction lengths taken from the disassembly addresses: <strong>arm64 = {4} bytes</strong> for all twelve instructions, with no exceptions; <strong>x86-64 = {1, 2, 3} bytes</strong> in that function, and a single <code>movabsq $0x1122334455667788, %rcx</code> elsewhere measured <strong>10 bytes</strong> long. The architectural range for x86 is 1 to 15 bytes; ARM in its A32/A64 encodings is fixed at 4. Chapter 13 (RISC) is the chapter that argues about which is better; here just record the measurement.</p>
<p class="pitfall">⚠️ Do not say "x86 has variable-length instructions because it is old". It has them because it packs an enormous opcode space plus optional prefixes, ModR/M, SIB, displacement and immediate fields into each instruction — the very generality that step-saving instructions such as <code>ENTER</code> require. Variable length is the <em>price</em> of CISC, not an accident of history, and the cost is paid in the decoder every single cycle.</p>`,
        `<p class="y-chinh">🎯 Chương quay sang một tập lệnh THẬT. x86 cung cấp <strong>một mảng phức tạp các loại phép toán, gồm cả một số lệnh chuyên dụng</strong>; ý đồ được nêu rõ là "cung cấp công cụ cho người viết trình biên dịch để sinh ra bản dịch mã máy tối ưu cho chương trình viết bằng ngôn ngữ bậc cao". Câu đó chính là triết lý CISC gói trong một dòng.</p>
<ul>
<li><strong>Bốn lệnh phục vụ gọi và trả về thủ tục:</strong> <code>CALL</code>, <code>ENTER</code>, <code>LEAVE</code>, <code>RETURN</code>. Hai cái lo luồng điều khiển, hai cái lo khung ngăn xếp — đúng hai nửa của Figure 13.10.</li>
<li><strong>Bốn bước mà slide nói PHẢI làm khi bước vào một thủ tục mới</strong> — thuộc theo đúng thứ tự, câu này hay được hỏi. (1) <strong>Đẩy ĐIỂM TRỞ VỀ lên ngăn xếp</strong>. (2) <strong>Đẩy CON TRỎ KHUNG HIỆN TẠI lên ngăn xếp</strong>. (3) <strong>Chép con trỏ ngăn xếp thành giá trị mới của con trỏ khung</strong>. (4) <strong>Chỉnh con trỏ ngăn xếp để cấp phát một khung</strong>.</li>
<li><strong>Ánh xạ bốn bước đó lên Figure 13.10 thì chúng thôi là một danh sách khô khan.</strong> Bước 1 ghi vào ô "Return Point". Bước 2 ghi vào ô "Old Frame Pointer". Bước 3 vẽ mũi tên "Frame Pointer" tại khung mới. Bước 4 đẩy mũi tên "Stack Pointer" lên đủ xa để chừa chỗ cho x1 và x2. Bốn bước, bốn chi tiết của bức hình.</li>
<li><strong><code>ENTER</code> là MỘT lệnh làm trọn các bước 2, 3 và 4.</strong> Đó là cuộc mặc cả CISC nói cụ thể ra: một mã lệnh thay cho ba. <code>LEAVE</code> làm ngược lại. Chương 13 (RISC) sẽ biện hộ cho phía đối lập — rằng những lệnh gộp kiểu này hiếm khi được dùng đúng như thiết kế, và rằng ba lệnh đơn giản mà trình biên dịch sắp xếp được sẽ thắng một lệnh phức tạp.</li>
</ul>
<p class="nhan">📐 <strong>KIỂM bằng cách dịch ngược mã đã biên dịch thật</strong> (<code>cc -O0 -c -arch x86_64</code> rồi <code>otool -tv</code>). Đây là phần mở đầu của một thủ tục không-lá trên x86-64, đặt cạnh bốn bước của slide:</p>
<table>
<tr><th>Bước trên slide</th><th>Lệnh được sinh ra</th><th>Nó làm gì</th></tr>
<tr><td>(1) đẩy điểm trở về</td><td><code>callq</code> nằm ở phía <em>NGƯỜI GỌI</em></td><td>CALL làm ngầm — nó đẩy địa chỉ của lệnh kế tiếp</td></tr>
<tr><td>(2) đẩy con trỏ khung hiện tại</td><td><code>pushq %rbp</code></td><td>lưu con trỏ khung của người gọi</td></tr>
<tr><td>(3) chép SP vào FP</td><td><code>movq %rsp, %rbp</code></td><td>con trỏ khung mới</td></tr>
<tr><td>(4) chỉnh SP để cấp khung</td><td><code>subq $0x10, %rsp</code></td><td>16 byte cho biến cục bộ</td></tr>
<tr><td>khi thoát</td><td><code>addq $0x10, %rsp</code> · <code>popq %rbp</code> · <code>retq</code></td><td>tháo bước 4, rồi 3+2, rồi 1</td></tr>
</table>
<p class="dap-an">✅ Bốn bước hiện ra trong mã biên dịch <strong>ĐÚNG THEO THỨ TỰ của slide</strong>, và đoạn thoát tháo chúng ra theo đúng thứ tự ngược. Đo thêm: lệnh <code>callq</code> ở độ dời 0x3e có lệnh kế tiếp ở 0x43, nên địa chỉ trở về được đẩy vào là <strong>0x43</strong> — xa hơn năm byte, vì một lệnh <code>CALL</code> gần với độ dời 32 bit dài 5 byte. Đó là cái "+1" của Figure 13.8 với độ dài lệnh THẬT.</p>
<p class="nhan">📐 <strong>CISC so với RISC, đo trên cùng một mã nguồn.</strong> Cùng một hàm C dịch cho cả hai đích, độ dài lệnh lấy từ địa chỉ trong bản dịch ngược: <strong>arm64 = {4} byte</strong> cho cả mười hai lệnh, không có ngoại lệ nào; <strong>x86-64 = {1, 2, 3} byte</strong> trong hàm đó, và một lệnh <code>movabsq $0x1122334455667788, %rcx</code> ở chỗ khác đo được dài <strong>10 byte</strong>. Dải theo kiến trúc của x86 là 1 tới 15 byte; ARM ở các mã hoá A32/A64 cố định 4 byte. Chương 13 (RISC) mới là chương tranh luận cái nào hơn; ở đây chỉ ghi lại phép đo.</p>
<p class="pitfall">⚠️ Đừng nói "x86 có lệnh dài ngắn khác nhau vì nó CŨ". Nó có như vậy vì nó nhồi vào mỗi lệnh một không gian mã lệnh khổng lồ cộng các tiền tố tuỳ chọn, ModR/M, SIB, trường độ dời và trường hằng số tức thì — chính cái tính tổng quát mà những lệnh gộp kiểu <code>ENTER</code> đòi hỏi. Độ dài thay đổi là <em>CÁI GIÁ</em> của CISC, không phải tai nạn lịch sử, và cái giá đó trả ở bộ giải mã, mỗi chu kỳ một lần.</p>`],

      [41, 'Table 13.8 — x86 Status Flags',
        `<p class="y-chinh">🎯 The six status bits of the x86 EFLAGS register — the exact bits that slide 34 promised, now named and defined. Every conditional jump on the next slide is a Boolean expression over this table.</p>
<table>
<tr><th>Bit</th><th>Name</th><th>Description on the slide</th></tr>
<tr><td>C</td><td>Carry</td><td>Indicates carrying or borrowing out of the <strong>leftmost bit position</strong> following an arithmetic operation. Also modified by some of the shift and rotate operations.</td></tr>
<tr><td>P</td><td>Parity</td><td>Parity of the <strong>least-significant byte</strong> of the result of an arithmetic or logic operation. 1 indicates <em>even</em> parity; 0 indicates <em>odd</em> parity.</td></tr>
<tr><td>A</td><td>Auxiliary Carry</td><td>Represents carrying or borrowing between <strong>half-bytes</strong> of an 8-bit arithmetic or logic operation. Used in binary-coded decimal arithmetic.</td></tr>
<tr><td>Z</td><td>Zero</td><td>Indicates that the result of an arithmetic or logic operation is <strong>0</strong>.</td></tr>
<tr><td>S</td><td>Sign</td><td>Indicates the <strong>sign</strong> of the result of an arithmetic or logic operation.</td></tr>
<tr><td>O</td><td>Overflow</td><td>Indicates an arithmetic <strong>overflow after an addition or subtraction for twos complement</strong> arithmetic.</td></tr>
</table>
<ul>
<li><strong>C and O are the two you must never confuse, and exams attack this.</strong> <em>Carry</em> reports overflow of the <strong>unsigned</strong> interpretation; <em>Overflow</em> reports overflow of the <strong>signed</strong> twos-complement interpretation. The processor sets both on every add, because it does not know which interpretation you meant — that decision belongs to the programmer and shows up in which conditional jump is chosen.</li>
<li><strong>Worked case, 8-bit.</strong> <code>0xFF + 0x01</code>. Unsigned: 255 + 1 = 256, which does not fit ⇒ <strong>C = 1</strong>. Signed: (−1) + (+1) = 0, which fits perfectly ⇒ <strong>O = 0</strong>. Same addition, same bits, two different verdicts.</li>
<li><strong>Opposite case.</strong> <code>0x7F + 0x01</code>. Unsigned: 127 + 1 = 128, fits in a byte ⇒ <strong>C = 0</strong>. Signed: +127 + 1 = +128, which does not exist in 8-bit twos complement ⇒ <strong>O = 1</strong>. Learn these two lines and the C/O distinction is permanent.</li>
<li><strong>A (auxiliary carry) exists for one job only.</strong> It reports a carry between bit 3 and bit 4 — the boundary between the two BCD digits packed into a byte (slide 12: "each decimal digit is represented by a 4-bit code with two digits stored per byte"). The decimal-adjust instructions read it to fix up packed-decimal arithmetic. If you never do BCD you will never look at A again.</li>
<li><strong>P (parity) is a fossil with a real past.</strong> One bit that says whether the low byte has an even number of 1s — the cheapest possible error check, which is why serial communications hardware used it. It survives for compatibility.</li>
</ul>
<p class="nhan">📐 Flag derivation done by machine, not asserted. A C program computed Z, S, C and O from a 32-bit subtraction exactly as the hardware does — <code>Z = (r == 0)</code>, <code>S = (r &lt; 0)</code>, <code>C = ((uint32_t)a &lt; (uint32_t)b)</code> (a borrow), <code>O = (64-bit difference ≠ 32-bit result)</code>:</p>
<table>
<tr><th>Operation</th><th>Z</th><th>S</th><th>C</th><th>O</th><th>Reading</th></tr>
<tr><td>5 − 5</td><td>1</td><td>0</td><td>0</td><td>0</td><td>equal</td></tr>
<tr><td>3 − 7</td><td>0</td><td>1</td><td>1</td><td>0</td><td>less than, both signed and unsigned</td></tr>
<tr><td>7 − 3</td><td>0</td><td>0</td><td>0</td><td>0</td><td>greater than</td></tr>
<tr><td>(−2147483648) − 1</td><td>0</td><td>0</td><td>0</td><td><strong>1</strong></td><td>result wrapped to +2147483647 — the flag is the only warning</td></tr>
</table>
<p class="dap-an">✅ Row 4 is the point of the whole table. The subtraction produced a <em>positive</em> result from a smaller-minus-larger, so S alone is a lie; O = 1 is the hardware saying "do not trust the sign bit". The next slide turns this into the rule S ≠ O.</p>
<p class="pitfall">⚠️ The flags are set by <em>arithmetic and logic</em> instructions, not by <code>MOV</code>. Copying a negative number into a register does <strong>not</strong> set the Sign flag — nothing was computed. This trips up nearly everyone writing their first assembly: you must put a <code>CMP</code> or <code>TEST</code> immediately before the conditional jump.</p>`,
        `<p class="y-chinh">🎯 Sáu bit trạng thái trong thanh ghi EFLAGS của x86 — đúng những bit mà slide 34 đã hứa, nay được đặt tên và định nghĩa. Mọi lệnh nhảy có điều kiện ở slide sau đều là một biểu thức Boole trên bảng này.</p>
<table>
<tr><th>Bit</th><th>Tên</th><th>Mô tả trên slide</th></tr>
<tr><td>C</td><td>Carry (nhớ)</td><td>Báo có nhớ hoặc có mượn ra khỏi <strong>vị trí bit trái cùng</strong> sau một phép số học. Cũng bị một số phép dịch và quay sửa đổi.</td></tr>
<tr><td>P</td><td>Parity (chẵn lẻ)</td><td>Tính chẵn lẻ của <strong>byte thấp nhất</strong> của kết quả phép số học hoặc logic. 1 nghĩa là chẵn; 0 nghĩa là lẻ.</td></tr>
<tr><td>A</td><td>Auxiliary Carry (nhớ phụ)</td><td>Thể hiện có nhớ hoặc có mượn giữa hai <strong>nửa byte</strong> của phép số học/logic 8 bit. Dùng trong số học BCD.</td></tr>
<tr><td>Z</td><td>Zero (không)</td><td>Báo kết quả của phép số học hoặc logic bằng <strong>0</strong>.</td></tr>
<tr><td>S</td><td>Sign (dấu)</td><td>Báo <strong>DẤU</strong> của kết quả phép số học hoặc logic.</td></tr>
<tr><td>O</td><td>Overflow (tràn)</td><td>Báo <strong>TRÀN SỐ HỌC sau một phép cộng hoặc trừ theo số bù hai</strong>.</td></tr>
</table>
<ul>
<li><strong>C và O là hai cái không bao giờ được lẫn, và đề thi đánh đúng chỗ này.</strong> <em>Carry</em> báo tràn của cách hiểu <strong>KHÔNG DẤU</strong>; <em>Overflow</em> báo tràn của cách hiểu <strong>CÓ DẤU</strong> (bù hai). Bộ xử lý đặt CẢ HAI ở mọi phép cộng, vì nó không biết bạn định hiểu theo kiểu nào — quyết định đó thuộc về lập trình viên và lộ ra ở chỗ chọn lệnh nhảy có điều kiện nào.</li>
<li><strong>Ca giải mẫu, 8 bit.</strong> <code>0xFF + 0x01</code>. Không dấu: 255 + 1 = 256, không lọt ⇒ <strong>C = 1</strong>. Có dấu: (−1) + (+1) = 0, lọt hoàn hảo ⇒ <strong>O = 0</strong>. Cùng một phép cộng, cùng những bit đó, hai phán quyết khác nhau.</li>
<li><strong>Ca ngược lại.</strong> <code>0x7F + 0x01</code>. Không dấu: 127 + 1 = 128, lọt trong một byte ⇒ <strong>C = 0</strong>. Có dấu: +127 + 1 = +128, số này không tồn tại trong bù hai 8 bit ⇒ <strong>O = 1</strong>. Thuộc hai dòng này thì phân biệt C/O là vĩnh viễn.</li>
<li><strong>A (nhớ phụ) tồn tại cho đúng một việc.</strong> Nó báo có nhớ giữa bit 3 và bit 4 — đúng ranh giới giữa hai chữ số BCD nén trong một byte (slide 12: "mỗi chữ số thập phân biểu diễn bằng một mã 4 bit, hai chữ số một byte"). Các lệnh hiệu chỉnh thập phân đọc nó để sửa lại kết quả số học thập phân nén. Không bao giờ làm BCD thì bạn cũng không bao giờ nhìn lại cờ A.</li>
<li><strong>P (chẵn lẻ) là một hoá thạch nhưng có quá khứ thật.</strong> Một bit nói byte thấp có số bit 1 chẵn hay lẻ — phép kiểm lỗi rẻ nhất có thể, và đó là lý do phần cứng truyền thông nối tiếp từng dùng nó. Nó còn sống vì lý do tương thích.</li>
</ul>
<p class="nhan">📐 Cờ được SUY RA BẰNG MÁY, không phải phán bừa. Một chương trình C tính Z, S, C, O từ một phép trừ 32 bit đúng như phần cứng làm — <code>Z = (r == 0)</code>, <code>S = (r &lt; 0)</code>, <code>C = ((uint32_t)a &lt; (uint32_t)b)</code> (có mượn), <code>O = (hiệu 64 bit ≠ kết quả 32 bit)</code>:</p>
<table>
<tr><th>Phép tính</th><th>Z</th><th>S</th><th>C</th><th>O</th><th>Đọc ra sao</th></tr>
<tr><td>5 − 5</td><td>1</td><td>0</td><td>0</td><td>0</td><td>bằng nhau</td></tr>
<tr><td>3 − 7</td><td>0</td><td>1</td><td>1</td><td>0</td><td>nhỏ hơn, cả theo có dấu lẫn không dấu</td></tr>
<tr><td>7 − 3</td><td>0</td><td>0</td><td>0</td><td>0</td><td>lớn hơn</td></tr>
<tr><td>(−2147483648) − 1</td><td>0</td><td>0</td><td>0</td><td><strong>1</strong></td><td>kết quả cuộn thành +2147483647 — cái cờ là lời cảnh báo DUY NHẤT</td></tr>
</table>
<p class="dap-an">✅ Dòng 4 là điểm cốt tử của cả bảng. Phép trừ cho ra kết quả <em>DƯƠNG</em> từ một phép "nhỏ trừ lớn", nên riêng cờ S là một lời nói dối; O = 1 chính là phần cứng bảo "đừng tin bit dấu". Slide sau biến chuyện này thành quy tắc S ≠ O.</p>
<p class="pitfall">⚠️ Cờ được đặt bởi lệnh <em>SỐ HỌC và LOGIC</em>, KHÔNG phải bởi <code>MOV</code>. Chép một số âm vào thanh ghi <strong>KHÔNG</strong> làm bật cờ Sign — có tính toán gì đâu. Chỗ này vấp ngã gần như tất cả những ai viết hợp ngữ lần đầu: bạn PHẢI đặt một lệnh <code>CMP</code> hoặc <code>TEST</code> ngay trước lệnh nhảy có điều kiện.</p>`],

      [42, 'Table 13.9 — x86 Condition Codes for Conditional Jump and SETcc Instructions',
        `<p class="y-chinh">🎯 The lookup table that turns flags into jumps. Sixteen rows, and the structure you must see is that they fall into <strong>two families</strong>: unsigned comparisons built from C and Z, and signed comparisons built from S, O and Z.</p>
<table>
<tr><th>Symbol</th><th>Condition tested</th><th>Meaning</th><th>Family</th></tr>
<tr><td>A, NBE</td><td>C = 0 AND Z = 0</td><td>Above (greater than, unsigned)</td><td>unsigned</td></tr>
<tr><td>AE, NB, NC</td><td>C = 0</td><td>Above or equal; not carry</td><td>unsigned</td></tr>
<tr><td>B, NAE, C</td><td>C = 1</td><td>Below (less than, unsigned); carry set</td><td>unsigned</td></tr>
<tr><td>BE, NA</td><td>C = 1 OR Z = 1</td><td>Below or equal</td><td>unsigned</td></tr>
<tr><td>E, Z</td><td>Z = 1</td><td>Equal; zero (signed or unsigned)</td><td>both</td></tr>
<tr><td>NE, NZ</td><td>Z = 0</td><td>Not equal (signed or unsigned)</td><td>both</td></tr>
<tr><td>G, NLE</td><td>[(S = 1 AND O = 1) OR (S = 0 AND O = 0)] AND [Z = 0]</td><td>Greater than (signed)</td><td>signed</td></tr>
<tr><td>GE, NL</td><td>(S = 1 AND O = 1) OR (S = 0 AND O = 0)</td><td>Greater than or equal (signed)</td><td>signed</td></tr>
<tr><td>L, NGE</td><td>(S = 1 AND O = 0) OR (S = 0 AND O = 0)  ← <em>see the warning below</em></td><td>Less than (signed)</td><td>signed</td></tr>
<tr><td>LE, NG</td><td>(S = 1 AND O = 0) OR (S = 0 AND O = 1) OR (Z = 1)</td><td>Less than or equal (signed)</td><td>signed</td></tr>
<tr><td>O · NO</td><td>O = 1 · O = 0</td><td>Overflow · no overflow</td><td>flag test</td></tr>
<tr><td>S · NS</td><td>S = 1 · S = 0</td><td>Sign (negative) · not negative</td><td>flag test</td></tr>
<tr><td>P · NP, PO</td><td>P = 1 · P = 0</td><td>Parity even · parity odd</td><td>flag test</td></tr>
</table>
<p class="pitfall">⚠️ <strong>The slide contains an error, and it is in the "L, NGE" row.</strong> As printed, the condition is "(S = 1 AND O = 0) OR (S = 0 AND O = <strong>0</strong>)". The second clause must be (S = 0 AND O = <strong>1</strong>). You can prove the printed version wrong without any outside source: as printed, <strong>L and GE are both true at (S = 0, O = 0)</strong> — a number cannot be simultaneously "less than" and "greater than or equal to" another. The correct rule is the compact one: <strong>L is true exactly when S ≠ O</strong>, and GE exactly when S = O. Compare the <em>correct</em> LE row two lines below, which does have (S = 0 AND O = 1) — the slide got its own sibling row right. Do not silently copy the printed version into an exam answer; state the rule as S ≠ O.</p>
<ul>
<li><strong>The two families exist because one subtraction serves two number systems.</strong> After <code>CMP a, b</code>, the machine cannot know whether you meant a and b as signed or unsigned. So it offers you two sets of jumps over the same flags, and <em>your choice of mnemonic is where you declare the interpretation</em>. Picking <code>JB</code> when you meant <code>JL</code> is a real, silent bug.</li>
<li><strong>Memorise the vocabulary split — it is free marks.</strong> Unsigned comparisons use <strong>Above / Below</strong>; signed comparisons use <strong>Greater / Less</strong>. Intel chose different English words on purpose so that a reader can tell at a glance which interpretation the code assumes.</li>
<li><strong>Why unsigned "below" is just C = 1.</strong> A borrow out of the top bit means the minuend was smaller. One flag, one test — unsigned comparison is trivially cheap.</li>
<li><strong>Why signed comparison needs S ≠ O.</strong> The sign bit tells the truth only when the subtraction did not overflow. When it did, the sign bit is inverted from the true answer, and O is exactly the bit that records this — so XOR them.</li>
<li><strong><code>SETcc</code> is the same table without a jump.</strong> Instead of branching, <code>SETcc</code> writes 1 or 0 into a byte. That is how a C expression such as <code>int r = (a &lt; b);</code> is compiled without any branch at all — which matters enormously for the pipeline of Chapter 12, because a branch that is not there cannot be mispredicted.</li>
</ul>
<p class="nhan">📐 Verified against the measured flag table of slide 34. For <code>CMP(−2147483648, 1)</code> the run gave S = 0, O = 1. Apply the rules: <code>JB</code> (C = 1) does <strong>not</strong> jump — correct, since as <em>unsigned</em> 0x80000000 = 2 147 483 648 really is above 1. <code>JL</code> (S ≠ O ⇒ 0 ≠ 1 ⇒ true) <strong>does</strong> jump — correct, since as <em>signed</em> −2 147 483 648 really is below 1.</p>
<p class="dap-an">✅ One pair of numbers, one <code>CMP</code>, two opposite and both correct answers. That single measured example is the best possible proof that the signed/unsigned split in this table is necessary and not pedantry.</p>`,
        `<p class="y-chinh">🎯 Bảng tra biến CỜ thành LỆNH NHẢY. Mười sáu dòng, và cấu trúc bạn phải nhìn ra là chúng chia thành <strong>HAI HỌ</strong>: so sánh KHÔNG DẤU dựng từ C và Z, và so sánh CÓ DẤU dựng từ S, O và Z.</p>
<table>
<tr><th>Ký hiệu</th><th>Điều kiện kiểm</th><th>Nghĩa</th><th>Họ</th></tr>
<tr><td>A, NBE</td><td>C = 0 AND Z = 0</td><td>Above — lớn hơn (không dấu)</td><td>không dấu</td></tr>
<tr><td>AE, NB, NC</td><td>C = 0</td><td>Lớn hơn hoặc bằng; không có nhớ</td><td>không dấu</td></tr>
<tr><td>B, NAE, C</td><td>C = 1</td><td>Below — nhỏ hơn (không dấu); có nhớ</td><td>không dấu</td></tr>
<tr><td>BE, NA</td><td>C = 1 OR Z = 1</td><td>Nhỏ hơn hoặc bằng</td><td>không dấu</td></tr>
<tr><td>E, Z</td><td>Z = 1</td><td>Bằng nhau; bằng 0 (cả có dấu lẫn không dấu)</td><td>cả hai</td></tr>
<tr><td>NE, NZ</td><td>Z = 0</td><td>Khác nhau (cả có dấu lẫn không dấu)</td><td>cả hai</td></tr>
<tr><td>G, NLE</td><td>[(S = 1 AND O = 1) OR (S = 0 AND O = 0)] AND [Z = 0]</td><td>Lớn hơn (có dấu)</td><td>có dấu</td></tr>
<tr><td>GE, NL</td><td>(S = 1 AND O = 1) OR (S = 0 AND O = 0)</td><td>Lớn hơn hoặc bằng (có dấu)</td><td>có dấu</td></tr>
<tr><td>L, NGE</td><td>(S = 1 AND O = 0) OR (S = 0 AND O = 0)  ← <em>xem cảnh báo bên dưới</em></td><td>Nhỏ hơn (có dấu)</td><td>có dấu</td></tr>
<tr><td>LE, NG</td><td>(S = 1 AND O = 0) OR (S = 0 AND O = 1) OR (Z = 1)</td><td>Nhỏ hơn hoặc bằng (có dấu)</td><td>có dấu</td></tr>
<tr><td>O · NO</td><td>O = 1 · O = 0</td><td>Tràn · không tràn</td><td>kiểm cờ</td></tr>
<tr><td>S · NS</td><td>S = 1 · S = 0</td><td>Âm · không âm</td><td>kiểm cờ</td></tr>
<tr><td>P · NP, PO</td><td>P = 1 · P = 0</td><td>Chẵn · lẻ</td><td>kiểm cờ</td></tr>
</table>
<p class="pitfall">⚠️ <strong>SLIDE GỐC IN SAI, và chỗ sai nằm ở dòng "L, NGE".</strong> Như in trên slide, điều kiện là "(S = 1 AND O = 0) OR (S = 0 AND O = <strong>0</strong>)". Vế sau phải là (S = 0 AND O = <strong>1</strong>). Bạn chứng minh được bản in sai mà không cần tra nguồn nào: theo đúng bản in, <strong>L và GE cùng ĐÚNG tại (S = 0, O = 0)</strong> — một số không thể vừa "nhỏ hơn" vừa "lớn hơn hoặc bằng" một số khác. Quy tắc đúng là bản gọn: <strong>L đúng khi và chỉ khi S ≠ O</strong>, còn GE đúng khi S = O. Đối chiếu với dòng LE <em>ĐÚNG</em> nằm ngay hai dòng dưới, dòng đó CÓ (S = 0 AND O = 1) — slide làm đúng chính cái dòng anh em của nó. Đừng im lặng chép bản in vào bài thi; hãy phát biểu quy tắc là S ≠ O.</p>
<ul>
<li><strong>Hai họ tồn tại vì MỘT phép trừ phục vụ HAI hệ số.</strong> Sau <code>CMP a, b</code>, máy không thể biết bạn muốn hiểu a và b là có dấu hay không dấu. Nên nó đưa cho bạn hai bộ lệnh nhảy trên cùng những cái cờ ấy, và <em>việc bạn chọn ký hiệu nào chính là lúc bạn KHAI BÁO cách hiểu</em>. Chọn <code>JB</code> trong khi ý bạn là <code>JL</code> là một lỗi thật và lỗi câm.</li>
<li><strong>Thuộc cách chia từ vựng — đó là điểm cho không.</strong> So sánh KHÔNG DẤU dùng <strong>Above / Below</strong>; so sánh CÓ DẤU dùng <strong>Greater / Less</strong>. Intel cố ý chọn hai bộ từ tiếng Anh khác nhau để người đọc liếc qua là biết đoạn mã đang giả định cách hiểu nào.</li>
<li><strong>Vì sao "below" không dấu chỉ là C = 1.</strong> Có mượn ra khỏi bit trên cùng nghĩa là số bị trừ nhỏ hơn. Một cờ, một phép kiểm — so sánh không dấu rẻ đến mức tầm thường.</li>
<li><strong>Vì sao so sánh có dấu cần S ≠ O.</strong> Bit dấu nói thật CHỈ KHI phép trừ không tràn. Khi có tràn, bit dấu bị lật ngược so với đáp án đúng, mà O đúng là bit ghi lại chuyện ấy — nên đem XOR hai cái với nhau.</li>
<li><strong><code>SETcc</code> là cùng bảng đó nhưng KHÔNG nhảy.</strong> Thay vì rẽ nhánh, <code>SETcc</code> ghi 1 hoặc 0 vào một byte. Đó là cách một biểu thức C như <code>int r = (a &lt; b);</code> được biên dịch mà không có một lệnh rẽ nhánh nào — chuyện cực kỳ quan trọng với đường ống ở Chương 12, vì một lệnh rẽ nhánh KHÔNG TỒN TẠI thì không thể bị đoán sai.</li>
</ul>
<p class="nhan">📐 Kiểm chéo với bảng cờ ĐO ĐƯỢC ở slide 34. Với <code>CMP(−2147483648, 1)</code> phép chạy cho S = 0, O = 1. Áp quy tắc: <code>JB</code> (C = 1) <strong>KHÔNG</strong> nhảy — đúng, vì hiểu theo <em>KHÔNG DẤU</em> thì 0x80000000 = 2.147.483.648 quả thật lớn hơn 1. <code>JL</code> (S ≠ O ⇒ 0 ≠ 1 ⇒ đúng) thì <strong>CÓ</strong> nhảy — cũng đúng, vì hiểu theo <em>CÓ DẤU</em> thì −2.147.483.648 quả thật nhỏ hơn 1.</p>
<p class="dap-an">✅ Một cặp số, một lệnh <code>CMP</code>, hai đáp án NGƯỢC NHAU và cả hai đều ĐÚNG. Đúng một ví dụ đo được đó là bằng chứng tốt nhất cho thấy việc tách có dấu / không dấu trong bảng này là cần thiết chứ không phải vẽ vời.</p>`],

      [43, 'x86 Single-Instruction, Multiple-Data (SIMD) Instructions',
        `<p class="y-chinh">🎯 In <strong>1996 Intel introduced MMX technology</strong> into its Pentium product line — "a set of highly optimized instructions for multimedia tasks". The justification on the slide is one observation: <strong>video and audio data are typically composed of large arrays of small data types</strong>.</p>
<ul>
<li><strong>Read that observation twice, because the whole design follows from it.</strong> A 64-bit register holding one 64-bit integer is a waste when your data is 8-bit pixel components. Pack <em>eight</em> of them into the same register and one instruction can process eight pixels. Same register file, same width, eight times the work.</li>
<li><strong>Three new data types are defined in MMX</strong>, exactly as listed: <em>packed byte</em> (8 bytes), <em>packed word</em> (4 × 16 bits), <em>packed doubleword</em> (2 × 32 bits). Each data type is <strong>64 bits in length</strong> and consists of multiple smaller data fields, each holding a fixed-point integer.</li>
<li><strong>SIMD in one line: one instruction, many data items, one operation applied to all of them simultaneously.</strong> This is the cheapest parallelism in a processor — no extra instruction fetch, no extra decode, no synchronisation, no threads. It is also why slide 27's remark that a 32-bit AND is 32 parallel gates was not a throwaway: SIMD is the same trick promoted from bits to fields.</li>
<li><strong>The cost is that your data must be laid out for it.</strong> Eight pixels only fit in one register if they are adjacent in memory. This is the spatial locality of Chapter 4 reappearing as a <em>hard requirement</em> rather than a performance hint: badly laid out data cannot be vectorised at all.</li>
<li><strong>Where it went afterwards.</strong> Slide 17 already listed the successors: MMX became SSE (streaming SIMD extensions) at 128 bits, then AVX at 256 and 512 bits, and the data types grew to include packed single- and double-precision floating point. ARM's equivalent is NEON — and note that slide 46 lists "parallel addition and subtraction instructions" among ARM's operation types, which is the same idea.</li>
</ul>
<p class="nhan">📐 Why "small data types" is literally true for images. One pixel in RGBA is four 8-bit components, each in the range 0–255. A 1920 × 1080 frame is 2 073 600 pixels = <strong>8 294 400 bytes</strong> of component data, and a video plays 30 of those per second. Processing them one byte per instruction means about 250 million operations per second of video just to touch every component once; with packed bytes it is about <strong>31 million</strong> instead — an eight-fold cut, from one design decision.</p>
<p class="meo">💡 The name explains itself if you expand it in the right order: <em>Single Instruction</em> (one opcode is fetched and decoded) <em>Multiple Data</em> (it operates on several values at once). Contrast it with the multiple-processor parallelism of Chapter 17 and later, where each processor fetches its own instructions. SIMD is parallelism that costs nothing in the control unit.</p>
<p class="pitfall">⚠️ MMX registers were not new hardware — they were aliased onto the existing <strong>floating-point registers</strong>. That is why Table 13.10 on the next slide ends with an odd instruction called <code>EMMS</code> ("empty MMX state"): you had to run it before touching floating point again, or the FPU tag bits were left corrupt. A famous example of compatibility constraining design.</p>`,
        `<p class="y-chinh">🎯 Năm <strong>1996, Intel đưa công nghệ MMX</strong> vào dòng Pentium — "một tập lệnh được tối ưu cao cho các tác vụ đa phương tiện". Lý lẽ trên slide chỉ gồm một quan sát: <strong>dữ liệu video và âm thanh thường là những MẢNG LỚN các KIỂU DỮ LIỆU NHỎ</strong>.</p>
<ul>
<li><strong>Đọc quan sát đó hai lần, vì cả thiết kế suy ra từ nó.</strong> Một thanh ghi 64 bit chứa MỘT số nguyên 64 bit là phí phạm khi dữ liệu của bạn là các thành phần điểm ảnh 8 bit. Nhét <em>TÁM</em> cái vào cùng thanh ghi đó thì một lệnh xử lý được tám điểm ảnh. Vẫn tệp thanh ghi ấy, vẫn độ rộng ấy, gấp tám lần công việc.</li>
<li><strong>MMX định nghĩa BA kiểu dữ liệu mới</strong>, đúng như liệt kê: <em>packed byte</em> (8 byte), <em>packed word</em> (4 × 16 bit), <em>packed doubleword</em> (2 × 32 bit). Mỗi kiểu đều dài <strong>64 bit</strong> và gồm nhiều trường dữ liệu nhỏ hơn, mỗi trường chứa một số nguyên dấu chấm tĩnh.</li>
<li><strong>SIMD gói trong một dòng: một lệnh, nhiều mục dữ liệu, một phép toán áp lên tất cả CÙNG LÚC.</strong> Đây là dạng song song RẺ NHẤT trong một bộ xử lý — không nạp thêm lệnh, không giải mã thêm, không đồng bộ, không luồng. Đó cũng là lý do nhận xét ở slide 27 rằng một phép AND 32 bit là 32 cổng chạy song song không phải nói cho vui: SIMD là đúng mẹo ấy, nâng từ mức BIT lên mức TRƯỜNG.</li>
<li><strong>Cái giá là dữ liệu của bạn phải được BỐ TRÍ cho nó.</strong> Tám điểm ảnh chỉ lọt vào một thanh ghi nếu chúng KỀ NHAU trong bộ nhớ. Đây là tính cục bộ không gian của Chương 4 quay lại dưới dạng một <em>YÊU CẦU BẮT BUỘC</em> chứ không còn là gợi ý hiệu năng: dữ liệu bố trí xấu thì không vector hoá được, chấm hết.</li>
<li><strong>Sau đó nó đi về đâu.</strong> Slide 17 đã liệt kê những kẻ kế nhiệm: MMX thành SSE (streaming SIMD extensions) rộng 128 bit, rồi AVX rộng 256 và 512 bit, và các kiểu dữ liệu mở rộng thêm cả dấu chấm động độ chính xác đơn và kép dạng gói. Bên ARM tương đương là NEON — và để ý slide 46 có liệt kê "lệnh cộng và trừ song song" trong các loại phép toán của ARM, chính là cùng ý tưởng.</li>
</ul>
<p class="nhan">📐 Vì sao "kiểu dữ liệu nhỏ" đúng theo nghĩa đen với ảnh. Một điểm ảnh RGBA là bốn thành phần 8 bit, mỗi thành phần trong khoảng 0–255. Một khung hình 1920 × 1080 là 2.073.600 điểm ảnh = <strong>8.294.400 byte</strong> dữ liệu thành phần, và video chạy 30 khung như vậy mỗi giây. Xử lý mỗi lệnh một byte nghĩa là khoảng 250 triệu phép mỗi giây video chỉ để chạm vào mỗi thành phần đúng một lần; với packed byte thì còn khoảng <strong>31 triệu</strong> — cắt tám lần, chỉ từ MỘT quyết định thiết kế.</p>
<p class="meo">💡 Cái tên tự giải thích nếu bạn bung ra đúng thứ tự: <em>Single Instruction</em> (một mã lệnh được nạp và giải mã) <em>Multiple Data</em> (nó tác động lên nhiều giá trị cùng lúc). Đối chiếu với song song nhiều bộ xử lý ở Chương 17 trở đi, nơi mỗi bộ xử lý tự nạp lệnh của riêng nó. SIMD là kiểu song song KHÔNG TỐN GÌ ở khối điều khiển.</p>
<p class="pitfall">⚠️ Thanh ghi MMX KHÔNG phải phần cứng mới — chúng được đặt chồng lên chính các <strong>thanh ghi dấu chấm động</strong> sẵn có. Đó là lý do Table 13.10 ở slide sau kết thúc bằng một lệnh lạ tên <code>EMMS</code> ("empty MMX state"): bạn phải chạy nó trước khi đụng lại vào dấu chấm động, nếu không các bit thẻ của FPU bị để lại ở trạng thái hỏng. Một ví dụ nổi tiếng về chuyện tương thích trói buộc thiết kế.</p>`],

      [44, 'Table 13.10 — MMX Instruction Set',
        `<p class="y-chinh">🎯 The MMX instruction set in six categories. The note at the top of the slide tells you how to read the mnemonics: <strong>if an instruction supports multiple data types — byte (B), word (W), doubleword (D), quadword (Q) — the data types are indicated in brackets</strong>. So <code>PADD [B, W, D]</code> is really three instructions: <code>PADDB</code>, <code>PADDW</code>, <code>PADDD</code>.</p>
<table>
<tr><th>Category</th><th>Instructions</th><th>What they do</th></tr>
<tr><td>Arithmetic</td><td><code>PADD[B,W,D]</code>, <code>PADDS[B,W]</code>, <code>PADDUS[B,W]</code>, <code>PSUB[B,W,D]</code>, <code>PSUBS[B,W]</code>, <code>PSUBUS[B,W]</code>, <code>PMULHW</code>, <code>PMULLW</code>, <code>PMADDWD</code></td><td>Parallel add/subtract with wraparound, with saturation, and unsigned with saturation; parallel multiply keeping the high or low 16 bits; multiply-and-add adjacent pairs</td></tr>
<tr><td>Comparison</td><td><code>PCMPEQ[B,W,D]</code>, <code>PCMPGT[B,W,D]</code></td><td>Parallel compare; the result is a <strong>mask of 1s if true or 0s if false</strong> — not a flag</td></tr>
<tr><td>Conversion</td><td><code>PACKUSWB</code>, <code>PACKSS[WB,DW]</code>, <code>PUNPCKH[BW,WD,DQ]</code>, <code>PUNPCKL[BW,WD,DQ]</code></td><td>Pack down with saturation; unpack (interleaved merge) the high or low halves</td></tr>
<tr><td>Logical</td><td><code>PAND</code>, <code>PNDN</code>, <code>POR</code>, <code>PXOR</code></td><td>64-bit bitwise AND, AND NOT, OR, XOR</td></tr>
<tr><td>Shift</td><td><code>PSLL[W,D,Q]</code>, <code>PSRL[W,D,Q]</code>, <code>PSRA[W,D]</code></td><td>Parallel logical left/right shift and arithmetic right shift of the packed fields</td></tr>
<tr><td>Data transfer / State mgt</td><td><code>MOV[D,Q]</code>, <code>EMMS</code></td><td>Move doubleword or quadword to/from an MMX register; empty MMX state</td></tr>
</table>
<ul>
<li><strong>The prefix P means "packed", and it is the only difference from Table 13.3.</strong> <code>PADD</code> is <code>ADD</code> done to every field; <code>PAND</code> is <code>AND</code>; <code>PSLL</code> is <code>SHL</code>. If you learned Table 13.3 you already know most of this table — the new material is <em>saturation</em>, <em>pack/unpack</em>, and the mask-style comparison.</li>
<li><strong>Saturation is the genuinely new arithmetic, and it exists because of pixels.</strong> With ordinary wraparound, brightening a pixel of value 200 by 100 gives 44 — a bright area suddenly turns black, a catastrophic visual artefact. With saturation the result clamps at 255 and the area simply goes white. Saturating arithmetic is <em>wrong</em> mathematically and <em>right</em> perceptually.</li>
<li><strong>Comparison returns a mask, not a flag — and that is forced by SIMD.</strong> Eight parallel comparisons would need eight condition codes, which the machine does not have. So <code>PCMPGTB</code> writes 0xFF into each byte where the comparison held and 0x00 where it did not. You then use that mask with <code>PAND</code>/<code>POR</code> to select values — branchless conditional execution, which also sidesteps the pipeline problem of Chapter 12.</li>
<li><strong><code>PMADDWD</code> is a whole dot product step in one instruction:</strong> multiply four signed 16-bit pairs, then add adjacent 32-bit results together. That single instruction is the core of digital filtering, matrix multiply and, decades later, neural-network inference.</li>
</ul>
<p class="nhan">📐 Saturation versus wraparound, computed for real on eight unsigned byte pairs (<code>cc -Wall</code>, the exact contrast between <code>PADDB</code> and <code>PADDUSB</code>):</p>
<table>
<tr><th>A</th><th>B</th><th><code>PADDB</code> (wraparound)</th><th><code>PADDUSB</code> (saturating)</th></tr>
<tr><td>200</td><td>100</td><td><strong>44</strong></td><td>255</td></tr>
<tr><td>100</td><td>200</td><td><strong>44</strong></td><td>255</td></tr>
<tr><td>50</td><td>100</td><td>150</td><td>150</td></tr>
<tr><td>255</td><td>1</td><td><strong>0</strong></td><td>255</td></tr>
<tr><td>10</td><td>245</td><td>255</td><td>255</td></tr>
<tr><td>128</td><td>128</td><td><strong>0</strong></td><td>255</td></tr>
</table>
<p class="dap-an">✅ Look at rows 1 and 4: wraparound turns "very bright plus a bit more" into <strong>almost black</strong> (200 + 100 = 44, and 255 + 1 = 0). Saturation gives 255, which is what a human eye expects. Row 3 shows they agree whenever no overflow occurs — saturation costs nothing in the normal case. One <code>PADDUSB</code> does all eight of these additions simultaneously.</p>
<p class="pitfall">⚠️ The slide prints "<strong>PNDN</strong> — 64-bit bitwise logical AND NOT" in the Logical category. The real instruction is <strong><code>PANDN</code></strong> (packed AND NOT). It is a typing error on the slide, not a different instruction. Also note what AND NOT is <em>for</em>: <code>PANDN</code> computes <code>(NOT a) AND b</code>, which combined with <code>PAND</code> and a comparison mask gives you "select b where the mask is 0" — the other half of branchless selection.</p>`,
        `<p class="y-chinh">🎯 Tập lệnh MMX chia sáu nhóm. Ghi chú ở đầu slide chỉ cách đọc ký hiệu: <strong>nếu một lệnh hỗ trợ nhiều kiểu dữ liệu — byte (B), word (W), doubleword (D), quadword (Q) — thì các kiểu đó ghi trong ngoặc vuông</strong>. Vậy <code>PADD [B, W, D]</code> thực chất là ba lệnh: <code>PADDB</code>, <code>PADDW</code>, <code>PADDD</code>.</p>
<table>
<tr><th>Nhóm</th><th>Các lệnh</th><th>Chúng làm gì</th></tr>
<tr><td>Số học</td><td><code>PADD[B,W,D]</code>, <code>PADDS[B,W]</code>, <code>PADDUS[B,W]</code>, <code>PSUB[B,W,D]</code>, <code>PSUBS[B,W]</code>, <code>PSUBUS[B,W]</code>, <code>PMULHW</code>, <code>PMULLW</code>, <code>PMADDWD</code></td><td>Cộng/trừ song song kiểu cuộn vòng, kiểu bão hoà, và bão hoà không dấu; nhân song song giữ 16 bit cao hoặc thấp; nhân-rồi-cộng từng cặp kề nhau</td></tr>
<tr><td>So sánh</td><td><code>PCMPEQ[B,W,D]</code>, <code>PCMPGT[B,W,D]</code></td><td>So sánh song song; kết quả là một <strong>MẶT NẠ toàn 1 nếu đúng hoặc toàn 0 nếu sai</strong> — không phải một cái cờ</td></tr>
<tr><td>Chuyển đổi</td><td><code>PACKUSWB</code>, <code>PACKSS[WB,DW]</code>, <code>PUNPCKH[BW,WD,DQ]</code>, <code>PUNPCKL[BW,WD,DQ]</code></td><td>Nén xuống kèm bão hoà; bung ra (trộn xen kẽ) nửa cao hoặc nửa thấp</td></tr>
<tr><td>Logic</td><td><code>PAND</code>, <code>PNDN</code>, <code>POR</code>, <code>PXOR</code></td><td>AND, AND NOT, OR, XOR theo bit trên 64 bit</td></tr>
<tr><td>Dịch</td><td><code>PSLL[W,D,Q]</code>, <code>PSRL[W,D,Q]</code>, <code>PSRA[W,D]</code></td><td>Dịch trái/phải logic và dịch phải số học song song trên các trường đã gói</td></tr>
<tr><td>Chuyển dữ liệu / quản lý trạng thái</td><td><code>MOV[D,Q]</code>, <code>EMMS</code></td><td>Chuyển doubleword hoặc quadword vào/ra thanh ghi MMX; xoá trạng thái MMX</td></tr>
</table>
<ul>
<li><strong>Tiền tố P nghĩa là "packed" (đã gói), và đó là khác biệt DUY NHẤT so với Table 13.3.</strong> <code>PADD</code> là <code>ADD</code> làm trên mọi trường; <code>PAND</code> là <code>AND</code>; <code>PSLL</code> là <code>SHL</code>. Nếu bạn đã học Table 13.3 thì bạn đã biết gần hết bảng này — phần MỚI chỉ là <em>BÃO HOÀ</em>, <em>nén/bung</em>, và kiểu so sánh trả về mặt nạ.</li>
<li><strong>Bão hoà mới là phép số học thật sự mới, và nó tồn tại là vì ĐIỂM ẢNH.</strong> Với phép cộng cuộn vòng thông thường, làm sáng một điểm ảnh giá trị 200 thêm 100 cho ra 44 — một vùng đang sáng bỗng hoá ĐEN, một vệt lỗi thị giác thảm hoạ. Với bão hoà thì kết quả kẹp lại ở 255 và vùng đó đơn giản là trắng ra. Số học bão hoà <em>SAI</em> về mặt toán và <em>ĐÚNG</em> về mặt cảm nhận.</li>
<li><strong>So sánh trả về MẶT NẠ chứ không phải cờ — và điều đó do SIMD bắt buộc.</strong> Tám phép so sánh song song sẽ cần tám mã điều kiện, mà máy không có. Nên <code>PCMPGTB</code> ghi 0xFF vào mỗi byte nơi phép so đúng và 0x00 nơi sai. Sau đó bạn dùng mặt nạ ấy cùng <code>PAND</code>/<code>POR</code> để chọn giá trị — thực hiện có điều kiện mà KHÔNG rẽ nhánh, đồng thời né luôn vấn đề đường ống của Chương 12.</li>
<li><strong><code>PMADDWD</code> là trọn một bước tích vô hướng gói trong một lệnh:</strong> nhân bốn cặp số 16 bit có dấu, rồi cộng các kết quả 32 bit kề nhau lại. Đúng một lệnh đó là lõi của lọc số, nhân ma trận, và mấy chục năm sau là suy diễn mạng nơ-ron.</li>
</ul>
<p class="nhan">📐 Bão hoà so với cuộn vòng, TÍNH THẬT trên tám cặp byte không dấu (<code>cc -Wall</code>, chính là khác biệt giữa <code>PADDB</code> và <code>PADDUSB</code>):</p>
<table>
<tr><th>A</th><th>B</th><th><code>PADDB</code> (cuộn vòng)</th><th><code>PADDUSB</code> (bão hoà)</th></tr>
<tr><td>200</td><td>100</td><td><strong>44</strong></td><td>255</td></tr>
<tr><td>100</td><td>200</td><td><strong>44</strong></td><td>255</td></tr>
<tr><td>50</td><td>100</td><td>150</td><td>150</td></tr>
<tr><td>255</td><td>1</td><td><strong>0</strong></td><td>255</td></tr>
<tr><td>10</td><td>245</td><td>255</td><td>255</td></tr>
<tr><td>128</td><td>128</td><td><strong>0</strong></td><td>255</td></tr>
</table>
<p class="dap-an">✅ Nhìn dòng 1 và 4: cuộn vòng biến "đang rất sáng, cộng thêm chút nữa" thành <strong>gần như đen</strong> (200 + 100 = 44, và 255 + 1 = 0). Bão hoà cho 255, đúng như mắt người mong đợi. Dòng 3 cho thấy hai cách TRÙNG NHAU khi không xảy ra tràn — bão hoà không tốn gì trong trường hợp bình thường. Một lệnh <code>PADDUSB</code> làm cả tám phép cộng này cùng lúc.</p>
<p class="pitfall">⚠️ Slide in "<strong>PNDN</strong> — AND NOT theo bit trên 64 bit" ở nhóm Logic. Lệnh thật là <strong><code>PANDN</code></strong> (packed AND NOT). Đó là LỖI GÕ trên slide, không phải một lệnh khác. Để ý luôn AND NOT dùng để <em>LÀM GÌ</em>: <code>PANDN</code> tính <code>(NOT a) AND b</code>, kết hợp với <code>PAND</code> và một mặt nạ so sánh thì cho bạn "chọn b ở chỗ mặt nạ bằng 0" — chính là nửa còn lại của phép chọn không rẽ nhánh.</p>`],

      [45, 'Figure 13.11 — Image Compositing on Color Plane Representation',
        `<p class="y-chinh">🎯 The pay-off slide: a complete, real MMX routine that fades one image into another, shown as five numbered steps plus the actual assembly. This is what all of MMX was designed for.</p>
<table>
<tr><th>Step on the figure</th><th>What happens</th><th>Why that instruction</th></tr>
<tr><td>1. Unpack byte R pixel components from images A and B</td><td>Four red bytes Ar3…Ar0 (and Br3…Br0) are widened to 16-bit fields</td><td>The multiply in step 3 would overflow 8 bits; you need headroom</td></tr>
<tr><td>2. Subtract image B from image A</td><td>r3…r0 = Ar − Br, four subtractions in one instruction</td><td><code>psubw</code></td></tr>
<tr><td>3. Multiply result by fade value</td><td>fade·r3 … fade·r0, the fade value replicated four times</td><td><code>pmulhw</code> keeps the high 16 bits — that is the fixed-point scaling</td></tr>
<tr><td>4. Add image B pixels</td><td>newr = fade·(A − B) + B</td><td><code>paddw</code></td></tr>
<tr><td>5. Pack new composite pixels back to bytes</td><td>The four 16-bit results become four bytes again</td><td><code>packuswb</code> — with unsigned saturation, so nothing wraps to black</td></tr>
</table>
<pre>pxor        mm7, mm7        ; zero out mm7
movq        mm3, fad_val    ; load fade value replicated 4 times
movd        mm0, imageA     ; load 4 red pixel components from image A
movd        mm1, imageB     ; load 4 red pixel components from image B
punpcklbw   mm0, mm7        ; unpack 4 pixels to 16 bits
punpcklbw   mm1, mm7        ; unpack 4 pixels to 16 bits
psubw       mm0, mm1        ; subtract image B from image A
pmulhw      mm0, mm3        ; multiply the subtract result by fade values
paddw       mm0, mm1        ; add result to image B
packuswb    mm0, mm7        ; pack 16-bit results back to bytes</pre>
<ul>
<li><strong>Ten instructions process four pixels, so 2,5 instructions per pixel — count it yourself.</strong> A scalar version would need, per pixel, a load, a subtract, a multiply, an add, a clamp (two compares and two moves) and a store: roughly eight. That is the measured argument for SIMD, made from the slide's own code.</li>
<li><strong><code>pxor mm7, mm7</code> is the idiomatic way to produce a zero register</strong> — anything XORed with itself is 0, and it is shorter and faster than loading a constant. mm7 is then reused twice: as the zero half for unpacking, and as the second (ignored) source for packing.</li>
<li><strong>The formula is algebra you should recognise.</strong> <code>new = fade·(A − B) + B</code> expands to <code>fade·A + (1 − fade)·B</code> — a linear interpolation, the standard alpha blend. The figure's form is used because it needs one multiply instead of two.</li>
<li><strong>Why the unpack in step 1 is mandatory, not an optimisation.</strong> Multiplying two 8-bit values gives up to 16 bits. Doing it in packed-byte form would lose the top half of every product. Widening first, computing in 16 bits, and packing back with saturation at the end is the universal SIMD pattern: <em>unpack → compute wide → repack saturating</em>.</li>
</ul>
<p class="nhan">📐 Worked numerically, four red components with fade = 0,25:</p>
<table>
<tr><th>Pixel</th><th>A</th><th>B</th><th>A − B</th><th>fade·(A − B)</th><th>+ B = result</th></tr>
<tr><td>0</td><td>200</td><td>100</td><td>100</td><td>25</td><td><strong>125</strong></td></tr>
<tr><td>1</td><td>150</td><td>50</td><td>100</td><td>25</td><td><strong>75</strong></td></tr>
<tr><td>2</td><td>100</td><td>200</td><td>−100</td><td>−25</td><td><strong>175</strong></td></tr>
<tr><td>3</td><td>50</td><td>250</td><td>−200</td><td>−50</td><td><strong>200</strong></td></tr>
</table>
<p class="dap-an">✅ Cross-checked with the equivalent formula fade·A + (1 − fade)·B: 0,25·200 + 0,75·100 = 125 · 0,25·150 + 0,75·50 = 75 · 0,25·100 + 0,75·200 = 175 · 0,25·50 + 0,75·250 = 200. Both forms agree on all four, so the figure's one-multiply arrangement is exact, not an approximation. Note rows 2 and 3 produce <em>negative</em> intermediates — that is precisely why step 1 unpacks to signed 16-bit fields, and why the final pack must saturate.</p>
<p class="pitfall">⚠️ The figure processes the <strong>R plane only</strong> — look at the top of the picture: images A and B are each drawn as four separate planes (Alpha, B, G, R). The whole routine must be run once per colour plane. Answering "this code blends an image" is incomplete; it blends <em>one colour component</em> of four pixels, and that plane-separated layout is what makes the packing work at all.</p>`,
        `<p class="y-chinh">🎯 Slide THU HOẠCH: một thủ tục MMX thật, hoàn chỉnh, làm mờ chồng ảnh này sang ảnh kia, trình bày thành năm bước đánh số cộng với chính đoạn hợp ngữ. Đây là thứ mà toàn bộ MMX được thiết kế ra để làm.</p>
<table>
<tr><th>Bước trên hình</th><th>Chuyện gì xảy ra</th><th>Vì sao lại là lệnh đó</th></tr>
<tr><td>1. Bung các thành phần điểm ảnh R dạng byte từ ảnh A và ảnh B</td><td>Bốn byte đỏ Ar3…Ar0 (và Br3…Br0) được nới rộng thành trường 16 bit</td><td>Phép nhân ở bước 3 sẽ tràn 8 bit; phải có chỗ dư</td></tr>
<tr><td>2. Lấy ảnh A trừ ảnh B</td><td>r3…r0 = Ar − Br, bốn phép trừ trong một lệnh</td><td><code>psubw</code></td></tr>
<tr><td>3. Nhân kết quả với giá trị fade</td><td>fade·r3 … fade·r0, giá trị fade được nhân bản bốn lần</td><td><code>pmulhw</code> giữ 16 bit cao — đó chính là phép nhân dấu chấm tĩnh</td></tr>
<tr><td>4. Cộng các điểm ảnh của ảnh B</td><td>newr = fade·(A − B) + B</td><td><code>paddw</code></td></tr>
<tr><td>5. Nén các điểm ảnh tổng hợp mới trở lại thành byte</td><td>Bốn kết quả 16 bit trở lại thành bốn byte</td><td><code>packuswb</code> — nén có BÃO HOÀ không dấu, nên không có gì cuộn về đen</td></tr>
</table>
<pre>pxor        mm7, mm7        ; zero out mm7
movq        mm3, fad_val    ; load fade value replicated 4 times
movd        mm0, imageA     ; load 4 red pixel components from image A
movd        mm1, imageB     ; load 4 red pixel components from image B
punpcklbw   mm0, mm7        ; unpack 4 pixels to 16 bits
punpcklbw   mm1, mm7        ; unpack 4 pixels to 16 bits
psubw       mm0, mm1        ; subtract image B from image A
pmulhw      mm0, mm3        ; multiply the subtract result by fade values
paddw       mm0, mm1        ; add result to image B
packuswb    mm0, mm7        ; pack 16-bit results back to bytes</pre>
<ul>
<li><strong>Mười lệnh xử lý bốn điểm ảnh, tức 2,5 lệnh mỗi điểm ảnh — tự đếm mà xem.</strong> Bản vô hướng sẽ cần, cho mỗi điểm ảnh: một lệnh nạp, một trừ, một nhân, một cộng, một phép kẹp (hai so sánh và hai lệnh chuyển) và một lệnh lưu: cỡ tám lệnh. Đó là lý lẽ ĐO ĐƯỢC cho SIMD, rút ra từ chính đoạn mã của slide.</li>
<li><strong><code>pxor mm7, mm7</code> là cách kinh điển để tạo một thanh ghi bằng 0</strong> — cái gì XOR với chính nó cũng ra 0, và nó ngắn hơn, nhanh hơn việc nạp một hằng số. Sau đó mm7 được dùng lại hai lần: làm nửa bằng 0 khi bung ra, và làm nguồn thứ hai (bị bỏ qua) khi nén lại.</li>
<li><strong>Công thức là đại số bạn phải nhận ra.</strong> <code>new = fade·(A − B) + B</code> khai triển thành <code>fade·A + (1 − fade)·B</code> — một phép nội suy tuyến tính, chính là phép trộn alpha tiêu chuẩn. Dạng của hình được dùng vì nó chỉ cần MỘT phép nhân thay vì hai.</li>
<li><strong>Vì sao bước 1 bung ra là BẮT BUỘC chứ không phải tối ưu.</strong> Nhân hai giá trị 8 bit cho ra tới 16 bit. Làm ở dạng packed byte thì mất nửa trên của MỌI tích. Nới rộng trước, tính ở 16 bit, rồi nén lại kèm bão hoà ở cuối là khuôn mẫu SIMD phổ quát: <em>bung ra → tính ở bề rộng lớn → nén lại có bão hoà</em>.</li>
</ul>
<p class="nhan">📐 Giải bằng số, bốn thành phần đỏ với fade = 0,25:</p>
<table>
<tr><th>Điểm ảnh</th><th>A</th><th>B</th><th>A − B</th><th>fade·(A − B)</th><th>+ B = kết quả</th></tr>
<tr><td>0</td><td>200</td><td>100</td><td>100</td><td>25</td><td><strong>125</strong></td></tr>
<tr><td>1</td><td>150</td><td>50</td><td>100</td><td>25</td><td><strong>75</strong></td></tr>
<tr><td>2</td><td>100</td><td>200</td><td>−100</td><td>−25</td><td><strong>175</strong></td></tr>
<tr><td>3</td><td>50</td><td>250</td><td>−200</td><td>−50</td><td><strong>200</strong></td></tr>
</table>
<p class="dap-an">✅ Đối chiếu chéo bằng công thức tương đương fade·A + (1 − fade)·B: 0,25·200 + 0,75·100 = 125 · 0,25·150 + 0,75·50 = 75 · 0,25·100 + 0,75·200 = 175 · 0,25·50 + 0,75·250 = 200. Hai dạng khớp cả bốn, nên cách bố trí "một phép nhân" của hình là CHÍNH XÁC chứ không phải xấp xỉ. Để ý dòng 2 và 3 cho ra kết quả trung gian <em>ÂM</em> — đó đúng là lý do bước 1 phải bung ra thành trường 16 bit CÓ DẤU, và là lý do phép nén cuối phải bão hoà.</p>
<p class="pitfall">⚠️ Hình này chỉ xử lý <strong>mặt phẳng R</strong> — nhìn lên đầu bức hình: ảnh A và ảnh B đều được vẽ thành bốn mặt phẳng tách rời (Alpha, B, G, R). Cả thủ tục phải chạy MỘT LẦN cho MỖI mặt phẳng màu. Trả lời "đoạn mã này trộn hai ảnh" là chưa đủ; nó trộn <em>MỘT thành phần màu</em> của bốn điểm ảnh, và chính cách bố trí tách mặt phẳng ấy mới làm cho việc gói dữ liệu khả thi.</p>`],

      [46, 'ARM Operation Types',
        `<p class="y-chinh">🎯 The counterweight to x86. Seven boxes on the slide, and the striking thing is how <strong>few</strong> and how <strong>regular</strong> they are: <em>load and store instructions</em>, <em>branch instructions</em>, <em>data-processing instructions</em>, <em>multiply instructions</em>, <em>parallel addition and subtraction instructions</em>, <em>extend instructions</em>, and <em>status register access instructions</em>.</p>
<table>
<tr><th>ARM category</th><th>What belongs to it</th><th>The x86 counterpart</th></tr>
<tr><td>Load and store</td><td>The <strong>only</strong> instructions that touch memory</td><td><code>MOV</code> with a memory operand — but on x86 almost any instruction may also touch memory</td></tr>
<tr><td>Branch</td><td><code>B</code>, and <code>BL</code> which also writes the return address into the link register</td><td><code>JMP</code>, <code>Jcc</code>, <code>CALL</code></td></tr>
<tr><td>Data-processing</td><td>Arithmetic, logical, shift — register to register only</td><td>Table 13.3 blocks (b), (c), (d)</td></tr>
<tr><td>Multiply</td><td>Separate because it needs extra cycles and wider results</td><td><code>MUL</code>, <code>IMUL</code></td></tr>
<tr><td>Parallel addition and subtraction</td><td>SIMD on packed halfwords and bytes inside a normal register</td><td>MMX / SSE (slides 43–45)</td></tr>
<tr><td>Extend</td><td>Widen a byte or halfword to a word, sign- or zero-extending</td><td><code>MOVSX</code> / <code>MOVZX</code></td></tr>
<tr><td>Status register access</td><td>Explicitly read or write the flags register</td><td>Reading EFLAGS</td></tr>
</table>
<ul>
<li><strong>The first box is the defining property of RISC and you must be able to name it: this is a LOAD/STORE architecture.</strong> Only <code>LDR</code> and <code>STR</code> may address memory; every arithmetic instruction works on registers alone. On x86, <code>ADD [ebx], eax</code> reads memory, adds and writes memory in one instruction. That single difference reshapes the pipeline, the instruction format and the compiler.</li>
<li><strong>The fact that "status register access" needs its own category is itself informative.</strong> On x86 the flags are pervasive and implicit. On ARM, most data-processing instructions do <em>not</em> touch the flags unless you ask, by appending <code>S</code> (<code>ADD</code> versus <code>ADDS</code>). That makes the hidden dependency of slide 34 explicit and controllable — and it is why an ARM compiler can move instructions between a comparison and its branch without breaking anything.</li>
<li><strong>"Parallel addition and subtraction" is ARM doing SIMD in the general-purpose registers</strong>, the same idea as MMX on slides 43–45 and the direct ancestor of NEON. Notice that both architectures arrived at the same answer to the multimedia problem, independently.</li>
<li><strong>"Extend" gets a whole category because a load/store machine needs it constantly.</strong> Loading a byte into a 32-bit register leaves 24 bits undefined; you must state whether to fill them with zeros (unsigned data) or with copies of the sign bit (signed data). Getting that wrong turns −1 stored as a byte into 255.</li>
</ul>
<p class="nhan">📐 <strong>RISC versus CISC, measured on this machine</strong> (the same C function compiled twice, lengths read from the disassembly): <strong>arm64 — all 12 instructions exactly 4 bytes</strong>, addresses stepping 0, 4, 8, 0xc, 0x10, … with no exception; <strong>x86-64 — 1, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 1, 1, 2, 1 bytes</strong>, plus a <code>movabsq</code> elsewhere measuring 10 bytes. Fixed-length decoding is the reason an ARM core can fetch and decode several instructions per cycle with simple hardware; Chapter 13 (RISC) develops the full argument.</p>
<p class="nhan">📐 <strong>Byte order, revisited.</strong> Slide 19 of this deck (<em>Figure 13.5 ARM Endian Support — Word Load/Store with E-Bit</em>) shows that ARM is <strong>bi-endian</strong>: an E bit in the program status register selects whether a word load/store treats memory as little- or big-endian. x86 is little-endian only. Measured here: this ARM machine, running macOS, is little-endian — <code>0x12345678</code> stored at four consecutive addresses reads back as <code>78 56 34 12</code>, and <code>fwrite</code> put exactly <code>7856 3412</code> on disk.</p>
<p class="pitfall">⚠️ Do not conclude "ARM is big-endian" from Figure 13.5. The figure shows ARM <em>can be configured</em> either way; in practice every mainstream ARM operating system runs little-endian. The E bit matters when a program must read data produced by a big-endian machine — which is exactly the file-portability problem of slide 25.</p>`,
        `<p class="y-chinh">🎯 Đối trọng của x86. Bảy ô trên slide, và điều gây ấn tượng là chúng <strong>ÍT</strong> và <strong>ĐỀU ĐẶN</strong> đến mức nào: <em>lệnh nạp và lưu (load/store)</em>, <em>lệnh rẽ nhánh</em>, <em>lệnh xử lý dữ liệu</em>, <em>lệnh nhân</em>, <em>lệnh cộng và trừ song song</em>, <em>lệnh mở rộng (extend)</em>, và <em>lệnh truy cập thanh ghi trạng thái</em>.</p>
<table>
<tr><th>Nhóm của ARM</th><th>Gồm những gì</th><th>Đối ứng bên x86</th></tr>
<tr><td>Load và store</td><td><strong>NHỮNG LỆNH DUY NHẤT</strong> được đụng vào bộ nhớ</td><td><code>MOV</code> có toán hạng bộ nhớ — nhưng trên x86 gần như lệnh nào cũng có thể đụng bộ nhớ</td></tr>
<tr><td>Rẽ nhánh</td><td><code>B</code>, và <code>BL</code> vốn còn ghi địa chỉ trở về vào thanh ghi liên kết</td><td><code>JMP</code>, <code>Jcc</code>, <code>CALL</code></td></tr>
<tr><td>Xử lý dữ liệu</td><td>Số học, logic, dịch bit — chỉ giữa các THANH GHI</td><td>Các khối (b), (c), (d) của Table 13.3</td></tr>
<tr><td>Nhân</td><td>Tách riêng vì nó cần thêm chu kỳ và kết quả rộng hơn</td><td><code>MUL</code>, <code>IMUL</code></td></tr>
<tr><td>Cộng và trừ song song</td><td>SIMD trên các nửa từ và byte đã gói bên trong một thanh ghi thường</td><td>MMX / SSE (slide 43–45)</td></tr>
<tr><td>Mở rộng (extend)</td><td>Nới một byte hoặc nửa từ thành một từ, mở rộng theo dấu hoặc theo số 0</td><td><code>MOVSX</code> / <code>MOVZX</code></td></tr>
<tr><td>Truy cập thanh ghi trạng thái</td><td>Đọc hoặc ghi thanh ghi cờ một cách TƯỜNG MINH</td><td>Đọc EFLAGS</td></tr>
</table>
<ul>
<li><strong>Ô đầu tiên là tính chất ĐỊNH NGHĨA của RISC và bạn phải gọi được tên nó: đây là kiến trúc LOAD/STORE.</strong> Chỉ <code>LDR</code> và <code>STR</code> mới được định địa chỉ bộ nhớ; mọi lệnh số học chỉ làm việc trên thanh ghi. Trên x86, <code>ADD [ebx], eax</code> đọc bộ nhớ, cộng, rồi ghi bộ nhớ trong MỘT lệnh. Đúng một khác biệt đó nhào nặn lại cả đường ống, cả khuôn dạng lệnh, lẫn trình biên dịch.</li>
<li><strong>Việc "truy cập thanh ghi trạng thái" phải có hẳn một nhóm riêng tự nó đã nói lên điều gì đó.</strong> Trên x86 các cờ len lỏi khắp nơi và ngầm định. Trên ARM, phần lớn lệnh xử lý dữ liệu <em>KHÔNG</em> đụng tới cờ trừ khi bạn yêu cầu, bằng cách thêm hậu tố <code>S</code> (<code>ADD</code> so với <code>ADDS</code>). Điều đó biến phụ thuộc ngầm của slide 34 thành thứ TƯỜNG MINH và KIỂM SOÁT ĐƯỢC — và là lý do trình biên dịch ARM có thể xê dịch lệnh giữa một phép so sánh và lệnh rẽ nhánh của nó mà không làm hỏng gì.</li>
<li><strong>"Cộng và trừ song song" là ARM làm SIMD ngay trong thanh ghi đa dụng</strong>, cùng ý tưởng với MMX ở slide 43–45 và là tổ tiên trực tiếp của NEON. Để ý rằng hai kiến trúc đã đi tới cùng một câu trả lời cho bài toán đa phương tiện, một cách độc lập.</li>
<li><strong>"Extend" có hẳn một nhóm vì máy load/store cần nó liên tục.</strong> Nạp một byte vào thanh ghi 32 bit thì 24 bit còn lại chưa xác định; bạn phải nói rõ là lấp bằng số 0 (dữ liệu không dấu) hay lấp bằng bản sao của bit dấu (dữ liệu có dấu). Làm sai chỗ này thì số −1 lưu dạng byte biến thành 255.</li>
</ul>
<p class="nhan">📐 <strong>RISC so với CISC, ĐO TRÊN CHÍNH MÁY NÀY</strong> (cùng một hàm C dịch hai lần, độ dài đọc từ bản dịch ngược): <strong>arm64 — cả 12 lệnh đều đúng 4 byte</strong>, địa chỉ bước đều 0, 4, 8, 0xc, 0x10, … không có ngoại lệ nào; <strong>x86-64 — 1, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 1, 1, 2, 1 byte</strong>, cộng một lệnh <code>movabsq</code> ở chỗ khác đo được 10 byte. Giải mã độ dài cố định là lý do một lõi ARM nạp và giải mã được nhiều lệnh mỗi chu kỳ bằng phần cứng đơn giản; Chương 13 (RISC) khai triển đầy đủ lập luận này.</p>
<p class="nhan">📐 <strong>Thứ tự byte, xem lại.</strong> Slide 19 của chính deck này (<em>Figure 13.5 ARM Endian Support — Word Load/Store with E-Bit</em>) cho thấy ARM là <strong>LƯỠNG ENDIAN</strong>: một bit E trong thanh ghi trạng thái chương trình chọn xem lệnh nạp/lưu một từ sẽ coi bộ nhớ là little-endian hay big-endian. x86 thì chỉ little-endian. Đo tại đây: cỗ máy ARM này, chạy macOS, là little-endian — <code>0x12345678</code> lưu vào bốn địa chỉ liên tiếp đọc ra thành <code>78 56 34 12</code>, và <code>fwrite</code> đặt lên đĩa đúng <code>7856 3412</code>.</p>
<p class="pitfall">⚠️ Đừng từ Figure 13.5 mà kết luận "ARM là big-endian". Hình đó cho thấy ARM <em>CẤU HÌNH ĐƯỢC</em> theo cả hai chiều; thực tế mọi hệ điều hành ARM phổ thông đều chạy little-endian. Bit E chỉ có ý nghĩa khi một chương trình phải đọc dữ liệu do máy big-endian sinh ra — đúng bài toán di chuyển tệp của slide 25.</p>`],

      [47, 'Table 13.11 — ARM Conditions for Conditional Instruction Execution',
        `<p class="y-chinh">🎯 Read the title carefully: it is <strong>conditional instruction execution</strong>, not conditional branching. On ARM, a 4-bit condition field is attached to instructions generally, so <em>any</em> instruction can be made to execute or be skipped based on the flags. This is ARM's most distinctive idea and the slide is where you meet it.</p>
<table>
<tr><th>Code</th><th>Symbol</th><th>Condition tested</th><th>Comment</th></tr>
<tr><td>0000</td><td>EQ</td><td>Z = 1</td><td>Equal</td></tr>
<tr><td>0001</td><td>NE</td><td>Z = 0</td><td>Not equal</td></tr>
<tr><td>0010</td><td>CS/HS</td><td>C = 1</td><td>Carry set / unsigned higher or same</td></tr>
<tr><td>0011</td><td>CC/LO</td><td>C = 0</td><td>Carry clear / unsigned lower</td></tr>
<tr><td>0100</td><td>MI</td><td>N = 1</td><td>Minus / negative</td></tr>
<tr><td>0101</td><td>PL</td><td>N = 0</td><td>Plus / positive or zero</td></tr>
<tr><td>0110</td><td>VS</td><td>V = 1</td><td>Overflow</td></tr>
<tr><td>0111</td><td>VC</td><td>V = 0</td><td>No overflow</td></tr>
<tr><td>1000</td><td>HI</td><td>C = 1 AND Z = 0</td><td>Unsigned higher</td></tr>
<tr><td>1001</td><td>LS</td><td>C = 0 OR Z = 1</td><td>Unsigned lower or same</td></tr>
<tr><td>1010</td><td>GE</td><td>N = V</td><td>Signed greater than or equal</td></tr>
<tr><td>1011</td><td>LT</td><td>N ≠ V</td><td>Signed less than</td></tr>
<tr><td>1100</td><td>GT</td><td>(Z = 0) AND (N = V)</td><td>Signed greater than</td></tr>
<tr><td>1101</td><td>LE</td><td>(Z = 1) OR (N ≠ V)</td><td>Signed less than or equal</td></tr>
<tr><td>1110</td><td>AL</td><td>—</td><td>Always (unconditional)</td></tr>
<tr><td>1111</td><td>—</td><td>—</td><td>This instruction can only be executed unconditionally</td></tr>
</table>
<p class="pitfall">⚠️ <strong>The slide prints four codes with five bits: MI = 00100, PL = 00101, VS = 00110, VC = 00111.</strong> The condition field is <strong>4 bits wide</strong> — that is why the table has exactly 16 rows, 0000 to 1111. Those four must be <strong>0100, 0101, 0110, 0111</strong>. You can prove it from the table itself without any outside reference: every other row has four bits, and 16 rows require exactly 4 bits. Do not reproduce the five-bit versions in an answer.</p>
<ul>
<li><strong>Compare with Table 13.9 and notice the naming difference, because exams mix them.</strong> ARM uses <strong>N, Z, C, V</strong>; x86 uses <strong>S, Z, C, O</strong>. N and S are the same bit (sign/negative); V and O are the same bit (overflow). ARM says <em>Higher/Lower</em> for unsigned and <em>Greater/Less</em> for signed, where x86 says <em>Above/Below</em> and <em>Greater/Less</em>.</li>
<li><strong>ARM writes the signed rules in their compact form, and it is worth learning that form.</strong> GE is "N = V"; LT is "N ≠ V". This is the same rule that x86's Table 13.9 spells out in disjunctive form — and the row the x86 slide got wrong. Learn the ARM formulation and you can never be caught by the x86 misprint.</li>
<li><strong>Why conditional execution of <em>every</em> instruction was worth 4 bits per instruction.</strong> A short <code>if</code> body compiles into a few conditional instructions instead of a branch over them. No branch means nothing for the pipeline to mispredict — which is a direct answer to the pipeline problem of Chapter 12, and the reason ARM could get good performance from a short, simple pipeline.</li>
<li><strong>The price, and why modern ARM dropped it.</strong> Four bits of every 32 (12,5% of the entire instruction encoding) spent on a field most instructions do not use. ARM's 64-bit A64 encoding removed general conditional execution, keeping it only for a few instructions such as conditional select. A textbook example of an idea that was right for its era and was then re-evaluated.</li>
<li><strong>Row 1111 is a historical scar.</strong> It once meant NV ("never"), an instruction that was fetched, decoded and then did nothing. It was deprecated and the encoding space was reclaimed for unconditional-only instructions — which is what the slide's comment means.</li>
</ul>
<p class="nhan">📐 Cross-check with the measured flags of slide 34. For <code>CMP(−2147483648, 1)</code> we measured N = 0, V = 1. ARM's <code>LT</code> is "N ≠ V" ⇒ 0 ≠ 1 ⇒ <strong>true</strong>, and −2 147 483 648 genuinely is less than 1. Meanwhile <code>LO</code> (C = 0) is false, and as an unsigned value 0x80000000 genuinely is higher than 1. Both architectures, the same two correct answers — the rule is the same rule wearing different letters.</p>`,
        `<p class="y-chinh">🎯 Đọc kỹ tiêu đề: đây là <strong>THỰC HIỆN LỆNH CÓ ĐIỀU KIỆN</strong>, không phải rẽ nhánh có điều kiện. Trên ARM, một trường điều kiện 4 bit được gắn vào lệnh nói chung, nên <em>BẤT KỲ</em> lệnh nào cũng có thể được cho chạy hoặc bị bỏ qua tuỳ theo các cờ. Đây là ý tưởng đặc trưng nhất của ARM và slide này là chỗ bạn gặp nó.</p>
<table>
<tr><th>Mã</th><th>Ký hiệu</th><th>Điều kiện kiểm</th><th>Ghi chú</th></tr>
<tr><td>0000</td><td>EQ</td><td>Z = 1</td><td>Bằng nhau</td></tr>
<tr><td>0001</td><td>NE</td><td>Z = 0</td><td>Khác nhau</td></tr>
<tr><td>0010</td><td>CS/HS</td><td>C = 1</td><td>Có nhớ / không dấu lớn hơn hoặc bằng</td></tr>
<tr><td>0011</td><td>CC/LO</td><td>C = 0</td><td>Không nhớ / không dấu nhỏ hơn</td></tr>
<tr><td>0100</td><td>MI</td><td>N = 1</td><td>Âm</td></tr>
<tr><td>0101</td><td>PL</td><td>N = 0</td><td>Dương hoặc bằng 0</td></tr>
<tr><td>0110</td><td>VS</td><td>V = 1</td><td>Tràn</td></tr>
<tr><td>0111</td><td>VC</td><td>V = 0</td><td>Không tràn</td></tr>
<tr><td>1000</td><td>HI</td><td>C = 1 AND Z = 0</td><td>Không dấu lớn hơn</td></tr>
<tr><td>1001</td><td>LS</td><td>C = 0 OR Z = 1</td><td>Không dấu nhỏ hơn hoặc bằng</td></tr>
<tr><td>1010</td><td>GE</td><td>N = V</td><td>Có dấu lớn hơn hoặc bằng</td></tr>
<tr><td>1011</td><td>LT</td><td>N ≠ V</td><td>Có dấu nhỏ hơn</td></tr>
<tr><td>1100</td><td>GT</td><td>(Z = 0) AND (N = V)</td><td>Có dấu lớn hơn</td></tr>
<tr><td>1101</td><td>LE</td><td>(Z = 1) OR (N ≠ V)</td><td>Có dấu nhỏ hơn hoặc bằng</td></tr>
<tr><td>1110</td><td>AL</td><td>—</td><td>Luôn luôn (không điều kiện)</td></tr>
<tr><td>1111</td><td>—</td><td>—</td><td>Lệnh này chỉ thực hiện được không điều kiện</td></tr>
</table>
<p class="pitfall">⚠️ <strong>Slide in BỐN mã bằng NĂM bit: MI = 00100, PL = 00101, VS = 00110, VC = 00111.</strong> Trường điều kiện rộng <strong>4 BIT</strong> — đó chính là lý do bảng có đúng 16 dòng, từ 0000 tới 1111. Bốn mã ấy phải là <strong>0100, 0101, 0110, 0111</strong>. Bạn chứng minh được ngay từ chính cái bảng mà không cần tra nguồn nào: mọi dòng khác đều bốn bit, và 16 dòng thì cần đúng 4 bit. Đừng chép lại bản năm bit vào bài làm.</p>
<ul>
<li><strong>So với Table 13.9 và để ý khác biệt về TÊN GỌI, vì đề thi hay trộn lẫn.</strong> ARM dùng <strong>N, Z, C, V</strong>; x86 dùng <strong>S, Z, C, O</strong>. N và S là cùng một bit (dấu/âm); V và O là cùng một bit (tràn). ARM nói <em>Higher/Lower</em> cho không dấu và <em>Greater/Less</em> cho có dấu, còn x86 nói <em>Above/Below</em> và <em>Greater/Less</em>.</li>
<li><strong>ARM viết các quy tắc có dấu ở dạng GỌN, và dạng đó rất đáng thuộc.</strong> GE là "N = V"; LT là "N ≠ V". Đây đúng là quy tắc mà Table 13.9 của x86 trải dài ra thành dạng tuyển — và là dòng mà slide x86 in SAI. Thuộc cách phát biểu của ARM thì bạn không bao giờ bị bản in lỗi của x86 bắt bài.</li>
<li><strong>Vì sao việc cho MỌI lệnh có điều kiện lại đáng giá 4 bit mỗi lệnh.</strong> Thân một câu <code>if</code> ngắn được dịch thành vài lệnh có điều kiện thay vì một lệnh rẽ nhánh nhảy qua chúng. Không có rẽ nhánh thì đường ống chẳng có gì để đoán sai — một câu trả lời trực tiếp cho vấn đề đường ống của Chương 12, và là lý do ARM đạt được hiệu năng tốt với một đường ống ngắn, đơn giản.</li>
<li><strong>Cái giá, và vì sao ARM hiện đại bỏ nó đi.</strong> Bốn bit trong mỗi 32 bit (12,5% toàn bộ mã hoá lệnh) dành cho một trường mà phần lớn lệnh không dùng tới. Mã hoá A64 64 bit của ARM đã bỏ cơ chế thực hiện có điều kiện tổng quát, chỉ giữ lại cho vài lệnh như chọn có điều kiện. Một ví dụ sách giáo khoa về ý tưởng đúng với thời của nó rồi được đánh giá lại.</li>
<li><strong>Dòng 1111 là một vết sẹo lịch sử.</strong> Nó từng nghĩa là NV ("không bao giờ"), tức một lệnh được nạp, được giải mã, rồi không làm gì. Nó bị khai tử và không gian mã hoá ấy được thu hồi cho các lệnh chỉ chạy không điều kiện — đó là ý của dòng ghi chú trên slide.</li>
</ul>
<p class="nhan">📐 Đối chiếu chéo với các cờ ĐO ĐƯỢC ở slide 34. Với <code>CMP(−2147483648, 1)</code> ta đo được N = 0, V = 1. Điều kiện <code>LT</code> của ARM là "N ≠ V" ⇒ 0 ≠ 1 ⇒ <strong>ĐÚNG</strong>, và −2.147.483.648 quả thật nhỏ hơn 1. Trong khi đó <code>LO</code> (C = 0) là SAI, và hiểu theo không dấu thì 0x80000000 quả thật lớn hơn 1. Hai kiến trúc, vẫn hai đáp án đúng ấy — cùng một quy tắc, chỉ khoác bộ chữ cái khác.</p>`],

      [48, 'Summary — Chapter 13: Instruction Sets: Characteristics and Functions',
        `<p class="y-chinh">🎯 The closing checklist. Read it as a table of contents you must be able to expand from memory — if any line means nothing to you, that is the slide to go back to.</p>
<table>
<tr><th>Section on the summary</th><th>Where it was taught</th><th>The one thing to remember</th></tr>
<tr><td>Machine instruction characteristics · elements of an instruction</td><td>slides 2–4</td><td>Opcode, source operand(s), result operand, next-instruction reference — operands live in memory, I/O, a register, or the instruction itself (immediate)</td></tr>
<tr><td>Instruction representation</td><td>slides 5–6</td><td>Bits → fields → mnemonics; each symbolic opcode has a fixed binary representation</td></tr>
<tr><td>Instruction types · number of addresses</td><td>slides 7–9</td><td>Table 13.1: 3 addresses <code>A ← B OP C</code>, 2 addresses <code>A ← A OP B</code>, 1 address <code>AC ← AC OP A</code>, 0 addresses <code>T ← (T−1) OP T</code></td></tr>
<tr><td>Instruction set design</td><td>slide 10</td><td>Every choice is a trade between instruction length, opcode space and how much the compiler must do</td></tr>
<tr><td>Types of operands: numbers, characters, logical data</td><td>slides 11–14</td><td>Binary integer, binary floating point, packed decimal; IRA/ASCII and EBCDIC; the n-bit logical unit</td></tr>
<tr><td>Intel x86 and ARM data types</td><td>slides 15–19</td><td>Table 13.2, the SIMD packed types, and <strong>ARM endian support (Figure 13.5)</strong> — the byte-order material worked through on slide 25</td></tr>
<tr><td>Types of operations: data transfer, arithmetic, logical, conversion, I/O, system control, transfer of control</td><td>slides 20–39</td><td>The seven families of Table 13.4 — and the fact that each one ends by <em>setting flags</em> or <em>updating the PC</em></td></tr>
<tr><td>Intel x86 and ARM operation types</td><td>slides 40–47</td><td>CISC versus RISC, seen through CALL/ENTER/LEAVE, the flag tables, MMX, and ARM conditional execution</td></tr>
</table>
<ul>
<li><strong>The single thread running through the chapter.</strong> An instruction set is a <em>contract</em> between hardware and software. Everything in it — how many addresses, which data types, which operations, how conditions are tested — is a decision about which side of that contract carries the complexity.</li>
<li><strong>The three things most likely to be examined from the second half.</strong> (1) Work a shift/rotate table by hand (slide 29). (2) Trace a nested procedure call through a stack, step by step (slide 38). (3) Decide a signed versus unsigned comparison from the flags (slides 41–42, 47).</li>
<li><strong>Where the course goes next.</strong> Chapter 11 takes the same instructions and asks <em>how operands are addressed</em> and <em>how the bits are laid out</em>. Chapter 12 asks <em>how the processor executes them</em> and meets the branch problem this chapter created. Chapter 13 asks whether a smaller, simpler instruction set would have been better all along.</li>
<li><strong>Two slide errors found in this half, stated openly so you do not learn them.</strong> Table 13.9 (slide 42), row L/NGE: the second clause should be (S = 0 AND O = 1); as printed, L and GE contradict each other. Table 13.11 (slide 47): MI, PL, VS, VC are printed with five-bit codes; the field is 4 bits, so they are 0100, 0101, 0110, 0111. Table 13.10 (slide 44) also prints <code>PNDN</code> for <code>PANDN</code>.</li>
</ul>
<p class="meo">💡 One question to test yourself with, covering the whole second half: <em>"Take <code>if (a &lt; b) f();</code> and describe everything the machine does."</em> A good answer names a CMP (arithmetic, sets flags), a conditional jump (transfer of control, reads S and O, jumps if S ≠ O), a CALL (pushes the return address, allocates a stack frame with four steps), the procedure's own RETURN (pops it), and the pipeline cost of the branch. That is slides 26, 34, 36–40, 41–42 in a single sentence of C.</p>`,
        `<p class="y-chinh">🎯 Danh mục khép chương. Hãy đọc nó như một MỤC LỤC mà bạn phải tự bung ra được từ trí nhớ — dòng nào không gợi lên gì thì đó chính là slide cần quay lại.</p>
<table>
<tr><th>Mục trên slide tổng kết</th><th>Dạy ở đâu</th><th>Điều DUY NHẤT cần nhớ</th></tr>
<tr><td>Đặc điểm lệnh máy · các thành phần của một lệnh</td><td>slide 2–4</td><td>Mã lệnh, toán hạng nguồn, toán hạng kết quả, tham chiếu lệnh kế tiếp — toán hạng nằm ở bộ nhớ, thiết bị I/O, thanh ghi, hoặc ngay trong lệnh (tức thì)</td></tr>
<tr><td>Biểu diễn lệnh</td><td>slide 5–6</td><td>Bit → trường → ký hiệu gợi nhớ; mỗi mã lệnh ký hiệu có một biểu diễn nhị phân CỐ ĐỊNH</td></tr>
<tr><td>Các loại lệnh · số lượng địa chỉ</td><td>slide 7–9</td><td>Table 13.1: 3 địa chỉ <code>A ← B OP C</code>, 2 địa chỉ <code>A ← A OP B</code>, 1 địa chỉ <code>AC ← AC OP A</code>, 0 địa chỉ <code>T ← (T−1) OP T</code></td></tr>
<tr><td>Thiết kế tập lệnh</td><td>slide 10</td><td>Mọi lựa chọn đều là cuộc đánh đổi giữa độ dài lệnh, không gian mã lệnh, và phần việc mà trình biên dịch phải gánh</td></tr>
<tr><td>Các loại toán hạng: số, ký tự, dữ liệu logic</td><td>slide 11–14</td><td>Số nguyên nhị phân, dấu chấm động nhị phân, thập phân nén; IRA/ASCII và EBCDIC; đơn vị logic n bit</td></tr>
<tr><td>Kiểu dữ liệu của Intel x86 và ARM</td><td>slide 15–19</td><td>Table 13.2, các kiểu gói SIMD, và <strong>hỗ trợ endian của ARM (Figure 13.5)</strong> — phần thứ tự byte đã được giải trọn ở slide 25</td></tr>
<tr><td>Các loại phép toán: chuyển dữ liệu, số học, logic, chuyển đổi, vào/ra, điều khiển hệ thống, chuyển điều khiển</td><td>slide 20–39</td><td>Bảy họ của Table 13.4 — và sự thật là họ nào cũng kết thúc bằng việc <em>ĐẶT CỜ</em> hoặc <em>CẬP NHẬT PC</em></td></tr>
<tr><td>Các loại phép toán của Intel x86 và ARM</td><td>slide 40–47</td><td>CISC so với RISC, nhìn qua CALL/ENTER/LEAVE, các bảng cờ, MMX, và cơ chế thực hiện có điều kiện của ARM</td></tr>
</table>
<ul>
<li><strong>Sợi chỉ xuyên suốt cả chương.</strong> Tập lệnh là một <em>BẢN HỢP ĐỒNG</em> giữa phần cứng và phần mềm. Mọi thứ trong đó — bao nhiêu địa chỉ, những kiểu dữ liệu nào, những phép toán nào, kiểm điều kiện ra sao — đều là quyết định xem BÊN NÀO của hợp đồng sẽ gánh phần phức tạp.</li>
<li><strong>Ba thứ dễ ra đề nhất ở nửa sau.</strong> (1) Làm tay một bảng dịch/quay (slide 29). (2) Chạy vết một chuỗi gọi thủ tục lồng nhau qua ngăn xếp, từng bước một (slide 38). (3) Quyết định một phép so sánh là có dấu hay không dấu từ các cờ (slide 41–42, 47).</li>
<li><strong>Môn học đi tiếp về đâu.</strong> Chương 11 lấy đúng những lệnh này và hỏi <em>toán hạng được định địa chỉ thế nào</em> và <em>các bit được bố trí ra sao</em>. Chương 12 hỏi <em>bộ xử lý thực hiện chúng thế nào</em> và đụng ngay bài toán rẽ nhánh mà chương này tạo ra. Chương 13 hỏi liệu một tập lệnh nhỏ hơn, đơn giản hơn có phải đã tốt hơn ngay từ đầu không.</li>
<li><strong>Hai lỗi slide tìm được ở nửa này, nói thẳng ra để bạn không học nhầm.</strong> Table 13.9 (slide 42), dòng L/NGE: vế thứ hai phải là (S = 0 AND O = 1); như bản in thì L và GE mâu thuẫn nhau. Table 13.11 (slide 47): MI, PL, VS, VC bị in bằng mã 5 bit; trường này 4 bit, nên chúng là 0100, 0101, 0110, 0111. Table 13.10 (slide 44) cũng in <code>PNDN</code> thay cho <code>PANDN</code>.</li>
</ul>
<p class="meo">💡 Một câu hỏi để tự kiểm, phủ trọn nửa sau chương: <em>"Lấy <code>if (a &lt; b) f();</code> và mô tả MỌI thứ cái máy làm."</em> Câu trả lời tốt sẽ gọi tên: một lệnh CMP (số học, đặt cờ), một lệnh nhảy có điều kiện (chuyển điều khiển, đọc S và O, nhảy khi S ≠ O), một lệnh CALL (đẩy địa chỉ trở về, cấp một khung ngăn xếp qua bốn bước), lệnh RETURN của chính thủ tục (lấy nó ra), và cái giá đường ống của lệnh rẽ nhánh. Đó là slide 26, 34, 36–40, 41–42 gói trong một câu C duy nhất.</p>`],
    ]),
  ].join('\n'),
};
