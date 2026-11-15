import java.util.*;

// LC 303 · Range Sum Query - Immutable — prefix array, O(n) build, O(1) per query.
public class PrefixRangeSum {
    // #region lop
    static class NumArray {
        private final int[] pre; // pre[i] = nums[0] + ... + nums[i-1]; pre[0] = 0

        NumArray(int[] nums) {
            pre = new int[nums.length + 1];
            for (int i = 0; i < nums.length; i++) pre[i + 1] = pre[i] + nums[i];
        }

        int sumRange(int left, int right) { // inclusive [left, right]
            return pre[right + 1] - pre[left];
        }
    }
    // #endregion

    public static void main(String[] args) {
        int[] nums = {-2, 0, 3, -5, 2, -1};
        NumArray na = new NumArray(nums);
        System.out.println("nums = " + Arrays.toString(nums));
        System.out.println("pre  = " + Arrays.toString(na.pre));
        int[][] qs = {{0, 2}, {2, 5}, {0, 5}, {3, 3}};
        for (int[] q : qs) {
            System.out.println("sumRange(" + q[0] + ", " + q[1] + ") = pre[" + (q[1] + 1) + "] - pre[" + q[0] + "] = " + na.sumRange(q[0], q[1]));
        }
    }
}
