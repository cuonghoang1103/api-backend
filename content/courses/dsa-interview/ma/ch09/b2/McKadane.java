import java.util.*;

// LC 53 Maximum Subarray (Kadane as DP).
public class McKadane {
    // #region kadane
    static int maxSubArray(int[] nums) {
        int endHere = nums[0];                       // best sum of a subarray ending exactly at i
        int best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            endHere = Math.max(nums[i], endHere + nums[i]);   // start fresh, or extend
            best = Math.max(best, endHere);
        }
        return best;
    }
    // #endregion

    static int maxSubArrayWrong(int[] nums) {
        int endHere = 0, best = 0;
        for (int x : nums) { endHere = Math.max(0, endHere + x); best = Math.max(best, endHere); }
        return best;
    }

    public static void main(String[] args) {
        int[][] tests = {{-2, 1, -3, 4, -1, 2, 1, -5, 4}, {1}, {5, 4, -1, 7, 8}, {-3, -1, -2}, {-5}};
        for (int[] a : tests) {
            System.out.println("maxSubArray(" + Arrays.toString(a) + ") = " + maxSubArray(a) + "   (wrong version: " + maxSubArrayWrong(a) + ")");
        }
    }
}
