// @thoi-gian
import java.util.regex.Pattern;

// ReDoS, measured on java.util.regex (Java 21) + the LC 10 naive recursion vs DP.
public class LuRedosDo {
    static double time(Runnable f, int lap) {
        double b = Double.MAX_VALUE;
        for (int k = 0; k < lap; k++) { long t = System.nanoTime(); f.run(); b = Math.min(b, (System.nanoTime() - t) / 1e6); }
        return b;
    }
    static long calls;
    static boolean naive(String s, String p, int i, int j) {
        calls++;
        if (j == p.length()) return i == s.length();
        boolean first = i < s.length() && (p.charAt(j) == '.' || p.charAt(j) == s.charAt(i));
        if (j + 1 < p.length() && p.charAt(j + 1) == '*') return naive(s, p, i, j + 2) || (first && naive(s, p, i + 1, j));
        return first && naive(s, p, i + 1, j + 1);
    }
    static boolean isMatch(String s, String p) {
        int n = s.length(), m = p.length();
        boolean[][] dp = new boolean[n + 1][m + 1];
        dp[0][0] = true;
        for (int j = 2; j <= m; j++) if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 2];
        for (int i = 1; i <= n; i++) for (int j = 1; j <= m; j++) {
            char c = p.charAt(j - 1);
            if (c == '*') { char x = p.charAt(j - 2); dp[i][j] = dp[i][j - 2] || ((x == '.' || x == s.charAt(i - 1)) && dp[i - 1][j]); }
            else dp[i][j] = (c == '.' || c == s.charAt(i - 1)) && dp[i - 1][j - 1];
        }
        return dp[n][m];
    }

    public static void main(String[] args) {
        Pattern evil = Pattern.compile("(a+)+");
        System.out.println("A) Pattern \"(a+)+\" matches \"a\".repeat(n) + \"!\"  — java.util.regex");
        for (int n = 18; n <= 27; n++) {
            String s = "a".repeat(n) + "!";
            double t = time(() -> evil.matcher(s).matches(), 3);
            System.out.printf("  n = %2d  %8.3f ms%n", n, t);
        }
        Pattern evil2 = Pattern.compile("(.*a){12}");
        System.out.println("A2) Pattern \"(.*a){12}\" matches \"a\".repeat(n) + \"!\"");
        double prev = 0;
        for (int n = 16; n <= 28; n += 2) {
            String s = "a".repeat(n) + "!";
            double t = time(() -> evil2.matcher(s).matches(), n <= 24 ? 2 : 1);
            System.out.printf("  n = %2d  %8.1f ms%s%n", n, t, prev > 0 ? String.format("   x%.1f vs n-2", t / prev) : "");
            prev = t;
        }
        String P = "a*".repeat(8) + "b";
        System.out.println("B) LC 10, p = \"" + P + "\", s = \"a\".repeat(n)");
        System.out.printf("  %4s | %12s | %9s | %8s | %7s%n", "n", "naive calls", "naive ms", "DP cells", "DP ms");
        for (int n : new int[]{10, 15, 20, 25, 30}) {
            String s = "a".repeat(n);
            calls = 0;
            boolean r1 = naive(s, P, 0, 0);
            long c = calls;
            if (r1 != isMatch(s, P)) throw new RuntimeException("naive and DP disagree");
            double tn = time(() -> naive(s, P, 0, 0), n >= 25 ? 1 : 3);
            double td = time(() -> isMatch(s, P), 5);
            System.out.printf("  %4d | %,12d | %9.1f | %8d | %7.3f%n", n, c, tn, (n + 1) * (P.length() + 1), td);
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
