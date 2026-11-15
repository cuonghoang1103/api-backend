// @bo-qua
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

// JUnit 5 tests for the same function. -Dban=loi runs them against the buggy version.
// Compiled and run for real by chay-junit.ts (needs the JUnit jars from ~/.m2 — see that file).
public class CuaSoTest {
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
    static int impl(int[] nums, int k) {
        return "loi".equals(System.getProperty("ban")) ? maxWindowBuggy(nums, k) : maxWindow(nums, k);
    }

    // #region tests
    @Test @DisplayName("normal example: [2,1,5,1,3,2], k=3 -> 9")
    void normal() { assertEquals(9, impl(new int[]{2, 1, 5, 1, 3, 2}, 3)); }

    @Test @DisplayName("edge: the best window is the last one")
    void lastWindow() { assertEquals(5, impl(new int[]{1, 2, 3}, 2)); }

    @Test @DisplayName("edge: one element, k = 1")
    void oneElement() { assertEquals(7, impl(new int[]{7}, 1)); }

    @Test @DisplayName("edge: k = n, a single window")
    void wholeArray() { assertEquals(5, impl(new int[]{4, -1, 2}, 3)); }

    @Test @DisplayName("edge: every window is negative (best must not start at 0)")
    void allNegative() { assertEquals(-3, impl(new int[]{-3, -1, -2}, 2)); }

    @Test @DisplayName("edge: all equal")
    void allEqual() { assertEquals(10, impl(new int[]{5, 5, 5, 5}, 2)); }
    // #endregion
}
