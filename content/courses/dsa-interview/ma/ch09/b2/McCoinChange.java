import java.util.*;

// LC 322 Coin Change: the fewest coins that add up to amount (or -1).
public class McCoinChange {
    // #region coin
    static int coinChange(int[] coins, int amount) {
        int INF = amount + 1;                        // more coins than any real answer can use
        int[] dp = new int[amount + 1];              // dp[a] = fewest coins that make a
        Arrays.fill(dp, INF);
        dp[0] = 0;                                   // base: 0 coins make amount 0
        for (int a = 1; a <= amount; a++) {          // order: small amounts first
            for (int c : coins) {
                if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;   // last coin = c
            }
        }
        return dp[amount] == INF ? -1 : dp[amount];
    }
    // #endregion

    public static void main(String[] args) {
        int[][] coinsList = {{1, 2, 5}, {2}, {1}, {1, 3, 4}, {2, 5, 10, 1}, {186, 419, 83, 408}, {7}, {5, 10}};
        int[] amounts = {11, 3, 0, 6, 27, 6249, 28, 3};
        for (int k = 0; k < amounts.length; k++) {
            System.out.println("coinChange(" + Arrays.toString(coinsList[k]) + ", " + amounts[k] + ") = " + coinChange(coinsList[k], amounts[k]));
        }
    }
}
