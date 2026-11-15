import java.util.*;
import java.util.function.LongSupplier;

// @thoi-gian
// Same measurement in Java: ALL subsets (2^n · n) and ALL permutations (n! · n). Best of a few runs (JIT warms up).
public class BungNo {
    static List<List<Integer>> res;
    static long cnt;

    static void subStore(int n, int s, ArrayList<Integer> path) {
        res.add(new ArrayList<>(path));
        for (int i = s; i < n; i++) { path.add(i); subStore(n, i + 1, path); path.remove(path.size() - 1); }
    }
    static void subWalk(int n, int s) { cnt++; for (int i = s; i < n; i++) subWalk(n, i + 1); }
    static void permStore(int n, boolean[] used, ArrayList<Integer> path) {
        if (path.size() == n) { res.add(new ArrayList<>(path)); return; }
        for (int i = 0; i < n; i++) if (!used[i]) { used[i] = true; path.add(i); permStore(n, used, path); path.remove(path.size() - 1); used[i] = false; }
    }
    static void permWalk(int n, boolean[] used, int d) {
        if (d == n) { cnt++; return; }
        for (int i = 0; i < n; i++) if (!used[i]) { used[i] = true; permWalk(n, used, d + 1); used[i] = false; }
    }

    static void row(String what, int n, LongSupplier f, int lap) {
        double best = Double.MAX_VALUE; long r = 0;
        for (int k = 0; k < lap; k++) {
            long t = System.nanoTime();
            r = f.getAsLong();
            best = Math.min(best, (System.nanoTime() - t) / 1e6);
        }
        System.out.printf("%-20s n = %2d | %,13d answers | %8.1f ms%n", what, n, r, best);
    }

    public static void main(String[] args) {
        for (int n : new int[]{10, 14, 16, 18, 20})
            row("subsets, store", n, () -> { res = new ArrayList<>(); subStore(n, 0, new ArrayList<>()); return res.size(); }, 3);
        res = null;
        for (int n : new int[]{20, 22, 24, 26})
            row("subsets, walk", n, () -> { cnt = 0; subWalk(n, 0); return cnt; }, 3);
        for (int n : new int[]{6, 7, 8, 9, 10})
            row("permutations, store", n, () -> { res = new ArrayList<>(); permStore(n, new boolean[n], new ArrayList<>()); return res.size(); }, 3);
        res = null;
        for (int n : new int[]{9, 10, 11, 12})
            row("permutations, walk", n, () -> { cnt = 0; permWalk(n, new boolean[n], 0); return cnt; }, n >= 12 ? 1 : 3);
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
