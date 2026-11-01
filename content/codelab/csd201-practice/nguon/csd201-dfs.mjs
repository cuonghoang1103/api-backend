/** CSD201 · 5.3 — DFS: phát hiện chu trình có hướng + thứ tự topo theo thời điểm kết thúc, Kahn với hàng đợi ưu tiên (kiểm O(n+m)), thành phần liên thông bằng DFS lặp trên 10⁶ đỉnh. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

// lớp kiểm: "n" rồi các cạnh "u v", kết thúc bằng lệnh
const DOC_DS = `
    static int nv = -1;
    static List<int[]> es = new ArrayList<>();

    static List<List<Integer>> adj() {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < nv; i++) {
            g.add(new ArrayList<Integer>());
        }
        for (int[] e : es) {
            g.get(e[0]).add(e[1]);
        }
        for (List<Integer> l : g) {
            Collections.sort(l);
        }
        return g;
    }
`;

const de1 = deJava({
  id: 'csd201-5-3-cycle-topo-dfs',
  tieuDe: { en: 'Directed cycle detection and a topological order from DFS finishing times', vi: 'Phát hiện chu trình có hướng và thứ tự topo từ thời điểm kết thúc DFS' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['white / grey / black colouring', 'a back edge = a cycle', 'reverse postorder = topological order'],
  moTa: {
    en: `<p>On a directed graph given by sorted adjacency lists, complete ${c('static String topo(List<List<Integer>> g)')}: run DFS from every unvisited vertex in increasing order (neighbours in list order) with three colours — white (unvisited), grey (on the current DFS path), black (finished). Meeting a <b>grey</b> vertex means a cycle: return ${c('"CYCLE"')}. Otherwise append each vertex when it <b>finishes</b>; the reverse of that list is a topological order — return it separated by spaces.</p>
<p>Example: edges 0→1, 0→2, 1→3, 2→3 give finishing order 3 1 2 0, so the answer is ${c('"0 2 1 3"')}.</p>`,
    vi: `<p>Trên đồ thị có hướng cho bằng danh sách kề đã sắp, hoàn thiện ${c('static String topo(List<List<Integer>> g)')}: chạy DFS từ mọi đỉnh chưa thăm theo thứ tự tăng (đỉnh kề theo thứ tự danh sách) với ba màu — trắng (chưa thăm), xám (đang trên đường DFS), đen (đã xong). Gặp đỉnh <b>xám</b> nghĩa là có chu trình: trả ${c('"CYCLE"')}. Ngược lại nối mỗi đỉnh khi nó <b>kết thúc</b>; đảo ngược danh sách đó là một thứ tự topo — trả về cách nhau dấu cách.</p>
<p>Ví dụ: cạnh 0→1, 0→2, 1→3, 2→3 cho thứ tự kết thúc 3 1 2 0, nên đáp án là ${c('"0 2 1 3"')}.</p>`,
  },
  yeuCau: { en: ['Recursive DFS with three colours.', 'Exactly this traversal order (the answer is unique under it).'], vi: ['DFS đệ quy với ba màu.', 'Đúng thứ tự duyệt này (đáp án là duy nhất theo nó).'] },
  dauVao: { en: '"n", edges "u v", then TOPO.', vi: '"n", các cạnh "u v", rồi TOPO.' },
  dauRa: { en: 'The order or CYCLE.', vi: 'Thứ tự hoặc CYCLE.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      them: DOC_DS,
      lenh: `                if (p[0].equals("TOPO")) {
                    r = TopoDfs.topo(adj());
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
    'TopoDfs.java': j`
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TopoDfs {

    static String topo(List<List<Integer>> g) {
        //>> return ""; // TODO
        int n = g.size();
        int[] color = new int[n]; // 0 white, 1 grey, 2 black
        List<Integer> finished = new ArrayList<>();
        for (int v = 0; v < n; v++) {
            if (color[v] == 0 && !dfs(g, v, color, finished)) {
                return "CYCLE";
            }
        }
        Collections.reverse(finished);
        StringBuilder sb = new StringBuilder();
        for (int v : finished) {
            sb.append(v).append(' ');
        }
        return sb.toString().trim();
        //<<
    }
    //>> // TODO: helper(s)

    // false if a cycle is found
    private static boolean dfs(List<List<Integer>> g, int v, int[] color, List<Integer> finished) {
        color[v] = 1;
        for (int w : g.get(v)) {
            if (color[w] == 1) {
                return false; // back edge to a vertex on the current path
            }
            if (color[w] == 0 && !dfs(g, w, color, finished)) {
                return false;
            }
        }
        color[v] = 2;
        finished.add(v);
        return true;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'a DAG and a graph with a cycle', vi: 'một DAG và một đồ thị có chu trình' }, vao: '4\n0 1\n0 2\n1 3\n2 3\nTOPO\n3\n0 1\n1 2\n2 0\nTOPO\n' },
    { ten: { en: 'a loop, a cross edge that is not a cycle, isolated vertices', vi: 'một khuyên, một cạnh chéo không phải chu trình, đỉnh cô lập' }, vao: '2\n1 1\nTOPO\n5\n0 2\n1 2\n3 1\n3 0\nTOPO\n6\n5 0\n4 0\n5 2\n2 3\n3 1\n4 1\nTOPO\n', an: true },
  ],
  goiY: [
    { en: 'Grey = "entered but not finished". An edge to a grey vertex goes back up the current path — a cycle. An edge to a black vertex is harmless.', vi: 'Xám = "đã vào nhưng chưa xong". Cạnh tới đỉnh xám quay ngược lên đường hiện tại — chu trình. Cạnh tới đỉnh đen thì vô hại.' },
    { en: 'A vertex finishes after everything reachable from it: in reverse finishing order every edge points forward.', vi: 'Một đỉnh kết thúc sau mọi đỉnh tới được từ nó: theo thứ tự kết thúc đảo ngược, mọi cạnh đều chỉ về phía trước.' },
  ],
  loiHayGap: [
    { en: 'Using a single visited flag — an edge to an already finished vertex (a cross edge) is reported as a cycle.', vi: 'Dùng một cờ visited duy nhất — cạnh tới đỉnh đã xong (cạnh chéo) bị báo là chu trình.' },
    { en: 'Printing the finishing order itself — that is a reverse topological order.', vi: 'In chính thứ tự kết thúc — đó là thứ tự topo đảo ngược.' },
  ],
  giaiThich: { en: '<p>DFS visits each vertex and edge once: O(n + m). A directed graph is acyclic exactly when DFS finds no back edge, and then sorting by decreasing finishing time is a valid topological order (the slides’ "TopoDfs").</p>', vi: '<p>DFS thăm mỗi đỉnh và mỗi cạnh một lần: O(n + m). Đồ thị có hướng không có chu trình đúng khi DFS không gặp cạnh ngược, và khi đó sắp theo thời điểm kết thúc giảm dần là một thứ tự topo hợp lệ (bài "TopoDfs" của slide).</p>' },
});

const de2 = deJava({
  id: 'csd201-5-3-kahn',
  tieuDe: { en: 'Kahn’s algorithm: the smallest available course first', vi: 'Thuật toán Kahn: môn học có thể học được nhỏ nhất trước' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['in-degree', 'a queue of vertices with in-degree 0', 'lexicographically smallest order with a PriorityQueue', 'O((n + m) log n)'],
  moTa: {
    en: `<p>Courses 0..n−1 and prerequisites ${c('u v')} ("u before v"). Complete ${c('static int[] order(int n, int[][] edges)')}: the topological order that always takes the <b>smallest</b> course whose prerequisites are all done (so the answer is unique), or an empty array if some courses can never be taken (a cycle).</p>
<p>Count in-degrees, put every 0-in-degree course in a ${c('PriorityQueue')}, repeatedly poll the smallest, output it and decrease the in-degree of its successors. The complexity check has 200,000 courses and 1,000,000 prerequisites.</p>`,
    vi: `<p>Các môn 0..n−1 và điều kiện tiên quyết ${c('u v')} ("u trước v"). Hoàn thiện ${c('static int[] order(int n, int[][] edges)')}: thứ tự topo luôn chọn môn <b>nhỏ nhất</b> mà mọi môn tiên quyết đã xong (nên đáp án là duy nhất), hoặc mảng rỗng nếu có môn không bao giờ học được (có chu trình).</p>
<p>Đếm bậc vào, cho mọi môn bậc vào 0 vào ${c('PriorityQueue')}, lặp lấy môn nhỏ nhất ra, ghi lại và giảm bậc vào của các môn sau nó. Kiểm độ phức tạp có 200.000 môn và 1.000.000 điều kiện.</p>`,
  },
  yeuCau: { en: ['O((n + m) log n) with adjacency lists.', 'Empty array when there is a cycle.'], vi: ['O((n + m) log n) với danh sách kề.', 'Có chu trình thì trả mảng rỗng.'] },
  dauVao: { en: '"n", edges "u v", then GO; or PERF.', vi: '"n", các cạnh "u v", rồi GO; hoặc PERF.' },
  dauRa: { en: 'The order.', vi: 'Thứ tự.' },
  main: 'KiemTra',
  hen: { n: '200,000 vertices, 1,000,000 edges', ms: 4000, can: 'O((n + m) log n)', cham: 'O(n²) (scanning all vertices for in-degree 0 at every step)' },
  harness: {
    'KiemTra.java': lopKiem({
      them: DOC_DS,
      lenh: `                if (p[0].equals("PERF")) {
                    final int n = 200000, m = 1000000;
                    final int[][] e = new int[m][];
                    int[] a = Kiem.ngauNhien(m, n, 8), b = Kiem.ngauNhien(m, n, 9);
                    for (int i = 0; i < m; i++) {
                        int x = Math.min(a[i], b[i]), y = Math.max(a[i], b[i]);
                        e[i] = new int[] {x, y == x ? Math.min(n - 1, x + 1) : y};
                    }
                    final int[][] o = new int[1][];
                    r = Kiem.hen("n = 200,000, m = 1,000,000 (acyclic)", 4000, new Runnable() {
                        public void run() {
                            o[0] = Kahn.order(n, e);
                        }
                    }) + ", length " + (o[0] == null ? -1 : o[0].length) + ", first " + (o[0] == null || o[0].length == 0 ? "-" : o[0][0] + " " + o[0][1] + " " + o[0][2]);
                } else if (p[0].equals("GO")) {
                    r = Arrays.toString(Kahn.order(nv, es.toArray(new int[0][])));
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
    'Kahn.java': j`
import java.util.ArrayList;
import java.util.List;
import java.util.PriorityQueue;

public class Kahn {

    static int[] order(int n, int[][] edges) {
        //>> return new int[0]; // TODO
        List<List<Integer>> next = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            next.add(new ArrayList<Integer>());
        }
        int[] in = new int[n];
        for (int[] e : edges) {
            next.get(e[0]).add(e[1]);
            in[e[1]]++;
        }
        PriorityQueue<Integer> ready = new PriorityQueue<>();
        for (int v = 0; v < n; v++) {
            if (in[v] == 0) {
                ready.add(v);
            }
        }
        int[] out = new int[n];
        int k = 0;
        while (!ready.isEmpty()) {
            int v = ready.poll();
            out[k++] = v;
            for (int w : next.get(v)) {
                if (--in[w] == 0) {
                    ready.add(w);
                }
            }
        }
        return k == n ? out : new int[0]; // some vertex never reached in-degree 0: a cycle
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'courses with several valid orders', vi: 'các môn có nhiều thứ tự hợp lệ' }, vao: '6\n5 2\n5 0\n4 0\n4 1\n2 3\n3 1\nGO\n4\n1 0\n2 0\n3 1\n3 2\nGO\n' },
    { ten: { en: 'a cycle, no prerequisites, parallel prerequisites', vi: 'chu trình, không điều kiện, điều kiện lặp' }, vao: '3\n0 1\n1 2\n2 1\nGO\n3\nGO\n3\n0 2\n0 2\n1 2\nGO\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'A course can be taken when its in-degree (number of prerequisites still pending) is 0.', vi: 'Một môn học được khi bậc vào (số môn tiên quyết còn chờ) bằng 0.' },
    { en: 'If fewer than n courses are output, the remaining ones are stuck in a cycle.', vi: 'Nếu ghi ra ít hơn n môn, các môn còn lại kẹt trong một chu trình.' },
  ],
  loiHayGap: [
    { en: 'Using a FIFO queue — a valid order, but not the "smallest first" one the grader expects.', vi: 'Dùng hàng đợi FIFO — thứ tự hợp lệ nhưng không phải thứ tự "nhỏ nhất trước" máy chấm cần.' },
    { en: 'Searching all vertices for in-degree 0 in every step — O(n²).', vi: 'Mỗi bước tìm trong mọi đỉnh xem đỉnh nào bậc vào 0 — O(n²).' },
  ],
  giaiThich: { en: '<p>Each vertex enters and leaves the priority queue once (O(log n) each) and each edge decreases one counter: O((n + m) log n). Kahn’s algorithm also detects cycles for free — this is how build tools and package managers (npm, Maven) order their tasks.</p>', vi: '<p>Mỗi đỉnh vào và ra hàng đợi ưu tiên một lần (O(log n) mỗi lần) và mỗi cạnh giảm một bộ đếm: O((n + m) log n). Kahn còn phát hiện chu trình miễn phí — đây là cách công cụ build và trình quản lý gói (npm, Maven) xếp thứ tự công việc.</p>' },
});

const de3 = deJava({
  id: 'csd201-5-3-components-iterative',
  tieuDe: { en: 'Component sizes of a million-vertex graph with an iterative DFS', vi: 'Kích thước các thành phần của đồ thị một triệu đỉnh bằng DFS lặp' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['iterative DFS with an explicit stack', 'component sizes', 'why recursion fails on long paths'],
  moTa: {
    en: `<p>Complete ${c('static int[] componentSizes(int n, int[] from, int[] to)')} for an undirected graph: the sizes of all connected components, <b>sorted in decreasing order</b>. No recursion (rule R1): the big test is a path of a million vertices, which a recursive DFS cannot walk.</p>`,
    vi: `<p>Hoàn thiện ${c('static int[] componentSizes(int n, int[] from, int[] to)')} cho đồ thị vô hướng: kích thước mọi thành phần liên thông, <b>sắp giảm dần</b>. Không đệ quy (luật R1): phép thử lớn là một đường đi một triệu đỉnh, DFS đệ quy không đi nổi.</p>`,
  },
  yeuCau: { en: ['O(n + m) plus sorting the sizes.', 'No recursion (rule R1).'], vi: ['O(n + m) cộng sắp các kích thước.', 'Không đệ quy (luật R1).'] },
  dauVao: { en: '"n", edges "u v", then GO; or PERF.', vi: '"n", các cạnh "u v", rồi GO; hoặc PERF.' },
  dauRa: { en: 'The sizes.', vi: 'Các kích thước.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no recursion in Sizes', vi: 'không đệ quy trong Sizes', rec: 'no', file: 'Sizes' }],
  hen: { n: '1,000,000 vertices in one long path (+ isolated vertices)', ms: 4000, can: 'O(n + m) with an explicit stack', cham: 'recursive DFS (StackOverflowError)' },
  harness: {
    'KiemTra.java': lopKiem({
      them: DOC_DS,
      lenh: `                if (p[0].equals("PERF")) {
                    final int n = 1100000, m = 999999;
                    final int[] u = new int[m], v = new int[m];
                    for (int i = 0; i < m; i++) {
                        u[i] = i;
                        v[i] = i + 1;
                    }
                    final int[][] s = new int[1][];
                    r = Kiem.hen("a path of 1,000,000 vertices + 100,000 isolated", 4000, new Runnable() {
                        public void run() {
                            s[0] = Sizes.componentSizes(n, u, v);
                        }
                    }) + ", components " + (s[0] == null ? -1 : s[0].length) + ", largest " + (s[0] == null || s[0].length == 0 ? "-" : String.valueOf(s[0][0]));
                } else if (p[0].equals("GO")) {
                    int[] u = new int[es.size()], v = new int[es.size()];
                    for (int i = 0; i < es.size(); i++) {
                        u[i] = es.get(i)[0];
                        v[i] = es.get(i)[1];
                    }
                    r = Arrays.toString(Sizes.componentSizes(nv, u, v));
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
    'Sizes.java': j`
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Sizes {

    static int[] componentSizes(int n, int[] from, int[] to) {
        //>> return new int[0]; // TODO
        int[] start = new int[n + 1];
        for (int i = 0; i < from.length; i++) {
            start[from[i] + 1]++;
            start[to[i] + 1]++;
        }
        for (int v = 0; v < n; v++) {
            start[v + 1] += start[v];
        }
        int[] fill = java.util.Arrays.copyOf(start, n);
        int[] nb = new int[2 * from.length];
        for (int i = 0; i < from.length; i++) {
            nb[fill[from[i]]++] = to[i];
            nb[fill[to[i]]++] = from[i];
        }
        boolean[] seen = new boolean[n];
        int[] stack = new int[n];
        List<Integer> sizes = new ArrayList<>();
        for (int s = 0; s < n; s++) {
            if (seen[s]) {
                continue;
            }
            int top = 0, size = 0;
            stack[top++] = s;
            seen[s] = true;
            while (top > 0) {
                int x = stack[--top];
                size++;
                for (int k = start[x]; k < start[x + 1]; k++) {
                    if (!seen[nb[k]]) {
                        seen[nb[k]] = true;
                        stack[top++] = nb[k];
                    }
                }
            }
            sizes.add(size);
        }
        Collections.sort(sizes, Collections.reverseOrder());
        int[] out = new int[sizes.size()];
        for (int i = 0; i < out.length; i++) {
            out[i] = sizes.get(i);
        }
        return out;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'three components', vi: 'ba thành phần' }, vao: '7\n0 1\n1 2\n3 4\n2 0\nGO\n' },
    { ten: { en: 'no edges, one big component, parallel edges', vi: 'không cạnh, một thành phần lớn, cạnh song song' }, vao: '3\nGO\n4\n0 1\n1 2\n2 3\n3 0\n0 1\nGO\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'The explicit stack can be a plain int[n]: each vertex is pushed at most once if you mark it when pushing.', vi: 'Ngăn xếp tường minh có thể là int[n] đơn giản: mỗi đỉnh được đẩy tối đa một lần nếu đánh dấu khi đẩy.' },
    { en: 'Collect the sizes in a list and sort it with Collections.reverseOrder().', vi: 'Gom kích thước vào một danh sách rồi sắp bằng Collections.reverseOrder().' },
  ],
  loiHayGap: [
    { en: 'A recursive dfs(v) — StackOverflowError on the million-vertex path.', vi: 'dfs(v) đệ quy — StackOverflowError trên đường đi một triệu đỉnh.' },
    { en: 'Forgetting isolated vertices — each is a component of size 1.', vi: 'Quên các đỉnh cô lập — mỗi đỉnh là một thành phần cỡ 1.' },
  ],
  giaiThich: { en: '<p>The stack replaces the call stack; the visiting order differs from recursive DFS but the components are the same. Each vertex and edge is processed once: O(n + m), plus O(c log c) to sort c sizes.</p>', vi: '<p>Ngăn xếp thay cho ngăn xếp lời gọi; thứ tự thăm khác DFS đệ quy nhưng các thành phần thì như nhau. Mỗi đỉnh và mỗi cạnh xử lý một lần: O(n + m), cộng O(c log c) để sắp c kích thước.</p>' },
});

export default moDun({ slug: 'csd201-dfs', ten: '5.3 DFS: cycles, components, topological order', de: [de1, de2, de3] });
