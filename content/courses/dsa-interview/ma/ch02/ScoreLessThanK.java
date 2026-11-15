import java.util.*;

// LC 2302 · Count Subarrays With Score Less Than K — window + "count subarrays ending at r"; long everywhere.
public class ScoreLessThanK {
    // #region giai
    static long countSubarrays(int[] nums, long k) {
        int l = 0;
        long sum = 0, total = 0;
        for (int r = 0; r < nums.length; r++) {
            sum += nums[r];
            while (sum * (r - l + 1) >= k) {
                sum -= nums[l];
                l++;
            }
            total += r - l + 1;
        }
        return total;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] arrays = {{2, 1, 4, 3, 5}, {1, 1, 1}, {10}, {1, 2, 3, 4}};
        long[] ks = {10, 5, 5, 100};
        for (int t = 0; t < arrays.length; t++)
            System.out.println("countSubarrays(" + Arrays.toString(arrays[t]) + ", " + ks[t] + ") = " + countSubarrays(arrays[t], ks[t]));
    }
}
