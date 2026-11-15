// @thoi-gian
import java.util.*;

// Running median after every insertion: copy + sort per query · sorted ArrayList + binary search + add(index) · two heaps.
public class MedianDo {
    static long seed = 11;
    static int rnd() { seed = (seed * 1103515245L + 12345) % 2147483648L; return (int) seed; }

    static double viaSortCopy(int[] xs) {
        int[] seen = new int[xs.length]; double sum = 0;
        for (int i = 0; i < xs.length; i++) {
            seen[i] = xs[i];
            int[] s = Arrays.copyOf(seen, i + 1); Arrays.sort(s); int n = s.length;
            sum += n % 2 == 1 ? s[n / 2] : (s[n / 2 - 1] + (double) s[n / 2]) / 2;
        }
        return sum;
    }
    static double viaSplice(int[] xs) {
        ArrayList<Integer> s = new ArrayList<>(); double sum = 0;
        for (int x : xs) {
            int lo = 0, hi = s.size();
            while (lo < hi) { int m = (lo + hi) >>> 1; if (s.get(m) < x) lo = m + 1; else hi = m; }
            s.add(lo, x);
            int n = s.size();
            sum += n % 2 == 1 ? s.get(n / 2) : (s.get(n / 2 - 1) + (double) s.get(n / 2)) / 2;
        }
        return sum;
    }
    static double viaHeaps(int[] xs) {
        PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder()), hi = new PriorityQueue<>();
        double sum = 0;
        for (int x : xs) {
            if (lo.isEmpty() || x <= lo.peek()) lo.offer(x); else hi.offer(x);
            if (lo.size() > hi.size() + 1) hi.offer(lo.poll()); else if (hi.size() > lo.size()) lo.offer(hi.poll());
            sum += lo.size() > hi.size() ? lo.peek() : (lo.peek() + (double) hi.peek()) / 2;
        }
        return sum;
    }
    interface Job { double run(); }
    static double[] ms(Job f, int lap) {
        double best = Double.MAX_VALUE, v = 0;
        for (int i = 0; i < lap; i++) { long t0 = System.nanoTime(); v = f.run(); best = Math.min(best, (System.nanoTime() - t0) / 1e6); }
        return new double[]{best, v};
    }
    public static void main(String[] args) {
        System.out.printf("%9s | %19s | %19s | %10s%n", "n", "copy+sort each time", "sorted array+splice", "two heaps");
        for (int n : new int[]{1_000, 10_000, 100_000, 1_000_000}) {
            int[] xs = new int[n];
            for (int i = 0; i < n; i++) xs[i] = rnd() % 1_000_000;
            viaHeaps(xs);                                        // JIT warm-up
            double[] h = ms(() -> viaHeaps(xs), 3);
            String a = "skipped", b = "skipped";
            if (n <= 10_000) { double[] r = ms(() -> viaSortCopy(xs), n <= 1_000 ? 3 : 1); if (r[1] != h[1]) throw new RuntimeException("mismatch"); a = String.format(Locale.ROOT, "%.1f ms", r[0]); }
            if (n <= 100_000) { double[] r = ms(() -> viaSplice(xs), 3); if (r[1] != h[1]) throw new RuntimeException("mismatch"); b = String.format(Locale.ROOT, "%.1f ms", r[0]); }
            System.out.printf(Locale.ROOT, "%,9d | %19s | %19s | %7.1f ms%n", n, a, b, h[0]);
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
