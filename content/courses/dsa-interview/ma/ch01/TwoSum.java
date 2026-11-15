import java.util.*;

// LC 1 · Two Sum — brute force O(n^2) vs one-pass HashMap O(n).
public class TwoSum {
    // #region brute
    static int[] twoSumBrute(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) return new int[]{i, j};
            }
        }
        return new int[0];
    }
    // #endregion

    // #region hash
    static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>(); // value -> index
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            Integer j = seen.get(need);               // Integer, not int: null = absent
            if (j != null) return new int[]{j, i};
            seen.put(nums[i], i);
        }
        return new int[0];
    }
    // #endregion

    public static void main(String[] args) {
        int[][] arrays = {{2, 7, 11, 15}, {3, 2, 4}, {3, 3}, {1, 2, 3}};
        int[] targets = {9, 6, 6, 100};
        for (int k = 0; k < arrays.length; k++) {
            System.out.println("twoSum(" + Arrays.toString(arrays[k]) + ", " + targets[k] + ") = "
                + Arrays.toString(twoSum(arrays[k], targets[k])) + "   brute = "
                + Arrays.toString(twoSumBrute(arrays[k], targets[k])));
        }
    }
}
