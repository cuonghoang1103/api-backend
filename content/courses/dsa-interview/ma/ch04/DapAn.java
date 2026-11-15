import java.util.*;
import java.util.function.IntPredicate;

// LC 1011, LC 1482, LC 410 — each = firstTrue + a greedy O(n) check.
public class DapAn {
    static int checks = 0;
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            checks++;
            if (ok.test(mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
    }

    // #region lc1011
    static int shipWithinDays(int[] weights, int days) {               // LC 1011
        int lo = 0, hi = 0;
        for (int w : weights) { lo = Math.max(lo, w); hi += w; }
        return firstTrue(lo, hi, cap -> {
            int d = 1, load = 0;
            for (int w : weights) {
                if (load + w > cap) { d++; load = 0; }
                load += w;
            }
            return d <= days;
        });
    }
    // #endregion

    // #region lc1482
    static int minDays(int[] bloomDay, int m, int k) {                 // LC 1482
        if ((long) m * k > bloomDay.length) return -1;                 // long: m, k up to 10^6 and 10^5
        int lo = Integer.MAX_VALUE, hi = 0;
        for (int b : bloomDay) { lo = Math.min(lo, b); hi = Math.max(hi, b); }
        return firstTrue(lo, hi, day -> {
            int made = 0, run = 0;
            for (int b : bloomDay) {
                run = b <= day ? run + 1 : 0;
                if (run == k) { made++; run = 0; }
            }
            return made >= m;
        });
    }
    // #endregion

    // #region lc410
    static int splitArray(int[] nums, int k) {                         // LC 410
        int lo = 0, hi = 0;
        for (int x : nums) { lo = Math.max(lo, x); hi += x; }
        return firstTrue(lo, hi, limit -> {
            int pieces = 1, sum = 0;
            for (int x : nums) {
                if (sum + x > limit) { pieces++; sum = 0; }
                sum += x;
            }
            return pieces <= k;
        });
    }
    // #endregion

    static long seed = 11;
    static int rnd(int q) { seed = (seed * 48271) % 2147483647L; return (int) (seed % q); }

    public static void main(String[] args) {
        int[] w = {3, 8, 2, 7, 5, 4, 6, 1};
        for (int d : new int[]{1, 3, 4, 8}) { checks = 0; int r = shipWithinDays(w, d); System.out.println("ship " + Arrays.toString(w) + " in " + d + " days -> capacity " + r + " (" + checks + " checks)"); }
        int[] bloom = {7, 2, 9, 3, 3, 8, 1, 4};
        int[][] mk = {{2, 2}, {3, 2}, {1, 8}, {5, 2}};
        for (int[] q : mk) { checks = 0; int r = minDays(bloom, q[0], q[1]); System.out.println("bouquets m=" + q[0] + " k=" + q[1] + " from " + Arrays.toString(bloom) + " -> day " + r + " (" + checks + " checks)"); }
        int[] a = {9, 2, 6, 4, 11, 3, 5};
        for (int k : new int[]{1, 2, 3, 7}) { checks = 0; int r = splitArray(a, k); System.out.println("split " + Arrays.toString(a) + " into " + k + " -> largest piece " + r + " (" + checks + " checks)"); }
        int bad = 0;
        for (int t = 0; t < 500; t++) {
            int n = 1 + rnd(7);
            int[] arr = new int[n];
            for (int i = 0; i < n; i++) arr[i] = 1 + rnd(9);
            int k = 1 + rnd(n);
            int slow = 0;
            for (int x : arr) slow = Math.max(slow, x);
            while (true) {
                int p = 1, s = 0;
                for (int x : arr) { if (s + x > slow) { p++; s = 0; } s += x; }
                if (p <= k) break;
                slow++;
            }
            if (splitArray(arr, k) != slow || shipWithinDays(arr, k) != slow) bad++;
        }
        System.out.println("self-test split/ship vs brute force: 500 cases, " + bad + " mismatches");
    }
}
