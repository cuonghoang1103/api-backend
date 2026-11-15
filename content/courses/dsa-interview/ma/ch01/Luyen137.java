import java.util.*;

// LC 137 · Single Number II.
public class Luyen137 {
    // #region giai
    static int singleNumber(int[] nums) {
        int ans = 0;
        for (int b = 0; b < 32; b++) {
            int cnt = 0;
            for (int x : nums) cnt += (x >> b) & 1;
            if (cnt % 3 != 0) ans |= 1 << b;       // b = 31 sets the sign bit: ans becomes negative, which is right
        }
        return ans;
    }
    // #endregion

    // #region fsm
    static int singleNumberFsm(int[] nums) {
        int ones = 0, twos = 0;
        for (int x : nums) {
            ones = (ones ^ x) & ~twos;
            twos = (twos ^ x) & ~ones;
        }
        return ones;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] cases = {{6, 1, 6, 6}, {4, -1, 4, 4}, {-2, -2, 7, -2}, {-2147483648, 3, 3, 3}, {0, 5, 0, 0}};
        for (int[] nums : cases) {
            System.out.println("singleNumber(" + Arrays.toString(nums) + ") = " + singleNumber(nums)
                + "   fsm = " + singleNumberFsm(nums));
        }
    }
}
