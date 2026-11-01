/** CSD201 · 5.6 — Cây khung nhỏ nhất: Prim trên ma trận (thứ tự cạnh được chọn, kiểu PE), Kruskal + union-find (kiểm 10⁶ cạnh), nối các thành phố khi đã có sẵn vài con đường. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-5-6-prim-matrix',
  tieuDe: { en: 'Prim’s algorithm on a matrix: the edges in the order they are chosen', vi: 'Thuật toán Prim trên ma trận: các cạnh theo thứ tự được chọn' },
  doKho: 'MEDIUM', phut: 30, dangBai: 'pe',
  khaiNiem: ['grow one tree from a start vertex', 'the cheapest edge leaving the tree', 'key[] and parent[] arrays', 'O(n²)'],
  moTa: {
    en: `<p>An undirected weighted graph as a symmetric matrix (${c('0')} = no edge), vertices ${c('A…')}. Complete ${c('static String prim(int[][] a, int s)')}: grow the tree from s; at each step add the vertex outside the tree with the cheapest edge to the tree (ties: the smallest vertex index), and write that edge as ${c('"X-Y(w)"')} with X the tree vertex. Return the edges separated by spaces, then ${c('" | total W"')}; if the graph is disconnected return the edges found and ${c('" | disconnected"')}.</p>`,
    vi: `<p>Đồ thị vô hướng có trọng số dạng ma trận đối xứng (${c('0')} = không có cạnh), đỉnh ${c('A…')}. Hoàn thiện ${c('static String prim(int[][] a, int s)')}: phát triển cây từ s; mỗi bước thêm đỉnh ngoài cây có cạnh rẻ nhất nối vào cây (bằng nhau thì chỉ số đỉnh nhỏ nhất), và ghi cạnh đó dạng ${c('"X-Y(w)"')} với X là đỉnh trong cây. Trả các cạnh cách nhau dấu cách, rồi ${c('" | total W"')}; đồ thị không liên thông thì trả các cạnh đã tìm và ${c('" | disconnected"')}.</p>`,
  },
  yeuCau: { en: ['key[v] = cheapest edge from the tree to v, parent[v] = its tree end; O(n²).', 'Ties on the key: the smallest index; key updates only on strictly smaller weights.'], vi: ['key[v] = cạnh rẻ nhất từ cây tới v, parent[v] = đầu mút trong cây; O(n²).', 'key bằng nhau: chỉ số nhỏ nhất; chỉ cập nhật key khi trọng số nhỏ hơn hẳn.'] },
  dauVao: { en: 'n, the matrix, then "PRIM s".', vi: 'n, ma trận, rồi "PRIM s".' },
  dauRa: { en: 'The chosen edges and the total.', vi: 'Các cạnh được chọn và tổng.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        int[][] a = null;',
      lenh: `                if (p[0].equals("PRIM")) {
                    r = Prim.prim(a, p[1].charAt(0) - 'A');
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
    'Prim.java': j`
public class Prim {
    static final String LABELS = "ABCDEFGHIJKLMNOP";

    static String prim(int[][] a, int s) {
        //>> return ""; // TODO
        int n = a.length;
        int[] key = new int[n];
        int[] parent = new int[n];
        boolean[] in = new boolean[n];
        java.util.Arrays.fill(key, Integer.MAX_VALUE);
        java.util.Arrays.fill(parent, -1);
        key[s] = 0;
        StringBuilder sb = new StringBuilder();
        long total = 0;
        for (int step = 0; step < n; step++) {
            int u = -1;
            for (int v = 0; v < n; v++) {
                if (!in[v] && (u == -1 || key[v] < key[u])) {
                    u = v;
                }
            }
            if (key[u] == Integer.MAX_VALUE) {
                return sb.toString().trim() + " | disconnected";
            }
            in[u] = true;
            if (parent[u] >= 0) {
                sb.append(LABELS.charAt(parent[u])).append('-').append(LABELS.charAt(u)).append('(').append(key[u]).append(") ");
                total += key[u];
            }
            for (int v = 0; v < n; v++) {
                if (!in[v] && a[u][v] > 0 && a[u][v] < key[v]) {
                    key[v] = a[u][v];
                    parent[v] = u;
                }
            }
        }
        return sb.toString().trim() + " | total " + total;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ 7-vertex example from A and from D', vi: 'ví dụ 7 đỉnh của slide từ A và từ D' }, vao: '7\n0 7 0 5 0 0 0\n7 0 8 9 7 0 0\n0 8 0 0 5 0 0\n5 9 0 0 15 6 0\n0 7 5 15 0 8 9\n0 0 0 6 8 0 11\n0 0 0 0 9 11 0\nPRIM A\nPRIM D\n' },
    { ten: { en: 'ties and a disconnected graph', vi: 'trọng số bằng nhau và đồ thị không liên thông' }, vao: '4\n0 1 1 1\n1 0 1 1\n1 1 0 1\n1 1 1 0\nPRIM C\n4\n0 3 0 0\n3 0 0 0\n0 0 0 2\n0 0 2 0\nPRIM A\n', an: true },
  ],
  goiY: [
    { en: 'Prim is Dijkstra with "distance to the tree" (the edge weight alone) instead of "distance from the start".', vi: 'Prim là Dijkstra với "khoảng cách tới cây" (chỉ trọng số cạnh) thay vì "khoảng cách từ đỉnh đầu".' },
    { en: 'When u enters the tree, the edge parent[u]–u enters with it; the start vertex has no edge.', vi: 'Khi u vào cây, cạnh parent[u]–u vào theo; đỉnh xuất phát không có cạnh.' },
  ],
  loiHayGap: [
    { en: 'Updating key[v] with d[u] + w (Dijkstra’s relaxation) — that builds a shortest-path tree, not a minimum spanning tree.', vi: 'Cập nhật key[v] bằng d[u] + w (nới lỏng kiểu Dijkstra) — tạo cây đường đi ngắn nhất, không phải cây khung nhỏ nhất.' },
    { en: 'Treating 0 as an edge of weight 0.', vi: 'Coi 0 là cạnh trọng số 0.' },
  ],
  giaiThich: { en: '<p>The cut property guarantees that the cheapest edge leaving the current tree belongs to some minimum spanning tree, so the greedy choice is safe. The array version is O(n²), ideal for dense matrices; with a heap on lists it becomes O(m log n).</p>', vi: '<p>Tính chất lát cắt bảo đảm cạnh rẻ nhất rời khỏi cây hiện tại thuộc về một cây khung nhỏ nhất nào đó, nên lựa chọn tham lam là an toàn. Bản mảng O(n²), hợp với ma trận dày; dùng heap trên danh sách kề thì thành O(m log n).</p>' },
});

const de2 = deJava({
  id: 'csd201-5-6-kruskal',
  tieuDe: { en: 'Kruskal with union-find: a million edges', vi: 'Kruskal với union-find: một triệu cạnh' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['sort the edges', 'union-find with path compression and union by size', 'O(m log m)'],
  moTa: {
    en: `<p>Complete ${c('static long kruskal(int n, int[][] edges, StringBuilder chosen)')}: ${c('edges[i] = {u, v, w}')} undirected. Sort the edges by weight (ties: by u, then by v), take an edge when its ends are in different components (union-find), append ${c('"u-v "')} to ${c('chosen')} for each taken edge (when chosen is not null), and return the total weight — or ${c('-1')} if the graph is not connected.</p>
<p>Union-find: ${c('find')} with path compression, ${c('union')} by size. Without them a chain of unions makes ${c('find')} O(n).</p>`,
    vi: `<p>Hoàn thiện ${c('static long kruskal(int n, int[][] edges, StringBuilder chosen)')}: ${c('edges[i] = {u, v, w}')} vô hướng. Sắp cạnh theo trọng số (bằng nhau: theo u, rồi v), lấy cạnh khi hai đầu ở hai thành phần khác nhau (union-find), nối ${c('"u-v "')} vào ${c('chosen')} cho mỗi cạnh được lấy (khi chosen khác null), và trả tổng trọng số — hoặc ${c('-1')} nếu đồ thị không liên thông.</p>
<p>Union-find: ${c('find')} có nén đường, ${c('union')} theo kích thước. Thiếu chúng, một chuỗi phép hợp làm ${c('find')} thành O(n).</p>`,
  },
  yeuCau: { en: ['O(m log m).', 'Exact tie order: (w, u, v).'], vi: ['O(m log m).', 'Đúng thứ tự khi bằng nhau: (w, u, v).'] },
  dauVao: { en: '"n", edges "u v w", then GO; or PERF.', vi: '"n", các cạnh "u v w", rồi GO; hoặc PERF.' },
  dauRa: { en: 'Chosen edges and the total.', vi: 'Các cạnh được chọn và tổng.' },
  main: 'KiemTra',
  hen: { n: '200,000 vertices, 1,000,000 edges', ms: 4000, can: 'O(m log m)', cham: 'union-find without compression on a chain, or checking connectivity with a traversal per edge' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        int nv = -1;\n        List<int[]> es = new ArrayList<>();',
      lenh: `                if (p[0].equals("PERF")) {
                    final int n = 200000, m = 1000000;
                    final int[][] e = new int[m][];
                    int[] a = Kiem.ngauNhien(m, n, 41), b = Kiem.ngauNhien(m, n, 42), w = Kiem.ngauNhien(m, 1000, 43);
                    for (int i = 0; i < m; i++) {
                        e[i] = new int[] {a[i], b[i], w[i]};
                    }
                    for (int i = 0; i + 1 < n; i++) {
                        e[i] = new int[] {i, i + 1, 999}; // a chain keeps it connected
                    }
                    final long[] t = new long[1];
                    r = Kiem.hen("n = 200,000, m = 1,000,000", 4000, new Runnable() {
                        public void run() {
                            t[0] = Kruskal.kruskal(n, e, null);
                        }
                    }) + ", total " + t[0];
                } else if (p[0].equals("GO")) {
                    StringBuilder ch = new StringBuilder();
                    long t = Kruskal.kruskal(nv, es.toArray(new int[0][]), ch);
                    r = "[" + ch.toString().trim() + "] total " + t;
                    nv = -1;
                    es.clear();
                } else if (nv < 0) {
                    nv = n(0);
                } else {
                    es.add(new int[] {n(0), n(1), n(2)});
                }`,
    }),
  },
  tep: {
    'Kruskal.java': j`
import java.util.Arrays;

public class Kruskal {

    static long kruskal(int n, int[][] edges, StringBuilder chosen) {
        //>> return 0; // TODO
        int[][] e = edges.clone();
        Arrays.sort(e, (x, y) -> x[2] != y[2] ? Integer.compare(x[2], y[2]) : x[0] != y[0] ? Integer.compare(x[0], y[0]) : Integer.compare(x[1], y[1]));
        int[] parent = new int[n];
        int[] size = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
        long total = 0;
        int taken = 0;
        for (int[] x : e) {
            int ru = find(parent, x[0]), rv = find(parent, x[1]);
            if (ru == rv) {
                continue; // would close a cycle
            }
            if (size[ru] < size[rv]) {
                int t = ru;
                ru = rv;
                rv = t;
            }
            parent[rv] = ru;
            size[ru] += size[rv];
            total += x[2];
            taken++;
            if (chosen != null) {
                chosen.append(x[0]).append('-').append(x[1]).append(' ');
            }
        }
        return taken == n - 1 ? total : -1;
        //<<
    }
    //>> // TODO: helper(s)

    private static int find(int[] parent, int x) {
        int root = x;
        while (parent[root] != root) {
            root = parent[root];
        }
        while (parent[x] != root) { // path compression
            int next = parent[x];
            parent[x] = root;
            x = next;
        }
        return root;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ graph with numbered vertices', vi: 'đồ thị của slide với đỉnh đánh số' }, vao: '7\n0 1 7\n0 3 5\n1 2 8\n1 3 9\n1 4 7\n2 4 5\n3 4 15\n3 5 6\n4 5 8\n4 6 9\n5 6 11\nGO\n' },
    { ten: { en: 'ties, a loop, parallel edges, disconnected', vi: 'trọng số bằng nhau, khuyên, cạnh song song, không liên thông' }, vao: '4\n0 1 1\n1 2 1\n2 3 1\n3 0 1\n0 0 0\n0 2 1\nGO\n3\n0 1 5\n0 1 2\nGO\n1\nGO\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'find(x) walks to the root; afterwards point every node on that walk straight at the root (path compression).', vi: 'find(x) đi tới gốc; sau đó cho mọi nút trên đường đi trỏ thẳng vào gốc (nén đường).' },
    { en: 'A spanning tree has exactly n − 1 edges: fewer means the graph was disconnected.', vi: 'Cây khung có đúng n − 1 cạnh: ít hơn nghĩa là đồ thị không liên thông.' },
  ],
  loiHayGap: [
    { en: 'Sorting by weight only — ties come out in an unspecified order and the chosen edges differ.', vi: 'Chỉ sắp theo trọng số — cạnh bằng nhau ra theo thứ tự không xác định và các cạnh được chọn khác đi.' },
    { en: 'Recursive find on a long chain — StackOverflowError before compression helps.', vi: 'find đệ quy trên chuỗi dài — StackOverflowError trước khi nén đường kịp giúp.' },
  ],
  giaiThich: { en: '<p>Sorting dominates: O(m log m). With path compression and union by size each find/union is almost O(1) (inverse Ackermann). Taking the cheapest edge that joins two components is safe by the cut property — the same proof as Prim, applied to one cut at a time.</p>', vi: '<p>Phần sắp xếp chiếm ưu thế: O(m log m). Có nén đường và hợp theo kích thước thì mỗi find/union gần như O(1) (hàm Ackermann ngược). Lấy cạnh rẻ nhất nối hai thành phần là an toàn theo tính chất lát cắt — cùng chứng minh với Prim, áp cho từng lát cắt.</p>' },
});

const de3 = deJava({
  id: 'csd201-5-6-connect-cities',
  tieuDe: { en: 'Connect every city: some roads already exist (cost 0)', vi: 'Nối mọi thành phố: đã có sẵn vài con đường (chi phí 0)' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['union the existing roads first', 'Kruskal on the candidate roads', 'the answer may be impossible'],
  moTa: {
    en: `<p>${c('static long minExtraCost(int n, int[][] existing, int[][] candidates)')}: cities 0..n−1, roads ${c('existing[i] = {u, v}')} are already built, ${c('candidates[i] = {u, v, cost}')} may be built. Return the minimum total cost of new roads so that every city can reach every other, or −1 if impossible. Union the existing roads first, then run Kruskal on the candidates only.</p>`,
    vi: `<p>${c('static long minExtraCost(int n, int[][] existing, int[][] candidates)')}: thành phố 0..n−1, các đường ${c('existing[i] = {u, v}')} đã xây, ${c('candidates[i] = {u, v, cost}')} có thể xây. Trả tổng chi phí nhỏ nhất của đường mới để mọi thành phố tới được nhau, hoặc −1 nếu không thể. Hợp các đường đã có trước, rồi chạy Kruskal chỉ trên các đường ứng viên.</p>`,
  },
  yeuCau: { en: ['Union-find; O((e + c) log c).', '−1 when some city stays apart.'], vi: ['Union-find; O((e + c) log c).', '−1 khi còn thành phố bị tách rời.'] },
  dauVao: { en: '"n", "E u v" lines, "C u v cost" lines, then GO.', vi: '"n", các dòng "E u v", các dòng "C u v cost", rồi GO.' },
  dauRa: { en: 'The minimum extra cost.', vi: 'Chi phí thêm nhỏ nhất.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        int nv = -1;\n        List<int[]> ex = new ArrayList<>(), ca = new ArrayList<>();',
      lenh: `                if (p[0].equals("GO")) {
                    r = String.valueOf(Cities.minExtraCost(nv, ex.toArray(new int[0][]), ca.toArray(new int[0][])));
                    nv = -1;
                    ex.clear();
                    ca.clear();
                } else if (p[0].equals("E")) {
                    ex.add(new int[] {n(1), n(2)});
                } else if (p[0].equals("C")) {
                    ca.add(new int[] {n(1), n(2), n(3)});
                } else {
                    nv = n(0);
                }`,
    }),
  },
  tep: {
    'Cities.java': j`
import java.util.Arrays;

public class Cities {

    static long minExtraCost(int n, int[][] existing, int[][] candidates) {
        //>> return -1; // TODO
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
        int components = n;
        for (int[] e : existing) {
            if (union(parent, e[0], e[1])) {
                components--;
            }
        }
        int[][] c = candidates.clone();
        Arrays.sort(c, (x, y) -> Integer.compare(x[2], y[2]));
        long cost = 0;
        for (int[] e : c) {
            if (components == 1) {
                break;
            }
            if (union(parent, e[0], e[1])) {
                cost += e[2];
                components--;
            }
        }
        return components == 1 ? cost : -1;
        //<<
    }
    //>> // TODO: helper(s)

    private static int find(int[] p, int x) {
        while (p[x] != x) {
            p[x] = p[p[x]]; // path halving
            x = p[x];
        }
        return x;
    }

    private static boolean union(int[] p, int a, int b) {
        int ra = find(p, a), rb = find(p, b);
        if (ra == rb) {
            return false;
        }
        p[ra] = rb;
        return true;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'some roads exist', vi: 'đã có vài con đường' }, vao: '5\nE 0 1\nE 1 2\nC 2 3 4\nC 0 3 2\nC 3 4 7\nC 2 4 3\nGO\n4\nE 0 1\nE 2 3\nE 1 2\nC 0 3 100\nGO\n' },
    { ten: { en: 'impossible, no existing roads, a single city', vi: 'không thể, không có đường nào, một thành phố' }, vao: '4\nE 0 1\nC 2 3 1\nGO\n3\nC 0 1 5\nC 1 2 6\nC 0 2 4\nGO\n1\nGO\n', an: true },
  ],
  goiY: [
    { en: 'Count the components while you union: each successful union lowers the count by one.', vi: 'Đếm số thành phần trong lúc hợp: mỗi lần hợp thành công giảm số đó đi một.' },
    { en: 'Existing roads are "free edges": process them before any candidate.', vi: 'Đường có sẵn là "cạnh miễn phí": xử lý chúng trước mọi ứng viên.' },
  ],
  loiHayGap: [
    { en: 'Adding the existing roads to the candidate list with cost 0 is fine — but forgetting them entirely builds roads that already exist.', vi: 'Cho đường có sẵn vào danh sách ứng viên với chi phí 0 thì được — nhưng quên hẳn chúng sẽ xây lại đường đã có.' },
    { en: 'Returning the cost even when cities remain disconnected.', vi: 'Vẫn trả chi phí khi còn thành phố chưa nối.' },
  ],
  giaiThich: { en: '<p>Contracting the existing roads leaves a graph of components, and the cheapest way to connect components is an MST on them — exactly what Kruskal computes once the free edges are merged first.</p>', vi: '<p>Gộp các đường có sẵn để lại một đồ thị các thành phần, và cách rẻ nhất để nối chúng là cây khung nhỏ nhất trên chúng — đúng điều Kruskal tính khi đã gộp các cạnh miễn phí trước.</p>' },
});

export default moDun({ slug: 'csd201-mst', ten: '5.6 Minimum spanning trees: Prim & Kruskal', de: [de1, de2, de3] });
