/** CSD201 · 6.7 — Chọn thuật toán sắp xếp: lá cờ Hà Lan một lượt, số lần đổi chỗ ít nhất để sắp một hoán vị (chu trình), sắp một lần + tìm nhị phân cho q truy vấn (kiểm độ phức tạp). */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-6-7-dutch-flag',
  tieuDe: { en: 'The Dutch national flag: sort 0s, 1s and 2s in one pass', vi: 'Lá cờ Hà Lan: sắp các số 0, 1, 2 trong một lượt' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['three-way partition', 'invariant with three pointers lo, mid, hi', 'one pass, O(1) memory'],
  moTa: {
    en: `<p>An array contains only 0, 1 and 2. Complete ${c('static int sortColors(int[] a)')}: sort it in place in <b>one pass</b> with three indexes (Dijkstra’s three-way partition) and return the number of swaps you made. Invariant: ${c('a[0..lo-1] = 0')}, ${c('a[lo..mid-1] = 1')}, ${c('a[hi+1..n-1] = 2')}, ${c('a[mid..hi]')} unknown. At ${c('a[mid]')}: 0 → swap with lo, lo++, mid++; 1 → mid++; 2 → swap with hi, hi-- (do not move mid: the value that arrived is unknown).</p>`,
    vi: `<p>Mảng chỉ gồm 0, 1 và 2. Hoàn thiện ${c('static int sortColors(int[] a)')}: sắp tại chỗ trong <b>một lượt</b> với ba chỉ số (phân hoạch ba ngả của Dijkstra) và trả về số lần đã đổi chỗ. Bất biến: ${c('a[0..lo-1] = 0')}, ${c('a[lo..mid-1] = 1')}, ${c('a[hi+1..n-1] = 2')}, ${c('a[mid..hi]')} chưa biết. Tại ${c('a[mid]')}: 0 → đổi với lo, lo++, mid++; 1 → mid++; 2 → đổi với hi, hi-- (không dời mid: giá trị vừa tới chưa biết).</p>`,
  },
  yeuCau: { en: ['One pass, in place; no counting array (rule R1).', 'Count every swap, even a swap of a cell with itself.'], vi: ['Một lượt, tại chỗ; không mảng đếm (luật R1).', 'Đếm mọi lần đổi chỗ, kể cả đổi một ô với chính nó.'] },
  dauVao: { en: 'One array per line.', vi: 'Mỗi dòng một mảng.' },
  dauRa: { en: 'The sorted array and the swaps.', vi: 'Mảng đã sắp và số lần đổi chỗ.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'one pass with three pointers: no count array, no library sort in Flag', vi: 'một lượt với ba con trỏ: không mảng đếm, không sort thư viện trong Flag', re: String.raw`\bnew\s+int\s*\[|\.sort\s*\(`, file: 'Flag' }],
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                int[] a = new int[p.length];
                for (int i = 0; i < p.length; i++) {
                    a[i] = n(i);
                }
                int s = Flag.sortColors(a);
                r = Arrays.toString(a) + " swaps " + s;`,
    }),
  },
  tep: {
    'Flag.java': j`
public class Flag {

    static int sortColors(int[] a) {
        //>> return 0; // TODO
        int lo = 0, mid = 0, hi = a.length - 1, swaps = 0;
        while (mid <= hi) {
            if (a[mid] == 0) {
                int t = a[lo];
                a[lo] = a[mid];
                a[mid] = t;
                lo++;
                mid++;
                swaps++;
            } else if (a[mid] == 1) {
                mid++;
            } else {
                int t = a[hi];
                a[hi] = a[mid];
                a[mid] = t;
                hi--;
                swaps++;
            }
        }
        return swaps;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the classic example', vi: 'ví dụ kinh điển' }, vao: '2 0 2 1 1 0\n2 0 1\n0 1 2\n' },
    { ten: { en: 'one colour, two colours', vi: 'một màu, hai màu' }, vao: '1 1 1\n2 2 0 0\n0\n2 1 2 1\n', an: true },
  ],
  goiY: [
    { en: 'Keep three regions: 0s before lo, 1s from lo to mid−1, 2s after hi. Look only at a[mid].', vi: 'Giữ ba vùng: số 0 trước lo, số 1 từ lo tới mid−1, số 2 sau hi. Chỉ xem a[mid].' },
    { en: 'After swapping with hi, the new a[mid] has not been examined yet — stay on mid.', vi: 'Sau khi đổi với hi, a[mid] mới chưa được xét — giữ nguyên mid.' },
  ],
  loiHayGap: [
    { en: 'Advancing mid after a swap with hi — a 0 coming from the end stays in the middle.', vi: 'Tăng mid sau khi đổi với hi — số 0 đến từ cuối mảng kẹt lại ở giữa.' },
    { en: 'Counting the 0s, 1s, 2s and rewriting — two passes, and it does not generalise to records.', vi: 'Đếm số 0, 1, 2 rồi ghi lại — hai lượt, và không áp dụng được cho bản ghi.' },
  ],
  giaiThich: { en: '<p>Every step either moves mid forward or hi backward, so there are at most n steps: O(n), O(1) memory. The same three-way partition makes quicksort fast on keys with many duplicates.</p>', vi: '<p>Mỗi bước hoặc tăng mid hoặc giảm hi, nên có tối đa n bước: O(n), O(1) bộ nhớ. Cùng phép phân hoạch ba ngả này giúp quicksort nhanh với khoá có nhiều giá trị trùng.</p>' },
});

const de2 = deJava({
  id: 'csd201-6-7-min-swaps',
  tieuDe: { en: 'The minimum number of swaps to sort a permutation (count the cycles)', vi: 'Số lần đổi chỗ ít nhất để sắp một hoán vị (đếm chu trình)' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['permutation cycles', 'swaps = n − number of cycles', 'O(n) with a visited array'],
  moTa: {
    en: `<p>${c('a')} is a permutation of ${c('0..n-1')}. Complete ${c('static long minSwaps(int[] a)')}: the minimum number of swaps (of any two elements) that sorts it. Follow i → a[i] → a[a[i]] → … : the permutation splits into cycles, and a cycle of length L needs exactly L − 1 swaps. Answer = n − (number of cycles).</p>
<p>Simulating selection sort (n − 1 passes of a minimum search) gives the same number but costs O(n²); the complexity check uses n = 2,000,000.</p>`,
    vi: `<p>${c('a')} là một hoán vị của ${c('0..n-1')}. Hoàn thiện ${c('static long minSwaps(int[] a)')}: số lần đổi chỗ (hai phần tử bất kỳ) ít nhất để sắp nó. Đi theo i → a[i] → a[a[i]] → … : hoán vị tách thành các chu trình, chu trình dài L cần đúng L − 1 lần đổi. Đáp án = n − (số chu trình).</p>
<p>Mô phỏng sắp chọn (n − 1 lượt tìm min) cho cùng con số nhưng tốn O(n²); kiểm độ phức tạp dùng n = 2.000.000.</p>`,
  },
  yeuCau: { en: ['O(n) with a visited array.', 'Do not modify a.'], vi: ['O(n) với mảng đánh dấu.', 'Không sửa a.'] },
  dauVao: { en: 'One permutation per line; PERF.', vi: 'Mỗi dòng một hoán vị; PERF.' },
  dauRa: { en: 'The minimum number of swaps.', vi: 'Số lần đổi chỗ ít nhất.' },
  main: 'KiemTra',
  hen: { n: '2,000,000', ms: 3000, can: 'O(n)', cham: 'O(n²) (simulating selection sort)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] a = new int[2000000];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = (int) ((i * 1000003L) % a.length);
                    }
                    final long[] s = new long[1];
                    r = Kiem.hen("n = 2,000,000", 3000, new Runnable() {
                        public void run() {
                            s[0] = Swaps.minSwaps(a);
                        }
                    }) + ", swaps " + s[0];
                } else {
                    int[] a = new int[p.length];
                    for (int i = 0; i < p.length; i++) {
                        a[i] = n(i);
                    }
                    String before = Arrays.toString(a);
                    r = Swaps.minSwaps(a) + (before.equals(Arrays.toString(a)) ? "" : " (a was CHANGED)");
                }`,
    }),
  },
  tep: {
    'Swaps.java': j`
public class Swaps {

    static long minSwaps(int[] a) {
        //>> return 0; // TODO
        int n = a.length;
        boolean[] seen = new boolean[n];
        long cycles = 0;
        for (int i = 0; i < n; i++) {
            if (seen[i]) {
                continue;
            }
            cycles++;
            for (int j = i; !seen[j]; j = a[j]) {
                seen[j] = true;
            }
        }
        return n - cycles;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'small permutations', vi: 'hoán vị nhỏ' }, vao: '0 1 2 3\n1 0 3 2\n1 2 3 0\n4 3 2 1 0\n' },
    { ten: { en: 'one element, a long cycle and fixed points', vi: 'một phần tử, một chu trình dài và điểm bất động' }, vao: '0\n2 0 1 3 5 4\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Each swap that puts one element in its final place can be chosen so that it splits a cycle into a fixed point and a shorter cycle.', vi: 'Mỗi lần đổi đưa một phần tử về đúng chỗ có thể chọn sao cho nó tách một chu trình thành một điểm bất động và một chu trình ngắn hơn.' },
    { en: 'Count cycles by walking from every unvisited i and marking along the way.', vi: 'Đếm chu trình bằng cách đi từ mọi i chưa thăm và đánh dấu dọc đường.' },
  ],
  loiHayGap: [
    { en: 'Counting the inversions — that is the number of ADJACENT swaps (bubble sort), not of arbitrary swaps.', vi: 'Đếm nghịch thế — đó là số lần đổi hai phần tử KỀ NHAU (bubble sort), không phải đổi hai phần tử bất kỳ.' },
    { en: 'Sorting a to compare — the permutation already tells where each element belongs.', vi: 'Sắp a để so — hoán vị đã cho biết mỗi phần tử thuộc về đâu.' },
  ],
  giaiThich: { en: '<p>A swap can increase the number of cycles by at most one, and the sorted permutation has n cycles (all fixed points); so at least n − c swaps are needed, and selection-style swaps achieve it. Walking each cycle once is O(n). This is also why selection sort performs the minimum number of swaps among comparison sorts.</p>', vi: '<p>Một lần đổi tăng số chu trình tối đa một, và hoán vị đã sắp có n chu trình (toàn điểm bất động); nên cần ít nhất n − c lần đổi, và cách đổi kiểu sắp chọn đạt được con số đó. Đi mỗi chu trình một lần là O(n). Đây cũng là lý do sắp chọn đổi chỗ ít nhất trong các thuật toán sắp xếp so sánh.</p>' },
});

const de3 = deJava({
  id: 'csd201-6-7-sort-then-search',
  tieuDe: { en: 'Sort once, search many: a million membership queries', vi: 'Sắp một lần, tìm nhiều lần: một triệu truy vấn có/không' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['preprocessing cost vs query cost', 'O(n log n + q log n)', 'lower bound search'],
  moTa: {
    en: `<p>Complete ${c('static int[] countPresent(int[] data, int[] queries)')}: for every query, how many times it occurs in ${c('data')}. Sort a copy of data once (${c('Arrays.sort')} is allowed), then answer each query with two binary searches (first position ≥ q and first position &gt; q). No hash tables (rule R1) — the point is the sorted-array technique.</p>
<p>The complexity check has a million data values and a million queries: scanning data for every query would be 10¹² steps.</p>`,
    vi: `<p>Hoàn thiện ${c('static int[] countPresent(int[] data, int[] queries)')}: với mỗi truy vấn, nó xuất hiện bao nhiêu lần trong ${c('data')}. Sắp một bản sao của data một lần (được dùng ${c('Arrays.sort')}), rồi trả lời mỗi truy vấn bằng hai lần tìm nhị phân (vị trí đầu tiên ≥ q và vị trí đầu tiên &gt; q). Không dùng bảng băm (luật R1) — mục tiêu là kỹ thuật mảng đã sắp.</p>
<p>Kiểm độ phức tạp có một triệu giá trị dữ liệu và một triệu truy vấn: quét data cho từng truy vấn là 10¹² bước.</p>`,
  },
  yeuCau: { en: ['O((n + q) log n).', 'Your own binary searches (lower/upper bound).'], vi: ['O((n + q) log n).', 'Tự viết tìm nhị phân (cận dưới/cận trên).'] },
  dauVao: { en: 'Lines "data… | queries…"; PERF.', vi: 'Các dòng "dữ liệu… | truy vấn…"; PERF.' },
  dauRa: { en: 'The counts.', vi: 'Các số đếm.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no hash table in Present', vi: 'không bảng băm trong Present', re: String.raw`\bHash(Map|Set)\b|\bTree(Map|Set)\b|binarySearch`, file: 'Present' }],
  hen: { n: '1,000,000 values and 1,000,000 queries', ms: 3000, can: 'O((n + q) log n)', cham: 'O(n·q) (scanning for every query)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] d = Kiem.ngauNhien(1000000, 500000, 111), q = Kiem.ngauNhien(1000000, 600000, 112);
                    final int[][] res = new int[1][];
                    r = Kiem.hen("n = q = 1,000,000", 3000, new Runnable() {
                        public void run() {
                            res[0] = Present.countPresent(d, q);
                        }
                    });
                    if (res[0] != null) {
                        long s = 0;
                        for (int x : res[0]) {
                            s += x;
                        }
                        r += ", total " + s;
                    }
                } else {
                    int bar = Arrays.asList(p).indexOf("|");
                    int[] d = new int[bar], q = new int[p.length - bar - 1];
                    for (int i = 0; i < bar; i++) {
                        d[i] = n(i);
                    }
                    for (int i = bar + 1; i < p.length; i++) {
                        q[i - bar - 1] = n(i);
                    }
                    r = Arrays.toString(Present.countPresent(d, q));
                }`,
    }),
  },
  tep: {
    'Present.java': j`
import java.util.Arrays;

public class Present {

    static int[] countPresent(int[] data, int[] queries) {
        //>> return new int[queries.length]; // TODO
        int[] s = data.clone();
        Arrays.sort(s);
        int[] out = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            out[i] = firstAbove(s, queries[i]) - firstAtLeast(s, queries[i]);
        }
        return out;
        //<<
    }
    //>> // TODO: helper(s)

    // first index with s[i] >= x (s.length if none)
    private static int firstAtLeast(int[] s, int x) {
        int lo = 0, hi = s.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (s[mid] < x) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo;
    }

    // first index with s[i] > x
    private static int firstAbove(int[] s, int x) {
        int lo = 0, hi = s.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (s[mid] <= x) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'duplicates and missing values', vi: 'giá trị trùng và giá trị không có' }, vao: '5 3 5 1 5 3 | 5 3 1 2 9\n7 | 7 7 8\n' },
    { ten: { en: 'empty data, negatives, extremes', vi: 'dữ liệu rỗng, số âm, giá trị cực trị' }, vao: '| 1 2\n-1 -1 -2147483648 2147483647 | -1 2147483647 -2147483648 0\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'count(q) = (first index with value > q) − (first index with value ≥ q).', vi: 'count(q) = (chỉ số đầu tiên có giá trị > q) − (chỉ số đầu tiên có giá trị ≥ q).' },
    { en: 'Write the binary search with a half-open range [lo, hi) and hi = mid / lo = mid + 1 — it never loops forever.', vi: 'Viết tìm nhị phân với khoảng nửa mở [lo, hi) và hi = mid / lo = mid + 1 — không bao giờ lặp vô tận.' },
  ],
  loiHayGap: [
    { en: 'Finding one occurrence and walking left and right — O(n) per query when a value repeats a lot.', vi: 'Tìm một vị trí rồi đi sang trái, phải — O(n) mỗi truy vấn khi một giá trị lặp nhiều.' },
    { en: 'Sorting inside the query loop.', vi: 'Sắp xếp bên trong vòng truy vấn.' },
  ],
  giaiThich: { en: '<p>Sorting costs O(n log n) once; each query is then two O(log n) searches. For q queries the total O((n + q) log n) beats O(n·q) as soon as q exceeds log n — the core trade-off of choosing a structure: pay to organise the data, then query it cheaply.</p>', vi: '<p>Sắp xếp tốn O(n log n) một lần; mỗi truy vấn sau đó là hai lần tìm O(log n). Với q truy vấn, tổng O((n + q) log n) thắng O(n·q) ngay khi q vượt log n — sự đánh đổi cốt lõi khi chọn cấu trúc: trả giá để tổ chức dữ liệu, rồi truy vấn rẻ.</p>' },
});

export default moDun({ slug: 'csd201-so-sanh-sap-xep', ten: '6.7 Choosing a sort: the full comparison', de: [de1, de2, de3] });
