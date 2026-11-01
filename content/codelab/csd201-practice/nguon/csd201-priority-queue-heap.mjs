/** CSD201 · 2.5 — Hàng đợi ưu tiên & heap: min-heap mảng (kiểm bất biến heap bằng reflection), top-k bằng heap cỡ k, xử lý cấp cứu theo mức rồi thứ tự đến. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-2-5-min-heap-pq',
  tieuDe: { en: 'A priority queue on a binary min-heap: insert and removeMin in O(log n)', vi: 'Hàng đợi ưu tiên trên min-heap nhị phân: insert và removeMin trong O(log n)' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['complete binary tree in an array', 'parent (i-1)/2, children 2i+1 and 2i+2', 'up-heap', 'down-heap'],
  moTa: {
    en: `<p>${c('MinHeapPQ')} keeps its keys in ${c('int[] heap')} (index 0 = root) with ${c('size')}; the array grows by doubling (given). Write:</p>
<ul><li>${c('void insert(int x)')} — put x at index size, then <b>up-heap</b>: swap with the parent while it is smaller;</li>
<li>${c('int removeMin()')} — return the root, move the last element to the root, then <b>down-heap</b>: swap with the smaller child while a child is smaller; empty → ${c('NoSuchElementException')};</li>
<li>${c('int min()')}.</li></ul>
<p>After every command the grader reads ${c('heap')} and ${c('size')} and checks the heap property for every parent/child pair; it also runs a million inserts and removals against a time limit.</p>`,
    vi: `<p>${c('MinHeapPQ')} giữ khoá trong ${c('int[] heap')} (chỉ số 0 = gốc) kèm ${c('size')}; mảng nới gấp đôi (cho sẵn). Viết ${c('insert(x)')} — đặt x ở chỉ số size rồi <b>up-heap</b>: đổi chỗ với cha khi cha lớn hơn; ${c('removeMin()')} — trả gốc, đưa phần tử cuối lên gốc rồi <b>down-heap</b>: đổi chỗ với con nhỏ hơn khi con đó nhỏ hơn, rỗng thì ${c('NoSuchElementException')}; ${c('min()')}.</p>
<p>Sau mỗi lệnh máy chấm đọc ${c('heap')} và ${c('size')} và kiểm tính chất heap cho mọi cặp cha/con; nó còn chạy một triệu lần insert và removeMin có hạn giờ.</p>`,
  },
  yeuCau: { en: ['O(log n) per insert/removeMin; no sorting, no java.util.PriorityQueue (rule R1).', 'Keep the field names heap and size.'], vi: ['O(log n) mỗi insert/removeMin; không sắp xếp, không java.util.PriorityQueue (luật R1).', 'Giữ tên trường heap và size.'] },
  dauVao: { en: 'INS x · DEL · MIN · PERF.', vi: 'INS x · DEL · MIN · PERF.' },
  dauRa: { en: 'Result, the array and the heap-property check.', vi: 'Kết quả, mảng và kết quả kiểm tính chất heap.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no PriorityQueue / Arrays.sort / Collections in MinHeapPQ', vi: 'không PriorityQueue / Arrays.sort / Collections trong MinHeapPQ', re: String.raw`\bPriorityQueue\b|Arrays\s*\.\s*sort|\bCollections\b|\bTreeMap\b|\bTreeSet\b`, file: 'MinHeapPQ' }],
  hen: { n: '1,000,000 inserts and 1,000,000 removeMin', ms: 4000, can: 'O(log n) per operation', cham: 'O(n) per operation (scanning or keeping a sorted array)' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        MinHeapPQ t = new MinHeapPQ();',
      them: `
    static String state(MinHeapPQ t) {
        int[] h = (int[]) Kiem.lay(t, "heap");
        int n = (Integer) Kiem.lay(t, "size");
        String bad = "heap OK";
        for (int i = 1; i < n; i++) {
            if (h[(i - 1) / 2] > h[i]) {
                bad = "NOT A HEAP: parent " + h[(i - 1) / 2] + " > child " + h[i];
                break;
            }
        }
        return Arrays.toString(Arrays.copyOf(h, n)) + " " + bad;
    }
`,
      lenh: `                if (p[0].equals("INS")) {
                    t.insert(n(1));
                } else if (p[0].equals("DEL")) {
                    r = String.valueOf(t.removeMin());
                } else if (p[0].equals("MIN")) {
                    r = String.valueOf(t.min());
                } else {
                    final MinHeapPQ q = new MinHeapPQ();
                    final int[] v = Kiem.ngauNhien(1000000, 1000000000, 42);
                    final boolean[] sorted = {true};
                    r = Kiem.hen("1,000,000 inserts then 1,000,000 removeMin", 4000, new Runnable() {
                        public void run() {
                            for (int x : v) {
                                q.insert(x);
                            }
                            int prev = Integer.MIN_VALUE;
                            for (int i = 0; i < v.length; i++) {
                                int x = q.removeMin();
                                if (x < prev) {
                                    sorted[0] = false;
                                }
                                prev = x;
                            }
                        }
                    }) + ", came out sorted: " + sorted[0];
                }`,
      trangThai: 'state(t)',
    }),
  },
  tep: {
    'MinHeapPQ.java': j`
import java.util.NoSuchElementException;

public class MinHeapPQ {
    private int[] heap = new int[4];
    private int size = 0;

    private void swap(int i, int j) {
        int t = heap[i];
        heap[i] = heap[j];
        heap[j] = t;
    }

    public int min() {
        if (size == 0) {
            throw new NoSuchElementException();
        }
        return heap[0];
    }

    public void insert(int x) {
        if (size == heap.length) {
            heap = java.util.Arrays.copyOf(heap, 2 * heap.length);
        }
        //>> heap[size++] = x; // TODO: up-heap
        int i = size++;
        heap[i] = x;
        while (i > 0 && heap[(i - 1) / 2] > heap[i]) {
            swap(i, (i - 1) / 2);
            i = (i - 1) / 2;
        }
        //<<
    }

    public int removeMin() {
        //>> return 0; // TODO: root out, last element to the root, down-heap
        int root = min();
        heap[0] = heap[--size];
        int i = 0;
        while (true) {
            int l = 2 * i + 1;
            int r = l + 1;
            int m = i;
            if (l < size && heap[l] < heap[m]) {
                m = l;
            }
            if (r < size && heap[r] < heap[m]) {
                m = r;
            }
            if (m == i) {
                break;
            }
            swap(i, m);
            i = m;
        }
        return root;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the up-heap and down-heap traces', vi: 'các bước up-heap và down-heap' }, vao: 'INS 5\nINS 3\nINS 8\nINS 1\nINS 9\nINS 2\nMIN\nDEL\nDEL\nDEL\nINS 0\nDEL\n' },
    { ten: { en: 'duplicates, empty errors', vi: 'khoá trùng, lỗi khi rỗng' }, vao: 'DEL\nINS 4\nINS 4\nINS 4\nDEL\nDEL\nDEL\nMIN\nINS -1\nINS 7\nINS -3\nDEL\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Up-heap: while i > 0 and heap[parent(i)] > heap[i], swap and move i to the parent.', vi: 'Up-heap: khi i > 0 và heap[cha(i)] > heap[i], đổi chỗ rồi dời i lên cha.' },
    { en: 'Down-heap: pick the smaller of the two children (if they exist, i.e. index < size); swap only if it is smaller than heap[i].', vi: 'Down-heap: chọn con nhỏ hơn trong hai con (nếu tồn tại, tức chỉ số < size); chỉ đổi chỗ nếu nó nhỏ hơn heap[i].' },
  ],
  loiHayGap: [
    { en: 'Comparing with the LEFT child only in down-heap — the right child can be smaller, and the heap property breaks.', vi: 'Down-heap chỉ so với con TRÁI — con phải có thể nhỏ hơn, tính chất heap bị phá.' },
    { en: 'Testing children against heap.length instead of size — leftover values beyond size get pulled back into the heap.', vi: 'Kiểm con theo heap.length thay vì size — giá trị cũ sau size bị kéo lại vào heap.' },
  ],
  giaiThich: { en: '<p>A complete binary tree with n nodes has height ⌊log₂ n⌋, and up-heap/down-heap walk one root-to-leaf path: O(log n) per operation. A million inserts and removals take ~2·10⁷ swaps, against ~10¹¹ for a sorted array or a scanned list.</p>', vi: '<p>Cây nhị phân đầy đủ n nút có chiều cao ⌊log₂ n⌋, và up-heap/down-heap đi một đường gốc–lá: O(log n) mỗi thao tác. Một triệu lần thêm và lấy tốn ~2·10⁷ lần đổi chỗ, so với ~10¹¹ của mảng giữ sắp hay danh sách quét.</p>' },
});

const de2 = deJava({
  id: 'csd201-2-5-top-k',
  tieuDe: { en: 'The k largest of a million numbers with a heap of size k', vi: 'k số lớn nhất trong một triệu số bằng heap cỡ k' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['java.util.PriorityQueue', 'min-heap of size k', 'O(n log k)'],
  moTa: {
    en: `<p>Complete ${c('static int[] topK(int[] a, int k)')}: the k largest values of ${c('a')} in <b>descending</b> order (duplicates count separately; if k ≥ n, all values). Use a ${c('PriorityQueue<Integer>')} (a min-heap) that never holds more than k elements: add each value, and when the heap has k + 1 elements remove its minimum. At the end, pull the k survivors out.</p>
<p>Sorting the whole array is O(n log n); with a size-k heap it is O(n log k) and only O(k) memory.</p>`,
    vi: `<p>Hoàn thiện ${c('static int[] topK(int[] a, int k)')}: k giá trị lớn nhất của ${c('a')} theo thứ tự <b>giảm dần</b> (giá trị trùng tính riêng; k ≥ n thì lấy hết). Dùng ${c('PriorityQueue<Integer>')} (min-heap) không bao giờ giữ quá k phần tử: thêm từng giá trị, khi heap có k + 1 phần tử thì bỏ phần tử nhỏ nhất. Cuối cùng lấy k phần tử còn lại ra.</p>
<p>Sắp cả mảng là O(n log n); với heap cỡ k thì O(n log k) và chỉ O(k) bộ nhớ.</p>`,
  },
  yeuCau: { en: ['No sorting of a (rule R1); the heap never exceeds k + 1 elements.', 'Result in descending order.'], vi: ['Không sắp mảng a (luật R1); heap không bao giờ vượt k + 1 phần tử.', 'Kết quả giảm dần.'] },
  dauVao: { en: 'Lines "k : values"; PERF.', vi: 'Các dòng "k : giá trị"; PERF.' },
  dauRa: { en: 'The k largest, descending.', vi: 'k giá trị lớn nhất, giảm dần.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no sorting in TopK (Arrays.sort, Collections.sort, sorted())', vi: 'không sắp xếp trong TopK (Arrays.sort, Collections.sort, sorted())', re: String.raw`\.sort\s*\(|\.sorted\s*\(|\bTreeSet\b|\bTreeMap\b`, file: 'TopK' }],
  hen: { n: '3,000,000 values, k = 100,000', ms: 3000, can: 'O(n log k)', cham: 'O(n·k) (finding the maximum k times)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] a = Kiem.ngauNhien(3000000, 2000000000, 9);
                    final int[][] m = new int[1][];
                    r = Kiem.hen("n = 3,000,000, k = 100,000", 3000, new Runnable() {
                        public void run() {
                            m[0] = TopK.topK(a, 100000);
                        }
                    }) + ", largest " + (m[0] == null || m[0].length == 0 ? "-" : m[0][0] + ", 100,000th " + m[0][m[0].length - 1]);
                } else {
                    int[] a = new int[p.length - 2];
                    for (int i = 2; i < p.length; i++) {
                        a[i - 2] = n(i);
                    }
                    r = Arrays.toString(TopK.topK(a, n(0)));
                }`,
    }),
  },
  tep: {
    'TopK.java': j`
import java.util.PriorityQueue;

public class TopK {

    static int[] topK(int[] a, int k) {
        //>> return new int[0]; // TODO: a min-heap of at most k elements
        PriorityQueue<Integer> h = new PriorityQueue<>(); // min-heap: the smallest of the current top k is on top
        for (int x : a) {
            h.add(x);
            if (h.size() > k) {
                h.poll();
            }
        }
        int[] res = new int[h.size()];
        for (int i = res.length - 1; i >= 0; i--) {
            res[i] = h.poll(); // ascending out of the heap, filled from the back = descending
        }
        return res;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'small examples, duplicates', vi: 'ví dụ nhỏ, giá trị trùng' }, vao: '3 : 5 1 9 3 7 9 2\n2 : 4 4 4\n1 : -5 -2 -9\n' },
    { ten: { en: 'k ≥ n, k = 0', vi: 'k ≥ n, k = 0' }, vao: '5 : 3 1 2\n0 : 1 2 3\n3 : 10 20 30\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'The heap root is the smallest of the best k so far — exactly the one to throw away when a bigger value arrives.', vi: 'Gốc heap là phần tử nhỏ nhất trong k phần tử tốt nhất tới giờ — đúng cái cần bỏ khi một giá trị lớn hơn đến.' },
    { en: 'poll() returns ascending order; fill the result from the last index down to get descending order.', vi: 'poll() trả theo thứ tự tăng; điền kết quả từ chỉ số cuối về đầu để được thứ tự giảm.' },
  ],
  loiHayGap: [
    { en: 'Using a max-heap (Collections.reverseOrder()) of all n values — correct, but O(n) memory and O(n log n) time.', vi: 'Dùng max-heap (Collections.reverseOrder()) chứa cả n giá trị — đúng nhưng O(n) bộ nhớ và O(n log n) thời gian.' },
    { en: 'k = 0: new PriorityQueue<>(0) throws IllegalArgumentException — use the default constructor.', vi: 'k = 0: new PriorityQueue<>(0) ném IllegalArgumentException — dùng constructor mặc định.' },
  ],
  giaiThich: { en: '<p>The heap holds the best k values seen so far; each new value costs one add and maybe one poll, both O(log k). Total O(n log k) time and O(k) memory — the standard answer for "top 10 of a stream that does not fit in memory".</p>', vi: '<p>Heap giữ k giá trị tốt nhất đã gặp; mỗi giá trị mới tốn một add và có thể một poll, đều O(log k). Tổng O(n log k) thời gian và O(k) bộ nhớ — đáp án chuẩn cho "top 10 của một luồng dữ liệu không vừa bộ nhớ".</p>' },
});

const de3 = deJava({
  id: 'csd201-2-5-triage-comparator',
  tieuDe: { en: 'Emergency triage: severity first, then arrival order, with a Comparator', vi: 'Phân loại cấp cứu: mức nặng trước, rồi thứ tự đến, bằng Comparator' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['PriorityQueue with a Comparator', 'ties broken by an arrival counter', 'heaps are not stable'],
  moTa: {
    en: `<p>${c('Triage')} serves patients by <b>severity</b> (5 = critical first) and, for equal severity, by <b>arrival order</b>. Complete ${c('arrive(String name, int severity)')} (severity outside 1–5 is ignored, return false), ${c('String next()')} (${c('"name(severity)"')} or ${c('"nobody"')}), and ${c('int waiting()')}.</p>
<p>A ${c('PriorityQueue')} is <b>not stable</b>: two patients with the same severity can come out in any order unless the comparator itself breaks the tie. Give every patient a sequence number when they arrive.</p>`,
    vi: `<p>${c('Triage')} phục vụ bệnh nhân theo <b>mức nặng</b> (5 = nguy kịch trước) và, cùng mức thì theo <b>thứ tự đến</b>. Hoàn thiện ${c('arrive(name, severity)')} (mức ngoài 1–5 bị bỏ qua, trả false), ${c('next()')} (${c('"tên(mức)"')} hoặc ${c('"nobody"')}), và ${c('waiting()')}.</p>
<p>${c('PriorityQueue')} <b>không ổn định</b>: hai bệnh nhân cùng mức có thể ra theo thứ tự bất kỳ trừ khi chính comparator phân xử. Hãy gán cho mỗi bệnh nhân một số thứ tự khi họ đến.</p>`,
  },
  yeuCau: { en: ['A PriorityQueue with a comparator: severity descending, then sequence ascending.', 'O(log n) per arrive/next.'], vi: ['PriorityQueue với comparator: mức giảm dần, rồi số thứ tự tăng dần.', 'O(log n) mỗi lần arrive/next.'] },
  dauVao: { en: 'IN name severity · NEXT.', vi: 'IN tên mức · NEXT.' },
  dauRa: { en: 'Result and the number waiting.', vi: 'Kết quả và số người đang chờ.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        Triage t = new Triage();',
      lenh: `                if (p[0].equals("IN")) {
                    r = String.valueOf(t.arrive(p[1], n(2)));
                } else {
                    r = t.next();
                }`,
      trangThai: '"waiting " + t.waiting()',
    }),
  },
  tep: {
    'Triage.java': j`
import java.util.PriorityQueue;

public class Triage {
    private static final class Patient {
        final String name;
        final int severity;
        final long seq;

        Patient(String name, int severity, long seq) {
            this.name = name;
            this.severity = severity;
            this.seq = seq;
        }
    }

    //>> // TODO: the queue and a counter
    private long counter = 0;
    private final PriorityQueue<Patient> q = new PriorityQueue<>((a, b) ->
            a.severity != b.severity ? Integer.compare(b.severity, a.severity) : Long.compare(a.seq, b.seq));
    //<<

    public boolean arrive(String name, int severity) {
        //>> return false; // TODO
        if (severity < 1 || severity > 5) {
            return false;
        }
        q.add(new Patient(name, severity, counter++));
        return true;
        //<<
    }

    public String next() {
        //>> return "nobody"; // TODO
        Patient p = q.poll();
        return p == null ? "nobody" : p.name + "(" + p.severity + ")";
        //<<
    }

    public int waiting() {
        //>> return 0; // TODO
        return q.size();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'severity first, arrival order for ties', vi: 'mức trước, cùng mức thì theo thứ tự đến' }, vao: 'IN An 3\nIN Binh 5\nIN Chi 3\nIN Dung 1\nIN Em 5\nIN Phuc 3\nNEXT\nNEXT\nNEXT\nNEXT\nNEXT\nNEXT\nNEXT\n' },
    { ten: { en: 'invalid severity; many equal ones (a heap would reorder them)', vi: 'mức sai; nhiều người cùng mức (heap sẽ xáo trộn)' }, vao: 'IN X 0\nIN Y 6\nIN a 2\nIN b 2\nIN c 2\nIN d 2\nIN e 2\nIN f 2\nIN g 2\nNEXT\nIN h 4\nNEXT\nNEXT\nNEXT\nNEXT\nNEXT\nNEXT\nNEXT\nNEXT\n', an: true },
  ],
  goiY: [
    { en: 'Comparator: if the severities differ, the higher one first (compare b with a); otherwise the smaller sequence number first.', vi: 'Comparator: mức khác nhau thì mức cao trước (so b với a); ngược lại số thứ tự nhỏ hơn trước.' },
    { en: 'Use a long counter incremented on every accepted arrival.', vi: 'Dùng bộ đếm long tăng ở mỗi lần nhận bệnh nhân.' },
  ],
  loiHayGap: [
    { en: 'Comparing only the severity — the heap returns equal patients in heap order, not arrival order.', vi: 'Chỉ so mức — heap trả các bệnh nhân cùng mức theo thứ tự trong heap, không theo thứ tự đến.' },
    { en: 'Using b.severity - a.severity in general code — subtraction can overflow for large keys; Integer.compare cannot.', vi: 'Dùng b.severity - a.severity trong code tổng quát — phép trừ có thể tràn với khoá lớn; Integer.compare thì không.' },
  ],
  giaiThich: { en: '<p>Adding the arrival number as a second key makes all keys distinct, so the heap order is completely determined: severity descending, then FIFO. Both operations stay O(log n).</p>', vi: '<p>Thêm số thứ tự đến làm khoá thứ hai khiến mọi khoá khác nhau, nên thứ tự của heap được xác định hoàn toàn: mức giảm dần rồi FIFO. Cả hai thao tác vẫn O(log n).</p>' },
});

export default moDun({ slug: 'csd201-priority-queue-heap', ten: '2.5 Priority Queues & Heaps', de: [de1, de2, de3] });
