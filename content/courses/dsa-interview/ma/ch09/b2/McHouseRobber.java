import java.util.*;

// LC 198 House Robber + LC 213 House Robber II (houses in a circle).
public class McHouseRobber {
    // #region rob
    // dp[i] = the most money you can take from houses 0..i (state).
    // At house i you either skip it (keep dp[i-1]) or rob it (nums[i] + dp[i-2]) (transition).
    static int rob(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        int[] dp = new int[n];
        dp[0] = nums[0];                                 // base: one house
        dp[1] = Math.max(nums[0], nums[1]);              // base: two houses, take the richer one
        for (int i = 2; i < n; i++) {                    // order: left to right
            dp[i] = Math.max(dp[i - 1], nums[i] + dp[i - 2]);
        }
        return dp[n - 1];
    }
    // #endregion

    // #region rob2bien
    static int robLine(int[] nums, int from, int to) {   // houses from..to inclusive
        int prev2 = 0, prev1 = 0;                        // best up to i-2, best up to i-1
        for (int i = from; i <= to; i++) {
            int cur = Math.max(prev1, nums[i] + prev2);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
    // #endregion

    // #region rob2
    static int robCircle(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];                      // one house: no neighbour at all
        return Math.max(robLine(nums, 0, n - 2), robLine(nums, 1, n - 1));
    }
    // #endregion

    public static void main(String[] args) {
        for (int[] a : new int[][]{{2, 7, 9, 3, 1}, {1, 2, 3, 1}, {5, 1, 1, 5}, {2, 1, 1, 2}, {4}, {3, 10}}) {
            System.out.println("rob(" + Arrays.toString(a) + ") = " + rob(a) + "   robLine = " + robLine(a, 0, a.length - 1));
        }
        for (int[] a : new int[][]{{2, 3, 2}, {1, 2, 3, 1}, {1, 2, 3}, {5, 1, 1, 5}, {4}, {200, 3, 140, 20, 10}}) {
            System.out.println("robCircle(" + Arrays.toString(a) + ") = " + robCircle(a));
        }
    }
}
