// @thoi-gian
// N-Queens in Java: C = three boolean arrays (the lesson's solution), D = bitmask (same tree, cheaper per node).
public class HauDo {
    static long nodes, sol;
    static boolean[] cols, diag, anti;

    static void c(int r, int n) {
        nodes++;
        if (r == n) { sol++; return; }
        for (int col = 0; col < n; col++) {
            int d = r - col + n - 1, a = r + col;
            if (cols[col] || diag[d] || anti[a]) continue;
            cols[col] = diag[d] = anti[a] = true;
            c(r + 1, n);
            cols[col] = diag[d] = anti[a] = false;
        }
    }

    static void d(int colsMask, int d1, int d2, int full) {
        nodes++;
        if (colsMask == full) { sol++; return; }
        int free = full & ~(colsMask | d1 | d2);
        while (free != 0) {
            int bit = free & -free;
            free -= bit;
            d(colsMask | bit, ((d1 | bit) << 1) & full, (d2 | bit) >> 1, full);
        }
    }

    public static void main(String[] args) {
        System.out.println(" n | solutions | nodes (pruned) | C arrays  | D bitmask");
        for (int n = 8; n <= 15; n++) {
            double bc = Double.MAX_VALUE, bd = Double.MAX_VALUE;
            long nc = 0, s = 0;
            for (int k = 0; k < (n >= 14 ? 2 : 5); k++) {
                cols = new boolean[n]; diag = new boolean[2 * n - 1]; anti = new boolean[2 * n - 1];
                nodes = 0; sol = 0;
                long t = System.nanoTime();
                c(0, n);
                bc = Math.min(bc, (System.nanoTime() - t) / 1e6);
                nc = nodes; s = sol;
                nodes = 0; sol = 0;
                t = System.nanoTime();
                d(0, 0, 0, (1 << n) - 1);
                bd = Math.min(bd, (System.nanoTime() - t) / 1e6);
                if (nodes != nc || sol != s) throw new IllegalStateException("C and D disagree at n = " + n);
            }
            System.out.printf("%2d | %,9d | %,14d | %6.1f ms | %6.1f ms%n", n, s, nc, bc, bd);
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
