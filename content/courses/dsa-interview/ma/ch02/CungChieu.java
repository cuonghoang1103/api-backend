import java.util.*;

// Same-direction pointers: a READ pointer scans everything, a WRITE pointer marks where the next kept element goes.
public class CungChieu {
    // #region dup
    static int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;
        int w = 1;
        for (int r = 1; r < nums.length; r++) {
            if (nums[r] != nums[w - 1]) nums[w++] = nums[r];
        }
        return w;
    }
    // #endregion

    // #region zero
    static void moveZeroes(int[] nums) {
        int w = 0;
        for (int r = 0; r < nums.length; r++) {
            if (nums[r] != 0) {
                int t = nums[w]; nums[w] = nums[r]; nums[r] = t;
                w++;
            }
        }
    }
    // #endregion

    // #region merge
    static void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1, j = n - 1, w = m + n - 1;
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) nums1[w--] = nums1[i--];
            else nums1[w--] = nums2[j--];
        }
    }
    // #endregion

    public static void main(String[] args) {
        int[] a = {0, 0, 1, 1, 1, 2, 2, 3, 3, 4};
        int k = removeDuplicates(a);
        System.out.println("removeDuplicates -> k = " + k + ", first k = " + Arrays.toString(Arrays.copyOf(a, k)));
        int[] z = {0, 1, 0, 3, 12};
        moveZeroes(z);
        System.out.println("moveZeroes -> " + Arrays.toString(z));
        int[] m1 = {1, 2, 3, 0, 0, 0};
        merge(m1, 3, new int[]{2, 5, 6}, 3);
        System.out.println("merge -> " + Arrays.toString(m1));
        int[] m2 = {4, 5, 6, 0, 0, 0};
        merge(m2, 3, new int[]{1, 2, 3}, 3);
        System.out.println("merge -> " + Arrays.toString(m2));
    }
}
