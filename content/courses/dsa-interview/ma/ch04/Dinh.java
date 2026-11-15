import java.util.*;
import java.util.function.IntPredicate;

// Peaks without a sorted array: LC 162 (any peak), LC 852 (mountain), and tuning concurrency.
public class Dinh {
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (ok.test(mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
    }

    // #region lc162
    static int findPeakElement(int[] nums) {             // LC 162 (and LC 852 for a mountain)
        return firstTrue(0, nums.length - 1, i -> nums[i] > nums[i + 1]);
    }
    // #endregion

    static boolean isPeak(int[] a, int i) {
        return (i == 0 || a[i - 1] < a[i]) && (i == a.length - 1 || a[i] > a[i + 1]);
    }
    static int tests = 0;
    static int throughput(int c) { tests++; return (int) Math.round((1000.0 * c) / (1 + 0.004 * c * c)); }
    static long seed = 3;
    static int rnd(int m) { seed = (seed * 48271) % 2147483647L; return (int) (seed % m); }

    public static void main(String[] args) {
        int[][] cases = {{2, 4, 3, 1, 5, 7, 6}, {1, 3, 2, 4, 1}, {5}, {1, 2}, {2, 1}, {1, 2, 3, 4}, {0, 3, 8, 9, 6, 2}};
        for (int[] a : cases) {
            int p = findPeakElement(a);
            List<Integer> all = new ArrayList<>();
            StringBuilder row = new StringBuilder();
            for (int i = 0; i < a.length; i++) if (isPeak(a, i)) all.add(i);
            for (int i = 0; i + 1 < a.length; i++) row.append(a[i] > a[i + 1] ? 'T' : 'F');
            System.out.println("nums = " + Arrays.toString(a) + "  peak index = " + p + "  (all peaks: " + all + ")  ok row = " + row);
        }
        // #region tune
        int best = 1 + firstTrue(0, 63, i -> throughput(i + 1) > throughput(i + 2));
        // #endregion
        System.out.println("best concurrency = " + best + " (" + throughput(best) + " req/s) after " + (tests - 1) + " load tests instead of 64");
        int arg = 1;
        for (int c = 1; c <= 64; c++) if (throughput(c) > throughput(arg)) arg = c;
        System.out.println("check by trying all 64: best = " + arg);
        int bad = 0;
        for (int t = 0; t < 3000; t++) {
            int n = 1 + rnd(10);
            int[] a = new int[n];
            a[0] = rnd(5);
            for (int i = 1; i < n; i++) a[i] = a[i - 1] + (rnd(2) == 1 ? 1 + rnd(3) : -1 - rnd(3));
            if (!isPeak(a, findPeakElement(a))) bad++;
        }
        System.out.println("self-test: 3000 random arrays (neighbours distinct), " + bad + " non-peaks returned");
    }
}
