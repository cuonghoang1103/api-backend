import java.util.*;

// LC 62 Unique Paths (2D table, then one row) + LC 63 Unique Paths II (obstacles).
public class HcUniquePaths {
    // #region bang
    static int uniquePaths(int m, int n) {
        int[][] dp = new int[m][n];            // dp[r][c] = ways to reach (r, c)
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                dp[r][c] = (r == 0 || c == 0) ? 1 : dp[r - 1][c] + dp[r][c - 1];
        return dp[m - 1][n - 1];
    }
    // #endregion

    // #region mot-hang
    static int uniquePaths1Row(int m, int n) {
        int[] row = new int[n];
        Arrays.fill(row, 1);                   // row 0: all ones
        for (int r = 1; r < m; r++)
            for (int c = 1; c < n; c++) row[c] += row[c - 1];
        return row[n - 1];
    }
    // #endregion

    // #region vat-can
    static int uniquePathsWithObstacles(int[][] g) {
        int n = g[0].length;
        int[] row = new int[n];
        row[0] = g[0][0] == 1 ? 0 : 1;
        for (int[] line : g)
            for (int c = 0; c < n; c++) {
                if (line[c] == 1) row[c] = 0;  // a rock: nobody gets through this cell
                else if (c > 0) row[c] += row[c - 1];
            }
        return row[n - 1];
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("uniquePaths(3, 7) = " + uniquePaths(3, 7) + "   one-row = " + uniquePaths1Row(3, 7));
        System.out.println("uniquePaths(3, 4) = " + uniquePaths(3, 4) + "   one-row = " + uniquePaths1Row(3, 4));
        System.out.println("uniquePaths(1, 1) = " + uniquePaths(1, 1) + "   uniquePaths(10, 10) = " + uniquePaths(10, 10));
        System.out.println("withObstacles([[0,0,0],[0,1,0],[0,0,0]]) = " + uniquePathsWithObstacles(new int[][]{{0,0,0},{0,1,0},{0,0,0}}));
        System.out.println("withObstacles([[0,1],[0,0]]) = " + uniquePathsWithObstacles(new int[][]{{0,1},{0,0}}) + "   withObstacles([[1]]) = " + uniquePathsWithObstacles(new int[][]{{1}}));
    }
}
