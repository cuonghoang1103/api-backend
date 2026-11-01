/** CSD201 · 6.8 — Thực hành chương 6 trên danh sách liên kết Car (kiểu PE): merge sort danh sách theo giá rồi chủ xe (kiểm O(n log n)), sắp một đoạn [i..j] giảm dần, insertion sort bằng nối lại nút. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const CAR = j`
// GIVEN — do not change.
class Car {
    String owner;
    int price;

    Car(String owner, int price) {
        this.owner = owner;
        this.price = price;
    }

    @Override
    public String toString() {
        return "(" + owner + "," + price + ")";
    }
}
`;
const NODE = j`
// GIVEN — do not change.
class Node {
    Car info;
    Node next;

    Node(Car x, Node p) {
        info = x;
        next = p;
    }
}
`;
// dựng danh sách từ "owner price owner price …", nhớ các nút để kiểm đúng đối tượng
const THEM = `
    static List<Object> made = new ArrayList<>();

    static Node build(int from) {
        Node head = null, tail = null;
        made = new ArrayList<>();
        for (int i = from; i + 1 < p.length; i += 2) {
            Node q = new Node(new Car(p[i], Integer.parseInt(p[i + 1])), null);
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

    static String nodes(Node h) {
        IdentityHashMap<Object, Integer> id = new IdentityHashMap<>();
        for (int i = 0; i < made.size(); i++) {
            id.put(made.get(i), i);
        }
        StringBuilder sb = new StringBuilder();
        int count = 0;
        for (Node q = h; q != null && count <= made.size(); q = q.next, count++) {
            Integer k = id.get(q);
            sb.append(q.info).append(k == null ? "#NEW" : "#" + k).append(' ');
        }
        return sb.toString().trim();
    }
`;

const de1 = deJava({
  id: 'csd201-6-8-list-merge-sort',
  tieuDe: { en: 'Merge sort on a linked list of cars: price, then owner — O(n log n), no new nodes', vi: 'Merge sort trên danh sách liên kết các xe: theo giá, rồi chủ xe — O(n log n), không tạo nút mới' },
  doKho: 'HARD', phut: 35, dangBai: 'pe',
  khaiNiem: ['split with slow/fast pointers', 'merge by relinking', 'stability', 'why merge sort suits linked lists'],
  moTa: {
    en: `<p>Complete ${c('static Node sort(Node head)')}: return the head of the same nodes relinked in ascending order of price, and for equal prices ascending owner (${c('compareTo')}). Split the list in the middle with slow/fast pointers, sort both halves recursively, merge them by relinking (rule R1: no ${c('new Node')}, no arrays or collections). The recursion depth is only log n.</p>
<p>The grader prints every car with the number of its original node (${c('#k')}), and sorts 300,000 cars against a time limit — insertion sort on a list is O(n²).</p>`,
    vi: `<p>Hoàn thiện ${c('static Node sort(Node head)')}: trả head của chính các nút đó được nối lại theo giá tăng dần, cùng giá thì theo chủ xe tăng dần (${c('compareTo')}). Chia danh sách ở giữa bằng con trỏ slow/fast, sắp đệ quy hai nửa, trộn bằng cách nối lại (luật R1: không ${c('new Node')}, không mảng hay collection). Độ sâu đệ quy chỉ log n.</p>
<p>Máy chấm in mỗi xe kèm số hiệu nút ban đầu (${c('#k')}), và sắp 300.000 xe có hạn giờ — sắp chèn trên danh sách là O(n²).</p>`,
  },
  yeuCau: { en: ['O(n log n), O(log n) stack.', 'Same node objects (rule R1).'], vi: ['O(n log n), O(log n) ngăn xếp.', 'Đúng các đối tượng nút cũ (luật R1).'] },
  dauVao: { en: 'Lines "S owner price owner price …"; PERF.', vi: 'Các dòng "S chủ giá chủ giá …"; PERF.' },
  dauRa: { en: 'The sorted list with node numbers.', vi: 'Danh sách đã sắp kèm số hiệu nút.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'relink only: no new Node, arrays or collections in ListSort', vi: 'chỉ nối lại: không new Node, mảng hay collection trong ListSort', re: String.raw`\bnew\s+Node\b|\bnew\s+\w+\s*\[|\b(List|ArrayList|LinkedList|Collections|Arrays)\b`, file: 'ListSort' }],
  hen: { n: '300,000 cars', ms: 4000, can: 'O(n log n)', cham: 'O(n²) (insertion or selection on the list)' },
  harness: {
    'KiemTra.java': lopKiem({
      them: THEM,
      lenh: `                if (p[0].equals("PERF")) {
                    int[] pr = Kiem.ngauNhien(300000, 1000, 121);
                    Node h = null;
                    for (int i = pr.length - 1; i >= 0; i--) {
                        h = new Node(new Car("o" + (i % 97), pr[i]), h);
                    }
                    final Node[] res = {h};
                    r = Kiem.hen("300,000 cars", 4000, new Runnable() {
                        public void run() {
                            res[0] = ListSort.sort(res[0]);
                        }
                    });
                    boolean ok = true;
                    int cnt = 0;
                    for (Node q = res[0]; q != null && q.next != null; q = q.next, cnt++) {
                        Car x = q.info, y = q.next.info;
                        ok &= x.price < y.price || x.price == y.price && x.owner.compareTo(y.owner) <= 0;
                    }
                    r += ", sorted " + ok + ", nodes " + (cnt + 1);
                } else {
                    r = nodes(ListSort.sort(build(1)));
                }`,
    }),
  },
  tep: {
    'Car.java': CAR,
    'Node.java': NODE,
    'ListSort.java': j`
public class ListSort {

    static Node sort(Node head) {
        //>> return head; // TODO
        if (head == null || head.next == null) {
            return head;
        }
        Node slow = head, fast = head.next;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        Node right = slow.next;
        slow.next = null; // cut into two halves
        return merge(sort(head), sort(right));
        //<<
    }
    //>> // TODO: helper(s)

    private static boolean before(Car x, Car y) {
        return x.price < y.price || x.price == y.price && x.owner.compareTo(y.owner) <= 0;
    }

    private static Node merge(Node a, Node b) {
        Node head = null, tail = null;
        while (a != null && b != null) {
            Node take;
            if (before(a.info, b.info)) {
                take = a;
                a = a.next;
            } else {
                take = b;
                b = b.next;
            }
            if (head == null) {
                head = take;
            } else {
                tail.next = take;
            }
            tail = take;
        }
        Node rest = a != null ? a : b;
        if (head == null) {
            return rest;
        }
        tail.next = rest;
        return head;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'the lesson’s cars', vi: 'các xe của bài' }, vao: 'S Hoa 25 Nam 12 Lan 40 An 25 Binh 40 Minh 7\nS A 1\nS\n' },
    { ten: { en: 'equal cars, reversed', vi: 'xe giống nhau, sắp ngược' }, vao: 'S X 5 X 5 A 5\nS E 5 D 4 C 3 B 2 A 1\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Start fast at head.next so that a 2-node list splits into 1 + 1 (otherwise the recursion never ends).', vi: 'Cho fast bắt đầu ở head.next để danh sách 2 nút chia thành 1 + 1 (nếu không đệ quy không dừng).' },
    { en: 'Merge with a tail pointer, taking from the left list on ties (stability).', vi: 'Trộn với con trỏ tail, khi bằng nhau lấy từ danh sách trái (ổn định).' },
  ],
  loiHayGap: [
    { en: 'Forgetting slow.next = null — the left half still contains the right half.', vi: 'Quên slow.next = null — nửa trái vẫn chứa cả nửa phải.' },
    { en: 'Copying the cars into an ArrayList, sorting it and rebuilding — fast, but forbidden here and it creates new nodes.', vi: 'Chép các xe ra ArrayList, sắp rồi dựng lại — nhanh, nhưng bị cấm ở đây và tạo nút mới.' },
  ],
  giaiThich: { en: '<p>Linked lists have no random access, which rules out quicksort’s and heap sort’s index tricks, but merging two lists is natural and needs no extra memory. log n levels of O(n) splitting and merging: O(n log n), stable, O(log n) stack.</p>', vi: '<p>Danh sách liên kết không truy cập ngẫu nhiên được, nên mất các mẹo chỉ số của quicksort và heap sort, nhưng trộn hai danh sách thì tự nhiên và không cần bộ nhớ thêm. log n tầng, mỗi tầng chia và trộn O(n): O(n log n), ổn định, ngăn xếp O(log n).</p>' },
});

const de2 = deJava({
  id: 'csd201-6-8-sort-range',
  tieuDe: { en: 'PE style: sort only positions i..j of a linked list, descending by price', vi: 'Kiểu PE: chỉ sắp các vị trí i..j của danh sách liên kết, giảm dần theo giá' },
  doKho: 'MEDIUM', phut: 25, dangBai: 'pe',
  khaiNiem: ['locating a sub-list', 'selection sort by swapping infos', 'leaving the rest untouched'],
  moTa: {
    en: `<p>The classic last question of a PE MyList paper: "sort the elements from position i to position j descending by price; the others stay where they are" (0-based positions; if j ≥ size use the last node; i &gt; j or i ≥ size: no change). Complete ${c('static void sortRange(Node head, int i, int j)')} by swapping the ${c('info')} fields (a stable selection: on equal prices keep the earlier car first — shift the infos instead of swapping when needed, or pick the <b>first</b> maximum and shift).</p>`,
    vi: `<p>Câu cuối kinh điển của đề PE MyList: "sắp các phần tử từ vị trí i tới vị trí j giảm dần theo giá; các phần tử khác giữ nguyên chỗ" (vị trí tính từ 0; j ≥ size thì lấy nút cuối; i &gt; j hoặc i ≥ size thì không đổi). Hoàn thiện ${c('static void sortRange(Node head, int i, int j)')} bằng cách đổi các trường ${c('info')} (chọn ổn định: cùng giá thì xe đứng trước vẫn đứng trước — dời các info thay vì đổi chỗ khi cần, hoặc chọn max <b>đầu tiên</b> rồi dời).</p>`,
  },
  yeuCau: { en: ['Only infos inside [i..j] move.', 'Stable: equal prices keep their order.'], vi: ['Chỉ các info trong [i..j] được di chuyển.', 'Ổn định: cùng giá giữ thứ tự.'] },
  dauVao: { en: 'Lines "R i j : owner price …".', vi: 'Các dòng "R i j : chủ giá …".' },
  dauRa: { en: 'The list after sorting the range.', vi: 'Danh sách sau khi sắp đoạn.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      them: THEM,
      lenh: `                Node h = build(4);
                RangeSort.sortRange(h, n(1), n(2));
                r = nodes(h).replaceAll("#\\\\d+", "");`,
    }),
  },
  tep: {
    'Car.java': CAR,
    'Node.java': NODE,
    'RangeSort.java': j`
public class RangeSort {

    static void sortRange(Node head, int i, int j) {
        //>> // TODO
        Node start = head;
        for (int k = 0; k < i && start != null; k++) {
            start = start.next;
        }
        if (start == null || i > j) {
            return;
        }
        int len = 0; // number of nodes in [i..j] that exist
        for (Node p = start; p != null && len <= j - i; p = p.next) {
            len++;
        }
        for (int done = 0; done < len - 1; done++) { // stable selection: move the FIRST maximum to the front
            Node first = start;
            for (int k = 0; k < done; k++) {
                first = first.next;
            }
            Node best = first;
            Node p = first.next;
            for (int k = done + 1; k < len; k++, p = p.next) {
                if (p.info.price > best.info.price) {
                    best = p;
                }
            }
            Car x = best.info; // shift the infos from first to best one step to the right
            for (Node q = first; q != best; q = q.next) {
                Car t = q.info;
                q.info = x;
                x = t;
            }
            best.info = x;
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a middle range, the whole list, j beyond the end', vi: 'đoạn giữa, cả danh sách, j vượt cuối' }, vao: 'R 1 4 : A 5 B 2 C 9 D 4 E 7 F 1\nR 0 9 : A 5 B 2 C 9\nR 2 99 : A 1 B 2 C 3 D 4\n' },
    { ten: { en: 'equal prices keep their order; empty ranges', vi: 'cùng giá giữ thứ tự; đoạn rỗng' }, vao: 'R 0 3 : A 5 B 7 C 5 D 7\nR 3 1 : A 1 B 2 C 3 D 4\nR 5 6 : A 1 B 2\nR 2 2 : A 1 B 2 C 3\n', an: true },
  ],
  goiY: [
    { en: 'Walk to position i once; count how many nodes of [i..j] really exist (the list may be shorter).', vi: 'Đi tới vị trí i một lần; đếm xem có bao nhiêu nút của [i..j] thật sự tồn tại (danh sách có thể ngắn hơn).' },
    { en: 'For each pass pick the first maximum and rotate the infos between the pass start and it — that keeps equal prices in order.', vi: 'Mỗi lượt chọn max đầu tiên rồi xoay các info giữa đầu lượt và nó — giữ thứ tự các xe cùng giá.' },
  ],
  loiHayGap: [
    { en: 'Sorting the whole list — the paper says only positions i..j.', vi: 'Sắp cả danh sách — đề chỉ nói các vị trí i..j.' },
    { en: 'Swapping the maximum with the pass start — equal prices change order (B and D swap).', vi: 'Đổi chỗ max với đầu lượt — các xe cùng giá đổi thứ tự (B và D đổi chỗ).' },
  ],
  giaiThich: { en: '<p>Swapping infos keeps all the links untouched, so the nodes outside [i..j] are guaranteed not to move. Selection with rotation is O(L²) for a range of length L — fine for PE-sized lists, and stable.</p>', vi: '<p>Đổi info giữ nguyên mọi liên kết, nên các nút ngoài [i..j] chắc chắn không di chuyển. Chọn kèm xoay tốn O(L²) với đoạn dài L — ổn cho danh sách cỡ đề PE, và ổn định.</p>' },
});

const de3 = deJava({
  id: 'csd201-6-8-insertion-relink',
  tieuDe: { en: 'Insertion sort of a linked list by relinking nodes (stable)', vi: 'Sắp chèn danh sách liên kết bằng cách nối lại nút (ổn định)' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['building a new sorted list from the old nodes', 'insert after the last node with a price <= x', 'O(n²) but O(n) on sorted input'],
  moTa: {
    en: `<p>Complete ${c('static Node insertionSort(Node head)')}: take the nodes one by one from the original list and insert each into a growing sorted list (ascending price) <b>after</b> every node with a price ≤ its own (stable). Relink the existing nodes (rule R1). Return the new head.</p>`,
    vi: `<p>Hoàn thiện ${c('static Node insertionSort(Node head)')}: lấy lần lượt từng nút khỏi danh sách cũ và chèn vào một danh sách đã sắp đang lớn dần (giá tăng dần) <b>sau</b> mọi nút có giá ≤ giá của nó (ổn định). Nối lại chính các nút có sẵn (luật R1). Trả về head mới.</p>`,
  },
  yeuCau: { en: ['Same node objects (rule R1).', 'Stable.'], vi: ['Đúng các đối tượng nút cũ (luật R1).', 'Ổn định.'] },
  dauVao: { en: 'Lines "S owner price …".', vi: 'Các dòng "S chủ giá …".' },
  dauRa: { en: 'The sorted list with node numbers.', vi: 'Danh sách đã sắp kèm số hiệu nút.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'relink only: no new Node, arrays or collections in Ins', vi: 'chỉ nối lại: không new Node, mảng hay collection trong Ins', re: String.raw`\bnew\s+Node\b|\bnew\s+\w+\s*\[|\b(List|ArrayList|LinkedList|Collections|Arrays)\b`, file: 'Ins' }],
  harness: {
    'KiemTra.java': lopKiem({
      them: THEM,
      lenh: '                r = nodes(Ins.insertionSort(build(1)));',
    }),
  },
  tep: {
    'Car.java': CAR,
    'Node.java': NODE,
    'Ins.java': j`
public class Ins {

    static Node insertionSort(Node head) {
        //>> return head; // TODO
        Node sorted = null;
        while (head != null) {
            Node x = head;
            head = head.next;
            if (sorted == null || x.info.price < sorted.info.price) {
                x.next = sorted; // new first node
                sorted = x;
            } else {
                Node p = sorted;
                while (p.next != null && p.next.info.price <= x.info.price) {
                    p = p.next; // <= : after the equal ones (stable)
                }
                x.next = p.next;
                p.next = x;
            }
        }
        return sorted;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the lesson’s cars', vi: 'các xe của bài' }, vao: 'S Hoa 25 Nam 12 Lan 40 An 25 Binh 40 Minh 7\nS A 1\nS\n' },
    { ten: { en: 'equal prices, sorted, reversed', vi: 'cùng giá, đã sắp, sắp ngược' }, vao: 'S A 3 B 3 C 3\nS A 1 B 2 C 3\nS C 3 B 2 A 1\n', an: true },
  ],
  goiY: [
    { en: 'Detach the first node of the input, then insert it into the result; repeat until the input is empty.', vi: 'Tách nút đầu của đầu vào, rồi chèn vào kết quả; lặp tới khi đầu vào rỗng.' },
    { en: 'A node goes in front of the result only when it is STRICTLY cheaper than the first node.', vi: 'Một nút chỉ đứng đầu kết quả khi nó rẻ HƠN HẲN nút đầu.' },
  ],
  loiHayGap: [
    { en: 'Reading head.next after relinking x — the rest of the input is lost.', vi: 'Đọc head.next sau khi đã nối lại x — mất phần còn lại của đầu vào.' },
    { en: 'Using < while walking — equal prices come out in reverse order.', vi: 'Dùng < khi đi — các xe cùng giá ra theo thứ tự ngược.' },
  ],
  giaiThich: { en: '<p>Each insertion walks the sorted part: Θ(n²) in general, but relinking moves no data, and the algorithm is stable. On a linked list there is no shifting cost at all — the only cost is finding the place.</p>', vi: '<p>Mỗi lần chèn đi qua phần đã sắp: nói chung Θ(n²), nhưng nối lại không di chuyển dữ liệu, và thuật toán ổn định. Trên danh sách liên kết không tốn chi phí dời phần tử — chi phí duy nhất là tìm chỗ.</p>' },
});

export default moDun({ slug: 'csd201-on-ch6', ten: '6.8 🧪 Practice — sorting linked lists of cars, PE style', de: [de1, de2, de3] });
