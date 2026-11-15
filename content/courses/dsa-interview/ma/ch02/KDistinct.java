import java.util.*;

// "At most k distinct" windows: LC 904 and LC 992.
public class KDistinct {
    // #region atmost
    static int longestAtMostK(int[] nums, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        int l = 0, best = 0;
        for (int r = 0; r < nums.length; r++) {
            cnt.merge(nums[r], 1, Integer::sum);
            while (cnt.size() > k) {
                int x = nums[l++];
                if (cnt.merge(x, -1, Integer::sum) == 0) cnt.remove(x);
            }
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
    static int totalFruit(int[] fruits) { return longestAtMostK(fruits, 2); }
    // #endregion

    // #region exactly
    static int countAtMostK(int[] nums, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        int l = 0, total = 0;
        for (int r = 0; r < nums.length; r++) {
            cnt.merge(nums[r], 1, Integer::sum);
            while (cnt.size() > k) {
                int x = nums[l++];
                if (cnt.merge(x, -1, Integer::sum) == 0) cnt.remove(x);
            }
            total += r - l + 1;
        }
        return total;
    }
    static int subarraysWithKDistinct(int[] nums, int k) {
        return countAtMostK(nums, k) - countAtMostK(nums, k - 1);
    }
    // #endregion

    public static void main(String[] args) {
        int[][] fruits = {{1, 2, 1}, {0, 1, 2, 2}, {1, 2, 3, 2, 2}, {3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4}};
        for (int[] f : fruits) System.out.println("totalFruit(" + Arrays.toString(f) + ") = " + totalFruit(f));
        int[][] arrays = {{1, 2, 1, 2, 3}, {1, 2, 1, 3, 4}};
        int[] ks = {2, 3};
        for (int t = 0; t < arrays.length; t++) {
            int k = ks[t];
            System.out.println("subarraysWithKDistinct(" + Arrays.toString(arrays[t]) + ", " + k + ") = " + subarraysWithKDistinct(arrays[t], k)
                + "  (at most " + k + ": " + countAtMostK(arrays[t], k) + ", at most " + (k - 1) + ": " + countAtMostK(arrays[t], k - 1) + ")");
        }
    }
}
