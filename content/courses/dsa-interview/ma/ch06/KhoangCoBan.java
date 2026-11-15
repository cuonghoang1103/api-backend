import java.util.*;

// The overlap test (half-open vs closed) and Meeting Rooms I (LC 252).
public class KhoangCoBan {
    // #region overlap
    static boolean overlapsHalfOpen(int[] a, int[] b) { return a[0] < b[1] && b[0] < a[1]; }
    static boolean overlapsClosed(int[] a, int[] b) { return a[0] <= b[1] && b[0] <= a[1]; }
    // #endregion

    // #region canattend
    static boolean canAttendMeetings(int[][] intervals) {
        int[][] s = intervals.clone();
        Arrays.sort(s, (x, y) -> Integer.compare(x[0], y[0]));
        for (int i = 1; i < s.length; i++) if (s[i][0] < s[i - 1][1]) return false;
        return true;
    }
    // #endregion

    public static void main(String[] args) {
        int[][][] pairs = {{{9, 11}, {11, 13}}, {{9, 12}, {10, 11}}, {{9, 10}, {11, 12}}, {{13, 15}, {9, 14}}};
        for (int[][] p : pairs) System.out.println(Arrays.toString(p[0]) + " & " + Arrays.toString(p[1]) + ": half-open=" + overlapsHalfOpen(p[0], p[1]) + " closed=" + overlapsClosed(p[0], p[1]));
        System.out.println("canAttend [[9,10],[13,14],[10,12]] = " + canAttendMeetings(new int[][]{{9, 10}, {13, 14}, {10, 12}}));
        System.out.println("canAttend [[9,11],[13,14],[10,12]] = " + canAttendMeetings(new int[][]{{9, 11}, {13, 14}, {10, 12}}));
    }
}
