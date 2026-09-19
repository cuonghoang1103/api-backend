/**
 * CEA201 · Chương 5 trên web (= Chapter 6 bản 11e) — Internal Memory,
 * học theo từng slide, phần SAU: slide 21–40 của deck 'cea6'.
 *
 * ⚠️ ĐÁNH SỐ: syllabus của trường theo bản 9th ed gọi khối này là "Chapter 5:
 * Internal Memory"; slide là bản 11th ed nên in "Chapter 6". Xem bảng quy đổi
 * trong _slides.mjs. Tên file là ch5b (theo web), chữ trên slide là Ch.6.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH06-COA11e.pptx (/tmp/cea201-text/cea6.txt).
 * Slide chỉ có tiêu đề + hình/bảng (21, 22, 24, 25, 27, 30, 32, 33, 35, 36, 37,
 * 38, 39) đã được ĐỌC THẲNG TỪ ẢNH render ở /tmp/cea201-slides/cea6/NNN.webp —
 * kể cả slide 24 (bản trích chỉ ra mỗi tiêu đề "Synchronous DRAM (SDRAM)" trong
 * khi slide có ba khối chữ thật) và slide 22 (sáu hình Venn (a)–(f), phải cắt
 * ảnh phóng to từng ô mới đọc được từng bit).
 *
 * ⚠️ MỌI con số trong bài đã kiểm bằng python3 TRƯỚC khi viết:
 *   · 2^k ≥ m + k + 1 → k = 4·5·6·7·8·9 cho m = 8·16·32·64·128·256, và % tăng
 *     50 · 31,25 · 18,75 · 10,94 · 6,25 · 3,52. KHỚP ĐÚNG Table 6.2 (slide 19).
 *     SEC-DED k+1 → 62,5 · 37,5 · 21,875 · 12,5 · 7,03 · 3,91, cũng khớp.
 *   · Tự viết hàm mã hoá/giải mã Hamming (12,8) rồi DỰNG LẠI đúng Figure 6.10:
 *     từ dữ liệu D8..D1 = 00111001 → từ mã vị trí 12..1 = 001101001111, check
 *     C8C4C2C1 = 0111 — khớp hàng "Word stored as" của slide. Lật bit vị trí 6
 *     → "Word fetched as" = 001101101111 khớp slide, check tính lại = 0001
 *     khớp hàng cuối slide, syndrome = 0110 = 6 = đúng vị trí hỏng.
 *   · QUÉT VÉT CẠN: cả 256 từ dữ liệu × 12 vị trí lỗi đơn → syndrome LUÔN bằng
 *     đúng số vị trí. 0/66 cặp lỗi đôi cho syndrome 0 ⇒ SEC một mình hiểu nhầm
 *     CẢ 66 cặp thành lỗi đơn và "sửa" sai.
 *   · SEC-DED 13 bit (thêm bit chẵn lẻ toàn cục): quét 256 từ × mọi lỗi 1 bit
 *     và MỌI cặp 2 bit → phân loại đúng 100%.
 *   · Băng thông = tần số I/O × 2 × 8 byte: DDR-400 3,2 · DDR2-800 6,4 ·
 *     DDR3-1600 12,8 · DDR4-3200 25,6 · DDR5-4800 38,4 GB/s (một kênh 64 bit).
 *   · Công suất ~ V²: 2,5 V → 1,1 V còn 19,4% (giảm 80,6%).
 *
 * Chỗ slide gốc LỆCH/SAI/CŨ — nêu rõ trong bài, không im lặng chép, không sửa:
 *   · slide 22 tiêu đề in "Hamming SEC-DEC Code". Đúng phải là **SEC-DED**
 *     (Single-Error Correction, Double-Error Detection) — chính slide 19 của
 *     deck này viết đúng "Single-Error Correction/Double-Error Detection".
 *   · slide 29 (Table 6.4) ghi DDR4 = 2133–4266 Mbps, nhưng slide 30
 *     (Figure 6.14) vẽ DDR4 I/O 667–1600 MHz ⇒ 1333–3200 Mbps. HAI CHỖ TRONG
 *     CÙNG MỘT DECK NÓI KHÁC NHAU. Ba thế hệ kia thì hai chỗ khớp nhau.
 *   · slide 27 chú thích "CAS latency = 2" nhưng hình vẽ DOUT A0 nằm ngay vạch
 *     T3, tức 3 vạch sau READ A ở T0. Lấy theo ĐỊNH NGHĨA trong chú thích.
 *   · cả deck DỪNG Ở DDR4 (sách in 2022). DDR5 ra JEDEC 7/2020 và là thứ đang
 *     cắm trong máy người học — bài có bảng DDR5 nhưng GHI RÕ là ngoài slide.
 *   · slide 3 (Table 6.1) của deck xếp flash vào "read-mostly memory"; slide 34
 *     lại nói flash dùng cho cả bộ nhớ trong lẫn bộ nhớ ngoài. Không mâu thuẫn,
 *     nhưng đó là lý do SSD nằm ở Ch.7 chứ không ở đây.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea6';

export default {
  title: '5.0b — Slide by slide: Error correction, DDR SDRAM, eDRAM and new memory technologies (slides 21–40)|||5.0b — Slide bài giảng: Sửa lỗi bộ nhớ, DDR SDRAM, eDRAM & công nghệ nhớ mới (slide 21–40)',
  slug: 'cea201-5-0b-slides-sua-loi-ddr-edram-cong-nghe-moi',
  type: 'DOCUMENT',
  description: 'Nửa sau Chương 5 (Internal Memory) của CEA201, slide 21–40 — phần có nhiều điểm thi nhất của cả chương. Mở đầu bằng MÃ HAMMING làm trọn từng bước: công thức 2^k ≥ m+k+1, mã hoá đủ 8 bit dữ liệu thành từ mã 12 bit đúng như Figure 6.10 của sách, lật một bit rồi tính syndrome chỉ thẳng vào vị trí hỏng, và một ca hai bit hỏng cho thấy SEC-DED chỉ PHÁT HIỆN chứ không sửa được. Tiếp là SDRAM (sơ đồ khối 256-Mb, bảng chân, giản đồ thời gian burst 4 / CAS latency 2), DDR SDRAM với bảng đầy đủ DDR1→DDR5 và phép tính băng thông tần_số × 2 × 8 byte, eDRAM trên IBM z13 và Intel Core, rồi bộ nhớ flash (cấu trúc cổng nổi, NOR so với NAND) và ba công nghệ nhớ mới STT-RAM · PCRAM · ReRAM. Mọi con số đã kiểm bằng python3, kể cả phép quét vét cạn 256 từ mã × mọi vị trí lỗi.',
  content: [
    walkHead(D, 21, 40),
    walk(D, [

      [21, 'Figure 6.10 — Check Bit Calculation',
        `<p class="y-chinh">🎯 The single most examinable slide of the chapter: a complete <strong>Hamming code</strong> worked out on one 8-bit word. Read the table top-to-bottom as a story — a word is <em>written</em> with four check bits, it is <em>read back</em> with one bit changed, and the recomputed check bits <strong>spell out the position of the damaged bit in binary</strong>.</p>
<p class="nhan">📐 Step 0 — how many check bits do you need? The rule is <code>2<sup>k</sup> &gt;= m + k + 1</code>, where <em>m</em> = data bits and <em>k</em> = check bits. Reasoning: the syndrome is a <em>k</em>-bit number, so it has 2<sup>k</sup> possible values; it must be able to say "no error" (1 value) or "bit number <em>i</em> is wrong" for each of the <em>m</em> + <em>k</em> bits of the stored word.</p>
<table>
<tr><th>Data bits m</th><th>Smallest k with 2<sup>k</sup> &gt;= m+k+1</th><th>Check</th><th>Total word</th><th>Overhead</th></tr>
<tr><td>8</td><td><strong>4</strong></td><td>2<sup>4</sup> = 16 &gt;= 13 ✓ (k = 3 gives 8 &lt; 12 ✗)</td><td>12</td><td>50,0%</td></tr>
<tr><td>16</td><td><strong>5</strong></td><td>32 &gt;= 22 ✓</td><td>21</td><td>31,25%</td></tr>
<tr><td>32</td><td><strong>6</strong></td><td>64 &gt;= 39 ✓</td><td>38</td><td>18,75%</td></tr>
<tr><td>64</td><td><strong>7</strong></td><td>128 &gt;= 72 ✓</td><td>71</td><td>10,94%</td></tr>
<tr><td>128</td><td><strong>8</strong></td><td>256 &gt;= 137 ✓</td><td>136</td><td>6,25%</td></tr>
<tr><td>256</td><td><strong>9</strong></td><td>512 &gt;= 266 ✓</td><td>265</td><td>3,52%</td></tr>
</table>
<p class="nhan">📐 Step 1 — where the bits live (this is Figure 6.9, the previous slide, and the top three rows of this one). Check bits take the <strong>power-of-two positions 1, 2, 4, 8</strong>; data bits fill everything else. A bit at position <em>p</em> belongs to check group C<em>j</em> exactly when bit <em>j</em> is set in the binary of <em>p</em>:</p>
<table>
<tr><th>Position</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th></tr>
<tr><td><strong>Binary</strong></td><td>0001</td><td>0010</td><td>0011</td><td>0100</td><td>0101</td><td>0110</td><td>0111</td><td>1000</td><td>1001</td><td>1010</td><td>1011</td><td>1100</td></tr>
<tr><td><strong>Holds</strong></td><td>C1</td><td>C2</td><td>D1</td><td>C4</td><td>D2</td><td>D3</td><td>D4</td><td>C8</td><td>D5</td><td>D6</td><td>D7</td><td>D8</td></tr>
<tr><td><strong>In C1?</strong></td><td>—</td><td></td><td>✓</td><td></td><td>✓</td><td></td><td>✓</td><td></td><td>✓</td><td></td><td>✓</td><td></td></tr>
<tr><td><strong>In C2?</strong></td><td></td><td>—</td><td>✓</td><td></td><td></td><td>✓</td><td>✓</td><td></td><td></td><td>✓</td><td>✓</td><td></td></tr>
<tr><td><strong>In C4?</strong></td><td></td><td></td><td></td><td>—</td><td>✓</td><td>✓</td><td>✓</td><td></td><td></td><td></td><td></td><td>✓</td></tr>
<tr><td><strong>In C8?</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>—</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
</table>
<p class="nhan">📐 Step 2 — encode the slide's own word. Its data is <strong>D8…D1 = 0 0 1 1 1 0 0 1</strong>, so position 3 = D1 = 1, 5 = D2 = 0, 6 = D3 = 0, 7 = D4 = 1, 9 = D5 = 1, 10 = D6 = 1, 11 = D7 = 0, 12 = D8 = 0. Each check bit is the XOR (even parity) of its group:</p>
<pre>C1 = pos 3,5,7,9,11  = 1 XOR 0 XOR 1 XOR 1 XOR 0 = 1
C2 = pos 3,6,7,10,11 = 1 XOR 0 XOR 1 XOR 1 XOR 0 = 1
C4 = pos 5,6,7,12    = 0 XOR 0 XOR 1 XOR 0       = 1
C8 = pos 9,10,11,12  = 1 XOR 1 XOR 0 XOR 0       = 0</pre>
<p class="dap-an">✅ Word stored, positions 12 down to 1: <strong>0 0 1 1 0 1 0 0 1 1 1 1</strong> — exactly the "Word stored as" row of the slide. Verified by machine.</p>
<p class="nhan">📐 Step 3 — read it back damaged. The slide's "Word fetched as" row is <strong>0 0 1 1 0 1 <em>1</em> 0 1 1 1 1</strong>: position 6 (which holds D3) flipped from 0 to 1. Recompute the four check bits from the <em>data bits as received</em>:</p>
<pre>C1' = 1 XOR 0 XOR 1 XOR 1 XOR 0 = 1      (position 6 is not in group C1)
C2' = 1 XOR 1 XOR 1 XOR 1 XOR 0 = 0
C4' = 0 XOR 1 XOR 1 XOR 0       = 0
C8' = 1 XOR 1 XOR 0 XOR 0       = 0</pre>
<p class="nhan">📐 Step 4 — the syndrome is old XOR new, written C8 C4 C2 C1:</p>
<table>
<tr><th></th><th>C8</th><th>C4</th><th>C2</th><th>C1</th></tr>
<tr><td>stored</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>recomputed</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td><strong>syndrome (XOR)</strong></td><td><strong>0</strong></td><td><strong>1</strong></td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
</table>
<p class="dap-an">✅ Syndrome = 01102 = <strong>6</strong>. Go to position 6, flip it, done — the word is repaired and D3 is 0 again. The elegance is that the syndrome is not a "which check failed" flag; it <em>is</em> the bit number, in binary, for free. Checked exhaustively: all 256 possible data words × all 12 error positions, the syndrome always equals the position.</p>
<p class="meo">💡 Why powers of two? Because position 2<sup>j</sup> is the <em>only</em> position whose binary has bit <em>j</em> set and nothing else — so C<em>j</em> sits alone in its own group and can be solved for directly. Put a check bit anywhere else and the four equations become tangled.</p>
<p class="pitfall">⚠️ Trap 1 — numbering starts at <strong>1</strong>, not 0, and the leftmost column of the figure is position <strong>12</strong>, not position 1. Trap 2 — the syndrome being 0000 means "no single-bit error found", <em>not</em> "the data is certainly correct". Trap 3 — plain SEC is <strong>dangerous</strong> on two errors: of the 66 possible 2-bit error pairs in this 12-bit word, <strong>all 66</strong> produce a non-zero syndrome, so the decoder confidently "corrects" a third, innocent bit. That is exactly the hole slide 22 plugs.</p>`,
        `<p class="y-chinh">🎯 Slide đáng đi thi nhất của cả chương: một <strong>mã Hamming</strong> làm trọn vẹn trên đúng một từ 8 bit. Hãy đọc bảng từ trên xuống như một câu chuyện — một từ được <em>GHI</em> kèm bốn bit kiểm tra, rồi được <em>ĐỌC VỀ</em> với một bit đã đổi, và bốn bit kiểm tra tính lại <strong>đánh vần ra ĐÚNG VỊ TRÍ bit hỏng, dưới dạng nhị phân</strong>.</p>
<p class="nhan">📐 Bước 0 — cần bao nhiêu bit kiểm tra? Quy tắc là <code>2<sup>k</sup> &gt;= m + k + 1</code>, với <em>m</em> = số bit dữ liệu, <em>k</em> = số bit kiểm tra. Lý do: syndrome là một số <em>k</em> bit nên có 2<sup>k</sup> giá trị; nó phải nói được "không lỗi" (1 giá trị) HOẶC "bit số <em>i</em> hỏng" cho từng bit trong <em>m</em> + <em>k</em> bit của từ đã lưu.</p>
<table>
<tr><th>Bit dữ liệu m</th><th>k nhỏ nhất thoả 2<sup>k</sup> &gt;= m+k+1</th><th>Kiểm chứng</th><th>Cả từ</th><th>Phụ trội</th></tr>
<tr><td>8</td><td><strong>4</strong></td><td>2<sup>4</sup> = 16 &gt;= 13 ✓ (k = 3 cho 8 &lt; 12 ✗)</td><td>12</td><td>50,0%</td></tr>
<tr><td>16</td><td><strong>5</strong></td><td>32 &gt;= 22 ✓</td><td>21</td><td>31,25%</td></tr>
<tr><td>32</td><td><strong>6</strong></td><td>64 &gt;= 39 ✓</td><td>38</td><td>18,75%</td></tr>
<tr><td>64</td><td><strong>7</strong></td><td>128 &gt;= 72 ✓</td><td>71</td><td>10,94%</td></tr>
<tr><td>128</td><td><strong>8</strong></td><td>256 &gt;= 137 ✓</td><td>136</td><td>6,25%</td></tr>
<tr><td>256</td><td><strong>9</strong></td><td>512 &gt;= 266 ✓</td><td>265</td><td>3,52%</td></tr>
</table>
<p class="nhan">📐 Bước 1 — bit nào nằm ở đâu (đây là Figure 6.9 ở slide trước, và ba hàng đầu của slide này). Bit kiểm tra chiếm các <strong>vị trí luỹ thừa của 2: 1, 2, 4, 8</strong>; bit dữ liệu lấp mọi chỗ còn lại. Bit ở vị trí <em>p</em> thuộc nhóm kiểm tra C<em>j</em> đúng khi nhị phân của <em>p</em> có bit <em>j</em> bằng 1:</p>
<table>
<tr><th>Vị trí</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th></tr>
<tr><td><strong>Nhị phân</strong></td><td>0001</td><td>0010</td><td>0011</td><td>0100</td><td>0101</td><td>0110</td><td>0111</td><td>1000</td><td>1001</td><td>1010</td><td>1011</td><td>1100</td></tr>
<tr><td><strong>Chứa</strong></td><td>C1</td><td>C2</td><td>D1</td><td>C4</td><td>D2</td><td>D3</td><td>D4</td><td>C8</td><td>D5</td><td>D6</td><td>D7</td><td>D8</td></tr>
<tr><td><strong>Thuộc C1?</strong></td><td>—</td><td></td><td>✓</td><td></td><td>✓</td><td></td><td>✓</td><td></td><td>✓</td><td></td><td>✓</td><td></td></tr>
<tr><td><strong>Thuộc C2?</strong></td><td></td><td>—</td><td>✓</td><td></td><td></td><td>✓</td><td>✓</td><td></td><td></td><td>✓</td><td>✓</td><td></td></tr>
<tr><td><strong>Thuộc C4?</strong></td><td></td><td></td><td></td><td>—</td><td>✓</td><td>✓</td><td>✓</td><td></td><td></td><td></td><td></td><td>✓</td></tr>
<tr><td><strong>Thuộc C8?</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>—</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
</table>
<p class="nhan">📐 Bước 2 — mã hoá chính từ của slide. Dữ liệu là <strong>D8…D1 = 0 0 1 1 1 0 0 1</strong>, tức vị trí 3 = D1 = 1, 5 = D2 = 0, 6 = D3 = 0, 7 = D4 = 1, 9 = D5 = 1, 10 = D6 = 1, 11 = D7 = 0, 12 = D8 = 0. Mỗi bit kiểm tra là XOR (chẵn lẻ CHẴN) của nhóm mình:</p>
<pre>C1 = vị trí 3,5,7,9,11  = 1 XOR 0 XOR 1 XOR 1 XOR 0 = 1
C2 = vị trí 3,6,7,10,11 = 1 XOR 0 XOR 1 XOR 1 XOR 0 = 1
C4 = vị trí 5,6,7,12    = 0 XOR 0 XOR 1 XOR 0       = 1
C8 = vị trí 9,10,11,12  = 1 XOR 1 XOR 0 XOR 0       = 0</pre>
<p class="dap-an">✅ Từ đem lưu, vị trí 12 xuống 1: <strong>0 0 1 1 0 1 0 0 1 1 1 1</strong> — đúng y hàng "Word stored as" của slide. Đã kiểm bằng máy.</p>
<p class="nhan">📐 Bước 3 — đọc về bị hỏng. Hàng "Word fetched as" của slide là <strong>0 0 1 1 0 1 <em>1</em> 0 1 1 1 1</strong>: vị trí 6 (chứa D3) lật từ 0 thành 1. Tính lại bốn bit kiểm tra từ <em>dữ liệu vừa nhận</em>:</p>
<pre>C1' = 1 XOR 0 XOR 1 XOR 1 XOR 0 = 1      (vị trí 6 KHÔNG thuộc nhóm C1)
C2' = 1 XOR 1 XOR 1 XOR 1 XOR 0 = 0
C4' = 0 XOR 1 XOR 1 XOR 0       = 0
C8' = 1 XOR 1 XOR 0 XOR 0       = 0</pre>
<p class="nhan">📐 Bước 4 — syndrome = cũ XOR mới, viết theo thứ tự C8 C4 C2 C1:</p>
<table>
<tr><th></th><th>C8</th><th>C4</th><th>C2</th><th>C1</th></tr>
<tr><td>đã lưu</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>tính lại</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td><strong>syndrome (XOR)</strong></td><td><strong>0</strong></td><td><strong>1</strong></td><td><strong>1</strong></td><td><strong>0</strong></td></tr>
</table>
<p class="dap-an">✅ Syndrome = 01102 = <strong>6</strong>. Đến vị trí 6, lật bit đó lại, xong — từ đã được vá và D3 trở về 0. Cái đẹp nằm ở chỗ syndrome KHÔNG phải một lá cờ "nhóm nào sai"; nó <em>CHÍNH LÀ</em> số hiệu vị trí, dạng nhị phân, miễn phí. Đã kiểm vét cạn: cả 256 từ dữ liệu × cả 12 vị trí lỗi, syndrome LUÔN bằng đúng số vị trí.</p>
<p class="meo">💡 Vì sao lại là luỹ thừa của 2? Vì vị trí 2<sup>j</sup> là vị trí DUY NHẤT có nhị phân bật đúng bit <em>j</em> và không bật gì khác — nên C<em>j</em> đứng một mình trong nhóm của nó và giải ra được ngay. Đặt bit kiểm tra ở chỗ khác thì bốn phương trình rối vào nhau.</p>
<p class="pitfall">⚠️ Bẫy 1 — vị trí đánh số từ <strong>1</strong>, không phải 0, và cột TRÁI NHẤT của hình là vị trí <strong>12</strong> chứ không phải vị trí 1. Bẫy 2 — syndrome bằng 0000 nghĩa là "không tìm thấy lỗi ĐƠN", <em>KHÔNG</em> phải "dữ liệu chắc chắn đúng". Bẫy 3 — SEC trần <strong>NGUY HIỂM</strong> khi có hai lỗi: trong 66 cặp lỗi 2 bit có thể có của từ 12 bit này, <strong>cả 66 cặp</strong> đều cho syndrome khác 0, nên bộ giải mã tự tin "sửa" thêm một bit thứ ba vốn đang lành. Đó đúng là cái lỗ mà slide 22 đi vá.</p>`],

      [22, 'Figure 6.11 — Hamming SEC-DEC Code (six Venn panels: encode, double error, why it cannot be corrected)',
        `<p class="y-chinh">🎯 Six Venn diagrams that show, without a single formula, why you must add <strong>one more check bit</strong> to go from "correct one error" to "correct one error <em>and notice two</em>". Each circle is one parity group; the four inner regions hold data bits; the small box underneath holds the extra <strong>overall parity bit</strong> that covers the whole word.</p>
<p class="pitfall">⚠️ First, a typo on the slide itself. The title reads "Hamming <strong>SEC-DEC</strong> Code". The standard name is <strong>SEC-DED</strong> — <em>Single-Error Correction, Double-Error Detection</em> — and slide 19 of this very deck spells it out correctly as "Single-Error Correction/Double-Error Detection". Write SEC-DED in your exam; "DEC" is a slip, not a different scheme.</p>
<table>
<tr><th>Panel</th><th>What is drawn</th><th>What it means</th></tr>
<tr><td><strong>(a)</strong></td><td>Only the four inner regions filled: A∩B = 0, centre = 1, A∩C = 1, B∩C = 0. Box empty.</td><td>The raw <strong>4 data bits</strong>, placed so that each one belongs to a different combination of circles.</td></tr>
<tr><td><strong>(b)</strong></td><td>Outer regions filled: A = 0, B = 1, C = 0; box = 1.</td><td>The complete codeword. Each circle now sums to an <strong>even</strong> number of 1s, and the box makes the grand total even too. Three 1s inside the circles + box 1 = 4. ✓</td></tr>
<tr><td><strong>(c)</strong></td><td>Word as read back: A = 1, B = 1, C = 0, A∩B = 0, centre = 0, A∩C = 1, B∩C = 0, box = 1.</td><td><strong>Two bits have flipped</strong> versus (b): the A check bit and the centre data bit.</td></tr>
<tr><td><strong>(d)</strong></td><td>Same word, with the B∩C region shaded grey.</td><td>Circle A checks even (two flips cancel inside it), circles B and C check odd. The one region inside B and C but outside A is <strong>B∩C</strong> — so a plain SEC decoder concludes "the error is there".</td></tr>
<tr><td><strong>(e)</strong></td><td>B∩C flipped to 1; all three circles now even.</td><td>The "repair" a SEC decoder would perform. The word now looks perfectly healthy to the three circles — and it is <strong>wrong in three places</strong>.</td></tr>
<tr><td><strong>(f)</strong></td><td>Identical word, but the box is shaded.</td><td>The <strong>overall parity bit</strong> no longer matches: the circles hold four 1s (even) yet the box says 1. That mismatch is the alarm — an <em>even</em> number of bits changed, so this was a double error and must <strong>not</strong> be "corrected".</td></tr>
</table>
<p class="nhan">📐 The SEC-DED decision rule in two lines. Let <em>S</em> = the syndrome from the ordinary check bits, and <em>P</em> = whether the overall parity bit disagrees:</p>
<table>
<tr><th>Syndrome S</th><th>Overall parity P</th><th>Verdict</th><th>Action</th></tr>
<tr><td>0</td><td>agrees</td><td>No error</td><td>use the data</td></tr>
<tr><td>non-zero</td><td>disagrees</td><td><strong>Single error at position S</strong></td><td>flip bit S, use the data</td></tr>
<tr><td>non-zero</td><td>agrees</td><td><strong>Double error</strong></td><td>report failure — do NOT correct</td></tr>
<tr><td>0</td><td>disagrees</td><td>The overall parity bit itself is the damaged one</td><td>data is fine</td></tr>
</table>
<p class="dap-an">✅ Verified by exhaustive machine check on the 13-bit (8 data + 4 check + 1 overall) version of the code from slide 21: for all 256 data words, <strong>every single-bit error</strong> was classified as "single error at position <em>p</em>" with the right <em>p</em>, and <strong>every one of the 78 possible two-bit pairs</strong> was classified as "double error, detect only". 100% correct, no exceptions. Worked example: take the slide-21 codeword 0 0 1 1 0 1 0 0 1 1 1 1 whose overall parity bit is 1; flip positions 6 and 7 → syndrome = 0001 = 1, which <em>looks</em> like "bit 1 is broken", but the overall parity still agrees ⇒ SEC-DED refuses and reports an uncorrectable double error. Without the extra bit, the machine would have flipped bit 1 and handed the program silently corrupt data.</p>
<p class="meo">💡 Remember it as a parity of parities. One bit-count tells you <em>how many</em> errors (odd or even); the syndrome tells you <em>where</em>. Odd + somewhere = fix it. Even + somewhere = two errors, give up honestly. The whole trick costs exactly <strong>one</strong> extra bit — look back at Table 6.2 (slide 19): for 64 data bits, SEC needs 7 check bits and SEC-DED needs 8, i.e. 10,94% overhead becomes 12,5%.</p>
<p class="pitfall">⚠️ The classic exam error is to say "SEC-DED corrects two errors". It does not — it <strong>detects</strong> two and corrects one. Nor does it promise anything at all about three errors: with three flips the parity is odd again, so the machine believes it is a single error and corrupts the word. Real servers push that risk down with <strong>Chipkill / SDDC</strong>-class codes and with scrubbing, not by trusting SEC-DED further than it goes.</p>`,
        `<p class="y-chinh">🎯 Sáu hình Venn cho thấy, không cần một công thức nào, vì sao phải thêm <strong>MỘT bit kiểm tra nữa</strong> để đi từ "sửa được một lỗi" sang "sửa một lỗi <em>VÀ nhận ra hai lỗi</em>". Mỗi vòng tròn là một nhóm chẵn lẻ; bốn vùng giao bên trong chứa bit dữ liệu; ô vuông nhỏ bên dưới chứa <strong>bit chẵn lẻ TOÀN CỤC</strong> phủ cả từ.</p>
<p class="pitfall">⚠️ Trước hết, một lỗi gõ ngay trên slide. Tiêu đề in "Hamming <strong>SEC-DEC</strong> Code". Tên chuẩn là <strong>SEC-DED</strong> — <em>Single-Error Correction, Double-Error Detection</em> — và chính slide 19 của deck này viết đúng "Single-Error Correction/Double-Error Detection". Đi thi cứ viết SEC-DED; "DEC" là lỡ tay, không phải một sơ đồ khác.</p>
<table>
<tr><th>Ô</th><th>Hình vẽ gì</th><th>Nghĩa là gì</th></tr>
<tr><td><strong>(a)</strong></td><td>Chỉ bốn vùng giao trong có số: A∩B = 0, tâm = 1, A∩C = 1, B∩C = 0. Ô vuông trống.</td><td><strong>4 bit dữ liệu</strong> thô, đặt sao cho mỗi bit thuộc một tổ hợp vòng tròn khác nhau.</td></tr>
<tr><td><strong>(b)</strong></td><td>Ba vùng ngoài được điền: A = 0, B = 1, C = 0; ô vuông = 1.</td><td>Từ mã hoàn chỉnh. Mỗi vòng tròn giờ có số bit 1 <strong>CHẴN</strong>, và ô vuông làm tổng toàn bộ cũng chẵn. Ba số 1 trong các vòng + ô vuông 1 = 4. ✓</td></tr>
<tr><td><strong>(c)</strong></td><td>Từ đọc về: A = 1, B = 1, C = 0, A∩B = 0, tâm = 0, A∩C = 1, B∩C = 0, ô vuông = 1.</td><td><strong>HAI bit đã lật</strong> so với (b): bit kiểm tra A và bit dữ liệu ở tâm.</td></tr>
<tr><td><strong>(d)</strong></td><td>Vẫn từ đó, nhưng vùng B∩C được tô xám.</td><td>Vòng A kiểm ra CHẴN (hai chỗ lật triệt tiêu nhau bên trong nó), vòng B và C kiểm ra LẺ. Vùng duy nhất nằm trong B và C mà ngoài A là <strong>B∩C</strong> — nên bộ giải mã SEC trần kết luận "lỗi ở đó".</td></tr>
<tr><td><strong>(e)</strong></td><td>B∩C bị lật thành 1; cả ba vòng giờ đều chẵn.</td><td>Cú "vá" mà bộ giải mã SEC sẽ làm. Từ nhìn qua ba vòng thì lành lặn hoàn hảo — mà thực ra nó đang <strong>SAI Ở BA CHỖ</strong>.</td></tr>
<tr><td><strong>(f)</strong></td><td>Vẫn từ đó, nhưng ô vuông bị tô xám.</td><td><strong>Bit chẵn lẻ toàn cục</strong> không còn khớp: trong các vòng có bốn số 1 (chẵn) mà ô vuông lại nói 1. Chỗ vênh đó là tiếng chuông báo — số bit đổi là <em>CHẴN</em>, tức đây là lỗi đôi và <strong>KHÔNG ĐƯỢC</strong> "sửa".</td></tr>
</table>
<p class="nhan">📐 Luật quyết định của SEC-DED gói trong hai dòng. Gọi <em>S</em> = syndrome từ các bit kiểm tra thường, và <em>P</em> = bit chẵn lẻ toàn cục có vênh hay không:</p>
<table>
<tr><th>Syndrome S</th><th>Chẵn lẻ toàn cục P</th><th>Kết luận</th><th>Hành động</th></tr>
<tr><td>0</td><td>khớp</td><td>Không lỗi</td><td>dùng dữ liệu</td></tr>
<tr><td>khác 0</td><td>vênh</td><td><strong>Lỗi ĐƠN tại vị trí S</strong></td><td>lật bit S rồi dùng</td></tr>
<tr><td>khác 0</td><td>khớp</td><td><strong>Lỗi ĐÔI</strong></td><td>báo hỏng — TUYỆT ĐỐI không sửa</td></tr>
<tr><td>0</td><td>vênh</td><td>Chính bit chẵn lẻ toàn cục bị hỏng</td><td>dữ liệu vẫn tốt</td></tr>
</table>
<p class="dap-an">✅ Đã kiểm vét cạn bằng máy trên bản 13 bit (8 dữ liệu + 4 kiểm tra + 1 toàn cục) của chính mã ở slide 21: với cả 256 từ dữ liệu, <strong>mọi lỗi 1 bit</strong> đều được phân loại đúng thành "lỗi đơn tại vị trí <em>p</em>" với đúng <em>p</em>, và <strong>cả 78 cặp lỗi 2 bit</strong> đều được phân loại thành "lỗi đôi, chỉ phát hiện". Đúng 100%, không ngoại lệ. Ví dụ cụ thể: lấy từ mã ở slide 21 là 0 0 1 1 0 1 0 0 1 1 1 1 với bit chẵn lẻ toàn cục = 1; lật vị trí 6 và 7 → syndrome = 0001 = 1, <em>trông như</em> "bit 1 hỏng", nhưng chẵn lẻ toàn cục vẫn khớp ⇒ SEC-DED từ chối và báo lỗi đôi không sửa được. Không có bit phụ đó, máy đã lật bit 1 và trao cho chương trình một dữ liệu hỏng trong im lặng.</p>
<p class="meo">💡 Nhớ nó như "chẵn lẻ của các chẵn lẻ". Một phép đếm cho biết <em>BAO NHIÊU</em> lỗi (lẻ hay chẵn); syndrome cho biết <em>Ở ĐÂU</em>. Lẻ + có chỗ = sửa. Chẵn + có chỗ = hai lỗi, chịu thua một cách trung thực. Cả mẹo đó tốn đúng <strong>MỘT</strong> bit — nhìn lại Table 6.2 (slide 19): với 64 bit dữ liệu, SEC cần 7 bit kiểm tra còn SEC-DED cần 8, tức phụ trội 10,94% thành 12,5%.</p>
<p class="pitfall">⚠️ Lỗi thi kinh điển là nói "SEC-DED sửa được hai lỗi". KHÔNG — nó <strong>PHÁT HIỆN</strong> hai lỗi và <strong>SỬA</strong> một lỗi. Nó cũng chẳng hứa gì về ba lỗi: ba chỗ lật thì chẵn lẻ lại thành lẻ, máy tin rằng đây là lỗi đơn và làm hỏng từ đó. Máy chủ thật đẩy rủi ro ấy xuống bằng các mã cỡ <strong>Chipkill / SDDC</strong> và bằng quét dọn định kỳ (scrubbing), chứ không phải bằng cách tin SEC-DED quá xa tầm của nó.</p>`],

      [23, 'Advanced DRAM Organization — SDRAM, DDR-DRAM, RDRAM',
        `<p class="y-chinh">🎯 The hinge of the chapter. Everything up to here was about the DRAM <em>cell</em>; from here on the subject is the DRAM <strong>interface</strong> — because, in the slide's own words, "one of the most critical system bottlenecks when using high-performance processors is the interface to main internal memory".</p>
<ul>
<li><strong>The problem, stated exactly as the slide does.</strong> "The traditional DRAM chip is constrained both by its <em>internal architecture</em> and by its <em>interface to the processor's memory bus</em>." Two separate handicaps: the cell array itself is slow (a charge must be sensed and restored), and on top of that the conversation with the processor is inefficient.</li>
<li><strong>Why the interface half is the one worth attacking.</strong> The cell array has barely got faster in twenty years — the 100–266 MHz you will see on slide 30 is almost unchanged across DDR1 to DDR4. Every generation of speed-up since SDRAM has come from <em>moving the data out faster</em>, not from making the capacitor answer faster.</li>
<li><strong>Three names, one survivor and a half.</strong> The slide lists <strong>SDRAM</strong>, <strong>DDR-DRAM</strong> and <strong>RDRAM</strong>, then says plainly which won: "the schemes that currently dominate the market are SDRAM and DDR-DRAM". RDRAM (Rambus) is history — technically interesting, commercially killed by licensing costs and latency. Note that DDR is not a rival of SDRAM but a <em>development</em> of it: every DDR chip is an SDRAM chip.</li>
<li><strong>"A number of enhancements have been explored."</strong> The book's full list includes fast page mode, EDO, burst EDO and cache DRAM as well; this deck fast-forwards to the two that matter. If a question names EDO or FPM, they are earlier, asynchronous attempts at the same goal.</li>
<li><strong>Where this sits in the course.</strong> Ch.4 said the memory hierarchy exists because DRAM is slow relative to the CPU. Ch.5 built cache to hide that. This slide admits that hiding is not enough: when a cache miss does happen, the DRAM must still deliver a whole block fast, and that is a <em>bandwidth</em> problem, not a latency one. Burst mode and DDR are bandwidth answers.</li>
</ul>
<p class="meo">💡 Keep the two words apart: <strong>latency</strong> = how long before the first byte arrives; <strong>bandwidth</strong> = how many bytes per second once it is flowing. DDR multiplies bandwidth and does almost nothing for latency. That is why a DDR4 stick and a DDR3 stick have roughly the same absolute access time in nanoseconds.</p>
<p class="pitfall">⚠️ Do not read "SDRAM and DDR-DRAM dominate" as two competing products on a shelf. The stick in your laptop is a DDR4 or DDR5 <em>SDRAM</em> module — synchronous <em>and</em> double data rate.</p>`,
        `<p class="y-chinh">🎯 Bản lề của cả chương. Mọi thứ tới đây là về <em>Ô NHỚ</em> DRAM; từ đây trở đi chủ đề là <strong>GIAO TIẾP</strong> của DRAM — vì, đúng lời slide, "một trong những nút thắt hệ thống nghiêm trọng nhất khi dùng bộ xử lý hiệu năng cao chính là giao tiếp tới bộ nhớ trong".</p>
<ul>
<li><strong>Vấn đề, nêu đúng như slide.</strong> "Con chip DRAM truyền thống bị bó buộc bởi CẢ <em>kiến trúc bên trong</em> LẪN <em>giao tiếp với bus bộ nhớ của bộ xử lý</em>." Hai khuyết tật tách biệt: bản thân mảng ô nhớ chậm (phải cảm nhận rồi nạp lại điện tích), và trên nữa, cuộc đối thoại với CPU lại kém hiệu quả.</li>
<li><strong>Vì sao nửa "giao tiếp" mới đáng đánh.</strong> Mảng ô nhớ gần như không nhanh lên trong hai mươi năm — con số 100–266 MHz bạn sẽ thấy ở slide 30 gần như bất biến suốt từ DDR1 tới DDR4. Mọi bước tăng tốc kể từ SDRAM đều đến từ việc <em>ĐƯA DỮ LIỆU RA NGOÀI NHANH HƠN</em>, không phải từ việc bắt tụ điện trả lời nhanh hơn.</li>
<li><strong>Ba cái tên, một rưỡi kẻ sống sót.</strong> Slide liệt kê <strong>SDRAM</strong>, <strong>DDR-DRAM</strong> và <strong>RDRAM</strong>, rồi nói thẳng ai thắng: "các sơ đồ hiện đang thống trị thị trường là SDRAM và DDR-DRAM". RDRAM (Rambus) đã thành lịch sử — hay về kỹ thuật, chết về thương mại vì phí bản quyền và độ trễ. Chú ý: DDR không phải đối thủ của SDRAM mà là <em>PHÁT TRIỂN</em> của SDRAM — mọi chip DDR đều là chip SDRAM.</li>
<li><strong>"Một số cải tiến đã được thăm dò."</strong> Danh sách đầy đủ trong sách còn có fast page mode, EDO, burst EDO và cache DRAM; deck này tua nhanh tới hai cái quan trọng. Đề có nhắc EDO hay FPM thì đó là những nỗ lực SỚM HƠN, kiểu bất đồng bộ, cho cùng mục tiêu.</li>
<li><strong>Nó nằm ở đâu trong môn.</strong> Ch.4 nói phân cấp bộ nhớ tồn tại vì DRAM chậm so với CPU. Ch.5 dựng cache để che chuyện đó. Slide này thú nhận che thế chưa đủ: khi thật sự trượt cache, DRAM vẫn phải giao NGUYÊN MỘT KHỐI thật nhanh, mà đó là bài toán <em>BĂNG THÔNG</em> chứ không phải độ trễ. Chế độ burst và DDR là câu trả lời cho băng thông.</li>
</ul>
<p class="meo">💡 Giữ hai chữ tách bạch: <strong>độ trễ (latency)</strong> = bao lâu thì byte ĐẦU TIÊN tới; <strong>băng thông (bandwidth)</strong> = mỗi giây chảy được bao nhiêu byte khi đã chảy. DDR nhân băng thông lên và gần như không làm gì cho độ trễ. Vì thế một thanh DDR4 và một thanh DDR3 có thời gian truy cập tuyệt đối tính bằng nano giây xấp xỉ nhau.</p>
<p class="pitfall">⚠️ Đừng đọc câu "SDRAM và DDR-DRAM thống trị" thành hai sản phẩm cạnh tranh trên kệ. Thanh RAM trong laptop bạn là một mô-đun DDR4 hoặc DDR5 <em>SDRAM</em> — vừa đồng bộ, vừa tốc độ dữ liệu kép.</p>`],

      [24, 'Synchronous DRAM (SDRAM) — the clock changes the conversation',
        `<p class="y-chinh">🎯 SDRAM is "one of the most widely used forms of DRAM", and its whole innovation is one word: <strong>a clock</strong>. It "exchanges data with the processor synchronized to an external clock signal and running at the full speed of the processor/memory bus <strong>without imposing wait states</strong>".</p>
<ul>
<li><strong>What the old asynchronous DRAM did.</strong> The processor put an address on the bus, asserted RAS then CAS, and then <em>waited</em>, holding the bus, until the chip happened to answer. Those idle cycles are the <strong>wait states</strong> the slide is promising to remove. Nothing else could use that time.</li>
<li><strong>What the clock buys, in the slide's own three steps.</strong> (1) "The processor or other master issues the instruction and address information which is <strong>latched by the DRAM</strong>." (2) "The DRAM then responds after a <strong>set number of clock cycles</strong>." (3) "Meanwhile the master can safely do other tasks while the SDRAM is processing."</li>
<li><strong>Step 2 is the real prize: the delay becomes a KNOWN NUMBER.</strong> Asynchronous DRAM answered "when it is ready"; SDRAM answers "in exactly <em>n</em> cycles". A number you know in advance can be scheduled around — the memory controller can issue other commands into the gap. That number is the <strong>CAS latency</strong> you will meet on slide 27, and it is the "CL16" printed on the RAM stick you buy.</li>
<li><strong>Step 3 is why it helps performance at all.</strong> A predictable delay turns dead waiting into pipelining. With multiple internal banks (slide 25 shows the bank address lines BA0/BA1) the controller can have a read in flight in bank 0 while activating a row in bank 1.</li>
<li><strong>The mode register, and why SDRAM needs one.</strong> Because the reply now comes after an agreed number of cycles, both sides must agree on that number beforehand. SDRAM therefore has a small <strong>mode register</strong> (visible as a box in Figure 6.12) programmed at boot with burst length, burst type and CAS latency. That is what your BIOS is doing when it "trains" memory.</li>
</ul>
<p class="meo">💡 Analogy: asynchronous DRAM is knocking on a door and standing there until someone opens. SDRAM is a numbered ticket at the bank — "you will be called in 2 turns" — so you can sit down and do something else. The queue is not faster; your time is no longer wasted.</p>
<p class="pitfall">⚠️ "Synchronous" does <strong>not</strong> mean "no delay". SDRAM still makes you wait CAS-latency cycles; it just tells you exactly how many. Also note the extracted .pptx text for this slide contains only the title — the three content blocks were read from the rendered image.</p>`,
        `<p class="y-chinh">🎯 SDRAM là "một trong những dạng DRAM được dùng rộng rãi nhất", và toàn bộ cải tiến của nó gói trong một chữ: <strong>XUNG NHỊP</strong>. Nó "trao đổi dữ liệu với bộ xử lý ĐỒNG BỘ theo một tín hiệu xung nhịp bên ngoài và chạy ở đúng tốc độ của bus bộ xử lý/bộ nhớ mà <strong>KHÔNG áp đặt chu kỳ chờ</strong>".</p>
<ul>
<li><strong>DRAM bất đồng bộ đời cũ làm gì.</strong> CPU đặt địa chỉ lên bus, kéo RAS rồi CAS, rồi <em>ĐỨNG CHỜ</em>, giữ nguyên cái bus, cho tới khi con chip tình cờ trả lời. Những chu kỳ trống đó chính là <strong>chu kỳ chờ (wait state)</strong> mà slide hứa xoá đi. Trong lúc ấy không ai khác dùng bus được.</li>
<li><strong>Xung nhịp mua được gì, theo đúng ba bước trên slide.</strong> (1) "Bộ xử lý hoặc chủ bus khác phát ra lệnh và thông tin địa chỉ, những thứ này được <strong>DRAM CHỐT LẠI</strong>." (2) "DRAM sau đó trả lời sau <strong>MỘT SỐ CHU KỲ XUNG NHỊP ĐÃ ĐỊNH</strong>." (3) "Trong lúc chờ, chủ bus có thể yên tâm làm việc khác trong khi SDRAM đang xử lý."</li>
<li><strong>Bước 2 mới là phần thưởng thật: độ trễ trở thành MỘT CON SỐ BIẾT TRƯỚC.</strong> DRAM bất đồng bộ trả lời "khi nào xong thì xong"; SDRAM trả lời "đúng <em>n</em> chu kỳ nữa". Một con số biết trước thì lập lịch được — bộ điều khiển bộ nhớ có thể nhét lệnh khác vào khe trống đó. Con số ấy là <strong>CAS latency</strong> bạn sẽ gặp ở slide 27, và nó chính là chữ "CL16" in trên thanh RAM bạn mua.</li>
<li><strong>Bước 3 là lý do nó thật sự tăng hiệu năng.</strong> Một độ trễ đoán trước được biến việc đứng chờ chết thành dây chuyền. Với nhiều ngân hàng (bank) bên trong — slide 25 cho thấy các chân địa chỉ bank BA0/BA1 — bộ điều khiển có thể đang đọc dở ở bank 0 trong khi mở hàng ở bank 1.</li>
<li><strong>Thanh ghi chế độ (mode register), và vì sao SDRAM cần nó.</strong> Vì câu trả lời giờ đến sau một số chu kỳ ĐÃ THOẢ THUẬN, hai bên phải thống nhất con số đó từ trước. Nên SDRAM có một <strong>mode register</strong> nhỏ (thấy được thành một ô trong Figure 6.12), nạp lúc khởi động với độ dài burst, kiểu burst và CAS latency. Đó là việc BIOS đang làm khi nó "train" bộ nhớ.</li>
</ul>
<p class="meo">💡 Ví von: DRAM bất đồng bộ là gõ cửa rồi đứng đó tới lúc có người mở. SDRAM là lấy số thứ tự ở ngân hàng — "2 lượt nữa tới bạn" — nên bạn ngồi xuống làm việc khác được. Hàng không nhanh hơn; chỉ là thời gian của bạn không còn bị phí.</p>
<p class="pitfall">⚠️ "Đồng bộ" <strong>KHÔNG</strong> có nghĩa "không có độ trễ". SDRAM vẫn bắt bạn chờ đủ số chu kỳ CAS latency; nó chỉ nói cho bạn biết CHÍNH XÁC là mấy chu kỳ. Ghi chú thêm: bản trích chữ .pptx của slide này chỉ có mỗi TIÊU ĐỀ — ba khối nội dung trên được đọc thẳng từ ảnh render.</p>`],

      [25, 'Figure 6.12 — 256-Mb Synchronous Dynamic RAM (SDRAM) block diagram',
        `<p class="y-chinh">🎯 The whole SDRAM chip as a block diagram. Do not try to memorise every box; instead trace the <strong>three paths</strong> through it — the command path along the top left, the address path down the left, and the data path along the right — and notice which boxes exist <em>only</em> because the chip is synchronous.</p>
<table>
<tr><th>Block</th><th>Job</th><th>Why it is there</th></tr>
<tr><td><strong>Command decoder &amp; clock generator</strong></td><td>Takes CLK, CKE, CS, RAS, CAS, WE and turns that combination into one command (READ, WRITE, ACTIVATE, PRECHARGE, NOP…)</td><td>The heart of "synchronous": commands are <em>decoded on a clock edge</em>, not levels sensed whenever</td></tr>
<tr><td><strong>Mode register</strong></td><td>Holds burst length, burst type, CAS latency</td><td>The agreed contract of slide 24 — written once at boot</td></tr>
<tr><td><strong>Row address latch / buffer, Column address latch</strong>, multiplexer</td><td>Capture the 13 address lines A0–A12 in two halves</td><td>Address pins are <em>multiplexed</em> (row then column) to keep the pin count down — Figure 6.4 of this chapter</td></tr>
<tr><td><strong>Burst counter</strong></td><td>Generates the 2nd, 3rd, 4th column addresses automatically</td><td>So one READ command fetches a whole burst — spatial locality, in silicon</td></tr>
<tr><td><strong>Refresh controller / self-refresh controller / refresh counter</strong></td><td>Walks the rows and rewrites them</td><td>Because DRAM cells leak (slide 4). Self-refresh lets the chip refresh itself while the system sleeps</td></tr>
<tr><td><strong>Memory cell array (4 Mb × 16), 4 banks</strong>, sense amps</td><td>The actual storage: four independent banks selected by BA0/BA1</td><td>Banks are what let one access overlap another</td></tr>
<tr><td><strong>Data in buffer / Data out buffer</strong>, DQ0–DQ15, DQM</td><td>16-bit wide data port, with a mask signal</td><td>The width that makes this a "×16" chip</td></tr>
</table>
<p class="nhan">📐 Read the capacity off the diagram, do not take it on faith. Four banks × (4 Mb × 16) is written on the array boxes:</p>
<pre>4 banks x 4 Mb x 16 bits? No - read it as the book does:
the array is "4 Mb x 16" per bank = 4 194 304 addresses x 16 bits
4 194 304 x 16 = 67 108 864 bits = 64 Mb per bank
64 Mb x 4 banks = 256 Mb   <-- the title of the figure
Organised as 16 M addresses x 16 bits = 16M x 16 device
Row address = 13 bits (A0-A12) -> 8192 rows   (the "8192" arrows)
Column address = 9 bits -> 512 columns        (the "512 (x16)" label)
8192 x 512 x 16 bits x 4 banks = 268 435 456 bits = 256 Mb  OK</pre>
<p class="dap-an">✅ The numbers on the figure are consistent: 8192 rows × 512 columns × 16 bits = 64 Mb per bank, × 4 banks = <strong>256 Mb</strong>, matching the title. This is the same "chip logic" arithmetic as Figure 6.3 earlier in the chapter, one generation bigger.</p>
<p class="meo">💡 One sentence for the exam: <em>a row activate loads 512 × 16 bits into the sense amps at once; a column read then picks 16 bits out of that already-open row.</em> That is why reading two addresses in the same row is far cheaper than two addresses in different rows — and why the memory controller reorders requests to keep rows open.</p>
<p class="pitfall">⚠️ Note the overbars: CS, RAS, CAS and WE are <strong>active-low</strong> signals (the slide draws a bar over each name). "RAS asserted" means the line is driven to 0, not 1. Losing the bar is a classic marking loss in digital-logic questions (CEA201 Ch.12 uses the same convention).</p>`,
        `<p class="y-chinh">🎯 Cả con chip SDRAM dưới dạng sơ đồ khối. Đừng cố thuộc từng ô; thay vào đó hãy lần theo <strong>BA ĐƯỜNG</strong> xuyên qua nó — đường LỆNH ở góc trên trái, đường ĐỊA CHỈ dọc mép trái, và đường DỮ LIỆU dọc mép phải — rồi để ý ô nào chỉ tồn tại <em>VÌ</em> con chip này đồng bộ.</p>
<table>
<tr><th>Khối</th><th>Việc của nó</th><th>Vì sao có nó</th></tr>
<tr><td><strong>Command decoder &amp; clock generator</strong></td><td>Nhận CLK, CKE, CS, RAS, CAS, WE rồi biến tổ hợp đó thành một lệnh (READ, WRITE, ACTIVATE, PRECHARGE, NOP…)</td><td>Trái tim của chữ "đồng bộ": lệnh được <em>giải mã trên một sườn xung</em>, không phải dò mức tín hiệu lúc nào cũng được</td></tr>
<tr><td><strong>Mode register</strong></td><td>Giữ độ dài burst, kiểu burst, CAS latency</td><td>Chính là bản hợp đồng đã thoả thuận ở slide 24 — ghi một lần lúc khởi động</td></tr>
<tr><td><strong>Row address latch/buffer, Column address latch</strong>, multiplexer</td><td>Chốt 13 đường địa chỉ A0–A12 thành hai nửa</td><td>Chân địa chỉ dùng <em>GHÉP KÊNH</em> (hàng trước, cột sau) để giữ số chân thấp — Figure 6.4 của chương này</td></tr>
<tr><td><strong>Burst counter</strong></td><td>Tự sinh địa chỉ cột thứ 2, 3, 4</td><td>Để MỘT lệnh READ lấy về cả một burst — cục bộ không gian, hoá thành silic</td></tr>
<tr><td><strong>Refresh controller / self-refresh controller / refresh counter</strong></td><td>Duyệt từng hàng và ghi lại nội dung</td><td>Vì ô DRAM rò điện (slide 4). Self-refresh cho phép chip tự làm tươi khi cả máy ngủ</td></tr>
<tr><td><strong>Memory cell array (4 Mb × 16), 4 bank</strong>, sense amps</td><td>Chỗ chứa thật: bốn bank độc lập, chọn bằng BA0/BA1</td><td>Bank chính là thứ cho phép một lần truy cập chồng lên lần khác</td></tr>
<tr><td><strong>Data in buffer / Data out buffer</strong>, DQ0–DQ15, DQM</td><td>Cổng dữ liệu rộng 16 bit, kèm tín hiệu che (mask)</td><td>Chính độ rộng này làm nó thành chip "×16"</td></tr>
</table>
<p class="nhan">📐 Hãy ĐỌC dung lượng ra từ sơ đồ, đừng tin suông. Con số ghi trên các ô mảng nhớ:</p>
<pre>mảng mỗi bank = "4 Mb x 16" = 4 194 304 địa chỉ x 16 bit
4 194 304 x 16 = 67 108 864 bit = 64 Mb mỗi bank
64 Mb x 4 bank = 256 Mb   <-- đúng tiêu đề hình
Tổ chức thành 16 M địa chỉ x 16 bit = thiết bị 16M x 16
Địa chỉ hàng = 13 bit (A0-A12) -> 8192 hàng   (các mũi tên ghi "8192")
Địa chỉ cột  = 9 bit -> 512 cột               (nhãn "512 (x16)")
8192 x 512 x 16 bit x 4 bank = 268 435 456 bit = 256 Mb  ĐÚNG</pre>
<p class="dap-an">✅ Các con số trên hình nhất quán với nhau: 8192 hàng × 512 cột × 16 bit = 64 Mb mỗi bank, × 4 bank = <strong>256 Mb</strong>, khớp tiêu đề. Đây đúng là phép tính "chip logic" của Figure 6.3 hồi đầu chương, chỉ lớn hơn một thế hệ.</p>
<p class="meo">💡 Một câu để đi thi: <em>một lệnh mở hàng nạp 512 × 16 bit vào các sense amp CÙNG LÚC; lệnh đọc cột sau đó chỉ nhặt 16 bit ra khỏi cái hàng đã mở sẵn ấy.</em> Vì thế đọc hai địa chỉ CÙNG MỘT HÀNG rẻ hơn hẳn hai địa chỉ khác hàng — và vì thế bộ điều khiển bộ nhớ sắp xếp lại thứ tự yêu cầu để giữ hàng đang mở.</p>
<p class="pitfall">⚠️ Để ý các gạch ngang trên đầu: CS, RAS, CAS và WE là tín hiệu <strong>TÍCH CỰC MỨC THẤP</strong> (slide vẽ một gạch trên mỗi tên). "RAS được kích" nghĩa là đường đó bị kéo xuống 0, không phải lên 1. Mất cái gạch đó là mất điểm kinh điển ở phần logic số (Ch.12 của chính CEA201 dùng cùng quy ước).</p>`],

      [26, 'Table 6.3 — SDRAM Pin Assignments',
        `<p class="y-chinh">🎯 Ten pin groups, and every one of them is a sentence about how the chip is spoken to. Learn the table by <strong>grouping the pins into four jobs</strong> rather than memorising ten rows in order.</p>
<table>
<tr><th>Pin</th><th>Table 6.3 says</th><th>Job group</th><th>What it really controls</th></tr>
<tr><td><strong>A0 to A13</strong></td><td>Address inputs</td><td>Address</td><td>Multiplexed: carries the row address first, then the column address</td></tr>
<tr><td><strong>BA0, BA1</strong></td><td>Bank address lines</td><td>Address</td><td>2 bits ⇒ selects one of <strong>4</strong> internal banks</td></tr>
<tr><td><strong>CLK</strong></td><td>Clock input</td><td>Timing</td><td>The single line that makes this SDRAM instead of DRAM</td></tr>
<tr><td><strong>CKE</strong></td><td>Clock enable</td><td>Timing</td><td>Drop it and the chip freezes — the basis of power-down and self-refresh</td></tr>
<tr><td><strong>CS</strong></td><td>Chip select</td><td>Command</td><td>"This command is for you". Lets many chips share one bus — Figures 6.5/6.6</td></tr>
<tr><td><strong>RAS</strong></td><td>Row address strobe</td><td>Command</td><td>Latch the address lines as a <em>row</em>, open that row into the sense amps</td></tr>
<tr><td><strong>CAS</strong></td><td>Column address strobe</td><td>Command</td><td>Latch the address lines as a <em>column</em>, pick data out of the open row</td></tr>
<tr><td><strong>WE</strong></td><td>Write enable</td><td>Command</td><td>Read or write — the direction bit</td></tr>
<tr><td><strong>DQ0 to DQ7</strong></td><td>Data input/output</td><td>Data</td><td>Bidirectional, so the same pins carry both directions (saves pins)</td></tr>
<tr><td><strong>DQM</strong></td><td>Data mask</td><td>Data</td><td>Suppresses selected bytes — how you write 1 byte into a 8-byte-wide burst</td></tr>
</table>
<ul>
<li><strong>The four command pins are one 4-bit opcode.</strong> CS, RAS, CAS and WE are not four independent switches — the command decoder reads their combination <em>on a clock edge</em> as a single instruction. CS=0, RAS=1, CAS=0, WE=1 is a READ; RAS=0, CAS=1, WE=1 is an ACTIVATE (open a row); all high is a NOP (which is what all those NOP boxes are on slide 27).</li>
<li><strong>Why A0–A13 but the diagram on slide 25 showed A0–A12.</strong> Table 6.3 describes a slightly larger part than Figure 6.12 draws. Address width follows capacity: <em>n</em> row-address lines give 2<sup>n</sup> rows. Don't treat either number as universal.</li>
<li><strong>Multiplexing is the whole reason RAS and CAS exist.</strong> A 16M×16 chip needs 24 address bits; sending them all at once would cost 24 pins. Sending 13 twice costs 13 pins plus two strobes — and the price is that every access takes two steps. That trade-off is the origin of "row hit" versus "row miss" timing.</li>
<li><strong>DQM is more useful than it looks.</strong> A processor writing a single byte into memory that is physically 8 bytes wide would otherwise need a read-modify-write. DQM lets the controller simply mask the bytes it does not want touched.</li>
<li><strong>DQ0–DQ7 here means an ×8 chip.</strong> Slide 25's part had DQ0–DQ15 (×16). Real DIMMs gang eight ×8 chips to make a 64-bit module — that 64-bit width is exactly the "8 bytes" that turns MT/s into GB/s on slide 29.</li>
</ul>
<p class="meo">💡 Mnemonic for the strobes: <strong>R</strong>AS comes before <strong>C</strong>AS the way <strong>R</strong>ow comes before <strong>C</strong>olumn, alphabetically and in time. Every DRAM access is "open a row, then pick a column".</p>
<p class="pitfall">⚠️ All four command pins are <strong>active-low</strong> (the slide draws bars over CS, RAS, CAS, WE). And CKE is not a clock — it is the <em>permission</em> for the clock. Confusing CLK with CKE is a common slip.</p>`,
        `<p class="y-chinh">🎯 Mười nhóm chân, mà mỗi nhóm là một câu về cách người ta nói chuyện với con chip. Hãy học bảng này bằng cách <strong>GOM CHÂN THEO BỐN VIỆC</strong> thay vì thuộc lòng mười dòng theo thứ tự.</p>
<table>
<tr><th>Chân</th><th>Table 6.3 ghi</th><th>Nhóm việc</th><th>Thật sự điều khiển gì</th></tr>
<tr><td><strong>A0 tới A13</strong></td><td>Address inputs — đầu vào địa chỉ</td><td>Địa chỉ</td><td>Ghép kênh: mang địa chỉ HÀNG trước, rồi địa chỉ CỘT</td></tr>
<tr><td><strong>BA0, BA1</strong></td><td>Bank address lines — đường địa chỉ bank</td><td>Địa chỉ</td><td>2 bit ⇒ chọn 1 trong <strong>4</strong> bank bên trong</td></tr>
<tr><td><strong>CLK</strong></td><td>Clock input — đầu vào xung nhịp</td><td>Thời gian</td><td>Đúng một đường này làm nó thành SDRAM chứ không phải DRAM</td></tr>
<tr><td><strong>CKE</strong></td><td>Clock enable — cho phép xung nhịp</td><td>Thời gian</td><td>Ngắt nó là chip đóng băng — nền tảng của chế độ ngủ và self-refresh</td></tr>
<tr><td><strong>CS</strong></td><td>Chip select — chọn chip</td><td>Lệnh</td><td>"Lệnh này dành cho MÀY". Cho nhiều chip dùng chung một bus — Figure 6.5/6.6</td></tr>
<tr><td><strong>RAS</strong></td><td>Row address strobe</td><td>Lệnh</td><td>Chốt các đường địa chỉ như một <em>HÀNG</em>, mở hàng đó vào sense amp</td></tr>
<tr><td><strong>CAS</strong></td><td>Column address strobe</td><td>Lệnh</td><td>Chốt các đường địa chỉ như một <em>CỘT</em>, nhặt dữ liệu ra khỏi hàng đang mở</td></tr>
<tr><td><strong>WE</strong></td><td>Write enable — cho phép ghi</td><td>Lệnh</td><td>Đọc hay ghi — bit chỉ chiều</td></tr>
<tr><td><strong>DQ0 tới DQ7</strong></td><td>Data input/output</td><td>Dữ liệu</td><td>Hai chiều, nên cùng bộ chân mang cả hai chiều (tiết kiệm chân)</td></tr>
<tr><td><strong>DQM</strong></td><td>Data mask — che dữ liệu</td><td>Dữ liệu</td><td>Chặn một số byte — cách ghi 1 byte vào một burst rộng 8 byte</td></tr>
</table>
<ul>
<li><strong>Bốn chân lệnh là MỘT mã lệnh 4 bit.</strong> CS, RAS, CAS và WE không phải bốn công tắc độc lập — bộ giải mã lệnh đọc TỔ HỢP của chúng <em>trên một sườn xung</em> như một lệnh duy nhất. CS=0, RAS=1, CAS=0, WE=1 là READ; RAS=0, CAS=1, WE=1 là ACTIVATE (mở hàng); tất cả ở mức cao là NOP (chính là mấy ô NOP trên slide 27).</li>
<li><strong>Vì sao ở đây là A0–A13 mà sơ đồ slide 25 lại A0–A12.</strong> Table 6.3 mô tả một linh kiện lớn hơn chút so với cái Figure 6.12 vẽ. Độ rộng địa chỉ đi theo dung lượng: <em>n</em> đường địa chỉ hàng cho 2<sup>n</sup> hàng. Đừng coi con số nào trong hai con số đó là phổ quát.</li>
<li><strong>Ghép kênh chính là toàn bộ lý do RAS và CAS tồn tại.</strong> Một chip 16M×16 cần 24 bit địa chỉ; gửi hết một lượt tốn 24 chân. Gửi 13 bit hai lượt tốn 13 chân cộng hai tín hiệu chốt — và cái giá là mọi lần truy cập phải qua HAI bước. Chính đánh đổi đó sinh ra khái niệm "trúng hàng" so với "trượt hàng".</li>
<li><strong>DQM hữu ích hơn vẻ ngoài của nó.</strong> Một CPU muốn ghi đúng MỘT byte vào bộ nhớ vật lý rộng 8 byte thì lẽ ra phải đọc-sửa-ghi. DQM cho bộ điều khiển che thẳng những byte không muốn đụng tới.</li>
<li><strong>DQ0–DQ7 ở đây nghĩa là chip ×8.</strong> Linh kiện ở slide 25 có DQ0–DQ15 (×16). DIMM thật ghép tám chip ×8 thành một mô-đun 64 bit — và chính độ rộng 64 bit ấy là "8 byte" biến MT/s thành GB/s ở slide 29.</li>
</ul>
<p class="meo">💡 Mẹo nhớ hai tín hiệu chốt: <strong>R</strong>AS đi trước <strong>C</strong>AS y như <strong>R</strong>ow (hàng) đi trước <strong>C</strong>olumn (cột), đúng thứ tự bảng chữ cái và đúng thứ tự thời gian. Mọi lần truy cập DRAM đều là "mở một hàng, rồi nhặt một cột".</p>
<p class="pitfall">⚠️ Cả bốn chân lệnh đều <strong>TÍCH CỰC MỨC THẤP</strong> (slide vẽ gạch trên CS, RAS, CAS, WE). Và CKE KHÔNG phải xung nhịp — nó là <em>GIẤY PHÉP</em> cho xung nhịp. Lẫn CLK với CKE là lỗi hay gặp.</p>`],

      [27, 'Figure 6.13 — SDRAM Read Timing (burst length = 4, CAS latency = 2)',
        `<p class="y-chinh">🎯 One read, drawn against the clock, and it explains the two numbers printed on every RAM stick you will ever buy. <strong>One</strong> READ command on the COMMAND line produces <strong>four</strong> words on the DQ lines — and between them sits the latency.</p>
<ul>
<li><strong>Read the three rows as three wires.</strong> <code>CLK</code> is the square wave, with tick marks T0…T8. <code>COMMAND</code> is what the controller puts on the command pins each cycle. <code>DQs</code> is the shared data bus. That is the whole diagram.</li>
<li><strong>The single most important thing on it: eight NOPs.</strong> After READ A at T0, every later command slot says <strong>NOP</strong> — no operation. The controller issues <em>nothing more</em>, and four words still come out. This is <strong>burst mode</strong>: the burst counter inside the chip (slide 25) generates the next three column addresses by itself.</li>
<li><strong>CAS latency = 2 means "two clock cycles between the READ command and the first data word".</strong> It is measured in <em>cycles</em>, not nanoseconds — which is why "CL16" on a fast DDR4 stick can still be quicker in real time than "CL9" on a slow DDR3 stick. Always convert: time = CL ÷ (I/O clock frequency).</li>
<li><strong>Burst length = 4 means the data is then continuous.</strong> Once the first word appears, the remaining three follow on consecutive cycles with no gaps: DOUT A0, A1, A2, A3. The command bus is free the whole time — the controller can already be activating a row in another bank.</li>
</ul>
<p class="nhan">📐 Worked cost comparison. With CAS latency <em>L</em> and burst length <em>B</em>, one burst read occupies <strong>L + B</strong> cycles of the data bus but only <strong>1</strong> cycle of the command bus. Take the figure's L = 2, B = 4:</p>
<table>
<tr><th>Way of reading 4 words</th><th>Cycles</th><th>Commands issued</th></tr>
<tr><td>Burst (this figure)</td><td>2 + 4 = <strong>6</strong></td><td>1</td></tr>
<tr><td>Four separate reads, each paying its own latency (2 latency + 1 data)</td><td>4 × 3 = <strong>12</strong></td><td>4</td></tr>
</table>
<p class="dap-an">✅ Bursting is <strong>2× faster here (12 → 6 cycles, a 50% saving)</strong>, and the advantage grows with burst length: at B = 8 it is 2 + 8 = 10 versus 24, i.e. 2,4×. This is the hardware cashing in the <em>spatial locality</em> of Chapter 4 — and it is precisely why a cache line is fetched as a burst, not word by word.</p>
<p class="pitfall">⚠️ Honest note about this particular rendering: the caption says CAS latency = 2, but on the slide as drawn the first data word <strong>DOUT A0 sits on the T3 tick</strong>, three ticks after READ A at T0. Go with the caption's definition (that is what is examined); the drawn offset is an artefact of the redrawn figure, not a different rule. This is a good habit generally: read the caption and the mechanism, don't count pixels.</p>
<p class="meo">💡 Translate the numbers on a real stick: "DDR4-3200 CL16" = 3200 MT/s transfer rate, 1600 MHz I/O clock, so CL16 = 16 ÷ 1600 MHz = <strong>10 ns</strong> before the first byte. Compare "DDR3-1600 CL9" = 9 ÷ 800 MHz = <strong>11,25 ns</strong>. The bigger CL number is the faster stick — because the cycles are shorter.</p>`,
        `<p class="y-chinh">🎯 Một lần đọc, vẽ theo xung nhịp, và nó giải thích đúng hai con số in trên mọi thanh RAM bạn sẽ mua. <strong>MỘT</strong> lệnh READ trên đường COMMAND sinh ra <strong>BỐN</strong> từ dữ liệu trên đường DQ — và giữa chúng là độ trễ.</p>
<ul>
<li><strong>Đọc ba hàng như ba sợi dây.</strong> <code>CLK</code> là sóng vuông, có vạch T0…T8. <code>COMMAND</code> là thứ bộ điều khiển đặt lên các chân lệnh mỗi chu kỳ. <code>DQs</code> là bus dữ liệu dùng chung. Cả hình chỉ có thế.</li>
<li><strong>Điều quan trọng nhất trên hình: TÁM chữ NOP.</strong> Sau READ A ở T0, mọi ô lệnh về sau đều ghi <strong>NOP</strong> — không làm gì. Bộ điều khiển <em>KHÔNG phát thêm lệnh nào</em>, thế mà bốn từ vẫn chảy ra. Đó là <strong>chế độ burst</strong>: bộ đếm burst bên trong chip (slide 25) tự sinh ba địa chỉ cột tiếp theo.</li>
<li><strong>CAS latency = 2 nghĩa là "HAI chu kỳ xung nhịp giữa lệnh READ và từ dữ liệu ĐẦU TIÊN".</strong> Nó đo bằng <em>CHU KỲ</em>, không phải nano giây — vì thế "CL16" trên một thanh DDR4 nhanh vẫn có thể nhanh hơn theo thời gian thật so với "CL9" trên một thanh DDR3 chậm. Luôn quy đổi: thời gian = CL ÷ (tần số xung I/O).</li>
<li><strong>Burst length = 4 nghĩa là sau đó dữ liệu chảy LIÊN TỤC.</strong> Từ đầu tiên ra rồi thì ba từ còn lại nối ngay ở các chu kỳ kế tiếp, không hở: DOUT A0, A1, A2, A3. Bus lệnh rảnh suốt thời gian đó — bộ điều khiển đã có thể đang mở hàng ở một bank khác.</li>
</ul>
<p class="nhan">📐 Tính thử cái giá. Với CAS latency <em>L</em> và độ dài burst <em>B</em>, một lần đọc burst chiếm <strong>L + B</strong> chu kỳ của bus DỮ LIỆU nhưng chỉ <strong>1</strong> chu kỳ của bus LỆNH. Lấy L = 2, B = 4 như hình:</p>
<table>
<tr><th>Cách đọc 4 từ</th><th>Số chu kỳ</th><th>Số lệnh phải phát</th></tr>
<tr><td>Burst (đúng hình này)</td><td>2 + 4 = <strong>6</strong></td><td>1</td></tr>
<tr><td>Bốn lần đọc rời, mỗi lần tự trả độ trễ (2 trễ + 1 dữ liệu)</td><td>4 × 3 = <strong>12</strong></td><td>4</td></tr>
</table>
<p class="dap-an">✅ Burst ở đây <strong>nhanh gấp 2 lần (12 → 6 chu kỳ, tiết kiệm 50%)</strong>, và lợi thế còn lớn hơn khi burst dài ra: với B = 8 thì 2 + 8 = 10 so với 24, tức 2,4 lần. Đây là phần cứng đi rút tiền từ <em>CỤC BỘ KHÔNG GIAN</em> của Chương 4 — và cũng chính xác là lý do một dòng cache được nạp về theo kiểu burst chứ không phải từng từ một.</p>
<p class="pitfall">⚠️ Một ghi chú thành thật về đúng bản vẽ này: chú thích ghi CAS latency = 2, nhưng trên slide như đang vẽ thì từ dữ liệu đầu tiên <strong>DOUT A0 nằm ngay vạch T3</strong>, tức ba vạch sau READ A ở T0. Hãy theo ĐỊNH NGHĨA trong chú thích (đó mới là thứ đề thi hỏi); độ lệch trên hình là chuyện vẽ lại, không phải một luật khác. Đây cũng là một thói quen tốt nói chung: đọc chú thích và cơ chế, đừng đi đếm điểm ảnh.</p>
<p class="meo">💡 Dịch mấy con số trên thanh RAM thật: "DDR4-3200 CL16" = tốc độ truyền 3200 MT/s, xung I/O 1600 MHz, nên CL16 = 16 ÷ 1600 MHz = <strong>10 ns</strong> trước khi có byte đầu. So với "DDR3-1600 CL9" = 9 ÷ 800 MHz = <strong>11,25 ns</strong>. Số CL LỚN HƠN lại là thanh NHANH HƠN — vì chu kỳ của nó ngắn hơn.</p>`],

      [28, 'Double Data Rate SDRAM (DDR SDRAM) — three ways to go faster',
        `<p class="y-chinh">🎯 The slide names the standards body — <strong>JEDEC</strong> (the Electronic Industries Alliance's semiconductor-engineering-standardization body) — and then gives the three mechanisms that make DDR faster, in order. Learn the three; they are the answer to "how does DDR achieve higher data rates?".</p>
<table>
<tr><th>#</th><th>The slide's wording</th><th>What it actually does</th><th>Speed-up it contributes</th></tr>
<tr><td><strong>1</strong></td><td>"The data transfer is synchronized to <strong>both the rising and falling edge</strong> of the clock, rather than just the rising edge"</td><td>Two transfers per clock period instead of one — this is literally the "double data rate" in the name</td><td>×2, once and for all</td></tr>
<tr><td><strong>2</strong></td><td>"DDR uses a <strong>higher clock rate</strong> on the bus to increase the transfer rate"</td><td>Faster I/O signalling: 100→200→400→800→1600 MHz across the generations</td><td>×16 from DDR1 to DDR4</td></tr>
<tr><td><strong>3</strong></td><td>"A <strong>buffering scheme</strong> is used"</td><td>The <em>prefetch buffer</em>: read many bits out of the slow array in parallel, then clock them out fast and serially</td><td>What makes #2 possible at all</td></tr>
</table>
<ul>
<li><strong>Mechanism 1, explained properly.</strong> A clock is a square wave: it goes up (rising edge) and comes down (falling edge) once per period. Ordinary SDRAM only acts on the rising edge, so half of every clock period is wasted. DDR transfers on <em>both</em> edges. Nothing inside the memory array got faster — the same wire now simply carries two payloads per tick.</li>
<li><strong>Mechanism 3 is why mechanism 2 does not break.</strong> A capacitor cell cannot be read at 1600 MHz. So the chip reads, say, 8 bits per data pin from the array at ~200 MHz in one go (that is the "8n prefetch" of slide 30) and shifts them out of a fast buffer. The array stays slow forever; the pipe out of it gets wider and faster.</li>
<li><strong>Consequence you must be able to state.</strong> DDR improves <strong>bandwidth</strong>, not <strong>latency</strong>. The time to get the <em>first</em> byte after a request is dominated by the array and has barely moved since 2000 — roughly 13–15 ns for the row activate plus CAS. What changed by 16× is how fast the following bytes arrive.</li>
<li><strong>Why "widely used in desktop computers and servers".</strong> The slide says so, and the reason is economics: JEDEC standardised it openly, so "numerous companies make DDR chips". RDRAM was proprietary and licensed — that is what killed it, not physics.</li>
</ul>
<p class="meo">💡 The mental picture for double data rate: a conveyor belt where a box is placed both when the bell rings <em>and</em> when it stops ringing. Same bell rate, twice the boxes. Now hold on to a second picture for the prefetch buffer: a slow well and a fast bucket chain — you cannot pull water faster, so you pull eight buckets at once and pour them out quickly.</p>
<p class="pitfall">⚠️ The most common exam error in this entire chapter: thinking "DDR4-3200" means the memory runs at 3200 MHz. It does not. 3200 is the <strong>transfer rate in MT/s</strong>; the I/O clock is 1600 MHz (half) and the internal array clock is 400 MHz (an eighth). Slide 30 draws all three numbers explicitly — the next slide turns them into bandwidth.</p>`,
        `<p class="y-chinh">🎯 Slide nêu tên tổ chức chuẩn hoá — <strong>JEDEC</strong> (cơ quan chuẩn hoá kỹ thuật bán dẫn của Electronic Industries Alliance) — rồi đưa ra BA cơ chế làm DDR nhanh hơn, theo đúng thứ tự. Học thuộc ba cái này; đó là đáp án cho câu "DDR đạt tốc độ dữ liệu cao hơn bằng cách nào?".</p>
<table>
<tr><th>#</th><th>Nguyên văn slide</th><th>Thật ra nó làm gì</th><th>Đóng góp tăng tốc</th></tr>
<tr><td><strong>1</strong></td><td>"Việc truyền dữ liệu được đồng bộ theo <strong>CẢ sườn LÊN và sườn XUỐNG</strong> của xung nhịp, thay vì chỉ sườn lên"</td><td>Hai lần truyền mỗi chu kỳ thay vì một — đây đúng nghĩa đen là chữ "double data rate" trong tên</td><td>×2, một lần cho mãi mãi</td></tr>
<tr><td><strong>2</strong></td><td>"DDR dùng <strong>tần số xung nhịp CAO HƠN</strong> trên bus để tăng tốc độ truyền"</td><td>Tín hiệu I/O nhanh hơn: 100→200→400→800→1600 MHz qua các thế hệ</td><td>×16 từ DDR1 tới DDR4</td></tr>
<tr><td><strong>3</strong></td><td>"Một <strong>sơ đồ ĐỆM</strong> được sử dụng"</td><td><em>Bộ đệm nạp trước (prefetch buffer)</em>: đọc thật nhiều bit ra khỏi mảng chậm cùng lúc, rồi đẩy chúng ra nối tiếp thật nhanh</td><td>Chính là thứ làm cho #2 khả thi</td></tr>
</table>
<ul>
<li><strong>Cơ chế 1, nói cho tử tế.</strong> Xung nhịp là một sóng vuông: mỗi chu kỳ nó đi lên (sườn lên) rồi đi xuống (sườn xuống) một lần. SDRAM thường chỉ hành động ở sườn lên, nên phí nửa chu kỳ. DDR truyền ở <em>CẢ HAI</em> sườn. Không một thứ gì trong mảng nhớ nhanh lên — chỉ là cùng sợi dây ấy giờ chở hai kiện hàng mỗi nhịp.</li>
<li><strong>Cơ chế 3 là lý do cơ chế 2 không vỡ.</strong> Một ô tụ điện không thể đọc ở 1600 MHz. Nên con chip đọc, ví dụ, 8 bit cho mỗi chân dữ liệu ra khỏi mảng ở ~200 MHz trong MỘT lượt (đó là "prefetch 8n" ở slide 30) rồi đẩy chúng ra từ một bộ đệm nhanh. Mảng nhớ chậm mãi mãi; chỉ có cái ống dẫn ra khỏi nó rộng hơn và nhanh hơn.</li>
<li><strong>Hệ quả bạn phải nói được thành câu.</strong> DDR cải thiện <strong>BĂNG THÔNG</strong>, không cải thiện <strong>ĐỘ TRỄ</strong>. Thời gian để có byte <em>ĐẦU TIÊN</em> sau một yêu cầu bị mảng nhớ chi phối và gần như không nhúc nhích từ năm 2000 — cỡ 13–15 ns cho mở hàng cộng CAS. Thứ đổi 16 lần là tốc độ các byte SAU đó ùa tới.</li>
<li><strong>Vì sao "được dùng rộng rãi trong máy để bàn và máy chủ".</strong> Slide nói vậy, và lý do là kinh tế: JEDEC chuẩn hoá công khai, nên "rất nhiều công ty sản xuất chip DDR". RDRAM thì độc quyền và thu phí bản quyền — đó mới là thứ giết nó, không phải vật lý.</li>
</ul>
<p class="meo">💡 Hình dung cho "tốc độ dữ liệu kép": một băng chuyền mà người ta đặt kiện hàng CẢ lúc chuông reo <em>LẪN</em> lúc chuông tắt. Cùng nhịp chuông, gấp đôi kiện hàng. Rồi giữ thêm hình dung thứ hai cho bộ đệm nạp trước: một cái giếng chậm và một dây chuyền xô nhanh — không kéo nước nhanh hơn được thì kéo tám xô một lượt rồi đổ ra thật nhanh.</p>
<p class="pitfall">⚠️ Lỗi thi phổ biến NHẤT của cả chương này: tưởng "DDR4-3200" nghĩa là bộ nhớ chạy ở 3200 MHz. KHÔNG. 3200 là <strong>TỐC ĐỘ TRUYỀN tính bằng MT/s</strong>; xung I/O là 1600 MHz (một nửa) và xung mảng nhớ bên trong là 400 MHz (một phần tám). Slide 30 vẽ rõ cả ba con số — còn slide kế tiếp biến chúng thành băng thông.</p>`],

      [29, 'Table 6.4 — DDR Characteristics (prefetch buffer, voltage, front side bus data rates)',
        `<p class="y-chinh">🎯 Four generations, three rows, and every number moves in the direction you would hope: the prefetch buffer grows, the voltage falls, the data rate climbs. Read the table <strong>down the columns</strong> and you have the entire history of PC memory in one glance.</p>
<table>
<tr><th>From the slide</th><th>DDR1</th><th>DDR2</th><th>DDR3</th><th>DDR4</th></tr>
<tr><td><strong>Prefetch buffer (bits)</strong></td><td>2</td><td>4</td><td>8</td><td>8</td></tr>
<tr><td><strong>Voltage level (V)</strong></td><td>2,5</td><td>1,8</td><td>1,5</td><td>1,2</td></tr>
<tr><td><strong>Front side bus data rates (Mbps)</strong></td><td>200—400</td><td>400—1066</td><td>800—2133</td><td>2133—4266</td></tr>
</table>
<p class="nhan">📐 Now the row the slide does not give you: <strong>bandwidth</strong>. A standard DIMM channel is <strong>64 bits = 8 bytes</strong> wide, so:</p>
<pre>băng thông (MB/s) = tần số I/O (MHz) x 2 (hai sườn) x 8 byte
                  = tốc độ truyền (MT/s) x 8 byte</pre>
<table>
<tr><th>Module</th><th>I/O clock</th><th>×2 edges ⇒ transfer rate</th><th>Bandwidth, 1 channel</th><th>Array clock (= rate ÷ prefetch)</th></tr>
<tr><td>PC133 SDRAM</td><td>133 MHz</td><td>133 MT/s (no doubling)</td><td>1,06 GB/s</td><td>133 MHz</td></tr>
<tr><td>DDR-400</td><td>200 MHz</td><td>400 MT/s</td><td><strong>3,2 GB/s</strong></td><td>200 MHz (2n)</td></tr>
<tr><td>DDR2-800</td><td>400 MHz</td><td>800 MT/s</td><td><strong>6,4 GB/s</strong></td><td>200 MHz (4n)</td></tr>
<tr><td>DDR3-1600</td><td>800 MHz</td><td>1600 MT/s</td><td><strong>12,8 GB/s</strong></td><td>200 MHz (8n)</td></tr>
<tr><td>DDR4-3200</td><td>1600 MHz</td><td>3200 MT/s</td><td><strong>25,6 GB/s</strong></td><td>400 MHz (8n)</td></tr>
<tr><td>DDR5-4800 <em>(not on the slide)</em></td><td>2400 MHz</td><td>4800 MT/s</td><td><strong>38,4 GB/s</strong></td><td>300 MHz (16n)</td></tr>
<tr><td>DDR5-6400 <em>(not on the slide)</em></td><td>3200 MHz</td><td>6400 MT/s</td><td><strong>51,2 GB/s</strong></td><td>400 MHz (16n)</td></tr>
</table>
<p class="dap-an">✅ Worked example, the one an exam asks: <em>"DDR4-3200, dual channel, what is the theoretical peak bandwidth?"</em> → 3200 MT/s × 8 bytes = 25 600 MB/s = <strong>25,6 GB/s per channel</strong>, × 2 channels = <strong>51,2 GB/s</strong>. All rows above computed and checked with python3. Note the beautiful fact in the last column: the actual capacitor array has sat at 200–400 MHz for twenty years. Everything else is prefetch and signalling.</p>
<ul>
<li><strong>Why the voltage row matters as much as the speed row.</strong> Dynamic power scales roughly with <em>V</em><sup>2</sup>. From DDR1's 2,5 V to DDR5's 1,1 V, the same switching costs <strong>19,4% of the power — an 80,6% cut</strong>. That is what let memory capacity and speed grow without laptops catching fire.</li>
<li><strong>Why DDR4 keeps DDR3's 8n prefetch.</strong> Widening the prefetch to 16n would force the burst to fetch 16 × 8 = 128 bytes at once, which is bigger than a 64-byte cache line — you would be dragging in data nobody asked for. DDR4 instead raised the I/O clock and added bank groups. DDR5 finally went to 16n, but paid for it by splitting each DIMM into <em>two independent 32-bit sub-channels</em>, so a burst still moves 64 bytes.</li>
<li><strong>"Front side bus" is dated terminology.</strong> The FSB disappeared from Intel designs around 2008 (Nehalem) when the memory controller moved onto the CPU die; AMD had done it in 2003. Read this row as "bus data rate" and you are fine — but do not go looking for an FSB in a modern block diagram.</li>
</ul>
<p class="pitfall">⚠️ <strong>The deck contradicts itself about DDR4.</strong> This table says 2133–4266 Mbps; Figure 6.14 on the very next slide draws DDR4 I/O at 667–1600 MHz, which doubles to 1333–3200 Mbps. Verified by calculation: the other three generations agree perfectly between table and figure (DDR1 200–400, DDR2 400–1066, DDR3 800–2133) — only DDR4 disagrees. Real JEDEC DDR4 speed bins run DDR4-1600 up to DDR4-3200, with 4266 existing only as overclocked XMP. Quote whichever the question quotes, and know that the figure is the more standard one.</p>
<p class="meo">💡 Sanity check you can do in your head: <strong>divide the DDR number by 125 to get GB/s</strong>. DDR4-3200 ÷ 125 = 25,6 GB/s. DDR5-6400 ÷ 125 = 51,2 GB/s. (It works because 8 bytes ÷ 1000 = 1/125.)</p>`,
        `<p class="y-chinh">🎯 Bốn thế hệ, ba hàng, và mọi con số đều đi theo hướng ta mong: bộ đệm nạp trước to lên, điện áp tụt xuống, tốc độ dữ liệu leo lên. Đọc bảng <strong>THEO CỘT</strong> là bạn có nguyên lịch sử bộ nhớ PC trong một cái liếc.</p>
<table>
<tr><th>Lấy từ slide</th><th>DDR1</th><th>DDR2</th><th>DDR3</th><th>DDR4</th></tr>
<tr><td><strong>Bộ đệm nạp trước (bit)</strong></td><td>2</td><td>4</td><td>8</td><td>8</td></tr>
<tr><td><strong>Mức điện áp (V)</strong></td><td>2,5</td><td>1,8</td><td>1,5</td><td>1,2</td></tr>
<tr><td><strong>Tốc độ dữ liệu bus (Mbps)</strong></td><td>200—400</td><td>400—1066</td><td>800—2133</td><td>2133—4266</td></tr>
</table>
<p class="nhan">📐 Giờ tới hàng mà slide KHÔNG cho bạn: <strong>BĂNG THÔNG</strong>. Một kênh DIMM chuẩn rộng <strong>64 bit = 8 byte</strong>, nên:</p>
<pre>băng thông (MB/s) = tần số I/O (MHz) x 2 (hai sườn) x 8 byte
                  = tốc độ truyền (MT/s) x 8 byte</pre>
<table>
<tr><th>Mô-đun</th><th>Xung I/O</th><th>×2 sườn ⇒ tốc độ truyền</th><th>Băng thông 1 kênh</th><th>Xung mảng nhớ (= tốc độ ÷ prefetch)</th></tr>
<tr><td>PC133 SDRAM</td><td>133 MHz</td><td>133 MT/s (không nhân đôi)</td><td>1,06 GB/s</td><td>133 MHz</td></tr>
<tr><td>DDR-400</td><td>200 MHz</td><td>400 MT/s</td><td><strong>3,2 GB/s</strong></td><td>200 MHz (2n)</td></tr>
<tr><td>DDR2-800</td><td>400 MHz</td><td>800 MT/s</td><td><strong>6,4 GB/s</strong></td><td>200 MHz (4n)</td></tr>
<tr><td>DDR3-1600</td><td>800 MHz</td><td>1600 MT/s</td><td><strong>12,8 GB/s</strong></td><td>200 MHz (8n)</td></tr>
<tr><td>DDR4-3200</td><td>1600 MHz</td><td>3200 MT/s</td><td><strong>25,6 GB/s</strong></td><td>400 MHz (8n)</td></tr>
<tr><td>DDR5-4800 <em>(KHÔNG có trên slide)</em></td><td>2400 MHz</td><td>4800 MT/s</td><td><strong>38,4 GB/s</strong></td><td>300 MHz (16n)</td></tr>
<tr><td>DDR5-6400 <em>(KHÔNG có trên slide)</em></td><td>3200 MHz</td><td>6400 MT/s</td><td><strong>51,2 GB/s</strong></td><td>400 MHz (16n)</td></tr>
</table>
<p class="dap-an">✅ Bài mẫu, đúng kiểu đề hay hỏi: <em>"DDR4-3200, chạy hai kênh, băng thông đỉnh lý thuyết là bao nhiêu?"</em> → 3200 MT/s × 8 byte = 25 600 MB/s = <strong>25,6 GB/s mỗi kênh</strong>, × 2 kênh = <strong>51,2 GB/s</strong>. Mọi hàng ở trên đã tính và kiểm bằng python3. Để ý sự thật đẹp ở cột cuối: mảng tụ điện THẬT nằm lì ở 200–400 MHz suốt hai mươi năm. Tất cả phần còn lại là nạp trước và truyền tín hiệu.</p>
<ul>
<li><strong>Vì sao hàng ĐIỆN ÁP quan trọng ngang hàng tốc độ.</strong> Công suất động tỉ lệ xấp xỉ <em>V</em><sup>2</sup>. Từ 2,5 V của DDR1 xuống 1,1 V của DDR5, cùng một thao tác chuyển mạch chỉ còn tốn <strong>19,4% công suất — giảm 80,6%</strong>. Đó là thứ cho phép dung lượng và tốc độ bộ nhớ lớn lên mà laptop không bốc cháy.</li>
<li><strong>Vì sao DDR4 GIỮ NGUYÊN prefetch 8n của DDR3.</strong> Nới prefetch lên 16n sẽ bắt burst lấy 16 × 8 = 128 byte một lượt, lớn hơn một dòng cache 64 byte — tức lôi về dữ liệu không ai cần. DDR4 chọn cách khác: nâng xung I/O và thêm bank group. DDR5 rốt cuộc mới lên 16n, nhưng phải trả giá bằng cách chẻ mỗi DIMM thành <em>HAI kênh con 32 bit độc lập</em>, để một burst vẫn chỉ chuyển 64 byte.</li>
<li><strong>"Front side bus" là cách gọi ĐÃ CŨ.</strong> FSB biến mất khỏi thiết kế Intel quanh 2008 (Nehalem) khi bộ điều khiển bộ nhớ dọn vào trong chính đế CPU; AMD làm chuyện đó từ 2003. Cứ đọc hàng này là "tốc độ dữ liệu của bus" là ổn — nhưng đừng đi tìm FSB trong một sơ đồ khối hiện đại.</li>
</ul>
<p class="pitfall">⚠️ <strong>Chính deck này TỰ MÂU THUẪN về DDR4.</strong> Bảng đây ghi 2133–4266 Mbps; Figure 6.14 ở ngay slide kế vẽ DDR4 I/O 667–1600 MHz, nhân đôi ra 1333–3200 Mbps. Đã kiểm bằng phép tính: ba thế hệ kia thì bảng và hình khớp nhau hoàn hảo (DDR1 200–400, DDR2 400–1066, DDR3 800–2133) — chỉ DDR4 vênh. Các mức tốc độ DDR4 chuẩn JEDEC thật chạy từ DDR4-1600 tới DDR4-3200, còn 4266 chỉ tồn tại dưới dạng ép xung XMP. Đề trích con số nào thì trả lời theo con số đó, nhưng biết rằng HÌNH mới là con số chuẩn hơn.</p>
<p class="meo">💡 Mẹo nhẩm nhanh: <strong>lấy số DDR chia cho 125 ra GB/s</strong>. DDR4-3200 ÷ 125 = 25,6 GB/s. DDR5-6400 ÷ 125 = 51,2 GB/s. (Đúng vì 8 byte ÷ 1000 = 1/125.)</p>`],

      [30, 'Figure 6.14 — DDR Generations (the prefetch buffer drawn as memory arrays feeding a MUX)',
        `<p class="y-chinh">🎯 The best single picture in the chapter. Five stacked boxes — SDRAM, DDR, DDR2, DDR3, DDR4 — each showing the <em>same slow memory arrays on the left</em>, a MUX in the middle, and a <em>faster I/O block on the right</em>. The number of arrays doubles each generation while the array speed stays put. That is the prefetch buffer, made visible.</p>
<table>
<tr><th>Generation</th><th>Label</th><th>Memory array(s)</th><th>I/O block</th><th>Data rate on the figure</th></tr>
<tr><td>SDRAM</td><td>1N</td><td>1 array, 100–150 MHz</td><td>100–150 MHz</td><td>100–150 Mbps</td></tr>
<tr><td>DDR</td><td>2N</td><td>2 arrays, 100–200 MHz</td><td>100–200 MHz</td><td>200–400 Mbps</td></tr>
<tr><td>DDR2</td><td>4N</td><td>4 arrays, 100–266 MHz</td><td>200–533 MHz</td><td>400–1066 Mbps</td></tr>
<tr><td>DDR3</td><td>8N</td><td>4+4 arrays, 100–266 MHz</td><td>400–1066 MHz</td><td>800–2133 Mbps</td></tr>
<tr><td>DDR4</td><td>8N + 8N</td><td>two groups of 8, 100–266 MHz, feeding two MUXes into a third MUX</td><td>667–1600 MHz</td><td>1333–3200 Mbps</td></tr>
</table>
<ul>
<li><strong>Read the left column and be shocked.</strong> Every single generation says <em>100–266 MHz</em> for the memory array. From SDRAM to DDR4 — roughly 1997 to 2014, a 20× jump in data rate — the actual DRAM cells got <strong>essentially no faster</strong>. All the speed is in the MUX and the I/O.</li>
<li><strong>"nN prefetch" decoded.</strong> <em>n</em> is how many bits are read out of the array <strong>per data pin, in one internal cycle</strong>. 8n prefetch means: one internal access grabs 8 bits per pin, the MUX serialises them, and the I/O clocks them out over 4 clock periods (8 bits ÷ 2 edges). Hence <code>transfer rate = array clock × prefetch</code> — the relation checked in the table on slide 29.</li>
<li><strong>Two clocks and a rate — the three numbers people confuse.</strong> For DDR3-1600: array 200 MHz, I/O 800 MHz, transfer 1600 MT/s. Ratio 1 : 4 : 8 = prefetch 8n with edge-doubling. The figure draws exactly this: I/O frequency is <em>prefetch ÷ 2</em> times the array frequency.</li>
<li><strong>Why DDR4's box is drawn differently.</strong> It is the only one with <em>two</em> groups of arrays and a second-level MUX. That is DDR4's <strong>bank groups</strong>: instead of a wider prefetch (which would overshoot the cache line), DDR4 puts two independently-accessible groups behind one I/O, so the controller can interleave between them and keep the fast pins busy. Same trick as interleaved memory on slide 15, one level down.</li>
<li><strong>The DDR5 continuation, off-slide but worth knowing.</strong> 16n prefetch, and the DIMM split into two 32-bit sub-channels — each sub-channel's burst of 16 × 4 bytes = 64 bytes, still exactly one cache line. The cache line size from Chapter 5 is quietly dictating DRAM design.</li>
</ul>
<p class="dap-an">✅ Checked against the previous slide: DDR1 100–200 MHz × 2 = 200–400 Mbps ✓ matches Table 6.4. DDR2 200–533 × 2 = 400–1066 ✓. DDR3 400–1066 × 2 = 800–2133 ✓. <strong>DDR4 667–1600 × 2 = 1333–3200</strong>, but Table 6.4 claims 2133–4266 ✗ — the one disagreement in the deck, flagged on slide 29.</p>
<p class="meo">💡 One sentence that answers most DDR questions: <em>the cells never got faster; the chip just learned to read more of them at once and pour them out through a quicker spout.</em> Latency is set by the cells (unchanged), bandwidth by the spout (20× better).</p>
<p class="pitfall">⚠️ Do not read the "2N / 4N / 8N" labels as bus width or as bank count. They are the <strong>prefetch depth per pin</strong>. And note the SDRAM row has no doubling at all — 100–150 MHz gives 100–150 Mbps, one transfer per clock. That row is on the figure precisely to be the baseline you compare against.</p>`,
        `<p class="y-chinh">🎯 Bức hình hay nhất của cả chương. Năm khối xếp chồng — SDRAM, DDR, DDR2, DDR3, DDR4 — mỗi khối đều có <em>những mảng nhớ CHẬM y như nhau ở bên trái</em>, một bộ MUX ở giữa, và một <em>khối I/O NHANH HƠN ở bên phải</em>. Số mảng nhân đôi mỗi thế hệ trong khi tốc độ mảng nằm im. Đó chính là bộ đệm nạp trước, được vẽ ra cho thấy.</p>
<table>
<tr><th>Thế hệ</th><th>Nhãn</th><th>Mảng nhớ</th><th>Khối I/O</th><th>Tốc độ dữ liệu ghi trên hình</th></tr>
<tr><td>SDRAM</td><td>1N</td><td>1 mảng, 100–150 MHz</td><td>100–150 MHz</td><td>100–150 Mbps</td></tr>
<tr><td>DDR</td><td>2N</td><td>2 mảng, 100–200 MHz</td><td>100–200 MHz</td><td>200–400 Mbps</td></tr>
<tr><td>DDR2</td><td>4N</td><td>4 mảng, 100–266 MHz</td><td>200–533 MHz</td><td>400–1066 Mbps</td></tr>
<tr><td>DDR3</td><td>8N</td><td>4+4 mảng, 100–266 MHz</td><td>400–1066 MHz</td><td>800–2133 Mbps</td></tr>
<tr><td>DDR4</td><td>8N + 8N</td><td>hai nhóm 8 mảng, 100–266 MHz, qua hai MUX rồi vào một MUX thứ ba</td><td>667–1600 MHz</td><td>1333–3200 Mbps</td></tr>
</table>
<ul>
<li><strong>Đọc cột bên trái và hãy thấy sốc.</strong> Thế hệ nào cũng ghi <em>100–266 MHz</em> cho mảng nhớ. Từ SDRAM tới DDR4 — cỡ 1997 tới 2014, tốc độ dữ liệu nhảy 20 lần — mà chính các ô DRAM <strong>gần như KHÔNG nhanh lên chút nào</strong>. Toàn bộ tốc độ nằm ở MUX và khối I/O.</li>
<li><strong>Giải mã chữ "prefetch nN".</strong> <em>n</em> là số bit được đọc ra khỏi mảng <strong>trên mỗi chân dữ liệu, trong một chu kỳ nội bộ</strong>. Prefetch 8n nghĩa là: một lần truy cập bên trong vớt 8 bit mỗi chân, MUX nối tiếp hoá chúng, và khối I/O đẩy ra trong 4 chu kỳ xung (8 bit ÷ 2 sườn). Do đó <code>tốc độ truyền = xung mảng × prefetch</code> — đúng quan hệ đã kiểm ở bảng slide 29.</li>
<li><strong>Hai xung nhịp và một tốc độ — ba con số người ta hay lẫn.</strong> Với DDR3-1600: mảng 200 MHz, I/O 800 MHz, truyền 1600 MT/s. Tỉ lệ 1 : 4 : 8 = prefetch 8n cộng nhân đôi theo sườn. Hình vẽ đúng như vậy: tần số I/O bằng <em>prefetch ÷ 2</em> lần tần số mảng.</li>
<li><strong>Vì sao ô DDR4 được vẽ khác hẳn.</strong> Nó là ô DUY NHẤT có <em>HAI</em> nhóm mảng và một tầng MUX thứ hai. Đó là <strong>bank group</strong> của DDR4: thay vì nới prefetch (sẽ vượt quá một dòng cache), DDR4 đặt hai nhóm truy cập được độc lập sau cùng một khối I/O, để bộ điều khiển xen kẽ giữa chúng và giữ cho các chân nhanh luôn có việc. Đúng mẹo "bộ nhớ xen kẽ" của slide 15, hạ xuống một tầng.</li>
<li><strong>Phần nối tiếp là DDR5, ngoài slide nhưng đáng biết.</strong> Prefetch 16n, và DIMM chẻ thành hai kênh con 32 bit — burst mỗi kênh con là 16 × 4 byte = 64 byte, vẫn đúng một dòng cache. Kích thước dòng cache của Chương 5 đang lặng lẽ ra lệnh cho thiết kế DRAM.</li>
</ul>
<p class="dap-an">✅ Đối chiếu với slide trước: DDR1 100–200 MHz × 2 = 200–400 Mbps ✓ khớp Table 6.4. DDR2 200–533 × 2 = 400–1066 ✓. DDR3 400–1066 × 2 = 800–2133 ✓. <strong>DDR4 667–1600 × 2 = 1333–3200</strong>, nhưng Table 6.4 ghi 2133–4266 ✗ — đúng một chỗ vênh của cả deck, đã nêu ở slide 29.</p>
<p class="meo">💡 Một câu trả lời được phần lớn câu hỏi về DDR: <em>các ô nhớ chưa bao giờ nhanh lên; con chip chỉ học cách đọc NHIỀU ô hơn cùng lúc rồi rót chúng ra qua một cái vòi nhanh hơn.</em> Độ trễ do ô nhớ quyết định (không đổi), băng thông do cái vòi quyết định (gấp 20 lần).</p>
<p class="pitfall">⚠️ Đừng đọc nhãn "2N / 4N / 8N" thành độ rộng bus hay số bank. Chúng là <strong>ĐỘ SÂU NẠP TRƯỚC TRÊN MỖI CHÂN</strong>. Và để ý hàng SDRAM hoàn toàn không nhân đôi — 100–150 MHz cho ra 100–150 Mbps, một lần truyền mỗi xung. Hàng đó có mặt trên hình chính là để làm mốc so sánh.</p>`],

      [31, 'Embedded DRAM (eDRAM) — DRAM built onto the processor die',
        `<p class="y-chinh">🎯 A fourth technology slips in between SRAM and DRAM. eDRAM "is a DRAM integrated on the same chip or MCM of an application-specific integrated circuit (ASIC) or microprocessor" — the <em>same</em> DRAM design, just moved from a separate stick onto the processor's own silicon. The slide's key phrase: <strong>"for a number of metrics, eDRAM is intermediate between on-chip SRAM and off-chip DRAM"</strong>.</p>
<table>
<tr><th>Metric</th><th>On-chip SRAM</th><th><strong>eDRAM</strong></th><th>Off-chip DRAM</th><th>The slide's exact claim</th></tr>
<tr><td><strong>Density</strong> (size for the same area)</td><td>smallest</td><td><strong>middle</strong></td><td>largest</td><td>"provides a larger size memory than SRAM but smaller than off-chip DRAM"</td></tr>
<tr><td><strong>Cost per bit</strong></td><td>highest</td><td><strong>middle</strong></td><td>lowest</td><td>"higher than equivalent stand-alone DRAM chips… lower cost-per-bit than SRAM"</td></tr>
<tr><td><strong>Access time</strong></td><td>fastest</td><td><strong>middle</strong></td><td>slowest</td><td>"greater than SRAM but… provides faster access than DRAM"</td></tr>
</table>
<ul>
<li><strong>Why it sits in the middle on every axis — one cause, three effects.</strong> A DRAM cell is 1 transistor + 1 capacitor; an SRAM cell is 6 transistors (slide 5, Figure 6.2). So eDRAM inherits DRAM's <em>density</em> and DRAM's <em>need to refresh</em>, but inherits on-chip <em>proximity</em>. Denser than SRAM, slower than SRAM, faster than anything reached over an external bus.</li>
<li><strong>The slide's reason for the speed win is worth quoting: "because of its proximity and the ability to use WIDER BUSSES".</strong> That second half is the real story. Off-chip you are limited to 64 data pins because pins are expensive and slow; on-chip you can run a bus hundreds or thousands of bits wide because wires on silicon are nearly free. Bandwidth, again, not latency.</li>
<li><strong>"Fundamentally eDRAMs use the same designs and architectures as DRAM."</strong> Nothing exotic — same one-transistor cell, same row/column organisation, same refresh. The difference is purely <em>where it is manufactured</em>, which is also why it is hard: a logic process is optimised for fast transistors, not for deep capacitors, so making both on one die costs extra mask steps.</li>
<li><strong>Where it is actually used.</strong> The next two slides give the two canonical cases: <strong>IBM z13</strong>, where eDRAM is the L3 <em>and</em> L4 cache, and <strong>Intel Core</strong>, where 64–128 MB of eDRAM served as an L4 / graphics victim cache ("Crystalwell", the Iris Pro parts). Also every PlayStation and Xbox generation, and many ASICs with on-chip frame buffers.</li>
<li><strong>Connect back to Chapter 5.</strong> That chapter said cache is SRAM. eDRAM is the exception that proves the rule: when a cache level gets big enough (tens of megabytes), SRAM's 6-transistor cell becomes unaffordable in area, and the designer trades latency for capacity.</li>
</ul>
<p class="meo">💡 Remember eDRAM by the sentence "<strong>DRAM cells, cache job, on-die address</strong>". Anything that is on the processor die but too big to be SRAM is probably eDRAM.</p>
<p class="pitfall">⚠️ eDRAM is <em>not</em> a new kind of memory cell and it is <em>not</em> nonvolatile. It still leaks, it still needs refreshing, and the refresh logic must now live on the CPU die too. Also, "MCM" in the slide means <em>multi-chip module</em> — a package holding several dies — so eDRAM need not literally be on the same piece of silicon, only in the same package.</p>`,
        `<p class="y-chinh">🎯 Một công nghệ thứ tư chen vào giữa SRAM và DRAM. eDRAM "là DRAM được tích hợp trên CÙNG con chip hoặc cùng MCM với một mạch tích hợp chuyên dụng (ASIC) hoặc một bộ vi xử lý" — vẫn <em>ĐÚNG</em> thiết kế DRAM ấy, chỉ dọn từ một thanh RAM riêng vào chính miếng silic của bộ xử lý. Câu chìa khoá của slide: <strong>"xét trên một số tiêu chí, eDRAM nằm TRUNG GIAN giữa SRAM trên chip và DRAM ngoài chip"</strong>.</p>
<table>
<tr><th>Tiêu chí</th><th>SRAM trên chip</th><th><strong>eDRAM</strong></th><th>DRAM ngoài chip</th><th>Nguyên văn slide</th></tr>
<tr><td><strong>Mật độ</strong> (cùng diện tích chứa được bao nhiêu)</td><td>ít nhất</td><td><strong>ở giữa</strong></td><td>nhiều nhất</td><td>"cho bộ nhớ LỚN HƠN SRAM nhưng NHỎ HƠN DRAM ngoài chip"</td></tr>
<tr><td><strong>Giá mỗi bit</strong></td><td>cao nhất</td><td><strong>ở giữa</strong></td><td>thấp nhất</td><td>"cao hơn chip DRAM rời tương đương… nhưng thấp hơn SRAM"</td></tr>
<tr><td><strong>Thời gian truy cập</strong></td><td>nhanh nhất</td><td><strong>ở giữa</strong></td><td>chậm nhất</td><td>"lớn hơn SRAM nhưng… truy cập nhanh hơn DRAM"</td></tr>
</table>
<ul>
<li><strong>Vì sao nó ở giữa trên MỌI trục — một nguyên nhân, ba hệ quả.</strong> Ô DRAM là 1 transistor + 1 tụ; ô SRAM là 6 transistor (slide 5, Figure 6.2). Nên eDRAM thừa hưởng <em>MẬT ĐỘ</em> của DRAM và cả <em>NHU CẦU LÀM TƯƠI</em> của DRAM, nhưng thừa hưởng sự <em>GẦN GŨI</em> của thứ nằm trên chip. Đặc hơn SRAM, chậm hơn SRAM, nhanh hơn mọi thứ phải đi qua bus ngoài.</li>
<li><strong>Lý do slide đưa ra cho ưu thế tốc độ rất đáng trích: "nhờ ở GẦN và nhờ khả năng dùng BUS RỘNG HƠN".</strong> Nửa sau mới là câu chuyện thật. Ra ngoài chip thì bạn bị giới hạn ở 64 chân dữ liệu vì chân vừa đắt vừa chậm; ở trong chip bạn chạy được bus rộng hàng trăm, hàng nghìn bit vì dây trên silic gần như miễn phí. Lại là băng thông, không phải độ trễ.</li>
<li><strong>"Về cơ bản eDRAM dùng CÙNG thiết kế và kiến trúc như DRAM."</strong> Không có gì kỳ lạ — vẫn ô một transistor, vẫn tổ chức hàng/cột, vẫn phải làm tươi. Khác biệt thuần tuý là <em>NÓ ĐƯỢC CHẾ TẠO Ở ĐÂU</em>, và đó cũng là lý do nó khó: quy trình logic được tối ưu cho transistor nhanh chứ không cho tụ sâu, nên làm cả hai trên một đế tốn thêm nhiều bước mặt nạ.</li>
<li><strong>Nó thật sự dùng ở đâu.</strong> Hai slide kế cho hai ca kinh điển: <strong>IBM z13</strong>, nơi eDRAM làm cache L3 <em>VÀ</em> L4, và <strong>Intel Core</strong>, nơi 64–128 MB eDRAM làm cache L4 / cache đồ hoạ ("Crystalwell", dòng Iris Pro). Ngoài ra là mọi thế hệ PlayStation, Xbox, và rất nhiều ASIC có bộ đệm khung hình trên chip.</li>
<li><strong>Nối ngược về Chương 5.</strong> Chương đó nói cache là SRAM. eDRAM là ngoại lệ chứng minh cho quy tắc: khi một mức cache đủ lớn (hàng chục megabyte), ô 6 transistor của SRAM trở nên không kham nổi về diện tích, và người thiết kế đem độ trễ đi đổi lấy dung lượng.</li>
</ul>
<p class="meo">💡 Nhớ eDRAM bằng một câu "<strong>ô của DRAM, việc của cache, địa chỉ ở ngay trên chip</strong>". Cái gì nằm trên đế CPU mà lớn quá mức SRAM kham nổi thì gần như chắc chắn là eDRAM.</p>
<p class="pitfall">⚠️ eDRAM <em>KHÔNG</em> phải một loại ô nhớ mới và <em>KHÔNG</em> phải bộ nhớ không mất điện. Nó vẫn rò, vẫn cần làm tươi, và mạch làm tươi giờ phải sống luôn trên đế CPU. Thêm nữa, "MCM" trong slide nghĩa là <em>multi-chip module</em> — một vỏ chứa nhiều đế — nên eDRAM không nhất thiết nằm cùng MIẾNG silic, chỉ cần cùng một GÓI.</p>`],

      [32, 'Figure 6.15 — IBM z13 Storage Control (SC) Chip Layout',
        `<p class="y-chinh">🎯 A floor plan of one chip whose <em>only</em> job is cache. Five blocks: four large <strong>L4 Cache (120 MB + 56 MB non-inclusive cache Directory)</strong> quadrants, and a centre strip holding <strong>I/O Logic — L4 Cache Controller — I/O Logic</strong>. Every one of those megabytes is eDRAM.</p>
<ul>
<li><strong>Do the arithmetic the figure invites.</strong> Four quadrants, each labelled 120 MB, but the z13's published L4 is 480 MB of eDRAM per SC chip, and the four boxes are drawn as two pairs. Read the label as <em>the shared capacity each quadrant serves</em> rather than multiplying blindly — the safe exam statement is: <strong>the z13 SC chip is a dedicated eDRAM L4 cache chip in the hundreds of megabytes</strong>. Compare: the L1 caches in the same machine are measured in <em>kilobytes</em>.</li>
<li><strong>"Non-inclusive cache Directory" is the phrase to notice.</strong> An <em>inclusive</em> cache holds a copy of everything in the level above it; a <em>non-inclusive</em> one does not, so it needs a <strong>directory</strong> — a table saying which core currently holds which line. 56 MB of the chip is spent on that bookkeeping alone. That is the price of coherence across many processor chips (Ch.20/21 territory).</li>
<li><strong>Why a separate chip at all.</strong> A mainframe drawer holds several processor chips; they all need one shared, coherent last level. Putting it on its own die lets IBM optimise that die for eDRAM density while the processor dies are optimised for logic speed. This is the MCM idea from slide 31, at industrial scale.</li>
<li><strong>Why eDRAM and not SRAM here.</strong> Hundreds of megabytes of 6-transistor SRAM cells would be physically impossible in that area and thermally impossible in that power budget. eDRAM's 1T1C cell is the only way to make a cache that big that is still on-package.</li>
<li><strong>Read the layout as a performance argument.</strong> The L4 controller sits in the <em>centre</em>, equidistant from all four cache quadrants; I/O logic sits on the edges where the package pins are. On a chip this size, wire distance <em>is</em> latency — the floor plan is a timing decision, not decoration.</li>
</ul>
<p class="dap-an">✅ What to take to the exam from this slide: <strong>(1)</strong> eDRAM makes cache levels possible that SRAM could never reach in size; <strong>(2)</strong> the z13 spends a whole chip on L4; <strong>(3)</strong> a non-inclusive cache costs you a directory, and here that directory is itself 56 MB — nearly half the size of the data it tracks in each quadrant.</p>
<p class="meo">💡 The z13 cache ladder is the clearest example of the memory hierarchy in any real product: L1 in kB (SRAM, per core) → L2 in MB (SRAM, per core) → L3 in tens of MB (eDRAM, shared per processor chip) → L4 in hundreds of MB (eDRAM, shared per drawer, this chip) → main memory in TB (DDR). Five levels, three technologies.</p>
<p class="pitfall">⚠️ Do not confuse this <strong>SC (Storage Control)</strong> chip with the processor chip — it contains no cores. And "storage control" here means <em>cache</em> control, not disk control; IBM's vocabulary calls main memory "storage".</p>`,
        `<p class="y-chinh">🎯 Sơ đồ mặt bằng của một con chip mà việc DUY NHẤT của nó là làm cache. Năm khối: bốn góc phần tư lớn ghi <strong>L4 Cache (120 MB + 56 MB non-inclusive cache Directory)</strong>, và một dải giữa gồm <strong>I/O Logic — L4 Cache Controller — I/O Logic</strong>. Từng megabyte trong đó đều là eDRAM.</p>
<ul>
<li><strong>Hãy làm phép tính mà hình mời gọi.</strong> Bốn góc, mỗi góc ghi 120 MB, nhưng L4 công bố của z13 là 480 MB eDRAM mỗi chip SC, và bốn ô được vẽ thành hai cặp. Hãy đọc nhãn như <em>dung lượng chung mà mỗi góc phục vụ</em> thay vì nhân bừa — câu an toàn để đi thi là: <strong>chip SC của z13 là một con chip cache L4 bằng eDRAM, cỡ hàng trăm megabyte</strong>. Đối chiếu: cache L1 trong chính cỗ máy đó đo bằng <em>KILObyte</em>.</li>
<li><strong>Cụm "Non-inclusive cache Directory" mới là chỗ đáng để ý.</strong> Cache <em>bao hàm (inclusive)</em> giữ bản sao của mọi thứ ở mức trên nó; cache <em>KHÔNG bao hàm</em> thì không, nên nó cần một <strong>THƯ MỤC (directory)</strong> — một bảng ghi lõi nào đang giữ dòng nào. 56 MB của con chip dành riêng cho việc ghi sổ đó. Đó là cái giá của tính nhất quán bộ nhớ giữa nhiều chip xử lý (địa hạt Ch.20/21).</li>
<li><strong>Vì sao phải hẳn một con chip riêng.</strong> Một ngăn máy chủ lớn (drawer) chứa nhiều chip xử lý; tất cả cần chung một mức cuối, nhất quán. Đặt nó lên đế riêng cho phép IBM tối ưu đế đó cho mật độ eDRAM trong khi các đế xử lý được tối ưu cho tốc độ logic. Đây là ý tưởng MCM của slide 31, ở quy mô công nghiệp.</li>
<li><strong>Vì sao eDRAM chứ không phải SRAM ở đây.</strong> Hàng trăm megabyte ô SRAM 6 transistor là bất khả thi về mặt diện tích và bất khả thi về mặt nhiệt trong ngân sách điện đó. Ô 1T1C của eDRAM là cách DUY NHẤT làm ra một cache lớn đến thế mà vẫn nằm trong gói.</li>
<li><strong>Đọc mặt bằng như một lập luận hiệu năng.</strong> Bộ điều khiển L4 nằm ở <em>CHÍNH GIỮA</em>, cách đều bốn góc cache; khối I/O nằm ở rìa, nơi có chân của gói. Trên một con chip cỡ này, khoảng cách dây <em>CHÍNH LÀ</em> độ trễ — sơ đồ mặt bằng là một quyết định về thời gian, không phải trang trí.</li>
</ul>
<p class="dap-an">✅ Thứ cần mang đi thi từ slide này: <strong>(1)</strong> eDRAM làm khả thi những mức cache mà SRAM không bao giờ với tới được về kích thước; <strong>(2)</strong> z13 dành nguyên một con chip cho L4; <strong>(3)</strong> cache không bao hàm thì phải trả giá bằng một thư mục, và ở đây thư mục đó tự nó đã 56 MB — gần bằng nửa lượng dữ liệu nó theo dõi trong mỗi góc.</p>
<p class="meo">💡 Thang cache của z13 là ví dụ rõ nhất về phân cấp bộ nhớ trong bất kỳ sản phẩm thật nào: L1 tính bằng kB (SRAM, mỗi lõi) → L2 tính bằng MB (SRAM, mỗi lõi) → L3 hàng chục MB (eDRAM, dùng chung mỗi chip xử lý) → L4 hàng trăm MB (eDRAM, dùng chung mỗi drawer, chính con chip này) → bộ nhớ chính tính bằng TB (DDR). Năm mức, ba công nghệ.</p>
<p class="pitfall">⚠️ Đừng nhầm con chip <strong>SC (Storage Control)</strong> này với chip xử lý — nó KHÔNG chứa lõi nào. Và "storage control" ở đây nghĩa là điều khiển <em>CACHE</em>, không phải điều khiển đĩa; từ vựng của IBM gọi bộ nhớ chính là "storage".</p>`],

      [33, 'Figure 6.16 — Use of eDRAM in Intel Core Systems (two generations, two wiring choices)',
        `<p class="y-chinh">🎯 The same component wired two different ways, and the difference tells you what designers learned. Panel <strong>(a) "Original use of eDRAM"</strong> hangs the eDRAM off the L3 as a true <strong>L4</strong>; panel <strong>(b) "More recent use of eDRAM"</strong> moves it down beside the memory controller as a <strong>memory-side cache</strong>.</p>
<table>
<tr><th></th><th>(a) Original use</th><th>(b) More recent use</th></tr>
<tr><td><strong>Where the tags live</strong></td><td><strong>"L4 Tags" inside the L3 block</strong> on the processor die</td><td><strong>"Cache tags" + "eDRAM control"</strong> in a separate block next to the System agent</td></tr>
<tr><td><strong>What it is logically</strong></td><td>A fourth <em>cache level</em> (L4) in the coherent hierarchy</td><td>A <em>memory-side</em> cache sitting in front of the memory controller (MC)</td></tr>
<tr><td><strong>Who can use it</strong></td><td>Reached via L3; the Graphics Processor talks to L3</td><td>Everything going to DDR passes it — cores, graphics and I/O alike</td></tr>
<tr><td><strong>Cost on the CPU die</strong></td><td>L3 must carry the L4 tag array</td><td>The CPU die is freed; tags move to the eDRAM controller</td></tr>
</table>
<ul>
<li><strong>Read the common parts first.</strong> Both panels show the same skeleton: per-core <strong>L1 D</strong> and <strong>L1 I</strong> (the split instruction/data cache of Chapter 4), a per-core <strong>L2</strong>, one shared <strong>L3</strong>, a <strong>Graphics Processor</strong> with its own graphics caches, a <strong>System agent</strong>, <strong>PCIe</strong> to other devices, and <strong>MC → DDR</strong>. Only the eDRAM's attachment point changes.</li>
<li><strong>Why eDRAM appeared in a consumer CPU at all: integrated graphics.</strong> A GPU on the same die has to share the DDR channel with the cores, and graphics is bandwidth-hungry. 64–128 MB of eDRAM absorbs that traffic. This is Intel's "Crystalwell" / Iris Pro.</li>
<li><strong>Why design (b) is better, in one sentence.</strong> In (a) the eDRAM is part of the coherence domain, so every line in it must be tracked by tags on the expensive CPU die and kept coherent. In (b) it is <em>behind</em> coherence — it simply caches whatever is on its way to DDR — which is far simpler, uses no CPU-die area for tags, and automatically helps I/O traffic too.</li>
<li><strong>The general lesson worth more than the specific chips.</strong> <em>The same physical memory can be a cache level or a memory-side buffer depending only on where you attach it.</em> The identical idea reappears as HBM in GPUs and as "Memory Mode" in Intel Optane DIMMs.</li>
<li><strong>Connect to your own machine.</strong> Modern consumer CPUs mostly dropped eDRAM (integrated graphics improved and DDR4/5 bandwidth grew), but the concept lives on: Apple's M-series puts DRAM in the same package, and AMD's 3D V-Cache stacks extra cache die on top of the CPU. Same problem, newer packaging.</li>
</ul>
<p class="dap-an">✅ Exam-ready contrast: <strong>a cache level (L4)</strong> is on the processor side of the coherence boundary and needs tags on the CPU die; <strong>a memory-side cache</strong> is on the memory side, needs no coherence participation, and speeds up every client of DRAM, not just the cores. Figure 6.16 is a picture of exactly that boundary moving.</p>
<p class="meo">💡 Spot the difference in three seconds: find the words "L4 Tags". If they sit inside the L3 block it is panel (a) — eDRAM as L4. If instead you see a small "Cache tags / eDRAM control" box down by the memory controller, it is panel (b) — memory-side cache.</p>
<p class="pitfall">⚠️ Note that in <em>both</em> panels the eDRAM is drawn <strong>outside</strong> the dashed L1/L2/L3 level lines. It is a separate die in the package, not a region of the CPU die — consistent with "same chip <em>or MCM</em>" in slide 31. Do not claim eDRAM is always on the processor die.</p>`,
        `<p class="y-chinh">🎯 Cùng một linh kiện, đấu dây hai kiểu khác nhau, và chênh lệch ấy cho biết người thiết kế đã học được gì. Ô <strong>(a) "Original use of eDRAM"</strong> treo eDRAM sau L3 như một mức <strong>L4</strong> thật sự; ô <strong>(b) "More recent use of eDRAM"</strong> dời nó xuống cạnh bộ điều khiển bộ nhớ thành một <strong>cache PHÍA BỘ NHỚ</strong>.</p>
<table>
<tr><th></th><th>(a) Cách dùng ban đầu</th><th>(b) Cách dùng gần đây</th></tr>
<tr><td><strong>Thẻ (tag) nằm ở đâu</strong></td><td><strong>"L4 Tags" NẰM TRONG khối L3</strong> trên đế CPU</td><td><strong>"Cache tags" + "eDRAM control"</strong> thành một khối riêng cạnh System agent</td></tr>
<tr><td><strong>Về mặt logic nó là gì</strong></td><td>Một <em>MỨC CACHE</em> thứ tư (L4) trong miền nhất quán</td><td>Một cache <em>PHÍA BỘ NHỚ</em>, đứng trước bộ điều khiển bộ nhớ (MC)</td></tr>
<tr><td><strong>Ai dùng được nó</strong></td><td>Đi qua L3; GPU nói chuyện với L3</td><td>Mọi thứ đi xuống DDR đều qua nó — lõi, đồ hoạ lẫn I/O</td></tr>
<tr><td><strong>Tốn gì trên đế CPU</strong></td><td>L3 phải gánh cả mảng thẻ của L4</td><td>Đế CPU được giải phóng; thẻ dời sang bộ điều khiển eDRAM</td></tr>
</table>
<ul>
<li><strong>Đọc phần GIỐNG NHAU trước.</strong> Cả hai ô đều có cùng bộ khung: <strong>L1 D</strong> và <strong>L1 I</strong> riêng cho mỗi lõi (cache lệnh/dữ liệu tách đôi của Chương 4), <strong>L2</strong> riêng mỗi lõi, một <strong>L3</strong> dùng chung, một <strong>Graphics Processor</strong> có cache đồ hoạ riêng, một <strong>System agent</strong>, <strong>PCIe</strong> ra thiết bị khác, và <strong>MC → DDR</strong>. Chỉ có ĐIỂM ĐẤU của eDRAM là đổi.</li>
<li><strong>Vì sao eDRAM lại xuất hiện trong một CPU tiêu dùng: ĐỒ HOẠ TÍCH HỢP.</strong> GPU nằm cùng đế phải chia kênh DDR với các lõi, mà đồ hoạ thì ngốn băng thông. 64–128 MB eDRAM hút lấy luồng đó. Đây chính là "Crystalwell" / Iris Pro của Intel.</li>
<li><strong>Vì sao thiết kế (b) tốt hơn, gói trong một câu.</strong> Ở (a), eDRAM nằm TRONG miền nhất quán nên mọi dòng trong nó phải được theo dõi bằng thẻ trên đế CPU đắt đỏ và phải giữ nhất quán. Ở (b) nó nằm <em>SAU</em> ranh giới nhất quán — chỉ đơn giản đệm lại mọi thứ đang trên đường xuống DDR — nên đơn giản hơn nhiều, không tốn diện tích đế CPU cho thẻ, và tự động giúp luôn cả luồng I/O.</li>
<li><strong>Bài học tổng quát còn đáng giá hơn mấy con chip cụ thể.</strong> <em>Cùng một khối bộ nhớ vật lý có thể là MỘT MỨC CACHE hay MỘT BỘ ĐỆM PHÍA BỘ NHỚ, chỉ tuỳ vào chỗ bạn đấu nó vào.</em> Y hệt ý tưởng ấy quay lại dưới dạng HBM trên GPU và "Memory Mode" của Intel Optane DIMM.</li>
<li><strong>Nối về máy của chính bạn.</strong> CPU tiêu dùng hiện đại phần lớn đã bỏ eDRAM (đồ hoạ tích hợp khá lên và băng thông DDR4/5 tăng), nhưng khái niệm vẫn sống: Apple dòng M đặt DRAM ngay trong cùng một gói, còn AMD với 3D V-Cache xếp chồng thêm một đế cache lên trên CPU. Cùng bài toán, gói mới.</li>
</ul>
<p class="dap-an">✅ Đối lập sẵn để đi thi: <strong>một MỨC CACHE (L4)</strong> nằm ở PHÍA BỘ XỬ LÝ của ranh giới nhất quán và cần thẻ trên đế CPU; <strong>một cache PHÍA BỘ NHỚ</strong> nằm ở phía bộ nhớ, không phải tham gia giao thức nhất quán, và tăng tốc cho MỌI khách hàng của DRAM chứ không riêng các lõi. Figure 6.16 chính là bức ảnh chụp cái ranh giới đó đang dịch chuyển.</p>
<p class="meo">💡 Phân biệt trong ba giây: tìm chữ "L4 Tags". Nếu nó nằm bên trong khối L3 thì đó là ô (a) — eDRAM làm L4. Còn nếu thấy một ô nhỏ "Cache tags / eDRAM control" nằm dưới, cạnh bộ điều khiển bộ nhớ, thì đó là ô (b) — cache phía bộ nhớ.</p>
<p class="pitfall">⚠️ Để ý rằng ở <em>CẢ HAI</em> ô, eDRAM đều được vẽ <strong>NGOÀI</strong> các đường đứt đánh dấu mức L1/L2/L3. Nó là một đế riêng trong cùng gói, không phải một vùng của đế CPU — khớp với "cùng chip <em>HOẶC cùng MCM</em>" ở slide 31. Đừng khẳng định eDRAM luôn nằm trên đế bộ xử lý.</p>`],

      [34, 'Flash Memory — erase a block in a flash, one transistor per bit',
        `<p class="y-chinh">🎯 The technology that ended the floppy disk, made the smartphone possible and is now replacing the hard disk. The slide gives its position precisely: flash "is <strong>intermediate between EPROM and EEPROM in both cost and functionality</strong>", and it "uses only <strong>one transistor per bit</strong> so it achieves the high density of EPROM".</p>
<table>
<tr><th></th><th>EPROM</th><th><strong>Flash</strong></th><th>EEPROM</th></tr>
<tr><td><strong>How you erase</strong></td><td>UV light, whole chip</td><td><strong>Electrically, one BLOCK</strong></td><td>Electrically, one byte</td></tr>
<tr><td><strong>Transistors per bit</strong></td><td>1</td><td><strong>1</strong></td><td>~2</td></tr>
<tr><td><strong>Density / cost per bit</strong></td><td>high / low</td><td><strong>high / low</strong></td><td>low / high</td></tr>
<tr><td><strong>Convenience</strong></td><td>worst (remove the chip, shine UV)</td><td><strong>middle</strong></td><td>best (rewrite any byte in place)</td></tr>
</table>
<ul>
<li><strong>Where the name comes from — the slide says it outright.</strong> "Gets its name because the microchip is organized so that <strong>a section of memory cells are erased in a single action</strong>" — erased "in a flash", like a camera flash. That is a statement about <em>granularity</em>, not about speed.</li>
<li><strong>The single most exam-relevant line: "Does not provide byte-level erasure."</strong> You can read any byte and, within limits, program bits from 1 to 0 individually — but returning bits to 1 only happens for a <em>whole erase block</em> at once. Everything strange about SSDs follows from this one asymmetry.</li>
<li><strong>What that asymmetry causes, and why Ch.7 needs a whole controller for it.</strong> To change one byte you must copy the block elsewhere, erase it, write it back. Hence <strong>write amplification</strong>, hence the <strong>FTL</strong> (flash translation layer), hence <strong>wear levelling</strong> (each block survives only a limited number of erase cycles), hence TRIM and garbage collection. A hard disk has none of these problems; a flash device has all of them.</li>
<li><strong>"Used both for internal memory and external memory applications."</strong> Internal: the BIOS/UEFI firmware on your motherboard, the firmware in every embedded device. External: USB sticks, SD cards, SSDs — which is Chapter 7's subject. That is why this chapter covers the <em>cell</em> and the next covers the <em>drive</em>.</li>
<li><strong>Dates and lineage.</strong> "First introduced in the mid-1980's" (Toshiba, Fujio Masuoka). Look back at Table 6.1 on slide 3: flash sits in the <strong>read-mostly memory</strong> row, erased "electrically, block-level", <em>nonvolatile</em>. That one table row is the whole slide in compressed form.</li>
</ul>
<p class="meo">💡 Three-step mantra for flash: <strong>read a byte · program a page · erase a block</strong>. Three different granularities, growing in that order. Nearly every flash exam question is testing whether you know they are different.</p>
<p class="pitfall">⚠️ Trap: "flash is nonvolatile, therefore it lasts forever". It does not. Charge on a floating gate leaks over years (retention), and the oxide degrades with each erase (endurance — from ~100 000 cycles for early SLC down to a few thousand for modern QLC). Also do not call flash an EEPROM in an exam answer: EEPROM erases per byte, flash per block, and that is exactly the distinction the slide is drawing.</p>`,
        `<p class="y-chinh">🎯 Công nghệ đã khai tử đĩa mềm, làm nên điện thoại thông minh, và giờ đang thay thế ổ cứng. Slide định vị nó rất chính xác: flash "nằm <strong>TRUNG GIAN giữa EPROM và EEPROM về cả giá lẫn chức năng</strong>", và nó "chỉ dùng <strong>MỘT transistor cho mỗi bit</strong> nên đạt mật độ cao như EPROM".</p>
<table>
<tr><th></th><th>EPROM</th><th><strong>Flash</strong></th><th>EEPROM</th></tr>
<tr><td><strong>Xoá bằng cách nào</strong></td><td>Tia cực tím, cả chip</td><td><strong>Bằng điện, từng KHỐI</strong></td><td>Bằng điện, từng byte</td></tr>
<tr><td><strong>Transistor mỗi bit</strong></td><td>1</td><td><strong>1</strong></td><td>~2</td></tr>
<tr><td><strong>Mật độ / giá mỗi bit</strong></td><td>cao / thấp</td><td><strong>cao / thấp</strong></td><td>thấp / cao</td></tr>
<tr><td><strong>Tiện dụng</strong></td><td>tệ nhất (tháo chip ra, rọi tia UV)</td><td><strong>ở giữa</strong></td><td>tốt nhất (ghi lại bất kỳ byte nào tại chỗ)</td></tr>
</table>
<ul>
<li><strong>Tên gọi từ đâu ra — slide nói thẳng.</strong> "Có tên như vậy vì con chip được tổ chức sao cho <strong>một VÙNG ô nhớ bị xoá trong MỘT hành động duy nhất</strong>" — xoá "trong một chớp" (flash), như đèn flash máy ảnh. Đó là câu nói về <em>ĐỘ MỊN</em>, không phải về tốc độ.</li>
<li><strong>Dòng đáng đi thi nhất: "Không cho phép xoá ở mức byte."</strong> Bạn đọc được bất kỳ byte nào, và trong giới hạn nhất định lập trình được từng bit từ 1 xuống 0 — nhưng đưa bit trở về 1 chỉ xảy ra cho <em>NGUYÊN MỘT KHỐI XOÁ</em> cùng lúc. Mọi thứ kỳ quặc của SSD đều mọc ra từ đúng sự bất đối xứng này.</li>
<li><strong>Sự bất đối xứng đó gây ra gì, và vì sao Ch.7 phải có hẳn một bộ điều khiển cho nó.</strong> Muốn đổi một byte thì phải chép cả khối đi chỗ khác, xoá, ghi lại. Do đó có <strong>khuếch đại ghi (write amplification)</strong>, do đó có <strong>FTL</strong> (lớp dịch flash), do đó có <strong>san đều hao mòn (wear levelling)</strong> (mỗi khối chỉ chịu được số lần xoá hữu hạn), do đó có TRIM và thu gom rác. Ổ cứng cơ không có vấn đề nào trong số đó; thiết bị flash có ĐỦ.</li>
<li><strong>"Dùng cho cả bộ nhớ trong lẫn bộ nhớ ngoài."</strong> Bên trong: firmware BIOS/UEFI trên bo mạch chủ, firmware trong mọi thiết bị nhúng. Bên ngoài: USB, thẻ SD, SSD — chủ đề của Chương 7. Vì thế chương này nói về <em>Ô NHỚ</em>, chương sau nói về <em>Ổ ĐĨA</em>.</li>
<li><strong>Mốc thời gian và dòng dõi.</strong> "Ra đời giữa thập niên 1980" (Toshiba, Fujio Masuoka). Nhìn lại Table 6.1 ở slide 3: flash nằm ở hàng <strong>read-mostly memory</strong>, xoá "bằng điện, mức khối", <em>không mất dữ liệu khi cắt điện</em>. Một hàng bảng đó chính là cả slide này ở dạng nén.</li>
</ul>
<p class="meo">💡 Câu thần chú ba bước cho flash: <strong>đọc một BYTE · ghi một TRANG · xoá một KHỐI</strong>. Ba độ mịn khác nhau, tăng dần theo đúng thứ tự đó. Gần như mọi câu hỏi thi về flash đều đang kiểm tra xem bạn có biết chúng KHÁC NHAU hay không.</p>
<p class="pitfall">⚠️ Bẫy: "flash không mất dữ liệu khi cắt điện, vậy nó bền vĩnh viễn". KHÔNG. Điện tích trên cổng nổi rò dần qua nhiều năm (retention), và lớp ô-xít suy thoái sau mỗi lần xoá (endurance — từ ~100 000 chu kỳ với SLC đời đầu xuống còn vài nghìn với QLC hiện đại). Cũng đừng gọi flash là EEPROM trong bài thi: EEPROM xoá theo BYTE, flash xoá theo KHỐI, và đó đúng là điểm phân biệt mà slide đang vạch ra.</p>`],

      [35, 'Figure 6.17 — Flash Memory Operation (the floating gate)',
        `<p class="y-chinh">🎯 Three cross-sections that explain how a transistor remembers with the power off. Panel (a) is an <strong>ordinary MOS transistor</strong>: Control Gate above, N+ Drain and N+ Source in a P-substrate. Panels (b) and (c) add the one thing that changes everything — a <strong>Floating Gate</strong> sandwiched between the control gate and the channel, completely surrounded by insulator.</p>
<table>
<tr><th>Panel</th><th>What is drawn</th><th>State</th></tr>
<tr><td><strong>(a) Transistor structure</strong></td><td>Control Gate, N+ Drain, N+ Source, P-substrate. No floating gate.</td><td>A normal switch — remembers nothing</td></tr>
<tr><td><strong>(b) Flash memory cell in one state</strong></td><td>Floating Gate present and <strong>empty</strong> (no charge drawn on it)</td><td><strong>Logic 1</strong> — the erased state</td></tr>
<tr><td><strong>(c) Flash memory cell in zero state</strong></td><td>Row of <strong>+</strong> signs above the control gate, row of <strong>−</strong> (electrons) trapped on the floating gate</td><td><strong>Logic 0</strong> — the programmed state</td></tr>
</table>
<ul>
<li><strong>Why "floating".</strong> The gate is electrically isolated on all sides by oxide — it connects to nothing. Electrons put there have nowhere to go, so they stay for years <em>with no power at all</em>. That single fact is the whole of nonvolatility; there is no battery and no refresh, unlike DRAM.</li>
<li><strong>How a bit gets written (panel c).</strong> A strongly positive voltage on the control gate (the row of <strong>+</strong> in the drawing) pulls electrons from the channel through the thin oxide onto the floating gate — by hot-carrier injection or Fowler–Nordheim tunnelling. Once trapped, those electrons partly cancel any future gate voltage.</li>
<li><strong>How a bit is read.</strong> Apply a moderate voltage to the control gate and see whether the transistor conducts. Empty floating gate ⇒ it turns on ⇒ read as <strong>1</strong>. Charged floating gate ⇒ the trapped electrons raise the threshold so it stays off ⇒ read as <strong>0</strong>. Reading is just "does it switch at this voltage?".</li>
<li><strong>Why erasing is block-wide (this is the answer to slide 34).</strong> Pulling electrons back <em>off</em> the floating gate needs a large reverse field applied to the substrate, which is shared by a whole block of cells. You physically cannot aim it at one byte. Hence "erase in a flash" — and hence the entire FTL of Chapter 7.</li>
<li><strong>Why wear is unavoidable.</strong> Every program/erase drives electrons <em>through</em> the thin oxide. Each trip damages it slightly; eventually charge leaks or gets stuck and the cell stops holding a reliable level. That is the physical origin of the endurance limit — not a firmware policy, a material fact.</li>
</ul>
<p class="dap-an">✅ Extension the figure implies but does not draw: if you can measure <em>how much</em> charge is on the floating gate instead of just "some / none", one cell can store more than one bit. <strong>SLC</strong> = 2 levels = 1 bit, <strong>MLC</strong> = 4 levels = 2 bits, <strong>TLC</strong> = 8 levels = 3 bits, <strong>QLC</strong> = 16 levels = 4 bits. Capacity ×4, but the voltage windows get 8× narrower, so endurance and retention collapse — which is exactly why a cheap QLC SSD wears out faster than an expensive SLC one.</p>
<p class="meo">💡 Mental picture: the floating gate is a sealed jar in the middle of a wall. Pushing electrons in takes a hard shove (programming); tipping them all out needs you to shake the whole wall (block erase); checking whether the jar is full is easy and harmless (reading). Every shove and every shake cracks the jar a little.</p>
<p class="pitfall">⚠️ The polarity trips people up: the <strong>erased</strong> state (empty floating gate) is logic <strong>1</strong>, and programming drives bits to <strong>0</strong>. So flash can turn 1→0 freely but 0→1 only by erasing a whole block. If an exam asks "why can't flash overwrite in place?", that sentence is the complete answer.</p>`,
        `<p class="y-chinh">🎯 Ba lát cắt ngang giải thích làm sao một transistor NHỚ ĐƯỢC khi đã cắt điện. Ô (a) là một <strong>transistor MOS bình thường</strong>: Control Gate ở trên, N+ Drain và N+ Source trong nền P. Ô (b) và (c) thêm vào đúng một thứ làm đổi tất cả — một <strong>CỔNG NỔI (Floating Gate)</strong> kẹp giữa cổng điều khiển và kênh dẫn, bị lớp cách điện bọc kín tứ bề.</p>
<table>
<tr><th>Ô</th><th>Vẽ gì</th><th>Trạng thái</th></tr>
<tr><td><strong>(a) Transistor structure</strong></td><td>Control Gate, N+ Drain, N+ Source, nền P. KHÔNG có cổng nổi.</td><td>Một công tắc thường — không nhớ gì cả</td></tr>
<tr><td><strong>(b) Flash memory cell in one state</strong></td><td>Có cổng nổi và nó <strong>RỖNG</strong> (không vẽ điện tích nào trên đó)</td><td><strong>Logic 1</strong> — trạng thái ĐÃ XOÁ</td></tr>
<tr><td><strong>(c) Flash memory cell in zero state</strong></td><td>Một hàng dấu <strong>+</strong> phía trên cổng điều khiển, một hàng dấu <strong>−</strong> (electron) bị nhốt trên cổng nổi</td><td><strong>Logic 0</strong> — trạng thái ĐÃ GHI</td></tr>
</table>
<ul>
<li><strong>Vì sao gọi là "nổi".</strong> Cổng này bị ô-xít cách điện bao quanh mọi phía — nó không nối vào đâu cả. Electron đã đưa vào đó thì không có đường nào ra, nên chúng nằm lại nhiều năm <em>mà không cần điện</em>. Đúng một sự thật ấy là toàn bộ tính "không mất dữ liệu"; không pin, không làm tươi, khác hẳn DRAM.</li>
<li><strong>Một bit được GHI ra sao (ô c).</strong> Một điện áp dương mạnh đặt lên cổng điều khiển (hàng dấu <strong>+</strong> trong hình) kéo electron từ kênh dẫn xuyên qua lớp ô-xít mỏng lên cổng nổi — bằng phun hạt nóng hoặc xuyên hầm Fowler–Nordheim. Khi đã bị nhốt, đám electron đó triệt tiêu bớt mọi điện áp cổng về sau.</li>
<li><strong>Một bit được ĐỌC ra sao.</strong> Đặt một điện áp vừa phải lên cổng điều khiển rồi xem transistor có dẫn không. Cổng nổi rỗng ⇒ nó bật ⇒ đọc là <strong>1</strong>. Cổng nổi có điện tích ⇒ đám electron bị nhốt nâng ngưỡng lên nên nó vẫn tắt ⇒ đọc là <strong>0</strong>. Đọc chỉ là hỏi "ở điện áp này mày có bật không?".</li>
<li><strong>Vì sao XOÁ phải theo cả khối (đây là lời giải cho slide 34).</strong> Lôi electron <em>RA KHỎI</em> cổng nổi cần một điện trường ngược rất lớn đặt vào nền, mà cái nền đó dùng chung cho cả một khối ô nhớ. Về mặt vật lý bạn KHÔNG thể nhắm nó vào đúng một byte. Do đó mới "xoá trong một chớp" — và do đó mới có cả cái FTL của Chương 7.</li>
<li><strong>Vì sao HAO MÒN là không tránh được.</strong> Mỗi lần ghi/xoá đều lùa electron <em>XUYÊN QUA</em> lớp ô-xít mỏng. Mỗi chuyến đi làm nó hư hại một chút; tới lúc nào đó điện tích rò ra hoặc kẹt lại và ô nhớ không giữ được mức tin cậy nữa. Đó là nguồn gốc VẬT LÝ của giới hạn số chu kỳ — không phải một chính sách firmware, mà là một sự thật về vật liệu.</li>
</ul>
<p class="dap-an">✅ Phần mở rộng mà hình ngụ ý nhưng không vẽ: nếu ĐO ĐƯỢC <em>BAO NHIÊU</em> điện tích đang nằm trên cổng nổi thay vì chỉ "có / không", thì một ô chứa được nhiều hơn một bit. <strong>SLC</strong> = 2 mức = 1 bit, <strong>MLC</strong> = 4 mức = 2 bit, <strong>TLC</strong> = 8 mức = 3 bit, <strong>QLC</strong> = 16 mức = 4 bit. Dung lượng ×4, nhưng các cửa sổ điện áp hẹp lại 8 lần, nên độ bền và khả năng giữ dữ liệu sụp đổ — chính xác là lý do một SSD QLC rẻ mòn nhanh hơn một SSD SLC đắt.</p>
<p class="meo">💡 Hình dung: cổng nổi là một cái lọ bịt kín nằm giữa bức tường. Đẩy electron vào phải dùng sức (ghi); trút hết ra thì phải RUNG CẢ BỨC TƯỜNG (xoá khối); còn nhìn xem lọ đầy hay rỗng thì dễ và vô hại (đọc). Mỗi cú đẩy và mỗi cú rung đều làm cái lọ nứt thêm một tí.</p>
<p class="pitfall">⚠️ Chiều cực tính hay làm người ta vấp: trạng thái <strong>ĐÃ XOÁ</strong> (cổng nổi rỗng) là logic <strong>1</strong>, và ghi là đẩy bit xuống <strong>0</strong>. Nên flash đổi 1→0 thoải mái nhưng 0→1 thì chỉ bằng cách xoá NGUYÊN KHỐI. Đề hỏi "vì sao flash không ghi đè tại chỗ được?" thì câu vừa rồi là đáp án trọn vẹn.</p>`],

      [36, 'Figure 6.18 — Flash Memory Structures (NOR versus NAND)',
        `<p class="y-chinh">🎯 The same cell, wired two ways, producing two products with almost opposite uses. In <strong>(a) NOR</strong> each cell hangs directly between the bit line and ground — cells sit in <em>parallel</em>. In <strong>(b) NAND</strong> the cells are chained in <em>series</em> along one string, with a ground select transistor at one end and a bit-line select transistor at the other.</p>
<table>
<tr><th></th><th>(a) NOR flash</th><th>(b) NAND flash</th></tr>
<tr><td><strong>Wiring (from the figure)</strong></td><td>Each memory cell has its own connection to the bit line and its own ground — word lines 0–5 shown in independent pairs</td><td>Word lines 0–7 form one <em>series string</em>, with a ground select transistor and a bit-line select transistor at the ends</td></tr>
<tr><td><strong>Contacts per cell</strong></td><td>Many — every cell needs its own contact ⇒ big cell</td><td>Shared along the string ⇒ much smaller cell</td></tr>
<tr><td><strong>Random read</strong></td><td><strong>Fast and truly random</strong> — you can address one byte</td><td>Slow — you must read out a whole page</td></tr>
<tr><td><strong>Density &amp; cost/bit</strong></td><td>Low density, expensive</td><td><strong>High density, cheap</strong></td></tr>
<tr><td><strong>Typical use</strong></td><td>Code storage: BIOS/UEFI, firmware you execute in place (XIP)</td><td>File storage: SSD, SD card, USB stick, phone storage</td></tr>
</table>
<ul>
<li><strong>Series versus parallel is the entire difference.</strong> Reading a NAND cell means driving all the <em>other</em> cells in the string fully on so that the string's conductivity depends only on the one you care about. That works, but it means you cannot read a single cell in isolation, and you pay in access time — in exchange for not needing a contact per cell, which is what makes NAND four or more times denser.</li>
<li><strong>"Execute in place" is why NOR still exists.</strong> A CPU coming out of reset must fetch its first instruction directly from memory — there is no software yet to manage pages. NOR supports true random access, so the processor can execute straight out of it. NAND cannot do that, which is why an embedded device typically has a small NOR chip for boot and a large NAND for data.</li>
<li><strong>Look at the figure's word-line counts.</strong> NOR is drawn with word lines 0–5 in independent groups; NAND is drawn as a single string of word lines 0–7 between two select transistors. That "0 to 7" is not decoration — string length (32, 64, 128 cells) is exactly the knob that trades density against read speed.</li>
<li><strong>Where the names come from.</strong> The parallel arrangement behaves like a NOR gate on the bit line (any conducting cell pulls it down); the series string behaves like a NAND gate (the line conducts only if <em>all</em> cells conduct). The names are literal circuit descriptions, not marketing.</li>
<li><strong>Modern twist worth one line.</strong> Planar NAND hit its shrink limit around 2013; the industry went vertical — <strong>3D NAND</strong> stacks the string upright with 100+ layers. The figure still describes it correctly: it is the same series string, just standing up instead of lying down.</li>
</ul>
<p class="dap-an">✅ One-line answer for the classic exam question "NOR or NAND — which and why?": <strong>NOR for code you execute (fast random read, byte addressable, small capacity); NAND for data you store (high density, cheap per bit, page/block access).</strong> Your laptop contains both — NOR holds the UEFI firmware, NAND holds the SSD.</p>
<p class="meo">💡 Remember via the gates: <strong>NOR = paraNOllel</strong> (cells side by side, each reachable) and <strong>NAND = chAiNeD</strong> (cells in a chain, reached as a group). If the question mentions booting or firmware → NOR. If it mentions storage, SSD, camera cards or phones → NAND.</p>
<p class="pitfall">⚠️ Both are flash and both erase by block — NOR is <em>not</em> byte-erasable just because it is byte-<em>readable</em>. Keep the three granularities of slide 34 separate: read, program, erase.</p>`,
        `<p class="y-chinh">🎯 Cùng một ô nhớ, đấu dây hai kiểu, ra hai sản phẩm có công dụng gần như trái ngược. Ở <strong>(a) NOR</strong>, mỗi ô nối thẳng giữa bit line và đất — các ô mắc <em>SONG SONG</em>. Ở <strong>(b) NAND</strong>, các ô xâu chuỗi <em>NỐI TIẾP</em> thành một xâu, một đầu có transistor chọn đất, đầu kia có transistor chọn bit line.</p>
<table>
<tr><th></th><th>(a) NOR flash</th><th>(b) NAND flash</th></tr>
<tr><td><strong>Đấu dây (theo hình)</strong></td><td>Mỗi ô nhớ có đường nối riêng lên bit line và có đất riêng — word line 0–5 vẽ thành từng cặp độc lập</td><td>Word line 0–7 tạo thành một <em>XÂU NỐI TIẾP</em>, hai đầu là transistor chọn đất và transistor chọn bit line</td></tr>
<tr><td><strong>Số tiếp điểm mỗi ô</strong></td><td>Nhiều — ô nào cũng cần tiếp điểm riêng ⇒ ô TO</td><td>Dùng chung dọc xâu ⇒ ô NHỎ hơn hẳn</td></tr>
<tr><td><strong>Đọc ngẫu nhiên</strong></td><td><strong>Nhanh và ngẫu nhiên THẬT</strong> — địa chỉ tới từng byte</td><td>Chậm — phải đọc ra nguyên một trang</td></tr>
<tr><td><strong>Mật độ &amp; giá mỗi bit</strong></td><td>Mật độ thấp, đắt</td><td><strong>Mật độ cao, rẻ</strong></td></tr>
<tr><td><strong>Dùng điển hình</strong></td><td>Chứa MÃ: BIOS/UEFI, firmware chạy trực tiếp tại chỗ (XIP)</td><td>Chứa DỮ LIỆU: SSD, thẻ SD, USB, bộ nhớ điện thoại</td></tr>
</table>
<ul>
<li><strong>Nối tiếp so với song song chính là TOÀN BỘ khác biệt.</strong> Đọc một ô NAND nghĩa là phải bật hết những ô <em>KHÁC</em> trong xâu lên hoàn toàn, để độ dẫn của cả xâu chỉ còn phụ thuộc vào đúng cái ô ta quan tâm. Cách đó chạy được, nhưng nó khiến bạn không đọc nổi một ô riêng lẻ, và bạn trả giá bằng thời gian truy cập — đổi lại là không cần tiếp điểm cho từng ô, và đó là thứ làm NAND đặc gấp bốn lần trở lên.</li>
<li><strong>"Chạy tại chỗ" (XIP) là lý do NOR vẫn còn sống.</strong> Một CPU vừa reset phải nạp lệnh đầu tiên THẲNG từ bộ nhớ — chưa có phần mềm nào để quản lý trang cả. NOR hỗ trợ truy cập ngẫu nhiên thật, nên bộ xử lý chạy thẳng từ đó được. NAND thì không, và vì thế một thiết bị nhúng thường có một chip NOR nhỏ để khởi động cộng một NAND lớn để chứa dữ liệu.</li>
<li><strong>Nhìn số word line trên hình.</strong> NOR vẽ word line 0–5 thành các nhóm độc lập; NAND vẽ một xâu duy nhất word line 0–7 kẹp giữa hai transistor chọn. Con số "0 tới 7" ấy không phải trang trí — độ dài xâu (32, 64, 128 ô) đúng là cái núm vặn đánh đổi mật độ lấy tốc độ đọc.</li>
<li><strong>Tên gọi từ đâu ra.</strong> Cách mắc song song hành xử như một cổng NOR trên bit line (bất kỳ ô nào dẫn cũng kéo nó xuống); xâu nối tiếp hành xử như một cổng NAND (đường chỉ dẫn khi <em>TẤT CẢ</em> các ô đều dẫn). Tên là mô tả mạch theo nghĩa đen, không phải tiếp thị.</li>
<li><strong>Diễn biến hiện đại, đáng một dòng.</strong> NAND phẳng chạm giới hạn thu nhỏ khoảng 2013; ngành chuyển sang chiều đứng — <strong>3D NAND</strong> dựng xâu nhớ thẳng đứng với 100+ lớp. Hình này vẫn mô tả đúng: vẫn đúng cái xâu nối tiếp ấy, chỉ là ĐỨNG LÊN thay vì nằm.</li>
</ul>
<p class="dap-an">✅ Một dòng trả lời cho câu hỏi kinh điển "NOR hay NAND — chọn cái nào, vì sao?": <strong>NOR cho MÃ đem chạy (đọc ngẫu nhiên nhanh, địa chỉ tới byte, dung lượng nhỏ); NAND cho DỮ LIỆU đem chứa (mật độ cao, rẻ mỗi bit, truy cập theo trang/khối).</strong> Laptop của bạn có CẢ HAI — NOR giữ firmware UEFI, NAND làm ổ SSD.</p>
<p class="meo">💡 Nhớ qua chính tên cổng logic: <strong>NOR = song song</strong> (các ô nằm cạnh nhau, với tới từng cái) và <strong>NAND = xâu chuỗi</strong> (các ô nối thành dây, với tới theo cả nhóm). Đề nhắc khởi động hay firmware → NOR. Đề nhắc lưu trữ, SSD, thẻ máy ảnh, điện thoại → NAND.</p>
<p class="pitfall">⚠️ Cả hai đều là flash và cả hai đều XOÁ THEO KHỐI — NOR <em>KHÔNG</em> xoá được theo byte chỉ vì nó ĐỌC được theo byte. Giữ nguyên ba độ mịn của slide 34 cho tách bạch: đọc, ghi, xoá.</p>`],

      [37, 'Figure 6.19 — Kiviat Graphs for Flash Memory (NOR and NAND on eight axes)',
        `<p class="y-chinh">🎯 Two radar ("Kiviat") charts on the <em>same</em> eight axes, so the shapes can be compared directly. The eight axes are <strong>cost per bit, file storage use, code execution, capacity, write speed, read speed, active power, standby power</strong>. Read the <em>shape</em>, not individual points: NOR draws a spiky four-pointed star, NAND draws a fat blob.</p>
<ul>
<li><strong>How to read a Kiviat graph at all.</strong> Each spoke is one metric, and on every spoke the good end is <em>outward</em> — the labels on this figure say so explicitly (cost per bit: "Low" outward; capacity: "High" outward; code execution: "Easy" outward, "Hard" inward). So <strong>bigger shaded area = better overall</strong>, and a spike means "excellent at this one thing".</li>
<li><strong>NOR's shape: a narrow star with two long spikes.</strong> It reaches far out on <strong>code execution</strong> (easy — the XIP property of slide 36) and on <strong>read speed</strong> and <strong>standby power</strong>, and pulls in sharply on <strong>capacity</strong>, <strong>file storage use</strong>, <strong>write speed</strong> and <strong>cost per bit</strong>. That is a specialist: brilliant at the boot-firmware job, poor at everything else.</li>
<li><strong>NAND's shape: a broad, nearly filled polygon.</strong> Far out on <strong>capacity</strong>, <strong>file storage use</strong>, <strong>cost per bit</strong> (low) and <strong>write speed</strong>; pulled in only on <strong>code execution</strong> (hard) and <strong>read speed</strong>. That is a generalist for storage — and its one weak spoke is precisely the one NOR spikes on.</li>
<li><strong>The two charts are complementary, which is the point.</strong> Overlay them mentally and they cover the whole octagon between them. That is why real systems ship both chips, and why the figure is drawn as a pair rather than one chart with two overlays.</li>
<li><strong>Why NAND wins on write speed despite erase being slow.</strong> Erase is per block and amortised across a whole page of writes; the page program itself pushes many cells in parallel. NOR programs a word at a time. So for bulk writing — a photo, a file — NAND is far faster, even though a single byte update is worse.</li>
</ul>
<p class="dap-an">✅ How to use this in an exam: if you are asked to justify a choice, name the <strong>axis</strong>. "A phone stores photos ⇒ the deciding axes are capacity and cost per bit ⇒ NAND." "A microcontroller must boot from its memory ⇒ the deciding axis is code execution ⇒ NOR." The Kiviat graph exists to force that habit of naming the criterion instead of saying "NAND is better".</p>
<p class="meo">💡 One-picture summary: <strong>NOR is a star, NAND is a blob.</strong> A star is spiky — great at one or two things. A blob covers ground — good at most things. That is exactly the difference between a boot ROM and a storage device.</p>
<p class="pitfall">⚠️ Beware the reversed axes. On the "cost per bit" spoke, outward is labelled <strong>Low</strong>, and on "code execution" outward is <strong>Easy</strong>. A chart like this is easy to misread as "NAND costs more" when it actually says the opposite. Always check which end of each spoke is the good end before you interpret the area — the same warning applies to every radar chart you will ever see in a datasheet.</p>`,
        `<p class="y-chinh">🎯 Hai biểu đồ radar ("Kiviat") trên <em>CÙNG</em> tám trục, để so được hình dạng với nhau trực tiếp. Tám trục là <strong>giá mỗi bit, dùng làm bộ nhớ tệp, chạy mã lệnh, dung lượng, tốc độ ghi, tốc độ đọc, công suất hoạt động, công suất chờ</strong>. Hãy đọc <em>HÌNH DẠNG</em>, đừng đọc từng điểm: NOR vẽ ra một ngôi sao gai bốn cánh, NAND vẽ ra một khối bè bè.</p>
<ul>
<li><strong>Đọc một biểu đồ Kiviat thế nào cho đúng.</strong> Mỗi nan là một tiêu chí, và trên MỌI nan thì đầu TỐT nằm ở phía <em>NGOÀI</em> — nhãn trên chính hình này nói rõ như vậy (giá mỗi bit: "Low" ở ngoài; dung lượng: "High" ở ngoài; chạy mã: "Easy" ở ngoài, "Hard" ở trong). Nên <strong>diện tích tô càng lớn = càng tốt về tổng thể</strong>, còn một cái gai nghĩa là "xuất sắc ở đúng một thứ".</li>
<li><strong>Hình của NOR: một ngôi sao hẹp với vài cánh dài.</strong> Nó vươn xa trên trục <strong>chạy mã lệnh</strong> (dễ — chính là tính XIP ở slide 36), trên <strong>tốc độ đọc</strong> và <strong>công suất chờ</strong>, rồi co tọt vào trên <strong>dung lượng</strong>, <strong>dùng làm bộ nhớ tệp</strong>, <strong>tốc độ ghi</strong> và <strong>giá mỗi bit</strong>. Đó là một chuyên gia hẹp: xuất sắc ở việc giữ firmware khởi động, tệ ở mọi việc khác.</li>
<li><strong>Hình của NAND: một đa giác rộng, gần như lấp đầy.</strong> Vươn xa trên <strong>dung lượng</strong>, <strong>dùng làm bộ nhớ tệp</strong>, <strong>giá mỗi bit</strong> (thấp) và <strong>tốc độ ghi</strong>; chỉ co lại ở <strong>chạy mã lệnh</strong> (khó) và <strong>tốc độ đọc</strong>. Đó là một tay tổng hợp cho lưu trữ — và cái nan yếu duy nhất của nó lại chính là cái nan NOR mọc gai.</li>
<li><strong>Hai biểu đồ BÙ TRỪ cho nhau, đó mới là thông điệp.</strong> Chồng chúng lên nhau trong đầu thì hai cái phủ kín cả hình tám cạnh. Vì thế hệ thống thật đem theo CẢ HAI loại chip, và vì thế hình được vẽ thành một CẶP chứ không phải một biểu đồ chồng hai lớp.</li>
<li><strong>Vì sao NAND thắng về tốc độ GHI dù xoá thì chậm.</strong> Xoá tính theo khối và được chia đều cho cả một trang ghi; còn bản thân việc ghi một trang thì đẩy rất nhiều ô song song. NOR ghi mỗi lần một từ. Nên với việc ghi khối lượng lớn — một tấm ảnh, một tệp — NAND nhanh hơn hẳn, dù cập nhật đúng một byte thì lại tệ hơn.</li>
</ul>
<p class="dap-an">✅ Dùng nó trong phòng thi thế nào: nếu đề bắt biện minh cho một lựa chọn, hãy GỌI TÊN <strong>CÁI TRỤC</strong>. "Điện thoại chứa ảnh ⇒ trục quyết định là dung lượng và giá mỗi bit ⇒ NAND." "Vi điều khiển phải khởi động ngay từ bộ nhớ của nó ⇒ trục quyết định là chạy mã lệnh ⇒ NOR." Biểu đồ Kiviat tồn tại để ép cho quen thói gọi tên TIÊU CHÍ thay vì nói suông "NAND tốt hơn".</p>
<p class="meo">💡 Tóm bằng một hình: <strong>NOR là NGÔI SAO, NAND là KHỐI BÈ.</strong> Ngôi sao thì có gai — giỏi đúng một hai thứ. Khối bè thì phủ rộng — khá ở phần lớn mọi thứ. Đó đúng là khác biệt giữa một ROM khởi động và một thiết bị lưu trữ.</p>
<p class="pitfall">⚠️ Cẩn thận với các trục ĐẢO CHIỀU. Trên nan "giá mỗi bit", phía ngoài ghi là <strong>Low</strong>, và trên nan "chạy mã lệnh", phía ngoài là <strong>Easy</strong>. Một biểu đồ kiểu này rất dễ bị đọc nhầm thành "NAND đắt hơn" trong khi nó nói ngược lại. Luôn kiểm xem đầu nào của mỗi nan mới là đầu TỐT trước khi diễn giải diện tích — cảnh báo này đúng cho mọi biểu đồ radar bạn sẽ gặp trong bất kỳ tờ datasheet nào.</p>`],

      [38, 'Figure 6.20 — Nonvolatile RAM within the Memory Hierarchy',
        `<p class="y-chinh">🎯 The familiar pyramid from Chapter 4, redrawn with three dotted brackets on its right side. From top to bottom the pyramid reads <strong>SRAM · DRAM · NAND FLASH · HARD DISK</strong>; the arrows on the left say "increasing performance and endurance" upward and "decreasing cost per bit, increasing capacity or density" downward. The brackets show <strong>which existing levels each new technology could replace</strong>.</p>
<table>
<tr><th>Technology</th><th>Bracket spans</th><th>The claim being made</th></tr>
<tr><td><strong>STT-RAM</strong></td><td>The SRAM level and the band just below it</td><td>Fast and endurant enough to be used as <em>cache</em> — competing with SRAM, with the bonus of nonvolatility</td></tr>
<tr><td><strong>PCRAM</strong></td><td>DRAM and NAND FLASH together</td><td>Sits in the gap between main memory and storage — the "storage-class memory" idea</td></tr>
<tr><td><strong>ReRAM</strong></td><td>The bottom band and HARD DISK</td><td>Aimed at bulk storage: the densest and cheapest of the three</td></tr>
</table>
<ul>
<li><strong>Read the figure as a claim, not a fact.</strong> It says these technologies <em>could</em> occupy those slots — not that they have. Only one ever shipped at scale in a product a student could buy (Intel/Micron Optane, a PCRAM relative), and Intel discontinued it in 2022. Keep that honesty; the figure is from a 2022 textbook and is aspirational.</li>
<li><strong>Why anybody wants this at all: the gap.</strong> Between DRAM (~10<sup>-8</sup> s, volatile, expensive) and NAND (~10<sup>-4</sup> s, nonvolatile, cheap) there is a gap of four orders of magnitude with nothing in it. Every one of these technologies is an attempt to fill it. The name for the class is <strong>storage-class memory</strong> or <strong>persistent memory</strong>.</li>
<li><strong>What nonvolatility at the DRAM level would actually change.</strong> No boot time (memory contents survive power off). No separate "save" step — data structures persist in place. No refresh power, which is a real fraction of a datacentre's idle draw. This is not a small speed tweak; it would delete the distinction between "memory" and "storage" that this entire course is built on.</li>
<li><strong>Why the two arrows on the left matter.</strong> Note the left arrow says performance <em>and</em> <strong>endurance</strong> increase upward. Endurance is the killer: DRAM survives essentially unlimited writes, NAND a few thousand. Anything aiming at the DRAM slot must survive years of write traffic, and that — not speed — is what has kept these technologies below the line.</li>
<li><strong>Connect to Chapter 4 and Chapter 7.</strong> Chapter 4 justified the pyramid by the three-way trade-off of capacity, speed and cost. This figure adds a fourth axis — <em>volatility</em> — and shows the pyramid is not fixed. Chapter 7 (External Memory) then takes the bottom two levels as its subject.</li>
</ul>
<p class="dap-an">✅ Exam-safe summary: <strong>STT-RAM targets cache (SRAM), PCRAM targets the DRAM/flash gap, ReRAM targets bulk storage (disk).</strong> Order them by speed as STT-RAM &gt; PCRAM &gt; ReRAM and by density in the opposite order, and you have said everything the figure says.</p>
<p class="meo">💡 Memory hook via the pyramid: the three brackets are stacked top, middle, bottom — and so are the three names in alphabetical-ish descending speed order <strong>S</strong>TT · <strong>P</strong>C · <strong>R</strong>e. Top-middle-bottom, fast-medium-dense.</p>
<p class="pitfall">⚠️ Do not say "these will replace DRAM and flash". Nothing here has replaced anything after fifteen years of trying. The examinable content is <em>which slot each targets and why</em>, plus the one sentence that explains the whole figure: <strong>all three are nonvolatile RAM — randomly addressable like RAM, but they keep their contents with the power off.</strong></p>`,
        `<p class="y-chinh">🎯 Chính cái kim tự tháp quen thuộc từ Chương 4, vẽ lại kèm ba dấu ngoặc chấm chấm ở sườn phải. Từ trên xuống, tháp ghi <strong>SRAM · DRAM · NAND FLASH · HARD DISK</strong>; mũi tên bên trái nói "hiệu năng và ĐỘ BỀN tăng dần" hướng lên, "giá mỗi bit giảm, dung lượng hoặc mật độ tăng" hướng xuống. Ba dấu ngoặc cho biết <strong>mỗi công nghệ mới có thể thay được những mức nào đang có</strong>.</p>
<table>
<tr><th>Công nghệ</th><th>Dấu ngoặc bao tới đâu</th><th>Tuyên bố đang được đưa ra</th></tr>
<tr><td><strong>STT-RAM</strong></td><td>Mức SRAM và dải ngay dưới nó</td><td>Đủ nhanh và đủ bền để làm <em>CACHE</em> — cạnh tranh với SRAM, lại thêm món quà không mất dữ liệu</td></tr>
<tr><td><strong>PCRAM</strong></td><td>DRAM và NAND FLASH gộp lại</td><td>Nằm đúng khe hở giữa bộ nhớ chính và lưu trữ — ý tưởng "bộ nhớ cấp lưu trữ"</td></tr>
<tr><td><strong>ReRAM</strong></td><td>Dải đáy và HARD DISK</td><td>Nhắm vào lưu trữ khối lượng lớn: đặc nhất và rẻ nhất trong ba</td></tr>
</table>
<ul>
<li><strong>Đọc hình này như một TUYÊN BỐ, không phải một sự thật.</strong> Nó nói các công nghệ ấy <em>CÓ THỂ</em> chiếm những chỗ đó — không nói chúng đã chiếm. Chỉ đúng một thứ từng bán ra quy mô lớn trong sản phẩm sinh viên mua được (Intel/Micron Optane, họ hàng của PCRAM), và Intel đã khai tử nó năm 2022. Cứ giữ sự trung thực đó; hình lấy từ một giáo trình 2022 và mang tính KỲ VỌNG.</li>
<li><strong>Vì sao người ta muốn thứ này: CÁI KHE HỞ.</strong> Giữa DRAM (~10<sup>-8</sup> s, mất dữ liệu, đắt) và NAND (~10<sup>-4</sup> s, không mất dữ liệu, rẻ) có một khe hở bốn bậc độ lớn mà chẳng có gì nằm trong đó. Mỗi công nghệ ở đây đều là một nỗ lực lấp khe ấy. Tên gọi của cả lớp này là <strong>storage-class memory</strong> hay <strong>persistent memory</strong> (bộ nhớ bền).</li>
<li><strong>Không mất dữ liệu ở NGAY MỨC DRAM thì đổi được gì.</strong> Không còn thời gian khởi động (nội dung bộ nhớ sống sót qua lần cắt điện). Không còn bước "lưu" riêng — cấu trúc dữ liệu tồn tại tại chỗ. Không còn điện làm tươi, vốn chiếm một phần thật sự trong mức tiêu thụ nhàn rỗi của một trung tâm dữ liệu. Đây không phải một cú tinh chỉnh tốc độ; nó sẽ XOÁ ranh giới "bộ nhớ" và "lưu trữ" mà cả môn học này dựng lên trên đó.</li>
<li><strong>Vì sao hai mũi tên bên trái đáng để ý.</strong> Mũi tên trái nói hiệu năng <em>VÀ</em> <strong>ĐỘ BỀN</strong> cùng tăng khi đi lên. Độ bền mới là kẻ giết người: DRAM chịu được số lần ghi gần như vô hạn, NAND chỉ vài nghìn. Thứ nào nhắm vào chỗ của DRAM thì phải sống sót qua nhiều năm luồng ghi, và ĐÓ — chứ không phải tốc độ — mới là thứ giữ những công nghệ này ở dưới vạch.</li>
<li><strong>Nối về Chương 4 và Chương 7.</strong> Chương 4 biện minh cho kim tự tháp bằng đánh đổi ba chiều dung lượng, tốc độ, giá. Hình này thêm một trục thứ tư — <em>TÍNH MẤT DỮ LIỆU</em> — và cho thấy kim tự tháp không bất biến. Rồi Chương 7 (Bộ nhớ ngoài) lấy hai mức đáy làm chủ đề.</li>
</ul>
<p class="dap-an">✅ Tóm tắt an toàn để đi thi: <strong>STT-RAM nhắm cache (SRAM), PCRAM nhắm khe hở DRAM/flash, ReRAM nhắm lưu trữ khối lượng lớn (đĩa).</strong> Xếp theo tốc độ là STT-RAM &gt; PCRAM &gt; ReRAM và theo mật độ thì ngược lại, thế là bạn đã nói hết những gì hình này nói.</p>
<p class="meo">💡 Mẹo nhớ theo chính kim tự tháp: ba dấu ngoặc xếp trên–giữa–dưới, và ba cái tên cũng xếp theo thứ tự tốc độ giảm dần <strong>S</strong>TT · <strong>P</strong>C · <strong>R</strong>e. Trên–giữa–dưới, nhanh–vừa–đặc.</p>
<p class="pitfall">⚠️ Đừng nói "những thứ này SẼ thay thế DRAM và flash". Sau mười lăm năm cố gắng, chưa cái nào thay được cái gì. Phần đi thi được là <em>MỖI CÁI NHẮM VÀO CHỖ NÀO VÀ VÌ SAO</em>, cộng một câu giải thích cả hình: <strong>cả ba đều là RAM KHÔNG MẤT DỮ LIỆU — địa chỉ ngẫu nhiên được như RAM, nhưng giữ nguyên nội dung khi cắt điện.</strong></p>`],

      [39, 'Figure 6.21 — Nonvolatile RAM Technologies (STT-RAM, PCRAM, ReRAM cross-sections)',
        `<p class="y-chinh">🎯 Three pairs of cross-sections, one pair per technology, each pair showing the cell storing <strong>a 0</strong> and the cell storing <strong>a 1</strong>. The unifying idea: all three store a bit as a <strong>difference in electrical resistance</strong> of a physical structure — which is why nothing leaks away when the power stops.</p>
<table>
<tr><th>Technology</th><th>What the figure draws</th><th>What physically changes</th><th>How the bit is read</th></tr>
<tr><td><strong>(a) STT-RAM</strong> — <em>Spin-Transfer Torque RAM</em></td><td>Bit line · <strong>Free layer</strong> (perpendicular magnetic layer) · interface layer · <strong>insulating layer</strong> · interface layer · <strong>Reference layer</strong> (perpendicular magnetic layer) · Base electrode. Arrows show "direction of magnetization"; an "electric current" arrow sets it</td><td>The <em>direction of magnetization</em> of the free layer: parallel to the reference layer = binary 1, anti-parallel = binary 0</td><td>Parallel ⇒ low resistance; anti-parallel ⇒ high resistance</td></tr>
<tr><td><strong>(b) PCRAM</strong> — <em>Phase-Change RAM</em></td><td>Top electrode · <strong>polycrystalline chalcogenide</strong> · <strong>heater</strong> · insulator · bottom electrode. The second drawing adds a dome of <strong>amorphous chalcogenide</strong> over the heater</td><td>The <em>phase</em> of a chalcogenide glass: crystalline (ordered) versus amorphous (disordered), switched by heating it with the resistive heater</td><td>Crystalline ⇒ low resistance; amorphous ⇒ high resistance</td></tr>
<tr><td><strong>(c) ReRAM</strong> — <em>Resistive RAM</em></td><td>Top electrode · insulator with a <strong>filament</strong> through it · <strong>metal oxide</strong> · bottom electrode. Labels: "Reduction: low resistance" versus "Oxidation: high resistance"</td><td>A conductive <em>filament</em> of oxygen vacancies is grown (reduction) or broken (oxidation) through a metal-oxide layer</td><td>Filament intact ⇒ low resistance; filament broken ⇒ high resistance</td></tr>
</table>
<ul>
<li><strong>The pattern to memorise is one sentence.</strong> Every one of the three is a <strong>resistive</strong> memory: writing means changing a physical state (magnetisation · crystal phase · a filament), reading means measuring resistance. Contrast that with DRAM (charge on a capacitor, leaks) and flash (charge on a floating gate, damages the oxide). No stored charge means no refresh and no volatility.</li>
<li><strong>STT-RAM's structure has a name you should recognise.</strong> Two magnetic layers separated by a thin insulator is a <strong>magnetic tunnel junction</strong>. One layer is pinned ("reference"), the other is switchable ("free"). Passing a spin-polarised current through it torques the free layer — that is the "spin-transfer torque" in the name. Fast and essentially unlimited endurance, but the cell is large, which is why the figure on slide 38 aimed it at cache, not storage.</li>
<li><strong>PCRAM is the one that actually reached the market.</strong> Chalcogenide is the same class of material used in rewritable CDs and DVDs — the write mechanism really is "melt it and cool it fast to freeze it disordered, or cool it slowly to let it crystallise". Note the <em>heater</em> block in the figure: writing costs real energy because you are locally melting a material, and that energy is PCRAM's main weakness.</li>
<li><strong>ReRAM is the simplest structure and the densest.</strong> Two electrodes and a metal oxide — that is it. Simple enough to stack in a crosspoint array and in 3D layers, which is why slide 38 put it at the bottom of the pyramid. The trade-off is that filament formation is a <em>stochastic</em> process, so cell-to-cell variability is its hard problem.</li>
<li><strong>Read the two drawings per technology as "write 0" and "write 1".</strong> In every pair, the difference between the left and right picture <em>is</em> the stored bit made visible: an arrow flipped, a dome of amorphous material appeared, a filament broke. That is a good thing to be able to describe in one sentence per technology in an exam.</li>
</ul>
<p class="dap-an">✅ Three-word summary to carry into the exam: <strong>STT-RAM = magnetism · PCRAM = phase (heat) · ReRAM = filament (chemistry).</strong> All three: resistance is the bit, nonvolatile, byte-addressable. Order by speed STT &gt; PC &gt; Re; order by density Re &gt; PC &gt; STT — matching the three brackets on slide 38 exactly.</p>
<p class="meo">💡 Link each name to its mechanism and you never mix them up: <strong>ST</strong>T has <strong>S</strong>pin (magnets), <strong>PC</strong> is <strong>P</strong>hase <strong>C</strong>hange (heat), <strong>Re</strong> is <strong>Re</strong>sistive via a <strong>Re</strong>dox reaction (the figure literally labels the two states "Reduction" and "Oxidation").</p>
<p class="pitfall">⚠️ Two traps. First, none of these is "MRAM versus STT-RAM" — STT-RAM <em>is</em> a kind of MRAM, the kind that switches with current instead of a magnetic field. Second, do not describe PCRAM as "melting on every read": reading applies a <em>small</em> current that measures resistance without disturbing the phase. Only writing heats. Mixing up the read and write mechanisms is the usual way these questions are lost.</p>`,
        `<p class="y-chinh">🎯 Ba cặp lát cắt ngang, mỗi công nghệ một cặp, và mỗi cặp cho thấy ô nhớ đang chứa <strong>số 0</strong> và ô nhớ đang chứa <strong>số 1</strong>. Ý tưởng xuyên suốt: cả ba đều lưu một bit dưới dạng <strong>CHÊNH LỆCH ĐIỆN TRỞ</strong> của một cấu trúc vật lý — và vì thế chẳng có gì rò đi khi cắt điện.</p>
<table>
<tr><th>Công nghệ</th><th>Hình vẽ gì</th><th>Cái gì thay đổi về mặt vật lý</th><th>Đọc bit bằng cách nào</th></tr>
<tr><td><strong>(a) STT-RAM</strong> — <em>Spin-Transfer Torque RAM</em></td><td>Bit line · <strong>Free layer</strong> (lớp từ vuông góc) · lớp giao diện · <strong>lớp cách điện</strong> · lớp giao diện · <strong>Reference layer</strong> (lớp từ vuông góc) · điện cực nền. Mũi tên chỉ "hướng từ hoá"; một mũi tên "dòng điện" đặt hướng đó</td><td><em>HƯỚNG TỪ HOÁ</em> của lớp tự do: song song với lớp tham chiếu = nhị phân 1, ngược chiều = nhị phân 0</td><td>Song song ⇒ điện trở THẤP; ngược chiều ⇒ điện trở CAO</td></tr>
<tr><td><strong>(b) PCRAM</strong> — <em>Phase-Change RAM</em></td><td>Điện cực trên · <strong>chalcogenide đa tinh thể</strong> · <strong>bộ đốt (heater)</strong> · cách điện · điện cực dưới. Hình thứ hai thêm một mái vòm <strong>chalcogenide vô định hình</strong> phủ trên bộ đốt</td><td><em>PHA</em> của một loại thuỷ tinh chalcogenide: tinh thể (trật tự) so với vô định hình (hỗn loạn), chuyển bằng cách nung nó bằng bộ đốt điện trở</td><td>Tinh thể ⇒ điện trở THẤP; vô định hình ⇒ điện trở CAO</td></tr>
<tr><td><strong>(c) ReRAM</strong> — <em>Resistive RAM</em></td><td>Điện cực trên · lớp cách điện có một <strong>sợi dẫn (filament)</strong> xuyên qua · <strong>ô-xít kim loại</strong> · điện cực dưới. Nhãn: "Reduction: low resistance" so với "Oxidation: high resistance"</td><td>Một <em>SỢI DẪN</em> gồm các chỗ khuyết ô-xy được mọc ra (khử) hoặc bị đứt (ô-xy hoá) xuyên qua lớp ô-xít kim loại</td><td>Sợi còn nguyên ⇒ điện trở THẤP; sợi đứt ⇒ điện trở CAO</td></tr>
</table>
<ul>
<li><strong>Quy luật cần thuộc gói trong một câu.</strong> Cả ba đều là bộ nhớ <strong>ĐIỆN TRỞ</strong>: ghi là đổi một trạng thái vật lý (từ hoá · pha tinh thể · một sợi dẫn), đọc là đo điện trở. Đối chiếu với DRAM (điện tích trên tụ, bị rò) và flash (điện tích trên cổng nổi, làm hỏng lớp ô-xít). Không lưu điện tích nghĩa là không cần làm tươi và không mất dữ liệu.</li>
<li><strong>Cấu trúc của STT-RAM có một cái tên bạn nên nhận ra.</strong> Hai lớp từ ngăn bởi một lớp cách điện mỏng chính là một <strong>mối nối xuyên hầm từ (magnetic tunnel junction)</strong>. Một lớp bị ghim ("reference"), lớp kia đổi hướng được ("free"). Cho một dòng điện phân cực spin chạy qua sẽ vặn lớp tự do — đó chính là "spin-transfer torque" trong cái tên. Nhanh và độ bền gần như vô hạn, nhưng ô nhớ TO, nên hình ở slide 38 mới nhắm nó vào cache chứ không phải lưu trữ.</li>
<li><strong>PCRAM là cái thật sự đã ra được thị trường.</strong> Chalcogenide đúng là họ vật liệu dùng trong đĩa CD/DVD ghi lại được — cơ chế ghi đúng nghĩa là "nung chảy rồi làm nguội thật nhanh để đông cứng ở dạng hỗn loạn, hoặc làm nguội chậm để nó kết tinh". Để ý khối <em>heater</em> trên hình: ghi tốn năng lượng THẬT vì bạn đang nung chảy vật liệu tại chỗ, và năng lượng đó là điểm yếu chính của PCRAM.</li>
<li><strong>ReRAM có cấu trúc đơn giản nhất và đặc nhất.</strong> Hai điện cực và một lớp ô-xít kim loại — hết. Đơn giản đủ để xếp thành mảng giao điểm (crosspoint) và chồng nhiều lớp 3D, nên slide 38 mới đặt nó ở đáy kim tự tháp. Cái giá là việc hình thành sợi dẫn là một quá trình <em>NGẪU NHIÊN</em>, nên độ sai khác giữa ô với ô là bài toán khó của nó.</li>
<li><strong>Đọc hai hình của mỗi công nghệ như "ghi 0" và "ghi 1".</strong> Ở mỗi cặp, khác biệt giữa hình trái và hình phải <em>CHÍNH LÀ</em> cái bit đang lưu, được vẽ ra cho thấy: một mũi tên lật chiều, một mái vòm vô định hình xuất hiện, một sợi dẫn đứt. Đó là thứ nên nói được thành một câu cho mỗi công nghệ khi vào phòng thi.</li>
</ul>
<p class="dap-an">✅ Tóm ba chữ mang đi thi: <strong>STT-RAM = TỪ TÍNH · PCRAM = PHA (nhiệt) · ReRAM = SỢI DẪN (hoá học).</strong> Cả ba: điện trở chính là bit, không mất dữ liệu, địa chỉ tới từng byte. Xếp theo tốc độ STT &gt; PC &gt; Re; xếp theo mật độ Re &gt; PC &gt; STT — khớp đúng ba dấu ngoặc ở slide 38.</p>
<p class="meo">💡 Gắn mỗi tên với cơ chế của nó là không bao giờ lẫn: <strong>ST</strong>T có <strong>S</strong>pin (nam châm), <strong>PC</strong> là <strong>P</strong>hase <strong>C</strong>hange (nhiệt), <strong>Re</strong> là <strong>Re</strong>sistive qua phản ứng <strong>Re</strong>dox (chính hình ghi rõ hai trạng thái là "Reduction" và "Oxidation").</p>
<p class="pitfall">⚠️ Hai cái bẫy. Một, không có chuyện "MRAM đối đầu STT-RAM" — STT-RAM <em>LÀ</em> một loại MRAM, loại chuyển trạng thái bằng dòng điện thay vì bằng từ trường. Hai, đừng mô tả PCRAM là "nung chảy mỗi lần đọc": đọc chỉ đặt một dòng điện <em>NHỎ</em> để đo điện trở mà không làm xáo pha. Chỉ có GHI mới nung. Lẫn cơ chế đọc với cơ chế ghi là cách quen thuộc để mất điểm ở dạng câu hỏi này.</p>`],

      [40, 'Summary — Chapter 6: Internal Memory',
        `<p class="y-chinh">🎯 The chapter's own contents page, and the best revision checklist you will get. Six headings; if you can say two sentences about each sub-bullet you are ready. Notice what it does <em>not</em> mention — cache mapping, disks, I/O — those belong to Chapters 5 and 7.</p>
<table>
<tr><th>Heading</th><th>Sub-topics on the slide</th><th>Where it was covered</th><th>The one thing to remember</th></tr>
<tr><td><strong>Semiconductor main memory</strong></td><td>Organization · DRAM and SRAM · Types of ROM · Chip logic · Chip packaging · Module organization · Interleaved memory</td><td>slides 2–15</td><td>DRAM = 1 transistor + capacitor, needs refresh, used for main memory. SRAM = flip-flop, faster, used for cache</td></tr>
<tr><td><strong>Error correction</strong></td><td>—</td><td>slides 16–22</td><td>2<sup>k</sup> &gt;= m+k+1; the syndrome <em>is</em> the bit position; SEC-DED corrects one and only detects two</td></tr>
<tr><td><strong>eDRAM</strong></td><td>IBM z13 eDRAM cache structure · Intel core system cache structure</td><td>slides 31–33</td><td>DRAM cells doing a cache job, on-die or in-package: denser than SRAM, faster than off-chip DRAM</td></tr>
<tr><td><strong>DDR DRAM</strong></td><td>Synchronous DRAM · DDR SDRAM</td><td>slides 23–30</td><td>Clock ⇒ predictable latency; both edges ⇒ ×2; prefetch buffer ⇒ everything else. Bandwidth improves, latency does not</td></tr>
<tr><td><strong>Flash memory</strong></td><td>Operation · NOR and NAND flash memory</td><td>slides 34–37</td><td>Floating gate holds charge with no power; read a byte, program a page, <strong>erase a block</strong></td></tr>
<tr><td><strong>Newer nonvolatile solid-state memory technologies</strong></td><td>STT-RAM · PCRAM · ReRAM</td><td>slides 38–39</td><td>All three store a bit as resistance; STT aims at cache, PCRAM at the DRAM/flash gap, ReRAM at storage</td></tr>
</table>
<ul>
<li><strong>The single thread running through all six.</strong> Every topic here is a different answer to one question: <em>how do you store a bit, and what does that choice cost you in speed, density, price and volatility?</em> Capacitor (DRAM) · flip-flop (SRAM) · fuse/mask (ROM) · floating gate (flash) · magnetisation, phase or filament (the new three). Six mechanisms, one trade-off.</li>
<li><strong>Self-test before moving on.</strong> (1) Why does DRAM need refreshing and SRAM not? (2) Compute the check bits for any 8-bit word and locate a planted error. (3) State the three ways DDR goes faster. (4) Convert DDR4-3200 into GB/s. (5) Why can flash not overwrite one byte in place? (6) Which of NOR/NAND boots a device, and why? If any answer is shaky, the slide number is in the table above.</li>
<li><strong>How this chapter connects outward.</strong> <em>Backwards:</em> Ch.4 said the hierarchy exists because of the speed/size/cost trade-off, and Ch.5 built the cache — this chapter supplies the actual technologies those chapters assumed. <em>Forwards:</em> Ch.7 External Memory takes flash (as SSD) and the hard disk and adds the controller logic; Ch.8 I/O connects them to the processor.</li>
<li><strong>The exam-weight guess, stated honestly.</strong> Error correction is the only part of this chapter with a <em>calculable</em> answer, so it carries the most reliable marks. DDR terminology (MT/s versus MHz, prefetch, CL) is the second. The technology-comparison material (SRAM vs DRAM, NOR vs NAND, the new three) is descriptive and shows up as multiple choice.</li>
<li><strong>Take it to your own machine.</strong> Open your system information: the RAM line says something like "16 GB DDR4-3200". You now know that 3200 is MT/s not MHz, that the DRAM array inside runs at 400 MHz, that one channel of it moves 25,6 GB/s, that it is refreshed thousands of times a second, that it forgets everything on power-off, and that if it is server ECC memory it carries 8 extra bits per 64 to run exactly the Hamming SEC-DED of slides 21–22.</li>
</ul>
<p class="meo">💡 Compress the whole chapter to one line each: <strong>SRAM fast · DRAM dense · ROM permanent · ECC honest · SDRAM scheduled · DDR doubled · eDRAM close · flash blocky · NVRAM resistive.</strong> Nine words, nine sections.</p>
<p class="pitfall">⚠️ Note the numbering one final time: this deck is Chapter <strong>6</strong> of the 11th edition, but your syllabus (9th edition numbering) calls it Chapter <strong>5 — Internal Memory</strong>. Same content, different chapter number. Quote whichever your exam paper uses.</p>`,
        `<p class="y-chinh">🎯 Trang mục lục của chính chương, và cũng là bảng kiểm ôn tập tốt nhất bạn sẽ có. Sáu đề mục; nói được hai câu về mỗi gạch con là bạn đã sẵn sàng. Để ý những gì nó KHÔNG nhắc — ánh xạ cache, đĩa cứng, vào/ra — đó là phần của Chương 5 và Chương 7.</p>
<table>
<tr><th>Đề mục</th><th>Các mục con trên slide</th><th>Đã học ở đâu</th><th>Điều DUY NHẤT phải nhớ</th></tr>
<tr><td><strong>Bộ nhớ chính bán dẫn</strong></td><td>Tổ chức · DRAM và SRAM · Các loại ROM · Logic chip · Đóng gói chip · Tổ chức mô-đun · Bộ nhớ xen kẽ</td><td>slide 2–15</td><td>DRAM = 1 transistor + tụ, cần làm tươi, dùng làm bộ nhớ chính. SRAM = flip-flop, nhanh hơn, dùng làm cache</td></tr>
<tr><td><strong>Sửa lỗi</strong></td><td>—</td><td>slide 16–22</td><td>2<sup>k</sup> &gt;= m+k+1; syndrome <em>CHÍNH LÀ</em> số vị trí bit; SEC-DED sửa một và chỉ PHÁT HIỆN hai</td></tr>
<tr><td><strong>eDRAM</strong></td><td>Cấu trúc cache eDRAM của IBM z13 · Cấu trúc cache của hệ Intel Core</td><td>slide 31–33</td><td>Ô DRAM làm việc của cache, trên đế hoặc trong gói: đặc hơn SRAM, nhanh hơn DRAM ngoài chip</td></tr>
<tr><td><strong>DDR DRAM</strong></td><td>SDRAM đồng bộ · DDR SDRAM</td><td>slide 23–30</td><td>Xung nhịp ⇒ độ trễ đoán trước được; hai sườn ⇒ ×2; bộ đệm nạp trước ⇒ tất cả phần còn lại. Băng thông tăng, ĐỘ TRỄ THÌ KHÔNG</td></tr>
<tr><td><strong>Bộ nhớ flash</strong></td><td>Nguyên lý hoạt động · Flash NOR và NAND</td><td>slide 34–37</td><td>Cổng nổi giữ điện tích khi không có nguồn; đọc một BYTE, ghi một TRANG, <strong>xoá một KHỐI</strong></td></tr>
<tr><td><strong>Công nghệ nhớ bán dẫn không mất dữ liệu mới hơn</strong></td><td>STT-RAM · PCRAM · ReRAM</td><td>slide 38–39</td><td>Cả ba lưu bit bằng ĐIỆN TRỞ; STT nhắm cache, PCRAM nhắm khe DRAM/flash, ReRAM nhắm lưu trữ</td></tr>
</table>
<ul>
<li><strong>Sợi chỉ xuyên qua cả sáu mục.</strong> Mọi chủ đề ở đây đều là một câu trả lời khác nhau cho cùng một câu hỏi: <em>lưu một bit bằng cách nào, và lựa chọn đó khiến bạn trả giá gì về tốc độ, mật độ, giá tiền và tính mất dữ liệu?</em> Tụ điện (DRAM) · flip-flop (SRAM) · cầu chì/mặt nạ (ROM) · cổng nổi (flash) · từ hoá, pha hoặc sợi dẫn (bộ ba mới). Sáu cơ chế, một bài toán đánh đổi.</li>
<li><strong>Tự kiểm trước khi đi tiếp.</strong> (1) Vì sao DRAM cần làm tươi mà SRAM thì không? (2) Tính bit kiểm tra cho một từ 8 bit bất kỳ và định vị một lỗi được cài vào. (3) Nêu ba cách DDR đi nhanh hơn. (4) Đổi DDR4-3200 sang GB/s. (5) Vì sao flash không ghi đè một byte tại chỗ được? (6) NOR hay NAND dùng để khởi động thiết bị, và vì sao? Câu nào còn lung lay thì số slide nằm ngay ở bảng trên.</li>
<li><strong>Chương này nối ra ngoài thế nào.</strong> <em>Ngược lại:</em> Ch.4 nói phân cấp tồn tại vì đánh đổi tốc độ/dung lượng/giá, và Ch.5 dựng cache — chương này CUNG CẤP những công nghệ thật mà hai chương kia giả định là có. <em>Về sau:</em> Ch.7 Bộ nhớ ngoài lấy flash (dưới dạng SSD) và đĩa cứng rồi thêm phần logic điều khiển; Ch.8 Vào/ra nối chúng vào bộ xử lý.</li>
<li><strong>Đoán trọng số đề thi, nói thẳng.</strong> Sửa lỗi là phần DUY NHẤT của chương có đáp án <em>TÍNH RA ĐƯỢC</em>, nên nó mang điểm chắc chắn nhất. Thuật ngữ DDR (MT/s so với MHz, prefetch, CL) đứng thứ hai. Phần so sánh công nghệ (SRAM vs DRAM, NOR vs NAND, bộ ba mới) mang tính mô tả và thường ra ở dạng trắc nghiệm.</li>
<li><strong>Đem về chính cái máy của bạn.</strong> Mở thông tin hệ thống lên: dòng RAM ghi đại loại "16 GB DDR4-3200". Giờ bạn biết 3200 là MT/s chứ không phải MHz, biết mảng DRAM bên trong chạy ở 400 MHz, biết một kênh của nó chuyển 25,6 GB/s, biết nó được làm tươi hàng nghìn lần mỗi giây, biết nó quên sạch khi cắt điện, và biết rằng nếu đó là RAM ECC của máy chủ thì nó mang thêm 8 bit cho mỗi 64 bit để chạy đúng cái Hamming SEC-DED của slide 21–22.</li>
</ul>
<p class="meo">💡 Nén cả chương thành mỗi phần một chữ: <strong>SRAM nhanh · DRAM đặc · ROM vĩnh viễn · ECC trung thực · SDRAM có lịch · DDR gấp đôi · eDRAM ở gần · flash theo khối · NVRAM điện trở.</strong> Chín chữ, chín phần.</p>
<p class="pitfall">⚠️ Nhắc lại chuyện đánh số lần cuối: deck này là Chapter <strong>6</strong> của bản 11th edition, nhưng syllabus của trường (đánh số theo bản 9th ed) gọi nó là Chương <strong>5 — Internal Memory</strong>. Cùng nội dung, khác số chương. Đề thi dùng số nào thì trả lời theo số đó.</p>`],
    ]),
  ].join('\n'),
};
