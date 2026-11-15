// @thoi-gian
import java.util.*;

public class DsuDo {
    static int[] parent, size;
    static long hops;
    static boolean compress;
    static int find(int x) {
        int r = x;
        while (parent[r] != r) { r = parent[r]; hops++; }
        if (compress) while (parent[x] != r) { int nx = parent[x]; parent[x] = r; x = nx; }
        return r;
    }
    static String run(int n, boolean comp, boolean bySize) {
        parent = new int[n]; size = new int[n]; hops = 0; compress = comp;
        for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
        long t = System.nanoTime();
        for (int i = 0; i + 1 < n; i++) {
            int a = find(i), b = find(i + 1);
            if (a == b) continue;
            if (bySize && size[a] > size[b]) { int tmp = a; a = b; b = tmp; }
            parent[a] = b;
            size[b] += size[a];
        }
        for (int q = 0; q < n; q++) find(0);
        return String.format(Locale.US, "%.1f ms / %,d", (System.nanoTime() - t) / 1e6, hops);
    }
    public static void main(String[] args) {
        System.out.printf("%9s | %24s | %22s | %22s | %22s%n", "n", "naive", "size only", "compression only", "both");
        for (int n : new int[]{1_000, 10_000, 100_000, 1_000_000}) {
            System.out.printf("%9s | %24s | %22s | %22s | %22s%n", String.format(Locale.US, "%,d", n),
                n <= 10_000 ? run(n, false, false) : "skipped", run(n, false, true), run(n, true, false), run(n, true, true));
        }
        System.out.println("cells: time / pointer hops");
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
