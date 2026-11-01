/** CSD201 · 5.5 — Dijkstra: kiểu PE trên ma trận (99 = ∞, đường đi + thứ tự đưa vào S), bản PriorityQueue trên danh sách kề (kiểm O((n+m) log n)), lưới chi phí ô. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-5-5-dijkstra-matrix',
  tieuDe: { en: 'PE style Dijkstra on a matrix: the path, its length and the order of the set S', vi: 'Dijkstra kiểu PE trên ma trận: đường đi, độ dài và thứ tự tập S' },
  doKho: 'MEDIUM', phut: 35, dangBai: 'pe',
  khaiNiem: ['the set S of finalised vertices', 'relaxation d[v] = min(d[v], d[u] + w)', 'ties: the smallest index', 'O(n²) on a matrix'],
  moTa: {
    en: `<p>As in the CSD201 papers: a weighted directed graph as a matrix, ${c('a[i][j] = 99')} means "no edge" (∞), vertices ${c('A…')}. Complete in ${c('Dijkstra')}:</p>
<ul><li>${c('String path(int[][] a, int s, int t)')} — the shortest path as labels separated by spaces, then ${c('" | "')} and its length; ${c('"no path"')} if t is unreachable;</li>
<li>${c('String order(int[][] a, int s, int t)')} — the vertices in the order they enter S, each as ${c('label|distance')}, stopping right after t enters S.</li></ul>
<p>Rules (the answers depend on them): at each step choose the unselected vertex with the smallest distance, the <b>smallest index</b> on ties; update ${c('prev[v]')} only on a <b>strictly</b> smaller distance.</p>`,
    vi: `<p>Như đề CSD201: đồ thị có hướng có trọng số dạng ma trận, ${c('a[i][j] = 99')} nghĩa là "không có cạnh" (∞), đỉnh ${c('A…')}. Hoàn thiện trong ${c('Dijkstra')}: ${c('path(a, s, t)')} — đường đi ngắn nhất là các nhãn cách nhau dấu cách, rồi ${c('" | "')} và độ dài; t không tới được thì ${c('"no path"')}; ${c('order(a, s, t)')} — các đỉnh theo thứ tự vào S, mỗi đỉnh dạng ${c('nhãn|khoảng cách')}, dừng ngay sau khi t vào S.</p>
<p>Luật (đáp án phụ thuộc vào chúng): mỗi bước chọn đỉnh chưa chọn có khoảng cách nhỏ nhất, bằng nhau thì <b>chỉ số nhỏ nhất</b>; chỉ cập nhật ${c('prev[v]')} khi khoảng cách nhỏ hơn <b>hẳn</b>.</p>`,
  },
  yeuCau: { en: ['O(n²) array version (no PriorityQueue needed).', '99 = no edge; a[i][i] = 0.'], vi: ['Bản mảng O(n²) (không cần PriorityQueue).', '99 = không có cạnh; a[i][i] = 0.'] },
  dauVao: { en: 'n, the matrix, then "PATH s t" / "ORDER s t" (labels).', vi: 'n, ma trận, rồi "PATH s t" / "ORDER s t" (nhãn).' },
  dauRa: { en: 'The answers.', vi: 'Các câu trả lời.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        int[][] a = null;',
      lenh: `                if (p[0].equals("PATH")) {
                    r = Dijkstra.path(a, p[1].charAt(0) - 'A', p[2].charAt(0) - 'A');
                } else if (p[0].equals("ORDER")) {
                    r = Dijkstra.order(a, p[1].charAt(0) - 'A', p[2].charAt(0) - 'A');
                } else {
                    int nn = n(0);
                    a = new int[nn][nn];
                    for (int i = 0; i < nn; i++) {
                        String[] q = sc.nextLine().trim().split("\\\\s+");
                        for (int k = 0; k < nn; k++) {
                            a[i][k] = Integer.parseInt(q[k]);
                        }
                    }
                    r = "graph of " + nn;
                }`,
    }),
  },
  tep: {
    'Dijkstra.java': j`
public class Dijkstra {
    static final String LABELS = "ABCDEFGHIJKLMNOP";
    static final int INF = 99;

    static String path(int[][] a, int s, int t) {
        //>> return "no path"; // TODO
        int n = a.length;
        int[] d = new int[n];
        int[] prev = new int[n];
        run(a, s, -1, d, prev, null);
        if (d[t] >= Integer.MAX_VALUE / 2) {
            return "no path";
        }
        String p = "";
        for (int v = t; v != -1; v = prev[v]) {
            p = LABELS.charAt(v) + (p.isEmpty() ? "" : " " + p);
        }
        return p + " | " + d[t];
        //<<
    }

    static String order(int[][] a, int s, int t) {
        //>> return ""; // TODO
        StringBuilder sb = new StringBuilder();
        run(a, s, t, new int[a.length], new int[a.length], sb);
        return sb.toString().trim();
        //<<
    }
    //>> // TODO: helper(s)

    // Dijkstra from s; stops after t enters S (t = -1: never); sb gets "label|dist" in selection order
    private static void run(int[][] a, int s, int t, int[] d, int[] prev, StringBuilder sb) {
        int n = a.length;
        boolean[] inS = new boolean[n];
        java.util.Arrays.fill(d, Integer.MAX_VALUE / 2);
        java.util.Arrays.fill(prev, -1);
        d[s] = 0;
        for (int step = 0; step < n; step++) {
            int u = -1;
            for (int v = 0; v < n; v++) {
                if (!inS[v] && (u == -1 || d[v] < d[u])) { // strict < keeps the smallest index on ties
                    u = v;
                }
            }
            if (d[u] >= Integer.MAX_VALUE / 2) {
                return; // the rest is unreachable
            }
            inS[u] = true;
            if (sb != null) {
                sb.append(LABELS.charAt(u)).append('|').append(d[u]).append(' ');
            }
            if (u == t) {
                return;
            }
            for (int v = 0; v < n; v++) {
                if (!inS[v] && a[u][v] != INF && u != v && d[u] + a[u][v] < d[v]) {
                    d[v] = d[u] + a[u][v];
                    prev[v] = u;
                }
            }
        }
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'the PE paper’s 7-vertex matrix (SP26 Block 5 Paper 4, question 3)', vi: 'ma trận 7 đỉnh của đề PE (SP26 Block 5 Paper 4, câu 3)' }, vao: '7\n0 10 99 99 99 99 99\n99 0 2 10 25 80 99\n30 99 0 8 3 20 99\n20 99 99 0 99 5 10\n99 99 99 4 0 99 99\n8 99 99 99 99 0 5\n8 99 99 99 99 99 0\nPATH A G\nORDER A G\nPATH B F\nORDER B F\nPATH G A\n' },
    { ten: { en: 'unreachable vertex, ties', vi: 'đỉnh không tới được, khoảng cách bằng nhau' }, vao: '5\n0 1 1 99 99\n99 0 99 1 99\n99 99 0 1 99\n99 99 99 0 99\n99 99 99 99 0\nPATH A D\nORDER A D\nPATH A E\nPATH E A\nPATH C C\n', an: true },
  ],
  goiY: [
    { en: 'd[] starts "infinite" except d[s] = 0. Each step: pick the closest vertex not yet in S, add it to S, relax its outgoing edges.', vi: 'd[] ban đầu "vô cùng" trừ d[s] = 0. Mỗi bước: chọn đỉnh gần nhất chưa vào S, cho vào S, nới lỏng các cạnh ra của nó.' },
    { en: 'Treat 99 as "no edge" — never add it to a distance.', vi: 'Coi 99 là "không có cạnh" — đừng bao giờ cộng nó vào khoảng cách.' },
  ],
  loiHayGap: [
    { en: 'Treating 99 as a real weight — paths through "missing" edges appear.', vi: 'Coi 99 là trọng số thật — xuất hiện đường đi qua cạnh "không tồn tại".' },
    { en: 'Using <= when choosing the next vertex — ties pick the largest index and the order differs from the paper.', vi: 'Dùng <= khi chọn đỉnh kế tiếp — bằng nhau thì chọn chỉ số lớn nhất và thứ tự khác đề.' },
  ],
  giaiThich: { en: '<p>With non-negative weights the closest unselected vertex can no longer be improved, so it is final when it enters S. Selecting by scanning the array is O(n) per step and relaxing a row is O(n): O(n²) overall — the best possible for a dense matrix. Case 1 reproduces the paper’s expected answer "A B C E D G" and "E|15 D|19 F|24 G|29".</p>', vi: '<p>Với trọng số không âm, đỉnh gần nhất chưa chọn không thể được cải thiện nữa, nên nó là cuối cùng khi vào S. Chọn bằng quét mảng tốn O(n) mỗi bước và nới lỏng một hàng O(n): tổng O(n²) — tốt nhất có thể với ma trận dày. Ca 1 tái hiện đáp án của đề "A B C E D G" và "E|15 D|19 F|24 G|29".</p>' },
});

const de2 = deJava({
  id: 'csd201-5-5-dijkstra-pq',
  tieuDe: { en: 'Dijkstra with a PriorityQueue on 200,000 vertices and a million edges', vi: 'Dijkstra với PriorityQueue trên 200.000 đỉnh và một triệu cạnh' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['lazy deletion: skip stale queue entries', 'adjacency lists', 'O((n + m) log n)', 'long distances'],
  moTa: {
    en: `<p>Complete ${c('static long[] distances(int n, int[][] edges, int s)')}: ${c('edges[i] = {u, v, w}')} is a directed edge with weight 0 ≤ w ≤ 10⁹; return the shortest distance from s to every vertex (${c('-1')} if unreachable). Use adjacency lists and a ${c('PriorityQueue<long[]>')} of ${c('{distance, vertex}')}: when an entry is polled whose distance is larger than the current ${c('d[v]')}, it is stale — skip it.</p>`,
    vi: `<p>Hoàn thiện ${c('static long[] distances(int n, int[][] edges, int s)')}: ${c('edges[i] = {u, v, w}')} là cạnh có hướng trọng số 0 ≤ w ≤ 10⁹; trả khoảng cách ngắn nhất từ s tới mọi đỉnh (${c('-1')} nếu không tới được). Dùng danh sách kề và ${c('PriorityQueue<long[]>')} các cặp ${c('{khoảng cách, đỉnh}')}: khi lấy ra một mục có khoảng cách lớn hơn ${c('d[v]')} hiện tại thì nó đã cũ — bỏ qua.</p>`,
  },
  yeuCau: { en: ['O((n + m) log n).', 'Distances in long (paths can exceed 2³¹).'], vi: ['O((n + m) log n).', 'Khoảng cách kiểu long (đường đi có thể vượt 2³¹).'] },
  dauVao: { en: '"n s", edges "u v w", then GO; or PERF.', vi: '"n s", các cạnh "u v w", rồi GO; hoặc PERF.' },
  dauRa: { en: 'The distances.', vi: 'Các khoảng cách.' },
  main: 'KiemTra',
  hen: { n: '200,000 vertices, 1,000,000 edges', ms: 4000, can: 'O((n + m) log n)', cham: 'O(n²) (the array version scans every vertex at every step)' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        int nv = -1, s = 0;\n        List<int[]> es = new ArrayList<>();',
      lenh: `                if (p[0].equals("PERF")) {
                    final int n = 200000, m = 1000000;
                    final int[][] e = new int[m][];
                    int[] a = Kiem.ngauNhien(m, n, 31), b = Kiem.ngauNhien(m, n, 32), w = Kiem.ngauNhien(m, 1000000000, 33);
                    for (int i = 0; i < m; i++) {
                        e[i] = new int[] {a[i], b[i], w[i]};
                    }
                    final long[][] d = new long[1][];
                    r = Kiem.hen("n = 200,000, m = 1,000,000", 4000, new Runnable() {
                        public void run() {
                            d[0] = DijkstraPQ.distances(n, e, a[0]);
                        }
                    });
                    if (d[0] != null) {
                        long sum = 0;
                        int reach = 0;
                        for (long x : d[0]) {
                            if (x >= 0) {
                                sum += x;
                                reach++;
                            }
                        }
                        r += ", reachable " + reach + ", checksum " + sum;
                    }
                } else if (p[0].equals("GO")) {
                    r = Arrays.toString(DijkstraPQ.distances(nv, es.toArray(new int[0][]), s));
                    nv = -1;
                    es.clear();
                } else if (nv < 0) {
                    nv = n(0);
                    s = n(1);
                } else {
                    es.add(new int[] {n(0), n(1), n(2)});
                }`,
    }),
  },
  tep: {
    'DijkstraPQ.java': j`
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.PriorityQueue;

public class DijkstraPQ {

    static long[] distances(int n, int[][] edges, int s) {
        //>> return new long[n]; // TODO
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            adj.add(new ArrayList<int[]>());
        }
        for (int[] e : edges) {
            adj.get(e[0]).add(new int[] {e[1], e[2]});
        }
        long[] d = new long[n];
        Arrays.fill(d, Long.MAX_VALUE);
        d[s] = 0;
        PriorityQueue<long[]> pq = new PriorityQueue<>((x, y) -> Long.compare(x[0], y[0]));
        pq.add(new long[] {0, s});
        while (!pq.isEmpty()) {
            long[] top = pq.poll();
            int u = (int) top[1];
            if (top[0] > d[u]) {
                continue; // stale entry
            }
            for (int[] e : adj.get(u)) {
                long nd = d[u] + e[1];
                if (nd < d[e[0]]) {
                    d[e[0]] = nd;
                    pq.add(new long[] {nd, e[0]});
                }
            }
        }
        for (int i = 0; i < n; i++) {
            if (d[i] == Long.MAX_VALUE) {
                d[i] = -1;
            }
        }
        return d;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a small graph with a shortcut and an unreachable vertex', vi: 'đồ thị nhỏ có đường tắt và đỉnh không tới được' }, vao: '5 0\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\nGO\n' },
    { ten: { en: 'zero weights, parallel edges, big weights', vi: 'trọng số 0, cạnh song song, trọng số lớn' }, vao: '4 0\n0 1 0\n1 2 0\n0 2 7\n0 2 3\n2 3 1000000000\n3 0 1\nGO\n3 2\n0 1 5\n1 0 5\nGO\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Instead of decreasing a key inside the heap (Java’s PriorityQueue cannot), add a new entry and ignore the old one when it comes out.', vi: 'Thay vì giảm khoá trong heap (PriorityQueue của Java không làm được), thêm mục mới và bỏ qua mục cũ khi nó được lấy ra.' },
    { en: 'A polled entry is stale when its distance is greater than d[vertex].', vi: 'Mục lấy ra đã cũ khi khoảng cách của nó lớn hơn d[đỉnh].' },
  ],
  loiHayGap: [
    { en: 'Processing stale entries — correct results, but many extra relaxations (and a TLE on dense updates).', vi: 'Xử lý cả mục cũ — kết quả đúng nhưng thêm rất nhiều lần nới lỏng (và quá giờ khi cập nhật dày).' },
    { en: 'int distances — a path of three 10⁹ edges overflows.', vi: 'Khoảng cách kiểu int — đường ba cạnh 10⁹ là tràn.' },
  ],
  giaiThich: { en: '<p>Each edge relaxation may add one heap entry, so the heap holds O(m) entries and every operation costs O(log m) = O(log n): O((n + m) log n) in total. The array version would scan 200,000 vertices at each of 200,000 steps — 4·10¹⁰ operations.</p>', vi: '<p>Mỗi lần nới lỏng có thể thêm một mục vào heap, nên heap giữ O(m) mục và mỗi thao tác tốn O(log m) = O(log n): tổng O((n + m) log n). Bản mảng phải quét 200.000 đỉnh ở mỗi bước trong 200.000 bước — 4·10¹⁰ phép tính.</p>' },
});

const de3 = deJava({
  id: 'csd201-5-5-grid-cost',
  tieuDe: { en: 'The cheapest route across a grid of tolls (Dijkstra on cells)', vi: 'Đường rẻ nhất băng qua lưới trạm thu phí (Dijkstra trên các ô)' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['cells as vertices', 'paying the cost of the cell you enter', 'why BFS is not enough with weights'],
  moTa: {
    en: `<p>Each cell of a grid has a toll ${c('cost[r][c]')} (1–9). You start at the top-left cell (paying its toll) and move up, down, left or right to the bottom-right cell, paying the toll of every cell you enter. Complete ${c('static long cheapest(int[][] cost)')}: the minimum total. Moving only right/down is not enough (the cheapest route can go up or left), and BFS ignores weights — use Dijkstra with a priority queue of cells.</p>`,
    vi: `<p>Mỗi ô của lưới có phí ${c('cost[r][c]')} (1–9). Bạn bắt đầu ở ô trên-trái (trả phí của nó) và đi lên, xuống, trái, phải tới ô dưới-phải, trả phí mọi ô bước vào. Hoàn thiện ${c('static long cheapest(int[][] cost)')}: tổng nhỏ nhất. Chỉ đi phải/xuống là không đủ (đường rẻ nhất có thể đi lên hay sang trái), còn BFS bỏ qua trọng số — hãy dùng Dijkstra với hàng đợi ưu tiên các ô.</p>`,
  },
  yeuCau: { en: ['Dijkstra on rows × cols vertices: O(V log V).', 'Result in long.'], vi: ['Dijkstra trên hàng × cột đỉnh: O(V log V).', 'Kết quả kiểu long.'] },
  dauVao: { en: 'A grid of digits, then GO; or PERF.', vi: 'Một lưới chữ số, rồi GO; hoặc PERF.' },
  dauRa: { en: 'The minimum total toll.', vi: 'Tổng phí nhỏ nhất.' },
  main: 'KiemTra',
  hen: { n: '700 × 700 cells', ms: 4000, can: 'O(V log V)', cham: 'Bellman–Ford style repeated relaxation (O(V²))' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        List<String> rows = new ArrayList<>();',
      lenh: `                if (p[0].equals("GO")) {
                    int[][] g = new int[rows.size()][];
                    for (int i = 0; i < g.length; i++) {
                        g[i] = new int[rows.get(i).length()];
                        for (int k = 0; k < g[i].length; k++) {
                            g[i][k] = rows.get(i).charAt(k) - '0';
                        }
                    }
                    r = String.valueOf(Tolls.cheapest(g));
                    rows.clear();
                } else if (p[0].equals("PERF")) {
                    final int[][] g = new int[700][700];
                    int[] v = Kiem.ngauNhien(700 * 700, 9, 12);
                    for (int i = 0; i < 700 * 700; i++) {
                        g[i / 700][i % 700] = v[i] + 1;
                    }
                    final long[] c = new long[1];
                    r = Kiem.hen("700 x 700 tolls", 4000, new Runnable() {
                        public void run() {
                            c[0] = Tolls.cheapest(g);
                        }
                    }) + ", cheapest " + c[0];
                } else {
                    rows.add(line);
                    r = "row";
                }`,
    }),
  },
  tep: {
    'Tolls.java': j`
import java.util.PriorityQueue;

public class Tolls {

    static long cheapest(int[][] cost) {
        //>> return 0; // TODO
        int rows = cost.length, cols = cost[0].length;
        long[][] d = new long[rows][cols];
        for (long[] row : d) {
            java.util.Arrays.fill(row, Long.MAX_VALUE);
        }
        d[0][0] = cost[0][0];
        PriorityQueue<long[]> pq = new PriorityQueue<>((x, y) -> Long.compare(x[0], y[0]));
        pq.add(new long[] {d[0][0], 0});
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        while (!pq.isEmpty()) {
            long[] top = pq.poll();
            int r = (int) (top[1] / cols), c = (int) (top[1] % cols);
            if (top[0] > d[r][c]) {
                continue;
            }
            if (r == rows - 1 && c == cols - 1) {
                return top[0];
            }
            for (int k = 0; k < 4; k++) {
                int nr = r + dr[k], nc = c + dc[k];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && top[0] + cost[nr][nc] < d[nr][nc]) {
                    d[nr][nc] = top[0] + cost[nr][nc];
                    pq.add(new long[] {d[nr][nc], (long) nr * cols + nc});
                }
            }
        }
        return d[rows - 1][cols - 1];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'right/down only would cost more', vi: 'chỉ đi phải/xuống sẽ tốn hơn' }, vao: '131\n151\n111\nGO\n19111\n11191\n99991\nGO\n' },
    { ten: { en: 'one cell, a detour upwards', vi: 'một ô, đường vòng đi lên' }, vao: '7\nGO\n1111\n9991\n1111\n1999\n1111\nGO\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'The weight of the edge from cell x to cell y is cost[y]: entering y costs its toll.', vi: 'Trọng số cạnh từ ô x sang ô y là cost[y]: bước vào y thì trả phí của nó.' },
    { en: 'Encode a cell as r * cols + c inside the queue entry.', vi: 'Mã hoá ô thành r * cols + c trong mục của hàng đợi.' },
  ],
  loiHayGap: [
    { en: 'Dynamic programming with right/down moves only — wrong when the best route turns back.', vi: 'Quy hoạch động chỉ đi phải/xuống — sai khi đường tốt nhất phải quay lại.' },
    { en: 'Forgetting the toll of the starting cell.', vi: 'Quên phí của ô xuất phát.' },
  ],
  giaiThich: { en: '<p>The grid is a graph with V = rows × cols vertices and ≤ 4V edges of positive weight, so Dijkstra applies directly: O(V log V). Returning as soon as the target is polled is safe — its distance is final at that moment.</p>', vi: '<p>Lưới là đồ thị V = hàng × cột đỉnh và ≤ 4V cạnh trọng số dương, nên áp thẳng Dijkstra: O(V log V). Trả về ngay khi ô đích được lấy ra là an toàn — khoảng cách của nó đã cuối cùng lúc đó.</p>' },
});

export default moDun({ slug: 'csd201-dijkstra', ten: '5.5 Dijkstra step by step', de: [de1, de2, de3] });
