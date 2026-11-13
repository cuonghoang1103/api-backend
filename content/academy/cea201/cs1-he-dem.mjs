/**
 * CEA201 · ⭐ CS.1 — Hệ đếm (deck 'cea10' = Chapter 10 "Number Systems", Stallings COA 11e).
 *
 * Phần ⭐ Chuyên sâu do web BỔ SUNG: deck này thuộc bộ slide chính hãng của môn nhưng
 * KHÔNG nằm trong lịch 60 buổi của syllabus (xem _slides.mjs). Bài giảng đủ 18 slide.
 *
 * Mọi chương trình đã chạy thật trong container node:22 (Debian 12, GCC 12.2.0,
 * Python 3.11.2, aarch64) — output dán nguyên văn. Nguồn kiểm: scratchpad cs1_*.c/.py.
 *
 * Chỗ slide gốc SAI/THIẾU (nêu thẳng trong bài, không sửa ảnh):
 *   · slide 3: "442.256 = … + (4 + 10^1) + …" — phải là (4 * 10^1); dấu + là lỗi gõ.
 *   · cả deck không nói "cần bao nhiêu bit để chứa N" và không có hệ bát phân (octal) —
 *     hai thứ dùng hằng ngày (log2 trong Chương 11/4, chmod 755) → bài bổ sung.
 *   · slide 17 chỉ có sơ đồ SmartArt, không có thân chữ — đã đọc từ ảnh render.
 */
import { walk, walkHead, bi } from './_slides.mjs';
import { code, out, xem, bai } from './_cs.mjs';
import { thuNgay } from '../../_labs.mjs';

const D = 'cea10';
const COA = 'computer-organization-and-architecture';

const C_DOI = String.raw`
#include <stdio.h>

/* In n o he 2 bang cach chia 2 lien tiep (slide 9-11) */
void chia2(unsigned n) {
    unsigned du[32];
    int k = 0;
    printf("Doi %u sang nhi phan:\n", n);
    while (n > 0) {
        printf("  %2u / 2 = %2u  du %u\n", n, n / 2, n % 2);
        du[k++] = n % 2;
        n /= 2;
    }
    printf("  Doc so du tu DUOI len: ");
    for (int i = k - 1; i >= 0; i--) printf("%u", du[i]);
    printf("\n");
}

/* Doi phan le sang nhi phan bang nhan 2 lien tiep (slide 12-14) */
void nhan2(double f, int soBit) {
    printf("Doi %g sang nhi phan (toi da %d bit):\n  0.", f, soBit);
    for (int i = 0; i < soBit && f > 0; i++) {
        f *= 2;
        int b = (int)f;      /* phan nguyen: 0 hoac 1 */
        printf("%d", b);
        f -= b;              /* giu lai phan le */
    }
    printf("%s\n", f > 0 ? "...  (con du, chua dung)" : "  (dung chinh xac)");
}

int main(void) {
    chia2(11);
    chia2(21);
    nhan2(0.81, 6);
    nhan2(0.25, 6);
    nhan2(0.1, 20);
    printf("255 = %%d %d | %%x %x | %%X %X | %%o %o | %%#x %#x | %%08X %08X\n",
           255, 255, 255, 255, 255, 255);
    printf("0x2C = %d, 0x7F = %d, 0xFF = %d\n", 0x2C, 0x7F, 0xFF);
    return 0;
}
`;
const O_DOI = String.raw`
Doi 11 sang nhi phan:
  11 / 2 =  5  du 1
   5 / 2 =  2  du 1
   2 / 2 =  1  du 0
   1 / 2 =  0  du 1
  Doc so du tu DUOI len: 1011
Doi 21 sang nhi phan:
  21 / 2 = 10  du 1
  10 / 2 =  5  du 0
   5 / 2 =  2  du 1
   2 / 2 =  1  du 0
   1 / 2 =  0  du 1
  Doc so du tu DUOI len: 10101
Doi 0.81 sang nhi phan (toi da 6 bit):
  0.110011...  (con du, chua dung)
Doi 0.25 sang nhi phan (toi da 6 bit):
  0.01  (dung chinh xac)
Doi 0.1 sang nhi phan (toi da 20 bit):
  0.00011001100110011001...  (con du, chua dung)
255 = %d 255 | %x ff | %X FF | %o 377 | %#x 0xff | %08X 000000FF
0x2C = 44, 0x7F = 127, 0xFF = 255
`;
const PY_BIT = String.raw`
import math
# Bao nhieu bit de chua so N (khong dau)?  = so chu so cua bin(N)
for n in [1, 2, 7, 8, 100, 255, 256, 1000, 65535, 1_000_000]:
    print(f"N = {n:>9}  bin = {bin(n):>23}  can {n.bit_length():>2} bit"
          f"  (floor(log2 N)+1 = {math.floor(math.log2(n)) + 1})")
# k bit bieu dien duoc bao nhieu gia tri?
for k in [4, 8, 16, 32]:
    print(f"{k:>2} bit -> {2**k:>13,} gia tri: 0 .. {2**k - 1:,}")
`;
const O_BIT = String.raw`
N =         1  bin =                     0b1  can  1 bit  (floor(log2 N)+1 = 1)
N =         2  bin =                    0b10  can  2 bit  (floor(log2 N)+1 = 2)
N =         7  bin =                   0b111  can  3 bit  (floor(log2 N)+1 = 3)
N =         8  bin =                  0b1000  can  4 bit  (floor(log2 N)+1 = 4)
N =       100  bin =               0b1100100  can  7 bit  (floor(log2 N)+1 = 7)
N =       255  bin =              0b11111111  can  8 bit  (floor(log2 N)+1 = 8)
N =       256  bin =             0b100000000  can  9 bit  (floor(log2 N)+1 = 9)
N =      1000  bin =            0b1111101000  can 10 bit  (floor(log2 N)+1 = 10)
N =     65535  bin =      0b1111111111111111  can 16 bit  (floor(log2 N)+1 = 16)
N =   1000000  bin =  0b11110100001001000000  can 20 bit  (floor(log2 N)+1 = 20)
 4 bit ->            16 gia tri: 0 .. 15
 8 bit ->           256 gia tri: 0 .. 255
16 bit ->        65,536 gia tri: 0 .. 65,535
32 bit -> 4,294,967,296 gia tri: 0 .. 4,294,967,295
`;
const PY_CO_SAN = String.raw`
# Python doi co so co san: bin, oct, hex, int(chuoi, co_so), format
print(bin(83), oct(83), hex(83))
print(int("1011", 2), int("2C", 16), int("777", 8), int("2401", 7))
print(format(4728, "b"), format(4728, "x"), format(4728, "016b"))
# Bang 10.2: trong so cac vi tri cua co so 7
print([7**i for i in range(4, -1, -1)], "va 7^-1 =", 1/7)
# 1001.101 (co so 2) = ?  phan nguyen + phan le
x = int("1001", 2) + sum(int(b) * 2**-(i+1) for i, b in enumerate("101"))
print("1001.101_2 =", x)
# Nhom 4 bit -> 1 chu so hex (slide 15)
b = "1101111010101101"
print(" ".join(b[i:i+4] for i in range(0, len(b), 4)), "->", hex(int(b, 2)))
`;
const O_CO_SAN = String.raw`
0b1010011 0o123 0x53
11 44 511 883
1001001111000 1278 0001001001111000
[2401, 343, 49, 7, 1] va 7^-1 = 0.14285714285714285
1001.101_2 = 9.625
1101 1110 1010 1101 -> 0xdead
`;

/* ───────────── Phần mở đầu: học để làm gì ───────────── */
const MO_DAU = bi(`<span class="eyebrow">⭐ Advanced · Lesson CS.1 · official deck CEA10 (Stallings Ch.10, 18 slides) · added by this site</span>
<h2>Number systems: reading the machine's own language — binary, hexadecimal and how to convert between them</h2>
<p class="lead">Every chapter of CEA201 quietly assumes you can already do this: an address has <em>k</em> bits so memory has 2<sup><em>k</em></sup> cells (Chapter 11), a cache splits an address into tag | index | offset (Chapter 4), an opcode field of 6 bits gives 64 operations (Chapter 10). None of that makes sense until binary and hexadecimal feel as natural as decimal. This lesson closes that gap — from zero.</p>
<p class="nhan">Source: official Stallings slide set (COA 11e, Global Edition), Chapter 10 "Number Systems" — deck CEA10 · in the course's slide set but NOT in the 60-session schedule of the CEA201 syllabus</p>
<div class="note-ct">This ⭐ section is added by CuongThai (not a school requirement). The textbook keeps number systems and computer arithmetic in their own chapters (10 and 11) and the syllabus schedule skips them, yet binary, two's complement and IEEE 754 are what you need to read any other chapter, to answer the usual "convert / how many bits / what is the range" exam items, and to debug real programs. Lessons CS.1 → CS.4 fill that hole, slide by slide, with code that runs.</div>
<h3>What you will be able to do</h3>
<table>
<thead><tr><th>Slides</th><th>Idea</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–6</td><td>Positional number systems</td><td>read any number as "digit × weight", in base 10, 2, 7 or 16</td></tr>
<tr><td>7–8</td><td>Binary</td><td>turn a binary number (with a fractional part) into decimal</td></tr>
<tr><td>9–11</td><td>Decimal → binary, integers</td><td>convert by repeated division by 2 and read the remainders the right way</td></tr>
<tr><td>12–14</td><td>Decimal → binary, fractions</td><td>convert by repeated multiplication by 2, and know when it never ends (0.1)</td></tr>
<tr><td>15–17</td><td>Hexadecimal</td><td>switch binary ↔ hex instantly, nibble by nibble, and use <code>printf("%x")</code></td></tr>
<tr><td>18 + lab</td><td>Summary, bits needed, octal</td><td>say how many bits a value needs, and read <code>0x…</code>, <code>0o…</code>, <code>chmod 755</code></td></tr>
</tbody>
</table>
<h3>Where you meet this outside the exam</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Debugger</div><div class="lz-t">0x7ffd5e8c</div><div class="lz-d">every address is printed in hex</div></div>
  <div class="lz-step"><div class="lz-k">Web</div><div class="lz-t">#FF8800</div><div class="lz-d">a colour is 3 bytes in hex</div></div>
  <div class="lz-step"><div class="lz-k">Network</div><div class="lz-t">255.255.255.0</div><div class="lz-d">a subnet mask is 24 ones</div></div>
  <div class="lz-step"><div class="lz-k">Linux</div><div class="lz-t">chmod 755</div><div class="lz-d">three octal digits = 9 permission bits</div></div>
</div>
<div class="callout">How to study: look at each slide, read the explanation under it, then do the conversions with pencil first and check them with the programs at the end (run in Docker <code>node:22</code> — Debian 12, GCC 12.2.0, Python 3.11.2; the output blocks are pasted from that run). The interactive bit board is embedded at the end so you can click bits and watch the value change.</div>`,
`<span class="eyebrow">⭐ Chuyên sâu · Bài CS.1 · deck chính hãng CEA10 (Stallings Ch.10, 18 slide) · web bổ sung</span>
<h2>Hệ đếm: đọc được ngôn ngữ của chính cỗ máy — nhị phân, thập lục phân và cách đổi qua lại</h2>
<p class="lead">Chương nào của CEA201 cũng ngầm giả định bạn đã làm được việc này: địa chỉ có <em>k</em> bit thì bộ nhớ có 2<sup><em>k</em></sup> ô (Chương 11), cache tách địa chỉ thành tag | index | offset (Chương 4), trường opcode 6 bit cho 64 thao tác (Chương 10). Không cái nào hiểu nổi khi nhị phân và thập lục phân chưa quen như thập phân. Bài này lấp chỗ hổng đó — từ số 0.</p>
<p class="nhan">Nguồn: bộ slide chính hãng Stallings (COA 11e, Global Edition), Chapter 10 "Number Systems" — deck CEA10 · có trong bộ slide của môn nhưng KHÔNG nằm trong lịch 60 buổi của syllabus CEA201</p>
<div class="note-ct">Phần ⭐ này do CuongThai bổ sung (không phải quy định của trường). Giáo trình để hệ đếm và số học máy tính thành hai chương riêng (10 và 11) và lịch học của syllabus bỏ qua chúng, trong khi nhị phân, bù hai và IEEE 754 lại là thứ cần để đọc mọi chương khác, để làm các câu kiểu "đổi cơ số / cần bao nhiêu bit / phạm vi là gì" hay gặp, và để gỡ lỗi chương trình thật. Bài CS.1 → CS.4 lấp lỗ hổng đó, từng slide một, kèm code chạy được.</div>
<h3>Học xong bạn làm được gì</h3>
<table>
<thead><tr><th>Slide</th><th>Ý chính</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–6</td><td>Hệ đếm theo vị trí</td><td>đọc mọi số thành "chữ số × trọng số", ở cơ số 10, 2, 7 hay 16</td></tr>
<tr><td>7–8</td><td>Nhị phân</td><td>đổi một số nhị phân (kể cả phần lẻ) ra thập phân</td></tr>
<tr><td>9–11</td><td>Thập phân → nhị phân, phần nguyên</td><td>đổi bằng chia 2 liên tiếp và đọc số dư đúng chiều</td></tr>
<tr><td>12–14</td><td>Thập phân → nhị phân, phần lẻ</td><td>đổi bằng nhân 2 liên tiếp, và biết khi nào nó không bao giờ dừng (0,1)</td></tr>
<tr><td>15–17</td><td>Thập lục phân (hex)</td><td>chuyển nhị phân ↔ hex tức thì theo từng nhóm 4 bit, và dùng <code>printf("%x")</code></td></tr>
<tr><td>18 + lab</td><td>Tổng kết, số bit cần, bát phân</td><td>nói được một giá trị cần bao nhiêu bit, đọc được <code>0x…</code>, <code>0o…</code>, <code>chmod 755</code></td></tr>
</tbody>
</table>
<h3>Ngoài phòng thi bạn gặp nó ở đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Debugger</div><div class="lz-t">0x7ffd5e8c</div><div class="lz-d">địa chỉ nào cũng in bằng hex</div></div>
  <div class="lz-step"><div class="lz-k">Web</div><div class="lz-t">#FF8800</div><div class="lz-d">một màu là 3 byte viết hex</div></div>
  <div class="lz-step"><div class="lz-k">Mạng</div><div class="lz-t">255.255.255.0</div><div class="lz-d">subnet mask là 24 bit 1</div></div>
  <div class="lz-step"><div class="lz-k">Linux</div><div class="lz-t">chmod 755</div><div class="lz-d">ba chữ số bát phân = 9 bit quyền</div></div>
</div>
<div class="callout">Cách học: xem từng slide, đọc phần giảng ngay dưới, rồi tự đổi bằng bút chì trước và kiểm lại bằng các chương trình ở cuối bài (chạy trong Docker <code>node:22</code> — Debian 12, GCC 12.2.0, Python 3.11.2; khối output dán nguyên từ lần chạy đó). Cuối bài có bảng bit tương tác để bạn bấm từng bit và nhìn giá trị đổi theo.</div>`);

/* ───────────── Giảng theo từng slide ───────────── */
const SLIDES = walk(D, [
  [1, 'Chapter 10 — Number Systems (title slide)',
    `<p class="y-chinh">🎯 Chapter 10 of the 11th edition is the shortest chapter of the book, and it is the alphabet for all the others: how a string of digits stands for a value, in base 10, base 2 and base 16.</p>
<p>A computer stores everything — numbers, letters, pixels, instructions — as patterns of two voltage levels, written 0 and 1. People cannot read long strings of 0s and 1s, so we also need a compact way to write them (hexadecimal). This deck gives you both, and the conversion rules between them and our everyday decimal.</p>
<p>Why the school schedule skips it: the 60 sessions follow the 9th-edition chapter list, where number systems lived in an appendix. The ideas are still assumed everywhere — Chapter 11's bit allocation, Chapter 4's address split, Chapter 5's memory sizes. That is why this ⭐ lesson exists.</p>
<p class="meo">💡 One sentence to keep: <em>a number is a list of digits, and each position has a weight that is a power of the base</em>. Everything in this deck is that sentence applied to different bases.</p>`,
    `<p class="y-chinh">🎯 Chương 10 của bản 11 là chương ngắn nhất cả sách, và là bảng chữ cái cho mọi chương còn lại: một dãy chữ số đại diện cho một giá trị thế nào, ở cơ số 10, cơ số 2 và cơ số 16.</p>
<p>Máy tính lưu mọi thứ — số, chữ, điểm ảnh, lệnh — dưới dạng mẫu của hai mức điện áp, viết là 0 và 1. Người không đọc nổi dãy 0 và 1 dài, nên ta còn cần một cách viết gọn (thập lục phân). Bộ slide này cho bạn cả hai, cùng quy tắc đổi qua lại với hệ thập phân thường ngày.</p>
<p>Vì sao lịch học của trường bỏ qua: 60 buổi bám danh sách chương của bản 9, nơi hệ đếm nằm ở phụ lục. Nhưng các ý này vẫn được giả định ở khắp nơi — phân bổ bit ở Chương 11, tách địa chỉ ở Chương 4, dung lượng bộ nhớ ở Chương 5. Vì thế mới có bài ⭐ này.</p>
<p class="meo">💡 Một câu cần giữ: <em>một con số là một danh sách chữ số, và mỗi vị trí có một trọng số là luỹ thừa của cơ số</em>. Cả bộ slide chỉ là câu đó áp vào các cơ số khác nhau.</p>`],

  [2, 'The Decimal System',
    `<p class="y-chinh">🎯 Decimal uses ten digits 0–9 and is a <strong>positional</strong> system: the same digit is worth more the further left it sits. The base (radix) is 10.</p>
<p>83 means "8 tens plus 3": 83 = (8 × 10) + 3. 4728 means 4 thousands, 7 hundreds, 2 tens and 8: 4728 = (4 × 1000) + (7 × 100) + (2 × 10) + 8. Written with powers: 4728 = 4 × 10<sup>3</sup> + 7 × 10<sup>2</sup> + 2 × 10<sup>1</sup> + 8 × 10<sup>0</sup>.</p>
<p>The exponent is just the position counted from the right, starting at 0. That "starting at 0" is the detail that trips beginners: the rightmost digit has weight 10<sup>0</sup> = 1, not 10<sup>1</sup>.</p>
<p class="meo">💡 You have done this since primary school without naming it. The rest of the chapter only replaces 10 by another base — the method does not change.</p>`,
    `<p class="y-chinh">🎯 Hệ thập phân dùng mười chữ số 0–9 và là hệ <strong>theo vị trí</strong>: cùng một chữ số, càng đứng bên trái càng có giá trị lớn. Cơ số (radix, base) là 10.</p>
<p>83 nghĩa là "8 chục cộng 3": 83 = (8 × 10) + 3. 4728 là 4 nghìn, 7 trăm, 2 chục và 8: 4728 = (4 × 1000) + (7 × 100) + (2 × 10) + 8. Viết bằng luỹ thừa: 4728 = 4 × 10<sup>3</sup> + 7 × 10<sup>2</sup> + 2 × 10<sup>1</sup> + 8 × 10<sup>0</sup>.</p>
<p>Số mũ chính là vị trí đếm từ phải sang, bắt đầu từ 0. Cái "bắt đầu từ 0" ấy là chỗ người mới hay vấp: chữ số ngoài cùng bên phải có trọng số 10<sup>0</sup> = 1, không phải 10<sup>1</sup>.</p>
<p class="meo">💡 Bạn đã làm việc này từ tiểu học mà không gọi tên. Phần còn lại của chương chỉ thay 10 bằng một cơ số khác — cách làm không đổi.</p>`],

  [3, 'Decimal Fractions',
    `<p class="y-chinh">🎯 To the right of the decimal point the exponents keep going down: 10<sup>−1</sup>, 10<sup>−2</sup>, 10<sup>−3</sup>… So 0.256 = 2 tenths + 5 hundredths + 6 thousandths.</p>
<p>0.256 = (2 × 10<sup>−1</sup>) + (5 × 10<sup>−2</sup>) + (6 × 10<sup>−3</sup>). A number with both parts, 442.256, uses positive powers on the left and negative powers on the right.</p>
<div class="pitfall co-tieu-de"><strong>Typo on the slide.</strong> The slide writes 442.256 = (4 × 10<sup>2</sup>) + <strong>(4 + 10<sup>1</sup>)</strong> + … — the "+" inside the second bracket must be "×": (4 × 10<sup>1</sup>) = 40. Check: 400 + 40 + 2 + 0.2 + 0.05 + 0.006 = 442.256. With "+" the sum would be wrong.</div>
<p><strong>Most significant digit</strong> (MSD) = the leftmost digit, it carries the highest value. <strong>Least significant digit</strong> (LSD) = the rightmost one. In binary the same words become MSB and LSB (most/least significant <em>bit</em>) — you will use them in every later chapter.</p>
<p class="meo">💡 "Significant" = "how much it matters". Change the MSD of 4728 by one and the value moves by 1000; change the LSD and it moves by 1.</p>`,
    `<p class="y-chinh">🎯 Bên phải dấu phẩy thập phân số mũ tiếp tục giảm: 10<sup>−1</sup>, 10<sup>−2</sup>, 10<sup>−3</sup>… Nên 0,256 = 2 phần mười + 5 phần trăm + 6 phần nghìn.</p>
<p>0,256 = (2 × 10<sup>−1</sup>) + (5 × 10<sup>−2</sup>) + (6 × 10<sup>−3</sup>). Một số có cả hai phần, 442,256, dùng luỹ thừa dương bên trái và luỹ thừa âm bên phải.</p>
<div class="pitfall co-tieu-de"><strong>Slide gõ sai.</strong> Slide viết 442.256 = (4 × 10<sup>2</sup>) + <strong>(4 + 10<sup>1</sup>)</strong> + … — dấu "+" trong ngoặc thứ hai phải là "×": (4 × 10<sup>1</sup>) = 40. Kiểm: 400 + 40 + 2 + 0,2 + 0,05 + 0,006 = 442,256. Để dấu "+" thì tổng sai.</div>
<p><strong>Chữ số có nghĩa lớn nhất</strong> (most significant digit, MSD) = chữ số ngoài cùng bên trái, mang giá trị cao nhất. <strong>Chữ số có nghĩa nhỏ nhất</strong> (LSD) = chữ số ngoài cùng bên phải. Sang nhị phân, hai từ này thành MSB và LSB (bit có nghĩa lớn/nhỏ nhất) — bạn sẽ dùng chúng ở mọi chương sau.</p>
<p class="meo">💡 "Có nghĩa" = "quan trọng cỡ nào". Đổi MSD của 4728 đi một đơn vị thì giá trị lệch 1000; đổi LSD thì lệch 1.</p>`],

  [4, 'Table 10.1 Positional Interpretation of a Decimal Number',
    `<p class="y-chinh">🎯 The table lays out 472.256 column by column: digit, name of the place, weight as a power of 10, and the position number from 2 down to −3.</p>
<table>
<thead><tr><th>Digit</th><th>4</th><th>7</th><th>2</th><th>2</th><th>5</th><th>6</th></tr></thead>
<tbody>
<tr><td>Place</td><td>100s</td><td>10s</td><td>1s</td><td>tenths</td><td>hundredths</td><td>thousandths</td></tr>
<tr><td>Weight</td><td>10<sup>2</sup></td><td>10<sup>1</sup></td><td>10<sup>0</sup></td><td>10<sup>−1</sup></td><td>10<sup>−2</sup></td><td>10<sup>−3</sup></td></tr>
<tr><td>Position</td><td>2</td><td>1</td><td>0</td><td>−1</td><td>−2</td><td>−3</td></tr>
</tbody>
</table>
<p>Note the number in the table is 472.256 (digits 4, 7, 2 . 2, 5, 6), not the 442.256 of the previous slide — read the digit row, not your memory. The point of the layout: <strong>position i has weight 10<sup>i</sup></strong>, and position 0 is the first digit left of the point.</p>
<p class="meo">💡 This exact four-row table works for every base. Draw it on scrap paper in the exam; replace 10 by 2 or 16 in the weight row and the conversion is done for you.</p>`,
    `<p class="y-chinh">🎯 Bảng trải số 472,256 theo từng cột: chữ số, tên hàng, trọng số dạng luỹ thừa của 10, và số thứ tự vị trí từ 2 xuống −3.</p>
<table>
<thead><tr><th>Chữ số</th><th>4</th><th>7</th><th>2</th><th>2</th><th>5</th><th>6</th></tr></thead>
<tbody>
<tr><td>Hàng</td><td>trăm</td><td>chục</td><td>đơn vị</td><td>phần mười</td><td>phần trăm</td><td>phần nghìn</td></tr>
<tr><td>Trọng số</td><td>10<sup>2</sup></td><td>10<sup>1</sup></td><td>10<sup>0</sup></td><td>10<sup>−1</sup></td><td>10<sup>−2</sup></td><td>10<sup>−3</sup></td></tr>
<tr><td>Vị trí</td><td>2</td><td>1</td><td>0</td><td>−1</td><td>−2</td><td>−3</td></tr>
</tbody>
</table>
<p>Để ý số trong bảng là 472,256 (các chữ số 4, 7, 2 , 2, 5, 6), không phải 442,256 của slide trước — đọc hàng chữ số, đừng đọc theo trí nhớ. Ý của cách xếp này: <strong>vị trí i có trọng số 10<sup>i</sup></strong>, và vị trí 0 là chữ số đầu tiên bên trái dấu phẩy.</p>
<p class="meo">💡 Đúng cái bảng bốn hàng này dùng được cho mọi cơ số. Vẽ ra giấy nháp lúc thi; thay 10 bằng 2 hay 16 ở hàng trọng số là việc đổi tự xong.</p>`],

  [5, 'Positional Number Systems',
    `<p class="y-chinh">🎯 The general rule: in base <em>r</em>, digit position <em>i</em> has weight <em>r<sup>i</sup></em>, and every digit <em>a<sub>i</sub></em> satisfies 0 ≤ <em>a<sub>i</sub></em> &lt; <em>r</em>. The dot between <em>a</em><sub>0</sub> and <em>a</em><sub>−1</sub> is the <strong>radix point</strong>.</p>
<div class="formula">( … a<sub>3</sub>a<sub>2</sub>a<sub>1</sub>a<sub>0</sub> . a<sub>−1</sub>a<sub>−2</sub>a<sub>−3</sub> … )<sub>r</sub> = Σ a<sub>i</sub> × r<sup>i</sup></div>
<p>Two consequences fall straight out of "0 ≤ <em>a<sub>i</sub></em> &lt; <em>r</em>": base 2 has only the digits 0 and 1; base 16 needs 16 digit symbols, so it borrows the letters A–F for 10–15. A digit equal to the base (a "2" in binary, an "8" in octal) is simply illegal.</p>
<p>The subscript <em>r</em> after the bracket names the base. Writing it is not pedantry: "101" is one hundred and one in base 10, five in base 2 and 257 in base 16. In code the base is written as a prefix instead: <code>0b101</code>, <code>0o101</code> / <code>0101</code>, <code>0x101</code>.</p>
<p class="meo">💡 "Radix point" is the general name; in base 10 we say decimal point, in base 2 binary point. Same dot, same job: it separates non-negative powers from negative ones.</p>`,
    `<p class="y-chinh">🎯 Quy tắc tổng quát: ở cơ số <em>r</em>, vị trí <em>i</em> có trọng số <em>r<sup>i</sup></em>, và mỗi chữ số <em>a<sub>i</sub></em> thoả 0 ≤ <em>a<sub>i</sub></em> &lt; <em>r</em>. Dấu chấm giữa <em>a</em><sub>0</sub> và <em>a</em><sub>−1</sub> gọi là <strong>dấu phẩy cơ số</strong> (radix point).</p>
<div class="formula">( … a<sub>3</sub>a<sub>2</sub>a<sub>1</sub>a<sub>0</sub> . a<sub>−1</sub>a<sub>−2</sub>a<sub>−3</sub> … )<sub>r</sub> = Σ a<sub>i</sub> × r<sup>i</sup></div>
<p>Hai hệ quả rút thẳng từ "0 ≤ <em>a<sub>i</sub></em> &lt; <em>r</em>": cơ số 2 chỉ có chữ số 0 và 1; cơ số 16 cần 16 ký hiệu chữ số, nên mượn chữ A–F cho 10–15. Một chữ số bằng đúng cơ số (chữ "2" trong nhị phân, chữ "8" trong bát phân) là không hợp lệ.</p>
<p>Chỉ số <em>r</em> sau dấu ngoặc ghi tên cơ số. Ghi nó không phải để cầu kỳ: "101" là một trăm lẻ một ở cơ số 10, là năm ở cơ số 2 và là 257 ở cơ số 16. Trong code, cơ số được viết thành tiền tố: <code>0b101</code>, <code>0o101</code> / <code>0101</code>, <code>0x101</code>.</p>
<p class="meo">💡 "Radix point" là tên chung; ở cơ số 10 gọi là dấu phẩy thập phân, ở cơ số 2 là dấu phẩy nhị phân. Cùng một dấu, cùng một việc: tách luỹ thừa không âm khỏi luỹ thừa âm.</p>`],

  [6, 'Table 10.2 Positional Interpretation of a Number in Base 7',
    `<p class="y-chinh">🎯 Base 7 as a warm-up for "any base": the weights are 7<sup>4</sup> = 2401, 7<sup>3</sup> = 343, 7<sup>2</sup> = 49, 7<sup>1</sup> = 7, 7<sup>0</sup> = 1 and 7<sup>−1</sup> = 1/7.</p>
<p>Why such an odd base? Precisely because it is odd — you cannot fall back on habits. If you can convert in base 7, you understand the method rather than a memorised trick.</p>
<p class="nhan">Worked example (not on the slide)</p>
<p>(2401)<sub>7</sub> = 2 × 343 + 4 × 49 + 0 × 7 + 1 × 1 = 686 + 196 + 0 + 1 = <strong>883</strong>. The digits "2401" happen to look like 7<sup>4</sup>, which makes it a good trap: (2401)<sub>7</sub> is <em>not</em> 2401. Python's <code>int("2401", 7)</code> prints 883 in the run at the end of this lesson.</p>
<p class="meo">💡 Recipe for any base → decimal: write the weights above the digits (right to left: 1, r, r², …), multiply column by column, add.</p>`,
    `<p class="y-chinh">🎯 Cơ số 7 làm bài khởi động cho "mọi cơ số": các trọng số là 7<sup>4</sup> = 2401, 7<sup>3</sup> = 343, 7<sup>2</sup> = 49, 7<sup>1</sup> = 7, 7<sup>0</sup> = 1 và 7<sup>−1</sup> = 1/7.</p>
<p>Sao lại chọn cơ số kỳ cục vậy? Chính vì nó kỳ cục — bạn không dựa được vào thói quen. Đổi được ở cơ số 7 nghĩa là bạn hiểu phương pháp, không phải thuộc mẹo.</p>
<p class="nhan">Ví dụ giải (không có trên slide)</p>
<p>(2401)<sub>7</sub> = 2 × 343 + 4 × 49 + 0 × 7 + 1 × 1 = 686 + 196 + 0 + 1 = <strong>883</strong>. Dãy "2401" trông y hệt 7<sup>4</sup>, nên là một cái bẫy hay: (2401)<sub>7</sub> <em>không phải</em> 2401. Lệnh Python <code>int("2401", 7)</code> in ra 883 trong lần chạy ở cuối bài.</p>
<p class="meo">💡 Công thức cơ số bất kỳ → thập phân: viết trọng số lên trên các chữ số (từ phải sang: 1, r, r², …), nhân từng cột, cộng lại.</p>`],

  [7, 'The Binary System',
    `<p class="y-chinh">🎯 Binary has only two digits, 0 and 1, and base 2. Each position is worth twice the one to its right: 1, 2, 4, 8, 16, 32…</p>
<p>The slide counts: 0<sub>2</sub> = 0, 1<sub>2</sub> = 1, 10<sub>2</sub> = 2, 11<sub>2</sub> = 3, 100<sub>2</sub> = 4. Fractions use negative powers: 2<sup>−1</sup> = 0.5, 2<sup>−2</sup> = 0.25, 2<sup>−3</sup> = 0.125. So 1001.101<sub>2</sub> = 2<sup>3</sup> + 2<sup>0</sup> + 2<sup>−1</sup> + 2<sup>−3</sup> = 8 + 1 + 0.5 + 0.125 = <strong>9.625</strong>.</p>
<p>Why do computers use base 2 at all? A transistor is reliable as a switch with two clearly separated states (high voltage / low voltage). Ten voltage levels would be much harder to tell apart with noise, heat and ageing. Two states = maximum noise margin = cheap, fast, reliable circuits.</p>
<p class="meo">💡 Learn the powers of 2 up to 2<sup>10</sup> = 1024 by heart (table in the lab section). With them, reading binary is just adding the weights of the 1-bits.</p>`,
    `<p class="y-chinh">🎯 Nhị phân chỉ có hai chữ số, 0 và 1, cơ số 2. Mỗi vị trí đáng giá gấp đôi vị trí bên phải nó: 1, 2, 4, 8, 16, 32…</p>
<p>Slide đếm: 0<sub>2</sub> = 0, 1<sub>2</sub> = 1, 10<sub>2</sub> = 2, 11<sub>2</sub> = 3, 100<sub>2</sub> = 4. Phần lẻ dùng luỹ thừa âm: 2<sup>−1</sup> = 0,5, 2<sup>−2</sup> = 0,25, 2<sup>−3</sup> = 0,125. Nên 1001,101<sub>2</sub> = 2<sup>3</sup> + 2<sup>0</sup> + 2<sup>−1</sup> + 2<sup>−3</sup> = 8 + 1 + 0,5 + 0,125 = <strong>9,625</strong>.</p>
<p>Sao máy tính lại dùng cơ số 2? Một transistor đáng tin nhất khi làm công tắc với hai trạng thái tách bạch (điện áp cao / điện áp thấp). Mười mức điện áp thì khó phân biệt hơn nhiều khi có nhiễu, nhiệt và lão hoá. Hai trạng thái = biên chống nhiễu lớn nhất = mạch rẻ, nhanh, tin cậy.</p>
<p class="meo">💡 Thuộc lòng luỹ thừa của 2 tới 2<sup>10</sup> = 1024 (bảng ở phần thực hành). Có chúng rồi thì đọc nhị phân chỉ là cộng trọng số của các bit 1.</p>`],

  [8, 'Converting Between Binary and Decimal',
    `<p class="y-chinh">🎯 Two directions, two methods. Binary → decimal: multiply each bit by its power of 2 and add. Decimal → binary: treat the <strong>integer part</strong> and the <strong>fractional part separately</strong>.</p>
<p>The first direction is just slide 5's formula. The second needs real work, and the slide's warning matters: 6.75 is not converted "as a whole". You convert 6 → 110 (slides 9–11) and 0.75 → 0.11 (slides 12–14), then glue them: 110.11<sub>2</sub>.</p>
<p>Why separately? Because the two halves are produced by opposite operations. Dividing by 2 peels bits off the <em>right</em> end of an integer; multiplying by 2 pushes bits out of the <em>left</em> end of a fraction, across the point.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">6.75</div><div class="lz-t">split</div><div class="lz-d">6 and 0.75</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">÷2 repeatedly</div><div class="lz-d">→ 110</div></div>
  <div class="lz-step"><div class="lz-k">0.75</div><div class="lz-t">×2 repeatedly</div><div class="lz-d">→ .11</div></div>
  <div class="lz-step"><div class="lz-k">join</div><div class="lz-t">110.11₂</div><div class="lz-d">4 + 2 + 0.5 + 0.25 = 6.75 ✓</div></div>
</div>`,
    `<p class="y-chinh">🎯 Hai chiều, hai cách. Nhị phân → thập phân: nhân mỗi bit với luỹ thừa của 2 tương ứng rồi cộng. Thập phân → nhị phân: xử lý <strong>phần nguyên</strong> và <strong>phần lẻ riêng rẽ</strong>.</p>
<p>Chiều thứ nhất chỉ là công thức của slide 5. Chiều thứ hai mới cần làm thật, và lời dặn của slide quan trọng: 6,75 không đổi "nguyên khối". Bạn đổi 6 → 110 (slide 9–11) và 0,75 → 0,11 (slide 12–14), rồi ghép lại: 110,11<sub>2</sub>.</p>
<p>Vì sao phải tách? Vì hai nửa sinh ra bằng hai phép ngược nhau. Chia cho 2 bóc từng bit ở đầu <em>phải</em> của số nguyên; nhân với 2 đẩy từng bit ra khỏi đầu <em>trái</em> của phần lẻ, vượt qua dấu phẩy.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">6,75</div><div class="lz-t">tách</div><div class="lz-d">6 và 0,75</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">chia 2 liên tiếp</div><div class="lz-d">→ 110</div></div>
  <div class="lz-step"><div class="lz-k">0,75</div><div class="lz-t">nhân 2 liên tiếp</div><div class="lz-d">→ ,11</div></div>
  <div class="lz-step"><div class="lz-k">ghép</div><div class="lz-t">110,11₂</div><div class="lz-d">4 + 2 + 0,5 + 0,25 = 6,75 ✓</div></div>
</div>`],

  [9, 'Integers 1/2 — why repeated division works',
    `<p class="y-chinh">🎯 The proof behind "divide by 2 and keep the remainders": N = 2 × N<sub>1</sub> + R<sub>0</sub>, and R<sub>0</sub> (0 or 1) is exactly the last bit b<sub>0</sub>.</p>
<p>An integer in binary is b<sub>m−1</sub>…b<sub>1</sub>b<sub>0</sub> with value b<sub>m−1</sub>2<sup>m−1</sup> + … + b<sub>1</sub>2 + b<sub>0</sub>. Every term except b<sub>0</sub> is a multiple of 2, so dividing N by 2 leaves remainder b<sub>0</sub> and quotient N<sub>1</sub> = the number with b<sub>0</sub> chopped off. Divide N<sub>1</sub> by 2 and the remainder is b<sub>1</sub>. Substituting back: N = N<sub>2</sub> × 2<sup>2</sup> + R<sub>1</sub> × 2 + R<sub>0</sub>, then N = N<sub>3</sub> × 2<sup>3</sup> + R<sub>2</sub> × 2<sup>2</sup> + R<sub>1</sub> × 2 + R<sub>0</sub>, and so on.</p>
<p>So the <strong>first</strong> remainder is the <strong>least</strong> significant bit. That single fact is the whole reason for "read the remainders from the bottom up" on slide 11.</p>
<p class="meo">💡 Decimal does the same thing with 10: 4728 ÷ 10 = 472 remainder 8 — the remainder is the last digit. Division by the base always peels off the rightmost digit.</p>`,
    `<p class="y-chinh">🎯 Chứng minh đằng sau "chia 2 rồi giữ số dư": N = 2 × N<sub>1</sub> + R<sub>0</sub>, và R<sub>0</sub> (0 hoặc 1) chính là bit cuối b<sub>0</sub>.</p>
<p>Một số nguyên nhị phân là b<sub>m−1</sub>…b<sub>1</sub>b<sub>0</sub> có giá trị b<sub>m−1</sub>2<sup>m−1</sup> + … + b<sub>1</sub>2 + b<sub>0</sub>. Mọi số hạng trừ b<sub>0</sub> đều là bội của 2, nên chia N cho 2 thì dư b<sub>0</sub>, thương N<sub>1</sub> = chính số đó bị cắt mất b<sub>0</sub>. Chia N<sub>1</sub> cho 2 thì dư b<sub>1</sub>. Thế ngược lại: N = N<sub>2</sub> × 2<sup>2</sup> + R<sub>1</sub> × 2 + R<sub>0</sub>, rồi N = N<sub>3</sub> × 2<sup>3</sup> + R<sub>2</sub> × 2<sup>2</sup> + R<sub>1</sub> × 2 + R<sub>0</sub>, cứ thế.</p>
<p>Vậy số dư <strong>đầu tiên</strong> là bit có nghĩa <strong>nhỏ nhất</strong>. Chỉ một điều đó là toàn bộ lý do của câu "đọc số dư từ dưới lên" ở slide 11.</p>
<p class="meo">💡 Thập phân cũng làm y hệt với 10: 4728 ÷ 10 = 472 dư 8 — số dư là chữ số cuối. Chia cho cơ số luôn bóc ra chữ số ngoài cùng bên phải.</p>`],

  [10, 'Integers 2/2 — the stopping rule',
    `<p class="y-chinh">🎯 The quotients shrink (N &gt; N<sub>1</sub> &gt; N<sub>2</sub> …), so you eventually reach a quotient of 1; that final 1 is the most significant bit. Reading the remainders <strong>in order of increasing significance</strong> gives the binary form of N.</p>
<p>In practice most people keep dividing until the quotient is 0 — the last division (1 ÷ 2 = 0 remainder 1) produces that same leading 1 as a remainder, so nothing is lost and you do not need a special rule. The program at the end of this lesson does exactly that.</p>
<p>The two exceptions the slide mentions are 0 and 1: their binary form is 0 and 1 directly (the loop would not even start for 0 — a classic bug in hand-written converters, which then print an empty string).</p>
<div class="pitfall">Writing the remainders from top to bottom gives the bits <strong>reversed</strong>: 11 would come out as 1101 (= 13) instead of 1011. Always read upward, or write each new bit to the <em>left</em> of the previous one.</div>`,
    `<p class="y-chinh">🎯 Thương nhỏ dần (N &gt; N<sub>1</sub> &gt; N<sub>2</sub> …), nên tới lúc thương bằng 1; số 1 cuối đó là bit có nghĩa lớn nhất. Đọc các số dư <strong>theo thứ tự trọng số tăng dần</strong> cho ra dạng nhị phân của N.</p>
<p>Thực tế đa số người chia tiếp tới khi thương bằng 0 — phép chia cuối (1 ÷ 2 = 0 dư 1) cho ra đúng số 1 dẫn đầu ấy dưới dạng số dư, nên không mất gì và khỏi cần luật riêng. Chương trình ở cuối bài làm đúng như vậy.</p>
<p>Hai ngoại lệ slide nhắc là 0 và 1: dạng nhị phân của chúng là 0 và 1 luôn (với 0 vòng lặp thậm chí không chạy — lỗi kinh điển của bộ đổi tự viết, in ra chuỗi rỗng).</p>
<div class="pitfall">Viết số dư từ trên xuống thì các bit bị <strong>đảo ngược</strong>: 11 sẽ ra 1101 (= 13) thay vì 1011. Luôn đọc từ dưới lên, hoặc viết mỗi bit mới vào <em>bên trái</em> bit trước.</div>`],

  [11, 'Figure 10.1 Converting decimal integers to binary',
    `<p class="y-chinh">🎯 Two worked examples on the figure: (a) 11<sub>10</sub> → 1011<sub>2</sub> and (b) 21<sub>10</sub> → 10101<sub>2</sub>. The arrows show the remainders being collected from the bottom up.</p>
<table>
<thead><tr><th>(a) 11</th><th>quotient</th><th>remainder</th><th></th><th>(b) 21</th><th>quotient</th><th>remainder</th></tr></thead>
<tbody>
<tr><td>11/2</td><td>5</td><td>1 ← LSB</td><td></td><td>21/2</td><td>10</td><td>1 ← LSB</td></tr>
<tr><td>5/2</td><td>2</td><td>1</td><td></td><td>10/2</td><td>5</td><td>0</td></tr>
<tr><td>2/2</td><td>1</td><td>0</td><td></td><td>5/2</td><td>2</td><td>1</td></tr>
<tr><td>1/2</td><td>0</td><td>1 ← MSB</td><td></td><td>2/2</td><td>1</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td>1/2</td><td>0</td><td>1 ← MSB</td></tr>
</tbody>
</table>
<p>Check (a): 8 + 0 + 2 + 1 = 11 ✓. Check (b): 16 + 0 + 4 + 0 + 1 = 21 ✓. The C program at the end prints these very tables, line for line.</p>
<p class="meo">💡 Fast mental route for small numbers: subtract the largest power of 2 that fits. 21 − 16 = 5, 5 − 4 = 1, 1 − 1 = 0 → bits 16, 4, 1 are on → 10101. Same answer, often quicker than division.</p>`,
    `<p class="y-chinh">🎯 Hai ví dụ giải sẵn trên hình: (a) 11<sub>10</sub> → 1011<sub>2</sub> và (b) 21<sub>10</sub> → 10101<sub>2</sub>. Các mũi tên cho thấy số dư được gom từ dưới lên.</p>
<table>
<thead><tr><th>(a) 11</th><th>thương</th><th>dư</th><th></th><th>(b) 21</th><th>thương</th><th>dư</th></tr></thead>
<tbody>
<tr><td>11/2</td><td>5</td><td>1 ← LSB</td><td></td><td>21/2</td><td>10</td><td>1 ← LSB</td></tr>
<tr><td>5/2</td><td>2</td><td>1</td><td></td><td>10/2</td><td>5</td><td>0</td></tr>
<tr><td>2/2</td><td>1</td><td>0</td><td></td><td>5/2</td><td>2</td><td>1</td></tr>
<tr><td>1/2</td><td>0</td><td>1 ← MSB</td><td></td><td>2/2</td><td>1</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td>1/2</td><td>0</td><td>1 ← MSB</td></tr>
</tbody>
</table>
<p>Kiểm (a): 8 + 0 + 2 + 1 = 11 ✓. Kiểm (b): 16 + 0 + 4 + 0 + 1 = 21 ✓. Chương trình C ở cuối bài in ra đúng hai bảng này, từng dòng.</p>
<p class="meo">💡 Đường tắt nhẩm cho số nhỏ: trừ đi luỹ thừa của 2 lớn nhất còn vừa. 21 − 16 = 5, 5 − 4 = 1, 1 − 1 = 0 → các bit 16, 4, 1 bật → 10101. Cùng đáp án, thường nhanh hơn chia.</p>`],

  [12, 'Fractions (1 of 2) — why repeated multiplication works',
    `<p class="y-chinh">🎯 A fraction 0.b<sub>−1</sub>b<sub>−2</sub>b<sub>−3</sub>… is worth b<sub>−1</sub>/2 + b<sub>−2</sub>/4 + b<sub>−3</sub>/8 + … Multiply it by 2 and the first bit b<sub>−1</sub> jumps to the left of the point.</p>
<p>The slide rewrites the value as F = 2<sup>−1</sup>(b<sub>−1</sub> + 2<sup>−1</sup>(b<sub>−2</sub> + 2<sup>−1</sup>(b<sub>−3</sub> + …))). Multiplying by 2 cancels the outer 2<sup>−1</sup>: 2F = b<sub>−1</sub> + (something between 0 and 1). So the <strong>integer part of 2F is the first bit after the point</strong>, and what is left over is a new fraction with the same shape.</p>
<p>This is the mirror image of slide 9: there, dividing by 2 dropped the last bit of an integer out as a remainder; here, multiplying by 2 pushes the first bit of a fraction across the point.</p>
<p class="meo">💡 Decimal check: 0.256 × 10 = 2.56 — the integer part 2 is the first decimal digit. Multiplying by the base always exposes the next digit after the point.</p>`,
    `<p class="y-chinh">🎯 Một phần lẻ 0,b<sub>−1</sub>b<sub>−2</sub>b<sub>−3</sub>… có giá trị b<sub>−1</sub>/2 + b<sub>−2</sub>/4 + b<sub>−3</sub>/8 + … Nhân nó với 2 thì bit đầu b<sub>−1</sub> nhảy sang bên trái dấu phẩy.</p>
<p>Slide viết lại giá trị thành F = 2<sup>−1</sup>(b<sub>−1</sub> + 2<sup>−1</sup>(b<sub>−2</sub> + 2<sup>−1</sup>(b<sub>−3</sub> + …))). Nhân 2 triệt tiêu 2<sup>−1</sup> ngoài cùng: 2F = b<sub>−1</sub> + (một số nằm giữa 0 và 1). Vậy <strong>phần nguyên của 2F là bit đầu tiên sau dấu phẩy</strong>, phần còn lại là một phần lẻ mới có cùng hình dạng.</p>
<p>Đây là ảnh gương của slide 9: ở đó, chia cho 2 làm bit cuối của số nguyên rơi ra thành số dư; ở đây, nhân 2 đẩy bit đầu của phần lẻ vượt qua dấu phẩy.</p>
<p class="meo">💡 Kiểm bằng thập phân: 0,256 × 10 = 2,56 — phần nguyên 2 chính là chữ số thập phân đầu. Nhân với cơ số luôn lộ ra chữ số kế tiếp sau dấu phẩy.</p>`],

  [13, 'Fractions (2 of 2) — the repeat step',
    `<p class="y-chinh">🎯 The procedure: multiply the fraction by 2; the digit left of the point (0 or 1) is the next bit, <strong>starting with the most significant</strong>; keep only the fractional part and repeat.</p>
<p>Note the order is the opposite of the integer method: here the <strong>first</strong> digit produced is the one <strong>right after the point</strong>, so you read top to bottom. When the fractional part becomes exactly 0, the conversion is finished and exact.</p>
<p>When does it never become 0? When the fraction's denominator (in lowest terms) has a prime factor other than 2. 0.25 = 1/4 ends; 0.75 = 3/4 ends; but 0.1 = 1/10 has the factor 5, so its binary expansion repeats forever: 0.0001100110011… That is the root of "0.1 + 0.2 ≠ 0.3", which lesson CS.3 takes apart.</p>
<div class="pitfall">Two different reading directions in one chapter: <strong>integer part — read remainders bottom-up</strong>; <strong>fractional part — read integer digits top-down</strong>. Mixing them up is the single most common error on conversion questions.</div>`,
    `<p class="y-chinh">🎯 Quy trình: nhân phần lẻ với 2; chữ số bên trái dấu phẩy (0 hoặc 1) là bit kế tiếp, <strong>bắt đầu từ bit có nghĩa lớn nhất</strong>; chỉ giữ phần lẻ rồi lặp lại.</p>
<p>Để ý thứ tự ngược với cách đổi phần nguyên: ở đây chữ số sinh ra <strong>đầu tiên</strong> là chữ số <strong>ngay sau dấu phẩy</strong>, nên đọc từ trên xuống. Khi phần lẻ về đúng 0 thì việc đổi kết thúc và chính xác.</p>
<p>Khi nào nó không bao giờ về 0? Khi mẫu số của phân số (đã tối giản) có thừa số nguyên tố khác 2. 0,25 = 1/4 dừng; 0,75 = 3/4 dừng; nhưng 0,1 = 1/10 có thừa số 5, nên khai triển nhị phân lặp mãi: 0,0001100110011… Đó là gốc của "0,1 + 0,2 ≠ 0,3", thứ bài CS.3 sẽ mổ xẻ.</p>
<div class="pitfall">Một chương có hai chiều đọc khác nhau: <strong>phần nguyên — đọc số dư từ dưới lên</strong>; <strong>phần lẻ — đọc phần nguyên của tích từ trên xuống</strong>. Lẫn hai chiều này là lỗi phổ biến nhất ở câu đổi cơ số.</div>`],

  [14, 'Figure 10.2 Converting decimal fractions to binary',
    `<p class="y-chinh">🎯 (a) 0.81<sub>10</sub> ≈ 0.110011<sub>2</sub> (approximately — it does not end); (b) 0.25<sub>10</sub> = 0.01<sub>2</sub> (exactly).</p>
<table>
<thead><tr><th>(a) product</th><th>bit</th><th></th><th>(b) product</th><th>bit</th></tr></thead>
<tbody>
<tr><td>0.81 × 2 = 1.62</td><td>1</td><td></td><td>0.25 × 2 = 0.5</td><td>0</td></tr>
<tr><td>0.62 × 2 = 1.24</td><td>1</td><td></td><td>0.5 × 2 = 1.0</td><td>1 → stop, fraction is 0</td></tr>
<tr><td>0.24 × 2 = 0.48</td><td>0</td><td></td><td></td><td></td></tr>
<tr><td>0.48 × 2 = 0.96</td><td>0</td><td></td><td></td><td></td></tr>
<tr><td>0.96 × 2 = 1.92</td><td>1</td><td></td><td></td><td></td></tr>
<tr><td>0.92 × 2 = 1.84</td><td>1 → stopped after 6 bits</td><td></td><td></td><td></td></tr>
</tbody>
</table>
<p>How wrong is the 6-bit answer for 0.81? 0.110011<sub>2</sub> = 0.5 + 0.25 + 0.03125 + 0.015625 = 0.796875, off by 0.013125. Every extra bit halves the possible error. A real machine has a fixed number of bits, so it <em>must</em> stop somewhere — this is exactly where rounding error is born.</p>
<p class="meo">💡 You do not need to remember 0.81. Remember the shape: a fraction ends iff its denominator is a power of 2. 0.5, 0.25, 0.375, 0.8125 end; 0.1, 0.2, 0.3, 0.81 do not.</p>`,
    `<p class="y-chinh">🎯 (a) 0,81<sub>10</sub> ≈ 0,110011<sub>2</sub> (xấp xỉ — nó không dừng); (b) 0,25<sub>10</sub> = 0,01<sub>2</sub> (chính xác).</p>
<table>
<thead><tr><th>(a) tích</th><th>bit</th><th></th><th>(b) tích</th><th>bit</th></tr></thead>
<tbody>
<tr><td>0,81 × 2 = 1,62</td><td>1</td><td></td><td>0,25 × 2 = 0,5</td><td>0</td></tr>
<tr><td>0,62 × 2 = 1,24</td><td>1</td><td></td><td>0,5 × 2 = 1,0</td><td>1 → dừng, phần lẻ = 0</td></tr>
<tr><td>0,24 × 2 = 0,48</td><td>0</td><td></td><td></td><td></td></tr>
<tr><td>0,48 × 2 = 0,96</td><td>0</td><td></td><td></td><td></td></tr>
<tr><td>0,96 × 2 = 1,92</td><td>1</td><td></td><td></td><td></td></tr>
<tr><td>0,92 × 2 = 1,84</td><td>1 → dừng sau 6 bit</td><td></td><td></td><td></td></tr>
</tbody>
</table>
<p>Đáp án 6 bit cho 0,81 sai bao nhiêu? 0,110011<sub>2</sub> = 0,5 + 0,25 + 0,03125 + 0,015625 = 0,796875, lệch 0,013125. Mỗi bit thêm vào chia đôi sai số có thể có. Máy thật có số bit cố định nên <em>bắt buộc</em> phải dừng ở đâu đó — đây chính là nơi sai số làm tròn ra đời.</p>
<p class="meo">💡 Không cần nhớ 0,81. Nhớ hình dạng: một phân số dừng khi và chỉ khi mẫu số là luỹ thừa của 2. 0,5, 0,25, 0,375, 0,8125 dừng; 0,1, 0,2, 0,3, 0,81 thì không.</p>`],

  [15, 'Hexadecimal Notation 1/2',
    `<p class="y-chinh">🎯 Group the bits in fours (a group of 4 bits is a <strong>nibble</strong>) and give each of the 16 possible patterns one symbol: 0–9 then A–F. That is hexadecimal, base 16.</p>
<table>
<thead><tr><th>bits</th><th>hex</th><th>bits</th><th>hex</th><th>bits</th><th>hex</th><th>bits</th><th>hex</th></tr></thead>
<tbody>
<tr><td>0000</td><td>0</td><td>0100</td><td>4</td><td>1000</td><td>8</td><td>1100</td><td>C</td></tr>
<tr><td>0001</td><td>1</td><td>0101</td><td>5</td><td>1001</td><td>9</td><td>1101</td><td>D</td></tr>
<tr><td>0010</td><td>2</td><td>0110</td><td>6</td><td>1010</td><td>A</td><td>1110</td><td>E</td></tr>
<tr><td>0011</td><td>3</td><td>0111</td><td>7</td><td>1011</td><td>B</td><td>1111</td><td>F</td></tr>
</tbody>
</table>
<p>The slide's example: 2C<sub>16</sub> = 2 × 16<sup>1</sup> + C × 16<sup>0</sup> = 2 × 16 + 12 × 1 = <strong>44</strong>. In C that is <code>0x2C</code>, and <code>printf("%d", 0x2C)</code> prints 44 in the run below.</p>
<p>Binary → hex: split into nibbles <strong>from the right</strong>, pad the leftmost group with zeros, translate each nibble. 1101 1110 1010 1101 → D E A D = 0xDEAD. Hex → binary: replace each hex digit by its 4 bits. No arithmetic at all — this is why programmers write bits in hex.</p>
<p class="meo">💡 Anchor values: A = 10, C = 12, F = 15; 8 = 1000, F = 1111. From 8 and F you can rebuild any other nibble in a second.</p>`,
    `<p class="y-chinh">🎯 Gom bit thành nhóm bốn (nhóm 4 bit gọi là <strong>nibble</strong>) và cho mỗi mẫu trong 16 mẫu có thể một ký hiệu: 0–9 rồi A–F. Đó là thập lục phân, cơ số 16.</p>
<table>
<thead><tr><th>bit</th><th>hex</th><th>bit</th><th>hex</th><th>bit</th><th>hex</th><th>bit</th><th>hex</th></tr></thead>
<tbody>
<tr><td>0000</td><td>0</td><td>0100</td><td>4</td><td>1000</td><td>8</td><td>1100</td><td>C</td></tr>
<tr><td>0001</td><td>1</td><td>0101</td><td>5</td><td>1001</td><td>9</td><td>1101</td><td>D</td></tr>
<tr><td>0010</td><td>2</td><td>0110</td><td>6</td><td>1010</td><td>A</td><td>1110</td><td>E</td></tr>
<tr><td>0011</td><td>3</td><td>0111</td><td>7</td><td>1011</td><td>B</td><td>1111</td><td>F</td></tr>
</tbody>
</table>
<p>Ví dụ của slide: 2C<sub>16</sub> = 2 × 16<sup>1</sup> + C × 16<sup>0</sup> = 2 × 16 + 12 × 1 = <strong>44</strong>. Trong C đó là <code>0x2C</code>, và <code>printf("%d", 0x2C)</code> in ra 44 ở lần chạy bên dưới.</p>
<p>Nhị phân → hex: chia thành nibble <strong>từ phải sang</strong>, thêm số 0 vào nhóm ngoài cùng bên trái cho đủ 4, dịch từng nibble. 1101 1110 1010 1101 → D E A D = 0xDEAD. Hex → nhị phân: thay mỗi chữ số hex bằng 4 bit của nó. Không cần tính toán gì — đây là lý do lập trình viên viết bit bằng hex.</p>
<p class="meo">💡 Mốc để nhớ: A = 10, C = 12, F = 15; 8 = 1000, F = 1111. Từ 8 và F bạn dựng lại mọi nibble khác trong một giây.</p>`],

  [16, 'Table 10.3 Decimal, Binary, and Hexadecimal',
    `<p class="y-chinh">🎯 The same values in three notations, 0 to 256. Look at what happens at the "round" numbers of each base: 16 = 0001 0000 = 10<sub>16</sub>, 255 = 1111 1111 = FF, 256 = 0001 0000 0000 = 100<sub>16</sub>.</p>
<p>Rows worth memorising from the table:</p>
<ul>
<li>15 = 1111 = F — the largest value of one nibble; 16 needs a second hex digit.</li>
<li>31 = 0001 1111 = 1F; 100 = 0110 0100 = 64<sub>16</sub> (a classic trap: "64" in hex is one hundred).</li>
<li>255 = 1111 1111 = FF — the largest value of one <strong>byte</strong> (8 bits = 2 hex digits). Every byte in a hex dump is exactly two hex digits.</li>
<li>256 = 1 0000 0000 — one more than a byte can hold, so it needs 9 bits.</li>
</ul>
<p>The table also shows why the leading zeros are written in groups: <code>0001 0000</code> keeps the nibble boundaries visible, so the hex column can be read off directly.</p>
<p class="meo">💡 "Two hex digits = one byte" is the most useful line in this deck. A 32-bit value is 8 hex digits, a 64-bit address is 16.</p>`,
    `<p class="y-chinh">🎯 Cùng các giá trị viết theo ba cách, từ 0 tới 256. Nhìn chỗ các số "tròn" của từng cơ số: 16 = 0001 0000 = 10<sub>16</sub>, 255 = 1111 1111 = FF, 256 = 0001 0000 0000 = 100<sub>16</sub>.</p>
<p>Những dòng đáng nhớ trong bảng:</p>
<ul>
<li>15 = 1111 = F — giá trị lớn nhất của một nibble; 16 cần chữ số hex thứ hai.</li>
<li>31 = 0001 1111 = 1F; 100 = 0110 0100 = 64<sub>16</sub> (bẫy kinh điển: "64" ở hệ hex là một trăm).</li>
<li>255 = 1111 1111 = FF — giá trị lớn nhất của một <strong>byte</strong> (8 bit = 2 chữ số hex). Mỗi byte trong bản dump hex đúng hai chữ số hex.</li>
<li>256 = 1 0000 0000 — hơn sức chứa của một byte đúng 1, nên cần 9 bit.</li>
</ul>
<p>Bảng còn cho thấy vì sao số 0 đứng đầu được viết theo nhóm: <code>0001 0000</code> giữ lộ ranh giới nibble, nên cột hex đọc ra được ngay.</p>
<p class="meo">💡 "Hai chữ số hex = một byte" là dòng hữu ích nhất của cả bộ slide. Giá trị 32 bit là 8 chữ số hex, địa chỉ 64 bit là 16.</p>`],

  [17, 'Hexadecimal Notation 2/2 — why programmers use hex',
    `<p class="y-chinh">🎯 The diagram gives three reasons for hex, plus a reminder that hex is a notation for <em>any</em> bit string, not only for integers.</p>
<ul>
<li><strong>More compact than binary</strong> — 16 bits become 4 symbols. Fewer symbols, fewer copying mistakes.</li>
<li><strong>Binary data comes in multiples of 4 bits</strong> — bytes, 16/32/64-bit words — so it fits a whole number of hex digits with no ragged edge.</li>
<li><strong>Conversion is trivial</strong> — nibble-by-nibble lookup, no division. Decimal has no such shortcut because 10 is not a power of 2.</li>
</ul>
<p>"Any sequence of binary digits" is the important phrase: a machine instruction (<code>0x8B45FC</code>), a colour (<code>#1E90FF</code>), a MAC address (<code>3C:22:FB:…</code>), a UTF-8 byte sequence (<code>E1 BB 87</code> for "ệ") are not numbers you calculate with — hex is just the readable way to write their bits.</p>
<p class="nhan">Not on the slide — octal (base 8)</p>
<p>Octal groups bits in <strong>threes</strong> (digits 0–7). It survives in one place every developer meets: Unix permissions. <code>chmod 755</code> = 111 101 101 = rwx r-x r-x. In C a leading 0 means octal (<code>0755</code>), which is why <code>int x = 010;</code> is eight, not ten.</p>`,
    `<p class="y-chinh">🎯 Sơ đồ đưa ra ba lý do dùng hex, kèm lời nhắc rằng hex là cách viết cho <em>mọi</em> dãy bit, không chỉ cho số nguyên.</p>
<ul>
<li><strong>Gọn hơn nhị phân</strong> — 16 bit thành 4 ký hiệu. Ít ký hiệu hơn, ít chép sai hơn.</li>
<li><strong>Dữ liệu nhị phân đi theo bội của 4 bit</strong> — byte, từ 16/32/64 bit — nên vừa khít một số nguyên chữ số hex, không lẻ.</li>
<li><strong>Đổi cực dễ</strong> — tra từng nibble, không chia. Thập phân không có đường tắt đó vì 10 không phải luỹ thừa của 2.</li>
</ul>
<p>Cụm "mọi dãy chữ số nhị phân" là chỗ quan trọng: một lệnh máy (<code>0x8B45FC</code>), một màu (<code>#1E90FF</code>), một địa chỉ MAC (<code>3C:22:FB:…</code>), một dãy byte UTF-8 (<code>E1 BB 87</code> cho chữ "ệ") không phải số để tính toán — hex chỉ là cách viết dễ đọc các bit của chúng.</p>
<p class="nhan">Không có trên slide — bát phân (octal, cơ số 8)</p>
<p>Bát phân gom bit theo nhóm <strong>ba</strong> (chữ số 0–7). Nó còn sống ở một chỗ mọi lập trình viên đều gặp: quyền tệp Unix. <code>chmod 755</code> = 111 101 101 = rwx r-x r-x. Trong C, số 0 đứng đầu nghĩa là bát phân (<code>0755</code>), vì thế <code>int x = 010;</code> là tám chứ không phải mười.</p>`],

  [18, 'Summary — Chapter 10',
    `<p class="y-chinh">🎯 The chapter checklist: the decimal system, positional number systems, the binary system, converting between binary and decimal (integers and fractions), hexadecimal notation.</p>
<table>
<thead><tr><th>Task</th><th>Method</th><th>Read the result</th></tr></thead>
<tbody>
<tr><td>base r → decimal</td><td>Σ digit × r<sup>position</sup></td><td>—</td></tr>
<tr><td>decimal integer → binary</td><td>divide by 2 repeatedly</td><td>remainders, bottom → top</td></tr>
<tr><td>decimal fraction → binary</td><td>multiply by 2 repeatedly</td><td>integer digits, top → bottom</td></tr>
<tr><td>binary ↔ hex</td><td>groups of 4 bits from the point</td><td>one hex digit per nibble</td></tr>
<tr><td>binary ↔ octal</td><td>groups of 3 bits from the point</td><td>one octal digit per group</td></tr>
<tr><td>bits needed for N ≥ 1</td><td>⌊log<sub>2</sub> N⌋ + 1</td><td>k bits hold 2<sup>k</sup> values: 0 … 2<sup>k</sup> − 1</td></tr>
</tbody>
</table>
<p>The last row is not in the deck, but Chapter 11 (instruction formats) and Chapter 4 (cache address split) use it on every problem: 60 operations need ⌈log<sub>2</sub> 60⌉ = 6 opcode bits; a 4 GiB memory needs 32 address bits.</p>
<p class="meo">💡 Thirty-second self-test before moving on: convert 44 to binary and hex, 0.375 to binary, 0x3F to decimal. Answers: 101100, 0x2C; 0.011; 63.</p>`,
    `<p class="y-chinh">🎯 Bảng kiểm của chương: hệ thập phân, hệ đếm theo vị trí, hệ nhị phân, đổi giữa nhị phân và thập phân (phần nguyên và phần lẻ), ký pháp thập lục phân.</p>
<table>
<thead><tr><th>Việc</th><th>Cách làm</th><th>Đọc kết quả</th></tr></thead>
<tbody>
<tr><td>cơ số r → thập phân</td><td>Σ chữ số × r<sup>vị trí</sup></td><td>—</td></tr>
<tr><td>số nguyên thập phân → nhị phân</td><td>chia 2 liên tiếp</td><td>số dư, dưới → trên</td></tr>
<tr><td>phần lẻ thập phân → nhị phân</td><td>nhân 2 liên tiếp</td><td>phần nguyên, trên → dưới</td></tr>
<tr><td>nhị phân ↔ hex</td><td>nhóm 4 bit tính từ dấu phẩy</td><td>mỗi nibble một chữ số hex</td></tr>
<tr><td>nhị phân ↔ bát phân</td><td>nhóm 3 bit tính từ dấu phẩy</td><td>mỗi nhóm một chữ số bát phân</td></tr>
<tr><td>số bit cần cho N ≥ 1</td><td>⌊log<sub>2</sub> N⌋ + 1</td><td>k bit chứa 2<sup>k</sup> giá trị: 0 … 2<sup>k</sup> − 1</td></tr>
</tbody>
</table>
<p>Dòng cuối không có trong deck, nhưng Chương 11 (khuôn dạng lệnh) và Chương 4 (tách địa chỉ cache) dùng nó ở mọi bài: 60 thao tác cần ⌈log<sub>2</sub> 60⌉ = 6 bit opcode; bộ nhớ 4 GiB cần 32 bit địa chỉ.</p>
<p class="meo">💡 Tự kiểm 30 giây trước khi đi tiếp: đổi 44 sang nhị phân và hex, 0,375 sang nhị phân, 0x3F sang thập phân. Đáp án: 101100, 0x2C; 0,011; 63.</p>`],
]);

/* ───────────── Thực hành: chạy thật, sơ đồ, bẫy, bài tập, tự kiểm ───────────── */
const THUC_HANH = bi(`<h2>🔧 Hands-on: the conversions, run for real</h2>
<h3>The powers of 2 you will use all course</h3>
<table>
<thead><tr><th>k</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>10</th><th>16</th><th>20</th><th>30</th><th>32</th></tr></thead>
<tbody><tr><td>2<sup>k</sup></td><td>1</td><td>2</td><td>4</td><td>8</td><td>16</td><td>32</td><td>64</td><td>128</td><td>256</td><td>1024 (Ki)</td><td>65 536</td><td>1 048 576 (Mi)</td><td>≈ 1.07 × 10<sup>9</sup> (Gi)</td><td>4 294 967 296</td></tr></tbody>
</table>
<p class="ghi-chu">KiB/MiB/GiB = powers of 2 (1024); kB/MB/GB on a disk label = powers of 10 (1000). A "1 TB" disk shows about 931 GiB in the OS — no space is missing, the units differ.</p>
<h3>1 · The two conversion algorithms in C</h3>
<p>The program reproduces Figure 10.1 (11 and 21), Figure 10.2 (0.81 and 0.25), shows that 0.1 never terminates, and prints one value in every <code>printf</code> base. Compile with <code>gcc -std=c11 -Wall -Wextra -O2 cs1.c -o cs1 &amp;&amp; ./cs1</code>.</p>
` + code('c', C_DOI) + out(O_DOI) + `
<p>Read the last two lines: <code>%x</code>/<code>%X</code> print hex, <code>%o</code> octal, <code>%#x</code> adds the <code>0x</code> prefix, <code>%08X</code> pads to 8 digits — the format you will see for 32-bit values in every debugger.</p>
<h3>2 · How many bits does a number need?</h3>
` + code('python', PY_BIT) + out(O_BIT) + `
<p>Notice the jumps: 255 fits in 8 bits, 256 needs 9; 65535 fits in 16, and one million needs 20. One more bit doubles the range — that is why memory sizes, address spaces and hash tables are powers of 2.</p>
<h3>3 · Python's built-in converters (to check your hand work)</h3>
` + code('python', PY_CO_SAN) + out(O_CO_SAN) + `
<p>Line 2 confirms (1011)<sub>2</sub> = 11, (2C)<sub>16</sub> = 44, (777)<sub>8</sub> = 511 and the slide-6 trap (2401)<sub>7</sub> = 883; line 5 confirms slide 7's 1001.101<sub>2</sub> = 9.625.</p>
`,
`<h2>🔧 Thực hành: các phép đổi, chạy thật</h2>
<h3>Luỹ thừa của 2 bạn sẽ dùng suốt môn</h3>
<table>
<thead><tr><th>k</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>10</th><th>16</th><th>20</th><th>30</th><th>32</th></tr></thead>
<tbody><tr><td>2<sup>k</sup></td><td>1</td><td>2</td><td>4</td><td>8</td><td>16</td><td>32</td><td>64</td><td>128</td><td>256</td><td>1024 (Ki)</td><td>65 536</td><td>1 048 576 (Mi)</td><td>≈ 1,07 × 10<sup>9</sup> (Gi)</td><td>4 294 967 296</td></tr></tbody>
</table>
<p class="ghi-chu">KiB/MiB/GiB = luỹ thừa của 2 (1024); kB/MB/GB trên nhãn ổ đĩa = luỹ thừa của 10 (1000). Ổ "1 TB" hiện khoảng 931 GiB trong hệ điều hành — không mất chỗ nào, chỉ khác đơn vị.</p>
<h3>1 · Hai thuật toán đổi cơ số bằng C</h3>
<p>Chương trình làm lại Hình 10.1 (11 và 21), Hình 10.2 (0,81 và 0,25), cho thấy 0,1 không bao giờ dừng, và in một giá trị theo mọi cơ số của <code>printf</code>. Biên dịch: <code>gcc -std=c11 -Wall -Wextra -O2 cs1.c -o cs1 &amp;&amp; ./cs1</code>.</p>
` + code('c', C_DOI) + out(O_DOI) + `
<p>Đọc hai dòng cuối: <code>%x</code>/<code>%X</code> in hex, <code>%o</code> in bát phân, <code>%#x</code> thêm tiền tố <code>0x</code>, <code>%08X</code> đệm đủ 8 chữ số — đúng dạng bạn sẽ thấy cho giá trị 32 bit trong mọi trình gỡ lỗi.</p>
<h3>2 · Một số cần bao nhiêu bit?</h3>
` + code('python', PY_BIT) + out(O_BIT) + `
<p>Để ý các bước nhảy: 255 vừa 8 bit, 256 cần 9; 65535 vừa 16, còn một triệu cần 20. Thêm một bit là gấp đôi phạm vi — vì thế dung lượng bộ nhớ, không gian địa chỉ và bảng băm đều là luỹ thừa của 2.</p>
<h3>3 · Bộ đổi có sẵn của Python (để kiểm bài làm tay)</h3>
` + code('python', PY_CO_SAN) + out(O_CO_SAN) + `
<p>Dòng 2 xác nhận (1011)<sub>2</sub> = 11, (2C)<sub>16</sub> = 44, (777)<sub>8</sub> = 511 và cái bẫy ở slide 6 (2401)<sub>7</sub> = 883; dòng 5 xác nhận 1001,101<sub>2</sub> = 9,625 của slide 7.</p>
`);

const LAB = bi(thuNgay('en', 'bits', 'convert', 'Conversion step by step, the same divide-by-base method as slides 9–11 — for base 2, 8 or 16.', [
  'Enter <b>11</b> and <b>21</b>, base 2, and step through: the remainders must match Figure 10.1.',
  'Convert <b>200</b> to base 16 and to base 2 — then check that grouping the binary in fours gives the hex.',
  'Convert <b>493</b> to base 8, then explain why the octal digits are just groups of 3 bits.',
], { tour: 'bits-convert' }) + thuNgay('en', 'bits', 'play', 'The bit board: click bits on and off and watch decimal, hex and binary update together.', [
  'Make 255 with 8 bits, then add one bit — what is the smallest value that needs 9 bits?',
  'Switch to 16 bits and build <b>0xDEAD</b> by turning on the right nibbles.',
], { heading: false }),
thuNgay('vi', 'bits', 'convert', 'Đổi cơ số từng bước, đúng cách chia cho cơ số của slide 9–11 — cho cơ số 2, 8 hoặc 16.', [
  'Nhập <b>11</b> và <b>21</b>, cơ số 2, rồi đi từng bước: các số dư phải khớp Hình 10.1.',
  'Đổi <b>200</b> sang cơ số 16 và cơ số 2 — rồi kiểm rằng gom nhị phân theo nhóm 4 ra đúng hex.',
  'Đổi <b>493</b> sang cơ số 8, rồi giải thích vì sao các chữ số bát phân chỉ là nhóm 3 bit.',
], { tour: 'bits-convert' }) + thuNgay('vi', 'bits', 'play', 'Bảng bit: bấm bật/tắt từng bit và xem thập phân, hex, nhị phân cùng đổi.', [
  'Dựng 255 bằng 8 bit, rồi thêm một bit — giá trị nhỏ nhất cần tới 9 bit là bao nhiêu?',
  'Chuyển sang 16 bit và dựng <b>0xDEAD</b> bằng cách bật đúng các nibble.',
], { heading: false }));

const BAY_BAI_TAP = bi(`<h3>⚠️ Common traps</h3>
<div class="pitfall"><b>Reading the remainders downward.</b> 11 becomes 1101 (13) instead of 1011. Integer part: bottom-up; fractional part: top-down.</div>
<div class="pitfall"><b>Grouping hex from the left.</b> 1 0110 1100 grouped from the left as 1011 0110 0 is nonsense. Always group from the radix point outward and pad the far end with zeros: 0001 0110 1100 = 0x16C.</div>
<div class="pitfall"><b>Expecting 0.1 to be exact.</b> It repeats forever in binary; any fixed-width format stores an approximation. Treat "exact decimal fractions" as a property of base 10, not of numbers.</div>
<div class="pitfall"><b>A leading zero in C.</b> <code>int code = 010;</code> is 8 (octal). Never pad decimal constants with zeros in C/C++/Java.</div>
<h3>Exercises</h3>
<p><b>E1.</b> Convert 200 to binary and to hex.</p>
` + xem('Solution', `<p>200/2 = 100 r0, 100/2 = 50 r0, 50/2 = 25 r0, 25/2 = 12 r1, 12/2 = 6 r0, 6/2 = 3 r0, 3/2 = 1 r1, 1/2 = 0 r1 → bottom-up <b>11001000</b>. Nibbles 1100 1000 → <b>0xC8</b>. Check: 12 × 16 + 8 = 200.</p>`) + `
<p><b>E2.</b> Convert 0.375 to binary. Does it terminate?</p>
` + xem('Solution', `<p>0.375 × 2 = 0.75 → 0; 0.75 × 2 = 1.5 → 1; 0.5 × 2 = 1.0 → 1, fraction 0 → stop. Top-down: <b>0.011</b>, exact (0.375 = 3/8, denominator is a power of 2).</p>`) + `
<p><b>E3.</b> Convert 0x3F7 to binary and to decimal.</p>
` + xem('Solution', `<p>3 F 7 → 0011 1111 0111. Decimal: 3 × 256 + 15 × 16 + 7 = 768 + 240 + 7 = <b>1015</b>.</p>`) + `
<p><b>E4.</b> A university wants a fixed-width binary ID for up to 1 000 000 students. How many bits? How many IDs are left over?</p>
` + xem('Solution', `<p>2<sup>19</sup> = 524 288 &lt; 1 000 000 ≤ 2<sup>20</sup> = 1 048 576 → <b>20 bits</b> (the run above prints "1000000 … can 20 bit"). Spare IDs: 1 048 576 − 1 000 000 = 48 576.</p>`) + `
<p><b>E5.</b> What is 101101.11<sub>2</sub> in decimal?</p>
` + xem('Solution', `<p>32 + 8 + 4 + 1 = 45; .11 = 0.5 + 0.25 = 0.75 → <b>45.75</b>.</p>`) + `
<h3>Self-check</h3>
<ol>
<li>Why can a binary fraction like 0.01 be exact while 0.1 cannot?</li>
<li>How many hex digits does a 64-bit address have?</li>
<li>In base 16, what decimal value does "100" have?</li>
<li>How many different values fit in 12 bits, and what is the largest unsigned one?</li>
<li>Which C format specifier prints an <code>unsigned</code> as 8 upper-case hex digits with leading zeros?</li>
</ol>
` + xem('Answers', `<ol><li>0.01<sub>2</sub> = 1/4 (denominator a power of 2); 0.1 = 1/10 has the factor 5, so its binary expansion repeats.</li><li>16 (4 bits per hex digit).</li><li>256.</li><li>2<sup>12</sup> = 4096 values; largest 4095 = 0xFFF.</li><li><code>%08X</code>.</li></ol>`) + `
<h3>Where this connects</h3>
<ul>
<li>Next: ` + bai(COA, 'cea201-cs2-so-hoc-so-nguyen', '⭐ CS.2 — integer arithmetic and two\'s complement') + ` — what happens when the bits must also carry a sign.</li>
<li>Within CEA201: bit allocation in ` + bai(COA, 'cea201-11-0-slides-che-do-dia-chi-khuon-dang-lenh', '11.0 — addressing modes and instruction formats') + ` and the tag | index | offset split in ` + bai(COA, 'cea201-4-0b-slides-cache-anh-xa-truc-tiep', '4.0b — cache mapping') + ` both rest on "k bits ↔ 2<sup>k</sup> values".</li>
<li>Academy: ` + bai('programming-fundamentals', 'prf192-2-2-kieu-du-lieu', 'PRF192 2.2 — data types and how memory stores them') + ` · ` + bai('introduction-to-computer-science', 'csi104-2-1-he-vi-tri', 'CSI104 2.1 — positional systems') + ` · ` + bai('csi106-introduction-to-computer-science', 'csi106-2-1-number-systems', 'CSI106 2.1 — numbering systems') + `.</li>
<li>Courses: the file-permission bits (octal) come back in ` + bai('operating-systems-for-developers', 'os-1-1-tien-trinh', 'Operating Systems for Developers 1.1') + `.</li>
</ul>`,
`<h3>⚠️ Bẫy thường gặp</h3>
<div class="pitfall"><b>Đọc số dư từ trên xuống.</b> 11 thành 1101 (13) thay vì 1011. Phần nguyên: dưới lên; phần lẻ: trên xuống.</div>
<div class="pitfall"><b>Gom nhóm hex từ bên trái.</b> 1 0110 1100 gom từ trái thành 1011 0110 0 là vô nghĩa. Luôn gom từ dấu phẩy ra hai phía và đệm số 0 ở đầu xa: 0001 0110 1100 = 0x16C.</div>
<div class="pitfall"><b>Tưởng 0,1 là chính xác.</b> Nó lặp vô hạn ở hệ nhị phân; mọi định dạng độ rộng cố định chỉ lưu được giá trị xấp xỉ. "Phân số thập phân chính xác" là tính chất của cơ số 10, không phải của con số.</div>
<div class="pitfall"><b>Số 0 đứng đầu trong C.</b> <code>int code = 010;</code> là 8 (bát phân). Đừng bao giờ đệm số 0 vào hằng thập phân trong C/C++/Java.</div>
<h3>Bài tập</h3>
<p><b>E1.</b> Đổi 200 sang nhị phân và hex.</p>
` + xem('Lời giải', `<p>200/2 = 100 dư 0, 100/2 = 50 dư 0, 50/2 = 25 dư 0, 25/2 = 12 dư 1, 12/2 = 6 dư 0, 6/2 = 3 dư 0, 3/2 = 1 dư 1, 1/2 = 0 dư 1 → đọc dưới lên <b>11001000</b>. Nibble 1100 1000 → <b>0xC8</b>. Kiểm: 12 × 16 + 8 = 200.</p>`) + `
<p><b>E2.</b> Đổi 0,375 sang nhị phân. Có dừng không?</p>
` + xem('Lời giải', `<p>0,375 × 2 = 0,75 → 0; 0,75 × 2 = 1,5 → 1; 0,5 × 2 = 1,0 → 1, phần lẻ 0 → dừng. Đọc trên xuống: <b>0,011</b>, chính xác (0,375 = 3/8, mẫu là luỹ thừa của 2).</p>`) + `
<p><b>E3.</b> Đổi 0x3F7 sang nhị phân và thập phân.</p>
` + xem('Lời giải', `<p>3 F 7 → 0011 1111 0111. Thập phân: 3 × 256 + 15 × 16 + 7 = 768 + 240 + 7 = <b>1015</b>.</p>`) + `
<p><b>E4.</b> Một trường cần mã nhị phân độ rộng cố định cho tối đa 1 000 000 sinh viên. Cần bao nhiêu bit? Dư bao nhiêu mã?</p>
` + xem('Lời giải', `<p>2<sup>19</sup> = 524 288 &lt; 1 000 000 ≤ 2<sup>20</sup> = 1 048 576 → <b>20 bit</b> (lần chạy ở trên in "1000000 … can 20 bit"). Mã dư: 1 048 576 − 1 000 000 = 48 576.</p>`) + `
<p><b>E5.</b> 101101,11<sub>2</sub> bằng bao nhiêu ở hệ thập phân?</p>
` + xem('Lời giải', `<p>32 + 8 + 4 + 1 = 45; ,11 = 0,5 + 0,25 = 0,75 → <b>45,75</b>.</p>`) + `
<h3>Tự kiểm</h3>
<ol>
<li>Vì sao phần lẻ nhị phân 0,01 chính xác được còn 0,1 thì không?</li>
<li>Một địa chỉ 64 bit có bao nhiêu chữ số hex?</li>
<li>Ở cơ số 16, "100" có giá trị thập phân bao nhiêu?</li>
<li>12 bit chứa được bao nhiêu giá trị khác nhau, giá trị không dấu lớn nhất là bao nhiêu?</li>
<li>Đặc tả định dạng nào của C in một <code>unsigned</code> thành 8 chữ số hex viết hoa, có số 0 đứng đầu?</li>
</ol>
` + xem('Đáp án', `<ol><li>0,01<sub>2</sub> = 1/4 (mẫu là luỹ thừa của 2); 0,1 = 1/10 có thừa số 5, nên khai triển nhị phân lặp lại.</li><li>16 (mỗi chữ số hex 4 bit).</li><li>256.</li><li>2<sup>12</sup> = 4096 giá trị; lớn nhất 4095 = 0xFFF.</li><li><code>%08X</code>.</li></ol>`) + `
<h3>Liên kết</h3>
<ul>
<li>Tiếp theo: ` + bai(COA, 'cea201-cs2-so-hoc-so-nguyen', '⭐ CS.2 — số học số nguyên và bù hai') + ` — chuyện gì xảy ra khi các bit còn phải mang cả dấu.</li>
<li>Trong CEA201: phân bổ bit ở ` + bai(COA, 'cea201-11-0-slides-che-do-dia-chi-khuon-dang-lenh', '11.0 — chế độ địa chỉ và khuôn dạng lệnh') + ` và tách tag | index | offset ở ` + bai(COA, 'cea201-4-0b-slides-cache-anh-xa-truc-tiep', '4.0b — ánh xạ cache') + ` đều dựa trên "k bit ↔ 2<sup>k</sup> giá trị".</li>
<li>Academy: ` + bai('programming-fundamentals', 'prf192-2-2-kieu-du-lieu', 'PRF192 2.2 — kiểu dữ liệu và cách bộ nhớ lưu') + ` · ` + bai('introduction-to-computer-science', 'csi104-2-1-he-vi-tri', 'CSI104 2.1 — hệ vị trí') + ` · ` + bai('csi106-introduction-to-computer-science', 'csi106-2-1-number-systems', 'CSI106 2.1 — hệ đếm') + `.</li>
<li>Courses: các bit quyền tệp (bát phân) quay lại ở ` + bai('operating-systems-for-developers', 'os-1-1-tien-trinh', 'Operating Systems for Developers 1.1') + `.</li>
</ul>`);

export default {
  title: '⭐ CS.1 — Number systems: binary, hexadecimal & base conversion (deck CEA10, 18 slides)|||⭐ CS.1 — Hệ đếm: nhị phân, thập lục phân & đổi cơ số (deck CEA10, 18 slide)',
  slug: 'cea201-cs1-he-dem',
  type: 'DOCUMENT',
  description: 'Phần ⭐ Chuyên sâu web bổ sung (deck chính hãng Chapter 10 "Number Systems" — có trong bộ slide nhưng không nằm trong lịch học): giảng trọn 18 slide — hệ theo vị trí và trọng số, cơ số 7 làm khởi động, nhị phân có phần lẻ, đổi phần nguyên bằng chia 2 (đọc số dư dưới lên) và phần lẻ bằng nhân 2 (đọc trên xuống) kèm chứng minh, vì sao 0,1 lặp vô hạn, thập lục phân theo nibble, bảng 10.3; bổ sung bát phân (chmod 755), số bit cần cho N, KiB vs kB; chương trình C/Python chạy thật tái hiện Hình 10.1–10.2 và printf %x/%o/%#x; bảng bit tương tác; bài tập che lời giải, tự kiểm, nêu lỗi gõ ở slide 3.',
  content: [MO_DAU, walkHead(D, 1, 18,
    'This deck is in the official slide set but not in the session schedule — added here as a ⭐ foundation lesson.',
    'Deck này có trong bộ slide chính hãng nhưng không có trong lịch học — web thêm vào thành bài nền ⭐.'),
  SLIDES, THUC_HANH, LAB, BAY_BAI_TAP].join('\n'),
};
