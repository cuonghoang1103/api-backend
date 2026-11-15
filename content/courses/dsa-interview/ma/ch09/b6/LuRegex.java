import java.util.regex.Pattern;

// LC 10 Regular Expression Matching ('.' = any one char, 'x*' = zero or more x) — O(n·m) table, never exponential.
public class LuRegex {
    // #region giai
    static boolean isMatch(String s, String p) {
        int n = s.length(), m = p.length();
        boolean[][] dp = new boolean[n + 1][m + 1];
        dp[0][0] = true;
        for (int j = 2; j <= m; j++) if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 2];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                char c = p.charAt(j - 1);
                if (c == '*') {
                    char x = p.charAt(j - 2);
                    dp[i][j] = dp[i][j - 2] || ((x == '.' || x == s.charAt(i - 1)) && dp[i - 1][j]);
                } else {
                    dp[i][j] = (c == '.' || c == s.charAt(i - 1)) && dp[i - 1][j - 1];
                }
            }
        }
        return dp[n][m];
    }
    // #endregion

    static long seed = 20261115;
    static int rnd(int m) { seed = (seed * 48271) % 2147483647L; return (int) (seed % m); }

    public static void main(String[] args) {
        String[][] cases = {{"abbb", "ab*"}, {"ac", "a.c"}, {"", "x*y*"}, {"xyz", ".*z"}, {"aaa", "a*a"}, {"ab", ".*c"}, {"caab", "c*a*b"}};
        for (String[] c : cases) System.out.println("isMatch(\"" + c[0] + "\", \"" + c[1] + "\") = " + isMatch(c[0], c[1]));
        int bad = 0, yes = 0;
        for (int t = 0; t < 3000; t++) {
            StringBuilder sb = new StringBuilder();
            int ls = rnd(7);
            for (int i = 0; i < ls; i++) sb.append("ab".charAt(rnd(2)));
            String s = sb.toString();
            StringBuilder pb = new StringBuilder();
            int k = rnd(5);
            for (int q = 0; q < k; q++) { pb.append("ab.".charAt(rnd(3))); if (rnd(2) == 1) pb.append('*'); }
            String p = pb.toString();
            boolean mine = isMatch(s, p);
            if (mine) yes++;
            if (mine != Pattern.matches(p, s)) bad++;
        }
        System.out.println("random self-test vs the built-in regex engine: 3000 cases (" + yes + " match), " + bad + " mismatches");
    }
}
