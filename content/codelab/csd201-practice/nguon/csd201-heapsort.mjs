/** CSD201 · 6.5 — Heap sort: in mảng sau khi dựng heap và sau mỗi lần rút (kiểu PE), sắp mảng "gần đúng chỗ" (lệch ≤ k) bằng heap k+1 (kiểm O(n log k)), trung vị chạy bằng hai heap. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-6-5-heapsort-trace',
  tieuDe: { en: 'Heap sort step by step: the heap after building, then after every extraction', vi: 'Heap sort từng bước: heap sau khi dựng, rồi sau mỗi lần rút' },
  doKho: 'MEDIUM', phut: 25, dangBai: 'pe',
  khaiNiem: ['build a max-heap bottom-up', 'swap the root to the end', 'sift down in the shrinking heap'],
  moTa: {
    en: `<p>Complete ${c('static String trace(int[] a)')}: build a max-heap bottom-up (sift down i = n/2−1 … 0; on equal children take the left), append ${c('"heap: …"')}; then for end = n−1 down to 1: swap a[0] and a[end], sift a[0] down inside ${c('a[0..end-1]')}, append ${c('"step k: …"')} (k = 1, 2, …). The lines show the whole array (heap part and sorted part together).</p>`,
    vi: `<p>Hoàn thiện ${c('static String trace(int[] a)')}: dựng max-heap từ dưới lên (đẩy xuống i = n/2−1 … 0; hai con bằng nhau thì lấy con trái), nối ${c('"heap: …"')}; rồi với end = n−1 lùi về 1: đổi a[0] với a[end], đẩy a[0] xuống trong ${c('a[0..end-1]')}, nối ${c('"step k: …"')} (k = 1, 2, …). Các dòng in cả mảng (phần heap và phần đã sắp cùng lúc).</p>`,
  },
  yeuCau: { en: ['Exactly the textbook steps (the trace depends on them).', 'In place.'], vi: ['Đúng các bước của giáo trình (dấu vết phụ thuộc vào chúng).', 'Tại chỗ.'] },
  dauVao: { en: 'SORT values… per line.', vi: 'SORT các giá trị… mỗi dòng.' },
  dauRa: { en: 'The trace lines.', vi: 'Các dòng dấu vết.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                int[] a = new int[p.length - 1];
                for (int i = 1; i < p.length; i++) {
                    a[i - 1] = n(i);
                }
                r = "\\n" + HeapTrace.trace(a);`,
    }),
  },
  tep: {
    'HeapTrace.java': j`
public class HeapTrace {

    static String trace(int[] a) {
        //>> return ""; // TODO
        StringBuilder sb = new StringBuilder();
        int n = a.length;
        for (int i = n / 2 - 1; i >= 0; i--) {
            siftDown(a, i, n);
        }
        line(sb, "heap", a);
        for (int end = n - 1, k = 1; end > 0; end--, k++) {
            int t = a[0];
            a[0] = a[end];
            a[end] = t;
            siftDown(a, 0, end);
            line(sb, "step " + k, a);
        }
        return sb.toString().trim();
        //<<
    }
    //>> // TODO: helper(s)

    private static void line(StringBuilder sb, String label, int[] a) {
        sb.append(label).append(':');
        for (int x : a) {
            sb.append(' ').append(x);
        }
        sb.append('\n');
    }

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
    { ten: { en: 'the slides’ example', vi: 'ví dụ của slide' }, vao: 'SORT 4 10 3 5 1\nSORT 2 8 6 1 10 15 3\n' },
    { ten: { en: 'duplicates, sorted, two elements', vi: 'giá trị trùng, đã sắp, hai phần tử' }, vao: 'SORT 3 3 1 3\nSORT 1 2 3 4 5\nSORT 1 2\n', an: true },
  ],
  goiY: [
    { en: 'Bottom-up build first (one "heap:" line), then n − 1 extraction steps.', vi: 'Dựng từ dưới lên trước (một dòng "heap:"), rồi n − 1 bước rút.' },
    { en: 'After step k, the k largest values occupy the last k cells in increasing order.', vi: 'Sau bước k, k giá trị lớn nhất nằm ở k ô cuối theo thứ tự tăng.' },
  ],
  loiHayGap: [
    { en: 'Sifting down in the whole array instead of a[0..end−1] — the sorted tail is disturbed.', vi: 'Đẩy xuống trong cả mảng thay vì a[0..end−1] — phần đuôi đã sắp bị xáo trộn.' },
    { en: 'Building the heap top-down — a valid heap, but a different array than the paper expects.', vi: 'Dựng heap từ trên xuống — heap hợp lệ nhưng mảng khác với đề mong đợi.' },
  ],
  giaiThich: { en: '<p>The trace makes the two phases visible: O(n) to build the heap, then n − 1 extractions of O(log n) each. The sorted part grows from the right, one maximum at a time — like selection sort, but the heap finds each maximum in O(log n) instead of O(n).</p>', vi: '<p>Dấu vết làm lộ hai pha: O(n) để dựng heap, rồi n − 1 lần rút, mỗi lần O(log n). Phần đã sắp lớn dần từ bên phải, mỗi lần một giá trị lớn nhất — giống sắp chọn, nhưng heap tìm mỗi giá trị lớn nhất trong O(log n) thay vì O(n).</p>' },
});

const de2 = deJava({
  id: 'csd201-6-5-k-sorted',
  tieuDe: { en: 'Sort an almost sorted array (each value at most k places away) in O(n log k)', vi: 'Sắp mảng gần như đã sắp (mỗi giá trị lệch tối đa k chỗ) trong O(n log k)' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['a sliding min-heap of size k + 1', 'the minimum of the window is the next value', 'O(n log k)'],
  moTa: {
    en: `<p>Every value of ${c('a')} is at most k positions away from its place in the sorted order. Complete ${c('static void sortNearly(int[] a, int k)')}: keep a min-heap (${c('PriorityQueue')}) of the next k + 1 values; the minimum of the heap is always the next value of the output. Total O(n log k) — the complexity check uses n = 2,000,000 and k = 10.</p>`,
    vi: `<p>Mọi giá trị của ${c('a')} lệch tối đa k vị trí so với chỗ của nó khi đã sắp. Hoàn thiện ${c('static void sortNearly(int[] a, int k)')}: giữ một min-heap (${c('PriorityQueue')}) của k + 1 giá trị kế tiếp; phần tử nhỏ nhất trong heap luôn là giá trị tiếp theo của kết quả. Tổng O(n log k) — kiểm độ phức tạp dùng n = 2.000.000 và k = 10.</p>`,
  },
  yeuCau: { en: ['A heap of at most k + 1 elements; no full sort (rule R1).', 'Write the result back into a.'], vi: ['Heap tối đa k + 1 phần tử; không sắp cả mảng (luật R1).', 'Ghi kết quả trở lại a.'] },
  dauVao: { en: 'Lines "k : values"; PERF.', vi: 'Các dòng "k : giá trị"; PERF.' },
  dauRa: { en: 'The sorted array.', vi: 'Mảng đã sắp.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no full sort in Nearly (Arrays.sort / Collections.sort)', vi: 'không sắp cả mảng trong Nearly (Arrays.sort / Collections.sort)', re: String.raw`\.sort\s*\(`, file: 'Nearly' }],
  hen: { n: '2,000,000 with k = 10', ms: 3000, can: 'O(n log k)', cham: 'O(n²) (selection or bubble sort)', en: 'The check only rejects quadratic work — the lesson is that knowing k lets you beat a general sort.', vi: 'Phép kiểm chỉ loại công việc bậc hai — bài học là biết k thì vượt được một phép sắp tổng quát.' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] a = new int[2000000];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = i;
                    }
                    for (int i = 0; i + 10 < a.length; i += 11) {
                        int t = a[i];
                        a[i] = a[i + 10];
                        a[i + 10] = t;
                    }
                    r = Kiem.hen("n = 2,000,000, k = 10", 3000, new Runnable() {
                        public void run() {
                            Nearly.sortNearly(a, 10);
                        }
                    });
                    boolean ok = true;
                    for (int i = 1; i < a.length; i++) {
                        ok &= a[i - 1] <= a[i];
                    }
                    r += ", sorted " + ok;
                } else {
                    int[] a = new int[p.length - 2];
                    for (int i = 2; i < p.length; i++) {
                        a[i - 2] = n(i);
                    }
                    Nearly.sortNearly(a, n(0));
                    r = Arrays.toString(a);
                }`,
    }),
  },
  tep: {
    'Nearly.java': j`
import java.util.PriorityQueue;

public class Nearly {

    static void sortNearly(int[] a, int k) {
        //>> // TODO
        PriorityQueue<Integer> h = new PriorityQueue<>();
        int out = 0;
        for (int i = 0; i < a.length; i++) {
            h.add(a[i]);
            if (h.size() > k) {
                a[out++] = h.poll(); // the smallest of the window cannot be beaten by later values
            }
        }
        while (!h.isEmpty()) {
            a[out++] = h.poll();
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'k = 2 and k = 3', vi: 'k = 2 và k = 3' }, vao: '2 : 3 1 2 6 4 5\n3 : 6 5 3 2 8 10 9\n0 : 1 2 3\n' },
    { ten: { en: 'k larger than needed, duplicates', vi: 'k lớn hơn cần thiết, giá trị trùng' }, vao: '10 : 4 3 2 1\n1 : 2 1 2 1 3 3\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'The value that belongs at position 0 is among a[0..k]; after it is output, the next one is among the next k + 1 candidates, and so on.', vi: 'Giá trị thuộc vị trí 0 nằm trong a[0..k]; sau khi ghi nó, giá trị kế tiếp nằm trong k + 1 ứng viên tiếp theo, cứ thế.' },
    { en: 'Write into a while reading: the write index never passes the read index.', vi: 'Ghi vào a trong lúc đọc: chỉ số ghi không bao giờ vượt chỉ số đọc.' },
  ],
  loiHayGap: [
    { en: 'Polling only when the heap has k elements (not k + 1) — a value can come out too early.', vi: 'Lấy ra khi heap mới có k phần tử (không phải k + 1) — một giá trị có thể ra quá sớm.' },
    { en: 'Forgetting to empty the heap at the end — the last k values are lost.', vi: 'Quên lấy hết heap ở cuối — mất k giá trị cuối.' },
  ],
  giaiThich: { en: '<p>Each value enters and leaves a heap of at most k + 1 elements: O(n log k). Insertion sort is O(n·k) on such data (also fine for small k); a full sort ignores the structure and pays O(n log n).</p>', vi: '<p>Mỗi giá trị vào và ra một heap tối đa k + 1 phần tử: O(n log k). Sắp chèn trên dữ liệu này là O(n·k) (cũng ổn với k nhỏ); sắp cả mảng bỏ qua cấu trúc và trả O(n log n).</p>' },
});

const de3 = deJava({
  id: 'csd201-6-5-running-median',
  tieuDe: { en: 'The running median with two heaps', vi: 'Trung vị chạy bằng hai heap' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['a max-heap for the lower half, a min-heap for the upper half', 'rebalancing sizes', 'O(log n) per value'],
  moTa: {
    en: `<p>Values arrive one by one. Complete ${c('MedianStream')}: ${c('void add(int x)')} and ${c('double median()')} — the middle value, or the average of the two middle values when the count is even. Keep the lower half in a max-heap and the upper half in a min-heap with sizes differing by at most one; the median is at their tops.</p>
<p>The complexity check adds 500,000 values and asks for the median after every one: re-sorting each time would be 10¹¹ operations.</p>`,
    vi: `<p>Các giá trị đến lần lượt. Hoàn thiện ${c('MedianStream')}: ${c('add(x)')} và ${c('median()')} — giá trị ở giữa, hoặc trung bình hai giá trị ở giữa khi số lượng chẵn. Giữ nửa dưới trong max-heap và nửa trên trong min-heap, kích thước lệch nhau tối đa một; trung vị nằm ở đỉnh của chúng.</p>
<p>Kiểm độ phức tạp thêm 500.000 giá trị và hỏi trung vị sau mỗi lần: sắp lại mỗi lần là 10¹¹ phép tính.</p>`,
  },
  yeuCau: { en: ['O(log n) add, O(1) median.', 'median() on an empty stream is never called.'], vi: ['add O(log n), median O(1).', 'Không bao giờ gọi median() khi chưa có giá trị.'] },
  dauVao: { en: 'ADD x lines; PERF.', vi: 'Các dòng ADD x; PERF.' },
  dauRa: { en: 'The median after each value.', vi: 'Trung vị sau mỗi giá trị.' },
  main: 'KiemTra',
  hen: { n: '500,000 values', ms: 3000, can: 'O(log n) per value', cham: 'O(n log n) or O(n) per value (sorting or inserting into a sorted list)' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        MedianStream t = new MedianStream();',
      lenh: `                if (p[0].equals("ADD")) {
                    t.add(n(1));
                    r = String.valueOf(t.median());
                } else {
                    final MedianStream m = new MedianStream();
                    final int[] v = Kiem.ngauNhien(500000, 1000000000, 91);
                    final double[] s = new double[1];
                    r = Kiem.hen("500,000 values, a median after each", 3000, new Runnable() {
                        public void run() {
                            for (int x : v) {
                                m.add(x);
                                s[0] += m.median();
                            }
                        }
                    }) + ", final median " + m.median() + ", checksum " + (long) s[0];
                }`,
    }),
  },
  tep: {
    'MedianStream.java': j`
import java.util.Collections;
import java.util.PriorityQueue;

public class MedianStream {
    //>> // TODO: two heaps
    private final PriorityQueue<Integer> low = new PriorityQueue<>(Collections.reverseOrder()); // max-heap
    private final PriorityQueue<Integer> high = new PriorityQueue<>(); // min-heap
    //<<

    public void add(int x) {
        //>> // TODO
        if (low.isEmpty() || x <= low.peek()) {
            low.add(x);
        } else {
            high.add(x);
        }
        if (low.size() > high.size() + 1) { // keep |low| = |high| or |high| + 1
            high.add(low.poll());
        } else if (high.size() > low.size()) {
            low.add(high.poll());
        }
        //<<
    }

    public double median() {
        //>> return 0; // TODO
        if (low.size() > high.size()) {
            return low.peek();
        }
        return ((long) low.peek() + high.peek()) / 2.0;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a short stream', vi: 'một luồng ngắn' }, vao: 'ADD 5\nADD 15\nADD 1\nADD 3\nADD 8\nADD 7\n' },
    { ten: { en: 'duplicates, negatives, extreme values', vi: 'giá trị trùng, số âm, giá trị cực trị' }, vao: 'ADD 2\nADD 2\nADD 2\nADD -4\nADD 2147483647\nADD 2147483647\nADD -2147483648\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Put x in the lower heap if it is ≤ its top, else in the upper heap; then move one element across if the sizes drift by more than one.', vi: 'Cho x vào heap dưới nếu x ≤ đỉnh của nó, ngược lại vào heap trên; rồi chuyển một phần tử sang nếu kích thước lệch quá một.' },
    { en: 'Average with long arithmetic: two values near 2³¹ overflow an int sum.', vi: 'Tính trung bình bằng long: hai giá trị gần 2³¹ cộng lại tràn int.' },
  ],
  loiHayGap: [
    { en: 'Adding every value to one heap and copying it to find the middle — O(n) per value.', vi: 'Cho mọi giá trị vào một heap rồi chép ra để tìm giữa — O(n) mỗi giá trị.' },
    { en: '(low.peek() + high.peek()) / 2 in int — wrong for odd sums and overflows for large values.', vi: '(low.peek() + high.peek()) / 2 bằng int — sai với tổng lẻ và tràn với giá trị lớn.' },
  ],
  giaiThich: { en: '<p>Every value in the lower heap is ≤ every value in the upper heap, and their sizes differ by at most one, so the median is at one or both tops. Each add is a constant number of heap operations: O(log n); the median is O(1).</p>', vi: '<p>Mọi giá trị trong heap dưới ≤ mọi giá trị trong heap trên, và kích thước lệch nhau tối đa một, nên trung vị nằm ở một hoặc cả hai đỉnh. Mỗi lần add là một số hằng thao tác heap: O(log n); median là O(1).</p>' },
});

export default moDun({ slug: 'csd201-heapsort', ten: '6.5 Heap-sort', de: [de1, de2, de3] });
