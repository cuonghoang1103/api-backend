import java.util.*;

// LC 287 · Find the Duplicate Number — Floyd on i -> nums[i]; O(n) time, O(1) memory, array untouched.
public class FindDuplicate {
    // #region floyd
    static int findDuplicate(int[] nums) {
        int slow = nums[0], fast = nums[0];
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        int p = nums[0];
        while (p != slow) {
            p = nums[p];
            slow = nums[slow];
        }
        return p;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] tests = {{1, 3, 4, 2, 2}, {3, 1, 3, 4, 2}, {3, 3, 3, 3, 3}, {2, 5, 9, 6, 9, 3, 8, 9, 7, 1}};
        for (int[] a : tests) System.out.println("findDuplicate(" + Arrays.toString(a) + ") = " + findDuplicate(a));
    }
}
