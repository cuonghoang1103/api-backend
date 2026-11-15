import java.util.*;
import java.util.function.IntPredicate;

// LC 875 · Koko Eating Bananas — binary search on the ANSWER (the speed).
public class Koko {
    static int checks = 0;
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (ok.test(mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
    }

    // #region lc875
    static long hoursAt(int[] piles, int k) {                 // long: 10^4 piles * 10^9 hours overflows int
        long h = 0;
        for (int p : piles) h += (p + (long) k - 1) / k;      // ceil(p / k) without floating point
        return h;
    }
    static int minEatingSpeed(int[] piles, int h) {           // LC 875
        int max = 0;
        for (int p : piles) max = Math.max(max, p);
        return firstTrue(1, max, k -> { checks++; return hoursAt(piles, k) <= h; });
    }
    // #endregion

    public static void main(String[] args) {
        int[] piles = {4, 11, 20, 23, 30};
        int H = 8;
        StringBuilder row = new StringBuilder();
        for (int k = 1; k <= 30; k++) row.append(hoursAt(piles, k) <= H ? 'T' : 'F');
        System.out.println("piles = " + Arrays.toString(piles) + ", h = " + H);
        System.out.println("row canFinish(k), k = 1..30: " + row);
        System.out.println("hours at k = 14, 15, 16: " + hoursAt(piles, 14) + ", " + hoursAt(piles, 15) + ", " + hoursAt(piles, 16));
        checks = 0;
        int r0 = minEatingSpeed(piles, H);
        System.out.println("minEatingSpeed = " + r0 + " after " + checks + " checks (trying k = 1, 2, 3, ... would need 15)");
        int[][] ps = {{5, 9, 13, 2}, {25, 7, 18}, {25, 7, 18}, {1000000000}, {312884470}};
        int[] hs = {7, 3, 4, 2, 312884469};
        for (int i = 0; i < ps.length; i++) {
            checks = 0;
            int r = minEatingSpeed(ps[i], hs[i]);
            System.out.println("piles=" + Arrays.toString(ps[i]) + " h=" + hs[i] + " -> " + r + " (" + checks + " checks)");
        }
    }
}
