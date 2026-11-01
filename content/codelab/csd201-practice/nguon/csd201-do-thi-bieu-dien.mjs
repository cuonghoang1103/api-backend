/** CSD201 · 5.2 — Ba cách lưu đồ thị: danh sách cạnh → ma trận kề + danh sách kề (bậc vào/ra), BFS trên danh sách kề 10⁶ đỉnh (ma trận không vừa bộ nhớ), đếm đường đi độ dài k bằng luỹ thừa ma trận. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-5-2-edge-list-to-structures',
  tieuDe: { en: 'From an edge list to an adjacency matrix and adjacency lists (directed or not)', vi: 'Từ danh sách cạnh sang ma trận kề và danh sách kề (có hướng hoặc không)' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['edge list', 'adjacency matrix', 'adjacency lists', 'in-degree and out-degree'],
  moTa: {
    en: `<p>${c('GraphRep(int n, boolean directed)')} receives edges one by one with ${c('addEdge(int u, int v)')} (vertices 0..n−1; an undirected edge is stored both ways; parallel edges are kept). Complete:</p>
<ul><li>${c('int[][] matrix()')} — ${c('m[u][v]')} = number of edges u→v (both directions for undirected);</li>
<li>${c('List<List<Integer>> lists()')} — the neighbours of every vertex in <b>increasing</b> order (repeated for parallel edges);</li>
<li>${c('int outDegree(int v)')}, ${c('int inDegree(int v)')} — equal for an undirected graph.</li></ul>
<p>Store the edges in an adjacency-list structure inside the class (O(n + m) memory) and build the matrix only when asked.</p>`,
    vi: `<p>${c('GraphRep(int n, boolean directed)')} nhận từng cạnh qua ${c('addEdge(u, v)')} (đỉnh 0..n−1; cạnh vô hướng lưu cả hai chiều; giữ cạnh song song). Hoàn thiện ${c('matrix()')} — ${c('m[u][v]')} = số cạnh u→v (vô hướng thì cả hai chiều); ${c('lists()')} — các đỉnh kề của mỗi đỉnh theo thứ tự <b>tăng</b> (lặp lại với cạnh song song); ${c('outDegree(v)')}, ${c('inDegree(v)')} — bằng nhau với đồ thị vô hướng.</p>
<p>Lưu cạnh trong cấu trúc danh sách kề bên trong lớp (bộ nhớ O(n + m)) và chỉ dựng ma trận khi được hỏi.</p>`,
  },
  yeuCau: { en: ['addEdge O(1).', 'lists() sorted per vertex.'], vi: ['addEdge O(1).', 'lists() sắp theo từng đỉnh.'] },
  dauVao: { en: '"n D|U", then edges "u v", then SHOW.', vi: '"n D|U", rồi các cạnh "u v", rồi SHOW.' },
  dauRa: { en: 'Matrix, lists, degrees.', vi: 'Ma trận, danh sách kề, các bậc.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        GraphRep g = null;\n        int nv = 0;',
      lenh: `                if (p[0].equals("SHOW")) {
                    StringBuilder sb = new StringBuilder();
                    for (int[] row : g.matrix()) {
                        sb.append("\\n  ").append(Arrays.toString(row));
                    }
                    sb.append("\\n  lists ").append(g.lists());
                    for (int v = 0; v < nv; v++) {
                        sb.append("\\n  ").append(v).append(": out ").append(g.outDegree(v)).append(", in ").append(g.inDegree(v));
                    }
                    r = sb.toString();
                } else if (p.length == 2 && (p[1].equals("D") || p[1].equals("U"))) {
                    nv = n(0);
                    g = new GraphRep(nv, p[1].equals("D"));
                } else {
                    g.addEdge(n(0), n(1));
                }`,
    }),
  },
  tep: {
    'GraphRep.java': j`
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class GraphRep {
    private final int n;
    private final boolean directed;
    //>> // TODO: fields (adjacency lists)
    private final List<List<Integer>> adj = new ArrayList<>();
    private final int[] in;
    //<<

    public GraphRep(int n, boolean directed) {
        this.n = n;
        this.directed = directed;
        //>> // TODO
        in = new int[n];
        for (int i = 0; i < n; i++) {
            adj.add(new ArrayList<Integer>());
        }
        //<<
    }

    public void addEdge(int u, int v) {
        //>> // TODO
        adj.get(u).add(v);
        in[v]++;
        if (!directed) {
            adj.get(v).add(u);
            in[u]++;
        }
        //<<
    }

    public int[][] matrix() {
        //>> return new int[n][n]; // TODO
        int[][] m = new int[n][n];
        for (int u = 0; u < n; u++) {
            for (int v : adj.get(u)) {
                m[u][v]++;
            }
        }
        return m;
        //<<
    }

    public List<List<Integer>> lists() {
        //>> return new ArrayList<>(); // TODO
        List<List<Integer>> out = new ArrayList<>();
        for (List<Integer> l : adj) {
            List<Integer> c = new ArrayList<>(l);
            Collections.sort(c);
            out.add(c);
        }
        return out;
        //<<
    }

    public int outDegree(int v) {
        //>> return 0; // TODO
        return adj.get(v).size();
        //<<
    }

    public int inDegree(int v) {
        //>> return 0; // TODO
        return in[v];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a directed graph and the same edges undirected', vi: 'một đồ thị có hướng và cùng các cạnh vô hướng' }, vao: '4 D\n0 1\n0 2\n2 1\n3 0\n1 3\nSHOW\n4 U\n0 1\n0 2\n2 1\n3 0\n1 3\nSHOW\n' },
    { ten: { en: 'parallel edges and a loop', vi: 'cạnh song song và khuyên' }, vao: '3 D\n0 1\n0 1\n2 2\n1 0\nSHOW\n3 U\n2 0\n0 2\n1 1\nSHOW\n', an: true },
  ],
  goiY: [
    { en: 'Keep List<List<Integer>> adj and an in-degree array; addEdge appends v to adj[u] (and u to adj[v] if undirected).', vi: 'Giữ List<List<Integer>> adj và mảng bậc vào; addEdge nối v vào adj[u] (và u vào adj[v] nếu vô hướng).' },
    { en: 'For lists(), sort a copy of each list — do not reorder your internal lists unexpectedly.', vi: 'Với lists(), sắp một bản sao của mỗi danh sách — đừng làm đổi thứ tự danh sách bên trong một cách bất ngờ.' },
  ],
  loiHayGap: [
    { en: 'Storing an undirected edge once — the matrix is not symmetric and degrees are wrong.', vi: 'Lưu cạnh vô hướng một lần — ma trận không đối xứng và bậc sai.' },
    { en: 'Setting m[u][v] = 1 instead of adding — parallel edges disappear.', vi: 'Gán m[u][v] = 1 thay vì cộng dồn — mất cạnh song song.' },
  ],
  giaiThich: { en: '<p>The matrix answers "is there an edge u→v?" in O(1) but costs n² memory; lists cost O(n + m) and let traversals touch only real edges. An undirected loop at v appears twice in v’s list — the same "counts twice" rule as for degrees.</p>', vi: '<p>Ma trận trả lời "có cạnh u→v không?" trong O(1) nhưng tốn n² bộ nhớ; danh sách kề tốn O(n + m) và cho phép phép duyệt chỉ chạm vào cạnh thật. Khuyên vô hướng ở v xuất hiện hai lần trong danh sách của v — cùng luật "tính hai lần" như với bậc.</p>' },
});

const de2 = deJava({
  id: 'csd201-5-2-sparse-bfs',
  tieuDe: { en: 'A million vertices: BFS on adjacency lists (a matrix would need 4 TB)', vi: 'Một triệu đỉnh: BFS trên danh sách kề (ma trận cần 4 TB)' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['sparse graphs', 'compressed adjacency (CSR) or List<int[]>', 'O(n + m)'],
  moTa: {
    en: `<p>Complete ${c('static int[] bfsDistances(int n, int[] from, int[] to, int s)')}: an undirected graph with n vertices and the edges ${c('from[i] — to[i]')}; return the number of edges on a shortest path from s to every vertex, −1 if unreachable.</p>
<p>The grader calls it with n = 1,000,000 and 2,000,000 edges. An ${c('int[n][n]')} matrix would need 4·10¹² bytes (${c('OutOfMemoryError')}), and scanning a whole row per vertex would be 10¹² steps. Build adjacency lists — for speed, the CSR layout: count the degrees, prefix sums into ${c('start[]')}, then fill one ${c('int[2m]')} array.</p>`,
    vi: `<p>Hoàn thiện ${c('static int[] bfsDistances(int n, int[] from, int[] to, int s)')}: đồ thị vô hướng n đỉnh với các cạnh ${c('from[i] — to[i]')}; trả số cạnh trên đường ngắn nhất từ s tới mọi đỉnh, không tới được thì −1.</p>
<p>Máy chấm gọi với n = 1.000.000 và 2.000.000 cạnh. Ma trận ${c('int[n][n]')} cần 4·10¹² byte (${c('OutOfMemoryError')}), còn quét cả một hàng cho mỗi đỉnh là 10¹² bước. Hãy dựng danh sách kề — để nhanh, dùng bố cục CSR: đếm bậc, cộng dồn vào ${c('start[]')}, rồi điền một mảng ${c('int[2m]')}.</p>`,
  },
  yeuCau: { en: ['O(n + m) time and memory.', 'Distances in edges; −1 for unreachable.'], vi: ['O(n + m) thời gian và bộ nhớ.', 'Khoảng cách tính bằng số cạnh; −1 nếu không tới được.'] },
  dauVao: { en: '"n s", edges "u v", then GO; or PERF.', vi: '"n s", các cạnh "u v", rồi GO; hoặc PERF.' },
  dauRa: { en: 'The distance array (or a summary for the big test).', vi: 'Mảng khoảng cách (hoặc tóm tắt cho phép thử lớn).' },
  main: 'KiemTra',
  hen: { n: '1,000,000 vertices, 2,000,000 edges', ms: 4000, can: 'O(n + m) with adjacency lists', cham: 'an adjacency matrix (out of memory) or O(n²) scanning' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        int nv = 0, s = 0;\n        List<int[]> es = new ArrayList<>();',
      lenh: `                if (p[0].equals("PERF")) {
                    final int n = 1000000, m = 2000000;
                    final int[] u = Kiem.ngauNhien(m, n, 1), v = Kiem.ngauNhien(m, n, 2);
                    final int[][] d = new int[1][];
                    r = Kiem.hen("n = 1,000,000, m = 2,000,000", 4000, new Runnable() {
                        public void run() {
                            d[0] = Sparse.bfsDistances(n, u, v, 0);
                        }
                    });
                    if (d[0] != null) {
                        int reach = 0, far = 0;
                        for (int x : d[0]) {
                            if (x >= 0) {
                                reach++;
                                far = Math.max(far, x);
                            }
                        }
                        r += ", reachable " + reach + ", farthest " + far;
                    }
                } else if (p[0].equals("GO")) {
                    int[] u = new int[es.size()], v = new int[es.size()];
                    for (int i = 0; i < es.size(); i++) {
                        u[i] = es.get(i)[0];
                        v[i] = es.get(i)[1];
                    }
                    r = Arrays.toString(Sparse.bfsDistances(nv, u, v, s));
                    es.clear();
                    nv = 0;
                } else if (nv == 0) {
                    nv = n(0);
                    s = n(1);
                } else {
                    es.add(new int[] {n(0), n(1)});
                }`,
    }),
  },
  tep: {
    'Sparse.java': j`
public class Sparse {

    static int[] bfsDistances(int n, int[] from, int[] to, int s) {
        //>> return new int[n]; // TODO: adjacency lists, then BFS
        int m = from.length;
        int[] start = new int[n + 1]; // CSR: neighbours of v are nb[start[v] .. start[v+1]-1]
        for (int i = 0; i < m; i++) {
            start[from[i] + 1]++;
            start[to[i] + 1]++;
        }
        for (int v = 0; v < n; v++) {
            start[v + 1] += start[v];
        }
        int[] fill = java.util.Arrays.copyOf(start, n);
        int[] nb = new int[2 * m];
        for (int i = 0; i < m; i++) {
            nb[fill[from[i]]++] = to[i];
            nb[fill[to[i]]++] = from[i];
        }
        int[] dist = new int[n];
        java.util.Arrays.fill(dist, -1);
        int[] queue = new int[n];
        int head = 0, tail = 0;
        dist[s] = 0;
        queue[tail++] = s;
        while (head < tail) {
            int x = queue[head++];
            for (int k = start[x]; k < start[x + 1]; k++) {
                int y = nb[k];
                if (dist[y] < 0) {
                    dist[y] = dist[x] + 1;
                    queue[tail++] = y;
                }
            }
        }
        return dist;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a small graph with an unreachable part', vi: 'đồ thị nhỏ có phần không tới được' }, vao: '7 0\n0 1\n0 2\n1 3\n2 3\n3 4\n5 6\nGO\n' },
    { ten: { en: 'a cycle, a single vertex', vi: 'một chu trình, một đỉnh' }, vao: '6 2\n0 1\n1 2\n2 3\n3 4\n4 5\n5 0\nGO\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'List<List<Integer>> works too, but boxing two million Integers is slow — the CSR arrays are both smaller and faster.', vi: 'List<List<Integer>> cũng chạy, nhưng đóng hộp hai triệu Integer thì chậm — mảng CSR vừa nhỏ hơn vừa nhanh hơn.' },
    { en: 'CSR: start[v+1] counts the degree of v; after prefix sums, v’s neighbours live in nb[start[v] .. start[v+1]−1].', vi: 'CSR: start[v+1] đếm bậc của v; sau khi cộng dồn, các đỉnh kề của v nằm ở nb[start[v] .. start[v+1]−1].' },
  ],
  loiHayGap: [
    { en: 'new int[n][n] — OutOfMemoryError for n = 10⁶.', vi: 'new int[n][n] — OutOfMemoryError với n = 10⁶.' },
    { en: 'Marking visited when dequeuing — vertices enter the queue several times and the queue array overflows.', vi: 'Đánh dấu đã thăm khi lấy ra — đỉnh vào hàng nhiều lần và mảng hàng đợi bị tràn.' },
  ],
  giaiThich: { en: '<p>With lists, BFS touches each vertex once and each edge twice (once from each end): O(n + m) ≈ 5·10⁶ steps here. The matrix version is Θ(n²) in both time and memory regardless of how few edges there are — that is why real graphs (roads, social networks) are always stored as lists.</p>', vi: '<p>Với danh sách kề, BFS chạm mỗi đỉnh một lần và mỗi cạnh hai lần (một lần từ mỗi đầu): O(n + m) ≈ 5·10⁶ bước ở đây. Bản ma trận là Θ(n²) cả thời gian lẫn bộ nhớ dù có ít cạnh đến đâu — vì vậy đồ thị thật (đường sá, mạng xã hội) luôn lưu bằng danh sách kề.</p>' },
});

const de3 = deJava({
  id: 'csd201-5-2-walks-matrix-power',
  tieuDe: { en: 'Count walks of length k with powers of the adjacency matrix', vi: 'Đếm đường đi (walk) độ dài k bằng luỹ thừa ma trận kề' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['(A^k)[u][v] = number of walks of length k', 'matrix multiplication', 'fast exponentiation by squaring'],
  moTa: {
    en: `<p>A classic property of the adjacency matrix: ${c('(A^k)[u][v]')} is the number of walks with exactly k edges from u to v (vertices and edges may repeat). Complete:</p>
<ul><li>${c('static long[][] multiply(long[][] x, long[][] y)')};</li>
<li>${c('static long[][] power(long[][] a, int k)')} — by repeated squaring (O(n³ log k)); ${c('A^0')} = the identity.</li></ul>
<p>The grader asks for k up to 60 on graphs with up to 8 vertices; counts stay below 2⁶³.</p>`,
    vi: `<p>Tính chất kinh điển của ma trận kề: ${c('(A^k)[u][v]')} là số đường đi có đúng k cạnh từ u tới v (đỉnh và cạnh được lặp). Hoàn thiện ${c('multiply(x, y)')} và ${c('power(a, k)')} — bằng bình phương liên tiếp (O(n³ log k)); ${c('A^0')} là ma trận đơn vị.</p>
<p>Máy chấm hỏi k tới 60 trên đồ thị tối đa 8 đỉnh; số đếm luôn nhỏ hơn 2⁶³.</p>`,
  },
  yeuCau: { en: ['power by squaring: O(log k) multiplications.', 'long arithmetic.'], vi: ['power bằng bình phương liên tiếp: O(log k) phép nhân ma trận.', 'Tính bằng long.'] },
  dauVao: { en: 'n, the matrix, then "WALKS k u v" lines.', vi: 'n, ma trận, rồi các dòng "WALKS k u v".' },
  dauRa: { en: 'The number of walks.', vi: 'Số đường đi.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        long[][] a = null;',
      lenh: `                if (p[0].equals("WALKS")) {
                    r = String.valueOf(Walks.power(a, n(1))[n(2)][n(3)]);
                } else {
                    int nn = n(0);
                    a = new long[nn][nn];
                    for (int i = 0; i < nn; i++) {
                        String[] q = sc.nextLine().trim().split("\\\\s+");
                        for (int k = 0; k < nn; k++) {
                            a[i][k] = Long.parseLong(q[k]);
                        }
                    }
                    r = "graph of " + nn;
                }`,
    }),
  },
  tep: {
    'Walks.java': j`
public class Walks {

    static long[][] multiply(long[][] x, long[][] y) {
        //>> return new long[x.length][x.length]; // TODO
        int n = x.length;
        long[][] z = new long[n][n];
        for (int i = 0; i < n; i++) {
            for (int k = 0; k < n; k++) {
                if (x[i][k] == 0) {
                    continue;
                }
                for (int j = 0; j < n; j++) {
                    z[i][j] += x[i][k] * y[k][j];
                }
            }
        }
        return z;
        //<<
    }

    static long[][] power(long[][] a, int k) {
        //>> return a; // TODO
        int n = a.length;
        long[][] result = new long[n][n];
        for (int i = 0; i < n; i++) {
            result[i][i] = 1;
        }
        long[][] base = a;
        while (k > 0) {
            if ((k & 1) == 1) {
                result = multiply(result, base);
            }
            base = multiply(base, base);
            k >>= 1;
        }
        return result;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a triangle and a path', vi: 'một tam giác và một đường thẳng' }, vao: '3\n0 1 1\n1 0 1\n1 1 0\nWALKS 0 0 0\nWALKS 1 0 1\nWALKS 2 0 0\nWALKS 3 0 0\nWALKS 10 1 2\n3\n0 1 0\n1 0 1\n0 1 0\nWALKS 2 0 2\nWALKS 3 0 2\nWALKS 4 1 1\n' },
    { ten: { en: 'a directed cycle and large k', vi: 'chu trình có hướng và k lớn' }, vao: '4\n0 1 0 0\n0 0 1 0\n0 0 0 1\n1 0 0 0\nWALKS 4 0 0\nWALKS 5 0 0\nWALKS 7 0 3\n2\n1 1\n1 0\nWALKS 60 0 0\nWALKS 50 1 0\n', an: true },
  ],
  goiY: [
    { en: 'A walk of length k from u to v is a walk of length k−1 to some w followed by an edge w→v: that is exactly one row-by-column product.', vi: 'Đường đi độ dài k từ u tới v là đường đi độ dài k−1 tới một w rồi một cạnh w→v: đúng một phép nhân hàng với cột.' },
    { en: 'Squaring: A^k = (A^(k/2))² times A once more when k is odd — the fast power of 3.2 with matrices.', vi: 'Bình phương: A^k = (A^(k/2))² nhân thêm A khi k lẻ — luỹ thừa nhanh của bài 3.2 với ma trận.' },
  ],
  loiHayGap: [
    { en: 'Starting the product from A instead of the identity — every answer is one power too high.', vi: 'Bắt đầu tích từ A thay vì ma trận đơn vị — mọi đáp án lệch lên một bậc.' },
    { en: 'int entries — the 2-vertex graph at k = 60 has about 1.5·10¹² walks.', vi: 'Phần tử kiểu int — đồ thị 2 đỉnh với k = 60 có khoảng 1,5·10¹² đường đi.' },
  ],
  giaiThich: { en: '<p>Matrix multiplication composes "walks of length a" with "walks of length b" into "walks of length a + b", so A^k counts walks of length k. Squaring needs O(log k) products of O(n³) each. The 2-vertex example gives Fibonacci numbers — the matrix method for Fibonacci.</p>', vi: '<p>Phép nhân ma trận ghép "đường đi độ dài a" với "đường đi độ dài b" thành "đường đi độ dài a + b", nên A^k đếm đường đi độ dài k. Bình phương liên tiếp cần O(log k) phép nhân, mỗi phép O(n³). Ví dụ 2 đỉnh cho ra số Fibonacci — phương pháp ma trận tính Fibonacci.</p>' },
});

export default moDun({ slug: 'csd201-do-thi-bieu-dien', ten: '5.2 Three ways to store a graph', de: [de1, de2, de3] });
