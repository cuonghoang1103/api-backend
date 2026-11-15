import java.util.*;

// LC 643 · Maximum Average Subarray I — fixed window of size k.
public class MaxAverage {
    // #region brute
    static double findMaxAverageBrute(int[] nums, int k) {
        long best = Long.MIN_VALUE;
        for (int i = 0; i + k <= nums.length; i++) {
            long sum = 0;
            for (int j = i; j < i + k; j++) sum += nums[j];
            best = Math.max(best, sum);
        }
        return (double) best / k;
    }
    // #endregion

    // #region window
    static double findMaxAverage(int[] nums, int k) {
        long sum = 0;
        for (int i = 0; i < k; i++) sum += nums[i];
        long best = sum;
        for (int r = k; r < nums.length; r++) {
            sum += nums[r] - nums[r - k];
            best = Math.max(best, sum);
        }
        return (double) best / k;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] arrays = {{1, 12, -5, -6, 50, 3}, {5}, {0, 4, 0, 3, 2}, {-1, -2, -3}};
        int[] ks = {4, 1, 1, 2};
        for (int t = 0; t < arrays.length; t++)
            System.out.println("findMaxAverage(" + Arrays.toString(arrays[t]) + ", " + ks[t] + ") = "
                + String.format(Locale.ROOT, "%.5f", findMaxAverage(arrays[t], ks[t])) + "   brute = "
                + String.format(Locale.ROOT, "%.5f", findMaxAverageBrute(arrays[t], ks[t])));
    }
}
