/** CSD201 · 6.3 — Quick sort: phân hoạch Lomuto in từng bước kiểu PE, quick sort trung vị của ba + đệ quy nửa nhỏ (kiểm dữ liệu đã sắp), quickselect phần tử nhỏ thứ k (kiểm O(n) trung bình). */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-6-3-lomuto-trace',
  tieuDe: { en: 'Lomuto partition: the pivot’s final index and the array after each partition', vi: 'Phân hoạch Lomuto: chỉ số cuối của chốt và mảng sau mỗi lần phân hoạch' },
  doKho: 'MEDIUM', phut: 25, dangBai: 'pe',
  khaiNiem: ['pivot = last element', 'i marks the end of the "smaller" zone', 'the pivot lands in its final place', 'recursion on both sides'],
  moTa: {
    en: `<p>Complete in ${c('Quick')}:</p>
<ul><li>${c('static int partition(int[] a, int lo, int hi)')} — Lomuto: pivot ${c('x = a[hi]')}; ${c('i = lo − 1')}; for j = lo … hi−1, if ${c('a[j] <= x')} then i++ and swap a[i], a[j]; finally swap a[i+1] and a[hi] and return i + 1;</li>
<li>${c('static void sort(int[] a, int lo, int hi, StringBuilder log)')} — quick sort with that partition; after <b>every</b> partition append a line ${c('"pivot P at k: …array…"')}.</li></ul>`,
    vi: `<p>Hoàn thiện trong ${c('Quick')}: ${c('partition(a, lo, hi)')} — Lomuto: chốt ${c('x = a[hi]')}; ${c('i = lo − 1')}; với j = lo … hi−1, nếu ${c('a[j] <= x')} thì i++ và đổi a[i], a[j]; cuối cùng đổi a[i+1] với a[hi] và trả i + 1; ${c('sort(a, lo, hi, log)')} — quick sort với phân hoạch đó; sau <b>mỗi</b> lần phân hoạch nối dòng ${c('"pivot P at k: …mảng…"')}.</p>`,
  },
  yeuCau: { en: ['Exactly the Lomuto scheme (the trace depends on it).', 'Recurse on the left part first.'], vi: ['Đúng sơ đồ Lomuto (dấu vết phụ thuộc vào nó).', 'Đệ quy phần trái trước.'] },
  dauVao: { en: 'SORT values… per line.', vi: 'SORT các giá trị… mỗi dòng.' },
  dauRa: { en: 'One line per partition, then the sorted array.', vi: 'Mỗi lần phân hoạch một dòng, rồi mảng đã sắp.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                int[] a = new int[p.length - 1];
                for (int i = 1; i < p.length; i++) {
                    a[i - 1] = n(i);
                }
                StringBuilder log = new StringBuilder();
                Quick.sort(a, 0, a.length - 1, log);
                r = "\\n" + log + "sorted " + Arrays.toString(a);`,
    }),
  },
  tep: {
    'Quick.java': j`
public class Quick {

    static int partition(int[] a, int lo, int hi) {
        //>> return lo; // TODO
        int x = a[hi];
        int i = lo - 1;
        for (int j = lo; j < hi; j++) {
            if (a[j] <= x) {
                i++;
                int t = a[i];
                a[i] = a[j];
                a[j] = t;
            }
        }
        int t = a[i + 1];
        a[i + 1] = a[hi];
        a[hi] = t;
        return i + 1;
        //<<
    }

    static void sort(int[] a, int lo, int hi, StringBuilder log) {
        //>> // TODO
        if (lo >= hi) {
            return;
        }
        int k = partition(a, lo, hi);
        log.append("pivot ").append(a[k]).append(" at ").append(k).append(':');
        for (int v : a) {
            log.append(' ').append(v);
        }
        log.append('\n');
        sort(a, lo, k - 1, log);
        sort(a, k + 1, hi, log);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the textbook example', vi: 'ví dụ của giáo trình' }, vao: 'SORT 2 8 7 1 3 5 6 4\nSORT 3 1 2\n' },
    { ten: { en: 'duplicates, sorted input, one element', vi: 'giá trị trùng, đã sắp, một phần tử' }, vao: 'SORT 5 5 1 5\nSORT 1 2 3 4\nSORT 9\n', an: true },
  ],
  goiY: [
    { en: 'Invariant: a[lo..i] ≤ x, a[i+1..j−1] > x. Each a[j] ≤ x grows the first zone by one swap.', vi: 'Bất biến: a[lo..i] ≤ x, a[i+1..j−1] > x. Mỗi a[j] ≤ x làm vùng đầu lớn thêm bằng một lần đổi chỗ.' },
    { en: 'The final swap puts the pivot between the two zones — its final sorted position.', vi: 'Lần đổi cuối đặt chốt giữa hai vùng — chính vị trí cuối cùng của nó khi đã sắp.' },
  ],
  loiHayGap: [
    { en: 'Using < instead of <= — with duplicates the trace differs.', vi: 'Dùng < thay vì <= — với giá trị trùng, dấu vết khác đi.' },
    { en: 'Recursing on (lo, k) instead of (lo, k − 1) — the pivot is processed again, endless recursion on duplicates.', vi: 'Đệ quy (lo, k) thay vì (lo, k − 1) — chốt bị xử lý lại, đệ quy vô tận với giá trị trùng.' },
  ],
  giaiThich: { en: '<p>Each partition is one linear pass and fixes the pivot for good. Balanced splits give log n levels of O(n) work: O(n log n); a sorted input with the last element as pivot gives n levels: Θ(n²) — see the next exercise.</p>', vi: '<p>Mỗi lần phân hoạch là một lượt tuyến tính và cố định chốt mãi mãi. Chia cân bằng cho log n tầng, mỗi tầng O(n): O(n log n); dữ liệu đã sắp với chốt là phần tử cuối cho n tầng: Θ(n²) — xem bài sau.</p>' },
});

const de2 = deJava({
  id: 'csd201-6-3-quicksort-robust',
  tieuDe: { en: 'A quick sort that survives sorted input: median of three, recurse on the smaller side', vi: 'Quick sort chịu được dữ liệu đã sắp: trung vị của ba, đệ quy phía nhỏ hơn' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['median-of-three pivot', 'Hoare-style partition', 'recursion depth O(log n) by looping on the larger part'],
  moTa: {
    en: `<p>Complete ${c('static void sort(int[] a)')}: a quick sort that stays O(n log n) on sorted, reversed and all-equal arrays of two million elements.</p>
<ul><li>pivot = the median of ${c('a[lo]')}, ${c('a[mid]')}, ${c('a[hi]')};</li>
<li>partition with two indexes moving towards each other (Hoare): elements equal to the pivot go to both sides, so all-equal arrays split in half;</li>
<li>recurse on the <b>smaller</b> part and loop on the larger one — the recursion depth stays below log₂ n.</li></ul>`,
    vi: `<p>Hoàn thiện ${c('static void sort(int[] a)')}: một quick sort giữ O(n log n) với mảng hai triệu phần tử đã sắp, sắp ngược và toàn bằng nhau. Chốt = trung vị của ${c('a[lo]')}, ${c('a[mid]')}, ${c('a[hi]')}; phân hoạch bằng hai chỉ số tiến về nhau (Hoare): phần tử bằng chốt đi về cả hai phía, nên mảng toàn bằng nhau chia đôi; đệ quy phần <b>nhỏ hơn</b> và lặp trên phần lớn hơn — độ sâu đệ quy dưới log₂ n.</p>`,
  },
  yeuCau: { en: ['No library sort (rule R1).', 'O(n log n) on the three adversarial inputs.'], vi: ['Không sort thư viện (luật R1).', 'O(n log n) với ba dữ liệu "xấu".'] },
  dauVao: { en: 'SORT values… / PERF.', vi: 'SORT các giá trị… / PERF.' },
  dauRa: { en: 'The sorted array / timing verdicts.', vi: 'Mảng đã sắp / kết luận về thời gian.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no library sort in QuickSort', vi: 'không sort thư viện trong QuickSort', re: String.raw`\.sort\s*\(|\bPriorityQueue\b|\bTreeMap\b`, file: 'QuickSort' }],
  hen: { n: '2,000,000 sorted / reversed / equal values', ms: 4000, can: 'O(n log n)', cham: 'O(n²) (first or last element as pivot, or Lomuto on equal keys)', en: 'A naive pivot also recurses two million levels deep and overflows the stack.', vi: 'Chốt ngây thơ còn đệ quy sâu hai triệu tầng và tràn ngăn xếp.' },
  harness: {
    'KiemTra.java': lopKiem({
      them: `
    static String check(final int[] a, String label) {
        String v = Kiem.hen(label, 4000, new Runnable() {
            public void run() {
                QuickSort.sort(a);
            }
        });
        boolean ok = true;
        for (int i = 1; i < a.length; i++) {
            ok &= a[i - 1] <= a[i];
        }
        return v + (ok ? "" : " (NOT sorted)");
    }
`,
      lenh: `                if (p[0].equals("PERF")) {
                    int n = 2000000;
                    int[] s = new int[n], rv = new int[n], eq = new int[n];
                    for (int i = 0; i < n; i++) {
                        s[i] = i;
                        rv[i] = n - i;
                        eq[i] = 7;
                    }
                    r = check(s, "sorted") + "; " + check(rv, "reversed") + "; " + check(eq, "all equal") + "; " + check(Kiem.ngauNhien(n, 1000000000, 3), "random");
                } else {
                    int[] a = new int[p.length - 1];
                    for (int i = 1; i < p.length; i++) {
                        a[i - 1] = n(i);
                    }
                    QuickSort.sort(a);
                    r = Arrays.toString(a);
                }`,
    }),
  },
  tep: {
    'QuickSort.java': j`
public class QuickSort {

    static void sort(int[] a) {
        //>> // TODO
        sort(a, 0, a.length - 1);
        //<<
    }
    //>> // TODO: helper(s)

    private static void sort(int[] a, int lo, int hi) {
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            int x = median(a[lo], a[mid], a[hi]);
            int i = lo, j = hi;
            while (i <= j) { // Hoare-style: equal keys stop both scans, so they spread to both sides
                while (a[i] < x) {
                    i++;
                }
                while (a[j] > x) {
                    j--;
                }
                if (i <= j) {
                    int t = a[i];
                    a[i] = a[j];
                    a[j] = t;
                    i++;
                    j--;
                }
            }
            if (j - lo < hi - i) { // recurse on the smaller part, loop on the larger
                sort(a, lo, j);
                lo = i;
            } else {
                sort(a, i, hi);
                hi = j;
            }
        }
    }

    private static int median(int x, int y, int z) {
        return Math.max(Math.min(x, y), Math.min(Math.max(x, y), z));
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'small arrays', vi: 'mảng nhỏ' }, vao: 'SORT 2 8 7 1 3 5 6 4\nSORT 5 5 5 5\nSORT 9 8 7 6 5 4 3 2 1\n' },
    { ten: { en: 'negatives, duplicates, two elements', vi: 'số âm, giá trị trùng, hai phần tử' }, vao: 'SORT 0 -3 7 -3 0 2\nSORT 2 1\nSORT 1\n', an: true },
    { ten: { en: 'complexity check (four inputs)', vi: 'kiểm độ phức tạp (bốn bộ dữ liệu)' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Median of three: max(min(x, y), min(max(x, y), z)). On sorted input it picks the middle element — a perfect split.', vi: 'Trung vị của ba: max(min(x, y), min(max(x, y), z)). Với dữ liệu đã sắp nó chọn phần tử giữa — chia đôi hoàn hảo.' },
    { en: 'In the Hoare scans use strict < and > against the pivot so that equal keys stop both indexes and get swapped across.', vi: 'Trong hai lượt quét Hoare dùng < và > hẳn so với chốt để khoá bằng nhau dừng cả hai chỉ số và được đổi chéo.' },
  ],
  loiHayGap: [
    { en: 'Lomuto with <= on all-equal data puts everything on one side: Θ(n²) and a recursion as deep as n.', vi: 'Lomuto với <= trên dữ liệu toàn bằng nhau dồn hết về một phía: Θ(n²) và đệ quy sâu bằng n.' },
    { en: 'Recursing on both parts — the depth can still reach n on unlucky data.', vi: 'Đệ quy cả hai phần — độ sâu vẫn có thể tới n với dữ liệu xui.' },
  ],
  giaiThich: { en: '<p>Median-of-three removes the sorted/reversed worst case, the Hoare partition splits runs of equal keys evenly, and recursing only on the smaller part bounds the stack by log₂ n. This is essentially what java.util.Arrays.sort(int[]) does (dual-pivot quicksort).</p>', vi: '<p>Trung vị của ba loại bỏ trường hợp xấu khi dữ liệu đã sắp/ngược, phân hoạch Hoare chia đều các dãy khoá bằng nhau, và chỉ đệ quy phần nhỏ hơn chặn ngăn xếp ở log₂ n. Đây về cơ bản là điều java.util.Arrays.sort(int[]) làm (quicksort hai chốt).</p>' },
});

const de3 = deJava({
  id: 'csd201-6-3-quickselect',
  tieuDe: { en: 'Quickselect: the k-th smallest without sorting everything', vi: 'Quickselect: phần tử nhỏ thứ k mà không cần sắp tất cả' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['partition, then go to one side only', 'expected O(n)', 'random or median-of-three pivot'],
  moTa: {
    en: `<p>Complete ${c('static int select(int[] a, int k)')}: the k-th smallest value (k = 1 is the minimum) in expected O(n). Partition as in quick sort, then continue <b>only</b> in the part that contains position k − 1 (a loop, no recursion needed). a may be reordered.</p>
<p>The complexity check asks for 20 medians of a million values: sorting each time would be 20 × n log n; quickselect is about 20 × 2n.</p>`,
    vi: `<p>Hoàn thiện ${c('static int select(int[] a, int k)')}: giá trị nhỏ thứ k (k = 1 là nhỏ nhất) trong O(n) kỳ vọng. Phân hoạch như quick sort, rồi <b>chỉ</b> tiếp tục ở phần chứa vị trí k − 1 (một vòng lặp, không cần đệ quy). Được phép đổi thứ tự a.</p>
<p>Kiểm độ phức tạp hỏi 20 trung vị của một triệu giá trị: sắp mỗi lần là 20 × n log n; quickselect khoảng 20 × 2n.</p>`,
  },
  yeuCau: { en: ['No sorting (rule R1).', 'Expected O(n): pick the pivot as the median of three.'], vi: ['Không sắp xếp (luật R1).', 'O(n) kỳ vọng: chọn chốt bằng trung vị của ba.'] },
  dauVao: { en: 'Lines "k : values"; PERF.', vi: 'Các dòng "k : giá trị"; PERF.' },
  dauRa: { en: 'The k-th smallest.', vi: 'Giá trị nhỏ thứ k.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no sorting in Select', vi: 'không sắp xếp trong Select', re: String.raw`\.sort\s*\(|\bPriorityQueue\b|\bTreeMap\b|\bTreeSet\b`, file: 'Select' }],
  hen: { n: '20 medians of 1,000,000 values', ms: 3000, can: 'O(n) expected per query', cham: 'sorting for every query or a k·n scan' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] base = Kiem.ngauNhien(1000000, 1000000000, 71);
                    final long[] s = new long[1];
                    r = Kiem.hen("20 medians of 1,000,000", 3000, new Runnable() {
                        public void run() {
                            for (int q = 0; q < 20; q++) {
                                s[0] += Select.select(base.clone(), 500000 + q);
                            }
                        }
                    }) + ", checksum " + s[0];
                } else {
                    int[] a = new int[p.length - 2];
                    for (int i = 2; i < p.length; i++) {
                        a[i - 2] = n(i);
                    }
                    r = String.valueOf(Select.select(a, n(0)));
                }`,
    }),
  },
  tep: {
    'Select.java': j`
public class Select {

    static int select(int[] a, int k) {
        //>> return 0; // TODO
        int lo = 0, hi = a.length - 1, target = k - 1;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            int x = Math.max(Math.min(a[lo], a[mid]), Math.min(Math.max(a[lo], a[mid]), a[hi]));
            int i = lo, j = hi;
            while (i <= j) {
                while (a[i] < x) {
                    i++;
                }
                while (a[j] > x) {
                    j--;
                }
                if (i <= j) {
                    int t = a[i];
                    a[i] = a[j];
                    a[j] = t;
                    i++;
                    j--;
                }
            }
            if (target <= j) {
                hi = j;
            } else if (target >= i) {
                lo = i;
            } else {
                return a[target]; // between j and i: equal to the pivot
            }
        }
        return a[target];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'minimum, maximum, median', vi: 'nhỏ nhất, lớn nhất, trung vị' }, vao: '1 : 7 2 9 4 1 8\n6 : 7 2 9 4 1 8\n3 : 7 2 9 4 1 8\n1 : 5\n' },
    { ten: { en: 'duplicates and negatives', vi: 'giá trị trùng và số âm' }, vao: '2 : 3 3 3 1\n4 : 3 3 3 1\n3 : -1 -5 -3 0\n5 : 9 8 7 6 5 4 3 2 1\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'After partitioning a[lo..hi] into a[lo..j] ≤ pivot ≤ a[i..hi], the answer is in the side containing index k − 1.', vi: 'Sau khi phân hoạch a[lo..hi] thành a[lo..j] ≤ chốt ≤ a[i..hi], đáp án nằm ở phía chứa chỉ số k − 1.' },
    { en: 'Positions strictly between j and i hold the pivot value itself.', vi: 'Các vị trí nằm hẳn giữa j và i chứa chính giá trị chốt.' },
  ],
  loiHayGap: [
    { en: 'Sorting the array and returning a[k − 1] — correct, but O(n log n) per query and forbidden here.', vi: 'Sắp mảng rồi trả a[k − 1] — đúng nhưng O(n log n) mỗi lần và bị cấm ở đây.' },
    { en: 'Off by one between "k-th smallest" (1-based) and the index k − 1.', vi: 'Lệch một giữa "nhỏ thứ k" (đếm từ 1) và chỉ số k − 1.' },
  ],
  giaiThich: { en: '<p>Each round keeps only one side of the partition, so the expected work is n + n/2 + n/4 + … ≈ 2n: O(n), against O(n log n) for sorting. The worst case is still O(n²) (median of medians would make it O(n) guaranteed), but a good pivot makes it practically linear.</p>', vi: '<p>Mỗi vòng chỉ giữ một phía của phân hoạch, nên công việc kỳ vọng là n + n/2 + n/4 + … ≈ 2n: O(n), so với O(n log n) của sắp xếp. Trường hợp xấu nhất vẫn là O(n²) (trung vị của các trung vị mới bảo đảm O(n)), nhưng chốt tốt làm nó gần như tuyến tính trong thực tế.</p>' },
});

export default moDun({ slug: 'csd201-quicksort', ten: '6.3 Quick-sort: partitioning in detail', de: [de1, de2, de3] });
