/** CSD201 · 4.6 — Cây AVL: phép quay trái/phải tại một nút, chèn AVL bốn trường hợp (kiểm cân bằng với 10⁶ khoá tăng dần), hệ số cân bằng & kiểm AVL. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const NODE = j`
// GIVEN — do not change.
class Node {
    int key;
    int height; // used by the AVL exercise: a leaf has height 1, null has 0
    Node left, right;

    Node(int k) {
        key = k;
        height = 1;
    }
}
`;
const CHEN = `
    static Node insert(Node t, int k) {
        if (t == null) {
            return new Node(k);
        }
        if (k < t.key) {
            t.left = insert(t.left, k);
        } else if (k > t.key) {
            t.right = insert(t.right, k);
        }
        return t;
    }
`;

const de1 = deJava({
  id: 'csd201-4-6-rotations',
  tieuDe: { en: 'Rotate a node right or left — and keep its parent linked', vi: 'Quay một nút sang phải hoặc trái — và giữ liên kết với cha' },
  doKho: 'MEDIUM', phut: 25, dangBai: 'pe',
  khaiNiem: ['right rotation about the left child', 'left rotation about the right child', 'the middle subtree changes parent'],
  moTa: {
    en: `<p>A PE classic: "let p be the node with key k; if p has a left child, rotate p to the right about it". Complete in ${c('Rotator')} (the BST and its insert are given):</p>
<ul><li>${c('boolean rotateRight(int key)')} — p = node with that key, q = p.left; then ${c('p.left = q.right')}, ${c('q.right = p')}, and q takes p’s place under p’s parent (or becomes the root). Return false if the key is absent or p has no left child;</li>
<li>${c('boolean rotateLeft(int key)')} — the mirror image.</li></ul>
<p>The inorder order never changes; the grader prints the shape after each rotation.</p>`,
    vi: `<p>Câu PE quen thuộc: "gọi p là nút có khoá k; nếu p có con trái thì quay p sang phải quanh nó". Hoàn thiện trong ${c('Rotator')} (BST và insert cho sẵn): ${c('rotateRight(key)')} — p = nút có khoá đó, q = p.left; rồi ${c('p.left = q.right')}, ${c('q.right = p')}, và q thế chỗ p dưới cha của p (hoặc thành gốc); không có khoá hoặc p không có con trái thì trả false; ${c('rotateLeft(key)')} — ảnh gương.</p>
<p>Thứ tự trung không bao giờ đổi; máy chấm in hình cây sau mỗi phép quay.</p>`,
  },
  yeuCau: { en: ['Three link changes per rotation plus the parent link.', 'Node and insert are given.'], vi: ['Ba phép đổi liên kết mỗi lần quay cộng liên kết từ cha.', 'Node và insert cho sẵn.'] },
  dauVao: { en: 'INS keys… · R k · L k.', vi: 'INS các khoá… · R k · L k.' },
  dauRa: { en: 'Result and the shape.', vi: 'Kết quả và hình cây.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        Rotator t = new Rotator();',
      lenh: `                if (p[0].equals("INS")) {
                    for (int i = 1; i < p.length; i++) {
                        t.insert(n(i));
                    }
                } else if (p[0].equals("R")) {
                    r = String.valueOf(t.rotateRight(n(1)));
                } else {
                    r = String.valueOf(t.rotateLeft(n(1)));
                }`,
      trangThai: 'Kiem.cay(Kiem.lay(t, "root"), "left", "right", "key")',
    }),
  },
  tep: {
    'Node.java': NODE,
    'Rotator.java': j`
public class Rotator {
    private Node root;

    public void insert(int key) {
        Node p = root, parent = null;
        while (p != null && p.key != key) {
            parent = p;
            p = key < p.key ? p.left : p.right;
        }
        if (p != null) {
            return;
        }
        Node q = new Node(key);
        if (parent == null) {
            root = q;
        } else if (key < parent.key) {
            parent.left = q;
        } else {
            parent.right = q;
        }
    }

    public boolean rotateRight(int key) {
        //>> return false; // TODO
        return rotate(key, true);
        //<<
    }

    public boolean rotateLeft(int key) {
        //>> return false; // TODO
        return rotate(key, false);
        //<<
    }
    //>> // TODO: helper(s)

    private boolean rotate(int key, boolean right) {
        Node p = root, parent = null;
        while (p != null && p.key != key) {
            parent = p;
            p = key < p.key ? p.left : p.right;
        }
        if (p == null) {
            return false;
        }
        Node q = right ? p.left : p.right;
        if (q == null) {
            return false;
        }
        if (right) {
            p.left = q.right; // the middle subtree changes parent
            q.right = p;
        } else {
            p.right = q.left;
            q.left = p;
        }
        if (parent == null) {
            root = q;
        } else if (parent.left == p) {
            parent.left = q;
        } else {
            parent.right = q;
        }
        return true;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'rotate the root, an inner node, and back', vi: 'quay gốc, một nút bên trong, và quay lại' }, vao: 'INS 8 3 10 1 6 14 4 7 13\nR 8\nL 3\nR 6\nL 10\nL 99\nR 1\n' },
    { ten: { en: 'a chain becomes balanced by rotations', vi: 'một chuỗi thành cân bằng nhờ các phép quay' }, vao: 'INS 1 2 3 4 5 6 7\nL 1\nL 3\nL 2\nL 5\nR 4\n', an: true },
  ],
  goiY: [
    { en: 'Right rotation at p: q = p.left; p.left = q.right; q.right = p. Draw the three subtrees A, B, C to see why B moves.', vi: 'Quay phải tại p: q = p.left; p.left = q.right; q.right = p. Vẽ ba cây con A, B, C để thấy vì sao B đổi chỗ.' },
    { en: 'Remember p’s parent while searching; after the rotation it must point to q.', vi: 'Nhớ cha của p trong lúc tìm; sau khi quay nó phải trỏ tới q.' },
  ],
  loiHayGap: [
    { en: 'Forgetting p.left = q.right — the middle subtree is lost (or a cycle appears).', vi: 'Quên p.left = q.right — cây con ở giữa bị mất (hoặc sinh chu trình).' },
    { en: 'Rotating the root without updating root — the tree "loses" its top.', vi: 'Quay gốc mà không cập nhật root — cây "mất" phần đỉnh.' },
  ],
  giaiThich: { en: '<p>A rotation changes three links, keeps the inorder sequence (A q B p C stays A q B p C) and moves one subtree up and another down by one level. It is O(1) once the node is found — the building block of AVL and red–black trees.</p>', vi: '<p>Một phép quay đổi ba liên kết, giữ nguyên dãy trung thứ tự (A q B p C vẫn là A q B p C) và đưa một cây con lên, một cây con xuống một tầng. Nó O(1) sau khi đã tìm được nút — viên gạch của cây AVL và cây đỏ–đen.</p>' },
});

const de2 = deJava({
  id: 'csd201-4-6-avl-insert',
  tieuDe: { en: 'AVL insertion: the four cases LL, RR, LR, RL', vi: 'Chèn AVL: bốn trường hợp LL, RR, LR, RL' },
  doKho: 'HARD', phut: 40,
  khaiNiem: ['balance factor = h(left) − h(right)', 'single and double rotations', 'updating heights on the way up', 'height ≤ 1.44 log₂ n'],
  moTa: {
    en: `<p>Complete ${c('AVL.insert(int key)')} (duplicates ignored). Insert recursively like a BST; on the way back up update ${c('t.height = 1 + max(h(left), h(right))')} and, if the balance factor becomes ±2, rebalance:</p>
<ul><li>LL (bf = +2, key went left of the left child): rotate right; RR: rotate left;</li>
<li>LR (bf = +2, key went right of the left child): rotate the left child left, then t right; RL: the mirror.</li></ul>
<p>The grader checks the shape after each insertion, then inserts 1, 2, …, 1,000,000 in increasing order — a plain BST becomes a chain of a million (quadratic time), an AVL tree stays about 20 levels high.</p>`,
    vi: `<p>Hoàn thiện ${c('AVL.insert(int key)')} (khoá trùng bỏ qua). Chèn đệ quy như BST; trên đường quay lên cập nhật ${c('t.height = 1 + max(h(trái), h(phải))')} và nếu hệ số cân bằng thành ±2 thì cân bằng lại: LL (bf = +2, khoá đi vào trái của con trái): quay phải; RR: quay trái; LR (bf = +2, khoá đi vào phải của con trái): quay con trái sang trái rồi quay t sang phải; RL: ảnh gương.</p>
<p>Máy chấm kiểm hình cây sau mỗi lần chèn, rồi chèn 1, 2, …, 1.000.000 theo thứ tự tăng — BST thường thành chuỗi một triệu nút (thời gian bậc hai), cây AVL chỉ cao khoảng 20 tầng.</p>`,
  },
  yeuCau: { en: ['Store and update height in each node (h(null) = 0, leaf = 1).', 'O(log n) per insertion.'], vi: ['Lưu và cập nhật height ở mỗi nút (h(null) = 0, lá = 1).', 'O(log n) mỗi lần chèn.'] },
  dauVao: { en: 'INS keys… · PERF.', vi: 'INS các khoá… · PERF.' },
  dauRa: { en: 'The shape and the root height after every key.', vi: 'Hình cây và chiều cao gốc sau mỗi khoá.' },
  main: 'KiemTra',
  hen: { n: '1,000,000 increasing keys', ms: 4000, can: 'O(log n) per insertion', cham: 'O(n) per insertion (an unbalanced BST degenerates into a chain)' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        AVL t = new AVL();',
      lenh: `                if (p[0].equals("INS")) {
                    StringBuilder sb = new StringBuilder();
                    for (int i = 1; i < p.length; i++) {
                        t.insert(n(i));
                        Object root = Kiem.lay(t, "root");
                        sb.append("\\n  +").append(p[i]).append(": ").append(Kiem.cay(root, "left", "right", "key")).append(" h=").append(Kiem.cao(root, "left", "right") + 1);
                    }
                    r = sb.toString();
                } else {
                    final AVL big = new AVL();
                    r = Kiem.hen("insert 1..1,000,000", 4000, new Runnable() {
                        public void run() {
                            for (int i = 1; i <= 1000000; i++) {
                                big.insert(i);
                            }
                        }
                    }) + ", height " + (Kiem.cao(Kiem.lay(big, "root"), "left", "right") + 1);
                }`,
    }),
  },
  tep: {
    'Node.java': NODE,
    'AVL.java': j`
public class AVL {
    private Node root;

    public void insert(int key) {
        //>> // TODO
        root = insert(root, key);
        //<<
    }
    //>> // TODO: helper(s): h, update, rotations, insert(Node, key)

    private static int h(Node t) {
        return t == null ? 0 : t.height;
    }

    private static void update(Node t) {
        t.height = 1 + Math.max(h(t.left), h(t.right));
    }

    private static Node rotateRight(Node p) {
        Node q = p.left;
        p.left = q.right;
        q.right = p;
        update(p);
        update(q);
        return q;
    }

    private static Node rotateLeft(Node p) {
        Node q = p.right;
        p.right = q.left;
        q.left = p;
        update(p);
        update(q);
        return q;
    }

    private static Node insert(Node t, int key) {
        if (t == null) {
            return new Node(key);
        }
        if (key < t.key) {
            t.left = insert(t.left, key);
        } else if (key > t.key) {
            t.right = insert(t.right, key);
        } else {
            return t;
        }
        update(t);
        int bf = h(t.left) - h(t.right);
        if (bf > 1) {
            if (key > t.left.key) {
                t.left = rotateLeft(t.left); // LR
            }
            return rotateRight(t); // LL
        }
        if (bf < -1) {
            if (key < t.right.key) {
                t.right = rotateRight(t.right); // RL
            }
            return rotateLeft(t); // RR
        }
        return t;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'the four cases one by one', vi: 'bốn trường hợp lần lượt' }, vao: 'INS 3 2 1\nINS 4 5\nINS 7 6\nINS 0 -1\n' },
    { ten: { en: 'the slides’ sequence and duplicates', vi: 'chuỗi của slide và khoá trùng' }, vao: 'INS 50 25 10 5 7 3 30 20 8 15\nINS 7 50\n', an: true },
    { ten: { en: 'complexity check (increasing keys)', vi: 'kiểm độ phức tạp (khoá tăng dần)' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Insert returns the (possibly new) root of the subtree: t.left = insert(t.left, key). After the call, update the height and test the balance factor.', vi: 'insert trả gốc (có thể mới) của cây con: t.left = insert(t.left, key). Sau lời gọi, cập nhật height và kiểm hệ số cân bằng.' },
    { en: 'bf = +2 and key < t.left.key → LL (one right rotation); bf = +2 and key > t.left.key → LR (left then right).', vi: 'bf = +2 và key < t.left.key → LL (một lần quay phải); bf = +2 và key > t.left.key → LR (quay trái rồi quay phải).' },
  ],
  loiHayGap: [
    { en: 'Updating heights in the wrong order after a rotation — update the lower node (p) before the new top (q).', vi: 'Cập nhật chiều cao sai thứ tự sau khi quay — cập nhật nút ở dưới (p) trước nút mới ở trên (q).' },
    { en: 'Using a single rotation for the LR/RL zig-zag — the tree stays unbalanced (the mirror zig-zag appears).', vi: 'Dùng một lần quay cho zig-zag LR/RL — cây vẫn mất cân bằng (xuất hiện zig-zag ngược).' },
  ],
  giaiThich: { en: '<p>An insertion changes heights only along its path, and at most one (single or double) rotation restores the balance of the lowest unbalanced ancestor — after it the subtree has its old height again. The AVL property bounds the height by about 1.44·log₂ n, so every operation is O(log n): 10⁶ increasing keys give a tree of height 20.</p>', vi: '<p>Một lần chèn chỉ đổi chiều cao dọc đường đi của nó, và tối đa một phép quay (đơn hoặc kép) khôi phục cân bằng của tổ tiên mất cân bằng thấp nhất — sau đó cây con trở lại chiều cao cũ. Tính chất AVL chặn chiều cao khoảng 1,44·log₂ n, nên mọi thao tác O(log n): 10⁶ khoá tăng dần cho cây cao 20.</p>' },
});

const de3 = deJava({
  id: 'csd201-4-6-balance-factors',
  tieuDe: { en: 'Balance factors: is it an AVL tree, and which node breaks it?', vi: 'Hệ số cân bằng: có phải cây AVL không, nút nào phá vỡ nó?' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['computing heights bottom-up once', 'balance factor in {−1, 0, +1}', 'the deepest unbalanced node'],
  moTa: {
    en: `<p>Given a BST (built by the grader, heights not stored), complete in ${c('AvlCheck')}:</p>
<ul><li>${c('String factors(Node t)')} — the keys in inorder, each as ${c('key:bf')} with bf = height(left) − height(right) (empty subtree height 0), separated by spaces;</li>
<li>${c('boolean isAVL(Node t)')} — every |bf| ≤ 1, computed in <b>one</b> postorder pass (return the height, or −1 as soon as a subtree is unbalanced) — not by calling a height function at every node.</li></ul>`,
    vi: `<p>Cho một BST (máy chấm dựng, không lưu chiều cao), hoàn thiện trong ${c('AvlCheck')}: ${c('factors(t)')} — các khoá theo trung thứ tự, mỗi khoá dạng ${c('key:bf')} với bf = height(trái) − height(phải) (cây con rỗng cao 0), cách nhau dấu cách; ${c('isAVL(t)')} — mọi |bf| ≤ 1, tính trong <b>một</b> lượt hậu thứ tự (trả chiều cao, hoặc −1 ngay khi một cây con mất cân bằng) — không gọi hàm chiều cao ở từng nút.</p>`,
  },
  yeuCau: { en: ['isAVL in O(n) (the big test is a balanced tree of 2²⁰ − 1 nodes).', 'factors may be O(n log n) or O(n).'], vi: ['isAVL O(n) (phép thử lớn là cây cân bằng 2²⁰ − 1 nút).', 'factors được phép O(n log n) hoặc O(n).'] },
  dauVao: { en: 'Lines with keys in insertion order; PERF.', vi: 'Các dòng khoá theo thứ tự chèn; PERF.' },
  dauRa: { en: 'Balance factors and the verdict.', vi: 'Các hệ số cân bằng và kết luận.' },
  main: 'KiemTra',
  hen: { n: '1,048,575 nodes, checked 20 times', ms: 4000, can: 'O(n) per check', cham: 'O(n log n) or worse (height recomputed at every node)' },
  harness: {
    'KiemTra.java': lopKiem({
      them: CHEN + `
    static Node perfect(int lo, int hi) {
        if (lo > hi) {
            return null;
        }
        int mid = (lo + hi) >>> 1;
        Node t = new Node(mid);
        t.left = perfect(lo, mid - 1);
        t.right = perfect(mid + 1, hi);
        return t;
    }
`,
      lenh: `                if (p[0].equals("PERF")) {
                    final Node t = perfect(1, (1 << 20) - 1);
                    final boolean[] ok = {true};
                    r = Kiem.hen("isAVL x 20 on 1,048,575 nodes", 4000, new Runnable() {
                        public void run() {
                            for (int i = 0; i < 20; i++) {
                                ok[0] &= AvlCheck.isAVL(t);
                            }
                        }
                    }) + ", " + ok[0];
                } else {
                    Node t = null;
                    for (int i = 0; i < p.length; i++) {
                        t = insert(t, n(i));
                    }
                    r = AvlCheck.factors(t) + " | AVL=" + AvlCheck.isAVL(t);
                }`,
    }),
  },
  tep: {
    'Node.java': NODE,
    'AvlCheck.java': j`
public class AvlCheck {

    static String factors(Node t) {
        //>> return ""; // TODO
        StringBuilder sb = new StringBuilder();
        walk(t, sb);
        return sb.toString().trim();
        //<<
    }

    static boolean isAVL(Node t) {
        //>> return false; // TODO: one postorder pass
        return checked(t) >= 0;
        //<<
    }
    //>> // TODO: helper(s)

    private static int height(Node t) {
        return t == null ? 0 : 1 + Math.max(height(t.left), height(t.right));
    }

    // fills sb in inorder and returns the height of t
    private static int walk(Node t, StringBuilder sb) {
        if (t == null) {
            return 0;
        }
        int hl = walk(t.left, sb);
        int hr = height(t.right);
        sb.append(t.key).append(':').append(hl - hr).append(' ');
        walk(t.right, sb);
        return 1 + Math.max(hl, hr);
    }

    // height of t, or -1 if some subtree is unbalanced
    private static int checked(Node t) {
        if (t == null) {
            return 0;
        }
        int hl = checked(t.left);
        if (hl < 0) {
            return -1;
        }
        int hr = checked(t.right);
        if (hr < 0 || Math.abs(hl - hr) > 1) {
            return -1;
        }
        return 1 + Math.max(hl, hr);
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'balanced and unbalanced trees', vi: 'cây cân bằng và mất cân bằng' }, vao: '8 3 10 1 6 14 4 7 13\n2 1 3\n1 2 3\n5 3 8 2 4 7 9 1\n' },
    { ten: { en: 'single node, zig-zag, deep imbalance under a balanced root', vi: 'một nút, zig-zag, mất cân bằng sâu dưới gốc cân bằng' }, vao: '7\n3 1 2\n50 30 70 20 40 60 80 10 5\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'One recursive function can return the height and signal "unbalanced" with −1; check |hl − hr| after both children are known.', vi: 'Một hàm đệ quy có thể trả chiều cao và báo "mất cân bằng" bằng −1; kiểm |hl − hr| khi đã biết cả hai con.' },
    { en: 'Calling height(t.left) and height(t.right) at every node recomputes the same heights again and again — O(n log n) even on balanced trees, O(n²) on chains.', vi: 'Gọi height(t.left) và height(t.right) ở mọi nút tính đi tính lại cùng các chiều cao — O(n log n) ngay cả với cây cân bằng, O(n²) với chuỗi.' },
  ],
  loiHayGap: [
    { en: 'Checking only the root’s balance factor — "50 30 70 20 40 60 80 10 5" has a balanced root but node 20 is unbalanced.', vi: 'Chỉ kiểm hệ số cân bằng của gốc — "50 30 70 20 40 60 80 10 5" có gốc cân bằng nhưng nút 20 mất cân bằng.' },
    { en: 'Counting the height of a leaf as 0 while an empty subtree is also 0 — the factors are then off by one.', vi: 'Tính chiều cao lá là 0 trong khi cây rỗng cũng 0 — các hệ số lệch một.' },
  ],
  giaiThich: { en: '<p>Postorder is the natural order for anything computed from the children: one pass returns heights bottom-up and checks each balance factor where both heights are known — O(n). The early −1 also stops the work as soon as an imbalance is found.</p>', vi: '<p>Hậu thứ tự là thứ tự tự nhiên cho mọi thứ tính từ các con: một lượt trả chiều cao từ dưới lên và kiểm từng hệ số cân bằng khi đã biết cả hai chiều cao — O(n). Giá trị −1 sớm còn dừng công việc ngay khi phát hiện mất cân bằng.</p>' },
});

export default moDun({ slug: 'csd201-avl', ten: '4.6 AVL trees: the four rotations', de: [de1, de2, de3] });
