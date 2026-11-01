/** CSD201 · 3.2 — Bốn đệ quy kinh điển: tháp Hà Nội, Fibonacci có nhớ (kiểm hàm mũ), luỹ thừa nhanh mod m (kiểm O(log n)). */
import { moDun, deJava, deQuy, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-3-2-hanoi',
  tieuDe: { en: 'Towers of Hanoi: the moves, and how many there are', vi: 'Tháp Hà Nội: các bước chuyển, và có bao nhiêu bước' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['divide into n − 1 / 1 / n − 1', 'exponential output 2ⁿ − 1', 'counting by a recurrence'],
  moTa: {
    en: `<p>Move n disks from peg ${c('A')} to peg ${c('C')} using ${c('B')}, never putting a larger disk on a smaller one. Complete:</p>
<ul><li>${c('static void moves(int n, char from, char to, char via, StringBuilder out)')} — append one line ${c('"disk d: X -> Y"')} per move, in the order they happen;</li>
<li>${c('static long count(int n)')} — the number of moves, from the recurrence ${c('M(n) = 2·M(n−1) + 1')}, M(0) = 0, <b>without</b> generating the moves (the grader asks for n = 62).</li></ul>`,
    vi: `<p>Chuyển n đĩa từ cọc ${c('A')} sang cọc ${c('C')} qua ${c('B')}, không bao giờ đặt đĩa lớn lên đĩa nhỏ. Hoàn thiện ${c('moves(n, from, to, via, out)')} — nối một dòng ${c('"disk d: X -> Y"')} cho mỗi bước, đúng thứ tự xảy ra; và ${c('count(n)')} — số bước, theo hệ thức ${c('M(n) = 2·M(n−1) + 1')}, M(0) = 0, <b>không</b> sinh ra các bước (máy chấm hỏi n = 62).</p>`,
  },
  yeuCau: { en: ['moves is recursive: n − 1 disks to the spare peg, the largest disk, n − 1 disks back on top.', 'count(62) must answer instantly.'], vi: ['moves đệ quy: n − 1 đĩa sang cọc phụ, đĩa lớn nhất, n − 1 đĩa trở lại lên trên.', 'count(62) phải trả lời tức thì.'] },
  dauVao: { en: 'MOVES n · COUNT n.', vi: 'MOVES n · COUNT n.' },
  dauRa: { en: 'The moves, or the count.', vi: 'Các bước, hoặc số bước.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("MOVES")) {
                    StringBuilder out = new StringBuilder();
                    Hanoi.moves(n(1), 'A', 'C', 'B', out);
                    r = "\\n" + out.toString().trim();
                } else {
                    final long[] c = new long[1];
                    final int k = n(1);
                    r = Kiem.hen("count(" + k + ")", 2000, new Runnable() {
                        public void run() {
                            c[0] = Hanoi.count(k);
                        }
                    }) + " = " + c[0];
                }`,
    }),
  },
  tep: {
    'Hanoi.java': j`
public class Hanoi {

    static void moves(int n, char from, char to, char via, StringBuilder out) {
        //>> // TODO
        if (n == 0) {
            return;
        }
        moves(n - 1, from, via, to, out);
        out.append("disk ").append(n).append(": ").append(from).append(" -> ").append(to).append('\n');
        moves(n - 1, via, to, from, out);
        //<<
    }

    static long count(int n) {
        //>> return 0; // TODO: the recurrence, not the moves
        return n == 0 ? 0 : 2 * count(n - 1) + 1;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'n = 1, 2, 3', vi: 'n = 1, 2, 3' }, vao: 'MOVES 1\nMOVES 2\nMOVES 3\nCOUNT 3\nCOUNT 10\n' },
    { ten: { en: 'n = 4 and n = 62 (only the formula is fast enough)', vi: 'n = 4 và n = 62 (chỉ công thức mới đủ nhanh)' }, vao: 'MOVES 4\nCOUNT 62\nCOUNT 0\nMOVES 0\n', an: true },
  ],
  goiY: [
    { en: 'moves(n): moves(n−1, from, via, to); move disk n from → to; moves(n−1, via, to, from).', vi: 'moves(n): moves(n−1, from, via, to); chuyển đĩa n from → to; moves(n−1, via, to, from).' },
    { en: 'count(n) = 2·count(n−1) + 1 has n calls — or use the closed form 2ⁿ − 1 = (1L << n) − 1.', vi: 'count(n) = 2·count(n−1) + 1 chỉ có n lời gọi — hoặc dùng công thức đóng 2ⁿ − 1 = (1L << n) − 1.' },
  ],
  loiHayGap: [
    { en: 'Swapping the roles of the pegs in the second call — disks end up on B.', vi: 'Đổi nhầm vai các cọc ở lời gọi thứ hai — đĩa kết thúc ở B.' },
    { en: 'count(n) that runs moves() and counts the lines — for n = 62 that is 4.6·10¹⁸ moves.', vi: 'count(n) chạy moves() rồi đếm dòng — với n = 62 là 4,6·10¹⁸ bước.' },
  ],
  giaiThich: { en: '<p>M(n) = 2M(n−1) + 1 gives M(n) = 2ⁿ − 1: the number of MOVES is exponential, so printing them is Θ(2ⁿ) whatever you do. Counting them only needs the recurrence: n calls, O(n).</p>', vi: '<p>M(n) = 2M(n−1) + 1 cho M(n) = 2ⁿ − 1: số BƯỚC là hàm mũ, nên in chúng ra là Θ(2ⁿ) dù làm cách nào. Đếm chúng chỉ cần hệ thức: n lời gọi, O(n).</p>' },
});

const de2 = deJava({
  id: 'csd201-3-2-fibonacci-memo',
  tieuDe: { en: 'Fibonacci: from exponential to linear with memoization', vi: 'Fibonacci: từ hàm mũ xuống tuyến tính nhờ ghi nhớ' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['overlapping subproblems', 'memoization', 'top-down dynamic programming'],
  moTa: {
    en: `<p>The starter ${c('Fib.fib(int n)')} is the textbook double recursion — correct, but it recomputes the same values again and again: fib(45) already needs over a billion calls. Keep it <b>recursive</b> but add a memo (${c('long[]')} or a map) so every fib(k) is computed once. F(0) = 0, F(1) = 1; the grader asks up to n = 90 (still fits in a long).</p>`,
    vi: `<p>Hàm khởi đầu ${c('Fib.fib(int n)')} là đệ quy kép của giáo trình — đúng nhưng tính đi tính lại cùng một giá trị: fib(45) đã cần hơn một tỉ lời gọi. Giữ nguyên <b>đệ quy</b> nhưng thêm bảng nhớ (${c('long[]')} hoặc map) để mỗi fib(k) chỉ tính một lần. F(0) = 0, F(1) = 1; máy chấm hỏi tới n = 90 (vẫn vừa long).</p>`,
  },
  yeuCau: { en: ['Still recursive (rule R1 needs a recursive call).', 'Each fib(k) computed once.'], vi: ['Vẫn đệ quy (luật R1 cần có lời gọi đệ quy).', 'Mỗi fib(k) chỉ tính một lần.'] },
  dauVao: { en: 'One n per line.', vi: 'Mỗi dòng một n.' },
  dauRa: { en: 'F(n), computed within a time limit.', vi: 'F(n), tính trong hạn giờ.' },
  main: 'KiemTra',
  quyTac: [deQuy('yes', 'Fib', 'fib')],
  hen: { n: '90', ms: 2000, can: 'O(n)', cham: 'O(φⁿ) (double recursion without a memo)', en: 'Without a memo, fib(90) needs about 10¹⁹ calls.', vi: 'Không có bảng nhớ, fib(90) cần khoảng 10¹⁹ lời gọi.' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                final int k = n(0);
                final long[] v = new long[1];
                r = Kiem.hen("fib(" + k + ")", 2000, new Runnable() {
                    public void run() {
                        v[0] = Fib.fib(k);
                    }
                }) + " = " + v[0];`,
    }),
  },
  tep: {
    'Fib.java': j`
public class Fib {
    //>> // TODO: a memo
    private static final long[] memo = new long[100];
    //<<

    static long fib(int n) {
        //>> if (n < 2) { ⏎     return n; ⏎ } ⏎ return fib(n - 1) + fib(n - 2); // exponential: add a memo
        if (n < 2) {
            return n;
        }
        if (memo[n] != 0) {
            return memo[n];
        }
        return memo[n] = fib(n - 1) + fib(n - 2);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'small values', vi: 'giá trị nhỏ' }, vao: '0\n1\n2\n10\n20\n' },
    { ten: { en: 'n = 50, 90 (exponential recursion cannot)', vi: 'n = 50, 90 (đệ quy hàm mũ không làm nổi)' }, vao: '50\n90\n89\n' },
  ],
  goiY: [
    { en: 'Before computing fib(n), look it up in the memo; after computing it, store it.', vi: 'Trước khi tính fib(n) thì tra bảng nhớ; tính xong thì cất vào.' },
    { en: 'F(k) > 0 for k ≥ 1, so 0 in a long[] memo can mean "not computed yet".', vi: 'F(k) > 0 với k ≥ 1, nên 0 trong bảng long[] có thể hiểu là "chưa tính".' },
  ],
  loiHayGap: [
    { en: 'An int memo — F(47) already overflows an int.', vi: 'Bảng nhớ kiểu int — F(47) đã tràn int.' },
    { en: 'Creating the memo inside fib — every call starts with an empty table and nothing is remembered.', vi: 'Tạo bảng nhớ bên trong fib — mỗi lời gọi bắt đầu với bảng rỗng và chẳng nhớ được gì.' },
  ],
  giaiThich: { en: '<p>Without a memo the call tree of fib(n) has about φⁿ nodes (φ ≈ 1.618) because fib(n−2) is computed inside both branches. With a memo every fib(k) is computed once and later calls are O(1) look-ups: n distinct calls, O(n). This is top-down dynamic programming.</p>', vi: '<p>Không có bảng nhớ, cây lời gọi của fib(n) có khoảng φⁿ nút (φ ≈ 1,618) vì fib(n−2) được tính trong cả hai nhánh. Có bảng nhớ thì mỗi fib(k) tính một lần, các lần sau là tra O(1): n lời gọi khác nhau, O(n). Đây là quy hoạch động từ trên xuống.</p>' },
});

const de3 = deJava({
  id: 'csd201-3-2-fast-power',
  tieuDe: { en: 'Fast power: aⁿ mod m with O(log n) multiplications', vi: 'Luỹ thừa nhanh: aⁿ mod m với O(log n) phép nhân' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['divide and conquer', 'xⁿ = (x^(n/2))² · x^(n mod 2)', 'modular arithmetic', 'recursion depth log n'],
  moTa: {
    en: `<p>Complete ${c('static long power(long a, long n, long m)')}: ${c('aⁿ mod m')} for 0 ≤ a, n ≤ 10¹⁸ and 1 ≤ m ≤ 10⁹ (so every product of two values below m fits in a long). Recursively: ${c('power(a, n) = half²')} if n is even, ${c('half² · a')} if odd, where ${c('half = power(a, n/2)')} — compute ${c('half')} <b>once</b>.</p>
<p>The result must be in ${c('[0, m)')}; ${c('power(a, 0, m)')} = ${c('1 % m')}.</p>`,
    vi: `<p>Hoàn thiện ${c('static long power(long a, long n, long m)')}: ${c('aⁿ mod m')} với 0 ≤ a, n ≤ 10¹⁸ và 1 ≤ m ≤ 10⁹ (nên tích hai giá trị nhỏ hơn m vừa long). Đệ quy: ${c('power(a, n) = half²')} nếu n chẵn, ${c('half² · a')} nếu n lẻ, với ${c('half = power(a, n/2)')} — tính ${c('half')} <b>một lần</b>.</p>
<p>Kết quả phải nằm trong ${c('[0, m)')}; ${c('power(a, 0, m)')} = ${c('1 % m')}.</p>`,
  },
  yeuCau: { en: ['O(log n) multiplications, recursion depth O(log n).', 'Reduce a modulo m first; never let a product exceed (m−1)².'], vi: ['O(log n) phép nhân, độ sâu đệ quy O(log n).', 'Lấy a mod m trước; không để tích nào vượt (m−1)².'] },
  dauVao: { en: 'Lines "a n m"; PERF.', vi: 'Các dòng "a n m"; PERF.' },
  dauRa: { en: 'aⁿ mod m.', vi: 'aⁿ mod m.' },
  main: 'KiemTra',
  hen: { n: '10¹⁸ (200,000 calls)', ms: 3000, can: 'O(log n)', cham: 'O(n) (multiplying n times) or calling power(a, n/2) twice', en: 'Two recursive calls per level make the work O(n) again.', vi: 'Hai lời gọi đệ quy mỗi tầng lại làm công việc thành O(n).' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final long[] s = new long[1];
                    r = Kiem.hen("200,000 calls with n near 10^18", 3000, new Runnable() {
                        public void run() {
                            for (int i = 0; i < 200000; i++) {
                                s[0] = (s[0] + Power.power(2 + i, 1000000000000000000L - i, 1000000007L)) % 1000000007L;
                            }
                        }
                    }) + ", checksum " + s[0];
                } else {
                    r = String.valueOf(Power.power(Long.parseLong(p[0]), Long.parseLong(p[1]), Long.parseLong(p[2])));
                }`,
    }),
  },
  tep: {
    'Power.java': j`
public class Power {

    static long power(long a, long n, long m) {
        //>> return 1; // TODO
        if (n == 0) {
            return 1 % m;
        }
        long half = power(a, n / 2, m); // ONE recursive call
        long r = half * half % m;
        return n % 2 == 0 ? r : r * (a % m) % m;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'small powers, n = 0, m = 1', vi: 'luỹ thừa nhỏ, n = 0, m = 1' }, vao: '2 10 1000\n3 0 7\n5 3 1\n7 1 10\n0 0 5\n' },
    { ten: { en: 'huge exponents (Fermat: a^(p-1) mod p = 1)', vi: 'số mũ khổng lồ (Fermat: a^(p-1) mod p = 1)' }, vao: '2 1000000006 1000000007\n123456789 1000000000000000000 999999937\n1000000000000000000 3 1000000000\n0 5 13\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'half = power(a, n / 2, m); then half * half % m, times a % m once more when n is odd.', vi: 'half = power(a, n / 2, m); rồi half * half % m, nhân thêm a % m một lần nếu n lẻ.' },
    { en: 'Take every product modulo m immediately; both factors are < m ≤ 10⁹, so the product is < 10¹⁸.', vi: 'Lấy mod m ngay sau mỗi phép nhân; hai thừa số đều < m ≤ 10⁹, nên tích < 10¹⁸.' },
  ],
  loiHayGap: [
    { en: 'return power(a, n/2, m) * power(a, n/2, m) % m — two calls per level: 2^(log n) = n calls, O(n) again.', vi: 'return power(a, n/2, m) * power(a, n/2, m) % m — hai lời gọi mỗi tầng: 2^(log n) = n lời gọi, lại O(n).' },
    { en: 'Multiplying by a without reducing it — a = 10¹⁸ times a value near 10⁹ overflows the long.', vi: 'Nhân với a mà không lấy mod — a = 10¹⁸ nhân giá trị gần 10⁹ là tràn long.' },
    { en: 'power(a, 0, 1) returning 1 — every value modulo 1 is 0.', vi: 'power(a, 0, 1) trả 1 — mọi giá trị modulo 1 đều là 0.' },
  ],
  giaiThich: { en: '<p>n is halved at every call, so there are ⌊log₂ n⌋ + 1 calls (about 60 for n = 10¹⁸), each with at most two multiplications: T(n) = T(n/2) + O(1) = O(log n). This is how RSA and Diffie–Hellman compute powers with 2048-bit exponents.</p>', vi: '<p>n giảm một nửa mỗi lời gọi, nên có ⌊log₂ n⌋ + 1 lời gọi (khoảng 60 với n = 10¹⁸), mỗi lời gọi tối đa hai phép nhân: T(n) = T(n/2) + O(1) = O(log n). Đó là cách RSA và Diffie–Hellman tính luỹ thừa với số mũ 2048 bit.</p>' },
});

export default moDun({ slug: 'csd201-de-quy-vi-du', ten: '3.2 The four classic recursions', de: [de1, de2, de3] });
