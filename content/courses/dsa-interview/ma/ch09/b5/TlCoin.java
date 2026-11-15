import java.util.*;

// Greedy change-making vs the exact DP answer. When is "take the biggest coin" right?
public class TlCoin {
    // #region greedy
    static int greedyCoins(int[] coins, int amount) {        // coins sorted ascending
        int count = 0;
        for (int k = coins.length - 1; k >= 0; k--) {
            count += amount / coins[k];                     // take as many of this coin as fit
            amount %= coins[k];
        }
        return amount == 0 ? count : -1;
    }
    // #endregion

    // #region dp
    static int[] dpTable(int[] coins, int amount) {
        int INF = amount + 1;                               // NOT Integer.MAX_VALUE: dp[a - c] + 1 would overflow
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, INF);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++)
            for (int c : coins) if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
        return dp;
    }
    // #endregion

    static List<Integer> mismatches(int[] coins, int N) {
        int[] dp = dpTable(coins, N);
        List<Integer> bad = new ArrayList<>();
        for (int a = 1; a <= N; a++) if (greedyCoins(coins, a) != dp[a]) bad.add(a);
        return bad;
    }

    public static void main(String[] args) {
        int[] odd = {1, 3, 4};
        System.out.println("coins " + Arrays.toString(odd) + ", amount 6: greedy = " + greedyCoins(odd, 6)
            + " coins (4+1+1), DP = " + dpTable(odd, 6)[6] + " coins (3+3)");
        int[] vnd = {1, 2, 5, 10, 20, 50, 100, 200, 500};
        int N = 10000;
        System.out.println("VND-like " + Arrays.toString(vnd) + ": amounts 1.." + N + " where greedy is worse = " + mismatches(vnd, N).size());
        List<Integer> b2 = mismatches(odd, N);
        System.out.println("[1,3,4]: amounts 1.." + N + " where greedy is worse = " + b2.size() + ", first ten = " + b2.subList(0, 10));
        System.out.println("US coins [1,5,10,25]: mismatches = " + mismatches(new int[]{1, 5, 10, 25}, N).size()
            + "; without the nickel [1,10,25]: first = " + mismatches(new int[]{1, 10, 25}, N).subList(0, 3));
    }
}
