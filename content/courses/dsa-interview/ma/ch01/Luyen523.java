import java.util.*;

// LC 523 · Continuous Subarray Sum.
public class Luyen523 {
    // #region giai
    static boolean checkSubarraySum(int[] nums, int k) {
        Map<Integer, Integer> first = new HashMap<>();
        first.put(0, -1);                      // the empty prefix, before index 0
        int rem = 0;
        for (int i = 0; i < nums.length; i++) {
            rem = (rem + nums[i]) % k;         // stays < k: no int overflow even for long arrays
            Integer j = first.get(rem);
            if (j == null) first.put(rem, i);  // putIfAbsent would also work
            else if (i - j >= 2) return true;
        }
        return false;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] arrays = {{2, 5, 3, 0, 4}, {2, 4}, {5, 0, 0, 0}, {0}, {1, 0}, {7, 3, 1}};
        int[] ks = {6, 6, 3, 1, 2, 5};
        for (int t = 0; t < arrays.length; t++) {
            System.out.println("checkSubarraySum(" + Arrays.toString(arrays[t]) + ", " + ks[t] + ") = "
                + checkSubarraySum(arrays[t], ks[t]));
        }
    }
}
