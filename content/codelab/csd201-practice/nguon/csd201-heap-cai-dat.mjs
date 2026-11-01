/** CSD201 · 4.7 — Dựng heap: từ trên xuống vs từ dưới lên (Floyd) — so đúng mảng; heap sort tại chỗ (kiểm O(n log n)); trộn k dãy đã sắp bằng heap. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-4-7-build-heap-two-ways',
  tieuDe: { en: 'Build a max-heap two ways: top-down (insertions) and bottom-up (Floyd)', vi: 'Dựng max-heap hai cách: từ trên xuống (chèn lần lượt) và từ dưới lên (Floyd)' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['sift-up (up-heap)', 'sift-down (down-heap)', 'Floyd: sift down from n/2 − 1 to 0', 'O(n log n) vs O(n)'],
  moTa: {
    en: `<p>Both methods work <b>in place</b> on an int array and must reproduce the slides’ arrays exactly. Count every swap in the static field ${c('swaps')}.</p>
<ul><li>${c('static void topDown(int[] a)')} — for i = 1 … n−1, sift ${c('a[i]')} up (swap with its parent while it is larger);</li>
<li>${c('static void bottomUp(int[] a)')} — for i = n/2 − 1 down to 0, sift ${c('a[i]')} down (swap with the <b>larger</b> child while that child is larger; on equal children take the left one).</li></ul>
<p>The same input usually gives two <b>different</b> valid heaps — the grader compares both arrays and swap counts with the expected ones.</p>`,
    vi: `<p>Cả hai cách làm <b>tại chỗ</b> trên mảng int và phải ra đúng mảng như slide. Đếm mọi lần đổi chỗ vào trường static ${c('swaps')}. ${c('topDown(a)')} — với i = 1 … n−1, đẩy ${c('a[i]')} lên (đổi với cha khi nó lớn hơn); ${c('bottomUp(a)')} — với i = n/2 − 1 lùi về 0, đẩy ${c('a[i]')} xuống (đổi với con <b>lớn hơn</b> khi con đó lớn hơn; hai con bằng nhau thì lấy con trái).</p>
<p>Cùng một đầu vào thường cho hai heap hợp lệ <b>khác nhau</b> — máy chấm so cả hai mảng và số lần đổi chỗ với đáp án.</p>`,
  },
  yeuCau: { en: ['In place; exact swap rules as described.', 'swaps counts the swaps of the last call (reset at the start).'], vi: ['Tại chỗ; đúng luật đổi chỗ như mô tả.', 'swaps đếm số lần đổi của lần gọi gần nhất (đặt lại ở đầu).'] },
  dauVao: { en: 'One array per line; PERF.', vi: 'Mỗi dòng một mảng; PERF.' },
  dauRa: { en: 'Both heaps and their swap counts.', vi: 'Hai heap và số lần đổi chỗ.' },
  main: 'KiemTra',
  hen: { n: '2,000,000 (bottom-up)', ms: 3000, can: 'O(n) for bottom-up', cham: 'O(n²) (re-sorting or rebuilding at every step)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] a = new int[2000000];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = i; // increasing: the worst input for a max-heap
                    }
                    r = Kiem.hen("bottomUp on 2,000,000 increasing values", 3000, new Runnable() {
                        public void run() {
                            Heaps.bottomUp(a);
                        }
                    }) + ", root " + a[0] + ", swaps " + Heaps.swaps;
                } else {
                    int[] a = new int[p.length];
                    for (int i = 0; i < p.length; i++) {
                        a[i] = n(i);
                    }
                    int[] b = a.clone();
                    Heaps.topDown(a);
                    long s1 = Heaps.swaps;
                    Heaps.bottomUp(b);
                    r = "topDown " + Arrays.toString(a) + " (" + s1 + " swaps) | bottomUp " + Arrays.toString(b) + " (" + Heaps.swaps + " swaps)";
                }`,
    }),
  },
  tep: {
    'Heaps.java': j`
public class Heaps {
    static long swaps;

    private static void swap(int[] a, int i, int j) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
        swaps++;
    }

    static void topDown(int[] a) {
        //>> // TODO: sift up a[1], a[2], ...
        swaps = 0;
        for (int i = 1; i < a.length; i++) {
            int k = i;
            while (k > 0 && a[(k - 1) / 2] < a[k]) {
                swap(a, k, (k - 1) / 2);
                k = (k - 1) / 2;
            }
        }
        //<<
    }

    static void bottomUp(int[] a) {
        //>> // TODO: sift down from n/2 - 1 to 0
        swaps = 0;
        for (int i = a.length / 2 - 1; i >= 0; i--) {
            siftDown(a, i, a.length);
        }
        //<<
    }
    //>> // TODO: helper(s)

    static void siftDown(int[] a, int i, int n) {
        while (2 * i + 1 < n) {
            int c = 2 * i + 1;
            if (c + 1 < n && a[c + 1] > a[c]) {
                c++; // the larger child (left on ties)
            }
            if (a[c] <= a[i]) {
                break;
            }
            swap(a, i, c);
            i = c;
        }
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ example and an increasing array', vi: 'ví dụ của slide và một mảng tăng dần' }, vao: '2 8 6 1 10 15 3 12 11\n1 2 3 4 5 6 7\n' },
    { ten: { en: 'already a heap, equal values, tiny arrays', vi: 'đã là heap, giá trị bằng nhau, mảng rất nhỏ' }, vao: '9 7 8 1 2 3\n5 5 5 5\n4\n1 2\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Top-down is "insert a[i] into the heap a[0..i−1]": the up-heap of 2.5.', vi: 'Từ trên xuống là "chèn a[i] vào heap a[0..i−1]": chính up-heap của bài 2.5.' },
    { en: 'Bottom-up starts at the last internal node n/2 − 1: the leaves are already heaps of size 1.', vi: 'Từ dưới lên bắt đầu ở nút trong cuối cùng n/2 − 1: các lá đã là heap cỡ 1.' },
  ],
  loiHayGap: [
    { en: 'Sifting down with the left child only — wrong array (and not even a heap) when the right child is larger.', vi: 'Đẩy xuống chỉ với con trái — sai mảng (thậm chí không phải heap) khi con phải lớn hơn.' },
    { en: 'Starting bottom-up at n − 1 or going upwards (0 → n/2) — the result is not a heap.', vi: 'Bắt đầu từ dưới lên ở n − 1 hoặc đi lên (0 → n/2) — kết quả không phải heap.' },
  ],
  giaiThich: { en: '<p>Top-down costs up to log i swaps for element i: O(n log n). Bottom-up sifts most elements (the many low ones) only a few levels: Σ (n/2^(h+1))·h = O(n) — on two million increasing values it makes fewer than 2n swaps.</p>', vi: '<p>Từ trên xuống tốn tới log i lần đổi cho phần tử i: O(n log n). Từ dưới lên chỉ đẩy phần lớn phần tử (rất nhiều phần tử ở thấp) xuống vài tầng: Σ (n/2^(h+1))·h = O(n) — với hai triệu giá trị tăng dần nó đổi chỗ ít hơn 2n lần.</p>' },
});

const de2 = deJava({
  id: 'csd201-4-7-heap-sort',
  tieuDe: { en: 'Heap sort in place, O(n log n) guaranteed', vi: 'Heap sort tại chỗ, đảm bảo O(n log n)' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['build a max-heap', 'swap the root with the last element', 'shrink the heap and sift down', 'not stable'],
  moTa: {
    en: `<p>Complete ${c('static void heapSort(int[] a)')}: build a max-heap bottom-up, then repeatedly swap ${c('a[0]')} (the maximum) with the last element of the heap, shrink the heap by one and sift the new root down. Ascending order, in place, no extra array (rule R1), no library sort.</p>`,
    vi: `<p>Hoàn thiện ${c('static void heapSort(int[] a)')}: dựng max-heap từ dưới lên, rồi lặp: đổi ${c('a[0]')} (giá trị lớn nhất) với phần tử cuối của heap, thu heap lại một ô và đẩy gốc mới xuống. Thứ tự tăng, tại chỗ, không mảng phụ (luật R1), không dùng hàm sort của thư viện.</p>`,
  },
  yeuCau: { en: ['In place, O(n log n) (rule R1: no new array, no Arrays.sort).', 'Ascending.'], vi: ['Tại chỗ, O(n log n) (luật R1: không mảng mới, không Arrays.sort).', 'Tăng dần.'] },
  dauVao: { en: 'One array per line; PERF.', vi: 'Mỗi dòng một mảng; PERF.' },
  dauRa: { en: 'The sorted array.', vi: 'Mảng đã sắp.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'in place: no new array, no library sort, no collections in HeapSort', vi: 'tại chỗ: không mảng mới, không sort thư viện, không collection trong HeapSort', re: String.raw`\bnew\s+\w+\s*\[|\.sort\s*\(|\bPriorityQueue\b|\bArrayList\b|\.clone\s*\(|copyOf`, file: 'HeapSort' }],
  hen: { n: '2,000,000', ms: 4000, can: 'O(n log n)', cham: 'O(n²) (selection or insertion sort)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] a = Kiem.ngauNhien(2000000, 1000000000, 23);
                    r = Kiem.hen("heapSort of 2,000,000 values", 4000, new Runnable() {
                        public void run() {
                            HeapSort.heapSort(a);
                        }
                    });
                    boolean ok = true;
                    for (int i = 1; i < a.length; i++) {
                        ok &= a[i - 1] <= a[i];
                    }
                    r += ", sorted " + ok;
                } else {
                    int[] a = new int[p.length];
                    for (int i = 0; i < p.length; i++) {
                        a[i] = n(i);
                    }
                    HeapSort.heapSort(a);
                    r = Arrays.toString(a);
                }`,
    }),
  },
  tep: {
    'HeapSort.java': j`
public class HeapSort {

    static void heapSort(int[] a) {
        //>> // TODO
        int n = a.length;
        for (int i = n / 2 - 1; i >= 0; i--) {
            siftDown(a, i, n);
        }
        for (int end = n - 1; end > 0; end--) {
            int t = a[0]; // the maximum goes to its final place
            a[0] = a[end];
            a[end] = t;
            siftDown(a, 0, end); // the heap is now a[0..end-1]
        }
        //<<
    }
    //>> // TODO: helper(s)

    private static void siftDown(int[] a, int i, int n) {
        while (2 * i + 1 < n) {
            int c = 2 * i + 1;
            if (c + 1 < n && a[c + 1] > a[c]) {
                c++;
            }
            if (a[c] <= a[i]) {
                return;
            }
            int t = a[i];
            a[i] = a[c];
            a[c] = t;
            i = c;
        }
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'small arrays', vi: 'mảng nhỏ' }, vao: '2 8 6 1 10 15 3 12 11\n5 4 3 2 1\n7\n' },
    { ten: { en: 'duplicates and negatives', vi: 'giá trị trùng và số âm' }, vao: '3 -1 3 0 -1 2\n9 9 9\n-5 10 -5 10\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'After building the max-heap, a[0] is the largest: it belongs at index n − 1. Swap, then the heap is a[0..n−2].', vi: 'Dựng max-heap xong thì a[0] lớn nhất: chỗ của nó là chỉ số n − 1. Đổi chỗ, rồi heap là a[0..n−2].' },
    { en: 'siftDown must take the heap size as a parameter so it never touches the sorted part.', vi: 'siftDown phải nhận kích thước heap làm tham số để không chạm vào phần đã sắp.' },
  ],
  loiHayGap: [
    { en: 'Sifting down over the whole array instead of the shrinking heap — the sorted maxima are pulled back into the heap.', vi: 'Đẩy xuống trên cả mảng thay vì heap đang thu nhỏ — các max đã xếp chỗ bị kéo lại vào heap.' },
    { en: 'Building a min-heap for ascending order — that needs an extra array; a max-heap sorts ascending in place.', vi: 'Dựng min-heap để sắp tăng — khi đó cần mảng phụ; max-heap mới sắp tăng tại chỗ được.' },
  ],
  giaiThich: { en: '<p>Building is O(n), and each of the n − 1 extractions sifts down at most log n levels: O(n log n) in every case, with O(1) extra memory. It is not stable, which is why Java uses merge sort (TimSort) for objects.</p>', vi: '<p>Dựng heap O(n), và mỗi lần trong n − 1 lần lấy ra đẩy xuống tối đa log n tầng: O(n log n) ở mọi trường hợp, O(1) bộ nhớ thêm. Nó không ổn định — lý do Java dùng merge sort (TimSort) cho đối tượng.</p>' },
});

const de3 = deJava({
  id: 'csd201-4-7-merge-k-sorted',
  tieuDe: { en: 'Merge k sorted arrays with a heap of k cursors', vi: 'Trộn k mảng đã sắp bằng heap của k con trỏ' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['one entry per array in the heap', 'O(N log k)', 'PriorityQueue with a comparator on int[]'],
  moTa: {
    en: `<p>Complete ${c('static int[] mergeK(int[][] arrays)')}: all values of k sorted arrays in one sorted array. Keep a ${c('PriorityQueue<int[]>')} of cursors ${c('{value, arrayIndex, position}')} — one per non-empty array; poll the smallest, output it, push the next value of the same array.</p>
<p>Equal values: the one from the array with the smaller index comes first. N values in total cost O(N log k).</p>`,
    vi: `<p>Hoàn thiện ${c('static int[] mergeK(int[][] arrays)')}: mọi giá trị của k mảng đã sắp thành một mảng đã sắp. Giữ ${c('PriorityQueue<int[]>')} các con trỏ ${c('{giá trị, chỉ số mảng, vị trí}')} — mỗi mảng khác rỗng một con trỏ; lấy con trỏ nhỏ nhất ra, ghi giá trị, đẩy giá trị kế tiếp của cùng mảng đó vào.</p>
<p>Giá trị bằng nhau: của mảng có chỉ số nhỏ hơn ra trước. Tổng N giá trị tốn O(N log k).</p>`,
  },
  yeuCau: { en: ['A heap of at most k cursors; no sorting of the result (rule R1).', 'O(N log k).'], vi: ['Heap tối đa k con trỏ; không sắp lại kết quả (luật R1).', 'O(N log k).'] },
  dauVao: { en: 'Arrays separated by "|" on one line; PERF.', vi: 'Các mảng cách nhau "|" trên một dòng; PERF.' },
  dauRa: { en: 'The merged array.', vi: 'Mảng đã trộn.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no sorting in KWay (merge with the heap)', vi: 'không sắp xếp trong KWay (trộn bằng heap)', re: String.raw`\.sort\s*\(|\.sorted\s*\(`, file: 'KWay' }],
  hen: { n: '1,000 arrays × 2,000 values', ms: 3000, can: 'O(N log k)', cham: 'O(N·k) (scanning all k fronts for every value)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[][] arrs = new int[1000][2000];
                    for (int i = 0; i < 1000; i++) {
                        for (int k = 0; k < 2000; k++) {
                            arrs[i][k] = k * 1000 + (i * 7) % 1000;
                        }
                    }
                    final int[][] m = new int[1][];
                    r = Kiem.hen("k = 1,000 arrays of 2,000", 3000, new Runnable() {
                        public void run() {
                            m[0] = KWay.mergeK(arrs);
                        }
                    }) + ", length " + (m[0] == null ? -1 : m[0].length) + ", last " + (m[0] == null || m[0].length == 0 ? "-" : String.valueOf(m[0][m[0].length - 1]));
                } else {
                    List<int[]> list = new ArrayList<>();
                    List<Integer> cur = new ArrayList<>();
                    for (int i = 0; i <= p.length; i++) {
                        if (i == p.length || p[i].equals("|")) {
                            int[] a = new int[cur.size()];
                            for (int k = 0; k < a.length; k++) {
                                a[k] = cur.get(k);
                            }
                            list.add(a);
                            cur.clear();
                        } else {
                            cur.add(Integer.parseInt(p[i]));
                        }
                    }
                    r = Arrays.toString(KWay.mergeK(list.toArray(new int[0][])));
                }`,
    }),
  },
  tep: {
    'KWay.java': j`
import java.util.PriorityQueue;

public class KWay {

    static int[] mergeK(int[][] arrays) {
        //>> return new int[0]; // TODO
        int total = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> x[0] != y[0] ? Integer.compare(x[0], y[0]) : Integer.compare(x[1], y[1]));
        for (int i = 0; i < arrays.length; i++) {
            total += arrays[i].length;
            if (arrays[i].length > 0) {
                pq.add(new int[] {arrays[i][0], i, 0});
            }
        }
        int[] out = new int[total];
        int k = 0;
        while (!pq.isEmpty()) {
            int[] c = pq.poll();
            out[k++] = c[0];
            int next = c[2] + 1;
            if (next < arrays[c[1]].length) {
                pq.add(new int[] {arrays[c[1]][next], c[1], next});
            }
        }
        return out;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'three arrays, one empty', vi: 'ba mảng, một mảng rỗng' }, vao: '1 4 7 | 2 5 8 | 3 6 9\n1 3 | | 2\n5\n' },
    { ten: { en: 'duplicates across arrays, negatives', vi: 'giá trị trùng giữa các mảng, số âm' }, vao: '1 1 2 | 1 3 | -4 1\n| |\n10 20 | 5 | 15 25 35\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'A cursor int[]{value, i, pos}; the comparator orders by value, then by array index i.', vi: 'Con trỏ int[]{giá trị, i, vị trí}; comparator xếp theo giá trị rồi theo chỉ số mảng i.' },
    { en: 'After polling the cursor of array i at position pos, push the cursor for pos + 1 if that position exists.', vi: 'Sau khi lấy con trỏ của mảng i ở vị trí pos, đẩy con trỏ cho pos + 1 nếu vị trí đó tồn tại.' },
  ],
  loiHayGap: [
    { en: 'Putting ALL values into one big heap — correct, O(N log N) time and O(N) heap memory.', vi: 'Cho TẤT CẢ giá trị vào một heap lớn — đúng, nhưng O(N log N) thời gian và O(N) bộ nhớ heap.' },
    { en: 'Adding an empty array’s first element — ArrayIndexOutOfBoundsException.', vi: 'Thêm phần tử đầu của mảng rỗng — ArrayIndexOutOfBoundsException.' },
  ],
  giaiThich: { en: '<p>The heap never holds more than k cursors, so each of the N output values costs one poll and at most one add: O(N log k). This is the merge step of external sorting (merging sorted runs on disk) and of LeetCode 23.</p>', vi: '<p>Heap không bao giờ giữ quá k con trỏ, nên mỗi giá trị trong N giá trị đầu ra tốn một lần poll và tối đa một lần add: O(N log k). Đây là bước trộn của sắp xếp ngoài (trộn các đoạn đã sắp trên đĩa) và của LeetCode 23.</p>' },
});

export default moDun({ slug: 'csd201-heap-cai-dat', ten: '4.7 Building a heap: sift-up, sift-down, Floyd', de: [de1, de2, de3] });
