import java.util.*;

// LC 1029 · Two City Scheduling.
public class Luyen1029 {
    // #region giai
    static int twoCitySchedCost(int[][] costs) {
        int[][] s = costs.clone();                                   // shallow copy is enough: we only reorder rows
        Arrays.sort(s, (x, y) -> Integer.compare(x[0] - x[1], y[0] - y[1]));
        int n = s.length / 2, total = 0;
        for (int i = 0; i < n; i++) total += s[i][0] + s[i + n][1];
        return total;
    }
    // #endregion

    static int twoCityBrute(int[][] costs) {
        int m = costs.length, n = m / 2, best = Integer.MAX_VALUE;
        for (int mask = 0; mask < (1 << m); mask++) {
            if (Integer.bitCount(mask) != n) continue;
            int t = 0;
            for (int i = 0; i < m; i++) t += ((mask >> i) & 1) == 1 ? costs[i][0] : costs[i][1];
            best = Math.min(best, t);
        }
        return best;
    }

    static String show(int[][] a) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) sb.append(i > 0 ? "," : "").append(Arrays.toString(a[i]));
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        int[][][] cases = {
            {{50, 30}, {20, 80}, {60, 70}, {40, 10}},
            {{5, 9}, {8, 2}, {7, 7}, {1, 6}, {4, 4}, {9, 3}},
            {{100, 1}, {100, 2}, {3, 100}, {4, 100}},
            {{10, 10}, {10, 10}},
        };
        for (int[][] c : cases) {
            System.out.println("twoCitySchedCost(" + show(c) + ") = " + twoCitySchedCost(c) + "   brute = " + twoCityBrute(c));
        }
        int[][] order = cases[0].clone();
        Arrays.sort(order, (x, y) -> Integer.compare(x[0] - x[1], y[0] - y[1]));
        int[] diffs = new int[order.length];
        for (int i = 0; i < order.length; i++) diffs[i] = order[i][0] - order[i][1];
        System.out.println("sorted by a-b: " + show(order) + "  diffs = " + Arrays.toString(diffs));
    }
}
