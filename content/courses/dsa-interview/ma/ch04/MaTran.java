import java.util.*;
import java.util.function.IntPredicate;

// LC 74 (row-major sorted = one sorted array) and LC 240 (staircase walk).
public class MaTran {
    static int probes = 0;
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (ok.test(mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
    }

    // #region lc74
    static boolean searchMatrix(int[][] M, int target) {        // LC 74
        int m = M.length, n = M[0].length;
        int k = firstTrue(0, m * n, i -> { probes++; return M[i / n][i % n] >= target; });
        return k < m * n && M[k / n][k % n] == target;
    }
    // #endregion

    // #region lc240
    static boolean searchMatrixII(int[][] M, int target) {      // LC 240
        int r = 0, c = M[0].length - 1;
        while (r < M.length && c >= 0) {
            probes++;
            if (M[r][c] == target) return true;
            if (M[r][c] > target) c--; else r++;
        }
        return false;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] A = {{2, 4, 7, 9}, {12, 15, 18, 21}, {25, 31, 40, 44}};
        for (int t : new int[]{7, 13, 44, 0, 50}) { probes = 0; boolean r = searchMatrix(A, t); System.out.println("LC 74  target=" + t + ": " + r + " (" + probes + " probes of 12 cells)"); }
        int[][] B = {{1, 5, 9, 14}, {3, 6, 11, 17}, {4, 8, 13, 20}, {10, 15, 19, 25}};
        for (int t : new int[]{8, 12, 25, 1}) { probes = 0; boolean r = searchMatrixII(B, t); System.out.println("LC 240 target=" + t + ": " + r + " (" + probes + " steps of 16 cells)"); }
        int[] flat = Arrays.stream(B).flatMapToInt(Arrays::stream).toArray();
        boolean sorted = true;
        for (int i = 1; i < flat.length; i++) if (flat[i - 1] > flat[i]) sorted = false;
        System.out.println("LC 240 matrix read row by row = " + Arrays.toString(flat) + "  -> sorted? " + sorted);
    }
}
