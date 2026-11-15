import java.util.*;

// LC 191 · LC 231 · LC 338 — same output as bit-dem.ts.
public class BitDem {
    // #region kernighan
    static int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            n &= n - 1;            // drop the lowest 1-bit
            count++;
        }
        return count;
    }
    // #endregion

    // #region shift
    static int hammingWeightShift(int n) {
        int count = 0;
        while (n != 0) {
            count += n & 1;
            n >>>= 1;              // >>> : LeetCode's Java signature passes the bits as a SIGNED int
        }
        return count;
    }
    // #endregion

    // #region pow2
    static boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }
    // #endregion

    // #region count-bits
    static int[] countBits(int n) {
        int[] ans = new int[n + 1];
        for (int i = 1; i <= n; i++) ans[i] = ans[i >> 1] + (i & 1);
        return ans;
    }
    // #endregion

    static int loops(int n, boolean kernighan) {
        int c = 0;
        while (n != 0) { n = kernighan ? n & (n - 1) : n >>> 1; c++; }
        return c;
    }

    public static void main(String[] args) {
        for (int n : new int[]{11, 128, 2147483645}) System.out.println("hammingWeight(" + n + ") = " + hammingWeight(n) + " = " + hammingWeightShift(n));
        int[] t = {1, 16, 6, 0, -8};
        boolean[] r = new boolean[t.length];
        for (int i = 0; i < t.length; i++) r[i] = isPowerOfTwo(t[i]);
        System.out.println("isPowerOfTwo [1, 16, 6, 0, -8] = " + Arrays.toString(r));
        System.out.println("countBits(5) = " + Arrays.toString(countBits(5)));
        System.out.println("countBits(16) = " + Arrays.toString(countBits(16)));
        for (int n : new int[]{52, 1 << 30, 2147483647}) System.out.println("loops for " + n + ": kernighan " + loops(n, true) + ", shift " + loops(n, false));
    }
}
