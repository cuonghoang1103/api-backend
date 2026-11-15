// @thoi-gian
public class HamPhuDo {
    static long countInline(int rows, int cols) {
        long total = 0;
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++) {
                if (r - 1 >= 0 && r - 1 < rows && c >= 0 && c < cols) total++;
                if (r + 1 >= 0 && r + 1 < rows && c >= 0 && c < cols) total++;
                if (r >= 0 && r < rows && c - 1 >= 0 && c - 1 < cols) total++;
                if (r >= 0 && r < rows && c + 1 >= 0 && c + 1 < cols) total++;
            }
        return total;
    }

    // #region helper
    static boolean inBounds(int row, int col, int rows, int cols) {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    }

    static long countHelper(int rows, int cols) {
        long total = 0;
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++) {
                if (inBounds(r - 1, c, rows, cols)) total++;
                if (inBounds(r + 1, c, rows, cols)) total++;
                if (inBounds(r, c - 1, rows, cols)) total++;
                if (inBounds(r, c + 1, rows, cols)) total++;
            }
        return total;
    }
    // #endregion

    // #region huong
    static final int[][] DIRECTIONS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    static long countDirections(int rows, int cols) {
        long total = 0;
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
                for (int[] d : DIRECTIONS)
                    if (inBounds(r + d[0], c + d[1], rows, cols)) total++;
        return total;
    }
    // #endregion

    interface F { long run(); }

    static double[] best(F f) {
        double ms = Double.MAX_VALUE;
        long out = 0;
        for (int k = 0; k < 7; k++) {
            long t = System.nanoTime();
            out = f.run();
            ms = Math.min(ms, (System.nanoTime() - t) / 1e6);
        }
        return new double[] {ms, out};
    }

    public static void main(String[] args) {
        final int COLS = 1000;
        System.out.printf("%12s | %10s | %10s | %10s%n", "cells", "inline", "helper", "DIRECTIONS");
        for (int cells : new int[] {100_000, 1_000_000, 10_000_000}) {
            int rows = cells / COLS;
            double[] a = best(() -> countInline(rows, COLS));
            double[] b = best(() -> countHelper(rows, COLS));
            double[] c = best(() -> countDirections(rows, COLS));
            if (a[1] != b[1] || b[1] != c[1]) throw new IllegalStateException("different answers");
            System.out.printf("%12s | %10s | %10s | %10s%n", String.format("%,d", cells),
                String.format("%.2f ms", a[0]), String.format("%.2f ms", b[0]), String.format("%.2f ms", c[0]));
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
