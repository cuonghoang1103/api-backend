// LC 1143 Longest Common Subsequence: table, reconstruction, two rows.
public class HcLcs {
    // #region bang
    static int longestCommonSubsequence(String a, String b) {
        int n = a.length(), m = b.length();
        int[][] dp = new int[n + 1][m + 1];          // row 0 / column 0 = empty prefix = 0 (Java zero-fills)
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= m; j++)
                dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)
                    ? dp[i - 1][j - 1] + 1
                    : Math.max(dp[i - 1][j], dp[i][j - 1]);
        return dp[n][m];
    }
    // #endregion

    // #region truy-vet
    static String lcsString(String a, String b) {
        int n = a.length(), m = b.length();
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= m; j++)
                dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
        StringBuilder sb = new StringBuilder();
        int i = n, j = m;
        while (i > 0 && j > 0) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) { sb.append(a.charAt(i - 1)); i--; j--; }
            else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
            else j--;
        }
        return sb.reverse().toString();
    }
    // #endregion

    // #region hai-hang
    static int lcsTwoRows(String a, String b) {
        int[] prev = new int[b.length() + 1], cur = new int[b.length() + 1];
        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++)
                cur[j] = a.charAt(i - 1) == b.charAt(j - 1) ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
            int[] t = prev; prev = cur; cur = t;
        }
        return prev[b.length()];
    }
    // #endregion

    public static void main(String[] args) {
        String[][] cases = {{"ABCBDA", "BDCABA"}, {"abcde", "ace"}, {"abc", "def"}, {"", "abc"}, {"dynamic", "dynamo"}};
        for (String[] c : cases)
            System.out.println("lcs(\"" + c[0] + "\", \"" + c[1] + "\") = " + longestCommonSubsequence(c[0], c[1])
                + "  one answer = \"" + lcsString(c[0], c[1]) + "\"  two-rows = " + lcsTwoRows(c[0], c[1]));
    }
}
