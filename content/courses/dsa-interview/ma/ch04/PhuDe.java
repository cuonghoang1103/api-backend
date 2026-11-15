import java.util.*;

// The last cue with start <= s = upperBound(starts, s) - 1.
public class PhuDe {
    // #region cue
    static int cueAt(double[] starts, double s) {
        int lo = 0, hi = starts.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (starts[mid] > s) hi = mid; else lo = mid + 1;   // ok(i) = starts[i] > s
        }
        return lo - 1;                                          // -1 = before the first cue
    }
    // #endregion
    static int slow(double[] starts, double s) {
        int r = -1;
        for (int i = 0; i < starts.length; i++) if (starts[i] <= s) r = i;
        return r;
    }
    static String fmt(double[] a) {
        StringBuilder b = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) {
            if (i > 0) b.append(',');
            b.append(a[i] == Math.floor(a[i]) ? String.valueOf((long) a[i]) : String.valueOf(a[i]));
        }
        return b.append(']').toString();
    }
    public static void main(String[] args) {
        double[] starts = {0, 2.5, 6, 9.2, 15, 15, 21.4};
        double[] qs = {-1, 0, 2.4, 2.5, 7, 15, 20, 99};
        int[] r1 = new int[qs.length], r2 = new int[qs.length];
        for (int i = 0; i < qs.length; i++) { r1[i] = cueAt(starts, qs[i]); r2[i] = slow(starts, qs[i]); }
        System.out.println("starts = " + fmt(starts));
        System.out.println("cueAt  = " + Arrays.toString(r1) + "  for s = " + fmt(qs));
        System.out.println("slow   = " + Arrays.toString(r2));
    }
}
