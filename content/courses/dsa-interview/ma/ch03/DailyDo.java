// @thoi-gian
// Same measurement in Java (best of several runs so the JIT has warmed up).
public class DailyDo {
    static int[] brute(int[] t) {
        int[] ans = new int[t.length];
        for (int i = 0; i < t.length; i++)
            for (int j = i + 1; j < t.length; j++)
                if (t[j] > t[i]) { ans[i] = j - i; break; }
        return ans;
    }
    static int[] mono(int[] t) {
        int[] ans = new int[t.length], st = new int[t.length];
        int top = -1;
        for (int i = 0; i < t.length; i++) {
            while (top >= 0 && t[i] > t[st[top]]) { int j = st[top--]; ans[j] = i - j; }
            st[++top] = i;
        }
        return ans;
    }
    interface Job { void run(); }
    static double ms(Job f, int lap) {
        double best = Double.MAX_VALUE;
        for (int k = 0; k < lap; k++) { long t = System.nanoTime(); f.run(); best = Math.min(best, (System.nanoTime() - t) / 1e6); }
        return best;
    }
    public static void main(String[] args) {
        System.out.printf("%10s | %14s | %11s%n", "n", "brute O(n^2)", "stack O(n)");
        for (int n : new int[]{1_000, 10_000, 100_000, 1_000_000}) {
            int[] t = new int[n];
            for (int i = 0; i < n; i++) t[i] = n - i;
            String b = n <= 100_000 ? String.format("%.1f ms", ms(() -> brute(t), n == 100_000 ? 1 : 3)) : "skipped";
            String s = String.format("%.2f ms", ms(() -> mono(t), 5));
            System.out.printf("%10s | %14s | %11s%n", String.format("%,d", n), b, s);
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
