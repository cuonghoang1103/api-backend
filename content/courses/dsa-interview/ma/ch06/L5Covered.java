import java.util.*;

// LC 1288 · Remove Covered Intervals.
public class L5Covered {
    // #region giai
    static int removeCoveredIntervals(int[][] intervals) {
        int[][] s = intervals.clone();
        Arrays.sort(s, (a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(b[1], a[1]));
        int kept = 0;
        long maxEnd = Long.MIN_VALUE;
        for (int[] iv : s) if (iv[1] > maxEnd) { kept++; maxEnd = iv[1]; }
        return kept;
    }
    // #endregion

    static String show(int[][] a) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) sb.append(i > 0 ? "," : "").append(Arrays.toString(a[i]));
        return sb.append("]").toString();
    }
    public static void main(String[] args) {
        int[][][] cases = {{{1, 4}, {2, 3}, {3, 6}, {2, 8}, {5, 7}}, {{1, 2}, {1, 5}}, {{3, 9}, {1, 4}, {5, 7}}, {{2, 2}, {2, 2}}};
        for (int[][] iv : cases) System.out.println(show(iv) + " -> " + removeCoveredIntervals(iv));
    }
}
