/** CSD201 · 2.6 — Thực hành chương 2: round-robin bằng ArrayDeque, hàng đợi bệnh nhân trên danh sách liên kết sắp (f1–f4), phần tử lớn hơn kế tiếp, hình chữ nhật lớn nhất trong biểu đồ cột. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-2-6-round-robin',
  tieuDe: { en: 'A round-robin CPU scheduler with a queue', vi: 'Bộ lập lịch CPU round-robin bằng hàng đợi' },
  doKho: 'EASY', phut: 20, dangBai: 'pe',
  khaiNiem: ['queue', 'time quantum', 'requeue unfinished work'],
  moTa: {
    en: `<p>Complete ${c('static String schedule(String[] names, int[] times, int q)')}: tasks join a queue in input order (tasks with time ≤ 0 are skipped). Repeatedly take the front task, run it for ${c('min(q, left)')} units (the clock advances), and if it is not finished put it back at the rear. Return the finishing order as ${c('"name@time"')} separated by spaces: P1 5, P2 2, P3 4 with q = 2 → ${c('"P2@4 P3@9 P1@11"')}.</p>`,
    vi: `<p>Hoàn thiện ${c('static String schedule(String[] names, int[] times, int q)')}: các tác vụ vào hàng theo thứ tự nhập (thời gian ≤ 0 bị bỏ qua). Lặp: lấy tác vụ đầu hàng, chạy ${c('min(q, left)')} đơn vị (đồng hồ tăng), chưa xong thì đưa về cuối hàng. Trả về thứ tự hoàn thành dạng ${c('"tên@thời điểm"')} cách nhau dấu cách: P1 5, P2 2, P3 4 với q = 2 → ${c('"P2@4 P3@9 P1@11"')}.</p>`,
  },
  yeuCau: { en: ['Use a Queue (ArrayDeque).', 'Empty result: an empty string.'], vi: ['Dùng Queue (ArrayDeque).', 'Không có tác vụ nào: chuỗi rỗng.'] },
  dauVao: { en: 'Lines "q : name time name time …".', vi: 'Các dòng "q : tên thời_gian tên thời_gian …".' },
  dauRa: { en: 'The finishing order.', vi: 'Thứ tự hoàn thành.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                int m = (p.length - 2) / 2;
                String[] names = new String[m];
                int[] times = new int[m];
                for (int i = 0; i < m; i++) {
                    names[i] = p[2 + 2 * i];
                    times[i] = n(3 + 2 * i);
                }
                r = "[" + RoundRobin.schedule(names, times, n(0)) + "]";`,
    }),
  },
  tep: {
    'RoundRobin.java': j`
import java.util.ArrayDeque;
import java.util.Queue;

public class RoundRobin {
    private static final class Task {
        final String name;
        int left;

        Task(String name, int left) {
            this.name = name;
            this.left = left;
        }
    }

    static String schedule(String[] names, int[] times, int q) {
        //>> return ""; // TODO
        Queue<Task> ready = new ArrayDeque<>();
        for (int i = 0; i < names.length; i++) {
            if (times[i] > 0) {
                ready.add(new Task(names[i], times[i]));
            }
        }
        StringBuilder done = new StringBuilder();
        int clock = 0;
        while (!ready.isEmpty()) {
            Task t = ready.remove();
            int run = Math.min(q, t.left);
            clock += run;
            t.left -= run;
            if (t.left > 0) {
                ready.add(t); // not finished: back to the rear
            } else {
                done.append(done.length() > 0 ? " " : "").append(t.name).append('@').append(clock);
            }
        }
        return done.toString();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the lesson’s three processes, quantum 1 and 10', vi: 'ba tiến trình của bài, lượng tử 1 và 10' }, vao: '2 : P1 5 P2 2 P3 4\n1 : P1 5 P2 2 P3 4\n10 : P1 5 P2 2 P3 4\n' },
    { ten: { en: 'invalid times skipped, nothing to run', vi: 'thời gian sai bị bỏ, không có gì để chạy' }, vao: '3 : A 0 B -2 C 7\n2 : X 0\n4 : A 4 B 4 C 4\n', an: true },
  ],
  goiY: [
    { en: 'The clock only moves when a task runs: clock += min(q, left).', vi: 'Đồng hồ chỉ tăng khi có tác vụ chạy: clock += min(q, left).' },
    { en: 'A finished task is recorded with the clock right after its last slice.', vi: 'Tác vụ xong được ghi với giá trị đồng hồ ngay sau lát cuối của nó.' },
  ],
  loiHayGap: [
    { en: 'Adding a full quantum to the clock even when the task needed less.', vi: 'Cộng đủ một lượng tử vào đồng hồ dù tác vụ cần ít hơn.' },
    { en: 'Putting the unfinished task back at the FRONT (push) — it would run again immediately.', vi: 'Đưa tác vụ chưa xong về ĐẦU hàng (push) — nó sẽ chạy lại ngay.' },
  ],
  giaiThich: { en: '<p>The queue is the "ready list" of an operating system: FIFO gives every task the CPU in turn. Each slice is O(1), and a task of length t is served ⌈t/q⌉ times.</p>', vi: '<p>Hàng đợi chính là "danh sách sẵn sàng" của hệ điều hành: FIFO cho mỗi tác vụ lần lượt được CPU. Mỗi lát O(1), tác vụ dài t được phục vụ ⌈t/q⌉ lần.</p>' },
});

const de2 = deJava({
  id: 'csd201-2-6-patient-queue',
  tieuDe: { en: 'PE style: a patient priority queue on a sorted linked list (f1–f4)', vi: 'Kiểu PE: hàng đợi bệnh nhân trên danh sách liên kết có thứ tự (f1–f4)' },
  doKho: 'HARD', phut: 35, dangBai: 'pe',
  khaiNiem: ['priority queue as a sorted list', 'FIFO among equal priorities', 'unlink and reinsert'],
  moTa: {
    en: `<p>${c('PatientQueue')} keeps ${c('Patient(name, severity)')} nodes in a singly linked list sorted from the most urgent (severity 5) to the least (1); equal severities keep arrival order.</p>
<ul><li><b>f1</b> ${c('enqueue(name, severity)')} — severity outside 1–5 is ignored; insert at the right place (behind those with the same severity);</li>
<li><b>f2</b> ${c('Patient dequeue()')} — remove the head; ${c('null')} if empty;</li>
<li><b>f3</b> ${c('int countAtLeast(int k)')} — patients with severity ≥ k; stop walking at the first lower one;</li>
<li><b>f4</b> ${c('boolean update(String name, int severity)')} — the patient’s condition changes: unlink them and enqueue again (they go behind the others of their new severity); false if not found or the severity is invalid.</li></ul>`,
    vi: `<p>${c('PatientQueue')} giữ các nút ${c('Patient(name, severity)')} trong danh sách liên kết đơn sắp từ khẩn nhất (mức 5) tới nhẹ nhất (1); cùng mức thì giữ thứ tự đến. <b>f1</b> ${c('enqueue(name, severity)')} — mức ngoài 1–5 bị bỏ qua, chèn đúng chỗ (sau những người cùng mức); <b>f2</b> ${c('dequeue()')} — lấy head, rỗng thì ${c('null')}; <b>f3</b> ${c('countAtLeast(k)')} — số người có mức ≥ k, dừng ở người đầu tiên thấp hơn; <b>f4</b> ${c('update(name, severity)')} — tình trạng thay đổi: gỡ ra rồi enqueue lại (đứng sau những người cùng mức mới), không tìm thấy hoặc mức sai thì false.</p>`,
  },
  yeuCau: { en: ['A singly linked list of your own nodes (no java.util collections, rule R1).', 'Patient and Node are given.'], vi: ['Danh sách liên kết đơn với nút tự viết (không collection của java.util, luật R1).', 'Patient và Node cho sẵn.'] },
  dauVao: { en: 'IN name severity · OUT · COUNT k · UPD name severity.', vi: 'IN tên mức · OUT · COUNT k · UPD tên mức.' },
  dauRa: { en: 'Result and the list from head.', vi: 'Kết quả và danh sách từ head.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no java.util collections in PatientQueue', vi: 'không collection của java.util trong PatientQueue', re: String.raw`\b(PriorityQueue|ArrayList|LinkedList|ArrayDeque|Collections|TreeMap)\b`, file: 'PatientQueue' }],
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        PatientQueue t = new PatientQueue();',
      lenh: `                if (p[0].equals("IN")) {
                    t.enqueue(p[1], n(2));
                } else if (p[0].equals("OUT")) {
                    r = String.valueOf(t.dequeue());
                } else if (p[0].equals("COUNT")) {
                    r = String.valueOf(t.countAtLeast(n(1)));
                } else {
                    r = String.valueOf(t.update(p[1], n(2)));
                }`,
      trangThai: 'Kiem.chuoi(Kiem.lay(t, "head"), "next", "info", 1000)',
    }),
  },
  tep: {
    'Patient.java': j`
// GIVEN — do not change.
class Patient {
    String name;
    int severity; // 1 (mild) .. 5 (critical)

    Patient(String name, int severity) {
        this.name = name;
        this.severity = severity;
    }

    @Override
    public String toString() {
        return name + "(" + severity + ")";
    }
}
`,
    'Node.java': j`
// GIVEN — do not change.
class Node {
    Patient info;
    Node next;

    Node(Patient x, Node p) {
        info = x;
        next = p;
    }
}
`,
    'PatientQueue.java': j`
public class PatientQueue {
    Node head; // the most urgent patient first

    // f1
    void enqueue(String name, int severity) {
        //>> // TODO
        if (severity < 1 || severity > 5) {
            return;
        }
        Patient x = new Patient(name, severity);
        if (head == null || severity > head.info.severity) {
            head = new Node(x, head);
            return;
        }
        Node p = head;
        while (p.next != null && p.next.info.severity >= severity) { // >= walks past equals: FIFO
            p = p.next;
        }
        p.next = new Node(x, p.next);
        //<<
    }

    // f2
    Patient dequeue() {
        //>> return null; // TODO
        if (head == null) {
            return null;
        }
        Patient x = head.info;
        head = head.next;
        return x;
        //<<
    }

    // f3
    int countAtLeast(int k) {
        //>> return 0; // TODO
        int c = 0;
        for (Node p = head; p != null && p.info.severity >= k; p = p.next) {
            c++;
        }
        return c;
        //<<
    }

    // f4
    boolean update(String name, int severity) {
        //>> return false; // TODO
        if (head == null || severity < 1 || severity > 5) {
            return false;
        }
        if (head.info.name.equals(name)) {
            head = head.next;
        } else {
            Node f = head; // f stays one node before the patient
            while (f.next != null && !f.next.info.name.equals(name)) {
                f = f.next;
            }
            if (f.next == null) {
                return false;
            }
            f.next = f.next.next;
        }
        enqueue(name, severity);
        return true;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'arrivals in mixed order, FIFO among equals, updates', vi: 'đến lẫn lộn, FIFO trong cùng mức, cập nhật' }, vao: 'IN An 3\nIN Binh 5\nIN Chi 3\nIN Dung 1\nIN Em 5\nIN Bad 7\nCOUNT 3\nUPD Dung 5\nUPD Chi 1\nUPD Zed 2\nOUT\nOUT\nCOUNT 4\n' },
    { ten: { en: 'update the head, empty queue', vi: 'cập nhật head, hàng rỗng' }, vao: 'OUT\nUPD X 3\nIN A 2\nIN B 2\nUPD A 2\nUPD B 0\nCOUNT 1\nCOUNT 3\nOUT\nOUT\nOUT\n', an: true },
  ],
  goiY: [
    { en: 'f1: the new patient goes before head only if strictly more urgent; otherwise walk while p.next has severity >= the new one.', vi: 'f1: bệnh nhân mới đứng trước head chỉ khi khẩn hơn hẳn; ngược lại đi khi p.next có mức >= mức mới.' },
    { en: 'f4: keep a pointer one node BEFORE the patient so you can unlink it; the head is a special case. Then reuse f1.', vi: 'f4: giữ con trỏ đứng TRƯỚC bệnh nhân một nút để gỡ được; head là trường hợp riêng. Rồi dùng lại f1.' },
  ],
  loiHayGap: [
    { en: 'Using > instead of >= while walking in f1 — a new patient jumps ahead of earlier ones with the same severity.', vi: 'Dùng > thay cho >= khi đi trong f1 — người mới chen lên trước người đến sớm cùng mức.' },
    { en: 'f4 changing the severity field in place without moving the node — the list is no longer sorted.', vi: 'f4 sửa trường severity tại chỗ mà không dời nút — danh sách không còn có thứ tự.' },
  ],
  giaiThich: { en: '<p>A sorted list makes dequeue O(1) and enqueue O(n) — the "sorted sequence" implementation of a priority queue from the slides. With only five severities a walk is short in practice, and the list gives FIFO among equals for free, which a heap does not.</p>', vi: '<p>Danh sách có thứ tự làm dequeue O(1) và enqueue O(n) — cách cài hàng đợi ưu tiên "dãy đã sắp" của slide. Chỉ có năm mức nên lượt đi thực tế ngắn, và danh sách cho FIFO trong cùng mức miễn phí, điều heap không làm được.</p>' },
});

const de3 = deJava({
  id: 'csd201-2-6-next-greater',
  tieuDe: { en: 'Next greater element with a monotonic stack', vi: 'Phần tử lớn hơn kế tiếp bằng ngăn xếp đơn điệu' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['monotonic stack', 'each index pushed and popped once', 'O(n) instead of O(n²)'],
  moTa: {
    en: `<p>Complete ${c('static int[] nextGreater(int[] a)')}: for every i, the first value to the right of a[i] that is strictly greater, or −1. ${c('[2,1,2,4,3]')} → ${c('[4,2,4,-1,-1]')}.</p>
<p>Keep a stack of indexes still waiting for their answer (their values are decreasing from bottom to top). When a[i] arrives, every waiting index with a smaller value has found its answer: pop it and record a[i]. Then push i.</p>`,
    vi: `<p>Hoàn thiện ${c('static int[] nextGreater(int[] a)')}: với mỗi i, giá trị đầu tiên bên phải a[i] lớn hơn hẳn nó, hoặc −1. ${c('[2,1,2,4,3]')} → ${c('[4,2,4,-1,-1]')}.</p>
<p>Giữ ngăn xếp các chỉ số còn chờ đáp án (giá trị giảm dần từ đáy lên đỉnh). Khi a[i] tới, mọi chỉ số đang chờ có giá trị nhỏ hơn đã có đáp án: pop và ghi a[i]. Rồi đẩy i vào.</p>`,
  },
  yeuCau: { en: ['O(n) with one stack.', 'Strictly greater.'], vi: ['O(n) với một ngăn xếp.', 'Lớn hơn hẳn.'] },
  dauVao: { en: 'One array per line; PERF.', vi: 'Mỗi dòng một mảng; PERF.' },
  dauRa: { en: 'The answers.', vi: 'Các đáp án.' },
  main: 'KiemTra',
  hen: { n: '2,000,000 decreasing values', ms: 3000, can: 'O(n)', cham: 'O(n²) (scanning to the right for each element)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] a = new int[2000000];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = a.length - i;
                    }
                    a[a.length - 1] = 5000000;
                    final int[][] m = new int[1][];
                    r = Kiem.hen("n = 2,000,000 (decreasing, then one big value)", 3000, new Runnable() {
                        public void run() {
                            m[0] = Stacks.nextGreater(a);
                        }
                    }) + ", answer[0] = " + (m[0] == null ? "-" : String.valueOf(m[0][0]));
                } else {
                    int[] a = new int[p.length];
                    for (int i = 0; i < p.length; i++) {
                        a[i] = n(i);
                    }
                    r = Arrays.toString(Stacks.nextGreater(a));
                }`,
    }),
  },
  tep: {
    'Stacks.java': j`
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

public class Stacks {

    static int[] nextGreater(int[] a) {
        //>> return new int[a.length]; // TODO
        int[] res = new int[a.length];
        Arrays.fill(res, -1);
        Deque<Integer> waiting = new ArrayDeque<>(); // indexes, values decreasing towards the top
        for (int i = 0; i < a.length; i++) {
            while (!waiting.isEmpty() && a[waiting.peek()] < a[i]) {
                res[waiting.pop()] = a[i];
            }
            waiting.push(i);
        }
        return res;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the example, increasing, decreasing', vi: 'ví dụ, tăng dần, giảm dần' }, vao: '2 1 2 4 3\n1 2 3 4\n4 3 2 1\n7\n' },
    { ten: { en: 'equal values are not greater; negatives', vi: 'giá trị bằng nhau không tính là lớn hơn; số âm' }, vao: '5 5 5 6\n-3 -1 -2 0\n3 1 1 1 2\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Initialise the answers to −1: whatever is still on the stack at the end has no greater element.', vi: 'Khởi tạo đáp án là −1: những gì còn trên ngăn xếp lúc cuối không có phần tử lớn hơn.' },
    { en: 'Pop while a[top] < a[i] (strictly) — equal values stay waiting.', vi: 'Pop khi a[top] < a[i] (hẳn) — giá trị bằng nhau tiếp tục chờ.' },
  ],
  loiHayGap: [
    { en: 'A nested loop scanning to the right — O(n²); a decreasing array of two million values never finishes.', vi: 'Vòng lồng quét sang phải — O(n²); mảng giảm dần hai triệu phần tử không bao giờ xong.' },
    { en: 'Pushing values instead of indexes — you cannot tell WHICH position the answer belongs to.', vi: 'Đẩy giá trị thay vì chỉ số — không biết đáp án thuộc vị trí NÀO.' },
  ],
  giaiThich: { en: '<p>Each index is pushed once and popped at most once, so the inner while loop runs at most n times in total: O(n). The stack always holds a decreasing run — that is why it is called monotonic.</p>', vi: '<p>Mỗi chỉ số được đẩy một lần và lấy ra tối đa một lần, nên vòng while bên trong chạy tổng cộng tối đa n lần: O(n). Ngăn xếp luôn là một dãy giảm — vì thế gọi là đơn điệu.</p>' },
});

const de4 = deJava({
  id: 'csd201-2-6-largest-rectangle',
  tieuDe: { en: 'Largest rectangle in a histogram (stack, O(n))', vi: 'Hình chữ nhật lớn nhất trong biểu đồ cột (ngăn xếp, O(n))' },
  doKho: 'HARD', phut: 40,
  khaiNiem: ['monotonic stack of increasing heights', 'left and right limits', 'sentinel bar of height 0'],
  moTa: {
    en: `<p>Bars of width 1 have heights ${c('h[0..n-1]')}. Complete ${c('static long largest(int[] h)')}: the largest area of a rectangle made of adjacent bars (its height = the lowest bar it covers). ${c('[2,1,5,6,2,3]')} → 10 (heights 5 and 6, width 2).</p>
<p>Keep a stack of indexes with increasing heights. When a lower bar arrives at i, every taller bar on the stack has found its right limit: pop it; its left limit is the new top of the stack, so its width is ${c('i - top - 1')} (or i if the stack is empty). Treat position n as a bar of height 0 to flush the stack.</p>`,
    vi: `<p>Các cột rộng 1 có chiều cao ${c('h[0..n-1]')}. Hoàn thiện ${c('static long largest(int[] h)')}: diện tích lớn nhất của hình chữ nhật gồm các cột liền nhau (cao = cột thấp nhất nó phủ). ${c('[2,1,5,6,2,3]')} → 10 (cao 5 và 6, rộng 2).</p>
<p>Giữ ngăn xếp chỉ số có chiều cao tăng dần. Khi cột thấp hơn tới ở i, mọi cột cao hơn trên ngăn xếp đã có giới hạn phải: pop ra; giới hạn trái của nó là đỉnh mới của ngăn xếp, nên bề rộng là ${c('i - top - 1')} (hoặc i nếu ngăn xếp rỗng). Coi vị trí n là một cột cao 0 để xả hết ngăn xếp.</p>`,
  },
  yeuCau: { en: ['O(n) with one stack.', 'The area can exceed int: return long.'], vi: ['O(n) với một ngăn xếp.', 'Diện tích có thể vượt int: trả về long.'] },
  dauVao: { en: 'One histogram per line; PERF.', vi: 'Mỗi dòng một biểu đồ; PERF.' },
  dauRa: { en: 'The largest area.', vi: 'Diện tích lớn nhất.' },
  main: 'KiemTra',
  hen: { n: '2,000,000 bars', ms: 3000, can: 'O(n)', cham: 'O(n²) (expanding left and right from every bar)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] h = new int[2000000];
                    for (int i = 0; i < h.length; i++) {
                        h[i] = 1000000000;
                    }
                    final long[] m = new long[1];
                    r = Kiem.hen("n = 2,000,000 equal bars of 10^9", 3000, new Runnable() {
                        public void run() {
                            m[0] = Histogram.largest(h);
                        }
                    }) + ", area " + m[0];
                } else {
                    int[] h = new int[p.length];
                    for (int i = 0; i < p.length; i++) {
                        h[i] = n(i);
                    }
                    r = String.valueOf(Histogram.largest(h));
                }`,
    }),
  },
  tep: {
    'Histogram.java': j`
import java.util.ArrayDeque;
import java.util.Deque;

public class Histogram {

    static long largest(int[] h) {
        //>> return 0; // TODO
        Deque<Integer> st = new ArrayDeque<>(); // indexes with increasing heights
        long best = 0;
        for (int i = 0; i <= h.length; i++) {
            int cur = i == h.length ? 0 : h[i]; // a bar of height 0 at the end flushes the stack
            while (!st.isEmpty() && h[st.peek()] > cur) {
                int top = st.pop();
                int width = st.isEmpty() ? i : i - st.peek() - 1;
                best = Math.max(best, (long) h[top] * width);
            }
            st.push(i);
        }
        return best;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the classic example and simple shapes', vi: 'ví dụ kinh điển và hình đơn giản' }, vao: '2 1 5 6 2 3\n2 4\n6 2 5 4 5 1 6\n3\n' },
    { ten: { en: 'increasing, decreasing, zeros, equal bars', vi: 'tăng, giảm, số 0, cột bằng nhau' }, vao: '1 2 3 4 5\n5 4 3 2 1\n0 0 0\n4 4 4 4\n0 9 0\n', an: true },
    { ten: { en: 'complexity check (and long areas)', vi: 'kiểm độ phức tạp (và diện tích long)' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'For each bar, the best rectangle with exactly its height extends left and right until a lower bar — the stack finds both limits in one pass.', vi: 'Với mỗi cột, hình chữ nhật tốt nhất có đúng chiều cao của nó kéo sang trái và phải tới cột thấp hơn — ngăn xếp tìm cả hai giới hạn trong một lượt.' },
    { en: 'Loop i from 0 to n inclusive, using height 0 at i = n, so that every bar gets popped and measured.', vi: 'Cho i chạy từ 0 tới n (tính cả n), dùng chiều cao 0 tại i = n, để mọi cột đều được pop và đo.' },
  ],
  loiHayGap: [
    { en: 'Width i - top instead of i - newTop - 1 — the rectangle wrongly stops at the popped bar’s own index.', vi: 'Bề rộng i - top thay vì i - đỉnh_mới - 1 — hình chữ nhật dừng sai ở chính chỉ số cột vừa pop.' },
    { en: 'int area — 2·10⁶ bars of 10⁹ overflow; multiply as long.', vi: 'Diện tích kiểu int — 2·10⁶ cột cao 10⁹ bị tràn; nhân bằng long.' },
  ],
  giaiThich: { en: '<p>Each index is pushed and popped once, and every pop computes the best rectangle for that bar using its two nearest lower neighbours (the new top on the left, i on the right). O(n) time, O(n) stack.</p>', vi: '<p>Mỗi chỉ số được đẩy và lấy ra một lần, và mỗi lần pop tính hình chữ nhật tốt nhất cho cột đó bằng hai cột thấp hơn gần nhất (đỉnh mới bên trái, i bên phải). O(n) thời gian, O(n) ngăn xếp.</p>' },
});

export default moDun({ slug: 'csd201-on-ch2', ten: '2.6 🧪 Practice — round-robin, a patient queue (PE), monotonic stacks', de: [de1, de2, de3, de4] });
