import java.util.*;

// 0/1 knapsack (table, then one row with j going DOWN) + LC 416 Partition Equal Subset Sum + the "j going up" bug.
public class HcKnapsack {
    // #region bang
    static int knapsack(int[] w, int[] v, int W) {
        int n = w.length;
        int[][] dp = new int[n + 1][W + 1];   // dp[i][c] = best value with the first i items, capacity c
        for (int i = 1; i <= n; i++)
            for (int c = 0; c <= W; c++) {
                dp[i][c] = dp[i - 1][c];                                      // skip
                if (w[i - 1] <= c) dp[i][c] = Math.max(dp[i][c], dp[i - 1][c - w[i - 1]] + v[i - 1]); // take
            }
        return dp[n][W];
    }
    // #endregion

    // #region mot-hang
    static int knapsack1D(int[] w, int[] v, int W) {
        int[] dp = new int[W + 1];
        for (int k = 0; k < w.length; k++)
            for (int c = W; c >= w[k]; c--)          // DOWN
                dp[c] = Math.max(dp[c], dp[c - w[k]] + v[k]);
        return dp[W];
    }
    // #endregion

    // #region sai
    static int knapsack1DWrong(int[] w, int[] v, int W) {
        int[] dp = new int[W + 1];
        for (int k = 0; k < w.length; k++)
            for (int c = w[k]; c <= W; c++)          // UP: item k can be reused
                dp[c] = Math.max(dp[c], dp[c - w[k]] + v[k]);
        return dp[W];
    }
    // #endregion

    // #region lc416
    static boolean canPartition(int[] nums) {
        int sum = 0;
        for (int x : nums) sum += x;
        if (sum % 2 == 1) return false;
        int target = sum / 2;
        boolean[] can = new boolean[target + 1];
        can[0] = true;
        for (int x : nums)
            for (int s = target; s >= x; s--)
                if (can[s - x]) can[s] = true;
        return can[target];
    }
    static boolean canPartitionWrong(int[] nums) {
        int sum = 0;
        for (int x : nums) sum += x;
        if (sum % 2 == 1) return false;
        int target = sum / 2;
        boolean[] can = new boolean[target + 1];
        can[0] = true;
        for (int x : nums) for (int s = x; s <= target; s++) if (can[s - x]) can[s] = true;
        return can[target];
    }
    // #endregion

    // #region ty-le
    static int greedyByRatio(int[] w, int[] v, int W) {
        Integer[] order = new Integer[w.length];
        for (int k = 0; k < w.length; k++) order[k] = k;
        Arrays.sort(order, (x, y) -> Double.compare((double) v[y] / w[y], (double) v[x] / w[x]));
        int cap = W, got = 0;
        for (int k : order) if (w[k] <= cap) { cap -= w[k]; got += v[k]; }
        return got;
    }
    // #endregion

    public static void main(String[] args) {
        int[] w = {1, 3, 4, 5}, v = {1, 4, 5, 7};
        System.out.println("items w = " + Arrays.toString(w) + ", v = " + Arrays.toString(v) + ", W = 7");
        System.out.println("table = " + knapsack(w, v, 7) + "   one row (down) = " + knapsack1D(w, v, 7) + "   one row (UP, wrong) = " + knapsack1DWrong(w, v, 7));
        System.out.println("greedy by value/weight = " + greedyByRatio(w, v, 7));
        System.out.println("single item w = [3], v = [4], W = 7:  correct = " + knapsack1D(new int[]{3}, new int[]{4}, 7) + "   UP = " + knapsack1DWrong(new int[]{3}, new int[]{4}, 7));
        int[][] tests = {{1, 5, 11, 5}, {1, 2, 3, 5}, {1, 2, 5}, {2, 2}, {100}};
        for (int[] t : tests)
            System.out.println("canPartition(" + Arrays.toString(t) + ") = " + canPartition(t) + "   UP version says " + canPartitionWrong(t));
    }
}
