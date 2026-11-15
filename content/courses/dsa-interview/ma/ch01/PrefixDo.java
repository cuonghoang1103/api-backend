// @thoi-gian
// Same measurement in Java: range-sum queries and range-add updates, naive O(n·q) vs prefix / difference O(n+q).
public class PrefixDo {
    static long seed;
    static int rnd(int m) { seed = (seed * 48271L) % 2147483647L; return (int) (seed % m); }
    interface Job { long run(); }
    static double ms(Job f, int lap) {
        double best = Double.MAX_VALUE;
        for (int k = 0; k < lap; k++) { long t = System.nanoTime(); f.run(); best = Math.min(best, (System.nanoTime() - t) / 1e6); }
        return best;
    }
    public static void main(String[] args) {
        System.out.printf("%10s | %11s | %10s | %11s | %9s%n", "n = q", "sum naive", "sum prefix", "add naive", "add diff");
        for (int n : new int[]{1_000, 10_000, 100_000, 1_000_000}) {
            int q = n;
            seed = 12345;
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = rnd(1000);
            int[] L = new int[q], R = new int[q];
            for (int i = 0; i < q; i++) { int x = rnd(n), y = rnd(n); L[i] = Math.min(x, y); R[i] = Math.max(x, y); }
            Job sumNaive = () -> { long chk = 0; for (int i = 0; i < q; i++) { long s = 0; for (int j = L[i]; j <= R[i]; j++) s += a[j]; chk += s; } return chk; };
            Job sumPrefix = () -> {
                long[] P = new long[n + 1];
                for (int i = 0; i < n; i++) P[i + 1] = P[i] + a[i];
                long chk = 0; for (int i = 0; i < q; i++) chk += P[R[i] + 1] - P[L[i]]; return chk;
            };
            Job addNaive = () -> { int[] b = new int[n]; for (int i = 0; i < q; i++) for (int j = L[i]; j <= R[i]; j++) b[j]++; return b[n >> 1]; };
            Job addDiff = () -> {
                int[] d = new int[n + 1];
                for (int i = 0; i < q; i++) { d[L[i]]++; d[R[i] + 1]--; }
                int[] b = new int[n]; int run = 0; for (int j = 0; j < n; j++) { run += d[j]; b[j] = run; } return b[n >> 1];
            };
            boolean big = n >= 1_000_000;
            if (!big && (sumNaive.run() != sumPrefix.run() || addNaive.run() != addDiff.run())) throw new RuntimeException("results differ");
            String t1 = big ? "skipped" : String.format("%.1f ms", ms(sumNaive, n == 100_000 ? 1 : 3));
            String t2 = String.format("%.2f ms", ms(sumPrefix, 5));
            String t3 = big ? "skipped" : String.format("%.1f ms", ms(addNaive, n == 100_000 ? 1 : 3));
            String t4 = String.format("%.2f ms", ms(addDiff, 5));
            System.out.printf("%10s | %11s | %10s | %11s | %9s%n", String.format("%,d", n), t1, t2, t3, t4);
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
