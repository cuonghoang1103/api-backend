/** CSD201 · 2.2 — Cài đặt stack/queue: stack mảng nới gấp đôi, queue mảng vòng (first/last như slide, nới theo thứ tự hàng), queue bằng hai stack. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-2-2-array-stack',
  tieuDe: { en: 'An array stack that grows correctly (and the off-by-one in top)', vi: 'Ngăn xếp mảng nới đúng cách (và lỗi lệch một ở top)' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['top index = -1 when empty', 'doubling the array', 'amortized O(1) push'],
  moTa: {
    en: `<p>${c('ArrayStack')} as on the slides: ${c('int[] a')} and ${c('int top')} = index of the top element, ${c('-1')} when empty. Write ${c('push')} (when full, double the array and copy), ${c('pop')} and ${c('top')} (both throw ${c('java.util.EmptyStackException')} when empty).</p>
<p>The grader reads ${c('a.length')} and ${c('top')} after every command, and pushes two million values against a time limit.</p>`,
    vi: `<p>${c('ArrayStack')} như trên slide: ${c('int[] a')} và ${c('int top')} = chỉ số phần tử đỉnh, ${c('-1')} khi rỗng. Viết ${c('push')} (đầy thì gấp đôi mảng và chép), ${c('pop')} và ${c('top')} (cả hai ném ${c('java.util.EmptyStackException')} khi rỗng).</p>
<p>Máy chấm đọc ${c('a.length')} và ${c('top')} sau mỗi lệnh, và đẩy hai triệu giá trị có hạn giờ.</p>`,
  },
  yeuCau: { en: ['Initial capacity 2 (given); double when full.', 'Keep the field names a and top.'], vi: ['Sức chứa ban đầu 2 (cho sẵn); đầy thì gấp đôi.', 'Giữ tên trường a và top.'] },
  dauVao: { en: 'PUSH x · POP · TOP · PERF.', vi: 'PUSH x · POP · TOP · PERF.' },
  dauRa: { en: 'Result, top index, capacity and the used part of the array.', vi: 'Kết quả, chỉ số top, sức chứa và phần mảng đang dùng.' },
  main: 'KiemTra',
  hen: { n: '2,000,000 pushes', ms: 3000, can: 'O(1) amortized', cham: 'O(n) per push (growing by one slot)' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        ArrayStack t = new ArrayStack();',
      them: `
    static String state(ArrayStack t) {
        int[] a = (int[]) Kiem.lay(t, "a");
        int top = (Integer) Kiem.lay(t, "top");
        return "top=" + top + " capacity=" + a.length + " used=" + Arrays.toString(Arrays.copyOf(a, Math.max(0, top + 1)));
    }
`,
      lenh: `                if (p[0].equals("PUSH")) {
                    t.push(n(1));
                } else if (p[0].equals("POP")) {
                    r = String.valueOf(t.pop());
                } else if (p[0].equals("TOP")) {
                    r = String.valueOf(t.top());
                } else {
                    final ArrayStack s = new ArrayStack();
                    r = Kiem.hen("2,000,000 pushes", 3000, new Runnable() {
                        public void run() {
                            for (int i = 0; i < 2000000; i++) {
                                s.push(i);
                            }
                        }
                    }) + ", top value " + s.top();
                }`,
      trangThai: 'state(t)',
    }),
  },
  tep: {
    'ArrayStack.java': j`
import java.util.EmptyStackException;

public class ArrayStack {
    private int[] a = new int[2];
    private int top = -1; // index of the top element; -1 = empty

    public boolean isEmpty() {
        return top == -1;
    }

    public void push(int x) {
        //>> // TODO: grow (double) when full, then store
        if (top == a.length - 1) {
            int[] b = new int[2 * a.length];
            for (int i = 0; i <= top; i++) {
                b[i] = a[i];
            }
            a = b;
        }
        a[++top] = x;
        //<<
    }

    public int pop() {
        //>> return 0; // TODO
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return a[top--];
        //<<
    }

    public int top() {
        //>> return 0; // TODO
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return a[top];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'grows from 2 to 4 to 8', vi: 'nới từ 2 lên 4 lên 8' }, vao: 'PUSH 1\nPUSH 2\nPUSH 3\nPUSH 4\nPUSH 5\nTOP\nPOP\nPOP\nPUSH 6\n' },
    { ten: { en: 'empty errors', vi: 'lỗi khi rỗng' }, vao: 'POP\nTOP\nPUSH 7\nPOP\nPOP\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Full means top == a.length - 1 (top is an index, not a count).', vi: 'Đầy nghĩa là top == a.length - 1 (top là chỉ số, không phải số đếm).' },
    { en: 'push: a[++top] = x (move first, then write); pop: return a[top--] (read first, then move).', vi: 'push: a[++top] = x (dời trước, ghi sau); pop: return a[top--] (đọc trước, dời sau).' },
  ],
  loiHayGap: [
    { en: 'Testing full with top == a.length — the push writes a[a.length] and throws ArrayIndexOutOfBoundsException.', vi: 'Kiểm đầy bằng top == a.length — push ghi a[a.length] và ném ArrayIndexOutOfBoundsException.' },
    { en: 'a[top++] = x — the first element lands in a[-1].', vi: 'a[top++] = x — phần tử đầu tiên rơi vào a[-1].' },
  ],
  giaiThich: { en: '<p>Doubling makes the copies of n pushes add up to less than n, so push is O(1) amortized; pop and top are always O(1). The slides’ "top = −1 when empty" convention means the number of elements is top + 1.</p>', vi: '<p>Gấp đôi làm tổng số lần chép của n lần push nhỏ hơn n, nên push O(1) khấu hao; pop và top luôn O(1). Quy ước của slide "top = −1 khi rỗng" nghĩa là số phần tử là top + 1.</p>' },
});

const de2 = deJava({
  id: 'csd201-2-2-circular-queue',
  tieuDe: { en: 'Circular array queue with first/last as on the slides — wrap around, then grow in queue order', vi: 'Hàng đợi mảng vòng với first/last như slide — quay vòng, rồi nới theo thứ tự hàng' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['circular array', '(last + 1) % max', 'full vs empty', 'copying in queue order when growing'],
  moTa: {
    en: `<p>${c('ArrayQueue')} uses the slides’ convention: ${c('int[] a')}, ${c('max')} = capacity, ${c('first')} and ${c('last')} are the indexes of the front and rear elements, both ${c('-1')} when the queue is empty. The cell after ${c('max - 1')} is ${c('0')}.</p>
<ul><li>${c('enqueue(int x)')} — if full, ${c('grow()')} first; an empty queue starts at cell 0;</li>
<li>${c('int dequeue()')} — removing the only element makes ${c('first = last = -1')}; empty → ${c('NoSuchElementException')};</li>
<li>${c('grow()')} — a new array of ${c('2 * max')} with the elements copied <b>in queue order</b> to cells 0, 1, 2, …; then ${c('first = 0')}, ${c('last = size - 1')}.</li></ul>
<p>The grader prints ${c('first')}, ${c('last')}, ${c('max')} and the raw array after every command.</p>`,
    vi: `<p>${c('ArrayQueue')} dùng quy ước của slide: ${c('int[] a')}, ${c('max')} = sức chứa, ${c('first')} và ${c('last')} là chỉ số phần tử đầu và cuối, cùng bằng ${c('-1')} khi rỗng. Ô sau ${c('max - 1')} là ${c('0')}. ${c('enqueue(x)')} — đầy thì ${c('grow()')} trước, hàng rỗng thì bắt đầu ở ô 0; ${c('dequeue()')} — lấy phần tử duy nhất thì ${c('first = last = -1')}, rỗng thì ${c('NoSuchElementException')}; ${c('grow()')} — mảng mới ${c('2 * max')}, chép phần tử <b>theo thứ tự hàng</b> vào ô 0, 1, 2, …, rồi ${c('first = 0')}, ${c('last = size - 1')}.</p>
<p>Máy chấm in ${c('first')}, ${c('last')}, ${c('max')} và mảng thô sau mỗi lệnh.</p>`,
  },
  yeuCau: { en: ['isFull: the queue is not empty and (last + 1) % max == first.', 'Keep the field names a, max, first, last.'], vi: ['isFull: hàng không rỗng và (last + 1) % max == first.', 'Giữ tên trường a, max, first, last.'] },
  dauVao: { en: 'Capacity on the first line, then ENQ x · DEQ.', vi: 'Sức chứa ở dòng đầu, rồi ENQ x · DEQ.' },
  dauRa: { en: 'Result, first/last/max, the raw array and the queue front to rear.', vi: 'Kết quả, first/last/max, mảng thô và hàng đợi từ đầu tới cuối.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        ArrayQueue t = new ArrayQueue(Integer.parseInt(sc.nextLine().trim()));',
      them: `
    static String state(ArrayQueue t) {
        return "first=" + Kiem.lay(t, "first") + " last=" + Kiem.lay(t, "last") + " max=" + Kiem.lay(t, "max")
                + " a=" + Arrays.toString((int[]) Kiem.lay(t, "a")) + " queue=[" + t + "]";
    }
`,
      lenh: `                if (p[0].equals("ENQ")) {
                    t.enqueue(n(1));
                } else {
                    r = String.valueOf(t.dequeue());
                }`,
      trangThai: 'state(t)',
    }),
  },
  tep: {
    'ArrayQueue.java': j`
import java.util.NoSuchElementException;

public class ArrayQueue {
    private int[] a;
    private int max;
    private int first = -1, last = -1; // -1 = empty, as on the slides

    public ArrayQueue(int max1) { // max1 >= 1
        max = max1;
        a = new int[max];
    }

    public boolean isEmpty() {
        return first == -1;
    }

    public boolean isFull() {
        //>> return false; // TODO
        return !isEmpty() && (last + 1) % max == first;
        //<<
    }

    public int size() {
        //>> return 0; // TODO
        return isEmpty() ? 0 : (last - first + max) % max + 1;
        //<<
    }

    private void grow() {
        //>> // TODO: copy in QUEUE order into a new array of 2 * max
        int n = size();
        int[] b = new int[2 * max];
        for (int k = 0; k < n; k++) {
            b[k] = a[(first + k) % max];
        }
        a = b;
        max = 2 * max;
        first = 0;
        last = n - 1;
        //<<
    }

    public void enqueue(int x) {
        //>> // TODO
        if (isFull()) {
            grow();
        }
        if (isEmpty()) {
            first = last = 0;
        } else {
            last = (last + 1) % max;
        }
        a[last] = x;
        //<<
    }

    public int dequeue() {
        //>> return 0; // TODO
        if (isEmpty()) {
            throw new NoSuchElementException();
        }
        int x = a[first];
        if (first == last) {
            first = last = -1;
        } else {
            first = (first + 1) % max;
        }
        return x;
        //<<
    }

    @Override
    public String toString() { // front -> rear
        StringBuilder b = new StringBuilder();
        for (int k = 0; k < size(); k++) {
            b.append(k > 0 ? " " : "").append(a[(first + k) % max]);
        }
        return b.toString();
    }
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ trace: wrap around, then grow', vi: 'chuỗi của slide: quay vòng rồi nới' }, vao: '4\nENQ 1\nENQ 2\nENQ 3\nDEQ\nDEQ\nENQ 4\nENQ 5\nENQ 6\nENQ 7\nDEQ\nDEQ\nDEQ\nDEQ\nDEQ\nDEQ\n' },
    { ten: { en: 'capacity 1 grows twice', vi: 'sức chứa 1 nới hai lần' }, vao: '1\nENQ 1\nENQ 2\nENQ 3\nDEQ\nENQ 4\nDEQ\nDEQ\nDEQ\n' },
    { ten: { en: 'many laps around the array without growing', vi: 'quay nhiều vòng quanh mảng mà không nới' }, vao: '3\nENQ 1\nENQ 2\nDEQ\nENQ 3\nDEQ\nENQ 4\nDEQ\nENQ 5\nENQ 6\nDEQ\nENQ 7\nENQ 8\nDEQ\nDEQ\n', an: true },
  ],
  goiY: [
    { en: 'size = (last - first + max) % max + 1 when not empty; full when size == max, which is the same as (last + 1) % max == first.', vi: 'size = (last - first + max) % max + 1 khi không rỗng; đầy khi size == max, tương đương (last + 1) % max == first.' },
    { en: 'grow: element k of the queue is a[(first + k) % max] — copy it to b[k]. Copying a[0..max-1] in array order puts the queue in the wrong order once it has wrapped.', vi: 'grow: phần tử thứ k của hàng là a[(first + k) % max] — chép vào b[k]. Chép a[0..max-1] theo thứ tự mảng sẽ sai thứ tự hàng khi hàng đã quay vòng.' },
  ],
  loiHayGap: [
    { en: 'Growing with Arrays.copyOf(a, 2 * max) after a wrap — the front part ends up after the rear part.', vi: 'Nới bằng Arrays.copyOf(a, 2 * max) sau khi đã quay vòng — phần đầu hàng nằm sau phần cuối hàng.' },
    { en: 'Not resetting first and last to -1 when the last element leaves — the next enqueue thinks the queue is full or writes in the wrong cell.', vi: 'Không đặt first, last về -1 khi phần tử cuối cùng rời đi — enqueue sau đó tưởng hàng đầy hoặc ghi sai ô.' },
  ],
  giaiThich: { en: '<p>Moving first and last with % max lets the queue reuse the cells freed at the front, so enqueue and dequeue are O(1) without shifting. Growing must "unroll" the ring: copy in queue order so that after the copy the front is cell 0.</p>', vi: '<p>Dời first và last bằng % max cho hàng dùng lại các ô vừa trống ở đầu, nên enqueue và dequeue O(1) mà không dời phần tử. Khi nới phải "duỗi" vòng ra: chép theo thứ tự hàng để sau khi chép đầu hàng nằm ở ô 0.</p>' },
});

const de3 = deJava({
  id: 'csd201-2-2-two-stack-queue',
  tieuDe: { en: 'A queue made of two stacks: amortized O(1)', vi: 'Hàng đợi dựng từ hai ngăn xếp: O(1) khấu hao' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['inbox / outbox stacks', 'transfer only when the outbox is empty', 'amortized analysis'],
  moTa: {
    en: `<p>The interview classic. ${c('TwoStackQueue')} has two stacks (${c('Deque<Integer>')} used with ${c('push')}/${c('pop')} only): ${c('in')} receives every ${c('enqueue')}; ${c('dequeue')} and ${c('peek')} take from ${c('out')}, and only when ${c('out')} is empty do they move <b>everything</b> from ${c('in')} to ${c('out')} (which reverses the order). Empty queue → ${c('NoSuchElementException')}.</p>
<p>Moving on every dequeue (and back on every enqueue) is correct but O(n) per operation — the complexity check runs 600,000 mixed operations.</p>`,
    vi: `<p>Câu phỏng vấn kinh điển. ${c('TwoStackQueue')} có hai ngăn xếp (${c('Deque<Integer>')} chỉ dùng ${c('push')}/${c('pop')}): ${c('in')} nhận mọi ${c('enqueue')}; ${c('dequeue')} và ${c('peek')} lấy từ ${c('out')}, và chỉ khi ${c('out')} rỗng mới chuyển <b>toàn bộ</b> ${c('in')} sang ${c('out')} (thứ tự bị đảo). Hàng rỗng → ${c('NoSuchElementException')}.</p>
<p>Chuyển qua lại ở mỗi lần dequeue/enqueue thì đúng nhưng O(n) mỗi thao tác — kiểm độ phức tạp chạy 600.000 thao tác xen kẽ.</p>`,
  },
  yeuCau: { en: ['Only push, pop, peek and isEmpty on the two stacks (rule R1).', 'Transfer only when out is empty.'], vi: ['Chỉ push, pop, peek và isEmpty trên hai ngăn xếp (luật R1).', 'Chỉ chuyển khi out rỗng.'] },
  dauVao: { en: 'ENQ x · DEQ · PEEK · PERF.', vi: 'ENQ x · DEQ · PEEK · PERF.' },
  dauRa: { en: 'Result and the two stacks (top first).', vi: 'Kết quả và hai ngăn xếp (đỉnh trước).' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'stack operations only (no addLast/pollLast/iterator/get) in TwoStackQueue', vi: 'chỉ thao tác ngăn xếp (không addLast/pollLast/iterator/get) trong TwoStackQueue', re: String.raw`\.(addLast|offerLast|pollLast|removeLast|peekLast|getLast|addFirst|getFirst|iterator|descendingIterator|get|add|offer|poll|remove)\s*\(`, file: 'TwoStackQueue' }],
  hen: { n: '300,000 enqueues mixed with 300,000 dequeues', ms: 3000, can: 'O(1) amortized', cham: 'O(n) per operation (moving everything every time)' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        TwoStackQueue t = new TwoStackQueue();',
      lenh: `                if (p[0].equals("ENQ")) {
                    t.enqueue(n(1));
                } else if (p[0].equals("DEQ")) {
                    r = String.valueOf(t.dequeue());
                } else if (p[0].equals("PEEK")) {
                    r = String.valueOf(t.peek());
                } else {
                    final TwoStackQueue q = new TwoStackQueue();
                    final long[] s = new long[1];
                    r = Kiem.hen("300,000 x (enqueue, enqueue, dequeue), then empty it", 3000, new Runnable() {
                        public void run() {
                            for (int i = 0; i < 300000; i++) {
                                q.enqueue(2 * i);
                                q.enqueue(2 * i + 1);
                                s[0] += q.dequeue();
                            }
                            for (int i = 0; i < 300000; i++) {
                                s[0] += q.dequeue();
                            }
                        }
                    }) + ", sum " + s[0];
                }`,
      trangThai: '"in " + Kiem.lay(t, "in") + " out " + Kiem.lay(t, "out")',
    }),
  },
  tep: {
    'TwoStackQueue.java': j`
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.NoSuchElementException;

public class TwoStackQueue {
    private final Deque<Integer> in = new ArrayDeque<>();
    private final Deque<Integer> out = new ArrayDeque<>();

    public void enqueue(int x) {
        //>> // TODO
        in.push(x);
        //<<
    }

    public int dequeue() {
        //>> return 0; // TODO
        int x = peek();
        out.pop();
        return x;
        //<<
    }

    public int peek() {
        //>> return 0; // TODO: refill out only when it is empty
        if (out.isEmpty()) {
            while (!in.isEmpty()) {
                out.push(in.pop());
            }
        }
        if (out.isEmpty()) {
            throw new NoSuchElementException();
        }
        return out.peek();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'interleaved operations keep FIFO order', vi: 'thao tác xen kẽ vẫn giữ thứ tự FIFO' }, vao: 'ENQ 1\nENQ 2\nENQ 3\nDEQ\nENQ 4\nPEEK\nDEQ\nDEQ\nENQ 5\nDEQ\nDEQ\nDEQ\n' },
    { ten: { en: 'empty errors and refills', vi: 'lỗi rỗng và nạp lại' }, vao: 'PEEK\nENQ 9\nDEQ\nDEQ\nENQ 1\nENQ 2\nPEEK\nENQ 3\nDEQ\nDEQ\nDEQ\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Moving in → out reverses the order once, so out’s top is the oldest element.', vi: 'Chuyển in → out đảo thứ tự một lần, nên đỉnh out là phần tử cũ nhất.' },
    { en: 'Never move while out still has elements — they are older than everything in in.', vi: 'Đừng bao giờ chuyển khi out còn phần tử — chúng cũ hơn mọi thứ trong in.' },
  ],
  loiHayGap: [
    { en: 'Moving in → out while out is not empty — newer elements land on top of older ones and FIFO breaks.', vi: 'Chuyển in → out khi out chưa rỗng — phần tử mới đè lên phần tử cũ và FIFO hỏng.' },
    { en: 'Moving everything back to in after each dequeue — correct output, O(n) per operation.', vi: 'Chuyển hết về in sau mỗi dequeue — output đúng, nhưng O(n) mỗi thao tác.' },
  ],
  giaiThich: { en: '<p>Each element is pushed on in once, moved to out once and popped from out once: at most three stack operations per element over its whole life, so any sequence of n operations costs O(n) — amortized O(1) each, although a single dequeue can take O(n).</p>', vi: '<p>Mỗi phần tử được push vào in một lần, chuyển sang out một lần và pop khỏi out một lần: tối đa ba thao tác ngăn xếp cho cả đời một phần tử, nên mọi dãy n thao tác tốn O(n) — khấu hao O(1) mỗi thao tác, dù một lần dequeue riêng lẻ có thể tốn O(n).</p>' },
});

export default moDun({ slug: 'csd201-stack-queue-cai-dat', ten: '2.2 Implementing stacks & queues: circular array vs linked', de: [de1, de2, de3] });
