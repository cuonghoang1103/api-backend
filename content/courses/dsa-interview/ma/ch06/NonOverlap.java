import java.util.*;

// LC 435 + LC 452 — greedy by earliest end.
public class NonOverlap {
    // #region erase
    static int eraseOverlapIntervals(int[][] intervals) {
        int[][] s = intervals.clone();
        Arrays.sort(s, (x, y) -> Integer.compare(x[1], y[1]));
        int removed = 0;
        long lastEnd = Long.MIN_VALUE;
        for (int[] iv : s) {
            if (iv[0] >= lastEnd) lastEnd = iv[1];
            else removed++;
        }
        return removed;
    }
    // #endregion

    // #region arrows
    static int findMinArrowShots(int[][] points) {
        int[][] s = points.clone();
        Arrays.sort(s, (x, y) -> Integer.compare(x[1], y[1]));   // NOT x[1] - y[1]: see ArrowsTran.java
        int arrows = 0;
        long shotAt = Long.MIN_VALUE;                            // below every int, even -2^31
        for (int[] p : s) if (p[0] > shotAt) { arrows++; shotAt = p[1]; }
        return arrows;
    }
    // #endregion

    static String show(int[][] a) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) sb.append(i > 0 ? "," : "").append(Arrays.toString(a[i]));
        return sb.append("]").toString();
    }
    public static void main(String[] args) {
        int[][][] a = {{{1, 3}, {2, 4}, {3, 5}, {1, 2}}, {{1, 5}, {1, 5}, {1, 5}}, {{2, 4}, {4, 7}}, {{1, 10}, {2, 3}, {4, 5}, {6, 7}}};
        for (int[][] iv : a) System.out.println("erase " + show(iv) + " = " + eraseOverlapIntervals(iv) + "   arrows = " + findMinArrowShots(iv));
    }
}
