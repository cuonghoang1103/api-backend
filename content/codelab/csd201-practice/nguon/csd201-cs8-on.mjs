/** CSD201 · ⭐ CS.8 — đồ thị nâng cao kiểu phỏng vấn (gen/java/cs8/Ex*): thứ tự chữ cái lạ (Kahn + PriorityQueue), chuyến bay rẻ nhất ≤ k điểm dừng (Bellman-Ford k+1 vòng có bản sao), cây cầu ngắn nhất (loang lặp + BFS nhiều nguồn), đỉnh an toàn (Kahn trên đồ thị ngược), lưới mũi tên (0-1 BFS), đường tăng dài nhất (tầng Kahn). */
import { moDun, c, j } from './_chung.mjs';
import { deCs } from './_cs.mjs';

const LUOI = `
    static int[][] grid(String[] p, int from) {
        int[][] g = new int[p.length - from][];
        for (int i = from; i < p.length; i++) {
            g[i - from] = arr(p[i]);
        }
        return g;
    }
`;

const de1 = deCs({
  id: 'csd201-cs8-alien-order',
  tieuDe: { en: 'Alien dictionary — recover the letter order with Kahn + a PriorityQueue', vi: 'Từ điển người ngoài hành tinh — khôi phục thứ tự chữ cái bằng Kahn + PriorityQueue' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['first difference of two neighbouring words = one edge', '"abc" before "ab" is impossible', 'smallest available letter first ⇒ one fixed answer', 'leftover letters ⇒ cycle'],
  moTa: {
    en: `<p>${c('words')} are sorted in an unknown alphabet (lowercase letters). Complete ${c('static String order(String[] words)')}: an order of <b>all letters that appear</b> consistent with the list, or ${c('""')} if none exists. Several orders may be valid — return the one that always takes the <b>smallest available letter</b> (in normal a–z order) next, so the answer is unique. Example toc, tob, oa, obb, bnc → ${c('acntob')}; z, x, z → ""; abc, ab → "".</p>
<p>For each pair of neighbouring words only the <b>first differing</b> position gives information: edge a[j] → b[j]. If one word is a prefix of the next, there is no edge — but if the longer one comes first, the list is invalid. Then Kahn’s algorithm with a ${c('PriorityQueue<Character>')}; fewer letters output than letters present means a cycle.</p>`,
    vi: `<p>${c('words')} đã được sắp theo một bảng chữ cái chưa biết (chữ thường). Hoàn thiện ${c('order(words)')}: một thứ tự của <b>mọi chữ cái có mặt</b> phù hợp với danh sách, hoặc ${c('""')} nếu không có. Có thể nhiều thứ tự hợp lệ — trả thứ tự luôn lấy <b>chữ nhỏ nhất đang sẵn sàng</b> (theo a–z thường) để đáp án là duy nhất. Ví dụ toc, tob, oa, obb, bnc → ${c('acntob')}; z, x, z → ""; abc, ab → "".</p>
<p>Với mỗi cặp từ đứng cạnh nhau chỉ vị trí <b>khác nhau đầu tiên</b> cho thông tin: cạnh a[j] → b[j]. Nếu một từ là tiền tố của từ sau thì không có cạnh — nhưng nếu từ dài hơn đứng trước thì danh sách không hợp lệ. Rồi chạy Kahn với ${c('PriorityQueue<Character>')}; xuất ra ít chữ hơn số chữ có mặt nghĩa là có chu trình.</p>`,
  },
  dauVao: { en: 'RUN word word … · RANDOM (vs every permutation of the letters).', vi: 'RUN từ từ … · RANDOM (so với mọi hoán vị các chữ cái).' },
  them: `
    static boolean sortedUnder(String[] words, String alpha) {
        for (int i = 0; i + 1 < words.length; i++) {
            String a = words[i], b = words[i + 1];
            int k = 0;
            while (k < a.length() && k < b.length() && a.charAt(k) == b.charAt(k)) {
                k++;
            }
            if (k == Math.min(a.length(), b.length())) {
                if (a.length() > b.length()) {
                    return false;
                }
            } else if (alpha.indexOf(a.charAt(k)) > alpha.indexOf(b.charAt(k))) {
                return false;
            }
        }
        return true;
    }

    static String firstPerm(String rest, String pre, String[] w) {
        if (rest.isEmpty()) {
            return sortedUnder(w, pre) ? pre : null;
        }
        for (int i = 0; i < rest.length(); i++) {
            String x = firstPerm(rest.substring(0, i) + rest.substring(i + 1), pre + rest.charAt(i), w);
            if (x != null) {
                return x;
            }
        }
        return null;
    }

    static String brute(String[] w) {
        TreeSet<Character> letters = new TreeSet<Character>();
        for (String s : w) {
            for (char ch : s.toCharArray()) {
                letters.add(ch);
            }
        }
        StringBuilder sb = new StringBuilder();
        for (char ch : letters) {
            sb.append(ch);
        }
        String x = firstPerm(sb.toString(), "", w); // permutations in lexicographic order: the first valid one
        return x == null ? "" : x;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = "\\"" + Alien.order(Arrays.copyOfRange(p, 1, p.length)) + "\\"";
                } else {
                    Random rnd = new Random(111);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        String[] w = new String[1 + rnd.nextInt(6)];
                        for (int i = 0; i < w.length; i++) {
                            StringBuilder sb = new StringBuilder();
                            int len = 1 + rnd.nextInt(3);
                            for (int k = 0; k < len; k++) {
                                sb.append("abcde".charAt(rnd.nextInt(5)));
                            }
                            w[i] = sb.toString();
                        }
                        String got = Alien.order(w.clone()), want = brute(w);
                        if (!got.equals(want)) {
                            sai = Arrays.toString(w) + " -> \\"" + got + "\\", expected \\"" + want + "\\"";
                        }
                    }
                    r = ketQua("3000 random word lists", 3000, sai);
                }`,
  tep: {
    'Alien.java': j`
import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Set;
import java.util.TreeSet;

public class Alien {

    public static String order(String[] words) {
        //>> return ""; // TODO
        Map<Character, Set<Character>> adj = new HashMap<Character, Set<Character>>();
        Map<Character, Integer> indeg = new HashMap<Character, Integer>();
        for (String w : words) {
            for (char c : w.toCharArray()) {
                if (!adj.containsKey(c)) {
                    adj.put(c, new TreeSet<Character>());
                    indeg.put(c, 0);
                }
            }
        }
        for (int i = 0; i + 1 < words.length; i++) {
            String a = words[i], b = words[i + 1];
            int j = 0;
            while (j < a.length() && j < b.length() && a.charAt(j) == b.charAt(j)) {
                j++;
            }
            if (j == Math.min(a.length(), b.length())) {
                if (a.length() > b.length()) {
                    return ""; // "abc" before "ab" is impossible
                }
                continue; // a prefix: no information
            }
            if (adj.get(a.charAt(j)).add(b.charAt(j))) { // only the FIRST difference counts
                indeg.put(b.charAt(j), indeg.get(b.charAt(j)) + 1);
            }
        }
        PriorityQueue<Character> q = new PriorityQueue<Character>(); // smallest letter first: one fixed answer
        for (char c : indeg.keySet()) {
            if (indeg.get(c) == 0) {
                q.add(c);
            }
        }
        StringBuilder sb = new StringBuilder();
        while (!q.isEmpty()) {
            char u = q.poll();
            sb.append(u);
            for (char w : adj.get(u)) {
                indeg.put(w, indeg.get(w) - 1);
                if (indeg.get(w) == 0) {
                    q.add(w);
                }
            }
        }
        return sb.length() == indeg.size() ? sb.toString() : ""; // letters left over: a cycle
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN toc tob oa obb bnc\nRUN z x z\nRUN abc ab\nRUN ab abc\nRUN z x\nRUN ba bc ac cab\n' },
    { ten: { en: '3000 random word lists', vi: '3000 danh sách từ ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
  ],
  goiY: [
    { en: 'Register every letter of every word first — a letter with no edges still belongs to the answer.', vi: 'Ghi nhận mọi chữ của mọi từ trước — chữ không có cạnh nào vẫn thuộc đáp án.' },
    { en: 'Use a Set for each adjacency list so a repeated edge does not raise the in-degree twice.', vi: 'Dùng Set cho mỗi danh sách kề để cạnh lặp lại không làm bậc vào tăng hai lần.' },
  ],
  loiHayGap: [
    { en: 'Comparing every position of the two words — only the first difference says anything.', vi: 'So mọi vị trí của hai từ — chỉ chỗ khác đầu tiên mới cho thông tin.' },
    { en: 'A plain queue instead of a PriorityQueue — a valid order, but not the one asked for.', vi: 'Hàng đợi thường thay vì PriorityQueue — một thứ tự hợp lệ, nhưng không phải thứ tự đề yêu cầu.' },
  ],
  giaiThich: { en: '<p>Neighbouring words give the only constraints (a sorted list is transitive), at most one edge per pair. A topological order exists iff the constraint graph is acyclic; taking the smallest available letter each time produces the lexicographically smallest valid alphabet — which is exactly what the brute force finds by trying permutations in order.</p>', vi: '<p>Các từ đứng cạnh nhau cho mọi ràng buộc (danh sách đã sắp có tính bắc cầu), mỗi cặp nhiều nhất một cạnh. Thứ tự tô-pô tồn tại khi và chỉ khi đồ thị ràng buộc không có chu trình; mỗi lần lấy chữ nhỏ nhất đang sẵn sàng cho bảng chữ cái hợp lệ nhỏ nhất theo từ điển — đúng thứ vét cạn tìm ra khi thử các hoán vị theo thứ tự.</p>' },
});

const de2 = deCs({
  id: 'csd201-cs8-k-stops',
  tieuDe: { en: 'Cheapest flight with at most k stops — Bellman-Ford for k + 1 rounds, reading a copy', vi: 'Chuyến bay rẻ nhất tối đa k điểm dừng — Bellman-Ford k + 1 vòng, đọc từ bản sao' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['k stops = at most k + 1 flights', 'one round = paths one edge longer', 'relax from the PREVIOUS round’s copy'],
  moTa: {
    en: `<p>Cities 0…n−1; ${c('f[i] = {from, to, price}')} are one-way flights. Complete ${c('static int cheapest(int n, int[][] f, int src, int dst, int k)')}: the cheapest price from src to dst using at most k intermediate stops (k + 1 flights), or −1. Example 0→1 100, 1→2 100, 2→3 100, 0→2 500, 1→3 600 (src 0, dst 3): k = 0 → −1, k = 1 → 600, k = 2 → 300.</p>
<p>Round r of Bellman-Ford finds the best prices with at most r flights — <b>if</b> every relaxation in the round reads the distances of the previous round. Relaxing in place lets one round chain several flights (k = 1 then wrongly gives 300). Dijkstra by price ignores the stop limit.</p>`,
    vi: `<p>Các thành phố 0…n−1; ${c('f[i] = {from, to, price}')} là chuyến bay một chiều. Hoàn thiện ${c('cheapest(n, f, src, dst, k)')}: giá rẻ nhất từ src tới dst dùng tối đa k điểm dừng trung gian (k + 1 chuyến), hoặc −1. Ví dụ 0→1 100, 1→2 100, 2→3 100, 0→2 500, 1→3 600 (src 0, dst 3): k = 0 → −1, k = 1 → 600, k = 2 → 300.</p>
<p>Vòng r của Bellman-Ford tìm giá tốt nhất với tối đa r chuyến — <b>nếu</b> mọi phép nới trong vòng đọc khoảng cách của vòng trước. Nới ngay tại chỗ cho phép một vòng nối nhiều chuyến (k = 1 khi đó ra sai 300). Dijkstra theo giá thì bỏ qua giới hạn điểm dừng.</p>`,
  },
  hen: { n: '2000 cities, 20,000 flights, k = 100', ms: 3000, can: 'O((k + 1) · m)', cham: 'exponential (every route)' },
  dauVao: { en: 'RUN n src dst k from,to,price … · RANDOM · PERF.', vi: 'RUN n src dst k from,to,price … · RANDOM · PERF.' },
  them: `
    static int best;

    static void walk(int u, int dst, int left, int cost, int[][] f) {
        if (u == dst) {
            best = Math.min(best, cost);
        }
        if (left == 0) {
            return;
        }
        for (int[] x : f) {
            if (x[0] == u) {
                walk(x[1], dst, left - 1, cost + x[2], f);
            }
        }
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    int[][] f = new int[p.length - 5][];
                    for (int i = 5; i < p.length; i++) {
                        f[i - 5] = arr(p[i]);
                    }
                    r = String.valueOf(Flights.cheapest(n(1), f, n(2), n(3), n(4)));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(113);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        int n = 2 + rnd.nextInt(5), m = rnd.nextInt(10);
                        int[][] f = new int[m][];
                        for (int i = 0; i < m; i++) {
                            int a = rnd.nextInt(n), b = rnd.nextInt(n - 1);
                            f[i] = new int[] {a, b >= a ? b + 1 : b, 1 + rnd.nextInt(20)};
                        }
                        int src = rnd.nextInt(n), dst = rnd.nextInt(n), k = rnd.nextInt(4);
                        best = Integer.MAX_VALUE;
                        walk(src, dst, k + 1, 0, f);
                        int want = best == Integer.MAX_VALUE ? -1 : best, got = Flights.cheapest(n, f, src, dst, k);
                        if (got != want) {
                            sai = "n=" + n + " " + Arrays.deepToString(f) + " " + src + "->" + dst + " k=" + k + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random flight maps vs every route", 3000, sai);
                } else {
                    final int n = 2000;
                    final int[][] f = new int[20000][];
                    Random rnd = new Random(115);
                    for (int i = 0; i < f.length; i++) {
                        f[i] = new int[] {rnd.nextInt(n), rnd.nextInt(n), 1 + rnd.nextInt(1000)};
                    }
                    final int[] got = new int[2];
                    r = Kiem.hen("2000 cities, 20,000 flights, k = 100", 3000, new Runnable() {
                        public void run() {
                            got[0] = Flights.cheapest(n, f, 0, n - 1, 100);
                            got[1] = Flights.cheapest(n, f, 0, n - 1, 2);
                        }
                    }) + ", prices " + got[0] + " and " + got[1];
                }`,
  tep: {
    'Flights.java': j`
public class Flights {
    static final int INF = Integer.MAX_VALUE / 2;

    public static int cheapest(int n, int[][] f, int src, int dst, int k) {
        //>> return -1; // TODO
        int[] d = new int[n];
        java.util.Arrays.fill(d, INF);
        d[src] = 0;
        for (int round = 0; round <= k; round++) { // k stops = at most k + 1 flights
            int[] prev = d.clone(); // read the PREVIOUS round only
            for (int[] x : f) {
                if (prev[x[0]] != INF && prev[x[0]] + x[2] < d[x[1]]) {
                    d[x[1]] = prev[x[0]] + x[2];
                }
            }
        }
        return d[dst] == INF ? -1 : d[dst];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples (the copy matters for k = 1)', vi: 'ví dụ (bản sao quyết định ở k = 1)' }, vao: 'RUN 4 0 3 0 0,1,100 1,2,100 2,3,100 0,2,500 1,3,600\nRUN 4 0 3 1 0,1,100 1,2,100 2,3,100 0,2,500 1,3,600\nRUN 4 0 3 2 0,1,100 1,2,100 2,3,100 0,2,500 1,3,600\nRUN 3 0 0 0 0,1,5\nRUN 3 0 2 5 0,1,5\n' },
    { ten: { en: '3000 random flight maps', vi: '3000 bản đồ chuyến bay ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Copy d at the start of each round; read from the copy, write into d.', vi: 'Chép d ở đầu mỗi vòng; đọc từ bản sao, ghi vào d.' },
    { en: 'src == dst costs 0 with no flight at all.', vi: 'src == dst tốn 0 mà không cần chuyến nào.' },
  ],
  loiHayGap: [
    { en: 'Relaxing in place — 0→1→3 and 0→1→2→3 can both appear in the first round.', vi: 'Nới tại chỗ — 0→1→3 và 0→1→2→3 có thể cùng xuất hiện ngay vòng đầu.' },
    { en: 'k rounds instead of k + 1 — one flight too few.', vi: 'k vòng thay vì k + 1 — thiếu một chuyến.' },
  ],
  giaiThich: { en: '<p>The invariant "after r rounds d[v] is the cheapest price with at most r flights" holds only if round r extends paths found by round r − 1, hence the copy. (k + 1) rounds over m flights: O(k · m). A Dijkstra over (city, flights used) states also works.</p>', vi: '<p>Bất biến "sau r vòng, d[v] là giá rẻ nhất với tối đa r chuyến" chỉ đúng khi vòng r nối dài các đường mà vòng r − 1 tìm ra, vì thế cần bản sao. (k + 1) vòng trên m chuyến: O(k · m). Dijkstra trên trạng thái (thành phố, số chuyến đã dùng) cũng được.</p>' },
});

const de3 = deCs({
  id: 'csd201-cs8-shortest-bridge',
  tieuDe: { en: 'Shortest bridge between two islands — flood fill, then multi-source BFS', vi: 'Cây cầu ngắn nhất giữa hai đảo — loang, rồi BFS nhiều nguồn' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['mark island 1 (iteratively!)', 'BFS from all its cells at once', 'the first island-2 cell reached'],
  moTa: {
    en: `<p>${c('g')} (0 = water, 1 = land) contains exactly two islands (4-directionally connected). Complete ${c('static int bridge(int[][] g)')}: the fewest water cells to turn into land so that the islands connect. Example ${c('[0,1,0,0,0] [0,1,0,0,0] [0,0,0,0,1]')} → 3; ${c('[0,1] [1,0]')} → 1.</p>
<p>Mark every cell of the first island you find at distance 0 and put <b>all</b> of them in a queue; BFS over water; the distance of the cell from which island 2 is first reached is the answer. Do the marking with an explicit stack or queue — in the complexity check each island has 400,000 cells and a recursive flood fill overflows the stack. Comparing all pairs of land cells is O(A · B).</p>`,
    vi: `<p>${c('g')} (0 = nước, 1 = đất) có đúng hai đảo (liên thông 4 hướng). Hoàn thiện ${c('bridge(g)')}: số ô nước ít nhất cần lấp thành đất để nối hai đảo. Ví dụ ${c('[0,1,0,0,0] [0,1,0,0,0] [0,0,0,0,1]')} → 3; ${c('[0,1] [1,0]')} → 1.</p>
<p>Đánh dấu mọi ô của đảo thứ nhất tìm thấy với khoảng cách 0 và đưa <b>tất cả</b> vào hàng đợi; BFS trên nước; khoảng cách của ô mà từ đó lần đầu chạm đảo 2 là đáp án. Đánh dấu bằng ngăn xếp hoặc hàng đợi tường minh — trong phép kiểm độ phức tạp mỗi đảo có 400.000 ô và loang đệ quy làm tràn ngăn xếp. So mọi cặp ô đất là O(A · B).</p>`,
  },
  hen: { n: '1000 × 1000, islands of 400,000 cells', ms: 3000, can: 'O(R · C)', cham: 'O(A · B) (every pair of land cells), or a recursive flood fill (StackOverflowError)' },
  dauVao: { en: 'RUN row row … · RANDOM · PERF.', vi: 'RUN hàng hàng … · RANDOM · PERF.' },
  them: LUOI + `
    static int[] DR = {-1, 1, 0, 0}, DC = {0, 0, -1, 1};

    static void label(int[][] g, int[][] id, int r, int cc, int k) {
        if (r < 0 || cc < 0 || r >= g.length || cc >= g[0].length || g[r][cc] != 1 || id[r][cc] != 0) {
            return;
        }
        id[r][cc] = k;
        for (int d = 0; d < 4; d++) {
            label(g, id, r + DR[d], cc + DC[d], k);
        }
    }

    // closest pair of cells of the two islands: Manhattan distance - 1
    static int brute(int[][] g) {
        int R = g.length, C = g[0].length;
        int[][] id = new int[R][C];
        int k = 0;
        for (int r = 0; r < R; r++) {
            for (int cc = 0; cc < C; cc++) {
                if (g[r][cc] == 1 && id[r][cc] == 0) {
                    label(g, id, r, cc, ++k);
                }
            }
        }
        int best = Integer.MAX_VALUE;
        for (int a = 0; a < R * C; a++) {
            for (int b = 0; b < R * C; b++) {
                if (id[a / C][a % C] == 1 && id[b / C][b % C] == 2) {
                    best = Math.min(best, Math.abs(a / C - b / C) + Math.abs(a % C - b % C) - 1);
                }
            }
        }
        return best;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(Bridge.bridge(grid(p, 1)));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(117);
                    String sai = null;
                    int done = 0;
                    for (int t = 0; t < 20000 && done < 2000 && sai == null; t++) {
                        int R = 2 + rnd.nextInt(5), C = 2 + rnd.nextInt(5);
                        int[][] g = new int[R][C];
                        for (int[] row : g) {
                            for (int i = 0; i < C; i++) {
                                row[i] = rnd.nextInt(3) == 0 ? 1 : 0;
                            }
                        }
                        int[][] id = new int[R][C];
                        int k = 0;
                        for (int r2 = 0; r2 < R; r2++) {
                            for (int c2 = 0; c2 < C; c2++) {
                                if (g[r2][c2] == 1 && id[r2][c2] == 0) {
                                    label(g, id, r2, c2, ++k);
                                }
                            }
                        }
                        if (k != 2) {
                            continue; // only grids with exactly two islands
                        }
                        done++;
                        int got = Bridge.bridge(g), want = brute(g);
                        if (got != want) {
                            sai = Arrays.deepToString(g) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("random two-island grids vs the closest pair of cells", done, sai);
                } else {
                    final int[][] g = new int[1000][1000];
                    for (int r2 = 0; r2 < 1000; r2++) {
                        for (int c2 = 0; c2 < 1000; c2++) {
                            g[r2][c2] = c2 < 400 || c2 >= 600 ? 1 : 0;
                        }
                    }
                    final int[] got = new int[1];
                    r = Kiem.hen("1000 x 1000, two islands of 400,000 cells", 3000, new Runnable() {
                        public void run() {
                            got[0] = Bridge.bridge(g);
                        }
                    }) + ", bridge " + got[0];
                }`,
  tep: {
    'Bridge.java': j`
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

public class Bridge {
    static final int[] DR = {-1, 1, 0, 0}, DC = {0, 0, -1, 1};

    public static int bridge(int[][] g) {
        //>> return 0; // TODO
        int R = g.length, C = g[0].length;
        int[][] d = new int[R][C];
        for (int[] row : d) {
            Arrays.fill(row, -1);
        }
        Deque<int[]> q = new ArrayDeque<int[]>();
        int sr = -1, sc = -1;
        for (int r = 0; r < R && sr < 0; r++) {
            for (int c = 0; c < C && sr < 0; c++) {
                if (g[r][c] == 1) {
                    sr = r;
                    sc = c;
                }
            }
        }
        Deque<int[]> st = new ArrayDeque<int[]>(); // mark island 1 WITHOUT recursion
        st.push(new int[] {sr, sc});
        d[sr][sc] = 0;
        while (!st.isEmpty()) {
            int[] p = st.pop();
            q.add(p); // every island-1 cell is a BFS source
            for (int k = 0; k < 4; k++) {
                int x = p[0] + DR[k], y = p[1] + DC[k];
                if (x >= 0 && y >= 0 && x < R && y < C && g[x][y] == 1 && d[x][y] == -1) {
                    d[x][y] = 0;
                    st.push(new int[] {x, y});
                }
            }
        }
        while (!q.isEmpty()) { // multi-source BFS over the water
            int[] p = q.poll();
            for (int k = 0; k < 4; k++) {
                int x = p[0] + DR[k], y = p[1] + DC[k];
                if (x < 0 || y < 0 || x >= R || y >= C || d[x][y] != -1) {
                    continue;
                }
                if (g[x][y] == 1) {
                    return d[p[0]][p[1]]; // island 2 reached
                }
                d[x][y] = d[p[0]][p[1]] + 1;
                q.add(new int[] {x, y});
            }
        }
        return -1;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 0,1,0,0,0 0,1,0,0,0 0,0,0,0,1\nRUN 0,1 1,0\nRUN 1,1,1,1,1 1,0,0,0,1 1,0,1,0,1 1,0,0,0,1 1,1,1,1,1\nRUN 1,0,0,0,0,1\n' },
    { ten: { en: 'random two-island grids', vi: 'lưới hai đảo ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Use d[][] = −1 for "not seen": island-1 cells get 0, water cells get their BFS distance.', vi: 'Dùng d[][] = −1 cho "chưa thấy": ô đảo 1 nhận 0, ô nước nhận khoảng cách BFS.' },
    { en: 'The answer is the distance of the cell you stand on when a neighbour is island 2 — not that distance + 1.', vi: 'Đáp án là khoảng cách của ô đang đứng khi một ô kề là đảo 2 — không phải khoảng cách đó + 1.' },
  ],
  loiHayGap: [
    { en: 'A BFS from one cell of island 1 only — the closest point may be on the other side of the island.', vi: 'BFS chỉ từ một ô của đảo 1 — điểm gần nhất có thể ở phía bên kia đảo.' },
    { en: 'A recursive flood fill — StackOverflowError on a 400,000-cell island.', vi: 'Loang đệ quy — StackOverflowError trên đảo 400.000 ô.' },
  ],
  giaiThich: { en: '<p>Starting a BFS from every cell of island 1 at distance 0 is the same as adding a virtual source connected to all of them: one BFS gives every water cell its distance to the nearest island-1 cell, and the first island-2 cell reached closes the shortest bridge. O(R · C).</p>', vi: '<p>Bắt đầu BFS từ mọi ô của đảo 1 với khoảng cách 0 tương đương thêm một nguồn ảo nối với tất cả: một lượt BFS cho mọi ô nước khoảng cách tới ô gần nhất của đảo 1, và ô đảo 2 đầu tiên chạm tới khép lại cây cầu ngắn nhất. O(R · C).</p>' },
});

const de4 = deCs({
  id: 'csd201-cs8-safe-states',
  tieuDe: { en: 'Eventually safe vertices — Kahn on the REVERSED graph', vi: 'Đỉnh an toàn — Kahn trên đồ thị NGƯỢC' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['safe = every walk ends', 'peel vertices with out-degree 0', 'reverse edges to find who waits on whom'],
  moTa: {
    en: `<p>A directed graph has vertices 0…n−1 and edges ${c('{u, v}')}. A vertex is <b>safe</b> if every walk starting from it ends (never reaches a cycle). Complete ${c('static List<Integer> safe(int n, int[][] edges)')}: the safe vertices in increasing order. Example n = 7, edges 0→1 0→2 1→2 1→3 2→5 3→0 4→5 → [2, 4, 5, 6].</p>
<p>Dead ends (out-degree 0) are safe; a vertex all of whose edges lead to safe vertices is safe. Kahn’s algorithm on the reversed graph does exactly that: keep the out-degree of every vertex, start from the dead ends, and when a vertex becomes safe decrease the out-degree of its predecessors. O(n + m); checking from every vertex whether a cycle is reachable is O(n · m).</p>`,
    vi: `<p>Đồ thị có hướng gồm các đỉnh 0…n−1 và cạnh ${c('{u, v}')}. Một đỉnh là <b>an toàn</b> nếu mọi đường đi xuất phát từ nó đều kết thúc (không bao giờ tới chu trình). Hoàn thiện ${c('safe(n, edges)')}: các đỉnh an toàn theo thứ tự tăng. Ví dụ n = 7, cạnh 0→1 0→2 1→2 1→3 2→5 3→0 4→5 → [2, 4, 5, 6].</p>
<p>Đỉnh cụt (bậc ra 0) là an toàn; đỉnh mà mọi cạnh đều dẫn tới đỉnh an toàn thì an toàn. Thuật toán Kahn trên đồ thị ngược làm đúng điều đó: giữ bậc ra của mọi đỉnh, bắt đầu từ các đỉnh cụt, và khi một đỉnh thành an toàn thì giảm bậc ra của các đỉnh đứng trước nó. O(n + m); kiểm từ mọi đỉnh xem có tới được chu trình không là O(n · m).</p>`,
  },
  hen: { n: '200,000 vertices, 400,000 edges', ms: 3000, can: 'O(n + m)', cham: 'O(n · m) (a search from every vertex)' },
  dauVao: { en: 'RUN n u,v u,v … · RANDOM · PERF.', vi: 'RUN n u,v u,v … · RANDOM · PERF.' },
  them: `
    static List<Integer> brute(int n, int[][] e) {
        // v is unsafe iff some vertex on a cycle is reachable from v (with >= 0 edges)
        boolean[][] reach = new boolean[n][n];
        for (int v = 0; v < n; v++) {
            reach[v][v] = true;
        }
        for (int it = 0; it < n; it++) {
            for (int[] x : e) {
                for (int s = 0; s < n; s++) {
                    if (reach[s][x[0]]) {
                        reach[s][x[1]] = true;
                    }
                }
            }
        }
        List<Integer> res = new ArrayList<Integer>();
        for (int v = 0; v < n; v++) {
            boolean ok = true;
            for (int[] x : e) { // an edge u->w with w ->* u lies on a cycle
                if (reach[v][x[0]] && reach[x[1]][x[0]]) {
                    ok = false;
                }
            }
            if (ok) {
                res.add(v);
            }
        }
        return res;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    int[][] e = new int[p.length - 2][];
                    for (int i = 2; i < p.length; i++) {
                        e[i - 2] = arr(p[i]);
                    }
                    r = SafeStates.safe(n(1), e).toString();
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(119);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        int n = 1 + rnd.nextInt(7), m = rnd.nextInt(10);
                        int[][] e = new int[m][];
                        for (int i = 0; i < m; i++) {
                            e[i] = new int[] {rnd.nextInt(n), rnd.nextInt(n)};
                        }
                        String got = SafeStates.safe(n, e).toString(), want = brute(n, e).toString();
                        if (!got.equals(want)) {
                            sai = "n=" + n + " " + Arrays.deepToString(e) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random graphs (self-loops, duplicate edges)", 3000, sai);
                } else {
                    final int n = 200000;
                    final int[][] e = new int[400000][];
                    Random rnd = new Random(121);
                    for (int i = 0; i < e.length; i++) {
                        int a = rnd.nextInt(n), b = rnd.nextInt(n);
                        e[i] = new int[] {a, i % 50 == 0 ? b : Math.max(a, b)}; // mostly forward, a few backward edges
                    }
                    final int[] got = new int[1];
                    r = Kiem.hen("200,000 vertices, 400,000 edges", 3000, new Runnable() {
                        public void run() {
                            got[0] = SafeStates.safe(n, e).size();
                        }
                    }) + ", safe vertices " + got[0];
                }`,
  tep: {
    'SafeStates.java': j`
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

public class SafeStates {

    public static List<Integer> safe(int n, int[][] edges) {
        //>> return new ArrayList<Integer>(); // TODO
        List<List<Integer>> rev = new ArrayList<List<Integer>>();
        for (int i = 0; i < n; i++) {
            rev.add(new ArrayList<Integer>());
        }
        int[] out = new int[n];
        for (int[] e : edges) {
            rev.get(e[1]).add(e[0]);
            out[e[0]]++;
        }
        Deque<Integer> q = new ArrayDeque<Integer>();
        for (int v = 0; v < n; v++) {
            if (out[v] == 0) {
                q.add(v); // dead ends are safe
            }
        }
        boolean[] ok = new boolean[n];
        while (!q.isEmpty()) {
            int u = q.poll();
            ok[u] = true;
            for (int p : rev.get(u)) {
                if (--out[p] == 0) {
                    q.add(p); // every edge of p leads to a safe vertex
                }
            }
        }
        List<Integer> res = new ArrayList<Integer>();
        for (int v = 0; v < n; v++) {
            if (ok[v]) {
                res.add(v);
            }
        }
        return res;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 7 0,1 0,2 1,2 1,3 2,5 3,0 4,5\nRUN 3 0,0 1,2\nRUN 1\nRUN 4 0,1 1,2 2,3 3,1\n' },
    { ten: { en: '3000 random graphs', vi: '3000 đồ thị ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Count out-degrees with multiplicity: a duplicate edge must be "released" twice.', vi: 'Đếm bậc ra tính cả lặp: một cạnh lặp phải được "giải phóng" hai lần.' },
    { en: 'A self-loop keeps its vertex’s out-degree above 0 forever — it is never safe.', vi: 'Khuyên giữ bậc ra của đỉnh luôn lớn hơn 0 — đỉnh đó không bao giờ an toàn.' },
  ],
  loiHayGap: [
    { en: 'Kahn on the original graph (in-degrees) — that finds vertices not reachable FROM a cycle, the opposite question.', vi: 'Kahn trên đồ thị gốc (bậc vào) — tìm ra các đỉnh không tới được TỪ chu trình, câu hỏi ngược lại.' },
    { en: 'A DFS with only "visited" — a vertex reached again through a safe branch is mistaken for a cycle (three colours are needed).', vi: 'DFS chỉ với "đã thăm" — đỉnh gặp lại qua một nhánh an toàn bị nhầm là chu trình (cần ba màu).' },
  ],
  giaiThich: { en: '<p>Peeling from the dead ends is Kahn’s algorithm on the reversed graph: a vertex becomes safe exactly when all its outgoing edges have been removed. Vertices on or leading to a cycle never reach out-degree 0. Each edge is processed once: O(n + m).</p>', vi: '<p>Bóc dần từ các đỉnh cụt chính là Kahn trên đồ thị ngược: một đỉnh thành an toàn đúng khi mọi cạnh ra của nó đã bị gỡ. Các đỉnh nằm trên hoặc dẫn tới chu trình không bao giờ về bậc ra 0. Mỗi cạnh xử lý một lần: O(n + m).</p>' },
});

const de5 = deCs({
  id: 'csd201-cs8-arrow-grid',
  tieuDe: { en: 'Fewest arrow changes to reach the corner — 0-1 BFS with a deque', vi: 'Đổi ít mũi tên nhất để tới góc — 0-1 BFS với deque' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['edge weights 0 or 1', 'weight 0 → addFirst, weight 1 → addLast', 'O(V + E) instead of Dijkstra'],
  moTa: {
    en: `<p>Every cell of ${c('g')} holds an arrow: 1 right, 2 left, 3 down, 4 up. From the top-left cell you may follow the arrow for free, or move to another neighbour by changing the sign of the current cell (cost 1). Complete ${c('static int minChanges(int[][] g)')}: the smallest cost to reach the bottom-right cell. Example ${c('[1,1,1,1] [2,2,2,2] [1,1,1,1] [2,2,2,2]')} → 3; ${c('[1,1,3] [3,2,2] [1,1,4]')} → 0.</p>
<p>It is a shortest path with weights 0 and 1: keep a deque, push a neighbour reached with weight 0 to the <b>front</b> and with weight 1 to the <b>back</b> — the deque then pops vertices in order of distance, like Dijkstra without a heap. O(R · C); an O(V²) Dijkstra fails the 1000 × 1000 check.</p>`,
    vi: `<p>Mỗi ô của ${c('g')} có một mũi tên: 1 phải, 2 trái, 3 xuống, 4 lên. Từ ô trên trái bạn đi theo mũi tên miễn phí, hoặc sang ô kề khác bằng cách đổi dấu của ô hiện tại (tốn 1). Hoàn thiện ${c('minChanges(g)')}: chi phí nhỏ nhất để tới ô dưới phải. Ví dụ ${c('[1,1,1,1] [2,2,2,2] [1,1,1,1] [2,2,2,2]')} → 3; ${c('[1,1,3] [3,2,2] [1,1,4]')} → 0.</p>
<p>Đây là đường đi ngắn nhất với trọng số 0 và 1: giữ một deque, ô kề tới bằng trọng số 0 đẩy vào <b>đầu</b>, trọng số 1 đẩy vào <b>cuối</b> — khi đó deque lấy ra các đỉnh theo thứ tự khoảng cách, như Dijkstra mà không cần heap. O(R · C); Dijkstra O(V²) trượt phép kiểm 1000 × 1000.</p>`,
  },
  hen: { n: '1000 × 1000 grid', ms: 3000, can: 'O(R · C)', cham: 'O(V²) (Dijkstra without a heap)' },
  dauVao: { en: 'RUN row row … (signs 1–4) · RANDOM · PERF.', vi: 'RUN hàng hàng … (dấu 1–4) · RANDOM · PERF.' },
  them: LUOI + `
    static int[] DR = {0, 0, 1, -1}, DC = {1, -1, 0, 0};

    static int dijkstra(int[][] g) {
        int R = g.length, C = g[0].length;
        int[] d = new int[R * C];
        Arrays.fill(d, Integer.MAX_VALUE);
        d[0] = 0;
        boolean[] done = new boolean[R * C];
        for (int it = 0; it < R * C; it++) {
            int u = -1;
            for (int v = 0; v < R * C; v++) {
                if (!done[v] && (u == -1 || d[v] < d[u])) {
                    u = v;
                }
            }
            done[u] = true;
            for (int k = 0; k < 4; k++) {
                int x = u / C + DR[k], y = u % C + DC[k];
                if (x < 0 || y < 0 || x >= R || y >= C) {
                    continue;
                }
                int w = g[u / C][u % C] == k + 1 ? 0 : 1;
                d[x * C + y] = Math.min(d[x * C + y], d[u] + w);
            }
        }
        return d[R * C - 1];
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(ArrowGrid.minChanges(grid(p, 1)));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(123);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        int R = 1 + rnd.nextInt(6), C = 1 + rnd.nextInt(6);
                        int[][] g = new int[R][C];
                        for (int[] row : g) {
                            for (int i = 0; i < C; i++) {
                                row[i] = 1 + rnd.nextInt(4);
                            }
                        }
                        int got = ArrowGrid.minChanges(g), want = dijkstra(g);
                        if (got != want) {
                            sai = Arrays.deepToString(g) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random arrow grids vs O(V^2) Dijkstra", 3000, sai);
                } else {
                    final int[][] g = new int[1000][1000];
                    Random rnd = new Random(125);
                    for (int[] row : g) {
                        for (int i = 0; i < row.length; i++) {
                            row[i] = 1 + rnd.nextInt(4);
                        }
                    }
                    final int[] got = new int[1];
                    r = Kiem.hen("1000 x 1000 grid", 3000, new Runnable() {
                        public void run() {
                            got[0] = ArrowGrid.minChanges(g);
                        }
                    }) + ", changes " + got[0];
                }`,
  tep: {
    'ArrowGrid.java': j`
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

public class ArrowGrid {
    static final int[] DR = {0, 0, 1, -1}, DC = {1, -1, 0, 0}; // signs 1 right, 2 left, 3 down, 4 up

    public static int minChanges(int[][] g) {
        //>> return 0; // TODO
        int R = g.length, C = g[0].length;
        int[][] d = new int[R][C];
        for (int[] row : d) {
            Arrays.fill(row, Integer.MAX_VALUE);
        }
        Deque<int[]> dq = new ArrayDeque<int[]>();
        d[0][0] = 0;
        dq.add(new int[] {0, 0});
        while (!dq.isEmpty()) {
            int[] p = dq.pollFirst();
            for (int k = 0; k < 4; k++) {
                int x = p[0] + DR[k], y = p[1] + DC[k];
                if (x < 0 || y < 0 || x >= R || y >= C) {
                    continue;
                }
                int w = g[p[0]][p[1]] == k + 1 ? 0 : 1; // follow the arrow = 0, change it = 1
                if (d[p[0]][p[1]] + w < d[x][y]) {
                    d[x][y] = d[p[0]][p[1]] + w;
                    if (w == 0) {
                        dq.addFirst(new int[] {x, y});
                    } else {
                        dq.addLast(new int[] {x, y});
                    }
                }
            }
        }
        return d[R - 1][C - 1];
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 1,1,1,1 2,2,2,2 1,1,1,1 2,2,2,2\nRUN 1,1,3 3,2,2 1,1,4\nRUN 1,2 4,3\nRUN 4\nRUN 2,2,2 2,2,2\n' },
    { ten: { en: '3000 random grids', vi: '3000 lưới ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Map sign s to direction index s − 1, so "follow the arrow" means k + 1 == g[r][c].', vi: 'Ánh xạ dấu s thành hướng s − 1, nên "đi theo mũi tên" nghĩa là k + 1 == g[r][c].' },
    { en: 'A cell may be pushed twice; when it is popped with an outdated distance the relaxations simply fail.', vi: 'Một ô có thể bị đẩy hai lần; khi lấy ra với khoảng cách cũ thì các phép nới đơn giản là không thành.' },
  ],
  loiHayGap: [
    { en: 'A plain BFS counting moves — it minimises steps, not sign changes.', vi: 'BFS thường đếm số bước — nó tối thiểu số bước, không phải số lần đổi dấu.' },
    { en: 'Pushing weight-0 neighbours to the back — the deque is no longer sorted by distance.', vi: 'Đẩy ô kề trọng số 0 vào cuối — deque không còn sắp theo khoảng cách.' },
  ],
  giaiThich: { en: '<p>With weights in {0, 1} the frontier only ever holds two distances, d and d + 1; putting 0-edges in front keeps the deque sorted, so every cell is finalised the first time it is popped with its true distance. O(V + E) = O(R · C).</p>', vi: '<p>Với trọng số trong {0, 1}, biên chỉ chứa hai khoảng cách d và d + 1; đặt cạnh 0 ở đầu giữ deque luôn được sắp, nên mỗi ô được chốt ngay lần đầu lấy ra với khoảng cách thật. O(V + E) = O(R · C).</p>' },
});

const de6 = deCs({
  id: 'csd201-cs8-longest-increasing-path',
  tieuDe: { en: 'Longest increasing path in a matrix — count the levels of Kahn’s algorithm', vi: 'Đường tăng dài nhất trong ma trận — đếm số tầng của thuật toán Kahn' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['edge small → larger neighbour: a DAG', 'longest path in a DAG = number of topological levels', 'no recursion: a path can have a million cells'],
  moTa: {
    en: `<p>Complete ${c('static int longest(int[][] a)')}: the number of cells on the longest path that moves up/down/left/right and is <b>strictly increasing</b>. Example ${c('[9,9,4] [6,6,8] [2,1,1]')} → 4 (1, 2, 6, 9).</p>
<p>Edges from each cell to its larger neighbours form a DAG. Kahn’s algorithm level by level: level 1 = cells with no smaller neighbour, then remove them and repeat — the number of levels is the answer. A memoised DFS is also O(R · C) but recursion depth can reach the path length: the complexity check has a snake-shaped increasing path through all 1,000,000 cells.</p>`,
    vi: `<p>Hoàn thiện ${c('longest(a)')}: số ô trên đường dài nhất đi lên/xuống/trái/phải và <b>tăng ngặt</b>. Ví dụ ${c('[9,9,4] [6,6,8] [2,1,1]')} → 4 (1, 2, 6, 9).</p>
<p>Cạnh từ mỗi ô tới các ô kề lớn hơn tạo thành một DAG. Kahn theo từng tầng: tầng 1 = các ô không có ô kề nhỏ hơn, gỡ chúng rồi lặp lại — số tầng là đáp án. DFS có ghi nhớ cũng O(R · C) nhưng độ sâu đệ quy có thể bằng độ dài đường: kiểm độ phức tạp có một đường tăng hình rắn đi qua đủ 1.000.000 ô.</p>`,
  },
  hen: { n: '1000 × 1000 (a snake path of 10⁶ cells)', ms: 3000, can: 'O(R · C), no recursion', cham: 'exponential DFS, or recursion depth 10⁶ (StackOverflowError)' },
  dauVao: { en: 'RUN row row … · RANDOM · PERF.', vi: 'RUN hàng hàng … · RANDOM · PERF.' },
  them: LUOI + `
    static int[] DR = {-1, 1, 0, 0}, DC = {0, 0, -1, 1};

    static int dfs(int[][] a, int r, int cc) {
        int best = 1;
        for (int k = 0; k < 4; k++) {
            int x = r + DR[k], y = cc + DC[k];
            if (x >= 0 && y >= 0 && x < a.length && y < a[0].length && a[x][y] > a[r][cc]) {
                best = Math.max(best, 1 + dfs(a, x, y));
            }
        }
        return best;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = String.valueOf(LongestPath.longest(grid(p, 1)));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(127);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        int R = 1 + rnd.nextInt(5), C = 1 + rnd.nextInt(5);
                        int[][] g = new int[R][C];
                        for (int[] row : g) {
                            for (int i = 0; i < C; i++) {
                                row[i] = rnd.nextInt(t % 2 == 0 ? 4 : 30);
                            }
                        }
                        int want = 0;
                        for (int r2 = 0; r2 < R; r2++) {
                            for (int c2 = 0; c2 < C; c2++) {
                                want = Math.max(want, dfs(g, r2, c2));
                            }
                        }
                        int got = LongestPath.longest(g);
                        if (got != want) {
                            sai = Arrays.deepToString(g) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random grids vs DFS from every cell", 3000, sai);
                } else {
                    final int[][] g = new int[1000][1000];
                    for (int r2 = 0; r2 < 1000; r2++) {
                        for (int c2 = 0; c2 < 1000; c2++) {
                            g[r2][c2] = r2 * 1000 + (r2 % 2 == 0 ? c2 : 999 - c2); // a snake: one increasing path through every cell
                        }
                    }
                    final int[] got = new int[1];
                    r = Kiem.hen("1000 x 1000 snake", 3000, new Runnable() {
                        public void run() {
                            got[0] = LongestPath.longest(g);
                        }
                    }) + ", longest " + got[0];
                }`,
  tep: {
    'LongestPath.java': j`
import java.util.ArrayDeque;
import java.util.Deque;

public class LongestPath {
    static final int[] DR = {-1, 1, 0, 0}, DC = {0, 0, -1, 1};

    public static int longest(int[][] a) {
        //>> return 1; // TODO
        int R = a.length, C = a[0].length;
        int[][] indeg = new int[R][C]; // number of smaller neighbours
        for (int r = 0; r < R; r++) {
            for (int c = 0; c < C; c++) {
                for (int k = 0; k < 4; k++) {
                    int x = r + DR[k], y = c + DC[k];
                    if (x >= 0 && y >= 0 && x < R && y < C && a[x][y] < a[r][c]) {
                        indeg[r][c]++;
                    }
                }
            }
        }
        Deque<int[]> q = new ArrayDeque<int[]>();
        for (int r = 0; r < R; r++) {
            for (int c = 0; c < C; c++) {
                if (indeg[r][c] == 0) {
                    q.add(new int[] {r, c});
                }
            }
        }
        int levels = 0;
        while (!q.isEmpty()) {
            levels++;
            for (int s = q.size(); s > 0; s--) { // one level at a time
                int[] p = q.poll();
                for (int k = 0; k < 4; k++) {
                    int x = p[0] + DR[k], y = p[1] + DC[k];
                    if (x >= 0 && y >= 0 && x < R && y < C && a[x][y] > a[p[0]][p[1]] && --indeg[x][y] == 0) {
                        q.add(new int[] {x, y});
                    }
                }
            }
        }
        return levels;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 9,9,4 6,6,8 2,1,1\nRUN 3,4,5 3,2,6 2,2,1\nRUN 7,7 7,7\nRUN 1\nRUN 1,2,3,4,5\n' },
    { ten: { en: '3000 random grids', vi: '3000 lưới ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Process the queue one level at a time: remember q.size() before the inner loop.', vi: 'Xử lý hàng đợi theo từng tầng: nhớ q.size() trước vòng trong.' },
    { en: 'Equal neighbours are not connected — only strictly larger ones.', vi: 'Các ô kề bằng nhau không nối với nhau — chỉ ô lớn hơn hẳn.' },
  ],
  loiHayGap: [
    { en: 'Plain DFS from every cell without memo — exponential on grids with many increasing paths.', vi: 'DFS trần từ mọi ô không ghi nhớ — hàm mũ trên lưới có nhiều đường tăng.' },
    { en: 'A recursive memoised DFS — correct, but the snake path needs a recursion depth of a million.', vi: 'DFS đệ quy có ghi nhớ — đúng, nhưng đường rắn cần độ sâu đệ quy một triệu.' },
  ],
  giaiThich: { en: '<p>In a DAG the longest path ending at a vertex is 1 + the longest ending at one of its predecessors; processing level by level guarantees all predecessors are done first, and the level of the last vertex removed is the answer. Every cell and edge is handled once: O(R · C), iteratively.</p>', vi: '<p>Trong DAG, đường dài nhất kết thúc ở một đỉnh bằng 1 + đường dài nhất kết thúc ở một đỉnh đứng trước nó; xử lý theo tầng bảo đảm mọi đỉnh đứng trước đã xong, và tầng của đỉnh bị gỡ cuối cùng là đáp án. Mỗi ô và cạnh xử lý một lần: O(R · C), không đệ quy.</p>' },
});

export default moDun({ slug: 'csd201-cs8-on', ten: '10.8 ⭐ CS.8 Advanced graphs — interview problems', de: [de1, de2, de3, de4, de5, de6] });
