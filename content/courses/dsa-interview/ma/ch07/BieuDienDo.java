// @thoi-gian
import java.util.*;

public class BieuDienDo {
    static int[] arcs(int V) {
        int[] a = new int[V * 4];
        int x = 12345;
        for (int u = 0; u < V; u++) {
            a[u * 4] = (u + 1) % V;
            for (int k = 1; k < 4; k++) { x = (x * 1103515245 + 12345) & 0x7fffffff; a[u * 4 + k] = x % V; }
        }
        return a;
    }
    static int viaMatrix(int V, int[] A) {
        byte[] m = new byte[V * V];
        for (int u = 0; u < V; u++) for (int k = 0; k < 4; k++) m[u * V + A[u * 4 + k]] = 1;
        boolean[] seen = new boolean[V];
        int[] q = new int[V];
        int head = 0, tail = 0, cnt = 1;
        q[tail++] = 0; seen[0] = true;
        while (head < tail) {
            int u = q[head++];
            for (int v = 0; v < V; v++) if (m[u * V + v] == 1 && !seen[v]) { seen[v] = true; cnt++; q[tail++] = v; }
        }
        return cnt;
    }
    static int viaList(int V, int[] A) {
        List<List<Integer>> adj = new ArrayList<>(V);
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
        for (int u = 0; u < V; u++) for (int k = 0; k < 4; k++) adj.get(u).add(A[u * 4 + k]);
        boolean[] seen = new boolean[V];
        ArrayDeque<Integer> q = new ArrayDeque<>();
        q.add(0); seen[0] = true;
        int cnt = 1;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : adj.get(u)) if (!seen[v]) { seen[v] = true; cnt++; q.add(v); }
        }
        return cnt;
    }
    interface F { int run(); }
    static double[] ms(F f, int lap) {
        double best = Double.MAX_VALUE; int r = 0;
        for (int k = 0; k < lap; k++) { long t = System.nanoTime(); r = f.run(); best = Math.min(best, (System.nanoTime() - t) / 1e6); }
        return new double[]{best, r};
    }
    static String cells(long x) {
        int e = (int) Math.floor(Math.log10(x) + 1e-9);
        return String.format(Locale.US, "%.1fe%d", x / Math.pow(10, e), e);
    }
    public static void main(String[] args) {
        System.out.printf("%9s | %12s | %10s | %11s | %9s%n", "V", "matrix cells", "list cells", "matrix", "list");
        for (int V : new int[]{1_000, 4_000, 16_000, 100_000, 1_000_000}) {
            int[] A = arcs(V);
            double[] mat = V <= 16_000 ? ms(() -> viaMatrix(V, A), V <= 4_000 ? 3 : 1) : null;
            double[] lst = ms(() -> viaList(V, A), 3);
            if (mat != null && mat[1] != lst[1]) throw new RuntimeException("mismatch");
            System.out.printf(Locale.US, "%9s | %12s | %10s | %11s | %9s%n", String.format(Locale.US, "%,d", V), cells((long) V * V), cells(5L * V),
                mat == null ? "skipped" : String.format(Locale.US, "%.1f ms", mat[0]), String.format(Locale.US, "%.1f ms", lst[0]));
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
