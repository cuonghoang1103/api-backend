/** CSD201 · ⭐ CS.1 — tìm kiếm nhị phân kiểu phỏng vấn (từ gen/java/cs1/Ex1…Ex7): phiên bản lỗi đầu tiên (tràn số, ≤ 32 lần hỏi), phần tử đơn, số dương thứ k bị thiếu, bó hoa (tìm trên đáp án), cực đại khoảng cách nhỏ nhất (T cuối), trung vị hai mảng. */
import { moDun, c, j } from './_chung.mjs';
import { deCs } from './_cs.mjs';

const de1 = deCs({
  id: 'csd201-cs1-first-bad',
  tieuDe: { en: 'First bad version with n up to 2³¹ − 1 — at most 32 questions', vi: 'Phiên bản lỗi đầu tiên với n tới 2³¹ − 1 — hỏi nhiều nhất 32 lần' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['first T in F…F T…T', 'mid = lo + (hi − lo) / 2', 'counting the questions'],
  moTa: {
    en: `<p>Versions 1…n were released; from some version on, every version is bad. The only way to learn anything is ${c('Api.isBad(v)')} (given), which counts your calls and throws if ${c('v')} is not in 1…n. Complete ${c('static int solve(int n)')} in ${c('FirstBad')}: return the first bad version, using <b>at most 32</b> calls even for ${c('n = 2147483647')}.</p>
<p>The grader prints the answer and whether you stayed within 32 calls. The classic trap: ${c('(lo + hi) / 2')} overflows to a negative number when both are near 2³¹ — ${c('isBad')} then throws.</p>`,
    vi: `<p>Các phiên bản 1…n đã phát hành; từ một phiên bản nào đó trở đi, mọi phiên bản đều lỗi. Cách duy nhất để biết là ${c('Api.isBad(v)')} (cho sẵn) — hàm này đếm số lần gọi và ném lỗi nếu ${c('v')} không thuộc 1…n. Hoàn thiện ${c('solve(n)')} trong ${c('FirstBad')}: trả phiên bản lỗi đầu tiên, gọi <b>không quá 32</b> lần kể cả khi ${c('n = 2147483647')}.</p>
<p>Máy chấm in đáp án và việc bạn có giữ trong 32 lần gọi không. Bẫy kinh điển: ${c('(lo + hi) / 2')} tràn thành số âm khi cả hai gần 2³¹ — lúc đó ${c('isBad')} ném lỗi.</p>`,
  },
  yeuCau: { en: ['At most 32 calls of isBad for any n ≤ 2³¹ − 1 (this is the complexity check).', 'Never call isBad outside 1…n.'], vi: ['Không quá 32 lần gọi isBad với mọi n ≤ 2³¹ − 1 (đây là phép kiểm độ phức tạp).', 'Không bao giờ gọi isBad ngoài 1…n.'] },
  them: `
    static String run(int n, int bad) {
        Api.n = n;
        Api.firstBad = bad;
        Api.calls = 0;
        int got = FirstBad.solve(n);
        return got + (Api.calls <= 32 ? " (at most 32 calls)" : " (" + Api.calls + " calls - TOO MANY)");
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = run(n(1), n(2));
                } else {
                    Random rnd = new Random(1);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        int nn = t < 1000 ? 1 + rnd.nextInt(1000) : 1 + rnd.nextInt(Integer.MAX_VALUE);
                        int bad = 1 + rnd.nextInt(nn);
                        String got = run(nn, bad);
                        if (!got.equals(bad + " (at most 32 calls)")) {
                            sai = "n=" + nn + " bad=" + bad + " -> " + got;
                        }
                    }
                    r = ketQua("3000 random cases", 3000, sai);
                }`,
  tep: {
    'Api.java': j`
// GIVEN — do not change. The grader sets n and firstBad before calling solve.
public class Api {
    static int n, firstBad, calls;

    static boolean isBad(int v) {
        if (v < 1 || v > n) {
            throw new IllegalArgumentException("version " + v + " does not exist");
        }
        calls++;
        return v >= firstBad;
    }
}
`,
    'FirstBad.java': j`
public class FirstBad {

    public static int solve(int n) {
        //>> return 1; // TODO
        int lo = 1, hi = n; // the answer is in [lo, hi]
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2; // (lo + hi) / 2 overflows near 2^31
            if (Api.isBad(mid)) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return lo;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'small n and the extremes', vi: 'n nhỏ và các đầu mút' }, vao: 'RUN 1 1\nRUN 10 1\nRUN 10 10\nRUN 1000000 777777\n' },
    { ten: { en: 'n = 2³¹ − 1 (overflow trap)', vi: 'n = 2³¹ − 1 (bẫy tràn số)' }, vao: 'RUN 2147483647 2147483647\nRUN 2147483647 1\nRUN 2147483647 1073741825\n' },
    { ten: { en: '3000 random cases', vi: '3000 ca ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
  ],
  goiY: [
    { en: 'Write the row of answers F F … F T T … T and look for the first T; keep the invariant "the answer is in [lo, hi]".', vi: 'Viết hàng đáp án F F … F T T … T và tìm T đầu tiên; giữ bất biến "đáp án nằm trong [lo, hi]".' },
    { en: 'With while (lo < hi) the loop ends at lo == hi, which is the answer — no extra isBad call needed after the loop.', vi: 'Với while (lo < hi), vòng lặp dừng ở lo == hi, chính là đáp án — không cần gọi thêm isBad sau vòng lặp.' },
  ],
  loiHayGap: [
    { en: 'mid = (lo + hi) / 2 — fine in textbooks, negative for lo + hi > 2³¹ − 1.', vi: 'mid = (lo + hi) / 2 — ổn trong sách, âm khi lo + hi > 2³¹ − 1.' },
    { en: 'hi = mid − 1 after a T — the first bad version itself is thrown away.', vi: 'hi = mid − 1 sau một T — vứt luôn chính phiên bản lỗi đầu tiên.' },
  ],
  giaiThich: { en: '<p>Each question halves [lo, hi], so ⌈log₂ n⌉ ≤ 31 questions are enough for any int n. Linear search needs up to n questions — two billion here.</p>', vi: '<p>Mỗi câu hỏi chia đôi [lo, hi], nên ⌈log₂ n⌉ ≤ 31 câu là đủ cho mọi n kiểu int. Tìm tuần tự cần tới n câu hỏi — hai tỉ ở đây.</p>' },
});

const de2 = deCs({
  id: 'csd201-cs1-single-element',
  tieuDe: { en: 'The single element in a sorted array of pairs — O(log n) with a parity invariant', vi: 'Phần tử đơn trong mảng cặp đã sắp — O(log n) nhờ bất biến chẵn/lẻ' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['invariant on even indices', 'binary search without a target value'],
  moTa: {
    en: `<p>${c('a')} is sorted and every value appears exactly twice, except one value that appears once. Complete ${c('static int single(int[] a)')} in O(log n). XOR of all elements or a linear scan is O(n) — correct, but the complexity check calls your method 200,000 times on a million elements.</p>
<p>Key observation: before the lonely element every pair starts at an <b>even</b> index (${c('a[2i] == a[2i+1]')}); after it, every pair starts at an odd index.</p>`,
    vi: `<p>${c('a')} đã sắp và mọi giá trị xuất hiện đúng hai lần, trừ một giá trị xuất hiện một lần. Hoàn thiện ${c('single(a)')} trong O(log n). XOR mọi phần tử hay quét tuyến tính là O(n) — đúng, nhưng kiểm độ phức tạp gọi hàm của bạn 200.000 lần trên một triệu phần tử.</p>
<p>Nhận xét then chốt: trước phần tử lẻ loi, mọi cặp bắt đầu ở chỉ số <b>chẵn</b> (${c('a[2i] == a[2i+1]')}); sau nó, mọi cặp bắt đầu ở chỉ số lẻ.</p>`,
  },
  hen: { n: '1,000,001 elements × 200,000 calls', ms: 3000, can: 'O(log n) per call', cham: 'O(n) per call (XOR / linear scan)' },
  them: `
    static int brute(int[] a) {
        int x = 0;
        for (int v : a) {
            x ^= v;
        }
        return x;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(SingleElement.single(arr(p[1])));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(6);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        int pairs = rnd.nextInt(8), pos = rnd.nextInt(pairs + 1), v = -20, k = 0;
                        int[] a = new int[2 * pairs + 1];
                        for (int q = 0; q <= pairs; q++) {
                            v += 1 + rnd.nextInt(4);
                            a[k++] = v;
                            if (q != pos) {
                                a[k++] = v;
                            }
                        }
                        int got = SingleElement.single(a.clone()), want = brute(a);
                        if (got != want) {
                            sai = str(a) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random arrays", 3000, sai);
                } else {
                    final int[] a = new int[1000001];
                    for (int i = 0, v = 0; i < 500000; i++) {
                        v += 2;
                        a[2 * i + (i >= 300000 ? 1 : 0)] = v;
                        a[2 * i + 1 + (i >= 300000 ? 1 : 0)] = v;
                    }
                    a[600000] = 600001;
                    final long[] s = new long[1];
                    r = Kiem.hen("200,000 calls on 1,000,001 elements", 3000, new Runnable() {
                        public void run() {
                            for (int i = 0; i < 200000; i++) {
                                s[0] += SingleElement.single(a);
                            }
                        }
                    }) + ", sum " + s[0];
                }`,
  tep: {
    'SingleElement.java': j`
public class SingleElement {

    public static int single(int[] a) {
        //>> return a[0]; // TODO
        int lo = 0, hi = a.length - 1; // the answer index is even and in [lo, hi]
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (mid % 2 == 1) {
                mid--; // look at the start of a pair
            }
            if (a[mid] == a[mid + 1]) {
                lo = mid + 2; // pairs intact so far: the answer is to the right
            } else {
                hi = mid;
            }
        }
        return a[lo];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 1,1,4,4,6,9,9,12,12\nRUN -5,-5,0,2,2,7,7\nRUN 5\nRUN 3,7,7\nRUN 2,2,8\n' },
    { ten: { en: '3000 random arrays', vi: '3000 mảng ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Always compare a pair that starts at an even index: if mid is odd, step back one.', vi: 'Luôn so một cặp bắt đầu ở chỉ số chẵn: mid lẻ thì lùi một.' },
    { en: 'Intact pair at mid → lo = mid + 2; broken pair → hi = mid (the lonely element may be a[mid] itself).', vi: 'Cặp ở mid còn nguyên → lo = mid + 2; cặp lệch → hi = mid (phần tử lẻ loi có thể chính là a[mid]).' },
  ],
  loiHayGap: [
    { en: 'Comparing a[mid] with a[mid − 1] or a[mid + 1] without fixing the parity — the halves are chosen wrongly.', vi: 'So a[mid] với a[mid − 1] hay a[mid + 1] mà không chỉnh tính chẵn lẻ — chọn nhầm nửa.' },
    { en: 'XOR of everything — the right answer, but O(n): the complexity check needs 2·10¹¹ steps.', vi: 'XOR tất cả — đúng đáp án, nhưng O(n): kiểm độ phức tạp cần 2·10¹¹ bước.' },
  ],
  giaiThich: { en: '<p>The row "is the pair starting at even index i intact?" is T…T F…F, and the lonely element is at the first F — a first-F binary search on even indices, O(log n).</p>', vi: '<p>Hàng "cặp bắt đầu ở chỉ số chẵn i còn nguyên không?" có dạng T…T F…F, và phần tử lẻ loi nằm ở F đầu tiên — tìm nhị phân F đầu tiên trên các chỉ số chẵn, O(log n).</p>' },
});

const de3 = deCs({
  id: 'csd201-cs1-kth-missing',
  tieuDe: { en: 'The k-th missing positive number — binary search on a computed value', vi: 'Số dương thứ k bị thiếu — tìm nhị phân trên một giá trị tính ra' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['missing(i) = a[i] − (i + 1) is non-decreasing', 'answer = lo + k'],
  moTa: {
    en: `<p>${c('a')} is a strictly increasing array of positive ints. Complete ${c('static int kthMissing(int[] a, int k)')}: the k-th positive integer that is NOT in ${c('a')}. Example: ${c('a = {3,4,8,9,12}')} misses 1, 2, 5, 6, 7, 10, 11, 13 … — k = 1 → 1, k = 4 → 6, k = 10 → 15.</p>
<p>Before ${c('a[i]')} exactly ${c('a[i] − (i + 1)')} numbers are missing, and that count never decreases — find the first index where it reaches k in O(log n).</p>`,
    vi: `<p>${c('a')} là mảng số nguyên dương tăng hẳn. Hoàn thiện ${c('kthMissing(a, k)')}: số nguyên dương thứ k KHÔNG có trong ${c('a')}. Ví dụ: ${c('a = {3,4,8,9,12}')} thiếu 1, 2, 5, 6, 7, 10, 11, 13 … — k = 1 → 1, k = 4 → 6, k = 10 → 15.</p>
<p>Trước ${c('a[i]')} có đúng ${c('a[i] − (i + 1)')} số bị thiếu, và số đó không bao giờ giảm — tìm chỉ số đầu tiên mà nó đạt k trong O(log n).</p>`,
  },
  hen: { n: '1,000,000 elements × 200,000 queries', ms: 3000, can: 'O(log n) per query', cham: 'O(n) or O(n + k) per query' },
  them: `
    static int brute(int[] a, int k) {
        Set<Integer> in = new HashSet<Integer>();
        for (int x : a) {
            in.add(x);
        }
        for (int v = 1; ; v++) {
            if (!in.contains(v) && --k == 0) {
                return v;
            }
        }
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(KthMissing.kthMissing(arr(p[1]), n(2)));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(10);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        int[] b = new int[rnd.nextInt(8)];
                        for (int i = 0, v = 0; i < b.length; i++) {
                            v += 1 + rnd.nextInt(3);
                            b[i] = v;
                        }
                        int k = 1 + rnd.nextInt(12);
                        int got = KthMissing.kthMissing(b.clone(), k), want = brute(b, k);
                        if (got != want) {
                            sai = str(b) + " k=" + k + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random cases", 3000, sai);
                } else {
                    final int[] a = new int[1000000];
                    final Random rnd = new Random(3);
                    for (int i = 0, v = 0; i < a.length; i++) {
                        v += 1 + rnd.nextInt(3);
                        a[i] = v;
                    }
                    final long[] s = new long[1];
                    r = Kiem.hen("200,000 queries on 1,000,000 elements", 3000, new Runnable() {
                        public void run() {
                            for (int i = 0; i < 200000; i++) {
                                s[0] += KthMissing.kthMissing(a, 1 + rnd.nextInt(1500000));
                            }
                        }
                    }) + ", sum " + s[0];
                }`,
  tep: {
    'KthMissing.java': j`
public class KthMissing {

    public static int kthMissing(int[] a, int k) {
        //>> return k; // TODO
        int lo = 0, hi = a.length; // first i with missing(i) >= k (a.length if none)
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            int missing = a[mid] - (mid + 1); // numbers skipped before a[mid]
            if (missing >= k) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return lo + k; // exactly lo numbers of a lie below the answer
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 3,4,8,9,12 1\nRUN 3,4,8,9,12 4\nRUN 3,4,8,9,12 10\nRUN 1,2,3,4 2\nRUN - 3\n' },
    { ten: { en: '3000 random cases', vi: '3000 ca ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'If lo elements of a are smaller than the answer, the answer is lo + k.', vi: 'Nếu có lo phần tử của a nhỏ hơn đáp án thì đáp án là lo + k.' },
    { en: 'Search the first index i with a[i] − (i + 1) ≥ k over [0, a.length] — a.length means "after every element".', vi: 'Tìm chỉ số đầu tiên i có a[i] − (i + 1) ≥ k trên [0, a.length] — a.length nghĩa là "sau mọi phần tử".' },
  ],
  loiHayGap: [
    { en: 'hi = a.length − 1 — the case "the answer is after the last element" is lost.', vi: 'hi = a.length − 1 — mất trường hợp "đáp án nằm sau phần tử cuối".' },
    { en: 'Counting up from 1 and skipping elements of a — correct, but O(n + k) per query.', vi: 'Đếm từ 1 lên và bỏ qua phần tử của a — đúng, nhưng O(n + k) mỗi truy vấn.' },
  ],
  giaiThich: { en: '<p>missing(i) = a[i] − (i + 1) is non-decreasing because a is strictly increasing, so "missing(i) ≥ k" is F…F T…T. With lo = the first T, the numbers 1…lo + k contain lo elements of a and k missing ones, so the k-th missing is lo + k. O(log n).</p>', vi: '<p>missing(i) = a[i] − (i + 1) không giảm vì a tăng hẳn, nên "missing(i) ≥ k" có dạng F…F T…T. Với lo = T đầu tiên, các số 1…lo + k gồm lo phần tử của a và k số thiếu, nên số thiếu thứ k là lo + k. O(log n).</p>' },
});

const de4 = deCs({
  id: 'csd201-cs1-bouquets',
  tieuDe: { en: 'Minimum days to make m bouquets — binary search on the answer (first T)', vi: 'Số ngày ít nhất để làm m bó hoa — tìm nhị phân trên đáp án (T đầu tiên)' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['search on the answer', 'monotone feasibility check', 'long to avoid m·k overflow'],
  moTa: {
    en: `<p>Flower i blooms on day ${c('bloom[i]')}. A bouquet needs k <b>adjacent</b> bloomed flowers, and each flower is used once. Complete ${c('static int minDays(int[] bloom, int m, int k)')}: the first day on which m bouquets can be made, or -1 if impossible (m·k flowers are more than there are — careful, ${c('m * k')} can overflow an int).</p>
<p>Example ${c('bloom = {6,2,9,3,3,8,1,5}')}, k = 2: m = 2 → day 5, m = 3 → day 6, m = 5 → -1.</p>
<p>If day d is enough, every later day is too — so "enough by day d" is F…F T…T over days. Count bouquets for one day in O(n), and binary search the day between the smallest and largest bloom day.</p>`,
    vi: `<p>Bông thứ i nở vào ngày ${c('bloom[i]')}. Một bó cần k bông đã nở <b>liền nhau</b>, mỗi bông dùng một lần. Hoàn thiện ${c('minDays(bloom, m, k)')}: ngày đầu tiên làm được m bó, hoặc -1 nếu không thể (m·k bông nhiều hơn số bông có — cẩn thận, ${c('m * k')} có thể tràn int).</p>
<p>Ví dụ ${c('bloom = {6,2,9,3,3,8,1,5}')}, k = 2: m = 2 → ngày 5, m = 3 → ngày 6, m = 5 → -1.</p>
<p>Nếu ngày d đã đủ thì mọi ngày sau cũng đủ — nên "đủ tới ngày d" có dạng F…F T…T theo ngày. Đếm số bó của một ngày trong O(n), rồi tìm nhị phân ngày giữa ngày nở sớm nhất và muộn nhất.</p>`,
  },
  hen: { n: '100,000 flowers, days up to 10⁹, 30 queries', ms: 3000, can: 'O(n log D) per query', cham: 'trying the days one by one (O(n · D))' },
  them: `
    static int bouquets(int[] bloom, int k, int d) {
        int made = 0, run = 0;
        for (int b : bloom) {
            if (b <= d) {
                if (++run == k) {
                    made++;
                    run = 0;
                }
            } else {
                run = 0;
            }
        }
        return made;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Bouquets.minDays(arr(p[1]), n(2), n(3)));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(12);
                    String sai = null;
                    for (int t = 0; t < 2000 && sai == null; t++) {
                        int[] b = new int[1 + rnd.nextInt(9)];
                        for (int i = 0; i < b.length; i++) {
                            b[i] = 1 + rnd.nextInt(10);
                        }
                        int m = 1 + rnd.nextInt(4), k = 1 + rnd.nextInt(3), want = -1;
                        for (int d = 1; d <= 10 && want < 0; d++) {
                            if (bouquets(b, k, d) >= m) {
                                want = d;
                            }
                        }
                        int got = Bouquets.minDays(b.clone(), m, k);
                        if (got != want) {
                            sai = str(b) + " m=" + m + " k=" + k + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("2000 random cases (impossible ones included)", 2000, sai);
                } else {
                    final int[] b = new int[100000];
                    Random rnd = new Random(4);
                    for (int i = 0; i < b.length; i++) {
                        b[i] = 1 + rnd.nextInt(1000000000);
                    }
                    final long[] s = new long[1];
                    r = Kiem.hen("30 queries, 100,000 flowers", 3000, new Runnable() {
                        public void run() {
                            for (int q = 1; q <= 30; q++) {
                                s[0] += Bouquets.minDays(b, 100 * q, 3 + q % 7);
                            }
                        }
                    }) + ", sum " + s[0];
                }`,
  tep: {
    'Bouquets.java': j`
public class Bouquets {

    public static int minDays(int[] bloom, int m, int k) {
        //>> return -1; // TODO
        if ((long) m * k > bloom.length) {
            return -1; // long: m * k may overflow an int
        }
        int lo = Integer.MAX_VALUE, hi = 0;
        for (int b : bloom) {
            lo = Math.min(lo, b);
            hi = Math.max(hi, b);
        }
        while (lo < hi) { // first day that is enough
            int mid = lo + (hi - lo) / 2;
            if (count(bloom, k, mid) >= m) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return lo;
        //<<
    }
    //>> // TODO: helper(s)

    // bouquets of k adjacent flowers that have bloomed by day d
    private static int count(int[] bloom, int k, int d) {
        int made = 0, run = 0;
        for (int b : bloom) {
            if (b <= d) {
                if (++run == k) {
                    made++;
                    run = 0;
                }
            } else {
                run = 0; // a gap breaks the run
            }
        }
        return made;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 6,2,9,3,3,8,1,5 2 2\nRUN 6,2,9,3,3,8,1,5 3 2\nRUN 6,2,9,3,3,8,1,5 5 2\nRUN 6,2,9,3,3,8,1,5 100000 100000\nRUN 7 1 1\n' },
    { ten: { en: '2000 random cases', vi: '2000 ca ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Split it: a helper count(bloom, k, d) in O(n), then a first-T binary search over d.', vi: 'Tách ra: hàm phụ count(bloom, k, d) O(n), rồi tìm nhị phân T đầu tiên theo d.' },
    { en: 'Search d between min(bloom) and max(bloom): by the last bloom day every flower is open.', vi: 'Tìm d giữa min(bloom) và max(bloom): tới ngày nở muộn nhất mọi bông đều đã nở.' },
  ],
  loiHayGap: [
    { en: 'if (m * k > n) with ints — 100000 · 100000 overflows and the check passes.', vi: 'if (m * k > n) bằng int — 100000 · 100000 tràn và phép kiểm lọt qua.' },
    { en: 'Forgetting to reset the run after a flower that has not bloomed.', vi: 'Quên đặt lại chuỗi sau một bông chưa nở.' },
  ],
  giaiThich: { en: '<p>"Search on the answer": the answer itself (a day) is binary searched, and each probe runs an O(n) greedy check. log₂(10⁹) ≈ 30 probes × n = 3·10⁶ steps per query, instead of up to 10⁹ · n by trying days one by one.</p>', vi: '<p>"Tìm trên đáp án": chính đáp án (một ngày) được tìm nhị phân, mỗi lần thử chạy một phép kiểm tham lam O(n). log₂(10⁹) ≈ 30 lần thử × n = 3·10⁶ bước mỗi truy vấn, thay vì tới 10⁹ · n nếu thử từng ngày.</p>' },
});

const de5 = deCs({
  id: 'csd201-cs1-max-min-distance',
  tieuDe: { en: 'Maximise the minimum distance — search on the answer for the LAST T', vi: 'Cực đại khoảng cách nhỏ nhất — tìm trên đáp án, T CUỐI CÙNG' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['T…T F…F: the last T', 'mid rounded up', 'greedy feasibility check'],
  moTa: {
    en: `<p>${c('pos')} holds n positions (unsorted, duplicates allowed). Place c items on c of them so that the smallest distance between two neighbouring items is as <b>large</b> as possible. Complete ${c('static int maxMinDistance(int[] pos, int c)')} (2 ≤ c ≤ n) — return that distance; do not change ${c('pos')}.</p>
<p>Example ${c('{9,1,17,4,12,20}')}: c = 2 → 19 (1 and 20), c = 3 → 8 (1, 9, 17), c = 4 → 3 (for instance 1, 4, 9, 12 or 1, 9, 12, 17… the best smallest gap is 3).</p>
<p>"Can place c items at distance ≥ d" is T…T F…F in d (greedy: take the first position, then every position ≥ d after the last taken one). Find the <b>last</b> T — round mid <b>up</b>, otherwise ${c('lo = mid')} loops forever.</p>`,
    vi: `<p>${c('pos')} chứa n vị trí (chưa sắp, có thể trùng). Đặt c vật vào c vị trí sao cho khoảng cách nhỏ nhất giữa hai vật kề nhau <b>lớn</b> nhất có thể. Hoàn thiện ${c('maxMinDistance(pos, c)')} (2 ≤ c ≤ n) — trả khoảng cách đó; không được sửa ${c('pos')}.</p>
<p>Ví dụ ${c('{9,1,17,4,12,20}')}: c = 2 → 19 (1 và 20), c = 3 → 8 (1, 9, 17), c = 4 → 3 (khoảng cách nhỏ nhất tốt nhất có thể là 3).</p>
<p>"Đặt được c vật cách nhau ≥ d" có dạng T…T F…F theo d (tham lam: lấy vị trí đầu, rồi mọi vị trí cách vật vừa đặt ≥ d). Tìm T <b>cuối cùng</b> — làm tròn mid <b>lên</b>, không thì ${c('lo = mid')} lặp mãi.</p>`,
  },
  hen: { n: '200,000 positions up to 10⁹, 10 queries', ms: 3000, can: 'O(n log n + n log D)', cham: 'trying every distance (O(n · D))' },
  them: `
    static int best;

    static void brute(int[] pos, int i, int last, int left, int minGap) {
        if (left == 0) {
            best = Math.max(best, minGap);
            return;
        }
        if (i == pos.length) {
            return;
        }
        brute(pos, i + 1, pos[i], left - 1, last == Integer.MIN_VALUE ? minGap : Math.min(minGap, pos[i] - last));
        brute(pos, i + 1, last, left, minGap);
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    int[] a = arr(p[1]);
                    String before = str(a);
                    r = String.valueOf(MaxMinDistance.maxMinDistance(a, n(2))) + (str(a).equals(before) ? "" : " (pos WAS MODIFIED)");
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(14);
                    String sai = null;
                    for (int t = 0; t < 2000 && sai == null; t++) {
                        int nn = 2 + rnd.nextInt(7);
                        int[] pos = new int[nn];
                        for (int i = 0; i < nn; i++) {
                            pos[i] = rnd.nextInt(30) - 10;
                        }
                        int cc = 2 + rnd.nextInt(nn - 1);
                        int[] s = pos.clone();
                        Arrays.sort(s);
                        best = -1;
                        brute(s, 0, Integer.MIN_VALUE, cc, Integer.MAX_VALUE);
                        int got = MaxMinDistance.maxMinDistance(pos.clone(), cc);
                        if (got != best) {
                            sai = str(pos) + " c=" + cc + " -> " + got + ", expected " + best;
                        }
                    }
                    r = ketQua("2000 random cases", 2000, sai);
                } else {
                    final int[] a = new int[200000];
                    Random rnd = new Random(5);
                    for (int i = 0; i < a.length; i++) {
                        a[i] = rnd.nextInt(1000000000);
                    }
                    final long[] s = new long[1];
                    r = Kiem.hen("10 queries, 200,000 positions", 3000, new Runnable() {
                        public void run() {
                            for (int q = 1; q <= 10; q++) {
                                s[0] += MaxMinDistance.maxMinDistance(a, 1000 * q);
                            }
                        }
                    }) + ", sum " + s[0];
                }`,
  tep: {
    'MaxMinDistance.java': j`
import java.util.Arrays;

public class MaxMinDistance {

    public static int maxMinDistance(int[] p, int c) {
        //>> return 0; // TODO
        int[] pos = p.clone();
        Arrays.sort(pos); // the input is not sorted
        int lo = 0, hi = pos[pos.length - 1] - pos[0];
        while (lo < hi) { // the LAST d that works
            int mid = lo + (hi - lo + 1) / 2; // round up because of lo = mid
            if (canPlace(pos, c, mid)) {
                lo = mid;
            } else {
                hi = mid - 1;
            }
        }
        return lo;
        //<<
    }
    //>> // TODO: helper(s)

    private static boolean canPlace(int[] pos, int c, int d) {
        int placed = 1, last = pos[0];
        for (int i = 1; i < pos.length; i++) {
            if (pos[i] - last >= d) { // greedy: take the earliest spot
                placed++;
                last = pos[i];
            }
        }
        return placed >= c;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 9,1,17,4,12,20 3\nRUN 9,1,17,4,12,20 4\nRUN 9,1,17,4,12,20 2\nRUN -10,-3,0,8 3\nRUN 5,5,5 3\n' },
    { ten: { en: '2000 random cases vs every subset', vi: '2000 ca ngẫu nhiên so với mọi tập con' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Sort a copy first; the greedy check needs sorted positions.', vi: 'Sắp một bản sao trước; phép kiểm tham lam cần vị trí đã sắp.' },
    { en: 'The answer lies in [0, max − min]: distance 0 always works, more than max − min never does.', vi: 'Đáp án nằm trong [0, max − min]: khoảng cách 0 luôn được, lớn hơn max − min thì không bao giờ.' },
  ],
  loiHayGap: [
    { en: 'mid = lo + (hi − lo) / 2 with lo = mid — when hi = lo + 1 the loop never ends.', vi: 'mid = lo + (hi − lo) / 2 cùng lo = mid — khi hi = lo + 1 vòng lặp không dừng.' },
    { en: 'Sorting the caller’s array — the grader reports "pos WAS MODIFIED".', vi: 'Sắp luôn mảng của nơi gọi — máy chấm báo "pos WAS MODIFIED".' },
  ],
  giaiThich: { en: '<p>Feasibility is monotone the other way round (T…T F…F), so the answer is the last T. With lo = mid in the T branch, mid must be rounded up so that the interval always shrinks. Cost: O(n log n) to sort + O(n) per probe × log₂(range) probes.</p>', vi: '<p>Tính khả thi đơn điệu theo chiều ngược lại (T…T F…F), nên đáp án là T cuối cùng. Với lo = mid ở nhánh T, mid phải làm tròn lên để đoạn luôn co lại. Chi phí: O(n log n) để sắp + O(n) mỗi lần thử × log₂(khoảng) lần thử.</p>' },
});

const de6 = deCs({
  id: 'csd201-cs1-median-two-arrays',
  tieuDe: { en: 'Median of two sorted arrays in O(log min(m, n)) — binary search on a split point', vi: 'Trung vị hai mảng đã sắp trong O(log min(m, n)) — tìm nhị phân trên điểm chia' },
  doKho: 'HARD', phut: 40,
  khaiNiem: ['partition: i elements of a, half − i of b on the left', 'sentinels MIN/MAX at the borders', 'long when averaging'],
  moTa: {
    en: `<p>Complete ${c('static double median(int[] a, int[] b)')}: the median of all m + n elements (both arrays sorted, m + n ≥ 1, one may be empty). For an even total it is the average of the two middle values — compute it with ${c('long')}: ${c('{MAX} + {MAX}')} must give ${c('2.147483647E9')}.</p>
<p>Required: <b>O(log min(m, n))</b> — merging is O(m + n) and fails the complexity check (two arrays of a million, 300,000 calls). Idea: choose i elements of the shorter array a and j = (m + n + 1)/2 − i of b for the left half; the split is right when ${c('a[i−1] ≤ b[j]')} and ${c('b[j−1] ≤ a[i]')} (missing neighbours count as −∞/+∞). Binary search i.</p>`,
    vi: `<p>Hoàn thiện ${c('median(a, b)')}: trung vị của cả m + n phần tử (hai mảng đã sắp, m + n ≥ 1, một mảng có thể rỗng). Tổng chẵn thì là trung bình hai giá trị giữa — tính bằng ${c('long')}: ${c('{MAX} + {MAX}')} phải ra ${c('2.147483647E9')}.</p>
<p>Yêu cầu: <b>O(log min(m, n))</b> — trộn là O(m + n) và trượt phép kiểm độ phức tạp (hai mảng một triệu phần tử, 300.000 lần gọi). Ý tưởng: lấy i phần tử của mảng ngắn hơn a và j = (m + n + 1)/2 − i phần tử của b vào nửa trái; điểm chia đúng khi ${c('a[i−1] ≤ b[j]')} và ${c('b[j−1] ≤ a[i]')} (thiếu hàng xóm thì coi là −∞/+∞). Tìm nhị phân i.</p>`,
  },
  hen: { n: '2 × 1,000,000 elements, 300,000 calls', ms: 3000, can: 'O(log min(m, n)) per call', cham: 'O(m + n) per call (merging)' },
  them: `
    static double brute(int[] a, int[] b) {
        int[] c = new int[a.length + b.length];
        System.arraycopy(a, 0, c, 0, a.length);
        System.arraycopy(b, 0, c, a.length, b.length);
        Arrays.sort(c);
        int k = c.length;
        return k % 2 == 1 ? c[k / 2] : ((long) c[k / 2 - 1] + c[k / 2]) / 2.0;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Median.median(arr(p[1]), arr(p[2])));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(15);
                    String sai = null;
                    int done = 0;
                    for (int t = 0; t < 5000 && sai == null; t++) {
                        int[] a = new int[rnd.nextInt(7)], b = new int[rnd.nextInt(7)];
                        if (a.length + b.length == 0) {
                            continue;
                        }
                        for (int i = 0; i < a.length; i++) {
                            a[i] = rnd.nextInt(21) - 10;
                        }
                        for (int i = 0; i < b.length; i++) {
                            b[i] = rnd.nextInt(21) - 10;
                        }
                        Arrays.sort(a);
                        Arrays.sort(b);
                        done++;
                        double got = Median.median(a.clone(), b.clone()), want = brute(a, b);
                        if (got != want) {
                            sai = str(a) + " + " + str(b) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("random pairs (one empty, duplicates, negatives)", done, sai);
                } else {
                    final int[] a = new int[1000000], b = new int[1000001];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = 2 * i;
                    }
                    for (int i = 0; i < b.length; i++) {
                        b[i] = 3 * i - 7;
                    }
                    final double[] s = new double[1];
                    r = Kiem.hen("300,000 calls on 1,000,000 + 1,000,001 elements", 3000, new Runnable() {
                        public void run() {
                            for (int i = 0; i < 300000; i++) {
                                s[0] += i % 2 == 0 ? Median.median(a, b) : Median.median(b, a);
                            }
                        }
                    }) + ", sum " + s[0];
                }`,
  tep: {
    'Median.java': j`
public class Median {

    public static double median(int[] a, int[] b) {
        //>> return 0; // TODO
        if (a.length > b.length) {
            return median(b, a); // search the shorter array
        }
        int m = a.length, n = b.length, half = (m + n + 1) / 2;
        int lo = 0, hi = m;
        while (lo <= hi) {
            int i = lo + (hi - lo) / 2, j = half - i; // i from a and j from b on the left
            int aL = i == 0 ? Integer.MIN_VALUE : a[i - 1], aR = i == m ? Integer.MAX_VALUE : a[i];
            int bL = j == 0 ? Integer.MIN_VALUE : b[j - 1], bR = j == n ? Integer.MAX_VALUE : b[j];
            if (aL > bR) {
                hi = i - 1; // took too many from a
            } else if (bL > aR) {
                lo = i + 1; // took too few from a
            } else {
                int leftMax = Math.max(aL, bL);
                if ((m + n) % 2 == 1) {
                    return leftMax;
                }
                return ((long) leftMax + Math.min(aR, bR)) / 2.0; // long: no overflow
            }
        }
        throw new IllegalArgumentException("arrays not sorted");
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 1,4,9 2,3,10,12\nRUN 5,6 1,2\nRUN - 7\nRUN 2147483647 2147483647\nRUN -3,-1 -2\n' },
    { ten: { en: 'random pairs vs merge + sort', vi: 'các cặp ngẫu nhiên so với trộn + sắp' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Search on the shorter array (swap if needed) so that j never goes out of range.', vi: 'Tìm trên mảng ngắn hơn (đổi chỗ nếu cần) để j không bao giờ ra ngoài phạm vi.' },
    { en: 'With half = (m + n + 1) / 2 the left half holds the median for an odd total.', vi: 'Với half = (m + n + 1) / 2 thì nửa trái chứa trung vị khi tổng lẻ.' },
  ],
  loiHayGap: [
    { en: '(leftMax + rightMin) / 2.0 with ints — two values near 2³¹ overflow before the division.', vi: '(leftMax + rightMin) / 2.0 bằng int — hai giá trị gần 2³¹ tràn trước khi chia.' },
    { en: 'Searching the longer array — j = half − i becomes negative or larger than n.', vi: 'Tìm trên mảng dài hơn — j = half − i thành âm hoặc lớn hơn n.' },
  ],
  giaiThich: { en: '<p>Every candidate split i of a forces j in b; "aL > bR" means i is too big, "bL > aR" means too small — a binary search over 0…m, so O(log min(m, n)). It is the classic hard interview problem precisely because the search is not over values but over split positions.</p>', vi: '<p>Mỗi điểm chia i của a buộc j của b; "aL > bR" nghĩa là i quá lớn, "bL > aR" là quá nhỏ — tìm nhị phân trên 0…m, nên O(log min(m, n)). Đây là bài phỏng vấn khó kinh điển chính vì phép tìm không chạy trên giá trị mà trên vị trí chia.</p>' },
});

export default moDun({ slug: 'csd201-cs1-on', ten: '10.1 ⭐ CS.1 Binary search — interview problems', de: [de1, de2, de3, de4, de5, de6] });
