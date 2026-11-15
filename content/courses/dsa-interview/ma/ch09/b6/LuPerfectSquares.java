// LC 279 Perfect Squares — Coin Change in disguise: the "coins" are 1, 4, 9, 16, ... up to n.
public class LuPerfectSquares {
    // #region giai
    static int numSquares(int n) {
        int[] dp = new int[n + 1];
        java.util.Arrays.fill(dp, n + 1);           // NOT Integer.MAX_VALUE: dp[..] + 1 would overflow
        dp[0] = 0;
        for (int i = 1; i <= n; i++) {
            for (int s = 1; s * s <= i; s++) {
                dp[i] = Math.min(dp[i], dp[i - s * s] + 1);
            }
        }
        return dp[n];
    }
    // #endregion

    static int greedySquares(int n) {
        int k = 0;
        while (n > 0) { int s = (int) Math.sqrt(n); n -= s * s; k++; }
        return k;
    }

    public static void main(String[] args) {
        for (int n : new int[]{12, 13, 1, 43, 7, 10000}) System.out.println("numSquares(" + n + ") = " + numSquares(n) + "   greedy = " + greedySquares(n));
        int N = 10000;
        int[] dp = new int[N + 1];
        java.util.Arrays.fill(dp, N + 1); dp[0] = 0;
        for (int i = 1; i <= N; i++) for (int s = 1; s * s <= i; s++) dp[i] = Math.min(dp[i], dp[i - s * s] + 1);
        int bad = 0, four = 0, greedyWrong = 0;
        for (int n = 1; n <= N; n++) {
            int m = n; while (m % 4 == 0) m /= 4;
            boolean legendre = m % 8 == 7;
            if (dp[n] == 4) four++;
            if ((dp[n] == 4) != legendre || dp[n] > 4) bad++;
            if (greedySquares(n) != dp[n]) greedyWrong++;
        }
        System.out.println("n = 1.." + N + ": " + four + " numbers need 4 squares, " + bad + " disagree with Legendre, greedy wrong on " + greedyWrong);
    }
}
