import java.util.*;
import java.util.function.IntPredicate;

// LC 300 Longest Increasing Subsequence.
public class McLis {
    // #region n2
    static int lengthOfLISQuadratic(int[] nums) {
        int n = nums.length;
        int[] dp = new int[n];                       // dp[i] = longest increasing run ENDING at i
        Arrays.fill(dp, 1);
        int best = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++)
                if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
            best = Math.max(best, dp[i]);
        }
        return best;
    }
    // #endregion

    // #region khuon
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (ok.test(mid)) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
    // #endregion

    // #region nlogn
    static int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];          // tails[k] = smallest last value of a run of length k + 1
        int len = 0;
        for (int x : nums) {
            final int L = len;
            int k = firstTrue(0, L, i -> tails[i] >= x);   // lowerBound in tails[0..len)
            tails[k] = x;
            if (k == len) len++;                     // x extended the longest run
        }
        return len;
    }
    // #endregion

    static long seed = 20261115;
    static int rnd(int m) { seed = (seed * 48271) % 2147483647L; return (int) (seed % m); }

    public static void main(String[] args) {
        int[][] tests = {{10, 9, 2, 5, 3, 7, 101, 18}, {0, 1, 0, 3, 2, 3}, {7, 7, 7, 7}, {5}, {1, 2, 3, 4, 5}, {5, 4, 3, 2, 1}, {3, 5, 6, 2, 5, 4, 19, 5, 6, 7, 12}};
        for (int[] a : tests) {
            System.out.println("LIS(" + Arrays.toString(a) + ") = " + lengthOfLISQuadratic(a) + " (O(n²))  " + lengthOfLIS(a) + " (O(n log n))");
        }
        int bad = 0;
        for (int t = 0; t < 2000; t++) {
            int n = rnd(15);
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = rnd(10);
            if (lengthOfLIS(a) != lengthOfLISQuadratic(a)) bad++;
        }
        System.out.println("random self-test O(n log n) vs O(n²): 2000 cases, " + bad + " mismatches");
    }
}
