import java.util.*;

// LC 560 · Subarray Sum Equals K — brute force O(n^2) vs prefix sum + HashMap O(n).
public class PrefixSubarrayK {
    // #region brute
    static int subarraySumBrute(int[] nums, int k) {
        int count = 0;
        for (int i = 0; i < nums.length; i++) {
            int sum = 0;
            for (int j = i; j < nums.length; j++) {
                sum += nums[j];
                if (sum == k) count++;
            }
        }
        return count;
    }
    // #endregion

    // #region map
    static int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> seen = new HashMap<>();
        seen.put(0, 1);                                   // the empty prefix
        int sum = 0, count = 0;
        for (int x : nums) {
            sum += x;
            count += seen.getOrDefault(sum - k, 0);
            seen.merge(sum, 1, Integer::sum);             // +1, creating the key if absent
        }
        return count;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] arrays = {{1, 2, -1, 3, -2, 2}, {1, 1, 1}, {1, 2, 3}, {0, 0, 0}, {5}};
        int[] ks = {3, 2, 3, 0, 7};
        for (int t = 0; t < arrays.length; t++) {
            System.out.println("subarraySum(" + Arrays.toString(arrays[t]) + ", " + ks[t] + ") = "
                + subarraySum(arrays[t], ks[t]) + "   brute = " + subarraySumBrute(arrays[t], ks[t]));
        }
    }
}
