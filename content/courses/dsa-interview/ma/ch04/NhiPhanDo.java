// @thoi-gian
// Same measurement in Java: linear scan vs binary search, n = 10^3 ... 10^7, Q queries, exact comparison counts.
public class NhiPhanDo {
    static long cmp;
    static int linear(int[] a, int x) {
        int i = 0;
        while (true) { cmp++; if (i == a.length || a[i] >= x) return i; i++; }
    }
    static int lower(int[] a, int x) {
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            cmp++;
            if (a[mid] >= x) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
    interface Job { void run(); }
    static double best(Job f, int lap) {
        double b = Double.MAX_VALUE;
        for (int k = 0; k < lap; k++) { long t = System.nanoTime(); f.run(); b = Math.min(b, (System.nanoTime() - t) / 1e6); }
        return b;
    }
    public static void main(String[] args) {
        final int Q = 200;
        System.out.println("Q = " + Q + " queries per row");
        System.out.printf("%12s | %16s | %16s | %7s | %11s | %9s%n", "n", "linear cmp/query", "binary cmp/query", "log2(n)", "linear Q", "binary Q");
        for (int n : new int[]{1_000, 10_000, 100_000, 1_000_000, 10_000_000}) {
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = 2 * i;
            int[] qs = new int[Q];
            long seed = 7;
            for (int k = 0; k < Q; k++) { seed = (seed * 48271) % 2147483647L; qs[k] = (int) (2 * (seed % n)); }
            long s1 = 0, s2 = 0;
            cmp = 0; for (int x : qs) s1 += linear(a, x); long cl = cmp;
            cmp = 0; for (int x : qs) s2 += lower(a, x); long cb = cmp;
            if (s1 != s2) throw new IllegalStateException("linear and binary disagree");
            int lap = n >= 1_000_000 ? 2 : 5;
            double tl = best(() -> { for (int x : qs) linear(a, x); }, lap);
            double tb = best(() -> { for (int x : qs) lower(a, x); }, 20);
            System.out.printf("%12s | %16s | %16.1f | %7.1f | %11s | %9s%n", String.format("%,d", n), String.format("%,d", Math.round((double) cl / Q)),
                (double) cb / Q, Math.log(n) / Math.log(2), String.format("%.1f ms", tl), String.format("%.3f ms", tb));
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
