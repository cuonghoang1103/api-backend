import java.util.*;
import java.util.function.IntPredicate;

// ONE binary-search template for the whole chapter + lower/upper bound + LC 704, LC 35, LC 34.
public class LowerBound {
    // #region khuon
    // ok(i) must look like  F F ... F T T ... T  on the half-open range [lo, hi).
    // Invariant: every i < lo is F, every i >= hi is T. Returns the first T (hi if there is none).
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {                      // [lo, hi) is the part we do not know yet
            int mid = lo + (hi - lo) / 2;      // NOT (lo + hi) / 2: that can overflow int
            if (ok.test(mid)) hi = mid;        // mid is T: the first T is mid or left of it
            else lo = mid + 1;                 // mid is F: the first T is right of mid
        }
        return lo;                             // lo == hi: the boundary between F and T
    }
    // #endregion

    // #region bounds
    static int lowerBound(int[] a, int x) { return firstTrue(0, a.length, i -> a[i] >= x); }
    static int upperBound(int[] a, int x) { return firstTrue(0, a.length, i -> a[i] > x); }
    // #endregion

    // #region lc704
    static int search(int[] nums, int target) {                 // LC 704
        int i = lowerBound(nums, target);
        return i < nums.length && nums[i] == target ? i : -1;
    }
    // #endregion

    // #region lc35
    static int searchInsert(int[] nums, int target) {           // LC 35
        return lowerBound(nums, target);
    }
    // #endregion

    // #region lc34
    static int[] searchRange(int[] nums, int target) {          // LC 34
        int first = lowerBound(nums, target);
        if (first == nums.length || nums[first] != target) return new int[]{-1, -1};
        return new int[]{first, upperBound(nums, target) - 1};
    }
    // #endregion

    static long seed = 20261115;
    static int rnd(int m) { seed = (seed * 48271) % 2147483647L; return (int) (seed % m); }

    public static void main(String[] args) {
        int[] a = {1, 3, 3, 3, 5, 8, 8, 10};
        System.out.println("a = " + Arrays.toString(a));
        for (int x : new int[]{3, 4, 8, 0, 10, 11}) {
            int lb = lowerBound(a, x), ub = upperBound(a, x);
            System.out.println("x=" + x + "  lowerBound=" + lb + "  upperBound=" + ub + "  count=" + (ub - lb)
                + "  search=" + search(a, x) + "  searchRange=" + Arrays.toString(searchRange(a, x)));
        }
        int[] b = {1, 3, 5, 6};
        int[] r = new int[4]; int k = 0;
        for (int x : new int[]{5, 2, 7, 0}) r[k++] = searchInsert(b, x);
        System.out.println("searchInsert(" + Arrays.toString(b) + ", x) for x = 5, 2, 7, 0 -> " + Arrays.toString(r));
        System.out.println("searchRange([], 0) = " + Arrays.toString(searchRange(new int[0], 0))
            + "   search([5], 5) = " + search(new int[]{5}, 5) + "   search([5], -5) = " + search(new int[]{5}, -5));

        int tests = 0, bad = 0;
        for (int t = 0; t < 3000; t++) {
            int n = rnd(12);
            int[] arr = new int[n];
            for (int i = 0; i < n; i++) arr[i] = rnd(10) - 3;
            Arrays.sort(arr);
            int x = rnd(14) - 5;
            int slowLb = 0; while (slowLb < n && arr[slowLb] < x) slowLb++;
            int slowUb = 0; while (slowUb < n && arr[slowUb] <= x) slowUb++;
            tests++;
            if (lowerBound(arr, x) != slowLb || upperBound(arr, x) != slowUb) bad++;
        }
        System.out.println("random self-test vs linear scan: " + tests + " cases, " + bad + " mismatches");
    }
}
