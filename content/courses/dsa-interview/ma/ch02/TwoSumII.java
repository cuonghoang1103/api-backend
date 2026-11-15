import java.util.*;

// LC 167 · Two Sum II - Input Array Is Sorted — brute O(n^2), binary search O(n log n), two pointers O(n).
public class TwoSumII {
    // #region brute
    static int[] twoSumBrute(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++)
            for (int j = i + 1; j < nums.length; j++)
                if (nums[i] + nums[j] == target) return new int[]{i + 1, j + 1};
        return new int[0];
    }
    // #endregion

    // #region binary
    static int[] twoSumBinary(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            int lo = i + 1, hi = nums.length - 1;
            while (lo <= hi) {
                int mid = (lo + hi) >>> 1;
                if (nums[mid] == need) return new int[]{i + 1, mid + 1};
                if (nums[mid] < need) lo = mid + 1; else hi = mid - 1;
            }
        }
        return new int[0];
    }
    // #endregion

    // #region two
    static int[] twoSum(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l < r) {
            int sum = nums[l] + nums[r];
            if (sum == target) return new int[]{l + 1, r + 1};
            if (sum < target) l++;
            else r--;
        }
        return new int[0];
    }
    // #endregion

    public static void main(String[] args) {
        int[][] arrays = {{2, 7, 11, 15}, {2, 3, 4}, {-1, 0}, {1, 3, 4, 6, 8, 11}, {1, 2, 3}};
        int[] targets = {9, 6, -1, 10, 100};
        for (int k = 0; k < arrays.length; k++) {
            int[] a = arrays[k];
            int t = targets[k];
            System.out.println("twoSum(" + Arrays.toString(a) + ", " + t + ") = " + Arrays.toString(twoSum(a, t))
                + "   binary = " + Arrays.toString(twoSumBinary(a, t)) + "   brute = " + Arrays.toString(twoSumBrute(a, t)));
        }
    }
}
