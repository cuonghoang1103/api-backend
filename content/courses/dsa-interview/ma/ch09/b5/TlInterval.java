import java.util.*;

// LC 435 Non-overlapping Intervals = keep as many as possible, remove the rest.
public class TlInterval {
    // #region lc435
    static int eraseOverlapIntervals(int[][] intervals) {
        int[][] a = intervals.clone();
        Arrays.sort(a, (p, q) -> Integer.compare(p[1], q[1]));   // by END time (compare, not p[1] - q[1])
        int kept = 0;
        long lastEnd = Long.MIN_VALUE;
        for (int[] iv : a) {
            if (iv[0] >= lastEnd) { kept++; lastEnd = iv[1]; }      // fits after the last kept one: keep it
        }
        return intervals.length - kept;
    }
    // #endregion

    static int eraseWrong(int[][] intervals, String by) {
        int[][] a = intervals.clone();
        if (by.equals("start")) Arrays.sort(a, (p, q) -> Integer.compare(p[0], q[0]));
        else Arrays.sort(a, (p, q) -> Integer.compare(p[1] - p[0], q[1] - q[0]));
        int kept = 0;
        List<int[]> chosen = new ArrayList<>();
        for (int[] iv : a) {
            boolean fits = true;
            for (int[] c : chosen) if (!(iv[1] <= c[0] || iv[0] >= c[1])) fits = false;
            if (fits) { chosen.add(iv); kept++; }
        }
        return intervals.length - kept;
    }

    static int brute(int[][] iv) {
        int n = iv.length, best = 0;
        for (int mask = 0; mask < (1 << n); mask++) {
            List<int[]> pick = new ArrayList<>();
            for (int i = 0; i < n; i++) if ((mask & (1 << i)) != 0) pick.add(iv[i]);
            pick.sort((p, q) -> Integer.compare(p[0], q[0]));
            boolean ok = true;
            for (int k = 1; k < pick.size(); k++) if (pick.get(k)[0] < pick.get(k - 1)[1]) ok = false;
            if (ok) best = Math.max(best, pick.size());
        }
        return n - best;
    }

    static String show(int[][] iv) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < iv.length; i++) sb.append(i > 0 ? "," : "").append(Arrays.toString(iv[i]));
        return sb.append("]").toString();
    }

    static long seed = 3;
    static int rnd(int m) { seed = (seed * 48271) % 2147483647L; return (int) (seed % m); }

    public static void main(String[] args) {
        int[][] ex = {{1, 2}, {2, 3}, {3, 4}, {1, 3}};
        System.out.println(show(ex) + " -> remove " + eraseOverlapIntervals(ex));
        int[][] longFirst = {{1, 10}, {2, 3}, {4, 5}, {6, 7}};
        System.out.println(show(longFirst) + ": by end " + eraseOverlapIntervals(longFirst) + ", by start " + eraseWrong(longFirst, "start") + ", brute " + brute(longFirst));
        int[][] shortMiddle = {{1, 5}, {4, 7}, {6, 10}};
        System.out.println(show(shortMiddle) + ": by end " + eraseOverlapIntervals(shortMiddle) + ", by length " + eraseWrong(shortMiddle, "length") + ", brute " + brute(shortMiddle));
        int fEnd = 0, fStart = 0, fLen = 0;
        for (int t = 0; t < 2000; t++) {
            int n = 1 + rnd(8);
            int[][] iv = new int[n][];
            for (int i = 0; i < n; i++) { int s = rnd(12); iv[i] = new int[]{s, s + 1 + rnd(6)}; }
            int b = brute(iv);
            if (eraseOverlapIntervals(iv) != b) fEnd++;
            if (eraseWrong(iv, "start") != b) fStart++;
            if (eraseWrong(iv, "length") != b) fLen++;
        }
        System.out.println("2000 random cases vs brute force -> wrong answers: by end " + fEnd + ", by start " + fStart + ", by length " + fLen);
    }
}
