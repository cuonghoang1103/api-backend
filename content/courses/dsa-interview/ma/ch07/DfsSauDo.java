// @thoi-gian
import java.util.*;

public class DfsSauDo {
    static final int N = 1000;
    static int depth, deepest;

    static byte[][] fresh() { byte[][] g = new byte[N][N]; for (byte[] row : g) Arrays.fill(row, (byte) 1); return g; }

    // #region de-quy
    static void fillRec(byte[][] g, int r, int c) {
        if (r < 0 || r >= N || c < 0 || c >= N || g[r][c] != 1) return;
        g[r][c] = 2;
        depth++; if (depth > deepest) deepest = depth;
        fillRec(g, r + 1, c); fillRec(g, r - 1, c); fillRec(g, r, c + 1); fillRec(g, r, c - 1);
        depth--;
    }
    // #endregion

    static int fillIter(byte[][] g) {
        int[] stack = new int[N * N];
        int top = 0, count = 0;
        stack[top++] = 0; g[0][0] = 2;
        while (top > 0) {
            int cell = stack[--top], r = cell / N, c = cell % N;
            count++;
            if (r + 1 < N && g[r + 1][c] == 1) { g[r + 1][c] = 2; stack[top++] = cell + N; }
            if (r - 1 >= 0 && g[r - 1][c] == 1) { g[r - 1][c] = 2; stack[top++] = cell - N; }
            if (c + 1 < N && g[r][c + 1] == 1) { g[r][c + 1] = 2; stack[top++] = cell + 1; }
            if (c - 1 >= 0 && g[r][c - 1] == 1) { g[r][c - 1] = 2; stack[top++] = cell - 1; }
        }
        return count;
    }

    static String tryWithStack(long bytes) throws InterruptedException {
        String[] res = new String[1];
        Thread t = new Thread(null, () -> {
            depth = 0; deepest = 0;
            try { fillRec(fresh(), 0, 0); res[0] = String.format(Locale.US, "ok, depth %,d", deepest); }
            catch (StackOverflowError e) { res[0] = String.format(Locale.US, "StackOverflowError at depth %,d", deepest); }
        }, "dfs", bytes);
        t.start(); t.join();
        return res[0];
    }

    public static void main(String[] args) throws Exception {
        System.out.printf(Locale.US, "grid %d x %d = %,d land cells%n", N, N, N * N);
        for (long kb : new long[]{512, 2048, 8192, 65536, 262144}) {
            System.out.printf(Locale.US, "%,7d KB thread stack: %s%n", kb, tryWithStack(kb * 1024));
        }
        double best = Double.MAX_VALUE; int cnt = 0;
        for (int k = 0; k < 3; k++) { byte[][] g = fresh(); long t = System.nanoTime(); cnt = fillIter(g); best = Math.min(best, (System.nanoTime() - t) / 1e6); }
        System.out.printf(Locale.US, "iterative DFS (own stack): %,d cells in %.1f ms%n", cnt, best);
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
