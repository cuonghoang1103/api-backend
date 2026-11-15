import java.util.*;
import java.util.function.IntPredicate;

// LC 2300 · Successful Pairs of Spells and Potions.
public class L4Spells {
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (ok.test(mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
    // #region giai
    static int[] successfulPairs(int[] spells, int[] potions, long success) {
        int[] p = potions.clone();
        Arrays.sort(p);
        int[] res = new int[spells.length];
        for (int i = 0; i < spells.length; i++) {
            long s = spells[i];                                      // long: 10^5 * 10^5 = 10^10 > 2^31
            res[i] = p.length - firstTrue(0, p.length, j -> s * p[j] >= success);
        }
        return res;
    }
    // #endregion
    public static void main(String[] args) {
        int[] spells = {4, 1, 7}, potions = {2, 9, 5, 1, 6};
        long success = 20;
        int[] brute = new int[spells.length];
        for (int i = 0; i < spells.length; i++) for (int q : potions) if ((long) spells[i] * q >= success) brute[i]++;
        System.out.println("spells=" + Arrays.toString(spells) + " potions=" + Arrays.toString(potions) + " success=" + success + " -> " + Arrays.toString(successfulPairs(spells, potions, success)));
        System.out.println("brute force                                  -> " + Arrays.toString(brute));
        System.out.println("big values: spell 100000, potion 100000, success 10000000000 -> " + Arrays.toString(successfulPairs(new int[]{100000}, new int[]{100000, 99999}, 10000000000L)));
    }
}
