import java.util.*;
import java.util.function.IntPredicate;

// LC 540 · Single Element in a Sorted Array — binary search over pair indices.
public class L5Single {
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (ok.test(mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
    // #region giai
    static int singleNonDuplicate(int[] nums) {
        int pairs = (nums.length - 1) / 2;
        int p = firstTrue(0, pairs, q -> nums[2 * q] != nums[2 * q + 1]);
        return nums[2 * p];
    }
    // #endregion
    public static void main(String[] args) {
        int[][] cases = {{2, 2, 5, 6, 6, 9, 9, 12, 12}, {4, 4, 8, 8, 13, 15, 15}, {5}, {1, 1, 2}, {0, 1, 1}, {1, 1, 2, 2, 3}};
        for (int[] a : cases) {
            StringBuilder row = new StringBuilder();
            for (int q = 0; q < (a.length - 1) / 2; q++) row.append(a[2 * q] != a[2 * q + 1] ? 'T' : 'F');
            System.out.println("nums = " + Arrays.toString(a) + "  pair row = " + (row.length() == 0 ? "(none)" : row) + "  single = " + singleNonDuplicate(a));
        }
    }
}
