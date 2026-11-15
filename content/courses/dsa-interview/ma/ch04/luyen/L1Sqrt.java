import java.util.*;
import java.util.function.IntPredicate;

// LC 69 · Sqrt(x): the largest r with r*r <= x.
public class L1Sqrt {
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (ok.test(mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
    // #region giai
    static int mySqrt(int x) {
        int hi = Math.min(x, 46340) + 1;
        return firstTrue(0, hi, r -> (long) r * r > x) - 1;   // (long): 46341 * 46341 overflows int
    }
    // #endregion
    public static void main(String[] args) {
        int[] xs = {0, 1, 2, 3, 4, 8, 15, 16, 17, 99, 2147395599, 2147483647};
        int[] r = new int[xs.length];
        for (int i = 0; i < xs.length; i++) r[i] = mySqrt(xs[i]);
        System.out.println("x    = " + Arrays.toString(xs));
        System.out.println("sqrt = " + Arrays.toString(r));
        int bad = 0;
        for (int x = 0; x <= 20000; x++) if (mySqrt(x) != (int) Math.floor(Math.sqrt(x))) bad++;
        System.out.println("x = 0..20000 vs Math.floor(Math.sqrt(x)): " + bad + " mismatches");
    }
}
