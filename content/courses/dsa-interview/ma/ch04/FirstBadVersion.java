// LC 278 · First Bad Version — the purest F...F T...T row: versions 1..n, isBadVersion(v) flips once.
public class FirstBadVersion {
    static int bad = 4, calls = 0;
    static boolean isBadVersion(int v) { calls++; return v >= bad; }

    // #region lc278
    static int firstBadVersion(int n) {
        int lo = 1, hi = n;                        // n is known to be bad, so the answer is in [1, n]
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;          // (lo + hi) / 2 overflows when n is near 2^31 - 1
            if (isBadVersion(mid)) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] cases = {{6, 4}, {1, 1}, {10, 1}, {10, 10}, {2147483647, 2147483647}, {2147483647, 1702766719}};
        for (int[] c : cases) {
            bad = c[1]; calls = 0;
            System.out.println("n=" + c[0] + " firstBad=" + c[1] + " -> " + firstBadVersion(c[0]) + " (" + calls + " calls to isBadVersion)");
        }
    }
}
