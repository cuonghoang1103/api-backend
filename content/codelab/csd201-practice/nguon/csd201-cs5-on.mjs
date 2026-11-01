/** CSD201 · ⭐ CS.5 — tham lam + chia để trị kiểu phỏng vấn (gen/java/cs5/Ex*): bỏ ít khoảng nhất, bắn bóng (bẫy so sánh bằng phép trừ), ghép số lớn nhất (khoá a+b), chia kẹo hai lượt, phần tử lớn thứ k (quickselect 3 ngả), đếm cặp đảo a[i] > 2·a[j] (trộn). */
import { moDun, c, j } from './_chung.mjs';
import { deCs } from './_cs.mjs';

const KHOANG = `
    static int[][] pairs(String[] p, int from) {
        int[][] a = new int[p.length - from][];
        for (int i = from; i < p.length; i++) {
            a[i - from] = arr(p[i]);
        }
        return a;
    }
`;

const de1 = deCs({
  id: 'csd201-cs5-non-overlap',
  tieuDe: { en: 'Remove the fewest intervals so that the rest do not overlap — greedy by END', vi: 'Bỏ ít khoảng nhất để phần còn lại không chồng nhau — tham lam theo ĐIỂM KẾT THÚC' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['activity selection', 'sort by end, keep what fits', 'exchange argument'],
  moTa: {
    en: `<p>Intervals are half-open ${c('[s, e)')}, so ${c('[1,2)')} and ${c('[2,3)')} do not overlap. Complete ${c('static int eraseOverlap(int[][] in)')}: the fewest intervals to remove so that the remaining ones are pairwise disjoint. Do not reorder the caller’s array.</p>
<p>Keep as many as possible = activity selection: sort by <b>end</b>, walk through and keep an interval whenever it starts at or after the end of the last kept one. Answer = n − kept. Sorting by start (or by length) fails. The complexity check has 200,000 intervals.</p>`,
    vi: `<p>Các khoảng là nửa mở ${c('[s, e)')}, nên ${c('[1,2)')} và ${c('[2,3)')} không chồng nhau. Hoàn thiện ${c('eraseOverlap(in)')}: số khoảng ít nhất cần bỏ để những khoảng còn lại đôi một rời nhau. Không đổi thứ tự mảng của nơi gọi.</p>
<p>Giữ được nhiều nhất = chọn hoạt động: sắp theo <b>điểm kết thúc</b>, duyệt và giữ một khoảng mỗi khi nó bắt đầu từ điểm kết thúc của khoảng vừa giữ trở đi. Đáp án = n − số giữ. Sắp theo điểm đầu (hay theo độ dài) là sai. Kiểm độ phức tạp có 200.000 khoảng.</p>`,
  },
  hen: { n: '200,000 intervals', ms: 3000, can: 'O(n log n)', cham: 'O(n²) or exponential' },
  dauVao: { en: 'RUN s,e s,e … · RANDOM · PERF.', vi: 'RUN s,e s,e … · RANDOM · PERF.' },
  them: KHOANG + `
    static int brute(int[][] a) {
        int n = a.length, best = n;
        for (int m = 0; m < (1 << n); m++) {
            boolean ok = true;
            for (int i = 0; i < n; i++) {
                for (int jj = i + 1; jj < n; jj++) {
                    if ((m >> i & 1) == 1 && (m >> jj & 1) == 1 && a[i][0] < a[jj][1] && a[jj][0] < a[i][1]) {
                        ok = false;
                    }
                }
            }
            if (ok) {
                best = Math.min(best, n - Integer.bitCount(m));
            }
        }
        return best;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    int[][] a = pairs(p, 1);
                    String before = Arrays.deepToString(a);
                    r = NonOverlap.eraseOverlap(a) + (Arrays.deepToString(a).equals(before) ? "" : " (in WAS REORDERED)");
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(61);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        int[][] a = new int[rnd.nextInt(10)][];
                        for (int i = 0; i < a.length; i++) {
                            int s = rnd.nextInt(12);
                            a[i] = new int[] {s, s + 1 + rnd.nextInt(5)};
                        }
                        int got = NonOverlap.eraseOverlap(a.clone()), want = brute(a);
                        if (got != want) {
                            sai = Arrays.deepToString(a) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random interval sets", 3000, sai);
                } else {
                    final int[][] a = new int[200000][];
                    Random rnd = new Random(63);
                    for (int i = 0; i < a.length; i++) {
                        int s = rnd.nextInt(10000000);
                        a[i] = new int[] {s, s + 1 + rnd.nextInt(200)};
                    }
                    final int[] got = new int[1];
                    r = Kiem.hen("200,000 intervals", 3000, new Runnable() {
                        public void run() {
                            got[0] = NonOverlap.eraseOverlap(a);
                        }
                    }) + ", removed " + got[0];
                }`,
  tep: {
    'NonOverlap.java': j`
import java.util.Arrays;
import java.util.Comparator;

public class NonOverlap {

    public static int eraseOverlap(int[][] in) {
        //>> return 0; // TODO
        int[][] a = in.clone();
        Arrays.sort(a, new Comparator<int[]>() {
            public int compare(int[] x, int[] y) {
                return Integer.compare(x[1], y[1]); // by END
            }
        });
        int keep = 0;
        long lastEnd = Long.MIN_VALUE;
        for (int[] x : a) {
            if (x[0] >= lastEnd) { // [s, e) may touch the previous one
                keep++;
                lastEnd = x[1];
            }
        }
        return a.length - keep;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 1,2 2,3 3,4 1,3\nRUN 1,2 1,2 1,2\nRUN 1,2 2,3\nRUN\nRUN 1,10 2,3 4,5 6,7\n' },
    { ten: { en: '3000 random interval sets', vi: '3000 tập khoảng ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Exchange argument: the interval that ends first can replace the first interval of any optimal set.', vi: 'Lập luận đổi chỗ: khoảng kết thúc sớm nhất có thể thay khoảng đầu của mọi tập tối ưu.' },
    { en: 'Sort a clone (in.clone()) with Integer.compare — never with x[1] − y[1].', vi: 'Sắp một bản sao (in.clone()) bằng Integer.compare — không bao giờ dùng x[1] − y[1].' },
  ],
  loiHayGap: [
    { en: 'Sorting by start — [1,10) [2,3) [4,5) keeps the long one and removes two.', vi: 'Sắp theo điểm đầu — [1,10) [2,3) [4,5) giữ khoảng dài và bỏ hai khoảng.' },
    { en: 'x[0] > lastEnd — touching intervals are treated as overlapping.', vi: 'x[0] > lastEnd — các khoảng chạm nhau bị coi là chồng nhau.' },
  ],
  giaiThich: { en: '<p>Ending first leaves the most room for the rest, and the exchange argument turns any optimal set into the greedy one without losing size. Sorting dominates: O(n log n).</p>', vi: '<p>Kết thúc sớm nhất để lại nhiều chỗ nhất cho phần còn lại, và lập luận đổi chỗ biến mọi tập tối ưu thành tập tham lam mà không mất phần tử nào. Phép sắp chiếm ưu thế: O(n log n).</p>' },
});

const de2 = deCs({
  id: 'csd201-cs5-arrows',
  tieuDe: { en: 'Fewest arrows to burst all balloons — and the subtraction-comparator trap', vi: 'Ít mũi tên nhất để bắn vỡ mọi quả bóng — và bẫy so sánh bằng phép trừ' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['shoot at the END of the first unburst balloon', 'closed intervals', 'Integer.compare instead of x − y'],
  moTa: {
    en: `<p>Balloon ${c('[s, e]')} (closed, values anywhere in the int range) bursts when an arrow is shot at any x with s ≤ x ≤ e. Complete ${c('static int arrows(int[][] b)')}: the fewest arrows that burst every balloon. Do not reorder the caller’s array.</p>
<p>Sort by end; shoot at the end of the first balloon not burst yet, which bursts every balloon starting at or before that point. The trap: a comparator ${c('(x, y) -> x[1] − y[1]')} overflows for ends like −2³¹ and 2³¹ − 1 and sorts wrongly — use ${c('Integer.compare')}.</p>`,
    vi: `<p>Quả bóng ${c('[s, e]')} (đoạn đóng, giá trị bất kỳ trong miền int) vỡ khi một mũi tên bắn vào x bất kỳ có s ≤ x ≤ e. Hoàn thiện ${c('arrows(b)')}: số mũi tên ít nhất để bắn vỡ mọi quả bóng. Không đổi thứ tự mảng của nơi gọi.</p>
<p>Sắp theo điểm cuối; bắn vào điểm cuối của quả đầu tiên chưa vỡ, phát đó làm vỡ mọi quả bắt đầu từ điểm ấy trở về trước. Bẫy: bộ so sánh ${c('(x, y) -> x[1] − y[1]')} tràn số với điểm cuối như −2³¹ và 2³¹ − 1 và sắp sai — dùng ${c('Integer.compare')}.</p>`,
  },
  hen: { n: '200,000 balloons', ms: 3000, can: 'O(n log n)', cham: 'O(n²) or exponential' },
  dauVao: { en: 'RUN s,e s,e … · RANDOM · PERF.', vi: 'RUN s,e s,e … · RANDOM · PERF.' },
  them: KHOANG + `
    static int brute(int[][] a) {
        int n = a.length, best = n;
        for (int m = 0; m < (1 << n); m++) {
            boolean all = true;
            for (int[] b : a) {
                boolean hit = false;
                for (int i = 0; i < n; i++) {
                    if ((m >> i & 1) == 1 && b[0] <= a[i][1] && a[i][1] <= b[1]) {
                        hit = true;
                    }
                }
                if (!hit) {
                    all = false;
                }
            }
            if (all) {
                best = Math.min(best, Integer.bitCount(m));
            }
        }
        return best;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    int[][] a = pairs(p, 1);
                    String before = Arrays.deepToString(a);
                    r = Arrows.arrows(a) + (Arrays.deepToString(a).equals(before) ? "" : " (b WAS REORDERED)");
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(65);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        int[][] a = new int[rnd.nextInt(9)][];
                        for (int i = 0; i < a.length; i++) {
                            int s = t % 3 == 0 ? Integer.MIN_VALUE + rnd.nextInt(5) + (rnd.nextBoolean() ? 0 : Integer.MAX_VALUE - 3) : rnd.nextInt(12);
                            a[i] = new int[] {s, (int) Math.min(Integer.MAX_VALUE, (long) s + rnd.nextInt(4))};
                        }
                        int got = Arrows.arrows(a.clone()), want = brute(a);
                        if (got != want) {
                            sai = Arrays.deepToString(a) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random sets (a third near the int limits)", 3000, sai);
                } else {
                    final int[][] a = new int[200000][];
                    Random rnd = new Random(67);
                    for (int i = 0; i < a.length; i++) {
                        int s = rnd.nextInt(100000000);
                        a[i] = new int[] {s, s + rnd.nextInt(1000)};
                    }
                    final int[] got = new int[1];
                    r = Kiem.hen("200,000 balloons", 3000, new Runnable() {
                        public void run() {
                            got[0] = Arrows.arrows(a);
                        }
                    }) + ", arrows " + got[0];
                }`,
  tep: {
    'Arrows.java': j`
import java.util.Arrays;
import java.util.Comparator;

public class Arrows {

    public static int arrows(int[][] b) {
        //>> return b.length; // TODO
        int[][] a = b.clone();
        Arrays.sort(a, new Comparator<int[]>() {
            public int compare(int[] x, int[] y) {
                return Integer.compare(x[1], y[1]); // x[1] - y[1] overflows for big values
            }
        });
        int count = 0;
        long arrow = Long.MIN_VALUE; // long: no balloon starts below it
        for (int[] x : a) {
            if (x[0] > arrow) { // not burst yet: shoot at its END
                count++;
                arrow = x[1];
            }
        }
        return count;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples and the int extremes', vi: 'ví dụ và các cực trị int' }, vao: 'RUN 10,16 2,8 1,6 7,12\nRUN -2147483646,-2147483645 2147483646,2147483647\nRUN\nRUN 3,3\nRUN 1,2 2,3\nRUN 1,2 3,4 5,6 7,8\n' },
    { ten: { en: '3000 random sets', vi: '3000 tập ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Start "the last arrow" below every possible start: Long.MIN_VALUE (an int MIN would equal a balloon starting at −2³¹).', vi: 'Khởi đầu "mũi tên cuối" thấp hơn mọi điểm đầu: Long.MIN_VALUE (int MIN sẽ bằng quả bóng bắt đầu ở −2³¹).' },
    { en: 'Closed intervals: a balloon starting exactly at the arrow is burst (x[0] > arrow means not burst).', vi: 'Đoạn đóng: quả bóng bắt đầu đúng tại mũi tên thì vỡ (x[0] > arrow nghĩa là chưa vỡ).' },
  ],
  loiHayGap: [
    { en: 'Comparator x[1] − y[1]: −2147483645 − 2147483647 overflows to a positive number.', vi: 'Bộ so sánh x[1] − y[1]: −2147483645 − 2147483647 tràn thành số dương.' },
    { en: 'Shooting at the start of a balloon — later balloons that overlap only its end are missed.', vi: 'Bắn vào điểm đầu quả bóng — bỏ sót những quả sau chỉ chồng lên phần cuối của nó.' },
  ],
  giaiThich: { en: '<p>Same greedy as activity selection: the arrow at the earliest end is never worse than any other choice for the balloon that ends first. O(n log n). The overflow trap is real: a subtraction comparator silently breaks the ordering contract and Arrays.sort may even throw "Comparison method violates its general contract".</p>', vi: '<p>Cùng kiểu tham lam như chọn hoạt động: mũi tên ở điểm cuối sớm nhất không bao giờ tệ hơn lựa chọn khác cho quả bóng kết thúc sớm nhất. O(n log n). Bẫy tràn số là thật: bộ so sánh bằng phép trừ âm thầm phá hợp đồng thứ tự và Arrays.sort thậm chí có thể ném "Comparison method violates its general contract".</p>' },
});

const de3 = deCs({
  id: 'csd201-cs5-largest-number',
  tieuDe: { en: 'Arrange numbers to form the largest number — the comparator a + b vs b + a', vi: 'Xếp các số thành số lớn nhất — bộ so sánh a + b với b + a' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['custom order: a before b when a+b > b+a', 'the order is transitive', 'all zeros → "0"'],
  moTa: {
    en: `<p>Complete ${c('static String largest(int[] nums)')} (non-negative ints): concatenate all numbers in the order that gives the largest number, as a string. Examples: ${c('{3,30,34,5,9}')} → 9534330; ${c('{10,2}')} → 210; ${c('{121,12}')} → 12121; ${c('{0,0}')} → 0.</p>
<p>Plain string order puts "30" before "3" and gives 9534303. The right rule: put a before b when the string ${c('a + b')} is greater than ${c('b + a')}. If the result starts with 0, every number is 0 — return "0". The complexity check concatenates 100,000 numbers (use a StringBuilder).</p>`,
    vi: `<p>Hoàn thiện ${c('largest(nums)')} (số nguyên không âm): ghép mọi số theo thứ tự cho số lớn nhất, trả về dạng xâu. Ví dụ: ${c('{3,30,34,5,9}')} → 9534330; ${c('{10,2}')} → 210; ${c('{121,12}')} → 12121; ${c('{0,0}')} → 0.</p>
<p>Thứ tự xâu thông thường đặt "30" trước "3" và ra 9534303. Luật đúng: đặt a trước b khi xâu ${c('a + b')} lớn hơn ${c('b + a')}. Nếu kết quả bắt đầu bằng 0 thì mọi số đều là 0 — trả "0". Kiểm độ phức tạp ghép 100.000 số (dùng StringBuilder).</p>`,
  },
  hen: { n: '100,000 numbers', ms: 3000, can: 'O(n log n · L)', cham: 'trying every order, or string += in a loop' },
  them: `
    static String best;

    static void perm(String[] s, int k) {
        if (k == s.length) {
            StringBuilder sb = new StringBuilder();
            for (String x : s) {
                sb.append(x);
            }
            String v = sb.toString();
            if (best == null || v.compareTo(best) > 0) {
                best = v;
            }
            return;
        }
        for (int i = k; i < s.length; i++) {
            String t = s[k];
            s[k] = s[i];
            s[i] = t;
            perm(s, k + 1);
            t = s[k];
            s[k] = s[i];
            s[i] = t;
        }
    }

    static String brute(int[] nums) {
        String[] s = new String[nums.length];
        for (int i = 0; i < s.length; i++) {
            s[i] = String.valueOf(nums[i]);
        }
        best = null;
        perm(s, 0);
        return best.charAt(0) == '0' ? "0" : best;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = LargestNumber.largest(arr(p[1]));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(69);
                    String sai = null;
                    int[] pool = {0, 1, 3, 9, 10, 12, 30, 34, 121, 5, 50, 505, 8, 89, 898, 0};
                    for (int t = 0; t < 2000 && sai == null; t++) {
                        int[] a = new int[1 + rnd.nextInt(6)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = t % 2 == 0 ? pool[rnd.nextInt(pool.length)] : rnd.nextInt(t % 4 == 1 ? 3 : 1000);
                        }
                        String got = LargestNumber.largest(a.clone()), want = brute(a);
                        if (!want.equals(got)) {
                            sai = str(a) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("2000 random arrays (zeros, prefixes) vs every order", 2000, sai);
                } else {
                    final int[] a = new int[100000];
                    Random rnd = new Random(71);
                    for (int i = 0; i < a.length; i++) {
                        a[i] = rnd.nextInt(1000000);
                    }
                    final String[] got = new String[1];
                    r = Kiem.hen("100,000 numbers", 3000, new Runnable() {
                        public void run() {
                            got[0] = LargestNumber.largest(a);
                        }
                    }) + (got[0] == null ? "" : ", length " + got[0].length() + ", starts " + got[0].substring(0, 20) + ", hash " + got[0].hashCode());
                }`,
  tep: {
    'LargestNumber.java': j`
import java.util.Arrays;
import java.util.Comparator;

public class LargestNumber {

    public static String largest(int[] nums) {
        //>> return ""; // TODO
        String[] s = new String[nums.length];
        for (int i = 0; i < s.length; i++) {
            s[i] = String.valueOf(nums[i]);
        }
        Arrays.sort(s, new Comparator<String>() {
            public int compare(String a, String b) {
                return (b + a).compareTo(a + b); // a first when a+b is larger
            }
        });
        StringBuilder sb = new StringBuilder();
        for (String x : s) {
            sb.append(x);
        }
        return sb.length() > 0 && sb.charAt(0) == '0' ? "0" : sb.toString(); // {0, 0} -> "0"
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 3,30,34,5,9\nRUN 10,2\nRUN 121,12\nRUN 0,0\nRUN 0\nRUN 8,89,898\n' },
    { ten: { en: '2000 random arrays', vi: '2000 mảng ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'a + b and b + a have the same length, so comparing them as strings compares them as numbers.', vi: 'a + b và b + a dài bằng nhau, nên so như xâu cũng là so như số.' },
    { en: 'Sort String[] with a Comparator<String>; a lambda (a, b) -> (b + a).compareTo(a + b) is fine in Java 8.', vi: 'Sắp String[] bằng Comparator<String>; lambda (a, b) -> (b + a).compareTo(a + b) dùng được trong Java 8.' },
  ],
  loiHayGap: [
    { en: 'Collections.reverseOrder() on the strings — "30" > "3", so 30 comes first: 9534303.', vi: 'Collections.reverseOrder() trên các xâu — "30" > "3", nên 30 đứng trước: 9534303.' },
    { en: 'Returning "00" for {0, 0}.', vi: 'Trả "00" với {0, 0}.' },
  ],
  giaiThich: { en: '<p>If a+b ≥ b+a for neighbours everywhere, no swap of two adjacent numbers can increase the result, and the relation is transitive (it compares a·10^|b| + b with b·10^|a| + a), so sorting with it is valid. O(n log n) comparisons of short strings.</p>', vi: '<p>Nếu a+b ≥ b+a với mọi cặp kề nhau thì không phép đổi hai số kề nào làm kết quả lớn hơn, và quan hệ này có tính bắc cầu (nó so a·10^|b| + b với b·10^|a| + a), nên sắp xếp theo nó là hợp lệ. O(n log n) phép so xâu ngắn.</p>' },
});

const de4 = deCs({
  id: 'csd201-cs5-candy',
  tieuDe: { en: 'Candy: two greedy passes (left rule, then right rule)', vi: 'Chia kẹo: hai lượt tham lam (luật trái, rồi luật phải)' },
  doKho: 'HARD', phut: 25,
  khaiNiem: ['satisfy one side per pass', 'max keeps the left rule', 'O(n), not "repeat until stable"'],
  moTa: {
    en: `<p>Children stand in a row with ratings ${c('r[i]')}. Everyone gets at least 1 candy, and a child with a <b>higher</b> rating than a neighbour gets more candies than that neighbour (equal ratings: no rule). Complete ${c('static long candy(int[] r)')}: the smallest total. Examples: ${c('{1,0,2}')} → 5, ${c('{1,2,2}')} → 4, ${c('{1,3,4,5,2}')} → 11.</p>
<p>Pass 1 left → right: if r[i] > r[i−1], c[i] = c[i−1] + 1. Pass 2 right → left: if r[i] > r[i+1], c[i] = max(c[i], c[i+1] + 1) — the max keeps what pass 1 established. Fixing violations again and again until nothing changes is O(n²) on a long descending run; the complexity check has 1,000,000 children.</p>`,
    vi: `<p>Các em đứng thành hàng với điểm ${c('r[i]')}. Ai cũng ít nhất 1 cái kẹo, và em có điểm <b>cao hơn</b> bạn đứng cạnh thì được nhiều kẹo hơn bạn đó (điểm bằng nhau: không có luật). Hoàn thiện ${c('candy(r)')}: tổng nhỏ nhất. Ví dụ: ${c('{1,0,2}')} → 5, ${c('{1,2,2}')} → 4, ${c('{1,3,4,5,2}')} → 11.</p>
<p>Lượt 1 trái → phải: nếu r[i] > r[i−1] thì c[i] = c[i−1] + 1. Lượt 2 phải → trái: nếu r[i] > r[i+1] thì c[i] = max(c[i], c[i+1] + 1) — max giữ lại điều lượt 1 đã lập. Sửa vi phạm lặp đi lặp lại tới khi không đổi là O(n²) trên một dãy giảm dài; kiểm độ phức tạp có 1.000.000 em.</p>`,
  },
  hen: { n: '1,000,000 children', ms: 3000, can: 'O(n)', cham: 'O(n²) (repeating until stable)' },
  them: `
    static long best;

    static void brute(int[] r, int[] cc, int i) {
        int n = r.length;
        if (i == n) {
            for (int k = 0; k + 1 < n; k++) {
                if (r[k] > r[k + 1] && cc[k] <= cc[k + 1]) {
                    return;
                }
                if (r[k + 1] > r[k] && cc[k + 1] <= cc[k]) {
                    return;
                }
            }
            long s = 0;
            for (int x : cc) {
                s += x;
            }
            best = Math.min(best, s);
            return;
        }
        for (int v = 1; v <= n; v++) {
            cc[i] = v;
            brute(r, cc, i + 1);
        }
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Candy.candy(arr(p[1])));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(73);
                    String sai = null;
                    for (int t = 0; t < 600 && sai == null; t++) {
                        int[] a = new int[rnd.nextInt(7)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = rnd.nextInt(5) - 2;
                        }
                        best = a.length == 0 ? 0 : Long.MAX_VALUE;
                        brute(a, new int[a.length], 0);
                        long got = Candy.candy(a.clone());
                        if (got != best) {
                            sai = str(a) + " -> " + got + ", expected " + best;
                        }
                    }
                    r = ketQua("600 random ratings (ties, negatives) vs every assignment", 600, sai);
                } else {
                    final int[] a = new int[1000000];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = i < 500000 ? a.length - i : (i % 3 == 0 ? 7 : i);
                    }
                    final long[] got = new long[1];
                    r = Kiem.hen("1,000,000 children (a descending run of 500,000)", 3000, new Runnable() {
                        public void run() {
                            got[0] = Candy.candy(a);
                        }
                    }) + ", candies " + got[0];
                }`,
  tep: {
    'Candy.java': j`
public class Candy {

    public static long candy(int[] r) {
        //>> return r.length; // TODO
        int n = r.length;
        long[] c = new long[n];
        for (int i = 0; i < n; i++) {
            c[i] = 1;
        }
        for (int i = 1; i < n; i++) { // left rule
            if (r[i] > r[i - 1]) {
                c[i] = c[i - 1] + 1;
            }
        }
        for (int i = n - 2; i >= 0; i--) { // right rule, keeping the left one
            if (r[i] > r[i + 1]) {
                c[i] = Math.max(c[i], c[i + 1] + 1);
            }
        }
        long s = 0;
        for (long x : c) {
            s += x;
        }
        return s;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 1,0,2\nRUN 1,2,2\nRUN 1,3,4,5,2\nRUN -\nRUN 5,4,3,2,1\nRUN 2,2,2\n' },
    { ten: { en: '600 random ratings', vi: '600 dãy điểm ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'After pass 1 every "left neighbour" rule holds; pass 2 fixes the right rules without breaking them, thanks to the max.', vi: 'Sau lượt 1 mọi luật "bạn bên trái" đều đúng; lượt 2 sửa các luật bên phải mà không phá chúng, nhờ max.' },
    { en: 'The total can exceed an int: a descending run of 500,000 alone needs about 1.25·10¹¹ candies.', vi: 'Tổng có thể vượt int: riêng một dãy giảm 500.000 em đã cần khoảng 1,25·10¹¹ cái kẹo.' },
  ],
  loiHayGap: [
    { en: 'Pass 2 assigning c[i] = c[i+1] + 1 without the max — a peak loses its left-side requirement.', vi: 'Lượt 2 gán c[i] = c[i+1] + 1 không có max — một đỉnh mất yêu cầu phía trái.' },
    { en: 'Giving more candy for EQUAL ratings — {1,2,2} needs only 4.', vi: 'Cho thêm kẹo khi điểm BẰNG nhau — {1,2,2} chỉ cần 4.' },
  ],
  giaiThich: { en: '<p>Every child’s count is the longer of its increasing run from the left and its decreasing run to the right — exactly what the two passes compute. Two linear scans, O(n).</p>', vi: '<p>Số kẹo của mỗi em là độ dài lớn hơn giữa dãy tăng tính từ trái và dãy giảm tính về phải — đúng thứ hai lượt quét tính ra. Hai lượt tuyến tính, O(n).</p>' },
});

const de5 = deCs({
  id: 'csd201-cs5-kth-largest',
  tieuDe: { en: 'The k-th largest element — quickselect with a 3-way partition', vi: 'Phần tử lớn thứ k — quickselect với phân hoạch ba ngả' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['quickselect: recurse into one side only', 'random pivot', '3-way partition for duplicates'],
  moTa: {
    en: `<p>Complete ${c('static int kthLargest(int[] a, int k)')} (1 ≤ k ≤ n): the k-th largest value (duplicates count separately: in ${c('{3,2,3,1,2,4,5,5,6}')} the 4th largest is 4). Do not modify ${c('a')}.</p>
<p>Required: <b>expected O(n)</b>. Sorting is O(n log n) and fails the complexity check (300 queries on 300,000 elements). Quickselect: pick a random pivot, partition into &lt; p, = p, &gt; p (Dutch flag), and continue only in the part that contains index n − k. A 2-way (Lomuto) partition is O(n²) on 300,000 <b>equal</b> values — also in the check.</p>`,
    vi: `<p>Hoàn thiện ${c('kthLargest(a, k)')} (1 ≤ k ≤ n): giá trị lớn thứ k (phần tử trùng đếm riêng: trong ${c('{3,2,3,1,2,4,5,5,6}')} giá trị lớn thứ 4 là 4). Không sửa ${c('a')}.</p>
<p>Yêu cầu: <b>kỳ vọng O(n)</b>. Sắp xếp là O(n log n) và trượt kiểm độ phức tạp (300 truy vấn trên 300.000 phần tử). Quickselect: chọn chốt ngẫu nhiên, phân hoạch thành &lt; p, = p, &gt; p (cờ Hà Lan), và chỉ đi tiếp vào phần chứa chỉ số n − k. Phân hoạch hai ngả (Lomuto) là O(n²) trên 300.000 giá trị <b>bằng nhau</b> — cũng có trong phép kiểm.</p>`,
  },
  hen: { n: '300 queries × 300,000 elements, plus 300,000 equal values', ms: 4000, can: 'O(n) expected per query', cham: 'O(n log n) (sorting) or O(n²) (2-way partition on equal values)' },
  dauVao: { en: 'RUN array k · RANDOM · PERF.', vi: 'RUN mảng k · RANDOM · PERF.' },
  them: '',
  lenh: `                if (p[0].equals("RUN")) {
                    int[] a = arr(p[1]);
                    String before = str(a);
                    r = KthLargest.kthLargest(a, n(2)) + (str(a).equals(before) ? "" : " (a WAS MODIFIED)");
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(75);
                    String sai = null;
                    for (int t = 0; t < 5000 && sai == null; t++) {
                        int[] a = new int[1 + rnd.nextInt(12)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = rnd.nextInt(9) - 4;
                        }
                        int k = 1 + rnd.nextInt(a.length);
                        int[] s = a.clone();
                        Arrays.sort(s);
                        int got = KthLargest.kthLargest(a.clone(), k), want = s[s.length - k];
                        if (got != want) {
                            sai = str(a) + " k=" + k + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("5000 random arrays (duplicates, negatives) vs sorting", 5000, sai);
                } else {
                    final int[] a = new int[300000], eq = new int[300000];
                    Random rnd = new Random(77);
                    for (int i = 0; i < a.length; i++) {
                        a[i] = rnd.nextInt();
                        eq[i] = 42;
                    }
                    final long[] s = new long[1];
                    r = Kiem.hen("300 queries on 300,000 elements + 300,000 equal values", 4000, new Runnable() {
                        public void run() {
                            for (int q = 1; q <= 300; q++) {
                                s[0] += KthLargest.kthLargest(a, q * 997);
                            }
                            s[0] += KthLargest.kthLargest(eq, 150000);
                        }
                    }) + ", sum " + s[0];
                }`,
  tep: {
    'KthLargest.java': j`
import java.util.Random;

public class KthLargest {
    private static final Random RND = new Random(26);

    public static int kthLargest(int[] in, int k) {
        //>> return in[0]; // TODO
        int[] a = in.clone();
        int target = a.length - k, lo = 0, hi = a.length - 1; // index in ascending order
        while (true) {
            int p = a[lo + RND.nextInt(hi - lo + 1)];
            int lt = lo, i = lo, gt = hi; // [lo,lt) < p, [lt,i) == p, (gt,hi] > p
            while (i <= gt) {
                if (a[i] < p) {
                    int t = a[lt];
                    a[lt++] = a[i];
                    a[i++] = t;
                } else if (a[i] > p) {
                    int t = a[gt];
                    a[gt--] = a[i];
                    a[i] = t;
                } else {
                    i++;
                }
            }
            if (target < lt) {
                hi = lt - 1;
            } else if (target > gt) {
                lo = gt + 1;
            } else {
                return p; // the target lies in the "== p" block
            }
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 3,2,1,5,6,4 2\nRUN 3,2,3,1,2,4,5,5,6 4\nRUN 7 1\nRUN 5,5,5,5 3\nRUN -1,-7,3 3\n' },
    { ten: { en: '5000 random arrays', vi: '5000 mảng ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'The k-th largest is the element at index n − k of the sorted order — select that index.', vi: 'Phần tử lớn thứ k là phần tử ở chỉ số n − k của thứ tự đã sắp — hãy chọn chỉ số đó.' },
    { en: 'After a 3-way partition, if the target index falls inside [lt, gt] you are done: the answer is p.', vi: 'Sau phân hoạch ba ngả, nếu chỉ số đích rơi vào [lt, gt] là xong: đáp án là p.' },
  ],
  loiHayGap: [
    { en: 'Always picking a[hi] as pivot — sorted input makes it O(n²).', vi: 'Luôn chọn a[hi] làm chốt — dữ liệu đã sắp biến nó thành O(n²).' },
    { en: 'Partitioning the caller’s array — the grader reports "a WAS MODIFIED".', vi: 'Phân hoạch ngay trên mảng của nơi gọi — máy chấm báo "a WAS MODIFIED".' },
  ],
  giaiThich: { en: '<p>With a random pivot each round keeps on average a constant fraction of the range, so the work is n + n/2 + n/4 + … ≈ O(n) expected. The 3-way partition removes the whole block of keys equal to the pivot at once — on 300,000 equal values it finishes in one pass, while Lomuto shrinks the range by one element per pass.</p>', vi: '<p>Với chốt ngẫu nhiên, mỗi vòng trung bình chỉ giữ lại một phần cố định của đoạn, nên tổng công việc là n + n/2 + n/4 + … ≈ O(n) kỳ vọng. Phân hoạch ba ngả loại cả khối khoá bằng chốt một lúc — trên 300.000 giá trị bằng nhau nó xong trong một lượt, còn Lomuto mỗi lượt chỉ co đoạn đi một phần tử.</p>' },
});

const de6 = deCs({
  id: 'csd201-cs5-reverse-pairs',
  tieuDe: { en: 'Count pairs i < j with a[i] > 2·a[j] — merge sort counting (and the 2L trap)', vi: 'Đếm cặp i < j có a[i] > 2·a[j] — đếm trong lúc trộn (và bẫy 2L)' },
  doKho: 'HARD', phut: 40,
  khaiNiem: ['divide and conquer counting', 'two sorted halves: one forward pointer', '2L · a[j] to avoid overflow'],
  moTa: {
    en: `<p>Complete ${c('static long count(int[] a)')}: the number of pairs i &lt; j with ${c('a[i] > 2 · a[j]')} (values anywhere in the int range). Examples: ${c('{1,3,2,3,1}')} → 2, ${c('{2,4,3,5,1}')} → 3. Do not modify ${c('a')}.</p>
<p>Merge sort a copy; before merging the two sorted halves, count: for each i of the left half move j forward in the right half while ${c('a[i] > 2L · a[j]')} — j never goes back because the left half is sorted. ${c('2 * a[j]')} in int overflows (for ${c('{MAX, MAX, MIN}')} the correct answer is 2). O(n log n); the complexity check has 1,000,000 elements.</p>`,
    vi: `<p>Hoàn thiện ${c('count(a)')}: số cặp i &lt; j có ${c('a[i] > 2 · a[j]')} (giá trị bất kỳ trong miền int). Ví dụ: ${c('{1,3,2,3,1}')} → 2, ${c('{2,4,3,5,1}')} → 3. Không sửa ${c('a')}.</p>
<p>Sắp trộn một bản sao; trước khi trộn hai nửa đã sắp thì đếm: với mỗi i của nửa trái, dời j trong nửa phải khi ${c('a[i] > 2L · a[j]')} — j không bao giờ lùi vì nửa trái đã sắp. ${c('2 * a[j]')} kiểu int sẽ tràn (với ${c('{MAX, MAX, MIN}')} đáp án đúng là 2). O(n log n); kiểm độ phức tạp có 1.000.000 phần tử.</p>`,
  },
  hen: { n: '1,000,000 elements', ms: 3000, can: 'O(n log n)', cham: 'O(n²) (every pair)' },
  them: `
    static long brute(int[] a) {
        long cc = 0;
        for (int i = 0; i < a.length; i++) {
            for (int jj = i + 1; jj < a.length; jj++) {
                if (a[i] > 2L * a[jj]) {
                    cc++;
                }
            }
        }
        return cc;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    int[] a = arr(p[1]);
                    String before = str(a);
                    r = ReversePairs.count(a) + (str(a).equals(before) ? "" : " (a WAS MODIFIED)");
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(79);
                    int[] ext = {Integer.MAX_VALUE, Integer.MIN_VALUE, 1 << 30, -(1 << 30), 0, 1, -1};
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        int[] a = new int[rnd.nextInt(12)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = t % 3 == 0 ? ext[rnd.nextInt(ext.length)] : rnd.nextInt(21) - 10;
                        }
                        long got = ReversePairs.count(a.clone()), want = brute(a);
                        if (got != want) {
                            sai = str(a) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random arrays (negatives, MIN/MAX)", 3000, sai);
                } else {
                    final int[] a = new int[1000000];
                    Random rnd = new Random(81);
                    for (int i = 0; i < a.length; i++) {
                        a[i] = rnd.nextInt();
                    }
                    final long[] got = new long[1];
                    r = Kiem.hen("1,000,000 elements", 3000, new Runnable() {
                        public void run() {
                            got[0] = ReversePairs.count(a);
                        }
                    }) + ", pairs " + got[0];
                }`,
  tep: {
    'ReversePairs.java': j`
public class ReversePairs {

    public static long count(int[] a) {
        //>> return 0; // TODO
        int[] b = a.clone();
        return sortCount(b, 0, b.length - 1, new int[b.length]);
        //<<
    }
    //>> // TODO: helper(s)

    private static long sortCount(int[] a, int lo, int hi, int[] tmp) {
        if (lo >= hi) {
            return 0;
        }
        int mid = lo + (hi - lo) / 2;
        long c = sortCount(a, lo, mid, tmp) + sortCount(a, mid + 1, hi, tmp);
        int j = mid + 1;
        for (int i = lo; i <= mid; i++) { // both halves sorted: j only moves forward
            while (j <= hi && a[i] > 2L * a[j]) { // 2L: 2 * a[j] overflows an int
                j++;
            }
            c += j - (mid + 1);
        }
        int i = lo, k = lo; // ordinary merge
        j = mid + 1;
        while (i <= mid || j <= hi) {
            tmp[k++] = (j > hi || (i <= mid && a[i] <= a[j])) ? a[i++] : a[j++];
        }
        System.arraycopy(tmp, lo, a, lo, hi - lo + 1);
        return c;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'examples and the overflow trap', vi: 'ví dụ và bẫy tràn số' }, vao: 'RUN 1,3,2,3,1\nRUN 2,4,3,5,1\nRUN -\nRUN 2147483647,2147483647,-2147483648\nRUN -5,1073741824\n' },
    { ten: { en: '3000 random arrays', vi: '3000 mảng ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Count first, merge afterwards: the counting pass needs both halves sorted but not yet merged.', vi: 'Đếm trước, trộn sau: lượt đếm cần hai nửa đã sắp nhưng chưa trộn.' },
    { en: 'Pairs inside the left half and inside the right half are counted by the recursive calls.', vi: 'Các cặp nằm trong nửa trái và trong nửa phải đã được các lời gọi đệ quy đếm.' },
  ],
  loiHayGap: [
    { en: 'a[i] > 2 * a[j] in int — {MAX, MAX, MIN} gives 3 instead of 2.', vi: 'a[i] > 2 * a[j] kiểu int — {MAX, MAX, MIN} ra 3 thay vì 2.' },
    { en: 'Counting inside the merge loop with the merge condition a[i] > a[j] — that counts ordinary inversions.', vi: 'Đếm ngay trong vòng trộn bằng điều kiện trộn a[i] > a[j] — đó là đếm nghịch thế thường.' },
  ],
  giaiThich: { en: '<p>Every pair (i, j) is split by exactly one level of the recursion, where i is in the left half and j in the right. With both halves sorted, the qualifying j for each i form a prefix of the right half that only grows — O(n) per level, O(n log n) in total.</p>', vi: '<p>Mỗi cặp (i, j) bị tách đúng một lần ở một tầng đệ quy, nơi i ở nửa trái và j ở nửa phải. Khi hai nửa đã sắp, các j thoả với mỗi i tạo thành một tiền tố của nửa phải chỉ dài thêm — O(n) mỗi tầng, tổng O(n log n).</p>' },
});

export default moDun({ slug: 'csd201-cs5-on', ten: '10.5 ⭐ CS.5 Greedy and divide and conquer — interview problems', de: [de1, de2, de3, de4, de5, de6] });
