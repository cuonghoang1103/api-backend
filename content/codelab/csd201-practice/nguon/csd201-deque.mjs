/** CSD201 · 2.4 — Deque: cài deque trên mảng vòng, max cửa sổ trượt bằng deque đơn điệu (kiểm O(n)), số âm đầu tiên mỗi cửa sổ. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-2-4-circular-deque',
  tieuDe: { en: 'A deque on a circular array: add and remove at both ends in O(1)', vi: 'Deque trên mảng vòng: thêm và lấy ở cả hai đầu trong O(1)' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['double-ended queue', 'front index moving backwards', '(front - 1 + cap) % cap'],
  moTa: {
    en: `<p>${c('ArrayDeque2')} stores its elements in ${c('int[] a')} with ${c('front')} (index of the first element) and ${c('size')}; the element number k is at ${c('a[(front + k) % a.length]')}. Write ${c('addFirst')}, ${c('addLast')}, ${c('removeFirst')}, ${c('removeLast')} — all O(1) (amortized when growing: double and copy in deque order to cells 0, 1, …, setting ${c('front = 0')}). Removing from an empty deque throws ${c('NoSuchElementException')}.</p>
<p>${c('addFirst')} moves ${c('front')} one cell <b>back</b>: ${c('(front - 1 + a.length) % a.length')}. The grader prints ${c('front')}, ${c('size')} and the raw array after every command.</p>`,
    vi: `<p>${c('ArrayDeque2')} lưu phần tử trong ${c('int[] a')} với ${c('front')} (chỉ số phần tử đầu) và ${c('size')}; phần tử thứ k nằm ở ${c('a[(front + k) % a.length]')}. Viết ${c('addFirst')}, ${c('addLast')}, ${c('removeFirst')}, ${c('removeLast')} — đều O(1) (khấu hao khi nới: gấp đôi và chép theo thứ tự deque vào ô 0, 1, …, đặt ${c('front = 0')}). Lấy khỏi deque rỗng ném ${c('NoSuchElementException')}.</p>
<p>${c('addFirst')} lùi ${c('front')} một ô: ${c('(front - 1 + a.length) % a.length')}. Máy chấm in ${c('front')}, ${c('size')} và mảng thô sau mỗi lệnh.</p>`,
  },
  yeuCau: { en: ['Never shift elements: only front and size move (the raw array printed by the grader shows it).', 'Initial capacity 4 (given).'], vi: ['Không bao giờ dời phần tử: chỉ front và size thay đổi (mảng thô máy chấm in ra cho thấy điều đó).', 'Sức chứa ban đầu 4 (cho sẵn).'] },
  dauVao: { en: 'AF x · AL x · RF · RL.', vi: 'AF x · AL x · RF · RL.' },
  dauRa: { en: 'Result, front, size, raw array, the deque.', vi: 'Kết quả, front, size, mảng thô, deque.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        ArrayDeque2 t = new ArrayDeque2();',
      lenh: `                if (p[0].equals("AF")) {
                    t.addFirst(n(1));
                } else if (p[0].equals("AL")) {
                    t.addLast(n(1));
                } else if (p[0].equals("RF")) {
                    r = String.valueOf(t.removeFirst());
                } else {
                    r = String.valueOf(t.removeLast());
                }`,
      trangThai: '"front=" + Kiem.lay(t, "front") + " size=" + Kiem.lay(t, "size") + " a=" + Arrays.toString((int[]) Kiem.lay(t, "a")) + " deque=" + t',
    }),
  },
  tep: {
    'ArrayDeque2.java': j`
import java.util.NoSuchElementException;

public class ArrayDeque2 {
    private int[] a = new int[4];
    private int front = 0;
    private int size = 0;

    //>> // TODO: helper(s)
    private void growIfFull() {
        if (size < a.length) {
            return;
        }
        int[] b = new int[2 * a.length];
        for (int k = 0; k < size; k++) {
            b[k] = a[(front + k) % a.length];
        }
        a = b;
        front = 0;
    }
    //<<

    public void addFirst(int x) {
        //>> // TODO
        growIfFull();
        front = (front - 1 + a.length) % a.length;
        a[front] = x;
        size++;
        //<<
    }

    public void addLast(int x) {
        //>> // TODO
        growIfFull();
        a[(front + size) % a.length] = x;
        size++;
        //<<
    }

    public int removeFirst() {
        //>> return 0; // TODO
        if (size == 0) {
            throw new NoSuchElementException();
        }
        int x = a[front];
        front = (front + 1) % a.length;
        size--;
        return x;
        //<<
    }

    public int removeLast() {
        //>> return 0; // TODO
        if (size == 0) {
            throw new NoSuchElementException();
        }
        size--;
        return a[(front + size) % a.length];
        //<<
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("[");
        for (int k = 0; k < size; k++) {
            sb.append(k > 0 ? ", " : "").append(a[(front + k) % a.length]);
        }
        return sb.append(']').toString();
    }
}
`,
  },
  ca: [
    { ten: { en: 'addFirst wraps to the end of the array', vi: 'addFirst quay vòng về cuối mảng' }, vao: 'AL 1\nAL 2\nAF 0\nAF -1\nRL\nRF\nAL 3\nAL 4\nRF\nRF\n' },
    { ten: { en: 'growing while wrapped', vi: 'nới khi đang quay vòng' }, vao: 'AF 3\nAF 2\nAF 1\nAL 4\nAL 5\nRL\nRF\nRF\nRF\nRF\nRF\n' },
    { ten: { en: 'used as a stack and as a queue', vi: 'dùng như ngăn xếp và như hàng đợi' }, vao: 'AF 1\nAF 2\nRF\nRF\nAL 3\nAL 4\nRF\nAF 5\nRL\nRL\nRL\n', an: true },
  ],
  goiY: [
    { en: 'addLast writes at (front + size) % cap; removeLast reads the same cell after size--.', vi: 'addLast ghi vào (front + size) % cap; removeLast đọc đúng ô đó sau khi size--.' },
    { en: 'In Java, -1 % 4 is -1: add the capacity before taking %.', vi: 'Trong Java, -1 % 4 bằng -1: cộng sức chứa trước khi lấy %.' },
  ],
  loiHayGap: [
    { en: 'front = front - 1 without wrapping — a[-1] throws ArrayIndexOutOfBoundsException on the first addFirst.', vi: 'front = front - 1 không quay vòng — a[-1] ném ArrayIndexOutOfBoundsException ngay lần addFirst đầu.' },
    { en: 'Growing with a plain array copy while the deque wraps — the order of the elements breaks.', vi: 'Nới bằng phép chép mảng thường khi deque đang quay vòng — thứ tự phần tử bị hỏng.' },
  ],
  giaiThich: { en: '<p>front and size describe the ring completely: the first element is a[front], the last a[(front + size − 1) % cap]. Moving front back for addFirst and forward for removeFirst, and only size for the rear, makes every operation O(1) — this is how java.util.ArrayDeque works.</p>', vi: '<p>front và size mô tả trọn vòng: phần tử đầu là a[front], phần tử cuối a[(front + size − 1) % cap]. Lùi front khi addFirst, tiến front khi removeFirst, và chỉ đổi size cho đầu cuối, làm mọi thao tác O(1) — đó là cách java.util.ArrayDeque làm.</p>' },
});

const de2 = deJava({
  id: 'csd201-2-4-sliding-window-max',
  tieuDe: { en: 'Sliding window maximum in O(n) with a monotonic deque', vi: 'Max của cửa sổ trượt trong O(n) bằng deque đơn điệu' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['monotonic (decreasing) deque', 'storing indexes', 'each index pushed and popped once'],
  moTa: {
    en: `<p>Complete ${c('static int[] maxOfWindows(int[] a, int k)')}: the maximum of every window ${c('a[i..i+k-1]')}, for i = 0 … n − k (n − k + 1 values; an empty array if k &gt; n). ${c('[1,3,-1,-3,5,3,6,7]')} with k = 3 → ${c('[3,3,5,5,6,7]')}.</p>
<p>Keep a deque of <b>indexes</b> whose values are decreasing from front to back. For each new index i: drop from the back every index whose value is ≤ a[i] (they can never be a maximum again), add i, drop the front if it left the window; once i ≥ k − 1 the front is the window’s maximum.</p>`,
    vi: `<p>Hoàn thiện ${c('static int[] maxOfWindows(int[] a, int k)')}: max của từng cửa sổ ${c('a[i..i+k-1]')}, với i = 0 … n − k (n − k + 1 giá trị; mảng rỗng nếu k &gt; n). ${c('[1,3,-1,-3,5,3,6,7]')} với k = 3 → ${c('[3,3,5,5,6,7]')}.</p>
<p>Giữ một deque các <b>chỉ số</b> có giá trị giảm dần từ đầu tới cuối. Với mỗi chỉ số mới i: bỏ ở cuối mọi chỉ số có giá trị ≤ a[i] (chúng không bao giờ là max nữa), thêm i, bỏ đầu nếu nó đã ra khỏi cửa sổ; khi i ≥ k − 1 thì đầu deque là max của cửa sổ.</p>`,
  },
  yeuCau: { en: ['O(n) total (each index enters and leaves the deque at most once).', '1 ≤ k.'], vi: ['Tổng O(n) (mỗi chỉ số vào và ra deque tối đa một lần).', '1 ≤ k.'] },
  dauVao: { en: 'Lines "k : values"; PERF.', vi: 'Các dòng "k : giá trị"; PERF.' },
  dauRa: { en: 'The maxima.', vi: 'Các giá trị max.' },
  main: 'KiemTra',
  hen: { n: '1,000,000 elements, k = 500,000', ms: 3000, can: 'O(n)', cham: 'O(n·k)', en: 'Scanning every window again is 2.5·10¹¹ comparisons.', vi: 'Quét lại từng cửa sổ là 2,5·10¹¹ phép so sánh.' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] a = Kiem.ngauNhien(1000000, 1000000000, 5);
                    final int[][] m = new int[1][];
                    r = Kiem.hen("n = 1,000,000, k = 500,000", 3000, new Runnable() {
                        public void run() {
                            m[0] = Window.maxOfWindows(a, 500000);
                        }
                    }) + ", windows " + (m[0] == null ? -1 : m[0].length) + ", first " + (m[0] == null || m[0].length == 0 ? "-" : String.valueOf(m[0][0]));
                } else {
                    int[] a = new int[p.length - 2];
                    for (int i = 2; i < p.length; i++) {
                        a[i - 2] = n(i);
                    }
                    r = Arrays.toString(Window.maxOfWindows(a, n(0)));
                }`,
    }),
  },
  tep: {
    'Window.java': j`
import java.util.ArrayDeque;
import java.util.Deque;

public class Window {

    static int[] maxOfWindows(int[] a, int k) {
        //>> return new int[0]; // TODO: a deque of indexes with decreasing values
        int n = a.length;
        if (k > n) {
            return new int[0];
        }
        int[] res = new int[n - k + 1];
        Deque<Integer> dq = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) {
                dq.pollLast(); // smaller values behind a[i] can never be the maximum again
            }
            dq.addLast(i);
            if (dq.peekFirst() <= i - k) {
                dq.pollFirst(); // the front left the window
            }
            if (i >= k - 1) {
                res[i - k + 1] = a[dq.peekFirst()];
            }
        }
        return res;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the classic example, k = 1, k = n', vi: 'ví dụ kinh điển, k = 1, k = n' }, vao: '3 : 1 3 -1 -3 5 3 6 7\n1 : 4 2 12 3\n4 : 4 2 12 3\n5 : 1 2 3\n' },
    { ten: { en: 'decreasing, increasing, equal values', vi: 'giảm dần, tăng dần, giá trị bằng nhau' }, vao: '2 : 9 8 7 6 5\n2 : 1 2 3 4 5\n3 : 5 5 5 5\n2 : -1 -3 -2 -5\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Store indexes, not values — you need them to know when the front has left the window (index ≤ i − k).', vi: 'Lưu chỉ số, không lưu giá trị — cần chúng để biết khi nào đầu deque đã ra khỏi cửa sổ (chỉ số ≤ i − k).' },
    { en: 'The deque’s values are decreasing, so its front is always the maximum of the indexes still inside.', vi: 'Giá trị trong deque giảm dần, nên đầu deque luôn là max của các chỉ số còn trong cửa sổ.' },
  ],
  loiHayGap: [
    { en: 'Recomputing the maximum of each window with a loop — O(n·k), the complexity check fails.', vi: 'Tính lại max mỗi cửa sổ bằng vòng lặp — O(n·k), trượt kiểm độ phức tạp.' },
    { en: 'Using a PriorityQueue and remove(Object) for the leaving element — remove is O(k), so the total is O(n·k) again.', vi: 'Dùng PriorityQueue rồi remove(Object) phần tử rời cửa sổ — remove là O(k), tổng lại thành O(n·k).' },
  ],
  giaiThich: { en: '<p>Every index is added once and removed at most once (from the back or the front), so the total work is O(n) whatever k is. The deque keeps exactly the "candidates": elements with no larger element after them inside the window.</p>', vi: '<p>Mỗi chỉ số được thêm một lần và bị bỏ tối đa một lần (ở cuối hoặc ở đầu), nên tổng công O(n) bất kể k. Deque giữ đúng các "ứng viên": phần tử không có phần tử lớn hơn đứng sau nó trong cửa sổ.</p>' },
});

const de3 = deJava({
  id: 'csd201-2-4-first-negative',
  tieuDe: { en: 'First negative number in every window of size k', vi: 'Số âm đầu tiên trong mọi cửa sổ cỡ k' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['queue of candidate indexes', 'sliding window', 'O(n)'],
  moTa: {
    en: `<p>Complete ${c('static int[] firstNegative(int[] a, int k)')}: for each window ${c('a[i..i+k-1]')} the first negative number in it, or 0 when it has none. ${c('[12,-1,-7,8,-15,30,16,28]')} with k = 3 → ${c('[-1,-1,-7,-15,-15,0]')}. Keep a queue of the indexes of the negative numbers; drop the front once it leaves the window.</p>`,
    vi: `<p>Hoàn thiện ${c('static int[] firstNegative(int[] a, int k)')}: với mỗi cửa sổ ${c('a[i..i+k-1]')}, số âm đầu tiên trong đó, hoặc 0 nếu không có. ${c('[12,-1,-7,8,-15,30,16,28]')} với k = 3 → ${c('[-1,-1,-7,-15,-15,0]')}. Giữ một hàng đợi chỉ số các số âm; bỏ đầu hàng khi nó ra khỏi cửa sổ.</p>`,
  },
  yeuCau: { en: ['O(n).', 'k > n → empty array.'], vi: ['O(n).', 'k > n → mảng rỗng.'] },
  dauVao: { en: 'Lines "k : values"; PERF.', vi: 'Các dòng "k : giá trị"; PERF.' },
  dauRa: { en: 'One value per window.', vi: 'Mỗi cửa sổ một giá trị.' },
  main: 'KiemTra',
  hen: { n: '1,000,000 elements, k = 400,000, few negatives', ms: 3000, can: 'O(n)', cham: 'O(n·k)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] a = new int[1000000];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = i % 450000 == 449999 ? -i : i;
                    }
                    final int[][] m = new int[1][];
                    r = Kiem.hen("n = 1,000,000, k = 400,000", 3000, new Runnable() {
                        public void run() {
                            m[0] = Window2.firstNegative(a, 400000);
                        }
                    }) + ", windows " + (m[0] == null ? -1 : m[0].length) + ", last " + (m[0] == null || m[0].length == 0 ? "-" : String.valueOf(m[0][m[0].length - 1]));
                } else {
                    int[] a = new int[p.length - 2];
                    for (int i = 2; i < p.length; i++) {
                        a[i - 2] = n(i);
                    }
                    r = Arrays.toString(Window2.firstNegative(a, n(0)));
                }`,
    }),
  },
  tep: {
    'Window2.java': j`
import java.util.ArrayDeque;
import java.util.Queue;

public class Window2 {

    static int[] firstNegative(int[] a, int k) {
        //>> return new int[0]; // TODO
        int n = a.length;
        if (k > n) {
            return new int[0];
        }
        int[] res = new int[n - k + 1];
        Queue<Integer> neg = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            if (a[i] < 0) {
                neg.add(i);
            }
            if (!neg.isEmpty() && neg.peek() <= i - k) {
                neg.remove();
            }
            if (i >= k - 1) {
                res[i - k + 1] = neg.isEmpty() ? 0 : a[neg.peek()];
            }
        }
        return res;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the example', vi: 'ví dụ' }, vao: '3 : 12 -1 -7 8 -15 30 16 28\n2 : -8 2 3 -6 10\n' },
    { ten: { en: 'no negatives, all negatives, k = 1', vi: 'không số âm, toàn số âm, k = 1' }, vao: '2 : 1 2 3\n2 : -1 -2 -3\n1 : 5 -5 0\n4 : 1 2\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Only negative numbers can be the answer, so only their indexes enter the queue, in order.', vi: 'Chỉ số âm mới có thể là đáp án, nên chỉ chỉ số của chúng vào hàng đợi, theo thứ tự.' },
    { en: 'After adding index i, the front is out of the window when it is ≤ i − k: remove it (at most one leaves per step).', vi: 'Sau khi thêm chỉ số i, đầu hàng ra khỏi cửa sổ khi nó ≤ i − k: bỏ nó (mỗi bước rời tối đa một).' },
  ],
  loiHayGap: [
    { en: 'Scanning each window from its start — O(n·k).', vi: 'Quét từng cửa sổ từ đầu — O(n·k).' },
    { en: 'Answering before the first full window (i < k − 1) — the result array gets shifted.', vi: 'Trả lời trước khi có cửa sổ đầy đủ đầu tiên (i < k − 1) — mảng kết quả bị lệch.' },
  ],
  giaiThich: { en: '<p>The queue holds the negative indexes inside the current window in order; its front is the first negative of the window. Each index enters and leaves once: O(n).</p>', vi: '<p>Hàng đợi giữ các chỉ số âm trong cửa sổ hiện tại theo thứ tự; đầu hàng là số âm đầu tiên của cửa sổ. Mỗi chỉ số vào và ra một lần: O(n).</p>' },
});

export default moDun({ slug: 'csd201-deque', ten: '2.4 Deques & the sliding-window maximum', de: [de1, de2, de3] });
