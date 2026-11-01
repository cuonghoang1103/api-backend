/** CSD201 · 1.3 — Danh sách kép có lính canh (header/trailer, Goodrich): addBetween/remove, chèn có thứ tự, lịch sử trình duyệt. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const KHONG_NULL = (file) => ({ id: 'R1', en: `no null test in ${file} — the sentinels remove every special case`, vi: `không kiểm null trong ${file} — lính canh xoá mọi trường hợp đặc biệt`, re: String.raw`[=!]=\s*null\b|\bnull\s*[=!]=`, file });

const NODE = j`
// GIVEN — do not change. A node of a doubly linked list; the two sentinels hold element == null.
class Node {
    String element;
    Node prev, next;

    Node(String e, Node p, Node n) {
        element = e;
        prev = p;
        next = n;
    }
}
`;
// trạng thái: đi xuôi từ header (lính canh in ra là null) và ngược từ trailer, kèm size
const TRANG_THAI = '"fwd " + Kiem.chuoi(Kiem.lay(t, "header"), "next", "element", 1000) + " | back " + Kiem.chuoi(Kiem.lay(t, "trailer"), "prev", "element", 1000) + " | size " + Kiem.lay(t, "size")';

const de1 = deJava({
  id: 'csd201-1-3-sentinel-basics',
  tieuDe: { en: 'Header and trailer sentinels: every operation through addBetween and remove', vi: 'Lính canh header và trailer: mọi thao tác qua addBetween và remove' },
  doKho: 'EASY', phut: 25,
  khaiNiem: ['sentinel (dummy) nodes', 'addBetween(e, pred, succ)', 'remove(node)', 'no special cases'],
  moTa: {
    en: `<p>The textbook ${c('DoublyLinkedList')}: two sentinel nodes ${c('header')} and ${c('trailer')} that never hold data; the real elements sit between them. The constructor (given) links ${c('header.next = trailer')}, ${c('trailer.prev = header')}. Write:</p>
<ul><li>${c('private void addBetween(String e, Node pred, Node succ)')} and ${c('private String remove(Node node)')} — the only two methods that touch links;</li>
<li>${c('first()')}, ${c('last()')}, ${c('addFirst')}, ${c('addLast')}, ${c('removeFirst')}, ${c('removeLast')} — each one line calling them; on an empty list ${c('first/last/remove…')} return ${c('null')}.</li></ul>
<p>Rule R1 forbids any ${c('== null')} / ${c('!= null')} test: with sentinels every real node has real neighbours (use ${c('size')} for "empty"). The grader prints the chain from ${c('header')} (sentinels shown as ${c('null')}) and back from ${c('trailer')}.</p>`,
    vi: `<p>${c('DoublyLinkedList')} của giáo trình: hai nút lính canh ${c('header')} và ${c('trailer')} không bao giờ chứa dữ liệu; phần tử thật nằm giữa chúng. Constructor (cho sẵn) nối ${c('header.next = trailer')}, ${c('trailer.prev = header')}. Viết ${c('addBetween(e, pred, succ)')} và ${c('remove(node)')} — hai hàm duy nhất chạm vào liên kết; rồi ${c('first()')}, ${c('last()')}, ${c('addFirst')}, ${c('addLast')}, ${c('removeFirst')}, ${c('removeLast')} — mỗi hàm một dòng gọi chúng; danh sách rỗng thì ${c('first/last/remove…')} trả ${c('null')}.</p>
<p>Luật R1 cấm mọi phép thử ${c('== null')} / ${c('!= null')}: có lính canh thì nút thật nào cũng có hàng xóm thật (dùng ${c('size')} để biết rỗng). Máy chấm in chuỗi từ ${c('header')} (lính canh hiện là ${c('null')}) và ngược từ ${c('trailer')}.</p>`,
  },
  yeuCau: { en: ['Only addBetween and remove change links.', 'size is kept by addBetween/remove.'], vi: ['Chỉ addBetween và remove đổi liên kết.', 'size do addBetween/remove giữ.'] },
  dauVao: { en: 'AF e · AL e · RF · RL · FIRST · LAST.', vi: 'AF e · AL e · RF · RL · FIRST · LAST.' },
  dauRa: { en: 'Result, the chain both ways and size.', vi: 'Kết quả, chuỗi hai chiều và size.' },
  main: 'KiemTra',
  quyTac: [KHONG_NULL('DoublyLinkedList')],
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        DoublyLinkedList t = new DoublyLinkedList();',
      lenh: `                if (p[0].equals("AF")) {
                    t.addFirst(p[1]);
                } else if (p[0].equals("AL")) {
                    t.addLast(p[1]);
                } else if (p[0].equals("RF")) {
                    r = String.valueOf(t.removeFirst());
                } else if (p[0].equals("RL")) {
                    r = String.valueOf(t.removeLast());
                } else if (p[0].equals("FIRST")) {
                    r = String.valueOf(t.first());
                } else {
                    r = String.valueOf(t.last());
                }`,
      trangThai: TRANG_THAI,
    }),
  },
  tep: {
    'Node.java': NODE,
    'DoublyLinkedList.java': j`
public class DoublyLinkedList {
    private final Node header;
    private final Node trailer;
    private int size = 0;

    public DoublyLinkedList() {
        header = new Node(null, null, null);
        trailer = new Node(null, header, null);
        header.next = trailer;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    private void addBetween(String e, Node pred, Node succ) {
        //>> // TODO: new node between pred and succ (4 links), size++
        Node q = new Node(e, pred, succ);
        pred.next = q;
        succ.prev = q;
        size++;
        //<<
    }

    private String remove(Node node) {
        //>> return null; // TODO: link its two neighbours together, size--
        Node pred = node.prev;
        Node succ = node.next;
        pred.next = succ;
        succ.prev = pred;
        size--;
        return node.element;
        //<<
    }

    public String first() {
        //>> return null; // TODO
        return isEmpty() ? null : header.next.element;
        //<<
    }

    public String last() {
        //>> return null; // TODO
        return isEmpty() ? null : trailer.prev.element;
        //<<
    }

    public void addFirst(String e) {
        //>> // TODO
        addBetween(e, header, header.next);
        //<<
    }

    public void addLast(String e) {
        //>> // TODO
        addBetween(e, trailer.prev, trailer);
        //<<
    }

    public String removeFirst() {
        //>> return null; // TODO
        return isEmpty() ? null : remove(header.next);
        //<<
    }

    public String removeLast() {
        //>> return null; // TODO
        return isEmpty() ? null : remove(trailer.prev);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'both ends, first and last', vi: 'cả hai đầu, first và last' }, vao: 'FIRST\nAL B\nAF A\nAL C\nFIRST\nLAST\nRF\nRL\nRL\nRL\nLAST\n' },
    { ten: { en: 'emptied and refilled', vi: 'làm rỗng rồi thêm lại' }, vao: 'AF x\nRL\nAF y\nAL z\nRF\nRF\nRF\nAL w\nFIRST\nLAST\n', an: true },
  ],
  goiY: [
    { en: 'addBetween: create the node with prev = pred and next = succ, then make pred.next and succ.prev point to it.', vi: 'addBetween: tạo nút có prev = pred, next = succ, rồi cho pred.next và succ.prev trỏ tới nó.' },
    { en: 'addFirst is addBetween(e, header, header.next); removeLast is remove(trailer.prev). An empty list is header ⇄ trailer, and the same code still works.', vi: 'addFirst là addBetween(e, header, header.next); removeLast là remove(trailer.prev). Danh sách rỗng là header ⇄ trailer, cùng đoạn code vẫn chạy đúng.' },
  ],
  loiHayGap: [
    { en: 'Returning header.element for first() on an empty list — it is null by luck, but removeFirst would then remove the trailer itself.', vi: 'Trả header.element cho first() khi rỗng — tình cờ ra null, nhưng removeFirst sau đó sẽ xoá luôn trailer.' },
    { en: 'Linking only pred.next in addBetween — forwards looks right, the backwards walk skips the new node.', vi: 'Chỉ nối pred.next trong addBetween — xuôi trông đúng, đi ngược bỏ qua nút mới.' },
  ],
  giaiThich: { en: '<p>Because the header and trailer are always there, every real node has a predecessor and a successor: insertion and removal are the same four or two assignments at the front, in the middle and at the end. That is how java.util.LinkedList’s textbook cousin removes all the "if empty / if first / if last" branches.</p>', vi: '<p>Vì header và trailer luôn có mặt nên nút thật nào cũng có nút trước và nút sau: chèn và xoá là cùng bốn hoặc hai phép gán dù ở đầu, giữa hay cuối. Đó là cách bản giáo trình xoá hết các nhánh "nếu rỗng / nếu đầu / nếu cuối".</p>' },
});

const de2 = deJava({
  id: 'csd201-1-3-sentinel-sorted',
  tieuDe: { en: 'A sorted doubly linked list with sentinels: insertSorted and removeAll', vi: 'Danh sách kép có lính canh luôn sắp thứ tự: insertSorted và removeAll' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['ordered insertion', 'stable order of equal keys', 'removing while walking', 'sentinels'],
  moTa: {
    en: `<p>Same ${c('Node')}/sentinel layout, elements are names kept in <b>alphabetical order</b> (${c('compareTo')}). Write:</p>
<ul><li>${c('void insertSorted(String e)')} — insert so the list stays sorted; an element equal to existing ones goes <b>after</b> them;</li>
<li>${c('int removeAll(String e)')} — remove every node equal to ${c('e')} in one walk, return how many;</li>
<li>${c('String toString()')} — ${c('"[An, Binh, Chi]"')}.</li></ul>
<p>No null tests (R1). To prove "equal ones after", every inserted node is a NEW object and the grader checks the order of the objects, not only of the texts.</p>`,
    vi: `<p>Cùng cấu trúc ${c('Node')}/lính canh, phần tử là tên giữ theo <b>thứ tự từ điển</b> (${c('compareTo')}). Viết ${c('insertSorted(e)')} — chèn để danh sách vẫn sắp, phần tử bằng phần tử đã có thì đứng <b>sau</b> chúng; ${c('removeAll(e)')} — xoá mọi nút bằng ${c('e')} trong một lượt đi, trả số nút đã xoá; ${c('toString()')} — ${c('"[An, Binh, Chi]"')}.</p>
<p>Không kiểm null (R1). Để chứng minh "bằng thì đứng sau", máy chấm đánh dấu thứ tự chèn của từng đối tượng và kiểm thứ tự đối tượng, không chỉ chữ.</p>`,
  },
  yeuCau: { en: ['One walk per operation; no array, no java.util sorting.', 'Use compareTo for order and equals for removeAll.'], vi: ['Mỗi thao tác một lượt đi; không mảng, không sắp bằng java.util.', 'Dùng compareTo cho thứ tự và equals cho removeAll.'] },
  dauVao: { en: 'INS name · DEL name.', vi: 'INS tên · DEL tên.' },
  dauRa: { en: 'Result, toString, and the insertion number of each node in list order.', vi: 'Kết quả, toString, và số thứ tự chèn của từng nút theo thứ tự danh sách.' },
  main: 'KiemTra',
  quyTac: [KHONG_NULL('SortedList'), { id: 'R2', en: 'no java.util collections or sorting in SortedList', vi: 'không collection/sắp xếp của java.util trong SortedList', re: String.raw`\b(Collections|Arrays|ArrayList|LinkedList|TreeSet|TreeMap)\b`, file: 'SortedList' }],
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        SortedList t = new SortedList();',
      lenh: `                if (p[0].equals("INS")) {
                    t.insertSorted(new String(p[1])); // a NEW String object every time
                    r = "ok";
                } else {
                    r = String.valueOf(t.removeAll(p[1]));
                }`,
      trangThai: 't + " | objects " + order(t) + " | back " + Kiem.chuoi(Kiem.lay(t, "trailer"), "prev", "element", 1000)',
      them: `
    // the insertion number of every node object (identity), in list order
    static final java.util.IdentityHashMap<Object, Integer> ID = new java.util.IdentityHashMap<>();
    static int seq = 0;

    static String order(SortedList t) {
        StringBuilder sb = new StringBuilder();
        Object trailer = Kiem.lay(t, "trailer");
        for (Object q = Kiem.lay(Kiem.lay(t, "header"), "next"); q != null && q != trailer; q = Kiem.lay(q, "next")) {
            Integer id = ID.get(q);
            if (id == null) {
                id = ++seq;
                ID.put(q, id);
            }
            sb.append(Kiem.lay(q, "element")).append('#').append(id).append(' ');
        }
        return sb.toString().trim();
    }
`,
    }),
  },
  tep: {
    'Node.java': NODE,
    'SortedList.java': j`
public class SortedList {
    private final Node header = new Node(null, null, null);
    private final Node trailer = new Node(null, header, null);

    public SortedList() {
        header.next = trailer;
    }

    // keeps alphabetical order; equal elements go after the existing ones
    public void insertSorted(String e) {
        //>> // TODO: find the first node whose element is GREATER than e, insert before it
        Node p = header.next;
        while (p != trailer && p.element.compareTo(e) <= 0) {
            p = p.next;
        }
        Node q = new Node(e, p.prev, p);
        p.prev.next = q;
        p.prev = q;
        //<<
    }

    // removes every node equal to e; returns how many were removed
    public int removeAll(String e) {
        //>> return 0; // TODO: one walk
        int count = 0;
        for (Node p = header.next; p != trailer; p = p.next) {
            if (p.element.equals(e)) {
                p.prev.next = p.next; // p.next still leads on, so the walk continues
                p.next.prev = p.prev;
                count++;
            }
        }
        return count;
        //<<
    }

    @Override
    public String toString() {
        //>> return "[]"; // TODO
        StringBuilder sb = new StringBuilder("[");
        for (Node p = header.next; p != trailer; p = p.next) {
            sb.append(p == header.next ? "" : ", ").append(p.element);
        }
        return sb.append(']').toString();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'inserting out of order, duplicates go after', vi: 'chèn lộn xộn, phần tử trùng đứng sau' }, vao: 'INS Minh\nINS An\nINS Tuan\nINS Binh\nINS An\nINS Zoe\nINS An\nDEL An\nDEL Khanh\nDEL Zoe\n' },
    { ten: { en: 'remove from an empty list, remove everything', vi: 'xoá khi rỗng, xoá hết' }, vao: 'DEL X\nINS B\nINS B\nINS A\nDEL B\nDEL A\nINS C\nINS C\nINS C\nDEL C\n', an: true },
  ],
  goiY: [
    { en: 'insertSorted: walk p from header.next while p is not the trailer and p.element <= e; the new node goes between p.prev and p.', vi: 'insertSorted: cho p đi từ header.next khi p chưa là trailer và p.element <= e; nút mới nằm giữa p.prev và p.' },
    { en: 'Using <= (not <) is what puts equal elements after the existing ones. The trailer acts as "+∞", so inserting at the end needs no extra branch.', vi: 'Dùng <= (không phải <) mới đưa phần tử bằng nhau ra sau. Trailer đóng vai "+∞", nên chèn cuối không cần nhánh riêng.' },
  ],
  loiHayGap: [
    { en: 'Stopping at the first element >= e — equal names are inserted before the old ones and the object order differs.', vi: 'Dừng ở phần tử đầu tiên >= e — tên bằng nhau bị chèn trước các tên cũ và thứ tự đối tượng sai.' },
    { en: 'Comparing names with == — the grader builds every name as a new String object, so == never matches.', vi: 'So tên bằng == — máy chấm dựng mỗi tên thành một đối tượng String mới, nên == không bao giờ khớp.' },
  ],
  giaiThich: { en: '<p>The trailer works as a stopper: the walk always ends on a real node, so inserting at the front, the middle or the end is the same code, and removing a node needs only its own prev/next. Each operation is one walk: O(n).</p>', vi: '<p>Trailer làm "chốt chặn": lượt đi luôn dừng trên một nút có thật, nên chèn đầu, giữa hay cuối là cùng một đoạn code, và xoá một nút chỉ cần prev/next của chính nó. Mỗi thao tác một lượt đi: O(n).</p>' },
});

const de3 = deJava({
  id: 'csd201-1-3-browser-history',
  tieuDe: { en: 'Browser history on a doubly linked list: visit, back, forward', vi: 'Lịch sử trình duyệt trên danh sách kép: visit, back, forward' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['a cursor into a doubly linked list', 'cutting off the forward part', 'moving both ways'],
  moTa: {
    en: `<p>The Back and Forward buttons of a browser. ${c('History(String home)')} starts on ${c('home')}; the pages live in a sentinel doubly linked list and ${c('cur')} points at the current page.</p>
<ul><li>${c('void visit(String url)')} — the pages after ${c('cur')} are <b>dropped</b> (you cannot go forward any more), ${c('url')} is added after ${c('cur')} and becomes current;</li>
<li>${c('String back(int steps)')} / ${c('String forward(int steps)')} — move up to ${c('steps')} pages (stop at the first / last page), return the current page.</li></ul>
<p>The grader walks the list from the header: dropped pages must really be unlinked from it.</p>`,
    vi: `<p>Nút Back và Forward của trình duyệt. ${c('History(String home)')} bắt đầu ở ${c('home')}; các trang nằm trong danh sách kép có lính canh và ${c('cur')} trỏ trang hiện tại. ${c('visit(url)')} — các trang sau ${c('cur')} bị <b>bỏ</b> (không forward được nữa), ${c('url')} được thêm sau ${c('cur')} và thành trang hiện tại; ${c('back(steps)')} / ${c('forward(steps)')} — đi tối đa ${c('steps')} trang (dừng ở trang đầu / cuối), trả về trang hiện tại.</p>
<p>Máy chấm đi danh sách từ header: các trang bị bỏ phải thật sự được gỡ khỏi danh sách.</p>`,
  },
  yeuCau: { en: ['visit is O(1): cut the forward part by relinking, do not walk it.', 'back/forward are O(steps); use the sentinels to know where the ends are.'], vi: ['visit là O(1): cắt phần phía trước bằng cách nối lại, không đi qua nó.', 'back/forward là O(steps); dùng lính canh để biết đâu là hai đầu.'] },
  dauVao: { en: 'VISIT url · BACK k · FWD k.', vi: 'VISIT url · BACK k · FWD k.' },
  dauRa: { en: 'Current page and the list walked from header (and back from trailer).', vi: 'Trang hiện tại và danh sách đi từ header (và ngược từ trailer).' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        History t = new History("home");',
      lenh: `                if (p[0].equals("VISIT")) {
                    t.visit(p[1]);
                    r = "ok";
                } else if (p[0].equals("BACK")) {
                    r = t.back(n(1));
                } else {
                    r = t.forward(n(1));
                }`,
      trangThai: '"fwd " + Kiem.chuoi(Kiem.lay(t, "header"), "next", "element", 50) + " | back " + Kiem.chuoi(Kiem.lay(t, "trailer"), "prev", "element", 50)',
    }),
  },
  tep: {
    'Node.java': NODE,
    'History.java': j`
public class History {
    private final Node header = new Node(null, null, null);
    private final Node trailer = new Node(null, header, null);
    private Node cur;

    public History(String home) {
        header.next = trailer;
        cur = new Node(home, header, trailer);
        header.next = cur;
        trailer.prev = cur;
    }

    public void visit(String url) {
        //>> // TODO: drop everything after cur, add url after cur, make it current — O(1)
        Node q = new Node(url, cur, trailer);
        cur.next = q; // the old forward pages are no longer reachable
        trailer.prev = q;
        cur = q;
        //<<
    }

    public String back(int steps) {
        //>> return null; // TODO
        for (int i = 0; i < steps && cur.prev != header; i++) {
            cur = cur.prev;
        }
        return cur.element;
        //<<
    }

    public String forward(int steps) {
        //>> return null; // TODO
        for (int i = 0; i < steps && cur.next != trailer; i++) {
            cur = cur.next;
        }
        return cur.element;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the LeetCode 1472 walk-through', vi: 'kịch bản LeetCode 1472' }, vao: 'VISIT google\nVISIT facebook\nVISIT youtube\nBACK 1\nBACK 1\nFWD 1\nVISIT linkedin\nFWD 2\nBACK 2\nBACK 7\n' },
    { ten: { en: 'back and forward past both ends', vi: 'back và forward vượt cả hai đầu' }, vao: 'BACK 3\nFWD 3\nVISIT a\nVISIT b\nBACK 5\nFWD 1\nVISIT c\nFWD 9\nBACK 1\n', an: true },
  ],
  goiY: [
    { en: 'visit: the new node’s prev is cur and its next is the trailer; then cur.next and trailer.prev point to it. The dropped pages are simply no longer linked.', vi: 'visit: nút mới có prev là cur và next là trailer; rồi cur.next và trailer.prev trỏ tới nó. Các trang bị bỏ đơn giản là không còn được nối.' },
    { en: 'back: move cur = cur.prev while steps remain and cur.prev is not the header.', vi: 'back: dời cur = cur.prev khi còn bước và cur.prev chưa là header.' },
  ],
  loiHayGap: [
    { en: 'visit adding at the END of the list instead of after cur — going back then visiting keeps the old forward pages.', vi: 'visit thêm vào CUỐI danh sách thay vì sau cur — back rồi visit vẫn giữ các trang forward cũ.' },
    { en: 'Forgetting trailer.prev in visit — the backward walk from the trailer still shows the dropped pages.', vi: 'Quên trailer.prev trong visit — đi ngược từ trailer vẫn thấy các trang đã bỏ.' },
  ],
  giaiThich: { en: '<p>A cursor in a doubly linked list moves both ways in O(1) per step, and dropping "everything after the cursor" is a single relink — the garbage collector reclaims the unreachable nodes. A pair of stacks gives the same behaviour (LeetCode 1472); the list version shows the structure directly.</p>', vi: '<p>Con trỏ trong danh sách kép đi hai chiều O(1) mỗi bước, và bỏ "mọi thứ sau con trỏ" chỉ là một lần nối lại — bộ thu gom rác lấy lại các nút không còn với tới. Hai ngăn xếp cũng cho cùng hành vi (LeetCode 1472); bản danh sách cho thấy cấu trúc trực tiếp.</p>' },
});

export default moDun({ slug: 'csd201-doubly-sentinel', ten: '1.3 Doubly linked lists with sentinels', de: [de1, de2, de3] });
