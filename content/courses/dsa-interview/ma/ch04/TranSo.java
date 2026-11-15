import java.util.*;

// The (lo + hi) / 2 overflow, three ways: plain arithmetic, LC 278 with n = 2^31 - 1,
// and the 2006 JDK bug itself on a real array longer than 2^30 elements.
public class TranSo {
    static final int BAD = 2_000_000_000;               // the first bad version
    static int calls;
    static boolean isBadVersion(int v) { calls++; return v >= BAD; }

    // #region lc278
    static int firstBadVersion(int n) {                 // LC 278: versions 1..n, F...F T...T
        int lo = 1, hi = n;                              // the answer is in [lo, hi] (n is bad)
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;                // safe
            if (isBadVersion(mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
    // #endregion

    // #region tran
    static String firstBadVersionOverflow(int n) {       // the same, with mid = (lo + hi) / 2
        int lo = 1, hi = n, loops = 0;
        while (lo < hi) {
            if (++loops > 100) return "STUCK after 100 loops, lo=" + lo + " hi=" + hi;
            int mid = (lo + hi) / 2;                     // lo + hi > 2^31 - 1 wraps to a negative number
            if (isBadVersion(mid)) hi = mid; else lo = mid + 1;
        }
        return String.valueOf(lo);
    }
    // #endregion

    // #region jdk
    // java.util.Arrays.binarySearch before the 2006 fix (Bloch; Programming Pearls has the same line)
    static int oldBinarySearch(byte[] a, byte key) {
        int low = 0, high = a.length - 1;
        while (low <= high) {
            int mid = (low + high) / 2;                  // the famous line
            byte midVal = a[mid];
            if (midVal < key) low = mid + 1;
            else if (midVal > key) high = mid - 1;
            else return mid;
        }
        return -(low + 1);
    }
    // #endregion

    public static void main(String[] args) {
        int lo = 1_500_000_000, hi = 2_000_000_000;
        System.out.println("lo = " + lo + ", hi = " + hi + ", Integer.MAX_VALUE = " + Integer.MAX_VALUE);
        System.out.println("(lo + hi) / 2      = " + (lo + hi) / 2);
        System.out.println("lo + (hi - lo) / 2 = " + (lo + (hi - lo) / 2));
        System.out.println("(lo + hi) >>> 1    = " + ((lo + hi) >>> 1));

        int n = Integer.MAX_VALUE;
        calls = 0;
        System.out.println("LC 278, n = 2^31 - 1, first bad = " + BAD);
        System.out.println("  lo + (hi - lo) / 2 : " + firstBadVersion(n) + " (" + calls + " calls)");
        calls = 0;
        System.out.println("  (lo + hi) / 2      : " + firstBadVersionOverflow(n) + " (" + calls + " calls)");

        int len = 1_100_000_000;                         // > 2^30 = 1,073,741,824 elements (1.1 GB of bytes)
        byte[] a = new byte[len];                        // all zeros (sorted)...
        a[len - 1] = 1;                                  // ...and a single 1 at the very end
        System.out.println("byte[" + len + "], search for the 1 at index " + (len - 1));
        try {
            System.out.println("  old JDK search  : " + oldBinarySearch(a, (byte) 1));
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("  old JDK search  : " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
        System.out.println("  Arrays.binarySearch (fixed JDK): " + Arrays.binarySearch(a, (byte) 1));
        System.out.println("java " + System.getProperty("java.version"));
    }
}
