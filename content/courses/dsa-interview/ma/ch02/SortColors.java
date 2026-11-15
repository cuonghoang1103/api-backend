import java.util.*;

// LC 75 · Sort Colors — Dutch national flag partition.
public class SortColors {
    // #region giai
    static void sortColors(int[] nums) {
        int lo = 0, mid = 0, hi = nums.length - 1;
        while (mid <= hi) {
            if (nums[mid] == 0) { int t = nums[lo]; nums[lo] = nums[mid]; nums[mid] = t; lo++; mid++; }
            else if (nums[mid] == 1) mid++;
            else { int t = nums[mid]; nums[mid] = nums[hi]; nums[hi] = t; hi--; }
        }
    }
    // #endregion

    public static void main(String[] args) {
        int[][] tests = {{2, 0, 2, 1, 1, 0}, {2, 0, 1}, {0}, {2, 2, 0, 0}, {1, 2, 0, 2, 1, 0, 1}};
        for (int[] a : tests) {
            int[] b = a.clone();
            sortColors(b);
            System.out.println("sortColors(" + Arrays.toString(a) + ") -> " + Arrays.toString(b));
        }
    }
}
