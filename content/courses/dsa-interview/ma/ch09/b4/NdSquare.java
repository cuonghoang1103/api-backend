import java.util.*;

// LC 221 Maximal Square (state "ending here") and LC 120 Triangle (choose the order that makes the base trivial).
public class NdSquare {
    // #region square
    static int maximalSquare(char[][] matrix) {
        int R = matrix.length, C = matrix[0].length;
        int[][] dp = new int[R + 1][C + 1];       // dp[r+1][c+1] = side of the largest square with bottom-right (r, c)
        int best = 0;
        for (int r = 0; r < R; r++) {
            for (int c = 0; c < C; c++) {
                if (matrix[r][c] != '1') continue;
                dp[r + 1][c + 1] = 1 + Math.min(dp[r][c + 1], Math.min(dp[r + 1][c], dp[r][c]));
                best = Math.max(best, dp[r + 1][c + 1]);
            }
        }
        return best * best;
    }
    // #endregion

    // #region triangle
    static int minimumTotal(List<List<Integer>> triangle) {
        int n = triangle.size();
        int[] below = new int[n];
        for (int c = 0; c < n; c++) below[c] = triangle.get(n - 1).get(c);
        for (int r = n - 2; r >= 0; r--) {
            for (int c = 0; c <= r; c++) below[c] = triangle.get(r).get(c) + Math.min(below[c], below[c + 1]);
        }                                         // left to right is safe: below[c] is read before it is overwritten
        return below[0];
    }
    // #endregion

    public static void main(String[] args) {
        String[] rows = {"1101", "1111", "0111", "1111"};
        char[][] grid = new char[rows.length][];
        for (int i = 0; i < rows.length; i++) grid[i] = rows[i].toCharArray();
        System.out.println("maximalSquare([\"1101\",\"1111\",\"0111\",\"1111\"]) = " + maximalSquare(grid));
        System.out.println("maximalSquare([\"01\",\"10\"]) = " + maximalSquare(new char[][]{{'0', '1'}, {'1', '0'}}) + "   maximalSquare([\"0\"]) = " + maximalSquare(new char[][]{{'0'}}));
        List<List<Integer>> tri = List.of(List.of(5), List.of(9, 6), List.of(4, 6, 8), List.of(0, 7, 1, 5));
        System.out.println("minimumTotal(" + tri.toString().replace(" ", "") + ") = " + minimumTotal(tri));
        System.out.println("minimumTotal([[-3],[2,-1],[4,1,-9]]) = " + minimumTotal(List.of(List.of(-3), List.of(2, -1), List.of(4, 1, -9))));
    }
}
