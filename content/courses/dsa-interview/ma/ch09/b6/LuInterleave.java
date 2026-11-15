// LC 97 Interleaving String — dp[i][j]: can the first i chars of s1 and first j chars of s2 build the first i+j chars of s3?
public class LuInterleave {
    // #region giai
    static boolean isInterleave(String s1, String s2, String s3) {
        int n = s1.length(), m = s2.length();
        if (n + m != s3.length()) return false;
        boolean[][] dp = new boolean[n + 1][m + 1];
        dp[0][0] = true;
        for (int i = 0; i <= n; i++) {
            for (int j = 0; j <= m; j++) {
                int k = i + j - 1;
                if (i > 0 && dp[i - 1][j] && s1.charAt(i - 1) == s3.charAt(k)) dp[i][j] = true;
                if (j > 0 && dp[i][j - 1] && s2.charAt(j - 1) == s3.charAt(k)) dp[i][j] = true;
            }
        }
        return dp[n][m];
    }
    // #endregion

    static boolean brute(String s1, String s2, String s3) {
        if (s1.isEmpty() && s2.isEmpty()) return s3.isEmpty();
        if (!s1.isEmpty() && s1.charAt(0) == s3.charAt(0) && brute(s1.substring(1), s2, s3.substring(1))) return true;
        return !s2.isEmpty() && s2.charAt(0) == s3.charAt(0) && brute(s1, s2.substring(1), s3.substring(1));
    }

    static long seed = 20261115;
    static int rnd(int m) { seed = (seed * 48271) % 2147483647L; return (int) (seed % m); }
    static String word(int n) { StringBuilder sb = new StringBuilder(); for (int i = 0; i < n; i++) sb.append("ab".charAt(rnd(2))); return sb.toString(); }

    public static void main(String[] args) {
        String[][] cases = {{"ab", "cd", "acbd"}, {"ab", "cd", "adbc"}, {"aab", "ab", "abaab"}, {"", "xy", "xy"}, {"a", "b", "abc"}};
        for (String[] c : cases) System.out.println("isInterleave(\"" + c[0] + "\", \"" + c[1] + "\", \"" + c[2] + "\") = " + isInterleave(c[0], c[1], c[2]));
        int bad = 0, yes = 0;
        for (int t = 0; t < 3000; t++) {
            String a = word(rnd(5)), b = word(rnd(5)), c = word(a.length() + b.length());
            boolean r = isInterleave(a, b, c);
            if (r) yes++;
            if (r != brute(a, b, c)) bad++;
        }
        System.out.println("random self-test vs brute force: 3000 cases (" + yes + " true), " + bad + " mismatches");
    }
}
