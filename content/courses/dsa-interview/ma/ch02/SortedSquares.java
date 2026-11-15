import java.util.*;

// LC 977 · Squares of a Sorted Array — two pointers from the ends, fill from the back.
public class SortedSquares {
    // #region giai
    static int[] sortedSquares(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        int l = 0, r = n - 1;
        for (int w = n - 1; w >= 0; w--) {
            if (Math.abs(nums[l]) > Math.abs(nums[r])) { res[w] = nums[l] * nums[l]; l++; }
            else { res[w] = nums[r] * nums[r]; r--; }
        }
        return res;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] tests = {{-4, -1, 0, 3, 10}, {-7, -3, 2, 3, 11}, {-5, -3, -2}, {1, 2, 3}, {0}};
        for (int[] a : tests) System.out.println("sortedSquares(" + Arrays.toString(a) + ") = " + Arrays.toString(sortedSquares(a)));
    }
}
