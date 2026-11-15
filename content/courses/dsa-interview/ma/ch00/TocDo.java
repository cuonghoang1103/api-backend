import java.util.*;

// @thoi-gian
public class TocDo {
    interface Job { long run(); }
    static double ms(Job f, int lap) {
        double best = Double.MAX_VALUE;
        for (int k = 0; k < lap; k++) { long t = System.nanoTime(); f.run(); best = Math.min(best, (System.nanoTime() - t) / 1e6); }
        return best;
    }
    static long linear(int n) { long s = 0; for (int i = 0; i < n; i++) s = (s + i * 7L) % 1000003; return s; }
    static long nlogn(int n) { int[] a = new int[n]; for (int i = 0; i < n; i++) a[i] = (int) ((i * 2654435761L) % 1000003); Arrays.sort(a); return a[0]; }
    static long quad(int n) { long s = 0; for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) s = (s + (long) i * j) % 1000003; return s; }
    public static void main(String[] args) {
        linear(10_000_000); quad(2_000); nlogn(100_000);   // JIT warm-up
        double t8 = ms(() -> linear(100_000_000), 1);
        System.out.printf("10^8 simple loop steps: %.0f ms  => about %.0f million steps/second%n", t8, 1e8 / t8 * 1000 / 1e6);
        System.out.printf("%11s | %10s | %16s | %12s%n", "n", "O(n)", "O(n log n) sort", "O(n^2)");
        for (int n : new int[]{1_000, 10_000, 100_000, 1_000_000}) {
            final int m = n;
            String a = String.format("%.2f ms", ms(() -> linear(m), 3));
            String b = String.format("%.1f ms", ms(() -> nlogn(m), 3));
            String c = n <= 30_000 ? String.format("%.0f ms", ms(() -> quad(m), 1))
                : String.format("~%.0f s (est.)", Math.pow(n / 10_000.0, 2) * ms(() -> quad(10_000), 1) / 1000);
            System.out.printf("%11s | %10s | %16s | %12s%n", String.format("%,d", n), a, b, c);
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
