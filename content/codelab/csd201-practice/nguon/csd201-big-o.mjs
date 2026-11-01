/** CSD201 · 0.3 — Big-O: đếm phép toán cơ bản, đếm vòng lặp bằng công thức, tìm tuần tự vs nhị phân (có kiểm độ phức tạp). */
import { moDun, deJava, c, pre, j } from './_chung.mjs';

const de1 = deJava({
  id: 'csd201-0-3-array-max-ops',
  tieuDe: { en: 'arrayMax: count the primitive operations', vi: 'arrayMax: đếm các phép toán cơ bản' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['primitive operations', 'best case vs worst case', 'counting comparisons and assignments'],
  moTa: {
    en: `<p>The complexity deck measures an algorithm by counting its <b>primitive operations</b>. Complete ${c('ArrayMax.arrayMax(int[] a)')}: it returns the largest element and records two counters in static fields:</p>
<ul><li>${c('comparisons')} — how many times ${c('a[i] > currentMax')} is tested;</li>
<li>${c('assignments')} — how many times ${c('currentMax')} receives a value (the first ${c('currentMax = a[0]')} counts).</li></ul>
<p>Use a strict ${c('>')}: an element equal to the current maximum does not reassign it. Both counters start from 0 on every call. The array always has at least one element.</p>`,
    vi: `<p>Bộ slide độ phức tạp đo một thuật toán bằng cách đếm các <b>phép toán cơ bản</b>. Hoàn thiện ${c('ArrayMax.arrayMax(int[] a)')}: trả về phần tử lớn nhất và ghi hai bộ đếm vào trường static: ${c('comparisons')} — số lần thử ${c('a[i] > currentMax')}; ${c('assignments')} — số lần ${c('currentMax')} nhận giá trị (lần gán đầu ${c('currentMax = a[0]')} cũng tính).</p>
<p>Dùng ${c('>')} nghiêm ngặt: phần tử bằng max hiện tại không gán lại. Hai bộ đếm bắt đầu từ 0 ở mỗi lần gọi. Mảng luôn có ít nhất một phần tử.</p>`,
  },
  yeuCau: { en: ['One pass over the array; reset both counters at the start of every call.', 'Do not change the method signature or the field names — the grader reads them.'], vi: ['Một lượt qua mảng; đặt lại hai bộ đếm ở đầu mỗi lần gọi.', 'Không đổi chữ ký hàm hay tên trường — máy chấm đọc chúng.'] },
  dauVao: { en: 'One array per line, numbers separated by spaces.', vi: 'Mỗi dòng một mảng, các số cách nhau dấu cách.' },
  dauRa: { en: 'max/comparisons/assignments for each array.', vi: 'max/số so sánh/số phép gán cho từng mảng.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            String[] p = line.split("\\s+");
            int[] a = new int[p.length];
            for (int i = 0; i < p.length; i++) {
                a[i] = Integer.parseInt(p[i]);
            }
            int m = ArrayMax.arrayMax(a);
            System.out.println(line + " -> max/comparisons/assignments = " + m + "/" + ArrayMax.comparisons + "/" + ArrayMax.assignments);
        }
    }
}
`,
  },
  tep: {
    'ArrayMax.java': j`
public class ArrayMax {
    static int comparisons;
    static int assignments;

    // Returns the largest element; counts comparisons (a[i] > currentMax) and assignments to currentMax.
    static int arrayMax(int[] a) {
        //>> return 0; // TODO: one pass, count both operations
        comparisons = 0;
        int currentMax = a[0];
        assignments = 1;
        for (int i = 1; i < a.length; i++) {
            comparisons++;
            if (a[i] > currentMax) {
                currentMax = a[i];
                assignments++;
            }
        }
        return currentMax;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'increasing (worst case), decreasing (best case), mixed', vi: 'tăng dần (xấu nhất), giảm dần (tốt nhất), lẫn lộn' }, vao: '1 2 3 4 5 6 7 8\n8 7 6 5 4 3 2 1\n3 9 2 9 5 1 7 4\n' },
    { ten: { en: 'one element, all negative, all equal', vi: 'một phần tử, toàn âm, toàn bằng nhau' }, vao: '42\n-5 -2 -9\n4 4 4 4\n' },
    { ten: { en: 'repeated calls reset the counters', vi: 'gọi nhiều lần phải đặt lại bộ đếm' }, vao: '10 20 30\n10 20 30\n-1 -1 0 -1\n100 1 2 3 101\n', an: true },
  ],
  goiY: [
    { en: 'A loop over n elements that starts at index 1 makes exactly n - 1 comparisons, whatever the data.', vi: 'Vòng lặp n phần tử bắt đầu từ chỉ số 1 luôn có đúng n - 1 phép so sánh, dữ liệu thế nào cũng vậy.' },
    { en: 'Only assignments depend on the data: increasing input reassigns every time (worst case n), decreasing input never does (best case 1).', vi: 'Chỉ số phép gán phụ thuộc dữ liệu: dãy tăng gán lại mọi lần (xấu nhất n), dãy giảm không bao giờ (tốt nhất 1).' },
  ],
  loiHayGap: [
    { en: 'Forgetting to reset the counters — the second call adds to the numbers of the first one.', vi: 'Quên đặt lại bộ đếm — lần gọi thứ hai cộng dồn lên số của lần đầu.' },
    { en: 'Using >= — equal elements then count as new assignments and "mixed" gives 3 instead of 2.', vi: 'Dùng >= — phần tử bằng nhau bị tính thêm phép gán, ca "lẫn lộn" ra 3 thay vì 2.' },
    { en: 'Starting currentMax at 0 — an all-negative array returns 0, which is not even in the array.', vi: 'Khởi tạo currentMax = 0 — mảng toàn số âm trả về 0, số không hề có trong mảng.' },
  ],
  giaiThich: { en: '<p>Comparisons are always n - 1 (Θ(n) in every case); assignments range from 1 (best case) to n (worst case). Either way the algorithm is O(n): the count of primitive operations is bounded by a constant times n.</p>', vi: '<p>Số so sánh luôn là n - 1 (Θ(n) mọi trường hợp); số phép gán từ 1 (tốt nhất) tới n (xấu nhất). Dù thế nào thuật toán vẫn O(n): số phép toán cơ bản bị chặn bởi một hằng số nhân n.</p>' },
});

const FRAG = `f1: for (long i = 0; i < n; i++) count++;
f2: for (long i = 0; i < n; i++) for (long j = 0; j < n; j++) count++;
f3: for (long i = 0; i < n; i++) for (long j = 0; j < i; j++) count++;
f4: for (long i = 1; i < n; i *= 2) count++;
f5: for (long i = 0; i < n; i++) for (long j = 1; j < n; j *= 2) count++;
f6: for (long i = 0; i < 100; i++) count++;
f7: for (long i = 0; i < n; i += 2) count++;`;

const de2 = deJava({
  id: 'csd201-0-3-loop-count-formula',
  tieuDe: { en: 'Count without counting: closed forms for seven loops', vi: 'Đếm mà không chạy vòng lặp: công thức đóng cho bảy đoạn code' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['counting loop iterations', 'arithmetic series n(n-1)/2', 'logarithmic loops', 'Big-O classes'],
  moTa: {
    en: `<p>Here are seven code fragments. For each one, how many times does ${c('count++')} run for input size ${c('n')}?</p>${pre(FRAG)}
<p>Complete ${c('long LoopCount.count(int f, long n)')} so that it returns the exact number for fragment ${c('f')} (1–7) — <b>without running the loops</b>. ${c('n')} goes up to 3,000,000,000, so f2 alone would need 9·10<sup>18</sup> steps: only a formula is fast enough. Then name the Big-O class in ${c('String bigO(int f)')} using exactly one of ${c('"O(1)"')}, ${c('"O(log n)"')}, ${c('"O(n)"')}, ${c('"O(n log n)"')}, ${c('"O(n^2)"')}.</p>
<p>Careful with f4 and f5: ${c('n')} is <b>not</b> always a power of two. For f4 the loop runs once for every power of two that is smaller than n.</p>`,
    vi: `<p>Có bảy đoạn code dưới đây. Với cỡ input ${c('n')}, lệnh ${c('count++')} chạy bao nhiêu lần?</p>${pre(FRAG)}
<p>Hoàn thiện ${c('long LoopCount.count(int f, long n)')} trả về đúng số lần của đoạn ${c('f')} (1–7) — <b>không chạy vòng lặp</b>. ${c('n')} lên tới 3.000.000.000, riêng f2 đã cần 9·10<sup>18</sup> bước: chỉ công thức mới đủ nhanh. Rồi gọi tên lớp Big-O trong ${c('String bigO(int f)')} bằng đúng một trong ${c('"O(1)"')}, ${c('"O(log n)"')}, ${c('"O(n)"')}, ${c('"O(n log n)"')}, ${c('"O(n^2)"')}.</p>
<p>Cẩn thận f4 và f5: ${c('n')} <b>không</b> phải lúc nào cũng là luỹ thừa của 2. Với f4, vòng lặp chạy một lần cho mỗi luỹ thừa của 2 nhỏ hơn n.</p>`,
  },
  yeuCau: { en: ['count(f, n) uses arithmetic only (no loop that runs n times); n ≥ 1.', 'bigO(f) returns one of the five strings exactly.'], vi: ['count(f, n) chỉ dùng phép tính (không có vòng lặp chạy n lần); n ≥ 1.', 'bigO(f) trả về đúng một trong năm chuỗi.'] },
  dauVao: { en: 'Lines "f n", or PERF.', vi: 'Các dòng "f n", hoặc PERF.' },
  dauRa: { en: 'The count and the Big-O class for each line.', vi: 'Số lần và lớp Big-O cho từng dòng.' },
  main: 'KiemTra',
  hen: { n: '3,000,000,000', ms: 3000, can: 'O(1) per call (a formula)', cham: 'loop-running', en: 'Running the loop itself would take hours for f2.', vi: 'Chạy thật vòng lặp f2 mất hàng giờ.' },
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            if (line.equals("PERF")) {
                final long[] sum = new long[1];
                System.out.println(Kiem.hen("7 fragments x 2000 values of n up to 3e9", 3000, new Runnable() {
                    public void run() {
                        long n = 3000000000L;
                        for (int k = 0; k < 2000; k++) {
                            for (int f = 1; f <= 7; f++) {
                                sum[0] += LoopCount.count(f, n - k * 1000003L);
                            }
                        }
                    }
                }));
                System.out.println("checksum " + sum[0]);
                continue;
            }
            String[] p = line.split("\\s+");
            int f = Integer.parseInt(p[0]);
            long n = Long.parseLong(p[1]);
            System.out.println("f" + f + " n=" + n + " count=" + LoopCount.count(f, n) + " " + LoopCount.bigO(f));
        }
    }
}
`,
  },
  tep: {
    'LoopCount.java': j`
public class LoopCount {

    // The exact number of times count++ runs in fragment f (1..7) for size n >= 1 — by formula, no loops.
    static long count(int f, long n) {
        //>> return 0; // TODO: one formula per fragment
        switch (f) {
            case 1:
                return n;
            case 2:
                return n * n;
            case 3:
                return n * (n - 1) / 2;
            case 4:
                return ceilLog2(n);
            case 5:
                return n * ceilLog2(n);
            case 6:
                return 100;
            default:
                return (n + 1) / 2;
        }
        //<<
    }

    //>> // TODO: helper(s) you need
    // number of powers of two 1, 2, 4, ... that are < n  ( = ceil(log2 n) for n >= 1 )
    static long ceilLog2(long n) {
        long k = 0;
        long p = 1;
        while (p < n) { // at most 32 turns for n <= 3e9 — this is O(log n), not O(n)
            p *= 2;
            k++;
        }
        return k;
    }
    //<<

    static String bigO(int f) {
        //>> return ""; // TODO
        switch (f) {
            case 4:
                return "O(log n)";
            case 5:
                return "O(n log n)";
            case 2:
            case 3:
                return "O(n^2)";
            case 6:
                return "O(1)";
            default:
                return "O(n)";
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'powers of two (the slide table: n = 8, 16, 32)', vi: 'luỹ thừa của 2 (bảng của slide: n = 8, 16, 32)' }, vao: '1 8\n2 8\n3 8\n4 8\n5 8\n6 8\n7 8\n4 16\n5 32\n3 32\n' },
    { ten: { en: 'n that are not powers of two, and n = 1', vi: 'n không phải luỹ thừa của 2, và n = 1' }, vao: '4 5\n4 1\n4 2\n5 5\n7 7\n3 1\n2 1\n6 1\n' },
    { ten: { en: 'huge n: only a formula answers', vi: 'n khổng lồ: chỉ công thức mới trả lời được' }, vao: '2 3000000000\n3 3000000000\n4 3000000000\n5 2147483648\n7 2999999999\n1 3000000000\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'f3: the inner loop runs 0 + 1 + 2 + … + (n-1) times — an arithmetic series. f7: i takes the values 0, 2, 4, … below n.', vi: 'f3: vòng trong chạy 0 + 1 + 2 + … + (n-1) lần — cấp số cộng. f7: i nhận các giá trị 0, 2, 4, … nhỏ hơn n.' },
    { en: 'f4: write a helper that counts how many of 1, 2, 4, 8, … are below n — that loop runs about 32 times, which is O(log n), not O(n). f5 = n × f4.', vi: 'f4: viết hàm phụ đếm có bao nhiêu số trong 1, 2, 4, 8, … nhỏ hơn n — vòng đó chạy khoảng 32 lần, là O(log n) chứ không phải O(n). f5 = n × f4.' },
  ],
  loiHayGap: [
    { en: 'n * n in int — 3e9 does not even fit in an int; keep everything in long.', vi: 'Tính n * n bằng int — 3e9 còn không vừa int; giữ mọi thứ ở kiểu long.' },
    { en: 'Using (int)(Math.log(n) / Math.log(2)) for f4: it gives floor, not "powers below n", and floating-point rounding is wrong near exact powers of two.', vi: 'Dùng (int)(Math.log(n) / Math.log(2)) cho f4: nó cho phần nguyên dưới, không phải "số luỹ thừa nhỏ hơn n", và làm tròn số thực sai quanh các luỹ thừa của 2.' },
    { en: 'f7 as n / 2 — for odd n the loop runs one more time (n = 7: i = 0, 2, 4, 6).', vi: 'f7 = n / 2 — n lẻ thì vòng lặp chạy thêm một lần (n = 7: i = 0, 2, 4, 6).' },
  ],
  giaiThich: { en: '<p>f1 = n, f2 = n², f3 = n(n−1)/2, f4 = ⌈log₂ n⌉, f5 = n·⌈log₂ n⌉, f6 = 100, f7 = ⌈n/2⌉. Dropping constants and lower-order terms gives the classes O(n), O(n²), O(n²), O(log n), O(n log n), O(1), O(n). The function itself is O(log n) at worst (the helper), which is why 14,000 calls with n = 3·10⁹ finish instantly.</p>', vi: '<p>f1 = n, f2 = n², f3 = n(n−1)/2, f4 = ⌈log₂ n⌉, f5 = n·⌈log₂ n⌉, f6 = 100, f7 = ⌈n/2⌉. Bỏ hằng số và số hạng bậc thấp được các lớp O(n), O(n²), O(n²), O(log n), O(n log n), O(1), O(n). Bản thân hàm chỉ O(log n) (hàm phụ), nên 14.000 lần gọi với n = 3·10⁹ xong tức thì.</p>' },
});

const de3 = deJava({
  id: 'csd201-0-3-binary-search-probes',
  tieuDe: { en: 'Linear vs binary search: count the probes, then search a million times', vi: 'Tìm tuần tự vs nhị phân: đếm số lần dò, rồi tìm một triệu lần' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['binary search', 'O(log n) vs O(n)', 'mid without overflow', 'worst case floor(log2 n) + 1'],
  moTa: {
    en: `<p>The starter ${c('Search.find(int[] a, int key)')} is a working <b>linear</b> search. Replace it with a <b>binary</b> search on the sorted array ${c('a')} (ascending, no duplicates): return the index of ${c('key')} or −1, and add 1 to the static counter ${c('probes')} every time you compare ${c('key')} with ${c('a[mid]')} (one probe per loop turn, whatever the outcome).</p>
<p>The grader checks the index, the number of probes (worst case = ⌊log₂ n⌋ + 1) and then runs two million searches on a two-million-element array.</p>`,
    vi: `<p>Hàm khởi đầu ${c('Search.find(int[] a, int key)')} là tìm <b>tuần tự</b> chạy đúng. Thay bằng tìm <b>nhị phân</b> trên mảng đã sắp ${c('a')} (tăng dần, không trùng): trả về chỉ số của ${c('key')} hoặc −1, và cộng 1 vào bộ đếm static ${c('probes')} mỗi lần so ${c('key')} với ${c('a[mid]')} (mỗi vòng lặp một lần dò, kết quả thế nào cũng vậy).</p>
<p>Máy chấm kiểm chỉ số, số lần dò (xấu nhất = ⌊log₂ n⌋ + 1) rồi chạy hai triệu lần tìm trên mảng hai triệu phần tử.</p>`,
  },
  yeuCau: { en: ['Iterative binary search; mid = left + (right - left) / 2.', 'Do not reset probes inside find — the grader resets it before each search.'], vi: ['Tìm nhị phân bằng vòng lặp; mid = left + (right - left) / 2.', 'Không đặt lại probes trong find — máy chấm tự đặt lại trước mỗi lần tìm.'] },
  dauVao: { en: 'A line "n" builds a = 0, 2, 4, …, 2(n-1); then keys to search; PERF runs the big test.', vi: 'Dòng "n" dựng a = 0, 2, 4, …, 2(n-1); sau đó là các khoá cần tìm; PERF chạy phép thử lớn.' },
  dauRa: { en: 'Index and probes for every key.', vi: 'Chỉ số và số lần dò cho mỗi khoá.' },
  main: 'KiemTra',
  hen: { n: '2,000,000 searches in 2,000,000 elements', ms: 4000, can: 'O(log n) per search', cham: 'O(n)', en: 'Linear search would need about 2·10¹² comparisons.', vi: 'Tìm tuần tự cần khoảng 2·10¹² phép so sánh.' },
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] a = new int[0];
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            if (line.equals("PERF")) {
                final int n = 2000000;
                final int[] big = new int[n];
                for (int i = 0; i < n; i++) {
                    big[i] = 2 * i;
                }
                final long[] found = new long[1];
                System.out.println(Kiem.hen("2,000,000 searches, n = 2,000,000", 4000, new Runnable() {
                    public void run() {
                        int[] keys = Kiem.ngauNhien(n, 2 * n, 7);
                        for (int k : keys) {
                            if (Search.find(big, k) >= 0) {
                                found[0]++;
                            }
                        }
                    }
                }));
                System.out.println("found " + found[0]);
                continue;
            }
            String[] p = line.split("\\s+");
            if (p[0].equals("n")) {
                int n = Integer.parseInt(p[1]);
                a = new int[n];
                for (int i = 0; i < n; i++) {
                    a[i] = 2 * i;
                }
                System.out.println("array of " + n + " even numbers 0.." + (2 * n - 2));
                continue;
            }
            for (String k : p) {
                Search.probes = 0;
                int r = Search.find(a, Integer.parseInt(k));
                System.out.println("find " + k + " -> " + r + " (" + Search.probes + " probes)");
            }
        }
    }
}
`,
  },
  tep: {
    'Search.java': j`
public class Search {
    static long probes;

    // Index of key in the sorted array a, or -1. One probe = one comparison of key with an element.
    static int find(int[] a, int key) {
        //>> for (int i = 0; i < a.length; i++) { // TODO: replace this linear search by a binary search ⏎     probes++; ⏎     if (a[i] == key) { ⏎         return i; ⏎     } ⏎ } ⏎ return -1;
        int left = 0;
        int right = a.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            probes++;
            if (a[mid] == key) {
                return mid;
            }
            if (key > a[mid]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'n = 8: present, missing, below and above every element', vi: 'n = 8: có, không có, nhỏ hơn và lớn hơn mọi phần tử' }, vao: 'n 8\n0 6 14 7 -1 16\n' },
    { ten: { en: 'n = 1024: worst case is 11 probes', vi: 'n = 1024: xấu nhất 11 lần dò' }, vao: 'n 1024\n2048 0 1022 2046 1023\nn 1\n0 5\nn 0\n3\n' },
    { ten: { en: 'n = 1,000,000 and odd sizes', vi: 'n = 1.000.000 và cỡ lẻ' }, vao: 'n 1000000\n2000000 0 1999998 999999 777776\nn 7\n12 13 0\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Keep two indexes left and right around the part that can still contain key; each probe throws away half of it.', vi: 'Giữ hai chỉ số left, right bao phần còn có thể chứa key; mỗi lần dò bỏ đi một nửa.' },
    { en: 'Loop while left <= right; after comparing with a[mid], move left = mid + 1 or right = mid - 1 — never left = mid (endless loop).', vi: 'Lặp khi left <= right; sau khi so với a[mid] thì dời left = mid + 1 hoặc right = mid - 1 — đừng left = mid (lặp vô tận).' },
  ],
  loiHayGap: [
    { en: 'while (left < right) — a one-element range is never checked, so the last candidate is reported missing.', vi: 'while (left < right) — đoạn còn một phần tử không được xét, nên phần tử cuối cùng bị báo là không có.' },
    { en: 'Counting two probes per turn (one for ==, one for >) — the probe is the visit to a[mid], count it once.', vi: 'Đếm hai lần dò mỗi vòng (một cho ==, một cho >) — lần dò là lần ghé a[mid], đếm một lần.' },
    { en: 'mid = (left + right) / 2 overflows when left + right > 2^31 - 1 on huge arrays; left + (right - left) / 2 never does.', vi: 'mid = (left + right) / 2 tràn số khi left + right > 2^31 - 1 trên mảng rất lớn; left + (right - left) / 2 thì không.' },
  ],
  giaiThich: { en: '<p>Every probe halves the range, so after k probes at most n/2^k candidates remain: the worst case is ⌊log₂ n⌋ + 1 probes (11 for n = 1,024, 21 for n = 10⁶). Two million searches cost about 4·10⁷ probes — milliseconds — while linear search would cost about 2·10¹².</p>', vi: '<p>Mỗi lần dò chia đôi đoạn tìm, nên sau k lần dò còn tối đa n/2^k ứng viên: xấu nhất ⌊log₂ n⌋ + 1 lần dò (11 với n = 1.024, 21 với n = 10⁶). Hai triệu lần tìm tốn khoảng 4·10⁷ lần dò — vài mili giây — trong khi tìm tuần tự cần khoảng 2·10¹².</p>' },
});

export default moDun({ slug: 'csd201-big-o', ten: '0.3 Big-O: the language of efficiency', de: [de1, de2, de3] });
