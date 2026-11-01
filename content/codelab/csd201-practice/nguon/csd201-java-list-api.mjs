/** CSD201 · 1.4 — ArrayList vs LinkedList thật: Iterator.remove, trộn bằng iterator, chọn cấu trúc cho hàng đợi (có kiểm độ phức tạp). */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-1-4-iterator-remove',
  tieuDe: { en: 'Remove while iterating: Iterator.remove on any List', vi: 'Xoá trong lúc duyệt: Iterator.remove trên mọi List' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['Iterator.remove', 'ConcurrentModificationException', 'get(i) on LinkedList is O(n)'],
  moTa: {
    en: `<p>Complete ${c('static int removeIf(List<Integer> list, int divisor)')}: remove every element divisible by ${c('divisor')} and return how many were removed. The list may be an ${c('ArrayList')} <b>or</b> a ${c('LinkedList')} — the grader tries both.</p>
<p>Two classic mistakes: removing inside a for-each loop throws ${c('ConcurrentModificationException')}; a loop with ${c('list.get(i)')} / ${c('list.remove(i)')} is O(n) per call on a LinkedList, O(n²) overall. Walk with an ${c('Iterator')} and call ${c('it.remove()')}.</p>`,
    vi: `<p>Hoàn thiện ${c('static int removeIf(List<Integer> list, int divisor)')}: xoá mọi phần tử chia hết cho ${c('divisor')} và trả về số phần tử đã xoá. Danh sách có thể là ${c('ArrayList')} <b>hoặc</b> ${c('LinkedList')} — máy chấm thử cả hai.</p>
<p>Hai lỗi kinh điển: xoá trong vòng for-each ném ${c('ConcurrentModificationException')}; vòng lặp dùng ${c('list.get(i)')} / ${c('list.remove(i)')} tốn O(n) mỗi lần trên LinkedList, tổng O(n²). Hãy duyệt bằng ${c('Iterator')} và gọi ${c('it.remove()')}.</p>`,
  },
  yeuCau: { en: ['Do not use List.removeIf or streams — write the iterator loop yourself (rule R1).', 'Do not copy into another list.'], vi: ['Không dùng List.removeIf hay stream — tự viết vòng iterator (luật R1).', 'Không chép sang danh sách khác.'] },
  dauVao: { en: 'Lines "ARRAY|LINKED d : values"; PERF.', vi: 'Các dòng "ARRAY|LINKED d : giá trị"; PERF.' },
  dauRa: { en: 'Number removed and the list.', vi: 'Số phần tử đã xoá và danh sách.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no removeIf / stream / new list in Lists', vi: 'không removeIf / stream / tạo list mới trong Lists', re: String.raw`\.removeIf\s*\(|\.stream\s*\(|\bnew\s+(ArrayList|LinkedList)\b`, file: 'Lists' }],
  hen: { n: '300,000 elements of a LinkedList, half removed', ms: 3000, can: 'O(n)', cham: 'O(n²) with get(i)/remove(i)', en: 'On a LinkedList, get(i) and remove(i) walk from an end every time.', vi: 'Trên LinkedList, get(i) và remove(i) mỗi lần đều đi từ một đầu.' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final List<Integer> big = new LinkedList<>();
                    for (int i = 0; i < 300000; i++) {
                        big.add(i);
                    }
                    final int[] k = new int[1];
                    r = Kiem.hen("LinkedList of 300,000, remove the even ones", 3000, new Runnable() {
                        public void run() {
                            k[0] = Lists.removeIf(big, 2);
                        }
                    }) + ", removed " + k[0] + ", left " + big.size() + ", first " + big.get(0);
                } else {
                    List<Integer> list = p[0].equals("ARRAY") ? new ArrayList<Integer>() : new LinkedList<Integer>();
                    for (int i = 3; i < p.length; i++) {
                        list.add(n(i));
                    }
                    int k = Lists.removeIf(list, n(1));
                    r = "removed " + k + " " + list;
                }`,
    }),
  },
  tep: {
    'Lists.java': j`
import java.util.Iterator;
import java.util.List;

public class Lists {

    // removes every element divisible by divisor; returns how many were removed
    static int removeIf(List<Integer> list, int divisor) {
        //>> return 0; // TODO: Iterator + it.remove()
        int count = 0;
        Iterator<Integer> it = list.iterator();
        while (it.hasNext()) {
            if (it.next() % divisor == 0) {
                it.remove(); // O(1) on a LinkedList: the iterator is standing on the node
                count++;
            }
        }
        return count;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'both list kinds, neighbours that both match', vi: 'cả hai loại list, hai phần tử kề nhau cùng khớp' }, vao: 'ARRAY 2 : 1 2 4 5 6 7\nLINKED 2 : 1 2 4 5 6 7\nLINKED 3 : 3 6 9\nARRAY 5 : 1 2 3\n' },
    { ten: { en: 'empty list, negative values', vi: 'danh sách rỗng, giá trị âm' }, vao: 'LINKED 2 :\nARRAY 4 : -8 -3 0 4 7\nLINKED 7 : 7 14 1 21 2\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Iterator<Integer> it = list.iterator(); while (it.hasNext()) { if (it.next() % d == 0) it.remove(); }', vi: 'Iterator<Integer> it = list.iterator(); while (it.hasNext()) { if (it.next() % d == 0) it.remove(); }' },
    { en: 'it.remove() removes the element returned by the last next() — call next() exactly once per turn.', vi: 'it.remove() xoá phần tử mà next() vừa trả — mỗi vòng gọi next() đúng một lần.' },
  ],
  loiHayGap: [
    { en: 'for (Integer x : list) list.remove(x) — ConcurrentModificationException (and remove(Object) vs remove(int index) confusion).', vi: 'for (Integer x : list) list.remove(x) — ConcurrentModificationException (lại còn nhầm remove(Object) với remove(int index)).' },
    { en: 'for (int i = 0; i < list.size(); i++) with remove(i) — skips the element that slides into slot i, and is O(n²) on a LinkedList.', vi: 'for (int i = 0; i < list.size(); i++) kèm remove(i) — bỏ sót phần tử trượt vào ô i, và O(n²) trên LinkedList.' },
  ],
  giaiThich: { en: '<p>The iterator remembers where it stands: on a LinkedList, it.remove() unlinks that node in O(1), so the whole pass is O(n). On an ArrayList each it.remove() still shifts the tail (O(n²) worst case, but with a fast memory move) — the same code is optimal for linked lists and correct for both.</p>', vi: '<p>Iterator nhớ mình đang đứng ở đâu: trên LinkedList, it.remove() gỡ nút đó trong O(1), nên cả lượt là O(n). Trên ArrayList mỗi it.remove() vẫn dời phần đuôi (xấu nhất O(n²), nhưng bằng phép chép bộ nhớ nhanh) — cùng một đoạn code tối ưu cho danh sách liên kết và đúng cho cả hai.</p>' },
});

const de2 = deJava({
  id: 'csd201-1-4-merge-iterators',
  tieuDe: { en: 'Merge two sorted Lists with iterators, whatever their class', vi: 'Trộn hai List đã sắp bằng iterator, bất kể là lớp nào' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['merge step of merge sort', 'List interface', 'ListIterator / Iterator', 'O(n + m)'],
  moTa: {
    en: `<p>Complete ${c('static List<Integer> merge(List<Integer> a, List<Integer> b)')}: both inputs are sorted ascending; return a new ${c('ArrayList')} with every element of both, sorted, equal values from ${c('a')} before those from ${c('b')}. Do not change the inputs.</p>
<p>The inputs can be ${c('LinkedList')}s, so ${c('a.get(i)')} is O(i): use iterators and keep the "current" element of each list in a variable.</p>`,
    vi: `<p>Hoàn thiện ${c('static List<Integer> merge(List<Integer> a, List<Integer> b)')}: hai danh sách vào đã sắp tăng; trả về một ${c('ArrayList')} mới chứa mọi phần tử của cả hai theo thứ tự tăng, giá trị bằng nhau thì của ${c('a')} đứng trước của ${c('b')}. Không sửa hai danh sách vào.</p>
<p>Đầu vào có thể là ${c('LinkedList')}, nên ${c('a.get(i)')} tốn O(i): hãy dùng iterator và giữ phần tử "hiện tại" của mỗi danh sách trong một biến.</p>`,
  },
  yeuCau: { en: ['O(n + m): no get(i), no sort (rule R1).', 'The inputs stay unchanged.'], vi: ['O(n + m): không get(i), không sort (luật R1).', 'Hai danh sách vào giữ nguyên.'] },
  dauVao: { en: 'Lines "ARRAY|LINKED a1 a2 … | b1 b2 …"; PERF.', vi: 'Các dòng "ARRAY|LINKED a1 a2 … | b1 b2 …"; PERF.' },
  dauRa: { en: 'The merged list (and the inputs, unchanged).', vi: 'Danh sách đã trộn (và hai đầu vào, không đổi).' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no get(i), sort, addAll or streams in Merge', vi: 'không get(i), sort, addAll hay stream trong Merge', re: String.raw`\.(get|sort|addAll|stream)\s*\(|Collections\s*\.`, file: 'Merge' }],
  hen: { n: '2 × 200,000 elements in LinkedLists', ms: 3000, can: 'O(n + m)', cham: 'O(n²) with get(i)', en: 'Indexing a LinkedList walks from an end each time.', vi: 'Truy cập LinkedList theo chỉ số mỗi lần đều đi từ một đầu.' },
  harness: {
    'KiemTra.java': lopKiem({
      them: `
    static List<Integer> read(String kind, int from, int to) {
        List<Integer> l = kind.equals("ARRAY") ? new ArrayList<Integer>() : new LinkedList<Integer>();
        for (int i = from; i < to; i++) {
            l.add(Integer.parseInt(p[i]));
        }
        return l;
    }
`,
      lenh: `                if (p[0].equals("PERF")) {
                    final List<Integer> a = new LinkedList<>();
                    final List<Integer> b = new LinkedList<>();
                    for (int i = 0; i < 200000; i++) {
                        a.add(2 * i);
                        b.add(3 * i);
                    }
                    final List<?>[] m = new List<?>[1];
                    r = Kiem.hen("merge 2 x 200,000 (LinkedList)", 3000, new Runnable() {
                        public void run() {
                            m[0] = Merge.merge(a, b);
                        }
                    }) + ", size " + (m[0] == null ? -1 : m[0].size());
                } else {
                    int bar = Arrays.asList(p).indexOf("|");
                    List<Integer> a = read(p[0], 1, bar);
                    List<Integer> b = read(p[0], bar + 1, p.length);
                    List<Integer> m = Merge.merge(a, b);
                    r = m + " (a " + a + ", b " + b + ")";
                }`,
    }),
  },
  tep: {
    'Merge.java': j`
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class Merge {

    static List<Integer> merge(List<Integer> a, List<Integer> b) {
        //>> return new ArrayList<>(); // TODO: two iterators, one current element each
        List<Integer> out = new ArrayList<>();
        Iterator<Integer> ia = a.iterator();
        Iterator<Integer> ib = b.iterator();
        Integer x = ia.hasNext() ? ia.next() : null; // current element of a (null = a is used up)
        Integer y = ib.hasNext() ? ib.next() : null;
        while (x != null || y != null) {
            if (y == null || (x != null && x <= y)) { // <= : equal values from a first
                out.add(x);
                x = ia.hasNext() ? ia.next() : null;
            } else {
                out.add(y);
                y = ib.hasNext() ? ib.next() : null;
            }
        }
        return out;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'ArrayList and LinkedList inputs', vi: 'đầu vào ArrayList và LinkedList' }, vao: 'ARRAY 1 4 9 | 2 3 10 11\nLINKED 1 4 9 | 2 3 10 11\nLINKED | 5 6\nARRAY 7 |\n' },
    { ten: { en: 'equal values, negatives, one list exhausted early', vi: 'giá trị bằng nhau, số âm, một danh sách hết sớm' }, vao: 'LINKED -5 0 0 7 | -5 0 8\nARRAY 1 2 3 | 100 200\nLINKED 1000 1000 | 1000\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Keep x = the current element of a (or null when a is used up) and y for b; each turn output the smaller one and advance only that iterator.', vi: 'Giữ x = phần tử hiện tại của a (null khi a hết) và y cho b; mỗi vòng đưa ra cái nhỏ hơn và chỉ tiến iterator đó.' },
    { en: 'When one list is used up, the loop keeps taking from the other — the condition y == null handles it.', vi: 'Khi một danh sách hết, vòng lặp tiếp tục lấy từ danh sách kia — điều kiện y == null lo việc đó.' },
  ],
  loiHayGap: [
    { en: 'Comparing two Integer objects with == or using x < y with x == y going to b first — equal values must come from a first.', vi: 'So hai Integer bằng == hoặc dùng x < y khiến giá trị bằng nhau lấy từ b trước — phải lấy từ a trước.' },
    { en: 'Calling it.next() twice in one turn (once to compare, once to add) — one element is silently skipped.', vi: 'Gọi it.next() hai lần trong một vòng (một lần để so, một lần để thêm) — một phần tử bị bỏ qua.' },
  ],
  giaiThich: { en: '<p>Each turn outputs one element and advances one iterator, so the merge does exactly n + m turns: O(n + m) for any List implementation. With get(i), the same algorithm is O((n + m)²) on linked lists — the interface hides the cost, the iterator avoids it.</p>', vi: '<p>Mỗi vòng đưa ra một phần tử và tiến một iterator, nên phép trộn làm đúng n + m vòng: O(n + m) với mọi cài đặt List. Dùng get(i), cùng thuật toán thành O((n + m)²) trên danh sách liên kết — interface che mất chi phí, iterator thì tránh được nó.</p>' },
});

const de3 = deJava({
  id: 'csd201-1-4-ticket-queue',
  tieuDe: { en: 'Pick the right structure: a ticket queue of 400,000 customers', vi: 'Chọn đúng cấu trúc: hàng đợi 400.000 khách lấy số' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['ArrayList.remove(0) is O(n)', 'ArrayDeque / LinkedList as a queue', 'Deque interface'],
  moTa: {
    en: `<p>${c('TicketDesk')} hands out numbers and serves customers in order. The starter keeps the waiting customers in an ${c('ArrayList')} and serves with ${c('remove(0)')} — every service shifts the whole list. Rewrite the class with a ${c('Deque<Integer>')} (${c('ArrayDeque')}) so that ${c('arrive()')}, ${c('serve()')} and ${c('waiting()')} are O(1):</p>
<ul><li>${c('int arrive()')} — the next ticket number (1, 2, 3, …) joins the back of the queue and is returned;</li>
<li>${c('int serve()')} — the front ticket leaves and is returned; −1 when nobody waits;</li>
<li>${c('int waiting()')}, ${c('String peekAll()')} — the queue as ${c('"[3, 4, 5]"')}.</li></ul>`,
    vi: `<p>${c('TicketDesk')} phát số và phục vụ khách theo thứ tự. Bản khởi đầu giữ khách đang chờ trong ${c('ArrayList')} và phục vụ bằng ${c('remove(0)')} — mỗi lần phục vụ dời cả danh sách. Viết lại bằng ${c('Deque<Integer>')} (${c('ArrayDeque')}) để ${c('arrive()')}, ${c('serve()')}, ${c('waiting()')} đều O(1): ${c('arrive()')} — số kế tiếp (1, 2, 3, …) vào cuối hàng và được trả về; ${c('serve()')} — số đầu hàng rời đi và được trả về, không ai chờ thì −1; ${c('waiting()')}, ${c('peekAll()')} — hàng đợi dạng ${c('"[3, 4, 5]"')}.</p>`,
  },
  yeuCau: { en: ['No ArrayList in TicketDesk (rule R1).', 'Same behaviour as the starter.'], vi: ['Không ArrayList trong TicketDesk (luật R1).', 'Hành vi giống bản khởi đầu.'] },
  dauVao: { en: 'A (arrive) · S (serve) · PERF.', vi: 'A (đến) · S (phục vụ) · PERF.' },
  dauRa: { en: 'Ticket number, then the queue.', vi: 'Số vé, rồi hàng đợi.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no ArrayList in TicketDesk', vi: 'không ArrayList trong TicketDesk', re: String.raw`\bArrayList\b`, file: 'TicketDesk' }],
  hen: { n: '400,000 arrivals then 400,000 services', ms: 3000, can: 'O(1) per operation', cham: 'O(n) per serve (ArrayList.remove(0))', en: 'remove(0) shifts every waiting customer: about 8·10¹⁰ element moves.', vi: 'remove(0) dời mọi khách đang chờ: khoảng 8·10¹⁰ lần dời phần tử.' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        TicketDesk t = new TicketDesk();',
      lenh: `                if (p[0].equals("A")) {
                    r = String.valueOf(t.arrive());
                } else if (p[0].equals("S")) {
                    r = String.valueOf(t.serve());
                } else {
                    final TicketDesk d = new TicketDesk();
                    final long[] sum = new long[1];
                    r = Kiem.hen("400,000 arrivals, 400,000 services", 3000, new Runnable() {
                        public void run() {
                            for (int i = 0; i < 400000; i++) {
                                d.arrive();
                            }
                            for (int i = 0; i < 400000; i++) {
                                sum[0] += d.serve();
                            }
                        }
                    }) + ", sum of served tickets " + sum[0];
                }`,
      trangThai: '"waiting " + t.waiting() + " " + t.peekAll()',
    }),
  },
  tep: {
    'TicketDesk.java': j`
//>> import java.util.ArrayList; ⏎ import java.util.List;
import java.util.ArrayDeque;
import java.util.Deque;
//<<

public class TicketDesk {
    //>> private final List<Integer> queue = new ArrayList<>(); // TODO: a Deque
    private final Deque<Integer> queue = new ArrayDeque<>();
    //<<
    private int next = 1;

    public int arrive() {
        //>> queue.add(next); ⏎ return next++;
        queue.addLast(next);
        return next++;
        //<<
    }

    public int serve() {
        //>> return queue.isEmpty() ? -1 : queue.remove(0); // O(n): shifts everybody
        return queue.isEmpty() ? -1 : queue.pollFirst();
        //<<
    }

    public int waiting() {
        return queue.size();
    }

    public String peekAll() {
        return queue.toString();
    }
}
`,
  },
  ca: [
    { ten: { en: 'arrive and serve', vi: 'đến và phục vụ' }, vao: 'A\nA\nA\nS\nA\nS\nS\nS\nS\nA\n' },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n' },
  ],
  goiY: [
    { en: 'Deque<Integer> queue = new ArrayDeque<>(); addLast to join, pollFirst to leave (pollFirst returns null on an empty deque).', vi: 'Deque<Integer> queue = new ArrayDeque<>(); addLast để vào hàng, pollFirst để rời hàng (pollFirst trả null khi rỗng).' },
    { en: 'ArrayDeque is a circular array: removing from the front only moves an index, nothing is shifted.', vi: 'ArrayDeque là mảng vòng: lấy ở đầu chỉ dời một chỉ số, không dời phần tử nào.' },
  ],
  loiHayGap: [
    { en: 'Keeping List<Integer> and switching to LinkedList but still calling get(0)/remove(0) through an index loop elsewhere — fine here, but the interface Deque says what you mean.', vi: 'Giữ List<Integer> rồi đổi sang LinkedList nhưng nơi khác vẫn gọi get(i) theo chỉ số — ở đây thì qua, nhưng interface Deque nói đúng ý bạn hơn.' },
    { en: 'Using push/pop of the Deque — they work at the FRONT (stack order), so the last customer would be served first.', vi: 'Dùng push/pop của Deque — chúng làm việc ở ĐẦU (thứ tự ngăn xếp), nên khách đến sau được phục vụ trước.' },
  ],
  giaiThich: { en: '<p>ArrayList.remove(0) moves every remaining element one slot left: O(n) per service, O(n²) for the day. ArrayDeque keeps head and tail indexes in a circular array, so both ends are O(1) — the structure the Java documentation recommends for queues and stacks.</p>', vi: '<p>ArrayList.remove(0) dời mọi phần tử còn lại sang trái một ô: O(n) mỗi lần phục vụ, O(n²) cả ngày. ArrayDeque giữ chỉ số đầu và cuối trên mảng vòng nên cả hai đầu O(1) — cấu trúc tài liệu Java khuyên dùng cho hàng đợi và ngăn xếp.</p>' },
});

export default moDun({ slug: 'csd201-java-list-api', ten: '1.4 Java in practice: ArrayList vs LinkedList', de: [de1, de2, de3] });
