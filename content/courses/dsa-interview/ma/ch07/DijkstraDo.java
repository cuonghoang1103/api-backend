// @thoi-gian
import java.util.*;

public class DijkstraDo {
    static int[][] to, w;
    static void graph(int V) {
        to = new int[V][4]; w = new int[V][4];
        int x = 2024;
        for (int u = 0; u < V; u++) {
            x = (x * 1103515245 + 12345) & 0x7fffffff;
            to[u][0] = (u + 1) % V; w[u][0] = 1 + x % 100;
            for (int k = 1; k < 4; k++) {
                x = (x * 1103515245 + 12345) & 0x7fffffff; to[u][k] = x % V;
                x = (x * 1103515245 + 12345) & 0x7fffffff; w[u][k] = 1 + x % 100;
            }
        }
    }
    static long viaArray(int V) {
        long[] dist = new long[V]; boolean[] done = new boolean[V];
        Arrays.fill(dist, Long.MAX_VALUE); dist[0] = 0;
        for (int k = 0; k < V; k++) {
            int u = -1;
            for (int x = 0; x < V; x++) if (!done[x] && (u == -1 || dist[x] < dist[u])) u = x;
            if (dist[u] == Long.MAX_VALUE) break;
            done[u] = true;
            for (int i = 0; i < 4; i++) { int v = to[u][i]; if (dist[u] + w[u][i] < dist[v]) dist[v] = dist[u] + w[u][i]; }
        }
        long s = 0; for (long d : dist) s += d; return s;
    }
    static long viaHeap(int V) {
        long[] dist = new long[V];
        Arrays.fill(dist, Long.MAX_VALUE); dist[0] = 0;
        PriorityQueue<long[]> pq = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
        pq.add(new long[]{0, 0});
        while (!pq.isEmpty()) {
            long[] top = pq.poll();
            long d = top[0]; int u = (int) top[1];
            if (d > dist[u]) continue;
            for (int i = 0; i < 4; i++) { int v = to[u][i]; if (d + w[u][i] < dist[v]) { dist[v] = d + w[u][i]; pq.add(new long[]{dist[v], v}); } }
        }
        long s = 0; for (long d : dist) s += d; return s;
    }
    interface F { long run(); }
    static double[] ms(F f, int lap) {
        double best = Double.MAX_VALUE; long r = 0;
        for (int k = 0; k < lap; k++) { long t = System.nanoTime(); r = f.run(); best = Math.min(best, (System.nanoTime() - t) / 1e6); }
        return new double[]{best, r};
    }
    public static void main(String[] args) {
        System.out.printf("%9s | %13s | %15s%n", "V", "array O(V^2)", "heap O(E log V)");
        for (int V : new int[]{1_000, 10_000, 30_000, 100_000, 1_000_000}) {
            graph(V);
            double[] a = V <= 30_000 ? ms(() -> viaArray(V), V <= 10_000 ? 3 : 1) : null;
            double[] h = ms(() -> viaHeap(V), 3);
            if (a != null && a[1] != h[1]) throw new RuntimeException("different answers");
            System.out.printf(Locale.US, "%9s | %13s | %15s%n", String.format(Locale.US, "%,d", V),
                a == null ? "skipped" : String.format(Locale.US, "%.1f ms", a[0]), String.format(Locale.US, "%.1f ms", h[0]));
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
