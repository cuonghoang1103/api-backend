/** CSD201 · 1.2 — Danh sách liên kết đơn, vòng, kép: thao tác cơ bản + kiểm liên kết thật (Kiem.don/vong/kep) + độ phức tạp addLast. */
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

    Node(int x) {
        this(x, null);
    }
}
`;

const de1 = deJava({
  id: 'csd201-1-2-sll-basics',
  tieuDe: { en: 'Singly linked list: addFirst, addLast in O(1), removeFirst, removeLast', vi: 'Danh sách liên kết đơn: addFirst, addLast O(1), removeFirst, removeLast' },
  doKho: 'EASY', phut: 25,
  khaiNiem: ['head and tail', 'empty / one-node special cases', 'O(1) addLast with tail', 'O(n) removeLast'],
  moTa: {
    en: `<p>The ${c('MyList')} of the lecture: ${c('Node head, tail')} and a ${c('size')} counter. Write the four basic operations:</p>
<ul><li>${c('addFirst(int x)')}, ${c('addLast(int x)')} — both O(1) (use ${c('tail')});</li>
<li>${c('int removeFirst()')}, ${c('int removeLast()')} — return the removed value; on an empty list throw ${c('IllegalStateException("empty list")')}. ${c('removeLast')} must find the node before the tail (O(n) in a singly list).</li></ul>
<p>After every command the grader walks your nodes from ${c('head')} along ${c('next')} and checks that ${c('tail')} really is the last node — a list that prints right but has a stale ${c('tail')} fails.</p>`,
    vi: `<p>${c('MyList')} của bài giảng: ${c('Node head, tail')} và bộ đếm ${c('size')}. Viết bốn thao tác cơ bản: ${c('addFirst(x)')}, ${c('addLast(x)')} — đều O(1) (dùng ${c('tail')}); ${c('removeFirst()')}, ${c('removeLast()')} — trả về giá trị bị xoá, danh sách rỗng thì ném ${c('IllegalStateException("empty list")')}. ${c('removeLast')} phải tìm nút đứng trước tail (O(n) với danh sách đơn).</p>
<p>Sau mỗi lệnh máy chấm đi theo các nút của bạn từ ${c('head')} theo ${c('next')} và kiểm ${c('tail')} đúng là nút cuối — danh sách in đúng mà ${c('tail')} cũ vẫn trượt.</p>`,
  },
  yeuCau: { en: ['Keep head, tail and size correct after every operation, including the list becoming empty.', 'Node.java is given.'], vi: ['Giữ head, tail, size đúng sau mọi thao tác, kể cả khi danh sách thành rỗng.', 'Node.java cho sẵn.'] },
  dauVao: { en: 'AF x · AL x · RF · RL · PERF.', vi: 'AF x · AL x · RF · RL · PERF.' },
  dauRa: { en: 'Result, the list walked from head, whether tail is right, and size.', vi: 'Kết quả, danh sách đi từ head, tail có đúng không, và size.' },
  main: 'KiemTra',
  hen: { n: '300,000 addLast', ms: 3000, can: 'O(1) per addLast', cham: 'O(n) per addLast (walking from head)', en: 'Walking to the end before every append is about 4.5·10¹⁰ steps.', vi: 'Đi tới cuối trước mỗi lần thêm là khoảng 4,5·10¹⁰ bước.' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        MyList t = new MyList();',
      lenh: `                if (p[0].equals("AF")) {
                    t.addFirst(n(1));
                } else if (p[0].equals("AL")) {
                    t.addLast(n(1));
                } else if (p[0].equals("RF")) {
                    r = String.valueOf(t.removeFirst());
                } else if (p[0].equals("RL")) {
                    r = String.valueOf(t.removeLast());
                } else {
                    final MyList big = new MyList();
                    r = Kiem.hen("300,000 addLast", 3000, new Runnable() {
                        public void run() {
                            for (int i = 0; i < 300000; i++) {
                                big.addLast(i);
                            }
                        }
                    }) + ", nodes " + Kiem.dem(Kiem.lay(big, "head"), "next") + ", size " + Kiem.lay(big, "size");
                }`,
      trangThai: 'Kiem.don(t, "head", "tail", "next", "info") + " size=" + Kiem.lay(t, "size")',
    }),
  },
  tep: {
    'Node.java': NODE,
    'MyList.java': j`
public class MyList {
    private Node head, tail;
    private int size;

    public boolean isEmpty() {
        return head == null;
    }

    public void addFirst(int x) {
        //>> // TODO
        head = new Node(x, head);
        if (tail == null) {
            tail = head;
        }
        size++;
        //<<
    }

    public void addLast(int x) {
        //>> // TODO: O(1) with tail
        Node q = new Node(x);
        if (isEmpty()) {
            head = tail = q;
        } else {
            tail.next = q;
            tail = q;
        }
        size++;
        //<<
    }

    public int removeFirst() {
        //>> return 0; // TODO
        if (isEmpty()) {
            throw new IllegalStateException("empty list");
        }
        int x = head.info;
        head = head.next;
        if (head == null) {
            tail = null;
        }
        size--;
        return x;
        //<<
    }

    public int removeLast() {
        //>> return 0; // TODO: find the node before tail
        if (isEmpty()) {
            throw new IllegalStateException("empty list");
        }
        int x = tail.info;
        if (head == tail) {
            head = tail = null;
        } else {
            Node p = head;
            while (p.next != tail) {
                p = p.next;
            }
            p.next = null;
            tail = p;
        }
        size--;
        return x;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'build from both ends, remove from both ends', vi: 'thêm từ hai đầu, xoá từ hai đầu' }, vao: 'AL 2\nAF 1\nAL 3\nAL 4\nRL\nRF\nAF 0\nRL\nRL\nRL\n' },
    { ten: { en: 'the list becomes empty and is used again', vi: 'danh sách thành rỗng rồi dùng lại' }, vao: 'RF\nRL\nAF 7\nRL\nAL 8\nRF\nAL 9\nAL 10\nRF\nRF\nAF 11\n' },
    { ten: { en: 'one node removed by removeLast, then addLast', vi: 'một nút bị removeLast, rồi addLast' }, vao: 'AF 5\nRL\nAL 6\nAL 7\nRL\nAL 8\nRF\nRL\nRL\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Every method has an "empty list" branch and a "one node" branch: write them first, the general case is two lines.', vi: 'Mọi hàm đều có nhánh "danh sách rỗng" và nhánh "một nút": viết chúng trước, trường hợp chung chỉ hai dòng.' },
    { en: 'removeLast: walk p from head while p.next != tail, then cut p.next and make p the tail.', vi: 'removeLast: cho p đi từ head khi p.next != tail, rồi cắt p.next và cho p làm tail.' },
  ],
  loiHayGap: [
    { en: 'removeFirst on the last node leaves tail pointing at the removed node — the next addLast attaches to a ghost.', vi: 'removeFirst nút cuối cùng mà để tail trỏ vào nút đã xoá — addLast sau đó gắn vào một nút ma.' },
    { en: 'addFirst on an empty list without setting tail — tail stays null and addLast crashes.', vi: 'addFirst vào danh sách rỗng mà không gán tail — tail vẫn null và addLast sập.' },
    { en: 'addLast walking from head to the end each time — correct but O(n): the complexity check fails.', vi: 'addLast đi từ head tới cuối mỗi lần — đúng nhưng O(n): trượt kiểm độ phức tạp.' },
  ],
  giaiThich: { en: '<p>With a tail reference, addFirst, addLast and removeFirst are O(1). removeLast stays O(n) in a singly linked list because the node before the tail can only be found by walking from the head — the reason doubly linked lists exist.</p>', vi: '<p>Có tham chiếu tail thì addFirst, addLast, removeFirst đều O(1). removeLast vẫn O(n) với danh sách đơn vì nút đứng trước tail chỉ tìm được bằng cách đi từ head — lý do có danh sách liên kết kép.</p>' },
});

const de2 = deJava({
  id: 'csd201-1-2-insert-delete-at',
  tieuDe: { en: 'insertAt(k, x) and deleteAt(k) on a singly linked list', vi: 'insertAt(k, x) và deleteAt(k) trên danh sách liên kết đơn' },
  doKho: 'MEDIUM', phut: 25, dangBai: 'pe',
  khaiNiem: ['walk to the node before position k', 'tail upkeep', 'boundary positions 0 and size'],
  moTa: {
    en: `<p>The two PE favourites, with 0-based positions:</p>
<ul><li>${c('boolean insertAt(int k, int x)')} — after the call, x is at position k (${c('0 ≤ k ≤ size')}; k = size appends). Return false and change nothing for any other k;</li>
<li>${c('boolean deleteAt(int k)')} — remove the node at position k (${c('0 ≤ k < size')}); false otherwise.</li></ul>
<p>${c('addLast')} is given. Keep ${c('head')}, ${c('tail')} and ${c('size')} right: inserting at size or deleting the last node must move ${c('tail')}.</p>`,
    vi: `<p>Hai câu PE quen thuộc, vị trí tính từ 0: ${c('insertAt(k, x)')} — sau lời gọi, x nằm ở vị trí k (${c('0 ≤ k ≤ size')}; k = size là thêm cuối), k khác thì trả false và không đổi gì; ${c('deleteAt(k)')} — xoá nút ở vị trí k (${c('0 ≤ k < size')}), ngược lại trả false.</p>
<p>${c('addLast')} cho sẵn. Giữ ${c('head')}, ${c('tail')}, ${c('size')} đúng: chèn ở size hay xoá nút cuối phải dời ${c('tail')}.</p>`,
  },
  yeuCau: { en: ['One walk to the node before position k — no second pass, no array.', 'Node.java is given.'], vi: ['Một lần đi tới nút đứng trước vị trí k — không đi hai lượt, không dùng mảng.', 'Node.java cho sẵn.'] },
  dauVao: { en: 'AL x · INS k x · DEL k.', vi: 'AL x · INS k x · DEL k.' },
  dauRa: { en: 'Result, the list walked from head, tail check, size.', vi: 'Kết quả, danh sách đi từ head, kiểm tail, size.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        MyList t = new MyList();',
      lenh: `                if (p[0].equals("AL")) {
                    t.addLast(n(1));
                } else if (p[0].equals("INS")) {
                    r = String.valueOf(t.insertAt(n(1), n(2)));
                } else {
                    r = String.valueOf(t.deleteAt(n(1)));
                }`,
      trangThai: 'Kiem.don(t, "head", "tail", "next", "info") + " size=" + Kiem.lay(t, "size")',
    }),
  },
  tep: {
    'Node.java': NODE,
    'MyList.java': j`
public class MyList {
    private Node head, tail;
    private int size;

    public void addLast(int x) {
        Node q = new Node(x);
        if (head == null) {
            head = tail = q;
        } else {
            tail.next = q;
            tail = q;
        }
        size++;
    }

    // x ends up at position k (0 <= k <= size)
    public boolean insertAt(int k, int x) {
        //>> return false; // TODO
        if (k < 0 || k > size) {
            return false;
        }
        if (k == 0) {
            head = new Node(x, head);
            if (tail == null) {
                tail = head;
            }
        } else {
            Node prev = head;
            for (int i = 0; i < k - 1; i++) {
                prev = prev.next;
            }
            prev.next = new Node(x, prev.next);
            if (prev == tail) {
                tail = prev.next;
            }
        }
        size++;
        return true;
        //<<
    }

    // removes the node at position k (0 <= k < size)
    public boolean deleteAt(int k) {
        //>> return false; // TODO
        if (k < 0 || k >= size) {
            return false;
        }
        if (k == 0) {
            head = head.next;
            if (head == null) {
                tail = null;
            }
        } else {
            Node prev = head;
            for (int i = 0; i < k - 1; i++) {
                prev = prev.next;
            }
            prev.next = prev.next.next;
            if (prev.next == null) {
                tail = prev;
            }
        }
        size--;
        return true;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'front, middle, end; delete front, middle, last', vi: 'đầu, giữa, cuối; xoá đầu, giữa, cuối' }, vao: 'AL 10\nAL 20\nAL 30\nINS 1 15\nINS 0 5\nINS 5 40\nDEL 5\nDEL 0\nDEL 1\nINS 3 99\n' },
    { ten: { en: 'invalid positions; empty list', vi: 'vị trí sai; danh sách rỗng' }, vao: 'DEL 0\nINS 1 7\nINS -1 7\nINS 0 7\nDEL 1\nDEL 0\nINS 0 8\nINS 1 9\nDEL 1\nDEL -2\n' },
    { ten: { en: 'delete the last node repeatedly, insert at size', vi: 'xoá nút cuối liên tục, chèn ở size' }, vao: 'AL 1\nAL 2\nAL 3\nDEL 2\nDEL 1\nINS 1 4\nINS 2 5\nDEL 2\nDEL 0\nDEL 0\nINS 0 6\n', an: true },
  ],
  goiY: [
    { en: 'Position 0 is the only case without a node before it — handle it apart (it changes head). For k ≥ 1 walk k − 1 steps from head to reach the node before.', vi: 'Vị trí 0 là trường hợp duy nhất không có nút đứng trước — xử lý riêng (nó đổi head). Với k ≥ 1 đi k − 1 bước từ head để tới nút đứng trước.' },
    { en: 'After relinking, ask: did the node before become the last (delete), or did the new node go after the old tail (insert)? Then move tail.', vi: 'Sau khi nối lại, hỏi: nút đứng trước có thành nút cuối không (xoá), hay nút mới nằm sau tail cũ (chèn)? Thì dời tail.' },
  ],
  loiHayGap: [
    { en: 'Walking k steps instead of k − 1 — the new node lands one position too far, and k = size throws NullPointerException.', vi: 'Đi k bước thay vì k − 1 — nút mới lệch một vị trí, và k = size ném NullPointerException.' },
    { en: 'Deleting the last node without updating tail — the next addLast attaches to the removed node, the element is lost.', vi: 'Xoá nút cuối mà không cập nhật tail — addLast sau đó gắn vào nút đã xoá, phần tử bị mất.' },
  ],
  giaiThich: { en: '<p>Both operations walk to position k − 1 (O(k), O(n) worst case) and relink in O(1). The only special cases are position 0 (head changes) and the end (tail changes); the empty list falls under them.</p>', vi: '<p>Cả hai thao tác đi tới vị trí k − 1 (O(k), xấu nhất O(n)) và nối lại trong O(1). Trường hợp đặc biệt chỉ là vị trí 0 (đổi head) và cuối danh sách (đổi tail); danh sách rỗng nằm trong hai trường hợp đó.</p>' },
});

const de3 = deJava({
  id: 'csd201-1-2-circular-list',
  tieuDe: { en: 'A circular list with only a tail: add, remove, rotate in O(1)', vi: 'Danh sách vòng chỉ có tail: thêm, xoá, xoay trong O(1)' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['circularly linked list', 'tail.next is the first node', 'rotate', 'one node pointing to itself'],
  moTa: {
    en: `<p>The CircularList of the lecture keeps <b>only</b> ${c('tail')}; the first node is ${c('tail.next')} and the last node points back to it. Complete, all in O(1):</p>
<ul><li>${c('addFirst(int x)')}, ${c('addLast(int x)')} — on an empty list the single node points to itself;</li>
<li>${c('int removeFirst()')} — throws ${c('IllegalStateException("empty list")')} when empty;</li>
<li>${c('void rotate()')} — the first element becomes the last (the round-robin step); nothing happens on an empty list.</li></ul>
<p>The grader walks your ring from ${c('tail.next')} and reports it as broken if it does not close exactly on the first node.</p>`,
    vi: `<p>CircularList của bài giảng <b>chỉ</b> giữ ${c('tail')}; nút đầu là ${c('tail.next')} và nút cuối trỏ ngược về nó. Hoàn thiện, tất cả O(1): ${c('addFirst(x)')}, ${c('addLast(x)')} — danh sách rỗng thì nút duy nhất tự trỏ về chính nó; ${c('removeFirst()')} — rỗng thì ném ${c('IllegalStateException("empty list")')}; ${c('rotate()')} — phần tử đầu thành phần tử cuối (bước của round-robin), rỗng thì không làm gì.</p>
<p>Máy chấm đi vòng của bạn từ ${c('tail.next')} và báo hỏng nếu vòng không khép đúng vào nút đầu.</p>`,
  },
  yeuCau: { en: ['No head field — only tail (rule R1).', 'No loops: every operation is O(1).'], vi: ['Không có trường head — chỉ tail (luật R1).', 'Không vòng lặp: mọi thao tác O(1).'] },
  dauVao: { en: 'AF x · AL x · RF · ROT.', vi: 'AF x · AL x · RF · ROT.' },
  dauRa: { en: 'Result and the ring walked from tail.next.', vi: 'Kết quả và vòng đi từ tail.next.' },
  main: 'KiemTra',
  quyTac: [
    { id: 'R1', en: 'CircularList has no head field', vi: 'CircularList không có trường head', re: String.raw`\bhead\b`, file: 'CircularList' },
    { id: 'R2', en: 'no loop in CircularList (all O(1))', vi: 'không vòng lặp trong CircularList (mọi thứ O(1))', re: String.raw`\b(for|while)\s*\(`, file: 'CircularList' },
  ],
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        CircularList t = new CircularList();',
      lenh: `                if (p[0].equals("AF")) {
                    t.addFirst(n(1));
                } else if (p[0].equals("AL")) {
                    t.addLast(n(1));
                } else if (p[0].equals("RF")) {
                    r = String.valueOf(t.removeFirst());
                } else {
                    t.rotate();
                }`,
      trangThai: 'ring(t)',
      them: `
    static String ring(CircularList t) {
        Object tail = Kiem.lay(t, "tail");
        if (tail == null) {
            return "(empty)";
        }
        return "ring " + Kiem.vong(Kiem.lay(tail, "next"), "next", "info", 1000) + " (tail " + Kiem.lay(tail, "info") + ")";
    }
`,
    }),
  },
  tep: {
    'CNode.java': j`
// GIVEN — do not change.
class CNode {
    int info;
    CNode next;

    CNode(int x) {
        info = x;
    }
}
`,
    'CircularList.java': j`
public class CircularList {
    private CNode tail; // tail.next is the first node

    public void addFirst(int x) {
        //>> // TODO
        CNode q = new CNode(x);
        if (tail == null) {
            q.next = q;
            tail = q;
        } else {
            q.next = tail.next;
            tail.next = q;
        }
        //<<
    }

    public void addLast(int x) {
        //>> // TODO
        addFirst(x);
        tail = tail.next; // the new first node becomes the last one
        //<<
    }

    public int removeFirst() {
        //>> return 0; // TODO
        if (tail == null) {
            throw new IllegalStateException("empty list");
        }
        CNode f = tail.next;
        if (f == tail) {
            tail = null;
        } else {
            tail.next = f.next;
        }
        return f.info;
        //<<
    }

    public void rotate() {
        //>> // TODO
        if (tail != null) {
            tail = tail.next;
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the lecture sequence addLast 1, 2, addFirst 0, addLast 3, then rotate', vi: 'chuỗi của bài: addLast 1, 2, addFirst 0, addLast 3, rồi xoay' }, vao: 'AL 1\nAL 2\nAF 0\nAL 3\nROT\nROT\nRF\nRF\n' },
    { ten: { en: 'one node: rotate, remove; empty list', vi: 'một nút: xoay, xoá; danh sách rỗng' }, vao: 'RF\nROT\nAF 9\nROT\nRF\nAL 4\nAL 5\nRF\nRF\nRF\n' },
    { ten: { en: 'a round-robin of five, everyone served twice', vi: 'round-robin năm phần tử, mỗi người hai lượt' }, vao: 'AL 1\nAL 2\nAL 3\nAL 4\nAL 5\nROT\nROT\nROT\nROT\nROT\nRF\nROT\nRF\nAF 6\nROT\n', an: true },
  ],
  goiY: [
    { en: 'addFirst: put the new node between tail and tail.next (q.next = tail.next; tail.next = q). addLast = addFirst, then tail = tail.next.', vi: 'addFirst: đặt nút mới giữa tail và tail.next (q.next = tail.next; tail.next = q). addLast = addFirst rồi tail = tail.next.' },
    { en: 'rotate is a single assignment: tail = tail.next. removeFirst unlinks tail.next — and when it was the only node the list becomes empty.', vi: 'rotate chỉ là một phép gán: tail = tail.next. removeFirst gỡ tail.next — nếu đó là nút duy nhất thì danh sách thành rỗng.' },
  ],
  loiHayGap: [
    { en: 'A single node with next == null instead of pointing to itself — the ring is "NOT CIRCULAR" and the second add crashes.', vi: 'Một nút có next == null thay vì tự trỏ về chính nó — vòng "NOT CIRCULAR" và lần thêm thứ hai sập.' },
    { en: 'removeFirst on the only node: tail.next = f.next leaves tail pointing at the removed node instead of making the list empty.', vi: 'removeFirst nút duy nhất: tail.next = f.next để tail vẫn trỏ nút đã xoá thay vì làm danh sách rỗng.' },
  ],
  giaiThich: { en: '<p>Keeping only the tail gives both ends in O(1): the last node is tail, the first is tail.next. Adding at either end is the same relinking (only which node is called tail differs), and rotate just moves the tail one step — that is why operating systems schedule processes round-robin on a circular list.</p>', vi: '<p>Chỉ giữ tail là có cả hai đầu trong O(1): nút cuối là tail, nút đầu là tail.next. Thêm ở đầu nào cũng là cùng một phép nối (chỉ khác nút nào được gọi là tail), và rotate chỉ dời tail một bước — vì vậy hệ điều hành lập lịch round-robin trên danh sách vòng.</p>' },
});

const de4 = deJava({
  id: 'csd201-1-2-doubly-list',
  tieuDe: { en: 'Doubly linked list: O(1) at both ends, links checked both ways', vi: 'Danh sách liên kết kép: O(1) ở cả hai đầu, kiểm liên kết hai chiều' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['prev and next', 'removeLast in O(1)', 'keeping both directions consistent'],
  moTa: {
    en: `<p>${c('DList')} has ${c('DNode head, tail')}; each ${c('DNode')} has ${c('info')}, ${c('prev')} and ${c('next')}. Write ${c('addFirst')}, ${c('addLast')}, ${c('removeFirst')}, ${c('removeLast')} — all O(1) now, thanks to ${c('prev')}. Removing from an empty list throws ${c('IllegalStateException("empty list")')}.</p>
<p>The grader checks every link both ways: ${c('head.prev == null')}, ${c('p.next.prev == p')} for every node, ${c('tail')} is the last node and ${c('tail.next == null')}; then it prints the list forwards from ${c('head')} and backwards from ${c('tail')} along ${c('prev')}.</p>`,
    vi: `<p>${c('DList')} có ${c('DNode head, tail')}; mỗi ${c('DNode')} có ${c('info')}, ${c('prev')}, ${c('next')}. Viết ${c('addFirst')}, ${c('addLast')}, ${c('removeFirst')}, ${c('removeLast')} — giờ đều O(1) nhờ ${c('prev')}. Xoá khỏi danh sách rỗng ném ${c('IllegalStateException("empty list")')}.</p>
<p>Máy chấm kiểm mọi liên kết theo hai chiều: ${c('head.prev == null')}, ${c('p.next.prev == p')} với mọi nút, ${c('tail')} là nút cuối và ${c('tail.next == null')}; rồi in danh sách xuôi từ ${c('head')} và ngược từ ${c('tail')} theo ${c('prev')}.</p>`,
  },
  yeuCau: { en: ['No loops (rule R1) — every operation is O(1).', 'Clear the links of the neighbour that stays (its prev or next becomes null at an end).'], vi: ['Không vòng lặp (luật R1) — mọi thao tác O(1).', 'Dọn liên kết của nút hàng xóm còn lại (prev hoặc next của nó thành null ở đầu mút).'] },
  dauVao: { en: 'AF x · AL x · RF · RL.', vi: 'AF x · AL x · RF · RL.' },
  dauRa: { en: 'Result, the link check, forwards and backwards.', vi: 'Kết quả, kiểm liên kết, xuôi và ngược.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no loop in DList (all O(1))', vi: 'không vòng lặp trong DList (mọi thứ O(1))', re: String.raw`\b(for|while)\s*\(`, file: 'DList' }],
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        DList t = new DList();',
      lenh: `                if (p[0].equals("AF")) {
                    t.addFirst(n(1));
                } else if (p[0].equals("AL")) {
                    t.addLast(n(1));
                } else if (p[0].equals("RF")) {
                    r = String.valueOf(t.removeFirst());
                } else {
                    r = String.valueOf(t.removeLast());
                }`,
      trangThai: 'Kiem.kep(t, "head", "tail", "next", "prev", "info") + " | fwd " + Kiem.xuoi(t, "head", "next", "info") + " | back " + Kiem.nguoc(t, "tail", "prev", "info")',
    }),
  },
  tep: {
    'DNode.java': j`
// GIVEN — do not change.
class DNode {
    int info;
    DNode prev, next;

    DNode(int x) {
        info = x;
    }
}
`,
    'DList.java': j`
public class DList {
    private DNode head, tail;

    public void addFirst(int x) {
        //>> // TODO
        DNode q = new DNode(x);
        if (head == null) {
            head = tail = q;
        } else {
            q.next = head;
            head.prev = q;
            head = q;
        }
        //<<
    }

    public void addLast(int x) {
        //>> // TODO
        DNode q = new DNode(x);
        if (tail == null) {
            head = tail = q;
        } else {
            q.prev = tail;
            tail.next = q;
            tail = q;
        }
        //<<
    }

    public int removeFirst() {
        //>> return 0; // TODO
        if (head == null) {
            throw new IllegalStateException("empty list");
        }
        int x = head.info;
        head = head.next;
        if (head == null) {
            tail = null;
        } else {
            head.prev = null;
        }
        return x;
        //<<
    }

    public int removeLast() {
        //>> return 0; // TODO: O(1) thanks to prev
        if (tail == null) {
            throw new IllegalStateException("empty list");
        }
        int x = tail.info;
        tail = tail.prev;
        if (tail == null) {
            head = null;
        } else {
            tail.next = null;
        }
        return x;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'both ends', vi: 'cả hai đầu' }, vao: 'AL 2\nAF 1\nAL 3\nAF 0\nRL\nRF\nRL\nRL\n' },
    { ten: { en: 'empty list errors, one node', vi: 'lỗi danh sách rỗng, một nút' }, vao: 'RL\nRF\nAF 5\nRL\nAL 6\nRF\nAL 7\nAL 8\nRF\nRL\nRL\n' },
    { ten: { en: 'long mixed sequence', vi: 'chuỗi lệnh dài lẫn lộn' }, vao: 'AL 1\nAL 2\nAL 3\nAL 4\nAF 0\nRL\nRL\nAF -1\nRF\nRF\nAL 9\nRL\nRL\nRL\nAF 5\n', an: true },
  ],
  goiY: [
    { en: 'Every new link comes in pairs: q.next = head together with head.prev = q.', vi: 'Mỗi liên kết mới đi thành cặp: q.next = head đi cùng head.prev = q.' },
    { en: 'After removing an end node, the new end’s pointer to the removed node must become null (head.prev = null or tail.next = null).', vi: 'Sau khi xoá nút ở đầu mút, con trỏ của nút đầu mút mới tới nút đã xoá phải thành null (head.prev = null hoặc tail.next = null).' },
  ],
  loiHayGap: [
    { en: 'Setting only next when adding — forwards prints fine, backwards stops early and the link check reports the missing prev.', vi: 'Chỉ gán next khi thêm — in xuôi vẫn đúng, in ngược dừng sớm và bộ kiểm báo thiếu prev.' },
    { en: 'removeFirst leaving head.prev pointing at the removed node — "head.prev should be null".', vi: 'removeFirst để head.prev vẫn trỏ nút đã xoá — "head.prev should be null".' },
  ],
  giaiThich: { en: '<p>The prev pointer gives the node before the tail directly, so removeLast becomes O(1). The price is that every change must update two links; a check that walks both directions catches the half-updated cases that a forward-only print hides.</p>', vi: '<p>Con trỏ prev cho ngay nút đứng trước tail, nên removeLast thành O(1). Cái giá là mọi thay đổi phải cập nhật hai liên kết; phép kiểm đi cả hai chiều bắt được những chỗ cập nhật nửa vời mà in xuôi che mất.</p>' },
});

export default moDun({ slug: 'csd201-linked-list', ten: '1.2 Singly, circular & doubly linked lists', de: [de1, de2, de3, de4] });
