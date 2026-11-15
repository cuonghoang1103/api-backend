import java.util.*;

// LC 1074 · Number of Submatrices That Sum to Target.
public class Luyen1074 {
    // #region giai
    static int numSubmatrixSumTarget(int[][] matrix, int target) {
        int m = matrix.length, n = matrix[0].length, count = 0;
        for (int top = 0; top < m; top++) {
            int[] col = new int[n];                      // column sums of rows top..bottom
            for (int bottom = top; bottom < m; bottom++) {
                for (int c = 0; c < n; c++) col[c] += matrix[bottom][c];
                Map<Integer, Integer> seen = new HashMap<>();
                seen.put(0, 1);                          // the empty prefix
                int sum = 0;
                for (int c = 0; c < n; c++) {
                    sum += col[c];
                    count += seen.getOrDefault(sum - target, 0);
                    seen.merge(sum, 1, Integer::sum);
                }
            }
        }
        return count;
    }
    // #endregion

    static int bruteWith2D(int[][] matrix, int target) {
        int m = matrix.length, n = matrix[0].length, count = 0;
        int[][] P = new int[m + 1][n + 1];
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) P[r + 1][c + 1] = matrix[r][c] + P[r][c + 1] + P[r + 1][c] - P[r][c];
        for (int r1 = 0; r1 < m; r1++)
            for (int r2 = r1; r2 < m; r2++)
                for (int c1 = 0; c1 < n; c1++)
                    for (int c2 = c1; c2 < n; c2++)
                        if (P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1] == target) count++;
        return count;
    }

    static String show(int[][] a) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) sb.append(i > 0 ? "," : "").append(Arrays.toString(a[i]));
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        int[][][] mats = {
            {{1, 2, -1}, {-1, 0, 2}, {3, -2, 1}},
            {{2, -2}, {-2, 2}},
            {{5}},
            {{1, 1, 1}, {1, 1, 1}},
        };
        int[] targets = {2, 0, 5, 2};
        for (int t = 0; t < mats.length; t++) {
            System.out.println("numSubmatrixSumTarget(" + show(mats[t]) + ", " + targets[t] + ") = "
                + numSubmatrixSumTarget(mats[t], targets[t]) + "   brute = " + bruteWith2D(mats[t], targets[t]));
        }
    }
}
