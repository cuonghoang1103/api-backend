/** CSD201 · 5.4 — BFS & đường ngắn nhất không trọng số: đường đi ít cạnh nhất (truy vết cha), mê cung lưới 2000×2000 (kiểm O(n)), BFS nhiều nguồn. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-5-4-shortest-path-unweighted',
  tieuDe: { en: 'The path with the fewest edges, rebuilt from BFS parents', vi: 'Đường đi ít cạnh nhất, dựng lại từ con trỏ cha của BFS' },
  doKho: 'EASY', phut: 25,
  khaiNiem: ['BFS layers = distances', 'parent array', 'walking the parents back from the target'],
  moTa: {
    en: `<p>An undirected graph with vertices labelled ${c('A…')} (adjacency matrix). Complete ${c('static String path(int[][] a, int s, int t)')}: a path from s to t with the fewest edges, as labels separated by ${c('" -> "')}, or ${c('"no path"')}. Run BFS from s with neighbours in increasing order and record ${c('parent[v]')} when v is enqueued; then walk from t back to s and reverse. With this rule the answer is unique.</p>`,
    vi: `<p>Đồ thị vô hướng có nhãn đỉnh ${c('A…')} (ma trận kề). Hoàn thiện ${c('static String path(int[][] a, int s, int t)')}: một đường đi từ s tới t ít cạnh nhất, các nhãn nối bằng ${c('" -> "')}, hoặc ${c('"no path"')}. Chạy BFS từ s với đỉnh kề theo thứ tự tăng và ghi ${c('parent[v]')} khi cho v vào hàng; rồi đi từ t ngược về s và đảo lại. Với luật này đáp án là duy nhất.</p>`,
  },
  yeuCau: { en: ['BFS, O(n²) on the matrix.', 's == t → just the label.'], vi: ['BFS, O(n²) trên ma trận.', 's == t → chỉ một nhãn.'] },
  dauVao: { en: 'n, the matrix, then "PATH s t" lines (labels).', vi: 'n, ma trận, rồi các dòng "PATH s t" (nhãn).' },
  dauRa: { en: 'The path.', vi: 'Đường đi.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        int[][] a = null;',
      lenh: `                if (p[0].equals("PATH")) {
                    r = ShortestPath.path(a, p[1].charAt(0) - 'A', p[2].charAt(0) - 'A');
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
    'ShortestPath.java': j`
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Queue;

public class ShortestPath {
    static final String LABELS = "ABCDEFGHIJKLMNOP";

    static String path(int[][] a, int s, int t) {
        //>> return "no path"; // TODO
        int n = a.length;
        int[] parent = new int[n];
        Arrays.fill(parent, -2); // -2 = not reached
        parent[s] = -1;
        Queue<Integer> q = new ArrayDeque<>();
        q.add(s);
        while (!q.isEmpty()) {
            int x = q.remove();
            for (int y = 0; y < n; y++) {
                if (a[x][y] > 0 && parent[y] == -2) {
                    parent[y] = x;
                    q.add(y);
                }
            }
        }
        if (parent[t] == -2) {
            return "no path";
        }
        StringBuilder sb = new StringBuilder();
        for (int v = t; v != -1; v = parent[v]) {
            sb.insert(0, (v == t ? "" : " -> ")).insert(0, LABELS.charAt(v));
        }
        return sb.toString();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a 9-vertex graph', vi: 'một đồ thị 9 đỉnh' }, vao: '9\n0 1 1 1 0 0 0 0 0\n1 0 0 0 1 0 0 0 0\n1 0 0 0 0 1 0 1 0\n1 0 0 0 0 0 1 0 0\n0 1 0 0 0 0 0 1 0\n0 0 1 0 0 0 0 0 0\n0 0 0 1 0 0 0 0 0\n0 0 0 0 1 0 0 0 1\n0 0 0 0 0 0 0 1 0\nPATH A I\nPATH F G\nPATH B B\nPATH G F\n' },
    { ten: { en: 'disconnected, equal-length alternatives', vi: 'không liên thông, nhiều đường dài bằng nhau' }, vao: '5\n0 1 1 0 0\n1 0 0 1 0\n1 0 0 1 0\n0 1 1 0 0\n0 0 0 0 0\nPATH A D\nPATH D A\nPATH A E\n', an: true },
  ],
  goiY: [
    { en: 'In BFS, the first time a vertex is reached is along a shortest path — record parent[v] = x at that moment.', vi: 'Trong BFS, lần đầu một đỉnh được tới là theo một đường ngắn nhất — ghi parent[v] = x đúng lúc đó.' },
    { en: 'Walk t, parent[t], parent[parent[t]], … until s, then print in reverse.', vi: 'Đi t, parent[t], parent[parent[t]], … tới s, rồi in theo chiều ngược.' },
  ],
  loiHayGap: [
    { en: 'Overwriting parent[v] when v is seen again — the path stops being shortest.', vi: 'Ghi đè parent[v] khi gặp lại v — đường đi không còn ngắn nhất.' },
    { en: 'Using DFS — it finds a path, not the shortest one.', vi: 'Dùng DFS — tìm được một đường đi, nhưng không phải đường ngắn nhất.' },
  ],
  giaiThich: { en: '<p>BFS explores vertices in layers of increasing distance, so the parent pointers form a shortest-path tree from s. Rebuilding the path costs O(length); the whole search is O(n²) on a matrix, O(n + m) on lists.</p>', vi: '<p>BFS khám phá đỉnh theo từng lớp khoảng cách tăng dần, nên các con trỏ cha tạo thành cây đường đi ngắn nhất từ s. Dựng lại đường đi tốn O(độ dài); cả cuộc tìm là O(n²) trên ma trận, O(n + m) trên danh sách kề.</p>' },
});

const de2 = deJava({
  id: 'csd201-5-4-maze',
  tieuDe: { en: 'Shortest way out of a 2000 × 2000 maze', vi: 'Đường ngắn nhất ra khỏi mê cung 2000 × 2000' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['a grid as an implicit graph', 'BFS on cells', 'distance array instead of visited'],
  moTa: {
    en: `<p>A maze is a grid of ${c("'.'")} (free) and ${c("'#'")} (wall); moves go up, down, left, right. Complete ${c('static int shortest(char[][] g, int sr, int sc, int tr, int tc)')}: the minimum number of moves from (sr, sc) to (tr, tc), or −1. BFS on the cells with an ${c('int[][] dist')} (−1 = not reached) and a queue of cells — encode a cell as ${c('r * cols + c')} to keep the queue an int array.</p>`,
    vi: `<p>Mê cung là lưới ${c("'.'")} (trống) và ${c("'#'")} (tường); di chuyển lên, xuống, trái, phải. Hoàn thiện ${c('static int shortest(char[][] g, int sr, int sc, int tr, int tc)')}: số bước ít nhất từ (sr, sc) tới (tr, tc), hoặc −1. BFS trên các ô với ${c('int[][] dist')} (−1 = chưa tới) và hàng đợi các ô — mã hoá ô thành ${c('r * cols + c')} để hàng đợi chỉ là mảng int.</p>`,
  },
  yeuCau: { en: ['O(rows × cols).', 'Start or target on a wall → −1.'], vi: ['O(hàng × cột).', 'Ô đầu hoặc ô đích là tường → −1.'] },
  dauVao: { en: 'A maze, then "GO sr sc tr tc"; or PERF.', vi: 'Một mê cung, rồi "GO sr sc tr tc"; hoặc PERF.' },
  dauRa: { en: 'The number of moves.', vi: 'Số bước.' },
  main: 'KiemTra',
  hen: { n: '2000 × 2000 cells (a long winding corridor)', ms: 4000, can: 'O(rows × cols)', cham: 'DFS trying all paths, or BFS without marking cells' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        List<String> rows = new ArrayList<>();',
      lenh: `                if (p[0].equals("GO")) {
                    char[][] g = new char[rows.size()][];
                    for (int i = 0; i < g.length; i++) {
                        g[i] = rows.get(i).toCharArray();
                    }
                    r = String.valueOf(Maze.shortest(g, n(1), n(2), n(3), n(4)));
                    rows.clear();
                } else if (p[0].equals("PERF")) {
                    final char[][] g = new char[2000][2000];
                    for (char[] row : g) {
                        Arrays.fill(row, '.');
                    }
                    for (int i = 1; i < 2000; i += 2) {
                        for (int k = 0; k < 1999; k++) {
                            g[i][(i / 2) % 2 == 0 ? k : k + 1] = '#';
                        }
                    }
                    final int[] d = new int[1];
                    r = Kiem.hen("2000 x 2000 serpentine", 4000, new Runnable() {
                        public void run() {
                            d[0] = Maze.shortest(g, 0, 0, 1998, 0);
                        }
                    }) + ", moves " + d[0];
                } else {
                    rows.add(line);
                    r = "row";
                }`,
    }),
  },
  tep: {
    'Maze.java': j`
public class Maze {

    static int shortest(char[][] g, int sr, int sc, int tr, int tc) {
        //>> return -1; // TODO
        int rows = g.length, cols = g[0].length;
        if (g[sr][sc] == '#' || g[tr][tc] == '#') {
            return -1;
        }
        int[][] dist = new int[rows][cols];
        for (int[] d : dist) {
            java.util.Arrays.fill(d, -1);
        }
        int[] queue = new int[rows * cols];
        int head = 0, tail = 0;
        dist[sr][sc] = 0;
        queue[tail++] = sr * cols + sc;
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        while (head < tail) {
            int cell = queue[head++];
            int r = cell / cols, c = cell % cols;
            if (r == tr && c == tc) {
                return dist[r][c];
            }
            for (int d = 0; d < 4; d++) {
                int nr = r + dr[d], nc = c + dc[d];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nr][nc] != '#' && dist[nr][nc] < 0) {
                    dist[nr][nc] = dist[r][c] + 1;
                    queue[tail++] = nr * cols + nc;
                }
            }
        }
        return -1;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'small mazes', vi: 'mê cung nhỏ' }, vao: '.....\n.###.\n...#.\n##.#.\n.....\nGO 0 0 4 0\n..#\n.##\n...\nGO 0 0 0 1\n' },
    { ten: { en: 'walled off, start = target, start on a wall', vi: 'bị tường chắn, ô đầu = ô đích, ô đầu là tường' }, vao: '.#.\n.#.\n.#.\nGO 0 0 0 2\n...\n...\nGO 1 0 1 0\n#..\nGO 0 0 0 2\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'dist[][] = −1 everywhere doubles as "not visited"; set it when the cell is enqueued.', vi: 'dist[][] = −1 khắp nơi kiêm luôn vai "chưa thăm"; gán khi cho ô vào hàng.' },
    { en: 'Four directions with two small arrays dr = {−1, 1, 0, 0}, dc = {0, 0, −1, 1}.', vi: 'Bốn hướng bằng hai mảng nhỏ dr = {−1, 1, 0, 0}, dc = {0, 0, −1, 1}.' },
  ],
  loiHayGap: [
    { en: 'Recursive DFS "trying every path" — exponential, and too deep for the stack.', vi: 'DFS đệ quy "thử mọi đường" — hàm mũ, và quá sâu cho ngăn xếp.' },
    { en: 'A Queue<int[]> of boxed pairs works but allocates millions of objects; an int queue is much lighter.', vi: 'Queue<int[]> các cặp vẫn chạy nhưng cấp phát hàng triệu đối tượng; hàng đợi int nhẹ hơn nhiều.' },
  ],
  giaiThich: { en: '<p>The grid is a graph with one vertex per cell and up to four edges each: BFS visits each cell once, O(rows × cols) ≈ 4·10⁶ here, and the first time the target is dequeued its distance is minimal.</p>', vi: '<p>Lưới là đồ thị mỗi ô một đỉnh, mỗi đỉnh tối đa bốn cạnh: BFS ghé mỗi ô một lần, O(hàng × cột) ≈ 4·10⁶ ở đây, và lần đầu ô đích được lấy ra thì khoảng cách của nó là nhỏ nhất.</p>' },
});

const de3 = deJava({
  id: 'csd201-5-4-multi-source',
  tieuDe: { en: 'Multi-source BFS: distance from every house to the nearest hospital', vi: 'BFS nhiều nguồn: khoảng cách từ mỗi nhà tới bệnh viện gần nhất' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['all sources in the queue at distance 0', 'one BFS instead of one per source', 'O(rows × cols)'],
  moTa: {
    en: `<p>A town map: ${c("'H'")} hospital, ${c("'.'")} street, ${c("'#'")} building (cannot pass). Complete ${c('static int[][] nearest(char[][] g)')}: for every non-building cell the number of moves to the <b>nearest</b> hospital (−1 if none is reachable, −1 for buildings too).</p>
<p>Put <b>all</b> hospitals in the queue at distance 0 before the loop: one BFS gives every answer. Running a BFS from each hospital (or from each cell) is k times slower.</p>`,
    vi: `<p>Bản đồ thị trấn: ${c("'H'")} bệnh viện, ${c("'.'")} đường, ${c("'#'")} toà nhà (không đi qua). Hoàn thiện ${c('static int[][] nearest(char[][] g)')}: với mỗi ô không phải toà nhà, số bước tới bệnh viện <b>gần nhất</b> (−1 nếu không tới được bệnh viện nào, toà nhà cũng −1).</p>
<p>Cho <b>mọi</b> bệnh viện vào hàng với khoảng cách 0 trước vòng lặp: một lần BFS cho mọi đáp án. Chạy BFS từ từng bệnh viện (hay từ từng ô) chậm hơn k lần.</p>`,
  },
  yeuCau: { en: ['One BFS: O(rows × cols).', 'Buildings and unreachable cells: −1.'], vi: ['Một lần BFS: O(hàng × cột).', 'Toà nhà và ô không tới được: −1.'] },
  dauVao: { en: 'A map, then GO; or PERF.', vi: 'Một bản đồ, rồi GO; hoặc PERF.' },
  dauRa: { en: 'The distance grid.', vi: 'Lưới khoảng cách.' },
  main: 'KiemTra',
  hen: { n: '1500 × 1500 with 1,000 hospitals', ms: 4000, can: 'one multi-source BFS', cham: 'one BFS per hospital (1,000 × 2.25·10⁶ steps)' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        List<String> rows = new ArrayList<>();',
      lenh: `                if (p[0].equals("GO")) {
                    char[][] g = new char[rows.size()][];
                    for (int i = 0; i < g.length; i++) {
                        g[i] = rows.get(i).toCharArray();
                    }
                    StringBuilder sb = new StringBuilder();
                    for (int[] row : Hospitals.nearest(g)) {
                        sb.append("\\n  ");
                        for (int x : row) {
                            sb.append(String.format("%3d", x));
                        }
                    }
                    r = sb.toString();
                    rows.clear();
                } else if (p[0].equals("PERF")) {
                    final char[][] g = new char[1500][1500];
                    for (char[] row : g) {
                        Arrays.fill(row, '.');
                    }
                    int[] hr = Kiem.ngauNhien(1000, 1500, 5), hc = Kiem.ngauNhien(1000, 1500, 6);
                    for (int i = 0; i < 1000; i++) {
                        g[hr[i]][hc[i]] = 'H';
                    }
                    final int[][][] d = new int[1][][];
                    r = Kiem.hen("1500 x 1500, 1,000 hospitals", 4000, new Runnable() {
                        public void run() {
                            d[0] = Hospitals.nearest(g);
                        }
                    });
                    if (d[0] != null) {
                        long sum = 0;
                        int far = 0;
                        for (int[] row : d[0]) {
                            for (int x : row) {
                                sum += x;
                                far = Math.max(far, x);
                            }
                        }
                        r += ", sum " + sum + ", farthest " + far;
                    }
                } else {
                    rows.add(line);
                    r = "row";
                }`,
    }),
  },
  tep: {
    'Hospitals.java': j`
public class Hospitals {

    static int[][] nearest(char[][] g) {
        //>> return new int[g.length][g[0].length]; // TODO
        int rows = g.length, cols = g[0].length;
        int[][] dist = new int[rows][cols];
        int[] queue = new int[rows * cols];
        int head = 0, tail = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                dist[r][c] = -1;
                if (g[r][c] == 'H') {
                    dist[r][c] = 0; // every source starts at distance 0
                    queue[tail++] = r * cols + c;
                }
            }
        }
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        while (head < tail) {
            int cell = queue[head++];
            int r = cell / cols, c = cell % cols;
            for (int d = 0; d < 4; d++) {
                int nr = r + dr[d], nc = c + dc[d];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nr][nc] != '#' && dist[nr][nc] < 0) {
                    dist[nr][nc] = dist[r][c] + 1;
                    queue[tail++] = nr * cols + nc;
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
    { ten: { en: 'two hospitals', vi: 'hai bệnh viện' }, vao: 'H....\n.##..\n....H\nGO\n' },
    { ten: { en: 'walled-off area, no hospital at all', vi: 'khu bị tường bao, không có bệnh viện nào' }, vao: 'H.#..\n..#..\n..#..\nGO\n...\n.#.\nGO\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Imagine a "super source" connected to every hospital: starting the BFS with all hospitals in the queue is exactly that.', vi: 'Tưởng tượng một "siêu nguồn" nối tới mọi bệnh viện: bắt đầu BFS với mọi bệnh viện trong hàng chính là như vậy.' },
    { en: 'A cell is finalised the first time it is reached — from whichever hospital the BFS wave reaches it first.', vi: 'Một ô được chốt ở lần đầu nó được tới — từ bệnh viện nào mà làn sóng BFS chạm tới trước.' },
  ],
  loiHayGap: [
    { en: 'Running one BFS per hospital and keeping the minimum — correct, k times slower.', vi: 'Chạy một BFS cho mỗi bệnh viện rồi lấy min — đúng nhưng chậm hơn k lần.' },
    { en: 'Leaving buildings at 0 instead of −1.', vi: 'Để toà nhà là 0 thay vì −1.' },
  ],
  giaiThich: { en: '<p>With all sources at distance 0, the BFS layers are exactly "distance to the nearest source": every cell is enqueued once, O(rows × cols) in total — 1,000 sources cost the same as one.</p>', vi: '<p>Khi mọi nguồn ở khoảng cách 0, các lớp BFS đúng là "khoảng cách tới nguồn gần nhất": mỗi ô vào hàng một lần, tổng O(hàng × cột) — 1.000 nguồn tốn như một nguồn.</p>' },
});

export default moDun({ slug: 'csd201-bfs', ten: '5.4 BFS & shortest paths in unweighted graphs', de: [de1, de2, de3] });
