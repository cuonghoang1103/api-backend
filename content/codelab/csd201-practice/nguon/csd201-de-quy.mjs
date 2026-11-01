/** CSD201 · 3.1 — Đệ quy & ngăn xếp lời gọi: tổng/max đoạn mảng, đảo chuỗi + palindrome, đổi cơ số — cấm vòng lặp. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const KHONG_LAP = (file) => ({ id: 'R1', en: `no loops in ${file} — recursion only`, vi: `không vòng lặp trong ${file} — chỉ đệ quy`, re: String.raw`\b(for|while|do)\b`, file });

const de1 = deJava({
  id: 'csd201-3-1-array-recursion',
  tieuDe: { en: 'Sum, count and maximum of an array — recursively', vi: 'Tổng, đếm và giá trị lớn nhất của mảng — bằng đệ quy' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['base case', 'recursive case', 'recursion on an index', 'linear recursion'],
  moTa: {
    en: `<p>Write three recursive functions on ${c('a[i..n-1]')} (the part of the array from index i to the end), with <b>no loops</b> (rule R1):</p>
<ul><li>${c('long sum(int[] a, int i)')} — the sum; 0 for an empty part (i == a.length);</li>
<li>${c('int countEven(int[] a, int i)')} — how many even values;</li>
<li>${c('int max(int[] a, int i)')} — the largest value (the part has at least one element).</li></ul>
<p>Each function has one base case and one recursive case that handles a[i] and recurses on i + 1. The grader calls them with i = 0 and with other starting indexes.</p>`,
    vi: `<p>Viết ba hàm đệ quy trên ${c('a[i..n-1]')} (phần mảng từ chỉ số i tới cuối), <b>không vòng lặp</b> (luật R1): ${c('sum(a, i)')} — tổng, phần rỗng (i == a.length) thì 0; ${c('countEven(a, i)')} — số giá trị chẵn; ${c('max(a, i)')} — giá trị lớn nhất (phần có ít nhất một phần tử).</p>
<p>Mỗi hàm có một trường hợp cơ sở và một trường hợp đệ quy xử lý a[i] rồi gọi lại với i + 1. Máy chấm gọi với i = 0 và với các chỉ số bắt đầu khác.</p>`,
  },
  yeuCau: { en: ['Recursion only, no loops (rule R1).', 'Base case first.'], vi: ['Chỉ đệ quy, không vòng lặp (luật R1).', 'Viết trường hợp cơ sở trước.'] },
  dauVao: { en: 'Lines "i : values".', vi: 'Các dòng "i : giá trị".' },
  dauRa: { en: 'sum, countEven and max of a[i..].', vi: 'sum, countEven và max của a[i..].' },
  main: 'KiemTra',
  quyTac: [KHONG_LAP('Rec')],
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                int[] a = new int[p.length - 2];
                for (int k = 2; k < p.length; k++) {
                    a[k - 2] = n(k);
                }
                int i = n(0);
                r = "sum=" + Rec.sum(a, i) + " even=" + Rec.countEven(a, i) + " max=" + (i < a.length ? String.valueOf(Rec.max(a, i)) : "-");`,
    }),
  },
  tep: {
    'Rec.java': j`
public class Rec {

    static long sum(int[] a, int i) {
        //>> return 0; // TODO
        if (i == a.length) {
            return 0;
        }
        return a[i] + sum(a, i + 1);
        //<<
    }

    static int countEven(int[] a, int i) {
        //>> return 0; // TODO
        if (i == a.length) {
            return 0;
        }
        return (a[i] % 2 == 0 ? 1 : 0) + countEven(a, i + 1);
        //<<
    }

    static int max(int[] a, int i) {
        //>> return 0; // TODO: the last element is the base case
        if (i == a.length - 1) {
            return a[i];
        }
        return Math.max(a[i], max(a, i + 1));
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'from the start and from the middle', vi: 'từ đầu và từ giữa' }, vao: '0 : 3 8 -2 7 4\n2 : 3 8 -2 7 4\n4 : 3 8 -2 7 4\n5 : 3 8 -2 7 4\n' },
    { ten: { en: 'negatives, big sums', vi: 'số âm, tổng lớn' }, vao: '0 : -5 -2 -9\n0 : 2000000000 2000000000 1\n1 : -1 0 -3\n', an: true },
  ],
  goiY: [
    { en: 'sum: if i == a.length return 0; otherwise a[i] + sum(a, i + 1).', vi: 'sum: nếu i == a.length trả 0; ngược lại a[i] + sum(a, i + 1).' },
    { en: 'max needs a non-empty part, so its base case is the LAST element (i == a.length - 1), not the empty part.', vi: 'max cần phần không rỗng, nên trường hợp cơ sở là phần tử CUỐI (i == a.length - 1), không phải phần rỗng.' },
  ],
  loiHayGap: [
    { en: 'A base case that never fires (i > a.length) — the recursion reads a[a.length] and throws ArrayIndexOutOfBoundsException.', vi: 'Trường hợp cơ sở không bao giờ xảy ra (i > a.length) — đệ quy đọc a[a.length] và ném ArrayIndexOutOfBoundsException.' },
    { en: 'max returning 0 for the empty part — an all-negative array then has max 0.', vi: 'max trả 0 cho phần rỗng — mảng toàn số âm sẽ có max bằng 0.' },
  ],
  giaiThich: { en: '<p>Each call does O(1) work and makes one recursive call on a smaller part, so the recursion depth and the running time are both n − i: O(n). The call stack holds n frames at the deepest point — fine for thousands of elements, not for millions (chapter 3.4).</p>', vi: '<p>Mỗi lời gọi làm O(1) việc và gọi đệ quy một lần trên phần nhỏ hơn, nên độ sâu đệ quy và thời gian chạy đều là n − i: O(n). Ngăn xếp lời gọi giữ n khung ở điểm sâu nhất — ổn với hàng nghìn phần tử, không ổn với hàng triệu (bài 3.4).</p>' },
});

const de2 = deJava({
  id: 'csd201-3-1-reverse-palindrome',
  tieuDe: { en: 'Reverse a string and test a palindrome — recursively', vi: 'Đảo chuỗi và kiểm palindrome — bằng đệ quy' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['recursion on two ends', 'base cases 0 and 1 characters', 'ignoring non-letters'],
  moTa: {
    en: `<p>Two recursive functions, no loops (rule R1):</p>
<ul><li>${c('String reverse(String s)')} — ${c('"abc"')} → ${c('"cba"')};</li>
<li>${c('boolean isPalindrome(String s, int lo, int hi)')} — whether ${c('s[lo..hi]')} reads the same both ways <b>ignoring case and every character that is not a letter or digit</b>. The grader calls it with ${c('lo = 0, hi = s.length() - 1')}: ${c('"A man, a plan, a canal: Panama"')} → true.</li></ul>`,
    vi: `<p>Hai hàm đệ quy, không vòng lặp (luật R1): ${c('reverse(s)')} — ${c('"abc"')} → ${c('"cba"')}; ${c('isPalindrome(s, lo, hi)')} — ${c('s[lo..hi]')} đọc xuôi ngược như nhau không, <b>bỏ qua hoa thường và mọi ký tự không phải chữ hay số</b>. Máy chấm gọi với ${c('lo = 0, hi = s.length() - 1')}: ${c('"A man, a plan, a canal: Panama"')} → true.</p>`,
  },
  yeuCau: { en: ['Recursion only (rule R1).', 'isPalindrome must not build a new string.'], vi: ['Chỉ đệ quy (luật R1).', 'isPalindrome không được dựng chuỗi mới.'] },
  dauVao: { en: 'One text per line ("-" = empty string).', vi: 'Mỗi dòng một chuỗi ("-" = chuỗi rỗng).' },
  dauRa: { en: 'The reverse and the palindrome test.', vi: 'Chuỗi đảo và kết quả kiểm palindrome.' },
  main: 'KiemTra',
  quyTac: [KHONG_LAP('Strings')],
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                String s = line.equals("-") ? "" : line;
                r = "reverse=\\"" + Strings.reverse(s) + "\\" palindrome=" + Strings.isPalindrome(s, 0, s.length() - 1);`,
    }),
  },
  tep: {
    'Strings.java': j`
public class Strings {

    static String reverse(String s) {
        //>> return s; // TODO
        if (s.length() <= 1) {
            return s;
        }
        return reverse(s.substring(1)) + s.charAt(0);
        //<<
    }

    static boolean isPalindrome(String s, int lo, int hi) {
        //>> return false; // TODO
        if (lo >= hi) {
            return true;
        }
        char a = s.charAt(lo);
        char b = s.charAt(hi);
        if (!Character.isLetterOrDigit(a)) {
            return isPalindrome(s, lo + 1, hi);
        }
        if (!Character.isLetterOrDigit(b)) {
            return isPalindrome(s, lo, hi - 1);
        }
        return Character.toLowerCase(a) == Character.toLowerCase(b) && isPalindrome(s, lo + 1, hi - 1);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'words and the Panama sentence', vi: 'từ và câu Panama' }, vao: 'abc\nracecar\nA man, a plan, a canal: Panama\nhello\n' },
    { ten: { en: 'empty, one character, only punctuation, digits', vi: 'rỗng, một ký tự, toàn dấu câu, chữ số' }, vao: '-\nx\n.,!\n12321\n0P\nab\n', an: true },
  ],
  goiY: [
    { en: 'reverse(s) = reverse(the rest) + the first character; a string of length 0 or 1 is its own reverse.', vi: 'reverse(s) = reverse(phần còn lại) + ký tự đầu; chuỗi dài 0 hoặc 1 là chuỗi đảo của chính nó.' },
    { en: 'isPalindrome: skip a non-letter at either end by recursing with that end moved; otherwise compare lowercase ends and recurse inward.', vi: 'isPalindrome: gặp ký tự không phải chữ ở một đầu thì gọi lại với đầu đó dời vào; ngược lại so hai đầu (chữ thường) rồi gọi vào trong.' },
  ],
  loiHayGap: [
    { en: 'Base case lo == hi only — an even-length string jumps from lo < hi to lo > hi and never stops (or reads out of range).', vi: 'Chỉ có trường hợp cơ sở lo == hi — chuỗi độ dài chẵn nhảy từ lo < hi sang lo > hi và không dừng (hoặc đọc ngoài khoảng).' },
    { en: 'Comparing without lowercasing — "Panama" fails on P vs p.', vi: 'So mà không đổi về chữ thường — "Panama" trượt ở P với p.' },
  ],
  giaiThich: { en: '<p>isPalindrome moves inward by at least one position per call, so it makes at most n calls: O(n) time and depth. The substring-based reverse is O(n²) because every substring copies — fine for a lesson, and the reason real code uses StringBuilder.reverse().</p>', vi: '<p>isPalindrome dời vào trong ít nhất một vị trí mỗi lời gọi, nên gọi tối đa n lần: O(n) thời gian và độ sâu. Bản reverse dùng substring là O(n²) vì mỗi substring đều chép — đủ cho bài học, và là lý do code thật dùng StringBuilder.reverse().</p>' },
});

const de3 = deJava({
  id: 'csd201-3-1-base-conversion',
  tieuDe: { en: 'Decimal to any base from 2 to 16 — the digits come out on the way back', vi: 'Thập phân sang cơ số 2–16 — các chữ số ra ở chiều quay về' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['work after the recursive call', 'unwinding the call stack', 'n / b and n % b'],
  moTa: {
    en: `<p>Complete ${c('static String toBase(long n, int b)')} for n ≥ 0 and 2 ≤ b ≤ 16, digits ${c('0123456789ABCDEF')}: ${c('toBase(10, 2)')} = ${c('"1010"')}, ${c('toBase(255, 16)')} = ${c('"FF"')}, ${c('toBase(0, 7)')} = ${c('"0"')}. No loops (rule R1).</p>
<p>The last digit is ${c('n % b')}; the digits before it are ${c('toBase(n / b, b)')}. Doing the recursive call <b>first</b> and appending the digit <b>after</b> it gives the digits in the right order without reversing anything — the call stack does the reversing.</p>`,
    vi: `<p>Hoàn thiện ${c('static String toBase(long n, int b)')} với n ≥ 0 và 2 ≤ b ≤ 16, chữ số ${c('0123456789ABCDEF')}: ${c('toBase(10, 2)')} = ${c('"1010"')}, ${c('toBase(255, 16)')} = ${c('"FF"')}, ${c('toBase(0, 7)')} = ${c('"0"')}. Không vòng lặp (luật R1).</p>
<p>Chữ số cuối là ${c('n % b')}; các chữ số trước nó là ${c('toBase(n / b, b)')}. Gọi đệ quy <b>trước</b> rồi nối chữ số <b>sau</b> cho đúng thứ tự mà không cần đảo — ngăn xếp lời gọi làm việc đảo.</p>`,
  },
  yeuCau: { en: ['Recursion only (rule R1); no Long.toString(n, b) (rule R2).', 'Upper-case hex digits.'], vi: ['Chỉ đệ quy (luật R1); không Long.toString(n, b) (luật R2).', 'Chữ số hex viết hoa.'] },
  dauVao: { en: 'Lines "n b".', vi: 'Các dòng "n b".' },
  dauRa: { en: 'n written in base b.', vi: 'n viết trong cơ số b.' },
  main: 'KiemTra',
  quyTac: [KHONG_LAP('Base'), { id: 'R2', en: 'no library conversion (toString(n, b), toBinaryString, toHexString, BigInteger)', vi: 'không dùng hàm đổi cơ số của thư viện (toString(n, b), toBinaryString, toHexString, BigInteger)', re: String.raw`toString\s*\([^)]*,|to(Binary|Hex|Octal)String|toUnsignedString|BigInteger`, file: 'Base' }],
  harness: { 'KiemTra.java': lopKiem({ lenh: '                r = Base.toBase(Long.parseLong(p[0]), n(1));' }) },
  tep: {
    'Base.java': j`
public class Base {
    private static final String DIGITS = "0123456789ABCDEF";

    static String toBase(long n, int b) {
        //>> return ""; // TODO
        if (n < b) {
            return String.valueOf(DIGITS.charAt((int) n));
        }
        return toBase(n / b, b) + DIGITS.charAt((int) (n % b)); // the digits before, then the last digit
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'binary, hex, zero', vi: 'nhị phân, hex, số 0' }, vao: '10 2\n255 16\n0 7\n7 8\n' },
    { ten: { en: 'big values and every base', vi: 'giá trị lớn và mọi cơ số' }, vao: '9223372036854775807 16\n9223372036854775807 2\n1000000 3\n35 16\n16 16\n1 2\n', an: true },
  ],
  goiY: [
    { en: 'Base case: n < b is a single digit (this also covers n = 0).', vi: 'Trường hợp cơ sở: n < b là một chữ số (bao luôn n = 0).' },
    { en: 'Recursive case: toBase(n / b, b) + DIGITS.charAt((int) (n % b)).', vi: 'Trường hợp đệ quy: toBase(n / b, b) + DIGITS.charAt((int) (n % b)).' },
  ],
  loiHayGap: [
    { en: 'Base case n == 0 returning "" — then toBase(0, b) is the empty string instead of "0".', vi: 'Trường hợp cơ sở n == 0 trả "" — khi đó toBase(0, b) là chuỗi rỗng thay vì "0".' },
    { en: 'Appending the digit BEFORE the recursive call — the digits come out reversed.', vi: 'Nối chữ số TRƯỚC lời gọi đệ quy — các chữ số ra ngược.' },
  ],
  giaiThich: { en: '<p>Each call divides n by b, so there are ⌊log_b n⌋ + 1 calls: O(log n). The digits are produced least significant first, but they are appended while the calls return, i.e. in reverse — the most significant first.</p>', vi: '<p>Mỗi lời gọi chia n cho b, nên có ⌊log_b n⌋ + 1 lời gọi: O(log n). Các chữ số được tạo từ hàng thấp nhất, nhưng được nối khi các lời gọi quay về, tức theo chiều ngược — hàng cao nhất trước.</p>' },
});

export default moDun({ slug: 'csd201-de-quy', ten: '3.1 Recursion & the call stack', de: [de1, de2, de3] });
