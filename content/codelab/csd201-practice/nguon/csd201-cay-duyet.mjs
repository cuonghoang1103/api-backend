/** CSD201 · 4.1 — Cây tổng quát & phép duyệt: kích thước/chiều cao/độ sâu, dung lượng thư mục (hậu thứ tự), in theo tầng. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const TNODE = j`
import java.util.ArrayList;
import java.util.List;

// GIVEN — do not change. A node of a general tree: any number of children, in order.
class TNode {
    String name;
    int size; // own size (used by the folder exercise)
    List<TNode> children = new ArrayList<>();

    TNode(String name, int size) {
        this.name = name;
        this.size = size;
    }
}
`;
// lớp kiểm dựng cây từ các dòng "cha con [cỡ]" (dòng đầu: "ROOT tên [cỡ]")
const DUNG_CAY = `
    static Map<String, TNode> byName = new HashMap<>();
    static TNode root;

    static void add(String[] q) {
        TNode t = new TNode(q[1], q.length > 2 ? Integer.parseInt(q[2]) : 0);
        byName.put(q[1], t);
        if (q[0].equals("ROOT")) {
            root = t;
        } else {
            byName.get(q[0]).children.add(t);
        }
    }
`;

const de1 = deJava({
  id: 'csd201-4-1-tree-measures',
  tieuDe: { en: 'A general tree: size, height and the depth of a node', vi: 'Cây tổng quát: kích thước, chiều cao và độ sâu của một nút' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['size(T) = 1 + Σ size(children)', 'height = 1 + max height of children (leaf = 0)', 'depth = edges from the root'],
  moTa: {
    en: `<p>${c('TNode')} (given) has a name and a list of children. Complete in ${c('Trees')}:</p>
<ul><li>${c('int size(TNode t)')} — number of nodes of the subtree;</li>
<li>${c('int height(TNode t)')} — a leaf has height 0;</li>
<li>${c('int depth(TNode root, String name)')} — the number of edges from the root to the node with that name, −1 if absent;</li>
<li>${c('int leaves(TNode t)')}.</li></ul>
<p>All are recursive over the children: the textbook definitions translate line by line.</p>`,
    vi: `<p>${c('TNode')} (cho sẵn) có tên và danh sách con. Hoàn thiện trong ${c('Trees')}: ${c('size(t)')} — số nút của cây con; ${c('height(t)')} — lá có chiều cao 0; ${c('depth(root, name)')} — số cạnh từ gốc tới nút có tên đó, không có thì −1; ${c('leaves(t)')}.</p>
<p>Tất cả đệ quy trên các con: định nghĩa của giáo trình chuyển thành code từng dòng.</p>`,
  },
  yeuCau: { en: ['Recursive definitions over children.', 'TNode is given.'], vi: ['Định nghĩa đệ quy trên các con.', 'TNode cho sẵn.'] },
  dauVao: { en: 'ROOT name, then "parent child" lines; queries Q name.', vi: 'ROOT tên, rồi các dòng "cha con"; truy vấn Q tên.' },
  dauRa: { en: 'size, height, leaves of the tree and of each queried subtree, and its depth.', vi: 'size, height, leaves của cây và của từng cây con được hỏi, và độ sâu của nó.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      them: DUNG_CAY,
      lenh: `                if (p[0].equals("Q")) {
                    TNode t = byName.get(p[1]);
                    r = "size=" + Trees.size(t) + " height=" + Trees.height(t) + " leaves=" + Trees.leaves(t) + " depth=" + Trees.depth(root, p[1]);
                } else if (p[0].equals("DEPTH")) {
                    r = String.valueOf(Trees.depth(root, p[1]));
                } else {
                    add(p);
                }`,
    }),
  },
  tep: {
    'TNode.java': TNODE,
    'Trees.java': j`
public class Trees {

    static int size(TNode t) {
        //>> return 0; // TODO
        int s = 1;
        for (TNode c : t.children) {
            s += size(c);
        }
        return s;
        //<<
    }

    static int height(TNode t) {
        //>> return 0; // TODO
        int h = -1;
        for (TNode c : t.children) {
            h = Math.max(h, height(c));
        }
        return h + 1; // a leaf: -1 + 1 = 0
        //<<
    }

    static int leaves(TNode t) {
        //>> return 0; // TODO
        if (t.children.isEmpty()) {
            return 1;
        }
        int n = 0;
        for (TNode c : t.children) {
            n += leaves(c);
        }
        return n;
        //<<
    }

    static int depth(TNode root, String name) {
        //>> return -1; // TODO
        if (root.name.equals(name)) {
            return 0;
        }
        for (TNode c : root.children) {
            int d = depth(c, name);
            if (d >= 0) {
                return d + 1;
            }
        }
        return -1;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the textbook organisation chart', vi: 'sơ đồ tổ chức của giáo trình' }, vao: 'ROOT Electronics\nElectronics R&D\nElectronics Sales\nElectronics Purchasing\nElectronics Manufacturing\nSales Domestic\nSales International\nInternational Canada\nInternational S.America\nInternational Overseas\nOverseas Africa\nOverseas Europe\nOverseas Asia\nOverseas Australia\nManufacturing TV\nManufacturing CD\nManufacturing Tuner\nQ Electronics\nQ Sales\nQ Overseas\nQ Tuner\nDEPTH Asia\nDEPTH Nobody\n' },
    { ten: { en: 'a single node, a chain', vi: 'một nút, một chuỗi' }, vao: 'ROOT a\nQ a\na b\nb c\nc d\nQ a\nQ c\nDEPTH d\n', an: true },
  ],
  goiY: [
    { en: 'height: the maximum height among the children plus one; start the maximum at −1 so that a leaf gets 0.', vi: 'height: chiều cao lớn nhất của các con cộng một; khởi tạo max = −1 để lá có chiều cao 0.' },
    { en: 'depth: search the children; when a child returns d ≥ 0 the answer is d + 1.', vi: 'depth: tìm trong các con; khi một con trả về d ≥ 0 thì đáp án là d + 1.' },
  ],
  loiHayGap: [
    { en: 'Counting a leaf’s height as 1 — the textbook counts edges (a leaf is 0).', vi: 'Tính chiều cao lá là 1 — giáo trình đếm cạnh (lá là 0).' },
    { en: 'depth returning the first child’s result even when it is −1 — the search stops before finding the node.', vi: 'depth trả kết quả của con đầu tiên kể cả khi là −1 — dừng tìm trước khi gặp nút.' },
  ],
  giaiThich: { en: '<p>Each function visits every node of the subtree once: O(n). The recursive structure of the definitions (a tree is a node plus a list of trees) is why tree algorithms are almost always recursive.</p>', vi: '<p>Mỗi hàm ghé mọi nút của cây con một lần: O(n). Cấu trúc đệ quy của định nghĩa (cây là một nút cộng danh sách các cây) là lý do thuật toán trên cây gần như luôn đệ quy.</p>' },
});

const de2 = deJava({
  id: 'csd201-4-1-folder-sizes',
  tieuDe: { en: 'Disk usage of a folder tree: a postorder traversal', vi: 'Dung lượng cây thư mục: một phép duyệt hậu thứ tự' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['postorder: children before the parent', 'returning a value up the tree', 'indented listing'],
  moTa: {
    en: `<p>Every node is a file or folder with its own ${c('size')}. Complete ${c('static long du(TNode t, int depth, StringBuilder out)')} — like the Unix ${c('du')} command of the textbook: return the total size of the subtree and append one line per node <b>after</b> its children (postorder): two spaces per depth level, then ${c('name total')}.</p>
<pre>    a.txt 30
    b.txt 50
  docs 85      (5 + 30 + 50)
  x.jpg 200
/ 290          (0 + 85 + 200 + 5)</pre>`,
    vi: `<p>Mỗi nút là một tệp hoặc thư mục với ${c('size')} riêng. Hoàn thiện ${c('static long du(TNode t, int depth, StringBuilder out)')} — như lệnh ${c('du')} của Unix trong giáo trình: trả tổng dung lượng cây con và nối một dòng cho mỗi nút <b>sau</b> các con của nó (hậu thứ tự): hai dấu cách cho mỗi tầng sâu, rồi ${c('tên tổng')} (xem ví dụ).</p>`,
  },
  yeuCau: { en: ['One postorder traversal.', 'Totals in long.'], vi: ['Một lần duyệt hậu thứ tự.', 'Tổng kiểu long.'] },
  dauVao: { en: 'ROOT name size, then "parent child size" lines, then DU.', vi: 'ROOT tên cỡ, rồi các dòng "cha con cỡ", rồi DU.' },
  dauRa: { en: 'The postorder listing and the total.', vi: 'Danh sách hậu thứ tự và tổng.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      them: DUNG_CAY,
      lenh: `                if (p[0].equals("DU")) {
                    StringBuilder out = new StringBuilder();
                    long total = Folders.du(root, 0, out);
                    r = "total " + total + "\\n" + out.toString().replaceAll("\\\\s+$", "");
                } else {
                    add(p);
                }`,
    }),
  },
  tep: {
    'TNode.java': TNODE,
    'Folders.java': j`
public class Folders {

    static long du(TNode t, int depth, StringBuilder out) {
        //>> return 0; // TODO: children first, then this line
        long total = t.size;
        for (TNode c : t.children) {
            total += du(c, depth + 1, out);
        }
        for (int i = 0; i < depth; i++) {
            out.append("  ");
        }
        out.append(t.name).append(' ').append(total).append('\n');
        return total;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the small example', vi: 'ví dụ nhỏ' }, vao: 'ROOT / 5\n/ docs 5\ndocs a.txt 30\ndocs b.txt 50\n/ x.jpg 200\nDU\n' },
    { ten: { en: 'the textbook’s /user/rt/courses tree', vi: 'cây /user/rt/courses của giáo trình' }, vao: 'ROOT courses 1\ncourses cs016 2\ncs016 grades 8\ncs016 homeworks 1\nhomeworks hw1 3\nhomeworks hw2 2\nhomeworks hw3 4\ncs016 programs 1\nprograms pr1 57\nprograms pr2 97\nprograms pr3 74\ncourses cs252 1\ncs252 projects 1\nprojects papers 1\npapers buylow 26\npapers sellhigh 55\nprojects demos 1\ndemos market 4786\ncs252 grades2 3\nDU\n', an: true },
  ],
  goiY: [
    { en: 'total = own size + du(child) for every child — the children’s lines are appended during those calls, i.e. before yours.', vi: 'tổng = cỡ riêng + du(con) cho mọi con — dòng của các con được nối trong những lời gọi đó, tức trước dòng của bạn.' },
    { en: 'Append your own line after the loop over the children.', vi: 'Nối dòng của chính mình sau vòng lặp qua các con.' },
  ],
  loiHayGap: [
    { en: 'Appending the line before visiting the children — that is preorder; the totals are not known yet.', vi: 'Nối dòng trước khi thăm các con — đó là tiền thứ tự; khi đó chưa biết tổng.' },
    { en: 'Forgetting the node’s own size (a folder entry also uses space).', vi: 'Quên cỡ riêng của nút (mục thư mục cũng chiếm chỗ).' },
  ],
  giaiThich: { en: '<p>A folder’s total is only known once all its children are known, so the computation is naturally postorder: each node is visited once, O(n). This is exactly what du, the Windows folder properties dialog and garbage collectors (marking) do.</p>', vi: '<p>Tổng của thư mục chỉ biết khi đã biết mọi con, nên phép tính tự nhiên là hậu thứ tự: mỗi nút ghé một lần, O(n). Đây đúng là việc du, hộp thoại Properties của thư mục trên Windows và bộ thu gom rác (bước đánh dấu) làm.</p>' },
});

const de3 = deJava({
  id: 'csd201-4-1-level-order',
  tieuDe: { en: 'Print a general tree level by level (breadth-first)', vi: 'In cây tổng quát theo từng tầng (duyệt theo chiều rộng)' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['breadth-first traversal with a queue', 'processing one level at a time', 'the widest level'],
  moTa: {
    en: `<p>Complete ${c('static List<String> levels(TNode root)')}: one string per level, the names of that level from left to right separated by spaces. Use a queue: at the start of each round the queue holds exactly one level — remember its size, dequeue that many nodes, enqueue their children.</p>
<p>Also complete ${c('static int widest(TNode root)')} — the number of nodes on the widest level.</p>`,
    vi: `<p>Hoàn thiện ${c('static List<String> levels(TNode root)')}: mỗi tầng một chuỗi, tên các nút của tầng đó từ trái sang phải cách nhau dấu cách. Dùng hàng đợi: đầu mỗi vòng, hàng đợi chứa đúng một tầng — nhớ kích thước, lấy ra đúng chừng đó nút, thêm các con của chúng vào.</p>
<p>Hoàn thiện thêm ${c('static int widest(TNode root)')} — số nút của tầng rộng nhất.</p>`,
  },
  yeuCau: { en: ['Iterative with a queue (rule R1: no recursion).', 'O(n).'], vi: ['Lặp với hàng đợi (luật R1: không đệ quy).', 'O(n).'] },
  dauVao: { en: 'ROOT name, "parent child" lines, then LEVELS.', vi: 'ROOT tên, các dòng "cha con", rồi LEVELS.' },
  dauRa: { en: 'The levels and the width.', vi: 'Các tầng và độ rộng.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no recursion in Bfs', vi: 'không đệ quy trong Bfs', rec: 'no', file: 'Bfs' }],
  harness: {
    'KiemTra.java': lopKiem({
      them: DUNG_CAY,
      lenh: `                if (p[0].equals("LEVELS")) {
                    r = Bfs.levels(root) + " widest=" + Bfs.widest(root);
                } else {
                    add(p);
                }`,
    }),
  },
  tep: {
    'TNode.java': TNODE,
    'Bfs.java': j`
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public class Bfs {

    static List<String> levels(TNode root) {
        //>> return new ArrayList<>(); // TODO
        List<String> out = new ArrayList<>();
        Queue<TNode> q = new ArrayDeque<>();
        q.add(root);
        while (!q.isEmpty()) {
            int k = q.size(); // exactly one level is in the queue now
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < k; i++) {
                TNode t = q.remove();
                sb.append(i > 0 ? " " : "").append(t.name);
                q.addAll(t.children);
            }
            out.add(sb.toString());
        }
        return out;
        //<<
    }

    static int widest(TNode root) {
        //>> return 0; // TODO
        int best = 0;
        for (String level : levels(root)) {
            best = Math.max(best, level.split(" ").length);
        }
        return best;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'three levels', vi: 'ba tầng' }, vao: 'ROOT A\nA B\nA C\nA D\nB E\nB F\nD G\nD H\nD I\nLEVELS\n' },
    { ten: { en: 'a chain, a single node, a wide fan', vi: 'một chuỗi, một nút, một hình quạt rộng' }, vao: 'ROOT r\nr a\na b\nb c\nr x\nr y\nr z\nLEVELS\n', an: true },
  ],
  goiY: [
    { en: 'int k = q.size() at the start of a round — the queue may grow during the round, but only k nodes belong to this level.', vi: 'int k = q.size() ở đầu vòng — hàng đợi có thể dài thêm trong vòng, nhưng chỉ k nút thuộc tầng này.' },
    { en: 'q.addAll(t.children) keeps the left-to-right order.', vi: 'q.addAll(t.children) giữ thứ tự trái sang phải.' },
  ],
  loiHayGap: [
    { en: 'Using a stack — that gives a depth-first order, not levels.', vi: 'Dùng ngăn xếp — ra thứ tự chiều sâu, không phải theo tầng.' },
    { en: 'Calling q.size() in the for-condition — the level boundary moves while you add children.', vi: 'Gọi q.size() trong điều kiện for — ranh giới tầng dịch chuyển khi thêm con.' },
  ],
  giaiThich: { en: '<p>The queue releases nodes in the order they were discovered, and a node is discovered only after every node of the previous level: breadth-first order. Each node enters and leaves the queue once: O(n).</p>', vi: '<p>Hàng đợi trả các nút theo thứ tự được phát hiện, và một nút chỉ được phát hiện sau mọi nút của tầng trước: thứ tự chiều rộng. Mỗi nút vào và ra hàng đợi một lần: O(n).</p>' },
});

export default moDun({ slug: 'csd201-cay-duyet', ten: '4.1 Trees & traversals', de: [de1, de2, de3] });
