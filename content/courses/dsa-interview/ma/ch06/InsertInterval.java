import java.util.*;

// LC 57 · Insert Interval — before / overlapping / after.
public class InsertInterval {
    // #region giai
    static int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> out = new ArrayList<>();
        int s = newInterval[0], e = newInterval[1], i = 0, n = intervals.length;
        while (i < n && intervals[i][1] < s) out.add(intervals[i++]);
        while (i < n && intervals[i][0] <= e) {
            s = Math.min(s, intervals[i][0]);
            e = Math.max(e, intervals[i][1]);
            i++;
        }
        out.add(new int[]{s, e});
        while (i < n) out.add(intervals[i++]);
        return out.toArray(new int[0][]);
    }
    // #endregion

    static String show(int[][] a) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) sb.append(i > 0 ? "," : "").append(Arrays.toString(a[i]));
        return sb.append("]").toString();
    }
    public static void main(String[] args) {
        int[][][] ivs = {{{1, 2}, {4, 5}, {7, 9}, {12, 14}}, {{1, 2}, {4, 5}}, {{3, 5}, {8, 9}}, {{1, 3}, {6, 9}}, {}};
        int[][] news = {{3, 8}, {6, 7}, {1, 2}, {3, 6}, {4, 8}};
        for (int t = 0; t < ivs.length; t++)
            System.out.println("insert " + Arrays.toString(news[t]) + " into " + show(ivs[t]) + " = " + show(insert(ivs[t], news[t])));
    }
}
