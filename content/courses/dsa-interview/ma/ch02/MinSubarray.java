import java.util.*;

// LC 209 · Minimum Size Subarray Sum — shortest window, shrink while valid.
public class MinSubarray {
    // #region window
    static int minSubArrayLen(int target, int[] nums) {
        int l = 0, sum = 0, best = Integer.MAX_VALUE;
        for (int r = 0; r < nums.length; r++) {
            sum += nums[r];
            while (sum >= target) {
                best = Math.min(best, r - l + 1);
                sum -= nums[l];
                l++;
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
    // #endregion

    public static void main(String[] args) {
        int[] ts = {7, 4, 11, 15};
        int[][] arrays = {{2, 3, 1, 2, 4, 3}, {1, 4, 4}, {1, 1, 1, 1, 1, 1, 1, 1}, {1, 2, 3, 4, 5}};
        for (int k = 0; k < ts.length; k++)
            System.out.println("minSubArrayLen(" + ts[k] + ", " + Arrays.toString(arrays[k]) + ") = " + minSubArrayLen(ts[k], arrays[k]));
    }
}
