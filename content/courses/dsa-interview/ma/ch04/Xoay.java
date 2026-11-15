import java.util.*;
import java.util.function.IntPredicate;

// Rotated sorted arrays with the SAME firstTrue template: LC 153 (find min) and LC 33 (search), two passes.
public class Xoay {
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (ok.test(mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
    }

    // #region lc153
    static int minIndex(int[] nums) {
        int last = nums[nums.length - 1];
        return firstTrue(0, nums.length, i -> nums[i] <= last);
    }
    static int findMin(int[] nums) {                       // LC 153
        return nums[minIndex(nums)];
    }
    // #endregion

    // #region lc33
    static int search(int[] nums, int target) {            // LC 33
        int n = nums.length, p = minIndex(nums);
        int lo = target <= nums[n - 1] ? p : 0;            // right part [p, n) or left part [0, p)
        int hi = target <= nums[n - 1] ? n : p;
        int i = firstTrue(lo, hi, k -> nums[k] >= target);
        return i < hi && nums[i] == target ? i : -1;
    }
    // #endregion

    static long seed = 99;
    static int rnd(int m) { seed = (seed * 48271) % 2147483647L; return (int) (seed % m); }

    public static void main(String[] args) {
        int[] a = {6, 8, 9, 12, 1, 3, 4};
        System.out.println("nums = " + Arrays.toString(a) + "  minIndex = " + minIndex(a) + "  findMin = " + findMin(a) + "  (rotated " + minIndex(a) + " times)");
        int[] ts = {1, 3, 4, 6, 8, 9, 12, 5, 13};
        int[] r = new int[ts.length];
        for (int k = 0; k < ts.length; k++) r[k] = search(a, ts[k]);
        System.out.println("search for [1,3,4,6,8,9,12,5,13] -> " + Arrays.toString(r));
        for (int[] b : new int[][]{{1}, {2, 1}, {1, 2, 3}, {3, 1, 2}}) {
            System.out.println("nums = " + Arrays.toString(b) + "  findMin = " + findMin(b) + "  search(2) = " + search(b, 2));
        }
        int[] ring = {1005, 1009, 1012, 1020, 980, 991, 997, 1001};
        int oldest = minIndex(ring), newest = (oldest - 1 + ring.length) % ring.length;
        System.out.println("ring buffer: oldest entry at slot " + oldest + " (t=" + ring[oldest] + "), newest at slot " + newest + " (t=" + ring[newest] + ")");

        int cases = 0, bad = 0;
        for (int t = 0; t < 400; t++) {
            int n = 1 + rnd(9);
            LinkedHashSet<Integer> s = new LinkedHashSet<>();
            while (s.size() < n) s.add(rnd(30));
            int[] sorted = s.stream().mapToInt(Integer::intValue).sorted().toArray();
            for (int rot = 0; rot < n; rot++) {
                int[] arr = new int[n];
                for (int i = 0; i < n; i++) arr[i] = sorted[(i + rot) % n];
                for (int x = -1; x <= 31; x++) {
                    cases++;
                    int idx = -1;
                    for (int i = 0; i < n; i++) if (arr[i] == x) { idx = i; break; }
                    if (search(arr, x) != idx) bad++;
                }
                if (findMin(arr) != sorted[0]) bad++;
            }
        }
        System.out.println("self-test vs indexOf: " + cases + " searches, " + bad + " mismatches");
    }
}
