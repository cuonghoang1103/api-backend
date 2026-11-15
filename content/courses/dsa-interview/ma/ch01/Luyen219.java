import java.util.*;

// LC 219 · Contains Duplicate II — HashMap value -> most recent index.
public class Luyen219 {
    // #region giai
    static boolean containsNearbyDuplicate(int[] nums, int k) {
        Map<Integer, Integer> last = new HashMap<>(); // value -> most recent index
        for (int i = 0; i < nums.length; i++) {
            Integer j = last.get(nums[i]);            // Integer: null = never seen
            if (j != null && i - j <= k) return true;
            last.put(nums[i], i);                     // overwrite with the newest index
        }
        return false;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] arrays = {{4, 9, 2, 4}, {4, 9, 2, 4}, {7, 1, 7, 7}, {1, 2, 1, 3, 1}, {5}, {6, 6}};
        int[] ks = {3, 2, 1, 1, 0, 0};
        for (int t = 0; t < arrays.length; t++) {
            System.out.println("containsNearbyDuplicate(" + Arrays.toString(arrays[t]) + ", " + ks[t] + ") = "
                + containsNearbyDuplicate(arrays[t], ks[t]));
        }
    }
}
