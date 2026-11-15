import java.util.*;

// Four "almost right" binary searches. Each differs from the template in ONE character or one line.
public class BayLechMot {
    static final int CAP = 100;

    static String lowerBound(int[] a, int x) {
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] >= x) hi = mid; else lo = mid + 1;
        }
        return String.valueOf(lo);
    }
    // #region sai
    static String bugLoEqMid(int[] a, int x) {               // bug 1: "lo = mid" (forgot + 1)
        int lo = 0, hi = a.length, loops = 0;
        while (lo < hi) {
            if (++loops > CAP) return "STUCK (lo=" + lo + ", hi=" + hi + ")";
            int mid = lo + (hi - lo) / 2;
            if (a[mid] >= x) hi = mid; else lo = mid;
        }
        return String.valueOf(lo);
    }
    static String bugLessOrEqual(int[] a, int x) {           // bug 2: "while (lo <= hi)" with "hi = mid"
        int lo = 0, hi = a.length, loops = 0;
        while (lo <= hi) {
            if (++loops > CAP) return "STUCK (lo=" + lo + ", hi=" + hi + ")";
            int mid = lo + (hi - lo) / 2;
            if (mid >= a.length) return "READS a[" + mid + "] OUTSIDE the array";   // Java would throw here
            if (a[mid] >= x) hi = mid; else lo = mid + 1;
        }
        return String.valueOf(lo);
    }
    static String bugHiLast(int[] a, int x) {                // bug 3: "hi = a.length - 1"
        int lo = 0, hi = a.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] >= x) hi = mid; else lo = mid + 1;
        }
        return String.valueOf(lo);
    }
    static String bugRoundUp(int[] a, int x) {               // bug 4: mid rounded UP with "hi = mid"
        int lo = 0, hi = a.length, loops = 0;
        while (lo < hi) {
            if (++loops > CAP) return "STUCK (lo=" + lo + ", hi=" + hi + ")";
            int mid = lo + (hi - lo + 1) / 2;
            if (mid >= a.length) return "READS a[" + mid + "] OUTSIDE the array";
            if (a[mid] >= x) hi = mid; else lo = mid + 1;
        }
        return String.valueOf(lo);
    }
    // #endregion

    public static void main(String[] args) {
        int[] a = {1, 3, 5, 6};
        System.out.println("a = " + Arrays.toString(a) + "   (correct lower bounds: x=5 -> 2, x=7 -> 4, x=0 -> 0)");
        for (int x : new int[]{5, 7, 0}) {
            System.out.println("x=" + x + ": template=" + lowerBound(a, x) + " | lo=mid: " + bugLoEqMid(a, x)
                + " | lo<=hi: " + bugLessOrEqual(a, x) + " | hi=n-1: " + bugHiLast(a, x)
                + " | mid rounds up: " + bugRoundUp(a, x));
        }
    }
}
