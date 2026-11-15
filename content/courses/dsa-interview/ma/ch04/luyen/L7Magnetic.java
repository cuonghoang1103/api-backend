import java.util.*;
import java.util.function.IntPredicate;

// LC 1552 · Magnetic Force Between Two Balls — maximise the minimum = firstTrue(impossible) - 1.
public class L7Magnetic {
    static int checks = 0;
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (ok.test(mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
    // #region giai
    static int maxDistance(int[] position, int m) {
        int[] p = position.clone();
        Arrays.sort(p);
        int span = p[p.length - 1] - p[0];
        return firstTrue(1, span + 1, g -> {
            checks++;
            int count = 1, last = p[0];
            for (int i = 1; i < p.length && count < m; i++) if (p[i] - last >= g) { count++; last = p[i]; }
            return count < m;                     // "g is impossible"
        }) - 1;
    }
    // #endregion
    public static void main(String[] args) {
        int[][] ps = {{2, 3, 5, 9, 10}, {10, 1, 6, 15, 3}, {10, 1, 6, 15, 3}, {10, 1, 6, 15, 3}, {1, 1000000000}};
        int[] ms = {3, 2, 3, 5, 2};
        for (int i = 0; i < ps.length; i++) {
            checks = 0;
            int r = maxDistance(ps[i], ms[i]);
            System.out.println("positions=" + Arrays.toString(ps[i]) + " m=" + ms[i] + " -> " + r + " (" + checks + " checks)");
        }
    }
}
