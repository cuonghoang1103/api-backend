// Off-by-one in a 2D DP, Java edition: the same slip fails LOUDLY instead of silently.
public class HcLechMot {
    // #region sai
    static int lcsOffByOne(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 1; i <= a.length(); i++)
            for (int j = 1; j <= b.length(); j++)
                dp[i][j] = a.charAt(i) == b.charAt(j) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
        return dp[a.length()][b.length()];
    }
    // #endregion
    public static void main(String[] args) {
        try { System.out.println(lcsOffByOne("abcde", "ace")); }
        catch (StringIndexOutOfBoundsException e) { System.out.println("StringIndexOutOfBoundsException: " + e.getMessage()); }
    }
}
