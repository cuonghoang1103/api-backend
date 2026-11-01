/** CSD201 · 4.2 — Cây nhị phân: tính chất trên cây liên kết, cây trong mảng (chỉ số 2i+1/2i+2, kiểm cây đầy đủ), dựng cây từ tiền thứ tự + trung thứ tự (soi hình cây thật). */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const BNODE = j`
// GIVEN — do not change.
class BNode {
    int info;
    BNode left, right;

    BNode(int x) {
        info = x;
    }
}
`;
// dựng cây từ dãy theo tầng có "-" cho ô trống (như LeetCode)
const TU_TANG = `
    static BNode fromLevels(String[] v, int from) {
        if (from >= v.length || v[from].equals("-")) {
            return null;
        }
        BNode root = new BNode(Integer.parseInt(v[from]));
        java.util.Queue<BNode> q = new java.util.ArrayDeque<>();
        q.add(root);
        int i = from + 1;
        while (!q.isEmpty() && i < v.length) {
            BNode t = q.remove();
            if (i < v.length && !v[i].equals("-")) {
                t.left = new BNode(Integer.parseInt(v[i]));
                q.add(t.left);
            }
            i++;
            if (i < v.length && !v[i].equals("-")) {
                t.right = new BNode(Integer.parseInt(v[i]));
                q.add(t.right);
            }
            i++;
        }
        return root;
    }
`;

const de1 = deJava({
  id: 'csd201-4-2-binary-properties',
  tieuDe: { en: 'Properties of a linked binary tree: size, height, leaves, full and perfect', vi: 'Tính chất của cây nhị phân liên kết: kích thước, chiều cao, lá, cây đầy đủ (full) và hoàn hảo' },
  doKho: 'EASY', phut: 25,
  khaiNiem: ['proper (full) binary tree', 'perfect binary tree', 'n = 2^(h+1) − 1', 'internal vs external nodes'],
  moTa: {
    en: `<p>Complete in ${c('BinTree')}, all recursive on ${c('BNode')} (empty tree = ${c('null')}):</p>
<ul><li>${c('int size(BNode t)')}, ${c('int height(BNode t)')} (empty = −1, one node = 0), ${c('int leaves(BNode t)')};</li>
<li>${c('boolean isProper(BNode t)')} — every node has 0 or 2 children (the textbook’s "proper"/"full" tree; empty = true);</li>
<li>${c('boolean isPerfect(BNode t)')} — proper and every leaf at the same depth; equivalently size = 2^(height+1) − 1.</li></ul>`,
    vi: `<p>Hoàn thiện trong ${c('BinTree')}, tất cả đệ quy trên ${c('BNode')} (cây rỗng = ${c('null')}): ${c('size')}, ${c('height')} (rỗng = −1, một nút = 0), ${c('leaves')}; ${c('isProper')} — mọi nút có 0 hoặc 2 con (cây "proper"/"full" của giáo trình; rỗng = true); ${c('isPerfect')} — proper và mọi lá cùng độ sâu; tương đương size = 2^(height+1) − 1.</p>`,
  },
  yeuCau: { en: ['Recursive.', 'BNode is given.'], vi: ['Đệ quy.', 'BNode cho sẵn.'] },
  dauVao: { en: 'One tree per line in level order, "-" for an empty child (as on LeetCode).', vi: 'Mỗi dòng một cây theo thứ tự tầng, "-" cho con rỗng (như LeetCode).' },
  dauRa: { en: 'size, height, leaves, proper, perfect.', vi: 'size, height, leaves, proper, perfect.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      them: TU_TANG,
      lenh: `                BNode t = fromLevels(p, 0);
                r = "size=" + BinTree.size(t) + " height=" + BinTree.height(t) + " leaves=" + BinTree.leaves(t) + " proper=" + BinTree.isProper(t) + " perfect=" + BinTree.isPerfect(t);`,
    }),
  },
  tep: {
    'BNode.java': BNODE,
    'BinTree.java': j`
public class BinTree {

    static int size(BNode t) {
        //>> return 0; // TODO
        return t == null ? 0 : 1 + size(t.left) + size(t.right);
        //<<
    }

    static int height(BNode t) {
        //>> return 0; // TODO
        return t == null ? -1 : 1 + Math.max(height(t.left), height(t.right));
        //<<
    }

    static int leaves(BNode t) {
        //>> return 0; // TODO
        if (t == null) {
            return 0;
        }
        if (t.left == null && t.right == null) {
            return 1;
        }
        return leaves(t.left) + leaves(t.right);
        //<<
    }

    static boolean isProper(BNode t) {
        //>> return false; // TODO
        if (t == null) {
            return true;
        }
        if ((t.left == null) != (t.right == null)) {
            return false; // exactly one child
        }
        return isProper(t.left) && isProper(t.right);
        //<<
    }

    static boolean isPerfect(BNode t) {
        //>> return false; // TODO
        int h = height(t);
        return size(t) == (1 << (h + 1)) - 1; // also true for the empty tree: 0 == 2^0 - 1
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'perfect, proper but not perfect, neither', vi: 'hoàn hảo, proper nhưng không hoàn hảo, không phải cả hai' }, vao: '1 2 3 4 5 6 7\n1 2 3 4 5\n1 2 3 4\n5\n' },
    { ten: { en: 'empty tree, a chain, a single child', vi: 'cây rỗng, một chuỗi, một con duy nhất' }, vao: '-\n1 2 - 3 - 4\n1 - 2\n1 2 3 - - 4 5\n', an: true },
  ],
  goiY: [
    { en: 'Write each definition with the empty tree as the base case: size(null) = 0, height(null) = −1.', vi: 'Viết mỗi định nghĩa với cây rỗng làm trường hợp cơ sở: size(null) = 0, height(null) = −1.' },
    { en: 'A node with exactly one child: (t.left == null) != (t.right == null).', vi: 'Nút có đúng một con: (t.left == null) != (t.right == null).' },
  ],
  loiHayGap: [
    { en: 'height(null) = 0 — every height is then one too large and isPerfect is wrong.', vi: 'height(null) = 0 — mọi chiều cao đều lớn hơn một và isPerfect sai.' },
    { en: 'Calling a node with one child a leaf.', vi: 'Coi nút có một con là lá.' },
  ],
  giaiThich: { en: '<p>Every function visits each node once: O(n). The textbook facts are visible in the outputs: a proper tree has leaves = internal + 1, a perfect tree of height h has 2^(h+1) − 1 nodes.</p>', vi: '<p>Mỗi hàm ghé mỗi nút một lần: O(n). Các tính chất của giáo trình thấy rõ trong output: cây proper có số lá = số nút trong + 1, cây hoàn hảo cao h có 2^(h+1) − 1 nút.</p>' },
});

const de2 = deJava({
  id: 'csd201-4-2-array-tree',
  tieuDe: { en: 'A binary tree in an array: parent, children, depth, and "is it complete?"', vi: 'Cây nhị phân trong mảng: cha, con, độ sâu, và "có phải cây đầy đủ (complete) không?"' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['level numbering f(p)', 'left 2i+1, right 2i+2, parent (i−1)/2', 'complete binary tree = no hole in the array'],
  moTa: {
    en: `<p>A binary tree stored by level numbering: ${c('Integer[] a')}, ${c('a[0]')} = root, children of index i at ${c('2i + 1')} and ${c('2i + 2')}, ${c('null')} = no node. Complete in ${c('ArrayTree')}:</p>
<ul><li>${c('int parent(int i)')} (−1 for the root), ${c('int depth(int i)')};</li>
<li>${c('String path(Integer[] a, int i)')} — the values from the root down to index i, e.g. ${c('"8 3 6"')};</li>
<li>${c('boolean isComplete(Integer[] a)')} — the tree is complete (every level full except maybe the last, filled from the left) exactly when the used cells have no hole: no ${c('null')} before the last non-null cell. Also check that every non-null cell (except the root) has a non-null parent — otherwise the array is not a valid tree and the answer is false.</li></ul>`,
    vi: `<p>Cây nhị phân lưu theo đánh số tầng: ${c('Integer[] a')}, ${c('a[0]')} = gốc, con của chỉ số i ở ${c('2i + 1')} và ${c('2i + 2')}, ${c('null')} = không có nút. Hoàn thiện trong ${c('ArrayTree')}: ${c('parent(i)')} (gốc thì −1), ${c('depth(i)')}; ${c('path(a, i)')} — các giá trị từ gốc xuống chỉ số i, vd ${c('"8 3 6"')}; ${c('isComplete(a)')} — cây đầy đủ (mọi tầng đầy trừ tầng cuối, tầng cuối dồn trái) đúng khi các ô đã dùng không có lỗ: không có ${c('null')} nào trước ô khác null cuối cùng. Kiểm thêm mọi ô khác null (trừ gốc) có cha khác null — nếu không, mảng không phải cây hợp lệ và trả false.</p>`,
  },
  yeuCau: { en: ['O(1) for parent and depth (depth by halving is fine: O(log i)).', 'path builds from the root down.'], vi: ['parent và depth O(1) (depth bằng cách chia đôi cũng được: O(log i)).', 'path dựng từ gốc xuống.'] },
  dauVao: { en: 'TREE values ("-" = null), then PATH i / INFO i / COMPLETE.', vi: 'TREE các giá trị ("-" = null), rồi PATH i / INFO i / COMPLETE.' },
  dauRa: { en: 'The answers.', vi: 'Các câu trả lời.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        Integer[] a = new Integer[0];',
      lenh: `                if (p[0].equals("TREE")) {
                    a = new Integer[p.length - 1];
                    for (int i = 1; i < p.length; i++) {
                        a[i - 1] = p[i].equals("-") ? null : Integer.valueOf(p[i]);
                    }
                } else if (p[0].equals("PATH")) {
                    r = ArrayTree.path(a, n(1));
                } else if (p[0].equals("INFO")) {
                    r = "parent=" + ArrayTree.parent(n(1)) + " depth=" + ArrayTree.depth(n(1));
                } else {
                    r = String.valueOf(ArrayTree.isComplete(a));
                }`,
    }),
  },
  tep: {
    'ArrayTree.java': j`
public class ArrayTree {

    static int parent(int i) {
        //>> return 0; // TODO
        return i == 0 ? -1 : (i - 1) / 2;
        //<<
    }

    static int depth(int i) {
        //>> return 0; // TODO
        int d = 0;
        while (i > 0) {
            i = (i - 1) / 2;
            d++;
        }
        return d;
        //<<
    }

    static String path(Integer[] a, int i) {
        //>> return ""; // TODO
        String s = String.valueOf(a[i]);
        while (i > 0) {
            i = parent(i);
            s = a[i] + " " + s;
        }
        return s;
        //<<
    }

    static boolean isComplete(Integer[] a) {
        //>> return false; // TODO
        boolean hole = false;
        for (int i = 0; i < a.length; i++) {
            if (a[i] == null) {
                hole = true;
            } else {
                if (hole) {
                    return false; // a node after a hole
                }
                if (i > 0 && a[parent(i)] == null) {
                    return false;
                }
            }
        }
        return true;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a complete tree and the slide’s numbering', vi: 'một cây đầy đủ và cách đánh số của slide' }, vao: 'TREE 8 3 10 1 6 14 4 7 13\nINFO 0\nINFO 4\nINFO 8\nPATH 7\nPATH 6\nCOMPLETE\nTREE 1 2 3 - 5\nCOMPLETE\n' },
    { ten: { en: 'holes, orphans, trailing nulls', vi: 'lỗ, nút mồ côi, null ở cuối' }, vao: 'TREE 1 2 3 4 5 6 - - -\nCOMPLETE\nTREE 1 - 3 - - 6\nCOMPLETE\nTREE 1 2 3 4\nCOMPLETE\nPATH 3\nINFO 3\nTREE 5\nCOMPLETE\n', an: true },
  ],
  goiY: [
    { en: 'depth(i): count how many times you can go to the parent before reaching 0.', vi: 'depth(i): đếm số lần đi lên cha trước khi về 0.' },
    { en: 'isComplete: scan left to right; once you have seen a null, any later non-null cell breaks completeness.', vi: 'isComplete: quét trái sang phải; đã gặp một null thì ô khác null nào phía sau cũng phá tính đầy đủ.' },
  ],
  loiHayGap: [
    { en: 'parent = i / 2 — that is the 1-based formula; with the root at 0 it is (i − 1) / 2.', vi: 'parent = i / 2 — đó là công thức đánh số từ 1; gốc ở 0 thì là (i − 1) / 2.' },
    { en: 'Treating trailing nulls as holes — "1 2 3 4 5 6 - - -" is still complete.', vi: 'Coi các null ở cuối là lỗ — "1 2 3 4 5 6 - - -" vẫn là cây đầy đủ.' },
  ],
  giaiThich: { en: '<p>Level numbering stores a complete tree without any pointer and without wasted cells — this is why heaps use it. For incomplete trees the array may contain many null holes (up to 2ⁿ cells for a chain of n nodes).</p>', vi: '<p>Đánh số theo tầng lưu cây đầy đủ mà không cần con trỏ và không phí ô nào — đó là lý do heap dùng nó. Với cây không đầy đủ, mảng có thể đầy lỗ null (tới 2ⁿ ô cho một chuỗi n nút).</p>' },
});

const de3 = deJava({
  id: 'csd201-4-2-build-pre-in',
  tieuDe: { en: 'Rebuild a binary tree from its preorder and inorder traversals', vi: 'Dựng lại cây nhị phân từ duyệt tiền thứ tự và trung thứ tự' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['preorder: root first', 'inorder: left subtree | root | right subtree', 'a map from value to inorder index'],
  moTa: {
    en: `<p>Complete ${c('static BNode build(int[] pre, int[] in)')} (values are distinct; both arrays describe the same tree). The first preorder value is the root; its position k in the inorder array splits the inorder into the left subtree (k − lo values) and the right subtree — and the preorder continues with exactly that many left-subtree values, then the right subtree.</p>
<p>The grader prints the SHAPE of the tree you linked (${c('root(left,right)')}, ${c('-')} for an empty subtree), then rebuilds a tree of 300,000 nodes: find k with a ${c('HashMap')} (not a scan) to stay O(n).</p>`,
    vi: `<p>Hoàn thiện ${c('static BNode build(int[] pre, int[] in)')} (giá trị khác nhau; hai mảng mô tả cùng một cây). Giá trị đầu của tiền thứ tự là gốc; vị trí k của nó trong mảng trung thứ tự chia trung thứ tự thành cây con trái (k − lo giá trị) và cây con phải — và tiền thứ tự tiếp tục với đúng chừng ấy giá trị của cây con trái, rồi tới cây con phải.</p>
<p>Máy chấm in HÌNH cây bạn đã nối (${c('gốc(trái,phải)')}, ${c('-')} cho cây con rỗng), rồi dựng lại một cây 300.000 nút: tìm k bằng ${c('HashMap')} (không quét) để giữ O(n).</p>`,
  },
  yeuCau: { en: ['O(n) with a value → index map.', 'Recursion depth ≤ tree height (the big test is a balanced tree).'], vi: ['O(n) với bảng giá trị → chỉ số.', 'Độ sâu đệ quy ≤ chiều cao cây (phép thử lớn là cây cân bằng).'] },
  dauVao: { en: 'Lines "pre… | in…"; PERF.', vi: 'Các dòng "tiền… | trung…"; PERF.' },
  dauRa: { en: 'The shape of the rebuilt tree.', vi: 'Hình của cây đã dựng.' },
  main: 'KiemTra',
  hen: { n: '300,000 nodes', ms: 3000, can: 'O(n) with a map', cham: 'O(n²) (scanning the inorder array for every root)' },
  harness: {
    'KiemTra.java': lopKiem({
      them: `
    static int idx;

    // preorder and inorder of the balanced BST on lo..hi
    static void balanced(int lo, int hi, int[] pre) {
        if (lo > hi) {
            return;
        }
        int mid = (lo + hi) >>> 1;
        pre[idx++] = mid;
        balanced(lo, mid - 1, pre);
        balanced(mid + 1, hi, pre);
    }
`,
      lenh: `                if (p[0].equals("PERF")) {
                    final int n = 300000;
                    final int[] pre = new int[n];
                    final int[] in = new int[n];
                    idx = 0;
                    balanced(0, n - 1, pre);
                    for (int i = 0; i < n; i++) {
                        in[i] = i;
                    }
                    final BNode[] t = new BNode[1];
                    r = Kiem.hen("n = 300,000 (balanced)", 3000, new Runnable() {
                        public void run() {
                            t[0] = Rebuild.build(pre, in);
                        }
                    }) + ", root " + (t[0] == null ? "null" : String.valueOf(t[0].info)) + ", height " + Kiem.cao(t[0], "left", "right");
                } else {
                    int bar = Arrays.asList(p).indexOf("|");
                    int[] pre = new int[bar];
                    int[] in = new int[p.length - bar - 1];
                    for (int i = 0; i < bar; i++) {
                        pre[i] = n(i);
                    }
                    for (int i = bar + 1; i < p.length; i++) {
                        in[i - bar - 1] = n(i);
                    }
                    r = Kiem.cay(Rebuild.build(pre, in), "left", "right", "info");
                }`,
    }),
  },
  tep: {
    'BNode.java': BNODE,
    'Rebuild.java': j`
import java.util.HashMap;
import java.util.Map;

public class Rebuild {

    static BNode build(int[] pre, int[] in) {
        //>> return null; // TODO
        Map<Integer, Integer> pos = new HashMap<>();
        for (int i = 0; i < in.length; i++) {
            pos.put(in[i], i);
        }
        return build(pre, 0, in, 0, in.length - 1, pos);
        //<<
    }
    //>> // TODO: helper(s)

    // the subtree whose preorder starts at pre[p] and whose inorder is in[lo..hi]
    private static BNode build(int[] pre, int p, int[] in, int lo, int hi, Map<Integer, Integer> pos) {
        if (lo > hi) {
            return null;
        }
        BNode root = new BNode(pre[p]);
        int k = pos.get(pre[p]);
        int leftSize = k - lo;
        root.left = build(pre, p + 1, in, lo, k - 1, pos);
        root.right = build(pre, p + 1 + leftSize, in, k + 1, hi, pos);
        return root;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'the textbook example and small shapes', vi: 'ví dụ của giáo trình và các hình nhỏ' }, vao: '3 9 20 15 7 | 9 3 15 20 7\n1 2 4 5 3 6 | 4 2 5 1 3 6\n1 | 1\n|\n' },
    { ten: { en: 'chains to the left and to the right', vi: 'chuỗi lệch trái và lệch phải' }, vao: '1 2 3 4 | 4 3 2 1\n1 2 3 4 | 1 2 3 4\n5 3 2 4 8 7 9 | 2 3 4 5 7 8 9\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Recursive helper on (start in preorder, lo..hi in inorder): root = pre[start], k = its inorder index, left subtree = in[lo..k−1] starting at pre[start+1], right = in[k+1..hi] starting at pre[start + 1 + (k − lo)].', vi: 'Hàm phụ đệ quy trên (vị trí bắt đầu trong tiền thứ tự, lo..hi trong trung thứ tự): gốc = pre[start], k = chỉ số trung thứ tự của nó, cây trái = in[lo..k−1] bắt đầu ở pre[start+1], cây phải = in[k+1..hi] bắt đầu ở pre[start + 1 + (k − lo)].' },
    { en: 'Precompute value → inorder index in a HashMap once.', vi: 'Tính trước giá trị → chỉ số trung thứ tự trong HashMap một lần.' },
  ],
  loiHayGap: [
    { en: 'Starting the right subtree at pre[start + 1 + k] instead of pre[start + 1 + (k − lo)] — wrong whenever lo > 0.', vi: 'Cho cây phải bắt đầu ở pre[start + 1 + k] thay vì pre[start + 1 + (k − lo)] — sai mỗi khi lo > 0.' },
    { en: 'Copying sub-arrays (Arrays.copyOfRange) at every call — correct but O(n²) on deep trees and heavy on memory.', vi: 'Chép mảng con (Arrays.copyOfRange) ở mỗi lời gọi — đúng nhưng O(n²) với cây sâu và tốn bộ nhớ.' },
  ],
  giaiThich: { en: '<p>Preorder tells WHICH value is the root; inorder tells HOW MANY values go left. Each node is created once with an O(1) map look-up: O(n). Preorder alone (or postorder alone) is not enough for a general binary tree — that is why exam questions give two traversals.</p>', vi: '<p>Tiền thứ tự cho biết giá trị NÀO là gốc; trung thứ tự cho biết BAO NHIÊU giá trị sang trái. Mỗi nút được tạo một lần với một lần tra bảng O(1): O(n). Chỉ tiền thứ tự (hoặc chỉ hậu thứ tự) không đủ cho cây nhị phân tổng quát — vì vậy đề thi luôn cho hai phép duyệt.</p>' },
});

export default moDun({ slug: 'csd201-cay-nhi-phan', ten: '4.2 Binary trees: properties & two implementations', de: [de1, de2, de3] });
