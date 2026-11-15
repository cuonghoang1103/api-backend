import java.util.function.IntPredicate;

// The Java trap of LC 875: summing hours in an int. 4 piles of 10^9 at speed 1 = 4*10^9 hours > 2^31 - 1.
public class KokoTran {
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (ok.test(mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
    // #region sai
    static int hoursInt(int[] piles, int k) {                 // BUG: int accumulator
        int h = 0;
        for (int p : piles) h += (p + k - 1) / k;             // BUG 2: p + k - 1 can overflow too
        return h;
    }
    // #endregion
    static long hoursLong(int[] piles, int k) {
        long h = 0;
        for (int p : piles) h += (p + (long) k - 1) / k;
        return h;
    }
    public static void main(String[] args) {
        int[] piles = {1_000_000_000, 1_000_000_000, 1_000_000_000, 1_000_000_000};
        int h = 1_000_000_000;
        for (int k : new int[]{1, 2, 3, 4}) {
            System.out.println("k=" + k + "  int hours = " + hoursInt(piles, k) + "  long hours = " + hoursLong(piles, k)
                + "  canFinish: int says " + (hoursInt(piles, k) <= h) + ", truth " + (hoursLong(piles, k) <= h));
        }
        System.out.println("answer with int  sum: " + firstTrue(1, 1_000_000_000, k -> hoursInt(piles, k) <= h));
        System.out.println("answer with long sum: " + firstTrue(1, 1_000_000_000, k -> hoursLong(piles, k) <= h));
        int linear = 1;
        while (!(hoursInt(piles, linear) <= h)) linear++;               // a scan from k = 1 asks about k = 1 first
        System.out.println("linear scan k = 1, 2, ... with int sum: " + linear + "   <- the lie at k = 1 is now the answer");
    }
}
