import java.util.*;
import java.util.function.BiFunction;

// Differential testing, Java version: same Park–Miller generator ⇒ same random inputs as doi-chieu.ts.
public class DoiChieu {
    static int maxWindowBuggy(int[] nums, int k) {
        int sum = 0;
        for (int i = 0; i < k; i++) sum += nums[i];
        int best = sum;
        for (int s = 1; s < nums.length - k; s++) { sum += nums[s + k - 1] - nums[s - 1]; best = Math.max(best, sum); }
        return best;
    }
    static int maxWindow(int[] nums, int k) {
        int sum = 0;
        for (int i = 0; i < k; i++) sum += nums[i];
        int best = sum;
        for (int s = 1; s <= nums.length - k; s++) { sum += nums[s + k - 1] - nums[s - 1]; best = Math.max(best, sum); }
        return best;
    }
    static int maxWindowBrute(int[] nums, int k) {
        int best = Integer.MIN_VALUE;
        for (int s = 0; s + k <= nums.length; s++) {
            int sum = 0;
            for (int i = s; i < s + k; i++) sum += nums[i];
            best = Math.max(best, sum);
        }
        return best;
    }

    // #region harness
    static final long M = 2147483647L;                  // 2^31 − 1, a prime
    static long x;                                      // generator state
    static int next() { x = x * 48271 % M; return (int) x; }   // long: the product does not overflow

    static int k;                                       // filled by makeCase
    static int[] makeCase(int seed) {
        x = seed;
        int n = 1 + next() % 6;                          // small n
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = next() % 11 - 5;   // next() >= 0, so % is never negative here
        k = 1 + next() % n;
        return nums;
    }
    static void check(String name, BiFunction<int[], Integer, Integer> fast, int tests) {
        int failures = 0;
        String first = "";
        for (int seed = 1; seed <= tests; seed++) {
            int[] nums = makeCase(seed);
            int got = fast.apply(nums, k), want = maxWindowBrute(nums, k);
            if (got != want) {
                failures++;
                if (first.isEmpty()) first = "seed " + seed + ": nums=" + Arrays.toString(nums) + " k=" + k
                    + " fast=" + got + " brute=" + want;
            }
        }
        System.out.println(name + ": " + failures + " of " + tests + " random tests disagree with brute force");
        if (!first.isEmpty()) System.out.println("  first failure -> " + first);
    }
    // #endregion

    public static void main(String[] args) {
        check("buggy", DoiChieu::maxWindowBuggy, 2000);
        check("fixed", DoiChieu::maxWindow, 2000);
        int[] best = null; int bestK = 0, bestSeed = 0;
        for (int seed = 1; seed <= 2000; seed++) {
            int[] nums = makeCase(seed);
            if (maxWindowBuggy(nums, k) == maxWindowBrute(nums, k)) continue;
            if (best == null || nums.length < best.length || (nums.length == best.length && k < bestK)) {
                best = nums; bestK = k; bestSeed = seed;
            }
        }
        if (best != null) {
            System.out.println("smallest failing input: seed " + bestSeed + ": nums=" + Arrays.toString(best) + " k=" + bestK
                + " buggy=" + maxWindowBuggy(best, bestK) + " brute=" + maxWindowBrute(best, bestK));
        }
    }
}
