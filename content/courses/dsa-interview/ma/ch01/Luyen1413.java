import java.util.*;

// LC 1413 · Minimum Value to Get Positive Step by Step Sum.
public class Luyen1413 {
    // #region giai
    static int minStartValue(int[] nums) {
        int sum = 0, minSum = 0;          // 0 = the empty prefix
        for (int x : nums) {
            sum += x;
            minSum = Math.min(minSum, sum);
        }
        return 1 - minSum;
    }
    // #endregion

    static int minStartValueBrute(int[] nums) {
        for (int start = 1; ; start++) {
            int cur = start;
            boolean ok = true;
            for (int x : nums) {
                cur += x;
                if (cur < 1) { ok = false; break; }
            }
            if (ok) return start;
        }
    }

    public static void main(String[] args) {
        int[][] cases = {{-3, 2, -3, 4, 2}, {2, 3}, {1, -2, -3}, {-5}, {0, 0, 0}};
        for (int[] nums : cases) {
            System.out.println("minStartValue(" + Arrays.toString(nums) + ") = " + minStartValue(nums)
                + "   brute = " + minStartValueBrute(nums));
        }
    }
}
