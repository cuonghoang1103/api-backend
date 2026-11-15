// @thoi-gian
import java.util.*;

// Edit distance three ways: plain recursion (no memory) vs memo (top-down) vs table (bottom-up).
public class HcEditDo {
    static long calls = 0;
    static int plain(String a, String b, int i, int j) {
        calls++;
        if (i == 0) return j;
        if (j == 0) return i;
        if (a.charAt(i - 1) == b.charAt(j - 1)) return plain(a, b, i - 1, j - 1);
        return 1 + Math.min(plain(a, b, i - 1, j - 1), Math.min(plain(a, b, i - 1, j), plain(a, b, i, j - 1)));
    }
    static int[][] m;
    static int go(String a, String b, int i, int j) {
        if (i == 0) return j;
        if (j == 0) return i;
        if (m[i][j] >= 0) return m[i][j];
        int r = a.charAt(i - 1) == b.charAt(j - 1) ? go(a, b, i - 1, j - 1)
            : 1 + Math.min(go(a, b, i - 1, j - 1), Math.min(go(a, b, i - 1, j), go(a, b, i, j - 1)));
        return m[i][j] = r;
    }
    static int memo(String a, String b) {
        m = new int[a.length() + 1][b.length() + 1];
        for (int[] r : m) Arrays.fill(r, -1);
        return go(a, b, a.length(), b.length());
    }
    static int table(String a, String b) {
        int[] prev = new int[b.length() + 1], cur = new int[b.length() + 1];
        for (int j = 0; j <= b.length(); j++) prev[j] = j;
        for (int i = 1; i <= a.length(); i++) {
            cur[0] = i;
            for (int j = 1; j <= b.length(); j++)
                cur[j] = a.charAt(i - 1) == b.charAt(j - 1) ? prev[j - 1] : 1 + Math.min(prev[j - 1], Math.min(prev[j], cur[j - 1]));
            int[] t = prev; prev = cur; cur = t;
        }
        return prev[b.length()];
    }
    static double best(Runnable f, int lap) {
        double t = Double.MAX_VALUE;
        for (int k = 0; k < lap; k++) { long s = System.nanoTime(); f.run(); t = Math.min(t, (System.nanoTime() - s) / 1e6); }
        return t;
    }
    static long seed = 20261115;
    static int rnd(int mm) { seed = (seed * 48271) % 2147483647L; return (int) (seed % mm); }
    static String word(int n, String alpha) { StringBuilder sb = new StringBuilder(); for (int k = 0; k < n; k++) sb.append(alpha.charAt(rnd(alpha.length()))); return sb.toString(); }

    public static void main(String[] args) {
        System.out.println("Worst case for plain recursion: a uses letters \"abcd\", b uses \"wxyz\" (no common letter).");
        System.out.printf("%3s | %15s | %11s | %9s | %9s | answer%n", "n", "plain calls", "plain", "memo", "table");
        for (int n = 6; n <= 13; n++) {
            String a = word(n, "abcd"), b = word(n, "wxyz");
            calls = 0;
            int r1 = plain(a, b, n, n);
            long c = calls;
            final int nn = n;
            double tp = best(() -> plain(a, b, nn, nn), n >= 12 ? 1 : 3);
            int r2 = memo(a, b), r3 = table(a, b);
            if (r1 != r2 || r2 != r3) throw new RuntimeException("disagree");
            for (int w = 0; w < 200; w++) { memo(a, b); table(a, b); }   // warm up the JIT for the small rows
            double tm = best(() -> memo(a, b), 5), tt = best(() -> table(a, b), 5);
            System.out.printf("%3d | %,15d | %8.1f ms | %6.3f ms | %6.3f ms | %d%n", n, c, tp, tm, tt, r3);
        }
        System.out.println("Random words over \"acgt\", table vs memo:");
        for (int n : new int[]{100, 1_000, 2_000, 5_000}) {
            String a = word(n, "acgt"), b = word(n, "acgt");
            double tt = best(() -> table(a, b), n >= 2000 ? 2 : 5);
            double tm = best(() -> memo(a, b), 2);
            System.out.printf("n = %,5d  cells = %,10d  table %6.1f ms  memo %6.1f ms  answer = %d%n", n, (long) n * n, tt, tm, table(a, b));
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
