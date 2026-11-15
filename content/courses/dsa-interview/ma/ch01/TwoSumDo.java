import java.util.*;

// @thoi-gian
// Same measurement in Java (JIT warms up first, so we run each case a few times and keep the best).
public class TwoSumDo {
    static int[] brute(int[] a, int t) {
        for (int i = 0; i < a.length; i++)
            for (int j = i + 1; j < a.length; j++)
                if (a[i] + a[j] == t) return new int[]{i, j};
        return new int[0];
    }
    static int[] hash(int[] a, int t) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < a.length; i++) {
            Integer j = seen.get(t - a[i]);
            if (j != null) return new int[]{j, i};
            seen.put(a[i], i);
        }
        return new int[0];
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
        System.out.printf("%10s | %14s | %11s%n", "n", "brute O(n^2)", "hash O(n)");
        for (int n : new int[]{1_000, 10_000, 100_000, 1_000_000}) {
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = i;
            int t = (n - 2) + (n - 1);
            String b = n <= 100_000 ? String.format("%.1f ms", ms(() -> brute(a, t), n == 100_000 ? 1 : 3)) : "skipped";
            String h = String.format("%.2f ms", ms(() -> hash(a, t), 5));
            System.out.printf("%10s | %14s | %11s%n", String.format("%,d", n), b, h);
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
