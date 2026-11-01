/** CSD201 · 2.1 — Stack (LIFO) & Queue (FIFO): ngăn xếp liên kết, hàng đợi liên kết O(1), đảo k phần tử đầu hàng đợi bằng ngăn xếp. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const NODE = j`
// GIVEN — do not change.
class Node {
    int info;
    Node next;

    Node(int x, Node p) {
        info = x;
        next = p;
    }
}
`;

const de1 = deJava({
  id: 'csd201-2-1-linked-stack',
  tieuDe: { en: 'A linked stack: push, pop, top — all at the head', vi: 'Ngăn xếp liên kết: push, pop, top — tất cả ở đầu danh sách' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['LIFO', 'stack on a singly linked list', 'EmptyStackException'],
  moTa: {
    en: `<p>${c('LinkedStack')} keeps its elements in a singly linked list whose first node is the top (${c('Node top')}). Write ${c('push(int x)')}, ${c('int pop()')}, ${c('int top()')}, ${c('boolean isEmpty()')} and ${c('int size()')} — all O(1). ${c('pop')}/${c('top')} on an empty stack throw ${c('java.util.EmptyStackException')}.</p>
<p>The grader walks your nodes from ${c('top')} after every command: the stack must be the linked list itself, not an array hidden behind it.</p>`,
    vi: `<p>${c('LinkedStack')} giữ phần tử trong danh sách liên kết đơn có nút đầu là đỉnh (${c('Node top')}). Viết ${c('push(x)')}, ${c('pop()')}, ${c('top()')}, ${c('isEmpty()')}, ${c('size()')} — tất cả O(1). ${c('pop')}/${c('top')} trên ngăn xếp rỗng ném ${c('java.util.EmptyStackException')}.</p>
<p>Máy chấm đi theo các nút từ ${c('top')} sau mỗi lệnh: ngăn xếp phải chính là danh sách liên kết, không phải một mảng giấu phía sau.</p>`,
  },
  yeuCau: { en: ['Push and pop at the head of the list (O(1)).', 'No java.util collection inside (rule R1).'], vi: ['Push và pop ở đầu danh sách (O(1)).', 'Không dùng collection của java.util bên trong (luật R1).'] },
  dauVao: { en: 'PUSH x · POP · TOP.', vi: 'PUSH x · POP · TOP.' },
  dauRa: { en: 'Result, the nodes from top and size.', vi: 'Kết quả, các nút từ đỉnh và size.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no java.util collection in LinkedStack', vi: 'không collection của java.util trong LinkedStack', re: String.raw`\b(Stack|ArrayList|LinkedList|ArrayDeque|Deque|Vector)\s*<|\bnew\s+int\s*\[`, file: 'LinkedStack' }],
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        LinkedStack t = new LinkedStack();',
      lenh: `                if (p[0].equals("PUSH")) {
                    t.push(n(1));
                } else if (p[0].equals("POP")) {
                    r = String.valueOf(t.pop());
                } else {
                    r = String.valueOf(t.top());
                }`,
      trangThai: '"top-> " + Kiem.chuoi(Kiem.lay(t, "top"), "next", "info", 1000) + " size=" + t.size() + " empty=" + t.isEmpty()',
    }),
  },
  tep: {
    'Node.java': NODE,
    'LinkedStack.java': j`
import java.util.EmptyStackException;

public class LinkedStack {
    private Node top;
    private int size;

    public boolean isEmpty() {
        //>> return true; // TODO
        return top == null;
        //<<
    }

    public int size() {
        //>> return 0; // TODO
        return size;
        //<<
    }

    public void push(int x) {
        //>> // TODO
        top = new Node(x, top);
        size++;
        //<<
    }

    public int pop() {
        //>> return 0; // TODO
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        int x = top.info;
        top = top.next;
        size--;
        return x;
        //<<
    }

    public int top() {
        //>> return 0; // TODO
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return top.info;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'push three, pop in reverse order', vi: 'đẩy ba, lấy ra theo thứ tự ngược' }, vao: 'PUSH 1\nPUSH 2\nPUSH 3\nTOP\nPOP\nPOP\nPUSH 4\nPOP\nPOP\nPOP\nTOP\n' },
    { ten: { en: 'empty stack errors, reuse', vi: 'lỗi ngăn xếp rỗng, dùng lại' }, vao: 'POP\nTOP\nPUSH -5\nTOP\nPOP\nPUSH 6\nPUSH 6\nPOP\nTOP\n', an: true },
  ],
  goiY: [
    { en: 'push = new node in front: top = new Node(x, top). pop = remember top.info, then top = top.next.', vi: 'push = nút mới ở đầu: top = new Node(x, top). pop = nhớ top.info rồi top = top.next.' },
    { en: 'Check isEmpty() first in pop and top and throw new EmptyStackException().', vi: 'Kiểm isEmpty() trước trong pop và top rồi ném new EmptyStackException().' },
  ],
  loiHayGap: [
    { en: 'Pushing at the tail of the list — then pop must walk to the end: O(n).', vi: 'Push vào cuối danh sách — khi đó pop phải đi tới cuối: O(n).' },
    { en: 'Returning 0 or -1 for an empty pop — callers cannot tell it from a real 0 or -1 on the stack.', vi: 'Trả 0 hay -1 khi pop rỗng — người gọi không phân biệt được với số 0 hay -1 thật trên ngăn xếp.' },
  ],
  giaiThich: { en: '<p>The head of a singly linked list is the only place where both insertion and removal are O(1), so it is the natural top. The size counter makes size() O(1) instead of a walk.</p>', vi: '<p>Đầu danh sách liên kết đơn là chỗ duy nhất mà cả thêm lẫn xoá đều O(1), nên nó là đỉnh tự nhiên. Bộ đếm size làm size() O(1) thay vì phải đi một lượt.</p>' },
});

const de2 = deJava({
  id: 'csd201-2-1-linked-queue',
  tieuDe: { en: 'A linked queue: enqueue at the tail, dequeue at the head, both O(1)', vi: 'Hàng đợi liên kết: enqueue ở cuối, dequeue ở đầu, cả hai O(1)' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['FIFO', 'head and tail of a queue', 'the queue becoming empty'],
  moTa: {
    en: `<p>${c('LinkedQueue')} has ${c('Node head, tail')}: ${c('enqueue(int x)')} adds at the tail, ${c('int dequeue()')} removes at the head, ${c('int front()')} looks at the head. Both ends O(1). An empty ${c('dequeue')}/${c('front')} throws ${c('NoSuchElementException("queue is empty")')}.</p>
<p>The grader checks after every command that ${c('tail')} is the real last node — the classic bug is a dequeue that empties the queue but leaves ${c('tail')} on the removed node.</p>`,
    vi: `<p>${c('LinkedQueue')} có ${c('Node head, tail')}: ${c('enqueue(x)')} thêm ở cuối, ${c('dequeue()')} lấy ở đầu, ${c('front()')} xem đầu. Cả hai đầu O(1). ${c('dequeue')}/${c('front')} khi rỗng ném ${c('NoSuchElementException("queue is empty")')}.</p>
<p>Máy chấm kiểm sau mỗi lệnh rằng ${c('tail')} đúng là nút cuối — lỗi kinh điển là dequeue làm hàng rỗng mà vẫn để ${c('tail')} trên nút đã xoá.</p>`,
  },
  yeuCau: { en: ['O(1) per operation.', 'No java.util collection inside.'], vi: ['O(1) mỗi thao tác.', 'Không dùng collection của java.util bên trong.'] },
  dauVao: { en: 'ENQ x · DEQ · FRONT · PERF.', vi: 'ENQ x · DEQ · FRONT · PERF.' },
  dauRa: { en: 'Result and the queue from head with the tail check.', vi: 'Kết quả và hàng đợi từ head kèm kiểm tail.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no java.util collection in LinkedQueue', vi: 'không collection của java.util trong LinkedQueue', re: String.raw`\b(ArrayList|LinkedList|ArrayDeque|Deque|Queue)\s*<`, file: 'LinkedQueue' }],
  hen: { n: '500,000 enqueues and dequeues', ms: 3000, can: 'O(1) per operation', cham: 'O(n) per enqueue (walking to the end)' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        LinkedQueue t = new LinkedQueue();',
      lenh: `                if (p[0].equals("ENQ")) {
                    t.enqueue(n(1));
                } else if (p[0].equals("DEQ")) {
                    r = String.valueOf(t.dequeue());
                } else if (p[0].equals("FRONT")) {
                    r = String.valueOf(t.front());
                } else {
                    final LinkedQueue q = new LinkedQueue();
                    final long[] s = new long[1];
                    r = Kiem.hen("500,000 enqueues, then 500,000 dequeues", 3000, new Runnable() {
                        public void run() {
                            for (int i = 0; i < 500000; i++) {
                                q.enqueue(i);
                            }
                            for (int i = 0; i < 500000; i++) {
                                s[0] += q.dequeue();
                            }
                        }
                    }) + ", sum " + s[0];
                }`,
      trangThai: 'Kiem.don(t, "head", "tail", "next", "info")',
    }),
  },
  tep: {
    'Node.java': NODE,
    'LinkedQueue.java': j`
import java.util.NoSuchElementException;

public class LinkedQueue {
    private Node head, tail;

    public boolean isEmpty() {
        return head == null;
    }

    public void enqueue(int x) {
        //>> // TODO: add at the tail
        Node q = new Node(x, null);
        if (isEmpty()) {
            head = tail = q;
        } else {
            tail.next = q;
            tail = q;
        }
        //<<
    }

    public int dequeue() {
        //>> return 0; // TODO: remove at the head
        int x = front();
        head = head.next;
        if (head == null) {
            tail = null; // the queue is empty again
        }
        return x;
        //<<
    }

    public int front() {
        //>> return 0; // TODO
        if (isEmpty()) {
            throw new NoSuchElementException("queue is empty");
        }
        return head.info;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'first in, first out', vi: 'vào trước, ra trước' }, vao: 'ENQ 1\nENQ 2\nENQ 3\nDEQ\nFRONT\nENQ 4\nDEQ\nDEQ\nDEQ\nDEQ\n' },
    { ten: { en: 'empties and refills', vi: 'rỗng rồi thêm lại' }, vao: 'FRONT\nENQ 9\nDEQ\nENQ 8\nENQ 7\nDEQ\nDEQ\nENQ 6\nFRONT\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Enqueue is addLast with a tail, dequeue is removeFirst — the two O(1) operations of a singly linked list.', vi: 'Enqueue là addLast có tail, dequeue là removeFirst — hai thao tác O(1) của danh sách liên kết đơn.' },
    { en: 'When dequeue removes the last element, head becomes null: set tail = null too.', vi: 'Khi dequeue lấy phần tử cuối cùng, head thành null: gán luôn tail = null.' },
  ],
  loiHayGap: [
    { en: 'Dequeue at the tail — a singly list cannot find the node before the tail in O(1).', vi: 'Dequeue ở cuối — danh sách đơn không tìm được nút trước tail trong O(1).' },
    { en: 'Not resetting tail when the queue empties: the next enqueue writes tail.next on a node that is gone, and head stays null.', vi: 'Không đặt lại tail khi hàng rỗng: enqueue sau đó ghi tail.next lên một nút đã mất, còn head vẫn null.' },
  ],
  giaiThich: { en: '<p>A queue needs one end for adding and the other for removing. In a singly linked list, adding at the tail (with a tail pointer) and removing at the head are both O(1); the opposite choice would make dequeue O(n).</p>', vi: '<p>Hàng đợi cần một đầu để thêm và đầu kia để lấy ra. Với danh sách liên kết đơn, thêm ở cuối (có con trỏ tail) và lấy ở đầu đều O(1); chọn ngược lại thì dequeue thành O(n).</p>' },
});

const de3 = deJava({
  id: 'csd201-2-1-reverse-first-k',
  tieuDe: { en: 'Reverse the first k elements of a queue with a stack', vi: 'Đảo k phần tử đầu của hàng đợi bằng một ngăn xếp' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['moving data between a stack and a queue', 'rotating a queue', 'only the ADT operations'],
  moTa: {
    en: `<p>Complete ${c('static void reverseFirstK(Queue<Integer> q, int k)')}: the first k elements of the queue come out in reverse order, the rest keep their order behind them. ${c('[1,2,3,4,5]')} with k = 3 → ${c('[3,2,1,4,5]')}. If k ≤ 0 or k &gt; size, nothing changes.</p>
<p>Use only the queue operations (${c('add')}, ${c('remove')}, ${c('size')}) and one ${c('Deque<Integer>')} used as a stack (${c('push')}, ${c('pop')}) — no lists, no arrays, no indexes (rule R1).</p>`,
    vi: `<p>Hoàn thiện ${c('static void reverseFirstK(Queue<Integer> q, int k)')}: k phần tử đầu hàng đợi ra theo thứ tự ngược, phần còn lại giữ thứ tự phía sau. ${c('[1,2,3,4,5]')} với k = 3 → ${c('[3,2,1,4,5]')}. k ≤ 0 hoặc k &gt; size thì không đổi gì.</p>
<p>Chỉ dùng thao tác hàng đợi (${c('add')}, ${c('remove')}, ${c('size')}) và một ${c('Deque<Integer>')} dùng như ngăn xếp (${c('push')}, ${c('pop')}) — không list, không mảng, không chỉ số (luật R1).</p>`,
  },
  yeuCau: { en: ['O(n) operations.', 'Only queue + stack operations.'], vi: ['O(n) thao tác.', 'Chỉ thao tác hàng đợi + ngăn xếp.'] },
  dauVao: { en: 'Lines "k : values".', vi: 'Các dòng "k : giá trị".' },
  dauRa: { en: 'The queue after the call.', vi: 'Hàng đợi sau lời gọi.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'only queue and stack operations: no List, array or get(i) in QueueOps', vi: 'chỉ thao tác hàng đợi và ngăn xếp: không List, mảng hay get(i) trong QueueOps', re: String.raw`\b(List|ArrayList|LinkedList)\b|\[|\.get\s*\(|\.toArray\s*\(`, file: 'QueueOps' }],
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                Queue<Integer> q = new ArrayDeque<>();
                for (int i = 2; i < p.length; i++) {
                    q.add(n(i));
                }
                QueueOps.reverseFirstK(q, n(0));
                r = q.toString();`,
    }),
  },
  tep: {
    'QueueOps.java': j`
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Queue;

public class QueueOps {

    static void reverseFirstK(Queue<Integer> q, int k) {
        //>> // TODO: stack the first k, put them back, rotate the rest behind them
        int n = q.size();
        if (k <= 0 || k > n) {
            return;
        }
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < k; i++) {
            st.push(q.remove());
        }
        while (!st.isEmpty()) {
            q.add(st.pop()); // the first k come back reversed, at the rear
        }
        for (int i = 0; i < n - k; i++) {
            q.add(q.remove()); // move the untouched part behind them
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'k in the middle, k = size, k = 1', vi: 'k ở giữa, k = size, k = 1' }, vao: '3 : 1 2 3 4 5\n5 : 1 2 3 4 5\n1 : 1 2 3\n' },
    { ten: { en: 'invalid k, empty queue, duplicates', vi: 'k sai, hàng rỗng, giá trị trùng' }, vao: '0 : 1 2\n4 : 1 2 3\n2 :\n2 : 7 7 8 8\n', an: true },
  ],
  goiY: [
    { en: 'Step 1: remove k elements into the stack. Step 2: pop them all back into the queue — they are now reversed but at the rear.', vi: 'Bước 1: lấy k phần tử cho vào ngăn xếp. Bước 2: pop hết vào lại hàng đợi — giờ chúng đã ngược nhưng ở cuối.' },
    { en: 'Step 3: move the other n − k elements from the front to the rear, one by one (remove then add).', vi: 'Bước 3: chuyển n − k phần tử còn lại từ đầu xuống cuối, từng cái (remove rồi add).' },
  ],
  loiHayGap: [
    { en: 'Forgetting step 3 — the reversed block ends up after the untouched elements.', vi: 'Quên bước 3 — khối đã đảo nằm sau phần không đổi.' },
    { en: 'Reading q.size() inside the rotation loop — the size does not change, but if you compute n after step 1 it is k smaller.', vi: 'Đọc q.size() trong vòng xoay — size không đổi, nhưng nếu tính n sau bước 1 thì bị nhỏ đi k.' },
  ],
  giaiThich: { en: '<p>The stack reverses order, the queue preserves it: k pushes, k pops, n − k rotations — O(n) ADT operations and only the stack as extra memory (O(k)).</p>', vi: '<p>Ngăn xếp đảo thứ tự, hàng đợi giữ thứ tự: k lần push, k lần pop, n − k lần xoay — O(n) thao tác ADT và chỉ thêm bộ nhớ của ngăn xếp (O(k)).</p>' },
});

export default moDun({ slug: 'csd201-stack-queue', ten: '2.1 Stacks (LIFO) & Queues (FIFO)', de: [de1, de2, de3] });
