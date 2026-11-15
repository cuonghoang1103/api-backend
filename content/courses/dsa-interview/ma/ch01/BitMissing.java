import java.util.*;

// LC 268 · Missing Number.
public class BitMissing {
    // #region xor
    static int missingNumber(int[] nums) {
        int acc = nums.length;
        for (int i = 0; i < nums.length; i++) acc ^= i ^ nums[i];
        return acc;
    }
    // #endregion

    // #region sum
    static int missingNumberSum(int[] nums) {
        int n = nums.length;
        long s = (long) n * (n + 1) / 2;   // long: n * (n + 1) overflows int once n passes ~46,340
        for (int x : nums) s -= x;
        return (int) s;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] cases = {{3, 0, 1}, {0, 1}, {9, 6, 4, 2, 3, 5, 7, 0, 1}, {0}};
        for (int[] c : cases) System.out.println(Arrays.toString(c) + " -> xor " + missingNumber(c) + ", sum " + missingNumberSum(c));
    }
}
