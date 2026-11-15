import java.util.*;

// LC 304 · Range Sum Query 2D - Immutable.
public class Prefix2D {
    // #region lop
    static class NumMatrix {
        private final int[][] P; // P[r][c] = sum of rows 0..r-1, cols 0..c-1

        NumMatrix(int[][] matrix) {
            int m = matrix.length, n = matrix[0].length;
            P = new int[m + 1][n + 1];
            for (int r = 0; r < m; r++)
                for (int c = 0; c < n; c++)
                    P[r + 1][c + 1] = matrix[r][c] + P[r][c + 1] + P[r + 1][c] - P[r][c];
        }

        int sumRegion(int r1, int c1, int r2, int c2) {
            return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1];
        }
    }
    // #endregion

    public static void main(String[] args) {
        int[][] M = {{3, 0, 1, 4}, {5, 6, 3, 2}, {1, 2, 0, 1}, {4, 1, 0, 1}};
        NumMatrix nm = new NumMatrix(M);
        System.out.println("P =");
        for (int[] row : nm.P) System.out.println("  " + Arrays.toString(row));
        int[][] qs = {{1, 1, 2, 2}, {0, 0, 3, 3}, {2, 1, 3, 3}, {0, 3, 0, 3}};
        for (int[] q : qs) {
            System.out.println("sumRegion(" + q[0] + ", " + q[1] + ", " + q[2] + ", " + q[3] + ") = " + nm.sumRegion(q[0], q[1], q[2], q[3]));
        }
    }
}
