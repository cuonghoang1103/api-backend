import java.util.*;

// Stress test: let the computer hunt for a counterexample to a greedy idea.
public class TlStress {
    static long seed = 20261115;
    static int rnd(int m) { seed = (seed * 48271) % 2147483647L; return (int) (seed % m); }

    static int greedyCoins(int[] coins, int amount) {
        int count = 0;
        for (int k = coins.length - 1; k >= 0; k--) { count += amount / coins[k]; amount %= coins[k]; }
        return count;
    }
    static int dpCoins(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++) for (int c : coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
        return dp[amount];
    }

    public static void main(String[] args) {
        // #region stress
        int trials = 0, failed = 0;
        String first = null;
        for (int t = 0; t < 500; t++) {
            int a = 2 + rnd(9), b = a + 1 + rnd(10);
            int[] coins = {1, a, b};
            trials++;
            for (int amount = 1; amount <= 2 * b; amount++) {
                int g = greedyCoins(coins, amount), d = dpCoins(coins, amount);
                if (g != d) {
                    failed++;
                    if (first == null) first = "trial " + trials + ": coins " + Arrays.toString(coins) + ", amount " + amount + ": greedy " + g + ", DP " + d;
                    break;
                }
            }
        }
        System.out.println("first counterexample -> " + first);
        System.out.println(trials + " random systems {1,a,b}: greedy fails on " + failed + ", correct on " + (trials - failed));
        // #endregion
    }
}
