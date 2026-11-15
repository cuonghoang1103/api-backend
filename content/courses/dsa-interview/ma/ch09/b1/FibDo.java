// @thoi-gian
// The promise of lesson 0.1, kept: naive recursive Fibonacci vs the three DP versions, n = 10 … 45 (Java).
import java.util.*;

public class FibDo {
    static long calls = 0;
    static long naive(int n) { calls++; return n < 2 ? n : naive(n - 1) + naive(n - 2); }

    static long memoFib(int n, long[] memo) {
        calls++;
        if (n < 2) return n;
        if (memo[n] != 0) return memo[n];                 // fib(n) > 0 for n >= 1, so 0 means "not solved yet"
        return memo[n] = memoFib(n - 1, memo) + memoFib(n - 2, memo);
    }
    static long table(int n) {
        long[] dp = new long[n + 1];
        if (n >= 1) dp[1] = 1;
        for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
        return dp[n];
    }
    static long twoVars(int n) {
        long a = 0, b = 1;
        for (int i = 0; i < n; i++) { long c = a + b; a = b; b = c; }
        return a;
    }

    static long sink = 0;
    interface Job { void run(); }
    static double best(Job f, int lap) {
        double b = Double.MAX_VALUE;
        for (int k = 0; k < lap; k++) { long t = System.nanoTime(); f.run(); b = Math.min(b, (System.nanoTime() - t) / 1e6); }
        return b;
    }
    static final int REP = 10_000;
    static double perRunUs(Job f) { return best(() -> { for (int r = 0; r < REP; r++) f.run(); }, 5) * 1000 / REP; }

    public static void main(String[] args) {
        System.out.printf("%3s | %13s | %13s | %10s | %10s | %8s | %8s | %8s%n", "n", "fib(n)", "naive calls", "naive", "memo calls", "memo", "table", "2 vars");
        for (int n : new int[]{10, 20, 25, 30, 35, 40, 45}) {
            final int m = n;
            final long[] v1 = new long[1];
            double tn = best(() -> { calls = 0; v1[0] = naive(m); }, n >= 40 ? 1 : 3);   // timed run = counted run
            long v = v1[0], nc = calls;
            calls = 0; long vm = memoFib(n, new long[n + 1]); long mc = calls;
            if (vm != v || table(n) != v || twoVars(n) != v) throw new IllegalStateException("versions disagree at n=" + n);
            double tm = perRunUs(() -> { sink += memoFib(m, new long[m + 1]); });
            double tt = perRunUs(() -> { sink += table(m); });
            double t2 = perRunUs(() -> { sink += twoVars(m); });
            System.out.printf("%3d | %13s | %13s | %10s | %10d | %8s | %8s | %8s%n", n, String.format("%,d", v), String.format("%,d", nc),
                String.format("%.1f ms", tn), mc, String.format("%.2f µs", tm), String.format("%.2f µs", tt), String.format("%.2f µs", t2));
        }
        System.out.println("(sink " + (sink > 0 ? "ok" : "?") + ") java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
