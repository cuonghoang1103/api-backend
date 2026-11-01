/** CSD201 · 4.3 — Bốn phép duyệt & cây biểu thức: pre/in/post/level, trung thứ tự không đệ quy (cây suy biến 10⁶ nút), cây biểu thức từ hậu tố. */
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
const TU_TANG = `
    static BNode fromLevels(String[] v, int from) {
        if (from >= v.length || v[from].equals("-")) {
            return null;
        }
        BNode root = new BNode(Integer.parseInt(v[from]));
        Queue<BNode> q = new ArrayDeque<>();
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
  id: 'csd201-4-3-four-traversals',
  tieuDe: { en: 'The four traversals of a binary tree: preorder, inorder, postorder, level order', vi: 'Bốn phép duyệt cây nhị phân: tiền, trung, hậu thứ tự và theo tầng' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['visit before / between / after the children', 'breadth-first with a queue'],
  moTa: {
    en: `<p>Complete in ${c('Traversals')} — each appends the visited values to ${c('out')}, each followed by one space:</p>
<ul><li>${c('preOrder')}, ${c('inOrder')}, ${c('postOrder')} — recursive;</li>
<li>${c('levelOrder')} — iterative with a queue (the given BSTree of the PE calls it ${c('breadth')}).</li></ul>
<p>Mind the order of children: left before right in every traversal.</p>`,
    vi: `<p>Hoàn thiện trong ${c('Traversals')} — mỗi hàm nối các giá trị đã thăm vào ${c('out')}, mỗi giá trị kèm một dấu cách: ${c('preOrder')}, ${c('inOrder')}, ${c('postOrder')} — đệ quy; ${c('levelOrder')} — lặp với hàng đợi (BSTree cho sẵn của đề PE gọi nó là ${c('breadth')}). Thứ tự con: trái trước phải ở mọi phép duyệt.</p>`,
  },
  yeuCau: { en: ['levelOrder uses a queue, no recursion.', 'BNode is given.'], vi: ['levelOrder dùng hàng đợi, không đệ quy.', 'BNode cho sẵn.'] },
  dauVao: { en: 'One tree per line in level order with "-" for empty children.', vi: 'Mỗi dòng một cây theo tầng, "-" cho con rỗng.' },
  dauRa: { en: 'The four orders.', vi: 'Bốn thứ tự duyệt.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      them: TU_TANG,
      lenh: `                BNode t = fromLevels(p, 0);
                StringBuilder a = new StringBuilder(), b = new StringBuilder(), c = new StringBuilder(), d = new StringBuilder();
                Traversals.preOrder(t, a);
                Traversals.inOrder(t, b);
                Traversals.postOrder(t, c);
                Traversals.levelOrder(t, d);
                r = "\\n  pre   " + a.toString().trim() + "\\n  in    " + b.toString().trim() + "\\n  post  " + c.toString().trim() + "\\n  level " + d.toString().trim();`,
    }),
  },
  tep: {
    'BNode.java': BNODE,
    'Traversals.java': j`
import java.util.ArrayDeque;
import java.util.Queue;

public class Traversals {

    static void preOrder(BNode t, StringBuilder out) {
        //>> // TODO
        if (t == null) {
            return;
        }
        out.append(t.info).append(' ');
        preOrder(t.left, out);
        preOrder(t.right, out);
        //<<
    }

    static void inOrder(BNode t, StringBuilder out) {
        //>> // TODO
        if (t == null) {
            return;
        }
        inOrder(t.left, out);
        out.append(t.info).append(' ');
        inOrder(t.right, out);
        //<<
    }

    static void postOrder(BNode t, StringBuilder out) {
        //>> // TODO
        if (t == null) {
            return;
        }
        postOrder(t.left, out);
        postOrder(t.right, out);
        out.append(t.info).append(' ');
        //<<
    }

    static void levelOrder(BNode t, StringBuilder out) {
        //>> // TODO: a queue
        if (t == null) {
            return;
        }
        Queue<BNode> q = new ArrayDeque<>();
        q.add(t);
        while (!q.isEmpty()) {
            BNode x = q.remove();
            out.append(x.info).append(' ');
            if (x.left != null) {
                q.add(x.left);
            }
            if (x.right != null) {
                q.add(x.right);
            }
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a full tree and an uneven one', vi: 'một cây đầy và một cây lệch' }, vao: '1 2 3 4 5 6 7\n8 3 10 1 6 - 14 - - 4 7 13\n' },
    { ten: { en: 'empty, single node, chains', vi: 'rỗng, một nút, chuỗi' }, vao: '-\n5\n1 2 - 3 - 4\n1 - 2 - 3\n', an: true },
  ],
  goiY: [
    { en: 'The three depth-first orders have the same code; only the position of the "visit" line changes.', vi: 'Ba thứ tự chiều sâu có cùng một đoạn code; chỉ vị trí dòng "thăm" thay đổi.' },
    { en: 'Level order: enqueue the root; while the queue is not empty, dequeue, visit, enqueue the non-null children (left first).', vi: 'Theo tầng: cho gốc vào hàng; khi hàng chưa rỗng thì lấy ra, thăm, cho các con khác null vào (trái trước).' },
  ],
  loiHayGap: [
    { en: 'Enqueuing null children — the next dequeue crashes on x.info.', vi: 'Cho con null vào hàng — lần lấy ra sau sập ở x.info.' },
    { en: 'Visiting right before left in postorder ("left, right, root" — not "right, left, root").', vi: 'Thăm phải trước trái trong hậu thứ tự ("trái, phải, gốc" — không phải "phải, trái, gốc").' },
  ],
  giaiThich: { en: '<p>All four traversals visit every node once: O(n). The depth-first ones use the call stack (depth = height), level order uses a queue (size up to the widest level).</p>', vi: '<p>Cả bốn phép duyệt ghé mỗi nút một lần: O(n). Ba phép chiều sâu dùng ngăn xếp lời gọi (độ sâu = chiều cao), duyệt theo tầng dùng hàng đợi (dài tới bằng tầng rộng nhất).</p>' },
});

const de2 = deJava({
  id: 'csd201-4-3-inorder-iterative',
  tieuDe: { en: 'Inorder without recursion — on a degenerate tree of a million nodes', vi: 'Trung thứ tự không đệ quy — trên cây suy biến một triệu nút' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['explicit stack', 'go left as far as possible, visit, go right', 'degenerate (list-like) trees'],
  moTa: {
    en: `<p>Complete ${c('static long inorderSum(BNode t, StringBuilder out)')}: walk the tree in inorder <b>without recursion</b> (rule R1) using a ${c('Deque<BNode>')} as a stack; append each value and a space to ${c('out')} when ${c('out != null')}, and return the sum of the values.</p>
<p>The loop: push nodes while going left; when you cannot go left, pop a node, visit it and move to its right child. The grader runs it on a tree where every node only has a left child — a million levels deep, which a recursive inorder cannot handle.</p>`,
    vi: `<p>Hoàn thiện ${c('static long inorderSum(BNode t, StringBuilder out)')}: duyệt cây theo trung thứ tự <b>không đệ quy</b> (luật R1) dùng ${c('Deque<BNode>')} làm ngăn xếp; nối mỗi giá trị và một dấu cách vào ${c('out')} khi ${c('out != null')}, và trả tổng các giá trị.</p>
<p>Vòng lặp: đẩy các nút khi đi sang trái; không đi trái được nữa thì pop một nút, thăm nó rồi chuyển sang con phải. Máy chấm chạy trên cây mà mọi nút chỉ có con trái — sâu một triệu tầng, bản đệ quy không làm nổi.</p>`,
  },
  yeuCau: { en: ['No recursion (rule R1); O(n).', 'Same order as the recursive inorder.'], vi: ['Không đệ quy (luật R1); O(n).', 'Cùng thứ tự với trung thứ tự đệ quy.'] },
  dauVao: { en: 'One tree per line in level order; PERF.', vi: 'Mỗi dòng một cây theo tầng; PERF.' },
  dauRa: { en: 'The inorder and the sum.', vi: 'Thứ tự trung và tổng.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no recursion in Iter', vi: 'không đệ quy trong Iter', rec: 'no', file: 'Iter' }],
  hen: { n: '1,000,000 nodes in a left chain', ms: 3000, can: 'O(n) with an explicit stack', cham: 'recursion (one stack frame per level)', en: 'A recursive inorder throws StackOverflowError.', vi: 'Trung thứ tự đệ quy ném StackOverflowError.' },
  harness: {
    'KiemTra.java': lopKiem({
      them: TU_TANG,
      lenh: `                if (p[0].equals("PERF")) {
                    BNode root = null;
                    for (int i = 1; i <= 1000000; i++) {
                        BNode q = new BNode(i);
                        q.left = root;
                        root = q;
                    }
                    final BNode t = root;
                    final long[] s = new long[1];
                    r = Kiem.hen("left chain of 1,000,000 nodes", 3000, new Runnable() {
                        public void run() {
                            s[0] = Iter.inorderSum(t, null);
                        }
                    }) + ", sum " + s[0];
                } else {
                    StringBuilder out = new StringBuilder();
                    long s = Iter.inorderSum(fromLevels(p, 0), out);
                    r = out.toString().trim() + " | sum " + s;
                }`,
    }),
  },
  tep: {
    'BNode.java': BNODE,
    'Iter.java': j`
import java.util.ArrayDeque;
import java.util.Deque;

public class Iter {

    static long inorderSum(BNode t, StringBuilder out) {
        //>> return 0; // TODO: explicit stack
        Deque<BNode> st = new ArrayDeque<>();
        long sum = 0;
        BNode cur = t;
        while (cur != null || !st.isEmpty()) {
            while (cur != null) { // go left as far as possible
                st.push(cur);
                cur = cur.left;
            }
            cur = st.pop();
            sum += cur.info;
            if (out != null) {
                out.append(cur.info).append(' ');
            }
            cur = cur.right;
        }
        return sum;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'balanced and uneven trees', vi: 'cây cân bằng và cây lệch' }, vao: '4 2 6 1 3 5 7\n8 3 10 1 6 - 14 - - 4 7 13\n-\n' },
    { ten: { en: 'right chain, left chain', vi: 'chuỗi phải, chuỗi trái' }, vao: '1 - 2 - 3 - 4\n4 3 - 2 - 1\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Keep cur = the next node to explore. Inner loop: while cur != null, push it and go left.', vi: 'Giữ cur = nút kế tiếp cần khám phá. Vòng trong: khi cur != null, đẩy nó vào và đi sang trái.' },
    { en: 'Then pop, visit, and set cur = popped.right; the outer loop runs while cur != null or the stack is not empty.', vi: 'Rồi pop, thăm, và gán cur = nút vừa pop .right; vòng ngoài chạy khi cur != null hoặc ngăn xếp chưa rỗng.' },
  ],
  loiHayGap: [
    { en: 'Stopping when the stack is empty while cur still points to a right subtree.', vi: 'Dừng khi ngăn xếp rỗng trong lúc cur vẫn trỏ một cây con phải.' },
    { en: 'Pushing both children like a preorder — that gives preorder, not inorder.', vi: 'Đẩy cả hai con như tiền thứ tự — ra tiền thứ tự, không phải trung thứ tự.' },
  ],
  giaiThich: { en: '<p>The explicit stack holds exactly the ancestors whose left subtree is being processed — the same information as the call stack, but on the heap. Every node is pushed and popped once: O(n) time, O(height) memory.</p>', vi: '<p>Ngăn xếp tường minh giữ đúng các tổ tiên đang xử lý cây con trái — cùng thông tin với ngăn xếp lời gọi, nhưng nằm trên heap. Mỗi nút được đẩy và lấy ra một lần: O(n) thời gian, O(chiều cao) bộ nhớ.</p>' },
});

const de3 = deJava({
  id: 'csd201-4-3-expression-tree',
  tieuDe: { en: 'Expression trees: build from postfix, print infix, evaluate', vi: 'Cây biểu thức: dựng từ hậu tố, in trung tố, tính giá trị' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['operators inside, operands at the leaves', 'building with a stack of subtrees', 'inorder with parentheses'],
  moTa: {
    en: `<p>${c('ENode')} (given) holds a token: an integer or one of ${c('+ - * /')}. Complete in ${c('ExprTree')}:</p>
<ul><li>${c('static ENode fromPostfix(String s)')} — tokens separated by spaces; a number becomes a leaf pushed on a stack of subtrees; an operator pops the right then the left subtree and pushes the new node;</li>
<li>${c('static String infix(ENode t)')} — inorder with every operation in parentheses: ${c('"((3+4)*2)"')}; a leaf prints its number;</li>
<li>${c('static long eval(ENode t)')} — postorder evaluation (integer division).</li></ul>`,
    vi: `<p>${c('ENode')} (cho sẵn) chứa một token: số nguyên hoặc một trong ${c('+ - * /')}. Hoàn thiện trong ${c('ExprTree')}: ${c('fromPostfix(s)')} — token cách nhau dấu cách; số thành lá đẩy vào ngăn xếp các cây con; toán tử pop cây phải rồi cây trái và đẩy nút mới vào; ${c('infix(t)')} — trung thứ tự với mọi phép toán trong ngoặc: ${c('"((3+4)*2)"')}, lá in số của nó; ${c('eval(t)')} — tính theo hậu thứ tự (chia nguyên).</p>`,
  },
  yeuCau: { en: ['Build the tree with a stack of ENode.', 'The grader also prints the shape of your tree.'], vi: ['Dựng cây bằng ngăn xếp các ENode.', 'Máy chấm còn in hình cây của bạn.'] },
  dauVao: { en: 'One postfix expression per line.', vi: 'Mỗi dòng một biểu thức hậu tố.' },
  dauRa: { en: 'The shape, the infix form and the value.', vi: 'Hình cây, dạng trung tố và giá trị.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                ENode t = ExprTree.fromPostfix(line);
                r = Kiem.cay(t, "left", "right", "token") + " | " + ExprTree.infix(t) + " = " + ExprTree.eval(t);`,
    }),
  },
  tep: {
    'ENode.java': j`
// GIVEN — do not change.
class ENode {
    String token;
    ENode left, right;

    ENode(String token, ENode left, ENode right) {
        this.token = token;
        this.left = left;
        this.right = right;
    }
}
`,
    'ExprTree.java': j`
import java.util.ArrayDeque;
import java.util.Deque;

public class ExprTree {

    static ENode fromPostfix(String s) {
        //>> return null; // TODO
        Deque<ENode> st = new ArrayDeque<>();
        for (String tok : s.trim().split("\\s+")) {
            if (tok.length() == 1 && "+-*/".contains(tok)) {
                ENode right = st.pop();
                ENode left = st.pop();
                st.push(new ENode(tok, left, right));
            } else {
                st.push(new ENode(tok, null, null));
            }
        }
        return st.pop();
        //<<
    }

    static String infix(ENode t) {
        //>> return ""; // TODO
        if (t.left == null) {
            return t.token;
        }
        return "(" + infix(t.left) + t.token + infix(t.right) + ")";
        //<<
    }

    static long eval(ENode t) {
        //>> return 0; // TODO
        if (t.left == null) {
            return Long.parseLong(t.token);
        }
        long a = eval(t.left);
        long b = eval(t.right);
        switch (t.token) {
            case "+":
                return a + b;
            case "-":
                return a - b;
            case "*":
                return a * b;
            default:
                return a / b;
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ expressions', vi: 'các biểu thức của slide' }, vao: '3 4 + 2 *\n2 3 4 * +\n5 1 2 + 4 * + 3 -\n7\n' },
    { ten: { en: 'operand order and negatives', vi: 'thứ tự toán hạng và số âm' }, vao: '10 3 -\n10 3 /\n-6 2 / 4 -\n1 2 - 3 - 4 5 * *\n', an: true },
  ],
  goiY: [
    { en: 'The postfix building algorithm is the RPN evaluator of 2.3 with "push a value" replaced by "push a subtree".', vi: 'Thuật toán dựng từ hậu tố chính là bộ tính RPN của bài 2.3, chỉ thay "đẩy một giá trị" bằng "đẩy một cây con".' },
    { en: 'The first pop is the RIGHT operand.', vi: 'Lần pop đầu tiên là toán hạng PHẢI.' },
  ],
  loiHayGap: [
    { en: 'Popping left first — "10 3 -" becomes 3 − 10.', vi: 'Pop trái trước — "10 3 -" thành 3 − 10.' },
    { en: 'Treating "-6" as the minus operator.', vi: 'Coi "-6" là toán tử trừ.' },
  ],
  giaiThich: { en: '<p>The three traversals of the same tree give the three notations: preorder = prefix, inorder (with parentheses) = infix, postorder = postfix. Building and evaluating are both O(n).</p>', vi: '<p>Ba phép duyệt cùng một cây cho ba cách viết: tiền thứ tự = tiền tố, trung thứ tự (có ngoặc) = trung tố, hậu thứ tự = hậu tố. Dựng và tính đều O(n).</p>' },
});

export default moDun({ slug: 'csd201-duyet-cay', ten: '4.3 The four traversals & expression trees', de: [de1, de2, de3] });
