/** CSD201 · A.1 (Nâng cao) — Red-Black, B-tree, skip list: kiểm ba luật đỏ-đen theo thứ tự, skip list mức cho trước (đếm bước, ⏱ 200k), B-tree CLRS tách nút chủ động (⏱ 10⁶ khoá). */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-a-1-red-black-check',
  tieuDe: { en: 'Is it a red-black tree? Check the rules in order and report the first violation', vi: 'Có phải cây đỏ-đen không? Kiểm các luật theo thứ tự và báo lỗi đầu tiên' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['red-black rules', 'black height', 'in-order = sorted for a BST', 'pre-order search for the first violation'],
  moTa: {
    en: `<p>${c('RBNode')} has ${c('key')}, ${c('red')} (false = black), ${c('left')}, ${c('right')}. Complete ${c('static String check(RBNode root)')} in ${c('RBCheck')}. Check in this order and return the FIRST problem:</p>
<ol>
<li>the root is red → ${c('ROOT IS RED')};</li>
<li>not a BST: walk in-order; the first key that is not greater than the key before it → ${c('NOT A BST at k')};</li>
<li>two reds in a row: the first node in <b>pre-order</b> that is red and has a red child → ${c('RED-RED at k')};</li>
<li>black heights differ: let <i>bh(x)</i> = the number of black nodes on the path x → x.left → x.left.left → … → null (bh(null) = 0). The first node in <b>pre-order</b> with bh(left) ≠ bh(right) → ${c('BLACK HEIGHT at k: left L, right R')}.</li>
</ol>
<p>If none applies return ${c('OK, black height B, height H')} — B = bh(root), H = the number of nodes on the longest root-to-leaf path. An empty tree is ${c('OK, black height 0, height 0')}.</p>
<p>Why the leftmost path is enough for rule 4: if every node has bh(left) = bh(right), then by induction every path below a node has the same number of blacks as its leftmost path.</p>
<p>The grader builds the tree from a pre-order list: ${c('13B')} = key 13 black, ${c('8R')} = red, ${c('#')} = null.</p>`,
    vi: `<p>${c('RBNode')} có ${c('key')}, ${c('red')} (false = đen), ${c('left')}, ${c('right')}. Hoàn thiện ${c('static String check(RBNode root)')} trong ${c('RBCheck')}. Kiểm theo thứ tự này và trả lỗi ĐẦU TIÊN:</p>
<ol>
<li>gốc đỏ → ${c('ROOT IS RED')};</li>
<li>không phải BST: duyệt trung thứ tự; khoá đầu tiên không lớn hơn khoá đứng trước nó → ${c('NOT A BST at k')};</li>
<li>hai đỏ liền nhau: nút đầu tiên theo <b>tiền thứ tự</b> là đỏ và có con đỏ → ${c('RED-RED at k')};</li>
<li>chiều cao đen lệch: gọi <i>bh(x)</i> = số nút đen trên đường x → x.left → x.left.left → … → null (bh(null) = 0). Nút đầu tiên theo <b>tiền thứ tự</b> có bh(left) ≠ bh(right) → ${c('BLACK HEIGHT at k: left L, right R')}.</li>
</ol>
<p>Không lỗi nào thì trả ${c('OK, black height B, height H')} — B = bh(root), H = số nút trên đường dài nhất từ gốc tới lá. Cây rỗng là ${c('OK, black height 0, height 0')}.</p>
<p>Vì sao chỉ cần đường trái nhất cho luật 4: nếu mọi nút có bh(left) = bh(right) thì theo quy nạp mọi đường bên dưới một nút có cùng số nút đen với đường trái nhất của nó.</p>
<p>Máy chấm dựng cây từ danh sách tiền thứ tự: ${c('13B')} = khoá 13 đen, ${c('8R')} = đỏ, ${c('#')} = null.</p>`,
  },
  yeuCau: { en: ['Exactly the four checks, in the given order; the messages exactly as shown.', 'Do not modify the tree.'], vi: ['Đúng bốn phép kiểm, theo thứ tự đã cho; thông điệp đúng như mẫu.', 'Không sửa cây.'] },
  dauVao: { en: 'CHECK followed by the pre-order list of the tree.', vi: 'CHECK rồi danh sách tiền thứ tự của cây.' },
  dauRa: { en: 'The verdict of check().', vi: 'Kết luận của check().' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      them: `
    static String[] tk;
    static int pos;

    static RBNode build() {
        String s = tk[pos++];
        if (s.equals("#")) {
            return null;
        }
        RBNode x = new RBNode(Integer.parseInt(s.substring(0, s.length() - 1)), s.endsWith("R"));
        x.left = build();
        x.right = build();
        return x;
    }
`,
      lenh: `                tk = Arrays.copyOfRange(p, 1, p.length);
                pos = 0;
                r = RBCheck.check(build());`,
    }),
  },
  tep: {
    'RBNode.java': j`
// GIVEN — do not change.
public class RBNode {
    int key;
    boolean red;
    RBNode left, right;

    RBNode(int key, boolean red) {
        this.key = key;
        this.red = red;
    }
}
`,
    'RBCheck.java': j`
public class RBCheck {

    public static String check(RBNode root) {
        //>> return "OK"; // TODO
        if (root == null) {
            return "OK, black height 0, height 0";
        }
        if (root.red) {
            return "ROOT IS RED";
        }
        prev = null;
        bad = null;
        inOrder(root);
        if (bad != null) {
            return "NOT A BST at " + bad.key;
        }
        RBNode rr = redRed(root);
        if (rr != null) {
            return "RED-RED at " + rr.key;
        }
        RBNode b = blackBad(root);
        if (b != null) {
            return "BLACK HEIGHT at " + b.key + ": left " + bh(b.left) + ", right " + bh(b.right);
        }
        return "OK, black height " + bh(root) + ", height " + height(root);
        //<<
    }
    //>> // TODO: helper(s)

    private static RBNode prev, bad;

    private static void inOrder(RBNode p) {
        if (p == null || bad != null) {
            return;
        }
        inOrder(p.left);
        if (bad == null && prev != null && p.key <= prev.key) {
            bad = p;
        }
        prev = p;
        inOrder(p.right);
    }

    private static RBNode redRed(RBNode p) {
        if (p == null) {
            return null;
        }
        if (p.red && ((p.left != null && p.left.red) || (p.right != null && p.right.red))) {
            return p;
        }
        RBNode x = redRed(p.left);
        return x != null ? x : redRed(p.right);
    }

    // black nodes on the leftmost path
    private static int bh(RBNode p) {
        int count = 0;
        for (; p != null; p = p.left) {
            if (!p.red) {
                count++;
            }
        }
        return count;
    }

    private static RBNode blackBad(RBNode p) {
        if (p == null) {
            return null;
        }
        if (bh(p.left) != bh(p.right)) {
            return p;
        }
        RBNode x = blackBad(p.left);
        return x != null ? x : blackBad(p.right);
    }

    private static int height(RBNode p) {
        return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right));
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'a valid red-black tree (the textbook one)', vi: 'một cây đỏ-đen hợp lệ (cây trong sách)' }, vao: 'CHECK 13B 8R 1B # 6R # # 11B # # 17R 15B # # 25B 22R # # 27R # #\nCHECK #\nCHECK 7B # #\n' },
    { ten: { en: 'one violation of each kind', vi: 'mỗi loại một lỗi' }, vao: 'CHECK 10R 5B # # 15B # #\nCHECK 10B 5R # 12B # # 15R # #\nCHECK 10B 5R 3R # # # 15R # #\nCHECK 10B 5B # # 15R # #\n' },
    { ten: { en: 'pre-order decides which node is reported', vi: 'tiền thứ tự quyết định nút được báo' }, vao: 'CHECK 20B 10B 5R # # 15B # # 30B 25B # # 35B # #\nCHECK 20B 10B 5B # # 15R # # 30B 25B # # 35B # #\nCHECK 20B 10R 5R # # 15B # # 30B # #\nCHECK 20B 10R 5B # # 15B # # 30R 25B # # 40B # 45R # #\n', an: true },
    { ten: { en: 'BST errors hidden deep, duplicates', vi: 'lỗi BST nằm sâu, khoá trùng' }, vao: 'CHECK 50B 30R 20B # # 40B 35R # # 55R # # 70R 60B # # 80B # #\nCHECK 10B 10R # # #\nCHECK 8B 4R 2B 1R # # 3R # # 6B 5R # # 7R # # 12R 10B 9R # # 11R # # 14B 13R # # 15R # #\n', an: true },
  ],
  goiY: [
    { en: 'Write one small recursive helper per rule; each returns the first offending node (or null) in pre-order: check the node itself, then the left subtree, then the right.', vi: 'Viết mỗi luật một hàm đệ quy nhỏ; mỗi hàm trả nút vi phạm đầu tiên (hoặc null) theo tiền thứ tự: xét chính nút, rồi cây con trái, rồi cây con phải.' },
    { en: 'For rule 2 keep the previously visited node of the in-order walk in a field.', vi: 'Với luật 2, giữ nút vừa thăm trước đó của phép duyệt trung thứ tự trong một trường.' },
  ],
  loiHayGap: [
    { en: 'Checking only parent < child for the BST rule — 5 → right child 12 under root 10 passes that test but is not a BST.', vi: 'Chỉ kiểm cha < con cho luật BST — 5 có con phải 12 dưới gốc 10 qua được phép kiểm đó nhưng không phải BST.' },
    { en: 'Counting the null leaves as black in bh() — allowed in textbooks, but here bh(null) = 0 so the numbers must match the statement.', vi: 'Đếm lá null là đen trong bh() — sách cho phép, nhưng ở đây bh(null) = 0 nên con số phải khớp đề.' },
  ],
  giaiThich: { en: '<p>The three colour rules imply height ≤ 2·log₂(n + 1): the shortest root-to-null path is all black (bh nodes) and the longest alternates red and black (at most 2·bh). The textbook tree has 10 nodes, black height 2 and height 4 ≤ 2·log₂ 11 ≈ 6.9. Each helper is O(n) except the naive rule-4 check, which recomputes bh along leftmost paths: O(n log n) on a valid tree — fine here, and easy to turn into a single post-order pass.</p>', vi: '<p>Ba luật màu suy ra chiều cao ≤ 2·log₂(n + 1): đường ngắn nhất từ gốc tới null toàn đen (bh nút) còn đường dài nhất xen đỏ-đen (nhiều nhất 2·bh). Cây trong sách có 10 nút, chiều cao đen 2 và chiều cao 4 ≤ 2·log₂ 11 ≈ 6,9. Mỗi hàm phụ O(n), riêng phép kiểm luật 4 kiểu đơn giản tính lại bh dọc đường trái nhất: O(n log n) trên cây hợp lệ — đủ dùng ở đây, và dễ đổi thành một lượt hậu thứ tự.</p>' },
});

const de2 = deJava({
  id: 'csd201-a-1-skip-list',
  tieuDe: { en: 'A skip list with given levels: search from the top lane, insert, delete, count the moves', vi: 'Skip list với mức cho trước: tìm từ làn trên cùng, chèn, xoá, đếm bước' },
  doKho: 'HARD', phut: 40,
  khaiNiem: ['skip list lanes', 'update[] = the last node before the key on every lane', 'expected O(log n) search'],
  moTa: {
    en: `<p>${c('SkipList')} keeps distinct int keys in sorted lanes. ${c('head')} is a sentinel with ${c('MAX = 16')} pointers; a node of level ${c('lv')} has ${c('next[0..lv-1]')} (lane 1 = ${c('next[0]')} holds every key). ${c('level')} = the number of lanes in use, ${c('size')} = number of keys. The levels are <b>given</b> by the caller (normally they come from coin flips), so the structure is deterministic.</p>
<ul>
<li>${c('boolean contains(int key)')} — start at ${c('head')} on lane ${c('level')}; on each lane move forward while the next key is <b>smaller</b> than ${c('key')}, then drop one lane; at the bottom look at ${c('next[0]')}. Store in ${c('lastMoves')} how many forward moves you made.</li>
<li>${c('boolean insert(int key, int lv)')} — false if the key is present; otherwise link a new node of level ${c('lv')} into lanes 1…lv right after the last smaller node of each lane; update ${c('level')} and ${c('size')}.</li>
<li>${c('boolean delete(int key)')} — unlink the node from every lane it is on; then while ${c('level > 1')} and the top lane is empty, decrease ${c('level')}.</li>
</ul>
<p>Lesson A.1's example (1 on 3 lanes, 5 on 2, 9 on 3, the others on 1): searching 7 moves head→1 on lane 3, 1→5 on lane 2, 5→6 on lane 1 — <b>3 moves</b>; lane 1 alone would need 4 (head→1→3→5→6). The grader prints ${c('level')}, ${c('size')} and every non-empty lane, read from your ${c('next')} pointers.</p>`,
    vi: `<p>${c('SkipList')} giữ các khoá int phân biệt trong những làn đã sắp. ${c('head')} là nút lính canh có ${c('MAX = 16')} con trỏ; nút mức ${c('lv')} có ${c('next[0..lv-1]')} (làn 1 = ${c('next[0]')} chứa mọi khoá). ${c('level')} = số làn đang dùng, ${c('size')} = số khoá. Mức do nơi gọi <b>cho sẵn</b> (bình thường lấy từ tung đồng xu), nên cấu trúc là tất định.</p>
<ul>
<li>${c('contains(key)')} — bắt đầu ở ${c('head')} trên làn ${c('level')}; trên mỗi làn tiến lên khi khoá kế tiếp còn <b>nhỏ hơn</b> ${c('key')}, rồi tụt một làn; tới đáy xem ${c('next[0]')}. Ghi số lần tiến vào ${c('lastMoves')}.</li>
<li>${c('insert(key, lv)')} — khoá đã có thì false; ngược lại nối nút mới mức ${c('lv')} vào các làn 1…lv ngay sau nút nhỏ hơn cuối cùng của mỗi làn; cập nhật ${c('level')} và ${c('size')}.</li>
<li>${c('delete(key)')} — gỡ nút khỏi mọi làn nó có mặt; rồi khi ${c('level > 1')} và làn trên cùng rỗng thì giảm ${c('level')}.</li>
</ul>
<p>Ví dụ bài A.1 (1 trên 3 làn, 5 trên 2, 9 trên 3, còn lại 1 làn): tìm 7 đi head→1 ở làn 3, 1→5 ở làn 2, 5→6 ở làn 1 — <b>3 bước</b>; chỉ dùng làn 1 cần 4 (head→1→3→5→6). Máy chấm in ${c('level')}, ${c('size')} và mọi làn không rỗng, đọc từ chính con trỏ ${c('next')} của bạn.</p>`,
  },
  yeuCau: { en: ['Searching must use the upper lanes (the complexity check runs 200,000 searches).', 'lastMoves counts forward moves only, exactly as defined.'], vi: ['Tìm kiếm phải dùng các làn trên (kiểm độ phức tạp chạy 200.000 lần tìm).', 'lastMoves chỉ đếm số lần tiến, đúng như định nghĩa.'] },
  dauVao: { en: 'INS key level · HAS key · DEL key · PERF.', vi: 'INS khoá mức · HAS khoá · DEL khoá · PERF.' },
  dauRa: { en: 'The result (and moves for HAS), then level, size and the lanes.', vi: 'Kết quả (và số bước với HAS), rồi level, size và các làn.' },
  main: 'KiemTra',
  hen: { n: '200,000 keys', ms: 3000, can: 'O(log n) expected per operation', cham: 'O(n) per search (walking lane 1 only)' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        SkipList s = new SkipList();',
      them: `
    static String lanes(SkipList s) {
        StringBuilder sb = new StringBuilder("level " + s.level + ", size " + s.size);
        for (int i = SkipList.MAX - 1; i >= 0; i--) {
            if (s.head.next[i] == null) {
                continue;
            }
            sb.append(" / L").append(i + 1).append(':');
            int guard = 0;
            for (SkipList.Node x = s.head.next[i]; x != null && guard < 200; x = x.next[i], guard++) {
                sb.append(' ').append(x.key);
            }
        }
        return sb.toString();
    }
`,
      lenh: `                if (p[0].equals("INS")) {
                    r = String.valueOf(s.insert(n(1), n(2)));
                } else if (p[0].equals("HAS")) {
                    r = s.contains(n(1)) + ", moves " + s.lastMoves;
                } else if (p[0].equals("DEL")) {
                    r = String.valueOf(s.delete(n(1)));
                } else {
                    final SkipList t = new SkipList();
                    final int N = 200000;
                    final Random rnd = new Random(42);
                    final int[] keys = new int[N];
                    for (int i = 0; i < N; i++) {
                        keys[i] = 3 * i;
                    }
                    for (int i = N - 1; i > 0; i--) {
                        int k = rnd.nextInt(i + 1);
                        int x = keys[i];
                        keys[i] = keys[k];
                        keys[k] = x;
                    }
                    final long[] tot = new long[2];
                    r = Kiem.hen("200,000 inserts + 200,000 searches", 3000, new Runnable() {
                        public void run() {
                            for (int i = 0; i < N; i++) {
                                int lv = 1;
                                while (lv < SkipList.MAX && rnd.nextBoolean()) {
                                    lv++;
                                }
                                t.insert(keys[i], lv);
                            }
                            for (int i = 0; i < N; i++) {
                                if (t.contains(i)) {
                                    tot[0]++;
                                }
                                tot[1] += t.lastMoves;
                            }
                        }
                    }) + ", found " + tot[0] + ", average moves " + (tot[1] / N) + ", size " + t.size;
                }`,
      trangThai: '(p[0].equals("PERF") ? "" : lanes(s))',
    }),
  },
  tep: {
    'SkipList.java': j`
public class SkipList {
    static final int MAX = 16;

    static class Node {
        final int key;
        final Node[] next;

        Node(int key, int level) {
            this.key = key;
            this.next = new Node[level];
        }
    }

    final Node head = new Node(Integer.MIN_VALUE, MAX);
    int level = 1;
    int size = 0;
    int lastMoves = 0;

    public boolean contains(int key) {
        //>> return false; // TODO
        lastMoves = 0;
        Node p = head;
        for (int i = level - 1; i >= 0; i--) {
            while (p.next[i] != null && p.next[i].key < key) {
                p = p.next[i];
                lastMoves++;
            }
        }
        p = p.next[0];
        return p != null && p.key == key;
        //<<
    }

    public boolean insert(int key, int lv) {
        //>> return false; // TODO
        Node[] update = new Node[MAX];
        Node p = head;
        for (int i = MAX - 1; i >= 0; i--) {
            while (p.next[i] != null && p.next[i].key < key) {
                p = p.next[i];
            }
            update[i] = p;
        }
        if (p.next[0] != null && p.next[0].key == key) {
            return false;
        }
        Node q = new Node(key, lv);
        for (int i = 0; i < lv; i++) {
            q.next[i] = update[i].next[i];
            update[i].next[i] = q;
        }
        if (lv > level) {
            level = lv;
        }
        size++;
        return true;
        //<<
    }

    public boolean delete(int key) {
        //>> return false; // TODO
        Node[] update = new Node[MAX];
        Node p = head;
        for (int i = level - 1; i >= 0; i--) {
            while (p.next[i] != null && p.next[i].key < key) {
                p = p.next[i];
            }
            update[i] = p;
        }
        Node q = p.next[0];
        if (q == null || q.key != key) {
            return false;
        }
        for (int i = 0; i < q.next.length; i++) {
            update[i].next[i] = q.next[i]; // on every lane q is right after update[i]
        }
        while (level > 1 && head.next[level - 1] == null) {
            level--;
        }
        size--;
        return true;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the lanes of lesson A.1, searching 7', vi: 'các làn của bài A.1, tìm 7' }, vao: 'INS 1 3\nINS 3 1\nINS 5 2\nINS 6 1\nINS 7 1\nINS 9 3\nHAS 7\nHAS 8\nHAS 0\nINS 5 4\n' },
    { ten: { en: 'deleting a tall node lowers the level', vi: 'xoá nút cao làm giảm level' }, vao: 'INS 10 1\nINS 20 4\nINS 30 2\nINS 40 1\nDEL 20\nHAS 30\nDEL 20\nDEL 10\nDEL 40\nDEL 30\nINS 5 2\n' },
    { ten: { en: 'inserting in decreasing order, deleting the first and the last', vi: 'chèn theo thứ tự giảm, xoá đầu và cuối' }, vao: 'INS 50 2\nINS 40 1\nINS 30 3\nINS 20 1\nINS 10 2\nHAS 50\nHAS 45\nDEL 10\nDEL 50\nHAS 40\nINS 35 5\nHAS 40\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'insert and delete both need update[i] = the last node with key < target on lane i — collect it on the same top-down walk as contains.', vi: 'insert và delete đều cần update[i] = nút cuối có khoá < đích trên làn i — gom nó trong cùng lượt đi từ trên xuống như contains.' },
    { en: 'After the walk, the candidate is update[0].next[0].', vi: 'Sau lượt đi, ứng viên là update[0].next[0].' },
  ],
  loiHayGap: [
    { en: 'Moving while next.key <= key — the walk overshoots and moves are counted wrong.', vi: 'Tiến khi next.key <= key — lượt đi vượt quá và đếm sai số bước.' },
    { en: 'Forgetting to lower level after a delete — later searches start on an empty lane (still correct, but the printed level is wrong).', vi: 'Quên hạ level sau khi xoá — các lần tìm sau bắt đầu ở làn rỗng (vẫn đúng, nhưng level in ra sai).' },
  ],
  giaiThich: { en: '<p>With levels from fair coin flips lane i holds about n/2^(i−1) keys, so there are about log₂ n lanes and an expected constant number of moves per lane: O(log n) per operation without any rotation. The complexity check reports the average number of moves for 200,000 keys: 15 with the fixed seed, against about 33,000 for walking lane 1 alone (the queries 0…199,999 fall among the first 66,667 keys 0, 3, 6, …).</p>', vi: '<p>Với mức từ tung đồng xu công bằng, làn i chứa khoảng n/2^(i−1) khoá, nên có khoảng log₂ n làn và kỳ vọng một số hằng bước mỗi làn: O(log n) mỗi phép mà không cần phép quay nào. Kiểm độ phức tạp in số bước trung bình cho 200.000 khoá: 15 với hạt giống cố định, so với khoảng 33.000 nếu chỉ đi làn 1 (các truy vấn 0…199.999 nằm giữa 66.667 khoá đầu 0, 3, 6, …).</p>' },
});

const de3 = deJava({
  id: 'csd201-a-1-b-tree',
  tieuDe: { en: 'A B-tree (CLRS): insert with proactive splits, count the pages read by a search', vi: 'B-tree (CLRS): chèn với tách nút chủ động, đếm số trang đọc khi tìm' },
  doKho: 'HARD', phut: 50,
  khaiNiem: ['minimum degree t: t−1 … 2t−1 keys per node', 'splitting a full child on the way down', 'height = O(log_t n) page reads'],
  moTa: {
    en: `<p>${c('BNode')} (given) has ${c('n')} keys in ${c('keys[0..n-1]')} (sorted), children ${c('c[0..n]')} and ${c('leaf')}. ${c('BTree(t)')} starts with an empty leaf as ${c('root')}. Complete:</p>
<ul>
<li>${c('boolean contains(int k)')} — from the root: find the first key ≥ k in the node; equal → found; a leaf → not found; else go to child ${c('c[i]')}. Store in ${c('lastReads')} the number of nodes visited (= disk pages read).</li>
<li>${c('void insert(int k)')} (ignore a key already present) — the CLRS one-pass algorithm: if the root is full (2t−1 keys) make a new root with the old one as ${c('c[0]')} and split it; then go down, and <b>before</b> entering a full child split it: its middle key ${c('keys[t-1]')} moves up into the parent at position i, the left t−1 keys stay, the right t−1 keys (and t children) move to a new node at ${c('c[i+1]')}. Finally put k into the leaf in sorted position.</li>
</ul>
<p>With t = 2 (a 2-3-4 tree): inserting 10 20 30 fills the root; inserting 40 splits it into ${c('[20] / [10] [30 40]')}. The grader prints the tree level by level from your nodes; the complexity check inserts a million keys with t = 32 and searches them all.</p>`,
    vi: `<p>${c('BNode')} (cho sẵn) có ${c('n')} khoá trong ${c('keys[0..n-1]')} (đã sắp), các con ${c('c[0..n]')} và ${c('leaf')}. ${c('BTree(t)')} bắt đầu với ${c('root')} là một lá rỗng. Hoàn thiện:</p>
<ul>
<li>${c('contains(k)')} — từ gốc: tìm khoá đầu tiên ≥ k trong nút; bằng → thấy; là lá → không thấy; ngược lại đi xuống con ${c('c[i]')}. Ghi vào ${c('lastReads')} số nút đã thăm (= số trang đĩa đã đọc).</li>
<li>${c('insert(k)')} (khoá đã có thì bỏ qua) — thuật toán một lượt của CLRS: nếu gốc đầy (2t−1 khoá) thì tạo gốc mới nhận gốc cũ làm ${c('c[0]')} và tách nó; rồi đi xuống, và <b>trước khi</b> vào một con đầy thì tách nó: khoá giữa ${c('keys[t-1]')} lên cha ở vị trí i, t−1 khoá trái ở lại, t−1 khoá phải (và t con) sang nút mới ở ${c('c[i+1]')}. Cuối cùng đặt k vào lá đúng thứ tự.</li>
</ul>
<p>Với t = 2 (cây 2-3-4): chèn 10 20 30 làm đầy gốc; chèn 40 tách nó thành ${c('[20] / [10] [30 40]')}. Máy chấm in cây theo từng tầng từ chính các nút của bạn; kiểm độ phức tạp chèn một triệu khoá với t = 32 rồi tìm lại tất cả.</p>`,
  },
  yeuCau: { en: ['Split proactively on the way down (one pass, no going back up) — the printed shape depends on it.', 'Keep the given fields; keys inside a node stay sorted.'], vi: ['Tách chủ động trên đường đi xuống (một lượt, không quay lên) — hình cây in ra phụ thuộc vào điều đó.', 'Giữ các trường cho sẵn; khoá trong một nút luôn được sắp.'] },
  dauVao: { en: 'NEW t · INS k1 k2 … · HAS k · PERF.', vi: 'NEW t · INS k1 k2 … · HAS k · PERF.' },
  dauRa: { en: 'The result (and pages read for HAS), then the tree level by level.', vi: 'Kết quả (và số trang đọc với HAS), rồi cây theo từng tầng.' },
  main: 'KiemTra',
  hen: { n: '1,000,000 keys (t = 32)', ms: 4000, can: 'O(t · log_t n) per operation, height 4', cham: 'anything that is not a balanced multi-way tree' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        BTree b = new BTree(2);',
      them: `
    static String levels(BTree b) {
        StringBuilder sb = new StringBuilder();
        List<BNode> cur = new ArrayList<BNode>();
        cur.add(b.root);
        int guard = 0;
        while (!cur.isEmpty() && guard++ < 30) {
            List<BNode> nx = new ArrayList<BNode>();
            if (sb.length() > 0) {
                sb.append(" / ");
            }
            for (BNode x : cur) {
                sb.append('[');
                for (int i = 0; i < x.n; i++) {
                    sb.append(i > 0 ? " " : "").append(x.keys[i]);
                }
                sb.append(']');
                if (!x.leaf) {
                    for (int i = 0; i <= x.n; i++) {
                        if (x.c[i] != null) {
                            nx.add(x.c[i]);
                        }
                    }
                }
            }
            cur = nx;
        }
        return sb.toString();
    }
`,
      lenh: `                if (p[0].equals("NEW")) {
                    b = new BTree(n(1));
                } else if (p[0].equals("INS")) {
                    for (int i = 1; i < p.length; i++) {
                        b.insert(n(i));
                    }
                } else if (p[0].equals("HAS")) {
                    r = b.contains(n(1)) + ", reads " + b.lastReads;
                } else {
                    final BTree t = new BTree(32);
                    final int N = 1000000;
                    final int[] keys = new int[N];
                    Random rnd = new Random(7);
                    for (int i = 0; i < N; i++) {
                        keys[i] = i;
                    }
                    for (int i = N - 1; i > 0; i--) {
                        int k = rnd.nextInt(i + 1);
                        int x = keys[i];
                        keys[i] = keys[k];
                        keys[k] = x;
                    }
                    final int[] st = new int[2];
                    r = Kiem.hen("1,000,000 inserts + 1,000,000 searches", 4000, new Runnable() {
                        public void run() {
                            for (int i = 0; i < N; i++) {
                                t.insert(keys[i]);
                            }
                            for (int i = 0; i < N; i++) {
                                if (t.contains(i)) {
                                    st[0]++;
                                }
                                st[1] = Math.max(st[1], t.lastReads);
                            }
                        }
                    });
                    int h = 1;
                    for (BNode x = t.root; !x.leaf && x.c[0] != null && h < 100; x = x.c[0]) {
                        h++;
                    }
                    r += ", found " + st[0] + ", most pages read " + st[1] + ", height " + h + ", root keys " + t.root.n;
                }`,
      trangThai: '(p[0].equals("PERF") ? "" : levels(b))',
    }),
  },
  tep: {
    'BNode.java': j`
// GIVEN — do not change.
public class BNode {
    int n;
    final int[] keys;
    final BNode[] c;
    boolean leaf;

    BNode(int t, boolean leaf) {
        this.keys = new int[2 * t - 1];
        this.c = new BNode[2 * t];
        this.leaf = leaf;
    }
}
`,
    'BTree.java': j`
public class BTree {
    final int t;
    BNode root;
    int lastReads;

    public BTree(int t) {
        this.t = t;
        this.root = new BNode(t, true);
    }

    public boolean contains(int k) {
        //>> return false; // TODO
        lastReads = 0;
        BNode x = root;
        while (x != null) {
            lastReads++;
            int i = 0;
            while (i < x.n && k > x.keys[i]) {
                i++;
            }
            if (i < x.n && k == x.keys[i]) {
                return true;
            }
            if (x.leaf) {
                return false;
            }
            x = x.c[i];
        }
        return false;
        //<<
    }

    public void insert(int k) {
        //>> // TODO
        if (contains(k)) {
            return;
        }
        if (root.n == 2 * t - 1) {
            BNode s = new BNode(t, false);
            s.c[0] = root;
            root = s;
            split(s, 0);
        }
        BNode x = root;
        while (true) {
            int i = x.n - 1;
            if (x.leaf) {
                while (i >= 0 && k < x.keys[i]) {
                    x.keys[i + 1] = x.keys[i];
                    i--;
                }
                x.keys[i + 1] = k;
                x.n++;
                return;
            }
            while (i >= 0 && k < x.keys[i]) {
                i--;
            }
            i++;
            if (x.c[i].n == 2 * t - 1) {
                split(x, i);
                if (k > x.keys[i]) {
                    i++;
                }
            }
            x = x.c[i];
        }
        //<<
    }
    //>> // TODO: helper(s)

    // x.c[i] is full: move its middle key up into x and its right half into a new node x.c[i+1]
    private void split(BNode x, int i) {
        BNode y = x.c[i];
        BNode z = new BNode(t, y.leaf);
        z.n = t - 1;
        for (int j = 0; j < t - 1; j++) {
            z.keys[j] = y.keys[j + t];
        }
        if (!y.leaf) {
            for (int j = 0; j < t; j++) {
                z.c[j] = y.c[j + t];
                y.c[j + t] = null;
            }
        }
        y.n = t - 1;
        for (int j = x.n; j >= i + 1; j--) {
            x.c[j + 1] = x.c[j];
        }
        x.c[i + 1] = z;
        for (int j = x.n - 1; j >= i; j--) {
            x.keys[j + 1] = x.keys[j];
        }
        x.keys[i] = y.keys[t - 1];
        x.n++;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 't = 2: the first root split', vi: 't = 2: lần tách gốc đầu tiên' }, vao: 'INS 10 20 30\nINS 40\nINS 50 60 70\nHAS 60\nHAS 65\nINS 20\n' },
    { ten: { en: 't = 3: the classic CLRS sequence (letters as numbers)', vi: 't = 3: dãy kinh điển của CLRS (chữ cái thành số)' }, vao: 'NEW 3\nINS 6 19 17 11 3 12 8 20 22 23 13 18 14 16 1 2 24 25 4 26 5\nHAS 16\nHAS 26\nHAS 7\n' },
    { ten: { en: 'increasing and decreasing inserts, t = 2 and t = 4', vi: 'chèn tăng dần và giảm dần, t = 2 và t = 4' }, vao: 'NEW 2\nINS 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16\nHAS 1\nNEW 4\nINS 30 29 28 27 26 25 24 23 22 21 20 19 18 17 16 15 14 13 12 11 10\nHAS 30\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Write split(x, i) first and test it with the t = 2 case: [10 20 30] must become [20] / [10] [30].', vi: 'Viết split(x, i) trước và thử với ca t = 2: [10 20 30] phải thành [20] / [10] [30].' },
    { en: 'In split, shift x’s children from c[i+1] and keys from keys[i] one place to the right before writing the new ones.', vi: 'Trong split, dời các con của x từ c[i+1] và các khoá từ keys[i] sang phải một ô trước khi ghi cái mới.' },
  ],
  loiHayGap: [
    { en: 'Splitting only after a leaf overflows (bottom-up) — also a valid B-tree, but a different shape from the one-pass algorithm.', vi: 'Chỉ tách sau khi lá tràn (từ dưới lên) — cũng là B-tree hợp lệ, nhưng hình dạng khác thuật toán một lượt.' },
    { en: 'Forgetting to compare k with the key that just moved up (if k > x.keys[i] go to c[i+1]).', vi: 'Quên so k với khoá vừa đẩy lên (nếu k > x.keys[i] thì đi c[i+1]).' },
  ],
  giaiThich: { en: '<p>Splitting full nodes on the way down guarantees that the parent always has room for the middle key, so insertion never walks back up. Every node except the root keeps between t−1 and 2t−1 keys and all leaves are at the same depth, so the height is at most log_t((n+1)/2) + 1: for a million keys with t = 32 that is 4 levels — 4 page reads for any search, where a balanced binary tree needs about 20.</p>', vi: '<p>Tách các nút đầy trên đường đi xuống bảo đảm cha luôn còn chỗ cho khoá giữa, nên phép chèn không bao giờ phải quay ngược lên. Mọi nút trừ gốc giữ từ t−1 tới 2t−1 khoá và mọi lá cùng độ sâu, nên chiều cao không quá log_t((n+1)/2) + 1: một triệu khoá với t = 32 là 4 tầng — 4 lần đọc trang cho bất kỳ phép tìm nào, trong khi cây nhị phân cân bằng cần khoảng 20.</p>' },
});

export default moDun({ slug: 'csd201-cay-can-bang', ten: '9.1 Red-Black trees, B-trees and skip lists', de: [de1, de2, de3] });
