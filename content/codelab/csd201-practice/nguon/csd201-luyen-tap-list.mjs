/** CSD201 · 1.5 — Ba bài kinh điển trên danh sách liên kết: đảo tại chỗ, Floyd tìm chu trình, trộn hai danh sách bằng nối lại (kiểm đúng đối tượng nút). */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const NODE = j`
// GIVEN — do not change.
class Node {
    int info;
    Node next;

    Node(int x) {
        info = x;
    }
}
`;
const KHONG_NEW = (file) => ({ id: 'R1', en: `no new Node in ${file} — relink the nodes you were given`, vi: `không new Node trong ${file} — nối lại chính các nút được giao`, re: String.raw`\bnew\s+Node\b`, file });
// lớp kiểm dùng chung: dựng danh sách từ các số, nhớ đúng các đối tượng nút để so sau
const THEM = `
    static List<Object> made = new ArrayList<>();

    static Node build(int from, int to) {
        Node head = null, tail = null;
        made = new ArrayList<>();
        for (int i = from; i < to; i++) {
            Node q = new Node(Integer.parseInt(p[i]));
            made.add(q);
            if (head == null) {
                head = q;
            } else {
                tail.next = q;
            }
            tail = q;
        }
        return head;
    }

    static Node chain(int n, int step) {
        Node head = null, tail = null;
        for (int i = 0; i < n; i++) {
            Node q = new Node(i * step);
            if (head == null) {
                head = q;
            } else {
                tail.next = q;
            }
            tail = q;
        }
        return head;
    }

    // are the nodes reachable from h exactly the objects in "want", in that order?
    static String same(Node h, List<Object> want) {
        int i = 0;
        for (Node q = h; q != null && i <= want.size(); q = q.next, i++) {
            if (i == want.size() || want.get(i) != q) {
                return "NOT the original node objects";
            }
        }
        return i == want.size() ? "same node objects" : "nodes missing";
    }
`;

const de1 = deJava({
  id: 'csd201-1-5-reverse-in-place',
  tieuDe: { en: 'Reverse a singly linked list in place — the same nodes, no recursion', vi: 'Đảo ngược danh sách liên kết đơn tại chỗ — đúng các nút cũ, không đệ quy' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['three pointers prev / cur / next', 'in-place relinking', 'O(n) time, O(1) space', 'stack depth of recursion'],
  moTa: {
    en: `<p>Complete ${c('static Node reverse(Node head)')}: turn every ${c('next')} pointer around and return the new head. Use the <b>existing</b> nodes (rule R1: no ${c('new Node')}) and a loop — the grader also reverses a list of 1,000,000 nodes, which a recursive version cannot do on a default Java stack.</p>
<p>The grader checks that the nodes after the call are exactly the original objects, in reverse order.</p>`,
    vi: `<p>Hoàn thiện ${c('static Node reverse(Node head)')}: quay ngược mọi con trỏ ${c('next')} và trả về head mới. Dùng <b>chính các nút có sẵn</b> (luật R1: không ${c('new Node')}) và vòng lặp — máy chấm còn đảo một danh sách 1.000.000 nút, điều bản đệ quy không làm được với ngăn xếp mặc định của Java.</p>
<p>Máy chấm kiểm các nút sau lời gọi đúng là các đối tượng ban đầu, theo thứ tự ngược.</p>`,
  },
  yeuCau: { en: ['Iterative, O(1) extra memory.', 'Works for the empty list (null) and one node.'], vi: ['Vòng lặp, O(1) bộ nhớ thêm.', 'Chạy đúng với danh sách rỗng (null) và một nút.'] },
  dauVao: { en: 'Lines "R v1 v2 …"; PERF.', vi: 'Các dòng "R v1 v2 …"; PERF.' },
  dauRa: { en: 'The reversed list and whether the nodes are the original objects.', vi: 'Danh sách đã đảo và các nút có đúng là đối tượng ban đầu không.' },
  main: 'KiemTra',
  quyTac: [KHONG_NEW('ListAlgo')],
  hen: { n: '1,000,000 nodes', ms: 3000, can: 'O(n) with a loop', cham: 'recursive (one stack frame per node)', en: 'A recursive reverse needs a million nested calls and throws StackOverflowError.', vi: 'Bản đệ quy cần một triệu lời gọi lồng nhau và ném StackOverflowError.' },
  harness: {
    'KiemTra.java': lopKiem({
      them: THEM,
      lenh: `                if (p[0].equals("PERF")) {
                    final Node[] h = {chain(1000000, 1)};
                    r = Kiem.hen("reverse 1,000,000 nodes", 3000, new Runnable() {
                        public void run() {
                            h[0] = ListAlgo.reverse(h[0]);
                        }
                    }) + ", head " + (h[0] == null ? "null" : String.valueOf(h[0].info)) + ", nodes " + Kiem.dem(h[0], "next");
                } else {
                    Node h = build(1, p.length);
                    Collections.reverse(made);
                    Node res = ListAlgo.reverse(h);
                    r = Kiem.chuoi(res, "next", "info", 1000) + " (" + same(res, made) + ")";
                }`,
    }),
  },
  tep: {
    'Node.java': NODE,
    'ListAlgo.java': j`
public class ListAlgo {

    static Node reverse(Node head) {
        //>> return head; // TODO: prev / cur / next
        Node prev = null;
        Node cur = head;
        while (cur != null) {
            Node next = cur.next; // remember the rest before cutting the link
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        return prev;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'odd and even lengths', vi: 'độ dài lẻ và chẵn' }, vao: 'R 1 2 3 4 5\nR 10 20\nR 7\nR\n' },
    { ten: { en: 'repeated values', vi: 'giá trị lặp' }, vao: 'R 3 3 1 3\nR -1 0 -1\n', an: true },
    { ten: { en: 'complexity check (a million nodes)', vi: 'kiểm độ phức tạp (một triệu nút)' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Keep prev (the part already reversed, starts null) and cur. Each turn: save cur.next, point cur.next at prev, move both one step.', vi: 'Giữ prev (phần đã đảo, ban đầu null) và cur. Mỗi vòng: lưu cur.next, cho cur.next trỏ prev, dời cả hai một bước.' },
    { en: 'When cur becomes null, prev is the new head.', vi: 'Khi cur thành null thì prev là head mới.' },
  ],
  loiHayGap: [
    { en: 'Setting cur.next = prev before saving cur.next — the rest of the list is lost after the first node.', vi: 'Gán cur.next = prev trước khi lưu cur.next — phần còn lại của danh sách mất sau nút đầu tiên.' },
    { en: 'Building a reversed copy with new Node — looks right on screen, but the caller’s nodes are untouched (rule R1 and the identity check fail).', vi: 'Dựng bản sao đảo ngược bằng new Node — nhìn thì đúng, nhưng các nút của người gọi không đổi (luật R1 và phép kiểm đối tượng trượt).' },
  ],
  giaiThich: { en: '<p>Each node is visited once and gets one new next pointer: O(n) time, three extra references. A recursive reverse is elegant but uses one stack frame per node — fine for 10 nodes, StackOverflowError for a million.</p>', vi: '<p>Mỗi nút được ghé một lần và nhận một con trỏ next mới: O(n) thời gian, ba tham chiếu thêm. Bản đệ quy gọn nhưng dùng một khung ngăn xếp cho mỗi nút — ổn với 10 nút, StackOverflowError với một triệu.</p>' },
});

const de2 = deJava({
  id: 'csd201-1-5-floyd-cycle',
  tieuDe: { en: 'Floyd’s tortoise and hare: find where the cycle starts, in O(1) memory', vi: 'Rùa và thỏ của Floyd: tìm điểm bắt đầu chu trình với O(1) bộ nhớ' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['slow and fast pointers', 'cycle detection', 'finding the entry node', 'O(1) extra space'],
  moTa: {
    en: `<p>A list may end in a loop: the last node points back to some earlier node. Complete ${c('static Node cycleStart(Node head)')}: return the first node of the cycle (the node the loop comes back to), or ${c('null')} if the list ends with ${c('null')}.</p>
<p>Use Floyd’s algorithm with two pointers — no ${c('HashSet')}, no array, no marking of nodes (rule R1). Phase 1: slow moves 1, fast moves 2 until they meet (or fast reaches null). Phase 2: put one pointer back at head and move both by 1 — they meet at the entry.</p>`,
    vi: `<p>Một danh sách có thể kết thúc bằng một vòng: nút cuối trỏ ngược về một nút trước đó. Hoàn thiện ${c('static Node cycleStart(Node head)')}: trả về nút đầu tiên của chu trình (nút mà vòng quay về), hoặc ${c('null')} nếu danh sách kết thúc bằng ${c('null')}.</p>
<p>Dùng thuật toán Floyd với hai con trỏ — không ${c('HashSet')}, không mảng, không đánh dấu nút (luật R1). Pha 1: slow đi 1, fast đi 2 tới khi gặp nhau (hoặc fast chạm null). Pha 2: đưa một con trỏ về head rồi cho cả hai đi 1 — chúng gặp nhau ở điểm vào vòng.</p>`,
  },
  yeuCau: { en: ['O(n) time, O(1) extra memory.', 'Do not change any next pointer.'], vi: ['O(n) thời gian, O(1) bộ nhớ thêm.', 'Không sửa con trỏ next nào.'] },
  dauVao: { en: 'Lines "n c": a list of nodes 0..n-1 whose last node points to node c (c = -1: no cycle); PERF.', vi: 'Các dòng "n c": danh sách nút 0..n-1 có nút cuối trỏ về nút c (c = -1: không có vòng); PERF.' },
  dauRa: { en: 'The value of the entry node, or null.', vi: 'Giá trị nút vào vòng, hoặc null.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'O(1) memory: no Set, Map, List or array in Floyd', vi: 'O(1) bộ nhớ: không Set, Map, List hay mảng trong Floyd', re: String.raw`\b(Set|Map|List|HashSet|HashMap|IdentityHashMap|ArrayList)\b|\[\s*\]|\bnew\s+\w+\s*\[`, file: 'Floyd' }],
  hen: { n: '3,000,000 nodes with a cycle of 1,000,000', ms: 3000, can: 'O(n)', cham: 'O(n²) (checking every earlier node)' },
  harness: {
    'KiemTra.java': lopKiem({
      them: `
    static Node make(int n, int c) {
        Node head = null, tail = null, entry = null;
        for (int i = 0; i < n; i++) {
            Node q = new Node(i);
            if (i == c) {
                entry = q;
            }
            if (head == null) {
                head = q;
            } else {
                tail.next = q;
            }
            tail = q;
        }
        if (tail != null) {
            tail.next = entry;
        }
        return head;
    }
`,
      lenh: `                if (p[0].equals("PERF")) {
                    final Node h = make(3000000, 2000000);
                    final Node[] res = new Node[1];
                    r = Kiem.hen("3,000,000 nodes, entry at node 2,000,000", 3000, new Runnable() {
                        public void run() {
                            res[0] = Floyd.cycleStart(h);
                        }
                    }) + ", entry " + (res[0] == null ? "null" : String.valueOf(res[0].info));
                } else {
                    Node h = make(n(0), n(1));
                    Node e = Floyd.cycleStart(h);
                    r = e == null ? "null" : "node " + e.info;
                }`,
    }),
  },
  tep: {
    'Node.java': NODE,
    'Floyd.java': j`
public class Floyd {

    // the first node of the cycle, or null when the list ends
    static Node cycleStart(Node head) {
        //>> return null; // TODO: phase 1 meet, phase 2 find the entry
        Node slow = head;
        Node fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                Node a = head; // phase 2: head and the meeting point are equally far from the entry
                while (a != slow) {
                    a = a.next;
                    slow = slow.next;
                }
                return a;
            }
        }
        return null;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'no cycle, cycle back to the head, to the middle, to the last node', vi: 'không vòng, vòng về head, về giữa, về nút cuối' }, vao: '5 -1\n5 0\n6 2\n6 5\n' },
    { ten: { en: 'empty list, one node, two nodes', vi: 'danh sách rỗng, một nút, hai nút' }, vao: '0 -1\n1 -1\n1 0\n2 1\n2 0\n', an: true },
    { ten: { en: 'long tails and short loops', vi: 'đuôi dài và vòng ngắn' }, vao: '1000 999\n1000 1\n997 500\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Phase 1: while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; if (slow == fast) … } — reaching null means no cycle.', vi: 'Pha 1: while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; if (slow == fast) … } — chạm null nghĩa là không có vòng.' },
    { en: 'Phase 2: if the tail before the loop has length a, the meeting point is exactly a steps (mod the loop length) before the entry. Start one pointer at head, keep the other at the meeting point, step both by one.', vi: 'Pha 2: nếu đoạn trước vòng dài a thì điểm gặp cách điểm vào đúng a bước (theo modulo độ dài vòng). Cho một con trỏ từ head, giữ con trỏ kia ở điểm gặp, cùng bước một.' },
  ],
  loiHayGap: [
    { en: 'Testing slow == fast before moving them — they are equal at the start, so every list "has a cycle".', vi: 'Kiểm slow == fast trước khi dời — lúc đầu chúng bằng nhau, nên danh sách nào cũng "có vòng".' },
    { en: 'Checking only fast != null — fast.next.next throws NullPointerException on an even-length list without a cycle.', vi: 'Chỉ kiểm fast != null — fast.next.next ném NullPointerException với danh sách độ dài chẵn không có vòng.' },
  ],
  giaiThich: { en: '<p>Inside the loop the fast pointer gains one node per step on the slow one, so they meet within one lap: phase 1 is O(n). If a is the length before the loop and the meeting point is b steps into the loop of length L, then 2(a + b) = a + b + kL, so a = kL − b: walking a steps from the head and from the meeting point lands both on the entry. Two references, no extra memory.</p>', vi: '<p>Trong vòng, con trỏ nhanh đuổi kịp con trỏ chậm một nút mỗi bước, nên chúng gặp nhau trong một vòng: pha 1 là O(n). Nếu a là độ dài trước vòng và điểm gặp ở b bước vào vòng dài L, thì 2(a + b) = a + b + kL, nên a = kL − b: đi a bước từ head và từ điểm gặp đều tới điểm vào. Hai tham chiếu, không tốn bộ nhớ thêm.</p>' },
});

const de3 = deJava({
  id: 'csd201-1-5-merge-relink',
  tieuDe: { en: 'Merge two sorted linked lists by relinking — not one new node', vi: 'Trộn hai danh sách liên kết đã sắp bằng cách nối lại — không tạo nút mới nào' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['merge', 'dummy head node', 'relinking instead of copying', 'stability'],
  moTa: {
    en: `<p>Complete ${c('static Node merge(Node a, Node b)')}: ${c('a')} and ${c('b')} are sorted ascending; return the head of one sorted list made of <b>all their nodes</b>, equal values from ${c('a')} first. Create no node at all (rule R1: no ${c('new Node')}, not even a dummy head — choose the head first). The grader checks the result contains exactly the original node objects.</p>`,
    vi: `<p>Hoàn thiện ${c('static Node merge(Node a, Node b)')}: ${c('a')} và ${c('b')} đã sắp tăng; trả về head của một danh sách đã sắp gồm <b>mọi nút của cả hai</b>, giá trị bằng nhau thì nút của ${c('a')} trước. Không ${c('new Node')} (luật R1 cấm hẳn — có thể tránh nút "giả" bằng cách chọn head trước). Máy chấm kiểm kết quả gồm đúng các đối tượng nút ban đầu.</p>`,
  },
  yeuCau: { en: ['O(n + m) time, O(1) extra memory, a loop (no recursion: lists of 1,000,000).', 'Equal values: the node of a comes first.'], vi: ['O(n + m) thời gian, O(1) bộ nhớ thêm, vòng lặp (không đệ quy: danh sách 1.000.000 nút).', 'Giá trị bằng nhau: nút của a đứng trước.'] },
  dauVao: { en: 'Lines "M a1 a2 … | b1 b2 …"; PERF.', vi: 'Các dòng "M a1 a2 … | b1 b2 …"; PERF.' },
  dauRa: { en: 'The merged list and whether it is made of the original nodes in the stable order.', vi: 'Danh sách đã trộn và nó có gồm đúng các nút ban đầu theo thứ tự ổn định không.' },
  main: 'KiemTra',
  quyTac: [KHONG_NEW('MergeLists')],
  hen: { n: '2 × 1,000,000 nodes', ms: 3000, can: 'O(n + m) with a loop', cham: 'recursive (one frame per node)', en: 'A recursive merge overflows the stack long before two million nodes.', vi: 'Bản trộn đệ quy tràn ngăn xếp từ lâu trước hai triệu nút.' },
  harness: {
    'KiemTra.java': lopKiem({
      them: THEM + `
    // the expected stable order of the original objects (a first on ties)
    static List<Object> stable(List<Object> a, List<Object> b) {
        List<Object> out = new ArrayList<>();
        int i = 0, k = 0;
        while (i < a.size() || k < b.size()) {
            if (k == b.size() || (i < a.size() && ((Node) a.get(i)).info <= ((Node) b.get(k)).info)) {
                out.add(a.get(i++));
            } else {
                out.add(b.get(k++));
            }
        }
        return out;
    }
`,
      lenh: `                if (p[0].equals("PERF")) {
                    final Node[] h = {chain(1000000, 2), chain(1000000, 3)};
                    r = Kiem.hen("merge 2 x 1,000,000 nodes", 3000, new Runnable() {
                        public void run() {
                            h[0] = MergeLists.merge(h[0], h[1]);
                        }
                    }) + ", nodes " + Kiem.dem(h[0], "next");
                } else {
                    int bar = Arrays.asList(p).indexOf("|");
                    Node a = build(1, bar);
                    List<Object> ma = made;
                    Node b = build(bar + 1, p.length);
                    List<Object> mb = made;
                    Node m = MergeLists.merge(a, b);
                    r = Kiem.chuoi(m, "next", "info", 1000) + " (" + same(m, stable(ma, mb)) + ")";
                }`,
    }),
  },
  tep: {
    'Node.java': NODE,
    'MergeLists.java': j`
public class MergeLists {

    static Node merge(Node a, Node b) {
        //>> return a; // TODO: relink, a first on ties
        if (a == null) {
            return b;
        }
        if (b == null) {
            return a;
        }
        Node head;
        if (a.info <= b.info) {
            head = a;
            a = a.next;
        } else {
            head = b;
            b = b.next;
        }
        Node tail = head;
        while (a != null && b != null) {
            if (a.info <= b.info) {
                tail.next = a;
                a = a.next;
            } else {
                tail.next = b;
                b = b.next;
            }
            tail = tail.next;
        }
        tail.next = (a != null) ? a : b; // the rest is already sorted: attach it as it is
        return head;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'interleaving, one list empty', vi: 'đan xen, một danh sách rỗng' }, vao: 'M 1 4 9 | 2 3 10 11\nM | 5 6\nM 7 8 |\nM |\n' },
    { ten: { en: 'equal values take a first; all of b before a', vi: 'giá trị bằng nhau lấy a trước; toàn bộ b đứng trước a' }, vao: 'M 1 1 2 | 1 2 2\nM 5 6 | 1 2\nM 0 | 0\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Pick the head first (the smaller of a and b), then keep a tail pointer and attach the smaller front node each turn.', vi: 'Chọn head trước (nút nhỏ hơn giữa a và b), rồi giữ con trỏ tail và mỗi vòng gắn nút đầu nhỏ hơn vào.' },
    { en: 'When one list runs out, the other one is already sorted: tail.next = the rest, no loop needed.', vi: 'Khi một danh sách hết, danh sách kia đã sắp sẵn: tail.next = phần còn lại, không cần lặp.' },
  ],
  loiHayGap: [
    { en: 'Using < instead of <= — equal values take the node of b first and the stability check fails.', vi: 'Dùng < thay cho <= — giá trị bằng nhau lấy nút của b trước và phép kiểm ổn định trượt.' },
    { en: 'Forgetting the final tail.next = rest — the remaining nodes are lost.', vi: 'Quên tail.next = phần còn lại ở cuối — các nút còn lại bị mất.' },
  ],
  giaiThich: { en: '<p>Each turn moves one node from the front of a or b to the end of the result by changing one next pointer: n + m turns, O(1) extra memory. This is the merge step of merge sort on linked lists — the reason merge sort is the natural sort for linked structures.</p>', vi: '<p>Mỗi vòng chuyển một nút từ đầu a hoặc b sang cuối kết quả bằng cách đổi một con trỏ next: n + m vòng, O(1) bộ nhớ thêm. Đây là bước trộn của merge sort trên danh sách liên kết — lý do merge sort là cách sắp tự nhiên cho cấu trúc liên kết.</p>' },
});

export default moDun({ slug: 'csd201-luyen-tap-list', ten: '1.5 Three classic list problems: reverse, cycle, merge', de: [de1, de2, de3] });
