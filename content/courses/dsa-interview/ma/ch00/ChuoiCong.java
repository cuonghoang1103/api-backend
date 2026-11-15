// @thoi-gian
// Hidden O(n^2) in Java: building a String with += inside a loop (String is immutable: every += copies).
public class ChuoiCong {
    // #region an
    static String withPlus(int n) {
        String s = "";
        for (int i = 0; i < n; i++) s += 'x';          // copies the whole string each time
        return s;
    }
    static String withBuilder(int n) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append('x');     // amortised O(1) append
        return sb.toString();
    }
    // #endregion
    interface Job { Object run(); }
    static double ms(Job f) { double best = Double.MAX_VALUE; for (int k = 0; k < 3; k++) { long t = System.nanoTime(); f.run(); best = Math.min(best, (System.nanoTime() - t) / 1e6); } return best; }
    public static void main(String[] args) {
        withPlus(5_000); withBuilder(50_000);
        System.out.printf("%9s | %12s | %14s%n", "n", "String +=", "StringBuilder");
        for (int n : new int[]{1_000, 10_000, 50_000, 100_000}) {
            final int m = n;
            System.out.printf("%9s | %9.1f ms | %11.2f ms%n", String.format("%,d", n), ms(() -> withPlus(m)), ms(() -> withBuilder(m)));
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
