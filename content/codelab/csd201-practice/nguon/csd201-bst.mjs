/** CSD201 · 4.4 — Cây nhị phân tìm kiếm: chèn/tìm không trùng (soi hình cây), floor/ceiling/đếm theo khoảng có tỉa nhánh, kiểm một cây có phải BST. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const NODE = j`
// GIVEN — do not change.
class Node {
    int key;
    Node left, right;

    Node(int k) {
        key = k;
    }
}
`;

const de1 = deJava({
  id: 'csd201-4-4-bst-insert-search',
  tieuDe: { en: 'BST insert (no duplicates) and search — iteratively', vi: 'BST: chèn (không trùng) và tìm — bằng vòng lặp' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['BST property', 'insert at a leaf position', 'search in O(h)', 'shape depends on the insertion order'],
  moTa: {
    en: `<p>${c('BST')} has ${c('Node root')}. Complete with <b>loops</b> (the grader builds trees of a million random keys):</p>
<ul><li>${c('boolean insert(int key)')} — walk down from the root (smaller → left, larger → right) and attach a new leaf; a key already present is not inserted (return false);</li>
<li>${c('boolean contains(int key)')};</li>
<li>${c('int size()')} — keep a counter.</li></ul>
<p>After each command the grader prints the SHAPE of your tree from the real ${c('left')}/${c('right')} links (${c('8(3(1,6),10)')}) — so a key attached at the wrong place shows even if contains() works.</p>`,
    vi: `<p>${c('BST')} có ${c('Node root')}. Hoàn thiện bằng <b>vòng lặp</b> (máy chấm dựng cây một triệu khoá ngẫu nhiên): ${c('insert(key)')} — đi từ gốc xuống (nhỏ hơn → trái, lớn hơn → phải) rồi gắn một lá mới; khoá đã có thì không chèn (trả false); ${c('contains(key)')}; ${c('size()')} — giữ một bộ đếm.</p>
<p>Sau mỗi lệnh máy chấm in HÌNH cây từ các liên kết ${c('left')}/${c('right')} thật (${c('8(3(1,6),10)')}) — khoá gắn sai chỗ sẽ lộ ra dù contains() vẫn chạy.</p>`,
  },
  yeuCau: { en: ['Iterative insert and contains.', 'Node is given.'], vi: ['insert và contains bằng vòng lặp.', 'Node cho sẵn.'] },
  dauVao: { en: 'INS k · HAS k · PERF.', vi: 'INS k · HAS k · PERF.' },
  dauRa: { en: 'Result, the shape and the size.', vi: 'Kết quả, hình cây và size.' },
  main: 'KiemTra',
  hen: { n: '1,000,000 random keys, then 1,000,000 searches', ms: 4000, can: 'O(log n) per operation on random input', cham: 'O(n) per operation (scanning all keys)' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        BST t = new BST();',
      lenh: `                if (p[0].equals("INS")) {
                    r = String.valueOf(t.insert(n(1)));
                } else if (p[0].equals("HAS")) {
                    r = String.valueOf(t.contains(n(1)));
                } else {
                    final BST b = new BST();
                    final int[] keys = Kiem.ngauNhien(1000000, 2000000000, 77);
                    final int[] found = new int[1];
                    r = Kiem.hen("1,000,000 inserts + 1,000,000 searches", 4000, new Runnable() {
                        public void run() {
                            for (int k : keys) {
                                b.insert(k);
                            }
                            for (int i = 0; i < keys.length; i++) {
                                if (b.contains(keys[i] + (i % 2))) {
                                    found[0]++;
                                }
                            }
                        }
                    }) + ", size " + b.size() + ", found " + found[0] + ", height " + Kiem.cao(Kiem.lay(b, "root"), "left", "right");
                }`,
      trangThai: 'Kiem.cay(Kiem.lay(t, "root"), "left", "right", "key") + " size=" + t.size()',
    }),
  },
  tep: {
    'Node.java': NODE,
    'BST.java': j`
public class BST {
    private Node root;
    private int size;

    public int size() {
        return size;
    }

    public boolean insert(int key) {
        //>> return false; // TODO
        if (root == null) {
            root = new Node(key);
            size++;
            return true;
        }
        Node p = root;
        while (true) {
            if (key == p.key) {
                return false;
            }
            if (key < p.key) {
                if (p.left == null) {
                    p.left = new Node(key);
                    break;
                }
                p = p.left;
            } else {
                if (p.right == null) {
                    p.right = new Node(key);
                    break;
                }
                p = p.right;
            }
        }
        size++;
        return true;
        //<<
    }

    public boolean contains(int key) {
        //>> return false; // TODO
        Node p = root;
        while (p != null) {
            if (key == p.key) {
                return true;
            }
            p = key < p.key ? p.left : p.right;
        }
        return false;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the textbook tree 8 3 10 1 6 14 4 7 13', vi: 'cây của giáo trình 8 3 10 1 6 14 4 7 13' }, vao: 'INS 8\nINS 3\nINS 10\nINS 1\nINS 6\nINS 14\nINS 4\nINS 7\nINS 13\nINS 6\nHAS 7\nHAS 5\nHAS 13\n' },
    { ten: { en: 'sorted insertions make a chain', vi: 'chèn theo thứ tự tăng tạo ra một chuỗi' }, vao: 'HAS 1\nINS 1\nINS 2\nINS 3\nINS 4\nINS 2\nHAS 4\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Keep p = current node; move left or right until the child on that side is null, then attach the new node there.', vi: 'Giữ p = nút hiện tại; đi trái hoặc phải cho tới khi con bên đó là null, rồi gắn nút mới vào đó.' },
    { en: 'Check key == p.key at every step: that is where duplicates stop.', vi: 'Kiểm key == p.key ở mỗi bước: đó là chỗ khoá trùng bị chặn lại.' },
  ],
  loiHayGap: [
    { en: 'Walking until p == null and then "p = new Node(key)" — the new node is assigned to a local variable, never linked to its parent.', vi: 'Đi tới khi p == null rồi "p = new Node(key)" — nút mới chỉ gán vào biến cục bộ, không bao giờ được nối vào cha.' },
    { en: 'Incrementing size even when the key was a duplicate.', vi: 'Tăng size cả khi khoá bị trùng.' },
  ],
  giaiThich: { en: '<p>Insert and search follow one root-to-leaf path: O(h). For random insertion orders the expected height is about 2.99·log₂ n (≈ 50–60 for a million keys), so both are fast; sorted insertions degrade the tree into a chain (h = n) — the motivation for AVL trees in 4.6.</p>', vi: '<p>Chèn và tìm đi theo một đường gốc–lá: O(h). Với thứ tự chèn ngẫu nhiên, chiều cao kỳ vọng khoảng 2,99·log₂ n (≈ 50–60 với một triệu khoá), nên cả hai đều nhanh; chèn theo thứ tự tăng làm cây suy biến thành chuỗi (h = n) — lý do có cây AVL ở bài 4.6.</p>' },
});

const de2 = deJava({
  id: 'csd201-4-4-floor-ceiling-range',
  tieuDe: { en: 'Floor, ceiling and counting keys in a range — with pruning', vi: 'Floor, ceiling và đếm khoá trong một khoảng — có tỉa nhánh' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['floor = largest key ≤ x', 'ceiling = smallest key ≥ x', 'skip subtrees outside [lo, hi]', 'O(h + k)'],
  moTa: {
    en: `<p>On the given BST (insert is given), complete:</p>
<ul><li>${c('Integer floor(int x)')} and ${c('Integer ceiling(int x)')} — ${c('null')} if none; one root-to-leaf walk each;</li>
<li>${c('int countRange(int lo, int hi)')} — keys with lo ≤ key ≤ hi. Recurse only where keys in the range can be: if ${c('t.key < lo')} the left subtree holds nothing useful; if ${c('t.key > hi')} the right subtree does not either;</li>
<li>${c('String range(int lo, int hi)')} — those keys in increasing order, separated by spaces.</li></ul>
<p>The complexity check asks 200,000 narrow range counts on a tree of a million keys: a full traversal per query is far too slow.</p>`,
    vi: `<p>Trên BST cho sẵn (insert cho sẵn), hoàn thiện: ${c('floor(x)')} và ${c('ceiling(x)')} — không có thì ${c('null')}, mỗi hàm một lượt đi gốc–lá; ${c('countRange(lo, hi)')} — số khoá lo ≤ key ≤ hi, chỉ đệ quy vào nơi có thể chứa khoá trong khoảng: ${c('t.key < lo')} thì cây con trái vô ích, ${c('t.key > hi')} thì cây con phải cũng vậy; ${c('range(lo, hi)')} — các khoá đó theo thứ tự tăng, cách nhau dấu cách.</p>
<p>Kiểm độ phức tạp hỏi 200.000 lần đếm khoảng hẹp trên cây một triệu khoá: duyệt cả cây mỗi lần là quá chậm.</p>`,
  },
  yeuCau: { en: ['floor/ceiling O(h); countRange O(h + number of keys in the range).', 'Do not traverse the whole tree.'], vi: ['floor/ceiling O(h); countRange O(h + số khoá trong khoảng).', 'Không duyệt cả cây.'] },
  dauVao: { en: 'INS keys… · FLOOR x · CEIL x · RANGE lo hi · PERF.', vi: 'INS các khoá… · FLOOR x · CEIL x · RANGE lo hi · PERF.' },
  dauRa: { en: 'The answers.', vi: 'Các câu trả lời.' },
  main: 'KiemTra',
  hen: { n: '1,000,000 keys, 200,000 range queries', ms: 4000, can: 'O(h + k) per query', cham: 'O(n) per query (visiting every node)' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        OrderedBST t = new OrderedBST();',
      lenh: `                if (p[0].equals("INS")) {
                    for (int i = 1; i < p.length; i++) {
                        t.insert(n(i));
                    }
                } else if (p[0].equals("FLOOR")) {
                    r = String.valueOf(t.floor(n(1)));
                } else if (p[0].equals("CEIL")) {
                    r = String.valueOf(t.ceiling(n(1)));
                } else if (p[0].equals("RANGE")) {
                    r = t.countRange(n(1), n(2)) + " [" + t.range(n(1), n(2)) + "]";
                } else {
                    final OrderedBST b = new OrderedBST();
                    for (int k : Kiem.ngauNhien(1000000, 1000000000, 3)) {
                        b.insert(k);
                    }
                    final int[] lo = Kiem.ngauNhien(200000, 999990000, 4);
                    final long[] s = new long[1];
                    r = Kiem.hen("200,000 queries of width 10,000", 4000, new Runnable() {
                        public void run() {
                            for (int x : lo) {
                                s[0] += b.countRange(x, x + 10000);
                            }
                        }
                    }) + ", total " + s[0];
                }`,
    }),
  },
  tep: {
    'Node.java': NODE,
    'OrderedBST.java': j`
public class OrderedBST {
    private Node root;

    public void insert(int key) {
        if (root == null) {
            root = new Node(key);
            return;
        }
        Node p = root;
        while (key != p.key) {
            if (key < p.key) {
                if (p.left == null) {
                    p.left = new Node(key);
                }
                p = p.left;
            } else {
                if (p.right == null) {
                    p.right = new Node(key);
                }
                p = p.right;
            }
        }
    }

    public Integer floor(int x) {
        //>> return null; // TODO
        Integer best = null;
        for (Node p = root; p != null; ) {
            if (p.key == x) {
                return x;
            }
            if (p.key < x) {
                best = p.key; // a candidate; a bigger one may be on the right
                p = p.right;
            } else {
                p = p.left;
            }
        }
        return best;
        //<<
    }

    public Integer ceiling(int x) {
        //>> return null; // TODO
        Integer best = null;
        for (Node p = root; p != null; ) {
            if (p.key == x) {
                return x;
            }
            if (p.key > x) {
                best = p.key;
                p = p.left;
            } else {
                p = p.right;
            }
        }
        return best;
        //<<
    }

    public int countRange(int lo, int hi) {
        //>> return 0; // TODO
        return count(root, lo, hi);
        //<<
    }

    public String range(int lo, int hi) {
        //>> return ""; // TODO
        StringBuilder sb = new StringBuilder();
        collect(root, lo, hi, sb);
        return sb.toString().trim();
        //<<
    }
    //>> // TODO: helper(s)

    private static int count(Node t, int lo, int hi) {
        if (t == null) {
            return 0;
        }
        if (t.key < lo) {
            return count(t.right, lo, hi); // the whole left subtree is < lo
        }
        if (t.key > hi) {
            return count(t.left, lo, hi);
        }
        return 1 + count(t.left, lo, hi) + count(t.right, lo, hi);
    }

    private static void collect(Node t, int lo, int hi, StringBuilder sb) {
        if (t == null) {
            return;
        }
        if (t.key > lo) {
            collect(t.left, lo, hi, sb);
        }
        if (t.key >= lo && t.key <= hi) {
            sb.append(t.key).append(' ');
        }
        if (t.key < hi) {
            collect(t.right, lo, hi, sb);
        }
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'the textbook tree', vi: 'cây của giáo trình' }, vao: 'INS 8 3 10 1 6 14 4 7 13\nFLOOR 5\nFLOOR 8\nFLOOR 0\nCEIL 11\nCEIL 15\nRANGE 4 10\nRANGE 9 9\nRANGE 15 20\n' },
    { ten: { en: 'empty tree and the edges', vi: 'cây rỗng và các biên' }, vao: 'FLOOR 1\nRANGE 0 100\nINS 50 30 70 20 40 60 80\nCEIL 80\nFLOOR 19\nRANGE 30 70\nRANGE 70 30\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'floor: going right past a key smaller than x makes it the best so far; going left never improves it.', vi: 'floor: đi phải qua một khoá nhỏ hơn x thì khoá đó là ứng viên tốt nhất tới giờ; đi trái không bao giờ cải thiện nó.' },
    { en: 'countRange: when t.key < lo, only the right subtree can contain keys in range — one recursive call, not two.', vi: 'countRange: khi t.key < lo, chỉ cây con phải có thể chứa khoá trong khoảng — một lời gọi đệ quy, không phải hai.' },
  ],
  loiHayGap: [
    { en: 'Collecting the whole inorder and filtering — correct but O(n) per query.', vi: 'Gom cả trung thứ tự rồi lọc — đúng nhưng O(n) mỗi truy vấn.' },
    { en: 'Returning int with -1 for "no floor" — -1 can be a real key; that is why the result is Integer/null.', vi: 'Trả int với -1 cho "không có floor" — -1 có thể là khoá thật; vì vậy kết quả là Integer/null.' },
  ],
  giaiThich: { en: '<p>Pruning makes the range query visit only the two boundary paths plus the k nodes inside the range: O(h + k). With h ≈ 50 and k ≈ 10 per query, 200,000 queries need a few hundred million steps at most, while full traversals would need 2·10¹¹. java.util.TreeMap offers the same operations (floorKey, ceilingKey, subMap).</p>', vi: '<p>Tỉa nhánh làm truy vấn khoảng chỉ ghé hai đường biên cộng k nút trong khoảng: O(h + k). Với h ≈ 50 và k ≈ 10 mỗi truy vấn, 200.000 truy vấn tốn vài trăm triệu bước là cùng, còn duyệt cả cây cần 2·10¹¹. java.util.TreeMap có sẵn các thao tác này (floorKey, ceilingKey, subMap).</p>' },
});

const de3 = deJava({
  id: 'csd201-4-4-is-bst',
  tieuDe: { en: 'Is this binary tree a BST? Check every node against its bounds', vi: 'Cây nhị phân này có phải BST? Kiểm mỗi nút theo khoảng cho phép' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['the BST property is global, not parent-child', '(min, max) bounds passed down', 'inorder is strictly increasing'],
  moTa: {
    en: `<p>Complete ${c('static boolean isBST(Node t)')}: true when every key in the left subtree of every node is smaller than the node’s key and every key in its right subtree is larger (no duplicates). Checking only each node against its two children is <b>not enough</b>: in ${c('8(3(1,9),10)')} every parent–child pair is fine, but 9 is in the left subtree of 8.</p>
<p>Pass the allowed range down: ${c('check(t, lo, hi)')} with ${c('long')} bounds (keys may be ${c('Integer.MIN_VALUE')} or ${c('MAX_VALUE')}).</p>`,
    vi: `<p>Hoàn thiện ${c('static boolean isBST(Node t)')}: true khi mọi khoá ở cây con trái của mọi nút nhỏ hơn khoá của nút đó và mọi khoá ở cây con phải lớn hơn (không trùng). Chỉ kiểm mỗi nút với hai con của nó là <b>không đủ</b>: trong ${c('8(3(1,9),10)')} mọi cặp cha–con đều ổn, nhưng 9 nằm trong cây con trái của 8.</p>
<p>Truyền khoảng cho phép xuống dưới: ${c('check(t, lo, hi)')} với cận kiểu ${c('long')} (khoá có thể là ${c('Integer.MIN_VALUE')} hay ${c('MAX_VALUE')}).</p>`,
  },
  yeuCau: { en: ['O(n), one traversal.', 'Empty tree = true.'], vi: ['O(n), một lần duyệt.', 'Cây rỗng = true.'] },
  dauVao: { en: 'One tree per line in level order ("-" for empty children).', vi: 'Mỗi dòng một cây theo tầng ("-" cho con rỗng).' },
  dauRa: { en: 'true or false.', vi: 'true hoặc false.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      them: `
    static Node fromLevels(String[] v) {
        if (v.length == 0 || v[0].equals("-")) {
            return null;
        }
        Node root = new Node(Integer.parseInt(v[0]));
        Queue<Node> q = new ArrayDeque<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < v.length) {
            Node t = q.remove();
            if (!v[i].equals("-")) {
                t.left = new Node(Integer.parseInt(v[i]));
                q.add(t.left);
            }
            if (++i < v.length && !v[i].equals("-")) {
                t.right = new Node(Integer.parseInt(v[i]));
                q.add(t.right);
            }
            i++;
        }
        return root;
    }
`,
      lenh: `                Node t = fromLevels(p);
                r = Kiem.cay(t, "left", "right", "key") + " -> " + Check.isBST(t);`,
    }),
  },
  tep: {
    'Node.java': NODE,
    'Check.java': j`
public class Check {

    static boolean isBST(Node t) {
        //>> return false; // TODO
        return check(t, Long.MIN_VALUE, Long.MAX_VALUE);
        //<<
    }
    //>> // TODO: helper(s)

    // every key of t must be strictly between lo and hi
    private static boolean check(Node t, long lo, long hi) {
        if (t == null) {
            return true;
        }
        if (t.key <= lo || t.key >= hi) {
            return false;
        }
        return check(t.left, lo, t.key) && check(t.right, t.key, hi);
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'a BST, the 9-in-the-wrong-subtree trap, a duplicate', vi: 'một BST, bẫy số 9 sai cây con, một khoá trùng' }, vao: '8 3 10 1 6 - 14\n8 3 10 1 9\n5 5\n2 1 3\n' },
    { ten: { en: 'empty, single, extreme values, deep violation', vi: 'rỗng, một nút, giá trị cực trị, vi phạm ở sâu' }, vao: '-\n7\n-2147483648 - 2147483647\n10 5 15 - - 6 20\n20 10 30 5 15 25 35 - - 12 21\n', an: true },
  ],
  goiY: [
    { en: 'Going left from a node with key k, the upper bound becomes k; going right, the lower bound becomes k.', vi: 'Đi trái từ nút khoá k thì cận trên thành k; đi phải thì cận dưới thành k.' },
    { en: 'Use long bounds starting at Long.MIN_VALUE / Long.MAX_VALUE so that Integer.MIN_VALUE itself is allowed.', vi: 'Dùng cận long bắt đầu từ Long.MIN_VALUE / Long.MAX_VALUE để chính Integer.MIN_VALUE vẫn hợp lệ.' },
  ],
  loiHayGap: [
    { en: 'Comparing each node only with its children — "8 3 10 1 9" is accepted although 9 > 8 sits on the left.', vi: 'Chỉ so mỗi nút với con của nó — "8 3 10 1 9" được chấp nhận dù 9 > 8 nằm bên trái.' },
    { en: 'Using <= / >= the wrong way round — duplicates slip through.', vi: 'Dùng <= / >= ngược chiều — khoá trùng lọt qua.' },
  ],
  giaiThich: { en: '<p>Each node is checked once against the tightest bounds its ancestors impose: O(n). Equivalent check: an inorder traversal of a BST is strictly increasing.</p>', vi: '<p>Mỗi nút được kiểm một lần với cận chặt nhất mà các tổ tiên áp đặt: O(n). Cách kiểm tương đương: duyệt trung thứ tự một BST cho dãy tăng ngặt.</p>' },
});

export default moDun({ slug: 'csd201-bst', ten: '4.4 Binary Search Trees', de: [de1, de2, de3] });
