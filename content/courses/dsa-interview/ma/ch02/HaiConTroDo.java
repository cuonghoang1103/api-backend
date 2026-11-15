// @thoi-gian
// Same measurement in Java: brute O(n^2) vs binary search O(n log n) vs two pointers O(n).
public class HaiConTroDo {
    static int[] brute(int[] a, int t) {
        for (int i = 0; i < a.length; i++)
            for (int j = i + 1; j < a.length; j++)
                if (a[i] + a[j] == t) return new int[]{i + 1, j + 1};
        return new int[0];
    }
    static int[] binary(int[] a, int t) {
        for (int i = 0; i < a.length; i++) {
            int need = t - a[i], lo = i + 1, hi = a.length - 1;
            while (lo <= hi) {
                int mid = (lo + hi) >>> 1;
                if (a[mid] == need) return new int[]{i + 1, mid + 1};
                if (a[mid] < need) lo = mid + 1; else hi = mid - 1;
            }
        }
        return new int[0];
    }
    static int[] two(int[] a, int t) {
        int l = 0, r = a.length - 1;
        while (l < r) {
            int s = a[l] + a[r];
            if (s == t) return new int[]{l + 1, r + 1};
            if (s < t) l++; else r--;
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
        System.out.printf("%10s | %14s | %18s | %13s%n", "n", "brute O(n^2)", "binary O(n log n)", "two ptr O(n)");
        for (int n : new int[]{1_000, 10_000, 100_000, 1_000_000}) {
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = i;
            int t = (n - 2) + (n - 1);
            String b = n <= 100_000 ? String.format("%.1f ms", ms(() -> brute(a, t), n == 100_000 ? 1 : 3)) : "skipped";
            String s = String.format("%.2f ms", ms(() -> binary(a, t), 5));
            String p = String.format("%.2f ms", ms(() -> two(a, t), 7));
            System.out.printf("%10s | %14s | %18s | %13s%n", String.format("%,d", n), b, s, p);
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
