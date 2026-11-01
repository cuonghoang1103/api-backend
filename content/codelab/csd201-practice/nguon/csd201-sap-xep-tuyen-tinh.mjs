/** CSD201 · 6.6 — Sắp xếp tuyến tính: counting sort ổn định (kiểm O(n + k)), LSD radix sort in từng lượt kiểu slide, bucket sort cho số thực trong [0, 1). */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-6-6-counting-sort',
  tieuDe: { en: 'Counting sort: stable, O(n + k), no comparisons', vi: 'Counting sort: ổn định, O(n + k), không so sánh' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['count occurrences', 'prefix sums = final positions', 'walk the input backwards for stability'],
  moTa: {
    en: `<p>Records ${c('int[][] r')} where ${c('r[i][0]')} is a key in ${c('0..k')} and ${c('r[i][1]')} an id. Complete ${c('static int[][] countingSort(int[][] r, int k)')}: return a new array sorted by key, <b>stable</b> (equal keys keep their input order). Count the keys, turn the counts into end positions with prefix sums, then place the records walking the input <b>from the end</b>.</p>
<p>The complexity check sorts 3,000,000 records with keys up to 1,000 — no comparison sort needed.</p>`,
    vi: `<p>Các bản ghi ${c('int[][] r')} với ${c('r[i][0]')} là khoá trong ${c('0..k')} và ${c('r[i][1]')} là mã. Hoàn thiện ${c('static int[][] countingSort(int[][] r, int k)')}: trả mảng mới sắp theo khoá, <b>ổn định</b> (khoá bằng nhau giữ thứ tự đầu vào). Đếm các khoá, biến số đếm thành vị trí cuối bằng cộng dồn, rồi đặt bản ghi bằng cách duyệt đầu vào <b>từ cuối</b>.</p>
<p>Kiểm độ phức tạp sắp 3.000.000 bản ghi khoá tới 1.000 — không cần sắp xếp so sánh.</p>`,
  },
  yeuCau: { en: ['O(n + k) time; no comparison sort (rule R1).', 'Stable.'], vi: ['O(n + k) thời gian; không sắp xếp so sánh (luật R1).', 'Ổn định.'] },
  dauVao: { en: 'Lines "k : key/id key/id …"; PERF.', vi: 'Các dòng "k : khoá/mã khoá/mã …"; PERF.' },
  dauRa: { en: 'The sorted records.', vi: 'Các bản ghi đã sắp.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no comparison sort in Counting', vi: 'không sắp xếp so sánh trong Counting', re: String.raw`\.sort\s*\(|\bPriorityQueue\b|\bTree(Map|Set)\b|\bcompare(To)?\s*\(`, file: 'Counting' }],
  hen: { n: '3,000,000 records, k = 1,000', ms: 3000, can: 'O(n + k)', cham: 'O(n²) (insertion or selection by key)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    int n = 3000000;
                    final int[][] rr = new int[n][];
                    int[] keys = Kiem.ngauNhien(n, 1001, 13);
                    for (int i = 0; i < n; i++) {
                        rr[i] = new int[] {keys[i], i};
                    }
                    final int[][][] out = new int[1][][];
                    r = Kiem.hen("3,000,000 records", 3000, new Runnable() {
                        public void run() {
                            out[0] = Counting.countingSort(rr, 1000);
                        }
                    });
                    boolean ok = out[0] != null;
                    for (int i = 1; ok && i < out[0].length; i++) {
                        ok = out[0][i - 1][0] < out[0][i][0] || out[0][i - 1][0] == out[0][i][0] && out[0][i - 1][1] < out[0][i][1];
                    }
                    r += ", sorted and stable " + ok;
                } else {
                    int[][] rr = new int[p.length - 2][];
                    for (int i = 2; i < p.length; i++) {
                        String[] q = p[i].split("/");
                        rr[i - 2] = new int[] {Integer.parseInt(q[0]), Integer.parseInt(q[1])};
                    }
                    StringBuilder sb = new StringBuilder();
                    for (int[] x : Counting.countingSort(rr, n(0))) {
                        sb.append(x[0]).append('/').append(x[1]).append(' ');
                    }
                    r = sb.toString().trim();
                }`,
    }),
  },
  tep: {
    'Counting.java': j`
public class Counting {

    static int[][] countingSort(int[][] r, int k) {
        //>> return r; // TODO
        int[] count = new int[k + 1];
        for (int[] x : r) {
            count[x[0]]++;
        }
        for (int v = 1; v <= k; v++) {
            count[v] += count[v - 1]; // count[v] = number of keys <= v = one past the last slot of v
        }
        int[][] out = new int[r.length][];
        for (int i = r.length - 1; i >= 0; i--) { // backwards: the last equal key takes the last slot
            out[--count[r[i][0]]] = r[i];
        }
        return out;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ example with ids to show stability', vi: 'ví dụ của slide có mã để thấy tính ổn định' }, vao: '5 : 2/1 5/2 3/3 0/4 2/5 3/6 0/7 3/8\n3 : 1/1 1/2 1/3\n' },
    { ten: { en: 'one key, k = 0, unused keys', vi: 'một khoá, k = 0, khoá không dùng tới' }, vao: '0 : 0/1 0/2\n9 : 9/1 0/2 9/3 4/4\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'After prefix sums, count[v] is one past the last position for key v; place a record at --count[key].', vi: 'Sau khi cộng dồn, count[v] là vị trí ngay sau chỗ cuối cùng dành cho khoá v; đặt bản ghi vào --count[khoá].' },
    { en: 'Walking backwards makes the last record with a key take the last slot of that key — that is what keeps it stable.', vi: 'Duyệt ngược làm bản ghi cuối cùng của một khoá lấy ô cuối của khoá đó — đó là điều giữ tính ổn định.' },
  ],
  loiHayGap: [
    { en: 'Walking forwards with --count — equal keys come out reversed (unstable).', vi: 'Duyệt xuôi với --count — các khoá bằng nhau ra ngược thứ tự (không ổn định).' },
    { en: 'Rebuilding the output from the counts only — the ids are lost.', vi: 'Dựng kết quả chỉ từ các số đếm — mất các mã.' },
  ],
  giaiThich: { en: '<p>Two passes over the input and one over the counts: O(n + k), beating the Ω(n log n) lower bound of comparison sorts because it never compares keys — it uses them as indexes. The price is O(k) memory, so k must be small. Its stability is what makes radix sort work.</p>', vi: '<p>Hai lượt qua đầu vào và một lượt qua mảng đếm: O(n + k), vượt cận dưới Ω(n log n) của sắp xếp so sánh vì nó không bao giờ so sánh khoá — nó dùng khoá làm chỉ số. Cái giá là O(k) bộ nhớ, nên k phải nhỏ. Tính ổn định của nó là điều làm radix sort chạy được.</p>' },
});

const de2 = deJava({
  id: 'csd201-6-6-radix-trace',
  tieuDe: { en: 'LSD radix sort, one digit per pass — the slides’ trace', vi: 'LSD radix sort, mỗi lượt một chữ số — dấu vết như slide' },
  doKho: 'MEDIUM', phut: 25, dangBai: 'pe',
  khaiNiem: ['least significant digit first', 'a stable distribution per digit', 'd passes of O(n + 10)'],
  moTa: {
    en: `<p>Complete ${c('static String radix(int[] a)')} for non-negative integers: let d be the number of digits of the largest value; for the units, tens, hundreds … digit, distribute the values into ten buckets 0–9 <b>in order</b> and collect them back bucket by bucket (a stable pass). After each pass append ${c('"pass p (digit D): …"')} where D = 1, 10, 100, ….</p>`,
    vi: `<p>Hoàn thiện ${c('static String radix(int[] a)')} cho số nguyên không âm: gọi d là số chữ số của giá trị lớn nhất; với chữ số hàng đơn vị, chục, trăm …, phân các giá trị vào mười giỏ 0–9 <b>đúng thứ tự</b> rồi gom lại lần lượt từng giỏ (một lượt ổn định). Sau mỗi lượt nối ${c('"pass p (digit D): …"')} với D = 1, 10, 100, ….</p>`,
  },
  yeuCau: { en: ['d passes, each stable.', 'No comparison sort.'], vi: ['d lượt, mỗi lượt ổn định.', 'Không sắp xếp so sánh.'] },
  dauVao: { en: 'SORT values… per line.', vi: 'SORT các giá trị… mỗi dòng.' },
  dauRa: { en: 'One line per pass.', vi: 'Mỗi lượt một dòng.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no comparison sort in Radix', vi: 'không sắp xếp so sánh trong Radix', re: String.raw`\.sort\s*\(|\bPriorityQueue\b|\bTree(Map|Set)\b`, file: 'Radix' }],
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                int[] a = new int[p.length - 1];
                for (int i = 1; i < p.length; i++) {
                    a[i - 1] = n(i);
                }
                r = "\\n" + Radix.radix(a);`,
    }),
  },
  tep: {
    'Radix.java': j`
import java.util.ArrayList;
import java.util.List;

public class Radix {

    static String radix(int[] a) {
        //>> return ""; // TODO
        StringBuilder sb = new StringBuilder();
        int max = 0;
        for (int x : a) {
            max = Math.max(max, x);
        }
        int pass = 1;
        for (long d = 1; d == 1 || max / d > 0; d *= 10, pass++) {
            List<List<Integer>> buckets = new ArrayList<>();
            for (int b = 0; b < 10; b++) {
                buckets.add(new ArrayList<Integer>());
            }
            for (int x : a) {
                buckets.get((int) (x / d % 10)).add(x); // in order: stable
            }
            int k = 0;
            for (List<Integer> b : buckets) {
                for (int x : b) {
                    a[k++] = x;
                }
            }
            sb.append("pass ").append(pass).append(" (digit ").append(d).append("):");
            for (int x : a) {
                sb.append(' ').append(x);
            }
            sb.append('\n');
        }
        return sb.toString().trim();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ example', vi: 'ví dụ của slide' }, vao: 'SORT 170 45 75 90 802 24 2 66\nSORT 329 457 657 839 436 720 355\n' },
    { ten: { en: 'single digits, zeros, different lengths', vi: 'một chữ số, số 0, độ dài khác nhau' }, vao: 'SORT 3 1 2\nSORT 0 0 0\nSORT 1000 1 100 10\n', an: true },
  ],
  goiY: [
    { en: 'The digit at position d of x is (x / d) % 10 with d = 1, 10, 100, …', vi: 'Chữ số ở vị trí d của x là (x / d) % 10 với d = 1, 10, 100, …' },
    { en: 'The number of passes is the number of digits of the maximum (at least one pass, even when all values are 0).', vi: 'Số lượt là số chữ số của giá trị lớn nhất (ít nhất một lượt, kể cả khi mọi giá trị đều 0).' },
  ],
  loiHayGap: [
    { en: 'Starting with the most significant digit and then only re-sorting the whole array — the earlier passes are destroyed.', vi: 'Bắt đầu từ chữ số cao nhất rồi chỉ sắp lại cả mảng — các lượt trước bị phá.' },
    { en: 'A non-stable distribution (e.g. pushing onto stacks) — the order from the previous digit is lost.', vi: 'Phân giỏ không ổn định (vd đẩy vào ngăn xếp) — mất thứ tự của chữ số trước.' },
  ],
  giaiThich: { en: '<p>After pass p the array is sorted by the last p digits, because each pass is stable: ties on the current digit keep the order produced by the lower digits. d passes of O(n + 10): O(d·n), linear for fixed-width keys.</p>', vi: '<p>Sau lượt p mảng đã sắp theo p chữ số cuối, vì mỗi lượt ổn định: bằng nhau ở chữ số hiện tại thì giữ thứ tự do các chữ số thấp hơn tạo ra. d lượt, mỗi lượt O(n + 10): O(d·n), tuyến tính với khoá có độ dài cố định.</p>' },
});

const de3 = deJava({
  id: 'csd201-6-6-bucket-sort',
  tieuDe: { en: 'Bucket sort for real numbers in [0, 1)', vi: 'Bucket sort cho số thực trong [0, 1)' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['n buckets of width 1/n', 'expected O(1) values per bucket', 'insertion sort inside a bucket'],
  moTa: {
    en: `<p>Complete ${c('static void bucketSort(double[] a)')}: create n buckets, put each value x into bucket ${c('(int) (x * n)')}, sort every bucket with insertion sort, then concatenate the buckets. For uniformly spread values every bucket holds O(1) values on average: expected O(n). The complexity check sorts a million uniform values.</p>`,
    vi: `<p>Hoàn thiện ${c('static void bucketSort(double[] a)')}: tạo n giỏ, đặt mỗi giá trị x vào giỏ ${c('(int) (x * n)')}, sắp từng giỏ bằng sắp chèn, rồi nối các giỏ. Với giá trị phân bố đều, trung bình mỗi giỏ có O(1) giá trị: O(n) kỳ vọng. Kiểm độ phức tạp sắp một triệu giá trị phân bố đều.</p>`,
  },
  yeuCau: { en: ['n buckets; insertion sort inside each; no library sort (rule R1).', 'Values satisfy 0 ≤ x < 1.'], vi: ['n giỏ; sắp chèn trong mỗi giỏ; không sort thư viện (luật R1).', 'Giá trị thoả 0 ≤ x < 1.'] },
  dauVao: { en: 'SORT values… / PERF.', vi: 'SORT các giá trị… / PERF.' },
  dauRa: { en: 'The sorted values.', vi: 'Các giá trị đã sắp.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no library sort in Buckets', vi: 'không sort thư viện trong Buckets', re: String.raw`\.sort\s*\(|\bPriorityQueue\b|\bTree(Map|Set)\b`, file: 'Buckets' }],
  hen: { n: '1,000,000 uniform values', ms: 4000, can: 'O(n) expected', cham: 'insertion sort on the whole array (O(n²))' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    int[] r0 = Kiem.ngauNhien(1000000, 1000000000, 101);
                    final double[] a = new double[r0.length];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = r0[i] / 1e9;
                    }
                    r = Kiem.hen("1,000,000 values", 4000, new Runnable() {
                        public void run() {
                            Buckets.bucketSort(a);
                        }
                    });
                    boolean ok = true;
                    for (int i = 1; i < a.length; i++) {
                        ok &= a[i - 1] <= a[i];
                    }
                    r += ", sorted " + ok;
                } else {
                    double[] a = new double[p.length - 1];
                    for (int i = 1; i < p.length; i++) {
                        a[i - 1] = Double.parseDouble(p[i]);
                    }
                    Buckets.bucketSort(a);
                    r = Arrays.toString(a);
                }`,
    }),
  },
  tep: {
    'Buckets.java': j`
import java.util.ArrayList;
import java.util.List;

public class Buckets {

    static void bucketSort(double[] a) {
        //>> // TODO
        int n = a.length;
        List<List<Double>> b = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            b.add(new ArrayList<Double>());
        }
        for (double x : a) {
            b.get((int) (x * n)).add(x);
        }
        int k = 0;
        for (List<Double> bucket : b) {
            for (int i = 1; i < bucket.size(); i++) { // insertion sort of a (small) bucket
                double x = bucket.get(i);
                int j = i - 1;
                while (j >= 0 && bucket.get(j) > x) {
                    bucket.set(j + 1, bucket.get(j));
                    j--;
                }
                bucket.set(j + 1, x);
            }
            for (double x : bucket) {
                a[k++] = x;
            }
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the textbook example', vi: 'ví dụ của giáo trình' }, vao: 'SORT 0.78 0.17 0.39 0.26 0.72 0.94 0.21 0.12 0.23 0.68\nSORT 0.5\n' },
    { ten: { en: 'clustered values in one bucket, zeros', vi: 'giá trị dồn vào một giỏ, số 0' }, vao: 'SORT 0.11 0.13 0.12 0.111 0.119\nSORT 0.0 0.999 0.0 0.5\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Bucket i covers [i/n, (i+1)/n): (int)(x * n) is always between 0 and n − 1 for 0 ≤ x < 1.', vi: 'Giỏ i phủ [i/n, (i+1)/n): (int)(x * n) luôn nằm giữa 0 và n − 1 với 0 ≤ x < 1.' },
    { en: 'Buckets are already in increasing order: concatenating sorted buckets gives a sorted array.', vi: 'Các giỏ đã theo thứ tự tăng: nối các giỏ đã sắp cho mảng đã sắp.' },
  ],
  loiHayGap: [
    { en: 'Using 10 buckets for any n — each bucket holds n/10 values and the insertion sorts become quadratic.', vi: 'Dùng 10 giỏ với mọi n — mỗi giỏ chứa n/10 giá trị và các lượt sắp chèn thành bậc hai.' },
    { en: 'Bucket index (int)(x * (n − 1)) — still correct, but the bucket boundaries no longer match the slides.', vi: 'Chỉ số giỏ (int)(x * (n − 1)) — vẫn đúng nhưng ranh giới giỏ không còn khớp slide.' },
  ],
  giaiThich: { en: '<p>With uniform input the expected sum of squared bucket sizes is O(n), so all the insertion sorts together cost O(n) on average. A skewed input (everything in one bucket) falls back to insertion sort’s O(n²) — bucket sort is fast only when the distribution is known.</p>', vi: '<p>Với dữ liệu đều, tổng bình phương kích thước giỏ kỳ vọng là O(n), nên mọi lượt sắp chèn cộng lại trung bình O(n). Dữ liệu lệch (tất cả vào một giỏ) quay về O(n²) của sắp chèn — bucket sort chỉ nhanh khi biết trước phân bố.</p>' },
});

export default moDun({ slug: 'csd201-sap-xep-tuyen-tinh', ten: '6.6 Linear-time sorting: bucket & radix', de: [de1, de2, de3] });
