import java.util.*;

// Trap: initialise the Coin Change table with Integer.MAX_VALUE, then compute dp[a - c] + 1.
public class McCoinTran {
    // #region sai
    static int coinChangeWrong(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);          // "infinity"... for an int, it is not
        dp[0] = 0;
        for (int a = 1; a <= amount; a++)
            for (int c : coins)
                if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);   // MAX_VALUE + 1 wraps to MIN_VALUE
        return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
    }
    // #endregion

    // #region dung
    static int coinChangeRight(int[] coins, int amount) {
        int INF = amount + 1;                        // a sentinel that +1 cannot overflow
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, INF);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++)
            for (int c : coins)
                if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
        return dp[amount] >= INF ? -1 : dp[amount];
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("Integer.MAX_VALUE + 1 = " + (Integer.MAX_VALUE + 1));
        int[][] coinsList = {{2}, {5, 10}, {1, 2, 5}, {3, 7}};
        int[] amounts = {3, 3, 11, 5};
        for (int k = 0; k < amounts.length; k++) {
            System.out.println("coins=" + Arrays.toString(coinsList[k]) + " amount=" + amounts[k]
                + "   wrong=" + coinChangeWrong(coinsList[k], amounts[k]) + "   right=" + coinChangeRight(coinsList[k], amounts[k]));
        }
    }
}
