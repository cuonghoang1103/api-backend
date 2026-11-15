import java.util.*;

// LC 986 · Interval List Intersections — two pointers.
public class Intersections {
    // #region giai
    static int[][] intervalIntersection(int[][] A, int[][] B) {
        List<int[]> out = new ArrayList<>();
        int i = 0, j = 0;
        while (i < A.length && j < B.length) {
            int lo = Math.max(A[i][0], B[j][0]), hi = Math.min(A[i][1], B[j][1]);
            if (lo <= hi) out.add(new int[]{lo, hi});
            if (A[i][1] < B[j][1]) i++; else j++;
        }
        return out.toArray(new int[0][]);
    }
    // #endregion

    static String show(int[][] a) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) sb.append(i > 0 ? "," : "").append(Arrays.toString(a[i]));
        return sb.append("]").toString();
    }
    public static void main(String[] args) {
        System.out.println(show(intervalIntersection(new int[][]{{1, 4}, {6, 9}, {12, 15}}, new int[][]{{2, 6}, {9, 13}, {15, 18}})));
        System.out.println(show(intervalIntersection(new int[][]{{1, 3}, {5, 9}}, new int[0][])));
        System.out.println(show(intervalIntersection(new int[][]{{1, 7}}, new int[][]{{3, 10}})));
    }
}
