/** CSD201 · ⭐ CS.7 — cây nâng cao kiểu phỏng vấn (gen/java/cs7/Ex*): nhỏ thứ k trong BST (trung thứ tự ngăn xếp, O(h + k)), path sum III (tổng tiền tố trên cây + quay lui), từ điển có '.' (Trie + DFS), XOR lớn nhất (trie nhị phân), đếm số nhỏ hơn bên phải (Fenwick), trùng gần trong cửa sổ (TreeSet). */
import { moDun, c, j } from './_chung.mjs';
import { deCs } from './_cs.mjs';

const NODE = j`
// GIVEN — do not change.
public class Node {
    int val;
    Node left, right;

    Node(int v) {
        val = v;
    }
}
`;

const CAY = `
    static Node insert(Node x, int v) {
        Node nw = new Node(v);
        if (x == null) {
            return nw;
        }
        Node p = x;
        while (true) {
            if (v < p.val) {
                if (p.left == null) {
                    p.left = nw;
                    return x;
                }
                p = p.left;
            } else if (v > p.val) {
                if (p.right == null) {
                    p.right = nw;
                    return x;
                }
                p = p.right;
            } else {
                return x;
            }
        }
    }

    // level order with # for an empty child: 10,5,-3,3,2,#,11
    static Node level(String s) {
        if (s.equals("-")) {
            return null;
        }
        String[] t = s.split(",");
        Node root = new Node(Integer.parseInt(t[0]));
        ArrayDeque<Node> q = new ArrayDeque<Node>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < t.length) {
            Node x = q.poll();
            if (i < t.length && !t[i].equals("#")) {
                x.left = new Node(Integer.parseInt(t[i]));
                q.add(x.left);
            }
            i++;
            if (i < t.length && !t[i].equals("#")) {
                x.right = new Node(Integer.parseInt(t[i]));
                q.add(x.right);
            }
            i++;
        }
        return root;
    }
`;

const de1 = deCs({
  id: 'csd201-cs7-kth-smallest',
  tieuDe: { en: 'The k-th smallest value in a BST — iterative in-order, stop after k visits', vi: 'Giá trị nhỏ thứ k trong BST — trung thứ tự không đệ quy, dừng sau k lần thăm' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['in-order = sorted', 'explicit stack', 'O(h + k), not O(n)'],
  moTa: {
    en: `<p>Complete ${c('static int kthSmallest(Node root, int k)')}: the k-th smallest value of the BST (k = 1 is the minimum); if the tree has fewer than k nodes throw ${c('IllegalArgumentException("k > n")')}.</p>
<p>Walk in-order with an explicit stack: push the whole left spine, pop a node (that is the next smallest), count it, then go to its right child. Stop as soon as the counter reaches k — O(h + k). Two traps in the complexity check: a BST of 100,000 nodes inserted in increasing order (height 100,000 — recursion overflows the stack) and 200,000 queries with small k on a balanced tree of a million nodes (a full traversal per query is too slow).</p>`,
    vi: `<p>Hoàn thiện ${c('kthSmallest(root, k)')}: giá trị nhỏ thứ k của BST (k = 1 là nhỏ nhất); cây có ít hơn k nút thì ném ${c('IllegalArgumentException("k > n")')}.</p>
<p>Duyệt trung thứ tự bằng ngăn xếp tường minh: đẩy cả nhánh trái, lấy ra một nút (đó là giá trị nhỏ kế tiếp), đếm nó, rồi sang con phải. Dừng ngay khi bộ đếm đạt k — O(h + k). Hai cái bẫy trong phép kiểm độ phức tạp: BST 100.000 nút chèn theo thứ tự tăng (cao 100.000 — đệ quy tràn ngăn xếp) và 200.000 truy vấn với k nhỏ trên cây cân bằng một triệu nút (duyệt trọn mỗi truy vấn là quá chậm).</p>`,
  },
  hen: { n: '100,000-node chain + 200,000 queries on 1,000,000 nodes', ms: 3000, can: 'O(h + k) per query, no recursion', cham: 'O(n) per query, or recursion (StackOverflowError)' },
  dauVao: { en: 'RUN values-inserted-in-order k · RANDOM · PERF.', vi: 'RUN các giá trị chèn theo thứ tự k · RANDOM · PERF.' },
  them: CAY + `
    static Node balanced(int lo, int hi) {
        if (lo > hi) {
            return null;
        }
        int mid = (lo + hi) >>> 1;
        Node x = new Node(mid);
        x.left = balanced(lo, mid - 1);
        x.right = balanced(mid + 1, hi);
        return x;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    Node root = null;
                    for (int v : arr(p[1])) {
                        root = insert(root, v);
                    }
                    r = String.valueOf(KthSmallest.kthSmallest(root, n(2)));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(91);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        Node root = null;
                        TreeSet<Integer> set = new TreeSet<Integer>();
                        int n = 1 + rnd.nextInt(15);
                        for (int i = 0; i < n; i++) {
                            int v = rnd.nextInt(41) - 20;
                            root = insert(root, v);
                            set.add(v);
                        }
                        int k = 1 + rnd.nextInt(set.size());
                        int want = new ArrayList<Integer>(set).get(k - 1), got = KthSmallest.kthSmallest(root, k);
                        if (got != want) {
                            sai = set + " k=" + k + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random BSTs vs sorting", 3000, sai);
                } else {
                    Node chain = null, last = null;
                    for (int i = 1; i <= 100000; i++) {
                        Node x = new Node(i);
                        if (chain == null) {
                            chain = x;
                        } else {
                            last.right = x;
                        }
                        last = x;
                    }
                    final Node ch = chain, big = balanced(0, 999999);
                    final long[] s = new long[1];
                    r = Kiem.hen("chain of 100,000 + 200,000 small-k queries", 3000, new Runnable() {
                        public void run() {
                            s[0] += KthSmallest.kthSmallest(ch, 100000);
                            for (int q = 0; q < 200000; q++) {
                                s[0] += KthSmallest.kthSmallest(big, 1 + q % 20);
                            }
                        }
                    }) + ", sum " + s[0];
                }`,
  tep: {
    'Node.java': NODE,
    'KthSmallest.java': j`
import java.util.ArrayDeque;
import java.util.Deque;

public class KthSmallest {

    public static int kthSmallest(Node root, int k) {
        //>> return 0; // TODO
        Deque<Node> st = new ArrayDeque<Node>();
        Node x = root;
        while (x != null || !st.isEmpty()) {
            while (x != null) { // go as far left as possible
                st.push(x);
                x = x.left;
            }
            x = st.pop();
            if (--k == 0) {
                return x.val; // the k-th smallest
            }
            x = x.right;
        }
        throw new IllegalArgumentException("k > n");
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 50,30,70,20,40,60,80,10 1\nRUN 50,30,70,20,40,60,80,10 4\nRUN 50,30,70,20,40,60,80,10 8\nRUN -5 1\nRUN -5 2\n' },
    { ten: { en: '3000 random BSTs', vi: '3000 BST ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'The outer loop runs while there is a current node OR the stack is not empty.', vi: 'Vòng ngoài chạy khi còn nút hiện tại HOẶC ngăn xếp chưa rỗng.' },
    { en: 'Decrement k when a node is popped, not when it is pushed.', vi: 'Giảm k khi lấy một nút ra, không phải khi đẩy vào.' },
  ],
  loiHayGap: [
    { en: 'Collecting the whole in-order list and returning list.get(k − 1) — O(n) per query.', vi: 'Gom cả danh sách trung thứ tự rồi trả list.get(k − 1) — O(n) mỗi truy vấn.' },
    { en: 'A recursive in-order — StackOverflowError on a tree of height 100,000.', vi: 'Trung thứ tự đệ quy — StackOverflowError trên cây cao 100.000.' },
  ],
  giaiThich: { en: '<p>The stack holds the path of nodes whose left subtree is being visited; popping yields the values in increasing order. Reaching the k-th costs the height (to reach the minimum) plus k steps. With a size field in every node it would be O(h) — the order-statistic tree.</p>', vi: '<p>Ngăn xếp giữ đường các nút có cây con trái đang được duyệt; lấy ra cho các giá trị theo thứ tự tăng. Tới giá trị thứ k tốn chiều cao (để tới nhỏ nhất) cộng k bước. Nếu mỗi nút có thêm trường kích thước thì chỉ O(h) — cây thống kê thứ tự.</p>' },
});

const de2 = deCs({
  id: 'csd201-cs7-path-sum-3',
  tieuDe: { en: 'Path sum III — downward paths with a given sum: prefix sums on a tree + backtracking', vi: 'Path sum III — đường đi xuống có tổng cho trước: tổng tiền tố trên cây + quay lui' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['prefix sum along the root-to-node path', 'HashMap of prefix counts', 'remove the prefix when leaving the node'],
  moTa: {
    en: `<p>Complete ${c('static long pathSum(Node root, long target)')}: how many paths go <b>downward</b> (from a node to one of its descendants, possibly a single node) with sum equal to target. Values may be negative or as large as 10⁹ — sum in a long. Example (level order) ${c('10,5,-3,3,2,#,11,3,-2,#,1')}, target 8 → 3.</p>
<p>Walk the tree keeping the sum from the root; a downward path ending here with sum target exists for every earlier prefix P on the current root-to-node path with ${c('sum − P == target')}. Keep a map prefix → count (start with ${c('{0: 1}')}), add the current prefix before visiting the children and <b>remove it</b> when leaving — it must not be seen from another branch. O(n); starting a walk at every node is O(n · h) and fails the check on a tree of height 8000.</p>`,
    vi: `<p>Hoàn thiện ${c('pathSum(root, target)')}: có bao nhiêu đường đi <b>xuống</b> (từ một nút tới một nút con cháu, có thể chỉ một nút) có tổng bằng target. Giá trị có thể âm hoặc lớn tới 10⁹ — cộng bằng long. Ví dụ (theo tầng) ${c('10,5,-3,3,2,#,11,3,-2,#,1')}, target 8 → 3.</p>
<p>Duyệt cây giữ tổng từ gốc; một đường xuống kết thúc ở đây có tổng target ứng với mỗi tiền tố P trước đó trên đường gốc → nút hiện tại mà ${c('sum − P == target')}. Giữ map tiền tố → số lần (bắt đầu ${c('{0: 1}')}), thêm tiền tố hiện tại trước khi thăm các con và <b>gỡ nó</b> khi rời đi — nhánh khác không được thấy nó. O(n); bắt đầu đi từ mọi nút là O(n · h) và trượt phép kiểm trên cây cao 8000.</p>`,
  },
  hen: { n: '≈ 248,000 nodes, height 8000', ms: 2000, can: 'O(n)', cham: 'O(n · h) (a walk from every node)' },
  dauVao: { en: 'RUN tree-in-level-order(# = empty) target · RANDOM · PERF.', vi: 'RUN cây-theo-tầng(# = trống) target · RANDOM · PERF.' },
  them: CAY + `
    static long brute(Node x, long target) {
        if (x == null) {
            return 0;
        }
        return from(x, 0, target) + brute(x.left, target) + brute(x.right, target);
    }

    static long from(Node x, long s, long target) {
        if (x == null) {
            return 0;
        }
        s += x.val;
        return (s == target ? 1 : 0) + from(x.left, s, target) + from(x.right, s, target);
    }

    static Node rnd(Random rnd, int n) {
        if (n == 0) {
            return null;
        }
        Node x = new Node(rnd.nextInt(11) - 5);
        int l = rnd.nextInt(n);
        x.left = rnd(rnd, l);
        x.right = rnd(rnd, n - 1 - l);
        return x;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(PathSum.pathSum(level(p[1]), Long.parseLong(p[2])));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(93);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        Node root = rnd(rnd, rnd.nextInt(15));
                        long target = rnd.nextInt(11) - 5;
                        long got = PathSum.pathSum(root, target), want = brute(root, target);
                        if (got != want) {
                            sai = "tree #" + t + " target=" + target + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random trees (negatives, target 0)", 3000, sai);
                } else {
                    Random rnd = new Random(95);
                    Node root = new Node(1), spine = root;
                    for (int i = 0; i < 8000; i++) {
                        Node x = spine;
                        for (int k = 0; k < 30; k++) {
                            x.right = new Node(rnd.nextInt(7) - 3);
                            x = x.right;
                        }
                        spine.left = new Node(rnd.nextInt(7) - 3);
                        spine = spine.left;
                    }
                    final Node rt = root;
                    final long[] got = new long[1];
                    final Throwable[] err = new Throwable[1];
                    // a thread with a 256 MB stack: recursion depth 8000 is allowed, only the running time is checked
                    r = Kiem.hen("about 248,000 nodes, height 8000", 2000, new Runnable() {
                        public void run() {
                            Thread th = new Thread(null, new Runnable() {
                                public void run() {
                                    try {
                                        got[0] = PathSum.pathSum(rt, 4);
                                    } catch (Throwable e) {
                                        err[0] = e;
                                    }
                                }
                            }, "deep", 1L << 28);
                            th.setDaemon(true);
                            th.start();
                            try {
                                th.join();
                            } catch (InterruptedException e) {
                                return;
                            }
                        }
                    }) + (err[0] == null ? "" : ", THROWS " + Kiem.ten(err[0])) + ", paths " + got[0];
                }`,
  tep: {
    'Node.java': NODE,
    'PathSum.java': j`
import java.util.HashMap;
import java.util.Map;

public class PathSum {

    public static long pathSum(Node root, long target) {
        //>> return 0; // TODO
        Map<Long, Integer> seen = new HashMap<Long, Integer>();
        seen.put(0L, 1); // the empty prefix
        return count(root, 0, target, seen);
        //<<
    }
    //>> // TODO: helper(s)

    private static long count(Node x, long sum, long target, Map<Long, Integer> seen) {
        if (x == null) {
            return 0;
        }
        sum += x.val; // long: values up to 1e9
        Integer before = seen.get(sum - target); // earlier prefixes P with sum - P == target
        long c = before == null ? 0 : before;
        Integer mine = seen.get(sum);
        seen.put(sum, mine == null ? 1 : mine + 1);
        c += count(x.left, sum, target, seen) + count(x.right, sum, target, seen);
        seen.put(sum, seen.get(sum) - 1); // BACKTRACK: leaving this branch
        return c;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 10,5,-3,3,2,#,11,3,-2,#,1 8\nRUN 1,-1,1,-1 0\nRUN 1000000000,1000000000,#,1000000000 3000000000\nRUN - 0\nRUN 0,0,0 0\n' },
    { ten: { en: '3000 random trees', vi: '3000 cây ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Look up sum − target BEFORE adding the current prefix — otherwise target 0 counts an empty path.', vi: 'Tra sum − target TRƯỚC khi thêm tiền tố hiện tại — nếu không, target 0 sẽ đếm một đường rỗng.' },
    { en: 'The map must describe only the current root-to-node path: decrement on the way out.', vi: 'Map chỉ được mô tả đường gốc → nút hiện tại: giảm số đếm khi đi ra.' },
  ],
  loiHayGap: [
    { en: 'Not removing the prefix when returning — paths that jump between branches are counted.', vi: 'Không gỡ tiền tố khi trả về — các "đường" nhảy giữa hai nhánh bị đếm.' },
    { en: 'int sums — three values of 10⁹ overflow.', vi: 'Tổng kiểu int — ba giá trị 10⁹ là tràn.' },
  ],
  giaiThich: { en: '<p>This is the "subarray sum equals k" trick of CS.2 applied to every root-to-leaf path at once; the backtracking step keeps the map equal to the prefixes of the current path. One visit per node and O(1) expected map work: O(n).</p>', vi: '<p>Đây là mẹo "đoạn con có tổng k" của CS.2 áp lên mọi đường gốc → lá cùng lúc; bước quay lui giữ map đúng bằng các tiền tố của đường hiện tại. Mỗi nút thăm một lần và O(1) kỳ vọng cho map: O(n).</p>' },
});

const de3 = deCs({
  id: 'csd201-cs7-wildcard-trie',
  tieuDe: { en: 'A word dictionary with "." wildcards — Trie + DFS', vi: 'Từ điển có ký tự đại diện "." — Trie + DFS' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['trie node: 26 children + end flag', 'a letter follows one child, "." tries all', 'the whole pattern AND a word end'],
  moTa: {
    en: `<p>Complete the class ${c('WordDictionary')}: ${c('void addWord(String w)')} (lowercase letters) and ${c('boolean search(String p)')} — p contains letters and ${c('.')}, which matches any one letter; true if some added word matches p entirely (same length). After adding bad, dad, mad: "pad" → false, "bad" → true, ".ad" → true, "b.." → true, "ba" → false.</p>
<p>Store words in a trie (${c('TNode')} with ${c('next[26]')} and ${c('end')}). Search follows one child per letter; at a dot it tries every existing child (backtracking). Comparing the pattern with every stored word is O(n · L) per search — the complexity check adds 100,000 words and searches 100,000 patterns.</p>`,
    vi: `<p>Hoàn thiện lớp ${c('WordDictionary')}: ${c('addWord(w)')} (chữ thường) và ${c('search(p)')} — p gồm chữ cái và ${c('.')}, khớp với đúng một chữ cái bất kỳ; trả true nếu có từ đã thêm khớp trọn p (cùng độ dài). Sau khi thêm bad, dad, mad: "pad" → false, "bad" → true, ".ad" → true, "b.." → true, "ba" → false.</p>
<p>Lưu từ trong trie (${c('TNode')} có ${c('next[26]')} và ${c('end')}). Tìm kiếm đi theo một con mỗi chữ; gặp dấu chấm thì thử mọi con đang có (quay lui). So mẫu với từng từ đã lưu là O(n · L) mỗi lần tìm — kiểm độ phức tạp thêm 100.000 từ và tìm 100.000 mẫu.</p>`,
  },
  hen: { n: '100,000 words + 100,000 searches', ms: 3000, can: 'O(L) per add, O(L) per search without dots', cham: 'O(n · L) per search (comparing with every word)' },
  dauVao: { en: 'ADD word · FIND pattern · RANDOM · PERF.', vi: 'ADD từ · FIND mẫu · RANDOM · PERF.' },
  truoc: '        WordDictionary d = new WordDictionary();',
  them: `
    static boolean match(String w, String p) {
        if (w.length() != p.length()) {
            return false;
        }
        for (int i = 0; i < w.length(); i++) {
            if (p.charAt(i) != '.' && p.charAt(i) != w.charAt(i)) {
                return false;
            }
        }
        return true;
    }

    static String word(Random rnd, int maxLen, String alpha) {
        StringBuilder sb = new StringBuilder();
        int n = 1 + rnd.nextInt(maxLen);
        for (int i = 0; i < n; i++) {
            sb.append(alpha.charAt(rnd.nextInt(alpha.length())));
        }
        return sb.toString();
    }
`,
  lenh: `                if (p[0].equals("ADD")) {
                    d.addWord(p[1]);
                } else if (p[0].equals("FIND")) {
                    r = String.valueOf(d.search(p[1]));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(97);
                    String sai = null;
                    int done = 0;
                    for (int t = 0; t < 200 && sai == null; t++) {
                        WordDictionary w = new WordDictionary();
                        List<String> words = new ArrayList<String>();
                        int n = rnd.nextInt(12);
                        for (int i = 0; i < n; i++) {
                            String x = word(rnd, 4, "abc");
                            words.add(x);
                            w.addWord(x);
                        }
                        for (int q = 0; q < 100 && sai == null; q++) {
                            String pat = word(rnd, 5, "abc..");
                            boolean want = false;
                            for (String x : words) {
                                want |= match(x, pat);
                            }
                            done++;
                            if (w.search(pat) != want) {
                                sai = words + " search " + pat + " -> " + !want + ", expected " + want;
                            }
                        }
                    }
                    r = ketQua("random dictionaries x 100 patterns", done, sai);
                } else {
                    final Random rnd = new Random(99);
                    final String[] ws = new String[100000];
                    for (int i = 0; i < ws.length; i++) {
                        ws[i] = word(rnd, 12, "abcdefghijklmnopqrstuvwxyz");
                    }
                    final int[] hit = new int[1];
                    r = Kiem.hen("100,000 adds + 100,000 searches", 3000, new Runnable() {
                        public void run() {
                            WordDictionary w = new WordDictionary();
                            for (String x : ws) {
                                w.addWord(x);
                            }
                            for (int i = 0; i < 100000; i++) {
                                String x = i % 2 == 0 ? ws[i] : ws[i].substring(0, ws[i].length() - 1) + ".";
                                if (w.search(i % 3 == 0 ? x + "z" : x)) {
                                    hit[0]++;
                                }
                            }
                        }
                    }) + ", found " + hit[0];
                }`,
  tep: {
    'WordDictionary.java': j`
public class WordDictionary {

    static class TNode {
        TNode[] next = new TNode[26];
        boolean end;
    }

    private final TNode root = new TNode();

    public void addWord(String w) {
        //>> // TODO
        TNode x = root;
        for (int i = 0; i < w.length(); i++) {
            int c = w.charAt(i) - 'a';
            if (x.next[c] == null) {
                x.next[c] = new TNode();
            }
            x = x.next[c];
        }
        x.end = true;
        //<<
    }

    public boolean search(String p) {
        //>> return false; // TODO
        return dfs(root, p, 0);
        //<<
    }
    //>> // TODO: helper(s)

    // a letter follows ONE child; '.' must try EVERY child
    private boolean dfs(TNode x, String p, int i) {
        if (i == p.length()) {
            return x.end; // the whole pattern used AND a word ends here
        }
        char c = p.charAt(i);
        if (c != '.') {
            TNode y = x.next[c - 'a'];
            return y != null && dfs(y, p, i + 1);
        }
        for (TNode y : x.next) {
            if (y != null && dfs(y, p, i + 1)) {
                return true;
            }
        }
        return false;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'bad, dad, mad', vi: 'bad, dad, mad' }, vao: 'ADD bad\nADD dad\nADD mad\nFIND pad\nFIND bad\nFIND .ad\nFIND b..\nFIND ba\nFIND ...\nFIND ....\nFIND .\n' },
    { ten: { en: 'prefixes are not words', vi: 'tiền tố không phải là từ' }, vao: 'ADD apple\nFIND app\nADD app\nFIND app\nFIND a...e\nFIND .....s\n' },
    { ten: { en: 'random dictionaries', vi: 'từ điển ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'At the end of the pattern return x.end, not true — "ba" must not match "bad".', vi: 'Hết mẫu thì trả x.end, không phải true — "ba" không được khớp "bad".' },
    { en: 'For a dot, return true as soon as one child succeeds.', vi: 'Với dấu chấm, trả true ngay khi một con thành công.' },
  ],
  loiHayGap: [
    { en: 'Keeping words in a List and comparing each one — correct, O(n · L) per search.', vi: 'Giữ các từ trong một List rồi so từng từ — đúng, nhưng O(n · L) mỗi lần tìm.' },
    { en: 'Treating "." as "any number of letters" — "...." would match "bad".', vi: 'Coi "." là "nhiều chữ tuỳ ý" — "...." sẽ khớp "bad".' },
  ],
  giaiThich: { en: '<p>Without dots a search walks one path of length L: O(L), independent of the number of words. Each dot multiplies the branches by at most 26, so the worst case is 26^(dots) · L — fine when dots are few, which is how the problem is posed.</p>', vi: '<p>Không có dấu chấm thì phép tìm đi một đường dài L: O(L), không phụ thuộc số từ. Mỗi dấu chấm nhân số nhánh lên nhiều nhất 26, nên xấu nhất là 26^(số chấm) · L — ổn khi ít dấu chấm, đúng như cách đề đặt ra.</p>' },
});

const de4 = deCs({
  id: 'csd201-cs7-max-xor',
  tieuDe: { en: 'Maximum XOR of two numbers — a binary trie, greedy from the high bit', vi: 'XOR lớn nhất của hai số — trie nhị phân, tham lam từ bit cao' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['binary trie over bits 30…0', 'walk towards the opposite bit', 'a high 1 beats all lower bits'],
  moTa: {
    en: `<p>Complete ${c('static int maxXor(int[] a)')} (values 0 … 2³¹ − 1): the largest ${c('a[i] ^ a[j]')} (i may equal j, so one element gives 0; empty array → 0). Example ${c('{6,17,9,30,4,12}')} → 29 (17 ^ 12).</p>
<p>Insert every number into a binary trie, bit 30 first. For each x walk down choosing the child with the <b>opposite</b> bit whenever it exists (that bit of the XOR becomes 1, which outweighs all lower bits together). O(31 · n); trying all pairs is O(n²) — the complexity check has 200,000 numbers.</p>`,
    vi: `<p>Hoàn thiện ${c('maxXor(a)')} (giá trị 0 … 2³¹ − 1): ${c('a[i] ^ a[j]')} lớn nhất (i có thể bằng j, nên một phần tử cho 0; mảng rỗng → 0). Ví dụ ${c('{6,17,9,30,4,12}')} → 29 (17 ^ 12).</p>
<p>Chèn mọi số vào một trie nhị phân, bit 30 trước. Với mỗi x đi xuống, chọn con có bit <b>ngược</b> mỗi khi nó tồn tại (bit đó của XOR thành 1, nặng hơn mọi bit thấp cộng lại). O(31 · n); thử mọi cặp là O(n²) — kiểm độ phức tạp có 200.000 số.</p>`,
  },
  hen: { n: '200,000 numbers', ms: 3000, can: 'O(31 · n)', cham: 'O(n²) (every pair)' },
  them: `
    static int brute(int[] a) {
        int b = 0;
        for (int x : a) {
            for (int y : a) {
                b = Math.max(b, x ^ y);
            }
        }
        return b;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(MaxXor.maxXor(arr(p[1])));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(101);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        int[] a = new int[rnd.nextInt(12)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = t % 2 == 0 ? rnd.nextInt(64) : rnd.nextInt(Integer.MAX_VALUE);
                        }
                        int got = MaxXor.maxXor(a.clone()), want = brute(a);
                        if (got != want) {
                            sai = str(a) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random arrays (small and full 31-bit)", 3000, sai);
                } else {
                    final int[] a = new int[200000];
                    Random rnd = new Random(103);
                    for (int i = 0; i < a.length; i++) {
                        a[i] = rnd.nextInt(1 << 30);
                    }
                    final int[] got = new int[1];
                    r = Kiem.hen("200,000 numbers", 3000, new Runnable() {
                        public void run() {
                            got[0] = MaxXor.maxXor(a);
                        }
                    }) + ", max " + got[0];
                }`,
  tep: {
    'MaxXor.java': j`
public class MaxXor {

    static class BNode {
        BNode[] c = new BNode[2];
    }

    public static int maxXor(int[] a) {
        //>> return 0; // TODO
        if (a.length == 0) {
            return 0;
        }
        BNode root = new BNode();
        for (int x : a) {
            BNode n = root;
            for (int b = 30; b >= 0; b--) {
                int bit = x >> b & 1;
                if (n.c[bit] == null) {
                    n.c[bit] = new BNode();
                }
                n = n.c[bit];
            }
        }
        int best = 0;
        for (int x : a) {
            BNode n = root;
            int cur = 0;
            for (int b = 30; b >= 0; b--) {
                int want = (x >> b & 1) ^ 1; // a 1 in a HIGH bit beats all lower bits together
                if (n.c[want] != null) {
                    cur |= 1 << b;
                    n = n.c[want];
                } else {
                    n = n.c[want ^ 1];
                }
            }
            best = Math.max(best, cur);
        }
        return best;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 6,17,9,30,4,12\nRUN 7\nRUN 0,2147483647\nRUN -\nRUN 8,10,2\n' },
    { ten: { en: '3000 random arrays', vi: '3000 mảng ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Use the same 31 bits (30 down to 0) for every number so that all paths have the same length.', vi: 'Dùng cùng 31 bit (30 xuống 0) cho mọi số để mọi đường dài bằng nhau.' },
    { en: 'The other child always exists when the opposite one does not — the number x itself is in the trie.', vi: 'Con còn lại luôn tồn tại khi con ngược không có — chính số x đã nằm trong trie.' },
  ],
  loiHayGap: [
    { en: 'Starting from bit 31 with ints — the sign bit makes the shifts negative.', vi: 'Bắt đầu từ bit 31 với int — bit dấu làm phép dịch ra số âm.' },
    { en: 'Greedily picking the largest number and XOR-ing with the rest — 17 ^ 30 = 15 is not the answer.', vi: 'Tham lam lấy số lớn nhất rồi XOR với phần còn lại — 17 ^ 30 = 15 không phải đáp án.' },
  ],
  giaiThich: { en: '<p>The XOR’s value is decided bit by bit from the top: getting a 1 in bit b is worth more than all bits below it, so the greedy walk is optimal. Each insert and each query is 31 steps.</p>', vi: '<p>Giá trị của XOR được quyết định từng bit từ trên xuống: có bit 1 ở vị trí b đáng giá hơn mọi bit thấp hơn, nên cách đi tham lam là tối ưu. Mỗi lần chèn và mỗi truy vấn là 31 bước.</p>' },
});

const de5 = deCs({
  id: 'csd201-cs7-count-smaller',
  tieuDe: { en: 'Count smaller numbers to the right — a Fenwick tree over compressed values', vi: 'Đếm số nhỏ hơn bên phải — cây Fenwick trên giá trị đã nén' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['coordinate compression', 'Fenwick: prefix sum and point update in O(log n)', 'walk from the right'],
  moTa: {
    en: `<p>Complete ${c('static int[] countSmaller(int[] a)')}: ${c('res[i]')} = the number of j &gt; i with ${c('a[j] < a[i]')} (any int values). Example ${c('{7,2,7,-4,5,1}')} → ${c('[4,2,3,0,1,0]')}.</p>
<p>Walk from the right and keep, for every value seen so far, how many times it occurred — in a Fenwick tree indexed by the <b>rank</b> of the value (sort the distinct values, binary search the rank). res[i] = prefix count of ranks below rank(a[i]); then add a[i]. O(n log n); counting pair by pair is O(n²) and fails the check with 200,000 numbers. (Merge sort with index tracking works too.)</p>`,
    vi: `<p>Hoàn thiện ${c('countSmaller(a)')}: ${c('res[i]')} = số chỉ số j &gt; i có ${c('a[j] < a[i]')} (giá trị int bất kỳ). Ví dụ ${c('{7,2,7,-4,5,1}')} → ${c('[4,2,3,0,1,0]')}.</p>
<p>Đi từ phải sang và giữ, cho mỗi giá trị đã gặp, số lần nó xuất hiện — trong cây Fenwick đánh chỉ số theo <b>hạng</b> của giá trị (sắp các giá trị khác nhau, tìm nhị phân hạng). res[i] = tổng tiền tố của các hạng nhỏ hơn hạng(a[i]); rồi thêm a[i]. O(n log n); đếm từng cặp là O(n²) và trượt phép kiểm với 200.000 số. (Sắp trộn có theo dõi chỉ số cũng được.)</p>`,
  },
  hen: { n: '200,000 numbers', ms: 3000, can: 'O(n log n)', cham: 'O(n²) (every pair)' },
  them: `
    static int[] brute(int[] a) {
        int[] r = new int[a.length];
        for (int i = 0; i < a.length; i++) {
            for (int jj = i + 1; jj < a.length; jj++) {
                if (a[jj] < a[i]) {
                    r[i]++;
                }
            }
        }
        return r;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = str(CountSmaller.countSmaller(arr(p[1])));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(105);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        int[] a = new int[rnd.nextInt(12)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = t % 3 == 0 ? rnd.nextInt() : rnd.nextInt(9) - 4;
                        }
                        String got = str(CountSmaller.countSmaller(a.clone())), want = str(brute(a));
                        if (!got.equals(want)) {
                            sai = str(a) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random arrays (duplicates, any int)", 3000, sai);
                } else {
                    final int[] a = new int[200000];
                    Random rnd = new Random(107);
                    for (int i = 0; i < a.length; i++) {
                        a[i] = rnd.nextInt();
                    }
                    final long[] s = new long[1];
                    r = Kiem.hen("200,000 numbers", 3000, new Runnable() {
                        public void run() {
                            for (int x : CountSmaller.countSmaller(a)) {
                                s[0] += x;
                            }
                        }
                    }) + ", total " + s[0];
                }`,
  tep: {
    'CountSmaller.java': j`
import java.util.Arrays;

public class CountSmaller {

    public static int[] countSmaller(int[] a) {
        //>> return new int[a.length]; // TODO
        int[] s = a.clone();
        Arrays.sort(s);
        int m = 0;
        for (int i = 0; i < s.length; i++) { // distinct values, sorted
            if (i == 0 || s[i] != s[i - 1]) {
                s[m++] = s[i];
            }
        }
        int[] tree = new int[m + 1]; // Fenwick tree over ranks 1..m
        int[] res = new int[a.length];
        for (int i = a.length - 1; i >= 0; i--) {
            int rank = Arrays.binarySearch(s, 0, m, a[i]) + 1;
            int c = 0;
            for (int j = rank - 1; j > 0; j -= j & -j) { // strictly smaller: prefix(rank - 1)
                c += tree[j];
            }
            res[i] = c;
            for (int j = rank; j <= m; j += j & -j) {
                tree[j]++;
            }
        }
        return res;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 7,2,7,-4,5,1\nRUN -\nRUN -2147483648,2147483647\nRUN 5,4,3,2,1\nRUN 2,2,2\n' },
    { ten: { en: '3000 random arrays', vi: '3000 mảng ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Ranks start at 1 in a Fenwick tree — index 0 is never used (j & −j would be 0).', vi: 'Hạng bắt đầu từ 1 trong cây Fenwick — chỉ số 0 không bao giờ dùng (j & −j sẽ là 0).' },
    { en: 'Query prefix(rank − 1) for "strictly smaller"; prefix(rank) would also count equal values.', vi: 'Hỏi prefix(rank − 1) cho "nhỏ hơn hẳn"; prefix(rank) sẽ đếm cả giá trị bằng nhau.' },
  ],
  loiHayGap: [
    { en: 'Using the raw value as an index — negative or huge values do not fit in an array.', vi: 'Dùng thẳng giá trị làm chỉ số — giá trị âm hay rất lớn không vừa mảng.' },
    { en: 'Walking from the left — the tree then holds the values BEFORE i, not after.', vi: 'Đi từ trái sang — khi đó cây chứa các giá trị TRƯỚC i, không phải sau.' },
  ],
  giaiThich: { en: '<p>Compression maps any n values to ranks 1…m (m ≤ n) without changing their order. A Fenwick tree then answers "how many seen values have rank &lt; r" and records a new value, both in O(log n): O(n log n) overall.</p>', vi: '<p>Phép nén ánh xạ n giá trị bất kỳ thành hạng 1…m (m ≤ n) mà không đổi thứ tự. Cây Fenwick khi đó trả lời "bao nhiêu giá trị đã gặp có hạng &lt; r" và ghi nhận giá trị mới, đều trong O(log n): tổng O(n log n).</p>' },
});

const de6 = deCs({
  id: 'csd201-cs7-nearby-almost-dup',
  tieuDe: { en: 'Nearby almost-duplicates — a sliding window kept in a TreeSet', vi: 'Gần trùng trong cửa sổ — cửa sổ trượt giữ bằng TreeSet' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['TreeSet.ceiling', 'window of the last k values', 'long to avoid a[i] ± t overflow'],
  moTa: {
    en: `<p>Complete ${c('static boolean nearby(int[] a, int k, int t)')} (k ≥ 1, t ≥ 0): is there i ≠ j with ${c('|i − j| ≤ k')} and ${c('|a[i] − a[j]| ≤ t')}? Example ${c('{8,1,14,5,9}')}: k = 3, t = 1 → false; k = 4, t = 1 → true (8 and 9); k = 1, t = 4 → true.</p>
<p>Keep the last k values in a sorted set. For a[i], ask for the smallest value ≥ a[i] − t (${c('ceiling')}); a hit is close enough if it is ≤ a[i] + t. Then add a[i] and remove ${c('a[i − k]')}. Compute ${c('a[i] − t')} and ${c('a[i] + t')} in long — values span the whole int range. O(n log k); checking the k neighbours of each element is O(n · k) — the complexity check has n = 200,000, k = 50,000.</p>`,
    vi: `<p>Hoàn thiện ${c('nearby(a, k, t)')} (k ≥ 1, t ≥ 0): có i ≠ j với ${c('|i − j| ≤ k')} và ${c('|a[i] − a[j]| ≤ t')} không? Ví dụ ${c('{8,1,14,5,9}')}: k = 3, t = 1 → false; k = 4, t = 1 → true (8 và 9); k = 1, t = 4 → true.</p>
<p>Giữ k giá trị gần nhất trong một tập đã sắp. Với a[i], hỏi giá trị nhỏ nhất ≥ a[i] − t (${c('ceiling')}); có thì đủ gần nếu ≤ a[i] + t. Rồi thêm a[i] và bỏ ${c('a[i − k]')}. Tính ${c('a[i] − t')} và ${c('a[i] + t')} bằng long — giá trị trải cả miền int. O(n log k); xét k hàng xóm của mỗi phần tử là O(n · k) — kiểm độ phức tạp có n = 200.000, k = 50.000.</p>`,
  },
  hen: { n: 'n = 200,000, k = 50,000', ms: 3000, can: 'O(n log k)', cham: 'O(n · k) (checking every pair in the window)' },
  dauVao: { en: 'RUN array k t · RANDOM · PERF.', vi: 'RUN mảng k t · RANDOM · PERF.' },
  them: `
    static boolean brute(int[] a, int k, int t) {
        for (int i = 0; i < a.length; i++) {
            for (int jj = i + 1; jj < a.length && jj - i <= k; jj++) {
                if (Math.abs((long) a[i] - a[jj]) <= t) {
                    return true;
                }
            }
        }
        return false;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Nearby.nearby(arr(p[1]), n(2), n(3)));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(109);
                    String sai = null;
                    for (int t = 0; t < 5000 && sai == null; t++) {
                        int[] a = new int[rnd.nextInt(10)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = t % 3 == 0 ? rnd.nextInt() : rnd.nextInt(30);
                        }
                        int k = 1 + rnd.nextInt(5), tt = t % 5 == 0 ? Integer.MAX_VALUE : rnd.nextInt(4);
                        boolean got = Nearby.nearby(a.clone(), k, tt), want = brute(a, k, tt);
                        if (got != want) {
                            sai = str(a) + " k=" + k + " t=" + tt + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("5000 random arrays (any int, huge t)", 5000, sai);
                } else {
                    final int[] a = new int[200000];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = i * 3; // no two values within t = 2 of each other
                    }
                    final boolean[] got = new boolean[2];
                    r = Kiem.hen("n = 200,000, k = 50,000 (answer false) + one true case", 3000, new Runnable() {
                        public void run() {
                            got[0] = Nearby.nearby(a, 50000, 2);
                            got[1] = Nearby.nearby(a, 50000, 3);
                        }
                    }) + ", answers " + got[0] + " and " + got[1];
                }`,
  tep: {
    'Nearby.java': j`
import java.util.TreeSet;

public class Nearby {

    public static boolean nearby(int[] a, int k, int t) {
        //>> return false; // TODO
        TreeSet<Long> win = new TreeSet<Long>(); // the last k values, sorted
        for (int i = 0; i < a.length; i++) {
            Long c = win.ceiling((long) a[i] - t); // smallest value >= a[i] - t
            if (c != null && c <= (long) a[i] + t) { // long: a[i] + t overflows an int
                return true;
            }
            win.add((long) a[i]);
            if (i >= k) {
                win.remove((long) a[i - k]); // slide the window
            }
        }
        return false;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 8,1,14,5,9 3 1\nRUN 8,1,14,5,9 4 1\nRUN 8,1,14,5,9 1 4\nRUN 2147483647,-2147483648 1 0\nRUN - 1 1\nRUN 1,1 1 0\n' },
    { ten: { en: '5000 random arrays', vi: '5000 mảng ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Check BEFORE adding a[i] — otherwise a[i] finds itself.', vi: 'Kiểm TRƯỚC khi thêm a[i] — nếu không, a[i] tự tìm thấy chính nó.' },
    { en: 'Duplicates in the window are fine: if two equal values are within k, the answer is already true.', vi: 'Giá trị trùng trong cửa sổ không sao: hai giá trị bằng nhau cách ≤ k thì đáp án đã là true.' },
  ],
  loiHayGap: [
    { en: 'a[i] + t in int — with t = MAX the bound wraps negative.', vi: 'a[i] + t kiểu int — với t = MAX cận bị quay vòng thành âm.' },
    { en: 'Removing a[i − k] before the check — the window then holds only k − 1 values.', vi: 'Bỏ a[i − k] trước khi kiểm — cửa sổ khi đó chỉ còn k − 1 giá trị.' },
  ],
  giaiThich: { en: '<p>A balanced BST (TreeSet is a red-black tree) answers "is there a value in [x − t, x + t]?" with one ceiling query in O(log k), and supports the window’s add/remove in O(log k). Bucketing by width t + 1 gives an expected O(n) variant.</p>', vi: '<p>Một BST cân bằng (TreeSet là cây đỏ-đen) trả lời "có giá trị nào trong [x − t, x + t] không?" bằng một lần ceiling trong O(log k), và hỗ trợ thêm/bỏ của cửa sổ trong O(log k). Chia rổ theo độ rộng t + 1 cho một biến thể O(n) kỳ vọng.</p>' },
});

export default moDun({ slug: 'csd201-cs7-on', ten: '10.7 ⭐ CS.7 Advanced trees — interview problems', de: [de1, de2, de3, de4, de5, de6] });
