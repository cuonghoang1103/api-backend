// LC 516 Longest Palindromic Subsequence — interval DP by length, and the LCS(s, reverse(s)) shortcut.
public class LuLps {
    // #region giai
    static int longestPalindromeSubseq(String s) {
        int n = s.length();
        int[][] dp = new int[n][n];
        for (int i = n - 1; i >= 0; i--) {
            dp[i][i] = 1;
            for (int j = i + 1; j < n; j++) {
                dp[i][j] = s.charAt(i) == s.charAt(j)
                    ? dp[i + 1][j - 1] + 2
                    : Math.max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
        return dp[0][n - 1];
    }
    // #endregion

    static int lcs(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 1; i <= a.length(); i++)
            for (int j = 1; j <= b.length(); j++)
                dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
        return dp[a.length()][b.length()];
    }
    static int viaLcs(String s) { return lcs(s, new StringBuilder(s).reverse().toString()); }

    static int brute(String s) {
        int best = 0;
        for (int mask = 1; mask < 1 << s.length(); mask++) {
            StringBuilder t = new StringBuilder();
            for (int i = 0; i < s.length(); i++) if ((mask & (1 << i)) != 0) t.append(s.charAt(i));
            if (t.toString().equals(new StringBuilder(t).reverse().toString())) best = Math.max(best, t.length());
        }
        return best;
    }

    static long seed = 20261115;
    static int rnd(int m) { seed = (seed * 48271) % 2147483647L; return (int) (seed % m); }

    public static void main(String[] args) {
        for (String s : new String[]{"agbcba", "banana", "aabaa", "abcd", "a"})
            System.out.println("\"" + s + "\": interval DP = " + longestPalindromeSubseq(s) + "   LCS(s, reverse) = " + viaLcs(s));
        int bad = 0;
        for (int t = 0; t < 1500; t++) {
            int n = 1 + rnd(10);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < n; i++) sb.append("abc".charAt(rnd(3)));
            String s = sb.toString();
            int d = longestPalindromeSubseq(s);
            if (d != viaLcs(s) || d != brute(s)) bad++;
        }
        System.out.println("random self-test (interval DP = LCS trick = 2^n brute force): 1500 strings, " + bad + " mismatches");
    }
}
