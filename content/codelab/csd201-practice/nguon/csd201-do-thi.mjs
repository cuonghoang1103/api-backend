/** CSD201 · 5.1 — Biểu diễn & duyệt đồ thị: bậc/cạnh/đỉnh cô lập trên ma trận kề, BFS + DFS duyệt hết mọi đỉnh (như Graph của đề PE), đếm thành phần liên thông. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

// đọc ma trận kề: dòng "n", rồi n dòng số; nhãn đỉnh A, B, C, …
const DOC_MT = `
    static int[][] readMatrix(Scanner sc, int n) {
        int[][] a = new int[n][n];
        for (int i = 0; i < n; i++) {
            String[] q = sc.nextLine().trim().split("\\\\s+");
            for (int k = 0; k < n; k++) {
                a[i][k] = Integer.parseInt(q[k]);
            }
        }
        return a;
    }
`;

const de1 = deJava({
  id: 'csd201-5-1-degrees',
  tieuDe: { en: 'Degrees, edges, isolated and odd vertices from an adjacency matrix', vi: 'Bậc, số cạnh, đỉnh cô lập và đỉnh bậc lẻ từ ma trận kề' },
  doKho: 'EASY', phut: 15, dangBai: 'pe',
  khaiNiem: ['deg(v) = number of non-zero entries in row v', 'handshake lemma: Σ deg = 2m', 'a loop counts twice'],
  moTa: {
    en: `<p>An undirected graph is given by its adjacency matrix ${c('a[n][n]')} (${c('a[i][j]')} = number of edges between i and j; ${c('a[i][i]')} = number of loops at i). Vertices are labelled ${c('A, B, C, …')}. Complete in ${c('Degrees')}:</p>
<ul><li>${c('int[] degrees(int[][] a)')} — a loop adds <b>2</b> to the degree of its vertex;</li>
<li>${c('int edges(int[][] a)')} — by the handshake lemma, half the sum of the degrees;</li>
<li>${c('String isolated(int[][] a)')} and ${c('String odd(int[][] a)')} — the labels of the vertices of degree 0 / of odd degree, as one string like ${c('"BE"')} (empty if none).</li></ul>`,
    vi: `<p>Đồ thị vô hướng cho bằng ma trận kề ${c('a[n][n]')} (${c('a[i][j]')} = số cạnh giữa i và j; ${c('a[i][i]')} = số khuyên tại i). Nhãn đỉnh ${c('A, B, C, …')}. Hoàn thiện trong ${c('Degrees')}: ${c('degrees(a)')} — một khuyên cộng <b>2</b> vào bậc của đỉnh; ${c('edges(a)')} — theo bổ đề bắt tay, một nửa tổng các bậc; ${c('isolated(a)')} và ${c('odd(a)')} — nhãn các đỉnh bậc 0 / bậc lẻ, ghép thành một chuỗi như ${c('"BE"')} (rỗng nếu không có).</p>`,
  },
  yeuCau: { en: ['O(n²) on the matrix.', 'Labels from "ABCDEFGHIJKLMNOP".'], vi: ['O(n²) trên ma trận.', 'Nhãn lấy từ "ABCDEFGHIJKLMNOP".'] },
  dauVao: { en: 'n, then the n rows of the matrix; several graphs in a row.', vi: 'n, rồi n dòng của ma trận; nhiều đồ thị liên tiếp.' },
  dauRa: { en: 'Degrees, edges, isolated, odd.', vi: 'Các bậc, số cạnh, đỉnh cô lập, đỉnh lẻ.' },
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
            System.out.println("n=" + a.length + " degrees=" + Arrays.toString(Degrees.degrees(a)) + " edges=" + Degrees.edges(a)
                    + " isolated=[" + Degrees.isolated(a) + "] odd=[" + Degrees.odd(a) + "]");
        }
    }
}
`,
  },
  tep: {
    'Degrees.java': j`
public class Degrees {
    static final String LABELS = "ABCDEFGHIJKLMNOP";

    static int[] degrees(int[][] a) {
        //>> return new int[a.length]; // TODO
        int n = a.length;
        int[] d = new int[n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                d[i] += (i == j) ? 2 * a[i][j] : a[i][j]; // a loop touches its vertex twice
            }
        }
        return d;
        //<<
    }

    static int edges(int[][] a) {
        //>> return 0; // TODO
        int s = 0;
        for (int d : degrees(a)) {
            s += d;
        }
        return s / 2;
        //<<
    }

    static String isolated(int[][] a) {
        //>> return ""; // TODO
        StringBuilder sb = new StringBuilder();
        int[] d = degrees(a);
        for (int i = 0; i < d.length; i++) {
            if (d[i] == 0) {
                sb.append(LABELS.charAt(i));
            }
        }
        return sb.toString();
        //<<
    }

    static String odd(int[][] a) {
        //>> return ""; // TODO
        StringBuilder sb = new StringBuilder();
        int[] d = degrees(a);
        for (int i = 0; i < d.length; i++) {
            if (d[i] % 2 == 1) {
                sb.append(LABELS.charAt(i));
            }
        }
        return sb.toString();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a simple graph with an isolated vertex', vi: 'một đồ thị đơn có đỉnh cô lập' }, vao: '5\n0 1 1 0 0\n1 0 1 0 0\n1 1 0 1 0\n0 0 1 0 0\n0 0 0 0 0\n' },
    { ten: { en: 'a multigraph with a loop (Königsberg-like)', vi: 'đa đồ thị có khuyên (kiểu Königsberg)' }, vao: '4\n0 2 2 1\n2 0 0 1\n2 0 0 1\n1 1 1 0\n3\n1 1 0\n1 0 0\n0 0 0\n', an: true },
  ],
  goiY: [
    { en: 'Degree of i = sum of row i, plus a[i][i] once more (a loop has both ends at i).', vi: 'Bậc của i = tổng hàng i, cộng thêm a[i][i] một lần nữa (khuyên có cả hai đầu ở i).' },
    { en: 'The number of odd vertices is always even — a quick check of your degrees.', vi: 'Số đỉnh bậc lẻ luôn chẵn — một cách kiểm nhanh các bậc của bạn.' },
  ],
  loiHayGap: [
    { en: 'Counting a loop once — the handshake sum becomes odd and the edge count wrong.', vi: 'Đếm khuyên một lần — tổng bắt tay thành lẻ và số cạnh sai.' },
    { en: 'Counting non-zero cells instead of summing them — parallel edges are lost.', vi: 'Đếm số ô khác 0 thay vì cộng chúng — mất các cạnh song song.' },
  ],
  giaiThich: { en: '<p>Every edge contributes 1 to the degree of each of its two ends (2 to a single vertex for a loop), so Σ deg(v) = 2m: m is half the degree sum. Reading a full matrix is O(n²) — the price of the matrix representation.</p>', vi: '<p>Mỗi cạnh góp 1 vào bậc của mỗi đầu (2 vào một đỉnh với khuyên), nên Σ deg(v) = 2m: m bằng nửa tổng bậc. Đọc trọn ma trận là O(n²) — cái giá của cách biểu diễn ma trận.</p>' },
});

const de2 = deJava({
  id: 'csd201-5-1-bfs-dfs-all',
  tieuDe: { en: 'Breadth-first and depth-first traversal that reaches every vertex', vi: 'Duyệt theo chiều rộng và chiều sâu tới được mọi đỉnh' },
  doKho: 'EASY', phut: 25, dangBai: 'pe',
  khaiNiem: ['BFS with a queue', 'DFS by recursion', 'restart from the next unvisited vertex', 'neighbours in increasing order'],
  moTa: {
    en: `<p>Exactly the ${c('breadth(k)')} and ${c('depth(k)')} of the PE ${c('Graph')} class. On an adjacency matrix with labels ${c('A…')}, complete:</p>
<ul><li>${c('String bfs(int[][] a, int k)')} — breadth-first from vertex k; mark a vertex when it is <b>enqueued</b>; neighbours in increasing index order; when the queue empties, continue from the smallest unvisited vertex until every vertex is visited;</li>
<li>${c('String dfs(int[][] a, int k)')} — recursive depth-first from k with the same restart rule.</li></ul>
<p>Both return the labels separated by spaces. The neighbours of i are read from <b>row i</b> of the matrix — the paper’s own matrix (case 1) is not symmetric in one place, and its expected answer follows the rows exactly.</p>`,
    vi: `<p>Đúng ${c('breadth(k)')} và ${c('depth(k)')} của lớp ${c('Graph')} trong đề PE. Trên ma trận kề, nhãn ${c('A…')}, hoàn thiện ${c('bfs(a, k)')} — theo chiều rộng từ đỉnh k, đánh dấu đỉnh khi <b>cho vào hàng</b>, đỉnh kề theo chỉ số tăng, hàng rỗng thì tiếp tục từ đỉnh chưa thăm nhỏ nhất cho tới khi thăm hết; ${c('dfs(a, k)')} — theo chiều sâu đệ quy từ k với cùng luật bắt đầu lại.</p>
<p>Cả hai trả các nhãn cách nhau dấu cách. Đỉnh kề của i đọc từ <b>hàng i</b> của ma trận — chính ma trận của đề (ca 1) có một chỗ không đối xứng, và đáp án của đề đi đúng theo hàng.</p>`,
  },
  yeuCau: { en: ['Same visiting order as the PE’s given traversals.', 'O(n²) on the matrix.'], vi: ['Cùng thứ tự thăm như các phép duyệt cho sẵn của đề PE.', 'O(n²) trên ma trận.'] },
  dauVao: { en: 'n, the matrix, then "BFS k" / "DFS k" lines (k = a label).', vi: 'n, ma trận, rồi các dòng "BFS k" / "DFS k" (k là nhãn).' },
  dauRa: { en: 'The orders.', vi: 'Các thứ tự duyệt.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
${DOC_MT}
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[][] a = new int[0][0];
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            if (line.startsWith("BFS") || line.startsWith("DFS")) {
                int k = line.charAt(4) - 'A';
                System.out.println(line + " -> " + (line.startsWith("BFS") ? Traverse.bfs(a, k) : Traverse.dfs(a, k)));
            } else {
                a = readMatrix(sc, Integer.parseInt(line));
                System.out.println("graph with " + a.length + " vertices");
            }
        }
    }
}
`,
  },
  tep: {
    'Traverse.java': j`
import java.util.ArrayDeque;
import java.util.Queue;

public class Traverse {
    static final String LABELS = "ABCDEFGHIJKLMNOP";

    static String bfs(int[][] a, int k) {
        //>> return ""; // TODO
        int n = a.length;
        boolean[] seen = new boolean[n];
        StringBuilder sb = new StringBuilder();
        bfsFrom(a, k, seen, sb);
        for (int i = 0; i < n; i++) {
            if (!seen[i]) {
                bfsFrom(a, i, seen, sb); // restart from the smallest unvisited vertex
            }
        }
        return sb.toString().trim();
        //<<
    }

    static String dfs(int[][] a, int k) {
        //>> return ""; // TODO
        int n = a.length;
        boolean[] seen = new boolean[n];
        StringBuilder sb = new StringBuilder();
        visit(a, k, seen, sb);
        for (int i = 0; i < n; i++) {
            if (!seen[i]) {
                visit(a, i, seen, sb);
            }
        }
        return sb.toString().trim();
        //<<
    }
    //>> // TODO: helper(s)

    private static void bfsFrom(int[][] a, int start, boolean[] seen, StringBuilder sb) {
        Queue<Integer> q = new ArrayDeque<>();
        q.add(start);
        seen[start] = true; // mark when enqueued
        while (!q.isEmpty()) {
            int r = q.remove();
            sb.append(LABELS.charAt(r)).append(' ');
            for (int j = 0; j < a.length; j++) {
                if (!seen[j] && a[r][j] > 0) {
                    seen[j] = true;
                    q.add(j);
                }
            }
        }
    }

    private static void visit(int[][] a, int v, boolean[] seen, StringBuilder sb) {
        seen[v] = true;
        sb.append(LABELS.charAt(v)).append(' ');
        for (int j = 0; j < a.length; j++) {
            if (!seen[j] && a[v][j] > 0) {
                visit(a, j, seen, sb);
            }
        }
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'the PE paper’s 9-vertex graph', vi: 'đồ thị 9 đỉnh của đề PE' }, vao: '9\n0 1 1 1 0 0 0 0 0\n1 0 0 0 1 0 0 0 0\n1 0 0 0 0 0 0 1 0\n1 0 0 0 0 0 1 0 0\n0 1 0 0 0 0 0 1 0\n0 0 1 0 0 0 0 0 0\n0 0 0 1 0 0 0 0 0\n0 0 0 0 1 0 0 0 1\n0 0 0 0 0 0 0 1 0\nBFS B\nDFS B\nBFS A\nDFS F\n' },
    { ten: { en: 'a disconnected graph: restarts', vi: 'đồ thị không liên thông: bắt đầu lại' }, vao: '6\n0 1 0 0 0 0\n1 0 0 0 0 0\n0 0 0 1 1 0\n0 0 1 0 0 0\n0 0 1 0 0 0\n0 0 0 0 0 0\nBFS D\nDFS D\nBFS F\nDFS A\n', an: true },
  ],
  goiY: [
    { en: 'BFS: mark when you enqueue, not when you dequeue — otherwise a vertex can enter the queue twice.', vi: 'BFS: đánh dấu khi cho vào hàng, không phải khi lấy ra — nếu không một đỉnh có thể vào hàng hai lần.' },
    { en: 'The restart loop: after the traversal from k, scan i = 0 … n−1 and start a new traversal from every unvisited i.', vi: 'Vòng bắt đầu lại: sau lượt duyệt từ k, quét i = 0 … n−1 và bắt đầu lượt mới từ mỗi i chưa thăm.' },
  ],
  loiHayGap: [
    { en: 'Stopping after the vertices reachable from k — the PE’s traversal visits all vertices.', vi: 'Dừng sau khi thăm các đỉnh tới được từ k — phép duyệt của đề PE thăm mọi đỉnh.' },
    { en: 'Scanning neighbours from n−1 down to 0 — a different (wrong) order.', vi: 'Quét đỉnh kề từ n−1 xuống 0 — thứ tự khác (sai).' },
  ],
  giaiThich: { en: '<p>Each vertex is visited once and each row of the matrix is scanned once: O(n²) for both traversals. BFS discovers vertices in order of distance from the start; DFS goes as deep as possible before backtracking.</p>', vi: '<p>Mỗi đỉnh được thăm một lần và mỗi hàng ma trận được quét một lần: O(n²) cho cả hai phép duyệt. BFS phát hiện đỉnh theo thứ tự khoảng cách tới đỉnh đầu; DFS đi sâu hết mức rồi mới quay lui.</p>' },
});

const de3 = deJava({
  id: 'csd201-5-1-components',
  tieuDe: { en: 'Connected components: how many, which vertices, is it connected?', vi: 'Thành phần liên thông: bao nhiêu, gồm đỉnh nào, có liên thông không?' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['one traversal per component', 'component labels', 'connected = one component'],
  moTa: {
    en: `<p>Complete ${c('static List<String> components(int[][] a)')}: each component as the labels of its vertices in increasing order (${c('"ABE"')}), components ordered by their smallest vertex. Then ${c('boolean connected(int[][] a)')} and ${c('boolean sameComponent(int[][] a, int u, int v)')}.</p>`,
    vi: `<p>Hoàn thiện ${c('static List<String> components(int[][] a)')}: mỗi thành phần là nhãn các đỉnh của nó theo thứ tự tăng (${c('"ABE"')}), các thành phần xếp theo đỉnh nhỏ nhất. Rồi ${c('connected(a)')} và ${c('sameComponent(a, u, v)')}.</p>`,
  },
  yeuCau: { en: ['A traversal (BFS or DFS) per component.', 'Labels sorted inside a component.'], vi: ['Mỗi thành phần một lượt duyệt (BFS hoặc DFS).', 'Nhãn sắp tăng trong một thành phần.'] },
  dauVao: { en: 'n, the matrix, then SAME u v lines (labels).', vi: 'n, ma trận, rồi các dòng SAME u v (nhãn).' },
  dauRa: { en: 'The components and the answers.', vi: 'Các thành phần và câu trả lời.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
${DOC_MT}
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[][] a = new int[0][0];
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            if (line.startsWith("SAME")) {
                System.out.println(line + " -> " + Components.sameComponent(a, line.charAt(5) - 'A', line.charAt(7) - 'A'));
            } else {
                a = readMatrix(sc, Integer.parseInt(line));
                System.out.println("components " + Components.components(a) + " connected=" + Components.connected(a));
            }
        }
    }
}
`,
  },
  tep: {
    'Components.java': j`
import java.util.ArrayList;
import java.util.List;

public class Components {
    static final String LABELS = "ABCDEFGHIJKLMNOP";

    static List<String> components(int[][] a) {
        //>> return new ArrayList<>(); // TODO
        int[] comp = label(a);
        List<String> out = new ArrayList<>();
        for (int c = 0; ; c++) {
            StringBuilder sb = new StringBuilder();
            for (int v = 0; v < a.length; v++) {
                if (comp[v] == c) {
                    sb.append(LABELS.charAt(v));
                }
            }
            if (sb.length() == 0) {
                return out;
            }
            out.add(sb.toString());
        }
        //<<
    }

    static boolean connected(int[][] a) {
        //>> return false; // TODO
        return components(a).size() <= 1;
        //<<
    }

    static boolean sameComponent(int[][] a, int u, int v) {
        //>> return false; // TODO
        int[] comp = label(a);
        return comp[u] == comp[v];
        //<<
    }
    //>> // TODO: helper(s)

    // comp[v] = number of the component of v (0, 1, ...) in order of the smallest vertex
    private static int[] label(int[][] a) {
        int n = a.length;
        int[] comp = new int[n];
        java.util.Arrays.fill(comp, -1);
        int c = 0;
        for (int s = 0; s < n; s++) {
            if (comp[s] >= 0) {
                continue;
            }
            java.util.ArrayDeque<Integer> st = new java.util.ArrayDeque<>();
            st.push(s);
            comp[s] = c;
            while (!st.isEmpty()) {
                int x = st.pop();
                for (int y = 0; y < n; y++) {
                    if (a[x][y] > 0 && comp[y] < 0) {
                        comp[y] = c;
                        st.push(y);
                    }
                }
            }
            c++;
        }
        return comp;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'three components', vi: 'ba thành phần' }, vao: '6\n0 1 0 0 1 0\n1 0 0 0 0 0\n0 0 0 1 0 0\n0 0 1 0 0 0\n1 0 0 0 0 0\n0 0 0 0 0 0\nSAME A E\nSAME A C\nSAME F F\n' },
    { ten: { en: 'connected graph, single vertex', vi: 'đồ thị liên thông, một đỉnh' }, vao: '4\n0 1 0 0\n1 0 1 0\n0 1 0 1\n0 0 1 0\nSAME A D\n1\n0\nSAME A A\n', an: true },
  ],
  goiY: [
    { en: 'Give every vertex a component number with one traversal per unvisited start vertex, scanning starts in increasing order.', vi: 'Gán số thành phần cho mọi đỉnh bằng một lượt duyệt cho mỗi đỉnh bắt đầu chưa thăm, quét đỉnh bắt đầu theo thứ tự tăng.' },
    { en: 'Then each component’s labels in increasing order come from scanning v = 0 … n−1.', vi: 'Rồi nhãn của từng thành phần theo thứ tự tăng có được khi quét v = 0 … n−1.' },
  ],
  loiHayGap: [
    { en: 'Listing the labels in visiting order (BFS order) instead of increasing order.', vi: 'Liệt kê nhãn theo thứ tự thăm (thứ tự BFS) thay vì thứ tự tăng.' },
    { en: 'Treating an isolated vertex as "no component" — it is a component of its own.', vi: 'Coi đỉnh cô lập là "không thuộc thành phần nào" — nó là một thành phần riêng.' },
  ],
  giaiThich: { en: '<p>One traversal per component visits each vertex once: O(n²) on a matrix (O(n + m) on lists). Labelling the components once answers every "same component?" query in O(1) afterwards.</p>', vi: '<p>Mỗi thành phần một lượt duyệt, mỗi đỉnh được thăm một lần: O(n²) trên ma trận (O(n + m) trên danh sách kề). Gán nhãn thành phần một lần thì mọi câu hỏi "cùng thành phần?" sau đó trả lời trong O(1).</p>' },
});

export default moDun({ slug: 'csd201-do-thi', ten: '5.1 Graph representation & traversal', de: [de1, de2, de3] });
