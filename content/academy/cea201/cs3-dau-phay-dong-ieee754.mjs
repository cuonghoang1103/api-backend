/**
 * CEA201 · ⭐ CS.3 — Dấu phẩy động IEEE 754 (deck 'cea11' slide 31–55, Chapter 11 nửa sau).
 *
 * Phần ⭐ Chuyên sâu do web BỔ SUNG — deck có trong bộ slide chính hãng nhưng không nằm trong
 * lịch 60 buổi (xem _slides.mjs). Slide 1–30 của deck là bài CS.2.
 *
 * Chạy thật: container node:22 (Debian 12, GCC 12.2.0, Python 3.11.2, aarch64).
 * Mọi con số trong bài (mã hoá −6,25 / 0,15625, sai số Patriot, Ariane) đã kiểm bằng máy.
 *
 * Chỗ slide gốc SAI/THIẾU (nêu thẳng trong bài, không sửa ảnh):
 *   · slide 39 (Table 11.3): "smallest positive normal" của binary128 ghi 2^−16362 — đúng là 2^−16382
 *     (= 2^(1 − 16383), khớp dòng "minimum exponent −16382" của chính bảng).
 *   · slide 42 (Table 11.5a, binary32): "0 < e < 225" — đúng là 0 < e < 255.
 *   · slide 44 (Table 11.5c, binary128): dòng số chuẩn ghi biased exponent "all 1s" — đúng là
 *     0 < e < 32767 (all 1s là ∞/NaN); số dưới chuẩn ghi 2^(e−16383)(0.f) — đúng là 2^−16382(0.f).
 *   · slide 47 (Fig 11.23): tiêu đề "Floating-Point Multiplication (Z ← X ± Y)" — đúng là Z ← X × Y.
 *   · slide 36 chỉ có 4 ô SmartArt; slide 32–35, 38, 46–49, 54 chỉ có hình — đã đọc từ ảnh render.
 *   · deck dùng "typical 32-bit format" (Fig 11.18/11.19, mũ −127…128, không dành mã cho ∞/NaN)
 *     KHÁC binary32 của IEEE (mũ chuẩn −126…127) — bài nói rõ để khỏi lẫn hai bộ số.
 */
import { walk, walkHead, bi } from './_slides.mjs';
import { code, out, xem, bai } from './_cs.mjs';
import { thuNgay } from '../../_labs.mjs';

const D = 'cea11';
const COA = 'computer-organization-and-architecture';

const C_IEEE = String.raw`
#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <math.h>
#include <float.h>

/* Tach 32 bit cua mot float thanh dau | mu lech | phan dinh tri */
void moXe(const char *ten, float f) {
    uint32_t u;
    memcpy(&u, &f, sizeof u);            /* lay dung 32 bit, khong doi gia tri */
    unsigned s = u >> 31, e = (u >> 23) & 0xFF, m = u & 0x7FFFFF;
    printf("%-8s 0x%08X = %u | ", ten, (unsigned)u, s);
    for (int i = 7; i >= 0; i--) putchar((e >> i) & 1 ? '1' : '0');
    printf(" | ");
    for (int i = 22; i >= 0; i--) putchar((m >> i) & 1 ? '1' : '0');
    if (e == 0)        printf("   e=0   -> so 0 / so duoi chuan\n");
    else if (e == 255) printf("   e=255 -> vo cung / NaN\n");
    else               printf("   e=%3u -> 2^%d\n", e, (int)e - 127);
}

int main(void) {
    moXe("-6.25", -6.25f);
    moXe("1.0", 1.0f);
    moXe("0.1", 0.1f);
    moXe("-0.0", -0.0f);
    moXe("INF", INFINITY);
    moXe("NaN", NAN);
    moXe("min sub", 1.401298464e-45f);

    printf("\n0.1f that ra luu = %.20f\n", 0.1f);
    printf("0.1  that ra luu = %.20f\n", 0.1);
    printf("0.1 + 0.2 == 0.3 ? %s\n", (0.1 + 0.2 == 0.3) ? "dung" : "SAI");
    printf("0.1 + 0.2 = %.17g, 0.3 = %.17g\n", 0.1 + 0.2, 0.3);
    printf("fabs(0.1+0.2-0.3) < 1e-9 ? %s\n", fabs(0.1 + 0.2 - 0.3) < 1e-9 ? "dung" : "sai");

    float lon = 16777216.0f;             /* 2^24 */
    printf("2^24 + 1 (float) = %.1f\n", lon + 1.0f);
    printf("FLT_EPSILON = %g, DBL_EPSILON = %g\n", FLT_EPSILON, DBL_EPSILON);
    printf("FLT_MAX = %g, FLT_MIN (chuan nho nhat) = %g\n", FLT_MAX, FLT_MIN);

    double zero = 0.0;
    printf("1/0.0 = %f, -1/0.0 = %f, 0/0.0 = %f\n", 1 / zero, -1 / zero, zero / zero);
    printf("sqrt(-1) = %f, INF - INF = %f\n", sqrt(-1.0), INFINITY - INFINITY);
    double n = NAN;
    printf("NaN == NaN ? %d   isnan = %d   -0.0 == 0.0 ? %d\n", n == n, isnan(n), -0.0 == 0.0);
    return 0;
}
`;
const O_IEEE = String.raw`
-6.25    0xC0C80000 = 1 | 10000001 | 10010000000000000000000   e=129 -> 2^2
1.0      0x3F800000 = 0 | 01111111 | 00000000000000000000000   e=127 -> 2^0
0.1      0x3DCCCCCD = 0 | 01111011 | 10011001100110011001101   e=123 -> 2^-4
-0.0     0x80000000 = 1 | 00000000 | 00000000000000000000000   e=0   -> so 0 / so duoi chuan
INF      0x7F800000 = 0 | 11111111 | 00000000000000000000000   e=255 -> vo cung / NaN
NaN      0x7FC00000 = 0 | 11111111 | 10000000000000000000000   e=255 -> vo cung / NaN
min sub  0x00000001 = 0 | 00000000 | 00000000000000000000001   e=0   -> so 0 / so duoi chuan

0.1f that ra luu = 0.10000000149011611938
0.1  that ra luu = 0.10000000000000000555
0.1 + 0.2 == 0.3 ? SAI
0.1 + 0.2 = 0.30000000000000004, 0.3 = 0.29999999999999999
fabs(0.1+0.2-0.3) < 1e-9 ? dung
2^24 + 1 (float) = 16777216.0
FLT_EPSILON = 1.19209e-07, DBL_EPSILON = 2.22045e-16
FLT_MAX = 3.40282e+38, FLT_MIN (chuan nho nhat) = 1.17549e-38
1/0.0 = inf, -1/0.0 = -inf, 0/0.0 = nan
sqrt(-1) = nan, INF - INF = nan
NaN == NaN ? 0   isnan = 1   -0.0 == 0.0 ? 1
`;
const PY_IEEE = String.raw`
import struct, math
from decimal import Decimal
def bits32(x):
    u = struct.unpack(">I", struct.pack(">f", x))[0]
    b = format(u, "032b")
    return f"{b[0]} {b[1:9]} {b[9:]}"
print("-6.25  :", bits32(-6.25))
print("0.15625:", bits32(0.15625))
print("Decimal(0.1) =", Decimal(0.1))
print("(0.1).hex()  =", (0.1).hex())
print("0.1 + 0.2    =", 0.1 + 0.2)
print("math.isclose(0.1 + 0.2, 0.3) =", math.isclose(0.1 + 0.2, 0.3))
print("math.ulp(1.0) =", math.ulp(1.0), " math.ulp(1e16) =", math.ulp(1e16))
print("1e16 + 1 == 1e16 ?", 1e16 + 1 == 1e16)
print("sum([0.1]*10) =", sum([0.1] * 10), " math.fsum =", math.fsum([0.1] * 10))
print("float('inf') - float('inf') =", float("inf") - float("inf"))
print("2.0**-1074 =", 2.0**-1074, " 2.0**-1075 =", 2.0**-1075)
`;
const O_PY_IEEE = String.raw`
-6.25  : 1 10000001 10010000000000000000000
0.15625: 0 01111100 01000000000000000000000
Decimal(0.1) = 0.1000000000000000055511151231257827021181583404541015625
(0.1).hex()  = 0x1.999999999999ap-4
0.1 + 0.2    = 0.30000000000000004
math.isclose(0.1 + 0.2, 0.3) = True
math.ulp(1.0) = 2.220446049250313e-16  math.ulp(1e16) = 2.0
1e16 + 1 == 1e16 ? True
sum([0.1]*10) = 0.9999999999999999  math.fsum = 1.0
float('inf') - float('inf') = nan
2.0**-1074 = 5e-324  2.0**-1075 = 0.0
`;
const PY_PATRIOT = String.raw`
from fractions import Fraction as F
# Patriot: dong ho dem so "tich" 0,1 s; 0,1 duoc cat cut (chop) con 23 bit sau dau phay nhi phan
mot_phan_muoi = F(1, 10)
luu = F(int(mot_phan_muoi * 2**23), 2**23)       # cat bo phan sau bit thu 23
sai_moi_tich = mot_phan_muoi - luu
print("0,1 duoc luu thanh   :", float(luu))
print("sai so moi tich 0,1 s:", float(sai_moi_tich), "giay")
for gio in [1, 8, 20, 48, 72, 100]:
    tich = gio * 3600 * 10
    lech = float(sai_moi_tich * tich)
    print(f"chay {gio:>3} gio = {tich:>9,} tich -> dong ho lech {lech:.4f} s"
          f" -> Scud (~1676 m/s) di them {lech * 1676:6.0f} m")
`;
const O_PATRIOT = String.raw`
0,1 duoc luu thanh   : 0.09999990463256836
sai so moi tich 0,1 s: 9.5367431640625e-08 giay
chay   1 gio =    36,000 tich -> dong ho lech 0.0034 s -> Scud (~1676 m/s) di them      6 m
chay   8 gio =   288,000 tich -> dong ho lech 0.0275 s -> Scud (~1676 m/s) di them     46 m
chay  20 gio =   720,000 tich -> dong ho lech 0.0687 s -> Scud (~1676 m/s) di them    115 m
chay  48 gio = 1,728,000 tich -> dong ho lech 0.1648 s -> Scud (~1676 m/s) di them    276 m
chay  72 gio = 2,592,000 tich -> dong ho lech 0.2472 s -> Scud (~1676 m/s) di them    414 m
chay 100 gio = 3,600,000 tich -> dong ho lech 0.3433 s -> Scud (~1676 m/s) di them    575 m
`;
const C_ARIANE = String.raw`
#include <stdio.h>
#include <stdint.h>
#include <math.h>

/* Ariane 5: mot gia tri 64 bit dau phay dong (BH) bi doi sang so nguyen 16 bit co dau. */
int doiCoKiem(double x, int16_t *ra) {      /* cach AN TOAN: kiem pham vi truoc */
    if (isnan(x) || x > INT16_MAX || x < INT16_MIN) return 0;
    *ra = (int16_t)x;
    return 1;
}

int main(void) {
    double BH[] = { 1200.5, 32767.0, 32768.0, 40000.0 };
    for (int i = 0; i < 4; i++) {
        int16_t r;
        int32_t tam = (int32_t)BH[i];        /* buoc 1: double -> int32 (con vua) */
        int16_t cut = (int16_t)tam;           /* buoc 2: int32 -> int16: cat 16 bit cao */
        printf("BH = %8.1f -> cat thang = %6d | ", BH[i], cut);
        if (doiCoKiem(BH[i], &r)) printf("co kiem: %d\n", r);
        else                      printf("co kiem: NGOAI PHAM VI -> phai xu ly!\n");
    }
    return 0;
}
`;
const O_ARIANE = String.raw`
BH =   1200.5 -> cat thang =   1200 | co kiem: 1200
BH =  32767.0 -> cat thang =  32767 | co kiem: 32767
BH =  32768.0 -> cat thang = -32768 | co kiem: NGOAI PHAM VI -> phai xu ly!
BH =  40000.0 -> cat thang = -25536 | co kiem: NGOAI PHAM VI -> phai xu ly!
`;

/* ───────────── Mở đầu ───────────── */
const MO_DAU = bi(`<span class="eyebrow">⭐ Advanced · Lesson CS.3 · official deck CEA11 (Stallings Ch.11), slides 31–55 · added by this site</span>
<h2>Floating point and IEEE 754: how a computer stores 0.1, why 0.1 + 0.2 ≠ 0.3, and what infinity, NaN and subnormals are for</h2>
<p class="lead">Integers (lesson CS.2) are exact but cover a small range. Science, graphics, games, machine learning and every <code>double</code> in your code need numbers from 10<sup>−300</sup> to 10<sup>300</sup>. Floating point gets that range by storing a number like scientific notation — sign, exponent, significand — and pays for it with rounding. After this lesson you can encode and decode an IEEE 754 number by hand and explain, bit by bit, the classic floating-point surprises.</p>
<p class="nhan">Source: official Stallings slide set (COA 11e, Global Edition), Chapter 11 "Computer Arithmetic", slides 31–55 — deck CEA11 · in the course's slide set but NOT in the 60-session schedule</p>
<div class="note-ct">Added by CuongThai (not a school requirement). The two historical cases below are documented accidents; the numbers in the "run for real" section are recomputed by the programs on this page.</div>
<h3>Why it matters — two expensive lessons</h3>
<table>
<thead><tr><th>Case</th><th>The arithmetic</th><th>Consequence</th></tr></thead>
<tbody>
<tr><td><b>Patriot missile, Dhahran, 25 Feb 1991</b></td><td>The battery's clock counted tenths of a second and multiplied by 0.1 held in a 24-bit fixed-point register; 0.1 was chopped, losing about 9.5 × 10<sup>−8</sup> s per tick. After about 100 hours of operation the clock was off by about 0.34 s.</td><td>A Scud travels more than half a kilometre in 0.34 s, so the radar looked in the wrong place and the interception never happened; 28 US soldiers were killed (US GAO report IMTEC-92-26).</td></tr>
<tr><td><b>Ariane 5, flight 501, 4 Jun 1996</b></td><td>Software reused from Ariane 4 converted a 64-bit floating-point value (horizontal velocity bias) to a 16-bit signed integer. On the faster Ariane 5 the value no longer fitted; the conversion raised an operand error that was not handled.</td><td>Both inertial reference computers shut down about 37 s after lift-off; the rocket veered off course and was destroyed with its four Cluster science satellites.</td></tr>
</tbody>
</table>
<p>Both are reproduced below in a few lines of code — the Patriot drift exactly, and the Ariane conversion in C.</p>
<h3>Map of the slides</h3>
<table>
<thead><tr><th>Slides</th><th>Idea</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>31–35</td><td>Principles: sign, biased exponent, significand, normalisation, range and density</td><td>explain why floats are dense near 0 and sparse far away</td></tr>
<tr><td>36–41</td><td>IEEE 754: formats binary32/64/128 and their parameters</td><td>quote bias, exponent range and precision of float and double</td></tr>
<tr><td>42–44</td><td>Interpreting the bit patterns: zero, normal, subnormal, ∞, NaN</td><td>decode any 32-bit pattern by hand</td></tr>
<tr><td>45–49</td><td>Arithmetic: add/subtract, multiply, divide, guard bits</td><td>trace how hardware aligns, adds, normalises and rounds</td></tr>
<tr><td>50–55</td><td>Rounding, interval arithmetic, infinity, NaN, subnormals</td><td>predict what 1/0, 0/0, ∞ − ∞ and tiny numbers do</td></tr>
</tbody>
</table>
<div class="callout">Outputs below: Docker <code>node:22</code> (Debian 12, GCC 12.2.0, Python 3.11.2, aarch64). x86-64 gives the same bits; the only visible difference is that glibc on x86-64 may print a NaN as <code>-nan</code>, because the default NaN produced by x86 hardware has its sign bit set.</div>`,
`<span class="eyebrow">⭐ Chuyên sâu · Bài CS.3 · deck chính hãng CEA11 (Stallings Ch.11), slide 31–55 · web bổ sung</span>
<h2>Dấu phẩy động và IEEE 754: máy tính lưu 0,1 thế nào, vì sao 0,1 + 0,2 ≠ 0,3, và vô cùng, NaN, số dưới chuẩn để làm gì</h2>
<p class="lead">Số nguyên (bài CS.2) chính xác nhưng phủ một phạm vi nhỏ. Khoa học, đồ hoạ, game, học máy và mọi biến <code>double</code> trong code của bạn cần số từ 10<sup>−300</sup> tới 10<sup>300</sup>. Dấu phẩy động có được phạm vi đó nhờ lưu số giống ký pháp khoa học — dấu, số mũ, phần định trị — và trả giá bằng làm tròn. Học xong bài này bạn mã hoá và giải mã được một số IEEE 754 bằng tay và giải thích, tới từng bit, những bất ngờ kinh điển của số thực.</p>
<p class="nhan">Nguồn: bộ slide chính hãng Stallings (COA 11e, Global Edition), Chapter 11 "Computer Arithmetic", slide 31–55 — deck CEA11 · có trong bộ slide của môn nhưng KHÔNG nằm trong lịch 60 buổi</p>
<div class="note-ct">CuongThai bổ sung (không phải quy định của trường). Hai vụ lịch sử dưới đây là tai nạn có hồ sơ; các con số ở phần "chạy thật" được chính chương trình trên trang này tính lại.</div>
<h3>Vì sao quan trọng — hai bài học đắt giá</h3>
<table>
<thead><tr><th>Vụ</th><th>Phép tính</th><th>Hậu quả</th></tr></thead>
<tbody>
<tr><td><b>Tên lửa Patriot, Dhahran, 25/02/1991</b></td><td>Đồng hồ của khẩu đội đếm theo phần mười giây rồi nhân với 0,1 lưu trong thanh ghi dấu phẩy tĩnh 24 bit; 0,1 bị cắt cụt, mất khoảng 9,5 × 10<sup>−8</sup> giây mỗi nhịp. Sau khoảng 100 giờ hoạt động, đồng hồ lệch khoảng 0,34 giây.</td><td>Trong 0,34 giây một tên lửa Scud bay được hơn nửa ki-lô-mét, nên radar nhìn nhầm chỗ và cú đánh chặn không xảy ra; 28 lính Mỹ thiệt mạng (báo cáo GAO IMTEC-92-26 của Mỹ).</td></tr>
<tr><td><b>Ariane 5, chuyến bay 501, 04/06/1996</b></td><td>Phần mềm dùng lại từ Ariane 4 đổi một giá trị dấu phẩy động 64 bit (độ lệch vận tốc ngang) sang số nguyên có dấu 16 bit. Trên Ariane 5 nhanh hơn, giá trị không còn vừa; phép đổi sinh lỗi toán hạng (operand error) mà không có chỗ nào xử lý.</td><td>Cả hai máy tính dẫn đường quán tính tắt khoảng 37 giây sau khi rời bệ; tên lửa đi chệch hướng và bị phá huỷ cùng bốn vệ tinh khoa học Cluster.</td></tr>
</tbody>
</table>
<p>Cả hai được tái hiện bên dưới bằng vài dòng code — độ trôi của Patriot chính xác tới từng số, và phép đổi của Ariane bằng C.</p>
<h3>Bản đồ slide</h3>
<table>
<thead><tr><th>Slide</th><th>Ý chính</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>31–35</td><td>Nguyên lý: dấu, số mũ lệch, phần định trị, chuẩn hoá, phạm vi và mật độ</td><td>giải thích vì sao số thực dày đặc gần 0 và thưa dần khi ra xa</td></tr>
<tr><td>36–41</td><td>IEEE 754: định dạng binary32/64/128 và tham số</td><td>nói được độ lệch, phạm vi số mũ và độ chính xác của float, double</td></tr>
<tr><td>42–44</td><td>Đọc mẫu bit: số 0, số chuẩn, số dưới chuẩn, ∞, NaN</td><td>giải mã bằng tay mọi mẫu 32 bit</td></tr>
<tr><td>45–49</td><td>Phép tính: cộng/trừ, nhân, chia, bit bảo vệ</td><td>lần theo cách phần cứng căn mũ, cộng, chuẩn hoá và làm tròn</td></tr>
<tr><td>50–55</td><td>Làm tròn, số học khoảng, vô cùng, NaN, số dưới chuẩn</td><td>đoán trước 1/0, 0/0, ∞ − ∞ và số cực nhỏ cho ra gì</td></tr>
</tbody>
</table>
<div class="callout">Output bên dưới: Docker <code>node:22</code> (Debian 12, GCC 12.2.0, Python 3.11.2, aarch64). x86-64 cho cùng các bit; khác biệt nhìn thấy duy nhất là glibc trên x86-64 có thể in NaN thành <code>-nan</code>, vì NaN mặc định do phần cứng x86 sinh ra có bit dấu bằng 1.</div>`);

/* ───────────── Giảng theo từng slide ───────────── */
const SLIDES = walk(D, [
  [31, 'Floating-Point Representation — Principles',
    `<p class="y-chinh">🎯 Fixed point (slide 10) represents a band of numbers centred near 0 with the radix point at an agreed place. Its limits: very large numbers and very small fractions cannot both be represented, and the fractional part of a quotient of two large numbers can be lost.</p>
<p>Example with 32-bit integers: the distance from the Earth to the Sun in millimetres (about 1.5 × 10<sup>14</sup>) does not fit; neither does the mass of an electron in kilograms (about 9.1 × 10<sup>−31</sup>) in any reasonable fixed-point scaling. Scientists solved this centuries ago with scientific notation: 1.5 × 10<sup>14</sup>, 9.1 × 10<sup>−31</sup> — a few significant digits and an exponent that says where the point goes.</p>
<p>Floating point is scientific notation in base 2: <strong>± significand × 2<sup>exponent</sup></strong>. The point "floats" because its position is stored in the number itself.</p>
<p class="meo">💡 The trade you are making: with the same 32 bits, integers give you about 4.3 × 10<sup>9</sup> evenly spaced values; floats give you about the same number of values, spread from 10<sup>−38</sup> to 10<sup>38</sup>. Range is bought with gaps.</p>`,
    `<p class="y-chinh">🎯 Dấu phẩy tĩnh (slide 10) biểu diễn một dải số quanh 0 với dấu phẩy ở chỗ đã thoả thuận. Giới hạn của nó: không thể vừa biểu diễn số rất lớn vừa biểu diễn phần lẻ rất nhỏ, và phần lẻ của thương hai số lớn có thể bị mất.</p>
<p>Ví dụ với số nguyên 32 bit: khoảng cách Trái Đất – Mặt Trời tính bằng mi-li-mét (khoảng 1,5 × 10<sup>14</sup>) không vừa; khối lượng electron tính bằng ki-lô-gam (khoảng 9,1 × 10<sup>−31</sup>) cũng không vừa với bất kỳ cách co giãn dấu phẩy tĩnh hợp lý nào. Các nhà khoa học đã giải bài này từ nhiều thế kỷ trước bằng ký pháp khoa học: 1,5 × 10<sup>14</sup>, 9,1 × 10<sup>−31</sup> — vài chữ số có nghĩa và một số mũ cho biết dấu phẩy nằm đâu.</p>
<p>Dấu phẩy động là ký pháp khoa học ở cơ số 2: <strong>± phần định trị × 2<sup>số mũ</sup></strong>. Dấu phẩy "trôi" (floating) vì vị trí của nó được lưu ngay trong con số.</p>
<p class="meo">💡 Cái bạn đánh đổi: cùng 32 bit, số nguyên cho khoảng 4,3 × 10<sup>9</sup> giá trị cách đều; số thực cho khoảng chừng ấy giá trị, trải từ 10<sup>−38</sup> tới 10<sup>38</sup>. Phạm vi được mua bằng các khoảng trống.</p>`],

  [32, 'Figure 11.18 Typical 32-Bit Floating-Point Format',
    `<p class="y-chinh">🎯 (a) Three fields: <strong>1 sign bit</strong> | <strong>8-bit biased exponent</strong> | <strong>23-bit significand</strong>. (b) Four examples: ±1.1010001 × 2<sup>±10100</sup>.</p>
<table>
<thead><tr><th>number</th><th>sign</th><th>biased exponent</th><th>significand field</th><th>value</th></tr></thead>
<tbody>
<tr><td>1.1010001 × 2<sup>10100</sup></td><td>0</td><td>1001 0011</td><td>1010 0010 0000…</td><td>1.6328125 × 2<sup>20</sup></td></tr>
<tr><td>−1.1010001 × 2<sup>10100</sup></td><td>1</td><td>1001 0011</td><td>1010 0010 0000…</td><td>−1.6328125 × 2<sup>20</sup></td></tr>
<tr><td>1.1010001 × 2<sup>−10100</sup></td><td>0</td><td>0110 1011</td><td>1010 0010 0000…</td><td>1.6328125 × 2<sup>−20</sup></td></tr>
<tr><td>−1.1010001 × 2<sup>−10100</sup></td><td>1</td><td>0110 1011</td><td>1010 0010 0000…</td><td>−1.6328125 × 2<sup>−20</sup></td></tr>
</tbody>
</table>
<p>Read it slowly: 10100<sub>2</sub> = 20. The stored exponent is 20 + 127 = 147 = 1001 0011, or −20 + 127 = 107 = 0110 1011 — the <strong>bias</strong> idea of slide 7, so the exponent field is always a non-negative number. The leading "1." of the significand is <strong>not stored</strong> (it is always 1 after normalisation — slide 33), so the field holds only 1010001 followed by zeros. 1.1010001<sub>2</sub> = 1 + 0.5 + 0.125 + 0.0078125 = 1.6328125.</p>
<p class="meo">💡 Sign | exponent | fraction — the order is chosen so that, for positive numbers, comparing the bit patterns as unsigned integers gives the same order as comparing the values. That is why sorting floats by their bits works (with care for negatives).</p>`,
    `<p class="y-chinh">🎯 (a) Ba trường: <strong>1 bit dấu</strong> | <strong>8 bit số mũ lệch</strong> | <strong>23 bit phần định trị</strong>. (b) Bốn ví dụ: ±1,1010001 × 2<sup>±10100</sup>.</p>
<table>
<thead><tr><th>số</th><th>dấu</th><th>số mũ lệch</th><th>trường định trị</th><th>giá trị</th></tr></thead>
<tbody>
<tr><td>1,1010001 × 2<sup>10100</sup></td><td>0</td><td>1001 0011</td><td>1010 0010 0000…</td><td>1,6328125 × 2<sup>20</sup></td></tr>
<tr><td>−1,1010001 × 2<sup>10100</sup></td><td>1</td><td>1001 0011</td><td>1010 0010 0000…</td><td>−1,6328125 × 2<sup>20</sup></td></tr>
<tr><td>1,1010001 × 2<sup>−10100</sup></td><td>0</td><td>0110 1011</td><td>1010 0010 0000…</td><td>1,6328125 × 2<sup>−20</sup></td></tr>
<tr><td>−1,1010001 × 2<sup>−10100</sup></td><td>1</td><td>0110 1011</td><td>1010 0010 0000…</td><td>−1,6328125 × 2<sup>−20</sup></td></tr>
</tbody>
</table>
<p>Đọc chậm: 10100<sub>2</sub> = 20. Số mũ lưu là 20 + 127 = 147 = 1001 0011, hoặc −20 + 127 = 107 = 0110 1011 — đúng ý tưởng <strong>số lệch</strong> (bias) của slide 7, nên trường số mũ luôn là số không âm. Chữ "1," đứng đầu phần định trị <strong>không được lưu</strong> (sau chuẩn hoá nó luôn là 1 — slide 33), nên trường chỉ chứa 1010001 rồi toàn số 0. 1,1010001<sub>2</sub> = 1 + 0,5 + 0,125 + 0,0078125 = 1,6328125.</p>
<p class="meo">💡 Dấu | số mũ | phần lẻ — thứ tự được chọn sao cho với số dương, so mẫu bit như số nguyên không dấu cho cùng thứ tự như so giá trị. Vì thế sắp xếp số thực theo bit vẫn đúng (cẩn thận với số âm).</p>`],

  [33, 'Floating-Point Significand — normalisation',
    `<p class="y-chinh">🎯 The same number can be written many ways: 0.110 × 2<sup>5</sup> = 110 × 2<sup>2</sup> = 0.0110 × 2<sup>6</sup> (all equal 24). To make the representation unique, use a <strong>normal number</strong>: the most significant digit of the significand is non-zero.</p>
<p>Check the slide's example: 0.110<sub>2</sub> = 0.75 and 0.75 × 32 = 24; 110<sub>2</sub> × 4 = 6 × 4 = 24; 0.0110<sub>2</sub> = 0.375 and 0.375 × 64 = 24. Three spellings, one value — wasteful, because several bit patterns would mean the same number.</p>
<p>In binary the only non-zero digit is 1, so a normalised significand <em>always</em> starts with 1. IEEE 754 writes it as <strong>1.fff… × 2<sup>E</sup></strong> and does not store the 1 — the <strong>hidden bit</strong>. 23 stored fraction bits therefore give 24 bits of precision for free.</p>
<p class="meo">💡 Normalising is "move the point until exactly one 1 is in front of it, and count the moves into the exponent": 110.01 → 1.1001 × 2<sup>2</sup>; 0.00101 → 1.01 × 2<sup>−3</sup>.</p>`,
    `<p class="y-chinh">🎯 Cùng một số viết được nhiều cách: 0,110 × 2<sup>5</sup> = 110 × 2<sup>2</sup> = 0,0110 × 2<sup>6</sup> (đều bằng 24). Để cách viết là duy nhất, dùng <strong>số chuẩn</strong> (normal number): chữ số có nghĩa lớn nhất của phần định trị khác 0.</p>
<p>Kiểm ví dụ của slide: 0,110<sub>2</sub> = 0,75 và 0,75 × 32 = 24; 110<sub>2</sub> × 4 = 6 × 4 = 24; 0,0110<sub>2</sub> = 0,375 và 0,375 × 64 = 24. Ba cách viết, một giá trị — lãng phí, vì nhiều mẫu bit cùng nghĩa một số.</p>
<p>Ở nhị phân chữ số khác 0 duy nhất là 1, nên phần định trị đã chuẩn hoá <em>luôn</em> bắt đầu bằng 1. IEEE 754 viết nó thành <strong>1,fff… × 2<sup>E</sup></strong> và không lưu số 1 — gọi là <strong>bit ẩn</strong> (hidden bit). 23 bit phần lẻ được lưu vì thế cho 24 bit độ chính xác miễn phí.</p>
<p class="meo">💡 Chuẩn hoá là "dời dấu phẩy tới khi đúng một chữ số 1 đứng trước nó, và đếm số lần dời vào số mũ": 110,01 → 1,1001 × 2<sup>2</sup>; 0,00101 → 1,01 × 2<sup>−3</sup>.</p>`],

  [34, 'Figure 11.19 Expressible Numbers in Typical 32-Bit Formats',
    `<p class="y-chinh">🎯 (a) 32-bit two's complement integers cover −2<sup>31</sup> … 2<sup>31</sup> − 1, every integer in between. (b) The typical 32-bit float covers −(2 − 2<sup>−23</sup>) × 2<sup>128</sup> … −2<sup>−127</sup>, zero, and 2<sup>−127</sup> … (2 − 2<sup>−23</sup>) × 2<sup>128</sup>.</p>
<p>The float number line has five forbidden zones: <strong>negative overflow</strong> and <strong>positive overflow</strong> (too large in magnitude), <strong>negative underflow</strong> and <strong>positive underflow</strong> (too close to zero but not zero), and between them the single point zero. Overflow is a hard error in many systems; underflow is usually rounded to 0 — and slide 54 shows how IEEE softens it with subnormals.</p>
<p>Note this figure uses the book's <em>typical</em> format (exponent −127 … 128, no codes reserved). Real IEEE binary32 reserves the all-0 and all-1 exponents (slide 42), so its normal range is 2<sup>−126</sup> … (2 − 2<sup>−23</sup>) × 2<sup>127</sup> ≈ 3.4 × 10<sup>38</sup> — the <code>FLT_MAX</code> printed by the C program below.</p>
<p class="meo">💡 Both formats have the same 2<sup>32</sup> bit patterns. Floats do not represent more numbers than integers — they represent <em>different</em> ones, spread over a far wider range.</p>`,
    `<p class="y-chinh">🎯 (a) Số nguyên bù hai 32 bit phủ −2<sup>31</sup> … 2<sup>31</sup> − 1, mọi số nguyên ở giữa. (b) Số thực 32 bit kiểu điển hình phủ −(2 − 2<sup>−23</sup>) × 2<sup>128</sup> … −2<sup>−127</sup>, số 0, và 2<sup>−127</sup> … (2 − 2<sup>−23</sup>) × 2<sup>128</sup>.</p>
<p>Trục số của số thực có năm vùng cấm: <strong>tràn trên âm</strong> và <strong>tràn trên dương</strong> (overflow — độ lớn quá lớn), <strong>tràn dưới âm</strong> và <strong>tràn dưới dương</strong> (underflow — quá gần 0 nhưng chưa bằng 0), và giữa chúng là điểm duy nhất số 0. Tràn trên là lỗi cứng ở nhiều hệ thống; tràn dưới thường được làm tròn về 0 — slide 54 cho thấy IEEE làm mềm nó bằng số dưới chuẩn.</p>
<p>Lưu ý hình này dùng định dạng <em>điển hình</em> của sách (số mũ −127 … 128, không dành riêng mã nào). binary32 thật của IEEE dành riêng số mũ toàn 0 và toàn 1 (slide 42), nên phạm vi số chuẩn là 2<sup>−126</sup> … (2 − 2<sup>−23</sup>) × 2<sup>127</sup> ≈ 3,4 × 10<sup>38</sup> — đúng <code>FLT_MAX</code> mà chương trình C bên dưới in ra.</p>
<p class="meo">💡 Cả hai định dạng có cùng 2<sup>32</sup> mẫu bit. Số thực không biểu diễn được nhiều số hơn số nguyên — nó biểu diễn những số <em>khác</em>, trải trên phạm vi rộng hơn rất nhiều.</p>`],

  [35, 'Figure 11.20 Density of Floating-Point Numbers',
    `<p class="y-chinh">🎯 Representable floats are not evenly spaced. Between n and 2n there are as many as between 2n and 4n, so each time the magnitude doubles, the <strong>gap between neighbours doubles</strong>. Dense near 0, sparse far away.</p>
<p>Why: inside one exponent value, the 2<sup>23</sup> fraction patterns are evenly spaced across [2<sup>E</sup>, 2<sup>E+1</sup>). The next exponent covers an interval twice as wide with the same 2<sup>23</sup> patterns. So the spacing is 2<sup>E − 23</sup>: at 1.0 it is 2<sup>−23</sup> ≈ 1.19 × 10<sup>−7</sup> (that is <code>FLT_EPSILON</code>), at 2<sup>24</sup> = 16 777 216 it is 2.</p>
<p>Consequence you can see in the C run: <code>16777216.0f + 1.0f</code> prints 16777216.0. The exact answer 16 777 217 lies halfway between two floats and rounds back. Every integer above 2<sup>24</sup> is not representable in <code>float</code>; for <code>double</code> the limit is 2<sup>53</sup> (Python shows <code>1e16 + 1 == 1e16</code> is True).</p>
<p class="meo">💡 The <em>relative</em> precision is what stays constant: about 7 significant decimal digits for float, 15–16 for double, at any magnitude.</p>`,
    `<p class="y-chinh">🎯 Các số thực biểu diễn được không cách đều. Giữa n và 2n có bao nhiêu số thì giữa 2n và 4n cũng bấy nhiêu, nên mỗi lần độ lớn gấp đôi, <strong>khoảng cách giữa hai số kề nhau gấp đôi</strong>. Dày gần 0, thưa khi ra xa.</p>
<p>Vì sao: trong một giá trị số mũ, 2<sup>23</sup> mẫu phần lẻ cách đều nhau trên [2<sup>E</sup>, 2<sup>E+1</sup>). Số mũ kế tiếp phủ một đoạn rộng gấp đôi với cùng 2<sup>23</sup> mẫu. Nên khoảng cách là 2<sup>E − 23</sup>: ở 1,0 nó là 2<sup>−23</sup> ≈ 1,19 × 10<sup>−7</sup> (chính là <code>FLT_EPSILON</code>), ở 2<sup>24</sup> = 16 777 216 nó là 2.</p>
<p>Hệ quả thấy được trong lần chạy C: <code>16777216.0f + 1.0f</code> in ra 16777216.0. Đáp án đúng 16 777 217 nằm giữa hai số float và bị làm tròn về. Mọi số nguyên trên 2<sup>24</sup> không còn biểu diễn hết được bằng <code>float</code>; với <code>double</code> giới hạn là 2<sup>53</sup> (Python cho thấy <code>1e16 + 1 == 1e16</code> là True).</p>
<p class="meo">💡 Thứ giữ nguyên là độ chính xác <em>tương đối</em>: khoảng 7 chữ số thập phân có nghĩa với float, 15–16 với double, ở mọi độ lớn.</p>`],

  [36, 'IEEE Standard 754',
    `<p class="y-chinh">🎯 Four facts on the slide: IEEE 754 defines the most important floating-point representation; it was developed to make numerical programs <strong>portable</strong> between processors; it is used on virtually all contemporary processors and coprocessors; the 2008 revision covers both <strong>binary</strong> and <strong>decimal</strong> floating point.</p>
<p>Before the standard (first published in 1985, led by William Kahan, who received the Turing Award for it), every manufacturer had its own format with its own rounding — the same program gave different answers on IBM, DEC and Cray machines. IEEE 754 fixed not only the bit layout but the <em>results</em>: an operation must return the correctly rounded value of the exact result. That guarantee is why <code>0.1 + 0.2</code> prints 0.30000000000000004 on every machine and in every mainstream language — the same wrong-looking answer everywhere.</p>
<p class="meo">💡 C <code>float</code>/<code>double</code>, Java <code>float</code>/<code>double</code>, JavaScript <code>Number</code>, Python <code>float</code> are all IEEE binary32/binary64. Learn the format once, debug it in every language.</p>`,
    `<p class="y-chinh">🎯 Bốn ý trên slide: IEEE 754 định nghĩa cách biểu diễn dấu phẩy động quan trọng nhất; nó được lập ra để chương trình tính toán <strong>mang được</strong> (portable) từ bộ xử lý này sang bộ xử lý khác; nó được dùng trên gần như mọi bộ xử lý và bộ đồng xử lý hiện nay; bản sửa đổi 2008 phủ cả dấu phẩy động <strong>nhị phân</strong> lẫn <strong>thập phân</strong>.</p>
<p>Trước chuẩn này (bản đầu năm 1985, do William Kahan dẫn dắt — ông nhận giải Turing vì nó), mỗi hãng có một định dạng riêng với cách làm tròn riêng — cùng một chương trình cho kết quả khác nhau trên máy IBM, DEC và Cray. IEEE 754 cố định không chỉ cách xếp bit mà cả <em>kết quả</em>: một phép tính phải trả về giá trị làm tròn đúng của kết quả chính xác. Bảo đảm đó là lý do <code>0.1 + 0.2</code> in ra 0.30000000000000004 trên mọi máy và mọi ngôn ngữ phổ biến — cùng một đáp án trông sai ở khắp nơi.</p>
<p class="meo">💡 <code>float</code>/<code>double</code> của C, <code>float</code>/<code>double</code> của Java, <code>Number</code> của JavaScript, <code>float</code> của Python đều là binary32/binary64 của IEEE. Học định dạng một lần, gỡ lỗi được ở mọi ngôn ngữ.</p>`],

  [37, 'IEEE 754-2008 — three kinds of format',
    `<p class="y-chinh">🎯 The standard classifies formats by what they are for: <strong>arithmetic format</strong> (all mandatory operations supported — usable for computing), <strong>basic format</strong> (five specific encodings — three binary, two decimal — every conforming system implements at least one), <strong>interchange format</strong> (a fully specified fixed-length encoding for storing and exchanging data between platforms).</p>
<p>In practice: binary32 and binary64 are all three at once — you compute with them, they are basic formats, and you can write them to a file and read them on another machine. binary16 (half precision) started life as interchange-only (slide 41): a compact way to store data, converted to a wider format for computing. Today GPUs compute directly in 16-bit formats (and bfloat16, which is not an IEEE format) for machine learning — see Math for ML 11.1.</p>`,
    `<p class="y-chinh">🎯 Chuẩn phân loại định dạng theo mục đích: <strong>định dạng tính toán</strong> (arithmetic — hỗ trợ mọi phép bắt buộc, dùng để tính), <strong>định dạng cơ bản</strong> (basic — năm cách mã hoá cụ thể, ba nhị phân và hai thập phân, hệ thống tuân chuẩn nào cũng hiện thực ít nhất một), <strong>định dạng trao đổi</strong> (interchange — cách mã hoá độ dài cố định, quy định đầy đủ, để lưu và trao đổi dữ liệu giữa các nền tảng).</p>
<p>Thực tế: binary32 và binary64 thuộc cả ba loại — bạn tính bằng chúng, chúng là định dạng cơ bản, và bạn ghi chúng ra tệp rồi đọc trên máy khác được. binary16 (nửa độ chính xác) ban đầu chỉ là định dạng trao đổi (slide 41): cách lưu dữ liệu gọn, đổi sang định dạng rộng hơn khi tính. Ngày nay GPU tính thẳng bằng định dạng 16 bit (và bfloat16, vốn không phải định dạng IEEE) cho học máy — xem Math for ML 11.1.</p>`],

  [38, 'Figure 11.21 IEEE 754 Formats',
    `<p class="y-chinh">🎯 The three binary formats side by side: binary32 = 1 + 8 + 23 bits, binary64 = 1 + 11 + 52, binary128 = 1 + 15 + 112. The field that grows fastest is the trailing significand — precision — while the exponent grows slowly — range.</p>
<table>
<thead><tr><th>format</th><th>C type</th><th>sign</th><th>exponent</th><th>trailing significand</th><th>precision (with hidden bit)</th></tr></thead>
<tbody>
<tr><td>binary32</td><td><code>float</code></td><td>1</td><td>8</td><td>23</td><td>24 bits ≈ 7.2 decimal digits</td></tr>
<tr><td>binary64</td><td><code>double</code></td><td>1</td><td>11</td><td>52</td><td>53 bits ≈ 15.9 decimal digits</td></tr>
<tr><td>binary128</td><td>(<code>__float128</code> / some <code>long double</code>)</td><td>1</td><td>15</td><td>112</td><td>113 bits ≈ 34 decimal digits</td></tr>
</tbody>
</table>
<p>"Trailing significand field" is the standard's exact name for the stored fraction bits — "trailing" because the leading hidden 1 is not in the field.</p>
<p class="meo">💡 Digits ≈ bits × log<sub>10</sub>2 ≈ bits × 0.301. 24 × 0.301 ≈ 7.2; 53 × 0.301 ≈ 15.95. That is why printing a float with more than ~7 significant digits shows "noise" (0.10000000149… in the run below).</p>`,
    `<p class="y-chinh">🎯 Ba định dạng nhị phân đặt cạnh nhau: binary32 = 1 + 8 + 23 bit, binary64 = 1 + 11 + 52, binary128 = 1 + 15 + 112. Trường lớn nhanh nhất là phần định trị — độ chính xác — còn số mũ lớn chậm — phạm vi.</p>
<table>
<thead><tr><th>định dạng</th><th>kiểu C</th><th>dấu</th><th>số mũ</th><th>phần định trị lưu</th><th>độ chính xác (kể bit ẩn)</th></tr></thead>
<tbody>
<tr><td>binary32</td><td><code>float</code></td><td>1</td><td>8</td><td>23</td><td>24 bit ≈ 7,2 chữ số thập phân</td></tr>
<tr><td>binary64</td><td><code>double</code></td><td>1</td><td>11</td><td>52</td><td>53 bit ≈ 15,9 chữ số thập phân</td></tr>
<tr><td>binary128</td><td>(<code>__float128</code> / một số <code>long double</code>)</td><td>1</td><td>15</td><td>112</td><td>113 bit ≈ 34 chữ số thập phân</td></tr>
</tbody>
</table>
<p>"Trailing significand field" là tên chính xác chuẩn đặt cho các bit phần lẻ được lưu — "trailing" (đuôi) vì bit 1 ẩn đứng đầu không nằm trong trường.</p>
<p class="meo">💡 Số chữ số ≈ số bit × log<sub>10</sub>2 ≈ số bit × 0,301. 24 × 0,301 ≈ 7,2; 53 × 0,301 ≈ 15,95. Vì thế in một float với hơn ~7 chữ số có nghĩa sẽ thấy "nhiễu" (0.10000000149… trong lần chạy bên dưới).</p>`],

  [39, 'Table 11.3 IEEE 754 Format Parameters',
    `<p class="y-chinh">🎯 The numbers you are expected to know for binary32 and binary64: bias 127 / 1023, exponent range −126 … 127 / −1022 … 1023, normal range about 10<sup>±38</sup> / 10<sup>±308</sup>, smallest normal 2<sup>−126</sup> / 2<sup>−1022</sup>, smallest subnormal 2<sup>−149</sup> / 2<sup>−1074</sup>.</p>
<p>Where each row comes from (binary32): 8 exponent bits give 256 codes; all-0 and all-1 are reserved, leaving <strong>254 exponents</strong>. Bias = 2<sup>8−1</sup> − 1 = 127, so codes 1 … 254 mean −126 … 127. Largest normal = (2 − 2<sup>−23</sup>) × 2<sup>127</sup> = 2<sup>128</sup> − 2<sup>104</sup>. Smallest subnormal = 2<sup>−126</sup> × 2<sup>−23</sup> = 2<sup>−149</sup> ≈ 1.4 × 10<sup>−45</sup> (the "min sub" line of the C run, bit pattern 0x00000001). Number of values ≈ 2 × 254 × 2<sup>23</sup> ≈ 1.98 × 2<sup>31</sup>.</p>
<div class="pitfall co-tieu-de"><strong>Typo on the slide.</strong> For binary128 the "smallest positive normal number" is printed as 2<sup>−16362</sup>. It must be <strong>2<sup>−16382</sup></strong> — the table's own "minimum exponent" row says −16382, and 2<sup>1 − bias</sup> = 2<sup>1 − 16383</sup>.</div>
<p class="meo">💡 You do not need to memorise binary128. For the exam, derive binary32 from three facts: 8 exponent bits, 23 fraction bits, bias 2<sup>k−1</sup> − 1.</p>`,
    `<p class="y-chinh">🎯 Những con số cần biết cho binary32 và binary64: độ lệch 127 / 1023, phạm vi số mũ −126 … 127 / −1022 … 1023, phạm vi số chuẩn khoảng 10<sup>±38</sup> / 10<sup>±308</sup>, số chuẩn nhỏ nhất 2<sup>−126</sup> / 2<sup>−1022</sup>, số dưới chuẩn nhỏ nhất 2<sup>−149</sup> / 2<sup>−1074</sup>.</p>
<p>Từng dòng đến từ đâu (binary32): 8 bit số mũ cho 256 mã; toàn 0 và toàn 1 bị dành riêng, còn <strong>254 số mũ</strong>. Độ lệch = 2<sup>8−1</sup> − 1 = 127, nên mã 1 … 254 nghĩa là −126 … 127. Số chuẩn lớn nhất = (2 − 2<sup>−23</sup>) × 2<sup>127</sup> = 2<sup>128</sup> − 2<sup>104</sup>. Số dưới chuẩn nhỏ nhất = 2<sup>−126</sup> × 2<sup>−23</sup> = 2<sup>−149</sup> ≈ 1,4 × 10<sup>−45</sup> (dòng "min sub" của lần chạy C, mẫu bit 0x00000001). Số giá trị ≈ 2 × 254 × 2<sup>23</sup> ≈ 1,98 × 2<sup>31</sup>.</p>
<div class="pitfall co-tieu-de"><strong>Slide gõ sai.</strong> Với binary128, "smallest positive normal number" in là 2<sup>−16362</sup>. Đúng phải là <strong>2<sup>−16382</sup></strong> — chính dòng "minimum exponent" của bảng ghi −16382, và 2<sup>1 − độ lệch</sup> = 2<sup>1 − 16383</sup>.</div>
<p class="meo">💡 Không cần thuộc binary128. Đi thi, hãy suy binary32 từ ba điều: 8 bit số mũ, 23 bit phần lẻ, độ lệch 2<sup>k−1</sup> − 1.</p>`],

  [40, 'Additional Formats — extended and extendable precision',
    `<p class="y-chinh">🎯 <strong>Extended precision</strong> formats add bits to both exponent and significand, to be used for intermediate results: less round-off contamination, less risk that an intermediate value overflows when the final result would have fit, at less cost than switching everything to a larger format. <strong>Extendable precision</strong>: precision and range chosen by the user.</p>
<p>The famous example is the Intel x87 80-bit format (1 + 15 + 64, with an explicit leading bit), used by <code>long double</code> on x86 Linux. That is also why <code>long double</code> is not portable: 80-bit on x86-64 Linux, 128-bit quad on ARM64 Linux, and identical to <code>double</code> in Microsoft's compiler. If you need reproducible results across machines, stay with <code>double</code>.</p>
<p class="meo">💡 The idea survives everywhere in a different form: compute in higher precision, store in lower. Machine learning trains in float32 "master weights" while doing most multiplications in 16-bit.</p>`,
    `<p class="y-chinh">🎯 Định dạng <strong>độ chính xác mở rộng</strong> (extended precision) thêm bit cho cả số mũ lẫn phần định trị, dùng cho kết quả trung gian: ít bị nhiễm sai số làm tròn, ít nguy cơ một giá trị trung gian tràn trong khi kết quả cuối lẽ ra vẫn vừa, mà rẻ hơn chuyển mọi thứ sang định dạng lớn hơn. <strong>Độ chính xác co giãn được</strong> (extendable): độ chính xác và phạm vi do người dùng chọn.</p>
<p>Ví dụ nổi tiếng là định dạng 80 bit của Intel x87 (1 + 15 + 64, bit dẫn đầu được lưu rõ), mà <code>long double</code> dùng trên Linux x86. Đó cũng là lý do <code>long double</code> không mang đi được: 80 bit trên Linux x86-64, 128 bit trên Linux ARM64, và giống hệt <code>double</code> trong trình biên dịch của Microsoft. Cần kết quả tái lập được giữa các máy thì giữ <code>double</code>.</p>
<p class="meo">💡 Ý tưởng này sống khắp nơi dưới dạng khác: tính ở độ chính xác cao, lưu ở độ chính xác thấp. Học máy huấn luyện với "trọng số gốc" float32 trong khi phần lớn phép nhân làm ở 16 bit.</p>`],

  [41, 'Table 11.4 IEEE Formats',
    `<p class="y-chinh">🎯 Which format belongs to which category: binary32, binary64, binary128, decimal64 and decimal128 are arithmetic + basic + interchange; binary16 is <strong>interchange only</strong>; binary{k} and decimal{k} (k a multiple of 32, larger than 128) are arithmetic + interchange; extended and extendable precision are arithmetic only.</p>
<p>The decimal formats deserve a sentence: they store decimal digits, so 0.1 is exact. They exist for finance and commerce, where "0.1 + 0.2 must equal 0.3". Most CPUs have no decimal hardware (IBM POWER and z mainframes do), so languages emulate them in software — Java <code>BigDecimal</code>, Python <code>decimal</code>, SQL <code>DECIMAL/NUMERIC</code>. That is why money belongs in those types, never in <code>double</code>.</p>`,
    `<p class="y-chinh">🎯 Định dạng nào thuộc loại nào: binary32, binary64, binary128, decimal64 và decimal128 là tính toán + cơ bản + trao đổi; binary16 <strong>chỉ là trao đổi</strong>; binary{k} và decimal{k} (k là bội của 32, lớn hơn 128) là tính toán + trao đổi; độ chính xác mở rộng và co giãn chỉ là tính toán.</p>
<p>Các định dạng thập phân đáng một câu: chúng lưu chữ số thập phân, nên 0,1 là chính xác. Chúng tồn tại cho tài chính và thương mại, nơi "0,1 + 0,2 phải bằng 0,3". Đa số CPU không có phần cứng thập phân (IBM POWER và máy chủ z thì có), nên các ngôn ngữ giả lập bằng phần mềm — <code>BigDecimal</code> của Java, <code>decimal</code> của Python, <code>DECIMAL/NUMERIC</code> của SQL. Vì thế tiền phải nằm trong các kiểu đó, không bao giờ trong <code>double</code>.</p>`],

  [42, 'Table 11.5 Interpretation of IEEE 754 Numbers (1 of 3) — binary32',
    `<p class="y-chinh">🎯 The decoding table — read the biased exponent e first, then the fraction f.</p>
<table>
<thead><tr><th>e (8 bits)</th><th>f</th><th>meaning</th><th>value</th></tr></thead>
<tbody>
<tr><td>0</td><td>0</td><td>±0</td><td>±0</td></tr>
<tr><td>0</td><td>≠ 0</td><td>subnormal</td><td>±2<sup>−126</sup> × 0.f</td></tr>
<tr><td>1 … 254</td><td>any</td><td>normal</td><td>±2<sup>e−127</sup> × 1.f</td></tr>
<tr><td>255 (all 1s)</td><td>0</td><td>±∞</td><td>±∞</td></tr>
<tr><td>255 (all 1s)</td><td>≠ 0, first bit 1</td><td>quiet NaN</td><td>—</td></tr>
<tr><td>255 (all 1s)</td><td>≠ 0, first bit 0</td><td>signaling NaN</td><td>—</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Typo on the slide.</strong> The two "normal nonzero" rows say <strong>0 &lt; e &lt; 225</strong>. It must be <strong>0 &lt; e &lt; 255</strong> — e is an 8-bit field, and only 0 and 255 are reserved.</div>
<p>The C program's first block is this table in action: −6.25 has e = 129 (normal, 2<sup>2</sup>); −0.0 has e = 0, f = 0; INF has e = 255, f = 0; the NaN produced by the <code>NAN</code> macro is 0x7FC00000 — e = 255 and the first fraction bit 1, a quiet NaN; 0x00000001 has e = 0, f ≠ 0, the smallest subnormal.</p>
<p class="meo">💡 Decode recipe for a hex pattern: write the 32 bits, split 1 | 8 | 23, look up e in this table, then value = (−1)<sup>s</sup> × 1.f × 2<sup>e − 127</sup>.</p>`,
    `<p class="y-chinh">🎯 Bảng giải mã — đọc số mũ lệch e trước, rồi tới phần lẻ f.</p>
<table>
<thead><tr><th>e (8 bit)</th><th>f</th><th>nghĩa</th><th>giá trị</th></tr></thead>
<tbody>
<tr><td>0</td><td>0</td><td>±0</td><td>±0</td></tr>
<tr><td>0</td><td>≠ 0</td><td>số dưới chuẩn</td><td>±2<sup>−126</sup> × 0,f</td></tr>
<tr><td>1 … 254</td><td>bất kỳ</td><td>số chuẩn</td><td>±2<sup>e−127</sup> × 1,f</td></tr>
<tr><td>255 (toàn 1)</td><td>0</td><td>±∞</td><td>±∞</td></tr>
<tr><td>255 (toàn 1)</td><td>≠ 0, bit đầu 1</td><td>NaN lặng (quiet)</td><td>—</td></tr>
<tr><td>255 (toàn 1)</td><td>≠ 0, bit đầu 0</td><td>NaN báo hiệu (signaling)</td><td>—</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Slide gõ sai.</strong> Hai dòng "normal nonzero" ghi <strong>0 &lt; e &lt; 225</strong>. Đúng phải là <strong>0 &lt; e &lt; 255</strong> — e là trường 8 bit, và chỉ 0 với 255 bị dành riêng.</div>
<p>Khối đầu của chương trình C chính là bảng này đang chạy: −6,25 có e = 129 (số chuẩn, 2<sup>2</sup>); −0,0 có e = 0, f = 0; INF có e = 255, f = 0; NaN do macro <code>NAN</code> sinh ra là 0x7FC00000 — e = 255 và bit phần lẻ đầu bằng 1, một NaN lặng; 0x00000001 có e = 0, f ≠ 0, số dưới chuẩn nhỏ nhất.</p>
<p class="meo">💡 Công thức giải mã một mẫu hex: viết 32 bit, tách 1 | 8 | 23, tra e trong bảng này, rồi giá trị = (−1)<sup>s</sup> × 1,f × 2<sup>e − 127</sup>.</p>`],

  [43, 'Table 11.5 Interpretation of IEEE 754 Numbers (2 of 3) — binary64',
    `<p class="y-chinh">🎯 Exactly the same structure with 11 exponent bits: normal 0 &lt; e &lt; 2047, value ±2<sup>e−1023</sup> × 1.f; subnormal e = 0, value ±2<sup>−1022</sup> × 0.f; e = 2047 (all 1s) for ∞ and NaN.</p>
<p>The slide writes the subnormal value as 2<sup>e−1022</sup>(0.f); since e = 0 for subnormals, that is 2<sup>−1022</sup>(0.f) — the same exponent as the smallest normal number, which is what makes the transition smooth (slide 54).</p>
<p>Python's <code>(0.1).hex()</code> in the run below prints <code>0x1.999999999999ap-4</code>: hidden 1, then 52 fraction bits written as 13 hex digits (1001 1001 … repeating, rounded up at the end to …a), times 2<sup>−4</sup>. The stored exponent is −4 + 1023 = 1019.</p>`,
    `<p class="y-chinh">🎯 Y hệt cấu trúc trên với 11 bit số mũ: số chuẩn 0 &lt; e &lt; 2047, giá trị ±2<sup>e−1023</sup> × 1,f; số dưới chuẩn e = 0, giá trị ±2<sup>−1022</sup> × 0,f; e = 2047 (toàn 1) cho ∞ và NaN.</p>
<p>Slide viết giá trị số dưới chuẩn là 2<sup>e−1022</sup>(0,f); vì e = 0 với số dưới chuẩn, đó là 2<sup>−1022</sup>(0,f) — cùng số mũ với số chuẩn nhỏ nhất, chính điều làm chỗ chuyển tiếp êm (slide 54).</p>
<p>Lệnh Python <code>(0.1).hex()</code> trong lần chạy bên dưới in <code>0x1.999999999999ap-4</code>: bit 1 ẩn, rồi 52 bit phần lẻ viết thành 13 chữ số hex (1001 1001 … lặp, làm tròn lên ở cuối thành …a), nhân 2<sup>−4</sup>. Số mũ lưu là −4 + 1023 = 1019.</p>`],

  [44, 'Table 11.5 Interpretation of IEEE 754 Numbers (3 of 3) — binary128',
    `<p class="y-chinh">🎯 The same table for 15 exponent bits — bias 16383, all-1s exponent = 32767 for ∞/NaN.</p>
<div class="pitfall co-tieu-de"><strong>Two errors on this slide.</strong> (1) The "positive/negative normal nonzero" rows give the biased exponent as <strong>all 1s</strong>. All 1s is reserved for ∞ and NaN (rows above on the same slide); normal numbers have <strong>0 &lt; e &lt; 32767</strong>. (2) The subnormal rows give the value as 2<sup>e−16383</sup>(0.f); following the pattern of the other two tables it is <strong>2<sup>−16382</sup>(0.f)</strong>.</div>
<p>Use the pattern rather than the slide: for k exponent bits, bias = 2<sup>k−1</sup> − 1; normal codes 1 … 2<sup>k</sup> − 2; subnormal exponent = 1 − bias.</p>`,
    `<p class="y-chinh">🎯 Cùng bảng cho 15 bit số mũ — độ lệch 16383, số mũ toàn 1 = 32767 dành cho ∞/NaN.</p>
<div class="pitfall co-tieu-de"><strong>Hai lỗi trên slide này.</strong> (1) Hai dòng "positive/negative normal nonzero" ghi số mũ lệch là <strong>all 1s</strong>. Toàn 1 là mã dành riêng cho ∞ và NaN (các dòng phía trên của chính slide này); số chuẩn có <strong>0 &lt; e &lt; 32767</strong>. (2) Hai dòng số dưới chuẩn ghi giá trị 2<sup>e−16383</sup>(0,f); theo đúng khuôn của hai bảng kia phải là <strong>2<sup>−16382</sup>(0,f)</strong>.</div>
<p>Hãy dùng quy luật thay vì tin slide: với k bit số mũ, độ lệch = 2<sup>k−1</sup> − 1; mã số chuẩn 1 … 2<sup>k</sup> − 2; số mũ của số dưới chuẩn = 1 − độ lệch.</p>`],

  [45, 'Table 11.6 Floating-Point Numbers and Arithmetic Operations',
    `<p class="y-chinh">🎯 With X = X<sub>S</sub> × B<sup>X<sub>E</sub></sup> and Y = Y<sub>S</sub> × B<sup>Y<sub>E</sub></sup>: to add or subtract, first rewrite the operand with the smaller exponent so both have the same exponent; to multiply, multiply significands and <strong>add</strong> exponents; to divide, divide significands and <strong>subtract</strong> exponents.</p>
<p>The slide's decimal examples with X = 0.3 × 10<sup>2</sup> = 30, Y = 0.2 × 10<sup>3</sup> = 200:</p>
<ul>
<li>X + Y = (0.3 × 10<sup>2−3</sup> + 0.2) × 10<sup>3</sup> = 0.23 × 10<sup>3</sup> = 230</li>
<li>X − Y = (0.3 × 10<sup>−1</sup> − 0.2) × 10<sup>3</sup> = −0.17 × 10<sup>3</sup> = −170</li>
<li>X × Y = (0.3 × 0.2) × 10<sup>2+3</sup> = 0.06 × 10<sup>5</sup> = 6000</li>
<li>X ÷ Y = (0.3 ÷ 0.2) × 10<sup>2−3</sup> = 1.5 × 10<sup>−1</sup> = 0.15</li>
</ul>
<p>Surprising but true: multiplication and division are the <em>easy</em> floating-point operations; addition is the hard one, because of the alignment step. Aligning means shifting the smaller number right, and bits that fall off the end are lost — the source of most floating-point error.</p>`,
    `<p class="y-chinh">🎯 Với X = X<sub>S</sub> × B<sup>X<sub>E</sub></sup> và Y = Y<sub>S</sub> × B<sup>Y<sub>E</sub></sup>: để cộng hay trừ, trước hết viết lại toán hạng có số mũ nhỏ hơn để hai số cùng số mũ; để nhân, nhân phần định trị và <strong>cộng</strong> số mũ; để chia, chia phần định trị và <strong>trừ</strong> số mũ.</p>
<p>Ví dụ thập phân của slide với X = 0,3 × 10<sup>2</sup> = 30, Y = 0,2 × 10<sup>3</sup> = 200:</p>
<ul>
<li>X + Y = (0,3 × 10<sup>2−3</sup> + 0,2) × 10<sup>3</sup> = 0,23 × 10<sup>3</sup> = 230</li>
<li>X − Y = (0,3 × 10<sup>−1</sup> − 0,2) × 10<sup>3</sup> = −0,17 × 10<sup>3</sup> = −170</li>
<li>X × Y = (0,3 × 0,2) × 10<sup>2+3</sup> = 0,06 × 10<sup>5</sup> = 6000</li>
<li>X ÷ Y = (0,3 ÷ 0,2) × 10<sup>2−3</sup> = 1,5 × 10<sup>−1</sup> = 0,15</li>
</ul>
<p>Bất ngờ mà đúng: nhân và chia là các phép dấu phẩy động <em>dễ</em>; phép cộng mới khó, vì bước căn số mũ. Căn số mũ là dịch số nhỏ hơn sang phải, và các bit rơi khỏi đuôi bị mất — nguồn gốc của phần lớn sai số dấu phẩy động.</p>`],

  [46, 'Figure 11.22 Floating-Point Addition and Subtraction (Z ← X ± Y)',
    `<p class="y-chinh">🎯 Four phases: (1) <strong>check for zeros</strong>; (2) <strong>align</strong> the significands; (3) <strong>add or subtract</strong> the significands; (4) <strong>normalise</strong> the result — then round.</p>
<pre><code class="language-mermaid">flowchart LR
  A["1 · zero check: X = 0 gives Z = Y, Y = 0 gives Z = X"] --> B["2 · align: shift the smaller significand right, raise its exponent"]
  B --> C["3 · add signed significands"]
  C --> D{"significand overflow?"}
  D -- yes --> E["shift right, exponent + 1, check exponent overflow"]
  D -- no --> F["4 · normalise: shift left, exponent - 1, check underflow"]
  E --> G["round"]
  F --> G
</code></pre>
<p>Subtraction first flips the sign of Y and then is an addition. Two details from the flowchart that are easy to miss: during alignment, if the shifted significand becomes 0 (the numbers are too far apart), the result is simply the other number — <code>1e16 + 1 == 1e16</code> is this branch; and after the addition, a zero significand means the result is exactly 0.</p>
<p class="meo">💡 Worked binary example: 1.100 × 2<sup>2</sup> + 1.010 × 2<sup>0</sup> → align the second: 0.0101 × 2<sup>2</sup> → add: 1.1101 × 2<sup>2</sup> → already normal → 7.25 (6 + 1.25 ✓).</p>`,
    `<p class="y-chinh">🎯 Bốn pha: (1) <strong>kiểm số 0</strong>; (2) <strong>căn</strong> phần định trị; (3) <strong>cộng hoặc trừ</strong> phần định trị; (4) <strong>chuẩn hoá</strong> kết quả — rồi làm tròn.</p>
<pre><code class="language-mermaid">flowchart LR
  A["1 · kiểm số 0: X = 0 thì Z = Y, Y = 0 thì Z = X"] --> B["2 · căn: dịch phải phần định trị nhỏ hơn, tăng số mũ của nó"]
  B --> C["3 · cộng phần định trị có dấu"]
  C --> D{"tràn phần định trị?"}
  D -- có --> E["dịch phải, số mũ + 1, kiểm tràn số mũ"]
  D -- không --> F["4 · chuẩn hoá: dịch trái, số mũ - 1, kiểm tràn dưới"]
  E --> G["làm tròn"]
  F --> G
</code></pre>
<p>Phép trừ đổi dấu Y trước rồi thành phép cộng. Hai chi tiết dễ bỏ sót trong lưu đồ: lúc căn, nếu phần định trị bị dịch về 0 (hai số cách nhau quá xa) thì kết quả chính là số kia — <code>1e16 + 1 == 1e16</code> rơi đúng nhánh này; và sau phép cộng, phần định trị bằng 0 nghĩa là kết quả đúng bằng 0.</p>
<p class="meo">💡 Ví dụ nhị phân: 1,100 × 2<sup>2</sup> + 1,010 × 2<sup>0</sup> → căn số thứ hai: 0,0101 × 2<sup>2</sup> → cộng: 1,1101 × 2<sup>2</sup> → đã chuẩn → 7,25 (6 + 1,25 ✓).</p>`],

  [47, 'Figure 11.23 Floating-Point Multiplication',
    `<p class="y-chinh">🎯 If either operand is 0, the result is 0. Otherwise: <strong>add the exponents</strong>, <strong>subtract the bias</strong> (it was added twice), check for exponent overflow/underflow, <strong>multiply the significands</strong>, normalise, round.</p>
<p>Why "subtract bias": stored exponents are E<sub>X</sub> + 127 and E<sub>Y</sub> + 127; their sum is E<sub>X</sub> + E<sub>Y</sub> + 254, one bias too many. Example: 2.0 × 4.0 — stored exponents 128 and 129, sum 257, minus 127 = 130 → 2<sup>3</sup>, and the significands 1.0 × 1.0 = 1.0 → 8.0.</p>
<div class="pitfall co-tieu-de"><strong>Error in the slide title.</strong> The title reads "Floating-Point Multiplication (Z ← X ± Y)". The operation is <strong>Z ← X × Y</strong>; "±" was copied from the addition figure.</div>
<p>Multiplying two 24-bit significands gives up to 48 bits; at most one normalisation shift is needed, because 1.x × 1.y is always in [1, 4).</p>`,
    `<p class="y-chinh">🎯 Nếu một toán hạng bằng 0, kết quả là 0. Ngược lại: <strong>cộng hai số mũ</strong>, <strong>trừ đi độ lệch</strong> (vì nó bị cộng hai lần), kiểm tràn trên/tràn dưới số mũ, <strong>nhân phần định trị</strong>, chuẩn hoá, làm tròn.</p>
<p>Vì sao "trừ độ lệch": số mũ lưu là E<sub>X</sub> + 127 và E<sub>Y</sub> + 127; tổng là E<sub>X</sub> + E<sub>Y</sub> + 254, thừa một lần độ lệch. Ví dụ: 2,0 × 4,0 — số mũ lưu 128 và 129, tổng 257, trừ 127 = 130 → 2<sup>3</sup>, và phần định trị 1,0 × 1,0 = 1,0 → 8,0.</p>
<div class="pitfall co-tieu-de"><strong>Tiêu đề slide sai.</strong> Tiêu đề ghi "Floating-Point Multiplication (Z ← X ± Y)". Phép tính là <strong>Z ← X × Y</strong>; dấu "±" bị chép từ hình phép cộng.</div>
<p>Nhân hai phần định trị 24 bit cho tới 48 bit; chỉ cần dịch chuẩn hoá tối đa một bit, vì 1,x × 1,y luôn nằm trong [1, 4).</p>`],

  [48, 'Figure 11.24 Floating-Point Division (Z ← X/Y)',
    `<p class="y-chinh">🎯 X = 0 → Z = 0. Y = 0 → Z = ∞. Otherwise: <strong>subtract the exponents</strong>, <strong>add the bias back</strong>, check overflow/underflow, divide the significands, normalise, round.</p>
<p>The bias is added back because subtracting two biased exponents cancels the bias: (E<sub>X</sub> + 127) − (E<sub>Y</sub> + 127) = E<sub>X</sub> − E<sub>Y</sub>. The flowchart's "Y = 0 → Z ← ∞" is the IEEE rule you can observe in C: <code>1/0.0</code> prints <code>inf</code>, not a crash. (Integer division by zero, by contrast, is undefined behaviour in C: on x86-64 Linux it traps and the program is killed with SIGFPE, while ARM64 hardware simply returns 0.)</p>
<p class="meo">💡 This flowchart simplifies: 0/0 is not ∞ but NaN (slide 53), and the sign of ∞ follows the signs of the operands: <code>-1/0.0</code> is <code>-inf</code>.</p>`,
    `<p class="y-chinh">🎯 X = 0 → Z = 0. Y = 0 → Z = ∞. Ngược lại: <strong>trừ hai số mũ</strong>, <strong>cộng lại độ lệch</strong>, kiểm tràn, chia phần định trị, chuẩn hoá, làm tròn.</p>
<p>Phải cộng lại độ lệch vì trừ hai số mũ lệch thì độ lệch triệt tiêu: (E<sub>X</sub> + 127) − (E<sub>Y</sub> + 127) = E<sub>X</sub> − E<sub>Y</sub>. Nhánh "Y = 0 → Z ← ∞" của lưu đồ là quy tắc IEEE bạn quan sát được trong C: <code>1/0.0</code> in ra <code>inf</code>, không sập. (Ngược lại, chia số nguyên cho 0 là hành vi không xác định trong C: trên Linux x86-64 nó gây bẫy và chương trình bị giết bằng SIGFPE, còn phần cứng ARM64 thì lặng lẽ trả về 0.)</p>
<p class="meo">💡 Lưu đồ này đơn giản hoá: 0/0 không phải ∞ mà là NaN (slide 53), và dấu của ∞ theo dấu của toán hạng: <code>-1/0.0</code> là <code>-inf</code>.</p>`],

  [49, 'Figure 11.25 The Use of Guard Bits',
    `<p class="y-chinh">🎯 When two nearly equal numbers are subtracted, the bits shifted out during alignment matter. (a) Without guard bits: 1.000…00 × 2<sup>1</sup> − 0.111…11 × 2<sup>1</sup> = 1.000…00 × 2<sup>−22</sup>. (b) With guard bits: the answer is 1.000…00 × 2<sup>−23</sup>. The version without guard bits is <strong>wrong by a factor of 2</strong>.</p>
<p>What happened: y was 1.111…1 × 2<sup>0</sup> (24 one-bits). Aligning it to 2<sup>1</sup> shifted it right by one place; its last 1 fell off the end. The subtraction then worked with a y that was slightly too small, and because the difference is tiny, that one lost bit became the whole answer. Guard bits are a few extra bits kept to the right of the significand during the operation, so that the shifted-out bits still take part. (c) and (d) show the same effect in base 16 (an IBM-style format): 16<sup>−4</sup> without guard digits versus the correct 16<sup>−5</sup>.</p>
<p class="meo">💡 Subtracting nearly equal numbers is called <strong>catastrophic cancellation</strong>: the leading digits cancel and only the noisy trailing digits remain. Guard bits make the hardware result exact; the error that can still bite you is the one already present in the inputs — see Math for ML 11.2.</p>`,
    `<p class="y-chinh">🎯 Khi trừ hai số gần bằng nhau, các bit bị dịch ra lúc căn số mũ trở nên quan trọng. (a) Không có bit bảo vệ: 1,000…00 × 2<sup>1</sup> − 0,111…11 × 2<sup>1</sup> = 1,000…00 × 2<sup>−22</sup>. (b) Có bit bảo vệ: đáp án là 1,000…00 × 2<sup>−23</sup>. Bản không có bit bảo vệ <strong>sai gấp 2 lần</strong>.</p>
<p>Chuyện gì xảy ra: y vốn là 1,111…1 × 2<sup>0</sup> (24 bit 1). Căn nó về 2<sup>1</sup> là dịch phải một chỗ; bit 1 cuối rơi khỏi đuôi. Phép trừ sau đó làm với một y hơi nhỏ hơn thật, và vì hiệu rất nhỏ, đúng một bit bị mất đó trở thành toàn bộ đáp án. Bit bảo vệ (guard bits) là vài bit thêm giữ ở bên phải phần định trị trong lúc tính, để các bit bị dịch ra vẫn được tham gia. (c) và (d) cho cùng hiệu ứng ở cơ số 16 (định dạng kiểu IBM): 16<sup>−4</sup> khi không có chữ số bảo vệ so với đáp án đúng 16<sup>−5</sup>.</p>
<p class="meo">💡 Trừ hai số gần bằng nhau gọi là <strong>triệt tiêu thảm hoạ</strong> (catastrophic cancellation): các chữ số đầu triệt tiêu nhau, chỉ còn lại các chữ số đuôi đầy nhiễu. Bit bảo vệ làm kết quả của phần cứng chính xác; sai số vẫn có thể cắn bạn là sai số đã nằm sẵn trong đầu vào — xem Math for ML 11.2.</p>`],

  [50, 'Precision Considerations — Rounding',
    `<p class="y-chinh">🎯 IEEE 754 defines four rounding modes: <strong>round to nearest</strong> (the default), <strong>round toward +∞</strong>, <strong>round toward −∞</strong>, <strong>round toward 0</strong>.</p>
<p>Round to nearest picks the representable number closest to the exact result; on an exact tie it picks the one whose last bit is 0 ("ties to even"), so that ties are rounded up half the time and down half the time — no systematic drift. That default is what the C program sees: 0.1 is stored as 0.1000000000000000055…, the nearest double above the true value (Python's <code>Decimal(0.1)</code> prints every digit of it), and <code>16777216.0f + 1.0f</code> rounds the tie 16 777 217 to the even neighbour 16 777 216.</p>
<p>The directed modes exist for interval arithmetic (next slide) and for proving bounds; ordinary programs never change the mode.</p>
<p class="meo">💡 "Ties to even" is also what Python's <code>round(2.5)</code> does (it gives 2) — a frequent surprise for people who learned "round half up" at school.</p>`,
    `<p class="y-chinh">🎯 IEEE 754 định nghĩa bốn chế độ làm tròn: <strong>về số gần nhất</strong> (mặc định), <strong>về phía +∞</strong>, <strong>về phía −∞</strong>, <strong>về phía 0</strong>.</p>
<p>Làm tròn về số gần nhất chọn số biểu diễn được gần kết quả chính xác nhất; khi hoà đúng ở giữa thì chọn số có bit cuối bằng 0 ("ties to even"), để các ca hoà được làm tròn lên một nửa và xuống một nửa — không trôi có hệ thống. Chế độ mặc định đó là thứ chương trình C nhìn thấy: 0,1 được lưu thành 0,1000000000000000055…, số double gần nhất nằm trên giá trị thật (<code>Decimal(0.1)</code> của Python in ra mọi chữ số của nó), và <code>16777216.0f + 1.0f</code> làm tròn ca hoà 16 777 217 về số chẵn kề là 16 777 216.</p>
<p>Các chế độ có hướng tồn tại cho số học khoảng (slide sau) và cho việc chứng minh cận; chương trình thông thường không bao giờ đổi chế độ.</p>
<p class="meo">💡 "Ties to even" cũng là thứ <code>round(2.5)</code> của Python làm (ra 2) — bất ngờ thường gặp với người học "làm tròn nửa lên" ở trường.</p>`],

  [51, 'Interval Arithmetic and Truncation',
    `<p class="y-chinh">🎯 <strong>Interval arithmetic</strong>: compute every result twice, once rounded toward −∞ and once toward +∞, giving an interval guaranteed to contain the true result; the width of the interval measures the accuracy. <strong>Truncation</strong> (round toward 0): drop the extra bits — simplest, but it biases every result toward zero.</p>
<p>The slide says the bias of truncation is "serious because it affects every operation for which there are nonzero extra bits". A real-world illustration: the Vancouver Stock Exchange launched a new index at 1000.000 in January 1982 and recomputed it after every trade, <em>truncating</em> to three decimals each time. By November 1983 it read about 524.811, while the correctly rounded value was about 1098.892 — the index had lost half its value to truncation alone. The Patriot clock of the introduction is the same story: the constant 0.1 was chopped, never rounded.</p>
<p class="meo">💡 One small bias × millions of operations = a large error. Rounding to nearest spreads errors in both directions so they largely cancel; truncation lets them add up.</p>`,
    `<p class="y-chinh">🎯 <strong>Số học khoảng</strong> (interval arithmetic): tính mỗi kết quả hai lần, một lần làm tròn về −∞ và một lần về +∞, được một khoảng chắc chắn chứa kết quả thật; độ rộng của khoảng đo độ chính xác. <strong>Cắt cụt</strong> (truncation, làm tròn về 0): bỏ các bit thừa — đơn giản nhất, nhưng kéo mọi kết quả lệch về phía 0.</p>
<p>Slide nói độ lệch của cắt cụt là "nghiêm trọng vì nó ảnh hưởng mọi phép tính có bit thừa khác 0". Một minh hoạ ngoài đời: Sở giao dịch chứng khoán Vancouver ra mắt chỉ số mới ở 1000,000 vào tháng 1/1982 và tính lại sau mỗi giao dịch, mỗi lần <em>cắt cụt</em> về ba chữ số thập phân. Tới tháng 11/1983 nó chỉ còn khoảng 524,811, trong khi giá trị làm tròn đúng là khoảng 1098,892 — chỉ số mất một nửa giá trị chỉ vì cắt cụt. Đồng hồ Patriot ở phần mở đầu là cùng câu chuyện: hằng số 0,1 bị chặt cụt, không hề được làm tròn.</p>
<p class="meo">💡 Một độ lệch nhỏ × hàng triệu phép tính = sai số lớn. Làm tròn về số gần nhất rải sai số về cả hai phía nên phần lớn triệt tiêu nhau; cắt cụt để chúng cộng dồn.</p>`],

  [52, 'IEEE Standard for Binary Floating-Point Arithmetic — Infinity',
    `<p class="y-chinh">🎯 Infinity is treated as the limiting case of real arithmetic: −∞ &lt; every finite number &lt; +∞. Operations with ∞ give the "limit" answer: 5 + (+∞) = +∞, 5 − (+∞) = −∞, 5 × (+∞) = +∞, 5 ÷ (+∞) = +0, (+∞) + (+∞) = +∞, (−∞) − (+∞) = −∞, (+∞) − (−∞) = +∞.</p>
<p>The point of ∞ is to let a computation <em>continue</em> sensibly after an overflow or a division by zero instead of crashing, and to keep enough information to recover. A classic example: the parallel resistance formula 1 / (1/R<sub>1</sub> + 1/R<sub>2</sub>) gives the right answer 0 when R<sub>1</sub> = 0 (a short circuit), because 1/0 = ∞, ∞ + anything = ∞, and 1/∞ = 0.</p>
<p>The C run shows it: <code>1/0.0 = inf</code>, <code>-1/0.0 = -inf</code>. Note <code>5 ÷ (+∞) = +0</code> — a signed zero, remembered from which side it was approached.</p>`,
    `<p class="y-chinh">🎯 Vô cùng được coi là trường hợp giới hạn của số học thực: −∞ &lt; mọi số hữu hạn &lt; +∞. Phép tính với ∞ cho đáp án "giới hạn": 5 + (+∞) = +∞, 5 − (+∞) = −∞, 5 × (+∞) = +∞, 5 ÷ (+∞) = +0, (+∞) + (+∞) = +∞, (−∞) − (+∞) = −∞, (+∞) − (−∞) = +∞.</p>
<p>Ý nghĩa của ∞ là cho phép tính toán <em>tiếp tục</em> một cách hợp lý sau khi tràn hoặc chia cho 0 thay vì sập, và giữ đủ thông tin để khôi phục. Ví dụ kinh điển: công thức điện trở song song 1 / (1/R<sub>1</sub> + 1/R<sub>2</sub>) cho đúng đáp án 0 khi R<sub>1</sub> = 0 (đoản mạch), vì 1/0 = ∞, ∞ + gì cũng = ∞, và 1/∞ = 0.</p>
<p>Lần chạy C cho thấy điều đó: <code>1/0.0 = inf</code>, <code>-1/0.0 = -inf</code>. Để ý <code>5 ÷ (+∞) = +0</code> — một số 0 có dấu, nhớ nó được tiến tới từ phía nào.</p>`],

  [53, 'Table 11.7 Operations that Produce a Quiet NaN',
    `<p class="y-chinh">🎯 NaN ("Not a Number") is the result of operations with no sensible answer: any operation on a signaling NaN; ∞ − ∞ (in its four sign forms); 0 × ∞; 0/0 and ∞/∞; x REM 0 and ∞ REM y; √x for x &lt; 0.</p>
<p>The C run produces three of them — <code>0/0.0</code>, <code>sqrt(-1)</code>, <code>INF - INF</code> — and Python one more, <code>float('inf') - float('inf')</code>. A quiet NaN then <strong>propagates</strong>: any arithmetic with a NaN gives NaN, so one bad value spreads through a whole computation instead of silently becoming a plausible number.</p>
<p>The strangest property, also in the run: <code>NaN == NaN</code> is false (prints 0). A NaN is unordered — every comparison with it is false except <code>!=</code>. That is why you must test with <code>isnan(x)</code>, and why the trick <code>x != x</code> detects NaN.</p>
<div class="pitfall">Sorting or searching data that contains NaN breaks silently: comparisons stop being consistent. In data pipelines (pandas, NumPy, SQL) filter or replace NaN first.</div>`,
    `<p class="y-chinh">🎯 NaN ("Not a Number" — không phải là số) là kết quả của các phép không có đáp án hợp lý: mọi phép trên NaN báo hiệu; ∞ − ∞ (bốn dạng dấu); 0 × ∞; 0/0 và ∞/∞; x REM 0 và ∞ REM y; √x với x &lt; 0.</p>
<p>Lần chạy C sinh ra ba trong số đó — <code>0/0.0</code>, <code>sqrt(-1)</code>, <code>INF - INF</code> — và Python thêm một, <code>float('inf') - float('inf')</code>. NaN lặng sau đó <strong>lan truyền</strong>: mọi phép tính có NaN đều ra NaN, nên một giá trị hỏng loang ra cả quá trình tính thay vì lặng lẽ thành một con số trông có vẻ hợp lý.</p>
<p>Tính chất lạ nhất, cũng có trong lần chạy: <code>NaN == NaN</code> ra sai (in 0). NaN không có thứ tự — mọi phép so sánh với nó đều sai trừ <code>!=</code>. Vì thế phải kiểm bằng <code>isnan(x)</code>, và mẹo <code>x != x</code> phát hiện được NaN.</p>
<div class="pitfall">Sắp xếp hay tìm kiếm trên dữ liệu có NaN hỏng một cách im lặng: các phép so sánh không còn nhất quán. Trong đường ống dữ liệu (pandas, NumPy, SQL), hãy lọc hoặc thay NaN trước.</div>`],

  [54, 'Figure 11.26 The Effect of IEEE 754 Subnormal Numbers',
    `<p class="y-chinh">🎯 (a) Without subnormals there is a <strong>gap</strong> between 0 and the smallest normal number 2<sup>−126</sup> — wider than the spacing just above it. (b) With subnormals, the interval [0, 2<sup>−126</sup>) is filled with evenly spaced values, the same spacing as in [2<sup>−126</sup>, 2<sup>−125</sup>): <strong>gradual underflow</strong>.</p>
<p>Subnormals use exponent code 0 to mean "exponent −126, but no hidden 1": value = 0.f × 2<sup>−126</sup>. They lose precision as they get smaller (fewer significant bits), but they guarantee a valuable property: <strong>x − y == 0 if and only if x == y</strong>. Without them, two different tiny numbers could subtract to 0, and a program that checks <code>if (x != y) z = 1 / (x - y);</code> could still divide by zero.</p>
<p>The C run prints the smallest subnormal float (0x00000001 ≈ 1.4 × 10<sup>−45</sup>); Python shows the double version 2<sup>−1074</sup> = 5e-324 and that 2<sup>−1075</sup> already rounds to 0.0.</p>
<p class="meo">💡 Performance note: on many CPUs arithmetic on subnormals is much slower (handled by microcode — lesson CS.4). Audio and game code sometimes enable "flush to zero" modes to avoid it.</p>`,
    `<p class="y-chinh">🎯 (a) Không có số dưới chuẩn thì có một <strong>khoảng trống</strong> giữa 0 và số chuẩn nhỏ nhất 2<sup>−126</sup> — rộng hơn khoảng cách ngay phía trên nó. (b) Có số dưới chuẩn thì đoạn [0, 2<sup>−126</sup>) được lấp bằng các giá trị cách đều, cùng bước với [2<sup>−126</sup>, 2<sup>−125</sup>): gọi là <strong>tràn dưới từ từ</strong> (gradual underflow).</p>
<p>Số dưới chuẩn dùng mã số mũ 0 với nghĩa "số mũ −126, nhưng không có bit 1 ẩn": giá trị = 0,f × 2<sup>−126</sup>. Chúng mất dần độ chính xác khi càng nhỏ (ít bit có nghĩa hơn), nhưng bảo đảm một tính chất quý: <strong>x − y == 0 khi và chỉ khi x == y</strong>. Không có chúng, hai số cực nhỏ khác nhau có thể trừ ra 0, và chương trình kiểm <code>if (x != y) z = 1 / (x - y);</code> vẫn có thể chia cho 0.</p>
<p>Lần chạy C in số float dưới chuẩn nhỏ nhất (0x00000001 ≈ 1,4 × 10<sup>−45</sup>); Python cho bản double 2<sup>−1074</sup> = 5e-324 và cho thấy 2<sup>−1075</sup> đã bị làm tròn về 0.0.</p>
<p class="meo">💡 Ghi chú hiệu năng: trên nhiều CPU, tính toán với số dưới chuẩn chậm hơn nhiều (được xử lý bằng vi mã — bài CS.4). Mã âm thanh và game đôi khi bật chế độ "flush to zero" để tránh.</p>`],

  [55, 'Summary — Chapter 11',
    `<p class="y-chinh">🎯 The chapter in two columns. Integer side (lesson CS.2): ALU, sign-magnitude, two's complement, range extension, fixed point, negation, add/subtract, multiply, divide. Floating-point side (this lesson): principles, IEEE 754 representation, add/subtract, multiply/divide, precision, IEEE arithmetic.</p>
<table>
<thead><tr><th>Encode x as binary32</th><th>Decode a 32-bit pattern</th></tr></thead>
<tbody><tr><td>1. sign s<br>2. convert |x| to binary (CS.1)<br>3. normalise: 1.f × 2<sup>E</sup><br>4. stored exponent = E + 127 (8 bits)<br>5. fraction = the 23 bits after the point (round)</td><td>1. split 1 | 8 | 23<br>2. e = 0 → zero/subnormal; e = 255 → ∞/NaN<br>3. else value = (−1)<sup>s</sup> × 1.f × 2<sup>e−127</sup></td></tr></tbody>
</table>
<p>Worked: −6.25 = −110.01<sub>2</sub> = −1.1001 × 2<sup>2</sup> → s = 1, e = 2 + 127 = 129 = 1000 0001, f = 1001 000… → <strong>1 10000001 10010000000000000000000 = 0xC0C80000</strong>. The C program and Python both print exactly this pattern.</p>
<p class="meo">💡 If you only remember three things: floats are sign × 1.f × 2<sup>e−bias</sup>; most decimal fractions are approximations; never compare floats with <code>==</code> or store money in them.</p>`,
    `<p class="y-chinh">🎯 Cả chương trong hai cột. Phía số nguyên (bài CS.2): ALU, dấu–độ lớn, bù hai, mở rộng phạm vi, dấu phẩy tĩnh, đổi dấu, cộng/trừ, nhân, chia. Phía dấu phẩy động (bài này): nguyên lý, biểu diễn IEEE 754, cộng/trừ, nhân/chia, độ chính xác, số học IEEE.</p>
<table>
<thead><tr><th>Mã hoá x thành binary32</th><th>Giải mã một mẫu 32 bit</th></tr></thead>
<tbody><tr><td>1. dấu s<br>2. đổi |x| sang nhị phân (CS.1)<br>3. chuẩn hoá: 1,f × 2<sup>E</sup><br>4. số mũ lưu = E + 127 (8 bit)<br>5. phần lẻ = 23 bit sau dấu phẩy (làm tròn)</td><td>1. tách 1 | 8 | 23<br>2. e = 0 → số 0/dưới chuẩn; e = 255 → ∞/NaN<br>3. ngược lại giá trị = (−1)<sup>s</sup> × 1,f × 2<sup>e−127</sup></td></tr></tbody>
</table>
<p>Ví dụ: −6,25 = −110,01<sub>2</sub> = −1,1001 × 2<sup>2</sup> → s = 1, e = 2 + 127 = 129 = 1000 0001, f = 1001 000… → <strong>1 10000001 10010000000000000000000 = 0xC0C80000</strong>. Chương trình C và Python đều in đúng mẫu này.</p>
<p class="meo">💡 Nếu chỉ nhớ ba điều: số thực là dấu × 1,f × 2<sup>e−độ lệch</sup>; đa số phân số thập phân chỉ là xấp xỉ; đừng bao giờ so sánh số thực bằng <code>==</code> hay lưu tiền bằng chúng.</p>`],
]);

/* ───────────── Thực hành ───────────── */
const THUC_HANH = bi(`<h2>🔧 Hands-on: take floats apart, bit by bit</h2>
<h3>1 · The bits of −6.25, 0.1, ±0, ∞, NaN and the smallest subnormal — and the classic surprises</h3>
<p>The program copies a <code>float</code>'s 32 bits into a <code>uint32_t</code> with <code>memcpy</code> (the safe way — no value conversion) and prints sign | exponent | fraction. Compile with <code>gcc -std=c11 -Wall -Wextra cs3.c -o cs3 -lm</code>.</p>
` + code('c', C_IEEE) + out(O_IEEE) + `
<p>Match each line with a slide: −6.25 = 0xC0C80000 (slide 55's worked example); 0.1 ends in …1101 — the repeating 1100 pattern rounded up in the last bit (slide 50); 0.1f is 0.100000001…, 0.1 as a double is 0.1000000000000000055… (slide 38's 7 vs 16 digits); <code>2^24 + 1</code> rounds back (slide 35); <code>FLT_MIN</code> is the smallest <em>normal</em> float, not the most negative one (slide 39); inf, nan and <code>NaN == NaN</code> → 0 (slides 52–53).</p>
<h3>2 · The same in Python, plus exact decimal expansions</h3>
` + code('python', PY_IEEE) + out(O_PY_IEEE) + `
<p><code>Decimal(0.1)</code> prints the exact value of the double nearest to 0.1 — 55 significant digits, all of them real. <code>math.isclose</code> is the right way to compare. <code>math.fsum</code> adds with extra internal precision and gets 1.0 where the naive <code>sum</code> does not.</p>
<h3>3 · Patriot, 1991 — the drift, recomputed exactly</h3>
` + code('python', PY_PATRIOT) + out(O_PATRIOT) + `
<p>The error per tick, 9.5367431640625 × 10<sup>−8</sup> s, is exactly 0.8 × 2<sup>−23</sup>: 0.1 × 2<sup>23</sup> = 838 860.8, and chopping throws away the 0.8. After 100 hours the clock is 0.3433 s behind — the figure in the accident reports. The drift had already been noticed by Israeli Patriot crews, and the workaround was operational: reboot the system regularly, which resets the tick counter. Corrected software reached Dhahran the day after the attack. The real fix is to compute time without accumulating a chopped constant.</p>
<h3>4 · Ariane 5, 1996 — a float that does not fit in 16 bits</h3>
` + code('c', C_ARIANE) + out(O_ARIANE) + `
<p>Converting a value that does not fit into a narrower integer type has no good answer. In C, <code>double → int</code> out of range is undefined behaviour, and <code>int32 → int16</code> keeps the low 16 bits: 40000 becomes −25536 — a valid-looking, wrong number. Ariane's Ada code raised an exception instead, which was correct, but nobody handled it. The lesson is the function <code>doiCoKiem</code>: check the range before converting, and decide explicitly what to do when it fails.</p>
`,
`<h2>🔧 Thực hành: mổ xẻ số thực tới từng bit</h2>
<h3>1 · Các bit của −6,25, 0,1, ±0, ∞, NaN và số dưới chuẩn nhỏ nhất — cùng các bất ngờ kinh điển</h3>
<p>Chương trình chép 32 bit của một <code>float</code> sang <code>uint32_t</code> bằng <code>memcpy</code> (cách an toàn — không đổi giá trị) và in dấu | số mũ | phần lẻ. Biên dịch: <code>gcc -std=c11 -Wall -Wextra cs3.c -o cs3 -lm</code>.</p>
` + code('c', C_IEEE) + out(O_IEEE) + `
<p>Khớp mỗi dòng với một slide: −6,25 = 0xC0C80000 (ví dụ giải ở slide 55); 0,1 kết thúc bằng …1101 — mẫu 1100 lặp lại được làm tròn lên ở bit cuối (slide 50); 0.1f là 0,100000001…, 0.1 kiểu double là 0,1000000000000000055… (7 so với 16 chữ số của slide 38); <code>2^24 + 1</code> bị làm tròn về (slide 35); <code>FLT_MIN</code> là float <em>chuẩn</em> nhỏ nhất, không phải số âm nhất (slide 39); inf, nan và <code>NaN == NaN</code> → 0 (slide 52–53).</p>
<h3>2 · Cũng vậy bằng Python, kèm khai triển thập phân chính xác</h3>
` + code('python', PY_IEEE) + out(O_PY_IEEE) + `
<p><code>Decimal(0.1)</code> in giá trị chính xác của số double gần 0,1 nhất — 55 chữ số có nghĩa, chữ số nào cũng thật. <code>math.isclose</code> là cách so sánh đúng. <code>math.fsum</code> cộng với độ chính xác nội bộ cao hơn và ra 1.0 trong khi <code>sum</code> ngây thơ thì không.</p>
<h3>3 · Patriot, 1991 — độ trôi, tính lại chính xác</h3>
` + code('python', PY_PATRIOT) + out(O_PATRIOT) + `
<p>Sai số mỗi nhịp, 9,5367431640625 × 10<sup>−8</sup> giây, đúng bằng 0,8 × 2<sup>−23</sup>: 0,1 × 2<sup>23</sup> = 838 860,8, và cắt cụt vứt đi 0,8. Sau 100 giờ đồng hồ chậm 0,3433 giây — đúng con số trong các báo cáo tai nạn. Độ trôi này đã được các kíp Patriot của Israel nhận ra từ trước, và cách chữa tạm là về vận hành: khởi động lại hệ thống định kỳ để đặt lại bộ đếm nhịp. Bản phần mềm đã sửa tới Dhahran một ngày sau vụ tấn công. Cách sửa thật là tính thời gian mà không cộng dồn một hằng số đã bị chặt cụt.</p>
<h3>4 · Ariane 5, 1996 — một số thực không vừa 16 bit</h3>
` + code('c', C_ARIANE) + out(O_ARIANE) + `
<p>Đổi một giá trị không vừa sang kiểu nguyên hẹp hơn thì không có đáp án tốt. Trong C, <code>double → int</code> ngoài phạm vi là hành vi không xác định, còn <code>int32 → int16</code> giữ 16 bit thấp: 40000 thành −25536 — một con số trông hợp lệ mà sai. Mã Ada của Ariane thì ném ngoại lệ, vốn là đúng, nhưng không ai xử lý nó. Bài học nằm ở hàm <code>doiCoKiem</code>: kiểm phạm vi trước khi đổi, và quyết định rõ ràng phải làm gì khi không vừa.</p>
`);

const LAB = bi(thuNgay('en', 'data', 'float', 'IEEE 754, live: type any number, choose float or double, and click individual bits to see what each one does.', [
  'Type <b>-6.25</b> and check the three fields against slide 55: sign 1, exponent 129, fraction 1001…',
  'Type <b>0.1</b>: how far is the stored value from 0.1 in float, and in double?',
  'Flip the highest exponent bit of 1.0 — what value appears? Then set all exponent bits to 1 and the fraction to 0.',
], { tour: 'data-float' }),
thuNgay('vi', 'data', 'float', 'IEEE 754, chạy trực tiếp: gõ một số bất kỳ, chọn float hay double, rồi bấm từng bit để thấy mỗi bit làm gì.', [
  'Gõ <b>-6.25</b> và đối chiếu ba trường với slide 55: dấu 1, số mũ 129, phần lẻ 1001…',
  'Gõ <b>0.1</b>: giá trị được lưu lệch 0,1 bao nhiêu ở float, và ở double?',
  'Lật bit số mũ cao nhất của 1.0 — giá trị nào hiện ra? Rồi đặt mọi bit số mũ thành 1 và phần lẻ thành 0.',
], { tour: 'data-float' }));

const BAY_BAI_TAP = bi(`<h3>⚠️ Common traps</h3>
<div class="pitfall"><b>Comparing floats with <code>==</code>.</b> <code>0.1 + 0.2 == 0.3</code> is false. Compare with a tolerance: <code>fabs(a - b) &lt;= 1e-9 * fmax(fabs(a), fabs(b))</code>, or <code>math.isclose</code> in Python.</div>
<div class="pitfall"><b>Money in <code>float</code>/<code>double</code>.</b> Store cents as integers, or use <code>DECIMAL</code>/<code>NUMERIC</code> in SQL, <code>BigDecimal</code> in Java, <code>decimal</code> in Python.</div>
<div class="pitfall"><b>Accumulating a small step.</b> Adding 0.1 ten times gives 0.9999999999999999; a loop <code>for (double t = 0; t != 1.0; t += 0.1)</code> never stops. Count with an integer and compute <code>t = i * 0.1</code>.</div>
<div class="pitfall"><b>Unchecked narrowing conversions.</b> <code>(int)x</code> or <code>(int16_t)x</code> on an out-of-range value is undefined or silently wrong (Ariane). Check the range first.</div>
<div class="pitfall"><b><code>FLT_MIN</code> is not the most negative float.</b> It is the smallest positive normal value (1.17549e-38). The most negative float is <code>-FLT_MAX</code>.</div>
<h3>Exercises</h3>
<p><b>E1.</b> Encode 0.15625 as binary32 (bits and hex).</p>
` + xem('Solution', `<p>0.15625 = 5/32 = 0.00101<sub>2</sub> = 1.01 × 2<sup>−3</sup>. s = 0; e = −3 + 127 = 124 = 0111 1100; f = 0100 0000… → <b>0 01111100 01000000000000000000000 = 0x3E200000</b>. The Python run prints exactly <code>0 01111100 01000000000000000000000</code>.</p>`) + `
<p><b>E2.</b> Decode 0x41200000 and 0xC1480000.</p>
` + xem('Solution', `<p>0x41200000 = 0 10000010 0100000… → e = 130 → 2<sup>3</sup>; 1.01<sub>2</sub> = 1.25 → <b>10.0</b>.<br>0xC1480000 = 1 10000010 1001000… → e = 130; 1.1001<sub>2</sub> = 1.5625 → −1.5625 × 8 = <b>−12.5</b>.</p>`) + `
<p><b>E3.</b> Which of 0.5, 0.1, 0.75, 1/3, 0.8125 are stored exactly in binary64?</p>
` + xem('Solution', `<p>Exact: <b>0.5, 0.75, 0.8125</b> (denominators 2, 4, 16). Not exact: 0.1 (factor 5) and 1/3 (factor 3) — both repeat forever in binary.</p>`) + `
<p><b>E4.</b> What is the gap between consecutive floats near 1000? Can a <code>float</code> hold 1000.01 to the nearest hundredth?</p>
` + xem('Solution', `<p>1000 is in [2<sup>9</sup>, 2<sup>10</sup>) → spacing 2<sup>9−23</sup> = 2<sup>−14</sup> ≈ 0.000061. Yes, the nearest float is within 0.00003 of 1000.01, so it prints correctly to two decimals — but only about 7 significant digits are reliable in total.</p>`) + `
<p><b>E5.</b> Explain in one sentence why <code>1e16 + 1 == 1e16</code> is true for doubles.</p>
` + xem('Solution', `<p>Near 10<sup>16</sup> the spacing between doubles is 2 (Python's <code>math.ulp(1e16)</code> prints 2.0), so 10<sup>16</sup> + 1 is a tie between 10<sup>16</sup> and 10<sup>16</sup> + 2 and rounds to the even neighbour 10<sup>16</sup>.</p>`) + `
<h3>Self-check</h3>
<ol>
<li>Why is the exponent stored with a bias instead of in two's complement?</li>
<li>What is the hidden bit, and why can it be hidden?</li>
<li>What do e = 0 and e = 255 mean in binary32?</li>
<li>Why is <code>NaN == NaN</code> false, and how do you test for NaN?</li>
<li>What problem do subnormal numbers solve?</li>
</ol>
` + xem('Answers', `<ol><li>A biased exponent is a plain unsigned field, so bit patterns of positive floats compare in the same order as their values (slide 7, slide 32).</li><li>The leading 1 of a normalised binary significand; it is always 1, so storing it would waste a bit.</li><li>e = 0: zero or subnormal; e = 255: infinity (f = 0) or NaN (f ≠ 0).</li><li>NaN is unordered — every comparison except != is false; use <code>isnan(x)</code>.</li><li>The gap between 0 and the smallest normal number: they give gradual underflow so that x − y = 0 only when x = y.</li></ol>`) + `
<h3>Where this connects</h3>
<ul>
<li>Previous / next: ` + bai(COA, 'cea201-cs2-so-hoc-so-nguyen', '⭐ CS.2 — integer arithmetic') + ` · ` + bai(COA, 'cea201-cs4-khoi-dieu-khien-vi-chuong-trinh', '⭐ CS.4 — control unit and microprogramming') + `.</li>
<li>Courses: ` + bai('math-for-ml', 'math-ml-11-1-float', 'Math for ML 11.1 — float32, float16, bfloat16, FP8') + ` · ` + bai('math-for-ml', 'math-ml-11-2-tran-so', '11.2 — overflow, underflow, catastrophic cancellation') + ` · ` + bai('math-for-ml', 'math-ml-9-5-softmax-on-dinh', '9.5 — softmax without overflow') + ` · money in a database: ` + bai('postgresql', 'postgresql-2-1-so', 'PostgreSQL 2.1 — numeric and the money trap') + `.</li>
<li>Academy: ` + bai('programming-fundamentals', 'prf192-2-2-kieu-du-lieu', 'PRF192 2.2 — data types') + ` · ` + bai('introduction-to-computer-science', 'csi104-3-1-luu-so', 'CSI104 3.1 — storing integers and floats') + ` · ` + bai('csi106-introduction-to-computer-science', 'csi106-3-1-storing-numbers', 'CSI106 3.1 — floating point') + `.</li>
</ul>`,
`<h3>⚠️ Bẫy thường gặp</h3>
<div class="pitfall"><b>So sánh số thực bằng <code>==</code>.</b> <code>0.1 + 0.2 == 0.3</code> ra sai. So với dung sai: <code>fabs(a - b) &lt;= 1e-9 * fmax(fabs(a), fabs(b))</code>, hoặc <code>math.isclose</code> trong Python.</div>
<div class="pitfall"><b>Lưu tiền bằng <code>float</code>/<code>double</code>.</b> Lưu số nguyên đơn vị nhỏ nhất (đồng, xu), hoặc dùng <code>DECIMAL</code>/<code>NUMERIC</code> trong SQL, <code>BigDecimal</code> trong Java, <code>decimal</code> trong Python.</div>
<div class="pitfall"><b>Cộng dồn một bước nhỏ.</b> Cộng 0,1 mười lần ra 0.9999999999999999; vòng lặp <code>for (double t = 0; t != 1.0; t += 0.1)</code> không bao giờ dừng. Đếm bằng số nguyên và tính <code>t = i * 0.1</code>.</div>
<div class="pitfall"><b>Ép hẹp không kiểm.</b> <code>(int)x</code> hay <code>(int16_t)x</code> với giá trị ngoài phạm vi là không xác định hoặc sai lặng lẽ (Ariane). Kiểm phạm vi trước.</div>
<div class="pitfall"><b><code>FLT_MIN</code> không phải float âm nhất.</b> Nó là giá trị chuẩn dương nhỏ nhất (1.17549e-38). Float âm nhất là <code>-FLT_MAX</code>.</div>
<h3>Bài tập</h3>
<p><b>E1.</b> Mã hoá 0,15625 thành binary32 (bit và hex).</p>
` + xem('Lời giải', `<p>0,15625 = 5/32 = 0,00101<sub>2</sub> = 1,01 × 2<sup>−3</sup>. s = 0; e = −3 + 127 = 124 = 0111 1100; f = 0100 0000… → <b>0 01111100 01000000000000000000000 = 0x3E200000</b>. Lần chạy Python in đúng <code>0 01111100 01000000000000000000000</code>.</p>`) + `
<p><b>E2.</b> Giải mã 0x41200000 và 0xC1480000.</p>
` + xem('Lời giải', `<p>0x41200000 = 0 10000010 0100000… → e = 130 → 2<sup>3</sup>; 1,01<sub>2</sub> = 1,25 → <b>10,0</b>.<br>0xC1480000 = 1 10000010 1001000… → e = 130; 1,1001<sub>2</sub> = 1,5625 → −1,5625 × 8 = <b>−12,5</b>.</p>`) + `
<p><b>E3.</b> Trong 0,5; 0,1; 0,75; 1/3; 0,8125, số nào được binary64 lưu chính xác?</p>
` + xem('Lời giải', `<p>Chính xác: <b>0,5; 0,75; 0,8125</b> (mẫu 2, 4, 16). Không chính xác: 0,1 (thừa số 5) và 1/3 (thừa số 3) — cả hai lặp vô hạn ở hệ nhị phân.</p>`) + `
<p><b>E4.</b> Khoảng cách giữa hai float liên tiếp gần 1000 là bao nhiêu? Một <code>float</code> giữ được 1000,01 chính xác tới phần trăm không?</p>
` + xem('Lời giải', `<p>1000 nằm trong [2<sup>9</sup>, 2<sup>10</sup>) → bước 2<sup>9−23</sup> = 2<sup>−14</sup> ≈ 0,000061. Được, float gần nhất cách 1000,01 chưa tới 0,00003, nên in hai chữ số thập phân vẫn đúng — nhưng tổng cộng chỉ khoảng 7 chữ số có nghĩa là tin được.</p>`) + `
<p><b>E5.</b> Giải thích bằng một câu vì sao <code>1e16 + 1 == 1e16</code> đúng với double.</p>
` + xem('Lời giải', `<p>Gần 10<sup>16</sup> khoảng cách giữa các double là 2 (<code>math.ulp(1e16)</code> của Python in 2.0), nên 10<sup>16</sup> + 1 là ca hoà giữa 10<sup>16</sup> và 10<sup>16</sup> + 2 và được làm tròn về số chẵn kề 10<sup>16</sup>.</p>`) + `
<h3>Tự kiểm</h3>
<ol>
<li>Vì sao số mũ được lưu dạng lệch thay vì bù hai?</li>
<li>Bit ẩn là gì, và vì sao giấu được nó?</li>
<li>Ở binary32, e = 0 và e = 255 nghĩa là gì?</li>
<li>Vì sao <code>NaN == NaN</code> ra sai, và kiểm NaN bằng cách nào?</li>
<li>Số dưới chuẩn giải quyết vấn đề gì?</li>
</ol>
` + xem('Đáp án', `<ol><li>Số mũ lệch là một trường không dấu bình thường, nên mẫu bit của số thực dương so sánh theo cùng thứ tự với giá trị (slide 7, slide 32).</li><li>Bit 1 đứng đầu phần định trị nhị phân đã chuẩn hoá; nó luôn là 1, nên lưu nó là phí một bit.</li><li>e = 0: số 0 hoặc số dưới chuẩn; e = 255: vô cùng (f = 0) hoặc NaN (f ≠ 0).</li><li>NaN không có thứ tự — mọi phép so sánh trừ != đều sai; dùng <code>isnan(x)</code>.</li><li>Khoảng trống giữa 0 và số chuẩn nhỏ nhất: chúng cho tràn dưới từ từ để x − y = 0 chỉ khi x = y.</li></ol>`) + `
<h3>Liên kết</h3>
<ul>
<li>Trước / sau: ` + bai(COA, 'cea201-cs2-so-hoc-so-nguyen', '⭐ CS.2 — số học số nguyên') + ` · ` + bai(COA, 'cea201-cs4-khoi-dieu-khien-vi-chuong-trinh', '⭐ CS.4 — khối điều khiển và vi chương trình') + `.</li>
<li>Courses: ` + bai('math-for-ml', 'math-ml-11-1-float', 'Math for ML 11.1 — float32, float16, bfloat16, FP8') + ` · ` + bai('math-for-ml', 'math-ml-11-2-tran-so', '11.2 — tràn trên, tràn dưới, triệt tiêu thảm hoạ') + ` · ` + bai('math-for-ml', 'math-ml-9-5-softmax-on-dinh', '9.5 — softmax không tràn số') + ` · tiền trong cơ sở dữ liệu: ` + bai('postgresql', 'postgresql-2-1-so', 'PostgreSQL 2.1 — numeric và cạm bẫy tiền bạc') + `.</li>
<li>Academy: ` + bai('programming-fundamentals', 'prf192-2-2-kieu-du-lieu', 'PRF192 2.2 — kiểu dữ liệu') + ` · ` + bai('introduction-to-computer-science', 'csi104-3-1-luu-so', 'CSI104 3.1 — lưu số nguyên và số thực') + ` · ` + bai('csi106-introduction-to-computer-science', 'csi106-3-1-storing-numbers', 'CSI106 3.1 — dấu phẩy động') + `.</li>
</ul>`);

export default {
  title: '⭐ CS.3 — Floating point & IEEE 754: rounding, ∞, NaN, subnormals (CEA11 #31–55)|||⭐ CS.3 — Dấu phẩy động & IEEE 754: làm tròn, ∞, NaN, số dưới chuẩn (CEA11 #31–55)',
  slug: 'cea201-cs3-dau-phay-dong-ieee754',
  type: 'DOCUMENT',
  description: 'Phần ⭐ Chuyên sâu web bổ sung (deck chính hãng Chapter 11, slide 31–55 — không nằm trong lịch học): nguyên lý dấu phẩy động, định dạng 32 bit điển hình, chuẩn hoá và bit ẩn, phạm vi và mật độ, IEEE 754 binary32/64/128 và bảng tham số, giải mã số 0/chuẩn/dưới chuẩn/∞/NaN, cộng-trừ-nhân-chia và bit bảo vệ, bốn chế độ làm tròn, số học khoảng và cắt cụt (Vancouver 1982), vô cùng, NaN, số dưới chuẩn; chạy thật bằng C (bit của −6,25, 0,1, ±0, ∞, NaN; 0,1 + 0,2 ≠ 0,3; 2^24 + 1) và Python (Decimal, ulp, fsum), tính lại độ trôi đồng hồ Patriot 1991 và tái hiện phép đổi 64→16 bit của Ariane 5; nêu 5 lỗi của slide (2^−16362, e < 225, bảng binary128, tiêu đề X ± Y ở phép nhân).',
  content: [MO_DAU, walkHead(D, 31, 55,
    'Slides 1–30 of this deck (integers) are lesson ⭐ CS.2.',
    'Slide 1–30 của deck này (số nguyên) là bài ⭐ CS.2.'),
  SLIDES, THUC_HANH, LAB, BAY_BAI_TAP].join('\n'),
};
