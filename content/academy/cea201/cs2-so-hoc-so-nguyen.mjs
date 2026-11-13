/**
 * CEA201 · ⭐ CS.2 — Số học số nguyên (deck 'cea11' = Chapter 11 "Computer Arithmetic",
 * slide 1–30: ALU, dấu–độ lớn, bù hai, mở rộng dấu, đổi dấu, cộng/trừ/tràn, nhân, Booth, chia).
 *
 * Phần ⭐ Chuyên sâu do web BỔ SUNG — deck có trong bộ slide chính hãng nhưng không nằm trong
 * lịch 60 buổi (xem _slides.mjs). Slide 31–55 (dấu phẩy động) là bài CS.3.
 *
 * Chạy thật: container node:22 (Debian 12, GCC 12.2.0, Python 3.11.2, aarch64).
 * Bộ mô phỏng Booth/chia/cộng 4 bit cho ra ĐÚNG các bảng của Hình 11.3, 11.13, 11.14, 11.15, 11.17.
 *
 * Chỗ slide gốc SAI/THIẾU (nêu thẳng trong bài):
 *   · slide 7 (Table 11.2): nhãn hai dòng "+0" và "−0" bị ĐẢO — trong dấu–độ lớn 0000 là +0,
 *     1000 là −0 (slide ghi "−0 = 0000" và "+0 = 1000").
 *   · slide 21 (Fig 11.8b): chú thích "Example from Figure 9.7" là số hình của bản cũ — phải là Fig 11.7.
 *   · slide 5, 10: chỉ có SmartArt, không có thân chữ — đã đọc từ ảnh render.
 *   · deck KHÔNG nói gì về tràn số trong ngôn ngữ thật (C: có dấu = hành vi không xác định,
 *     không dấu = quay vòng) → bổ sung bằng chương trình chạy thật với -O0/-O2/-fwrapv/UBSan.
 */
import { walk, walkHead, bi } from './_slides.mjs';
import { code, out, xem, bai } from './_cs.mjs';
import { thuNgay } from '../../_labs.mjs';

const D = 'cea11';
const COA = 'computer-organization-and-architecture';

const C_BU2 = String.raw`
#include <stdio.h>
#include <stdint.h>
#include <limits.h>

/* In w bit thap cua x, nhom 4 bit cho de doc */
void inBit(const char *ten, uint32_t x, int w) {
    printf("%-14s", ten);
    for (int i = w - 1; i >= 0; i--) {
        putchar((x >> i) & 1 ? '1' : '0');
        if (i % 4 == 0 && i) putchar(' ');
    }
    putchar('\n');
}

int main(void) {
    int8_t  a8  = -5;
    int32_t a32 = -5;
    inBit("+5  (8 bit)", (uint8_t)5, 8);
    inBit("-5  (8 bit)", (uint8_t)a8, 8);
    inBit("-5 (32 bit)", (uint32_t)a32, 32);
    printf("-5 doc nhu so KHONG dau: 8 bit = %u, 32 bit = %u\n",
           (unsigned)(uint8_t)a8, (unsigned)(uint32_t)a32);

    /* Mo rong dau: int8_t -> int32_t chep bit dau sang trai */
    int32_t mo = a8;
    printf("int8_t -5 mo rong thanh int32_t = %d (0x%08X)\n", mo, (unsigned)mo);

    /* Dao bit + 1 = doi dau (slide 11) */
    uint8_t x = 18;
    uint8_t dao = (uint8_t)~x;
    uint8_t am = (uint8_t)(dao + 1);
    inBit("+18", x, 8); inBit("dao bit", dao, 8); inBit("+1 => -18", am, 8);
    printf("doc am lai: %d\n", (int8_t)am);

    /* Hai truong hop dac biet (slide 12-13) */
    int8_t m = INT8_MIN;                /* -128 */
    printf("INT8_MIN = %d, doi dau trong 8 bit = %d\n", m, (int8_t)(uint8_t)(0u - (uint8_t)m));
    printf("INT_MIN = %d, INT_MAX = %d\n", INT_MIN, INT_MAX);
    printf("sizeof(int) = %zu byte\n", sizeof(int));
    return 0;
}
`;
const O_BU2 = String.raw`
+5  (8 bit)   0000 0101
-5  (8 bit)   1111 1011
-5 (32 bit)   1111 1111 1111 1111 1111 1111 1111 1011
-5 doc nhu so KHONG dau: 8 bit = 251, 32 bit = 4294967291
int8_t -5 mo rong thanh int32_t = -5 (0xFFFFFFFB)
+18           0001 0010
dao bit       1110 1101
+1 => -18     1110 1110
doc am lai: -18
INT8_MIN = -128, doi dau trong 8 bit = -128
INT_MIN = -2147483648, INT_MAX = 2147483647
sizeof(int) = 4 byte
`;
const C_TRAN = String.raw`
#include <stdio.h>
#include <limits.h>

/* Cau hoi ngay tho: "x + 1 co lon hon x khong?" */
int lonHon(int x) {
    int y = x + 1;          /* x = INT_MAX thi day la tran so CO DAU */
    return y > x;
}

int main(void) {
    unsigned u = UINT_MAX;
    printf("UINT_MAX + 1 = %u   (khong dau: quay vong, chuan C cho phep)\n", u + 1);
    printf("0u - 1       = %u\n", 0u - 1);
    printf("lonHon(INT_MAX) = %d\n", lonHon(INT_MAX));
    return 0;
}
`;
const O_TRAN = String.raw`
UINT_MAX + 1 = 0   (khong dau: quay vong, chuan C cho phep)
0u - 1       = 4294967295
lonHon(INT_MAX) = 0
`;
const SH_TRAN = String.raw`
gcc -std=c11 -Wall -Wextra -O0 cs2_tran.c -o t && ./t | tail -1
gcc -std=c11 -Wall -Wextra -O2 cs2_tran.c -o t && ./t | tail -1
gcc -std=c11 -Wall -Wextra -O2 -fwrapv cs2_tran.c -o t && ./t | tail -1
gcc -std=c11 -Wall -Wextra -O0 -fsanitize=undefined cs2_tran.c -o t && ./t
`;
const O_TRAN_CO = String.raw`
lonHon(INT_MAX) = 0          <- -O0: phep cong that su quay vong
lonHon(INT_MAX) = 1          <- -O2: trinh dich coi "x+1 > x" luon dung
lonHon(INT_MAX) = 0          <- -O2 -fwrapv: buoc quay vong kieu bu 2
UINT_MAX + 1 = 0   (khong dau: quay vong, chuan C cho phep)
0u - 1       = 4294967295
cs2_tran.c:6:9: runtime error: signed integer overflow: 2147483647 + 1 cannot be represented in type 'int'
lonHon(INT_MAX) = 0
`;
const C_SOSANH = String.raw`
#include <stdio.h>

int main(void) {
    int a = -1;
    unsigned b = 1;
    if (a < b) printf("-1 < 1u: dung\n");
    else       printf("-1 < 1u: SAI vi -1 bi doi thanh %u\n", (unsigned)a);

    unsigned n = 3;
    int vong = 0;
    for (unsigned i = n - 1; i < n; i--)   /* cach dem lui an toan voi unsigned */
        vong++;
    printf("dem lui 2,1,0 bang unsigned: %d vong\n", vong);
    return 0;
}
`;
const O_SOSANH = String.raw`
-1 < 1u: SAI vi -1 bi doi thanh 4294967295
dem lui 2,1,0 bang unsigned: 3 vong
`;
const O_SOSANH_WARN = String.raw`
cs2_sosanh.c:6:11: warning: comparison of integer expressions of different signedness: 'int' and 'unsigned int' [-Wsign-compare]
    6 |     if (a < b) printf("-1 < 1u: dung\n");
      |           ^
`;
const PY_CONG = String.raw`
# Cong hai so 4 bit bu 2, ap dung LUAT TRAN cua slide 15 (khong nhin vao bit nho)
def s4(v):            # doc 4 bit thanh so co dau
    return v - 16 if v & 8 else v
def cong(a, b):
    ua, ub = a & 15, b & 15
    tong = ua + ub
    r = tong & 15
    nho = tong >> 4
    tran = (s4(ua) >= 0) == (s4(ub) >= 0) and (s4(r) >= 0) != (s4(ua) >= 0)
    print(f"{ua:04b} + {ub:04b} = {nho}|{r:04b}  -> {a:+d} + {b:+d} = {s4(r):+d}"
          f"   nho ra={nho}  {'TRAN!' if tran else 'dung'}")
for a, b in [(-7, 5), (-4, 4), (3, 4), (-4, -1), (5, 4), (-7, -6)]:
    cong(a, b)
`;
const O_CONG = String.raw`
1001 + 0101 = 0|1110  -> -7 + +5 = -2   nho ra=0  dung
1100 + 0100 = 1|0000  -> -4 + +4 = +0   nho ra=1  dung
0011 + 0100 = 0|0111  -> +3 + +4 = +7   nho ra=0  dung
1100 + 1111 = 1|1011  -> -4 + -1 = -5   nho ra=1  dung
0101 + 0100 = 0|1001  -> +5 + +4 = -7   nho ra=0  TRAN!
1001 + 1010 = 1|0011  -> -7 + -6 = +3   nho ra=1  TRAN!
`;
const PY_BOOTH = String.raw`
# Thuat toan Booth (Fig 11.12) - n bit, in tung chu ky nhu Fig 11.13
def bits(v, n): return format(v & ((1 << n) - 1), f"0{n}b")
def booth(m, q, n=4):
    mask = (1 << n) - 1
    A, Q, Q_1, M = 0, q & mask, 0, m & mask
    print(f"  {'A':<{n}}  {'Q':<{n}}  Q-1  {'M':<{n}}")
    print(f"  {bits(A,n)}  {bits(Q,n)}   {Q_1}   {bits(M,n)}   khoi tao")
    for chu_ky in range(1, n + 1):
        cap = (Q & 1, Q_1)
        if cap == (1, 0):
            A = (A - M) & mask
            print(f"  {bits(A,n)}  {bits(Q,n)}   {Q_1}   {bits(M,n)}   A <- A - M")
        elif cap == (0, 1):
            A = (A + M) & mask
            print(f"  {bits(A,n)}  {bits(Q,n)}   {Q_1}   {bits(M,n)}   A <- A + M")
        # dich phai SO HOC A,Q,Q-1 (giu bit dau cua A)
        Q_1 = Q & 1
        Q = ((Q >> 1) | ((A & 1) << (n - 1))) & mask
        A = ((A >> 1) | (A & (1 << (n - 1)))) & mask
        print(f"  {bits(A,n)}  {bits(Q,n)}   {Q_1}   {bits(M,n)}   dich phai  (chu ky {chu_ky})")
    kq = (A << n) | Q
    if kq & (1 << (2 * n - 1)): kq -= 1 << (2 * n)
    print(f"  => A Q = {bits(A,n)} {bits(Q,n)} = {kq}\n")
for m, q in [(7, 3), (7, -3), (-7, 3), (-7, -3)]:
    print(f"Booth: {m} x {q}")
    booth(m, q)
`;
const O_BOOTH = String.raw`
Booth: 7 x 3
  A     Q     Q-1  M
  0000  0011   0   0111   khoi tao
  1001  0011   0   0111   A <- A - M
  1100  1001   1   0111   dich phai  (chu ky 1)
  1110  0100   1   0111   dich phai  (chu ky 2)
  0101  0100   1   0111   A <- A + M
  0010  1010   0   0111   dich phai  (chu ky 3)
  0001  0101   0   0111   dich phai  (chu ky 4)
  => A Q = 0001 0101 = 21

Booth: 7 x -3
  A     Q     Q-1  M
  0000  1101   0   0111   khoi tao
  1001  1101   0   0111   A <- A - M
  1100  1110   1   0111   dich phai  (chu ky 1)
  0011  1110   1   0111   A <- A + M
  0001  1111   0   0111   dich phai  (chu ky 2)
  1010  1111   0   0111   A <- A - M
  1101  0111   1   0111   dich phai  (chu ky 3)
  1110  1011   1   0111   dich phai  (chu ky 4)
  => A Q = 1110 1011 = -21

Booth: -7 x 3
  A     Q     Q-1  M
  0000  0011   0   1001   khoi tao
  0111  0011   0   1001   A <- A - M
  0011  1001   1   1001   dich phai  (chu ky 1)
  0001  1100   1   1001   dich phai  (chu ky 2)
  1010  1100   1   1001   A <- A + M
  1101  0110   0   1001   dich phai  (chu ky 3)
  1110  1011   0   1001   dich phai  (chu ky 4)
  => A Q = 1110 1011 = -21

Booth: -7 x -3
  A     Q     Q-1  M
  0000  1101   0   1001   khoi tao
  0111  1101   0   1001   A <- A - M
  0011  1110   1   1001   dich phai  (chu ky 1)
  1100  1110   1   1001   A <- A + M
  1110  0111   0   1001   dich phai  (chu ky 2)
  0101  0111   0   1001   A <- A - M
  0010  1011   1   1001   dich phai  (chu ky 3)
  0001  0101   1   1001   dich phai  (chu ky 4)
  => A Q = 0001 0101 = 21
`;
const PY_CHIA = String.raw`
# Chia khong dau kieu "phuc hoi" (Fig 11.16): A,Q dich trai; A <- A - M; am thi phuc hoi
def bits(v, n): return format(v & ((1 << n) - 1), f"0{n}b")
def chia(bichia, chia_cho, n=4):
    A, Q, M = 0, bichia, chia_cho
    print(f"{bichia} / {chia_cho}:  A    Q")
    for i in range(n):
        AQ = ((A << n) | Q) << 1                  # dich trai A,Q
        A, Q = (AQ >> n) & ((1 << n) - 1), AQ & ((1 << n) - 1)
        A2 = A - M
        if A2 < 0:
            print(f"   dich, tru -> am, phuc hoi: {bits(A,n)} {bits(Q,n)}   Q0 = 0")
        else:
            A, Q = A2, Q | 1
            print(f"   dich, tru -> duong       : {bits(A,n)} {bits(Q,n)}   Q0 = 1")
    print(f"   => thuong Q = {Q}, du A = {A}\n")
chia(7, 3)
chia(147, 11, n=8)
`;
const O_CHIA = String.raw`
7 / 3:  A    Q
   dich, tru -> am, phuc hoi: 0000 1110   Q0 = 0
   dich, tru -> am, phuc hoi: 0001 1100   Q0 = 0
   dich, tru -> duong       : 0000 1001   Q0 = 1
   dich, tru -> am, phuc hoi: 0001 0010   Q0 = 0
   => thuong Q = 2, du A = 1

147 / 11:  A    Q
   dich, tru -> am, phuc hoi: 00000001 00100110   Q0 = 0
   dich, tru -> am, phuc hoi: 00000010 01001100   Q0 = 0
   dich, tru -> am, phuc hoi: 00000100 10011000   Q0 = 0
   dich, tru -> am, phuc hoi: 00001001 00110000   Q0 = 0
   dich, tru -> duong       : 00000111 01100001   Q0 = 1
   dich, tru -> duong       : 00000011 11000011   Q0 = 1
   dich, tru -> am, phuc hoi: 00000111 10000110   Q0 = 0
   dich, tru -> duong       : 00000100 00001101   Q0 = 1
   => thuong Q = 13, du A = 4
`;

/* ───────────── Mở đầu ───────────── */
const MO_DAU = bi(`<span class="eyebrow">⭐ Advanced · Lesson CS.2 · official deck CEA11 (Stallings Ch.11), slides 1–30 · added by this site</span>
<h2>Integer arithmetic: how negative numbers live in bits, why overflow happens, and how the ALU multiplies and divides</h2>
<p class="lead">Lesson CS.1 gave you unsigned binary. Real programs also need negative numbers, and the hardware must add, subtract, multiply and divide them with simple circuits. This lesson shows the representation every modern CPU uses — <strong>two's complement</strong> — and the algorithms of the ALU, including Booth's multiplication, each run step by step.</p>
<p class="nhan">Source: official Stallings slide set (COA 11e, Global Edition), Chapter 11 "Computer Arithmetic", slides 1–30 — deck CEA11 · in the course's slide set but NOT in the 60-session schedule</p>
<div class="note-ct">Added by CuongThai (not a school requirement). Slides 31–55 of the same deck — floating point — are lesson ⭐ CS.3.</div>
<h3>Why this is worth your time — three real overflows</h3>
<table>
<thead><tr><th>Case</th><th>The number that ran out</th><th>What happened</th></tr></thead>
<tbody>
<tr><td>YouTube, Dec 2014</td><td>2<sup>31</sup> − 1 = 2 147 483 647 (largest 32-bit signed int)</td><td>"Gangnam Style" passed that many views; YouTube had already moved the counter to 64 bits and said so publicly.</td></tr>
<tr><td>Boeing 787, 2015</td><td>2<sup>31</sup> hundredths of a second ≈ 248.55 days</td><td>The FAA ordered operators to power-cycle the aircraft, because a counter in the generator control units could overflow after 248 days of continuous power and shut the generators down.</td></tr>
<tr><td>Year 2038</td><td>2<sup>31</sup> − 1 seconds after 1970-01-01</td><td>A signed 32-bit <code>time_t</code> overflows at 2038-01-19 03:14:07 UTC + 1 s and jumps back to 1901.</td></tr>
</tbody>
</table>
<p>All three are the same arithmetic: a fixed number of bits, two's complement, and an addition that went one step too far. After this lesson you can compute those limits yourself and predict the wrap-around.</p>
<h3>Map of the slides</h3>
<table>
<thead><tr><th>Slides</th><th>Idea</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>The ALU and integer representation</td><td>say what goes into and out of an ALU, and why there is no "minus sign" in hardware</td></tr>
<tr><td>5–10</td><td>Sign-magnitude, two's complement, biased, fixed point</td><td>encode/decode 4- and 8-bit integers three ways, extend the width correctly</td></tr>
<tr><td>11–19</td><td>Negation, addition, subtraction, overflow, hardware</td><td>negate, add, subtract and detect overflow with the sign rule</td></tr>
<tr><td>20–27</td><td>Multiplication, Booth's algorithm</td><td>run the shift-and-add multiplier and Booth's algorithm by hand</td></tr>
<tr><td>28–30</td><td>Division</td><td>run restoring division and read quotient and remainder</td></tr>
</tbody>
</table>
<div class="callout">Every output below comes from Docker <code>node:22</code> (Debian 12, GCC 12.2.0, Python 3.11.2, aarch64). The integer results are identical on an x86-64 laptop: both use 32-bit two's-complement <code>int</code>.</div>`,
`<span class="eyebrow">⭐ Chuyên sâu · Bài CS.2 · deck chính hãng CEA11 (Stallings Ch.11), slide 1–30 · web bổ sung</span>
<h2>Số học số nguyên: số âm sống trong bit thế nào, vì sao tràn số xảy ra, và ALU nhân, chia ra sao</h2>
<p class="lead">Bài CS.1 cho bạn nhị phân không dấu. Chương trình thật còn cần số âm, và phần cứng phải cộng, trừ, nhân, chia chúng bằng mạch đơn giản. Bài này cho thấy cách biểu diễn mọi CPU ngày nay dùng — <strong>bù hai</strong> (two's complement) — và các thuật toán của ALU, kể cả phép nhân Booth, chạy từng bước.</p>
<p class="nhan">Nguồn: bộ slide chính hãng Stallings (COA 11e, Global Edition), Chapter 11 "Computer Arithmetic", slide 1–30 — deck CEA11 · có trong bộ slide của môn nhưng KHÔNG nằm trong lịch 60 buổi</p>
<div class="note-ct">CuongThai bổ sung (không phải quy định của trường). Slide 31–55 của cùng deck — dấu phẩy động — là bài ⭐ CS.3.</div>
<h3>Vì sao đáng học — ba vụ tràn số thật</h3>
<table>
<thead><tr><th>Vụ</th><th>Con số bị cạn</th><th>Chuyện gì xảy ra</th></tr></thead>
<tbody>
<tr><td>YouTube, 12/2014</td><td>2<sup>31</sup> − 1 = 2 147 483 647 (int có dấu 32 bit lớn nhất)</td><td>"Gangnam Style" vượt ngần ấy lượt xem; YouTube đã chuyển bộ đếm sang 64 bit từ trước và nói công khai điều đó.</td></tr>
<tr><td>Boeing 787, 2015</td><td>2<sup>31</sup> phần trăm giây ≈ 248,55 ngày</td><td>FAA buộc hãng bay tắt–bật lại nguồn máy bay định kỳ, vì một bộ đếm trong khối điều khiển máy phát có thể tràn sau 248 ngày cấp điện liên tục và tắt máy phát.</td></tr>
<tr><td>Năm 2038</td><td>2<sup>31</sup> − 1 giây sau 01/01/1970</td><td><code>time_t</code> có dấu 32 bit tràn ở 2038-01-19 03:14:07 UTC + 1 giây và nhảy ngược về năm 1901.</td></tr>
</tbody>
</table>
<p>Cả ba là cùng một phép tính: số bit cố định, bù hai, và một phép cộng đi quá một bước. Học xong bài này bạn tự tính được các giới hạn đó và đoán trước được chỗ quay vòng.</p>
<h3>Bản đồ slide</h3>
<table>
<thead><tr><th>Slide</th><th>Ý chính</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>ALU và biểu diễn số nguyên</td><td>nói được cái gì vào/ra một ALU, và vì sao phần cứng không có "dấu trừ"</td></tr>
<tr><td>5–10</td><td>Dấu–độ lớn, bù hai, số lệch (biased), dấu phẩy tĩnh</td><td>mã hoá/giải mã số 4 và 8 bit theo ba cách, mở rộng độ rộng cho đúng</td></tr>
<tr><td>11–19</td><td>Đổi dấu, cộng, trừ, tràn số, phần cứng</td><td>đổi dấu, cộng, trừ và phát hiện tràn bằng luật dấu</td></tr>
<tr><td>20–27</td><td>Phép nhân, thuật toán Booth</td><td>chạy tay bộ nhân dịch-và-cộng và thuật toán Booth</td></tr>
<tr><td>28–30</td><td>Phép chia</td><td>chạy phép chia phục hồi và đọc thương, số dư</td></tr>
</tbody>
</table>
<div class="callout">Mọi output dưới đây lấy từ Docker <code>node:22</code> (Debian 12, GCC 12.2.0, Python 3.11.2, aarch64). Kết quả số nguyên y hệt trên laptop x86-64: cả hai đều dùng <code>int</code> bù hai 32 bit.</div>`);

/* ───────────── Giảng theo từng slide ───────────── */
const SLIDES = walk(D, [
  [1, 'Chapter 11 — Computer Arithmetic (title slide)',
    `<p class="y-chinh">🎯 Chapter 11 answers one question in two halves: how does the ALU represent numbers and compute with them — first integers (slides 2–30, this lesson), then floating point (slides 31–55, lesson CS.3).</p>
<p>Chapter 9 of this course built adders out of gates. Chapter 11 sits one level up: given an n-bit adder, how do we represent <em>negative</em> numbers so the same adder still works, how do we notice that a result does not fit, and how do we build multiply and divide out of add, subtract and shift?</p>
<p class="meo">💡 Keep the two halves apart in your head: integers are exact but have a hard range; floating point has an enormous range but is approximate. Most arithmetic bugs come from forgetting which of the two you are in.</p>`,
    `<p class="y-chinh">🎯 Chương 11 trả lời một câu hỏi theo hai nửa: ALU biểu diễn số và tính toán với chúng thế nào — trước là số nguyên (slide 2–30, bài này), sau là dấu phẩy động (slide 31–55, bài CS.3).</p>
<p>Chương 9 của môn đã dựng bộ cộng từ cổng logic. Chương 11 đứng cao hơn một tầng: có sẵn bộ cộng n bit rồi, ta biểu diễn số <em>âm</em> thế nào để vẫn dùng đúng bộ cộng đó, làm sao biết một kết quả không vừa, và dựng phép nhân, chia từ cộng, trừ, dịch bit ra sao?</p>
<p class="meo">💡 Tách hai nửa trong đầu: số nguyên chính xác nhưng có phạm vi cứng; dấu phẩy động có phạm vi khổng lồ nhưng xấp xỉ. Phần lớn lỗi số học sinh ra từ việc quên mình đang ở nửa nào.</p>`],

  [2, 'Arithmetic & Logic Unit (ALU)',
    `<p class="y-chinh">🎯 The ALU is the part of the processor that actually computes — arithmetic and logic on data. Everything else in the computer exists mainly to bring data to the ALU and carry results away.</p>
<p>That sentence is worth re-reading with the earlier chapters in mind: registers (Chapter 12) hold the operands close to the ALU, cache and memory (Chapters 4–5) feed it, buses (Chapter 3) carry the traffic, the control unit (lesson CS.4) tells it which operation to do. The ALU itself is built from the simple logic devices of Chapter 9 — gates that store and combine bits.</p>
<p class="meo">💡 Picture a kitchen: the ALU is the stove, everything else is the fridge, the shelves and the person carrying ingredients. A faster stove is useless if the ingredients arrive slowly — the whole memory-hierarchy story of this course in one image.</p>`,
    `<p class="y-chinh">🎯 ALU (khối số học và logic) là phần của bộ xử lý thật sự tính toán — phép số học và phép logic trên dữ liệu. Mọi thứ khác trong máy chủ yếu tồn tại để mang dữ liệu tới ALU và mang kết quả đi.</p>
<p>Đọc lại câu đó cùng các chương trước: thanh ghi (Chương 12) giữ toán hạng sát ALU, cache và bộ nhớ (Chương 4–5) nuôi nó, bus (Chương 3) chở lưu lượng, khối điều khiển (bài CS.4) bảo nó làm phép nào. Bản thân ALU dựng từ các linh kiện logic đơn giản của Chương 9 — cổng lưu và kết hợp bit.</p>
<p class="meo">💡 Hình dung một căn bếp: ALU là cái bếp, mọi thứ khác là tủ lạnh, kệ và người chạy mang nguyên liệu. Bếp nhanh hơn cũng vô ích nếu nguyên liệu tới chậm — cả câu chuyện phân cấp bộ nhớ của môn này gói trong một hình ảnh.</p>`],

  [3, 'Figure 11.1 ALU Inputs and Outputs',
    `<p class="y-chinh">🎯 Four kinds of wires: <strong>control signals</strong> and <strong>operand registers</strong> go in; <strong>result registers</strong> and <strong>flags</strong> come out.</p>
<ul>
<li><strong>Control signals</strong> (from the control unit): which operation — add, subtract, AND, shift…</li>
<li><strong>Operand registers</strong>: the input numbers (thick arrows — many bits wide).</li>
<li><strong>Result registers</strong>: where the answer goes.</li>
<li><strong>Flags</strong>: single bits that describe the result — Zero, Negative (sign), Carry, Overflow. Branch instructions read them: <code>if (a &lt; b)</code> compiles to a subtraction followed by a jump that tests flags.</li>
</ul>
<p>The overflow flag on this figure is exactly what slide 15 will compute, and the "OF" box on slide 19 is where it is stored.</p>
<p class="meo">💡 The ALU itself has no memory: values sit in registers before and after. That is why lesson CS.4 talks about "signals that open the path from register X to the ALU".</p>`,
    `<p class="y-chinh">🎯 Bốn loại dây: <strong>tín hiệu điều khiển</strong> và <strong>thanh ghi toán hạng</strong> đi vào; <strong>thanh ghi kết quả</strong> và <strong>cờ</strong> (flags) đi ra.</p>
<ul>
<li><strong>Tín hiệu điều khiển</strong> (từ khối điều khiển): làm phép gì — cộng, trừ, AND, dịch…</li>
<li><strong>Thanh ghi toán hạng</strong>: các số đầu vào (mũi tên đậm — rộng nhiều bit).</li>
<li><strong>Thanh ghi kết quả</strong>: nơi đặt đáp án.</li>
<li><strong>Cờ</strong>: các bit đơn mô tả kết quả — Zero, Negative (dấu), Carry (nhớ), Overflow (tràn). Lệnh rẽ nhánh đọc chúng: <code>if (a &lt; b)</code> được dịch thành một phép trừ rồi một lệnh nhảy kiểm cờ.</li>
</ul>
<p>Cờ tràn trên hình chính là thứ slide 15 sẽ tính, và ô "OF" ở slide 19 là nơi lưu nó.</p>
<p class="meo">💡 Bản thân ALU không có bộ nhớ: giá trị nằm trong thanh ghi trước và sau phép tính. Vì thế bài CS.4 nói về "tín hiệu mở đường từ thanh ghi X tới ALU".</p>`],

  [4, 'Integer Representation',
    `<p class="y-chinh">🎯 On paper we write −1101.0101 with a minus sign and a radix point. In a register there are only 0s and 1s — no extra symbol for "minus" or "point". So the sign and the point must be <strong>encoded in the bits themselves</strong> or agreed in advance.</p>
<p>This is the design problem of the whole chapter. For the sign there are several possible conventions (next slides: sign-magnitude, two's complement, biased). For the point there are two families: <em>fixed point</em> (slide 10 — the point is at an agreed place) and <em>floating point</em> (lesson CS.3 — the position of the point is stored as an exponent).</p>
<p class="meo">💡 Key idea to carry everywhere: <strong>bits have no meaning on their own</strong>. 1111 1011 is 251 if you read it unsigned and −5 if you read it as two's complement. The program (its type: <code>unsigned char</code> vs <code>signed char</code>) decides the reading — the hardware does not know.</p>`,
    `<p class="y-chinh">🎯 Trên giấy ta viết −1101,0101 với dấu trừ và dấu phẩy. Trong thanh ghi chỉ có 0 và 1 — không có ký hiệu riêng cho "trừ" hay "phẩy". Nên dấu và dấu phẩy phải <strong>mã hoá ngay trong bit</strong> hoặc được quy ước trước.</p>
<p>Đây là bài toán thiết kế của cả chương. Với dấu có vài quy ước (các slide tới: dấu–độ lớn, bù hai, số lệch). Với dấu phẩy có hai họ: <em>dấu phẩy tĩnh</em> (slide 10 — dấu phẩy ở chỗ đã thoả thuận) và <em>dấu phẩy động</em> (bài CS.3 — vị trí dấu phẩy được lưu thành số mũ).</p>
<p class="meo">💡 Ý chính mang theo mọi nơi: <strong>bit tự nó không có nghĩa</strong>. 1111 1011 là 251 nếu đọc không dấu và là −5 nếu đọc theo bù hai. Chương trình (kiểu dữ liệu: <code>unsigned char</code> hay <code>signed char</code>) quyết định cách đọc — phần cứng không biết.</p>`],

  [5, 'Sign-Magnitude Representation',
    `<p class="y-chinh">🎯 The most obvious idea: use the leftmost bit as the sign (0 = positive, 1 = negative) and the rest as the magnitude. +18 = 0001 0010, −18 = 1001 0010. Simple — and rarely used for integers in an ALU.</p>
<p>The diagram lists its two drawbacks:</p>
<ul>
<li><strong>Addition and subtraction must look at the signs and compare magnitudes</strong> first — "same sign: add magnitudes; different signs: subtract the smaller from the larger and take the sign of the larger". That is extra logic and extra time for the most common operation.</li>
<li><strong>Two representations of zero</strong>: 0000 0000 (+0) and 1000 0000 (−0). Every equality test would have to treat them as equal.</li>
</ul>
<p>Because of these, integer ALUs use two's complement. Sign-magnitude does survive in one important place: the sign bit of IEEE 754 floating point (lesson CS.3) — which is why floats really do have a −0.0.</p>`,
    `<p class="y-chinh">🎯 Ý tưởng hiển nhiên nhất: dùng bit trái nhất làm dấu (0 = dương, 1 = âm), phần còn lại là độ lớn. +18 = 0001 0010, −18 = 1001 0010. Đơn giản — và hiếm khi dùng cho số nguyên trong ALU.</p>
<p>Sơ đồ nêu hai nhược điểm:</p>
<ul>
<li><strong>Cộng và trừ phải xét dấu và so độ lớn</strong> trước — "cùng dấu: cộng độ lớn; khác dấu: lấy lớn trừ nhỏ và lấy dấu của số lớn". Thêm mạch logic và thêm thời gian cho đúng phép hay dùng nhất.</li>
<li><strong>Hai cách biểu diễn số 0</strong>: 0000 0000 (+0) và 1000 0000 (−0). Mọi phép so sánh bằng phải coi chúng là bằng nhau.</li>
</ul>
<p>Vì vậy ALU số nguyên dùng bù hai. Dấu–độ lớn vẫn sống ở một chỗ quan trọng: bit dấu của dấu phẩy động IEEE 754 (bài CS.3) — đó là lý do số thực thật sự có −0,0.</p>`],

  [6, 'Table 11.1 Characteristics of Twos Complement Representation and Arithmetic',
    `<p class="y-chinh">🎯 The whole of two's complement on one table — learn these six rows and you can answer almost any question on it.</p>
<table>
<thead><tr><th>Property</th><th>Rule</th><th>8-bit example</th></tr></thead>
<tbody>
<tr><td>Range</td><td>−2<sup>n−1</sup> … 2<sup>n−1</sup> − 1</td><td>−128 … 127</td></tr>
<tr><td>Zeros</td><td>one</td><td>0000 0000</td></tr>
<tr><td>Negation</td><td>invert every bit, add 1</td><td>18 → 1110 1101 + 1 = 1110 1110 = −18</td></tr>
<tr><td>Widening</td><td>copy the sign bit into the new left positions</td><td>−5: 1111 1011 → 1111 1111 1111 1011</td></tr>
<tr><td>Overflow</td><td>adding two numbers of the same sign gives a result of the opposite sign</td><td>100 + 100 → −56</td></tr>
<tr><td>Subtraction</td><td>A − B = A + (−B)</td><td>no separate subtractor needed</td></tr>
</tbody>
</table>
<p>Why the range is lopsided (one more negative than positive): with n bits there are 2<sup>n</sup> patterns; one is zero, half of the rest start with 1 (negative) — 2<sup>n−1</sup> of them — leaving 2<sup>n−1</sup> − 1 positive ones.</p>
<p class="meo">💡 The leftmost bit has weight <strong>−2<sup>n−1</sup></strong> instead of +2<sup>n−1</sup>; all other bits keep their usual positive weight. That one sentence generates every row of this table (slide 8 shows it as a "value box").</p>`,
    `<p class="y-chinh">🎯 Toàn bộ bù hai trong một bảng — thuộc sáu dòng này là trả lời được gần như mọi câu hỏi về nó.</p>
<table>
<thead><tr><th>Tính chất</th><th>Quy tắc</th><th>Ví dụ 8 bit</th></tr></thead>
<tbody>
<tr><td>Phạm vi</td><td>−2<sup>n−1</sup> … 2<sup>n−1</sup> − 1</td><td>−128 … 127</td></tr>
<tr><td>Số cách viết số 0</td><td>một</td><td>0000 0000</td></tr>
<tr><td>Đổi dấu</td><td>đảo mọi bit, cộng 1</td><td>18 → 1110 1101 + 1 = 1110 1110 = −18</td></tr>
<tr><td>Mở rộng độ rộng</td><td>chép bit dấu vào các vị trí mới bên trái</td><td>−5: 1111 1011 → 1111 1111 1111 1011</td></tr>
<tr><td>Tràn số</td><td>cộng hai số cùng dấu mà kết quả mang dấu ngược lại</td><td>100 + 100 → −56</td></tr>
<tr><td>Phép trừ</td><td>A − B = A + (−B)</td><td>không cần mạch trừ riêng</td></tr>
</tbody>
</table>
<p>Vì sao phạm vi lệch (âm nhiều hơn dương một số): n bit có 2<sup>n</sup> mẫu; một mẫu là số 0, trong phần còn lại những mẫu bắt đầu bằng 1 (âm) có 2<sup>n−1</sup> cái, còn lại 2<sup>n−1</sup> − 1 mẫu dương.</p>
<p class="meo">💡 Bit trái nhất có trọng số <strong>−2<sup>n−1</sup></strong> thay vì +2<sup>n−1</sup>; mọi bit khác giữ trọng số dương như thường. Một câu đó sinh ra mọi dòng của bảng này (slide 8 vẽ nó thành "hộp giá trị").</p>`],

  [7, 'Table 11.2 Alternative Representations for 4-Bit Integers',
    `<p class="y-chinh">🎯 The same 16 patterns of 4 bits, read three ways: sign-magnitude, two's complement and biased. Compare the columns and you see each convention's personality.</p>
<ul>
<li><strong>Sign-magnitude</strong>: −7 … +7, two zeros (0000 and 1000).</li>
<li><strong>Two's complement</strong>: −8 … +7, one zero; −1 is 1111, −8 is 1000. Positive numbers look the same as in sign-magnitude.</li>
<li><strong>Biased</strong> (excess-7 here): store value + 7. So 0 → 0111, +8 → 1111, −7 → 0000. Range −7 … +8. Its advantage: the bit patterns sort in the same order as the values, so two biased numbers can be compared like unsigned numbers. That is exactly why IEEE 754 stores its exponent biased (lesson CS.3, bias 127).</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Error on the slide — two labels swapped.</strong> The table has a row "−0 | 0000 | 0000 | 0111" and a row "+0 | 1000 | – | –". In sign-magnitude 0000 is <strong>+0</strong> and 1000 is <strong>−0</strong> (sign bit 1 = negative). The labels of those two rows are the wrong way round; the bit patterns themselves are right. Read it as "+0: 0000 / 0000 / 0111" and "−0: 1000 / – / –".</div>
<p class="meo">💡 Exam shortcut for 4-bit two's complement: if the first bit is 1, the value is (pattern as unsigned) − 16. 1011 = 11 − 16 = −5.</p>`,
    `<p class="y-chinh">🎯 Cùng 16 mẫu 4 bit, đọc theo ba cách: dấu–độ lớn, bù hai và số lệch (biased). So các cột là thấy "tính cách" của từng quy ước.</p>
<ul>
<li><strong>Dấu–độ lớn</strong>: −7 … +7, hai số 0 (0000 và 1000).</li>
<li><strong>Bù hai</strong>: −8 … +7, một số 0; −1 là 1111, −8 là 1000. Số dương trông y như dấu–độ lớn.</li>
<li><strong>Số lệch</strong> (ở đây lệch 7, excess-7): lưu giá trị + 7. Nên 0 → 0111, +8 → 1111, −7 → 0000. Phạm vi −7 … +8. Ưu điểm: thứ tự các mẫu bit trùng thứ tự giá trị, nên so hai số lệch được y như so số không dấu. Đó chính là lý do IEEE 754 lưu số mũ dạng lệch (bài CS.3, độ lệch 127).</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Slide sai — hai nhãn bị đảo.</strong> Bảng có một dòng "−0 | 0000 | 0000 | 0111" và một dòng "+0 | 1000 | – | –". Trong dấu–độ lớn, 0000 là <strong>+0</strong> và 1000 là <strong>−0</strong> (bit dấu 1 = âm). Nhãn của hai dòng đó bị đặt ngược; còn các mẫu bit thì đúng. Hãy đọc thành "+0: 0000 / 0000 / 0111" và "−0: 1000 / – / –".</div>
<p class="meo">💡 Mẹo thi cho bù hai 4 bit: nếu bit đầu là 1 thì giá trị = (mẫu đọc không dấu) − 16. 1011 = 11 − 16 = −5.</p>`],

  [8, 'Figure 11.2 Use of a Value Box for Conversion between Twos Complement Binary and Decimal',
    `<p class="y-chinh">🎯 The "value box" writes the weights over the bits: <strong>−128</strong>, 64, 32, 16, 8, 4, 2, 1. Converting is then just adding the weights of the 1-bits — in both directions.</p>
<ul>
<li>(b) Binary → decimal: 1000 0011 = −128 + 2 + 1 = <strong>−125</strong>.</li>
<li>(c) Decimal → binary: −120 = −128 + 8 → bits under −128 and 8 are 1: <strong>1000 1000</strong>.</li>
</ul>
<p>This is the fastest exam method for negative numbers, faster than "invert and add 1": start from −128, then add the positive weights you need to climb back up to the target.</p>
<p class="nhan">Try it</p>
<p>−37 = −128 + 91, and 91 = 64 + 16 + 8 + 2 + 1 → 1101 1011. The C program below confirms the same pattern style for −5 = −128 + 123 = 1111 1011.</p>
<p class="meo">💡 Rule of thumb: a negative 8-bit number with many leading 1s is close to zero (1111 1111 = −1); one with a 1 followed by many 0s is very negative (1000 0000 = −128).</p>`,
    `<p class="y-chinh">🎯 "Hộp giá trị" viết trọng số lên trên các bit: <strong>−128</strong>, 64, 32, 16, 8, 4, 2, 1. Đổi số chỉ còn là cộng trọng số của các bit 1 — theo cả hai chiều.</p>
<ul>
<li>(b) Nhị phân → thập phân: 1000 0011 = −128 + 2 + 1 = <strong>−125</strong>.</li>
<li>(c) Thập phân → nhị phân: −120 = −128 + 8 → bit dưới −128 và dưới 8 là 1: <strong>1000 1000</strong>.</li>
</ul>
<p>Đây là cách nhanh nhất khi thi cho số âm, nhanh hơn "đảo bit rồi cộng 1": bắt đầu từ −128, rồi cộng các trọng số dương cần thiết để leo lại tới số đích.</p>
<p class="nhan">Thử</p>
<p>−37 = −128 + 91, và 91 = 64 + 16 + 8 + 2 + 1 → 1101 1011. Chương trình C bên dưới xác nhận cùng kiểu mẫu bit cho −5 = −128 + 123 = 1111 1011.</p>
<p class="meo">💡 Mẹo nhìn: số âm 8 bit có nhiều bit 1 đứng đầu thì gần 0 (1111 1111 = −1); số có một bit 1 rồi toàn 0 thì rất âm (1000 0000 = −128).</p>`],

  [9, 'Range Extension',
    `<p class="y-chinh">🎯 To put an n-bit number into m &gt; n bits without changing its value: sign-magnitude moves the sign bit to the new left end and fills with 0s; two's complement <strong>copies the sign bit</strong> into all the new positions — <strong>sign extension</strong>.</p>
<p>Positive numbers get 0s, negative numbers get 1s. −5 in 8 bits is 1111 1011; in 32 bits it is 1111 1111 1111 1111 1111 1111 1111 1011 (0xFFFFFFFB) — exactly what the C run below prints for <code>int32_t mo = a8;</code>.</p>
<p>Why filling with 0s fails for negatives: 1111 1011 padded with zeros becomes 0000 0000 1111 1011 = +251. The weight −128 of the old sign bit has become +128, and a new −2<sup>15</sup> bit is 0. Copying the sign bit adds −2<sup>15</sup> + 2<sup>14</sup> + … + 2<sup>7</sup> = −2<sup>7</sup>, which keeps the value.</p>
<div class="pitfall">In C, converting <code>signed char</code> → <code>int</code> sign-extends, but <code>unsigned char</code> → <code>int</code> zero-extends. Reading a byte 0xFB from a file into a <code>char</code> and comparing it with 251 gives different answers on different platforms, because plain <code>char</code> is signed on x86 and unsigned on ARM Linux. Use <code>uint8_t</code> for raw bytes.</div>`,
    `<p class="y-chinh">🎯 Muốn đặt một số n bit vào m &gt; n bit mà không đổi giá trị: dấu–độ lớn chuyển bit dấu sang đầu trái mới và điền 0; bù hai <strong>chép bit dấu</strong> vào mọi vị trí mới — gọi là <strong>mở rộng dấu</strong> (sign extension).</p>
<p>Số dương nhận thêm 0, số âm nhận thêm 1. −5 ở 8 bit là 1111 1011; ở 32 bit là 1111 1111 1111 1111 1111 1111 1111 1011 (0xFFFFFFFB) — đúng thứ chương trình C bên dưới in ra cho <code>int32_t mo = a8;</code>.</p>
<p>Vì sao điền 0 hỏng với số âm: 1111 1011 đệm 0 thành 0000 0000 1111 1011 = +251. Trọng số −128 của bit dấu cũ đã thành +128, và bit −2<sup>15</sup> mới bằng 0. Chép bit dấu thì cộng thêm −2<sup>15</sup> + 2<sup>14</sup> + … + 2<sup>7</sup> = −2<sup>7</sup>, giữ nguyên giá trị.</p>
<div class="pitfall">Trong C, đổi <code>signed char</code> → <code>int</code> thì mở rộng dấu, còn <code>unsigned char</code> → <code>int</code> thì mở rộng bằng 0. Đọc một byte 0xFB từ tệp vào <code>char</code> rồi so với 251 sẽ ra kết quả khác nhau trên các nền tảng, vì <code>char</code> trơn là có dấu trên x86 và không dấu trên ARM Linux. Dùng <code>uint8_t</code> cho byte thô.</div>`],

  [10, 'Fixed-Point Representation',
    `<p class="y-chinh">🎯 Everything so far assumes the binary point sits just right of the last bit (integers). A programmer can keep the same representation for fractions by <strong>scaling</strong>: agree that the point is somewhere else, and the hardware never needs to know.</p>
<p>Example: store money as an integer number of cents. 12.34 € is stored as 1234; the "point" is two decimal places left of the end, by agreement. Additions are exact integer additions; only printing needs to insert the point. In binary, a "Q8.8" format stores 1.5 as 1.5 × 2<sup>8</sup> = 384 in a 16-bit integer.</p>
<p>The limitation (slide 31 repeats it): a fixed point means a fixed trade-off between range and precision. With 16 bits and 8 fraction bits you get steps of 1/256 but a maximum below 128. Very large and very small values cannot both be represented — which is what floating point solves.</p>
<p class="meo">💡 Fixed point is not old-fashioned: integer cents in a payment system, audio samples, and many microcontrollers without a floating-point unit use it today. The Patriot missile clock in lesson CS.3 was a 24-bit fixed-point register.</p>`,
    `<p class="y-chinh">🎯 Mọi thứ tới giờ đều giả định dấu phẩy nhị phân nằm ngay bên phải bit cuối (số nguyên). Lập trình viên có thể giữ nguyên cách biểu diễn đó cho số lẻ bằng cách <strong>co giãn</strong> (scaling): thoả thuận rằng dấu phẩy nằm ở chỗ khác, và phần cứng không cần biết.</p>
<p>Ví dụ: lưu tiền bằng số nguyên đơn vị xu. 12,34 € lưu thành 1234; "dấu phẩy" nằm cách đuôi hai chữ số thập phân, theo thoả thuận. Phép cộng là phép cộng số nguyên chính xác; chỉ lúc in mới chèn dấu phẩy. Ở nhị phân, định dạng "Q8.8" lưu 1,5 thành 1,5 × 2<sup>8</sup> = 384 trong một số nguyên 16 bit.</p>
<p>Giới hạn (slide 31 nhắc lại): dấu phẩy cố định nghĩa là đánh đổi cố định giữa phạm vi và độ chính xác. 16 bit với 8 bit phần lẻ cho bước nhảy 1/256 nhưng giá trị lớn nhất dưới 128. Không thể vừa biểu diễn số rất lớn vừa biểu diễn số rất nhỏ — đó là việc dấu phẩy động giải quyết.</p>
<p class="meo">💡 Dấu phẩy tĩnh không lỗi thời: tiền tính bằng số nguyên xu trong hệ thống thanh toán, mẫu âm thanh, và nhiều vi điều khiển không có khối dấu phẩy động vẫn dùng nó hôm nay. Đồng hồ của tên lửa Patriot ở bài CS.3 là một thanh ghi dấu phẩy tĩnh 24 bit.</p>`],

  [11, 'Negation',
    `<p class="y-chinh">🎯 To negate in two's complement: take the Boolean complement of every bit (including the sign bit), then add 1 treating the result as unsigned. Doing it twice gives the original number back.</p>
<table>
<thead><tr><th></th><th>+18 → −18</th><th>−18 → +18</th></tr></thead>
<tbody>
<tr><td>start</td><td>0001 0010</td><td>1110 1110</td></tr>
<tr><td>invert</td><td>1110 1101</td><td>0001 0001</td></tr>
<tr><td>+1</td><td>1110 1110 = −18</td><td>0001 0010 = +18</td></tr>
</tbody>
</table>
<p>Why it works: x + (inverted x) = 1111…1 = −1 for every x. So inverted x = −1 − x, and inverted x + 1 = −x. No special negation circuit is needed — an inverter row and the adder's carry-in do the job (slide 19).</p>
<p class="meo">💡 Hand shortcut: copy bits from the right up to and including the first 1, then invert the rest. 0001 0<strong>010</strong> → 1110 1<strong>110</strong>. Same answer, no addition.</p>`,
    `<p class="y-chinh">🎯 Đổi dấu trong bù hai: lấy phần bù Boole của mọi bit (kể cả bit dấu), rồi cộng 1 coi kết quả như số không dấu. Làm hai lần thì về lại số ban đầu.</p>
<table>
<thead><tr><th></th><th>+18 → −18</th><th>−18 → +18</th></tr></thead>
<tbody>
<tr><td>ban đầu</td><td>0001 0010</td><td>1110 1110</td></tr>
<tr><td>đảo bit</td><td>1110 1101</td><td>0001 0001</td></tr>
<tr><td>+1</td><td>1110 1110 = −18</td><td>0001 0010 = +18</td></tr>
</tbody>
</table>
<p>Vì sao đúng: x + (x đảo bit) = 1111…1 = −1 với mọi x. Nên x đảo bit = −1 − x, và x đảo bit + 1 = −x. Không cần mạch đổi dấu riêng — một hàng cổng NOT và bit nhớ vào của bộ cộng làm việc đó (slide 19).</p>
<p class="meo">💡 Mẹo làm tay: chép nguyên các bit từ phải sang cho tới và gồm cả bit 1 đầu tiên, rồi đảo phần còn lại. 0001 0<strong>010</strong> → 1110 1<strong>110</strong>. Cùng đáp án, khỏi cộng.</p>`],

  [12, 'Negation Special Case 1 — negating zero',
    `<p class="y-chinh">🎯 −0: invert 0000 0000 → 1111 1111, add 1 → 1 0000 0000. The carry out of the top bit is ignored, leaving 0000 0000. So −0 = 0: two's complement has a single zero.</p>
<p>The carry that "falls off" the left end is not an error here. In two's complement addition, a carry out of the sign position is normal and is simply discarded; overflow is detected by the sign rule of slide 15, never by the carry alone.</p>
<p class="meo">💡 This is the property sign-magnitude lacked (slide 5). One zero means one bit pattern to test for "is it zero?" — the Zero flag is just a NOR of all result bits.</p>`,
    `<p class="y-chinh">🎯 −0: đảo 0000 0000 → 1111 1111, cộng 1 → 1 0000 0000. Bit nhớ tràn khỏi bit cao nhất bị bỏ, còn 0000 0000. Vậy −0 = 0: bù hai chỉ có một số 0.</p>
<p>Bit nhớ "rơi" khỏi đầu trái không phải lỗi ở đây. Trong phép cộng bù hai, nhớ ra khỏi vị trí dấu là chuyện bình thường và chỉ việc bỏ đi; tràn số được phát hiện bằng luật dấu ở slide 15, không bao giờ chỉ bằng bit nhớ.</p>
<p class="meo">💡 Đây đúng là tính chất dấu–độ lớn thiếu (slide 5). Một số 0 nghĩa là một mẫu bit để kiểm "có bằng 0 không?" — cờ Zero chỉ là phép NOR của mọi bit kết quả.</p>`],

  [13, 'Negation Special Case 2 — negating the most negative number',
    `<p class="y-chinh">🎯 −(−128): invert 1000 0000 → 0111 1111, add 1 → 1000 0000 = −128 again. +128 does not exist in 8 bits, so negation fails. The slide's fix: <strong>monitor the sign bit — it should change during negation</strong>; if it does not (and the number is not 0), that is overflow.</p>
<p>The C run below prints <code>INT8_MIN = -128, doi dau trong 8 bit = -128</code>. The same happens with 32-bit <code>int</code>: −INT_MIN cannot be represented. In C that is undefined behaviour, so <code>abs(INT_MIN)</code> and <code>-x</code> for x = INT_MIN are classic sources of bugs and even security holes ("the length is negative after taking its absolute value").</p>
<div class="pitfall">"Absolute value is never negative" is false for fixed-width two's complement. Before negating a value that may be the minimum, check it — or work in a wider type (<code>long long</code>) first.</div>`,
    `<p class="y-chinh">🎯 −(−128): đảo 1000 0000 → 0111 1111, cộng 1 → 1000 0000 = lại là −128. +128 không tồn tại trong 8 bit nên phép đổi dấu thất bại. Cách xử lý của slide: <strong>theo dõi bit dấu — nó phải đổi khi đổi dấu</strong>; nếu không đổi (và số đó không phải 0) thì là tràn.</p>
<p>Chương trình C bên dưới in <code>INT8_MIN = -128, doi dau trong 8 bit = -128</code>. Với <code>int</code> 32 bit cũng y vậy: −INT_MIN không biểu diễn được. Trong C đó là hành vi không xác định (undefined behaviour), nên <code>abs(INT_MIN)</code> và <code>-x</code> với x = INT_MIN là nguồn lỗi kinh điển, thậm chí cả lỗ hổng bảo mật ("độ dài thành số âm sau khi lấy trị tuyệt đối").</p>
<div class="pitfall">"Trị tuyệt đối không bao giờ âm" là sai với bù hai độ rộng cố định. Trước khi đổi dấu một giá trị có thể là giá trị nhỏ nhất, hãy kiểm nó — hoặc tính trong kiểu rộng hơn (<code>long long</code>) trước.</div>`],

  [14, 'Figure 11.3 Addition of Numbers in Twos Complement Representation',
    `<p class="y-chinh">🎯 Six 4-bit additions, done with an <strong>ordinary unsigned adder</strong>. The shaded bit is a carry out of the sign position: ignored. Two of the six overflow.</p>
<table>
<thead><tr><th>case</th><th>bits</th><th>result</th><th>verdict</th></tr></thead>
<tbody>
<tr><td>(a) −7 + 5</td><td>1001 + 0101 = 1110</td><td>−2</td><td>correct</td></tr>
<tr><td>(b) −4 + 4</td><td>1100 + 0100 = <u>1</u>0000</td><td>0</td><td>correct, carry ignored</td></tr>
<tr><td>(c) 3 + 4</td><td>0011 + 0100 = 0111</td><td>7</td><td>correct</td></tr>
<tr><td>(d) −4 + −1</td><td>1100 + 1111 = <u>1</u>1011</td><td>−5</td><td>correct, carry ignored</td></tr>
<tr><td>(e) 5 + 4</td><td>0101 + 0100 = 1001</td><td>"−7"</td><td><strong>overflow</strong> (9 &gt; 7)</td></tr>
<tr><td>(f) −7 + −6</td><td>1001 + 1010 = <u>1</u>0011</td><td>"+3"</td><td><strong>overflow</strong> (−13 &lt; −8)</td></tr>
</tbody>
</table>
<p>Look at (b) and (d): a carry out, but the answer is right. Look at (e): no carry out, but the answer is wrong. So <strong>carry ≠ overflow</strong> for signed numbers. The Python run below reproduces all six lines and flags exactly (e) and (f).</p>
<p class="meo">💡 The beauty: the adder never knows whether the bits are signed. The same circuit adds unsigned and two's-complement numbers; only the interpretation of the result (and of the flags) differs.</p>`,
    `<p class="y-chinh">🎯 Sáu phép cộng 4 bit, làm bằng một <strong>bộ cộng không dấu bình thường</strong>. Bit tô xám là bit nhớ ra khỏi vị trí dấu: bỏ đi. Hai trong sáu ca bị tràn.</p>
<table>
<thead><tr><th>ca</th><th>bit</th><th>kết quả</th><th>kết luận</th></tr></thead>
<tbody>
<tr><td>(a) −7 + 5</td><td>1001 + 0101 = 1110</td><td>−2</td><td>đúng</td></tr>
<tr><td>(b) −4 + 4</td><td>1100 + 0100 = <u>1</u>0000</td><td>0</td><td>đúng, bỏ bit nhớ</td></tr>
<tr><td>(c) 3 + 4</td><td>0011 + 0100 = 0111</td><td>7</td><td>đúng</td></tr>
<tr><td>(d) −4 + −1</td><td>1100 + 1111 = <u>1</u>1011</td><td>−5</td><td>đúng, bỏ bit nhớ</td></tr>
<tr><td>(e) 5 + 4</td><td>0101 + 0100 = 1001</td><td>"−7"</td><td><strong>tràn</strong> (9 &gt; 7)</td></tr>
<tr><td>(f) −7 + −6</td><td>1001 + 1010 = <u>1</u>0011</td><td>"+3"</td><td><strong>tràn</strong> (−13 &lt; −8)</td></tr>
</tbody>
</table>
<p>Nhìn (b) và (d): có nhớ ra mà đáp án đúng. Nhìn (e): không nhớ ra mà đáp án sai. Vậy với số có dấu <strong>nhớ ≠ tràn</strong>. Lần chạy Python bên dưới tái hiện cả sáu dòng và bắt đúng (e) với (f).</p>
<p class="meo">💡 Cái hay: bộ cộng không bao giờ biết các bit có dấu hay không. Cùng một mạch cộng cả số không dấu lẫn số bù hai; chỉ cách đọc kết quả (và đọc cờ) là khác.</p>`],

  [15, 'Overflow Rule',
    `<p class="y-chinh">🎯 If two numbers of the <strong>same sign</strong> are added, overflow occurs <strong>if and only if</strong> the result has the <strong>opposite sign</strong>. Adding numbers of different signs can never overflow.</p>
<p>Why different signs are always safe: the true sum lies between the two operands, and both operands are representable, so the sum is too. Why the sign flip is the symptom: two positives can only produce a "negative" pattern if the sum carried into the sign bit, i.e. exceeded 2<sup>n−1</sup> − 1.</p>
<p>In hardware the rule becomes one XOR: overflow = (carry <em>into</em> the sign bit) XOR (carry <em>out of</em> the sign bit). That single bit is the V (or OF) flag the ALU outputs on slide 3.</p>
<div class="formula">V = c<sub>n−1</sub> ⊕ c<sub>n</sub> &nbsp;&nbsp;·&nbsp;&nbsp; for unsigned numbers, overflow = c<sub>n</sub> (the carry out)</div>
<p class="meo">💡 Two flags, two meanings: Carry (C) = unsigned overflow; Overflow (V) = signed overflow. The same addition can set one, the other, both or neither — the lab below lets you find all four cases.</p>`,
    `<p class="y-chinh">🎯 Cộng hai số <strong>cùng dấu</strong> thì tràn xảy ra <strong>khi và chỉ khi</strong> kết quả mang <strong>dấu ngược lại</strong>. Cộng hai số khác dấu thì không bao giờ tràn.</p>
<p>Vì sao khác dấu luôn an toàn: tổng thật nằm giữa hai toán hạng, mà cả hai toán hạng đều biểu diễn được, nên tổng cũng vậy. Vì sao lật dấu là triệu chứng: hai số dương chỉ có thể ra mẫu "âm" nếu tổng đã nhớ vào bit dấu, tức là vượt 2<sup>n−1</sup> − 1.</p>
<p>Trong phần cứng, luật này thành một cổng XOR: tràn = (nhớ <em>vào</em> bit dấu) XOR (nhớ <em>ra khỏi</em> bit dấu). Bit đó chính là cờ V (hay OF) mà ALU xuất ra ở slide 3.</p>
<div class="formula">V = c<sub>n−1</sub> ⊕ c<sub>n</sub> &nbsp;&nbsp;·&nbsp;&nbsp; với số không dấu, tràn = c<sub>n</sub> (bit nhớ ra)</div>
<p class="meo">💡 Hai cờ, hai nghĩa: Carry (C) = tràn không dấu; Overflow (V) = tràn có dấu. Cùng một phép cộng có thể bật cờ này, cờ kia, cả hai hoặc không cờ nào — phòng lab bên dưới cho bạn tìm cả bốn ca.</p>`],

  [16, 'Subtraction Rule',
    `<p class="y-chinh">🎯 To subtract the subtrahend from the minuend, take the two's complement (negation) of the subtrahend and add it: M − S = M + (−S).</p>
<p>This is why a CPU needs no separate subtractor: invert S, feed it to the same adder, and set the adder's carry-in to 1 (that is the "+1" of negation, done for free). Slide 19 draws exactly that circuit.</p>
<p>Overflow for subtraction follows from the addition rule applied to M + (−S): it can only overflow when M and S have <em>different</em> signs. Careful with S = −2<sup>n−1</sup>: −S does not exist (slide 13), yet M − S may still be fine for negative M — real hardware handles this correctly through the carry-in trick, which is one more reason not to negate first in software.</p>`,
    `<p class="y-chinh">🎯 Muốn trừ số trừ (subtrahend) khỏi số bị trừ (minuend), lấy bù hai (đổi dấu) của số trừ rồi cộng: M − S = M + (−S).</p>
<p>Đây là lý do CPU không cần mạch trừ riêng: đảo bit S, đưa vào đúng bộ cộng đó, và đặt bit nhớ vào của bộ cộng bằng 1 (chính là "+1" của phép đổi dấu, làm miễn phí). Slide 19 vẽ đúng mạch đó.</p>
<p>Tràn trong phép trừ suy ra từ luật cộng áp vào M + (−S): chỉ có thể tràn khi M và S <em>khác</em> dấu. Cẩn thận với S = −2<sup>n−1</sup>: −S không tồn tại (slide 13), vậy mà M − S vẫn có thể đúng khi M âm — phần cứng thật xử lý đúng nhờ mẹo bit nhớ vào, thêm một lý do đừng đổi dấu trước bằng phần mềm.</p>`],

  [17, 'Figure 11.4 Subtraction of Numbers in Twos Complement Representation (M − S)',
    `<p class="y-chinh">🎯 Six subtractions done as additions of −S. Each box shows M, S and −S, then the addition.</p>
<table>
<thead><tr><th>case</th><th>M + (−S)</th><th>result</th></tr></thead>
<tbody>
<tr><td>(a) 2 − 7</td><td>0010 + 1001 = 1011</td><td>−5 ✓</td></tr>
<tr><td>(b) 5 − 2</td><td>0101 + 1110 = <u>1</u>0011</td><td>3 ✓ (carry ignored)</td></tr>
<tr><td>(c) −5 − 2</td><td>1011 + 1110 = <u>1</u>1001</td><td>−7 ✓</td></tr>
<tr><td>(d) 5 − (−2)</td><td>0101 + 0010 = 0111</td><td>7 ✓</td></tr>
<tr><td>(e) 7 − (−7)</td><td>0111 + 0111 = 1110</td><td><strong>overflow</strong> (14)</td></tr>
<tr><td>(f) −6 − 4</td><td>1010 + 1100 = <u>1</u>0110</td><td><strong>overflow</strong> (−10)</td></tr>
</tbody>
</table>
<p>The overflow cases are the ones where M and S have different signs and the true difference leaves −8 … 7. After rewriting as M + (−S), the operands have the same sign and the result has the other sign — slide 15's rule, unchanged.</p>`,
    `<p class="y-chinh">🎯 Sáu phép trừ làm thành phép cộng với −S. Mỗi ô ghi M, S và −S, rồi phép cộng.</p>
<table>
<thead><tr><th>ca</th><th>M + (−S)</th><th>kết quả</th></tr></thead>
<tbody>
<tr><td>(a) 2 − 7</td><td>0010 + 1001 = 1011</td><td>−5 ✓</td></tr>
<tr><td>(b) 5 − 2</td><td>0101 + 1110 = <u>1</u>0011</td><td>3 ✓ (bỏ bit nhớ)</td></tr>
<tr><td>(c) −5 − 2</td><td>1011 + 1110 = <u>1</u>1001</td><td>−7 ✓</td></tr>
<tr><td>(d) 5 − (−2)</td><td>0101 + 0010 = 0111</td><td>7 ✓</td></tr>
<tr><td>(e) 7 − (−7)</td><td>0111 + 0111 = 1110</td><td><strong>tràn</strong> (14)</td></tr>
<tr><td>(f) −6 − 4</td><td>1010 + 1100 = <u>1</u>0110</td><td><strong>tràn</strong> (−10)</td></tr>
</tbody>
</table>
<p>Các ca tràn là những ca M và S khác dấu và hiệu thật ra khỏi −8 … 7. Sau khi viết lại thành M + (−S), hai toán hạng cùng dấu và kết quả mang dấu kia — luật của slide 15, giữ nguyên.</p>`],

  [18, 'Figure 11.5 Geometric Depiction of Twos Complement Integers',
    `<p class="y-chinh">🎯 Put the 16 patterns of 4 bits on a <strong>circle</strong>: 0000 at the top, counting clockwise 0001, 0010, … and the values 0, +1, … +7 then −8, −7, … −1 back to the top. Addition = walk clockwise; subtraction = walk counter-clockwise.</p>
<p>Overflow now has a picture: crossing the boundary at the bottom, between 0111 (+7) and 1000 (−8). Walk 4 steps clockwise from +5 and you land on −7 — that is slide 14 case (e). Crossing the top (between 1111 = −1 and 0000 = 0) is harmless for signed numbers — that is the ignored carry of cases (b) and (d). For <em>unsigned</em> numbers it is the other way round: the dangerous crossing is at the top.</p>
<p>Part (b) of the figure is the same circle for n bits: the boundary sits between 011…1 = 2<sup>n−1</sup> − 1 and 100…0 = −2<sup>n−1</sup>; below the circle the number line shows that the n-bit integers are a window on the infinite integers.</p>
<p class="meo">💡 This wheel is the best mental model for every wrap-around bug: a 32-bit counter is a wheel with 2<sup>32</sup> notches, and "2 147 483 647 + 1" is one step across the bottom.</p>`,
    `<p class="y-chinh">🎯 Đặt 16 mẫu 4 bit lên một <strong>vòng tròn</strong>: 0000 ở đỉnh, theo chiều kim đồng hồ 0001, 0010, … với giá trị 0, +1, … +7 rồi −8, −7, … −1 quay về đỉnh. Cộng = đi theo chiều kim đồng hồ; trừ = đi ngược chiều.</p>
<p>Tràn số giờ có hình: băng qua ranh giới ở đáy, giữa 0111 (+7) và 1000 (−8). Đi 4 bước theo chiều kim đồng hồ từ +5 là rơi vào −7 — đó là ca (e) của slide 14. Băng qua đỉnh (giữa 1111 = −1 và 0000 = 0) thì vô hại với số có dấu — đó là bit nhớ bị bỏ ở ca (b) và (d). Với số <em>không dấu</em> thì ngược lại: chỗ băng nguy hiểm là ở đỉnh.</p>
<p>Phần (b) của hình là cùng vòng tròn cho n bit: ranh giới nằm giữa 011…1 = 2<sup>n−1</sup> − 1 và 100…0 = −2<sup>n−1</sup>; dưới vòng tròn, trục số cho thấy các số nguyên n bit chỉ là một cửa sổ trên tập số nguyên vô hạn.</p>
<p class="meo">💡 Bánh xe này là mô hình tốt nhất cho mọi lỗi quay vòng: bộ đếm 32 bit là bánh xe 2<sup>32</sup> nấc, và "2 147 483 647 + 1" là một bước băng qua đáy.</p>`],

  [19, 'Figure 11.6 Block Diagram of Hardware for Addition and Subtraction',
    `<p class="y-chinh">🎯 One adder does both jobs. Register A goes straight in; register B goes either straight in or through a <strong>complementer</strong>, chosen by the switch <strong>SW</strong> (add or subtract). The result goes back into A, and the <strong>OF</strong> bit records overflow.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">A, B</div><div class="lz-t">registers</div><div class="lz-d">two operands</div></div>
  <div class="lz-step"><div class="lz-k">SW</div><div class="lz-t">B or complement(B)</div><div class="lz-d">add vs subtract</div></div>
  <div class="lz-step"><div class="lz-k">Adder</div><div class="lz-t">A + (±B)</div><div class="lz-d">the same circuit</div></div>
  <div class="lz-step"><div class="lz-k">A, OF</div><div class="lz-t">result + overflow flag</div><div class="lz-d">V = c<sub>n−1</sub> ⊕ c<sub>n</sub></div></div>
</div>
<p>The "complementer" is a row of XOR gates: XOR each bit of B with the subtract signal — 0 passes B through, 1 inverts it — and the same subtract signal is fed into the adder's carry-in to supply the "+1". The ripple-carry adder of Chapter 9 plus n XOR gates is a complete add/subtract unit.</p>
<p class="meo">💡 Result written back into A: this is the accumulator style you met with MARIE (lesson N1.1). <code>ADD X</code> in MARIE is exactly this circuit with B loaded from memory.</p>`,
    `<p class="y-chinh">🎯 Một bộ cộng làm cả hai việc. Thanh ghi A vào thẳng; thanh ghi B hoặc vào thẳng hoặc đi qua bộ <strong>lấy bù</strong> (complementer), chọn bởi công tắc <strong>SW</strong> (cộng hay trừ). Kết quả ghi lại vào A, và bit <strong>OF</strong> ghi nhận tràn.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">A, B</div><div class="lz-t">thanh ghi</div><div class="lz-d">hai toán hạng</div></div>
  <div class="lz-step"><div class="lz-k">SW</div><div class="lz-t">B hay bù(B)</div><div class="lz-d">cộng hay trừ</div></div>
  <div class="lz-step"><div class="lz-k">Bộ cộng</div><div class="lz-t">A + (±B)</div><div class="lz-d">cùng một mạch</div></div>
  <div class="lz-step"><div class="lz-k">A, OF</div><div class="lz-t">kết quả + cờ tràn</div><div class="lz-d">V = c<sub>n−1</sub> ⊕ c<sub>n</sub></div></div>
</div>
<p>"Bộ lấy bù" là một hàng cổng XOR: XOR từng bit của B với tín hiệu trừ — 0 thì cho B đi nguyên, 1 thì đảo nó — và chính tín hiệu trừ đó đưa vào bit nhớ vào của bộ cộng để cấp "+1". Bộ cộng nối tiếp nhớ của Chương 9 cộng thêm n cổng XOR là một khối cộng/trừ hoàn chỉnh.</p>
<p class="meo">💡 Kết quả ghi lại vào A: đây là kiểu thanh ghi tích luỹ bạn đã gặp ở MARIE (bài N1.1). <code>ADD X</code> trong MARIE chính là mạch này với B nạp từ bộ nhớ.</p>`],

  [20, 'Figure 11.7 Multiplication of Unsigned Binary Integers',
    `<p class="y-chinh">🎯 Long multiplication, binary style: 1011 (11) × 1101 (13). For each bit of the multiplier, write the multiplicand (bit = 1) or zeros (bit = 0), shifted one more place left; add the partial products: 1000 1111 = <strong>143</strong>.</p>
<p>Binary makes the "times table" trivial: a partial product is either the multiplicand or 0. Three observations from the figure drive the hardware on the next slides:</p>
<ul>
<li>n-bit × n-bit needs up to <strong>2n bits</strong> for the product (here 4 × 4 → 8 bits: 143 &gt; 15).</li>
<li>Partial products can be added <strong>as you go</strong>, rather than all at the end — so only one adder is needed.</li>
<li>A 0 bit in the multiplier means "just shift" — no addition.</li>
</ul>`,
    `<p class="y-chinh">🎯 Nhân tay kiểu nhị phân: 1011 (11) × 1101 (13). Với mỗi bit của số nhân, viết số bị nhân (bit = 1) hoặc toàn 0 (bit = 0), dịch trái thêm một chỗ; cộng các tích riêng: 1000 1111 = <strong>143</strong>.</p>
<p>Nhị phân làm "bảng cửu chương" trở nên tầm thường: một tích riêng hoặc là số bị nhân hoặc là 0. Ba nhận xét từ hình dẫn tới phần cứng ở các slide sau:</p>
<ul>
<li>n bit × n bit cần tới <strong>2n bit</strong> cho tích (ở đây 4 × 4 → 8 bit: 143 &gt; 15).</li>
<li>Các tích riêng có thể <strong>cộng dồn dần</strong> thay vì cộng hết ở cuối — nên chỉ cần một bộ cộng.</li>
<li>Bit 0 ở số nhân nghĩa là "chỉ dịch" — không cộng.</li>
</ul>`],

  [21, 'Figure 11.8 Hardware Implementation of Unsigned Binary Multiplication',
    `<p class="y-chinh">🎯 (a) Registers: M = multiplicand, Q = multiplier, A = accumulator (starts at 0), C = carry bit. Control logic looks at Q<sub>0</sub>: if 1, A ← A + M; then shift C, A, Q right by one. Repeat n times; the product ends up in A,Q.</p>
<p>(b) The trace for 1011 × 1101 (four cycles):</p>
<table>
<thead><tr><th>C</th><th>A</th><th>Q</th><th>step</th></tr></thead>
<tbody>
<tr><td>0</td><td>0000</td><td>1101</td><td>initial</td></tr>
<tr><td>0</td><td>1011 → 0101</td><td>1101 → 1110</td><td>add, shift (cycle 1)</td></tr>
<tr><td>0</td><td>0010</td><td>1111</td><td>shift only, Q<sub>0</sub> was 0 (cycle 2)</td></tr>
<tr><td>0</td><td>1101 → 0110</td><td>1111 → 1111</td><td>add, shift (cycle 3)</td></tr>
<tr><td>1 → 0</td><td>0001 → 1000</td><td>1111 → 1111</td><td>add (carry!), shift (cycle 4)</td></tr>
</tbody>
</table>
<p>Result A,Q = 1000 1111 = 143 ✓. Notice the trick: instead of shifting the multiplicand left, the hardware shifts the partial product <em>right</em>; the multiplier's used bits fall off the right end of Q while the product fills Q from the left.</p>
<div class="pitfall co-tieu-de"><strong>Leftover from an older edition.</strong> The caption of part (b) reads "Example from Figure 9.7" — chapter 9 was arithmetic in an earlier edition. In this deck it is Figure 11.7 (slide 20).</div>`,
    `<p class="y-chinh">🎯 (a) Thanh ghi: M = số bị nhân, Q = số nhân, A = thanh ghi tích luỹ (bắt đầu bằng 0), C = bit nhớ. Mạch điều khiển nhìn Q<sub>0</sub>: nếu bằng 1 thì A ← A + M; rồi dịch phải C, A, Q một bit. Lặp n lần; tích nằm trong A,Q.</p>
<p>(b) Vết chạy cho 1011 × 1101 (bốn chu kỳ):</p>
<table>
<thead><tr><th>C</th><th>A</th><th>Q</th><th>bước</th></tr></thead>
<tbody>
<tr><td>0</td><td>0000</td><td>1101</td><td>khởi tạo</td></tr>
<tr><td>0</td><td>1011 → 0101</td><td>1101 → 1110</td><td>cộng, dịch (chu kỳ 1)</td></tr>
<tr><td>0</td><td>0010</td><td>1111</td><td>chỉ dịch, Q<sub>0</sub> bằng 0 (chu kỳ 2)</td></tr>
<tr><td>0</td><td>1101 → 0110</td><td>1111 → 1111</td><td>cộng, dịch (chu kỳ 3)</td></tr>
<tr><td>1 → 0</td><td>0001 → 1000</td><td>1111 → 1111</td><td>cộng (có nhớ!), dịch (chu kỳ 4)</td></tr>
</tbody>
</table>
<p>Kết quả A,Q = 1000 1111 = 143 ✓. Để ý mẹo: thay vì dịch số bị nhân sang trái, phần cứng dịch tích riêng sang <em>phải</em>; các bit đã dùng của số nhân rơi khỏi đầu phải của Q trong khi tích lấp Q từ bên trái.</p>
<div class="pitfall co-tieu-de"><strong>Sót lại từ bản cũ.</strong> Chú thích phần (b) ghi "Example from Figure 9.7" — ở bản cũ, số học là chương 9. Trong deck này đó là Hình 11.7 (slide 20).</div>`],

  [22, 'Figure 11.9 Flowchart for Unsigned Binary Multiplication',
    `<p class="y-chinh">🎯 The same algorithm as a loop: initialise C, A ← 0, M ← multiplicand, Q ← multiplier, Count ← n; repeat { if Q<sub>0</sub> = 1 then C, A ← A + M; shift right C, A, Q; Count ← Count − 1 } until Count = 0. Product in A, Q.</p>
<pre><code class="language-mermaid">flowchart TD
  S(["START"]) --> I["C, A = 0 · M = multiplicand · Q = multiplier · Count = n"]
  I --> T{"Q0 = 1 ?"}
  T -- yes --> ADD["C, A = A + M"]
  T -- no --> SH["shift right C, A, Q · Count = Count - 1"]
  ADD --> SH
  SH --> E{"Count = 0 ?"}
  E -- no --> T
  E -- yes --> F(["END: product in A, Q"])
</code></pre>
<p>Cost: n iterations, each with at most one addition and one shift. That is why multiplication took many cycles on simple CPUs — and why compilers turn <code>x * 8</code> into a shift.</p>`,
    `<p class="y-chinh">🎯 Cùng thuật toán dưới dạng vòng lặp: khởi tạo C, A ← 0, M ← số bị nhân, Q ← số nhân, Count ← n; lặp { nếu Q<sub>0</sub> = 1 thì C, A ← A + M; dịch phải C, A, Q; Count ← Count − 1 } tới khi Count = 0. Tích nằm trong A, Q.</p>
<pre><code class="language-mermaid">flowchart TD
  S(["BẮT ĐẦU"]) --> I["C, A = 0 · M = số bị nhân · Q = số nhân · Count = n"]
  I --> T{"Q0 = 1 ?"}
  T -- có --> ADD["C, A = A + M"]
  T -- không --> SH["dịch phải C, A, Q · Count = Count - 1"]
  ADD --> SH
  SH --> E{"Count = 0 ?"}
  E -- chưa --> T
  E -- rồi --> F(["KẾT THÚC: tích trong A, Q"])
</code></pre>
<p>Chi phí: n vòng, mỗi vòng tối đa một phép cộng và một phép dịch. Đó là lý do phép nhân tốn nhiều chu kỳ trên CPU đơn giản — và vì sao trình biên dịch biến <code>x * 8</code> thành một phép dịch.</p>`],

  [23, 'Figure 11.10 Multiplication of Two Unsigned 4-Bit Integers Yielding an 8-Bit Result',
    `<p class="y-chinh">🎯 The same 1011 × 1101, but every partial product is written as a full 8-bit number: 1011 × 1 × 2<sup>0</sup> = 0000 1011, 1011 × 0 × 2<sup>1</sup> = 0000 0000, 1011 × 1 × 2<sup>2</sup> = 0010 1100, 1011 × 1 × 2<sup>3</sup> = 0101 1000. Sum: 1000 1111.</p>
<p>Writing the partial products at double width with explicit powers of 2 is the set-up for the next slide's question: what if the numbers are negative? With unsigned numbers the high bits of each partial product are 0 — padding with zeros is correct. With two's complement, it is not.</p>`,
    `<p class="y-chinh">🎯 Vẫn 1011 × 1101, nhưng mỗi tích riêng viết thành số 8 bit đầy đủ: 1011 × 1 × 2<sup>0</sup> = 0000 1011, 1011 × 0 × 2<sup>1</sup> = 0000 0000, 1011 × 1 × 2<sup>2</sup> = 0010 1100, 1011 × 1 × 2<sup>3</sup> = 0101 1000. Tổng: 1000 1111.</p>
<p>Viết tích riêng ở độ rộng gấp đôi với luỹ thừa của 2 rõ ràng là để chuẩn bị cho câu hỏi của slide sau: nếu là số âm thì sao? Với số không dấu, các bit cao của mỗi tích riêng bằng 0 — đệm 0 là đúng. Với bù hai thì không.</p>`],

  [24, 'Figure 11.11 Comparison of Multiplication of Unsigned and Twos Complement Integers',
    `<p class="y-chinh">🎯 The same bits 1001 × 0011: read unsigned, 9 × 3 = 27 = 0001 1011; read as two's complement, −7 × 3 must be −21 = 1110 1011. The unsigned method gives the wrong answer for signed numbers.</p>
<p>Part (b) shows the fix for a negative <em>multiplicand</em>: sign-extend each partial product to 2n bits (−7 × 2<sup>0</sup> = 1111 1001, −7 × 2<sup>1</sup> = 1111 0010) — then the sum 1110 1011 = −21 is correct. But a negative <em>multiplier</em> still breaks the method, because its top bit has weight −2<sup>n−1</sup>, not +2<sup>n−1</sup>; adding that partial product instead of subtracting it is wrong.</p>
<p>Two options: convert both to positive, multiply, then negate if the signs differ (slow, extra logic) — or use an algorithm that handles two's complement directly. That algorithm is Booth's.</p>`,
    `<p class="y-chinh">🎯 Cùng các bit 1001 × 0011: đọc không dấu, 9 × 3 = 27 = 0001 1011; đọc theo bù hai, −7 × 3 phải là −21 = 1110 1011. Cách nhân không dấu cho đáp án sai với số có dấu.</p>
<p>Phần (b) cho cách sửa khi <em>số bị nhân</em> âm: mở rộng dấu từng tích riêng lên 2n bit (−7 × 2<sup>0</sup> = 1111 1001, −7 × 2<sup>1</sup> = 1111 0010) — khi đó tổng 1110 1011 = −21 là đúng. Nhưng <em>số nhân</em> âm vẫn làm hỏng cách này, vì bit cao nhất của nó có trọng số −2<sup>n−1</sup>, không phải +2<sup>n−1</sup>; cộng tích riêng đó thay vì trừ là sai.</p>
<p>Hai lựa chọn: đổi cả hai thành số dương, nhân, rồi đổi dấu nếu khác dấu (chậm, thêm mạch) — hoặc dùng một thuật toán xử lý thẳng bù hai. Thuật toán đó là Booth.</p>`],

  [25, 'Figure 11.12 Booth\'s Algorithm for Twos Complement Multiplication',
    `<p class="y-chinh">🎯 Booth adds one extra bit Q<sub>−1</sub> (initially 0) to the right of Q and looks at the pair Q<sub>0</sub>Q<sub>−1</sub> each cycle: <strong>10 → A ← A − M</strong>, <strong>01 → A ← A + M</strong>, 00 or 11 → nothing. Then an <strong>arithmetic</strong> shift right of A, Q, Q<sub>−1</sub> (the sign bit of A is copied, not filled with 0). n cycles; product in A, Q.</p>
<p>Why it works: a run of 1s in the multiplier is a difference of two powers of 2. 0111 0 = 2<sup>4</sup> − 2<sup>1</sup>, so "× 0111 0" = "× 2<sup>4</sup> − × 2<sup>1</sup>": one subtraction where the run starts (pair 10, scanning right to left) and one addition where it ends (pair 01). Inside the run (11) and outside it (00) nothing happens. Because the top bit's negative weight is handled by the same rule, negative multipliers come out right automatically.</p>
<div class="pitfall">The shift must be <strong>arithmetic</strong> (copy A's sign bit). A logical shift (fill with 0) turns negative partial results positive — the most common error when tracing Booth by hand.</div>`,
    `<p class="y-chinh">🎯 Booth thêm một bit Q<sub>−1</sub> (ban đầu 0) vào bên phải Q và mỗi chu kỳ nhìn cặp Q<sub>0</sub>Q<sub>−1</sub>: <strong>10 → A ← A − M</strong>, <strong>01 → A ← A + M</strong>, 00 hoặc 11 → không làm gì. Sau đó dịch phải <strong>số học</strong> A, Q, Q<sub>−1</sub> (bit dấu của A được chép, không điền 0). n chu kỳ; tích nằm trong A, Q.</p>
<p>Vì sao đúng: một dãy bit 1 liên tiếp trong số nhân là hiệu của hai luỹ thừa của 2. 0111 0 = 2<sup>4</sup> − 2<sup>1</sup>, nên "× 0111 0" = "× 2<sup>4</sup> − × 2<sup>1</sup>": một phép trừ ở chỗ dãy bắt đầu (cặp 10, quét từ phải sang) và một phép cộng ở chỗ dãy kết thúc (cặp 01). Trong dãy (11) và ngoài dãy (00) không làm gì. Vì trọng số âm của bit cao nhất được xử lý bằng chính luật đó, số nhân âm tự động ra đúng.</p>
<div class="pitfall">Phép dịch phải là <strong>dịch số học</strong> (chép bit dấu của A). Dịch logic (điền 0) biến kết quả trung gian âm thành dương — lỗi phổ biến nhất khi chạy tay Booth.</div>`],

  [26, 'Figure 11.13 Example of Booth\'s Algorithm (7 × 3)',
    `<p class="y-chinh">🎯 M = 0111 (7), Q = 0011 (3). Four cycles: pair 10 → subtract, then shifts, pair 01 → add, shifts. Final A Q = 0001 0101 = 21 ✓.</p>
<table>
<thead><tr><th>A</th><th>Q</th><th>Q<sub>−1</sub></th><th>step</th></tr></thead>
<tbody>
<tr><td>0000</td><td>0011</td><td>0</td><td>initial</td></tr>
<tr><td>1001</td><td>0011</td><td>0</td><td>pair 10: A ← A − M</td></tr>
<tr><td>1100</td><td>1001</td><td>1</td><td>shift (cycle 1)</td></tr>
<tr><td>1110</td><td>0100</td><td>1</td><td>pair 11: shift only (cycle 2)</td></tr>
<tr><td>0101</td><td>0100</td><td>1</td><td>pair 01: A ← A + M</td></tr>
<tr><td>0010</td><td>1010</td><td>0</td><td>shift (cycle 3)</td></tr>
<tr><td>0001</td><td>0101</td><td>0</td><td>pair 00: shift only (cycle 4)</td></tr>
</tbody>
</table>
<p>The Python simulator at the end prints this table line for line (its first block). Watch cycle 1: A = 1001 is negative, and the arithmetic shift gives 1100 — the sign bit 1 was copied.</p>`,
    `<p class="y-chinh">🎯 M = 0111 (7), Q = 0011 (3). Bốn chu kỳ: cặp 10 → trừ, rồi dịch, cặp 01 → cộng, dịch. Cuối cùng A Q = 0001 0101 = 21 ✓.</p>
<table>
<thead><tr><th>A</th><th>Q</th><th>Q<sub>−1</sub></th><th>bước</th></tr></thead>
<tbody>
<tr><td>0000</td><td>0011</td><td>0</td><td>khởi tạo</td></tr>
<tr><td>1001</td><td>0011</td><td>0</td><td>cặp 10: A ← A − M</td></tr>
<tr><td>1100</td><td>1001</td><td>1</td><td>dịch (chu kỳ 1)</td></tr>
<tr><td>1110</td><td>0100</td><td>1</td><td>cặp 11: chỉ dịch (chu kỳ 2)</td></tr>
<tr><td>0101</td><td>0100</td><td>1</td><td>cặp 01: A ← A + M</td></tr>
<tr><td>0010</td><td>1010</td><td>0</td><td>dịch (chu kỳ 3)</td></tr>
<tr><td>0001</td><td>0101</td><td>0</td><td>cặp 00: chỉ dịch (chu kỳ 4)</td></tr>
</tbody>
</table>
<p>Bộ mô phỏng Python ở cuối bài in ra đúng bảng này từng dòng (khối đầu tiên). Xem chu kỳ 1: A = 1001 là số âm, và phép dịch số học cho ra 1100 — bit dấu 1 đã được chép.</p>`],

  [27, 'Figure 11.14 Examples Using Booth\'s Algorithm',
    `<p class="y-chinh">🎯 All four sign combinations of 7 and 3 come out right: 7 × 3 = 21, 7 × (−3) = −21, (−7) × 3 = −21, (−7) × (−3) = 21. The labels "1–0", "0–1", "1–1" next to each row are the bit pairs Q<sub>0</sub>Q<sub>−1</sub> that decide subtract, add or nothing.</p>
<p>Read (b) 0111 × 1101: pairs from the right are 1–0 (subtract 7: 1111 1001), 0–1 (add 7 shifted: 000 0111…), 1–0 (subtract shifted 7: 1110 01…), 1–1 (nothing). The partial products are already sign-extended, and the sum is 1110 1011 = −21 — no sign fix-up at the end.</p>
<p>The simulator's four blocks reproduce all four results with the register traces (A Q = 0001 0101, 1110 1011, 1110 1011, 0001 0101). Use them to check your hand traces.</p>
<p class="meo">💡 Booth is also faster when the multiplier has long runs of 1s (e.g. 0111 1111 1110 needs just one subtraction and one addition instead of ten additions). Modern multipliers use "radix-4 Booth", which looks at three bits at a time and halves the number of partial products.</p>`,
    `<p class="y-chinh">🎯 Cả bốn tổ hợp dấu của 7 và 3 đều ra đúng: 7 × 3 = 21, 7 × (−3) = −21, (−7) × 3 = −21, (−7) × (−3) = 21. Nhãn "1–0", "0–1", "1–1" cạnh mỗi dòng là cặp bit Q<sub>0</sub>Q<sub>−1</sub> quyết định trừ, cộng hay không làm gì.</p>
<p>Đọc (b) 0111 × 1101: các cặp từ phải sang là 1–0 (trừ 7: 1111 1001), 0–1 (cộng 7 đã dịch: 000 0111…), 1–0 (trừ 7 đã dịch: 1110 01…), 1–1 (không làm gì). Các tích riêng đã được mở rộng dấu sẵn, và tổng là 1110 1011 = −21 — không cần sửa dấu ở cuối.</p>
<p>Bốn khối của bộ mô phỏng tái hiện cả bốn kết quả kèm vết thanh ghi (A Q = 0001 0101, 1110 1011, 1110 1011, 0001 0101). Dùng chúng để kiểm bài chạy tay của bạn.</p>
<p class="meo">💡 Booth còn nhanh hơn khi số nhân có dãy bit 1 dài (vd 0111 1111 1110 chỉ cần một phép trừ và một phép cộng thay vì mười phép cộng). Bộ nhân hiện đại dùng "Booth cơ số 4", nhìn ba bit một lần và giảm một nửa số tích riêng.</p>`],

  [28, 'Figure 11.15 Example of Division of Unsigned Binary Integers',
    `<p class="y-chinh">🎯 Long division in binary: 1001 0011 (147) ÷ 1011 (11) = quotient 0000 1101 (13), remainder 100 (4). Check: 13 × 11 + 4 = 147 ✓.</p>
<p>The figure labels the parts: <strong>divisor</strong> 1011, <strong>dividend</strong> 1001 0011, <strong>partial remainders</strong> 001110, 001111, and the final <strong>remainder</strong> 100. At each step the question is binary and easy: "does the divisor fit into the current partial remainder?" — yes → quotient bit 1 and subtract; no → quotient bit 0 and bring down the next bit.</p>
<p>Division is the slowest of the four operations precisely because each quotient bit depends on the previous subtraction; the steps cannot easily overlap. On modern CPUs an integer division takes tens of cycles, against 3–4 for a multiplication.</p>`,
    `<p class="y-chinh">🎯 Chia dài kiểu nhị phân: 1001 0011 (147) ÷ 1011 (11) = thương 0000 1101 (13), dư 100 (4). Kiểm: 13 × 11 + 4 = 147 ✓.</p>
<p>Hình ghi tên các phần: <strong>số chia</strong> 1011, <strong>số bị chia</strong> 1001 0011, <strong>số dư từng phần</strong> 001110, 001111, và <strong>số dư</strong> cuối 100. Ở mỗi bước câu hỏi là nhị phân và dễ: "số chia có vừa vào số dư hiện tại không?" — có → bit thương 1 và trừ; không → bit thương 0 và hạ bit kế tiếp.</p>
<p>Phép chia chậm nhất trong bốn phép chính vì mỗi bit thương phụ thuộc vào phép trừ trước nó; các bước khó chồng lên nhau. Trên CPU hiện đại một phép chia số nguyên tốn hàng chục chu kỳ, so với 3–4 cho phép nhân.</p>`],

  [29, 'Figure 11.16 Flowchart for Unsigned Binary Division',
    `<p class="y-chinh">🎯 Registers: A ← 0, M ← divisor, Q ← dividend, Count ← n. Each cycle: shift A, Q left one bit; A ← A − M; if A &lt; 0 then Q<sub>0</sub> ← 0 and A ← A + M (<strong>restore</strong>), else Q<sub>0</sub> ← 1. After n cycles: quotient in Q, remainder in A.</p>
<p>"Restoring" names the step where a subtraction that went negative is undone by adding M back. The left shift plays the role of "bring down the next bit" in pencil division; testing the sign of A is "does it fit?".</p>
<p class="meo">💡 Mirror image of the multiplier: multiplication = add + shift <em>right</em>, n times; division = subtract + shift <em>left</em>, n times. Same registers A, Q, M, the same adder. Non-restoring division (not in the deck) skips the restore by adding M in the next cycle instead.</p>`,
    `<p class="y-chinh">🎯 Thanh ghi: A ← 0, M ← số chia, Q ← số bị chia, Count ← n. Mỗi chu kỳ: dịch trái A, Q một bit; A ← A − M; nếu A &lt; 0 thì Q<sub>0</sub> ← 0 và A ← A + M (<strong>phục hồi</strong>), ngược lại Q<sub>0</sub> ← 1. Sau n chu kỳ: thương trong Q, dư trong A.</p>
<p>"Phục hồi" (restoring) là tên của bước hoàn tác một phép trừ đã ra âm bằng cách cộng M lại. Phép dịch trái đóng vai "hạ bit kế tiếp" của phép chia bút chì; kiểm dấu của A là "có vừa không?".</p>
<p class="meo">💡 Ảnh gương của bộ nhân: nhân = cộng + dịch <em>phải</em>, n lần; chia = trừ + dịch <em>trái</em>, n lần. Cùng thanh ghi A, Q, M, cùng bộ cộng. Chia không phục hồi (non-restoring, không có trong deck) bỏ bước phục hồi bằng cách cộng M ở chu kỳ sau.</p>`],

  [30, 'Figure 11.17 Example of Restoring Twos Complement Division (7/3)',
    `<p class="y-chinh">🎯 7 ÷ 3 with A = 0000, Q = 0111, M = 0011 (subtraction done as adding −M = 1101). Four cycles: restore, restore, subtract OK (Q<sub>0</sub> = 1), restore. Result Q = 0010 (2), A = 0001 (1): 7 = 2 × 3 + 1 ✓.</p>
<table>
<thead><tr><th>cycle</th><th>after shift</th><th>A − M</th><th>action</th><th>A</th><th>Q</th></tr></thead>
<tbody>
<tr><td>1</td><td>0000 1110</td><td>1101 (&lt;0)</td><td>restore, Q<sub>0</sub> = 0</td><td>0000</td><td>1110</td></tr>
<tr><td>2</td><td>0001 1100</td><td>1110 (&lt;0)</td><td>restore, Q<sub>0</sub> = 0</td><td>0001</td><td>1100</td></tr>
<tr><td>3</td><td>0011 1000</td><td>0000 (≥0)</td><td>keep, Q<sub>0</sub> = 1</td><td>0000</td><td>1001</td></tr>
<tr><td>4</td><td>0001 0010</td><td>1110 (&lt;0)</td><td>restore, Q<sub>0</sub> = 0</td><td>0001</td><td>0010</td></tr>
</tbody>
</table>
<p>The division simulator below prints the same four states. For signed operands the textbook rule is: remainder takes the sign of the dividend, quotient is negative iff the signs differ — the same convention C uses (<code>-7 / 2 == -3</code>, <code>-7 % 2 == -1</code>).</p>`,
    `<p class="y-chinh">🎯 7 ÷ 3 với A = 0000, Q = 0111, M = 0011 (phép trừ làm bằng cộng −M = 1101). Bốn chu kỳ: phục hồi, phục hồi, trừ được (Q<sub>0</sub> = 1), phục hồi. Kết quả Q = 0010 (2), A = 0001 (1): 7 = 2 × 3 + 1 ✓.</p>
<table>
<thead><tr><th>chu kỳ</th><th>sau khi dịch</th><th>A − M</th><th>hành động</th><th>A</th><th>Q</th></tr></thead>
<tbody>
<tr><td>1</td><td>0000 1110</td><td>1101 (&lt;0)</td><td>phục hồi, Q<sub>0</sub> = 0</td><td>0000</td><td>1110</td></tr>
<tr><td>2</td><td>0001 1100</td><td>1110 (&lt;0)</td><td>phục hồi, Q<sub>0</sub> = 0</td><td>0001</td><td>1100</td></tr>
<tr><td>3</td><td>0011 1000</td><td>0000 (≥0)</td><td>giữ, Q<sub>0</sub> = 1</td><td>0000</td><td>1001</td></tr>
<tr><td>4</td><td>0001 0010</td><td>1110 (&lt;0)</td><td>phục hồi, Q<sub>0</sub> = 0</td><td>0001</td><td>0010</td></tr>
</tbody>
</table>
<p>Bộ mô phỏng phép chia bên dưới in ra đúng bốn trạng thái này. Với toán hạng có dấu, quy tắc của giáo trình: số dư mang dấu của số bị chia, thương âm khi và chỉ khi hai dấu khác nhau — đúng quy ước C dùng (<code>-7 / 2 == -3</code>, <code>-7 % 2 == -1</code>).</p>`],
]);

/* ───────────── Thực hành ───────────── */
const THUC_HANH = bi(`<h2>🔧 Hands-on: two's complement and overflow in real C</h2>
<h3>1 · The bits of −5, sign extension, negation, the most negative number</h3>
` + code('c', C_BU2) + out(O_BU2) + `
<p>Every line matches a slide: −5 = 1111 1011 (slide 8), widening copies the sign bit (slide 9), invert + 1 turns 18 into −18 (slide 11), −(−128) stays −128 (slide 13). <code>(uint8_t)a8</code> shows the trick of slide 4: the same bits read unsigned are 251.</p>
<h3>2 · Overflow in C: unsigned wraps, signed is undefined behaviour</h3>
<p>The C standard says unsigned arithmetic wraps modulo 2<sup>n</sup> (the wheel of slide 18). For <em>signed</em> overflow it says nothing — "undefined behaviour" — so an optimising compiler may assume it never happens. Compile the same file four ways:</p>
` + code('c', C_TRAN) + out(O_TRAN) + `
` + code('bash', SH_TRAN) + out(O_TRAN_CO) + `
<p>The comments after "&lt;-" were added afterwards; everything else is the real output. At <code>-O0</code> the addition really wraps to INT_MIN, so <code>y &gt; x</code> is false. At <code>-O2</code> GCC reasons "x + 1 &gt; x is always true for a signed int, because overflow cannot happen" and returns 1 without adding. <code>-fwrapv</code> forbids that assumption. <code>-fsanitize=undefined</code> catches the overflow at run time and prints the file and line. This is exactly how "it works in debug, breaks in release" bugs are born.</p>
<h3>3 · Signed meets unsigned</h3>
` + code('c', C_SOSANH) + out(O_SOSANH) + `
<p>GCC with <code>-Wall -Wextra</code> warns before running it:</p>
` + out(O_SOSANH_WARN) + `
<p>In <code>a &lt; b</code> the <code>int</code> is converted to <code>unsigned</code>, −1 becomes 4 294 967 295, and the comparison is false. The loop shows the safe way to count down with an unsigned index: <code>i &lt; n</code> stops when <code>i</code> wraps past 0. The tempting <code>i &gt;= 0</code> would loop forever, because an unsigned value is always ≥ 0.</p>
<h3>4 · The ALU algorithms, step by step</h3>
<p>Addition with the overflow rule of slide 15 — the six cases of Figure 11.3:</p>
` + code('python', PY_CONG) + out(O_CONG) + `
<p>Booth's algorithm — the four results of Figures 11.13 and 11.14:</p>
` + code('python', PY_BOOTH) + out(O_BOOTH) + `
<p>Restoring division — Figure 11.17 (7/3) and Figure 11.15 (147/11):</p>
` + code('python', PY_CHIA) + out(O_CHIA) + `
`,
`<h2>🔧 Thực hành: bù hai và tràn số trong C thật</h2>
<h3>1 · Các bit của −5, mở rộng dấu, đổi dấu, số âm nhất</h3>
` + code('c', C_BU2) + out(O_BU2) + `
<p>Mỗi dòng khớp một slide: −5 = 1111 1011 (slide 8), mở rộng thì chép bit dấu (slide 9), đảo bit + 1 biến 18 thành −18 (slide 11), −(−128) vẫn là −128 (slide 13). <code>(uint8_t)a8</code> cho thấy mẹo của slide 4: cùng các bit đó đọc không dấu là 251.</p>
<h3>2 · Tràn số trong C: không dấu thì quay vòng, có dấu là hành vi không xác định</h3>
<p>Chuẩn C nói phép tính không dấu quay vòng theo modulo 2<sup>n</sup> (bánh xe của slide 18). Với tràn <em>có dấu</em> chuẩn không quy định gì — "hành vi không xác định" (undefined behaviour) — nên trình biên dịch tối ưu được phép giả định nó không bao giờ xảy ra. Biên dịch cùng một tệp theo bốn cách:</p>
` + code('c', C_TRAN) + out(O_TRAN) + `
` + code('bash', SH_TRAN) + out(O_TRAN_CO) + `
<p>Phần chú thích sau "&lt;-" được thêm vào sau; mọi thứ khác là output thật. Ở <code>-O0</code> phép cộng thật sự quay vòng về INT_MIN, nên <code>y &gt; x</code> sai. Ở <code>-O2</code> GCC lập luận "x + 1 &gt; x luôn đúng với int có dấu, vì tràn không thể xảy ra" và trả về 1 mà không cộng. <code>-fwrapv</code> cấm giả định đó. <code>-fsanitize=undefined</code> bắt được vụ tràn lúc chạy và in ra tệp, dòng. Lỗi kiểu "chạy debug thì được, build release thì hỏng" sinh ra đúng như vậy.</p>
<h3>3 · Có dấu gặp không dấu</h3>
` + code('c', C_SOSANH) + out(O_SOSANH) + `
<p>GCC với <code>-Wall -Wextra</code> cảnh báo trước khi chạy:</p>
` + out(O_SOSANH_WARN) + `
<p>Trong <code>a &lt; b</code>, <code>int</code> bị đổi sang <code>unsigned</code>, −1 thành 4 294 967 295, và phép so sánh ra sai. Vòng lặp cho thấy cách đếm lùi an toàn với chỉ số không dấu: <code>i &lt; n</code> dừng khi <code>i</code> quay vòng qua 0. Cách viết hấp dẫn <code>i &gt;= 0</code> sẽ lặp mãi, vì giá trị không dấu luôn ≥ 0.</p>
<h3>4 · Thuật toán của ALU, từng bước</h3>
<p>Phép cộng với luật tràn của slide 15 — sáu ca của Hình 11.3:</p>
` + code('python', PY_CONG) + out(O_CONG) + `
<p>Thuật toán Booth — bốn kết quả của Hình 11.13 và 11.14:</p>
` + code('python', PY_BOOTH) + out(O_BOOTH) + `
<p>Phép chia phục hồi — Hình 11.17 (7/3) và Hình 11.15 (147/11):</p>
` + code('python', PY_CHIA) + out(O_CHIA) + `
`);

const LAB = bi(thuNgay('en', 'bits', 'signed', 'Negative numbers and overflow, live: pick a width, two numbers and + or −, and read both flags.', [
  'At 4 bits, enter 5 + 4: confirm V = 1 and the result −7 (slide 14 case e).',
  'At 8 bits, find an addition that sets C = 1 but V = 0, and one that sets V = 1 but C = 0.',
  'Enter −128 − 1 at 8 bits. Which flag fires, and where on the wheel did you cross?',
], { tour: 'bits-signed' }) + thuNgay('en', 'logic', 'ripple', 'The adder of slide 19, gate by gate: an 8-bit ripple-carry adder with the carries travelling from bit 0 to bit 7.', [
  'Add 0111 1111 + 0000 0001 and follow the carry chain — this is 127 + 1.',
  'Look at the carry into and out of the top bit: XOR them and compare with the overflow you expect.',
], { heading: false, tour: 'logic-ripple' }),
thuNgay('vi', 'bits', 'signed', 'Số âm và tràn số, chạy trực tiếp: chọn độ rộng, hai số và + hoặc −, rồi đọc cả hai cờ.', [
  'Ở 4 bit, nhập 5 + 4: xác nhận V = 1 và kết quả −7 (slide 14 ca e).',
  'Ở 8 bit, tìm một phép cộng bật C = 1 mà V = 0, và một phép bật V = 1 mà C = 0.',
  'Nhập −128 − 1 ở 8 bit. Cờ nào bật, và bạn đã băng qua chỗ nào trên bánh xe?',
], { tour: 'bits-signed' }) + thuNgay('vi', 'logic', 'ripple', 'Bộ cộng của slide 19, từng cổng một: bộ cộng 8 bit nối tiếp nhớ với các bit nhớ chạy từ bit 0 lên bit 7.', [
  'Cộng 0111 1111 + 0000 0001 và đi theo chuỗi nhớ — đây là 127 + 1.',
  'Nhìn bit nhớ vào và ra ở bit cao nhất: XOR chúng rồi so với vụ tràn bạn đang chờ.',
], { heading: false, tour: 'logic-ripple' }));

const BAY_BAI_TAP = bi(`<h3>⚠️ Common traps</h3>
<div class="pitfall"><b>Using the carry to detect signed overflow.</b> Figure 11.3 (b) and (d) carry out and are correct; (e) does not carry and is wrong. Signed overflow = same-sign operands, opposite-sign result (V flag).</div>
<div class="pitfall"><b>Zero-extending a negative number.</b> 1111 1011 (−5) padded with zeros is +251. Widen two's complement by copying the sign bit.</div>
<div class="pitfall"><b>Trusting signed overflow to wrap in C.</b> It is undefined behaviour; <code>-O2</code> may delete your overflow check (run above). Check before adding: <code>if (x &gt; INT_MAX - y)</code>, or use <code>__builtin_add_overflow</code>, or a wider type.</div>
<div class="pitfall"><b>Mixing signed and unsigned.</b> <code>-1 &lt; 1u</code> is false; <code>for (unsigned i = n - 1; i &gt;= 0; i--)</code> never ends. Keep warnings on (<code>-Wall -Wextra</code>) and read <code>-Wsign-compare</code>.</div>
<div class="pitfall"><b>Logical instead of arithmetic shift in Booth.</b> After A ← A − M the partial result is often negative; shift it right by copying the sign bit.</div>
<h3>Exercises</h3>
<p><b>E1.</b> Write −37 in 8-bit two's complement, in binary and hex.</p>
` + xem('Solution', `<p>37 = 0010 0101 → invert 1101 1010 → +1 = <b>1101 1011 = 0xDB</b>. Value box check: −128 + 64 + 16 + 8 + 2 + 1 = −37.</p>`) + `
<p><b>E2.</b> What is 1001 1100 as an unsigned number and as a two's complement number?</p>
` + xem('Solution', `<p>Unsigned: 128 + 16 + 8 + 4 = <b>156</b>. Two's complement: −128 + 28 = <b>−100</b> (= 156 − 256).</p>`) + `
<p><b>E3.</b> In 4-bit two's complement compute 6 + 3 and (−8) + (−1). Which overflow, and what does the hardware produce?</p>
` + xem('Solution', `<p>0110 + 0011 = 0|1001 → "−7": both positive, result negative → <b>overflow</b>, no carry out. 1000 + 1111 = 1|0111 → "+7": both negative, result positive → <b>overflow</b>, carry out 1. (The Python adder above prints exactly these two lines when called with these values.)</p>`) + `
<p><b>E4.</b> Sign-extend −6 from 4 bits to 8 bits, and explain why zero-extension would be wrong.</p>
` + xem('Solution', `<p>−6 = 1010 → <b>1111 1010</b> (still −128 + 122 = −6). Zero-extended, 0000 1010 = +10.</p>`) + `
<p><b>E5.</b> Trace Booth's algorithm for 3 × (−2) in 4 bits (M = 0011, Q = 1110).</p>
` + xem('Solution — trace from the simulator', out(String.raw`
  A     Q     Q-1  M
  0000  1110   0   0011   khoi tao
  0000  0111   0   0011   dich phai  (chu ky 1)
  1101  0111   0   0011   A <- A - M
  1110  1011   1   0011   dich phai  (chu ky 2)
  1111  0101   1   0011   dich phai  (chu ky 3)
  1111  1010   1   0011   dich phai  (chu ky 4)
  => A Q = 1111 1010 = -6
`) + `<p>Pairs Q<sub>0</sub>Q<sub>−1</sub>: 00 (shift), 10 (subtract), 11, 11. One subtraction does all the work: −2 = 1110 is a run of 1s starting at bit 1.</p>`) + `
<p><b>E6.</b> Run restoring division for 13 ÷ 4 with 4-bit registers. Quotient and remainder?</p>
` + xem('Solution — trace from the simulator', out(String.raw`
13 / 4:  A    Q
   dich, tru -> am, phuc hoi: 0001 1010   Q0 = 0
   dich, tru -> am, phuc hoi: 0011 0100   Q0 = 0
   dich, tru -> duong       : 0010 1001   Q0 = 1
   dich, tru -> duong       : 0001 0011   Q0 = 1
   => thuong Q = 3, du A = 1
`) + `<p>13 = 3 × 4 + 1 ✓.</p>`) + `
<h3>Self-check</h3>
<ol>
<li>What is the range of a 16-bit two's complement integer?</li>
<li>Why does two's complement need no separate subtraction circuit?</li>
<li>Can adding a positive and a negative number overflow?</li>
<li>In Booth's algorithm, what does the pair Q<sub>0</sub>Q<sub>−1</sub> = 01 mean?</li>
<li>Why is <code>abs(INT_MIN)</code> dangerous?</li>
</ol>
` + xem('Answers', `<ol><li>−32 768 … 32 767.</li><li>A − B = A + (invert B) + 1: invert with XOR gates, supply the +1 as the adder's carry-in.</li><li>No — the result lies between the operands.</li><li>The end of a run of 1s (scanning right to left): A ← A + M.</li><li>+2 147 483 648 does not fit in 32-bit <code>int</code>; the result is undefined behaviour (in practice INT_MIN again).</li></ol>`) + `
<h3>Where this connects</h3>
<ul>
<li>Previous / next: ` + bai(COA, 'cea201-cs1-he-dem', '⭐ CS.1 — number systems') + ` · ` + bai(COA, 'cea201-cs3-dau-phay-dong-ieee754', '⭐ CS.3 — IEEE 754 floating point') + ` (the biased exponent comes from slide 7).</li>
<li>Within CEA201: the adders and ripple carry of ` + bai(COA, 'cea201-9-0b-slides-giai-ma-rom-cong-mach-tuan-tu', '9.0b — decoders, adders and sequential circuits') + `; arithmetic instructions and flags in ` + bai(COA, 'cea201-10-0b-slides-phep-toan-chuyen-dieu-khien-x86-arm', '10.0b — operation types and transfer of control') + `.</li>
<li>Academy: ` + bai('programming-fundamentals', 'prf192-3-2-uu-tien', 'PRF192 3.2 — type casting') + ` · ` + bai('introduction-to-computer-science', 'csi104-2-3-so-hoc-nhi-phan', 'CSI104 2.3 — binary arithmetic') + ` · ` + bai('csi106-introduction-to-computer-science', 'csi106-3-1-storing-numbers', 'CSI106 3.1 — storing numbers') + `.</li>
<li>Courses: when an integer overflow becomes a memory bug — ` + bai('operating-systems-for-developers', 'os-13-2-overflow', 'Operating Systems for Developers 13.2 — buffer overflow') + ` · overflow in numeric code — ` + bai('math-for-ml', 'math-ml-11-2-tran-so', 'Math for ML 11.2') + `.</li>
</ul>`,
`<h3>⚠️ Bẫy thường gặp</h3>
<div class="pitfall"><b>Dùng bit nhớ để phát hiện tràn có dấu.</b> Hình 11.3 (b) và (d) có nhớ ra mà đúng; (e) không nhớ mà sai. Tràn có dấu = hai toán hạng cùng dấu, kết quả khác dấu (cờ V).</div>
<div class="pitfall"><b>Mở rộng số âm bằng số 0.</b> 1111 1011 (−5) đệm 0 thành +251. Mở rộng bù hai bằng cách chép bit dấu.</div>
<div class="pitfall"><b>Tin rằng tràn có dấu trong C sẽ quay vòng.</b> Đó là hành vi không xác định; <code>-O2</code> có thể xoá luôn đoạn kiểm tràn của bạn (lần chạy ở trên). Kiểm trước khi cộng: <code>if (x &gt; INT_MAX - y)</code>, hoặc dùng <code>__builtin_add_overflow</code>, hoặc kiểu rộng hơn.</div>
<div class="pitfall"><b>Trộn có dấu với không dấu.</b> <code>-1 &lt; 1u</code> ra sai; <code>for (unsigned i = n - 1; i &gt;= 0; i--)</code> không bao giờ dừng. Bật cảnh báo (<code>-Wall -Wextra</code>) và đọc <code>-Wsign-compare</code>.</div>
<div class="pitfall"><b>Dịch logic thay vì dịch số học trong Booth.</b> Sau A ← A − M kết quả trung gian thường âm; dịch phải bằng cách chép bit dấu.</div>
<h3>Bài tập</h3>
<p><b>E1.</b> Viết −37 ở dạng bù hai 8 bit, bằng nhị phân và hex.</p>
` + xem('Lời giải', `<p>37 = 0010 0101 → đảo 1101 1010 → +1 = <b>1101 1011 = 0xDB</b>. Kiểm bằng hộp giá trị: −128 + 64 + 16 + 8 + 2 + 1 = −37.</p>`) + `
<p><b>E2.</b> 1001 1100 là bao nhiêu khi đọc không dấu và khi đọc bù hai?</p>
` + xem('Lời giải', `<p>Không dấu: 128 + 16 + 8 + 4 = <b>156</b>. Bù hai: −128 + 28 = <b>−100</b> (= 156 − 256).</p>`) + `
<p><b>E3.</b> Với bù hai 4 bit, tính 6 + 3 và (−8) + (−1). Phép nào tràn, phần cứng cho ra gì?</p>
` + xem('Lời giải', `<p>0110 + 0011 = 0|1001 → "−7": hai số dương, kết quả âm → <b>tràn</b>, không nhớ ra. 1000 + 1111 = 1|0111 → "+7": hai số âm, kết quả dương → <b>tràn</b>, nhớ ra 1. (Bộ cộng Python ở trên in đúng hai dòng này khi gọi với các giá trị đó.)</p>`) + `
<p><b>E4.</b> Mở rộng dấu −6 từ 4 bit lên 8 bit, và giải thích vì sao mở rộng bằng 0 là sai.</p>
` + xem('Lời giải', `<p>−6 = 1010 → <b>1111 1010</b> (vẫn là −128 + 122 = −6). Đệm 0 thành 0000 1010 = +10.</p>`) + `
<p><b>E5.</b> Chạy tay thuật toán Booth cho 3 × (−2) với 4 bit (M = 0011, Q = 1110).</p>
` + xem('Lời giải — vết chạy từ bộ mô phỏng', out(String.raw`
  A     Q     Q-1  M
  0000  1110   0   0011   khoi tao
  0000  0111   0   0011   dich phai  (chu ky 1)
  1101  0111   0   0011   A <- A - M
  1110  1011   1   0011   dich phai  (chu ky 2)
  1111  0101   1   0011   dich phai  (chu ky 3)
  1111  1010   1   0011   dich phai  (chu ky 4)
  => A Q = 1111 1010 = -6
`) + `<p>Các cặp Q<sub>0</sub>Q<sub>−1</sub>: 00 (dịch), 10 (trừ), 11, 11. Một phép trừ làm hết việc: −2 = 1110 là một dãy bit 1 bắt đầu từ bit 1.</p>`) + `
<p><b>E6.</b> Chạy phép chia phục hồi cho 13 ÷ 4 với thanh ghi 4 bit. Thương và dư?</p>
` + xem('Lời giải — vết chạy từ bộ mô phỏng', out(String.raw`
13 / 4:  A    Q
   dich, tru -> am, phuc hoi: 0001 1010   Q0 = 0
   dich, tru -> am, phuc hoi: 0011 0100   Q0 = 0
   dich, tru -> duong       : 0010 1001   Q0 = 1
   dich, tru -> duong       : 0001 0011   Q0 = 1
   => thuong Q = 3, du A = 1
`) + `<p>13 = 3 × 4 + 1 ✓.</p>`) + `
<h3>Tự kiểm</h3>
<ol>
<li>Phạm vi của số nguyên bù hai 16 bit là gì?</li>
<li>Vì sao bù hai không cần mạch trừ riêng?</li>
<li>Cộng một số dương với một số âm có thể tràn không?</li>
<li>Trong thuật toán Booth, cặp Q<sub>0</sub>Q<sub>−1</sub> = 01 nghĩa là gì?</li>
<li>Vì sao <code>abs(INT_MIN)</code> nguy hiểm?</li>
</ol>
` + xem('Đáp án', `<ol><li>−32 768 … 32 767.</li><li>A − B = A + (đảo B) + 1: đảo bằng cổng XOR, "+1" cấp qua bit nhớ vào của bộ cộng.</li><li>Không — kết quả nằm giữa hai toán hạng.</li><li>Kết thúc một dãy bit 1 (quét từ phải sang): A ← A + M.</li><li>+2 147 483 648 không vừa <code>int</code> 32 bit; kết quả là hành vi không xác định (thực tế lại ra INT_MIN).</li></ol>`) + `
<h3>Liên kết</h3>
<ul>
<li>Trước / sau: ` + bai(COA, 'cea201-cs1-he-dem', '⭐ CS.1 — hệ đếm') + ` · ` + bai(COA, 'cea201-cs3-dau-phay-dong-ieee754', '⭐ CS.3 — dấu phẩy động IEEE 754') + ` (số mũ lệch bắt nguồn từ slide 7).</li>
<li>Trong CEA201: bộ cộng và nhớ nối tiếp ở ` + bai(COA, 'cea201-9-0b-slides-giai-ma-rom-cong-mach-tuan-tu', '9.0b — bộ giải mã, bộ cộng và mạch tuần tự') + `; lệnh số học và cờ ở ` + bai(COA, 'cea201-10-0b-slides-phep-toan-chuyen-dieu-khien-x86-arm', '10.0b — loại phép toán và chuyển điều khiển') + `.</li>
<li>Academy: ` + bai('programming-fundamentals', 'prf192-3-2-uu-tien', 'PRF192 3.2 — ép kiểu') + ` · ` + bai('introduction-to-computer-science', 'csi104-2-3-so-hoc-nhi-phan', 'CSI104 2.3 — số học nhị phân') + ` · ` + bai('csi106-introduction-to-computer-science', 'csi106-3-1-storing-numbers', 'CSI106 3.1 — lưu số') + `.</li>
<li>Courses: khi tràn số nguyên thành lỗi bộ nhớ — ` + bai('operating-systems-for-developers', 'os-13-2-overflow', 'Operating Systems for Developers 13.2 — tràn bộ đệm') + ` · tràn số trong tính toán số học — ` + bai('math-for-ml', 'math-ml-11-2-tran-so', 'Math for ML 11.2') + `.</li>
</ul>`);

export default {
  title: '⭐ CS.2 — Integer arithmetic: two\'s complement, overflow, Booth, division (CEA11 #1–30)|||⭐ CS.2 — Số học số nguyên: bù hai, tràn số, Booth, phép chia (CEA11 #1–30)',
  slug: 'cea201-cs2-so-hoc-so-nguyen',
  type: 'DOCUMENT',
  description: 'Phần ⭐ Chuyên sâu web bổ sung (deck chính hãng Chapter 11 "Computer Arithmetic", slide 1–30 — không nằm trong lịch học): ALU và cờ, dấu–độ lớn, bù hai (bảng 11.1, hộp giá trị), số lệch, mở rộng dấu, dấu phẩy tĩnh, đổi dấu và hai ca đặc biệt (0, −128), cộng/trừ và luật tràn, bánh xe bù hai, mạch cộng/trừ, nhân không dấu dịch-và-cộng, thuật toán Booth (4 tổ hợp dấu), chia phục hồi; chạy thật bằng C (−5 ở 8/32 bit, INT_MIN, tràn có dấu là UB: -O0/-O2/-fwrapv/UBSan, signed vs unsigned) và bộ mô phỏng Python tái hiện Hình 11.3, 11.13, 11.14, 11.15, 11.17; mở đầu bằng YouTube 2014, Boeing 787, năm 2038; nêu hai lỗi của slide (nhãn ±0 bảng 11.2, "Figure 9.7").',
  content: [MO_DAU, walkHead(D, 1, 30,
    'Slides 31–55 of this deck (floating point) are lesson ⭐ CS.3.',
    'Slide 31–55 của deck này (dấu phẩy động) là bài ⭐ CS.3.'),
  SLIDES, THUC_HANH, LAB, BAY_BAI_TAP].join('\n'),
};
