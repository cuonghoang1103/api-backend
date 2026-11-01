/** CSD201 · 5.8 — Thực hành chương 5: tô màu tuần tự (thứ tự tự nhiên và bậc giảm dần), Floyd mọi cặp có cạnh âm + truy vết, 🎯 đề PE đúng khuôn Graph (data.txt → f1, f2). */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';
import { dePeFile, GRAPH_P1, QUEUE_INT, STACK_INT } from './_pe.mjs';

const DOC_MT = `
    static int[][] readMatrix(Scanner sc, int n) {
        int[][] a = new int[n][n];
        for (int i = 0; i < n; i++) {
            String[] q = sc.nextLine().trim().split("\\\\s+");
            for (int k = 0; k < n; k++) {
                a[i][k] = q[k].equals("INF") ? Integer.MAX_VALUE : Integer.parseInt(q[k]);
            }
        }
        return a;
    }
`;

const de1 = deJava({
  id: 'csd201-5-8-sequential-coloring',
  tieuDe: { en: 'Sequential colouring: natural order versus largest degree first', vi: 'Tô màu tuần tự: thứ tự tự nhiên so với bậc lớn nhất trước' },
  doKho: 'MEDIUM', phut: 25, dangBai: 'pe',
  khaiNiem: ['greedy colouring', 'the smallest colour not used by a coloured neighbour', 'Welsh–Powell order', 'χ(G) ≤ Δ + 1'],
  moTa: {
    en: `<p>The sequential colouring of the slides (deck 5B, slides 26–28). Colours are 1, 2, 3, …; vertices are processed in a given order, and each one gets the <b>smallest</b> colour not used by an already coloured neighbour. Complete in ${c('Coloring')}:</p>
<ul><li>${c('int[] natural(int[][] a)')} — order A, B, C, …;</li>
<li>${c('int[] largestFirst(int[][] a)')} — order by degree, largest first (ties: smaller index first);</li>
<li>${c('int colors(int[] c)')} — the number of colours used.</li></ul>
<p>The result array gives the colour of each vertex by index. The order changes the number of colours: on the first graph of case 1 (an even cycle with a chord) the natural order needs 4 colours, largest-first only 2.</p>`,
    vi: `<p>Phép tô màu tuần tự của slide (bộ 5B, slide 26–28). Màu là 1, 2, 3, …; xét đỉnh theo một thứ tự cho trước, mỗi đỉnh nhận màu <b>nhỏ nhất</b> chưa có ở một đỉnh kề đã tô. Hoàn thiện trong ${c('Coloring')}: ${c('natural(a)')} — thứ tự A, B, C, …; ${c('largestFirst(a)')} — theo bậc giảm dần (bằng nhau thì chỉ số nhỏ trước); ${c('colors(c)')} — số màu đã dùng.</p>
<p>Mảng kết quả cho màu của từng đỉnh theo chỉ số. Thứ tự làm đổi số màu: trên đồ thị đầu tiên của ca 1, thứ tự tự nhiên cần 4 màu, bậc lớn trước chỉ cần 2.</p>`,
  },
  yeuCau: { en: ['O(n²) on the matrix.', 'Greedy: never recolour.'], vi: ['O(n²) trên ma trận.', 'Tham lam: không bao giờ tô lại.'] },
  dauVao: { en: 'n, the matrix; several graphs.', vi: 'n, ma trận; nhiều đồ thị.' },
  dauRa: { en: 'Both colourings and their number of colours.', vi: 'Hai cách tô và số màu của chúng.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': j`
import java.util.Arrays;
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
${DOC_MT}
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            int[][] a = readMatrix(sc, Integer.parseInt(line));
            int[] x = Coloring.natural(a), y = Coloring.largestFirst(a);
            System.out.println("natural " + Arrays.toString(x) + " -> " + Coloring.colors(x) + " colours | largest first " + Arrays.toString(y) + " -> " + Coloring.colors(y) + " colours");
        }
    }
}
`,
  },
  tep: {
    'Coloring.java': j`
public class Coloring {

    static int[] natural(int[][] a) {
        //>> return new int[a.length]; // TODO
        int n = a.length;
        int[] order = new int[n];
        for (int i = 0; i < n; i++) {
            order[i] = i;
        }
        return colour(a, order);
        //<<
    }

    static int[] largestFirst(int[][] a) {
        //>> return new int[a.length]; // TODO
        int n = a.length;
        Integer[] order = new Integer[n];
        final int[] deg = new int[n];
        for (int i = 0; i < n; i++) {
            order[i] = i;
            for (int j = 0; j < n; j++) {
                deg[i] += a[i][j] > 0 ? 1 : 0;
            }
        }
        java.util.Arrays.sort(order, (x, y) -> deg[x] != deg[y] ? Integer.compare(deg[y], deg[x]) : Integer.compare(x, y));
        int[] o = new int[n];
        for (int i = 0; i < n; i++) {
            o[i] = order[i];
        }
        return colour(a, o);
        //<<
    }

    static int colors(int[] c) {
        //>> return 0; // TODO
        int m = 0;
        for (int x : c) {
            m = Math.max(m, x);
        }
        return m;
        //<<
    }
    //>> // TODO: helper(s)

    private static int[] colour(int[][] a, int[] order) {
        int n = a.length;
        int[] c = new int[n]; // 0 = not coloured yet
        for (int v : order) {
            boolean[] used = new boolean[n + 2];
            for (int w = 0; w < n; w++) {
                if (a[v][w] > 0 && c[w] > 0) {
                    used[c[w]] = true;
                }
            }
            int k = 1;
            while (used[k]) {
                k++;
            }
            c[v] = k;
        }
        return c;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'a 6-vertex graph where the natural order is bad, and a 5-cycle', vi: 'đồ thị 6 đỉnh mà thứ tự tự nhiên tệ, và chu trình 5 đỉnh' }, vao: '6\n0 1 0 0 0 1\n1 0 0 1 0 0\n0 0 0 1 1 0\n0 1 1 0 0 1\n0 0 1 0 0 1\n1 0 0 1 1 0\n5\n0 1 0 0 1\n1 0 1 0 0\n0 1 0 1 0\n0 0 1 0 1\n1 0 0 1 0\n' },
    { ten: { en: 'K4, an edgeless graph, a star', vi: 'K4, đồ thị không cạnh, hình sao' }, vao: '4\n0 1 1 1\n1 0 1 1\n1 1 0 1\n1 1 1 0\n3\n0 0 0\n0 0 0\n0 0 0\n5\n0 1 1 1 1\n1 0 0 0 0\n1 0 0 0 0\n1 0 0 0 0\n1 0 0 0 0\n', an: true },
  ],
  goiY: [
    { en: 'For each vertex in order: mark the colours of its already-coloured neighbours, then take the first unmarked colour 1, 2, 3, …', vi: 'Với mỗi đỉnh theo thứ tự: đánh dấu màu các đỉnh kề đã tô, rồi lấy màu đầu tiên chưa đánh dấu 1, 2, 3, …' },
    { en: 'Sort an Integer[] of vertex numbers with a comparator on (degree descending, index ascending).', vi: 'Sắp một Integer[] số hiệu đỉnh bằng comparator theo (bậc giảm, chỉ số tăng).' },
  ],
  loiHayGap: [
    { en: 'Looking at all neighbours, including uncoloured ones (colour 0) — harmless only if colour numbers start at 1.', vi: 'Xét cả đỉnh kề chưa tô (màu 0) — chỉ vô hại khi màu đánh số từ 1.' },
    { en: 'Sorting by degree with an unstable rule on ties — the order (and the colours) differ.', vi: 'Sắp theo bậc với luật không rõ ràng khi bằng nhau — thứ tự (và màu) khác đi.' },
  ],
  giaiThich: { en: '<p>Greedy colouring never uses more than Δ + 1 colours (a vertex has at most Δ coloured neighbours), but it is not optimal in general — the order matters, as case 1 shows (4 colours against 2). Finding the minimum number of colours is NP-hard.</p>', vi: '<p>Tô màu tham lam không bao giờ dùng quá Δ + 1 màu (một đỉnh có tối đa Δ đỉnh kề đã tô), nhưng nói chung không tối ưu — thứ tự có ý nghĩa, như ca 1 cho thấy (4 màu so với 2). Tìm số màu nhỏ nhất là bài toán NP-khó.</p>' },
});

const de2 = deJava({
  id: 'csd201-5-8-floyd',
  tieuDe: { en: 'Floyd–Warshall: every pair, a negative edge, and the paths', vi: 'Floyd–Warshall: mọi cặp đỉnh, một cạnh âm, và các đường đi' },
  doKho: 'HARD', phut: 35, dangBai: 'pe',
  khaiNiem: ['d[i][j] = min(d[i][j], d[i][k] + d[k][j])', 'k is the OUTER loop', 'next[][] for path reconstruction', 'negative edges allowed, negative cycles not'],
  moTa: {
    en: `<p>A directed graph as a matrix where ${c('INF')} means no edge (in Java: ${c('Integer.MAX_VALUE')}); weights may be negative but there is no negative cycle. Complete in ${c('Floyd')}:</p>
<ul><li>${c('long[][] all(int[][] a)')} — the shortest distance for every pair (${c('Long.MAX_VALUE')} when unreachable);</li>
<li>${c('String path(int[][] a, int i, int j)')} — the vertices of a shortest path i → j as labels separated by spaces, or ${c('"none"')}. Keep ${c('next[i][j]')} = the vertex after i on the best path, updated together with the distance (strict improvement only).</li></ul>`,
    vi: `<p>Đồ thị có hướng dạng ma trận, ${c('INF')} nghĩa là không có cạnh (trong Java: ${c('Integer.MAX_VALUE')}); trọng số có thể âm nhưng không có chu trình âm. Hoàn thiện trong ${c('Floyd')}: ${c('all(a)')} — khoảng cách ngắn nhất cho mọi cặp (${c('Long.MAX_VALUE')} khi không tới được); ${c('path(a, i, j)')} — các đỉnh của một đường ngắn nhất i → j là các nhãn cách nhau dấu cách, hoặc ${c('"none"')}. Giữ ${c('next[i][j]')} = đỉnh đứng sau i trên đường tốt nhất, cập nhật cùng lúc với khoảng cách (chỉ khi nhỏ hơn hẳn).</p>`,
  },
  yeuCau: { en: ['O(n³) with k as the outermost loop.', 'Never add to an infinite distance.'], vi: ['O(n³) với k là vòng ngoài cùng.', 'Không bao giờ cộng vào khoảng cách vô cùng.'] },
  dauVao: { en: 'n, the matrix (INF = no edge), then "PATH i j" (labels).', vi: 'n, ma trận (INF = không có cạnh), rồi "PATH i j" (nhãn).' },
  dauRa: { en: 'The distance matrix and the paths.', vi: 'Ma trận khoảng cách và các đường đi.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
${DOC_MT}
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[][] a = null;
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            if (line.startsWith("PATH")) {
                System.out.println(line + " -> " + Floyd.path(a, line.charAt(5) - 'A', line.charAt(7) - 'A'));
                continue;
            }
            a = readMatrix(sc, Integer.parseInt(line));
            StringBuilder sb = new StringBuilder("distances:");
            for (long[] row : Floyd.all(a)) {
                sb.append("\n  ");
                for (long x : row) {
                    sb.append(String.format("%5s", x == Long.MAX_VALUE ? "INF" : String.valueOf(x)));
                }
            }
            System.out.println(sb);
        }
    }
}
`,
  },
  tep: {
    'Floyd.java': j`
public class Floyd {
    static final String LABELS = "ABCDEFGHIJKLMNOP";

    static long[][] all(int[][] a) {
        //>> return new long[a.length][a.length]; // TODO
        return run(a, new int[a.length][a.length]);
        //<<
    }

    static String path(int[][] a, int i, int j) {
        //>> return "none"; // TODO
        int[][] next = new int[a.length][a.length];
        long[][] d = run(a, next);
        if (d[i][j] == Long.MAX_VALUE) {
            return "none";
        }
        StringBuilder sb = new StringBuilder().append(LABELS.charAt(i));
        for (int v = i; v != j; ) {
            v = next[v][j];
            sb.append(' ').append(LABELS.charAt(v));
        }
        return sb.toString();
        //<<
    }
    //>> // TODO: helper(s)

    private static long[][] run(int[][] a, int[][] next) {
        int n = a.length;
        long[][] d = new long[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i == j) {
                    d[i][j] = 0;
                    next[i][j] = j;
                } else if (a[i][j] == Integer.MAX_VALUE) {
                    d[i][j] = Long.MAX_VALUE;
                    next[i][j] = -1;
                } else {
                    d[i][j] = a[i][j];
                    next[i][j] = j;
                }
            }
        }
        for (int k = 0; k < n; k++) { // k = the largest allowed intermediate vertex: OUTER loop
            for (int i = 0; i < n; i++) {
                if (d[i][k] == Long.MAX_VALUE) {
                    continue;
                }
                for (int j = 0; j < n; j++) {
                    if (d[k][j] != Long.MAX_VALUE && d[i][k] + d[k][j] < d[i][j]) {
                        d[i][j] = d[i][k] + d[k][j];
                        next[i][j] = next[i][k];
                    }
                }
            }
        }
        return d;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ example with a negative edge', vi: 'ví dụ của slide có cạnh âm' }, vao: '4\n0 INF -2 INF\n4 0 3 INF\nINF INF 0 2\nINF -1 INF 0\nPATH A B\nPATH B D\nPATH D A\nPATH C A\n' },
    { ten: { en: 'unreachable pairs, a direct edge longer than a detour', vi: 'cặp không tới được, cạnh trực tiếp dài hơn đường vòng' }, vao: '4\n0 10 1 INF\nINF 0 INF INF\nINF 2 0 INF\nINF INF INF 0\nPATH A B\nPATH B A\nPATH D D\nPATH A D\n', an: true },
  ],
  goiY: [
    { en: 'After round k, d[i][j] is the shortest path whose intermediate vertices are all in {0, …, k} — that only works with k as the outer loop.', vi: 'Sau vòng k, d[i][j] là đường ngắn nhất chỉ qua các đỉnh trung gian trong {0, …, k} — điều đó chỉ đúng khi k là vòng ngoài.' },
    { en: 'When the path through k is better, the first step towards j is now the first step towards k: next[i][j] = next[i][k].', vi: 'Khi đường qua k tốt hơn, bước đầu tiên về phía j giờ là bước đầu tiên về phía k: next[i][j] = next[i][k].' },
  ],
  loiHayGap: [
    { en: 'Putting k in the innermost loop — some pairs are never improved.', vi: 'Đặt k ở vòng trong cùng — một số cặp không bao giờ được cải thiện.' },
    { en: 'Adding Integer.MAX_VALUE + a negative weight — the overflow produces a "short" fake path.', vi: 'Cộng Integer.MAX_VALUE với trọng số âm — tràn số tạo ra một đường "ngắn" giả.' },
  ],
  giaiThich: { en: '<p>Floyd–Warshall is dynamic programming over the set of allowed intermediate vertices: n rounds of n² updates, O(n³), and it handles negative edges (unlike Dijkstra). A negative cycle would show up as a negative d[i][i].</p>', vi: '<p>Floyd–Warshall là quy hoạch động trên tập đỉnh trung gian được phép: n vòng, mỗi vòng n² lần cập nhật, O(n³), và xử lý được cạnh âm (khác Dijkstra). Chu trình âm sẽ lộ ra thành d[i][i] âm.</p>' },
});

// ─── 🎯 Đề PE đúng khuôn: Graph (phần (1) thật của đề SP26 B5 P4) ───
const GRAPH_PE = `${GRAPH_P1}
  void f1() throws Exception {
    loadData(1);
    String fname = "f1.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw");
    depth(2,f);
    f.writeBytes("\\r\\n");
    //-------------------------------------------------------------------------------------
     /*You must keep statements pre-given in this function.
       Your task is to insert statements here, just after this comment,
       to complete the question in the exam paper.*/
    //>>
    int [] order = new int[20];
    int [] cnt = new int[1];
    boolean [] visited = new boolean[20];
    depth2(visited,2,order,cnt);
    for(int i=0;i<n;i++) if(!visited[i]) depth2(visited,i,order,cnt);
    for(int i=1;i<=5 && i<cnt[0];i++) {
      int x = order[i], d = 0;
      for(int j=0;j<n;j++) d += a[x][j];
      fvisit(x,f);
      f.writeBytes("(" + d + ")");
     }
    //<<
    //-------------------------------------------------------------------------------------
    f.writeBytes("\\r\\n");
    f.close();
   }
//>>

  // the same depth-first order as depth(...), but stored in order[]
  void depth2(boolean [] visited, int k, int [] order, int [] cnt) {
    visited[k]=true;
    order[cnt[0]++]=k;
    for(int i=0;i<n;i++)
      if(!visited[i] && a[k][i]>0) depth2(visited,i,order,cnt);
   }

  // Euler cycle from s (Hierholzer with a stack, smallest neighbour first) on a copy of the matrix
  void eulerCycle(int s, RandomAccessFile f) throws Exception {
    int [][] b = new int[n][n];
    for(int i=0;i<n;i++) for(int j=0;j<n;j++) b[i][j]=a[i][j];
    int [] st = new int[1000]; int top = 0;
    int [] out = new int[1000]; int k = 0;
    st[top++] = s;
    while(top>0) {
      int x = st[top-1], y = 0;
      while(y<n && b[x][y]==0) y++;
      if(y==n) out[k++] = st[--top];
      else {b[x][y]--; b[y][x]--; st[top++] = y;}
     }
    for(int i=k-1;i>=0;i--) fvisit(out[i],f);
   }
//<<

//=================================================================
  void f2() throws Exception {
    loadData(12);
    String fname = "f2.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw");
    f.writeBytes("\\r\\n");
    //-------------------------------------------------------------------------------------
     /*You must keep statements pre-given in this function.
       Your task is to insert statements here, just after this comment,
       to complete the question in the exam paper.*/
      // You can use the statement fvisit(i,f); i = 0, 1, 2,...,n-1 to display the vertex i to file f2.txt
    //>>
    eulerCycle(0,f);
    //<<
    //-------------------------------------------------------------------------------------
    f.writeBytes("\\r\\n");
    f.close();
   }

}
`;
const M9 = (rows) => `9\n${rows.join('\n')}`;
const DATA = `line 0 - The next line is line 1 (f1)
${M9(['0  1  1  1  0  0  0  0  0', '1  0  0  0  1  0  0  0  0', '1  0  0  0  0  1  0  1  0', '1  0  0  0  0  0  1  0  0', '0  1  0  0  0  0  0  1  0', '0  0  1  0  0  0  0  0  0', '0  0  0  1  0  0  0  0  0', '0  0  1  0  1  0  0  0  1', '0  0  0  0  0  0  0  1  0'])}
line 11 - The next line is line 12 (f2)
6
0  1  1  1  1  0
1  0  1  0  0  0
1  1  0  0  1  1
1  0  0  0  1  0
1  0  1  1  0  1
0  0  1  0  1  0
END OF DATA
`;
const DATA_AN = [`line 0 - The next line is line 1 (f1)
${M9(['0  1  0  0  0  0  0  0  1', '1  0  1  0  0  0  0  0  0', '0  1  0  1  1  0  0  0  0', '0  0  1  0  0  0  0  0  0', '0  0  1  0  0  1  1  0  0', '0  0  0  0  1  0  0  0  0', '0  0  0  0  1  0  0  1  0', '0  0  0  0  0  0  1  0  0', '1  0  0  0  0  0  0  0  0'])}
line 11 - The next line is line 12 (f2)
5
0  2  0  0  0
2  0  1  1  0
0  1  0  1  0
0  1  1  0  2
0  0  0  2  0
END OF DATA
`, `line 0 - The next line is line 1 (f1)
${M9(['0  0  0  0  0  0  0  0  0', '0  0  1  0  0  0  0  0  0', '0  1  0  1  0  0  0  0  0', '0  0  1  0  0  0  0  0  0', '0  0  0  0  0  1  0  0  0', '0  0  0  0  1  0  1  0  0', '0  0  0  0  0  1  0  0  0', '0  0  0  0  0  0  0  0  1', '0  0  0  0  0  0  0  1  0'])}
line 11 - The next line is line 12 (f2)
3
0  1  1
1  0  1
1  1  0
END OF DATA
`];

const de3 = dePeFile({
  id: 'csd201-5-8-pe-graph',
  tieuDe: { en: '🎯 PE format — Graph: f1 depth-first from C with the degrees of the 2nd–6th vertices, f2 an Euler cycle from A', vi: '🎯 Đúng khuôn PE — Graph: f1 duyệt sâu từ C kèm bậc của đỉnh thứ 2–6, f2 chu trình Euler từ A' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['PE Graph project (loadData(k) of a matrix, fvisit, depth, Queue/Stack)', 'copy a traversal and modify it', 'degrees from the matrix', 'Hierholzer on a matrix copy'],
  lop: 'Graph', tepHoc: 'Graph.java', soF: 2,
  cho: { 'Queue.java': QUEUE_INT, 'Stack.java': STACK_INT },
  giai: GRAPH_PE,
  boiCanh: {
    en: `<p><b>Question 3 (2 marks) — a graph.</b> Part (1) of <code>Graph.java</code> is the real given code of the SP26 Block 5 Paper 4 exam (labels <code>A…P</code>, <code>loadData(k)</code> reading a matrix from line k of <code>data.txt</code>, <code>fvisit</code> writing <code>"  X"</code>, <code>breadth</code>/<code>depth</code> with restarts). The graphs are undirected without loops.</p>`,
    vi: `<p><b>Câu 3 (2 điểm) — đồ thị.</b> Phần (1) của <code>Graph.java</code> là đúng code cho sẵn của đề SP26 Block 5 Paper 4 (nhãn <code>A…P</code>, <code>loadData(k)</code> đọc ma trận từ dòng k của <code>data.txt</code>, <code>fvisit</code> ghi <code>"  X"</code>, <code>breadth</code>/<code>depth</code> có bắt đầu lại). Các đồ thị vô hướng, không có khuyên.</p>`,
  },
  cau: [
    { en: 'Depth-first traversal from vertex 2 (C) is already written by <code>depth(2,f)</code>. On the next line write the vertices from the <b>2nd to the 6th</b> of that same depth-first order, each followed by its degree in parentheses: <code>  A(3)  B(2)…</code> (use <code>fvisit(i,f)</code> then <code>f.writeBytes("(" + d + ")")</code>). Hint: copy <code>depth(...)</code> to <code>depth2(...)</code> that stores the order in an array.', vi: 'Duyệt sâu từ đỉnh 2 (C) đã được ghi bởi <code>depth(2,f)</code>. Ở dòng kế tiếp ghi các đỉnh <b>thứ 2 tới thứ 6</b> của chính thứ tự duyệt sâu đó, mỗi đỉnh kèm bậc trong ngoặc: <code>  A(3)  B(2)…</code> (dùng <code>fvisit(i,f)</code> rồi <code>f.writeBytes("(" + d + ")")</code>). Gợi ý: chép <code>depth(...)</code> thành <code>depth2(...)</code> lưu thứ tự vào một mảng.' },
    { en: 'Every vertex of the graph of line 12 has even degree and the graph is connected. Write an Euler cycle starting at vertex 0 (A) found with the algorithm of the slides: a stack, always moving to the <b>smallest</b> neighbour through an unused edge (remove the edge from a copy of the matrix), popping a vertex to the answer when it is stuck; the answer is the popped sequence reversed. Write it with <code>fvisit</code>.', vi: 'Mọi đỉnh của đồ thị ở dòng 12 có bậc chẵn và đồ thị liên thông. Ghi một chu trình Euler bắt đầu ở đỉnh 0 (A) tìm bằng thuật toán của slide: một ngăn xếp, luôn đi tới đỉnh kề <b>nhỏ nhất</b> qua cạnh chưa dùng (xoá cạnh trên bản sao ma trận), bị kẹt thì pop đỉnh vào đáp án; đáp án là dãy đã pop đảo ngược. Ghi bằng <code>fvisit</code>.' },
  ],
  data: DATA, dataAn: DATA_AN,
  goiY: [
    { en: 'f1: the order must be exactly depth(2, f)’s order, restarts included — so copy depth(...) and change only "write to the file" into "store in order[]".', vi: 'f1: thứ tự phải đúng thứ tự của depth(2, f), kể cả các lần bắt đầu lại — nên chép depth(...) và chỉ đổi "ghi ra tệp" thành "lưu vào order[]".' },
    { en: 'f2: never change the matrix a itself — work on a copy, decrementing b[x][y] and b[y][x] for each edge you walk.', vi: 'f2: đừng sửa chính ma trận a — làm trên bản sao, giảm b[x][y] và b[y][x] cho mỗi cạnh đã đi.' },
  ],
  loiHayGap: [
    { en: 'Counting the 2nd–6th vertices from 0 instead of 1 (the 1st vertex is C itself).', vi: 'Đếm đỉnh thứ 2–6 từ 0 thay vì 1 (đỉnh thứ 1 chính là C).' },
    { en: 'Walking an edge but decreasing only b[x][y] — the same edge is walked back from y.', vi: 'Đi một cạnh mà chỉ giảm b[x][y] — cùng cạnh đó bị đi ngược lại từ y.' },
  ],
  giaiThich: { en: '<p>f1 reuses the given traversal by copying it — the standard trick of the PE ("copy breadth to breadth2 and modify"). f2 is Hierholzer on the matrix: O(n·m) with the "smallest neighbour" scan, more than fast enough for 16 vertices.</p>', vi: '<p>f1 dùng lại phép duyệt cho sẵn bằng cách chép — mẹo chuẩn của đề PE ("chép breadth thành breadth2 rồi sửa"). f2 là Hierholzer trên ma trận: O(n·m) với lượt quét "đỉnh kề nhỏ nhất", thừa nhanh cho 16 đỉnh.</p>' },
});

export default moDun({ slug: 'csd201-on-ch5', ten: '5.8 🧪 Practice — sequential colouring, Floyd–Warshall, and a 🎯 PE-format Graph paper', de: [de1, de2, de3] });
