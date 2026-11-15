import java.util.*;

// LC 16 · 3Sum Closest.
public class ThreeSumClosest {
    // #region giai
    static int threeSumClosest(int[] nums, int target) {
        int[] a = nums.clone();
        Arrays.sort(a);
        int best = a[0] + a[1] + a[2];
        for (int i = 0; i < a.length - 2; i++) {
            int l = i + 1, r = a.length - 1;
            while (l < r) {
                int s = a[i] + a[l] + a[r];
                if (Math.abs(s - target) < Math.abs(best - target)) best = s;
                if (s == target) return s;
                if (s < target) l++; else r--;
            }
        }
        return best;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] arrays = {{-1, 2, 1, -4}, {0, 0, 0}, {1, 1, 1, 0}, {4, 0, 5, -5, 3, 3, 0, -4, -5}};
        int[] ts = {1, 1, -100, -2};
        for (int k = 0; k < arrays.length; k++)
            System.out.println("threeSumClosest(" + Arrays.toString(arrays[k]) + ", " + ts[k] + ") = " + threeSumClosest(arrays[k], ts[k]));
    }
}
