import java.util.*;

// LC 309 Best Time to Buy and Sell Stock with Cooldown — state = "which situation am I in today".
public class NdCooldown {
    // #region giai
    static int maxProfit(int[] prices) {
        final int NEG = Integer.MIN_VALUE / 2;    // "impossible", with room left: NEG + price cannot overflow
        int hold = NEG, sold = NEG, rest = 0;
        for (int p : prices) {
            int h = Math.max(hold, rest - p);     // keep holding, or buy today (only from "rest")
            int s = hold + p;                     // sell today
            int r = Math.max(rest, sold);         // do nothing
            hold = h; sold = s; rest = r;
        }
        return Math.max(sold, rest);
    }
    // #endregion

    static int maxProfitNoCooldown(int[] prices) {
        final int NEG = Integer.MIN_VALUE / 2;
        int hold = NEG, free = 0;
        for (int p : prices) { int h = Math.max(hold, free - p), f = Math.max(free, hold + p); hold = h; free = f; }
        return free;
    }

    static int brute(int[] prices, int day, boolean holding, boolean cooling) {
        if (day == prices.length) return 0;
        int best = brute(prices, day + 1, holding, false);
        if (holding) best = Math.max(best, prices[day] + brute(prices, day + 1, false, true));
        else if (!cooling) best = Math.max(best, -prices[day] + brute(prices, day + 1, true, false));
        return best;
    }

    static long seed = 309;
    static int rnd(int m) { seed = (seed * 48271) % 2147483647L; return (int) (seed % m); }

    public static void main(String[] args) {
        int[][] tests = {{1, 2, 3, 0, 2}, {1}, {5, 4, 3, 2, 1}, {2, 1, 4, 5, 2, 9, 7}};
        for (int[] p : tests) System.out.println(Arrays.toString(p) + ": with cooldown " + maxProfit(p) + ", forgetting it " + maxProfitNoCooldown(p));
        int bad = 0;
        for (int t = 0; t < 2000; t++) {
            int[] p = new int[1 + rnd(9)];
            for (int i = 0; i < p.length; i++) p[i] = rnd(8);
            if (maxProfit(p) != brute(p, 0, false, false)) bad++;
        }
        System.out.println("random self-test vs brute force: 2000 cases, " + bad + " mismatches");
    }
}
