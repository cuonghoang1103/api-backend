/** CSD201 · 7.4 — Hệ số tải, băm lại & HashMap của Java: bảng dây chuyền tự gấp đôi khi α > 0,75 (kiểm 10⁶ khoá), hashCode tồi làm HashMap thành O(n), tập int địa chỉ mở có nới. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-7-4-rehash',
  tieuDe: { en: 'A chained hash table that doubles when the load factor passes 0.75', vi: 'Bảng băm dây chuyền tự gấp đôi khi hệ số tải vượt 0,75' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['load factor α = n / m', 'rehash: every key moves to key mod 2m', 'amortized O(1) insert'],
  moTa: {
    en: `<p>${c('IntHashSet')} keeps non-negative int keys in chains (${c('Node[] table')}, initial capacity 4, ${c('size')}). Complete ${c('boolean add(int k)')} (false for a duplicate; new keys go to the head of chain ${c('k % capacity')}) and ${c('boolean contains(int k)')}. After an insertion, if ${c('size > 0.75 · capacity')}, <b>rehash</b>: allocate ${c('2 · capacity')} chains and move every node (walking the old buckets from index 0 up, each chain from its head) to the head of its new chain.</p>
<p>The grader prints capacity, size and the chains; the complexity check adds a million keys — without rehashing the chains grow to ~250,000 nodes.</p>`,
    vi: `<p>${c('IntHashSet')} giữ khoá int không âm trong các dây (${c('Node[] table')}, sức chứa ban đầu 4, ${c('size')}). Hoàn thiện ${c('add(k)')} (trùng thì false; khoá mới vào đầu dây ${c('k % capacity')}) và ${c('contains(k)')}. Sau khi chèn, nếu ${c('size > 0.75 · capacity')} thì <b>băm lại</b>: cấp ${c('2 · capacity')} dây và chuyển mọi nút (duyệt các ô cũ từ chỉ số 0 lên, mỗi dây từ đầu) vào đầu dây mới của nó.</p>
<p>Máy chấm in sức chứa, size và các dây; kiểm độ phức tạp thêm một triệu khoá — không băm lại thì các dây dài tới ~250.000 nút.</p>`,
  },
  yeuCau: { en: ['Rehash exactly as described (the chains are printed).', 'Reuse the existing nodes when rehashing.'], vi: ['Băm lại đúng như mô tả (các dây được in ra).', 'Dùng lại các nút có sẵn khi băm lại.'] },
  dauVao: { en: 'ADD k · HAS k · PERF.', vi: 'ADD k · HAS k · PERF.' },
  dauRa: { en: 'Result, capacity, size and chains.', vi: 'Kết quả, sức chứa, size và các dây.' },
  main: 'KiemTra',
  hen: { n: '1,000,000 keys', ms: 4000, can: 'O(1) amortized per add', cham: 'O(n) per add (no rehashing: four huge chains)' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        IntHashSet t = new IntHashSet();',
      them: `
    static String state(IntHashSet t) {
        Object[] b = (Object[]) Kiem.lay(t, "table");
        StringBuilder sb = new StringBuilder("cap " + b.length + ", size " + Kiem.lay(t, "size") + ":");
        for (int i = 0; i < b.length; i++) {
            sb.append(' ').append(i).append('[').append(Kiem.chuoi(b[i], "next", "key", 100)).append(']');
        }
        return sb.toString();
    }
`,
      lenh: `                if (p[0].equals("ADD")) {
                    r = String.valueOf(t.add(n(1)));
                } else if (p[0].equals("HAS")) {
                    r = String.valueOf(t.contains(n(1)));
                } else {
                    final IntHashSet s = new IntHashSet();
                    final int[] found = new int[1];
                    r = Kiem.hen("1,000,000 adds + 1,000,000 lookups", 4000, new Runnable() {
                        public void run() {
                            for (int i = 0; i < 1000000; i++) {
                                s.add(i * 7);
                            }
                            for (int i = 0; i < 1000000; i++) {
                                if (s.contains(i)) {
                                    found[0]++;
                                }
                            }
                        }
                    }) + ", found " + found[0] + ", capacity " + ((Object[]) Kiem.lay(s, "table")).length;
                }`,
      trangThai: '(p[0].equals("PERF") ? "" : state(t))',
    }),
  },
  tep: {
    'Node.java': j`
// GIVEN — do not change.
class Node {
    int key;
    Node next;

    Node(int key, Node next) {
        this.key = key;
        this.next = next;
    }
}
`,
    'IntHashSet.java': j`
public class IntHashSet {
    private Node[] table = new Node[4];
    private int size = 0;

    public boolean contains(int k) {
        //>> return false; // TODO
        for (Node p = table[k % table.length]; p != null; p = p.next) {
            if (p.key == k) {
                return true;
            }
        }
        return false;
        //<<
    }

    public boolean add(int k) {
        //>> return false; // TODO
        if (contains(k)) {
            return false;
        }
        int b = k % table.length;
        table[b] = new Node(k, table[b]);
        size++;
        if (size > 0.75 * table.length) {
            rehash();
        }
        return true;
        //<<
    }
    //>> // TODO: helper(s)

    private void rehash() {
        Node[] old = table;
        table = new Node[2 * old.length];
        for (Node head : old) {
            Node p = head;
            while (p != null) {
                Node next = p.next; // remember before relinking
                int b = p.key % table.length;
                p.next = table[b];
                table[b] = p;
                p = next;
            }
        }
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'growing from 4 to 8 to 16', vi: 'nới từ 4 lên 8 lên 16' }, vao: 'ADD 1\nADD 5\nADD 9\nADD 2\nADD 13\nADD 5\nHAS 13\nHAS 6\nADD 6\nADD 7\nADD 17\n' },
    { ten: { en: 'keys that collide before and after rehashing', vi: 'các khoá va chạm trước và sau khi băm lại' }, vao: 'ADD 0\nADD 8\nADD 16\nADD 24\nADD 32\nADD 40\nADD 48\nHAS 40\nHAS 41\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Rehash right after the insertion that makes size > 0.75·capacity (with capacity 4 that is the 4th key).', vi: 'Băm lại ngay sau lần chèn làm size > 0,75·sức chứa (sức chứa 4 thì là khoá thứ 4).' },
    { en: 'When moving a node, save p.next first — you are about to overwrite it.', vi: 'Khi chuyển một nút, lưu p.next trước — bạn sắp ghi đè nó.' },
  ],
  loiHayGap: [
    { en: 'Re-inserting with add() during the rehash — size counts twice and add() may trigger another rehash in the middle.', vi: 'Chèn lại bằng add() trong lúc băm lại — size bị đếm hai lần và add() có thể gây thêm một lần băm lại giữa chừng.' },
    { en: 'Keeping the old index (k % oldCapacity) — contains looks in the wrong bucket afterwards.', vi: 'Giữ chỉ số cũ (k % sức chứa cũ) — contains sau đó tìm nhầm ô.' },
  ],
  giaiThich: { en: '<p>Keeping α ≤ 0.75 keeps the expected chain length O(1). A rehash costs O(n), but it happens after n/2 cheap insertions since the previous one, so the cost per insertion is amortized O(1) — the same doubling argument as for dynamic arrays. java.util.HashMap uses exactly this threshold.</p>', vi: '<p>Giữ α ≤ 0,75 thì độ dài dây kỳ vọng là O(1). Một lần băm lại tốn O(n), nhưng nó chỉ xảy ra sau n/2 lần chèn rẻ kể từ lần trước, nên chi phí mỗi lần chèn khấu hao O(1) — cùng lập luận gấp đôi như mảng động. java.util.HashMap dùng đúng ngưỡng này.</p>' },
});

const de2 = deJava({
  id: 'csd201-7-4-bad-hashcode',
  tieuDe: { en: 'A bad hashCode turns HashMap into a list: fix the key class', vi: 'hashCode tồi biến HashMap thành danh sách: sửa lớp khoá' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['spreading keys over buckets', 'combining fields: 31·h + x', 'a constant hash is legal but O(n)'],
  moTa: {
    en: `<p>${c('Cell(x, y)')} is a key for a ${c('HashMap<Cell, Integer>')} of a grid. The starter’s ${c('hashCode()')} returns ${c('x + y')} — legal (equal cells get equal codes), but every cell on an anti-diagonal shares a bucket: (3,4), (4,3), (0,7), (7,0)… Write a <b>good</b> ${c('hashCode()')} combining both fields (for example ${c('31 * x + y')} or ${c('Objects.hash(x, y)')}) and a correct ${c('equals')}.</p>
<p>The complexity check inserts a 1000 × 1000 grid and looks every cell up again.</p>`,
    vi: `<p>${c('Cell(x, y)')} là khoá của một ${c('HashMap<Cell, Integer>')} cho lưới. ${c('hashCode()')} khởi đầu trả ${c('x + y')} — hợp lệ (ô bằng nhau có mã bằng nhau), nhưng mọi ô trên một đường chéo phụ chung một ô băm. Hãy viết ${c('hashCode()')} <b>tốt</b> kết hợp cả hai trường (vd ${c('31 * x + y')} hoặc ${c('Objects.hash(x, y)')}) và ${c('equals')} đúng.</p>
<p>Kiểm độ phức tạp chèn lưới 1000 × 1000 rồi tra lại mọi ô.</p>`,
  },
  yeuCau: { en: ['equals and hashCode consistent.', 'Cell does not implement Comparable (HashMap cannot use tree bins to rescue a bad hash).'], vi: ['equals và hashCode nhất quán.', 'Cell không implements Comparable (HashMap không thể dùng cây trong ô để cứu hàm băm tồi).'] },
  dauVao: { en: 'PUT x y v · GET x y · PERF.', vi: 'PUT x y v · GET x y · PERF.' },
  dauRa: { en: 'Map answers / the timing verdict.', vi: 'Câu trả lời của map / kết luận về thời gian.' },
  main: 'KiemTra',
  hen: { n: '1,000,000 cells', ms: 4000, can: 'O(1) average per operation', cham: 'O(√n) or O(n) per operation (x + y or a constant hash)' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        Map<Cell, Integer> m = new HashMap<>();',
      lenh: `                if (p[0].equals("PUT")) {
                    m.put(new Cell(n(1), n(2)), n(3));
                    r = "size " + m.size();
                } else if (p[0].equals("GET")) {
                    r = String.valueOf(m.get(new Cell(n(1), n(2))));
                } else {
                    final Map<Cell, Integer> g = new HashMap<>();
                    final long[] s = new long[1];
                    r = Kiem.hen("1000 x 1000 grid", 4000, new Runnable() {
                        public void run() {
                            for (int x = 0; x < 1000; x++) {
                                for (int y = 0; y < 1000; y++) {
                                    g.put(new Cell(x, y), x ^ y);
                                }
                            }
                            for (int x = 0; x < 1000; x++) {
                                for (int y = 0; y < 1000; y++) {
                                    s[0] += g.get(new Cell(x, y));
                                }
                            }
                        }
                    }) + ", sum " + s[0] + ", equal cells same hash " + (new Cell(3, 4).hashCode() == new Cell(3, 4).hashCode()) + ", (3,4) vs (4,3) different " + (new Cell(3, 4).hashCode() != new Cell(4, 3).hashCode());
                }`,
    }),
  },
  tep: {
    'Cell.java': j`
public final class Cell {
    private final int x, y;

    public Cell(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object o) {
        //>> return o instanceof Cell && ((Cell) o).x == x && ((Cell) o).y == y;
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cell)) {
            return false;
        }
        Cell c = (Cell) o;
        return x == c.x && y == c.y;
        //<<
    }

    @Override
    public int hashCode() {
        //>> return x + y; // TODO: legal, but cells (3,4) and (4,3) and (0,7)... all collide
        return 31 * x + y;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'basic map use', vi: 'dùng map cơ bản' }, vao: 'PUT 1 2 10\nPUT 2 1 20\nPUT 1 2 30\nGET 1 2\nGET 2 1\nGET 3 3\n' },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n' },
  ],
  goiY: [
    { en: 'A good hash makes different cells produce different codes as often as possible: 31·x + y separates (3,4) from (4,3).', vi: 'Hàm băm tốt làm các ô khác nhau cho mã khác nhau thường xuyên nhất có thể: 31·x + y tách (3,4) khỏi (4,3).' },
    { en: 'Keep equals and hashCode based on the same fields.', vi: 'Giữ equals và hashCode dựa trên cùng các trường.' },
  ],
  loiHayGap: [
    { en: 'Keeping x + y: a 1000 × 1000 grid has only 1999 distinct codes — about 500 cells per bucket.', vi: 'Giữ x + y: lưới 1000 × 1000 chỉ có 1999 mã khác nhau — khoảng 500 ô mỗi ô băm.' },
    { en: 'Using x * y: every cell on row 0 or column 0 gets 0.', vi: 'Dùng x * y: mọi ô ở hàng 0 hoặc cột 0 đều ra 0.' },
  ],
  giaiThich: { en: '<p>HashMap is O(1) only if the hash spreads the keys. With x + y each look-up scans a bucket of hundreds of non-comparable keys; with a constant hash it scans everything (O(n)). 31·x + y gives a different code to every cell of the grid.</p>', vi: '<p>HashMap chỉ O(1) khi hàm băm rải đều các khoá. Với x + y mỗi lần tra phải quét một ô có hàng trăm khoá không so sánh được; với hàm băm hằng thì quét tất cả (O(n)). 31·x + y cho mỗi ô của lưới một mã riêng.</p>' },
});

const de3 = deJava({
  id: 'csd201-7-4-open-addressing-set',
  tieuDe: { en: 'An open-addressing int set that grows: no boxing, two million values', vi: 'Tập int địa chỉ mở có nới: không đóng hộp, hai triệu giá trị' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['linear probing in an int[]', 'a sentinel value for "empty"', 'growing at load factor 1/2', 'cache-friendly'],
  moTa: {
    en: `<p>Complete ${c('OpenIntSet')} for any int values except ${c('Integer.MIN_VALUE')} (used as the "empty" marker): ${c('boolean add(int x)')}, ${c('boolean contains(int x)')}, ${c('int size()')}. Use an ${c('int[] slots')} whose length is a power of two (start with 8), the index ${c('mix(x) & (length − 1)')} where ${c('mix')} (given) scrambles the bits, and linear probing. When ${c('size > length / 2')}, double the array and re-insert everything.</p>
<p>The complexity check counts the distinct values of a stream of two million ints.</p>`,
    vi: `<p>Hoàn thiện ${c('OpenIntSet')} cho mọi giá trị int trừ ${c('Integer.MIN_VALUE')} (dùng làm dấu "trống"): ${c('add(x)')}, ${c('contains(x)')}, ${c('size()')}. Dùng ${c('int[] slots')} có độ dài là luỹ thừa của 2 (bắt đầu 8), chỉ số ${c('mix(x) & (length − 1)')} với ${c('mix')} (cho sẵn) xáo trộn các bit, và dò tuyến tính. Khi ${c('size > length / 2')} thì gấp đôi mảng và chèn lại tất cả.</p>
<p>Kiểm độ phức tạp đếm số giá trị khác nhau của một luồng hai triệu số int.</p>`,
  },
  yeuCau: { en: ['No java.util collections (rule R1).', 'Expected O(1) per operation.'], vi: ['Không collection của java.util (luật R1).', 'O(1) kỳ vọng mỗi thao tác.'] },
  dauVao: { en: 'ADD x · HAS x · PERF.', vi: 'ADD x · HAS x · PERF.' },
  dauRa: { en: 'Results, size and capacity.', vi: 'Kết quả, size và sức chứa.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no java.util collections in OpenIntSet', vi: 'không collection của java.util trong OpenIntSet', re: String.raw`\b(HashSet|HashMap|TreeSet|ArrayList|Set|Map|List)\b`, file: 'OpenIntSet' }],
  hen: { n: '2,000,000 values', ms: 4000, can: 'O(1) expected per operation', cham: 'never growing (the table fills up and probing becomes O(n))' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        OpenIntSet t = new OpenIntSet();',
      lenh: `                if (p[0].equals("ADD")) {
                    r = String.valueOf(t.add(n(1)));
                } else if (p[0].equals("HAS")) {
                    r = String.valueOf(t.contains(n(1)));
                } else {
                    final OpenIntSet s = new OpenIntSet();
                    final int[] v = Kiem.ngauNhien(2000000, 1500000, 131);
                    r = Kiem.hen("2,000,000 adds", 4000, new Runnable() {
                        public void run() {
                            for (int x : v) {
                                s.add(x - 700000);
                            }
                        }
                    }) + ", distinct " + s.size();
                }`,
      trangThai: '"size " + t.size() + ", capacity " + ((int[]) Kiem.lay(t, "slots")).length',
    }),
  },
  tep: {
    'OpenIntSet.java': j`
public class OpenIntSet {
    private static final int EMPTY = Integer.MIN_VALUE;
    private int[] slots = newSlots(8);
    private int size = 0;

    private static int[] newSlots(int n) {
        int[] s = new int[n];
        java.util.Arrays.fill(s, EMPTY);
        return s;
    }

    // given: scrambles the bits so that nearby values spread over the table
    private static int mix(int x) {
        int h = x * 0x9E3779B9;
        return h ^ (h >>> 16);
    }

    public int size() {
        return size;
    }

    public boolean contains(int x) {
        //>> return false; // TODO
        int mask = slots.length - 1;
        for (int i = mix(x) & mask; slots[i] != EMPTY; i = (i + 1) & mask) {
            if (slots[i] == x) {
                return true;
            }
        }
        return false;
        //<<
    }

    public boolean add(int x) {
        //>> return false; // TODO
        if (!place(slots, x)) {
            return false;
        }
        size++;
        if (size > slots.length / 2) {
            int[] old = slots;
            slots = newSlots(2 * old.length);
            for (int v : old) {
                if (v != EMPTY) {
                    place(slots, v);
                }
            }
        }
        return true;
        //<<
    }
    //>> // TODO: helper(s)

    // puts x into s (linear probing); false if it was already there
    private static boolean place(int[] s, int x) {
        int mask = s.length - 1;
        int i = mix(x) & mask;
        while (s[i] != EMPTY) {
            if (s[i] == x) {
                return false;
            }
            i = (i + 1) & mask;
        }
        s[i] = x;
        return true;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'growing from 8 slots, negatives and zero', vi: 'nới từ 8 ô, số âm và số 0' }, vao: 'ADD 5\nADD -5\nADD 0\nADD 5\nADD 100\nADD 2147483647\nHAS -5\nHAS 6\nADD 7\nADD 8\nHAS 2147483647\n' },
    { ten: { en: 'many values with the same low bits', vi: 'nhiều giá trị cùng các bit thấp' }, vao: 'ADD 1024\nADD 2048\nADD 4096\nADD 8192\nADD 16384\nADD 32768\nHAS 8192\nHAS 3072\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'With a power-of-two length, "& (length − 1)" is a fast mod that is never negative.', vi: 'Với độ dài là luỹ thừa của 2, "& (length − 1)" là phép mod nhanh và không bao giờ âm.' },
    { en: 'Grow at load 1/2: linear probing slows down sharply as the table fills.', vi: 'Nới khi tải 1/2: dò tuyến tính chậm hẳn khi bảng đầy dần.' },
  ],
  loiHayGap: [
    { en: 'Using 0 as the empty marker — the value 0 can never be stored.', vi: 'Dùng 0 làm dấu trống — giá trị 0 không bao giờ lưu được.' },
    { en: 'Re-inserting during growth through add() — size is counted again.', vi: 'Chèn lại khi nới bằng add() — size bị đếm lại.' },
  ],
  giaiThich: { en: '<p>Primitive open addressing stores the values themselves in one array: no Node objects, no Integer boxing, neighbours in the same cache line. With α ≤ 1/2 the expected probes stay small, and doubling keeps inserts O(1) amortized — the design of fastutil/HPPC sets and of Python’s dict.</p>', vi: '<p>Địa chỉ mở với kiểu nguyên thuỷ lưu chính giá trị trong một mảng: không đối tượng Node, không đóng hộp Integer, các ô kề nhau nằm cùng dòng cache. Với α ≤ 1/2 số lần dò kỳ vọng nhỏ, và gấp đôi giữ phép chèn O(1) khấu hao — thiết kế của tập fastutil/HPPC và dict của Python.</p>' },
});

export default moDun({ slug: 'csd201-load-factor', ten: '7.4 Load factor, rehashing & Java HashMap', de: [de1, de2, de3] });
