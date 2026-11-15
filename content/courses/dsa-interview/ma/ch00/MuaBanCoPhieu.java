import java.util.*;

public class MuaBanCoPhieu {
    // #region brute
    static int maxProfitBrute(int[] prices) {
        int best = 0;
        for (int i = 0; i < prices.length; i++)
            for (int j = i + 1; j < prices.length; j++)
                best = Math.max(best, prices[j] - prices[i]);
        return best;
    }
    // #endregion
    // #region tot
    static int maxProfit(int[] prices) {
        int minSoFar = Integer.MAX_VALUE;
        int best = 0;
        for (int p : prices) {
            if (minSoFar != Integer.MAX_VALUE) best = Math.max(best, p - minSoFar); // avoid p - MAX_VALUE overflow trap
            minSoFar = Math.min(minSoFar, p);
        }
        return best;
    }
    // #endregion
    public static void main(String[] args) {
        int[][] ps = {{7, 1, 5, 3, 6, 4}, {7, 6, 4, 3, 1}, {5}, {}, {2, 4, 1, 3}, {3, 3, 3}};
        int[] want = {5, 0, 0, 0, 2, 0};
        for (int k = 0; k < ps.length; k++) {
            int got = maxProfit(ps[k]), brute = maxProfitBrute(ps[k]);
            System.out.println(Arrays.toString(ps[k]) + " -> " + got + " (brute " + brute + ") "
                + (got == want[k] && brute == want[k] ? "OK" : "FAIL want " + want[k]));
        }
    }
}
