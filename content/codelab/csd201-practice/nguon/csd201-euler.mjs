/** CSD201 · 5.7 — Euler & Hamilton: có chu trình/đường Euler không (bậc + liên thông), Hierholzer lặp (10⁶ cạnh), chu trình Hamilton bằng quay lui. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const DOC = `
    static int nv = -1;
    static List<int[]> es = new ArrayList<>();
`;

const de1 = deJava({
  id: 'csd201-5-7-euler-check',
  tieuDe: { en: 'Euler cycle, Euler path or neither? Degrees and connectivity', vi: 'Có chu trình Euler, đường Euler hay không? Bậc và tính liên thông' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['all degrees even ⇒ Euler cycle', 'exactly two odd vertices ⇒ Euler path between them', 'the edges must be in one component'],
  moTa: {
    en: `<p>An undirected multigraph (loops and parallel edges allowed) with vertices 0..n−1. Complete ${c('static String euler(int n, int[][] edges)')}:</p>
<ul><li>${c('"CYCLE"')} — every vertex has even degree and all vertices that have edges are in one component;</li>
<li>${c('"PATH u v"')} — the same connectivity, exactly two odd vertices u &lt; v;</li>
<li>${c('"NONE"')} — otherwise.</li></ul>
<p>A graph without any edge has a trivial Euler cycle: ${c('"CYCLE"')}.</p>
<p>Königsberg (4 vertices, 7 bridges) gives ${c('"NONE"')}.</p>`,
    vi: `<p>Đa đồ thị vô hướng (cho phép khuyên và cạnh song song) với đỉnh 0..n−1. Hoàn thiện ${c('static String euler(int n, int[][] edges)')}: ${c('"CYCLE"')} — mọi đỉnh bậc chẵn và mọi đỉnh có cạnh nằm trong một thành phần; ${c('"PATH u v"')} — cùng điều kiện liên thông, đúng hai đỉnh lẻ u &lt; v; ${c('"NONE"')} — các trường hợp còn lại. Đồ thị không có cạnh nào có chu trình Euler tầm thường — trả ${c('"CYCLE"')}.</p>
<p>Königsberg (4 đỉnh, 7 cây cầu) cho ${c('"NONE"')}.</p>`,
  },
  yeuCau: { en: ['O(n + m).', 'A loop adds 2 to the degree.'], vi: ['O(n + m).', 'Khuyên cộng 2 vào bậc.'] },
  dauVao: { en: '"n", edges "u v", then GO.', vi: '"n", các cạnh "u v", rồi GO.' },
  dauRa: { en: 'CYCLE, PATH u v or NONE.', vi: 'CYCLE, PATH u v hoặc NONE.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      them: DOC,
      lenh: `                if (p[0].equals("GO")) {
                    r = EulerCheck.euler(nv, es.toArray(new int[0][]));
                    nv = -1;
                    es.clear();
                } else if (nv < 0) {
                    nv = n(0);
                } else {
                    es.add(new int[] {n(0), n(1)});
                }`,
    }),
  },
  tep: {
    'EulerCheck.java': j`
public class EulerCheck {

    static String euler(int n, int[][] edges) {
        //>> return "NONE"; // TODO
        int[] deg = new int[n];
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
        for (int[] e : edges) {
            deg[e[0]]++;
            deg[e[1]]++; // a loop: twice on the same vertex
            parent[find(parent, e[0])] = find(parent, e[1]);
        }
        int root = -1;
        for (int v = 0; v < n; v++) {
            if (deg[v] > 0) {
                if (root < 0) {
                    root = find(parent, v);
                } else if (find(parent, v) != root) {
                    return "NONE"; // edges in two components
                }
            }
        }
        int odd1 = -1, odd2 = -1, odd = 0;
        for (int v = 0; v < n; v++) {
            if (deg[v] % 2 == 1) {
                odd++;
                if (odd1 < 0) {
                    odd1 = v;
                } else {
                    odd2 = v;
                }
            }
        }
        if (odd == 0) {
            return "CYCLE";
        }
        return odd == 2 ? "PATH " + odd1 + " " + odd2 : "NONE";
        //<<
    }
    //>> // TODO: helper(s)

    private static int find(int[] p, int x) {
        while (p[x] != x) {
            p[x] = p[p[x]];
            x = p[x];
        }
        return x;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'Königsberg, a square, a square with a diagonal', vi: 'Königsberg, hình vuông, hình vuông có đường chéo' }, vao: '4\n0 1\n0 1\n0 2\n0 2\n0 3\n1 3\n2 3\nGO\n4\n0 1\n1 2\n2 3\n3 0\nGO\n4\n0 1\n1 2\n2 3\n3 0\n0 2\nGO\n' },
    { ten: { en: 'two components, isolated vertices, loops, no edges', vi: 'hai thành phần, đỉnh cô lập, khuyên, không có cạnh' }, vao: '6\n0 1\n1 2\n2 0\n3 4\n4 5\n5 3\nGO\n5\n1 2\n2 3\n3 1\nGO\n3\n0 0\n0 1\nGO\n3\nGO\n', an: true },
  ],
  goiY: [
    { en: 'Only vertices with at least one edge must be connected — isolated vertices do not matter.', vi: 'Chỉ các đỉnh có ít nhất một cạnh mới cần liên thông — đỉnh cô lập không ảnh hưởng.' },
    { en: 'Union-find or one DFS from any vertex with an edge both work for the connectivity test.', vi: 'Union-find hoặc một lần DFS từ một đỉnh có cạnh đều kiểm được tính liên thông.' },
  ],
  loiHayGap: [
    { en: 'Requiring the whole graph to be connected — a graph with an isolated vertex can still have an Euler cycle.', vi: 'Đòi cả đồ thị liên thông — đồ thị có đỉnh cô lập vẫn có thể có chu trình Euler.' },
    { en: 'Checking degrees only — two separate triangles have all degrees even but no Euler cycle.', vi: 'Chỉ kiểm bậc — hai tam giác rời nhau có mọi bậc chẵn nhưng không có chu trình Euler.' },
  ],
  giaiThich: { en: '<p>Euler’s theorem: a connected multigraph has an Euler cycle iff every degree is even, and an Euler path iff exactly two degrees are odd (the path joins them). Both conditions are checked in O(n + m).</p>', vi: '<p>Định lý Euler: đa đồ thị liên thông có chu trình Euler khi và chỉ khi mọi bậc chẵn, và có đường Euler khi và chỉ khi đúng hai bậc lẻ (đường nối hai đỉnh đó). Cả hai điều kiện kiểm trong O(n + m).</p>' },
});

const de2 = deJava({
  id: 'csd201-5-7-hierholzer',
  tieuDe: { en: 'Find the Euler cycle: Hierholzer with an explicit stack', vi: 'Tìm chu trình Euler: Hierholzer với ngăn xếp tường minh' },
  doKho: 'HARD', phut: 40,
  khaiNiem: ['walk until stuck, splice sub-cycles', 'stack of vertices', 'each edge used once', 'smallest neighbour first for a unique answer'],
  moTa: {
    en: `<p>The graph is connected and every degree is even. Complete ${c('static String eulerCycle(int n, int[][] edges, int start)')}: the Euler cycle from ${c('start')} as vertices separated by spaces (start … start).</p>
<p>Hierholzer: keep a stack, starting with ${c('start')}. While it is not empty, look at the top v: if v still has an unused edge, take the one to the <b>smallest</b> neighbour (ties between parallel edges: input order), mark it used and push the neighbour; otherwise pop v and append it to the answer. The answer comes out reversed — reverse it at the end. No recursion (rule R1): the big test has a million edges.</p>`,
    vi: `<p>Đồ thị liên thông và mọi bậc đều chẵn. Hoàn thiện ${c('static String eulerCycle(int n, int[][] edges, int start)')}: chu trình Euler từ ${c('start')}, các đỉnh cách nhau dấu cách (start … start).</p>
<p>Hierholzer: giữ một ngăn xếp, ban đầu là ${c('start')}. Khi chưa rỗng, xem đỉnh trên cùng v: nếu v còn cạnh chưa dùng, lấy cạnh tới đỉnh kề <b>nhỏ nhất</b> (cạnh song song: theo thứ tự nhập), đánh dấu đã dùng và đẩy đỉnh kề vào; ngược lại pop v và nối vào đáp án. Đáp án ra theo chiều ngược — đảo lại ở cuối. Không đệ quy (luật R1): phép thử lớn có một triệu cạnh.</p>`,
  },
  yeuCau: { en: ['O(m log m) (sorting the neighbours) or better.', 'No recursion (rule R1).'], vi: ['O(m log m) (sắp đỉnh kề) hoặc tốt hơn.', 'Không đệ quy (luật R1).'] },
  dauVao: { en: '"n start", edges "u v", then GO; or PERF.', vi: '"n start", các cạnh "u v", rồi GO; hoặc PERF.' },
  dauRa: { en: 'The Euler cycle.', vi: 'Chu trình Euler.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no recursion in Hierholzer', vi: 'không đệ quy trong Hierholzer', rec: 'no', file: 'Hierholzer' }],
  hen: { n: '1,000,000 edges', ms: 4000, can: 'O(m log m)', cham: 'recursive walking (StackOverflowError) or rescanning used edges' },
  harness: {
    'KiemTra.java': lopKiem({
      them: DOC + '    static int st = 0;\n',
      lenh: `                if (p[0].equals("PERF")) {
                    final int n = 1000, m = 1000000;
                    final int[][] e = new int[m][];
                    for (int i = 0; i < m; i++) {
                        int a = i % n, b = (i / n + a + 1) % n; // a union of cycles i -> i+k (mod n): every degree even
                        e[i] = new int[] {a, b};
                    }
                    final String[] res = new String[1];
                    r = Kiem.hen("1,000 vertices, 1,000,000 edges", 4000, new Runnable() {
                        public void run() {
                            res[0] = Hierholzer.eulerCycle(n, e, 0);
                        }
                    });
                    if (res[0] != null) {
                        String[] t = res[0].split(" ");
                        r += ", length " + t.length + ", ends " + t[0] + "/" + t[t.length - 1] + ", hash " + res[0].hashCode();
                    }
                } else if (p[0].equals("GO")) {
                    r = Hierholzer.eulerCycle(nv, es.toArray(new int[0][]), st);
                    nv = -1;
                    es.clear();
                } else if (nv < 0) {
                    nv = n(0);
                    st = n(1);
                } else {
                    es.add(new int[] {n(0), n(1)});
                }`,
    }),
  },
  tep: {
    'Hierholzer.java': j`
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Deque;
import java.util.List;

public class Hierholzer {

    static String eulerCycle(int n, int[][] edges, int start) {
        //>> return ""; // TODO
        List<List<int[]>> adj = new ArrayList<>(); // {neighbour, edge id}
        for (int i = 0; i < n; i++) {
            adj.add(new ArrayList<int[]>());
        }
        for (int id = 0; id < edges.length; id++) {
            int u = edges[id][0], v = edges[id][1];
            adj.get(u).add(new int[] {v, id});
            if (u != v) {
                adj.get(v).add(new int[] {u, id});
            }
        }
        for (List<int[]> l : adj) {
            Collections.sort(l, (x, y) -> x[0] != y[0] ? Integer.compare(x[0], y[0]) : Integer.compare(x[1], y[1]));
        }
        boolean[] used = new boolean[edges.length];
        int[] next = new int[n]; // the next list position to try for each vertex
        Deque<Integer> stack = new ArrayDeque<>();
        List<Integer> out = new ArrayList<>();
        stack.push(start);
        while (!stack.isEmpty()) {
            int v = stack.peek();
            List<int[]> l = adj.get(v);
            while (next[v] < l.size() && used[l.get(next[v])[1]]) {
                next[v]++; // skip edges already walked from the other end
            }
            if (next[v] == l.size()) {
                out.add(stack.pop()); // stuck: v is finished
            } else {
                int[] e = l.get(next[v]++);
                used[e[1]] = true;
                stack.push(e[0]);
            }
        }
        Collections.reverse(out);
        StringBuilder sb = new StringBuilder();
        for (int v : out) {
            sb.append(v).append(' ');
        }
        return sb.toString().trim();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a bow tie and the slides’ splice example', vi: 'hình nơ và ví dụ ghép vòng của slide' }, vao: '5 0\n0 1\n1 2\n2 0\n2 3\n3 4\n4 2\nGO\n6 0\n0 1\n1 2\n2 0\n0 3\n3 4\n4 0\n1 5\n5 2\nGO\n' },
    { ten: { en: 'a loop, parallel edges, another start', vi: 'khuyên, cạnh song song, đỉnh xuất phát khác' }, vao: '3 1\n0 1\n1 0\n1 1\n1 2\n2 1\nGO\n4 3\n0 1\n1 2\n2 3\n3 0\nGO\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Store each undirected edge in both lists with the same edge id; a used[] array per id prevents walking it twice.', vi: 'Lưu mỗi cạnh vô hướng ở cả hai danh sách với cùng mã cạnh; mảng used[] theo mã ngăn đi một cạnh hai lần.' },
    { en: 'Keep a pointer next[v] into v’s list so that used edges are skipped only once in total (otherwise rescanning makes it quadratic).', vi: 'Giữ con trỏ next[v] vào danh sách của v để mỗi cạnh đã dùng chỉ bị bỏ qua một lần (quét lại từ đầu sẽ thành bậc hai).' },
  ],
  loiHayGap: [
    { en: 'Fleury-style "walk and never come back" without splicing — the walk gets stuck before using every edge.', vi: 'Đi kiểu "đi mãi không quay lại" mà không ghép vòng — bị kẹt trước khi dùng hết cạnh.' },
    { en: 'A loop stored twice in the same list — it would be walked twice.', vi: 'Khuyên lưu hai lần trong cùng một danh sách — sẽ bị đi hai lần.' },
  ],
  giaiThich: { en: '<p>Every edge is pushed once and every vertex occurrence popped once, so the walk is O(m) after sorting the lists. Popping a vertex only when it is stuck is what splices the sub-cycles into one big cycle — the stack does the "insert this loop here" work of the slides.</p>', vi: '<p>Mỗi cạnh được đẩy một lần và mỗi lần xuất hiện của đỉnh được pop một lần, nên phần đi là O(m) sau khi sắp danh sách. Chỉ pop một đỉnh khi nó bị kẹt chính là điều ghép các vòng con thành một chu trình lớn — ngăn xếp làm việc "chèn vòng này vào đây" của slide.</p>' },
});

const de3 = deJava({
  id: 'csd201-5-7-hamilton',
  tieuDe: { en: 'Hamilton cycles by backtracking: count them and print the first', vi: 'Chu trình Hamilton bằng quay lui: đếm và in chu trình đầu tiên' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['visit every vertex exactly once', 'backtracking with a visited array', 'NP-complete: no known fast algorithm'],
  moTa: {
    en: `<p>An undirected simple graph as an adjacency matrix, vertices ${c('A…')} (n ≤ 10). Complete in ${c('Hamilton')}:</p>
<ul><li>${c('long count(int[][] a)')} — the number of Hamilton cycles starting at A, counted as sequences: a cycle and its reverse count as <b>two</b>;</li>
<li>${c('String first(int[][] a)')} — the lexicographically first one as labels, e.g. ${c('"A B C D A"')}, or ${c('"none"')}.</li></ul>
<p>Backtracking: extend a path from A one vertex at a time (neighbours in increasing order), never revisiting; when all n vertices are on the path and the last one is adjacent to A, a cycle is found.</p>`,
    vi: `<p>Đồ thị đơn vô hướng dạng ma trận kề, đỉnh ${c('A…')} (n ≤ 10). Hoàn thiện trong ${c('Hamilton')}: ${c('count(a)')} — số chu trình Hamilton bắt đầu ở A, đếm theo dãy: một chu trình và chiều ngược của nó tính là <b>hai</b>; ${c('first(a)')} — chu trình đầu tiên theo thứ tự từ điển, vd ${c('"A B C D A"')}, hoặc ${c('"none"')}.</p>
<p>Quay lui: kéo dài đường đi từ A từng đỉnh một (đỉnh kề theo thứ tự tăng), không bao giờ quay lại đỉnh đã đi; khi đủ n đỉnh và đỉnh cuối kề A thì tìm được một chu trình.</p>`,
  },
  yeuCau: { en: ['Recursive backtracking.', 'n = 1 or 2: no cycle (count 0).'], vi: ['Quay lui đệ quy.', 'n = 1 hoặc 2: không có chu trình (count 0).'] },
  dauVao: { en: 'n, then the matrix; several graphs.', vi: 'n, rồi ma trận; nhiều đồ thị.' },
  dauRa: { en: 'The count and the first cycle.', vi: 'Số chu trình và chu trình đầu tiên.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                int nn = n(0);
                int[][] a = new int[nn][nn];
                for (int i = 0; i < nn; i++) {
                    String[] q = sc.nextLine().trim().split("\\\\s+");
                    for (int k = 0; k < nn; k++) {
                        a[i][k] = Integer.parseInt(q[k]);
                    }
                }
                r = "count " + Hamilton.count(a) + ", first " + Hamilton.first(a);`,
    }),
  },
  tep: {
    'Hamilton.java': j`
public class Hamilton {
    static final String LABELS = "ABCDEFGHIJKLMNOP";

    static long count(int[][] a) {
        //>> return 0; // TODO
        int n = a.length;
        if (n < 3) {
            return 0;
        }
        boolean[] used = new boolean[n];
        used[0] = true;
        return extend(a, 0, 1, used, new int[n], null);
        //<<
    }

    static String first(int[][] a) {
        //>> return "none"; // TODO
        int n = a.length;
        if (n < 3) {
            return "none";
        }
        boolean[] used = new boolean[n];
        used[0] = true;
        int[] path = new int[n];
        StringBuilder found = new StringBuilder();
        extend(a, 0, 1, used, path, found);
        return found.length() == 0 ? "none" : found.toString();
        //<<
    }
    //>> // TODO: helper(s)

    // path[0..len-1] is a simple path from A ending at v; counts the cycles that complete it
    // (when found != null: stops at the first one and writes it into found)
    private static long extend(int[][] a, int v, int len, boolean[] used, int[] path, StringBuilder found) {
        int n = a.length;
        path[len - 1] = v;
        if (len == n) {
            if (a[v][0] == 0) {
                return 0;
            }
            if (found != null) {
                for (int i = 0; i < n; i++) {
                    found.append(LABELS.charAt(path[i])).append(' ');
                }
                found.append('A');
            }
            return 1;
        }
        long total = 0;
        for (int w = 0; w < n; w++) {
            if (a[v][w] != 0 && !used[w]) {
                used[w] = true;
                total += extend(a, w, len + 1, used, path, found);
                used[w] = false;
                if (found != null && found.length() > 0) {
                    return total;
                }
            }
        }
        return total;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'a square, K4, the slides’ house graph', vi: 'hình vuông, K4, đồ thị "ngôi nhà" của slide' }, vao: '4\n0 1 0 1\n1 0 1 0\n0 1 0 1\n1 0 1 0\n4\n0 1 1 1\n1 0 1 1\n1 1 0 1\n1 1 1 0\n5\n0 1 1 0 0\n1 0 1 1 0\n1 1 0 0 1\n0 1 0 0 1\n0 0 1 1 0\n' },
    { ten: { en: 'a star (no cycle), tiny graphs, the Petersen graph', vi: 'hình sao (không có chu trình), đồ thị rất nhỏ, đồ thị Petersen' }, vao: '4\n0 1 1 1\n1 0 0 0\n1 0 0 0\n1 0 0 0\n2\n0 1\n1 0\n3\n0 1 1\n1 0 1\n1 1 0\n10\n0 1 0 0 1 1 0 0 0 0\n1 0 1 0 0 0 1 0 0 0\n0 1 0 1 0 0 0 1 0 0\n0 0 1 0 1 0 0 0 1 0\n1 0 0 1 0 0 0 0 0 1\n1 0 0 0 0 0 0 1 1 0\n0 1 0 0 0 0 0 0 1 1\n0 0 1 0 0 1 0 0 0 1\n0 0 0 1 0 1 1 0 0 0\n0 0 0 0 1 0 1 1 0 0\n', an: true },
  ],
  goiY: [
    { en: 'Fix A as the start so that rotations of the same cycle are not counted again.', vi: 'Cố định A là điểm đầu để các phép xoay của cùng một chu trình không bị đếm lại.' },
    { en: 'Only the last vertex needs the extra test "adjacent to A".', vi: 'Chỉ đỉnh cuối cần thêm phép kiểm "kề với A".' },
  ],
  loiHayGap: [
    { en: 'Forgetting to un-mark used[w] after the recursive call — later branches cannot use w.', vi: 'Quên bỏ đánh dấu used[w] sau lời gọi đệ quy — các nhánh sau không dùng được w.' },
    { en: 'Accepting a path of n vertices without checking the closing edge to A — that counts Hamilton paths.', vi: 'Nhận đường đi n đỉnh mà không kiểm cạnh khép về A — đó là đếm đường Hamilton.' },
  ],
  giaiThich: { en: '<p>Unlike Euler cycles (a degree test), deciding whether a Hamilton cycle exists is NP-complete: no polynomial algorithm is known. Backtracking explores at most (n−1)! orderings — fine for n ≤ 10, hopeless for n = 50. The Petersen graph is the classic example of a graph with no Hamilton cycle.</p>', vi: '<p>Khác với chu trình Euler (kiểm bậc), quyết định có chu trình Hamilton hay không là bài toán NP-đầy đủ: chưa biết thuật toán đa thức nào. Quay lui duyệt tối đa (n−1)! thứ tự — ổn với n ≤ 10, vô vọng với n = 50. Đồ thị Petersen là ví dụ kinh điển của đồ thị không có chu trình Hamilton.</p>' },
});

export default moDun({ slug: 'csd201-euler', ten: '5.7 Euler tours, Euler cycles & Hamilton', de: [de1, de2, de3] });
