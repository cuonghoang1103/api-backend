import java.util.*;

// @thoi-gian
// Same measurement in Java: LC 209 brute O(n^2) vs sliding window O(n), all ones, target = n / 2.
public class CuaSoDo {
    static int brute(int target, int[] a) {
        int best = Integer.MAX_VALUE;
        for (int i = 0; i < a.length; i++) {
            int s = 0;
            for (int j = i; j < a.length; j++) {
                s += a[j];
                if (s >= target) { best = Math.min(best, j - i + 1); break; }
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
    static int window(int target, int[] a) {
        int l = 0, s = 0, best = Integer.MAX_VALUE;
        for (int r = 0; r < a.length; r++) {
            s += a[r];
            while (s >= target) { best = Math.min(best, r - l + 1); s -= a[l++]; }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
    interface Job { void run(); }
    static double ms(Job f, int lap) {
        double best = Double.MAX_VALUE;
        for (int k = 0; k < lap; k++) {
            long t = System.nanoTime();
            f.run();
            best = Math.min(best, (System.nanoTime() - t) / 1e6);
        }
        return best;
    }
    public static void main(String[] args) {
        System.out.printf("%10s | %14s | %12s | answer%n", "n", "brute O(n^2)", "window O(n)");
        for (int n : new int[]{1_000, 10_000, 100_000, 1_000_000}) {
            int[] a = new int[n];
            Arrays.fill(a, 1);
            int target = n / 2;
            String b = n <= 100_000 ? String.format("%.1f ms", ms(() -> brute(target, a), n == 100_000 ? 1 : 3)) : "skipped";
            String w = String.format("%.2f ms", ms(() -> window(target, a), 7));
            System.out.printf("%10s | %14s | %12s | %d%n", String.format("%,d", n), b, w, window(target, a));
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
