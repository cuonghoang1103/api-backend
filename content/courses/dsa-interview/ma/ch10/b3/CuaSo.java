import java.util.*;

// Max sum of k consecutive elements (1 <= k <= n): buggy / fixed / brute force, same cases as cua-so.ts.
public class CuaSo {
    // #region loi
    static int maxWindowBuggy(int[] nums, int k) {
        int sum = 0;
        for (int i = 0; i < k; i++) sum += nums[i];
        int best = sum;
        for (int s = 1; s < nums.length - k; s++) {   // BUG: must be s <= nums.length - k
            sum += nums[s + k - 1] - nums[s - 1];
            best = Math.max(best, sum);
        }
        return best;
    }
    // #endregion

    // #region dung
    static int maxWindow(int[] nums, int k) {
        int sum = 0;
        for (int i = 0; i < k; i++) sum += nums[i];
        int best = sum;                               // not 0: every window may be negative
        for (int s = 1; s <= nums.length - k; s++) {  // starts 1 .. n - k, inclusive
            sum += nums[s + k - 1] - nums[s - 1];
            best = Math.max(best, sum);
        }
        return best;
    }
    // #endregion

    // #region brute
    static int maxWindowBrute(int[] nums, int k) {
        int best = Integer.MIN_VALUE;
        for (int s = 0; s + k <= nums.length; s++) {
            int sum = 0;
            for (int i = s; i < s + k; i++) sum += nums[i];
            best = Math.max(best, sum);
        }
        return best;
    }
    // #endregion

    public static void main(String[] args) {
        Object[][] cases = {
            {"normal example", new int[]{2, 1, 5, 1, 3, 2}, 3},
            {"best window is the LAST one", new int[]{1, 2, 3}, 2},
            {"one element", new int[]{7}, 1},
            {"k = n (one window)", new int[]{4, -1, 2}, 3},
            {"all negative", new int[]{-3, -1, -2}, 2},
            {"all equal", new int[]{5, 5, 5, 5}, 2},
        };
        for (Object[] c : cases) {
            int[] nums = (int[]) c[1];
            int k = (Integer) c[2];
            int b = maxWindowBuggy(nums, k), f = maxWindow(nums, k), r = maxWindowBrute(nums, k);
            String verdict = b == r ? "ok" : "BUGGY WRONG";
            System.out.println(c[0] + ": " + Arrays.toString(nums) + " k=" + k + " -> buggy " + b
                + " | fixed " + f + " | brute " + r + " | " + verdict);
        }
    }
}
