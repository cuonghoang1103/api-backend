import java.util.*;

// LC 452 with the "obvious" comparator: two balloons far apart, one arrow — wrong.
public class ArrowsTran {
    static int arrows(int[][] points, Comparator<int[]> cmp) {
        int[][] s = points.clone();
        Arrays.sort(s, cmp);
        int arrows = 0; long shotAt = Long.MIN_VALUE;
        for (int[] p : s) if (p[0] > shotAt) { arrows++; shotAt = p[1]; }
        return arrows;
    }
    public static void main(String[] args) {
        // #region tran
        int[][] points = {{-2147483646, -2147483645}, {2147483646, 2147483647}};
        int wrong = arrows(points, (a, b) -> a[1] - b[1]);                  // -2147483645 - 2147483647 overflows
        int right = arrows(points, (a, b) -> Integer.compare(a[1], b[1]));
        System.out.println("comparator a[1] - b[1]            -> " + wrong + " arrow(s)");
        System.out.println("comparator Integer.compare(...)   -> " + right + " arrow(s)");
        System.out.println("-2147483645 - 2147483647 as int   =  " + (-2147483645 - 2147483647));
        // #endregion
    }
}
