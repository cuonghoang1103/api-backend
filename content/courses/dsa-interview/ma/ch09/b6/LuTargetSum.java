import java.util.*;

// LC 494 Target Sum — algebra turns "+/- signs" into "count subsets with sum P", a 0/1 knapsack that COUNTS.
public class LuTargetSum {
    // #region giai
    static int findTargetSumWays(int[] nums, int target) {
        int S = 0;
        for (int x : nums) S += x;
        if (Math.abs(target) > S || (S + target) % 2 != 0) return 0;   // Java: -1 % 2 == -1, but S + target >= 0 here
        int P = (S + target) / 2;
        int[] dp = new int[P + 1];
        dp[0] = 1;
        for (int x : nums) {
            for (int j = P; j >= x; j--) dp[j] += dp[j - x];         // DOWN: each item at most once
        }
        return dp[P];
    }
    // #endregion

    static int waysAscending(int[] nums, int target) {
        int S = 0;
        for (int x : nums) S += x;
        if (Math.abs(target) > S || (S + target) % 2 != 0) return 0;
        int P = (S + target) / 2;
        int[] dp = new int[P + 1]; dp[0] = 1;
        for (int x : nums) for (int j = x; j <= P; j++) dp[j] += dp[j - x];
        return dp[P];
    }

    static int brute(int[] nums, int target) {
        int c = 0;
        for (int mask = 0; mask < 1 << nums.length; mask++) {
            int s = 0;
            for (int i = 0; i < nums.length; i++) s += (mask & (1 << i)) != 0 ? nums[i] : -nums[i];
            if (s == target) c++;
        }
        return c;
    }

    static long seed = 20261115;
    static int rnd(int m) { seed = (seed * 48271) % 2147483647L; return (int) (seed % m); }

    public static void main(String[] args) {
        int[][] arrs = {{1, 1, 1, 1, 1}, {2, 1, 3}, {0, 0, 1}, {1, 2}, {1, 2}, {7}};
        int[] ts = {3, 0, 1, 4, 2, -7};
        for (int k = 0; k < arrs.length; k++) {
            int[] a = arrs[k]; int t = ts[k];
            System.out.println(Arrays.toString(a) + " target " + t + ": dp = " + findTargetSumWays(a, t) + "   brute = " + brute(a, t) + "   ascending-j bug = " + waysAscending(a, t));
        }
        int bad = 0;
        for (int k = 0; k < 2000; k++) {
            int n = 1 + rnd(10);
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = rnd(6);
            int t = rnd(13) - 6;
            if (findTargetSumWays(a, t) != brute(a, t)) bad++;
        }
        System.out.println("random self-test vs 2^n brute force: 2000 cases, " + bad + " mismatches");
    }
}
