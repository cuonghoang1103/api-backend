import java.util.*;
import java.util.function.IntPredicate;

// LC 4 · Median of Two Sorted Arrays — binary search on the split, same template.
public class L8Median {
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (ok.test(mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
    // #region giai
    static double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int[] A = nums1.length <= nums2.length ? nums1 : nums2;
        int[] B = nums1.length <= nums2.length ? nums2 : nums1;
        int m = A.length, n = B.length, half = (m + n + 1) / 2;
        int i = firstTrue(0, m, k -> at(A, k) >= at(B, half - k - 1));
        int j = half - i;
        long leftMax = Math.max(at(A, i - 1), at(B, j - 1));
        if ((m + n) % 2 == 1) return leftMax;
        return (leftMax + Math.min(at(A, i), at(B, j))) / 2.0;
    }
    static long at(int[] X, int i) {                 // outside = -inf / +inf (long so the sentinels never collide)
        return i < 0 ? Long.MIN_VALUE : i >= X.length ? Long.MAX_VALUE : X[i];
    }
    // #endregion
    static long seed = 17;
    static int rnd(int q) { seed = (seed * 48271) % 2147483647L; return (int) (seed % q); }
    static String s(int[] a) { return Arrays.toString(a); }
    public static void main(String[] args) {
        int[][][] cases = {{{1, 4, 9}, {2, 3}}, {{1, 4}, {2, 3}}, {{}, {5}}, {{7, 8, 9}, {1, 2}}, {{-5, 3, 6, 12, 15}, {-12, -10, -6, -3, 4, 10}}};
        for (int[][] c : cases) System.out.println("median(" + s(c[0]) + ", " + s(c[1]) + ") = " + String.format("%.1f", findMedianSortedArrays(c[0], c[1])));
        int bad = 0;
        for (int t = 0; t < 3000; t++) {
            int[] x = new int[rnd(6)];
            for (int i = 0; i < x.length; i++) x[i] = rnd(20) - 10;
            int[] y = new int[1 + rnd(6)];
            for (int i = 0; i < y.length; i++) y[i] = rnd(20) - 10;
            Arrays.sort(x); Arrays.sort(y);
            int[] all = new int[x.length + y.length];
            System.arraycopy(x, 0, all, 0, x.length); System.arraycopy(y, 0, all, x.length, y.length);
            Arrays.sort(all);
            int L = all.length;
            double slow = L % 2 == 1 ? all[(L - 1) / 2] : (all[L / 2 - 1] + all[L / 2]) / 2.0;
            if (!String.format("%.1f", findMedianSortedArrays(x, y)).equals(String.format("%.1f", slow))) bad++;
        }
        System.out.println("self-test vs merge-and-sort: 3000 cases, " + bad + " mismatches");
    }
}
