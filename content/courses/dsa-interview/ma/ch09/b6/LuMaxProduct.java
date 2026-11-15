// LC 152 Maximum Product Subarray — Kadane with TWO states: the largest and the smallest product ending here.
public class LuMaxProduct {
    // #region giai
    static int maxProduct(int[] nums) {
        int hi = nums[0], lo = nums[0], best = nums[0];   // products of the best/worst subarray ENDING at i
        for (int i = 1; i < nums.length; i++) {
            int x = nums[i];
            int a = hi * x, b = lo * x;                   // compute both BEFORE overwriting hi
            hi = Math.max(x, Math.max(a, b));
            lo = Math.min(x, Math.min(a, b));
            best = Math.max(best, hi);
        }
        return best;
    }
    // #endregion

    static int maxProductOnlyMax(int[] nums) {
        int hi = nums[0], best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            hi = Math.max(nums[i], hi * nums[i]);
            best = Math.max(best, hi);
        }
        return best;
    }

    static long seed = 20261115;
    static int rnd(int m) { seed = (seed * 48271) % 2147483647L; return (int) (seed % m); }

    public static void main(String[] args) {
        int[][] tests = {{2, 3, -2, 4}, {-2, 3, -4}, {-2, 0, -1}, {-3}, {-1, -2, -3, 0, 2}, {0, 2}};
        for (int[] a : tests) {
            String s = java.util.Arrays.toString(a).replace(" ", "");
            System.out.println(String.format("%-20s", s) + " maxProduct = " + maxProduct(a) + "   only-max version = " + maxProductOnlyMax(a));
        }
        int bad = 0, wrongOnlyMax = 0;
        for (int t = 0; t < 3000; t++) {
            int n = 1 + rnd(8);
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = rnd(7) - 3;
            long slow = Long.MIN_VALUE;
            for (int i = 0; i < n; i++) { long p = 1; for (int j = i; j < n; j++) { p *= a[j]; slow = Math.max(slow, p); } }
            if (maxProduct(a) != slow) bad++;
            if (maxProductOnlyMax(a) != slow) wrongOnlyMax++;
        }
        System.out.println("random self-test: 3000 arrays, two-state " + bad + " mismatches, only-max " + wrongOnlyMax + " mismatches");
    }
}
