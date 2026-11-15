import java.util.*;
import java.util.function.IntPredicate;

// Duplicates break the F...F T...T row of a rotated array. Fix = trim, then the same template. Worst case O(n).
public class XoayTrung {
    static int steps = 0;
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {
            steps++;
            int mid = lo + (hi - lo) / 2;
            if (ok.test(mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
    static String row(int[] nums, int last) {
        StringBuilder b = new StringBuilder();
        for (int v : nums) b.append(v <= last ? 'T' : 'F');
        return b.toString();
    }

    // #region lc154
    static int minIndexDup(int[] nums) {                 // LC 154 (and the first half of LC 81)
        int hi = nums.length;
        while (hi > 1 && nums[hi - 1] == nums[0]) { hi--; steps++; }   // the O(n) part
        int last = nums[hi - 1];
        return firstTrue(0, hi, i -> nums[i] <= last);
    }
    // #endregion

    // #region lc81
    static boolean searchDup(int[] nums, int target) {   // LC 81
        int end = nums.length;
        while (end > 1 && nums[end - 1] == nums[0]) end--;
        int p = minIndexDup(Arrays.copyOf(nums, end));
        int lo = target <= nums[end - 1] ? p : 0, hi = target <= nums[end - 1] ? end : p;
        int i = firstTrue(lo, hi, k -> nums[k] >= target);
        return i < hi && nums[i] == target;
    }
    // #endregion

    static long seed = 5;
    static int rnd(int k) { seed = (seed * 48271) % 2147483647L; return (int) (seed % k); }

    public static void main(String[] args) {
        int[] bad = {1, 1, 1, 0, 1, 1};
        int naive = firstTrue(0, bad.length, i -> bad[i] <= bad[bad.length - 1]);
        System.out.println("nums = " + Arrays.toString(bad) + "  row \"<= last\" = " + row(bad, bad[bad.length - 1])
            + "  naive template -> index " + naive + ", value " + bad[naive] + " (WRONG, min is 0)");
        System.out.println("trimmed: minIndexDup = " + minIndexDup(bad) + ", value " + bad[minIndexDup(bad)]);
        for (int[] b : new int[][]{{2, 2, 2, 0, 1, 2}, {3, 3, 3}, {1, 1, 2, 3, 1}, {2, 5, 6, 0, 0, 1, 2}}) {
            System.out.println("nums = " + Arrays.toString(b) + "  min = " + b[minIndexDup(b)] + "  search(0) = " + searchDup(b, 0) + "  search(3) = " + searchDup(b, 3));
        }
        for (int n : new int[]{1_000, 100_000}) {
            int zeroAt = 1;
            int[] arr = new int[n];
            for (int i = 0; i < n; i++) arr[i] = i == zeroAt ? 0 : 1;
            steps = 0; int m = minIndexDup(arr);
            int s1 = steps;
            int[] distinct = new int[n];
            for (int i = 0; i < n; i++) distinct[i] = (i + 3) % n;
            steps = 0; minIndexDup(distinct);
            System.out.println("n=" + n + ": ones + one 0 -> min at " + m + ", " + s1 + " steps | distinct rotated -> " + steps + " steps");
        }
        int cases = 0, wrong = 0;
        for (int t = 0; t < 2000; t++) {
            int n = 1 + rnd(8);
            int[] sorted = new int[n];
            for (int i = 0; i < n; i++) sorted[i] = rnd(4);
            Arrays.sort(sorted);
            int r = rnd(n);
            int[] arr = new int[n];
            for (int i = 0; i < n; i++) arr[i] = sorted[(i + r) % n];
            if (arr[minIndexDup(arr)] != sorted[0]) wrong++;
            for (int x = -1; x <= 4; x++) {
                cases++;
                boolean has = false;
                for (int v : arr) if (v == x) has = true;
                if (searchDup(arr, x) != has) wrong++;
            }
        }
        System.out.println("self-test with duplicates: " + cases + " searches + 2000 mins, " + wrong + " mismatches");
    }
}
